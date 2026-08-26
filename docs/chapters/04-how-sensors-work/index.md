---
title: How Sensors Turn the World Into Numbers
description: Transduction, analog and digital signals, analog-to-digital conversion, and the semiconductor, MEMS, and photoelectric mechanisms that make electronic sensing possible.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 21:53:43
version: 0.09
---
# How Sensors Turn the World Into Numbers

## Summary

A computer can only store numbers, so something has to convert a physical property into one. This chapter introduces transduction as the central idea, then follows a measurement from an analog signal through analog-to-digital conversion into a digital value. It covers the materials that make this possible — semiconductors, MEMS structures, and the photoelectric effect — along with sensor response time, filtering, and averaging. Readers learn to read a datasheet, which is how every later sensor chapter is grounded.

## Concepts Covered

This chapter covers the following 13 concepts from the learning graph:

1. Electromagnetic Spectrum
2. Sensor
3. Transduction
4. Sensor Response Time
5. Semiconductor
6. Analog Signal
7. Photoelectric Effect
8. MEMS Sensor
9. Digital Signal
10. Sensor Filtering
11. Analog To Digital Conversion
12. Sensor Datasheet
13. Sensor Averaging

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 3: Electricity and the Single-Board Computer](../03-electricity-and-computer/index.md)

---

## The Problem With Computers

A computer cannot feel anything.

It has no skin, no eyes, and no sense of hot or cold. It can do exactly one thing: move numbers around and do arithmetic on them. Everything a computer appears to do — show a photograph, play a song, warn you about a storm — is numbers underneath.

So there is a gap. On one side is the physical world, full of warmth and pressure and light. On the other is a machine that only understands numbers. Something has to bridge that gap, and that something is a sensor.

A **sensor** is a device that detects a physical property and converts it into a signal that can be recorded, displayed, or acted on. Every measurement in this entire book passes through one.

The word "converts" is the important one. A sensor does not observe temperature the way you observe a sunset. It undergoes a physical change *because of* the temperature, and that change is something electrical.

## Transduction

**Transduction** is the conversion of one form of energy or signal into another. In a sensor, it means converting a physical property into an electrical property.

You already own several transducers.

- A microphone converts sound pressure into a voltage.
- A speaker converts a voltage back into sound pressure.
- A camera sensor converts light into electric charge.
- Your ear converts sound pressure into nerve signals.

The trick of building a sensor is finding a material whose *electrical* behavior changes reliably when some *physical* property changes. Engineers have collected a handful of these material behaviors over the past two centuries, and nearly every sensor in the world is built on one of them.

There are three electrical properties that usually do the changing:

| Electrical property | What it means | A sensor that uses it |
|---------------------|---------------|------------------------|
| Resistance | How hard it is for current to flow | A thermistor: resistance falls as temperature rises |
| Capacitance | How much charge a gap can store | A humidity sensor: a polymer film absorbs water, changing the gap |
| Voltage generated | The material produces a voltage itself | A thermocouple: two joined metals produce a voltage that depends on temperature |

Two of the three need to be *asked*. A resistance change does nothing on its own — you have to pass a current through the material and measure what happens. Only the third kind generates a signal by itself.

That is why a sensor needs power. The 3.3 V line from Chapter 3 is not powering a little computer inside the sensor. It is providing the current that makes an invisible resistance change visible as a voltage.

!!! note "A sensor is not a meter"
    A common misconception is that a temperature sensor "knows" the temperature. It does not. A chunk of silicon inside it has a resistance that happens to depend on temperature in a well-documented way. Everything else — the conversion to degrees, the decimal point, the units — is arithmetic done afterward by the computer, using a formula from the manufacturer. The sensor supplies physics. The number is your job.

## Analog and Digital

The signal that comes out of a transducer is almost always analog.

An **analog signal** is one that varies smoothly and can take any value within its range. Temperature is analog. So is the voltage from a thermocouple. Between 1.000 V and 1.001 V there are infinitely many possible values, and a true analog signal passes through all of them.

