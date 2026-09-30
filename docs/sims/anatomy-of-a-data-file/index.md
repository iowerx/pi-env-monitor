---
title: Anatomy of a Good Data File
description: Six data files, each broken in exactly one way, and a question you cannot answer until you find the omission.
image: /sims/anatomy-of-a-data-file/anatomy-of-a-data-file.png
og:image: /sims/anatomy-of-a-data-file/anatomy-of-a-data-file.png
twitter:image: /sims/anatomy-of-a-data-file/anatomy-of-a-data-file.png
social:
   cards: false
quality_score: 0
---

# Anatomy of a Good Data File

<iframe src="main.html" height="670px" width="100%" scrolling="no"></iframe>

[Run the Anatomy of a Good Data File MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students believe their own data is self-explanatory because they remember the context. The
only way to break that belief is to hand them **somebody else's** file and ask a question
they cannot answer.

Six files, each broken in exactly one way so the diagnosis is never ambiguous. Each comes
with an analysis task and a multiple-choice answer set that includes *"cannot be determined
from this file"* — which is the correct answer to five of the six.

- **A. No header row.** What is the third column? `1013.2` looks like pressure to you because
  you already know what a station measures.
- **B. Header with no units.** Is this station in a storm? 995 could be a deep low at sea
  level or an ordinary day at 150 m reported as station pressure.
- **C. Local timestamps across a DST change.** Two rows stamped 01:30 and the clock runs
  backwards in between. The interval between them is unknowable.
- **D. No metadata file.** Good header, good units, proper UTC — and no elevation, so an
  18 hPa difference from the next station could be weather or a hill.
- **E. US-format dates.** Is `8/5/26` May or August? And sorted as text, `1/6/26` comes first
  under either reading.
- **F. Correct.** Leave this one until last. The contrast is the lesson.

**Repair mode** is the other half of the skill. Recognising a bad file is not the transferable
outcome; producing a good one is. Add a header row with units, switch to ISO 8601 UTC, click
any unticked question on the checklist to supply that metadata, and the sim re-poses the
original question and tells you whether it is now answerable.

The checklist holds **seven questions**. Six are the chapter's list — where, how high, what
sensor, was it shielded, station or sea-level pressure, has it been calibrated. The seventh is
an unambiguous time base, which is what file C exists to prove you need.

**Six months later** is the real test. It presents your repaired file with every piece of
remembered context stripped away, framed as opening it next spring with nobody to ask. Files
are judged against a reader who has no memory of the installation, and students cannot
simulate that state for themselves.

## How to Use

- Work through the files **A to F in order**. F last.
- Read the file, read the question, and commit to an answer before checking.
- When you get "cannot be determined", read the diagnosis and name the missing piece out loud.
- Press **Repair this file** and fix it. Watch the checklist tick over.
- Press **Six months later** and see whether your repair actually holds up.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/anatomy-of-a-data-file/main.html"
        height="670px"
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
- Chapter 14 sections on CSV structure, header rows and metadata
- Chapter 5 on ISO 8601 and time zones
- Chapter 7 on station versus sea-level pressure

### Activities

1. **Diagnose all six (12 min)**: For each file, write one sentence naming the single omission that makes the question unanswerable. F should take one sentence too.
2. **Repair and retest (8 min)**: Repair file B until the storm question is answerable. List every change you had to make, in the file and in the metadata.
3. **Six months later (8 min)**: Pick the file you repaired and run the six-months test. Then write the header row and metadata for your own station's file.

### Assessment
- Identifies which specific omission makes a given file uninterpretable.
- Constructs a header row with units and a metadata record that answers all seven questions.
- Judges a file against a reader who has no context rather than against their own memory.

## References

1. [Wikipedia: ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) - the date and time format that sorts correctly as plain text.
2. [Wikipedia: Metadata](https://en.wikipedia.org/wiki/Metadata) - data about data, and why a dataset without it is a curiosity.
3. [FAIR Guiding Principles for scientific data management](https://www.go-fair.org/fair-principles/) - the modern standard this checklist is a small version of.
4. [Wikipedia: Comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values) - the format and its header-row convention.
