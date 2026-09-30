// Station Siting Planner MicroSim
// CANVAS_HEIGHT: 656
// Bloom Level: Evaluate (L5) - the learner recommends a location on a real site
// plan and defends it against the exposure needs of all seven measured
// quantities at once.
// Scoring every sensor simultaneously from one placement is the design decision
// that makes the conflict unavoidable: you cannot improve one without watching
// another degrade. Shadows are computed geometrically from obstruction heights
// and the solar position, so the shade hours are derived rather than asserted.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 462;
let controlHeight = 194;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 760;

// ---- the site, in metres. Origin top-left, x east, y south ----
const SITE_W = 120, SITE_H = 84;
const LAT = 40;
const CLEAR_FACTOR = 4;          // the international four-times-height convention

const BUILDINGS = [
  { id: 'main', name: 'Main building', x: 8, y: 8, w: 44, h: 20, ht: 8 },
  { id: 'annexe', name: 'Annexe', x: 62, y: 10, w: 26, h: 12, ht: 4 }
];
const TREES = [
  { id: 'oak', name: 'Large oak', x: 100, y: 34, r: 7, ht: 12 },
  { id: 'birch', name: 'Birch', x: 57, y: 24, r: 4, ht: 7 },
  { id: 'shrub', name: 'Shrub', x: 74, y: 62, r: 3, ht: 4 }
];
const SURFACES = [
  { id: 'carpark', name: 'asphalt car park', x: 8, y: 32, w: 34, h: 18,
    albedo: 0.10, col: '#616161', kind: 'asphalt' },
  { id: 'path', name: 'paved path', x: 48, y: 30, w: 6, h: 48,
    albedo: 0.22, col: '#bdbdbd', kind: 'paved' },
  { id: 'field', name: 'short grass', x: 0, y: 0, w: SITE_W, h: SITE_H,
    albedo: 0.25, col: '#8fb573', kind: 'grass' }
];

const CANDIDATES = {
  'Beside the building': { x: 30, y: 32 },
  'On the car park': { x: 16, y: 46 },
  'Under the large oak': { x: 100, y: 34 },
  'Middle of the field': { x: 58, y: 74 }
};

const SENSORS = ['Temperature', 'Humidity', 'Pressure', 'Solar', 'Wind', 'Seismic', 'GPS'];

// ---- state ----
let st = { x: 58, y: 74 };
let season = 'Winter';
let hour = 15;
let layers = { shadow: true, clearance: false, surface: true, sky: false };
let mast = { shieldH: 1.5, solarH: 2.0, seismic: 'Ground stake', anemH: 2.0 };
let explain = null;
let dragging = false;
let chipHits = [], rowHits = [];
let hourSlider;
let planBox = { x: 0, y: 0, w: 10, h: 10 };
let cardBox = { x: 0, y: 0, w: 10, h: 10 };
let mastBox = null;

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');
  hourSlider = createSlider(6, 18, 15, 0.5);
  hourSlider.parent(document.querySelector('main'));
  hourSlider.style('width', '150px');
  layoutControls();
  describe('A plan view of a school site with a draggable station marker, toggleable ' +
           'shadow, clearance, surface and sky-view layers, and a scorecard rating all ' +
           'seven sensors for the current placement.');
}

// ---- solar geometry ------------------------------------------------------

function decl() { return season === 'Summer' ? 23.44 : -23.44; }

function sunPos(h) {
  const dec = radians(decl()), lat = radians(LAT);
  const H = radians(15 * (h - 12));
  const sinEl = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H);
  const el = Math.asin(constrain(sinEl, -1, 1));
  let cosAz = (Math.sin(dec) - Math.sin(el) * Math.sin(lat)) /
              Math.max(1e-6, Math.cos(el) * Math.cos(lat));
  let az = Math.acos(constrain(cosAz, -1, 1));
  if (H > 0) az = 2 * Math.PI - az;      // afternoon sun is to the west
  return { el: el, az: az };
}

// Unit vector, in map coordinates, pointing along the shadow.
function shadowVec(h) {
  const s = sunPos(h);
  if (s.el <= 0.02) return null;
  return { ux: -Math.sin(s.az), uy: Math.cos(s.az), len: 1 / Math.tan(s.el) };
}

