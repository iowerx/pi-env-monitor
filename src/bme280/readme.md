# BME280 Guide

## Overview

This guide provides instructions, scripts, and programs to check and configure the Bosch BME280 temperature/pressure/humidity sensor.

---

## BME280 Sensor Node Setup

### Correct Libraries (both OS versions)

- **Use:** `smbus2` + `RPi.bme280`
- **Avoid:** `bme280` (wrong package), `pimoroni-bme280`, `wiringpi`

### Working Sensor Script

```python
import smbus2
import bme280

bus = smbus2.SMBus(1)
address = 0x77  # or 0x76 if ADDR pin pulled low

calibration_params = bme280.load_calibration_params(bus, address)
data = bme280.sample(bus, address, calibration_params)

print(f"Temperature: {data.temperature:.2f} °C")
print(f"Humidity:    {data.humidity:.2f} %")
print(f"Pressure:    {data.pressure:.2f} hPa")
```

### Wiring (I2C)

| BME280     | Pi Pin            |
|------------|-------------------|
| VCC        | Pin 1 (3.3V)      |
| GND        | Pin 6 (GND)       |
| SCK        | Pin 5 (SCL, BCM 3)|
| MOSI       | Pin 3 (SDA, BCM 2)|
| MISO/ADDR  | NC                |
| CS         | NC                |

---

## PiOS Configuration

### Enable I2C

```bash
sudo raspi-config
# Interfacing Options → I2C → Yes
sudo reboot
```

### Install Libraries

```bash
sudo apt install python3-smbus i2c-tools python3-pip
pip3 install smbus2 RPi.bme280 --break-system-packages
```

### Verify Sensor Detected

```bash
sudo i2cdetect -y 1
# Should show 77 at address 0x77
```

### Switch to Graphical Boot

```bash
sudo systemctl set-default graphical.target
sudo reboot
```

---

## Ubuntu Server 24.04 Configuration

### Install Dependencies

```bash
sudo apt install i2c-tools python3-pip python3-venv python3-smbus
```

### Set Up Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install smbus2 RPi.bme280
```

### Fix I2C Permissions

```bash
sudo usermod -aG i2c pi
sudo reboot
# verify with: groups
```

### If i2c Group Doesn't Exist

```bash
sudo groupadd i2c
sudo chown root:i2c /dev/i2c-1
sudo chmod g+rw /dev/i2c-1
sudo usermod -aG i2c pi
sudo reboot
```

---

## Software Architecture

### Protocol: HTTP Polling

- Sensor serves JSON on port 8080
- Display polls every 30 seconds
- Both nodes log to CSV

### Sensor Server Script

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
import smbus2, bme280, json, threading, time
from datetime import datetime
import csv, os

bus = smbus2.SMBus(1)
address = 0x77
calibration_params = bme280.load_calibration_params(bus, address)

latest = {}

def read_sensor():
    while True:
        data = bme280.sample(bus, address, calibration_params)
        latest.update({
            "temperature": round(data.temperature, 2),
            "humidity":    round(data.humidity, 2),
            "pressure":    round(data.pressure, 2),
            "timestamp":   datetime.now().isoformat()
        })
        file_exists = os.path.isfile('sensor_log.csv')
        with open('sensor_log.csv', 'a', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=latest.keys())
            if not file_exists:
                writer.writeheader()
            writer.writerow(latest)
        time.sleep(60)

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(latest).encode())
    def log_message(self, format, *args):
        pass

threading.Thread(target=read_sensor, daemon=True).start()
HTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
```

### Display Node Script (Tkinter)

