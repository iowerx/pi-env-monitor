---
title: "Humidity and Dew Point: The Water Hidden in the Air"
description: The water cycle, absolute versus relative humidity, dew point and vapor pressure, and the hygrometer lineage from horsehair to the thin-film capacitive sensor in the BME280.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:21:43
version: 0.09
---
# Humidity and Dew Point: The Water Hidden in the Air

## Summary

Water vapor is invisible, so measuring it took ingenuity. This chapter first builds the water cycle — evaporation, condensation, cloud formation, and precipitation — then distinguishes the three ways to describe moisture: absolute humidity, relative humidity, and dew point. It explains through vapor pressure why warm air holds more water, which is why fog forms overnight without any new water arriving. The instrument history runs from the hair hygrometer through the psychrometer to the capacitive thin-film sensor used in this station.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Water Vapor
2. Humidity
3. Absolute Humidity
4. Partial Pressure Of Vapor
5. Hair Hygrometer
6. Capacitive Sensing
7. Saturation Vapor Pressure
8. Convection
9. Evaporation
10. Condensation
11. Relative Humidity
12. Precipitation
13. Dew Point
14. Wet Bulb Temperature
15. Capacitive Humidity Sensor
16. Cloud Formation
17. Psychrometer
18. Chilled Mirror Hygrometer
19. Dew And Frost Formation
20. Fog Formation

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)
- [Chapter 6: Temperature: From the Thermoscope to the Silicon Chip](../06-temperature/index.md)
- [Chapter 7: Barometric Pressure: The Weight of the Atmosphere](../07-barometric-pressure/index.md)

---

## Two Days, Same Number, Different Worlds

Here are two days. Both report 50 percent humidity.

- **Day one:** 32 °C, 50 percent humidity. Stepping outside feels like walking into a wet towel. Sweat runs and does not dry. Everyone is miserable.
- **Day two:** 5 °C, 50 percent humidity. The air feels dry and crisp. Lips chap. Static shocks on every doorknob.

Same percentage. Completely different air. If that number described how much water was in the air, those two days would feel similar. They do not, and the reason is that the percentage everyone quotes is not an amount at all.

It is a comparison. This chapter is about what it is being compared to, and about the number that actually predicts how a day will feel.

## Water Vapor and the Water Cycle

**Water vapor** is water in its gas phase — individual water molecules mixed in among the nitrogen and oxygen of the air, moving freely and completely invisible.

That last word matters. Steam from a kettle and clouds in the sky are *not* water vapor; they are tiny liquid droplets, which is why you can see them. Real water vapor cannot be seen at all. The air in front of you right now contains water and looks like nothing.

Water vapor makes up a small and highly variable share of the atmosphere — from nearly zero over a desert or in polar air to about 4 percent in humid tropical air. It is the most variable component of the atmosphere and, per molecule, one of the most consequential. It carries enormous amounts of energy, and it is the raw material of every cloud and every storm.

Getting water into and out of the air is a cycle with three processes.

**Evaporation** is liquid water becoming vapor. It happens whenever fast-moving molecules at a water surface escape into the air. This is not a boiling-only process — a puddle evaporates at 15 °C, just slowly. Evaporation happens faster when the air is warmer, drier, or moving.

Evaporation has a property that is easy to overlook and matters constantly: **it cools what it leaves behind.** The molecules that escape are the fastest ones, so the average energy of those remaining falls, and Chapter 6 defined temperature as exactly that average. This is why sweating works, why you feel cold stepping out of a pool, and — as you will see shortly — how a psychrometer measures humidity.

**Condensation** is vapor becoming liquid. It happens when air is cooled enough that it can no longer hold all the vapor it contains, and molecules stick together into droplets.

Condensation is where the energy comes back. Every molecule that condenses releases the energy it absorbed when it evaporated, warming the surrounding air. That released heat is what powers thunderstorms and hurricanes: warm ocean water evaporates, the vapor rises and condenses, and the released energy drives the storm harder.

**Convection** — introduced in Chapter 6 as a mode of heat transfer — is what lifts the vapor. Sun-warmed air near the ground becomes less dense and rises, carrying water vapor with it. As it rises it cools, because pressure falls with height and expanding air cools.

Put those together and you get **cloud formation**. Warm moist air rises by convection, cools as it rises, reaches the height where it can no longer hold its vapor, and condenses onto microscopic airborne particles — dust, salt, pollen — called condensation nuclei. Billions of tiny droplets form, and that is a cloud.

