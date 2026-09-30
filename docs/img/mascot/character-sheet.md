# Character Sheet: Mecha the Clockwork Owl

The canonical identity document for Mecha, the pedagogical mascot for the
**Raspberry Pi Environmental Monitoring: Grades 6–12** textbook. Every pose
prompt and every piece of AI-generated content involving this character must
re-anchor to the description below — it is the source of truth for visual
and voice consistency.

## Identity

- **Name:** Mecha
- **Species:** Clockwork mechanical owl — a brass-and-silver automaton owl
  (visual basis: the reference photo `docs/img/bubo.png`, reinterpreted as an
  original, friendly flat-vector cartoon)
- **Subject:** Building a Raspberry Pi station that measures temperature,
  pressure, humidity, solar radiation, wind, and ground motion, then logs,
  charts, and reports the data from the field
- **Catchphrase:** "Let's take a reading!"
- **Pronouns:** Always refer to Mecha by name or as "they/them"

## Visual Description

- **Body color:** Polished gold/brass head, wings, legs, and tail — hex
  `#F2B632` (highlight `#FFE7A0`, shadow `#B7791F`) — with a silver chest of
  overlapping scalloped metal feathers — hex `#C9D0D8` (highlight `#FBFCFD`,
  shadow `#8C96A1`), with an occasional gold feather mixed in
- **Accent color:** Indigo `#3F51B5` and orange `#FF9800`, the book's own
  theme palette, used for the round **sensor badge** on Mecha's chest (an
  indigo disc in a gold ring with a glowing orange LED at its center)
- **Clothing / accessories:** No clothing. Mecha's signature features are:
  the chest sensor badge; two very large round silver "lens" eyes set in
  gold rims, each with a steel aperture ring of fine clockwork spokes, a
  white eye, and a warm red-orange iris (`#FF8A50` → `#C62828`) with faint
  spokes and white highlights; a pointed gold beak; layered gold scalloped
  crown feathers; small soft ear tufts; gold feather brows; segmented gold
  legs with dark banded joints and steel-tipped talons; a fan of gold tail
  feathers
- **Expression:** Wide-eyed, curious, and friendly, with soft pink blush
  under the eyes — never menacing or robotic-cold
- **Size proportion:** Compact and upright, big head and eyes relative to the
  body, readable as an icon at roughly 90px
- **Art style:** Modern flat vector illustration, clean bold dark outlines
  (`#2B2622`), soft gradient shading, transparent background

## Personality

- Observant — watches the sky, the ground, and the gauges, and notices small
  changes before anyone else
- Precise — cares about units, timestamps, and calibration, but explains
  them simply
- Patient — treats loose wires, bad readings, and crashed scripts as clues,
  not failures
- Curious — always wants to know *why* a number changed, not just that it did

## Voice

- Uses short, clear, encouraging sentences pitched at grades 6–12
- Connects every idea back to measuring something real ("Let's check what
  the sensor says")
- Refers to readers as "observers" or "station builders"
- Signature phrases: "Let's take a reading!", "Every number tells a story.",
  "Check the data, then check it again."

## Pose Set

| Pose | Filename | Use |
|------|----------|-----|
| Neutral | `neutral.png` | General-purpose / sidebars |
| Welcome | `welcome.png` | Chapter openings |
| Thinking | `thinking.png` | Key concepts |
| Tip | `tip.png` | Hints and helpful guidance |
| Warning | `warning.png` | Common mistakes / pitfalls |
| Encouraging | `encouraging.png` | Difficult content / struggle |
| Celebration | `celebration.png` | End of chapter / achievements |

The current images were drawn programmatically as flat-vector SVG and
rendered to transparent PNGs by `scripts/generate-mecha-mascot.py`; rerun it
to regenerate or tweak any pose. See [`image-prompts.md`](image-prompts.md)
for the full text of each pose prompt if you want to regenerate the set with
an AI image tool instead. The base description embedded in every pose prompt
must match this character sheet exactly.

## Why This Mascot

An owl is the classic watcher of the natural world, and a *clockwork* owl
turns that watcher into an instrument: its huge lens eyes are cameras and
gauges, its brass body is built from parts, and the sensor badge on its chest
is a tiny weather station of its own — exactly what students assemble in
this book. The gold-and-silver automaton look comes from the reference photo
in `docs/img/bubo.png`, softened into an original, friendly cartoon for
middle and high school readers, and the indigo and orange badge ties Mecha
to the book's theme palette without recoloring the metal body.
