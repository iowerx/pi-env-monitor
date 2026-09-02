---
title: GPS Trilateration Explorer
description: Turn satellites on one at a time and watch the possible positions collapse, then break the receiver clock and discover why three satellites are not enough.
image: /sims/gps-trilateration-explorer/gps-trilateration-explorer.png
og:image: /sims/gps-trilateration-explorer/gps-trilateration-explorer.png
twitter:image: /sims/gps-trilateration-explorer/gps-trilateration-explorer.png
social:
   cards: false
quality_score: 0
---

# GPS Trilateration Explorer

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the GPS Trilateration Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The four-satellite requirement is the most counter-intuitive fact about GPS, and being
told "the clock is a fourth unknown" almost never lands. This lets you watch it happen.

Turn satellites on one at a time:

- **One satellite.** You are somewhere on this circle. Infinitely many possible positions.
- **Two.** The circles cross at two points. Two possible positions, and no way to choose.
- **Three.** One position - *if the receiver clock were perfect.*

Then move the **clock error** slider. Every satellite is now reporting a distance that is
too long by the same amount, all three circles grow together, and they stop meeting at a
point. There is nothing in the picture that tells you by how much you are wrong.

Press **Solve clock error** and the receiver stops assuming its clock is right and treats
the error as an unknown to be found. It recovers the clock error to a fraction of a
microsecond and the position to a few metres.

Two things make this readable:

- A **magnified inset**. One microsecond is 300 metres, which is invisible on a view 60 000
  kilometres across. The inset rescales itself, from tens of metres when the clock is right
  to kilometres when it is not.
- The **satellite panel** shows the actual arithmetic: broadcast time, arrival time, travel
  time in milliseconds, distance in kilometres. Distance is travel time times the speed of
  light, and the clock error is sitting inside every one of those distances.

**Good geometry** and **Poor geometry** change nothing about the number of satellites and a
great deal about the answer. Clustered satellites make lines that cross at shallow angles,
and the uncertainty region stretches out. This is dilution of precision, and it is why a
receiver in a narrow street struggles.

This is deliberately drawn in two dimensions, which means three unknowns: x, y and the
clock. The real world has four - x, y, z and the clock - which is exactly why GPS needs
four satellites and not three.

## How to Use

- Press **S1** to **S6** to turn satellites on and off. Start with one and add them one at
  a time, reading the message each time.
- **Drag the receiver** anywhere in the dark view. Every distance and time recomputes.
- Move the **Clock error** slider with three satellites active. Watch the inset.
- Turn on a fourth and press **Solve clock error**.
- Compare **Good geom.** and **Poor geom.** with the clock error at zero, and watch the
  uncertainty triangle in the inset change shape.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/gps-trilateration-explorer/main.html"
        height="582px"
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
- Knowing that light travels at a finite, known speed
- Reading a distance off a scale

### Activities

1. **Collapse the possibilities (6 min)**: Start from one satellite and add them one at a time. Write down, in your own words, what each new satellite rules out.
2. **Break the clock (8 min)**: With three satellites, set the clock error to one microsecond. Look at the inset. Explain why you cannot tell from the picture how wrong the clock is.
3. **Geometry (8 min)**: Set the clock error to zero, turn on four satellites, and switch between Good and Poor geometry. Describe the shape of the uncertainty region in each case, and say which one you would rather have.

### Assessment
- Explains what each additional satellite rules out.
- States why the receiver clock is an unknown rather than a known.
- Connects satellite spread to position accuracy without using the phrase dilution of precision.

## References

1. [GPS.gov: how GPS works](https://www.gps.gov/systems/gps/) - the official US government description.
2. [Wikipedia: Trilateration](https://en.wikipedia.org/wiki/Trilateration)
3. [Wikipedia: Dilution of precision (navigation)](https://en.wikipedia.org/wiki/Dilution_of_precision_(navigation)) - the good and poor geometry presets.
4. [Misra and Enge, *Global Positioning System: Signals, Measurements, and Performance*](https://en.wikipedia.org/wiki/Global_Positioning_System) - the standard graduate treatment of the clock-bias unknown.
