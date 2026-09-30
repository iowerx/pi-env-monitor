// Resilient Logger Fault Bench MicroSim
// CANVAS_HEIGHT: 668
// Bloom Level: Evaluate (L5) - the learner critiques five logger strategies
// against one identical fault sequence and judges which preserves both the data
// and the ability to explain it later.
// The strategy is the only variable. Every logger runs the same loop over the
// same ticks and receives the same faults at the same instant, so any difference
// in the resulting data file is caused by the error handling and nothing else.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 178;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 760;
const MONO = 'monospace';

const TOTAL_TICKS = 480;          // one reading every 5 minutes, 40 hours
const MINUTES = 5;

// ---- fault definitions ---------------------------------------------------

const FAULTS = {
  'Transient I2C error': { span: 1, where: 'read', exc: 'OSError',
    msg: "[Errno 121] Remote I/O error", transient: true,
    note: 'One failed read. The retry logger loses nothing at all.' },
  'Sensor down 30 min': { span: 6, where: 'read', exc: 'OSError',
    msg: "[Errno 121] Remote I/O error", transient: false,
    note: 'All five lose data. Only the ones that log leave any record of why.' },
  'Disk full': { span: 3, where: 'write', exc: 'OSError',
    msg: "[Errno 28] No space left on device", transient: false,
    note: 'A different errno, still an OSError. A logger catching only a sensor ' +
          'library exception would not catch this.' },
  'Operator presses Ctrl-C': { span: 1, where: 'signal', exc: 'KeyboardInterrupt',
    msg: '', transient: false,
    note: 'A bare except catches your attempt to quit.' },
  'Typo inside the handler': { span: 1, where: 'handler', exc: 'NameError',
    msg: "name 'logg' is not defined", transient: false,
    note: 'Handlers can fail too. Note which loggers this cannot touch, and why.' }
};

// ---- logger strategies ---------------------------------------------------
// catches: list of exception names this logger handles. logs / retries as named.

function makeLoggers() {
  return [
    { id: 1, name: 'No handling', code: 'read(); write()',
      catches: [], logs: false, retry: 0, col: '#c62828' },
    { id: 2, name: 'Bare except', code: 'try: ...\nexcept: pass',
      catches: ['*'], logs: false, retry: 0, col: '#ef6c00' },
    { id: 3, name: 'OSError, logged', code: 'except OSError as e:\n  log(e)',
      catches: ['OSError'], logs: true, retry: 0, col: '#2e7d32' },
    { id: 4, name: 'Logged + retry', code: 'except OSError as e:\n  log(e); retry',
      catches: ['OSError'], logs: true, retry: 3, col: '#1565c0' },
    { id: 5, name: 'Yours', code: '', catches: ['OSError'], logs: true, retry: 0,
      col: '#6a1b9a', custom: true }
  ].map(l => Object.assign(l, {
    alive: true, captured: 0, lost: 0, recorded: 0, offline: 0,
    tape: [], dataLines: [], logLines: [], stopped: '', retriesUsed: 0
  }));
}

let loggers = makeLoggers();
let tick = 0;
let running = false;
let speed = 'Normal';
let scheduled = [];             // {start, end, kind}
let armedHandlerTypo = false;
let selected = 2;               // index into loggers
let view = 'Files';
let frameAcc = 0;
let chipHits = [], cardHits = [];
let speedSelect;
let tlBox = { x: 0, y: 0, w: 10, h: 10 };
let cardsBox = { x: 0, y: 0, w: 10, h: 10 };
let filesBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');
  speedSelect = createSelect();
  for (const k of ['Step by step', 'Slow', 'Normal', 'Fast']) speedSelect.option(k);
  speedSelect.elt.value = 'Normal';
  speedSelect.changed(() => { speed = speedSelect.value(); });
  speedSelect.parent(document.querySelector('main'));
  layoutControls();
  describe('Five logger loops running the same read-and-append cycle against one ' +
           'shared fault timeline, with each resulting data file and log file shown ' +
           'so the strategies can be compared directly.');
}

// ---- simulation ----------------------------------------------------------

