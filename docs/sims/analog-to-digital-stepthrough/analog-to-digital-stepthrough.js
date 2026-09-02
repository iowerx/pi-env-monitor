// Analog to Digital Conversion Step-Through MicroSim
// CANVAS_HEIGHT: 590
// Bloom Level: Understand (L2) - the learner explains how a smooth signal becomes
// a sequence of numbers, and separates what sampling loses (time) from what
// quantization loses (value).
// Step-through, not animation. A learner has to be able to stop on one sample and
// read its true value, its quantized value and the difference between them. Those
// three numbers side by side ARE the explanation; motion would hide the arithmetic.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 215;

const NARROW_BREAKPOINT = 700;

// ---- controls ----
let waveSelect, bitsSelect, rateSlider;
let prevButton, nextButton, playButton;

// ---- model ----
const T_WINDOW = 10.0;        // seconds shown across the plot
const V_MAX = 3.3;            // full-scale input of the converter
const STEP_TIME = 4.3;        // when the "cold front" arrives, in seconds

// named cursorIdx, not cursor: p5 has a global cursor() and overwrites any
// window-level binding of that name when the sketch starts
let cursorIdx = 0;               // index of the sample under inspection
let playing = false;
let playTimer = 0;
let noiseTable = [];          // fixed so stepping back and forth is repeatable

const WAVES = {
  'slow sine':   { cycles: 1, label: 'slow sine (like a daily temperature cycle)' },
  'fast sine':   { cycles: 4, label: 'fast sine' },
  'step change': { cycles: 0, label: 'step change (like a cold front arriving)' },
  'noisy':       { cycles: 1, label: 'noisy signal' }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  // A fixed pseudo-random table, not random() per frame: the noisy waveform has
  // to give the same value every time the learner steps back onto a sample.
  let seed = 20260902;
  for (let i = 0; i < 4096; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const u1 = (seed / 2147483648) || 0.5;
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const u2 = (seed / 2147483648) || 0.5;
    noiseTable.push(sqrt(-2 * Math.log(u1 + 1e-9)) * cos(TWO_PI * u2));
  }

  waveSelect = createSelect();
  Object.keys(WAVES).forEach(function (k) { waveSelect.option(k); });
  waveSelect.selected('slow sine');
  waveSelect.changed(function () { cursorIdx = 0; });

  bitsSelect = createSelect();
  [2, 4, 8, 12, 16].forEach(function (b) { bitsSelect.option(String(b)); });
  bitsSelect.selected('8');

  rateSlider = createSlider(1, 100, 20, 1);

  prevButton = createButton('Previous sample');
  prevButton.mousePressed(function () { playing = false; playButton.html('Play'); cursorIdx = max(0, cursorIdx - 1); });
  nextButton = createButton('Next sample');
  nextButton.mousePressed(function () { playing = false; playButton.html('Play'); cursorIdx = min(sampleCount() - 1, cursorIdx + 1); });
  playButton = createButton('Play');
  playButton.mousePressed(function () {
    playing = !playing;
    playButton.html(playing ? 'Pause' : 'Play');
  });

  layoutControls();

  describe('Three stacked panels showing one waveform three ways: the smooth analog ' +
           'signal, the same signal with its sample instants marked, and the ' +
           'quantized stair-step that a converter actually produces. Stepping one ' +
           'sample at a time reports the exact analog value, the code it rounds to, ' +
           'and the error, and a rolling table shows the last eight samples so the ' +
           'pattern of errors is visible.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 80;
  waveSelect.position(90, r1);
  waveSelect.size(150);
  bitsSelect.position(295, r1);
  bitsSelect.size(60);
  rateSlider.position(sliderLeftMargin, r2 + 4);
  rateSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  prevButton.position(10, r3);
  nextButton.position(122, r3);
  playButton.position(212, r3);
}

// ---- signal model -------------------------------------------------------

function sampleCount() {
  return rateSlider.value();
}

function analogAt(t) {
  const kind = waveSelect.value();
  if (kind === 'step change') return t < STEP_TIME ? 0.75 : 2.55;
  const cyc = WAVES[kind].cycles;
  let v = 1.65 + 1.35 * sin(TWO_PI * cyc * t / T_WINDOW);
  if (kind === 'noisy') {
    // index the fixed table by time so the same t always gives the same noise
    const i = floor((t / T_WINDOW) * 2000) % noiseTable.length;
    v += noiseTable[i] * 0.18;
  }
  return constrain(v, 0, V_MAX - 1e-6);
}

function levels() {
  return Math.pow(2, parseInt(bitsSelect.value(), 10));
}

function codeFor(v) {
  return constrain(floor((v / V_MAX) * levels()), 0, levels() - 1);
}

function quantized(v) {
  return codeFor(v) * (V_MAX / levels());
}

function sampleTime(i) {
  const n = sampleCount();
  return n === 1 ? 0 : (i / n) * T_WINDOW;
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  const n = sampleCount();
  if (cursorIdx > n - 1) cursorIdx = n - 1;

  if (playing) {
    playTimer -= deltaTime;
    if (playTimer <= 0) {
      playTimer = 420;
      cursorIdx = (cursorIdx + 1) % n;
    }
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  fill('black');
  textAlign(CENTER, TOP);
  textSize(narrow ? 18 : 24);
  text('Analog to Digital Conversion', canvasWidth / 2, narrow ? 10 : 8);

  let plotsBox, tableBox;
  if (narrow) {
    plotsBox = { x: margin, y: 36, w: canvasWidth - 2 * margin, h: 258 };
    tableBox = { x: margin, y: 300, w: canvasWidth - 2 * margin, h: drawHeight - 314 };
  } else {
    const pw = floor(canvasWidth * 0.58);
    plotsBox = { x: margin, y: 42, w: pw - margin, h: drawHeight - 62 };
    tableBox = { x: pw + 8, y: 42, w: canvasWidth - margin - pw - 8, h: drawHeight - 62 };
  }

  const ph = (plotsBox.h - 16) / 3;
  drawAnalogPanel({ x: plotsBox.x, y: plotsBox.y, w: plotsBox.w, h: ph });
  drawSamplePanel({ x: plotsBox.x, y: plotsBox.y + ph + 8, w: plotsBox.w, h: ph });
  drawDigitalPanel({ x: plotsBox.x, y: plotsBox.y + 2 * ph + 16, w: plotsBox.w, h: ph });
  drawReadouts(tableBox, narrow);
  drawControlLabels();
}

function vy(box, v) {
  return map(v, 0, V_MAX, box.y + box.h - 12, box.y + 20);
}
function tx(box, t) {
  return map(t, 0, T_WINDOW, box.x + 6, box.x + box.w - 6);
}

function panelFrame(box, title) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 4);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(10);
  text(title, box.x + 6, box.y + 3);
}

