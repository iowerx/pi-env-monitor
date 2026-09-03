// Inertial Mass Seismometer MicroSim
// CANVAS_HEIGHT: 658
// Bloom Level: Understand (L2) - the learner explains how a suspended mass gives
// a stationary reference inside a moving frame, and predicts what stiffening the
// suspension does to the record.
// The mass is a damped harmonic oscillator driven by the frame. Ground position,
// mass position and their difference are all on screen at once, as numbers and as
// motion, because the difference is the only thing a seismometer can record.
// Stiffen the spring and the difference disappears - that failure is the lesson.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 158;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 690;
const COIL_N_PER_A = 150;   // motor constant of the feedback coil

// ---- ground motion presets: dominant period T (s), amplitude (mm) ----
const GROUND = {
  'Distant small earthquake': { T: 4.0,  amp: 0.35, burst: 18, speed: 1, note: 'Long period, small amplitude.' },
  'Nearby large earthquake':  { T: 0.6,  amp: 8.0,  burst: 12, speed: 1, note: 'Short period, large amplitude.' },
  'Passing truck':            { T: 0.12, amp: 0.06, burst: 6,  speed: 1, note: 'Very short period. Cultural noise, not an earthquake.' },
  'Slow tilt (landslide)':    { T: 40.0, amp: 22.0, burst: 0,  speed: 8, note: 'Almost a steady lean. Shown at 8x time.' },
  'Manual shake (drag)':      { T: 1.0,  amp: 0.0,  burst: 0,  speed: 1, note: 'Drag left and right on the cutaway.' }
};

// ---- state ----
let preset = 'Nearby large earthquake';
let massKg = 5;
let stiffness = 8;             // N/m
let zeta = 0.7;
let feedback = false;
let running = true;

let simT = 0;                  // seconds of simulated time
let xg = 0, vg = 0, ag = 0;    // ground displacement (mm), velocity, acceleration
let z = 0, zdot = 0;           // mass position relative to the frame, in mm
let holdCurrent = 0;           // mA, force feedback mode
let manualX = 0, manualPrev = 0, dragging = false;
let trace = [];                // {t, v}
let chipHits = [];
let gSelect, massSlider, stiffSlider, dampSlider;
let cutBox = { x: 0, y: 0, w: 10, h: 10 };
let traceBox = { x: 0, y: 0, w: 10, h: 10 };
let infoBox = { x: 0, y: 0, w: 10, h: 10 };
let respBox = null;

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  gSelect = createSelect();
  for (const k of Object.keys(GROUND)) gSelect.option(k);
  gSelect.elt.value = preset;
  gSelect.changed(() => { preset = gSelect.value(); resetRun(); });
  gSelect.parent(document.querySelector('main'));

  massSlider = createSlider(0.5, 20, 5, 0.5);
  stiffSlider = createSlider(0, 100, 26, 1);      // log scale, mapped below
  dampSlider = createSlider(5, 300, 70, 5);       // zeta x 100
  for (const s of [massSlider, stiffSlider, dampSlider]) {
    s.parent(document.querySelector('main'));
    s.style('width', '132px');
  }

  resetRun();
  layoutControls();
  describe('A cutaway seismometer whose suspended mass, moving frame and recorded ' +
           'relative motion are shown together, with sliders for mass, suspension ' +
           'stiffness and damping.');
}

// ---- model ---------------------------------------------------------------

// The stiffness slider is logarithmic so the natural period sweeps from about
// 20 seconds down to a tenth of a second across its travel.
function kOf() { return 2 * Math.pow(10, stiffSlider.value() / 100 * 4.0); }
function natPeriod() { return 2 * Math.PI * Math.sqrt(massKg / kOf()); }
function omega0() { return Math.sqrt(kOf() / massKg); }

function resetRun() {
  simT = 0; z = 0; zdot = 0; xg = 0; vg = 0; ag = 0;
  manualX = 0; manualPrev = 0; holdCurrent = 0;
  trace = [];
}

