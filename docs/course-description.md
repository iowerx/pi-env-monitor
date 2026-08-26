---
title: Course Description for Raspberry Pi Environmental Monitoring - Grades 6-12
description: A detailed course description for Raspberry Pi Environmental Monitoring including overview, topics covered, a short history of each measured quantity, and learning objectives in the format of the 2001 Bloom Taxonomy
quality_score: 96
---
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
3. A short history of each measurement: who first measured it, with what instrument, and on what scale
4. The atmosphere and weather: temperature, barometric pressure, relative humidity, and dew point
5. Solar radiation: irradiance, the solar constant, insolation, and the ultraviolet index
6. Wind: speed, direction, gusts, the Beaufort scale, and apparent temperature
7. Sensing the ground: accelerometers, seismic waves, magnitude, and intensity
8. Time and place: GPS coordinates, elevation, and why stations record UTC
9. How sensors work: transduction, and what happens inside a BME280
10. What each measurement affects: weather and severe-storm forecasting, agriculture and irrigation,
    energy demand and solar generation, air travel and altimetry, human health and comfort,
    building and infrastructure design, and hazard warning systems
11. The Raspberry Pi as a computer, and what Ubuntu Server does
12. Working at the command line: files, permissions, editors, and services
13. Connecting hardware safely: GPIO pins, the I2C bus, wiring, and static discipline
14. Reading a sensor from Python and turning raw values into physical units
15. Data logging: sampling rate, timestamps, CSV files, and why records need units
16. Storing and retrieving a growing dataset
17. Charting time-series data and reading it critically
18. Data quality: drift, outliers, gaps, and validating a suspicious reading
19. Getting data off the device: networks, cellular telemetry, and intermittent links
20. Powering a remote station: batteries, solar panels, and building a power budget
21. Siting and weatherproofing: enclosures, sensor exposure, and why placement changes the data
22. Publishing and sharing data, including citizen-science networks
23. Documenting the build and presenting findings to a non-technical audience

## Topics Not Covered

Setting boundaries keeps the book at a length students can finish:

- Circuit design, soldering, or PCB layout; all connections are made with jumper wires
- Analog electronics theory: transistor operation, op-amps, filter design
- Chemistry of the atmosphere: ozone depletion, carbon cycles, aerosol chemistry
- Numerical weather prediction, atmospheric modeling, or climate model construction
- Inferential statistics: hypothesis testing, confidence intervals, regression theory
- Machine learning applied to sensor data
- Network security, cryptography, or server administration beyond running one service
- Seismic wave inversion, earthquake prediction, or fault mechanics
- Manufacturing a sensor; the book explains how sensors work but does not build one

## A Short History of Each Measurement

Every number this station records has a story behind it. Somebody had to decide
that a quantity was worth measuring, invent an instrument that responded to it,
and agree on a scale so that two people in different places could compare
readings. Those three steps — quantity, instrument, scale — took centuries for
some measurements and only decades for others.

These histories are seed material for the learning graph and for the opening
section of each measurement chapter. They are written at the same reading level
as the book itself. The barometric pressure history follows the model set by the
original human-written lesson plan, *Under Pressure: About One Atmosphere*.

### Barometric Pressure

In ancient Greece, philosophy and science were nearly the same subject. Aristotle,
writing in the 4th century BC, concluded that "nature abhors a vacuum" — that
empty space could not exist — and that the atmosphere reached up into the heavens.
He had no instrument to test the idea, only logic, and the idea stood for almost
two thousand years.

In 1643 Evangelista Torricelli, a student of Galileo, filled a sealed glass tube
with mercury and upended it in a dish. The mercury fell part way and stopped,
leaving a gap at the closed top. The column always settled near 29.9 inches.
Torricelli argued that the weight of the air pressing on the dish was holding the
column up, and that the gap above it was the vacuum Aristotle said could not
exist. Because mercury is about thirteen times denser than water, a column of
water doing the same job would have to be more than thirty feet tall — which is
why the experiment had waited so long for the right liquid.

