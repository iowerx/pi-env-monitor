// Sampling Interval Trade-off Bench MicroSim
// CANVAS_HEIGHT: 652
// Bloom Level: Evaluate (L5) - the learner justifies a sampling interval for a
// stated purpose, weighing captured detail against file size, card wear and power.
// Every scenario is a continuous function of time, so the true signal is exactly
// computable at any instant and the reconstruction is exactly what a reader of
// the CSV would see. The purpose selector is the point: the same 60-second
// interval is excellent for one job and useless for another.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 492;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 740;

const BYTES_PER_ROW = 60;          // the chapter's figure for a five-field row
const PI_BASELINE_MAH = 9600;      // a Pi 4 idling at about 400 mA for 24 hours
// Incremental cost of one logged reading: CPU wake, sensor conversion, SD append.
const MAH_PER_READING = 0.12 * 0.040 / 3.6 + 0.0007 * 0.012 / 3.6 + 0.06 * 0.015 / 3.6;

// ---- scenarios -----------------------------------------------------------
// t runs 0..span seconds. fn(t) returns the true value.

const SCEN = {
  'A calm day': {
    span: 86400, unit: '°C', label: 'air temperature',
    lo: 10, hi: 26, xlab: 'hours',
    fn: t => 18 + 6 * Math.sin(2 * Math.PI * (t - 6 * 3600) / 86400),
    features: []
  },
  'A cold front passing': {
    span: 7200, unit: '°C', label: 'air temperature',
    lo: 14, hi: 22, xlab: 'minutes',
    fn: t => 20 - 4 / (1 + Math.exp(-(t - 3600) / 80)),
    features: [{ t0: 3480, t1: 3960, name: 'frontal passage, 8 minutes' }]
  },
  'A gust front': {
    span: 600, unit: 'm/s', label: 'wind speed',
    lo: 0, hi: 20, xlab: 'minutes',
    fn: t => 5 + 12 * Math.exp(-Math.pow((t - 300) / 15, 2)) + 0.6 * Math.sin(t / 3),
    features: [{ t0: 285, t1: 315, name: 'gust, 30 seconds' }]
  },
  'A seismic P wave': {
    span: 10, unit: 'mm', label: 'ground displacement',
    lo: -2.4, hi: 2.4, xlab: 'seconds',
    fn: t => 2 * Math.exp(-Math.pow((t - 5) / 0.25, 2)) * Math.sin(2 * Math.PI * 8 * t),
    features: [{ t0: 4.55, t1: 5.45, name: 'P wave arrival, under one second' }]
  },
  'A passing cloud': {
    span: 600, unit: 'W/m²', label: 'solar irradiance',
    lo: 100, hi: 1000, xlab: 'minutes',
    fn: t => 900 - 700 * Math.exp(-Math.pow((t - 300) / 45, 2)),
    features: [{ t0: 255, t1: 345, name: 'cloud shadow, 90 seconds' }]
  }
};
const SCEN_NAMES = Object.keys(SCEN);

const INTERVALS = [0.01, 1, 10, 60, 300, 900];
function intervalLabel(dt) {
  if (dt < 1) return (1 / dt) + ' per second';
  if (dt < 60) return dt + ' s';
  if (dt < 3600) return (dt / 60) + ' min';
  return (dt / 3600) + ' h';
}

// Each purpose states the slowest interval that still does its job.
const PURPOSE = {
  'Daily weather summary': { need: 900, why: 'A daily mean and a daily range only need ' +
    'a handful of readings an hour.' },
  'Detect frontal passages': { need: 60, why: 'A front takes about eight minutes to ' +
    'pass. You need several samples inside that to see its shape rather than a step.' },
  'Wind gust analysis': { need: 3, why: 'Gusts last seconds. The standard practice is ' +
    'to sample every one to three seconds and report 60-second averages.' },
  'Earthquake detection': { need: 0.01, why: 'A P wave lasts a fraction of a second, ' +
    'which is why seismic channels run at 100 samples per second.' },
  'Solar panel sizing': { need: 60, why: 'Daily energy is an integral, so 60 s is fine ' +
    'for sizing. Go to 10 s only if you care about individual cloud events.' }
};
const PURPOSE_NAMES = Object.keys(PURPOSE);

