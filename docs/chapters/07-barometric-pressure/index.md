---
title: "Barometric Pressure: The Weight of the Atmosphere"
description: Pressure as the weight of the air above, from Aristotle's rejected vacuum through Torricelli and Pascal to the aneroid barometer, the altimeter, and the piezoresistive silicon sensor.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:16:08
version: 0.09
---
# Barometric Pressure: The Weight of the Atmosphere

## Summary

Aristotle said a vacuum could not exist; Torricelli built one in a glass tube in 1643. This chapter follows that argument through Pascal's Puy de Dome experiment, which proved the atmosphere has weight by carrying a barometer up a mountain, to the aneroid barometer that finally made the instrument portable. It reconciles the competing units — inches of mercury, millibars, hectopascals, and pascals — that all describe one atmosphere, then covers sea level pressure, pressure altitude, and the altimeter. It closes with the piezoresistive effect, the silicon mechanism inside the station's own sensor.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Pressure
2. Barometric Pressure
3. Vacuum
4. Piezoresistive Effect
5. Mercury Barometer
6. Millibar
7. Torricelli Experiment
8. Aneroid Barometer
9. Inches Of Mercury
10. Hectopascal
11. Pascal Unit
12. Puy De Dome Experiment
13. Sea Level Pressure
14. One Atmosphere
15. Pressure Altitude
16. Hydrostatic Pressure
17. Altimeter

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)
- [Chapter 5: Time and Place: Recording Where and When](../05-time-and-place/index.md)

---

## There Is a Column of Air on Your Head

Right now, a column of air about 100 kilometers tall is standing on top of you.

It weighs roughly the same as a small car spread across your shoulders — about 10,000 kilograms pressing on every square meter. You do not feel it, because the air inside you pushes out with exactly the same force. Balanced pressure is invisible.

But it is there, and it changes, and those changes are why weather forecasting is possible at all.

Nobody knew this for two thousand years. The story of finding out is the best one in this book, and it starts with somebody being confidently wrong.

## Pressure and the Weight of Fluids

**Pressure** is force spread over an area. It is defined as force divided by the area that force acts on:

\[ P = \frac{F}{A} \]

This is why a drawing pin works. Push a pin with your thumb and the force at your thumb is spread over a wide, comfortable area. The same force at the pin's tip is concentrated into a tiny area, so the pressure there is enormous — enough to push through a wall.

**Hydrostatic pressure** is the pressure produced by the weight of a fluid at rest. Dive to the bottom of a swimming pool and your ears hurt, because the water above you has weight and it presses down. The deeper you go, the more water is stacked above, and the higher the pressure.

Two features of hydrostatic pressure matter for everything that follows:

- **It depends on depth, not on the shape of the container.** The pressure at the bottom of a narrow pipe of water 10 metres tall equals the pressure at the bottom of a wide lake 10 metres deep.
- **It pushes in all directions equally**, not just downward. This is why your ears hurt sideways underwater.

**Barometric pressure** — also called atmospheric pressure — is the hydrostatic pressure produced by the weight of the atmosphere above a point.

Air is a fluid, just a very light one. It has weight, it stacks up, and the stack presses down. The atmosphere is a fluid ocean, and you live at the bottom of it.

Underwater, this effect is dramatic: seawater is so dense that about every 10 metres of depth adds another atmosphere of pressure. Divers feel the change within seconds. Air is roughly 800 times less dense than water, so the same pressure change takes about 8 kilometres of altitude. The mechanism is identical; only the density differs.

## Two Thousand Years of Being Wrong

Aristotle, writing in the 4th century BC, concluded that "nature abhors a vacuum." A **vacuum** is a space containing no matter, and Aristotle argued that such a thing was impossible — any emptiness would immediately be filled, because nothingness could not persist.

He had no instrument to test the idea. He had logic, and the logic seemed sound. The idea stood for nearly two thousand years, and it became the standard explanation for a range of everyday effects. Why does water rise when you pull a piston up a pipe? Because nature abhors a vacuum and the water rushes in to prevent one.

