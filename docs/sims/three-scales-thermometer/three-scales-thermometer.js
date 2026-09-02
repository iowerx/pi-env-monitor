// Three Scales Thermometer MicroSim
// CANVAS_HEIGHT: 608
// Bloom Level: Apply (L3) - the learner converts between Fahrenheit, Celsius and
// kelvin, and separates converting a temperature from converting a difference.
// The three scales share one physical column on purpose. Seeing 0 C and 32 F at
// the same height is what "different zero points" actually means, and it is the
// thing a formula hides.
// Everything is stored in kelvin and derived, so the three scales cannot drift
// out of agreement with each other.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 88;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 700;
const K_LO = 0, K_HI = 400;

// ---- controls ----
let modeButton, resetButton;
let fInput, cInput, kInput;

// ---- state ----
let kA = 294.15;              // 21 C
let kB = 299.15;              // 26 C, only used in difference mode
let diffMode = false;
let dragging = null;          // 'A' | 'B' | null
let blockedMsg = '';
let blockedTimer = 0;
let presetLabel = '';
let tubeRect = { x: 0, y: 0, w: 1, h: 1 };
let presetHits = [];
let editing = null;           // which input the learner is typing in

const PRESETS = [
  { name: 'Absolute zero',      c: -273.15, note: 'Atomic motion at its minimum. Never reached.' },
  { name: 'Coldest on Earth',   c: -89.2,   note: 'Vostok Station, Antarctica, 1983.' },
  { name: 'Water freezes',      c: 0,       note: '0 C, 32 F, 273.15 K.' },
  { name: 'A cool day',         c: 10,      note: '10 C is 50 F.' },
  { name: 'Comfortable room',   c: 21,      note: 'About 70 F.' },
  { name: 'Human body',         c: 37,      note: '98.6 F, which is a conversion of 37, not a measurement.' },
  { name: 'Hot summer day',     c: 32,      note: '90 F.' },
  { name: 'Heat advisory',      c: 38,      note: '100 F.' },
  { name: 'Hottest on Earth',   c: 56.7,    note: 'Death Valley, 1913. Still disputed.' },
  { name: 'Water boils',        c: 100,     note: '212 F, 373.15 K, at sea level pressure.' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  modeButton = createButton('Switch to difference mode');
  modeButton.mousePressed(function () {
    diffMode = !diffMode;
    modeButton.html(diffMode ? 'Switch to value mode' : 'Switch to difference mode');
    presetLabel = '';
  });

  resetButton = createButton('Reset');
  resetButton.mousePressed(function () {
    kA = 294.15; kB = 299.15; presetLabel = ''; blockedMsg = '';
    syncInputs();
  });

  fInput = createInput(''); fInput.size(66); fInput.input(function () { fromInput('F'); });
  cInput = createInput(''); cInput.size(66); cInput.input(function () { fromInput('C'); });
  kInput = createInput(''); kInput.size(66); kInput.input(function () { fromInput('K'); });
  [fInput, cInput, kInput].forEach(function (el) {
    el.elt.addEventListener('blur', function () { editing = null; syncInputs(); });
  });

  syncInputs();
  layoutControls();

  describe('A single thermometer column with Fahrenheit, Celsius and kelvin scales ' +
           'running alongside it, all aligned to the same physical temperature. A ' +
           'draggable marker moves all three readouts together and the panel works ' +
           'the arithmetic through step by step. Difference mode adds a second marker ' +
           'and shows that the 32 degree offset cancels when you subtract, so five ' +
           'degrees Celsius of warming is nine degrees Fahrenheit and not forty-one.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 46;
  modeButton.position(10, r1);
  resetButton.position(196, r1);
  fInput.position(38, r2);
  cInput.position(148, r2);
  kInput.position(250, r2);
}

// ---- conversions, all derived from kelvin ------------------------------

function kToC(k) { return k - 273.15; }
function kToF(k) { return (k - 273.15) * 9 / 5 + 32; }
function cToK(c) { return c + 273.15; }
function fToK(f) { return (f - 32) * 5 / 9 + 273.15; }

function syncInputs() {
  if (editing !== 'F') fInput.value(nf(kToF(kA), 1, 1));
  if (editing !== 'C') cInput.value(nf(kToC(kA), 1, 1));
  if (editing !== 'K') kInput.value(nf(kA, 1, 1));
}

function fromInput(which) {
  editing = which;
  const raw = which === 'F' ? fInput.value() : (which === 'C' ? cInput.value() : kInput.value());
  const v = parseFloat(raw);
  if (isNaN(v)) return;
  let k = which === 'F' ? fToK(v) : (which === 'C' ? cToK(v) : v);
  if (k < 0) { k = 0; flashBlocked(); }
  kA = constrain(k, K_LO, K_HI);
  presetLabel = '';
  syncInputs();
}

function flashBlocked() {
  blockedMsg = 'There is no temperature below absolute zero. Atoms cannot move less ' +
               'than not at all.';
  blockedTimer = 4000;
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  if (blockedTimer > 0) { blockedTimer -= deltaTime; if (blockedTimer <= 0) blockedMsg = ''; }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  fill('black');
  textAlign(CENTER, TOP);
  textSize(narrow ? 18 : 23);
  text('Three Scales, One Temperature', canvasWidth / 2, narrow ? 8 : 6);

  let presetB, thermoB, calcB;
  if (narrow) {
    thermoB = { x: margin, y: 34, w: 152, h: drawHeight - 34 - 112 };
    calcB = { x: margin + 160, y: 34, w: canvasWidth - margin - (margin + 160),
              h: drawHeight - 34 - 112 };
    presetB = { x: margin, y: drawHeight - 106, w: canvasWidth - 2 * margin, h: 96 };
  } else {
    presetB = { x: margin, y: 40, w: 168, h: drawHeight - 54 };
    thermoB = { x: margin + 176, y: 40, w: 214, h: drawHeight - 54 };
    calcB = { x: margin + 398, y: 40, w: canvasWidth - margin - (margin + 398),
              h: drawHeight - 54 };
  }

  drawPresets(presetB, narrow);
  drawThermometer(thermoB, narrow);
  drawCalc(calcB, narrow);
  drawControlLabels();
}

function kToY(box, k) {
  return map(k, K_LO, K_HI, box.y + box.h - 26, box.y + 26);
}

function drawThermometer(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const tubeW = narrow ? 14 : 18;
  const tubeX = box.x + (narrow ? 46 : 58);
  tubeRect = { x: tubeX, y: box.y, w: tubeW, h: box.h };

  const yTop = kToY(box, K_HI);
  const yBot = kToY(box, K_LO);

  // the tube itself, tinted from cold to warm
  for (let y = yTop; y <= yBot; y++) {
    const k = map(y, yBot, yTop, K_LO, K_HI);
    stroke(lerpColor(color('#1565c0'), color('#c62828'), constrain(k / K_HI, 0, 1)));
    strokeWeight(1);
    line(tubeX, y, tubeX + tubeW, y);
  }
  noStroke();
  stroke('#607d8b');
  strokeWeight(1);
  noFill();
  rect(tubeX, yTop, tubeW, yBot - yTop, 3);
  noStroke();

  const z = narrow ? 8 : 9;
  // Fahrenheit on the left
  drawScale(box, tubeX - 4, -1, -400, 200, 100, function (v) { return fToK(v); },
            'F', '#6a1b9a', z, narrow);
  // Celsius immediately to the right of the tube
  drawScale(box, tubeX + tubeW + 4, 1, -250, 100, 50, function (v) { return cToK(v); },
            'C', '#00695c', z, narrow);
  // kelvin further right again
  drawScale(box, tubeX + tubeW + (narrow ? 48 : 62), 1, 0, 400, 50, function (v) { return v; },
            'K', '#37474f', z, narrow);

  drawGuide(box, 273.15);
  drawGuide(box, 373.15);

  drawMarker(box, kA, 'A', '#c62828');
  if (diffMode) drawMarker(box, kB, 'B', '#1565c0', true);
}

function drawScale(box, x, dir, lo, hi, step, toK, unit, col, z, narrow) {
  textSize(z);
  for (let v = lo; v <= hi; v += step) {
    const k = toK(v);
    if (k < K_LO - 0.01 || k > K_HI + 0.01) continue;
    const y = kToY(box, k);
    stroke(col);
    strokeWeight(1);
    line(x, y, x + dir * 6, y);
    noStroke();
    fill(col);
    textAlign(dir > 0 ? LEFT : RIGHT, CENTER);
    text(v, x + dir * 9, y);
  }
  noStroke();
  fill(col);
  textAlign(CENTER, BOTTOM);
  textSize(z + 2);
  text(unit === 'K' ? 'K' : ('deg ' + unit), x + dir * (narrow ? 12 : 16), box.y + 20);
}

// A horizontal line straight across all three scales at a temperature everybody
// already knows, so the different zero points are visible as a physical fact.
function drawGuide(box, k) {
  const y = kToY(box, k);
  stroke('rgba(120,144,156,0.75)');
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(box.x + 4, y, box.x + box.w - 4, y);
  drawingContext.setLineDash([]);
  noStroke();
}

function drawMarker(box, k, tag, col, right) {
  const y = kToY(box, k);
  stroke(col);
  strokeWeight(2);
  line(box.x + 6, y, box.x + box.w - 6, y);
  noStroke();
  fill(col);
  if (right) {
    triangle(box.x + box.w - 2, y, box.x + box.w - 19, y - 8, box.x + box.w - 19, y + 8);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(10);
    text(tag, box.x + box.w - 13, y);
  } else {
    triangle(box.x + 2, y, box.x + 19, y - 8, box.x + 19, y + 8);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(10);
    text(tag, box.x + 13, y);
  }
}

function drawPresets(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Jump to a known temperature', box.x + 8, box.y + 6);

  presetHits = [];
  const cols = narrow ? 2 : 1;
  const rowsPer = ceil(PRESETS.length / cols);
  const cw = (box.w - 12) / cols;
  const rh = narrow ? 14 : min(30, (box.h - 30) / PRESETS.length);

  for (let i = 0; i < PRESETS.length; i++) {
    const c = i % cols;
    const r = floor(i / cols);
    const x = box.x + 6 + c * cw;
    const y = box.y + (narrow ? 20 : 22) + r * rh;
    const sel = presetLabel === PRESETS[i].name;
    if (sel) {
      fill('#e3f2fd');
      rect(x, y - 1, cw - 4, rh - 2, 3);
    }
    fill(sel ? '#0d47a1' : '#37474f');
    textAlign(LEFT, TOP);
    textSize(narrow ? 9 : 11);
    text(PRESETS[i].name, x + 4, y + (narrow ? 2 : 4));
    fill('#90a4ae');
    textAlign(RIGHT, TOP);
    text(nf(PRESETS[i].c, 1, 1), x + cw - 8, y + (narrow ? 2 : 4));
    presetHits.push({ i: i, x: x, y: y, w: cw - 4, h: rh - 2 });
  }
}

function drawCalc(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const inner = box.w - 20;
  const z = narrow ? 11 : 12;
  let y = box.y + 8;
  const cA = kToC(kA), fA = kToF(kA);

  if (!diffMode) {
    fill('#546e7a');
    textAlign(LEFT, TOP);
    textSize(11);
    text('One temperature, three names', box.x + 10, y);
    y += 18;

    const rows = [['#6a1b9a', nf(fA, 1, 1) + ' deg F'],
                  ['#00695c', nf(cA, 1, 1) + ' deg C'],
                  ['#37474f', nf(kA, 1, 1) + ' K']];
    for (let i = 0; i < 3; i++) {
      fill(rows[i][0]);
      textSize(narrow ? 17 : 20);
      text(rows[i][1], box.x + 10, y);
      y += narrow ? 22 : 26;
    }
    y += 6;

    fill('#546e7a');
    textSize(11);
    text('Celsius to Fahrenheit, one step at a time', box.x + 10, y);
    y += 16;
    fill('#212121');
    textSize(z + 1);
    text(nf(cA, 1, 1) + '  x  9/5  =  ' + nf(cA * 9 / 5, 1, 1), box.x + 10, y);
    y += 17;
    text(nf(cA * 9 / 5, 1, 1) + '  +  32  =  ' + nf(fA, 1, 1) + ' deg F', box.x + 10, y);
    y += 22;

    fill('#546e7a');
    textSize(11);
    text('Celsius to kelvin, in one', box.x + 10, y);
    y += 16;
    fill('#212121');
    textSize(z + 1);
    text(nf(cA, 1, 1) + '  +  273.15  =  ' + nf(kA, 1, 1) + ' K', box.x + 10, y);
    y += 22;

    fill('#78909c');
    textSize(z - 1);
    text(wrapText('The two dashed lines across the column are 0 C = 32 F = 273.15 K and ' +
                  '100 C = 212 F = 373.15 K. Look at where each scale puts its own zero.',
                  inner, z - 1), box.x + 10, y);
    y += wrapText('The two dashed lines across the column are 0 C = 32 F = 273.15 K and ' +
                  '100 C = 212 F = 373.15 K. Look at where each scale puts its own zero.',
                  inner, z - 1).split('\n').length * (z + 2) + 8;

    if (presetLabel !== '') {
      const p = PRESETS.filter(function (q) { return q.name === presetLabel; })[0];
      if (p) {
        fill('#00695c');
        textSize(z);
        text(wrapText(p.name + '. ' + p.note, inner, z), box.x + 10, y);
        y += wrapText(p.name + '. ' + p.note, inner, z).split('\n').length * (z + 3) + 6;
      }
    }
  } else {
    const cB = kToC(kB), fB = kToF(kB);
    const dC = cB - cA, dF = fB - fA, dK = kB - kA;

    fill('#546e7a');
    textAlign(LEFT, TOP);
    textSize(11);
    text('Two markers, and the gap between them', box.x + 10, y);
    y += 18;
    fill('#c62828');
    textSize(z + 1);
    text('A:  ' + nf(cA, 1, 1) + ' C   ' + nf(fA, 1, 1) + ' F   ' + nf(kA, 1, 1) + ' K',
         box.x + 10, y);
    y += 17;
    fill('#1565c0');
    text('B:  ' + nf(cB, 1, 1) + ' C   ' + nf(fB, 1, 1) + ' F   ' + nf(kB, 1, 1) + ' K',
         box.x + 10, y);
    y += 24;

    fill('#546e7a');
    textSize(11);
    text('The difference', box.x + 10, y);
    y += 16;
    fill('#00695c');
    textSize(narrow ? 16 : 19);
    text(nf(dC, 1, 1) + ' deg C', box.x + 10, y);
    y += narrow ? 21 : 24;
    fill('#6a1b9a');
    text(nf(dF, 1, 1) + ' deg F', box.x + 10, y);
    y += narrow ? 21 : 24;
    fill('#37474f');
    text(nf(dK, 1, 1) + ' K', box.x + 10, y);
    y += narrow ? 24 : 28;

    fill('#212121');
    textSize(z);
    const work = 'In Fahrenheit: ' + nf(fB, 1, 1) + '  -  ' + nf(fA, 1, 1) + '  =  ' +
                 nf(dF, 1, 1) + '. Both numbers carried the same +32, so it cancelled.';
    text(wrapText(work, inner, z), box.x + 10, y);
    y += wrapText(work, inner, z).split('\n').length * (z + 3) + 8;

    fill('#b71c1c');
    textSize(z);
    const msg = 'A difference of 5 deg C is a difference of 9 deg F, not 41 deg F. ' +
                'The +32 offset cancels when you subtract.';
    text(wrapText(msg, inner, z), box.x + 10, y);
    y += wrapText(msg, inner, z).split('\n').length * (z + 3) + 6;

    fill('#546e7a');
    textSize(z - 1);
    text(wrapText('Celsius and kelvin give the same difference because their degrees are ' +
                  'the same size. Only the zero point moved.', inner, z - 1), box.x + 10, y);
  }

  if (blockedMsg !== '') {
    fill('#b71c1c');
    textSize(z);
    text(wrapText(blockedMsg, inner, z), box.x + 10, box.y + box.h - 40);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  text('F', 22, drawHeight + 60);
  text('C', 132, drawHeight + 60);
  text('K', 234, drawHeight + 60);
  fill('#546e7a');
  textSize(11);
  text(diffMode ? 'drag either marker' : 'drag the marker, or type a value',
       330, drawHeight + 60);
}

// ---- interaction --------------------------------------------------------

function mousePressed() {
  for (let i = 0; i < presetHits.length; i++) {
    const h = presetHits[i];
    if (mouseX > h.x && mouseX < h.x + h.w && mouseY > h.y && mouseY < h.y + h.h) {
      kA = constrain(cToK(PRESETS[h.i].c), K_LO, K_HI);
      presetLabel = PRESETS[h.i].name;
      editing = null;
      syncInputs();
      return;
    }
  }
  if (mouseX > tubeRect.x - 60 && mouseX < tubeRect.x + tubeRect.w + 120 &&
      mouseY > tubeRect.y && mouseY < tubeRect.y + tubeRect.h) {
    dragging = 'A';
    if (diffMode) {
      const box = { y: tubeRect.y, h: tubeRect.h };
      dragging = abs(mouseY - kToY(box, kA)) <= abs(mouseY - kToY(box, kB)) ? 'A' : 'B';
    }
    setFromMouse();
  }
}
function mouseDragged() { if (dragging) setFromMouse(); }
function mouseReleased() { dragging = null; }

function setFromMouse() {
  const box = { y: tubeRect.y, h: tubeRect.h };
  const raw = map(mouseY, box.y + box.h - 26, box.y + 26, K_LO, K_HI);
  if (raw < K_LO) flashBlocked();
  const k = constrain(raw, K_LO, K_HI);
  if (dragging === 'B') kB = k; else { kA = k; editing = null; syncInputs(); }
  presetLabel = '';
}

function wrapText(s, maxW, size) {
  textSize(size);
  const words = s.split(' ');
  let line = '';
  let out = '';
  for (let i = 0; i < words.length; i++) {
    const trial = line.length ? line + ' ' + words[i] : words[i];
    if (textWidth(trial) > maxW && line.length) { out += line + '\n'; line = words[i]; }
    else line = trial;
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
