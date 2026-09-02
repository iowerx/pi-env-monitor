---
title: Atmospheric Layers Explorer
description: See the atmosphere drawn to honest scale, discover how thin the weather-producing layer really is, then stretch the troposphere to read the detail inside it.
image: /sims/atmospheric-layers-explorer/atmospheric-layers-explorer.png
og:image: /sims/atmospheric-layers-explorer/atmospheric-layers-explorer.png
twitter:image: /sims/atmospheric-layers-explorer/atmospheric-layers-explorer.png
social:
   cards: false
quality_score: 0
---

# Atmospheric Layers Explorer

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Atmospheric Layers Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students consistently overestimate how much of the atmosphere is involved in weather.
Correcting that is the single most useful thing this chapter can do, and prose does not
do it.

The explorer opens on an **honest linear scale**: ground at the bottom, 700 km at the top.
On that scale the troposphere - where every storm, cloud and weather report you have ever
seen lives - is a barely visible sliver at the very bottom. That surprise is the point, and
it has to come first.

Only then does **Stretch the troposphere** redraw the same column on a non-linear vertical
scale so the bottom 12 km fills half the canvas and its internal detail becomes readable.

Dragging the altitude slider reports, at every height, the approximate **air pressure in
hPa** and **temperature in °C** from the standard atmosphere, plus a familiar object at
that altitude - a house, the Burj Khalifa, Everest, a cruising airliner, a weather balloon
at burst altitude, the Kármán line, the ISS.

Your station is marked at ground level, at the very bottom of the whole picture.

## How to Use

- Start on the **linear scale** and look at how little of the column the troposphere takes
  up. Do not skip this step; it is the whole argument.
- **Click any layer band** to open its infobox: altitude range, what happens there, and why.
- **Drag the altitude slider** to move the marker line. Watch pressure fall and temperature
  change as you climb.
- Press **Stretch the troposphere** to switch to the non-linear scale and read the detail in
  the bottom 12 km. In this mode the stratosphere and mesosphere compress so far that their
  band labels drop out - they stay clickable, and the panel still names them.
- **Hover a reference object** for its name and exact altitude.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/atmospheric-layers-explorer/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
15-20 minutes

### Bloom's Taxonomy Level
Understand (L2)

### Prerequisites
- Knowing that air gets thinner with altitude
- Reading a value off a vertical scale

### Activities

1. **Prediction (3 min)**: Before opening the sim, sketch how tall you think the weather layer is compared to the whole atmosphere. Then look at the linear view.
2. **Exploration (7 min)**: Click each of the five layers in turn and read the infobox. Note which layer gets colder with height and which gets warmer, and say why that matters for storms.
3. **Measurement (6 min)**: Drag the slider to 8.8 km, the summit of Everest. Read the pressure. Roughly what fraction of sea level pressure is that? Now find the altitude where pressure is about half of sea level.

### Assessment
- States that essentially all weather occurs in the bottom 12 km.
- Explains why storms flatten out at the tropopause instead of continuing upward.
- Reads pressure and temperature off the slider and relates them to a familiar altitude.

## References

1. [NOAA/NASA/USAF, *U.S. Standard Atmosphere, 1976*](https://ntrs.nasa.gov/citations/19770009539) - the pressure and temperature model behind the readouts.
2. [Wikipedia: Atmosphere of Earth](https://en.wikipedia.org/wiki/Atmosphere_of_Earth)
3. [Wikipedia: Troposphere](https://en.wikipedia.org/wiki/Troposphere)
4. [Wikipedia: Kármán line](https://en.wikipedia.org/wiki/K%C3%A1rm%C3%A1n_line) - why 100 km is the usual definition of space.
