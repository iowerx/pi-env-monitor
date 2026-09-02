---
title: Psychrometer Wet Bulb Bench
description: Wet the wick, watch one thermometer cool below the other, and read humidity out of the difference. In saturated air nothing happens at all, which is the proof.
image: /sims/psychrometer-wet-bulb-bench/psychrometer-wet-bulb-bench.png
og:image: /sims/psychrometer-wet-bulb-bench/psychrometer-wet-bulb-bench.png
twitter:image: /sims/psychrometer-wet-bulb-bench/psychrometer-wet-bulb-bench.png
social:
   cards: false
quality_score: 0
---

# Psychrometer Wet Bulb Bench

<iframe src="main.html" height="592px" width="100%" scrolling="no"></iframe>

[Run the Psychrometer Wet Bulb Bench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Two ordinary thermometers, one with a wet wick around its bulb. Water evaporating from the
wick takes heat with it, so the wet bulb settles below the dry bulb. How far below depends
on how fast the water can evaporate, which depends on how much water the air already has.

That is the whole instrument, and it is the clearest physical link in this chapter between
evaporation, cooling and humidity.

You have to **wet the wick** yourself. Before you do, both thermometers read the same. That
makes the cooling something you caused rather than something you arrived to find.

The difference between the two is the **depression**. Look it up in the psychrometric table
- dry bulb down the side, depression across the top - and the cell gives you relative
humidity. The dew point follows.

**Set the true humidity to 100 per cent and wet the wick again.** Nothing happens. The wet
bulb does not fall by so much as a tenth of a degree. No evaporation is possible into
saturated air, so there is no cooling and no depression, and both thermometers agree. A
null result is the strongest possible proof that the cooling comes from evaporation and not
from the water simply being cold.

**Airflow matters more than you would expect.** In still air the wick sits in its own damp
layer, never reaches the true wet bulb temperature, and reads high - and slowly. Assmann
put a clockwork fan on his psychrometer in 1887 for exactly this reason. Switch between
still, breeze and aspirated and watch both the speed and the answer change.

**Cross-check mode** puts a simulated BME280 reading next to the psychrometric one and asks
which you should believe. An aspirated psychrometer is a legitimate field reference: it is
traceable to two ordinary thermometers you can inspect. The BME280 is traceable to a
factory calibration you cannot.

## How to Use

- Set the **dry bulb** and the **true humidity**. The second one is the hidden truth the
  instrument is measuring - in real life you would not know it.
- Press **Wet the wick** and watch the second thermometer fall.
- Read the depression, find it in the table, and check it against the panel.
- Set true humidity to 100 and wet the wick again. Then explain the result.
- Switch the airflow to **Still air** and wet the wick again. Compare the answer with the
  truth.
- Press **Cross-check a BME280** and decide which reading you would write down.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/psychrometer-wet-bulb-bench/main.html"
        height="592px"
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
- The Humidity Three Ways MicroSim
- Knowing that evaporation takes heat

### Activities

1. **Cause the cooling (5 min)**: Set 25 C and 40 per cent. Wet the wick and time how long the wet bulb takes to settle. Do it again with the fan aspirated.
2. **The null result (6 min)**: Set true humidity to 100 per cent and wet the wick. Write one sentence explaining why nothing happened, and what that proves.
3. **Read the table (8 min)**: For three different conditions, read the humidity off the table yourself before looking at the panel. Then set airflow to still and see how far wrong the same table now takes you.

### Assessment
- Reads relative humidity from a dry bulb and a wet bulb without prompting.
- Explains the null result at saturation in terms of evaporation.
- States why an aspirated psychrometer is a usable reference for an electronic sensor.

## References

1. [Stull (2011), *Wet-Bulb Temperature from Relative Humidity and Air Temperature*](https://doi.org/10.1175/JAMC-D-11-0143.1) - the explicit approximation this bench computes with.
2. [WMO-No. 8, *Guide to Instruments and Methods of Observation*](https://library.wmo.int/idurl/4/68695) - psychrometers, aspiration, and their use as references.
3. [Wikipedia: Psychrometrics](https://en.wikipedia.org/wiki/Psychrometrics)
4. [Wikipedia: Hygrometer](https://en.wikipedia.org/wiki/Hygrometer) - including the Assmann aspirated psychrometer.
