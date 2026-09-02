---
title: "Time and Place: Recording Where and When"
description: Coordinate systems, latitude and longitude, the longitude problem and the marine chronometer, how GPS trilateration works, the WGS 84 datum, and why remote stations timestamp in UTC.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 21:58:36
version: 0.09
---
# Time and Place: Recording Where and When

## Summary

A reading without a place and a time attached is not yet data. This chapter builds the coordinate system, then tells the story of the longitude problem and the marine chronometer that solved it, and the international agreement that put the prime meridian at Greenwich. It explains how GPS actually works through trilateration against atomic clocks in orbit, why position accuracy varies, and what the WGS 84 datum is. It closes with UTC and timestamps, and why a remote station never records local time.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Coordinate System
2. Latitude
3. Longitude
4. Elevation
5. WGS 84 Datum
6. Sextant
7. Longitude Problem
8. Prime Meridian
9. Atomic Clock
10. Marine Chronometer
11. Trilateration
12. GPS Satellite
13. Coordinated Universal Time
14. Time Zone
15. GPS
16. Timestamp
17. GNSS
18. Position Fix Accuracy

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)

---

## A Number That Lost Its Meaning

Here is a temperature reading: **18.3 °C**.

It has a number. It has a unit. By Chapter 2's definition it is quantitative data. And it is almost completely useless.

Where was it taken? On a mountain or at sea level? In a parking lot or under trees? When was it taken — this morning, or in March of last year? Without those answers you cannot compare it to anything, plot it against anything, or combine it with anyone else's readings.

Now try again: **18.3 °C at 37.0902° N, 122.0644° W, elevation 152 m, at 2026-08-25T14:30:00Z**.

That is a measurement. Every part earns its place. The coordinates let you compare it to the station in the next valley. The elevation lets you correct the pressure reading that came with it. The timestamp lets you plot it, compare it to the same hour last year, and match it against a satellite image of that moment.

This chapter is about the second half of every reading your station will ever take.

## Coordinate Systems

A **coordinate system** is an agreed set of rules for describing a position using numbers.

You already use several without thinking about it. Row 12, seat F. Third floor, second door on the left. Each is a coordinate system: a set of reference points, a set of directions, and units.

Every coordinate system needs three things:

- An **origin** — the agreed zero point that everything is measured from
- **Axes or directions** — which way each number counts
- **Units** — how much each step of a number represents

Change any one of them and the same physical place gets different numbers. That is why coordinate systems, like the units in Chapter 2, are standardization problems before they are mathematical ones.

For positions on Earth, the system in use almost everywhere is latitude and longitude.

**Latitude** measures how far north or south of the equator a place is, in degrees. The equator is 0°. The North Pole is 90° N and the South Pole is 90° S. Lines of equal latitude run east–west in parallel circles, which is why they are called parallels.

**Longitude** measures how far east or west a place is, in degrees, from an agreed north–south reference line. It runs from 0° to 180° in each direction. Lines of equal longitude, called meridians, run pole to pole and converge at both ends.

That difference in shape has a consequence worth noticing:

| | Latitude | Longitude |
|---|---|---|
| Measures | North–south position | East–west position |
| Range | 0° to 90° N or S | 0° to 180° E or W |
| Zero line | The equator | The prime meridian |
| Why zero is there | Physics — the Earth's rotation defines it | Human agreement — it could have been anywhere |
| Lines are | Parallel circles | Meridians converging at the poles |
| One degree equals | About 111 km, everywhere | 111 km at the equator, 0 km at the poles |

That last row matters for your data. A degree of latitude is the same distance everywhere on Earth. A degree of longitude shrinks as you move toward the poles, until at the pole itself all the meridians meet and a degree of longitude covers no distance at all.

**Elevation** is height above a reference surface, usually mean sea level. It is the third number your station needs, and for this project it is not optional.

The reason is pressure. Air pressure falls as you climb, by roughly 12 hPa for the first 100 meters. Two stations 300 meters apart in height will read pressures about 36 hPa apart even in identical weather. Without elevation, you cannot tell whether a pressure difference is weather or geography. Chapter 7 covers the correction in detail.

