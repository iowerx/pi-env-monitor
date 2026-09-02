// Psychrometer Wet Bulb Bench MicroSim
// CANVAS_HEIGHT: 590
// Bloom Level: Apply (L3) - the learner runs the instrument and reads humidity out
// of two temperature readings and a table.
// The wick has to be wet by a button press. That makes the cooling an event the
// learner causes rather than a state they arrive to, which is the difference
// between demonstrating evaporative cooling and being told about it.
// The saturated-air case is the proof: at 100 percent humidity the wet bulb does
// not fall at all, so the cooling cannot be coming from the water being cold.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 200;

const NARROW_BREAKPOINT = 780;
const DEPRESSIONS = 13;           // table columns, 0 to 12 degrees
const DRY_ROWS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];

// ---- controls ----
let drySlider, rhSlider, wetButton, airSelect, checkButton;

// ---- state ----
let wetBulb = null;               // null until the wick is wetted
let wicked = false;
let crossCheck = false;
let fanPhase = 0;
let table = null;                 // precomputed RH lookup

const AIRFLOW = {
  'Still air':      { eff: 0.78, tau: 6.0 },
  'Natural breeze': { eff: 0.95, tau: 3.0 },
  'Aspirated':      { eff: 1.00, tau: 1.6 }
};

// ---- psychrometrics -----------------------------------------------------

function esat(t) { return 6.112 * Math.exp(17.62 * t / (243.12 + t)); }
function dewPoint(t, rh) {
  const l = Math.log(max(rh, 0.5) / 100 * esat(t) / 6.112);
  return 243.12 * l / (17.62 - l);
}

// Stull (2011), an explicit approximation to the psychrometric wet bulb.
// Good to a few tenths of a degree over the range this bench covers.
function wetBulbOf(t, rh) {
  const r = constrain(rh, 5, 100);
  if (r >= 99.5) return t;
  return t * Math.atan(0.151977 * Math.sqrt(r + 8.313659))
       + Math.atan(t + r) - Math.atan(r - 1.676331)
       + 0.00391838 * Math.pow(r, 1.5) * Math.atan(0.023101 * r)
       - 4.686035;
}

