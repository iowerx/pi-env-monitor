// Early Warning Race - P Wave Versus Alert MicroSim
// CANVAS_HEIGHT: 634
// Bloom Level: Evaluate (L5) - the learner assesses how much warning each city
// gets and justifies why a blind zone exists that no system can remove.
// Three things race outward from one rupture: the P wave at 6 km/s, the S wave at
// 3.5 km/s, and a radio alert that is effectively instantaneous once a station has
// detected the P wave and the system has spent its processing time. The blind zone
// is drawn rather than described, because it is the honest limit of the technology.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 476;
let controlHeight = 158;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 700;

const VP = 6.0;        // km/s
const VS = 3.5;        // km/s

const DENSITY = {
  'Sparse': { near: 35, n: 5, note: 'Regional network. The nearest instrument is far.' },
  'Moderate': { near: 20, n: 9, note: 'Typical national network.' },
  'Dense': { near: 8, n: 16, note: 'MEMS sensors in phones and buildings, as well as observatory stations.' }
};

const CITIES = [
  { name: 'Nearport', d: 20, ang: -0.55 },
  { name: 'Midvale', d: 50, ang: 0.75 },
  { name: 'Farhaven', d: 100, ang: -1.9 },
  { name: 'Distant City', d: 200, ang: 2.5 }
];

// What a given number of seconds actually buys.
const ACTIONS = [
  { t: 0,   txt: 'Nothing. The shaking arrives first.', s: 'Nothing. Shaking first.' },
  { t: 0.1, txt: 'Under three seconds. Enough to flinch, not to act.', s: 'Barely time to flinch.' },
  { t: 3,   txt: 'Drop, cover and hold on. Get under a table.', s: 'Drop, cover, hold on.' },
  { t: 10,  txt: 'Stop the trains. Close the gas valves.', s: 'Stop trains. Close gas valves.' },
  { t: 25,  txt: 'Halt surgery. Stop the lifts at the nearest floor.', s: 'Halt surgery. Stop lifts.' },
  { t: 50,  txt: 'Shut down the factory line and hazardous processes.', s: 'Shut down the factory line.' }
];

// ---- state ----
let density = 'Moderate';
let delaySec = 3;
let depth = 10;
let tNow = 0;
let running = true;
let scrub = null;              // set while the learner drags the timeline
let chipHits = [];
let densSelect, timeSlider, delaySlider, depthSlider;
let mapBox = { x: 0, y: 0, w: 10, h: 10 };
let panelBox = { x: 0, y: 0, w: 10, h: 10 };
let stations = [];

const DOM_KM = 260;            // half-width of the map, kilometres

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  densSelect = createSelect();
  for (const k of Object.keys(DENSITY)) densSelect.option(k);
  densSelect.elt.value = density;
  densSelect.changed(() => { density = densSelect.value(); buildStations(); });
  densSelect.parent(document.querySelector('main'));

  timeSlider = createSlider(0, 900, 0, 1);      // tenths of a second
  delaySlider = createSlider(1, 10, 3, 1);
  depthSlider = createSlider(5, 120, 10, 5);
  for (const s of [timeSlider, delaySlider, depthSlider]) {
    s.parent(document.querySelector('main'));
    s.style('width', '150px');
  }
  timeSlider.input(() => { scrub = timeSlider.value() / 10; running = false; });

  buildStations();
  layoutControls();
  describe('A plan-view map on which a P wave, an S wave and a radio alert race ' +
           'outward from an earthquake, with the warning time and the blind zone ' +
           'computed for four cities.');
}

function buildStations() {
  const d = DENSITY[density];
  stations = [];
  for (let i = 0; i < d.n; i++) {
    const a = i * 2.399963;                    // golden angle, an even scatter
    const r = d.near * (1 + 1.7 * Math.sqrt(i / Math.max(1, d.n - 1)));
    stations.push({ x: r * Math.cos(a), y: r * Math.sin(a), d: r });
  }
  stations.sort((a, b) => a.d - b.d);
}

// ---- timing --------------------------------------------------------------

function slantTo(d) { return Math.sqrt(d * d + depth * depth); }
function tP(d) { return slantTo(d) / VP; }
function tS(d) { return slantTo(d) / VS; }
function tDetect() { return tP(stations[0].d); }
function tAlert() { return tDetect() + delaySec; }

// Epicentral radius inside which the S wave beats the alert.
function blindRadius() {
  const v = Math.pow(VS * tAlert(), 2) - depth * depth;
  return v > 0 ? Math.sqrt(v) : 0;
}

function warningFor(c) { return tS(c.d) - tAlert(); }

function actionFor(w) {
  let best = ACTIONS[0];
  for (const a of ACTIONS) if (w >= a.t && a.t > 0) best = a;
  if (w <= 0) return ACTIONS[0];
  return best;
}