Blaise Pascal saw the test that would settle the argument. If air has weight, then
less air overhead means a shorter column. In 1648 he asked his brother-in-law,
Florin Périer, to carry a barometer up the Puy de Dôme mountain in France and
record the height of the mercury along the way. The column dropped steadily with
altitude and rose again on the descent. The atmosphere had been weighed. The
measurement took the name **barometric pressure**, from the Greek *baros*,
meaning weight.

Instruments got smaller after that. Lucien Vidi built the first practical aneroid
barometer in 1844, using a sealed metal capsule that flexed instead of a tube of
mercury, which finally made a barometer portable enough to carry aboard ship.
Admiral Robert FitzRoy — the captain of Darwin's *Beagle* — used networks of these
instruments to issue the first public storm warnings in the 1860s, the beginning
of weather forecasting as a service.

The unit has moved as well. The United States still reports inches of mercury
(inHg), with 29.92 inHg at sea level. Most of the world reports hectopascals
(hPa), where sea level is 1013.25 hPa; a hectopascal is the same size as the older
millibar, and the pascal itself was named for Blaise Pascal in 1971. All three are
descriptions of the same standard pressure, called **one atmosphere**.

Today the sensing element is a piece of silicon. In the 1960s engineers found that
a thin silicon diaphragm changes its electrical resistance when it flexes — the
piezoresistive effect — and by the 1980s an entire pressure sensor could be etched
onto a chip. The BME280 in this project descends directly from Torricelli's tube:
same quantity, same units, four centuries of shrinking.

**What it affects.** Pressure changes drive the wind and signal approaching
weather, so forecasts depend on a dense network of barometers. Aircraft altimeters
are barometers, and pilots reset them to the local pressure before landing.
Building ventilation, weather-triggered evacuation orders, and the timing of
hurricane landfall warnings all rest on pressure readings.

### Temperature

Warmth was something people could feel long before it was something they could
count. Around 1592 Galileo built a **thermoscope**: a glass bulb with a stem
standing in water, in which the water rose and fell as the trapped air expanded
and contracted. It showed that something was changing, but it had no numbers on
it, and it also responded to air pressure. A thermoscope tells you *different*.
A thermometer tells you *how much*.

Numbers arrived in stages. Santorio Santorio put a scale on a thermoscope around
1612 and used it on patients. In 1654 Ferdinand II of Tuscany sealed the liquid
inside the glass, which removed the pressure error. The problem left was that no
two makers agreed on the scale, so no two readings could be compared.

Daniel Gabriel Fahrenheit fixed that in 1724. Working with mercury in glass, he
produced the first scale that different instruments could reproduce, fixing 0 °F
on a stable ice-water-salt mixture and 32 °F on the freezing point of water, with
180 degrees eventually separating freezing from boiling. Anders Celsius proposed a
hundred-step scale in 1742 — originally with 0 at boiling and 100 at freezing,
inverted to today's arrangement shortly after his death — and it was later renamed
in his honor.

In 1848 William Thomson, Lord Kelvin, argued that there is a coldest possible
temperature, the point at which atomic motion stops, and built a scale starting
there. That reframed what temperature *is*: not a substance called heat, but a
measure of how fast atoms are moving. The kelvin is the SI unit, and it is why
scientists can speak of an absolute amount of thermal energy rather than a
position on someone's arbitrary scale.

Electrical thermometers followed. Thomas Seebeck discovered in 1821 that a
junction of two metals produces a voltage that depends on temperature, giving us
the thermocouple. Platinum resistance thermometers arrived in the 1870s. The
sensor inside a BME280 uses a simpler trick still: a silicon diode whose voltage
changes predictably with temperature, small enough to sit beside the pressure and
humidity elements on the same chip.

One more piece of the history is not an instrument at all. In 1864 Thomas
Stevenson designed the louvered white box — the **Stevenson screen** — that shields
a thermometer from sunlight and rain while letting air pass through. Without an
agreement about *how* to expose the thermometer, a worldwide temperature record is
not comparable from station to station. Siting turned out to matter as much as the
sensor.

**What it affects.** Temperature sets growing seasons and planting dates, drives
heating and cooling demand on the electric grid, determines how much water vapor
the air can hold, and expands the bridges and rails of the built environment
enough that engineers must design gaps for it. The instrumental record that
began in the mid-1800s is the backbone of what we know about a changing climate.

### Humidity

