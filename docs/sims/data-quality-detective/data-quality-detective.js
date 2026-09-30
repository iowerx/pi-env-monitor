// Data Quality Detective MicroSim
// CANVAS_HEIGHT: 690
// Bloom Level: Analyze (L4) - the learner differentiates instrument faults from
// real environmental events, and justifies each diagnosis from cross-channel
// evidence rather than from the shape of one trace.
// All four channels share one x-axis because the discriminating information is
// never inside a single channel: it is in whether the others moved in a
// physically consistent way. The evidence checklist is scored separately from
// the diagnosis, which is what stops the learner pattern-matching on how a case
// looks and forces the reasoning the chapter teaches.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 512;
let controlHeight = 178;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 760;
const MONO = 'monospace';

const CHANNELS = [
  { key: 't', name: 'temperature', unit: '°C', col: '#c62828', lo: -5, hi: 50 },
  { key: 'p', name: 'pressure', unit: 'hPa', col: '#1565c0', lo: 995, hi: 1025 },
  { key: 'h', name: 'humidity', unit: '%', col: '#00838f', lo: 20, hi: 100 },
  { key: 'i', name: 'irradiance', unit: 'W/m²', col: '#e65100', lo: 0, hi: 1100 }
];

const DIAGNOSES = ['Instrument noise', 'Wiring fault', 'Siting fault', 'Sensor drift',
                   'Power outage', 'Real weather event', 'Real, but not weather'];

const EVIDENCE = [
  { id: 'agree', q: 'other channels agree' },
  { id: 'daily', q: 'recurs at the same time of day' },
  { id: 'log', q: 'log entry present' },
  { id: 'nearby', q: 'comparison station shows the same' },
  { id: 'magnitude', q: 'physically plausible magnitude' }
];

// ---- case construction ---------------------------------------------------
// Each case is static multi-channel data with a documented ground truth.

function diurnal(day, hourFrac) {
  const h = hourFrac * 24;
  return {
    t: 16 + 7 * Math.sin(2 * Math.PI * (h - 9) / 24) + 0.5 * Math.sin(day * 1.3),
    p: 1014 + 1.5 * Math.sin(day / 2.1 + hourFrac * 0.4),
    h: 62 - 18 * Math.sin(2 * Math.PI * (h - 9) / 24),
    i: h > 6.2 && h < 18.6 ? 860 * Math.sin(Math.PI * (h - 6.2) / 12.4) : 0
  };
}

function buildCase(spec) {
  const n = spec.n, d = [];
  for (let k = 0; k < n; k++) {
    const frac = k / n * spec.days;
    const day = Math.floor(frac);
    const hf = frac - day;
    const base = diurnal(day, hf);
    d.push({ k: k, day: day, hf: hf,
             t: base.t, p: base.p, h: base.h, i: base.i,
             rt: base.t, rp: base.p, rh: base.h, ri: base.i });
  }
  spec.shape(d, n);
  return Object.assign({}, spec, { d: d });
}