function totalTime() { return Math.max(70, tS(CITIES[3].d) + 8); }

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 30, banner = 26;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    const mh = Math.min(214, w);
    const mw = mh;
    mapBox = { x: margin + (w - mw) / 2, y: top + banner, w: mw, h: mh };
    panelBox = { x: margin, y: top + banner + mh + 5, w: w,
                 h: drawHeight - (top + banner + mh + 5) - 5 };
  } else {
    const pw = 286;
    const availW = canvasWidth - pw - 3 * margin;
    const availH = drawHeight - top - banner - margin;
    const side = Math.min(availW, availH);
    mapBox = { x: margin + (availW - side) / 2,
               y: top + banner + (availH - side) / 2, w: side, h: side };
    panelBox = { x: canvasWidth - margin - pw, y: top + banner, w: pw, h: availH };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  timeSlider.position(margin + 92, y0);
  delaySlider.position(margin + 92, y0 + 26);
  depthSlider.position(margin + 92, y0 + 52);
  densSelect.position(margin + 92, y0 + 78);
  densSelect.style('width', '110px');
}

function px(x) { return mapBox.x + (x + DOM_KM) / (2 * DOM_KM) * mapBox.w; }
function py(y) { return mapBox.y + (DOM_KM - y) / (2 * DOM_KM) * mapBox.h; }
function kmToPx(km) { return km / (2 * DOM_KM) * mapBox.w; }

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  delaySec = delaySlider.value();
  depth = depthSlider.value();
  if (running) {
    tNow += 1 / 60 * 3;                        // 3x real time, so a run is watchable
    if (tNow > totalTime()) tNow = totalTime();
    timeSlider.value(Math.round(tNow * 10));
  } else if (scrub !== null) {
    tNow = scrub;
  }

  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(22);
  text('Early Warning Race', canvasWidth / 2, 2);

  drawBanner();
  drawMap();
  drawPanel();
  drawControlRegion();
}

function drawBanner() {
  const y = 28;
  noStroke(); fill('#7b1fa2');
  rect(margin, y, canvasWidth - 2 * margin, 24, 4);
  fill('#ffffff'); textAlign(CENTER, CENTER); textSize(10.8);
  const full = 'The earthquake has already happened. This is not prediction - ' +
               'the alert is simply faster than the shaking.';
  const shortText = 'Not prediction. The alert is simply faster than the shaking.';
  textSize(10.8);
  text(textWidth(full) < canvasWidth - 2 * margin - 14 ? full : shortText,
       canvasWidth / 2, y + 13);
}

