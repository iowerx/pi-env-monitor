---
title: "Solar Radiation: The Energy That Drives the Weather"
description: Irradiance and the solar constant, the pyrheliometer and pyranometer, the photovoltaic path from Herschel's infrared to the solar cell, the UV index, and the daily and seasonal cycles the Sun drives.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:25:12
version: 0.09
---
# Solar Radiation: The Energy That Drives the Weather

## Summary

The Sun is the engine behind nearly everything else this station measures. This chapter covers irradiance in watts per square meter, the solar constant that satellites finally pinned down, and the instruments that measure sunlight — the pyrheliometer, pyranometer, bolometer, and thermopile — alongside the photovoltaic path from the photoelectric effect to the solar cell. It introduces the UV index, solar zenith angle, and albedo, and closes with the diurnal and seasonal cycles that appear in every dataset the station produces.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Solar Radiation
2. Ultraviolet Radiation
3. Visible Light
4. Diurnal Cycle
5. Seasonal Variation
6. UV Index
7. Watts Per Square Meter
8. Photodiode
9. Photovoltaic Effect
10. Irradiance
11. Solar Cell
12. Solar Zenith Angle
13. Albedo
14. Solar Constant
15. Pyrheliometer
16. Pyranometer
17. Bolometer
18. Thermopile

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)
- [Chapter 5: Time and Place: Recording Where and When](../05-time-and-place/index.md)
- [Chapter 6: Temperature: From the Thermoscope to the Silicon Chip](../06-temperature/index.md)

---

## Everything Else Runs on This

Turn off the Sun and here is what stops.

Temperature stops changing through the day. Evaporation stops, so the water cycle stops, so clouds and rain stop. The ground stops warming unevenly, so air stops rising, so pressure differences stop forming, so wind stops. Within a few weeks the atmosphere would be a still, uniformly frozen shell.

Every quantity in Chapters 6 through 10 is downstream of one number: how much solar energy is arriving.

**Solar radiation** is the electromagnetic energy emitted by the Sun and received at the Earth. It arrives as the spectrum introduced in Chapter 4 — mostly visible light, with substantial infrared and a small but consequential ultraviolet fraction.

Roughly, the sunlight reaching the top of the atmosphere breaks down like this:

- About **50 percent infrared** — invisible, felt as warmth, and the main heating component
- About **43 percent visible light** — the narrow band your eyes evolved to detect
- About **7 percent ultraviolet** — invisible, energetic, and responsible for sunburn

**Visible light** is the portion of the electromagnetic spectrum that human eyes detect, roughly 400 to 700 nanometres, running from violet at the short end to red at the long end. It is worth noticing that the Sun's output peaks almost exactly in this band. That is not a coincidence in the direction people assume: eyes evolved to use the light that was abundantly available.

**Ultraviolet radiation** is radiation with wavelengths shorter than visible violet, from about 10 to 400 nanometres. It carries more energy per photon than visible light, which is why it can break chemical bonds — damaging DNA, degrading plastics, and fading paint. UV is subdivided:

| Band | Wavelength | What happens to it | Effect on you |
|------|-----------|--------------------|---------------|
| UVA | 315–400 nm | Mostly reaches the ground | Skin ageing; some cancer risk |
| UVB | 280–315 nm | Mostly absorbed by ozone; some reaches ground | Sunburn; vitamin D; main cancer risk |
| UVC | 100–280 nm | Completely absorbed by the atmosphere | None at ground level — it never arrives |

## Herschel's Accident

Chapter 6 mentioned this discovery in passing. Here it deserves the full telling, because it is where the measurement of solar energy begins.

In 1800 William Herschel — an astronomer better known for discovering Uranus — set out to find which color of sunlight carried the most heat. His method was simple: use a prism to spread sunlight into a spectrum across a table, and put a thermometer in each color band.

He found that temperature rose steadily as he moved from violet toward red. Then he placed a thermometer just beyond the red edge, in the dark region where no visible light fell, expecting a control reading at room temperature.

It read higher than any of the visible colors.

There was something past red, invisible, carrying more energy than the light he could see. Herschel called it "calorific rays." We call it infrared, and the discovery did two things at once: it revealed that the electromagnetic spectrum extends beyond human vision, and it established that **a thermometer can measure light**. That second point is the operating principle of most solar instruments even today.

