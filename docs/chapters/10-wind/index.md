---
title: "Wind: Measuring Air in Motion"
description: Pressure systems, fronts, and the gradient that drives wind; the weather vane and anemometer families; the Beaufort scale; and what wind does to people and structures.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:28:14
version: 0.09
---
# Wind: Measuring Air in Motion

## Summary

Wind is what happens when pressure is unequal, so this chapter opens with high and low pressure systems, fronts, and the pressure gradient that drives air from one to the other. It covers the weather vane and the anemometer families — cup, sonic — and the Beaufort scale, a measurement standard that required no instrument at all. It reconciles knots and meters per second, then turns to what wind does to people and structures through wind chill, apparent temperature, heat index, the Enhanced Fujita scale, and wind load.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. High Pressure System
2. Low Pressure System
3. Weather Front
4. Pressure Gradient
5. Wind
6. Wind Speed
7. Wind Direction
8. Apparent Temperature
9. Weather Vane
10. Anemometer
11. Beaufort Scale
12. Knot Unit
13. Meters Per Second
14. Wind Chill
15. Enhanced Fujita Scale
16. Wind Load
17. Heat Index
18. Cup Anemometer
19. Sonic Anemometer

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)
- [Chapter 6: Temperature: From the Thermoscope to the Silicon Chip](../06-temperature/index.md)
- [Chapter 7: Barometric Pressure: The Weight of the Atmosphere](../07-barometric-pressure/index.md)
- [Chapter 8: Humidity and Dew Point: The Water Hidden in the Air](../08-humidity-and-dew-point/index.md)

---

## Air Rolling Downhill

Open a door between a warm room and a cold one and you feel a draught.

That draught is wind, and it happens for the same reason all wind happens. The two rooms are at slightly different pressures, and air moves from the higher pressure to the lower one until the difference is gone.

**Wind** is the horizontal movement of air relative to the Earth's surface. It is not caused by anything mysterious. It is air rolling downhill — where "downhill" means from high pressure toward low.

Everything in this chapter follows from that one sentence, and the chain that produces it runs back through the last three chapters:

1. The Sun heats the ground unevenly (Chapter 9)
2. Uneven heating makes some air warmer than other air (Chapter 6)
3. Warm air expands, becomes less dense, and rises
4. Rising air leaves lower pressure behind, and sinking air produces higher pressure (Chapter 7)
5. Air flows from high pressure to low pressure — wind

## Highs, Lows, and Fronts

**Pressure** varies from place to place across a continent. Chapter 7 measured it at a point; here it becomes a landscape.

A **high pressure system** is a region where atmospheric pressure is higher than in the surrounding area, produced by air sinking from above. As that air descends it is compressed and warms, and warming air moves *away* from saturation — so clouds evaporate rather than form. High pressure means fair, settled weather.

A **low pressure system** is a region where pressure is lower than the surroundings, produced by air rising. Rising air expands and cools, moves *toward* saturation, and its moisture condenses. Low pressure means clouds, wind, and precipitation.

That is the entire mechanism connecting Chapter 7's barometer to Chapter 8's water cycle:

| | High pressure system | Low pressure system |
|---|---|---|
| Air motion | Sinking | Rising |
| Air temperature change | Warms by compression | Cools by expansion |
| Relative humidity trend | Falls | Rises toward saturation |
| Cloud | Dissipates | Forms |
| Typical weather | Clear, settled, light wind | Cloudy, windy, wet |
| Typical pressure | Above 1020 hPa | Below 1000 hPa |
| Rotation, northern hemisphere | Clockwise | Counter-clockwise |
| Rotation, southern hemisphere | Counter-clockwise | Clockwise |

That rotation is worth a note. Air does not flow straight from high to low, because the Earth is turning underneath it. The apparent deflection this produces — to the right in the northern hemisphere, to the left in the southern — is called the Coriolis effect, and it turns what would be a straight rush into a spiral. It is why weather systems on satellite images are swirls rather than blobs.

