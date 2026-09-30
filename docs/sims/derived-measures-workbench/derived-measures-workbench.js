// Derived Measures Workbench MicroSim
// CANVAS_HEIGHT: 664
// Bloom Level: Apply (L3) - the learner calculates pressure tendency, insolation,
// sustained wind and gust from a raw series, and explains why each needs a span
// rather than a single reading.
// A sliding window is the representation, because that is what these measures
// are: functions of a span, not conversions of one number. The arithmetic panel
// and the derived series are both computed from the samples inside the window,
// so the numbers on screen cannot disagree with the curve beneath them.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 496;
let controlHeight = 168;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 740;
const MONO = 'monospace';

// ---- source series -------------------------------------------------------
// One sample per step; step size differs per mode, which is the point.

function mkPressure() {                 // 48 hours, one sample per 10 minutes
  const d = [];
  for (let i = 0; i < 288; i++) {
    const h = i / 6;
    let v = 1014.5 + 1.2 * Math.sin(h / 5.5);
    if (h > 14 && h < 30) v -= 7.5 * (1 - Math.cos(Math.PI * (h - 14) / 16)) / 2;
    if (h >= 30) v -= 7.5 - 5.2 * (h - 30) / 18;
    v += 0.25 * Math.sin(h * 1.7);
    d.push({ t: i, v: v });
  }
  return d;
}
function mkIrradiance() {               // 24 hours, one sample per minute
  const d = [];
  for (let i = 0; i < 1440; i++) {
    const h = i / 60;
    let v = 0;
    if (h > 6 && h < 19.2) {
      v = 880 * Math.sin(Math.PI * (h - 6) / 13.2);
      const cloud = Math.exp(-Math.pow((h - 14.2) / 0.45, 2));
      v *= 1 - 0.72 * cloud;
      v *= 1 - 0.1 * Math.max(0, Math.sin(h * 5.1));
    }
    d.push({ t: i, v: Math.max(0, v) });
  }
  return d;
}
function mkWind(seed) {                 // 20 minutes, one sample per second
  const d = [];
  let x = seed;
  for (let i = 0; i < 1200; i++) {
    x = (x * 16807) % 2147483647;
    const r = x / 2147483647;
    const base = 7.2 + 1.6 * Math.sin(i / 260) + 0.9 * Math.sin(i / 47);
    let v = base + (r - 0.5) * 1.1;
    // one real gust, and one spike too small to qualify
    v += 4.6 * Math.exp(-Math.pow((i - 640) / 11, 2));
    v += 1.4 * Math.exp(-Math.pow((i - 300) / 8, 2));
    d.push({ t: i, v: Math.max(0, v) });
  }
  return d;
}

const MODES = {
  'Pressure tendency': {
    data: mkPressure(), unit: 'hPa', step: 600, win: 10800, lo: 1000, hi: 1018,
    xlab: 'hours', xdiv: 6, dlo: -8, dhi: 4, dunit: 'hPa / 3 h',
    quantity: 'station pressure', derived: 'tendency'
  },
  'Insolation': {
    data: mkIrradiance(), unit: 'W/m²', step: 60, win: 86400, lo: 0, hi: 950,
    xlab: 'hours', xdiv: 60, dlo: 0, dhi: 7, dunit: 'kWh/m²',
    quantity: 'solar irradiance', derived: 'accumulated insolation'
  },
  'Sustained wind': {
    data: mkWind(12345), unit: 'm/s', step: 1, win: 120, lo: 0, hi: 16,
    xlab: 'minutes', xdiv: 60, dlo: 4, dhi: 12, dunit: 'm/s',
    quantity: 'wind speed', derived: 'sustained wind'
  },
  'Wind gust': {
    data: mkWind(12345), unit: 'm/s', step: 1, win: 120, lo: 0, hi: 16,
    xlab: 'minutes', xdiv: 60, dlo: 4, dhi: 16, dunit: 'm/s',
    quantity: 'wind speed', derived: 'reported gust'
  }
};
const MODE_NAMES = Object.keys(MODES);

const TENDENCY = [
  { min: 3, cat: 'Rising rapidly', mean: 'Clearing; wind may increase' },
  { min: 1, cat: 'Rising', mean: 'Improving' },
  { min: -1, cat: 'Steady', mean: 'No change expected' },
  { min: -3, cat: 'Falling', mean: 'Deteriorating' },
  { min: -6, cat: 'Falling rapidly', mean: 'Storm approaching' },
  { min: -1e9, cat: 'Falling very rapidly', mean: 'Severe weather likely' }
];
const GUST_THRESHOLD = 2.6;      // 5 knots, the conventional margin

