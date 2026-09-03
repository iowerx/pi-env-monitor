// Pressure Gradient Wind Map MicroSim
// CANVAS_HEIGHT: 600
// Bloom Level: Analyze (L4) - the learner examines an isobar field and separates
// the effect of gradient steepness from the effect of absolute pressure.
// The pressure field is a sum of Gaussian centres, so the gradient at any point
// is exact rather than estimated off a picture. Geostrophic speed comes from
// that gradient, then a surface friction factor and a 30 degree cross-isobar
// angle turn it into the wind a station would actually record.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 700;

// ---- physics constants ----
const RHO = 1.225;                 // kg/m3
const OMEGA = 7.292e-5;            // rad/s
const LAT_REF = 45;                // degrees, used for the Coriolis parameter
const FRICTION = 0.60;             // surface wind as a fraction of geostrophic
const CROSS_ANGLE = 30;            // degrees, air crosses isobars toward the low

// ---- map domain, in kilometres, origin at the centre ----
const DOM_X = 1200;                // half-width  -> 2400 km across
const DOM_Y = 840;                 // half-height -> 1680 km tall
const ASPECT = DOM_X / DOM_Y;

// ---- scenarios ---------------------------------------------------------
// Each centre is an anisotropic Gaussian: A hPa anomaly, sx/sy in km, rot deg.
const SCEN = [
  {
    name: '1. Deep low, gentle gradients',
    base: 1013, ci: 2,
    centres: [{ A: -43, x: 0, y: 0, sx: 2200, sy: 2200, tag: 'L' }],
    verdict: 'Very low pressure. Light wind. The value is not the signal.'
  },
  {
    name: '2. Shallow low, tight gradients',
    base: 1013, ci: 2,
    centres: [{ A: -11, x: 0, y: 0, sx: 200, sy: 200, tag: 'L' }],
    verdict: 'Higher central pressure than scenario 1, much stronger wind. ' +
             'The gradient is the signal.'
  },
  {
    name: '3. Strong high, tight on one flank',
    base: 1013, ci: 4,
    centres: [{ A: 27, x: -100, y: 250, sx: 1400, sy: 420, rot: 20, tag: 'H' }],
    verdict: 'Strong wind happens around highs too. This ridge is packed ' +
             'along its northern flank and much slacker on its southern side: ' +
             'one system, one central pressure, two very different winds.'
  },
  {
    name: '4. Cold front passage',
    base: 1013, ci: 4,
    centres: [{ A: -22, x: -250, y: 640, sx: 800, sy: 800, tag: 'L' }],
    front: { pts: [[-250, 640], [-500, 20], [-820, -640]], amp: 6, len: 250 },
    verdict: 'Probe the warm sector, then the cold air west of the line. The ' +
             'wind veers from southwest to northwest and the air mass changes ' +
             'with it - the passage signature described in the chapter.'
  },
  {
    name: '5. Squeeze zone between two systems',
    base: 1013, ci: 4,
    centres: [{ A: 22, x: -750, y: 100, sx: 650, sy: 650, tag: 'H' },
              { A: -24, x: 750, y: -50, sx: 600, sy: 600, tag: 'L' }],
    verdict: 'The strongest wind on this map is not at either centre. It is ' +
             'in the corridor between them, where both gradients add.'
  }
];

const BEAUFORT = [
  [0.2, 'Calm'], [1.5, 'Light air'], [3.3, 'Light breeze'], [5.4, 'Gentle breeze'],
  [7.9, 'Moderate breeze'], [10.7, 'Fresh breeze'], [13.8, 'Strong breeze'],
  [17.1, 'Near gale'], [20.7, 'Gale'], [24.4, 'Strong gale'], [28.4, 'Storm'],
  [32.6, 'Violent storm'], [1e9, 'Hurricane']
];

