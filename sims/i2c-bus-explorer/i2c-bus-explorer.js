// I2C Bus Explorer MicroSim
// CANVAS_HEIGHT: 686
// Bloom Level: Analyze (L4) - the learner examines one I2C transaction to explain
// how addressing lets many devices share two wires, then diagnoses bus faults
// from their symptoms.
// The transaction is a state machine over discrete bit-clock steps, so the same
// sequence drives the schematic, the logic-analyser waveform and the phase
// caption and they cannot disagree. The fault set matches the numbered
// troubleshooting list in the chapter text, in the same order.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 528;
let controlHeight = 158;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 720;

const ADDRESSES = [0x76, 0x77, 0x68, 0x3c, 0x40, 0x48, 0x23, 0x1e];
const ADDR_NAMES = { 0x76: 'BME280', 0x77: 'BME280 alt', 0x68: 'DS3231 RTC',
                     0x3c: 'SSD1306 OLED', 0x40: 'INA219', 0x48: 'ADS1115',
                     0x23: 'BH1750', 0x1e: 'HMC5883L' };

const FAULTS = {
  'None': '',
  'No ground wire': 'No ground means no complete circuit. Check ground first, always.',
  'SDA and SCL swapped': 'Pin 3 is SDA, pin 5 is SCL. They are adjacent on the header.',
  'No pull-up resistors': 'Without pull-ups the lines never settle high. Most breakout ' +
                          'boards include these.',
  'Two devices share 0x76': 'Two devices answering at once. Every device on a bus needs ' +
                            'a unique address.',
  'Device 2 unpowered': 'That device vanishes while the others stay. This is the fault ' +
                        'that looks most like a code bug.'
};

// ---- state ----
let devices = [
  { addr: 0x76, powered: true },
  { addr: 0x68, powered: true },
  { addr: 0x3c, powered: true }
];
let target = 0x76;
let fault = 'None';
let step = 0;
let running = false;
let speed = 'Slow';
let detected = null;         // null until i2cdetect has been run
let detectRun = 0;           // so an unreliable bus gives a different answer each time
let detectNote = '';
let frameAcc = 0;
let chipHits = [], devHits = [];
let faultSelect, targetSelect, speedSelect, addrSelects = [];
let schemBox = { x: 0, y: 0, w: 10, h: 10 };
let waveBox = { x: 0, y: 0, w: 10, h: 10 };
let gridBox = { x: 0, y: 0, w: 10, h: 10 };
let panelBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  faultSelect = createSelect();
  for (const k of Object.keys(FAULTS)) faultSelect.option(k);
  faultSelect.changed(() => { fault = faultSelect.value(); detected = null; step = 0; });
  faultSelect.parent(document.querySelector('main'));

  targetSelect = createSelect();
  for (const a of ADDRESSES) targetSelect.option('0x' + a.toString(16), a);
  targetSelect.elt.value = String(target);
  targetSelect.changed(() => { target = parseInt(targetSelect.value(), 10); step = 0; });
  targetSelect.parent(document.querySelector('main'));

  speedSelect = createSelect();
  for (const k of ['Step by step', 'Slow', 'Normal']) speedSelect.option(k);
  speedSelect.elt.value = 'Slow';
  speedSelect.changed(() => { speed = speedSelect.value(); });
  speedSelect.parent(document.querySelector('main'));

  for (let i = 0; i < 3; i++) {
    const s = createSelect();
    for (const a of ADDRESSES) s.option('0x' + a.toString(16), a);
    s.elt.value = String(devices[i].addr);
    s.changed(() => { devices[i].addr = parseInt(s.value(), 10); detected = null; });
    s.parent(document.querySelector('main'));
    s.style('width', '68px');
    addrSelects.push(s);
  }

  layoutControls();
  describe('An I2C bus with three devices, showing the address broadcast bit by ' +
           'bit on a logic-analyser waveform, which device acknowledges, and a ' +
           'simulated i2cdetect grid, with injectable bus faults.');
}

// ---- effective bus state --------------------------------------------------

