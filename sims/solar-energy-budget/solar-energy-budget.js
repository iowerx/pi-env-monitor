// Solar Constant to Ground - Where the Energy Goes MicroSim
// CANVAS_HEIGHT: 630
// Bloom Level: Analyze (L4) - the learner attributes the gap between 1361 W/m2 at
// the top of the atmosphere and whatever their station reads to named, quantified
// causes.
// The interface IS the decomposition: the beam narrows once per loss, each loss
// branches off as its own labelled arrow, and the running total is printed beside
// it. Students who measure 700 W/m2 and conclude the sensor is broken need to see
// the accounting, not be told the number is fine.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 230;

const NARROW_BREAKPOINT = 760;
const SOLAR_CONSTANT = 1361;

// Every coefficient the budget uses, in one place, so the accounting is auditable.
const K_ABSORB = 0.11;            // ozone, water vapour, CO2, per air mass
const K_SCATTER = 0.19;           // Rayleigh and aerosol, per air mass

const CLOUD_TYPES = {
  'Thin cirrus':     0.75,
  'Broken cumulus':  0.45,
  'Thick overcast':  0.20
};
const SURFACES = {
  'Fresh snow': 0.85, 'Sand': 0.40, 'Grass': 0.25,
  'Forest': 0.15, 'Asphalt': 0.10, 'Water, low sun': 0.60
};

// ---- controls ----
let zenithSlider, cloudSlider, cloudSelect, surfaceSelect, matchInput, matchButton;

// ---- state ----
let matchMsg = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  zenithSlider = createSlider(0, 89, 30, 1);
  cloudSlider = createSlider(0, 100, 0, 1);

  cloudSelect = createSelect();
  Object.keys(CLOUD_TYPES).forEach(function (k) { cloudSelect.option(k); });
  cloudSelect.selected('Broken cumulus');

  surfaceSelect = createSelect();
  Object.keys(SURFACES).forEach(function (k) { surfaceSelect.option(k); });
  surfaceSelect.selected('Grass');

  matchInput = createInput('700');
  matchInput.size(48);
  matchButton = createButton('Match reading');
  matchButton.mousePressed(matchStation);

  layoutControls();

  describe('A vertical cross-section from the top of the atmosphere to the ground. An ' +
           'incoming beam whose width is its power narrows once at each loss - the ' +
           'cosine of the solar zenith angle, absorption by ozone and water vapour, ' +
           'scattering, then cloud - with each loss branching off as a labelled arrow ' +
           'and a running total in watts per square metre printed beside it. At the ' +
           'ground the remaining energy splits into the part the surface reflects and ' +
           'the part it absorbs.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 82;
  zenithSlider.position(sliderLeftMargin, r1 + 4);
  zenithSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  cloudSlider.position(sliderLeftMargin, r2 + 4);
  cloudSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  cloudSelect.position(10, r3);
  cloudSelect.size(124);
  surfaceSelect.position(140, r3);
  surfaceSelect.size(108);
  matchInput.position(254, r3);
  matchButton.position(310, r3);
}

// ---- the budget ---------------------------------------------------------

function zenith() { return zenithSlider.value(); }

// Kasten and Young (1989): how many atmospheres of path the beam crosses
function airMass(zdeg) {
  const z = radians(zdeg);
  return 1 / (Math.cos(z) + 0.50572 * Math.pow(96.07995 - zdeg, -1.6364));
}

function cloudTransmit() {
  const cover = cloudSlider.value() / 100;
  return 1 - cover * (1 - CLOUD_TYPES[cloudSelect.value()]);
}

function budget() {
  const z = zenith();
  const cosz = Math.cos(radians(z));
  const m = airMass(z);
  const toa = SOLAR_CONSTANT;
  const afterCos = toa * cosz;
  const tAbs = Math.exp(-K_ABSORB * m);
  const afterAbs = afterCos * tAbs;
  const tSca = Math.exp(-K_SCATTER * m);
  const afterSca = afterAbs * tSca;
  const tCld = cloudTransmit();
  const ground = afterSca * tCld;
  const alb = SURFACES[surfaceSelect.value()];
  return {
    z: z, cosz: cosz, m: m, toa: toa,
    afterCos: afterCos, lossCos: toa - afterCos,
    afterAbs: afterAbs, lossAbs: afterCos - afterAbs,
    afterSca: afterSca, lossSca: afterAbs - afterSca,
    ground: ground, lossCld: afterSca - ground,
    albedo: alb, reflected: ground * alb, absorbed: ground * (1 - alb)
  };
}

