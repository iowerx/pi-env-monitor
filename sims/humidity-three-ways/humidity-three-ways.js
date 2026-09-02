// Humidity Three Ways MicroSim
// CANVAS_HEIGHT: 600
// Bloom Level: Analyze (L4) - the learner separates absolute humidity, relative
// humidity and dew point by holding the water content fixed and changing only the
// temperature.
// The design decision that carries the lesson: when temperature changes, only the
// capacity line moves. The molecules stay visibly frozen. Students believe cooling
// "squeezes water out" of air, and watching the limit descend to meet water that
// never moved is what corrects that.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 190;

const NARROW_BREAKPOINT = 760;
const E_MAX = 80;                 // hPa: enough to hold esat(40 C) = 73.8

// ---- controls ----
let tempSlider, addButton, removeButton, lockWaterButton, lockRhButton;
let p1Button, p2Button, p3Button;

// ---- state ----
// The single source of truth is the actual vapour pressure. Everything else is
// derived from it, so the three readouts cannot disagree with one another.
let vp = 17.02;                   // hPa, a dew point of 15 C
let lockWater = true;
let lockRh = false;
let condensed = 0;                // droplets that have left the air
let caption = '';
let hist = { ah: [], rh: [], td: [] };
let histTimer = 0;
let compare = null;               // the two-fifty-percent-days panel

// ---- psychrometrics, Magnus ---------------------------------------------

function esat(t) { return 6.112 * Math.exp(17.62 * t / (243.12 + t)); }

function dewPoint(e) {
  const l = Math.log(max(e, 0.01) / 6.112);
  return 243.12 * l / (17.62 - l);
}

// grams of water per cubic metre
function absHumidity(e, t) { return 216.7 * e / (t + 273.15); }

function tempNow() { return tempSlider.value() / 10; }
function rhNow() { return constrain(vp / esat(tempNow()) * 100, 0, 100); }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  tempSlider = createSlider(-100, 400, 250, 1);      // tenths of a degree

  addButton = createButton('Add water');
  addButton.mousePressed(function () { changeWater(1.6); });
  removeButton = createButton('Remove water');
  removeButton.mousePressed(function () { changeWater(-1.6); });

  lockWaterButton = createButton('Water locked');
  lockWaterButton.mousePressed(function () {
    lockWater = !lockWater;
    if (lockWater) lockRh = false;
    updateLockLabels();
  });
  lockRhButton = createButton('RH free');
  lockRhButton.mousePressed(function () {
    lockRh = !lockRh;
    if (lockRh) lockWater = false;
    updateLockLabels();
  });

  p1Button = createButton('Overnight cooling');
  p1Button.mousePressed(function () {
    compare = null;
    lockWater = true; lockRh = false; updateLockLabels();
    tempSlider.value(250);
    vp = esat(15);                       // dew point 15 C
    condensed = 0;
    caption = 'Start at 25 C with a dew point of 15 C, then cool it through the night. ' +
              'Drag the temperature down and watch the relative humidity climb with no ' +
              'water added at all. This is how dew forms.';
  });
  p2Button = createButton('Heated house');
  p2Button.mousePressed(function () {
    compare = null;
    lockWater = true; lockRh = false; updateLockLabels();
    tempSlider.value(0);
    vp = 0.8 * esat(0);                  // outdoor air, 0 C at 80 percent
    condensed = 0;
    caption = 'Outdoor air at 0 C and 80 percent relative humidity. Now warm it to 21 C ' +
              'indoors. Nothing dried the air. You warmed it.';
  });
  p3Button = createButton('Two 50% days');
  p3Button.mousePressed(function () {
    lockWater = true; lockRh = false; updateLockLabels();
    tempSlider.value(317);
    vp = esat(20);
    condensed = 0;
    compare = true;
    caption = 'Both days read 50 percent relative humidity. One is muggy and one is cold. ' +
              'The dew point is the number that tells them apart.';
  });

  updateLockLabels();
  layoutControls();

  describe('A container of air with a fixed count of water molecules and a capacity line ' +
           'set by the temperature. Changing the temperature moves only the line; the ' +
           'molecules stay where they are. Three readouts - absolute humidity, relative ' +
           'humidity and dew point - update together with small history strips, and the ' +
           'current state is plotted on the saturation vapour pressure curve. When the ' +
           'capacity line reaches the water, condensation starts.', LABEL);
}

