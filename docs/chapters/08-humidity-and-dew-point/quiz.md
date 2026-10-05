# Quiz: Humidity and Dew Point: The Water Hidden in the Air

Test your understanding of the water cycle, absolute and relative humidity, dew point, dew, frost, and fog, and the instruments that measure humidity with these review questions.

!!! mascot-tip "Ask What Changed"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When a humidity question describes air warming or cooling, ask yourself one thing first: did any water actually enter or leave the air? The answer tells you which numbers move and which stay put.

---

#### 1. What is a cloud actually made of?

<div class="upper-alpha" markdown>
1. Tiny liquid droplets or ice crystals that condensed from water vapor
2. Water vapor that has become dense enough to see
3. Dust, salt, and pollen with no water at all
4. Pure water vapor mixed with warm, rising air
</div>

??? question "Show Answer"
    The correct answer is **A**. Water vapor is water in its gas phase, and it is invisible. Cloud formation happens when warm, moist air rises, cools, and its vapor condenses onto tiny particles called condensation nuclei. Billions of droplets or ice crystals form, and you see a cloud. Options B and D are the common mistake, because vapor can never be seen. Option C confuses the nuclei with the cloud itself.

    **Concept Tested:** Cloud Formation and Water Vapor

    **See:** [Water Vapor and the Water Cycle](index.md#water-vapor-and-the-water-cycle)

---

#### 2. What does a psychrometer use to measure humidity?

<div class="upper-alpha" markdown>
1. A strand of hair that gets longer as the air gets damper
2. Two thermometers, one with its bulb wrapped in a wet wick
3. A small mirror that is cooled until dew forms on it
4. A thin polymer film whose capacitance changes with moisture
</div>

??? question "Show Answer"
    The correct answer is **B**. A psychrometer uses two thermometers. One is ordinary, and one has its bulb wrapped in a wet wick. Evaporation cools the wet one, and it reads the wet bulb temperature. The drier the air, the bigger the gap between the two. Option A is a hair hygrometer. Option C is a chilled mirror hygrometer. Option D is the capacitive sensor in the BME280.

    **Concept Tested:** Psychrometer and Wet Bulb Temperature

    **See:** [Measuring the Invisible](index.md#measuring-the-invisible)

---

#### 3. The BME280 measures humidity with a capacitive sensor. Why does its capacitance change when the air gets more humid?

<div class="upper-alpha" markdown>
1. Water droplets bridge the electrodes and let current flow across
2. Humid air cools the electrodes and lowers their resistance
3. Water vapor raises the air pressure between the electrodes
4. A polymer film between the electrodes absorbs water, changing its electrical properties
</div>

??? question "Show Answer"
    The correct answer is **D**. Capacitive sensing measures how much charge two conductors separated by an insulator can store. That depends partly on the material between them. In a capacitive humidity sensor, a thin polymer film absorbs water vapor, and water strongly affects the film's electrical properties. So capacitance changes with relative humidity. Option A describes current flow, not capacitance. Option B describes resistance. Option C is not how the sensor works.

    **Concept Tested:** Capacitive Humidity Sensor and Capacitive Sensing

    **See:** [Thin Films](index.md#thin-films)

---

#### 4. How does a chilled mirror hygrometer differ from a hair hygrometer?

<div class="upper-alpha" markdown>
1. The hair hygrometer measures dew point, and the chilled mirror measures relative humidity
2. Both measure relative humidity, but only the chilled mirror works without power
3. The chilled mirror uses a wet wick, and the hair hygrometer uses a polymer film
4. The chilled mirror measures dew point directly, and the hair hygrometer reads relative humidity
</div>

??? question "Show Answer"
    The correct answer is **D**. A chilled mirror hygrometer cools a mirror until condensation dims its reflection. The mirror's temperature at that moment is the dew point. It is so accurate that it serves as a reference standard. A hair hygrometer reads relative humidity from how much a hair stretches. Option A reverses the two. Option B is wrong because the chilled mirror needs power. Option C describes a psychrometer and a capacitive sensor.

    **Concept Tested:** Chilled Mirror Hygrometer and Hair Hygrometer

    **See:** [Measuring the Invisible](index.md#measuring-the-invisible)

---

#### 5. Which statement correctly describes the energy involved in evaporation and condensation?

<div class="upper-alpha" markdown>
1. Both evaporation and condensation cool the air around them
2. Evaporation warms what it leaves, and condensation cools the air
3. Evaporation cools what it leaves, and condensation releases energy that warms the air
4. Neither one involves energy, because only the phase of water changes
</div>

??? question "Show Answer"
    The correct answer is **C**. Evaporation is liquid becoming vapor. The fastest molecules escape, so the average energy of what remains falls. That is why sweating cools you. Condensation is vapor becoming liquid, and it releases that stored energy back, warming the air. This released heat is what powers thunderstorms and hurricanes. Option B reverses the two. Option A gets condensation wrong. Option D ignores the energy completely.

    **Concept Tested:** Evaporation and Condensation

    **See:** [Water Vapor and the Water Cycle](index.md#water-vapor-and-the-water-cycle)

---

#### 6. On a calm night, no water enters or leaves the air, yet relative humidity climbs until it peaks just before dawn. Why?

<div class="upper-alpha" markdown>
1. Dew on the grass evaporates and adds water to the air overnight
2. The air cools, so its saturation vapor pressure falls and the same vapor is a bigger share
3. Cooler air is denser, so it holds more grams of water per cubic metre
4. The humidity sensor drifts upward at night as the polymer film cools
</div>

??? question "Show Answer"
    The correct answer is **B**. Relative humidity is the actual vapor pressure divided by the saturation vapor pressure. Saturation vapor pressure is the most vapor air can sustain at a given temperature, and it falls as air cools. The water stays the same, but the maximum shrinks, so the percentage rises. Option A is wrong because no water was added. Option C is a misconception. Option D blames the sensor for real physics.

    **Concept Tested:** Relative Humidity and Saturation Vapor Pressure

    **See:** [Relative Humidity](index.md#relative-humidity)

---

#### 7. The air is 22 °C with 80 percent relative humidity. Using the chapter's quick rule, about what is the dew point?

<div class="upper-alpha" markdown>
1. About 14 °C
2. About 20 °C
3. About 18 °C
4. About 26 °C
</div>

??? question "Show Answer"
    The correct answer is **C**. Dew point is the temperature air must cool to before it condenses. The quick rule says dew point is about 1 °C below air temperature for every 5 percent that humidity falls below 100. Here, 100 − 80 = 20, and 20 ÷ 5 = 4, so 22 − 4 = 18 °C. Option A subtracts too much. Option B subtracts too little. Option D adds instead of subtracting, and dew point can never be above air temperature.

    **Concept Tested:** Dew Point

    **See:** [What Your Station Will Actually Do](index.md#what-your-station-will-actually-do)

---

#### 8. Which evening conditions make fog most likely by morning?

<div class="upper-alpha" markdown>
1. Clear sky, calm air, 9 °C with a dew point of 8 °C, on a long autumn night
2. Thick clouds, strong wind, 9 °C with a dew point of 8 °C
3. Clear sky, calm air, 15 °C with a dew point of 2 °C
4. Clear sky, strong wind, 20 °C with a dew point of 5 °C
</div>

??? question "Show Answer"
    The correct answer is **A**. Fog formation happens when a whole layer of air cools to its dew point. That needs a clear sky so heat escapes, calm air, a small gap between temperature and dew point, and a long night. Option A has all four. Option B has the small gap, but clouds and wind block the cooling. Options C and D have gaps far too large to close overnight, and D is windy too.

    **Concept Tested:** Fog Formation

    **See:** [Dew, Frost, and Fog](index.md#dew-frost-and-fog)

---

#### 9. On a clear, calm night, a car roof cools several degrees below the air. The dew point is −3 °C, and the roof cools below that. What forms on the roof?

<div class="upper-alpha" markdown>
1. Dew, because the roof cooled past the dew point
2. Frost, because the dew point is below freezing
3. Fog, because the air touching the roof is saturated
4. Rain, because condensed droplets fall onto the roof
</div>

??? question "Show Answer"
    The correct answer is **B**. Dew and frost formation happen when a surface radiates heat to the sky and cools past the dew point. If the dew point is above freezing, liquid dew forms. If it is below freezing, like −3 °C, vapor deposits directly as ice crystals, which is frost. Option A would be right only if the dew point were above freezing. Fog (C) forms in a layer of air, not on a surface. Option D is not precipitation.

    **Concept Tested:** Dew And Frost Formation

    **See:** [Dew, Frost, and Fog](index.md#dew-frost-and-fog)

---

#### 10. A desert afternoon is 40 °C with 20 percent relative humidity. A coastal morning is 10 °C with 90 percent relative humidity. Using the chapter's saturation table, which air contains more water per cubic metre?

<div class="upper-alpha" markdown>
1. The desert air, because 20 percent of a much larger maximum is more water
2. The coastal air, because 90 percent is a much higher humidity than 20 percent
3. Both contain the same amount, because humidity percentages measure water directly
4. Neither can be compared, because the two readings were taken at different times
</div>

??? question "Show Answer"
    The correct answer is **A**. Absolute humidity is the actual mass of water per cubic metre. At 40 °C, air can hold about 51.1 g/m³, and 20 percent of that is about 10 g/m³. At 10 °C, the maximum is about 9.4 g/m³, and 90 percent is about 8.5 g/m³. So the desert air holds more water. Option B treats relative humidity as an amount. Option C makes the same error. Option D is wrong because grams per cubic metre can always be compared.

    **Concept Tested:** Absolute Humidity

    **See:** [Absolute Humidity](index.md#absolute-humidity)

---

!!! mascot-celebration "Moisture Mystery Solved!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Great reading, observers! You sorted out absolute humidity, relative humidity, and dew point, and you know how dew, frost, and fog form and how each hygrometer works. Check the data, then check it again.
