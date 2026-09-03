// Inside the BME280 MicroSim
// CANVAS_HEIGHT: 634
// Bloom Level: Understand (L2) - the learner summarises how three transduction
// mechanisms share one chip, and explains why a program that only wants pressure
// still has to read the temperature.
// The trace uses the actual Bosch compensation formulas with the datasheet's
// example calibration constants, so every intermediate number on screen is one a
// real chip would produce. The skip-the-temperature fault inverts the same
// formulas to generate the raw counts the sensor would really return, then
// compensates them with a stale t_fine - which is exactly the bug it models.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 482;
let controlHeight = 152;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 700;

// ---- Bosch BME280 datasheet example calibration ----
const DT1 = 27504, DT2 = 26435, DT3 = -1000;
const DP = [36477, -10685, 3024, 2855, 140, -7, 15500, -14600, 6000];

function tFineOf(adcT) {
  const v1 = (adcT / 16384.0 - DT1 / 1024.0) * DT2;
  const v2 = Math.pow(adcT / 131072.0 - DT1 / 8192.0, 2) * DT3;
  return v1 + v2;
}
function tempOf(adcT) { return tFineOf(adcT) / 5120.0; }

// Bosch pressure compensation, floating point form, returns pascals.
function compPressure(adcP, tFine) {
  let v1 = tFine / 2.0 - 64000.0;
  let v2 = v1 * v1 * DP[5] / 32768.0;
  v2 = v2 + v1 * DP[4] * 2.0;
  v2 = v2 / 4.0 + DP[3] * 65536.0;
  v1 = (DP[2] * v1 * v1 / 524288.0 + DP[1] * v1) / 524288.0;
  v1 = (1.0 + v1 / 32768.0) * DP[0];
  if (v1 === 0) return 0;
  let p = 1048576.0 - adcP;
  p = (p - v2 / 4096.0) * 6250.0 / v1;
  v1 = DP[8] * p * p / 2147483648.0;
  v2 = p * DP[7] / 32768.0;
  return p + (v1 + v2 + DP[6]) / 16.0;
}

