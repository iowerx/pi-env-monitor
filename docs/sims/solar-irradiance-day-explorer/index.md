---
title: Solar Irradiance Through the Day
description: Irradiance and air temperature on one time axis, across seasons and latitudes, with the thermal lag measured as a horizontal offset rather than asserted.
image: /sims/solar-irradiance-day-explorer/solar-irradiance-day-explorer.png
og:image: /sims/solar-irradiance-day-explorer/solar-irradiance-day-explorer.png
twitter:image: /sims/solar-irradiance-day-explorer/solar-irradiance-day-explorer.png
social:
   cards: false
quality_score: 0
---

# Solar Irradiance Through the Day

<iframe src="main.html" height="608px" width="100%" scrolling="no"></iframe>

[Run the Solar Irradiance Through the Day MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
## About This MicroSim

The diurnal and seasonal cycles dominate every dataset this station will ever produce.
Recognising them is what lets you spot anything genuinely anomalous in Chapter 15.

Irradiance and air temperature share a single time axis, and the **irradiance scale is
fixed at 0 to 1100 W/m2 for every scenario**, so a shorter curve is always genuinely less
energy rather than a rescaled one.

**The thermal lag** is drawn as an arrow between the two peaks with the gap in hours
printed on it. Irradiance peaks at solar noon; the air peaks two to three hours later,
because the ground has to warm first and then warm the air. The lag is not a modelling
trick - the temperature here is computed as a first-order response to the irradiance, and
the lag falls out of it.

Four things worth setting up deliberately:

- **Scattered cumulus** produces a spiky trace that briefly rises *above* the clear-sky
  envelope. Cloud edges reflect extra light onto the sensor. Those over-readings are real,
  and a student who does not know that will flag good data as faulty in Chapter 15.
- **Arctic Circle, December solstice**: a flat line at zero. The Sun does not rise.
- **Arctic Circle, June solstice**: the Sun does not set, but it stays low, so the peak is
  modest.
- **Add comparison** pins the current curve so you can overlay another. Put the equator
  against the Arctic Circle on the June solstice and press **Integrate**: the equatorial
  curve is taller, and the Arctic one delivers *more* energy over the day - 6.51 kWh/m2
  against 6.05. A low Sun that never sets beats a high one that does.

**Integrate** shades the area under the curve and reports the daily total in kWh per square
metre. That is insolation, which is what a solar panel and a growing plant both actually
care about, and Chapter 15 works with it.

## How to Use

- Set **latitude**, **date** and **sky**, and read the annotation that appears.
- Hover any moment for irradiance, air temperature and the solar zenith angle. Click a
  point for the cosine calculation behind it.
- Switch to **Scattered cumulus** and find the spikes above the dashed envelope.
- Press **Add comparison**, change the latitude, and press **Integrate** to compare daily
  totals.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/solar-irradiance-day-explorer/main.html"
        height="608px"
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
- The Solar Energy Budget MicroSim
- Reading a chart with two y-axes

### Activities

1. **Measure the lag (6 min)**: At 45 degrees on the June solstice, read the time of peak irradiance and peak temperature. Explain the gap in terms of what has to warm first.
2. **Seasons and latitudes (8 min)**: Compare 45 degrees at the June and December solstices, then 0 and 60 degrees on the same date. Describe what changes: the height of the curve, its width, or both.
3. **Totals versus peaks (8 min)**: Pin the equator on the June solstice, switch to the Arctic Circle, and press Integrate. Which has the higher peak? Which has the bigger daily total? Explain.

### Assessment
- Explains the thermal lag in terms of heat capacity rather than restating it.
- Distinguishes peak irradiance from daily total insolation.
- Recognises brief over-readings under cumulus as real rather than faulty.

## References

1. [NOAA Solar Calculator](https://gml.noaa.gov/grad/solcalc/) - solar position for any date and place.
2. [NREL: solar resource data and insolation](https://www.nrel.gov/grid/solar-resource/) - daily totals in kWh per square metre.
3. [Wikipedia: Insolation](https://en.wikipedia.org/wiki/Solar_irradiance)
4. [Wikipedia: Diurnal temperature variation](https://en.wikipedia.org/wiki/Diurnal_temperature_variation) - the thermal lag.