A **digital signal** has only a limited set of possible values, usually just two: high and low, on and off, 1 and 0. It does not slide smoothly between them. It steps.

Both kinds have real advantages, and the difference matters for how your station behaves:

| | Analog signal | Digital signal |
|---|---|---|
| Possible values | Infinitely many | A fixed, countable set |
| Behaves like | A dimmer switch | A light switch |
| Noise picked up on a wire | Adds to the signal permanently | Usually ignored — a slightly noisy 1 is still a 1 |
| Copying it | Degrades every time | Perfect, every time |
| A computer can store it | No, not directly | Yes |

That noise row is why the world went digital. Nudge an analog signal by 0.01 V and you have permanently changed the measurement, and nothing downstream can tell that it happened. Nudge a digital signal by 0.01 V and it is still unambiguously a 1. The information survives.

So a computer needs a digital signal, and physics hands us an analog one. Something has to translate.

## Analog-to-Digital Conversion

**Analog-to-digital conversion** is the process of measuring an analog signal at particular moments and representing each measurement as a number. The circuit that does it is called an ADC.

Conversion involves two separate approximations, and confusing them is a common source of error later.

**Sampling** happens in time. Instead of watching the signal continuously, the ADC looks at it at regular instants and ignores everything in between. Sample once per second and you have one value per second — whatever happened during that second is gone.

**Quantization** happens in value. The ADC must round each sample to one of a fixed set of levels. The number of available levels is set by the converter's bit depth. An 8-bit ADC has \(2^8 = 256\) levels. A 12-bit ADC has \(2^{12} = 4096\). A 16-bit ADC has \(2^{16} = 65536\).

More levels means finer resolution — and resolution is the word you met in Chapter 2, meaning the smallest change that can be detected and reported. Suppose an ADC covers a 0 to 3.3 V range:

| Bit depth | Levels | Smallest step it can report |
|-----------|--------|----------------------------|
| 8-bit | 256 | 12.9 mV |
| 10-bit | 1024 | 3.2 mV |
| 12-bit | 4096 | 0.81 mV |
| 16-bit | 65536 | 0.05 mV |

Notice that resolution is not accuracy. A 16-bit ADC reports very fine steps, but if the sensor feeding it is 2 degrees off, the reading is still 2 degrees off — just expressed with a great many digits. Chapter 2's warning applies directly here.

Here is a piece of good news about your specific hardware. The Raspberry Pi has no built-in ADC at all, which sounds like a serious limitation. It does not matter for this project, because the BME280 has its own ADC on the chip and sends the Pi a digital signal directly. The conversion happens inside the sensor package, before the wire.

#### Diagram: Analog to Digital Conversion Step-Through

<iframe src="../../sims/analog-to-digital-stepthrough/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Analog to Digital Conversion Step-Through</summary>
Type: microsim
**sim-id:** analog-to-digital-stepthrough<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Understand (L2)
Bloom Verb: explain

Learning objective: The learner explains how a smooth analog signal becomes a sequence of numbers, and distinguishes information lost to sampling in time from information lost to quantization in value.

Purpose: Students routinely merge sampling and quantization into one vague idea called "digitizing." Separating them into two independently adjustable controls, applied to the same waveform, is the clearest way to show that they are different losses with different consequences.

Canvas layout:
- Top panel: the original smooth analog waveform drawn as a continuous curve
- Middle panel: the same waveform with sample instants marked as vertical drop lines and dots
- Bottom panel: the quantized digital result drawn as a stair-step, with horizontal quantization levels shown as faint gridlines
- Right or below (responsive): a data table showing the last eight samples with their exact analog value, their quantized value, and the error between them
- Controls at bottom
- Fully responsive to window resize; all three panels stack and scale