function inShadowAt(px, py, h) {
  const v = shadowVec(h);
  if (!v) return true;                   // before sunrise, everything is in shade
  for (const b of BUILDINGS) {
    const L = b.ht * v.len;
    for (let k = 0; k <= 14; k++) {
      const t = L * k / 14;
      const qx = px - v.ux * t, qy = py - v.uy * t;
      if (qx >= b.x && qx <= b.x + b.w && qy >= b.y && qy <= b.y + b.h) return true;
    }
  }
  for (const t2 of TREES) {
    const L = t2.ht * v.len;
    const ex = t2.x + v.ux * L, ey = t2.y + v.uy * L;
    if (distToSeg(px, py, t2.x, t2.y, ex, ey) <= t2.r) return true;
  }
  return false;
}

function distToSeg(px, py, ax, ay, bx, by) {
  const vx = bx - ax, vy = by - ay;
  const L2 = vx * vx + vy * vy;
  const t = L2 === 0 ? 0 : constrain(((px - ax) * vx + (py - ay) * vy) / L2, 0, 1);
  return Math.hypot(px - (ax + t * vx), py - (ay + t * vy));
}

function shadeHours(seasonName) {
  const save = season;
  season = seasonName;
  let n = 0, total = 0;
  for (let h = 5; h <= 19; h += 0.25) {
    if (degrees(sunPos(h).el) <= 10) continue;    // below this there is no energy
    total += 0.25;
    if (inShadowAt(st.x, st.y, h)) n += 0.25;
  }
  season = save;
  return { shaded: n, daylight: total };
}

// ---- site queries --------------------------------------------------------

function surfaceUnder() {
  for (const s of SURFACES) {
    if (st.x >= s.x && st.x <= s.x + s.w && st.y >= s.y && st.y <= s.y + s.h) return s;
  }
  return SURFACES[SURFACES.length - 1];
}

function obstructions() {
  const out = [];
  for (const b of BUILDINGS) {
    const dx = Math.max(b.x - st.x, 0, st.x - (b.x + b.w));
    const dy = Math.max(b.y - st.y, 0, st.y - (b.y + b.h));
    out.push({ name: b.name, ht: b.ht, d: Math.hypot(dx, dy), need: b.ht * CLEAR_FACTOR });
  }
  for (const t of TREES) {
    out.push({ name: t.name, ht: t.ht,
               d: Math.max(0, Math.hypot(st.x - t.x, st.y - t.y) - t.r),
               need: t.ht * CLEAR_FACTOR });
  }
  out.sort((a, b) => (a.d - a.need) - (b.d - b.need));
  return out;
}

function skyBlockedPct() {
  // crude horizon obstruction: each object blocks a wedge scaled by its
  // angular height and angular width from where the station stands
  let blocked = 0;
  for (const o of BUILDINGS.map(b => ({ x: b.x + b.w / 2, y: b.y + b.h / 2,
        r: Math.max(b.w, b.h) / 2, ht: b.ht }))
       .concat(TREES.map(t => ({ x: t.x, y: t.y, r: t.r, ht: t.ht })))) {
    const d = Math.max(1, Math.hypot(st.x - o.x, st.y - o.y) - o.r);
    const elev = Math.atan2(o.ht, d);
    const halfWidth = Math.atan2(o.r, d);
    blocked += (elev / (Math.PI / 2)) * (2 * halfWidth / (2 * Math.PI)) * 100;
  }
  return Math.min(95, blocked);
}

// The shield shadows the solar sensor if it sits above it on the same mast.
function shieldShadowHours() {
  if (mast.shieldH <= mast.solarH) return 0;
  const save = season; season = 'Summer';
  let n = 0;
  for (let h = 6; h <= 18; h += 0.25) {
    const s = sunPos(h);
    if (s.el <= 0) continue;
    // the shield's shadow falls on the sensor below it when the sun is high
    const drop = (mast.shieldH - mast.solarH);
    const offset = drop / Math.tan(s.el);
    if (offset < 0.25) n += 0.25;          // shield diameter about 0.25 m
  }
  season = save;
  return n;
}

// ---- scoring -------------------------------------------------------------

