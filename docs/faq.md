---
title: Frequently Asked Questions
description: Answers to the most common questions about building the Raspberry Pi environmental monitoring station, what it measures, and how to read the data, organized by category.
generated_by: claude skill faq-generator
date: 2026-10-05
version: 0.1
category_count: 6
question_count: 91
---
# Frequently Asked Questions

!!! mascot-welcome "Got a Question? Let's Take a Reading!"
    ![Mecha waving welcome](img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every good observer asks questions. Look for yours below, or search the [glossary](glossary.md) for a single term. Check the data, then check it again!

## Getting Started Questions

### What is this book about?

This book teaches you to build a **Raspberry Pi environmental monitoring station**. The station measures temperature, barometric pressure, and humidity, records the readings on its own, and reports them from wherever you put it. The main goal is not the hardware. It is to help you understand *what* is being measured in the natural environment and how those measurements affect the world around us.

Along the way you will learn how sensors turn the world into numbers, how to program the station in Python, and how to read your data critically enough to know when the station is lying to you. Every term is explained before it is used.

For the full plan, read the [course description](course-description.md). To begin, open [Chapter 1: Why We Measure](chapters/01-why-we-measure/index.md).

### Who is this book for?

This book is written for students in **grades 6 to 12** who want to build a working environmental monitoring station. You might use it in a science classroom, an after-school STEM club, or for an independent science fair project. Teachers and club advisors can use it too, even if they are meeting this hardware for the first time.

The reading level is set for middle school, and every technical term is introduced before it is used. Because the grade band is wide, the extension activities and the data-analysis chapters give older students more to explore without leaving younger ones behind.

You can read more about the audience in the [course description](course-description.md).

### Do I need to know programming, Linux, or electronics first?

No. The book assumes you are curious about how measurements are made but new to nearly all of the technology. You do **not** need any programming language, the Linux command line, circuits, voltage, soldering, or how to read a datasheet.

Each skill is taught when you need it. [Chapter 3: Electricity and the Single-Board Computer](chapters/03-electricity-and-computer/index.md) introduces voltage, current, and wiring. [Chapter 12: The Station's Brain](chapters/12-os-and-sensor-buses/index.md) teaches the command line. [Chapter 13: Python Programming](chapters/13-python-programming/index.md) teaches Python from the beginning, using code that reads a real sensor.

If you can use files and folders, type, and connect to a Wi-Fi network, you are ready to start.

### What math and science should I know before starting?

You should be comfortable with arithmetic using decimals, ratios, percentages, and unit conversion. You should be able to read and draw line graphs and scatter plots from a table of data. You should know the basics of physical science: matter, energy, temperature, and the states of matter. You should also be able to follow a written multi-step procedure and record your results in a notebook.

You do not need statistics beyond the mean and the range, and you do not need trigonometry or calculus. When a chapter needs an extra idea, such as scientific notation, it teaches that idea first. [Chapter 2: The Language of Measurement](chapters/02-language-of-measurement/index.md) covers units and conversions step by step.

### What are the seven things the station measures?

The station records seven quantities:

1. **Temperature**, how fast the atoms in the air are moving
2. **Barometric pressure**, the weight of the air above you
3. **Humidity**, how much invisible water is in the air
4. **Solar radiation**, how much energy is arriving from the Sun
5. **Wind speed**, how fast air is moving past you
6. **Ground motion**, whether the earth beneath the station is shaking
7. **Location and time**, exactly where and when every reading was taken

The seventh may seem like it does not belong, but a temperature with no place and no time attached is just a number that used to mean something. Chapters 5 through 11 take these one at a time, starting with [Chapter 5: Time and Place](chapters/05-time-and-place/index.md).

### What hardware does the station use?

The remote station is built around a **Raspberry Pi Zero 2 W**, a small single-board computer chosen for its size, low power draw, built-in Wi-Fi, and low cost. It runs **Ubuntu 24.04 Server**. A **BME280** sensor chip measures temperature, pressure, and humidity, and a **SIM7600A** module provides the cellular link and location. A second computer, a Raspberry Pi 2B running Raspberry Pi OS, acts as the base station that receives the data.

The tested-configuration table lists the solar and seismic sensors as still to be decided, so check the [components page](components.md) for the current list. [Chapter 3](chapters/03-electricity-and-computer/index.md) explains why single-board computers are a good choice for a station like this.

### How is the book organized?

The 17 chapters build on one another, so read them in order.

- **Chapters 1 and 2** explain what monitoring is and how measurements are described, including units, accuracy, and uncertainty.
- **Chapters 3 and 4** cover the electricity, the computer, and how sensors work.
- **Chapter 5** covers time and place.
- **Chapters 6 to 11** take on one measurement at a time: temperature, pressure, humidity, solar radiation, wind, and ground motion.
- **Chapters 12 to 14** teach the operating system, Python, and data logging.
- **Chapter 15** covers charting and analyzing your data.
- **Chapter 16** builds the station for the outdoors.
- **Chapter 17** follows each measurement out into the world, to forecasts, farms, and building codes.

Start with the [list of chapters](chapters/index.md). Each chapter opens with a summary and a list of the concepts it covers.

### Do I need to solder anything?

No. The book leaves out soldering, circuit design, and circuit board layout. Every connection in the station is made with **jumper wires**, which are temporary wires with connectors on the ends, and a **breadboard** when you need one. That keeps the build safe and easy to change if you make a mistake.

If a wire comes loose, you can simply push it back in. That makes mistakes cheap to fix and keeps the build friendly for beginners.

You still need to be careful. Your Raspberry Pi's pins run at 3.3 volts, and static electricity can damage a board even when you cannot feel it. [Chapter 3](chapters/03-electricity-and-computer/index.md) shows how to wire safely and how to ground yourself before you touch the hardware.

### What are MicroSims and how do I use them?

A **MicroSim** is a small interactive model that runs right in your web browser. You can drag a slider, click a part of a diagram, or sort examples into bins and see the result right away. They are built into the chapters, close to the idea they explain.

For example, the Atmospheric Layers Explorer in [Chapter 1](chapters/01-why-we-measure/index.md) lets you slide up through the atmosphere to see how thin the weather layer really is. The Observation or Measurement Sorter lets you test whether you can tell a measurement from an observation, and tells you why each answer is right or wrong.

You can find all of them on the [MicroSims page](sims/index.md). Try them after you read the section they belong to.

### How do the quizzes and "Check Yourself" questions work?

Each chapter ends with a **Check Yourself** section. These are short questions with a hidden answer that you click to reveal, so you can test your thinking before you check it.

Each chapter also has a separate **Quiz** page with 10 multiple-choice questions. Pick your answer first, then open "Show Answer" to see which choice is right and why the other choices are wrong. The questions start with remembering facts and move up to applying and analyzing them.

You will find the quiz under each chapter's name in the sidebar menu. If a question trips you up, go back to the chapter section it points to and read it again. Mistakes are clues, not failures. Try the first quiz at [Chapter 1](chapters/01-why-we-measure/index.md).

### Who is Mecha the Clockwork Owl?

**Mecha** is the learning mascot of this book: a gold-and-brass clockwork owl with big round silver lens eyes. Mecha is observant, patient, and curious, and uses the pronouns "they" and "them." Mecha pops up in colored boxes in the chapters to welcome you, point out a tip, warn you about a common mistake, or celebrate when you finish a section.

Mecha's catchphrase is **"Let's take a reading!"** and Mecha calls readers "observers" or "station builders." Mecha treats bad readings, loose wires, and crashed scripts as clues, not failures, which is a good way to think about your own station too.

### What topics does this book not cover?

To keep the book short enough to finish, it leaves out several larger topics. These include circuit design, soldering, and circuit board layout; analog electronics theory; the chemistry of the atmosphere; weather prediction and climate computer models; advanced statistics such as hypothesis testing; machine learning on sensor data; network security beyond running one service; earthquake prediction and fault mechanics; and manufacturing a sensor yourself.

The book *does* explain how sensors work, why earthquake warning is not prediction, and how forecasters use your kind of data. It just does not go deeper than a station builder needs. The [course description](course-description.md) lists the boundaries in full.

### Can a teacher or club advisor use this book without being an expert?

Yes. The book was written with teachers and club advisors in mind, including those who are using this hardware for the first time. Nothing is assumed about Linux, electronics, or Python. Each chapter has a summary, a concept list, step-by-step explanations, a quiz, and Check Yourself questions that make it easy to see what students have understood.

A good habit is to build the station alongside your students and read each chapter first. When something does not work, treat it as a puzzle. The book shows how to separate a wiring fault from a code fault with a single command in [Chapter 12](chapters/12-os-and-sensor-buses/index.md). See the [course description](course-description.md) for the learning outcomes you can use for planning.

---

## Core Concepts

### What is environmental monitoring?

**Environmental monitoring** means measuring conditions in the natural environment over and over, in the same place, for a long time. Every part of that sentence matters. *Measuring* means recording numbers, not just describing. *Over and over* means one reading is not enough. *The same place* means readings can be compared with each other. *A long time* is what turns a pile of numbers into a story.

That is what makes monitoring different from an ordinary experiment. An experiment may collect data for an afternoon. A monitoring station asks questions like "Is it getting warmer here?" that only a year of readings can answer. See [Chapter 1: Why We Measure](chapters/01-why-we-measure/index.md).

### What is the difference between an observation and a measurement?

A **qualitative observation** describes something without a number, such as "The wind is strong." **Quantitative data** has both a number and a unit, such as "Wind speed is 24 kilometers per hour." A **measurement** is the act of comparing something to an agreed standard and reporting a number with a unit.

Both are useful. Observations are how you *notice* that something is worth measuring. But only numbers with units can be graphed or compared with last year. "The temperature is 25" is not quantitative data, because no one knows whether it is Celsius or Fahrenheit. Try the sorter in [Chapter 1](chapters/01-why-we-measure/index.md).

### What is a physical property?

A **physical property** is a feature of an object or place that can be described by a number. Temperature, pressure, length, mass, speed, and brightness are all physical properties. You can build an instrument for each one, because each can be compared with an agreed standard.

A quick test is to ask whether you could compare it with a standard and report a number. If you can, it is probably a physical property, and you can measure it.

Words like "beautiful" or "scary" are not physical properties. There is nothing physical to compare with a standard, so no instrument can read them out. Environmental monitoring only works with physical properties. Your station's seven quantities are all examples. See [Chapter 1](chapters/01-why-we-measure/index.md) and the [glossary](glossary.md).

### What is the difference between weather and climate?

**Weather** is the state of the atmosphere at one place at one time. It changes from hour to hour. **Climate** is the pattern of weather at a place, averaged over a long time. The standard averaging period is 30 years.

A short way to remember it: *climate is what you expect, and weather is what you get.* If you plan a July picnic in Arizona, you are using climate, because you expect heat. If it rains on the picnic, that is weather. Meteorologists forecast weather over hours to about two weeks. Climatologists study patterns over decades or longer. Read more in [Chapter 1](chapters/01-why-we-measure/index.md).

### Can my station measure climate?

Not by itself. Your station measures **weather**, the state of the air at this moment. Climate is what you get when someone averages about 30 years of weather. One school year of readings is not enough to establish a climate trend.

Your station does help, though. Every climate record is built from weather readings taken one at a time by people who kept showing up. When you log honest, well-labeled data over many years, you are doing the part of the work that climate science rests on. [Chapter 15](chapters/15-charting-and-analysis/index.md) explains how much data a trend needs, and [Chapter 17](chapters/17-measurement-to-consequence/index.md) explains how climate records are built and corrected.

### What is the atmosphere, and which layer does my station measure?

The **atmosphere** is the layer of gases held around Earth by gravity. It is about 78 percent nitrogen and 21 percent oxygen, and the last one percent holds argon, carbon dioxide, and water vapor. Scientists divide it into **atmospheric layers**: the troposphere, stratosphere, mesosphere, thermosphere, and exosphere.

Remember that the atmosphere has no lid. It simply gets thinner with height until there is effectively nothing left, which is why the layers have no sharp edge.

Your station sits in the first few meters of the **troposphere**, which reaches from the ground to about 12 kilometers. All weather happens there. The weather layer is a very thin sliver compared with the whole atmosphere, which you can see on the Atmospheric Layers Explorer in [Chapter 1](chapters/01-why-we-measure/index.md).

### What is an air mass, and why does it matter for my readings?

An **air mass** is a large body of air, often hundreds of kilometers across, with roughly the same temperature and moisture throughout. It takes on its character from where it forms. Air that sits over the Gulf of Mexico for a week becomes warm and wet. Air that sits over northern Canada becomes cold and dry.

When an air mass moves, it carries those properties with it. That is why your readings change: you are usually not watching one body of air warm up and cool down, you are watching different air masses arrive and leave. A cold snap in Texas is often just Canadian air that went for a walk. See [Chapter 1](chapters/01-why-we-measure/index.md) and [Chapter 10](chapters/10-wind/index.md) for fronts.

### Why can't I just use a number without a unit?

A **unit of measure** is an agreed amount that other amounts are compared with. Without a unit, a number means nothing. "The temperature is 25" could be a warm day in Celsius or a very cold day in Fahrenheit.

Units are also a social agreement. **Standardization** is the work of getting everyone to use the same definitions, and a **reference standard** is the physical object or procedure that those definitions point to. That is why your reading of 21 °C means the same thing to a scientist in another country. A good habit is to put the unit in every variable name, such as `pressure_hpa`. See [Chapter 2: The Language of Measurement](chapters/02-language-of-measurement/index.md).

### What are SI units?

**SI units** are the worldwide standard system of measurement, built on **seven base units**. Every other unit is made from combinations of them. **SI prefixes** such as kilo and milli scale a unit up or down by powers of ten, so one kilometer is 1,000 meters and one millimeter is one thousandth of a meter.

The system makes conversions simple, because you move the decimal point instead of using awkward factors. Your station will log mostly in SI-friendly units: degrees Celsius, hectopascals, meters per second, and watts per square meter. Some fields use older units too, so [Chapter 2](chapters/02-language-of-measurement/index.md) shows how to convert by multiplying by a fraction equal to one.

### What is the difference between accuracy, precision, and resolution?

These three words sound alike but mean different things, and they are independent of each other.

- **Accuracy** is how close a reading is to the true value.
- **Precision** is how consistent repeated readings are with each other.
- **Resolution** is the smallest change the instrument can detect.

Picture darts on a target. Darts all landing together but far from the bullseye are precise but not accurate. A thermometer that shows 21.37 °C has fine resolution, but it can still be wrong if it was never calibrated. Add **measurement uncertainty**, an honest statement of how far off a reading might be, and you can judge your own data. See [Chapter 2](chapters/02-language-of-measurement/index.md) and the Accuracy Versus Precision MicroSim.

### What is temperature?

**Temperature** is a measure of the average **kinetic energy of atoms**, which means how fast they are moving. Cold is not a substance. It is simply less motion. Heat moves from hot things to cold things by **conduction**, **convection**, and **infrared radiation**.

Be careful with two ideas. **Air temperature** and **surface temperature** are different quantities, and on a summer afternoon they can differ by 30 °C. Also, Celsius has an arbitrary zero, so 20 °C is not twice as warm as 10 °C. Chapter 6 tells how thermometers developed, from the thermoscope to the silicon diode inside the BME280. See [Chapter 6: Temperature](chapters/06-temperature/index.md).

### What is barometric pressure?

**Barometric pressure** is the weight of the atmosphere above a point. Pressure itself is force divided by area. The air overhead presses down on everything, including you, with about 1013 hectopascals at sea level.

In 1643, Torricelli showed that the atmosphere can hold up a 760 mm column of mercury, which proved the air has weight. In 1648 a barometer carried up a mountain, the Puy de Dome experiment, read lower pressure at the top. Pressure falls about 12 hPa for every 100 meters you climb, which is why your station needs to know its elevation. See [Chapter 7: Barometric Pressure](chapters/07-barometric-pressure/index.md).

### What is relative humidity, and how is it different from absolute humidity?

**Absolute humidity** is the mass of water vapor in a given volume of air. **Relative humidity** is a comparison: the ratio of the vapor actually in the air to the most the air could hold at that temperature, which is its saturation level. It is given as a percentage.

Relative humidity is a comparison, not an amount. Because warm air can hold much more vapor, the same air can show a lower relative humidity as it warms, without losing any water. Cooling raises it. That is why 88 percent humidity feels muggy on a warm day, and why fog forms on a cool night. See [Chapter 8: Humidity and Dew Point](chapters/08-humidity-and-dew-point/index.md).

### What is the dew point?

The **dew point** is the temperature at which air becomes saturated and water vapor begins to condense into liquid. If you cool the air to its dew point, dew, frost, or fog starts to form.

Dew point is useful for three reasons. It is an *absolute* measure of how much moisture is in the air, so it does not change just because the temperature does. It predicts comfort well, since high dew points feel sticky. And it can never be higher than the air temperature. When the two get close, expect fog or dew. The BME280's temperature and humidity readings are enough to calculate it. See [Chapter 8](chapters/08-humidity-and-dew-point/index.md).

### What is solar radiation, and how is it measured?

**Solar radiation** is the energy arriving from the Sun. It drives temperature, evaporation, and wind. About 50 percent arrives as infrared, 43 percent as visible light, and 7 percent as ultraviolet.

The amount arriving on a surface is **irradiance**, measured in **watts per square meter**. At the top of the atmosphere it is about 1361 W/m², called the solar constant. A **pyranometer** measures total sky irradiance, and a **pyrheliometer** measures only the direct beam. Cheaper stations use a **photodiode**, which is fast and cheap but does not respond evenly to all colors of light. Seasons are caused by the tilt of Earth's axis, not by distance. See [Chapter 9: Solar Radiation](chapters/09-solar-radiation/index.md).

### What causes wind?

**Wind** is air moving from high pressure to low pressure. The **pressure gradient**, meaning how quickly pressure changes with distance, sets how strong the wind is. Tight lines on a weather map (isobars) mean strong wind. The absolute pressure value does not.

So the next time you feel a breeze, you are feeling air flow from higher pressure toward lower pressure, as it tries to even out the difference.

**High pressure systems** have sinking air and usually fair weather. **Low pressure systems** have rising air, cloud, and rain. A **weather front** is the boundary between two air masses. Wind direction is reported as the direction the wind comes *from*, in degrees clockwise from north. Wind speed is measured with an **anemometer**. See [Chapter 10: Wind](chapters/10-wind/index.md).

### What is the difference between earthquake magnitude and intensity?

**Magnitude** describes the earthquake itself: how much energy it released. Each earthquake has one magnitude value. **Intensity** describes the shaking at a particular place, so one earthquake has many intensity values. It is lower far away and higher close by.

The **Mercalli intensity scale** rates observed effects from I to XII, such as rattling windows or damaged buildings. The **moment magnitude scale** measures the physical rupture of the fault. A useful comparison is a light bulb and a room. Magnitude is the wattage of the bulb, and intensity is how bright the room is where you are standing. See [Chapter 11: Ground Motion](chapters/11-ground-motion/index.md).

### What is a sensor, and what is transduction?

A **sensor** detects a physical property and turns it into an electrical signal. **Transduction** is the name for that conversion. It works because certain materials change an electrical property when the physical world changes them. Heat changes the voltage across a silicon diode. Pressure bends a tiny membrane and changes its resistance, called the piezoresistive effect. Water in a polymer film changes how much charge a gap can store, which is capacitance.

Transduction also explains why a sensor's raw output is often a voltage or a resistance, which software must then convert into a physical unit.

The BME280 uses all three: a piezoresistive element for pressure, a capacitive element for humidity, and a silicon diode for temperature. See [Chapter 4: How Sensors Work](chapters/04-how-sensors-work/index.md).

### Why does the station record location and time with every reading?

A reading with no place and no time attached cannot be compared with any other reading. Time tells you *when* a value happened, so you can see change. Location tells you *where*, and **elevation** is especially important, because air pressure falls about 12 hPa for every 100 m of height. Without elevation, you cannot turn a pressure reading into **sea level pressure**, which is how stations are compared.

Together, many stations with locations become a map. Maps are how heat islands, storm tracks, and pollution plumes become visible. Your coordinates come from GPS, using latitude, longitude, and the WGS 84 datum. See [Chapter 5: Time and Place](chapters/05-time-and-place/index.md).

### Why should every timestamp use UTC?

**Coordinated Universal Time (UTC)** is one clock for the whole world, with no daylight saving changes. A station that records local time creates problems. When clocks go back in the fall, an hour happens twice, so you get **duplicate** timestamps. When clocks go forward in the spring, an hour is missing. Records from stations in different time zones can not be sorted together.

A simple rule to remember is: store in UTC, show in local time. That one habit prevents many confusing mix-ups later.

Recording in UTC with the **ISO 8601** format, for example `2026-10-05T14:30:00Z`, keeps every row unique and sortable. You can always convert to local time when you make a chart. See [Chapter 5](chapters/05-time-and-place/index.md) and [Chapter 14](chapters/14-data-logging/index.md).

### How do the seven measurements affect one another?

They are linked, which is why one station measuring all of them is so useful. **Solar radiation** heats the ground, which raises temperature and drives evaporation. Warm air rises, and rising air lowers pressure at the surface. **Pressure differences** between places set up a **pressure gradient**, and that moves the air as **wind**. Wind carries **air masses** that bring new temperature and humidity. Warm air holds more vapor, so humidity readings shift as temperature does.

This is why Chapter 17 says evapotranspiration, the water plants and soil lose to the air, needs four of your seven measurements, and why wind and humidity together matter for wildfire risk. When one reading looks strange, check the others. See [Chapter 9](chapters/09-solar-radiation/index.md), [Chapter 10](chapters/10-wind/index.md), and [Chapter 17](chapters/17-measurement-to-consequence/index.md).

### What is an operating system, and why does the station use Ubuntu Server?

An **operating system** manages the hardware, runs programs, organizes files, and controls who can do what. Your remote station uses **Ubuntu Server**, and the base station uses Raspberry Pi OS. Both are based on Debian Linux.

Ubuntu Server has no desktop, no icons, and no mouse. You control it with the **command line interface**, which works well over slow connections and does not waste power drawing a screen nobody is looking at. The file system is one tree starting at `/`, and hardware devices appear as files under `/dev`, which is why sensor code looks a lot like file handling. See [Chapter 12: The Station's Brain](chapters/12-os-and-sensor-buses/index.md).

### What is the I2C bus?

The **I2C bus** is a way for the Raspberry Pi to talk to sensors using only **two wires**: one for data and one for the clock. Many devices can share the same two wires, because each device has its own **I2C device address**. The BME280 is one such device.

I2C needs **pull-up resistors** to hold the lines high when nobody is talking, and most breakout boards already include them. A very handy tool is `i2cdetect`, which lists the addresses it can hear. If your sensor shows up, the wiring is fine. If it does not, you have a wiring problem rather than a code problem. The SPI bus is faster but needs more pins, and serial UART links two devices directly. See [Chapter 12](chapters/12-os-and-sensor-buses/index.md).

### What is a time series?

A **time series** is a set of measurements taken over time, in order. It has three features that make it special: the readings come in a **sequence**, they are spaced at known **intervals**, and neighbors are related. Your temperature one minute from now will be close to your temperature now.

Each observation is a **data record**, which is one row in a file. Each value in the row is a **data field**. Because the order matters, you must never shuffle the rows, and you should never draw a line across a gap where data is missing. A line chart is the default way to show a time series. See [Chapter 14: Data Logging](chapters/14-data-logging/index.md) and [Chapter 15](chapters/15-charting-and-analysis/index.md).

---

## Technical Detail Questions

### Why do the GPIO pins need only 3.3 volts?

The **GPIO pins** are the software-controlled connections on the Raspberry Pi's **pin header**. They run at **3.3 volts, and they are not 5 V tolerant**. That means a 5 V signal on a GPIO pin can damage the board. Many sensors are happy at 3.3 V, and the BME280 breakout boards are designed to work at that level.

Always check your sensor's **datasheet** for its supply voltage before connecting anything. **Voltage** is electrical pressure measured between two points, **current** is the rate of flow, and **ground** is the 0 V reference that completes every circuit. See [Chapter 3: Electricity and the Single-Board Computer](chapters/03-electricity-and-computer/index.md).

### What does a pull-up resistor do?

A **pull-up resistor** holds a signal line at a high voltage when nothing is driving it. Without one, an unconnected input is **floating**: it picks up stray electrical noise and may flip between high and low at random, which your program reads as nonsense.

The I2C bus needs pull-up resistors on both of its wires. The good news is that most sensor breakout boards already include them, so you rarely add your own. If you see odd data from an I2C sensor even when the wiring looks right, a missing or doubled pull-up is one thing to suspect. See [Chapter 3](chapters/03-electricity-and-computer/index.md) and [Chapter 12](chapters/12-os-and-sensor-buses/index.md).

### What is analog-to-digital conversion?

An **analog signal** varies smoothly, like a voltage that can be any value. A **digital signal** has a limited set of values, like numbers a computer can store. **Analog-to-digital conversion** changes the first into the second in two steps. **Sampling** measures the signal at moments in time. **Quantizing** rounds each measurement to the nearest step available.

Both steps throw information away, but different information. Sampling loses what happens *between* samples, and quantizing loses detail *smaller than a step*. Digital signals survive noise and copying much better than analog ones, which is why sensors like the BME280 convert to digital inside the chip. Try the Analog to Digital Conversion Step-Through in [Chapter 4](chapters/04-how-sensors-work/index.md).

### What is sensor response time, and why does it matter?

**Sensor response time** is how long a sensor takes to show a change. If you dunk a thermometer from a cold room into warm water, it does not jump to the new value instantly. It climbs over several seconds.

The key rule is: *never sample faster than the sensor can respond.* Reading a slow sensor many times per second only gives you the same value repeated. Response time also helps you choose a **sampling interval**. Temperature changes slowly, so once a minute is fine. Wind and ground motion change in seconds or less. Related ideas are **sensor averaging**, which cuts random noise by the square root of the number of readings, and **sensor filtering**, which can hide real events if overdone. See [Chapter 4](chapters/04-how-sensors-work/index.md).

### What are the seven questions a sensor datasheet answers?

A **sensor datasheet** is the manufacturer's document describing a part. You do not have to read every page. Look for seven answers:

1. **Range**: the smallest and largest values it can read
2. **Accuracy**: how close it is to the true value
3. **Resolution**: the smallest change it can detect
4. **Supply voltage**: what power it needs, such as 3.3 V
5. **Current draw**: how much power it uses, which matters for batteries
6. **Interface**: how it talks, such as I2C
7. **Response time**: how quickly it reacts to change

If the answer to the supply voltage question is 5 V and your Pi is 3.3 V, you have found a problem before you wired anything. See [Chapter 4](chapters/04-how-sensors-work/index.md).

### What does the BME280 sensor contain?

The **BME280** is one small chip that measures temperature, pressure, and humidity. Inside are three different sensing parts. A **piezoresistive** element measures pressure, because pressure flexes a tiny membrane and changes its resistance. A **capacitive** polymer film measures humidity, because water absorbed into the film changes its capacitance. A **silicon diode** measures temperature.

The temperature reading also **compensates** the other two, since both pressure and humidity elements are affected by temperature. It connects to the Raspberry Pi over the I2C bus. It does not measure solar radiation, wind, or ground motion. See [Chapter 12](chapters/12-os-and-sensor-buses/index.md) and the temperature, pressure, and humidity chapters, [6](chapters/06-temperature/index.md), [7](chapters/07-barometric-pressure/index.md), and [8](chapters/08-humidity-and-dew-point/index.md).

### What are hectopascals, millibars, and inches of mercury?

They are all units of pressure. The **pascal** is the SI unit, and a **hectopascal (hPa)** is 100 pascals. A **millibar** equals one hectopascal exactly, so 1 hPa = 1 mbar. **Inches of mercury (inHg)** comes from the height of a mercury barometer column and is still used in US weather reports and aviation.

When you read a weather report, check which unit it uses before comparing it with your station. A reading of 29.92 and a reading of 1013 can describe the exact same pressure.

**One atmosphere** is standard sea-level pressure: **1013.25 hPa**, which is also 29.92 inHg and 760 mm of mercury. All of these describe the same thing, the weight of the air overhead. Your station will log hPa. See [Chapter 7: Barometric Pressure](chapters/07-barometric-pressure/index.md).

### What is sea level pressure, and why is it calculated?

**Sea level pressure** is the pressure a station *would* read if it were moved down to sea level. Pressure falls about 12 hPa for every 100 meters of height, so a station on a hill reads lower than one at the beach even in the same weather. If you compared the raw readings, you would think the hill had a storm.

To fix this, weather services apply a correction using the station's **elevation**. Then readings from different places can be compared fairly. The same physics works backward: if you know the pressure, you can find your height, which is called **pressure altitude**, and is what an aircraft **altimeter** uses. See [Chapter 7](chapters/07-barometric-pressure/index.md).

### How are the Celsius, Fahrenheit, and Kelvin scales different?

The **Fahrenheit scale** (1724) made thermometers reproducible. The **Celsius scale** (1742) uses two fixed points: the freezing point of water and the boiling point of water. The **Kelvin scale** (1848) starts at **absolute zero**, which is −273.15 °C, the point where atoms have the least possible motion.

Because Celsius and Fahrenheit have arbitrary zeros, converting between them needs both a ratio and an offset. But a temperature *difference* uses only the ratio. Kelvin has a true zero, so 200 K really is twice 100 K, which makes it the scale scientists use for physics. Your station logs Celsius. See [Chapter 6: Temperature](chapters/06-temperature/index.md) and [Chapter 2](chapters/02-language-of-measurement/index.md).

### What is a Stevenson screen?

A **Stevenson screen** is the standard white, louvered box used to hold thermometers outdoors. Its job is to make temperature readings comparable. Without shade, airflow, and a standard height, a thermometer measures *itself*, heated by the Sun, instead of the air.

The white color reflects sunlight, and the louvers (slanted slats) let air pass through. Your station needs the same idea: the BME280 should sit in a vented **radiation shield** so that the sensor reads the air and not the sunshine. This matters because **air temperature** and **surface temperature** can differ by 30 °C on a summer afternoon. See [Chapter 6](chapters/06-temperature/index.md) and [Chapter 16](chapters/16-building-for-outdoors/index.md).

### What is the difference between a cup anemometer and a sonic anemometer?

A **cup anemometer** (invented in 1846) has cups that spin faster as the wind blows harder. It is the standard for stations and is cheap and sturdy. But it has moving parts, a minimum speed needed to start turning (called the stall speed), and a slower response.

A **sonic anemometer** measures how wind changes the travel time of sound between sensors. It has no moving parts, no stall speed, and a much faster response, but it costs more. Wind speed is reported in **meters per second** (the SI unit), or in **knots**, which are common in marine and aviation work. See [Chapter 10: Wind](chapters/10-wind/index.md).

### What is the Beaufort scale?

The **Beaufort scale** rates wind by what you can *see* it do, with no instrument needed. For example, small trees begin to sway at a certain level, and umbrellas become hard to use at a higher one. It was created to standardize wind reports before anemometers were common.

It is an **ordinal** scale, which means the numbers show order (force 6 is stronger than force 5), but the steps are not equal amounts of wind. A related idea is the **Enhanced Fujita scale**, which rates tornadoes by looking at the damage and inferring wind speed. Both are ways of turning an observation into a rating. See [Chapter 10](chapters/10-wind/index.md).

### What is the difference between P waves and S waves?

Both are **seismic waves**, which carry the energy released when a fault slips. The **P wave** is a compressional wave: it pushes and pulls in the direction it travels. It is the faster wave, so it arrives first. The **S wave** is a shear wave: it shakes the ground side to side. It is slower, and it does most of the damage.

S waves cannot travel through liquid. That is how scientists discovered that Earth's outer core is liquid. The gap between P and S arrival is what makes **earthquake early warning** possible, because radio signals travel faster than either wave. See [Chapter 11: Ground Motion](chapters/11-ground-motion/index.md).

### How do the Richter scale and the moment magnitude scale differ?

The **Richter scale** (1935) is **logarithmic**: each whole step means 10 times more ground motion and about 32 times more energy. A magnitude 6 is therefore not "a bit more" than a 5. But the Richter scale **saturates**, meaning it stops telling large earthquakes apart above about magnitude 7.

The **moment magnitude scale** (1979) measures the physical size of the rupture, including how much rock slipped and how far, and it does not saturate. It is the scale used today for big earthquakes. A **logarithmic scale** is useful whenever values span many orders of magnitude, so [Chapter 2](chapters/02-language-of-measurement/index.md) introduces the idea first. See [Chapter 11](chapters/11-ground-motion/index.md).

### Why does GPS need four satellites?

**GPS** finds your position by **trilateration**: measuring your distance from several **GPS satellites** and finding the point that fits. Each satellite carries an **atomic clock** and broadcasts the time it sent its signal. Distance is the signal's travel time multiplied by the speed of light.

Three satellites would be enough if your receiver had a perfect clock. But yours does not, so its clock error is a fourth unknown, and you need a fourth satellite to solve for it. **GNSS** is the umbrella term that includes GPS, GLONASS, Galileo, and BeiDou. Vertical accuracy is always worse than horizontal accuracy. See [Chapter 5: Time and Place](chapters/05-time-and-place/index.md).

### What are file permissions on Linux?

**File permissions** control who can read, write, or run a file. There are three permissions, **read**, **write**, and **execute**, and each can be set for three kinds of user: the **owner**, the **group**, and **others**.

If a script says "permission denied," it often lacks execute permission or you are not in the right group. Adding yourself to a group, such as the one that controls the I2C device, does not take effect until you **log in again**. You can also make a Python script run directly by adding a shebang line and execute permission. See [Chapter 12](chapters/12-os-and-sensor-buses/index.md) and [Chapter 13](chapters/13-python-programming/index.md).

### What is a systemd service?

A **systemd service** is a program that the operating system starts, watches, and restarts for you. For a station, this is how your logger starts automatically at boot and keeps running after you disconnect. If the logger crashes, systemd can restart it.

Think of it as a helper that keeps your logger on duty even when nobody is watching, which is exactly what a remote station needs.

Without a service, your script stops when you close your terminal window. The way to test a service is to **reboot the Pi** and check that the logger starts by itself. Installing software uses `apt`, and you should always run `apt update` first so it sees the newest package list. See [Chapter 12: The Station's Brain](chapters/12-os-and-sensor-buses/index.md).

### What is a CSV file, and why use one for logging?

A **CSV file** (comma-separated values) is a plain text file where each line is one **data record** and the values are separated by commas. It is a good choice for logging because almost every program can read it, you can open it in a text editor, new rows are simple to append, and it lasts.

The first line is the **header row**, which names each column. Put the unit in every column name, such as `temperature_c` or `pressure_hpa`, because a data file without units is a puzzle. A **database** is faster for large searches but is harder to read. [Chapter 14](chapters/14-data-logging/index.md) recommends starting with CSV.

### What is the difference between sustained wind and a wind gust?

**Sustained wind speed** is the average wind speed over a defined period, conventionally two minutes in the United States and ten minutes by the World Meteorological Organization. A **wind gust** is the peak speed over a short interval, and is reported when it exceeds the sustained speed by a defined margin, conventionally 5 knots (about 2.6 m/s).

Both are calculated from fast samples. That is why wind is sampled every second or two but logged once a minute: the raw samples are temporary, and the summary is the record. The window matters, too. The **Saffir Simpson scale** rates hurricanes by sustained wind, so the category depends on which window you use. See [Chapter 15](chapters/15-charting-and-analysis/index.md).

---

## Common Challenge Questions

### Why does my station disagree with the local weather report?

Small differences are normal, and there are several likely causes. First, **siting and exposure**: official stations follow strict rules about shade, height, and the surface underneath. A station next to a wall or a parking lot can read warmer. Second, **elevation**: raw pressure depends on height, so compare only **sea level pressure**. Third, **distance**: weather can differ across even a short distance. Fourth, **calibration**: your sensor may be a little off.

To investigate, check each cause one at a time, and keep notes. Compare your readings with a nearby official station over several days to see whether the gap is steady (calibration) or changes with the weather (siting). See [Chapter 16](chapters/16-building-for-outdoors/index.md) and [Chapter 2](chapters/02-language-of-measurement/index.md).

### Why does my temperature reading spike in the afternoon sun?

Probably your sensor is measuring the Sun, not the air. Direct sunlight heats the sensor and its board, so it reads **surface temperature** more than **air temperature**, which can differ by 30 °C on a summer afternoon. Heat from the Pi itself can also warm a sensor that sits too close.

Fix it by moving the BME280 into a white, vented **radiation shield** (like a mini Stevenson screen), placing it away from the computer, and making sure air can flow past it. A good test is to compare the shaded reading with a second thermometer. In a black enclosure, summer sun can push the inside above 60 °C. See [Chapter 6](chapters/06-temperature/index.md) and [Chapter 16](chapters/16-building-for-outdoors/index.md).

### My sensor does not show up in i2cdetect. What do I check?

This is useful news: `i2cdetect` separates a **wiring fault** from a **code fault** immediately. If the address does not appear, the problem is in the hardware or the connection, and rewriting your Python will not help.

Check these in order. First, power the board off before changing wires. Second, confirm the sensor gets **3.3 V** and ground. Third, check that the **data and clock wires** are on the right pins and are not swapped. Fourth, push every jumper wire in firmly. Fifth, check the board has **pull-up resistors**. If the address shows up but your code fails, the issue is in the program. See [Chapter 12](chapters/12-os-and-sensor-buses/index.md) and [Chapter 3](chapters/03-electricity-and-computer/index.md).

### My program crashes once in a while. How do I keep the station running?

Stations run for months, so rare errors will happen. A sensor can fail to answer once and then work again. The fix is **exception handling**: put the risky sensor read in a `try` block and catch the error in an `except` block, so one bad read does not stop the program.

Follow three rules. **Catch specific errors**, not everything. **Never write a bare `except: pass`**, because it hides problems. And **always log the failure** with a timestamp, so you can look later. A gap in your data with a matching line such as `Sensor read failed` is a diagnosed gap. A gap with nothing in the log is a mystery. Pair this with a systemd service that restarts the program. See [Chapter 13](chapters/13-python-programming/index.md) and [Chapter 14](chapters/14-data-logging/index.md).

### Why do I get "permission denied"?

This usually means the file or device does not allow your user to do what you are trying. There are three common causes. A script may lack **execute permission**. A file may belong to another user. Or you may need to be in a **group** that controls a device, such as the one for the I2C bus.

Check with `ls -l` to see the permissions. If you add yourself to a group, remember that **group changes only take effect when you log in again**. Many people add themselves and then wonder why nothing changed. Use `sudo` only when you truly need it. See [Chapter 12](chapters/12-os-and-sensor-buses/index.md).

### Why do my timestamps have a missing hour or a repeated hour?

That is the signature of **local time** with daylight saving changes. In spring, clocks jump forward and one hour never happens. In autumn, clocks fall back and one hour happens twice, so two rows have the same time. A file with this problem can not be sorted reliably, and your charts may show strange gaps or overlaps.

If you already have a file with this problem, keep the original and add a clearly labeled corrected copy, rather than editing the old rows in place.

The cure is to store every timestamp in **UTC** using the **ISO 8601** format. UTC has no daylight saving changes. When you draw a chart for people, convert to local time at that point. See [Chapter 5](chapters/05-time-and-place/index.md) and [Chapter 14](chapters/14-data-logging/index.md).

### A friend says one very cold morning proves climate change is not real. What is wrong with that?

That argument mixes up weather and climate. One cold morning is a single **weather** observation. **Climate** is the pattern averaged over about 30 years. A cold morning is entirely compatible with a warming climate, in the same way that one short student does not mean the school's average height is falling.

A helpful habit is to ask how many years of data a claim rests on. If the answer is one morning, it is weather.

Your own station shows this clearly. In the Weather Versus Climate Explorer, extreme days appear in the data without moving the long-term average at all. To say something about climate, you need decades of readings, not one morning, and also steady methods. See [Chapter 1](chapters/01-why-we-measure/index.md) and [Chapter 15](chapters/15-charting-and-analysis/index.md).

### The relative humidity fell, but no water left the air. How is that possible?

Relative humidity depends on temperature as well as on the amount of water. It is the ratio of the water vapor present to the most the air could hold at that temperature. Warm air can hold much more, and the amount rises steeply with temperature.

So when the air warms during the day, the same vapor is a smaller fraction of what the air could hold, and the relative humidity drops. At night the opposite happens: cooling raises relative humidity without adding any water, which is what produces **dew, frost, and fog**. The **dew point** will stay steady in a case like this, which is why it is a better measure of the actual moisture. See [Chapter 8](chapters/08-humidity-and-dew-point/index.md).

### My chart has a strange spike. Is it a bad reading?

Maybe, but do not delete it yet. An **outlier** is a question, not an answer. Ask whether other channels agree. If temperature jumps 10 °C in one minute but pressure and humidity did not change, the sensor probably glitched. If several channels moved together, it may be real, such as a cold front or a door opening nearby.

Use **data validation**: a **range check** (is the value physically possible?) and a **rate-of-change check** (did it change too fast?). Then **flag** the point, but never delete it. Flagged data keeps the record honest and lets someone else decide later. Also remember that a moving average can smooth away real events, so keep the raw data. See [Chapter 15: Charting and Analysis](chapters/15-charting-and-analysis/index.md).

### Why does my line chart have gaps, and should I fill them?

A gap means readings are **missing data**. Maybe the station lost power, the program crashed, or the network dropped. A line chart should never draw a line *across* a gap, because that makes up values that were never measured.

Keep missing data **visible**. Show it as a break in the line, and use the log to explain it. Do not fill it with made-up numbers unless you clearly say so. If the log has a matching error line, the gap is diagnosed. Over time, you can reduce gaps with a systemd service, exception handling, and a good power budget. See [Chapter 15](chapters/15-charting-and-analysis/index.md) and [Chapter 16](chapters/16-building-for-outdoors/index.md).

### Why does my station run out of power overnight or in winter?

The most likely cause is a **power budget** that was sized for summer, or for the daytime. A power budget compares how much energy the station uses with how much it can collect and store. The computer and radio use most of the energy. The sensors use almost none.

Check four things. **Battery capacity** must be reduced for depth of discharge and for cold weather. The **solar panel** must be sized for the **worst month's** insolation, not summer. A **charge controller** is required. And try **duty cycling**: turning off HDMI and LEDs and sending data in batches can cut use in half with no loss of function. See [Chapter 16: Building for the Outdoors](chapters/16-building-for-outdoors/index.md).

### Can I damage my Raspberry Pi with static or the wrong voltage?

Yes, in both ways. **Electrostatic discharge** (ESD) can destroy a board at voltages far lower than you can feel. Ground yourself before touching the hardware, every time, and hold boards by the edges. And the GPIO pins run at **3.3 V and are not 5 V tolerant**, so connecting a 5 V signal can damage them.

Good habits include powering the board off before changing wires, checking the sensor's supply voltage on its datasheet, using red for power and black for ground, and double-checking a new circuit before turning it on. These steps cost almost nothing and prevent most hardware accidents. See [Chapter 3](chapters/03-electricity-and-computer/index.md).

### Two of my measurements move together. Does one cause the other?

Not necessarily. **Correlation** tells you whether two quantities move together. It never proves that one causes the other. Two things can rise together because a third thing drives both, or just by coincidence.

Being careful about this is part of reading data honestly, and it will make your own conclusions much stronger when you share them.

The test is to **name the physical mechanism**. If you cannot, call it a pattern, not a cause. For example, afternoon temperature and solar radiation rise together because sunlight heats the ground. That has a clear mechanism. A scatter plot is the usual way to look at it, because it puts one measurement on each axis and drops time. See [Chapter 15](chapters/15-charting-and-analysis/index.md) and the [glossary](glossary.md).

---

## Best Practice Questions

### Where should I place my station?

Follow the siting rules. Keep clear of obstacles by **four times their height**. For example, a 3 m wall should be at least 12 m from the wind sensor. Mount over a **natural surface**, such as grass, rather than concrete or a dark roof. Use standard heights for each sensor.

Be aware that **sensor exposure** needs conflict. Temperature needs shade and airflow. Solar radiation needs a clear view of the sky. Seismic sensing needs good coupling to the ground. You may need to mount sensors in different places on the same post. Write down exactly where and how each one is installed, since that goes in your metadata. See [Chapter 16](chapters/16-building-for-outdoors/index.md).

### How often should I take a reading?

One reading per minute is a good default for temperature, pressure, and humidity. Those change slowly. The **sampling interval** is a trade-off: faster sampling gives more detail but costs file size, power, and SD card wear. You can thin out dense data later, but you can never recover detail you did not capture.

Never sample faster than the sensor can respond. Wind and ground motion need fast sampling, such as wind every second or two and seismic around 100 samples per second, but you should **summarize** them and log a gust and a sustained value each minute instead of every raw sample. See [Chapter 14: Data Logging](chapters/14-data-logging/index.md).

### How should I name and store my log files?

Use a **CSV file** with a **header row** where every column name carries its unit, such as `temperature_c`, `pressure_hpa`, and `humidity_pct`. Put timestamps in UTC using ISO 8601 as the first column.

A consistent pattern also makes it easy to write a program that finds and combines files later, for example all the files from one month.

Use **file rotation**: start a new file each day, named by the ISO date, such as `2026-10-05.csv`. Smaller files are easier to open, and if one gets corrupted you lose a day, not everything. Remember that SD cards are limited by write endurance and sudden failure more than by capacity, so avoid writing more often than you need. See [Chapter 14](chapters/14-data-logging/index.md).

### How should I back up my data?

Follow the **3-2-1 rule**: keep **three copies** of your data, on **two different kinds** of storage, with **one copy somewhere else**, off the station. For a station, that could be the original on the Pi's SD card, a copy on the base station, and a copy in the cloud or on another computer.

The most important rule is that **an untested backup is not a backup.** Practice restoring a file so you know it works before you need it. An SD card can fail suddenly, so do not rely on it alone. [Chapter 14](chapters/14-data-logging/index.md) covers storage and backups in more detail.

### What metadata should I record, and when?

**Metadata** is data about your data. Record **where** the station is (coordinates and elevation), **how high** each sensor is mounted, **which sensor** and model you use, **what exposure** it has (shaded, in a shield, near a wall), and **what processing** was applied (for example, a moving average or a calibration offset).

Write it on **day one**, in a text file stored next to the data. Without it, your numbers are a pile with no context. A year from now you will not remember whether you moved the sensor, and neither will anyone you share the data with. If you change something, add a dated note. See [Chapter 14](chapters/14-data-logging/index.md) and [Chapter 17](chapters/17-measurement-to-consequence/index.md).

### How should I name variables in my Python code?

Put the **unit in the name**: `pressure_hpa`, not `p`; `temperature_c`, not `t`. This prevents a whole class of mistakes. When you see `wind_ms` you know it is meters per second, and nobody adds a Celsius value to a Fahrenheit one by accident.

These small habits make code easier to read a year from now. They also help a friend who reads your script understand what each number means without guessing.

Two more habits help. Always check what **units a library returns**, since the BME280 library may give a different unit than you expect. And never test floating-point numbers for exact equality, because floats are approximations. Compare them within a small tolerance. See [Chapter 13: Python Programming](chapters/13-python-programming/index.md).

### How do I check my sensor for drift?

**Sensor drift** is a slow change in a sensor's readings over time, even when the real value stays the same. Detect it by **comparing against a reference**: a trusted instrument, a **physical fixed point** (such as ice water at 0 °C), or a **nearby station**.

Patience helps here, because drift is slow. A check once a month or once a season is often enough to catch a problem before it spoils a long record.

Do this regularly and keep the comparisons. A steady offset suggests calibration. A gap that grows over months suggests drift. Do not fix drift by quietly changing old data. Record the check in your metadata, flag any adjusted values, and keep the raw readings. [Chapter 15](chapters/15-charting-and-analysis/index.md) covers drift, and [Chapter 2](chapters/02-language-of-measurement/index.md) covers calibration.

### Which type of chart should I use?

Use a **line chart** for a time series, since time has a natural order, but never join points across a gap. Use a **scatter plot** when you want to see how two measurements relate, because it puts one on each axis and drops time.

Always label axes with the variable, the unit, and the range, and add a title and legend. A truncated y-axis is not automatically dishonest. The test is whether the scale matches the claim, and whether you disclose it clearly. Choose the chart that answers your question, and if you can, show the raw data alongside any smoothing. See [Chapter 15](chapters/15-charting-and-analysis/index.md).

### Should I store my data in a CSV file or a database?

Start with a **CSV file**. It is readable by almost anything, easy for a person to inspect, simple to append, and long-lasting. A **database** buys fast searches and the ability for several programs to use the data at once, but you pay with readability and more to maintain.

For a station logging one reading a minute, daily files stay small, so CSV usually works well for a long time.

A good rule is: *begin with CSV and add a database such as SQLite only when a specific problem requires it*, for example when files grow too large to search quickly. Whichever you choose, keep a CSV export as a durable copy. See [Chapter 14](chapters/14-data-logging/index.md).

### Should my station send data by Wi-Fi or cellular?

It depends on where the station lives. **Wi-Fi** is simple, cheap, and works well when the station is near a network you control. A **cellular data link**, such as the SIM7600A module, works almost anywhere with coverage but adds a monthly plan and uses more power. Both send data to a **base station**, which turns a recorder into a monitored instrument.

Whichever you pick, plan for failure. **Intermittent connectivity** is normal. Write locally first, always, and treat sending as a later, optional step with back-off and batching. A station that needs the network to record data will lose data whenever the network drops. See [Chapter 16](chapters/16-building-for-outdoors/index.md).

### How do I build a power budget for my station?

A **power budget** is an accounting of energy used against energy collected. Follow these steps, which are plain arithmetic:

1. **List each load** and its current draw in milliamps. The computer and radio dominate.
2. **Multiply by hours** per day to get milliamp-hours used per day.
3. **Divide the battery capacity** (after derating for depth of discharge and cold) by the daily use to see how many days it lasts.
4. **Size the solar panel** against the **worst month's** insolation, not summer's.
5. **Add a charge controller.**
6. **Look for savings** with duty cycling.

Work the numbers for December, because the budget has to survive the worst month. See [Chapter 16](chapters/16-building-for-outdoors/index.md).

### How should I use a moving average without hiding real events?

A **moving average** reveals the shape of data by cancelling noise. The window size changes what you see: a 24-hour window removes the daily cycle completely, which may be exactly what you want when looking for a trend, or exactly what you do not.

A good check is to compare the smoothed line with the raw points. If the raw data shows a sharp event that the smooth line hides, shorten the window.

The risk is that it also **smooths away real fast events**, such as a pressure drop ahead of a storm. So choose the window to match your question, say what window you used on the chart, and always **keep the raw data**. If you are not sure, plot both. See [Chapter 15](chapters/15-charting-and-analysis/index.md).

### How can I share my data with scientists or other schools?

Several **citizen science** networks accept data from student and hobby stations, including CoCoRaHS (the Community Collaborative Rain, Hail and Snow Network) and the Weather Underground personal weather station network. Professional forecasters use this data.

Sharing is also a good chance to double-check your work, since other people will look at your numbers with fresh eyes and may spot a problem you missed.

Good **data sharing** requires a clear **format**, **metadata**, **units**, quality **flags**, a **license** saying how it may be used, and a stable place to keep it. Before you share, make sure the station is sited properly and logging honest numbers. When you present findings, lead with the result, show one honest chart, and state the limits. See [Chapter 17: From Measurement to Consequence](chapters/17-measurement-to-consequence/index.md).

---

## Advanced Topic Questions

### How would I design a station that survives a winter unattended?

Work through the whole chapter in order. **Siting**: pick a spot with clearance, a natural surface, and standard heights. **Enclosure**: choose an **IP65** box, but **vent** it, because a sealed box condenses moisture inside and destroys the electronics. Use a white or light color to reduce heat.

**Power**: write a power budget for the *worst month*, derate the battery for cold, size the panel for winter insolation, and add a charge controller. Use **duty cycling** to cut consumption. **Software**: run the logger as a systemd service, use exception handling, and write locally first. **Data**: set up telemetry with back-off and batching, and back up. Test everything on the bench before you go out. See [Chapter 16](chapters/16-building-for-outdoors/index.md).

### Why are many cheap seismic stations better than one expensive one?

A **seismic network** locates an event by **trilateration**, using the arrival times at several stations, and it **rejects false alarms** by requiring agreement among them. One truck driving past one sensor can look like an earthquake. If five stations in different places all feel the P wave, it is real.

That is the argument for **density over individual precision**. A cheap **MEMS accelerometer**, built for car airbags, is not as sensitive as a laboratory seismometer. But a dense network of them can give **earthquake early warning**, using the gap between the fast P wave and the slower S wave and the speed of radio. The trade-off is quality per sensor against coverage and reliability. See [Chapter 11](chapters/11-ground-motion/index.md) and [Chapter 16](chapters/16-building-for-outdoors/index.md).

### How can I tell sensor drift from a real change in the environment?

Compare. A real environmental change should appear in **other measurements** and in **other stations**. If your temperature reading slowly creeps up but a nearby station and a reference thermometer disagree with it, suspect drift. If they all rise together, the world changed.

Use three tools: a **reference instrument**, **physical fixed points**, and a **nearby station**. Look at whether the change is gradual and one-directional (drift) or tied to weather. This matters most for **climate records**, where finding and correcting every instrument change, station move, and drift is what makes a century of different instruments mean something. See [Chapter 15](chapters/15-charting-and-analysis/index.md) and [Chapter 17](chapters/17-measurement-to-consequence/index.md).

### What are the trade-offs between sealing and venting my enclosure?

A **sealed** box keeps out rain, dust, and insects. But it traps air, and as the temperature changes the moisture inside condenses on the electronics and destroys them. A **vented** box lets the air breathe and equalizes humidity, but must be designed so that water cannot get in.

There is a second trade-off with ratings. **IP65** (dust-tight, protected against water jets) is the sensible target. Higher ratings cost more, and past a point they work against you by trapping moisture. Pressure and humidity sensors also need to sample the outside air, so they usually sit in a vented shield. An IP68 box that is perfectly sealed can still corrode inside. See [Chapter 16](chapters/16-building-for-outdoors/index.md).

### How do forecasters, farmers, and engineers use data like mine?

Each uses a different **time scale** of the same measurements. **Weather forecasting** and **severe weather warnings** rest on dense observation: every reading improves the model's starting point. **Aviation** needs pressure for altimetry and wind for runways. **Agriculture** uses accumulated temperature and **evapotranspiration**, which needs four of your seven measurements, to decide planting and irrigation.

**Energy** companies forecast demand from temperature, where an error of a degree can be hundreds of megawatts. Engineers turn decades of wind and seismic records into a **building code**. Cities map the **urban heat island** with dense volunteer networks. All of it begins with someone taking honest readings. See [Chapter 17](chapters/17-measurement-to-consequence/index.md).

### How would I write code that handles a network that keeps dropping?

Follow the rule *write locally first, transmit second*. Your logger should save every reading to a file on the Pi no matter what the network is doing. A separate step then tries to send data that has not yet been sent.

Add three ideas. **Back off** after repeated failures: double the wait time after each failure, up to about an hour, so the radio does not waste power on a dead link. **Batch** the transmissions, so one connection sends many readings. And **log every failure** to `station.log`, so a gap is explained later. Wrap each network call in exception handling. See [Chapter 16](chapters/16-building-for-outdoors/index.md) and [Chapter 13](chapters/13-python-programming/index.md).

### How could I design an experiment to compare two locations, like a parking lot and a field?

Start with a clear question: *"Does the parking lot beside the school get hotter than the field behind it?"* Then design for a fair comparison. Use **the same sensor model** at both sites, **calibrate both** against the same reference first, and use the same height and the same radiation shield. Log in **UTC** with the same **sampling interval**.

Change only one thing, the location. Record **metadata** for each site: surface, shade, and distance from buildings. Collect for long enough to include sunny, cloudy, windy, and calm days. Then compare with a line chart of the difference. Keep a notes column too, because plain-word observations often explain odd readings. See [Chapter 1](chapters/01-why-we-measure/index.md) and [Chapter 15](chapters/15-charting-and-analysis/index.md).

### How good does a measurement need to be?

It depends on the question you are asking. This idea is called being *fit for purpose*. **Measurement uncertainty** is an honest statement of how far off a reading might be. If you only want to know whether to bring a coat, an uncertainty of one degree does not matter. If you want to find a warming trend of 0.02 °C per year, a sensor that drifts by that much each year could hide the answer.

So ask: what decision depends on this number, and how much error can that decision tolerate? Then compare against your sensor's **accuracy**, **resolution**, and **drift**. Spending more on a better sensor is only worth it if the question needs it. See [Chapter 2](chapters/02-language-of-measurement/index.md) and [Chapter 15](chapters/15-charting-and-analysis/index.md).

### Why can't earthquake early warning predict earthquakes?

**Earthquake early warning** is **not prediction**. Nobody can say in advance when and where a fault will slip. Early warning only works *after* the earthquake has started. Stations near the fault feel the fast **P wave** first. They send the alert by radio, which travels much faster than the slower, more damaging **S wave**. People farther away then get **seconds** of notice before shaking arrives.

The warning time depends on the gap between P and S arrival and the speed of the alert, so it is longest for places far from the epicenter. **Tsunami** and **flood warnings** use the same speed-gap and density ideas. See [Chapter 11](chapters/11-ground-motion/index.md) and [Chapter 17](chapters/17-measurement-to-consequence/index.md).

---