// ---- state ----
let modeName = 'Pressure tendency';
let cursor = 0.62;               // fraction along the series, right edge of the window
let windowTen = false;           // the 10-minute WMO sustained window
let showFormula = true;
let playing = false;
let dragging = false;
let chipHits = [];
let modeSelect;
let rawBox = { x: 0, y: 0, w: 10, h: 10 };
let mathBox = { x: 0, y: 0, w: 10, h: 10 };
let derBox = { x: 0, y: 0, w: 10, h: 10 };
let resBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');
  modeSelect = createSelect();
  for (const n of MODE_NAMES) modeSelect.option(n);
  modeSelect.elt.value = modeName;
  modeSelect.changed(() => { modeName = modeSelect.value(); cursor = 0.62; });
  modeSelect.parent(document.querySelector('main'));
  layoutControls();
  describe('A raw time series with a draggable window, the arithmetic performed on ' +
           'the samples inside it written out with real numbers, and the resulting ' +
           'derived series plotted beneath on the same time axis.');
}

function md() { return MODES[modeName]; }
function winSeconds() {
  const m = md();
  if (modeName === 'Sustained wind' || modeName === 'Wind gust') return windowTen ? 600 : 120;
  return m.win;
}
function winSamples() { return Math.max(1, Math.round(winSeconds() / md().step)); }

function cumulative() { return modeName === 'Insolation'; }

function rightIdx() {
  const n = md().data.length;
  const minI = cumulative() ? 0 : winSamples() - 1;
  return constrain(Math.round(cursor * (n - 1)), minI, n - 1);
}

function inWindow(iRight) {
  if (cumulative()) return { lo: 0, hi: iRight, n: iRight + 1 };
  const w = winSamples();
  const lo = Math.max(0, iRight - w + 1);
  return { lo: lo, hi: iRight, n: iRight - lo + 1 };
}

// ---- the four measures ---------------------------------------------------

function measureAt(iRight) {
  const m = md();
  const d = m.data;
  const w = inWindow(iRight);
  if (modeName === 'Pressure tendency') {
    const now = d[iRight].v, then = d[w.lo].v;
    const v = now - then;
    let cat = TENDENCY[TENDENCY.length - 1];
    for (const c of TENDENCY) if (v >= c.min) { cat = c; break; }
    return { v: v, now: now, then: then, cat: cat.cat, mean: cat.mean,
             expr: now.toFixed(1) + ' − ' + then.toFixed(1) + ' = ' +
                   (v >= 0 ? '+' : '') + v.toFixed(1) + ' hPa' };
  }
  if (modeName === 'Insolation') {
    let wh = 0;
    for (let i = w.lo; i <= iRight; i++) wh += d[i].v * (m.step / 3600);
    return { v: wh / 1000, wh: wh,
             expr: 'sum of ' + w.n + ' rectangles of (W/m² × 60 s) = ' +
                   Math.round(wh).toLocaleString('en-US') + ' Wh/m² = ' +
                   (wh / 1000).toFixed(2) + ' kWh/m²' };
  }
  let sum = 0, peak = -1e9;
  for (let i = w.lo; i <= iRight; i++) { sum += d[i].v; peak = Math.max(peak, d[i].v); }
  const mean = sum / w.n;
  if (modeName === 'Sustained wind') {
    return { v: mean, mean: mean, n: w.n,
             expr: 'sum of ' + w.n + ' samples / ' + w.n + ' = ' + mean.toFixed(2) + ' m/s' };
  }
  const diff = peak - mean;
  const reported = diff >= GUST_THRESHOLD;
  return { v: reported ? peak : mean, peak: peak, mean: mean, diff: diff,
           reported: reported,
           expr: peak.toFixed(2) + ' − ' + mean.toFixed(2) + ' = ' + diff.toFixed(2) +
                 ' m/s, ' + (reported ? '≥' : '<') + ' ' + GUST_THRESHOLD };
}