// The raw counts the chip would actually return for a true pressure at a true
// temperature: invert the compensation, which is monotonic in adcP.
function invAdcP(paTrue, tFine) {
  let lo = 0, hi = 1048575;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (compPressure(mid, tFine) > paTrue) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
function invAdcT(tC) {
  let lo = 0, hi = 1048575;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (tempOf(mid) < tC) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

const P_TRUE_PA = 101320;           // the air the chip is sitting in
const T_REF = 21.4;                 // the temperature the trace is written for

// ---- blocks --------------------------------------------------------------

const BLOCKS = [
  { id: 'P', label: 'Pressure\nelement', x: 0.04, y: 0.10, w: 0.235, h: 0.20,
    col: '#1565c0',
    info: 'A silicon diaphragm a few micrometres thick over a sealed cavity. Air ' +
          'pressure flexes it, and the piezoresistive effect turns that flex into a ' +
          'resistance change. Chapter 7.' },
  { id: 'H', label: 'Humidity\nelement', x: 0.04, y: 0.40, w: 0.235, h: 0.20,
    col: '#00838f',
    info: 'A polymer film between two electrodes. It absorbs water vapour from the ' +
          'air, which changes the capacitance. Chapter 8.' },
  { id: 'T', label: 'Temperature\nelement', x: 0.04, y: 0.70, w: 0.235, h: 0.20,
    col: '#c62828',
    info: 'A silicon diode. Its forward voltage falls about 2 mV per degree Celsius. ' +
          'Chapter 6.\n\nThis element has a second job. See the compensation path.' },
  { id: 'ADC', label: 'ADC', x: 0.355, y: 0.40, w: 0.14, h: 0.20,
    col: '#5e35b1',
    info: 'One analog-to-digital converter, shared. Each element is sampled in turn ' +
          'and quantised to a digital value. Chapter 4.' },
  { id: 'CAL', label: 'Calibration\nregisters', x: 0.575, y: 0.08, w: 0.245, h: 0.20,
    col: '#6d4c41',
    info: 'Factory-measured constants unique to this individual chip, burned in at ' +
          'manufacture: dig_T1 to dig_T3 and dig_P1 to dig_P9. Your code must read ' +
          'these before any reading means anything.' },
  { id: 'COMP', label: 'Compensation', x: 0.575, y: 0.40, w: 0.245, h: 0.20,
    col: '#2e7d32',
    info: 'Raw counts are not physical units. The compensation formulas turn them ' +
          'into hPa, per cent RH and degrees Celsius - and they need the temperature ' +
          'as an input.' },
  { id: 'IF', label: 'I2C / SPI\ninterface', x: 0.575, y: 0.72, w: 0.245, h: 0.18,
    col: '#37474f',
    info: 'Speaks I2C at address 0x76 or 0x77, or SPI. Chapter 12.' }
];

// from, to, whether it is the temperature compensation path
const PATHS = [
  ['P', 'ADC', false], ['H', 'ADC', false], ['T', 'ADC', false],
  ['ADC', 'COMP', false], ['CAL', 'COMP', false], ['COMP', 'IF', false],
  ['T', 'COMP', true]
];

// ---- state ----
let hovered = null;
let openBlock = null;
let explored = {};
let tracing = false;
let traceStep = 0;
let skipTemp = false;
let ambient = 21.4;
let showScale = false;
let chipHits = [];
let blockHits = [];
let ambSlider;
let diagBox = { x: 0, y: 0, w: 10, h: 10 };
let infoBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');
  ambSlider = createSlider(0, 45, 21.4, 0.2);
  ambSlider.parent(document.querySelector('main'));
  ambSlider.style('width', '150px');
  layoutControls();
  describe('A cutaway block diagram of the BME280 showing three sensing elements, ' +
           'a shared ADC, calibration registers, the compensation block and the bus ' +
           'interface, with a step-through trace of one pressure reading.');
}

// ---- the trace -----------------------------------------------------------

function adcTNow() { return invAdcT(ambient); }
function tFineTrue() { return tFineOf(adcTNow()); }
function tFineUsed() { return skipTemp ? tFineOf(invAdcT(T_REF)) : tFineTrue(); }
function adcPNow() { return invAdcP(P_TRUE_PA, tFineTrue()); }
function reportedPa() { return compPressure(adcPNow(), tFineUsed()); }

function traceStages() {
  const adcP = adcPNow();
  const tf = tFineUsed();
  const pa = reportedPa();
  const err = pa - P_TRUE_PA;
  return [
    { blocks: ['P'], head: 'Air presses on the diaphragm',
      body: 'Air at ' + (P_TRUE_PA / 100).toFixed(1) + ' hPa presses on a silicon ' +
            'diaphragm a few micrometres thick, sealed over a vacuum cavity.' },
    { blocks: ['P'], head: 'The diaphragm flexes',
      body: 'Piezoresistive elements on the diaphragm change resistance as it bends. ' +
            'That is the transduction step from Chapter 7.' },
    { blocks: ['P', 'ADC'], head: 'The ADC samples it',
      body: 'Raw value ' + Math.round(adcP).toLocaleString('en-US') + ' counts, out of ' +
            'a 20-bit range. One converter is shared between all three elements.' },
    { blocks: ['ADC', 'CAL'], head: 'Raw counts mean nothing yet',
      body: 'Read the calibration registers dig_P1 through dig_P9. They are unique ' +
            'to this individual chip. dig_P1 = ' + DP[0] + ', dig_P2 = ' + DP[1] + '.' },
    { blocks: ['T', 'ADC', 'COMP'], head: 'The formula needs the temperature',
      body: 'Compensation needs t_fine, which is derived from the temperature ' +
            'reading. ' + (skipTemp
              ? 'You skipped it, so the code is using a stale t_fine of ' +
                tf.toFixed(0) + ' from ' + T_REF.toFixed(1) + ' C while the chip is ' +
                'actually at ' + ambient.toFixed(1) + ' C.'
              : 'Temperature is ' + ambient.toFixed(1) + ' C, so t_fine = ' +
                tf.toFixed(0) + '.') },
    { blocks: ['COMP'], head: 'Compensated result',
      body: Math.round(pa).toLocaleString('en-US') + ' Pa' +
            (Math.abs(err) > 20
              ? '. The true pressure is ' + P_TRUE_PA.toLocaleString('en-US') +
                ' Pa. You are out by ' + (err / 100).toFixed(1) + ' hPa.'
              : ' = ' + (pa / 100).toFixed(1) + ' hPa, which is correct.') },
    { blocks: ['COMP', 'IF'], head: 'Out over the bus, with units',
      body: 'Divide by 100 for hPa: ' + (pa / 100).toFixed(1) + ' hPa. Store it with ' +
            'its unit, as Chapter 2 insisted. The interface sends it on I2C at 0x76.' }
  ];
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 30;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    const dh = Math.min(240, w * 0.62);
    diagBox = { x: margin, y: top, w: w, h: dh };
    infoBox = { x: margin, y: top + dh + 6, w: w, h: drawHeight - (top + dh + 6) - 6 };
  } else {
    const iw = 268;
    diagBox = { x: margin, y: top, w: canvasWidth - iw - 3 * margin,
                h: drawHeight - top - margin };
    infoBox = { x: canvasWidth - margin - iw, y: top, w: iw, h: drawHeight - top - margin };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  ambSlider.position(margin + 148, isNarrow() ? y0 + 60 : y0 + 26);
}

function bx(b) { return diagBox.x + b.x * diagBox.w; }
function by(b) { return diagBox.y + b.y * diagBox.h; }
function bw(b) { return b.w * diagBox.w; }
function bh(b) { return b.h * diagBox.h; }
function blockById(id) { return BLOCKS.find(b => b.id === id); }

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  ambient = ambSlider.value();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(22);
  text('Inside the BME280', canvasWidth / 2, 2);

  drawDiagram();
  drawInfo();
  drawControlRegion();
}