function drawMap() {
  const b = mapBox;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y, b.w, b.h);
  drawingContext.clip();

  noStroke(); fill('#eef4f9');
  rect(b.x, b.y, b.w, b.h);

  // distance rings every 50 km
  stroke('#dbe4ec'); strokeWeight(1); noFill();
  for (let r = 50; r <= 250; r += 50) circle(px(0), py(0), kmToPx(r) * 2);
  noStroke(); fill('#9fb0bf'); textAlign(CENTER, CENTER); textSize(8.5);
  for (let r = 50; r <= 250; r += 50) {
    // fan the range labels so they do not stack along one radius
    const a = 2.1 + (r / 50) * 0.30;
    text(r + ' km', px(r * Math.cos(a)), py(r * Math.sin(a)));
  }

  const ta = tAlert();
  const bz = blindRadius();

  // the alert, which fills the whole map the instant it is issued
  if (tNow >= ta) {
    noStroke(); fill(106, 27, 154, 30);
    rect(b.x, b.y, b.w, b.h);
    const grow = (tNow - ta) / 0.5;
    if (grow < 1) {
      stroke('#6a1b9a'); strokeWeight(2.5); noFill();
      circle(px(0), py(0), kmToPx(DOM_KM * 2.2) * grow);
    }
  }

  // S wave then P wave, so the P ring stays on top
  const rS = VS * tNow, rP = VP * tNow;
  if (rS > 0) {
    noStroke(); fill(198, 40, 40, 34);
    circle(px(0), py(0), kmToPx(rS) * 2);
    stroke('#c62828'); strokeWeight(2.5); noFill();
    circle(px(0), py(0), kmToPx(rS) * 2);
  }
  if (rP > 0) {
    stroke('#1565c0'); strokeWeight(2.5); noFill();
    circle(px(0), py(0), kmToPx(rP) * 2);
  }

  // the blind zone goes on top of the waves, or the S wave fill hides it
  if (bz > 0) {
    noStroke(); fill(198, 40, 40, 30);
    circle(px(0), py(0), kmToPx(bz) * 2);
    stroke('#7f0000'); strokeWeight(1.8); drawingContext.setLineDash([6, 4]);
    noFill(); circle(px(0), py(0), kmToPx(bz) * 2);
    drawingContext.setLineDash([]);
    noStroke();
    if (kmToPx(bz) > 30) {
      textSize(9.5);
      const bl = 'blind zone ' + bz.toFixed(0) + ' km';
      const bw = textWidth(bl) + 8;
      fill(255, 225);
      rect(px(0) - bw / 2, py(0) + kmToPx(bz) - 15, bw, 13, 2);
      fill('#7f0000'); textAlign(CENTER, TOP);
      text(bl, px(0), py(0) + kmToPx(bz) - 15);
    }
  }

  drawStations();
  drawCities();

  // epicentre
  noStroke(); fill('#000');
  circle(px(0), py(0), 9);
  stroke('#000'); strokeWeight(1.5); noFill();
  circle(px(0), py(0), 16);
  noStroke();

  // legend
  const lx = b.x + 8, ly = b.y + b.h - 67;
  noStroke(); fill(255, 228);
  rect(lx, ly, 122, 59, 3);
  const rows = [['#1565c0', 'P wave 6.0 km/s'], ['#c62828', 'S wave 3.5 km/s'],
                ['#6a1b9a', 'alert (radio)'], ['#0d47a1', 'ringed = nearest station']];
  for (let i = 0; i < rows.length; i++) {
    stroke(rows[i][0]); strokeWeight(2.5);
    line(lx + 6, ly + 11 + i * 13, lx + 20, ly + 11 + i * 13);
    noStroke(); fill('#33475b'); textAlign(LEFT, CENTER); textSize(8.5);
    text(rows[i][1], lx + 24, ly + 11 + i * 13);
  }

  // stage caption
  let stage = 'Rupture begins';
  if (tNow >= ta) stage = 'Alert issued and delivered';
  else if (tNow >= tDetect()) stage = 'P wave detected. System processing: ' +
      (ta - tNow).toFixed(1) + ' s to the alert';
  else if (tNow > 0) stage = 'Waves travelling. Nothing detected yet';
  noStroke(); fill(255, 228);
  textSize(10);
  const sw = textWidth(stage) + 14;
  rect(b.x + b.w - sw - 6, b.y + 8, sw, 18, 3);
  fill(tNow >= ta ? '#6a1b9a' : '#0d2b45'); textAlign(CENTER, CENTER);
  text(stage, b.x + b.w - sw / 2 - 6, b.y + 17);

  noStroke(); fill('#37474f'); textAlign(RIGHT, BOTTOM); textSize(12); textStyle(BOLD);
  text('t = ' + tNow.toFixed(1) + ' s', b.x + b.w - 8, b.y + b.h - 6);
  textStyle(NORMAL);

  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h);
  noStroke();
}

function drawStations() {
  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const on = tNow >= tP(s.d);
    const k = i === 0 ? 7 : 4.5;
    if (i === 0) {
      noFill(); stroke(on ? '#0d47a1' : '#78909c'); strokeWeight(1.4);
      circle(px(s.x), py(s.y), 18);
    }
    noStroke(); fill(on ? '#1565c0' : '#b0bec5');
    triangle(px(s.x), py(s.y) - k - 1, px(s.x) - k, py(s.y) + k * 0.65,
             px(s.x) + k, py(s.y) + k * 0.65);
  }
}

function drawCities() {
  const ta = tAlert();
  for (const c of CITIES) {
    const cx = px(c.d * Math.cos(c.ang)), cy = py(c.d * Math.sin(c.ang));
    const w = warningFor(c);
    const alerted = tNow >= ta;
    const shaken = tNow >= tS(c.d);
    const good = w >= 3;
    const marginal = w > 0 && w < 3;
    const col = good ? '#2e7d32' : (marginal ? '#ef6c00' : '#c62828');
    noStroke(); fill(shaken ? col : (alerted && good ? '#66bb6a' : '#90a4ae'));
    stroke('#263238'); strokeWeight(1.2);
    circle(cx, cy, 11);
    noStroke();
    const lab = c.name + '  ' + c.d + ' km';
    textSize(9); textAlign(LEFT, CENTER);
    const tw = textWidth(lab) + 7;
    const right = cx + 8 + tw < mapBox.x + mapBox.w;
    fill(255, 220);
    rect(right ? cx + 7 : cx - 7 - tw, cy - 7, tw, 14, 2);
    fill(good ? '#1b5e20' : (marginal ? '#e65100' : '#b71c1c'));
    textAlign(right ? LEFT : RIGHT, CENTER);
    text(lab, right ? cx + 10 : cx - 10, cy);
  }
}

// ---- panel ---------------------------------------------------------------