function busBroken() {
  return fault === 'No ground wire' || fault === 'SDA and SCL swapped';
}
function effAddr(i) {
  if (fault === 'Two devices share 0x76' && i === 1) return 0x76;
  return devices[i].addr;
}
function devAlive(i) {
  if (busBroken()) return false;
  if (fault === 'Device 2 unpowered' && i === 1) return false;
  return devices[i].powered;
}
function respondersTo(a) {
  const out = [];
  for (let i = 0; i < devices.length; i++) if (devAlive(i) && effAddr(i) === a) out.push(i);
  return out;
}

// ---- the transaction as a list of discrete instants -----------------------

function buildSteps() {
  const bits = [];
  for (let b = 6; b >= 0; b--) bits.push((target >> b) & 1);
  const resp = respondersTo(target);
  const ackOk = resp.length === 1;
  const collide = resp.length > 1;
  const st = [];
  const add = (scl, sda, phase, note, extra) =>
    st.push(Object.assign({ scl: scl, sda: sda, phase: phase, note: note }, extra || {}));

  add(1, 1, 'Idle', 'Pull-up resistors hold both lines high when nobody is talking.');
  add(1, 0, 'START', 'SDA goes low while SCL is high. The controller claims the bus.');
  let acc = 0;
  for (let i = 0; i < 7; i++) {
    acc = (acc << 1) | bits[i];
    const shown = acc.toString(2).padStart(i + 1, '0');
    add(0, bits[i], 'Address bit ' + (i + 1) + ' of 7',
        'Controller sets SDA while the clock is low.', { accBits: shown, bitIdx: i });
    add(1, bits[i], 'Address bit ' + (i + 1) + ' of 7',
        'Clock goes high: every device on the bus reads this bit. So far ' + shown +
        (i === 6 ? ' = 0x' + acc.toString(16) : ''), { accBits: shown, bitIdx: i });
  }
  add(0, 0, 'R/W bit', 'A zero here means write. A one would mean read.', { rw: true });
  add(1, 0, 'R/W bit', 'Clocked in with the address, making 8 bits on the wire.',
      { rw: true });
  add(0, ackOk || collide ? 0 : 1, 'Compare',
      'Every device compares the broadcast address with its own. ' +
      (resp.length ? 'One match.' : 'No match anywhere on the bus.'), { compare: true });
  add(1, ackOk || collide ? 0 : 1, ackOk ? 'ACK' : (collide ? 'ACK collision' : 'NACK'),
      ackOk ? 'The matched device pulls SDA low for one clock. Device 0x' +
              target.toString(16) + ' is here.'
            : (collide ? 'Two devices pulled SDA low at the same time. The controller ' +
                         'cannot tell them apart and the data that follows is rubbish.'
                       : 'Nobody pulled SDA low. The line stayed high. That is a NACK: ' +
                         'no device answered.'),
      { compare: true, ack: true });
  if (ackOk || collide) {
    const data = collide ? 0xa5 : 0x60;
    for (let i = 7; i >= 0; i--) {
      const bit = (data >> i) & 1;
      add(0, bit, 'Data bit ' + (8 - i) + ' of 8', 'Register value being clocked out.',
          { data: true });
      add(1, bit, 'Data bit ' + (8 - i) + ' of 8',
          collide ? 'Both devices are driving this line. The value is corrupt.'
                  : 'Byte so far: 0x' + (data >> i).toString(16), { data: true });
    }
    add(0, 0, 'ACK', 'The controller acknowledges the byte.', { ack: true });
    add(1, 0, 'ACK', 'One more clock.', { ack: true });
  }
  add(1, 0, 'STOP', 'SCL is high and SDA rises: the bus is released.', { stop: true });
  add(1, 1, 'Idle', 'Both lines back up. The next transaction can begin.');
  return st;
}

let STEPS = null;
let stepsKey = '';
function steps() {
  const key = target + '|' + fault + '|' + devices.map(d => d.addr + d.powered).join(',');
  if (key !== stepsKey) { stepsKey = key; STEPS = buildSteps(); }
  return STEPS;
}

function cur() {
  const st = steps();
  return st[Math.min(step, st.length - 1)];
}