Data Visibility Requirements:
  Stage 1: Show the raw analog waveform with its true value at the cursor position, e.g. "1.8347 V"
  Stage 2: Show the sample instants; at the cursor, display which sample is nearest and what moment it was taken
  Stage 3: Show the quantization levels as gridlines and, at the cursor, which level the sample rounds to, e.g. "1.8347 V rounds to level 2276 of 4096 = 1.8329 V"
  Stage 4: Show the quantization error explicitly, e.g. "error: 0.0018 V"
  Stage 5: In the data table, show all four columns for the recent samples so the pattern of errors is visible rather than a single instance

Interactive controls:
- Waveform selector: "slow sine (like a daily temperature cycle)", "fast sine", "step change (like a cold front arriving)", "noisy signal"
- Sample rate slider: 1 to 100 samples per waveform cycle, default 20
- Bit depth selector: 2, 4, 8, 12, 16 bits, default 8. Two bits is included deliberately so the stair-step becomes absurdly coarse and the idea is unmistakable.
- Step-through buttons: "Next sample" and "Previous sample", which move a cursor one sample at a time and update every readout
- "Play" advances samples slowly; the learner can pause at any point

Required demonstration case: with the "step change" waveform and a low sample rate, the sim must show the step occurring BETWEEN two samples, and display a message: "The signal changed at 4.3 seconds. The next sample was at 5.0 seconds. Between those moments, nothing was recorded. Sampling loses time, not just value."

Instructional Rationale: The objective is Understand/explain, so this is specified as a step-through with concrete values visible at every stage, not a continuous animation. A learner must be able to stop on one sample and read its exact analog value, its quantized value, and the difference — those three numbers side by side are the explanation. Continuous animation would show motion but hide the arithmetic.

Implementation: p5.js. Generate the analog waveform as a mathematical function so the true value at any time is exactly computable. Quantize with floor((v/vmax) * levels). Keep the recent-sample table as a rolling buffer of eight entries.
</details>

## What Sensors Are Actually Made Of

Three materials and structures account for nearly every sensor in this book. You met the first briefly in Chapter 3.

### Semiconductors

A **semiconductor** is a material that conducts electricity better than an insulator like glass but worse than a conductor like copper — and, crucially, whose conductivity can be changed. Silicon is the semiconductor that built the modern world.

The useful thing about semiconductors is not that they conduct moderately well. It is that their conduction responds to things. Heat a piece of silicon and its conductivity changes in a predictable way. Squeeze it and its resistance changes. Shine light on it and it produces a current. Each of those responses is a sensor waiting to be packaged.

Better still, semiconductors can be manufactured in enormous quantities by the same processes that make computer chips. That is why a sensor measuring three separate quantities costs a few dollars instead of a few hundred.

### MEMS

A **MEMS sensor** — Micro-Electro-Mechanical System — is a device with microscopic moving mechanical parts built onto a silicon chip using chip-manufacturing techniques.

Read that again, because it is genuinely strange. There are real moving parts, etched into silicon, measured in micrometers. A tiny beam that bends. A tiny mass on tiny springs. A diaphragm thinner than a hair that flexes under pressure.

MEMS devices are all around you:

- The accelerometer that rotates your phone's screen
- The sensor that decides when a car airbag should fire
- The pressure element inside the BME280 on your desk
- The microphone in wireless earbuds

The airbag application is what created the industry. Cars needed a crash sensor that was cheap enough to put in every vehicle and reliable enough to be trusted with a life. Analog Devices shipped the ADXL50 in 1991, and within a decade the manufacturing volume had driven prices low enough that MEMS sensors became worth putting into everything. Chapter 11 returns to this, because a MEMS accelerometer is how a student station can detect an earthquake at all.

### The Photoelectric Effect

The third mechanism concerns light, so it needs one idea from physics first.

The **electromagnetic spectrum** is the full range of electromagnetic radiation, ordered by wavelength. Visible light is a narrow band in the middle of it. On the long-wavelength side sit infrared, microwaves, and radio waves. On the short-wavelength side sit ultraviolet, X-rays, and gamma rays.

It is all the same phenomenon. Radio waves and gamma rays differ only in wavelength, the way a low note and a high note differ only in frequency. Your eyes happen to respond to one narrow slice, and everything else is invisible to you without an instrument.

