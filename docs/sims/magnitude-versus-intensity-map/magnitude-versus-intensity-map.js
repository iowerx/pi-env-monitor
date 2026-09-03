// Magnitude Versus Intensity Map MicroSim
// CANVAS_HEIGHT: 660
// Bloom Level: Analyze (L4) - the learner differentiates magnitude from intensity
// by holding one magnitude fixed while a whole field of intensities appears from it.
// Intensity comes from the Allen, Wald and Worden (2012) hypocentral-distance
// intensity prediction equation, plus a site term per town. The magnitude readout
// is pinned to the header and never changes with position, which is the entire
// design argument: one earthquake, one magnitude, many intensities.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 508;
let controlHeight = 152;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 700;

// ---- Allen, Wald & Worden (2012), Rhyp form, active crustal regions ----
const C0 = 2.085, C1 = 1.428, C2 = -1.402, C3 = 0.078;
const M1 = -0.209, M2 = 2.042;

function mmiAt(M, rhyp) {
  const rm = M1 + M2 * Math.exp(M - 5);
  let v = C0 + C1 * M + C2 * Math.log(Math.sqrt(rhyp * rhyp + rm * rm));
  if (rhyp > 50) v += C3 * Math.log(rhyp / 50);
  return v;
}

// Site terms in intensity units. Soft ground amplifies; rock does not.
const SITE = { 'Bedrock': -0.3, 'Firm soil': 0.0, 'Soft sediment': 1.3, 'Artificial fill': 1.8 };
const SITE_ORDER = ['Bedrock', 'Firm soil', 'Soft sediment', 'Artificial fill'];

// USGS ShakeMap intensity colours
const MMI_COL = ['#ffffff', '#ffffff', '#bfccff', '#bfccff', '#a0e6ff', '#80ffff',
                 '#7aff93', '#ffff00', '#ffc800', '#ff9100', '#ff0000', '#c00000', '#8b0000'];
const MMI_ROMAN = ['I', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const MMI_WORD = ['Not felt', 'Not felt', 'Weak', 'Weak', 'Light', 'Moderate', 'Strong',
                  'Very strong', 'Severe', 'Violent', 'Extreme', 'Catastrophic', 'Catastrophic'];
const MMI_EFFECT = [
  'Detected only by instruments', 'Detected only by instruments',
  'Felt by a few people indoors; like a passing truck',
  'Felt by a few people indoors; like a passing truck',
  'Felt indoors by many; dishes rattle',
  'Felt by nearly everyone; some objects overturned',
  'Felt by all; some heavy furniture moves; slight damage',
  'Damage to poorly built structures',
  'Considerable damage to ordinary buildings',
  'Well-designed structures damaged; buildings shifted',
  'Most masonry destroyed; ground cracks',
  'Few structures remain standing; ground waves visible',
  'Few structures remain standing; ground waves visible'];

// ---- map domain, kilometres, origin at map centre ----
const DOM_X = 190, DOM_Y = 135;

const TOWNS = [
  { name: 'Old Town',        x: -30,  y: 26,   site: 'Firm soil' },
  { name: 'Granite Ridge',   x: 24,   y: -20,  site: 'Bedrock' },
  { name: 'Riverside',       x: -40,  y: -22,  site: 'Soft sediment' },
  { name: 'Bayfill Harbour', x: 55,   y: 26,   site: 'Artificial fill' },
  { name: 'Hillcrest',       x: -88,  y: 40,   site: 'Bedrock' },
  { name: 'Marsh End',       x: 128,  y: -58,  site: 'Soft sediment' }
];

const QUIZ = [
  { mmi: 4,  txt: 'Dishes rattled and hanging pictures swung. Felt indoors by many.' },
  { mmi: 6,  txt: 'Everyone felt it. A bookcase walked across the floor and plaster cracked.' },
  { mmi: 8,  txt: 'Chimneys fell. Ordinary brick buildings are badly damaged.' },
  { mmi: 3,  txt: 'A few people indoors noticed it. It felt like a heavy truck going past.' },
  { mmi: 5,  txt: 'Nearly everyone felt it. Some small objects were knocked over.' },
  { mmi: 7,  txt: 'Poorly built structures are damaged. Everyone ran outdoors.' },
  { mmi: 9,  txt: 'Well-designed buildings are damaged and some were shifted off their foundations.' }
];

// ---- state ----
let mag = 6.5;
let depth = 10;
let epi = { x: 0, y: 0 };
let selected = 0;
let magRef = 6.0;
let quizMode = false;
let quizIdx = 0, quizGuess = null, quizDone = false;
let draggingEpi = false;
let chipHits = [], townHits = [], numHits = [];
let magSlider, depthSlider, siteSelect;
let mapBox = { x: 0, y: 0, w: 10, h: 10 };
let panelBox = { x: 0, y: 0, w: 10, h: 10 };
let bandCache = null;

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  magSlider = createSlider(4.0, 9.0, 6.5, 0.1);
  depthSlider = createSlider(5, 300, 10, 5);
  for (const s of [magSlider, depthSlider]) {
    s.parent(document.querySelector('main'));
    s.style('width', '150px');
  }
  siteSelect = createSelect();
  for (const k of SITE_ORDER) siteSelect.option(k);
  siteSelect.elt.value = TOWNS[0].site;
  siteSelect.changed(() => { TOWNS[selected].site = siteSelect.value(); });
  siteSelect.parent(document.querySelector('main'));

  layoutControls();
  describe('A plan-view intensity map. One magnitude produces a field of different ' +
           'Modified Mercalli intensities, and towns on soft ground shake harder ' +
           'than nearer towns on bedrock.');
}

