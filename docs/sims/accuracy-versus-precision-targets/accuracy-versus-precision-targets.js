// Accuracy Versus Precision Target Range MicroSim
// CANVAS_HEIGHT: 600
// Bloom Level: Analyze (L4) - the learner differentiates accuracy from precision
// by driving bias and scatter as two independent variables, then watches
// calibration fix exactly one of them.
// Readings are placed immediately rather than animated into position, because
// the statistical picture is the content and flying dots only obscure it.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 215;

const NARROW_BREAKPOINT = 700;

// ---- controls ----
let biasSlider;
let scatterSlider;
let oneButton;
let twentyButton;
let clearButton;
let calibrateButton;
let presetButtons = [];

// ---- model -------------------------------------------------------------
// The instrument takes a two-axis reading, like a dart or a GPS fix. Bias
// pushes the whole cloud along one fixed direction; scatter spreads each
// reading around wherever that cloud centre happens to be. The two are
// generated separately on purpose - that separation IS the lesson.
const BIAS_ANGLE = -0.7;            // fixed direction, up and to the right
const RING_UNITS = [2, 4, 6, 8, 10];
const MAX_UNITS = 12;               // the outer edge of the target
const ACCURATE_LIMIT = 1.5;         // units of bias below which we call it accurate
const PRECISE_LIMIT = 2.5;          // units of scatter below which we call it precise

let readings = [];                  // { x, y } in target units, true value at (0,0)
let calibration = { x: 0, y: 0 };   // subtracted from every future reading
let calibrated = false;
let message = '';

const PRESETS = [
  { label: 'Good sensor',   bias: 0, scatter: 1, note: 'Accurate and precise. This is what you are aiming for.' },
  { label: 'Uncalibrated',  bias: 7, scatter: 1, note: 'Reads consistently 7 units high. Precise, and consistently wrong.' },
  { label: 'Noisy',         bias: 0, scatter: 8, note: 'Right on average, unreliable one reading at a time.' },
  { label: 'Broken',        bias: 7, scatter: 8, note: 'Neither accurate nor precise. Replace it.' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  biasSlider = createSlider(-10, 10, 0, 0.5);
  scatterSlider = createSlider(0, 10, 2, 0.5);

  oneButton = createButton('Take 1 reading');
  oneButton.mousePressed(function () { takeReadings(1); });

  twentyButton = createButton('Take 20');
  twentyButton.mousePressed(function () { takeReadings(20); });

  clearButton = createButton('Clear');
  clearButton.mousePressed(function () {
    readings = [];
    message = calibrated ? 'Readings cleared. The calibration is still applied.' : '';
  });

  calibrateButton = createButton('Calibrate');
  calibrateButton.mousePressed(calibrate);

  presetButtons = PRESETS.map(function (p) {
    const b = createButton(p.label);
    b.mousePressed(function () { applyPreset(p); });
    return b;
  });

  layoutControls();

  describe('A circular target whose centre is the true value. Two sliders set bias ' +
           'and scatter independently, so the learner can produce all four quadrants ' +
           'of the accuracy-precision diagram. Histograms and live statistics report ' +
           'the bias and the standard deviation separately, and a Calibrate button ' +
           'removes the bias while visibly leaving the scatter alone.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 42;
  const r3 = drawHeight + 74;
  const r4 = drawHeight + 104;

  biasSlider.position(sliderLeftMargin, r1);
  biasSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  scatterSlider.position(sliderLeftMargin, r2);
  scatterSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));

  oneButton.position(10, r3);
  twentyButton.position(118, r3);
  clearButton.position(196, r3);
  calibrateButton.position(252, r3);

  let x = 10;
  const widths = [90, 96, 58, 66];
  for (let i = 0; i < presetButtons.length; i++) {
    presetButtons[i].position(x, r4);
    x += widths[i] + 6;
  }
}

// ---- reading generation ------------------------------------------------

function takeReadings(n) {
  const bias = biasSlider.value();
  const scatter = scatterSlider.value();
  for (let i = 0; i < n; i++) {
    const bx = cos(BIAS_ANGLE) * bias;
    const by = sin(BIAS_ANGLE) * bias;
    readings.push({
      x: bx + randomGaussian() * scatter - calibration.x,
      y: by + randomGaussian() * scatter - calibration.y
    });
  }
  if (readings.length > 400) readings = readings.slice(readings.length - 400);
}

function calibrate() {
  const s = stats();
  if (s.n === 0) {
    message = 'Take some readings first - calibration needs to measure the bias before it can remove it.';
    return;
  }
  calibration = { x: calibration.x + s.mx, y: calibration.y + s.my };
  calibrated = true;
  readings = [];
  message = 'Calibration removed the bias. Take readings again and notice that the ' +
            'scatter is unchanged - calibration cannot fix imprecision.';
}

function applyPreset(p) {
  biasSlider.value(p.bias);
  scatterSlider.value(p.scatter);
  calibration = { x: 0, y: 0 };
  calibrated = false;
  readings = [];
  takeReadings(20);
  message = p.note;
}

