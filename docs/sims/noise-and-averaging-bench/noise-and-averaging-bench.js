// Noise and Averaging Bench MicroSim
// CANVAS_HEIGHT: 590
// Bloom Level: Evaluate (L5) - the learner justifies an averaging depth, weighing
// noise reduction against battery cost against the risk of smoothing away a real
// event.
// Showing only the noise reduction would teach "average more", which is wrong.
// Three quantities move together here, and two of them get worse as the third
// gets better. That is what makes this a judgement rather than a lookup.
// Starts paused, as every MicroSim must, but the buffers are pre-filled so the
// statistics are already meaningful before the learner presses Start.
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

const NARROW_BREAKPOINT = 700;

// ---- controls ----
let depthSelect, noiseSelect, modeSelect;
let startButton, resetButton;

// ---- model constants ----
const BASE_HPA = 1013.0;
// Per mode, but identical between the two panels and never auto-scaled to the
// data, so a change in spread is always a real change in spread.
const Y_RANGE = {
  'Steady value': { lo: 1010.5, hi: 1015.5 },
  'Slow change':  { lo: 1008.5, hi: 1017.5 },
  'Sudden event': { lo: 1005.5, hi: 1015.5 }
};
const WINDOW = 300;             // readings shown
const BUFFER = 12000;           // readings retained (see the note on STAT_SPAN)
// Consecutive boxcar outputs overlap almost completely, so a short statistics
// window massively understates their spread - at depth 256 a 200-output window
// shares 200 of its 256 samples with itself and reports a "measured" noise far
// below the honest value. The span therefore scales with the depth, and prefix
// sums keep the whole thing O(1) per boxcar.
function statSpan(n) { return max(200, 40 * n); }
const EVENT_DROP = 6.0;         // hPa
const EVENT_LEN = 30;           // seconds
const EVENT_PERIOD = 300;       // seconds between squall lines: one per displayed window

// Illustrative power figures, stated on screen so nobody mistakes them for
// measurements. Chapter 16 does this properly.
const REPORT_INTERVAL = 600;    // seconds between reported measurements
const WAKE_OVERHEAD = 0.2;      // seconds
const AWAKE_MA = 100;
const IDLE_MA = 2;
const BATTERY_MAH = 10000;

const NOISE = { low: 0.05, typical: 0.20, high: 0.60 };

// ---- state ----
let raw = [];                   // readings
let tru = [];                   // the true value at the same instants
let cRaw = [0];                 // prefix sums, so a boxcar of any depth is O(1)
let cTru = [0];
let tNow = 0;
let playing = false;
let stepTimer = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  depthSelect = createSelect();
  [1, 4, 16, 64, 256].forEach(function (n) { depthSelect.option(String(n)); });
  depthSelect.selected('1');

  noiseSelect = createSelect();
  ['low', 'typical', 'high'].forEach(function (n) { noiseSelect.option(n); });
  noiseSelect.selected('typical');
  noiseSelect.changed(refill);

  modeSelect = createSelect();
  modeSelect.option('Steady value');
  modeSelect.option('Slow change');
  modeSelect.option('Sudden event');
  modeSelect.selected('Steady value');
  modeSelect.changed(refill);

  startButton = createButton('Start');
  startButton.mousePressed(function () {
    playing = !playing;
    startButton.html(playing ? 'Pause' : 'Start');
  });

  resetButton = createButton('Reset statistics');
  resetButton.mousePressed(refill);

  refill();
  layoutControls();

  describe('Two stacked plots on identical fixed axes: raw sensor readings scattering ' +
           'around a dashed true value, and the same signal after boxcar averaging. ' +
           'A statistics panel reports the measured noise reduction beside the ' +
           'square-root prediction, an estimated battery life that falls as the ' +
           'averaging depth rises, and in event mode the amount of a real 6 hPa ' +
           'pressure drop that the averaging destroyed.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 80;
  depthSelect.position(88, r1);
  depthSelect.size(70);
  noiseSelect.position(224, r1);
  noiseSelect.size(84);
  modeSelect.position(70, r2);
  modeSelect.size(150);
  startButton.position(10, r3);
  resetButton.position(78, r3);
}

