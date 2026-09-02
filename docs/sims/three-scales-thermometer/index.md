---
title: Three Scales Thermometer
description: Fahrenheit, Celsius and kelvin on one shared physical column, with a difference mode that shows why 5 degrees of warming is 9 Fahrenheit degrees and not 41.
image: /sims/three-scales-thermometer/three-scales-thermometer.png
og:image: /sims/three-scales-thermometer/three-scales-thermometer.png
twitter:image: /sims/three-scales-thermometer/three-scales-thermometer.png
social:
   cards: false
quality_score: 0
---

# Three Scales Thermometer

<iframe src="main.html" height="610px" width="100%" scrolling="no"></iframe>

[Run the Three Scales Thermometer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students memorise the formula and still cannot say why 5 °C of warming is not 41 °F of
warming. The formula hides the reason. A shared physical column does not.

All three scales run alongside **one** column here, aligned to the same physical
temperature. Two dashed guides cross the whole thing at 0 °C = 32 °F = 273.15 K and at
100 °C = 212 °F = 373.15 K. Look at where each scale puts its own zero: Celsius and kelvin
have the same size degree and different zeros, Fahrenheit has a different size degree *and*
a different zero.

Everything is stored internally in kelvin and derived from there, so the three readouts
cannot drift out of agreement with each other.

**Value mode** converts a temperature and shows the arithmetic one step at a time - the
multiplication by 9/5 on its own line, then the addition of 32 on the next.

**Difference mode** adds a second marker and reports the gap between them in all three
units. Both Fahrenheit numbers carried the same +32, so it cancelled, and the panel says so
explicitly. This is the misconception that otherwise stays invisible until it turns up in a
student's own data.

Ten named temperatures are one click away, from absolute zero to boiling. Try dragging
below 0 K and the sim will stop you: there is no temperature below absolute zero, because
atoms cannot move less than not at all.

## How to Use

- **Drag the marker** on the column, or type into any of the three boxes at the bottom.
  The other two follow.
- Click a **named temperature** in the left list to jump there.
- Press **Switch to difference mode** and drag both markers. Read the difference in all
  three units, then read why the Fahrenheit number is what it is.
- Try to drag below absolute zero.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/three-scales-thermometer/main.html"
        height="610px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
15-20 minutes

### Bloom's Taxonomy Level
Apply (L3)

### Prerequisites
- Multiplying by a fraction
- Adding and subtracting negative numbers

### Activities

1. **Alignment (5 min)**: In value mode, find where 0 C sits and where 0 F sits. They are not the same height. Explain what that means about the two scales.
2. **Convert (6 min)**: Cover the panel. For 25 C, 100 F and 200 K, work out the other two units yourself, then check.
3. **The difference (8 min)**: Switch to difference mode. Put A at 20 C and B at 25 C. Predict the Fahrenheit difference before you look. Then explain, in one sentence, where the 32 went.

### Assessment
- Converts in both directions between all three scales.
- Explains why kelvin and Celsius differences are numerically identical.
- States that a temperature difference does not take the +32 offset.

## References

1. [BIPM, *The International System of Units (SI)*](https://www.bipm.org/en/publications/si-brochure) - the definition of the kelvin.
2. [NIST: temperature and the kelvin](https://www.nist.gov/si-redefinition/kelvin) - what the 2019 redefinition changed and what it did not.
3. [Wikipedia: Absolute zero](https://en.wikipedia.org/wiki/Absolute_zero)
4. [Wikipedia: Fahrenheit](https://en.wikipedia.org/wiki/Fahrenheit) - where the odd zero point came from.