function stampAt(t) {
  const base = Date.UTC(2026, 7, 25, 6, 0, 0) + t * MINUTES * 60000;
  return new Date(base).toISOString().replace('.000Z', 'Z');
}
function readingAt(t) {
  const temp = 18 + 6 * Math.sin(t / 288 * Math.PI * 2) + 0.4 * Math.sin(t / 7);
  const pres = 1013.2 + 3 * Math.sin(t / 420) - 0.6 * Math.sin(t / 31);
  const rh = 56 - 10 * Math.sin(t / 288 * Math.PI * 2) + Math.sin(t / 11);
  return temp.toFixed(1) + ',' + pres.toFixed(1) + ',' + rh.toFixed(1);
}

function faultAt(t) {
  for (const s of scheduled) if (t >= s.start && t < s.end) return s;
  return null;
}

function handles(l, exc) {
  if (l.catches.indexOf('*') >= 0) return true;
  if (l.catches.indexOf('Exception') >= 0 && exc !== 'KeyboardInterrupt') return true;
  return l.catches.indexOf(exc) >= 0;
}

function logIt(l, t, exc, msg) {
  // A typo inside the handler only bites a logger that actually runs a handler.
  if (armedHandlerTypo) {
    armedHandlerTypo = false;
    l.alive = false;
    l.stopped = 'NameError inside the except block at ' + stampAt(t);
    l.logLines.push(stampAt(t) + ' ERROR ' + exc + ': ' + msg);
    l.logLines.push('--- handler raised NameError: ' +
                    FAULTS['Typo inside the handler'].msg + ' ---');
    return false;
  }
  l.logLines.push(stampAt(t) + ' ERROR ' + exc + (msg ? ': ' + msg : ''));
  l.recorded += 1;
  return true;
}

function tickAll() {
  if (tick >= TOTAL_TICKS) { running = false; return; }
  const f = faultAt(tick);
  for (const l of loggers) {
    if (!l.alive) { l.tape.push(0); continue; }

    if (f && f.kind === 'Operator presses Ctrl-C') {
      if (handles(l, 'KeyboardInterrupt')) {
        l.tape.push(3);                     // refused to stop
        l.captured += 1;
        l.dataLines.push(stampAt(tick) + ',' + readingAt(tick));
        continue;
      }
      l.alive = false;
      l.stopped = 'stopped cleanly by the operator at ' + stampAt(tick);
      l.tape.push(0);
      continue;
    }

    let failed = false, exc = '', msg = '';
    if (f && (f.kind === 'Transient I2C error' || f.kind === 'Sensor down 30 min' ||
              f.kind === 'Disk full')) {
      const def = FAULTS[f.kind];
      exc = def.exc; msg = def.msg;
      failed = true;
      if (def.transient && l.retry > 0) failed = false;   // the retry catches it
      if (def.transient && l.retry > 0) l.retriesUsed += 1;
    }
    if (f && f.kind === 'Typo inside the handler') {
      exc = 'OSError'; msg = FAULTS['Transient I2C error'].msg; failed = true;
    }

    if (!failed) {
      l.captured += 1;
      l.dataLines.push(stampAt(tick) + ',' + readingAt(tick));
      l.tape.push(1);
      continue;
    }

    if (!handles(l, exc)) {
      l.alive = false;
      l.stopped = 'crashed with an unhandled ' + exc + ' at ' + stampAt(tick);
      l.logLines.push('Traceback (most recent call last):');
      l.logLines.push('  File "logger.py", line 14, in <module>');
      l.logLines.push('    ' + (f && f.where === 'write' ? 'writer.writerow(row)'
                                                         : 'temperature = sensor.temperature'));
      l.logLines.push(exc + ': ' + msg);
      l.lost += 1; l.offline += 1; l.tape.push(2);
      continue;
    }
    if (l.logs) {
      if (!logIt(l, tick, exc, msg)) { l.lost += 1; l.offline += 1; l.tape.push(2); continue; }
    }
    l.lost += 1; l.offline += 1;
    l.tape.push(2);
  }
  tick += 1;
}

function injectFault(kind) {
  const def = FAULTS[kind];
  if (kind === 'Typo inside the handler') {
    armedHandlerTypo = true;
    scheduled.push({ start: tick + 1, end: tick + 2, kind: kind });
    return;
  }
  scheduled.push({ start: tick + 1, end: tick + 1 + def.span, kind: kind });
}

function resetRun() {
  loggers = makeLoggers();
  applyCustom();
  tick = 0; running = false; scheduled = []; armedHandlerTypo = false;
}