| Region | Roughly | Your station's connection |
|--------|---------|---------------------------|
| Radio | 1 mm and longer | Wi-Fi and cellular telemetry (Chapter 16) |
| Infrared | 700 nm to 1 mm | Heat radiation (Chapter 6) |
| Visible | 400 to 700 nm | What the solar sensor mostly sees (Chapter 9) |
| Ultraviolet | 10 to 400 nm | The UV index (Chapter 9) |

The **photoelectric effect** is the release of electrons from a material when light strikes it. Heinrich Hertz noticed it in 1887, and it turned out to be deeply puzzling: the effect depended on the light's *color* rather than its brightness, which classical physics could not explain. Albert Einstein explained it in 1905 by proposing that light arrives in discrete packets, and it was that paper — not relativity — that won him the Nobel Prize.

For your purposes the consequence is practical. A piece of silicon exposed to light produces a current proportional to how much light lands on it. That is a photodiode, and it is how the solar radiation sensor in Chapter 9 works. It is also how a solar panel works, running the same physics at larger scale.

#### Diagram: Transduction Mechanism Matcher

<iframe src="../../sims/transduction-mechanism-matcher/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Transduction Mechanism Matcher</summary>
Type: microsim
**sim-id:** transduction-mechanism-matcher<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: attribute

Learning objective: The learner attributes each of the station's sensors to the physical mechanism it uses, and explains the chain from physical property through material change to electrical output.

Purpose: The book's seven measurement chapters each introduce a mechanism in isolation. This element assembles them into one picture early, so that when Chapter 7 introduces the piezoresistive effect the learner recognizes it as one branch of a structure they have already seen.

Canvas layout:
- Left column: cards for physical properties — Temperature, Pressure, Humidity, Light, Acceleration
- Center column: cards for material mechanisms — Diode voltage shift, Piezoresistive effect, Capacitance change, Photoelectric effect, MEMS proof mass on springs
- Right column: cards for electrical outputs — Voltage change, Resistance change, Capacitance change, Current generated
- The learner draws connections between columns
- Responsive: columns stack into rows on narrow canvases and the connection metaphor switches from lines to sequential selection

Correct chains the sim must accept and explain:
1. Temperature -> Diode voltage shift -> Voltage change. Explanation: "A silicon diode's forward voltage falls by about 2 mV per degree Celsius. Measure the voltage, compute the temperature. This is the temperature element inside the BME280." Chapter 6.
2. Pressure -> Piezoresistive effect -> Resistance change. Explanation: "A thin silicon diaphragm flexes under air pressure. Flexing changes its resistance. This is the pressure element inside the BME280." Chapter 7.
3. Humidity -> Capacitance change -> Capacitance change. Explanation: "A polymer film between two electrodes absorbs water vapor, changing how much charge the gap can store." Chapter 8.
4. Light -> Photoelectric effect -> Current generated. Explanation: "Light striking silicon frees electrons, producing a current proportional to the light. This is a photodiode, and at larger scale, a solar cell." Chapter 9.
5. Acceleration -> MEMS proof mass on springs -> Capacitance change. Explanation: "A microscopic mass on microscopic springs shifts when the ground moves. The shift changes the gap between plates, changing capacitance." Chapter 11.

Interaction:
- Drag from a property card to a mechanism card to an output card to build a three-link chain
- On completing a correct chain, the three cards lock together, glow, and the explanation appears with its chapter reference
- On an incorrect link, the connection springs back and a hint appears naming what to reconsider, e.g. "Humidity does change something in a polymer, but not its resistance. What property describes storing charge across a gap?"
- Progress indicator: "3 of 5 chains complete"
- A "Show me one" button completes a single chain as a worked example for a stuck learner

Default parameters:
- All cards unconnected, shuffled within their columns
- Hints enabled