// ---- state ----
let scenName = 'A cold front passing';
let dt = 60;
let purpose = 'Detect frontal passages';
let showThinned = false;
let chipHits = [];
let scenSelect, intSelect, purposeSelect;
let sigBox = { x: 0, y: 0, w: 10, h: 10 };
let recBox = { x: 0, y: 0, w: 10, h: 10 };
let costBox = { x: 0, y: 0, w: 10, h: 10 };
let verBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  scenSelect = createSelect();
  for (const n of SCEN_NAMES) scenSelect.option(n);
  scenSelect.elt.value = scenName;
  scenSelect.changed(() => { scenName = scenSelect.value(); showThinned = false; });
  scenSelect.parent(document.querySelector('main'));

  intSelect = createSelect();
  for (const i of INTERVALS) intSelect.option(intervalLabel(i), i);
  intSelect.elt.value = String(dt);
  intSelect.changed(() => { dt = parseFloat(intSelect.value()); showThinned = false; });
  intSelect.parent(document.querySelector('main'));

  purposeSelect = createSelect();
  for (const n of PURPOSE_NAMES) purposeSelect.option(n);
  purposeSelect.elt.value = purpose;
  purposeSelect.changed(() => { purpose = purposeSelect.value(); });
  purposeSelect.parent(document.querySelector('main'));

  layoutControls();
  describe('A true continuous signal, the series a logger would actually record at ' +
           'the chosen interval, and a cost dashboard, with a verdict that depends ' +
           'on the stated monitoring purpose.');
}

// ---- sampling ------------------------------------------------------------

function sc() { return SCEN[scenName]; }

function samples() {
  const s = sc();
  const out = [];
  const n = Math.floor(s.span / dt);
  const cap = 4000;
  const stride = Math.max(1, Math.ceil(n / cap));
  for (let i = 0; i <= n; i += stride) {
    const t = i * dt;
    out.push({ t: t, v: s.fn(t) });
  }
  return out;
}

function sampleCount() { return Math.floor(sc().span / dt) + 1; }

// Block-average the fastest series down to the chosen interval.
function thinned() {
  const s = sc();
  const fast = 0.01;
  const out = [];
  for (let t = 0; t + dt <= s.span + 1e-9; t += dt) {
    let sum = 0, n = 0;
    for (let u = t; u < t + dt; u += fast) { sum += s.fn(u); n += 1; if (n > 5000) break; }
    out.push({ t: t + dt / 2, v: sum / Math.max(1, n) });
  }
  return out;
}

function featureStatus(f) {
  const n = Math.floor(sc().span / dt);
  let inside = 0;
  const i0 = Math.ceil(f.t0 / dt), i1 = Math.floor(f.t1 / dt);
  for (let i = Math.max(0, i0); i <= Math.min(n, i1); i++) inside += 1;
  if (inside === 0) return { n: 0, word: 'MISSED', col: '#b71c1c' };
  if (inside <= 2) return { n: inside, word: 'BLURRED', col: '#e65100' };
  return { n: inside, word: 'CAPTURED', col: '#1b5e20' };
}

function costs() {
  const perDay = 86400 / dt;
  const bytesDay = perDay * BYTES_PER_ROW;
  const mbYear = bytesDay * 365 / 1e6;
  const writesYear = perDay * 365;
  const mah = perDay * MAH_PER_READING;
  return { perDay: perDay, bytesDay: bytesDay, mbYear: mbYear,
           writesYear: writesYear, mah: mah };
}

function humanBytes(b) {
  if (b >= 1e9) return (b / 1e9).toFixed(1) + ' GB';
  if (b >= 1e6) return (b / 1e6).toFixed(1) + ' MB';
  if (b >= 1e3) return (b / 1e3).toFixed(0) + ' KB';
  return b.toFixed(0) + ' B';
}
function humanNum(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + ' billion';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + ' million';
  if (n >= 1e3) return Math.round(n).toLocaleString('en-US');
  return String(Math.round(n));
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 28;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    sigBox = { x: margin, y: top, w: w, h: 108 };
    recBox = { x: margin, y: top + 113, w: w, h: 108 };
    costBox = { x: margin, y: top + 226, w: w, h: 92 };
    verBox = { x: margin, y: top + 323, w: w, h: drawHeight - (top + 323) - 6 };
  } else {
    const vw = 268;
    const lw = canvasWidth - vw - 3 * margin;
    const h = Math.floor((drawHeight - top - 6 - 12) / 3);
    sigBox = { x: margin, y: top, w: lw, h: h };
    recBox = { x: margin, y: top + h + 6, w: lw, h: h };
    costBox = { x: margin, y: top + 2 * h + 12, w: lw, h: h };
    verBox = { x: canvasWidth - margin - vw, y: top, w: vw, h: drawHeight - top - 6 };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  const narrow = isNarrow();
  scenSelect.position(margin + 62, y0);
  scenSelect.style('width', '176px');
  intSelect.position(narrow ? margin + 62 : margin + 330, narrow ? y0 + 26 : y0);
  intSelect.style('width', '116px');
  purposeSelect.position(narrow ? margin + 62 : margin + 558, narrow ? y0 + 52 : y0);
  purposeSelect.style('width', '178px');
}