That explanation had a crack in it, and Italian well-diggers found it. Suction pumps could lift water about 10 metres and no further. Beyond that height, no amount of pumping helped. If nature genuinely abhorred a vacuum, why did the abhorrence give out at 10 metres?

Galileo puzzled over this near the end of his life. It was his student who solved it.

## Torricelli's Tube

In 1643 Evangelista Torricelli ran the experiment that broke the theory.

His reasoning was inspired. If the water in a pump is being *pushed up* by the weight of the atmosphere rather than *pulled up* by nature's dislike of emptiness, then the limit should depend on the liquid's density. A denser liquid should be pushed to a lower height. Mercury is about 13.6 times denser than water, so mercury should stop at about 10 metres divided by 13.6 — roughly 760 millimetres. Conveniently, that fits on a bench.

The **Torricelli experiment** is straightforward enough to picture:

1. Fill a glass tube about a metre long, sealed at one end, completely with mercury.
2. Cover the open end, invert the tube, and stand it in a dish of mercury.
3. Uncover the end.

The mercury falls part of the way and then stops, leaving a gap at the sealed top. The column settles at about 760 millimetres above the dish, every time.

Two conclusions follow, and both were revolutionary.

First, the space at the top contains nothing. Nothing could have entered — the tube was sealed and full. That space is a **vacuum**, now called a Torricellian vacuum, and it exists. Aristotle was wrong.

Second, something is holding up 760 mm of mercury. Torricelli's answer: the weight of the atmosphere pressing down on the mercury in the dish, pushing it up the tube. The column stops where its weight balances that push.

He wrote to a colleague, "We live submerged at the bottom of an ocean of air." That sentence is roughly the thesis of this chapter.

The device he had built is a **mercury barometer** — an instrument that measures atmospheric pressure by the height of a mercury column it supports. The name comes from the Greek *baros*, meaning weight, and it is a good name: the instrument literally weighs the atmosphere.

Torricelli also noticed that the column height changed slightly from day to day. He suspected the atmosphere's weight varied with the weather. He was right, and that observation is the seed of weather forecasting.

## The Mountain Test

Torricelli's explanation was clean, but it was not proven. A rival explanation held that some invisible property of the tube or the mercury held the column up.

Blaise Pascal saw the test that would settle it. If the column is held up by the weight of the air above, then carrying the barometer *up a mountain* puts less air overhead — and the column must fall. If some property of the tube holds the mercury, altitude should change nothing.

Pascal was in poor health, so in September 1648 he asked his brother-in-law, Florin Périer, to carry a barometer up the Puy de Dôme, a volcanic peak in central France about 1,465 metres high.

The **Puy de Dome experiment** was conducted with real care, and its design is worth noticing because it is good experimental method by modern standards. Périer left one barometer at the monastery at the base with an observer watching it all day, to confirm the base reading did not drift on its own. He carried a second up the mountain, stopping to measure along the way. He repeated the measurement at several points on the descent.

The result was unambiguous. The column stood about 85 mm lower at the summit than at the base, it fell steadily with height on the way up, and it rose again on the way down. The control barometer at the base did not move.

The atmosphere had been weighed. The measurement took the name **barometric pressure**.

The unit of pressure now bears Pascal's name, which is a fair outcome, though it is worth remembering that Périer did the climbing.

#### Diagram: Torricelli and Puy de Dome Experiment

<iframe src="../../sims/torricelli-puy-de-dome/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Torricelli and Puy de Dome Experiment</summary>
Type: microsim
**sim-id:** torricelli-puy-de-dome<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Understand (L2)
Bloom Verb: explain

Learning objective: The learner explains why a mercury column stands at a particular height, predicts how that height changes with altitude and with the density of the liquid used, and explains how the Puy de Dome result ruled out the competing hypothesis.

Purpose: The central claim of this chapter — that air has weight — is genuinely counter-intuitive and was disbelieved by intelligent people for two millennia. Letting the learner replicate both experiments, including changing the liquid, converts a historical anecdote into a demonstrated mechanism.

