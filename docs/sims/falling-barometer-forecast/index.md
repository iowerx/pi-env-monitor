---
title: Falling Barometer Forecast Trainer
description: Six pressure traces, the last twelve hours hidden. Commit to a forecast, then find out. Several traces are built so that the value and the trend disagree.
image: /sims/falling-barometer-forecast/falling-barometer-forecast.png
og:image: /sims/falling-barometer-forecast/falling-barometer-forecast.png
twitter:image: /sims/falling-barometer-forecast/falling-barometer-forecast.png
social:
   cards: false
quality_score: 0
---

# Falling Barometer Forecast Trainer

<iframe src="main.html" height="654px" width="100%" scrolling="no"></iframe>

[Run the Falling Barometer Forecast Trainer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students reliably learn "low pressure means bad weather" and stop there. It produces wrong
calls, and it is wrong in both directions.

The forecasting signal is the **rate of change**, not the value. The only way to teach that
is to present traces where the two disagree and let the learner get it wrong somewhere it
costs nothing.

You see 24 hours of trace. The next twelve are covered up until you commit. The panel gives
you the current pressure, the reading three hours ago, the tendency in hPa per 3 hours, the
rate in hPa per hour, and a plain-language category - the same set a synoptic observer
reports.

The dial has two needles. The black one is live; the brass one you drag and leave. The gap
between them *is* the tendency. That is what the second needle on your grandmother's
barometer was for, and it is the only reason a pressure dial was ever useful to a
non-specialist.

Six traces, two of which are traps:

- **High and falling fast** reads 1025 hPa, comfortably inside the normal band, and is
  dropping 4 hPa every three hours. Predict "fair" from the value and you will be wrong in
  four hours.
- **Low and rising** reads 990 hPa, which looks alarming, and is climbing steadily. The
  storm has already gone past.

Plus **rapid deep fall**, more than 6 hPa in three hours, which is the rate Robert FitzRoy
built the first storm warnings on in the 1860s; **steady low**, where a frightening-looking
value does nothing at all for a day; and the **diurnal wobble**, a twice-daily atmospheric
tide of a couple of hectopascals that is not weather and must be learned and then
ignored.

## How to Use

- Pick a **Trace**, or press **Random trace**.
- Scrub the **Hour** slider back through the last 24 hours. Watch the tendency change.
- Drag the **brass needle** to the current reading, then scrub forward and watch the gap
  open up.
- Commit to one of the five forecast buttons. The next twelve hours appear and the panel
  tells you which cue mattered.
- The score keeps count. Work through all six.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/falling-barometer-forecast/main.html"
        height="654px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
25-30 minutes

### Bloom's Taxonomy Level
Evaluate (L5)

### Prerequisites
- Reading a line chart
- Chapter 7 sections on highs, lows and why air rises

### Activities

1. **Establish the wrong rule (5 min)**: Run Steady low and Steady high without looking at the tendency, predicting from the value alone. Note your score.
2. **Break it (10 min)**: Run High and falling fast and Low and rising. For each, write down what the value suggested and what the trend suggested, and which turned out right.
3. **The whole set (10 min)**: Work through all six traces. For each, write the rate in hPa per hour and your forecast before pressing a button. Aim for six out of six on a second pass.

### Assessment
- Predicts from the tendency rather than the absolute value.
- Recognises the diurnal oscillation as non-weather.
- Justifies a forecast by reference to a rate, in hPa per hour, and a physical mechanism.

## References

1. [Wikipedia: Robert FitzRoy](https://en.wikipedia.org/wiki/Robert_FitzRoy) - the first storm warning service, and the barometers he had installed in fishing ports.
2. [Met Office: how pressure affects our weather](https://www.metoffice.gov.uk/weather/learn-about/weather/atmosphere/pressure) - highs, lows and tendency.
3. [Wikipedia: Atmospheric tide](https://en.wikipedia.org/wiki/Atmospheric_tide) - the diurnal wobble scenario.
4. [WMO-No. 8, *Guide to Instruments and Methods of Observation*](https://library.wmo.int/idurl/4/68695) - the three-hour pressure tendency as a reported quantity.