## The Longitude Problem

Latitude was solved in antiquity. Longitude took two thousand years longer, and the difference between them is one of the best stories in the history of measurement.

Latitude is easy because the sky tells you directly. Measure the angle of the noon Sun above the horizon, or the angle of the pole star at night, and geometry gives you your latitude. Sailors did this for centuries with simple instruments.

The **sextant**, developed in the 1730s, is the refined version of that idea. It measures the angle between two objects — typically a star and the horizon — using a small telescope and a pair of mirrors, with a graduated arc spanning one sixth of a circle, which is where the name comes from. A skilled navigator with a sextant could find latitude to within a couple of kilometers.

Longitude offered no such trick. The sky looks the same at every longitude — it just looks that way at different times. This is the heart of the **longitude problem**: the difficulty of determining east–west position at sea, which went unsolved for centuries and killed a great many sailors.

The underlying idea was understood well before it could be used. The Earth turns 360° in 24 hours, so it turns 15° every hour. If you know the local time where you are — easy, from the Sun — and you also know the time at a reference place, the difference between the two times tells you your longitude:

\[ \text{longitude} = (\text{local time} - \text{reference time}) \times 15° \text{ per hour} \]

So longitude is really a clock problem. And no clock could survive a sea voyage. Pendulum clocks, the best timekeepers on land, were useless on a rolling deck. Temperature changes made springs and metal parts expand and contract. Humidity and salt corroded mechanisms. Being wrong by four minutes put you a degree off, which near the equator is over 100 kilometers of open ocean.

The cost was measured in ships. In 1707 a British fleet under Admiral Shovell misjudged its longitude in fog and struck the Isles of Scilly, losing four ships and around 1,500 men. In 1714 Parliament passed the Longitude Act, offering a prize of £20,000 — an enormous sum — for a practical solution.

John Harrison, a Yorkshire carpenter and self-taught clockmaker, spent decades on the problem. His answer was a **marine chronometer**: a clock accurate and rugged enough to keep reference time through a long sea voyage. His fourth attempt, called H4 and finished in 1761, was a large watch about 13 centimeters across. On a voyage to Jamaica it lost only about five seconds over 81 days.

Harrison had a long fight to be paid, and the story of that fight is worth reading elsewhere. What matters here is the principle: **finding where you are turned out to be a problem of knowing what time it is.**

That principle did not go away. It is exactly how GPS works today.

#### Diagram: The Longitude Problem Solver

<iframe src="../../sims/longitude-problem-solver/main.html" width="100%" height="602px" scrolling="no"></iframe>

<details markdown="1">
<summary>The Longitude Problem Solver</summary>
Type: microsim
**sim-id:** longitude-problem-solver<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Apply (L3)
Bloom Verb: calculate

Learning objective: The learner calculates longitude from a difference between local time and reference time, and evaluates how a given clock error translates into a position error in kilometers.

Purpose: The link between clocks and position is the conceptual key to both Harrison's chronometer and modern GPS, and students find it genuinely surprising. Letting them introduce a clock error and watch the ship's position slide across the ocean makes the stakes concrete in a way the historical anecdote alone does not.

Canvas layout:
- Upper two-thirds: a simplified world map in equirectangular projection with a visible meridian grid every 15 degrees, a marker for the ship's true position, and a second marker for the calculated position
- Lower left: two clock faces, "Local noon (from the Sun)" and "Reference time (your chronometer)"
- Lower right: the worked calculation and the resulting error
- Controls at the bottom
- Responsive to window resize; the map preserves its 2:1 aspect ratio

Data Visibility Requirements:
  Stage 1: Show local time and reference time on two clock faces, both readable to the second
  Stage 2: Show the time difference in hours, minutes, and seconds
  Stage 3: Show the multiplication, e.g. "3 h 20 m 00 s = 3.3333 h x 15 deg/h = 50.00 deg West"
  Stage 4: Place the calculated position marker on the map
  Stage 5: When a clock error is introduced, show BOTH markers and the distance between them in kilometers, with the distance computed correctly for the current latitude