// Pull-ups missing: the lines never settle cleanly high.
function noisy(v, i) {
  if (fault !== 'No pull-up resistors') return v;
  if (v === 0) return 0;
  const n = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  return 0.45 + 0.4 * ((n - Math.floor(n)));
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 30;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    schemBox = { x: margin, y: top, w: w, h: 132 };
    waveBox = { x: margin, y: top + 136, w: w, h: 104 };
    panelBox = { x: margin, y: top + 244, w: w, h: 118 };
    gridBox = { x: margin, y: top + 366, w: w, h: drawHeight - (top + 366) - 6 };
  } else {
    const pw = 264;
    const lw = canvasWidth - pw - 3 * margin;
    schemBox = { x: margin, y: top, w: lw, h: 168 };
    waveBox = { x: margin, y: top + 172, w: lw, h: 128 };
    gridBox = { x: margin, y: top + 304, w: lw, h: drawHeight - (top + 304) - 6 };
    panelBox = { x: canvasWidth - margin - pw, y: top, w: pw,
                 h: drawHeight - top - 6 };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 8;
  const narrow = isNarrow();
  faultSelect.position(margin + 74, y0);
  faultSelect.style('width', '178px');
  targetSelect.position(narrow ? margin + 74 : margin + 340, narrow ? y0 + 26 : y0);
  targetSelect.style('width', '78px');
  speedSelect.position(narrow ? margin + 220 : margin + 530, narrow ? y0 + 26 : y0);
  speedSelect.style('width', '104px');
  for (let i = 0; i < 3; i++) {
    addrSelects[i].position(margin + 74 + i * 84, narrow ? y0 + 56 : y0 + 30);
  }
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  if (running && speed !== 'Step by step') {
    frameAcc += 1;
    const every = speed === 'Slow' ? 16 : 5;
    if (frameAcc >= every) {
      frameAcc = 0;
      step += 1;
      if (step >= steps().length) { step = steps().length - 1; running = false; }
    }
  }

  step = constrain(step, 0, steps().length - 1);

  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(22);
  text('I2C Bus Explorer', canvasWidth / 2, 2);

  drawSchematic();
  drawWave();
  drawGrid();
  drawPanel();
  drawControlRegion();
}

