---
title: "Ground Motion: Measuring Earthquakes"
description: Faults and seismic waves, the seismograph's inertial-mass principle from Zhang Heng to MEMS accelerometers, and the crucial distinction between magnitude and intensity scales.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:38:19
version: 0.09
---
# Ground Motion: Measuring Earthquakes

## Summary

The oldest instrument in this book is Zhang Heng's seismoscope of 138 AD. This chapter covers faults and the seismic waves they release, distinguishing the fast P wave from the damaging S wave, then follows the instrument line to Milne's seismograph and the modern seismometer, all built on the same principle: measure the ground against a mass that resists being moved. It draws the crucial distinction between magnitude scales that describe the event and intensity scales that describe the shaking at a place, and closes with the MEMS accelerometers that make earthquake early warning possible from ordinary devices.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Fault
2. Earthquake
3. Seismic Wave
4. Acceleration
5. P Wave
6. S Wave
7. Seismoscope
8. Inertial Mass
9. Accelerometer
10. Mercalli Intensity Scale
11. Seismograph
12. Seismometer
13. MEMS Accelerometer
14. Earthquake Early Warning
15. Richter Scale
16. Moment Magnitude Scale
17. Magnitude Versus Intensity

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 2: The Language of Measurement](../02-language-of-measurement/index.md)
- [Chapter 4: How Sensors Turn the World Into Numbers](../04-how-sensors-work/index.md)

---

## How Do You Measure a Moving Room?

Here is a problem that sounds impossible.

You are standing in a room. The room begins to shake. You want to measure how much it is shaking — but you are shaking too, along with your notebook, your pen, and the table you would put an instrument on. Everything you could measure *against* is moving with the thing you are trying to measure.

It is like trying to measure how fast a train is going while sitting inside it with the blinds down.

The answer is two thousand years old and beautifully simple: find something that refuses to move, and measure the room against that.

This chapter is about that idea and the instruments built from it.

## Faults and Earthquakes

The Earth's outer shell is broken into large plates that move slowly relative to one another — a few centimetres a year, roughly the speed a fingernail grows.

They do not slide smoothly. Friction locks them together, and while they remain locked, the rock around the boundary bends and stores elastic energy, the way a stick bends before it snaps.

A **fault** is a fracture in the Earth's crust along which rock masses have moved relative to each other. Faults are where the plates meet, and where the bending concentrates.

An **earthquake** is the sudden release of accumulated elastic energy when a fault slips. The stored strain converts into vibration in a few seconds, and that vibration travels outward through the rock.

Two terms locate an earthquake:

- The **hypocenter** or focus is the point underground where the slip begins
- The **epicenter** is the point on the surface directly above the hypocenter

Depth matters enormously and is often left out of news reports. A magnitude 6 earthquake 10 kilometres down can devastate a city. The same magnitude 300 kilometres down may barely be felt, because the energy spreads through far more rock before reaching the surface.

## Seismic Waves

A **seismic wave** is a wave of energy travelling through the Earth, released by an earthquake or another sudden disturbance.

Two kinds travel through the Earth's interior, and the difference between them is what makes earthquake early warning possible.

A **P wave** — primary wave — is a compressional wave. The rock is alternately squeezed and stretched *along* the direction the wave travels, exactly like sound in air. In fact P waves *are* sound waves in rock, which is why some people report hearing a low rumble just before shaking begins.

An **S wave** — secondary wave — is a shear wave. The rock moves *perpendicular* to the direction of travel, like a wave running along a shaken rope.

| | P wave | S wave |
|---|---|---|
| Full name | Primary | Secondary |
| Motion | Push and pull along travel direction | Side to side, perpendicular |
| Speed in crust | About 6 km/s | About 3.5 km/s |
| Arrives | First | Second |
| Travels through liquid | Yes | No |
| Damage caused | Minor | Major |
| Feels like | A jolt or thump | Violent rolling and shaking |

