// SI Prefix and Scale Explorer MicroSim
// CANVAS_HEIGHT: 580
// Bloom Level: Understand (L2) - the learner interprets one value written three
// ways at once (decimal, scientific notation, SI prefix) and anchors it to a
// familiar object.
// Deliberately NOT an animated zoom: a continuous zoom hides the discrete
// decade structure that the whole prefix system is built on. The learner steps
// or drags, and all three notations for the SAME value stay on screen together.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 200;

const NARROW_BREAKPOINT = 660;

// ---- controls ----
let quantitySelect;
let downButton;
let upButton;
let pinButton;
let clearButton;
let expSlider;

// ---- state ----
let quantityKey = 'length';
let baseline = null;      // { exp, name } once the learner pins one
let draggingBar = false;

// ---- SI prefixes -------------------------------------------------------
// centi, deci, deka and hecto are included on purpose: the chapter needs
// centimetres and, above all, the hectopascal that every weather report uses.
const PREFIXES = [
  { exp: -9, name: 'nano',  sym: 'n'  },
  { exp: -6, name: 'micro', sym: 'µ' },
  { exp: -3, name: 'milli', sym: 'm'  },
  { exp: -2, name: 'centi', sym: 'c'  },
  { exp: -1, name: 'deci',  sym: 'd'  },
  { exp:  0, name: '',      sym: ''   },
  { exp:  1, name: 'deka',  sym: 'da' },
  { exp:  2, name: 'hecto', sym: 'h'  },
  { exp:  3, name: 'kilo',  sym: 'k'  },
  { exp:  6, name: 'mega',  sym: 'M'  },
  { exp:  9, name: 'giga',  sym: 'G'  },
  { exp: 12, name: 'tera',  sym: 'T'  }
];

