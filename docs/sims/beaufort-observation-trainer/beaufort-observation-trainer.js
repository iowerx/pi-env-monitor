// Beaufort Scale Observation Trainer MicroSim
// CANVAS_HEIGHT: 630
// Bloom Level: Understand (L2) - the learner classifies a wind condition into a
// Beaufort force from its effects, then converts that force into a speed range.
// Every element in the scene is driven from one wind-speed value, so the smoke,
// the tree, the flag, the paper, the pond and the walker can never disagree with
// each other. Animation is the content here, not decoration: Beaufort estimation
// is a judgement about motion, and a frozen scene shows none of it.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 660;

// ---- the scale, as printed in the chapter ----
const FORCES = [
  { lo: 0.0,  hi: 0.2,  name: 'Calm',           land: 'Smoke rises vertically' },
  { lo: 0.3,  hi: 1.5,  name: 'Light air',      land: 'Smoke drifts; vanes do not move' },
  { lo: 1.6,  hi: 3.3,  name: 'Light breeze',   land: 'Leaves rustle; wind felt on face' },
  { lo: 3.4,  hi: 5.4,  name: 'Gentle breeze',  land: 'Leaves and twigs in constant motion' },
  { lo: 5.5,  hi: 7.9,  name: 'Moderate breeze',land: 'Dust and loose paper raised' },
  { lo: 8.0,  hi: 10.7, name: 'Fresh breeze',   land: 'Small trees sway' },
  { lo: 10.8, hi: 13.8, name: 'Strong breeze',  land: 'Large branches move; umbrellas difficult' },
  { lo: 13.9, hi: 17.1, name: 'Near gale',      land: 'Whole trees move; walking is hard' },
  { lo: 17.2, hi: 20.7, name: 'Gale',           land: 'Twigs break off trees' },
  { lo: 20.8, hi: 24.4, name: 'Strong gale',    land: 'Slight structural damage' },
  { lo: 24.5, hi: 28.4, name: 'Storm',          land: 'Trees uprooted; considerable damage' },
  { lo: 28.5, hi: 32.6, name: 'Violent storm',  land: 'Widespread damage' },
  { lo: 32.7, hi: 40.0, name: 'Hurricane',      land: 'Devastation' }
];

// The cue that decides each force, and the force at which that cue first appears.
const CUES = [
  { at: 0,  el: 'the smoke',  yes: 'rising dead vertically' },
  { at: 1,  el: 'the smoke',  yes: 'drifting, while the vane stays put' },
  { at: 2,  el: 'the leaves', yes: 'rustling' },
  { at: 3,  el: 'the twigs',  yes: 'in constant motion' },
  { at: 4,  el: 'the paper',  yes: 'being lifted off the ground' },
  { at: 5,  el: 'the tree',   yes: 'swaying as a whole' },
  { at: 6,  el: 'the large branches', yes: 'moving' },
  { at: 7,  el: 'the walker', yes: 'struggling to walk' },
  { at: 8,  el: 'the twigs',  yes: 'snapping off the tree' },
  { at: 9,  el: 'the roof',   yes: 'losing tiles' },
  { at: 10, el: 'the tree',   yes: 'uprooted' },
  { at: 11, el: 'the scene',  yes: 'showing widespread damage' },
  { at: 12, el: 'the scene',  yes: 'being flattened' }
];

const UNITS = [['m/s', 1], ['km/h', 3.6], ['mph', 2.237], ['knots', 1.944]];

// ---- state ----
let mode = 'Explore';            // Explore | Identify | Compare
let forceA = 6;
let forceB = 8;
let hidden = 5;
let hiddenSpeed = 9;
let guess = null;
let answered = false;
let lastFeedback = '';
let lastCorrect = false;
let round = 1;
let score = 0;
let cheatSheet = false;
let running = true;
let unitIdx = 0;
let chipHits = [];
let forceHits = [];
let unitSelect, cmpSelect;
let bins = { main: { smoke: [], paper: [], debris: [] },
             A: { smoke: [], paper: [], debris: [] },
             B: { smoke: [], paper: [], debris: [] } };
