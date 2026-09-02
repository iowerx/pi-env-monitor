---
title: Raspberry Pi GPIO Pinout Explorer
description: Every one of the 40 header pins, clickable, colour coded, with a safety line on each and a guided walkthrough of the four pins this book actually wires.
image: /sims/gpio-pinout-explorer/gpio-pinout-explorer.png
og:image: /sims/gpio-pinout-explorer/gpio-pinout-explorer.png
twitter:image: /sims/gpio-pinout-explorer/gpio-pinout-explorer.png
social:
   cards: false
quality_score: 0
---

# Raspberry Pi GPIO Pinout Explorer

<iframe src="main.html" height="526px" width="100%" scrolling="no"></iframe>

[Run the Raspberry Pi GPIO Pinout Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A printed pinout diagram is dense, and a misread pin number can destroy a board. This is
the same information, but it answers the question you actually have with the Pi in your
hand: *which pin is this, and what happens if I connect here?*

All 40 pins are clickable. Each one reports its physical number, its BCM GPIO number, its
function, a safety line, and where the book uses it. Pin 1 is drawn as a square, exactly
as it is silkscreened on the board.

The colours are the fast path:

- **Orange** - 3.3 V power. Safe for the sensors in this book.
- **Red** - 5 V. Never connect these to a GPIO pin.
- **Black** - ground. There are eight of them, and any one will do.
- **Green** - general-purpose GPIO.
- **Blue** - GPIO with a special function: I2C, SPI or UART.

**Wire the BME280** walks through the four pins the build needs, one at a time. It starts
with ground, not with power, and says why: if power reaches a sensor before ground does,
the return current has to find its way home through a data line.

## How to Use

- **Hover** any pin to highlight it. **Click** it to open the full detail panel.
- Use **Power**, **Ground** and **I2C** to dim everything else. Non-matching pins fade
  rather than vanish, so you never lose track of where a pin sits.
- Press **Wire the BME280** and then **Next step** four times. The highlighted pin pulses
  yellow and the panel names the wire colour.
- Click pin 2 or pin 4 and read the safety line before you go anywhere near the bench.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/gpio-pinout-explorer/main.html"
        height="526px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
10-15 minutes

### Bloom's Taxonomy Level
Remember (L1)

### Prerequisites
- No prior knowledge required

### Activities

1. **Orientation (3 min)**: Find pin 1. Find pin 40. Explain how the odd and even numbers are arranged, and check it against a real board or a photograph.
2. **Exploration (6 min)**: Use the Ground filter. How many ground pins are there? Now use Power. How many pins carry 5 V, and what does the safety line say about them?
3. **Guided build (5 min)**: Run Wire the BME280 all the way through. Write down the four pin numbers and the four wire colours from memory afterwards.

### Assessment
- Locates a pin by physical number and states its function.
- Distinguishes physical pin numbering from BCM GPIO numbering.
- Identifies the 5 V pins as the ones never to connect to a sensor or a GPIO pin.

## References

1. [Raspberry Pi documentation: GPIO](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#gpio) - the authoritative pinout and electrical limits.
2. [pinout.xyz](https://pinout.xyz/) - the pinout reference most Pi users keep open.
3. [Bosch Sensortec BME280 datasheet](https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/) - the sensor these four pins are for.
4. [Wikipedia: I2C](https://en.wikipedia.org/wiki/I%C2%B2C) - the two-wire bus on pins 3 and 5.
