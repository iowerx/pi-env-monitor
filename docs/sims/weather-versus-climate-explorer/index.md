---
title: Weather Versus Climate Explorer
description: View one temperature record at three time windows - a week, a year, thirty years - with the trend line refusing to appear until the window is wide enough to justify it.
image: /sims/weather-versus-climate-explorer/weather-versus-climate-explorer.png
og:image: /sims/weather-versus-climate-explorer/weather-versus-climate-explorer.png
twitter:image: /sims/weather-versus-climate-explorer/weather-versus-climate-explorer.png
social:
   cards: false
quality_score: 0
---

# Weather Versus Climate Explorer

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the Weather Versus Climate Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
## About This MicroSim

This is the hardest idea in the chapter and the one most easily misunderstood in either
direction.

The chart shows **one station's temperature record**, and the only thing that changes
between views is how much of it you are looking at:

- **One week** - seven daily values. The trend overlay is disabled, with the message
  *"Seven days is not enough to see a trend. This is weather."*
- **One year** - the seasonal cycle dominates everything. Still disabled: *"One year shows
  the seasons, not the climate. Come back with thirty."*
- **Thirty years** - monthly means. Now, and only now, a trend can be fitted.

The **y-axis range is fixed across all three views**. This is deliberate and it matters: the
same vertical distance always means the same number of degrees, so you cannot be fooled by
a rescaled axis into thinking the variation changed.

The dataset is synthetic but realistic, generated once and committed as a static JSON file,
so every learner in the room is discussing the same numbers. Underneath the seasons and the
day-to-day noise sits a slow warming trend of about 0.2 °C per decade. You cannot see it in
a week. You cannot see it in a year. It is unmistakable in thirty.

Red points are record days. Clicking one makes the point that a single extraordinary day
does not move the thirty-year average at all.

## How to Use

- Press **One week**, **One year** and **Thirty years** to change the window. Notice that
  the y-axis does not move.
- Tick **Show 30-year average line** to draw the climate normal. In the thirty-year view
  this also draws the fitted trend line; in the shorter views it is disabled on purpose.
- **Hover any point** for the date, the value, and how far it sits from the thirty-year
  average.
- **Click a red record day** and read what happens to the average line. Nothing does.
- Toggle the overlay on and off in the thirty-year view. The data never changes; only
  whether you are allowed to fit a line to it.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/weather-versus-climate-explorer/main.html"
        height="582px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
15-20 minutes

### Bloom's Taxonomy Level
Analyze (L4)

### Prerequisites
- Reading a line chart
- Knowing what an average is
- Understanding that seasons repeat annually

### Activities

1. **Weather (4 min)**: Stay in the one-week view. Describe the temperature in words. Try to state a trend. Notice that the sim will not let you draw one, and say why that restriction is fair.
2. **Seasons (5 min)**: Switch to one year. What dominates the picture now? Is that climate or is it just the calendar?
3. **Climate (7 min)**: Switch to thirty years and turn the overlay on and off. Estimate the total warming across the record. Then click a record hot day and check whether it moved the average.

### Assessment
- Explains why a trend cannot be fitted to seven days.
- Distinguishes the seasonal cycle from a long-term trend.
- States that one extreme day is evidence of weather, not of climate.

## References

1. [NOAA NCEI: U.S. Climate Normals](https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals) - what a thirty-year average is and why thirty.
2. [NASA GISS Surface Temperature Analysis (GISTEMP)](https://data.giss.nasa.gov/gistemp/) - the real version of the thirty-year view.
3. [IPCC Sixth Assessment Report, Working Group I](https://www.ipcc.ch/report/ar6/wg1/) - the observed warming rate this dataset imitates.
4. [Wikipedia: Climate variability and change](https://en.wikipedia.org/wiki/Climate_variability_and_change)