// Ground displacement in mm at simulated time t.
function groundAt(t) {
  const g = GROUND[preset];
  if (preset === 'Manual shake (drag)') return manualX;
  const w = 2 * Math.PI / g.T;
  let env = 1;
  if (g.burst > 0) {
    const cyc = g.burst * g.T;              // length of one shaking episode
    const gap = cyc * 0.55;
    const tp = t % (cyc + gap);
    env = tp < cyc ? Math.sin(Math.PI * tp / cyc) : 0;
    env = Math.pow(env, 0.6);
  }
  return g.amp * env * Math.sin(w * t);
}

function stepPhysics() {
  const g = GROUND[preset];
  const sub = 24;
  const dt = (1 / 60) * g.speed / sub;
  const w0 = omega0();
  for (let i = 0; i < sub; i++) {
    const t0 = simT, t1 = simT + dt;
    const x0 = groundAt(t0), x1 = groundAt(t1), x2 = groundAt(t1 + dt);
    // ground acceleration by central difference, in mm/s^2
    ag = (x2 - 2 * x1 + x0) / (dt * dt);
    if (feedback) {
      // the coil holds the mass at the centre; the output is the force it needs
      z = 0; zdot = 0;
      // force to hold the mass still, divided by a 150 N/A coil constant
      holdCurrent = -(massKg * ag / 1000) / COIL_N_PER_A * 1000;
    } else {
      const zacc = -ag - 2 * zeta * w0 * zdot - w0 * w0 * z;
      zdot += zacc * dt;
      z += zdot * dt;
    }
    vg = (x1 - x0) / dt;
    xg = x1;
    simT = t1;
  }
}

// What the pen writes: frame position minus mass position.
function recorded() { return feedback ? holdCurrent : -z; }

function traceWindow() {
  const g = GROUND[preset];
  return Math.min(60, Math.max(6, g.T * 6));
}

function verdict() {
  const g = GROUND[preset];
  const T0 = natPeriod();
  if (feedback) {
    return ['Force feedback: response is flat across frequencies.',
            'The coil holds the mass at the centre and the current it needs is ' +
            'the output. The suspension period no longer sets the passband.'];
  }
  if (preset === 'Manual shake (drag)') {
    return ['Drag the bedrock to shake it yourself.',
            'Shake faster than ' + T0.toFixed(1) + ' s per cycle and the mass ' +
            'lags behind. Lean slowly and it follows you.'];
  }
  const ratio = T0 / g.T;
  if (ratio >= 3) {
    return ['Ground motion is faster than the suspension period. The mass stays ' +
            'put. Good recording.',
            'Period ratio ' + ratio.toFixed(1) + ' to 1. Nearly all of the ground ' +
            'displacement appears as relative motion.'];
  }
  if (ratio >= 1.2) {
    return ['Near resonance. The record is distorted.',
            'The ground period and the suspension period are within a factor of ' +
            'three. Amplitudes here are not trustworthy.'];
  }
  return ['Ground motion is slower than the suspension period. The mass follows ' +
          'the frame. Recording is attenuated.',
          'A stiff suspension makes the mass follow the ground. There is no ' +
          'relative motion left to record. This is why seismometers use soft ' +
          'suspensions and heavy masses.'];
}

function dampLabel() {
  if (zeta < 0.5) return 'Underdamped: the trace rings after the shaking stops';
  if (zeta <= 1.0) return 'Well damped: clean. 0.7 is the standard seismometer choice';
  return 'Overdamped: sluggish and attenuated';
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 32;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    cutBox = { x: margin, y: top, w: w, h: 210 };
    traceBox = { x: margin, y: top + 214, w: w, h: 84 };
    infoBox = { x: margin, y: top + 302, w: w, h: drawHeight - (top + 302) - 6 };
    respBox = null;
  } else {
    const cw = Math.round((canvasWidth - 3 * margin) * 0.46);
    cutBox = { x: margin, y: top, w: cw, h: 300 };
    respBox = { x: margin, y: top + 308, w: cw, h: drawHeight - (top + 308) - 6 };
    const rx = margin * 2 + cw;
    const rw = canvasWidth - rx - margin;
    traceBox = { x: rx, y: top, w: rw, h: 150 };
    infoBox = { x: rx, y: top + 156, w: rw, h: drawHeight - (top + 156) - 6 };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  const narrow = isNarrow();
  const col2 = narrow ? margin : Math.round(canvasWidth * 0.5);
  gSelect.position(margin + 96, y0);
  gSelect.style('width', Math.min(210, canvasWidth - margin - 106) + 'px');
  massSlider.position(margin + 96, y0 + 28);
  stiffSlider.position(margin + 96, y0 + 52);
  dampSlider.position(margin + 96, y0 + 76);
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  massKg = massSlider.value();
  zeta = dampSlider.value() / 100;
  if (running) stepPhysics();
  else { xg = groundAt(simT); }
  if (running) {
    trace.push({ t: simT, v: recorded() });
    const cutoff = simT - traceWindow();
    while (trace.length && trace[0].t < cutoff) trace.shift();
  }

  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(24);
  text('Inertial Mass Seismometer', canvasWidth / 2, 3);

  drawCutaway();
  drawTrace();
  drawReadout();
  drawControlRegion();
}

