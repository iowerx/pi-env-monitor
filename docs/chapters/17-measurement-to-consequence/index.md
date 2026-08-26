---
title: From Measurement to Consequence
description: Tracing each measurement into the decisions it drives - forecasting, agriculture, energy, aviation, building codes, heat islands, air quality, wildfire, flood and tsunami warning - and sharing your own data.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:58:38
version: 0.09
---
# From Measurement to Consequence

## Summary

This chapter answers the question the whole book has been building toward: so what? It traces each measurement into the decisions it drives — weather forecasting and severe weather warnings, agricultural planning and evapotranspiration, energy demand and solar generation, aviation safety, building codes written from seismic and wind data, urban heat islands, air quality, wildfire risk, and flood and tsunami warning. It covers the long climate record that instrumental measurement makes possible, and closes with citizen science, data sharing, and communicating findings to people who were not there.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Energy Demand
2. Data Sharing
3. Urban Heat Island
4. Air Quality
5. Citizen Science
6. Wildfire Risk
7. Tsunami Warning
8. Science Communication
9. Aviation Safety
10. Climate Record
11. Evapotranspiration
12. Solar Energy Generation
13. Weather Forecasting
14. Agricultural Planning
15. Building Code
16. Severe Weather Warning
17. Flood Warning

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 6: Temperature: From the Thermoscope to the Silicon Chip](../06-temperature/index.md)
- [Chapter 7: Barometric Pressure: The Weight of the Atmosphere](../07-barometric-pressure/index.md)
- [Chapter 8: Humidity and Dew Point: The Water Hidden in the Air](../08-humidity-and-dew-point/index.md)
- [Chapter 9: Solar Radiation: The Energy That Drives the Weather](../09-solar-radiation/index.md)
- [Chapter 10: Wind: Measuring Air in Motion](../10-wind/index.md)
- [Chapter 11: Ground Motion: Measuring Earthquakes](../11-ground-motion/index.md)
- [Chapter 14: Logging Data: Timestamps, Intervals, and Files](../14-data-logging/index.md)
- [Chapter 15: Charting and Interpreting Your Data](../15-charting-and-analysis/index.md)
- [Chapter 16: Building the Station for the Outdoors](../16-building-for-outdoors/index.md)

---

## So What?

You have built a station. It sits outside and writes numbers to a file.

It is entirely fair to ask what any of that is for.

The answer is that decisions get made from numbers like yours, and the decisions are not small. Somebody decides whether your school cancels outdoor practice. Somebody decides how high a bridge deck sits above a river, how strong a roof has to be in your county, when a field gets irrigated, and whether a town evacuates.

Every one of those decisions traces back through a chain: an instrument, a person who read it, a record kept over years, and a rule written from that record. This chapter follows those chains — one per measurement — and then asks what you should do with your own.

## Temperature Decides When Things Grow and What They Cost

**Agricultural planning** is the use of environmental measurements to decide what to plant, when to plant it, when to irrigate, and when to harvest.

Almost all of it runs on temperature, through a calculation called growing degree days. Crops develop according to accumulated warmth rather than elapsed days, and a farmer tracks that accumulation:

\[ \text{GDD} = \frac{T_{\text{max}} + T_{\text{min}}}{2} - T_{\text{base}} \]

where \(T_{\text{base}}\) is the temperature below which that crop does not develop — about 10 °C for maize. Sum the daily values and you can predict flowering and harvest far more reliably than any calendar.

Your station produces exactly the inputs this needs. A daily maximum and minimum, accumulated across a season, is a growing degree day record.

Temperature also drives irrigation, through the water cycle from Chapter 8.

**Evapotranspiration** is the combined loss of water from a surface by evaporation from soil and transpiration from plants. It is what determines how much water a field actually needs.

Calculating it requires four of your seven measurements — temperature, humidity, wind speed, and solar radiation — which is why a full weather station rather than a thermometer is the standard tool on modern farms. Warmer, drier, windier, and sunnier all increase water loss, and the standard method combines them into millimetres of water per day.

**Energy demand** is the electricity a region needs at a given moment, and it is largely a temperature problem.

Utilities forecast it using heating degree days and cooling degree days, which are the same accumulation idea applied to buildings. Below about 18 °C, buildings need heating; above it, cooling. Grid operators run these forecasts continuously, because electricity cannot be stored at scale and generation has to match demand minute by minute. A forecast error of a degree or two across a large region translates into hundreds of megawatts.