When droplets in a cloud collide and merge enough to become too heavy to stay aloft, you get **precipitation** — water falling from the atmosphere to the ground as rain, snow, sleet, or hail. Which form arrives depends on the temperature profile it falls through.

!!! note "Clouds are not water vapor"
    A cloud is liquid droplets or ice crystals — condensed water you can see. The vapor is the invisible stage before and after. A common exam question asks students to identify what is in a cloud, and "water vapor" is the wrong answer. Where the air is genuinely full of vapor and nothing else, it looks perfectly clear.

## Three Ways to Say How Wet the Air Is

**Humidity** is the general term for the amount of water vapor in the air. It is deliberately vague, because there are three precise ways to pin it down, and they answer different questions.

### Absolute Humidity

**Absolute humidity** is the actual mass of water vapor per unit volume of air, usually in grams per cubic metre.

It is the most straightforward of the three: literally how much water is present. Typical outdoor values run from under 1 g/m³ in very cold or desert air to around 30 g/m³ in humid tropical air.

Absolute humidity is honest and rarely quoted. Its inconvenience is that it changes when air expands or compresses even though no water was added or removed, since the volume in the denominator changed.

### Vapor Pressure and Saturation

Before relative humidity can be defined properly, one idea from Chapter 7 has to be extended.

**Partial pressure of vapor** is the portion of total atmospheric pressure contributed by water vapor alone.

John Dalton established the underlying principle around 1801: in a mixture of gases, each gas exerts pressure independently, as if the others were not there, and the total pressure is the sum of the parts. So of 1013 hPa of atmospheric pressure, nitrogen contributes roughly 790 hPa, oxygen roughly 212 hPa, and water vapor might contribute anywhere from 1 to 40 hPa depending on conditions.

**Saturation vapor pressure** is the maximum partial pressure of water vapor that air can sustain at a given temperature. Push past it and the excess condenses.

And here is the fact that explains the entire chapter: **saturation vapor pressure rises steeply with temperature.** Not linearly — steeply, roughly doubling for every 10 °C.

| Temperature | Saturation vapor pressure | Maximum water the air can hold |
|-------------|---------------------------|-------------------------------|
| −10 °C | 2.6 hPa | 2.1 g/m³ |
| 0 °C | 6.1 hPa | 4.8 g/m³ |
| 10 °C | 12.3 hPa | 9.4 g/m³ |
| 20 °C | 23.4 hPa | 17.3 g/m³ |
| 30 °C | 42.4 hPa | 30.4 g/m³ |
| 40 °C | 73.8 hPa | 51.1 g/m³ |

Read that first and last row again. Air at 40 °C can hold about twenty-four times as much water as air at −10 °C. That single fact drives dew, fog, frost, clouds, rain, and why a heated house in winter feels so dry.

!!! note "'Air holds water' is a useful fiction"
    You will hear that warm air "holds more moisture," and this book uses that phrasing because it is intuitive. Strictly it is wrong: air is not a sponge, and the nitrogen and oxygen are not doing any holding. What actually changes with temperature is how much vapor pressure water itself can sustain before condensing — a property of the water, not of the air. The sponge picture predicts correctly for everything in this chapter, so it is a fiction worth keeping, as long as you know it is one.

### Relative Humidity

**Relative humidity** is the ratio of the actual vapor pressure to the saturation vapor pressure at the current temperature, written as a percentage:

\[ \text{RH} = \frac{\text{actual vapor pressure}}{\text{saturation vapor pressure}} \times 100\% \]

This is the number in every forecast, and now the opening puzzle resolves. Fifty percent means "half of the maximum for *this* temperature," and the maximum changes enormously with temperature. Fifty percent at 32 °C is about 15 g/m³ of water. Fifty percent at 5 °C is about 3.4 g/m³. The hot day genuinely has more than four times the water in it, despite both reading 50 percent.

Relative humidity has a property that trips people up constantly: **it changes when the temperature changes, even if no water enters or leaves the air.** Cool a parcel of air and its relative humidity climbs, purely because the denominator shrank. This is why relative humidity almost always peaks just before dawn — the coldest moment — and bottoms out in mid-afternoon, with no change in the actual water content at all.

Relative humidity reaches 100 percent when the actual vapor pressure equals the saturation vapor pressure. At that point the air is saturated, and any further cooling forces condensation.