function derivedSeries() {
  const m = md();
  const n = m.data.length;
  const start = cumulative() ? 0 : winSamples() - 1;
  const out = [];
  const stride = Math.max(1, Math.floor(n / 320));
  if (cumulative()) {
    // one pass, so a 1440-point cumulative curve is not 1440 nested sums
    let wh = 0;
    for (let i = 0; i < n; i++) {
      wh += m.data[i].v * (m.step / 3600);
      if (i % stride === 0 || i === n - 1) out.push({ i: i, v: wh / 1000 });
    }
    return out;
  }
  for (let i = start; i < n; i += stride) out.push({ i: i, v: measureAt(i).v });
  return out;
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 28;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    rawBox = { x: margin, y: top, w: w, h: 118 };
    mathBox = { x: margin, y: top + 123, w: w, h: 62 };
    derBox = { x: margin, y: top + 190, w: w, h: 104 };
    resBox = { x: margin, y: top + 299, w: w, h: drawHeight - (top + 299) - 6 };
  } else {
    const rw = 252;
    const lw = canvasWidth - rw - 3 * margin;
    rawBox = { x: margin, y: top, w: lw, h: 164 };
    mathBox = { x: margin, y: top + 169, w: lw, h: 76 };
    derBox = { x: margin, y: top + 250, w: lw, h: drawHeight - (top + 250) - 6 };
    resBox = { x: canvasWidth - margin - rw, y: top, w: rw, h: drawHeight - top - 6 };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  modeSelect.position(margin + 50, y0);
  modeSelect.style('width', '160px');
}

function ax(b) {
  const m = md();
  const L = b.x + 42, R = b.x + b.w - 8, T = b.y + 16, B = b.y + b.h - 14;
  const n = m.data.length;
  return { L: L, R: R, T: T, B: B,
    px: i => L + i / Math.max(1, n - 1) * (R - L),
    py: (v, lo, hi) => B - (v - lo) / Math.max(1e-9, hi - lo) * (B - T) };
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  if (playing) {
    cursor += 0.0022;
    if (cursor > 1) { cursor = 1; playing = false; }
  }
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(21);
  text('Derived Measures Workbench', canvasWidth / 2, 1);
  drawRaw();
  drawMath();
  drawDerived();
  drawResult();
  drawControlRegion();
}

function panel(b, title, sub) {
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke(); fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text(title, b.x + 8, b.y + 4);
  if (sub) { textAlign(RIGHT, TOP); text(sub, b.x + b.w - 8, b.y + 4); }
  textAlign(LEFT, TOP);
}

function ticks(b, a, lo, hi, unit) {
  const m = md();
  stroke('#eef2f6'); strokeWeight(1);
  for (let k = 0; k <= 3; k++) { const yy = a.T + (a.B - a.T) * k / 3; line(a.L, yy, a.R, yy); }
  noStroke(); fill('#90a4ae'); textSize(8.5); textAlign(RIGHT, CENTER);
  for (let k = 0; k <= 3; k++) {
    const v = hi - (hi - lo) * k / 3;
    text(v.toFixed(Math.abs(hi - lo) < 20 ? 1 : 0), a.L - 4, a.T + (a.B - a.T) * k / 3);
  }
  textAlign(RIGHT, TOP);
  const total = (m.data.length * m.step) / (m.xlab === 'hours' ? 3600 : 60);
  text('0 to ' + Math.round(total) + ' ' + m.xlab, a.R, a.B + 1);
  textAlign(LEFT, TOP);
}