Three consequences follow from that table, and each is genuinely important.

**The gap between arrivals gives you distance.** Because P waves travel roughly 1.7 times faster than S waves, the delay between them grows with distance from the epicenter. A single seismometer can estimate its own distance from the earthquake just by timing the gap — roughly 8 kilometres for every second of separation. Three stations doing this independently locate the epicenter by trilateration, the same technique GPS uses in Chapter 5.

**The gap also buys warning time.** The P wave arrives first and is relatively harmless. Detect it, and you have seconds before the destructive S wave arrives. That is the entire basis of earthquake early warning, covered later in this chapter.

**S waves cannot cross liquid**, and this discovery mapped the inside of the planet. In the 1910s Beno Gutenberg noticed that S waves never arrive on the far side of the Earth from a large earthquake — there is an S wave shadow zone. Since shear waves require a material that resists twisting, and liquids do not, the only explanation was a liquid layer in the way. That is how we know the Earth has a liquid outer core. Nobody drilled. They listened.

## The Oldest Instrument in This Book

Around 138 AD, the Chinese polymath Zhang Heng built a device to detect distant earthquakes.

A **seismoscope** is an instrument that detects and indicates that ground motion has occurred, without producing a continuous record of it.

Zhang Heng's was a bronze vessel roughly two metres across, ringed by eight dragon heads facing the eight compass directions. Each dragon held a bronze ball in its mouth. Below each dragon sat an open-mouthed bronze toad.

When a distant earthquake shook the vessel, an internal mechanism — the details are lost, but a suspended pendulum is the accepted reconstruction — released one ball. It fell into the toad's mouth below with a loud clang, alerting attendants and indicating the direction the shaking came from.

The historical record says it detected an earthquake several hundred kilometres away that had not been felt at the capital, and that a messenger arrived days later confirming it. The court was reportedly unimpressed until then.

It detected, and it pointed. What it could not do was record — there was no trace of how strong the shaking was or how long it lasted. And then, remarkably, nothing comparable appeared for seventeen centuries.

## Measuring Against Something That Will Not Move

The breakthrough that turned detection into measurement rests on a principle from basic physics.

**Inertial mass** is the property of matter that resists any change in its motion. A heavy object at rest tends to stay at rest, and it takes force to change that.

Here is how it solves the moving-room problem. Suspend a heavy mass from a spring or a long wire, attached to a frame that is bolted to the ground. When the ground shakes:

- The frame, bolted down, moves with the ground
- The mass, because of its inertia and the softness of its suspension, tends to stay where it was
- The *relative* motion between the frame and the mass is the ground motion

You cannot find a fixed reference outside the moving room. So you make one inside it, out of inertia.

A **seismograph** is an instrument that produces a permanent record of ground motion over time. The classic design attaches a pen to the suspended mass and runs a rotating paper drum past it on the moving frame. As the ground shakes, the drum moves under the nearly-stationary pen and the pen traces the motion.

The word **seismometer** refers to the sensing element itself — the mass, suspension, and motion detector — as opposed to the complete recording system. In modern usage the distinction has softened, but "seismometer" is the more precise term for the sensor.

Luigi Palmieri built an electromagnetic seismograph on the slopes of Vesuvius in 1856 that could record the time of a shock. The modern instrument came from a group of British scientists working in Japan: John Milne, James Ewing, and Thomas Gray, who built the first true seismograph around 1880 after the Yokohama earthquake of that year prompted them to found the Seismological Society of Japan.

Milne then did something more consequential than building the instrument. He organized the first worldwide network of seismograph stations, and that network made an entirely new science possible. Comparing arrival times at many stations located earthquakes precisely. Reading how waves bent and reflected revealed the layered structure of the Earth's interior. Seismology stopped being the study of earthquakes and became a way of measuring the whole planet.

