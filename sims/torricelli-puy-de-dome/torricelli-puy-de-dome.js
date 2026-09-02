// Torricelli and Puy de Dome MicroSim
// CANVAS_HEIGHT: 620
// Bloom Level: Understand (L2) - the learner explains why the column stands where
// it does, predicts how it responds to altitude and to the density of the liquid,
// and sees how Perier's climb ruled out the rival hypothesis.
// The two-hypothesis overlay is the point. An experiment only means something if
// it could have come out the other way, so the losing prediction is drawn on the
// same graph as the winning one and the learner's own measurements decide.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 190;

const NARROW_BREAKPOINT = 760;
const G = 9.80665;
const BASE_M = 400;               // Clermont-Ferrand, where Perier left the control
const SUMMIT_M = 1465;            // Puy de Dome

// ---- controls ----
let liquidSelect, hypoButton, clearButton, altSlider, weatherSlider;

// ---- state ----
let showHypotheses = false;
let points = [];                  // the learner's own measurements: {alt, mm}

const LIQUIDS = {
  Mercury:   { rho: 13534, color: '#78909c', dark: '#455a64', axis: 0.95 },
  Water:     { rho: 1000,  color: '#4fc3f7', dark: '#0277bd', axis: 12.0 },
  'Olive oil': { rho: 920, color: '#cddc39', dark: '#9e9d24', axis: 13.0 }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  liquidSelect = createSelect();
  Object.keys(LIQUIDS).forEach(function (k) { liquidSelect.option(k); });
  liquidSelect.selected('Mercury');
  liquidSelect.changed(function () { points = []; });

  hypoButton = createButton('Show both hypotheses');
  hypoButton.mousePressed(function () {
    showHypotheses = !showHypotheses;
    hypoButton.html(showHypotheses ? 'Hide hypotheses' : 'Show both hypotheses');
  });

  clearButton = createButton('Clear points');
  clearButton.mousePressed(function () { points = []; });

  altSlider = createSlider(0, SUMMIT_M, BASE_M, 5);
  weatherSlider = createSlider(980, 1040, 1013, 1);

  layoutControls();

  describe('Torricelli\'s tube standing in a dish on the left, with the vacuum at the ' +
           'top and a force balance drawn between the weight of the column and the air ' +
           'pressing on the dish. On the right, a cross-section of the Puy de Dome with ' +
           'a barometer the learner carries from the monastery to the summit while a ' +
           'control stays behind. Each measurement is plotted against altitude beside ' +
           'two rival predictions - air has weight, or something in the tube holds the ' +
           'mercury - and only one of them fits.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 80;
  liquidSelect.position(58, r1);
  liquidSelect.size(96);
  hypoButton.position(164, r1);
  clearButton.position(316, r1);
  altSlider.position(sliderLeftMargin, r2 + 4);
  altSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  weatherSlider.position(sliderLeftMargin, r3 + 4);
  weatherSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
}

// ---- physics ------------------------------------------------------------

function seaLevelPa() { return weatherSlider.value() * 100; }

// international standard atmosphere, troposphere
function pressureAt(m) {
  return seaLevelPa() * Math.pow(1 - 0.0065 * m / 288.15, 5.255);
}

function columnM(pa) {
  return pa / (LIQUIDS[liquidSelect.value()].rho * G);
}

function altNow() { return altSlider.value(); }

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
  textSize(narrow ? 17 : 22);
  text('Torricelli, and the Climb up the Puy de Dome', canvasWidth / 2, narrow ? 6 : 4);

  let tubeB, mtnB, graphB;
  if (narrow) {
    const w = canvasWidth - 2 * margin;
    tubeB = { x: margin, y: 30, w: w, h: 186 };
    mtnB = { x: margin, y: 222, w: w, h: 150 };
    graphB = { x: margin, y: 378, w: w, h: drawHeight - 390 };
  } else {
    const tw = 208;
    const gw = 250;
    tubeB = { x: margin, y: 38, w: tw, h: drawHeight - 52 };
    mtnB = { x: margin + tw + 8, y: 38,
             w: canvasWidth - margin - gw - 8 - (margin + tw + 8), h: drawHeight - 52 };
    graphB = { x: canvasWidth - margin - gw, y: 38, w: gw, h: drawHeight - 52 };
  }

  recordPoint();
  drawTube(tubeB, narrow);
  drawMountain(mtnB, narrow);
  drawGraph(graphB, narrow);
  drawControlLabels();
}