let bin = bins.main;
let tAnim = 0;
let sceneBox = { x: 0, y: 0, w: 10, h: 10 };
let infoBox = { x: 0, y: 0, w: 10, h: 10 };
let colBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  unitSelect = createSelect();
  for (const u of UNITS) unitSelect.option(u[0]);
  unitSelect.changed(() => {
    for (let i = 0; i < UNITS.length; i++) if (UNITS[i][0] === unitSelect.value()) unitIdx = i;
  });
  unitSelect.parent(document.querySelector('main'));

  cmpSelect = createSelect();
  for (let i = 0; i <= 12; i++) cmpSelect.option('Force ' + i, i);
  cmpSelect.elt.value = String(forceB);
  cmpSelect.changed(() => { forceB = parseInt(cmpSelect.value(), 10); });
  cmpSelect.parent(document.querySelector('main'));

  newRound();
  layoutControls();
  describe('An animated outdoor scene whose smoke, tree, flag, loose paper, pond ' +
           'and walker all respond to one wind speed, used to train Beaufort force ' +
           'estimation by eye.');
}

// ---- helpers -----------------------------------------------------------

function speedOf(f) { return (FORCES[f].lo + FORCES[f].hi) / 2; }

function unitStr(v) {
  const u = UNITS[unitIdx];
  return (v * u[1]).toFixed(1);
}

function rangeStr(f) {
  const u = UNITS[unitIdx];
  const hi = f === 12 ? '+' : '-' + (FORCES[f].hi * u[1]).toFixed(1);
  return (FORCES[f].lo * u[1]).toFixed(1) + hi + ' ' + u[0];
}

function allUnitsStr(f) {
  const out = [];
  for (const u of UNITS) {
    const hi = f === 12 ? '+' : '-' + (FORCES[f].hi * u[1]).toFixed(1);
    out.push((FORCES[f].lo * u[1]).toFixed(1) + hi + ' ' + u[0]);
  }
  return out;
}

function newRound() {
  hidden = Math.floor(Math.random() * 13);
  hiddenSpeed = FORCES[hidden].lo + Math.random() * (FORCES[hidden].hi - FORCES[hidden].lo);
  guess = null;
  answered = false;
  lastFeedback = '';
  resetBins();
}

function resetBins() {
  for (const k of ['main', 'A', 'B']) bins[k] = { smoke: [], paper: [], debris: [] };
}

function activeSpeed() {
  if (mode === 'Identify') return hiddenSpeed;
  return speedOf(forceA);
}

function forceFor(v) {
  for (let i = 0; i < 12; i++) if (v <= FORCES[i].hi) return i;
  return 12;
}

// ---- layout ------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 32;
  if (isNarrow()) {
    colBox = { x: margin, y: top, w: canvasWidth - 2 * margin, h: 52 };
    const sh = 252;
    sceneBox = { x: margin, y: top + 56, w: canvasWidth - 2 * margin, h: sh };
    infoBox = { x: margin, y: top + 56 + sh + 5, w: canvasWidth - 2 * margin,
                h: drawHeight - (top + 56 + sh + 5) - 5 };
  } else {
    const cw = 96;
    colBox = { x: margin, y: top, w: cw, h: drawHeight - top - 8 };
    const sx0 = margin + cw + 8;
    const sw = canvasWidth - sx0 - margin;
    const sh = 350;
    sceneBox = { x: sx0, y: top, w: sw, h: sh };
    infoBox = { x: sx0, y: top + sh + 6, w: sw, h: drawHeight - (top + sh + 6) - 6 };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 10;
  if (isNarrow()) {
    unitSelect.position(margin + 78, y0 + 62);
    cmpSelect.position(margin + 108, y0 + 92);
  } else {
    unitSelect.position(margin + 78, y0 + 32);
    cmpSelect.position(margin + 260, y0 + 32);
  }
  unitSelect.style('width', '84px');
  cmpSelect.style('width', '92px');
}

// ---- draw --------------------------------------------------------------

