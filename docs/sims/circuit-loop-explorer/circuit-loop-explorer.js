// Circuit Loop and the Missing Ground MicroSim
// CANVAS_HEIGHT: 500
// Bloom Level: Understand (L2) - the learner explains why a circuit must form a
// complete loop, and predicts what a sensor does when only the ground wire is
// disconnected.
// The moving charge dots are the one animated element and they are a state
// indicator, not decoration: they stop the instant the loop opens, which is the
// whole point being made.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 404;
let controlHeight = 96;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 660;

// ---- controls ----
let powerCheckbox;
let groundCheckbox;
let looseCheckbox;
let supplySelect;

// ---- state ----
let dotPhase = 0;            // 0..1 position of the charge dots around the loop
let looseContact = true;     // when the ground is loose, this flickers
let looseTimer = 0;

const SENSOR_CURRENT_MA = 0.9;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  powerCheckbox = createCheckbox(' Power wire connected', true);
  groundCheckbox = createCheckbox(' Ground wire connected', true);
  looseCheckbox = createCheckbox(' Ground wire is loose', false);

  supplySelect = createSelect();
  supplySelect.option('3.3 V');
  supplySelect.option('5 V');
  supplySelect.selected('3.3 V');

  layoutControls();

  describe('A schematic loop from a 3.3 volt pin, through a sensor, back to a ground ' +
           'pin. Three switches open and close each wire connection and a selector ' +
           'changes the supply voltage. Charge dots circulate only while the loop is ' +
           'complete and stop dead the moment either wire is opened, and the readout ' +
           'panel reports voltage, current and a plain-language sensor status for ' +
           'every state including overvoltage.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 10;
  const r2 = drawHeight + 46;
  powerCheckbox.position(10, r1);
  groundCheckbox.position(210, r1);
  looseCheckbox.position(10, r2);
  supplySelect.position(250, r2);
}

// ---- circuit state, derived rather than simulated -----------------------

function circuitState() {
  const powerOn = powerCheckbox.checked();
  const groundOn = groundCheckbox.checked();
  const loose = looseCheckbox.checked() && groundOn;
  const overvolt = supplySelect.value() === '5 V';
  const supply = overvolt ? 5.0 : 3.3;

  // A loose ground makes and breaks contact on its own. Everything downstream
  // reads from `looseContact`, so the readouts flicker exactly like the wire.
  const groundMakingContact = loose ? looseContact : groundOn;
  const complete = powerOn && groundMakingContact;

  let breakAt = null;             // 'power' | 'ground' | null
  if (!powerOn) breakAt = 'power';
  else if (!groundMakingContact) breakAt = 'ground';

  let status, statusColor, sensorColor, voltage, current;

  if (overvolt) {
    sensorColor = '#c62828';
    statusColor = '#b71c1c';
    voltage = complete ? '5.0 V' : 'undefined';
    current = complete ? '(too much)' : '0 mA';
    status = 'OVERVOLTAGE. A 3.3 V part on a 5 V supply is how sensors die. ' +
             'Nothing in this book connects 5 V to a sensor or a GPIO pin.';
  } else if (loose) {
    sensorColor = looseContact ? '#ffb300' : '#9e9e9e';
    statusColor = '#ef6c00';
    voltage = looseContact ? '3.3 V' : 'undefined';
    current = looseContact ? SENSOR_CURRENT_MA.toFixed(1) + ' mA' : '0 mA';
    status = 'erratic - this is what a loose ground looks like. The reading comes ' +
             'and goes while nothing on the bench appears to move.';
  } else if (complete) {
    sensorColor = '#43a047';
    statusColor = '#1b5e20';
    voltage = '3.3 V';
    current = SENSOR_CURRENT_MA.toFixed(1) + ' mA';
    status = 'reading normally.';
  } else if (breakAt === 'ground') {
    sensorColor = '#9e9e9e';
    statusColor = '#b71c1c';
    voltage = 'undefined';
    current = '0 mA';
    status = 'no complete loop - sensor is unpowered even though the red wire is ' +
             'still connected.';
  } else {
    sensorColor = '#9e9e9e';
    statusColor = '#b71c1c';
    voltage = 'undefined';
    current = '0 mA';
    status = 'no complete loop - the power wire is open. Either break stops the ' +
             'circuit; it makes no difference which side you cut.';
  }

  return { powerOn: powerOn, groundOn: groundOn, loose: loose, overvolt: overvolt,
           supply: supply, complete: complete, breakAt: breakAt, status: status,
           statusColor: statusColor, sensorColor: sensorColor,
           voltage: voltage, current: current };
}