A **weather front** is the boundary between two air masses with different temperature and humidity. Chapter 1 introduced air masses; a front is where two of them meet and refuse to mix.

- A **cold front** occurs where advancing cold air pushes under warmer air. The cold air is denser, so it wedges beneath and forces the warm air up sharply. That rapid lift produces tall clouds, brief intense rain, gusty wind, and a sharp temperature drop. Cold fronts pass quickly.
- A **warm front** occurs where advancing warm air rides up over retreating cold air. The slope is gentle, so the lift is gradual: high thin cloud first, thickening over many hours, then steady light rain. Warm fronts pass slowly.

Your station can identify a cold front passage from its own data with no radar and no forecast. The signature is unmistakable once you know it: pressure falls, then rises sharply; wind speed spikes and direction shifts abruptly; temperature drops several degrees within an hour; dew point drops too. Chapter 15 covers finding this in your logs.

## The Pressure Gradient

**Pressure gradient** is the rate at which pressure changes with horizontal distance. It is the *steepness* of the pressure landscape, not its height.

This distinction is the key to predicting wind, and it is where beginners go wrong. Wind speed is not determined by how low the pressure is. It is determined by how rapidly pressure changes over distance.

The analogy is a hill. A ball rolls fast down a steep slope and slowly down a gentle one, regardless of how high up it started. A deep low pressure system with gentle gradients around it produces light winds. A modest low with tight gradients produces strong ones.

On a weather map, pressure is drawn as isobars — lines connecting points of equal pressure, exactly like contour lines on a topographic map. And they are read the same way:

- **Isobars close together** — steep gradient — strong wind
- **Isobars far apart** — gentle gradient — light wind

This is genuinely useful. You can look at a pressure map with no wind information printed on it at all and read the wind straight off the spacing of the lines.

#### Diagram: Pressure Gradient Wind Map

<iframe src="../../sims/pressure-gradient-wind-map/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Pressure Gradient Wind Map</summary>
Type: microsim
**sim-id:** pressure-gradient-wind-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: examine

Learning objective: The learner examines an isobar map to predict wind speed and direction at any point, and differentiates the effect of gradient steepness from the effect of absolute pressure.

Purpose: "Low pressure means strong wind" is a durable and wrong student belief. Building maps where a deep low has weak winds and a shallow low has strong ones is the only reliable way to break it, and it cannot be done with a fixed illustration.

Canvas layout:
- Main area: a plan-view synoptic map with drawn isobars labeled in hPa, a coastline outline for orientation, and pressure centers marked H and L
- Overlay: wind arrows at grid points, with length proportional to speed
- Right or below (responsive): a readout panel for the probed point
- Bottom: controls and scenario selector
- Responsive to window resize; the map preserves aspect ratio

Data Visibility Requirements:
  Stage 1: Show the isobar field with values labeled
  Stage 2: On probing a point, show the local pressure in hPa
  Stage 3: Show the gradient at that point as a pressure difference over a distance, e.g. "8 hPa over 200 km = 4 hPa per 100 km"
  Stage 4: Show the resulting wind speed with the category and the Beaufort force
  Stage 5: Show wind direction, including the Coriolis deflection, with an annotation stating that air crosses isobars at an angle rather than flowing straight downhill

Scenarios, chosen specifically to separate depth from gradient:
1. **Deep low, gentle gradients** — center at 970 hPa, isobars widely spaced. Winds light. Verdict text: "Very low pressure. Light wind. The value is not the signal."
2. **Shallow low, tight gradients** — center at 1002 hPa, isobars close together. Winds strong. Verdict: "Higher central pressure than scenario 1, much stronger wind. The gradient is the signal."
3. **Strong high with tight gradients on one flank** — shows that strong wind occurs around highs too, not only lows.
4. **Cold front passage** — a kinked isobar pattern; probing points either side of the front shows an abrupt direction shift and a temperature and dew point change, matching the signature described in the chapter text.
5. **Two systems adjacent** — a squeeze zone of very tight isobars between a high and a low, with the strongest winds on the map located between them rather than at either center.