### Dew Point

**Dew point** is the temperature to which air must be cooled, at constant pressure, for it to become saturated and begin condensing.

Of the three measures, this is the most useful outdoors, for three reasons:

1. **It is absolute.** Dew point tracks the actual water content. If no water enters or leaves, the dew point stays put while the temperature and relative humidity swing all day.
2. **It predicts comfort directly.** How muggy a day feels is essentially a function of dew point, and the scale is remarkably consistent across people.
3. **It never exceeds the air temperature.** When dew point equals air temperature, relative humidity is 100 percent by definition.

Here is the comfort scale that makes dew point worth learning:

| Dew point | How it feels |
|-----------|--------------|
| Below 10 °C | Dry, crisp, comfortable |
| 10–13 °C | Pleasant |
| 13–16 °C | Noticeably humid |
| 16–18 °C | Sticky and uncomfortable |
| 18–21 °C | Oppressive |
| Above 21 °C | Miserable; heat stress risk rises sharply |

Now return to the opening puzzle one last time. Day one, 32 °C at 50 percent, has a dew point around 20 °C — oppressive. Day two, 5 °C at 50 percent, has a dew point around −4 °C — dry. The dew point told you in one number what the percentage obscured.

| | Absolute humidity | Relative humidity | Dew point |
|---|---|---|---|
| Units | g/m³ | percent | °C |
| Answers | How much water? | How close to saturated? | At what temperature does it condense? |
| Changes with temperature alone? | No | Yes | No |
| Predicts comfort | Poorly | Poorly | Very well |
| Predicts fog and dew | Poorly | Somewhat | Directly |
| Commonly reported | Rarely | Always | Increasingly |

#### Diagram: Humidity Three Ways

<iframe src="../../sims/humidity-three-ways/main.html" width="100%" height="602px" scrolling="no"></iframe>

<details markdown="1">
<summary>Humidity Three Ways</summary>
Type: microsim
**sim-id:** humidity-three-ways<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: distinguish

Learning objective: The learner distinguishes absolute humidity, relative humidity, and dew point by changing temperature while holding water content fixed, and explains why relative humidity changes when nothing was added to the air.

Purpose: This is the chapter's central confusion and it survives ordinary explanation. Letting the learner cool a parcel of air with the water content locked, and watch relative humidity climb to 100 percent while absolute humidity and dew point sit perfectly still, is the demonstration that settles it.

Canvas layout:
- Left: a container representing a parcel of air, drawn with a visible count of water molecules and a "capacity line" whose height is the saturation limit at the current temperature
- Center: three large readouts stacked vertically — absolute humidity, relative humidity, dew point — each with a small history strip showing how it has moved in the last minute of interaction
- Right or below (responsive): the saturation vapor pressure curve, with the current state plotted as a point on it
- Bottom: controls
- Responsive to window resize

Data Visibility Requirements:
  Stage 1: Show the molecule count and the capacity line, with the gap between them labeled "room for more"
  Stage 2: Show all three humidity measures for the current state simultaneously
  Stage 3: When temperature changes, animate ONLY the capacity line moving; the molecule count must visibly stay fixed. Display a running caption: "Water content unchanged. Capacity changed."
  Stage 4: When the capacity line reaches the molecule count, mark relative humidity 100 percent and begin removing molecules as visible droplets, with a caption "Condensation. Water is now leaving the air."
  Stage 5: Show the current state as a moving point on the saturation curve so the learner connects the container view to the graph

Interactive controls:
- Temperature slider, −10 to 40 °C
- "Add water" and "Remove water" buttons that change the molecule count directly, so the learner can compare the two ways of changing relative humidity
- Lock toggles: "Lock water content" (default on) and "Lock relative humidity", so the learner can hold each constant and see what the others do
- Scenario presets:
  - "Overnight cooling" — start at 25 °C with a dew point of 15 °C, then drop temperature through the night. Relative humidity climbs from about 54 percent to 100 percent with zero water added. Caption: "This is how dew forms."
  - "Heated house in winter" — take outdoor air at 0 °C and 80 percent RH and warm it to 21 °C indoors. Relative humidity collapses to about 20 percent. Caption: "Nothing dried the air. You warmed it."
  - "The two 50 percent days" — the chapter's opening puzzle, side by side, showing both at 50 percent RH with dew points of 20 °C and −4 °C.

