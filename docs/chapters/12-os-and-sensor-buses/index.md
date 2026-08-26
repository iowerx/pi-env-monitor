---
title: "The Station's Brain: Operating System, Command Line, and Sensor Buses"
description: What an operating system does, the Linux command line, running a program as a service, and the I2C, SPI, and UART buses that carry sensor data - ending at the BME280.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:41:43
version: 0.09
---
# The Station's Brain: Operating System, Command Line, and Sensor Buses

## Summary

This chapter turns the board from Chapter 3 into a working computer. It explains what an operating system does, introduces Ubuntu Server and Raspberry Pi OS, and teaches the command line: the file system, permissions, editors, shell commands, packages, and running a program as a systemd service so it survives a reboot. The second half covers the buses that carry sensor data — I2C with its device addressing, SPI, and serial UART — and ends at the BME280 itself, a single chip that combines three different sensing mechanisms from three earlier chapters.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Operating System
2. Ubuntu Server
3. Raspberry Pi OS
4. Command Line Interface
5. File System
6. File Permissions
7. Text Editor
8. Shell Command
9. Silicon Diode Sensor
10. Software Package
11. Systemd Service
12. BME280 Sensor
13. I2C Bus
14. SPI Bus
15. Serial UART
16. I2C Device Address
17. SIM7600A Module

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Electricity and the Single-Board Computer](../03-electricity-and-computer/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)
- [Chapter 5: Time and Place: Recording Where and When](../05-time-and-place/index.md)
- [Chapter 6: Temperature: From the Thermoscope to the Silicon Chip](../06-temperature/index.md)
- [Chapter 7: Barometric Pressure: The Weight of the Atmosphere](../07-barometric-pressure/index.md)
- [Chapter 8: Humidity and Dew Point: The Water Hidden in the Air](../08-humidity-and-dew-point/index.md)

---

## No Desktop, No Icons, No Mouse

Plug in the Raspberry Pi and connect to it. What you get is a screen that looks like this:

```
ubuntu@station01:~$
```

That is it. No windows. No icons. A blinking cursor.

This is not a stripped-down or broken version of a computer. It is what a computer looks like when nobody has bolted a picture of a desk onto the front of it. Most of the world's web servers present exactly this view, and they run everything you use.

For a monitoring station this is the right choice, and not only for tradition:

- **A graphical desktop wastes resources.** Drawing windows takes memory and processing power that a station in a box on a pole does not have to spare.
- **It wastes power**, which Chapter 16 will show is the scarcest resource in the whole project.
- **Nobody is looking at it.** A screen that no one will ever see is not worth generating.
- **It can be worked on remotely.** You connect over the network from your own laptop, and the command line works perfectly over a slow, unreliable link where a remote desktop would crawl.

This chapter is where you learn to work in that environment. It is genuinely different from using a phone or a laptop, and it is worth saying plainly: it feels awkward for about a week and then it feels faster than clicking.

## What an Operating System Actually Does

An **operating system** is the software that manages a computer's hardware and provides services that other programs use.

Without one, a program would have to know how to talk to every possible piece of hardware directly, manage its own memory, and take turns with other programs by mutual agreement. The operating system takes those jobs so that programs do not have to.

Its main responsibilities:

- **Managing hardware** — the processor, memory, storage, network, and the GPIO pins from Chapter 3
- **Running programs** — starting them, stopping them, and dividing processor time among them
- **Managing files** — organizing storage so programs can save and find data
- **Controlling access** — deciding which users and programs may do what
- **Providing an interface** — a way for a human to give instructions

Your station will run Linux, which is not exactly an operating system but a *kernel* — the core that manages hardware and processes. A complete usable system pairs that kernel with a large collection of supporting software, and such a combination is called a distribution.

Two distributions matter here.

**Raspberry Pi OS** is the official distribution from the Raspberry Pi Foundation, based on Debian Linux. It is tuned specifically for Raspberry Pi hardware and ships with excellent driver support for the GPIO, camera, and display connectors. It comes in a desktop version and a Lite version with no graphical interface at all. This is the friendliest starting point, and it is what this project's base station uses.