## Irradiance and the Solar Constant

**Irradiance** is the power of radiation arriving per unit area of surface. It is the fundamental quantity this chapter measures.

Its unit is **watts per square meter**, written W/m². Recall from Chapter 2 that a watt is a joule per second, so irradiance is energy arriving per second per square metre — a rate, not a total.

Some values worth carrying around:

| Situation | Approximate irradiance |
|-----------|------------------------|
| Top of the atmosphere, facing the Sun | 1361 W/m² |
| Clear noon, mid-latitude summer, horizontal surface | 900–1000 W/m² |
| Clear noon, mid-latitude winter | 300–500 W/m² |
| Overcast day | 100–200 W/m² |
| Heavy overcast, winter | 20–50 W/m² |
| Full moon | 0.003 W/m² |
| Bright indoor office lighting | 3–5 W/m² |

That indoor row is worth pausing on. Human vision adapts so effectively that a well-lit office feels comparably bright to an overcast day — while receiving perhaps one fiftieth of the energy. Your eyes are not instruments, which is the point Chapter 1 opened with.

The **solar constant** is the irradiance from the Sun measured at the top of Earth's atmosphere, on a surface perpendicular to the Sun's rays, at Earth's average distance. Its accepted value is about **1361 W/m²**.

Pinning that number down took nearly 150 years.

Claude Pouillet built the first **pyrheliometer** in 1838 — an instrument that measures direct beam solar radiation, from the Sun's disc alone, excluding light scattered by the sky. His design used a water-filled blackened container whose temperature rise measured the energy absorbed. He estimated the solar constant at about 1228 W/m², impressively close given that he was working through the whole atmosphere.

Samuel Langley invented the **bolometer** in 1880 — an instrument that measures radiant energy through the change in electrical resistance of a blackened absorber as it warms. It was extraordinarily sensitive for its era, capable of detecting temperature changes of a ten-thousandth of a degree, and it let him map the solar spectrum in fine detail. Langley hauled his instruments up Mount Whitney to get above as much atmosphere as possible.

But no ground measurement could ever be definitive, because the atmosphere always absorbs and scatters an unknown, variable share. Every ground-based estimate required correcting for something nobody could measure directly.

Satellites ended the argument. Instruments beginning with Nimbus-7 in 1978, and continued through the ACRIM and TSIS series, measured total solar irradiance from orbit with no atmosphere in the way. They settled the value near 1361 W/m².

They also showed something the name "solar constant" does not admit: **it is not constant.** Total solar irradiance varies by roughly 0.1 percent over the eleven-year sunspot cycle, and by about 6.9 percent over the year — not because the Sun changes, but because Earth's orbit is slightly elliptical and our distance from the Sun varies. Earth is closest to the Sun in early January, which surprises people in the northern hemisphere.

#### Diagram: Solar Constant to Ground — Where the Energy Goes

<iframe src="../../sims/solar-energy-budget/main.html" width="100%" height="632px" scrolling="no"></iframe>

<details markdown="1">
<summary>Solar Constant to Ground — Where the Energy Goes</summary>
Type: microsim
**sim-id:** solar-energy-budget<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: attribute

Learning objective: The learner attributes the difference between the solar constant and the irradiance measured at the ground to specific causes — solar zenith angle, atmospheric absorption, scattering, cloud, and surface albedo — and quantifies each contribution.

Purpose: Students see 1361 W/m² and then measure 700 W/m² at their station and conclude their sensor is broken. Decomposing the loss into named, quantified stages shows that the gap is expected physics, and it makes each of the chapter's later concepts a component of one accounting.

Canvas layout:
- Main area: a vertical cross-section from the top of the atmosphere down to the ground, with an incoming beam whose width represents its power
- The beam visibly narrows at each loss stage, with each loss branching off as a labeled side arrow
- Right or below (responsive): a running energy budget table showing W/m² remaining after each stage
- Bottom: controls
- Responsive to window resize