Water vapor is invisible, so measuring it began with materials that quietly
respond to it. Around 1450 Nicholas of Cusa described balancing a ball of wool
against stones on a scale: as the air grew damp, the wool absorbed moisture and
tipped the balance. Leonardo da Vinci sketched a version of the same idea about
thirty years later. Both were measuring a *change*, not an amount.

In 1783 Horace-Bénédict de Saussure built the hair hygrometer, using the fact
that a human hair lengthens by a few percent as it takes on moisture. It was the
first humidity instrument good enough to be read as a number. Around 1801 John
Dalton supplied the physics behind it, showing that water vapor exerts its own
partial pressure in the air independent of the other gases.

That insight separated two ideas students still mix up. **Absolute humidity** is
how much water vapor is actually in the air. **Relative humidity** is that amount
compared to the most the air could hold at its current temperature, written as a
percent. Because warm air can hold far more vapor than cold air, the same absolute
humidity reads as a low relative humidity on a hot afternoon and a high one at
dawn — which is why fog forms overnight without any new water arriving.

The **dew point** is the third way to say it, and the most useful outdoors: the
temperature to which air must cool before its vapor condenses into liquid. It is
an absolute measure, it never exceeds the air temperature, and it predicts how
muggy a day will feel far better than relative humidity does. An 80 °F day at 50%
humidity is more oppressive than a 30 °F day at 100%, because the dew point is far
higher. Condensation is also how clouds form, so the dew point is the link between
a number on a screen and rain on the ground.

Practical instruments followed the theory. The wet-and-dry-bulb psychrometer —
two thermometers, one wrapped in a wet wick, with evaporation cooling the wet one
— became standard after 1825 and was refined into Richard Assmann's aspirated
psychrometer in 1887. Chilled-mirror hygrometers measure the dew point directly by
cooling a mirror until it fogs. The modern breakthrough was the thin-film
capacitive sensor, introduced by Vaisala in 1973: a polymer film between two
electrodes absorbs and releases water vapor, changing the capacitance in
proportion to relative humidity. That is the mechanism inside the BME280.

**What it affects.** Humidity governs how quickly sweat evaporates, so it sets
heat-stress limits for athletes and outdoor workers; it drives mold, corrosion, and
wood movement in buildings; it determines irrigation need in agriculture; and the
dew point is what forecasters watch for fog, frost, and thunderstorm fuel.

### Solar Radiation

The measurement begins with an accident. In 1800 William Herschel held a
thermometer just past the red end of a prism's spectrum, expecting nothing, and
found the temperature rising — invisible **infrared** radiation. Sunlight, it
turned out, carries energy the eye cannot see, and energy is something a
thermometer can count.

Claude Pouillet built the first pyrheliometer in 1838 and used it to make the
first real estimate of the **solar constant**: the power arriving on a square
meter facing the Sun at the top of the atmosphere. Samuel Langley invented the
bolometer in 1880, sensitive enough to map the spectrum in fine detail, and hauled
instruments up Mount Whitney to measure how much the atmosphere absorbs on the way
down. Anders Ångström's pyrheliometer of 1893 and the Moll-Gorczynski thermopile
pyranometer of the 1920s turned solar measurement into routine station work.

Ground measurements could never fully settle the number, because the atmosphere
always takes a cut. Satellites did: instruments beginning with Nimbus-7 in 1978
measured total solar irradiance from orbit and pinned the solar constant near
**1361 watts per square meter**. They also showed it is not quite constant,
varying by about 0.1% across the eleven-year sunspot cycle.

A parallel line of work made the Sun measurable with electricity instead of heat.
Edmond Becquerel discovered the photovoltaic effect in 1839; Charles Fritts built
a selenium photocell in 1883; Bell Labs produced the first practical silicon solar
cell in 1954. A photodiode or a small solar cell produces a current proportional
to the light falling on it, which is how inexpensive irradiance sensors work
today — cheap and fast, though less accurate across the full spectrum than a
thermopile pyranometer.

Two derived measures matter for daily life. **Insolation** is irradiance added up
over a day, in watt-hours or kilowatt-hours per square meter, and it is the number
that sizes a solar panel. The **UV index**, developed in Canada in 1992 and now
used worldwide, converts ultraviolet irradiance into a sunburn-risk scale.