function stats() {
  const n = readings.length;
  if (n === 0) return { n: 0, mx: 0, my: 0, bias: 0, sd: 0 };
  let sx = 0, sy = 0;
  for (let i = 0; i < n; i++) { sx += readings[i].x; sy += readings[i].y; }
  const mx = sx / n;
  const my = sy / n;
  let ss = 0;
  for (let i = 0; i < n; i++) {
    ss += sq(readings[i].x - mx) + sq(readings[i].y - my);
  }
  // spread of the readings about their own centre, in the same units as the rings
  const sd = n > 1 ? sqrt(ss / (2 * (n - 1))) : 0;
  return { n: n, mx: mx, my: my, bias: sqrt(mx * mx + my * my), sd: sd };
}

function verdict(s) {
  if (s.n < 2) return 'Take at least two readings.';
  const acc = s.bias < ACCURATE_LIMIT;
  const pre = s.sd < PRECISE_LIMIT;
  if (acc && pre) return 'Accurate and precise';
  if (!acc && pre) return 'Precise but inaccurate';
  if (acc && !pre) return 'Accurate but imprecise';
  return 'Neither';
}

// ---- draw --------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  const s = stats();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Accuracy Versus Precision', canvasWidth / 2, 10);

  let targetBox, statsBox, hist1, hist2, msgBox;
  if (narrow) {
    const tSize = min(canvasWidth * 0.44, 190);
    targetBox = { x: margin, y: 44, w: tSize, h: tSize };
    statsBox = { x: margin + tSize + 8, y: 44,
                 w: canvasWidth - margin * 2 - tSize - 8, h: tSize };
    hist1 = { x: margin, y: 44 + tSize + 10, w: canvasWidth - 2 * margin, h: 80 };
    hist2 = { x: margin, y: 44 + tSize + 98, w: canvasWidth - 2 * margin, h: 80 };
    msgBox = { x: margin, y: 44 + tSize + 186, w: canvasWidth - 2 * margin };
  } else {
    const half = canvasWidth * 0.46;
    const tSize = min(half - margin, drawHeight - 130);
    targetBox = { x: margin, y: 50, w: tSize, h: tSize };
    const rx = margin + half;
    const rw = canvasWidth - margin - rx;
    statsBox = { x: rx, y: 50, w: rw, h: 156 };
    hist1 = { x: rx, y: 214, w: rw, h: 118 };
    hist2 = { x: rx, y: 340, w: rw, h: 118 };
    // the message lives in the space under the target, not across the histograms
    msgBox = { x: margin, y: 50 + tSize + 22, w: half - margin };
  }

  drawTarget(targetBox, s);
  drawStats(statsBox, s);
  drawReadingHistogram(hist1);
  drawErrorHistogram(hist2);
  drawMessage(msgBox);
  drawControlLabels();
}

function drawTarget(box, s) {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const R = box.w / 2 - 6;
  const u = R / MAX_UNITS;    // pixels per unit

  // rings
  noFill();
  for (let i = RING_UNITS.length - 1; i >= 0; i--) {
    stroke('#b0bec5');
    strokeWeight(1);
    fill(i % 2 === 0 ? '#ffffff' : '#f1f5f7');
    circle(cx, cy, RING_UNITS[i] * 2 * u);
  }
  noFill();
  stroke('#90a4ae');
  circle(cx, cy, MAX_UNITS * 2 * u);

  // true value at the centre
  stroke('#2e7d32');
  strokeWeight(2);
  line(cx - 9, cy, cx + 9, cy);
  line(cx, cy - 9, cx, cy + 9);
  noStroke();
  fill('#1b5e20');
  textAlign(CENTER, TOP);
  textSize(12);
  text('true value', cx, cy + 11);

  // Everything from here is clipped to the target box: a large scatter throws
  // dots and the one-sigma circle well outside the rings, and unclipped they
  // painted over the stats panel.
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(box.x, box.y, box.w, box.h);
  drawingContext.clip();

  // readings, most recent drawn most solidly
  noStroke();
  const n = readings.length;
  for (let i = 0; i < n; i++) {
    const age = (n - i) / max(1, n);         // 0 = newest
    const a = map(age, 0, 1, 235, 70);
    fill(21, 101, 192, a);
    circle(cx + readings[i].x * u, cy + readings[i].y * u, 6);
  }

  if (s.n >= 2) {
    // one-standard-deviation circle around the mean
    push();
    stroke('#ef6c00');
    strokeWeight(1.5);
    noFill();
    drawingContext.setLineDash([5, 5]);
    circle(cx + s.mx * u, cy + s.my * u, s.sd * 2 * u);
    drawingContext.setLineDash([]);
    pop();

    // crosshair at the mean of the readings
    stroke('#c62828');
    strokeWeight(2);
    const mx = cx + s.mx * u;
    const my = cy + s.my * u;
    line(mx - 11, my, mx + 11, my);
    line(mx, my - 11, mx, my + 11);
    noStroke();
    fill('#b71c1c');
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('mean', mx, my - 12);
  }

  drawingContext.restore();
  pop();

  noStroke();
  fill('#78909c');
  textAlign(LEFT, TOP);
  textSize(11);
  text('rings every 2 units', box.x + 2, box.y + 2);
}