Interactive controls:
- Click or drag anywhere on the map to probe that point
- "Draw the gradient" toggle that renders a perpendicular arrow from the probed point across the isobars, with the distance and pressure difference labeled
- Hemisphere toggle, which reverses the Coriolis deflection and the rotation of both systems
- "Hide wind arrows" mode, in which the learner must predict where winds are strongest by reading isobar spacing alone, then reveal to check. Score across five attempts.

Instructional Rationale: The objective is Analyze/examine, which requires reading structure out of a field rather than a single value. The hide-the-arrows prediction mode converts passive map reading into a testable claim. The scenario pairing of deep-but-gentle against shallow-but-tight is the specific configuration that makes the misconception fail, and it must be reachable in a single click for classroom use.

Implementation: p5.js. Define pressure fields analytically as sums of Gaussian centers so gradients are exactly computable. Derive geostrophic wind speed from the gradient, then apply a surface friction factor and a cross-isobar angle of about 30 degrees over land.
</details>

## Direction and the Vane

**Wind direction** is the compass direction the wind is coming *from*, not the direction it is going toward.

This convention catches everybody once. A north wind blows from the north toward the south. A "westerly" comes from the west. The reason is practical and old: a sailor cares where the weather is arriving from, because that is where the next weather is coming from too.

Direction is reported in degrees clockwise from true north, so 0 or 360 is north, 90 is east, 180 is south, and 270 is west. Storing degrees rather than compass points matters for your data, and Chapter 15 explains a subtlety in averaging them.

A **weather vane** is an instrument that indicates wind direction by pivoting freely so its tail is pushed downwind and its pointer aims into the wind.

The design is ancient. The Tower of the Winds in Athens, built around 50 BC by Andronicus of Cyrrhus, carried a bronze vane on its roof and personified the eight winds in relief carvings on its faces. Weather vanes have been on rooftops continuously since.

The physics is simple asymmetry: a large tail surface and a small head. Wind pushes harder on the larger surface, swinging it downwind until the vane points into the wind and the forces balance.

Modern electronic vanes replace the pointer with a position sensor — a potentiometer, a set of magnetic switches, or an optical encoder — that reports the angle as a number.

## Measuring Speed

**Wind speed** is how fast air is moving past a point. Measuring it took much longer to solve than direction did.

An **anemometer** is an instrument that measures wind speed. The name is from the Greek *anemos*, wind.

### Pressure Plates

Leon Battista Alberti built the first known anemometer around 1450: a flat plate hung so the wind pushed it up an arc, with the angle read against a scale. Robert Hooke reinvented the same design in the 1600s.

The idea is sound — wind force does relate to speed — but the design is difficult to calibrate, sensitive to the plate's exact shape and weight, and it must be aimed into the wind to work at all. Swinging-plate anemometers survive today only as simple hand-held indicators.

### The Beaufort Scale

The most durable solution to measuring wind was not an instrument at all. It was a set of words.

In 1805 Francis Beaufort, a Royal Navy officer, wrote a scale describing wind by its observable effects. His original version was written for sailors and defined each force by how much sail a well-conditioned man-of-war could carry. It was later extended with descriptions of the sea state and, for land use, the behavior of smoke, trees, and structures. The Royal Navy adopted it officially in 1838.

The **Beaufort scale** is a 13-point scale from 0 to 12 relating wind speed to observed conditions on land and at sea.