// ---- signal -------------------------------------------------------------

function trueAt(t) {
  const mode = modeSelect.value();
  if (mode === 'Slow change') return BASE_HPA + 2.0 * sin(TWO_PI * t / 1200);
  if (mode === 'Sudden event') {
    const phase = ((t % EVENT_PERIOD) + EVENT_PERIOD) % EVENT_PERIOD;
    if (phase < EVENT_LEN) {
      // 2-second edges so the drop is sharp but not a mathematical discontinuity
      const ramp = constrain(min(phase / 2, (EVENT_LEN - phase) / 2), 0, 1);
      return BASE_HPA - EVENT_DROP * ramp;
    }
    return BASE_HPA;
  }
  return BASE_HPA;
}

function pushReading() {
  const sd = NOISE[noiseSelect.value()];
  const v = trueAt(tNow);
  const r = v + randomGaussian() * sd;
  tru.push(v);
  raw.push(r);
  cTru.push(cTru[cTru.length - 1] + v);
  cRaw.push(cRaw[cRaw.length - 1] + r);
  tNow += 1;
  if (raw.length > BUFFER + 2000) trim();
}

// Drop the oldest quarter and rebuild the prefix sums. Infrequent, and much
// cheaper than shifting an array of this size on every reading.
function trim() {
  const cut = floor(raw.length / 4);
  raw = raw.slice(cut);
  tru = tru.slice(cut);
  cRaw = [0];
  cTru = [0];
  for (let i = 0; i < raw.length; i++) {
    cRaw.push(cRaw[i] + raw[i]);
    cTru.push(cTru[i] + tru[i]);
  }
}

function refill() {
  raw = [];
  tru = [];
  cRaw = [0];
  cTru = [0];
  tNow = 0;
  for (let i = 0; i < BUFFER; i++) pushReading();
}

function depth() {
  return parseInt(depthSelect.value(), 10);
}

// boxcar over the last n entries ending at index i, via prefix sums
function boxcarC(c, i, n) {
  const lo = max(0, i - n + 1);
  return (c[i + 1] - c[lo]) / (i - lo + 1);
}
function boxcar(arr, i, n) {
  return boxcarC(arr === raw ? cRaw : cTru, i, n);
}

function stats() {
  const n = depth();
  const end = raw.length - 1;
  const start = max(n, end - statSpan(n) + 1);
  let sr = 0, sa = 0, cr = 0;
  const rr = [], aa = [];
  for (let i = start; i <= end; i++) {
    const dr = raw[i] - tru[i];
    const da = boxcar(raw, i, n) - boxcar(tru, i, n);
    rr.push(dr); aa.push(da);
    sr += dr; sa += da; cr++;
  }
  if (cr < 2) return { rawSD: 0, avgSD: 0, n: n };
  const mr = sr / cr, ma = sa / cr;
  let vr = 0, va = 0;
  for (let i = 0; i < cr; i++) { vr += sq(rr[i] - mr); va += sq(aa[i] - ma); }
  return { rawSD: sqrt(vr / (cr - 1)), avgSD: sqrt(va / (cr - 1)), n: n };
}

// how much of the real event survives the filter, computed from the filter
function eventAttenuation() {
  const n = depth();
  const end = raw.length - 1;
  let deepest = 0;
  for (let i = max(n, end - WINDOW + 1); i <= end; i++) {
    deepest = max(deepest, BASE_HPA - boxcar(tru, i, n));
  }
  return deepest;
}

