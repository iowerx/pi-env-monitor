---
title: Solar Constant to Ground: Where the Energy Goes
description: Follow 1361 W/m2 down through the atmosphere, losing a named and quantified amount at every stage, until you arrive at whatever your station actually reads.
image: /sims/solar-energy-budget/solar-energy-budget.png
og:image: /sims/solar-energy-budget/solar-energy-budget.png
twitter:image: /sims/solar-energy-budget/solar-energy-budget.png
social:
   cards: false
quality_score: 0
---

# Solar Constant to Ground: Where the Energy Goes

<iframe src="main.html" height="632px" width="100%" scrolling="no"></iframe>

[Run the Solar Constant to Ground: Where the Energy Goes MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A student reads that the solar constant is 1361 W/m2, measures 700 at their own station,
and concludes the sensor is broken. It is not. Every missing watt has a name.

An incoming beam whose **width is its power** enters at the top of the atmosphere and
narrows once at each loss. Each loss branches off as its own labelled arrow, and a running
budget beside it prints the total in W/m2 after every stage:

1. **The angle.** Multiply by cos(z). This is almost always the biggest single loss.
2. **Absorption** by ozone, water vapour and carbon dioxide.
3. **Scattering** - which is also why the sky is blue.
4. **Cloud**, by type and coverage.
5. At the ground, the remainder splits into what the surface **reflects** and what it
   **absorbs**, set by the albedo.

Set the zenith angle to exactly 60 degrees and the beam power halves, because cos(60°) is
0.5. The same beam is spread over twice the ground area. That is why winter is cold and why
sunrise is dim - **not** distance from the Sun.

The **air mass** readout is how many atmospheres of path the beam crosses: 1.0 straight
overhead, 2.0 at 60 degrees, and nearly 38 at the horizon. Absorption and scattering both
scale with it, which is why the losses grow so fast as the Sun gets low.

**Match reading** is the inverse problem, and it is the actual skill. Type in an irradiance
you measured and the sim solves for the cloud cover that would explain it at the current
angle - or tells you no amount of cloud can, and how much higher the Sun would have had to
be. Either way you end up with an account of your own number.

Every coefficient is a named constant in one place in the source, so the budget is
auditable rather than magic.

## How to Use

- Drag the **zenith angle**. Watch the beam narrow and the first budget line change. Stop
  at 60 degrees and read the caption.
- Add **cloud cover** and change the cloud type. Compare thin cirrus with thick overcast at
  the same coverage.
- Change the **surface** and watch the split at the bottom. Fresh snow sends 85 per cent
  straight back.
- Type your own measured irradiance into the box and press **Match reading**.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/solar-energy-budget/main.html"
        height="632px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Analyze (L4)

### Prerequisites
- Knowing what a cosine is
- Chapter 9 sections on the solar constant

### Activities

1. **The angle alone (6 min)**: With no cloud, record the ground irradiance at 0, 30, 60 and 80 degrees. Which loss grows fastest, and why does it accelerate?
2. **Account for a real number (8 min)**: Pick an irradiance between 200 and 900 W/m2 and use Match reading to explain it. Write one sentence attributing it to angle and cloud.
3. **Albedo (6 min)**: Fix everything except the surface and cycle through all six. How much more energy does asphalt absorb than fresh snow, and what does that imply about a station sited over each?

### Assessment
- Attributes a measured irradiance to named causes with numbers attached.
- Explains why air mass matters and why it grows non-linearly.
- States that a low reading is usually geometry and weather rather than a fault.

## References

1. [NASA: solar irradiance and the solar constant](https://science.nasa.gov/sun/) - where the 1361 W/m2 figure comes from and how it is measured.
2. [Kasten and Young (1989), revised optical air mass tables](https://doi.org/10.1364/AO.28.004735) - the air mass formula used here.
3. [NREL: Bird clear-sky model](https://www.nrel.gov/grid/solar-resource/clear-sky.html) - a full version of this budget.
4. [Wikipedia: Albedo](https://en.wikipedia.org/wiki/Albedo) - the surface values in the selector.
