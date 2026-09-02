# Remote Station System Guide

## Overview

This guide covers the "remote station" role: a low-power computer running
multiple independent sensors (each polling at its own interval), buffering
their readings locally, and shipping them to the "base station system" once
network connectivity is available.

- **Broker:** local Mosquitto instance on the remote station. Every sensor
  publisher on the box talks to it over `localhost` — it is the local
  fan-in point and the thing that survives a sensor script crashing or
  restarting.
- **Publishers:** one small script per sensor, each with its own polling
  interval, each its own process/systemd unit. Independent sensors should
  stay independent processes — don't merge them into one polling loop.
- **Bridge:** Mosquitto's built-in bridge feature forwards everything from
  the local broker to a broker on the base station, and queues messages
  locally (per the durability notes below) whenever that link is down.

```
[sensor A]--\
[sensor B]---> local mosquitto (remote station) --bridge--> mosquitto (base station)
[sensor C]--/        ^ buffers here while base is unreachable
```

Reference hardware for the current build: Raspberry Pi Zero 2 W as the
remote station. Sections below also cover Debian Linux and OrangePi
(Armbian) since the sensor count / hardware mix is expected to grow beyond
one board type.

---

## Software Architecture

### Topic layout

One topic per sensor, JSON payload (matches the shape already used by
`server1.python`):

```
stations/<station_id>/<sensor_id>/reading
```

Example: `stations/backyard/bme280-1/reading` ->
`{"temperature": 21.4, "humidity": 47.2, "pressure": 1013.1, "timestamp": "2026-09-02T18:04:00+00:00"}`

Per-metric sub-topics (`.../temperature`, `.../humidity`, ...) are an
alternative if a consumer wants to subscribe to a single value, but for a
handful of sensors per station the single-JSON-per-reading topic is less
to configure and keeps each reading atomic.

### QoS and persistence

- Publishers connect with `clean_session=False` and publish at `QoS 1`, so
  the local broker keeps a reading queued for a given client ID even if
  that publisher process is briefly down.
- The bridge to the base station is configured the same way
  (`cleansession false`, QoS 1 topics) so readings queue locally when the
  base station or the network link is unreachable, and drain in order once
  the bridge reconnects.
- **Durability caveat:** Mosquitto keeps queued QoS 1/2 messages in memory
  and checkpoints them to its persistence file periodically
  (`autosave_interval`, default 1800s). A power loss between checkpoints
  can lose the most recent queued readings. For a Pi Zero 2 W on
  battery/PoE this is usually an acceptable tradeoff, but if bulletproof
  "never lose a reading" durability matters more than simplicity, lower
  `autosave_interval` (e.g. to 60s) or add a supplementary append-only log
  (JSONL or SQLite) written by each publisher as a belt-and-suspenders
  backup that's replayed manually after an outage.

### Sizing the local buffer

Rough sizing for "keep up to a week": `messages/day = sensors x (86400 /
poll_interval_s)`. At 5 sensors polling every 60s that's `5 x 1440 = 7200
messages/day`, ~50,000 for a week. Each JSON reading is well under 200
bytes, so a week of buffering is a few MB — trivial for the Zero 2 W's
storage, but set `max_queued_messages` in the bridge config with headroom
above your worst-case outage (see config below), not left at the Mosquitto
default (1000, which would only cover ~13 hours at the example rate above).

### Local broker config (remote station)

`/etc/mosquitto/conf.d/remote-station.conf`:

```
listener 1883 127.0.0.1
allow_anonymous true

persistence true
persistence_location /var/lib/mosquitto/
autosave_interval 60
```

Only `localhost` needs to reach this broker — the sensor publishers on the
same box. Nothing needs to open an inbound port on the remote station for
this to work, since the bridge below initiates the *outbound* connection
to the base station.

### Bridge config (remote station -> base station)

`/etc/mosquitto/conf.d/bridge-to-base.conf`:

```
connection base-station
address base.example.lan:1883
topic stations/# out 1

clientid remote-<station_id>-bridge
cleansession false
notifications false
try_private true
start_type automatic
restart_timeout 5 300
keepalive_interval 60

