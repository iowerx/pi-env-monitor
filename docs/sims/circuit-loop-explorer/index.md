---
title: Circuit Loop and the Missing Ground
description: Open either wire of a simple sensor circuit and watch the charge stop moving. The missing-ground fault, made visible before you meet it on a real bench.
image: /sims/circuit-loop-explorer/circuit-loop-explorer.png
og:image: /sims/circuit-loop-explorer/circuit-loop-explorer.png
twitter:image: /sims/circuit-loop-explorer/circuit-loop-explorer.png
social:
   cards: false
quality_score: 0
---

# Circuit Loop and the Missing Ground

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Circuit Loop and the Missing Ground MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The missing ground is the most common wiring error in this book, and on a real bench it
is invisible. Both wires look connected. The sensor just misbehaves.

Here you can break it deliberately. Three switches open and close each connection, and
everything downstream of the break greys out while the readout panel tells you exactly
what a multimeter would:

- **Both wires connected:** 3.3 V across the sensor, 0.9 mA, reading normally.
- **Ground open:** voltage undefined, 0 mA, *"sensor is unpowered even though the red wire
  is still connected."* This is the sentence worth remembering.
- **Power open:** the same result from the other side. Either break stops the circuit; it
  makes no difference which one you cut.
- **Ground loose:** the contact makes and breaks on its own and the readings flicker. This
  is what a loose ground looks like, and it is much harder to diagnose than a clean break.

The charge dots are the only moving thing on screen, and they are moving for a reason:
they stop dead the instant the loop opens. That is the visual correlate of "current
stops", and without it the claim is just words.

Switching the supply to **5 V** turns the sensor red. A 3.3 V part on a 5 V supply is how
sensors die, and it is worth seeing that happen somewhere it costs nothing.

## How to Use

- Untick **Ground wire connected** and read the panel. The red wire is still red, still
  connected, and the sensor is still dead.
- Reconnect it, then untick **Power wire connected**. Compare the two results.
- Tick **Ground wire is loose** and watch for ten seconds without touching anything.
- Change **Supply** to 5 V. Read the warning, then put it back.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/circuit-loop-explorer/main.html"
        height="502px"
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
- Knowing that electricity needs somewhere to go
- Chapter 3 sections on voltage and current

### Activities

1. **Prediction (3 min)**: Before opening anything, predict what happens if you disconnect only the black wire and leave the red one in place. Write it down, then test it.
2. **Exploration (6 min)**: Produce all four states: both connected, ground open, power open, ground loose. Say out loud what a person at the bench would actually observe in each case.
3. **Transfer (6 min)**: Your sensor gives a reading, then nothing, then a reading again, with nobody touching it. Which of the four states is that, and which wire would you check first?

### Assessment
- States that current requires a complete loop and names both wires as equally necessary.
- Predicts that a sensor with power but no ground reads nothing at all.
- Recognises intermittent readings as the signature of a loose connection rather than a broken sensor.

## References

1. [Raspberry Pi documentation: GPIO](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#gpio) - pin voltages and what the header can and cannot survive.
2. [All About Circuits, *Volume I - Direct Current*](https://www.allaboutcircuits.com/textbook/direct-current/) - a free, careful treatment of the complete-circuit idea.
3. [Wikipedia: Ground (electricity)](https://en.wikipedia.org/wiki/Ground_(electricity))
4. [Wikipedia: Open-circuit voltage](https://en.wikipedia.org/wiki/Open-circuit_voltage)
