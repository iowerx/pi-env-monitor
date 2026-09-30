// Axis Honesty Lab MicroSim
// CANVAS_HEIGHT: 660
// Bloom Level: Evaluate (L5) - the learner critiques two presentations of one
// dataset and judges which axis choices are honest for a stated claim.
// Both charts plot the same shared array, so they provably cannot differ in
// data - only in presentation. The claim selector supplies the criterion, which
// is what stops the lesson collapsing into "never truncate the y-axis", a rule
// that is wrong often enough to be worth unlearning.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 486;
let controlHeight = 174;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 760;

// ---- datasets ------------------------------------------------------------
// Every chart draws from these shared arrays. Nothing else is plotted.

function mkTempWeek() {
  const d = [];
  for (let i = 0; i < 168; i++) {
    const v = 18.6 + 0.28 * Math.sin(2 * Math.PI * (i - 6) / 24)
              + 0.085 * Math.sin(i / 5.3) + 0.035 * Math.sin(i / 1.7);
    d.push({ t: i, v: v });
  }
  return d;
}
function mkPressureMonth() {
  const d = [];
  for (let i = 0; i < 720; i++) {
    let v = 1016 + 2.5 * Math.sin(i / 90) + 0.8 * Math.sin(i / 23);
    const storm = Math.exp(-Math.pow((i - 336) / 26, 2));
    v -= 25 * storm;
    d.push({ t: i, v: v });
  }
  return d;
}
function mkAnnual() {
  const base = [14.02, 14.11, 14.09, 14.24, 14.31];
  return base.map((v, i) => ({ t: 2021 + i, v: v }));
}
function mkGapDay() {
  const d = [];
  for (let i = 0; i < 1440; i += 10) {
    if (i >= 480 && i < 840) { d.push({ t: i, v: null }); continue; }
    const v = 16 + 7 * Math.sin(2 * Math.PI * (i - 420) / 1440) + 0.3 * Math.sin(i / 40);
    d.push({ t: i, v: v });
  }
  return d;
}

const DATA = {
  'A week of temperature': { d: mkTempWeek(), unit: '°C', xlab: 'hours',
    full: [0, 40], quantity: 'air temperature',
    note: 'The whole week varies by well under one degree.' },
  'A month of pressure with a storm': { d: mkPressureMonth(), unit: 'hPa', xlab: 'hours',
    full: [960, 1060], quantity: 'station pressure',
    note: 'There is a genuine 25 hPa event in the middle of this month.' },
  'Five years of annual mean': { d: mkAnnual(), unit: '°C', xlab: 'year',
    full: [0, 20], quantity: 'annual mean temperature',
    note: 'A small real trend. This is the contested case.' },
  'A day with a six-hour gap': { d: mkGapDay(), unit: '°C', xlab: 'minutes',
    full: [0, 40], quantity: 'air temperature',
    note: 'Six hours are simply absent from the file.' }
};
const DATA_NAMES = Object.keys(DATA);

const CLAIMS = {
  'This place has a stable climate': { wantTight: false,
    why: 'A stability claim is about how small the variation is, so the axis must be wide ' +
         'enough to show that smallness honestly. A tight axis makes stability look like ' +
         'turbulence.' },
  'A storm passed mid-month': { wantTight: true,
    why: 'An event claim is about a specific excursion, so the axis should be tight enough ' +
         'to show its shape. Burying a real 25 hPa drop in a 100 hPa axis hides the ' +
         'evidence for the claim.' },
  'Temperatures are rising': { wantTight: true,
    why: 'A trend claim needs the reader to see the slope, and a small real trend is ' +
         'invisible on a wide axis. This is the genuinely contested case: a tight axis is ' +
         'defensible if the range is disclosed, and misleading if it is not.' },
  'The sensor failed on Tuesday': { wantTight: false,
    why: 'A failure claim is about missing or impossible data, so what matters is gap ' +
         'handling and disclosure, not the vertical zoom.' }
};
const CLAIM_NAMES = Object.keys(CLAIMS);

