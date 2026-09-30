---
title: Sampling Interval Trade-off Bench
description: The same event captured at six intervals, with the cost of each, and a verdict that changes when you change the purpose.
image: /sims/sampling-interval-bench/sampling-interval-bench.png
og:image: /sims/sampling-interval-bench/sampling-interval-bench.png
twitter:image: /sims/sampling-interval-bench/sampling-interval-bench.png
social:
   cards: false
quality_score: 0
---

# Sampling Interval Trade-off Bench

<iframe src="main.html" height="654px" width="100%" scrolling="no"></iframe>

[Run the Sampling Interval Trade-off Bench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Sampling interval is the first genuine engineering trade in this project, and students
default to either "as fast as possible" or "whatever the tutorial said". Neither is a
decision.

The top panel is the **true signal**, computed as a continuous function so it is exact at
any instant, with the interesting event shaded. The middle panel is **what the CSV actually
contains** at the chosen interval, joined by straight lines — the reconstruction anybody
reading your file would see. The difference between those two panels is what your interval
threw away.

The results are not subtle:

| Scenario | 10 s | 1 min | 5 min | 15 min |
|---|---|---|---|---|
| Cold front, 8 min | captured | **captured** (9 samples) | blurred (2) | blurred (1) |
| Gust, 30 s | captured (3) | blurred (1) | blurred (1) | **missed** |
| Cloud shadow, 90 s | captured (9) | blurred (1) | blurred (1) | **missed** |
| P wave, under 1 s | **missed** | missed | missed | missed |

The P wave is missed by everything down to one second and is only captured at 100 samples
per second, which is exactly why the chapter's table puts ground motion in a category of
its own.

**The purpose selector is the whole point.** One minute is *adequate* for detecting frontal
passages, *marginal* for solar panel sizing if you care about individual clouds, and *not
adequate* for gust analysis or earthquake detection. Change the purpose without touching the
interval and watch the same choice become right or wrong. There is no universal answer, and
the sim refuses to imply there is one.

The cost dashboard reproduces the chapter's storage table exactly — 1,440 readings and 86 KB
a day at one minute, 31.5 MB a year — and reports honestly on power: the incremental cost of
logging is **under a tenth of a per cent** of what the Pi itself draws, right up until you
reach 100 samples per second, where it more than doubles the budget. Storage is not the
constraint and neither is power. **Card wear is.**

**Thin 100 Hz data to this interval** draws the averaged-down series over the reconstruction,
which establishes the asymmetry that should decide the matter whenever you are unsure: *you
can always thin dense data later, and you can never recover detail you never captured.*

## How to Use

- Pick a **scenario**, then step the **interval** from 100 per second to 15 minutes and watch the middle panel lose the event.
- Change the **purpose** without touching the interval. The verdict flips.
- Press **Fastest that fits the purpose** to see the defensible choice for each job.
- Read the cost table in the verdict panel: every interval, its yearly volume, and whether it fits.
- Press **Thin 100 Hz data to this interval** and compare the averaged series with the sampled one.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/sampling-interval-bench/main.html"
        height="654px"
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
- Chapter 14 sections on sampling interval, storage and SD card endurance
- Chapter 10 on gusts, Chapter 11 on P waves, Chapter 9 on passing cloud

### Activities

1. **Lose the event (7 min)**: For the gust front, record the sample count inside the gust at every interval. At which interval does it stop being describable, and at which does it vanish?
2. **One interval, five verdicts (8 min)**: Fix the interval at 1 minute and cycle through all five purposes. Write down which are adequate and why the answer differs.
3. **Defend a choice (8 min)**: Choose an interval for your own station and write three sentences justifying it against detail captured, yearly data volume, and card wear.

### Assessment
- Justifies a sampling interval against a stated purpose rather than in the abstract.
- Identifies an event that a given interval misses entirely.
- States the asymmetry between thinning data and recovering detail.

## References

1. [Wikipedia: Nyquist-Shannon sampling theorem](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem) - the formal statement of what a sampling interval can and cannot capture.
2. [WMO Guide to Instruments and Methods of Observation](https://library.wmo.int/idurl/4/68695) - the standard averaging and reporting intervals for each quantity.
3. [Wikipedia: Flash memory - write endurance](https://en.wikipedia.org/wiki/Flash_memory#Write_endurance) - why sampling faster than you need costs card life.
4. [Wikipedia: Aliasing](https://en.wikipedia.org/wiki/Aliasing) - what happens to a signal sampled too slowly.