const CASES = [
  buildCase({
    title: 'A one-minute spike', days: 3, n: 720, truth: 'Instrument noise',
    ev: { agree: false, daily: false, log: false, nearby: false, magnitude: false },
    why: 'One sample, one channel, no log entry, and a magnitude no air temperature ' +
         'reaches. Nothing else moved. An isolated point in both time and channel is ' +
         'electrical noise, not weather.',
    logs: [],
    shape: (d, n) => { d[430].t = 47.2; }
  }),
  buildCase({
    title: 'A front arrives', days: 3, n: 720, truth: 'Real weather event',
    ev: { agree: true, daily: false, log: false, nearby: true, magnitude: true },
    why: 'Temperature falls 6 degrees over an hour, pressure falls and then rises ' +
         'sharply behind it, humidity jumps, and irradiance drops as the cloud band ' +
         'passes. Four channels moving consistently, in the physically expected order, ' +
         'and the neighbouring station sees it too.',
    logs: [],
    shape: (d, n) => {
      for (let k = 0; k < n; k++) {
        const s = 1 / (1 + Math.exp(-(k - 360) / 6));
        d[k].t -= 6 * s; d[k].rt -= 6 * s;
        d[k].h += 22 * s * Math.exp(-Math.pow((k - 372) / 90, 2)) + 10 * s;
        d[k].rh += 22 * s * Math.exp(-Math.pow((k - 372) / 90, 2)) + 10 * s;
        const dip = Math.exp(-Math.pow((k - 356) / 16, 2));
        d[k].p -= 6 * dip + 4 * s * Math.exp(-Math.pow((k - 400) / 120, 2));
        d[k].rp -= 6 * dip + 4 * s * Math.exp(-Math.pow((k - 400) / 120, 2));
        d[k].p += 5 * s * (1 - Math.exp(-(Math.max(0, k - 400)) / 90));
        d[k].rp += 5 * s * (1 - Math.exp(-(Math.max(0, k - 400)) / 90));
        if (k > 330 && k < 430) { d[k].i *= 0.25; d[k].ri *= 0.25; }
      }
    }
  }),
  buildCase({
    title: 'Hot every afternoon', days: 4, n: 960, truth: 'Siting fault',
    ev: { agree: false, daily: true, log: false, nearby: false, magnitude: false },
    why: 'The excursion recurs at the same time every day and tracks irradiance almost ' +
         'exactly, while humidity falls in lockstep. Real air temperature lags the sun ' +
         'by two or three hours; this does not lag at all. The sensor is reading sunlight ' +
         'falling on itself, which is the unshielded-sensor fault from Chapter 6.',
    logs: [],
    shape: (d, n) => {
      for (let k = 0; k < n; k++) {
        const boost = 11 * Math.pow(Math.max(0, d[k].i) / 860, 1.6);
        d[k].t += boost;
        d[k].h -= boost * 1.5;
      }
    }
  }),
  buildCase({
    title: 'Six hours of nothing', days: 3, n: 720, truth: 'Power outage',
    ev: { agree: true, daily: false, log: true, nearby: false, magnitude: true },
    why: 'Every channel stops at once and resumes together, and the log records the ' +
         'undervoltage and the restart. Nothing is wrong with the sensor. Joining a line ' +
         'across this gap would assert six hours of readings that do not exist.',
    logs: [{ k: 300, txt: 'WARNING undervoltage detected, throttling' },
           { k: 302, txt: 'CRITICAL power lost, logger stopping' },
           { k: 392, txt: 'INFO logger started, resuming at interval 600 s' }],
    gap: [302, 392],
    shape: (d, n) => { for (let k = 302; k < 392; k++) { d[k].t = null; d[k].p = null; d[k].h = null; d[k].i = null; } }
  }),
  buildCase({
    title: 'Sixty days of humidity', days: 60, n: 1440, truth: 'Sensor drift',
    ev: { agree: false, daily: false, log: false, nearby: true, magnitude: true },
    why: 'Overnight humidity peaks fall steadily from 99 to 93 per cent over two months ' +
         'while the comparison station stays pinned at 99. No single reading looks wrong. ' +
         'Only the comparison overlay reveals it, which is why you have to think to turn ' +
         'it on.',
    logs: [],
    needsNearby: true,
    shape: (d, n) => {
      for (let k = 0; k < n; k++) {
        const frac = k / n;
        d[k].h = Math.min(99, d[k].h + 24) - 6 * frac;
        d[k].rh = Math.min(99, d[k].rh + 24);
      }
    }
  }),
  buildCase({
    title: 'Two minutes of warmth', days: 1, n: 1440, truth: 'Real, but not weather',
    ev: { agree: true, daily: false, log: false, nearby: false, magnitude: true },
    why: 'Temperature and humidity both spike sharply together for two minutes while ' +
         'pressure and irradiance do not move at all, and the neighbouring station sees ' +
         'nothing. Warm, wet, local and brief: this is somebody breathing on the sensor. ' +
         'The reading is real. It is just not the atmosphere.',
    logs: [],
    shape: (d, n) => {
      for (let k = 0; k < n; k++) {
        const s = Math.exp(-Math.pow((k - 800) / 1.1, 2));
        d[k].t += 12 * s;
        d[k].h += 34 * s;
      }
    }
  }),
  buildCase({
    title: 'Brighter than the sky', days: 1, n: 1440, truth: 'Real weather event',
    ev: { agree: false, daily: false, log: false, nearby: false, magnitude: true },
    why: 'A brief irradiance reading above the clear-sky envelope. Chapter 9 predicted ' +
         'exactly this: the edge of a cumulus cloud reflects extra light onto the sensor, ' +
         'so the ground briefly receives more than a clear sky would deliver. It is real ' +
         'and it should not be flagged as a fault.',
    logs: [],
    shape: (d, n) => {
      for (let k = 0; k < n; k++) {
        if (k > 700 && k < 780) {
          const c = Math.exp(-Math.pow((k - 735) / 12, 2));
          d[k].i *= 1 - 0.55 * c;
        }
        const edge = Math.exp(-Math.pow((k - 716) / 1.4, 2));
        d[k].i += 320 * edge;
      }
    }
  })
];

