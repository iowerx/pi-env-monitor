---
title: Python Code Tracer
description: Step a Python program one line at a time, predict each value before it appears, and watch a TypeError stop everything.
image: /sims/python-code-tracer/python-code-tracer.png
og:image: /sims/python-code-tracer/python-code-tracer.png
twitter:image: /sims/python-code-tracer/python-code-tracer.png
social:
   cards: false
quality_score: 0
---

# Python Code Tracer

<iframe src="main.html" height="650px" width="100%" scrolling="no"></iframe>

[Run the Python Code Tracer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Beginners read code as text rather than as a sequence of state changes, and that is exactly
why they cannot find their own bugs. This tracer makes the state visible: the current line
is highlighted, every variable in scope shows its value **and its type**, and changed values
are flagged as they change.

**Prediction mode is on by default, and it is the point.** Before a value appears, the sim
stops and asks what it is going to be. Watching an animation teaches very little; committing
to an answer and being wrong teaches a great deal. The score is tracked across the program.

Six programs, in increasing difficulty:

1. **Variables and types** — ends with `reading + 1` where `reading` is the string `"21.4"`,
   producing the real traceback and stopping the program. Line 5 never runs.
2. **A function call** — steps into `celsius_to_fahrenheit`, showing the argument bound to
   the parameter as two names for one value, and the function scope disappearing on return.
3. **A conditional ladder** — each condition evaluated as True or False, with the branch
   taken. Re-runnable at 40, 32, 21.4 and −5 °C so every branch can be reached.
4. **A loop that accumulates** — `total` growing one reading per pass, the iteration counter,
   and how many passes remain.
5. **An off-by-one bug** — `range(4)` where the author wanted 1 to 4. The trace makes the
   zero-start impossible to miss.
6. **A float equality trap** — `0.1 + 0.2` shown as **0.30000000000000004**, and
   `== 0.3` evaluating False.

Programs 4 and 6 are worth running together. In the averaging loop the accumulated total
comes out as `85.80000000000001` and the average as `21.450000000000003`, while the printed
line reads a clean `Average: 21.45 C`. The stored value and the displayed value are not the
same thing, and the tracer shows both.

**Stepping backward** is supported everywhere, because understanding usually arrives one
line after the confusion. Click a line number to set a breakpoint.

## How to Use

- Press **Step** and answer each prediction before continuing.
- When you get one wrong, press **Step back** and look at the line again.
- Run program 3 at all four input temperatures and watch which branch runs each time.
- Turn **Predict first** off to review a program quickly, then turn it back on.
- Click a **line number** to set a breakpoint, then **Run to end**.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/python-code-tracer/main.html"
        height="650px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
25-30 minutes

### Bloom's Taxonomy Level
Apply (L3)

### Prerequisites
- Chapter 13 sections on variables, data types, functions, conditionals and loops

### Activities

1. **Predict the whole thing (10 min)**: Run programs 1, 5 and 6 with prediction mode on. Record your score and note which prediction surprised you most.
2. **Find the branch (7 min)**: Run program 3 at all four inputs. Then explain what would go wrong if the `> 30` test came before the `> 35` test.
3. **Two kinds of float (8 min)**: Run program 4, write down the value of `average` in the variables panel and the value printed to the console. Explain why they differ and which one is stored in your CSV file.

### Assessment
- Predicts the value and type of a variable after a given line executes.
- Explains why execution stops at an unhandled exception and what never runs.
- States the rule about comparing floating point values and why it exists.

## References

1. [Python tutorial: an informal introduction](https://docs.python.org/3/tutorial/introduction.html) - the types and operators traced here.
2. [Python docs: floating point arithmetic, issues and limitations](https://docs.python.org/3/tutorial/floatingpoint.html) - why 0.1 + 0.2 is not 0.3.
3. [Python docs: the try statement and built-in exceptions](https://docs.python.org/3/library/exceptions.html) - TypeError and its message format.
4. [Wikipedia: Off-by-one error](https://en.wikipedia.org/wiki/Off-by-one_error) - the bug program 5 exists to show.
