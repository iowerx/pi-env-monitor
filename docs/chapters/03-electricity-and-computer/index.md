---
title: Electricity and the Single-Board Computer
description: The Raspberry Pi and the electrical basics needed to wire a sensor safely - voltage, current, ground, GPIO pins, jumper wires, breadboards, pull-up resistors, and static discipline.
generated_by: claude skill chapter-content-generator
date: 2026-08-25 21:47:51
version: 0.09
---
# Electricity and the Single-Board Computer

## Summary

Before a sensor can be attached to anything, the thing it attaches to has to exist. This chapter introduces the single-board computer and the Raspberry Pi family, then the electrical basics needed to wire one safely: voltage, current, and ground. It covers GPIO pins and headers, jumper wires and breadboards, the pull-up resistor, and the static discipline that keeps a student from destroying a board by touching it. This is the hands-on chapter where the hardware first gets unpacked.

## Concepts Covered

This chapter covers the following 12 concepts from the learning graph:

1. Single Board Computer
2. Raspberry Pi
3. Voltage
4. Raspberry Pi Zero 2 W
5. GPIO Pin
6. Current
7. Ground Connection
8. Electrostatic Discharge
9. Pin Header
10. Pull Up Resistor
11. Jumper Wire
12. Breadboard

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Why We Measure the Natural Environment](../01-why-we-measure/index.md)

---

## A Whole Computer, Smaller Than a Credit Card

Open the box. Inside is a green circuit board about the size of a stick of gum.

That is a computer. Not a part of a computer — a whole one. It has a processor, memory, storage, wireless networking, and the ability to run the same kind of operating system that runs most of the world's web servers. It costs about as much as a pizza.

A **single-board computer** is a complete computer built on one circuit board. Everything is soldered down: processor, memory, and connectors, all on one piece of fiberglass. There is no case, no keyboard, no screen, and nothing you can upgrade. That sounds like a list of disadvantages, and for a desktop machine it would be. For a device that has to sit outside in a box for a year and take readings, it is exactly right.

Desktop computers are built to be flexible. Single-board computers are built to be small, cheap, low-power, and able to talk directly to electronic parts. That last one is the important difference. Your laptop cannot connect to a temperature sensor without an adapter. This board can, because it has pins.

The **Raspberry Pi** is the best-known family of single-board computers. It came from an unusual place: a group at the University of Cambridge noticed in 2006 that students applying to study computer science had less hands-on experience than applicants a decade earlier. Home computers had become appliances that you used rather than machines you tinkered with. The Raspberry Pi Foundation set out to build something cheap enough that a school could buy a classroom set and nobody would panic if a student broke one.

The first board shipped in 2012. Both launch-day suppliers' websites went down within minutes. More than 60 million Raspberry Pi boards have shipped since.

This book uses the **Raspberry Pi Zero 2 W**, one of the smallest members of the family. Here is why it fits this project:

- It is about 65 mm by 30 mm, so it fits in a small weatherproof box
- It has built-in Wi-Fi and Bluetooth, so no separate network card is needed
- It draws very little power, which matters enormously when a solar panel is the only power source
- It has the same 40-pin connector as its larger siblings, so sensors that work on one work on all
- It costs little enough that a mistake is a lesson rather than a disaster

The last point is not a joke. You are going to be connecting wires to a live circuit board. Doing that on a machine you cannot afford to replace makes people timid, and timid is a bad way to learn hardware.

## Voltage, Current, and Ground

Three electrical ideas are enough to wire everything in this book safely. You do not need circuit theory. You need these three, correctly understood.

The standard analogy is water in pipes. It is not perfect, but it is good enough to keep you from breaking things.

**Voltage** is electrical pressure — the push that makes charge move. In the water analogy, voltage is water pressure. High pressure pushes water hard. High voltage pushes charge hard. Voltage is measured in volts, symbol V, and it is always measured *between two points*. Asking "what is the voltage here?" is like asking "what is the difference here?" — the question is incomplete until you say what you are comparing against.

**Current** is the rate of flow — how much charge moves past a point each second. In the analogy, current is how much water flows through the pipe per second. Current is measured in amperes, symbol A, and in this project usually in milliamperes (mA), thousandths of an amp.

The relationship that matters for your safety and the board's:

