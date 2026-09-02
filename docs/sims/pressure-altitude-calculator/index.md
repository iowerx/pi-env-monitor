---
title: Pressure and Altitude Calculator
description: Correct a station reading to sea level, see it in five units at once, and settle whether a difference between two stations is weather or geography.
image: /sims/pressure-altitude-calculator/pressure-altitude-calculator.png
og:image: /sims/pressure-altitude-calculator/pressure-altitude-calculator.png
twitter:image: /sims/pressure-altitude-calculator/pressure-altitude-calculator.png
social:
   cards: false
quality_score: 0
---

# Pressure and Altitude Calculator

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the Pressure and Altitude Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The elevation correction is the most consequential arithmetic in this chapter. Get it
wrong and your pressure data is incomparable with anyone else's, including your own from
the day you moved the station.

The chapter's rule is one hectopascal per 8.3 metres. The panel works it through:
**995 hPa measured at 152 m → 152 / 8.3 = 18.3 hPa → 1013.3 hPa at sea level.** The result
appears simultaneously in hPa, mbar, inHg, Pa and atm, because you will meet all five.

Drag the marker up to Denver and the correction is 194 hPa. To Mexico City and it is 270.
Ordinary weather moves sea level pressure across a range of about 60 hPa in total. The
correction is four times larger than the entire signal you are trying to measure, which is
why it is not optional.

**Two-station mode** is where the real skill lives. Set an elevation and a weather value
for each station and the panel separates the raw difference into the part elevation
explains and the part that is genuine weather. The default case is the one worth sitting
with: station B reads 28 hPa lower, elevation accounts for 36 hPa, and after correction B
is actually 8 hPa *higher*. The apparent storm was geography, and it pointed the wrong way.

**Altimeter mode** turns the same arithmetic into an aviation problem. An altimeter is a
barometer with an altitude scale, and it only tells the truth if the sea level pressure
dialled into it matches reality. Set it in a high-pressure region, fly into a low one
without resetting, and the instrument reads high while you fly low. *High to low, look out
below.*

A toggle switches between the linear rule and the full barometric formula, so you can see
how much the shortcut costs. Near sea level, almost nothing. At 2,240 m, about 28 hPa.

## How to Use

- **Drag the station marker** on the altitude column, or use the preset chips for Death
  Valley, a coastal town, Denver and Mexico City.
- Read the worked correction in the middle panel and the five units on the right.
- Press **Two stations**, then use **Editing A / Editing B** to give each station its own
  elevation and its own weather. Read the verdict.
- Press **Altimeter**, then drag the sea level slider down as though you were flying into a
  low-pressure region.
- Toggle **Linear / Exact** at high elevation and see how much the shortcut costs.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/pressure-altitude-calculator/main.html"
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
Apply (L3)

### Prerequisites
- Dividing decimals
- Chapter 2 on unit conversion

### Activities

1. **Correct one station (6 min)**: Set the elevation to your own town. Work out the correction by hand before reading it, then check.
2. **Feel the size of it (5 min)**: Record the correction at sea level, Denver and Mexico City. Compare the largest with the 60 hPa total range of ordinary weather. Write one sentence about why the correction is not optional.
3. **Weather or geography (10 min)**: In two-station mode, build a case where the raw readings suggest one station is in a storm and the corrected readings say the opposite. Explain it to someone else.

### Assessment
- Computes a sea level correction from an elevation without prompting.
- Decomposes a two-station difference into elevation and weather.
- Explains why an altimeter set to the wrong pressure is dangerous in one direction more than the other.

## References

1. [WMO-No. 8, *Guide to Instruments and Methods of Observation*](https://library.wmo.int/idurl/4/68695) - the standard procedure for reduction to sea level.
2. [Wikipedia: Barometric formula](https://en.wikipedia.org/wiki/Barometric_formula) - the exact version behind the toggle.
3. [Wikipedia: Altimeter setting](https://en.wikipedia.org/wiki/Altimeter_setting) - QNH, QFE and why pilots reset on the way.
4. [NOAA National Weather Service glossary](https://www.weather.gov/) - altimeter setting and sea level pressure as reported.
