# Quiz: The Station's Brain: Operating System, Command Line, and Sensor Buses

Test your understanding of operating systems, the Linux command line, file permissions, systemd services, the I2C, SPI, and UART buses, and the BME280 with these review questions.

!!! mascot-tip "Wiring or Code?"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Many station problems come down to one question: is this a wiring fault or a code fault? As you read each troubleshooting question, decide which side of that line the clues point to.

---

#### 1. What is an operating system?

<div class="upper-alpha" markdown>
1. Software that manages the hardware and provides services other programs use
2. A program that draws windows and icons so people can use a mouse
3. The single program that reads the BME280 and saves its data
4. A set of wires and rules that lets sensors take turns talking
</div>

??? question "Show Answer"
    The correct answer is **A**. An operating system manages a computer's hardware and provides services for other programs. It runs programs, manages files, controls access, and gives humans a way to give instructions. Option B describes a graphical desktop, which the station does not even use. Option C describes your logger program, which runs on top of the operating system. Option D describes a bus, like I2C.

    **Concept Tested:** Operating System

    **See:** [What an Operating System Actually Does](index.md#what-an-operating-system-actually-does)

---

#### 2. Which statement about Raspberry Pi OS and Ubuntu Server is true?

<div class="upper-alpha" markdown>
1. Only Raspberry Pi OS is based on Debian Linux
2. Ubuntu Server always includes a graphical desktop
3. Raspberry Pi OS is maintained by Canonical
4. Both are based on Debian, and this project uses Ubuntu Server on the remote station
</div>

??? question "Show Answer"
    The correct answer is **D**. Raspberry Pi OS comes from the Raspberry Pi Foundation, and Ubuntu Server comes from Canonical. Both are based on Debian, so almost every command is the same on either one. This project uses Ubuntu Server on the remote station, for its long support period, and Raspberry Pi OS on the base station. Option A is wrong because both use Debian. Option B is wrong because Ubuntu Server has no desktop. Option C names the wrong maintainer.

    **Concept Tested:** Ubuntu Server and Raspberry Pi OS

    **See:** [What an Operating System Actually Does](index.md#what-an-operating-system-actually-does)

---

#### 3. What does the SIM7600A module provide, and how does it talk to the Raspberry Pi?

<div class="upper-alpha" markdown>
1. Temperature and humidity readings, over the I2C bus
2. Cellular data and GPS, over serial UART using AT commands
3. Wi-Fi and Bluetooth, over the SPI bus using chip-select lines
4. Extra storage for data files, over the micro-USB connector
</div>

??? question "Show Answer"
    The correct answer is **B**. The SIM7600A module provides the cellular data link for telemetry and a GPS receiver. It talks over serial UART, a two-wire, point-to-point link with no shared clock, using text commands called AT commands. Option A describes the BME280. Option C is wrong, because the Pi Zero 2 W already has built-in Wi-Fi and Bluetooth. Option D is not what the module does.

    **Concept Tested:** SIM7600A Module and Serial UART

    **See:** [SPI and UART](index.md#spi-and-uart)

---

#### 4. Your logger runs as a systemd service with `Restart=always` and `RestartSec=10`. The Python program crashes at 3 a.m. What happens next?

<div class="upper-alpha" markdown>
1. It stays stopped until someone logs in and starts it by hand
2. Systemd waits about 10 seconds and then starts the program again
3. The whole Raspberry Pi reboots to clear the error
4. Systemd removes the service so the crash cannot happen again
</div>

??? question "Show Answer"
    The correct answer is **B**. A systemd service is managed by the operating system's service manager. `Restart=always` tells systemd to start the program again whenever it exits, and `RestartSec=10` makes it wait ten seconds first, so a program that fails instantly does not spin the processor. Option A describes a program started by hand from the command line. Options C and D are not what these settings do.

    **Concept Tested:** Systemd Service

    **See:** [Making It Run Forever](index.md#making-it-run-forever)

---

#### 5. Why does sensor code on Linux often look a lot like code that reads and writes files?

<div class="upper-alpha" markdown>
1. Hardware devices, like the I2C bus, appear as files under `/dev`
2. Every sensor reading is saved to a file before a program can use it
3. The BME280 stores its readings on the microSD card automatically
4. Linux gives every sensor its own drive letter, like `C:`
</div>

??? question "Show Answer"
    The correct answer is **A**. A file system is how an operating system organizes stored files, and Linux uses one tree starting at `/`. In Linux, hardware devices appear as files. The I2C bus is `/dev/i2c-1`, and a program talks to it by opening and reading that file. Options B and C are not how sensors work. Option D is wrong, because Linux has no drive letters. Everything joins the single tree.

    **Concept Tested:** File System

    **See:** [The File System](index.md#the-file-system)

---

#### 6. Several sensors share the same two I2C wires. How does the controller talk to just one of them?

<div class="upper-alpha" markdown>
1. It sends a different voltage on the SDA wire for each sensor
2. It gives each sensor its own chip-select wire to switch on
3. It talks to all of them at once and averages their replies
4. It broadcasts a device address, and only the matching device responds
</div>

??? question "Show Answer"
    The correct answer is **D**. The I2C bus uses two wires, SDA for data and SCL for the clock. Each device has an I2C device address, usually 7 bits. The controller broadcasts an address, and only the device with that address answers. That is why no two devices on one bus may share an address. Option B describes the SPI bus. Options A and C are not how I2C works.

    **Concept Tested:** I2C Bus and I2C Device Address

    **See:** [I2C](index.md#i2c)

---

#### 7. Running `ls -l` shows a file with permissions `-rwxr-x---`. What can members of the file's group do?

<div class="upper-alpha" markdown>
1. Read, write, and execute the file
2. Only read the file
3. Read and execute the file, but not change it
4. Nothing at all with the file
</div>

??? question "Show Answer"
    The correct answer is **C**. File permissions come in three groups of three letters, for owner, group, and others. After the first character, which shows the file type, `rwx` belongs to the owner. The next three, `r-x`, belong to the group, which means read and execute but no write. The last three, `---`, mean others can do nothing. Option A is the owner's permissions. Option D is the permissions for others. Option B misses the `x`.

    **Concept Tested:** File Permissions

    **See:** [File Permissions](index.md#file-permissions)

---

#### 8. Your logger is running. You want to watch new readings appear in `readings.csv` as they are added. Which shell command should you type?

<div class="upper-alpha" markdown>
1. `cat readings.csv`
2. `head -5 readings.csv`
3. `ls -l readings.csv`
4. `tail -f readings.csv`
</div>

??? question "Show Answer"
    The correct answer is **D**. A shell command is an instruction typed at the command line interface. `tail` shows the last lines of a file, and the `-f` option means "follow," so it keeps printing new lines as they are added. Option A prints the whole file once and stops. Option B shows only the first five lines. Option C lists the file's details, like size and permissions, but not its contents.

    **Concept Tested:** Shell Command and Command Line Interface

    **See:** [The Command Line](index.md#the-command-line)

---

#### 9. You need the `i2cdetect` tool, which comes in the `i2c-tools` package. Which steps should you follow?

<div class="upper-alpha" markdown>
1. Run `sudo apt install i2c-tools`, then run `sudo apt update`
2. Run `sudo apt update`, then run `sudo apt install i2c-tools`
3. Run `nano i2c-tools` to write the program yourself
4. Run `sudo systemctl start i2c-tools` to turn the tool on
</div>

??? question "Show Answer"
    The correct answer is **B**. A software package bundles a program with what it needs to run, and `apt` installs packages along with their dependencies. Always run `apt update` first, so apt works from a fresh list of what is available. Option A has the right commands in the wrong order, so apt may use a stale list and fail. Option C opens a text editor. Option D manages services, not packages.

    **Concept Tested:** Software Package

    **See:** [Installing Software](index.md#installing-software)

---

#### 10. Your sensor gives correct temperature and pressure, but humidity always reads 0. Your library reports a chip ID of 0x58. What is the most likely cause?

<div class="upper-alpha" markdown>
1. The humidity film is wet from fog and needs time to dry
2. The I2C address is wrong, so no humidity data ever arrives
3. The chip is really a BMP280, which has no humidity sensor
4. The temperature element is failing to compensate the humidity reading
</div>

??? question "Show Answer"
    The correct answer is **C**. The BME280 sensor measures temperature, pressure, and humidity, and its chip ID is 0x60. The BMP280 looks almost the same but has no humidity sensor, and its ID is 0x58. Option A is wrong, because a wet film reads near 100 percent, not 0. Option B is wrong, because a wrong address would stop all three readings. Option D does not explain the 0x58 ID.

    **Concept Tested:** BME280 Sensor

    **See:** [The BME280](index.md#the-bme280)

---

!!! mascot-celebration "Station Online!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Excellent work, station builders! You can now find your way around the command line, keep a logger running as a service, and get the BME280 talking on the I2C bus. Let's take a reading!