Real seismometers add one refinement worth knowing. A simple mass on a spring has a natural frequency at which it resonates, which distorts readings near that frequency. Modern broadband seismometers use force feedback: an electromagnet actively pushes the mass to keep it centred, and the *current required to hold it still* becomes the output signal. This flattens the response across a wide frequency range and is the same feedback trick used in many precision instruments.

#### Diagram: Inertial Mass Seismometer

<iframe src="../../sims/inertial-mass-seismometer/main.html" width="100%" height="660px" scrolling="no"></iframe>

<details markdown="1">
<summary>Inertial Mass Seismometer</summary>
Type: microsim
**sim-id:** inertial-mass-seismometer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Understand (L2)
Bloom Verb: explain

Learning objective: The learner explains how a suspended mass provides a stationary reference inside a moving frame, and predicts how changing the mass or the suspension stiffness changes what the instrument records.

Purpose: Students accept "the mass stays still" without understanding that it only approximately does, and only for motions faster than the suspension's natural period. Letting them stiffen the spring until the mass moves with the frame — and the recorded trace goes flat — shows why the design requires a soft suspension and a heavy mass.

Canvas layout:
- Left two-thirds: a cutaway side view showing bedrock, a bolted frame, a spring, a suspended mass, a pen attached to the mass, and a rotating drum attached to the frame
- Right or below (responsive): the recorded trace scrolling in real time, plus a readout panel
- Bottom: controls
- Responsive to window resize

Data Visibility Requirements:
  Stage 1: Show ground displacement as a number and as a visible shift of the bedrock and frame
  Stage 2: Show mass displacement as a separate number, so the learner can compare the two directly
  Stage 3: Show the difference between them, labeled "relative motion — this is what gets recorded"
  Stage 4: Show the pen tracing that difference onto the drum, building a seismogram
  Stage 5: Show the suspension's natural period and the dominant period of the current ground motion side by side, with a verdict: "Ground motion is faster than the suspension period. The mass stays put. Good recording." or "Ground motion is slower than the suspension period. The mass follows the frame. Recording is attenuated."

Interactive controls:
- Ground motion selector: "Distant small earthquake", "Nearby large earthquake", "Passing truck", "Slow tilt (a landslide creeping)", and a manual "shake" control the learner can drag
- Mass slider: light to heavy
- Spring stiffness slider: soft to stiff, with the natural period displayed and updating
- Damping slider, with three labelled regions — underdamped (the trace rings after the shaking stops), critically damped (clean), overdamped (sluggish and attenuated)
- "Force feedback mode" toggle that switches to the modern design, showing the electromagnet actively re-centring the mass and the output changing from displacement to the holding current, with a caption explaining that the response becomes flat across frequencies

Required teaching moment: setting the spring to maximum stiffness must make the mass move essentially with the frame and flatten the recorded trace to nearly nothing, with the caption "A stiff suspension makes the mass follow the ground. There is no relative motion left to record. This is why seismometers use soft suspensions and heavy masses."

Instructional Rationale: The objective is Understand/explain, so the design shows all three quantities — ground position, mass position, and their difference — simultaneously as numbers and as motion. The failure case reachable by stiffening the spring is essential: a design principle is only understood once the learner has seen what happens when it is violated. The damping control is included because ringing artifacts appear in real seismograms and students should recognize them as instrument behavior rather than aftershocks.

Implementation: p5.js. Model the mass as a damped harmonic oscillator driven by frame motion; integrate with a fixed small timestep. The recorded trace is frame position minus mass position.
</details>

## Magnitude Versus Intensity

This is the most commonly confused pair of ideas in this book, and news coverage confuses them constantly.

**Magnitude versus intensity** is the distinction between how big an earthquake *was* and how strongly it was *felt at a particular place*.

- **Magnitude** describes the earthquake itself — the energy released at the source. An earthquake has exactly **one** magnitude, no matter where you stand.
- **Intensity** describes the shaking experienced at one location. A single earthquake has **many** intensities — high near the epicenter, lower further away, and varying with local ground conditions.

