---
title: The Longitude Problem Solver
description: Calculate longitude from the gap between local noon and a chronometer, then introduce a clock error and watch the ship slide across the ocean.
image: /sims/longitude-problem-solver/longitude-problem-solver.png
og:image: /sims/longitude-problem-solver/longitude-problem-solver.png
twitter:image: /sims/longitude-problem-solver/longitude-problem-solver.png
social:
   cards: false
quality_score: 0
---

# The Longitude Problem Solver

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the The Longitude Problem Solver MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The link between clocks and position is the conceptual key to both Harrison's
chronometer and the GPS receiver on your station, and students find it genuinely
surprising the first time.

Here is the whole idea. The Sun tells you when it is noon *where you are*. Your
chronometer tells you what time it is *in Greenwich*. The gap between those two is your
longitude, at fifteen degrees per hour.

Drag the ship anywhere on the map and both clocks follow. The panel works the arithmetic
through in full - the subtraction, the conversion to decimal hours, the multiplication by
15 degrees per hour - and drops a marker where the calculation says you are.

Then move the **clock error** slider, and only the calculated marker moves. A hundred
kilometres is about one pixel on a world map, so a magnified inset shows the two markers
at a readable scale with a kilometre bar.

Three presets:

- **H4, 1761** - Harrison's fourth timekeeper lost about five seconds over 81 days at sea.
  Look at the inset. The error is there; it is just very small.
- **Pendulum** - a pendulum clock keeps beautiful time on land and useless time on a
  rolling deck. Five minutes out is an ordinary day.
- **Scilly, 1707** - four ships lost off the Isles of Scilly: Association, Eagle, Romney,
  Firebrand. Historians now blame dead reckoning and weather as much as longitude, but the
  disaster is what prompted the Longitude Act seven years later.

Drag the ship north and watch the error budget shrink. One minute of clock error is always
a quarter of a degree of longitude, but a degree of longitude is 111 km at the equator and
about 72 km at 50 degrees north. That cosine is why the problem was hardest exactly where
the trade routes ran.

## How to Use

- **Drag the blue marker** to move the ship. Both clocks and the whole calculation update.
- Move the **Clock error** slider. Only the orange marker moves - the ship has not gone
  anywhere, your idea of where it is has.
- Watch the **zoomed inset** in the corner of the map. It rescales itself, so a five-second
  error and a five-minute error are both visible.
- Press the preset buttons and read the captions.
- Drag the ship far north, then far south, keeping the clock error fixed. Read the last
  line of the panel each time.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/longitude-problem-solver/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Apply (L3)

### Prerequisites
- Multiplying decimals
- Knowing that the Earth turns once in 24 hours

### Activities

1. **Derive the rule (5 min)**: The Earth turns 360 degrees in 24 hours. How many degrees per hour is that? Check your answer against the number the sim uses.
2. **Calculate (8 min)**: Set the clock error to zero and drag the ship to three different longitudes. For each, cover the panel, work out the longitude from the two clock faces yourself, then uncover it and check.
3. **Evaluate the cost (8 min)**: Set the clock error to one minute. Record the position error at the equator, at 30 degrees north, and at 60 degrees north. Explain the pattern. Then press H4, 1761 and say why the Board of Longitude was satisfied.

### Assessment
- Converts a time difference into a longitude without being given the 15 degrees per hour rule.
- Predicts the direction the calculated position moves when the chronometer runs fast.
- Explains why the same clock error matters less at high latitude.

## References

1. [Dava Sobel, *Longitude* (1995)](https://en.wikipedia.org/wiki/Longitude_(book)) - the standard popular account of Harrison and the Board of Longitude.
2. [Royal Museums Greenwich: Harrison's timekeepers](https://www.rmg.co.uk/stories/topics/harrisons-clocks-longitude-problem) - H1 to H4, and what they were actually tested against.
3. [Wikipedia: History of longitude](https://en.wikipedia.org/wiki/History_of_longitude)
4. [Wikipedia: Scilly naval disaster of 1707](https://en.wikipedia.org/wiki/Scilly_naval_disaster_of_1707) - including the modern reassessment of the cause.