// ---- drawing helpers -----------------------------------------------------

function axes(b, s) {
  const L = b.x + 34, R = b.x + b.w - 8, T = b.y + 17, B = b.y + b.h - 14;
  return { L: L, R: R, T: T, B: B,
    px: t => L + t / s.span * (R - L),
    py: v => B - (v - s.lo) / (s.hi - s.lo) * (B - T) };
}

function frame(b, title, sub) {
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke(); fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text(title, b.x + 8, b.y + 4);
  if (sub) { textAlign(RIGHT, TOP); text(sub, b.x + b.w - 8, b.y + 4); }
}

function gridAndLabels(b, s, a) {
  stroke('#eef2f6'); strokeWeight(1);
  for (let i = 0; i <= 4; i++) {
    const yy = a.T + (a.B - a.T) * i / 4;
    line(a.L, yy, a.R, yy);
  }
  noStroke(); fill('#90a4ae'); textSize(8.5); textAlign(RIGHT, CENTER);
  text(s.hi.toFixed(s.hi % 1 ? 1 : 0), a.L - 3, a.T);
  text(s.lo.toFixed(s.lo % 1 ? 1 : 0), a.L - 3, a.B);
  textAlign(LEFT, TOP);
  text('0', a.L, a.B + 2);
  textAlign(RIGHT, TOP);
  const total = s.xlab === 'hours' ? s.span / 3600
              : (s.xlab === 'minutes' ? s.span / 60 : s.span);
  text(total + ' ' + s.xlab, a.R, a.B + 2);
}

function drawFeatures(b, s, a, withStatus) {
  for (const f of s.features) {
    const x0 = a.px(f.t0), x1 = a.px(f.t1);
    noStroke(); fill(255, 236, 179, 120);
    rect(x0, a.T, Math.max(2, x1 - x0), a.B - a.T);
    stroke('#ffb300'); strokeWeight(1);
    line(x0, a.T, x0, a.B); line(x1, a.T, x1, a.B);
    noStroke();
    const st = featureStatus(f);
    textSize(8.5); textAlign(LEFT, TOP);
    let lab = f.name;
    if (withStatus) lab = st.word + ' - ' + f.name;
    const lw = textWidth(lab) + 8;
    let lx = (x0 + x1) / 2 - lw / 2;
    lx = Math.max(a.L, Math.min(lx, a.R - lw));
    fill(255, 236);
    rect(lx, a.T + 1, lw, 12, 2);
    fill(withStatus ? st.col : '#8d6e00');
    text(lab, lx + 4, a.T + 2);
    if (withStatus && st.n === 0) {
      fill('#b71c1c'); textAlign(CENTER, TOP); textSize(8.5);
      text('no sample fell inside this event', (x0 + x1) / 2, a.T + 15);
    }
  }
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(21);
  text('Sampling Interval Trade-off Bench', canvasWidth / 2, 1);
  drawSignal();
  drawRecon();
  drawCost();
  drawVerdict();
  drawControlRegion();
}

function drawSignal() {
  const b = sigBox, s = sc();
  frame(b, 'the true signal: ' + s.label + ' (' + s.unit + ')',
        sampleCount() > 1 ? sampleCount().toLocaleString('en-US') + ' samples' : '');
  const a = axes(b, s);
  gridAndLabels(b, s, a);
  drawFeatures(b, s, a, false);
  stroke('#1565c0'); strokeWeight(1.8); noFill();
  beginShape();
  const n = Math.max(240, Math.floor(b.w));
  for (let i = 0; i <= n; i++) {
    const t = s.span * i / n;
    vertex(a.px(t), a.py(constrain(s.fn(t), s.lo, s.hi)));
  }
  endShape();
  // sample instants
  const sm = samples();
  if (sm.length <= 600) {
    noStroke(); fill('#0d47a1');
    for (const p of sm) circle(a.px(p.t), a.py(constrain(p.v, s.lo, s.hi)), 3.4);
  } else {
    stroke(13, 71, 161, 90); strokeWeight(0.6);
    for (const p of sm) line(a.px(p.t), a.B, a.px(p.t), a.T);
  }
  noStroke();
}

