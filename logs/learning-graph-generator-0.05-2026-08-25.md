# Session Log: learning-graph-generator v0.05

**Date:** 2026-08-25
**Skill:** learning-graph-generator, version 0.05
**Project:** Raspberry Pi Environmental Monitoring: Grades 6-12
**Working directory:** `/home/hank/Studio/pi-env-monitor`
**Skill source:** `/home/hank/.claude/skills/learning-graph-generator`

## Tool Versions

| Tool | Version | Notes |
|------|---------|-------|
| Python | 3.12.3 | System interpreter |
| `csv-to-json.py` | 0.04 | Declared `VERSION` constant in the script |
| `analyze-graph.py` | unversioned | md5 `f40b3060` — script declares no VERSION constant |
| `taxonomy-distribution.py` | unversioned | md5 `af4dc144` |
| `validate-learning-graph.py` | unversioned | md5 `bc0c65fa` |
| `jsonschema` | installed during this session | Was absent; validation failed until installed |

Scripts were copied from the skill package into `docs/learning-graph/` and run
from that directory, per the skill instructions.

## Step Log

### Step 0: Setup

Created `docs/learning-graph/`. Copied `add-taxonomy.py`, `analyze-graph.py`,
`csv-to-json.py`, `taxonomy-distribution.py`, `validate-learning-graph.py`,
`validate-learning-graph.sh`, and `learning-graph-schema.json` from the skill
package. `docs/` and `mkdocs.yml` were both present, so no template clone was
needed.

### Step 1: Course Description Quality Assessment

`docs/course-description.md` had no YAML frontmatter, so no cached
`quality_score` existed and the full assessment was run.

- **Score: 96/100 — Excellent, ready for generation.**
- Deductions: hardware unspecified for wind, solar, and seismic in
  `components.md` (-2); Bloom's outcomes written as dense single bullets rather
  than separate list items (-2).
- Wrote `docs/learning-graph/course-description-assessment.md`.
- Added `title` / `description` / `quality_score: 96` frontmatter to
  `docs/course-description.md`.
- Estimated concept capacity: 260–280. Actual generated: 269.

### Step 2: Generate Concept Labels

Generated **269 concepts**, above the 200 default but well under the 500 ceiling.
The higher count is justified by seven distinct measurement domains, each with
its own history, physics, units, and instrument lineage, plus a full hardware and
software stack. 269 concepts across the 19 proposed chapters averages ~14 per
chapter, inside `book-chapter-generator`'s optimal 12–18 band.

All labels are Title Case, 32 characters or fewer, and entity names rather than
questions. Wrote `docs/learning-graph/concept-list.md`.

### Step 3: Generate Dependency Graph

Wrote `docs/learning-graph/learning-graph.csv` with columns
`ConceptID,ConceptLabel,Dependencies,TaxonomyID`. The TaxonomyID column was
populated in this pass rather than in a separate Step 6 run, so
`add-taxonomy.py` was not used.

### Step 4: Quality Validation

First run of `analyze-graph.py` returned a valid DAG but flagged two structural
weaknesses on review:

1. Only **2 foundational concepts**, meaning nearly every path funnelled through
   `Physical Property`.
2. A **linear chain** in the charting cluster: Line Chart → Axis Labeling →
   Scatter Plot → Correlation, which inflated the longest path to 15.

Applied seven dependency corrections:

| ConceptID | Concept | Change | Reason |
|---|---|---|---|
| 39 | Atmosphere | → root | An atmosphere is not a kind of physical property |
| 110 | Electromagnetic Spectrum | → root | Roots the radiation cluster |
| 148 | Fault | → root | Geological primitive, not derived from measurement theory |
| 181 | Single Board Computer | → root | Removes an odd `depends on Voltage` edge |
| 165 | Coordinate System | `2\|3` → `3\|21` | A coordinate system is a standardized convention |
| 228 | Scatter Plot | `4\|229` → `4\|218` | Break the charting chain |
| 229 | Axis Labeling | `6\|227` → `6\|227\|228` | Axis labeling now depends on both chart types |

Re-ran `analyze-graph.py`. Final metrics: valid DAG, 0 cycles, 0 self-dependencies,
0 orphaned nodes, 1 connected component, 6 foundational concepts, 78 terminal
nodes (29.0%), longest chain 14, average 1.76 prerequisites per concept.

Appended a **Learning Graph Quality Score of 89/100 (Good)** to
`quality-metrics.md`, with the main deduction against the Wind cluster being
modeled hub-and-spoke off `Wind Speed` (indegree 11) rather than layered.

### Step 5: Concept Taxonomy

Created **15 categories** (skill target ~12 ± 2–3). Each of the seven measured
quantities got its own category so that its history, physics, units, and
instruments stay together — this mirrors the chapter plan. Wrote
`docs/learning-graph/concept-taxonomy.md`.

