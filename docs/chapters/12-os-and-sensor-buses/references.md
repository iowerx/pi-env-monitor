# References: The Station's Brain: Operating System, Command Line, and Sensor Buses

1. [Operating system](https://en.wikipedia.org/wiki/Operating_system) - Wikipedia - Explains what an operating system does: managing memory, files, programs, and hardware for the user. Its sections on the kernel, file systems, and user interfaces give background for running Linux on the station.

2. [I2C](https://en.wikipedia.org/wiki/I2C) - Wikipedia - Describes the two-wire I2C bus, with its clock and data lines, device addresses, and pull-up resistors. Timing diagrams show how the Raspberry Pi talks to the BME280 and other sensors on one shared bus.

3. [Serial Peripheral Interface](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface) - Wikipedia - Explains SPI, a faster four-wire bus that uses a chip-select line instead of addresses. Clear wiring and timing diagrams help students compare SPI with I2C and choose the right bus.

4. The Linux Command Line - William E. Shotts - No Starch Press - Shotts teaches the shell gradually, starting at the first prompt and building one small task at a time toward real scripts. This patient, hands-on approach makes the command line approachable for true beginners.

5. Raspberry Pi User Guide - Eben Upton and Gareth Halfacree - Wiley - Written by the Raspberry Pi's co-creator, this guide walks a beginner from first boot through Linux basics, software installation, and the GPIO header. It explains the board from the designer's point of view.

6. [The Linux Command Line for Beginners](https://ubuntu.com/tutorials/command-line-for-beginners) - Ubuntu - A free, step-by-step tutorial covering the terminal, folders and files, moving files, pipes, and the superuser. Type-along examples let students practice the shell commands this chapter introduces.

7. [Raspberry Pi OS](https://www.raspberrypi.com/documentation/computers/os.html) - Raspberry Pi Documentation - The official guide to installing and updating Raspberry Pi OS, managing software packages with apt, and using Python. It helps students keep their station's software current and install sensor libraries correctly.

8. [I2C](https://learn.sparkfun.com/tutorials/i2c/all) - SparkFun Learn - A beginner-friendly tutorial explaining how I2C works, why it needs pull-up resistors, and how devices are addressed. Signal diagrams make it easy to see what happens on the wires during each reading.

9. [Adafruit BME280 Sensor Breakout](https://learn.adafruit.com/adafruit-bme280-humidity-barometric-pressure-temperature-sensor-breakout) - Adafruit Learning System - A complete guide to wiring the BME280 over I2C or SPI and reading it with Python. Pinout photos, wiring diagrams, and example code take students from bare chip to working readings.

10. [BME280 Humidity Sensor](https://www.bosch-sensortec.com/en/products/environmental-sensors/humidity-sensors-bme280) - Bosch Sensortec - The manufacturer's product page for the BME280, with its key specifications and a link to the full datasheet. Students can compare the official accuracy and range numbers with what their own station reports.