Canvas layout:
- Left panel: the Torricelli apparatus — a tube standing in a dish, with a measurable column and a labeled vacuum space at the top
- Right panel: a cross-section of the Puy de Dôme with a draggable barometer that can be moved from base to summit, plus a fixed control barometer at the base
- Bottom: readouts and controls
- Responsive to window resize; panels stack vertically on narrow canvases

Data Visibility Requirements:
  Stage 1: In the Torricelli panel, show the column height in millimetres and the pressure it corresponds to in hPa, updating together
  Stage 2: Show a force-balance annotation: an arrow labeled "weight of the mercury column" pointing down, and an arrow labeled "atmospheric pressure on the dish" pointing up, sized to match so the balance is visible
  Stage 3: In the mountain panel, show altitude, column height at that altitude, and the control barometer's unchanged reading side by side
  Stage 4: Plot the climb as a small graph of column height against altitude, built up point by point as the learner drags, so the linear-ish relationship emerges from their own measurements
  Stage 5: On reaching the summit, display the historical comparison: "Périer measured a drop of about 85 mm. Your simulated drop: N mm."

Interactive controls:
- Liquid selector: mercury (density 13,534 kg/m3), water (1,000), and olive oil (about 920). Selecting water must extend the tube visually and show the column standing over 10 metres, with a caption: "This is why the well-diggers' pumps failed at 10 metres, and why Torricelli chose mercury."
- Altitude drag on the mountain panel, 0 to 1,465 m, with named waypoints at the monastery base, mid-slope, and summit
- "Hypothesis test" toggle that switches between two competing predictions and shows both as ghost lines on the graph:
  - "Air has weight" — predicts the column falls with altitude
  - "Something about the tube holds the mercury" — predicts no change with altitude
  The learner's own measurements are plotted against both, and only one survives.
- Weather variation slider that changes sea level pressure between 980 and 1040 hPa, so the learner sees that the column also moves for reasons unrelated to altitude — the observation that led to forecasting

Instructional Rationale: The objective is Understand/explain, so this is built as a controlled apparatus the learner manipulates and reads, not an animation of a historical scene. The two-hypothesis overlay is the key pedagogical device: an experiment is only meaningful if it could have come out the other way, and showing the losing prediction alongside the winning one is what makes Périer's climb an experiment rather than a demonstration.

Implementation: p5.js. Column height h = P / (rho x g). Use the barometric formula for pressure against altitude. Draw the mountain profile as a polygon; no external assets.
</details>

## Four Units, One Pressure

Because different countries and professions standardized at different moments, atmospheric pressure is reported in at least four units that are all in current use. They all describe the same physical thing.

**Inches of mercury**, written inHg, is the pressure that supports a mercury column one inch high. It comes directly from Torricelli's instrument, and it is still standard in United States weather reports and aviation. Standard sea level pressure is **29.92 inHg**.

The **pascal unit**, symbol Pa, is the SI unit of pressure, defined as one newton per square metre and named for Blaise Pascal in 1971. It is a very small unit — standard atmospheric pressure is 101,325 Pa — which makes it awkward for weather use.

The **millibar**, symbol mbar or mb, is one thousandth of a bar, where the bar was defined in the early twentieth century as a convenient meteorological unit close to average sea level pressure. Standard sea level pressure is **1013.25 mbar**.

The **hectopascal**, symbol hPa, is 100 pascals. And here is the tidy part: **one hectopascal equals one millibar exactly.** When the world moved to SI units, weather services switched from millibars to hectopascals without changing a single number on a single chart. Standard sea level pressure is **1013.25 hPa**.

**One atmosphere**, symbol atm, is a unit defined as the standard average pressure at sea level. It is used for comparison rather than for reporting weather.

| Unit | Symbol | Standard sea level value | Where used |
|------|--------|--------------------------|------------|
| Hectopascal | hPa | 1013.25 | Most of the world; the SI-compatible standard |
| Millibar | mbar | 1013.25 | Older charts; numerically identical to hPa |
| Inches of mercury | inHg | 29.92 | US weather reports and aviation |
| Pascal | Pa | 101,325 | Physics and engineering |
| Atmosphere | atm | 1 | Comparisons, diving, chemistry |
| Millimetres of mercury | mmHg | 760 | Medicine, some laboratories |