function powerModel() {
  const n = depth();
  const awake = WAKE_OVERHEAD + n * 1.0;
  const avgMA = IDLE_MA + AWAKE_MA * awake / REPORT_INTERVAL;
  return { n: n, awake: awake, avgMA: avgMA, days: BATTERY_MAH / avgMA / 24 };
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;

  if (playing) {
    stepTimer -= deltaTime;
    if (stepTimer <= 0) { stepTimer = 90; pushReading(); }
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
  text('Noise and Averaging Bench', canvasWidth / 2, narrow ? 10 : 6);

  let p1, p2, panel;
  if (narrow) {
    const w = canvasWidth - 2 * margin;
    p1 = { x: margin, y: 38, w: w, h: 100 };
    p2 = { x: margin, y: 144, w: w, h: 100 };
    // the event message gets its own strip rather than bleeding into the panel
    panel = { x: margin, y: 284, w: w, h: drawHeight - 298 };
  } else {
    const pw = floor(canvasWidth * 0.62);
    p1 = { x: margin, y: 42, w: pw - margin, h: 168 };
    p2 = { x: margin, y: 220, w: pw - margin, h: 168 };
    panel = { x: pw + 8, y: 42, w: canvasWidth - margin - pw - 8, h: drawHeight - 62 };
  }

  drawRawPlot(p1);
  drawAvgPlot(p2);
  drawPanel(panel, narrow);
  drawEventMessage(narrow, p2);
  drawControlLabels();
}

function yRange() {
  return Y_RANGE[modeSelect.value()] || Y_RANGE['Steady value'];
}

function py(box, v) {
  const r = yRange();
  return map(v, r.lo, r.hi, box.y + box.h - 6, box.y + 16);
}

function plotFrame(box, title) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 4);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(10);
  text(title, box.x + 6, box.y + 3);
  // the fixed axis, labelled, so nobody suspects a rescale between panels
  const r = yRange();
  fill('#b0bec5');
  textAlign(RIGHT, TOP);
  text(nf(r.hi, 1, 1), box.x + box.w - 4, box.y + 13);
  textAlign(RIGHT, BOTTOM);
  text(nf(r.lo, 1, 1) + '  hPa', box.x + box.w - 4, box.y + box.h - 3);
}

function drawTrueLine(box, n) {
  const end = raw.length - 1;
  const start = max(0, end - WINDOW + 1);
  stroke('#37474f');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 4]);
  noFill();
  beginShape();
  for (let i = start; i <= end; i++) {
    const v = n > 1 ? boxcar(tru, i, n) : tru[i];
    vertex(map(i, start, end, box.x + 6, box.x + box.w - 6), py(box, v));
  }
  endShape();
  drawingContext.setLineDash([]);
}

function drawRawPlot(box) {
  plotFrame(box, 'Raw readings, one per second.  Dashed line is the true value.');
  const end = raw.length - 1;
  const start = max(0, end - WINDOW + 1);
  stroke('#90a4ae');
  strokeWeight(1);
  noFill();
  beginShape();
  for (let i = start; i <= end; i++) {
    vertex(map(i, start, end, box.x + 6, box.x + box.w - 6), py(box, raw[i]));
  }
  endShape();
  drawTrueLine(box, 1);
  noStroke();
}

function drawAvgPlot(box) {
  const n = depth();
  plotFrame(box, 'After averaging the last ' + n + ' reading' + (n === 1 ? '' : 's') +
                 '.  Same axis, same scale.');
  const end = raw.length - 1;
  const start = max(0, end - WINDOW + 1);
  stroke('#1565c0');
  strokeWeight(1.8);
  noFill();
  beginShape();
  for (let i = start; i <= end; i++) {
    vertex(map(i, start, end, box.x + 6, box.x + box.w - 6), py(box, boxcar(raw, i, n)));
  }
  endShape();
  drawTrueLine(box, n);
  noStroke();
}