function activeSet() {
  if (tracing) return traceStages()[traceStep].blocks;
  if (hovered) return [hovered];
  if (openBlock) return [openBlock];
  return [];
}

function drawDiagram() {
  const b = diagBox;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y, b.w, b.h);
  drawingContext.clip();

  noStroke(); fill('#eef4f9');
  rect(b.x, b.y, b.w, b.h);
  // package outline
  noFill(); stroke('#90a4ae'); strokeWeight(2); drawingContext.setLineDash([6, 4]);
  rect(b.x + 6, b.y + 22, b.w - 12, b.h - 30, 6);
  drawingContext.setLineDash([]);
  noStroke(); fill('#78909c'); textAlign(LEFT, TOP); textSize(9.5);
  text('BME280 package, 2.5 x 2.5 x 0.93 mm - schematic, not to scale',
       b.x + 10, b.y + 8);

  const act = activeSet();
  drawPaths(act);

  blockHits = [];
  for (const blk of BLOCKS) {
    const x = bx(blk), y = by(blk), w = bw(blk), h = bh(blk);
    const on = act.indexOf(blk.id) >= 0;
    noStroke();
    fill(on ? blk.col : '#ffffff');
    stroke(on ? blk.col : '#b0bec5'); strokeWeight(on ? 2.4 : 1.2);
    rect(x, y, w, h, 4);
    noStroke();
    fill(on ? '#ffffff' : '#37474f');
    textAlign(CENTER, CENTER); textSize(Math.min(11, w / 8));
    const lines = blk.label.split('\n');
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], x + w / 2, y + h / 2 + (i - (lines.length - 1) / 2) * 12);
    }
    if (explored[blk.id] && !on) {
      noStroke(); fill('#2e7d32');
      circle(x + w - 7, y + 7, 6);
    }
    blockHits.push({ x: x, y: y, w: w, h: h, id: blk.id });
  }

  if (showScale) drawScaleOverlay();

  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h);
  noStroke();
}