Your BME280 reports pressure in pascals. You will divide by 100 to get hectopascals, which is what you should store and display. Chapter 2's unit-cancellation method handles the rest:

\[ 29.92\ \text{inHg} \times \frac{33.8639\ \text{hPa}}{1\ \text{inHg}} = 1013.2\ \text{hPa} \]

!!! tip "Know the normal range by heart"
    Sea level pressure almost always falls between **980 and 1040 hPa**. Learn that range and you have a free sanity check on your own station. A reading of 1013 is unremarkable. A reading of 950 means a serious storm, or a sensor problem, or that you are on a mountain. A reading of 500 means your code has a bug — most likely you forgot to divide the sensor's pascals by 100.

## Correcting for Altitude

Chapter 5 said that elevation is required, not optional. Here is why in full.

Pressure falls as you climb, because there is less air above you. Near sea level the rate is roughly **12 hPa per 100 metres**, though it decreases with height because the air itself thins.

That rate is large compared to weather. A strong storm might drop sea level pressure by 30 hPa. A 250-metre difference in station elevation produces the same 30 hPa. So without correcting for altitude, geography completely swamps meteorology, and no two stations at different heights can be compared at all.

**Sea level pressure** is the pressure a station would read if it were at sea level, calculated from its actual reading and its known elevation. Every pressure value in every weather report is a sea level pressure. It is a computed value, not a measured one, and almost no station actually sits at sea level.

The simple approximation used for small elevations:

\[ P_{\text{sea level}} \approx P_{\text{station}} + \left(\frac{h}{8.3}\right) \]

where \(h\) is the station elevation in metres and pressure is in hPa. For a station at 152 m reading 995 hPa, the sea level pressure is about \(995 + 18.3 = 1013\) hPa — a perfectly ordinary day that looked like a storm before correction.

Now run the same physics backwards. If pressure depends on height in a known way, then measuring pressure tells you your height.

**Pressure altitude** is altitude calculated from a barometric pressure reading, assuming a standard atmosphere. An **altimeter** is an instrument that does exactly this — a barometer with its scale marked in metres or feet instead of hectopascals.

Aircraft altimeters are barometers. This has a consequence that pilots handle constantly: since real pressure differs from the standard atmosphere, an altimeter must be corrected. Before landing, pilots set the current local sea level pressure into the instrument. An uncorrected altimeter flying from high pressure into low pressure reads *higher* than the aircraft actually is, which is the dangerous direction. The aviation memory aid is blunt: "High to low, look out below."

#### Diagram: Pressure and Altitude Calculator

<iframe src="../../sims/pressure-altitude-calculator/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Pressure and Altitude Calculator</summary>
Type: microsim
**sim-id:** pressure-altitude-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Apply (L3)
Bloom Verb: solve

Learning objective: The learner solves for sea level pressure given a station reading and elevation, converts between all common pressure units, and evaluates whether an observed pressure difference between two stations is caused by weather or by elevation.

Purpose: The elevation correction is the single most consequential piece of arithmetic in this chapter, and getting it wrong makes a student's pressure data incomparable to anyone else's. A calculator that shows the correction as a visible adjustment on a column, rather than as a formula result, makes the size of the effect impossible to underestimate.

Canvas layout:
- Left: a vertical altitude column from sea level to 3,000 m, with a draggable station marker and a pressure scale alongside
- Center: the worked correction arithmetic, step by step
- Right or below (responsive): a unit conversion panel showing the current pressure in hPa, mbar, inHg, Pa, and atm simultaneously
- Bottom: controls and a two-station comparison mode
- Responsive to window resize

Data Visibility Requirements:
  Stage 1: Show the raw station reading with its elevation, e.g. "995 hPa measured at 152 m"
  Stage 2: Show the correction term computed, e.g. "152 / 8.3 = 18.3 hPa"
  Stage 3: Show the corrected sea level pressure, e.g. "995 + 18.3 = 1013.3 hPa"
  Stage 4: Show the same value in all five units at once
  Stage 5: Show a verdict against the normal range: "1013.3 hPa is within the normal 980 to 1040 hPa band. Ordinary conditions."