// ---- state ----
let dataName = 'A week of temperature';
let claim = 'This place has a stable climate';
let joinGaps = false;
let lieMode = false;
let charts = [
  { lo: 0, hi: 40, label: true, unit: true, title: true, disclose: false },
  { lo: 0, hi: 40, label: true, unit: true, title: true, disclose: false }
];
let dragging = null;          // {c, end}
let chipHits = [], handleHits = [];
let dataSelect, claimSelect;
let cBox = [];
let verBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  dataSelect = createSelect();
  for (const n of DATA_NAMES) dataSelect.option(n);
  dataSelect.elt.value = dataName;
  dataSelect.changed(() => { dataName = dataSelect.value(); resetAxes(); });
  dataSelect.parent(document.querySelector('main'));

  claimSelect = createSelect();
  for (const n of CLAIM_NAMES) claimSelect.option(n);
  claimSelect.elt.value = claim;
  claimSelect.changed(() => { claim = claimSelect.value(); });
  claimSelect.parent(document.querySelector('main'));

  resetAxes();
  layoutControls();
  describe('Two charts of the same dataset with independently draggable y-axes, a ' +
           'live reader impression under each, and a verdict that judges the axis ' +
           'choice against a stated claim.');
}

function ds() { return DATA[dataName]; }
function vals() { return ds().d.filter(p => p.v !== null).map(p => p.v); }
function dataRange() {
  const v = vals();
  return [Math.min.apply(null, v), Math.max.apply(null, v)];
}

function resetAxes() {
  const f = ds().full;
  for (const c of charts) { c.lo = f[0]; c.hi = f[1]; c.disclose = false; }
  // the second chart opens tight, so the contrast is immediate
  const [lo, hi] = dataRange();
  const pad = (hi - lo) * 0.12 || 0.1;
  charts[1].lo = lo - pad; charts[1].hi = hi + pad;
}

// ---- judgement -----------------------------------------------------------

function occupancy(c) {
  const [lo, hi] = dataRange();
  return (hi - lo) / Math.max(1e-9, c.hi - c.lo);
}

function impression(c) {
  const o = occupancy(c);
  const q = ds().quantity;
  if (o > 0.55) return 'This looks like dramatic variation in ' + q + '.';
  if (o > 0.25) return 'This looks like clear, readable change.';
  if (o > 0.08) return 'This looks like modest variation.';
  return 'This looks essentially flat.';
}

function tightness(c) {
  const o = occupancy(c);
  return o > 0.45 ? 'tight' : (o > 0.12 ? 'moderate' : 'wide');
}

function checklist(c) {
  const g = ds().d.some(p => p.v === null);
  return [
    { ok: c.title, q: 'chart has a title' },
    { ok: c.label, q: 'y-axis is labelled' },
    { ok: c.unit, q: 'unit is stated' },
    { ok: !g || !joinGaps, q: 'gaps are shown as gaps' },
    { ok: c.disclose || tightness(c) !== 'tight', q: 'truncated axis is disclosed' }
  ];
}