Instructional Rationale: The objective is Analyze/distinguish, which requires the learner to hold one variable fixed and observe the others. The lock toggles make that experimental control an explicit interface element. The design decision that carries the lesson is animating only the capacity line while the molecule count stays visibly frozen — students believe cooling air "squeezes water out," and seeing the water sit still while the limit descends to meet it corrects that directly.

Implementation: p5.js. Compute saturation vapor pressure with the Magnus formula. Derive relative humidity and dew point from water content and temperature so the three readouts cannot disagree.
</details>

## Dew, Frost, and Fog

Three familiar phenomena are all the same physics, differing only in where the cooling happens and how cold it gets.

**Dew and frost formation** happens at ground level on clear, calm nights. Surfaces radiate heat to the sky and cool below the surrounding air temperature — often several degrees below. When a surface cools past the dew point, the air touching it condenses onto it. If the dew point is above freezing, you get dew. If it is below freezing, vapor deposits directly as ice crystals and you get frost.

This is why dew appears on grass and car roofs but not under a tree or a carport: those surfaces are shielded from the open sky and cannot radiate away their heat as effectively.

**Fog formation** is the same event happening in the air itself rather than on a surface. When a whole layer of air cools to its dew point, condensation occurs throughout it, producing suspended droplets. Fog is a cloud that forms at ground level.

The conditions that favour it are specific and worth knowing, because they are also the conditions that make your station's overnight data interesting:

- A **clear sky**, so heat radiates away freely
- **Calm or very light wind** — enough to mix the lowest air slightly, but not enough to stir warm air down from above
- A **dew point close to the air temperature**, meaning a small gap to close
- **Long nights**, which is why fog is more common in autumn and winter

Your station can see fog coming before it arrives. Watch the gap between temperature and dew point through the evening. When the two converge, condensation is imminent. That is a genuine forecast, made from your own two numbers.

## Measuring the Invisible

Measuring something you cannot see took some ingenuity, and the instrument history is a good one.

### Hair

Around 1450 Nicholas of Cusa described balancing a ball of wool against stones on a scale. As the air grew damp the wool absorbed moisture and tipped the balance. Leonardo da Vinci sketched a version about thirty years later. Both were detecting *change*, with no number attached — the same limitation Chapter 6's thermoscope had.

In 1783 Horace-Bénédict de Saussure built the **hair hygrometer**, and it was the first humidity instrument good enough to read as a number.

The principle is odd and completely real: a human hair changes length with humidity, getting about 2 to 2.5 percent longer between bone dry and fully saturated. De Saussure fixed a hair at one end, attached the other to a lever and pointer, and calibrated the dial.

Hair hygrometers were the standard for well over a century. They are slow, they drift, and they are less accurate at the extremes — but they need no power, they work outdoors for years, and blonde hair, degreased, turned out to work best.

### Evaporation

A **psychrometer** measures humidity using two thermometers: one ordinary, and one with its bulb wrapped in a wet wick.

The wet one reads lower. Evaporation from the wick cools it, exactly as described earlier in this chapter — and here is the useful part: **the drier the air, the faster the evaporation and the greater the cooling.** The difference between the two thermometers is a direct measure of how dry the air is.

The **wet bulb temperature** is what the wet thermometer reads: the lowest temperature achievable by evaporating water into the air at constant pressure. In saturated air, evaporation cannot proceed, so the wet bulb equals the dry bulb and the difference is zero.

Psychrometers became standard after about 1825 and were refined into Richard Assmann's aspirated psychrometer in 1887, which added a fan to force a consistent airflow over both bulbs and made readings far more reproducible.

Wet bulb temperature has become significant for a reason beyond meteorology. Human beings cool themselves by sweating, which is evaporation — so if the wet bulb temperature reaches human body temperature, sweating cannot cool you no matter how much you drink or how much shade you find. A sustained wet bulb temperature around 35 °C is survivable for only a few hours even for a healthy person at rest. Chapter 17 returns to this.

### Chilled Mirrors

A **chilled mirror hygrometer** measures the dew point directly rather than inferring it. A small mirror is cooled while a light beam reflects off it and a detector watches the reflection. The instant condensation forms, the reflection scatters and dims. The mirror's temperature at that moment *is* the dew point, by definition.

These are the most accurate humidity instruments available and are used as reference standards — the top of the calibration chain from Chapter 2. They are also expensive, need regular cleaning, and are not something a school station will own. Knowing they exist matters because they are what everything else is ultimately calibrated against.