// ---- the three quantities and their familiar anchors -------------------
const QUANTITIES = {
  length: {
    label: 'Length',
    unitSym: 'm',
    unitName: 'metre',
    lo: -9, hi: 12, def: 0,
    anchors: [
      { exp: -9, icon: 'atom',   name: 'A single atom' },
      { exp: -6, icon: 'cell',   name: 'A bacterium, or the width of one strand of spider silk' },
      { exp: -3, icon: 'card',   name: 'The thickness of a credit card' },
      { exp: -2, icon: 'nail',   name: 'A fingernail' },
      { exp:  0, icon: 'door',   name: 'The height of a doorknob above the floor' },
      { exp:  1, icon: 'house',  name: 'A two-storey house' },
      { exp:  3, icon: 'walk',   name: 'A fifteen-minute walk' },
      { exp:  4, icon: 'plane',  name: 'An airliner at cruising altitude, and the top of the troposphere' },
      { exp:  6, icon: 'map',    name: 'The width of Texas' },
      { exp:  7, icon: 'earth',  name: 'The diameter of the Earth' },
      { exp: 12, icon: 'saturn', name: 'The distance from the Sun out to Saturn' }
    ]
  },
  pressure: {
    label: 'Pressure',
    unitSym: 'Pa',
    unitName: 'pascal',
    lo: -3, hi: 8, def: 5,
    anchors: [
      { exp: -3, icon: 'vacuum',   name: 'The vacuum inside an old television picture tube' },
      { exp:  0, icon: 'paper',    name: 'A banknote lying flat, pressing on the table' },
      { exp:  1, icon: 'stairs',   name: 'The pressure drop from climbing one metre of stairs' },
      { exp:  2, icon: 'cloud',    name: 'One hectopascal, the unit on every weather report' },
      { exp:  3, icon: 'building', name: 'The pressure drop from the ground to the roof of a 25-storey building' },
      { exp:  4, icon: 'water',    name: 'One metre of water above your head' },
      { exp:  5, icon: 'sealevel', name: 'Sea level air pressure' },
      { exp:  8, icon: 'trench',   name: 'The bottom of the Mariana Trench' }
    ]
  },
  time: {
    label: 'Time',
    unitSym: 's',
    unitName: 'second',
    lo: -9, hi: 12, def: 0,
    anchors: [
      { exp: -9, icon: 'light',      name: 'The time light takes to cross your hand' },
      { exp: -6, icon: 'chip',       name: 'About a thousand instructions on the Pi processor' },
      { exp: -3, icon: 'fly',        name: 'A housefly beats its wings once every five of these' },
      { exp:  0, icon: 'heart',      name: 'One heartbeat' },
      { exp:  1, icon: 'breath',     name: 'One slow, deep breath in and out' },
      { exp:  3, icon: 'clock',      name: 'A class period is about two of these' },
      { exp:  5, icon: 'day',        name: 'One day is 86 400 seconds' },
      { exp:  7, icon: 'season',     name: 'A school term' },
      { exp:  9, icon: 'generation', name: 'A human generation, 31.7 years' }
    ]
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textSize(defaultTextSize);

  quantitySelect = createSelect();
  quantitySelect.option('Length');
  quantitySelect.option('Pressure');
  quantitySelect.option('Time');
  quantitySelect.selected('Length');
  quantitySelect.changed(changeQuantity);

  downButton = createButton('-1 decade');
  downButton.mousePressed(function () { stepDecade(-1); });

  upButton = createButton('+1 decade');
  upButton.mousePressed(function () { stepDecade(1); });

  pinButton = createButton('Pin as baseline');
  pinButton.mousePressed(pinBaseline);

  clearButton = createButton('Clear baseline');
  clearButton.mousePressed(function () { baseline = null; });

  buildSlider();
  layoutControls();

  describe('A vertical scale bar spanning many powers of ten. Dragging the marker ' +
           'or stepping one decade at a time shows the same value written three ways ' +
           'at once - plain decimal, scientific notation, and with its SI prefix - ' +
           'next to a familiar object of that size. Pinning an object turns the ' +
           'reading into an orders-of-magnitude comparison.', LABEL);
}

// The slider works in tenths of a decade so that the decade buttons land on
// exact integer exponents. Changing quantity changes the range, and a p5
// slider cannot be re-ranged in place, so it is rebuilt.
function buildSlider() {
  const q = QUANTITIES[quantityKey];
  if (expSlider) expSlider.remove();
  expSlider = createSlider(q.lo * 10, q.hi * 10, q.def * 10, 1);
}

function layoutControls() {
  const r1 = drawHeight + 10;
  const r2 = drawHeight + 46;
  const r3 = drawHeight + 84;

  quantitySelect.position(90, r1);
  downButton.position(195, r1);
  upButton.position(292, r1);
  pinButton.position(10, r2);
  clearButton.position(150, r2);

  expSlider.position(sliderLeftMargin, r3);
  expSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
}

function currentExp() {
  return expSlider.value() / 10;
}

function draw() {
  updateCanvasSize();

  const q = QUANTITIES[quantityKey];
  const e = currentExp();
  const narrow = canvasWidth < NARROW_BREAKPOINT;

  // drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // control region
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  // title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('SI Prefix and Scale Explorer', canvasWidth / 2, 12);

  // ---- geometry ----
  const barX = margin + 22;
  const barTop = 56;
  const barBot = narrow ? drawHeight - 168 : drawHeight - 22;

  let readLeft, readRight, objBox;
  if (narrow) {
    readLeft = barX + 58;
    readRight = canvasWidth - margin;
    objBox = { x: margin, y: drawHeight - 154, w: canvasWidth - 2 * margin, h: 136 };
  } else {
    readLeft = barX + 62;
    readRight = floor(canvasWidth * 0.60);
    objBox = { x: readRight + 14, y: 62, w: canvasWidth - margin - readRight - 14, h: drawHeight - 84 };
  }

  drawScaleBar(q, e, barX, barTop, barBot);
  drawReadouts(q, e, readLeft, barTop, readRight - readLeft, barBot);
  drawObjectPanel(q, e, objBox);
  drawControlLabels(q, e);
}

// ---- the vertical scale bar -------------------------------------------

function expToY(q, e, top, bot) {
  return map(e, q.lo, q.hi, bot, top);
}

function drawScaleBar(q, e, x, top, bot) {
  // bar body
  stroke('#90a4ae');
  strokeWeight(1);
  fill('#eceff1');
  rect(x - 9, top, 18, bot - top, 4);

  // ticks first, so labels can be laid out afterwards without collisions
  const wanted = [];
  for (let n = q.lo; n <= q.hi; n++) {
    const y = expToY(q, n, top, bot);
    const isAnchor = q.anchors.some(function (a) { return a.exp === n; });
    stroke(isAnchor ? '#1565c0' : '#b0bec5');
    strokeWeight(isAnchor ? 2 : 1);
    line(x - 9, y, x + (isAnchor ? 13 : 9), y);
    if (isAnchor || n % 3 === 0) wanted.push({ n: n, y: y, isAnchor: isAnchor });
  }

  // Anchors claim their slot first; plain decade labels only fill gaps that
  // are still at least MIN_GAP pixels clear, so nothing ever overprints.
  const MIN_GAP = 14;
  const placed = [];
  const fits = function (y) {
    for (let i = 0; i < placed.length; i++) {
      if (abs(placed[i] - y) < MIN_GAP) return false;
    }
    return true;
  };
  wanted.filter(function (t) { return t.isAnchor; }).forEach(function (t) {
    if (fits(t.y)) placed.push(t.y), t.show = true;
  });
  wanted.filter(function (t) { return !t.isAnchor; }).forEach(function (t) {
    if (fits(t.y)) placed.push(t.y), t.show = true;
  });

  noStroke();
  for (let i = 0; i < wanted.length; i++) {
    const t = wanted[i];
    if (!t.show) continue;
    fill(t.isAnchor ? '#1565c0' : '#607d8b');
    // measure the raised exponent so the whole "10^n" block right-aligns to x-14
    textSize(9);
    const ew = textWidth(String(t.n));
    textAlign(LEFT, CENTER);
    text(String(t.n), x - 15 - ew, t.y - 5);
    textSize(11);
    textAlign(RIGHT, CENTER);
    text('10', x - 15 - ew, t.y);
  }
  textAlign(LEFT, BASELINE);

  // pinned baseline marker
  if (baseline !== null && baseline.exp >= q.lo && baseline.exp <= q.hi) {
    const by = expToY(q, baseline.exp, top, bot);
    stroke('#ef6c00');
    strokeWeight(2);
    line(x - 14, by, x + 16, by);
  }

  // draggable handle
  const hy = expToY(q, e, top, bot);
  stroke('#0d47a1');
  strokeWeight(2);
  fill('#42a5f5');
  triangle(x + 10, hy, x + 24, hy - 7, x + 24, hy + 7);
  line(x - 11, hy, x + 11, hy);
  noStroke();
}

// ---- the three notations ----------------------------------------------

function drawReadouts(q, e, x, y, w, bottom) {
  const value = Math.pow(10, e);
  const mantissa = Math.pow(10, e - Math.floor(e));
  const sciExp = Math.floor(e);
  const pre = prefixFor(e);
  const preMantissa = Math.pow(10, e - pre.exp);

  const rowH = canvasWidth < NARROW_BREAKPOINT ? 52 : 68;
  let cy = y + 4;

  // Stage 1: plain decimal
  drawStage(x, cy, w, rowH, '1. Plain decimal',
            formatDecimal(value, e) + ' ' + q.unitSym);
  cy += rowH + 8;

  // Stage 2: scientific notation
  drawStageBox(x, cy, w, rowH, '2. Scientific notation');
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(20);
  const sciHead = nf(mantissa, 1, 2) + ' x 10';
  text(sciHead, x + 10, cy + 32);
  const sw = textWidth(sciHead);
  textSize(13);
  text(String(sciExp), x + 10 + sw + 2, cy + 24);
  textSize(20);
  text(' ' + q.unitSym, x + 10 + sw + 2 + textWidth(String(sciExp)) + 2, cy + 32);
  cy += rowH + 8;

  // Stage 3: the SI prefix form
  const symForm = nf(preMantissa, 1, 2) + ' ' + pre.sym + q.unitSym;
  const wordForm = nf(preMantissa, 1, 2) + ' ' + pre.name + q.unitName +
                   (abs(preMantissa - 1) < 0.005 ? '' : 's');
  drawStage(x, cy, w, rowH, '3. With its SI prefix', symForm);
  fill('#37474f');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  text(wordForm, x + 10, cy + 54);
  cy += rowH + 14;

  // Stage 5: the orders-of-magnitude comparison
  drawComparison(q, e, x, cy, w);
  cy += 46;

  // The whole prefix ladder, with the current rung lit. This is the lookup
  // table the sim is trying to replace with intuition, kept visible so the
  // learner can see WHERE on the ladder they are, not just which rung.
  if (bottom - cy > 64) drawPrefixStrip(x, bottom - 58, w, pre.exp);
}

function drawPrefixStrip(x, y, w, activeExp) {
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(12);
  text('The prefix ladder', x, y - 18);

  const cw = w / PREFIXES.length;
  for (let i = 0; i < PREFIXES.length; i++) {
    const pf = PREFIXES[i];
    const cx = x + i * cw;
    const active = pf.exp === activeExp;
    stroke(active ? '#0d47a1' : '#cfd8dc');
    strokeWeight(active ? 2 : 1);
    fill(active ? '#bbdefb' : 'white');
    rect(cx + 1, y, cw - 2, 46, 4);
    noStroke();
    fill(active ? '#0d47a1' : '#455a64');
    textAlign(CENTER, CENTER);
    textSize(cw > 40 ? 15 : 13);
    text(pf.sym === '' ? '-' : pf.sym, cx + cw / 2, y + 15);
    textSize(cw > 40 ? 11 : 9);
    fill(active ? '#1565c0' : '#78909c');
    text(pf.exp, cx + cw / 2, y + 34);
  }
}

function drawStageBox(x, y, w, h, label) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h + 12, 5);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(12);
  text(label, x + 10, y + 6);
}