**What it affects.** Solar radiation is the engine of nearly everything else this
station measures: it heats the ground, drives evaporation, and creates the pressure
differences that become wind. It sets crop yields and evapotranspiration, sizes the
solar panel and battery that keep this very station alive, determines the output of
utility-scale solar farms, drives skin-cancer risk through UV, and forces
architects to design shading, glazing, and cooling loads around it.

### Wind Speed

Wind direction was measured long before wind speed. The Tower of the Winds in
Athens, built around 50 BC, carried a bronze weather vane on top and personified
the eight winds on its faces. Speed had no instrument at all — only adjectives.

Leon Battista Alberti built the first anemometer around 1450: a flat plate hung so
that the wind pushed it up an arc, with the angle indicating the force. Robert
Hooke reinvented the swinging-plate design in the 1600s. Both measured pressure
against a surface, which is a real physical effect but a hard one to calibrate.

The lasting fix for the calibration problem was social rather than mechanical. In
1805 Francis Beaufort, a Royal Navy officer, wrote a scale that described wind by
what it *does* — how much sail a ship could carry, later how trees and smoke
behave — from 0 (calm) to 12 (hurricane). The Royal Navy adopted it in 1838. The
**Beaufort scale** let observers around the world file comparable reports using no
instrument at all, and it is still in use.

John Thomas Romney Robinson gave the world the instrument in 1846: the cup
anemometer, whose spinning cups turn at a rate proportional to wind speed
regardless of direction. It is still the standard on weather stations, usually
paired with a vane for direction. The propeller anemometer, the hot-wire
anemometer, and — since the mid-20th century — the sonic anemometer, which times
ultrasonic pulses between fixed heads and has no moving parts at all, fill in the
rest of the field.

Units stayed divided by profession: knots at sea and in aviation, meters per
second in science, kilometers or miles per hour on the news. Wind also required
its own derived measures. **Gust** is the peak over a short window against a
sustained average, and the difference matters more to a structure than the average
does. **Wind chill**, first published by Paul Siple and Charles Passel in 1945 and
rebuilt on modern heat-transfer models in 2001, converts wind and temperature into
what the air feels like on skin. The Saffir-Simpson hurricane scale (1971) and the
Enhanced Fujita tornado scale (2007) rate storms by wind speed and the damage it
does.

**What it affects.** Wind carries heat, moisture, dust, smoke, and pollen, so it
governs air quality, wildfire spread, and pollination. It sets structural loads on
buildings, bridges, cranes, and towers — the built environment is designed against
a wind speed a region is expected to see. It determines whether a wind farm
generates power, whether aircraft can land, and whether a small boat should leave
harbor.

### Motion: Sensing Earthquakes

The oldest instrument in this book is Chinese. Around 138 AD Zhang Heng built a
**seismoscope**: a bronze vessel ringed with dragon heads, each holding a ball
over the mouth of a bronze toad. A distant tremor released one ball with an
audible clang, reportedly indicating the direction of a quake several hundred
kilometers away. It detected and it pointed, but it did not record, and nothing
comparable appeared for seventeen centuries.

Luigi Palmieri built an electromagnetic seismograph on the slopes of Vesuvius in
1856 that could record the time of a shock. The modern instrument came from a
group of British scientists working in Japan: John Milne, James Ewing, and Thomas
Gray built the first true seismograph around 1880, using a heavy mass suspended so
that it stays still by inertia while the ground and the frame move beneath it. A
pen attached to the mass draws the ground's motion on a moving drum. Every
seismometer since, including the chip in a phone, works on that principle — measure
the ground against something that resists being moved.

Milne went on to organize the first worldwide network of stations, which made a
new kind of science possible: comparing arrival times at many places to locate an
earthquake, and reading the waves to infer the structure of the Earth's interior.
Seismology began measuring the planet, not just the shaking.

