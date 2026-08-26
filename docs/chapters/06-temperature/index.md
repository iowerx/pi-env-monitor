---
title: "Temperature: From the Thermoscope to the Silicon Chip"
description: What temperature physically is, the instrument lineage from Galileo's thermoscope to the thermistor, the Fahrenheit, Celsius, and Kelvin scales, and why the Stevenson screen matters as much as the sensor.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:10:59
version: 0.09
---
# Temperature: From the Thermoscope to the Silicon Chip

## Summary

Temperature is the motion of atoms, not a substance called heat, and this chapter starts there. It follows the instrument lineage from Galileo's thermoscope through sealed liquid-in-glass thermometers to the thermocouple, resistance thermometer, and thermistor, and covers the Fahrenheit, Celsius, and Kelvin scales with their fixed points and conversions. It ends with the Stevenson screen, because how a thermometer is exposed to the air is part of the measurement. After this chapter, readers can convert between all three scales and explain why absolute zero exists.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Temperature
2. Kinetic Energy Of Atoms
3. Thermoscope
4. Resistance Thermometer
5. Air Temperature
6. Thermoelectric Effect
7. Heat Transfer
8. Infrared Radiation
9. Liquid In Glass Thermometer
10. Absolute Zero
11. Thermistor
12. Stevenson Screen
13. Fahrenheit Scale
14. Celsius Scale
15. Kelvin Scale
16. Thermocouple
17. Surface Temperature
18. Freezing Point Of Water
19. Boiling Point Of Water
20. Temperature Conversion

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 3: Electricity and the Single-Board Computer](../03-electricity-and-computer/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)

---

## What Is Actually Happening When Something Is Hot

Everything is vibrating.

The atoms in this page, in the air around you, and in your own hand are in constant motion — jiggling, colliding, bouncing off one another. They never stop. In a solid they vibrate in place; in a gas they fly around and crash into things.

**Temperature** is a measure of the average kinetic energy of the atoms or molecules in a substance. Kinetic energy is the energy of motion, so the **kinetic energy of atoms** is simply how vigorously they are moving.

Hot means the atoms are moving fast. Cold means they are moving slowly. That is the whole idea, and it is worth pausing on because it replaces something most people believe instead.

For most of history, heat was thought to be a substance. Eighteenth-century scientists called it caloric — an invisible, weightless fluid that flowed from hot objects into cold ones. It was a reasonable theory. It explained why a hot poker cools down, why objects reach the same temperature when left together, and it made correct predictions for a long time.

It was wrong, and the person who broke it was making cannons. In the 1790s Count Rumford noticed that boring cannon barrels produced apparently unlimited heat as long as the boring continued. If heat were a fluid stored in the metal, it should eventually run out. It never did. Heat was not a substance being released; it was motion being created by friction.

So there is no such thing as "cold" as a separate entity. Cold is just less motion. When you open a freezer, cold does not flow out. Heat flows in.

!!! note "The word average is load-bearing"
    Temperature is the *average* kinetic energy, not the total. A cup of boiling water and a swimming pool at the same temperature have atoms moving at the same average speed, but the pool contains vastly more atoms and therefore vastly more total energy. This is why a spark at 1000 °C landing on your hand barely registers, while a splash of 60 °C water burns you. Temperature and total heat energy are different quantities, and confusing them is common.

**Heat transfer** is the movement of thermal energy from a warmer object to a cooler one. It always runs in that direction on its own, and it happens three ways:

- **Conduction** — energy passing through direct contact, as fast-moving atoms collide with slower neighbors. This is why a metal spoon in soup gets hot.
- **Convection** — energy carried by moving fluid. Warm air rises, cool air sinks, and the circulation carries energy with it. This drives most weather.
- **Radiation** — energy carried by electromagnetic waves, needing no material at all. This is how the Sun's energy crosses empty space.

All three matter to your station. Conduction is how the sensor reaches the air's temperature. Convection is why a shielded sensor needs airflow. Radiation is the reason a thermometer in direct sunlight lies to you, which is the subject at the end of this chapter.

## Radiation You Cannot See

One form of heat transfer deserves its own section, because it produced an accidental discovery that opened up a whole region of physics.