function drawStage(x, y, w, h, label, valueText) {
  drawStageBox(x, y, w, h, label);
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(20);
  text(fitText(valueText, w - 20, 20), x + 10, y + 32);
}

function drawComparison(q, e, x, y, w) {
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  if (baseline === null) {
    fill('#78909c');
    text(wrapText('5. Pin an object as a baseline to see the comparison in orders of magnitude.',
                  w, 13), x, y);
    return;
  }
  const d = e - baseline.exp;
  let phrase;
  if (abs(d) < 0.05) {
    phrase = 'This is the same order of magnitude as ' + lowerFirst(baseline.name) + '.';
  } else {
    const times = Math.pow(10, abs(d));
    phrase = 'This is ' + nf(abs(d), 1, 1) + ' orders of magnitude ' +
             (d > 0 ? 'larger' : 'smaller') + ' than ' + lowerFirst(baseline.name) +
             ' - about ' + formatTimes(times) + ' times ' + (d > 0 ? 'bigger' : 'smaller') + '.';
  }
  fill('#e65100');
  text(wrapText(phrase, w, 13), x, y);
}

// ---- the familiar object ----------------------------------------------

function drawObjectPanel(q, e, box) {
  const a = nearestAnchor(q, e);

  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);

  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(12);
  text('4. Something this size', box.x + 10, box.y + 8);

  // A short, wide panel (the narrow-canvas case) reads much better with the
  // icon beside the caption than stacked above it.
  const sideBySide = box.w > box.h * 1.6;
  let iconSize, icx, icy;

  if (sideBySide) {
    iconSize = min(box.h - 52, box.w * 0.28);
    icx = box.x + 20 + iconSize / 2;
    icy = box.y + 24 + (box.h - 58) / 2;
    drawIcon(a.icon, icx, icy, iconSize);

    const tx = box.x + 38 + iconSize;
    const tw = box.x + box.w - 16 - tx;
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);
    text(wrapText(a.name, tw, 14), tx, icy);
  } else {
    const nameLines = wrapText(a.name, box.w - 20, 14);
    const textBlockH = nameLines.split('\n').length * 18;
    iconSize = min(140, box.h - 110, box.w - 40);
    const blockTop = box.y + 26 + max(0, (box.h - 74 - iconSize - textBlockH) / 2);
    icx = box.x + box.w / 2;
    icy = blockTop + iconSize / 2;
    drawIcon(a.icon, icx, icy, iconSize);

    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(14);
    text(nameLines, box.x + box.w / 2, icy + iconSize / 2 + 10);
  }

  // exact/nearest note
  fill('#78909c');
  textSize(11);
  const off = abs(e - a.exp);
  const note = off < 0.05
    ? 'exactly 10^' + a.exp + ' ' + q.unitSym
    : 'nearest anchor: 10^' + a.exp + ' ' + q.unitSym;
  text(note, box.x + box.w / 2, box.y + box.h - 32);

  fill(baseline && baseline.exp === a.exp ? '#e65100' : '#90a4ae');
  textSize(11);
  text(baseline && baseline.exp === a.exp ? 'pinned as the baseline' : 'click to pin as the baseline',
       box.x + box.w / 2, box.y + box.h - 18);
}