Instructional Rationale: The objective is Analyze/attribute, which requires the learner to decompose a sensor into property, mechanism, and output rather than treat it as a black box. A three-column matching task makes that decomposition the literal interaction. Hints that name the missing idea rather than the answer keep the task diagnostic rather than trial-and-error.

Implementation: p5.js with drag-to-connect between card anchors. Store chains as arrays of three ids with an explanation string; validate a link only when all three are present.
</details>

## Sensors Take Time

A sensor does not respond instantly. Nothing physical does.

**Sensor response time** is how long a sensor takes to reflect a change in the thing it is measuring. It is usually quoted as the time to reach 63 percent of the way to the new value, a figure engineers call the time constant.

The reason is physical, not electronic. A temperature sensor is a small object with mass. When the air around it warms, heat has to actually flow into that object before its silicon warms up. A sensor in a thick plastic housing responds more slowly than a bare one, because the housing has to warm up too.

Typical figures for the sensors in this book:

| Sensor | Typical response time | Why it matters |
|--------|----------------------|----------------|
| BME280 temperature | About 1 second | Fine for weather; too slow to catch a gust of warm air |
| BME280 humidity | About 1 second | Fast enough for most outdoor use |
| BME280 pressure | Nearly instant | Pressure equalizes very quickly |
| Cup anemometer | A few seconds | Cups have inertia; slow to spin up and slow to stop |
| MEMS accelerometer | Under a millisecond | Must be fast enough to catch a seismic P wave |

This produces a rule you will use in Chapter 14: **never sample faster than your sensor can respond.** If a sensor needs a second to settle and you read it ten times per second, nine of those readings are the sensor still catching up to the previous change. You get more data and less information.

## Filtering and Averaging

Real sensor readings are noisy. Take a hundred readings of an unchanging temperature and you will get a hundred slightly different values, scattered around the truth. That is the imprecision described in Chapter 2, and it comes from thermal noise in the electronics, tiny voltage fluctuations, and rounding in the ADC.

Two related techniques reduce it.

**Sensor averaging** takes several readings and reports their mean. This works because random noise is as likely to be positive as negative, so it partially cancels when you add readings together. The improvement follows a specific rule: averaging \(N\) readings reduces the random noise by a factor of \(\sqrt{N}\).

\[ \text{noise after averaging} = \frac{\text{noise of one reading}}{\sqrt{N}} \]

That square root is important, and slightly disappointing. To cut noise in half you need 4 readings. To cut it to a tenth you need 100. There are diminishing returns, and beyond a point you are burning power and battery for very little gain.

| Readings averaged | Noise reduced to | Worth it? |
|-------------------|------------------|-----------|
| 1 | 100% | Baseline |
| 4 | 50% | Yes — cheap and effective |
| 16 | 25% | Usually yes |
| 100 | 10% | Only if noise is your limiting problem |
| 400 | 5% | Rarely worth the power |

#### Diagram: Noise and Averaging Bench

<iframe src="../../sims/noise-and-averaging-bench/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Noise and Averaging Bench</summary>
Type: microsim
**sim-id:** noise-and-averaging-bench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: justify

Learning objective: The learner justifies a choice of averaging depth for a given sensor and purpose, weighing noise reduction against power cost and against the risk of smoothing away a real event.

Purpose: The square-root rule is easy to state and hard to feel. This bench lets the learner discover the diminishing return themselves, then confronts them with the cost side — a real event that heavy averaging destroys — so the choice becomes a genuine judgment rather than "more is better."

Canvas layout:
- Upper panel: a live scrolling plot of raw sensor readings against time, with the true underlying value drawn as a dashed reference line
- Lower panel: the same signal after averaging, on identical axes and an identical fixed y-range so the two are directly comparable
- Right or below (responsive): statistics panel and a power-cost readout
- Bottom: controls
- Responsive to window resize; panels stack and rescale, y-range stays fixed

