# Quiz: The Language of Measurement

Test your understanding of units, SI prefixes, unit conversion, measurement scales, and the vocabulary of measurement quality with these review questions.

!!! mascot-tip "Look for the Unit"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When a question gives you a number, find its unit before you do anything else. A number without its unit is only half a reading!

---

#### 1. Weather reports give air pressure in hectopascals. How many pascals are in one hectopascal?

<div class="upper-alpha" markdown>
1. 10 pascals
2. 100 pascals
3. 1000 pascals
4. One-hundredth of a pascal
</div>

??? question "Show Answer"
    The correct answer is **B**. An SI prefix is a syllable added to the front of a unit that multiplies it by a power of ten. The prefix hecto means 100, or \(10^{2}\), so one hectopascal is 100 pascals. Option C is kilo, which means 1000. Option D is centi, which means one-hundredth. Option A is not one of the prefixes in this chapter. Hecto is rare except in pressure readings, where it shows up all the time.

    **Concept Tested:** SI Prefix

    **See:** [Prefixes and Very Large or Very Small Numbers](index.md#prefixes-and-very-large-or-very-small-numbers)

---

#### 2. When you calibrate your station's thermometer, what should you compare it to?

<div class="upper-alpha" markdown>
1. Readings taken by the same thermometer last week
2. The average of many readings from your own sensor
3. The accuracy value printed on the sensor's datasheet
4. A better thermometer that traces back to a reference standard
</div>

??? question "Show Answer"
    The correct answer is **D**. Calibration means comparing an instrument to a reference standard and correcting it. A reference standard is the object or procedure that defines a unit. You compare your thermometer to a better one, which was compared to a better one still, up a chain to a national lab. Options A and B compare the sensor to itself, so a sensor that always reads high would never be caught. Option C only tells you how far off the sensor might be.

    **Concept Tested:** Calibration and Reference Standard

    **See:** [What Makes a Measurement Good](index.md#what-makes-a-measurement-good)

---

#### 3. The BME280 sensor measures pressure from 300 to 1100 hPa. What happens if the real pressure is outside that span?

<div class="upper-alpha" markdown>
1. The sensor gives a reading that is slightly less accurate
2. The sensor switches itself to a wider range automatically
3. The sensor still works but with a lower resolution
4. The sensor gives no useful reading at all
</div>

??? question "Show Answer"
    The correct answer is **D**. Measurement range is the span between the smallest and largest values an instrument can measure at all. Outside its range, the BME280 does not give a slightly worse reading (A). It gives no useful reading whatsoever. The sensor does not switch ranges on its own (B), and resolution (C) is a different idea. That is why you should check that the values you expect sit comfortably inside a sensor's range, not at the edge.

    **Concept Tested:** Measurement Range

    **See:** [What Makes a Measurement Good](index.md#what-makes-a-measurement-good)

---

#### 4. Which term names the smallest change an instrument can detect and report?

<div class="upper-alpha" markdown>
1. Accuracy
2. Precision
3. Resolution
4. Measurement range
</div>

??? question "Show Answer"
    The correct answer is **C**. Resolution is the smallest change an instrument can detect and report. A thermometer that displays 21.3 °C has a resolution of 0.1 °C. Accuracy (A) is how close a reading is to the true value. Precision (B) is how close repeated readings are to each other. Measurement range (D) is the span of values an instrument can read at all. Remember that high resolution does not mean a reading is correct.

    **Concept Tested:** Resolution

    **See:** [What Makes a Measurement Good](index.md#what-makes-a-measurement-good)

---

#### 5. What caused the loss of the Mars Climate Orbiter in 1999?

<div class="upper-alpha" markdown>
1. A thruster broke during the long flight from Earth to Mars
2. One program used pound-force seconds, and another assumed newton-seconds
3. Engineers wrote a number in scientific notation with the wrong exponent
4. The orbiter's sensors could not read the thin atmosphere of Mars
</div>

??? question "Show Answer"
    The correct answer is **B**. A unit of measure is an agreed amount that other amounts are compared to. One team's software reported thruster force in pound-force seconds. The other team's software assumed newton-seconds. Nobody checked, so every firing was off by a factor of about 4.45. The investigation found no broken part (A). Options C and D did not happen. A $327 million spacecraft was lost because two teams did not agree on a unit.

    **Concept Tested:** Unit Of Measure

    **See:** [The $327 Million Unit Error](index.md#the-327-million-unit-error)

---

#### 6. Why is 20 °C not twice as warm as 10 °C?

<div class="upper-alpha" markdown>
1. The degrees on the Celsius scale are not evenly spaced
2. Ordinary thermometers are not accurate enough to compare them
3. Celsius is an ordinal scale, like the Beaufort wind scale
4. Zero on the Celsius scale does not mean "no temperature"
</div>

??? question "Show Answer"
    The correct answer is **D**. A measurement scale is the set of rules that says what numbers mean. Celsius puts zero at the freezing point of water, which is an arbitrary choice. Since zero does not mean "none," ratios do not work. In kelvin, the two temperatures are only about 3.5 percent apart. Option A is wrong because Celsius gaps are even. Option C is wrong because Celsius is an interval scale, not ordinal. Accuracy (B) has nothing to do with it.

    **Concept Tested:** Measurement Scale

    **See:** [Scales and What Numbers Mean](index.md#scales-and-what-numbers-mean)

---

#### 7. A station builder reports a temperature as 21.3 ± 0.5 °C. What does the "± 0.5" tell readers?

<div class="upper-alpha" markdown>
1. The true temperature is very likely between 20.8 and 21.8 °C
2. The sensor made a mistake of exactly 0.5 °C on this reading
3. The temperature changed by 0.5 °C while the reading was taken
4. The thermometer can only display steps of 0.5 °C
</div>

??? question "Show Answer"
    The correct answer is **A**. Measurement uncertainty is an honest statement of how much a measurement could be off. The plus-or-minus means the true value is very likely between 20.8 and 21.8 °C. It does not claim the error is exactly 0.5 (B). It is not about the air changing (C), and it is not the display step (D), which is resolution. Reporting a number with no uncertainty claims more than you really know.

    **Concept Tested:** Measurement Uncertainty

    **See:** [What Makes a Measurement Good](index.md#what-makes-a-measurement-good)

---

#### 8. Why is earthquake ground motion usually shown on a logarithmic scale?

<div class="upper-alpha" markdown>
1. Earthquakes happen too quickly to plot on a normal scale
2. A logarithmic scale makes small earthquakes look bigger than they are
3. Ground motion spans many orders of magnitude, from tiny to huge
4. Seismometers can only report their readings as whole numbers
</div>

??? question "Show Answer"
    The correct answer is **C**. An order of magnitude is a factor of ten. Ground motion from a barely felt tremor and a huge quake can differ by a factor of millions. On a logarithmic scale, each step multiplies by ten instead of adding one, so all the quakes fit on one chart. On a normal scale, every quake except the biggest would be a flat line. Speed (A) and whole numbers (D) are not the reason. The scale does not distort sizes (B).

    **Concept Tested:** Logarithmic Scale and Order Of Magnitude

    **See:** [Scales and What Numbers Mean](index.md#scales-and-what-numbers-mean)

---

#### 9. Your wind sensor reports 5 m/s. One meter per second equals 3.6 km/h. Using the fraction method, what is the wind speed in km/h?

<div class="upper-alpha" markdown>
1. 1.4 km/h
2. 8.6 km/h
3. 18 km/h
4. 180 km/h
</div>

??? question "Show Answer"
    The correct answer is **C**. Unit conversion means multiplying by a fraction equal to one: 5 m/s × (3.6 km/h ÷ 1 m/s) = 18 km/h. The m/s cancels top and bottom, leaving km/h. Option A comes from setting the fraction upside down and dividing, so the units would not cancel. Option B adds the numbers instead of multiplying. Option D slips a decimal place. Watching units cancel checks the setup before you do any math.

    **Concept Tested:** Unit Conversion

    **See:** [Converting Between Units](index.md#converting-between-units)

---

#### 10. The true temperature is 20.0 °C. Sensor X reads 23.1, 23.0, 23.1, 23.0. Sensor Y reads 18, 22, 19, 21. Which plan best fixes each sensor's problem?

<div class="upper-alpha" markdown>
1. Calibrate X with an offset of about −3 °C, and average many readings from Y
2. Calibrate Y with an offset of about −3 °C, and average many readings from X
3. Apply the same −3 °C offset to both sensors, since both read wrong
4. Replace both sensors, since neither one is accurate and precise
</div>

??? question "Show Answer"
    The correct answer is **A**. Sensor X is precise but not accurate. Its readings agree closely but sit about 3 °C high. Calibration fixes that kind of error with an offset. Sensor Y is fairly accurate on average but not precise, because its readings scatter. Averaging many readings helps that problem. Option B reverses the two problems. Option C would make Y read too low. Option D is only needed when a sensor is neither accurate nor precise.

    **Concept Tested:** Accuracy and Precision

    **See:** [What Makes a Measurement Good](index.md#what-makes-a-measurement-good)

---

!!! mascot-celebration "Measurement Words Mastered!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Well done, station builders! You worked through units, prefixes, conversions, scales, and the difference between accuracy and precision. Check the data, then check it again.