// Solve for the cloud cover that would explain a measured irradiance at the
// current angle. If no amount of cloud can do it, say which way to move the angle.
function matchStation() {
  const target = parseFloat(matchInput.value());
  if (isNaN(target) || target < 0) { matchMsg = 'Type a number of watts per square metre.'; return; }
  const b = budget();
  const clear = b.afterSca;
  if (target > clear + 1) {
    const needCos = target / (SOLAR_CONSTANT * Math.exp(-(K_ABSORB + K_SCATTER) * airMass(zenith())));
    if (needCos > 1) {
      matchMsg = nf(target, 1, 0) + ' W/m2 is more than a clear sky can deliver anywhere. ' +
                 'Check the sensor, or check that it is not seeing a reflection.';
    } else {
      matchMsg = 'No amount of cloud explains ' + nf(target, 1, 0) + ' W/m2 at ' + b.z +
                 ' degrees - a clear sky here gives only ' + nf(clear, 1, 0) +
                 '. The Sun must have been higher: try about ' +
                 nf(degrees(Math.acos(constrain(needCos, 0, 1))), 1, 0) + ' degrees.';
    }
    return;
  }
  const tNeeded = target / clear;
  const tType = CLOUD_TYPES[cloudSelect.value()];
  const cover = (1 - tNeeded) / (1 - tType);
  if (cover > 1) {
    matchMsg = 'Even solid ' + cloudSelect.value().toLowerCase() + ' does not cut it that far. ' +
               'Try a thicker cloud type, or a lower Sun.';
    return;
  }
  cloudSlider.value(round(constrain(cover, 0, 1) * 100));
  matchMsg = nf(target, 1, 0) + ' W/m2 at a ' + b.z + ' degree zenith angle is explained by ' +
             round(constrain(cover, 0, 1) * 100) + ' per cent ' + cloudSelect.value().toLowerCase() +
             '. Nothing is wrong with your sensor.';
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;
  const b = budget();

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
  text('From 1361 W/m2 to Whatever Your Station Reads', canvasWidth / 2, narrow ? 6 : 4);

  let sceneB, tableB;
  if (narrow) {
    const w = canvasWidth - 2 * margin;
    sceneB = { x: margin, y: 30, w: w, h: 206 };
    tableB = { x: margin, y: 244, w: w, h: drawHeight - 256 };
  } else {
    const tw = 296;
    sceneB = { x: margin, y: 36, w: canvasWidth - margin - tw - 8 - margin, h: drawHeight - 50 };
    tableB = { x: canvasWidth - margin - tw, y: 36, w: tw, h: drawHeight - 50 };
  }

  drawScene(sceneB, b, narrow);
  drawTable(tableB, b, narrow);
  drawControlLabels(b);
}

