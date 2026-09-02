---
title: Observation or Measurement Sorter
description: Judge twelve statements about the environment as qualitative observation or quantitative data, with two deliberately tricky cards that break the belief that "has a number" is enough.
image: /sims/observation-or-measurement-sorter/observation-or-measurement-sorter.png
og:image: /sims/observation-or-measurement-sorter/observation-or-measurement-sorter.png
twitter:image: /sims/observation-or-measurement-sorter/observation-or-measurement-sorter.png
social:
   cards: false
quality_score: 0
---

# Observation or Measurement Sorter

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Observation or Measurement Sorter MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This is the foundational distinction of the whole book, and it is one students think
they already understand until they are asked to apply it to a borderline case.

Twelve statement cards arrive in random order. Each one goes in one of two bins:
**Qualitative Observation** or **Quantitative Data**. The rule being tested is a single
sentence: *quantitative data needs both a number AND a unit.*

Two cards exist specifically to break the wrong version of that rule:

- **"The temperature is 25."** has a number and is still only an observation. 25 what?
  Celsius? Fahrenheit? Without a unit it cannot be compared to anything.
- **"The wind is strong enough to bend the small trees."** is a real, useful, skilled
  observation - it is roughly Beaufort force 6 - and it still has no number, so it cannot
  be graphed.

Feedback names the rule on every card rather than just marking it right or wrong, because
naming the rule is what turns a lucky guess into a generalisation.

## How to Use

- **Drag the card** into the bin you think it belongs in. On a touch screen, or if you
  would rather not drag, **tap the bin** directly.
- Read the feedback before pressing **Next**. It states the reason, not just the verdict.
- The **score** counts correct out of attempted, so a wrong answer stays on your record.
- **Reset** reshuffles the deck and clears the score.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/observation-or-measurement-sorter/main.html"
        height="482px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
10-15 minutes

### Bloom's Taxonomy Level
Evaluate (L5)

### Prerequisites
- No prior knowledge required - this is the first MicroSim in the book

### Activities

1. **Cold run (5 min)**: Work through all twelve cards without discussion. Write down your score.
2. **Discussion (5 min)**: Find the two cards you got wrong, or the two you found hardest. State in one sentence what the card was testing.
3. **Second run (4 min)**: Press Reset and go again. The cards are reshuffled. Aim for twelve out of twelve, and be able to say the rule out loud before each drop.

### Assessment
- Applies the number-and-unit rule rather than guessing from how technical the sentence sounds.
- Correctly classifies "The temperature is 25." as an observation and explains why.
- Accepts that a qualitative observation can be skilled and useful and still not be data.

## References

1. [WMO-No. 8, *Guide to Instruments and Methods of Observation*](https://library.wmo.int/idurl/4/68695) - the international standard for what counts as an observation.
2. [NIST Special Publication 811, *Guide for the Use of the International System of Units*](https://www.nist.gov/pml/special-publication-811) - why a number without a unit means nothing.
3. [Wikipedia: Level of measurement](https://en.wikipedia.org/wiki/Level_of_measurement)
4. [Wikipedia: Beaufort scale](https://en.wikipedia.org/wiki/Beaufort_scale) - the trained-eye scale behind the "bending small trees" card.