- Voltage is applied *to* a device. You choose it, and getting it wrong destroys things.
- Current is *drawn by* a device. The device decides how much it needs, and your job is to make sure the supply can provide it.

That asymmetry catches beginners. Plugging a 3.3-volt sensor into a 5-volt pin will likely destroy the sensor, because you forced the wrong pressure on it. But connecting a sensor that draws 2 mA to a supply capable of 500 mA is completely fine — the sensor takes what it needs and ignores the rest.

**Ground** is the reference point that all voltages are measured against, defined as zero volts. In the water analogy, ground is the drain that everything eventually returns to.

Every circuit needs a complete loop. Charge leaves the power pin, passes through the sensor, and returns through the ground pin. Break that loop anywhere and nothing works.

This produces the single most common beginner mistake in this whole book, so it gets its own box.

!!! warning "The most common wiring mistake"
    Forgetting the ground wire. A sensor with power connected but no ground connection will do one of three things: nothing at all, something erratic, or — most confusing — appear to work briefly and then fail. Students spend hours debugging code when the actual problem is a missing black wire. **Every time a sensor misbehaves, check ground first.**

Here is the vocabulary in one place:

| Term | Symbol | Unit | Water analogy | What it does in your station |
|------|--------|------|---------------|------------------------------|
| Voltage | V | volt (V) | Water pressure | 3.3 V powers the sensor |
| Current | I | ampere (A) | Flow rate per second | The BME280 draws under 1 mA |
| Ground | GND | 0 V by definition | The drain | Completes every circuit |

Before the next element, one term. A **circuit** is a complete loop that charge can travel around, from the power source, through a device, and back to ground.

#### Diagram: Circuit Loop and the Missing Ground

<iframe src="../../sims/circuit-loop-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Circuit Loop and the Missing Ground</summary>
Type: microsim
**sim-id:** circuit-loop-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Understand (L2)
Bloom Verb: explain

Learning objective: The learner explains why a circuit must form a complete loop, and predicts what a sensor does when its ground wire is disconnected while power remains connected.

Purpose: The missing-ground fault is the single most common wiring error in this book, and it is invisible on a real bench — the wires look connected and the sensor simply misbehaves. Letting the learner disconnect ground deliberately and watch the loop break makes the fault recognizable before they meet it for real.

Canvas layout:
- Center: a simplified schematic showing a 3.3 V pin, a sensor block, and a ground pin, joined by two wires drawn in red and black
- Right or below (responsive): readout panel showing voltage across the sensor, current through the loop, and a plain-language sensor status
- Bottom: three toggle switches, one per wire connection, plus a voltage-source selector
- Responsive to window resize; schematic scales with canvas dimensions

Data Visibility Requirements:
  Stage 1: Show the complete loop with both wires connected. Readout: "Voltage across sensor: 3.3 V. Current: 0.9 mA. Status: reading normally."
  Stage 2: When the learner opens the ground switch, redraw the loop with a visible gap and grey out the wire beyond the break. Readout: "Voltage across sensor: undefined. Current: 0 mA. Status: no complete loop — sensor is unpowered even though the red wire is still connected."
  Stage 3: When the learner opens the power switch instead, show the equivalent break on the other side, so it is clear that either break stops the circuit.
  Stage 4: A "partial contact" setting simulates a loose wire, showing intermittent current and a status of "erratic — this is what a loose ground looks like."

Interactive controls:
- Toggle: power wire connected / disconnected
- Toggle: ground wire connected / disconnected
- Toggle: ground wire firm / loose
- Selector: supply voltage 3.3 V or 5 V. Selecting 5 V while the sensor is a 3.3 V part turns the sensor block red and shows: "OVERVOLTAGE. A 3.3 V part on a 5 V supply is how sensors die. Nothing in this book connects 5 V to a sensor or a GPIO pin."

Visual elements:
- Charge represented as evenly spaced dots moving slowly around the loop when current flows, and completely stationary when it does not. Movement is a state indicator, not decoration — it stops the instant the loop opens.
- The break point drawn as a visible gap with a small spark-free "open" symbol
- Sensor block changes color by state: normal, unpowered, erratic, destroyed

Default parameters:
- Both wires connected and firm
- Supply: 3.3 V