// ---- draw ---------------------------------------------------------------

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < NARROW_BREAKPOINT;

  // flicker the loose contact on its own clock, independent of frame rate
  if (looseCheckbox.checked()) {
    looseTimer -= deltaTime;
    if (looseTimer <= 0) {
      looseContact = !looseContact;
      looseTimer = looseContact ? random(220, 900) : random(120, 420);
    }
  } else {
    looseContact = true;
  }

  const st = circuitState();
  if (st.complete) dotPhase = (dotPhase + (st.overvolt ? 0.0038 : 0.0022)) % 1;

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  fill('black');
  textAlign(CENTER, TOP);
  textSize(narrow ? 19 : 24);
  text('Circuit Loop and the Missing Ground', canvasWidth / 2, narrow ? 14 : 10);

  let schem, panel;
  if (narrow) {
    schem = { x: margin, y: 46, w: canvasWidth - 2 * margin, h: 218 };
    panel = { x: margin, y: 272, w: canvasWidth - 2 * margin, h: drawHeight - 292 };
  } else {
    const sw = floor(canvasWidth * 0.60);
    schem = { x: margin, y: 50, w: sw - margin, h: drawHeight - 76 };
    panel = { x: sw + 8, y: 50, w: canvasWidth - margin - sw - 8, h: drawHeight - 76 };
  }

  drawSchematic(schem, st);
  drawPanel(panel, st, narrow);
  drawControlLabels();
}

// The loop is four points: supply pin, across the top, down through the sensor,
// back along the bottom to the ground pin.
function loopGeometry(box) {
  const pinX = box.x + 62;
  const sensorX = box.x + box.w - 74;
  const topY = box.y + 44;
  const botY = box.y + box.h - 40;
  return {
    pinX: pinX, sensorX: sensorX, topY: topY, botY: botY,
    powerSwitchX: pinX + (sensorX - pinX) * 0.42,
    groundSwitchX: pinX + (sensorX - pinX) * 0.42,
    midY: (topY + botY) / 2
  };
}

function drawSchematic(box, st) {
  const g = loopGeometry(box);
  const GREY = '#bdbdbd';
  const RED = '#d32f2f';
  const BLACK = '#212121';

  // ---- the Raspberry Pi header stub on the left ----
  noStroke();
  fill('#004d40');
  rect(box.x, g.topY - 26, 44, g.botY - g.topY + 52, 4);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(9);
  text('Raspberry', box.x + 22, g.midY - 7);
  text('Pi', box.x + 22, g.midY + 6);

  // pin pads sit on the right edge of the header
  fill('#ffb74d');
  circle(g.pinX - 18, g.topY, 13);
  fill('#424242');
  circle(g.pinX - 18, g.botY, 13);

  // labels go beside the pads, clear of the header block
  fill('#263238');
  textAlign(LEFT, BOTTOM);
  textSize(11);
  text('3.3 V  (pin 1)', g.pinX - 8, g.topY - 9);
  textAlign(LEFT, TOP);
  text('GND  (pin 6)', g.pinX - 8, g.botY + 9);

  // ---- wires, greyed downstream of whichever break exists ----
  // Conventional current runs supply -> top wire -> sensor -> bottom wire -> ground,
  // so a ground break leaves the red wire live and kills everything after it.
  const powerLive = st.powerOn;
  const bottomLive = st.powerOn && (st.loose ? looseContact : st.groundOn);

  strokeWeight(4);
  strokeCap(ROUND);

  // top (red) wire, in two halves around its switch
  stroke(powerLive ? RED : GREY);
  line(g.pinX - 18, g.topY, g.powerSwitchX - 16, g.topY);
  stroke(powerLive ? RED : GREY);
  line(g.powerSwitchX + 16, g.topY, g.sensorX, g.topY);

  // bottom (black) wire
  stroke(bottomLive ? BLACK : GREY);
  line(g.sensorX, g.botY, g.groundSwitchX + 16, g.botY);
  stroke(bottomLive ? BLACK : GREY);
  line(g.groundSwitchX - 16, g.botY, g.pinX - 18, g.botY);

  drawSwitch(g.powerSwitchX, g.topY, st.powerOn, true, 'power');
  drawSwitch(g.groundSwitchX, g.botY, st.loose ? looseContact : st.groundOn,
             st.groundOn, st.loose ? 'loose' : 'ground');

  // ---- the sensor block ----
  const sh = g.botY - g.topY;
  noStroke();
  fill(st.sensorColor);
  rect(g.sensorX, g.topY, 58, sh, 6);
  stroke('#37474f');
  strokeWeight(1.5);
  noFill();
  rect(g.sensorX, g.topY, 58, sh, 6);
  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(12);
  text('BME280', g.sensorX + 29, g.topY + sh / 2 - 9);
  textSize(10);
  text('3.3 V part', g.sensorX + 29, g.topY + sh / 2 + 8);

  // ---- charge dots ----
  drawCharge(g, st);

  // ---- caption ----
  noStroke();
  fill('#546e7a');
  textAlign(CENTER, TOP);
  textSize(11);
  let cap;
  if (st.complete && st.overvolt) {
    cap = 'The loop is closed - and that is the problem. Too much voltage is reaching a 3.3 V part.';
  } else if (st.complete) {
    cap = 'Charge is moving. The loop is closed.';
  } else {
    cap = 'Charge is stationary. There is no loop.';
  }
  text(cap, box.x + box.w / 2, box.y + box.h - 14);
}

