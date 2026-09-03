---
title: Magnitude Versus Intensity Map
description: One magnitude pinned to the header, a whole field of intensities underneath it, and a town on fill that shakes harder than a nearer town on rock.
image: /sims/magnitude-versus-intensity-map/magnitude-versus-intensity-map.png
og:image: /sims/magnitude-versus-intensity-map/magnitude-versus-intensity-map.png
twitter:image: /sims/magnitude-versus-intensity-map/magnitude-versus-intensity-map.png
social:
   cards: false
quality_score: 0
---

# Magnitude Versus Intensity Map

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Magnitude Versus Intensity Map MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

**Magnitude describes the earthquake. Intensity describes a place.** The confusion between
them is universal and news coverage reinforces it every time, so the design decision here
is simple: the magnitude is pinned to a banner across the top and never changes with
position, while a whole field of different intensities appears underneath it.

Intensity is computed from the **Allen, Wald and Worden (2012)** intensity prediction
equation, using hypocentral distance, plus a site term for each town's ground. The contour
bands and their Roman numerals use the standard USGS ShakeMap colours.

At the default magnitude 6.5, ten kilometres deep, six towns report six answers:

| Town | Distance | Ground | Intensity |
|---|---|---|---|
| Bayfill Harbour | 61 km | Artificial fill | **VII** |
| Riverside | 46 km | Soft sediment | **VII** |
| Old Town | 40 km | Firm soil | VI |
| Granite Ridge | 31 km | Bedrock | VI |
| Marsh End | 141 km | Soft sediment | VI |
| Hillcrest | 97 km | Bedrock | V |

Read the top and the fourth rows together. **Bayfill Harbour is twice as far from the
epicentre as Granite Ridge and shakes a full intensity grade harder**, because it sits on
artificial fill and Granite Ridge sits on rock. That defeats the naive "closer means
stronger" rule, and it is not a contrivance: it is the 1985 Mexico City and 1989 San
Francisco Marina District case, which the probe panel names. Switch Bayfill Harbour to
bedrock and it drops from VII to V.

The **depth** slider makes the other point that news reports leave out. Take the same
magnitude 6.5 down to 250 km and every town on the map falls two or three grades.

The **energy** line converts magnitude differences into what they actually mean: one
magnitude unit is about 32 times the energy, two units about 1000.

**Did you feel it?** hands you a real observation — *"dishes rattled and hanging pictures
swung"* — and asks you to assign a Mercalli grade, then tells you what the map currently
says at that town. That is how the USGS builds intensity maps from public reports.

## How to Use

- Watch the **banner**. It never changes when you move around the map. That is the point.
- **Click a town** to probe it, then change its **ground type** and watch its number move
  while everything else stays put.
- **Drag the epicentre** anywhere and see the whole ordering rearrange.
- Push **Depth** to 250 km and note that a big earthquake can be barely felt.
- Try **Did you feel it?** and assign intensities from effect descriptions alone.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/magnitude-versus-intensity-map/main.html"
        height="662px"
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
- Chapter 2 on ordinal scales
- Chapter 11 sections on the Mercalli intensity scale and the moment magnitude scale

### Activities

1. **One event, six answers (5 min)**: At the default settings, write down all six intensities. Then write one sentence explaining how one earthquake produced six different numbers.
2. **Break the distance rule (8 min)**: Find the pair where the further town shakes harder. Change its ground to bedrock and record what happens. Explain the result in terms of the site term.
3. **Read the news correctly (7 min)**: A report says "a magnitude 6.5 earthquake struck". Using the depth slider, describe two situations with that same headline and completely different consequences.

### Assessment
- States that an earthquake has one magnitude and many intensities.
- Predicts the effect of depth and of local ground on the intensity at a place.
- Assigns a plausible Mercalli grade from an effect description.

## References

1. [USGS: Magnitude and intensity](https://www.usgs.gov/programs/earthquake-hazards/earthquake-magnitude-energy-release-and-shaking-intensity) - the distinction, from the agency that publishes both.
2. [Allen, Wald & Worden (2012), *Intensity attenuation for active crustal regions*](https://link.springer.com/article/10.1007/s10950-011-9258-3) - the intensity prediction equation used here.
3. [Wikipedia: Modified Mercalli intensity scale](https://en.wikipedia.org/wiki/Modified_Mercalli_intensity_scale) - the grades and their effect descriptions.
4. [USGS ShakeMap](https://earthquake.usgs.gov/data/shakemap/) - the colour scheme and the real version of this map.
5. [Wikipedia: 1985 Mexico City earthquake](https://en.wikipedia.org/wiki/1985_Mexico_City_earthquake) - lake-bed sediment amplification 350 km from the epicentre.
