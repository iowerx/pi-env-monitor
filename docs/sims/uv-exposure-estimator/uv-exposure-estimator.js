// UV Exposure Risk Estimator MicroSim
// CANVAS_HEIGHT: 670
// Bloom Level: Evaluate (L5) - the learner assesses UV risk for a time, place and
// surface, and justifies why neither brightness nor warmth predicts it.
// UV index, perceived brightness and perceived warmth are displayed side by side
// on three separate scales, on purpose. Watching them move independently is the
// entire lesson: cloud cuts visible light far more than it cuts UV, altitude and
// snow raise UV while lowering the temperature, and a dazzling winter morning
// carries almost none.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 190;

const NARROW_BREAKPOINT = 780;

// ---- controls ----
let timeSlider, altSlider;
let presetButtons = [];

// ---- state ----
let latDeg = 45, doy = 172;
let cloud = 'Clear', surface = 'Grass', ozoneKey = 'Normal';
let verdict = '';
let chipHits = [];

const CHOICES = {
  Latitude: { key: 'lat', items: [['0 deg', 0], ['23.5', 23.5], ['45', 45], ['55', 55], ['66.5', 66.5]] },
  Date:     { key: 'doy', items: [['Mar', 79], ['Jun', 172], ['Sep', 265], ['Dec', 355]] },
  Cloud:    { key: 'cloud', items: [['Clear', 'Clear'], ['Light', 'Light'], ['Overcast', 'Overcast']] },
  Ground:   { key: 'surface', items: [['Grass', 'Grass'], ['Sand', 'Sand'], ['Water', 'Water'],
                                      ['Snow', 'Snow'], ['Concr.', 'Concrete']] },
  Ozone:    { key: 'ozone', items: [['Normal', 'Normal'], ['Low', 'Low']] }
};

// Cloud attenuates UV and visible light by very different factors. That
// difference is the mechanism this whole element exists to teach.
const CLOUD = { Clear: { uv: 1.00, vis: 1.00 }, Light: { uv: 0.90, vis: 0.65 },
                Overcast: { uv: 0.35, vis: 0.15 } };
const GROUND = { Grass: 1.00, Sand: 1.05, Water: 1.05, Snow: 1.20, Concrete: 1.08 };
const ALBEDO_VIS = { Grass: 0.25, Sand: 0.40, Water: 0.10, Snow: 0.85, Concrete: 0.30 };
const OZONE = { Normal: 300, Low: 240 };

const BANDS = [
  { hi: 2.5,  name: 'Low',       col: '#4caf50' },
  { hi: 5.5,  name: 'Moderate',  col: '#ffeb3b' },
  { hi: 7.5,  name: 'High',      col: '#ff9800' },
  { hi: 10.5, name: 'Very high', col: '#f44336' },
  { hi: 20,   name: 'Extreme',   col: '#9c27b0' }
];