function drawAnalogPanel(box) {
  panelFrame(box, '1.  The analog signal - smooth, continuous, infinitely detailed');
  noFill();
  stroke('#1565c0');
  strokeWeight(2);
  beginShape();
  for (let px = 0; px <= box.w - 12; px++) {
    const t = (px / (box.w - 12)) * T_WINDOW;
    vertex(box.x + 6 + px, vy(box, analogAt(t)));
  }
  endShape();
  markCursor(box);
}

function drawSamplePanel(box) {
  panelFrame(box, '2.  Sampling - the signal is only looked at these instants');
  noFill();
  stroke('#b0bec5');
  strokeWeight(1);
  beginShape();
  for (let px = 0; px <= box.w - 12; px++) {
    const t = (px / (box.w - 12)) * T_WINDOW;
    vertex(box.x + 6 + px, vy(box, analogAt(t)));
  }
  endShape();

  const n = sampleCount();
  for (let i = 0; i < n; i++) {
    const t = sampleTime(i);
    const v = analogAt(t);
    const x = tx(box, t);
    const y = vy(box, v);
    stroke(i === cursorIdx ? '#e65100' : '#78909c');
    strokeWeight(i === cursorIdx ? 2 : 1);
    line(x, box.y + box.h - 12, x, y);
    noStroke();
    fill(i === cursorIdx ? '#e65100' : '#37474f');
    circle(x, y, i === cursorIdx ? 8 : 5);
  }
}

function drawDigitalPanel(box) {
  panelFrame(box, '3.  Quantizing - each sample is forced onto the nearest level below it');
  const L = levels();

  // quantization gridlines, only while there are few enough to see
  if (L <= 32) {
    stroke('#e0e0e0');
    strokeWeight(1);
    for (let k = 0; k <= L; k++) {
      const y = vy(box, k * (V_MAX / L));
      line(box.x + 6, y, box.x + box.w - 6, y);
    }
  }

  const n = sampleCount();
  stroke('#2e7d32');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < n; i++) {
    const t = sampleTime(i);
    const q = quantized(analogAt(t));
    const x0 = tx(box, t);
    const x1 = i === n - 1 ? box.x + box.w - 6 : tx(box, sampleTime(i + 1));
    vertex(x0, vy(box, q));
    vertex(x1, vy(box, q));
  }
  endShape();
  markCursor(box);
}