| Force | Description | Speed (m/s) | On land |
|-------|-------------|-------------|---------|
| 0 | Calm | 0–0.2 | Smoke rises vertically |
| 1 | Light air | 0.3–1.5 | Smoke drifts; vanes do not move |
| 2 | Light breeze | 1.6–3.3 | Leaves rustle; wind felt on face |
| 3 | Gentle breeze | 3.4–5.4 | Leaves and twigs in constant motion |
| 4 | Moderate breeze | 5.5–7.9 | Dust and loose paper raised |
| 5 | Fresh breeze | 8.0–10.7 | Small trees sway |
| 6 | Strong breeze | 10.8–13.8 | Large branches move; umbrellas difficult |
| 7 | Near gale | 13.9–17.1 | Whole trees move; walking is hard |
| 8 | Gale | 17.2–20.7 | Twigs break off trees |
| 9 | Strong gale | 20.8–24.4 | Slight structural damage |
| 10 | Storm | 24.5–28.4 | Trees uprooted; considerable damage |
| 11 | Violent storm | 28.5–32.6 | Widespread damage |
| 12 | Hurricane | 32.7+ | Devastation |

It is worth appreciating what Beaufort actually achieved here, because it is a measurement-theory lesson as much as a meteorological one. He did not invent an instrument. He solved a **standardization** problem of exactly the kind Chapter 2 described: he made observations from thousands of ships comparable to one another, using equipment every ship already had — a person with eyes. It is one of the most successful measurement standards ever created, and it is still in daily use over two centuries later.

Note from Chapter 2 that the Beaufort scale is ordinal. Force 8 is not twice force 4.

### The Cup Anemometer

John Thomas Romney Robinson gave the world the standard instrument in 1846.

A **cup anemometer** has three or four hemispherical cups on horizontal arms mounted on a vertical shaft. The cups catch more wind on their concave side than their convex side, so the assembly spins, and the rotation rate is proportional to wind speed.

Its critical virtue is that it works regardless of wind direction. No aiming, no tracking, no moving parts to point. Robinson originally believed the cups always moved at one third of the wind speed regardless of size — that turned out to be wrong, and modern cup anemometers are individually calibrated — but the design has outlived the error and remains the world standard for surface weather stations.

Its limitations are worth knowing, because they will show up in your data:

- **Inertia.** The cups take time to spin up and, more importantly, take time to slow down. A cup anemometer over-reports in gusty conditions because it never fully slows between gusts.
- **Stall.** Below roughly 0.5 m/s, friction prevents the cups from turning at all, and the instrument reads zero when the wind is merely light.
- **Wear.** Bearings degrade outdoors. A gradually stiffening bearing produces a slow downward drift that looks exactly like the weather getting calmer.

### Sonic Anemometers

A **sonic anemometer** measures wind speed by timing ultrasonic pulses between fixed transducers.

The principle is elegant: sound travelling with the wind arrives sooner than sound travelling against it. Measure the difference in transit time along a known path and you get the wind component along that path. Use three pairs of transducers and you get all three components of the wind vector, including vertical motion.

There is nothing that spins. That means no inertia, no stall speed, no bearings to wear out, and a response fast enough to resolve turbulence. Sonic anemometers can measure at 20 or more samples per second, which is what makes them the standard for research work.

The trade is cost and fragility. They are expensive, and ice or heavy rain on the transducers disrupts the measurement — so heated versions exist and cost more still.

| | Cup anemometer | Sonic anemometer |
|---|---|---|
| Moving parts | Yes | None |
| Stall speed | About 0.5 m/s | None |
| Response | Seconds | Milliseconds |
| Measures vertical wind | No | Yes |
| Affected by icing | Yes | Yes, differently |
| Cost | Low | High |
| Typical use | Weather stations | Research, turbulence |

