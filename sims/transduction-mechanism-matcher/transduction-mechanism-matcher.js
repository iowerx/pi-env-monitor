// Transduction Mechanism Matcher MicroSim
// CANVAS_HEIGHT: 506
// Bloom Level: Analyze (L4) - the learner attributes each sensor to the physical
// mechanism it uses and follows the chain from property to material change to
// electrical output.
// The three-column structure IS the decomposition the objective asks for: you
// cannot complete a chain without separating the property from the mechanism
// from the output. Hints name the missing idea rather than the answer, so the
// task stays diagnostic instead of turning into trial and error.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 456;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 660;

// ---- controls ----
let showButton, resetButton;

// ---- content ------------------------------------------------------------
const PROPERTIES = [
  { id: 'temp',  label: 'Temperature' },
  { id: 'pres',  label: 'Pressure' },
  { id: 'hum',   label: 'Humidity' },
  { id: 'light', label: 'Light' },
  { id: 'accel', label: 'Acceleration' }
];
const MECHANISMS = [
  { id: 'diode', label: 'Diode voltage shift' },
  { id: 'piezo', label: 'Piezoresistive effect' },
  { id: 'cap',   label: 'Capacitance change' },
  { id: 'photo', label: 'Photoelectric effect' },
  { id: 'mems',  label: 'MEMS proof mass on springs' }
];
const OUTPUTS = [
  { id: 'volt',   label: 'Voltage change' },
  { id: 'res',    label: 'Resistance change' },
  { id: 'capout', label: 'Capacitance change' },
  { id: 'cur',    label: 'Current generated' }
];

const CHAINS = [
  { p: 'temp', m: 'diode', o: 'volt', ch: 6,
    text: "A silicon diode's forward voltage falls by about 2 mV per degree Celsius. " +
          'Measure the voltage, compute the temperature. This is the temperature element ' +
          'inside the BME280.' },
  { p: 'pres', m: 'piezo', o: 'res', ch: 7,
    text: 'A thin silicon diaphragm flexes under air pressure. Flexing changes its ' +
          'resistance. This is the pressure element inside the BME280.' },
  { p: 'hum', m: 'cap', o: 'capout', ch: 8,
    text: 'A polymer film between two electrodes absorbs water vapour, changing how much ' +
          'charge the gap can store.' },
  { p: 'light', m: 'photo', o: 'cur', ch: 9,
    text: 'Light striking silicon frees electrons, producing a current proportional to the ' +
          'light. This is a photodiode, and at larger scale, a solar cell.' },
  { p: 'accel', m: 'mems', o: 'capout', ch: 11,
    text: 'A microscopic mass on microscopic springs shifts when the ground moves. The ' +
          'shift changes the gap between plates, changing capacitance.' }
];

// Hints name what to reconsider. None of them name the answer.
const HINT_PM = {
  temp:  'Warmth changes something inside a silicon junction. Which mechanism is named after a junction?',
  pres:  'Air pushing on a thin diaphragm makes it bend. Which mechanism is about something being squeezed?',
  hum:   'Water vapour soaks into a polymer film between two electrodes. What does that change about the gap?',
  light: 'Photons hitting silicon knock electrons loose. One of these mechanisms is named after exactly that.',
  accel: 'Nothing chemical or optical here - something physically has to move. Which mechanism has a mass and springs?'
};
const HINT_MO = {
  diode: 'The clue is in the name of the mechanism. A diode shift changes what, exactly?',
  piezo: 'The clue is in the name: piezo-RESISTIVE.',
  cap:   'Humidity does change something in a polymer, but not its resistance. What property describes ' +
         'storing charge across a gap?',
  photo: 'Freed electrons moving through a circuit are called what?',
  mems:  'Two plates, and the gap between them changes size. Which electrical property depends on that gap?'
};

// ---- state --------------------------------------------------------------
let colP = [], colM = [], colO = [];
let solved = [];                 // indices into CHAINS
let pending = { p: null, m: null };
let message = null;              // { text, ok }
let cardHits = [];
let pressedCard = null;
let dragging = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  showButton = createButton('Show me one');
  showButton.mousePressed(showOne);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);

  resetAll();
  layoutControls();

  describe('Three columns of cards: physical properties, material mechanisms, and ' +
           'electrical outputs. The learner joins one card from each column into a ' +
           'three-link chain. Correct chains lock together and reveal an explanation ' +
           'with its chapter reference; wrong links spring back with a hint that names ' +
           'the idea to reconsider rather than the answer.', LABEL);
}

