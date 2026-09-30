// Python Code Tracer MicroSim
// CANVAS_HEIGHT: 648
// Bloom Level: Apply (L3) - the learner executes a Python program by stepping
// through it, predicting each value before it is revealed.
// No Python is interpreted here. Each program is pre-authored as an explicit
// sequence of snapshots - line number, variable state, console output, error -
// which the tracer replays forwards and backwards. Stepping backwards matters
// because understanding usually arrives one line after the confusion.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 476;
let controlHeight = 172;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 700;
const MONO = 'monospace';

// ---- value helpers -------------------------------------------------------

function pyRepr(val, ty) {
  if (ty === 'str') return '"' + val + '"';
  if (ty === 'bool') return val ? 'True' : 'False';
  if (ty === 'none') return 'None';
  if (ty === 'list') return '[' + val.map(x => fRepr(x)).join(', ') + ']';
  if (ty === 'float') return fRepr(val);
  if (ty === 'func') return '<function ' + val + '>';
  return String(val);
}
function fRepr(x) {
  const s = String(x);
  return (s.indexOf('.') < 0 && s.indexOf('e') < 0) ? s + '.0' : s;
}

// ---- program builder -----------------------------------------------------
// Each builder pushes snapshots. A snapshot owns a complete copy of state, so
// stepping backwards is just an index change.

function makeProgram(src, build) {
  const steps = [];
  let vars = {};        // module scope: name -> {v, t}
  let frame = null;     // {name, vars}
  let con = [];
  const snap = (line, opts) => {
    const o = opts || {};
    steps.push({
      line: line,
      vars: JSON.parse(JSON.stringify(vars)),
      frame: frame ? { name: frame.name, vars: JSON.parse(JSON.stringify(frame.vars)) } : null,
      con: con.slice(),
      changed: o.changed || null,
      note: o.note || '',
      cond: o.cond || null,
      loop: o.loop || null,
      err: o.err || null,
      predict: o.predict || null,
      done: !!o.done
    });
  };
  const api = {
    set: (n, v, t) => { (frame ? frame.vars : vars)[n] = { v: v, t: t }; },
    out: (s) => { con.push(s); },
    enter: (name, pn, pv, pt) => { frame = { name: name, vars: {} }; frame.vars[pn] = { v: pv, t: pt }; },
    leave: () => { frame = null; },
    snap: snap
  };
  build(api);
  return { src: src, steps: steps };
}

const PROGRAMS = {};

// 1. variables and types, ending in a real TypeError
PROGRAMS['1. Variables and types'] = () => makeProgram([
  'reading = "21.4"',
  'print(reading)',
  'print(float(reading) + 1)',
  'result = reading + 1',
  'print("this line never runs")'
], a => {
  a.snap(1, { note: 'About to bind a name to a string value.' });
  a.set('reading', '21.4', 'str');
  a.snap(1, { changed: ['reading'], predict: { q: 'reading', a: '"21.4"' },
    note: 'The quotes are part of the source, not the value. This is text that happens to look like a number.' });
  a.out('21.4');
  a.snap(2, { note: 'print shows the value without quotes, which is exactly why the type is easy to miss.' });
  a.out('22.4');
  a.snap(3, { predict: { q: 'console output', a: '22.4' },
    note: 'float(reading) converts first, so the arithmetic works.' });
  a.snap(4, { err: [
    'Traceback (most recent call last):',
    '  File "trace.py", line 4, in <module>',
    '    result = reading + 1',
    'TypeError: can only concatenate str (not "int") to str'],
    note: 'A str and an int cannot be added. Python will not guess what you meant.' });
  a.snap(4, { done: true,
    note: 'Execution stopped at line 4. Line 5 never runs, and result was never created.' });
});