There is a particularly sharp case. On a hot afternoon, air conditioning demand peaks at the same time across an entire city, and if that peak exceeds capacity the result is rolling blackouts. The forecast that prevents them is built from temperature data.

## Pressure Predicts, and Keeps Aircraft Apart

**Weather forecasting** is the prediction of future atmospheric conditions from current measurements.

Chapter 7 covered the mechanism at one station: falling pressure means deteriorating weather. A modern forecast does the same thing across a continent, feeding readings from thousands of surface stations, weather balloons, aircraft, buoys, and satellites into numerical models that solve the physics of the atmosphere forward in time.

Those models cannot start from nothing. They need an accurate picture of the atmosphere *right now*, at as many points as possible — a process called data assimilation. Every reading improves the starting point, and the forecast is only as good as the observations underneath it. This is the direct answer to "what is one more station worth."

**Severe weather warning** is the alerting of the public to imminent dangerous conditions.

The distinction the professionals draw is worth learning, because it is widely misunderstood:

- A **watch** means conditions are favourable for severe weather. Be prepared.
- A **warning** means severe weather is happening or imminent. Act now.

Warnings are built from the signatures this book has taught you to recognize. Rapid pressure falls (Chapter 15's tendency), wind speeds crossing the Saffir-Simpson thresholds (Chapter 10), and the temperature-humidity combinations that produce dangerous heat index values (Chapter 8) all trigger specific warning products.

Chapter 7's Admiral FitzRoy issued the first of these in the 1860s using nothing but a network of aneroid barometers and the telegraph. He was criticized for presuming to predict the weather at all. He was also right often enough to save lives, and the service he founded still exists.

**Aviation safety** depends on pressure in a way that is unforgiving of error.

Chapter 7 explained that an aircraft altimeter is a barometer, and that flying from high pressure into low pressure without resetting it makes the aircraft lower than it reads. Airports therefore broadcast their current sea level pressure continuously, and pilots set it before approach. Above a defined transition altitude, all aircraft instead set a standard 1013.25 hPa — so their altimeters may all be slightly wrong in absolute terms but are wrong *identically*, which keeps them correctly separated from each other.

Aviation also depends on the wind measurements of Chapter 10. Crosswind limits determine whether a runway can be used at all. Wind shear — a sudden change in wind with height — is dangerous during takeoff and landing, and airports operate dedicated detection systems for it.

## Solar Radiation Sizes the Grid

**Solar energy generation** is electricity produced from sunlight by the photovoltaic effect of Chapter 9.

Before anyone builds a solar farm, somebody measures the site — often for a full year — because the economics depend entirely on insolation, the accumulated energy figure from Chapter 15. Two sites a hundred kilometres apart can differ by 20 percent in annual insolation, which is the difference between a viable project and a failed one.

Once operating, solar generation creates a forecasting problem of its own. Output depends on cloud, which changes in minutes, and grid operators must balance supply and demand continuously. Networks of irradiance sensors now feed short-term generation forecasts so operators know when to bring other sources online.

You have done this calculation already. Chapter 16 sized your station's panel from insolation and a loss factor. A utility-scale solar farm uses the same arithmetic with more zeros.

Chapter 9's UV index feeds a different kind of decision. Public health agencies issue UV forecasts, schools schedule outdoor activity around them, and workplace rules for outdoor workers are written from them.

## Wind and Ground Motion Are Written Into Buildings

A **building code** is a set of legal requirements for how structures must be designed and built.

This is where environmental measurement becomes law, and it is the clearest example in this book of data turning into a rule that governs everyone.

Codes specify a **design wind speed** for each region — the wind a structure must survive. That number comes from statistical analysis of decades of anemometer records, asking what wind speed has a defined probability of being exceeded in a given period. Chapter 10's wind load rule then converts it into forces: doubling the speed quadruples the force, so a coastal region's design speed produces requirements far beyond an inland one's.

Codes also specify **seismic design categories**, derived from the same kind of analysis applied to Chapter 11's ground motion records. A building in a high-seismic zone needs bracing, ductile connections, and foundation details that would be pointless expense elsewhere.

Both sets of requirements are revised as the record lengthens. A region that experiences an unprecedented event usually sees its code strengthened afterward, which is why building codes are, in a real sense, a written memory of past disasters.

!!! note "Your school was designed from data like yours"
    The building you are sitting in has a roof rated for a wind speed somebody measured, and if you live in a seismic region, a structural system chosen from ground motion records. Neither number came from a computer model alone. Both trace back to instruments, in the ground and on masts, read over decades by people who kept showing up.

    That is what Chapter 1 meant by saying the patience is the point.

**Tsunami warning** connects Chapter 11 to the ocean.

Undersea earthquakes can displace enormous volumes of water. Warning systems detect the earthquake seismically within minutes, estimate its magnitude and mechanism, and issue an initial alert — then confirm or cancel it using deep-ocean pressure sensors called DART buoys that detect the passing wave directly.

The timing works because seismic waves travel through rock far faster than tsunami waves travel through water. A tsunami crosses the deep Pacific at around 700 km/h, which sounds fast until you compare it to a seismic wave at 6 km/s, or an alert at the speed of light. That gap is measured in hours for a distant coastline — the same principle as Chapter 11's earthquake early warning, with a much larger margin.

**Flood warning** combines precipitation measurements with river gauges and models of how water moves through a catchment.

The relevant quantities are rainfall rate and total, soil moisture from previous weeks, and river level. Flash flood warnings in particular depend on dense rainfall measurement, because a flash flood can result from an intense storm over a small area that a sparse gauge network misses entirely. This is precisely the gap that community rain-gauge networks were created to fill, and Chapter 16's argument for density over individual precision applies exactly.

## Cities Make Their Own Weather

An **urban heat island** is a built-up area that is significantly warmer than the surrounding countryside.

The difference is not small. Cities commonly run 2 to 5 °C warmer than nearby rural areas, and the gap can exceed 10 °C on clear calm nights.

Every cause is something this book has measured:

- **Albedo** (Chapter 9). Asphalt reflects about 8 percent of sunlight; grass reflects about 25 percent. Dark surfaces absorb the difference.
- **Thermal mass** (Chapter 6). Concrete and brick store heat all day and release it all night, which is why the difference peaks after dark rather than at noon.
- **Reduced evapotranspiration** (Chapter 8). Vegetation cools by transpiring; pavement does not. Removing plants removes a cooling mechanism.
- **Reduced wind** (Chapter 10). Buildings block airflow that would otherwise carry heat away.
- **Waste heat.** Air conditioning, vehicles, and industry all dump energy into the air, and air conditioning does so precisely when it is hottest.

The consequences are unevenly distributed, and that is the part that makes this a policy question rather than a curiosity. Heat is the deadliest weather hazard in many countries, and within a single city the hottest neighbourhoods are frequently those with the least tree cover, the most pavement, and the fewest resources to adapt. Mapping the difference is the first step toward addressing it, and city governments now run tree-planting, cool-roof, and cooling-centre programmes based on exactly this kind of data.

Here is the important part for you: **an urban heat island is measured with stations like yours.** Official networks are far too sparse to resolve differences between neighbourhoods. Dense volunteer and school networks are how these maps get made.

**Air quality** is another quantity your station influences without directly measuring.

Your station does not have a pollution sensor. But Chapter 10's wind and Chapter 8's humidity largely determine what happens to pollution once it exists. Wind disperses it; calm conditions let it accumulate. A temperature inversion — warm air sitting above cool air, which suppresses the convection of Chapter 8 — traps pollution near the ground and is responsible for most severe urban smog episodes. Humidity affects particle formation and how far you can see.

**Wildfire risk** is assessed from a combination of measurements, and your station provides most of them.

Fire danger indices combine:

- **Relative humidity** (Chapter 8) — low humidity dries fuel and lets fire spread
- **Temperature** (Chapter 6) — heat dries fuel further
- **Wind speed** (Chapter 10) — the dominant factor in how fast a fire moves
- **Recent precipitation** — how much moisture the fuel retains
- **Days since rain** — the accumulation that turns vegetation into fuel

The particularly dangerous combination has a name in several regions: hot, very dry, and windy at once. In California those are the Santa Ana and Diablo wind events; in Australia, the conditions preceding the worst fire days. Utilities now pre-emptively shut off power lines when these thresholds are crossed, because a spark under those conditions is likely to become a catastrophe. Those thresholds are defined in terms of measurements, and the decision is triggered by weather station data.

#### Diagram: Measurement to Decision Explorer

<iframe src="../../sims/measurement-to-decision-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Measurement to Decision Explorer</summary>
Type: graph-model
**sim-id:** measurement-to-decision-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Bloom Taxonomy Level: Analyze (L4)
Bloom Verb: organize

Learning objective: The learner organizes the relationships between the seven measured quantities and the real-world decisions they drive, traces any decision back to the measurements it requires, and identifies which decisions depend on more than one quantity.

Purpose: This is the capstone diagram of the whole book and the visual statement of the course's primary goal. Seventeen chapters have introduced measurements one at a time; this element assembles the whole dependency structure so the learner can see that most consequential decisions require several measurements together.

Node types:
1. **Measurement nodes** (seven, coloured by their taxonomy colour from the learning graph): Temperature, Barometric Pressure, Humidity, Solar Radiation, Wind Speed, Ground Motion, Location and Time
2. **Derived quantity nodes** (mid-layer, neutral colour): Dew Point, Heat Index, Wind Chill, Pressure Tendency, Insolation, Evapotranspiration, Growing Degree Days, Fire Danger Index, Sustained Wind, Sea Level Pressure
3. **Decision nodes** (outer layer, warm colour): Weather Forecasting, Severe Weather Warning, Agricultural Planning, Irrigation Scheduling, Energy Demand Forecast, Solar Energy Generation, Aviation Safety, Building Code Wind Design, Building Code Seismic Design, Urban Heat Island Mitigation, Air Quality Advisory, Wildfire Risk and Power Shutoff, Flood Warning, Tsunami Warning, Climate Record

Edge types:
- **Solid arrow: "required by"** — this measurement is necessary for that derived quantity or decision
- **Dashed arrow: "improves"** — helpful but not strictly required
- Edge thickness indicates how central the measurement is to that decision

Layout: Three-layer hierarchical, measurements on the left, derived quantities in the middle, decisions on the right, with force-directed adjustment for readability.

Interactive features:
- **Hover a node**: show its properties — for measurements, the unit and the chapter that covers it; for decisions, a one-sentence description of who makes it and what is at stake
- **Click a measurement**: highlight every downstream derived quantity and decision it feeds, and dim everything else. The panel states, e.g. "Wind speed feeds 9 of the 15 decisions in this diagram."
- **Click a decision**: highlight every upstream measurement it requires, and list them. The panel states, e.g. "Wildfire risk requires temperature, humidity, wind speed, and precipitation history. No single measurement is sufficient."
- **Drag** nodes; **zoom** with the wheel; **pan** by dragging the background
- **"What if this sensor failed?"** mode: the learner disables one measurement node, and every decision that depended on it is marked as degraded or impossible, with a count. This is the most direct statement of why each sensor is on the station.
- **Filter** by chapter, so a learner reading Chapter 10 can see only the wind subgraph

Required legend explaining node colours, edge styles, and thickness.

Required framing panel, always visible: "Every arrow here is a real dependency. Somewhere, someone makes this decision using this measurement."

Instructional Rationale: The objective is Analyze/organize, which is precisely the task of assembling parts encountered separately into a structure. A graph model is the correct representation because the relationships are genuinely many-to-many — no table or list can show that wind speed feeds nine different decisions while also showing that wildfire risk needs four different inputs. The sensor-failure mode is included because the course's Evaluate-level outcome asks students to judge which measurement matters most for a given decision, and removing one is the sharpest way to answer that.

Implementation: vis-network with a hierarchical layout, `layout.hierarchical.direction: 'LR'`. Store nodes and edges as data with chapter references so the filter and the highlight logic are data-driven rather than hard-coded.
</details>

## The Long Record

A **climate record** is a long series of environmental measurements used to describe conditions over decades or centuries.

Chapter 1 drew the distinction: weather is what is happening, climate is the 30-year pattern. Only the second one requires patience.

The global instrumental temperature record begins around 1850, which is when enough standardized stations existed worldwide to compute a meaningful global average. Before that, we rely on proxy records — tree rings, ice cores, coral bands, lake sediments — read by the climatologists of Chapter 1.

Building a usable record out of a century of instruments is genuinely hard, and the difficulties are exactly the ones this book has covered in miniature:

| Problem | Chapter | How it is handled |
|---------|---------|-------------------|
| Instruments changed | 6 | Overlap periods; compare old and new side by side |
| Stations moved | 16 | Detect the discontinuity; document and adjust |
| Cities grew around stations | 17 | Identify urban heat island contamination |
| Observation times changed | 5 | Correct for the resulting bias |
| Sensors drifted | 15 | Compare against neighbours; recalibrate |
| Coverage was uneven | 16 | Weight by area; acknowledge uncertainty |

These corrections are sometimes accused of being manipulation. They are the opposite, and you are now in a position to see why. A record assembled from a hundred different instruments in a hundred changing locations means nothing *unless* those changes are found and accounted for. You will face the same problem the first time you move your own station or replace a sensor, and Chapter 15 already told you the answer: document every change, never edit historical data, record the correction separately.

Your station cannot produce a climate record. A school year is weather. But every climate record that exists was built out of weather readings taken by people who kept showing up, one day at a time — and the ones taken in the 1880s were taken by people who had no idea what they would eventually be used for.

## What To Do With Yours

**Citizen science** is scientific work carried out wholly or partly by members of the public, often in collaboration with professional scientists.

It is not a simplified imitation of real science. Several networks accept amateur data and feed it directly into professional products:

| Network | What it collects | Who uses it |
|---------|------------------|-------------|
| CoCoRaHS | Daily precipitation from manual gauges | US National Weather Service, researchers |
| Weather Underground PWS | Full station data | Forecasters, the public, media |
| Met Office WOW | Full station data | UK Met Office |
| Raspberry Shake | Seismic data | Seismologists, earthquake catalogues |
| MyShake | Phone accelerometer data | Earthquake early warning research |
| USGS Did You Feel It? | Felt reports after earthquakes | Official intensity maps |

CoCoRaHS is worth singling out. It was founded after a 1997 flash flood in Fort Collins, Colorado, that a sparse official gauge network had entirely failed to capture — rainfall varied enormously across a few kilometres and the official gauges missed the intense core. The response was a volunteer network of simple manual gauges, and its data now feeds official forecasts and drought monitoring. It exists because density beat precision, which is Chapter 16's argument stated as history.

**Data sharing** is making your data available for others to use.

To be useful to anyone else, shared data needs the things Chapter 14 covered:

- **A machine-readable format** — CSV is ideal
- **A complete metadata file** — location, elevation, sensor model, exposure, processing, calibration
- **Explicit units** in every column name
- **Quality flags** retained, not silently filtered
- **A stated licence** so people know what they may do with it
- **A stable location** — a GitHub repository, an institutional archive, a network's upload

A useful standard is FAIR: Findable, Accessible, Interoperable, and Reusable. Your metadata file from Chapter 14 already does most of the work.

!!! tip "Share the problems too"
    Publish the gaps, the flagged outliers, the day the sensor sat in the sun before you noticed, and the calibration offset you applied. Data with documented flaws is far more useful than data that has been quietly cleaned, because a user can decide for themselves what to exclude.

    Cleaned data with no record of what was removed is not more trustworthy. It is less, because nobody can check it.

**Science communication** is explaining scientific work to people who were not involved in it.

This is the final skill of the book, and the Create-level outcome of the course. A finding nobody understands changes nothing.

What works, in order of importance:

1. **Lead with the finding, not the method.** "The parking lot runs 6 °C hotter than the field" is the story. How you wired the sensor is background.
2. **Show one good chart.** Chapter 15's rules apply: label the axes, give the units, be honest about the scale.
3. **Give the number a comparison.** "6 °C hotter" means little alone. "6 °C hotter — the difference between a comfortable day and a heat advisory" lands.
4. **Say what you did not measure.** Naming your limitations makes the rest more credible, not less.
5. **State the uncertainty.** Chapter 2 established that a number without an uncertainty claims more than you know.
6. **Say what should happen next.** A measurement that implies an action is more useful than one that does not.

The structure that works for a project write-up:

- **The question** — what did you want to know?
- **The method** — station, sensors, siting, period, sampling interval
- **The data** — one or two charts, honestly presented
- **The finding** — what the data shows
- **The limitations** — what could be wrong, what you could not measure
- **What it implies** — why anyone should care

#### Diagram: Environmental Claim Checker

<iframe src="../../sims/environmental-claim-checker/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Environmental Claim Checker</summary>
Type: microsim
**sim-id:** environmental-claim-checker<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: critique

Learning objective: The learner critiques environmental claims made in news articles, advertisements, and social media by asking what was measured, how, where, over what period, and with what uncertainty, and judges whether the evidence presented supports the conclusion drawn.

Purpose: This is the transferable outcome of the entire book. Most students will not maintain a weather station for life; all of them will encounter environmental claims for the rest of it. Turning the book's measurement vocabulary into a diagnostic checklist is what makes the effort pay off beyond the project.

Canvas layout:
- Main area: a presented claim, styled as the medium it came from — a news headline with a paragraph, a product advertisement, a social media post with a chart, an official agency statement
- Right or below (responsive): the six-question checklist, each with a verdict the learner sets to answered, unanswered, or misleading
- Below: the verdict submission and feedback panel
- Bottom: case selector and score
- Responsive to window resize

The six diagnostic questions, drawn from the book:
1. **What exactly was measured?** Air temperature or surface temperature? Relative humidity or dew point? Magnitude or intensity?
2. **Where, and with what exposure?** Was the sensor shielded? What was underneath it? How high?
3. **Over what period?** Is this weather or climate? One reading, one day, or thirty years?
4. **What are the units, and is the scale honest?** Is the axis truncated? Are the units stated?
5. **What is the uncertainty?** How many digits are justified by the instrument's accuracy?
6. **Is a correlation being presented as causation?** Is a physical mechanism named?

Cases, each targeting a specific chapter's lesson:
1. "Hottest day ever recorded at this location — 47 °C" — the sensor was unshielded on a rooftop. Targets Chapter 6.
2. "City temperatures rising: a chart showing a dramatic climb" — y-axis runs from 14.2 to 14.6 °C over five years. Targets Chapter 15.
3. "Earthquake measured 6.2 on the Richter scale" — the Richter scale has not been used for large events since 1979, and the reported value is a moment magnitude. Targets Chapter 11.
4. "Barometric pressure 995 hPa — storm warning issued" — the station is at 400 m and the value is uncorrected. Targets Chapter 7.
5. "50 percent humidity, so it is only half as humid as yesterday" — relative humidity is a ratio against a temperature-dependent maximum. Targets Chapter 8.
6. "This sunscreen unnecessary today — it is cool and overcast" — UV transmission through light cloud stays high. Targets Chapter 9.
7. "Our solar panels will produce 400 kWh a year, based on measurements taken in June" — sized for the best month. Targets Chapter 16.
8. **A well-supported claim** — an agency statement with stated method, period, uncertainty, and mechanism. The learner must correctly judge this one as sound, so the exercise teaches discrimination rather than blanket scepticism.

Interaction:
- Read the claim; set a verdict on each of the six questions
- Submit an overall judgment: "well supported", "overstated", "misleading", "cannot be evaluated from what is given"
- Feedback scores both the overall judgment AND the per-question verdicts, and explains which specific question was decisive, with a link to the chapter that covers it
- A "rewrite it" mode where the learner edits the claim to make it defensible, and the checker re-evaluates
- Running score across cases, with a breakdown of which of the six questions the learner most often misses

Instructional Rationale: The objective is Evaluate/critique against explicit criteria, and the six questions are those criteria made operable. Including one sound claim is essential: a checker where every case is misleading teaches cynicism rather than judgment, and the ability to recognize good evidence is as important as spotting bad. Scoring the per-question verdicts separately from the conclusion prevents guessing and diagnoses which specific skill is weak.

Implementation: p5.js. Store each case as claim text, medium styling, per-question ground truth with explanation, overall verdict, and chapter reference. Render the social-media and news framing as styled panels to make the medium recognizable.
</details>

## Key Takeaways

- **Agricultural planning** uses accumulated temperature and **evapotranspiration** — which needs four of your seven measurements — to decide planting and irrigation.
- **Energy demand** forecasting is largely temperature-driven, and errors of a degree translate into hundreds of megawatts.
- **Weather forecasting** and **severe weather warning** rest on dense observation; every reading improves the model's starting point. **Aviation safety** depends on pressure for altimetry and on wind for runway operations.
- **Solar energy generation** is sized from insolation, using the same arithmetic as Chapter 16's power budget.
- A **building code** turns decades of wind and seismic records into law. **Tsunami warning** and **flood warning** exploit the same speed gaps and density arguments as earthquake early warning.
- **Urban heat island** effects are caused by albedo, thermal mass, reduced **evapotranspiration**, and blocked wind — and are mapped by dense volunteer networks, not official ones. **Air quality** and **wildfire risk** are governed by the wind and humidity your station measures.
- A **climate record** requires finding and correcting every instrument change, station move, and drift. That work is what makes a century of different instruments mean anything.
- **Citizen science** networks accept and use amateur data. **Data sharing** requires format, metadata, units, flags, licence, and a stable home. **Science communication** leads with the finding, shows one honest chart, and states the limitations.

## Check Yourself

??? question "A news article says a city set a record at 47 °C. What should you ask before believing it? Click to check."
    Run the six questions. **What was measured** — air temperature or a surface? **Where and with what exposure** — was it a properly shielded sensor at 1.5 m over grass, or an unshielded one on a dark rooftop? Chapter 6 showed those can differ by 20 °C or more. **What uncertainty** — is 47 stated to the whole degree with a known instrument accuracy? Official records come from stations with documented siting precisely so that this question has an answer. If the article does not say, the claim cannot be evaluated, which is itself a finding.

??? question "Your data shows the school car park is 6 °C hotter than the field. What causes this, and what could be done? Click to check."
    This is an **urban heat island** in miniature, and the causes are all measurable. Asphalt has an albedo around 0.08 versus grass at 0.25, so it absorbs far more solar radiation (Chapter 9). It has high thermal mass, storing heat and releasing it at night (Chapter 6). And it has no vegetation, so no **evapotranspiration** cooling (Chapter 8). Mitigations follow directly from the causes: lighter-coloured surfacing to raise albedo, tree planting for shade and transpiration, and permeable surfaces. Your measurement is exactly the evidence a school would need to argue for any of them.

??? question "Why can't your station's data establish that the climate is warming? Click to check."
    Because climate is defined over 30 years and your station has been running for months. A school year of readings is weather, and any trend within it is indistinguishable from ordinary variation — Chapter 1's Weather Versus Climate element demonstrated this directly. What your station *can* do is contribute to a record that becomes climate data if it is maintained, with documented changes, for decades. Every long climate record was built exactly that way, out of readings taken by people who did not know what they would be used for.

??? question "You want to share your data. What must go with the CSV file? Click to check."
    A metadata file, at minimum containing: location as latitude, longitude, and **elevation** — without which the pressure cannot be interpreted at all; the sensor model and its stated accuracy; the exposure, meaning shield type, mounting height, and surface beneath; the processing applied, including whether pressure is station or sea-level and which dew point formula was used; the calibration history with any offsets; and a licence. The CSV itself must carry units in every column name and retain quality flags rather than silently dropping flagged rows. Chapter 14's metadata example covers all of it.

---

## Where This Goes Next

That is the end of the book, but it should not be the end of the station.

The most valuable thing you can do now is the least dramatic: **leave it running.** A station that operates for one term produces a school project. A station that operates for five years produces something no model can substitute for — a record of one particular place, kept honestly, that did not exist before.

Some directions worth taking:

- **Add a sensor.** Rainfall, soil moisture, air quality, or a proper UV sensor. Each one follows the same pattern this book has taught: what is the physical property, what is the transduction mechanism, what does the datasheet say, and how is it exposed?
- **Add a second station.** Two stations answer questions one cannot — the car park versus the field, the north side versus the south, the valley floor versus the ridge.
- **Join a network.** Contribute to CoCoRaHS, Weather Underground, or a local mesonet, and your readings become part of something that forecasts real weather for real people.
- **Answer a question you care about.** Not a textbook question. Does the new tree planting actually cool the playground? Is the greenhouse holding temperature overnight? Does the creek respond to rainfall the same way in autumn as in spring?
- **Hand it on.** The most useful thing a school station can have is a successor — a student a year below you who learns to maintain it, so the record does not stop when you leave.

Chapter 1 said the difference between consuming data and understanding it is having wired a sensor, watched it drift, found a bad reading, and corrected it. You have now done all four.

The instruments in this book were built by people who wanted to know something and had no way to find out. Torricelli wanted to know why pumps failed at ten metres. Herschel wanted to know which colour carried the most heat. Beaufort wanted ships to be able to compare notes. None of them had the equipment they needed, so they made it.

You have the equipment. The questions are still open.
