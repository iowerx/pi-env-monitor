---
title: Anatomy of an Environmental Monitoring Station
description: Click through the eleven components of a small weather station, name the quantity each one measures, and see which chapter covers it in depth.
image: /sims/monitoring-station-anatomy/monitoring-station-anatomy.png
og:image: /sims/monitoring-station-anatomy/monitoring-station-anatomy.png
twitter:image: /sims/monitoring-station-anatomy/monitoring-station-anatomy.png
social:
   cards: false
quality_score: 0
---

# Anatomy of an Environmental Monitoring Station

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Anatomy of an Environmental Monitoring Station MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Most readers of Chapter 1 have never seen one of these up close. This is the orientation
diagram, and it is the picture the rest of the book fills in.

Eleven components are marked on a side view of a small station on a post. Each marker
names the part, says what quantity it measures, and points at the chapter that covers it
properly:

| Component | Chapter |
|---|---|
| Enclosure, solar panel, battery, cellular antenna | 16 |
| Single-board computer | 3 |
| GPS antenna | 5 |
| BME280 sensor, radiation shield | 6, 7, 8 |
| Solar radiation sensor | 9 |
| Anemometer | 10 |
| Accelerometer | 11 |

The radiation shield is worth stopping on. Those white louvres are not decoration: without
them the station measures the sun rather than the air.

Markers you have opened stay ticked, so the panel doubles as a checklist - the counter
reads *explored N of 11*. The station is drawn with p5 primitives rather than a photograph,
so it stays sharp at any width and has no external image to load.

## How to Use

- **Hover** a marker to highlight the component and see its name.
- **Click** a marker to open its infobox: what it is, what it measures, and where in the
  book it is covered.
- Tick **Show all labels** if you would rather see the whole map at once before exploring.
- **Reset** clears the explored ticks so a second learner can start clean.
- Aim to reach *explored 11 of 11*.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/monitoring-station-anatomy/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
10-15 minutes

### Bloom's Taxonomy Level
Remember (L1)

### Prerequisites
- No prior knowledge required

### Activities

1. **Overview (3 min)**: Turn on Show all labels and read the whole station at once. Do not click anything yet.
2. **Exploration (7 min)**: Turn the labels off and click every marker until the counter reads 11 of 11. For each one, say the measured quantity out loud before reading the infobox.
3. **Recall (4 min)**: Press Reset, cover the screen, and list as many of the eleven components as you can from memory along with what each measures.

### Assessment
- Names all eleven components and the quantity each one measures.
- Explains why the thermometer needs a radiation shield.
- Identifies which components are about power and communications rather than sensing.

## References

1. [WMO-No. 8, *Guide to Instruments and Methods of Observation*](https://library.wmo.int/idurl/4/68695) - siting and exposure standards for each instrument shown here.
2. [NOAA National Weather Service: Automated Surface Observing System (ASOS)](https://www.weather.gov/asos/) - the professional version of this station.
3. [Bosch Sensortec BME280 datasheet](https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/) - the one chip behind Chapters 6, 7 and 8.
4. [Wikipedia: Stevenson screen](https://en.wikipedia.org/wiki/Stevenson_screen) - the classic radiation shield.
