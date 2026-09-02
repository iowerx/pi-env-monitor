---
title: Transduction Mechanism Matcher
description: Join each physical property to the material mechanism that senses it and the electrical output it produces, with hints that name the missing idea rather than the answer.
image: /sims/transduction-mechanism-matcher/transduction-mechanism-matcher.png
og:image: /sims/transduction-mechanism-matcher/transduction-mechanism-matcher.png
twitter:image: /sims/transduction-mechanism-matcher/transduction-mechanism-matcher.png
social:
   cards: false
quality_score: 0
---

# Transduction Mechanism Matcher

<iframe src="main.html" height="508px" width="100%" scrolling="no"></iframe>

[Run the Transduction Mechanism Matcher MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Every measurement chapter in this book introduces a mechanism in isolation. This assembles
all five into one picture early, so that when Chapter 7 introduces the piezoresistive
effect you recognise it as one branch of a structure you have already seen.

A sensor is not a black box. It is a three-link chain:

**physical property → material change → electrical output**

Build all five chains:

| Property | Mechanism | Output | Chapter |
|---|---|---|---|
| Temperature | Diode voltage shift | Voltage change | 6 |
| Pressure | Piezoresistive effect | Resistance change | 7 |
| Humidity | Capacitance change | Capacitance change | 8 |
| Light | Photoelectric effect | Current generated | 9 |
| Acceleration | MEMS proof mass on springs | Capacitance change | 11 |

Two of these live inside the single BME280 chip you will wire up in Chapter 12, which is
worth noticing: one part, two entirely different physical mechanisms.

Get a link wrong and it springs back with a hint. The hints are written to name the idea
you are missing, never the answer - *"Water vapour soaks into a polymer film between two
electrodes. What does that change about the gap?"* - so the task stays diagnostic instead
of degenerating into trial and error.

## How to Use

- **Click** a physical property, then the mechanism, then the output. Or **drag** from one
  card to the next if you prefer; both work.
- Correct chains lock together, turn green, and show the explanation with its chapter
  reference. Click a completed property again to re-read its explanation.
- A wrong link springs back with a hint. Read it before guessing again.
- **Show me one** completes a single chain as a worked example if you are stuck.
- **Reset** reshuffles all three columns.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/transduction-mechanism-matcher/main.html"
        height="508px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
15-20 minutes

### Bloom's Taxonomy Level
Analyze (L4)

### Prerequisites
- Chapter 4 sections on what transduction means

### Activities

1. **Prediction (4 min)**: Before clicking anything, write down which mechanism you think goes with each property. Then test your list.
2. **Exploration (8 min)**: Complete all five chains. For each wrong link, write down the hint and what it told you that you did not already know.
3. **Synthesis (6 min)**: Two chains end in the same electrical output. Which two, and why does that not make the sensors interchangeable?

### Assessment
- Attributes each sensor to its physical mechanism without prompting.
- Describes a sensor as a three-link chain rather than a black box.
- Explains why two sensors can share an output type and still measure different things.

## References

1. [Wikipedia: Transducer](https://en.wikipedia.org/wiki/Transducer)
2. [Wikipedia: Piezoresistive effect](https://en.wikipedia.org/wiki/Piezoresistive_effect) - the pressure mechanism, covered in Chapter 7.
3. [Wikipedia: Microelectromechanical systems](https://en.wikipedia.org/wiki/Microelectromechanical_systems) - the proof mass behind Chapter 11.
4. [Bosch Sensortec BME280 datasheet](https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/) - three of these mechanisms in one package.