function drawPaths(act) {
  for (const [from, to, isTemp] of PATHS) {
    const a = blockById(from), c = blockById(to);
    const lit = (isTemp && skipTemp) ||
                (act.indexOf(from) >= 0 && act.indexOf(to) >= 0);
    let x1 = bx(a) + bw(a), y1 = by(a) + bh(a) / 2;
    let x2 = bx(c), y2 = by(c) + bh(c) / 2;
    if (isTemp) {
      // Loop under the diagram and come up the corridor between the ADC and the
      // compensation block, which is the only vertical lane that is free. Going
      // straight up would run through the interface block.
      const yb = diagBox.y + diagBox.h - 13;
      const xg = diagBox.x + 0.525 * diagBox.w;
      const yc = by(c) + bh(c) * 0.78;
      stroke(lit ? '#c62828' : '#e0b4b4'); strokeWeight(lit ? 2.6 : 1.6);
      noFill(); drawingContext.setLineDash([5, 4]);
      beginShape();
      vertex(bx(a) + bw(a) / 2, by(a) + bh(a));
      vertex(bx(a) + bw(a) / 2, yb);
      vertex(xg, yb);
      vertex(xg, yc);
      vertex(bx(c), yc);
      endShape();
      drawingContext.setLineDash([]);
      arrowHead(bx(c), yc, 1, 0, lit ? '#c62828' : '#e0b4b4');
      noStroke(); fill(lit ? '#c62828' : '#c98f8f');
      textAlign(LEFT, BOTTOM); textSize(9.5);
      const tl = skipTemp ? 't_fine STALE: this path was skipped'
                          : 't_fine: pressure cannot be computed without it';
      text(diagBox.w < 380 ? (skipTemp ? 't_fine STALE' : 't_fine required') : tl,
           bx(a) + bw(a) / 2 + 6, yb - 4);
      continue;
    }
    if (Math.abs(y1 - y2) > 4 && Math.abs(x1 - x2) < 6) {
      x1 = bx(a) + bw(a) / 2; y1 = by(a) + bh(a);
      x2 = bx(c) + bw(c) / 2; y2 = by(c);
    }
    stroke(lit ? '#37474f' : '#c3ced8'); strokeWeight(lit ? 2.6 : 1.5);
    noFill();
    const mx = (x1 + x2) / 2;
    beginShape();
    vertex(x1, y1); bezierVertex(mx, y1, mx, y2, x2, y2);
    endShape();
    const dx = x2 > x1 ? 1 : (x2 < x1 ? -1 : 0);
    arrowHead(x2, y2, dx, dx === 0 ? 1 : 0, lit ? '#37474f' : '#c3ced8');
  }
}

function arrowHead(x, y, ux, uy, col) {
  const a = Math.atan2(uy, ux);
  noStroke(); fill(col);
  triangle(x, y, x - 7 * Math.cos(a - 0.4), y - 7 * Math.sin(a - 0.4),
           x - 7 * Math.cos(a + 0.4), y - 7 * Math.sin(a + 0.4));
}

// The chip is 2.5 mm across. Students consistently imagine something far bigger.
function drawScaleOverlay() {
  const b = diagBox;
  const w = Math.min(300, b.w - 30), h = 96;
  const x = b.x + (b.w - w) / 2, y = b.y + (b.h - h) / 2;
  noStroke(); fill(255, 245);
  rect(x, y, w, h, 5);
  stroke('#37474f'); strokeWeight(1.2); noFill();
  rect(x, y, w, h, 5);
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(11);
  text('Actual size', x + w / 2, y + 6);
  // 1 mm at roughly 96 dpi is about 3.78 px
  const mm = 3.78;
  const cy = y + 56;
  fill('#37474f');
  rect(x + w * 0.28, cy - 2.5 * mm / 2, 2.5 * mm, 2.5 * mm, 1);
  fill('#e8d9b0'); stroke('#c9b98c'); strokeWeight(0.8);
  ellipse(x + w * 0.62, cy, 7 * mm, 2.6 * mm);
  noStroke(); fill('#5a6a78'); textSize(9); textAlign(CENTER, TOP);
  text('BME280\n2.5 mm', x + w * 0.28, cy + 12);
  text('grain of rice\n7 mm', x + w * 0.62, cy + 12);
}