function scores() {
  const surf = surfaceUnder();
  const obs = obstructions();
  const worst = obs[0];
  const clearOk = obs.every(o => o.d >= o.need);
  const sh = shadeHours('Summer');
  const shW = shadeHours('Winter');
  const sky = skyBlockedPct();
  const shieldHrs = shieldShadowHours();
  const out = [];

  const surfBad = surf.kind !== 'grass';
  out.push({ s: 'Temperature',
    r: surfBad ? 'poor' : (clearOk ? 'good' : 'marginal'),
    why: surfBad
      ? surf.name.charAt(0).toUpperCase() + surf.name.slice(1) +
        ' beneath, albedo ' + surf.albedo.toFixed(2) + '. It stores heat all day and ' +
        'releases it all night, so your night-time readings will be several degrees too ' +
        'high. Short grass is the standard (Chapter 6, Chapter 9).'
      : (clearOk ? 'Short grass beneath and every obstruction beyond four times its ' +
                   'height. This is textbook exposure.'
                 : worst.name + ' is ' + worst.ht + ' m tall and needs ' +
                   worst.need + ' m of clearance; you are at ' + worst.d.toFixed(0) +
                   ' m. Buildings radiate stored heat at night (Chapter 6).') });

  out.push({ s: 'Humidity',
    r: surfBad ? 'poor' : (clearOk ? 'good' : 'marginal'),
    why: surfBad
      ? 'Humidity is computed against the temperature, so a temperature error becomes a ' +
        'humidity error and then a dew point error (Chapter 8).'
      : (clearOk ? 'Shares the shield with the temperature sensor and inherits its good ' +
                   'exposure.'
                 : 'Inherits the temperature sensor\'s clearance problem, and the dew ' +
                   'point calculation inherits both.') });

  out.push({ s: 'Pressure', r: 'good',
    why: 'Pressure is the one quantity that barely cares where you stand, because it ' +
         'varies by only about 0.12 hPa per metre of height. Vent the enclosure and ' +
         'record the elevation, and you are done (Chapter 7).' });

  const solarR = shieldHrs > 0.5 ? 'poor'
    : (sh.shaded > 1.5 ? 'poor' : (shW.shaded > 2 ? 'marginal' : 'good'));
  out.push({ s: 'Solar', r: solarR,
    why: shieldHrs > 0.5
      ? 'The radiation shield is at ' + mast.shieldH.toFixed(1) + ' m and the solar ' +
        'sensor at ' + mast.solarH.toFixed(1) + ' m, so the shield casts a shadow on ' +
        'the sensor for about ' + shieldHrs.toFixed(1) + ' hours around midday in ' +
        'summer. Put the solar sensor above everything else.'
      : (sh.shaded > 1.5
          ? sh.shaded.toFixed(1) + ' hours of shade in summer out of ' +
            sh.daylight.toFixed(1) + ' of daylight. Anything shaded is measuring the ' +
            'shadow, not the sky (Chapter 9).'
          : (shW.shaded > 2
              ? 'Clear in summer but ' + shW.shaded.toFixed(1) + ' hours of shade in ' +
                'winter, when the sun is only ' +
                degrees(sunPos(12).el).toFixed(0) + ' degrees up at noon. Check both seasons.'
              : 'Unshaded in both seasons. ' + sh.shaded.toFixed(1) + ' h of summer ' +
                'shade and ' + shW.shaded.toFixed(1) + ' h of winter shade.')) });

  const windR = !clearOk ? 'poor' : (mast.anemH < 2 ? 'marginal' : 'good');
  out.push({ s: 'Wind', r: windR,
    why: !clearOk
      ? worst.name + ' at ' + worst.d.toFixed(0) + ' m needs ' + worst.need + ' m. ' +
        'Obstructions block wind, channel it into unrepresentative gusts, and make your ' +
        'readings a property of the building rather than the weather (Chapter 10).'
      : (mast.anemH < 2
          ? 'Clearance is fine but the anemometer is at ' + mast.anemH.toFixed(1) +
            ' m. Surface friction slows wind near the ground; 2 m is the minimum and ' +
            '10 m is the standard.'
          : 'Every obstruction is beyond four times its height and the anemometer is at ' +
            mast.anemH.toFixed(1) + ' m.') });

  const seisR = mast.seismic === 'On the mast' ? 'poor'
    : (mast.seismic === 'Concrete slab' ? 'good' : 'good');
  out.push({ s: 'Seismic', r: seisR,
    why: mast.seismic === 'On the mast'
      ? 'The mast sways in wind. This sensor will record the mast, not the ground. ' +
        'Chapter 11 showed the instrument measures the frame it is bolted to.'
      : 'Mounted on ' + mast.seismic.toLowerCase() + ', coupled to the ground rather ' +
        'than to a swaying structure. That is the resolution.' });

  out.push({ s: 'GPS', r: sky > 45 ? 'poor' : (sky > 22 ? 'marginal' : 'good'),
    why: 'About ' + sky.toFixed(0) + ' per cent of the sky is blocked from here. ' +
         (sky > 45 ? 'A receiver needs four satellites in view and this will not hold ' +
                     'them (Chapter 5).'
                   : (sky > 22 ? 'Usable, but expect the fix to drop out and the ' +
                                 'position to wander.'
                               : 'Open sky. Four satellites will not be a problem.')) });
  return out;
}

