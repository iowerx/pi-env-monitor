# Quiz: Building the Station for the Outdoors

Test your understanding of siting and sensor exposure, weatherproof enclosures, the power budget, duty cycling, telemetry, intermittent connectivity, and seismic networks with these review questions.

!!! mascot-tip "Plan for the Worst Day"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Out in the field, the best answer is usually the one that still works on the darkest December day, in the middle of a storm, with the network down. Picture that day as you choose.

---

#### 1. What do the two digits in an enclosure's IP rating, such as IP65, describe?

<div class="upper-alpha" markdown>
1. The first digit rates liquids, and the second rates solids
2. The first digit rates heat, and the second rates humidity
3. The first digit rates solids, and the second rates liquids
4. The first digit rates wall thickness, and the second counts vents
</div>

??? question "Show Answer"
    The correct answer is **C**. An ingress protection rating is a standard measure of how well an enclosure keeps things out. The first digit rates solids, like dust, and the second rates liquids, like water. IP65 means dust-tight and protected against water jets, which is the sensible target for a station. Option A reverses the two digits. Options B and D describe things the rating does not measure.

    **Concept Tested:** Ingress Protection Rating

    **See:** [The Enclosure](index.md#the-enclosure)

---

#### 2. Why should a station's weatherproof enclosure have a membrane vent instead of being sealed completely?

<div class="upper-alpha" markdown>
1. A vent lets rainwater drain out through the bottom of the box
2. A vent lets insects in, which keeps spiders away from the sensors
3. A vent keeps the inside of the box colder than the outside air
4. A vent passes air and water vapor but blocks liquid water
</div>

??? question "Show Answer"
    The correct answer is **D**. A sealed weatherproof enclosure still breathes as it warms and cools, pulling in moist air that condenses on the circuit board and cannot escape. A membrane vent passes air and water vapor but blocks liquid water. It also lets the pressure sensor read the real atmosphere. Option A is wrong, because the vent blocks liquid. Option B is backward, since vents need insect mesh. Option C is not what a vent does.

    **Concept Tested:** Weatherproof Enclosure

    **See:** [The Enclosure](index.md#the-enclosure)

---

#### 3. Why can't the temperature sensor and the solar radiation sensor share the same spot on the mast?

<div class="upper-alpha" markdown>
1. Temperature needs shade, but the solar sensor needs a clear view of the whole sky
2. Both sensors use the same I2C address, so they must be far apart
3. The solar sensor gives off heat that would warm the temperature sensor
4. Temperature must be measured at 10 metres, but solar must be at ground level
</div>

??? question "Show Answer"
    The correct answer is **A**. Sensor exposure is how a sensor faces the thing it measures. Temperature needs shade and free airflow. The solar sensor needs an unshaded view of the whole sky. So the solar sensor goes on top, level and clear, and the temperature shield goes below it where it never shades the solar sensor. Option B is not the reason. Option C is not described. Option D is wrong, because 10 metres is the height for wind.

    **Concept Tested:** Sensor Exposure

    **See:** [Siting](index.md#siting)

---

#### 4. There is a 6-metre-tall building near your planned station. Using the chapter's siting rule, how far away should the station be?

<div class="upper-alpha" markdown>
1. At least 6 metres
2. At least 24 metres
3. At least 12 metres
4. At least 60 metres
</div>

??? question "Show Answer"
    The correct answer is **B**. Sensor siting follows the rule that a station should be at least four times the height of a nearby obstruction away from it. Four times 6 metres is 24 metres. Buildings block wind, cast shade, and give off stored heat at night. Option A uses one times the height. Option C uses two times. Option D uses ten times, which is more than the rule needs.

    **Concept Tested:** Sensor Siting

    **See:** [Siting](index.md#siting)

---

#### 5. A station uses 2,000 mAh per day. It has a 10,000 mAh lithium battery, and you plan to use 80 percent of it. In mild weather, how many days can it run with no sunlight at all?

<div class="upper-alpha" markdown>
1. 5 days
2. 2 days
3. 4 days
4. 8 days
</div>

??? question "Show Answer"
    The correct answer is **C**. Battery capacity must be derated for depth of discharge, because lithium batteries should not be run below about 20 percent. Usable capacity is 10,000 × 0.8 = 8,000 mAh. Divide by the daily use: 8,000 ÷ 2,000 = 4 days. Option A forgets the 80 percent limit. Option B uses only half the usable capacity. Option D divides by 1,000 instead of by the daily use. In cold weather, the real number would be lower still.

    **Concept Tested:** Battery Capacity

    **See:** [Step 2: Size the Battery](index.md#step-2-size-the-battery)

---

#### 6. A 20 W solar panel sits at a site with 2.0 kWh/m² per day of insolation in December. Using the chapter's 0.7 efficiency factor, about how much energy will it collect each day?

<div class="upper-alpha" markdown>
1. 28 Wh
2. 40 Wh
3. 14 Wh
4. 2.8 Wh
</div>

??? question "Show Answer"
    The correct answer is **A**. A solar panel's daily energy is its rated power times the insolation times the efficiency factor: 20 × 2.0 × 0.7 = 28 Wh. This number goes into the power budget, which compares what the station collects with what it uses. Option B leaves out the 0.7 losses. Option C leaves out the insolation. Option D slips a decimal place. Always size the panel for December, not July.

    **Concept Tested:** Solar Panel and Power Budget

    **See:** [Step 3: Size the Solar Panel](index.md#step-3-size-the-solar-panel)

---

#### 7. The best site for your station is an open field 800 m from the school building, with good cell coverage. Which way of sending data home fits best?

<div class="upper-alpha" markdown>
1. The school's Wi-Fi network, because it is free and fast
2. A cellular data link through the SIM7600A module
3. Moving the station beside the building so Wi-Fi can reach it
4. No data link at all, because remote stations do not need one
</div>

??? question "Show Answer"
    The correct answer is **B**. A cellular data link uses the mobile phone network, so it works anywhere with coverage. A Wi-Fi network usually reaches less than 100 metres outdoors, so it cannot reach 800 m (A). Option C gives up good siting for convenience, which the chapter warns against. Option D is wrong, because without a link you learn about failures only when you visit. Choose the site first, then a link that reaches it.

    **Concept Tested:** Cellular Data Link and Wi-Fi Network

    **See:** [Getting the Data Home](index.md#getting-the-data-home)

---

#### 8. A station's loop does three steps in this order: read the sensors, upload the reading, then save it to the CSV file. Readings go missing during storms. What is the design error?

<div class="upper-alpha" markdown>
1. The sensors cannot be read while it is raining heavily
2. When the upload fails, the reading never reaches the CSV file
3. The CSV file fills up faster when the weather is stormy
4. Uploading during storms damages the SIM7600A module
</div>

??? question "Show Answer"
    The correct answer is **B**. Intermittent connectivity is normal for a remote station, and storms often knock out networks. Here, a failed upload stops the loop before the save step, so the reading is lost. Writing to local storage must come first, every time. Uploading should be a separate, optional step. Option A is not the cause. Option C does not happen. Option D is not described in the chapter.

    **Concept Tested:** Intermittent Connectivity

    **See:** [When the Link Is Not There](index.md#when-the-link-is-not-there)

---

#### 9. Your winter power budget comes up about 20 percent short, and you cannot buy new hardware. Which change would save the most energy?

<div class="upper-alpha" markdown>
1. Unplug the BME280, since it is one of the station's parts
2. Turn off the onboard LEDs and change nothing else
3. Batch uploads once an hour and disable HDMI and the LEDs
4. Read the BME280 less often to cut the sensor's power use
</div>

??? question "Show Answer"
    The correct answer is **C**. Duty cycling means switching things off when they are not needed. The radio and computer use most of the power, so batching uploads lets the radio stay off most of the hour. Disabling HDMI and the LEDs saves about 700 mAh per day, roughly 20 percent of the chapter's example budget. Options A and D target the BME280, which draws almost nothing. Option B helps, but only a little.

    **Concept Tested:** Duty Cycling

    **See:** [Step 5: Use Less](index.md#step-5-use-less)

---

#### 10. Your school wants to build a system that detects local earthquakes without false alarms. Which design would you create?

<div class="upper-alpha" markdown>
1. One very sensitive accelerometer mounted on top of the weather mast
2. Several accelerometers all bolted to the same tall pole
3. One station that sends an alert whenever shaking passes a threshold
4. Several stations firmly coupled to the ground at different sites, reporting to a base station
</div>

??? question "Show Answer"
    The correct answer is **D**. A seismic network uses many stations together. Three or more sites can locate an earthquake by trilateration. A base station can require that several stations agree, which rejects a passing truck that shakes only one. Option A sits on a mast that sways in the wind. Option B puts every sensor at one swaying spot. Option C would alert on every slammed door. Firm ground coupling and agreement make the system trustworthy.

    **Concept Tested:** Seismic Network and Base Station

    **See:** [Many Stations Together](index.md#many-stations-together)

---

!!! mascot-celebration "Field Ready!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Great work, station builders! You sited your station, chose a vented enclosure, balanced a winter power budget, and planned how to get data home when the link drops. Let's take a reading!