Instructional Rationale: The objective is Understand/explain, so the specification centers on visible state and concrete readouts rather than on animation for its own sake. The dot motion is included only because "current stops" needs a visual correlate; it carries information rather than decorating. The overvoltage case is included because the consequence is destructive and irreversible, and a safe place to see it happen is worth more than a warning box.

Implementation: p5.js. Model the circuit as a boolean loop-complete state plus a supply voltage; derive all readouts from those two values rather than simulating real circuit physics.
</details>

## The GPIO Pins

Along one edge of the Raspberry Pi is a double row of 40 metal pins. This is the **pin header** — the physical connector that jumper wires plug onto. On the Pi Zero 2 W the header may need to be soldered on, or you may have bought a version with it pre-attached.

Most of those pins are **GPIO pins**, short for General Purpose Input/Output. A GPIO pin is a connection whose behavior your software controls. Under program control, each one can either read a voltage that something else applies (input) or apply a voltage itself (output).

That flexibility is what makes a single-board computer different from a laptop. Your program can decide, line by line, whether a given pin listens or talks.

Not every pin on the header is a GPIO pin. The 40 pins break down into four groups:

- **Power pins** — supply 3.3 V or 5 V to whatever you connect
- **Ground pins** — the 0 V return path; there are several, and any of them works
- **GPIO pins** — software-controlled input or output
- **Special-function pins** — GPIO pins that also have a dedicated job, such as carrying the I2C bus covered in Chapter 12

Before the pinout explorer below, one critical fact that determines whether your board survives this project.

!!! danger "3.3 volts, never 5"
    The Raspberry Pi's GPIO pins run at **3.3 volts**. They are **not** 5-volt tolerant. Applying 5 V to a GPIO pin can permanently destroy the pin, and sometimes the whole processor. There is no fuse and no warning.

    The header does provide 5 V power pins, because some devices need 5 V to run. That is fine. What is never fine is letting 5 V reach a *GPIO* pin. When you buy a sensor, check that it is a 3.3 V part or has a built-in level shifter. The BME280 breakout boards used in this book are safe on 3.3 V.

#### Diagram: Raspberry Pi GPIO Pinout Explorer

<iframe src="../../sims/gpio-pinout-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Raspberry Pi GPIO Pinout Explorer</summary>
Type: infographic
**sim-id:** gpio-pinout-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Remember (L1)
Bloom Verb: locate

Learning objective: The learner locates a specific pin on the 40-pin header by number and function, and identifies which pins are safe to connect a 3.3 V sensor to.

Purpose: Printed pinout diagrams are dense and error-prone to read, and a misread pin number can destroy a board. An interactive pinout that answers "which pin is this, and what happens if I connect here" removes the most dangerous ambiguity in the whole build.

Layout: A to-scale drawing of the 40-pin header as two rows of 20, with pin 1 clearly marked in the corner, matching the physical orientation of a Raspberry Pi Zero 2 W with the GPIO header along the top edge. An outline of the board is drawn around it for orientation. All positions computed as fractions of canvas dimensions; must respond correctly to window resize.

Pin colour coding (with a legend):
- Red: 5 V power
- Orange: 3.3 V power
- Black: Ground
- Green: general-purpose GPIO
- Blue: GPIO with a special function (I2C, SPI, UART)

Clickable behaviour — every one of the 40 pins is clickable, opening an infobox containing:
- The physical pin number (1 to 40)
- The BCM GPIO number where applicable
- The function, e.g. "GPIO 2 / I2C SDA"
- A safety line, e.g. "Safe for 3.3 V sensors" or "5 V — never connect to a GPIO pin"
- Where it is used in this book, e.g. "Pin 3 carries I2C data to the BME280 in Chapter 12"

Required infobox content for the pins this book uses:
- Pin 1 (3.3 V): "Powers the BME280. This is the pin your red wire goes to."
- Pin 3 (GPIO 2, I2C SDA): "I2C data line. Chapter 12."
- Pin 5 (GPIO 3, I2C SCL): "I2C clock line. Chapter 12."
- Pin 6 (Ground): "One of eight ground pins. Your black wire goes here."
- Pin 2 and Pin 4 (5 V): "5 volts. Useful for powering some peripherals. NEVER connect to a GPIO pin."

