---
title: Axis Honesty Lab
description: Two charts, one dataset, and a verdict that depends on what you are claiming - because "never truncate the y-axis" is not the rule.
image: /sims/axis-honesty-lab/axis-honesty-lab.png
og:image: /sims/axis-honesty-lab/axis-honesty-lab.png
twitter:image: /sims/axis-honesty-lab/axis-honesty-lab.png
social:
   cards: false
quality_score: 0
---

# Axis Honesty Lab

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Axis Honesty Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students are taught "never truncate the y-axis." That rule is wrong often enough to be worth
unlearning, and it produces charts that hide real signal. The actual skill is judging whether
the scale matches the claim.

Two charts plot **the same shared array**, so they provably cannot differ in data — only in
presentation. Drag the handles beside either y-axis and watch a week of temperature that
varies by **0.75 °C** turn from "essentially flat" into "dramatic variation". A live reader's
impression sits under each chart, and a readout reports what fraction of the plot height the
data actually occupies: 3 per cent on one, 81 per cent on the other.

**The claim selector supplies the criterion**, and that is the mechanism that replaces a rule
with a judgment:

| Claim | Wide axis | Tight axis |
|---|---|---|
| This place has a stable climate | **defensible** | wrong scale |
| A storm passed mid-month | wrong scale | **right scale**, needs disclosure |
| Temperatures are rising | wrong scale | **right scale**, needs disclosure |
| The sensor failed on Tuesday | **defensible** | wrong scale |

The pressure dataset is the one to sit with. It contains a genuine 25 hPa storm, and burying
it in a 100 hPa axis hides the evidence for the claim being made. **Truncation is not
automatically dishonest** — it is dishonest when it is undisclosed. Turn on "disclose
truncation" for the five-year trend dataset and the verdict flips from *"Right scale, missing
disclosure"* to *"Defensible for this claim"*. That is the whole argument in one toggle.

The **gap** dataset overrides everything. Turn on "join across gaps" and the verdict becomes
*"Misleading, whatever the axis does"*, because the line asserts six hours of data that do not
exist and no axis choice excuses that.

**Make it lie** asks you to build a misleading chart from honest data. It takes about two
drags. Students who have constructed one recognise one far faster than students who have only
been warned.

## How to Use

- Drag the small grey handles beside either y-axis. Both charts hold the same data.
- Read the **reader's impression** under each chart, not just the numbers.
- Change the **claim** without touching the axes and watch the verdicts flip.
- On the pressure dataset, press **Fit chart 2 to the data**, then toggle **disclose truncation**.
- On the gap dataset, toggle **Join across gaps** and read what the verdict says.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/axis-honesty-lab/main.html"
        height="662px"
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
- Chapter 15 sections on line charts and honest axis labelling

### Activities

1. **Same data, two stories (6 min)**: With the temperature week loaded, write down the reader's impression for each chart and the true variation. Explain how both charts can be accurate.
2. **When truncation is right (8 min)**: Load the pressure month and set chart 1 to 960-1060 and chart 2 tight. Which one supports the claim that a storm passed, and why is the tight axis the honest one here?
3. **Make it lie, then fix it (8 min)**: Use lie mode to build a misleading chart. Then list the two disclosures that would have protected the reader without changing a single plotted point.

### Assessment
- Judges an axis choice against a stated claim rather than against a memorised rule.
- Explains why joining a line across a gap is misleading regardless of scale.
- Names the disclosures that make a truncated axis defensible.

## References

1. [Wikipedia: Misleading graph](https://en.wikipedia.org/wiki/Misleading_graph) - truncated axes and the rest of the catalogue.
2. [Wikipedia: Edward Tufte](https://en.wikipedia.org/wiki/Edward_Tufte) - the case for and against always including zero.
3. [Wikipedia: Missing data](https://en.wikipedia.org/wiki/Missing_data) - why a gap is information rather than an inconvenience.
4. [NASA: global temperature record](https://climate.nasa.gov/vital-signs/global-temperature/) - the real version of the contested five-year trend case.