function drawSchematic() {
  const b = schemBox;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y, b.w, b.h);
  drawingContext.clip();
  noStroke(); fill('#eef4f9');
  rect(b.x, b.y, b.w, b.h);

  const c = cur();
  const swapped = fault === 'SDA and SCL swapped';
  const sdaY = b.y + b.h * 0.44, sclY = b.y + b.h * 0.62;
  const x0 = b.x + 96, x1 = b.x + b.w - 12;

  // 3.3 V rail and pull-ups
  const railY = b.y + 18;
  stroke('#c62828'); strokeWeight(1.6);
  line(x0, railY, x1 - 40, railY);
  noStroke(); fill('#c62828'); textAlign(LEFT, BOTTOM); textSize(9);
  text('3.3 V', x0, railY - 2);
  if (fault !== 'No pull-up resistors') {
    for (const [yy, lbl] of [[sdaY, 'SDA'], [sclY, 'SCL']]) {
      const rx = x1 - 70 + (lbl === 'SDA' ? 0 : 22);
      stroke('#6d4c41'); strokeWeight(1.4);
      line(rx, railY, rx, yy - 16);
      noStroke(); fill('#e0c9a6'); stroke('#6d4c41'); strokeWeight(1);
      rect(rx - 4, yy - 16, 8, 12, 1);
      stroke('#6d4c41'); line(rx, yy - 4, rx, yy);
      noStroke();
    }
  } else {
    noStroke(); fill('#b71c1c'); textAlign(RIGHT, BOTTOM); textSize(9);
    text('pull-ups removed', x1 - 4, railY - 2);
  }

  // the two bus lines
  const lineCol = (v) => v >= 0.9 ? '#2e7d32' : (v <= 0.1 ? '#c62828' : '#f9a825');
  const sdaV = noisy(c.sda, step * 2), sclV = noisy(c.scl, step * 2 + 1);
  strokeWeight(3);
  stroke(busBroken() ? '#b0bec5' : lineCol(sdaV));
  line(x0, sdaY, x1, sdaY);
  stroke(busBroken() ? '#b0bec5' : lineCol(sclV));
  line(x0, sclY, x1, sclY);
  noStroke(); fill(swapped ? '#b71c1c' : '#37474f');
  textAlign(LEFT, BOTTOM); textSize(10);
  text(swapped ? 'SCL on the SDA pin' : 'SDA', x0 + 6, sdaY - 3);
  text(swapped ? 'SDA on the SCL pin' : 'SCL', x0 + 6, sclY - 3);

  // the controller
  noStroke(); fill('#37474f');
  rect(b.x + 8, b.y + 40, 78, b.h - 70, 4);
  fill(255); textAlign(CENTER, CENTER); textSize(10);
  text('Raspberry Pi', b.x + 47, b.y + 58);
  textSize(9); fill('#b0bec5');
  text('controller', b.x + 47, b.y + 72);
  text(fault === 'No ground wire' ? 'GND MISSING' : 'GND ok', b.x + 47, b.y + b.h - 44);
  if (fault === 'No ground wire') {
    stroke('#b71c1c'); strokeWeight(2);
    line(b.x + 20, b.y + b.h - 34, b.x + 74, b.y + b.h - 24);
    line(b.x + 74, b.y + b.h - 34, b.x + 20, b.y + b.h - 24);
    noStroke();
  }

  // devices tapped onto the lines
  devHits = [];
  const resp = respondersTo(target);
  const comparing = !!c.compare;
  for (let i = 0; i < devices.length; i++) {
    const dx = x0 + 40 + (i + 0.5) * (x1 - x0 - 110) / devices.length;
    const dy = b.y + b.h - 34;
    const alive = devAlive(i);
    const isMatch = effAddr(i) === target;
    const lit = comparing && isMatch && alive;
    const dim = comparing && !lit;
    stroke(alive ? '#78909c' : '#cfd8dc'); strokeWeight(1.4);
    line(dx - 5, sdaY, dx - 5, dy);
    line(dx + 5, sclY, dx + 5, dy);
    noStroke();
    const dw = Math.min(88, (x1 - x0 - 110) / devices.length - 6);
    fill(!alive ? '#eceff1' : (lit ? '#2e7d32' : (dim ? '#eceff1' : '#ffffff')));
    stroke(lit ? '#1b5e20' : '#90a4ae'); strokeWeight(lit ? 2.2 : 1);
    rect(dx - dw / 2, dy, dw, 28, 3);
    noStroke();
    fill(lit ? '#ffffff' : (alive ? '#37474f' : '#b0bec5'));
    textAlign(CENTER, CENTER); textSize(10);
    text('0x' + effAddr(i).toString(16), dx, dy + 9);
    textSize(8);
    let nm = alive ? (ADDR_NAMES[effAddr(i)] || 'device') : 'no power';
    if (textWidth(nm) > dw - 6) nm = alive ? 'device' : 'off';
    text(nm, dx, dy + 21);
    devHits.push({ x: dx - dw / 2, y: dy, w: dw, h: 28, i: i });
  }

  if (comparing) {
    noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(10);
    text(resp.length === 1
           ? 'Only the device whose address matches will answer.'
           : (resp.length > 1 ? 'Two devices match. Both are answering.'
                              : 'No device matches 0x' + target.toString(16) + '.'),
         b.x + b.w / 2, b.y + b.h * 0.20);
  }

  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h);
  noStroke();
}

function drawWave() {
  const b = waveBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const st = steps();
  const L = b.x + 40, R = b.x + b.w - 8;
  const n = st.length;
  const dx = (R - L) / (n - 1);
  const sdaTop = b.y + 20, sdaBot = b.y + 46;
  const sclTop = b.y + 60, sclBot = b.y + 86;

  fill('#5a6a78'); textAlign(RIGHT, CENTER); textSize(10);
  text('SDA', L - 5, (sdaTop + sdaBot) / 2);
  text('SCL', L - 5, (sclTop + sclBot) / 2);

  const drawLine = (getV, top, bot, col) => {
    stroke(col); strokeWeight(1.8); noFill();
    beginShape();
    for (let i = 0; i < n; i++) {
      const v = getV(i);
      const yy = bot - v * (bot - top);
      if (i > 0) {
        const pv = getV(i - 1);
        vertex(L + i * dx, bot - pv * (bot - top));
      }
      vertex(L + i * dx, yy);
    }
    endShape();
  };
  drawLine(i => noisy(st[i].sda, i * 2), sdaTop, sdaBot, '#1565c0');
  drawLine(i => noisy(st[i].scl, i * 2 + 1), sclTop, sclBot, '#6a1b9a');

  // cursor
  const cx = L + Math.min(step, n - 1) * dx;
  stroke('#c62828'); strokeWeight(1.6);
  line(cx, b.y + 14, cx, sclBot + 6);
  noStroke(); fill('#c62828'); textAlign(CENTER, TOP); textSize(9);
  text(cur().phase, cx, sclBot + 7);

  fill('#8a97a4'); textAlign(LEFT, TOP); textSize(9);
  text('step ' + (step + 1) + ' of ' + n, b.x + 6, b.y + 4);
  textAlign(RIGHT, TOP);
  text('logic analyser view', b.x + b.w - 6, b.y + 4);
}

