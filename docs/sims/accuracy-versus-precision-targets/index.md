---
title: Accuracy Versus Precision Target Range
description: Drive bias and scatter as two independent sliders, produce all four quadrants of the accuracy-precision diagram yourself, and watch calibration fix exactly one of the two faults.
image: /sims/accuracy-versus-precision-targets/accuracy-versus-precision-targets.png
og:image: /sims/accuracy-versus-precision-targets/accuracy-versus-precision-targets.png
twitter:image: /sims/accuracy-versus-precision-targets/accuracy-versus-precision-targets.png
social:
   cards: false
quality_score: 0
---

# Accuracy Versus Precision Target Range

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Accuracy Versus Precision Target Range MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The four-quadrant target diagram is the standard way this distinction gets taught, and as
a static picture it is memorised in about ten seconds and understood by almost nobody.

Here, **bias** and **scatter** are two separate sliders. They are separate because they are
separate ideas:

- **Bias** shifts the *centre* of the dot cloud away from the true value. That is
  inaccuracy. The instrument is consistently wrong.
- **Scatter** controls how widely the dots spread around wherever that centre happens to
  be. That is imprecision. The instrument is unreliable one reading at a time.

You can produce all four quadrants yourself by moving two sliders, which is a much
stronger claim than being shown four pictures.

The **Calibrate** button is the payoff. It measures the bias in the readings you have
taken and subtracts it from every future reading. The bias collapses. The scatter does
not move at all. That is the whole reason the two words exist.

## How to Use

- Set **Bias** and **Scatter**, then press **Take 1 reading** or **Take 20**.
- Watch the target: dots fade with age, a red crosshair marks the mean of the readings, and
  a dashed orange circle shows one standard deviation.
- Read the statistics panel. **True value** and **mean of readings** are printed as separate
  lines with the gap between them labelled *bias*, because that gap is what bias means.
- Press **Calibrate**, then take twenty more readings. Compare the bias before and after.
  Then compare the scatter before and after.
- The four **preset** buttons jump straight to each quadrant with a real-sensor description.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/accuracy-versus-precision-targets/main.html"
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
Analyze (L4)

### Prerequisites
- Reading a histogram
- Knowing what an average is

### Activities

1. **Exploration (5 min)**: Press each of the four presets in turn. For each one, say out loud whether the sensor is accurate, precise, both or neither - before reading the verdict.
2. **Guided practice (6 min)**: Choose Uncalibrated. Take 20 readings and write down the bias and the scatter. Press Calibrate, take 20 more, and write both down again. Which number changed?
3. **Analysis (5 min)**: Set bias to 0 and scatter to 8. Take 1 reading, then 20, then 20 more. Does taking more readings make the *average* better? Does it make any *single* reading better?

### Assessment
- Predicts which fault a described sensor has before running it.
- States that calibration repairs bias and cannot repair scatter.
- Explains why averaging helps an imprecise sensor but not an inaccurate one.

## References

1. [JCGM 100:2008, *Guide to the Expression of Uncertainty in Measurement* (GUM)](https://www.bipm.org/en/committees/jc/jcgm/publications) - the standard treatment of measurement error.
2. [NIST/SEMATECH e-Handbook of Statistical Methods: measurement process characterization](https://www.itl.nist.gov/div898/handbook/) - bias and precision defined and worked through.
3. [Wikipedia: Accuracy and precision](https://en.wikipedia.org/wiki/Accuracy_and_precision)
4. [Wikipedia: Calibration](https://en.wikipedia.org/wiki/Calibration)