// ---- info panel ----------------------------------------------------------

function drawInfo() {
  const b = infoBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 10, W = b.w - 20;
  let y = b.y + 8;

  if (tracing) {
    const st = traceStages();
    const s = st[traceStep];
    fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
    text('Trace a reading - step ' + (traceStep + 1) + ' of ' + st.length, L, y);
    y += 15;
    fill('#0d2b45'); textSize(12.5); textStyle(BOLD);
    y = para(L, y, W, s.head, 14, 12.5);
    textStyle(NORMAL); y += 4;
    fill('#33475b'); textSize(11);
    y = para(L, y, W, s.body, 13, 11);
    if (skipTemp) {
      y += 6;
      const err = (reportedPa() - P_TRUE_PA) / 100;
      fill('#b71c1c'); textSize(10.5);
      y = para(L, y, W, 'Skip-the-temperature fault is on. Reported ' +
               (reportedPa() / 100).toFixed(1) + ' hPa against a true ' +
               (P_TRUE_PA / 100).toFixed(1) + ' hPa: an error of ' +
               err.toFixed(1) + ' hPa.', 12, 10.5);
    }
    return;
  }

  if (openBlock) {
    const blk = blockById(openBlock);
    noStroke(); fill(blk.col);
    rect(L, y, W, 4, 2);
    y += 10;
    fill('#0d2b45'); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
    y = para(L, y, W, blk.label.replace('\n', ' '), 14, 12.5);
    textStyle(NORMAL); y += 4;
    fill('#33475b'); textSize(11);
    for (const chunk of blk.info.split('\n\n')) {
      y = para(L, y, W, chunk, 13, 11) + 7;
    }
    if (blk.id === 'T') {
      fill('#b71c1c'); textSize(10.5);
      para(L, y, W, 'Follow the red dashed path along the bottom of the diagram.',
           12, 10.5);
    }
    return;
  }

  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
  text(skipTemp ? 'Skip-the-temperature fault' : 'Three chapters, one chip', L, y);
  textStyle(NORMAL);
  y += 18;
  if (!skipTemp) {
    fill('#33475b'); textSize(11);
    y = para(L, y, W, 'A pressure diaphragm from Chapter 7, a polymer humidity film ' +
        'from Chapter 8 and a silicon diode thermometer from Chapter 6, sharing one ' +
        'ADC from Chapter 4 and one bus interface.', 13, 11);
    y += 8;
    fill('#5a6a78'); textSize(10.5);
    y = para(L, y, W, 'Click any block for what it does. Then run Trace a reading ' +
        'to follow one measurement from the air to a number with units on it.', 12, 10.5);
    y += 8;
    const n = Object.keys(explored).length;
    fill(n === BLOCKS.length ? '#1b5e20' : '#8a97a4'); textSize(10.5);
    text('Blocks explored: ' + n + ' of ' + BLOCKS.length, L, y);
    y += 18;
  } else {
    fill('#b71c1c'); textSize(10.5);
    y = para(L, y, W, 'The code never read the temperature, so the compensation is ' +
        'using a t_fine left over from ' + T_REF.toFixed(1) + ' C.', 12, 10.5);
    y += 8;
  }

  fill('#0d2b45'); textSize(11); textStyle(BOLD);
  text('Live reading', L, y); textStyle(NORMAL);
  y += 15;
  y = irow(L, y, W, 'Ambient', ambient.toFixed(1) + ' C');
  y = irow(L, y, W, 'Raw pressure', Math.round(adcPNow()).toLocaleString('en-US') + ' counts');
  y = irow(L, y, W, 't_fine used', tFineUsed().toFixed(0) + (skipTemp ? '  (stale)' : ''));
  const err = (reportedPa() - P_TRUE_PA) / 100;
  fill(Math.abs(err) > 0.2 ? '#b71c1c' : '#1b5e20');
  y = irow(L, y, W, 'Reported', (reportedPa() / 100).toFixed(1) + ' hPa',
           Math.abs(err) > 0.2 ? '#b71c1c' : '#1b5e20');
  if (Math.abs(err) > 0.2) {
    fill('#b71c1c'); textSize(10);
    y = para(L, y, W, 'True pressure is ' + (P_TRUE_PA / 100).toFixed(1) + ' hPa. ' +
         'Error ' + err.toFixed(1) + ' hPa.', 11.5, 10);
  }
  y += 8;
  if (b.y + b.h - y > 112) drawDrift(L, y, W, Math.min(132, b.y + b.h - y - 6));
}

