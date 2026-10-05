# FAQ Quality Report

Generated: 2026-10-05

## Overall Statistics

- **Total Questions:** 91
- **Overall Quality Score:** 90/100
- **Content Completeness Score:** 100/100 (course description 25, valid DAG 25, glossary of 289 terms 15, about 99,800 words 20, all concepts have chapter content 15)
- **Concept Coverage:** 80% (214/269 concepts)
- **Average Reading Level:** about grade 7.7 (Flesch-Kincaid, approximate); target audience is grades 6-12

## Category Breakdown

### Getting Started
- Questions: 13
- Most common Bloom's levels: Remember (9), Understand (4)
- Avg Word Count: 116

### Core Concepts
- Questions: 24
- Most common Bloom's levels: Understand (14), Remember (5), Analyze (3)
- Avg Word Count: 113

### Technical Details
- Questions: 19
- Most common Bloom's levels: Understand (13), Remember (6)
- Avg Word Count: 110

### Common Challenges
- Questions: 13
- Most common Bloom's levels: Apply (6), Analyze (5), Understand (2)
- Avg Word Count: 115

### Best Practices
- Questions: 13
- Most common Bloom's levels: Apply (8), Evaluate (4), Create (1)
- Avg Word Count: 114

### Advanced Topics
- Questions: 9
- Most common Bloom's levels: Create (3), Evaluate (3), Analyze (3)
- Avg Word Count: 112

## Bloom's Taxonomy Distribution

The target is the weighted sum of each category's target from the faq-generator skill, using the actual number of questions in each category.

| Level | Actual | Target | Deviation |
|-------|--------|--------|-----------|
| Remember | 22% | 22% | +0% ✓ |
| Understand | 36% | 30% | +6% ✓ |
| Apply | 18% | 25% | -7% ✓ |
| Analyze | 12% | 15% | -3% ✓ |
| Evaluate | 8% | 5% | +3% ✓ |
| Create | 4% | 4% | +1% ✓ |

Total absolute deviation: 19 percentage points.

**Bloom's Distribution Score:** 20/25

## Answer Quality Analysis

- **Examples:** 39/91 (43%), target 40%+. An example is detected when the answer contains a phrase such as "for example", "such as", or "imagine".
- **Links:** 90/91 (99%), target 60%+
- **Avg Length:** 113 words, target 100-300 (range 100-140)
- **Complete Answers:** 91/91 (100%)
- **Anchor links (`#`):** 0 (hard requirement)
- **Broken links:** 0

Answer Quality Score: 25/25

## Concept Coverage

A concept counts as covered when it is tagged on a question or its label appears in a question or answer.

- Explicitly tagged: 193/269 (72%)
- Tagged or named in text: 214/269 (80%)
- Not covered: 55. See [FAQ Coverage Gaps](faq-coverage-gaps.md).

Coverage Score: 25/30

## Organization Quality

- Logical categorization: ✓
- Progressive difficulty: ✓ (each category moves from easy to hard)
- No duplicates: ✓ (the 80% similarity check flagged only "What is the difference between ..." in two unrelated questions, a false positive)
- Clear questions: ✓ (every question ends with ?)

Organization Score: 20/20

## Overall Quality Score: 90/100

- Coverage: 25/30
- Bloom's Distribution: 20/25
- Answer Quality: 25/25
- Organization: 20/20

## Recommendations

### High Priority
1. Add questions for the most-depended-on uncovered concepts: Measurement Scale (9), Semiconductor (7), Electromagnetic Spectrum (5), Coordinate System (5), Condensation (4), Shell Command (3), Capacitive Sensing (2), Thermoelectric Effect (2), Photoelectric Effect (2), Liquid In Glass Thermometer (2).
2. Add more Remember-level questions to Technical Details if you want an even tighter match to the target.

### Medium Priority
1. Answers are close to the lower length limit. A few could take an extra example.
2. As chapters are revised, re-check answers that quote numbers, such as the Saffir-Simpson thresholds and the sustained-wind windows.

### Low Priority
1. Add a Grading or classroom-use section if this book is adopted in a course.
2. Review question phrasing for searchability once there are chatbot logs.

## Notes

- Chapters 9 and 14 to 17 had cross-reference errors fixed earlier today. The FAQ was written after those fixes.
- The components page lists the solar and seismic sensors as still to be decided, so the hardware answer says so.
