// Unit Conversion Workbench MicroSim
// CANVAS_HEIGHT: 560
// Bloom Level: Apply (L3) - the learner calculates conversions by watching units
// cancel, not by recalling a memorised multiplier.
// The "Flip the fraction" button is the point of the whole sim: seeing the
// method FAIL, and the units refuse to cancel, is what proves that cancellation
// is a check rather than a ritual.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 190;

// ---- controls ----
let valueInput;
let valueSlider;
let fromSelect;
let toSelect;
let whyCheckbox;
let diffCheckbox;
let quizButton;
let flipButton;
let answerInput;
let checkButton;

// ---- state ----
let quantityKey = 'pressure';
let inputValue = 29.92;
let inverted = false;         // "Flip the fraction" demo
let lastSliderValue = null;
let quizActive = false;
let quizRevealed = false;
let quizFeedback = '';
let quizState = 'pending';   // 'pending' | 'right' | 'wrong'
let tabRects = [];

const NARROW_BREAKPOINT = 620;

// ---- unit tables -------------------------------------------------------
// factor = how many base units one of this unit is worth.
const QUANTITIES = {
  temperature: {
    label: 'Temperature',
    base: 'K',
    slider: { lo: -100, hi: 500, step: 1, def: 24 },
    units: [
      { sym: '°C', name: 'degrees Celsius' },
      { sym: '°F', name: 'degrees Fahrenheit' },
      { sym: 'K',       name: 'kelvin' }
    ],
    defFrom: '°C', defTo: '°F'
  },
  pressure: {
    label: 'Pressure',
    base: 'Pa',
    slider: { lo: 0, hi: 1200, step: 0.01, def: 29.92 },
    units: [
      { sym: 'hPa',  name: 'hectopascals',       factor: 100 },
      { sym: 'mbar', name: 'millibars',          factor: 100 },
      { sym: 'inHg', name: 'inches of mercury',  factor: 3386.389 },
      { sym: 'Pa',   name: 'pascals',            factor: 1 },
      { sym: 'atm',  name: 'atmospheres',        factor: 101325 }
    ],
    defFrom: 'inHg', defTo: 'hPa'
  },
  speed: {
    label: 'Speed',
    base: 'm/s',
    slider: { lo: 0, hi: 300, step: 0.1, def: 24 },
    units: [
      { sym: 'm/s',  name: 'metres per second',    factor: 1 },
      { sym: 'km/h', name: 'kilometres per hour',  factor: 1 / 3.6 },
      { sym: 'mph',  name: 'miles per hour',       factor: 0.44704 },
      { sym: 'kn',   name: 'knots',                factor: 0.5144444 }
    ],
    defFrom: 'm/s', defTo: 'km/h'
  },
  length: {
    label: 'Length',
    base: 'm',
    slider: { lo: 0, hi: 2000, step: 0.1, def: 100 },
    units: [
      { sym: 'm',  name: 'metres',     factor: 1 },
      { sym: 'ft', name: 'feet',       factor: 0.3048 },
      { sym: 'km', name: 'kilometres', factor: 1000 },
      { sym: 'mi', name: 'miles',      factor: 1609.344 }
    ],
    defFrom: 'm', defTo: 'ft'
  }
};

const TAB_ORDER = ['temperature', 'pressure', 'speed', 'length'];