Two-station comparison mode: the learner sets an elevation and a raw reading for each of two stations. The panel then separates the total difference into the part explained by elevation and the part that is genuine weather, with a written verdict such as: "Station B reads 28 hPa lower. Elevation accounts for 36 hPa. After correction, Station B is actually 8 hPa HIGHER than Station A. The apparent storm was geography."

Interactive controls:
- Drag the station marker along the altitude column; the raw reading and correction update live
- Type a raw reading directly, or a sea level pressure to work backwards
- Weather slider: sets true sea level pressure from 950 to 1050 hPa
- Preset locations with real elevations: Death Valley (−86 m), a coastal town (5 m), Denver (1,609 m), Mexico City (2,240 m), and a user-entered value for the learner's own station
- Altimeter mode: switches the column's scale to read altitude from pressure, and includes a "pilot's setting" control. Flying from a high-pressure region into a low-pressure region without resetting must display the aircraft's true altitude below its indicated altitude, with the caption "High to low, look out below."

Instructional Rationale: The objective is Apply/solve, so parameter entry with a fully visible worked calculation is correct. The two-station comparison mode exists because the real skill is not performing the arithmetic but knowing when it is needed — a student comparing their station to a neighbour's must decompose a difference into geography and weather, and that decomposition is the actual learning.

Implementation: p5.js. Use the simple linear approximation for the primary display since that is what the chapter teaches, and offer the full barometric formula as an optional toggle showing the small difference between them at high altitude.
</details>

## The Instrument Gets Smaller

Torricelli's barometer worked well and was hopelessly impractical. It stood nearly a metre tall, had to be perfectly vertical, could not be moved without spilling, and contained a large quantity of a liquid metal now known to be seriously toxic. It could not go to sea, which is exactly where it was most needed.

Lucien Vidi built the first practical **aneroid barometer** in 1844. The word aneroid means "without liquid," and that is the whole invention: a sealed metal capsule with most of the air pumped out, made with flexible corrugated walls.

When atmospheric pressure rises, the capsule is squeezed slightly and flexes inward. When pressure falls, it expands. The movement is tiny — a fraction of a millimetre — so a train of levers and gears amplifies it enough to move a needle across a dial.

The consequences were immediate. A barometer could now be carried, taken aboard ship, mounted on a wall, and eventually strapped to a wrist. Barometers spread everywhere, and weather observation stopped being a laboratory activity.

That spread made something new possible. Admiral Robert FitzRoy — the captain who had taken Charles Darwin around the world aboard HMS *Beagle* — became convinced that a network of barometers plus the telegraph could warn ships of coming storms. He established the organization that became the UK Met Office and issued the first public storm warnings in the 1860s. He coined the word "forecast," and he was widely criticized for the presumption of predicting weather at all.

The physical principle in your station is the third generation of this idea, and Chapter 4 already introduced its mechanism.

The **piezoresistive effect** is the change in electrical resistance of a material when it is mechanically deformed. Squeeze or stretch certain semiconductors and their resistance changes measurably.

Inside the BME280 is a silicon diaphragm a few micrometres thick, with a sealed reference cavity beneath it. Atmospheric pressure pushes on the diaphragm and flexes it by a microscopic amount. Piezoresistive elements formed into the silicon change resistance as it flexes, and the chip's built-in analog-to-digital converter turns that change into a number.

It is the aneroid barometer's flexing capsule, shrunk onto a chip and read electrically instead of mechanically.

| | Mercury barometer | Aneroid barometer | MEMS piezoresistive |
|---|---|---|---|
| Invented | 1643 | 1844 | 1960s–1980s |
| Size | About 1 m tall | Palm-sized | A few millimetres |
| Portable | No | Yes | Yes |
| Output | Column height, read by eye | Needle on a dial | A digital number |
| Toxic | Yes | No | No |
| Typical accuracy | Very high | Moderate | ±1 hPa |
| Cost today | High, and restricted | Low | Very low |