function updateLockLabels() {
  lockWaterButton.html(lockWater ? 'Water locked' : 'Water free');
  lockWaterButton.style('background', lockWater ? '#1565c0' : '#f5f5f5');
  lockWaterButton.style('color', lockWater ? '#ffffff' : '#37474f');
  lockRhButton.html(lockRh ? 'RH locked' : 'RH free');
  lockRhButton.style('background', lockRh ? '#1565c0' : '#f5f5f5');
  lockRhButton.style('color', lockRh ? '#ffffff' : '#37474f');
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 80;
  tempSlider.position(sliderLeftMargin, r1 + 4);
  tempSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  addButton.position(10, r2);
  removeButton.position(88, r2);
  lockWaterButton.position(188, r2);
  lockRhButton.position(288, r2);
  p1Button.position(10, r3);
  p2Button.position(126, r3);
  p3Button.position(224, r3);
}

function changeWater(d) {
  compare = null;
  vp = constrain(vp + d, 0.2, E_MAX);
  const cap = esat(tempNow());
  if (vp > cap) { vp = cap; caption = 'The air is saturated. It cannot hold any more.'; }
  condensed = 0;
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  const t = tempNow();
  const cap = esat(t);

  // Holding relative humidity fixed means the water content has to move instead.
  if (lockRh && hist.rh.length) {
    vp = constrain(hist.rh[hist.rh.length - 1] / 100 * cap, 0.2, E_MAX);
  } else if (vp > cap) {
    // condensation: the limit came down to meet water that never moved
    condensed += (vp - cap);
    vp = cap;
  }

  histTimer -= deltaTime;
  if (histTimer <= 0) {
    histTimer = 120;
    hist.ah.push(absHumidity(vp, t));
    hist.rh.push(rhNow());
    hist.td.push(dewPoint(vp));
    ['ah', 'rh', 'td'].forEach(function (k) { if (hist[k].length > 90) hist[k].shift(); });
  }

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
  text('Humidity, Three Ways', canvasWidth / 2, narrow ? 6 : 4);

  let boxB, readB, curveB;
  if (narrow) {
    const w = canvasWidth - 2 * margin;
    boxB = { x: margin, y: 30, w: 132, h: 208 };
    readB = { x: margin + 140, y: 30, w: w - 140, h: 208 };
    curveB = { x: margin, y: 246, w: w, h: drawHeight - 258 };
  } else {
    const cw = 236;
    boxB = { x: margin, y: 38, w: 176, h: drawHeight - 52 };
    readB = { x: margin + 184, y: 38,
              w: canvasWidth - margin - cw - 8 - (margin + 184), h: drawHeight - 52 };
    curveB = { x: canvasWidth - margin - cw, y: 38, w: cw, h: drawHeight - 52 };
  }

  drawParcel(boxB, narrow);
  drawReadouts(readB, narrow);
  drawCurve(curveB, narrow);
  drawControlLabels();
}