// ---- model ---------------------------------------------------------------

function hypo(x, y) {
  const d = Math.hypot(x - epi.x, y - epi.y);
  return Math.sqrt(d * d + depth * depth);
}

function fieldMmi(x, y) { return mmiAt(mag, hypo(x, y)); }

function townMmi(t) { return fieldMmi(t.x, t.y) + SITE[t.site]; }

function bandOf(v) { return constrain(Math.round(v), 1, 12); }

function energyRatio() { return Math.pow(10, 1.5 * (mag - magRef)); }

function ratioStr(r) {
  if (r >= 1000) return r.toExponential(1).replace('e+', ' x 10^');
  if (r >= 10) return r.toFixed(0);
  if (r >= 1) return r.toFixed(1);
  return r.toFixed(3);
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 30, banner = 34;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    let mh = Math.min(200, w / (DOM_X / DOM_Y));
    const mw = mh * (DOM_X / DOM_Y);
    mapBox = { x: margin + (w - mw) / 2, y: top + banner, w: mw, h: mh };
    panelBox = { x: margin, y: top + banner + mh + 5, w: w,
                 h: drawHeight - (top + banner + mh + 5) - 5 };
  } else {
    const pw = 268;
    const availW = canvasWidth - pw - 3 * margin;
    const availH = drawHeight - top - banner - margin;
    let w = availW, h = w / (DOM_X / DOM_Y);
    if (h > availH) { h = availH; w = h * (DOM_X / DOM_Y); }
    mapBox = { x: margin + (availW - w) / 2,
               y: top + banner + (availH - h) / 2, w: w, h: h };
    panelBox = { x: canvasWidth - margin - pw, y: top + banner, w: pw, h: availH };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  magSlider.position(margin + 84, y0);
  depthSlider.position(margin + 84, y0 + 26);
  if (isNarrow()) siteSelect.position(margin + 84, y0 + 52);
  else siteSelect.position(margin + 380, y0 + 52);
  siteSelect.style('width', '124px');
}

function sx(x) { return mapBox.x + (x + DOM_X) / (2 * DOM_X) * mapBox.w; }
function sy(y) { return mapBox.y + (DOM_Y - y) / (2 * DOM_Y) * mapBox.h; }
function mxOf(px) { return (px - mapBox.x) / mapBox.w * 2 * DOM_X - DOM_X; }
function myOf(py) { return DOM_Y - (py - mapBox.y) / mapBox.h * 2 * DOM_Y; }

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  mag = magSlider.value();
  depth = depthSlider.value();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(22);
  text('Magnitude Versus Intensity', canvasWidth / 2, 2);

  drawBanner();
  drawMap();
  drawPanel();
  drawControlRegion();
}

