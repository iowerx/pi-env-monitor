// GPS Trilateration Explorer MicroSim
// CANVAS_HEIGHT: 580
// Bloom Level: Understand (L2) - the learner explains how distances from known
// satellites fix a position, and why the receiver clock is an extra unknown.
// Step-controlled, not animated. The learner has to be able to stop on the
// three-satellites-with-a-clock-error state and sit with the fact that the
// circles do not meet. That is the moment the extra satellite stops being
// arbitrary.
// A magnified inset is essential here: one microsecond of clock error is 300 m,
// which is invisible on a view 60 000 km across.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 200;

const NARROW_BREAKPOINT = 700;

// ---- physical constants ----
const C_KM_PER_MS = 299.792458;      // kilometres per millisecond
const C_KM_PER_US = 0.299792458;     // kilometres per microsecond
const VIEW_KM = 60000;
const R_SAT = 24000;                 // satellite orbit radius in this 2D toy
// The inset span follows the clock error. With the clock right, it zooms to a
// few tens of metres so the uncertainty triangle - whose shape is set entirely
// by satellite geometry - is visible. With a clock error it pulls back far
// enough to show the whole offset.
function insetSpanKm() {
  return max(0.06, 6 * abs(C_KM_PER_US * clockErrUs()));
}

// ---- controls ----
let satButtons = [];
let errSlider;
let solveButton, goodButton, poorButton, resetButton;

// ---- state ----
let active = [true, true, true, false, false, false];
let satAngles = [0, 60, 120, 180, 240, 300];
// Fixed per-satellite range biases in metres. Real receivers see these from
// ionospheric delay and multipath; here they exist so that satellite geometry
// visibly changes the size of the uncertainty region.
const BIAS_M = [4.5, -3.0, 2.2, -5.1, 3.6, -1.4];
let rx = 2000, ry = -1500;
let dragging = false;
let solution = null;
let mainRect = { x: 0, y: 0, w: 1, h: 1 };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  for (let i = 0; i < 6; i++) {
    const b = createButton('S' + (i + 1));
    b.mousePressed(function () { active[i] = !active[i]; solution = null; });
    satButtons.push(b);
  }

  errSlider = createSlider(-200, 200, 0, 1);   // hundredths of a microsecond
  solveButton = createButton('Solve clock error');
  solveButton.mousePressed(solve);
  goodButton = createButton('Good geom.');
  goodButton.mousePressed(function () {
    satAngles = [0, 60, 120, 180, 240, 300];
    solution = null;
  });
  poorButton = createButton('Poor geom.');
  poorButton.mousePressed(function () {
    satAngles = [20, 35, 50, 65, 80, 95];
    solution = null;
  });
  resetButton = createButton('Reset');
  resetButton.mousePressed(function () {
    active = [true, true, true, false, false, false];
    satAngles = [0, 60, 120, 180, 240, 300];
    errSlider.value(0);
    rx = 2000; ry = -1500;
    solution = null;
  });

  layoutControls();

  describe('A two-dimensional simplification of satellite positioning. Satellites ring ' +
           'the view and each broadcasts a time; the receiver turns each travel time ' +
           'into a distance and draws a circle. Turning satellites on one at a time ' +
           'collapses the possible positions from a whole circle to two points to one. ' +
           'A magnified inset shows the fix at four kilometres across, where a receiver ' +
           'clock error of a microsecond pulls the lines apart into a triangle that no ' +
           'longer has a solution until the clock itself is treated as an unknown.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 82;
  for (let i = 0; i < 6; i++) satButtons[i].position(10 + i * 44, r1);
  errSlider.position(sliderLeftMargin, r2 + 4);
  errSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  solveButton.position(10, r3);
  goodButton.position(131, r3);
  poorButton.position(229, r3);
  resetButton.position(325, r3);
}

// ---- model --------------------------------------------------------------

function clockErrUs() { return errSlider.value() / 100; }

function satPos(i) {
  const a = radians(satAngles[i]);
  return { x: cos(a) * R_SAT, y: sin(a) * R_SAT };
}

function trueDist(i) {
  const s = satPos(i);
  return sqrt(sq(s.x - rx) + sq(s.y - ry));
}

// what the receiver believes the distance is, clock error and all
function pseudoRange(i) {
  return trueDist(i) + BIAS_M[i] / 1000 + C_KM_PER_US * clockErrUs();
}

function activeList() {
  const out = [];
  for (let i = 0; i < 6; i++) if (active[i]) out.push(i);
  return out;
}