// ---- state ----
let scenIdx = 0;
let hemisphere = 'Northern';
let showGradient = false;
let predictMode = false;
let probe = { x: 0, y: -200, has: false };
let contours = [];        // [{level, segs:[[x1,y1,x2,y2]...], labels:[[x,y]]}]
let fieldMax = null;      // {s, x, y} strongest surface wind on the map
let guesses = [];         // predict-mode attempts
let lastGuess = null;
let chipHits = [];
let scenSelect, hemiSelect;
let mapBox = { x: 0, y: 0, w: 10, h: 10 };
let panelBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  scenSelect = createSelect();
  for (let i = 0; i < SCEN.length; i++) scenSelect.option(SCEN[i].name, i);
  scenSelect.selected(SCEN[0].name);
  scenSelect.changed(() => { scenIdx = parseInt(scenSelect.value(), 10); rebuild(); });
  scenSelect.parent(document.querySelector('main'));

  hemiSelect = createSelect();
  hemiSelect.option('Northern');
  hemiSelect.option('Southern');
  hemiSelect.changed(() => { hemisphere = hemiSelect.value(); redraw(); });
  hemiSelect.parent(document.querySelector('main'));

  rebuild();
  layoutControls();
  noLoop();
  describe('An interactive synoptic pressure map. Probing any point reports the ' +
           'local pressure, the pressure gradient, and the resulting surface wind ' +
           'speed, Beaufort force and direction.');
}

// ---- pressure field ----------------------------------------------------

function pAt(x, y) {
  const sc = SCEN[scenIdx];
  let p = sc.base;
  for (const c of sc.centres) {
    const rot = radians(c.rot || 0);
    const dx = x - c.x, dy = y - c.y;
    const u = dx * Math.cos(rot) + dy * Math.sin(rot);
    const v = -dx * Math.sin(rot) + dy * Math.cos(rot);
    p += c.A * Math.exp(-(u * u / (2 * c.sx * c.sx) + v * v / (2 * c.sy * c.sy)));
  }
  if (sc.front) p -= sc.front.amp * Math.exp(-Math.abs(frontDist(x, y)) / sc.front.len);
  return p;
}

// Signed perpendicular distance to the front polyline. Positive is the warm
// side (to the right of the line as it runs from the low southward).
function frontDist(x, y) {
  const f = SCEN[scenIdx].front;
  let best = 1e9, bestSign = 1;
  for (let i = 0; i < f.pts.length - 1; i++) {
    const [ax, ay] = f.pts[i], [bx, by] = f.pts[i + 1];
    const vx = bx - ax, vy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy)));
    const px = ax + t * vx, py = ay + t * vy;
    const d = Math.hypot(x - px, y - py);
    if (d < best) { best = d; bestSign = (vx * (y - ay) - vy * (x - ax)) > 0 ? 1 : -1; }
  }
  return best * bestSign;
}

function gradAt(x, y) {           // hPa per km
  const h = 1.0;
  return [(pAt(x + h, y) - pAt(x - h, y)) / (2 * h),
          (pAt(x, y + h) - pAt(x, y - h)) / (2 * h)];
}

// Surface wind at a point, in maths coordinates with y pointing north.
function windAt(x, y) {
  const [gx, gy] = gradAt(x, y);
  const gmag = Math.hypot(gx, gy);
  const f = 2 * OMEGA * Math.sin(radians(hemisphere === 'Northern' ? LAT_REF : -LAT_REF));
  const geo = (gmag * 100 / 1000) / (RHO * Math.abs(f));   // m/s
  // Geostrophic direction: v = (1/rho f) * k x gradP.  Sign of f flips south.
  const sgn = f >= 0 ? 1 : -1;
  let dx = -gy * sgn, dy = gx * sgn;
  const dm = Math.hypot(dx, dy) || 1;
  dx /= dm; dy /= dm;
  // Friction turns the wind toward the low: counter-clockwise in the north.
  const a = radians(CROSS_ANGLE) * sgn;
  const rx = dx * Math.cos(a) - dy * Math.sin(a);
  const ry = dx * Math.sin(a) + dy * Math.cos(a);
  return { s: geo * FRICTION, geo: geo, dx: rx, dy: ry, gx: gx, gy: gy, g: gmag };
}

function beaufortForce(s) {
  for (let i = 0; i < BEAUFORT.length; i++) if (s <= BEAUFORT[i][0]) return i;
  return 12;
}

