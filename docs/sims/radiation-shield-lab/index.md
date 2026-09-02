---
title: Radiation Shield Comparison Lab
description: Four differently sited sensors, one simulated day, one known true air temperature. Then the labels come off and you have to name the fault from the shape of the error.
image: /sims/radiation-shield-lab/radiation-shield-lab.png
og:image: /sims/radiation-shield-lab/radiation-shield-lab.png
twitter:image: /sims/radiation-shield-lab/radiation-shield-lab.png
social:
   cards: false
quality_score: 0
---

# Radiation Shield Comparison Lab

<iframe src="main.html" height="592px" width="100%" scrolling="no"></iframe>

[Run the Radiation Shield Comparison Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Siting error is the highest-consequence and least-visible mistake a student station can
make, because the data it produces looks entirely plausible.

Four sensors run through the same day against a known truth on one fixed axis:

1. **Bare sensor on a dark asphalt roof** - reads wildly high, peaking in the early
   afternoon with the sun. It is measuring the roof, not the air.
2. **Bare sensor on a south-facing wall** - reads high, and peaks *later*, because masonry
   stores heat all day and gives it back into the evening. The shape is the giveaway.
3. **Sensor under a simple sunshade, no airflow** - much better, and still wrong. Shaded
   air with nowhere to go heats up and sits there.
4. **Sensor in a louvered white screen at 1.5 m over grass** - tracks the truth all day.

Set the weather to **Overcast** and all four agree to within a fraction of a degree. That
is the most important setting in the sim: *on a cloudy day, bad siting is invisible.* It is
why siting errors go unnoticed for months. They only appear when the sun is out.

**Diagnosis mode** inverts the task. One curve, no label, and four buttons. Read the shape -
when does the error peak, and how large is it? - and name the siting. Three rounds. This is
the skill you will need in Chapter 15 when you are looking at your own suspicious data.

The physics here is a coefficient model, not real radiative transfer: solar load times an
absorption factor times a shield factor, minus a ventilation term, with a per-siting time
lag. It is tuned for the correct qualitative ordering and plausible magnitudes, not for
numerical accuracy.

## How to Use

- Drag the **Time** slider through the day, or press **Run the day** and watch it play.
- Read the panel: each sensor's current reading, its error against the truth, and its worst
  error so far. When the day finishes, the four are ranked.
- **Click a sensor name** in the panel to hide its line and reduce clutter.
- Change **Weather** to Clear and breezy and see which sensor benefits most. Then set it to
  Overcast and read the message.
- Change **Season** to Winter. The errors shrink, but they do not vanish.
- Press **Diagnosis mode** for three unlabelled rounds.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/radiation-shield-lab/main.html"
        height="592px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
25-30 minutes

### Bloom's Taxonomy Level
Analyze (L4)

### Prerequisites
- Chapter 6 sections on what a thermometer actually measures
- Reading a line chart against a reference line

### Activities

1. **Watch the day (7 min)**: Clear and calm, summer. Run the day. Note the time at which each sensor reaches its worst error. Two of them peak at noticeably different times - which two, and why?
2. **Isolate the causes (9 min)**: Switch between Clear and calm and Clear and breezy. Which sensor improves most, and what does that tell you about what was wrong with it?
3. **Diagnose (10 min)**: Run all three rounds of diagnosis mode. For each, write down the clue in the shape that gave it away before you pressed a button.

### Assessment
- Attributes a specific error shape to a specific siting fault.
- Distinguishes a radiation error from a ventilation error by how a breeze affects it.
- Explains why a cloudy day hides a siting fault.

## References

1. [WMO-No. 8, *Guide to Instruments and Methods of Observation*](https://library.wmo.int/idurl/4/68695) - the siting and exposure standards this lab is modelled on.
2. [NOAA National Weather Service: ASOS siting](https://www.weather.gov/asos/) - how the professional networks handle the same problem.
3. [Wikipedia: Stevenson screen](https://en.wikipedia.org/wiki/Stevenson_screen) - the louvered white box, and why it is louvered.
4. [Wikipedia: Urban heat island](https://en.wikipedia.org/wiki/Urban_heat_island) - what happens when siting error is systematic across a whole network.