// Temperature is written out as named steps per ordered pair rather than run
// through the multiply-then-add engine, because the familiar forms
// ("subtract 32, then times five ninths") are what students are taught, and
// the whole point here is to make the offset step visible on its own line.
const TEMP_STEPS = {
  '°C>°F': [
    { op: 'mul', v: 1.8,      show: '9/5', kind: 'scale',  unitTo: '°F', unitFrom: '°C' },
    { op: 'add', v: 32,                     kind: 'offset', unitTo: '°F' }
  ],
  '°F>°C': [
    { op: 'add', v: -32,                    kind: 'offset', unitTo: '°F' },
    { op: 'mul', v: 5 / 9,    show: '5/9', kind: 'scale',  unitTo: '°C', unitFrom: '°F' }
  ],
  '°C>K': [
    { op: 'add', v: 273.15,                 kind: 'offset', unitTo: 'K' }
  ],
  'K>°C': [
    { op: 'add', v: -273.15,                kind: 'offset', unitTo: '°C' }
  ],
  '°F>K': [
    { op: 'add', v: -32,                    kind: 'offset', unitTo: '°F' },
    { op: 'mul', v: 5 / 9,    show: '5/9', kind: 'scale',  unitTo: '°C', unitFrom: '°F' },
    { op: 'add', v: 273.15,                 kind: 'offset', unitTo: 'K' }
  ],
  'K>°F': [
    { op: 'add', v: -273.15,                kind: 'offset', unitTo: '°C' },
    { op: 'mul', v: 1.8,      show: '9/5', kind: 'scale',  unitTo: '°F', unitFrom: '°C' },
    { op: 'add', v: 32,                     kind: 'offset', unitTo: '°F' }
  ]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  valueInput = createInput(String(inputValue));
  valueInput.size(70);
  valueInput.input(onValueTyped);

  fromSelect = createSelect();
  fromSelect.changed(onUnitChanged);
  toSelect = createSelect();
  toSelect.changed(onUnitChanged);

  whyCheckbox = createCheckbox(' Show me why', true);
  whyCheckbox.changed(function () { /* read live in draw() */ });

  diffCheckbox = createCheckbox(' This is a temperature CHANGE', false);

  quizButton = createButton('Quiz me');
  quizButton.mousePressed(startQuiz);

  flipButton = createButton('Flip the fraction');
  flipButton.mousePressed(function () { inverted = !inverted; });

  answerInput = createInput('');
  answerInput.size(80);
  answerInput.attribute('placeholder', 'answer');

  checkButton = createButton('Check answer');
  checkButton.mousePressed(checkAnswer);

  buildForQuantity(true);
  layoutControls();

  describe('A unit conversion workbench. Choose a quantity, type a value, and the ' +
           'conversion is worked out as a fraction chain with the cancelling units ' +
           'struck through, so the surviving unit is visible rather than assumed. ' +
           'A flip button turns the conversion fraction upside down so the learner ' +
           'can watch the units fail to cancel.', LABEL);
}

function buildForQuantity(useDefaults) {
  const q = QUANTITIES[quantityKey];

  fromSelect.elt.innerHTML = '';
  toSelect.elt.innerHTML = '';
  q.units.forEach(function (u) {
    fromSelect.option(u.sym);
    toSelect.option(u.sym);
  });
  fromSelect.selected(q.defFrom);
  toSelect.selected(q.defTo);

  if (valueSlider) valueSlider.remove();
  valueSlider = createSlider(q.slider.lo, q.slider.hi, q.slider.def, q.slider.step);
  lastSliderValue = valueSlider.value();

  if (useDefaults) {
    inputValue = q.slider.def;
    valueInput.value(String(inputValue));
  }
  inverted = false;
}

function layoutControls() {
  const r1 = drawHeight + 10;
  const r2 = drawHeight + 48;
  const r3 = drawHeight + 86;
  const r4 = drawHeight + 122;

  valueInput.position(70, r1);
  valueSlider.position(sliderLeftMargin, r1 + 4);
  valueSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));

  fromSelect.position(60, r2);
  fromSelect.size(100);
  toSelect.position(230, r2);
  toSelect.size(100);

  whyCheckbox.position(10, r3);
  diffCheckbox.position(160, r3);

  quizButton.position(10, r4);
  flipButton.position(100, r4);
  answerInput.position(130, r4);
  checkButton.position(224, r4);
}

// ---- main draw ---------------------------------------------------------

