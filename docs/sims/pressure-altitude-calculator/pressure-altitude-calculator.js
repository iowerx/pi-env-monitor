// Pressure and Altitude Calculator MicroSim
// CANVAS_HEIGHT: 620
// Bloom Level: Apply (L3) - the learner solves for sea level pressure, converts
// between the common units, and decides whether a difference between two stations
// is weather or geography.
// The correction is shown as a visible adjustment on a column rather than as a
// formula result, because the point is how LARGE it is. Denver's correction is
// nearly 200 hPa, which is five times the entire span of ordinary weather.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 200;

const NARROW_BREAKPOINT = 740;
const M_PER_HPA = 8.3;            // the linear rule this chapter teaches
const ALT_HI = 3000;

// ---- controls ----
let singleButton, twoButton, altimeterButton, exactButton, abButton;
let elevSlider, weatherSlider;

// ---- state ----
let mode = 'single';              // 'single' | 'two' | 'altimeter'
let exact = false;
let which = 'A';                  // which station the sliders drive in two-station mode
let elevA = 152, elevB = 452;
let slA = 1013, slB = 1021;   // each station gets its own weather
let pilotSetting = 1013;          // hPa dialled into the altimeter
let colRect = { x: 0, y: 0, w: 1, h: 1 };
let dragging = false;
let presetHits = [];