**Ubuntu Server** is a distribution from Canonical, also based on Debian, aimed at servers rather than desktops. It ships with no graphical interface at all. It has a large software ecosystem, long-term support releases with five or more years of security updates, and it is what a very large share of professional deployments run — so the skills transfer directly.

[Components Used](../../components.md) specifies Ubuntu 24.04 Server for the remote station and Raspberry Pi OS for the base station.

| | Raspberry Pi OS | Ubuntu Server |
|---|---|---|
| Maintained by | Raspberry Pi Foundation | Canonical |
| Based on | Debian | Debian |
| Graphical desktop | Optional | None |
| Hardware support on Pi | Best available | Very good |
| Support period | Follows Debian | 5+ years on LTS releases |
| Used in this project for | Base station | Remote station |
| Best for | Getting started; unusual Pi hardware | Long unattended deployment |

!!! tip "Either one works for learning"
    Almost everything in this chapter and the next is identical between them, because both are Debian underneath. If you already have Raspberry Pi OS running, do not reinstall — the commands are the same. The choice matters for a station meant to run untouched for years, where Ubuntu's long support window is worth having.

## The Command Line

A **command line interface** is a way of controlling a computer by typing commands as text rather than clicking on graphical objects.

Take the prompt apart:

```
ubuntu@station01:~$
```

- `ubuntu` — the user you are logged in as
- `@` — separator
- `station01` — the name of this computer
- `:` — separator
- `~` — where you currently are; the tilde means your home directory
- `$` — ready for a command. A `#` here would mean you are the superuser, which is worth noticing before you type anything.

A **shell command** is an instruction typed at the command line. The program that reads and runs them is called the shell, and the usual one is called bash.

Commands follow a consistent pattern:

```
command -options arguments
```

For example, `ls -l /home` runs the `ls` command with the `-l` option on the argument `/home`.

Here are the commands you will actually use in this project. This is not a complete list of anything — it is the working set.

| Command | Does | Example |
|---------|------|---------|
| `pwd` | Print working directory — where am I? | `pwd` |
| `ls` | List files | `ls -l` |
| `cd` | Change directory | `cd /home/ubuntu` |
| `mkdir` | Make a directory | `mkdir station-data` |
| `cat` | Show a file's contents | `cat readings.csv` |
| `head` | Show the first lines of a file | `head -5 readings.csv` |
| `tail` | Show the last lines | `tail -f readings.csv` |
| `cp` | Copy | `cp a.csv backup.csv` |
| `mv` | Move or rename | `mv old.csv new.csv` |
| `rm` | Remove — permanently | `rm junk.csv` |
| `nano` | Edit a text file | `nano logger.py` |
| `sudo` | Run a command as superuser | `sudo apt update` |
| `df -h` | Show free disk space | `df -h` |
| `man` | Show the manual for a command | `man ls` |

Two of those deserve immediate warnings.

!!! danger "rm does not have an undo"
    There is no recycle bin at the command line. `rm` deletes immediately and permanently. `rm -r` deletes a directory and everything inside it without asking. The command `sudo rm -rf /` will attempt to erase the entire system, and it is not a joke that people tell beginners for fun.

    Two habits worth forming now: before deleting anything, run `ls` on it first to confirm what you are about to remove; and use `rm -i`, which asks for confirmation on each file, until the command line feels natural.

The `tail -f` entry is the one you will use most while debugging. The `-f` means "follow" — it prints the end of a file and then keeps printing new lines as they are added. Point it at your data file and you can watch readings arrive live.

### The File System

A **file system** is the way an operating system organizes and stores files. Linux organizes everything into a single tree that starts at `/`, called the root.

There is no `C:` drive. Every storage device, including USB sticks and network shares, is attached somewhere into that one tree.

The directories that matter for this project:

```
/
├── home/
│   └── ubuntu/          <- your files live here; "~" means this
│       └── station/     <- where your logger and data will go
├── etc/                 <- system configuration files
│   └── systemd/system/  <- service definitions, later in this chapter
├── var/
│   └── log/             <- system log files
├── dev/                 <- devices appear here as files
│   ├── i2c-1            <- the I2C bus
│   └── ttyS0            <- a serial port
└── usr/                 <- installed programs
```