**Infrared radiation** is electromagnetic radiation with wavelengths longer than visible red light, roughly 700 nanometers to 1 millimeter. You met the electromagnetic spectrum in Chapter 4; infrared sits just past the red end of the visible band.

Every object warmer than absolute zero emits infrared radiation. You are emitting it right now. The amount and the wavelength depend on temperature: hotter objects emit more, and at shorter wavelengths. Heat an iron bar and it first emits invisible infrared you can feel as warmth, then glows dull red, then orange, then white as its atoms move fast enough to emit visible light.

William Herschel found infrared in 1800 without looking for it. He was measuring how much heat different colors of sunlight carried, using a prism to spread sunlight into a spectrum and placing thermometers in each color band. He put one thermometer just past the red end as a control, expecting it to read room temperature.

It read higher than any of the colored bands.

There was something beyond red carrying more energy than visible light did, and no eye could see it. Herschel called it "calorific rays." We call it infrared, and it is the basis of thermal cameras, non-contact thermometers, night vision, and the greenhouse effect.

This gives your station two distinct temperatures to keep straight:

**Air temperature** is the temperature of the air itself, measured in shade with good airflow. This is the number in every weather report, and it is what your station is built to measure.

**Surface temperature** is the temperature of a solid surface — asphalt, grass, a roof, soil. It is measured either by contact or by reading the infrared a surface emits.

They can differ enormously. On a clear summer afternoon with an air temperature of 30 °C, asphalt can reach 60 °C and dry sand can exceed 50 °C. Chapter 17 returns to this, because that gap is exactly what makes cities hotter than the countryside around them.

## The Instrument Lineage

Warmth was something people could feel long before it was something they could count. Turning it into a number took about 150 years and several separate inventions.

### The Thermoscope

Around 1592, Galileo built a **thermoscope**: a device that shows temperature *changes* without giving a numerical value.

His version was a glass bulb with a long thin stem, inverted with the stem standing in a dish of water. The air trapped in the bulb expanded when warmed and contracted when cooled, pushing the water level down or letting it rise.

It worked, and it had two serious problems. It had no scale, so it could only tell you *warmer* or *cooler* — the same limitation your hands have. Worse, because the stem was open to the air, the water level also responded to changes in atmospheric pressure. A thermoscope reading could change because the weather was changing rather than because the temperature was.

This is the difference between the thermoscope and everything that came after. A thermoscope tells you *different*. A thermometer tells you *how much*.

### Getting a Scale

Santorio Santorio put graduated marks on a thermoscope around 1612 and used it on medical patients, which is arguably the first clinical thermometer. In 1654 Ferdinand II of Tuscany sealed the liquid inside the glass, eliminating the pressure problem in a single stroke.

That produced the **liquid in glass thermometer**: a sealed glass tube with a bulb of liquid at one end and a narrow bore for the liquid to expand into. The liquid expands more than the glass does when warmed, so it rises up the bore.

The narrow bore is the clever part. A small change in the bulb's volume produces a large, easily-read movement in a thin tube — a mechanical amplifier made of glass.

But a remaining problem was worse than either of the first two: **no two makers agreed on the scale.** One person's thermometer read 20 and another's read 60 for the same room. The instruments worked. They simply could not be compared, which is the Chapter 2 standardization problem in its purest form.

### Three Scales

Daniel Gabriel Fahrenheit fixed the comparability problem in 1724. Working with mercury in glass, he produced the first temperature scale that different instruments could reproduce — meaning two thermometers made to his specification would agree.

The **Fahrenheit scale** set 0 °F at the temperature of a stable mixture of ice, water, and ammonium chloride salt, which was the coldest temperature he could reliably reproduce in a lab. He put 32 °F at the freezing point of pure water. Eventually the scale settled with 180 degrees between the freezing and boiling points of water.

Anders Celsius, a Swedish astronomer, proposed a hundred-step scale in 1742. There is a detail here that surprises people: **his original scale ran backwards**, with 0 at the boiling point of water and 100 at freezing. It was inverted to the modern arrangement shortly after his death, and later renamed in his honor. The **Celsius scale** as used today puts 0 °C at the **freezing point of water** and 100 °C at the **boiling point of water**, both at standard atmospheric pressure.

Both of those scales share a limitation. Their zeros are arbitrary — chosen for convenience, not because anything physical happens there. As Chapter 2 explained, that makes them interval scales, so 20 °C is not twice as warm as 10 °C.

