# Quiz: Barometric Pressure: The Weight of the Atmosphere

Test your understanding of pressure, the experiments that proved air has weight, barometers, pressure units, altitude correction, and what pressure changes tell you with these review questions.

!!! mascot-tip "Check the Normal Range"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Sea level pressure almost always falls between 980 and 1040 hPa. When an answer choice lands far outside that range, a unit or a step has probably slipped.

---

#### 1. Standard sea level pressure is 1013.25 hPa. Which list gives that same pressure correctly in other units?

<div class="upper-alpha" markdown>
1. 101.325 mbar and 29.92 inHg
2. 1013.25 mbar and 29.92 inHg
3. 101,325 mbar and 760 inHg
4. 10,132.5 mbar and 33.86 inHg
</div>

??? question "Show Answer"
    The correct answer is **B**. A hectopascal is 100 pascals, and one hectopascal equals one millibar exactly. So 1013.25 hPa is also 1013.25 mbar. In inches of mercury, the same pressure is 29.92 inHg. Options A and D shift the decimal point in the millibar value. Option C uses the pascal number and confuses 760, which is millimetres of mercury, with inches. Weather services switched from millibars to hectopascals without changing a single number.

    **Concept Tested:** Hectopascal and Millibar

    **See:** [Four Units, One Pressure](index.md#four-units-one-pressure)

---

#### 2. In Torricelli's 1643 experiment, about how high did the mercury column settle above the dish?

<div class="upper-alpha" markdown>
1. About 10 metres
2. About 85 millimetres
3. About 29.92 millimetres
4. About 760 millimetres
</div>

??? question "Show Answer"
    The correct answer is **D**. In the Torricelli experiment, a tube full of mercury was turned upside down in a dish. The mercury fell and stopped at about 760 mm, held up by the weight of the air. This device is a mercury barometer. Option A is the height limit for water, which is 13.6 times less dense. Option B is how much the column dropped on the Puy de Dôme. Option C mixes up the inches of mercury number.

    **Concept Tested:** Torricelli Experiment and Mercury Barometer

    **See:** [Torricelli's Tube](index.md#torricellis-tube)

---

#### 3. What does the hydrostatic pressure at a point under water depend on?

<div class="upper-alpha" markdown>
1. The shape and width of the container
2. The total amount of water in the container
3. The depth of the water above that point
4. The temperature of the water at the surface
</div>

??? question "Show Answer"
    The correct answer is **C**. Hydrostatic pressure is the pressure produced by the weight of a fluid at rest. It depends on depth, not on the shape of the container. The bottom of a narrow pipe of water 10 metres tall feels the same pressure as the bottom of a wide lake 10 metres deep. That rules out options A and B. Option D is not a factor the chapter gives. Barometric pressure is the same idea, with air as the fluid.

    **Concept Tested:** Hydrostatic Pressure

    **See:** [Pressure and the Weight of Fluids](index.md#pressure-and-the-weight-of-fluids)

---

#### 4. During the Puy de Dôme experiment, why did Périer leave one barometer at the base of the mountain with an observer watching it all day?

<div class="upper-alpha" markdown>
1. To have a spare in case the first barometer broke on the climb
2. To measure how much the mercury evaporated during the day
3. To confirm the base reading did not change on its own
4. To check that the two barometers were made by the same maker
</div>

??? question "Show Answer"
    The correct answer is **C**. The base barometer was a control. If its reading stayed steady while the climbing barometer fell, the drop had to come from altitude, not from the weather changing that day. The column stood about 85 mm lower at the summit, and the control did not move. This careful design is good method even by modern standards. Options A, B, and D are not the reasons the chapter gives.

    **Concept Tested:** Puy De Dome Experiment

    **See:** [The Mountain Test](index.md#the-mountain-test)

---

#### 5. Why did Torricelli's tube show that Aristotle was wrong about empty space?

<div class="upper-alpha" markdown>
1. The mercury rose to fill the whole tube, just as Aristotle predicted
2. Air leaked into the top of the tube, proving air has weight
3. The mercury column changed height slightly from day to day
4. The gap at the top of the sealed tube held nothing at all
</div>

??? question "Show Answer"
    The correct answer is **D**. A vacuum is a space containing no matter. Aristotle argued that a vacuum could not exist. In Torricelli's tube, the mercury fell and left a gap at the sealed top. Nothing could have entered, because the tube was sealed and full, so the gap was a vacuum. Option A is the opposite of what happened. Option B is wrong because no air got in. Option C is true, but it relates to weather, not vacuum.

    **Concept Tested:** Vacuum

    **See:** [Torricelli's Tube](index.md#torricellis-tube)

---

#### 6. How is the pressure sensor inside the BME280 like an aneroid barometer?

<div class="upper-alpha" markdown>
1. Both use a column of liquid metal that rises and falls
2. Both use gears and levers to move a needle on a dial
3. Both use a sealed part that flexes as the outside pressure changes
4. Both measure pressure by timing how fast air leaks into a capsule
</div>

??? question "Show Answer"
    The correct answer is **C**. An aneroid barometer uses a sealed metal capsule that flexes as pressure changes. The BME280 has a thin silicon diaphragm over a sealed cavity. As it flexes, the piezoresistive effect changes the electrical resistance of the silicon, and the chip turns that into a number. Option A describes a mercury barometer, and "aneroid" means "without liquid." Option B is true only of the aneroid. Option D is not how either works.

    **Concept Tested:** Aneroid Barometer and Piezoresistive Effect

    **See:** [The Instrument Gets Smaller](index.md#the-instrument-gets-smaller)

---

#### 7. Your station sits at 166 m and reads 993 hPa. Using the chapter's shortcut, about what is the sea level pressure?

<div class="upper-alpha" markdown>
1. About 973 hPa
2. About 1013 hPa
3. About 1159 hPa
4. About 1059 hPa
</div>

??? question "Show Answer"
    The correct answer is **B**. Sea level pressure is what the station would read at sea level. The shortcut adds elevation in metres divided by 8.3: 166 ÷ 8.3 = 20, and 993 + 20 = 1013 hPa. That is an ordinary day. Option A subtracts instead of adding. Option C adds the full 166 without dividing. Option D comes from entering the elevation in feet instead of metres, which makes the correction more than three times too big.

    **Concept Tested:** Sea Level Pressure

    **See:** [Correcting for Altitude](index.md#correcting-for-altitude)

---

#### 8. Your BME280 reports a pressure of 98,600. What should you store in your data file?

<div class="upper-alpha" markdown>
1. 9860 hPa
2. 986 hPa
3. 98.6 hPa
4. 98,600 hPa
</div>

??? question "Show Answer"
    The correct answer is **B**. The BME280 reports pressure in pascals, the SI unit, equal to one newton per square metre. A hectopascal is 100 pascals, so divide by 100: 98,600 Pa is 986 hPa. Option A divides by 10, and option C divides by 1000. Option D keeps the pascal number but gives it the wrong unit. A quick check: 986 hPa sits inside the normal 980 to 1040 hPa range, so it makes sense.

    **Concept Tested:** Pascal Unit

    **See:** [Four Units, One Pressure](index.md#four-units-one-pressure)

---

#### 9. A pilot flies from an area of high pressure into an area of low pressure without resetting the altimeter. What will the altimeter show?

<div class="upper-alpha" markdown>
1. A height greater than the plane's true height
2. A height less than the plane's true height
3. The plane's true height, because altimeters measure distance
4. A height of zero, because the pressure is below standard
</div>

??? question "Show Answer"
    The correct answer is **A**. An altimeter is a barometer marked in metres or feet. It shows pressure altitude, which is height worked out from pressure using a standard atmosphere. Flying into lower pressure looks to the altimeter like climbing higher, so it reads higher than the plane really is. Option B reverses the error. Option C is wrong because altimeters measure pressure, not distance. Option D does not happen. Pilots remember, "High to low, look out below."

    **Concept Tested:** Altimeter and Pressure Altitude

    **See:** [Correcting for Altitude](index.md#correcting-for-altitude)

---

#### 10. Your station's sea level pressure was 1016 hPa at 9:00 and is 1009 hPa at noon. The sky is still clear. A classmate says 1009 hPa is normal, so nothing is happening. What is the best response?

<div class="upper-alpha" markdown>
1. The fast drop matters more than the value, so something is likely arriving
2. The sensor must be faulty, because pressure cannot fall under a clear sky
3. The classmate is right, because only readings below 980 hPa mean anything
4. The drop means high pressure is building, so fair weather is on the way
</div>

??? question "Show Answer"
    The correct answer is **A**. Barometric pressure is the weight of the air above a point, and its change carries the most information. A fall of 7 hPa in three hours warns that a weather system is arriving, often before anything shows in the sky. Option B is wrong because pressure can fall well before clouds appear. Option C ignores the change. Option D reverses the meaning, because falling pressure points toward low pressure and unsettled weather.

    **Concept Tested:** Barometric Pressure

    **See:** [What Pressure Tells You About Tomorrow](index.md#what-pressure-tells-you-about-tomorrow)

---

!!! mascot-celebration "The Sky Has Been Weighed!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Superb work, station builders! You traced pressure from Torricelli's tube and Pascal's mountain to aneroid capsules, altitude correction, and the silicon diaphragm in your own sensor. Every number tells a story.