function drawParcel(box, narrow) {
  const t = tempNow();
  const cap = esat(t);
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(10);
  text('A parcel of air', box.x + 8, box.y + 6);

  const inX = box.x + 10;
  const inW = box.w - 20;
  const botY = box.y + box.h - 30;
  const topY = box.y + 24;
  function ey(e) { return map(e, 0, E_MAX, botY, topY); }

  // the container
  noStroke();
  fill('#e8f4fb');
  rect(inX, topY, inW, botY - topY, 3);

  // the water that is actually there
  fill('rgba(41,121,255,0.18)');
  rect(inX, ey(vp), inW, botY - ey(vp), 0, 0, 3, 3);

  // molecules, laid out on a fixed lattice so the count is visibly countable
  const n = round(vp * 5);
  const cols = 9;
  noStroke();
  fill('#1565c0');
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const r = floor(i / cols);
    const x = inX + 8 + c * (inW - 16) / (cols - 1);
    const y = botY - 8 - r * 8.6;
    if (y < topY + 4) break;
    circle(x, y, 4.4);
  }

  // the capacity line: the only thing that moves when temperature changes
  const cy = ey(min(cap, E_MAX));
  stroke('#c62828');
  strokeWeight(2);
  line(inX - 4, cy, inX + inW + 4, cy);
  noStroke();
  fill('#c62828');
  textAlign(RIGHT, BOTTOM);
  textSize(9);
  text('capacity at ' + nf(t, 1, 1) + ' C', inX + inW + 2, cy - 2);

  // the gap
  if (cy < ey(vp) - 14) {
    fill('#78909c');
    textAlign(CENTER, CENTER);
    textSize(9);
    text('room for more', inX + inW / 2, (cy + ey(vp)) / 2);
  }

  // condensation
  if (condensed > 0.02) {
    fill('#0d47a1');
    const nd = min(14, ceil(condensed * 2));
    for (let i = 0; i < nd; i++) {
      const x = inX + 12 + (i * 37) % (inW - 24);
      ellipse(x, botY - 3, 5, 7);
    }
  }

  noStroke();
  fill(condensed > 0.02 ? '#0d47a1' : '#546e7a');
  textAlign(LEFT, TOP);
  textSize(9);
  text(wrapText(condensed > 0.02
        ? 'Condensation. Water is now leaving the air.'
        : 'Water content unchanged. Capacity changed.', box.w - 16, 9),
       box.x + 8, box.y + box.h - 24);
}

function drawReadouts(box, narrow) {
  const t = tempNow();
  const rh = rhNow();
  const td = dewPoint(vp);
  const ah = absHumidity(vp, t);
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const rows = [
    { k: 'ah', label: 'absolute humidity', val: nf(ah, 1, 2) + ' g/m3', col: '#00695c' },
    { k: 'rh', label: 'relative humidity', val: nf(rh, 1, 1) + ' %', col: '#c62828' },
    { k: 'td', label: 'dew point', val: nf(td, 1, 1) + ' C', col: '#1565c0' }
  ];
  const rowH = (box.h - (compare ? 76 : 16)) / 3;
  for (let i = 0; i < rows.length; i++) {
    const y = box.y + 8 + i * rowH;
    fill('#546e7a');
    textAlign(LEFT, TOP);
    textSize(10);
    text(rows[i].label, box.x + 10, y);
    fill(rows[i].col);
    textSize(narrow ? 19 : 24);
    text(rows[i].val, box.x + 10, y + 12);
    sparkline(hist[rows[i].k], box.x + box.w - 76, y + 6, 66, min(28, rowH - 22), rows[i].col);
  }

  if (compare) {
    const y = box.y + box.h - 70;
    fill('#546e7a');
    textAlign(LEFT, TOP);
    textSize(10);
    text('The chapter\'s opening puzzle', box.x + 10, y);
    fill('#212121');
    textSize(narrow ? 10 : 11);
    text('Day A   31.7 C,  50% RH,  dew point 20.0 C   -   muggy', box.x + 10, y + 15);
    text('Day B     5.6 C,  50% RH,  dew point -4.0 C   -   cold and dry',
         box.x + 10, y + 30);
    fill('#00695c');
    textSize(10);
    text('Same relative humidity. Four times the water.', box.x + 10, y + 47);
  }
}