// ---- air mass either side of the front ----
function airMass(x, y) {
  const sc = SCEN[scenIdx];
  if (!sc.front) return null;
  const d = frontDist(x, y);
  const w = Math.tanh(d / 80);      // -1 cold side, +1 warm side
  return { t: 16.5 + 5.5 * w, td: 11 + 7 * w, warm: d > 0 };
}

// ---- contours ----------------------------------------------------------

function rebuild() {
  const sc = SCEN[scenIdx];
  const nx = 100, ny = 70;
  const g = [];
  let lo = 1e9, hi = -1e9;
  for (let i = 0; i <= nx; i++) {
    g.push([]);
    for (let j = 0; j <= ny; j++) {
      const x = -DOM_X + 2 * DOM_X * i / nx;
      const y = -DOM_Y + 2 * DOM_Y * j / ny;
      const p = pAt(x, y);
      g[i].push(p);
      if (p < lo) lo = p;
      if (p > hi) hi = p;
    }
  }
  contours = [];
  const first = Math.ceil(lo / sc.ci) * sc.ci;
  for (let lev = first; lev <= hi; lev += sc.ci) {
    const segs = [];
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        const x0 = -DOM_X + 2 * DOM_X * i / nx, x1 = -DOM_X + 2 * DOM_X * (i + 1) / nx;
        const y0 = -DOM_Y + 2 * DOM_Y * j / ny, y1 = -DOM_Y + 2 * DOM_Y * (j + 1) / ny;
        marchCell(segs, lev, x0, y0, x1, y1,
                  g[i][j], g[i + 1][j], g[i + 1][j + 1], g[i][j + 1]);
      }
    }
    if (segs.length) contours.push({ level: lev, segs: segs, labels: pickLabels(segs) });
  }
  // strongest surface wind on the map, sampled then refined
  let best = { s: -1, x: 0, y: 0 };
  let inner = { s: -1, x: 0, y: 0 };
  for (let x = -DOM_X; x <= DOM_X; x += 25) {
    for (let y = -DOM_Y; y <= DOM_Y; y += 25) {
      const w = windAt(x, y);
      if (w.s > best.s) best = { s: w.s, x: x, y: y };
      const clearOfScaleBar = !(x < -DOM_X * 0.5 && y < -DOM_Y * 0.7);
      if (Math.abs(x) < DOM_X * 0.8 && Math.abs(y) < DOM_Y * 0.8 &&
          clearOfScaleBar && w.s > inner.s) {
        inner = { s: w.s, x: x, y: y };
      }
    }
  }
  fieldMax = best;
  // Open on the windiest point the frame comfortably holds, so each scenario
  // states its own case before the learner touches anything.
  probe = { x: inner.x, y: inner.y, has: true };
  guesses = [];
  lastGuess = null;
  predictMode = false;
  if (typeof redraw === 'function') redraw();
}

function marchCell(out, lev, x0, y0, x1, y1, va, vb, vc, vd) {
  // corners a=(x0,y0) b=(x1,y0) c=(x1,y1) d=(x0,y1)
  let idx = 0;
  if (va > lev) idx |= 1;
  if (vb > lev) idx |= 2;
  if (vc > lev) idx |= 4;
  if (vd > lev) idx |= 8;
  if (idx === 0 || idx === 15) return;
  const ip = (pa, pb, wa, wb) => {
    const t = (lev - wa) / (wb - wa);
    return [pa[0] + t * (pb[0] - pa[0]), pa[1] + t * (pb[1] - pa[1])];
  };
  const A = [x0, y0], B = [x1, y0], C = [x1, y1], D = [x0, y1];
  const eAB = () => ip(A, B, va, vb), eBC = () => ip(B, C, vb, vc);
  const eCD = () => ip(C, D, vc, vd), eDA = () => ip(D, A, vd, va);
  const push = (p, q) => out.push([p[0], p[1], q[0], q[1]]);
  switch (idx) {
    case 1: case 14: push(eDA(), eAB()); break;
    case 2: case 13: push(eAB(), eBC()); break;
    case 3: case 12: push(eDA(), eBC()); break;
    case 4: case 11: push(eBC(), eCD()); break;
    case 6: case 9:  push(eAB(), eCD()); break;
    case 7: case 8:  push(eCD(), eDA()); break;
    case 5:  push(eDA(), eAB()); push(eBC(), eCD()); break;
    case 10: push(eAB(), eBC()); push(eCD(), eDA()); break;
  }
}