function drawGrid() {
  const b = gridBox;
  noStroke(); fill('#1b1b1b'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  textFont('monospace');
  fill('#9ccc65'); textAlign(LEFT, TOP); textSize(10);
  text('$ i2cdetect -y 1', b.x + 8, b.y + 5);
  if (detected === null) {
    fill('#78909c'); textSize(10);
    text('press "Run i2cdetect" to sweep every address on the bus', b.x + 8, b.y + 22);
    textFont('Arial');
    return;
  }
  if (detectNote === 'unreliable') {
    fill('#ff8a65'); textAlign(RIGHT, TOP); textSize(9.5);
    text('run it again: you get a different answer', b.x + b.w - 8, b.y + 5);
  } else if (detected.length === 0) {
    fill('#ff8a65'); textAlign(RIGHT, TOP); textSize(9.5);
    text('nothing on the bus', b.x + b.w - 8, b.y + 5);
  }
  const cw = Math.min(19, (b.w - 46) / 16);
  const ch = Math.min(13, (b.h - 24) / 9);
  const gx = b.x + 30, gy = b.y + 20;
  fill('#b0bec5'); textAlign(CENTER, TOP); textSize(Math.min(9.5, ch * 0.8));
  for (let c = 0; c < 16; c++) text(c.toString(16), gx + c * cw + cw / 2, gy);
  for (let r = 0; r < 8; r++) {
    textAlign(LEFT, TOP); fill('#b0bec5');
    text(r.toString(16) + '0:', b.x + 6, gy + (r + 1) * ch);
    for (let c = 0; c < 16; c++) {
      const a = r * 16 + c;
      let s = '--';
      if (a < 0x03 || a > 0x77) s = '  ';
      else if (detected.indexOf(a) >= 0) s = a.toString(16).padStart(2, '0');
      textAlign(CENTER, TOP);
      fill(s === '--' || s === '  ' ? '#546e7a' : '#ffee58');
      text(s, gx + c * cw + cw / 2, gy + (r + 1) * ch);
    }
  }
  textFont('Arial');
}

function drawPanel() {
  const b = panelBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 9, W = b.w - 18;
  let y = b.y + 7;
  const c = cur();

  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
  text('Step ' + (step + 1) + ' of ' + steps().length, L, y);
  y += 14;
  fill('#0d2b45'); textSize(12.5); textStyle(BOLD);
  y = para(L, y, W, c.phase, 14, 12.5);
  textStyle(NORMAL); y += 3;
  fill('#33475b'); textSize(10.8);
  y = para(L, y, W, c.note, 12.5, 10.8);
  y += 5;

  if (c.accBits !== undefined) {
    fill('#0d2b45'); textSize(11);
    const shown = c.accBits.padEnd(7, '.');
    text('address so far  ' + shown, L, y);
    y += 14;
    if (c.accBits.length === 7) {
      fill('#1565c0'); textSize(11);
      text(c.accBits + ' = 0x' + parseInt(c.accBits, 2).toString(16), L, y);
      y += 14;
    }
  }

  if (c.compare) {
    const resp = respondersTo(target);
    y += 2;
    for (let i = 0; i < devices.length; i++) {
      const m = effAddr(i) === target && devAlive(i);
      noStroke(); fill(m ? '#e8f5e9' : '#f4f6f8');
      rect(L, y, W, 15, 2);
      fill(m ? '#1b5e20' : '#8a97a4'); textAlign(LEFT, CENTER); textSize(9.5);
      text('0x' + effAddr(i).toString(16) + '  vs  0x' + target.toString(16) + '   ' +
           (devAlive(i) ? (m ? 'MATCH - answers' : 'no match - stays silent')
                        : 'unpowered - cannot answer'), L + 5, y + 8);
      y += 17;
    }
    if (resp.length > 1) {
      fill('#b71c1c'); textAlign(LEFT, TOP); textSize(10);
      y = para(L, y + 2, W, 'Both devices pull SDA low together. The controller sees ' +
               'one ACK and cannot tell there are two.', 11.5, 10) + 4;
    }
  }

  if (fault !== 'None') {
    y = Math.max(y, b.y + b.h - 62);
    noStroke(); fill('#fdeeee');
    rect(L, y, W, b.y + b.h - y - 6, 3);
    fill('#b71c1c'); textAlign(LEFT, TOP); textSize(10.5); textStyle(BOLD);
    text(fault, L + 5, y + 4); textStyle(NORMAL);
    textSize(10);
    para(L + 5, y + 18, W - 10, FAULTS[fault], 11.5, 10);
  }
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 8;
  const narrow = isNarrow();
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(11);
  text('Inject fault', margin, y0 + 10);
  text('Talk to', narrow ? margin : margin + 278, narrow ? y0 + 36 : y0 + 10);
  text('Speed', narrow ? margin + 166 : margin + 476, narrow ? y0 + 36 : y0 + 10);
  text('Devices', margin, narrow ? y0 + 66 : y0 + 40);

  chipHits = [];
  const cy = narrow ? y0 + 92 : y0 + 72;
  let x = margin;
  x = chip(x, cy, running ? 'Pause' : 'Play', running) + 6;
  x = chip(x, cy, 'Step back', false) + 6;
  x = chip(x, cy, 'Step forward', false) + 6;
  x = chip(x, cy, 'Restart', false) + 6;
  chip(x, cy, 'Run i2cdetect', false);
}

function chip(x, y, label, on) {
  textSize(11); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 16;
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
      onChip(c.label);
      return false;
    }
  }
  for (const d of devHits) {
    if (mouseX >= d.x && mouseX <= d.x + d.w && mouseY >= d.y && mouseY <= d.y + d.h) {
      devices[d.i].powered = !devices[d.i].powered;
      detected = null;
      return false;
    }
  }
  if (mouseX >= waveBox.x && mouseX <= waveBox.x + waveBox.w &&
      mouseY >= waveBox.y && mouseY <= waveBox.y + waveBox.h) {
    const L = waveBox.x + 40, R = waveBox.x + waveBox.w - 8;
    const n = steps().length;
    step = constrain(Math.round((mouseX - L) / ((R - L) / (n - 1))), 0, n - 1);
    running = false;
    return false;
  }
  return true;
}

function onChip(label) {
  if (label === 'Play' || label === 'Pause') {
    if (!running && step >= steps().length - 1) step = 0;
    running = !running;
  } else if (label === 'Step forward') {
    running = false; step = Math.min(steps().length - 1, step + 1);
  } else if (label === 'Step back') {
    running = false; step = Math.max(0, step - 1);
  } else if (label === 'Restart') {
    step = 0; running = false;
  } else if (label === 'Run i2cdetect') {
    detectRun += 1;
    detected = [];
    detectNote = '';
    for (let a = 0x03; a <= 0x77; a++) {
      if (respondersTo(a).length === 0) continue;
      if (fault === 'No pull-up resistors') {
        // a floating line reads as a coin toss, so devices come and go
        const n = Math.sin(a * 91.7 + detectRun * 37.13) * 43758.5453;
        if (n - Math.floor(n) < 0.5) { detectNote = 'unreliable'; continue; }
        detectNote = 'unreliable';
      }
      detected.push(a);
    }
  }
}

function para(L, y, W, s, lh, size) {
  const lines = wrapLines(s, W, size);
  for (let i = 0; i < lines.length; i++) text(lines[i], L, y + i * lh);
  return y + lines.length * lh;
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