// 2. a function call, with the parameter binding visible
PROGRAMS['2. A function call'] = () => makeProgram([
  'def celsius_to_fahrenheit(celsius):',
  '    fahrenheit = celsius * 9 / 5 + 32',
  '    return fahrenheit',
  '',
  'temp_c = 21.4',
  'temp_f = celsius_to_fahrenheit(temp_c)',
  'print(f"{temp_c} C is {temp_f:.1f} F")'
], a => {
  a.snap(1, { note: 'def does not run the body. It binds a name to a function object.' });
  a.set('celsius_to_fahrenheit', 'celsius_to_fahrenheit', 'func');
  a.snap(1, { changed: ['celsius_to_fahrenheit'] });
  a.set('temp_c', 21.4, 'float');
  a.snap(5, { changed: ['temp_c'], predict: { q: 'temp_c', a: '21.4' } });
  a.snap(6, { note: 'Calling the function. Execution jumps into the body.' });
  a.enter('celsius_to_fahrenheit', 'celsius', 21.4, 'float');
  a.snap(2, { changed: ['celsius'],
    note: 'The argument temp_c was bound to the parameter celsius. Two names, one value.' });
  a.set('fahrenheit', 21.4 * 9 / 5 + 32, 'float');
  a.snap(2, { changed: ['fahrenheit'],
    predict: { q: 'fahrenheit', a: String(21.4 * 9 / 5 + 32) } });
  a.snap(3, { note: 'return hands the value back and discards the function scope.' });
  a.leave();
  a.set('temp_f', 21.4 * 9 / 5 + 32, 'float');
  a.snap(6, { changed: ['temp_f'],
    note: 'Back in module scope. celsius and fahrenheit are gone.' });
  a.out('21.4 C is 70.5 F');
  a.snap(7, { predict: { q: 'console output', a: '21.4 C is 70.5 F' },
    note: 'The :.1f in the f-string rounds for display only. temp_f still holds 70.52.' });
  a.snap(7, { done: true });
});

// 3. the conditional ladder, run at a chosen input
function condLadder(t) {
  return makeProgram([
    'temperature_c = ' + fRepr(t),
    '',
    'if temperature_c > 35:',
    '    print("Extreme heat")',
    'elif temperature_c > 30:',
    '    print("Hot")',
    'elif temperature_c < 0:',
    '    print("Below freezing")',
    'else:',
    '    print("Normal")'
  ], a => {
    a.set('temperature_c', t, 'float');
    a.snap(1, { changed: ['temperature_c'] });
    const tests = [[3, 'temperature_c > 35', t > 35, 4, 'Extreme heat'],
                   [5, 'temperature_c > 30', t > 30, 6, 'Hot'],
                   [7, 'temperature_c < 0', t < 0, 8, 'Below freezing']];
    let taken = false;
    for (const [ln, expr, val, bodyLn, msg] of tests) {
      a.snap(ln, { cond: { expr: expr, val: val },
        note: val ? 'True, so this branch runs and every later test is skipped.'
                  : 'False, so Python moves on to the next test.' });
      if (val) {
        a.out(msg);
        a.snap(bodyLn, { predict: { q: 'console output', a: msg },
          note: 'Only the first true branch runs.' });
        taken = true;
        break;
      }
    }
    if (!taken) {
      a.out('Normal');
      a.snap(10, { predict: { q: 'console output', a: 'Normal' },
        note: 'Nothing matched, so else runs.' });
    }
    a.snap(taken ? 3 : 10, { done: true,
      note: 'Order matters. If the > 30 test came first, 40 would report Hot and never reach Extreme heat.' });
  });
}