function drawTube(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const L = LIQUIDS[liquidSelect.value()];
  const pa = pressureAt(altNow());
  const hM = columnM(pa);
  const axisMax = L.axis;

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Torricelli\'s tube', box.x + 8, box.y + 6);

  const dishY = box.y + box.h - (narrow ? 56 : 72);
  const topY = box.y + 30;
  const tubeX = box.x + (narrow ? 78 : 88);
  const tubeW = narrow ? 20 : 24;
  const colPx = map(hM, 0, axisMax, 0, dishY - topY);

  // the dish
  noStroke();
  fill(L.color);
  rect(tubeX - 34, dishY, tubeW + 68, 12, 2);
  fill('#b0bec5');
  rect(tubeX - 38, dishY + 12, tubeW + 76, 5, 2);

  // the tube: vacuum above, liquid below
  stroke('#90a4ae');
  strokeWeight(1.5);
  fill('#fafafa');
  rect(tubeX, topY, tubeW, dishY - topY + 12);
  noStroke();
  fill(L.color);
  rect(tubeX + 1.5, dishY - colPx, tubeW - 3, colPx + 12);

  // the vacuum, which is the part nobody believed in
  fill('#37474f');
  textAlign(CENTER, TOP);
  textSize(9);
  if (dishY - colPx - topY > 24) {
    text('vacuum', tubeX + tubeW / 2, topY + 4);
    stroke('#90a4ae');
    strokeWeight(1);
    drawingContext.setLineDash([2, 2]);
    line(tubeX + 2, dishY - colPx, tubeX + tubeW - 2, dishY - colPx);
    drawingContext.setLineDash([]);
    noStroke();
  }

  // force balance: the two arrows are drawn the same length on purpose
  const armY = (dishY + max(topY, dishY - colPx)) / 2;
  stroke('#c62828');
  strokeWeight(2);
  const aLen = 26;
  line(tubeX + tubeW + 16, armY - aLen / 2, tubeX + tubeW + 16, armY + aLen / 2);
  line(tubeX + tubeW + 16, armY + aLen / 2, tubeX + tubeW + 12, armY + aLen / 2 - 5);
  line(tubeX + tubeW + 16, armY + aLen / 2, tubeX + tubeW + 20, armY + aLen / 2 - 5);
  stroke('#1565c0');
  line(tubeX - 22, dishY + 26, tubeX - 22, dishY + 26 - aLen);
  line(tubeX - 22, dishY + 26 - aLen, tubeX - 26, dishY + 26 - aLen + 5);
  line(tubeX - 22, dishY + 26 - aLen, tubeX - 18, dishY + 26 - aLen + 5);
  noStroke();
  fill('#c62828');
  textAlign(LEFT, CENTER);
  textSize(8);
  text('weight of\nthe column', tubeX + tubeW + 24, armY);
  fill('#1565c0');
  textAlign(CENTER, TOP);
  text('air pressing\non the dish', tubeX - 22, dishY + 30);

  // readouts
  fill('#212121');
  textAlign(RIGHT, TOP);
  textSize(narrow ? 15 : 17);
  const mm = hM * 1000;
  text(mm >= 2000 ? nf(hM, 1, 2) + ' m' : nf(mm, 1, 1) + ' mm', box.x + box.w - 8, box.y + 22);
  fill('#546e7a');
  textSize(11);
  text(nf(pa / 100, 1, 1) + ' hPa', box.x + box.w - 8, box.y + 44);

  if (liquidSelect.value() !== 'Mercury') {
    fill('#b71c1c');
    textAlign(LEFT, TOP);
    textSize(9);
    text(wrapText('This is why the well-diggers\' pumps failed at 10 metres, and why ' +
                  'Torricelli chose mercury.', box.w - 16, 9), box.x + 8, box.y + box.h - 26);
  } else if (!narrow) {
    fill('#78909c');
    textAlign(LEFT, TOP);
    textSize(9);
    text('scale: 0 to ' + axisMax + ' m', box.x + 8, box.y + box.h - 14);
  }
}