// One label per contour, placed greedily away from the other labels on the
// same level so a long wrapping isobar is annotated more than once.
function pickLabels(segs) {
  const cand = segs.map(s => [(s[0] + s[2]) / 2, (s[1] + s[3]) / 2])
                   .filter(p => Math.abs(p[0]) < DOM_X * 0.9 && Math.abs(p[1]) < DOM_Y * 0.88)
                   // the scale bar lives in the bottom-left corner
                   .filter(p => !(p[0] < -DOM_X * 0.45 && p[1] < -DOM_Y * 0.72))
                   .filter(p => !SCEN[scenIdx].front ||
                                Math.abs(frontDist(p[0], p[1])) > 130);
  if (!cand.length) return [];
  const out = [cand[Math.floor(cand.length * 0.35)]];
  for (let k = 0; k < 2; k++) {
    let best = null, bestD = 0;
    for (const c of cand) {
      let d = 1e9;
      for (const o of out) d = Math.min(d, Math.hypot(c[0] - o[0], c[1] - o[1]));
      if (d > bestD) { bestD = d; best = c; }
    }
    if (best && bestD > 700) out.push(best); else break;
  }
  return out;
}

// ---- layout ------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 34;
  if (isNarrow()) {
    const availW = canvasWidth - 2 * margin;
    const availH = 215;
    let w = availW, h = w / ASPECT;
    if (h > availH) { h = availH; w = h * ASPECT; }
    mapBox = { x: margin + (availW - w) / 2, y: top, w: w, h: h };
    panelBox = { x: margin, y: top + availH + 6, w: availW,
                 h: drawHeight - (top + availH + 6) - 6 };
  } else {
    const pw = 264;
    const availW = canvasWidth - pw - 3 * margin;
    const availH = drawHeight - top - margin;
    let w = availW, h = w / ASPECT;
    if (h > availH) { h = availH; w = h * ASPECT; }
    mapBox = { x: margin + (availW - w) / 2, y: top + (availH - h) / 2, w: w, h: h };
    panelBox = { x: canvasWidth - margin - pw, y: top, w: pw, h: availH };
  }
}

function layoutControls() {
  layout();
  const narrow = isNarrow();
  const y0 = drawHeight + 10;
  scenSelect.position(margin + 74, y0);
  scenSelect.style('width', Math.min(240, canvasWidth - margin - 84) + 'px');
  if (narrow) {
    hemiSelect.position(margin + 96, y0 + 30);
    hemiSelect.style('width', '110px');
  } else {
    hemiSelect.position(margin + 400, y0);
    hemiSelect.style('width', '110px');
  }
}

// ---- map <-> screen ----
function sx(x) { return mapBox.x + (x + DOM_X) / (2 * DOM_X) * mapBox.w; }
function sy(y) { return mapBox.y + (DOM_Y - y) / (2 * DOM_Y) * mapBox.h; }
function mx(px) { return (px - mapBox.x) / mapBox.w * 2 * DOM_X - DOM_X; }
function my(py) { return DOM_Y - (py - mapBox.y) / mapBox.h * 2 * DOM_Y; }

// ---- draw --------------------------------------------------------------

function draw() {
  layout();
  background('aliceblue');
  fill('#0d2b45'); noStroke(); textAlign(CENTER, TOP); textSize(24);
  text('Pressure Gradient Wind Map', canvasWidth / 2, 4);

  drawMapPanel();
  drawReadout();
  drawControlRegion();
}