function draw() {
  updateCanvasSize();
  syncSlider();

  const q = QUANTITIES[quantityKey];
  const isTemp = quantityKey === 'temperature';
  const showWhy = whyCheckbox.checked() && !(quizActive && !quizRevealed);

  diffCheckbox.style('display', isTemp ? 'block' : 'none');
  answerInput.style('display', quizActive ? 'block' : 'none');
  checkButton.style('display', quizActive ? 'block' : 'none');
  flipButton.style('display', quizActive ? 'none' : 'block');

  // regions
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
  text('Unit Conversion Workbench', canvasWidth / 2, 10);

  drawTabs(44);

  if (quizActive && !quizRevealed) drawQuizPrompt();

  const from = fromSelect.value();
  const to = toSelect.value();
  const contentTop = 88;

  if (from === to) {
    drawSameUnitNotice(contentTop);
  } else if (isTemp) {
    drawTemperatureChain(from, to, contentTop, showWhy);
  } else {
    drawFactorChain(q, from, to, contentTop, showWhy);
  }

  drawControlLabels(q);
}

function drawTabs(y) {
  const gap = 6;
  const w = (canvasWidth - 2 * margin - gap * 3) / 4;
  tabRects = [];
  textAlign(CENTER, CENTER);
  textSize(canvasWidth < NARROW_BREAKPOINT ? 13 : 15);
  for (let i = 0; i < TAB_ORDER.length; i++) {
    const k = TAB_ORDER[i];
    const x = margin + i * (w + gap);
    const active = k === quantityKey;
    stroke(active ? '#0d47a1' : '#cfd8dc');
    strokeWeight(active ? 2 : 1);
    fill(active ? '#bbdefb' : 'white');
    rect(x, y, w, 30, 5);
    noStroke();
    fill(active ? '#0d47a1' : '#546e7a');
    text(QUANTITIES[k].label, x + w / 2, y + 16);
    tabRects.push({ x: x, y: y, w: w, h: 30, key: k });
  }
}

function drawSameUnitNotice(top) {
  fill('#e65100');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Pick two different units.', canvasWidth / 2, top + 60);
}

// ---- the fraction chain, for everything except temperature -------------

function drawFactorChain(q, from, to, top, showWhy) {
  const fFrom = unitFactor(q, from);
  const fTo = unitFactor(q, to);
  const k = fFrom / fTo;
  const result = inverted ? inputValue / k : inputValue * k;

  let y = top;
  y = drawStageLabel('Stage 1 - what you have', y);
  y = drawBigTerm(fmt(inputValue) + ' ' + from, y, '#0d47a1');

  if (showWhy) {
    y = drawStageLabel(inverted
      ? 'Stages 2 and 3 - the fraction is upside down, so nothing cancels'
      : 'Stages 2 and 3 - multiply by a fraction equal to 1, and watch the units cancel', y + 4);

    const atoms = [];
    atoms.push(qty(fmt(inputValue), from, !inverted));
    atoms.push(op('×'));
    if (inverted) {
      atoms.push(frac(qty('1', from, false), qty(fmt(k), to, false)));
    } else {
      atoms.push(frac(qty(fmt(k), to, false), qty('1', from, true)));
    }
    atoms.push(op('='));
    atoms.push(qty(fmt(result), inverted ? from + '·' + from + '/' + to : to, false));
    y = flowAtoms(atoms, margin, y, canvasWidth - 2 * margin) + 6;

    y = drawStageLabel('Stage 4 - the arithmetic, and the unit that survives', y);
    const arith = inverted
      ? fmt(inputValue) + ' ÷ ' + fmt(k) + ' = ' + fmt(result)
      : fmt(inputValue) + ' × ' + fmt(k) + ' = ' + fmt(result);
    y = drawBigTerm(arith, y, '#37474f');
  }

  const unitOut = inverted ? from + '·' + from + '/' + to : to;
  drawResultBox(fmt(result) + ' ' + unitOut, inverted);

  if (inverted) {
    fill('#c62828');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(13);
    text(wrapText('Nothing cancelled. The answer came out in ' + from + '·' + from + '/' +
                  to + ', which is not a ' + q.label.toLowerCase() +
                  ' at all. That is the check working: if the units do not cancel, ' +
                  'the fraction is the wrong way up.', canvasWidth - 2 * margin, 13),
         margin, drawHeight - 60);
  }
  drawQuizFeedback();
}

// ---- temperature, where the offset gets its own line -------------------