// Least squares for (dx, dy, bias) against the linearised range equations.
// y_i = -e_i . delta + b, where e_i is the unit vector from receiver to satellite.
function solve() {
  const list = activeList();
  if (list.length < 3) {
    solution = { failed: 'Turn on at least three satellites first.' };
    return;
  }
  let a11 = 0, a12 = 0, a13 = 0, a22 = 0, a23 = 0, a33 = 0;
  let b1 = 0, b2 = 0, b3 = 0;
  for (let k = 0; k < list.length; k++) {
    const i = list[k];
    const s = satPos(i);
    const d = trueDist(i);
    const ex = (s.x - rx) / d, ey = (s.y - ry) / d;
    const g = [-ex, -ey, 1];
    const y = pseudoRange(i) - d;
    a11 += g[0] * g[0]; a12 += g[0] * g[1]; a13 += g[0] * g[2];
    a22 += g[1] * g[1]; a23 += g[1] * g[2]; a33 += g[2] * g[2];
    b1 += g[0] * y; b2 += g[1] * y; b3 += g[2] * y;
  }
  const A = [[a11, a12, a13], [a12, a22, a23], [a13, a23, a33]];
  const B = [b1, b2, b3];
  const x = solve3(A, B);
  if (!x) { solution = { failed: 'This geometry is degenerate - spread the satellites out.' }; return; }
  solution = {
    dx: x[0], dy: x[1], bias: x[2],
    us: x[2] / C_KM_PER_US,
    posErrM: sqrt(sq(x[0]) + sq(x[1])) * 1000,
    n: list.length
  };
}

function solve3(A, B) {
  const M = [[A[0][0], A[0][1], A[0][2], B[0]],
             [A[1][0], A[1][1], A[1][2], B[1]],
             [A[2][0], A[2][1], A[2][2], B[2]]];
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) if (abs(M[r][c]) > abs(M[piv][c])) piv = r;
    if (abs(M[piv][c]) < 1e-12) return null;
    const t = M[c]; M[c] = M[piv]; M[piv] = t;
    for (let r = 0; r < 3; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k];
    }
  }
  return [M[0][3] / M[0][0], M[1][3] / M[1][1], M[2][3] / M[2][2]];
}

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
  textSize(narrow ? 17 : 23);
  text('GPS Trilateration Explorer', canvasWidth / 2, narrow ? 8 : 6);

  let mainB, insetB, msgB, panelB;
  if (narrow) {
    const half = (canvasWidth - 2 * margin - 8) / 2;
    mainB = { x: margin, y: 32, w: half, h: half };
    insetB = { x: margin + half + 8, y: 32, w: half, h: half };
    msgB = { x: margin, y: 32 + half + 8, w: canvasWidth - 2 * margin, h: 54 };
    panelB = { x: margin, y: 32 + half + 68, w: canvasWidth - 2 * margin,
               h: drawHeight - (32 + half + 68) - 10 };
  } else {
    mainB = { x: margin, y: 42, w: 202, h: 202 };
    insetB = { x: margin + 210, y: 42, w: 202, h: 202 };
    msgB = { x: margin, y: 252, w: 412, h: drawHeight - 264 };
    panelB = { x: margin + 428, y: 42, w: canvasWidth - margin - (margin + 428),
               h: drawHeight - 54 };
  }

  mainRect = mainB;
  drawMainView(mainB);
  drawInset(insetB);
  drawMessage(msgB, narrow);
  drawPanel(panelB, narrow);
  drawControlLabels();

  for (let i = 0; i < 6; i++) {
    satButtons[i].style('background', active[i] ? '#1565c0' : '#f5f5f5');
    satButtons[i].style('color', active[i] ? '#ffffff' : '#37474f');
  }
}

function wx(box, k) { return box.x + box.w / 2 + (k / VIEW_KM) * box.w; }
function wy(box, k) { return box.y + box.h / 2 - (k / VIEW_KM) * box.h; }