// ---- the learner's own logger --------------------------------------------

let custom = { OSError: true, Exception: false, RuntimeError: false, bare: false,
               logs: true, retry: false };

function applyCustom() {
  const l = loggers[4];
  l.catches = [];
  if (custom.bare) l.catches = ['*'];
  else {
    if (custom.OSError) l.catches.push('OSError');
    if (custom.Exception) l.catches.push('Exception');
    if (custom.RuntimeError) l.catches.push('RuntimeError');
  }
  l.logs = custom.logs;
  l.retry = custom.retry ? 3 : 0;
  l.code = customCode();
}

function customCode() {
  if (custom.bare) return 'except:' + (custom.logs ? '\n  log(e)' : '\n  pass');
  const names = [];
  if (custom.OSError) names.push('OSError');
  if (custom.RuntimeError) names.push('RuntimeError');
  if (custom.Exception) names.push('Exception');
  if (!names.length) return 'no try/except';
  return 'except (' + names.join(', ') + '):' +
         (custom.logs ? '\n  log(e)' : '\n  pass') + (custom.retry ? ' + retry' : '');
}

// ---- verdicts ------------------------------------------------------------

function verdictFor(l) {
  const gaps = l.lost;
  const parts = [];
  parts.push('Logger ' + l.id + ' captured ' + l.captured + ' of ' + tick +
             ' readings and recorded ' + l.recorded + ' fault' +
             (l.recorded === 1 ? '' : 's') + '.');
  if (!l.alive) parts.push('It ' + l.stopped + '.');
  if (gaps > 0 && l.recorded === 0) {
    parts.push('Its data has ' + gaps + ' unexplained gap' + (gaps === 1 ? '' : 's') +
               '. Six months from now nobody will be able to tell whether those gaps ' +
               'were weather, hardware, or a bug.');
  } else if (gaps > 0) {
    parts.push('Every gap has a matching log entry, so the gaps are explainable.');
  } else if (tick > 0) {
    parts.push('No gaps at all.');
  }
  if (l.tape.indexOf(3) >= 0) {
    parts.push('It also swallowed a KeyboardInterrupt. This logger cannot be stopped ' +
               'normally - you would have to kill the process.');
  }
  if (l.retriesUsed > 0) {
    parts.push('It recovered from ' + l.retriesUsed + ' transient failure' +
               (l.retriesUsed === 1 ? '' : 's') + ' by retrying.');
  }
  return parts.join(' ');
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 28;
  const w = canvasWidth - 2 * margin;
  tlBox = { x: margin, y: top, w: w, h: 52 };
  if (isNarrow()) {
    const ch = 5 * 42 + 22;
    cardsBox = { x: margin, y: top + 56, w: w, h: ch };
    filesBox = { x: margin, y: top + 56 + ch + 6, w: w,
                 h: drawHeight - (top + 56 + ch + 6) - 6 };
  } else {
    cardsBox = { x: margin, y: top + 56, w: w, h: 164 };
    filesBox = { x: margin, y: top + 56 + 170, w: w,
                 h: drawHeight - (top + 56 + 170) - 6 };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  speedSelect.position(margin + 48, isNarrow() ? y0 + 112 : y0 + 90);
  speedSelect.style('width', '104px');
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  if (running) {
    frameAcc += 1;
    const every = speed === 'Slow' ? 14 : (speed === 'Normal' ? 4 : 1);
    if (speed === 'Step by step') running = false;
    else {
      const n = speed === 'Fast' ? 6 : 1;
      if (frameAcc >= every) { frameAcc = 0; for (let i = 0; i < n; i++) tickAll(); }
    }
  }
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(21);
  text('Resilient Logger Fault Bench', canvasWidth / 2, 1);

  drawTimeline();
  drawCards();
  if (view === 'Files') drawFiles(); else drawTable();
  drawControlRegion();
}

function drawTimeline() {
  const b = tlBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 8, R = b.x + b.w - 8;
  const px = (t) => L + t / TOTAL_TICKS * (R - L);
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('shared fault timeline - every logger gets the same fault at the same instant',
       L, b.y + 4);
  const ty = b.y + 24, th = 14;
  noStroke(); fill('#eceff1');
  rect(L, ty, R - L, th, 2);
  for (const s of scheduled) {
    fill(s.kind === 'Operator presses Ctrl-C' ? '#6a1b9a'
         : (s.kind === 'Typo inside the handler' ? '#ad1457' : '#c62828'));
    rect(px(s.start), ty, Math.max(2, px(s.end) - px(s.start)), th, 1);
  }
  fill('#2e7d32');
  rect(L, ty, px(tick) - L, 3);
  stroke('#0d2b45'); strokeWeight(1.6);
  line(px(tick), ty - 3, px(tick), ty + th + 3);
  noStroke(); fill('#0d2b45'); textAlign(LEFT, TOP); textSize(9.5);
  text('tick ' + tick + ' of ' + TOTAL_TICKS + '   ' + stampAt(tick), L, ty + th + 3);
  textAlign(RIGHT, TOP);
  text(scheduled.length + ' fault' + (scheduled.length === 1 ? '' : 's') + ' injected',
       R, ty + th + 3);
}

function drawCards() {
  const b = cardsBox;
  cardHits = [];
  const n = loggers.length;
  if (isNarrow()) {
    for (let i = 0; i < n; i++) drawCard(loggers[i], i, b.x, b.y + i * 42, b.w, 40, true);
  } else {
    const cw = (b.w - (n - 1) * 6) / n;
    for (let i = 0; i < n; i++) drawCard(loggers[i], i, b.x + i * (cw + 6), b.y, cw, b.h, false);
  }
}

function drawCard(l, i, x, y, w, h, row) {
  const sel = i === selected;
  noStroke(); fill(l.alive ? '#ffffff' : '#fbecec');
  stroke(sel ? l.col : '#c3d0dc'); strokeWeight(sel ? 2.4 : 1);
  rect(x, y, w, h, 4);
  noStroke();
  fill(l.col); rect(x + 1, y + 1, 4, h - 2, 2);
  cardHits.push({ x: x, y: y, w: w, h: h, i: i });

  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(row ? 10.5 : 10); textStyle(BOLD);
  let nm = l.id + '. ' + l.name;
  while (textWidth(nm) > w - 60 && nm.length > 6) nm = nm.slice(0, -2) + '\u2026';
  text(nm, x + 10, y + 5);
  textStyle(NORMAL);
  textAlign(RIGHT, TOP); textSize(9.5);
  fill(l.alive ? '#1b5e20' : '#b71c1c');
  text(l.alive ? (l.tape.indexOf(3) >= 0 ? 'unstoppable' : 'running') : 'STOPPED',
       x + w - 8, y + 6);

  if (row) {
    // narrow: one line of counters and a short tape
    textFont(MONO); textSize(9.5); textAlign(LEFT, TOP); fill('#37474f');
    text(l.captured + ' kept  ' + l.lost + ' lost  ' + l.recorded + ' logged',
         x + 10, y + 20);
    textFont('Arial');
    drawTape(l, x + w - 132, y + 22, 124, 10);
    return;
  }

  textFont(MONO); textSize(9); fill('#546e7a'); textAlign(LEFT, TOP);
  const codeLines = (l.custom ? customCode() : l.code).split('\n');
  for (let k = 0; k < codeLines.length; k++) {
    let cl = codeLines[k];
    while (textWidth(cl) > w - 16 && cl.length > 4) cl = cl.slice(0, -2) + '\u2026';
    text(cl, x + 10, y + 20 + k * 11);
  }
  textFont('Arial');
  let yy = y + 20 + codeLines.length * 11 + 6;
  drawTape(l, x + 10, yy, w - 20, 12);
  yy += 18;
  const rows = [['kept', l.captured, '#1b5e20'], ['lost', l.lost, l.lost ? '#b71c1c' : '#8a97a4'],
                ['logged', l.recorded, l.recorded ? '#0d47a1' : '#b71c1c'],
                ['offline', (l.offline * MINUTES) + ' min', '#546e7a']];
  for (const [k, v, col] of rows) {
    if (yy + 13 > y + h - 4) break;
    fill('#8a97a4'); textAlign(LEFT, TOP); textSize(9.5);
    text(k, x + 10, yy);
    fill(col); textAlign(RIGHT, TOP);
    text(String(v), x + w - 10, yy);
    yy += 13;
  }
}

// A one-pixel-per-interval tape. Green rows written, red gaps, grey not running.
function drawTape(l, x, y, w, h) {
  noStroke(); fill('#eceff1');
  rect(x, y, w, h, 1);
  const n = Math.max(1, l.tape.length);
  const step = w / TOTAL_TICKS;
  for (let i = 0; i < l.tape.length; i++) {
    const v = l.tape[i];
    if (v === 1) fill('#66bb6a');
    else if (v === 2) fill('#ef5350');
    else if (v === 3) fill('#ab47bc');
    else fill('#cfd8dc');
    rect(x + i * step, y, Math.max(0.9, step), h);
  }
  noFill(); stroke('#b0bec5'); strokeWeight(0.8);
  rect(x, y, w, h, 1);
  noStroke();
}

function drawFiles() {
  const b = filesBox;
  const l = loggers[selected];
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD);
  text('Logger ' + l.id + ' - ' + l.name, b.x + 9, b.y + 5);
  textStyle(NORMAL);
  fill('#5a6a78'); textAlign(RIGHT, TOP); textSize(9.5);
  text('click any logger above to inspect its files', b.x + b.w - 9, b.y + 6);

  const half = isNarrow() ? b.w - 18 : (b.w - 26) / 2;
  const py = b.y + 22;
  const ph = isNarrow() ? (b.h - 30) / 2 - 3 : b.h - 30;
  drawPane('readings.csv', l.dataLines, b.x + 9, py, half, ph, '#12181d', '#d7f9d7',
           l.dataLines.length ? null : 'empty');
  if (isNarrow()) {
    drawPane('station.log', l.logLines, b.x + 9, py + ph + 6, half, ph, '#1b1410',
             '#ffcc80', l.logLines.length ? null : 'empty - no faults were recorded');
  } else {
    drawPane('station.log', l.logLines, b.x + 17 + half, py, half, ph, '#1b1410',
             '#ffcc80', l.logLines.length ? null : 'empty - no faults were recorded');
  }
}