// Everything in the cutaway is drawn at one gain so ground and mass motion are
// directly comparable by eye.
function gainPx() {
  const g = GROUND[preset];
  const ref = preset === 'Manual shake (drag)' ? 8 : g.amp;
  return ref > 0 ? Math.min(70, 26 / ref) : 26;
}

function drawCutaway() {
  const b = cutBox;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y, b.w, b.h);
  drawingContext.clip();

  noStroke(); fill('#eef4f9');
  rect(b.x, b.y, b.w, b.h);

  const gp = gainPx();
  const gx = constrain(xg * gp, -b.w * 0.22, b.w * 0.22);
  const cx = b.x + b.w / 2;
  const rockY = b.y + b.h - 34;

  // bedrock, shifted by the ground displacement
  fill('#8d7f6a'); noStroke();
  rect(b.x - 40 + gx, rockY, b.w + 80, b.h);
  stroke('#6d604d'); strokeWeight(1);
  for (let i = -3; i < 26; i++) {
    const hx = b.x + i * 16 + gx;
    line(hx, rockY, hx - 10, rockY + 14);
  }
  noStroke(); fill('#e8dfcd');
  textAlign(LEFT, TOP); textSize(9);
  text('bedrock', b.x + 6, rockY + 4);

  // the case is bolted to the rock, so it moves with it
  const caseW = Math.min(200, b.w - 40), caseH = Math.min(b.h - 56, 240);
  const caseX = cx - caseW / 2 + gx, caseY = rockY - caseH;
  noFill(); stroke('#37474f'); strokeWeight(3);
  rect(caseX, caseY, caseW, caseH, 3);
  noStroke(); fill('#37474f');
  circle(caseX + 8, rockY - 6, 6); circle(caseX + caseW - 8, rockY - 6, 6);

  // suspension and mass
  const mY = caseY + caseH * 0.42;
  const mW = 34 + massKg * 1.6, mH = 22;
  const mx = cx + z * gp + gx;
  stroke('#78909c'); strokeWeight(2); noFill();
  const springTop = caseY + 12;
  beginShape();
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    vertex(caseX + caseW / 2 + (mx - (caseX + caseW / 2)) * t +
           (i % 2 === 0 ? -7 : 7) * Math.sin(t * Math.PI),
           springTop + (mY - mH / 2 - springTop) * t);
  }
  endShape();
  noStroke(); fill(feedback ? '#6a1b9a' : '#455a64');
  rect(mx - mW / 2, mY - mH / 2, mW, mH, 3);
  fill(255); textAlign(CENTER, CENTER); textSize(10);
  text(massKg.toFixed(1) + ' kg', mx, mY + 1);

  if (feedback) {
    // coil either side of the mass, actively holding it centred
    noStroke(); fill('#ce93d8');
    rect(caseX + 10, mY - 14, 12, 28, 2);
    rect(caseX + caseW - 22, mY - 14, 12, 28, 2);
    stroke('#6a1b9a'); strokeWeight(1.6);
    line(caseX + 22, mY, mx - mW / 2, mY);
    line(mx + mW / 2, mY, caseX + caseW - 22, mY);
    noStroke(); fill('#6a1b9a'); textAlign(CENTER, BOTTOM); textSize(9);
    text('coil holds the mass centred', cx + gx, mY - 18);
  }

  // pen arm from the mass to the drum
  const drumR = constrain(caseH * 0.085, 12, 22);
  const drumX = caseX + caseW - drumR - 8, drumY = caseY + caseH - drumR - 10;
  stroke('#c62828'); strokeWeight(2);
  line(mx, mY + mH / 2, mx, drumY - drumR - 4);
  line(mx, drumY - drumR - 4, drumX, drumY - drumR - 4);
  noStroke(); fill('#c62828');
  circle(drumX, drumY - drumR - 2, 5);
  // the drum turns with the case
  noStroke(); fill('#eceff1'); stroke('#607d8b'); strokeWeight(1.5);
  circle(drumX, drumY, drumR * 2);
  noStroke(); fill('#90a4ae');
  const spin = (simT * 1.4) % (Math.PI * 2);
  for (let i = 0; i < 3; i++) {
    const a = spin + i * 2.09;
    circle(drumX + Math.cos(a) * drumR * 0.6, drumY + Math.sin(a) * drumR * 0.6, 3);
  }
  // the pen's own scribble on the drum face
  stroke('#c62828'); strokeWeight(1.2); noFill();
  beginShape();
  const n = Math.min(trace.length, 60);
  for (let i = 0; i < n; i++) {
    const r = trace[trace.length - n + i];
    const t = i / Math.max(1, n - 1);
    vertex(drumX - drumR * 0.8 + t * drumR * 1.6,
           drumY - drumR * 0.55 + constrain(r.v * gp * 0.25, -8, 8));
  }
  endShape();
  if (drumR >= 16) {
    noStroke(); fill('#607d8b'); textAlign(CENTER, TOP); textSize(9);
    text('drum', drumX, drumY + drumR + 2);
  }

  // Two references. The solid one does not move with anything; the dashed one
  // is the case centre. The gap between them IS the ground displacement, and the
  // mass sitting on the solid line is the whole idea of the instrument.
  stroke('#1565c0'); strokeWeight(1.4);
  line(cx, b.y + 16, cx, rockY + 22);
  noStroke(); fill('#1565c0'); textAlign(CENTER, TOP); textSize(9);
  text('space-fixed', cx, b.y + 4);
  stroke('#b0bec5'); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(cx + gx, caseY + 6, cx + gx, caseY + caseH - 6);
  drawingContext.setLineDash([]);
  if (Math.abs(gx) > 4) {
    stroke('#f5ede0'); strokeWeight(1.6);
    const ay = rockY + 14;
    line(cx, ay, cx + gx, ay);
    line(cx + gx, ay, cx + gx - Math.sign(gx) * 5, ay - 3);
    line(cx + gx, ay, cx + gx - Math.sign(gx) * 5, ay + 3);
    noStroke(); fill('#fff3e0'); textAlign(CENTER, TOP); textSize(9);
    text(xg.toFixed(2) + ' mm ground', cx + gx / 2, ay + 3);
  }

  noStroke(); fill('#37474f'); textAlign(LEFT, TOP); textSize(9);
  text('drawn at ' + gainPx().toFixed(0) + ' px per mm', b.x + 6, b.y + 5);
  if (preset === 'Manual shake (drag)') {
    fill('#1565c0'); textAlign(RIGHT, TOP);
    text('drag here', b.x + b.w - 6, b.y + 5);
  }

  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h);
  noStroke();
}

