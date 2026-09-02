---
title: Temperature Sensor Comparison
description: Four sensor families on one temperature axis, with four real jobs to choose between them. Range rules sensors out before any other specification gets a vote.
image: /sims/temperature-sensor-comparison/temperature-sensor-comparison.png
og:image: /sims/temperature-sensor-comparison/temperature-sensor-comparison.png
twitter:image: /sims/temperature-sensor-comparison/temperature-sensor-comparison.png
social:
   cards: false
quality_score: 0
---

# Temperature Sensor Comparison

<iframe src="main.html" height="606px" width="100%" scrolling="no"></iframe>

[Run the Temperature Sensor Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
## About This MicroSim

Chapter 2 introduced measurement range as a specification that rules sensors in or out.
This is what that looks like.

Four families on one axis:

| Sensor | Range | Sensitivity | Linearity | Cost |
|---|---|---|---|---|
| Thermocouple (type K) | −200 to 1350 °C | low | fair | low |
| Resistance thermometer (Pt100) | −200 to 850 °C | moderate | excellent | high |
| Thermistor (NTC 10k) | −55 to 150 °C | very high | poor | very low |
| Silicon diode (BME280) | −40 to 85 °C | moderate | good | low |

The temperature axis is deliberately **broken**: 450 degrees below 200 °C get 70% of the
width, and the remaining 1600 degrees share the rest. Without that, the −50 to 150 band
where almost every reading in this book lives would be an unreadable sliver. The break is
marked on the axis with a red glyph and named in the axis title.

Pick a scenario and watch sensors get ruled out. The Minnesota one is the interesting case:
all four are technically in range for −40 to +40, but the BME280's floor is exactly −40,
and Minnesota's record low is −51 °C, set at Tower in 1996. On that night your station
would not read badly. It would stop reading.

The **response curves** view answers the obvious follow-up question. Platinum is almost
perfectly straight and the thermistor curves hard - and those are the same fact seen twice,
because curving hard is what being very sensitive looks like on a graph. High sensitivity
and good linearity pull in opposite directions.

## How to Use

- **Hover** a bar for its exact range, sensitivity, linearity and cost.
- **Click** a bar for how that sensor actually works.
- Press a **scenario** button. Sensors that cannot do the job dim, and the panel says why.
- Switch to **Response curves** and compare the shapes.
- Note the red break glyph on the temperature axis. The scale changes there.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/temperature-sensor-comparison/main.html"
        height="606px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Evaluate (L5)

### Prerequisites
- Chapter 2 on measurement range
- Reading a horizontal bar chart

### Activities

1. **Read the ranges (5 min)**: Without pressing any scenario button, write down which sensor you would pick for a freezer monitor, a car engine, and a pizza oven. Then check each one against the bars.
2. **Rule things out (8 min)**: Work through all four scenarios. For each, list which sensors were ruled out on range alone and which on some other ground.
3. **The trade-off (8 min)**: Switch to Response curves. Explain in two sentences why the thermistor is both the most sensitive and the hardest to use.

### Assessment
- Recommends a sensor for a stated job and defends it against at least two rejected alternatives.
- Uses range as a disqualifier before considering cost or sensitivity.
- Explains the tension between sensitivity and linearity.

## References

1. [NIST: ITS-90, the International Temperature Scale](https://www.nist.gov/pml/thermodynamic-metrology/its-90-thermometry) - why platinum defines the scale.
2. [Wikipedia: Thermocouple](https://en.wikipedia.org/wiki/Thermocouple) - including the type K range used here.
3. [Wikipedia: Thermistor](https://en.wikipedia.org/wiki/Thermistor) - the exponential response plotted in the curves view.
4. [Bosch Sensortec BME280 datasheet](https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/) - the minus 40 to 85 deg C limits this book lives inside.
