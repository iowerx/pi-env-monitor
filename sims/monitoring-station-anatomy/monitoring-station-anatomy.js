// Anatomy of an Environmental Monitoring Station - interactive infographic
// CANVAS_HEIGHT: 560
// Bloom Level: Remember (L1) - the learner identifies each major component of a
// monitoring station and names the quantity it measures. Each hotspot points to
// the chapter where that component is covered in depth.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 510;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- controls ----
let showAllCheckbox;
let resetButton;

// Below this width the info panel moves below the illustration instead of
// sitting to its right.
const NARROW_BREAKPOINT = 600;

// ---- hotspots ----
// x and y are FRACTIONS of the illustration area, never fixed pixels, so the
// whole diagram scales with the container.
// color follows the learning-graph taxonomy: sensors warm, computing/power cool.
const HOTSPOTS = [
  { id: 'enclosure',  fx: 0.355, fy: 0.700, label: 'Enclosure', chapter: 16,
    color: '#5c6bc0',
    info: 'The weatherproof box. Keeps rain and sun off the electronics. Covered in Chapter 16.' },
  { id: 'sbc',        fx: 0.437, fy: 0.668, label: 'Single-board computer', chapter: 3,
    color: '#42a5f5',
    info: 'A whole computer on one circuit board. Asks the sensors for readings and writes them down. Chapter 3.' },
  { id: 'bme280',     fx: 0.720, fy: 0.500, label: 'BME280 sensor', chapter: 6,
    color: '#ef5350',
    info: 'One chip that measures temperature, pressure, and humidity. Chapters 6, 7, and 8.' },
  { id: 'shield',     fx: 0.790, fy: 0.400, label: 'Radiation shield', chapter: 6,
    color: '#ff7043',
    info: 'White louvers keep sunlight off the thermometer. Without this, the station measures the sun, not the air. Chapter 6.' },
  { id: 'anemometer', fx: 0.300, fy: 0.100, label: 'Anemometer', chapter: 10,
    color: '#ffa726',
    info: 'Spinning cups measure wind speed. Chapter 10.' },
  { id: 'solarrad',   fx: 0.620, fy: 0.160, label: 'Solar radiation sensor', chapter: 9,
    color: '#ffca28',
    info: 'Measures the energy arriving from the Sun, in watts per square meter. Chapter 9.' },
  { id: 'accel',      fx: 0.565, fy: 0.658, label: 'Accelerometer', chapter: 11,
    color: '#8d6e63',
    info: 'Feels the ground shake. Chapter 11.' },
  { id: 'gps',        fx: 0.440, fy: 0.200, label: 'GPS antenna', chapter: 5,
    color: '#26a69a',
    info: 'Gives the station its exact position and a very accurate clock. Chapter 5.' },
  { id: 'panel',      fx: 0.160, fy: 0.300, label: 'Solar panel', chapter: 16,
    color: '#7e57c2',
    info: 'Charges the battery so the station never needs to be plugged in. Chapter 16.' },
  { id: 'battery',    fx: 0.440, fy: 0.770, label: 'Battery', chapter: 16,
    color: '#5c6bc0',
    info: 'Runs the station at night and through cloudy weather. Chapter 16.' },
  { id: 'cell',       fx: 0.860, fy: 0.220, label: 'Cellular antenna', chapter: 16,
    color: '#78909c',
    info: 'Sends the data home when there is no Wi-Fi. Chapter 16.' }
];

let explored = {};      // id -> true once clicked
let selectedId = null;  // currently open infobox
let hoverId = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textSize(defaultTextSize);

  showAllCheckbox = createCheckbox(' Show all labels', false);
  showAllCheckbox.position(10, drawHeight + 14);

  resetButton = createButton('Reset');
  resetButton.position(170, drawHeight + 12);
  resetButton.mousePressed(resetExplored);

  describe('An interactive side-view diagram of a small environmental monitoring station. ' +
           'Clicking any labelled component opens an infobox naming what it measures and ' +
           'the chapter that covers it in depth.', LABEL);
}

function resetExplored() {
  explored = {};
  selectedId = null;
}

// ---- layout helpers -------------------------------------------------------
// The drawing region splits into an illustration area and an info panel.
// Wide: illustration left two-thirds, panel right one-third.
// Narrow: illustration on top, panel underneath.

function isNarrow() {
  return canvasWidth < NARROW_BREAKPOINT;
}

function illoRect() {
  const top = 55;
  if (isNarrow()) {
    return { x: margin, y: top, w: canvasWidth - 2 * margin, h: 270 };
  }
  const w = (canvasWidth - 2 * margin) * 0.64;
  return { x: margin, y: top, w: w, h: drawHeight - top - 15 };
}