// 4. a for loop that accumulates
PROGRAMS['4. A loop that accumulates'] = () => makeProgram([
  'readings = [21.4, 21.5, 21.3, 21.6]',
  'total = 0.0',
  'for reading in readings:',
  '    total = total + reading',
  '',
  'average = total / len(readings)',
  'print(f"Average: {average:.2f} C")'
], a => {
  const rs = [21.4, 21.5, 21.3, 21.6];
  a.set('readings', rs, 'list');
  a.snap(1, { changed: ['readings'] });
  a.set('total', 0.0, 'float');
  a.snap(2, { changed: ['total'] });
  let total = 0.0;
  for (let i = 0; i < rs.length; i++) {
    a.set('reading', rs[i], 'float');
    a.snap(3, { changed: ['reading'],
      loop: { i: i + 1, n: rs.length, left: rs.length - i - 1 },
      note: 'The loop variable takes the next item from the list.' });
    total = total + rs[i];
    a.set('total', total, 'float');
    a.snap(4, { changed: ['total'],
      loop: { i: i + 1, n: rs.length, left: rs.length - i - 1 },
      predict: { q: 'total', a: String(total) },
      note: i === 2 ? 'That is not a typo. Adding these floats leaves a tiny binary error behind.'
                    : 'total grows by one reading per pass.' });
  }
  a.snap(3, { loop: { i: 4, n: 4, left: 0 },
    note: 'The list is exhausted, so the loop ends and execution continues below it.' });
  const avg = total / rs.length;
  a.set('average', avg, 'float');
  a.snap(6, { changed: ['average'], predict: { q: 'average', a: String(avg) } });
  a.out('Average: ' + avg.toFixed(2) + ' C');
  a.snap(7, { note: 'The stored value is still ' + String(avg) +
    '. Only the printed form is rounded.' });
  a.snap(7, { done: true });
});

// 5. the off-by-one
PROGRAMS['5. An off-by-one bug'] = () => makeProgram([
  '# The author wanted readings 1, 2, 3, 4',
  'for i in range(4):',
  '    print(f"Reading {i}")',
  '',
  'print("Done")'
], a => {
  for (let i = 0; i < 4; i++) {
    a.set('i', i, 'int');
    a.snap(2, { changed: ['i'], loop: { i: i + 1, n: 4, left: 3 - i },
      predict: i === 0 ? { q: 'i', a: '0' } : null,
      note: i === 0 ? 'range(4) starts at zero, not one. This is the bug.' : '' });
    a.out('Reading ' + i);
    a.snap(3, { loop: { i: i + 1, n: 4, left: 3 - i } });
  }
  a.out('Done');
  a.snap(5, { note: 'Four values, 0 through 3. range(4) never produces 4.' });
  a.snap(5, { done: true,
    note: 'To count 1 to 4, write range(1, 5). The stop value is always excluded.' });
});

// 6. the float equality trap
PROGRAMS['6. A float equality trap'] = () => makeProgram([
  'a = 0.1',
  'b = 0.2',
  'total = a + b',
  'print(total)',
  'is_equal = total == 0.3',
  'print(is_equal)',
  'close_enough = abs(total - 0.3) < 1e-9',
  'print(close_enough)'
], a => {
  a.set('a', 0.1, 'float');
  a.snap(1, { changed: ['a'] });
  a.set('b', 0.2, 'float');
  a.snap(2, { changed: ['b'] });
  const total = 0.1 + 0.2;
  a.set('total', total, 'float');
  a.snap(3, { changed: ['total'], predict: { q: 'total', a: String(total) },
    note: 'Neither 0.1 nor 0.2 has an exact binary form, so their sum does not either.' });
  a.out(String(total));
  a.snap(4);
  a.set('is_equal', total === 0.3, 'bool');
  a.snap(5, { changed: ['is_equal'], predict: { q: 'is_equal', a: 'False' },
    note: 'This is not a Python bug. It is how binary floating point works everywhere.' });
  a.out('False');
  a.snap(6);
  a.set('close_enough', Math.abs(total - 0.3) < 1e-9, 'bool');
  a.snap(7, { changed: ['close_enough'], predict: { q: 'close_enough', a: 'True' },
    note: 'The rule: never test floats for exact equality. Test whether the difference is small enough.' });
  a.out('True');
  a.snap(8, { done: true });
});

const LESSONS = {
  '1. Variables and types': 'A value has a type, and the type decides what you can do ' +
    'with it. Everything read back from a CSV file in Chapter 14 arrives as a str, so ' +
    'this error is one you will meet for real.',
  '2. A function call': 'A function call creates a new scope. The argument and the ' +
    'parameter are two names for one value, and the parameter disappears when the ' +
    'function returns.',
  '3. A conditional ladder': 'Python runs the first true branch and skips the rest, so ' +
    'the order of the tests is part of the logic. Re-run this at each input.',
  '4. A loop that accumulates': 'The accumulator pattern: start at a known value, add ' +
    'one item per pass, divide at the end. Watch what the binary floats do to total.',
  '5. An off-by-one bug': 'range(n) counts from 0 and stops before n. The trace makes ' +
    'the zero-start impossible to miss, which reading the code does not.',
  '6. A float equality trap': 'Two decimals that look exact are not, so == is the wrong ' +
    'test. Compare the difference against a tolerance instead.'
};