Data Visibility Requirements:
  Stage 1: Show raw readings scattering around the true value, with the measured standard deviation displayed as a number
  Stage 2: Show the averaged output on the same scale, with its own standard deviation displayed
  Stage 3: Show the predicted improvement from the square-root rule alongside the measured improvement, e.g. "Predicted: noise / sqrt(16) = 25%. Measured: 26%." so the learner sees theory and observation agree
  Stage 4: Show a power-cost readout: readings per measurement, microamp-seconds consumed, and estimated battery days at that rate, forward-referencing Chapter 16
  Stage 5: In event mode, show the true event and the averaged output side by side with the peak amplitude of each labeled

Interactive controls:
- Averaging depth selector: 1, 4, 16, 64, 256 readings, default 1
- Noise level slider: low, typical, high
- Signal mode selector:
  - "Steady value" — a constant true value, for exploring pure noise reduction
  - "Slow change" — a gentle ramp like a daily temperature cycle; averaging costs nothing here
  - "Sudden event" — a sharp 6 hPa pressure drop lasting 30 seconds, like a squall line. This is the critical mode.
- "Reset statistics" button

Required demonstration in Sudden event mode: at averaging depth 256, the sim must display the message "The true pressure dropped 6 hPa. Your averaged output shows a drop of 0.9 hPa. Averaging removed the noise and most of the event with it." The exact attenuation figure must be computed from the actual filter, not hard-coded.

Default parameters:
- Averaging depth: 1
- Noise: typical
- Mode: Steady value

Instructional Rationale: The objective is Evaluate/justify, which requires a trade-off with real costs on both sides. Showing only noise reduction would teach "average more," which is wrong. Pairing the noise statistic with a power cost and an event-attenuation figure forces the learner to weigh three quantities, which is what the actual engineering decision involves. Predicted-versus-measured display is included so the square-root rule is verified rather than asserted.

Implementation: p5.js. Generate readings as trueValue(t) + gaussianRandom() * noiseLevel. Implement averaging as a boxcar over the last N readings. Compute standard deviations over a rolling window of at least 200 output values so the statistics are stable.
</details>

**Sensor filtering** is the broader family of techniques for removing unwanted parts of a signal while keeping the part you care about. Averaging is the simplest filter. Others include the moving average of Chapter 15, and the internal filter built into the BME280 itself, which can be configured to smooth pressure readings before the chip even reports them.

Filtering always involves a trade, and the trade is worth stating plainly.

!!! warning "Filtering hides real events too"
    A filter cannot tell the difference between noise you want gone and a real, fast change you want to keep. Average heavily and a genuine sudden pressure drop — the kind that signals a squall line arriving — gets smoothed into a gentle slope. Your data will look beautifully clean and will have lost the event you most wanted to catch.

    The BME280's own datasheet addresses this directly: it recommends a strong filter for indoor use where conditions change slowly, and a weaker one for weather monitoring where sudden changes are the point. Match the filter to the question you are asking.

## Reading a Datasheet

A **sensor datasheet** is the manufacturer's technical document describing exactly what a sensor does, how accurate it is, what it needs to operate, and how to talk to it.

Datasheets look intimidating. The BME280's runs to about 60 pages of tables and timing diagrams. But you do not read a datasheet the way you read a book. You look up specific facts, and there are seven that matter before you buy or wire anything.

1. **Measurement range** — the span it can read at all. BME280 pressure: 300 to 1100 hPa. If your readings would fall outside, the sensor is wrong for the job.
2. **Accuracy** — how close to truth. BME280 pressure: ±1 hPa. Temperature: ±1.0 °C. Humidity: ±3 percent relative humidity.
3. **Resolution** — smallest reportable step. BME280 pressure: 0.18 Pa. Note how much finer this is than the accuracy figure — a direct example of Chapter 2's warning about reporting more digits than you know.
4. **Supply voltage** — what it needs to run. BME280: 1.71 to 3.6 V, which is why it is safe on the Pi's 3.3 V pin and would be destroyed by 5 V.
5. **Current draw** — how much it consumes. BME280: about 3.6 microamperes in normal weather-monitoring mode. That figure becomes very important in Chapter 16's power budget.
6. **Interface** — how it communicates. BME280: I2C or SPI. This determines which pins you wire it to, and is covered in Chapter 12.
7. **Response time** — how fast it settles. BME280 humidity: about 1 second.

