// Breadboard Connection Explorer MicroSim
// CANVAS_HEIGHT: 584
// Bloom Level: Understand (L2) - the learner explains which holes are
// electrically joined and predicts whether a given placement works.
// Click-to-reveal rather than animation: the copper strips under the plastic are
// the hidden fact, and showing them is what turns a memorised rule ("five holes
// in a column") into an explanation.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 84;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 720;

// ---- controls ----
let exploreButton, continuityButton, buildButton;
let stripsCheckbox, resetButton, scenarioButton;

// ---- board constants ----
const COLS = 30;                          // half-size board
const UPPER_ROWS = ['A', 'B', 'C', 'D', 'E'];
const LOWER_ROWS = ['F', 'G', 'H', 'I', 'J'];
const RAILS = [
  { id: 'R0', label: 'Upper positive rail', sign: '+', color: '#c62828' },
  { id: 'R1', label: 'Upper negative rail', sign: '-', color: '#1565c0' },
  { id: 'R2', label: 'Lower positive rail', sign: '+', color: '#c62828' },
  { id: 'R3', label: 'Lower negative rail', sign: '-', color: '#1565c0' }
];

// ---- state ----
let mode = 'explore';                     // 'explore' | 'continuity' | 'build'
let selected = null;                      // hole object
let continuityA = null;
let continuityB = null;
let hovered = null;
let scenarioIndex = 0;
let accused = null;                       // item the learner clicked in build mode
let holes = [];                           // rebuilt every frame from canvas size
let itemHits = [];
let compact = false;   // true on a narrow canvas: shrinks the panel type