!!! info "Your wind sensor is not chosen yet"
    [Components Used](../../components.md) has no wind sensor entry at all. This chapter is written to the physics so it stands whichever sensor is chosen, but there is a wiring consequence worth flagging now.

    Most affordable cup anemometers report speed as a **pulse train** — one or more electrical pulses per rotation — rather than as a digital value over I2C. That means the Raspberry Pi must count pulses on a GPIO pin over a timed interval, which is a different technique from the I2C reads in Chapter 12. A reed switch or Hall-effect anemometer needs a GPIO input, a pull-up resistor as described in Chapter 3, and software debouncing.

    Direction vanes are commonly potentiometer-based, producing an analog voltage — and Chapter 4 established that the Raspberry Pi has no built-in ADC, so an external one would be required. Choosing the parts changes what Chapter 12 has to teach.

## Units

Wind speed is reported in four units, divided by profession rather than by geography.

**Meters per second** (m/s) is the SI unit and the standard in scientific work. It is what your station should store.

The **knot unit** (kn) is one nautical mile per hour, and a nautical mile is one minute of latitude — about 1852 metres. It is standard in marine and aviation use worldwide, and its persistence is not arbitrary: because it derives from latitude, speed in knots relates directly to position on a chart.

Kilometres per hour and miles per hour are used in general public forecasts.

| From m/s | Multiply by | To get |
|----------|-------------|--------|
| m/s | 3.6 | km/h |
| m/s | 2.237 | mph |
| m/s | 1.944 | knots |

A rough mental conversion worth having: **m/s to knots, roughly double it.** 10 m/s is about 19 knots.

## What Wind Does To People

Wind changes how temperature feels, and in two opposite directions depending on humidity.

**Apparent temperature** is the temperature a human perceives, accounting for the combined effect of air temperature, humidity, wind, and sometimes solar radiation. It is what "feels like" means in a forecast.

**Wind chill** is apparent temperature in cold conditions, where wind makes it feel colder than the thermometer reads.

The mechanism is a boundary layer. Your body warms a thin film of air right against your skin, and that warmed film insulates you. Wind strips it away and replaces it with cold air, which you then have to warm again. Faster wind removes heat faster.

Paul Siple and Charles Passel published the first wind chill formula in 1945, based on measuring how quickly water froze in plastic cylinders in Antarctica. That method had known flaws — a plastic cylinder is not a face — and in 2001 the US National Weather Service and Environment Canada replaced it with a model based on heat transfer from a human face, validated with volunteers in a chilled wind tunnel.

Two properties of wind chill are important to state clearly:

- **It only applies below about 10 °C.** Above that, wind is pleasant rather than dangerous.
- **It does not cool objects below air temperature.** A car left outside in a −5 °C wind reaches −5 °C, not the wind chill value. Wind chill describes the *rate* of heat loss from a warm body, not a temperature the air actually attains. Pipes freeze at the air temperature; people get frostbite at the wind chill rate.

**Heat index** is apparent temperature in hot conditions, combining air temperature and relative humidity.

Here wind is not the main variable — humidity is, and Chapter 8 explained why. You cool yourself by evaporating sweat. High humidity means the air is already close to saturated, so sweat evaporates slowly, so cooling fails. At 32 °C the heat index is about 31 °C at 40 percent humidity and about 41 °C at 80 percent humidity. Same air temperature, ten degrees of difference in effect.

And unlike wind chill, heat index describes a genuine danger with a physical limit. Chapter 8 introduced wet bulb temperature; when it approaches human body temperature, evaporative cooling stops working entirely and no amount of shade or water helps.

#### Diagram: Apparent Temperature Explorer

<iframe src="../../sims/apparent-temperature-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Apparent Temperature Explorer</summary>
Type: chart
**sim-id:** apparent-temperature-explorer<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Apply (L3)
Bloom Verb: calculate

Learning objective: The learner calculates apparent temperature from air temperature, wind speed, and humidity, and explains why wind dominates in cold conditions while humidity dominates in hot conditions.

Purpose: Wind chill and heat index are usually taught as two unrelated lookup tables. Presenting them as one continuous apparent-temperature surface, with the dominant variable switching at a threshold, shows that they are two regimes of one question: how fast can this body shed heat?