Interactive controls:
- Drag the ship's true position anywhere on the map; both clocks update to match
- "Clock error" slider: -10 minutes to +10 minutes, default 0. Introducing error moves only the calculated marker.
- Latitude selector or direct dragging north/south, so the learner can discover that the same clock error produces a much smaller distance error near the poles
- Historical preset buttons:
  - "Harrison's H4, 1761" — 5 seconds error over 81 days. Show the resulting position error, which is small enough to be barely visible on the map, and state it in kilometers.
  - "A good pendulum clock at sea" — several minutes of error. Show the much larger displacement.
  - "Scilly naval disaster, 1707" — position the fleet near the Isles of Scilly with a realistic error and display a caption naming the four ships lost.

Required readout: an "error budget" line reading, for example, "1 minute of clock error = 0.25 degrees of longitude = 27.8 km at this latitude." The kilometre figure must recompute as latitude changes, since a degree of longitude shrinks with the cosine of latitude.

Instructional Rationale: The objective is Apply/calculate, so the correct pattern is parameter entry with an immediately visible worked result. Showing the true and calculated positions simultaneously is what converts an abstract arithmetic error into a navigational consequence. The latitude dependence is included because it is the same cosine relationship that made longitude uniquely hard, and seeing it emerge from dragging is better than being told.

Implementation: p5.js. Draw the map as a simple coastline polygon set rather than a raster image so there are no external assets. Distance per degree of longitude = 111.32 km x cos(latitude).
</details>

## Agreeing on Zero

Harrison's chronometer created a new problem. Reference time to *where*?

Latitude has a natural zero — the equator, defined by the Earth's rotation. Longitude has none. Any meridian could be zero, and for a long time many were. France measured from Paris. Spain from Cádiz. Britain from Greenwich. Charts from different countries put the same island at different longitudes, which is exactly the Mars Climate Orbiter problem from Chapter 2, several centuries earlier and with ships.

The **prime meridian** is the meridian defined as 0° longitude, the reference from which all longitudes are measured.

Twenty-five nations sent delegates to the International Meridian Conference in Washington, D.C., in October 1884, to pick one. Greenwich won largely because most of the world's shipping already used charts based on it, so choosing anything else meant reprinting nearly every chart afloat. France abstained and kept using Paris for decades afterward.

The same conference did something else that matters to your station. It established the universal day, beginning at midnight at Greenwich — the foundation of the modern time zone system, and the ancestor of the UTC timestamps your data logger will write.

**Time zones** are regions that share a common clock time, mostly defined as whole-hour offsets from the prime meridian. Before railways, every town kept its own local solar noon, and that was fine when travel took days. Trains made it untenable: a timetable is impossible if every station's clock differs. Standard time zones were a railway invention before they were a legal one.

Time zones are also a political construct rather than a scientific one, and it shows. China spans five geographic time zones and uses one. India and Iran use half-hour offsets, and Nepal uses a 45-minute offset. Many places shift by an hour twice a year for daylight saving, on dates that change by country and occasionally by year.

Every one of those irregularities is a reason your station will not use local time.

## How GPS Finds You

**GPS** — the Global Positioning System — is a satellite navigation system that lets a receiver anywhere on Earth determine its position and the exact time.

The idea began by accident. When Sputnik launched in 1957, two researchers at the Johns Hopkins Applied Physics Laboratory, William Guier and George Weiffenbach, tracked it by listening to the Doppler shift in its radio signal and worked out its orbit from a known ground position. Their colleague Frank McClure asked the reverse question: if you know the satellite's orbit, could you find your position on the ground? That inversion became Transit, the first satellite navigation system, operational for the US Navy in 1964.

GPS itself was approved in 1973, launched its first satellite in 1978, and reached full operation in 1995.

The method is called **trilateration** — determining a position from distances to several known points. It is not triangulation, which uses angles. GPS uses distances only.

Trilateration is easier to understand one dimension at a time:

- If you know you are 100 km from one known point, you could be anywhere on a circle of radius 100 km around it.
- Add a second known point and a second distance. The two circles intersect at just two places.
- Add a third, and the three circles meet at exactly one point.

In three dimensions the circles become spheres, and the same logic applies with one extra sphere.