function verdict(c) {
  const want = CLAIMS[claim].wantTight;
  const t = tightness(c);
  const fails = checklist(c).filter(x => !x.ok);
  const scaleOk = want ? (t === 'tight' || t === 'moderate') : (t === 'wide' || t === 'moderate');
  if (fails.length && fails.some(x => x.q.indexOf('gaps') >= 0)) {
    return { ok: false, head: 'Misleading, whatever the axis does',
      body: 'The line is drawn straight across a six-hour hole. That segment asserts ' +
            'data that do not exist, and no axis choice can excuse it.' };
  }
  if (!scaleOk) {
    return { ok: false, head: 'Wrong scale for this claim',
      body: 'The data occupies ' + Math.round(occupancy(c) * 100) + ' per cent of the plot ' +
            'height. ' + CLAIMS[claim].why };
  }
  if (fails.length) {
    return { ok: false, head: 'Right scale, missing disclosure',
      body: 'The scale suits the claim, but ' + fails.map(x => x.q).join(' and ') +
            ' is not satisfied. A truncated axis is honest only when the reader can see ' +
            'that it is truncated.' };
  }
  return { ok: true, head: 'Defensible for this claim',
    body: 'The data occupies ' + Math.round(occupancy(c) * 100) + ' per cent of the plot ' +
          'height, the axis range is stated, and a reader can check your work.' };
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 28;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    const ch = 120;
    cBox = [{ x: margin, y: top, w: w, h: ch },
            { x: margin, y: top + ch + 32, w: w, h: ch }];
    verBox = { x: margin, y: top + 2 * ch + 64, w: w,
               h: drawHeight - (top + 2 * ch + 64) - 6 };
  } else {
    const vw = 254;
    const lw = canvasWidth - vw - 3 * margin;
    const cw = (lw - 8) / 2;
    const ch = drawHeight - top - 40;
    cBox = [{ x: margin, y: top, w: cw, h: ch },
            { x: margin + cw + 8, y: top, w: cw, h: ch }];
    verBox = { x: canvasWidth - margin - vw, y: top, w: vw, h: drawHeight - top - 6 };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  dataSelect.position(margin + 58, y0);
  dataSelect.style('width', '206px');
  claimSelect.position(isNarrow() ? margin + 58 : margin + 340, isNarrow() ? y0 + 26 : y0);
  claimSelect.style('width', '216px');
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(21);
  text('Axis Honesty Lab', canvasWidth / 2, 1);
  handleHits = [];
  drawChart(0);
  drawChart(1);
  drawVerdict();
  drawControlRegion();
}