// ---- state ----
let caseIdx = 0;
let cursor = 0.5;
let nearby = false;
let picked = null;
let ticked = {};
let submitted = null;          // {score, diagOk, evOk, missing, extra}
let flagged = false;
let joinGaps = false;
let dragging = false;
let chipHits = [], diagHits = [], evHits = [];
let caseSelect;
let panBox = { x: 0, y: 0, w: 10, h: 10 };
let verBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');
  caseSelect = createSelect();
  for (let i = 0; i < CASES.length; i++) {
    caseSelect.option((i + 1) + ' - ' + CASES[i].title, i);
  }
  caseSelect.elt.value = '0';
  caseSelect.changed(() => { caseIdx = parseInt(caseSelect.value(), 10); resetCase(); });
  caseSelect.parent(document.querySelector('main'));
  layoutControls();
  describe('Four channels of station data on one shared time axis with a log strip, ' +
           'a movable cursor, a comparison-station overlay, and a diagnosis panel that ' +
           'scores the evidence cited as well as the conclusion.');
}

function cs() { return CASES[caseIdx]; }

// A 60-day series drawn sample by sample is a solid block of diurnal cycles, in
// which a six-point slide in the overnight peaks is invisible. Long cases are
// drawn as a daily max and min envelope instead, which is what any analyst
// would do and which is what makes the drift readable.
function useEnvelope() { return cs().days > 10; }

function envelope() {
  const c = cs();
  if (c._env) return c._env;
  const out = [];
  for (let day = 0; day < c.days; day++) {
    const row = { day: day, k: 0, n: 0 };
    for (const ch of CHANNELS) {
      row[ch.key + 'max'] = -1e9; row[ch.key + 'min'] = 1e9;
      row['r' + ch.key + 'max'] = -1e9;
    }
    for (let k = 0; k < c.d.length; k++) {
      if (c.d[k].day !== day) continue;
      row.n += 1; row.k = k;
      for (const ch of CHANNELS) {
        const v = c.d[k][ch.key], rv = c.d[k]['r' + ch.key];
        if (v !== null && v !== undefined) {
          row[ch.key + 'max'] = Math.max(row[ch.key + 'max'], v);
          row[ch.key + 'min'] = Math.min(row[ch.key + 'min'], v);
        }
        if (rv !== null && rv !== undefined) {
          row['r' + ch.key + 'max'] = Math.max(row['r' + ch.key + 'max'], rv);
        }
      }
    }
    if (row.n) out.push(row);
  }
  c._env = out;
  return out;
}
function curIdx() {
  const n = cs().d.length;
  return constrain(Math.round(cursor * (n - 1)), 0, n - 1);
}

function resetCase() {
  picked = null; ticked = {}; submitted = null; flagged = false;
  cursor = 0.5; nearby = false; joinGaps = false;
}

