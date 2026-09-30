---
title: Station Siting Planner
description: Drag a station around a school site and watch all seven sensors score at once - because you cannot improve one without degrading another.
image: /sims/station-siting-planner/station-siting-planner.png
og:image: /sims/station-siting-planner/station-siting-planner.png
twitter:image: /sims/station-siting-planner/station-siting-planner.png
social:
   cards: false
quality_score: 0
---

# Station Siting Planner

<iframe src="main.html" height="658px" width="100%" scrolling="no"></iframe>

[Run the Station Siting Planner MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Siting is the highest-consequence irreversible decision in this project, and it involves
constraints that pull in different directions. **Scoring all seven sensors from one
placement** is the design decision that makes that unavoidable: you cannot optimise one
without watching another degrade.

Drag the station anywhere on a 120 by 84 metre school site. Shadows are computed
geometrically from each obstruction's height and the solar position, so the shade hours are
derived rather than asserted — the main building throws a 2 metre shadow at summer noon and
a **32 metre** shadow at three o'clock in winter.

Four locations are made tempting and then penalised:

| Location | What it costs you |
|---|---|
| **Beside the building** | Asphalt beneath, 4 m from an 8 m wall that needs 32 m. Five sensors poor. |
| **On the car park** | Open sky, so **solar and GPS score good** — and the asphalt ruins temperature and humidity anyway. |
| **Under the large oak** | Cool and shaded: **12.8 of 12.8 summer hours in shade**, 48 per cent of the sky blocked. Solar and GPS poor. |
| **Middle of the field** | **All seven good.** Now work out how you are going to get power and a network to it. |

That last row is the point. The best exposure on the site is also the furthest from mains
power and Wi-Fi, which is exactly what the rest of the chapter is about.

**Two conflicts are discovered rather than stated.** Put the radiation shield at 2.5 m and
the solar sensor at 2.0 m and the solar row turns poor: *"the shield casts a shadow on the
sensor for about 3.3 hours around midday in summer."* Raise the solar sensor to 3.0 m and it
clears. And mounting the accelerometer on the mast scores poor for a reason worth
remembering — *"the mast sways in wind. This sensor will record the mast, not the ground"* —
with a ground stake as the resolution.

**Explain** on any scorecard row opens the rule that produced the score, with the chapter it
comes from.

## How to Use

- **Drag the station marker** anywhere. All seven scores update live.
- Try each **tempting spot** in turn and read the verdict's "worst problem".
- Turn on **clearance** to see the four-times-height circles, and **shadows** with the time slider.
- Switch to **Winter** and drag the time to 15:00. That is when shading bites.
- Set the **shield to 2.5 m** and the **solar sensor to 2.0 m**, then look at the mast elevation.
- Mount the **seismic sensor on the mast** and read why that fails.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/station-siting-planner/main.html"
        height="658px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
25-30 minutes

### Bloom's Taxonomy Level
Evaluate (L5)

### Prerequisites
- Chapter 16 sections on siting, clearance and enclosures
- Chapter 6 on radiation shields, Chapter 9 on albedo, Chapter 11 on seismic mounting

### Activities

1. **Four temptations (10 min)**: Visit each candidate location and record all seven scores. For each, write one sentence naming what you gained and what you gave up.
2. **Find a better spot (8 min)**: Without using the candidate buttons, find a placement where all seven score good. Note its coordinates and what makes it work.
3. **Resolve the conflict (7 min)**: Create the shield-over-solar shadow, then fix it. Then explain why the seismic sensor cannot share the mast, in terms of Chapter 11's inertial mass.

### Assessment
- Recommends a location and defends it against all seven exposure requirements.
- Identifies which requirements conflict and how the conflict is resolved.
- Explains why the best-exposed location is the hardest to power and network.

## References

1. [WMO Guide to Instruments and Methods of Observation, siting classification](https://library.wmo.int/idurl/4/68695) - the four-times-height convention and the site classes.
2. [NOAA USCRN site selection criteria](https://www.ncei.noaa.gov/access/crn/) - how a national network chooses its ground.
3. [Wikipedia: Urban heat island](https://en.wikipedia.org/wiki/Urban_heat_island) - why asphalt beneath a sensor is not a small problem.
4. [Wikipedia: Stevenson screen](https://en.wikipedia.org/wiki/Stevenson_screen) - the shield whose shadow this planner makes you account for.