const PRESETS = [
  { name: 'Death Valley', m: -86 },
  { name: 'Coastal town', m: 5 },
  { name: 'Denver', m: 1609 },
  { name: 'Mexico City', m: 2240 }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  singleButton = createButton('Single');
  singleButton.mousePressed(function () { mode = 'single'; });
  twoButton = createButton('Two stations');
  twoButton.mousePressed(function () { mode = 'two'; });
  altimeterButton = createButton('Altimeter');
  altimeterButton.mousePressed(function () { mode = 'altimeter'; });
  abButton = createButton('Editing A');
  abButton.mousePressed(function () {
    which = which === 'A' ? 'B' : 'A';
    abButton.html('Editing ' + which);
    elevSlider.value(which === 'A' ? elevA : elevB);
    weatherSlider.value(which === 'A' ? slA : slB);
  });
  exactButton = createButton('Linear');
  exactButton.mousePressed(function () {
    exact = !exact;
    exactButton.html(exact ? 'Exact' : 'Linear');
  });

  elevSlider = createSlider(-100, ALT_HI, elevA, 1);
  weatherSlider = createSlider(950, 1050, 1013, 1);

  layoutControls();

  describe('A vertical altitude column with a draggable station marker beside a pressure ' +
           'scale. The panel works the sea level correction through step by step and ' +
           'shows the answer in hectopascals, millibars, inches of mercury, pascals and ' +
           'atmospheres at once. A two-station mode separates a pressure difference into ' +
           'the part caused by elevation and the part that is genuine weather, and an ' +
           'altimeter mode shows an aircraft flying from high pressure into low with the ' +
           'wrong setting dialled in.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 80;
  singleButton.position(10, r1);
  twoButton.position(72, r1);
  altimeterButton.position(170, r1);
  abButton.position(252, r1);
  exactButton.position(348, r1);
  elevSlider.position(sliderLeftMargin, r2 + 4);
  elevSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  weatherSlider.position(sliderLeftMargin, r3 + 4);
  weatherSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
}

// ---- the arithmetic -----------------------------------------------------

function seaLevel() { return mode === 'two' && which === 'B' ? slB : slA; }

// what a barometer actually reads at that elevation, given a true sea level value
function stationReading(m, sl) {
  const p0 = sl === undefined ? slA : sl;
  if (exact) return p0 * Math.pow(1 - 0.0065 * m / 288.15, 5.255);
  return p0 - m / M_PER_HPA;
}

// the correction depends only on the elevation, which is the whole point of it
function correction(m) {
  if (exact) return slA - slA * Math.pow(1 - 0.0065 * m / 288.15, 5.255);
  return m / M_PER_HPA;
}

function units(hpa) {
  return [['hPa', nf(hpa, 1, 2)],
          ['mbar', nf(hpa, 1, 2)],
          ['inHg', nf(hpa / 33.86389, 1, 3)],
          ['Pa', nf(hpa * 100, 1, 0)],
          ['atm', nf(hpa / 1013.25, 1, 5)]];
}

function verdict(hpa) {
  if (hpa < 980) return { t: 'Below the normal 980 to 1040 band. Deep low - this is storm territory.', c: '#b71c1c' };
  if (hpa > 1040) return { t: 'Above the normal 980 to 1040 band. A very strong high.', c: '#0d47a1' };
  return { t: nf(hpa, 1, 1) + ' hPa is within the normal 980 to 1040 hPa band. Ordinary conditions.',
           c: '#1b5e20' };
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;

  // keep the slider pointed at whichever station is being edited
  if (mode === 'two') {
    if (which === 'A') { elevA = elevSlider.value(); slA = weatherSlider.value(); }
    else { elevB = elevSlider.value(); slB = weatherSlider.value(); }
  } else {
    elevA = elevSlider.value();
    slA = weatherSlider.value();
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
  text('Pressure, Altitude and the Correction', canvasWidth / 2, narrow ? 6 : 4);

  let colB, workB, unitB;
  if (narrow) {
    colB = { x: margin, y: 30, w: 116, h: drawHeight - 150 };
    workB = { x: margin + 124, y: 30, w: canvasWidth - margin - (margin + 124),
              h: drawHeight - 150 };
    unitB = { x: margin, y: drawHeight - 114, w: canvasWidth - 2 * margin, h: 104 };
  } else {
    colB = { x: margin, y: 38, w: 150, h: drawHeight - 52 };
    const uw = 208;
    workB = { x: margin + 158, y: 38,
              w: canvasWidth - margin - uw - 8 - (margin + 158), h: drawHeight - 52 };
    unitB = { x: canvasWidth - margin - uw, y: 38, w: uw, h: drawHeight - 52 };
  }

  drawColumn(colB, narrow);
  drawWork(workB, narrow);
  drawUnits(unitB, narrow);
  drawControlLabels();

  abButton.style('display', mode === 'two' ? 'block' : 'none');
  exactButton.style('display', mode === 'altimeter' ? 'none' : 'block');
  [singleButton, twoButton, altimeterButton].forEach(function (b, i) {
    const active = ['single', 'two', 'altimeter'][i] === mode;
    b.style('background', active ? '#1565c0' : '#f5f5f5');
    b.style('color', active ? '#ffffff' : '#37474f');
  });
}

function ay(box, m) { return map(m, -100, ALT_HI, box.y + box.h - 40, box.y + 30); }

function drawColumn(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Elevation', box.x + 8, box.y + 6);

  colRect = box;
  const cx = box.x + 42;

  // the air column, thinning with height
  for (let y = ay(box, ALT_HI); y <= ay(box, -100); y++) {
    const m = map(y, ay(box, -100), ay(box, ALT_HI), -100, ALT_HI);
    stroke(lerpColor(color('#90caf9'), color('#e3f2fd'), constrain(m / ALT_HI, 0, 1)));
    line(box.x + 6, y, box.x + box.w - 6, y);
  }
  noStroke();
  fill('#7cb342');
  const groundBot = box.y + box.h - 48;
  if (groundBot > ay(box, 0)) rect(box.x + 6, ay(box, 0), box.w - 12, groundBot - ay(box, 0));

  // gridlines with both scales
  for (let m = 0; m <= ALT_HI; m += 1000) {
    const y = ay(box, m);
    stroke('rgba(69,90,100,0.22)');
    strokeWeight(1);
    line(box.x + 6, y, box.x + box.w - 6, y);
    noStroke();
    fill('#546e7a');
    textAlign(LEFT, BOTTOM);
    textSize(8);
    text(m + ' m', box.x + 8, y - 1);
    textAlign(RIGHT, BOTTOM);
    text(nf(stationReading(m), 1, 0) + ' hPa', box.x + box.w - 6, y - 1);
  }

  drawStationMark(box, elevA, '#c62828', mode === 'two' ? 'A' : 'station');
  if (mode === 'two') drawStationMark(box, elevB, '#6a1b9a', 'B');

  // presets, clickable
  presetHits = [];
  const py = box.y + box.h - 34;
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(8);
  text('jump to:', box.x + 8, py - 10);
  for (let i = 0; i < PRESETS.length; i++) {
    const bx = box.x + 6 + (i % 2) * (box.w - 12) / 2;
    const by = py + floor(i / 2) * 14;
    presetHits.push({ i: i, x: bx, y: by, w: (box.w - 12) / 2 - 2, h: 13 });
    fill('#eceff1');
    rect(bx, by, (box.w - 12) / 2 - 2, 13, 2);
    fill('#37474f');
    textAlign(LEFT, CENTER);
    textSize(8);
    text(PRESETS[i].name, bx + 3, by + 7);
  }
}

function drawStationMark(box, m, col, tag) {
  const y = ay(box, m);
  const cx = box.x + 42;
  stroke(col);
  strokeWeight(2);
  line(box.x + 6, y, box.x + box.w - 6, y);
  noStroke();
  fill(col);
  triangle(box.x + 4, y, box.x + 17, y - 6, box.x + 17, y + 6);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(8);
  text(tag === 'station' ? 'S' : tag, box.x + 11, y);
}

function drawWork(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();
  const inner = box.w - 20;
  const z = narrow ? 11 : 12;
  let y = box.y + 8;

  if (mode === 'altimeter') { drawAltimeter(box, narrow); return; }

  if (mode === 'two') {
    const rA = stationReading(elevA, slA), rB = stationReading(elevB, slB);
    const cA = correction(elevA), cB = correction(elevB);
    const sA = rA + cA, sB = rB + cB;
    const rawDiff = rB - rA;
    const elevPart = cA - cB;                 // what elevation alone explains
    const weatherPart = sB - sA;

    fill('#546e7a');
    textAlign(LEFT, TOP);
    textSize(11);
    text('Two stations, one question', box.x + 10, y);
    y += 18;
    fill('#c62828');
    textSize(z + 1);
    text('A: ' + nf(rA, 1, 1) + ' hPa raw at ' + elevA + ' m', box.x + 10, y);
    y += 16;
    fill('#6a1b9a');
    text('B: ' + nf(rB, 1, 1) + ' hPa raw at ' + elevB + ' m', box.x + 10, y);
    y += 15;
    fill('#78909c');
    textSize(z - 1);
    text('Switch the Editing button to give each station its own elevation and weather.',
         box.x + 10, y);
    y += 22;

    fill('#212121');
    textSize(z);
    text('Raw difference: B is ' + nf(abs(rawDiff), 1, 1) + ' hPa ' +
         (rawDiff < 0 ? 'lower' : 'higher') + ' than A.', box.x + 10, y);
    y += 16;
    text('Elevation accounts for ' + nf(abs(elevPart), 1, 1) + ' hPa of that.', box.x + 10, y);
    y += 22;

    fill('#546e7a');
    textSize(11);
    text('After correcting both to sea level', box.x + 10, y);
    y += 16;
    fill('#c62828');
    textSize(z);
    text('A: ' + nf(sA, 1, 1) + ' hPa', box.x + 10, y);
    fill('#6a1b9a');
    textAlign(RIGHT, TOP);
    text('B: ' + nf(sB, 1, 1) + ' hPa', box.x + box.w - 10, y);
    textAlign(LEFT, TOP);
    y += 22;

    const same = abs(weatherPart) < 0.5;
    fill(same ? '#1b5e20' : '#e65100');
    textSize(narrow ? 13 : 15);
    const v = same
      ? 'Once corrected, the two stations agree. The whole difference was geography.'
      : 'After correction, station B is actually ' + nf(abs(weatherPart), 1, 1) +
        ' hPa ' + (weatherPart > 0 ? 'HIGHER' : 'LOWER') + ' than station A.' +
        ((rawDiff < 0) !== (weatherPart < 0)
          ? ' The apparent difference pointed the wrong way entirely.' : '');
    text(wrapText(v, inner, narrow ? 13 : 15), box.x + 10, y);
    return;
  }

  // single station
  const raw = stationReading(elevA);
  const corr = correction(elevA);
  const sea = raw + corr;

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Correcting one station to sea level', box.x + 10, y);
  y += 18;

  fill('#212121');
  textSize(z + 2);
  text(nf(raw, 1, 1) + ' hPa measured at ' + elevA + ' m', box.x + 10, y);
  y += 22;
  fill('#546e7a');
  textSize(z);
  text(exact ? 'correction, full barometric formula' : 'correction: ' + elevA + ' / 8.3',
       box.x + 10, y);
  y += 16;
  fill('#0d47a1');
  textSize(z + 2);
  text('= ' + nf(corr, 1, 1) + ' hPa', box.x + 10, y);
  y += 22;
  fill('#212121');
  textSize(narrow ? 15 : 18);
  text(nf(raw, 1, 1) + '  +  ' + nf(corr, 1, 1) + '  =  ' + nf(sea, 1, 1) + ' hPa',
       box.x + 10, y);
  y += narrow ? 24 : 28;

  const vd = verdict(sea);
  fill(vd.c);
  textSize(z);
  text(wrapText(vd.t, inner, z), box.x + 10, y);
  y += wrapText(vd.t, inner, z).split('\n').length * (z + 3) + 8;

  // the linear rule against the exact one
  const lin = elevA / M_PER_HPA;
  const ex = seaLevel() - seaLevel() * Math.pow(1 - 0.0065 * elevA / 288.15, 5.255);
  fill('#78909c');
  textSize(z - 1);
  text(wrapText('Linear rule ' + nf(lin, 1, 1) + ' hPa, full formula ' + nf(ex, 1, 1) +
                ' hPa. They differ by ' + nf(abs(lin - ex), 1, 1) +
                ' hPa here - small near sea level, and worth having at altitude.',
                inner, z - 1), box.x + 10, y);
}

function drawAltimeter(box, narrow) {
  const inner = box.w - 20;
  const z = narrow ? 11 : 12;
  let y = box.y + 8;
  const trueAlt = elevA;
  const actualQNH = seaLevel();
  // the instrument believes the sea level pressure is whatever is dialled in
  const indicated = trueAlt + (pilotSetting - actualQNH) * M_PER_HPA;

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Altimeter, and the setting you forgot to change', box.x + 10, y);
  y += 18;
  fill('#212121');
  textSize(z);
  const setLine = wrapText('Setting dialled in: ' + pilotSetting + ' hPa. Real sea level ' +
                           'pressure here: ' + actualQNH + ' hPa. Drag the sea level ' +
                           'slider to fly somewhere else.', inner, z);
  text(setLine, box.x + 10, y);
  y += setLine.split('\n').length * (z + 3) - 16;
  y += 24;

  fill('#546e7a');
  textSize(11);
  text('Indicated altitude', box.x + 10, y);
  fill('#546e7a');
  textAlign(RIGHT, TOP);
  text('True altitude', box.x + box.w - 10, y);
  y += 16;
  fill('#0d47a1');
  textAlign(LEFT, TOP);
  textSize(narrow ? 18 : 22);
  text(nf(indicated, 1, 0) + ' m', box.x + 10, y);
  fill('#c62828');
  textAlign(RIGHT, TOP);
  text(nf(trueAlt, 1, 0) + ' m', box.x + box.w - 10, y);
  y += narrow ? 28 : 32;
  textAlign(LEFT, TOP);

  const gap = indicated - trueAlt;
  if (gap > 5) {
    fill('#b71c1c');
    textSize(narrow ? 14 : 16);
    text(wrapText('You are ' + nf(gap, 1, 0) + ' m LOWER than the instrument says.',
                  inner, narrow ? 14 : 16), box.x + 10, y);
    y += 24;
    fill('#b71c1c');
    textSize(z);
    text(wrapText('High to low, look out below. You set the altimeter in a high-pressure ' +
                  'region and flew into a low one without resetting it. The instrument is ' +
                  'still measuring pressure; it is the assumption underneath that went ' +
                  'stale.', inner, z), box.x + 10, y);
  } else if (gap < -5) {
    fill('#0d47a1');
    textSize(narrow ? 14 : 16);
    text(wrapText('You are ' + nf(-gap, 1, 0) + ' m HIGHER than the instrument says.',
                  inner, narrow ? 14 : 16), box.x + 10, y);
    y += 24;
    fill('#455a64');
    textSize(z);
    text(wrapText('Flying from low pressure into high. Safer than the other way round, ' +
                  'and still wrong.', inner, z), box.x + 10, y);
  } else {
    fill('#1b5e20');
    textSize(narrow ? 14 : 16);
    text('Setting matches. Indicated and true altitude agree.', box.x + 10, y);
    y += 24;
    fill('#455a64');
    textSize(z);
    text(wrapText('Now drag the sea level slider down, as though you were flying into a ' +
                  'low-pressure region, and watch what the instrument keeps telling you.',
                  inner, z), box.x + 10, y);
  }
}

function drawUnits(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const raw = stationReading(elevA);
  const sea = raw + correction(elevA);
  let y = box.y + 8;
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Sea level pressure, five ways', box.x + 10, y);
  y += 18;

  const u = units(sea);
  const twoCol = narrow;
  const colW = twoCol ? (box.w - 20) / 3 : box.w - 20;
  for (let i = 0; i < u.length; i++) {
    const cxx = twoCol ? box.x + 10 + (i % 3) * colW : box.x + 10;
    const cyy = twoCol ? y + floor(i / 3) * 38 : y + i * 30;
    fill('#78909c');
    textAlign(LEFT, TOP);
    textSize(10);
    text(u[i][0], cxx, cyy);
    fill('#212121');
    textSize(twoCol ? 14 : 17);
    text(u[i][1], cxx, cyy + 12);
  }
  y += twoCol ? 80 : 5 * 30 + 8;

  if (box.y + box.h - y > 40) {
    fill('#78909c');
    textSize(10);
    text(wrapText('hPa and mbar are the same size, exactly. Aviation uses inHg in the ' +
                  'United States and hPa nearly everywhere else, which is a units problem ' +
                  'waiting to happen.', box.w - 20, 10), box.x + 10, y);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  const label = mode === 'two' ? ('Elev ' + which + ':  ' + elevSlider.value() + ' m')
                               : ('Elevation:  ' + elevA + ' m');
  text(label, 10, drawHeight + 58);
  const slLabel = mode === 'altimeter' ? 'Real sea level:  '
                : (mode === 'two' ? ('Weather ' + which + ':  ') : 'Sea level:  ');
  text(slLabel + weatherSlider.value() + ' hPa', 10, drawHeight + 94);
}

// ---- interaction --------------------------------------------------------

function mousePressed() {
  for (let i = 0; i < presetHits.length; i++) {
    const h = presetHits[i];
    if (mouseX > h.x && mouseX < h.x + h.w && mouseY > h.y && mouseY < h.y + h.h) {
      elevSlider.value(PRESETS[h.i].m);
      return;
    }
  }
  if (mouseX > colRect.x && mouseX < colRect.x + colRect.w &&
      mouseY > colRect.y + 20 && mouseY < colRect.y + colRect.h - 44) {
    dragging = true;
    setElevFromMouse();
  }
}
function mouseDragged() { if (dragging) setElevFromMouse(); }
function mouseReleased() { dragging = false; }

function setElevFromMouse() {
  const m = round(map(mouseY, ay(colRect, -100), ay(colRect, ALT_HI), -100, ALT_HI));
  elevSlider.value(constrain(m, -100, ALT_HI));
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
