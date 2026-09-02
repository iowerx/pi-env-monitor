// Falling Barometer Forecast Trainer MicroSim
// CANVAS_HEIGHT: 652
// Bloom Level: Evaluate (L5) - the learner predicts the coming weather from a
// pressure trace, judging the rate of change rather than the value, and is held
// to the call before the future is revealed.
// Several traces are built so that value and trend point in opposite directions.
// That is the design decision that breaks "low pressure means bad weather", which
// is the wrong rule students otherwise learn and keep.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 132;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 150;

const NARROW_BREAKPOINT = 740;
const NOW_H = 24;                  // the learner sees 0..24 h, the rest is hidden
const TOTAL_H = 36;
const PER_H = 2;                   // samples per hour
const N = TOTAL_H * PER_H + 1;

// ---- controls ----
let scenarioSelect, newButton, timeSlider;
let predButtons = [];

// ---- state ----
let scenarioKey = 'Steady high';
let trace = [];
let predicted = null;
let revealed = false;
let score = 0, attempts = 0;
let setNeedle = 1013;
let dialRect = { x: 0, y: 0, r: 1 };
let draggingNeedle = false;

const CHOICES = ['Fair', 'Clouding over', 'Rain likely', 'Storm', 'Clearing'];

// Each scenario is a shape plus a known outcome. The two marked "value and trend
// disagree" are the reason this sim exists.
const SCENARIOS = {
  'Steady high': {
    build: function (h) { return 1028 + 0.4 * sin(h / 3); },
    best: 'Fair', ok: [],
    outcome: 'Fair and settled, and it stayed that way.',
    why: 'High value, flat trend. Both cues agree, which makes this the easy case.'
  },
  'Steady low': {
    build: function (h) { return 995 + 0.4 * sin(h / 4); },
    best: 'Clouding over', ok: ['Fair'],
    outcome: 'Overcast and grey for another day. No storm.',
    why: 'A low value on its own is not a warning. Nothing was changing, and nothing ' +
         'happened. This is the trap in reverse: students who learned "low means bad" ' +
         'call a storm here and are wrong.'
  },
  'High and falling fast': {
    // tuned so the reading at hour 24 is 1025 hPa after a 4 hPa fall over 3 hours,
    // which is exactly the number the feedback quotes back
    build: function (h) { return h < 20.25 ? 1030 : 1030 - (h - 20.25) * 1.3333; },
    best: 'Storm', ok: ['Rain likely'],
    outcome: 'Wind and heavy rain arrived within four hours.',
    why: 'The value still looked reassuring - 1025 hPa is a perfectly normal reading. ' +
         'The signal was the 4 hPa fall over three hours. Value and trend disagreed, ' +
         'and the trend was right.',
    disagree: true
  },
  'Low and rising': {
    build: function (h) { return 990 + h * 0.55; },
    best: 'Clearing', ok: ['Fair'],
    outcome: 'Skies broke up through the afternoon.',
    why: 'The value is low and the trend is up. The storm has already gone past you. ' +
         'Rising pressure after a low is the clearing signal.',
    disagree: true
  },
  'Rapid deep fall': {
    build: function (h) { return h < 6 ? 1012 : 1012 - (h - 6) * 2.3; },
    best: 'Storm', ok: [],
    outcome: 'Severe. Gale-force wind and a line of thunderstorms.',
    why: 'More than 6 hPa in three hours. This is the rate FitzRoy built the first ' +
         'storm warnings on, and it has not needed revising.'
  },
  'Diurnal wobble': {
    build: function (h) { return 1014 + 1.5 * sin(TWO_PI * h / 12); },
    best: 'Fair', ok: [],
    outcome: 'Nothing happened. The wiggle is the daily atmospheric tide.',
    why: 'A regular twice-daily oscillation of a couple of hectopascals, strongest in ' +
         'the tropics. It is not weather. Learn to ignore it, or you will forecast a ' +
         'storm every afternoon.'
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  scenarioSelect = createSelect();
  Object.keys(SCENARIOS).forEach(function (k) { scenarioSelect.option(k); });
  scenarioSelect.selected(scenarioKey);
  scenarioSelect.changed(function () { scenarioKey = scenarioSelect.value(); loadTrace(); });

  newButton = createButton('Random trace');
  newButton.mousePressed(function () {
    const keys = Object.keys(SCENARIOS);
    scenarioKey = keys[floor(random(keys.length))];
    scenarioSelect.selected(scenarioKey);
    loadTrace();
  });

  timeSlider = createSlider(0, NOW_H * PER_H, NOW_H * PER_H, 1);

  for (let i = 0; i < CHOICES.length; i++) {
    const b = createButton(CHOICES[i]);
    b.mousePressed(function () { submit(CHOICES[i]); });
    predButtons.push(b);
  }

  loadTrace();
  layoutControls();

  describe('A pressure trace over 36 hours with the last twelve hidden. The learner ' +
           'scrubs through what has happened so far, reads the current value, the ' +
           'three-hour tendency and the rate in hectopascals per hour on a traditional ' +
           'two-needle dial, and commits to a forecast. Only then does the future ' +
           'appear. Several traces are built so that the value and the trend point in ' +
           'opposite directions.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 80;
  scenarioSelect.position(74, r1);
  scenarioSelect.size(158);
  newButton.position(242, r1);
  timeSlider.position(sliderLeftMargin, r2 + 4);
  timeSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  let x = 10;
  const w = [46, 100, 84, 58, 70];
  for (let i = 0; i < predButtons.length; i++) {
    predButtons[i].position(x, r3);
    x += w[i] + 6;
  }
}

function loadTrace() {
  const f = SCENARIOS[scenarioKey].build;
  trace = [];
  for (let i = 0; i < N; i++) {
    const h = i / PER_H;
    // a small deterministic jitter so the traces do not look drawn with a ruler
    trace.push(f(h) + 0.18 * sin(h * 2.7) + 0.10 * sin(h * 6.1));
  }
  predicted = null;
  revealed = false;
  timeSlider.value(NOW_H * PER_H);
  setNeedle = trace[max(0, NOW_H * PER_H - 6 * PER_H)];
}

function submit(choice) {
  if (revealed) return;
  predicted = choice;
  revealed = true;
  attempts++;
  const sc = SCENARIOS[scenarioKey];
  if (choice === sc.best) score += 1;
  else if (sc.ok.indexOf(choice) >= 0) score += 0.5;
}

// ---- readings -----------------------------------------------------------

// named cursorIdx, not cursor: p5 has a global cursor() and overwrites ours
function cursorIdx() { return timeSlider.value(); }
function pNow() { return trace[cursorIdx()]; }
function pAgo(hours) { return trace[max(0, cursorIdx() - hours * PER_H)]; }
function tendency() { return pNow() - pAgo(3); }
function ratePerHour() { return tendency() / 3; }

function category() {
  const r = ratePerHour();
  if (r <= -2.0) return { t: 'falling very rapidly', c: '#b71c1c' };
  if (r <= -1.0) return { t: 'rapidly falling', c: '#c62828' };
  if (r <= -0.3) return { t: 'slowly falling', c: '#ef6c00' };
  if (r < 0.3)   return { t: 'steady', c: '#37474f' };
  if (r < 1.0)   return { t: 'slowly rising', c: '#1565c0' };
  return { t: 'rapidly rising', c: '#0d47a1' };
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
  textSize(narrow ? 17 : 22);
  text('What Is the Barometer Telling You?', canvasWidth / 2, narrow ? 6 : 4);

  let chartB, dialB, panelB;
  if (narrow) {
    const w = canvasWidth - 2 * margin;
    chartB = { x: margin, y: 30, w: w, h: 164 };
    dialB = { x: margin, y: 200, w: 150, h: 162 };
    panelB = { x: margin + 158, y: 200, w: w - 158, h: 162 };
    var verdictB = { x: margin, y: 368, w: w, h: drawHeight - 380 };
  } else {
    const cw = floor(canvasWidth * 0.60);
    chartB = { x: margin, y: 38, w: cw - margin, h: 244 };
    dialB = { x: cw + 8, y: 38, w: 150, h: 150 };
    panelB = { x: cw + 166, y: 38, w: canvasWidth - margin - (cw + 166), h: 244 };
    var verdictB = { x: margin, y: 292, w: canvasWidth - 2 * margin, h: drawHeight - 304 };
  }

  drawChart(chartB, narrow);
  drawDial(dialB);
  drawPanel(panelB, narrow);
  drawVerdict(verdictB, narrow);
  drawControlLabels();

  for (let i = 0; i < predButtons.length; i++) {
    const chosen = predicted === CHOICES[i];
    predButtons[i].style('background', chosen ? '#1565c0' : (revealed ? '#eceff1' : '#f5f5f5'));
    predButtons[i].style('color', chosen ? '#ffffff' : (revealed ? '#b0bec5' : '#37474f'));
  }
}

function yr() {
  let lo = 1e9, hi = -1e9;
  for (let i = 0; i < N; i++) { lo = min(lo, trace[i]); hi = max(hi, trace[i]); }
  const pad = max(4, (hi - lo) * 0.25);
  return { lo: lo - pad, hi: hi + pad };
}

function drawChart(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const r = yr();
  const px = function (i) { return map(i, 0, N - 1, box.x + 34, box.x + box.w - 8); };
  const py = function (v) { return map(v, r.lo, r.hi, box.y + box.h - 18, box.y + 22); };

  // the normal band, so the value can be read against something
  noStroke();
  fill('rgba(129,199,132,0.16)');
  const b1 = constrain(py(1040), box.y + 22, box.y + box.h - 18);
  const b2 = constrain(py(980), box.y + 22, box.y + box.h - 18);
  rect(box.x + 34, b1, box.w - 42, b2 - b1);

  stroke('#eceff1');
  strokeWeight(1);
  for (let v = ceil(r.lo / 10) * 10; v <= r.hi; v += 10) {
    line(box.x + 34, py(v), box.x + box.w - 8, py(v));
    noStroke();
    fill('#90a4ae');
    textAlign(RIGHT, CENTER);
    textSize(8);
    text(v, box.x + 31, py(v));
    stroke('#eceff1');
  }
  noStroke();
  textAlign(CENTER, TOP);
  fill('#90a4ae');
  textSize(8);
  for (let h = 0; h <= TOTAL_H; h += 6) {
    text(h + 'h', px(h * PER_H), box.y + box.h - 15);
  }

  // the hidden future
  if (!revealed) {
    noStroke();
    fill('rgba(236,239,241,0.92)');
    rect(px(NOW_H * PER_H), box.y + 16, box.x + box.w - 8 - px(NOW_H * PER_H), box.h - 34);
    fill('#90a4ae');
    textAlign(CENTER, CENTER);
    textSize(10);
    text('the next 12 hours', (px(NOW_H * PER_H) + box.x + box.w - 8) / 2, box.y + box.h / 2);
  }

  const last = revealed ? N - 1 : cursorIdx();
  stroke('#0d47a1');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i <= last; i++) vertex(px(i), py(trace[i]));
  endShape();

  if (revealed) {
    stroke('#b0bec5');
    strokeWeight(1);
    line(px(NOW_H * PER_H), box.y + 16, px(NOW_H * PER_H), box.y + box.h - 18);
    noStroke();
    fill('#90a4ae');
    textAlign(CENTER, BOTTOM);
    textSize(8);
    text('you predicted here', px(NOW_H * PER_H), box.y + 16);
  } else {
    stroke('#e65100');
    strokeWeight(1);
    line(px(cursorIdx()), box.y + 16, px(cursorIdx()), box.y + box.h - 18);
    noStroke();
    fill('#e65100');
    circle(px(cursorIdx()), py(pNow()), 6);
  }

  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(9);
  text('hPa   -   green band is the normal 980 to 1040 range', box.x + 34, box.y + 5);
}

function drawDial(box) {
  const cx = box.x + box.w / 2;
  const cyy = box.y + box.h / 2;
  const rad = min(box.w, box.h) / 2 - 6;
  dialRect = { x: cx, y: cyy, r: rad };

  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);

  stroke('#546e7a');
  strokeWeight(2);
  fill('#fafafa');
  circle(cx, cyy, rad * 2);

  // 960 to 1060 hPa around 270 degrees of the face
  function ang(p) { return map(constrain(p, 960, 1060), 960, 1060, -PI * 1.25, PI * 0.25); }
  noStroke();
  for (let p = 960; p <= 1060; p += 10) {
    const a = ang(p);
    stroke('#78909c');
    strokeWeight(1);
    line(cx + cos(a) * rad * 0.82, cyy + sin(a) * rad * 0.82,
         cx + cos(a) * rad * 0.94, cyy + sin(a) * rad * 0.94);
    noStroke();
    fill('#78909c');
    textAlign(CENTER, CENTER);
    textSize(7);
    if (p % 20 === 0) text(p, cx + cos(a) * rad * 0.68, cyy + sin(a) * rad * 0.68);
  }

  // the set needle, brass, left where the learner put it
  const sa = ang(setNeedle);
  stroke('#b8860b');
  strokeWeight(2);
  line(cx, cyy, cx + cos(sa) * rad * 0.9, cyy + sin(sa) * rad * 0.9);

  // the live needle
  const la = ang(pNow());
  stroke('#263238');
  strokeWeight(3);
  line(cx, cyy, cx + cos(la) * rad * 0.78, cyy + sin(la) * rad * 0.78);
  noStroke();
  fill('#263238');
  circle(cx, cyy, 7);

  fill('#546e7a');
  textAlign(CENTER, TOP);
  textSize(8);
  text('drag the brass needle', cx, box.y + box.h - 12);
}