function layoutControls() {
  showButton.position(10, drawHeight + 12);
  resetButton.position(112, drawHeight + 12);
}

function resetAll() {
  colP = shuffled(PROPERTIES);
  colM = shuffled(MECHANISMS);
  colO = shuffled(OUTPUTS);
  solved = [];
  pending = { p: null, m: null };
  message = { text: 'Click a physical property on the left, then the mechanism it uses, ' +
                    'then the electrical output that mechanism produces. You can drag ' +
                    'between cards instead if you prefer.', ok: null };
}

function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function showOne() {
  for (let i = 0; i < CHAINS.length; i++) {
    if (solved.indexOf(i) < 0) {
      solved.push(i);
      pending = { p: null, m: null };
      message = { text: 'Worked example. ' + CHAINS[i].text + '  (Chapter ' + CHAINS[i].ch + ')',
                  ok: true };
      return;
    }
  }
  message = { text: 'All five chains are already complete.', ok: true };
}

function isSolvedProp(id) {
  return solved.some(function (i) { return CHAINS[i].p === id; });
}
function isSolvedMech(id) {
  return solved.some(function (i) { return CHAINS[i].m === id; });
}
function isSolvedOut(id) {
  return solved.some(function (i) { return CHAINS[i].o === id; });
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;

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
  text('Transduction Mechanism Matcher', canvasWidth / 2, narrow ? 10 : 6);

  const gap = narrow ? 8 : 16;
  const colW = (canvasWidth - 2 * margin - 2 * gap) / 3;
  const headY = narrow ? 34 : 38;
  const top = headY + 18;
  const rowH = 46;
  const rowGap = 8;
  const cardZ = narrow ? 10 : 12;

  const xs = [margin, margin + colW + gap, margin + 2 * (colW + gap)];
  const heads = ['Physical property', 'Material mechanism', 'Electrical output'];
  textAlign(CENTER, TOP);
  textSize(narrow ? 10 : 12);
  for (let i = 0; i < 3; i++) {
    fill('#546e7a');
    text(heads[i], xs[i] + colW / 2, headY);
  }

  cardHits = [];
  drawColumn(colP, xs[0], top, colW, rowH, rowGap, 'p', cardZ);
  drawColumn(colM, xs[1], top, colW, rowH, rowGap, 'm', cardZ);
  // the outputs column has four cards, so nudge it down half a row to sit centred
  drawColumn(colO, xs[2], top + (rowH + rowGap) / 2, colW, rowH, rowGap, 'o', cardZ);

  drawChainLines();
  drawDragLine();

  const panelY = top + 5 * (rowH + rowGap) + 6;
  drawPanel({ x: margin, y: panelY, w: canvasWidth - 2 * margin, h: drawHeight - panelY - 10 }, narrow);
  drawControlLabels();
}

function drawColumn(list, x, y0, w, h, gap, kind, z) {
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    const y = y0 + i * (h + gap);
    const done = kind === 'p' ? isSolvedProp(c.id)
               : kind === 'm' ? isSolvedMech(c.id)
               : isSolvedOut(c.id);
    const sel = (kind === 'p' && pending.p === c.id) || (kind === 'm' && pending.m === c.id);

    stroke(done ? '#2e7d32' : (sel ? '#e65100' : '#b0bec5'));
    strokeWeight(done || sel ? 2 : 1);
    fill(done ? '#e8f5e9' : (sel ? '#fff3e0' : 'white'));
    rect(x, y, w, h, 6);

    noStroke();
    fill(done ? '#1b5e20' : '#263238');
    textAlign(CENTER, CENTER);
    text(wrapText(c.label, w - 10, z), x + w / 2, y + h / 2);

    if (done) {
      fill('#2e7d32');
      textAlign(RIGHT, TOP);
      textSize(11);
      text('OK', x + w - 5, y + 3);
    }
    cardHits.push({ id: c.id, kind: kind, x: x, y: y, w: w, h: h,
                    cx: x + w / 2, cy: y + h / 2, rx: x + w, lx: x });
  }
}

function cardBox(kind, id) {
  for (let i = 0; i < cardHits.length; i++) {
    if (cardHits[i].kind === kind && cardHits[i].id === id) return cardHits[i];
  }
  return null;
}

