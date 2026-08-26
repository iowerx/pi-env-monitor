---
title: Charting and Interpreting Your Data
description: Line charts, scatter plots, axis labeling, moving averages, trend and correlation; the derived measures that need a time series; and the data quality work of finding outliers, gaps, and drift.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:51:39
version: 0.09
---
# Charting and Interpreting Your Data

## Summary

This chapter is about reading change over time, which is a different skill from reading an instrument. It covers line charts, scatter plots, and honest axis labeling, then moving averages, trend, and correlation between two channels. That machinery unlocks six measurements that could not be defined earlier: pressure tendency and barometric forecasting, insolation, wind gust and sustained wind speed, and the Saffir-Simpson scale. It closes with data quality — outliers, missing data, and sensor drift — and the validation that separates an instrument fault from a real event.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Wind Gust
2. Pressure Tendency
3. Insolation
4. Line Chart
5. Scatter Plot
6. Moving Average
7. Outlier
8. Missing Data
9. Barometric Forecasting
10. Sustained Wind Speed
11. Axis Labeling
12. Trend
13. Correlation
14. Saffir Simpson Scale
15. Sensor Drift
16. Data Validation

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)
- [Chapter 7: Barometric Pressure: The Weight of the Atmosphere](../07-barometric-pressure/index.md)
- [Chapter 9: Solar Radiation: The Energy That Drives the Weather](../09-solar-radiation/index.md)
- [Chapter 10: Wind: Measuring Air in Motion](../10-wind/index.md)
- [Chapter 14: Logging Data: Timestamps, Intervals, and Files](../14-data-logging/index.md)

---

## Ten Thousand Numbers

Your station has been running for a week. The file has about ten thousand rows.

Open it in a text editor and you will see something like this, ten thousand times:

```
2026-08-25T14:30:00Z,21.4,1013.2,62.3,13.8
2026-08-25T14:31:00Z,21.5,1013.2,62.1,13.8
2026-08-25T14:32:00Z,21.5,1013.1,61.9,13.7
```

Nobody can read that. Not because it is difficult, but because human beings are extraordinarily bad at extracting patterns from columns of numbers and extraordinarily good at extracting them from pictures.

Chart the same data and a week of weather appears in one glance: the daily temperature cycle, the afternoon lag, the night a front came through, the two hours the sensor was in direct sun before you moved it.

This chapter is about that translation, and about the second thing charts do — which is show you when your data is lying.

## Line Charts

A **line chart** plots values against a continuous variable, joining consecutive points with straight segments.

It is the right default for a time series, and the reason is specific. Joining the points asserts that the quantity existed continuously between the readings and that intermediate values were roughly on that line. For temperature that is true — the air was some temperature at 14:30:30 even though nobody recorded it.

That assertion is not always safe, which is the first thing to be careful about:

- **Do not join across a gap.** If the station was offline for six hours, a line drawn between the readings either side invents six hours of data that never existed. Break the line.
- **Do not join unrelated categories.** A line chart of average temperature by city implies a progression between cities, which is meaningless. Use bars.

For your station's data, the useful line charts are:

- One quantity over a day, to see the diurnal cycle from Chapter 9
- One quantity over a month, to see weather systems passing
- Two related quantities on shared axes, to see how one drives the other

## Honest Axes

**Axis labeling** is the practice of naming what each axis shows, in what units, over what range.

This sounds like housekeeping. It is the difference between a chart that informs and a chart that misleads, and it is where most bad science graphics go wrong.

Every chart needs:

- **A label on each axis** saying what the variable is
- **The unit**, in the label or in parentheses
- **Readable tick marks** at sensible intervals
- **A title** stating what is shown, where, and when
- **A legend** if more than one series is plotted

Here is the failure that matters most.