function submit() {
  if (picked === null) return;
  const c = cs();
  const diagOk = DIAGNOSES[picked] === c.truth;
  const missing = EVIDENCE.filter(e => c.ev[e.id] && !ticked[e.id]).map(e => e.q);
  const extra = EVIDENCE.filter(e => !c.ev[e.id] && ticked[e.id]).map(e => e.q);
  const evOk = missing.length === 0 && extra.length === 0;
  submitted = { diagOk: diagOk, evOk: evOk, missing: missing, extra: extra,
                score: diagOk ? (evOk ? 'full' : 'partial') : 'none' };
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 28;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    panBox = { x: margin, y: top, w: w, h: 246 };
    verBox = { x: margin, y: top + 251, w: w, h: drawHeight - (top + 251) - 6 };
  } else {
    const vw = 268;
    panBox = { x: margin, y: top, w: canvasWidth - vw - 3 * margin, h: drawHeight - top - 6 };
    verBox = { x: canvasWidth - margin - vw, y: top, w: vw, h: drawHeight - top - 6 };
  }
}
function layoutControls() {
  layout();
  caseSelect.position(margin + 36, drawHeight + 7);
  caseSelect.style('width', Math.min(268, canvasWidth - margin - 48) + 'px');
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(21);
  text('Data Quality Detective', canvasWidth / 2, 1);
  drawPanels();
  drawVerdict();
  drawControlRegion();
}

