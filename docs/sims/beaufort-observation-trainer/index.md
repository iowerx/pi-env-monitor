---
title: Beaufort Scale Observation Trainer
description: An animated scene where smoke, a tree, a flag, loose paper, a pond and a walker all answer to one wind speed - and you have to name the force.
image: /sims/beaufort-observation-trainer/beaufort-observation-trainer.png
og:image: /sims/beaufort-observation-trainer/beaufort-observation-trainer.png
twitter:image: /sims/beaufort-observation-trainer/beaufort-observation-trainer.png
social:
   cards: false
quality_score: 0
---

# Beaufort Scale Observation Trainer

<iframe src="main.html" height="632px" width="100%" scrolling="no"></iframe>

[Run the Beaufort Scale Observation Trainer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The Beaufort scale is this book's best example of a measurement standard that needs no
instrument, and it is also a skill you can actually use: a student whose anemometer has not
arrived can still take comparable wind observations. But you cannot learn it from the table.
The table describes motion, and motion is the one thing a table cannot show.

Six things respond at once, all driven from a **single wind-speed value**, so they can never
contradict each other:

- **Smoke** rises dead vertically at force 0, drifts at 1, bends progressively, and by force
  6 is horizontal and torn into fragments.
- **The tree** is still at 0, its leaves shake from 2, its branches work harder as the force
  climbs, twigs snap off from 8, branches from 9, and it goes over at 10.
- **The flag** hangs against its pole, lifts, extends, and then snaps and cracks.
- **Loose paper** lies still, stirs at force 4, and is picked up and blown away from 5.
- **The pond** is glassy at 0, ripples, and grows whitecaps from force 4.
- **The walker** strides normally, leans at 6, struggles at 7, and makes no headway at 8.

**Explore** lets you set any force and read its description and its speed range in m/s,
km/h, mph and knots. It also names the forces on either side, because adjacent forces are
the discrimination that is actually hard.

**Identify** hides the force, picks a random speed inside the band and asks you to classify
it, over ten rounds. The feedback names the cue that decided it: *"Look at the roof. It is
losing tiles, which rules out anything below force 9."* Learning to look for the strongest
available cue is the transferable part.

**Compare** puts two forces side by side, which is the only reliable way to tell a fresh
breeze from a strong one.

## How to Use

- Click a **force number** on the left and watch the whole scene change together.
- Step through 0 to 12 slowly. Notice which element changes most between each pair.
- Switch to **Identify** and run all ten rounds without the cheat sheet.
- Use **Compare** on pairs that fooled you, for example force 4 against force 6.
- Change the **speed unit** to see the same force in knots, which is how it is reported at sea.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/beaufort-observation-trainer/main.html"
        height="632px"
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
- Chapter 2 on ordinal scales and standardization
- Chapter 10 section on the Beaufort scale and the wind speed unit table

### Activities

1. **Walk the scale (5 min)**: Step from force 0 to force 12 one at a time and write down the first force at which each of the six elements visibly changes.
2. **Ten rounds (7 min)**: Run Identify with the cheat sheet off. Record your score and the two forces you confused most often.
3. **Go outside (5 min)**: Estimate the current Beaufort force from what you can see from a window, then convert it to a speed range in m/s and check it against a forecast.

### Activities Extension
Use **Compare** on the pair you confused, and write the one cue that separates them.

### Assessment
- Classifies a wind condition into a Beaufort force from observed effects.
- Converts a force into a speed range in m/s, km/h, mph and knots.
- Explains why the Beaufort scale is ordinal rather than interval.

## References

1. [Wikipedia: Beaufort scale](https://en.wikipedia.org/wiki/Beaufort_scale) - Francis Beaufort, the 1838 Royal Navy adoption, and the modern land descriptions.
2. [UK Met Office: Beaufort wind force scale](https://www.metoffice.gov.uk/weather/guides/coast-and-sea/beaufort-scale) - the descriptions used for the chips and the cheat sheet.
3. [NOAA National Weather Service: Beaufort wind scale](https://www.weather.gov/mfl/beaufort) - the same scale with sea state alongside.
4. [Wikipedia: Level of measurement](https://en.wikipedia.org/wiki/Level_of_measurement) - why force 8 is not twice force 4.