!!! danger "The truncated y-axis"
    Plot a week of temperature with the y-axis running from 20.8 °C to 21.6 °C and the line becomes a dramatic mountain range. Plot the identical data with the axis from 0 °C to 40 °C and it becomes a nearly flat line.

    Same data. Opposite impressions. Neither chart is factually incorrect, and this is precisely why the truncated axis is the most common tool of misleading data graphics — in advertising, in politics, and in student lab reports.

    The rule is not "always start at zero." Sometimes zero is meaningless, as Chapter 2 showed for Celsius. The rule is: **choose a range that reflects the actual variation, and label it so clearly that a reader cannot mistake the scale.** If your y-axis is truncated, make sure a reader sees that in one second.

There is a related trap specific to comparison. When you plot two charts side by side to compare them, **the axes must match**. Comparing a chart with a 5-degree range to one with a 20-degree range tells you nothing about which place is more variable — the difference you see is entirely an artifact of the axes.

#### Diagram: Axis Honesty Lab

<iframe src="../../sims/axis-honesty-lab/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Axis Honesty Lab</summary>
Type: microsim
**sim-id:** axis-honesty-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: critique

Learning objective: The learner critiques chart presentations of identical data, judges which axis choices are honest and which mislead, and constructs a defensible presentation for a stated audience and claim.

Purpose: Students are taught "never truncate the y-axis," which is wrong as a rule and produces charts that hide real signal. The actual skill is judging whether the scale matches the claim being made. That judgment can only be trained by letting the learner manipulate the axis and watch the same data tell different stories.

Canvas layout:
- Upper area: two charts side by side, both plotting the SAME underlying dataset, with independently adjustable axes
- Below each chart: a "reader's impression" text box that updates live, e.g. "This looks like a dramatic warming trend" or "This looks essentially flat"
- Right or below (responsive): the honesty checklist and verdict panel
- Bottom: controls
- Responsive to window resize; charts stack vertically on narrow canvases

Data Visibility Requirements:
  Stage 1: Show both charts with identical default axes, so the learner sees they are the same data
  Stage 2: As an axis range is dragged, show the numeric range and the fraction of the plot height that the data actually occupies
  Stage 3: Show the reader's-impression text change, phrased as a plain-language conclusion someone might draw
  Stage 4: Show a "true variation" readout — the actual range of the data — alongside the plotted range, so the distortion factor is quantified
  Stage 5: Show a checklist ticking off axis label, unit, title, legend, gap handling, and scale disclosure

Datasets:
1. **A week of temperature** varying by 0.8 °C. Truncating makes it a mountain range; a 0–40 °C axis makes it flat. Neither is wrong for all purposes.
2. **A month of pressure** with a real 25 hPa storm drop. Here truncation is NOT misleading — the signal is genuinely large. Verdict must say so: "A tight axis here reveals a real event. Truncation is not automatically dishonest."
3. **Five years of annual mean temperature** with a small real trend. The classic contested case; the verdict must acknowledge that both a tight and a wide axis can be defended depending on the claim.
4. **A day with a six-hour data gap.** Toggling "join across gaps" on and off must visibly invent or remove a line segment, with the caption "This line asserts six hours of data that do not exist."

Interactive controls:
- Drag either end of either y-axis
- Toggles per chart: show/hide axis label, unit, title, legend
- "Join across gaps" toggle
- Dataset selector
- **Claim selector** — the learner picks the claim the chart is meant to support: "this place has a stable climate", "a storm passed on the 14th", "temperatures are rising", "the sensor failed on Tuesday". The verdict panel then judges the current axis choice AGAINST THAT CLAIM, which is the mechanism that replaces a rule with a judgment.
- A "make it lie" challenge mode: the learner is asked to produce a chart supporting a false claim from honest data, then shown what disclosure would have prevented it

Instructional Rationale: The objective is Evaluate/critique, and critique needs a criterion. Making the claim an explicit selector supplies that criterion and prevents the lesson collapsing into a memorized rule. The make-it-lie mode is included deliberately: students who have constructed a misleading chart recognize one far faster than students who have only been warned about them.

Implementation: p5.js. Plot both charts from one shared dataset array so they provably cannot differ. Compute the reader's-impression text from the ratio of data range to axis range.
</details>

