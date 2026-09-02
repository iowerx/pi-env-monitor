// Radiation Shield Comparison Lab MicroSim
// CANVAS_HEIGHT: 590
// Bloom Level: Analyze (L4) - the learner separates the effects of solar load,
// mounting surface and airflow, and attributes an error to a specific siting fault.
// Four sitings run through the same simulated day against a known true air
// temperature. Running them side by side on one fixed axis is what makes the
// causes separable; diagnosis mode then inverts the task from watching an effect
// to naming its cause, which is the skill needed in Chapter 15.
// The physics is deliberately not real radiative transfer. It is a coefficient
// model tuned for the correct qualitative ordering and plausible magnitudes.
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
let sliderLeftMargin = 150;

const NARROW_BREAKPOINT = 720;
const STEPS = 288;                 // five-minute resolution over 24 hours

// ---- controls ----
let weatherSelect, seasonSelect, timeSlider;
let runButton, diagButton, resetButton;
let answerButtons = [];

// ---- state ----
let playing = false;
let playTimer = 0;
let dayDone = false;
let diagMode = false;
let diagTarget = 0;
let diagRound = 0;
let diagScore = 0;
let diagFeedback = '';
let on = [true, true, true, true];
let legendHits = [];
let cache = null;                  // precomputed curves for the current settings

const SITES = [
  { key: 'roof',   name: 'Bare sensor, dark asphalt roof', short: 'Roof',
    color: '#c62828', A: 14.0, V: 0.15, lag: 0.7,
    fault: 'Full sun on a dark surface. The sensor is measuring the roof, not the air. ' +
           'The error peaks in the early afternoon with the sun.' },
  { key: 'wall',   name: 'Bare sensor on a south-facing wall', short: 'Wall',
    color: '#ef6c00', A: 9.0, V: 0.15, lag: 3.2,
    fault: 'A masonry wall stores heat all day and gives it back after sunset. The ' +
           'giveaway is the shape: this error peaks late and is still there in the evening.' },
  { key: 'shade',  name: 'Under a sunshade, no airflow', short: 'Shade',
    color: '#f9a825', A: 4.5, V: 0.55, lag: 0.5,
    fault: 'Shaded but unventilated. Air trapped under the shade heats up and sits there. ' +
           'The giveaway is that a breeze fixes most of it.' },
  { key: 'screen', name: 'Louvered screen, 1.5 m over grass', short: 'Screen',
    color: '#2e7d32', A: 0.6, V: 0.70, lag: 0.4,
    fault: 'This is the correct siting. It tracks the true air temperature all day, in ' +
           'every weather.' }
];

const WEATHER = {
  'Clear and calm':   { cloud: 1.00, wind: 0.0 },
  'Clear and breezy': { cloud: 1.00, wind: 1.0 },
  'Overcast':         { cloud: 0.12, wind: 0.3 }
};
const SEASON = {
  Summer: { rise: 5.5, set: 20.5, peak: 1.00, tMin: 3, mid: 22, amp: 6, yLo: 10, yHi: 48 },
  Winter: { rise: 7.5, set: 16.5, peak: 0.55, tMin: 2, mid: -1, amp: 5, yLo: -12, yHi: 24 }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  weatherSelect = createSelect();
  Object.keys(WEATHER).forEach(function (k) { weatherSelect.option(k); });
  weatherSelect.selected('Clear and calm');
  weatherSelect.changed(rebuild);

  seasonSelect = createSelect();
  Object.keys(SEASON).forEach(function (k) { seasonSelect.option(k); });
  seasonSelect.selected('Summer');
  seasonSelect.changed(rebuild);

  timeSlider = createSlider(0, STEPS - 1, 168, 1);   // 14:00

  runButton = createButton('Run the day');
  runButton.mousePressed(function () {
    if (!playing) { timeSlider.value(0); dayDone = false; }
    playing = !playing;
    runButton.html(playing ? 'Pause' : 'Run the day');
  });

  diagButton = createButton('Diagnosis mode');
  diagButton.mousePressed(startDiagnosis);

  resetButton = createButton('Reset');
  resetButton.mousePressed(function () {
    on = [true, true, true, true];
    playing = false;
    dayDone = false;
    runButton.html('Run the day');
    timeSlider.value(168);
  });

  for (let i = 0; i < 4; i++) {
    const b = createButton(SITES[i].short);
    b.mousePressed(function () { answerDiagnosis(i); });
    answerButtons.push(b);
  }
  const quit = createButton('Quit');
  quit.mousePressed(function () { diagMode = false; diagFeedback = ''; });
  answerButtons.push(quit);

  rebuild();
  layoutControls();

  describe('Four temperature sensors sited four different ways, run through the same ' +
           'simulated day against a known true air temperature on one fixed axis. A ' +
           'sensor on a dark roof reads far too high in the afternoon, one on a wall ' +
           'peaks late as the wall gives back stored heat, one under an unventilated ' +
           'shade reads moderately high, and one in a louvered screen tracks the truth. ' +
           'On an overcast day all four agree, which is why siting faults go unnoticed. ' +
           'Diagnosis mode hides the labels and asks the learner to name the fault.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 80;
  weatherSelect.position(74, r1);
  weatherSelect.size(126);
  seasonSelect.position(272, r1);
  seasonSelect.size(88);
  timeSlider.position(sliderLeftMargin, r2 + 4);
  timeSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  runButton.position(10, r3);
  diagButton.position(103, r3);
  resetButton.position(212, r3);
  let x = 10;
  const w = [52, 52, 58, 62, 48];
  for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].position(x, r3);
    x += w[i] + 6;
  }
}