function drawScene(box, b, narrow) {
  noStroke();
  // sky, darkening with height
  for (let y = box.y; y < box.y + box.h - 26; y++) {
    const f = (y - box.y) / (box.h - 26);
    stroke(lerpColor(color('#0d1b3e'), color('#8ec9f0'), f));
    line(box.x, y, box.x + box.w, y);
  }
  noStroke();
  fill('#7cb342');
  rect(box.x, box.y + box.h - 26, box.w, 26);

  const topY = box.y + 16;
  const groundY = box.y + box.h - 26;
  // four loss stages spread down the column
  const stops = [0.00, 0.22, 0.44, 0.66, 1.00];
  const ys = stops.map(function (s) { return topY + s * (groundY - topY); });

  const maxW = min(box.w * 0.30, 76);
  function wOf(p) { return max(2, maxW * p / SOLAR_CONSTANT); }
  const cx = box.x + box.w * 0.40;

  const vals = [b.toa, b.afterCos, b.afterAbs, b.afterSca, b.ground];
  const losses = [
    { label: 'spread over more ground', detail: 'cos ' + b.z + ' = ' + nf(b.cosz, 1, 3),
      amt: b.lossCos, col: '#ffb300' },
    { label: 'absorbed', detail: 'ozone, water vapour, CO2', amt: b.lossAbs, col: '#8e24aa' },
    { label: 'scattered', detail: 'this is why the sky is blue', amt: b.lossSca, col: '#1e88e5' },
    { label: 'blocked by cloud', detail: cloudSlider.value() + '% ' + cloudSelect.value().toLowerCase(),
      amt: b.lossCld, col: '#78909c' }
  ];

  // the beam, narrowing at each stage
  noStroke();
  for (let i = 0; i < 4; i++) {
    fill(255, 241, 118, 210);
    quad(cx - wOf(vals[i]) / 2, ys[i], cx + wOf(vals[i]) / 2, ys[i],
         cx + wOf(vals[i + 1]) / 2, ys[i + 1], cx - wOf(vals[i + 1]) / 2, ys[i + 1]);
  }

  // loss arrows branching off to the right
  for (let i = 0; i < 4; i++) {
    if (losses[i].amt < 0.5) continue;
    const y = ys[i + 1];
    const len = min(box.w * 0.36, 12 + losses[i].amt / SOLAR_CONSTANT * box.w * 0.9);
    stroke(losses[i].col);
    strokeWeight(max(1.5, min(7, losses[i].amt / 120)));
    line(cx + wOf(vals[i + 1]) / 2, y, cx + wOf(vals[i + 1]) / 2 + len, y - 8);
    noStroke();
    fill(losses[i].col);
    textSize(narrow ? 8 : 9);
    const lbl = nf(losses[i].amt, 1, 0) + ' W/m2  ' + losses[i].label;
    const lx = cx + wOf(vals[i + 1]) / 2 + len + 3;
    if (lx + textWidth(lbl) > box.x + box.w - 4) {
      textAlign(RIGHT, CENTER);
      text(lbl, box.x + box.w - 4, y - 9);
    } else {
      textAlign(LEFT, CENTER);
      text(lbl, lx, y - 9);
    }
  }

  // stage labels down the left
  const names = ['top of atmosphere', 'after the angle', 'after absorption',
                 'after scattering', 'at the ground'];
  for (let i = 0; i < 5; i++) {
    stroke('rgba(255,255,255,0.35)');
    strokeWeight(1);
    line(box.x + 4, ys[i], cx - wOf(vals[i]) / 2 - 3, ys[i]);
    noStroke();
    fill('white');
    textAlign(LEFT, BOTTOM);
    textSize(narrow ? 8 : 9);
    text(names[i], box.x + 5, ys[i] - (i === 4 ? 24 : 2));
    fill('#fff59d');
    if (i === 4) {
      textAlign(LEFT, BOTTOM);
      textSize(narrow ? 9 : 11);
      text(nf(vals[i], 1, 0), box.x + 5, ys[i] - 12);
    } else {
      textAlign(LEFT, TOP);
      textSize(narrow ? 9 : 11);
      text(nf(vals[i], 1, 0), box.x + 5, ys[i] + 1);
    }
  }

  // the ground split
  const refl = b.reflected;
  stroke('#00acc1');
  strokeWeight(max(1.5, min(6, refl / 60)));
  line(cx, groundY, cx - 44, groundY - 34);
  noStroke();
  fill('#00acc1');
  textAlign(RIGHT, CENTER);
  textSize(narrow ? 8 : 9);
  text(nf(refl, 1, 0) + ' reflected', cx - 47, groundY - 36);
  fill('#33691e');
  textAlign(LEFT, TOP);
  text(nf(b.absorbed, 1, 0) + ' W/m2 absorbed by the ' + surfaceSelect.value().toLowerCase(),
       box.x + 5, groundY + 6);
  fill('#dcedc8');
  textAlign(RIGHT, TOP);
  text('albedo ' + nf(b.albedo, 1, 2), box.x + box.w - 5, groundY + 6);

  // the required teaching moment, at sixty degrees
  if (abs(b.z - 60) < 0.6) {
    noStroke();
    fill('rgba(255,255,255,0.92)');
    rect(box.x + 6, box.y + box.h - 90, box.w - 12, 40, 4);
    fill('#b71c1c');
    textAlign(LEFT, TOP);
    textSize(narrow ? 8 : 9);
    text(wrapText('cos(60 degrees) = 0.5. The same beam is spread over twice the ground ' +
                  'area. This is why winter is cold and why sunrise is dim - not distance ' +
                  'from the Sun.', box.w - 22, narrow ? 8 : 9), box.x + 11, box.y + box.h - 86);
  }
}

