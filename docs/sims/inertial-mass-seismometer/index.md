---
title: Inertial Mass Seismometer
description: Ground position, mass position and their difference on screen at once - then stiffen the spring until the recording disappears.
image: /sims/inertial-mass-seismometer/inertial-mass-seismometer.png
og:image: /sims/inertial-mass-seismometer/inertial-mass-seismometer.png
twitter:image: /sims/inertial-mass-seismometer/inertial-mass-seismometer.png
social:
   cards: false
quality_score: 0
---

# Inertial Mass Seismometer

<iframe src="main.html" height="660px" width="100%" scrolling="no"></iframe>

[Run the Inertial Mass Seismometer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Everyone accepts "the mass stays still" and almost nobody asks when that is true. It is
true only for ground motions **faster than the suspension's own natural period**, and the
fastest way to understand that is to break it.

The cutaway carries two vertical references. The blue one is fixed in space and never
moves. The dashed one is the centre of the instrument case, which is bolted to the bedrock
and moves with it. The gap between them is the ground displacement, and the suspended mass
sits on the blue line, barely moving at all. **The difference between the mass and the
case is the only thing a seismometer can record**, and the panel prints all three numbers
at once so you can subtract them yourself.

The mass is a damped harmonic oscillator driven by the frame, integrated with a small
fixed timestep. The response curve underneath shows what fraction of the ground
displacement survives as relative motion, at every period from 0.05 to 100 seconds, with
the suspension period and the current ground period both marked.

**The failure case is the lesson.** Push the stiffness slider to maximum. The natural
period drops to about 0.1 s, the mass starts moving with the case, and the recorded trace
collapses to roughly **three per cent** of what it was. The panel says why: *a stiff
suspension makes the mass follow the ground; there is no relative motion left to record.*
That is the whole argument for soft suspensions and heavy masses, and it is much more
convincing after you have destroyed the instrument yourself.

Other things worth trying:

- **Slow tilt (landslide)**, a 40 second period, records almost nothing even on a soft
  suspension. Slow ground motion is invisible to this design.
- **Damping** at 0.05 makes the trace ring on for cycles after the shaking stops. Those
  rings are instrument behaviour, not aftershocks, and they appear in real seismograms.
  0.7 is the standard choice.
- **Force feedback mode** locks the mass with a coil and outputs the holding current
  instead. The relative motion goes to exactly zero, and the response curve goes flat.

## How to Use

- Pick a **ground motion**, then compare the Ground, Mass and Relative numbers.
- Push **Stiffness** all the way right and watch the trace collapse. This is the point.
- Set **Damping** to its lowest value and look for the ringing after each burst.
- Turn on **Force feedback mode** and watch the response curve become a flat line.
- Choose **Manual shake** and drag the bedrock. Shake fast, then lean slowly.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/inertial-mass-seismometer/main.html"
        height="660px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Understand (L2)

### Prerequisites
- Chapter 11 sections on Zhang Heng's seismoscope and the inertial-mass principle
- Some familiarity with a mass on a spring

### Activities

1. **Subtract it yourself (5 min)**: For three different ground motions, write down Ground, Mass and Relative. Confirm that the third is the first minus the second, and say in one sentence why the pen can only draw the third.
2. **Break the instrument (8 min)**: Record the trace peak at minimum stiffness, then at maximum. Explain the ratio using the response curve rather than the words in the panel.
3. **Spot the artefact (6 min)**: Set damping to 0.05 and sketch what happens after the shaking stops. If you saw this on a real record, what might you wrongly conclude?

### Assessment
- Explains that a seismometer records relative motion, not ground motion.
- Predicts that stiffening the suspension attenuates the record, and says why.
- Distinguishes instrument ringing from real ground motion.

## References

1. [Wikipedia: Seismometer](https://en.wikipedia.org/wiki/Seismometer) - the inertial-mass principle and the instrument line from Zhang Heng to broadband sensors.
2. [Wikipedia: Harmonic oscillator](https://en.wikipedia.org/wiki/Harmonic_oscillator#Driven_harmonic_oscillators) - the driven damped oscillator this sim integrates.
3. [IRIS: How does a seismometer work?](https://www.iris.edu/hq/inclass/animation/seismometers_1_of_2) - the same cutaway, animated, from a seismology network.
4. [Wikipedia: Force feedback seismometer designs](https://en.wikipedia.org/wiki/Seismometer#Modern_instruments) - why the holding current became the output signal.