Data Visibility Requirements:
  Stage 1: "Top of atmosphere, perpendicular: 1361 W/m²"
  Stage 2: "After solar zenith angle correction: 1361 x cos(z) = N W/m²" — show the angle and the cosine explicitly
  Stage 3: "After atmospheric absorption (ozone, water vapor, CO2): N W/m²" with the absorbing gas named
  Stage 4: "After scattering (this is why the sky is blue): N W/m²"
  Stage 5: "After cloud: N W/m²"
  Stage 6: "Arriving at the ground: N W/m²" and, separately, "Reflected by the surface (albedo): N W/m²" and "Absorbed by the surface: N W/m²"

Interactive controls:
- Solar zenith angle slider, 0 to 90 degrees, with a linked time-of-day and latitude readout so the learner can reach a given angle either way
- Cloud cover slider, 0 to 100 percent, with cloud type selector (thin cirrus, broken cumulus, thick overcast)
- Atmospheric path length indicator, called air mass, computed from the zenith angle and displayed as a multiplier
- Surface selector for the albedo stage: fresh snow (0.85), sand (0.40), grass (0.25), forest (0.15), asphalt (0.10), open water at low sun angle (0.60)
- A "Match my station" mode where the learner enters an irradiance they measured, and the sim solves for the combination of cloud and angle that would explain it

Required teaching moment: setting zenith angle to 60 degrees must show the beam power drop to exactly half, with the caption "cos(60 degrees) = 0.5. The same beam is spread over twice the ground area. This is why winter is cold and why sunrise is dim — not distance from the Sun."

Instructional Rationale: The objective is Analyze/attribute, which requires decomposing an observed value into contributing causes. A sequential budget where each stage subtracts a named, quantified amount makes the decomposition the literal structure of the interface. The "Match my station" inverse mode is included because attributing a real measurement to causes is the skill, not reciting the stages.

Implementation: p5.js. Beam width proportional to remaining power. Air mass approximated as 1/cos(z) with a correction near the horizon. Keep all coefficients as named, editable data so the budget is auditable.
</details>

## Angle Is Everything

The single most important control on how much solar energy reaches a place is not distance from the Sun. It is angle.

The **solar zenith angle** is the angle between the Sun and the point directly overhead. It is 0° when the Sun is exactly overhead, 90° at sunrise and sunset, and greater than 90° at night.

Irradiance on a horizontal surface follows the cosine of that angle:

\[ E_{\text{horizontal}} = E_{\text{beam}} \times \cos(z) \]

The reason is geometric, and it is worth picturing rather than memorizing. A beam of sunlight has a fixed width. Strike a surface head-on and that beam covers a small patch. Strike it at a slant and the same beam is smeared across a much larger patch — the same energy divided among more square metres, so fewer watts per square metre.

| Zenith angle | cos(z) | Fraction of maximum |
|--------------|--------|---------------------|
| 0° (overhead) | 1.00 | 100% |
| 30° | 0.87 | 87% |
| 45° | 0.71 | 71% |
| 60° | 0.50 | 50% |
| 75° | 0.26 | 26% |
| 85° | 0.09 | 9% |

This cosine is the mechanism behind both cycles your station will record.

The **diurnal cycle** is the daily pattern of variation driven by the Earth's rotation. As the Earth turns, the solar zenith angle at your station sweeps from 90° at sunrise, down to a minimum at solar noon, and back to 90° at sunset. Irradiance follows a smooth arch, and everything downstream follows behind it.

Not immediately, though. Air temperature peaks two to three hours *after* peak irradiance, because the ground has to warm first and then warm the air above it. That lag will be visible in your own data, and it is one of the more satisfying things to find in a first week of logging.

**Seasonal variation** is the annual pattern driven by the tilt of Earth's rotational axis, about 23.5° from the plane of its orbit. That tilt changes the Sun's maximum height in the sky across the year, which changes the noon zenith angle, which changes irradiance by the cosine rule. It also changes day length, so the effect compounds: summer days are both longer and more intense.

!!! warning "Seasons are not about distance"
    A persistent misconception holds that summer happens when Earth is closer to the Sun. Earth is actually *closest* in early January, during northern winter. Seasons are caused by axial tilt changing the angle and the day length, not by orbital distance. The clinching evidence is that the northern and southern hemispheres have opposite seasons at the same moment — impossible if distance were the cause, since both hemispheres are the same distance away.