# Recommended once the link crosses an untrusted network (WiFi/cellular WAN):
# bridge_cafile /etc/mosquitto/ca_certificates/ca.crt
# remote_username remote-<station_id>
# remote_password <set via mosquitto_passwd on the base station>
```

`restart_timeout 5 300` backs off exponentially from 5s up to a 300s cap
between reconnect attempts, instead of hammering the base station while
it's down.

### Base station broker

The base station's Mosquitto needs an actual inbound listener (it's the
side accepting connections from one or more remote stations), plus
authentication since it may be reachable over WAN/cellular:

```
listener 1883 0.0.0.0
allow_anonymous false
password_file /etc/mosquitto/passwd
```

```
sudo mosquitto_passwd -c /etc/mosquitto/passwd remote-backyard
```

---

## Per-sensor publisher

One process per sensor, each with its own poll interval. Copy this
template per sensor and fill in `CONFIG` and `read_sensor()`:

```python
#!/usr/bin/env python3
"""Per-sensor MQTT publisher template — copy one of these per sensor."""
import json, time
from datetime import datetime, timezone
import paho.mqtt.client as mqtt

CONFIG = {
    "station_id": "backyard",
    "sensor_id": "bme280-1",
    "poll_interval_s": 60,
    "broker_host": "localhost",
    "broker_port": 1883,
}

def read_sensor():
    # Replace with the real sensor read, e.g. smbus2 + RPi.bme280
    # (see ../bme280/readme.md). Must return a JSON-serializable dict.
    raise NotImplementedError

def main():
    topic = f"stations/{CONFIG['station_id']}/{CONFIG['sensor_id']}/reading"
    client = mqtt.Client(
        client_id=f"{CONFIG['station_id']}-{CONFIG['sensor_id']}",
        clean_session=False,
    )
    client.connect(CONFIG["broker_host"], CONFIG["broker_port"], keepalive=60)
    client.loop_start()
    while True:
        try:
            data = read_sensor()
            data["timestamp"] = datetime.now(timezone.utc).isoformat()
            client.publish(topic, json.dumps(data), qos=1, retain=False)
        except Exception as e:
            print(f"[{CONFIG['sensor_id']}] read/publish failed: {e}")
        time.sleep(CONFIG["poll_interval_s"])

if __name__ == "__main__":
    main()
```

### Running each publisher as its own service

`/etc/systemd/system/sensor-publisher@.service` (a template unit — `%i` is
the script's base name):

```ini
[Unit]
Description=MQTT publisher for sensor %i
After=network-online.target mosquitto.service
Wants=network-online.target

[Service]
ExecStart=/home/pi/remote-system/.venv/bin/python3 /home/pi/remote-system/publishers/%i.py
Restart=on-failure
RestartSec=10
User=pi

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now sensor-publisher@bme280-1.service
sudo systemctl enable --now sensor-publisher@some-other-sensor.service
```

---

## OS / Hardware Setup

Each board/OS combination below only needs to handle: (1) installing
Mosquitto + Python, and (2) whatever that board's I/O interfaces
(I2C/SPI/etc.) need to be enabled for the sensors attached to it. Steps
that don't depend on the board are pulled out into "Common Setup" at the
end — run the board-specific section first, then Common Setup.

### Raspberry Pi OS (Bookworm, Pi Zero 2 W)

```bash
sudo apt update && sudo apt upgrade
sudo apt install mosquitto mosquitto-clients i2c-tools python3-venv python3-pip

# I2C is off by default on Raspberry Pi OS:
sudo raspi-config
# -> Interface Options -> I2C -> Yes
# headless equivalent: sudo raspi-config nonint do_i2c 0
sudo reboot

sudo systemctl enable --now mosquitto
```

Zero 2 W notes: Mosquitto itself is a few MB of RSS, so it's not the
constraint — the 512MB budget goes further if all the sensor publishers
share one Python venv (below) instead of each getting their own.

### Ubuntu Server 24.04 (Raspberry Pi image)

```bash
sudo apt update && sudo apt upgrade
sudo apt install mosquitto mosquitto-clients i2c-tools python3-venv python3-pip

# I2C ships enabled on Ubuntu's Pi images; confirm rather than assume:
grep i2c /boot/firmware/config.txt