function draw() {
  layout();
  if (running) tAnim += 1 / 60;
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(24);
  text('Beaufort Scale Observation Trainer', canvasWidth / 2, 3);

  drawForceColumn();
  if (mode === 'Compare') {
    const halfW = (sceneBox.w - 6) / 2;
    drawScene({ x: sceneBox.x, y: sceneBox.y, w: halfW, h: sceneBox.h },
              speedOf(forceA), 'Force ' + forceA + ' - ' + FORCES[forceA].name, 'A');
    drawScene({ x: sceneBox.x + halfW + 6, y: sceneBox.y, w: halfW, h: sceneBox.h },
              speedOf(forceB), 'Force ' + forceB + ' - ' + FORCES[forceB].name, 'B');
  } else {
    const label = mode === 'Identify'
      ? (answered ? 'Force ' + hidden + ' - ' + FORCES[hidden].name : 'Force hidden')
      : 'Force ' + forceA + ' - ' + FORCES[forceA].name;
    drawScene(sceneBox, activeSpeed(), label, null);
  }
  if (cheatSheet) drawCheatSheet();
  drawInfo();
  drawControlRegion();
}

// ---- the scene ---------------------------------------------------------

function drawScene(b, v, label, tag) {
  bin = bins[tag || 'main'];
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y, b.w, b.h);
  drawingContext.clip();

  // Vertical sizes scale with the scene height; horizontal positions are
  // fractions of its width. Mixing the two is what made the first version
  // look like a strip of unrelated objects.
  const K = b.h / 316;
  const gy = b.y + b.h * 0.66;

  const murk = Math.min(1, v / 30);
  for (let i = 0; i < b.h * 0.66; i += 2) {
    const t = i / (b.h * 0.66);
    stroke(lerpColor(color(lerp(150, 118, murk), lerp(195, 146, murk), lerp(230, 166, murk)),
                     color(lerp(226, 188, murk), lerp(238, 206, murk), lerp(248, 216, murk)), t));
    line(b.x, b.y + i, b.x + b.w, b.y + i);
  }
  noStroke(); fill('#7ba05b');
  rect(b.x, gy, b.w, b.y + b.h - gy);
  fill('#6d9350');
  rect(b.x, gy, b.w, 3 * K);

  drawPond(b, gy, v, K);
  drawHouse(b, gy, v, K);
  drawFlagPole(b, gy, v, K);
  drawTreeScene(b, gy, v, K);
  drawPaperScene(b, gy, v, K);
  drawWalker(b, gy, v, K);
  drawDebris(b, gy, v, K);

  noStroke(); fill(255, 228);
  rect(b.x + 4, b.y + 4, Math.min(b.w - 8, 200), 17, 3);
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
  text(label, b.x + 9, b.y + 13);
  if (mode !== 'Identify' || answered) {
    const st = unitStr(v) + ' ' + UNITS[unitIdx][0];
    textSize(10.5);
    const w = textWidth(st) + 10;
    noStroke(); fill(255, 228);
    rect(b.x + b.w - w - 4, b.y + 4, w, 15, 3);
    fill('#33475b'); textAlign(CENTER, CENTER);
    text(st, b.x + b.w - w / 2 - 4, b.y + 12);
  }
  if (tag) {
    noStroke(); fill('#1565c0');
    circle(b.x + b.w - 15, b.y + b.h - 15, 21);
    fill(255); textAlign(CENTER, CENTER); textSize(12);
    text(tag, b.x + b.w - 15, b.y + b.h - 14);
  }

  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h);
  noStroke();
}

function drawPond(b, gy, v, K) {
  const pw = Math.min(b.w * 0.46, 260 * K), ph = 46 * K;
  const px = b.x + b.w * 0.04, py = b.y + b.h - ph - 8 * K;
  noStroke(); fill('#4a7fa8');
  ellipse(px + pw / 2, py + ph / 2, pw, ph);
  const amp = Math.min(3.6, v * 0.32) * K;
  for (let i = 0; i < 5; i++) {
    const ly = py + ph * (0.22 + 0.14 * i);
    const rel = (ly - (py + ph / 2)) / (ph / 2);
    const halfW = pw * 0.48 * Math.sqrt(Math.max(0, 1 - rel * rel));
    stroke(lerpColor(color('#6a9bc0'), color('#c3dcee'), i / 5));
    strokeWeight(1.2); noFill();
    beginShape();
    for (let x = -halfW; x <= halfW; x += 4) {
      vertex(px + pw / 2 + x, ly + amp * Math.sin(x * 0.14 / K + tAnim * (2 + v * 0.5) + i));
    }
    endShape();
    if (v >= 5.5) {
      const caps = Math.floor(Math.min(7, (v - 4) * 0.8));
      stroke(255); strokeWeight(1.7);
      for (let k = 0; k < caps; k++) {
        const fx = ((k * 41 + i * 17 + Math.floor(tAnim * 4)) % 100) / 100;
        const x = -halfW + 2 * halfW * fx;
        const yy = ly + amp * Math.sin(x * 0.14 / K + tAnim * (2 + v * 0.5) + i);
        line(px + pw / 2 + x - 4, yy, px + pw / 2 + x + 4, yy - 1.6);
      }
    }
  }
  noStroke();
}