function drawPanel() {
  const b = panelBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 9, W = b.w - 18;
  let y = b.y + 6;
  const ta = tAlert();
  const bz = blindRadius();

  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.8);
  text('P detected at ' + tDetect().toFixed(1) + ' s  (nearest station ' +
       stations[0].d.toFixed(0) + ' km)', L, y);
  y += 12;
  fill('#6a1b9a');
  text('Processing ' + delaySec + ' s, so the alert goes out at ' + ta.toFixed(1) + ' s',
       L, y);
  y += 12;
  fill('#b71c1c');
  text('Blind zone: everything inside ' + bz.toFixed(0) + ' km', L, y);
  y += 15;

  const cols = isNarrow() ? 2 : 1;
  const rows = Math.ceil(CITIES.length / cols);
  const noteH = 26;
  const rowH = Math.min(80, (b.y + b.h - y - noteH) / rows);
  const cellW = W / cols - (cols > 1 ? 4 : 0);
  const y0Cards = y;
  for (let ci = 0; ci < CITIES.length; ci++) {
    const c = CITIES[ci];
    const cx0 = L + (ci % cols) * (W / cols);
    y = y0Cards + Math.floor(ci / cols) * rowH;
    const w = warningFor(c);
    const good = w >= 3;
    const marginal = w > 0 && w < 3;
    noStroke(); fill(good ? '#f1f8f2' : (marginal ? '#fff8e1' : '#fdeeee'));
    rect(cx0, y, cellW, rowH - 4, 3);
    stroke(good ? '#a5d6a7' : (marginal ? '#ffe082' : '#ef9a9a'));
    strokeWeight(1); noFill();
    rect(cx0, y, cellW, rowH - 4, 3);
    noStroke();

    fill('#0d2b45'); textAlign(LEFT, TOP); textSize(10.5); textStyle(BOLD);
    text(c.name + ', ' + c.d + ' km', cx0 + 6, y + 4);
    textStyle(NORMAL);
    const wtxt = w > 0 ? w.toFixed(1) + ' s warning' : 'no warning';
    fill(good ? '#1b5e20' : (marginal ? '#e65100' : '#b71c1c'));
    textSize(cols > 1 ? 11 : 12); textStyle(BOLD);
    if (cols > 1) { textAlign(LEFT, TOP); text(wtxt, cx0 + 6, y + 17); }
    else { textAlign(RIGHT, TOP); text(wtxt, cx0 + cellW - 6, y + 3); }
    textStyle(NORMAL);

    fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9);
    text('alert ' + ta.toFixed(1) + ' s   S wave ' + tS(c.d).toFixed(1) + ' s',
         cx0 + 6, y + (cols > 1 ? 31 : 18));
    fill(good ? '#33475b' : (marginal ? '#e65100' : '#b71c1c')); textSize(9.2);
    const act = actionFor(w);
    para(cx0 + 6, y + (cols > 1 ? 42 : 29), cellW - 12,
         cols > 1 ? act.s : act.txt, 10.5, 9.2);
  }
  y = y0Cards + rows * rowH;

  if (CITIES[0] && warningFor(CITIES[0]) <= 0) {
    fill('#b71c1c'); textAlign(LEFT, TOP); textSize(9.6);
    para(L, y, W, 'The place that needs warning most gets the least. This is the ' +
         'fundamental limit of early warning.', 11, 9.6);
  } else {
    fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.6);
    para(L, y, W, DENSITY[density].note, 11, 9.6);
  }
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 8;
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
  text('Timeline', margin, y0 + 10);
  text('Processing', margin, y0 + 36);
  text('Depth', margin, y0 + 62);
  text('Stations', margin, y0 + 88);

  fill('#33475b'); textSize(10.5);
  text(tNow.toFixed(1) + ' s', margin + 250, y0 + 10);
  text(delaySec + ' s', margin + 250, y0 + 36);
  text(depth + ' km', margin + 250, y0 + 62);
  if (!isNarrow()) {
    fill('#5a6a78'); textSize(10);
    text('this is why the blind zone exists', margin + 300, y0 + 36);
    text(DENSITY[density].n + ' stations, nearest at ' + DENSITY[density].near + ' km',
         margin + 215, y0 + 88);
  }

  chipHits = [];
  const cy = isNarrow() ? y0 + 108 : y0 + 110;
  let x = margin;
  x = chip(x, cy, running ? 'Pause' : 'Play', !running) + 6;
  chip(x, cy, 'Replay from t = 0', false);
}

function chip(x, y, label, on) {
  textSize(11); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 18;
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
      if (c.label === 'Replay from t = 0') { tNow = 0; scrub = null; running = true; timeSlider.value(0); }
      else { running = !running; scrub = running ? null : tNow; }
      return false;
    }
  }
  return true;
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
  let line = '';
  for (const w of words) {
    const trial = line.length ? line + ' ' + w : w;
    if (textWidth(trial) > maxW && line.length) { out.push(line); line = w; }
    else line = trial;
  }
  out.push(line);
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