function overall(sc) {
  const poor = sc.filter(x => x.r === 'poor');
  const marg = sc.filter(x => x.r === 'marginal');
  if (poor.length) return { r: 'poor', worst: poor[0],
    msg: poor.length + ' sensor' + (poor.length === 1 ? '' : 's') + ' rated poor. The ' +
         'worst problem is ' + poor[0].s.toLowerCase() + '.' };
  if (marg.length) return { r: 'marginal', worst: marg[0],
    msg: 'Nothing is ruined, but ' + marg.length + ' sensor' +
         (marg.length === 1 ? ' is' : 's are') + ' compromised. Worst: ' +
         marg[0].s.toLowerCase() + '.' };
  return { r: 'good', worst: null,
    msg: 'All seven sensors are well exposed here. Now read the rest of the chapter ' +
         'and work out how you are going to get power and a network to it.' };
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 28;
  const aspect = SITE_W / SITE_H;
  if (isNarrow()) {
    const availW = canvasWidth - 2 * margin;
    let w = availW, h = w / aspect;
    if (h > 176) { h = 176; w = h * aspect; }
    planBox = { x: margin + (availW - w) / 2, y: top, w: w, h: h };
    cardBox = { x: margin, y: top + h + 6, w: availW, h: drawHeight - (top + h + 6) - 6 };
    mastBox = null;
  } else {
    const cw = 292;
    const availW = canvasWidth - cw - 3 * margin;
    const availH = drawHeight - top - 6;
    let w = availW, h = w / aspect;
    if (h > availH) { h = availH; w = h * aspect; }
    planBox = { x: margin + (availW - w) / 2, y: top, w: w, h: h };
    cardBox = { x: canvasWidth - margin - cw, y: top, w: cw, h: availH };
    const spare = availH - h - 6;
    mastBox = spare > 70 ? { x: margin, y: top + h + 6, w: availW, h: spare } : null;
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 6;
  hourSlider.position(margin + 74, isNarrow() ? y0 + 26 : y0);
}

function mx(x) { return planBox.x + x / SITE_W * planBox.w; }
function my(y) { return planBox.y + y / SITE_H * planBox.h; }
function ms(v) { return v / SITE_W * planBox.w; }
function unmx(px) { return (px - planBox.x) / planBox.w * SITE_W; }
function unmy(py) { return (py - planBox.y) / planBox.h * SITE_H; }

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  hour = hourSlider.value();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(21);
  text('Station Siting Planner', canvasWidth / 2, 1);
  drawPlan();
  drawMast();
  drawCard();
  drawControlRegion();
}

