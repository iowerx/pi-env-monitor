---
title: Measurement to Decision Explorer
description: Seven measurements, ten derived quantities, fifteen real decisions - and what goes dark when you switch one sensor off.
image: /sims/measurement-to-decision-explorer/measurement-to-decision-explorer.png
og:image: /sims/measurement-to-decision-explorer/measurement-to-decision-explorer.png
twitter:image: /sims/measurement-to-decision-explorer/measurement-to-decision-explorer.png
social:
   cards: false
quality_score: 0
---

# Measurement to Decision Explorer

<iframe src="main.html" height="654px" width="100%" scrolling="no"></iframe>

[Run the Measurement to Decision Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[vis-network documentation](https://visjs.github.io/vis-network/docs/network/)

## About This MicroSim

This is the capstone diagram of the whole book. Seventeen chapters introduced measurements
one at a time; this assembles the entire dependency structure so you can see that **most
consequential decisions require several measurements together**.

Thirty-two nodes in three layers, seventy-five edges. Seven measurements on the left, ten
quantities derived from them in the middle, fifteen decisions that people really make on the
right. Solid arrows mean *required by*; dashed arrows mean *improves*; thicker arrows mean
that measurement reaches more decisions.

**Click a measurement** and everything downstream lights up:

| Measurement | Decisions it reaches |
|---|---|
| Location and Time | 12 of 15 |
| Temperature | 11 of 15 |
| Wind Speed | 11 of 15 |
| Humidity | 10 of 15 |
| Solar Radiation | 6 of 15 |
| Barometric Pressure | 5 of 15 |
| Ground Motion | 2 of 15 |

**Click a decision** and everything upstream lights up instead. Wildfire Risk and Power
Shutoff — *a utility deciding whether to cut power to a hundred thousand homes* — requires
four of the seven measurements, and the panel says so plainly: **no single measurement is
sufficient.** It also names what the station cannot supply: fuel moisture and precipitation
history. Knowing what you cannot measure is part of measuring.

**Sensor failure** mode is the most direct statement of why each sensor is on the station.
Switch temperature off and **10 of the 15 decisions become impossible**, along with six
derived quantities — dew point, heat index, wind chill, evapotranspiration, growing degree
days and the fire danger index all stop existing. Switch ground motion off and exactly two
decisions fail. Neither answer is obvious before you try it, and the contrast is the point.

The **chapter filter** cuts the graph down to one chapter's subgraph, so a reader in the
middle of Chapter 10 can see just the wind dependencies.

## How to Use

- **Click any node.** Measurements highlight downstream, decisions highlight upstream.
- **Hover** a node for its unit and chapter, or for who makes that decision and what is at stake.
- Press **Sensor failure**, then click measurements off one at a time and read the count.
- Set the **chapter filter** to the chapter you are reading.
- **Drag the background** to pan and use the wheel to zoom; **Fit** re-frames it.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/measurement-to-decision-explorer/main.html"
        height="654px"
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
- Chapters 5 through 11, which introduce the seven measurements
- Chapter 15 on derived quantities
- Chapter 17 on measurement and consequence

### Activities

1. **Trace a decision (7 min)**: Pick three decisions and list every measurement each one requires. Which needs the most, and which needs the fewest?
2. **Rank the sensors (8 min)**: Use sensor-failure mode to record how many decisions fail when each of the seven is switched off. Rank them, then argue for which sensor you would buy first on a limited budget.
3. **Find the gaps (6 min)**: Find the three decisions where the panel names something the station cannot measure. What would you have to add to your station to close each gap?

### Assessment
- Organises measurements, derived quantities and decisions into a dependency structure.
- Traces any decision back to the measurements it requires.
- Identifies decisions that depend on more than one quantity, and explains why.

## References

1. [WMO: why observations matter](https://wmo.int/topics/observations) - the institutional version of this diagram.
2. [Wikipedia: Directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) - the structure the dependencies form.
3. [NOAA: decision support services](https://www.weather.gov/about/decision-support-services) - what the decision nodes on the right actually look like in practice.
4. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - the library rendering the graph.