Not all light arriving at your sensor comes straight from the Sun. Two components matter:

- **Direct beam** — light travelling straight from the Sun's disc
- **Diffuse** — light scattered by air molecules, cloud, and dust, arriving from all directions of the sky

On a clear day, diffuse is perhaps 10 to 20 percent of the total. On a fully overcast day it is 100 percent — the Sun's disc is not visible at all, yet a meaningful amount of energy still arrives. Their sum is called global horizontal irradiance, and it is what a station sensor and a flat solar panel both respond to.

**Albedo** is the fraction of incoming solar radiation reflected by a surface, from 0 for a perfect absorber to 1 for a perfect reflector.

| Surface | Albedo |
|---------|--------|
| Fresh snow | 0.80–0.90 |
| Desert sand | 0.40 |
| Grass | 0.25 |
| Forest | 0.15 |
| Asphalt | 0.05–0.10 |
| Open ocean, sun high | 0.06 |

Albedo is why dark clothing feels hotter, why cities with dark roofs and asphalt run warmer than the countryside, and why snow-covered ground stays cold — it reflects most of the energy that could have melted it, a self-reinforcing loop. Chapters 16 and 17 both return to this.

## Measuring Sunlight

Two families of instrument dominate, and they differ in what physics they use.

### Thermal Instruments

The thermal family descends directly from Herschel: absorb the light, measure the warming.

A **thermopile** is a set of thermocouples connected in series. Chapter 6 introduced the thermoelectric effect — a voltage appearing across a junction of two metals when one end is hotter than the other. A single thermocouple produces microvolts. Wire many in series and the voltages add, producing a signal large enough to measure easily.

A **pyranometer** measures total solar irradiance arriving on a horizontal surface from the entire sky hemisphere — direct beam plus diffuse together. The classic design places a blackened thermopile under a glass dome. Sunlight warms the black absorber, the thermopile measures the temperature difference between the absorber and the instrument body, and that difference is proportional to irradiance. The Moll-Gorczynski design of the 1920s, commercialized by Kipp & Zonen, established the pattern still used today.

A **pyrheliometer**, by contrast, measures direct beam radiation only. It looks through a narrow tube aimed at the Sun's disc and must be mounted on a tracker that follows the Sun across the sky.

Both are excellent and both are expensive — a research-grade pyranometer costs more than everything else in this book combined. The reasons are worth knowing: a thermopile responds almost equally to all wavelengths, which is exactly what "total irradiance" requires, and the calibration chain from Chapter 2 for these instruments is long and carefully maintained.

### Photoelectric Instruments

The second family uses the effect Chapter 4 introduced.

The **photovoltaic effect** is the generation of a voltage or current in a material when it absorbs light. Edmond Becquerel discovered it in 1839, aged 19, working in his father's laboratory. Charles Fritts built the first selenium photocell in 1883 at about 1 percent efficiency. Bell Laboratories produced the first practical silicon solar cell in 1954 at about 6 percent.

A **photodiode** is a semiconductor device that produces a current proportional to the light falling on it. It is fast, small, and inexpensive.

A **solar cell** is the same physics scaled up for power generation rather than measurement. Modern commercial silicon panels convert roughly 20 percent of incoming solar energy to electricity. Chapter 16 sizes one for your station.

Photodiode-based irradiance sensors are what a school station can actually afford, and it is worth being clear about the trade you are making:

| | Thermopile pyranometer | Photodiode sensor |
|---|---|---|
| Physics | Absorbs and warms | Photons free electrons |
| Spectral response | Nearly flat across all wavelengths | Peaks in one band; poor in infrared |
| Accuracy | ±2% or better | ±5% or worse |
| Response time | Seconds | Microseconds |
| Cost | Hundreds to thousands | A few dollars |
| Affected by spectrum changes | Barely | Yes — readings shift under cloud or low sun |

That last row is the honest limitation. A photodiode responds strongly to visible light and weakly to infrared. Since the spectrum of arriving sunlight shifts under cloud and at low sun angles, a photodiode sensor calibrated on a clear day will read somewhat wrong on an overcast one. It is still genuinely useful — it captures the shape of the day, the timing of cloud, and relative changes accurately — but treat its absolute values with appropriate caution.