// ---- control-region labels --------------------------------------------

function drawControlLabels(q, e) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Quantity:', 10, drawHeight + 22);
  text('Magnitude: 10^' + nf(e, 1, 1) + ' ' + q.unitSym, 10, drawHeight + 96);
}

// ---- interaction -------------------------------------------------------

function changeQuantity() {
  const v = quantitySelect.value();
  quantityKey = v === 'Pressure' ? 'pressure' : (v === 'Time' ? 'time' : 'length');
  baseline = null;   // baselines are not meaningful across quantities
  buildSlider();
  layoutControls();
}

function stepDecade(dir) {
  const q = QUANTITIES[quantityKey];
  const e = currentExp();
  // round away from the current value so a partial decade snaps to the next integer
  let target = dir > 0 ? Math.floor(e + 1e-6) + 1 : Math.ceil(e - 1e-6) - 1;
  target = constrain(target, q.lo, q.hi);
  expSlider.value(Math.round(target * 10));
}

function pinBaseline() {
  const q = QUANTITIES[quantityKey];
  const a = nearestAnchor(q, currentExp());
  baseline = { exp: a.exp, name: a.name };
}

function mousePressed() {
  const q = QUANTITIES[quantityKey];
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  const barX = margin + 22;
  const barTop = 56;
  const barBot = narrow ? drawHeight - 168 : drawHeight - 22;

  if (mouseX > barX - 26 && mouseX < barX + 30 &&
      mouseY > barTop - 8 && mouseY < barBot + 8) {
    draggingBar = true;
    setExpFromY(q, mouseY, barTop, barBot);
    return;
  }

  // clicking the object panel pins it
  let objBox;
  if (narrow) {
    objBox = { x: margin, y: drawHeight - 154, w: canvasWidth - 2 * margin, h: 136 };
  } else {
    const readRight = floor(canvasWidth * 0.60);
    objBox = { x: readRight + 14, y: 62, w: canvasWidth - margin - readRight - 14, h: drawHeight - 84 };
  }
  if (mouseX > objBox.x && mouseX < objBox.x + objBox.w &&
      mouseY > objBox.y && mouseY < objBox.y + objBox.h) {
    pinBaseline();
  }
}

