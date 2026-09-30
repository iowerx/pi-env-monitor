---
title: Data Quality Detective
description: Seven cases of real station data, one anomaly each, and a verdict that scores your evidence as well as your conclusion.
image: /sims/data-quality-detective/data-quality-detective.png
og:image: /sims/data-quality-detective/data-quality-detective.png
twitter:image: /sims/data-quality-detective/data-quality-detective.png
social:
   cards: false
quality_score: 0
---

# Data Quality Detective

<iframe src="main.html" height="692px" width="100%" scrolling="no"></iframe>

[Run the Data Quality Detective MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This is the chapter's central skill and the one you will use for the life of your station:
telling an instrument fault from a real event. It cannot be taught as a list of fault types,
because the diagnosis lives **across** channels rather than inside any one of them.

Four channels share one time axis — temperature, pressure, humidity, irradiance — with a
`station.log` strip positioned in time beneath them and a cursor that reads all of them at
once. Seven cases, each containing exactly one anomaly:

1. **A one-minute spike.** 47 °C for one sample, nothing else moves, no log entry. Instrument
   noise. None of the evidence items hold, and that absence *is* the evidence.
2. **A front arrives.** Temperature falls 6 °C, pressure dips then rises behind it, humidity
   jumps, irradiance drops. Four channels moving consistently, in the expected order. Real.
3. **Hot every afternoon.** Temperature tracks irradiance almost exactly, every day, while
   humidity falls in lockstep. Real air temperature *lags* the sun by hours; this does not lag
   at all. Siting fault — the unshielded sensor from Chapter 6.
4. **Six hours of nothing.** Every channel stops together and the log records the undervoltage
   and the restart. Outage, correctly documented — and joining the line across it would be a
   lie.
5. **Sixty days of humidity.** Overnight peaks slide from **99 to 93 per cent** while the
   comparison station stays pinned at 99. No single reading looks wrong. Only the comparison
   overlay reveals it, and you have to think to turn it on.
6. **Two minutes of warmth.** Temperature and humidity spike together, pressure and irradiance
   do not move, the neighbour sees nothing. Warm, wet, local, brief: somebody breathing on the
   sensor. Real, but not weather.
7. **Brighter than the sky.** A reading above the clear-sky envelope. Chapter 9 predicted this:
   a cumulus edge reflecting extra light. Real, and flagging it as a fault is the wrong answer.

**The evidence is scored separately from the diagnosis.** Tick the wrong evidence and a correct
diagnosis is only partly right, because next time the evidence is all you will have. That is
what prevents pattern-matching on how a case looks.

**Flag, do not delete** adds a quality column to the row and shows the resulting CSV. The
suspect reading stays in the file so a later reader can decide for themselves.

## How to Use

- **Drag across the panels** to move the cursor. All four channels and the log read out together.
- Check the **log strip** before diagnosing anything. Case 4 is solved there.
- On case 5, turn on **Compare with nearby station**. Nothing else will reveal it.
- Pick a diagnosis, tick the evidence that actually holds, then **Submit**.
- Try **Flag, do not delete** and look at the CSV row it produces.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/data-quality-detective/main.html"
        height="692px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
30-35 minutes

### Bloom's Taxonomy Level
Analyze (L4)

### Prerequisites
- Chapter 15 sections on outliers, missing data, sensor drift and validation
- Chapter 6 on radiation shields, Chapter 9 on cloud-edge enhancement

### Activities

1. **All seven, evidence first (15 min)**: Work through every case. Before choosing a diagnosis, write down which of the five evidence items hold. Record your score for each.
2. **The one you cannot see (6 min)**: Attempt case 5 without the comparison overlay, then with it. Explain what the overlay added and why drift is the hardest fault class.
3. **Real but wrong (8 min)**: Compare cases 6 and 7. Both are real readings. Explain why one belongs in the weather record and the other does not, and what you would do with each.

### Assessment
- Differentiates instrument faults from real events using cross-channel consistency.
- Justifies a diagnosis by citing evidence that actually holds in that case.
- Applies the flag-do-not-delete rule rather than removing suspect rows.

## References

1. [WMO Guidelines on Quality Control Procedures for Data from Automatic Weather Stations](https://library.wmo.int/idurl/4/35333) - the professional version of this checklist.
2. [Wikipedia: Anomaly detection](https://en.wikipedia.org/wiki/Anomaly_detection) - the general problem, and why context beats thresholds.
3. [Wikipedia: Sensor drift and calibration](https://en.wikipedia.org/wiki/Calibration) - why drift needs a reference rather than an inspection.
4. [USCRN: instrument siting and comparison practice](https://www.ncei.noaa.gov/access/crn/) - a network built around redundant sensors for exactly this reason.