## Scatter Plots and Correlation

A **scatter plot** shows the relationship between two variables by plotting one against the other, as unconnected points.

Note what changed. In a line chart the x-axis is time. In a scatter plot **both axes are measurements**, and time disappears. Each point is one moment when both quantities had those two values.

The points are not joined, because there is no assertion that intermediate combinations occurred.

Scatter plots answer a different question than line charts: not "how did this change?" but "do these two things move together?"

**Correlation** is a measure of how strongly two variables move together. It is usually summarized by a correlation coefficient, written \(r\), ranging from −1 to +1:

| \(r\) | Meaning | Example from your station |
|-------|---------|---------------------------|
| +1.0 | Perfect positive — one rises, the other rises exactly | Temperature in °C against the same in °F |
| +0.7 | Strong positive | Solar irradiance against temperature |
| 0.0 | No relationship | Pressure against your station's ID number |
| −0.7 | Strong negative | Temperature against relative humidity |
| −1.0 | Perfect negative | Nothing physical, usually |

That temperature-versus-relative-humidity negative correlation is worth recognizing, because you will find it in your own data within a week. Chapter 8 explained the mechanism: cooling air raises relative humidity without adding water. So on any ordinary day, temperature and relative humidity trace opposite curves.

!!! warning "Correlation is not causation, and the reason matters"
    Two variables moving together can mean one causes the other, or that both are caused by a third thing, or that it is coincidence.

    Your station will produce a textbook example. Solar irradiance and temperature correlate strongly. Does temperature cause sunshine? Obviously not — irradiance drives temperature, as Chapter 9 explained.

    Now a subtler one. Relative humidity and pressure often correlate in a week of your data. Neither causes the other. Both are responding to weather systems moving through, which is the third variable.

    The discipline: when you find a correlation, state the physical mechanism you believe connects them. If you cannot name one, you have found a pattern, not a relationship. Chapter 17 returns to this as a habit for reading other people's claims.

## Smoothing and Trend

Real data is noisy. Chapter 4 covered the sensor-level sources; here you deal with what arrives in the file.

A **moving average** replaces each value with the mean of it and its neighbours over a window of fixed length.

A 10-minute moving average on one-minute data replaces each reading with the mean of the surrounding ten. Random noise partly cancels, as Chapter 4's square-root rule described, and the underlying shape emerges.

Choosing the window is the whole art:

| Window | Effect | Use for |
|--------|--------|---------|
| 5 minutes | Light smoothing | Removing sensor noise only |
| 1 hour | Moderate | Seeing the shape of a day |
| 24 hours | Heavy | Removing the diurnal cycle to see weather |
| 30 days | Very heavy | Seeing seasonal change |

The 24-hour window is especially useful and worth understanding. Averaging over exactly one full cycle removes that cycle almost entirely. So a 24-hour moving average of temperature strips out day and night and leaves only the slower changes — which is exactly how you separate weather from the daily rhythm.

And Chapter 4's warning applies at full strength here: **a moving average cannot distinguish noise from a real fast event.** Smooth heavily enough and a genuine 6 hPa pressure drop becomes a gentle slope. Always keep the raw data, and chart the smoothed line *over* the raw points rather than instead of them.

A **trend** is a persistent long-term direction in a time series, after short-term variation is set aside.

Distinguishing a trend from noise requires enough data, and "enough" is longer than people assume. Chapter 1 covered this: a week of readings shows weather, a year shows seasons, and thirty years shows climate. A student station running for one school year cannot establish a climate trend, and saying so plainly is better science than the alternative.

## Six Measurements That Needed a Time Series

Several quantities from earlier chapters were deferred, because none of them can be computed from a single reading. They are all properties of a *series*.

### Pressure Tendency

**Pressure tendency** is the change in barometric pressure over a defined period, conventionally three hours.

Chapter 7 said the most useful thing a barometer tells you is not the value but the change. Here is the calculation:

