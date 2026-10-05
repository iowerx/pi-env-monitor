# Quiz: Time and Place: Recording Where and When

Test your understanding of latitude, longitude, elevation, the longitude problem, how GPS works, datums, and UTC timestamps with these review questions.

!!! mascot-tip "Where, When, and How Sure"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Many of these questions come back to one big idea from the chapter: finding where you are is really a question of knowing what time it is. Keep that in mind as you go!

---

#### 1. Which line is defined as 0° longitude?

<div class="upper-alpha" markdown>
1. The equator
2. The prime meridian through Greenwich
3. The meridian through Paris
4. The parallel at 90° N
</div>

??? question "Show Answer"
    The correct answer is **B**. The prime meridian is the meridian defined as 0° longitude. Delegates at the International Meridian Conference in 1884 chose Greenwich, mostly because most ships already used charts based on it. The equator (A) is 0° latitude, not longitude. France measured from Paris (C) for a time, but that was not the agreed zero. The parallel at 90° N (D) is the North Pole. Longitude's zero came from human agreement, not physics.

    **Concept Tested:** Prime Meridian

    **See:** [Agreeing on Zero](index.md#agreeing-on-zero)

---

#### 2. Sailors used a sextant to find their latitude. What does a sextant measure?

<div class="upper-alpha" markdown>
1. The time difference between local noon and noon at Greenwich
2. The distance from the ship to the nearest coastline
3. The speed of the ship as it moves through the water
4. The angle between two objects, such as a star and the horizon
</div>

??? question "Show Answer"
    The correct answer is **D**. A sextant measures the angle between two objects, usually a star and the horizon, using a small telescope and two mirrors. Latitude measures how far north or south of the equator you are, and the angle of the noon Sun or the pole star gives it directly. Option A describes how longitude is found with a clock, not a sextant. Options B and C are not what a sextant measures.

    **Concept Tested:** Sextant and Latitude

    **See:** [The Longitude Problem](index.md#the-longitude-problem)

---

#### 3. What does a GPS satellite broadcast continuously?

<div class="upper-alpha" markdown>
1. A map of the ground below it and the local weather
2. The receiver's position and the receiver's clock error
3. Its own position and the time from its onboard atomic clock
4. The distance to each receiver and that receiver's elevation
</div>

??? question "Show Answer"
    The correct answer is **C**. A GPS satellite broadcasts only two things: where it is, and what time its onboard clock says. That clock is an atomic clock, which counts the very regular oscillations of atoms and drifts less than a second in millions of years. The receiver, not the satellite, works out its own position and clock error (B) and distances (D). Satellites do not send maps or weather (A).

    **Concept Tested:** GPS Satellite and Atomic Clock

    **See:** [How GPS Finds You](index.md#how-gps-finds-you)

---

#### 4. Why was the longitude problem really a clock problem?

<div class="upper-alpha" markdown>
1. Sailors could only measure the Sun's angle when a clock said it was noon
2. Navigators needed a pendulum clock to find the angle of the pole star
3. Ships had to reach port at a set time to win the Longitude Act prize
4. Longitude comes from the time difference between your location and a reference place
</div>

??? question "Show Answer"
    The correct answer is **D**. The Earth turns 15° each hour. If you know your local time and the time at a reference place, the difference gives your longitude. No clock could keep reference time on a rolling ship until John Harrison built a marine chronometer. His H4 lost only about five seconds in 81 days. Option A confuses longitude with latitude. Pendulum clocks (B) were useless at sea. Option C is not why the problem was about clocks.

    **Concept Tested:** Longitude Problem and Marine Chronometer

    **See:** [The Longitude Problem](index.md#the-longitude-problem)

---

#### 5. How does the trilateration used by GPS differ from triangulation?

<div class="upper-alpha" markdown>
1. Trilateration finds a position from distances only, not angles
2. Trilateration finds a position from angles only, not distances
3. Trilateration needs exactly three satellites, but triangulation needs four
4. Trilateration works only on land, but triangulation works only at sea
</div>

??? question "Show Answer"
    The correct answer is **A**. GPS finds a position by trilateration, which uses distances to several known points. Triangulation uses angles instead. Option B reverses the two methods. Option C is wrong because a GPS fix needs at least four satellites, since the receiver's clock error is a fourth unknown. Option D is not a difference the chapter describes. One distance puts you on a circle, two narrow it to two points, and three meet at one point.

    **Concept Tested:** Trilateration and GPS

    **See:** [How GPS Finds You](index.md#how-gps-finds-you)

---

#### 6. A good GPS fix and an older map that uses the NAD 27 datum give positions for the same hilltop that are about 100 meters apart. What best explains the gap?

<div class="upper-alpha" markdown>
1. They use different models of Earth's shape, and GPS uses WGS 84
2. The GPS receiver reports its position in UTC instead of local time
3. The older map measures latitude from the North Pole, not the equator
4. GPS signals always slow down in the ionosphere by exactly 100 meters
</div>

??? question "Show Answer"
    The correct answer is **A**. A datum is a mathematical model of Earth's shape used as the reference for coordinates. GPS coordinates are in the WGS 84 datum. Older maps often use regional datums like NAD 27, and the same spot can differ by 100 meters or more. Option B mixes up time and place. Latitude is measured from the equator on every map (C). Atmospheric delay (D) varies and is not a fixed amount.

    **Concept Tested:** WGS 84 Datum

    **See:** [Accuracy, Datums, and Other Constellations](index.md#accuracy-datums-and-other-constellations)

---

#### 7. Which timestamp should your station write for a reading taken at 14:30 UTC on 3 April 2027?

<div class="upper-alpha" markdown>
1. 4/3/27 2:30 PM
2. 2027-04-03 14:30 PDT
3. 2027-04-03T14:30:00Z
4. 03/04/2027 14:30
</div>

??? question "Show Answer"
    The correct answer is **C**. A timestamp records when something happened. Your station uses Coordinated Universal Time in ISO 8601 format: year, month, day, `T`, time, and `Z` for UTC. Because the fields run from largest to smallest, text sorting puts them in time order. Option A is US style and is ambiguous. Option B uses a local zone, which breaks at daylight saving. Option D is ambiguous between 3 April and 4 March.

    **Concept Tested:** Timestamp and Coordinated Universal Time

    **See:** [Timestamps and Why UTC](index.md#timestamps-and-why-utc)

---

#### 8. A navigator finds that local noon happens 3 hours after noon at the reference meridian. How many degrees of longitude is the ship from that meridian?

<div class="upper-alpha" markdown>
1. 3°
2. 15°
3. 30°
4. 45°
</div>

??? question "Show Answer"
    The correct answer is **D**. Longitude measures east–west position from the reference meridian. The Earth turns 360° in 24 hours, which is 15° every hour. A 3-hour time difference means 3 × 15° = 45°. Option A uses the hours as if they were degrees. Option B is only one hour's worth of turning. Option C is two hours' worth. This is the same reasoning a marine chronometer made possible at sea.

    **Concept Tested:** Longitude

    **See:** [The Longitude Problem](index.md#the-longitude-problem)

---

#### 9. Your station sits 200 m higher than a friend's station a few kilometers away. In identical weather, how should your pressure reading compare?

<div class="upper-alpha" markdown>
1. About 12 hPa lower
2. About 24 hPa higher
3. About 24 hPa lower
4. About 200 hPa lower
</div>

??? question "Show Answer"
    The correct answer is **C**. Elevation is height above mean sea level. Air pressure falls about 12 hPa for each 100 m you climb, so 200 m higher means about 24 hPa lower. Option A uses only one 100 m step. Option B gets the direction backward, because pressure drops as you go up. Option D treats each meter as one hectopascal. Without recorded elevation, you could mistake this difference for weather.

    **Concept Tested:** Elevation

    **See:** [Coordinate Systems](index.md#coordinate-systems)

---

#### 10. A station logs local time in a place that uses daylight saving. One spring night, the log shows no readings for one whole hour, yet the hardware was fine. What best explains the gap?

<div class="upper-alpha" markdown>
1. The sensor lost power for an hour and needs to be repaired
2. Local clocks jumped forward an hour, so that hour of local time never existed
3. The GPS receiver lost its fix, so the station clock stopped for an hour
4. UTC skips an hour every spring, and the logger followed it
</div>

??? question "Show Answer"
    The correct answer is **B**. Time zones are regions that share one clock time, and many shift an hour for daylight saving. When clocks go forward, an hour of local time never exists. A logger using local time shows a gap that looks like a hardware failure (A), but nothing broke. Option C does not match a working station. Option D is wrong because UTC has no daylight saving. Recording UTC avoids the problem completely.

    **Concept Tested:** Time Zone

    **See:** [Agreeing on Zero](index.md#agreeing-on-zero)

---

!!! mascot-celebration "Pinned in Space and Time!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Fantastic work, station builders! You followed the path from sextants and chronometers to GPS satellites, datums, and UTC timestamps. Now every reading you take can carry its own where and when.