function drawChainLines() {
  for (let k = 0; k < solved.length; k++) {
    const c = CHAINS[solved[k]];
    const a = cardBox('p', c.p);
    const b = cardBox('m', c.m);
    const d = cardBox('o', c.o);
    if (!a || !b || !d) continue;
    stroke('#43a047');
    strokeWeight(2.5);
    line(a.rx, a.cy, b.lx, b.cy);
    line(b.rx, b.cy, d.lx, d.cy);
    noStroke();
    fill('#43a047');
    circle(b.lx, b.cy, 6);
    circle(d.lx, d.cy, 6);
  }
  // a half-built chain
  if (pending.p && pending.m) {
    const a = cardBox('p', pending.p);
    const b = cardBox('m', pending.m);
    if (a && b) {
      stroke('#e65100');
      strokeWeight(2.5);
      line(a.rx, a.cy, b.lx, b.cy);
      noStroke();
    }
  }
}

function drawDragLine() {
  if (!dragging || !pressedCard) return;
  stroke('#e65100');
  strokeWeight(2);
  drawingContext.setLineDash([5, 4]);
  line(pressedCard.rx, pressedCard.cy, mouseX, mouseY);
  drawingContext.setLineDash([]);
  noStroke();
}

function drawPanel(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text(solved.length + ' of ' + CHAINS.length + ' chains complete', box.x + 10, box.y + 7);

  if (!message) return;
  const col = message.ok === true ? '#1b5e20' : (message.ok === false ? '#b71c1c' : '#455a64');
  fill(col);
  const z = narrow ? 11 : 12;
  textSize(z);
  text(wrapText(message.text, box.w - 20, z), box.x + 10, box.y + 24);
}

function drawControlLabels() {
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, CENTER);
  textSize(11);
  text(solved.length + ' of ' + CHAINS.length + ' complete', 178, drawHeight + 26);
}

// ---- interaction --------------------------------------------------------

function cardAt(mx, my) {
  for (let i = 0; i < cardHits.length; i++) {
    const c = cardHits[i];
    if (mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) return c;
  }
  return null;
}

function mousePressed() {
  pressedCard = cardAt(mouseX, mouseY);
  dragging = false;
}

function mouseDragged() {
  if (pressedCard) dragging = true;
}

function mouseReleased() {
  const target = cardAt(mouseX, mouseY);
  if (!pressedCard) { dragging = false; return; }

  if (dragging && target && target !== pressedCard) {
    // a drag from one card to another: seed the chain from the source, then apply
    if (pressedCard.kind === 'p') pending = { p: pressedCard.id, m: null };
    if (pressedCard.kind === 'm' && pending.p) pending.m = pressedCard.id;
    choose(target);
  } else if (target && target === pressedCard) {
    choose(target);
  }
  pressedCard = null;
  dragging = false;
}

function choose(c) {
  if (c.kind === 'p') {
    if (isSolvedProp(c.id)) {
      const done = CHAINS[solved.find ? 0 : 0];
      const idx = solved.filter(function (i) { return CHAINS[i].p === c.id; })[0];
      message = { text: CHAINS[idx].text + '  (Chapter ' + CHAINS[idx].ch + ')', ok: true };
      return;
    }
    pending = { p: c.id, m: null };
    message = { text: 'Now pick the material mechanism that turns ' + labelOf('p', c.id).toLowerCase() +
                      ' into an electrical change.', ok: null };
    return;
  }

  if (c.kind === 'm') {
    if (!pending.p) {
      message = { text: 'Start from a physical property in the left column.', ok: false };
      return;
    }
    const ok = CHAINS.some(function (ch) { return ch.p === pending.p && ch.m === c.id; });
    if (!ok) {
      message = { text: HINT_PM[pending.p], ok: false };
      pending = { p: null, m: null };
      return;
    }
    pending.m = c.id;
    message = { text: 'Good. Now pick the electrical output that mechanism produces.', ok: null };
    return;
  }

  // an output card
  if (!pending.p || !pending.m) {
    message = { text: 'Build the chain in order: property, then mechanism, then output.', ok: false };
    return;
  }
  const idx = CHAINS.findIndex(function (ch) {
    return ch.p === pending.p && ch.m === pending.m && ch.o === c.id;
  });
  if (idx < 0) {
    message = { text: HINT_MO[pending.m], ok: false };
    pending = { p: null, m: null };
    return;
  }
  if (solved.indexOf(idx) < 0) solved.push(idx);
  pending = { p: null, m: null };
  const done = solved.length === CHAINS.length;
  message = { text: CHAINS[idx].text + '  (Chapter ' + CHAINS[idx].ch + ')' +
                    (done ? '  All five chains complete.' : ''), ok: true };
}

function labelOf(kind, id) {
  const src = kind === 'p' ? PROPERTIES : (kind === 'm' ? MECHANISMS : OUTPUTS);
  const f = src.filter(function (x) { return x.id === id; })[0];
  return f ? f.label : id;
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
