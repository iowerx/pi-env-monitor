---
title: Timestamp Trouble Simulator
description: Run identical readings through four timestamp formats and a daylight saving transition, and judge which failures can be repaired and which destroyed the information for good.
image: /sims/timestamp-trouble-simulator/timestamp-trouble-simulator.png
og:image: /sims/timestamp-trouble-simulator/timestamp-trouble-simulator.png
twitter:image: /sims/timestamp-trouble-simulator/timestamp-trouble-simulator.png
social:
   cards: false
quality_score: 0
---

# Timestamp Trouble Simulator

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Timestamp Trouble Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students accept "use UTC" as a rule, and then quietly write local timestamps in their own
projects anyway. This turns the rule into a demonstrated consequence.

Every reading here is stored internally as a true UTC instant and rendered through a format
function. The underlying data is provably identical in all four views, so the format is the
only thing that can possibly be causing any failure you see.

Four formats:

1. **US style** - 8/25/26 2:30 PM
2. **European style** - 25/8/26 14:30
3. **Local time with zone** - 2026-11-01 01:30 PDT
4. **ISO 8601 UTC** - 2026-11-01T08:30:00Z

Five scenarios. On an **ordinary day** all four look fine, which is exactly why the problem
goes unnoticed. Then:

- **Clocks go back.** Two readings get the same timestamp. They cannot be sorted and the
  interval between them cannot be computed. Nothing in the file records which came first,
  so this is not a bug you can fix later - the information was never written down.
- **Clocks go forward.** An hour of local time never happens, and the log shows a hole that
  looks exactly like a hardware failure. Recoverable, but only once you know.
- **Two stations, two countries.** Los Angeles and Berlin are nine hours apart today and
  eight in a fortnight. In UTC they merge with a plain sort.
- **Ambiguous date.** 8/5/26 and 5/8/26 are the same two strings a reader of the other
  convention would produce for the opposite dates, and nothing in the file says which
  convention was used.

**Sort the log** performs a literal alphabetical text sort, the way a naive script would.
Only ISO 8601 comes out in chronological order, and that is a design feature rather than
luck: its fields run largest to smallest in fixed-width form.

The distinction the verdict panel keeps drawing - recoverable versus unrecoverable - is the
actual lesson. A duplicated hour is not an inconvenience. It is destroyed information.

## How to Use

- Choose a **Format** and a **Scenario**, then press **Log a reading** repeatedly, or
  **Log all**.
- Rows highlighted in red share a timestamp with another row.
- Read the **Verdict** panel. Change only the format and read it again.
- Press **Sort the log** and see what happens to the row numbers. Do it in every format.
- **Reset** clears the log without changing your selections.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/timestamp-trouble-simulator/main.html"
        height="552px"
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
- Knowing what a time zone is
- Chapter 5 sections on why the station needs a clock

### Activities

1. **Establish the baseline (4 min)**: Run the Ordinary day scenario in all four formats. Note that nothing goes wrong. Explain why that is a problem.
2. **Find the destroyed data (8 min)**: Run Clocks go back in US style with everything logged. Identify the two pairs of duplicate timestamps. Then argue, in writing, whether a clever enough script could repair the file.
3. **Test the sort (8 min)**: Log all in the Two stations scenario and press Sort the log in each format in turn. Record which formats scramble and explain in one sentence what property makes ISO 8601 survive.

### Assessment
- Distinguishes a recoverable timestamp failure from an unrecoverable one and defends the distinction.
- Explains why ISO 8601 sorts correctly as plain text.
- Argues for UTC from a demonstrated consequence rather than from authority.

## References

1. [Wikipedia: ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) - the format and why the field order matters.
2. [RFC 3339: Date and Time on the Internet - Timestamps](https://www.rfc-editor.org/rfc/rfc3339) - the profile of ISO 8601 most software actually uses.
3. [IANA Time Zone Database](https://www.iana.org/time-zones) - where the transition rules used in this sim come from.
4. [Wikipedia: Daylight saving time](https://en.wikipedia.org/wiki/Daylight_saving_time)
