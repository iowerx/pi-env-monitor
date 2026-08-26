---
title: Building the Station for the Outdoors
description: Siting and sensor exposure, weatherproof enclosures and IP ratings, the power budget with battery and solar, duty cycling, and the telemetry chain for an unattended remote station.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 22:55:00
version: 0.09
---
# Building the Station for the Outdoors

## Summary

A station indoors on a desk is a demonstration; a station outdoors and unattended is an instrument. This chapter covers siting and sensor exposure, weatherproof enclosures and their ingress protection ratings, and the power budget that determines the battery, solar panel, and charge controller, with duty cycling to stretch what is available. The second half covers telemetry: the cellular link, Wi-Fi, the base station, and what a program must do when the connection is intermittent rather than absent. It closes with seismic networks, where many stations together do what one cannot.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Remote Station
2. Weatherproof Enclosure
3. Power Budget
4. Ingress Protection Rating
5. Sensor Exposure
6. Battery Capacity
7. Duty Cycling
8. Sensor Siting
9. Telemetry
10. Seismic Network
11. Solar Panel
12. Wi-Fi Network
13. Charge Controller
14. Base Station
15. Cellular Data Link
16. Intermittent Connectivity

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)
- [Chapter 3: Electricity and the Single-Board Computer](../03-electricity-and-computer/index.md)
- [Chapter 6: Temperature: From the Thermoscope to the Silicon Chip](../06-temperature/index.md)
- [Chapter 9: Solar Radiation: The Energy That Drives the Weather](../09-solar-radiation/index.md)
- [Chapter 11: Ground Motion: Measuring Earthquakes](../11-ground-motion/index.md)
- [Chapter 12: The Station's Brain: Operating System, Command Line, and Sensor Buses](../12-os-and-sensor-buses/index.md)
- [Chapter 15: Charting and Interpreting Your Data](../15-charting-and-analysis/index.md)

---

## Nobody Is Coming to Fix It

Everything so far has assumed a bench, a wall socket, and you sitting nearby.

Now put it on a post in a field.

A **remote station** is a monitoring station that operates unattended, away from mains power and often away from any network you control.

Every assumption changes:

| On the bench | In the field |
|--------------|--------------|
| Mains power, unlimited | A battery and whatever the Sun provides |
| You notice failures immediately | Nobody notices for weeks |
| Room temperature | −10 °C at night, 45 °C inside a sunlit box |
| Dry | Rain, dew, frost, condensation, humidity |
| Reboot by unplugging | A three-hour round trip |
| Data on the desk | Data has to travel to you |
| Nothing eats it | Insects, spiders, rodents, birds, curious people |

The design goal for a remote station is not elegance. It is **not needing to be visited**. Every trip out to a station is expensive in time and, in winter or in difficult terrain, sometimes impossible. A station that requires monthly attention will be abandoned by spring.

## Siting

**Sensor siting** is the choice of where to place a station and its sensors.

Chapter 6 gave the warning: a badly sited station produces plausible-looking data that measures the wrong thing, and the fault is invisible on any day the sun is not shining. Here are the rules in full.

**Distance from obstructions.** The international convention is that a station should be at least four times the height of any nearby obstruction away from it. A 5-metre building means 20 metres of clearance. Buildings block wind, cast shade, radiate stored heat at night, and channel airflow into gusts that are not representative of anything.

**Surface beneath.** Natural short grass is the standard. Concrete and asphalt absorb heat all day and release it all night, raising your night-time temperatures by several degrees. Bare soil dries and behaves differently from vegetated ground. Chapter 9's albedo table explains why this matters so much.

**Height above ground.** Air temperature and humidity are measured at 1.25 to 2 metres, most commonly 1.5 m. Wind is measured at 10 metres by convention, which almost no school station can achieve — record whatever height you use in the metadata so readings can be adjusted later.

**Sensor exposure** is how a sensor is presented to the thing it measures. Each quantity has its own requirement, and they sometimes conflict:

| Quantity | Needs | Ruined by |
|----------|-------|-----------|
| Temperature | Shade, free airflow, standard height | Direct sun, radiating walls, still air |
| Humidity | Same as temperature | Same, plus condensation and contaminants |
| Pressure | Almost nothing — just a vented enclosure | A fully sealed box |
| Solar radiation | Unobstructed view of the whole sky, level | Any shadow, at any time of day |
| Wind | Height and distance from obstructions | Buildings, trees, the station's own mast |
| Ground motion | Firm coupling to the ground | A wobbly post, a wooden deck |
| GPS | Clear view of the sky | Dense canopy, deep valleys, metal above |

Notice the conflict. Temperature wants shade; solar radiation wants no shade at all. They cannot share a location on the mast. The solar sensor goes on top, level and clear; the temperature and humidity go in a shield below it, positioned so the shield never shades the solar sensor.

The seismic sensor conflicts too. It wants to be rigidly coupled to the ground, and a station on a pole is the worst possible mounting — the pole sways in the wind and the accelerometer faithfully records that instead of earthquakes.

!!! warning "Do not skip this and fix it later"
    You cannot correct a siting error after the fact. If your temperature sensor spent a summer in afternoon sun, that data is not recoverable — you cannot subtract the sun. Moving the station later creates a discontinuity in your record that a future analyst has to detect and correct, which Chapter 15 identified as one of the hardest problems in long-term climate records.

    Spend the extra hour choosing the location. Photograph it. Write it in the metadata.

#### Diagram: Station Siting Planner

<iframe src="../../sims/station-siting-planner/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Station Siting Planner</summary>
Type: microsim
**sim-id:** station-siting-planner<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: recommend

Learning objective: The learner recommends a station location on a realistic site plan, justifying the choice against the exposure requirements of all seven measured quantities and identifying which requirements conflict.

Purpose: Siting is the highest-consequence irreversible decision in the project, and it involves simultaneous constraints that pull in different directions. A planner where placing the station immediately scores every sensor's exposure makes the trade-offs visible before a student commits in the real world.

Canvas layout:
- Main area: a plan view of a school site containing a two-storey building, a single-storey annexe, three trees of different heights, an asphalt car park, a grass field, a fence line, and a paved path
- The learner drags a station marker anywhere on the plan
- Overlay layers, individually toggleable: shadow footprints at 09:00, 12:00, and 15:00 for summer and winter; the four-times-height clearance circles around each obstruction; surface type shading; GPS sky-view obstruction
- Right or below (responsive): a per-sensor scorecard
- Bottom: controls and a mast-configuration panel
- Responsive to window resize; plan preserves aspect ratio

Data Visibility Requirements:
  Stage 1: Show the station's distance to each obstruction and the required clearance for each, e.g. "Main building 8 m tall, requires 32 m, you are at 14 m — FAIL"
  Stage 2: Show the surface directly beneath and its albedo from Chapter 9
  Stage 3: Show hours of shadow per day in summer and in winter, computed from the toggled shadow layers
  Stage 4: Show a scorecard row per sensor — temperature, humidity, pressure, solar, wind, seismic, GPS — each rated good, marginal, or poor with a one-line reason
  Stage 5: Show an overall verdict and the single worst problem

Required conflict demonstration: a mast-configuration panel where the learner positions the radiation shield and the solar sensor on the mast. Placing the shield above the solar sensor must trigger "The shield is casting a shadow on the solar sensor between 11:00 and 13:00 in summer" with the affected hours computed. This makes the temperature-versus-solar conflict from the chapter text a discovered constraint rather than a stated one.

Required seismic constraint: mounting the accelerometer on the mast rather than on a ground stake or slab must score poor with the reason "The mast sways in wind. This sensor will record the mast, not the ground." Providing a separate ground-mount option that scores well teaches the resolution.

Candidate locations the plan should make tempting and then penalise:
- **Beside the building** — convenient for power and Wi-Fi, fails clearance and gets radiated night heat
- **On the car park** — open sky and good for solar and GPS, but asphalt beneath ruins temperature
- **Under the large tree** — shaded and cool, but ruins solar radiation and blocks GPS
- **Middle of the grass field** — best exposure, worst for power and network access, which sets up the rest of the chapter

Interactive controls:
- Drag the station; all scores update live
- Season and time-of-day sliders driving the shadow layers
- Layer toggles
- Mast configuration: height of shield, height of solar sensor, seismic mounting choice, anemometer height
- "Explain this score" on any scorecard row, opening the reasoning with a chapter cross-reference

Instructional Rationale: The objective is Evaluate/recommend, which requires weighing incompatible criteria and defending a choice. Scoring all seven sensors simultaneously from one placement is the design decision that makes the conflict unavoidable — a learner cannot optimise one without watching another degrade. The tempting-but-flawed candidate locations exist because students reliably choose convenience over exposure, and the planner should let them make that choice and see the cost.

Implementation: p5.js. Compute shadows geometrically from obstruction heights and solar elevation for the selected date and latitude. Score each sensor from documented rules so "explain this score" can cite the specific rule applied.
</details>

## The Enclosure

A **weatherproof enclosure** is a sealed box that protects the electronics from rain, dust, insects, and sunlight.

An **ingress protection rating**, written IP followed by two digits, is a standardized measure of how well an enclosure keeps things out. The first digit rates solids, the second rates liquids.

| Rating | Solids | Liquids | Suitable for |
|--------|--------|---------|--------------|
| IP20 | Fingers | None | Indoors only |
| IP54 | Dust-protected | Splashing water | Sheltered outdoor |
| IP65 | Dust-tight | Water jets | General outdoor use |
| IP66 | Dust-tight | Powerful water jets | Exposed outdoor |
| IP67 | Dust-tight | Temporary immersion | Flood-prone locations |

IP65 is the sensible target for a station enclosure. Higher ratings cost more and, past a point, work against you — which is the counter-intuitive part of this section.

!!! warning "A perfectly sealed box will destroy your station"
    This surprises everyone, and it is the most common enclosure mistake.

    Seal a box completely and it still breathes. Air inside warms during the day and expands; at night it cools and contracts, drawing outside air in through any imperfection. That incoming air carries moisture. The moisture condenses on the coolest surface inside — usually the circuit board — and cannot escape.

    Do this for a few months and you get corrosion, short circuits, and a humidity sensor permanently reading 100 percent. The box was watertight and the electronics drowned anyway.

    Three fixes, used together:

    1. **A vent**, specifically a Gore-Tex or similar membrane vent, which passes water vapor and air pressure but blocks liquid water. It also lets the pressure sensor read correctly, which a sealed box prevents entirely.
    2. **Silica gel desiccant** inside, replaced periodically.
    3. **Mount cable glands and vents on the bottom face**, so gravity works with you rather than against you.

Other enclosure requirements:

- **White or light coloured.** Chapter 9's albedo applies to your box. A black enclosure in summer sun can exceed 60 °C inside, which is past the BME280's 85 °C limit sooner than you would think and shortens battery life considerably.
- **UV-resistant plastic.** Ordinary plastics become brittle and crack after a year or two of sunlight.
- **Cable glands, not holes.** Every wire entering needs a proper compression gland. A drilled hole with a wire through it is a drain.
- **A drip loop.** Cables should hang below their entry point so water runs off the low point rather than following the cable inside.
- **Insect exclusion.** Fine mesh over every vent. Wasps and spiders find enclosures extremely attractive, and Chapter 15 listed insect nests as a genuine cause of sensor faults.

The sensors themselves stay outside the box, in the radiation shield, with only their wires passing through a gland.

## The Power Budget

A **power budget** is an accounting of how much energy a system consumes against how much it can collect or store.

This is the calculation that determines whether your station survives the winter, and it is arithmetic rather than guesswork.

### Step 1: Measure Consumption

Every component draws current. Current times voltage is power, and power times time is energy.

Typical figures for this project:

| Component | Current | Notes |
|-----------|---------|-------|
| Pi Zero 2 W, idle | 100 mA | Doing nothing, Wi-Fi off |
| Pi Zero 2 W, active | 200–350 mA | Reading sensors, writing files |
| Wi-Fi active | +50–100 mA | Only while transmitting |
| SIM7600A, idle | 10–20 mA | Registered on the network |
| SIM7600A, transmitting | 200–500 mA | Brief bursts, but large |
| BME280 | 0.004 mA | Effectively nothing |
| GPS receiver | 25–40 mA | Continuous while acquiring |

The BME280 row is worth noticing. The sensor consumes essentially nothing. **Your power problem is the computer and the radio, not the sensors.**

Energy is measured in milliamp-hours (mAh). A device drawing 150 mA for 24 hours uses:

\[ 150\ \text{mA} \times 24\ \text{h} = 3600\ \text{mAh per day} \]

### Step 2: Size the Battery

**Battery capacity** is how much charge a battery can store, in milliamp-hours or amp-hours.

Two adjustments turn a raw capacity into usable capacity, and both are commonly forgotten:

- **Depth of discharge.** Lithium batteries should not be run below about 20 percent, and lead-acid below about 50 percent, or their lifetime collapses. Plan to use 80 percent of a lithium battery's rating.
- **Cold weather.** Capacity falls with temperature — commonly 20 to 30 percent at 0 °C. Winter is when solar input is lowest and battery capacity is worst at the same time.

The autonomy calculation asks how long the station runs with no solar input at all:

\[ \text{days of autonomy} = \frac{\text{usable capacity (mAh)}}{\text{daily consumption (mAh)}} \]

A 20,000 mAh battery at 80 percent usable is 16,000 mAh. Against 3,600 mAh per day, that is **4.4 days** — and less in the cold. Aim for at least three days of autonomy, and five if your winters are overcast.

### Step 3: Size the Solar Panel

A **solar panel** converts sunlight into electricity by the photovoltaic effect from Chapter 9.

Panels are rated in watts under standard test conditions of 1000 W/m². Real output is far lower, and this is where Chapter 15's insolation figure earns its place.

Daily energy from a panel:

\[ E_{\text{daily}} = P_{\text{rated}} \times \text{insolation (kWh/m²/day)} \times \eta \]

where \(\eta\) accounts for panel angle, dirt, temperature losses, and charge controller efficiency. Use 0.7 as a working figure.

Worked example. A 10 W panel, in December, at a mid-latitude site with 1.5 kWh/m²/day of insolation:

\[ 10\ \text{W} \times 1.5 \times 0.7 = 10.5\ \text{Wh per day} \]

At 5 V that is 2,100 mAh per day — against a consumption of 3,600 mAh per day. **The station runs down.** In December it would drain the battery in a few days and stay dead until spring.

!!! danger "Size for December, not for July"
    This is the mistake that kills student stations, and it is not obvious because everything works beautifully during the term when you build it.

    A panel sized for summer insolation of 6 kWh/m²/day collects four times as much as the same panel in December. A station built and tested in May will fail in November, and by then everyone has moved on.

    Design against your **worst month**, and confirm the numbers with real insolation data for your location. Then add margin, because the worst month has bad weeks in it.

### Step 4: Charge Safely

A **charge controller** sits between the solar panel and the battery, regulating charging to prevent damage.

It is not optional. A panel connected directly to a battery will overcharge it, which for lithium chemistry is a fire risk and for lead-acid destroys the battery.

A controller handles:

- **Overcharge protection** — stopping when the battery is full
- **Over-discharge protection** — disconnecting the load before the battery is damaged
- **Reverse current blocking** — preventing the battery discharging back through the panel at night
- **Charging profile** — the correct voltage and current curve for the chemistry

MPPT controllers extract 10 to 30 percent more energy than simpler PWM ones by continuously finding the panel's optimal operating point. On a marginal power budget, that difference can be what makes the station survive.

### Step 5: Use Less

**Duty cycling** is switching a device off, or into a low-power mode, between the times it is actually needed.

This is by far the most effective tool available, because your station spends almost all of its time waiting.

A station reading once a minute spends perhaps two seconds working and 58 seconds idle. If the Pi could sleep through those 58 seconds, consumption would fall by roughly 95 percent.

The techniques, roughly in order of how much they save:

| Technique | Saving | Cost |
|-----------|--------|------|
| Turn off Wi-Fi except when transmitting | 50–100 mA | Delayed data delivery |
| Batch transmissions — send once an hour, not every minute | Large | Data arrives up to an hour late |
| Disable HDMI output | 20–30 mA | None; nothing is plugged in |
| Disable onboard LEDs | 5–10 mA | Harder to tell it is alive |
| Sleep the SIM7600A between transmissions | 10–20 mA idle | Reconnection time |
| External timer that powers the Pi down entirely | Very large | Complexity; boot time each cycle |

Turning off HDMI and the LEDs takes two configuration lines and saves 25 to 40 mA continuously — roughly 700 mAh per day, which is 20 percent of the example budget for no functional loss at all.

Batching transmissions is the biggest software-only win. Writing every reading to the SD card locally and uploading once an hour means the radio, the most power-hungry component, is on for a few seconds an hour instead of continuously.

#### Diagram: Power Budget Calculator

<iframe src="../../sims/power-budget-calculator/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Power Budget Calculator</summary>
Type: microsim
**sim-id:** power-budget-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Evaluate (L5)
Bloom Verb: judge

Learning objective: The learner judges whether a proposed combination of panel, battery, and duty cycle will keep a station running through the worst month of the year, and justifies the design against a simulated year of real insolation and temperature.

Purpose: This is the Evaluate-level outcome the course description names explicitly. The failure mode it targets is specific and common: a station sized in spring that dies in November. Simulating a full year, month by month, with the battery state carried forward, is the only way to make that failure visible before it happens.

Canvas layout:
- Left: component selection and duty-cycle configuration
- Center: a year-long battery state-of-charge chart, with months on the x-axis and percentage on the y-axis, and a red shaded band below the safe discharge floor
- Right or below (responsive): the monthly energy balance table — collected, consumed, net — and a verdict panel
- Bottom: location and scenario controls
- Responsive to window resize

Data Visibility Requirements:
  Stage 1: Show the itemised daily consumption, component by component, in mA and mAh, summing to a daily total
  Stage 2: Show the monthly insolation figure used and where it came from
  Stage 3: Show monthly energy collected via the panel formula, with the 0.7 loss factor shown as a separate visible step
  Stage 4: Show the monthly net balance and the battery state of charge carried forward from the previous month
  Stage 5: Show days of autonomy at the current consumption, adjusted for the month's temperature
  Stage 6: Show a clear pass or fail verdict naming the month it fails, if it does

Configurable components:
- Panel rating: 5, 10, 20, 50 W
- Battery: 5,000 / 10,000 / 20,000 / 50,000 mAh, with chemistry selection (lithium at 80 percent usable, lead-acid at 50 percent)
- Charge controller: PWM or MPPT, applying different efficiency factors
- Radio: Wi-Fi or cellular, with idle and transmit currents
- Duty-cycle checkboxes matching the chapter table, each showing its individual saving and updating the total live

Location and scenario controls:
- Latitude, driving the seasonal insolation curve
- Preset locations with realistic monthly insolation: a coastal mid-latitude site, a high-latitude site, a desert site, and a persistently cloudy site
- "Bad week" stress test that inserts seven consecutive days of heavy overcast into the worst month and shows whether the battery survives it

Required teaching moments:
- A default configuration that **passes in summer and fails in December**, with the verdict panel stating: "This design works from March to October and fails in December. A station built and tested in spring will die in autumn."
- Enabling all duty-cycle options must visibly move a failing design into passing, quantifying how much of the fix came from software rather than hardware
- A cold-weather toggle showing battery capacity dropping 25 percent at 0 °C, with the caption "Winter takes your solar input and your battery capacity at the same time."

Instructional Rationale: The objective is Evaluate/judge against a criterion, and the criterion here is survival through the worst case rather than average performance. Simulating a full year with state carried forward is what distinguishes this from a spreadsheet — the learner sees the battery draw down progressively across autumn rather than seeing a single monthly average. Making the duty-cycle savings itemised and live teaches that the cheapest fix is usually software.

Implementation: p5.js. Model state of charge day by day: SOC += collected − consumed, clamped to capacity and floor. Use published monthly insolation values for each preset location. Apply temperature derating to usable capacity per month.
</details>

## Getting the Data Home

**Telemetry** is the automatic transmission of measurements from a remote location to somewhere they can be collected.

Without it, a remote station is a data recorder that somebody has to visit. With it, you find out about a failure in hours rather than months.

Three options, in increasing order of independence:

A **Wi-Fi network** is the simplest when the station is within range of one. It is free to run, fast, and needs no additional hardware since the Pi Zero 2 W has Wi-Fi built in. The limits are range — typically under 100 metres outdoors — and that it ties your station's siting to a building, which Chapter 6's siting rules argue against.

A **cellular data link** uses the mobile phone network, through the SIM7600A module in this project's parts list. It works anywhere with coverage, which is most places, and frees the station's location entirely. The costs are a data plan, higher power consumption, and the complexity of AT commands over the serial UART from Chapter 12.

A **base station** is a computer at a fixed, convenient location that collects data from one or more remote stations. [Components Used](../../components.md) specifies a Raspberry Pi 2B running Raspberry Pi OS for this role. A base station has mains power, a reliable network, and no weather exposure, so it can do the work the remote station cannot afford: storing the full archive, running charts and dashboards, alerting you when a station goes quiet, and serving as one of the 3-2-1 backup copies from Chapter 14.

| | Wi-Fi | Cellular | Store and collect later |
|---|---|---|---|
| Range | Under 100 m | Anywhere with coverage | Unlimited |
| Extra hardware | None | SIM7600A + SIM | None |
| Ongoing cost | None | Data plan | None |
| Power | Moderate | Higher | Lowest |
| Data delay | Seconds | Seconds to an hour | Until you visit |
| Failure notice | Immediate | Immediate | On your next visit |

## When the Link Is Not There

**Intermittent connectivity** is a connection that works sometimes and fails at other times, unpredictably.

This is the normal condition for a remote station, and it is harder to write software for than a connection that is simply absent. Rain attenuates cellular signals. Networks go down. Power to the local tower fails. A truck parks in the wrong place.

The design principle is simple to state and easy to get wrong:

!!! danger "Never make transmission a precondition for recording"
    The failure looks like this. Your program reads the sensors, tries to upload, the upload fails, an exception is raised, and the reading is lost. You lose data for exactly as long as the network is down — and network outages correlate with storms, which is when the data matters most.

    Always write to local storage **first**. Transmit as a separate, later, optional step. If transmission fails, the reading is still safely on the SD card and can be sent later.

The pattern is called store and forward. Before the code: `write_reading` is the Chapter 14 function that appends to the local CSV. `pending` is a list of rows not yet acknowledged by the server. The upload is attempted inside its own `try`, and a failure only leaves rows in `pending` — it never affects the local record.

```python
pending = []

def log_and_queue(row):
    """Record locally first, then queue for transmission."""
    write_reading(row)        # local CSV — never skipped
    pending.append(row)

def try_upload():
    """Attempt to send queued rows. Failure is not fatal."""
    global pending
    if not pending:
        return
    try:
        send_to_server(pending)
        log_event(f"Uploaded {len(pending)} rows")
        pending = []
    except Exception as e:
        log_event(f"Upload failed, {len(pending)} rows queued: {e}")
```

Four refinements make this robust in the field:

- **Persist the queue.** If `pending` lives only in memory, a reboot loses it. Track the last acknowledged timestamp in a small file instead, and re-send from there.
- **Back off on repeated failures.** Retrying every minute against a dead network wastes power on the radio, which Chapter 15's power budget cannot spare. Double the interval after each failure, up to an hour.
- **Batch.** Sending 60 rows once an hour uses far less radio time than one row 60 times.
- **Send a heartbeat.** A short message even when there is nothing new lets the base station distinguish "the station is fine and quiet" from "the station is dead."

## Many Stations Together

One station tells you about one place. A network tells you about a region, and it can do things no single station can.

A **seismic network** is a set of seismic stations whose combined data locates earthquakes and characterizes ground motion across an area.

Chapter 11 explained why this matters. One seismometer can estimate its distance from an earthquake by timing the gap between the P and S waves, but distance alone puts the epicenter anywhere on a circle. Three stations trilaterate to a point — the same technique GPS uses in Chapter 5.

Networks also do something a single station fundamentally cannot: **reject false alarms**. A truck passing your station produces a signal that looks somewhat like an earthquake. But a truck shakes one station and an earthquake shakes many, in a pattern that spreads outward at a known speed. Requiring agreement across several stations is what makes an earthquake early warning system trustworthy enough to stop trains.

This is the argument for cheap dense sensors from Chapter 11 stated as a design principle. A single MEMS accelerometer is a poor instrument. Ten thousand of them, spread across a city and cross-checked against one another, detect and locate earthquakes that a handful of excellent instruments would miss the details of.

The same logic applies to weather. Your station is one point. Contributing it to a network — CoCoRaHS, Weather Underground, or a local mesonet — makes it part of something that resolves the microclimates a sparse official network cannot see. Chapter 17 covers how.

## Key Takeaways

- A **remote station** must not need visiting. Every field assumption differs from bench assumptions.
- **Sensor siting** follows the four-times-height clearance rule, natural surface beneath, and standard heights. **Sensor exposure** requirements conflict between sensors — shade for temperature, clear sky for solar, ground coupling for seismic.
- A **weatherproof enclosure** at **IP65** is the target, but must be **vented** — a fully sealed box condenses moisture inside and destroys the electronics.
- A **power budget** accounts consumption against collection. The computer and radio dominate; the sensors are negligible.
- **Battery capacity** must be derated for depth of discharge and for cold. A **solar panel** must be sized against the **worst month's** insolation, not summer. A **charge controller** is mandatory.
- **Duty cycling** is the most effective lever. Disabling HDMI and LEDs and batching transmissions can halve consumption with no functional loss.
- **Telemetry** by **Wi-Fi** or **cellular data link** to a **base station** turns a recorder into a monitored instrument.
- **Intermittent connectivity** is normal. Write locally first, always; transmit as an optional later step with back-off and batching.
- A **seismic network** locates events by trilateration and rejects false alarms by requiring agreement — the argument for density over individual precision.

## Check Yourself

??? question "Your station uses 3,600 mAh/day. Your 10 W panel produces 2,100 mAh/day in December. What are your options? Click to check."
    The station runs a 1,500 mAh/day deficit in December and will drain its battery in days. Three families of fix, cheapest first: **reduce consumption** through duty cycling — disabling HDMI and LEDs and batching transmissions could cut 1,000 to 1,800 mAh/day for free; **increase collection** with a larger panel — a 20 W panel would give 4,200 mAh/day in December; or **increase storage** so the battery carries you through the worst weeks, which only works if the monthly average is positive. Note that a bigger battery alone does not fix a negative monthly balance.

??? question "Your enclosure is rated IP68 — fully waterproof. Why might your board still corrode? Click to check."
    Because a sealed box still breathes. Air inside expands when heated by day and contracts at night, drawing in outside air through any imperfection. That air carries moisture, which condenses on the coolest interior surface — usually the circuit board — and has no way out. Over months this causes corrosion and shorts. The fix is a Gore-Tex membrane vent that passes vapor and pressure but blocks liquid, plus desiccant. The vent is also required for the pressure sensor to read the actual atmosphere at all.

??? question "Your upload code raises an exception when the network is down, and you lose that reading. What is the design error? Click to check."
    Transmission has been made a precondition for recording. The fix is store-and-forward: write the reading to local storage **first**, unconditionally, then attempt transmission as a separate, optional step inside its own error handler. A failed upload should leave the row queued and the local file complete. This matters most during storms, when networks fail and the data is most valuable.

??? question "Why does an earthquake early warning system need many stations, not one very good one? Click to check."
    Two reasons. **Location** — one station can estimate its distance from the P–S gap, but that places the epicenter anywhere on a circle; three stations trilaterate to a point. **False alarm rejection** — a truck, a slammed door, or a construction site shakes one station in a way that resembles an earthquake. A real earthquake shakes many stations in a pattern that propagates outward at a known speed. Requiring agreement across stations is what makes the system trustworthy enough to automatically stop trains.

---

## What Is Next

Your station is built, sited, powered, and reporting. It has been running for months and you have a growing record of your own air.

Chapter 17 answers the question the whole book has been building toward: so what? It traces each of the seven measurements into the decisions it drives in the world — weather forecasting and severe weather warnings, agricultural planning, energy demand and solar generation, aviation safety, the building codes written from seismic and wind data, urban heat islands, air quality, wildfire risk, and flood and tsunami warning. It closes with what you can do with your own data: contribute it to citizen science networks, share it so others can use it, and communicate what you found to people who were not there.