!!! note "Why pressure is the easiest measurement in this book"
    Pressure has no radiation-shield problem, no exposure standard, and essentially no response-time issue — air pressure equalizes almost instantly, and it is the same inside a sealed enclosure as outside as long as there is a small vent. Of the seven quantities this station measures, pressure is the one most likely to be right on the first try. Chapter 6's temperature siting problem has no equivalent here.

## What Pressure Tells You About Tomorrow

Torricelli's day-to-day variations were not noise. They are the atmosphere reorganizing itself, and they carry information.

The broad pattern is reliable enough to be genuinely useful:

- **High pressure**, generally above about 1020 hPa, means air is sinking. Sinking air warms and dries, which prevents cloud formation. Expect fair, settled weather.
- **Low pressure**, generally below about 1000 hPa, means air is rising. Rising air cools and its moisture condenses. Expect clouds, wind, and precipitation.

But the single most useful thing is not the value at all — it is the **change**. A barometer that has fallen 5 hPa in three hours is telling you something is arriving, and it tells you before there is anything to see in the sky. This is why traditional barometers have a second, manually-set needle: you align it with the current reading, and hours later the gap between the two needles shows you which way and how fast pressure has moved.

Your station will do this far better than any dial, because it records every reading. Chapter 15 covers the calculation, called pressure tendency, and it is the point where your logged data starts to predict rather than merely describe.

#### Diagram: Falling Barometer Forecast Trainer

<iframe src="../../sims/falling-barometer-forecast/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Falling Barometer Forecast Trainer</summary>
Type: microsim
**sim-id:** falling-barometer-forecast<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: predict

Learning objective: The learner predicts approaching weather from a pressure trace, judging the rate of change rather than the absolute value, and justifies the prediction from the physical behaviour of rising and sinking air.

Purpose: Students reliably learn "low pressure means bad weather" and stop there, which produces wrong calls. The forecasting signal is the derivative, not the value, and the only way to teach that is to present traces where value and trend disagree and let the learner get it wrong safely.

Canvas layout:
- Upper two-thirds: a scrolling pressure trace over 24 hours, with the current time as a moving cursor and future data hidden
- Overlay: a traditional barometer dial with two needles — a live needle and a draggable "set" needle, so the historical instrument is connected to the modern trace
- Lower area: prediction buttons and a scoring panel
- Right or below (responsive): a readout of current pressure, 3-hour change, and rate in hPa per hour
- Responsive to window resize

Data Visibility Requirements:
  Stage 1: Show the current pressure in hPa and its position against the 980 to 1040 normal band
  Stage 2: Show the pressure 3 hours ago and the difference, labeled "pressure tendency"
  Stage 3: Show the rate in hPa per hour with a plain-language category: steady, slowly falling, rapidly falling, slowly rising, rapidly rising
  Stage 4: After the learner predicts, reveal the next 12 hours of the trace and the actual weather that followed
  Stage 5: Show a running scoreboard and a breakdown of which cue the learner relied on

Scenario library — each is a 36-hour pressure trace with a known outcome. The set must include cases where absolute value and trend disagree:
1. **Steady high, 1028 hPa, flat** — fair and settled. Easy case.
2. **Steady low, 995 hPa, flat for 18 hours** — overcast but no storm. Teaches that a low value alone is not a warning.
3. **High value, falling fast** — 1025 hPa but dropping 4 hPa in 3 hours. Storm arriving within hours. This is the critical case: the value still looks reassuring.
4. **Low value, rising steadily** — 990 hPa and climbing. The storm has passed; clearing follows.
5. **Rapid deep fall** — more than 6 hPa in 3 hours from any starting value. Severe weather. Historically the signature FitzRoy's storm warnings were built on.
6. **Diurnal wobble** — a small twice-daily oscillation of about 3 hPa with no weather change, most pronounced in the tropics. Teaches the learner not to over-read small regular variation.

Interaction:
- The learner scrubs or plays the trace up to "now"
- Prediction buttons: "Fair, next 12 h", "Clouding over", "Rain likely", "Storm — take it seriously", "Clearing"
- On submitting, the future reveals and feedback explains which cue mattered: for scenario 3, "You predicted fair because 1025 hPa is a high value. The value was misleading. The 4 hPa fall in 3 hours was the signal."
- "Set" needle can be dragged to the current reading, then left; after simulated hours pass, the gap between the two needles shows the tendency. A caption explains: "This is what the second needle on an old barometer was for."

