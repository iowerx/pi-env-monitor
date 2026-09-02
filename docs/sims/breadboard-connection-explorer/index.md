---
title: Breadboard Connection Explorer
description: Click any hole to light up every hole joined to it, reveal the hidden copper strips underneath, and then find the one wrong connection in three pre-wired circuits.
image: /sims/breadboard-connection-explorer/breadboard-connection-explorer.png
og:image: /sims/breadboard-connection-explorer/breadboard-connection-explorer.png
twitter:image: /sims/breadboard-connection-explorer/breadboard-connection-explorer.png
social:
   cards: false
quality_score: 0
---

# Breadboard Connection Explorer

<iframe src="main.html" height="586px" width="100%" scrolling="no"></iframe>

[Run the Breadboard Connection Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A breadboard's connections are invisible, which is why every beginner loses an afternoon
to a circuit that is wired correctly in their head and not on the board.

This explorer makes the hidden copper visible. Click any hole and every other hole on the
same metal strip lights up, with the group named: *"Column 15, rows A to E - 5 holes
connected"* or *"Upper positive rail - 25 holes connected"*. Turn on **Reveal internal
strips** and you can see the actual bars of metal under the plastic, which is the reason
for the grouping rather than just the rule.

Three modes, in increasing difficulty:

1. **Explore** - click a hole, see its strip.
2. **Continuity test** - click two holes and get CONNECTED or NOT CONNECTED with the
   reason. The centre channel gets its own explanation, because a real gap in the copper
   is exactly what lets a chip straddle the channel without shorting its own pins.
3. **Build check** - a circuit is already wired, and exactly one connection is wrong. Click
   the wire or the breakout you think is at fault. Three faults cycle: a power wire in the
   negative rail, a breakout pushed in sideways so two of its pins share one column, and a
   ground wire that stops in an empty column and never reaches the rail.

That third fault is the missing-ground problem from earlier in the chapter, wearing a
disguise. Recognising a broken circuit is a different and more useful skill than reciting
the connection pattern, and it is the one you need at the bench.

## How to Use

- **Explore:** click any hole. Hover shows its coordinate, like E12.
- Tick **Reveal internal strips** and click around again. The columns are separate bars;
  the rails are long ones running the length of the board.
- **Continuity test:** click two holes. Try one pair in the same column and one pair on
  opposite sides of the channel, and read both explanations.
- **Build check:** read the symptom at the top of the panel, then click the connection you
  think is wrong. Wrong guesses get an explanation too. **Next scenario** brings up another
  board.
- **Reset** clears the current selection.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/breadboard-connection-explorer/main.html"
        height="586px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Understand (L2)

### Prerequisites
- Chapter 3 sections on circuits and the complete loop
- The Circuit Loop and the Missing Ground MicroSim

### Activities

1. **Explore (6 min)**: Click one hole in each of these: a numbered column above the channel, the same column below the channel, and a power rail. Write down how many holes each group contains.
2. **Continuity (7 min)**: Predict CONNECTED or NOT CONNECTED before each click for five pairs of your choosing. Include at least one pair across the channel and one pair on two different rails.
3. **Build check (10 min)**: Work all three scenarios. For each one, state the symptom, the fault, and what you would physically move to fix it.

### Assessment
- States which holes on a breadboard are electrically joined, without looking it up.
- Explains the purpose of the centre channel in terms of chips straddling it.
- Finds a wiring fault from a described symptom rather than by trial and error.

## References

1. [SparkFun: How to Use a Breadboard](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard) - a clear photographic walkthrough of the same internal strips.
2. [Wikipedia: Breadboard](https://en.wikipedia.org/wiki/Breadboard)
3. [All About Circuits, *Volume VI - Experiments*](https://www.allaboutcircuits.com/textbook/experiments/) - breadboard practice and common wiring faults.
4. [Raspberry Pi documentation: GPIO](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#gpio) - what the jumper wires connect back to.