In 1848 William Thomson, later Lord Kelvin, reasoned toward a fix. If temperature is atomic motion, there must be a temperature at which that motion reaches its minimum. You cannot have less than no motion. That point is **absolute zero**, and nothing can be colder.

Absolute zero sits at −273.15 °C, or −459.67 °F. It has never been reached, and by the laws of thermodynamics it cannot be, though laboratories have come within a few billionths of a degree.

The **Kelvin scale** starts there. Its zero is absolute zero, and its degree is exactly the same size as a Celsius degree. Because its zero means "none," kelvin is a ratio scale: 200 K genuinely is twice as hot as 100 K, in the sense that the atoms carry twice the average kinetic energy.

Note the convention: it is written "300 K", not "300 °K" and not "300 degrees Kelvin". The kelvin is a unit in its own right, not a degree on someone's scale.

| | Fahrenheit | Celsius | Kelvin |
|---|---|---|---|
| Proposed | 1724 | 1742 | 1848 |
| Water freezes | 32 °F | 0 °C | 273.15 K |
| Water boils | 212 °F | 100 °C | 373.15 K |
| Absolute zero | −459.67 °F | −273.15 °C | 0 K |
| Degrees between freezing and boiling | 180 | 100 | 100 |
| Zero means | Ice and salt mixture | Water freezes | No atomic motion |
| Scale type | Interval | Interval | Ratio |
| Used for | US weather and daily life | Most of the world; science | Physics and engineering |

## Converting Between Scales

**Temperature conversion** is the arithmetic of moving between these three scales. Because their zeros differ, conversion needs both a multiplication and an addition — unlike the pure multiplications of Chapter 2.

Fahrenheit and Celsius differ in both degree size and zero point:

\[ °F = °C \times \frac{9}{5} + 32 \]

\[ °C = (°F - 32) \times \frac{5}{9} \]

The fraction \(9/5\) is there because 180 Fahrenheit degrees span the same range as 100 Celsius degrees, and \(180/100 = 9/5\). The 32 shifts the zero.

Kelvin and Celsius share a degree size, so only the offset is needed:

\[ K = °C + 273.15 \]

\[ °C = K - 273.15 \]

There is one trap worth naming now, because it catches people every time they meet it. **A temperature and a temperature difference convert differently.**

If the temperature rises by 5 °C, it has risen by 9 °F, not 41 °F. For a *change*, you apply only the ratio, never the offset — the two zero points cancel out when you subtract. Confusing a value with a difference produces answers that are wrong by exactly 32, which is a recognizable fingerprint when you see it in someone's data.

A useful rough conversion for mental arithmetic: double the Celsius value and add 30. For 20 °C that gives 70 °F, and the exact answer is 68 °F. Close enough to decide about a jacket.

#### Diagram: Three Scales Thermometer

<iframe src="../../sims/three-scales-thermometer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Three Scales Thermometer</summary>
Type: microsim
**sim-id:** three-scales-thermometer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Apply (L3)
Bloom Verb: convert

Learning objective: The learner converts a temperature between Fahrenheit, Celsius, and Kelvin, and distinguishes converting a temperature value from converting a temperature difference.

Purpose: Students memorize the formula and still cannot say why 5 °C of warming is not 41 °F of warming. Showing all three scales on one shared physical column, with a second marker for a difference, makes the offset visible as a physical alignment rather than a term in an equation.

Canvas layout:
- Center: a single tall thermometer column with three graduated scales running alongside it — Fahrenheit left, Celsius center, Kelvin right — all aligned to the same physical temperature
- A draggable marker that slides up and down the column; all three readouts update together
- Left panel: named reference temperatures the learner can jump to
- Right or below (responsive): the worked conversion arithmetic for the current value
- Bottom: mode toggle and controls
- Responsive to window resize; the column scales vertically with canvas height

Data Visibility Requirements:
  Stage 1: Show the current temperature simultaneously in all three units, to one decimal place
  Stage 2: Show the worked Celsius-to-Fahrenheit arithmetic with each step separate: the multiplication by 9/5, then the addition of 32
  Stage 3: Show the Celsius-to-Kelvin arithmetic as a single addition of 273.15
  Stage 4: In difference mode, show a SECOND marker and display the interval between the two markers in all three units, with the arithmetic showing that the offset drops out