function drawPane(title, lines, x, y, w, h, bg, fg, emptyMsg) {
  noStroke(); fill(bg);
  rect(x, y, w, h, 3);
  textFont(MONO); textSize(9.5); textAlign(LEFT, TOP);
  fill('#78909c');
  text(title, x + 6, y + 4);
  const lh = 11;
  const rows = Math.floor((h - 18) / lh);
  if (!lines.length) {
    fill('#78909c');
    text(emptyMsg || '', x + 6, y + 18);
    textFont('Arial');
    return;
  }
  const shown = lines.slice(Math.max(0, lines.length - rows));
  for (let i = 0; i < shown.length; i++) {
    let t = shown[i];
    fill(t.indexOf('Traceback') === 0 || t.indexOf('  File') === 0 ||
         t.indexOf('    ') === 0 || /^[A-Z]\w+Error/.test(t) || t.indexOf('---') === 0
         ? '#ff8a80' : fg);
    while (textWidth(t) > w - 12 && t.length > 4) t = t.slice(0, -2) + '\u2026';
    text(t, x + 6, y + 16 + i * lh);
  }
  fill('#607d8b'); textAlign(RIGHT, TOP);
  text(lines.length + ' lines', x + w - 6, y + 4);
  textFont('Arial');
}

function drawTable() {
  const b = filesBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD);
  text('After ' + tick + ' intervals', b.x + 9, b.y + 5);
  textStyle(NORMAL);
  const L = b.x + 9, W = b.w - 18;
  const cols = [0, 0.30, 0.44, 0.56, 0.68, 0.82];
  const hdr = ['strategy', 'kept', 'lost', 'logged', 'offline', 'state'];
  let y = b.y + 22;
  fill('#8a97a4'); textSize(9.5);
  for (let i = 0; i < hdr.length; i++) {
    textAlign(i === 0 ? LEFT : RIGHT, TOP);
    text(hdr[i], L + cols[i] * W + (i === 0 ? 0 : 40), y);
  }
  y += 13;
  for (const l of loggers) {
    if (y + 14 > b.y + b.h - 40) break;
    fill(l === loggers[selected] ? '#eef4fb' : '#ffffff');
    rect(L, y - 1, W, 14);
    fill('#0d2b45'); textAlign(LEFT, TOP); textSize(9.8);
    let nm = l.id + '. ' + l.name;
    while (textWidth(nm) > cols[1] * W - 6 && nm.length > 5) nm = nm.slice(0, -2) + '\u2026';
    text(nm, L, y);
    const vals = [l.captured, l.lost, l.recorded, (l.offline * MINUTES) + 'm',
                  l.alive ? (l.tape.indexOf(3) >= 0 ? 'unstoppable' : 'up') : 'dead'];
    const colr = ['#1b5e20', l.lost ? '#b71c1c' : '#8a97a4',
                  l.recorded ? '#0d47a1' : '#b71c1c', '#546e7a',
                  l.alive ? (l.tape.indexOf(3) >= 0 ? '#6a1b9a' : '#1b5e20') : '#b71c1c'];
    for (let i = 0; i < vals.length; i++) {
      fill(colr[i]); textAlign(RIGHT, TOP);
      text(String(vals[i]), L + cols[i + 1] * W + 40, y);
    }
    y += 14;
  }
  y += 4;
  fill('#33475b'); textAlign(LEFT, TOP); textSize(10);
  para(L, y, W, verdictFor(loggers[selected]), 11.5, 10);
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 6;
  const narrow = isNarrow();
  chipHits = [];

  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(10);
  text('Inject a fault at the current tick', margin, y0);
  let x = margin, yy = y0 + 13;
  const keys = Object.keys(FAULTS);
  for (const k of keys) {
    textSize(10.5);
    const w = textWidth(k) + 14;
    if (x + w > canvasWidth - margin) { x = margin; yy += 25; }
    chipSm(x, yy, k, false);
    x += w + 5;
  }
  yy += 27;

  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(10);
  text('Logger 5 - build your own', margin, yy);
  yy += 13;
  x = margin;
  x = chipSm(x, yy, 'catch OSError', custom.OSError && !custom.bare) + 5;
  x = chipSm(x, yy, 'catch RuntimeError', custom.RuntimeError && !custom.bare) + 5;
  x = chipSm(x, yy, 'catch Exception', custom.Exception && !custom.bare) + 5;
  x = chipSm(x, yy, 'bare except', custom.bare) + 5;
  x = chipSm(x, yy, 'log it', custom.logs) + 5;
  chipSm(x, yy, 'retry x3', custom.retry);

  const ry = narrow ? y0 + 140 : y0 + 84;
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
  text('Speed', margin, (narrow ? y0 + 112 : ry) + 12);
  x = narrow ? margin : margin + 162;
  x = chip(x, ry, running ? 'Pause' : 'Run', running) + 6;
  x = chip(x, ry, 'One tick', false) + 6;
  x = chip(x, ry, 'Reset', false) + 6;
  chip(x, ry, view === 'Files' ? 'Show comparison' : 'Show files', view !== 'Files');
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
  textSize(10.5); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 14;
  const h = 21;
  noStroke(); fill(on ? '#1565c0' : '#eef2f6');
  stroke(on ? '#0d47a1' : '#c3ced8'); strokeWeight(1);
  rect(x, y, w, h, 4);
  noStroke(); fill(on ? '#ffffff' : '#37474f');
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
  for (const c of cardHits) {
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      selected = c.i;
      return false;
    }
  }
  return true;
}

function onChip(label) {
  if (FAULTS[label]) { injectFault(label); if (!running && speed !== 'Step by step') running = true; return; }
  if (label === 'Run' || label === 'Pause') running = !running;
  else if (label === 'One tick') tickAll();
  else if (label === 'Reset') resetRun();
  else if (label === 'Show comparison') view = 'Table';
  else if (label === 'Show files') view = 'Files';
  else if (label === 'catch OSError') { custom.OSError = !custom.OSError; custom.bare = false; applyCustom(); }
  else if (label === 'catch RuntimeError') { custom.RuntimeError = !custom.RuntimeError; custom.bare = false; applyCustom(); }
  else if (label === 'catch Exception') { custom.Exception = !custom.Exception; custom.bare = false; applyCustom(); }
  else if (label === 'bare except') { custom.bare = !custom.bare; applyCustom(); }
  else if (label === 'log it') { custom.logs = !custom.logs; applyCustom(); }
  else if (label === 'retry x3') { custom.retry = !custom.retry; applyCustom(); }
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