function mouseDragged() {
  if (!draggingBar) return;
  const q = QUANTITIES[quantityKey];
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  setExpFromY(q, mouseY, 56, narrow ? drawHeight - 168 : drawHeight - 22);
}

function mouseReleased() {
  draggingBar = false;
}

function setExpFromY(q, y, top, bot) {
  const e = constrain(map(y, bot, top, q.lo, q.hi), q.lo, q.hi);
  expSlider.value(Math.round(e * 10));
}

// ---- helpers -----------------------------------------------------------

function prefixFor(e) {
  let chosen = PREFIXES[0];
  for (let i = 0; i < PREFIXES.length; i++) {
    if (PREFIXES[i].exp <= e + 1e-9) chosen = PREFIXES[i];
  }
  return chosen;
}

function nearestAnchor(q, e) {
  let best = q.anchors[0];
  let bestD = Infinity;
  for (let i = 0; i < q.anchors.length; i++) {
    const d = abs(q.anchors[i].exp - e);
    if (d < bestD) { bestD = d; best = q.anchors[i]; }
  }
  return best;
}

function formatDecimal(v, e) {
  if (e >= 0) {
    const digits = e < 3 ? 2 : 0;
    return v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: digits });
  }
  const places = Math.min(12, Math.ceil(-e) + 2);
  let s = v.toFixed(places);
  if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

function formatTimes(t) {
  if (t >= 1000) return t.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (t >= 10) return nf(t, 1, 0);
  return nf(t, 1, 1);
}