function drawPanels() {
  const b = panBox, c = cs();
  const n = c.d.length;
  const logH = 26;
  const ph = (b.h - logH - 4) / CHANNELS.length;
  const L = b.x + 44, R = b.x + b.w - 6;
  const px = k => L + k / Math.max(1, n - 1) * (R - L);
  const iC = curIdx();

  for (let ci = 0; ci < CHANNELS.length; ci++) {
    const ch = CHANNELS[ci];
    const by = b.y + ci * ph;
    const T = by + 12, B = by + ph - 6;
    noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
    rect(b.x, by, b.w, ph - 2, 3);
    noStroke();
    const py = v => B - (constrain(v, ch.lo, ch.hi) - ch.lo) / (ch.hi - ch.lo) * (B - T);

    stroke('#f2f5f8'); strokeWeight(1);
    for (let k = 1; k < 3; k++) { const yy = T + (B - T) * k / 3; line(L, yy, R, yy); }
    noStroke(); fill('#90a4ae'); textSize(8); textAlign(RIGHT, CENTER);
    text(ch.hi.toFixed(0), L - 3, T + 5);
    text(ch.lo.toFixed(0), L - 3, B - 4);
    textAlign(LEFT, TOP); fill('#5a6a78'); textSize(8.5);
    text(ch.name + ' (' + ch.unit + ')', b.x + 5, by + 2);

    // gap shading
    if (c.gap) {
      noStroke(); fill(198, 40, 40, 26);
      rect(px(c.gap[0]), T, px(c.gap[1]) - px(c.gap[0]), B - T);
    }

    if (useEnvelope()) {
      const env = envelope();
      if (nearby) {
        stroke(120, 144, 156, 200); strokeWeight(1.4); noFill();
        drawingContext.setLineDash([4, 3]);
        beginShape();
        for (const r of env) vertex(px(r.k), py(r['r' + ch.key + 'max']));
        endShape();
        drawingContext.setLineDash([]);
      }
      noFill(); stroke(ch.col); strokeWeight(1.5);
      beginShape();
      for (const r of env) vertex(px(r.k), py(r[ch.key + 'max']));
      endShape();
      stroke(ch.col); strokeWeight(1);
      beginShape();
      for (const r of env) vertex(px(r.k), py(r[ch.key + 'min']));
      endShape();
      noStroke(); textSize(8); textAlign(RIGHT, TOP);
      const cap = 'daily max and min';
      fill(255, 220);
      rect(R - 4 - textWidth(cap) - 4, B - 11, textWidth(cap) + 8, 10, 2);
      fill('#8a97a4');
      text(cap, R - 4, B - 11);
    } else {
      if (nearby) {
        stroke(120, 144, 156, 170); strokeWeight(1.1); noFill();
        let st2 = false;
        for (let k = 0; k < n; k += Math.max(1, Math.floor(n / 700))) {
          const v = c.d[k]['r' + ch.key];
          if (v === null || v === undefined) { if (st2) { endShape(); st2 = false; } continue; }
          if (!st2) { beginShape(); st2 = true; }
          vertex(px(k), py(v));
        }
        if (st2) endShape();
      }
      stroke(ch.col); strokeWeight(1.4); noFill();
      let started = false;
      for (let k = 0; k < n; k += Math.max(1, Math.floor(n / 900))) {
        const v = c.d[k][ch.key];
        if (v === null) { if (!joinGaps && started) { endShape(); started = false; } continue; }
        if (!started) { beginShape(); started = true; }
        vertex(px(k), py(v));
      }
      if (started) endShape();
    }

    // cursor and readout
    stroke('#263238'); strokeWeight(1);
    line(px(iC), T, px(iC), B);
    const v = c.d[iC][ch.key];
    noStroke(); fill(255, 232);
    textSize(8.5);
    const t = v === null ? 'no data' : v.toFixed(ch.key === 'i' ? 0 : 1) + ' ' + ch.unit;
    const tw = textWidth(t) + 8;
    const tx = Math.min(px(iC) + 4, R - tw);
    rect(tx, T + 1, tw, 12, 2);
    fill(v === null ? '#b71c1c' : ch.col); textAlign(LEFT, TOP);
    text(t, tx + 4, T + 2);
  }

  // log strip
  const ly = b.y + b.h - logH;
  noStroke(); fill('#1b1410'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, ly, b.w, logH, 3);
  noStroke();
  textFont(MONO); textSize(8.5); textAlign(LEFT, TOP);
  fill('#78909c');
  text('station.log', b.x + 5, ly + 2);
  if (!c.logs.length) {
    fill('#546e7a');
    text('(no entries in this window)', b.x + 62, ly + 2);
  }
  for (const lg of c.logs) {
    stroke('#ffab40'); strokeWeight(1.4);
    line(px(lg.k), ly + 13, px(lg.k), ly + logH - 2);
    noStroke(); fill('#ffab40');
    circle(px(lg.k), ly + 12, 5);
  }
  // the nearest log entry to the cursor, spelled out
  if (c.logs.length) {
    let best = c.logs[0];
    for (const lg of c.logs) if (Math.abs(lg.k - iC) < Math.abs(best.k - iC)) best = lg;
    fill(Math.abs(best.k - iC) < n * 0.06 ? '#ffcc80' : '#6d5b4a');
    textAlign(LEFT, TOP);
    let t = dayHour(best.k) + '  ' + best.txt;
    while (textWidth(t) > b.w - 130 && t.length > 8) t = t.slice(0, -2) + '…';
    text(t, b.x + 74, ly + 2);
  }
  textFont('Arial');
  fill('#90a4ae'); textAlign(RIGHT, TOP); textSize(8.5);
  text('cursor ' + dayHour(iC) + '   |   ' + cs().days + ' days', R, ly + 14);
}

function dayHour(k) {
  const c = cs();
  const frac = k / c.d.length * c.days;
  const day = Math.floor(frac);
  const h = (frac - day) * 24;
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  return 'day ' + (day + 1) + ' ' + String(hh).padStart(2, '0') + ':' +
         String(mm % 60).padStart(2, '0');
}