A **GPS satellite** broadcasts two things continuously: where it is, and what time it is according to its onboard clock. Nothing else is needed. Each satellite carries an **atomic clock** — a clock that keeps time by counting the fantastically regular oscillations of atoms, in this case caesium or rubidium, and which drifts by less than a second in millions of years.

The receiver in your station listens, notes what time each signal *says* it was sent, compares that to when it arrived, and multiplies the travel time by the speed of light to get a distance. Do that for several satellites and trilaterate.

There is one complication, and its solution is elegant. The receiver's own clock is a cheap quartz oscillator, nowhere near atomic accuracy. Since light travels about 30 centimeters per nanosecond, a clock error of one microsecond is a position error of 300 meters. That would ruin everything.

The fix: treat the receiver's clock error as a fourth unknown, alongside latitude, longitude, and elevation. Four unknowns need four equations, which is why **a GPS fix requires at least four satellites, not three.** The receiver solves for its own clock error at the same time as its position.

This has a valuable side effect. A GPS receiver ends up knowing the time to well under a microsecond, for free. That is why GPS is the world's most widely used time source, and why it can give your station a better clock than anything else you could afford.

#### Diagram: GPS Trilateration Explorer

<iframe src="../../sims/gps-trilateration-explorer/main.html" width="100%" height="582px" scrolling="no"></iframe>

<details markdown="1">
<summary>GPS Trilateration Explorer</summary>
Type: microsim
**sim-id:** gps-trilateration-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Understand (L2)
Bloom Verb: explain

Learning objective: The learner explains how distances from known satellites determine a position, and explains why four satellites are required rather than three.

Purpose: The four-satellite requirement is the single most counter-intuitive fact about GPS, and prose explanations of the clock-error unknown rarely land. Letting the learner add satellites one at a time and watch the possible-position region collapse makes the logic visible; letting them then introduce a receiver clock error shows why the fourth is needed.

Canvas layout:
- Main area: a 2D top-down view (a deliberate simplification, clearly labeled "simplified to two dimensions") with satellite markers around the edges and the receiver somewhere in the middle
- Overlay: distance circles drawn from each active satellite
- Right or below (responsive): panel listing each satellite with its broadcast time, the arrival time, the computed travel time, and the derived distance
- Bottom: controls
- Responsive to window resize; circle radii scale with the view

Data Visibility Requirements:
  Stage 1: With one satellite active, draw its circle and state "You are somewhere on this circle. Infinitely many possible positions."
  Stage 2: With two, draw both circles and mark the two intersection points: "Two possible positions."
  Stage 3: With three, mark the single intersection: "One position — if the receiver clock were perfect."
  Stage 4: Introduce receiver clock error via a slider. All three circles grow or shrink together, and they no longer meet at a single point. Display: "The three circles no longer intersect. Your clock is wrong, and there is no way to tell by how much."
  Stage 5: Activate a fourth satellite. Show the solver adjusting the assumed clock error until all four circles meet, and display the recovered clock error: "Solved: receiver clock was 0.8 microseconds fast. Position recovered."

For each satellite, the panel must show concrete numbers: broadcast timestamp, arrival timestamp, travel time in milliseconds, and distance in kilometers, so the speed-of-light arithmetic is visible rather than implied.

Interactive controls:
- Toggle each of six satellites on and off individually
- Receiver clock error slider: -2 to +2 microseconds, default 0, with a live readout converting the error to meters of position error at 30 cm per nanosecond
- Drag the receiver to move it; all distances and times recompute
- "Solve for clock error" button, enabled only when four or more satellites are active
- Satellite geometry preset buttons: "Good geometry — satellites well spread" and "Poor geometry — satellites clustered", which visibly change the size of the uncertainty region without changing the number of satellites

Instructional Rationale: The objective is Understand/explain, so the design is step-controlled with concrete numbers rather than animated. The learner must be able to stop at the three-satellite-with-clock-error state and sit with the fact that the circles do not meet — that is the moment the fourth satellite becomes necessary rather than arbitrary. The geometry presets set up the next section on position fix accuracy.