function drawMountain(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('#e3f2fd');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Puy de Dome, September 1648', box.x + 8, box.y + 6);

  const gy = box.y + box.h - 30;
  const topY = box.y + 42;
  function ay(m) { return map(m, 0, SUMMIT_M, gy, topY); }

  // the left flank, as a polyline, so the carried barometer can sit on it
  const FLANK = [[0.04, 0], [0.18, 300], [0.33, 760], [0.46, 1180], [0.56, SUMMIT_M]];
  function slopeX(m) {
    for (let i = 1; i < FLANK.length; i++) {
      if (m <= FLANK[i][1]) {
        const f = (m - FLANK[i - 1][1]) / (FLANK[i][1] - FLANK[i - 1][1]);
        return box.x + box.w * lerp(FLANK[i - 1][0], FLANK[i][0], f);
      }
    }
    return box.x + box.w * 0.56;
  }

  // the mountain profile
  fill('#8d6e63');
  stroke('#5d4037');
  strokeWeight(1);
  beginShape();
  vertex(box.x + 4, gy);
  vertex(box.x + box.w * 0.18, ay(300));
  vertex(box.x + box.w * 0.33, ay(760));
  vertex(box.x + box.w * 0.46, ay(1180));
  vertex(box.x + box.w * 0.56, ay(SUMMIT_M));
  vertex(box.x + box.w * 0.66, ay(1180));
  vertex(box.x + box.w * 0.80, ay(620));
  vertex(box.x + box.w - 4, gy);
  endShape(CLOSE);
  noStroke();

  // altitude gridlines and named waypoints
  const marks = [[0, 'sea level'], [BASE_M, 'monastery, 400 m'],
                 [930, 'mid-slope'], [SUMMIT_M, 'summit, 1465 m']];
  for (let i = 0; i < marks.length; i++) {
    const y = ay(marks[i][0]);
    stroke('rgba(69,90,100,0.25)');
    strokeWeight(1);
    line(box.x + 4, y, box.x + box.w - 4, y);
    noStroke();
    fill('#546e7a');
    textAlign(RIGHT, BOTTOM);
    textSize(8);
    text(marks[i][1], box.x + box.w - 6, y - 1);
  }

  // the control barometer, left at the monastery
  drawMiniBaro(slopeX(BASE_M) - 30, ay(BASE_M), pressureAt(BASE_M), '#5d4037', 'control');
  // the one Perier carried
  const a = altNow();
  drawMiniBaro(slopeX(a) - 12, ay(a), pressureAt(a), '#c62828', 'carried');

  // the historical comparison, once the learner reaches the top
  const dropMm = (columnM(pressureAt(BASE_M)) - columnM(pressureAt(a))) * 1000;
  if (a >= SUMMIT_M - 20 && liquidSelect.value() === 'Mercury') {
    fill('#00695c');
    textAlign(LEFT, TOP);
    textSize(9);
    text(wrapText('Perier measured about 85 mm. Yours: ' + nf(dropMm, 1, 0) + ' mm.',
                  box.w - 16, 9), box.x + 8, box.y + box.h - 26);
  } else {
    fill('#37474f');
    textAlign(LEFT, TOP);
    textSize(9);
    text('drop from the monastery: ' + nf(dropMm, 1, 1) +
         (liquidSelect.value() === 'Mercury' ? ' mm' : ' mm of ' + liquidSelect.value().toLowerCase()),
         box.x + 8, box.y + box.h - 14);
  }
}

function drawMiniBaro(x, y, pa, col, tag) {
  noStroke();
  fill(col);
  rect(x - 7, y - 16, 14, 20, 2);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(7);
  text(nf(pa / 100, 1, 0), x, y - 6);
  fill(col);
  textAlign(CENTER, TOP);
  textSize(7);
  text(tag, x, y + 5);
}

