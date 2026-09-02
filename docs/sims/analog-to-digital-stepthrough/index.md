---
title: Analog to Digital Conversion Step-Through
description: Step one sample at a time through a smooth signal becoming a sequence of numbers, with the true value, the code it rounds to, and the error all on screen at once.
image: /sims/analog-to-digital-stepthrough/analog-to-digital-stepthrough.png
og:image: /sims/analog-to-digital-stepthrough/analog-to-digital-stepthrough.png
twitter:image: /sims/analog-to-digital-stepthrough/analog-to-digital-stepthrough.png
social:
   cards: false
quality_score: 0
---

# Analog to Digital Conversion Step-Through

<iframe src="main.html" height="592px" width="100%" scrolling="no"></iframe>

[Run the Analog to Digital Conversion Step-Through MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students routinely fold sampling and quantizing into one vague idea called "digitizing".
They are two different losses with two different consequences, and this sim separates them
into two independently adjustable controls applied to the same waveform.

Three stacked panels show the same signal three ways:

1. **The analog signal** - smooth, continuous, infinitely detailed.
2. **Sampling** - the same curve, but the converter only looks at it at these instants.
3. **Quantizing** - each of those samples forced onto the nearest level *below* it, drawn
   as a stair-step against the quantization gridlines.

Stop on any sample and the panel gives you three numbers side by side: the exact analog
value, the code it rounds to out of however many levels the bit depth allows, and the
difference. Those three numbers *are* the explanation. A rolling table of the last eight
samples shows the pattern of errors rather than one instance of it.

Two settings are there to make a point:

- **2 bits** gives four levels and a stair-step so absurdly coarse the idea becomes
  unmissable.
- **Step change** with a low sample rate puts the event *between* two samples, and the sim
  reports the actual gap: the signal changed at 4.3 s, the last sample was at 4.00 s, the
  next was at 4.50 s, and nothing at all was recorded in between. **Sampling loses time,
  not just value.**

## How to Use

- Press **Next sample** and **Previous sample** to walk the cursor along. **Play** advances
  slowly; press it again to stop wherever you like.
- Set **Bits** to 2 and look at panel 3. Then set it to 16 and look again.
- Drag the **Samples** slider down to 5 or 6 and watch the stair-step lose the shape of the
  curve entirely.
- Choose the **step change** waveform, drop the sample rate, and read the message in the
  panel. Change the sample rate and watch the reported gap change with it.
- Try **noisy signal**: the noise is fixed, not re-rolled, so stepping back and forth gives
  the same value every time.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://iowerx.github.io/pi-env-monitor/sims/analog-to-digital-stepthrough/main.html"
        height="592px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
6-12

### Duration
20-25 minutes

### Bloom's Taxonomy Level
Understand (L2)

### Prerequisites
- Reading a value off a graph
- Chapter 4 sections on what a sensor produces

### Activities

1. **Exploration (6 min)**: Leave the waveform on slow sine. Change the bit depth from 2 to 16 one step at a time and describe in one sentence what changes and what does not.
2. **Guided practice (8 min)**: Set bits to 8 and step through ten samples. Copy the error column into your notes. Is the error ever zero? Is it ever positive? Explain why.
3. **Analysis (8 min)**: Switch to step change with 10 samples. Read the message. Now raise the sample rate until the gap around the event is under a tenth of a second. What did that cost you, in readings per second?

### Assessment
- Distinguishes a loss caused by sampling from a loss caused by quantizing.
- Explains why quantization error is never positive with a floor-based converter.
- States what raising the sample rate buys and what it costs.

## References

1. [Wikipedia: Analog-to-digital converter](https://en.wikipedia.org/wiki/Analog-to-digital_converter)
2. [Wikipedia: Nyquist-Shannon sampling theorem](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem) - how fast is fast enough.
3. [Wikipedia: Quantization (signal processing)](https://en.wikipedia.org/wiki/Quantization_(signal_processing))
4. [Analog Devices, *Data Conversion Handbook*](https://www.analog.com/en/resources/technical-books/data-conversion-handbook.html) - the reference treatment of both losses.