// ---- the day, precomputed once per settings -----------------------------

function rebuild() {
  const w = WEATHER[weatherSelect.value()];
  const s = SEASON[seasonSelect.value()];
  const trueT = [];
  const load = [];

  for (let i = 0; i < STEPS; i++) {
    const t = i * 24 / STEPS;
    trueT.push(s.mid - s.amp * cos(TWO_PI * (t - s.tMin) / 24));
    const day = (t - s.rise) / (s.set - s.rise);
    const sun = (day > 0 && day < 1) ? sin(PI * day) : 0;
    load.push(sun * s.peak * w.cloud);
  }

  // Each siting sees a differently lagged version of the same solar load. The
  // wall's long lag is what makes its error peak in the evening.
  const series = SITES.map(function (site) {
    const lagSteps = max(1, site.lag * STEPS / 24);
    const alpha = 1 - Math.exp(-1 / lagSteps);
    let acc = 0;
    const err = [];
    for (let i = 0; i < STEPS; i++) {
      acc += alpha * (load[i] - acc);
      err.push(site.A * acc * (1 - site.V * w.wind));
    }
    return err;
  });

  cache = { trueT: trueT, load: load, err: series, yLo: s.yLo, yHi: s.yHi, sun: s };
}

function reading(i, step) { return cache.trueT[step] + cache.err[i][step]; }

function maxErrorTo(i, step) {
  let m = 0;
  for (let k = 0; k <= step; k++) m = max(m, abs(cache.err[i][k]));
  return m;
}
function meanErrorTo(i, step) {
  let s = 0;
  for (let k = 0; k <= step; k++) s += cache.err[i][k];
  return s / (step + 1);
}

// ---- diagnosis ----------------------------------------------------------

function startDiagnosis() {
  diagMode = true;
  diagRound = 1;
  diagScore = 0;
  diagFeedback = '';
  diagTarget = floor(random(4));
  playing = false;
  runButton.html('Run the day');
}