function lowerFirst(s) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// shrink a string until it fits, rather than letting it run past its box
function fitText(s, maxW, baseSize) {
  textSize(baseSize);
  let size = baseSize;
  while (textWidth(s) > maxW && size > 11) {
    size -= 1;
    textSize(size);
  }
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

// ---- icons, all drawn with p5 primitives so there are no external assets ----

function drawIcon(kind, cx, cy, s) {
  push();
  translate(cx, cy);
  strokeWeight(max(1, s / 40));
  const h = s / 2;

  switch (kind) {
    case 'atom':
      noFill(); stroke('#1565c0');
      ellipse(0, 0, s, s * 0.42);
      push(); rotate(PI / 3); ellipse(0, 0, s, s * 0.42); pop();
      push(); rotate(-PI / 3); ellipse(0, 0, s, s * 0.42); pop();
      noStroke(); fill('#0d47a1'); circle(0, 0, s * 0.16);
      break;

    case 'cell':
      fill('#a5d6a7'); stroke('#2e7d32');
      ellipse(0, 0, s * 0.9, s * 0.42);
      noStroke(); fill('#1b5e20'); circle(-s * 0.12, 0, s * 0.1);
      stroke('#2e7d32'); noFill();
      line(s * 0.45, 0, s * 0.45 + s * 0.2, -s * 0.1);
      line(s * 0.45, 0, s * 0.45 + s * 0.2, s * 0.1);
      break;

    case 'card':
      fill('#ffca28'); stroke('#f57f17');
      rect(-h * 0.9, -h * 0.55, s * 0.9, s * 0.55, 4);
      noStroke(); fill('#8d6e63');
      rect(-h * 0.9, -h * 0.2, s * 0.9, s * 0.12);
      break;

    case 'nail':
      fill('#ffccbc'); stroke('#bf7f6a');
      rect(-h * 0.35, -h * 0.6, s * 0.35, s * 0.75, s * 0.14, s * 0.14, 4, 4);
      noFill(); stroke('#bf7f6a');
      arc(0, -h * 0.15, s * 0.3, s * 0.3, PI, TWO_PI);
      break;

    case 'door':
      fill('#a1887f'); stroke('#5d4037');
      rect(-h * 0.5, -h, s, s, 3);
      noFill(); stroke('#7b5e52');
      rect(-h * 0.34, -h * 0.82, s * 0.28, s * 0.3, 2);
      rect(h * 0.06, -h * 0.82, s * 0.28, s * 0.3, 2);
      rect(-h * 0.34, -h * 0.36, s * 0.28, s * 0.3, 2);
      rect(h * 0.06, -h * 0.36, s * 0.28, s * 0.3, 2);
      noStroke(); fill('#ffd54f'); circle(h * 0.36, 0, s * 0.11);
      stroke('#5d4037'); strokeWeight(max(2, s / 30)); noFill();
      line(-h * 0.7, h, h * 0.7, h);
      break;

    case 'house':
      fill('#ef9a9a'); stroke('#b71c1c');
      triangle(-h, -h * 0.15, 0, -h * 0.85, h, -h * 0.15);
      fill('#fff3e0');
      rect(-h * 0.8, -h * 0.15, s * 0.8, s * 0.72);
      fill('#90caf9');
      rect(-h * 0.55, 0, s * 0.2, s * 0.18);
      rect(h * 0.15, 0, s * 0.2, s * 0.18);
      fill('#6d4c41');
      rect(-h * 0.15, h * 0.2, s * 0.3, s * 0.37);
      break;

    case 'walk':
      stroke('#455a64'); noFill();
      line(-h, h * 0.7, h, h * 0.7);
      fill('#455a64'); noStroke();
      circle(-h * 0.3, -h * 0.4, s * 0.18);
      stroke('#455a64'); strokeWeight(max(2, s / 26));
      line(-h * 0.3, -h * 0.28, -h * 0.3, h * 0.15);
      line(-h * 0.3, h * 0.15, -h * 0.6, h * 0.65);
      line(-h * 0.3, h * 0.15, 0, h * 0.65);
      line(-h * 0.3, -h * 0.1, -h * 0.62, h * 0.1);
      line(-h * 0.3, -h * 0.1, 0.02 * s, h * 0.05);
      break;

    case 'plane':
      fill('#78909c'); noStroke();
      ellipse(0, 0, s * 0.9, s * 0.2);
      triangle(-h * 0.1, -h * 0.05, h * 0.1, -h * 0.05, 0, -h * 0.65);
      triangle(-h * 0.1, h * 0.05, h * 0.1, h * 0.05, 0, h * 0.65);
      triangle(-h * 0.85, -h * 0.05, -h * 0.6, -h * 0.05, -h * 0.8, -h * 0.35);
      stroke('#b0bec5'); strokeWeight(max(1, s / 50)); noFill();
      line(-h, h * 0.85, h, h * 0.85);
      break;

    case 'map':
      fill('#c5e1a5'); stroke('#558b2f');
      beginShape();
      vertex(-h * 0.85, -h * 0.6); vertex(h * 0.2, -h * 0.6);
      vertex(h * 0.35, -h * 0.2); vertex(h * 0.8, -h * 0.15);
      vertex(h * 0.5, h * 0.55); vertex(-h * 0.1, h * 0.85);
      vertex(-h * 0.5, h * 0.1); vertex(-h * 0.85, h * 0.05);
      endShape(CLOSE);
      break;

    case 'earth':
      fill('#1976d2'); stroke('#0d47a1');
      circle(0, 0, s * 0.9);
      noStroke(); fill('#66bb6a');
      ellipse(-s * 0.14, -s * 0.1, s * 0.32, s * 0.2);
      ellipse(s * 0.13, s * 0.08, s * 0.26, s * 0.3);
      break;

    case 'saturn':
      noStroke(); fill('#ffb74d');
      circle(0, 0, s * 0.46);
      noFill(); stroke('#8d6e63'); strokeWeight(max(2, s / 22));
      push(); rotate(-0.4); ellipse(0, 0, s * 0.95, s * 0.28); pop();
      noStroke(); fill('#fdd835'); circle(-h * 0.85, -h * 0.75, s * 0.16);
      break;

    case 'vacuum':
      fill('#eceff1'); stroke('#546e7a');
      rect(-h * 0.75, -h * 0.55, s * 0.75, s * 0.7, 6);
      noStroke(); fill('#b0bec5');
      textAlign(CENTER, CENTER); textSize(max(10, s * 0.16));
      text('near', 0, -h * 0.32); text('zero', 0, -h * 0.05);
      stroke('#546e7a'); noFill();
      line(0, h * 0.15, 0, h * 0.45);
      line(-h * 0.35, h * 0.45, h * 0.35, h * 0.45);
      break;

    case 'paper':
      fill('#fffde7'); stroke('#c0ca33');
      rect(-h * 0.8, -h * 0.25, s * 0.8, s * 0.34, 2);
      noStroke(); fill('#9e9d24');
      rect(-h * 0.55, -h * 0.12, s * 0.3, s * 0.08);
      stroke('#8d6e63'); noFill(); strokeWeight(max(2, s / 30));
      line(-h, h * 0.12, h, h * 0.12);
      break;

    case 'stairs':
      noStroke(); fill('#90a4ae');
      for (let i = 0; i < 4; i++) {
        rect(-h * 0.8 + i * s * 0.2, h * 0.55 - (i + 1) * s * 0.16, s * 0.2, (i + 1) * s * 0.16);
      }
      stroke('#e65100'); strokeWeight(max(2, s / 26)); noFill();
      line(h * 0.72, -h * 0.5, h * 0.72, h * 0.4);
      line(h * 0.72, -h * 0.5, h * 0.6, -h * 0.3);
      line(h * 0.72, -h * 0.5, h * 0.84, -h * 0.3);
      break;

    case 'cloud':
      noStroke(); fill('#cfd8dc');
      ellipse(-s * 0.16, 0, s * 0.42, s * 0.34);
      ellipse(s * 0.12, s * 0.02, s * 0.4, s * 0.3);
      ellipse(0, -s * 0.12, s * 0.44, s * 0.36);
      fill('#37474f');
      textAlign(CENTER, CENTER); textSize(max(11, s * 0.2));
      text('hPa', 0, s * 0.32);
      break;

    case 'building':
      fill('#b0bec5'); stroke('#546e7a');
      rect(-h * 0.45, -h * 0.9, s * 0.45, s * 0.9);
      noStroke(); fill('#90a4ae');
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 2; c++) {
          rect(-h * 0.36 + c * s * 0.16, -h * 0.8 + r * s * 0.16, s * 0.1, s * 0.1);
        }
      }
      stroke('#546e7a'); noFill(); line(-h, h * 0.02, h, h * 0.02);
      break;

    case 'water':
      noStroke(); fill('#4fc3f7');
      rect(-h * 0.85, -h * 0.2, s * 0.85, s * 0.75);
      stroke('#0277bd'); noFill(); strokeWeight(max(1, s / 40));
      for (let i = 0; i < 3; i++) {
        arc(-h * 0.4 + i * s * 0.28, -h * 0.2, s * 0.28, s * 0.14, PI, TWO_PI);
      }
      stroke('#01579b'); strokeWeight(max(2, s / 28));
      line(h * 0.68, -h * 0.2, h * 0.68, h * 0.5);
      break;

    case 'sealevel':
      noStroke(); fill('#bbdefb');
      rect(-h * 0.9, -h * 0.85, s * 0.9, s * 0.75);
      fill('#4fc3f7');
      rect(-h * 0.9, -h * 0.1, s * 0.9, s * 0.6);
      stroke('#0d47a1'); strokeWeight(max(2, s / 26)); noFill();
      line(0, -h * 0.75, 0, -h * 0.2);
      line(0, -h * 0.2, -s * 0.06, -h * 0.34);
      line(0, -h * 0.2, s * 0.06, -h * 0.34);
      noStroke(); fill('#0d47a1');
      textAlign(CENTER, CENTER); textSize(max(10, s * 0.15));
      text('air', 0, -h * 0.6);
      break;

    case 'trench':
      noStroke(); fill('#0d47a1');
      rect(-h * 0.9, -h * 0.85, s * 0.9, s * 1.2);
      fill('#37474f');
      beginShape();
      vertex(-h * 0.9, h * 0.35); vertex(-h * 0.3, h * 0.35);
      vertex(-h * 0.05, h * 0.85); vertex(h * 0.05, h * 0.85);
      vertex(h * 0.3, h * 0.35); vertex(h * 0.9, h * 0.35);
      vertex(h * 0.9, h * 0.9); vertex(-h * 0.9, h * 0.9);
      endShape(CLOSE);
      fill('#e3f2fd');
      textAlign(CENTER, CENTER); textSize(max(10, s * 0.15));
      text('11 km', 0, -h * 0.2);
      break;

    case 'light':
      stroke('#fbc02d'); strokeWeight(max(2, s / 22)); noFill();
      for (let i = 0; i < 3; i++) line(-h * 0.85, -s * 0.1 + i * s * 0.1, h * 0.1, -s * 0.1 + i * s * 0.1);
      noStroke(); fill('#ffe082');
      triangle(h * 0.1, -s * 0.16, h * 0.1, s * 0.16, h * 0.42, 0);
      stroke('#8d6e63'); strokeWeight(max(2, s / 26)); noFill();
      arc(h * 0.55, 0, s * 0.5, s * 0.8, -HALF_PI, HALF_PI);
      break;

    case 'chip':
      fill('#455a64'); stroke('#263238');
      rect(-h * 0.5, -h * 0.5, s * 0.5, s * 0.5, 3);
      stroke('#78909c'); strokeWeight(max(1, s / 40));
      for (let i = 0; i < 4; i++) {
        const p = -h * 0.4 + i * s * 0.13;
        line(-h * 0.5, p, -h * 0.75, p);
        line(h * 0.5, p, h * 0.75, p);
        line(p, -h * 0.5, p, -h * 0.75);
        line(p, h * 0.5, p, h * 0.75);
      }
      break;

    case 'fly':
      noStroke(); fill('#455a64');
      ellipse(0, s * 0.06, s * 0.3, s * 0.18);
      circle(-s * 0.19, s * 0.02, s * 0.14);
      fill(255, 255, 255, 170); stroke('#90a4ae'); strokeWeight(1);
      push(); rotate(-0.5); ellipse(s * 0.1, -s * 0.16, s * 0.34, s * 0.14); pop();
      push(); rotate(0.5); ellipse(s * 0.1, -s * 0.16, s * 0.34, s * 0.14); pop();
      break;

    case 'heart':
      noStroke(); fill('#e53935');
      beginShape();
      vertex(0, h * 0.55);
      bezierVertex(-h * 1.0, -h * 0.05, -h * 0.42, -h * 0.85, 0, -h * 0.3);
      bezierVertex(h * 0.42, -h * 0.85, h * 1.0, -h * 0.05, 0, h * 0.55);
      endShape(CLOSE);
      break;

    case 'breath':
      noFill(); stroke('#4fc3f7'); strokeWeight(max(2, s / 22));
      for (let i = 1; i <= 3; i++) circle(0, 0, s * 0.28 * i);
      noStroke(); fill('#0277bd'); circle(0, 0, s * 0.12);
      break;

    case 'clock':
      fill('white'); stroke('#37474f'); strokeWeight(max(2, s / 26));
      circle(0, 0, s * 0.86);
      line(0, 0, 0, -h * 0.5);
      line(0, 0, h * 0.32, h * 0.16);
      break;

    case 'day':
      noStroke(); fill('#bbdefb');
      arc(0, h * 0.35, s * 1.0, s * 1.0, PI, TWO_PI);
      fill('#fdd835'); circle(0, -h * 0.05, s * 0.3);
      stroke('#fbc02d'); strokeWeight(max(2, s / 30));
      for (let i = 0; i < 6; i++) {
        const a = PI + i * PI / 5;
        line(cos(a) * s * 0.22, -h * 0.05 + sin(a) * s * 0.22,
             cos(a) * s * 0.32, -h * 0.05 + sin(a) * s * 0.32);
      }
      stroke('#546e7a'); line(-h, h * 0.35, h, h * 0.35);
      break;

    case 'season':
      noStroke(); fill('#6d4c41');
      rect(-s * 0.04, -h * 0.05, s * 0.08, s * 0.5);
      fill('#66bb6a'); circle(-s * 0.12, -h * 0.35, s * 0.34);
      fill('#ffa726'); circle(s * 0.14, -h * 0.28, s * 0.3);
      stroke('#546e7a'); strokeWeight(max(1, s / 40)); noFill();
      line(-h * 0.9, h * 0.45, h * 0.9, h * 0.45);
      break;

    case 'generation':
      noStroke(); fill('#5e35b1');
      circle(-s * 0.2, -h * 0.3, s * 0.2);
      rect(-s * 0.29, -h * 0.15, s * 0.18, s * 0.42, 3);
      fill('#7e57c2');
      circle(s * 0.12, -h * 0.12, s * 0.15);
      rect(s * 0.05, h * 0.0, s * 0.14, s * 0.3, 3);
      fill('#b39ddb');
      circle(s * 0.32, h * 0.06, s * 0.11);
      rect(s * 0.27, h * 0.14, s * 0.1, s * 0.2, 2);
      break;

    default:
      noFill(); stroke('#90a4ae');
      circle(0, 0, s * 0.6);
      break;
  }
  pop();
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
