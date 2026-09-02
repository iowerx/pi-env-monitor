// Atmospheric Layers Explorer MicroSim
// CANVAS_HEIGHT: 600
// Bloom Level: Understand (L2) - the learner interprets a scale drawing of the
// atmosphere to explain where weather occurs, and sees how thin the
// weather-producing layer really is.
// Deliberately NOT animated: the scale toggle and the altitude slider are
// learner-controlled, so the surprise lands before the detail is revealed.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 170;

// ---- controls ----
let scaleButton;
let altitudeSlider;

const NARROW_BREAKPOINT = 600;
const TOP_KM = 700;          // top of the drawn column
const TROPOPAUSE_KM = 12;    // top of the troposphere

let stretched = false;       // false = honest linear scale
let altitudeKm = 0;
let selectedLayer = null;
let hoverRefIndex = -1;

// ---- atmospheric layers ----
const LAYERS = [
  { name: 'Troposphere', lo: 0,   hi: 12,  color: '#bbdefb',
    info: '0 to 12 km. All weather happens here. Temperature falls about 6.5 degrees Celsius for every kilometer you climb. Contains about 75 percent of the atmosphere’s mass.' },
  { name: 'Stratosphere', lo: 12, hi: 50,  color: '#90caf9',
    info: '12 to 50 km. Holds the ozone layer. Temperature RISES with altitude here, which is why storms cannot punch through it.' },
  { name: 'Mesosphere',  lo: 50,  hi: 85,  color: '#5c9ede',
    info: '50 to 85 km. Coldest layer. Most meteors burn up here.' },
  { name: 'Thermosphere', lo: 85, hi: 600, color: '#3f6fa8',
    info: '85 to 600 km. Very hot but extremely thin. Auroras glow here.' },
  { name: 'Exosphere',   lo: 600, hi: TOP_KM, color: '#223c5c',
    info: '600 km and up. Atmosphere fades into space.' }
];

