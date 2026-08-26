# Chapters

This textbook is organized into 17 chapters covering 269 concepts.

## Chapter Overview

1. [Why We Measure the Natural Environment](01-why-we-measure/index.md) - Introduces environmental monitoring, the difference between observing and measuring, and the atmosphere, weather, and climate as the system this book measures.
2. [The Language of Measurement](02-language-of-measurement/index.md) - Covers SI units, prefixes, and conversion, then the vocabulary of measurement quality: resolution, accuracy, precision, uncertainty, and calibration against a reference standard.
3. [Electricity and the Single-Board Computer](03-electricity-and-computer/index.md) - Introduces the Raspberry Pi along with the voltage, current, ground, GPIO, and wiring basics needed to connect a sensor without destroying either part.
4. [How Sensors Turn the World Into Numbers](04-how-sensors-work/index.md) - Explains transduction, analog and digital signals, and analog-to-digital conversion, plus the semiconductor and MEMS materials that make sensing possible.
5. [Time and Place: Recording Where and When](05-time-and-place/index.md) - Builds coordinates, the longitude problem, and GPS, then UTC and timestamps, establishing that a reading without a place and a time is not yet data.
6. [Temperature: From the Thermoscope to the Silicon Chip](06-temperature/index.md) - Follows temperature from the kinetic energy of atoms through Galileo, Fahrenheit, Celsius, and Kelvin to the thermistor and the Stevenson screen.
7. [Barometric Pressure: The Weight of the Atmosphere](07-barometric-pressure/index.md) - Traces pressure from Aristotle's rejected vacuum through Torricelli and Pascal to the aneroid barometer, the altimeter, and the piezoresistive silicon sensor.
8. [Humidity and Dew Point: The Water Hidden in the Air](08-humidity-and-dew-point/index.md) - Builds the water cycle, then distinguishes absolute humidity, relative humidity, and dew point, and follows the hygrometer from horsehair to thin-film capacitance.
9. [Solar Radiation: The Energy That Drives the Weather](09-solar-radiation/index.md) - Covers irradiance, the solar constant, the pyranometer family, and the photovoltaic path, closing with the daily and seasonal cycles the Sun drives.
10. [Wind: Measuring Air in Motion](10-wind/index.md) - Opens with the pressure systems and gradients that create wind, then covers anemometers, the Beaufort scale, and what wind does to people and structures.
11. [Ground Motion: Measuring Earthquakes](11-ground-motion/index.md) - Follows seismic measurement from Zhang Heng's seismoscope to MEMS accelerometers, distinguishing magnitude scales from intensity scales along the way.
12. [The Station's Brain: Operating System, Command Line, and Sensor Buses](12-os-and-sensor-buses/index.md) - Turns the board into a working computer with an operating system and command line, then wires the sensor over I2C and arrives at the BME280.
13. [Programming the Station in Python](13-python-programming/index.md) - Teaches enough Python to read a sensor and act on the result: variables, functions, loops, conditionals, libraries, and exception handling.
14. [Logging Data: Timestamps, Intervals, and Files](14-data-logging/index.md) - Covers sampling intervals, time series, CSV structure, storage and rotation, and the metadata without which a dataset cannot be understood by anyone else.
15. [Charting and Interpreting Your Data](15-charting-and-analysis/index.md) - Teaches reading change over time through charts, moving averages, trend, and correlation, then the data quality work of finding outliers, gaps, and drift.
16. [Building the Station for the Outdoors](16-building-for-outdoors/index.md) - Covers siting, enclosures, the power budget with solar and battery, and the telemetry chain that gets data off an unattended device.
17. [From Measurement to Consequence](17-measurement-to-consequence/index.md) - Traces every measurement into the decisions it drives, from forecasting and building codes to wildfire risk, closing with citizen science and communicating findings.

## How to Use This Textbook

Read the chapters in order. The sequence is derived from the
[learning graph](../learning-graph/index.md), so no chapter uses a concept that
has not already been introduced in an earlier one. Chapters 1 through 5 build the
shared foundation — measurement vocabulary, the hardware, how a sensor works, and
how a reading gets a place and a time. Chapters 6 through 11 each take one
measured quantity and follow it from its history through its physics to the
instrument that captures it. Chapters 12 through 16 build the working station, and
Chapter 17 traces every measurement into the decisions it drives in the natural
and man-made environments.

Readers who want to jump ahead to a specific measurement should still read
Chapters 2, 3, and 4 first — the units, the electronics, and the idea of
transduction are used by every measurement chapter.

---

**Note:** Each chapter includes a list of concepts covered. Make sure to complete
prerequisites before moving to advanced chapters.