function drawPlan() {
  const b = planBox;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y, b.w, b.h);
  drawingContext.clip();

  // surfaces
  for (const s of SURFACES.slice().reverse()) {
    noStroke(); fill(layers.surface ? s.col : '#eaf0e4');
    rect(mx(s.x), my(s.y), mx(s.x + s.w) - mx(s.x), my(s.y + s.h) - my(s.y));
  }

  // shadows
  if (layers.shadow) {
    const v = shadowVec(hour);
    if (v) {
      noStroke(); fill(38, 50, 56, 72);
      for (const bl of BUILDINGS) {
        const L = bl.ht * v.len;
        const pts = [[bl.x, bl.y], [bl.x + bl.w, bl.y],
                     [bl.x + bl.w, bl.y + bl.h], [bl.x, bl.y + bl.h]];
        const all = pts.concat(pts.map(p => [p[0] + v.ux * L, p[1] + v.uy * L]));
        hullShape(all);
      }
      for (const t of TREES) {
        const L = t.ht * v.len;
        const ex = t.x + v.ux * L, ey = t.y + v.uy * L;
        strokeCap(ROUND); stroke(38, 50, 56, 72);
        strokeWeight(mx(t.r * 2) - mx(0));
        line(mx(t.x), my(t.y), mx(ex), my(ey));
        noStroke();
      }
    }
  }

  // clearance circles
  if (layers.clearance) {
    noFill();
    for (const o of BUILDINGS) {
      stroke(198, 40, 40, 150); strokeWeight(1.2); drawingContext.setLineDash([4, 3]);
      const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
      ellipse(mx(cx), my(cy), (mx(o.ht * CLEAR_FACTOR) - mx(0)) * 2,
              (my(o.ht * CLEAR_FACTOR) - my(0)) * 2);
    }
    for (const t of TREES) {
      ellipse(mx(t.x), my(t.y), (mx(t.ht * CLEAR_FACTOR) - mx(0)) * 2,
              (my(t.ht * CLEAR_FACTOR) - my(0)) * 2);
    }
    drawingContext.setLineDash([]);
  }

  // buildings and trees
  for (const bl of BUILDINGS) {
    noStroke(); fill('#a1887f'); stroke('#6d4c41'); strokeWeight(1);
    rect(mx(bl.x), my(bl.y), mx(bl.x + bl.w) - mx(bl.x), my(bl.y + bl.h) - my(bl.y));
    noStroke(); fill('#ffffff'); textAlign(CENTER, CENTER); textSize(9);
    text(bl.ht + ' m', mx(bl.x + bl.w / 2), my(bl.y + bl.h / 2));
  }
  for (const t of TREES) {
    noStroke(); fill('#4e7d33'); stroke('#33521f'); strokeWeight(1);
    circle(mx(t.x), my(t.y), (mx(t.r) - mx(0)) * 2);
    noStroke(); fill('#ffffff'); textAlign(CENTER, CENTER); textSize(8);
    text(t.ht + ' m', mx(t.x), my(t.y));
  }
  // fence
  stroke('#8d6e63'); strokeWeight(1.4); noFill();
  drawingContext.setLineDash([5, 3]);
  rect(mx(1), my(1), mx(SITE_W - 1) - mx(1), my(SITE_H - 1) - my(1));
  drawingContext.setLineDash([]);

  // sky view wedges
  if (layers.sky) {
    const blocked = skyBlockedPct();
    noStroke(); fill(106, 27, 154, 40);
    circle(mx(st.x), my(st.y), ms(30) * 2);
    for (const o of BUILDINGS.map(bl => ({ x: bl.x + bl.w / 2, y: bl.y + bl.h / 2,
          r: Math.max(bl.w, bl.h) / 2, ht: bl.ht }))
         .concat(TREES.map(t => ({ x: t.x, y: t.y, r: t.r, ht: t.ht })))) {
      const a = Math.atan2(o.y - st.y, o.x - st.x);
      const d = Math.max(1, Math.hypot(st.x - o.x, st.y - o.y) - o.r);
      const hw = Math.atan2(o.r, d);
      const frac = Math.min(1, Math.atan2(o.ht, d) / (Math.PI / 2.2));
      fill(106, 27, 154, 150);
      arc(mx(st.x), my(st.y), ms(30) * 2 * frac, ms(30) * 2 * frac,
          a - hw, a + hw, PIE);
    }
    noStroke(); fill('#4a148c'); textAlign(CENTER, TOP); textSize(9);
    text(blocked.toFixed(0) + '% of the sky blocked', mx(st.x), my(st.y) + ms(31));
  }

  // the station
  const sc = scores();
  const ov = overall(sc);
  const col = ov.r === 'good' ? '#2e7d32' : (ov.r === 'marginal' ? '#ef6c00' : '#c62828');
  stroke('#ffffff'); strokeWeight(2.4); fill(col);
  circle(mx(st.x), my(st.y), 15);
  noStroke(); textAlign(CENTER, TOP); textSize(9);
  const slab = 'station (drag)';
  fill(255, 228);
  rect(mx(st.x) - textWidth(slab) / 2 - 4, my(st.y) + 9, textWidth(slab) + 8, 12, 2);
  fill(col);
  text(slab, mx(st.x), my(st.y) + 10);

  // scale bar
  const barPx = mx(20) - mx(0);
  const bx = b.x + 8, by = b.y + b.h - 8;
  stroke('#263238'); strokeWeight(2);
  line(bx, by, bx + barPx, by);
  line(bx, by - 3, bx, by + 3); line(bx + barPx, by - 3, bx + barPx, by + 3);
  noStroke(); fill('#263238'); textSize(8.5); textAlign(LEFT, BOTTOM);
  text('20 m', bx, by - 3);
  textAlign(RIGHT, BOTTOM); fill('#37474f');
  text('N up  |  ' + season.toLowerCase() + ' ' +
       String(Math.floor(hour)).padStart(2, '0') + ':' +
       (hour % 1 ? '30' : '00') + '  |  sun ' +
       degrees(sunPos(hour).el).toFixed(0) + ' deg up', b.x + b.w - 6, by + 4);

  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h);
  noStroke();
}