function drawSwitch(x, y, closed, present, kind) {
  // the two contact studs
  noStroke();
  fill('#455a64');
  circle(x - 16, y, 8);
  circle(x + 16, y, 8);
  stroke(closed ? '#37474f' : '#c62828');
  strokeWeight(3);
  if (closed) {
    line(x - 16, y, x + 16, y);
  } else {
    // lever swung open, leaving a visible gap
    line(x - 16, y, x + 12, y - 18);
    noStroke();
    fill('#c62828');
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text('OPEN', x, y - 22);
  }
  noStroke();
  fill('#546e7a');
  textAlign(CENTER, TOP);
  textSize(10);
  text(kind === 'power' ? 'power' : (kind === 'loose' ? 'loose ground' : 'ground'),
       x, y + 8);
}

function drawCharge(g, st) {
  const flowing = st.complete;
  const dotColor = st.overvolt ? '#c62828' : '#1565c0';
  // perimeter path: supply pad -> top -> down the sensor -> bottom -> ground pad
  const pts = [
    { x: g.pinX - 18, y: g.topY },
    { x: g.sensorX + 29, y: g.topY },
    { x: g.sensorX + 29, y: g.botY },
    { x: g.pinX - 18, y: g.botY }
  ];
  let segLen = [];
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const d = dist(a.x, a.y, b.x, b.y);
    segLen.push(d);
    total += d;
  }
  const N = 26;
  noStroke();
  for (let i = 0; i < N; i++) {
    let t = ((i / N) + dotPhase) % 1;
    let want = t * total;
    let k = 0;
    while (want > segLen[k]) { want -= segLen[k]; k++; }
    const a = pts[k];
    const b = pts[(k + 1) % pts.length];
    const f = want / segLen[k];
    const px = lerp(a.x, b.x, f);
    const py = lerp(a.y, b.y, f);
    // hide dots that would sit inside the sensor block body
    if (px > g.sensorX - 2 && px < g.sensorX + 60 && py > g.topY + 6 && py < g.botY - 6) continue;
    fill(flowing ? dotColor : '#b0bec5');
    circle(px, py, flowing ? 6 : 5);
  }
}

function drawPanel(box, st, compact) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const rows = [
    ['Voltage across sensor', 'Voltage', st.voltage],
    ['Current through the loop', 'Current', st.current],
    ['Supply selected', 'Supply', st.overvolt ? '5 V' : '3.3 V']
  ];

  let y = box.y + 8;

  if (compact) {
    // three readouts across one row, so the status still fits underneath
    const cw = (box.w - 20) / 3;
    for (let i = 0; i < rows.length; i++) {
      const cx = box.x + 10 + i * cw;
      fill('#78909c');
      textAlign(LEFT, TOP);
      textSize(10);
      text(rows[i][1], cx, y);
      fill(st.overvolt ? '#b71c1c' : '#212121');
      textSize(17);
      text(rows[i][2], cx, y + 13);
    }
    y += 42;
  } else {
    fill('#546e7a');
    textAlign(LEFT, TOP);
    textSize(12);
    text('Readout', box.x + 10, y);
    y += 20;
    for (let i = 0; i < rows.length; i++) {
      fill('#78909c');
      textSize(11);
      text(rows[i][0], box.x + 10, y);
      fill(st.overvolt ? '#b71c1c' : '#212121');
      textSize(19);
      text(rows[i][2], box.x + 10, y + 14);
      y += 42;
    }
    y += 2;
  }

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(compact ? 10 : 12);
  text('Sensor status', box.x + 10, y);
  y += compact ? 14 : 16;
  fill(st.statusColor);
  textSize(compact ? 11 : 13);
  text(wrapText(st.status, box.w - 20, compact ? 11 : 13), box.x + 10, y);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Supply:', 190, drawHeight + 58);
}

function wrapText(s, maxW, size) {
  textSize(size);
  const words = s.split(' ');
  let line = '';
  let out = '';
  for (let i = 0; i < words.length; i++) {
    const trial = line.length ? line + ' ' + words[i] : words[i];
    if (textWidth(trial) > maxW && line.length) {
      out += line + '\n';
      line = words[i];
    } else {
      line = trial;
    }
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