function drawRaw() {
  const b = rawBox, m = md();
  const iR = rightIdx(), w = inWindow(iR);
  panel(b, 'raw samples: ' + m.quantity + ' (' + m.unit + ')',
        w.n.toLocaleString('en-US') + ' samples in the window');
  const a = ax(b);
  ticks(b, a, m.lo, m.hi, m.unit);

  // the window
  noStroke(); fill(21, 101, 192, 34);
  rect(a.px(w.lo), a.T, Math.max(2, a.px(iR) - a.px(w.lo)), a.B - a.T);
  stroke('#1565c0'); strokeWeight(1.4);
  line(a.px(w.lo), a.T, a.px(w.lo), a.B);
  line(a.px(iR), a.T, a.px(iR), a.B);
  noStroke();

  // insolation fills the area under the curve as it sweeps
  if (modeName === 'Insolation') {
    fill(255, 179, 0, 120); noStroke();
    beginShape();
    vertex(a.px(w.lo), a.B);
    for (let i = w.lo; i <= iR; i += Math.max(1, Math.floor((iR - w.lo) / 400))) {
      vertex(a.px(i), a.py(constrain(m.data[i].v, m.lo, m.hi), m.lo, m.hi));
    }
    vertex(a.px(iR), a.B);
    endShape(CLOSE);
  }

  stroke('#37474f'); strokeWeight(1.4); noFill();
  const stride = Math.max(1, Math.floor(m.data.length / 700));
  beginShape();
  for (let i = 0; i < m.data.length; i += stride) {
    vertex(a.px(i), a.py(constrain(m.data[i].v, m.lo, m.hi), m.lo, m.hi));
  }
  endShape();
  // samples inside the window, drawn individually where few enough
  if (w.n <= 220) {
    noStroke(); fill('#0d47a1');
    for (let i = w.lo; i <= iR; i++) {
      circle(a.px(i), a.py(constrain(m.data[i].v, m.lo, m.hi), m.lo, m.hi), 3.2);
    }
  }

  const r = measureAt(iR);
  noStroke();
  if (modeName === 'Pressure tendency') {
    for (const [i, v, lab] of [[w.lo, r.then, '3 h ago'], [iR, r.now, 'now']]) {
      const yy = a.py(constrain(v, m.lo, m.hi), m.lo, m.hi);
      fill('#c62828'); circle(a.px(i), yy, 7);
      fill(255, 230);
      textSize(8.5);
      const t = lab + ' ' + v.toFixed(1);
      const tw = textWidth(t) + 6;
      const tx = Math.min(a.px(i) + 6, a.R - tw);
      rect(tx, yy - 14, tw, 12, 2);
      fill('#b71c1c'); textAlign(LEFT, TOP);
      text(t, tx + 3, yy - 13);
    }
  }
  if (modeName === 'Wind gust' || modeName === 'Sustained wind') {
    const my = a.py(constrain(r.mean, m.lo, m.hi), m.lo, m.hi);
    stroke('#2e7d32'); strokeWeight(1.4); drawingContext.setLineDash([4, 3]);
    line(a.px(w.lo), my, a.px(iR), my);
    drawingContext.setLineDash([]);
    noStroke(); fill('#1b5e20'); textAlign(LEFT, BOTTOM); textSize(8.5);
    text('sustained ' + r.mean.toFixed(2), a.px(w.lo) + 3, my - 2);
    if (modeName === 'Wind gust') {
      let pi = w.lo;
      for (let i = w.lo; i <= iR; i++) if (m.data[i].v > m.data[pi].v) pi = i;
      const pyv = a.py(constrain(r.peak, m.lo, m.hi), m.lo, m.hi);
      fill(r.reported ? '#c62828' : '#ef6c00');
      circle(a.px(pi), pyv, 7);
      textAlign(LEFT, BOTTOM); textSize(8.5);
      text('peak ' + r.peak.toFixed(2), a.px(pi) + 5, pyv - 2);
    }
  }
}

function drawMath() {
  const b = mathBox;
  const r = measureAt(rightIdx());
  panel(b, 'the arithmetic, on the samples inside the window',
        showFormula ? '' : 'formula hidden');
  const L = b.x + 9;
  let y = b.y + 18;
  if (showFormula) {
    fill('#8a97a4'); textFont(MONO); textSize(9.5); textAlign(LEFT, TOP);
    const f = modeName === 'Pressure tendency' ? 'tendency = P_now - P_3h_ago'
      : modeName === 'Insolation' ? 'insolation = sum(irradiance * interval)'
      : modeName === 'Sustained wind' ? 'sustained = sum(samples) / count'
      : 'gust = peak if (peak - sustained) >= 2.6 else none';
    text(f, L, y);
    textFont('Arial');
    y += 14;
  }
  fill('#0d2b45'); textFont(MONO); textSize(11.5); textAlign(LEFT, TOP);
  let e = r.expr;
  while (textWidth(e) > b.w - 18 && e.length > 8) e = e.slice(0, -2) + '…';
  text(e, L, y);
  textFont('Arial');
}

