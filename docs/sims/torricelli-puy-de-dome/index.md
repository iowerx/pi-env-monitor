---
title: Torricelli and the Puy de Dome
description: Stand up a mercury column, swap the liquid for water and watch it need a ten-metre tube, then carry a barometer up a mountain and see which of two rival hypotheses survives.
image: /sims/torricelli-puy-de-dome/torricelli-puy-de-dome.png
og:image: /sims/torricelli-puy-de-dome/torricelli-puy-de-dome.png
twitter:image: /sims/torricelli-puy-de-dome/torricelli-puy-de-dome.png
social:
   cards: false
quality_score: 0
---

# Torricelli and the Puy de Dome

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the Torricelli and the Puy de Dome MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The central claim of this chapter - that air has weight - is genuinely counter-intuitive,
and intelligent people disbelieved it for two thousand years. Reading that is not the same
as watching it come out.

**Torricelli's tube** stands in a dish with a vacuum at the top, which is the part nobody
believed in. Two arrows show the force balance: the weight of the column pressing down,
the air pressing on the dish pushing up, drawn the same length because they are equal.
That equality is why the column stops where it stops.

Change the liquid and the point becomes unmissable. Water is thirteen times less dense than
mercury, so the column stands over ten metres. *That* is why the well-diggers' pumps failed
at ten metres, and why Torricelli reached for mercury.

**The Puy de Dôme.** In September 1648, at Pascal's request, Florin Périer carried a
barometer from a monastery in Clermont-Ferrand to the summit, leaving a second one behind
as a control. Drag the barometer up the slope and each stop is recorded on the graph.

The two ghost lines are the point of the whole thing. One says *air has weight*, so the
column should fall as you climb. The other says *something about the tube holds the mercury
up*, so nothing should change. Both were live hypotheses in 1648. Your own measurements
land on one of them and nowhere near the other - and that is the difference between an
experiment and a demonstration.

At the summit the sim compares your result with Périer's: he measured a drop of about
85 mm, and the model gives 88.

The **sea level pressure** slider is a foretaste of the next section. The column moves for
reasons that have nothing to do with altitude, and noticing that is what turned the
barometer into a forecasting instrument.

## How to Use

- Read the Torricelli panel first. Find the vacuum, and the two arrows.
- Change **Liquid** to Water. Note the scale change and read the caption.
- Back on mercury, drag the **Altitude** slider from sea level to the summit, pausing on
  the way. Each pause adds a point to the graph.
- Press **Show both hypotheses** and see which line your points sit on.
- Move the **Sea level** slider with the altitude fixed. The column still moves.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/torricelli-puy-de-dome/main.html"
        height="622px"
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
- Knowing that density is mass per unit volume
- Chapter 7 sections on what pressure is

### Activities

1. **Predict (4 min)**: Before touching the altitude slider, predict whether the column will rise, fall, or stay the same as you climb, and say why. Write it down.
2. **Measure (8 min)**: Take at least six measurements between sea level and the summit. Turn on the hypotheses and see which one your data supports.
3. **The liquid test (6 min)**: Switch to water and then olive oil, keeping the altitude fixed. What stays the same across all three liquids, and what changes? What does that tell you about what is actually being measured?

### Assessment
- Explains the column height as a balance between the weight of the liquid and the pressure of the air.
- Predicts the direction and rough size of the change with altitude before measuring.
- States what the Puy de Dome result ruled out, not only what it showed.

## References

1. [Wikipedia: Evangelista Torricelli](https://en.wikipedia.org/wiki/Evangelista_Torricelli)
2. [Wikipedia: Blaise Pascal](https://en.wikipedia.org/wiki/Blaise_Pascal) - including the Puy de Dome experiment of 1648.
3. [Wikipedia: Barometer](https://en.wikipedia.org/wiki/Barometer)
4. [W. E. Knowles Middleton, *The History of the Barometer* (1964)](https://en.wikipedia.org/wiki/Barometer) - the standard scholarly account of both experiments.