function drawHouse(b, gy, v, K) {
  const hw = Math.min(92 * K, b.w * 0.22), hh = 62 * K;
  const hx = b.x + b.w * 0.05, hy = gy - hh;
  noStroke(); fill('#c9a27a');
  rect(hx, hy, hw, hh);
  fill('#8a6a4a');
  rect(hx + hw * 0.6, hy + hh * 0.35, hw * 0.22, hh * 0.65);
  fill(v >= 20.8 ? '#8d5a4a' : '#7a4a3a');
  triangle(hx - 7 * K, hy, hx + hw + 7 * K, hy, hx + hw / 2, hy - 30 * K);
  if (v >= 20.8) {                        // tiles going, force 9 and up
    fill('#5a3428');
    for (let i = 0; i < 4; i++) {
      rect(hx + hw * (0.22 + i * 0.16), hy - 22 * K + i * 4 * K, 9 * K, 5 * K);
    }
  }
  fill('#6b6b6b');
  const cx = hx + hw * 0.7, cyTop = hy - 22 * K;
  rect(cx, cyTop, 13 * K, 32 * K);
  drawSmoke(cx + 6.5 * K, cyTop, v, K, b);
}

function drawSmoke(x, y, v, K, b) {
  if (running && frameCount % 3 === 0) {
    bin.smoke.push({ x: x, y: y, r: 4 * K, age: 0, j: Math.random() - 0.5 });
  }
  const life = v >= 10.8 ? 58 : 100;
  const keep = [];
  for (const p of bin.smoke) {
    if (running) {
      p.age += 1;
      p.y -= 1.15 * K / (1 + v * 0.15);
      p.x += (v * 0.40 + p.j * v * 0.22) * K * 0.55;
      p.y += p.j * v * 0.055 * K;
      p.r += 0.20 * K * (1 + v * 0.04);
    }
    if (p.age < life && p.x < b.x + b.w + 24 && p.y > b.y - 20) keep.push(p);
  }
  bin.smoke = keep;
  noStroke();
  for (const p of bin.smoke) {
    fill(158, 158, 158, 160 * (1 - p.age / life));
    circle(p.x, p.y, p.r * 2);
  }
}