function drawMapPanel() {
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(mapBox.x, mapBox.y, mapBox.w, mapBox.h);
  drawingContext.clip();

  noStroke(); fill('#e9f2f9');
  rect(mapBox.x, mapBox.y, mapBox.w, mapBox.h);
  drawCoast();

  // isobars
  const sc = SCEN[scenIdx];
  stroke('#7a8fa6'); strokeWeight(1.2);
  for (const c of contours) {
    for (const s of c.segs) line(sx(s[0]), sy(s[1]), sx(s[2]), sy(s[3]));
  }
  // isobar labels
  noStroke(); textAlign(CENTER, CENTER); textSize(10);
  for (const c of contours) {
    for (const p of c.labels) {
      const lx = sx(p[0]), ly = sy(p[1]);
      fill(255, 225); rect(lx - 15, ly - 7, 30, 14, 3);
      fill('#33475b'); text(c.level.toFixed(0), lx, ly);
    }
  }
  if (sc.front) drawFront();
  drawCentres();
  if (!predictMode) drawArrowField();
  if (predictMode) drawGuesses();
  if (probe.has && !predictMode) drawProbe();

  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(mapBox.x, mapBox.y, mapBox.w, mapBox.h);
  noStroke();

  // scale bar: 500 km
  const barPx = 500 / (2 * DOM_X) * mapBox.w;
  const bx = mapBox.x + 10, by = mapBox.y + mapBox.h - 12;
  stroke('#33475b'); strokeWeight(2);
  line(bx, by, bx + barPx, by);
  line(bx, by - 3, bx, by + 3); line(bx + barPx, by - 3, bx + barPx, by + 3);
  noStroke(); fill('#33475b'); textSize(10); textAlign(LEFT, BOTTOM);
  text('500 km', bx, by - 3);
}

// A stylised coast, present only so the map reads as a map.
function drawCoast() {
  const pts = [[-1200, -840], [-1200, -430], [-940, -350], [-760, -430], [-560, -250],
               [-380, -300], [-200, -110], [40, -170], [180, -20], [420, -80],
               [600, 80], [860, 10], [1080, 160], [1200, 110], [1200, -840]];
  noStroke(); fill('#efece1');
  beginShape();
  for (const p of pts) vertex(sx(p[0]), sy(p[1]));
  endShape(CLOSE);
  stroke('#c9c3ad'); strokeWeight(1.2); noFill();
  beginShape();
  for (let i = 1; i < pts.length - 1; i++) vertex(sx(pts[i][0]), sy(pts[i][1]));
  endShape();
  noStroke();
}

function drawCentres() {
  const sc = SCEN[scenIdx];
  for (const c of sc.centres) {
    const x = sx(c.x), y = sy(c.y);
    const lowish = c.A < 0;
    textAlign(CENTER, CENTER);
    noStroke(); fill(255, 210);
    rect(x - 16, y - 15, 32, 40, 4);
    fill(lowish ? '#c62828' : '#1565c0');
    textSize(22); textStyle(BOLD);
    text(c.tag, x, y - 3);
    textStyle(NORMAL); textSize(10);
    text(pAt(c.x, c.y).toFixed(0), x, y + 16);
  }
}

function drawFront() {
  const f = SCEN[scenIdx].front;
  stroke('#1c5fa8'); strokeWeight(3); noFill();
  beginShape();
  for (const p of f.pts) vertex(sx(p[0]), sy(p[1]));
  endShape();
  // cold-front pips on the warm side
  for (let i = 0; i < f.pts.length - 1; i++) {
    const [ax, ay] = f.pts[i], [bx, by] = f.pts[i + 1];
    const n = 4;
    for (let k = 1; k <= n; k++) {
      const t = (k - 0.5) / n;
      const px = sx(ax + t * (bx - ax)), py = sy(ay + t * (by - ay));
      let vx = sx(bx) - sx(ax), vy = sy(by) - sy(ay);
      const m = Math.hypot(vx, vy) || 1; vx /= m; vy /= m;
      const nx = vy, ny = -vx;      // warm side, screen coords
      noStroke(); fill('#1c5fa8');
      triangle(px - vx * 5, py - vy * 5, px + vx * 5, py + vy * 5,
               px + nx * 8, py + ny * 8);
    }
  }
  noStroke();
}

function drawArrowField() {
  const cols = 8, rows = 6;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = -DOM_X + 2 * DOM_X * (i + 0.5) / cols;
      const y = -DOM_Y + 2 * DOM_Y * (j + 0.5) / rows;
      const w = windAt(x, y);
      const len = Math.min(34, 4 + w.s * 1.9);
      const c = forceColour(beaufortForce(w.s));
      arrowAt(sx(x), sy(y), w.dx, -w.dy, len, c, 2);
    }
  }
}

