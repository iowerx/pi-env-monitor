# Chapter 01 Content Generation

**Skill:** chapter-content-generator v0.09 | **Mode:** Sequential
**Chapter:** 01-why-we-measure — Why We Measure the Natural Environment
**Start:** 2026-08-25 21:32:37
**End:** 2026-08-25 21:54:43

| Metric | Value |
|--------|-------|
| Reading level | Junior High |
| Words | 5436 |
| Concepts covered | 12/12 |
| Interactive elements | 4 |
| Admonitions | 6 |
| TODO removed | yes |
| mkdocs build --strict | passes |

## Interactive Elements Specified

| sim-id | Type | Library | Bloom |
|--------|------|---------|-------|
| observation-or-measurement-sorter<br/> | microsim | p5.js | Evaluate (L5) / judge |
| monitoring-station-anatomy<br/> | infographic | p5.js | Remember (L1) / identify |
| atmospheric-layers-explorer<br/> | microsim | p5.js | Understand (L2) / interpret |
| weather-versus-climate-explorer<br/> | chart | Chart.js | Analyze (L4) / distinguish |

Reuse decisions: 0 reused, 0 from template, 4 newly specified (reuse service unavailable this session).

## Notes

- Chapter 1 opens with a hands-on three-bowl water experiment rather than a definition, matching the junior-high guidance to lead with concrete experience.
- The weather-versus-climate chart specification fixes the y-axis across all three time windows deliberately; auto-scaling would destroy the comparison the element exists to teach.
- The atmospheric-layers explorer specifies linear scale first so the thinness of the troposphere lands as a surprise before the stretched view is offered.
- No mascot admonitions: no CONTENT-GENERATION-GUIDE.md exists, so the v0.09 Chapter 1 mascot self-introduction requirement does not apply.