// A trunk sheared by the wind, with branches hung off it at fixed heights.
function drawTreeScene(b, gy, v, K) {
  const tx = b.x + b.w * 0.66;
  const uprooted = v >= 24.5;
  const bend = Math.min(0.34, 0.0060 * Math.pow(v, 1.45));
  const sway = Math.sin(tAnim * (0.7 + v * 0.15)) * Math.min(0.10, 0.0055 * v);
  const lean = uprooted ? 1.05 : bend + sway;
  const Ht = 150 * K;

  push();
  translate(tx, gy);
  if (uprooted) {
    noStroke(); fill('#6b4a2f');
    ellipse(-6 * K, -3 * K, 46 * K, 15 * K);
    for (let i = 0; i < 5; i++) {
      stroke('#5a3f28'); strokeWeight(2 * K);
      line(-6 * K, -3 * K, -6 * K - 18 * K * Math.cos(i * 0.7), -3 * K - 12 * K * Math.sin(i * 0.7));
    }
    translate(8 * K, -2 * K);
    rotate(lean);
  }
  const shear = uprooted ? 0 : lean;
  const xAt = (f) => shear * Ht * f * f;      // trunk offset at height fraction f

  stroke('#6b4a2f'); strokeCap(ROUND); noFill();
  strokeWeight(8 * K);
  beginShape();
  for (let i = 0; i <= 10; i++) {
    const f = i / 10;
    vertex(xAt(f), -Ht * f);
  }
  endShape();

  const BR = [[0.42, -1, 0.95], [0.55, 1, 0.90], [0.68, -1, 0.80],
              [0.78, 1, 0.72], [0.88, -1, 0.60], [0.95, 1, 0.52]];
  for (let i = 0; i < BR.length; i++) {
    const [f, dir, len] = BR[i];
    const bx = xAt(f), by = -Ht * f;
    const wob = Math.sin(tAnim * (1.4 + v * 0.22) + i * 1.7) *
                Math.min(0.26, 0.010 * v) * (v >= 10.8 ? 1.6 : 1);
    const L = 62 * K * len;
    const theta = 0.62 + 0.12 * i + wob;      // from vertical
    const ex = bx + dir * L * Math.sin(theta) + shear * L * 0.9;
    const ey = by - L * Math.cos(theta) * 0.55;
    strokeWeight((4.4 - i * 0.45) * K);
    stroke('#6b4a2f');
    line(bx, by, ex, ey);
    if (v < 28.5) {
      noStroke();
      const shake = Math.min(4.0, v * 0.34) * K;
      for (let k = 0; k < 4; k++) {
        const jx = Math.sin(tAnim * (3.2 + v * 0.38) + i * 2 + k) * shake;
        const jy = Math.cos(tAnim * (2.8 + v * 0.38) + i + k * 1.4) * shake * 0.6;
        fill(v >= 17.2 ? '#5f8a3f' : '#4e7d33');
        circle(ex + (k - 1.5) * 7 * K + jx, ey + ((k % 2) - 0.5) * 8 * K + jy, 17 * K);
      }
      stroke('#6b4a2f');
    }
  }
  pop();
  noStroke();

  if (running && v >= 17.2 && Math.random() < (v - 16) * 0.012) {
    bin.debris.push({ x: tx, y: gy - Ht * 0.7, vx: (1 + Math.random()) * v * 0.09 * K,
                  vy: -Math.random() * 1.4 * K, len: (v >= 20.8 ? 20 : 9) * K,
                  a: Math.random() * 6, age: 0 });
  }
}

function drawDebris(b, gy, v, K) {
  const keep = [];
  for (const d of bin.debris) {
    if (running) {
      d.x += d.vx; d.y += d.vy; d.vy += 0.07 * K; d.a += 0.2; d.age++;
      if (d.y > gy - 2) { d.y = gy - 2; d.vy = 0; d.vx *= 0.86; }
    }
    if (d.age < 300 && d.x < b.x + b.w + 24) keep.push(d);
  }
  bin.debris = keep;
  stroke('#5a3f28'); strokeWeight(2 * K);
  for (const d of bin.debris) {
    push(); translate(d.x, d.y); rotate(d.a);
    line(-d.len / 2, 0, d.len / 2, 0);
    pop();
  }
  noStroke();
}

function drawFlagPole(b, gy, v, K) {
  const fx = b.x + b.w * 0.34;
  const top = gy - 132 * K;
  stroke('#9aa5ad'); strokeWeight(3 * K);
  line(fx, gy, fx, top);
  noStroke();
  const lift = Math.min(1, Math.pow(v / 9, 1.25));
  const H = 30 * K;
  const L = 58 * K * (0.72 + 0.28 * lift);     // fabric bunches when it hangs
  const snap = (v >= 10.8 ? Math.min(7, v * 0.32) : Math.min(2.6, v * 0.22)) * K;
  // The free edge swings from straight down to horizontal, so a limp flag is
  // a drape against the pole rather than a zero-width sliver.
  const ang = (1 - lift) * Math.PI / 2;
  const dx = Math.cos(ang), dy = Math.sin(ang);
  const nx = -dy, ny = dx;
  const ox = fx, oy = top + H / 2;
  fill('#c62828');
  beginShape();
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const w = Math.sin(t * 5.5 - tAnim * (2 + v * 0.42)) * snap * t - H / 2;
    vertex(ox + dx * L * t + nx * w, oy + dy * L * t + ny * w);
  }
  for (let i = 12; i >= 0; i--) {
    const t = i / 12;
    const w = Math.sin(t * 5.5 - tAnim * (2 + v * 0.42)) * snap * t + H / 2;
    vertex(ox + dx * L * t + nx * w, oy + dy * L * t + ny * w);
  }
  endShape(CLOSE);
}