function drawTrace() {
  const b = traceBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const mid = b.y + b.h / 2 + 5;
  stroke('#dfe6ec'); strokeWeight(1);
  line(b.x + 4, mid, b.x + b.w - 4, mid);
  noStroke(); fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text(feedback ? 'Seismogram: holding current (mA)'
                : 'Seismogram: frame minus mass (mm)', b.x + 6, b.y + 4);
  textAlign(RIGHT, TOP);
  text(traceWindow().toFixed(0) + ' s window', b.x + b.w - 6, b.y + 4);

  if (trace.length < 2) return;
  // autoscale, but never magnify a flat line into a fake wiggle
  let peak = 0;
  for (const r of trace) peak = Math.max(peak, Math.abs(r.v));
  const g = GROUND[preset];
  const full = feedback ? Math.max(peak, 1) : Math.max(g.amp * 1.15, 0.02);
  const half = (b.h - 26) / 2;
  const t1 = simT, t0 = simT - traceWindow();
  stroke('#c62828'); strokeWeight(1.5); noFill();
  beginShape();
  for (const r of trace) {
    const px = b.x + 6 + (r.x = (r.t - t0) / (t1 - t0)) * (b.w - 12);
    vertex(px, mid - constrain(r.v / full, -1, 1) * half);
  }
  endShape();
  noStroke(); fill('#8a97a4'); textAlign(RIGHT, BOTTOM); textSize(9);
  text('full scale ' + full.toFixed(2) + (feedback ? ' mA' : ' mm'),
       b.x + b.w - 6, b.y + b.h - 3);
  fill('#c62828'); textAlign(LEFT, BOTTOM);
  text('peak ' + peak.toFixed(3), b.x + 6, b.y + b.h - 3);
}

