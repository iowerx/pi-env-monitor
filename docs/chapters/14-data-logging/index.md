---
title: "Logging Data: Timestamps, Intervals, and Files"
description: Choosing a sampling interval, building a time series, CSV structure and header rows, storage and file rotation, backup, databases, and the metadata that makes a dataset understandable.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:48:10
version: 0.09
---
# Logging Data: Timestamps, Intervals, and Files

## Summary

A reading that is not written down is not a measurement. This chapter covers choosing a sampling interval against the sensor's response time, building a time series from timestamped readings, and the structure of a CSV file down to the header row that names the units. It covers storage, file rotation, backup, and databases for a dataset that keeps growing, and closes with metadata — the record of what was measured, where, with what instrument — without which a dataset cannot be understood by anyone else.

## Concepts Covered

This chapter covers the following 12 concepts from the learning graph:

1. CSV File
2. Data Storage
3. Data Record
4. File Rotation
5. Data Backup
6. Data Field
7. Database
8. Metadata
9. Header Row
10. Data Logging
11. Sampling Interval
12. Time Series

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)
- [Chapter 5: Time and Place: Recording Where and When](../05-time-and-place/index.md)
- [Chapter 12: The Station's Brain: Operating System, Command Line, and Sensor Buses](../12-os-and-sensor-buses/index.md)
- [Chapter 13: Programming the Station in Python](../13-python-programming/index.md)

---

## Everything So Far Has Been Thrown Away

Every reading in this book so far has gone to the screen and then vanished.

`print(sensor.temperature)` displays a number and forgets it. Chapter 1 said that environmental monitoring means measuring the same place repeatedly, over a long time — and that the patience is the point. A program that displays readings and discards them has no patience at all. It has an attention span of one line.

**Data logging** is the automatic recording of measurements over time, with each reading stored alongside the time it was taken.

This chapter is where the station stops being a demonstration and starts being an instrument.

## How Often Should You Read?

**Sampling interval** is the time between consecutive readings.

Choosing it is the first real design decision in the project, and it is a genuine trade with costs on both sides.

**Sample too fast and you get:**

- Enormous files that are slow to move, chart, and back up
- Higher power consumption, which Chapter 16 will show is the binding constraint
- Redundant readings, because Chapter 4 established that sampling faster than a sensor's response time produces the sensor catching up, not new information
- More wear on the SD card, which has a finite number of writes

**Sample too slowly and you get:**

- Missed events — a squall line, a gust front, a temperature spike between readings
- Coarse charts that hide real structure
- Data that cannot answer questions you have not thought of yet

That last point deserves weight. You can always thin dense data later by averaging. You can never recover detail you never captured. When genuinely unsure, sample somewhat faster than you think you need.

Chapter 4's rule sets the floor: **never sample faster than the sensor can respond.** The BME280's humidity element takes about a second to settle, so ten readings per second yields nine readings of the sensor still moving.

Working figures for this project:

| Quantity | Sensor response | Sensible interval | Why |
|----------|-----------------|-------------------|-----|
| Temperature | ~1 s | 60 s | Air temperature changes slowly |
| Pressure | Near instant | 60 s | Weather-relevant change takes minutes |
| Humidity | ~1 s | 60 s | Matches temperature for dew point calculation |
| Solar radiation | Fast | 60 s, or 10 s for cloud detail | Passing cloud changes it in seconds |
| Wind speed | Seconds | 1–3 s, reported as 60 s averages | Gusts are brief and matter |
| Ground motion | Sub-millisecond | 100 samples/s | A P wave lasts fractions of a second |

Notice the range: from once a minute to a hundred times a second, across sensors on one station. Wind and seismic have to be sampled fast and *summarized* — you record gust and sustained values each minute rather than every raw sample, a technique Chapter 15 covers.

A one-minute interval is the right default for a first station. It produces 1,440 readings a day and 525,600 a year, which is enough to see everything weather does and small enough to handle comfortably.

!!! tip "Align your readings to the clock"
    Reading at 14:30:00, 14:31:00, 14:32:00 is much more useful than at 14:30:07, 14:31:09, 14:32:11. Aligned timestamps make comparison to other stations straightforward and make charting cleanly-spaced. In Python, sleep until the next whole minute rather than sleeping a fixed 60 seconds — the fixed sleep slowly drifts, because the reading itself takes time.

## Time Series

A **time series** is a sequence of measurements of the same quantity taken at successive points in time.

This is the fundamental shape of all your data, and it has properties that ordinary data does not:

- **Order matters.** Shuffling the rows destroys the information entirely.
- **Spacing matters.** A gap is meaningful — it says something was not recorded.
- **Neighbours are related.** The temperature a minute from now will be close to the temperature now, which is what makes an outlier detectable at all in Chapter 15.

A **data record** is one complete observation — all the readings taken at a single moment, plus the time they were taken.

A **data field** is one individual value within a record.

For your station, a record looks like this:

| Field | Example value | Unit |
|-------|---------------|------|
| timestamp | 2026-08-25T14:30:00Z | UTC, ISO 8601 |
| temperature | 21.4 | °C |
| pressure | 1013.2 | hPa |
| humidity | 62.3 | % RH |
| dew_point | 13.8 | °C |
| irradiance | 847 | W/m² |
| wind_speed | 3.2 | m/s |

Two design decisions in that table are worth explaining, because both cause arguments.

**Store the timestamp in UTC, in ISO 8601 format.** Chapter 5 gave the reasons in full: local time creates duplicate hours, missing hours, and records that will not sort. This is not negotiable for data you intend to keep.

**Store the computed dew point even though it is derived from temperature and humidity.** It is redundant — anyone could recompute it. Store it anyway. It costs a few bytes, it means the value is available without re-implementing the Magnus formula in whatever tool reads the file later, and it preserves a record of *which* formula you used. If you improve the calculation next year, you will still know what the old numbers meant.

## CSV Files

A **CSV file** — Comma-Separated Values — is a plain text file where each line is one record and fields within a line are separated by commas.

It looks exactly like what it is:

```
timestamp,temperature_c,pressure_hpa,humidity_pct,dew_point_c
2026-08-25T14:30:00Z,21.4,1013.2,62.3,13.8
2026-08-25T14:31:00Z,21.5,1013.2,62.1,13.8
2026-08-25T14:32:00Z,21.5,1013.1,61.9,13.7
```

CSV is the right format for this project, and the reasons are worth stating because more sophisticated options exist and none of them is better here:

- **Anything can read it.** Spreadsheets, Python, R, a text editor, a phone.
- **It is human-readable.** You can look at it and see what is wrong.
- **Appending is trivial.** Add a line to the end. No rewriting, no index to update.
- **It is durable.** A corrupted CSV loses the damaged lines. A corrupted binary file may lose everything.
- **It will still open in thirty years.** That is not true of most proprietary formats, and Chapter 1 said monitoring is a long-term activity.

The **header row** is the first line, naming each field.

It is not optional, and this is the place where the Chapter 2 units lesson becomes a habit:

```
timestamp,temperature_c,pressure_hpa,humidity_pct,dew_point_c
```

Every field name carries its unit. Compare that to:

```
time,temp,press,hum,dew
```

Both files contain identical numbers. The first can be understood by a stranger in five years. The second requires someone to remember whether the temperature was Celsius or Fahrenheit, and whether pressure was hectopascals or pascals — and if the answer is wrong by a factor of 100, or off by 32, nobody may notice.

!!! danger "The header row is where data becomes shareable"
    Of everything in this chapter, the header row costs the least effort and prevents the most damage. Chapter 2 opened with a $327 million spacecraft destroyed by a unit mismatch between two teams. Your station will hand its data to future-you, to a teacher, and possibly to a citizen science network. Every one of those is a different team.

    Write the units into the column names. It takes ten seconds, once.

Here is the complete logging code. Before it: `csv.writer` handles the comma formatting and escaping correctly. Opening with mode `"a"` means append, so existing data is never overwritten. `newline=""` prevents blank lines appearing between rows on some systems. The `os.path.exists` check writes the header only when the file is new. `flush()` forces the data to disk immediately rather than waiting for the buffer to fill.

```python
#!/usr/bin/env python3
import csv
import os
import time
from datetime import datetime, timezone

DATA_FILE = "readings.csv"
HEADER = ["timestamp", "temperature_c", "pressure_hpa",
          "humidity_pct", "dew_point_c"]

def write_reading(row):
    """Append one record, writing the header if the file is new."""
    is_new = not os.path.exists(DATA_FILE)
    with open(DATA_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        if is_new:
            writer.writerow(HEADER)
        writer.writerow(row)
        f.flush()
        os.fsync(f.fileno())

def utc_timestamp():
    """Return the current time as an ISO 8601 UTC string."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
```

That `os.fsync` line is worth understanding. `flush()` pushes data out of Python's buffer to the operating system; `fsync()` tells the operating system to write it to the physical card. Without both, a power cut can lose readings that your program believed were saved. For a station running on battery in a field, that is not a theoretical concern.

## Storage on a Small Computer

**Data storage** is where and how the data physically lives.

Your station stores data on a microSD card, which has two properties you must design around.

**Cards have limited write endurance.** Flash memory cells wear out after a finite number of writes. A cheap card in a device writing constantly can fail within a year. Mitigations:

- Buy a card rated for endurance — cards marketed for dashcams and security cameras are built for continuous writing
- Do not sample faster than you need
- Batch small writes where practical

**Cards fail without warning, and often completely.** Unlike a hard drive, which frequently gives symptoms first, an SD card commonly works perfectly and then is simply unreadable.

The good news is that the data itself is small. One reading with five fields is about 60 bytes:

| Interval | Per day | Per year |
|----------|---------|----------|
| 1 second | 5.2 MB | 1.9 GB |
| 10 seconds | 518 KB | 189 MB |
| 1 minute | 86 KB | 32 MB |
| 5 minutes | 17 KB | 6 MB |

At one-minute sampling, a year of data is 32 megabytes. A 16 GB card could hold five centuries of it. **Storage capacity is not your constraint** — card reliability is.

## Rotation and Backup

**File rotation** is the practice of periodically closing the current data file and starting a new one, usually named by date.

Writing everything into one enormous file for years creates several problems: opening it becomes slow, a single corruption can affect the whole thing, and copying it off the station gets progressively more expensive.

Rotating daily gives you files like this:

```
readings-2026-08-23.csv
readings-2026-08-24.csv
readings-2026-08-25.csv
```

The benefits are immediate. Each file is small and quick to open. Corruption is contained to one day. Copying only the new files is trivial. And because the names use ISO 8601 dates, they sort chronologically as plain text — the same property Chapter 5 identified for timestamps.

The code change is small. Before it: `strftime("%Y-%m-%d")` formats the current UTC date, and building the filename from it means the file changes automatically at midnight UTC with no scheduling required.

```python
def current_data_file():
    """Return today's data file name, rotating at UTC midnight."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return f"readings-{today}.csv"
```

**Data backup** is keeping copies of your data somewhere other than the station.

The station will fail. Cards die, power supplies fail, water gets in, and equipment left outdoors sometimes disappears. The question is not whether you will lose the station but whether you will lose the data with it.

The standard guidance is the 3-2-1 rule:

- **3** copies of the data
- On **2** different kinds of media
- With **1** copy in a different physical location

For a school station that might be: the SD card in the station, a copy on a school computer, and a copy in cloud storage or a GitHub repository. Chapter 16 covers moving data off the station automatically over the telemetry link.

!!! warning "A backup you have never restored is not a backup"
    The failure that hurts is discovering, at the moment you need it, that the backup was copying an empty directory, or copying the file before the day's data was written, or silently failing for two months.

    Test it. Once a month, take a backup copy, open it, and confirm the last timestamp is recent and the row count is what you expect. This takes two minutes and is the difference between having a backup and believing you have one.

#### Diagram: Sampling Interval Trade-off Bench

<iframe src="../../sims/sampling-interval-bench/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Sampling Interval Trade-off Bench</summary>
Type: microsim
**sim-id:** sampling-interval-bench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: justify

Learning objective: The learner justifies a sampling interval for a stated monitoring purpose, weighing captured detail against file size, power consumption, and SD card wear.

Purpose: Sampling interval is the first genuine engineering trade in the project, and students default to either "as fast as possible" or "whatever the tutorial said." Showing the same real event captured at five intervals, alongside the cost of each, converts a default into a defended decision.

Canvas layout:
- Upper panel: the true continuous signal drawn as a smooth curve, with sample points marked
- Middle panel: what the logged data actually contains at the selected interval, drawn as points joined by straight lines — the reconstruction a chart would show
- Lower panel: a cost dashboard
- Right or below (responsive): a verdict panel
- Bottom: controls
- Responsive to window resize; panels stack and share a fixed x-axis

Data Visibility Requirements:
  Stage 1: Show the true signal with its key features annotated, e.g. "gust front, 40 seconds", "pressure drop begins"
  Stage 2: Overlay the sample instants at the chosen interval
  Stage 3: Show the reconstructed series that a person reading the CSV would see
  Stage 4: Mark any annotated feature that was entirely missed with a red flag and the text "MISSED — no sample fell inside this event"
  Stage 5: Show the cost dashboard: readings per day, bytes per day, megabytes per year, estimated SD card writes per year, and estimated daily power cost in milliamp-hours

Signal scenarios, each with events of different durations:
1. **A calm day** — smooth diurnal temperature curve. Every interval captures it adequately. Verdict: "One minute is plenty. Faster sampling buys nothing here."
2. **A cold front passing** — a sharp 4 °C drop and a wind shift over about 8 minutes. One-minute sampling captures it; five-minute sampling blurs it; fifteen-minute sampling reduces it to a single step.
3. **A gust front** — a 30-second wind spike. Only sub-10-second sampling catches it at all. Verdict: "This is why wind is sampled fast and summarized, rather than sampled once a minute."
4. **A seismic P wave** — a sub-second signal. Every interval down to one second misses it entirely, which motivates the 100 samples per second figure in the chapter table.
5. **A passing cloud** — irradiance dropping from 900 to 200 W/m² and back over 90 seconds.

Interactive controls:
- Interval selector: 0.01 s, 1 s, 10 s, 60 s, 300 s, 900 s
- Scenario selector
- A "purpose" selector that changes the verdict criteria: "daily weather summary", "detect frontal passages", "wind gust analysis", "earthquake detection", "solar panel sizing". The verdict panel must state whether the chosen interval is adequate FOR THAT PURPOSE, so the learner sees that there is no single right answer.
- "Thin the data" button that averages a fast series down to a slower one, with the caption "You can always thin dense data later. You can never recover detail you never captured."

Instructional Rationale: The objective is Evaluate/justify, which requires a decision defended against stated criteria. Making the purpose an explicit selector is the design choice that carries this: the same 60-second interval is excellent for one purpose and useless for another, and the learner must see that pairing rather than seek a universal answer. The thin-the-data demonstration establishes the asymmetry that should bias the decision when uncertain.

Implementation: p5.js. Define each scenario as a continuous mathematical function of time so the true signal is exactly computable at any sample instant. Compute costs from bytes per row and a documented per-read current draw.
</details>

## When a File Is Not Enough

A **database** is a structured system for storing, indexing, and querying data efficiently.

CSV files are excellent for appending and terrible for searching. Finding every reading where pressure fell more than 3 hPa in an hour means reading the entire file from the beginning. With one day of data that is instant. With five years it is not.

A database indexes the data so that questions can be answered without scanning everything.

For this project, SQLite is the reasonable option. It is a full database contained in a single file, it needs no server running, and Python includes it — no installation at all. Compared to a plain CSV it offers:

- Fast queries over date ranges and value conditions
- Multiple programs reading safely at the same time
- Enforced structure, so a malformed row is rejected rather than silently stored

The costs are real too: the file is binary rather than human-readable, it will not open in a spreadsheet, and a corrupted database can be harder to salvage than a corrupted text file.

!!! tip "Start with CSV. Add a database if you need one."
    A great many student projects have stalled by building a database first. Start with CSV files rotated daily — they are simple, transparent, and sufficient for well over a year of one-minute readings.

    Move to a database when you have a specific problem it solves: queries taking too long, several programs wanting the data at once, or a web dashboard needing fast lookups. Chapter 15's analysis works fine on CSV.

    A useful middle path is to keep logging CSV as the permanent record and *import* it into SQLite for analysis. That way the durable, readable, appendable file remains the source of truth and the database is disposable.

## Metadata

**Metadata** is data about the data: what was measured, where, when, by what instrument, and under what conditions.

Here is a test. Hand somebody this file and nothing else:

```
timestamp,temperature_c,pressure_hpa,humidity_pct
2026-08-25T14:30:00Z,21.4,1013.2,62.3
```

They can see that at that instant something was 21.4 °C. They cannot answer:

- **Where** was this measured? Which city, which yard, which side of the building?
- **How high** is the station? Without elevation, Chapter 7 showed the pressure cannot be interpreted at all.
- **What sensor** was it? Accuracy of ±1 °C or ±0.1 °C changes what conclusions are supportable.
- **Was it shielded?** Chapter 6 showed an unshielded sensor reads its own temperature, not the air's.
- **Is 1013.2 the station reading or corrected to sea level?** These differ by tens of hectopascals.
- **Has it been calibrated?** When, and against what?

Without answers, the data is a curiosity. With them, it is a measurement someone else can use.

Store metadata in a separate file alongside the data, in JSON — a plain-text format that is both human-readable and machine-parseable:

```json
{
  "station_id": "school-roof-01",
  "station_name": "Lincoln Middle School Rooftop",
  "latitude": 37.0902,
  "longitude": -122.0644,
  "elevation_m": 152,
  "datum": "WGS 84",
  "timezone_note": "All timestamps are UTC (ISO 8601)",
  "sensor": {
    "model": "BME280",
    "manufacturer": "Bosch Sensortec",
    "interface": "I2C",
    "address": "0x76",
    "temperature_accuracy_c": 1.0,
    "pressure_accuracy_hpa": 1.0,
    "humidity_accuracy_pct": 3.0
  },
  "exposure": {
    "height_above_ground_m": 1.5,
    "radiation_shield": "louvered plastic, naturally ventilated",
    "surface_beneath": "grass",
    "notes": "Building is 8 m to the north; no afternoon shading."
  },
  "processing": {
    "pressure_reported": "station pressure, uncorrected",
    "dew_point_method": "Magnus formula, a=17.27 b=237.7",
    "sampling_interval_s": 60,
    "averaging": "none"
  },
  "calibration": {
    "last_checked": "2026-08-20",
    "method": "compared against aspirated psychrometer",
    "temperature_offset_c": -0.3
  },
  "operator": "Grade 8 Science, Lincoln Middle School",
  "license": "CC BY 4.0"
}
```

That file is perhaps three minutes of work and it is what makes the difference between data and a pile of numbers.

Two entries in it deserve highlighting. `"pressure_reported": "station pressure, uncorrected"` prevents someone comparing your 995 hPa against a neighbour's sea-level-corrected 1013 hPa and concluding a storm is arriving — exactly the error Chapter 7's check-yourself question described. And `"temperature_offset_c": -0.3` records a known calibration correction, so a future reader knows whether it has already been applied.

!!! note "Write the metadata on day one"
    Not after the first month, and not when you write up the project. Details you are certain you will remember — which sensor, which address, what the shield was made of, how high it was mounted — become genuinely irretrievable within weeks. Record them while the station is in front of you.

    A good habit: photograph the installation and store the photo with the metadata file.

#### Diagram: Anatomy of a Good Data File

<iframe src="../../sims/anatomy-of-a-data-file/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Anatomy of a Good Data File</summary>
Type: infographic
**sim-id:** anatomy-of-a-data-file<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: critique

Learning objective: The learner critiques real data files against a usability standard, identifies which specific omission makes a given file uninterpretable, and constructs a header row and metadata record that would fix it.

Purpose: Students believe their own data is self-explanatory because they remember the context. The only way to break that belief is to hand them somebody else's badly-documented file and ask them to answer a question they cannot. This element is that experience, repeated across several failure modes.

Layout: A file-viewer panel showing a CSV file's first ten lines, with an adjacent metadata panel that may be present or empty. Below, a question panel poses a specific analysis task. Right or below (responsive), a diagnostic checklist. Fully responsive to window resize.

Six files to critique, each broken in exactly one way so the diagnosis is unambiguous:
1. **No header row** — bare numbers. Question: "What is the third column?" Unanswerable.
2. **Header without units** — `time,temp,press,hum`. Question: "Is this station experiencing a storm?" The pressure reads 995 — but is that hPa at the station, hPa at sea level, or something else? Unanswerable without metadata.
3. **Local timestamps across a DST transition** — two rows stamped 01:30. Question: "How much did the temperature change between these two readings?" Unanswerable; this reprises the Chapter 5 element.
4. **No metadata file** — good header, good units, no station information. Question: "Can this be compared to the station 5 km away?" Not without elevation.
5. **US-format dates** — `8/5/26`. Question: "Sort these chronologically." Ambiguous month and day, and alphabetic sorting scrambles them.
6. **A complete, correct file** — good header with units, ISO 8601 UTC, full metadata. Every question answerable. This one must come last, so the learner experiences the contrast.

Interaction:
- The learner reads the file and attempts the posed question, selecting from multiple-choice answers that include "cannot be determined from this file"
- Selecting "cannot be determined" correctly reveals a diagnostic explaining exactly which piece of information is missing
- A repair mode then opens: the learner edits the header row and fills in metadata fields, and the sim re-poses the question and shows whether it is now answerable
- A running checklist of the seven metadata questions from the chapter, ticked off as the learner's repaired file satisfies each

Additional feature — "Six months later": a toggle that presents the learner's OWN repaired file with all context stripped away, framed as "you are opening this next spring." This tests whether the file survives without memory, which is the actual standard.

Instructional Rationale: The objective is Evaluate/critique, and critique requires a standard plus cases that violate it in identifiable ways. Isolating one fault per file makes each diagnosis clean. The repair mode matters because recognizing a bad file is only half the skill; producing a good one is the transferable outcome. The "six months later" framing is included because self-documentation is judged against a reader who has no context, and students cannot simulate that state for themselves.

Implementation: p5.js. Store each file as literal text plus a metadata object that may be null, along with the posed question, answer options, and diagnostic text. Render the repair mode as editable text fields validated against required patterns.
</details>

## Putting It Together

Here is the complete logger, assembling everything from Chapters 12, 13, and 14. Before reading it: it opens the sensor over I2C, then loops forever. Each pass computes the aligned next-minute time, reads the sensor inside a `try` block, computes dew point, appends a row to today's rotated file, and sleeps until the next whole minute. Failures are logged and the loop continues.

```python
#!/usr/bin/env python3
"""Environmental monitoring station logger."""

import csv
import math
import os
import time
from datetime import datetime, timezone

import board
import busio
from adafruit_bme280 import basic as adafruit_bme280

INTERVAL_S = 60
HEADER = ["timestamp", "temperature_c", "pressure_hpa",
          "humidity_pct", "dew_point_c"]

def utc_now():
    return datetime.now(timezone.utc)

def current_data_file():
    return f"readings-{utc_now().strftime('%Y-%m-%d')}.csv"

def log_event(message):
    with open("station.log", "a") as f:
        f.write(f"{utc_now().strftime('%Y-%m-%dT%H:%M:%SZ')} {message}\n")

def calculate_dew_point(temperature_c, relative_humidity):
    a, b = 17.27, 237.7
    gamma = (a * temperature_c) / (b + temperature_c) + math.log(relative_humidity / 100.0)
    return (b * gamma) / (a - gamma)

def write_reading(row):
    path = current_data_file()
    is_new = not os.path.exists(path)
    with open(path, "a", newline="") as f:
        writer = csv.writer(f)
        if is_new:
            writer.writerow(HEADER)
        writer.writerow(row)
        f.flush()
        os.fsync(f.fileno())

def main():
    i2c = busio.I2C(board.SCL, board.SDA)
    sensor = adafruit_bme280.Adafruit_BME280_I2C(i2c, address=0x76)
    log_event("Station started")

    while True:
        try:
            t = sensor.temperature
            p = sensor.pressure
            h = sensor.humidity
            dp = calculate_dew_point(t, h)
            stamp = utc_now().strftime("%Y-%m-%dT%H:%M:%SZ")
            write_reading([stamp, round(t, 2), round(p, 2),
                           round(h, 2), round(dp, 2)])
        except OSError as e:
            log_event(f"Sensor read failed: {e}")
        except Exception as e:
            log_event(f"Unexpected error: {e}")

        # Sleep until the next whole minute rather than a fixed 60 s,
        # so timestamps stay aligned and do not drift.
        now = time.time()
        time.sleep(INTERVAL_S - (now % INTERVAL_S))

if __name__ == "__main__":
    main()
```

Note the `round(t, 2)` calls. Chapter 2 warned against reporting more digits than the instrument supports, and the BME280's ±1 °C accuracy does not justify six decimal places. Two decimals is generous and keeps the file readable.

Combine this with the systemd service from Chapter 12 and you have a station that starts at boot, survives crashes, rotates its files daily, logs its own failures, and keeps timestamps aligned to the clock.

## Key Takeaways

- **Data logging** records measurements automatically over time. A **sampling interval** trades detail against file size, power, and card wear — you can thin dense data later, never recover detail you never captured.
- Never sample faster than the sensor responds. One minute is a good default; wind and seismic need fast sampling with summarization.
- A **time series** has order, spacing, and related neighbours. A **data record** is one observation; a **data field** is one value within it.
- A **CSV file** is readable by everything, human-inspectable, trivially appendable, and durable. The **header row** must carry units in every column name.
- **Data storage** on SD cards is limited by write endurance and sudden failure, not capacity. **File rotation** by ISO date keeps files small and contains corruption. **Data backup** follows 3-2-1, and an untested backup is not a backup.
- A **database** buys fast queries and concurrent access at the cost of readability. Start with CSV; add SQLite when a specific problem demands it.
- **Metadata** records where, how high, with what sensor, under what exposure, and with what processing. Without it, data is a pile of numbers. Write it on day one.

## Check Yourself

??? question "Why does a header row of `time,temp,press,hum` fail, when the numbers are correct? Click to check."
    Because the units are missing. A temperature of 21.4 could be Celsius or Fahrenheit; a pressure of 995 could be station pressure or sea-level-corrected, hectopascals or something else. Anyone reading the file — including you next year — has to guess, and a wrong guess is silent. Naming the columns `temperature_c`, `pressure_hpa`, `humidity_pct` costs ten seconds and removes the ambiguity permanently.

??? question "Your station samples every second. A year of data is 1.9 GB and your card is 16 GB. Is one-second sampling fine? Click to check."
    Capacity is not the issue, but two other things are. First, **write endurance**: sampling every second means 31.5 million writes a year, which will wear an ordinary SD card out. Second, **information**: the BME280's humidity element takes about a second to settle, so most of those readings are the sensor catching up rather than new measurements. Unless you specifically need sub-minute detail, one-second sampling costs card life and power for no additional information.

??? question "You find a data file from a station with no metadata file. Pressure reads 995 hPa. Is there a storm? Click to check."
    You cannot tell, and that is the lesson. Without the station's elevation you cannot know whether 995 hPa is a genuinely low sea-level pressure or an ordinary reading from a station 150 m up. Chapter 7 showed that elevation shifts pressure by about 12 hPa per 100 m, which is larger than most weather signals. You also do not know whether the value is already sea-level corrected. The metadata file answers both in one line each.

??? question "Why sleep until the next whole minute instead of sleeping exactly 60 seconds? Click to check."
    Because the reading itself takes time. A fixed 60-second sleep means each cycle actually takes 60 seconds plus however long the sensor read and the file write took, so the timestamps drift steadily later. After a day the readings are no longer near whole minutes, which makes comparison with other stations awkward and charts unevenly spaced. Sleeping `60 - (now % 60)` re-aligns to the clock every cycle, so drift never accumulates.

---

## What Is Next

Your station now records. What it does not yet do is tell you anything.

Chapter 15 is about reading change over time, which is a different skill from reading an instrument. It covers line charts and scatter plots, honest axis labeling, moving averages, trend, and correlation between two channels. That machinery unlocks six measurements that could not be defined earlier — pressure tendency and barometric forecasting, insolation, wind gust and sustained wind speed, and the Saffir-Simpson scale. It closes with data quality: finding outliers, missing data, and sensor drift, and deciding which suspicious readings are instrument faults and which are real events.