function drawPaperScene(b, gy, v, K) {
  const px0 = b.x + b.w * 0.42;
  if (bin.paper.length === 0) {
    for (let i = 0; i < 3; i++) {
      bin.paper.push({ x: px0 + i * 17 * K, y: gy - 4 * K, a: i, flying: false, vx: 0, vy: 0 });
    }
  }
  for (const p of bin.paper) {
    if (running) {
      if (v >= 8.0 && !p.flying && Math.random() < 0.025) {
        p.flying = true;
        p.vx = v * 0.10 * K; p.vy = -1.0 * K - Math.random() * v * 0.05 * K;
      }
      if (p.flying) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05 * K; p.a += 0.15;
        p.vy += Math.sin(tAnim * 5 + p.x * 0.05) * 0.06 * K;
        if (p.y > gy - 4 * K && p.vy > 0) {
          if (v >= 8.0) p.vy = -0.9 * K - Math.random() * v * 0.04 * K;
          else { p.flying = false; p.y = gy - 4 * K; p.vy = 0; }
        }
        if (p.x > b.x + b.w + 14) { p.x = px0; p.y = gy - 4 * K; p.flying = false; }
      } else if (v >= 5.5) {
        p.a = Math.sin(tAnim * 6 + p.x) * 0.28;
        p.x += Math.sin(tAnim * 9 + p.x) * 0.18 * K;
      }
    }
    push(); translate(p.x, p.y); rotate(p.a);
    fill(250); stroke('#c0c0c0'); strokeWeight(0.9);
    rect(-7 * K, -5 * K, 14 * K, 10 * K);
    pop();
  }
  noStroke();
}

function drawWalker(b, gy, v, K) {
  const wx = b.x + b.w * 0.50;
  const lean = v < 10.8 ? 0.03 : Math.min(0.60, (v - 9) * 0.058);
  const stride = v >= 17.2 ? 0 : Math.sin(tAnim * 4) * (1 - Math.min(1, v / 20));
  const B = 62 * K;                              // body height
  push();
  translate(wx, gy);
  rotate(-lean);
  stroke('#33475b'); strokeWeight(3 * K); strokeCap(ROUND);
  line(0, 0, 0, -B * 0.58);
  noStroke(); fill('#33475b');
  circle(0, -B * 0.72, B * 0.24);
  stroke('#33475b'); strokeWeight(2.8 * K);
  line(0, -B * 0.30, -B * 0.18 + stride * B * 0.20, 0);
  line(0, -B * 0.30, B * 0.18 + stride * B * 0.20, 0);
  const armFwd = v >= 13.9 ? -0.95 : -0.2;
  line(0, -B * 0.50, B * 0.30 * Math.cos(armFwd), -B * 0.50 + B * 0.30 * Math.sin(armFwd));
  line(0, -B * 0.50, -B * 0.26, -B * 0.34);
  pop();
  noStroke();
  if (v >= 17.2) {
    fill('#b71c1c'); textAlign(CENTER, BOTTOM); textSize(Math.max(8, 10 * K));
    text('no headway', wx, gy - B - 6 * K);
  }
}

// ---- force column ------------------------------------------------------

function drawForceColumn() {
  forceHits = [];
  const b = colBox;
  const sel = mode === 'Identify' ? guess : forceA;
  if (isNarrow()) {
    const per = 7;
    const cw = (b.w - 6 * 6) / per;
    for (let f = 0; f <= 12; f++) {
      const r = f < per ? 0 : 1;
      const c = f < per ? f : f - per;
      const x = b.x + c * (cw + 6), y = b.y + r * 26;
      forceChip(x, y, cw, 22, f, sel === f);
    }
  } else {
    noStroke(); fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
    text('Force', b.x, b.y);
    const h = Math.min(23, (b.h - 16) / 13);
    for (let f = 0; f <= 12; f++) {
      forceChip(b.x, b.y + 14 + f * h, b.w, h - 2, f, sel === f);
    }
  }
}

function forceChip(x, y, w, h, f, on) {
  const shade = Math.min(1, f / 12);
  noStroke();
  fill(on ? '#1565c0' : lerpColor(color('#eef3f7'), color('#f6d7cf'), shade));
  stroke(on ? '#0d47a1' : '#c2ccd6'); strokeWeight(1);
  rect(x, y, w, h, 4);
  noStroke(); fill(on ? '#ffffff' : '#33475b');
  textAlign(CENTER, CENTER); textSize(11);
  text(f, x + w / 2, y + h / 2 + 0.5);
  forceHits.push({ x: x, y: y, w: w, h: h, f: f });
}

