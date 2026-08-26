# Concept Taxonomy

The 269 concepts in [concept-list.md](./concept-list.md) are sorted into **15
categories**. Each category has a 3-6 character TaxonomyID used in the
`TaxonomyID` column of [learning-graph.csv](./learning-graph.csv) and as the group
key in [learning-graph.json](./learning-graph.json).

The organizing principle is the book's primary goal: understand what is being
measured and how those measurements affect the natural and man-made environments.
So each of the seven measured quantities gets its own category, holding its
history, its physics, its units, and its instruments together. The technology
categories support those seven, and the impact category collects what the
measurements are used for.

See [taxonomy-distribution.md](./taxonomy-distribution.md) for the concept count
in each category.

## Categories

### Measurement Foundations

**TaxonomyID:** `FOUND`
**Color:** SteelBlue

The vocabulary of measurement itself, independent of what is being measured.
Units and the SI system, prefixes and conversion, scientific notation and orders
of magnitude, and the quality vocabulary that the rest of the book leans on:
resolution, accuracy, precision, uncertainty, calibration, and reference
standards. These concepts are prerequisites for nearly every measurement
concept in the book.

### Sensors And Transduction

**TaxonomyID:** `SENSE`
**Color:** DarkSlateBlue

How a physical property becomes a number. Transduction, analog and digital
signals, and analog-to-digital conversion, plus the specific physical effects the
book's sensors rely on: the piezoresistive effect, capacitive sensing, the
thermoelectric and photoelectric effects, semiconductors, silicon diodes, and
MEMS. Ends at the BME280, the sensor students actually hold.

### Atmospheric Science

**TaxonomyID:** `ATMOS`
**Color:** DarkGreen

The physical system being measured. The atmosphere and air masses, weather versus
climate, high and low pressure systems and fronts, the water cycle processes of
evaporation and condensation and precipitation, and the daily and seasonal cycles
that show up in every logged dataset. This category is what makes the seven
measurements a connected story instead of seven unrelated numbers.

### Temperature

**TaxonomyID:** `TEMP`
**Color:** LimeGreen

What temperature physically is (the kinetic energy of atoms), the instrument
lineage from the thermoscope through liquid-in-glass to the thermocouple,
resistance thermometer, and thermistor, and the three scales — Fahrenheit,
Celsius, and Kelvin — with their fixed points and conversions. Includes the
Stevenson screen, because how a thermometer is exposed is part of the
measurement.

### Barometric Pressure

**TaxonomyID:** `PRESS`
**Color:** Gold

Pressure as the weight of the air above, the Torricelli and Puy de Dome
experiments that established it, the mercury and aneroid instruments, and the
competing units — inches of mercury, millibars, hectopascals, pascals — that all
describe one atmosphere. Extends to sea level pressure, pressure altitude, the
altimeter, and pressure tendency as a forecasting signal.

### Humidity And Dew Point

**TaxonomyID:** `HUMID`
**Color:** DarkGoldenrod

Water vapor in the air and the three ways to describe it: absolute humidity,
relative humidity, and dew point. Includes the vapor-pressure physics that
explains why warm air holds more water, the hygrometer and psychrometer
instruments, the capacitive thin-film sensor used in the BME280, and the derived
comfort measures — apparent temperature and heat index.

### Solar Radiation

**TaxonomyID:** `SOLAR`
**Color:** Khaki

The energy arriving from the Sun and the instruments that catch it. The
electromagnetic spectrum, irradiance and the solar constant, insolation as
irradiance accumulated over time, the pyrheliometer and pyranometer and bolometer,
the photovoltaic path from the photoelectric effect to the solar cell, and the
derived UV index. Albedo and solar zenith angle connect it back to the ground.

### Wind

**TaxonomyID:** `WIND`
**Color:** Teal

Air in motion, driven by the pressure gradient. Speed and direction, the vane and
the anemometer families, the Beaufort scale as a measurement standard that
required no instrument, competing speed units, the distinction between gust and
sustained wind, and the storm-rating scales — Saffir-Simpson and Enhanced Fujita —
that turn wind speed into a hazard category.

### Ground Motion And Seismology

**TaxonomyID:** `SEIS`
**Color:** DodgerBlue

Earthquakes, faults, and seismic waves; the instrument line from the seismoscope
through the seismograph to the modern seismometer, all resting on the same
inertial-mass principle; MEMS accelerometers as the affordable modern version;
and the crucial distinction between magnitude scales (Richter, moment magnitude)
that describe the event and intensity scales (Mercalli) that describe the shaking
at a place.

### Location Elevation And Time

**TaxonomyID:** `GEO`
**Color:** LightSkyBlue

Where and when a reading was taken. Coordinate systems, latitude and longitude,
the longitude problem and the marine chronometer that solved it, the prime
meridian, trilateration and how GPS actually works, GNSS constellations, the WGS
84 datum, and the timekeeping concepts — atomic clocks, UTC, time zones, and
timestamps — that let two stations' records be compared.

### Hardware And Interfacing

**TaxonomyID:** `HW`
**Color:** Crimson

The physical build. The Raspberry Pi and single-board computers, GPIO pins and
headers, the electrical basics of voltage, current, and ground, the wiring parts
(jumper wires, breadboard, pull-up resistor), the buses that carry sensor data —
I2C with its device addressing, SPI, and serial UART — plus electrostatic
discharge and the SIM7600A cellular module.

### Computing And Programming

**TaxonomyID:** `SYS`
**Color:** MediumPurple

Everything above the hardware. What an operating system does, Ubuntu Server and
Raspberry Pi OS, the command line, the file system and permissions, editors,
packages, and running a program as a systemd service. Then Python itself:
variables, data types, functions, loops, conditionals, libraries, exception
handling, and script execution.

### Data Logging And Analysis

**TaxonomyID:** `DATA`
**Color:** Indigo

Turning readings into a dataset and a dataset into a finding. Sampling intervals,
time series, CSV structure down to the header row, storage and rotation and
backup, then the analysis layer: line charts, scatter plots, axis labeling, moving
averages, trend, and correlation. Ends with the data quality concepts — outliers,
missing data, sensor drift, and validation — that separate a real event from an
instrument fault.

### Field Deployment And Power

**TaxonomyID:** `DEPLOY`
**Color:** DarkOrchid

Making the station survive outdoors and unattended. Siting and sensor exposure,
weatherproof enclosures and IP ratings, the power budget and the battery, solar
panel, and charge controller that satisfy it, duty cycling to stretch it, and the
telemetry chain — cellular link, Wi-Fi, base station — including what happens when
the link is intermittent.

### Environmental And Societal Impact

**TaxonomyID:** `IMPACT`
**Color:** Orange

What the measurements are for. Weather forecasting and severe weather warnings,
agriculture and evapotranspiration, energy demand and solar generation, aviation
safety, building codes, urban heat islands, air quality, wildfire risk, flood and
tsunami warning, and the long climate record. Closes with citizen science, data
sharing, and science communication — how a student's own data reaches other
people.