function drawMainView(box) {
  noStroke();
  fill('#0b1a2b');
  rect(box.x, box.y, box.w, box.h, 4);
  noStroke();
  fill('#78909c');
  textAlign(LEFT, TOP);
  textSize(9);
  text('simplified to two dimensions', box.x + 5, box.y + 4);

  const scale = box.w / VIEW_KM;

  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(box.x, box.y, box.w, box.h);
  drawingContext.clip();

  // range circles
  for (let i = 0; i < 6; i++) {
    if (!active[i]) continue;
    const s = satPos(i);
    noFill();
    stroke('rgba(100,181,246,0.75)');
    strokeWeight(1.2);
    circle(wx(box, s.x), wy(box, s.y), 2 * pseudoRange(i) * scale);
  }

  // satellites
  for (let i = 0; i < 6; i++) {
    const s = satPos(i);
    const px = wx(box, s.x), py = wy(box, s.y);
    noStroke();
    fill(active[i] ? '#ffd54f' : '#455a64');
    circle(px, py, 11);
    fill(active[i] ? '#fff8e1' : '#78909c');
    textAlign(CENTER, CENTER);
    textSize(8);
    text(i + 1, px, py);
  }

  // receiver
  noStroke();
  fill('#e53935');
  circle(wx(box, rx), wy(box, ry), 9);
  fill('#ffcdd2');
  textAlign(CENTER, TOP);
  textSize(9);
  text('you', wx(box, rx), wy(box, ry) + 7);

  drawingContext.restore();
  pop();

  stroke('#90a4ae');
  strokeWeight(1);
  noFill();
  rect(box.x, box.y, box.w, box.h, 4);
  noStroke();
  fill('#78909c');
  textAlign(RIGHT, BOTTOM);
  textSize(9);
  text('drag to move  -  ' + (VIEW_KM / 1000) + ' 000 km across',
       box.x + box.w - 5, box.y + box.h - 3);
}

// The magnified view. At this zoom each range circle is a straight line to well
// under a pixel, so they are drawn as lines offset along the satellite bearing.
function drawInset(box) {
  noStroke();
  fill('white');
  rect(box.x, box.y, box.w, box.h, 4);
  stroke('#90a4ae');
  strokeWeight(1);
  noFill();
  rect(box.x, box.y, box.w, box.h, 4);

  const span = insetSpanKm();
  const kmToPx = (box.w - 20) / span;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const list = activeList();

  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(box.x + 1, box.y + 1, box.w - 2, box.h - 2);
  drawingContext.clip();

  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(9);
  text('zoomed to ' + (span < 1 ? nf(span * 1000, 1, 0) + ' m' : nf(span, 1, 1) + ' km') +
       ' across', box.x + 5, box.y + 4);

  for (let k = 0; k < list.length; k++) {
    const i = list[k];
    const s = satPos(i);
    const d = trueDist(i);
    const ex = (s.x - rx) / d, ey = (s.y - ry) / d;      // toward the satellite
    const off = (pseudoRange(i) - d) * kmToPx;           // outward along -e
    // a point on the line, then travel perpendicular to draw it
    const ox = cx - ex * off;
    const oy = cy + ey * off;                            // screen y is inverted
    const px = -ey, py = -ex;                            // perpendicular, screen space
    const L = box.w;
    stroke('rgba(21,101,192,0.85)');
    strokeWeight(1.5);
    line(ox - px * L, oy - py * L, ox + px * L, oy + py * L);
  }

  // the true position and, once solved, the recovered one
  noStroke();
  fill('#e53935');
  circle(cx, cy, 8);
  if (solution && !solution.failed) {
    // an open ring, because a good solve lands on top of the true position and
    // a filled dot would simply hide it
    noFill();
    stroke('#2e7d32');
    strokeWeight(2);
    circle(cx + solution.dx * kmToPx, cy - solution.dy * kmToPx, 15);
    noStroke();
  }

  drawingContext.restore();
  pop();

  // scale bar
  const barKm = niceScale(span / 3);
  stroke('#455a64');
  strokeWeight(1.5);
  const bar = barKm * kmToPx;
  line(box.x + 8, box.y + box.h - 14, box.x + 8 + bar, box.y + box.h - 14);
  line(box.x + 8, box.y + box.h - 17, box.x + 8, box.y + box.h - 11);
  line(box.x + 8 + bar, box.y + box.h - 17, box.x + 8 + bar, box.y + box.h - 11);
  noStroke();
  fill('#455a64');
  textAlign(LEFT, TOP);
  textSize(9);
  text(barKm < 1 ? nf(barKm * 1000, 1, 0) + ' m' : nf(barKm, 1, 0) + ' km',
       box.x + 8, box.y + box.h - 11);
}

function niceScale(v) {
  const pow10 = Math.pow(10, floor(Math.log10(max(v, 1e-6))));
  const n = v / pow10;
  const step = n < 1.5 ? 1 : (n < 3.5 ? 2 : (n < 7.5 ? 5 : 10));
  return step * pow10;
}