Interactive features:
- Hover: pin highlights and shows its number and function in a small tooltip
- Click: full infobox opens in the side panel
- Filter buttons: "Show only power", "Show only ground", "Show only I2C", "Show all" — non-matching pins dim rather than disappear so position is preserved
- A "Wire the BME280" guided mode that highlights the four pins used in this book one at a time, in the order they should be connected, with the wire colour convention stated for each

Instructional Rationale: The objective is Remember/locate, which is best served by a searchable, filterable reference the learner returns to rather than by an animation. The guided wiring mode exists because the highest-risk moment in this book is a student connecting the first wire, and a static diagram gives them no confirmation that they have found the right pin.

Implementation: p5.js. Store the pinout as an array of 40 objects with number, bcm, function, colour category, safety text, and chapter reference. Compute pin positions from canvas size in draw().
</details>

## Wires and Breadboards

A **jumper wire** is a short wire with a connector on each end, made for temporary connections. Three kinds exist, named for what is on the ends:

- **Female-to-female** — a socket on both ends. These connect the Pi's header pins directly to a sensor's header pins, and are what this book uses most.
- **Male-to-female** — a pin on one end, a socket on the other. Used to get from a breadboard to the Pi.
- **Male-to-male** — pins on both ends. Used between two points on a breadboard.

Jumper wires come in colors, and the colors mean nothing electrically. A red wire and a green wire carry current identically. But there is a convention worth following anyway:

- **Red** for power
- **Black** for ground
- **Any other color** for signals

This is not fussiness. When a station has been in a box for six months and something stops working, the person opening the box — possibly you, having forgotten everything — needs to see at a glance where power and ground go. Following the convention costs nothing now and saves an hour later.

A **breadboard** is a plastic block full of spring-loaded holes that lets you build a circuit without soldering. Push a wire into a hole and it grips, making an electrical connection.

The connections inside a breadboard follow a fixed pattern, and this pattern is the one thing about breadboards that must be understood:

- The two long strips along each edge are the **power rails**, usually marked with a red line and a blue line. Every hole along a rail is connected to every other hole in that same rail, running the length of the board.
- The main area is divided into short rows of five holes. All five holes in a row are connected to each other.
- The channel running down the middle separates the left half from the right half. Rows do **not** connect across the channel.

That center channel exists for a reason. Integrated circuit chips are made to straddle it, which puts each of the chip's legs in its own five-hole row, so each leg can be wired independently.

#### Diagram: Breadboard Connection Explorer

<iframe src="../../sims/breadboard-connection-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Breadboard Connection Explorer</summary>
Type: microsim
**sim-id:** breadboard-connection-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy Level: Understand (L2)
Bloom Verb: explain

Learning objective: The learner explains which holes on a breadboard are electrically connected to one another, and predicts whether two components placed in given holes will form a working circuit.

Purpose: Breadboard internal connections are invisible, and every beginner wastes time on a circuit that is wired correctly in their head but not on the board. Revealing the hidden copper strips converts a mysterious plastic block into an understandable object.

Canvas layout:
- Center: a top-down view of a half-size breadboard with correctly numbered rows and lettered columns, power rails along both long edges, and the center channel clearly drawn
- Right or below (responsive): an infobox describing the currently selected hole
- Bottom: mode buttons and a "Reveal internal strips" toggle
- Must respond to window resize; the breadboard scales to fit while preserving aspect ratio

Data Visibility Requirements:
  Stage 1: Show the breadboard as it physically appears — a grid of identical holes with no visible connections
  Stage 2: When a hole is clicked, highlight in a bright color EVERY other hole electrically connected to it
  Stage 3: Show a text statement naming the group, e.g. "Row 12, left half — 5 holes connected" or "Upper positive rail — 25 holes connected"
  Stage 4: With "Reveal internal strips" on, draw the hidden metal strips underneath the holes as translucent bars, so the learner sees the physical reason for the grouping

Modes:
1. **Explore** — click any hole to see its connected group
2. **Continuity test** — click two holes; the sim states "CONNECTED" or "NOT CONNECTED" and explains why, e.g. "Not connected: these are on opposite sides of the center channel."
3. **Build check** — a small circuit is pre-placed (a sensor breakout straddling the channel, a power wire, a ground wire, one deliberately wrong connection). The learner must click the mistake. Feedback explains the fault. Three scenarios cycle: a wire in the wrong rail, both sensor legs in the same five-hole row shorting them together, and a ground wire that never reaches the rail.