function forceColour(f) {
  if (f <= 1) return '#9e9e9e';
  if (f <= 3) return '#2e7d32';
  if (f <= 5) return '#f9a825';
  if (f <= 7) return '#ef6c00';
  return '#c62828';
}

function arrowAt(px, py, ux, uy, len, col, wt) {
  const tx = px + ux * len, ty = py + uy * len;
  stroke(col); strokeWeight(wt);
  line(px - ux * len * 0.35, py - uy * len * 0.35, tx, ty);
  const a = Math.atan2(uy, ux);
  const hl = 4 + wt * 1.6;
  noStroke(); fill(col);
  triangle(tx, ty,
           tx - hl * Math.cos(a - 0.42), ty - hl * Math.sin(a - 0.42),
           tx - hl * Math.cos(a + 0.42), ty - hl * Math.sin(a + 0.42));
}

function drawProbe() {
  const px = sx(probe.x), py = sy(probe.y);
  const w = windAt(probe.x, probe.y);

  if (showGradient) {
    // 200 km ruler down the gradient, from high pressure toward low
    let gx = -w.gx, gy = -w.gy;
    const m = Math.hypot(gx, gy) || 1; gx /= m; gy /= m;
    const half = 100;                             // km each side
    const ax = sx(probe.x - gx * half), ay = sy(probe.y - gy * half);
    const bx = sx(probe.x + gx * half), by = sy(probe.y + gy * half);
    stroke('#6a1b9a'); strokeWeight(2); drawingContext.setLineDash([5, 4]);
    line(ax, ay, bx, by);
    drawingContext.setLineDash([]);
    noStroke(); fill('#6a1b9a');
    circle(ax, ay, 6); circle(bx, by, 6);
    const dp = pAt(probe.x - gx * half, probe.y - gy * half) -
               pAt(probe.x + gx * half, probe.y + gy * half);
    textAlign(CENTER, BOTTOM); textSize(10);
    fill(255, 220); rect((ax + bx) / 2 - 52, (ay + by) / 2 - 26, 104, 14, 3);
    fill('#6a1b9a');
    text(dp.toFixed(1) + ' hPa / 200 km', (ax + bx) / 2, (ay + by) / 2 - 13);
  }

  arrowAt(px, py, w.dx, -w.dy, Math.min(52, 12 + w.s * 2.2), '#000000', 3);
  noFill(); stroke('#000'); strokeWeight(1.5);
  circle(px, py, 13);
  stroke('#fff'); strokeWeight(1); circle(px, py, 9);
  noStroke();
}

function drawGuesses() {
  for (let i = 0; i < guesses.length; i++) {
    const g = guesses[i];
    noFill(); stroke('#6a1b9a'); strokeWeight(2);
    circle(sx(g.x), sy(g.y), 12);
    noStroke(); fill('#6a1b9a'); textAlign(CENTER, CENTER); textSize(9);
    text(i + 1, sx(g.x), sy(g.y));
  }
  if (lastGuess) {
    noFill(); stroke('#c62828'); strokeWeight(2.5);
    circle(sx(fieldMax.x), sy(fieldMax.y), 20);
    line(sx(fieldMax.x) - 13, sy(fieldMax.y), sx(fieldMax.x) + 13, sy(fieldMax.y));
    line(sx(fieldMax.x), sy(fieldMax.y) - 13, sx(fieldMax.x), sy(fieldMax.y) + 13);
    noStroke();
  }
}

// ---- readout panel -----------------------------------------------------