!!! tip "The datasheet answers the question before you ask it"
    When a sensor gives an implausible reading, the first move is not to rewrite your code. It is to open the datasheet and check whether the value you expected is even inside the sensor's range, and whether the difference you are worried about is larger than the stated accuracy. A great many hours of debugging end the moment someone reads that the sensor is only accurate to ±1 °C and the "error" being chased is 0.4 °C.

## Key Takeaways

- A **sensor** detects a physical property and converts it into an electrical signal. **Transduction** is the name for that conversion.
- Sensors work because certain materials change an electrical property — resistance, capacitance, or generated voltage — in response to a physical one.
- An **analog signal** varies smoothly; a **digital signal** has a limited set of values. Digital survives noise and copying; analog does not.
- **Analog-to-digital conversion** samples in time and quantizes in value. Both steps discard information, and they discard different information.
- **Semiconductors** change their electrical behavior in response to heat, pressure, and light. **MEMS sensors** add microscopic moving parts on a silicon chip. The **photoelectric effect** turns light into current.
- The **electromagnetic spectrum** runs from radio through infrared, visible light, and ultraviolet. Visible light is a narrow slice.
- **Sensor response time** is how long a sensor takes to reflect a change. Never sample faster than the sensor can respond.
- **Sensor averaging** cuts random noise by \(\sqrt{N}\). **Sensor filtering** removes unwanted signal — including, if overdone, real events.
- A **sensor datasheet** answers seven questions: range, accuracy, resolution, supply voltage, current draw, interface, and response time.

## Check Yourself

??? question "Why can't a Raspberry Pi read a thermistor directly, but it can read a BME280 directly? Click to check."
    A thermistor produces an analog signal — a resistance that varies smoothly — and the Raspberry Pi has no built-in analog-to-digital converter, so it cannot turn that into a number. The BME280 contains its own ADC on the chip. It does the conversion internally and sends the Pi a digital signal, which the Pi can read directly over I2C. To use a bare thermistor you would need to add an external ADC chip.

??? question "You average 100 readings instead of 4. How much better is your noise? Click to check."
    Averaging reduces random noise by \(\sqrt{N}\). With 4 readings, noise falls to \(1/\sqrt{4} = 1/2\), or 50 percent. With 100 readings, it falls to \(1/\sqrt{100} = 1/10\), or 10 percent. So going from 4 to 100 readings — 25 times the work — improves noise by a factor of 5, not 25. That is the diminishing return the square root imposes.

??? question "A sensor has a response time of 1 second and you sample it 10 times per second. What is wrong? Click to check."
    Nine out of every ten readings are the sensor still moving toward the value it should have reported for the previous change. Those readings are not independent measurements — they are a record of the sensor catching up. You get ten times the data volume with essentially no additional information, and you burn ten times the power collecting it.

??? question "Your BME280 reports 1013.247 hPa but the datasheet says accuracy is ±1 hPa. Are the extra digits useful? Click to check."
    They are real output, but they are not information about the atmosphere. The resolution of 0.18 Pa means the sensor can *report* very fine steps; the accuracy of ±1 hPa means the true pressure could be anywhere from 1012.2 to 1014.2. The fine digits are useful for one thing only: detecting small *changes* over a short time, where the constant part of the error cancels out. For reporting absolute pressure, round to 1013 hPa.

---

## What Is Next

You now understand how a physical property becomes a number, and you have hardware that can receive one. There is one thing still missing before any of it counts as data.

Chapter 5 supplies it: where and when. A temperature reading with no location and no timestamp cannot be compared to any other reading, cannot be plotted against time, and cannot be combined with anyone else's data. That chapter covers coordinate systems, the centuries-long struggle to measure longitude at sea, how GPS actually determines a position, and why every remote station records its times in UTC rather than local time.