Scales came next, and there are two kinds. **Intensity** describes shaking at a
place from its observed effects — Giuseppe Mercalli's 1902 scale, revised as the
Modified Mercalli scale in 1931 — and it differs from town to town for a single
quake. **Magnitude** describes the size of the event itself. Charles Richter, with
Beno Gutenberg, published the first magnitude scale in 1935 for Southern
California; because it is logarithmic, each whole step is about ten times the
ground motion and roughly thirty-two times the energy. Richter's scale saturates
for very large events, so since 1979 seismologists have used the **moment
magnitude** scale of Hiroo Kanamori and Thomas Hanks, which is computed from the
physical size of the fault slip.

Small, cheap sensing arrived with **MEMS accelerometers** — silicon chips with a
microscopic proof mass on springs, whose displacement is read as a change in
capacitance. Developed for automotive airbags around 1991, they now sit in every
phone. They are far less sensitive than a research seismometer, but there are
billions of them, and dense networks of ordinary devices — the Quake-Catcher
Network from 2008, MyShake from 2016, and the ShakeAlert public warning system on
the US West Coast — can detect a quake's fast P wave and send an alert seconds
before the damaging S wave arrives. That is the class of sensor a student station
can afford.

**What it affects.** Seismic measurements set the building codes that decide how
schools, hospitals, and bridges are designed in a given region; they trigger
automatic shutdowns of trains, gas lines, and industrial plants; they feed tsunami
warnings; they are how nuclear weapons tests are detected worldwide; and they are
still the primary evidence for the structure of the Earth's deep interior.

### Location: Latitude, Longitude, and GPS

A measurement without a place attached is nearly useless — a pressure reading only
means something if you know where and how high it was taken. Latitude was the
easier half: measure the angle of the Sun at noon or of the pole star, and the
answer follows from geometry. Sailors managed it with a quadrant, and later a
sextant, for centuries.

Longitude was a clock problem in disguise. The Earth turns 15 degrees of longitude
every hour, so knowing the time at a reference place and the local time tells you
how far east or west you are — but no clock could keep reference time through
years of ship motion, damp, and temperature swings. Britain's Longitude Act of
1714 put a prize on it. John Harrison, a carpenter and self-taught clockmaker,
spent decades on the problem and produced H4 in 1761, a marine chronometer that
lost only a few seconds on a voyage to Jamaica. Even then, everyone had to agree
on which reference place to use: the International Meridian Conference settled on
Greenwich in 1884, and the same conference laid the groundwork for standard time
zones and a universal day.

The satellite era began with an observation, not a plan. When Sputnik launched in
1957, two researchers at Johns Hopkins, William Guier and George Weiffenbach,
tracked it by the Doppler shift of its radio signal and realized they could
determine its orbit from a known ground position. Their colleague Frank McClure
asked the reverse question: if you know the satellite's orbit, can you find your
position on the ground? That became Transit, the first satellite navigation
system, operational for the US Navy in 1964.

**GPS** — the Global Positioning System — was approved in 1973, launched its first
satellite in 1978, and reached full operation in 1995. It works by timing: each
satellite broadcasts its position and an extremely precise time from an atomic
clock, and a receiver that hears four or more of them solves for its own latitude,
longitude, altitude, and clock error. Until May 2, 2000, the US degraded the
civilian signal deliberately — a policy called Selective Availability — and
switching it off improved civilian accuracy overnight from about 100 meters to
under 10. GPS is now one of several systems, collectively **GNSS**, alongside
Russia's GLONASS, Europe's Galileo, and China's BeiDou. Positions are reported
against the WGS 84 model of the Earth's shape.

A GPS receiver returns three things this station needs. Latitude and longitude say
where the readings were taken. Altitude — less accurate than the horizontal fix,
because of the satellite geometry — matters because barometric pressure falls with
height, and a pressure reading cannot be compared to another station's without it.
And time: GPS delivers a clock accurate to well under a microsecond, which is why
remote stations timestamp in **UTC** rather than local time. UTC has no time zones
and no daylight-saving jump, so records from stations in different countries can be
laid on the same axis without a single ambiguous or duplicated hour.

**What it affects.** Location data is what turns isolated readings into a map, and
maps are what reveal a heat island, a pollution plume, or a storm track. Precise
GPS timing synchronizes the electric grid, cell networks, and financial systems;
GPS-derived positions guide aircraft, shipping, farm equipment, and emergency
response; and continuously recorded GPS positions are themselves a measurement of
the ground, tracking the millimeter-per-year drift of tectonic plates and the
swelling of volcanoes.