function drawRecon() {
  const b = recBox, s = sc();
  frame(b, 'what the CSV actually contains, joined by straight lines',
        'interval ' + intervalLabel(dt));
  const a = axes(b, s);
  gridAndLabels(b, s, a);
  drawFeatures(b, s, a, true);
  const sm = samples();
  stroke('#c62828'); strokeWeight(1.8); noFill();
  beginShape();
  for (const p of sm) vertex(a.px(p.t), a.py(constrain(p.v, s.lo, s.hi)));
  endShape();
  if (sm.length <= 600) {
    noStroke(); fill('#c62828');
    for (const p of sm) circle(a.px(p.t), a.py(constrain(p.v, s.lo, s.hi)), 3.4);
  }
  if (showThinned) {
    const th = thinned();
    stroke('#2e7d32'); strokeWeight(1.6); noFill();
    drawingContext.setLineDash([5, 3]);
    beginShape();
    for (const p of th) vertex(a.px(p.t), a.py(constrain(p.v, s.lo, s.hi)));
    endShape();
    drawingContext.setLineDash([]);
    noStroke(); fill('#1b5e20'); textAlign(LEFT, BOTTOM); textSize(8.5);
    text('green: 100 Hz data averaged down to ' + intervalLabel(dt),
         a.L + 2, a.B - 2);
  }
  noStroke();
}

function drawCost() {
  const b = costBox;
  frame(b, 'what it costs', '60 bytes per row');
  const c = costs();
  const L = b.x + 9, W = b.w - 18;
  let y = b.y + 18;
  const rows = [
    ['readings per day', humanNum(c.perDay)],
    ['bytes per day', humanBytes(c.bytesDay)],
    ['per year', humanBytes(c.mbYear * 1e6)],
    ['write operations per year', humanNum(c.writesYear)],
    ['extra power per day', c.mah < 1 ? c.mah.toFixed(2) + ' mAh'
                                      : Math.round(c.mah).toLocaleString('en-US') + ' mAh']
  ];
  const two = W > 300;
  const cw = two ? W / 2 : W;
  for (let i = 0; i < rows.length; i++) {
    const cx = L + (two ? (i % 2) * cw : 0);
    const cy = y + (two ? Math.floor(i / 2) : i) * 14;
    if (cy + 13 > b.y + b.h - 16) break;
    fill('#8a97a4'); textAlign(LEFT, TOP); textSize(9.5);
    text(rows[i][0], cx, cy);
    fill('#0d2b45'); textAlign(RIGHT, TOP); textSize(9.8);
    text(rows[i][1], cx + cw - 12, cy);
  }
  const used = two ? Math.ceil(rows.length / 2) * 14 : rows.length * 14;
  const pct = c.mah / PI_BASELINE_MAH * 100;
  fill(pct > 20 ? '#b71c1c' : '#78909c'); textAlign(LEFT, TOP); textSize(9);
  para(L, y + used + 2, W, 'The Pi itself draws about ' +
       PI_BASELINE_MAH.toLocaleString('en-US') + ' mAh a day, so this is ' +
       (pct < 0.1 ? 'under 0.1' : pct.toFixed(1)) + ' per cent on top. Power is ' +
       (pct > 20 ? 'now a real constraint.' : 'not what decides this; card wear is.'),
       10, 9);
}