\[ \text{tendency} = P_{\text{now}} - P_{\text{3 hours ago}} \]

The standard interpretation:

| Tendency (3 h) | Category | Typical meaning |
|----------------|----------|-----------------|
| Rising more than +3 hPa | Rising rapidly | Clearing; wind may increase |
| +1 to +3 hPa | Rising | Improving |
| −1 to +1 hPa | Steady | No change expected |
| −1 to −3 hPa | Falling | Deteriorating |
| Falling more than −3 hPa | Falling rapidly | Storm approaching |
| Falling more than −6 hPa | Falling very rapidly | Severe weather likely |

**Barometric forecasting** is predicting weather from pressure tendency, and it is the technique FitzRoy built the first storm warning service on in the 1860s.

Combined with the wind direction shift and dew point change that Chapter 10 described, a falling tendency of more than 3 hPa in three hours is a genuine forecast you can make from your own station, hours before there is anything to see.

### Insolation

**Insolation** is solar energy accumulated over a period of time, as opposed to the instantaneous irradiance of Chapter 9.

Irradiance is watts per square metre — a rate. Insolation is watt-hours or kilowatt-hours per square metre — a total. Insolation is the area under the irradiance curve:

\[ \text{insolation} = \sum (\text{irradiance} \times \text{interval duration}) \]

With one-minute readings, each contributes one sixtieth of an hour:

```python
def daily_insolation_kwh(irradiance_values, interval_seconds=60):
    """Return daily insolation in kWh/m2 from a list of W/m2 readings."""
    hours = interval_seconds / 3600.0
    watt_hours = sum(w * hours for w in irradiance_values)
    return watt_hours / 1000.0
```

Insolation is the number that sizes a solar panel, and Chapter 16 uses it directly. Typical daily values run from about 1 kWh/m² on a mid-winter overcast day to 7 or 8 kWh/m² on a clear summer day.

### Wind Gust and Sustained Wind Speed

Chapter 10 sampled wind fast and deferred the summarization. Here it is.

**Sustained wind speed** is the average wind speed over a defined period, conventionally two minutes in the United States and ten minutes by World Meteorological Organization standard.

**Wind gust** is the peak wind speed over a short interval, reported when it exceeds the sustained speed by a defined margin — conventionally 5 knots, about 2.6 m/s.

Both come from the same fast samples:

```python
def wind_summary(samples, sustained_window=120, gust_threshold=2.6):
    """Return (sustained, gust) from a list of fast wind samples."""
    sustained = sum(samples) / len(samples)
    peak = max(samples)
    gust = peak if (peak - sustained) >= gust_threshold else None
    return sustained, gust
```

This is why wind is sampled every second or two and *logged* once a minute. The raw samples are transient; the summary is the record.

The **Saffir Simpson scale** rates hurricanes by their maximum sustained wind speed, which is why the definition above matters — the category depends on which averaging period you use.

| Category | Sustained wind | Typical damage |
|----------|----------------|----------------|
| 1 | 33–42 m/s | Damage to roofs, siding, trees |
| 2 | 43–49 m/s | Major roof and siding damage |
| 3 | 50–58 m/s | Devastating; structural damage |
| 4 | 58–70 m/s | Catastrophic; walls and roofs fail |
| 5 | Over 70 m/s | Total roof failure and wall collapse |

Chapter 10's wind load rule applies here too. A category 5 is not five times a category 1 — force goes with the square of speed, so it is roughly four times the force.

#### Diagram: Derived Measures Workbench

<iframe src="../../sims/derived-measures-workbench/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Derived Measures Workbench</summary>
Type: microsim
**sim-id:** derived-measures-workbench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Apply (L3)
Bloom Verb: calculate

Learning objective: The learner calculates pressure tendency, insolation, sustained wind, and gust from a raw time series, and explains why each requires a series rather than a single reading.