## Learning Outcomes

The **primary goal** of this book is for students to understand what is being
measured in the natural environment and how those measurements affect the natural
and man-made environments. The Raspberry Pi station is the means, not the end: it
exists so that students take their own readings, of their own air, in their own
place, and come to trust numbers they produced themselves. Building and
programming skills are taught in service of that understanding.

After this course, students will be able to:

- **Remember:** Name the seven quantities this station measures — temperature,
  barometric pressure, relative humidity, solar radiation, wind speed, ground
  motion, and location — along with the standard unit and typical range of each;
  recall who first measured each quantity and with what instrument (Torricelli and
  the mercury barometer, Fahrenheit and Celsius and their scales, de Saussure and
  the hair hygrometer, Herschel and infrared, Beaufort and his wind scale, Milne
  and the seismograph, Harrison and the marine chronometer); state what one
  atmosphere, the solar constant, the dew point, and moment magnitude mean;
  identify the major components of the station, including the single-board
  computer, the BME280, the power subsystem, and the telemetry module; state what
  the I2C bus does.

- **Understand:** Explain in their own words what each quantity physically *is* —
  that temperature is the motion of atoms, that pressure is the weight of the air
  overhead, that relative humidity is a comparison rather than an amount;
  describe how a sensor converts a physical property into a number a computer can
  store, using the piezoresistive, capacitive, and diode mechanisms inside the
  BME280; explain why warm air holds more water vapor and what that means for dew
  and fog; explain how one measurement drives another, such as solar radiation
  heating the ground, which raises temperature, which changes pressure, which
  produces wind; distinguish accuracy from precision; explain why two thermometers
  a meter apart can legitimately disagree.

- **Apply:** Wire a BME280 to a Raspberry Pi over I2C without damaging either;
  write and modify a Python program that reads the sensors and appends timestamped
  UTC readings to a CSV file on a fixed interval; convert between °C, °F, and K,
  and between inHg, hPa, and atmospheres; calculate dew point from temperature and
  relative humidity, and apparent temperature from temperature, humidity, and wind;
  produce a labeled chart of any measured quantity over time.

- **Analyze:** Examine several days of their own readings and separate the daily
  solar-driven cycle from a passing weather system and from sensor drift; correlate
  two channels — pressure falling as wind rises, temperature dropping as a cloud
  crosses the solar sensor — and explain the physical mechanism connecting them;
  locate outliers and missing intervals in a log file and determine which are
  instrument faults rather than real events; compare their station's readings
  against a nearby official station and account for the differences.

- **Evaluate:** Judge which environmental measurement matters most for a given
  real-world decision — whether to issue a frost warning, size a solar array,
  schedule an irrigation cycle, close a bridge to high-profile vehicles, or
  evacuate ahead of a storm — and defend the choice with data; assess whether a
  proposed solar panel and battery will keep a station running through a week of
  overcast weather; critique a siting decision by predicting how it biases the
  measurements; weigh the trade-off between a cheap MEMS accelerometer and a
  research seismometer for a given purpose; judge the credibility of an
  environmental claim made in a news article by asking what was measured, how, and
  where.

- **Create:** Design, build, deploy, and document a working environmental
  monitoring station that records data unattended and makes it available to
  others; formulate an investigable question about the local environment, collect
  the data needed to answer it, and report the finding; write up the design
  decisions, the data collected, the effects the measurements imply for the
  surrounding natural and built environment, and the limitations of the results,
  for a general audience.

## Why This Book Matters

Environmental data is now the evidence behind decisions students live inside every
day: when their school closes for heat, where a solar farm gets built, how high a
new bridge deck sits above the river, whether a wildfire warning is issued, how a
building is braced against an earthquake. Those decisions are made from numbers
that came out of instruments, and the instruments were built by people who had to
argue about what was worth measuring in the first place.

A student who has wired a sensor, watched it drift, found a bad reading, and
corrected it holds environmental data differently than a student who has only read
about it. They know what a measurement costs, what it can honestly support, and
where it can mislead. That is the difference between consuming data and
understanding it — and it is transferable to any field a student later enters.