function drawReadout() {
  const b = infoBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 9, W = b.w - 18;
  let y = b.y + 7;
  const massAbs = xg + z;

  y = row(L, y, W, 'Ground', xg.toFixed(3) + ' mm');
  y = row(L, y, W, 'Mass', massAbs.toFixed(3) + ' mm');
  fill('#c62828');
  y = row(L, y, W, 'Relative', (-recordedRaw()).toFixed(3) + ' mm', '#c62828');
  fill('#8a97a4'); textSize(9.5); textAlign(LEFT, TOP);
  text('this is what gets recorded', L + 76, y - 2);
  y += 12;

  const T0 = natPeriod();
  y = row(L, y, W, 'Suspension', T0.toFixed(2) + ' s natural period');
  y = row(L, y, W, 'Ground period',
          preset === 'Manual shake (drag)' ? 'you set it' : GROUND[preset].T + ' s');
  if (feedback) y = row(L, y, W, 'Holding current', holdCurrent.toFixed(2) + ' mA');
  y += 3;

  const v = verdict();
  const good = v[0].indexOf('Good recording') >= 0 || feedback;
  fill(good ? '#1b5e20' : (v[0].indexOf('resonance') >= 0 ? '#e65100' : '#b71c1c'));
  textSize(10.8);
  y = para(L, y, W, v[0], 12.5, 10.8);
  y += 2;
  fill('#33475b'); textSize(10.2);
  y = para(L, y, W, v[1], 12, 10.2);

  if (respBox) {
    noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
    rect(respBox.x, respBox.y, respBox.w, respBox.h, 4);
    noStroke();
    drawResponse(respBox.x + 9, respBox.y + 4, respBox.w - 18, respBox.h - 8);
  } else if (b.y + b.h - y > 96) {
    drawResponse(L, b.y + b.h - 92, W, 84);
  }
}

// |relative / ground| for a sinusoid of period T, the standard seismometer
// response. Below the suspension period it falls away as the square of the
// frequency ratio, which is what the verdict is describing in words.
function responseAt(T) {
  const r = natPeriod() / T;
  const rr = r * r;
  return rr / Math.sqrt((1 - rr) * (1 - rr) + (2 * zeta * r) * (2 * zeta * r));
}