An analogy that holds up well: magnitude is the wattage of a light bulb; intensity is how bright it looks from where you are sitting. One bulb, one wattage, many brightnesses.

### Intensity Scales

Intensity came first historically, because it needs no instrument — only observers, which is the same insight Beaufort had for wind in Chapter 10.

The **Mercalli intensity scale**, developed by Giuseppe Mercalli in 1902 and revised as the Modified Mercalli scale in 1931, rates shaking from I to XII based on observed effects on people, objects, and buildings.

| Intensity | Description | Observed effects |
|-----------|-------------|------------------|
| I | Not felt | Detected only by instruments |
| II–III | Weak | Felt by a few people indoors; like a passing truck |
| IV | Light | Felt indoors by many; dishes rattle |
| V | Moderate | Felt by nearly everyone; some objects overturned |
| VI | Strong | Felt by all; some heavy furniture moves; slight damage |
| VII | Very strong | Damage to poorly built structures |
| VIII | Severe | Considerable damage to ordinary buildings |
| IX | Violent | Well-designed structures damaged; buildings shifted |
| X | Extreme | Most masonry destroyed; ground cracks |
| XI–XII | Catastrophic | Few structures remain standing; ground waves visible |

Note that it uses Roman numerals, which is a deliberate convention to prevent it being confused with magnitude. And note from Chapter 2 that it is an ordinal scale: intensity VIII is not twice intensity IV.

Intensity maps are made by collecting reports, and this remains a live technique. The USGS "Did You Feel It?" system collects public reports online after every earthquake and builds intensity maps from thousands of responses. It is a genuine citizen science instrument, and Chapter 17 returns to that idea.

### Magnitude Scales

Charles Richter, working with Beno Gutenberg, published the first magnitude scale in 1935. It was designed for a specific purpose: comparing earthquakes in Southern California using a specific instrument, the Wood-Anderson torsion seismometer.

The **Richter scale** — properly the local magnitude scale — is defined from the maximum amplitude recorded on a seismogram, corrected for the station's distance from the epicenter.

It is **logarithmic**, the concept from Chapter 2. Each whole step means:

- **10 times** the ground motion amplitude
- About **32 times** the energy released

That energy factor is the one people underestimate. A magnitude 7 is not "a bit worse" than a magnitude 5 — it releases about \(32 \times 32 = 1000\) times the energy.

| Magnitude difference | Ground motion ratio | Energy ratio |
|---------------------|--------------------|--------------|
| 1.0 | 10× | ~32× |
| 2.0 | 100× | ~1,000× |
| 3.0 | 1,000× | ~32,000× |
| 4.0 | 10,000× | ~1,000,000× |

The Richter scale has a serious flaw that only appeared as instruments improved: it **saturates**. Above about magnitude 7, the recorded amplitude stops increasing proportionally with the true size of the event, because a very large earthquake ruptures a fault over a long time and a large area, and the instrument's short-period response cannot capture it. On the Richter scale, a magnitude 8.5 and a magnitude 9.5 look nearly the same. They are not — one releases about 32 times the energy of the other.

The **moment magnitude scale**, developed by Hiroo Kanamori and Thomas Hanks in 1979, fixed this by measuring the physical size of the event rather than the wiggle on a chart.

It is computed from the seismic moment, which is the product of three physical quantities:

\[ M_0 = \mu \times A \times d \]

where \(\mu\) is the rigidity of the rock, \(A\) is the area of the fault surface that slipped, and \(d\) is the average distance it slipped. Moment magnitude \(M_w\) is derived from that moment.

Because it measures the rupture itself, moment magnitude does not saturate. It agrees closely with the Richter scale for moderate earthquakes, which is why the numbers feel familiar, and it keeps working for the largest events on record.

