---
title: Inside the BME280
description: Three chapters of transduction on one 2.5 mm chip - and the temperature path that a pressure-only program cannot skip.
image: /sims/inside-the-bme280/inside-the-bme280.png
og:image: /sims/inside-the-bme280/inside-the-bme280.png
twitter:image: /sims/inside-the-bme280/inside-the-bme280.png
social:
   cards: false
quality_score: 0
---

# Inside the BME280

<iframe src="main.html" height="636px" width="100%" scrolling="no"></iframe>

[Run the Inside the BME280 MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This is the payoff diagram for Chapters 6, 7 and 8. Each transduction mechanism was taught
on its own; here all three sit in one package, sharing one ADC and one bus interface, and
you can see the path that connects them.

Click any of the seven blocks for what it does: the **silicon diaphragm** over a sealed
cavity, the **polymer humidity film**, the **silicon diode** whose forward voltage falls
about 2 mV per degree, the **shared ADC**, the **factory calibration registers** unique to
your individual chip, the **compensation block**, and the **I2C/SPI interface** at 0x76.

**Trace a reading** follows one measurement end to end with real numbers at every stage,
computed with the actual Bosch compensation formulas and the datasheet's example
calibration constants:

1. Air at 1013.2 hPa presses on the diaphragm
2. Piezoresistive elements change resistance as it flexes
3. The ADC samples: **407,962 counts**
4. Raw counts mean nothing yet. Read dig_P1 through dig_P9
5. The formula needs **t_fine = 109568**, derived from the temperature reading of 21.4 °C
6. Compensated: **101,320 Pa**
7. Divide by 100 and store it with its unit: 1013.2 hPa

**Then turn on "Skip the temperature read."** The red dashed path along the bottom of the
diagram lights up as STALE, and a plot appears showing reported pressure against room
temperature. With the fault off it is dead flat. With it on it is a steep straight line:
the same air at 1013.2 hPa reads **1047.5 hPa in a cold room and 985.0 hPa in a warm one**,
a swing of over 60 hPa with no weather involved at all.

That is a real bug, it is common, and the symptom looks exactly like a failing sensor. The
pressure element is temperature-sensitive by design; the compensation formula is what
removes that dependence, and it cannot do its job without a fresh temperature reading.

The **Actual size** overlay draws the chip at true scale next to a grain of rice, because
students consistently imagine something much bigger than 2.5 mm.

## How to Use

- **Click each block** in turn. The connected signal paths light up with it.
- Run **Trace a reading** and step through all seven stages.
- Turn on **Skip the temperature read**, then drag the **ambient temperature** slider and
  watch the reported pressure move.
- Turn the fault off and drag the slider again. Nothing budges. That is the compensation working.
- Press **Actual size** and look at how small it is.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/inside-the-bme280/main.html"
        height="636px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Understand (L2)

### Prerequisites
- Chapter 4 on analog-to-digital conversion
- Chapters 6, 7 and 8 on temperature, pressure and humidity sensing
- Chapter 12 on I2C addressing

### Activities

1. **Name the mechanisms (5 min)**: Click the three sensing elements and write one sentence each connecting them back to their own chapter.
2. **Follow the numbers (8 min)**: Run the trace and record the value at every stage. At which stage does the reading first have a unit attached to it?
3. **Diagnose the drift (8 min)**: With the fault on, record the reported pressure at 5, 15, 25 and 35 °C. Plot it. Then explain to someone who thinks their sensor is broken what is actually wrong.

### Assessment
- Summarises how three transduction mechanisms coexist in one package.
- Explains why the temperature element is required even by a pressure-only program.
- Identifies calibration registers as chip-specific rather than model-specific.

## References

1. [Bosch BME280 datasheet](https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/) - the compensation formulas and calibration registers this sim implements.
2. [Wikipedia: Piezoresistive effect](https://en.wikipedia.org/wiki/Piezoresistive_effect) - the pressure element's transduction mechanism.
3. [Wikipedia: Hygrometer](https://en.wikipedia.org/wiki/Hygrometer#Capacitive) - the capacitive polymer film used for humidity.
4. [Wikipedia: Silicon bandgap temperature sensor](https://en.wikipedia.org/wiki/Silicon_bandgap_temperature_sensor) - why a diode makes a usable thermometer.