function drawBanner() {
  const y = 30;
  noStroke(); fill('#0d2b45');
  rect(margin, y, canvasWidth - 2 * margin, 30, 4);
  fill('#ffffff'); textAlign(LEFT, CENTER); textSize(15); textStyle(BOLD);
  const head = 'Magnitude ' + mag.toFixed(1);
  text(head, margin + 10, y + 15);
  const w1 = 10 + textWidth(head) + 12;
  textStyle(NORMAL); textSize(10.5); fill('#b3c7de');
  const avail = canvasWidth - 2 * margin - w1 - 10;
  const msg = 'one value for this earthquake. Magnitude describes the earthquake. ' +
              'Intensity describes a place.';
  const msg2 = 'one value for this earthquake.';
  const msg3 = 'one value everywhere.';
  let use = msg;
  if (textWidth(use) > avail) use = msg2;
  if (textWidth(use) > avail) use = msg3;
  if (textWidth(use) > avail) use = '';
  text(use, margin + w1, y + 15);
}

function drawMap() {
  const b = mapBox;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y, b.w, b.h);
  drawingContext.clip();

  // intensity field, banded by whole Mercalli step
  const step = Math.max(3, Math.floor(b.w / 150));
  noStroke();
  for (let px = b.x; px < b.x + b.w; px += step) {
    for (let py = b.y; py < b.y + b.h; py += step) {
      const v = fieldMmi(mxOf(px + step / 2), myOf(py + step / 2));
      fill(MMI_COL[bandOf(v)]);
      rect(px, py, step + 1, step + 1);
    }
  }
  // band boundaries, so the contours read as contours
  stroke('#78909c'); strokeWeight(1); noFill();
  for (let lev = 2; lev <= 11; lev++) {
    const r = radiusForBand(lev - 0.5);
    if (r === null) continue;
    const rx = r / (2 * DOM_X) * b.w * 2, ry = r / (2 * DOM_Y) * b.h * 2;
    ellipse(sx(epi.x), sy(epi.y), rx, ry);
  }
  // Roman numeral labels along a diagonal from the epicentre
  noStroke(); textAlign(CENTER, CENTER); textSize(10);
  const pxPerKm = b.w / (2 * DOM_X);
  for (let lev = 2; lev <= 11; lev++) {
    const r = radiusForBand(lev - 0.5);
    if (r === null) continue;
    if (r * pxPerKm < 20) continue;          // too close in to label cleanly
    // fan the labels round the rings so consecutive contours do not stack up
    const a = -Math.PI / 4 + lev * 0.46;
    const lx = sx(epi.x + r * Math.cos(a)), ly = sy(epi.y + r * Math.sin(a));
    if (lx < b.x + 12 || lx > b.x + b.w - 12 || ly < b.y + 10 || ly > b.y + b.h - 10) continue;
    fill(255, 220); rect(lx - 11, ly - 7, 22, 14, 3);
    fill('#33475b'); text(MMI_ROMAN[lev], lx, ly);
  }

  drawTowns();
  drawEpicentre();

  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h);
  noStroke();

  // scale bar
  const barPx = 50 / (2 * DOM_X) * b.w;
  const bx = b.x + 8, by = b.y + b.h - 9;
  stroke('#263238'); strokeWeight(2);
  line(bx, by, bx + barPx, by);
  line(bx, by - 3, bx, by + 3); line(bx + barPx, by - 3, bx + barPx, by + 3);
  noStroke(); fill('#263238'); textSize(9); textAlign(LEFT, BOTTOM);
  text('50 km', bx, by - 3);
  textAlign(RIGHT, BOTTOM); fill('#455a64');
  text('field drawn for firm soil', b.x + b.w - 6, by + 4);
}