function panelRect() {
  const illo = illoRect();
  if (isNarrow()) {
    return { x: margin, y: illo.y + illo.h + 12, w: canvasWidth - 2 * margin,
             h: drawHeight - (illo.y + illo.h + 12) - 15 };
  }
  const x = illo.x + illo.w + 16;
  return { x: x, y: illo.y, w: canvasWidth - margin - x, h: illo.h };
}

function hotspotPos(h) {
  const illo = illoRect();
  return { x: illo.x + h.fx * illo.w, y: illo.y + h.fy * illo.h };
}

function hotspotRadius() {
  const illo = illoRect();
  // scale the marker with the illustration but keep it tappable
  return constrain(illo.w * 0.026, 9, 14);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  updateHover();
  drawTitle();
  drawStation();
  drawHotspots();
  drawPanel();
  drawControlLabels();
}

function updateHover() {
  hoverId = null;
  const r = hotspotRadius();
  for (const h of HOTSPOTS) {
    const p = hotspotPos(h);
    if (dist(mouseX, mouseY, p.x, p.y) <= r + 4) {
      hoverId = h.id;
      break;
    }
  }
}

function drawTitle() {
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Anatomy of a Monitoring Station', canvasWidth / 2, margin - 12);
  textSize(13);
  fill('#555');
  text('Click a numbered marker to learn what it measures', canvasWidth / 2, margin + 14);
}

// ---- the illustration -----------------------------------------------------
// Drawn entirely with p5 primitives so it scales cleanly at any width.