Chart type: Heatmap with an overlaid probe point, plus a toggleable line-chart cross-section

Primary view — heatmap:
X-axis: Air temperature, −40 to 50 °C
Y-axis: The secondary variable, which switches with regime — wind speed 0 to 30 m/s in the cold regime, relative humidity 0 to 100 percent in the hot regime
Cell color: Apparent temperature, on a diverging scale centered on the air temperature so cells where it feels colder and warmer than actual are visually distinct

A vertical band between about 10 °C and 27 °C is drawn in neutral gray and labeled "Neither correction applies. Wind is pleasant, humidity is tolerable."

Secondary view — cross-section: fixing air temperature and sweeping the secondary variable, plotted as a line so the learner can read the magnitude of the effect directly.

Data Visibility Requirements:
  Stage 1: Show the probed air temperature and secondary variable
  Stage 2: Show the apparent temperature
  Stage 3: Show the difference from actual, e.g. "feels 11 degrees colder"
  Stage 4: Show the risk category — frostbite time in minutes in the cold regime, heat illness risk in the hot regime
  Stage 5: Show a plain-language mechanism sentence appropriate to the regime, e.g. "Wind is stripping away the warm air film against your skin" or "Humidity is preventing sweat from evaporating"

Required teaching moments:
- Probing a car or a water pipe rather than a person: a toggle labeled "What is being cooled?" with options Person, Car, Water pipe. For the non-human options the apparent temperature readout must be replaced with the air temperature and the caption "Objects cool to the air temperature, not to the wind chill. Wind chill is a rate of heat loss from a warm body, not a temperature the air reaches." This directly targets a common misconception.
- A wet-bulb overlay in the hot regime marking the region where wet bulb temperature exceeds 35 °C, labeled "Evaporative cooling fails here. Survivable for only a few hours even at rest."
- A comparison pin: the learner can pin one condition and probe another, with the two apparent temperatures displayed side by side.

Interactive features:
- Click or drag anywhere on the heatmap to probe
- Regime toggle, or automatic switching based on the probed temperature with a visible notice when it switches
- Cross-section toggle
- Unit selector for wind speed: m/s, km/h, mph, knots — reinforcing the conversion table above
- Preset conditions: "Minnesota January", "Gulf Coast August", "Sahara noon", "British autumn"

Implementation: Chart.js matrix/heatmap plugin for the primary view and a line chart for cross-sections. Use the 2001 NWS wind chill formula and the Rothfusz heat index regression, and state both sources in the infobox.
</details>

## What Wind Does To Structures

Wind exerts force, and the relationship is not gentle.

**Wind load** is the force wind exerts on a structure. It scales with the *square* of wind speed:

\[ F \propto v^2 \]

Doubling the wind speed quadruples the force. Tripling it multiplies the force by nine. This is why the difference between a 20 m/s storm and a 40 m/s hurricane is not "twice as bad" — it is four times the force on every wall, roof, and window.

| Wind speed | Relative force | Typical effect |
|-----------|----------------|----------------|
| 10 m/s | 1× | Branches move |
| 20 m/s | 4× | Twigs break; walking difficult |
| 30 m/s | 9× | Structural damage begins |
| 40 m/s | 16× | Roofs fail |
| 60 m/s | 36× | Severe destruction |

Building codes are written against wind speed records for a region, and Chapter 17 follows that thread. A building in coastal Florida and one in Ohio are designed to different wind loads because the historical wind data differs — data that came from stations like yours.

Two rating scales quantify extreme wind by its damage. The Saffir-Simpson scale rates hurricanes by sustained wind speed, and Chapter 15 covers it alongside sustained-wind calculation. The other belongs here.

The **Enhanced Fujita scale** rates tornado intensity from EF0 to EF5, based on the damage caused. Tetsuya Fujita created the original scale in 1971; it was revised in 2007 after engineering studies showed the original overestimated the wind speeds needed to cause given damage.