function answerDiagnosis(i) {
  if (!diagMode) return;
  const right = i === diagTarget;
  if (right) diagScore++;
  diagFeedback = (right ? 'Correct. ' : 'Not quite. It was the ' +
                  SITES[diagTarget].name.toLowerCase() + '. ') + SITES[diagTarget].fault;
  if (diagRound >= 3) {
    diagFeedback += '  Round 3 of 3 finished: ' + diagScore + ' out of 3.';
    diagMode = false;
  } else {
    diagRound++;
    let next = floor(random(4));
    if (next === diagTarget) next = (next + 1) % 4;
    diagTarget = next;
  }
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;

  if (playing) {
    playTimer -= deltaTime;
    if (playTimer <= 0) {
      playTimer = 26;
      const v = timeSlider.value() + 1;
      if (v >= STEPS) {
        timeSlider.value(STEPS - 1);
        playing = false;
        dayDone = true;
        runButton.html('Run the day');
      } else {
        timeSlider.value(v);
      }
    }
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
  text('Radiation Shield Comparison Lab', canvasWidth / 2, narrow ? 6 : 4);

  let sceneB, chartB, statsB;
  if (narrow) {
    sceneB = { x: margin, y: 30, w: canvasWidth - 2 * margin, h: 108 };
    chartB = { x: margin, y: 144, w: canvasWidth - 2 * margin, h: 150 };
    statsB = { x: margin, y: 300, w: canvasWidth - 2 * margin, h: drawHeight - 312 };
  } else {
    const lw = floor(canvasWidth * 0.62);
    sceneB = { x: margin, y: 36, w: lw - margin, h: 148 };
    chartB = { x: margin, y: 192, w: lw - margin, h: drawHeight - 206 };
    statsB = { x: lw + 8, y: 36, w: canvasWidth - margin - lw - 8, h: drawHeight - 50 };
  }

  drawScene(sceneB, narrow);
  drawChart(chartB, narrow);
  drawStats(statsB, narrow);
  drawControlLabels();

  const dm = diagMode;
  for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].style('display', dm ? 'block' : 'none');
  }
  runButton.style('display', dm ? 'none' : 'block');
  diagButton.style('display', dm ? 'none' : 'block');
  resetButton.style('display', dm ? 'none' : 'block');
}

function stepNow() { return timeSlider.value(); }
function hourNow() { return stepNow() * 24 / STEPS; }

function drawScene(box, narrow) {
  const s = cache.sun;
  const t = hourNow();
  const day = constrain((t - s.rise) / (s.set - s.rise), 0, 1);
  const isDay = t > s.rise && t < s.set;
  const load = cache.load[stepNow()];

  // sky, darker when the sun is down or the cloud is thick
  const cloudy = WEATHER[weatherSelect.value()].cloud < 0.5;
  const sky = cloudy
    ? (isDay ? color('#90a4ae') : color('#37474f'))
    : lerpColor(color('#1a237e'), color('#64b5f6'), constrain(load * 2.2, 0, 1));
  noStroke();
  fill(sky);
  rect(box.x, box.y, box.w, box.h - 16, 4);
  fill('#7cb342');
  rect(box.x, box.y + box.h - 20, box.w, 20, 0, 0, 4, 4);

  if (cloudy) {
    fill('rgba(200,205,210,0.85)');
    for (let i = 0; i < 5; i++) {
      const cx = box.x + (i + 0.5) * box.w / 5;
      ellipse(cx, box.y + 20, box.w / 4.2, 22);
    }
  } else if (isDay) {
    const sx = box.x + 14 + day * (box.w - 28);
    const sy = box.y + box.h - 34 - sin(PI * day) * (box.h - 62);
    fill('#ffd54f');
    circle(sx, sy, 20);
    stroke('rgba(255,213,79,0.6)');
    strokeWeight(2);
    for (let i = 0; i < 8; i++) {
      const a = i * TWO_PI / 8;
      line(sx + cos(a) * 13, sy + sin(a) * 13, sx + cos(a) * 19, sy + sin(a) * 19);
    }
    noStroke();
  }

  // the four sitings, in the same left-to-right order as the legend
  const cw = box.w / 4;
  const gy = box.y + box.h - 20;
  for (let i = 0; i < 4; i++) {
    const cx = box.x + cw * (i + 0.5);
    push();
    translate(cx, gy);
    drawSiting(i, min(cw * 0.7, 74), box.h - 46);
    pop();
    noStroke();
    fill(on[i] ? SITES[i].color : '#90a4ae');
    circle(box.x + cw * i + 8, box.y + box.h - 10, 7);
    fill(on[i] ? 'white' : '#cfd8dc');
    textAlign(LEFT, CENTER);
    textSize(narrow ? 8 : 9);
    text(SITES[i].short, box.x + cw * i + 15, box.y + box.h - 10);
  }
}