// Epicentral radius at which the field reaches a given intensity, or null.
function radiusForBand(target) {
  let lo = 0, hi = 900;
  const f = (r) => mmiAt(mag, Math.sqrt(r * r + depth * depth)) - target;
  if (f(0) < 0) return null;
  if (f(hi) > 0) return null;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

function drawTowns() {
  townHits = [];
  for (let i = 0; i < TOWNS.length; i++) {
    const t = TOWNS[i];
    const px = sx(t.x), py = sy(t.y);
    const sel = i === selected;
    stroke('#263238'); strokeWeight(sel ? 2.4 : 1.2);
    fill(sel ? '#1565c0' : '#ffffff');
    square(px - 4, py - 4, 8);
    noStroke(); fill('#263238'); textAlign(LEFT, CENTER); textSize(9.5);
    const roomy = mapBox.w >= 400;
    const lab = (roomy || sel ? t.name + '  ' : '') + MMI_ROMAN[bandOf(townMmi(t))];
    const w = textWidth(lab) + 6;
    const right = px + 7 + w < mapBox.x + mapBox.w;
    fill(255, 215);
    rect(right ? px + 6 : px - 6 - w, py - 7, w, 14, 2);
    fill(sel ? '#0d47a1' : '#263238');
    textAlign(right ? LEFT : RIGHT, CENTER);
    text(lab, right ? px + 9 : px - 9, py);
    townHits.push({ x: px - 9, y: py - 9, w: 18, h: 18, i: i });
  }
}

function drawEpicentre() {
  const px = sx(epi.x), py = sy(epi.y);
  stroke('#000'); strokeWeight(2); noFill();
  circle(px, py, 15);
  line(px - 11, py, px + 11, py);
  line(px, py - 11, px, py + 11);
  noStroke(); fill('#000'); textAlign(CENTER, TOP); textSize(9);
  text(mapBox.w >= 400 ? 'epicentre (drag)' : 'epicentre', px, py + 12);
}

// ---- panel ---------------------------------------------------------------

function drawPanel() {
  const b = panelBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 9, W = b.w - 18;
  let y = b.y + 7;

  if (quizMode) { drawQuiz(L, y, W, b); return; }

  const t = TOWNS[selected];
  const v = townMmi(t);
  const band = bandOf(v);
  const dist = Math.hypot(t.x - epi.x, t.y - epi.y);

  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  text(t.name, L, y); textStyle(NORMAL);
  y += 17;
  y = prow(L, y, W, 'Distance', dist.toFixed(0) + ' km from the epicentre' +
           (isNarrow() ? ', ' + hypo(t.x, t.y).toFixed(0) + ' km to the hypocentre' : ''));
  if (!isNarrow()) {
    y = prow(L, y, W, 'Depth path', hypo(t.x, t.y).toFixed(0) + ' km to the hypocentre');
  }
  y = prow(L, y, W, 'Ground', t.site + '  (' + (SITE[t.site] >= 0 ? '+' : '') +
                    SITE[t.site].toFixed(1) + ' intensity)');

  // the intensity chip
  noStroke(); fill(MMI_COL[band]); stroke('#546e7a'); strokeWeight(1);
  rect(L, y + 2, 46, 30, 4);
  noStroke(); fill('#263238'); textAlign(CENTER, CENTER); textSize(16); textStyle(BOLD);
  text(MMI_ROMAN[band], L + 23, y + 17); textStyle(NORMAL);
  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
  text(MMI_WORD[band], L + 54, y + 4); textStyle(NORMAL);
  fill('#33475b'); textSize(10);
  para(L + 54, y + 18, W - 54, MMI_EFFECT[band], 11, 10);
  y += 36;

  // the case that breaks the distance rule
  const harder = TOWNS.filter(o => o !== t &&
      Math.hypot(o.x - epi.x, o.y - epi.y) > dist && townMmi(o) > v);
  if (harder.length) {
    fill('#b71c1c'); textSize(10); 
    y = para(L, y, W, harder[0].name + ' is further away and shakes harder. Soft ' +
             'ground amplifies. This is the 1985 Mexico City and 1989 Marina ' +
             'District case.', 11.5, 10);
    y += 3;
  }

  // every town, sorted, so one magnitude visibly makes many intensities
  fill('#5a6a78'); textSize(10); textAlign(LEFT, TOP);
  text('All towns, one magnitude:', L, y);
  y += 13;
  const sorted = TOWNS.slice().sort((a, c) => townMmi(c) - townMmi(a));
  const cols = isNarrow() ? 2 : 1;
  const cw = W / cols;
  for (let i = 0; i < sorted.length; i++) {
    const o = sorted[i];
    const cx0 = L + (i % cols) * cw;
    const cy0 = y + Math.floor(i / cols) * 14;
    const ob = bandOf(townMmi(o));
    noStroke(); fill(MMI_COL[ob]); stroke('#90a4ae'); strokeWeight(0.8);
    rect(cx0, cy0, 26, 12, 2);
    noStroke(); fill('#263238'); textAlign(CENTER, CENTER); textSize(9);
    text(MMI_ROMAN[ob], cx0 + 13, cy0 + 6);
    textAlign(LEFT, CENTER); fill(o === t ? '#0d47a1' : '#33475b'); textSize(9.5);
    text(o.name, cx0 + 31, cy0 + 6);
    textAlign(RIGHT, CENTER); fill('#8a97a4');
    text(Math.hypot(o.x - epi.x, o.y - epi.y).toFixed(0) + ' km', cx0 + cw - 4, cy0 + 6);
  }
  y += Math.ceil(sorted.length / cols) * 14;

  y += 3;
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('Energy vs M' + magRef.toFixed(1) + ': ' + ratioStr(energyRatio()) +
       ' times', L, y);
}

function prow(L, y, W, k, v) {
  textAlign(LEFT, TOP); textSize(10);
  fill('#5a6a78'); text(k, L, y);
  fill('#0d2b45'); textSize(10.5);
  const lines = wrapLines(v, W - 70, 10.5);
  for (let i = 0; i < lines.length; i++) text(lines[i], L + 70, y + i * 12);
  return y + lines.length * 12 + 2;
}

function drawQuiz(L, y, W, b) {
  numHits = [];
  const q = QUIZ[quizIdx];
  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  text('Did you feel it?', L, y); textStyle(NORMAL);
  y += 17;
  fill('#5a6a78'); textSize(10);
  y = para(L, y, W, 'Reported at ' + TOWNS[selected].name + ':', 12, 10);
  y += 2;
  fill('#0d2b45'); textSize(11);
  y = para(L, y, W, '"' + q.txt + '"', 13, 11);
  y += 6;
  fill('#5a6a78'); textSize(10);
  text('Assign a Mercalli intensity:', L, y);
  y += 15;
  const per = Math.floor(W / 30);
  for (let m = 1; m <= 10; m++) {
    const c = (m - 1) % per, r = Math.floor((m - 1) / per);
    const bx = L + c * 30, by = y + r * 26;
    const on = quizGuess === m;
    noStroke(); fill(on ? '#1565c0' : MMI_COL[m]);
    stroke('#90a4ae'); strokeWeight(1);
    rect(bx, by, 26, 22, 3);
    noStroke(); fill(on ? '#fff' : '#263238'); textAlign(CENTER, CENTER); textSize(10);
    text(MMI_ROMAN[m], bx + 13, by + 11);
    numHits.push({ x: bx, y: by, w: 26, h: 22, m: m });
  }
  y += Math.ceil(10 / per) * 26 + 6;
  if (quizDone) {
    const ok = quizGuess === q.mmi;
    textAlign(LEFT, TOP);
    fill(ok ? '#1b5e20' : '#b71c1c'); textSize(11.5); textStyle(BOLD);
    text(ok ? 'Correct' : 'Not quite', L, y); textStyle(NORMAL);
    y += 15;
    fill('#33475b'); textSize(10);
    y = para(L, y, W, 'That report is intensity ' + MMI_ROMAN[q.mmi] + ', ' +
             MMI_WORD[q.mmi].toLowerCase() + '. On the map right now, ' +
             TOWNS[selected].name + ' is at ' + MMI_ROMAN[bandOf(townMmi(TOWNS[selected]))] +
             '. Move the epicentre or the magnitude until the map agrees with the report.',
             11.5, 10);
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
  text('Magnitude', margin, y0 + 10);
  text('Depth', margin, y0 + 36);
  text('Ground at ' + (isNarrow() ? 'town' : TOWNS[selected].name),
       isNarrow() ? margin : margin + 250, y0 + 62);

  fill('#33475b'); textSize(10.5);
  text(mag.toFixed(1), margin + 244, y0 + 10);
  text(depth + ' km', margin + 244, y0 + 36);
  if (!isNarrow()) {
    fill('#5a6a78'); textSize(10);
    text(depth >= 70 ? 'Deep: lower surface intensity everywhere for the same magnitude'
                     : 'Shallow: the energy has less rock to spread through',
         margin + 300, y0 + 36);
  }

  chipHits = [];
  const cy = isNarrow() ? y0 + 84 : y0 + 88;
  let x = margin;
  x = chip(x, cy, quizMode ? 'Back to the map' : 'Did you feel it?', quizMode) + 6;
  if (quizMode) {
    x = chip(x, cy, quizDone ? 'Next report' : 'Check', false) + 6;
  } else {
    x = chip(x, cy, 'Set energy reference', false) + 6;
  }
  chip(x, cy, 'Reset', false);
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
      onChip(c.label);
      return false;
    }
  }
  if (quizMode) {
    for (const n of numHits) {
      if (mouseX >= n.x && mouseX <= n.x + n.w && mouseY >= n.y && mouseY <= n.y + n.h) {
        if (!quizDone) quizGuess = n.m;
        return false;
      }
    }
  }
  for (const t of townHits) {
    if (mouseX >= t.x && mouseX <= t.x + t.w && mouseY >= t.y && mouseY <= t.y + t.h) {
      selected = t.i;
      siteSelect.elt.value = TOWNS[selected].site;
      return false;
    }
  }
  if (inMap(mouseX, mouseY)) {
    draggingEpi = true;
    setEpi(mouseX, mouseY);
    return false;
  }
  return true;
}