// ---- familiar reference objects ----
const REFERENCES = [
  { km: 0.03,  name: 'A house' },
  { km: 0.8,   name: 'Burj Khalifa' },
  { km: 5.9,   name: 'Denali summit' },
  { km: 8.8,   name: 'Mount Everest summit' },
  { km: 11,    name: 'Cruising airliner' },
  { km: 30,    name: 'Weather balloon burst altitude' },
  { km: 100,   name: 'The Kármán line, the usual definition of space' },
  { km: 400,   name: 'International Space Station' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textSize(defaultTextSize);

  scaleButton = createButton('Stretch the troposphere');
  scaleButton.position(10, drawHeight + 10);
  scaleButton.mousePressed(toggleScale);

  // The slider runs in SCREEN-FRACTION units (0..1000), not kilometres, so it
  // maps through the same scale function the drawing uses. In stretched mode
  // that automatically gives fine control inside the troposphere.
  altitudeSlider = createSlider(0, 1000, 0, 1);
  altitudeSlider.position(sliderLeftMargin, drawHeight + 48);
  altitudeSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('A vertical cross-section of the atmosphere from the ground to 700 km. ' +
           'On the honest linear scale the troposphere is a barely visible sliver at the ' +
           'bottom. A toggle stretches the troposphere to half the canvas so its detail ' +
           'becomes readable. An altitude slider reports air pressure, temperature, and a ' +
           'familiar object at any height.', LABEL);
}

function toggleScale() {
  // preserve the learner's altitude across the scale change
  stretched = !stretched;
  scaleButton.html(stretched ? 'Linear scale' : 'Stretch the troposphere');
  altitudeSlider.value(Math.round(fracFromAlt(altitudeKm) * 1000));
}

// ---- scale mapping -------------------------------------------------------
// fracFromAlt / altFromFrac are inverses. frac 0 = ground, 1 = top of column.

function fracFromAlt(km) {
  if (!stretched) return km / TOP_KM;
  if (km <= TROPOPAUSE_KM) return 0.5 * (km / TROPOPAUSE_KM);
  return 0.5 + 0.5 * ((km - TROPOPAUSE_KM) / (TOP_KM - TROPOPAUSE_KM));
}

function altFromFrac(f) {
  if (!stretched) return f * TOP_KM;
  if (f <= 0.5) return (f / 0.5) * TROPOPAUSE_KM;
  return TROPOPAUSE_KM + ((f - 0.5) / 0.5) * (TOP_KM - TROPOPAUSE_KM);
}

// ---- International Standard Atmosphere -----------------------------------
// base altitude km, base temperature K, lapse rate K/km, base pressure hPa
const ISA = [
  { h: 0,      T: 288.15, L: -6.5, P: 1013.25 },
  { h: 11,     T: 216.65, L: 0.0,  P: 226.321 },
  { h: 20,     T: 216.65, L: 1.0,  P: 54.7489 },
  { h: 32,     T: 228.65, L: 2.8,  P: 8.68019 },
  { h: 47,     T: 270.65, L: 0.0,  P: 1.10906 },
  { h: 51,     T: 270.65, L: -2.8, P: 0.669389 },
  { h: 71,     T: 214.65, L: -2.0, P: 0.0395642 },
  { h: 84.852, T: 186.946, L: 0.0, P: 0.00373382 }
];
const G0 = 9.80665, RSTAR = 287.053;

// Above the ISA ceiling the atmosphere is too thin and too variable for a
// closed formula, so these are interpolated through published values.
const HIGH_T = [[85,-90],[100,-78],[150,350],[200,700],[300,900],[400,1000],[600,1100],[700,1100]];
const HIGH_P = [[85,3.73e-3],[100,3.20e-4],[150,4.54e-6],[200,8.47e-7],
                [300,8.77e-8],[400,1.45e-8],[600,8.21e-10],[700,3.60e-10]];

function tempCelsius(km) {
  if (km <= 84.852) {
    let b = ISA[0];
    for (const layer of ISA) { if (km >= layer.h) b = layer; }
    return (b.T + b.L * (km - b.h)) - 273.15;
  }
  return interpLinear(HIGH_T, km);
}

function pressureHpa(km) {
  if (km <= 84.852) {
    let b = ISA[0];
    for (const layer of ISA) { if (km >= layer.h) b = layer; }
    const dh = (km - b.h) * 1000;
    if (Math.abs(b.L) < 1e-9) {
      return b.P * Math.exp(-G0 * dh / (RSTAR * b.T));
    }
    const Lm = b.L / 1000; // K per metre
    return b.P * Math.pow(1 + (Lm * dh) / b.T, -G0 / (RSTAR * Lm));
  }
  return interpLog(HIGH_P, km);
}

function interpLinear(tbl, x) {
  if (x <= tbl[0][0]) return tbl[0][1];
  for (let i = 0; i < tbl.length - 1; i++) {
    if (x <= tbl[i + 1][0]) {
      const t = (x - tbl[i][0]) / (tbl[i + 1][0] - tbl[i][0]);
      return tbl[i][1] + t * (tbl[i + 1][1] - tbl[i][1]);
    }
  }
  return tbl[tbl.length - 1][1];
}

function interpLog(tbl, x) {
  if (x <= tbl[0][0]) return tbl[0][1];
  for (let i = 0; i < tbl.length - 1; i++) {
    if (x <= tbl[i + 1][0]) {
      const t = (x - tbl[i][0]) / (tbl[i + 1][0] - tbl[i][0]);
      const ly = Math.log(tbl[i][1]) + t * (Math.log(tbl[i + 1][1]) - Math.log(tbl[i][1]));
      return Math.exp(ly);
    }
  }
  return tbl[tbl.length - 1][1];
}

function formatPressure(p) {
  if (p >= 100) return p.toFixed(0) + ' hPa';
  if (p >= 1)   return p.toFixed(1) + ' hPa';
  if (p >= 0.01) return p.toFixed(3) + ' hPa';
  return p.toExponential(1).replace('e', ' × 10^') + ' hPa';
}

// nearest reference object within a tolerance that scales with the view
function nearestReference(km) {
  let best = null, bestD = Infinity;
  for (const r of REFERENCES) {
    const d = Math.abs(fracFromAlt(r.km) - fracFromAlt(km));
    if (d < bestD) { bestD = d; best = r; }
  }
  return bestD < 0.035 ? best : null;
}

function layerAt(km) {
  for (const L of LAYERS) { if (km >= L.lo && km < L.hi) return L; }
  return LAYERS[LAYERS.length - 1];
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function columnRect() {
  const top = 58;
  if (isNarrow()) {
    return { x: margin + 70, y: top, w: (canvasWidth - 2 * margin - 70) * 0.62, h: 250 };
  }
  const w = (canvasWidth - 2 * margin) * 0.40;
  return { x: margin + 70, y: top, w: w, h: drawHeight - top - 18 };
}

function panelRect() {
  const c = columnRect();
  if (isNarrow()) {
    const y = c.y + c.h + 14;
    return { x: margin, y: y, w: canvasWidth - 2 * margin, h: drawHeight - y - 12 };
  }
  const x = c.x + c.w + 130;
  return { x: x, y: c.y, w: canvasWidth - margin - x, h: c.h };
}

function yFromAlt(km) {
  const c = columnRect();
  return c.y + c.h - fracFromAlt(km) * c.h;
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

  altitudeKm = altFromFrac(altitudeSlider.value() / 1000);

  drawTitle();
  drawColumn();
  drawReferences();
  drawAltitudeMarker();
  drawStationMarker();
  drawPanel();
  drawControlLabels();
}

function drawTitle() {
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Atmospheric Layers Explorer', canvasWidth / 2, margin - 14);
  textSize(13);
  fill('#555');
  text(stretched
        ? 'Troposphere stretched to half the height — not to scale'
        : 'True linear scale — notice how thin the weather layer is',
       canvasWidth / 2, margin + 12);
}

function drawColumn() {
  const c = columnRect();

  // layer bands, drawn from the top of the column downwards
  for (const L of LAYERS) {
    const yTop = yFromAlt(Math.min(L.hi, TOP_KM));
    const yBot = yFromAlt(L.lo);
    const h = yBot - yTop;
    const isSel = selectedLayer === L.name;

    noStroke();
    fill(L.color);
    rect(c.x, yTop, c.w, h);

    if (isSel) {
      stroke('#000');
      strokeWeight(2.5);
      noFill();
      rect(c.x, yTop, c.w, h);
      noStroke();
    }

    // band name, only when the band is tall enough to hold it
    if (h >= 15) {
      noStroke();
      // dark bands need light text
      fill(L.lo >= 85 ? '#ffffff' : '#123');
      textAlign(LEFT, CENTER);
      textSize(13);
      text(L.name, c.x + 6, yTop + h / 2);
    }
  }

  // column border
  noFill();
  stroke('#607d8b');
  strokeWeight(1.5);
  rect(c.x, c.y, c.w, c.h);
  noStroke();

  drawAxisTicks();
}

function drawAxisTicks() {
  const c = columnRect();
  const ticks = stretched
    ? [0, 3, 6, 9, 12, 100, 300, 700]
    : [0, 100, 200, 300, 400, 500, 600, 700];

  textAlign(RIGHT, CENTER);
  textSize(12);
  for (const t of ticks) {
    const y = yFromAlt(t);
    stroke('#90a4ae');
    strokeWeight(1);
    line(c.x - 16, y, c.x, y);
    noStroke();
    fill('#37474f');
    text(t + ' km', c.x - 20, y);
  }

}

function drawReferences() {
  const c = columnRect();
  hoverRefIndex = -1;

  for (let i = 0; i < REFERENCES.length; i++) {
    const r = REFERENCES[i];
    if (r.km > TOP_KM) continue;
    const y = yFromAlt(r.km);
    const x = c.x + c.w;

    // in linear mode the low objects all collapse onto the ground line, so
    // only draw the ones that are separated enough to be readable
    const near = i > 0 ? Math.abs(y - yFromAlt(REFERENCES[i - 1].km)) : 99;
    const crowded = near < 9;

    const hovered = mouseX > x && mouseX < x + 26 && Math.abs(mouseY - y) < 6;
    if (hovered) hoverRefIndex = i;

    stroke(hovered ? '#c62828' : '#78909c');
    strokeWeight(hovered ? 2 : 1);
    line(x, y, x + (crowded ? 10 : 18), y);
    noStroke();
    fill(hovered ? '#c62828' : '#546e7a');
    circle(x + (crowded ? 10 : 18), y, hovered ? 8 : 5);
  }

  // label only the hovered object, so the column never gets cluttered
  if (hoverRefIndex >= 0) {
    const r = REFERENCES[hoverRefIndex];
    const y = yFromAlt(r.km);
    textSize(13);
    const label = r.name + '  (' + r.km + ' km)';
    const w = textWidth(label) + 12;
    // Long names would otherwise run under the info panel, so slide the
    // tooltip left until it fits; overlaying the column is fine for a
    // transient hover label with an opaque background.
    const rightLimit = isNarrow() ? (canvasWidth - margin) : (panelRect().x - 8);
    let x = c.x + c.w + 24;
    if (x + w > rightLimit) x = max(c.x + 4, rightLimit - w);
    fill(255, 255, 255, 240);
    stroke('#c62828');
    strokeWeight(1);
    rect(x, y - 11, w, 22, 4);
    noStroke();
    fill('#1a1a1a');
    textAlign(LEFT, CENTER);
    text(label, x + 6, y);
  } else if (!isNarrow()) {
    // a quiet hint so the learner knows the ticks are interactive
    const x = c.x + c.w + 24;
    noStroke();
    fill('#90a4ae');
    textAlign(LEFT, CENTER);
    textSize(12);
    text('hover a dot', x, c.y + 10);
  }
}

function drawStationMarker() {
  const c = columnRect();
  const y = yFromAlt(0);
  const label = 'Your station is here';
  textSize(12);
  const w = textWidth(label) + 10;

  // pill sits clear above the ground line so the altitude marker, the 0 km
  // tick and this label never share the same pixels
  const px = c.x + c.w - w - 6;
  noStroke();
  fill(255, 255, 255, 235);
  stroke('#2e7d32');
  strokeWeight(1);
  rect(px, y - 26, w, 17, 4);
  noStroke();
  fill('#1b5e20');
  textAlign(LEFT, CENTER);
  text(label, px + 5, y - 17.5);

  // marker triangle on the ground line itself
  fill('#2e7d32');
  triangle(c.x - 2, y, c.x + 12, y - 7, c.x + 12, y + 7);
}

function drawAltitudeMarker() {
  const c = columnRect();
  const y = yFromAlt(altitudeKm);

  stroke('#d32f2f');
  strokeWeight(2);
  line(c.x - 6, y, c.x + c.w + 6, y);
  noStroke();
  fill('#d32f2f');
  triangle(c.x - 6, y, c.x - 14, y - 5, c.x - 14, y + 5);
}

function drawPanel() {
  const b = panelRect();
  noStroke();
  fill(255, 255, 255, 235);
  stroke(200);
  strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 10);
  noStroke();

  const pad = 12;
  let y = b.y + pad;
  const w = b.w - pad * 2;

  // ---- readout at the current altitude ----
  fill('#111');
  textAlign(LEFT, TOP);
  textSize(17);
  textStyle(BOLD);
  text('At ' + formatAltitude(altitudeKm), b.x + pad, y);
  textStyle(NORMAL);
  y += 26;

  const p = pressureHpa(altitudeKm);
  const t = tempCelsius(altitudeKm);
  const inLayer = layerAt(altitudeKm);

  textSize(defaultTextSize);
  fill('#333');
  text('Air pressure: ' + formatPressure(p), b.x + pad, y);  y += 22;
  text('Temperature: ' + t.toFixed(1) + ' °C', b.x + pad, y);  y += 22;
  text('Layer: ' + inLayer.name, b.x + pad, y); y += 22;

  const ref = nearestReference(altitudeKm);
  fill(ref ? '#c62828' : '#999');
  textSize(13);
  text(ref ? 'Near here: ' + ref.name : 'No familiar landmark at this height',
       b.x + pad, y, w, 34);
  y += 34;

  // percentage of atmosphere below, by mass
  const frac = (1 - p / 1013.25) * 100;
  fill('#37474f');
  textSize(13);
  text(frac.toFixed(1) + '% of the atmosphere’s mass is below you',
       b.x + pad, y, w, 34);
  y += 36;

  // ---- selected layer infobox ----
  stroke('#e0e0e0');
  strokeWeight(1);
  line(b.x + pad, y, b.x + b.w - pad, y);
  noStroke();
  y += 10;

  if (!selectedLayer) {
    fill('#777');
    textSize(13);
    text('Click a coloured band to read about that layer.',
         b.x + pad, y, w, b.h - (y - b.y) - pad);
    return;
  }

  const L = LAYERS.find(function (s) { return s.name === selectedLayer; });
  noStroke();
  fill(L.color);
  rect(b.x + pad, y + 2, 14, 14, 3);
  fill('#111');
  textSize(16);
  textStyle(BOLD);
  text(L.name, b.x + pad + 20, y);
  textStyle(NORMAL);
  y += 24;
  fill('#222');
  textSize(13);
  text(L.info, b.x + pad, y, w, b.h - (y - b.y) - pad);
}

function formatAltitude(km) {
  if (km < 1) return (km * 1000).toFixed(0) + ' m';
  if (km < 20) return km.toFixed(2) + ' km';
  return km.toFixed(0) + ' km';
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Scale: ' + (stretched ? 'stretched' : 'linear'), 200, drawHeight + 22);
  text('Altitude: ' + formatAltitude(altitudeKm), 10, drawHeight + 58);
}

// ---- interaction ---------------------------------------------------------

function mousePressed() {
  const c = columnRect();
  if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
    // which band did the click land in
    for (const L of LAYERS) {
      const yTop = yFromAlt(Math.min(L.hi, TOP_KM));
      const yBot = yFromAlt(L.lo);
      if (mouseY >= yTop && mouseY <= yBot) {
        selectedLayer = (selectedLayer === L.name) ? null : L.name;
        return;
      }
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
  altitudeSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