Implementation: p5.js. Model in 2D with three unknowns (x, y, clock bias) so three satellites suffice geometrically and the fourth demonstrates redundancy; label the simplification clearly and note in the panel that the real 3D case needs four for the same reason.
</details>

## Accuracy, Datums, and Other Constellations

**Position fix accuracy** is how close a GPS receiver's reported position is to its true position. It varies, and knowing why keeps you from misreading your own data.

Several things degrade it:

- **Satellite geometry.** Satellites spread widely across the sky give a sharp fix. Satellites clustered together give a smeared one, because the spheres intersect at a shallow angle. This is summarized by a number called dilution of precision.
- **Atmospheric delay.** Signals slow slightly passing through the ionosphere and troposphere, and the delay varies.
- **Multipath.** Signals bounce off buildings, cliffs, and wet ground, arriving late and looking like a longer distance.
- **Obstruction.** Trees, walls, and terrain block satellites, reducing how many are visible.

There is also a historical factor worth knowing. Until 2 May 2000, the United States deliberately degraded the civilian GPS signal in a policy called Selective Availability. Civilian accuracy was around 100 meters. When it was switched off, civilian accuracy improved to under 10 meters overnight, without a single receiver being modified.

Vertical accuracy is consistently worse than horizontal, typically by a factor of two or three. The reason is geometric: satellites are distributed all around you horizontally, but only above you vertically — there are none underground to fix the bottom of the sphere intersection. Since your station needs elevation for the pressure correction, this is a practical limitation.

!!! tip "Measure your elevation once, carefully"
    Rather than trusting your GPS receiver's live elevation reading, look up your station's elevation from a survey map or a topographic service and enter it as a fixed configuration value. A station does not move. A carefully-determined elevation entered once is more accurate than a noisy value re-derived every reading, and it removes a source of drift from your pressure data.

A position is only meaningful relative to a model of the Earth's shape. The Earth is not a sphere; it bulges at the equator and is irregular besides. A **datum** is a mathematical model of the Earth's shape and size used as the reference for coordinates.

The **WGS 84 datum** — World Geodetic System 1984 — is the datum GPS uses. Coordinates from any GPS receiver are WGS 84 coordinates unless something has explicitly converted them.

This matters because different datums put the same physical spot at different numbers. Older maps often use regional datums such as NAD 27 in North America, and the same location can differ by 100 meters or more between datums. Mixing coordinate sets without checking the datum produces errors that look like sloppy surveying but are actually a units problem in disguise.

Finally, GPS is not the only system anymore. **GNSS** — Global Navigation Satellite System — is the general term for all of them:

| System | Operated by | Fully operational since |
|--------|-------------|------------------------|
| GPS | United States | 1995 |
| GLONASS | Russia | 1995, restored 2011 |
| Galileo | European Union | 2016 (initial services) |
| BeiDou | China | 2020 (global) |

Most modern receiver modules, including the SIM7600A in this project's parts list, listen to several constellations at once. More satellites in view means better geometry and a better fix, especially in places where terrain or buildings block part of the sky.

## Timestamps and Why UTC

A **timestamp** is a record of the date and time at which something happened, attached to the data it describes.

Your station will write one on every single reading. Getting the format right now saves considerable pain in Chapter 14.

**Coordinated Universal Time**, abbreviated UTC, is the world's primary time standard. It has no time zones and no daylight saving. It is the same instant everywhere on Earth, and it is maintained by a worldwide network of atomic clocks.

The abbreviation is a compromise. English speakers wanted CUT for "coordinated universal time" and French speakers wanted TUC for "temps universel coordonné." The international body settled on UTC, which matches neither language.

Your station records UTC, always, and here is why local time fails:

- **Daylight saving creates duplicate and missing hours.** When clocks go back, 01:30 local time happens twice in one night. Two readings carry the same timestamp and there is no way to order them. When clocks go forward, an hour of local time never exists at all — and if your logger writes timestamps from local time, it produces a gap that looks exactly like a hardware failure.
- **Time zone rules change.** Governments alter daylight saving dates and sometimes whole time zone assignments, occasionally with a few weeks' notice. Data recorded in local time silently changes meaning.
- **Comparison across places becomes arithmetic.** Comparing your station to one in another country means converting both, correctly, for the specific dates involved.
- **Sorting breaks.** Local timestamps do not sort into chronological order across a daylight saving transition.

