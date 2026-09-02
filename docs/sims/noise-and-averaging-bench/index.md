---
title: Noise and Averaging Bench
description: Discover the square-root rule yourself, verify it against the measurement, then meet the two costs that make "average more" the wrong answer.
image: /sims/noise-and-averaging-bench/noise-and-averaging-bench.png
og:image: /sims/noise-and-averaging-bench/noise-and-averaging-bench.png
twitter:image: /sims/noise-and-averaging-bench/noise-and-averaging-bench.png
social:
   cards: false
quality_score: 0
---

# Noise and Averaging Bench

<iframe src="main.html" height="592px" width="100%" scrolling="no"></iframe>

[Run the Noise and Averaging Bench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The square-root rule is easy to state and hard to feel. Averaging N readings cuts the
noise by a factor of the square root of N. Fine. So why not average everything?

This bench answers that by putting three quantities on screen at once, and two of them get
worse as the first gets better.

**Noise.** Two plots, one raw and one averaged, on identical fixed axes so a change in
spread is always a real change in spread. The panel reports both standard deviations, and
next to them the square-root **prediction** and the **measured** result, so the rule is
verified rather than asserted. At depth 16 you should see roughly 25% predicted and
roughly 25% measured.

**Power.** Deeper averaging means the station stays awake longer for every reported
measurement. At depth 1 the estimated battery life is around 189 days. At depth 256 it is
around 9 days. That is a twenty-fold cost for a sixteen-fold noise reduction, and it turns
red when it gets bad.

**The event you destroyed.** Switch to **Sudden event** and a real 6 hPa pressure drop
arrives, lasting 30 seconds, like a squall line. At depth 256 the averaged output shows a
drop of about 0.7 hPa. The sim computes that figure from the actual filter, not from a
lookup table. *Averaging removed the noise and most of the event with it.*

Now choose a depth, and be prepared to defend it. That is the whole exercise.

## How to Use

- The sim starts **paused** with the buffers already full, so the statistics are meaningful
  before you touch anything. Press **Start** to watch it scroll.
- Change **Average** through 1, 4, 16, 64, 256 in **Steady value** mode and compare
  predicted against measured each time.
- Watch the **estimated battery life** as you do it.
- Switch **Signal** to **Slow change**. Averaging costs almost nothing here - work out why.
- Switch to **Sudden event** and run the depths again. Read the red message each time.
- **Reset statistics** regenerates the data with the current settings.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/noise-and-averaging-bench/main.html"
        height="592px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
25-30 minutes

### Bloom's Taxonomy Level
Evaluate (L5)

### Prerequisites
- The Accuracy Versus Precision MicroSim from Chapter 2
- Knowing what a standard deviation describes

### Activities

1. **Verify the rule (8 min)**: In Steady value mode, record predicted and measured for all five depths. Do they agree? Where does the agreement get loosest, and why might that be?
2. **Count the cost (7 min)**: Make a three-column table: depth, noise remaining, battery days. At what depth does the battery cost start to outrun the noise benefit?
3. **The judgement (10 min)**: Switch to Sudden event. Your station is meant to catch squall lines. Choose an averaging depth and write two sentences defending it. There is no single right answer, but there are indefensible ones.

### Assessment
- Justifies a specific averaging depth by reference to more than one cost.
- Explains the square-root rule and can say what it does not promise.
- Recognises that a filter which removes noise also removes fast real signals.

## References

1. [Wikipedia: Moving average](https://en.wikipedia.org/wiki/Moving_average) - the boxcar filter used here.
2. [Wikipedia: Signal averaging](https://en.wikipedia.org/wiki/Signal_averaging) - where the square-root rule comes from.
3. [NIST/SEMATECH e-Handbook of Statistical Methods](https://www.itl.nist.gov/div898/handbook/) - standard deviation and the uncertainty of a mean.
4. [Bosch Sensortec BME280 datasheet](https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/) - the real chip offers oversampling and an IIR filter, which is this trade-off in hardware.