!!! info "Your solar sensor is not chosen yet"
    The parts list in [Components Used](../../components.md) still lists the solar sensor as TBD. This chapter is written to the physics rather than to a specific part, so it stands whichever sensor is chosen. When a part is selected, the datasheet questions from Chapter 4 apply directly: what is its measurement range in W/m², what is its spectral response, and does it report analog or digital? If it is analog, remember from Chapter 4 that the Raspberry Pi has no built-in ADC and one will have to be added.

    A common, cheap, and reasonable choice for student stations is a calibrated photodiode module reporting over I2C, which avoids the ADC problem entirely.

#### Diagram: Solar Irradiance Through the Day

<iframe src="../../sims/solar-irradiance-day-explorer/main.html" width="100%" height="608px" scrolling="no"></iframe>

<details markdown="1">
<summary>Solar Irradiance Through the Day</summary>
Type: chart
**sim-id:** solar-irradiance-day-explorer<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: compare

Learning objective: The learner compares irradiance curves across seasons, latitudes, and cloud conditions, and explains the lag between peak irradiance and peak air temperature.

Purpose: The diurnal and seasonal cycles are the two patterns that dominate every dataset this station will produce, and recognizing them is prerequisite to spotting anything anomalous in Chapter 15. Plotting irradiance and air temperature on the same time axis makes the thermal lag — which students find genuinely surprising — visible as a horizontal offset.

Chart type: Multi-series line chart with a secondary axis and a comparison overlay

X-axis: Time of day, 00:00 to 24:00
Primary y-axis: Irradiance in W/m², fixed range 0 to 1100 across all scenarios so curves are directly comparable
Secondary y-axis: Air temperature in °C

Series:
1. Clear-sky theoretical irradiance for the selected date and latitude, drawn as a smooth dashed envelope
2. Actual irradiance including cloud, drawn solid
3. Air temperature, on the secondary axis
4. Optionally, a second location or date overlaid for direct comparison

Selectable conditions:
- Latitude: 0°, 23.5°, 45°, 60°, 66.5° (Arctic Circle)
- Date: equinox, June solstice, December solstice, plus a free date picker
- Sky: clear, scattered cumulus (producing a spiky trace as clouds pass), overcast

Required teaching moments, each with an on-chart annotation:
- **Thermal lag**: mark peak irradiance at solar noon and peak temperature 2 to 3 hours later, with an annotated arrow between them reading "The ground must warm first, then warm the air."
- **Cloud spikes**: in scattered cumulus, the trace must show brief irradiance values ABOVE the clear-sky envelope, with the annotation "Cloud edges can reflect extra light onto the sensor. Brief over-readings are real, not sensor faults." This prevents students from later flagging genuine data as errors in Chapter 15.
- **Arctic Circle, December solstice**: a flat line at or near zero, annotated "The Sun does not rise. Polar night."
- **Arctic Circle, June solstice**: a curve that never reaches zero, annotated "The Sun does not set, but it stays low, so peak irradiance is modest."
- **Equator versus 60° latitude at the same date**: side-by-side comparison showing that the equatorial curve is taller and the high-latitude curve is broader in summer.

Interactive features:
- Hover any point: tooltip gives time, irradiance, solar zenith angle, and air temperature
- Click a point: infobox shows the cosine calculation for that moment
- "Add comparison" button overlays a second configuration in a contrasting color, with a difference readout
- "Integrate" toggle shades the area under the irradiance curve and displays the daily total in kWh/m², introducing insolation ahead of Chapter 15

Implementation: Chart.js with two y-axes and annotation plugin for the callouts. Compute clear-sky irradiance from solar position; add a cloud model as a multiplicative factor with realistic temporal structure for the cumulus case.
</details>

## The UV Index

Ultraviolet needed its own scale because the health effect it causes is not proportional to total energy. UVB is far more damaging per watt than UVA, so a raw irradiance figure would badly misrepresent the risk.

The **UV index** is a standardized measure of the sunburn-causing ultraviolet radiation at a location, weighted by how strongly each wavelength actually damages skin.

It was developed by Environment Canada in 1992 and adopted worldwide by the World Health Organization shortly after. It is an open-ended scale that starts at 0, and the categories are:

| UV index | Category | Guidance |
|----------|----------|----------|
| 0–2 | Low | Safe for most people |
| 3–5 | Moderate | Seek shade near midday |
| 6–7 | High | Protection required |
| 8–10 | Very high | Extra protection; avoid midday sun |
| 11+ | Extreme | Unprotected skin burns in minutes |

Several factors push it up, and two of them surprise people:

- **Sun angle** — the same cosine rule; the index peaks within an hour or so of solar noon
- **Altitude** — roughly 10 percent higher per 1000 m, because there is less atmosphere above to absorb
- **Ozone** — the main UVB absorber, and it varies by season and location
- **Reflection** — fresh snow nearly doubles UV exposure by reflecting it back up at you, which is why skiers burn under their chins
- **Cloud** — reduces UV less than it reduces visible light, so a hazy day feels mild and still burns

Note that measuring the UV index properly requires a UV-specific sensor with the correct spectral weighting. A general irradiance sensor cannot produce a UV index, because it has no way to separate the UVB fraction from everything else.

#### Diagram: UV Exposure Risk Estimator

<iframe src="../../sims/uv-exposure-estimator/main.html" width="100%" height="672px" scrolling="no"></iframe>

<details markdown="1">
<summary>UV Exposure Risk Estimator</summary>
Type: microsim
**sim-id:** uv-exposure-estimator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: assess

Learning objective: The learner assesses ultraviolet risk for a given time, place, and surface, and justifies why the UV index cannot be inferred from how bright or how warm a day feels.

Purpose: The disconnect between perceived heat and actual UV risk causes real harm, and it is a direct consequence of the spectral physics this chapter teaches. Letting the learner build scenarios where a cool, dim day carries high UV makes the point in a way a warning sentence does not.

Canvas layout:
- Left: scenario controls
- Center: a large UV index gauge with the standard five color bands, plus a "time to sunburn" readout for a mid-range skin type
- Right or below (responsive): a contribution breakdown showing how much each factor added or removed, as a stacked horizontal bar
- Below the gauge: two secondary readouts — perceived brightness and perceived warmth — deliberately displayed alongside UV so the mismatch is visible
- Responsive to window resize

Data Visibility Requirements:
  Stage 1: Show a baseline UV index for the selected solar zenith angle at sea level with clear sky
  Stage 2: Show each modifier applied in turn with its numeric effect, e.g. "Altitude 2000 m: +20 percent", "Fresh snow underfoot: +80 percent", "Light cloud: −20 percent"
  Stage 3: Show the resulting UV index and its risk category
  Stage 4: Show estimated minutes to sunburn for unprotected skin
  Stage 5: Show perceived brightness and perceived warmth on their own scales, so the learner can read all three at once

Interactive controls:
- Time of day and date, which set the solar zenith angle
- Latitude
- Altitude, 0 to 4000 m
- Cloud: clear, light cloud, heavy overcast — each affecting UV and visible brightness by DIFFERENT factors, which is the mechanism the element exists to teach
- Ground surface: grass, sand, water, fresh snow, concrete
- Ozone column: normal, low (with a note that low-ozone episodes raise ground UVB)

Required scenarios as preset buttons, each with a written verdict:
1. **"Ski slope, March, noon"** — high altitude, fresh snow, moderate sun angle. UV index high, air temperature below freezing. Verdict: "Cold and dazzling. UV index 8. Skiers burn under the chin from snow reflection."
2. **"Hazy beach afternoon"** — light cloud, sand, low altitude. Verdict: "Feels mild. UV index 7. This is the most commonly underestimated case."
3. **"Bright winter morning, 55° N"** — clear, cold, low sun. Verdict: "Bright and freezing. UV index 1. Brightness is not UV."
4. **"Tropical noon"** — zenith angle near zero. Verdict: "UV index 12. Extreme."
5. **"Overcast summer noon"** — Verdict: "UV index 4. Cloud reduces UV less than it reduces visible light."

The scenario set must include at least one high-UV cold case and one low-UV bright case, so neither warmth nor brightness works as a predictor.