function drawVerdict() {
  const b = verBox, s = sc();
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 10, W = b.w - 20;
  let y = b.y + 7;
  const p = PURPOSE[purpose];
  const ok = dt <= p.need;
  const marginal = !ok && dt <= p.need * 5;

  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('for the purpose: ' + purpose, L, y);
  y += 15;
  noStroke(); fill(ok ? '#e8f5e9' : (marginal ? '#fff8e1' : '#fdeeee'));
  rect(L, y, W, 34, 3);
  fill(ok ? '#1b5e20' : (marginal ? '#e65100' : '#b71c1c'));
  textSize(12.5); textStyle(BOLD);
  text(intervalLabel(dt) + ' is ' + (ok ? 'adequate' : (marginal ? 'marginal' : 'not adequate')),
       L + 7, y + 5);
  textStyle(NORMAL); textSize(9.5);
  text('this purpose needs ' + intervalLabel(p.need) + ' or faster', L + 7, y + 20);
  y += 42;

  fill('#33475b'); textSize(10.5);
  y = para(L, y, W, p.why, 12, 10.5) + 8;

  if (s.features.length) {
    fill('#5a6a78'); textSize(9.5); textAlign(LEFT, TOP);
    text('in this scenario', L, y);
    y += 13;
    for (const f of s.features) {
      const st = featureStatus(f);
      noStroke(); fill(st.col);
      rect(L, y + 1, 4, 11, 1);
      fill(st.col); textSize(10.5); textStyle(BOLD);
      text(st.word, L + 9, y);
      textStyle(NORMAL); fill('#546e7a'); textSize(9.5);
      y += 13;
      y = para(L + 9, y, W - 9, st.n === 0
        ? 'No sample fell inside the ' + f.name + '. In the file it did not happen.'
        : st.n + ' sample' + (st.n === 1 ? '' : 's') + ' inside the ' + f.name +
          (st.n <= 2 ? '. Enough to know something happened, not enough to describe it.'
                     : '. Enough to see its shape.'), 11, 9.5) + 6;
    }
  } else {
    fill('#1b5e20'); textSize(10.5);
    y = para(L, y, W, 'Nothing in this signal changes faster than the slowest ' +
             'interval here. Faster sampling buys nothing.', 12, 10.5) + 6;
  }

  // The asymmetry is a required caption, so it is drawn inline rather than
  // anchored to a panel bottom that a narrow layout may never reach.
  const asym = 'You can always thin dense data later. You can never recover detail ' +
               'you never captured.';
  if (b.y + b.h - y > 30) {
    stroke('#e3e9ef'); strokeWeight(1);
    line(L, y, L + W, y);
    noStroke(); fill(showThinned ? '#1b5e20' : '#78909c'); textSize(9.5);
    y = para(L, y + 6, W, asym, 11, 9.5) + 8;
  }

  // every option at once, so the choice is made against alternatives
  if (b.y + b.h - y > 96) {
    fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
    text('every interval, for this purpose', L, y);
    y += 13;
    for (const iv of INTERVALS) {
      const fits = iv <= p.need;
      const perDay = 86400 / iv;
      const mby = perDay * BYTES_PER_ROW * 365;
      const here = Math.abs(iv - dt) < 1e-9;
      noStroke(); fill(here ? '#eef4fb' : '#ffffff');
      rect(L, y - 1, W, 13);
      fill(here ? '#0d47a1' : '#37474f'); textSize(9.5); textAlign(LEFT, TOP);
      if (here) textStyle(BOLD);
      text(intervalLabel(iv), L + 3, y);
      textStyle(NORMAL);
      fill('#546e7a'); textAlign(RIGHT, TOP);
      text(humanBytes(mby) + '/yr', L + W * 0.66, y);
      fill(fits ? '#1b5e20' : '#b71c1c'); textAlign(RIGHT, TOP);
      text(fits ? 'fits' : 'too slow', L + W, y);
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
  text('Scenario', margin, y0 + 11);
  text('Interval', narrow ? margin : margin + 272, (narrow ? y0 + 26 : y0) + 11);
  text('Purpose', narrow ? margin : margin + 500, (narrow ? y0 + 52 : y0) + 11);

  chipHits = [];
  const cy = narrow ? y0 + 84 : y0 + 36;
  let x = margin;
  x = chip(x, cy, showThinned ? 'Hide the thinned series' : 'Thin 100 Hz data to this interval',
           showThinned) + 6;
  chip(x, cy, 'Fastest that fits the purpose', false);

  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
  para(margin, cy + 30, canvasWidth - 2 * margin,
       'The verdict depends on the purpose, not on the interval alone. Change the ' +
       'purpose without touching the interval and watch the same choice become right ' +
       'or wrong.', 11.5, 10);
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

function mousePressed() {
  for (const c of chipHits) {
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      if (c.label === 'Fastest that fits the purpose') {
        dt = PURPOSE[purpose].need;
        intSelect.elt.value = String(dt);
        showThinned = false;
      } else showThinned = !showThinned;
      return false;
    }
  }
  return true;
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
