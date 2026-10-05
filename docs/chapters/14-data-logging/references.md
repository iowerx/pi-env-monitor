# References: Logging Data: Timestamps, Intervals, and Files

1. [Comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values) - Wikipedia - Explains the CSV file format, including header rows, fields, records, and how commas inside values are handled. Its examples show exactly how a station's readings look when saved as plain text.

2. [Time series](https://en.wikipedia.org/wiki/Time_series) - Wikipedia - Defines a time series as data points recorded in time order and explains how they are sampled and analyzed. It connects the chapter's sampling interval and timestamp ideas to the analysis coming next.

3. [Metadata](https://en.wikipedia.org/wiki/Metadata) - Wikipedia - Describes metadata as "data about data," with examples from libraries, photos, and science. It supports the chapter's point that a dataset needs a record of what, where, and how it was measured.

4. Python for Data Analysis - Wes McKinney - O'Reilly Media - McKinney, creator of the pandas library, introduced the DataFrame approach for loading CSV files and working with timestamped data. His time series chapter shows how to resample readings to new intervals in a few lines.

5. R for Data Science - Hadley Wickham and Garrett Grolemund - O'Reilly Media - Wickham's "tidy data" rules, where each variable is a column, each observation is a row, and each value is a cell, give a simple test for designing a clean data file.

6. [csv: CSV File Reading and Writing](https://docs.python.org/3/library/csv.html) - Python Documentation - The official guide to Python's built-in csv module, with examples for writing header rows and records. Students can copy its patterns directly into their data logging script.

7. [About SQLite](https://sqlite.org/about.html) - SQLite - Explains SQLite, a small, free database stored in a single file and built into Python. It shows when a growing dataset might move from CSV files into a database without needing a server.

8. [logrotate](https://manpages.ubuntu.com/manpages/noble/man8/logrotate.8.html) - Ubuntu Manpages - The manual page for logrotate, the Linux tool that rotates, compresses, and removes old files on a schedule. It shows a real-world example of the file rotation strategy this chapter describes.

9. [Metadata](https://www.ncei.noaa.gov/resources/metadata) - NOAA National Centers for Environmental Information - Explains how the U.S. national climate data archive documents its datasets with standard metadata. It shows students why professional stations record instrument, location, and method details alongside every dataset.

10. [ASOS User's Guide](https://www.weather.gov/media/asos/aum-toc.pdf) - National Weather Service - The guide to the automated weather stations at U.S. airports, explaining how often each sensor is sampled and averaged. Its description of one-minute readings combined into five-minute averages models careful sampling intervals.