function drawResponse(L, y, W, H) {
  const x0 = L + 26, x1 = L + W - 6, y0 = y + 12, y1 = y + H - 12;
  const lo = Math.log10(0.05), hi = Math.log10(100);
  const px = (T) => x0 + (Math.log10(T) - lo) / (hi - lo) * (x1 - x0);
  const py = (a) => y1 - Math.min(1.15, a) / 1.15 * (y1 - y0);

  noStroke(); fill('#f7f9fb');
  rect(x0, y0, x1 - x0, y1 - y0);
  stroke('#dfe6ec'); strokeWeight(1);
  line(x0, py(1), x1, py(1));
  noStroke(); fill('#8a97a4'); textAlign(RIGHT, CENTER); textSize(8.5);
  text('1.0', x0 - 3, py(1));
  text('0', x0 - 3, y1);

  stroke('#1565c0'); strokeWeight(1.6); noFill();
  if (feedback) {
    line(x0, py(1), x1, py(1));
    noStroke(); fill('#6a1b9a'); textAlign(CENTER, TOP); textSize(9);
    text('force feedback: flat across the whole band', (x0 + x1) / 2, py(1) + 6);
    return;
  }
  beginShape();
  for (let i = 0; i <= 120; i++) {
    const T = Math.pow(10, lo + (hi - lo) * i / 120);
    vertex(px(T), py(responseAt(T)));
  }
  endShape();

  const T0 = natPeriod();
  stroke('#90a4ae'); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(px(T0), y0, px(T0), y1);
  drawingContext.setLineDash([]);
  noStroke(); fill('#607d8b'); textAlign(CENTER, TOP); textSize(8.5);
  text('T0', px(T0), y1 + 1);

  if (preset !== 'Manual shake (drag)') {
    const Tg = GROUND[preset].T;
    const a = responseAt(Tg);
    stroke('#c62828'); strokeWeight(1.4);
    line(px(Tg), y0, px(Tg), y1);
    noStroke(); fill('#c62828');
    circle(px(Tg), py(a), 6);
    textAlign(CENTER, TOP); textSize(8.5);
    text('ground', px(Tg), y1 + 1);
    textAlign(RIGHT, TOP);
    text('records ' + (a * 100).toFixed(0) + '%', x1 - 3, y0 + 2);
  }
  noStroke(); fill('#5a6a78'); textAlign(LEFT, BOTTOM); textSize(8.5);
  text('response vs ground period (0.05 to 100 s, log)', x0, y0 - 2);
}

function recordedRaw() { return feedback ? 0 : z; }

function row(L, y, W, k, v, col) {
  textAlign(LEFT, TOP); textSize(10.5);
  fill('#5a6a78'); text(k, L, y);
  fill(col || '#0d2b45'); textSize(11);
  text(v, L + Math.min(76, W * 0.36), y);
  return y + 15;
}

function para(L, y, W, s, lh, size) {
  const lines = wrapLines(s, W, size);
  for (let i = 0; i < lines.length; i++) text(lines[i], L, y + i * lh);
  return y + lines.length * lh;
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 8;
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
  text('Ground motion', margin, y0 + 11);
  text('Mass', margin, y0 + 39);
  text('Stiffness', margin, y0 + 63);
  text('Damping', margin, y0 + 87);

  const vx = margin + 234;
  fill('#33475b'); textSize(10.5);
  text(massKg.toFixed(1) + ' kg', vx, y0 + 39);
  text('period ' + natPeriod().toFixed(2) + ' s', vx, y0 + 63);
  text('zeta ' + zeta.toFixed(2), vx, y0 + 87);
  if (!isNarrow()) {
    fill('#5a6a78'); textSize(10);
    text(dampLabel(), vx + 92, y0 + 87);
    text(GROUND[preset].note, margin + 314, y0 + 11);
  }

  chipHits = [];
  const cy = isNarrow() ? y0 + 118 : y0 + 108;
  let x = margin;
  x = chip(x, cy, 'Force feedback mode', feedback) + 6;
  x = chip(x, cy, running ? 'Pause' : 'Play', !running) + 6;
  chip(x, cy, 'Reset', false);
  if (isNarrow()) {
    fill('#5a6a78'); textSize(9.5); textAlign(LEFT, TOP);
    text(dampLabel(), margin, y0 + 100);
  }
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
      if (c.label === 'Force feedback mode') { feedback = !feedback; trace = []; }
      else if (c.label === 'Reset') resetRun();
      else running = !running;
      return false;
    }
  }
  if (inCut(mouseX, mouseY) && preset === 'Manual shake (drag)') {
    dragging = true;
    manualX = (mouseX - (cutBox.x + cutBox.w / 2)) / gainPx();
    return false;
  }
  return true;
}

function mouseDragged() {
  if (dragging) {
    manualX = constrain((mouseX - (cutBox.x + cutBox.w / 2)) / gainPx(), -12, 12);
    return false;
  }
  return true;
}

function mouseReleased() { dragging = false; return true; }

function inCut(px, py) {
  return px >= cutBox.x && px <= cutBox.x + cutBox.w &&
         py >= cutBox.y && py <= cutBox.y + cutBox.h;
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