function drawReadout() {
  const b = panelBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  let y = b.y + 8;
  const L = b.x + 9, W = b.w - 18;

  if (predictMode) { drawPredictPanel(L, y, W, b); return; }
  if (!probe.has) return;

  const w = windAt(probe.x, probe.y);
  const f = beaufortForce(w.s);
  const p = pAt(probe.x, probe.y);
  const dp200 = w.g * 200;
  const per100 = w.g * 100;

  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(13); textStyle(BOLD);
  text('Probed point', L, y); textStyle(NORMAL);
  y += 19;

  y = row(L, y, W, 'Pressure', p.toFixed(1) + ' hPa');
  y = row(L, y, W, 'Gradient', dp200.toFixed(1) + ' hPa / 200 km');
  y = row(L, y, W, '', '= ' + per100.toFixed(2) + ' hPa per 100 km', true);
  y = row(L, y, W, 'Geostrophic', w.geo.toFixed(1) + ' m/s');
  y = row(L, y, W, 'Surface wind', w.s.toFixed(1) + ' m/s  (' + (w.s * 3.6).toFixed(0) +
                   ' km/h, ' + (w.s * 1.944).toFixed(0) + ' kn)');
  y = row(L, y, W, 'Beaufort', 'Force ' + f + ' - ' + BEAUFORT[f][1]);
  y = row(L, y, W, 'Direction', compassFrom(w) );

  y += 4;
  fill('#33475b'); textSize(10.5);
  y = para(L, y, W, 'Surface air crosses the isobars at about ' + CROSS_ANGLE +
      ' degrees toward the low rather than running straight downhill. Friction ' +
      'slows it to ' + Math.round(FRICTION * 100) + ' per cent of geostrophic.', 12);

  const am = airMass(probe.x, probe.y);
  if (am) {
    y += 3;
    fill(am.warm ? '#b71c1c' : '#0d47a1'); textSize(11); textStyle(BOLD);
    text(am.warm ? 'Warm sector (ahead of the front)' : 'Cold air (behind the front)', L, y);
    textStyle(NORMAL); y += 15;
    fill('#33475b'); textSize(10.5);
    text('Air ' + am.t.toFixed(1) + ' C,  dew point ' + am.td.toFixed(1) + ' C', L, y);
    y += 15;
  }

  y += 3;
  fill('#1b5e20'); textSize(10.5);
  y = para(L, y, W, SCEN[scenIdx].verdict, 12);

  // The arrow colours are a reading aid, so they need a key when there is room.
  if (b.y + b.h - y > 104) drawLegend(L, b.y + b.h - 96, W);
}

function drawLegend(L, y, W) {
  const bands = [['0-1', '#9e9e9e', 'calm'], ['2-3', '#2e7d32', 'breeze'],
                 ['4-5', '#f9a825', 'fresh'], ['6-7', '#ef6c00', 'strong'],
                 ['8+', '#c62828', 'gale']];
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
  text('Arrow colour = Beaufort force', L, y);
  let yy = y + 15;
  for (const [lab, col, word] of bands) {
    arrowAt(L + 12, yy + 5, 1, 0, 11, col, 2);
    noStroke(); fill('#33475b'); textSize(9.5); textAlign(LEFT, CENTER);
    text('F' + lab + '  ' + word, L + 32, yy + 5);
    yy += 14;
  }
  textAlign(LEFT, TOP);
}

function row(L, y, W, k, v, dim) {
  textAlign(LEFT, TOP); textSize(10.5);
  fill(dim ? '#8a97a4' : '#5a6a78');
  if (k) text(k, L, y);
  fill(dim ? '#8a97a4' : '#0d2b45'); textSize(11);
  const vx = L + Math.min(78, W * 0.34);
  const lines = wrapLines(v, W - (vx - L), 11);
  for (let i = 0; i < lines.length; i++) text(lines[i], vx, y + i * 13);
  return y + lines.length * 13 + 3;
}

function para(L, y, W, s, lh) {
  const lines = wrapLines(s, W, 10.5);
  for (let i = 0; i < lines.length; i++) text(lines[i], L, y + i * lh);
  return y + lines.length * lh;
}

function compassFrom(w) {
  // meteorological convention: the direction the wind comes FROM
  let deg = (Math.atan2(-w.dx, -w.dy) * 180 / Math.PI + 360) % 360;
  const pts = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW',
               'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return deg.toFixed(0) + ' deg, from the ' + pts[Math.round(deg / 22.5) % 16];
}