UTC has none of these problems. Convert to local time for display, if you want, at the moment you show it to a human. Never store it.

The format matters too. Use ISO 8601, which is the international standard:

```
2026-08-25T14:30:00Z
```

Reading it left to right: year, month, day, then `T` separating date from time, then hours, minutes, seconds, then `Z` meaning UTC. The `Z` stands for Zulu, the military and aviation name for the zero time zone.

ISO 8601 has one property that makes it worth using even if you dislike the look of it. Because the fields run from largest to smallest with fixed widths, **sorting the timestamps alphabetically sorts them chronologically.** That is not a coincidence; it is a design feature, and it means a simple text sort on your log file puts everything in the right order with no date parsing at all.

| Format | Example | Problem |
|--------|---------|---------|
| US style | 8/25/26 2:30 PM | Ambiguous month and day; no time zone; sorts wrongly |
| European style | 25/8/26 14:30 | Ambiguous with US style; no time zone |
| Local with zone | 2026-08-25 14:30 PDT | Zone abbreviations are ambiguous worldwide; breaks at DST |
| **ISO 8601 UTC** | **2026-08-25T14:30:00Z** | **None — use this** |

#### Diagram: Timestamp Trouble Simulator

<iframe src="../../sims/timestamp-trouble-simulator/main.html" width="100%" height="552px" scrolling="no"></iframe>

<details markdown="1">
<summary>Timestamp Trouble Simulator</summary>
Type: microsim
**sim-id:** timestamp-trouble-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: critique

Learning objective: The learner critiques four timestamp formats against the same logged data, and judges which failures are recoverable and which permanently destroy information.

Purpose: Students accept "use UTC" as a rule without understanding it, and then quietly write local timestamps in their own projects anyway. Running identical readings through a daylight saving transition in four formats side by side turns the rule into a demonstrated consequence.

Canvas layout:
- Left: a control area with a format selector, a date/scenario selector, and a "Log a reading" button
- Center: a growing log table showing each reading with its timestamp in the selected format
- Right or below (responsive): a verdict panel describing what has gone wrong and whether it can be repaired
- Responsive to window resize; the table scrolls rather than overflowing

Formats the learner can select:
1. US style — 8/25/26 2:30 PM
2. European style — 25/8/26 14:30
3. Local time with zone abbreviation — 2026-11-01 01:30 PDT
4. ISO 8601 UTC — 2026-11-01T08:30:00Z

Scenarios:
1. **Ordinary day** — readings every 30 minutes. All four formats look fine. Verdict panel: "Nothing is wrong yet. This is why the problem goes unnoticed."
2. **Clocks go back** — the sim logs readings across a 02:00 to 01:00 transition. Formats 1 through 3 produce two readings stamped 01:30. Verdict panel: "Two readings share a timestamp. They cannot be sorted, and the interval between them cannot be computed. This information was never written down, so it cannot be recovered." Format 4 shows two distinct UTC times.
3. **Clocks go forward** — an hour of local time never occurs. Formats 1 through 3 show an apparent one-hour gap. Verdict panel: "This looks exactly like a hardware failure. A student debugging this will search for a fault that does not exist."
4. **Two stations, two countries** — readings from a second station in a different zone are interleaved. Formats 1 through 3 cannot be merged into a single ordered series without per-date conversion; format 4 merges by simple sort.
5. **Ambiguous date** — a reading on 5 August. Formats 1 and 2 both render as 5/8 or 8/5, and the verdict panel asks the learner which date it is, then reveals that both readings are the same and the format cannot tell them apart.

Required interactive check: a "Sort the log" button. Sorting is performed as a plain alphabetical text sort in every format. Only ISO 8601 comes out in correct chronological order; the others visibly scramble. Verdict text must state: "ISO 8601 sorts correctly as plain text because its fields run largest to smallest with fixed widths. That is a design feature, not luck."

