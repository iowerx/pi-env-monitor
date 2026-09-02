---
title: Humidity, Three Ways
description: Lock the water content, change only the temperature, and watch relative humidity climb to 100 per cent while the dew point does not move at all.
image: /sims/humidity-three-ways/humidity-three-ways.png
og:image: /sims/humidity-three-ways/humidity-three-ways.png
twitter:image: /sims/humidity-three-ways/humidity-three-ways.png
social:
   cards: false
quality_score: 0
---

# Humidity, Three Ways

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Humidity, Three Ways MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This is the chapter's central confusion and it survives ordinary explanation. Students
believe that cooling air "squeezes the water out" of it. The demonstration that settles the
matter is to freeze the water and move the limit instead.

The parcel on the left has a countable number of water molecules and a red **capacity
line** whose height is the saturation limit at the current temperature. Change the
temperature and only the line moves. The molecules stay exactly where they are, and the
caption says so: *water content unchanged, capacity changed.*

Three readouts update together, each with a sparkline of the last minute:

- **Absolute humidity** - grams of water in a cubic metre.
- **Relative humidity** - how full the parcel is, as a percentage of what it could hold.
- **Dew point** - the temperature at which the capacity line would come down to meet the
  water.

Keep the water locked and cool the air, and the first and third barely move while the
second climbs to 100 per cent. Then the capacity line reaches the water and condensation
begins: droplets appear and water starts leaving the air.

Three presets:

- **Overnight cooling** - 25 °C with a dew point of 15 °C. Relative humidity starts at
  53.9 per cent and reaches 100 with nothing added. This is how dew forms.
- **Heated house** - outdoor air at 0 °C and 80 per cent, warmed to 21 °C indoors. Relative
  humidity collapses to 19.7 per cent. Nothing dried the air. You warmed it.
- **Two 50 per cent days** - 31.7 °C and 5.6 °C, both at 50 per cent relative humidity,
  with dew points of 20 °C and −4 °C. Same percentage, four times the water.

One honest detail worth noticing: absolute humidity shifts by a few per cent as you change
the temperature. The water did not move. The cubic metre did - warm air expands. The dew
point does not move at all, which is exactly why it is the number worth logging.

## How to Use

- Leave **Water locked** on and drag the temperature down. Watch which readouts move and
  which do not.
- Keep cooling until the capacity line reaches the water. Read the caption.
- Press **Add water** and **Remove water** to change relative humidity the other way, and
  compare what happens to the dew point.
- Try **RH locked** instead, and see that holding the percentage fixed means the water
  content has to move.
- Work through all three presets.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/humidity-three-ways/main.html"
        height="602px"
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
- Chapter 8 sections on what water vapour is
- Reading a curve off a graph

### Activities

1. **The frozen molecules (6 min)**: With water locked, cool from 25 C to 15 C. Write down what each of the three readouts did. Which one changed the most, and why?
2. **Two routes to 100 per cent (7 min)**: Reach 100 per cent relative humidity twice: once by cooling, once by adding water. What is different about the dew point in the two cases?
3. **The two 50 per cent days (7 min)**: Press the preset. Both days read 50 per cent. Explain to someone who has not seen this why one is muggy and one is not, using the dew point.

### Assessment
- Explains why relative humidity changed when nothing was added to the air.
- States the dew point as a property of the water content alone.
- Distinguishes the three measures by saying what each one is a ratio of, or not.

## References

1. [WMO-No. 8, *Guide to Instruments and Methods of Observation*](https://library.wmo.int/idurl/4/68695) - the measurement of humidity, and which quantity to report.
2. [Alduchov and Eskridge (1996), improved Magnus form approximation](https://doi.org/10.1175/1520-0450(1996)035%3C0601:IMFAOS%3E2.0.CO;2) - the saturation vapour pressure formula used here.
3. [Wikipedia: Dew point](https://en.wikipedia.org/wiki/Dew_point)
4. [Wikipedia: Relative humidity](https://en.wikipedia.org/wiki/Relative_humidity)
