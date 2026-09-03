---
title: Early Warning Race - P Wave Versus Alert
description: Three things race outward from one rupture, and the city that needs warning most is the one that gets none.
image: /sims/early-warning-race/early-warning-race.png
og:image: /sims/early-warning-race/early-warning-race.png
twitter:image: /sims/early-warning-race/early-warning-race.png
social:
   cards: false
quality_score: 0
---

# Early Warning Race - P Wave Versus Alert

<iframe src="main.html" height="636px" width="100%" scrolling="no"></iframe>

[Run the Early Warning Race MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Earthquake early warning is routinely misheard as prediction. It is not, and racing three
things across one map makes that unmistakable. A banner says so at the top of every frame:
**the earthquake has already happened; the alert is simply faster than the shaking.**

Three rings leave the epicentre. The **P wave** at 6 km/s, harmless and first. The **S
wave** at 3.5 km/s, which is the one that does the damage. And, once the nearest station
has felt the P wave and the system has spent its processing time, an **alert** that
travels at the speed of light and therefore fills the map instantly.

Four cities at 20, 50, 100 and 200 km each get a card showing when the alert reaches them,
when the shaking reaches them, the difference, and **what that many seconds actually buys**
— three seconds is getting under a table, ten is stopping the trains and closing the gas
valves, twenty-five is halting surgery, fifty is shutting down a factory line.

At the default settings the model reproduces the chapter's warning-time table closely, and
one result is the whole reason the blind zone matters:

| City | Warning |
|---|---|
| Nearport, 20 km | **none** |
| Midvale, 50 km | 7.8 s |
| Farhaven, 100 km | 22.0 s |
| Distant City, 200 km | 50.5 s |

**Nearport is the city closest to the rupture and it receives nothing at all.** The shaded
red circle is the blind zone, and it is drawn rather than described because it is the
honest limit of the technology. Drag the processing delay from 1 to 10 seconds and watch it
grow from 5 km to 47 km, swallowing Midvale on the way.

Two controls push back against it. A **denser station network** detects the P wave sooner,
which is exactly the argument for putting MEMS accelerometers in phones and buildings: at
the dense setting with a one-second delay, the blind zone shrinks to 5 km and even Nearport
gets 3.3 seconds. And a **deeper** earthquake gives everyone more warning, because the
waves have further to travel to reach anyone at all.

## How to Use

- Press **Play** and watch the three rings race, or drag the **Timeline** to freeze any instant.
- Move the **Processing** slider and watch the blind zone grow and shrink with it.
- Set **Stations** to Dense and **Processing** to 1 s to see the best case a real system reaches.
- Push **Depth** to 120 km and note that everybody, including Nearport, now gets warned.
- Read each city's action line, not just its number of seconds.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/early-warning-race/main.html"
        height="636px"
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
- Chapter 11 sections on P and S waves and on earthquake early warning
- Chapter 5 on trilateration, for how stations locate the epicentre

### Activities

1. **Why it is not prediction (5 min)**: Scrub to t = 0, then to the moment of detection. Write two sentences explaining what has already happened by the time any alert exists.
2. **Grow the blind zone (8 min)**: Record the blind zone radius at processing delays of 1, 3, 5 and 10 seconds. Which cities fall inside at each? What would it take to remove it entirely?
3. **Judge the system (7 min)**: For each city, decide whether its warning time is useful, and justify the answer using the action line rather than the number. Then argue for or against funding a denser network.

### Assessment
- Explains that early warning detects an earthquake in progress rather than predicting one.
- Computes warning time as S wave arrival minus alert time.
- Justifies why a blind zone exists and cannot be eliminated.

## References

1. [USGS ShakeAlert](https://www.usgs.gov/programs/earthquake-hazards/shakealert) - the US West Coast system, live since 2019.
2. [Wikipedia: Earthquake early warning system](https://en.wikipedia.org/wiki/Earthquake_early_warning_system) - Japan's nationwide system, Mexico's SASMEX, and the blind zone.
3. [Wikipedia: Seismic wave](https://en.wikipedia.org/wiki/Seismic_wave) - P and S wave speeds in the crust.
4. [Japan Meteorological Agency: Earthquake Early Warning](https://www.jma.go.jp/jma/en/Activities/eew.html) - the system that has been running since 2007.