Instructional Rationale: The objective is Evaluate/critique, which needs a criterion and comparable cases. Holding the underlying readings constant while varying only the format isolates the format as the cause of every failure. The distinction the verdict panel draws between recoverable and unrecoverable failures is the actual lesson: a duplicate hour is not an inconvenience, it is destroyed information.

Implementation: p5.js. Store readings internally as true UTC instants and render them through format functions, so the underlying data is provably identical across formats. Implement the sort as a literal string comparison on the rendered text.
</details>

!!! warning "8/25/26 is not one date"
    In the United States that is 25 August 2026. In most of the rest of the world it is a nonsense date, because there is no month 25 — but 5/8/26 is genuinely ambiguous, meaning 5 August in Europe and 8 May in America. Data sets have been quietly ruined by this. ISO 8601 removes the ambiguity permanently.

## Key Takeaways

- A **coordinate system** needs an origin, directions, and units. **Latitude** has a natural zero at the equator; **longitude** has none, so its zero was decided by agreement.
- **Elevation** is required, not optional, because air pressure falls about 12 hPa per 100 m of height.
- The **sextant** solved latitude with geometry. The **longitude problem** was really a clock problem, solved by Harrison's **marine chronometer** in 1761.
- The **prime meridian** was fixed at Greenwich by international agreement in 1884, which also created the modern **time zone** system.
- **GPS** works by **trilateration** from **GPS satellites** carrying **atomic clocks**. Four satellites are needed because the receiver's clock error is a fourth unknown.
- **Position fix accuracy** varies with satellite geometry, atmosphere, multipath, and obstruction. Vertical accuracy is always worse than horizontal.
- The **WGS 84 datum** is the Earth-shape model GPS coordinates refer to. **GNSS** covers GPS, GLONASS, Galileo, and BeiDou together.
- Every **timestamp** is recorded in **Coordinated Universal Time** using ISO 8601, because local time creates duplicate hours, missing hours, and unsortable records.

## Check Yourself

??? question "Why does a GPS receiver need four satellites instead of three? Click to check."
    Because there are four unknowns, not three. Latitude, longitude, and elevation are three — but the receiver's own cheap quartz clock has an unknown error, and since light travels 30 cm per nanosecond, even a microsecond of clock error is 300 m of position error. Treating the clock error as a fourth unknown requires a fourth equation, which means a fourth satellite. The bonus is that the receiver ends up knowing the time to better than a microsecond.

??? question "Your chronometer is 2 minutes slow. How far off is your calculated longitude at the equator? Click to check."
    The Earth turns 15° per hour, so it turns 0.25° per minute. Two minutes of error is 0.5° of longitude. At the equator one degree of longitude is about 111 km, so 0.5° is roughly **56 km**. At 60° latitude the same error would be about 28 km, because a degree of longitude shrinks with the cosine of latitude.

??? question "Your logger writes local timestamps. On the night clocks go back, it records readings at 01:30 twice. Why is this unfixable? Click to check."
    Because the information needed to tell the two readings apart was never written down. Both records say 01:30 and nothing distinguishes the one before the transition from the one after. You cannot sort them, you cannot compute the interval between them, and you cannot align them with any other station's data. The only fix is to have recorded UTC in the first place, where the two instants have different timestamps and always did.

??? question "A pressure reading of 985 hPa arrives from a station 300 m higher than yours, which reads 1013 hPa. Is that station in a storm? Click to check."
    Almost certainly not. Pressure falls roughly 12 hPa per 100 m, so 300 m of extra height accounts for about 36 hPa on its own. The higher station reading 985 hPa where you read 1013 hPa is a difference of 28 hPa, which is *less* than elevation alone predicts. Once corrected to sea level, that station is probably reading slightly higher pressure than you. This is exactly why elevation is one of the things the station records.

---

## What Is Next

You can now say where a reading was taken and exactly when. From here the book turns to the readings themselves, one quantity per chapter, each following the same shape: what it physically is, who first measured it and how, what units it is reported in, and what it affects in the world.

Chapter 6 starts with temperature — the quantity everyone thinks they understand. It turns out that what a thermometer measures is the motion of atoms, that the three temperature scales in common use disagree about where zero belongs and why, and that how you shield a thermometer from sunlight matters as much as which thermometer you buy.