function drawDerived() {
  const b = derBox, m = md();
  panel(b, 'the derived series, on the same time axis', m.derived + ' (' + m.dunit + ')');
  const a = ax(b);
  ticks(b, a, m.dlo, m.dhi, m.dunit);
  const iR = rightIdx();
  const ser = derivedSeries();

  if (modeName === 'Pressure tendency') {
    stroke('#eceff1'); strokeWeight(1);
    for (const lvl of [3, 1, -1, -3, -6]) {
      const yy = a.py(lvl, m.dlo, m.dhi);
      stroke(lvl === 0 ? '#90a4ae' : '#e0e6eb');
      line(a.L, yy, a.R, yy);
    }
    noStroke();
  }
  stroke('#6a1b9a'); strokeWeight(1.8); noFill();
  beginShape();
  for (const p of ser) if (p.i <= iR) vertex(a.px(p.i), a.py(constrain(p.v, m.dlo, m.dhi), m.dlo, m.dhi));
  endShape();
  stroke(106, 27, 154, 60); strokeWeight(1.2);
  beginShape();
  for (const p of ser) if (p.i > iR) vertex(a.px(p.i), a.py(constrain(p.v, m.dlo, m.dhi), m.dlo, m.dhi));
  endShape();
  const r = measureAt(iR);
  noStroke(); fill('#6a1b9a');
  circle(a.px(iR), a.py(constrain(r.v, m.dlo, m.dhi), m.dlo, m.dhi), 7);
  stroke('#1565c0'); strokeWeight(1.2);
  line(a.px(iR), a.T, a.px(iR), a.B);
  noStroke();
  fill('#8a97a4'); textAlign(LEFT, BOTTOM); textSize(8.5);
  text('solid where the window has already swept', a.L + 2, a.B - 2);
}

function drawResult() {
  const b = resBox, m = md();
  const iR = rightIdx(), w = inWindow(iR);
  const r = measureAt(iR);
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 10, W = b.w - 20;
  let y = b.y + 7;

  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text((cumulative() ? 'accumulated since midnight: ' : 'window: ' +
        fmtWin(winSeconds()) + ', ') + w.n.toLocaleString('en-US') +
       ' samples', L, y);
  y += 16;

  if (modeName === 'Pressure tendency') {
    big(L, y, W, (r.v >= 0 ? '+' : '') + r.v.toFixed(1) + ' hPa / 3 h',
        r.v <= -3 ? '#b71c1c' : (r.v >= 1 ? '#1b5e20' : '#0d2b45'));
    y += 40;
    y = kv(L, y, W, 'category', r.cat);
    y = kv(L, y, W, 'meaning', r.mean);
    y += 6;
    fill('#33475b'); textSize(10);
    y = para(L, y, W, 'A single pressure reading cannot say this. 1008 hPa steady and ' +
        '1008 hPa falling fast are the same number and opposite forecasts.', 11.5, 10) + 6;
    if (r.cat === 'Steady' && r.now < 1010) {
      fill('#e65100'); textSize(10);
      y = para(L, y, W, 'Low but steady. The value is alarming and the trend is not. ' +
          'Chapter 7 made this point; here is the arithmetic behind it.', 11.5, 10);
    }
  } else if (modeName === 'Insolation') {
    big(L, y, W, r.v.toFixed(2) + ' kWh/m²', '#e65100');
    y += 40;
    y = kv(L, y, W, 'accumulated', Math.round(r.wh).toLocaleString('en-US') + ' Wh/m²');
    y = kv(L, y, W, 'rectangles', w.n.toLocaleString('en-US') + ' of 60 s');
    y += 6;
    fill('#33475b'); textSize(10);
    y = para(L, y, W, 'Irradiance is a rate in W/m². Insolation is a total in ' +
        'kWh/m², and a total only exists over a span. This is the number that ' +
        'sizes the solar panel in Chapter 16.', 11.5, 10) + 6;
    fill('#78909c'); textSize(9.5);
    para(L, y, W, 'A clear summer day runs 7 to 8 kWh/m²; a midwinter overcast ' +
         'day about 1.', 11, 9.5);
  } else if (modeName === 'Sustained wind') {
    big(L, y, W, r.mean.toFixed(2) + ' m/s', '#1b5e20');
    y += 40;
    y = kv(L, y, W, 'averaging', windowTen ? '10 min (WMO)' : '2 min (US)');
    const other = measureOther();
    y = kv(L, y, W, windowTen ? 'same data, 2 min' : 'same data, 10 min',
           other.toFixed(2) + ' m/s');
    y += 4;
    const gap = Math.abs(other - r.mean);
    fill(gap > 0.05 ? '#b71c1c' : '#546e7a'); textSize(10);
    y = para(L, y, W, 'The same wind gives different sustained speeds depending on the ' +
        'averaging period - here they differ by ' + gap.toFixed(2) + ' m/s. This is why ' +
        'the Saffir-Simpson category depends on which standard is used.', 11.5, 10);
  } else {
    big(L, y, W, r.reported ? r.peak.toFixed(2) + ' m/s gust' : 'No gust reported',
        r.reported ? '#b71c1c' : '#546e7a');
    y += 40;
    y = kv(L, y, W, 'peak', r.peak.toFixed(2) + ' m/s');
    y = kv(L, y, W, 'sustained', r.mean.toFixed(2) + ' m/s');
    y = kv(L, y, W, 'difference', r.diff.toFixed(2) + ' m/s');
    y = kv(L, y, W, 'threshold', GUST_THRESHOLD + ' m/s (5 kn)');
    y += 6;
    fill(r.reported ? '#33475b' : '#e65100'); textSize(10);
    para(L, y, W, r.reported
      ? 'The peak exceeds the sustained speed by more than the margin, so a gust is ' +
        'reported. Both numbers go in the record, not just the peak.'
      : 'There is a visible spike, and no gust is reported. A gust is defined relative ' +
        'to the sustained speed, not in absolute terms.', 11.5, 10);
  }
}