!!! note "Nobody uses the Richter scale anymore"
    News reports still say "on the Richter scale" out of habit, but seismologists have used moment magnitude for large earthquakes since about 1979. When you read that the 2011 Tohoku earthquake was magnitude 9.1, that is a moment magnitude. On the original Richter scale it would have registered around 8.4 — badly understating one of the largest earthquakes ever recorded.

    This matters for your own writing. If your station records something, report it as moment magnitude or simply as "magnitude," not as "on the Richter scale."

#### Diagram: Magnitude Versus Intensity Map

<iframe src="../../sims/magnitude-versus-intensity-map/main.html" width="100%" height="662px" scrolling="no"></iframe>

<details markdown="1">
<summary>Magnitude Versus Intensity Map</summary>
Type: microsim
**sim-id:** magnitude-versus-intensity-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: differentiate

Learning objective: The learner differentiates magnitude from intensity by observing that one earthquake produces a single magnitude but a field of different intensities, and analyzes how depth, distance, and local ground conditions change the intensity at a given place.

Purpose: This confusion is universal and it is reinforced by news coverage. The only durable fix is to let the learner set one magnitude and then watch a whole map of different intensities appear from it, then probe individual towns and see them disagree.

Canvas layout:
- Main area: a plan-view map with an epicenter marker, several labeled towns at varying distances, and a shaded intensity field drawn as colored contour bands
- A persistent header showing "Magnitude: X.X — one value for this earthquake"
- Right or below (responsive): a probe panel for the selected town, and a comparison list of all towns with their individual intensities
- Bottom: controls
- Responsive to window resize; map preserves aspect ratio

Data Visibility Requirements:
  Stage 1: Show the single magnitude prominently, with a label emphasizing that it does not change anywhere on the map
  Stage 2: Draw the intensity field as Modified Mercalli contour bands with Roman numeral labels and the standard USGS ShakeMap color scheme
  Stage 3: On probing a town, show its distance from the epicenter, its local ground type, and its resulting intensity with the Mercalli description text
  Stage 4: Show the comparison list of all towns sorted by intensity, making it visually obvious that one magnitude produced many intensities
  Stage 5: Show energy comparisons when magnitude changes, e.g. "Raising magnitude from 6.0 to 7.0 released about 32 times more energy"

Towns must include at least one pair that breaks the simple distance rule: a town far from the epicenter on soft sediment experiencing HIGHER intensity than a nearer town on bedrock. The probe panel must explain this: "Soft sediment amplifies shaking. This town is further away and shook harder." This models the real 1985 Mexico City and 1989 San Francisco Marina District cases, which should be named in the infobox.

Interactive controls:
- Magnitude slider, 4.0 to 9.0
- Depth slider, 5 to 300 km, with a caption showing that a deep earthquake produces lower surface intensities everywhere for the same magnitude
- Drag the epicenter anywhere on the map; the intensity field recomputes
- Ground-type toggle per town: bedrock, firm soil, soft sediment, artificial fill
- "Did you feel it?" mode: the learner is given an observed effect description at a town — "dishes rattled, hanging pictures swung" — and must assign the Mercalli intensity, then check against the map

Required framing text, always visible: "Magnitude describes the earthquake. Intensity describes a place. One earthquake, one magnitude, many intensities."

Instructional Rationale: The objective is Analyze/differentiate, which requires holding one quantity fixed while another varies. Keeping the magnitude readout fixed and prominent in the header while the intensity field changes underneath is the design decision that carries the whole lesson. The soft-sediment amplification case is included because it defeats the naive "closer means stronger" rule and forces the learner to reason about local conditions.

Implementation: p5.js. Compute intensity from magnitude, hypocentral distance, and a site amplification factor using a published intensity prediction equation form. Draw contours by evaluating the field on a grid and using marching squares or simple banded fill.
</details>

## Small, Cheap, and Everywhere

Research seismometers cost thousands of dollars, sit on concrete piers in vaults, and are exquisitely sensitive. A school cannot have one. What a school can have arrived from an unrelated industry.

**Acceleration** is the rate of change of velocity, measured in metres per second squared (m/s²). Seismic shaking is acceleration: the ground repeatedly speeds up and slows down in different directions.