### Thin Films

**Capacitive sensing**, introduced in Chapter 4, measures capacitance: the ability of two conductors separated by an insulator to store electric charge. Capacitance depends on the plate area, the gap, and — critically — the electrical properties of the material in between.

A **capacitive humidity sensor** exploits that last dependence. Two electrodes sandwich a thin polymer film. The film absorbs and releases water vapor from the surrounding air, and because water strongly affects the film's electrical properties, the capacitance changes in proportion to relative humidity.

Vaisala introduced the first practical version, the HUMICAP, in 1973, and it changed the field. It is fast, it is small, it needs little power, it survives condensation, and it can be manufactured onto a chip. Essentially every electronic humidity sensor sold today, including the one in your BME280, works this way.

| | Hair hygrometer | Psychrometer | Chilled mirror | Capacitive film |
|---|---|---|---|---|
| Invented | 1783 | c. 1825 | 20th century | 1973 |
| Measures | Relative humidity | Wet bulb depression | Dew point directly | Relative humidity |
| Typical accuracy | ±5% RH | ±2% RH | ±0.1 °C dew point | ±3% RH |
| Needs power | No | No | Yes | Yes |
| Response time | Minutes | Seconds to minutes | Seconds | About 1 second |
| Cost | Low | Low | Very high | Very low |
| Where you meet it | Antique wall instruments | Traditional weather stations | Calibration laboratories | Your station |

#### Diagram: Psychrometer Wet Bulb Bench

<iframe src="../../sims/psychrometer-wet-bulb-bench/main.html" width="100%" height="592px" scrolling="no"></iframe>

<details markdown="1">
<summary>Psychrometer Wet Bulb Bench</summary>
Type: microsim
**sim-id:** psychrometer-wet-bulb-bench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Apply (L3)
Bloom Verb: demonstrate

Learning objective: The learner demonstrates how the difference between a dry bulb and a wet bulb thermometer yields relative humidity and dew point, and applies a psychrometric lookup to determine humidity from two temperature readings.

Purpose: The psychrometer is the clearest physical link between evaporation, cooling, and humidity, and running it makes evaporative cooling tangible rather than asserted. It also gives the learner a way to cross-check their electronic sensor with two ordinary thermometers, which is a real calibration technique they can perform.

Canvas layout:
- Left: two thermometers side by side, one dry and one with a visibly wet wick, both reading live, with a small fan icon whose speed the learner controls
- Center: a psychrometric lookup table with the current dry bulb row and wet bulb column highlighted at their intersection
- Right or below (responsive): the derived relative humidity and dew point, plus an explanation of the current state
- Bottom: controls
- Responsive to window resize

Data Visibility Requirements:
  Stage 1: Show the dry bulb temperature, set by the learner
  Stage 2: Show the wet bulb temperature settling to its equilibrium value as evaporation proceeds, with the depression (the difference) displayed as a number
  Stage 3: Highlight the table cell at that intersection and show the relative humidity read from it
  Stage 4: Show the derived dew point
  Stage 5: Show a plain-language interpretation, e.g. "Depression of 8 degrees means dry air. Evaporation from the wick is rapid."

Interactive controls:
- Dry bulb temperature slider, 0 to 45 °C
- True relative humidity slider, 5 to 100 percent — this is the hidden truth the instrument is measuring, and the wet bulb responds to it
- Airflow selector: still, natural breeze, forced (aspirated). Still air must produce a visibly less accurate and slower reading, with a caption explaining why Assmann added a fan in 1887.
- "Wet the wick" button that must be pressed to start, so the learner sees the wet bulb start equal to the dry bulb and then fall — the cooling is an event they cause
- Saturated-air demonstration: at 100 percent relative humidity, the wet bulb must fail to fall at all, with the caption "No evaporation is possible into saturated air, so there is no cooling and no depression. Both thermometers agree."

Cross-check mode: displays a simulated BME280 reading alongside the psychrometric result, with a small deliberate offset, and asks the learner which they should trust and why. Feedback explains the calibration chain from Chapter 2 and notes that an aspirated psychrometer is a legitimate field reference for checking an electronic sensor.

Instructional Rationale: The objective is Apply/demonstrate, so the learner must operate the instrument and read a result rather than watch one. Requiring the wick to be wet by a button press makes the evaporative cooling causal rather than ambient. The saturated-air case is included because a null result — no cooling at all — is the clearest possible proof that the cooling comes from evaporation and not from the water being cold.

