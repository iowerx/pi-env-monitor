---
title: Fog Watch: Temperature and Dew Point Convergence
description: Six overnight traces. Commit to dew, frost, fog or nothing at 22:00, then watch the rest of the night. One scenario is built so that relative humidity lies to you.
image: /sims/fog-watch-convergence/fog-watch-convergence.png
og:image: /sims/fog-watch-convergence/fog-watch-convergence.png
twitter:image: /sims/fog-watch-convergence/fog-watch-convergence.png
social:
   cards: false
quality_score: 0
---

# Fog Watch: Temperature and Dew Point Convergence

<iframe src="main.html" height="592px" width="100%" scrolling="no"></iframe>

[Run the Fog Watch: Temperature and Dew Point Convergence MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
## About This MicroSim

This is the first genuine forecast you can make from your own station's numbers, and it is
a satisfying one because the answer is on the grass by morning.

Air temperature and dew point are plotted on **one shared y-axis**, and that shared axis is
the entire point. The gap between the lines is shaded and it has a name: the **spread**.
Spread is how many degrees of cooling remain before condensation. When it reaches zero, the
air is saturated.

Relative humidity is drawn faintly on a second axis so you can watch it climb toward 100
per cent while the dew point sits flat - and so you can test whether you could have made
the call from humidity alone.

You see the night up to 22:00 and then you have to commit: **dew, frost, fog or nothing**.
The rest of the night is hidden until you do.

Six scenarios, and the four things they teach:

- **Radiation fog** - clear and calm, spread closing to zero by 05:00. Dense fog.
- **Dew only** - the spread stops half a degree short. Grass radiates faster than air and
  gets colder than it, so the surface saturates while the air does not.
- **Frost** - the same convergence, with the dew point below freezing. Vapour deposits
  directly as ice.
- **Windy night** - the spread narrows and then stops, because wind keeps mixing warmer air
  down. Convergence alone is not enough.
- **Cloudy night** - cloud radiates heat back down, cooling stalls, nothing forms.
- **High humidity, no fog** - relative humidity sits at 85 per cent all night and never
  moves. Air and dew point fall together, so the spread never closes. Watch only the
  humidity line and you will call fog and be wrong.

## How to Use

- Pick a scenario. Scrub the **time slider** back through the evening to see how fast the
  gap is closing.
- Hover any point for air temperature, dew point, spread, humidity, wind and cloud.
- Commit with **Dew**, **Frost**, **Fog** or **Nothing**. The rest of the night appears.
- Turn the **humidity line** off and try the same scenario again from the two temperature
  lines alone.
- Work through all six. The score keeps count.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/fog-watch-convergence/main.html"
        height="592px"
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
- The Humidity Three Ways MicroSim
- Chapter 8 sections on dew point

### Activities

1. **Learn the spread (6 min)**: On the radiation fog trace, note the spread at 18:00, 22:00 and 02:00. At what rate is it closing, in degrees per hour? When does that rate say it will reach zero?
2. **Dew, frost or fog (10 min)**: Run the first three scenarios. They converge similarly and produce three different results. Write down what distinguishes each one.
3. **The humidity trap (8 min)**: Run "High humidity, no fog" watching only the humidity line, then again with it turned off. Which view would have got you the right answer, and what does that tell you about which number to log?

### Assessment
- Predicts overnight condensation from the spread and its rate of closing.
- Names wind and cloud as reasons a converging spread may not finish.
- Explains why relative humidity alone is insufficient for this forecast.

## References

1. [Met Office: how does fog form](https://www.metoffice.gov.uk/weather/learn-about/weather/types-of-weather/fog) - radiation fog and the conditions it needs.
2. [NOAA National Weather Service: fog resources](https://www.weather.gov/) - dew point spread as an operational forecasting tool.
3. [Wikipedia: Fog](https://en.wikipedia.org/wiki/Fog)
4. [Wikipedia: Frost](https://en.wikipedia.org/wiki/Frost) - deposition, and why frost is not frozen dew.
