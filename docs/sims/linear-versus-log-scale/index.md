---
title: Linear Versus Logarithmic Scale
description: Plot the same eight earthquakes on a linear axis and then a logarithmic one. Nothing about the data changes; only the axis does.
image: /sims/linear-versus-log-scale/linear-versus-log-scale.png
og:image: /sims/linear-versus-log-scale/linear-versus-log-scale.png
twitter:image: /sims/linear-versus-log-scale/linear-versus-log-scale.png
social:
   cards: false
quality_score: 0
---

# Linear Versus Logarithmic Scale

<iframe src="main.html" height="504px" width="100%" scrolling="no"></iframe>

[Run the Linear Versus Logarithmic Scale MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
## About This MicroSim

You cannot argue someone into believing that a logarithmic scale is necessary. They have
to see the linear version fail.

This chart plots relative ground motion for eight earthquakes from magnitude 2.0 to
magnitude 9.1. Because each whole step of magnitude is a factor of ten in ground motion,
the magnitude 9.1 event shakes the ground roughly **12.6 million times** as far as the
magnitude 2.0 event.

On the **linear axis**, seven of the eight bars are visually indistinguishable from zero.
They are not zero. They are earthquakes that knock down buildings.

On the **logarithmic axis**, all eight become readable, and the even spacing between them
exposes the factor-of-ten structure that the magnitude scale is built from.

The dataset is identical between the two views. Only the axis type changes, so there is
nothing else the difference could be blamed on.

## How to Use

- Press **Linear axis** and **Logarithmic axis** to swap the y-axis scale type.
- **Hover** any bar for the magnitude, the relative ground motion in scientific notation,
  and a plain-language description of what that shaking feels like.
- **Click** any bar to pin a comparison with the magnitude 2.0 baseline, written both as a
  plain number and in scientific notation.
- Read the caption above the plot. It changes with the axis.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/linear-versus-log-scale/main.html"
        height="504px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
15-20 minutes

### Bloom's Taxonomy Level
Analyze (L4)

### Prerequisites
- Reading a bar chart
- Knowing that 10^4 means 10000

### Activities

1. **Prediction (3 min)**: Before touching anything, predict how tall the magnitude 7.0 bar will look next to the magnitude 9.1 bar. Then look at the linear view.
2. **Exploration (5 min)**: Click each bar in turn on the linear view and read the comparison. Note how large the numbers are for bars that look like nothing.
3. **Analysis (6 min)**: Switch to the logarithmic axis. Measure with your finger: is the gap from M3 to M4 the same height as the gap from M7 to M8? Explain what that equal spacing means.

### Assessment
- States why the linear view is misleading without calling it wrong.
- Explains equal spacing on a log axis as equal *ratios*, not equal differences.
- Names a second quantity from this book that would need a log axis.

## References

1. [USGS: Earthquake magnitude, energy release, and shaking intensity](https://www.usgs.gov/programs/earthquake-hazards/earthquake-magnitude-energy-release-and-shaking-intensity) - the factor-of-ten relationship used for the amplitudes here.
2. [USGS: Moment magnitude, Richter scale - what are the different magnitude scales?](https://www.usgs.gov/faqs/moment-magnitude-richter-scale-what-are-different-magnitude-scales-and-why-are-there-so-many)
3. [Wikipedia: Moment magnitude scale](https://en.wikipedia.org/wiki/Moment_magnitude_scale)
4. [Wikipedia: Logarithmic scale](https://en.wikipedia.org/wiki/Logarithmic_scale)