function mouseDragged() {
  if (draggingEpi) { setEpi(mouseX, mouseY); return false; }
  return true;
}

function mouseReleased() { draggingEpi = false; return true; }

function onChip(label) {
  if (label === 'Did you feel it?') {
    quizMode = true; quizGuess = null; quizDone = false;
  } else if (label === 'Back to the map') {
    quizMode = false;
  } else if (label === 'Check') {
    if (quizGuess !== null) quizDone = true;
  } else if (label === 'Next report') {
    quizIdx = (quizIdx + 1) % QUIZ.length;
    selected = (selected + 1) % TOWNS.length;
    siteSelect.elt.value = TOWNS[selected].site;
    quizGuess = null; quizDone = false;
  } else if (label === 'Set energy reference') {
    magRef = mag;
  } else if (label === 'Reset') {
    epi = { x: 0, y: 0 };
    magSlider.value(6.5); depthSlider.value(10);
    magRef = 6.0; selected = 0;
    TOWNS[0].site = 'Firm soil'; TOWNS[1].site = 'Bedrock';
    TOWNS[2].site = 'Soft sediment'; TOWNS[3].site = 'Artificial fill';
    TOWNS[4].site = 'Bedrock'; TOWNS[5].site = 'Soft sediment';
    siteSelect.elt.value = TOWNS[0].site;
    quizMode = false; quizGuess = null; quizDone = false;
  }
}

function inMap(px, py) {
  return px >= mapBox.x && px <= mapBox.x + mapBox.w &&
         py >= mapBox.y && py <= mapBox.y + mapBox.h;
}

function setEpi(px, py) {
  epi = { x: constrain(mxOf(px), -DOM_X, DOM_X),
          y: constrain(myOf(py), -DOM_Y, DOM_Y) };
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