// Each vignette is drawn from primitives, at a size that fits its quarter of
// the scene, so the four sitings are told apart at a glance.
function drawSiting(i, w, h) {
  const hh = min(h, 82);
  noStroke();
  if (i === 0) {                    // dark asphalt roof
    fill('#37474f');
    rect(-w / 2, -hh * 0.30, w, hh * 0.30);
    fill('#263238');
    rect(-w / 2, -hh * 0.34, w, hh * 0.06);
    fill('#e53935');
    circle(0, -hh * 0.42, 9);
  } else if (i === 1) {             // south-facing wall
    fill('#bcaaa4');
    rect(-w / 2, -hh * 0.86, w * 0.62, hh * 0.86);
    stroke('#a1887f');
    strokeWeight(1);
    for (let k = 1; k < 5; k++) {
      line(-w / 2, -hh * 0.86 + k * hh * 0.17, -w / 2 + w * 0.62, -hh * 0.86 + k * hh * 0.17);
    }
    noStroke();
    fill('#ef6c00');
    circle(-w / 2 + w * 0.62 + 5, -hh * 0.45, 9);
  } else if (i === 2) {             // flat sunshade, no vents
    stroke('#90a4ae');
    strokeWeight(2);
    line(0, 0, 0, -hh * 0.62);
    noStroke();
    fill('#eceff1');
    rect(-w * 0.32, -hh * 0.70, w * 0.64, hh * 0.08, 2);
    fill('#f9a825');
    circle(0, -hh * 0.52, 9);
  } else {                          // louvered screen on a post
    stroke('#90a4ae');
    strokeWeight(2);
    line(0, 0, 0, -hh * 0.52);
    noStroke();
    fill('#fafafa');
    rect(-w * 0.26, -hh * 0.86, w * 0.52, hh * 0.34, 2);
    stroke('#b0bec5');
    strokeWeight(1);
    for (let k = 1; k < 5; k++) {
      line(-w * 0.26, -hh * 0.86 + k * hh * 0.068, w * 0.26, -hh * 0.86 + k * hh * 0.068);
    }
    noStroke();
    fill('#2e7d32');
    circle(0, -hh * 0.69, 7);
  }
}

function cy(box, v) {
  return map(v, cache.yLo, cache.yHi, box.y + box.h - 16, box.y + 14);
}
function cx(box, step) {
  return map(step, 0, STEPS - 1, box.x + 30, box.x + box.w - 6);
}

function drawChart(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 5);
  noStroke();

  // fixed axis, labelled, never rescaled
  fill('#90a4ae');
  textAlign(RIGHT, CENTER);
  textSize(9);
  const stepY = seasonSelect.value() === 'Summer' ? 10 : 10;
  for (let v = ceil(cache.yLo / stepY) * stepY; v <= cache.yHi; v += stepY) {
    const y = cy(box, v);
    stroke('#eceff1');
    strokeWeight(1);
    line(box.x + 28, y, box.x + box.w - 6, y);
    noStroke();
    fill('#90a4ae');
    text(v, box.x + 25, y);
  }
  textAlign(CENTER, TOP);
  for (let hh = 0; hh <= 24; hh += 6) {
    const x = cx(box, hh * STEPS / 24 - (hh === 24 ? 1 : 0));
    fill('#90a4ae');
    text(nf(hh, 2) + ':00', x, box.y + box.h - 13);
  }

  const upto = diagMode ? STEPS - 1 : stepNow();

  // the truth
  stroke('#37474f');
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  noFill();
  beginShape();
  for (let i = 0; i <= upto; i++) vertex(cx(box, i), cy(box, cache.trueT[i]));
  endShape();
  drawingContext.setLineDash([]);

  for (let k = 0; k < 4; k++) {
    if (diagMode) { if (k !== diagTarget) continue; }
    else if (!on[k]) continue;
    stroke(diagMode ? '#5e35b1' : SITES[k].color);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i <= upto; i++) vertex(cx(box, i), cy(box, reading(k, i)));
    endShape();
  }

  if (!diagMode) {
    stroke('#b0bec5');
    strokeWeight(1);
    line(cx(box, stepNow()), box.y + 8, cx(box, stepNow()), box.y + box.h - 16);
  }
  noStroke();

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(9);
  text(diagMode ? 'One sensor, unlabelled. Which siting is this?'
                : 'dashed = true air temperature   -   deg C   -   axis fixed',
       box.x + 30, box.y + 3);
}