// ---- build-check scenarios ---------------------------------------------
// Each scenario places a sensor breakout and some jumpers, exactly one of which
// is wrong. The learner clicks the thing they think is the fault.
const SCENARIOS = [
  {
    title: 'The sensor never powers up.',
    chip: { pins: [['E', 10, 'VIN'], ['E', 11, 'GND'], ['E', 12, 'SCL'], ['E', 13, 'SDA']] },
    wires: [
      { from: ['R0', 2], to: ['R0', 2], feed: 'from Pi pin 1 (3.3 V)', rail: 'R0', color: '#d32f2f', mistake: false,
        why: 'This is the 3.3 V feed arriving at the positive rail. It is correct.' },
      { from: ['R1', 2], to: ['R1', 2], feed: 'from Pi pin 6 (GND)', rail: 'R1', color: '#212121', mistake: false,
        why: 'This is the ground feed arriving at the negative rail. It is correct.' },
      { from: ['R1', 9], to: ['A', 10], color: '#d32f2f', mistake: true,
        why: 'Found it. The red power wire is plugged into the NEGATIVE rail. VIN and GND are ' +
             'now both sitting at ground, so the sensor never sees 3.3 volts. Move this end to the + rail.' },
      { from: ['R1', 14], to: ['A', 11], color: '#212121', mistake: false,
        why: 'Ground from the negative rail to the sensor GND pin. Correct.' }
    ]
  },
  {
    title: 'This one gets hot and reads nothing.',
    chip: { pins: [['E', 10, 'VIN'], ['D', 10, 'GND'], ['E', 12, 'SCL'], ['E', 13, 'SDA']], sideways: true },
    wires: [
      { from: ['R0', 2], to: ['R0', 2], feed: 'from Pi pin 1 (3.3 V)', rail: 'R0', color: '#d32f2f', mistake: false,
        why: 'The 3.3 V feed. Correct.' },
      { from: ['R1', 2], to: ['R1', 2], feed: 'from Pi pin 6 (GND)', rail: 'R1', color: '#212121', mistake: false,
        why: 'The ground feed. Correct.' },
      { from: ['R0', 9], to: ['A', 10], color: '#d32f2f', mistake: false,
        why: 'Power from the + rail into column 10. The wire is fine - the problem is what else is in column 10.' },
      { from: ['R1', 14], to: ['A', 14], color: '#212121', mistake: false,
        why: 'Ground into column 14. Fine on its own.' }
    ],
    chipIsMistake: true,
    chipWhy: 'Found it. The breakout has gone in sideways: VIN is in E10 and GND is in D10. ' +
             'Every hole in column 10 rows A to E is one strip, so power is wired straight to ' +
             'ground. That is a short circuit, and it is why the part gets hot.'
  },
  {
    title: 'Power looks fine, but there are no readings.',
    chip: { pins: [['E', 10, 'VIN'], ['E', 11, 'GND'], ['E', 12, 'SCL'], ['E', 13, 'SDA']] },
    wires: [
      { from: ['R0', 2], to: ['R0', 2], feed: 'from Pi pin 1 (3.3 V)', rail: 'R0', color: '#d32f2f', mistake: false,
        why: 'The 3.3 V feed. Correct.' },
      { from: ['R1', 2], to: ['R1', 2], feed: 'from Pi pin 6 (GND)', rail: 'R1', color: '#212121', mistake: false,
        why: 'The ground feed. Correct.' },
      { from: ['R0', 9], to: ['A', 10], color: '#d32f2f', mistake: false,
        why: 'Power from the + rail to VIN. Correct.' },
      { from: ['A', 11], to: ['A', 20], color: '#212121', mistake: true,
        why: 'Found it. The black wire runs from the sensor GND to column 20, and nothing else is ' +
             'in column 20. Ground never reaches the rail, so the circuit has no return path. ' +
             'This is the missing-ground fault from earlier in the chapter, wearing a disguise.' }
    ]
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  exploreButton = createButton('Explore');
  exploreButton.mousePressed(function () { setMode('explore'); });
  continuityButton = createButton('Continuity test');
  continuityButton.mousePressed(function () { setMode('continuity'); });
  buildButton = createButton('Build check');
  buildButton.mousePressed(function () { setMode('build'); });

  stripsCheckbox = createCheckbox(' Reveal internal strips', false);

  resetButton = createButton('Reset');
  resetButton.mousePressed(clearSelection);

  scenarioButton = createButton('Next scenario');
  scenarioButton.mousePressed(function () {
    scenarioIndex = (scenarioIndex + 1) % SCENARIOS.length;
    accused = null;
  });

  layoutControls();

  describe('A top-down half-size breadboard with numbered columns and lettered rows. ' +
           'Clicking any hole lights up every other hole electrically joined to it and ' +
           'names the group. A continuity mode compares two holes and explains why they ' +
           'are or are not connected, a build-check mode asks the learner to find the ' +
           'one wrong connection in a pre-wired circuit, and a toggle reveals the hidden ' +
           'metal strips underneath.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  exploreButton.position(10, r1);
  continuityButton.position(75, r1);
  buildButton.position(180, r1);
  stripsCheckbox.position(10, r2);
  resetButton.position(195, r2);
  scenarioButton.position(255, r2);
}

function setMode(m) {
  mode = m;
  clearSelection();
}

function clearSelection() {
  selected = null;
  continuityA = null;
  continuityB = null;
  accused = null;
}

// ---- geometry -----------------------------------------------------------

function boardGeometry(box) {
  // 16.4 pitch-heights of content, 32 pitch-widths, whichever is tighter
  const pitch = min((box.w - 26) / (COLS + 1.2), (box.h - 34) / 17.8);
  const boardW = (COLS + 1.2) * pitch;
  const boardH = 16.6 * pitch;
  const x0 = box.x + (box.w - boardW) / 2 + pitch * 1.1;
  const y0 = box.y + (box.h - boardH) / 2 + pitch * 0.6;
  return { pitch: pitch, x0: x0, y0: y0, boardW: boardW, boardH: boardH,
           left: box.x + (box.w - boardW) / 2, top: box.y + (box.h - boardH) / 2 };
}

function colX(g, col) { return g.x0 + (col - 1) * g.pitch; }

// rail holes come in five groups of five with a gap between groups
function railX(g, i) { return g.x0 + (i + floor(i / 5)) * g.pitch; }

function rowY(g, key) {
  const p = g.pitch;
  const t = g.y0;
  switch (key) {
    case 'R0': return t;
    case 'R1': return t + p;
    case 'A':  return t + p * 3.2;
    case 'B':  return t + p * 4.2;
    case 'C':  return t + p * 5.2;
    case 'D':  return t + p * 6.2;
    case 'E':  return t + p * 7.2;
    case 'F':  return t + p * 9.4;
    case 'G':  return t + p * 10.4;
    case 'H':  return t + p * 11.4;
    case 'I':  return t + p * 12.4;
    case 'J':  return t + p * 13.4;
    case 'R2': return t + p * 15.6;
    case 'R3': return t + p * 16.6;
  }
  return t;
}

function buildHoles(g) {
  const list = [];
  for (let r = 0; r < RAILS.length; r++) {
    for (let i = 0; i < 25; i++) {
      list.push({ kind: 'rail', row: RAILS[r].id, idx: i, group: RAILS[r].id,
                  x: railX(g, i), y: rowY(g, RAILS[r].id),
                  label: RAILS[r].label });
    }
  }
  for (let c = 1; c <= COLS; c++) {
    for (let i = 0; i < 5; i++) {
      list.push({ kind: 'main', row: UPPER_ROWS[i], col: c, group: 'U' + c,
                  x: colX(g, c), y: rowY(g, UPPER_ROWS[i]),
                  label: UPPER_ROWS[i] + c });
      list.push({ kind: 'main', row: LOWER_ROWS[i], col: c, group: 'L' + c,
                  x: colX(g, c), y: rowY(g, LOWER_ROWS[i]),
                  label: LOWER_ROWS[i] + c });
    }
  }
  return list;
}

function groupName(group) {
  if (group[0] === 'R') {
    const r = RAILS.find(function (x) { return x.id === group; });
    return r.label + ' - 25 holes connected';
  }
  const col = group.slice(1);
  const half = group[0] === 'U' ? 'rows A to E' : 'rows F to J';
  return 'Column ' + col + ', ' + half + ' - 5 holes connected';
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  compact = narrow;

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  fill('black');
  textAlign(CENTER, TOP);
  textSize(narrow ? 19 : 24);
  text('Breadboard Connection Explorer', canvasWidth / 2, narrow ? 12 : 8);

  let boardBox, panelBox;
  if (narrow) {
    boardBox = { x: margin, y: 40, w: canvasWidth - 2 * margin, h: 212 };
    panelBox = { x: margin, y: 258, w: canvasWidth - 2 * margin, h: drawHeight - 272 };
  } else {
    const bw = floor(canvasWidth * 0.64);
    boardBox = { x: margin, y: 44, w: bw - margin, h: drawHeight - 66 };
    panelBox = { x: bw + 8, y: 44, w: canvasWidth - margin - bw - 8, h: drawHeight - 66 };
  }

  const g = boardGeometry(boardBox);
  holes = buildHoles(g);
  drawBoard(g, boardBox);
  if (mode === 'build') drawScenario(g);
  drawHoles(g);
  drawHoverTip(g);
  drawPanel(panelBox, narrow);
  drawControlLabels();

  if (!narrow) {
    noStroke();
    fill('#78909c');
    textAlign(CENTER, TOP);
    textSize(11);
    text(wrapText('Half-size breadboard: 30 numbered columns, rows A to E above the ' +
                  'channel and F to J below, plus four power rails.', boardBox.w - 10, 11),
         boardBox.x + boardBox.w / 2, boardBox.y + boardBox.h - 26);
  }

  scenarioButton.style('display', mode === 'build' ? 'block' : 'none');
}

function drawBoard(g, box) {
  const p = g.pitch;
  noStroke();
  fill('#efe9dd');
  rect(g.left, g.top - p * 0.9, g.boardW, g.boardH + p * 1.9, 5);

  // rail guide lines
  for (let r = 0; r < RAILS.length; r++) {
    const y = rowY(g, RAILS[r].id);
    stroke(RAILS[r].color);
    strokeWeight(1);
    line(railX(g, 0) - p * 0.55, y + (r % 2 === 0 ? -p * 0.55 : p * 0.55),
         railX(g, 24) + p * 0.55, y + (r % 2 === 0 ? -p * 0.55 : p * 0.55));
    noStroke();
    fill(RAILS[r].color);
    textAlign(RIGHT, CENTER);
    textSize(max(8, p * 0.7));
    text(RAILS[r].sign, railX(g, 0) - p * 0.9, y);
  }

  // centre channel
  noStroke();
  fill('#dcd4c4');
  rect(g.left, rowY(g, 'E') + p * 0.7, g.boardW, p * 1.5);
  stroke('#c3b9a5');
  strokeWeight(1);
  line(g.left, rowY(g, 'E') + p * 0.7, g.left + g.boardW, rowY(g, 'E') + p * 0.7);
  line(g.left, rowY(g, 'E') + p * 2.2, g.left + g.boardW, rowY(g, 'E') + p * 2.2);
  noStroke();

  // hidden copper strips
  if (stripsCheckbox.checked()) {
    stroke(191, 105, 0, 150);
    strokeWeight(1);
    fill(255, 152, 0, 110);
    for (let c = 1; c <= COLS; c++) {
      rect(colX(g, c) - p * 0.24, rowY(g, 'A') - p * 0.42, p * 0.48, p * 4.84, 3);
      rect(colX(g, c) - p * 0.24, rowY(g, 'F') - p * 0.42, p * 0.48, p * 4.84, 3);
    }
    for (let r = 0; r < RAILS.length; r++) {
      const y = rowY(g, RAILS[r].id);
      rect(railX(g, 0) - p * 0.42, y - p * 0.24, railX(g, 24) - railX(g, 0) + p * 0.84, p * 0.48, 3);
    }
    noStroke();
  }

  // column numbers above and below the main area
  fill('#8d7f68');
  textAlign(CENTER, CENTER);
  const numStep = p >= 13 ? 5 : 10;
  textSize(max(7, p * 0.62));
  for (let c = 1; c <= COLS; c++) {
    if (c === 1 || c % numStep === 0) {
      text(c, colX(g, c), rowY(g, 'A') - p * 0.95);
      text(c, colX(g, c), rowY(g, 'J') + p * 0.95);
    }
  }
  // row letters down the left edge
  textAlign(RIGHT, CENTER);
  for (let i = 0; i < 5; i++) {
    text(UPPER_ROWS[i], colX(g, 1) - p * 0.85, rowY(g, UPPER_ROWS[i]));
    text(LOWER_ROWS[i], colX(g, 1) - p * 0.85, rowY(g, LOWER_ROWS[i]));
  }
}

function litGroups() {
  const set = {};
  if (mode === 'explore' && selected) set[selected.group] = 'main';
  if (mode === 'continuity') {
    if (continuityA) set[continuityA.group] = 'a';
    if (continuityB) set[continuityB.group] = set[continuityB.group] ? 'both' : 'b';
  }
  return set;
}

function drawHoles(g) {
  const p = g.pitch;
  const lit = litGroups();
  const r = max(3, p * 0.28);
  noStroke();
  for (let i = 0; i < holes.length; i++) {
    const h = holes[i];
    const state = lit[h.group];
    if (state) {
      fill(state === 'b' ? '#7b1fa2' : (state === 'both' ? '#00897b' : '#f9a825'));
      circle(h.x, h.y, r * 3.1);
    }
    fill(h === hovered ? '#00695c' : '#5d4c33');
    circle(h.x, h.y, r * 1.9);
  }
  // ring the specific holes the learner picked
  const picks = [selected, continuityA, continuityB].filter(Boolean);
  for (let i = 0; i < picks.length; i++) {
    noFill();
    stroke('#212121');
    strokeWeight(2);
    circle(picks[i].x, picks[i].y, r * 3.6);
  }
  noStroke();
}

function drawScenario(g) {
  const p = g.pitch;
  const sc = SCENARIOS[scenarioIndex];
  itemHits = [];

  // The breakout hangs over the centre channel, which is the one place on the
  // board it occupies no holes. Short stubs run up to the holes its pins are in.
  const pins = sc.chip.pins.map(function (q) {
    return { x: colX(g, q[1]), y: rowY(g, q[0]), name: q[2] };
  });
  const minX = Math.min.apply(null, pins.map(function (q) { return q.x; }));
  const maxX = Math.max.apply(null, pins.map(function (q) { return q.x; }));
  const maxY = Math.max.apply(null, pins.map(function (q) { return q.y; }));
  const bodyX = minX - p * 0.7;
  const bodyY = rowY(g, 'E') + p * 0.95;
  const bodyW = (maxX - minX) + p * 1.4;
  const bodyH = p * 1.05;

  stroke('#90a4ae');
  strokeWeight(max(1.5, p * 0.11));
  for (let i = 0; i < pins.length; i++) {
    line(pins[i].x, pins[i].y, pins[i].x, bodyY);
  }
  noStroke();
  fill(accused === 'chip' ? '#1a237e' : '#263238');
  rect(bodyX, bodyY, bodyW, bodyH, 3);
  fill('#eceff1');
  textAlign(CENTER, CENTER);
  textSize(max(6, p * 0.52));
  text('BME280', bodyX + bodyW / 2, bodyY + bodyH / 2);
  itemHits.push({ kind: 'chip', x: bodyX, y: bodyY, w: bodyW, h: bodyH });

  // a tab standing in for the Pi, so the two feed wires have a visible origin
  const tabY = rowY(g, 'R0') - p * 0.7;
  const tabH = rowY(g, 'R1') - rowY(g, 'R0') + p * 1.4;
  noStroke();
  fill('#004d40');
  rect(g.left - p * 1.9, tabY, p * 1.7, tabH, 3);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(max(6, p * 0.46));
  text('Pi', g.left - p * 1.05, tabY + tabH / 2);

  // the jumper wires
  for (let i = 0; i < sc.wires.length; i++) {
    const w = sc.wires[i];
    let ax, ay, bx, by;
    if (w.feed) {
      // a feed arriving from off-board: a short stub into the rail
      const y = rowY(g, w.rail);
      bx = railX(g, w.from[1]);
      by = y;
      ax = g.left - p * 0.9;
      ay = y;
    } else {
      const a = holePos(g, w.from);
      const b = holePos(g, w.to);
      ax = a.x; ay = a.y; bx = b.x; by = b.y;
    }
    stroke(accused === i ? '#1a237e' : w.color);
    strokeWeight(accused === i ? max(4, p * 0.34) : max(2.5, p * 0.22));
    strokeCap(ROUND);
    line(ax, ay, bx, by);
    noStroke();
    fill(w.color);
    circle(ax, ay, max(4, p * 0.4));
    circle(bx, by, max(4, p * 0.4));
    itemHits.push({ kind: 'wire', index: i, ax: ax, ay: ay, bx: bx, by: by });
  }
}

function holePos(g, ref) {
  if (ref[0][0] === 'R') return { x: railX(g, ref[1]), y: rowY(g, ref[0]) };
  return { x: colX(g, ref[1]), y: rowY(g, ref[0]) };
}

function drawHoverTip(g) {
  if (!hovered) return;
  const s = hovered.kind === 'main' ? hovered.label : hovered.label;
  textSize(12);
  const w = textWidth(s) + 14;
  const x = constrain(hovered.x + 10, 4, canvasWidth - w - 4);
  const y = constrain(hovered.y - 26, 4, drawHeight - 24);
  noStroke();
  fill(0, 0, 0, 200);
  rect(x, y, w, 20, 4);
  fill('white');
  textAlign(LEFT, CENTER);
  text(s, x + 7, y + 10);
}

// ---- panel --------------------------------------------------------------

function drawPanel(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  const inner = box.w - 20;
  let y = box.y + 10;

  if (mode === 'explore') y = panelExplore(box, y, inner);
  else if (mode === 'continuity') y = panelContinuity(box, y, inner);
  else y = panelBuild(box, y, inner);
}

function panelHeading(box, y, s, col) {
  const z = compact ? 11 : 12;
  noStroke();
  fill(col || '#546e7a');
  textAlign(LEFT, TOP);
  textSize(z);
  text(s, box.x + 10, y);
  return y + z + 5;
}

function panelBody(box, y, s, size, col, inner) {
  const z = compact ? max(10, size - 2) : size;
  noStroke();
  fill(col || '#37474f');
  textAlign(LEFT, TOP);
  const lines = wrapText(s, inner, z);
  textSize(z);
  text(lines, box.x + 10, y);
  return y + lines.split('\n').length * (z + 3) + 5;
}

function panelExplore(box, y, inner) {
  y = panelHeading(box, y, 'Explore');
  if (!selected) {
    return panelBody(box, y,
      'Click any hole. Every other hole joined to it by the same hidden metal strip ' +
      'lights up. Turn on Reveal internal strips to see why.', 13, '#455a64', inner);
  }
  y = panelBody(box, y, 'Hole ' + selected.label, 20, '#212121', inner);
  y = panelBody(box, y, groupName(selected.group), 14, '#e65100', inner);
  const explain = selected.group[0] === 'R'
    ? 'The rails run the whole length of the board. Anything plugged anywhere along ' +
      'this rail is connected to everything else on it - that is why power and ground go here.'
    : 'Each numbered column is split by the centre channel into two separate strips of ' +
      'five holes. Nothing crosses the channel unless you put a wire there.';
  return panelBody(box, y, explain, 12, '#546e7a', inner);
}

function panelContinuity(box, y, inner) {
  y = panelHeading(box, y, 'Continuity test');
  if (!continuityA) {
    return panelBody(box, y, 'Click the first hole.', 13, '#455a64', inner);
  }
  if (!continuityB) {
    y = panelBody(box, y, 'First: ' + continuityA.label, 18, '#f9a825', inner);
    return panelBody(box, y, 'Now click a second hole.', 13, '#455a64', inner);
  }
  const same = continuityA.group === continuityB.group;
  y = panelBody(box, y, continuityA.label + '  and  ' + continuityB.label, 16, '#212121', inner);
  y = panelBody(box, y, same ? 'CONNECTED' : 'NOT CONNECTED', 22,
                same ? '#1b5e20' : '#b71c1c', inner);
  return panelBody(box, y, continuityReason(continuityA, continuityB, same), 12, '#455a64', inner);
}

function continuityReason(a, b, same) {
  if (same) {
    if (a === b) return 'That is the same hole twice. Pick two different ones.';
    return 'Both holes sit on the same metal strip: ' + groupName(a.group).toLowerCase() + '.';
  }
  const aRail = a.group[0] === 'R';
  const bRail = b.group[0] === 'R';
  if (aRail && bRail) {
    return 'Not connected: the rails are separate strips. Positive and negative are never joined ' +
           'to each other, and the upper pair is not joined to the lower pair either.';
  }
  if (aRail !== bRail) {
    return 'Not connected: a rail runs the length of the board and is completely separate from ' +
           'the numbered columns. To join them you have to add a jumper wire.';
  }
  if (a.col === b.col) {
    return 'Not connected: these are on opposite sides of the centre channel. The channel is a ' +
           'real gap in the copper, which is what lets a chip straddle it without shorting its own pins.';
  }
  return 'Not connected: column ' + a.col + ' and column ' + b.col + ' are separate five-hole ' +
         'strips. Being next to each other does not join them.';
}

function panelBuild(box, y, inner) {
  const sc = SCENARIOS[scenarioIndex];
  y = panelHeading(box, y, 'Build check  -  scenario ' + (scenarioIndex + 1) + ' of ' + SCENARIOS.length);
  y = panelBody(box, y, sc.title, 15, '#212121', inner);

  const where = sc.chip.pins.map(function (q) { return q[2] + ' ' + q[0] + q[1]; }).join(',  ');
  y = panelBody(box, y, 'Breakout pins: ' + where, 11, '#78909c', inner);
  y = panelBody(box, y, 'Power feed enters the + rail, ground feed enters the - rail, ' +
                'both from the Pi.', 11, '#78909c', inner);

  if (accused === null) {
    return panelBody(box, y, 'One connection on this board is wrong. Click the wire or the ' +
                     'breakout you think is at fault.', 12, '#455a64', inner);
  }

  let right, why;
  if (accused === 'chip') {
    right = !!sc.chipIsMistake;
    why = sc.chipIsMistake ? sc.chipWhy
        : 'The breakout is seated correctly across four separate columns. Look at the wires.';
  } else {
    const w = sc.wires[accused];
    right = !!w.mistake;
    why = w.why;
  }
  y = panelBody(box, y, right ? 'That is the fault.' : 'Not this one.', 17,
                right ? '#1b5e20' : '#b71c1c', inner);
  y = panelBody(box, y, why, 12, '#455a64', inner);
  if (right) {
    y = panelBody(box, y, 'Press Next scenario for another board.', 11, '#78909c', inner);
  }
  return y;
}

function drawControlLabels() {
  // intentionally empty: the mode is named in the panel heading, and a second
  // label here collided with the Build check button on a narrow canvas
}

// ---- interaction --------------------------------------------------------

function mouseMoved() {
  hovered = holeAt(mouseX, mouseY);
}

function mousePressed() {
  if (mode === 'build') {
    const hit = itemAt(mouseX, mouseY);
    if (hit !== null) accused = hit;
    return;
  }
  const h = holeAt(mouseX, mouseY);
  if (!h) return;
  if (mode === 'explore') {
    selected = h;
  } else {
    if (!continuityA || continuityB) {
      continuityA = h;
      continuityB = null;
    } else {
      continuityB = h;
    }
  }
}

function holeAt(mx, my) {
  let best = null;
  let bestD = Infinity;
  for (let i = 0; i < holes.length; i++) {
    const d = dist(mx, my, holes[i].x, holes[i].y);
    if (d < bestD) { bestD = d; best = holes[i]; }
  }
  return bestD <= 9 ? best : null;
}

function itemAt(mx, my) {
  for (let i = 0; i < itemHits.length; i++) {
    const it = itemHits[i];
    if (it.kind === 'chip') {
      if (mx >= it.x && mx <= it.x + it.w && my >= it.y && my <= it.y + it.h) return 'chip';
    } else if (pointNearSegment(mx, my, it.ax, it.ay, it.bx, it.by) < 7) {
      return it.index;
    }
  }
  return null;
}

function pointNearSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return dist(px, py, x1, y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = constrain(t, 0, 1);
  return dist(px, py, x1 + t * dx, y1 + t * dy);
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
  hovered = null;   // its cached x/y belong to the old geometry
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