function stageMessage() {
  const n = activeList().length;
  const e = clockErrUs();
  if (n === 0) return { t: 'Turn a satellite on.', c: '#546e7a' };
  if (n === 1) return { t: 'You are somewhere on this circle. Infinitely many possible positions.',
                        c: '#546e7a' };
  if (n === 2) return { t: 'Two circles cross at two points. Two possible positions, and no way ' +
                           'to choose between them.', c: '#546e7a' };
  if (n === 3 && abs(e) < 0.005) {
    return { t: 'One position - if the receiver clock were perfect. Look at the inset: the ' +
                'three lines meet at a point.', c: '#1b5e20' };
  }
  if (n === 3) {
    return { t: 'The three circles no longer intersect. Your clock is wrong, and there is no ' +
                'way to tell by how much - every satellite is reporting a distance that is ' +
                'too long by the same amount, and three unknowns need three equations.',
             c: '#b71c1c' };
  }
  if (solution && solution.failed) return { t: solution.failed, c: '#b71c1c' };
  if (solution) {
    return { t: 'Solved from ' + solution.n + ' satellites: the receiver clock was ' +
                nf(abs(solution.us), 1, 2) + ' microseconds ' +
                (solution.us > 0 ? 'slow' : 'fast') + '. Position recovered to within ' +
                nf(solution.posErrM, 1, 1) + ' m.', c: '#1b5e20' };
  }
  return { t: 'Four or more satellites active. Press Solve for clock error and let the ' +
              'receiver treat its own clock as an unknown.', c: '#0d47a1' };
}

function drawMessage(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  const m = stageMessage();
  const z = narrow ? 11 : 13;
  fill(m.c);
  textAlign(LEFT, TOP);
  textSize(z);
  const lines = wrapText(m.t, box.w - 20, z);
  text(lines, box.x + 10, box.y + 8);

  const used = lines.split('\n').length * (z + 3) + 14;
  if (box.h - used > 26) {
    fill('#78909c');
    textSize(10);
    text(wrapText('Two dimensions here means three unknowns: x, y and the clock. In the ' +
                  'real three-dimensional world there are four - x, y, z and the clock - ' +
                  'which is exactly why GPS needs four satellites and not three.',
                  box.w - 20, 10), box.x + 10, box.y + used);
  }
}

function drawPanel(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const list = activeList();
  let y = box.y + 8;
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('What each satellite says', box.x + 10, y);
  y += 16;

  if (list.length === 0) {
    fill('#90a4ae');
    text('No satellites active.', box.x + 10, y);
    return;
  }

  const z = narrow ? 9 : 10;
  const wide = !narrow;
  for (let k = 0; k < list.length; k++) {
    const i = list[k];
    const d = trueDist(i);
    const tMs = d / C_KM_PER_MS + clockErrUs() / 1000;
    const dCalc = pseudoRange(i);
    fill('#0d47a1');
    textSize(z + 1);
    textAlign(LEFT, TOP);
    text('S' + (i + 1), box.x + 10, y);
    fill('#455a64');
    textSize(z);
    if (wide) {
      text('broadcast 12:00:00.000000', box.x + 36, y);
      text('arrival 12:00:00.' + nf(round(tMs * 1000000 / 1000), 6), box.x + 36, y + z + 2);
      text('travel ' + nf(tMs, 1, 4) + ' ms   ->   ' + nf(dCalc, 1, 3) + ' km',
           box.x + 36, y + 2 * (z + 2));
      y += 3 * (z + 2) + 6;
    } else {
      text(nf(tMs, 1, 4) + ' ms', box.x + 36, y);
      textAlign(RIGHT, TOP);
      text(nf(dCalc, 1, 3) + ' km', box.x + box.w - 10, y);
      y += z + 5;
    }
  }

  if (box.y + box.h - y > 28) {
    fill('#78909c');
    textAlign(LEFT, TOP);
    textSize(9);
    text(wrapText('Distance = travel time x the speed of light. Every distance above ' +
                  'carries the receiver clock error inside it.', box.w - 20, 9),
         box.x + 10, y + 2);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  const e = clockErrUs();
  text('Clock error: ' + (e > 0 ? '+' : '') + nf(e, 1, 2) + ' us', 10, drawHeight + 58);
  fill('#546e7a');
  textSize(11);
  text('= ' + nf(abs(e) * 299.792458, 1, 0) + ' m of range error   (30 cm per nanosecond)',
       10, drawHeight + 74);
  textSize(11);
  fill('#546e7a');
  text('satellites', 278, drawHeight + 22);
}

// ---- interaction --------------------------------------------------------

function mousePressed() {
  if (mouseX > mainRect.x && mouseX < mainRect.x + mainRect.w &&
      mouseY > mainRect.y && mouseY < mainRect.y + mainRect.h) {
    dragging = true;
    setReceiver();
  }
}
function mouseDragged() { if (dragging) setReceiver(); }
function mouseReleased() { dragging = false; }

function setReceiver() {
  rx = constrain((mouseX - (mainRect.x + mainRect.w / 2)) / mainRect.w * VIEW_KM, -14000, 14000);
  ry = constrain(-(mouseY - (mainRect.y + mainRect.h / 2)) / mainRect.h * VIEW_KM, -14000, 14000);
  solution = null;
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