# Ubuntu's cloud-init user isn't auto-added to the i2c group like PiOS's is:
sudo usermod -aG i2c $USER
sudo reboot

sudo systemctl enable --now mosquitto
```

### Debian Linux (generic — e.g. a Debian-based SBC, NUC, or as the base station)

This is the fallback section for any plain Debian/Ubuntu-family board with
no vendor-specific hardware-enable tool. If this box is acting as the
*base station* rather than a remote station, use the base station broker
config above (real listener + auth) instead of the remote station config.

```bash
sudo apt update && sudo apt upgrade
sudo apt install mosquitto mosquitto-clients python3-venv python3-pip
sudo systemctl enable --now mosquitto
```

If it also has directly-attached I2C/SPI sensors, enabling those
interfaces on generic Debian is hardware-specific (varies by kernel/device
tree for that board) — there's no single command; check that board's
vendor documentation for enabling the relevant kernel module/overlay.

### OrangePi (Armbian)

Armbian is Debian underneath, so the package-install steps are identical
to generic Debian — the differences are all in hardware bring-up, and none
of the Raspberry Pi tooling below applies:

- No `raspi-config`. Use `armbian-config` (System -> Hardware) to enable
  an I2C overlay, or edit `overlays=` directly in `/boot/armbianEnv.txt`
  and reboot.
- **Don't assume I2C bus 1** like on a Raspberry Pi — many OrangePi
  boards expose the enabled bus at `/dev/i2c-0` instead. Check both:
  ```bash
  i2cdetect -y 0
  i2cdetect -y 1
  ```
- The `i2c` group and `/dev/i2c-*` permissions usually work the same way
  as Debian/RPi once the overlay is enabled — confirm with `groups`
  rather than assuming.
- No PiSugar-equivalent is assumed here; if power-loss resilience matters
  for a given OrangePi board, check what UPS HAT options exist for it
  specifically.

```bash
sudo apt update && sudo apt upgrade
sudo armbian-config
# System -> Hardware -> enable the i2c overlay for your specific board
sudo reboot

sudo apt install i2c-tools mosquitto mosquitto-clients python3-venv python3-pip
i2cdetect -y 0
i2cdetect -y 1

sudo systemctl enable --now mosquitto
```

### Common Setup (any apt-based Debian/Ubuntu-family board)

Run after the board-specific section above has confirmed the sensor is
visible on the I2C bus (or whatever interface it uses).

```bash
cd /home/pi/remote-system   # or wherever this lives on the board
python3 -m venv .venv
source .venv/bin/activate
pip install paho-mqtt

# plus whatever each attached sensor needs, e.g.:
pip install smbus2 RPi.bme280
```

---

## Verification

On the remote station, confirm publishers are reaching the local broker:

```bash
mosquitto_sub -h localhost -t 'stations/#' -v
```

On the base station, confirm the bridge is delivering:

```bash
mosquitto_sub -h localhost -t 'stations/#' -v
```

Check bridge connection state / reconnect activity from either side's log:

```bash
grep -i bridge /var/log/mosquitto/mosquitto.log
```

To sanity-check how many messages are currently queued waiting for
delivery (useful right after a simulated outage):

```bash
mosquitto_sub -h localhost -t '$SYS/broker/messages/stored' -v
```

---

## Proposed File Layout

```
remote-system/
  readme.md
  mosquitto/
    remote-station.conf        # local broker config
    bridge-to-base.conf        # bridge config
  publishers/
    bme280-1.py                # one file per sensor, from the template above
    <other-sensor>.py
  systemd/
    sensor-publisher@.service
```

---

## Open Questions / Next Steps

- Confirm the base station's hostname/port and whether the bridge link
  needs TLS or a VPN (e.g. WireGuard) given the actual network path
  (WiFi vs. cellular modem).
- Decide the exact retention target (a day vs. a week) so
  `max_queued_messages` / `autosave_interval` can be sized deliberately
  rather than left at Mosquitto defaults.
- Decide whether any sensor's payload is worth a supplementary local
  JSONL/SQLite log for extra durability beyond Mosquitto's own
  persistence, per the durability caveat above.