Purpose: These four measures are the moment a student's logged data becomes more informative than a single instrument reading, and each involves an operation over a window rather than an arithmetic conversion. Showing the window sliding across the raw data, with the computation visible inside it, is what makes "derived from a series" concrete.

Canvas layout:
- Upper panel: the raw time series for the selected quantity, plotted as points
- Overlay: a translucent shaded window the learner can drag along the series
- Middle panel: the arithmetic being performed on the values inside the window, written out with actual numbers
- Lower panel: the resulting derived series plotted beneath, aligned in time with the raw series above
- Right or below (responsive): the current result with its category or interpretation
- Responsive to window resize; panels share a fixed x-axis

Four modes, each with realistic multi-day source data:
1. **Pressure tendency** — window is 3 hours. Show \(P_{now} - P_{3h\ ago}\) with both values labeled on the raw chart and the subtraction written out. Result panel shows the tendency category from the chapter table and the forecast interpretation.
2. **Insolation** — window is one day. Show the area under the irradiance curve filling in as the window sweeps, with a running sum in watt-hours converting to kWh/m² at the end. Each one-minute rectangle should be visible as the sum accumulates.
3. **Sustained wind** — window is 2 minutes and, on a toggle, 10 minutes. Show the mean being computed over the samples inside, and show that the two window lengths give different answers for the same data.
4. **Wind gust** — show the peak inside the window, the sustained value, and the difference tested against the 2.6 m/s threshold, with the gust reported or suppressed accordingly.

Data Visibility Requirements:
  Stage 1: Show the raw samples with values readable at the cursor
  Stage 2: Highlight exactly which samples fall inside the current window, and how many
  Stage 3: Write out the operation with real numbers, e.g. "1008.3 − 1013.1 = −4.8 hPa"
  Stage 4: Show the result and its interpretation
  Stage 5: Plot the derived value into the lower panel so a full derived series builds up as the window sweeps

Required teaching moments:
- In sustained-wind mode, switching between the 2-minute and 10-minute window on identical data must produce different values, with the caption "The same wind gives different sustained speeds depending on the averaging period. This is why the Saffir-Simpson category depends on which standard is used."
- In gust mode, a case where the peak exceeds the mean by less than the threshold must show "No gust reported" despite a visible spike, with the caption "A gust is defined relative to the sustained speed, not in absolute terms."
- In tendency mode, a case where pressure is low but steady must report "Steady", reinforcing Chapter 7's value-versus-trend lesson.

Interactive controls:
- Drag the window along the series, or press Play to sweep it automatically
- Mode selector
- Window length control where the measure permits it
- "Show the formula" toggle

Instructional Rationale: The objective is Apply/calculate, so the learner must operate on real values and see the arithmetic. The sliding window is the specific representation that teaches what these measures are: not conversions of one number, but functions of a span. Building the derived series in a second panel aligned beneath the raw one shows that the output is itself a time series, which is what Chapter 16 will consume.

Implementation: p5.js. Pre-generate realistic multi-day series as static data. Compute each derived measure directly from the samples inside the window so the displayed arithmetic and the plotted result cannot disagree.
</details>

## When the Data Is Wrong

Charts do a second job: they show you that something has gone wrong. This half of the chapter is about that.

**Data validation** is the process of checking whether readings are plausible and identifying those that are not.

The first line of defence is the range check from Chapter 2, now written as code. Before it: each entry gives a physically plausible range for that quantity, generous enough not to reject real extreme weather.

```python
PLAUSIBLE = {
    "temperature_c": (-50, 60),
    "pressure_hpa":  (800, 1100),
    "humidity_pct":  (0, 100),
    "irradiance_wm2": (0, 1400),
    "wind_speed_ms": (0, 100),
}

def is_plausible(field, value):
    low, high = PLAUSIBLE[field]
    return low <= value <= high
```

The second check is rate of change. Air temperature does not jump 15 °C in one minute. If it appears to, something is wrong with the instrument, not the weather:

```python
MAX_CHANGE_PER_MINUTE = {"temperature_c": 2.0, "pressure_hpa": 3.0}
```