Implementation: p5.js. Compute wet bulb from dry bulb and relative humidity using a standard psychrometric approximation. Model the wick approach to equilibrium as exponential with a time constant that lengthens in still air.
</details>

## What Your Station Will Actually Do

The BME280 reports relative humidity. Everything else is arithmetic you perform afterward, and Chapter 13 will write the code.

The standard method for dew point is the Magnus formula. It looks worse than it is:

\[ \gamma = \frac{a \cdot T}{b + T} + \ln\left(\frac{\text{RH}}{100}\right) \]

\[ T_{dp} = \frac{b \cdot \gamma}{a - \gamma} \]

where \(T\) is air temperature in °C, RH is relative humidity in percent, and the constants are \(a = 17.27\) and \(b = 237.7\). The result is the dew point in °C, accurate to a few tenths of a degree across ordinary weather conditions.

For rough mental work there is a much simpler rule that is good to within a degree or so above 50 percent humidity: **the dew point is about 1 °C below the air temperature for every 5 percent that relative humidity falls below 100.** At 25 °C and 70 percent, that gives \(25 - 6 = 19\) °C, and the exact answer is 19.1 °C.

#### Diagram: Fog Watch — Temperature and Dew Point Convergence

<iframe src="../../sims/fog-watch-convergence/main.html" width="100%" height="592px" scrolling="no"></iframe>

<details markdown="1">
<summary>Fog Watch — Temperature and Dew Point Convergence</summary>
Type: chart
**sim-id:** fog-watch-convergence<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: predict

Learning objective: The learner predicts overnight dew, frost, or fog from the converging gap between air temperature and dew point, and justifies the prediction from cooling rate and sky conditions rather than from relative humidity alone.

Purpose: This is the first genuine forecast a student can make from their own station's two numbers, and it is a satisfying one because the result appears on the grass by morning. It also demonstrates why dew point earns its place alongside relative humidity in the logged data.

Chart type: Dual-line time series with a shaded gap region and a prediction interaction

Data: Overnight traces from 18:00 to 08:00, at 15-minute resolution, for a set of scenarios. Every scenario provides air temperature, dew point, relative humidity, wind speed, and cloud cover.

X-axis: Time of night, 18:00 through 08:00
Y-axis: Temperature in °C, FIXED range across all scenarios so gaps are visually comparable. Both air temperature and dew point are plotted on this shared axis — that shared axis is the entire point of the element.

Additional display: relative humidity is plotted on a secondary axis as a faint third line, so the learner can see it climbing toward 100 percent while the dew point stays flat.

The gap between the two main lines is shaded, and its current width in degrees is displayed as "spread". A caption defines it: "Spread is how many degrees of cooling remain before condensation."

Scenarios:
1. **Classic radiation fog** — clear, calm, spread narrowing from 8 °C to 0 °C by 05:00. Outcome: dense fog and heavy dew.
2. **Dew only** — clear and calm, spread closes to 0 °C at ground level but the air layer above stays unsaturated. Outcome: dew on grass, no fog.
3. **Frost** — same convergence as scenario 2, but the dew point is −3 °C, below freezing. Outcome: frost. The caption must state that vapor deposits directly as ice without passing through liquid.
4. **Windy night** — spread narrows but wind mixes warmer air downward, holding the temperature above the dew point. Outcome: nothing forms. Teaches that convergence alone is insufficient.
5. **Cloudy night** — clouds radiate heat back down, cooling stalls, spread stays at 5 °C. Outcome: nothing forms.
6. **Deceptive high humidity** — relative humidity sits at 85 percent all night but the spread never closes because the dew point is low and the air is cold. Outcome: nothing forms. This is the case that shows relative humidity alone misleads.

Interactive features:
- A time cursor the learner scrubs; the future is hidden beyond the cursor
- At 22:00 the learner must submit a prediction: "Dew", "Frost", "Fog", or "Nothing"
- On submission the rest of the night reveals, with the outcome and an explanation naming which cue was decisive
- Hover any point: tooltip gives air temperature, dew point, spread, relative humidity, wind, and cloud cover at that moment
- Toggle the relative humidity line on and off, so the learner can test whether they could have made the call from RH alone. For scenario 6 they cannot, and the feedback says so.
- A running scoreboard across scenarios