function markCursor(box) {
  const t = sampleTime(cursorIdx);
  stroke('#e65100');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(tx(box, t), box.y + 12, tx(box, t), box.y + box.h - 6);
  drawingContext.setLineDash([]);
  noStroke();
}

// ---- readouts and rolling table ----------------------------------------

function drawReadouts(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const n = sampleCount();
  const t = sampleTime(cursorIdx);
  const v = analogAt(t);
  const c = codeFor(v);
  const q = quantized(v);
  const err = q - v;
  const L = levels();
  const inner = box.w - 20;
  let y = box.y + 8;

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Sample ' + (cursorIdx + 1) + ' of ' + n + '   at t = ' + nf(t, 1, 3) + ' s', box.x + 10, y);
  y += 16;

  fill('#1565c0');
  textSize(15);
  text('true value: ' + nf(v, 1, 4) + ' V', box.x + 10, y);
  y += 19;
  fill('#2e7d32');
  text('rounds to code ' + c + ' of ' + L, box.x + 10, y);
  y += 19;
  text('= ' + nf(q, 1, 4) + ' V', box.x + 10, y);
  y += 19;
  fill('#c62828');
  text('error: ' + (err >= 0 ? '+' : '') + nf(err, 1, 4) + ' V', box.x + 10, y);
  y += 22;

  // the sampling-loses-time message, computed rather than asserted
  if (waveSelect.value() === 'step change') {
    let before = -1;
    let after = -1;
    for (let i = 0; i < n; i++) {
      const ti = sampleTime(i);
      if (ti <= STEP_TIME) before = ti;
      if (after < 0 && ti > STEP_TIME) after = ti;
    }
    const msg = after < 0
      ? 'The signal changed at ' + STEP_TIME + ' s and no sample was taken after it at all.'
      : 'The signal changed at ' + STEP_TIME + ' s. The last sample before that was at ' +
        nf(before, 1, 2) + ' s and the next was at ' + nf(after, 1, 2) + ' s. Between ' +
        'those moments nothing was recorded. Sampling loses time, not just value.';
    fill('#e65100');
    textSize(11);
    const lines = wrapText(msg, inner, 11);
    text(lines, box.x + 10, y);
    y += lines.split('\n').length * 14 + 6;
  }

  // rolling table of the last eight samples
  fill('#546e7a');
  textSize(11);
  text('The last eight samples', box.x + 10, y);
  y += 15;
  const colW = inner / 4;
  const heads = ['t (s)', 'analog', 'digital', 'error'];
  textSize(narrow ? 9 : 10);
  for (let k = 0; k < 4; k++) {
    fill('#90a4ae');
    textAlign(k === 0 ? LEFT : RIGHT, TOP);
    text(heads[k], box.x + 10 + (k === 0 ? 0 : colW * (k + 1) - 6), y);
  }
  y += 13;
  stroke('#eceff1');
  line(box.x + 8, y - 2, box.x + box.w - 8, y - 2);
  noStroke();

  for (let k = 7; k >= 0; k--) {
    const idx = cursorIdx - k;
    if (idx < 0) continue;
    const ti = sampleTime(idx);
    const vi = analogAt(ti);
    const qi = quantized(vi);
    const ei = qi - vi;
    const isCur = idx === cursorIdx;
    fill(isCur ? '#e65100' : '#455a64');
    textAlign(LEFT, TOP);
    text(nf(ti, 1, 2), box.x + 10, y);
    textAlign(RIGHT, TOP);
    text(nf(vi, 1, 4), box.x + 10 + colW * 2 - 6, y);
    text(nf(qi, 1, 4), box.x + 10 + colW * 3 - 6, y);
    fill(isCur ? '#e65100' : '#c62828');
    text((ei >= 0 ? '+' : '') + nf(ei, 1, 4), box.x + 10 + colW * 4 - 6, y);
    y += 13;
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Waveform:', 10, drawHeight + 22);
  text('Bits:', 253, drawHeight + 22);
  const n = sampleCount();
  const cyc = WAVES[waveSelect.value()].cycles;
  const perCycle = cyc > 0 ? '  (' + nf(n / cyc, 1, 1) + ' per cycle)' : '';
  textSize(13);
  text('Samples: ' + n + perCycle, 10, drawHeight + 58);
}

function wrapText(s, maxW, size) {
  textSize(size);
  const words = s.split(' ');
  let line = '';
  let out = '';
  for (let i = 0; i < words.length; i++) {
    const trial = line.length ? line + ' ' + words[i] : words[i];
    if (textWidth(trial) > maxW && line.length) {
      out += line + '\n';
      line = words[i];
    } else {
      line = trial;
    }
  }
  return out + line;
}

// ---- responsive plumbing (must stay at the end) ------------------------

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  layoutControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