function drawTemperatureChain(from, to, top, showWhy) {
  const asDifference = diffCheckbox.checked();
  const steps = TEMP_STEPS[from + '>' + to] || [];
  let v = inputValue;
  let y = top;

  y = drawStageLabel('Stage 1 - what you have', y);
  y = drawBigTerm(fmt(inputValue) + ' ' + from + (asDifference ? ' of change' : ''), y, '#0d47a1');

  const used = asDifference ? steps.filter(function (s) { return s.kind === 'scale'; }) : steps;

  if (showWhy) {
    y = drawStageLabel('Stage 5 - the scaling step and the offset step, kept apart', y + 2);
    textAlign(LEFT, CENTER);
    for (let i = 0; i < used.length; i++) {
      const s = used[i];
      const before = v;
      v = s.op === 'mul' ? v * s.v : v + s.v;
      const tag = s.kind === 'scale' ? 'scale ' : 'offset';
      const body = s.op === 'mul'
        ? fmt(before) + '  × ' + s.show + '  =  ' + fmt(v)
        : fmt(before) + '  ' + (s.v < 0 ? '− ' + fmt(-s.v) : '+ ' + fmt(s.v)) + '  =  ' + fmt(v);
      noStroke();
      fill(s.kind === 'scale' ? '#1565c0' : '#ef6c00');
      textSize(12);
      text(tag, margin, y + 12);
      fill('black');
      textSize(18);
      text(body, margin + 52, y + 12);
      y += 30;
    }
    y += 4;
  } else {
    for (let i = 0; i < used.length; i++) {
      v = used[i].op === 'mul' ? v * used[i].v : v + used[i].v;
    }
  }

  drawResultBox(fmt(v) + ' ' + to + (asDifference ? ' of change' : ''), false);

  // the warning the spec asks for, always on for temperature
  const warn = asDifference
    ? 'You are converting a CHANGE, so only the scaling step applies. A change of 5 °C ' +
      'is a change of 9 °F - not 41 °F.'
    : 'Converting a CHANGE in temperature instead of a temperature? Tick the box below. ' +
      'A 5 °C rise is a 9 °F rise, not 41 °F.';
  noStroke();
  fill(asDifference ? '#2e7d32' : '#ef6c00');
  textAlign(LEFT, TOP);
  textSize(13);
  text(wrapText(warn, canvasWidth - 2 * margin, 13), margin, drawHeight - 62);

  drawQuizFeedback();
}

// ---- chain atom layout -------------------------------------------------

function qty(num, unit, strike) {
  return { kind: 'qty', num: num, unit: unit, strike: strike };
}
function op(s) {
  return { kind: 'op', s: s };
}
function frac(top, bot) {
  return { kind: 'frac', top: top, bot: bot };
}

function qtyWidth(a, size) {
  textSize(size);
  return textWidth(a.num + ' ') + textWidth(a.unit);
}

function atomWidth(a, size) {
  if (a.kind === 'op') { textSize(size); return textWidth(' ' + a.s + ' ') + 8; }
  if (a.kind === 'qty') return qtyWidth(a, size);
  return max(qtyWidth(a.top, size - 2), qtyWidth(a.bot, size - 2)) + 20;
}

function drawQty(a, x, cy, size) {
  textSize(size);
  textAlign(LEFT, CENTER);
  noStroke();
  fill('black');
  text(a.num + ' ', x, cy);
  const nw = textWidth(a.num + ' ');
  fill(a.strike ? '#c62828' : 'black');
  text(a.unit, x + nw, cy);
  if (a.strike) {
    const uw = textWidth(a.unit);
    stroke('#c62828');
    strokeWeight(2);
    line(x + nw - 1, cy, x + nw + uw + 1, cy - 1);
    noStroke();
  }
  return qtyWidth(a, size);
}