// An elevation of the mast, so the shield-above-solar conflict is visible as a
// shadow rather than only described in a scorecard row.
function drawMast() {
  const b = mastBox;
  if (!b) return;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('mast elevation', b.x + 8, b.y + 4);
  const gy = b.y + b.h - 14;
  const top3 = b.y + 20;
  const mPx = (gy - top3) / 3.6;             // 3.6 m of mast fits the box
  const cx = b.x + 64;
  stroke('#8fb573'); strokeWeight(3);
  line(b.x + 6, gy, b.x + b.w - 6, gy);
  stroke('#90a4ae'); strokeWeight(3);
  line(cx, gy, cx, gy - 3.4 * mPx);
  noStroke();
  const items = [
    { h: mast.shieldH, lab: 'shield', col: '#37474f' },
    { h: mast.solarH, lab: 'solar', col: '#e65100' },
    { h: mast.anemH, lab: 'anemometer', col: '#1565c0' }
  ].sort((a, b) => b.h - a.h);
  let lastY = -1e9;
  for (const it of items) {
    const y = gy - it.h * mPx;
    noStroke(); fill(it.col);
    rect(cx - 9, y - 4, 18, 8, 2);
    // push the caption down if the item above it is at the same height
    const ly = (y < lastY + 11) ? lastY + 11 : y;
    lastY = ly;
    if (Math.abs(ly - y) > 1) {
      stroke(it.col); strokeWeight(0.8);
      line(cx + 10, y, cx + 13, ly);
      noStroke();
    }
    textAlign(LEFT, CENTER); textSize(9); fill(it.col);
    text(it.lab + ' ' + it.h.toFixed(1) + ' m', cx + 14, ly);
  }
  const sy = mast.seismic === 'On the mast' ? gy - 0.8 * mPx : gy + 3;
  noStroke(); fill(mast.seismic === 'On the mast' ? '#c62828' : '#2e7d32');
  rect(cx - 7, sy - 4, 14, 8, 2);
  textAlign(LEFT, CENTER); textSize(9);
  text('seismic: ' + mast.seismic.toLowerCase(), cx + 14, sy);
  const sh = shieldShadowHours();
  textAlign(RIGHT, TOP); textSize(9.5);
  fill(sh > 0.5 ? '#b71c1c' : '#1b5e20');
  const msg = sh > 0.5
    ? 'shield shadows the solar sensor ' + sh.toFixed(1) + ' h around midday'
    : 'solar sensor is above the shield: no self-shadowing';
  const lines = wrapLines(msg, b.w * 0.44, 9.5);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], b.x + b.w - 8, b.y + 20 + i * 11);
  }
  textAlign(LEFT, TOP);
}

function hullShape(pts) {
  // convex hull, small point count so the simple gift wrap is fine
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
  beginShape();
  for (const q of hull) vertex(mx(q[0]), my(q[1]));
  endShape(CLOSE);
}