// Raw counts the chip returns at each ambient temperature, for a fixed true
// pressure. Independent of the fault, so it is built once.
let ADC_BY_T = null;
function adcTable() {
  if (ADC_BY_T) return ADC_BY_T;
  ADC_BY_T = [];
  for (let i = 0; i <= 45; i++) {
    const tf = tFineOf(invAdcT(i));
    ADC_BY_T.push({ t: i, tf: tf, adc: invAdcP(P_TRUE_PA, tf) });
  }
  return ADC_BY_T;
}

function drawDrift(L, y, W, H) {
  const tab = adcTable();
  const stale = tFineOf(invAdcT(T_REF));
  const vals = tab.map(r => compPressure(r.adc, skipTemp ? stale : r.tf) / 100);
  let lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
  const mid = P_TRUE_PA / 100;
  const span = Math.max(6, Math.max(hi - mid, mid - lo) * 1.15);
  lo = mid - span; hi = mid + span;

  const x0 = L + 30, x1 = L + W - 4, y0 = y + 14, y1 = y + H - 14;
  const px = (t) => x0 + t / 45 * (x1 - x0);
  const py = (v) => y1 - (v - lo) / (hi - lo) * (y1 - y0);

  noStroke(); fill('#f7f9fb');
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke(); fill('#5a6a78'); textAlign(LEFT, BOTTOM); textSize(9);
  text('reported pressure vs room temperature', x0, y0 - 2);

  stroke('#90a4ae'); strokeWeight(1); drawingContext.setLineDash([4, 3]);
  line(x0, py(mid), x1, py(mid));
  drawingContext.setLineDash([]);
  noStroke(); fill('#5a6a78'); textAlign(RIGHT, CENTER); textSize(8.5);
  text(mid.toFixed(0), x0 - 3, py(mid));
  text(hi.toFixed(0), x0 - 3, y0 + 4);
  text(lo.toFixed(0), x0 - 3, y1 - 4);

  stroke(skipTemp ? '#c62828' : '#1b5e20'); strokeWeight(2); noFill();
  beginShape();
  for (let i = 0; i < tab.length; i++) vertex(px(tab[i].t), py(vals[i]));
  endShape();

  noStroke(); fill('#000');
  circle(px(constrain(ambient, 0, 45)), py(reportedPa() / 100), 5);
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(8.5);
  text('0 C', x0, y1 + 2);
  textAlign(RIGHT, TOP);
  text('45 C', x1, y1 + 2);
  textAlign(CENTER, TOP);
  fill(skipTemp ? '#b71c1c' : '#1b5e20'); textSize(9);
  text(skipTemp ? 'stale t_fine: the reading follows the room'
                : 'temperature read every time: dead flat',
       (x0 + x1) / 2, y1 + 2);
}