function drawAtom(a, x, cy, size) {
  if (a.kind === 'op') {
    textSize(size);
    textAlign(LEFT, CENTER);
    noStroke();
    fill('#455a64');
    text(' ' + a.s + ' ', x + 4, cy);
    return atomWidth(a, size);
  }
  if (a.kind === 'qty') return drawQty(a, x, cy, size);

  const w = atomWidth(a, size);
  const inner = size - 2;
  const tw = qtyWidth(a.top, inner);
  const bw = qtyWidth(a.bot, inner);
  drawQty(a.top, x + (w - tw) / 2, cy - 17, inner);
  drawQty(a.bot, x + (w - bw) / 2, cy + 17, inner);
  stroke('#455a64');
  strokeWeight(1.5);
  line(x + 6, cy, x + w - 6, cy);
  noStroke();
  return w;
}

// flow the atoms onto as many lines as they need rather than overflowing
function flowAtoms(atoms, x, y, maxW) {
  const size = canvasWidth < NARROW_BREAKPOINT ? 17 : 20;
  const lineH = 62;
  let cx = x;
  let cy = y + lineH / 2;
  for (let i = 0; i < atoms.length; i++) {
    const w = atomWidth(atoms[i], size);
    if (cx + w > x + maxW && cx > x) {
      cx = x;
      cy += lineH;
    }
    drawAtom(atoms[i], cx, cy, size);
    cx += w;
  }
  return cy + lineH / 2;
}

// ---- shared pieces -----------------------------------------------------

function drawStageLabel(s, y) {
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  const lines = wrapText(s, canvasWidth - 2 * margin, 12);
  text(lines, margin, y);
  return y + 4 + lines.split('\n').length * 14;
}

function drawBigTerm(s, y, col) {
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textSize(canvasWidth < NARROW_BREAKPOINT ? 18 : 21);
  text(s, margin, y);
  return y + 32;
}

function drawResultBox(s, bad) {
  const boxY = drawHeight - 116;
  // During a quiz the answer stays hidden - otherwise the box gives it away.
  if (quizActive && !quizRevealed) {
    stroke('#7986cb');
    strokeWeight(2);
    fill('#e8eaf6');
    rect(margin, boxY, canvasWidth - 2 * margin, 44, 6);
    noStroke();
    fill('#283593');
    textAlign(LEFT, CENTER);
    textSize(13);
    text('Result', margin + 10, boxY + 22);
    textAlign(RIGHT, CENTER);
    textSize(canvasWidth < NARROW_BREAKPOINT ? 19 : 23);
    text('?', canvasWidth - margin - 12, boxY + 22);
    return;
  }
  stroke(bad ? '#c62828' : '#2e7d32');
  strokeWeight(2);
  fill(bad ? '#ffebee' : '#e8f5e9');
  rect(margin, boxY, canvasWidth - 2 * margin, 44, 6);
  noStroke();
  fill(bad ? '#b71c1c' : '#1b5e20');
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Result', margin + 10, boxY + 22);
  textAlign(RIGHT, CENTER);
  textSize(canvasWidth < NARROW_BREAKPOINT ? 19 : 23);
  text(s, canvasWidth - margin - 12, boxY + 22);
}

function drawQuizPrompt() {
  noStroke();
  fill('#283593');
  textAlign(CENTER, CENTER);
  textSize(canvasWidth < NARROW_BREAKPOINT ? 18 : 22);
  text(wrapText('Convert ' + fmt(inputValue) + ' ' + fromSelect.value() +
                ' to ' + toSelect.value() + '.', canvasWidth - 2 * margin,
                canvasWidth < NARROW_BREAKPOINT ? 18 : 22),
       canvasWidth / 2, 200);
}

function drawQuizFeedback() {
  if (!quizActive || quizFeedback === '') return;
  noStroke();
  fill(quizState === 'right' ? '#2e7d32' : (quizState === 'wrong' ? '#c62828' : '#546e7a'));
  textAlign(LEFT, TOP);
  textSize(13);
  text(wrapText(quizFeedback, canvasWidth - 2 * margin, 13), margin, drawHeight - 26);
}

function drawControlLabels(q) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Value:', 10, drawHeight + 26);
  text('From:', 10, drawHeight + 64);
  text('To:', 190, drawHeight + 64);
}

// ---- interaction -------------------------------------------------------