That `/dev` directory is worth pausing on, because it is a genuinely elegant idea. In Linux, **hardware devices appear as files**. The I2C bus shows up as `/dev/i2c-1`, and a program talks to it by opening and reading that file. A serial port is `/dev/ttyS0`. This means that the same read and write operations a program uses for data files also work for hardware, and it is why sensor code in Chapter 13 will look so much like file handling.

### File Permissions

**File permissions** control which users can read, write, or execute each file.

Every file has three permission groups, each with three permissions:

- **Owner** — the user who owns the file
- **Group** — a named group of users
- **Others** — everyone else

And for each: **r** for read, **w** for write, **x** for execute.

Running `ls -l` shows them:

```
-rw-r--r-- 1 ubuntu ubuntu 2048 Aug 25 14:30 readings.csv
```

Reading the permission block `-rw-r--r--` from left to right: the first character is the file type (`-` for a normal file, `d` for a directory). Then three characters for owner (`rw-` — read and write, no execute), three for group (`r--` — read only), and three for others (`r--` — read only).

Two permission problems will bite you in this project, and both look like software bugs:

1. **Your Python script will not run** because it lacks execute permission. Fix with `chmod +x logger.py`.
2. **Your program cannot read the I2C device** because your user is not in the `i2c` group. Fix with `sudo usermod -aG i2c ubuntu`, then log out and back in — group membership only takes effect on a new login, which is a detail that wastes a lot of time when overlooked.

#### Diagram: Command Line Sandbox

<iframe src="../../sims/command-line-sandbox/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Command Line Sandbox</summary>
Type: microsim
**sim-id:** command-line-sandbox<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Apply (L3)
Bloom Verb: execute

Learning objective: The learner executes shell commands to navigate a file system, inspect permissions, and locate station files, and applies the permission model to diagnose why a script will not run.

Purpose: The command line is unforgiving and beginners are afraid of it, which is rational given that `rm` has no undo. A sandbox with a realistic station file system lets students build fluency and make destructive mistakes with no consequences, before they touch a real Pi.

Canvas layout:
- Main area: a terminal emulator with the prompt `ubuntu@station01:~$`, command history, and scrollback
- Right or below (responsive): a live file-tree panel showing the simulated file system, with the current working directory highlighted so the learner can see where `cd` moved them
- Bottom: task list and a Reset button
- Responsive to window resize; the tree panel collapses under the terminal on narrow canvases

Simulated file system, matching the chapter's tree:
```
/
├── home/ubuntu/station/  containing logger.py (not executable), readings.csv, config.json
├── etc/systemd/system/   containing station-logger.service
├── var/log/
├── dev/                  containing i2c-1, ttyS0
└── usr/bin/
```

Supported commands, each producing realistic output: `pwd`, `ls`, `ls -l`, `cd`, `cat`, `head`, `tail`, `mkdir`, `cp`, `mv`, `rm`, `rm -r`, `chmod`, `df -h`, `man`, `clear`. Unsupported commands must return a helpful message naming the supported set rather than a bare error.

Data Visibility Requirements:
  Stage 1: `ls -l` output must render the full permission block, owner, group, size, and date in correct columns
  Stage 2: Hovering any permission block character shows a tooltip naming it, e.g. "w — the owner may write to this file"
  Stage 3: The file-tree panel highlights the current directory and updates on every `cd`
  Stage 4: After `chmod +x logger.py`, the permission block visibly changes and the tree marks the file as executable

Guided task list, checked off as completed:
1. Find out where you are (`pwd`)
2. Navigate to the station directory
3. List the files with their permissions
4. Show the last 5 lines of readings.csv
5. Discover why logger.py will not run, and fix it with chmod
6. Find the systemd service file
7. Check free disk space

Required safety demonstration: typing `rm readings.csv` must delete it from the simulated tree immediately with no confirmation, and display a red message: "Deleted. There is no recycle bin at the command line. In the sandbox you can press Reset. On a real station, that data is gone." Typing `rm -rf /` must trigger a full-screen warning explaining what that command does on a real system, without simulating it.

Instructional Rationale: The objective is Apply/execute, so the learner must type real commands and read real output rather than click through a demonstration. The paired terminal and file-tree view is the specific design choice that teaches navigation — beginners lose track of where they are, and seeing the tree highlight move with each `cd` builds the spatial model that `pwd` alone does not. The deletion demonstration is included because the consequence is the lesson, and a sandbox is the only safe place to experience it.