function drawStats(box, s) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 5);
  noStroke();

  const small = box.w < 250;
  const ls = small ? 12 : 13;
  const inner = box.w - 18;

  // Mean and bias are deliberately printed as separate lines with the same
  // number: the point is that bias IS the gap between the two.
  const lines = [
    { t: 'Readings taken: ' + s.n, c: '#546e7a', z: ls },
    { t: (small ? 'True value: 0.0 units' : 'True value: 0.0 units from centre'), c: '#546e7a', z: ls },
    { t: (small ? 'Mean: ' : 'Mean of readings: ') + nf(s.bias, 1, 1) + ' units from centre',
      c: '#546e7a', z: ls },
    { t: 'Bias (inaccuracy): ' + nf(s.bias, 1, 1) + ' units', c: '#c62828', z: ls + 1 },
    { t: 'Scatter (imprecision): ' + nf(s.sd, 1, 1) + ' units', c: '#ef6c00', z: ls + 1 }
  ];

  let y = box.y + 7;
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    fill(lines[i].c);
    const wrapped = wrapText(lines[i].t, inner, lines[i].z);
    text(wrapped, box.x + 9, y);
    y += wrapped.split('\n').length * (lines[i].z + 3) + 4;
  }

  const v = verdict(s);
  const vz = small ? 14 : 16;
  fill(v === 'Accurate and precise' ? '#1b5e20' : '#263238');
  const vw = wrapText(v, inner, vz);
  text(vw, box.x + 9, y + 2);
  y += vw.split('\n').length * (vz + 3) + 6;

  if (calibrated) {
    fill('#00695c');
    const cw = wrapText('calibration active: ' +
                        nf(sqrt(sq(calibration.x) + sq(calibration.y)), 1, 1) +
                        ' units subtracted', inner, 11);
    text(cw, box.x + 9, y);
  }
}

// signed offset of each reading along the bias direction
function drawReadingHistogram(box) {
  const vals = readings.map(function (r) {
    return r.x * cos(BIAS_ANGLE) + r.y * sin(BIAS_ANGLE);
  });
  drawHistogram(box, vals, -MAX_UNITS, MAX_UNITS, 20, '#1565c0',
                'Readings, measured along the bias direction', true);
}

// how far each reading landed from the true value, sign discarded
function drawErrorHistogram(box) {
  const vals = readings.map(function (r) { return sqrt(r.x * r.x + r.y * r.y); });
  drawHistogram(box, vals, 0, MAX_UNITS + 4, 16, '#ef6c00',
                'Errors: distance of each reading from the true value', false);
}

function drawHistogram(box, vals, lo, hi, bins, col, title, markZero) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 5);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text(wrapText(title, box.w - 12, 11), box.x + 6, box.y + 4);

  const plotTop = box.y + 20;
  const plotBot = box.y + box.h - 16;
  const plotH = plotBot - plotTop;
  const bw = (box.w - 16) / bins;

  const counts = new Array(bins).fill(0);
  for (let i = 0; i < vals.length; i++) {
    let b = floor(map(vals[i], lo, hi, 0, bins));
    b = constrain(b, 0, bins - 1);
    counts[b]++;
  }
  const peak = max(1, Math.max.apply(null, counts));

  for (let i = 0; i < bins; i++) {
    if (counts[i] === 0) continue;
    const h = (counts[i] / peak) * plotH;
    fill(col);
    noStroke();
    rect(box.x + 8 + i * bw, plotBot - h, bw - 1, h);
  }

  stroke('#b0bec5');
  strokeWeight(1);
  line(box.x + 8, plotBot, box.x + box.w - 8, plotBot);

  if (markZero) {
    const zx = box.x + 8 + map(0, lo, hi, 0, box.w - 16);
    stroke('#2e7d32');
    strokeWeight(2);
    line(zx, plotTop, zx, plotBot);
    noStroke();
    fill('#1b5e20');
    textAlign(CENTER, TOP);
    textSize(10);
    text('true', zx, plotBot + 2);
  }

  noStroke();
  fill('#78909c');
  textAlign(LEFT, TOP);
  textSize(10);
  text(nf(lo, 1, 0), box.x + 8, plotBot + 2);
  textAlign(RIGHT, TOP);
  text(nf(hi, 1, 0) + ' units', box.x + box.w - 8, plotBot + 2);
}

function drawMessage(box) {
  if (message === '') return;
  noStroke();
  fill('#00695c');
  textAlign(LEFT, TOP);
  text(wrapText(message, box.w, 12), box.x, box.y);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  const b = biasSlider.value();
  text('Bias (inaccuracy): ' + (b > 0 ? '+' : '') + nf(b, 1, 1), 10, drawHeight + 18);
  text('Scatter (imprecision): ' + nf(scatterSlider.value(), 1, 1), 10, drawHeight + 52);
}

// ---- helpers -----------------------------------------------------------

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