function drawStation() {
  const b = illoRect();
  // sky
  noStroke();
  fill('#eaf4fb');
  rect(b.x, b.y, b.w, b.h, 6);

  // ground
  fill('#c8b48b');
  const groundY = b.y + b.h * 0.93;
  rect(b.x, groundY, b.w, b.y + b.h - groundY, 0, 0, 6, 6);
  stroke('#a89468');
  strokeWeight(1);
  line(b.x, groundY, b.x + b.w, groundY);
  noStroke();

  const cx = b.x + b.w * 0.5;   // mast centre
  const mastTop = b.y + b.h * 0.20;

  // ---- mast ----
  stroke('#8d99a6');
  strokeWeight(max(3, b.w * 0.012));
  line(cx, mastTop, cx, groundY);
  noStroke();

  // ---- cross-arm carrying the top instruments ----
  stroke('#8d99a6');
  strokeWeight(max(2, b.w * 0.008));
  line(b.x + b.w * 0.28, mastTop, b.x + b.w * 0.64, mastTop);
  noStroke();

  // ---- anemometer (three cups on a hub, left end of the arm) ----
  const anemX = b.x + b.w * 0.30;
  const anemY = b.y + b.h * 0.10;
  stroke('#8d99a6');
  strokeWeight(2);
  line(anemX, anemY, anemX, mastTop);
  const cupR = max(4, b.w * 0.022);
  const armR = max(9, b.w * 0.045);
  for (let i = 0; i < 3; i++) {
    const a = -HALF_PI + i * TWO_PI / 3;
    const ex = anemX + cos(a) * armR;
    const ey = anemY + sin(a) * armR;
    stroke('#607d8b');
    strokeWeight(2);
    line(anemX, anemY, ex, ey);
    noStroke();
    fill('#ffa726');
    circle(ex, ey, cupR * 2);
  }
  noStroke();

  // ---- GPS antenna (puck on a short stub) ----
  const gpsX = b.x + b.w * 0.44;
  const gpsY = b.y + b.h * 0.20;
  fill('#26a69a');
  rectMode(CENTER);
  rect(gpsX, gpsY - max(5, b.w * 0.018), max(16, b.w * 0.07), max(7, b.w * 0.028), 3);
  rectMode(CORNER);

  // ---- solar radiation sensor (dome on a small plate) ----
  const srX = b.x + b.w * 0.62;
  const srY = b.y + b.h * 0.16;
  stroke('#8d99a6');
  strokeWeight(2);
  line(srX, srY, srX, mastTop);
  noStroke();
  fill('#b0bec5');
  rectMode(CENTER);
  rect(srX, srY, max(20, b.w * 0.085), max(5, b.w * 0.02), 2);
  rectMode(CORNER);
  fill('#ffe082');
  arc(srX, srY - max(2, b.w * 0.008), max(16, b.w * 0.07), max(16, b.w * 0.07), PI, TWO_PI, CHORD);

  // ---- cellular antenna (whip on the right) ----
  const cellX = b.x + b.w * 0.86;
  const cellBase = b.y + b.h * 0.34;
  stroke('#78909c');
  strokeWeight(max(2, b.w * 0.009));
  line(cellX, cellBase, cellX, b.y + b.h * 0.16);
  strokeWeight(1);
  line(cellX, cellBase, cx, b.y + b.h * 0.46);
  noStroke();
  fill('#78909c');
  circle(cellX, b.y + b.h * 0.16, max(5, b.w * 0.02));

  // ---- radiation shield with BME280 inside (right of mast) ----
  const shX = b.x + b.w * 0.72;
  const shTop = b.y + b.h * 0.38;
  const shW = max(24, b.w * 0.10);
  const shH = max(30, b.h * 0.16);
  stroke('#8d99a6');
  strokeWeight(2);
  line(shX, shTop + shH * 0.4, cx, shTop + shH * 0.4);
  noStroke();
  // stacked louver plates
  const plates = 5;
  for (let i = 0; i < plates; i++) {
    const py = shTop + (i * shH) / plates;
    fill(i % 2 === 0 ? '#ffffff' : '#eceff1');
    stroke('#b0bec5');
    strokeWeight(1);
    ellipse(shX, py + shH / plates / 2, shW, shH / plates * 1.25);
  }
  noStroke();
  // the sensor chip nested inside
  fill('#ef5350');
  rectMode(CENTER);
  rect(shX, shTop + shH * 0.5, max(6, shW * 0.28), max(6, shW * 0.28), 1);
  rectMode(CORNER);

  // ---- solar panel (tilted, on the left) ----
  const spX = b.x + b.w * 0.16;
  const spY = b.y + b.h * 0.30;
  stroke('#8d99a6');
  strokeWeight(2);
  line(spX, spY + max(10, b.h * 0.05), spX, b.y + b.h * 0.58);
  line(spX, b.y + b.h * 0.58, cx, b.y + b.h * 0.58);
  noStroke();
  push();
  translate(spX, spY);
  rotate(-0.35);
  fill('#3949ab');
  stroke('#283593');
  strokeWeight(1);
  const spW = max(34, b.w * 0.15);
  const spH = max(14, b.w * 0.06);
  rectMode(CENTER);
  rect(0, 0, spW, spH, 2);
  // cell grid lines
  stroke('#7986cb');
  for (let i = 1; i < 4; i++) {
    const gx = -spW / 2 + (i * spW) / 4;
    line(gx, -spH / 2, gx, spH / 2);
  }
  line(-spW / 2, 0, spW / 2, 0);
  rectMode(CORNER);
  pop();
  noStroke();

  // ---- enclosure on the mast (holds SBC, battery, accelerometer) ----
  const encW = max(58, b.w * 0.26);
  const encH = max(64, b.h * 0.26);
  const encX = cx - encW / 2;
  const encY = b.y + b.h * 0.58;
  fill('#eceff1');
  stroke('#90a4ae');
  strokeWeight(2);
  rect(encX, encY, encW, encH, 5);
  // lid line
  strokeWeight(1);
  line(encX, encY + encH * 0.12, encX + encW, encY + encH * 0.12);
  noStroke();

  // single-board computer inside
  fill('#42a5f5');
  const sbcW = encW * 0.38;
  const sbcH = encH * 0.24;
  rect(encX + encW * 0.07, encY + encH * 0.22, sbcW, sbcH, 2);
  // little header pins
  fill('#1e88e5');
  for (let i = 0; i < 4; i++) {
    rect(encX + encW * 0.09 + i * (sbcW * 0.20), encY + encH * 0.24, sbcW * 0.10, sbcH * 0.22);
  }

  // accelerometer chip inside
  fill('#8d6e63');
  rect(encX + encW * 0.60, encY + encH * 0.22, encW * 0.22, encH * 0.16, 2);

  // battery inside
  fill('#5c6bc0');
  rect(encX + encW * 0.10, encY + encH * 0.60, encW * 0.70, encH * 0.26, 3);
  // terminals sit to the RIGHT so the battery marker never covers them
  fill('#ffffff');
  textAlign(CENTER, CENTER);
  textSize(max(9, encH * 0.14));
  noStroke();
  text('+  -', encX + encW * 0.63, encY + encH * 0.73);
}

function drawHotspots() {
  const r = hotspotRadius();
  const showAll = showAllCheckbox.checked();

  for (let i = 0; i < HOTSPOTS.length; i++) {
    const h = HOTSPOTS[i];
    const p = hotspotPos(h);
    const isSel = selectedId === h.id;
    const isHover = hoverId === h.id;

    // halo when selected or hovered
    if (isSel || isHover) {
      noStroke();
      fill(red(color(h.color)), green(color(h.color)), blue(color(h.color)), 60);
      circle(p.x, p.y, r * 3.2);
    }

    stroke(isSel ? '#000' : '#ffffff');
    strokeWeight(isSel ? 3 : 2);
    fill(h.color);
    circle(p.x, p.y, r * 2);

    // marker number
    noStroke();
    fill('#ffffff');
    textAlign(CENTER, CENTER);
    textSize(max(10, r * 0.95));
    text(i + 1, p.x, p.y + 0.5);

    // explored check mark
    if (explored[h.id]) {
      noStroke();
      fill('#2e7d32');
      circle(p.x + r * 0.95, p.y - r * 0.95, r * 0.95);
      fill('#ffffff');
      textSize(max(8, r * 0.7));
      text('✓', p.x + r * 0.95, p.y - r * 0.9);
    }

    // labels
    if (showAll || isHover) {
      drawFloatingLabel(h, p, r);
    }
  }
}