Reference temperature presets (clicking jumps the marker and labels it):
- Absolute zero: 0 K, −273.15 °C, −459.67 °F — "Atomic motion at its minimum. Never reached."
- Coldest recorded on Earth: −89.2 °C, Vostok Station, Antarctica, 1983
- Water freezes: 0 °C, 32 °F, 273.15 K
- A cool day: 10 °C, 50 °F
- Comfortable room: 21 °C, 70 °F
- Human body: 37 °C, 98.6 °F
- Hot summer day: 32 °C, 90 °F
- Heat advisory: 38 °C, 100 °F
- Hottest recorded on Earth: 56.7 °C, Death Valley, 1913
- Water boils: 100 °C, 212 °F, 373.15 K

Mode toggle:
- **Value mode** — one marker, converts a temperature
- **Difference mode** — two markers; the readout shows the interval and explicitly displays the message: "A difference of 5 °C is a difference of 9 °F, not 41 °F. The +32 offset cancels when you subtract."

Interactive controls:
- Drag either marker along the column
- Type a value into any of the three unit boxes; the other two and the marker update
- Preset buttons jump to named temperatures
- A "scale below absolute zero" attempt: dragging below 0 K is blocked, and a message appears reading "There is no temperature below absolute zero. Atoms cannot move less than not at all."

Instructional Rationale: The objective is Apply/convert, so direct parameter entry with immediately visible worked arithmetic is the right pattern. Aligning all three scales on one shared column is the specific design choice that teaches the offset: the learner can see that 0 °C and 32 °F are the same height, which is what "different zero points" physically means. Difference mode exists because that misconception is otherwise invisible until it appears in a student's data.

Implementation: p5.js. Store the current temperature internally in kelvin and derive all displays from it, so the three scales cannot drift out of agreement. Map kelvin to pixel height with a fixed range from 0 K to 400 K.
</details>

## Electrical Thermometers

Liquid in glass is accurate and needs no power, but a person has to walk over and read it. An automatic station needs a thermometer that produces an electrical signal.

Chapter 4 introduced the general idea. Here are the three specific mechanisms, in the order they were discovered.

### The Thermocouple

In 1821 Thomas Seebeck found that when two different metals are joined at both ends and one junction is hotter than the other, a small voltage appears in the circuit. This is the **thermoelectric effect**, sometimes called the Seebeck effect.

A **thermocouple** is a temperature sensor built from that effect: two wires of different metals welded together at one end. The voltage across the free ends depends on the temperature at the joined end.

Thermocouples produce very small voltages — typically tens of microvolts per degree — which means they need careful amplification. What they offer in return is range. Some types work from −200 °C to over 1700 °C, far beyond anything liquid in glass can survive. They are the standard for furnaces, engines, and kilns.

### The Resistance Thermometer

A **resistance thermometer** works from the fact that the electrical resistance of a metal rises predictably as it gets hotter. Pass a small known current through it, measure the voltage, and the resistance tells you the temperature.

Platinum is the usual metal because its resistance-versus-temperature relationship is exceptionally linear and stable. The most common type is called a Pt100, meaning platinum with 100 ohms of resistance at 0 °C. These devices are so stable and reproducible that they serve as reference standards — the calibration chain from Chapter 2 often passes through one.

### The Thermistor

A **thermistor** is a resistance-based temperature sensor made from a semiconductor rather than a metal. Semiconductors, as Chapter 4 explained, change conductivity sharply with temperature.

That word "sharply" is the whole point. A thermistor's resistance changes far more per degree than platinum's does — often by several percent per degree — which makes small temperature changes easy to detect with simple circuitry. The cost is linearity: the relationship is strongly curved, so converting resistance to temperature requires a more complicated formula than a straight line.

Most thermistors are NTC types, meaning negative temperature coefficient: resistance *falls* as temperature rises. That is the opposite of a metal, and it catches people out.

| | Thermocouple | Resistance thermometer | Thermistor | Silicon diode (BME280) |
|---|---|---|---|---|
| Based on | Thermoelectric effect | Metal resistance | Semiconductor resistance | Diode voltage shift |
| Typical range | −200 to 1700 °C | −200 to 850 °C | −50 to 150 °C | −40 to 85 °C |
| Sensitivity | Low | Moderate | High | Moderate |
| Linearity | Fair | Excellent | Poor | Good |
| Needs power | No | Yes | Yes | Yes |
| Cost | Low | High | Very low | Very low |
| Where you meet it | Furnaces, engines | Laboratory standards | Thermostats, battery packs | Your station |

