---
title: Power Budget Calculator
description: A year of battery state of charge, carried forward day by day, so the November death is visible in March.
image: /sims/power-budget-calculator/power-budget-calculator.png
og:image: /sims/power-budget-calculator/power-budget-calculator.png
twitter:image: /sims/power-budget-calculator/power-budget-calculator.png
social:
   cards: false
quality_score: 0
---

# Power Budget Calculator

<iframe src="main.html" height="690px" width="100%" scrolling="no"></iframe>

[Run the Power Budget Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The failure this targets is specific and common: a station sized in spring that dies in
November, by which time everyone has moved on. The only way to see it coming is to simulate
a whole year with the battery state **carried forward day by day**, which is what
distinguishes this from a spreadsheet.

The simulation starts in **March**, because that is when a student builds a station. The
default configuration — 10 W panel, 20,000 mAh lithium battery, PWM controller, Wi-Fi, no
duty cycling — gives this verdict:

> **FAILS in Nov.** The battery reaches empty on Nov 11. This design works in Mar to Oct and
> fails in Nov. A station built and tested in spring will die in autumn.

The daily load is itemised to the chapter's figure exactly: 72 mA for the Pi, 45 mA for Wi-Fi,
25 mA for HDMI, 7 mA for the LEDs and 1 mA for the sensors, summing to **3,600 mAh a day**.
Collection uses the chapter's formula with the 0.7 loss factor as a separate visible step, so
December's 1.1 kWh/m²/day yields 1,540 mAh against 3,600 consumed.

**The cheapest fix is software, and the sim quantifies how much.** Enable everything in the
duty-cycling row and consumption drops from 3,600 to **580 mAh a day** — a saving of 3,020
mAh, or 84 per cent of the budget, for no hardware at all. The failing design becomes a
passing one.

Buying your way out is less effective than you would think. Stepping the battery from 5,000
to 50,000 mAh moves the death from November 3 to November 26; it never prevents it, because
a battery cannot fix an energy deficit. Stepping the panel from 5 to 50 W does fix it, at
five times the panel.

**Cold derating** is on by default, because winter takes your solar input and your battery
capacity at the same time: at 4 °C you have 80 per cent of rated capacity, so autonomy in the
worst month is 3.6 days rather than 4.4. **Insert a bad week** drops seven consecutive days
in the worst month to 25 per cent insolation, because the worst month has bad weeks in it.

Four sites are available, and the **high-latitude** one still fails in January even with every
duty-cycle measure enabled — an honest result, and the argument for a bigger panel rather than
cleverer software.

## How to Use

- Read the **itemised load** first, then look at the December row of the monthly table.
- Press **All duty cycling** and watch both the load and the verdict change.
- Try fixing the default with a **bigger battery** instead. Note how little it buys.
- Switch to **High latitude** and see what survives.
- Turn **cold derating** off and on to see what winter does to capacity alone.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/power-budget-calculator/main.html"
        height="690px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
25-30 minutes

### Bloom's Taxonomy Level
Evaluate (L5)

### Prerequisites
- Chapter 16 sections on power budgets, solar sizing, autonomy and duty cycling
- Chapter 15 on insolation, which supplies the monthly figures

### Activities

1. **Find the failure (7 min)**: With the default configuration, record the month it fails and the December energy balance. Explain why testing in May would not have caught it.
2. **Software before hardware (10 min)**: Enable duty-cycle measures one at a time, recording the daily total after each. Which single measure saves the most, and what does it cost you?
3. **Judge a design (8 min)**: Choose a site, then specify a panel, battery and duty cycle that survives a bad week in the worst month. Justify each choice in one sentence.

### Assessment
- Judges a design against the worst month rather than the average one.
- Quantifies how much of a fix came from software rather than hardware.
- Explains why a larger battery delays rather than prevents a deficit failure.

## References

1. [NREL: solar resource data by location](https://nsrdb.nrel.gov/) - where real monthly insolation figures come from.
2. [Wikipedia: Maximum power point tracking](https://en.wikipedia.org/wiki/Maximum_power_point_tracking) - what MPPT buys over PWM.
3. [Battery University: discharging at high and low temperatures](https://batteryuniversity.com/article/bu-502-discharging-at-high-and-low-temperature) - the cold-capacity derating applied here.
4. [Wikipedia: Duty cycle](https://en.wikipedia.org/wiki/Duty_cycle) - the idea the whole software half of this rests on.