Implementation: p5.js with a text input field and a scrolling output buffer. Model the file system as a nested object with name, type, permissions, owner, size, and contents. Parse commands with a simple tokenizer; no real shell involved.
</details>

### Editing Files

A **text editor** is a program for creating and modifying plain text files. Your code, your configuration, and your service definitions are all plain text.

Use `nano`. It is simple, it ships with both distributions, and it shows its own keyboard shortcuts along the bottom of the screen.

```
nano logger.py
```

The essential keys, where `^` means the Ctrl key:

- `^O` then Enter — write out (save)
- `^X` — exit
- `^K` — cut the current line
- `^W` — search
- `^G` — help

You will hear about `vim` and `emacs`, which are powerful and have devoted followings. Neither is worth learning while you are also learning Linux, electronics, and Python. Use nano.

### Installing Software

A **software package** is a bundle containing a program, its configuration, and a description of what else it needs to run.

Debian-based systems use `apt` to manage packages, and it handles dependencies automatically — if the thing you asked for needs three other things, apt installs those too.

```
sudo apt update
sudo apt install python3-pip i2c-tools
```

The first line refreshes the list of what is available. The second installs two packages. **Always run `apt update` before installing**, or apt will work from a stale catalogue and may fail to find a package that exists.

The `i2c-tools` package matters immediately: it contains `i2cdetect`, the utility that tells you whether your sensor is wired correctly, which is the single most useful debugging tool in this project.

## Making It Run Forever

Here is a problem you will hit as soon as your logger works.

You start the program from the command line. It runs beautifully. Then you close your connection to the Pi, and the program stops. Or the power flickers, the Pi reboots, and nothing restarts.

A station that only runs while you are watching it is not a station.

A **systemd service** is a program managed by the operating system's service manager, which can start it automatically at boot, restart it if it crashes, and keep it running after you disconnect.

Systemd is the program that manages everything running on a modern Linux system. You describe your program to it in a small text file called a unit file, placed in `/etc/systemd/system/`.

Before the file below, here is what each part will do. `Description` is a human-readable label. `After=network.target` tells systemd to wait until networking is available. `ExecStart` is the exact command to run. `Restart=always` tells systemd to start the program again if it ever exits. `RestartSec=10` waits ten seconds before retrying, so a program failing instantly does not spin the processor. `WantedBy=multi-user.target` means "start this when the system reaches normal running state."