The sensor in your station uses the fourth column. The BME280 contains a silicon diode whose forward voltage drops by roughly 2 millivolts for every degree Celsius of warming — a small, consistent, and easily measured shift. It is not the most accurate mechanism ever devised. It is accurate enough for weather, it costs almost nothing, and it fits on a chip beside the pressure and humidity elements. Chapter 12 wires it up.

#### Diagram: Temperature Sensor Comparison Chart

<iframe src="../../sims/temperature-sensor-comparison/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Temperature Sensor Comparison Chart</summary>
Type: chart
**sim-id:** temperature-sensor-comparison<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: recommend

Learning objective: The learner recommends a temperature sensor for a stated application by comparing measurement range, sensitivity, linearity, and cost against the requirements of the task.

Purpose: Chapter 2 introduced measurement range as a specification that rules sensors in or out. This element makes that concrete by plotting all four sensor types on a shared temperature axis, so a range mismatch becomes visually obvious rather than a number to look up.

Chart type: Horizontal range bars on a shared temperature axis, with a secondary toggleable view showing a response curve

Primary view — range comparison:
X-axis: Temperature in degrees Celsius, from −250 to 1800, on a scale that keeps the −50 to 150 region readable (a symlog or broken axis is acceptable if labeled)
Y-axis: Four categories — Thermocouple, Resistance thermometer, Thermistor, Silicon diode (BME280)
Each bar spans that sensor's usable measurement range.

Overlay markers on the temperature axis, drawn as vertical reference lines:
- −89.2 °C: coldest temperature recorded on Earth
- −40 °C: lower limit of the BME280
- 0 °C: water freezes
- 56.7 °C: hottest temperature recorded on Earth
- 85 °C: upper limit of the BME280
- 1085 °C: copper melts

Secondary view — response curves:
X-axis: Temperature, −50 to 150 °C
Y-axis: Normalized sensor output
Plots the response of each sensor type so the learner can see that platinum is nearly straight while the thermistor curves strongly. Caption: "High sensitivity and good linearity pull in opposite directions."

Application scenarios (selector buttons). Choosing one dims sensors that cannot do the job and displays the reason:
1. "Outdoor weather station in Minnesota" — expected range −40 to 40 °C. All four are technically in range; the verdict panel recommends the silicon diode on cost and integration, and notes the BME280's −40 °C lower limit is uncomfortably close to record local lows.
2. "Kiln monitor, up to 1200 °C" — only the thermocouple survives. Others are shown greyed with the message "outside measurement range — this sensor would be destroyed, not merely inaccurate."
3. "Laboratory calibration reference" — recommends the platinum resistance thermometer for stability and linearity, noting it is the most expensive.
4. "Battery pack over-temperature cutoff" — recommends the thermistor for high sensitivity near room temperature and very low cost.

Interactive features:
- Hover any range bar: tooltip gives the exact range, sensitivity, linearity rating, and typical cost
- Click a bar: infobox explains the underlying mechanism and links to the section of this chapter that covers it
- Toggle between range view and response-curve view
- Scenario buttons as described, with a written verdict for each

Implementation: Chart.js horizontal bar chart with a custom axis for the range view and a line chart for the curve view. Keep the scenario logic as data so new scenarios can be added without code changes.
</details>

## Where You Put It Matters as Much as What You Buy

Here is an experiment that will change how you read every weather report.

Put a thermometer in direct sunlight on a clear day and let it settle. Then put an identical thermometer a meter away in the shade. Wait, and compare.

The difference will commonly be 10 °C or more. Neither thermometer is broken. Neither is lying.

The reason is radiation, the third mode of heat transfer. The sunlit thermometer is absorbing solar energy directly and heating up above the air around it. It is faithfully reporting its own temperature — it just is not reporting the air's.

This means an important thing about the phrase "air temperature." **There is no such thing as the temperature outside.** There is the temperature at a particular height, with particular shading, with particular airflow, over a particular surface. Change any of those and the number changes.