function drawPredictPanel(L, y, W, b) {
  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(13); textStyle(BOLD);
  text('Predict: where is it windiest?', L, y); textStyle(NORMAL);
  y += 19;
  fill('#33475b'); textSize(10.5);
  y = para(L, y, W, 'Arrows are hidden. Read the isobar spacing and click the ' +
      'point you think has the strongest wind. Five attempts.', 12);
  y += 6;

  fill('#0d2b45'); textSize(11);
  text(guesses.length >= 5 ? 'All 5 attempts used' : 'Attempt ' + (guesses.length + 1) + ' of 5', L, y);
  y += 17;

  if (lastGuess) {
    const pct = 100 * lastGuess.s / fieldMax.s;
    fill(pct >= 85 ? '#1b5e20' : pct >= 60 ? '#e65100' : '#b71c1c');
    textSize(11); textStyle(BOLD);
    text(pct >= 85 ? 'Very close' : pct >= 60 ? 'Warmer' : 'Not there', L, y);
    textStyle(NORMAL); y += 16;
    fill('#33475b'); textSize(10.5);
    text('You picked ' + lastGuess.s.toFixed(1) + ' m/s', L, y); y += 13;
    text('Strongest on map ' + fieldMax.s.toFixed(1) + ' m/s (red cross)', L, y); y += 13;
    text('Score ' + pct.toFixed(0) + ' per cent of the maximum', L, y); y += 16;
  }

  if (guesses.length >= 5) {
    let tot = 0;
    for (const g of guesses) tot += 100 * g.s / fieldMax.s;
    fill('#0d2b45'); textSize(11); textStyle(BOLD);
    text('Final: ' + (tot / 5).toFixed(0) + ' per cent over 5', L, y);
    textStyle(NORMAL); y += 16;
    fill('#33475b'); textSize(10.5);
    para(L, y, W, 'Change the scenario, then try again. Tight isobars, not low ' +
         'numbers, are what you are hunting for.', 12);
  }
}

// ---- control region ----------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const narrow = isNarrow();
  const y0 = drawHeight + 10;

  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(12);
  text('Scenario', margin, y0 + 11);
  if (narrow) text('Hemisphere', margin, y0 + 41);
  else text('Hemisphere', margin + 322, y0 + 11);

  chipHits = [];
  const cy = narrow ? y0 + 66 : y0 + 40;
  let cx = margin;
  cx = chip(cx, cy, 'Draw the gradient', showGradient) + 8;
  cx = chip(cx, cy, predictMode ? 'Show arrows' : 'Hide arrows: predict', predictMode) + 8;
  if (narrow && cx > canvasWidth - 70) { cx = margin; }
  chip(cx, narrow && cx === margin ? cy + 28 : cy, 'Reset probe', false);
}

function chip(x, y, label, on) {
  textSize(11); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 20;
  const h = 24;
  noStroke(); fill(on ? '#1565c0' : '#e8eef4');
  stroke(on ? '#0d47a1' : '#b6c4d2'); strokeWeight(1);
  rect(x, y, w, h, 5);
  noStroke(); fill(on ? '#ffffff' : '#33475b');
  text(label, x + w / 2, y + h / 2 + 1);
  chipHits.push({ x: x, y: y, w: w, h: h, label: label });
  return x + w;
}

// ---- interaction -------------------------------------------------------

function mousePressed() { return handlePointer(); }
function mouseDragged() {
  if (predictMode) return false;
  if (inMap(mouseX, mouseY)) { setProbe(mouseX, mouseY); redraw(); return false; }
  return true;
}

function handlePointer() {
  for (const c of chipHits) {
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      if (c.label === 'Draw the gradient') showGradient = !showGradient;
      else if (c.label === 'Reset probe') { probe = { x: 0, y: 0, has: true }; }
      else { predictMode = !predictMode; guesses = []; lastGuess = null; }
      redraw();
      return false;
    }
  }
  if (inMap(mouseX, mouseY)) {
    if (predictMode) {
      if (guesses.length < 5) {
        const gx = mx(mouseX), gy = my(mouseY);
        const g = { x: gx, y: gy, s: windAt(gx, gy).s };
        guesses.push(g); lastGuess = g;
      }
    } else setProbe(mouseX, mouseY);
    redraw();
    return false;
  }
  return true;
}

function inMap(px, py) {
  return px >= mapBox.x && px <= mapBox.x + mapBox.w &&
         py >= mapBox.y && py <= mapBox.y + mapBox.h;
}

function setProbe(px, py) {
  probe = { x: constrain(mx(px), -DOM_X, DOM_X),
            y: constrain(my(py), -DOM_Y, DOM_Y), has: true };
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
