---
title: Environmental Claim Checker
description: Eight environmental claims and six questions to ask of each - and one of the eight is sound, on purpose.
image: /sims/environmental-claim-checker/environmental-claim-checker.png
og:image: /sims/environmental-claim-checker/environmental-claim-checker.png
twitter:image: /sims/environmental-claim-checker/environmental-claim-checker.png
social:
   cards: false
quality_score: 0
---

# Environmental Claim Checker

<iframe src="main.html" height="678px" width="100%" scrolling="no"></iframe>

[Run the Environmental Claim Checker MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This is the transferable outcome of the entire book. Most readers will not maintain a weather
station for life; all of them will encounter environmental claims for the rest of it. Turning
the book's measurement vocabulary into a diagnostic checklist is what makes the effort pay off
beyond the project.

Six questions, asked of every claim:

1. **What exactly was measured?** Air temperature or surface temperature? Relative humidity or
   dew point? Magnitude or intensity?
2. **Where, and with what exposure?** Shielded? What was underneath it? How high?
3. **Over what period?** Is this weather or climate? One reading, one day, or thirty years?
4. **What units, and is the scale honest?** Is the axis truncated? Are the units stated?
5. **What is the uncertainty?** How many digits does the instrument's accuracy justify?
6. **Correlation or causation?** Is a physical mechanism named?

Eight claims, each styled as the medium it came from — a newspaper, a social media post, an
advertisement, an official bulletin — and each one turning on a specific chapter:

| Claim | Verdict | Decisive question |
|---|---|---|
| Hottest day ever: 47 °C, rooftop sensor | Misleading | exposure (Ch 6) |
| Temperatures SOARING, axis 14.2 to 14.6 °C | Overstated | units and scale (Ch 15) |
| Earthquake measured 6.2 on the Richter scale | Overstated | what was measured (Ch 11) |
| 995 hPa, storm warning — station at 400 m | Cannot be evaluated | exposure (Ch 7) |
| 50 per cent humidity, so half as humid | Misleading | what was measured (Ch 8) |
| Skip the sunscreen, it is cool and overcast | Misleading | what was measured (Ch 9) |
| 400 kWh a year, measured in June | Overstated | period (Ch 16) |
| **Mean temperature up 1.1 ± 0.2 °C since 1960** | **Well supported** | none |

**Case 8 is sound, and it is there on purpose.** A checker where every case is misleading
teaches cynicism rather than judgment, and recognising good evidence is half the skill. That
statement answers all six questions inside itself: what was measured, with what exposure, over
what period, in what units, with what uncertainty, and by what mechanism.

**Both halves are scored.** Getting the conclusion right by guessing does not help you with
the next claim; knowing which question failed does. The running score tracks verdicts and
per-question answers separately and tells you which of the six you most often miss.

**Rewrite it** shows the smallest change that would make each claim defensible — usually one
sentence, which is the quietly damning part.

## How to Use

- Read the claim. Set a verdict on each of the six questions **before** choosing an overall judgment.
- Submit, then read which question was decisive and the chapter it comes from.
- Press **Rewrite it** and compare the fixed version with what was published.
- Work all eight. Leave **case 8** until last.
- Watch the "you have most often missed" line. That is your weakest question.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/environmental-claim-checker/main.html"
        height="678px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
30-35 minutes

### Bloom's Taxonomy Level
Evaluate (L5)

### Prerequisites
- The whole book. Each case turns on a specific chapter's lesson.

### Activities

1. **All eight (15 min)**: Work through every claim, setting all six verdicts before submitting. Record your score and which question you missed most.
2. **Find the one sentence (8 min)**: For three misleading claims, write the single sentence that would have made each defensible. Compare with the Rewrite it version.
3. **Bring your own (10 min)**: Find a real environmental claim in today's news and run the six questions on it. Report which are answerable from the article alone.

### Assessment
- Critiques a claim against explicit criteria rather than by intuition.
- Identifies the specific question that decides each case.
- Correctly judges a well-supported claim as sound rather than applying blanket scepticism.

## References

1. [Wikipedia: Misleading graph](https://en.wikipedia.org/wiki/Misleading_graph) - the visual half of the problem.
2. [Sense about Science: Making Sense of Uncertainty](https://senseaboutscience.org/activities/making-sense-of-uncertainty/) - why a claim without an uncertainty is incomplete.
3. [WMO: what is climate, and what is weather](https://wmo.int/topics/climate) - the period question, from the body that defines it.
4. [Wikipedia: Correlation does not imply causation](https://en.wikipedia.org/wiki/Correlation_does_not_imply_causation) - the sixth question.