Interactive features:
- Hover any hole: show its coordinate label, e.g. "E12"
- Click: highlight the connected group
- Toggle: reveal or hide internal strips
- Reset clears all highlights

Instructional Rationale: The objective is Understand/explain, so this is specified as click-to-reveal exploration rather than animation. The Build check mode is included because recognizing a broken circuit is a different and more useful skill than reciting the connection pattern, and it is the skill students will need at the bench. Revealing the internal strips is the mechanism that turns a memorized rule into an explanation.

Implementation: p5.js. Model the breadboard as a map from hole coordinate to a group identifier; the highlight operation is a lookup of all holes sharing a group id. Draw strips beneath holes with reduced alpha when revealed.
</details>

## The Pull-Up Resistor

One component appears often enough in sensor wiring to deserve an explanation now.

Start with the problem it solves. A GPIO pin set as an input reads the voltage applied to it. If nothing at all is connected, the pin is said to be **floating** — it is not held at any particular voltage, and it will pick up electrical noise from the air and report meaningless, fluctuating values. A floating input is not "off." It is unpredictable, which is worse.

A **pull-up resistor** is a resistor connected between a signal wire and the positive supply voltage. Its job is to gently hold the signal line high — at 3.3 V — whenever nothing else is actively driving it. When a device does drive the line low, it easily overcomes the gentle pull, and the line reads 0 V.

The word "gently" is doing real work there. The resistor has enough resistance that only a tiny current flows through it, so any device can pull the line down without fighting hard. Typical pull-up values in this project are between 1,800 and 10,000 ohms.

This matters to you because the I2C bus in Chapter 12 requires pull-up resistors on both of its wires. There is good news, though: almost every BME280 breakout board sold today includes the pull-up resistors on the board itself. You will probably never solder one. But when a sensor is not detected and everything else looks right, missing pull-ups is on the short list of causes.

| Situation | What the pin reads | Is it usable? |
|-----------|--------------------|---------------|
| Nothing connected (floating) | Random, fluctuating | No |
| Pull-up resistor, nothing driving | 3.3 V (high) | Yes — predictable |
| Pull-up resistor, device driving low | 0 V (low) | Yes — predictable |

## Static Electricity Will Destroy Your Board

Walk across a carpet on a dry day and touch a doorknob. That small snap is a spark carrying several thousand volts.

You survive it because the current is tiny and lasts microseconds. The transistors inside a processor are a few nanometers across, and they do not survive it. **Electrostatic discharge**, usually written ESD, is the sudden flow of built-up static charge between two objects at different voltages.

The genuinely dangerous part of ESD is that it is often invisible. A discharge you can feel is around 3,000 volts. A discharge you can see as a spark is around 5,000 volts. A discharge that can damage a chip can be as low as 100 volts — far below anything you would notice.

This produces a nasty failure mode called latent damage. The board seems fine. It works on the bench, it works for a week, and then it starts behaving strangely, or dies in the field two months later when it is mounted on a pole in a box. You will not connect the failure to the moment you touched it, because there was no moment you noticed.

**Static discipline** is the short list of habits that prevents this:

1. **Touch something grounded and metal before touching a board.** A radiator, a metal desk leg, or the metal case of a plugged-in desktop computer all work. Do this every time, not just once per session.
2. **Handle boards by the edges.** Do not touch the pins, the connectors, or the chips.
3. **Keep boards in their antistatic bags** — the silvery or pink ones — until you need them. Those bags are not just packaging.
4. **Avoid working on carpet**, and avoid wool and fleece clothing. A wooden or laminate table is ideal.
5. **Power everything off before rewiring.** Connecting or disconnecting a sensor on a live board risks both ESD and a short circuit.
6. **Dry air makes everything worse.** Winter, heated indoor air, and air conditioning all raise static risk. On a dry day, ground yourself more often.

!!! tip "The two-second habit"
    Before you pick up any board, touch a grounded metal object. It takes two seconds, it costs nothing, and it prevents the most frustrating category of failure in this entire project — the kind where nothing looks wrong and nothing works.

## Your First Look at the Hardware

Here is the full parts list for the electrical side of the station. You do not need all of it yet, but it is useful to know what is coming.