function measureOther() {
  const save = windowTen;
  windowTen = !save;
  const v = measureAt(rightIdx()).mean;
  windowTen = save;
  return v;
}

function big(L, y, W, s, col) {
  noStroke(); fill('#f4f7fa');
  rect(L, y, W, 34, 3);
  fill(col); textAlign(LEFT, CENTER); textSize(17); textStyle(BOLD);
  let t = s;
  while (textWidth(t) > W - 14 && t.length > 4) t = t.slice(0, -2) + '…';
  text(t, L + 8, y + 18);
  textStyle(NORMAL); textAlign(LEFT, TOP);
}

function kv(L, y, W, k, v) {
  fill('#8a97a4'); textAlign(LEFT, TOP); textSize(9.8);
  text(k, L, y);
  fill('#0d2b45'); textAlign(RIGHT, TOP); textSize(10);
  let t = String(v);
  while (textWidth(t) > W - 70 && t.length > 4) t = t.slice(0, -2) + '…';
  text(t, L + W, y);
  textAlign(LEFT, TOP);
  return y + 14;
}

function fmtWin(s) {
  if (s >= 86400) return '24 hours';
  if (s >= 3600) return (s / 3600) + ' hours';
  return (s / 60) + ' minutes';
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 8;
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
  text('Measure', margin, y0 + 11);

  chipHits = [];
  let x = margin + 222;
  x = chip(x, y0, playing ? 'Pause the sweep' : 'Sweep the window', playing) + 6;
  x = chip(x, y0, 'Reset', false) + 6;
  chip(x, y0, showFormula ? 'Formula shown' : 'Show the formula', showFormula);

  let y2 = y0 + 32;
  if (modeName === 'Sustained wind' || modeName === 'Wind gust') {
    x = margin;
    fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
    text('Averaging window', margin, y2 + 11);
    x = margin + 116;
    x = chip(x, y2, '2 minutes (US)', !windowTen) + 6;
    chip(x, y2, '10 minutes (WMO)', windowTen);
    y2 += 30;
  }
  fill('#8a97a4'); textAlign(LEFT, TOP); textSize(9.5);
  para(margin, y2 + 4, canvasWidth - 2 * margin,
       'Drag anywhere on the raw series to move the window, or press Sweep. Each of ' +
       'these four measures is a function of a span, which is why none of them can be ' +
       'read off a single row of your CSV.', 11, 9.5);
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

// ---- interaction ---------------------------------------------------------

function mousePressed() {
  for (const c of chipHits) {
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      onChip(c.label);
      return false;
    }
  }
  if (inBox(rawBox) || inBox(derBox)) { dragging = true; setCursor(); return false; }
  return true;
}
function mouseDragged() { if (dragging) { setCursor(); return false; } return true; }
function mouseReleased() { dragging = false; return true; }

function inBox(b) {
  return mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h;
}
function setCursor() {
  const a = ax(rawBox);
  cursor = constrain((mouseX - a.L) / Math.max(1, a.R - a.L), 0, 1);
  playing = false;
}

function onChip(label) {
  if (label === 'Sweep the window') { playing = true; cursor = 0; }
  else if (label === 'Pause the sweep') playing = false;
  else if (label === 'Reset') { cursor = 0.62; playing = false; }
  else if (label === '2 minutes (US)') windowTen = false;
  else if (label === '10 minutes (WMO)') windowTen = true;
  else showFormula = !showFormula;
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
