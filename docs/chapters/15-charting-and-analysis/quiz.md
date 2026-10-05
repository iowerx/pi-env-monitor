# Quiz: Charting and Interpreting Your Data

Test your understanding of line charts, scatter plots, honest axes, moving averages, correlation, derived measures like pressure tendency and insolation, and data quality checks with these review questions.

!!! mascot-tip "Ask What Else Moved"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When a question shows a strange reading, ask whether the other channels moved too. Real weather changes several readings together, while an instrument fault usually changes just one.

---

#### 1. What is insolation?

<div class="upper-alpha" markdown>
1. The total solar energy collected over a period, such as kWh/m² per day
2. The power of sunlight arriving at one instant, in W/m²
3. The fraction of incoming sunlight that a surface reflects
4. The highest irradiance reading recorded at solar noon
</div>

??? question "Show Answer"
    The correct answer is **A**. Insolation is solar energy added up over time. It is measured in watt-hours or kilowatt-hours per square metre, and it equals the area under the irradiance curve. Option B is irradiance, which is a rate, not a total. Option C is albedo. Option D is a single peak value, not a total. Insolation is the number used to size a solar panel, from about 1 kWh/m² on a winter overcast day to 7 or 8 on a clear summer day.

    **Concept Tested:** Insolation

    **See:** [Insolation](index.md#insolation)

---

#### 2. How does a scatter plot differ from a line chart of your station's data?

<div class="upper-alpha" markdown>
1. A scatter plot always puts time on the x-axis and joins the points
2. A scatter plot can only show one quantity at a time
3. Both axes are measurements, time drops out, and the points are not joined
4. A scatter plot is used only when the data has gaps in it
</div>

??? question "Show Answer"
    The correct answer is **C**. A line chart plots values against time and joins the points, because the quantity existed between readings. A scatter plot puts one measurement against another, so time disappears. Each point is one moment, and the points are not joined. A scatter plot asks, "Do these two things move together?" Option A describes a line chart. Option B is backward, because a scatter plot needs two quantities. Option D is not what it is for.

    **Concept Tested:** Scatter Plot and Line Chart

    **See:** [Scatter Plots and Correlation](index.md#scatter-plots-and-correlation)

---

#### 3. Why would you apply a 24-hour moving average to a month of temperature data?

<div class="upper-alpha" markdown>
1. To remove the outliers so they never have to be checked
2. To fill in gaps where the station was offline
3. To make every fast, real event stand out more clearly
4. To average out the daily cycle and reveal the slower weather changes
</div>

??? question "Show Answer"
    The correct answer is **D**. A moving average replaces each value with the mean of it and its neighbors over a fixed window. A 24-hour window covers one full day-and-night cycle, so it removes that cycle and leaves the slower changes from weather. Option A is wrong, because outliers should be flagged and checked, not smoothed away. Option B is wrong, because gaps must stay visible. Option C is backward, because smoothing hides fast events.

    **Concept Tested:** Moving Average

    **See:** [Smoothing and Trend](index.md#smoothing-and-trend)

---

#### 4. Your station reads 1012.4 hPa at 09:00 and 1008.9 hPa at 12:00. What is the pressure tendency, and what does it suggest?

<div class="upper-alpha" markdown>
1. +3.5 hPa, rising rapidly, so skies are clearing
2. −3.5 hPa, falling, so weather is slowly getting worse
3. −3.5 hPa, falling rapidly, so a storm may be approaching
4. −3.5 hPa, falling very rapidly, so severe weather is likely
</div>

??? question "Show Answer"
    The correct answer is **C**. Pressure tendency is the pressure now minus the pressure three hours ago: 1008.9 − 1012.4 = −3.5 hPa. Barometric forecasting uses the chapter's table, where a fall of more than 3 hPa is "falling rapidly," meaning a storm may be approaching. Option A flips the subtraction. Option B uses the −1 to −3 category, which is too small. Option D needs a fall of more than 6 hPa.

    **Concept Tested:** Pressure Tendency and Barometric Forecasting

    **See:** [Pressure Tendency](index.md#pressure-tendency)

---

#### 5. Over two minutes, your fast wind samples average 6.0 m/s, and the highest sample is 9.1 m/s. Using the chapter's 2.6 m/s gust threshold, what should you report?

<div class="upper-alpha" markdown>
1. Sustained wind 9.1 m/s, with no gust
2. Sustained wind 7.6 m/s, with a gust of 9.1 m/s
3. Sustained wind 6.0 m/s, with a gust of 9.1 m/s
4. Sustained wind 6.0 m/s, with no gust reported
</div>

??? question "Show Answer"
    The correct answer is **C**. Sustained wind speed is the average over the window, so it is 6.0 m/s. A wind gust is the peak, reported when it beats the sustained speed by the threshold. Here 9.1 − 6.0 = 3.1 m/s, which is more than 2.6, so the gust of 9.1 m/s is reported. Option A uses the peak as the average. Option B averages the mean with the peak. Option D forgets that 3.1 is above the threshold.

    **Concept Tested:** Wind Gust and Sustained Wind Speed

    **See:** [Wind Gust and Sustained Wind Speed](index.md#wind-gust-and-sustained-wind-speed)

---

#### 6. One-minute temperatures read 21.3, 21.4, 35.8, and 21.5 °C. The range check allows −50 to 60 °C, and the rate check allows 2 °C per minute. Which check flags the 35.8 reading?

<div class="upper-alpha" markdown>
1. Only the rate-of-change check flags it
2. Only the range check flags it
3. Both checks flag it
4. Neither check flags it
</div>

??? question "Show Answer"
    The correct answer is **A**. Data validation checks whether readings are plausible. The value 35.8 °C sits inside the −50 to 60 °C range, so the range check passes it, which rules out options B and C. But it jumped 14.4 °C in one minute, far beyond the 2 °C limit, so the rate check flags it. Option D misses the jump. Air temperature does not leap like that, so this points to the instrument.

    **Concept Tested:** Data Validation

    **See:** [When the Data Is Wrong](index.md#when-the-data-is-wrong)

---

#### 7. On sunny days, your temperature spikes about 6 °C at nearly the same time each afternoon. Humidity and pressure stay steady, and irradiance is high at those times. What is the most likely cause?

<div class="upper-alpha" markdown>
1. A cold front passes over the station every afternoon
2. Sunlight is reaching the sensor because its shield is not doing its job
3. Random electrical noise is hitting the I2C bus
4. The temperature sensor is slowly drifting out of calibration
</div>

??? question "Show Answer"
    The correct answer is **B**. An outlier is a question, not an answer. These spikes repeat at the same time of day, match high irradiance, and leave the other channels steady. That is the signature of sunlight hitting the sensor. Option A is wrong, because a front would move several channels and would not repeat daily. Option C would be random, single readings. Option D is slow and steady, not a daily spike.

    **Concept Tested:** Outlier

    **See:** [Outliers](index.md#outliers)

---

#### 8. In a week of your data, relative humidity and pressure have a correlation of −0.6. A classmate says falling pressure causes humidity to rise. What is the best analysis?

<div class="upper-alpha" markdown>
1. The classmate is right, because a correlation of −0.6 proves cause
2. A correlation of −0.6 means the two have no relationship at all
3. Rising humidity must be what causes the pressure to fall
4. Both likely respond to passing weather systems, so the pattern is not proof of cause
</div>

??? question "Show Answer"
    The correct answer is **D**. Correlation measures how strongly two variables move together, from −1 to +1. It never proves cause. The chapter notes that humidity and pressure often correlate because both respond to weather systems moving through, a third variable. Option A treats correlation as causation. Option B is wrong, because −0.6 is a fairly strong relationship. Option C just flips the cause. Name a physical mechanism, or call it a pattern.

    **Concept Tested:** Correlation

    **See:** [Scatter Plots and Correlation](index.md#scatter-plots-and-correlation)

---

#### 9. Your town's temperature changed very little this week, and you want to show that honestly. Which chart design is best?

<div class="upper-alpha" markdown>
1. A y-axis that always starts at 0 °C, because every axis must start at zero
2. A y-axis from 20.8 to 21.6 °C with no labels, to show more detail
3. Side-by-side charts for two towns, each with its own y-axis range
4. A range that fits the real variation, with labeled axes, units, and a clear title
</div>

??? question "Show Answer"
    The correct answer is **D**. Axis labeling names each axis, its unit, and its range. The chapter's rule is to choose a range that reflects the real variation and label it so clearly that no reader mistakes the scale. Option A is wrong, because zero is arbitrary on the Celsius scale. Option B uses a tight range with no labels, which makes small changes look dramatic. Option C makes comparison meaningless, because the axes must match.

    **Concept Tested:** Axis Labeling

    **See:** [Honest Axes](index.md#honest-axes)

---

#### 10. You want to design a plan to catch humidity sensor drift over a school year. Which plan would work best?

<div class="upper-alpha" markdown>
1. Subtract a fixed offset from every past reading in the raw file each month
2. Track the monthly difference from a nearby official station, check overnight dew peaks, and log corrections separately
3. Delete any humidity readings that look lower than you expected
4. Apply a 30-day moving average so the drift no longer shows on charts
</div>

??? question "Show Answer"
    The correct answer is **B**. Sensor drift is a slow change in readings that does not reflect real conditions. Comparing with a nearby official station shows drift as a difference that walks steadily in one direction. On clear, calm dew nights, humidity should reach about 100 percent. Corrections belong in a separate record. Option A edits historical data, which the chapter forbids. Option C destroys evidence. Option D hides the problem instead of detecting it.

    **Concept Tested:** Sensor Drift

    **See:** [Sensor Drift](index.md#sensor-drift)

---

!!! mascot-celebration "Reading the Story!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Superb analysis, observers! You charted honestly, smoothed with care, worked out pressure tendency, insolation, and gusts, and learned to question outliers and drift. Check the data, then check it again.
