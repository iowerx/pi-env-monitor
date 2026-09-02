---
title: SI Prefix and Scale Explorer
description: Drag a marker along a scale spanning many powers of ten and read the same value three ways at once - plain decimal, scientific notation, and with its SI prefix - beside a familiar object of that size.
image: /sims/si-prefix-scale-explorer/si-prefix-scale-explorer.png
og:image: /sims/si-prefix-scale-explorer/si-prefix-scale-explorer.png
twitter:image: /sims/si-prefix-scale-explorer/si-prefix-scale-explorer.png
social:
   cards: false
quality_score: 0
---

# SI Prefix and Scale Explorer

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the SI Prefix and Scale Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim answers one question: what does a power of ten actually *feel* like?

A vertical scale bar spans twenty-one decades. Wherever you put the marker, four things
update together:

1. the **plain decimal** value, digits and all;
2. the same value in **scientific notation**;
3. the same value again **with its SI prefix**; and
4. a **familiar object** that is roughly that size.

Seeing all three notations for one value side by side is the whole point. They are not
three facts to memorise, they are three names for the same number.

Switching the quantity from **Length** to **Pressure** or **Time** re-anchors the object
list without changing the machinery, so the same scale that teaches millimetres also
teaches the hectopascal you will meet on every weather report in Chapter 7, and the
microsecond you will meet when the Pi starts timing its own sensor reads.

## How to Use

- **Drag the blue marker** up and down the scale bar, or drag the **Magnitude** slider.
  All four readouts follow.
- Use **-1 decade** and **+1 decade** to move in exact factor-of-ten jumps. This is the
  more useful mode: the prefix system is built out of discrete decades, not a smooth ramp.
- **Click the object panel** (or press **Pin as baseline**) to fix a comparison point.
  The orange line then reports how many orders of magnitude apart the two values are.
- Change **Quantity** to move the same machinery onto pressure or time.
- Watch **the prefix ladder** along the bottom: it shows where on the ladder you are
  standing, not just which rung you landed on.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/si-prefix-scale-explorer/main.html"
        height="582px"
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
- Reading a number in scientific notation
- Knowing that 10^3 means 1000

### Activities

1. **Exploration (5 min)**: Set the quantity to Length and step from 10^-9 up to 10^12 one decade at a time. Stop at each anchor and say the value out loud in all three forms.
2. **Guided practice (5 min)**: Pin "a fingernail" as the baseline. Now find something exactly six orders of magnitude larger. What is it? Then predict, before you look, what six orders of magnitude *smaller* would be.
3. **Transfer (5 min)**: Switch to Pressure and find 10^2 Pa. That is one hectopascal. Now find sea level pressure. How many hectopascals is it? Check your answer against a weather report.

### Assessment
- Given a value in scientific notation, states the matching SI prefix without consulting a table.
- Explains "one order of magnitude" as a factor of ten rather than as "a lot".
- Correctly identifies 101325 Pa as roughly 1013 hPa and recognises it as ordinary sea level pressure.

## References

1. [BIPM, *The International System of Units (SI)*, 9th edition](https://www.bipm.org/en/publications/si-brochure) - the defining document for the prefixes used here.
2. [NIST Special Publication 811, *Guide for the Use of the International System of Units*](https://www.nist.gov/pml/special-publication-811) - practical rules for writing units and prefixes.
3. [Wikipedia: Metric prefix](https://en.wikipedia.org/wiki/Metric_prefix)
4. [Wikipedia: Orders of magnitude (length)](https://en.wikipedia.org/wiki/Orders_of_magnitude_(length))