// ---- info panel --------------------------------------------------------

function drawInfo() {
  const b = infoBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 9, W = b.w - 18;
  let y = b.y + 7;

  if (mode === 'Identify') {
    fill('#0d2b45'); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
    text('Identify - round ' + round + ' of 10      Score ' + score + '/' + (round - (answered ? 0 : 1)),
         L, y);
    textStyle(NORMAL); y += 17;
    if (!answered) {
      fill('#33475b'); textSize(11);
      y = para(L, y, W, guess === null
        ? 'Watch the scene, then click the Beaufort force you think it shows.'
        : 'You picked force ' + guess + ' - ' + FORCES[guess].name + '. Press Submit.', 13, 11);
      if (guess !== null) {
        fill('#5a6a78'); textSize(10.5);
        text(FORCES[guess].land, L, y + 2);
      }
    } else {
      fill(lastCorrect ? '#1b5e20' : '#b71c1c'); textSize(11.5); textStyle(BOLD);
      text(lastCorrect ? 'Correct' : 'Not this time', L, y);
      textStyle(NORMAL); y += 15;
      fill('#33475b'); textSize(10.8);
      y = para(L, y, W, lastFeedback, 13, 10.8);
    }
    return;
  }

  const f = mode === 'Compare' ? forceA : forceA;
  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  text('Force ' + f + ' - ' + FORCES[f].name +
       (mode === 'Compare' ? '   vs   Force ' + forceB + ' - ' + FORCES[forceB].name : ''),
       L, y);
  textStyle(NORMAL); y += 17;
  fill('#33475b'); textSize(11);
  text(FORCES[f].land, L, y); y += 15;
  if (mode === 'Compare') {
    fill('#5a6a78'); textSize(10.5);
    text('B: ' + FORCES[forceB].land, L, y); y += 15;
  }
  fill('#0d2b45'); textSize(10.5);
  const ranges = allUnitsStr(f);
  const cols = W > 330 ? 4 : 2;
  const cw = W / cols;
  for (let i = 0; i < ranges.length; i++) {
    text(ranges[i], L + (i % cols) * cw, y + Math.floor(i / cols) * 13);
  }
  y += Math.ceil(ranges.length / cols) * 13 + 5;

  // Adjacent forces, because those are the discriminations that are actually hard.
  fill('#5a6a78'); textSize(10);
  if (f > 0) {
    y = para(L, y, W, 'One below, force ' + (f - 1) + ' ' +
        FORCES[f - 1].name.toLowerCase() + ': ' +
        FORCES[f - 1].land.toLowerCase() + '.', 12, 10);
  }
  if (f < 12) {
    para(L, y, W, 'One above, force ' + (f + 1) + ' ' +
        FORCES[f + 1].name.toLowerCase() + ': ' +
        FORCES[f + 1].land.toLowerCase() + '.', 12, 10);
  }
}

function para(L, y, W, s, lh, size) {
  const lines = wrapLines(s, W, size);
  for (let i = 0; i < lines.length; i++) text(lines[i], L, y + i * lh);
  return y + lines.length * lh;
}

function drawCheatSheet() {
  const b = sceneBox;
  noStroke(); fill(255, 246);
  rect(b.x, b.y, b.w, b.h, 4);
  stroke('#4a6076'); noFill(); rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD);
  text('Beaufort scale (' + UNITS[unitIdx][0] + ')', b.x + 8, b.y + 5);
  textStyle(NORMAL);
  const rowH = (b.h - 26) / 13;
  const wide = b.w > 340;
  for (let f = 0; f <= 12; f++) {
    const y = b.y + 22 + f * rowH;
    fill(f % 2 ? '#f4f7fa' : '#ffffff');
    rect(b.x + 4, y, b.w - 8, rowH - 1);
    fill('#33475b'); textSize(Math.min(10, rowH * 0.62));
    text(f, b.x + 10, y + 1);
    text(FORCES[f].name, b.x + 26, y + 1);
    text(rangeStr(f), b.x + (wide ? 110 : 96), y + 1);
    if (wide) text(FORCES[f].land, b.x + 190, y + 1);
  }
}