Which is a problem for a worldwide record. If every station shields its thermometer differently, no two stations can be compared, and Chapter 1's whole premise falls apart.

The solution was designed in 1864 by Thomas Stevenson, a Scottish lighthouse engineer better known today as the father of the novelist Robert Louis Stevenson.

A **Stevenson screen** is a louvered white box that houses meteorological instruments, shielding them from direct sunlight and precipitation while allowing air to circulate freely.

Every feature does a specific job:

- **White paint** reflects solar radiation instead of absorbing it
- **Double louvers** block direct and reflected sunlight while letting air pass through
- **A double roof** with an air gap keeps the interior from being heated from above
- **An open slatted floor** lets air enter from below and stops heat radiating up from the ground
- **Mounting at 1.25 to 2 metres** above ground, over natural surface, is the international convention — most commonly about 1.5 m

That last one is a standardization decision exactly like the prime meridian. There is nothing physically special about 1.5 metres. It matters only because *everyone* uses it, which is what makes readings comparable across the world.

#### Diagram: Radiation Shield Comparison Lab

<iframe src="../../sims/radiation-shield-lab/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Radiation Shield Comparison Lab</summary>
Type: microsim
**sim-id:** radiation-shield-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: differentiate

Learning objective: The learner differentiates the effect of solar radiation, mounting surface, and airflow on a temperature reading, and attributes an error in a day's data to a specific siting fault.

Purpose: Siting error is the highest-consequence and least-visible mistake a student station can make, because the resulting data looks entirely plausible. Running four differently-sited sensors through the same simulated day, against a known true air temperature, makes the error measurable rather than theoretical.

Canvas layout:
- Upper area: a scene showing four sensors sited differently against a common sky, with a Sun that moves across the day
- Lower area: a chart plotting all four sensors' readings against time, with the true air temperature drawn as a dashed reference line, on a fixed shared y-axis
- Right or below (responsive): statistics panel showing each sensor's current reading, its error against truth, and its maximum error so far
- Bottom: controls
- Responsive to window resize; scene and chart stack vertically on narrow canvases

The four sensor sitings, which must be visually distinct in the scene:
1. **Bare sensor in full sun, on a dark asphalt roof** — reads far too high during the day, peaking mid-afternoon
2. **Bare sensor mounted on a south-facing wall** — reads high, peaking later than the roof sensor as the wall re-radiates stored heat into the evening
3. **Sensor under a simple sunshade, no airflow** — better, but still reads high because trapped air heats up under the shade
4. **Sensor in a louvered white Stevenson screen at 1.5 m over grass** — tracks the true air temperature closely

Data Visibility Requirements:
  Stage 1: Show the true air temperature curve for the simulated day as the dashed reference
  Stage 2: Show each sensor's reading as a separate colored line on the same axes
  Stage 3: At the current time cursor, display a table: sensor, reading, true value, error in degrees Celsius
  Stage 4: On completing a simulated day, display each sensor's maximum error and daily mean error, and rank them
  Stage 5: In diagnosis mode, hide the labels, present one sensor's curve alone, and ask the learner to identify the siting fault from the shape of the error

Interactive controls:
- Time-of-day slider spanning 00:00 to 24:00, and a "Run the day" button that steps through it
- Weather selector: "Clear and calm" (worst case, largest errors), "Clear and breezy" (airflow reduces the shaded-but-unventilated error), "Overcast" (all four nearly agree — the important null result)
- Season selector: summer or winter, changing solar elevation and day length
- Toggle individual sensors on and off to reduce clutter
- Diagnosis mode as described above, with three rounds and feedback naming the fault

Required teaching moment: in the "Overcast" setting, all four sensors must agree closely, and the panel must display: "On a cloudy day, bad siting is invisible. This is why siting errors go unnoticed for months — they only appear when the sun is out."

Instructional Rationale: The objective is Analyze/differentiate, which requires isolating multiple interacting causes. Running four sitings side by side against a known truth on the same axes is what makes the causes separable. Diagnosis mode inverts the task from "watch the effect" to "identify the cause," which is the skill a student needs when looking at their own suspicious data in Chapter 15. The overcast null result is included deliberately because absence of an error under some conditions is what makes the fault deceptive.

