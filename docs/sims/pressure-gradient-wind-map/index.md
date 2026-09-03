---
title: Pressure Gradient Wind Map
description: A deep low with light winds and a shallow low with a gale, on the same map, so the gradient stops being invisible.
image: /sims/pressure-gradient-wind-map/pressure-gradient-wind-map.png
og:image: /sims/pressure-gradient-wind-map/pressure-gradient-wind-map.png
twitter:image: /sims/pressure-gradient-wind-map/pressure-gradient-wind-map.png
social:
   cards: false
quality_score: 0
---

# Pressure Gradient Wind Map

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Pressure Gradient Wind Map MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

"Low pressure means strong wind" is one of the most durable wrong beliefs in weather, and
no still illustration can dislodge it. This one can, because two of its five scenarios are
built to contradict it directly:

- **Scenario 1, a deep low at 970 hPa** spread over a very broad area. Probe anywhere and
  the surface wind is a **gentle breeze, force 3**. Very low pressure, light wind.
- **Scenario 2, a shallow low at 1002 hPa** with its isobars packed. The same probe finds a
  **near gale, force 7**. Higher central pressure, more than three times the wind.

The field is a sum of Gaussian centres, so the gradient at any point is computed exactly
rather than eyeballed off a drawing. Clicking anywhere reports the local pressure, the
gradient as a pressure difference over 200 km, the geostrophic wind from that gradient, and
then the surface wind after friction and the cross-isobar turn.

The other three scenarios extend the point. A **1040 hPa high** carries a near gale along
its packed northern flank while its southern side stays slack, which is strong wind around
a high. A **cold front** shows the passage signature the chapter describes: probe the warm
sector and the wind is from the south-southwest at 22 °C with an 18 °C dew point; probe the
cold air west of the line and it has veered to the west-northwest at 11 °C with a 4 °C dew
point. And a **squeeze zone** puts the windiest point on the whole map in the corridor
between a high and a low rather than at either centre.

**Hide arrows: predict** turns the map into a test. The wind arrows disappear, and you get
five clicks to find the windiest point from the isobar spacing alone. Each guess is scored
against the true maximum.

## How to Use

- Pick a **scenario**, then **click or drag anywhere on the map** to probe it.
- Turn on **Draw the gradient** to see the 200 km ruler laid perpendicular to the isobars,
  with the pressure difference across it labelled.
- Compare **scenario 1 and scenario 2** back to back. That pair is the whole lesson.
- Switch the **hemisphere** and watch the circulation and the cross-isobar turn reverse.
- Use **Hide arrows: predict** and score yourself over five attempts on each scenario.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/pressure-gradient-wind-map/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Analyze (L4)

### Prerequisites
- Chapter 7 on barometric pressure, especially isobars and the millibar
- Chapter 10 sections on pressure systems and the Coriolis effect

### Activities

1. **Break the rule (6 min)**: Record the central pressure and the strongest wind for scenarios 1 and 2. Write one sentence explaining why the deeper low is the calmer one.
2. **Read the front (7 min)**: In scenario 4, probe three points in the warm sector and three in the cold air. Tabulate direction, temperature and dew point, then describe what an observer would notice as the front passed.
3. **Predict, then check (8 min)**: Run the prediction mode on all five scenarios. Which scenario was hardest, and what misled you?

### Assessment
- Predicts relative wind speed from isobar spacing rather than from central pressure.
- Explains why surface wind crosses isobars instead of running straight downhill.
- Identifies the squeeze zone between two systems as a high-wind location.

## References

1. [Wikipedia: Pressure gradient force](https://en.wikipedia.org/wiki/Pressure-gradient_force) - the force this whole map is a picture of.
2. [Wikipedia: Geostrophic wind](https://en.wikipedia.org/wiki/Geostrophic_wind) - the balance used to turn a gradient into a speed.
3. [NOAA National Weather Service JetStream: the pressure gradient](https://www.noaa.gov/jetstream/synoptic/pressure-gradient) - isobar spacing read the way a forecaster reads it.
4. [Wikipedia: Surface weather analysis](https://en.wikipedia.org/wiki/Surface_weather_analysis) - the conventions behind the H, L and front symbols used here.