const PROG_NAMES = ['1. Variables and types', '2. A function call',
                    '3. A conditional ladder', '4. A loop that accumulates',
                    '5. An off-by-one bug', '6. A float equality trap'];
const LADDER_INPUTS = [40, 32, 21.4, -5];

// ---- state ----
let progName = '1. Variables and types';
let ladderT = 40;
let prog = null;
let idx = 0;
let predictOn = true;
let pending = null;         // the step we are being asked to predict
let answered = null;        // 'right' | 'wrong'
let lastAnswer = '';
let score = { right: 0, asked: 0 };
let breakpoints = {};
let chipHits = [], lineHits = [];
let progSelect, inputSelect, predInput;
let listBox = { x: 0, y: 0, w: 10, h: 10 };
let varBox = { x: 0, y: 0, w: 10, h: 10 };
let conBox = { x: 0, y: 0, w: 10, h: 10 };
let noteBox = null;

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  progSelect = createSelect();
  for (const n of PROG_NAMES) progSelect.option(n);
  progSelect.elt.value = progName;
  progSelect.changed(() => { progName = progSelect.value(); reload(); });
  progSelect.parent(document.querySelector('main'));

  inputSelect = createSelect();
  for (const t of LADDER_INPUTS) inputSelect.option(fRepr(t) + ' C', t);
  inputSelect.elt.value = String(ladderT);
  inputSelect.changed(() => { ladderT = parseFloat(inputSelect.value()); reload(); });
  inputSelect.parent(document.querySelector('main'));

  predInput = createInput('');
  predInput.parent(document.querySelector('main'));
  predInput.elt.setAttribute('aria-label', 'your prediction');
  predInput.elt.setAttribute('autocomplete', 'off');
  predInput.style('font-family', MONO);
  predInput.style('font-size', '12px');
  predInput.elt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { submitPrediction(); e.preventDefault(); }
  });

  reload();
  layoutControls();
  describe('A Python program listing with a highlighted current line, a variables ' +
           'panel showing each value and its type, and a console, stepped forwards ' +
           'and backwards with a prediction prompt before each change.');
}

function buildProg() {
  return progName === '3. A conditional ladder' ? condLadder(ladderT) : PROGRAMS[progName]();
}

function reload() {
  prog = buildProg();
  idx = 0;
  pending = null; answered = null; lastAnswer = '';
  score = { right: 0, asked: 0 };
  breakpoints = {};
  if (predInput) predInput.value('');
}

function step() { return prog.steps[Math.min(idx, prog.steps.length - 1)]; }

// ---- prediction ----------------------------------------------------------

function advance() {
  if (pending) return;                 // answer it or skip it, do not step past it
  if (idx >= prog.steps.length - 1) return;
  const next = prog.steps[idx + 1];
  if (predictOn && next.predict && !pending) {
    pending = next;
    answered = null;
    predInput.value('');
    predInput.elt.focus();
    return;
  }
  pending = null; answered = null;
  idx += 1;
}