```ini
[Unit]
Description=Environmental Monitoring Station Logger
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/station
ExecStart=/usr/bin/python3 /home/ubuntu/station/logger.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Save that as `/etc/systemd/system/station-logger.service`, then:

```
sudo systemctl daemon-reload
sudo systemctl enable station-logger
sudo systemctl start station-logger
sudo systemctl status station-logger
```

Those four commands, in order: reload systemd's configuration so it notices the new file; mark the service to start at boot; start it now; and show whether it is running.

`journalctl -u station-logger -f` shows the service's live output, which is where anything your program prints will end up once it is no longer attached to your terminal.

!!! tip "Test the reboot before you trust it"
    The whole point of a service is surviving a restart, so verify that it does. Run `sudo reboot`, wait a minute, reconnect, and run `systemctl status station-logger`. If it is running, your station will come back on its own after a power cut in the field. If you skip this test, you will find out the hard way, three weeks later, with a gap in your data.

## Buses: How Sensors Talk

Chapter 3 introduced GPIO pins as software-controlled connections. Reading a sensor through raw pins would mean managing voltage timing yourself, which is possible and unpleasant. A **bus** removes that work: it is a shared set of wires plus an agreed protocol for how devices take turns talking on them.

Three buses are available on the Raspberry Pi's header.

### I2C

The **I2C bus** — Inter-Integrated Circuit, pronounced "eye-squared-see" — is a two-wire bus that lets one controller communicate with many devices.

The two wires:

- **SDA** (Serial Data) — carries the data, in both directions
- **SCL** (Serial Clock) — carries the timing signal the controller generates

Both need the pull-up resistors from Chapter 3, and both are usually supplied on the breakout board.

I2C is the right choice for this project because it is economical with pins. Two wires plus power and ground handle every sensor you might add, however many there are.

That works because of addressing. An **I2C device address** is a number, usually 7 bits, that uniquely identifies a device on the bus. The controller broadcasts an address, and only the device with that address responds. Everything else stays silent.

This creates the one rule that matters: **no two devices on the same bus may share an address.** Most sensor chips offer a choice of two addresses, selected by tying a pin high or low, so you can run two identical sensors. Beyond two, you need a second bus or an I2C multiplexer.

The BME280 uses address `0x76` or `0x77` — hexadecimal, base 16, which is the conventional way to write these. Which one depends on how the breakout board wires its address pin, and it varies by manufacturer.

Enable I2C and check your wiring in two commands:

```
sudo raspi-config      # Interface Options -> I2C -> Enable
i2cdetect -y 1
```

The output is a grid of addresses, with detected devices shown:

```
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:                         -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
...
70: -- -- -- -- -- -- 76 --
```

That `76` is your BME280 answering. This one command is the fastest possible answer to "is my sensor wired correctly," and it separates a wiring problem from a code problem in about two seconds.

!!! warning "If i2cdetect shows nothing"
    An empty grid means the Pi cannot see the sensor at all, and the cause is almost always physical rather than software. Check in this order:

    1. **Ground.** As Chapter 3 said, check ground first. It is the most common fault.
    2. **Power.** Is the red wire on pin 1 (3.3 V), and is it seated firmly?
    3. **SDA and SCL swapped.** Pin 3 is SDA, pin 5 is SCL. They are adjacent and easy to reverse.
    4. **I2C not enabled.** Run `sudo raspi-config` and check.
    5. **Wrong bus number.** Try `i2cdetect -y 0` as well as `-y 1`.
    6. **Missing pull-up resistors** on a bare chip without a breakout board.

    If `i2cdetect` shows the device, your wiring is correct and any remaining problem is in your code. That is a genuinely valuable thing to know before you start debugging Python.

### SPI and UART

Two other buses exist on the same header, and it is worth knowing when each is right.

The **SPI bus** — Serial Peripheral Interface — uses four wires: data out, data in, a clock, and a separate chip-select line per device. It is considerably faster than I2C and it is full duplex, meaning data can travel both directions at once. The cost is pins: every additional device needs its own chip-select line. SPI is the right choice for high-speed devices like displays and SD cards. The BME280 supports it as an alternative.

**Serial UART** — Universal Asynchronous Receiver/Transmitter — is the oldest of the three and uses two wires, transmit and receive. There is no shared clock; both ends must be configured to the same speed, called the baud rate. It is a point-to-point connection between exactly two devices, not a shared bus.

UART matters here because of one specific part. The **SIM7600A module** is the cellular and GNSS module in this project's parts list. It provides the mobile data link that Chapter 16 uses for telemetry and the GPS receiver that Chapter 5 described, and it communicates over serial UART using AT commands — text instructions sent as plain strings, a convention inherited from telephone modems of the 1980s.

| | I2C | SPI | UART |
|---|---|---|---|
| Wires | 2 | 4 or more | 2 |
| Devices per bus | Many, by address | Many, one select pin each | Exactly 2 |
| Speed | 100–400 kHz typical | Several MHz | 9,600–115,200 baud typical |
| Shared clock | Yes | Yes | No |
| Needs pull-ups | Yes | No | No |
| Pin cost | Very low | High | Low |
| Used in this project for | BME280 and other sensors | Not used | SIM7600A cellular and GPS |

#### Diagram: I2C Bus Explorer

<iframe src="../../sims/i2c-bus-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>I2C Bus Explorer</summary>
Type: microsim
**sim-id:** i2c-bus-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: examine

Learning objective: The learner examines an I2C transaction to explain how addressing lets many devices share two wires, and diagnoses common bus faults from the resulting symptoms.

Purpose: I2C is invisible — two wires and nothing observable. When a sensor fails to appear, students have no mental model to debug against. Making the address broadcast and the device responses visible turns i2cdetect output from a mystery into a readable result.

Canvas layout:
- Upper area: a schematic showing the Raspberry Pi as controller, two SDA and SCL lines running horizontally, pull-up resistors to 3.3 V, and three sensor devices tapped onto the lines, each labeled with its address
- Middle: a logic-analyzer style timing view showing SDA and SCL as square waves for the current transaction, with each phase labeled
- Lower: a simulated i2cdetect output grid that updates to match the current bus configuration
- Right or below (responsive): a step description panel and fault controls
- Responsive to window resize

Data Visibility Requirements:
  Stage 1: Idle. Both lines held high by the pull-ups. Caption: "Pull-up resistors hold both lines high when nobody is talking."
  Stage 2: Start condition. Show SDA going low while SCL is high, labeled "START — the controller claims the bus"
  Stage 3: Address broadcast. Show the 7 address bits clocked out one at a time, with the binary value building up and its hex equivalent displayed, e.g. "1110110 = 0x76"
  Stage 4: Every device compares. Highlight all three devices, showing each one's address next to the broadcast address, with two greying out and one lighting up. Caption: "Only the device whose address matches will answer."
  Stage 5: Acknowledge. Show the matched device pulling SDA low for one clock, labeled "ACK — device 0x76 is here"
  Stage 6: Data transfer, then a STOP condition

Fault injection controls, each producing a realistic symptom and a diagnostic message:
- **Remove ground wire** — no device responds; i2cdetect grid goes empty. Message: "No ground means no complete circuit. Check ground first, always."
- **Swap SDA and SCL** — no response; grid empty. Message: "Pin 3 is SDA, pin 5 is SCL. They are adjacent on the header."
- **Remove pull-up resistors** — lines float; the timing view shows erratic levels; detection is unreliable. Message: "Without pull-ups, the lines never settle high. Most breakout boards include these."
- **Set two devices to the same address** — both acknowledge simultaneously, the timing view shows a collision, and reads return corrupted data. Message: "Two devices answering at once. Every device on a bus needs a unique address."
- **Unpowered device** — that device disappears from the grid while others remain, which is the fault that looks most like a code bug.

Interactive controls:
- Add or remove devices, and set each device's address from a dropdown of realistic sensor addresses
- Speed control for stepping through the transaction: step-by-step, slow, or normal
- "Run i2cdetect" button that sweeps all addresses and fills in the grid, exactly as the real tool does

Instructional Rationale: The objective is Analyze/examine, which requires inspecting a process rather than watching it. Step-by-step control with the address building bit by bit is what makes "the controller broadcasts an address" concrete. The fault injection set is chosen to match the numbered troubleshooting list in the chapter text, so the learner practises the same diagnostic sequence they will use at the bench.

Implementation: p5.js. Model the transaction as a state machine over discrete bit-clock steps so the learner can step forward and backward. Render SDA and SCL as square waveforms built from the same state sequence.
</details>

## The BME280

Everything now converges on one chip.

The **BME280 sensor** is a combined environmental sensor from Bosch Sensortec that measures temperature, barometric pressure, and relative humidity in a single package about 2.5 mm square.

Inside it are three separate sensing elements, each of which you have already met:

1. **Pressure** — a MEMS silicon diaphragm using the **piezoresistive effect** from Chapter 7. Air pressure flexes the diaphragm; flexing changes resistance.
2. **Humidity** — a **capacitive humidity sensor** from Chapter 8. A polymer film absorbs water vapor, changing the capacitance between electrodes.
3. **Temperature** — a **silicon diode sensor**, the mechanism Chapter 6 identified. A diode's forward voltage falls by roughly 2 millivolts per degree Celsius, a small and highly predictable shift.

The temperature element has a second job that is easy to miss. Both the pressure and humidity elements are themselves temperature-sensitive, so their raw readings would drift with temperature even at constant pressure and humidity. The chip measures its own temperature and uses it to compensate the other two. This means **the temperature reading is not optional** — even a program that only wants pressure must read temperature first, because the pressure compensation formula requires it.

Key specifications, which are the Chapter 4 datasheet questions answered:

| Specification | Value |
|---------------|-------|
| Temperature range | −40 to 85 °C |
| Temperature accuracy | ±1.0 °C |
| Pressure range | 300 to 1100 hPa |
| Pressure accuracy | ±1 hPa |
| Pressure resolution | 0.18 Pa |
| Humidity range | 0 to 100 percent RH |
| Humidity accuracy | ±3 percent RH |
| Humidity response time | About 1 second |
| Supply voltage | 1.71 to 3.6 V |
| Current, weather mode | About 3.6 µA |
| Interface | I2C or SPI |
| I2C address | 0x76 or 0x77 |

Two of those rows deserve comment.

The pressure resolution of 0.18 Pa alongside an accuracy of ±1 hPa is exactly the situation Chapter 2 warned about. The sensor reports steps 500 times finer than its absolute accuracy. Those fine steps are genuinely useful for detecting small *changes* over minutes, where the constant part of the error cancels — which is what Chapter 15's pressure tendency calculation relies on. They are not useful for reporting absolute pressure to three decimal places.

The current draw of about 3.6 microamperes is remarkably low, and Chapter 16 will show why that matters. A sensor that sips power is a sensor that can run on a small solar panel through a week of overcast weather.

#### Diagram: Inside the BME280

<iframe src="../../sims/inside-the-bme280/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Inside the BME280</summary>
Type: infographic
**sim-id:** inside-the-bme280<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Understand (L2)
Bloom Verb: summarize

Learning objective: The learner summarizes how three separate transduction mechanisms coexist on one chip, and explains why the temperature element is required even by a program that only wants pressure.

Purpose: This is the payoff diagram for Chapters 6, 7, and 8. Each mechanism was taught in isolation; here the learner sees all three in one package and, critically, sees the temperature compensation path that connects them — which is the source of a real and confusing class of bug.

Layout: A cutaway view of the BME280 package, drawn schematically and not to scale, with three sensing elements arranged inside, a shared ADC block, a compensation block, and an I2C/SPI interface block. Signal paths are drawn as arrows between blocks. All positions computed as fractions of canvas dimensions; responsive to window resize.

Clickable hotspots, each opening an infobox:
1. **Pressure element** — "A silicon diaphragm a few micrometres thick over a sealed cavity. Air pressure flexes it; the piezoresistive effect turns that flex into a resistance change. Chapter 7."
2. **Humidity element** — "A polymer film between two electrodes. It absorbs water vapor from the air, changing the capacitance. Chapter 8."
3. **Temperature element** — "A silicon diode. Its forward voltage falls about 2 mV per degree Celsius. Chapter 6." The infobox must add: "This element has a second job. See the compensation path."
4. **ADC block** — "One analog-to-digital converter, shared. Each element is sampled in turn and quantized to a digital value. Chapter 4."
5. **Calibration registers** — "Factory-measured constants unique to this individual chip, burned in at manufacture. Your code must read these before any reading means anything."
6. **Compensation block** — "Raw counts are not physical units. The compensation formulas turn them into hPa, percent RH, and degrees Celsius — and they need the temperature as an input."
7. **Interface block** — "Speaks I2C at address 0x76 or 0x77, or SPI. Chapter 12."

Required interactive demonstration — "Trace a reading": a step-through that follows one measurement end to end, with concrete values shown at each stage:
  Stage 1: "Air at 1013.2 hPa presses on the diaphragm"
  Stage 2: "Diaphragm flexes; piezoresistive elements change resistance"
  Stage 3: "ADC samples: raw value 415,148 counts"
  Stage 4: "Raw counts mean nothing yet. Read calibration registers dig_P1 through dig_P9."
  Stage 5: "Compensation formula needs t_fine, derived from the temperature reading. Temperature is 21.4 °C."
  Stage 6: "Compensated result: 101,320 Pa = 1013.2 hPa"
  Stage 7: "Divide by 100 for hPa. Store with units."

Required fault demonstration — a "skip the temperature read" toggle. With it on, the trace must show the compensation step using a stale or default temperature, and the final pressure output drifting as the simulated ambient temperature is changed with a slider. Caption: "The pressure element is temperature-sensitive by design. Skip the temperature read and your pressure will drift with the room. This looks like a broken sensor and is not."

Interactive features:
- Hover any block: it highlights along with every signal path connected to it
- Click: infobox opens; explored blocks are marked
- "Trace a reading" step-through with Next and Previous
- "Skip the temperature read" fault toggle with an ambient temperature slider
- A package-size overlay showing the chip drawn at true scale beside a grain of rice, since students consistently overestimate its size

Instructional Rationale: The objective is Understand/summarize, and summarizing across three prior chapters requires seeing the parts in one frame. The step-through trace with real numeric values at every stage is what turns "the chip does compensation" into something the learner can reason about. The skip-the-temperature fault is included because it is a genuine bug students hit, it produces a symptom that looks like hardware failure, and experiencing it here is far cheaper than debugging it in the field.

Implementation: p5.js. Draw blocks as labeled rectangles with bezier signal paths. Implement the compensation trace with the actual Bosch compensation formula structure so the intermediate values are realistic.
</details>

!!! warning "BMP280 is not BME280"
    Bosch makes a closely related part called the **BMP280**. It looks nearly identical, uses the same addresses, and works with similar code. It has **no humidity sensor**.

    Cheap listings sometimes mislabel one as the other, and the symptom is confusing: temperature and pressure work perfectly while humidity returns zero or nonsense. The chip's ID register distinguishes them — 0x60 for the BME280 and 0x58 for the BMP280 — and most Python libraries will report it. Check this before assuming your humidity code is broken.

## Key Takeaways

- An **operating system** manages hardware, runs programs, organizes files, and controls access. **Raspberry Pi OS** and **Ubuntu Server** are both Debian-based; this project uses Ubuntu Server on the remote station.
- The **command line interface** is faster over slow links and wastes no power drawing a desktop nobody sees.
- The **file system** is a single tree from `/`. Hardware devices appear as files under `/dev`, which is why sensor code resembles file handling.
- **File permissions** control read, write, and execute for owner, group, and others. Group membership changes require a new login.
- A **text editor** — use `nano` — edits the plain text files that hold your code and configuration. A **software package** is installed with `apt`, always after `apt update`.
- A **systemd service** starts your logger at boot, restarts it on failure, and keeps it running after you disconnect. Test it by rebooting.
- The **I2C bus** carries data on two wires using an **I2C device address** per device. `i2cdetect` separates wiring faults from code faults instantly. **SPI bus** is faster but pin-hungry; **serial UART** is point-to-point and connects the **SIM7600A module**.
- The **BME280 sensor** combines a piezoresistive pressure element, a capacitive humidity element, and a **silicon diode sensor** for temperature — which also compensates the other two.

## Check Yourself

??? question "Your program runs fine, but stops when you close your terminal. Why, and what fixes it? Click to check."
    The program is a child of your login session, so when the session ends the program is terminated with it. The fix is a **systemd service**: define a unit file in `/etc/systemd/system/`, then `enable` it so it starts at boot and `start` it now. Systemd owns the process instead of your session, so it survives disconnection, and with `Restart=always` it also survives crashes and reboots.

??? question "`i2cdetect -y 1` shows an empty grid. Is your Python code broken? Click to check."
    Almost certainly not — the problem is physical. `i2cdetect` talks to the bus directly and never touches your code, so an empty grid means the Pi cannot see the sensor at all. Work through the list: ground first, then power, then whether SDA and SCL are swapped, then whether I2C is enabled in `raspi-config`. Debugging Python before `i2cdetect` shows the device is wasted effort.

??? question "You want to add a second BME280. What is the constraint? Click to check."
    Both devices must have **different I2C addresses**, because two devices answering the same address collide and corrupt the data. The BME280 offers 0x76 and 0x77, selected by tying its address pin high or low, so two are possible. A third would require a second I2C bus or an I2C multiplexer chip.

??? question "Your pressure readings drift with the temperature of the room. Is the pressure sensor faulty? Click to check."
    Probably not — it may be a code problem. The BME280's pressure element is temperature-sensitive by design, and the chip provides a compensation formula that requires the current temperature reading as an input. If your code reads pressure without first reading temperature, or ignores the compensation parameters stored in the chip's calibration registers, the output will drift with temperature exactly as described. Read temperature first, always.

---

## What Is Next

You have a computer that boots, a command line to work in, a service manager to keep programs running, and a sensor the Pi can see on the bus. The remaining gap is the program itself.

Chapter 13 teaches enough Python to read that sensor and act on the result: variables and data types, functions, loops, conditionals, and libraries — which is how a sensor becomes three lines of code instead of three hundred. It closes with exception handling, because a sensor that fails to respond at three in the morning should not take down the whole station.
