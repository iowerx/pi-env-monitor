---
title: Resilient Logger Fault Bench
description: Five logger strategies, one identical fault timeline, and five very different data files at the end of it.
image: /sims/resilient-logger-bench/resilient-logger-bench.png
og:image: /sims/resilient-logger-bench/resilient-logger-bench.png
twitter:image: /sims/resilient-logger-bench/resilient-logger-bench.png
social:
   cards: false
quality_score: 0
---

# Resilient Logger Fault Bench

<iframe src="main.html" height="670px" width="100%" scrolling="no"></iframe>

[Run the Resilient Logger Fault Bench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students accept "use try/except" as a rule and then write `except: pass`, which is worse
than no handling at all because it hides the failure. Arguing about that is less effective
than running it.

Five loggers execute the same read-and-append loop over the same 480 intervals, and every
injected fault hits all five at the same instant. **The strategy is the only variable**, so
any difference in the resulting data file was caused by the error handling and nothing else.

1. **No handling** — any exception terminates the program.
2. **Bare except, pass** — never crashes, never records anything.
3. **`except OSError`, logged** — the chapter's recommended pattern.
4. **Logged and retried three times** — as above, with retries before giving up.
5. **Yours** — pick which exception types to catch, and whether to log and retry.

Each card carries a **tape**: one narrow column per interval, green where a row was written,
red where it was not. Five tapes side by side is the comparison, visible at a glance. Click
any logger to read its actual `readings.csv` and `station.log`.

The five faults each isolate something different:

- **Transient I2C error** — one failed read. Logger 1 dies outright. **Logger 4 loses nothing
  at all**, because the retry succeeds on the second attempt.
- **Sensor down 30 minutes** — all five lose the same six readings, but only the ones that log
  leave any record of why.
- **Disk full** — a different errno, still an `OSError`. Set logger 5 to catch only
  `RuntimeError` and it crashes here while logger 3 keeps going.
- **Operator presses Ctrl-C** — logger 2's bare `except:` catches `KeyboardInterrupt` and
  refuses to stop. Everything else shuts down cleanly. This logger cannot be stopped
  normally; you would have to kill the process.
- **Typo inside the handler** — an exception raised in the `except` block. It kills logger 3
  and cannot touch logger 2, because logger 2 has no handler body to go wrong. Worth sitting
  with for a moment.

**Show comparison** gives the end-of-run table and a verdict for the selected logger, in the
form that matters: *"Logger 2 captured 412 of 480 readings and recorded zero faults. Its
data has 68 unexplained gaps. Six months from now nobody will be able to tell whether those
gaps were weather, hardware, or a bug."*

## How to Use

- Press **Run**, let it fill for a while, then press a **fault** button.
- Compare the five tapes. Then click each logger and read its two files.
- Press **Operator presses Ctrl-C** and see which loggers stop.
- Build **logger 5** from the chips, and try to beat logger 4.
- Press **Show comparison** for the table and the verdict.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/resilient-logger-bench/main.html"
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
- Chapter 13 sections on exception handling and the logger loop
- Chapter 12 on `/dev/i2c-1` and what an OSError from a sensor read means

### Activities

1. **One fault, five outcomes (8 min)**: Inject a transient I2C error and record what each logger did. Which one lost nothing, and why?
2. **The unstoppable logger (6 min)**: Inject Ctrl-C. Write down which loggers stopped and which did not, then explain to a classmate why `except: pass` is worse than no handling.
3. **Build a better one (10 min)**: Configure logger 5 to beat logger 4 on both criteria - readings kept and faults recorded. Then set it to catch only RuntimeError and inject a disk-full fault. Explain the result.

### Assessment
- Critiques each strategy against two criteria that conflict for the naive learner: keep running, and keep a record.
- Explains why a bare except is dangerous, using the KeyboardInterrupt case.
- Judges whether a data file with gaps is usable six months later.

## References

1. [Python docs: errors and exceptions](https://docs.python.org/3/tutorial/errors.html) - try, except, else and the exception hierarchy.
2. [Python docs: the logging module](https://docs.python.org/3/library/logging.html) - how a real logger writes the entries shown here.
3. [Python docs: BaseException and KeyboardInterrupt](https://docs.python.org/3/library/exceptions.html#KeyboardInterrupt) - why a bare except catches your attempt to quit.
4. [Wikipedia: Error hiding](https://en.wikipedia.org/wiki/Error_hiding) - the anti-pattern logger 2 demonstrates.