### Outliers

An **outlier** is a data point that differs markedly from the others around it.

The essential discipline is that an outlier is a **question, not an answer**. Some outliers are instrument faults. Some are the most interesting thing in your dataset. Deleting them automatically is how real discoveries get thrown away.

Some genuine causes of both kinds:

| Cause | Instrument or real? | How to tell |
|-------|--------------------|-------------|
| Electrical noise on the bus | Instrument | Single reading; neighbours normal; no other channel affected |
| Loose wire | Instrument | Often repeats; may cluster around temperature changes |
| Sunlight hitting an unshielded sensor | Instrument | Recurs at the same time of day; correlates with irradiance |
| Someone breathing on the sensor | Real, but not weather | Temperature and humidity both spike together, briefly |
| A cold front | Real | Multiple channels move consistently; matches regional data |
| A cloud edge over the solar sensor | Real | Brief spike above clear-sky; Chapter 9 predicted this |
| Insects or spiders in the enclosure | Instrument | Gradual onset; may affect one channel only |

That table encodes the technique. **Check whether other channels agree.** A real weather event moves several quantities in a physically consistent way. A temperature spike with no corresponding change in humidity, pressure, or irradiance is almost certainly the instrument.

!!! tip "Never delete. Flag."
    When you find a suspicious reading, do not remove it from the file. Add a column.

    ```
    timestamp,temperature_c,...,quality_flag
    2026-08-25T14:30:00Z,21.4,...,ok
    2026-08-25T14:31:00Z,47.9,...,suspect_range
    ```

    Deleting destroys evidence and makes your file dishonest — a reader cannot tell the difference between "nothing was recorded" and "something was recorded and discarded." Flagging keeps the raw record intact while letting analysis exclude flagged rows. It also lets you change your mind, which you will.

### Missing Data

**Missing data** is a gap where readings should exist but do not.

Gaps happen for many reasons: power loss, sensor failure, the SD card filling, a crash the Chapter 13 exception handling did not cover, or somebody unplugging the station to vacuum.

Gaps must be **visible**, not silently closed. Two rules:

1. **Never join a line chart across a gap.** Break the line.
2. **Never fill a gap with invented values** without labeling them. Interpolating across six hours produces numbers that look exactly like measurements and are not.

Finding gaps is straightforward when timestamps are aligned as Chapter 14 described — check whether consecutive timestamps differ by more than the expected interval, and report anything larger.

This is where Chapter 13's logging pays off. A gap with a matching line in `station.log` reading `Sensor read failed: Remote I/O error` is a diagnosed gap. A gap with nothing in the log is a mystery you will never solve.

### Sensor Drift

**Sensor drift** is a slow, systematic change in a sensor's readings over time that does not reflect a real change in what is being measured.

Drift is the hardest fault to detect because it is invisible day to day. A sensor reading 0.5 °C high looks completely normal, and if it drifts to 2 °C high over two years, no single day's data ever looks wrong.

Typical rates for the sensors in this book:

| Sensor | Typical drift | Over |
|--------|---------------|------|
| BME280 humidity | 0.5% RH | per year |
| BME280 pressure | ±1 hPa | per year |
| BME280 temperature | Small; usually within spec | |
| Cup anemometer bearings | Progressive under-reading | months to years |

Four ways to detect it:

1. **Compare against a nearby official station.** Plot the difference between your readings and theirs over months. Weather is shared, so that difference should hover around a constant. If it walks steadily in one direction, you are watching drift.
2. **Use physical fixed points.** Chapter 6 gave you two free reference standards: an ice-water bath is 0.0 °C, and Chapter 8 established that a saturated environment is 100 percent relative humidity.
3. **Watch the overnight minimum humidity.** On clear calm nights with dew forming, humidity should reach very near 100 percent. A sensor that peaks at 94 percent across many such nights has drifted.
4. **Keep a calibration log.** Record every check with its date and result in the metadata file from Chapter 14.