Implementation: p5.js. Model each sensor's reading as trueAirTemp + solarLoad x absorptionFactor x shieldFactor - ventilationCooling, with per-siting coefficients. Do not attempt real radiative physics; the goal is a correct qualitative ordering with plausible magnitudes.
</details>

!!! warning "This is the mistake that will ruin your data"
    Of everything in this book, sensor exposure is where student stations most often go wrong, and the failure is invisible in the data. A station on a sunlit wall reads high all afternoon and looks fine — the numbers are plausible, the graph is smooth, nothing is obviously broken. You are simply measuring the wall.

    A cheap radiation shield costs a few dollars, or you can build one from stacked plastic plant saucers. Do not skip it. Chapter 16 covers siting in full, but the rule starts here: **shade, airflow, and standard height.**

## Key Takeaways

- **Temperature** is the average **kinetic energy of atoms**. Cold is not a substance; it is less motion.
- **Heat transfer** runs from hot to cold by conduction, convection, and **infrared radiation**. Herschel found infrared in 1800 with a thermometer past the red end of a spectrum.
- **Air temperature** and **surface temperature** are different quantities and can differ by 30 °C on a summer afternoon.
- A **thermoscope** shows change without a number. The sealed **liquid in glass thermometer** added a scale and removed the pressure error.
- The **Fahrenheit scale** (1724) made thermometers reproducible. The **Celsius scale** (1742) uses the **freezing point of water** and **boiling point of water** as its fixed points. The **Kelvin scale** (1848) starts at **absolute zero**, −273.15 °C, making it a ratio scale.
- **Temperature conversion** between Fahrenheit and Celsius needs both a ratio and an offset. A temperature *difference* uses the ratio only.
- The **thermoelectric effect** gives us the **thermocouple**; metal resistance gives the **resistance thermometer**; semiconductors give the **thermistor**. Your station uses a silicon diode inside the BME280.
- The **Stevenson screen** standardizes exposure. Without shade, airflow, and a standard height, a thermometer measures itself rather than the air.

## Check Yourself

??? question "Two thermometers a meter apart read 22 °C and 34 °C. Both are working correctly. How? Click to check."
    One is in shade and the other is in sunlight. The sunlit thermometer is absorbing solar radiation directly and heating above the surrounding air, so it correctly reports its own temperature — which is not the air temperature. This is precisely the problem the Stevenson screen was designed to solve, and it is why "shade" is part of the definition of air temperature rather than an optional extra.

??? question "The temperature rises from 15 °C to 20 °C. What is that rise in Fahrenheit? Click to check."
    Nine Fahrenheit degrees. This is a *difference*, so only the 9/5 ratio applies: \(5 \times 9/5 = 9\). Do not add 32. As a check, convert both values separately: 15 °C is 59 °F and 20 °C is 68 °F, and \(68 - 59 = 9\). Applying the offset to a difference would give 41, which is the classic wrong answer.

??? question "Why is 0 K a real physical boundary but 0 °C is not? Click to check."
    Because 0 K is absolute zero, the temperature at which atomic motion reaches its minimum — you cannot have less motion than none, so nothing can be colder. 0 °C is the freezing point of water, which is a useful and convenient reference but nothing fundamental: temperatures below it exist in abundance. This is why kelvin is a ratio scale where 200 K really is twice 100 K, and Celsius is not.

??? question "Your BME280 is rated −40 to 85 °C. You are building a station in Fairbanks, Alaska, where −45 °C happens. What is the problem? Click to check."
    The expected conditions fall outside the sensor's measurement range. Below −40 °C the BME280 does not return a slightly-worse reading — it returns no trustworthy reading at all, and the datasheet makes no promises about its behavior there. Worse, the failure comes exactly when the data would be most interesting. This is the range check from Chapter 2 applied for real: check that your expected values sit comfortably inside the range, not at its edge.

---

## What Is Next

Temperature is the quantity people find most intuitive, which is why it comes first. The next one is the quantity people find least intuitive, and it has the best story in the book.

Chapter 7 covers barometric pressure — the weight of the air stacked above you, which nobody believed in for two thousand years. It runs from Aristotle's insistence that a vacuum could not exist, through Torricelli's tube of mercury and Pascal's brother-in-law carrying a barometer up a mountain, to the silicon diaphragm inside your own sensor. Along the way it explains why weather forecasting became possible at all.