function drawPanel(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  const inner = box.w - 20;
  const cat = category();
  const tv = tendency();
  let y = box.y + 8;

  if (narrow) {
    fill('#546e7a');
    textAlign(LEFT, TOP);
    textSize(10);
    text('now', box.x + 10, y);
    y += 13;
    fill('#212121');
    textSize(19);
    text(nf(pNow(), 1, 1) + ' hPa', box.x + 10, y);
    y += 24;
    fill('#455a64');
    textSize(11);
    text('3 h ago  ' + nf(pAgo(3), 1, 1) + ' hPa', box.x + 10, y);
    y += 19;
    fill('#546e7a');
    textSize(10);
    text('pressure tendency', box.x + 10, y);
    y += 13;
    fill(cat.c);
    textSize(15);
    text((tv >= 0 ? '+' : '') + nf(tv, 1, 1) + ' hPa / 3 h', box.x + 10, y);
    y += 19;
    fill(cat.c);
    textSize(11);
    text(nf(ratePerHour(), 1, 2) + ' hPa/h,  ' + cat.t, box.x + 10, y);
    y += 18;
    fill('#8d6e00');
    textSize(9);
    text(wrapText('Brass needle at ' + nf(setNeedle, 1, 1) + ' hPa. The gap to the black ' +
                  'needle is the tendency - this is what the second needle was for.',
                  inner, 9), box.x + 10, y);
    return;
  }

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('now', box.x + 10, y);
  y += 14;
  fill('#212121');
  textSize(23);
  text(nf(pNow(), 1, 1) + ' hPa', box.x + 10, y);
  y += 28;

  fill('#546e7a');
  textSize(11);
  text('3 hours ago', box.x + 10, y);
  y += 14;
  fill('#455a64');
  textSize(15);
  text(nf(pAgo(3), 1, 1) + ' hPa', box.x + 10, y);
  y += 22;

  fill('#546e7a');
  textSize(11);
  text('pressure tendency', box.x + 10, y);
  y += 14;
  fill(cat.c);
  textSize(18);
  text((tv >= 0 ? '+' : '') + nf(tv, 1, 1) + ' hPa / 3 h', box.x + 10, y);
  y += 24;
  fill(cat.c);
  textSize(12);
  text(nf(ratePerHour(), 1, 2) + ' hPa/h', box.x + 10, y);
  y += 17;
  fill(cat.c);
  textSize(13);
  text(wrapText(cat.t, inner, 13), box.x + 10, y);
  y += 22;

  fill('#8d6e00');
  textSize(10);
  text(wrapText('Brass needle set at ' + nf(setNeedle, 1, 1) + ' hPa. The gap to the black ' +
                'needle is the tendency. This is what the second needle was for.',
                inner, 10), box.x + 10, y);
}

