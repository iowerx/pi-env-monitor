---
title: Unit Conversion Workbench
description: Convert temperature, pressure, speed and length by watching the units cancel in a worked fraction chain, with a deliberate upside-down demo that shows the method failing.
image: /sims/unit-conversion-workbench/unit-conversion-workbench.png
og:image: /sims/unit-conversion-workbench/unit-conversion-workbench.png
twitter:image: /sims/unit-conversion-workbench/unit-conversion-workbench.png
social:
   cards: false
quality_score: 0
---

# Unit Conversion Workbench

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Unit Conversion Workbench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Most students convert units by remembering a multiplier. That works right up until
they meet a conversion nobody taught them, and then it fails completely.

This workbench shows the **cancellation method** instead. Every conversion is displayed as
the original value multiplied by a fraction that equals one, with the units that cancel
struck through in red so you can see which unit survives.

Temperature is handled separately and on purpose. The **scaling step and the offset step
appear on their own lines**, because collapsing them into one formula is exactly where
students go wrong. The sim also warns about the difference between converting a
temperature and converting a *change* in temperature - a 5 °C rise is a 9 °F rise, not
41 °F.

The **Flip the fraction** button is the most important control on the screen. It turns the
conversion fraction upside down, nothing cancels, and the answer comes out in units like
`inHg·inHg/hPa` which are not a pressure at all. Watching the method fail is what proves
that unit cancellation is a check, not a ritual.

## How to Use

- Pick a **quantity tab**: Temperature, Pressure, Speed or Length.
- Type a **value**, or drag the slider. Choose the **From** and **To** units.
- **Show me why** toggles the full working. Leave it on until the cancellation is obvious.
- **Flip the fraction** inverts the conversion factor. Read what happens to the units.
- **Quiz me** hides the working and poses a conversion. Answers within 0.1 percent count as
  correct. A wrong answer reveals the cancellation chain rather than just the number.
- On the Temperature tab, tick **This is a temperature CHANGE** to drop the offset step and
  see why that matters.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/unit-conversion-workbench/main.html"
        height="562px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
15-20 minutes

### Bloom's Taxonomy Level
Apply (L3)

### Prerequisites
- Multiplying and dividing decimals
- Reading a fraction as a division

### Activities

1. **Exploration (4 min)**: Start on Pressure with the default 29.92 inHg. Read the chain aloud: "inches of mercury times hectopascals per inch of mercury leaves hectopascals." Then press Flip the fraction and read it aloud again.
2. **Guided practice (6 min)**: On the Temperature tab, convert 20 °C to °F with the working shown. Now tick the temperature-change box and convert again. Explain in one sentence why the two answers differ.
3. **Assessment (5 min)**: Use Quiz me five times on the Speed tab. For each wrong answer, find which step of the revealed chain you got wrong.

### Assessment
- Sets up a conversion fraction the right way up without being told which way it goes.
- Identifies the surviving unit before computing the number.
- Distinguishes converting a temperature from converting a temperature difference.

## References

1. [NIST Special Publication 811, Appendix B: conversion factors](https://www.nist.gov/pml/special-publication-811) - the authoritative factors used in this sim.
2. [Wikipedia: Conversion of units](https://en.wikipedia.org/wiki/Conversion_of_units)
3. [Wikipedia: Dimensional analysis](https://en.wikipedia.org/wiki/Dimensional_analysis) - the general form of the cancellation method.
4. [NOAA National Weather Service glossary: pressure units](https://www.weather.gov/) - where hPa, mbar and inHg all show up on the same map.