!!! warning "Drift is why a long record needs maintenance"
    Chapter 1 said environmental monitoring is about the long term. Drift is the reason a long record is not simply a matter of leaving a station alone.

    Every climate record in the world has this problem, and climatologists spend enormous effort on it — detecting when a station was moved, when an instrument was replaced, when a tree grew up beside it. The corrections they apply are sometimes accused of being manipulation. They are the opposite: they are what makes a hundred-year record from a hundred different instruments mean anything at all.

    Your station will face the same problem in miniature. Handle it the same way: document every change, and never edit historical data — record the correction separately.

#### Diagram: Data Quality Detective

<iframe src="../../sims/data-quality-detective/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Data Quality Detective</summary>
Type: microsim
**sim-id:** data-quality-detective<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: differentiate

Learning objective: The learner differentiates instrument faults from real environmental events in multi-channel station data, and justifies each diagnosis by checking whether the other channels moved in a physically consistent way.

Purpose: This is the chapter's central skill and the one a student will use for the life of their station. It cannot be taught by a list of fault types, because the diagnosis depends on cross-channel reasoning. Presenting all channels together and asking for a verdict is the only faithful representation of the real task.

Canvas layout:
- Main area: four stacked time-series panels sharing one x-axis — temperature, pressure, humidity, irradiance — plus a fifth thin strip showing station.log entries positioned in time
- A movable time cursor spanning all panels
- Right or below (responsive): the verdict panel with diagnosis options and the evidence checklist
- Bottom: case selector and scoring
- Responsive to window resize; panels stack and compress but keep the shared x-axis aligned

Cases, each several days of realistic multi-channel data containing exactly one anomaly:
1. **Single-sample spike, temperature only** — 47 °C for one minute; no other channel moves; no log entry. Diagnosis: electrical noise. Evidence: isolated in time and in channel.
2. **Cold front** — temperature drops 6 °C over an hour, pressure falls then rises sharply, humidity and dew point shift, wind direction changes. Diagnosis: real event. Evidence: all channels move consistently and in the physically expected order.
3. **Afternoon sun on an unshielded sensor** — temperature reads high every afternoon, correlating tightly with irradiance, while humidity reads correspondingly low. Diagnosis: siting fault. Evidence: recurs at the same time daily and tracks irradiance, which no real air temperature would do so exactly.
4. **Six-hour gap** — no readings; log shows a power event. Diagnosis: outage, correctly documented. The learner must also judge whether joining the line across the gap would be acceptable.
5. **Humidity drift** — over 60 simulated days, overnight peaks fall from 99 percent to 93 percent while a comparison station stays at 99. Diagnosis: sensor drift. Evidence requires the comparison overlay, which the learner must think to enable.
6. **Someone breathing on the sensor** — temperature and humidity both spike sharply for two minutes, pressure and irradiance unchanged. Diagnosis: real but not weather. This case must be scored as correct only if the learner picks "real, but not an atmospheric event."
7. **Cloud-edge irradiance spike** — a brief reading above the clear-sky envelope. Diagnosis: real, as Chapter 9 predicted. Students who flag this as a fault get feedback pointing back to that chapter.

Interaction:
- Move the cursor; all four panels and the log strip read out at that instant
- "Compare with nearby station" overlay toggle, which adds a reference series to each panel — essential for case 5 and useful for case 2
- Zoom to a time range
- Submit a diagnosis from: instrument noise, wiring fault, siting fault, sensor drift, power outage, real weather event, real non-weather event
- Before submitting, tick an evidence checklist: "other channels agree", "recurs at the same time of day", "log entry present", "comparison station shows the same", "physically plausible magnitude". The verdict scores both the diagnosis AND whether the evidence cited supports it — a right answer with wrong evidence scores partially.
- "Flag, do not delete" action: the learner adds a quality flag, and the sim shows the resulting CSV with the flag column, reinforcing the chapter's rule