function normAns(s) {
  return String(s).trim().replace(/^['"]|['"]$/g, '').toLowerCase();
}

function submitPrediction() {
  if (!pending) return;
  const want = pending.predict.a;
  const got = predInput.value();
  lastAnswer = got;
  const a = normAns(got), b = normAns(want);
  let ok = a === b;
  if (!ok) {
    const na = parseFloat(a), nb = parseFloat(b);
    // a numeric answer only counts if it is exactly the same float
    if (!isNaN(na) && !isNaN(nb) && a !== '' && na === nb) ok = true;
  }
  score.asked += 1;
  if (ok) score.right += 1;
  answered = ok ? 'right' : 'wrong';
}

function acceptAndMove() {
  pending = null; answered = null;
  idx += 1;
  predInput.value('');
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 30;
  // the listing is sized to the program, not to the column
  const codeH = 14 + prog.src.length * 15 + 26;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    const lh = Math.min(drawHeight - top - 190, codeH);
    listBox = { x: margin, y: top, w: w, h: lh };
    noteBox = null;
    const rest = drawHeight - (top + lh + 5) - 5;
    varBox = { x: margin, y: top + lh + 5, w: w, h: Math.round(rest * 0.60) };
    conBox = { x: margin, y: varBox.y + varBox.h + 5, w: w,
               h: drawHeight - (varBox.y + varBox.h + 5) - 5 };
  } else {
    const rw = 300;
    const lw = canvasWidth - rw - 3 * margin;
    const avail = drawHeight - top - 6;
    const lh = Math.min(avail - 70, codeH);
    listBox = { x: margin, y: top, w: lw, h: lh };
    noteBox = { x: margin, y: top + lh + 6, w: lw, h: avail - lh - 6 };
    const rx = canvasWidth - margin - rw;
    const vh = Math.round(avail * 0.58);
    varBox = { x: rx, y: top, w: rw, h: vh };
    conBox = { x: rx, y: top + vh + 6, w: rw, h: drawHeight - (top + vh + 6) - 6 };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  progSelect.position(margin + 62, y0);
  progSelect.style('width', '198px');
  const narrow = isNarrow();
  inputSelect.position(narrow ? margin + 62 : margin + 330, narrow ? y0 + 26 : y0);
  inputSelect.style('width', '86px');
  predInput.position(margin + 132, narrow ? y0 + 118 : y0 + 96);
  predInput.style('width', Math.min(190, canvasWidth - margin - 250) + 'px');
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(22);
  text('Python Code Tracer', canvasWidth / 2, 2);

  drawListing();
  drawNote();
  drawVars();
  drawConsole();
  drawControlRegion();
}

function drawListing() {
  const b = listBox;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y, b.w, b.h);
  drawingContext.clip();
  noStroke(); fill('#1b2530');
  rect(b.x, b.y, b.w, b.h, 4);

  const s = step();
  const lh = Math.min(15, (b.h - 14) / prog.src.length);
  textFont(MONO); textSize(Math.min(12.5, lh * 0.86));
  lineHits = [];
  for (let i = 0; i < prog.src.length; i++) {
    const n = i + 1;
    const yy = b.y + 7 + i * lh;
    const here = s.line === n;
    if (here) {
      noStroke(); fill(s.err ? '#5c1a1a' : '#284b63');
      rect(b.x + 2, yy - 1, b.w - 4, lh, 2);
    }
    noStroke();
    fill(breakpoints[n] ? '#ff5252' : '#607d8b');
    textAlign(RIGHT, TOP);
    text(breakpoints[n] ? '*' + n : String(n), b.x + 22, yy);
    fill(here ? '#ffffff' : '#b6ccd8');
    textAlign(LEFT, TOP);
    text(prog.src[i], b.x + 38, yy);
    if (here) {
      fill(s.err ? '#ff8a80' : '#82b1ff');
      textAlign(LEFT, TOP);
      text('>', b.x + 27, yy);
    }
    lineHits.push({ x: b.x + 2, y: yy, w: 26, h: lh, n: n });
  }
  textFont('Arial');
  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();

  // status strip under the listing
  const sy = b.y + 10 + prog.src.length * lh;
  noStroke(); fill(0, 0, 0, 0);
  textAlign(LEFT, TOP); textSize(10);
  let msg = '';
  if (s.cond) msg = s.cond.expr + '  evaluates to  ' + (s.cond.val ? 'True' : 'False');
  if (s.loop) msg = (msg ? msg + '   ' : '') + 'iteration ' + s.loop.i + ' of ' +
                    s.loop.n + ', ' + s.loop.left + ' to go';
  if (msg) {
    fill(255, 232);
    const w = textWidth(msg) + 14;
    rect(b.x + 6, sy, Math.min(w, b.w - 12), 17, 3);
    fill(s.cond ? (s.cond.val ? '#1b5e20' : '#b71c1c') : '#0d2b45');
    text(msg, b.x + 13, sy + 4);
  }
}

function drawVars() {
  const b = varBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const s = step();
  const L = b.x + 9, W = b.w - 18;
  let y = b.y + 6;
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
  text('variables', L, y);
  textAlign(RIGHT, TOP);
  text('step ' + (idx + 1) + ' of ' + prog.steps.length, b.x + b.w - 9, y);
  y += 15;

  const rows = [];
  if (s.frame) {
    rows.push({ hdr: s.frame.name + '() scope' });
    for (const k of Object.keys(s.frame.vars)) rows.push({ k: k, d: s.frame.vars[k] });
    rows.push({ hdr: 'module scope' });
  }
  for (const k of Object.keys(s.vars)) rows.push({ k: k, d: s.vars[k] });

  textFont(MONO); textSize(11.5);
  let nameW = 56;
  for (const r of rows) if (r.k) nameW = Math.max(nameW, textWidth(r.k) + 8);
  nameW = Math.min(nameW, W * 0.52);
  for (const r of rows) {
    if (y + 14 > b.y + b.h - 4) break;
    if (r.hdr) {
      textFont('Arial'); noStroke(); fill('#8a97a4'); textSize(9.5);
      textAlign(LEFT, TOP); text(r.hdr, L, y + 2);
      textFont(MONO); y += 13; continue;
    }
    const ch = s.changed && s.changed.indexOf(r.k) >= 0;
    if (ch) { noStroke(); fill('#fff8e1'); rect(L - 3, y - 1, W + 6, 15, 2); }
    noStroke();
    fill(ch ? '#e65100' : '#37474f'); textSize(11.5); textAlign(LEFT, TOP);
    let nm = r.k;
    while (textWidth(nm) > nameW - 5 && nm.length > 3) nm = nm.slice(0, -2) + '…';
    text(nm, L, y);
    fill(ch ? '#bf360c' : '#0d2b45');
    let shown = pyRepr(r.d.v, r.d.t);
    const maxw = W - nameW - 34;
    while (textWidth(shown) > maxw && shown.length > 4) shown = shown.slice(0, -2) + '…';
    text(shown, L + nameW, y);
    textFont('Arial'); textSize(9.5); fill('#90a4ae'); textAlign(RIGHT, TOP);
    text('(' + r.d.t + ')', b.x + b.w - 11, y + 1);
    textFont(MONO);
    y += 15;
  }
  textFont('Arial');
  if (rows.length === 0) {
    fill('#b0bec5'); textSize(10.5); textAlign(LEFT, TOP);
    text('nothing defined yet', L, y);
    y += 15;
  }

  if (!noteBox && s.note && y + 14 < b.y + b.h) {
    y = Math.max(y + 4, b.y + b.h - 42);
    fill(s.err ? '#b71c1c' : '#546e7a'); textSize(10); textAlign(LEFT, TOP);
    para(L, y, W, s.note, 11.5, 10);
  }
}

function drawNote() {
  const b = noteBox;
  if (!b) return;
  const s = step();
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 10, W = b.w - 20;
  let y = b.y + 7;
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
  text('what just happened', L, y);
  y += 15;
  if (s.note) {
    fill(s.err ? '#b71c1c' : '#33475b'); textSize(11.5);
    y = para(L, y, W, s.note, 13.5, 11.5) + 6;
  }
  if (s.done) {
    fill('#1b5e20'); textSize(10.5);
    y = para(L, y, W, 'End of program. Step back through it, or choose another from the ' +
         'list below.', 12, 10.5) + 6;
  }
  const lesson = LESSONS[progName];
  if (lesson && b.y + b.h - y > 46) {
    const ly = b.y + b.h - 8 - wrapLines(lesson, W, 10).length * 11.5;
    stroke('#e3e9ef'); strokeWeight(1);
    line(L, ly - 7, L + W, ly - 7);
    noStroke(); fill('#78909c'); textSize(10); textAlign(LEFT, TOP);
    para(L, ly, W, lesson, 11.5, 10);
  }
}

function drawConsole() {
  const b = conBox;
  noStroke(); fill('#12181d'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const s = step();
  textFont(MONO); textSize(11); textAlign(LEFT, TOP);
  fill('#7f8c8d');
  text('console', b.x + 8, b.y + 5);
  const lines = s.con.concat(s.err || []);
  const lh = 13;
  const rows = Math.floor((b.h - 22) / lh);
  const shown = lines.slice(Math.max(0, lines.length - rows));
  const errStart = s.con.length;
  for (let i = 0; i < shown.length; i++) {
    const gi = Math.max(0, lines.length - rows) + i;
    fill(gi >= errStart ? '#ff8a80' : '#d7f9d7');
    let t = shown[i];
    const maxw = b.w - 16;
    while (textWidth(t) > maxw && t.length > 4) t = t.slice(0, -2) + '…';
    text(t, b.x + 8, b.y + 19 + i * lh);
  }
  textFont('Arial');
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
  text('Program', margin, y0 + 10);
  if (progName === '3. A conditional ladder') {
    text('Input', narrow ? margin : margin + 278, (narrow ? y0 + 36 : y0) + 10);
    inputSelect.show();
  } else inputSelect.hide();

  chipHits = [];
  const cy = narrow ? y0 + 62 : y0 + 34;
  let x = margin;
  x = chip(x, cy, 'Step back', false) + 6;
  x = chip(x, cy, 'Step', false) + 6;
  x = chip(x, cy, 'Run to end', false) + 6;
  x = chip(x, cy, 'Reset', false) + 6;
  chip(x, cy, 'Predict first', predictOn);

  // prediction row
  const py0 = narrow ? y0 + 92 : y0 + 70;
  if (pending) {
    fill('#0d2b45'); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD);
    text('What will ' + pending.predict.q + ' be after line ' + pending.line + '?',
         margin, py0);
    textStyle(NORMAL);
    fill('#5a6a78'); textSize(10);
    text('type it as Python would print it', margin, py0 + 14);
    predInput.show();
    if (answered) {
      const ok = answered === 'right';
      fill(ok ? '#1b5e20' : '#b71c1c'); textSize(11); textStyle(BOLD);
      text(ok ? 'Correct' : 'Not quite', margin + 336, py0 + 26);
      textStyle(NORMAL); textSize(10); fill('#33475b');
      text(ok ? '' : 'answer: ' + pending.predict.a, margin + 336, py0 + 40);
      chip(margin + 336 + 92, py0 + 22, 'Continue', false);
    } else {
      chip(margin + 336, py0 + 22, 'Check', false);
      chip(margin + 336 + 62, py0 + 22, 'Skip', false);
    }
  } else {
    predInput.hide();
    fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
    const s = step();
    para(margin, py0, canvasWidth - 2 * margin - 120,
         s.done ? 'Program finished. Step back to re-read it, or pick another program.'
                : 'Click a line number to set a breakpoint. Run to end stops there.',
         11.5, 10);
  }
  fill('#0d2b45'); textAlign(RIGHT, TOP); textSize(10.5);
  text('predictions ' + score.right + ' / ' + score.asked,
       canvasWidth - margin, py0 + 2);
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
  for (const h of lineHits) {
    if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) {
      breakpoints[h.n] = !breakpoints[h.n];
      return false;
    }
  }
  return true;
}

function onChip(label) {
  if (label === 'Step') advance();
  else if (label === 'Step back') { pending = null; answered = null; idx = Math.max(0, idx - 1); }
  else if (label === 'Run to end') {
    if (pending) return;
    answered = null;
    let guard = 0;
    while (idx < prog.steps.length - 1 && guard++ < 500) {
      idx += 1;
      if (breakpoints[prog.steps[idx].line]) break;
    }
  } else if (label === 'Reset') { idx = 0; pending = null; answered = null; }
  else if (label === 'Predict first') { predictOn = !predictOn; pending = null; answered = null; }
  else if (label === 'Check') submitPrediction();
  else if (label === 'Skip') { score.asked += 1; answered = 'wrong'; }
  else if (label === 'Continue') acceptAndMove();
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