function drawCard() {
  const b = cardBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 9, W = b.w - 18;
  let y = b.y + 6;
  const sc = scores();
  const ov = overall(sc);
  const surf = surfaceUnder();
  const obs = obstructions();

  if (explain !== null) {
    const row = sc[explain];
    const col = row.r === 'good' ? '#1b5e20' : (row.r === 'marginal' ? '#e65100' : '#b71c1c');
    fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
    text('why this score', L, y);
    y += 14;
    fill(col); textSize(12.5); textStyle(BOLD);
    text(row.s + ': ' + row.r, L, y);
    textStyle(NORMAL); y += 18;
    fill('#33475b'); textSize(10.5);
    y = para(L, y, W, row.why, 12.5, 10.5) + 8;
    fill('#78909c'); textSize(9.5);
    para(L, y, W, 'Click any other row to compare, or Back to the scorecard.', 11, 9.5);
    return;
  }

  // header: where you are standing
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('beneath you: ' + surf.name + ', albedo ' + surf.albedo.toFixed(2), L, y);
  y += 12;
  const w0 = obs[0];
  fill(w0.d >= w0.need ? '#1b5e20' : '#b71c1c'); textSize(9.5);
  text(w0.name + ' ' + w0.ht + ' m tall, needs ' + w0.need + ' m, you are at ' +
       w0.d.toFixed(0) + ' m ' + (w0.d >= w0.need ? 'PASS' : 'FAIL'), L, y);
  y += 12;
  const sh = shadeHours('Summer'), shW = shadeHours('Winter');
  fill('#546e7a'); textSize(9.5);
  text('shade: ' + sh.shaded.toFixed(1) + ' of ' + sh.daylight.toFixed(1) +
       ' h summer, ' + shW.shaded.toFixed(1) + ' of ' + shW.daylight.toFixed(1) +
       ' h winter (sun above 10 deg)', L, y);
  y += 15;

  rowHits = [];
  const rowH = Math.min(21, (b.h - (y - b.y) - 62) / SENSORS.length);
  for (let i = 0; i < sc.length; i++) {
    const r = sc[i];
    const col = r.r === 'good' ? '#2e7d32' : (r.r === 'marginal' ? '#ef6c00' : '#c62828');
    noStroke(); fill(r.r === 'good' ? '#f1f8f2' : (r.r === 'marginal' ? '#fff8e1' : '#fdeeee'));
    rect(L, y, W, rowH - 2, 3);
    fill(col); rect(L, y, 4, rowH - 2, 2);
    fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(10);
    text(r.s, L + 10, y + (rowH - 2) / 2);
    fill(col); textAlign(RIGHT, CENTER); textSize(9.5);
    text(r.r, L + W - 38, y + (rowH - 2) / 2);
    fill('#8a97a4'); textSize(8.5); textAlign(RIGHT, CENTER);
    text('explain', L + W - 4, y + (rowH - 2) / 2);
    rowHits.push({ x: L, y: y, w: W, h: rowH - 2, i: i });
    y += rowH;
  }
  y += 4;
  const ocol = ov.r === 'good' ? '#1b5e20' : (ov.r === 'marginal' ? '#e65100' : '#b71c1c');
  noStroke(); fill(ov.r === 'good' ? '#e8f5e9' : (ov.r === 'marginal' ? '#fff8e1' : '#fdeeee'));
  rect(L, y, W, b.y + b.h - y - 6, 3);
  fill(ocol); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
  text('Verdict: ' + ov.r, L + 6, y + 4);
  textStyle(NORMAL); textSize(9.8); fill('#33475b');
  para(L + 6, y + 19, W - 12, ov.msg, 11, 9.8);
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 6;
  const narrow = isNarrow();
  chipHits = [];

  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(10.5);
  text('Time of day', margin, (narrow ? y0 + 26 : y0) + 11);
  let x = margin + 236;
  if (narrow) x = margin;
  const sy = narrow ? y0 : y0;
  x = chip(x, sy, 'Summer', season === 'Summer') + 5;
  x = chip(x, sy, 'Winter', season === 'Winter') + 5;
  if (!narrow) {
    x = chip(x, sy, 'shadows', layers.shadow) + 5;
    x = chip(x, sy, 'clearance', layers.clearance) + 5;
    x = chip(x, sy, 'surfaces', layers.surface) + 5;
    chip(x, sy, 'sky view', layers.sky);
  }
  let y2 = narrow ? y0 + 52 : y0 + 30;
  if (narrow) {
    x = margin;
    x = chip(x, y2, 'shadows', layers.shadow) + 5;
    x = chip(x, y2, 'clearance', layers.clearance) + 5;
    x = chip(x, y2, 'surfaces', layers.surface) + 5;
    chip(x, y2, 'sky view', layers.sky);
    y2 += 28;
  }

  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(10);
  text('Try a tempting spot', margin, y2);
  y2 += 13;
  x = margin;
  for (const k of Object.keys(CANDIDATES)) {
    textSize(10);
    const w = textWidth(k) + 14;
    if (x + w > canvasWidth - margin) { x = margin; y2 += 23; }
    chipSm(x, y2, k, Math.abs(st.x - CANDIDATES[k].x) < 1.5 &&
                     Math.abs(st.y - CANDIDATES[k].y) < 1.5);
    x += w + 4;
  }
  y2 += 27;

  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(10);
  text('Mast', margin, y2);
  y2 += 13;
  x = margin;
  x = chipSm(x, y2, 'shield 1.5 m', mast.shieldH === 1.5) + 4;
  x = chipSm(x, y2, 'shield 2.5 m', mast.shieldH === 2.5) + 4;
  x = chipSm(x, y2, 'solar 2.0 m', mast.solarH === 2.0) + 4;
  x = chipSm(x, y2, 'solar 3.0 m', mast.solarH === 3.0) + 4;
  if (x > canvasWidth - margin - 150) { x = margin; y2 += 23; }
  x = chipSm(x, y2, 'seismic on mast', mast.seismic === 'On the mast') + 4;
  x = chipSm(x, y2, 'ground stake', mast.seismic === 'Ground stake') + 4;
  x = chipSm(x, y2, 'anemometer 1.2 m', mast.anemH === 1.2) + 4;
  chipSm(x, y2, 'anemometer 2.0 m', mast.anemH === 2.0);

  if (explain !== null) chip(canvasWidth - margin - 60, y0, 'Back', false);
}