// invert the above: what humidity gives this depression at this dry bulb?
function rhFromDepression(t, dep) {
  if (dep <= 0.001) return 100;
  let lo = 5, hi = 100;
  if (t - wetBulbOf(t, lo) < dep) return null;     // that dry is not possible here
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (t - wetBulbOf(t, mid) > dep) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

function buildTable() {
  table = DRY_ROWS.map(function (t) {
    const row = [];
    for (let d = 0; d < DEPRESSIONS; d++) row.push(rhFromDepression(t, d));
    return row;
  });
}

function dryNow() { return drySlider.value() / 10; }
function rhTrue() { return rhSlider.value(); }
function airflow() { return AIRFLOW[airSelect.value()]; }

// where the wet bulb will settle, given that still air never quite gets there
function wetTarget() {
  const t = dryNow();
  const ideal = wetBulbOf(t, rhTrue());
  return t - (t - ideal) * airflow().eff;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  drySlider = createSlider(0, 450, 250, 1);
  rhSlider = createSlider(5, 100, 50, 1);

  wetButton = createButton('Wet the wick');
  wetButton.mousePressed(function () {
    wicked = true;
    wetBulb = dryNow();            // it starts equal to the dry bulb, then falls
  });

  airSelect = createSelect();
  Object.keys(AIRFLOW).forEach(function (k) { airSelect.option(k); });
  airSelect.selected('Natural breeze');

  checkButton = createButton('Cross-check a BME280');
  checkButton.mousePressed(function () { crossCheck = !crossCheck; });

  buildTable();
  layoutControls();

  describe('Two thermometers, one dry and one wrapped in a wet wick, with a fan whose ' +
           'speed the learner sets. Wetting the wick starts evaporation and the wet bulb ' +
           'falls to an equilibrium below the dry bulb. The difference between them is ' +
           'looked up in a psychrometric table to give relative humidity and dew point. ' +
           'In saturated air the wet bulb does not fall at all, which is the proof that ' +
           'the cooling comes from evaporation.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 80;
  drySlider.position(sliderLeftMargin, r1 + 4);
  drySlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  rhSlider.position(sliderLeftMargin, r2 + 4);
  rhSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  wetButton.position(10, r3);
  airSelect.position(110, r3);
  airSelect.size(120);
  checkButton.position(240, r3);
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  const t = dryNow();

  // the wick approaches equilibrium exponentially, slowly in still air
  if (wicked && wetBulb !== null) {
    const tau = airflow().tau;
    const k = 1 - Math.exp(-(deltaTime / 1000) / tau);
    wetBulb += (wetTarget() - wetBulb) * k;
  }
  fanPhase += deltaTime * (airSelect.value() === 'Aspirated' ? 0.012
                        : (airSelect.value() === 'Natural breeze' ? 0.004 : 0.0006));

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
  text('The Psychrometer', canvasWidth / 2, narrow ? 6 : 4);

  let thermB, tableB, panelB;
  if (narrow) {
    const w = canvasWidth - 2 * margin;
    thermB = { x: margin, y: 30, w: 132, h: 232 };
    panelB = { x: margin + 140, y: 30, w: w - 140, h: 232 };
    tableB = { x: margin, y: 270, w: w, h: drawHeight - 282 };
  } else {
    const pw = 200;
    thermB = { x: margin, y: 38, w: 178, h: drawHeight - 52 };
    tableB = { x: margin + 186, y: 38,
               w: canvasWidth - margin - pw - 8 - (margin + 186), h: drawHeight - 52 };
    panelB = { x: canvasWidth - margin - pw, y: 38, w: pw, h: drawHeight - 52 };
  }

  drawBench(thermB, narrow);
  drawTable(tableB, narrow);
  drawPanel(panelB, narrow);
  drawControlLabels();
}

function drawBench(box, narrow) {
  const t = dryNow();
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(10);
  text('Two thermometers', box.x + 8, box.y + 6);

  const topY = box.y + 26;
  const botY = box.y + box.h - 54;
  function ty(v) { return map(v, 0, 45, botY, topY); }

  const x1 = box.x + 40;
  const x2 = box.x + box.w - 52;
  drawThermo(x1, topY, botY, ty, t, false, 'dry');
  drawThermo(x2, topY, botY, ty, wetBulb === null ? t : wetBulb, wicked, 'wet');

  // the fan
  const fx = box.x + box.w / 2;
  const fy = box.y + box.h * 0.44;
  push();
  translate(fx, fy);
  rotate(fanPhase);
  stroke('#546e7a');
  strokeWeight(2);
  for (let i = 0; i < 3; i++) {
    const a = i * TWO_PI / 3;
    line(0, 0, cos(a) * 11, sin(a) * 11);
  }
  pop();
  noStroke();
  fill('#546e7a');
  circle(fx, fy, 5);
  textAlign(CENTER, TOP);
  textSize(9);
  text(airSelect.value(), fx, fy + 13);

  // readouts
  noStroke();
  textAlign(CENTER, TOP);
  fill('#c62828');
  textSize(narrow ? 12 : 13);
  text(nf(t, 1, 1) + ' C', x1, botY + 20);
  fill(wicked ? '#1565c0' : '#b0bec5');
  text(wetBulb === null ? '--' : nf(wetBulb, 1, 1) + ' C', x2, botY + 20);

  if (!wicked) {
    fill('#e65100');
    textAlign(CENTER, TOP);
    textSize(9);
    text(wrapText('Press "Wet the wick" to start.', box.w - 16, 9),
         box.x + box.w / 2, box.y + box.h - 16);
  }
}

function drawThermo(cx, topY, botY, ty, v, wet, tag) {
  const w = 12;
  stroke('#90a4ae');
  strokeWeight(1);
  fill('#fafafa');
  rect(cx - w / 2, topY, w, botY - topY, 6);
  circle(cx, botY + 8, 18);

  // the wick, drawn as a damp sleeve around the bulb
  if (tag === 'wet') {
    noStroke();
    fill(wet ? 'rgba(2,119,189,0.35)' : 'rgba(176,190,197,0.45)');
    rect(cx - w / 2 - 4, botY - 26, w + 8, 30, 4);
    circle(cx, botY + 8, 24);
    fill(wet ? '#0277bd' : '#90a4ae');
    textAlign(CENTER, BOTTOM);
    textSize(8);
    text(wet ? 'wet wick' : 'dry wick', cx, botY - 28);
  }

  noStroke();
  fill(tag === 'wet' ? '#1565c0' : '#c62828');
  const y = constrain(ty(v), topY + 2, botY);
  rect(cx - 3, y, 6, botY - y);
  circle(cx, botY + 8, 13);

  stroke('#b0bec5');
  strokeWeight(1);
  for (let s = 0; s <= 45; s += 5) {
    line(cx + w / 2, ty(s), cx + w / 2 + 4, ty(s));
    noStroke();
    fill('#90a4ae');
    textAlign(LEFT, CENTER);
    textSize(7);
    text(s, cx + w / 2 + 6, ty(s));
    stroke('#b0bec5');
  }
  noStroke();
  fill('#455a64');
  textAlign(CENTER, BOTTOM);
  textSize(9);
  text(tag === 'wet' ? 'wet bulb' : 'dry bulb', cx, topY - 2);
}

function drawTable(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(10);
  text('Relative humidity, per cent', box.x + 8, box.y + 6);

  const t = dryNow();
  const dep = wetBulb === null ? null : max(0, t - wetBulb);
  const rowI = round(constrain(t, 0, 45) / 5);
  const colI = dep === null ? -1 : round(constrain(dep, 0, DEPRESSIONS - 1));

  const gx = box.x + 34;
  const gy = box.y + 34;
  const cw = (box.w - 42) / DEPRESSIONS;
  const ch = min(20, (box.h - 52) / DRY_ROWS.length);

  textAlign(CENTER, CENTER);
  textSize(8);
  fill('#78909c');
  for (let d = 0; d < DEPRESSIONS; d++) text(d, gx + cw * (d + 0.5), gy - 9);
  textAlign(RIGHT, CENTER);
  for (let r = 0; r < DRY_ROWS.length; r++) text(DRY_ROWS[r], gx - 4, gy + ch * (r + 0.5));
  textAlign(LEFT, TOP);
  fill('#90a4ae');
  textSize(8);
  text('dry bulb', box.x + 4, gy - 18);
  textAlign(RIGHT, TOP);
  text('depression, deg C', box.x + box.w - 8, gy - 18);

  for (let r = 0; r < DRY_ROWS.length; r++) {
    for (let d = 0; d < DEPRESSIONS; d++) {
      const v = table[r][d];
      const hit = r === rowI && d === colI;
      const inRow = r === rowI, inCol = d === colI;
      noStroke();
      fill(hit ? '#1565c0' : (inRow || inCol ? '#e3f2fd' : (v === null ? '#fafafa' : 'white')));
      rect(gx + cw * d, gy + ch * r, cw - 1, ch - 1);
      fill(hit ? 'white' : (v === null ? '#cfd8dc' : '#37474f'));
      textAlign(CENTER, CENTER);
      textSize(cw > 22 ? 8 : 7);
      text(v === null ? '-' : nf(v, 1, 0), gx + cw * (d + 0.5), gy + ch * (r + 0.5));
    }
  }

  noStroke();
  fill('#78909c');
  textAlign(LEFT, TOP);
  textSize(8);
  text('Rows are the dry bulb. Columns are how many degrees the wet bulb sits below it.',
       box.x + 8, box.y + box.h - 14);
}

function drawPanel(box, narrow) {
  const t = dryNow();
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  const inner = box.w - 20;
  const z = narrow ? 10 : 11;
  let y = box.y + 8;

  if (!wicked) {
    fill('#546e7a');
    textAlign(LEFT, TOP);
    textSize(z + 1);
    text(wrapText('Both thermometers read the same until one of them is wet. Press "Wet ' +
                  'the wick" and watch what evaporation does.', inner, z + 1),
         box.x + 10, y);
    return;
  }

  const dep = max(0, t - wetBulb);
  const rhRead = rhFromDepression(t, dep);
  const shown = rhRead === null ? rhTrue() : rhRead;
  const td = dewPoint(t, shown);

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(z);
  text('depression', box.x + 10, y);
  y += z + 3;
  fill('#0277bd');
  textSize(narrow ? 19 : 23);
  text(nf(dep, 1, 1) + ' deg C', box.x + 10, y);
  y += narrow ? 25 : 29;

  fill('#546e7a');
  textSize(z);
  text('relative humidity, from the table', box.x + 10, y);
  y += z + 3;
  fill('#c62828');
  textSize(narrow ? 19 : 23);
  text(nf(shown, 1, 0) + ' %', box.x + 10, y);
  y += narrow ? 25 : 29;

  fill('#546e7a');
  textSize(z);
  text('dew point', box.x + 10, y);
  y += z + 3;
  fill('#1565c0');
  textSize(narrow ? 16 : 19);
  text(nf(td, 1, 1) + ' C', box.x + 10, y);
  y += narrow ? 22 : 26;

  // the interpretation, and the null result that proves the mechanism
  let msg, col;
  if (rhTrue() >= 99.5) {
    msg = 'No evaporation is possible into saturated air, so there is no cooling and no ' +
          'depression. Both thermometers agree.';
    col = '#b71c1c';
  } else if (dep < 1.5) {
    msg = 'A small depression means damp air. Evaporation from the wick is slow.';
    col = '#00695c';
  } else if (dep < 6) {
    msg = 'A moderate depression. Ordinary conditions.';
    col = '#00695c';
  } else {
    msg = 'Depression of ' + nf(dep, 1, 0) + ' degrees means dry air. Evaporation from ' +
          'the wick is rapid.';
    col = '#e65100';
  }
  fill(col);
  textSize(z);
  text(wrapText(msg, inner, z), box.x + 10, y);
  y += wrapText(msg, inner, z).split('\n').length * (z + 3) + 6;

  // one extra block at most, or the panel outgrows its box on a narrow canvas
  if (crossCheck) {
    const bme = rhTrue() + 4.5;
    fill('#4527a0');
    textSize(z);
    text(wrapText('BME280 reads ' + nf(bme, 1, 0) + ' %. This psychrometer reads ' +
                  nf(shown, 1, 0) + ' %. Which do you trust? An aspirated psychrometer is a ' +
                  'legitimate field reference: it is traceable to two ordinary ' +
                  'thermometers. The BME280 is traceable to a factory calibration you ' +
                  'cannot inspect - and this one is not aspirated.', inner, z),
         box.x + 10, y);
  } else if (airSelect.value() === 'Still air') {
    fill('#b71c1c');
    textSize(z - 1);
    text(wrapText('In still air the wick sits in its own damp layer and never reaches the ' +
                  'true wet bulb. This reads high, and slowly. Assmann added a fan in 1887 ' +
                  'for exactly this reason.', inner, z - 1), box.x + 10, y);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Dry bulb:  ' + nf(dryNow(), 1, 1) + ' C', 10, drawHeight + 22);
  text('True humidity:  ' + rhTrue() + ' %', 10, drawHeight + 58);
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
