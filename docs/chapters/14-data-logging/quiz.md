# Quiz: Logging Data: Timestamps, Intervals, and Files

Test your understanding of sampling intervals, time series, records and fields, CSV files and header rows, storage, file rotation, backup, databases, and metadata with these review questions.

!!! mascot-tip "Think Like a Stranger"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    For each question, imagine someone opening your data five years from now with no one to ask. The best answer is usually the one that lets that stranger understand and trust your numbers.

---

#### 1. In your station's data, what is a data record?

<div class="upper-alpha" markdown>
1. One single value, such as a temperature of 21.4
2. One complete observation: all readings at one moment, plus the time
3. The first line of the file, which names each column
4. A separate file that describes the station and its sensor
</div>

??? question "Show Answer"
    The correct answer is **B**. A data record is one complete observation. It holds all the readings taken at one moment, plus the time they were taken. In a CSV file, each line after the header is one record. Option A describes a data field, which is one value inside a record. Option C describes the header row. Option D describes the metadata file that sits alongside the data.

    **Concept Tested:** Data Record and Data Field

    **See:** [Time Series](index.md#time-series)

---

#### 2. What does the 3-2-1 backup rule call for?

<div class="upper-alpha" markdown>
1. 3 sensors, at 2 stations, with 1 backup made each week
2. 3 copies, on 2 kinds of media, with 1 copy in a different place
3. 3 files each day, kept for 2 days, with 1 backup each month
4. 3 copies, all on the same SD card, checked 1 time each year
</div>

??? question "Show Answer"
    The correct answer is **B**. Data backup means keeping copies of your data somewhere other than the station. The 3-2-1 rule asks for 3 copies, on 2 kinds of media, with 1 copy in a different physical place. For a school, that might be the SD card, a school computer, and cloud storage. Option D keeps every copy on one card, which can fail completely. Options A and C are not the rule.

    **Concept Tested:** Data Backup

    **See:** [Rotation and Backup](index.md#rotation-and-backup)

---

#### 3. Which statement best describes a CSV file?

<div class="upper-alpha" markdown>
1. A binary database file that is indexed for fast searching
2. A special spreadsheet file that only one program can open
3. A plain text file with one record per line and commas between fields
4. A JSON file that records where and how the data was measured
</div>

??? question "Show Answer"
    The correct answer is **C**. A CSV file, short for Comma-Separated Values, is plain text. Each line is one record, and commas separate the fields. Almost any program can read it, people can inspect it, and adding a new line is easy. Option A describes a database such as SQLite. Option B is wrong, because CSV opens almost anywhere. Option D describes the metadata file.

    **Concept Tested:** CSV File

    **See:** [CSV Files](index.md#csv-files)

---

#### 4. Why would shuffling the rows of your station's data file destroy most of its meaning?

<div class="upper-alpha" markdown>
1. The CSV format cannot be opened again once rows are moved
2. The header row would end up somewhere in the middle of the file
3. A time series depends on order and spacing, and neighbors are related
4. Shuffling changes the numbers stored in each data field
</div>

??? question "Show Answer"
    The correct answer is **C**. A time series is a sequence of measurements of one quantity taken over time. Order matters, spacing matters, and each reading is close to its neighbors. That closeness is what makes an outlier stand out. Shuffling destroys the order, so the story is lost. Option A is wrong, because the file still opens. Option B is a side issue. Option D is wrong, because the values themselves do not change.

    **Concept Tested:** Time Series

    **See:** [Time Series](index.md#time-series)

---

#### 5. According to the chapter, what is the real limit on storing station data on a microSD card?

<div class="upper-alpha" markdown>
1. A year of one-minute readings is too large for most cards
2. A card can hold only one CSV file at a time
3. The card slows down how fast the sensor can respond
4. Cards wear out from writing and can fail suddenly without warning
</div>

??? question "Show Answer"
    The correct answer is **D**. Data storage on a microSD card is limited by write endurance and sudden failure. Flash memory wears out after a finite number of writes, and a card can work perfectly and then become unreadable. Option A is wrong, because a year of one-minute data is only about 32 MB. Option B is false. Option C confuses storage with the sensor's response time. Capacity is not the constraint. Reliability is.

    **Concept Tested:** Data Storage

    **See:** [Storage on a Small Computer](index.md#storage-on-a-small-computer)

---

#### 6. Why does the chapter recommend rotating to a new data file each day, named like `readings-2026-08-25.csv`?

<div class="upper-alpha" markdown>
1. Files stay small, damage stays in one day, and the names sort in time order
2. Daily files use less memory, so the sensor can sample faster
3. The CSV format can only hold one day of data per file
4. Rotating files makes the timestamps switch to local time each day
</div>

??? question "Show Answer"
    The correct answer is **A**. File rotation means closing the current file and starting a new one, usually by date. Each daily file is small and quick to open, and any corruption is contained to one day. Copying new files is easy. Because the names use ISO 8601 dates, they sort in time order as plain text. Option B is not the reason. Option C is false. Option D is wrong, because timestamps stay in UTC.

    **Concept Tested:** File Rotation

    **See:** [Rotation and Backup](index.md#rotation-and-backup)

---

#### 7. You add a cup anemometer to your station. Which sampling plan best fits wind speed?

<div class="upper-alpha" markdown>
1. Take one reading every hour to keep the files small
2. Log 100 raw readings every second, all day long
3. Take one instant reading each minute and save it
4. Sample every 1 to 3 seconds and record one-minute summaries
</div>

??? question "Show Answer"
    The correct answer is **D**. The sampling interval is the time between readings. Gusts are brief and matter, so wind needs fast sampling, every 1 to 3 seconds. You then summarize each minute with values like average and gust. Option A misses almost everything. Option B samples far faster than a cup anemometer can respond, which wastes power and card life. Option C would miss most gusts between readings.

    **Concept Tested:** Sampling Interval

    **See:** [How Often Should You Read?](index.md#how-often-should-you-read)

---

#### 8. You add wind speed in m/s and irradiance in W/m² to your CSV file. Which header row best follows the chapter's advice?

<div class="upper-alpha" markdown>
1. `time,temp,wind,light`
2. `Timestamp,Temperature,Wind Speed,Irradiance`
3. `timestamp,temperature_c,wind_speed_ms,irradiance_wm2`
4. `timestamp_local,temperature_c,wind_speed_ms,irradiance_wm2`
</div>

??? question "Show Answer"
    The correct answer is **C**. The header row is the first line of a CSV file, and it names each field. The chapter's rule is that every column name carries its unit, so a stranger knows exactly what each number means. Options A and B have no units, so readers must guess. Option D includes units but stores local time, and the chapter says timestamps must always be UTC, in ISO 8601 format.

    **Concept Tested:** Header Row

    **See:** [CSV Files](index.md#csv-files)

---

#### 9. A teacher plans to compare your station's pressure with a neighbor's. Which entries in your metadata file most help prevent a false storm alarm?

<div class="upper-alpha" markdown>
1. The station's elevation and whether pressure is sea-level corrected
2. The data license and the name of the class running the station
3. The station's name and a photo of the installation
4. The date the station started and the sampling interval
</div>

??? question "Show Answer"
    The correct answer is **A**. Metadata is data about the data: where, how high, with what sensor, and how it was processed. Pressure falls about 12 hPa per 100 m, so elevation matters. Knowing whether a value is station pressure or sea-level corrected stops someone from comparing 995 hPa with 1013 hPa and seeing a storm that is not there. Options B, C, and D are useful metadata, but none of them explains a pressure difference.

    **Concept Tested:** Metadata

    **See:** [Metadata](index.md#metadata)

---

#### 10. Your school has five years of daily CSV files. Now you want to find every hour when pressure fell more than 3 hPa, and a web dashboard needs fast lookups. What is the best plan?

<div class="upper-alpha" markdown>
1. Delete the CSV files and keep the data only in a database
2. Combine everything into one giant CSV file and search it each time
3. Switch to sampling once an hour so the files are easier to search
4. Keep the CSV files as the record and import them into SQLite for queries
</div>

??? question "Show Answer"
    The correct answer is **D**. A database indexes data so questions can be answered without scanning everything. CSV is great for appending but slow to search over years of data. The chapter's middle path keeps the readable CSV files as the permanent record and imports them into SQLite for analysis. Option A throws away the durable, readable files. Option B makes searching slower. Option C throws away detail you can never get back.

    **Concept Tested:** Database

    **See:** [When a File Is Not Enough](index.md#when-a-file-is-not-enough)

---

!!! mascot-celebration "Data Safely Stored!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Fantastic work, station builders! You now know how to pick a sampling interval, write clear CSV files with units in the header, and protect your data with rotation, backup, and metadata. Check the data, then check it again.