| Rating | Wind speed | Typical damage |
|--------|-----------|----------------|
| EF0 | 29–38 m/s | Branches broken, shingles peeled |
| EF1 | 38–49 m/s | Roof surfaces stripped, windows broken |
| EF2 | 50–60 m/s | Roofs torn off, mobile homes destroyed |
| EF3 | 61–74 m/s | Exterior walls collapse |
| EF4 | 75–89 m/s | Well-built houses levelled |
| EF5 | Over 89 m/s | Structures swept from foundations |

#### Diagram: Beaufort Scale Observation Trainer

<iframe src="../../sims/beaufort-observation-trainer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Beaufort Scale Observation Trainer</summary>
Type: microsim
**sim-id:** beaufort-observation-trainer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Understand (L2)
Bloom Verb: classify

Learning objective: The learner classifies a wind condition into a Beaufort force by observing its effects on trees, smoke, water, and loose objects, and converts that force into a wind speed range in m/s, km/h, and knots.

Purpose: The Beaufort scale is the chapter's best illustration of a measurement standard that needs no instrument, and it is also a genuinely usable skill — a student whose anemometer has not arrived can still take comparable wind observations. Training the eye requires seeing the effects animated, which a table cannot do.

Canvas layout:
- Main area: a scene containing a deciduous tree, a chimney with smoke, a flag on a pole, loose paper on the ground, a small pond surface, and a person walking — every one of them responding to the current wind
- Left: a Beaufort force selector, 0 through 12, with the standard description text
- Right or below (responsive): the speed range for the selected force in four units, and a feedback panel
- Bottom: mode controls
- Responsive to window resize; the scene scales and reflows

Visual response requirements — each element must behave distinguishably across the range:
- **Smoke**: rises vertically at force 0, drifts at 1, bends progressively, becomes horizontal and torn by force 6
- **Tree**: still at 0, leaves rustling at 2, twigs in constant motion at 3, small branches at 4, whole small trees swaying at 5, large branches at 6, whole trees moving at 7, twigs breaking off at 8, branches breaking at 9, uprooting at 10
- **Flag**: hanging limp, lifting, extending, snapping and cracking
- **Loose paper**: still, stirring at force 4, lifted and blown at 5 and above
- **Pond surface**: glassy at 0, ripples at 1, small wavelets at 2, whitecaps beginning at 4
- **Person**: walking normally, leaning slightly at 6, walking with difficulty at 7, unable to make headway at 8

Two modes:
1. **Explore** — the learner sets a force and watches all elements respond, with the description and speed ranges shown. Free exploration to build the association.
2. **Identify** — the sim sets a hidden force and animates the scene. The learner must classify it. On answering, feedback names which cue was decisive: "Correct. Whole trees in motion and difficulty walking is force 7, near gale, 13.9 to 17.1 m/s." Wrong answers get a targeted hint: "Look at the smoke. It is fully horizontal, which rules out anything below force 5." Ten rounds with a score.

Additional controls:
- A "cheat sheet" toggle showing the full Beaufort table, off by default in Identify mode
- Unit selector cycling the displayed speed range between m/s, km/h, mph, and knots
- A "compare two forces" split-screen so the learner can see, for example, force 4 and force 6 side by side, since adjacent forces are the hard discriminations

Instructional Rationale: The objective is Understand/classify, and classification is trained by exposure to varied instances with feedback, not by reading the criteria. Animating multiple independent cues simultaneously matters because real Beaufort estimation is a judgment across several weak signals rather than one strong one — and the hint system teaching learners to check the strongest available cue is the transferable skill.

Implementation: p5.js. Drive every scene element from a single wind-speed value so they cannot disagree. Use simple procedural animation — sine-based sway with amplitude and frequency scaled by wind speed, particle drift for smoke — rather than sprite sheets, so there are no external assets.
</details>