| Part | Purpose | First used in |
|------|---------|---------------|
| Raspberry Pi Zero 2 W | The station's computer | Chapter 3 |
| microSD card (16 GB or larger) | Storage and operating system | Chapter 12 |
| 40-pin header (if not pre-soldered) | Physical connector for wires | Chapter 3 |
| Female-to-female jumper wires | Connect the Pi to the sensor | Chapter 12 |
| BME280 breakout board | Temperature, pressure, humidity | Chapters 6, 7, 8, 12 |
| Breadboard (optional) | Bench experiments before final build | Chapter 3 |
| USB power supply | Bench power while developing | Chapter 3 |
| Antistatic bag | Storage between sessions | Always |

Before doing anything else with the board, do a visual check. This costs a minute and catches problems that would otherwise look like software bugs later:

1. Look at the header pins. Are any bent or missing?
2. Look at the board surface. Any scorch marks, or components knocked off?
3. Check the microSD slot for debris.
4. Confirm you have the right power supply. The Pi Zero 2 W uses a micro-USB connector, not USB-C, and needs a supply rated for at least 2.5 A.

## Key Takeaways

- A **single-board computer** is a complete computer on one board. It trades upgradability for size, low power, and the ability to connect directly to electronic parts.
- The **Raspberry Pi** family was created to give students hands-on hardware experience. The **Raspberry Pi Zero 2 W** is used here for its size, low power draw, built-in Wi-Fi, and cost.
- **Voltage** is electrical pressure, measured between two points. **Current** is rate of flow, drawn by the device. **Ground** is the 0 V reference that completes every circuit.
- **GPIO pins** are software-controlled connections on the **pin header**. They run at **3.3 V and are not 5 V tolerant**.
- **Jumper wires** make temporary connections; red for power and black for ground is a convention worth keeping. A **breadboard** connects holes in fixed groups, with no connection across the center channel.
- A **pull-up resistor** holds a signal line high when nothing is driving it, preventing a floating input. The I2C bus needs them, and most breakout boards include them.
- **Electrostatic discharge** can destroy a board at voltages far below what you can feel. Ground yourself before touching hardware, every time.

## Check Yourself

??? question "A sensor is rated for 3.3 V and draws 2 mA. Your Pi's 3.3 V pin can supply up to 50 mA. Is this safe? Click to check."
    Yes, and the reason is the asymmetry between voltage and current. Voltage must match: the sensor wants 3.3 V and the pin supplies 3.3 V. Current is drawn, not forced: the sensor takes the 2 mA it needs, and the pin's 50 mA capability is simply headroom. A supply that *can* provide more current than a device needs is exactly what you want.

??? question "You put both legs of a component in holes E12 and E13 of a breadboard. Are they connected? What if you use E12 and F12? Click to check."
    E12 and E13 are in different numbered rows, so they are **not** connected. E12 and F12 are in the same row 12 — but E and F sit on opposite sides of the center channel, so they are **not** connected either. Holes A12 through E12 form one connected group; F12 through J12 form a separate group.

??? question "Your sensor worked yesterday and today reads nothing. Name the first three things to check. Click to check."
    1. **Ground.** A missing or loose ground wire is the most common cause. 2. **Power.** Is the red wire on a 3.3 V pin, and is it seated firmly? 3. **The pins themselves.** Did a wire slip one position along the header? Pin 1 and pin 3 are adjacent, and a wire on the wrong one looks identical from across the room. Only after all three should you suspect the software.

??? question "You felt a static shock while holding your board, but it seems to work fine. Should you worry? Click to check."
    Yes, somewhat. A shock you can feel is around 3,000 volts, and chip damage can occur at 100 volts. The board working right now does not mean it is undamaged — ESD frequently causes latent damage that appears days or weeks later. Note the date, and if the board starts behaving strangely in the field, remember this as a candidate cause. Then go back to grounding yourself first, every time.

---

## What Is Next

The board exists and you can connect wires to it without destroying anything. But a wire from a sensor to a pin is only useful if something on the other end can turn a physical property into a voltage.

Chapter 4 covers exactly that. It introduces transduction — the process of converting a physical property into an electrical signal — and follows a measurement from the analog signal a sensor produces through analog-to-digital conversion into a number a computer can store. It also covers the materials that make sensing possible: semiconductors, MEMS structures, and the photoelectric effect. After that chapter, every sensor in the rest of the book is a variation on one idea you already understand.
