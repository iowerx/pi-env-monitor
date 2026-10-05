# Quiz: Solar Radiation: The Energy That Drives the Weather

Test your understanding of irradiance, the solar constant, sun angle, daily and seasonal cycles, albedo, solar instruments, and the UV index with these review questions.

!!! mascot-tip "Think About the Angle"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When a question asks how much sunlight reaches a surface, think about the Sun's angle before you think about its distance. A slanted beam spreads the same energy over more ground.

---

#### 1. Samuel Langley's bolometer, invented in 1880, measured radiant energy using what?

<div class="upper-alpha" markdown>
1. The temperature rise of water in a blackened container
2. The change in electrical resistance of a blackened absorber as it warmed
3. The voltage from many thermocouples wired together in series
4. The current produced when light frees electrons in silicon
</div>

??? question "Show Answer"
    The correct answer is **B**. A bolometer measures radiant energy through the change in electrical resistance of a blackened absorber as it warms. Langley's could detect a change of a ten-thousandth of a degree. Option A describes Pouillet's 1838 pyrheliometer. Option C describes a thermopile. Option D describes a photodiode, which uses the photovoltaic effect. All four measure light, but each uses different physics.

    **Concept Tested:** Bolometer

    **See:** [Irradiance and the Solar Constant](index.md#irradiance-and-the-solar-constant)

---

#### 2. Which instrument measures total solar irradiance on a horizontal surface from the whole sky, including both direct and diffuse light?

<div class="upper-alpha" markdown>
1. Pyranometer
2. Pyrheliometer
3. Bolometer
4. Solar cell
</div>

??? question "Show Answer"
    The correct answer is **A**. A pyranometer measures total irradiance arriving from the entire sky, direct beam plus diffuse together. The classic design uses a blackened thermopile under a glass dome. A pyrheliometer (B) measures only the direct beam. It looks through a narrow tube at the Sun and must follow the Sun on a tracker. A bolometer (C) was Langley's resistance-based instrument. A solar cell (D) is built to generate power.

    **Concept Tested:** Pyranometer and Pyrheliometer

    **See:** [Thermal Instruments](index.md#thermal-instruments)

---

#### 3. A surface reflects about 85 percent of the sunlight that hits it, so its albedo is about 0.85. Which surface is it most likely to be?

<div class="upper-alpha" markdown>
1. Asphalt
2. Forest
3. Desert sand
4. Fresh snow
</div>

??? question "Show Answer"
    The correct answer is **D**. Albedo is the fraction of incoming sunlight a surface reflects, from 0 for a perfect absorber to 1 for a perfect reflector. Fresh snow has an albedo of about 0.80 to 0.90. Asphalt (A) is only about 0.05 to 0.10, which is why it gets so hot. Forest (B) is about 0.15, and desert sand (C) is about 0.40. Snow's high albedo helps it stay cold.

    **Concept Tested:** Albedo

    **See:** [Angle Is Everything](index.md#angle-is-everything)

---

#### 4. Why does a pyranometer use a thermopile instead of a single thermocouple?

<div class="upper-alpha" markdown>
1. A thermopile responds only to visible light and ignores infrared
2. A thermopile never needs to be calibrated against a standard
3. Many thermocouples in series add their tiny voltages into a measurable signal
4. A thermopile can follow the Sun as it moves across the sky
</div>

??? question "Show Answer"
    The correct answer is **C**. A thermopile is a set of thermocouples connected in series. One thermocouple produces only microvolts, but in series the voltages add up to a signal that is easy to measure. Option A is wrong, because a thermopile responds almost equally to all wavelengths. That even response is a strength. Option B is wrong, because these instruments need careful calibration. Option D describes the tracker a pyrheliometer needs.

    **Concept Tested:** Thermopile

    **See:** [Thermal Instruments](index.md#thermal-instruments)

---

#### 5. What causes Earth's seasons?

<div class="upper-alpha" markdown>
1. Earth is closer to the Sun in summer and farther away in winter
2. The Sun's energy output rises and falls over the course of each year
3. Earth spins faster in summer and more slowly in winter
4. Earth's tilted axis changes the Sun's noon angle and the length of the day
</div>

??? question "Show Answer"
    The correct answer is **D**. Seasonal variation comes from Earth's axis, tilted about 23.5°. The tilt changes how high the noon Sun climbs and how long the days last. Summer days are both longer and more intense. Option A is a common misconception, because Earth is closest to the Sun in early January. Also, the two hemispheres have opposite seasons at the same time. Options B and C are not causes of seasons.

    **Concept Tested:** Seasonal Variation

    **See:** [Angle Is Everything](index.md#angle-is-everything)

---

#### 6. A photodiode and a solar cell both turn light into electricity. What physics do they share?

<div class="upper-alpha" markdown>
1. The thermoelectric effect, where heated metal junctions produce a voltage
2. The piezoresistive effect, where bending silicon changes its resistance
3. The photovoltaic effect, where a material absorbing light produces a voltage or current
4. The greenhouse effect, where infrared light warms a surface from above
</div>

??? question "Show Answer"
    The correct answer is **C**. The photovoltaic effect is the production of a voltage or current when a material absorbs light. Becquerel discovered it in 1839. A photodiode uses it to measure light. A solar cell uses the same physics scaled up to make power, and modern panels turn about 20 percent of sunlight into electricity. Option A is how thermocouples work. Option B is how the BME280 measures pressure. Option D does not make electricity.

    **Concept Tested:** Photovoltaic Effect and Solar Cell

    **See:** [Photoelectric Instruments](index.md#photoelectric-instruments)

---

#### 7. Direct sunlight delivers 1000 W/m² to a surface facing the Sun. The solar zenith angle is 60°. About how much reaches a flat, horizontal surface?

<div class="upper-alpha" markdown>
1. 1000 W/m²
2. 500 W/m²
3. 600 W/m²
4. 870 W/m²
</div>

??? question "Show Answer"
    The correct answer is **B**. The solar zenith angle is the angle between the Sun and straight overhead. Irradiance on a flat surface equals the beam times the cosine of that angle. The cosine of 60° is 0.50, so 1000 × 0.50 = 500 W/m². Option A ignores the angle. Option C treats 60° as 60 percent. Option D uses the cosine of 30°, not 60°. A slanted beam spreads the same energy over more square metres.

    **Concept Tested:** Solar Zenith Angle

    **See:** [Angle Is Everything](index.md#angle-is-everything)

---

#### 8. Your station logs irradiance from midnight to midnight on a clear day. Which description best fits the graph you should expect?

<div class="upper-alpha" markdown>
1. Near zero overnight, with one smooth arch that peaks at solar noon
2. Near zero overnight, with one peak around 3 pm along with temperature
3. A flat, steady line all day, because the Sun's output is constant
4. Two peaks, one at sunrise and one at sunset, when the Sun is low
</div>

??? question "Show Answer"
    The correct answer is **A**. The diurnal cycle is the daily pattern caused by Earth's rotation. The zenith angle sweeps from 90° at sunrise to its smallest at solar noon and back to 90° at sunset, so irradiance follows a smooth arch. Option B confuses irradiance with temperature, which peaks two to three hours later. Option C ignores the angle. Option D is backward, because a low Sun gives the least energy.

    **Concept Tested:** Diurnal Cycle

    **See:** [Angle Is Everything](index.md#angle-is-everything)

---

#### 9. All else being equal, which change would raise the UV index where you are standing?

<div class="upper-alpha" markdown>
1. Waiting from solar noon until late afternoon
2. Walking from grass onto fresh snow
3. Hiking down from a mountain to sea level
4. A thicker layer of ozone forming overhead
</div>

??? question "Show Answer"
    The correct answer is **B**. The UV index measures sunburn-causing ultraviolet radiation, weighted by how much each wavelength damages skin. Fresh snow nearly doubles UV exposure by reflecting it back up at you. Option A lowers the index, because it peaks near solar noon. Option C lowers it too, because UV rises about 10 percent per 1000 m of altitude. Option D lowers it, because ozone is the main absorber of UVB.

    **Concept Tested:** UV Index and Ultraviolet Radiation

    **See:** [The UV Index](index.md#the-uv-index)

---

#### 10. On a clear summer noon at a mid-latitude site, a new horizontal irradiance sensor at ground level reports 1340 W/m². What is the best conclusion?

<div class="upper-alpha" markdown>
1. The reading is suspect, because ground readings should be well below the 1361 W/m² solar constant
2. The reading is normal, because sunlight reaches the ground at about the solar constant
3. The reading is normal, because summer is when Earth is closest to the Sun
4. The reading is too low, because a clear summer noon should top 1361 W/m²
</div>

??? question "Show Answer"
    The correct answer is **A**. The solar constant, about 1361 W/m², is the irradiance at the top of the atmosphere on a surface facing the Sun. At the ground, the atmosphere absorbs and scatters some light, and the cosine of the zenith angle reduces it further. A clear summer noon gives about 900 to 1000 W/m². So 1340 points to a calibration or setup problem. Option B ignores the atmosphere. Option C repeats the distance myth. Option D is backward.

    **Concept Tested:** Solar Constant and Irradiance

    **See:** [Irradiance and the Solar Constant](index.md#irradiance-and-the-solar-constant)

---

!!! mascot-celebration "Sunlight Logged!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Bright work, station builders! You connected the solar constant and sun angle to daily and seasonal cycles, and you can tell a pyranometer from a photodiode. Let's take a reading!