function mousePressed() {
  for (let i = 0; i < tabRects.length; i++) {
    const t = tabRects[i];
    if (mouseX > t.x && mouseX < t.x + t.w && mouseY > t.y && mouseY < t.y + t.h) {
      if (t.key !== quantityKey) {
        quantityKey = t.key;
        endQuiz();
        buildForQuantity(true);
        layoutControls();
      }
      return;
    }
  }
}

function onValueTyped() {
  const v = parseFloat(valueInput.value());
  if (!isNaN(v)) {
    inputValue = v;
    const q = QUANTITIES[quantityKey];
    valueSlider.value(constrain(v, q.slider.lo, q.slider.hi));
    lastSliderValue = valueSlider.value();
  }
}

function onUnitChanged() {
  inverted = false;
}

function syncSlider() {
  const v = valueSlider.value();
  if (lastSliderValue === null || v !== lastSliderValue) {
    lastSliderValue = v;
    inputValue = v;
    valueInput.value(String(v));
  }
}

function unitFactor(q, sym) {
  for (let i = 0; i < q.units.length; i++) {
    if (q.units[i].sym === sym) return q.units[i].factor;
  }
  return 1;
}

function startQuiz() {
  const q = QUANTITIES[quantityKey];
  const i = floor(random(q.units.length));
  let j = floor(random(q.units.length - 1));
  if (j >= i) j++;
  fromSelect.selected(q.units[i].sym);
  toSelect.selected(q.units[j].sym);

  const lo = q.slider.lo;
  const hi = q.slider.hi;
  const v = round(random(lo + (hi - lo) * 0.1, lo + (hi - lo) * 0.6) * 10) / 10;
  inputValue = v;
  valueInput.value(String(v));
  valueSlider.value(constrain(v, lo, hi));
  lastSliderValue = valueSlider.value();

  inverted = false;
  quizActive = true;
  quizRevealed = false;
  quizFeedback = 'Convert it yourself. The working is hidden until you answer.';
  quizState = 'pending';
  answerInput.value('');
  quizButton.html('New question');
}

function endQuiz() {
  quizActive = false;
  quizRevealed = false;
  quizFeedback = '';
  quizButton.html('Quiz me');
}

function checkAnswer() {
  const given = parseFloat(answerInput.value());
  const want = computeResult();
  if (isNaN(given)) {
    quizFeedback = 'Type a number first.';
    quizState = 'pending';
    return;
  }
  const tol = max(abs(want) * 0.001, 1e-6);
  const correct = abs(given - want) <= tol;
  quizState = correct ? 'right' : 'wrong';
  quizRevealed = true;   // the chain appears either way - it is the explanation
  quizFeedback = correct
    ? 'Correct. ' + fmt(want) + ' it is. The cancellation is shown above.'
    : 'Not quite - the answer is ' + fmt(want) + '. The cancellation is now shown above; ' +
      'check which unit survived.';
}

function computeResult() {
  const q = QUANTITIES[quantityKey];
  const from = fromSelect.value();
  const to = toSelect.value();
  if (from === to) return inputValue;
  if (quantityKey === 'temperature') {
    const steps = TEMP_STEPS[from + '>' + to] || [];
    const used = diffCheckbox.checked()
      ? steps.filter(function (s) { return s.kind === 'scale'; })
      : steps;
    let v = inputValue;
    for (let i = 0; i < used.length; i++) {
      v = used[i].op === 'mul' ? v * used[i].v : v + used[i].v;
    }
    return v;
  }
  const k = unitFactor(q, from) / unitFactor(q, to);
  return inverted ? inputValue / k : inputValue * k;
}

// ---- helpers -----------------------------------------------------------

// six significant figures, trailing zeros trimmed, so 3.6 stays 3.6 and
// 33.86389 does not turn into 33.9
function fmt(n) {
  if (!isFinite(n)) return '-';
  if (n === 0) return '0';
  let s = Number(n.toPrecision(6)).toString();
  if (Math.abs(n) >= 1e7 || Math.abs(n) < 1e-4) s = n.toExponential(3);
  return s;
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
