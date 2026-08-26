---
title: Programming the Station in Python
description: Enough Python to read a sensor and act on the result - variables, data types, functions, loops, conditionals, libraries, exception handling, and running a script.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:44:59
version: 0.09
---
# Programming the Station in Python

## Summary

This chapter teaches enough Python to read a sensor and act on the result. It covers variables and data types, functions, loops, and conditional statements, then libraries — which is how a sensor becomes three lines of code instead of three hundred. It closes with exception handling, because a sensor that fails to respond at three in the morning should not stop the station, and with running a script from the command line. Readers finish able to write and modify the program that the next chapter turns into a data logger.

## Concepts Covered

This chapter covers the following 9 concepts from the learning graph:

1. Python
2. Variable
3. Script Execution
4. Data Type
5. Function
6. Conditional Statement
7. Loop
8. Python Library
9. Exception Handling

## Prerequisites

This chapter builds on concepts from:

- [Chapter 12: The Station's Brain: Operating System, Command Line, and Sensor Buses](../12-os-and-sensor-buses/index.md)

---

## Instructions for a Machine That Does Not Guess

You now have a sensor the Pi can see on the bus. Nobody has told the Pi what to do with it.

That is the job of a program: a list of instructions, written in a language the computer can follow exactly. And "exactly" is the operative word. A computer does precisely what you wrote, not what you meant. That sounds like a limitation, and mostly it is the reason programming is frustrating on your first day and reliable on your hundredth.

**Python** is a programming language designed to be readable, created by Guido van Rossum and first released in 1991. It is named after the comedy troupe Monty Python, not the snake, which is why the official documentation contains more jokes about spam than about reptiles.

Python is the right language for this project for reasons that are practical rather than sentimental:

- **It reads close to English.** A person who has never programmed can often guess what a Python program does.
- **It is already installed** on both Raspberry Pi OS and Ubuntu Server.
- **Sensor libraries exist for almost everything**, including the BME280.
- **It is forgiving.** You do not have to declare types or manage memory, which removes two entire categories of beginner error.
- **It is widely used in science**, so the skill transfers directly to data analysis and research work.

The trade is speed. Python runs more slowly than languages like C, and for something like video processing that matters. For reading a sensor once a minute it is irrelevant — your program will spend virtually all of its life waiting.

!!! note "This chapter is not a complete Python course"
    You are learning nine concepts, chosen because they are exactly what a data logger needs. There is a great deal more to Python — classes, comprehensions, decorators, generators — and none of it is required to build a working station. If you find you enjoy this, the language rewards going deeper. If you do not, what is here is sufficient.

## Variables and Data Types

A **variable** is a named place to store a value so it can be used later.

```python
temperature = 21.4
```

That line creates a variable called `temperature` and puts the value 21.4 in it. The `=` is not a statement of equality — it is an instruction: "take the value on the right and store it under the name on the left."

You use the name wherever you want the value:

```python
temperature = 21.4
print(temperature)
temperature = 22.1
print(temperature)
```

That prints `21.4` and then `22.1`. Variables vary; that is the point.

Naming matters more than beginners expect, because you will read your own code months later with no memory of writing it. The conventions in Python are lowercase words joined by underscores, and names that say what the value means:

```python
# Clear
station_elevation_m = 152
pressure_hpa = 1013.2
sample_interval_seconds = 60

# Unclear
x = 152
p = 1013.2
n = 60
```

Notice something the good names are doing beyond being readable: **they carry the unit**. `pressure_hpa` cannot be silently confused with a pressure in pascals. Given Chapter 2's Mars Climate Orbiter story, putting units in variable names is a cheap defence against an expensive class of bug.

A **data type** is the kind of value a variable holds. Python determines it automatically from what you assign, but you need to know the types because they behave differently.

| Type | Name | Example | Used in this project for |
|------|------|---------|--------------------------|
| Integer | `int` | `60` | Counts, intervals in whole seconds |
| Float | `float` | `21.4` | All sensor readings |
| String | `str` | `"2026-08-25T14:30:00Z"` | Timestamps, file names, CSV lines |
| Boolean | `bool` | `True` | Yes or no flags |
| List | `list` | `[21.4, 21.5, 21.3]` | Several readings for averaging |
| Dictionary | `dict` | `{"temp": 21.4, "rh": 62}` | One complete reading with named fields |

Two type behaviours will trip you up, and both are worth meeting deliberately rather than at 2 am.

**Strings and numbers are not interchangeable.** The value `"21.4"` in quotes is a string — a piece of text that happens to look like a number. You cannot do arithmetic on it:

```python
reading = "21.4"        # a string, from a file or a sensor library
result = reading + 1    # TypeError: can only concatenate str to str
result = float(reading) + 1   # 22.4 — convert first
```

This matters immediately in Chapter 14, because everything read back from a CSV file arrives as a string.

**Floats are approximations.** Computers store decimals in binary, and some decimal values have no exact binary representation, exactly as one third has no exact decimal representation.

```python
print(0.1 + 0.2)        # 0.30000000000000004
print(0.1 + 0.2 == 0.3) # False
```

This is not a Python bug; it is how binary floating point works everywhere. The consequence for your code is a rule: **never test floating point values for exact equality.** Test whether the difference is small enough:

```python
if abs(temperature - 21.4) < 0.001:
```

## Functions

A **function** is a named block of code that performs a task, can accept inputs, and can return a result.

You have already used one. `print()` is a function: you give it a value and it displays it.

Writing your own looks like this:

```python
def celsius_to_fahrenheit(celsius):
    fahrenheit = celsius * 9 / 5 + 32
    return fahrenheit
```

Taking it apart:

- `def` starts a function definition
- `celsius_to_fahrenheit` is the name
- `(celsius)` is the parameter — the input the function expects
- The indented lines are the body
- `return` sends a value back to whoever called the function

Call it by name:

```python
temp_c = 21.4
temp_f = celsius_to_fahrenheit(temp_c)
print(temp_f)    # 70.52
```

That indentation is not decoration. **Python uses indentation to determine structure**, where most languages use braces. The indented lines belong to the function; the unindented lines that follow do not. Inconsistent indentation is a syntax error, and mixing tabs with spaces produces errors that are invisible on screen. Configure your editor to insert four spaces when you press Tab, and the problem disappears permanently.

Functions earn their place for three reasons:

- **They avoid repetition.** Write the conversion once, use it everywhere.
- **They can be tested alone.** You can check `celsius_to_fahrenheit(0)` returns 32 without running the whole station.
- **They name an idea.** `calculate_dew_point(temp, humidity)` tells a reader what is happening far better than four lines of arithmetic.

Here is the Chapter 8 dew point formula as a function. Before the code: the parameters are `temperature_c`, the air temperature in degrees Celsius, and `relative_humidity`, in percent from 0 to 100. The constants `a` and `b` are the standard Magnus coefficients. The function returns the dew point in degrees Celsius. `math.log` is the natural logarithm.

```python
import math

def calculate_dew_point(temperature_c, relative_humidity):
    """Return dew point in Celsius using the Magnus formula."""
    a = 17.27
    b = 237.7
    gamma = (a * temperature_c) / (b + temperature_c) + math.log(relative_humidity / 100.0)
    dew_point_c = (b * gamma) / (a - gamma)
    return dew_point_c
```

The text in triple quotes is a docstring — a short description of what the function does. It is optional and worth writing every time, because it is what `help()` shows and what you will read when you come back to this in six months.

## Conditionals

A **conditional statement** runs different code depending on whether something is true.

```python
if temperature_c > 30:
    print("Heat warning")
```

Add alternatives with `elif` and `else`:

```python
if temperature_c > 35:
    print("Extreme heat")
elif temperature_c > 30:
    print("Hot")
elif temperature_c < 0:
    print("Below freezing")
else:
    print("Normal")
```

Python checks each condition in order and runs the **first** one that is true, then skips the rest. Order matters: if the `> 30` test came first, a temperature of 40 would report "Hot" and never reach "Extreme heat."

The comparison operators:

| Operator | Means |
|----------|-------|
| `==` | Equal to |
| `!=` | Not equal to |
| `<` `>` | Less than, greater than |
| `<=` `>=` | Less than or equal, greater than or equal |
| `and` | Both must be true |
| `or` | Either may be true |
| `not` | Reverses a condition |

!!! warning "One equals sign assigns, two compare"
    `=` stores a value. `==` asks whether two values are equal. Writing `if temperature = 30:` is a syntax error in Python — which is good news, because in some other languages it silently assigns 30 to the variable and evaluates as true, producing a bug that is genuinely difficult to find.

Conditionals are what let your station make decisions rather than merely record. The most valuable use is validating readings before you trust them:

```python
if pressure_hpa < 800 or pressure_hpa > 1100:
    print("Pressure outside plausible range - check the sensor")
```

That is Chapter 2's measurement range check written as code, and Chapter 15 builds on it.

## Loops

A **loop** repeats a block of code.

A monitoring station is essentially one enormous loop: read the sensors, write the values, wait, repeat, for months.

Two kinds are worth knowing.

A `for` loop repeats a known number of times, or once for each item in a collection:

```python
readings = [21.4, 21.5, 21.3, 21.6]
for reading in readings:
    print(reading)
```

Or a fixed count with `range()`:

```python
for i in range(4):
    print(i)    # prints 0, 1, 2, 3
```

Note that `range(4)` produces 0, 1, 2, 3 — four values starting at zero, not ending at four. Counting from zero is standard in programming and it catches everyone at least once.

A `while` loop repeats as long as a condition stays true:

```python
while True:
    print("Taking a reading")
    time.sleep(60)
```

`while True:` never ends on its own, which is exactly what a monitoring station wants. Stop it with Ctrl-C from the command line, or let the systemd service from Chapter 12 manage it.

The Chapter 4 averaging technique becomes a loop:

```python
def average_reading(sensor, count=16):
    """Take count readings and return their mean."""
    total = 0
    for i in range(count):
        total = total + sensor.temperature
        time.sleep(0.1)
    return total / count
```

The `count=16` gives the parameter a default value, so `average_reading(sensor)` uses 16 while `average_reading(sensor, 64)` uses 64. Recall from Chapter 4 that 16 readings cuts random noise to a quarter.

#### Diagram: Python Code Tracer

<iframe src="../../sims/python-code-tracer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Python Code Tracer</summary>
Type: microsim
**sim-id:** python-code-tracer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Apply (L3)
Bloom Verb: execute

Learning objective: The learner executes a Python program mentally by stepping through it line by line, predicting the value of each variable before it is revealed, and explains how loops and conditionals change the order of execution.

Purpose: Beginners read code as text rather than as a sequence of state changes, which is why they cannot find their own bugs. A tracer that makes execution order and variable state visible builds the mental model that debugging requires, and prediction-before-reveal is what turns watching into learning.

Canvas layout:
- Left two-thirds: the program listing with line numbers and a highlighted current line
- Right: a variables panel showing every variable currently in scope, its value, and its data type, with recently changed values flagged
- Below the variables panel: a simulated console output area
- Bottom: step controls and a program selector
- Responsive to window resize; the variables panel moves below the listing on narrow canvases

Data Visibility Requirements:
  Stage 1: Highlight the line about to execute
  Stage 2: Before executing, in prediction mode, ask "What will the value of X be after this line?" and accept a typed answer
  Stage 3: Execute the line and update the variables panel, marking changed values
  Stage 4: Show the data type alongside each value, so type changes are visible, e.g. `reading: "21.4" (str)` becoming `reading: 21.4 (float)`
  Stage 5: For loops, show the iteration counter and how many iterations remain
  Stage 6: For conditionals, show each condition being evaluated as True or False, and which branch was taken

Programs the tracer must include, in increasing difficulty:
1. **Variables and types** — assignment, reassignment, and a deliberate `"21.4" + 1` that raises a TypeError, with the error shown in the console exactly as Python would print it
2. **A function call** — celsius_to_fahrenheit, tracing into the function body, showing the parameter binding, and returning
3. **A conditional ladder** — the temperature warning example, run at several input values so the learner sees different branches taken
4. **A for loop with accumulation** — the averaging function, showing `total` growing each iteration and the division at the end
5. **An off-by-one bug** — `range(4)` where the author expected 1 through 4; the trace makes the zero-start visible
6. **A float equality trap** — `0.1 + 0.2 == 0.3` evaluating False, with the full `0.30000000000000004` shown in the variables panel

Interactive controls:
- Step forward, step back, run to end, reset
- Prediction mode toggle, on by default, which pauses before each state change and requests a prediction; score tracked across the program
- Editable input values for programs that take one, so the learner can re-run a conditional ladder at a different temperature
- Breakpoint setting by clicking a line number

Instructional Rationale: The objective is Apply/execute, and mentally executing code is precisely the skill being trained. Stepping backward is included because understanding often arrives one line after the confusion, and being able to reverse is what lets a learner re-examine the moment it went wrong. Prediction mode is the mechanism that prevents passive watching, which is the failure mode of every code-animation tool.

Implementation: p5.js. Do not attempt to interpret arbitrary Python. Pre-author each program as an explicit sequence of steps, each recording the line number, the resulting variable state, any console output, and any error. The tracer replays that sequence forward and backward.
</details>

## Libraries

A **Python library** is a collection of pre-written code that you can use in your own program.

This is where a project like this becomes possible for a beginner. Reading a BME280 from scratch means writing I2C transactions, reading calibration registers, and implementing Bosch's compensation formulas — several hundred lines, and every one a chance to introduce a subtle error. Somebody has already done that work correctly.

Bring a library in with `import`:

```python
import math
import time
```

Install libraries that are not built in using `pip`, Python's package installer, which Chapter 12's `apt install python3-pip` provided:

```
pip3 install adafruit-circuitpython-bme280
```

Libraries this project uses:

| Library | Provides | Built in? |
|---------|----------|-----------|
| `time` | Delays and clock access | Yes |
| `math` | Logarithms, square roots | Yes |
| `csv` | Reading and writing CSV files | Yes |
| `datetime` | Timestamps and time arithmetic | Yes |
| `board`, `busio` | Access to the Pi's I2C pins | No |
| `adafruit_bme280` | Talking to the BME280 | No |

Here is the whole point of libraries. Before the code: `busio.I2C` opens the I2C bus using the Pi's standard clock and data pins, which Chapter 12 identified as pins 5 and 3. The `Adafruit_BME280_I2C` line creates an object representing the sensor at address `0x76` — change to `0x77` if `i2cdetect` showed that instead. After that, the sensor's readings are available as ordinary attributes.

```python
import board
import busio
from adafruit_bme280 import basic as adafruit_bme280

i2c = busio.I2C(board.SCL, board.SDA)
sensor = adafruit_bme280.Adafruit_BME280_I2C(i2c, address=0x76)

print(sensor.temperature)     # degrees Celsius
print(sensor.pressure)        # hectopascals
print(sensor.humidity)        # percent relative humidity
```

Seven lines. Behind them sit the register reads, the calibration constants, and the compensation arithmetic described in Chapter 12 — all handled, all tested by thousands of users.

Note that this particular library returns pressure already converted to hectopascals, so the divide-by-100 warning from Chapter 7 does not apply here. Other libraries return pascals. **Check what units your library returns**, print one reading, and confirm it falls in the 980 to 1040 range before you build anything on top of it.

## When Things Go Wrong

Here is the situation that separates a demonstration from a station.

Your logger has been running for three weeks. At 03:17 on a Tuesday, a temperature swing causes a marginal solder joint to open briefly. The sensor does not respond. Your program crashes. It is 03:17, nobody notices, and you lose eleven days of data before anyone checks.

**Exception handling** is a way of catching errors when they occur and deciding what to do about them, instead of letting the program stop.

An exception is Python's way of reporting that something went wrong. Without handling, it prints a message and terminates:

```
OSError: [Errno 121] Remote I/O error
```

With handling, you decide:

```python
try:
    temperature = sensor.temperature
except OSError:
    print("Sensor did not respond")
    temperature = None
```

The `try` block contains code that might fail. The `except` block runs only if that specific error occurs. Either way, the program continues.

For a logger that must survive unattended, the pattern is a loop plus handling:

```python
import time

while True:
    try:
        temperature = sensor.temperature
        pressure = sensor.pressure
        humidity = sensor.humidity
        print(f"{temperature:.1f} C  {pressure:.1f} hPa  {humidity:.1f} %")
    except OSError as error:
        print(f"Sensor read failed: {error}")
    except Exception as error:
        print(f"Unexpected error: {error}")
    time.sleep(60)
```

Two things in that code need explaining before you use it.

The `f"..."` is an f-string — a string with `{}` placeholders that get replaced by variable values. Inside a placeholder, `:.1f` means "format as a floating point number with one decimal place," which is how you avoid printing `21.399999999999999`.

The two `except` blocks catch different things. The first catches `OSError` specifically, the error an I2C failure produces, and reports it clearly. The second catches anything else. Order matters — Python uses the first matching handler, so specific exceptions must come before general ones.

!!! warning "Do not silently swallow errors"
    This is a real temptation and it produces the worst kind of failure:

    ```python
    try:
        temperature = sensor.temperature
    except:
        pass    # never do this
    ```

    A bare `except:` catches everything, including your own typos and Ctrl-C. Combined with `pass`, it discards the error entirely. Your station appears to run perfectly while recording nothing, and there is no record of anything having gone wrong.

    Always catch specific exceptions where you can, and **always log what happened**. A gap in your data with a matching line in the log is a solvable mystery. A gap with no explanation is not.

#### Diagram: Resilient Logger Fault Bench

<iframe src="../../sims/resilient-logger-bench/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Resilient Logger Fault Bench</summary>
Type: microsim
**sim-id:** resilient-logger-bench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: critique

Learning objective: The learner critiques four versions of a logger loop against injected faults, and judges which error-handling strategy preserves both data and diagnosability.

Purpose: Students accept "use try/except" as a rule and then write bare `except: pass`, which is worse than no handling at all because it hides the failure. Running four strategies against the same fault sequence and comparing the resulting data files and logs makes the difference concrete rather than stylistic.

Canvas layout:
- Left: four side-by-side logger panels, each showing its code strategy in brief and its running state
- Center: a shared fault timeline the learner controls, applying identical faults to all four simultaneously
- Right or below (responsive): for each logger, the resulting data file contents and log file contents, scrollable
- Bottom: fault controls and a scoreboard
- Responsive to window resize; loggers stack into two columns then one on narrow canvases

The four strategies, all running the same read-and-append loop:
1. **No handling** — any exception terminates the program. Shows the traceback and then a permanently stopped logger with no further data.
2. **Bare except with pass** — `except: pass`. Never crashes, never records the failure. The data file simply has gaps and the log file is empty.
3. **Specific except with logging** — catches `OSError`, writes a log entry with a timestamp and the error text, continues. This is the chapter's recommended pattern.
4. **Specific except with logging and retry** — as above, but retries the read up to three times with a short delay before giving up on that interval.

Data Visibility Requirements:
  Stage 1: All four logging normally, files filling with identical rows
  Stage 2: On a fault, show each logger's immediate reaction — traceback, silence, log line, or retry attempts
  Stage 3: Show the resulting data file for each, with gaps visible as missing timestamps
  Stage 4: Show the log file for each, empty or populated
  Stage 5: At the end of the run, a comparison table: readings captured, readings lost, faults recorded, time offline

Injectable faults, applied to all four at once:
- **Transient I2C error** — one failed read. Logger 1 dies; logger 4 recovers with no data loss at all.
- **Sustained sensor failure, 30 minutes** — all four lose data, but only 3 and 4 leave any record of why.
- **Disk full** — a different exception type. Logger 3's `except OSError` catches it; a version catching only a sensor-specific exception would not, which the feedback must point out.
- **Ctrl-C from the operator** — the crucial case for logger 2, whose bare `except:` catches KeyboardInterrupt and refuses to stop. Feedback: "A bare except catches your attempt to quit. This logger cannot be stopped normally."
- **A typo in the logging code itself** — an exception raised inside the handler, showing that handlers can fail too

Required end-of-run verdict for each logger, e.g.: "Logger 2 captured 412 of 480 readings and recorded zero faults. Its data has 68 unexplained gaps. Six months from now nobody will be able to tell whether those gaps were weather, hardware, or a bug."

Interactive controls:
- Fault buttons applying each scenario at the current time
- Run speed control, from step-by-step to fast-forward
- A "write your own" panel where the learner selects which exception types to catch and whether to log and retry, producing a fifth logger scored alongside the others

Instructional Rationale: The objective is Evaluate/critique, which requires comparing alternatives against criteria. The criteria here are two and they conflict for the naive learner: keep running, and keep a record. Running identical faults through all four strategies simultaneously isolates the strategy as the only variable. The Ctrl-C case is included specifically because it is the argument against bare except that students find most persuasive — a program they cannot stop.

Implementation: p5.js. Simulate the loop as discrete ticks; represent each logger as a state machine with a strategy parameter governing its response to an injected fault. Render data and log files as scrollable text buffers.
</details>

## Running Your Program

**Script execution** is running a Python program as a file rather than typing statements one at a time.

Write your code in a file ending `.py`, then run it:

```
python3 logger.py
```

There is an alternative that makes the file behave like a command in its own right. Put this as the very first line of the file:

```python
#!/usr/bin/env python3
```

That is called a shebang, and it tells the system which interpreter to use. Combined with the execute permission from Chapter 12:

```
chmod +x logger.py
./logger.py
```

The `./` is required and means "in the current directory." Without it, the shell searches its list of standard program locations, does not find `logger.py`, and reports "command not found" — which is a confusing message when the file is plainly right there.

One more convention appears in nearly every Python program you will read:

```python
def main():
    # the program's work goes here
    pass

if __name__ == "__main__":
    main()
```

That conditional means "only run `main()` if this file is being executed directly, not if it is being imported by another file." It lets a file work both as a runnable program and as a library of functions another program can import — and it is why Chapter 14's logger can share its dew point function with an analysis script.

## Key Takeaways

- **Python** is readable, pre-installed, and well supplied with sensor libraries. It is slower than compiled languages, which does not matter for reading a sensor once a minute.
- A **variable** is a named store. Put units in the name — `pressure_hpa`, not `p`.
- A **data type** determines behaviour. Strings that look like numbers are not numbers. Floats are approximations, so never test them for exact equality.
- A **function** names an idea, avoids repetition, and can be tested alone. Indentation defines structure in Python, so configure your editor for four spaces.
- A **conditional statement** runs the first matching branch. `=` assigns, `==` compares.
- A **loop** repeats. `for` runs a known number of times; `while True:` runs forever, which is what a station wants.
- A **Python library** is pre-written code. Seven lines with `adafruit_bme280` replace several hundred written from scratch. Always check what units a library returns.
- **Exception handling** keeps a station alive through a transient fault. Catch specific errors, never use a bare `except: pass`, and always log the failure.
- **Script execution** runs a `.py` file. A shebang plus execute permission makes it runnable directly.

## Check Yourself

??? question "Why does `print(0.1 + 0.2 == 0.3)` print False? Click to check."
    Because floats are binary approximations of decimal values, and 0.1 and 0.2 have no exact binary representation — just as one third has no exact decimal representation. The sum comes to 0.30000000000000004, which is not equal to 0.3. This is not a Python quirk; it is how binary floating point works in every language. The rule that follows: compare floats by checking whether the difference is small, `abs(a - b) < 0.001`, not with `==`.

??? question "Your logger crashed at 03:17 and lost eleven days of data. What should the code have had? Click to check."
    Exception handling around the sensor read, inside the main loop. A `try`/`except OSError` block would have caught the transient I2C failure, logged it, and let the loop continue to the next reading. The failure would have cost one reading instead of eleven days. Note that the handler must also **log** the error — a gap in the data with a matching log entry is diagnosable; a gap with no record is not.

??? question "What does `for i in range(4):` print if the body is `print(i)`? Click to check."
    `0`, `1`, `2`, `3` — four values, starting at zero and stopping before four. `range(n)` produces n values beginning at 0. This catches essentially everyone once, usually as an off-by-one error where a loop runs one time too few or an index reaches past the end of a list.

??? question "You read a temperature from a CSV file and add 1. You get an error. Why? Click to check."
    Everything read from a file arrives as a **string**, so the value is `"21.4"` rather than `21.4`. Python will not add a number to a string and raises a TypeError rather than guessing what you meant. Convert first: `float(reading) + 1`. This will come up constantly in Chapter 15 when you read back your own logged data for analysis.

---

## What Is Next

You can now read a sensor and act on what it says. What you cannot yet do is remember any of it — every reading so far has been printed to a screen and then lost forever.

Chapter 14 fixes that. It covers choosing a sampling interval against your sensor's response time, building a time series from timestamped readings, and the structure of a CSV file down to the header row that names the units. It covers storage, file rotation, and backup for a dataset that grows every minute of every day, and it closes with metadata — the record of what was measured, where, and with what instrument, without which your data cannot be understood by anyone but you.