function drawChart(i) {
  const b = cBox[i], c = charts[i], s = ds();
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();

  const L = b.x + 48, R = b.x + b.w - 8;
  const T = b.y + (c.title ? 20 : 8), B = b.y + b.h - 32;
  const xs = s.d.map(p => p.t);
  const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
  const px = t => L + (t - x0) / Math.max(1e-9, x1 - x0) * (R - L);
  const py = v => B - (v - c.lo) / Math.max(1e-9, c.hi - c.lo) * (B - T);

  if (c.title) {
    fill('#0d2b45'); textAlign(LEFT, TOP); textSize(10.5); textStyle(BOLD);
    text('Chart ' + (i + 1) + ': ' + s.quantity, b.x + 8, b.y + 5);
    textStyle(NORMAL);
  }

  // gridlines and tick labels
  stroke('#eef2f6'); strokeWeight(1);
  for (let k = 0; k <= 4; k++) { const yy = T + (B - T) * k / 4; line(L, yy, R, yy); }
  noStroke(); fill('#90a4ae'); textSize(8.5); textAlign(RIGHT, CENTER);
  for (let k = 0; k <= 4; k++) {
    const v = c.hi - (c.hi - c.lo) * k / 4;
    text(v.toFixed(Math.abs(c.hi - c.lo) < 5 ? 2 : (Math.abs(c.hi - c.lo) < 40 ? 1 : 0)),
         L - 4, T + (B - T) * k / 4);
  }
  if (c.label) {
    push();
    translate(b.x + 10, (T + B) / 2);
    rotate(-Math.PI / 2);
    noStroke(); fill('#546e7a'); textAlign(CENTER, CENTER); textSize(9);
    text(s.quantity + (c.unit ? ' (' + s.unit + ')' : ''), 0, 0);
    pop();
  } else if (c.unit) {
    noStroke(); fill('#546e7a'); textAlign(LEFT, TOP); textSize(9);
    text(s.unit, b.x + 6, T - 1);
  }

  // the data
  stroke(i === 0 ? '#1565c0' : '#c62828'); strokeWeight(1.8); noFill();
  if (joinGaps) {
    beginShape();
    for (const p of s.d) if (p.v !== null) vertex(px(p.t), py(constrain(p.v, c.lo, c.hi)));
    endShape();
  } else {
    let started = false;
    beginShape();
    for (const p of s.d) {
      if (p.v === null) { if (started) { endShape(); started = false; } continue; }
      if (!started) { beginShape(); started = true; }
      vertex(px(p.t), py(constrain(p.v, c.lo, c.hi)));
    }
    if (started) endShape();
  }
  if (s.d.length <= 20) {
    noStroke(); fill(i === 0 ? '#1565c0' : '#c62828');
    for (const p of s.d) if (p.v !== null) circle(px(p.t), py(constrain(p.v, c.lo, c.hi)), 5);
  }

  // gap shading
  const gaps = [];
  let gs = null;
  for (const p of s.d) {
    if (p.v === null && gs === null) gs = p.t;
    if (p.v !== null && gs !== null) { gaps.push([gs, p.t]); gs = null; }
  }
  for (const [a, z] of gaps) {
    noStroke(); fill(198, 40, 40, 30);
    rect(px(a), T, px(z) - px(a), B - T);
    fill('#b71c1c'); textAlign(CENTER, TOP); textSize(8.5);
    text(joinGaps ? 'line invented here' : 'no data', (px(a) + px(z)) / 2, T + 2);
  }

  noStroke(); fill('#90a4ae'); textSize(8.5); textAlign(RIGHT, TOP);
  text(x0 + ' to ' + x1 + ' ' + s.xlab, R, B + 2);

  // draggable axis handles
  for (const end of ['hi', 'lo']) {
    const yy = end === 'hi' ? T : B;
    noStroke(); fill(dragging && dragging.c === i && dragging.end === end
                     ? '#0d47a1' : '#90a4ae');
    rect(L - 34, yy - 4, 9, 8, 2);
    handleHits.push({ x: L - 38, y: yy - 9, w: 20, h: 18, c: i, end: end });
  }

  // occupancy and disclosure
  const occ = occupancy(c);
  noStroke();
  fill(occ > 0.45 ? '#b71c1c' : (occ < 0.12 ? '#1565c0' : '#546e7a'));
  textAlign(LEFT, BOTTOM); textSize(8.5);
  text('fills ' + Math.round(occ * 100) + '% of the height', b.x + 6, b.y + b.h - 3);
  textAlign(RIGHT, BOTTOM);
  text('axis ' + c.lo.toFixed(1) + ' to ' + c.hi.toFixed(1), b.x + b.w - 6, b.y + b.h - 3);
  if (c.disclose) {
    noStroke(); fill('#ef6c00');
    rect(R - 76, T + 2, 74, 12, 2);
    fill('#ffffff'); textAlign(CENTER, CENTER); textSize(8);
    text('axis does not start at 0', R - 39, T + 8);
  }

  // reader impression
  const iy = b.y + b.h + 2;
  noStroke(); fill('#eceff1');
  rect(b.x, iy, b.w, 24, 3);
  fill('#37474f'); textAlign(LEFT, CENTER); textSize(9.5);
  let imp = 'A reader would say: ' + impression(c);
  while (textWidth(imp) > b.w - 14 && imp.length > 10) imp = imp.slice(0, -2) + '…';
  text(imp, b.x + 7, iy + 12);
}