```python
import tkinter as tk
from tkinter import font
import urllib.request, json
from datetime import datetime
import csv, os, threading

SENSOR_URL = "http://SENSOR_IP:8080"  # ← change this
POLL_INTERVAL = 30
CSV_FILE = "sensor_log.csv"

def c_to_f(c):
    return round((c * 9/5) + 32, 2)

def hpa_to_inhg(hpa):
    return round(hpa * 0.02953, 2)

class WeatherDisplay(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Weather Station")
        self.configure(bg="#1a1a2e")
        self.attributes("-fullscreen", True)
        self.bind("<Escape>", lambda e: self.attributes("-fullscreen", False))
        self.bind("q", lambda e: self.destroy())

        self.temp_c_var     = tk.StringVar(value="--.-°C")
        self.temp_f_var     = tk.StringVar(value="--.-°F")
        self.humid_var      = tk.StringVar(value="--.-% RH")
        self.press_hpa_var  = tk.StringVar(value="---.- hPa")
        self.press_inhg_var = tk.StringVar(value="--.-- inHg")
        self.status_var     = tk.StringVar(value="Connecting...")
        self.time_var       = tk.StringVar()

        self._build_ui()
        self._poll()
        self._tick()

    def _build_ui(self):
        big   = font.Font(family="DejaVu Sans", size=64, weight="bold")
        med   = font.Font(family="DejaVu Sans", size=36)
        sub   = font.Font(family="DejaVu Sans", size=28)
        small = font.Font(family="DejaVu Sans", size=18)
        tiny  = font.Font(family="DejaVu Sans", size=14)

        tk.Label(self, text="🌡 Temperature",
                 font=small, bg="#1a1a2e", fg="#aaaaaa").pack(pady=(30, 0))
        temp_frame = tk.Frame(self, bg="#1a1a2e")
        temp_frame.pack()
        tk.Label(temp_frame, textvariable=self.temp_c_var,
                 font=big, bg="#1a1a2e", fg="#ff6b6b").pack(side="left", padx=30)
        tk.Frame(temp_frame, bg="#333355", width=2).pack(side="left", fill="y", pady=5)
        tk.Label(temp_frame, textvariable=self.temp_f_var,
                 font=big, bg="#1a1a2e", fg="#ff9f43").pack(side="left", padx=30)

        tk.Frame(self, bg="#333355", height=2).pack(fill="x", padx=60, pady=15)

        tk.Label(self, text="💧 Humidity",
                 font=small, bg="#1a1a2e", fg="#aaaaaa").pack()
        tk.Label(self, textvariable=self.humid_var,
                 font=med, bg="#1a1a2e", fg="#4ecdc4").pack(pady=(0, 15))

        tk.Frame(self, bg="#333355", height=2).pack(fill="x", padx=60, pady=15)

        tk.Label(self, text="🔵 Pressure",
                 font=small, bg="#1a1a2e", fg="#aaaaaa").pack()
        press_frame = tk.Frame(self, bg="#1a1a2e")
        press_frame.pack()
        tk.Label(press_frame, textvariable=self.press_hpa_var,
                 font=sub, bg="#1a1a2e", fg="#45b7d1").pack(side="left", padx=30)
        tk.Frame(press_frame, bg="#333355", width=2).pack(side="left", fill="y", pady=5)
        tk.Label(press_frame, textvariable=self.press_inhg_var,
                 font=sub, bg="#1a1a2e", fg="#a29bfe").pack(side="left", padx=30)

        tk.Frame(self, bg="#333355", height=2).pack(fill="x", padx=60, pady=15)

        tk.Label(self, textvariable=self.time_var,
                 font=tiny, bg="#1a1a2e", fg="#666688").pack()
        tk.Label(self, textvariable=self.status_var,
                 font=tiny, bg="#1a1a2e", fg="#666688").pack()

    def _poll(self):
        def fetch():
            try:
                with urllib.request.urlopen(SENSOR_URL, timeout=5) as r:
                    data = json.loads(r.read())
                tc  = data['temperature']
                hpa = data['pressure']
                self.temp_c_var.set(f"{tc}°C")
                self.temp_f_var.set(f"{c_to_f(tc)}°F")
                self.humid_var.set(f"{data['humidity']}% RH")
                self.press_hpa_var.set(f"{hpa} hPa")
                self.press_inhg_var.set(f"{hpa_to_inhg(hpa)} inHg")
                self.status_var.set(f"Last update: {data['timestamp'][:19]}")
                self._log_csv(data)
            except Exception as e:
                self.status_var.set(f"⚠ Sensor offline: {e}")
            self.after(POLL_INTERVAL * 1000, self._poll)
        threading.Thread(target=fetch, daemon=True).start()

    def _log_csv(self, data):
        file_exists = os.path.isfile(CSV_FILE)
        with open(CSV_FILE, 'a', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=data.keys())
            if not file_exists:
                writer.writeheader()
            writer.writerow(data)

    def _tick(self):
        self.time_var.set(datetime.now().strftime("%A %d %B %Y  %H:%M:%S"))
        self.after(1000, self._tick)

WeatherDisplay().mainloop()
```

### Autostart on Boot (Display Node)

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/weather.desktop
```

```ini
[Desktop Entry]
Type=Application
Name=Weather Display
Exec=bash -c "source /home/pi/.venv/bin/activate && python3 /home/pi/weather_display.py"
X-GNOME-Autostart-enabled=true
```

---

## Node Summary

|                | Sensor Node              | Display Node          |
|----------------|--------------------------|-----------------------|
| **Hardware**   | Pi Zero + BME280 + PiSugar | Pi or any PC        |
| **OS**         | PiOS or Ubuntu 24.04     | GUI-enabled OS        |
| **Runs**       | Sensor server script     | weather_display.py    |
| **Needs**      | `smbus2`, `RPi.bme280`   | stdlib only (`tkinter`, `urllib`) |
| **Logs**       | sensor_log.csv           | sensor_log.csv (copy) |