### Step 5b: Taxonomy Names JSON

Wrote `docs/learning-graph/taxonomy-names.json` mapping all 15 IDs to
human-readable names. Verified after generation that no group in
`learning-graph.json` fell back to showing its raw ID as `classifierName`.

### Step 6: Add Taxonomy to CSV

Already completed in Step 3. No `MISC` category was needed — every concept has a
clear home.

### Step 7: Metadata Section

Wrote `docs/learning-graph/metadata.json` with title, description, creator
(`Hank R.`, from git config), date `2026-08-25`, version 1.0, schema URL, and
CC BY-NC-SA 4.0 DEED.

### Step 8: Groups Section

Wrote `docs/learning-graph/color-config.json` assigning the 15 taxonomies to the
first 15 colors of the v0.04 recommended 24-color palette, in legend order, so
the assignment is stable across regenerations. Font colors were auto-assigned by
`csv-to-json.py` based on background lightness.

### Step 9: Generate learning-graph.json

```
python3 csv-to-json.py learning-graph.csv learning-graph.json \
        color-config.json metadata.json taxonomy-names.json
```

Output: 15 groups, 269 nodes, 463 edges, 6 foundational concepts.

**Schema validation initially failed** — `validate-learning-graph.sh` reported
`jsonschema library not found`. Installed `jsonschema` via pip and re-ran:

```
./validate-learning-graph.sh learning-graph.json
✓ Validation successful!
```

### Step 10: Taxonomy Distribution Report

**First run omitted the taxonomy names argument**, and the report rendered raw
IDs (`DATA`, `TEMP`, `WIND`) in the Category column, with only `FOUND` resolving
via the script's built-in default map. Re-ran with the third argument:

```
python3 taxonomy-distribution.py learning-graph.csv taxonomy-distribution.md taxonomy-names.json
```

Names now render correctly. Distribution: 22 max (Data Logging And Analysis,
8.2%) to 15 min (Humidity And Dew Point, Field Deployment And Power, 5.6%) — a
2.6% spread, with nothing near the 30% ceiling.

**Note for the skill author:** the Step 10 command in SKILL.md does not mention
the optional `taxonomy_names.json` third argument, unlike Step 9. Adding it would
prevent this same raw-ID bug that Step 5b exists to prevent for the JSON.

### Step 11: Index Page

Rewrote `docs/learning-graph/index.md` from `index-template.md`, replacing
`TEXTBOOK_NAME` and updating the template's hardcoded figures (it says "10 entry
points" and "approximately 12 categories") to this graph's actual 6 and 15.
Added an at-a-glance metrics table and a note on edge direction.

### MkDocs Navigation

Uncommented and populated the `Learning Graph` nav block in `mkdocs.yml` with all
five generated pages.

## Files Created or Modified

**Created:**

- `docs/learning-graph/course-description-assessment.md`
- `docs/learning-graph/concept-list.md`
- `docs/learning-graph/concept-taxonomy.md`
- `docs/learning-graph/learning-graph.csv`
- `docs/learning-graph/learning-graph.json`
- `docs/learning-graph/taxonomy-names.json`
- `docs/learning-graph/color-config.json`
- `docs/learning-graph/metadata.json`
- `docs/learning-graph/quality-metrics.md`
- `docs/learning-graph/taxonomy-distribution.md`
- `logs/learning-graph-generator-0.05-2026-08-25.md`

**Modified:**

- `docs/course-description.md` (added YAML frontmatter with quality_score)
- `docs/learning-graph/index.md` (rewritten from template)
- `mkdocs.yml` (Learning Graph nav section)

**Copied into the repo from the skill package:** `add-taxonomy.py`,
`analyze-graph.py`, `csv-to-json.py`, `taxonomy-distribution.py`,
`validate-learning-graph.py`, `validate-learning-graph.sh`,
`learning-graph-schema.json`. `add-taxonomy.py` was copied but not used.

## Open Items For the Next Session

1. **Review the 269 concept labels before running `book-chapter-generator`.**
   Adding or removing concepts after chapter content exists is expensive.
2. **Wind cluster structure.** `Wind Speed` has indegree 11 as a flat hub. If the
   wind chapter reads as a list rather than a progression, restructure it into
   layers the way PRESS and HUMID are built.
3. **`components.md` still has TBDs.** Solar and seismic parts are unchosen and
   there is no wind sensor entry at all, yet SOLAR, SEIS, and WIND together
   account for 53 concepts. A cup anemometer needs GPIO pulse counting rather
   than I2C, which would add concepts to the HW cluster.
4. The 19 draft chapter titles in `docs/chapters/index.md` were written before
   this graph existed and have not been validated against it.