function chip(x, y, label, on) {
  textSize(10.5); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 14;
  const h = 22;
  noStroke(); fill(on ? '#1565c0' : '#e8eef4');
  stroke(on ? '#0d47a1' : '#b6c4d2'); strokeWeight(1);
  rect(x, y, w, h, 5);
  noStroke(); fill(on ? '#ffffff' : '#33475b');
  text(label, x + w / 2, y + h / 2 + 1);
  chipHits.push({ x: x, y: y, w: w, h: h, label: label });
  return x + w;
}

function chipSm(x, y, label, on) {
  textSize(10); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 14;
  const h = 20;
  noStroke(); fill(on ? '#1565c0' : '#eef2f6');
  stroke(on ? '#0d47a1' : '#c3ced8'); strokeWeight(1);
  rect(x, y, w, h, 4);
  noStroke(); fill(on ? '#ffffff' : '#37474f');
  text(label, x + w / 2, y + h / 2 + 1);
  chipHits.push({ x: x, y: y, w: w, h: h, label: 'sm:' + label });
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
  for (const r of rowHits) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      explain = r.i;
      return false;
    }
  }
  if (mouseX >= planBox.x && mouseX <= planBox.x + planBox.w &&
      mouseY >= planBox.y && mouseY <= planBox.y + planBox.h) {
    dragging = true; setStation(); return false;
  }
  return true;
}
function mouseDragged() { if (dragging) { setStation(); return false; } return true; }
function mouseReleased() { dragging = false; return true; }

function setStation() {
  st = { x: constrain(unmx(mouseX), 2, SITE_W - 2),
         y: constrain(unmy(mouseY), 2, SITE_H - 2) };
}

function onChip(label) {
  if (label === 'Back') { explain = null; return; }
  if (label === 'Summer' || label === 'Winter') { season = label; return; }
  if (label === 'shadows') { layers.shadow = !layers.shadow; return; }
  if (label === 'clearance') { layers.clearance = !layers.clearance; return; }
  if (label === 'surfaces') { layers.surface = !layers.surface; return; }
  if (label === 'sky view') { layers.sky = !layers.sky; return; }
  if (label.indexOf('sm:') !== 0) return;
  const k = label.slice(3);
  if (CANDIDATES[k]) { st = { x: CANDIDATES[k].x, y: CANDIDATES[k].y }; explain = null; return; }
  if (k === 'shield 1.5 m') mast.shieldH = 1.5;
  else if (k === 'shield 2.5 m') mast.shieldH = 2.5;
  else if (k === 'solar 2.0 m') mast.solarH = 2.0;
  else if (k === 'solar 3.0 m') mast.solarH = 3.0;
  else if (k === 'seismic on mast') mast.seismic = 'On the mast';
  else if (k === 'ground stake') mast.seismic = 'Ground stake';
  else if (k === 'anemometer 1.2 m') mast.anemH = 1.2;
  else if (k === 'anemometer 2.0 m') mast.anemH = 2.0;
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
  let ln = '';
  for (const w of words) {
    const trial = ln.length ? ln + ' ' + w : w;
    if (textWidth(trial) > maxW && ln.length) { out.push(ln); ln = w; }
    else ln = trial;
  }
  out.push(ln);
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