function drawVerdict() {
  const b = verBox, c = cs();
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 9, W = b.w - 18;
  let y = b.y + 6;
  diagHits = []; evHits = [];

  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('case ' + (caseIdx + 1) + ' of ' + CASES.length + ': ' + c.title, L, y);
  y += 14;

  if (submitted) {
    const s = submitted;
    const col = s.score === 'full' ? '#1b5e20' : (s.score === 'partial' ? '#e65100' : '#b71c1c');
    noStroke(); fill(s.score === 'full' ? '#e8f5e9' : (s.score === 'partial' ? '#fff8e1' : '#fdeeee'));
    rect(L, y, W, 32, 3);
    fill(col); textSize(11.5); textStyle(BOLD);
    text(s.score === 'full' ? 'Correct, with the right evidence'
         : (s.score === 'partial' ? 'Right answer, wrong evidence' : 'Not this one'),
         L + 6, y + 3);
    textStyle(NORMAL); textSize(9.5); fill('#546e7a');
    text('ground truth: ' + c.truth, L + 6, y + 18);
    y += 38;
    if (!s.diagOk) {
      fill('#b71c1c'); textSize(10);
      y = para(L, y, W, 'You said ' + DIAGNOSES[picked] + '.', 11.5, 10) + 4;
    }
    if (s.missing.length) {
      fill('#e65100'); textSize(9.8);
      y = para(L, y, W, 'Evidence you did not cite: ' + s.missing.join('; ') + '.', 11, 9.8) + 4;
    }
    if (s.extra.length) {
      fill('#e65100'); textSize(9.8);
      y = para(L, y, W, 'Evidence that does not hold here: ' + s.extra.join('; ') + '.',
               11, 9.8) + 4;
    }
    if (EVIDENCE.every(e => !c.ev[e.id])) {
      fill('#0d47a1'); textSize(9.8);
      y = para(L, y, W, 'None of the five hold here, and that absence is the evidence: ' +
               'the excursion is isolated in time and in channel.', 11, 9.8) + 4;
    }
    fill('#33475b'); textSize(10);
    y = para(L, y, W, c.why, 11.5, 10) + 6;
    if (c.needsNearby && !nearby) {
      fill('#6a1b9a'); textSize(9.8);
      y = para(L, y, W, 'Turn on the comparison station and look again.', 11, 9.8) + 4;
    }
    if (c.gap) {
      fill(joinGaps ? '#b71c1c' : '#1b5e20'); textSize(9.8);
      y = para(L, y, W, joinGaps
        ? 'You are joining the line across the gap. That segment asserts six hours of ' +
          'readings that were never taken.'
        : 'Leaving the gap open is the correct choice. The absence is itself information.',
        11, 9.8) + 4;
    }
    if (flagged) {
      fill('#0d47a1'); textSize(9.5);
      y = para(L, y, W, 'Flagged, not deleted. The row stays in the file with a quality ' +
               'column, so a later reader can decide for themselves.', 11, 9.5);
    }
    return;
  }

  fill('#0d2b45'); textSize(10); textAlign(LEFT, TOP);
  text('diagnosis', L, y);
  y += 13;
  for (let i = 0; i < DIAGNOSES.length; i++) {
    const h = 18;
    const sel = picked === i;
    noStroke(); fill(sel ? '#e3f2fd' : '#f4f7fa');
    stroke(sel ? '#1565c0' : '#c3ced8'); strokeWeight(sel ? 1.6 : 1);
    rect(L, y, W, h - 2, 3);
    noStroke(); fill(sel ? '#0d47a1' : '#33475b'); textSize(9.8);
    textAlign(LEFT, CENTER);
    text(DIAGNOSES[i], L + 7, y + (h - 2) / 2);
    diagHits.push({ x: L, y: y, w: W, h: h - 2, i: i });
    y += h;
  }
  y += 6;
  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(10);
  text('evidence you are citing', L, y);
  y += 13;
  for (const e of EVIDENCE) {
    const on = !!ticked[e.id];
    noStroke(); fill(on ? '#1565c0' : '#ffffff');
    stroke(on ? '#0d47a1' : '#b0bec5'); strokeWeight(1);
    rect(L, y + 1, 10, 10, 2);
    noStroke();
    if (on) {
      stroke('#fff'); strokeWeight(1.7);
      line(L + 2.2, y + 6, L + 4.4, y + 8.6); line(L + 4.4, y + 8.6, L + 8, y + 3.4);
      noStroke();
    }
    fill(on ? '#0d47a1' : '#546e7a'); textSize(9.8); textAlign(LEFT, TOP);
    text(e.q, L + 16, y);
    evHits.push({ x: L, y: y, w: W, h: 13, id: e.id });
    y += 14;
  }
  y += 4;
  fill('#8a97a4'); textSize(9.3);
  para(L, y, W, 'Both halves are scored. A right diagnosis with the wrong evidence is ' +
       'only partly right, because next time the evidence is all you will have.', 10.8, 9.3);
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 6;
  chipHits = [];
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(10);
  text('Case', margin, y0 + 10);
  textAlign(LEFT, TOP);

  let y2 = y0 + 28;
  x = margin;
  x = chip(x, y2, nearby ? 'Comparison station on' : 'Compare with nearby station', nearby) + 6;
  x = chip(x, y2, joinGaps ? 'Joining across gaps' : 'Join across gaps', joinGaps) + 6;
  chip(x, y2, flagged ? 'Flagged in the file' : 'Flag, do not delete', flagged);

  y2 += 28;
  x = margin;
  x = chip(x, y2, submitted ? 'Try again' : 'Submit the diagnosis', false) + 6;
  x = chip(x, y2, 'Next case', false) + 6;
  chip(x, y2, 'Reset this case', false);

  if (flagged) {
    textFont(MONO); textSize(9); fill('#37474f'); textAlign(LEFT, TOP);
    text('timestamp_utc,temperature_c,pressure_hpa,humidity_pct,quality_flag',
         margin, y2 + 30);
    const iC = curIdx();
    const c = cs();
    const v = c.d[iC];
    text(dayHour(iC).replace('day ', 'd') + ',' +
         (v.t === null ? '' : v.t.toFixed(1)) + ',' +
         (v.p === null ? '' : v.p.toFixed(1)) + ',' +
         (v.h === null ? '' : v.h.toFixed(1)) + ',SUSPECT',
         margin, y2 + 41);
    textFont('Arial');
  } else {
    fill('#8a97a4'); textAlign(LEFT, TOP); textSize(9.5);
    para(margin, y2 + 30, canvasWidth - 2 * margin,
         'Drag across the panels to move the cursor. Check the log strip. The answer is ' +
         'almost never in one channel on its own.', 11, 9.5);
  }
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
  for (const d of diagHits) {
    if (mouseX >= d.x && mouseX <= d.x + d.w && mouseY >= d.y && mouseY <= d.y + d.h) {
      picked = d.i;
      return false;
    }
  }
  for (const e of evHits) {
    if (mouseX >= e.x && mouseX <= e.x + e.w && mouseY >= e.y && mouseY <= e.y + e.h) {
      ticked[e.id] = !ticked[e.id];
      return false;
    }
  }
  if (mouseX >= panBox.x && mouseX <= panBox.x + panBox.w &&
      mouseY >= panBox.y && mouseY <= panBox.y + panBox.h) {
    dragging = true; setCursor(); return false;
  }
  return true;
}
function mouseDragged() { if (dragging) { setCursor(); return false; } return true; }
function mouseReleased() { dragging = false; return true; }

function setCursor() {
  const L = panBox.x + 44, R = panBox.x + panBox.w - 6;
  cursor = constrain((mouseX - L) / Math.max(1, R - L), 0, 1);
}

function onChip(label) {
  if (label === 'Compare with nearby station' || label === 'Comparison station on') nearby = !nearby;
  else if (label === 'Join across gaps' || label === 'Joining across gaps') joinGaps = !joinGaps;
  else if (label === 'Flag, do not delete' || label === 'Flagged in the file') flagged = !flagged;
  else if (label === 'Submit the diagnosis') submit();
  else if (label === 'Try again') { submitted = null; }
  else if (label === 'Next case') {
    caseIdx = (caseIdx + 1) % CASES.length;
    caseSelect.elt.value = String(caseIdx);
    resetCase();
  }
  else if (label === 'Reset this case') resetCase();
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