Ground acceleration is often expressed as a fraction of \(g\), the acceleration due to gravity, which is 9.81 m/s². This is convenient because it maps directly to force on a structure — 0.5 g of horizontal acceleration means a sideways force half the weight of the building.

An **accelerometer** is a sensor that measures acceleration. It is the same inertial-mass idea, shrunk: a small mass on springs, whose displacement relative to its housing indicates acceleration.

A **MEMS accelerometer** is one built as a Micro-Electro-Mechanical System, with a microscopic proof mass on silicon springs, etched into a chip using the manufacturing processes described in Chapter 4. The mass shifts by nanometres, changing the gap between capacitor plates, and that capacitance change becomes the output signal — Chapter 8's capacitive sensing again, applied to motion instead of moisture.

Analog Devices shipped the ADXL50 in 1991 for automotive airbag deployment. Cars needed a crash sensor cheap enough for every vehicle and reliable enough to trust with a life. Manufacturing volume did the rest, and by the 2000s MEMS accelerometers cost a few dollars and were in phones, game controllers, fitness trackers, and laptops.

Then somebody noticed that a device in every pocket that measures acceleration is a seismic network waiting to be assembled.

| | Research seismometer | MEMS accelerometer |
|---|---|---|
| Sensitivity | Detects motion of nanometres | Detects roughly 0.001 g |
| Detects | Distant magnitude 4 events worldwide | Local shaking, roughly magnitude 4+ nearby |
| Cost | Thousands | A few dollars |
| Installation | Concrete pier, vault, isolation | Screwed to a wall |
| How many exist | Thousands | Billions |
| Strength | Precision | Density |

That last row is the whole argument. A single MEMS accelerometer is a poor seismometer. Ten thousand of them, spread across a city, are something a research network cannot be: everywhere at once.

Several projects have built on this:

- **Quake-Catcher Network** (2008) — USB accelerometers in volunteers' homes and schools
- **MyShake** (2016) — a smartphone app from UC Berkeley using phone accelerometers, with algorithms that separate earthquake shaking from someone putting their phone down
- **Raspberry Shake** — a purpose-built low-cost seismograph on a Raspberry Pi, feeding a global amateur network

!!! info "Your seismic sensor is not chosen yet"
    [Components Used](../../components.md) lists the seismic sensor as TBD. The physics in this chapter applies to any MEMS accelerometer, but two datasheet questions from Chapter 4 matter especially here.

    **Sample rate.** To catch a P wave and separate it from an S wave you need at least 50 samples per second, and 100 is better. Many general-purpose accelerometer modules are configured by default for far slower motion sensing, and Chapter 4's rule about not sampling faster than the sensor responds runs the other way here — an accelerometer that only updates 10 times a second cannot do seismology.

    **Sensitivity and range.** A module set to ±16 g will barely register an earthquake, because it spreads its resolution across a huge range. A ±2 g setting gives eight times the resolution over the range that actually matters. This is Chapter 2's measurement range trade-off in a very concrete form.

    A common choice for student stations is an ADXL345 or MPU-6050 over I2C, which fits the Chapter 12 wiring without additional hardware.

## Earthquake Early Warning

**Earthquake early warning** is a system that detects an earthquake in progress and alerts people before the damaging shaking reaches them.

It is not prediction. Nobody can predict earthquakes, and claims otherwise should be treated with deep suspicion. Early warning is something more modest and entirely real: **the earthquake has already started, and the warning outruns it.**

Two speed differences make this work:

1. The P wave outruns the S wave, buying seconds at any given location
2. Radio and internet signals travel at nearly the speed of light — about 300,000 km/s — while seismic waves crawl along at 3 to 6 km/s

So a station near the epicenter can detect the P wave, transmit that detection, and have an alert arrive in a distant city long before any shaking does.

The warning time depends entirely on distance from the epicenter:

| Distance from epicenter | Approximate warning time |
|-------------------------|--------------------------|
| 20 km | 3–5 seconds |
| 50 km | 10 seconds |
| 100 km | 20–25 seconds |
| 200 km | 45–50 seconds |

There is an unavoidable blind zone directly around the epicenter, where the shaking arrives before any system could process and transmit a warning. That is where the damage is worst, which is the cruel limitation of the whole approach.

Even so, seconds are worth a great deal:

- Trains brake automatically, preventing derailment
- Gas valves close, preventing the fires that historically cause much of the post-earthquake damage
- Elevators stop at the nearest floor and open
- Surgeons lift instruments away from patients
- Factory lines and hazardous processes shut down
- People move away from windows and get under a table

Japan has operated a nationwide system since 2007. Mexico's SASMEX has run since 1991. The United States West Coast system, ShakeAlert, began delivering public alerts in stages from 2019 through 2021.

#### Diagram: Early Warning Race — P Wave Versus Alert

<iframe src="../../sims/early-warning-race/main.html" width="100%" height="636px" scrolling="no"></iframe>

<details markdown="1">
<summary>Early Warning Race — P Wave Versus Alert</summary>
Type: microsim
**sim-id:** early-warning-race<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: assess

Learning objective: The learner assesses how much warning time a city receives from an earthquake early warning system, and justifies why a blind zone exists near the epicenter that no system can eliminate.

Purpose: Early warning is routinely misunderstood as prediction. Racing three things across a map — the P wave, the S wave, and a radio alert — makes it unmistakable that the earthquake has already happened and that the alert is simply faster than the damage.

Canvas layout:
- Main area: a plan-view map with an epicenter, a ring of seismic stations near it, and four labelled cities at 20, 50, 100, and 200 km
- Three expanding rings animate outward from the epicenter: P wave, S wave, and (after detection and processing) the alert
- Right or below (responsive): a per-city panel showing detection time, alert arrival, S wave arrival, and the resulting warning time
- Bottom: controls and a timeline scrubber
- Responsive to window resize; the map preserves scale and the distance legend rescales

Data Visibility Requirements:
  Stage 1: t = 0. Show "Rupture begins" and start the P and S rings expanding at 6 km/s and 3.5 km/s
  Stage 2: Show the moment the nearest station's P wave arrives, labelled "P wave detected"
  Stage 3: Show a processing delay of a configurable few seconds, labelled explicitly "system processing time — this is why the blind zone exists," then launch the alert ring at effectively the speed of light
  Stage 4: For each city, show alert arrival time and S wave arrival time, and compute the difference as warning seconds
  Stage 5: Colour each city green when it received useful warning and red when the shaking arrived first, with the blind zone drawn as a shaded circle

Interactive controls:
- Timeline scrubber so the learner can stop the race at any instant and read all three ring radii
- Processing delay slider, 1 to 10 seconds, showing the blind zone grow and shrink with it
- Station density selector: sparse, moderate, dense. Denser networks detect sooner and shrink the blind zone, which motivates the MEMS argument earlier in the chapter.
- Epicenter depth slider, which changes how long the waves take to reach the surface
- "What can you do in N seconds?" panel that updates per city with concrete actions: 3 s "get under a table"; 10 s "stop the trains, close the gas valves"; 25 s "halt surgery, stop the elevators at the nearest floor"; 50 s "shut down the factory line"

Required framing text, always visible: "The earthquake has already happened. This is not prediction — the alert is simply faster than the shaking."

Required teaching moment: the 20 km city must sometimes fall inside the blind zone depending on the processing delay setting, with the caption "The place that needs warning most gets the least. This is the fundamental limit of early warning."

Instructional Rationale: The objective is Evaluate/assess, which requires weighing a system's performance against what it is for. Pairing each city's warning time with a concrete list of achievable actions turns an abstract number of seconds into a judgment about usefulness. The blind zone is drawn rather than described because its existence is the honest limitation of the technology and students should not leave with an inflated view of it.

