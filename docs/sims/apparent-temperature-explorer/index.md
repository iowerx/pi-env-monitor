---
title: Apparent Temperature Explorer
description: Wind chill and heat index drawn as two regimes of one surface, with the misconception that wind cools a car tackled head on.
image: /sims/apparent-temperature-explorer/apparent-temperature-explorer.png
og:image: /sims/apparent-temperature-explorer/apparent-temperature-explorer.png
twitter:image: /sims/apparent-temperature-explorer/apparent-temperature-explorer.png
social:
   cards: false
quality_score: 0
---

# Apparent Temperature Explorer

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Apparent Temperature Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the Chart.js Playground](https://www.chartjs.org/docs/latest/)

## About This MicroSim

Wind chill and heat index are almost always taught as two unrelated lookup tables. They are
not. They are two regimes of one question: **how fast can this body shed heat?** Drawing
them on one axis makes that visible.

Air temperature runs left to right across the whole chart, from −40 to 50 °C. The vertical
axis switches with the regime, because the variable that matters switches too: **wind speed
in the cold, relative humidity in the heat**. Between them sits a grey band from 10 to 27 °C
where neither correction applies, and it is labelled as such. Clicking into the far side of
the chart switches regimes and says so.

Colour is the difference from the actual air temperature, so a cell that feels colder and a
cell that feels warmer are visibly different things.

Two features target specific misconceptions:

- **What is being cooled?** Switch from Person to **Car** or **Water pipe** and the whole
  surface goes flat. Every column collapses to the air temperature, because that is what
  actually happens. Wind chill is a *rate of heat loss from a warm body*, not a temperature
  the air reaches. A pipe freezes when the air hits 0 °C, and wind only changes how quickly
  it gets there.
- **The wet bulb ceiling.** In the hot regime a dark region marks where wet bulb temperature
  exceeds 35 °C. Inside it, evaporative cooling has stopped working: no shade, no water and
  no fan help, and the condition is survivable for only a few hours even at rest.

Four presets set up the arguments. **Minnesota January** at −20 °C in 8 m/s feels like
−32.4 °C. **Gulf Coast August** at 33 °C and 80 per cent feels like 48.1 °C. **Sahara noon**
at 45 °C and 10 per cent feels like **42.1 °C — cooler than the thermometer**, because
sweat evaporates freely. And **British autumn** lands squarely in the grey band, where the
answer is that nothing is happening at all.

The **cross-section** view fixes the air temperature and sweeps the other variable, which
is where the diminishing returns of wind speed become obvious. The **pin** holds one
condition while you probe another and reports the difference between them.

Sources are printed under the chart: the 2001 NWS and Environment Canada wind chill index,
the Rothfusz heat index regression, and Stull (2011) for wet bulb.

## How to Use

- **Click or drag anywhere on the heatmap** to probe a condition.
- Try a **preset**, then move one variable at a time and watch which one moves the answer.
- Set **What is being cooled?** to *Car*. This is the single most useful thing here.
- Change the **wind unit** and re-read the same point in m/s, km/h, mph and knots.
- **Pin this point**, then probe a second condition to compare them directly.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/apparent-temperature-explorer/main.html"
        height="532px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Apply (L3)

### Prerequisites
- Chapter 8 on relative humidity and wet bulb temperature
- Chapter 10 sections on wind chill and heat index

### Activities

1. **Find the crossover (6 min)**: Starting from −20 °C, raise the air temperature until the wind stops mattering. Where does it happen, and why is the band drawn where it is?
2. **Cool a car (5 min)**: Set the target to *Car* at −5 °C in 15 m/s. Write down what the readout says and explain it to someone who thinks the car reaches the wind chill value.
3. **Two ways to be dangerous (8 min)**: Pin Gulf Coast August, then probe Sahara noon. Both are dangerous. Explain, using wet bulb, why only one of them is dangerous in a way that shade cannot fix.

### Assessment
- Calculates apparent temperature from air temperature plus one secondary variable.
- Explains why wind dominates in the cold and humidity in the heat.
- States correctly that objects cool to the air temperature, not to the wind chill.

## References

1. [NWS: Wind Chill Chart and the 2001 index](https://www.weather.gov/safety/cold-wind-chill-chart) - the formula and the frostbite times used here.
2. [Wikipedia: Wind chill](https://en.wikipedia.org/wiki/Wind_chill) - Siple and Passel, and why their 1945 formula was replaced.
3. [NWS Weather Prediction Center: the heat index equation](https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml) - the Rothfusz regression and its two adjustments.
4. [Wikipedia: Wet-bulb temperature](https://en.wikipedia.org/wiki/Wet-bulb_temperature) - the 35 °C limit and what it means physiologically.