function drawVerdict(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  const inner = box.w - 20;
  const z = narrow ? 11 : 12;
  let y = box.y + 8;
  const sc = SCENARIOS[scenarioKey];

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Forecast', box.x + 10, y);
  fill('#78909c');
  textAlign(RIGHT, TOP);
  text('score ' + nf(score, 1, 1) + ' of ' + attempts, box.x + box.w - 10, y);
  textAlign(LEFT, TOP);
  y += 17;

  if (!revealed) {
    fill('#455a64');
    textSize(z);
    text(wrapText('Scrub back through the last 24 hours if you want to. Then commit: what ' +
                  'happens in the next twelve? The future stays hidden until you do.',
                  inner, z), box.x + 10, y);
    return;
  }

  const right = predicted === sc.best;
  const partial = !right && sc.ok.indexOf(predicted) >= 0;
  fill(right ? '#1b5e20' : (partial ? '#e65100' : '#b71c1c'));
  textSize(narrow ? 14 : 16);
  const head = right ? 'Right call.'
             : (partial ? 'Close. The better answer was "' + sc.best + '".'
                        : 'Wrong. The answer was "' + sc.best + '".');
  text(head, box.x + 10, y);
  y += narrow ? 20 : 23;

  fill('#212121');
  textSize(z);
  const outLines = wrapText('What happened: ' + sc.outcome, inner, z);
  text(outLines, box.x + 10, y);
  y += outLines.split('\n').length * (z + 3) + 4;

  let why = sc.why;
  if (scenarioKey === 'High and falling fast' && predicted === 'Fair') {
    why = 'You predicted fair because 1025 hPa is a high value. The value was misleading. ' +
          'The 4 hPa fall in 3 hours was the signal. ' + sc.why;
  }
  fill('#455a64');
  textSize(z);
  text(wrapText(why, inner, z), box.x + 10, y);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Trace:', 10, drawHeight + 22);
  text('Hour  ' + nf(cursorIdx() / PER_H, 1, 1), 10, drawHeight + 58);
}

// ---- interaction --------------------------------------------------------

function mousePressed() {
  const d = dist(mouseX, mouseY, dialRect.x, dialRect.y);
  if (d < dialRect.r) { draggingNeedle = true; setNeedleFromMouse(); }
}
function mouseDragged() { if (draggingNeedle) setNeedleFromMouse(); }
function mouseReleased() { draggingNeedle = false; }

function setNeedleFromMouse() {
  let a = atan2(mouseY - dialRect.y, mouseX - dialRect.x);
  if (a > PI * 0.25) a -= TWO_PI;
  setNeedle = constrain(map(a, -PI * 1.25, PI * 0.25, 960, 1060), 960, 1060);
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