function drawGraph(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Column height against altitude', box.x + 8, box.y + 6);

  const L = LIQUIDS[liquidSelect.value()];
  const pl = { x: box.x + 40, y: box.y + 24, w: box.w - 52, h: box.h - 62 };
  const hBase = columnM(pressureAt(0)) * 1000;
  const hTop = columnM(pressureAt(SUMMIT_M)) * 1000;
  const lo = hTop - (hBase - hTop) * 0.25;
  const hi = hBase + (hBase - hTop) * 0.25;

  function gx(m) { return map(m, 0, SUMMIT_M, pl.x, pl.x + pl.w); }
  function gy(mm) { return map(mm, lo, hi, pl.y + pl.h, pl.y); }

  stroke('#eceff1');
  strokeWeight(1);
  for (let i = 0; i <= 4; i++) {
    const yy = pl.y + i * pl.h / 4;
    line(pl.x, yy, pl.x + pl.w, yy);
  }
  noStroke();
  fill('#90a4ae');
  textAlign(RIGHT, CENTER);
  textSize(8);
  text(nf(hi, 1, 0), pl.x - 4, pl.y);
  text(nf(lo, 1, 0), pl.x - 4, pl.y + pl.h);
  textAlign(CENTER, TOP);
  text('0', pl.x, pl.y + pl.h + 3);
  text('1465 m', pl.x + pl.w, pl.y + pl.h + 3);
  textAlign(LEFT, TOP);
  text('mm', pl.x - 36, pl.y - 16);

  if (showHypotheses) {
    // "air has weight" - the column falls with altitude
    stroke('#2e7d32');
    strokeWeight(1.5);
    noFill();
    beginShape();
    for (let m = 0; m <= SUMMIT_M; m += 40) {
      vertex(gx(m), gy(columnM(pressureAt(m)) * 1000));
    }
    endShape();
    // "something in the tube holds it up" - no change at all
    stroke('#c62828');
    strokeWeight(1.5);
    drawingContext.setLineDash([5, 4]);
    line(gx(0), gy(hBase), gx(SUMMIT_M), gy(hBase));
    drawingContext.setLineDash([]);
    noStroke();
    fill('#2e7d32');
    textAlign(LEFT, TOP);
    textSize(8);
    text('air has weight', pl.x + 4, gy(columnM(pressureAt(SUMMIT_M * 0.55)) * 1000) + 4);
    fill('#c62828');
    text('something in the tube holds it', pl.x + 4, gy(hBase) - 11);
  }

  // the learner's own measurements
  noStroke();
  fill('#0d47a1');
  for (let i = 0; i < points.length; i++) {
    circle(gx(points[i].alt), gy(points[i].mm), 5);
  }
  fill('#e65100');
  circle(gx(altNow()), gy(columnM(pressureAt(altNow())) * 1000), 7);

  fill('#78909c');
  textAlign(LEFT, TOP);
  textSize(9);
  text(points.length === 0
        ? 'Drag the altitude slider. Each stop is recorded here.'
        : points.length + ' measurement' + (points.length === 1 ? '' : 's') +
          (showHypotheses ? '. Only one prediction fits them.' : '.'),
       box.x + 8, box.y + box.h - 14);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Liquid:', 10, drawHeight + 22);
  text('Altitude:  ' + altNow() + ' m', 10, drawHeight + 58);
  text('Sea level:  ' + weatherSlider.value() + ' hPa', 10, drawHeight + 94);
}

// Record a measurement whenever the learner reaches somewhere they have not
// already measured. Called from draw(), because the altitude comes from a DOM
// slider and p5's mouseReleased never fires when the pointer is over one.
function recordPoint() {
  const a = altNow();
  for (let i = 0; i < points.length; i++) if (abs(points[i].alt - a) < 45) return;
  points.push({ alt: a, mm: columnM(pressureAt(a)) * 1000 });
  if (points.length > 30) points.shift();
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