Instructional Rationale: The objective is Evaluate/predict, which requires committing to a judgment before seeing the outcome and then being held to it. Hiding the future until a prediction is submitted is what makes this evaluation rather than observation. Including scenarios where value and trend point in opposite directions is the specific design decision that breaks the "low equals bad" heuristic.

Implementation: p5.js. Store scenarios as arrays of {hour, pressure} plus an outcome label and a feedback string. Compute tendency as the difference over the trailing 3 hours, matching standard meteorological practice.
</details>

## Key Takeaways

- **Pressure** is force divided by area. **Hydrostatic pressure** comes from the weight of a fluid and depends on depth, not container shape.
- **Barometric pressure** is the weight of the atmosphere above a point. Aristotle denied that a **vacuum** could exist, and that belief stood for two thousand years.
- The **Torricelli experiment** of 1643 created a vacuum and showed that the atmosphere supports a 760 mm **mercury barometer** column.
- The **Puy de Dome experiment** of 1648 proved air has weight by carrying a barometer up a mountain, with a control barometer left at the base.
- **Hectopascal**, **millibar**, **inches of mercury**, **pascal unit**, and **one atmosphere** all describe the same pressure. 1 hPa = 1 mbar exactly; standard sea level is 1013.25 hPa or 29.92 inHg.
- Pressure falls about 12 hPa per 100 m. **Sea level pressure** is a computed correction using station elevation, without which stations cannot be compared. Run backwards, the same physics gives **pressure altitude** and the **altimeter**.
- The **aneroid barometer** of 1844 made the instrument portable and enabled the first storm warnings. The **piezoresistive effect** shrinks the same flexing-capsule idea onto a silicon chip.

## Check Yourself

??? question "Why did Torricelli use mercury instead of water? Click to check."
    Because a water barometer would need to be over 10 metres tall. The atmosphere supports a column whose weight balances it, and since mercury is about 13.6 times denser than water, the mercury column is about 13.6 times shorter — around 760 mm instead of 10.3 m. This also explains the well-diggers' problem that started the whole inquiry: suction pumps failed above 10 metres because that is the maximum height of water the atmosphere can support.

??? question "Your station at 300 m reads 977 hPa. Is a storm coming? Click to check."
    Probably not. Correct to sea level first: \(977 + 300/8.3 = 977 + 36.1 = 1013.1\) hPa. That is almost exactly standard pressure — an entirely ordinary day. The raw 977 looked alarming only because 300 metres of elevation removes about 36 hPa before the weather does anything at all. This is why elevation is one of the things the station records.

??? question "Why does a pilot reset the altimeter before landing? Click to check."
    An altimeter is a barometer that converts pressure to height assuming a standard atmosphere. Real sea level pressure differs from standard, so the conversion is off by whatever that difference is. Setting the local sea level pressure removes the error. The dangerous case is flying from high pressure into low pressure without resetting: the altimeter then reads higher than the aircraft actually is, so the pilot believes they have clearance they do not have. Hence "high to low, look out below."

??? question "Your code reports pressure as 101325. What went wrong, and how do you know? Click to check."
    Nothing went wrong with the sensor — that is a correct reading in pascals, which is what the BME280 natively reports. The problem is the unit. Divide by 100 to get 1013.25 hPa, which is the unit weather data is reported in. You can spot this instantly because 101325 is nowhere near the 980 to 1040 range that sea level pressure always falls in, and it is off by exactly a factor of 100 — the fingerprint of a missing prefix conversion.

---

## What Is Next

Pressure and temperature are two of the three quantities the BME280 measures. The third is the one you cannot see at all.

Chapter 8 covers humidity — the water vapor suspended invisibly in the air. It builds the water cycle first, then separates three ideas that get used interchangeably and should not be: absolute humidity, relative humidity, and dew point. It explains why warm air can hold more water than cold air, why that means fog can form overnight without any new water arriving, and why the dew point predicts how a day will actually feel far better than the percentage in the forecast does.
