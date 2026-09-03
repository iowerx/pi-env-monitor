---
title: I2C Bus Explorer
description: Two wires, three devices and one address broadcast, clocked out bit by bit - plus every wiring fault that makes i2cdetect come back empty.
image: /sims/i2c-bus-explorer/i2c-bus-explorer.png
og:image: /sims/i2c-bus-explorer/i2c-bus-explorer.png
twitter:image: /sims/i2c-bus-explorer/i2c-bus-explorer.png
social:
   cards: false
quality_score: 0
---

# I2C Bus Explorer

<iframe src="main.html" height="688px" width="100%" scrolling="no"></iframe>

[Run the I2C Bus Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

I2C is invisible. Two wires, nothing observable, and when a sensor fails to appear there is
no mental model to debug against. This makes the address broadcast and the device responses
visible, which turns `i2cdetect` output from a mystery into a readable result.

Three views are driven from **one state machine over discrete bit-clock steps**, so the
schematic, the logic-analyser waveform and the phase caption cannot disagree with each
other. Step through a transaction and watch:

- **Idle.** Both lines held high by the pull-up resistors.
- **START.** SDA goes low while SCL is high. The controller has claimed the bus.
- **Seven address bits**, clocked out one at a time, with the binary value building up and
  its hex equivalent shown when the seventh arrives: `1110110 = 0x76`.
- **Compare.** All three devices are shown side by side against the broadcast address. Two
  grey out, one lights up.
- **ACK.** The matched device pulls SDA low for one clock.
- **Data**, then **STOP**.

**Run i2cdetect** sweeps every address on the bus and fills in a grid that looks exactly
like the real tool's output, yellow hex and all.

The five fault injections match the numbered troubleshooting list in the chapter, in the
same order:

| Fault | Symptom |
|---|---|
| No ground wire | Grid completely empty |
| SDA and SCL swapped | Grid completely empty |
| No pull-up resistors | Erratic waveform; the grid changes between runs |
| Two devices share 0x76 | Both acknowledge at once and the data is corrupt |
| Device 2 unpowered | That address vanishes; the others stay |

That last one deserves attention, because it is the fault that looks most like a code bug.
Everything else on the bus is fine and one device has simply gone. And the pull-up fault is
the nastiest: press **Run i2cdetect** twice and you get two different answers, which is the
real symptom of a bus that never settles.

## How to Use

- Press **Play**, or use **Step forward** to walk the transaction one clock edge at a time.
- Click anywhere on the **waveform** to jump to that instant.
- Watch the **Compare** step. That is where the addressing idea lives.
- **Run i2cdetect** before and after each fault and compare the grids.
- **Click a device** to cut its power, and change any device's address from the dropdowns.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/i2c-bus-explorer/main.html"
        height="688px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Analyze (L4)

### Prerequisites
- Chapter 3 on pull-up resistors and the GPIO header
- Chapter 12 sections on I2C, device addresses and `i2cdetect`

### Activities

1. **Follow one address (6 min)**: Step from START to ACK and write down each of the seven bits, then convert them to hex by hand and check against the panel.
2. **Diagnose blind (10 min)**: Have a partner set a fault without telling you. Run `i2cdetect`, step the transaction, and name the fault from the symptom alone.
3. **Two of the same sensor (5 min)**: Set two devices to 0x76 and explain what the controller sees. Then explain why breakout boards give you an address-select pin.

### Assessment
- Explains how one controller addresses many devices over two shared wires.
- Reads an `i2cdetect` grid and says what it rules in and out.
- Maps each symptom to the physical fault that produced it.

## References

1. [Wikipedia: I2C](https://en.wikipedia.org/wiki/I%C2%B2C) - the protocol, the START and STOP conditions, and 7-bit addressing.
2. [NXP UM10204: I2C-bus specification and user manual](https://www.nxp.com/docs/en/user-guide/UM10204.pdf) - the specification itself.
3. [Wikipedia: Open collector](https://en.wikipedia.org/wiki/Open_collector) - why the bus needs pull-ups and why devices can only pull low.
4. [i2c-tools](https://i2c.tools/) - the real `i2cdetect` this grid imitates.