Implementation: p5.js. Ring radii = velocity x elapsed time; the alert ring is effectively instantaneous once triggered, so render it as a rapid fill rather than a slow expansion. Detection triggers when the P ring reaches the nearest station.
</details>

## Key Takeaways

- A **fault** is a fracture where rock masses move relative to each other. An **earthquake** is the sudden release of elastic energy when a fault slips.
- A **seismic wave** carries that energy. The **P wave** is compressional and fast; the **S wave** is shear, slower, and does the damage. S waves cannot cross liquid, which is how the liquid outer core was discovered.
- Zhang Heng's **seismoscope** (138 AD) detected and pointed but did not record.
- **Inertial mass** solves the moving-room problem: a suspended mass provides a reference that stays put while the frame moves with the ground. The **seismograph** records that relative motion; the **seismometer** is the sensing element.
- **Magnitude versus intensity**: magnitude describes the earthquake and has one value; intensity describes shaking at a place and has many values. The **Mercalli intensity scale** rates observed effects I to XII.
- The **Richter scale** (1935) is logarithmic — each step is 10× ground motion and ~32× energy — but saturates above about magnitude 7. The **moment magnitude scale** (1979) measures the physical rupture and does not saturate.
- **Acceleration** is what shaking is. The **accelerometer**, and specifically the **MEMS accelerometer** built for car airbags, makes dense low-cost seismic networks possible.
- **Earthquake early warning** is not prediction. It exploits the P–S gap and the speed of radio to deliver seconds of notice.

## Check Yourself

??? question "One earthquake. Town A reports intensity VIII, Town B reports intensity IV. What was the magnitude? Click to check."
    You cannot tell from that information alone, and that is the point. Intensity varies from place to place for a single earthquake — it depends on distance, depth, and local ground conditions. Magnitude is a single number describing the event itself. Both towns experienced the same earthquake with the same magnitude; they experienced different shaking. To find the magnitude you need instrument recordings, not felt reports.

??? question "How much more energy does a magnitude 8 release than a magnitude 6? Click to check."
    About **1,000 times**. Each whole magnitude step is roughly 32 times the energy, so two steps is \(32 \times 32 \approx 1000\). In ground motion amplitude it is 100 times. This is why the difference between magnitudes that look close on a number line is catastrophic in practice.

??? question "P waves travel about 6 km/s and S waves about 3.5 km/s. Your sensor records a 12-second gap between them. How far away was the earthquake? Click to check."
    Roughly **100 km**. The rule of thumb is about 8 km per second of P–S separation, giving \(12 \times 8 = 96\) km. To derive it: in time \(t\) the P wave covers \(6t\) and the S wave covers \(3.5t\). Setting distance \(d\), the arrival times are \(d/6\) and \(d/3.5\), and their difference is 12 s. Solving gives \(d \approx 101\) km. One station gives you distance; three give you the epicenter.

??? question "A town 80 km from the epicenter shakes harder than one 40 km away. Both are on the same fault. How? Click to check."
    Local ground conditions. Soft sediment, artificial fill, and old lake or bay beds amplify seismic shaking substantially compared to bedrock — waves slow down and their amplitude grows. A distant town on landfill can experience considerably higher intensity than a nearer town on rock. This is not hypothetical: it is what happened in Mexico City in 1985, where a lakebed basin amplified shaking from an earthquake 350 km away, and in San Francisco's Marina District in 1989.

---

## What Is Next

Every measurement in this book now has its physics, its history, and its instrument. What none of them have yet is a working computer to read them.

Chapter 12 turns the bare board from Chapter 3 into a station. It covers what an operating system actually does, how to work at the command line, and how to make a program start automatically and keep running after a reboot. Then it covers the buses that carry sensor data — I2C, SPI, and serial — and ends at the BME280 itself, a single chip that combines three of the sensing mechanisms you have met in three separate chapters.