function drawFloatingLabel(h, p, r) {
  textSize(13);
  const padX = 6;
  const w = textWidth(h.label) + padX * 2;
  const hgt = 20;
  const illo = illoRect();
  // flip the label to the left when it would run off the right edge
  let lx = p.x + r + 6;
  if (lx + w > illo.x + illo.w) lx = p.x - r - 6 - w;
  const ly = p.y - hgt / 2;

  noStroke();
  fill(255, 255, 255, 235);
  stroke('#b0bec5');
  strokeWeight(1);
  rect(lx, ly, w, hgt, 4);
  noStroke();
  fill('#1a1a1a');
  textAlign(LEFT, CENTER);
  text(h.label, lx + padX, ly + hgt / 2);
}

function drawPanel() {
  const b = panelRect();
  noStroke();
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 10);
  noStroke();

  const pad = 12;
  textAlign(LEFT, TOP);

  if (!selectedId) {
    // Default state doubles as the component index, so the panel is never
    // dead space and the learner gets the overview before the detail.
    fill('#444');
    textSize(14);
    textStyle(BOLD);
    text('The eleven parts', b.x + pad, b.y + pad);
    textStyle(NORMAL);

    const lineH = min(22, (b.h - pad * 2 - 52) / HOTSPOTS.length);
    let ly = b.y + pad + 24;
    textSize(min(13, lineH - 7));
    for (let i = 0; i < HOTSPOTS.length; i++) {
      const h = HOTSPOTS[i];
      noStroke();
      fill(h.color);
      circle(b.x + pad + 7, ly + lineH / 2 - 1, 13);
      fill('#ffffff');
      textAlign(CENTER, CENTER);
      textSize(9);
      text(i + 1, b.x + pad + 7, ly + lineH / 2 - 0.5);

      fill(explored[h.id] ? '#2e7d32' : '#333');
      textAlign(LEFT, CENTER);
      textSize(min(13, lineH - 7));
      text((explored[h.id] ? '✓ ' : '') + h.label,
           b.x + pad + 19, ly + lineH / 2 - 1);
      ly += lineH;
    }

    fill('#888');
    textAlign(LEFT, TOP);
    textSize(12);
    const n = Object.keys(explored).length;
    text('Click a marker for detail.  Explored ' + n + ' of ' + HOTSPOTS.length,
         b.x + pad, b.y + b.h - 24, b.w - pad * 2, 20);
    return;
  }

  const h = HOTSPOTS.find(function (s) { return s.id === selectedId; });
  const idx = HOTSPOTS.indexOf(h) + 1;

  // colour swatch + title
  noStroke();
  fill(h.color);
  circle(b.x + pad + 9, b.y + pad + 10, 18);
  fill('#ffffff');
  textAlign(CENTER, CENTER);
  textSize(11);
  text(idx, b.x + pad + 9, b.y + pad + 10.5);

  fill('#111');
  textAlign(LEFT, TOP);
  textSize(17);
  textStyle(BOLD);
  text(h.label, b.x + pad + 26, b.y + pad + 1, b.w - pad * 2 - 26, 44);
  textStyle(NORMAL);

  fill('#222');
  textSize(defaultTextSize);
  text(h.info, b.x + pad, b.y + pad + 40, b.w - pad * 2, b.h - pad * 2 - 66);

  fill('#888');
  textSize(13);
  const n2 = Object.keys(explored).length;
  text('Explored ' + n2 + ' of ' + HOTSPOTS.length, b.x + pad, b.y + b.h - 26);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Markers explored: ' + Object.keys(explored).length + ' of ' + HOTSPOTS.length,
       240, drawHeight + 25);
}

// ---- interaction ----------------------------------------------------------

function mousePressed() {
  const r = hotspotRadius();
  for (const h of HOTSPOTS) {
    const p = hotspotPos(h);
    if (dist(mouseX, mouseY, p.x, p.y) <= r + 4) {
      selectedId = h.id;
      explored[h.id] = true;
      return;
    }
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

// ---- responsive plumbing (must stay at the end) ----

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
