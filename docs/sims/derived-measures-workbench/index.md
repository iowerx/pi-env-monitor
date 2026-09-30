---
title: Derived Measures Workbench
description: A window you drag along a real series, with the arithmetic inside it written out - because none of these four measures can be read off one row.
image: /sims/derived-measures-workbench/derived-measures-workbench.png
og:image: /sims/derived-measures-workbench/derived-measures-workbench.png
twitter:image: /sims/derived-measures-workbench/derived-measures-workbench.png
social:
   cards: false
quality_score: 0
---

# Derived Measures Workbench

<iframe src="main.html" height="666px" width="100%" scrolling="no"></iframe>

[Run the Derived Measures Workbench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

These four measures are the moment your logged data becomes more informative than a single
instrument reading, and each one is an operation over a **span** rather than a conversion of
one number. The sliding window is the representation that makes that concrete.

Drag the window along the raw series. The middle panel writes out the arithmetic on the
samples actually inside it, and the bottom panel builds the derived series on the same time
axis, so you can see that the output is itself a time series.

**Pressure tendency** — a 3-hour window, `P_now − P_3h_ago`, with both values marked on the
raw chart. Sweep it across the storm and watch the category move from Steady to Falling to
Falling rapidly. Park it at hour 41, where pressure reads **1006 hPa and the tendency is
−0.7**: low but steady. The value is alarming and the trend is not, which is Chapter 7's
lesson with the arithmetic behind it.

**Insolation** — accumulates from midnight, filling the area under the irradiance curve as
the window sweeps, each one-minute rectangle adding to a running sum. It reaches **6.71
kWh/m²** by the end of a day with one cloud event. This is the number that sizes the solar
panel in Chapter 16.

**Sustained wind** — the mean over the window, switchable between the US 2-minute standard
and the WMO 10-minute standard. On identical data those give **9.39 and 8.65 m/s**, and
elsewhere in the series they differ by over 1.5 m/s. The same wind gives different sustained
speeds depending on the averaging period, which is why the Saffir-Simpson category depends on
which standard is used.

**Wind gust** — the peak inside the window tested against the sustained speed. At one point
the peak is 14.01 with a sustained 9.22, a difference of 4.79, so a gust is reported. At
another there is a visible 10.34 m/s spike with a sustained 8.27 — a difference of 2.07, below
the 2.6 m/s threshold — and **no gust is reported**. A gust is defined relative to the
sustained speed, not in absolute terms.

## How to Use

- **Drag anywhere** on the raw series to move the window, or press **Sweep the window**.
- Watch the arithmetic panel. Every number in it comes from the samples inside the shading.
- In tendency mode, find a place where the pressure is low and the tendency is steady.
- In sustained mode, switch between **2 minutes** and **10 minutes** without moving the window.
- In gust mode, find the spike that does *not* produce a reported gust.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/derived-measures-workbench/main.html"
        height="666px"
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
- Chapter 15 sections on pressure tendency, insolation, sustained wind and gust
- Chapter 7 on value versus trend, Chapter 9 on irradiance

### Activities

1. **Compute it by hand (7 min)**: In tendency mode, read the two marked pressures off the chart, do the subtraction yourself, and check it against the arithmetic panel and the category table.
2. **Two standards, one wind (6 min)**: Pick three cursor positions and record the 2-minute and 10-minute sustained speeds at each. Explain which you would publish and why you must say which one it is.
3. **The suppressed gust (7 min)**: Find the spike that reports no gust. Write down the peak, the sustained speed and the difference, and explain the rule in one sentence.

### Assessment
- Calculates each of the four measures from the samples in a window.
- Explains why each requires a series rather than a single reading.
- States the gust definition relative to sustained speed and applies it to a borderline case.

## References

1. [WMO Guide to Instruments and Methods of Observation](https://library.wmo.int/idurl/4/68695) - the 10-minute sustained wind standard and gust reporting conventions.
2. [NOAA National Hurricane Service: sustained wind definitions](https://www.nhc.noaa.gov/aboutgloss.shtml) - the US 1-minute and 2-minute conventions.
3. [Wikipedia: Insolation](https://en.wikipedia.org/wiki/Solar_irradiance#Insolation) - the integral of irradiance over time.
4. [Wikipedia: Pressure tendency](https://en.wikipedia.org/wiki/Pressure_tendency) - the three-hour convention and the forecast categories.