// ---- control region ----------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 10;
  chipHits = [];

  let x = margin;
  x = chip(x, y0, 'Explore', mode === 'Explore') + 6;
  x = chip(x, y0, 'Identify', mode === 'Identify') + 6;
  x = chip(x, y0, 'Compare', mode === 'Compare') + 6;
  x = chip(x, y0, running ? 'Pause' : 'Play', !running) + 6;
  if (!isNarrow()) chip(x, y0, cheatSheet ? 'Hide cheat sheet' : 'Cheat sheet', cheatSheet);
  else chip(margin, y0 + 30, cheatSheet ? 'Hide cheat sheet' : 'Cheat sheet', cheatSheet);

  const rowY = isNarrow() ? y0 + 62 : y0 + 32;
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
  text('Speed unit', margin, rowY + 11);
  if (mode === 'Compare') {
    if (isNarrow()) text('Compare A with', margin, y0 + 103);
    else text('Compare A with', margin + 172, rowY + 11);
    cmpSelect.show();
  } else {
    cmpSelect.hide();
  }

  if (mode === 'Identify') {
    const by = isNarrow() ? y0 + 92 : y0 + 62;
    let bx = margin;
    if (!answered) bx = chip(bx, by, 'Submit answer', false) + 6;
    else bx = chip(bx, by, round >= 10 ? 'Start again' : 'Next round', false) + 6;
    chip(bx, by, 'Restart set', false);
  }
}

function chip(x, y, label, on) {
  textSize(11); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 18;
  const h = 24;
  noStroke(); fill(on ? '#1565c0' : '#e8eef4');
  stroke(on ? '#0d47a1' : '#b6c4d2'); strokeWeight(1);
  rect(x, y, w, h, 5);
  noStroke(); fill(on ? '#ffffff' : '#33475b');
  text(label, x + w / 2, y + h / 2 + 1);
  chipHits.push({ x: x, y: y, w: w, h: h, label: label });
  return x + w;
}

// ---- feedback ----------------------------------------------------------

function judge() {
  answered = true;
  lastCorrect = guess === hidden;
  const t = FORCES[hidden];
  if (lastCorrect) {
    score += 1;
    lastFeedback = 'Force ' + hidden + ', ' + t.name.toLowerCase() + ', ' +
      rangeStr(hidden) + '. The deciding cue: ' + CUES[hidden].el + ' ' +
      CUES[hidden].yes + '.';
  } else if (guess < hidden) {
    const c = CUES[hidden];
    lastFeedback = 'Look at ' + c.el + '. It is ' + c.yes + ', which rules out ' +
      'anything below force ' + hidden + '. This was force ' + hidden + ', ' +
      t.name.toLowerCase() + ', ' + rangeStr(hidden) + '.';
  } else {
    const c = CUES[guess];
    lastFeedback = 'Look at ' + c.el + '. It is not yet ' + c.yes + ', so this ' +
      'cannot be force ' + guess + ' or above. It was force ' + hidden + ', ' +
      t.name.toLowerCase() + ', ' + rangeStr(hidden) + '.';
  }
}

// ---- interaction -------------------------------------------------------

function mousePressed() {
  for (const c of chipHits) {
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      onChip(c.label);
      return false;
    }
  }
  for (const h of forceHits) {
    if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) {
      if (mode === 'Identify') { if (!answered) guess = h.f; }
      else { forceA = h.f; resetBins(); }
      return false;
    }
  }
  return true;
}

function onChip(label) {
  if (label === 'Explore' || label === 'Compare') {
    mode = label; cheatSheet = false;
  } else if (label === 'Identify') {
    mode = 'Identify'; round = 1; score = 0; cheatSheet = false; newRound();
  } else if (label === 'Pause' || label === 'Play') {
    running = !running;
  } else if (label === 'Cheat sheet' || label === 'Hide cheat sheet') {
    cheatSheet = !cheatSheet;
  } else if (label === 'Submit answer') {
    if (guess !== null) judge();
  } else if (label === 'Next round') {
    round += 1; newRound();
  } else if (label === 'Start again' || label === 'Restart set') {
    round = 1; score = 0; newRound();
  }
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
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
