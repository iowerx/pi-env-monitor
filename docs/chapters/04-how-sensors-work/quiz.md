# Quiz: How Sensors Turn the World Into Numbers

Test your understanding of transduction, analog and digital signals, analog-to-digital conversion, sensor materials, response time, averaging, filtering, and datasheets with these review questions.

!!! mascot-tip "Follow the Signal"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    For each question, picture where the reading is on its journey: a physical change, an analog signal, or a digital number. Knowing the stage often points straight to the answer.

---

#### 1. In a sensor, what does transduction mean?

<div class="upper-alpha" markdown>
1. Storing a physical measurement as a number in a computer file
2. Rounding each sample to one of a fixed set of levels
3. Converting a physical property into an electrical property
4. Removing noise from a signal while keeping the real changes
</div>

??? question "Show Answer"
    The correct answer is **C**. A sensor detects a physical property and converts it into a signal. Transduction is the name for that conversion. In a sensor, it turns a physical property like temperature into an electrical property like resistance, capacitance, or voltage. Option A describes logging, which happens much later. Option B is quantization, one step of analog-to-digital conversion. Option D describes filtering. None of those is the physical-to-electrical change.

    **Concept Tested:** Sensor and Transduction

    **See:** [Transduction](index.md#transduction)

---

#### 2. What makes a MEMS sensor different from other sensors on a chip?

<div class="upper-alpha" markdown>
1. It uses light to release electrons from the silicon
2. It has microscopic moving mechanical parts etched into silicon
3. It is a large mechanical gauge connected to the chip by wires
4. It generates its own voltage from two metals joined together
</div>

??? question "Show Answer"
    The correct answer is **B**. MEMS stands for Micro-Electro-Mechanical System. A MEMS sensor has real moving parts, like tiny beams, springs, and diaphragms, built onto a silicon chip. The pressure element inside the BME280 is a MEMS part. Option A describes the photoelectric effect. Option C is wrong because MEMS parts are measured in micrometers, not large gauges. Option D describes a thermocouple, which generates a voltage from two joined metals.

    **Concept Tested:** MEMS Sensor

    **See:** [MEMS](index.md#mems)

---

#### 3. Radio waves and gamma rays are both part of the electromagnetic spectrum. According to the chapter, what is the only difference between them?

<div class="upper-alpha" markdown>
1. Their brightness
2. Their color
3. Whether they carry energy
4. Their wavelength
</div>

??? question "Show Answer"
    The correct answer is **D**. The electromagnetic spectrum is the full range of electromagnetic radiation, ordered by wavelength. Radio waves and gamma rays are the same kind of thing. They differ only in wavelength, the way a low note and a high note differ only in frequency. Brightness (A) is not what separates them. Color (B) only applies to the narrow visible band. Option C is not the difference the chapter describes.

    **Concept Tested:** Electromagnetic Spectrum

    **See:** [The Photoelectric Effect](index.md#the-photoelectric-effect)

---

#### 4. How can a small piece of silicon work as a light sensor?

<div class="upper-alpha" markdown>
1. Light striking the silicon releases electrons, making a current that grows with the light
2. Light warms the silicon, and the sensor reports the silicon's rising temperature
3. Light bends a tiny beam in the silicon, and the sensor measures the movement
4. Light changes the gap in a polymer film on the silicon, changing its capacitance
</div>

??? question "Show Answer"
    The correct answer is **A**. Silicon is a semiconductor, a material whose conduction responds to heat, pressure, and light. The photoelectric effect is the release of electrons when light strikes a material. Silicon exposed to light makes a current proportional to how much light lands on it. That is a photodiode, used in the Chapter 9 solar sensor. Option B describes a temperature sensor. Option C describes a MEMS part. Option D describes a humidity sensor.

    **Concept Tested:** Semiconductor and Photoelectric Effect

    **See:** [What Sensors Are Actually Made Of](index.md#what-sensors-are-actually-made-of)

---

#### 5. Electrical noise on a wire nudges a signal by 0.01 V. Why does this matter less for a digital signal than for an analog one?

<div class="upper-alpha" markdown>
1. Digital signals use higher voltages that noise cannot reach
2. A slightly noisy 1 is still clearly a 1, so the information survives
3. Digital signals take infinitely many values, so the noise averages out
4. Analog wires are longer, so they pick up more noise along the way
</div>

??? question "Show Answer"
    The correct answer is **B**. A digital signal has only a limited set of values, usually just high and low. A small nudge does not change which value it is. An analog signal varies smoothly and can take any value, so a 0.01 V nudge permanently changes the measurement. Option C mixes up the two, because analog signals are the ones with infinitely many values. Options A and D are not reasons the chapter gives.

    **Concept Tested:** Analog Signal and Digital Signal

    **See:** [Analog and Digital](index.md#analog-and-digital)

---

#### 6. Your BME280 reads 0.4 °C higher than a reference thermometer. Its datasheet lists temperature accuracy as ±1.0 °C. What does this tell you?

<div class="upper-alpha" markdown>
1. The sensor is broken and should be replaced right away
2. Your code has a bug that adds 0.4 °C to every reading
3. The reference thermometer is wrong, because sensors know the true temperature
4. The difference is within the stated accuracy, so the sensor is working as specified
</div>

??? question "Show Answer"
    The correct answer is **D**. A sensor datasheet is the maker's document listing range, accuracy, resolution, and more. An accuracy of ±1.0 °C means a 0.4 °C difference is normal for this sensor. Checking the datasheet first can save hours of chasing a bug that does not exist (B). The sensor is not broken (A). Option C is a misconception, because a sensor does not "know" the temperature. It only supplies physics.

    **Concept Tested:** Sensor Datasheet

    **See:** [Reading a Datasheet](index.md#reading-a-datasheet)

---

#### 7. A 10-bit ADC covers a range of 0 to 3.3 V. About what is the smallest voltage step it can report?

<div class="upper-alpha" markdown>
1. 0.81 mV
2. 12.9 mV
3. 3.2 mV
4. 0.05 mV
</div>

??? question "Show Answer"
    The correct answer is **C**. Analog-to-digital conversion rounds each sample to one of a fixed set of levels. A 10-bit ADC has \(2^{10} = 1024\) levels. Spreading 3.3 V across 1024 levels gives steps of about 3.2 mV. Option A is the step for a 12-bit ADC, option B is for an 8-bit ADC, and option D is for a 16-bit ADC. More bits give finer resolution, but finer resolution is not the same as accuracy.

    **Concept Tested:** Analog To Digital Conversion

    **See:** [Analog-to-Digital Conversion](index.md#analog-to-digital-conversion)

---

#### 8. One temperature reading has about 0.4 °C of random noise. If you average 16 readings, about how much noise is left?

<div class="upper-alpha" markdown>
1. 0.025 °C
2. 0.2 °C
3. 0.1 °C
4. 0.4 °C
</div>

??? question "Show Answer"
    The correct answer is **C**. Sensor averaging reduces random noise by a factor of \(\sqrt{N}\). The square root of 16 is 4, so 0.4 °C ÷ 4 = 0.1 °C. Option A divides by 16 instead of by its square root, which is the most common mistake. Option B divides by 2, which is what 4 readings would do. Option D assumes averaging does nothing. Because of the square root, each extra reading helps a little less.

    **Concept Tested:** Sensor Averaging

    **See:** [Filtering and Averaging](index.md#filtering-and-averaging)

---

#### 9. A temperature sensor in a thick plastic housing has a response time of about 5 seconds. Which sampling plan best fits this sensor?

<div class="upper-alpha" markdown>
1. Read it about once every 5 seconds
2. Read it 10 times per second to catch changes sooner
3. Read it 5 times per second, once for each second of response time
4. Read it 100 times per second and keep only the highest value
</div>

??? question "Show Answer"
    The correct answer is **A**. Sensor response time is how long a sensor takes to reflect a change. The rule is never to sample faster than the sensor can respond. With a 5-second response time, reading about every 5 seconds matches the sensor's pace. Options B, C, and D all sample much faster. Most of those readings would only show the sensor catching up to an earlier change. You would get more data and burn more power, but gain no new information.

    **Concept Tested:** Sensor Response Time

    **See:** [Sensors Take Time](index.md#sensors-take-time)

---

#### 10. A station applies a strong filter to its pressure readings. The graph looks smooth, but a sudden pressure drop from a passing squall line is missing. What best explains this?

<div class="upper-alpha" markdown>
1. The pressure sensor responds too slowly to notice any quick change
2. The filter could not tell the real fast drop from noise, so it smoothed the drop away
3. Filtering only removes noise, so the squall line must not have passed the station
4. The ADC's resolution was too coarse to report a change in pressure
</div>

??? question "Show Answer"
    The correct answer is **B**. Sensor filtering removes unwanted parts of a signal, but a filter cannot tell noise from a real, fast change. Heavy filtering turns a sudden drop into a gentle slope. Option A is wrong because BME280 pressure responds nearly instantly. Option C wrongly assumes a filter only ever removes noise. Option D is wrong because the BME280 resolves pressure in steps of 0.18 Pa. Its datasheet recommends a weaker filter for weather monitoring.

    **Concept Tested:** Sensor Filtering

    **See:** [Filtering and Averaging](index.md#filtering-and-averaging)

---

!!! mascot-celebration "Signal Received!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Excellent work, observers! You traced a reading from transduction through analog-to-digital conversion and learned how response time, averaging, and filtering shape the numbers you log. Every number tells a story.