Instructional Rationale: The objective is Evaluate/assess, which requires judging risk against criteria under varying conditions. Displaying UV, brightness, and warmth simultaneously on separate scales is the specific design choice that carries the lesson — the learner sees the three readouts move independently, which is exactly the fact that makes UV dangerous to estimate by feel.

Implementation: p5.js. Build UV index from a clear-sky model driven by solar zenith angle and ozone, then apply multiplicative modifiers for altitude, cloud, and surface reflection. Model perceived brightness and warmth with different cloud coefficients so they diverge from UV realistically.
</details>

## Key Takeaways

- **Solar radiation** is the energy source driving temperature, evaporation, and wind. It arrives as roughly 50 percent infrared, 43 percent **visible light**, and 7 percent **ultraviolet radiation**.
- Herschel discovered infrared in 1800 by placing a thermometer past the red end of a spectrum, establishing that a thermometer can measure light.
- **Irradiance** is power per unit area, measured in **watts per square meter**. The **solar constant** is about 1361 W/m² at the top of the atmosphere — and it is not quite constant.
- The **solar zenith angle** controls irradiance by its cosine. This drives the **diurnal cycle** and, through axial tilt, the **seasonal variation**. Seasons are caused by tilt, not distance.
- **Albedo** is the reflected fraction. Fresh snow reflects about 0.85; asphalt about 0.08.
- A **thermopile** in a **pyranometer** measures total sky irradiance; a **pyrheliometer** measures direct beam only; Langley's **bolometer** measured energy by resistance change.
- The **photovoltaic effect** gives us the **photodiode** for measurement and the **solar cell** for power. Photodiodes are cheap and fast but spectrally uneven.
- The **UV index** weights ultraviolet by its skin-damaging effect and requires a dedicated UV sensor.

## Check Yourself

??? question "Your sensor reads 850 W/m² at noon but the solar constant is 1361 W/m². Is it broken? Click to check."
    No — 850 W/m² is a completely normal clear-noon reading. The solar constant is measured above the atmosphere on a surface perpendicular to the Sun. By the time light reaches your horizontal sensor it has lost energy to the cosine of the zenith angle, to absorption by ozone, water vapor, and carbon dioxide, and to scattering. Losing about 35 percent on a clear day is expected. A reading close to 1361 at ground level would be the suspicious result.

??? question "Why is the hottest part of the day around 3 pm rather than noon? Click to check."
    Because air is warmed by the ground, not directly by sunlight. Irradiance peaks at solar noon, but at that moment the ground is still absorbing more energy than it is losing, so it keeps warming — and it keeps warming the air above it. Temperature peaks when incoming and outgoing energy finally balance, typically two to three hours later. The same lag appears seasonally: the warmest month is usually a month or more after the June solstice.

??? question "Two identical stations, one over grass and one over asphalt. Both measure downward irradiance. Do they read the same? Click to check."
    A downward-facing pyranometer measuring incoming sunlight reads essentially the same at both, since incoming radiation does not care what is underneath. But the *surface* temperatures will differ sharply — asphalt has an albedo around 0.08 and grass around 0.25, so the asphalt absorbs far more and can run 20 °C hotter. And if either sensor sees any reflected light from below, the asphalt station will read slightly lower reflected radiation. This albedo difference is the mechanism behind urban heat islands in Chapter 17.

??? question "It is hazy and does not feel hot. Can you still get sunburned? Click to check."
    Yes, and this is one of the more dangerous misconceptions about sun exposure. Cloud and haze scatter and absorb visible light and infrared more effectively than they absorb UVB. So the day feels cooler and dimmer while UV transmission remains high — often 70 to 80 percent of clear-sky levels under light cloud. The heat you feel comes from infrared; the burn comes from UVB, and they are not correlated. This is exactly why the UV index is reported separately rather than inferred from temperature or brightness.

---

## What Is Next

Solar radiation heats the ground unevenly. Uneven heating produces uneven air density, which produces uneven pressure — and air flows from high pressure to low.

Chapter 10 follows that chain to its result: wind. It opens with the pressure systems and gradients that create air movement, covers the anemometer families and the Beaufort scale that let sailors report wind speed with no instrument at all, and closes with what wind does to people and structures — wind chill, apparent temperature, the hurricane and tornado rating scales, and the wind loads that building codes are written around.
