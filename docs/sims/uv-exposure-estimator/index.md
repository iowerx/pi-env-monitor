---
title: UV Exposure Risk Estimator
description: UV index, perceived brightness and perceived warmth on three separate scales at once, so you can watch them disagree.
image: /sims/uv-exposure-estimator/uv-exposure-estimator.png
og:image: /sims/uv-exposure-estimator/uv-exposure-estimator.png
twitter:image: /sims/uv-exposure-estimator/uv-exposure-estimator.png
social:
   cards: false
quality_score: 0
---

# UV Exposure Risk Estimator

<iframe src="main.html" height="672px" width="100%" scrolling="no"></iframe>

[Run the UV Exposure Risk Estimator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The gap between how a day feels and how much ultraviolet it carries causes real harm, and
it is a direct consequence of the spectral physics in this chapter.

Three bars sit side by side and are deliberately allowed to disagree:

- **UV index**, on the standard five-band scale, with a time-to-sunburn readout.
- **Perceived brightness**, from the visible irradiance reaching you.
- **Perceived warmth**, from the air temperature.

Two presets make the point on their own:

- **Ski slope, March, noon** - 2500 m, fresh snow, clear sky. **UV index 7.2** at
  **minus 6 °C**. Unprotected skin burns in about half an hour, on a day you need a coat
  for. The index is calculated for a flat surface; upward-facing skin gets roughly 80 per
  cent again on top of it from snow reflection, which is why skiers burn under the chin.
- **Overcast summer noon** - **UV index 3.7** with brightness at 1.7 out of 10. Cloud takes
  85 per cent off the visible light and only 65 per cent off the UV. It looks like a day
  you cannot burn on. It is not.

**Where the number came from** breaks the result into its parts: the clear-sky value for
the current solar angle, then altitude, cloud, ground reflection and ozone as separate
percentages. Altitude adds about 6 per cent per 1000 m. Fresh snow adds 20 per cent to the
horizontal index. A low-ozone episode adds 31 per cent.

Build your own from the chips - latitude, date, cloud, ground and ozone - and use the time
and altitude sliders. Then look at the three bars and ask which one you would have guessed
from.

## How to Use

- Press a **preset** and read the verdict, then look at all three bars together.
- Build a scenario with the **chips** on the left, and drag the **time** and **altitude**
  sliders.
- Change only the cloud setting and watch the brightness bar collapse while the UV bar
  barely moves. That is the mechanism.
- Set the ozone to **Low** and see what a depleted column does.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/uv-exposure-estimator/main.html"
        height="672px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Evaluate (L5)

### Prerequisites
- Chapter 9 sections on the solar spectrum
- The Solar Energy Budget MicroSim

### Activities

1. **Break the warmth rule (6 min)**: Find two scenarios with the same UV index and very different temperatures. Write down what makes them differ.
2. **Break the brightness rule (7 min)**: Starting from a clear summer noon, change only the cloud. Record UV and brightness for all three settings. Which falls faster, and by how much?
3. **Assess a real plan (8 min)**: You are going walking at 2000 m in June at 45 degrees north, with patchy cloud, on a snowfield. Build it, read the time to burn, and write a two-sentence recommendation.

### Assessment
- Assesses UV risk from time, place, altitude and surface rather than from appearance.
- Explains why cloud is a poor guide to UV.
- Identifies snow and altitude as risk multipliers.

## References

1. [WHO, *Global Solar UV Index: A Practical Guide* (2002)](https://www.who.int/publications/i/item/9241590076) - the definition of the index and the five risk bands.
2. [US EPA: UV Index](https://www.epa.gov/sunsafety/uv-index-scale-0) - the band colours used on the gauge.
3. [Wikipedia: Ultraviolet index](https://en.wikipedia.org/wiki/Ultraviolet_index)
4. [WMO: ozone and ultraviolet radiation](https://public.wmo.int/en/our-mandate/focus-areas/environment/ozone) - why a low-ozone episode raises ground UVB.
