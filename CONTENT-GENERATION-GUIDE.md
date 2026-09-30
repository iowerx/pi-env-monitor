# Content Generation Guide

Guidance for generating student-facing content (chapters, lesson plans,
quizzes, FAQ, and similar) for **Raspberry Pi Environmental Monitoring:
Grades 6–12**. Teacher- and instructor-facing content does not need to use
the mascot.

## Learning Mascot: Mecha the Clockwork Owl

### Mascot File Index

The canonical files for this mascot. When editing any of these, update the
others in the same turn so they stay in sync.

| File | Purpose |
|------|---------|
| [`docs/img/mascot/character-sheet.md`](docs/img/mascot/character-sheet.md) | Canonical identity document (name, species, colors, voice). Source of truth. |
| [`docs/img/mascot/image-prompts.md`](docs/img/mascot/image-prompts.md) | Self-contained AI prompts for regenerating each pose. |
| [`docs/img/mascot/neutral.png`](docs/img/mascot/neutral.png) | Default / general-purpose pose. |
| [`docs/img/mascot/welcome.png`](docs/img/mascot/welcome.png) | Chapter-opening pose. |
| [`docs/img/mascot/thinking.png`](docs/img/mascot/thinking.png) | Key-concept pose. |
| [`docs/img/mascot/tip.png`](docs/img/mascot/tip.png) | Hint / helpful-guidance pose. |
| [`docs/img/mascot/warning.png`](docs/img/mascot/warning.png) | Common-mistake / pitfall pose. |
| [`docs/img/mascot/encouraging.png`](docs/img/mascot/encouraging.png) | Difficult-content / struggle pose. |
| [`docs/img/mascot/celebration.png`](docs/img/mascot/celebration.png) | End-of-chapter / achievement pose. |
| [`docs/css/mascot.css`](docs/css/mascot.css) | Custom admonition styles for the seven pose contexts. |
| [`docs/learning-graph/mascot-test.md`](docs/learning-graph/mascot-test.md) | Rendering test page that exercises every admonition style. |
| [`scripts/generate-mecha-mascot.py`](scripts/generate-mecha-mascot.py) | Draws and renders all seven pose PNGs (flat-vector SVG → trimmed 400 px RGBA). |

### Character Overview

- **Name**: Mecha (always "Mecha" or "they/them" — never "he" or "she")
- **Species**: Clockwork mechanical owl
- **Personality**: Observant, precise, patient, curious
- **Catchphrase**: "Let's take a reading!"
- **Visual**: A gold/brass owl automaton with a silver scalloped chest, huge
  round silver lens eyes with clockwork spokes and warm red-orange irises,
  and an indigo sensor badge with an orange LED on the chest

### Voice Characteristics

- Uses short, clear, encouraging sentences pitched at grades 6–12
- Connects every idea back to measuring something real ("Let's check what
  the sensor says")
- Refers to readers as "observers" or "station builders"
- Treats bad readings, loose wires, and crashed scripts as clues, not failures
- Signature phrases: "Let's take a reading!", "Every number tells a story.",
  "Check the data, then check it again."

### Mascot Admonition Format

Always place mascot images in the admonition body, never in the title bar.
Chapter pages live at `docs/chapters/NN-slug/index.md`, so the image path is
`../../img/mascot/`:

    !!! mascot-welcome "Title Here"
        ![Mecha waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
        Admonition text goes here after the image.

### Placement Rules

| Context | Admonition Type | Image | Frequency |
|---------|----------------|-------|-----------|
| General note / sidebar | `mascot-neutral` | `neutral.png` | As needed |
| Chapter opening | `mascot-welcome` | `welcome.png` | Every chapter |
| Key concept | `mascot-thinking` | `thinking.png` | 2-3 per chapter |
| Helpful tip | `mascot-tip` | `tip.png` | As needed |
| Common mistake | `mascot-warning` | `warning.png` | As needed |
| Difficult content | `mascot-encouraging` | `encouraging.png` | Where students may struggle |
| Section completion | `mascot-celebration` | `celebration.png` | End of major sections |

### Do's and Don'ts

**Do:**

- Use Mecha to introduce new topics warmly
- Include the catchphrase in welcome admonitions
- Keep dialogue brief (1-3 sentences)
- Match the pose/image to the content type
- Tie Mecha's remarks to the chapter's actual measurement, sensor, or data

**Don't:**

- Use Mecha more than 5-6 times per chapter
- Put mascot admonitions back-to-back
- Use the mascot for purely decorative purposes
- Change Mecha's personality or speech patterns
- Use gendered pronouns for Mecha
