# Quiz Generation Quality Report

Generated: 2026-10-05
Execution Mode: Chapter 1 written directly; chapters 2–17 by one serial agent
Wall-clock Time: about 25 minutes (chapters 2–17)

## Overall Statistics

- **Total Chapters:** 17
- **Total Questions:** 170
- **Avg Questions per Chapter:** 10
- **Concept Coverage:** 228/269 (85%)
- **Overall Quality Score:** 87/100

## Per-Chapter Summary

Bloom's counts are listed as R/U/Ap/An/Ev/Cr.

| Chapter | Type | Questions | Bloom's | Coverage | Explanation Words |
|---------|------|-----------|---------|----------|-------------------|
| [1. Why We Measure the Natural Environment](../chapters/01-why-we-measure/quiz.md) | Introductory | 10 | 4/4/1/1/0/0 | 12/12 (100%) | 62–81 |
| [2. The Language of Measurement](../chapters/02-language-of-measurement/quiz.md) | Introductory | 10 | 4/4/1/1/0/0 | 13/16 (81%) | 74–84 |
| [3. Electricity and the Single-Board Computer](../chapters/03-electricity-and-computer/quiz.md) | Introductory | 10 | 4/4/1/1/0/0 | 11/12 (92%) | 71–81 |
| [4. How Sensors Turn the World Into Numbers](../chapters/04-how-sensors-work/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 13/13 (100%) | 71–82 |
| [5. Time and Place](../chapters/05-time-and-place/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 15/18 (83%) | 71–79 |
| [6. Temperature](../chapters/06-temperature/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 16/20 (80%) | 69–79 |
| [7. Barometric Pressure](../chapters/07-barometric-pressure/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 14/17 (82%) | 73–82 |
| [8. Humidity and Dew Point](../chapters/08-humidity-and-dew-point/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 16/20 (80%) | 68–84 |
| [9. Solar Radiation](../chapters/09-solar-radiation/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 14/18 (78%) | 64–80 |
| [10. Wind](../chapters/10-wind/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 16/19 (84%) | 65–80 |
| [11. Ground Motion](../chapters/11-ground-motion/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 15/17 (88%) | 69–80 |
| [12. The Station's Brain](../chapters/12-os-and-sensor-buses/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 14/17 (82%) | 67–81 |
| [13. Programming the Station in Python](../chapters/13-python-programming/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 9/9 (100%) | 69–80 |
| [14. Logging Data](../chapters/14-data-logging/quiz.md) | Intermediate | 10 | 3/3/3/1/0/0 | 11/12 (92%) | 65–76 |
| [15. Charting and Interpreting Your Data](../chapters/15-charting-and-analysis/quiz.md) | Advanced | 10 | 1/2/3/2/1/1 | 13/16 (81%) | 73–85 |
| [16. Building the Station for the Outdoors](../chapters/16-building-for-outdoors/quiz.md) | Advanced | 10 | 1/2/3/2/1/1 | 13/16 (81%) | 68–81 |
| [17. From Measurement to Consequence](../chapters/17-measurement-to-consequence/quiz.md) | Advanced | 10 | 1/2/3/2/1/1 | 13/17 (76%) | 66–81 |

## Bloom's Taxonomy Distribution (Overall)

The target is the average of the chapter-type targets, weighted by chapter count (3 introductory, 11 intermediate, 3 advanced).

| Level | Actual | Target | Deviation |
|-------|--------|--------|-----------|
| Remember | 28% (48) | 26% | +2% ✓ |
| Understand | 30% (51) | 30% | +0% ✓ |
| Apply | 26% (45) | 26% | +0% ✓ |
| Analyze | 12% (20) | 15% | -3% ✓ |
| Evaluate | 2% (3) | 2% | +0% ✓ |
| Create | 2% (3) | 1% | +1% ✓ |

**Bloom's Distribution Score:** 23/25. Every chapter is within ±10% of its type's target. Intermediate chapters use 1 Analyze question where the target is 1.5.

## Answer Balance (Overall)

- A: 24% (41/170)
- B: 24% (41/170)
- C: 26% (45/170)
- D: 25% (43/170)

Each chapter has 2–3 correct answers per letter, no letter appears three times in a row, and no A-B-A-B or A-B-C-D runs occur. The answer keys were generated in advance with a seeded random shuffle.

**Answer Balance Score:** 15/15

## Validation

Each of these checks was run by script on all 17 quizzes:

- Exactly 10 questions per quiz, each with a balanced `upper-alpha` div
- Correct-answer letters match the pre-generated key
- Every `See:` link resolves to a real `##` or `###` heading in that chapter
- Every explanation is 50–100 words
- No near-duplicate question stems across the 170 questions (similarity threshold 0.8)
- Two Mecha admonitions per quiz, with no gendered pronouns
- `mkdocs build --strict` passes

## Concepts Not Tested

| Chapter | Untested Concepts |
|---------|-------------------|
| 2 | Standardization, SI Units, Scientific Notation |
| 3 | Raspberry Pi |
| 5 | Coordinate System, GNSS, Position Fix Accuracy |
| 6 | Resistance Thermometer, Thermistor, Fahrenheit Scale, Celsius Scale |
| 7 | Pressure, Inches Of Mercury, One Atmosphere |
| 8 | Humidity, Partial Pressure Of Vapor, Convection, Precipitation |
| 9 | Solar Radiation, Visible Light, Watts Per Square Meter, Photodiode |
| 10 | Wind, Wind Speed, Heat Index |
| 11 | Acceleration, Seismograph |
| 12 | Text Editor, Silicon Diode Sensor, SPI Bus |
| 14 | Data Logging |
| 15 | Missing Data, Trend, Saffir Simpson Scale |
| 16 | Remote Station, Telemetry, Charge Controller |
| 17 | Energy Demand, Air Quality, Solar Energy Generation, Building Code |

Several untested concepts are broad parent terms, such as Pressure, Humidity, Wind, Solar Radiation, and Data Logging. Questions on their sub-concepts test them indirectly.

## Notes

- Chapter 13 questions 7, 8, and 10 put a code block between the question heading and the options so students can trace the code.
- Create-level questions in chapters 15–17 are written as multiple choice ("which design/plan would you create"), so they sit close to Evaluate.
- Chapter 1 Q9 resembles that chapter's own Check Yourself question about one extreme day.

## Recommendations

- Fix the cross-reference errors found in the chapter text during generation. The session log lists them.
- Consider adding a second question for heavily used concepts that went untested, such as Thermistor (Ch 6), GNSS (Ch 5), and SPI Bus (Ch 12).
- To export quizzes to an LMS or a chatbot, generate `quiz-bank.json`.