The Enhanced Fujita scale works backwards from damage to wind speed, which is unusual among measurement scales. The reason is practical: tornadoes destroy anemometers. Direct measurement inside a violent tornado is nearly impossible, so engineers survey the damage afterward and infer the wind speed required to produce it. It is measurement by consequence rather than by instrument — an approach Chapter 11 will meet again in earthquake intensity scales.

## Key Takeaways

- **Wind** is air moving from high to low pressure. **High pressure systems** have sinking air and fair weather; **low pressure systems** have rising air, cloud, and rain. A **weather front** is the boundary between air masses.
- **Pressure gradient** — the rate of pressure change with distance — determines wind speed, not the absolute pressure. Tight isobars mean strong wind.
- **Wind direction** is where wind comes *from*, in degrees clockwise from north. A **weather vane** points into the wind.
- An **anemometer** measures **wind speed**. The **cup anemometer** (1846) is the station standard; the **sonic anemometer** has no moving parts, no stall speed, and much faster response.
- The **Beaufort scale** solved standardization without an instrument, by describing observable effects. It is ordinal.
- **Meters per second** is the SI unit; the **knot unit** derives from latitude and persists in marine and aviation use.
- **Apparent temperature** covers both **wind chill** in the cold and **heat index** in the heat. Wind chill applies to warm bodies, not to objects.
- **Wind load** scales with the square of wind speed. The **Enhanced Fujita scale** rates tornadoes by inferring wind speed from damage.

## Check Yourself

??? question "System A is a 970 hPa low with widely spaced isobars. System B is a 1002 hPa low with tightly packed isobars. Which has stronger winds? Click to check."
    **System B.** Wind speed depends on the pressure *gradient* — how fast pressure changes with distance — not on how low the central pressure is. B's tightly packed isobars mean a steep gradient and strong wind, despite its higher central pressure. This is the hill analogy: a ball rolls fast down a steep slope regardless of how high the hilltop was.

??? question "The forecast says −20 °C with a wind chill of −35 °C. What temperature will an unheated water pipe reach? Click to check."
    **−20 °C**, the actual air temperature. Wind chill describes how fast a *warm body* loses heat, not a temperature the air attains. Wind cannot cool anything below the air temperature — it can only bring an object to air temperature faster. So the pipe will freeze, but at −20 °C and no colder. A person, however, will develop frostbite at the −35 °C rate, which is why the number is reported.

??? question "Wind increases from 15 m/s to 30 m/s. How much does the force on a roof increase? Click to check."
    **Four times.** Wind load scales with the square of speed, so doubling the speed gives \(2^2 = 4\) times the force. This is why building damage escalates so steeply with wind speed, and why a storm that is only modestly faster than the last one can be far more destructive.

??? question "Your cup anemometer has read a steady 0.0 m/s all morning, but leaves are rustling outside. Broken? Click to check."
    Not necessarily. Rustling leaves is Beaufort force 2, roughly 1.6 to 3.3 m/s, which should register. But check the stall speed first: cup anemometers stop turning below about 0.5 m/s, and a worn or dirty bearing raises that threshold considerably. A stiffening bearing produces exactly this failure — the instrument reads zero in light wind and under-reads in moderate wind, drifting downward over months in a way that mimics a genuinely calmer season. Spin the cups by hand and see whether they turn freely and coast.

---

## What Is Next

Six of the seven quantities so far have been properties of the air. The last measurement in this part of the book is not about the atmosphere at all.

Chapter 11 goes underground. It covers ground motion — earthquakes, the seismic waves they send through the planet, and the instruments that detect them. The instrument lineage is the oldest in this book, beginning with a bronze vessel ringed with dragons in 138 AD, and the modern end of it is a chip small enough that a student station can afford one. Along the way it draws the distinction between magnitude and intensity, which is the most commonly confused pair of ideas in this entire book.