const PRESETS = [
  { label: 'Ski', lat: 45, doy: 79, t: 12, alt: 2500, cloud: 'Clear', surface: 'Snow',
    ozone: 'Normal',
    text: 'Cold and dazzling. UV index {UV}. Skiers burn under the chin from snow ' +
          'reflection - the index is for a flat surface, and upward-facing skin gets ' +
          'roughly 80 per cent again on top of it.' },
  { label: 'Hazy beach', lat: 30, doy: 172, t: 15, alt: 0, cloud: 'Light', surface: 'Sand',
    ozone: 'Normal',
    text: 'Feels mild. UV index {UV}. This is the most commonly underestimated case: light ' +
          'cloud takes a third off the brightness and almost nothing off the UV.' },
  { label: 'Winter 55N', lat: 55, doy: 355, t: 12, alt: 0, cloud: 'Clear', surface: 'Concrete',
    ozone: 'Normal',
    text: 'Freezing, low Sun, UV index {UV}. Everything is low here - and that is the ' +
          'point when you set it beside the other two. A ski slope at minus six carries ' +
          'UV 7, and an overcast noon that looks harmless carries UV 4. Neither warmth ' +
          'nor brightness predicts UV in either direction.' },
  { label: 'Tropical noon', lat: 0, doy: 79, t: 12, alt: 0, cloud: 'Clear', surface: 'Grass',
    ozone: 'Normal',
    text: 'UV index {UV}. Extreme. The Sun is directly overhead and the path through the ' +
          'atmosphere is as short as it ever gets.' },
  { label: 'Overcast noon', lat: 45, doy: 172, t: 12, alt: 0, cloud: 'Overcast', surface: 'Grass',
    ozone: 'Normal',
    text: 'UV index {UV}. Cloud reduces UV far less than it reduces visible light. It looks ' +
          'like a day you cannot burn on. It is not.' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  timeSlider = createSlider(0, 1440, 720, 5);
  altSlider = createSlider(0, 4000, 0, 50);

  for (let i = 0; i < PRESETS.length; i++) {
    const b = createButton(PRESETS[i].label);
    b.mousePressed(function () { applyPreset(i); });
    presetButtons.push(b);
  }

  layoutControls();

  describe('A UV index gauge with the five standard colour bands, a time-to-sunburn ' +
           'readout, and - deliberately alongside them - perceived brightness and ' +
           'perceived warmth on their own separate scales. A breakdown shows how much ' +
           'each factor added or removed: solar angle, altitude, cloud, ground ' +
           'reflection and ozone. Five preset scenarios include a freezing day with a ' +
           'UV index of 8 and a dazzling one with a UV index under 1.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 82;
  timeSlider.position(sliderLeftMargin, r1 + 4);
  timeSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  altSlider.position(sliderLeftMargin, r2 + 4);
  altSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  let x = 10;
  const w = [40, 84, 82, 92, 96];
  for (let i = 0; i < presetButtons.length; i++) {
    presetButtons[i].position(x, r3);
    x += w[i] + 5;
  }
}

function applyPreset(i) {
  const p = PRESETS[i];
  latDeg = p.lat; doy = p.doy; cloud = p.cloud; surface = p.surface; ozoneKey = p.ozone;
  timeSlider.value(p.t * 60);
  altSlider.value(p.alt);
  verdict = p.text;
}

// ---- the model ----------------------------------------------------------

function hourNow() { return timeSlider.value() / 60; }
function altKm() { return altSlider.value() / 1000; }

function declination() { return 23.44 * sin(radians(360 / 365 * (doy - 81))); }

function cosZ() {
  const dec = radians(declination());
  const H = radians(15 * (hourNow() - 12));
  return sin(radians(latDeg)) * sin(dec) + cos(radians(latDeg)) * cos(dec) * cos(H);
}

function airMass(cz) {
  if (cz <= 0) return 40;
  const zdeg = degrees(Math.acos(min(1, cz)));
  return 1 / (cz + 0.50572 * Math.pow(96.07995 - zdeg, -1.6364));
}

// named uvModel, not model: p5 has a global model() for WEBGL geometry
function uvModel() {
  const cz = max(0, cosZ());
  const base = cz <= 0 ? 0 : 12.5 * Math.pow(cz, 2.42) * Math.pow(300 / OZONE[ozoneKey], 1.2);
  const fAlt = 1 + 0.06 * altKm();
  const fCloud = CLOUD[cloud].uv;
  const fGround = GROUND[surface];
  const uvi = base * fAlt * fCloud * fGround;

  // visible light follows a completely different set of factors
  const solar = cz <= 0 ? 0 : 1361 * cz * Math.exp(-0.30 * airMass(cz));
  const visible = solar * CLOUD[cloud].vis * (1 + 0.8 * ALBEDO_VIS[surface]);
  const bright = constrain(visible / 100, 0, 10);

  // air temperature, with an altitude lapse, so a high UV can come with a low one
  const tBase = 8 - 0.20 * latDeg + (latDeg / 66.5) * 12 * cos(TWO_PI * (doy - 172) / 365);
  const temp = tBase + 0.018 * solar - 6.5 * altKm();

  const burn = uvi < 0.2 ? Infinity : 200 / uvi;
  return { cz: cz, base: base, fAlt: fAlt, fCloud: fCloud, fGround: fGround,
           uvi: uvi, bright: bright, temp: temp, burn: burn, solar: solar };
}

function bandOf(uvi) {
  for (let i = 0; i < BANDS.length; i++) if (uvi < BANDS[i].hi) return BANDS[i];
  return BANDS[BANDS.length - 1];
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  const m = uvModel();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  fill('black');
  textAlign(CENTER, TOP);
  textSize(narrow ? 16 : 21);
  text('UV Risk: Not What It Looks Like, Not What It Feels Like',
       canvasWidth / 2, narrow ? 5 : 4);

  let chipB, gaugeB, barsB, breakB, verdB;
  if (narrow) {
    const w = canvasWidth - 2 * margin;
    chipB = { x: margin, y: 26, w: w, h: 130 };
    gaugeB = { x: margin, y: 162, w: 166, h: 172 };
    barsB = { x: margin + 174, y: 162, w: w - 174, h: 172 };
    breakB = { x: margin, y: 340, w: w, h: 108 };
    verdB = { x: margin, y: 454, w: w, h: drawHeight - 466 };
  } else {
    chipB = { x: margin, y: 34, w: 194, h: drawHeight - 48 };
    gaugeB = { x: margin + 202, y: 34, w: 232, h: 244 };
    barsB = { x: margin + 202, y: 284, w: 232, h: drawHeight - 298 };
    breakB = { x: margin + 442, y: 34, w: canvasWidth - margin - (margin + 442), h: 208 };
    verdB = { x: margin + 442, y: 250, w: canvasWidth - margin - (margin + 442),
              h: drawHeight - 264 };
  }

  drawChips(chipB, narrow);
  drawGauge(gaugeB, m, narrow);
  drawBars(barsB, m, narrow);
  drawBreakdown(breakB, m, narrow);
  drawVerdict(verdB, m, narrow);
  drawControlLabels(m);
}

function drawChips(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  chipHits = [];

  const groups = Object.keys(CHOICES);
  const rowH = (box.h - 10) / groups.length;
  const gutter = narrow ? 50 : 0;
  for (let g = 0; g < groups.length; g++) {
    const name = groups[g];
    const spec = CHOICES[name];
    const y = box.y + 6 + g * rowH;
    fill('#546e7a');
    textSize(9);
    if (narrow) {
      textAlign(LEFT, CENTER);
      text(name, box.x + 8, y + rowH / 2 - 2);
    } else {
      textAlign(LEFT, TOP);
      text(name, box.x + 8, y);
    }
    const items = spec.items;
    const cw = (box.w - 16 - gutter) / items.length;
    const chipY = narrow ? y + 2 : y + 12;
    const chipH = narrow ? rowH - 8 : rowH - 20;
    for (let i = 0; i < items.length; i++) {
      const cx = box.x + 8 + gutter + i * cw;
      const cur = spec.key === 'lat' ? latDeg : spec.key === 'doy' ? doy
                : spec.key === 'cloud' ? cloud : spec.key === 'surface' ? surface : ozoneKey;
      const on = cur === items[i][1];
      stroke(on ? '#0d47a1' : '#cfd8dc');
      strokeWeight(on ? 1.6 : 1);
      fill(on ? '#bbdefb' : '#fafafa');
      rect(cx, chipY, cw - 3, chipH, 3);
      noStroke();
      fill(on ? '#0d47a1' : '#546e7a');
      textAlign(CENTER, CENTER);
      textSize(cw > 40 ? 9 : 8);
      text(items[i][0], cx + (cw - 3) / 2, chipY + chipH / 2);
      chipHits.push({ key: spec.key, val: items[i][1], x: cx, y: chipY, w: cw - 3, h: chipH });
    }
  }
}

function drawGauge(box, m, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const cx = box.x + box.w / 2;
  const cy = box.y + box.h * 0.60;
  const r = min(box.w * 0.42, box.h * 0.44);

  // the five standard bands around a 200 degree arc
  const A0 = radians(170), A1 = radians(370);
  function ang(u) { return map(constrain(u, 0, 13), 0, 13, A0, A1); }
  strokeWeight(r * 0.30);
  strokeCap(SQUARE);
  let lo = 0;
  for (let i = 0; i < BANDS.length; i++) {
    const hi = min(BANDS[i].hi, 13);
    stroke(BANDS[i].col);
    noFill();
    arc(cx, cy, r * 1.7, r * 1.7, ang(lo), ang(hi));
    lo = hi;
    if (lo >= 13) break;
  }
  strokeCap(ROUND);

  // the needle
  const a = ang(m.uvi);
  stroke('#212121');
  strokeWeight(3);
  line(cx, cy, cx + cos(a) * r * 0.72, cy + sin(a) * r * 0.72);
  noStroke();
  fill('#212121');
  circle(cx, cy, 8);

  const band = bandOf(m.uvi);
  fill('#546e7a');
  textAlign(CENTER, TOP);
  textSize(10);
  text('UV index', cx, box.y + 6);
  fill(band.col === '#ffeb3b' ? '#f9a825' : band.col);
  textAlign(CENTER, TOP);
  textSize(narrow ? 30 : 36);
  text(nf(m.uvi, 1, 1), cx, cy + r * 0.12);
  textSize(narrow ? 12 : 14);
  text(band.name, cx, cy + r * 0.12 + (narrow ? 30 : 36));

  fill('#455a64');
  textAlign(CENTER, BOTTOM);
  textSize(narrow ? 10 : 11);
  text(m.burn === Infinity ? 'no meaningful burn risk'
        : 'unprotected skin burns in about ' + nf(m.burn, 1, 0) + ' min',
       cx, box.y + box.h - 5);
}

function drawBars(box, m, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(10);
  text('What it looks like, and feels like', box.x + 8, box.y + 6);

  const rows = [
    { name: 'UV index', v: m.uvi / 13, txt: nf(m.uvi, 1, 1), col: bandOf(m.uvi).col },
    { name: 'perceived brightness', v: m.bright / 10, txt: nf(m.bright, 1, 1) + ' / 10',
      col: '#fbc02d' },
    { name: 'perceived warmth', v: constrain((m.temp + 20) / 60, 0, 1),
      txt: nf(m.temp, 1, 1) + ' deg C', col: m.temp < 0 ? '#42a5f5' : '#e53935' }
  ];
  const bh = min(20, (box.h - 44) / 3 - 14);
  for (let i = 0; i < rows.length; i++) {
    const y = box.y + 24 + i * ((box.h - 34) / 3);
    fill('#455a64');
    textAlign(LEFT, TOP);
    textSize(9);
    text(rows[i].name, box.x + 8, y);
    textAlign(RIGHT, TOP);
    fill('#212121');
    textSize(10);
    text(rows[i].txt, box.x + box.w - 8, y);
    noStroke();
    fill('#eceff1');
    rect(box.x + 8, y + 12, box.w - 16, bh, 3);
    fill(rows[i].col === '#ffeb3b' ? '#f9a825' : rows[i].col);
    rect(box.x + 8, y + 12, (box.w - 16) * rows[i].v, bh, 3);
  }
  fill('#78909c');
  textAlign(LEFT, TOP);
  textSize(8);
  text(wrapText('Three separate scales. They need not agree.', box.w - 16, 8),
       box.x + 8, box.y + box.h - 12);
}

function drawBreakdown(box, m, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(10);
  text('Where the number came from', box.x + 8, box.y + 6);

  const zdeg = m.cz > 0 ? degrees(Math.acos(min(1, m.cz))) : 90;
  const items = [
    ['solar zenith ' + nf(zdeg, 1, 0) + ' deg, clear sky at sea level',
     nf(m.base, 1, 1), '#455a64'],
    ['altitude ' + altSlider.value() + ' m', pct(m.fAlt), '#00695c'],
    ['cloud: ' + cloud.toLowerCase(), pct(m.fCloud), '#546e7a'],
    ['ground: ' + surface.toLowerCase(), pct(m.fGround), '#8d6e00'],
    ['ozone: ' + ozoneKey.toLowerCase(), ozoneKey === 'Low' ? '+31%' : 'baseline', '#6a1b9a']
  ];
  let y = box.y + 20;
  const z = narrow ? 9 : 10;
  for (let i = 0; i < items.length; i++) {
    fill(items[i][2]);
    textAlign(LEFT, TOP);
    textSize(z);
    text(items[i][0], box.x + 8, y);
    textAlign(RIGHT, TOP);
    text(items[i][1], box.x + box.w - 8, y);
    y += z + 6;
  }
  y += 2;
  stroke('#eceff1');
  line(box.x + 8, y, box.x + box.w - 8, y);
  noStroke();
  y += 5;
  fill('#212121');
  textAlign(LEFT, TOP);
  textSize(z + 1);
  text('UV index', box.x + 8, y);
  textAlign(RIGHT, TOP);
  textSize(z + 4);
  fill(bandOf(m.uvi).col === '#ffeb3b' ? '#f9a825' : bandOf(m.uvi).col);
  text(nf(m.uvi, 1, 1), box.x + box.w - 8, y - 3);
}

function pct(f) {
  const d = (f - 1) * 100;
  if (abs(d) < 0.5) return 'no change';
  return (d > 0 ? '+' : '') + nf(d, 1, 0) + '%';
}

function drawVerdict(box, m, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  const z = narrow ? 10 : 11;
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(10);
  text('Verdict', box.x + 8, box.y + 6);

  const txt = verdict === ''
    ? 'Pick a scenario below, or build your own from the chips. Watch the three bars as ' +
      'you change the cloud: it takes far more off the brightness than it takes off the UV.'
    : verdict.replace('{UV}', nf(m.uvi, 1, 1));
  fill(verdict === '' ? '#455a64' : '#b71c1c');
  textSize(z);
  text(wrapText(txt, box.w - 16, z), box.x + 8, box.y + 22);
}

function drawControlLabels(m) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  const h = hourNow();
  text('Time:  ' + nf(floor(h), 2) + ':' + nf(round((h % 1) * 60), 2), 10, drawHeight + 22);
  text('Altitude:  ' + altSlider.value() + ' m', 10, drawHeight + 58);
}

// ---- interaction --------------------------------------------------------

function mousePressed() {
  for (let i = 0; i < chipHits.length; i++) {
    const c = chipHits[i];
    if (mouseX > c.x && mouseX < c.x + c.w && mouseY > c.y && mouseY < c.y + c.h) {
      if (c.key === 'lat') latDeg = c.val;
      else if (c.key === 'doy') doy = c.val;
      else if (c.key === 'cloud') cloud = c.val;
      else if (c.key === 'surface') surface = c.val;
      else ozoneKey = c.val;
      verdict = '';
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