Implementation: Chart.js with two datasets on a shared y-axis, a third on a secondary axis, and a filled area between the first two. Pre-generate scenario data as static JSON so classroom discussion refers to identical numbers.
</details>

!!! warning "Humidity sensors are the most fragile part of your station"
    Of the three quantities the BME280 measures, humidity is the one most likely to give trouble, for reasons worth knowing before it happens:

    - **They drift.** Expect roughly 0.5 percent RH per year, more in dirty or polluted air. Chapter 15 covers detecting this.
    - **Condensation confuses them temporarily.** When the film is genuinely wet, the sensor reads near 100 percent until it dries. This is not a fault, but it can pin your readings for hours after fog.
    - **Contamination is permanent.** Solvents, adhesives, smoke, and volatile organic compounds can poison the polymer irreversibly. Do not mount the sensor near fresh paint, glue, or sealant, and do not use silicone sealant in the enclosure while the sensor is inside it.
    - **They are slow to recover from saturation.** After a long spell at 100 percent, readings may take hours to come back down. A useful field technique, described in the Bosch datasheet, is a periodic gentle bake using the sensor's own heater if available.

## Key Takeaways

- **Water vapor** is invisible. Clouds and steam are liquid droplets, not vapor.
- **Evaporation** absorbs energy and cools what it leaves; **condensation** releases that energy back. **Convection** lifts moist air, driving **cloud formation** and **precipitation**.
- **Absolute humidity** is mass per volume. **Relative humidity** is the ratio of actual to **saturation vapor pressure**, which depends on **partial pressure of vapor** and rises steeply with temperature.
- **Dew point** is the temperature at which condensation begins. It is absolute, it predicts comfort well, and it never exceeds the air temperature.
- Relative humidity changes with temperature alone. Cooling air raises it without adding any water, which is what produces **dew and frost formation** and **fog formation**.
- The **hair hygrometer** (1783) gave the first readable numbers. The **psychrometer** uses evaporative cooling and the **wet bulb temperature**. The **chilled mirror hygrometer** measures dew point directly and serves as a reference standard.
- **Capacitive sensing** through a moisture-absorbing polymer film gives the **capacitive humidity sensor** in the BME280 — fast, small, cheap, and the modern standard since 1973.

## Check Yourself

??? question "Overnight the temperature falls from 20 °C to 8 °C. No water enters or leaves the air. What happens to absolute humidity, relative humidity, and dew point? Click to check."
    **Absolute humidity: unchanged** — the same water is still there. **Dew point: unchanged** — it tracks water content, not temperature. **Relative humidity: rises sharply** — the saturation vapor pressure fell from 23.4 hPa to about 10.7 hPa, so the same water is now a much larger fraction of the maximum. If the dew point was 8 °C, relative humidity reaches 100 percent at dawn and dew forms.

??? question "Why does a heated house feel dry in winter? Click to check."
    Cold outdoor air holds very little water in absolute terms. Bring it inside at 0 °C and 80 percent relative humidity and heat it to 21 °C, and the water content does not change — but the saturation vapor pressure rises from 6.1 to 24.9 hPa, so relative humidity collapses to roughly 20 percent. Nothing removed moisture. Heating the air raised its capacity, and the same water became a much smaller fraction of it.

??? question "Two thermometers read 24 °C dry and 24 °C wet. What is the relative humidity? Click to check."
    One hundred percent. The wet bulb cools by evaporation, and evaporation cannot proceed into saturated air, so no cooling occurs and the depression is zero. The dew point equals the air temperature at 24 °C. Practically, expect fog, dew, or rain.

??? question "Your humidity sensor has read exactly 100 percent for six hours after a foggy night. Is it broken? Click to check."
    Probably not. If the polymer film became genuinely wet during the fog, the sensor correctly reports saturation until the film dries, and recovery from full saturation can take hours. Check whether temperature and dew point converged during the fog — if they did, the reading was real. If the sensor stays pinned at 100 percent for days while the dew point sits well below the air temperature, then suspect contamination or permanent damage.

---

## What Is Next

Three of the seven quantities are now covered, and all three come from the single BME280 chip. The remaining four each need their own sensor, and the next one is the source of the energy that drives everything you have read about so far.

Chapter 9 covers solar radiation — the energy arriving from the Sun. It runs from Herschel's accidental discovery of infrared through the instruments that measure sunlight to the satellites that finally pinned down how much energy actually arrives. It also explains insolation, the number that determines whether the solar panel powering your station will actually keep up.