function drawTable(box, b, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  const z = narrow ? 10 : 11;
  let y = box.y + 8;

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('The energy budget', box.x + 10, y);
  textAlign(RIGHT, TOP);
  text('air mass ' + nf(b.m, 1, 2), box.x + box.w - 10, y);
  y += 18;

  const rows = [
    ['Top of atmosphere, perpendicular', b.toa, '#212121', ''],
    ['x cos(' + b.z + ' deg) = ' + nf(b.cosz, 1, 3), b.afterCos, '#ff8f00',
     '-' + nf(b.lossCos, 1, 0)],
    ['after absorption by ozone, water vapour, CO2', b.afterAbs, '#8e24aa',
     '-' + nf(b.lossAbs, 1, 0)],
    ['after scattering', b.afterSca, '#1e88e5', '-' + nf(b.lossSca, 1, 0)],
    ['after ' + cloudSlider.value() + ' per cent ' + cloudSelect.value().toLowerCase(),
     b.ground, '#607d8b', '-' + nf(b.lossCld, 1, 0)]
  ];
  for (let i = 0; i < rows.length; i++) {
    fill('#455a64');
    textAlign(LEFT, TOP);
    textSize(z);
    text(wrapText(rows[i][0], box.w - 108, z), box.x + 10, y);
    fill(rows[i][2]);
    textAlign(RIGHT, TOP);
    textSize(z + 3);
    text(nf(rows[i][1], 1, 0), box.x + box.w - 54, y - 1);
    fill('#90a4ae');
    textSize(z - 1);
    text(rows[i][3], box.x + box.w - 10, y + 1);
    y += max(20, wrapText(rows[i][0], box.w - 108, z).split('\n').length * (z + 2) + 6);
  }

  y += 2;
  stroke('#eceff1');
  line(box.x + 8, y, box.x + box.w - 8, y);
  noStroke();
  y += 6;

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('At the ground', box.x + 10, y);
  y += 16;
  fill('#33691e');
  textAlign(LEFT, TOP);
  textSize(z);
  text('arriving', box.x + 10, y);
  textAlign(RIGHT, TOP);
  textSize(narrow ? 16 : 19);
  text(nf(b.ground, 1, 0) + ' W/m2', box.x + box.w - 10, y - 3);
  y += 22;
  fill('#00838f');
  textAlign(LEFT, TOP);
  textSize(z);
  text('reflected, albedo ' + nf(b.albedo, 1, 2), box.x + 10, y);
  textAlign(RIGHT, TOP);
  text(nf(b.reflected, 1, 0), box.x + box.w - 10, y);
  y += 16;
  fill('#33691e');
  textAlign(LEFT, TOP);
  text('absorbed by the surface', box.x + 10, y);
  textAlign(RIGHT, TOP);
  text(nf(b.absorbed, 1, 0), box.x + box.w - 10, y);
  y += 22;

  // one trailing block, or the panel outgrows its box on a narrow canvas
  const kept = b.ground / b.toa * 100;
  textAlign(LEFT, TOP);
  textSize(z);
  if (matchMsg !== '') {
    fill('#00695c');
    text(wrapText(matchMsg, box.w - 20, z), box.x + 10, y);
  } else {
    fill('#455a64');
    text(wrapText(nf(kept, 1, 0) + ' per cent of what arrived at the top of the atmosphere ' +
                  'reached the ground. Every watt of the rest is accounted for above.',
                  box.w - 20, z), box.x + 10, y);
  }
}

function drawControlLabels(b) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Zenith angle:  ' + b.z + ' deg', 10, drawHeight + 22);
  text('Cloud cover:  ' + cloudSlider.value() + ' %', 10, drawHeight + 58);
  fill('#546e7a');
  textSize(10);
  // the same angle, expressed two ways a learner can actually picture
  const eqHour = 12 - b.z / 15;
  text('= about ' + nf(floor(eqHour), 2) + ':' + nf(round((eqHour % 1) * 60), 2) +
       ' at the equator on an equinox, or noon at ' + b.z + ' deg latitude',
       10, drawHeight + 38);
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
