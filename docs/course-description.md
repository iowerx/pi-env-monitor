# Course Description

This is the seed document for the learning graph. It defines the audience,
prerequisites, topics, and outcomes that `learning-graph-generator` uses to
enumerate concepts and their dependencies.

---

## Title

Raspberry Pi Environmental Monitoring: Grades 6–12

## Audience

Students in grades 6–12 building a working environmental monitoring station,
in a science classroom, an after-school STEM club, or an independent science
fair project. The book also serves the teachers and club advisors who guide
them, who may be introducing this hardware for the first time themselves.

Readers are assumed to be curious about how measurements are made but new to
nearly all of the technology involved. No prior experience with Linux, the
command line, electronics, or programming is expected. Everything specific to
the Raspberry Pi, the sensors, and Python is taught within the book.

Because the grade band is wide, the material is written to a middle-school
reading level and introduces every technical term before using it. Depth comes
from the extension activities and the data-analysis chapters, which give older
students somewhere to go without leaving younger ones behind.

## Prerequisites

Readers are assumed to have mastered:

- Arithmetic with decimals, ratios, percentages, and unit conversion
- Reading and constructing line graphs and scatter plots from tabular data
- Introductory physical science: matter, energy, temperature, and states of matter
- Basic computer literacy: files and folders, typing, connecting to a Wi-Fi network
- Following a written multi-step procedure and recording results in a notebook

Readers are **not** assumed to know:

- Any programming language, including Python
- The Linux command line, or what an operating system does
- Circuits, voltage, current, soldering, or how to read a datasheet
- Statistics beyond the mean and the range
- Trigonometry or calculus

## Topics

1. What environmental monitoring is, and the questions monitoring data answers
2. Measurement fundamentals: units, resolution, accuracy versus precision, uncertainty, and calibration
3. The atmosphere and weather: temperature, barometric pressure, relative humidity, and dew point
4. How sensors work: transduction, and what happens inside a BME280
5. The Raspberry Pi as a computer, and what Ubuntu Server does
6. Working at the command line: files, permissions, editors, and services
7. Connecting hardware safely: GPIO pins, the I2C bus, wiring, and static discipline
8. Reading a sensor from Python and turning raw values into physical units
9. Data logging: sampling rate, timestamps, CSV files, and why records need units
10. Storing and retrieving a growing dataset
11. Charting time-series data and reading it critically
12. Data quality: drift, outliers, gaps, and validating a suspicious reading
13. Time and place: GPS coordinates, elevation, and why stations record UTC
14. Getting data off the device: networks, cellular telemetry, and intermittent links
15. Powering a remote station: batteries, solar panels, and building a power budget
16. Siting and weatherproofing: enclosures, sensor exposure, and why placement changes the data
17. Sensing the ground: introduction to accelerometers and seismic measurement
18. Publishing and sharing data, including citizen-science networks
19. Documenting the build and presenting findings to a non-technical audience

## Learning Outcomes

By the end of this book, the reader will be able to:

- **Remember:** Name the quantities a weather station measures and their standard units; identify the major components of the station, including the single-board computer, the BME280 sensor, the power subsystem, and the telemetry module; state what the I2C bus does.

- **Understand:** Explain how a sensor converts a physical property into a number a computer can store; describe the difference between accuracy and precision in their own words; explain why two thermometers a meter apart can legitimately disagree.

- **Apply:** Wire a BME280 to a Raspberry Pi over I2C without damaging either; write and modify a Python program that reads the sensor and appends timestamped readings to a CSV file on a fixed interval; produce a labeled chart from the resulting data.

- **Analyze:** Examine several days of readings and separate the daily temperature cycle from a passing weather system and from sensor drift; locate outliers and missing intervals in a log file and determine which are instrument faults rather than real events.

- **Evaluate:** Judge whether a proposed solar panel and battery will keep a station running through a week of overcast weather; critique a siting decision by predicting how it biases the measurements; compare two candidate sensors against the station's stated requirements and defend a choice.

- **Create:** Design, build, deploy, and document a working environmental monitoring station that records data unattended and makes it available to others; write up the design decisions, the data collected, and the limitations of the results for a general audience.