Instructional Rationale: The objective is Analyze/differentiate, and the discriminating information lies across channels rather than within any one. Displaying all channels on a shared time axis is therefore not a convenience but the core of the design. Scoring the evidence separately from the conclusion is what prevents pattern-matching on case appearance and forces the diagnostic reasoning the chapter teaches.

Implementation: p5.js. Generate each case as static multi-channel data with a documented ground-truth cause. Keep the log strip as timestamped text entries so learners build the habit of checking it.
</details>

## Key Takeaways

- A **line chart** is the default for a time series, but never joins across a gap. A **scatter plot** puts two measurements on the axes and drops time.
- **Axis labeling** must give variable, unit, range, title, and legend. The truncated y-axis is not automatically dishonest — the test is whether the scale matches the claim, disclosed clearly.
- **Correlation** measures whether two quantities move together, and never establishes causation. Name the physical mechanism or call it a pattern.
- A **moving average** reveals shape by cancelling noise; a 24-hour window removes the diurnal cycle. It also smooths away real fast events, so keep the raw data.
- A **trend** requires enough data to separate from noise. One school year cannot establish a climate trend.
- **Pressure tendency** over 3 hours enables **barometric forecasting**. **Insolation** is the area under the irradiance curve. **Sustained wind speed** and **wind gust** are computed over windows, and the **Saffir Simpson scale** depends on which window.
- **Data validation** checks range and rate of change. An **outlier** is a question — check whether other channels agree. Flag, never delete.
- **Missing data** must stay visible. **Sensor drift** is detected by comparison against a reference, physical fixed points, or a nearby station.

## Check Yourself

??? question "Temperature and relative humidity in your data have a correlation of −0.8. Does low humidity cause high temperature? Click to check."
    No. Chapter 8 gives the mechanism: relative humidity is the ratio of actual to saturation vapor pressure, and saturation vapor pressure rises steeply with temperature. So warming air raises the denominator and relative humidity falls without any water leaving. The causation runs from temperature to relative humidity through the physics of vapor pressure — and the correlation is exactly what that mechanism predicts. Naming the mechanism is what turns the correlation into a finding.

??? question "One reading shows 47 °C. Neighbouring readings are 21 °C. Should you delete it? Click to check."
    No — flag it. Add a `quality_flag` column marking it `suspect_range` and leave the value in the file. Then investigate: did humidity, pressure, or irradiance move at that instant? If nothing else moved and there is no log entry, it is almost certainly electrical noise on the bus. Deleting it would destroy the evidence and make the file dishonest, since a reader could not distinguish a discarded reading from a missing one.

??? question "Your overnight humidity peaks have fallen from 99% to 93% over two months. Is the air drier? Click to check."
    Probably not — this is the classic **sensor drift** signature. On clear calm nights when dew forms, relative humidity genuinely reaches very near 100 percent, and it does so reliably. A sensor whose overnight peaks steadily decline across many such nights is drifting, not detecting a change in the climate. Confirm by overlaying a nearby official station: if their overnight peaks still reach 99 percent while yours fall, the sensor is the cause. Record the offset in your metadata; do not edit past readings.

??? question "Your pressure fell 7 hPa in 3 hours. What is the tendency category and what should you expect? Click to check."
    That is **falling very rapidly** — beyond the −6 hPa threshold — and it indicates severe weather likely within hours. This is a genuine forecast from your own station, and it is the same signal FitzRoy built the first storm warning service on in the 1860s. Confirm it by checking whether wind speed is rising and wind direction shifting, which Chapter 10 identified as the accompanying signature of an approaching front.

---

## What Is Next

Everything so far has assumed the station is on a bench, plugged into a wall, with you nearby. That is not a monitoring station. That is a demonstration.

Chapter 16 takes it outside. It covers siting and sensor exposure, weatherproof enclosures and their ingress protection ratings, and the power budget that determines the battery, solar panel, and charge controller you need — using the insolation figure this chapter just taught you to compute. It closes with telemetry: getting data off a device nobody can reach, over a connection that will not always be there.