function drawVerdict() {
  const b = verBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 10, W = b.w - 20;
  let y = b.y + 7;
  const [lo, hi] = dataRange();

  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('the same data, both charts', L, y);
  y += 13;
  fill('#0d2b45'); textSize(10.5);
  text('true variation: ' + (hi - lo).toFixed(2) + ' ' + ds().unit, L, y);
  y += 14;
  if (!isNarrow()) {
    fill('#78909c'); textSize(9.5);
    y = para(L, y, W, ds().note, 11, 9.5) + 8;
  } else y += 2;

  if (lieMode) {
    fill('#6a1b9a'); textSize(11); textStyle(BOLD);
    text('Make it lie', L, y); textStyle(NORMAL);
    y += 15;
    fill('#33475b'); textSize(10);
    y = para(L, y, W, 'Set chart 2 so a reader would conclude the opposite of the truth. ' +
        'For a week that varies by ' + (hi - lo).toFixed(2) + ' ' + ds().unit +
        ', make it look dramatic. It takes about two drags.', 11.5, 10) + 6;
    const occ = occupancy(charts[1]);
    const lied = occ > 0.55;
    fill(lied ? '#b71c1c' : '#78909c'); textSize(10.5); textStyle(BOLD);
    text(lied ? 'You did it. Now look at the checklist.' : 'Not yet dramatic enough.', L, y);
    textStyle(NORMAL); y += 15;
    if (lied) {
      fill('#33475b'); textSize(10);
      y = para(L, y, W, 'Nothing you plotted is false. Every point is real. What would have ' +
          'protected the reader is disclosure: the axis range stated, and a note that it ' +
          'does not start at zero. Turn on "disclose truncation" for chart 2 and read the ' +
          'impression again.', 11.5, 10);
    }
    return;
  }

  // Narrow has room for one verdict, so show the chart the learner is changing.
  const first = isNarrow() ? 1 : 0;
  for (let i = first; i < 2; i++) {
    const v = verdict(charts[i]);
    noStroke(); fill(v.ok ? '#e8f5e9' : '#fdeeee');
    rect(L, y, W, 30, 3);
    fill(v.ok ? '#1b5e20' : '#b71c1c'); textSize(10.5); textStyle(BOLD);
    text('Chart ' + (i + 1) + ': ' + v.head, L + 6, y + 3);
    textStyle(NORMAL); textSize(9);
    fill('#546e7a');
    text(tightness(charts[i]) + ' axis, ' + Math.round(occupancy(charts[i]) * 100) + '% filled',
         L + 6, y + 18);
    y += 34;
    fill('#33475b'); textSize(9.5);
    y = para(L, y, W, v.body, 11, 9.5) + 8;
    if (y > b.y + b.h - 70) break;
  }

  // The honesty checklist for chart 2. When space is short, show only what is
  // still unsatisfied, which is the actionable half.
  const items = checklist(charts[1]);
  const room = b.y + b.h - y;
  const shortList = room < 80;
  const list = shortList ? items.filter(x => !x.ok) : items;
  if (room > 34 && list.length) {
    fill('#5a6a78'); textSize(9.5); textAlign(LEFT, TOP);
    text(shortList ? 'chart 2 still needs' : 'chart 2 checklist', L, y);
    y += 13;
    for (const item of list) {
      if (y + 13 > b.y + b.h - 2) break;
      noStroke(); fill(item.ok ? '#2e7d32' : '#ffffff');
      stroke(item.ok ? '#1b5e20' : '#b0bec5'); strokeWeight(1);
      rect(L, y + 1, 9, 9, 2);
      noStroke();
      if (item.ok) {
        stroke('#fff'); strokeWeight(1.6);
        line(L + 2, y + 5.4, L + 4, y + 7.8); line(L + 4, y + 7.8, L + 7.2, y + 3);
        noStroke();
      }
      fill(item.ok ? '#1b5e20' : '#b71c1c'); textSize(9.5); textAlign(LEFT, TOP);
      text(item.q, L + 15, y);
      y += 13;
    }
  }
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 8;
  const narrow = isNarrow();
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
  text('Data', margin, y0 + 11);
  text('Claim', narrow ? margin : margin + 290, (narrow ? y0 + 26 : y0) + 11);

  chipHits = [];
  let y2 = narrow ? y0 + 56 : y0 + 32;
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('chart 2:', margin, y2 + 6);
  let x = margin + 48;
  x = chipSm(x, y2, 'title', charts[1].title) + 4;
  x = chipSm(x, y2, 'axis label', charts[1].label) + 4;
  x = chipSm(x, y2, 'unit', charts[1].unit) + 4;
  x = chipSm(x, y2, 'disclose truncation', charts[1].disclose) + 4;
  y2 += 26;
  x = margin;
  x = chip(x, y2, joinGaps ? 'Joining across gaps' : 'Join across gaps', joinGaps) + 6;
  x = chip(x, y2, 'Match chart 1', false) + 6;
  x = chip(x, y2, 'Fit chart 2 to the data', false) + 6;
  chip(x, y2, lieMode ? 'Leave lie mode' : 'Make it lie', lieMode);

  fill('#8a97a4'); textAlign(LEFT, TOP); textSize(9.5);
  para(margin, y2 + 28, canvasWidth - 2 * margin,
       'Drag the small grey handles beside either y-axis to change its range. Both ' +
       'charts plot the same array, so any difference you see is presentation.', 11, 9.5);
}