function drawStats(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  const inner = box.w - 20;
  const step = stepNow();
  const z = narrow ? 10 : 11;
  let y = box.y + 8;
  legendHits = [];

  if (diagMode) {
    fill('#5e35b1');
    textAlign(LEFT, TOP);
    textSize(12);
    text('Diagnosis, round ' + diagRound + ' of 3', box.x + 10, y);
    y += 18;
    fill('#37474f');
    textSize(z + 1);
    const prompt = wrapText('The purple curve is one of the four sitings, plotted against ' +
                            'the true air temperature. Read the shape - when does the error ' +
                            'peak, and how big is it? Then name the siting.', inner, z + 1);
    text(prompt, box.x + 10, y);
    y += prompt.split('\n').length * (z + 4) + 8;
    if (diagFeedback !== '') {
      fill('#00695c');
      textSize(z);
      text(wrapText(diagFeedback, inner, z), box.x + 10, y);
    }
    return;
  }

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('At ' + nf(floor(hourNow()), 2) + ':' + nf(floor((hourNow() % 1) * 60), 2) +
       '   (click a name to hide it)', box.x + 10, y);
  y += 17;
  fill('#78909c');
  textSize(z - 1);
  text('true air temperature ' + nf(cache.trueT[step], 1, 1) + ' deg C', box.x + 10, y);
  y += 15;

  for (let i = 0; i < 4; i++) {
    const e = cache.err[i][step];
    const rowH = z * 2 + 12;
    legendHits.push({ i: i, x: box.x + 8, y: y - 2, w: box.w - 16, h: rowH });
    noStroke();
    fill(on[i] ? SITES[i].color : '#cfd8dc');
    rect(box.x + 10, y + 2, 8, 8, 2);
    fill(on[i] ? '#263238' : '#b0bec5');
    textAlign(LEFT, TOP);
    textSize(z);
    text(wrapText(SITES[i].name, inner - 22, z), box.x + 24, y);
    fill(on[i] ? (abs(e) > 2 ? '#b71c1c' : '#1b5e20') : '#cfd8dc');
    textAlign(RIGHT, TOP);
    textSize(z + 1);
    text((e >= 0 ? '+' : '') + nf(e, 1, 1), box.x + box.w - 10, y + z + 2);
    fill(on[i] ? '#78909c' : '#cfd8dc');
    textAlign(LEFT, TOP);
    textSize(z - 1);
    text('reads ' + nf(reading(i, step), 1, 1) + '   worst so far ' +
         nf(maxErrorTo(i, step), 1, 1), box.x + 24, y + z + 3);
    y += rowH;
  }

  y += 2;
  if (weatherSelect.value() === 'Overcast') {
    fill('#b71c1c');
    textAlign(LEFT, TOP);
    textSize(z);
    const m = 'On a cloudy day, bad siting is invisible. This is why siting errors go ' +
              'unnoticed for months - they only appear when the sun is out.';
    text(wrapText(m, inner, z), box.x + 10, y);
    y += wrapText(m, inner, z).split('\n').length * (z + 3) + 6;
  }

  if (dayDone) {
    const ranked = [0, 1, 2, 3].slice().sort(function (a, b) {
      return maxErrorTo(a, STEPS - 1) - maxErrorTo(b, STEPS - 1);
    });
    fill('#546e7a');
    textSize(z);
    text('Full day, best to worst:', box.x + 10, y);
    y += z + 4;
    for (let r = 0; r < 4; r++) {
      const i = ranked[r];
      fill(SITES[i].color);
      textAlign(LEFT, TOP);
      textSize(z);
      text((r + 1) + '. ' + SITES[i].short, box.x + 14, y);
      fill('#455a64');
      textAlign(RIGHT, TOP);
      text('worst ' + nf(maxErrorTo(i, STEPS - 1), 1, 1) + '   mean ' +
           nf(meanErrorTo(i, STEPS - 1), 1, 1), box.x + box.w - 10, y);
      y += z + 4;
    }
  }

  if (diagFeedback !== '') {
    fill('#00695c');
    textAlign(LEFT, TOP);
    textSize(z);
    text(wrapText(diagFeedback, inner, z), box.x + 10, y + 4);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Weather:', 10, drawHeight + 22);
  text('Season:', 210, drawHeight + 22);
  const t = hourNow();
  text('Time  ' + nf(floor(t), 2) + ':' + nf(floor((t % 1) * 60), 2), 10, drawHeight + 58);
}

// ---- interaction --------------------------------------------------------

function mousePressed() {
  if (diagMode) return;
  for (let i = 0; i < legendHits.length; i++) {
    const h = legendHits[i];
    if (mouseX > h.x && mouseX < h.x + h.w && mouseY > h.y && mouseY < h.y + h.h) {
      on[h.i] = !on[h.i];
      return;
    }
  }
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
