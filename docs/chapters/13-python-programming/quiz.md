# Quiz: Programming the Station in Python

Test your understanding of variables, data types, functions, conditionals, loops, libraries, exception handling, and running a Python script with these review questions.

!!! mascot-tip "Trace It Line by Line"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When a question shows code, pretend you are the computer. Follow it one line at a time and do exactly what it says, not what you think it means.

---

#### 1. Which reason does the chapter give for using Python on this station?

<div class="upper-alpha" markdown>
1. It runs faster than any other programming language
2. It makes you declare every data type, which prevents errors
3. It is the only language that can run on a Raspberry Pi
4. It reads close to English, comes pre-installed, and has sensor libraries
</div>

??? question "Show Answer"
    The correct answer is **D**. Python is a readable programming language created by Guido van Rossum. It reads close to English, is already installed on both Raspberry Pi OS and Ubuntu Server, and has libraries for almost every sensor. Option A is backward, because Python is slower than languages like C. That does not matter when reading a sensor once a minute. Option B is wrong, because Python does not make you declare types. Option C is not true.

    **Concept Tested:** Python

    **See:** [Instructions for a Machine That Does Not Guess](index.md#instructions-for-a-machine-that-does-not-guess)

---

#### 2. Which Python data type is best for storing one complete reading with named fields, like `{"temp": 21.4, "rh": 62}`?

<div class="upper-alpha" markdown>
1. Dictionary
2. List
3. String
4. Integer
</div>

??? question "Show Answer"
    The correct answer is **A**. A data type is the kind of value a variable holds. A dictionary stores values under names, so one reading can keep its temperature and humidity clearly labeled. A list (B) holds several values in order, which suits a set of readings for averaging. A string (C) is text, like a timestamp. An integer (D) is a whole number, like a count of seconds.

    **Concept Tested:** Data Type

    **See:** [Variables and Data Types](index.md#variables-and-data-types)

---

#### 3. Which variable name best follows the chapter's advice?

<div class="upper-alpha" markdown>
1. `p`
2. `pressure_hpa`
3. `Pressure`
4. `reading2`
</div>

??? question "Show Answer"
    The correct answer is **B**. A variable is a named place to store a value. Python names use lowercase words joined by underscores, and a good name says what the value means. `pressure_hpa` also carries its unit, so nobody can mix it up with pascals. That is a cheap defense against a Mars Climate Orbiter kind of bug. Option A is too short to understand. Option C uses a capital letter. Option D says nothing about what it holds.

    **Concept Tested:** Variable

    **See:** [Variables and Data Types](index.md#variables-and-data-types)

---

#### 4. Why write the dew point arithmetic as a function called `calculate_dew_point()`?

<div class="upper-alpha" markdown>
1. It can be written once, tested alone, and tells readers what the code does
2. Code inside a function always runs faster than code outside one
3. Python only allows math formulas to appear inside functions
4. A function automatically catches any error that happens inside it
</div>

??? question "Show Answer"
    The correct answer is **A**. A function is a named block of code that can take inputs and return a result. Functions avoid repetition, because you write the formula once and use it everywhere. They can be tested alone, and their names tell readers what is happening. Option B is not a reason the chapter gives. Option C is false, because math can go anywhere. Option D is wrong, because catching errors needs `try` and `except`.

    **Concept Tested:** Function

    **See:** [Functions](index.md#functions)

---

#### 5. Why does the chapter warn against writing `except: pass` around a sensor read?

<div class="upper-alpha" markdown>
1. It makes the program stop as soon as any error happens
2. It only catches typos, so real sensor failures still crash the program
3. It hides every error, so the station seems fine while recording nothing
4. It makes Python retry the sensor read forever without waiting
</div>

??? question "Show Answer"
    The correct answer is **C**. Exception handling catches errors so the program can keep running. A bare `except:` catches everything, including typos and Ctrl-C, and `pass` throws the error away. The station appears to run perfectly while recording nothing, with no record of what went wrong. Option A is the opposite of what happens. Option B is wrong, because it catches everything. Option D is not what `pass` does. Always catch specific errors and log them.

    **Concept Tested:** Exception Handling

    **See:** [When Things Go Wrong](index.md#when-things-go-wrong)

---

#### 6. What does the `adafruit_bme280` library save you from doing?

<div class="upper-alpha" markdown>
1. Wiring the sensor to the Pi's power, ground, SDA, and SCL pins
2. Writing hundreds of lines of I2C reads, calibration, and compensation math
3. Ever checking what units the sensor readings are reported in
4. Installing anything at all, because it is built into Python
</div>

??? question "Show Answer"
    The correct answer is **B**. A Python library is pre-written code you can use in your own program. Reading a BME280 from scratch means writing I2C transactions, reading calibration registers, and coding Bosch's formulas. The library does that in about seven lines. Option A is wrong, because you still wire the sensor yourself. Option C is wrong, because you should always check the units a library returns. Option D is wrong, because this library is installed with `pip3`.

    **Concept Tested:** Python Library

    **See:** [Libraries](index.md#libraries)

---

#### 7. What does this code print when `temperature_c` is 34?

```python
if temperature_c > 25:
    print("Warm")
elif temperature_c > 32:
    print("Hot")
elif temperature_c < 0:
    print("Below freezing")
else:
    print("Normal")
```

<div class="upper-alpha" markdown>
1. `Hot`
2. `Warm` and then `Hot`
3. `Warm`
4. `Normal`
</div>

??? question "Show Answer"
    The correct answer is **C**. A conditional statement runs different code depending on what is true. Python checks each condition in order, runs only the first one that is true, and skips the rest. Since 34 is greater than 25, it prints `Warm` and never reaches the `> 32` test. Option A is what a reader expects, which shows why order matters. Option B is wrong, because only one branch runs. Option D runs only when nothing else is true.

    **Concept Tested:** Conditional Statement

    **See:** [Conditionals](index.md#conditionals)

---

#### 8. What does this loop print?

```python
for i in range(3):
    print(i * 10)
```

<div class="upper-alpha" markdown>
1. `10`, `20`, `30`
2. `0`, `10`, `20`
3. `0`, `10`, `20`, `30`
4. `30`
</div>

??? question "Show Answer"
    The correct answer is **B**. A loop repeats a block of code. `range(3)` produces three values, 0, 1, and 2, starting at zero and stopping before three. Each value is multiplied by 10, so the loop prints 0, 10, and 20. Option A assumes counting starts at one. Option C runs the loop one time too many. Option D prints only a single value, as if the loop ran once.

    **Concept Tested:** Loop

    **See:** [Loops](index.md#loops)

---

#### 9. You put a shebang line at the top of `logger.py` and run `chmod +x logger.py`. Typing `logger.py` gives "command not found." What should you type instead?

<div class="upper-alpha" markdown>
1. `run logger.py`
2. `sudo logger.py`
3. `nano logger.py`
4. `./logger.py`
</div>

??? question "Show Answer"
    The correct answer is **D**. Script execution means running a Python program as a file. The `./` means "in the current directory." Without it, the shell searches only its standard program locations, does not find the file, and reports "command not found." Option A is not a real command here. Option B adds superuser power but does not fix the search problem. Option C opens the file in a text editor instead of running it.

    **Concept Tested:** Script Execution

    **See:** [Running Your Program](index.md#running-your-program)

---

#### 10. When the sensor fails to respond, this code always prints "Unexpected error" and never "Sensor read failed." What best explains this?

```python
try:
    pressure = sensor.pressure
except Exception as error:
    print(f"Unexpected error: {error}")
except OSError as error:
    print(f"Sensor read failed: {error}")
```

<div class="upper-alpha" markdown>
1. The general handler comes first, and Python uses the first handler that matches
2. An `OSError` can never be caught by an `except` block in Python
3. The f-strings are written wrong, so the second message cannot print
4. Python runs both handlers, and the first message hides the second one
</div>

??? question "Show Answer"
    The correct answer is **A**. In exception handling, Python uses the first `except` block that matches the error. `Exception` matches almost everything, including the `OSError` from an I2C failure, so the specific handler never gets a chance. Put specific exceptions before general ones. Option B is wrong, because `OSError` can be caught. Option C is wrong, because both f-strings are fine. Option D is wrong, because only one handler runs.

    **Concept Tested:** Exception Handling

    **See:** [When Things Go Wrong](index.md#when-things-go-wrong)

---

!!! mascot-celebration "Code Running Smoothly!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Wonderful work, station builders! You can now read Python with variables, functions, conditionals, loops, and libraries, and you know how to keep a script alive when a sensor stumbles. Every number tells a story.