function drawPanel(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const st = stats();
  const pm = powerModel();
  const predicted = 100 / sqrt(st.n);
  const measured = st.rawSD > 0 ? 100 * st.avgSD / st.rawSD : 100;

  const twoCol = narrow;
  const colW = twoCol ? (box.w - 20) / 2 : box.w - 20;
  const x1 = box.x + 10;
  const x2 = twoCol ? box.x + 10 + colW : x1;
  let y1 = box.y + 8;
  let y2 = twoCol ? box.y + 8 : 0;

  // --- noise ---
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Noise', x1, y1); y1 += 15;
  fill('#455a64');
  textSize(11);
  text('raw std dev', x1, y1); y1 += 13;
  fill('#212121');
  textSize(15);
  text(nf(st.rawSD, 1, 3) + ' hPa', x1, y1); y1 += 19;
  fill('#455a64');
  textSize(11);
  text('averaged std dev', x1, y1); y1 += 13;
  fill('#1565c0');
  textSize(15);
  text(nf(st.avgSD, 1, 3) + ' hPa', x1, y1); y1 += 21;

  fill('#546e7a');
  textSize(11);
  text('Square-root rule', x1, y1); y1 += 14;
  fill('#455a64');
  text('predicted  ' + nf(predicted, 1, 1) + '%', x1, y1); y1 += 13;
  text('measured   ' + nf(measured, 1, 1) + '%', x1, y1); y1 += 18;

  if (!twoCol) y2 = y1;

  // --- power ---
  fill('#546e7a');
  textSize(11);
  text('Power cost', x2, y2); y2 += 15;
  fill('#455a64');
  text('readings per measurement', x2, y2); y2 += 13;
  fill('#212121');
  textSize(15);
  text(String(pm.n), x2, y2); y2 += 19;
  fill('#455a64');
  textSize(11);
  text('awake per measurement', x2, y2); y2 += 13;
  fill('#212121');
  textSize(13);
  text(nf(pm.awake, 1, 1) + ' s  (' + nf(pm.avgMA, 1, 1) + ' mA average)', x2, y2); y2 += 19;
  fill('#455a64');
  textSize(11);
  text('estimated battery life', x2, y2); y2 += 13;
  fill(pm.days < 30 ? '#c62828' : '#2e7d32');
  textSize(17);
  text(nf(pm.days, 1, 0) + ' days', x2, y2); y2 += 20;

  fill('#90a4ae');
  textSize(twoCol ? 8 : 9);
  const note = twoCol
    ? 'Illustrative: 1 reading/s, 1 measurement/10 min, 100 mA awake, 2 mA idle, ' +
      '10 000 mAh. Chapter 16 does this properly.'
    : 'Illustrative figures: one reading per second, one reported measurement ' +
      'every 10 minutes, 100 mA awake, 2 mA idle, 10 000 mAh battery. ' +
      'Chapter 16 does this properly.';
  text(wrapText(note, twoCol ? colW - 6 : box.w - 20, 9), x2, y2);
}

function drawEventMessage(narrow, p2) {
  if (modeSelect.value() !== 'Sudden event') return;
  const seen = eventAttenuation();
  const lost = EVENT_DROP - seen;
  let tail;
  if (seen > 5.4) tail = 'Averaging removed the noise and left the event intact.';
  else if (seen > 3.0) tail = 'Averaging removed the noise and clipped the top off the event.';
  else tail = 'Averaging removed the noise and most of the event with it.';

  const msg = 'The true pressure dropped ' + nf(EVENT_DROP, 1, 1) + ' hPa. Your averaged ' +
              'output shows a drop of ' + nf(seen, 1, 1) + ' hPa. ' + tail;

  const y = narrow ? p2.y + p2.h + 6 : p2.y + p2.h + 8;
  const w = p2.w;
  noStroke();
  fill(lost > 2 ? '#b71c1c' : '#455a64');
  textAlign(LEFT, TOP);
  const z = narrow ? 10 : 12;
  textSize(z);
  text(wrapText(msg, w, z), p2.x, y);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Average:', 10, drawHeight + 22);
  text('Noise:', 172, drawHeight + 22);
  text('Signal:', 10, drawHeight + 58);
  fill('#546e7a');
  textSize(11);
  text(playing ? 'running' : 'paused - press Start to watch it scroll', 200, drawHeight + 94);
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