function sparkline(arr, x, y, w, h, col) {
  if (arr.length < 2) return;
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < arr.length; i++) { lo = min(lo, arr[i]); hi = max(hi, arr[i]); }
  if (hi - lo < 1e-6) { lo -= 1; hi += 1; }
  noStroke();
  fill('#fafafa');
  rect(x, y, w, h, 2);
  stroke(col);
  strokeWeight(1.4);
  noFill();
  beginShape();
  for (let i = 0; i < arr.length; i++) {
    vertex(map(i, 0, arr.length - 1, x + 2, x + w - 2), map(arr[i], lo, hi, y + h - 2, y + 2));
  }
  endShape();
  noStroke();
  fill('#b0bec5');
  textAlign(RIGHT, TOP);
  textSize(7);
  text('last minute', x + w - 2, y + h + 1);
}

function drawCurve(box, narrow) {
  const t = tempNow();
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(10);
  text('Saturation vapour pressure', box.x + 8, box.y + 6);

  const pl = { x: box.x + 34, y: box.y + 22, w: box.w - 44, h: box.h - 104 };
  function px(tt) { return map(tt, -10, 40, pl.x, pl.x + pl.w); }
  function py(e) { return map(e, 0, E_MAX, pl.y + pl.h, pl.y); }

  stroke('#eceff1');
  strokeWeight(1);
  for (let e = 0; e <= E_MAX; e += 20) {
    line(pl.x, py(e), pl.x + pl.w, py(e));
    noStroke();
    fill('#90a4ae');
    textAlign(RIGHT, CENTER);
    textSize(8);
    text(e, pl.x - 3, py(e));
    stroke('#eceff1');
  }
  noStroke();
  textAlign(CENTER, TOP);
  fill('#90a4ae');
  textSize(8);
  for (let tt = -10; tt <= 40; tt += 10) text(tt, px(tt), pl.y + pl.h + 3);
  textAlign(LEFT, TOP);
  text('hPa', pl.x - 32, pl.y - 14);
  textAlign(RIGHT, TOP);
  text('deg C', pl.x + pl.w, pl.y + pl.h + 14);

  // the curve, and everything under it is unsaturated air
  noStroke();
  fill('rgba(21,101,192,0.07)');
  beginShape();
  vertex(pl.x, pl.y + pl.h);
  for (let tt = -10; tt <= 40; tt += 1) vertex(px(tt), py(min(esat(tt), E_MAX)));
  vertex(pl.x + pl.w, pl.y + pl.h);
  endShape(CLOSE);
  stroke('#c62828');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let tt = -10; tt <= 40; tt += 1) vertex(px(tt), py(min(esat(tt), E_MAX)));
  endShape();

  // the current state, and the horizontal run across to the dew point
  const td = dewPoint(vp);
  stroke('#1565c0');
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(px(constrain(td, -10, 40)), py(vp), px(constrain(t, -10, 40)), py(vp));
  drawingContext.setLineDash([]);
  noStroke();
  fill('#1565c0');
  circle(px(constrain(td, -10, 40)), py(min(vp, E_MAX)), 7);
  fill('#e65100');
  circle(px(constrain(t, -10, 40)), py(min(vp, E_MAX)), 8);

  fill('#e65100');
  textAlign(LEFT, TOP);
  textSize(8);
  text('you are here', px(constrain(t, -10, 40)) + 6, py(min(vp, E_MAX)) - 12);
  fill('#1565c0');
  textAlign(RIGHT, TOP);
  text('dew point', px(constrain(td, -10, 40)) - 6, py(min(vp, E_MAX)) - 12);

  if (caption !== '') {
    fill('#00695c');
    textAlign(LEFT, TOP);
    textSize(narrow ? 9 : 10);
    text(wrapText(caption, box.w - 16, narrow ? 9 : 10), box.x + 8, box.y + box.h - 54);
  } else {
    fill('#78909c');
    textAlign(LEFT, TOP);
    textSize(9);
    text(wrapText('Absolute humidity shifts by a few percent as you change the ' +
                  'temperature. The water did not move - the cubic metre did. The dew ' +
                  'point does not move at all.', box.w - 16, 9), box.x + 8, box.y + box.h - 44);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Temperature:  ' + nf(tempNow(), 1, 1) + ' C', 10, drawHeight + 22);
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