function chip(x, y, label, on) {
  textSize(11); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 16;
  const h = 23;
  noStroke(); fill(on ? '#1565c0' : '#e8eef4');
  stroke(on ? '#0d47a1' : '#b6c4d2'); strokeWeight(1);
  rect(x, y, w, h, 5);
  noStroke(); fill(on ? '#ffffff' : '#33475b');
  text(label, x + w / 2, y + h / 2 + 1);
  chipHits.push({ x: x, y: y, w: w, h: h, label: label });
  return x + w;
}

function chipSm(x, y, label, on) {
  textSize(10); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 12;
  const h = 20;
  noStroke(); fill(on ? '#1565c0' : '#eef2f6');
  stroke(on ? '#0d47a1' : '#c3ced8'); strokeWeight(1);
  rect(x, y, w, h, 4);
  noStroke(); fill(on ? '#ffffff' : '#37474f');
  text(label, x + w / 2, y + h / 2 + 1);
  chipHits.push({ x: x, y: y, w: w, h: h, label: 'sm:' + label });
  return x + w;
}

// ---- interaction ---------------------------------------------------------

function mousePressed() {
  for (const c of chipHits) {
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      onChip(c.label);
      return false;
    }
  }
  for (const h of handleHits) {
    if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) {
      dragging = { c: h.c, end: h.end };
      return false;
    }
  }
  return true;
}

function mouseDragged() {
  if (!dragging) return true;
  const i = dragging.c, b = cBox[i], c = charts[i];
  const T = b.y + (c.title ? 20 : 8), B = b.y + b.h - 26;
  const frac = constrain((B - mouseY) / Math.max(1, B - T), -0.6, 1.6);
  const span = c.hi - c.lo;
  const at = c.lo + frac * span;
  const [dlo, dhi] = dataRange();
  const minSpan = Math.max(0.02, (dhi - dlo) * 0.05);
  if (dragging.end === 'hi') c.hi = Math.max(at, c.lo + minSpan);
  else c.lo = Math.min(at, c.hi - minSpan);
  return false;
}

function mouseReleased() { dragging = null; return true; }

function onChip(label) {
  if (label.indexOf('sm:') === 0) {
    const k = label.slice(3);
    if (k === 'title') charts[1].title = !charts[1].title;
    else if (k === 'axis label') charts[1].label = !charts[1].label;
    else if (k === 'unit') charts[1].unit = !charts[1].unit;
    else charts[1].disclose = !charts[1].disclose;
    return;
  }
  if (label === 'Join across gaps' || label === 'Joining across gaps') joinGaps = !joinGaps;
  else if (label === 'Match chart 1') {
    charts[1].lo = charts[0].lo; charts[1].hi = charts[0].hi;
  } else if (label === 'Fit chart 2 to the data') {
    const [lo, hi] = dataRange();
    const pad = (hi - lo) * 0.12 || 0.1;
    charts[1].lo = lo - pad; charts[1].hi = hi + pad;
  } else if (label === 'Make it lie') { lieMode = true; }
  else if (label === 'Leave lie mode') lieMode = false;
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
  let ln = '';
  for (const w of words) {
    const trial = ln.length ? ln + ' ' + w : w;
    if (textWidth(trial) > maxW && ln.length) { out.push(ln); ln = w; }
    else ln = trial;
  }
  out.push(ln);
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