function irow(L, y, W, k, v, col) {
  textAlign(LEFT, TOP); textSize(10.5);
  fill('#5a6a78'); text(k, L, y);
  fill(col || '#0d2b45'); textSize(11);
  text(v, L + Math.min(88, W * 0.42), y);
  return y + 15;
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 8;
  chipHits = [];

  let x = margin;
  x = chip(x, y0, tracing ? 'Stop the trace' : 'Trace a reading', tracing) + 6;
  if (tracing) {
    x = chip(x, y0, 'Previous', false) + 6;
    chip(x, y0, 'Next', false);
  }
  const r2 = isNarrow() ? y0 + 30 : y0 + 60;
  const x2 = chip(margin, r2, 'Skip the temperature read', skipTemp) + 6;
  chip(x2, r2, showScale ? 'Hide actual size' : 'Actual size', showScale);

  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
  text('Ambient temperature', margin, (isNarrow() ? y0 + 66 : y0 + 30) + 5);
  fill('#33475b'); textSize(10.5);
  text(ambient.toFixed(1) + ' C', margin + 306, (isNarrow() ? y0 + 66 : y0 + 30) + 5);

  if (skipTemp) {
    fill('#b71c1c'); textAlign(LEFT, TOP); textSize(10);
    para(margin, isNarrow() ? y0 + 86 : y0 + 90,
         canvasWidth - 2 * margin,
         'The pressure element is temperature-sensitive by design. Skip the ' +
         'temperature read and your pressure drifts with the room. This looks like ' +
         'a broken sensor and is not.', 11.5, 10);
  } else if (!isNarrow()) {
    fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
    text('Move the ambient slider with the fault off: the reading does not budge.',
         margin, y0 + 92);
  }
}

function chip(x, y, label, on) {
  textSize(11); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 18;
  const h = 23;
  noStroke(); fill(on ? '#1565c0' : '#e8eef4');
  stroke(on ? '#0d47a1' : '#b6c4d2'); strokeWeight(1);
  rect(x, y, w, h, 5);
  noStroke(); fill(on ? '#ffffff' : '#33475b');
  text(label, x + w / 2, y + h / 2 + 1);
  chipHits.push({ x: x, y: y, w: w, h: h, label: label });
  return x + w;
}

// ---- interaction ---------------------------------------------------------

function mouseMoved() {
  hovered = null;
  for (const h of blockHits) {
    if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) {
      hovered = h.id;
    }
  }
  return true;
}

function mousePressed() {
  for (const c of chipHits) {
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      onChip(c.label);
      return false;
    }
  }
  for (const h of blockHits) {
    if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) {
      openBlock = openBlock === h.id ? null : h.id;
      explored[h.id] = true;
      tracing = false;
      return false;
    }
  }
  return true;
}

function onChip(label) {
  if (label === 'Trace a reading') { tracing = true; traceStep = 0; openBlock = null; }
  else if (label === 'Stop the trace') tracing = false;
  else if (label === 'Next') traceStep = Math.min(traceStages().length - 1, traceStep + 1);
  else if (label === 'Previous') traceStep = Math.max(0, traceStep - 1);
  else if (label === 'Skip the temperature read') skipTemp = !skipTemp;
  else showScale = !showScale;
}

function para(L, y, W, s, lh, size) {
  const lines = wrapLines(s, W, size);
  for (let i = 0; i < lines.length; i++) text(lines[i], L, y + i * lh);
  return y + lines.length * lh;
}

function wrapLines(s, maxW, size) {
  textSize(size);
  const words = String(s).split(' ');
  const out = [];
  let line = '';
  for (const w of words) {
    const trial = line.length ? line + ' ' + w : w;
    if (textWidth(trial) > maxW && line.length) { out.push(line); line = w; }
    else line = trial;
  }
  out.push(line);
  return out;
}

// ---- responsive plumbing (must stay at the end) --------------------------

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  layoutControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
