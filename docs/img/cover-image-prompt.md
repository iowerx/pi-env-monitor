# Cover Image Prompt

Please generate a professional-quality cover image for this textbook.
This image will be used in social media previews and must follow the
formatting guidelines for an Open Graph image preview.

**Required specifications:**

- Format: PNG
- Wide-landscape format
- Size: 1200x630 pixels (1.91:1 aspect ratio)
- This is the Open Graph standard for social media previews

The image has four layers, back to front: background montage, color
treatment, mascot, and title text.

## Subject & Tone

*Raspberry Pi Environmental Monitoring: Grades 6–12* is a hands-on textbook
in which students build a Raspberry Pi weather and environment station that
measures temperature, barometric pressure, humidity, sunlight, wind, and
ground motion. Students log the data, chart it, and send it in from the
field. The intended audience is middle and high school students (ages
11–18) and their teachers, most of whom are new to electronics and
programming. The visual tone should be **bright, outdoorsy, and hands-on**.
It should feel like a sunny field day with real instruments, inviting a
curious 12-year-old in. It should not look like a corporate tech ad or a
dark "hacker" aesthetic.

## Title

Place the title in the center of the image on two lines:

- Line 1 (large, bold): **Raspberry Pi Environmental Monitoring**
- Line 2 (smaller, about 40% of line 1's height): **Grades 6–12**

Use a clean, highly legible, rounded sans-serif font. Use white text with a
subtle drop shadow over a soft, semi-transparent deep indigo (#3F51B5)
rounded-rectangle scrim, so the title stays readable against the busy
montage. Line 1 is long. Do not shrink it to fit. Instead, keep the area
directly behind the title calm and uncluttered. Spell every word exactly as
written, including the en dash in "6–12".

## Background Montage

Arrange a montage of the following 10 concepts around the title. Draw each
one in the same flat-vector illustration style (see Style below), so the
composition reads as one image rather than a collage of unrelated styles:

1. **Monitoring station on a pole**: a small field station on a grey metal
   mast, with a three-cup orange anemometer on top, a white stacked-plate
   radiation shield (like a stack of upside-down saucers) on an arm, a
   tilted dark-blue solar panel, and a grey weatherproof box at the base,
   standing on a grassy patch
2. **Raspberry Pi board**: a green single-board computer with its row of
   gold GPIO header pins and four colored jumper wires (red, black, yellow,
   blue) running to a tiny purple sensor breakout board (the BME280)
3. **Torricelli's barometer**: a tall glass tube of the color silver mercury turned
   upside down in a dish, with a small empty gap at the sealed top. A small
   mountain peak (the Puy de Dôme) sits faintly behind it. Make the liquid in the tube shiny silver mercury, filling about
    three-quarters of the tube, with a clearly empty gap at the sealed top; the
    dish also holds silver mercury.
4. **Thermometer with three scales**: a classic glass thermometer with a red
   column and two side-by-side tick scales, labeled only "°F", "°C". The scale should go from 0 to 100 Celsius.
5. **Sun and daily sunlight curve**: a bright cartoon sun above a smooth
   orange bell-shaped line on a simple chart, rising from dawn to a noon
   peak and falling to dusk
6. **Wind**: an orange-and-white striped windsock blowing straight out,
   with a few curved motion lines and a tree bending slightly
7. **Ground-motion trace**: a seismograph strip of paper with a squiggly
   line that is calm, then a burst of tall spikes, then calm again
8. **GPS satellite**: a small satellite in the upper sky, with three
   overlapping translucent circles on the ground below meeting at a single
   map pin
9. **Live data chart**: a tablet or laptop screen showing two smooth
   time-series lines (an orange temperature line and a blue humidity line)
   over a 24-hour axis
10. **Cellular telemetry**: a small antenna on the station sending curved
    signal arcs up toward a simple cloud icon

Spread the elements in a loose ring around the central title. Use small
weather details as connective tissue between them: a few clouds, a
raindrop or two, and a dashed wind line.

## Mascot

Place the book's mascot, **Mecha the Clockwork Owl**, in the lower-left
corner. Size Mecha at about one third of the image height so they do not
overlap the title text. Mecha is waving hello with one wing raised.

Mecha is a friendly, compact, upright clockwork mechanical owl drawn as a
modern flat-vector cartoon with clean bold dark outlines (#2B2622) and soft
gradient shading:

- Polished gold/brass head, wings, legs, and tail (#F2B632, highlight
  #FFE7A0, shadow #B7791F)
- A silver chest of overlapping scalloped metal feathers (#C9D0D8), with an
  occasional gold feather mixed in
- A round **sensor badge** on the chest: an indigo (#3F51B5) disc in a gold
  ring with a glowing orange (#FF9800) LED at its center
- Two very large round silver "lens" eyes set in gold rims. Each eye has a
  steel aperture ring of fine clockwork spokes, a white eye, and a warm
  red-orange iris
- A pointed gold beak, layered gold scalloped crown feathers, small soft
  ear tufts, and gold feather brows
- Segmented gold legs with dark banded joints and steel-tipped talons, and
  a fan of gold tail feathers
- A wide-eyed, curious, friendly expression with soft pink blush under the
  eyes. Never menacing or robotic-cold
- A big head and eyes relative to the body. No clothing

If your tool accepts reference images, attach `docs/img/mascot/welcome.png`
and match it exactly.

## Optional Reference Images

These real MicroSim screenshots from the book are good style and content
references for the montage, if your tool accepts image uploads:

- `docs/sims/monitoring-station-anatomy/monitoring-station-anatomy.png`
  (station on a pole)
- `docs/sims/torricelli-puy-de-dome/torricelli-puy-de-dome.png`
  (barometer and mountain)
- `docs/sims/three-scales-thermometer/three-scales-thermometer.png`
- `docs/sims/solar-irradiance-day-explorer/solar-irradiance-day-explorer.png`
- `docs/sims/gps-trilateration-explorer/gps-trilateration-explorer.png`
- `docs/sims/gpio-pinout-explorer/gpio-pinout-explorer.png`

Use them for subject matter and the flat, friendly look only. Do not copy
their UI chrome, sliders, or text panels into the cover.

## Style & Composition

- **Illustration style:** modern flat vector illustration with clean bold
  outlines and soft gradient shading, the same style as the mascot. Apply
  it to every montage element.
- **Color palette:** a light sky-blue background (#E3F2FD fading to white
  near the horizon) with a soft green grassy strip along the bottom edge.
  Indigo (#3F51B5) is the primary accent and orange (#FF9800) the secondary
  accent. Mecha's brass gold (#F2B632) is a warm highlight.
- **Lighting/mood:** bright, clear-day daylight. Optimistic and curious.
- **Composition:** the title is centered. Montage elements sit in a loose
  ring around it, with the monitoring station strongest on the right and
  the sky elements (sun, satellite, cloud) along the top. Mecha is in the
  lower left. Leave generous calm negative space directly behind the title.

## Avoid

- Dense paragraphs of illegible text anywhere in the image. The only text
  should be the title, the subtitle, and the tiny "°F / °C / K" labels.
- Any other words, fake code, or gibberish labels on screens, boards, or
  charts.
- Generic stock-photo clichés: handshakes, isolated lightbulbs, people
  pointing at whiteboards, glowing circuit-board brains.
- Photorealistic human faces. If you include any people, make them small,
  friendly flat-vector students in the background, and optional.
- Dark, neon, or "cyber" color schemes.
- Montage elements that overlap or compete with the title.
- Changing Mecha's colors, adding clothing, or making Mecha look like a
  real bird or a cold robot.
