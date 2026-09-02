// Raspberry Pi GPIO Pinout Explorer MicroSim
// CANVAS_HEIGHT: 524
// Bloom Level: Remember (L1) - the learner locates a pin by number and function
// and identifies which pins are safe for a 3.3 V sensor.
// Built as a filterable reference rather than an animation, because this is the
// page a learner comes back to with the board in their hand. The guided wiring
// mode exists because the riskiest moment in the book is the first wire.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 84;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 700;

// ---- controls ----
let allButton, powerButton, groundButton, i2cButton;
let guideButton, nextButton, resetButton;

// ---- state ----
let filter = 'all';           // 'all' | 'power' | 'ground' | 'i2c'
let selectedPin = 1;
let hoverPin = -1;
let guided = false;
let guideStep = 0;
let pinHits = [];             // recomputed every frame from canvas size

const CAT_COLOR = {
  v5:      '#e53935',
  v33:     '#fb8c00',
  gnd:     '#37474f',
  gpio:    '#43a047',
  special: '#1e88e5'
};
const CAT_LABEL = {
  v5: '5 V power', v33: '3.3 V power', gnd: 'Ground',
  gpio: 'General-purpose GPIO', special: 'GPIO with a special function'
};

const SAFE_GPIO = 'Safe for 3.3 V logic. Never apply 5 V to a GPIO pin.';
const SAFE_GND  = 'Ground. Always safe to connect.';
const SAFE_33   = 'Safe for 3.3 V sensors.';
const SAFE_5    = '5 V - never connect to a GPIO pin.';
const UNUSED    = 'Not used in this book.';

// Standard Raspberry Pi 40-pin header, as fitted to the Zero 2 W.
const PINS = [
  { n: 1,  bcm: null, fn: '3.3 V power',              cat: 'v33',     safe: SAFE_33,   book: 'Powers the BME280. This is the pin your red wire goes to.' },
  { n: 2,  bcm: null, fn: '5 V power',                cat: 'v5',      safe: SAFE_5,    book: '5 volts. Useful for powering some peripherals. NEVER connect to a GPIO pin.' },
  { n: 3,  bcm: 2,    fn: 'GPIO 2 / I2C1 SDA',        cat: 'special', safe: SAFE_33,   book: 'I2C data line. Chapter 12.' },
  { n: 4,  bcm: null, fn: '5 V power',                cat: 'v5',      safe: SAFE_5,    book: '5 volts. Useful for powering some peripherals. NEVER connect to a GPIO pin.' },
  { n: 5,  bcm: 3,    fn: 'GPIO 3 / I2C1 SCL',        cat: 'special', safe: SAFE_33,   book: 'I2C clock line. Chapter 12.' },
  { n: 6,  bcm: null, fn: 'Ground',                   cat: 'gnd',     safe: SAFE_GND,  book: 'One of eight ground pins. Your black wire goes here.' },
  { n: 7,  bcm: 4,    fn: 'GPIO 4 (GPCLK0)',          cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 8,  bcm: 14,   fn: 'GPIO 14 / UART TXD',       cat: 'special', safe: SAFE_GPIO, book: 'Serial console output. Handy for debugging a headless Pi.' },
  { n: 9,  bcm: null, fn: 'Ground',                   cat: 'gnd',     safe: SAFE_GND,  book: 'One of eight ground pins.' },
  { n: 10, bcm: 15,   fn: 'GPIO 15 / UART RXD',       cat: 'special', safe: SAFE_GPIO, book: 'Serial console input.' },
  { n: 11, bcm: 17,   fn: 'GPIO 17',                  cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 12, bcm: 18,   fn: 'GPIO 18 (PWM0)',           cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 13, bcm: 27,   fn: 'GPIO 27',                  cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 14, bcm: null, fn: 'Ground',                   cat: 'gnd',     safe: SAFE_GND,  book: 'One of eight ground pins.' },
  { n: 15, bcm: 22,   fn: 'GPIO 22',                  cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 16, bcm: 23,   fn: 'GPIO 23',                  cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 17, bcm: null, fn: '3.3 V power',              cat: 'v33',     safe: SAFE_33,   book: 'The second 3.3 V pin. Same supply as pin 1.' },
  { n: 18, bcm: 24,   fn: 'GPIO 24',                  cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 19, bcm: 10,   fn: 'GPIO 10 / SPI0 MOSI',      cat: 'special', safe: SAFE_GPIO, book: 'SPI bus. Mentioned in Chapter 12, not used for the BME280.' },
  { n: 20, bcm: null, fn: 'Ground',                   cat: 'gnd',     safe: SAFE_GND,  book: 'One of eight ground pins.' },
  { n: 21, bcm: 9,    fn: 'GPIO 9 / SPI0 MISO',       cat: 'special', safe: SAFE_GPIO, book: 'SPI bus. Chapter 12.' },
  { n: 22, bcm: 25,   fn: 'GPIO 25',                  cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 23, bcm: 11,   fn: 'GPIO 11 / SPI0 SCLK',      cat: 'special', safe: SAFE_GPIO, book: 'SPI bus. Chapter 12.' },
  { n: 24, bcm: 8,    fn: 'GPIO 8 / SPI0 CE0',        cat: 'special', safe: SAFE_GPIO, book: 'SPI chip select. Chapter 12.' },
  { n: 25, bcm: null, fn: 'Ground',                   cat: 'gnd',     safe: SAFE_GND,  book: 'One of eight ground pins.' },
  { n: 26, bcm: 7,    fn: 'GPIO 7 / SPI0 CE1',        cat: 'special', safe: SAFE_GPIO, book: 'SPI chip select. Chapter 12.' },
  { n: 27, bcm: 0,    fn: 'GPIO 0 / ID_SD',           cat: 'special', safe: SAFE_GPIO, book: 'Reserved for HAT identification. Leave it alone.' },
  { n: 28, bcm: 1,    fn: 'GPIO 1 / ID_SC',           cat: 'special', safe: SAFE_GPIO, book: 'Reserved for HAT identification. Leave it alone.' },
  { n: 29, bcm: 5,    fn: 'GPIO 5',                   cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 30, bcm: null, fn: 'Ground',                   cat: 'gnd',     safe: SAFE_GND,  book: 'One of eight ground pins.' },
  { n: 31, bcm: 6,    fn: 'GPIO 6',                   cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 32, bcm: 12,   fn: 'GPIO 12 (PWM0)',           cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 33, bcm: 13,   fn: 'GPIO 13 (PWM1)',           cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 34, bcm: null, fn: 'Ground',                   cat: 'gnd',     safe: SAFE_GND,  book: 'One of eight ground pins.' },
  { n: 35, bcm: 19,   fn: 'GPIO 19 / SPI1 MISO',      cat: 'special', safe: SAFE_GPIO, book: UNUSED },
  { n: 36, bcm: 16,   fn: 'GPIO 16',                  cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 37, bcm: 26,   fn: 'GPIO 26',                  cat: 'gpio',    safe: SAFE_GPIO, book: UNUSED },
  { n: 38, bcm: 20,   fn: 'GPIO 20 / SPI1 MOSI',      cat: 'special', safe: SAFE_GPIO, book: UNUSED },
  { n: 39, bcm: null, fn: 'Ground',                   cat: 'gnd',     safe: SAFE_GND,  book: 'One of eight ground pins.' },
  { n: 40, bcm: 21,   fn: 'GPIO 21 / SPI1 SCLK',      cat: 'special', safe: SAFE_GPIO, book: UNUSED }
];

// Ground goes on first. If power reaches a sensor before ground does, the
// return current has to find its way home through a data line.
const GUIDE = [
  { pin: 6, wire: 'black',  note: 'Ground first, always. If power arrives before ground, the return current tries to go home through a data line, and that is how parts get damaged.' },
  { pin: 1, wire: 'red',    note: '3.3 volts. Pin 1, not pin 2 and not pin 4 - those two are 5 V and would destroy the sensor.' },
  { pin: 3, wire: 'blue',   note: 'I2C data, SDA. This is the line the readings travel on.' },
  { pin: 5, wire: 'yellow', note: 'I2C clock, SCL. The Pi drives this so both ends agree on when a bit is a bit.' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  allButton    = createButton('All');
  powerButton  = createButton('Power');
  groundButton = createButton('Ground');
  i2cButton    = createButton('I2C');
  allButton.mousePressed(function () { setFilter('all'); });
  powerButton.mousePressed(function () { setFilter('power'); });
  groundButton.mousePressed(function () { setFilter('ground'); });
  i2cButton.mousePressed(function () { setFilter('i2c'); });

  guideButton = createButton('Wire the BME280');
  guideButton.mousePressed(startGuide);
  nextButton = createButton('Next step');
  nextButton.mousePressed(nextGuideStep);
  resetButton = createButton('Reset');
  resetButton.mousePressed(function () {
    guided = false; guideStep = 0; filter = 'all'; selectedPin = 1;
    guideButton.html('Wire the BME280');
  });

  layoutControls();

  describe('A to-scale drawing of the Raspberry Pi 40-pin header, colour coded by ' +
           'function. Every pin is clickable and opens its physical number, BCM ' +
           'number, function, a safety line, and where the book uses it. Filter ' +
           'buttons dim the pins that do not match so positions are preserved, and ' +
           'a guided mode walks through the four pins the BME280 needs, ground ' +
           'first.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  allButton.position(10, r1);
  powerButton.position(58, r1);
  groundButton.position(126, r1);
  i2cButton.position(200, r1);
  guideButton.position(10, r2);
  nextButton.position(142, r2);
  resetButton.position(226, r2);
}

function setFilter(f) {
  filter = f;
  guided = false;
  guideButton.html('Wire the BME280');
}

function startGuide() {
  guided = true;
  guideStep = 0;
  filter = 'all';
  selectedPin = GUIDE[0].pin;
  guideButton.html('Restart guide');
}

function nextGuideStep() {
  if (!guided) { startGuide(); return; }
  guideStep = (guideStep + 1) % GUIDE.length;
  selectedPin = GUIDE[guideStep].pin;
}

function matchesFilter(p) {
  if (filter === 'all') return true;
  if (filter === 'power') return p.cat === 'v5' || p.cat === 'v33';
  if (filter === 'ground') return p.cat === 'gnd';
  if (filter === 'i2c') return p.n === 3 || p.n === 5;
  return true;
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
  textSize(narrow ? 19 : 24);
  text('Raspberry Pi GPIO Pinout Explorer', canvasWidth / 2, narrow ? 12 : 8);

  let boardBox, panelBox;
  if (narrow) {
    boardBox = { x: margin, y: 40, w: canvasWidth - 2 * margin, h: 168 };
    panelBox = { x: margin, y: 272, w: canvasWidth - 2 * margin, h: drawHeight - 286 };
  } else {
    const bw = floor(canvasWidth * 0.62);
    boardBox = { x: margin, y: 46, w: bw - margin, h: 220 };
    panelBox = { x: bw + 8, y: 46, w: canvasWidth - margin - bw - 8, h: drawHeight - 70 };
  }

  drawBoard(boardBox, narrow);
  drawLegend(boardBox.x, boardBox.y + boardBox.h + 6, boardBox.w, narrow);
  if (!narrow) drawBookPins(boardBox.x, boardBox.y + boardBox.h + 54, boardBox.w);
  drawPanel(panelBox, narrow);
  drawControlLabels();
}

function drawBoard(box, narrow) {
  // board body
  noStroke();
  fill('#1b5e20');
  rect(box.x, box.y, box.w, box.h, 8);
  fill('#2e7d32');
  rect(box.x + 4, box.y + 4, box.w - 8, box.h - 8, 6);

  noStroke();
  fill('#a5d6a7');
  textAlign(RIGHT, BOTTOM);
  textSize(11);
  text('Raspberry Pi Zero 2 W  -  header along the top edge', box.x + box.w - 10, box.y + box.h - 8);

  // header strip
  const pad = 18;
  const headerW = box.w - 2 * pad;
  const pitch = headerW / 20;
  const r = min(pitch * 0.38, 11);
  const rowGap = max(pitch, 20);
  const oddY = box.y + 42;
  const evenY = oddY + rowGap;

  fill('#212121');
  rect(box.x + pad - 8, oddY - r - 8, headerW + 16 - pitch, rowGap + 2 * r + 16, 4);

  pinHits = [];
  textAlign(CENTER, CENTER);
  const showEveryNumber = pitch >= 19;

  for (let i = 0; i < 40; i++) {
    const p = PINS[i];
    const col = floor(i / 2);
    const isOdd = p.n % 2 === 1;
    const cx = box.x + pad + col * pitch;
    const cy = isOdd ? oddY : evenY;
    pinHits.push({ n: p.n, x: cx, y: cy, r: r + 3 });

    const on = matchesFilter(p);
    const isSel = p.n === selectedPin;
    const isHover = p.n === hoverPin;
    const guideTarget = guided && GUIDE[guideStep].pin === p.n;

    // pin 1 is square, exactly as it is silkscreened on the board
    push();
    if (!on) drawingContext.globalAlpha = 0.22;
    noStroke();
    fill(CAT_COLOR[p.cat]);
    if (p.n === 1) rect(cx - r, cy - r, 2 * r, 2 * r, 2);
    else circle(cx, cy, 2 * r);

    if (isSel || isHover || guideTarget) {
      noFill();
      stroke(guideTarget ? '#ffee58' : '#ffffff');
      strokeWeight(guideTarget ? 3 : 2);
      const pulse = guideTarget ? 3 + 2 * sin(frameCount * 0.12) : 0;
      circle(cx, cy, 2 * r + 7 + pulse);
    }
    pop();

    // pin numbers: odd row above, even row below
    if (showEveryNumber || p.n === 1 || p.n === 2 || p.n === 39 || p.n === 40 || col % 2 === 0) {
      noStroke();
      fill('#eceff1');
      textSize(pitch >= 19 ? 9 : 8);
      text(p.n, cx, isOdd ? cy - r - 8 : cy + r + 8);
    }
  }

  // pin 1 callout
  noStroke();
  fill('#ffee58');
  textAlign(LEFT, BOTTOM);
  textSize(10);
  text('pin 1', box.x + pad - r - 2, oddY - r - 18);
}

function drawLegend(x, y, w, narrow) {
  const keys = ['v33', 'v5', 'gnd', 'gpio', 'special'];
  const cols = narrow ? 2 : 3;
  const cw = w / cols;
  textAlign(LEFT, CENTER);
  textSize(narrow ? 10 : 11);
  for (let i = 0; i < keys.length; i++) {
    const cx = x + (i % cols) * cw;
    const cy = y + 9 + floor(i / cols) * 17;
    noStroke();
    fill(CAT_COLOR[keys[i]]);
    circle(cx + 6, cy, 11);
    fill('#37474f');
    text(CAT_LABEL[keys[i]], cx + 16, cy);
  }
}

// The four pins this book wires, listed in the order the guide connects them.
function drawBookPins(x, y, w) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, 116, 6);
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(12);
  text('The four pins this book uses, in connection order', x + 10, y + 8);

  const WIRE = { black: '#212121', red: '#d32f2f', blue: '#1e88e5', yellow: '#fbc02d' };
  for (let i = 0; i < GUIDE.length; i++) {
    const g = GUIDE[i];
    const p = PINS[g.pin - 1];
    const ry = y + 30 + i * 21;
    // wire colour swatch
    stroke(WIRE[g.wire]);
    strokeWeight(4);
    line(x + 12, ry + 7, x + 40, ry + 7);
    noStroke();
    fill('#212121');
    textSize(12);
    text((i + 1) + '.  Pin ' + g.pin, x + 48, ry);
    fill('#455a64');
    text(p.fn, x + 128, ry);
    fill('#78909c');
    textAlign(RIGHT, TOP);
    text(g.wire + ' wire', x + w - 12, ry);
    textAlign(LEFT, TOP);
  }
}

function drawPanel(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const p = PINS[selectedPin - 1];
  const inner = box.w - 20;
  let y = box.y + 10;

  if (guided) {
    const g = GUIDE[guideStep];
    fill('#f57f17');
    textAlign(LEFT, TOP);
    textSize(narrow ? 11 : 12);
    text('Wire the BME280  -  step ' + (guideStep + 1) + ' of ' + GUIDE.length, box.x + 10, y);
    y += narrow ? 17 : 20;
    fill('#212121');
    textSize(narrow ? 16 : 19);
    text('Pin ' + g.pin + ':  ' + PINS[g.pin - 1].fn, box.x + 10, y);
    y += narrow ? 22 : 26;
    fill('#455a64');
    textSize(narrow ? 12 : 13);
    text('Use the ' + g.wire + ' wire.', box.x + 10, y);
    y += narrow ? 17 : 20;
    const nz = narrow ? 11 : 12;
    const note = wrapText(g.note, inner, nz);
    textSize(nz);
    text(note, box.x + 10, y);
    y += note.split('\n').length * (nz + 3) + 6;
    fill('#78909c');
    textSize(10);
    text('Press Next step to continue.', box.x + 10, y);
    return;
  }

  if (narrow) {
    // pin number and function share one line so the safety text still fits
    fill('#212121');
    textAlign(LEFT, TOP);
    textSize(22);
    text('Pin ' + p.n, box.x + 10, y);
    const nw = textWidth('Pin ' + p.n);
    fill('#455a64');
    textSize(14);
    text(wrapText(p.fn, inner - nw - 22, 14), box.x + 18 + nw, y + 5);
    noStroke();
    fill(CAT_COLOR[p.cat]);
    circle(box.x + box.w - 20, y + 12, 17);
    y += 32;

    fill('#78909c');
    textSize(11);
    text('BCM GPIO: ' + (p.bcm === null ? 'not applicable' : p.bcm), box.x + 10, y);
    y += 17;

    fill(p.cat === 'v5' ? '#b71c1c' : '#1b5e20');
    textSize(12);
    const sl = wrapText(p.safe, inner, 12);
    text(sl, box.x + 10, y);
    y += sl.split('\n').length * 15 + 5;

    fill('#455a64');
    textSize(11);
    text(wrapText(p.book, inner, 11), box.x + 10, y);
    return;
  }

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(12);
  text('Physical pin', box.x + 10, y);
  y += 15;
  fill('#212121');
  textSize(26);
  text(p.n, box.x + 10, y);

  noStroke();
  fill(CAT_COLOR[p.cat]);
  circle(box.x + box.w - 24, y + 12, 20);
  y += 34;

  fill('#546e7a');
  textSize(12);
  text('Function', box.x + 10, y);
  y += 15;
  fill('#212121');
  textSize(16);
  text(wrapText(p.fn, inner, 16), box.x + 10, y);
  y += wrapText(p.fn, inner, 16).split('\n').length * 20 + 6;

  fill('#546e7a');
  textSize(12);
  text('BCM GPIO number', box.x + 10, y);
  y += 15;
  fill('#212121');
  textSize(16);
  text(p.bcm === null ? 'not applicable' : String(p.bcm), box.x + 10, y);
  y += 26;

  const danger = p.cat === 'v5';
  fill(danger ? '#b71c1c' : '#1b5e20');
  textSize(13);
  const safeLines = wrapText(p.safe, inner, 13);
  text(safeLines, box.x + 10, y);
  y += safeLines.split('\n').length * 16 + 8;

  fill('#455a64');
  textSize(12);
  text(wrapText(p.book, inner, 12), box.x + 10, y);
}

function drawControlLabels() {
  noStroke();
  fill('#546e7a');
  textAlign(LEFT, CENTER);
  textSize(11);
  const names = { all: 'all 40 pins', power: 'power pins only', ground: 'ground pins only', i2c: 'I2C pins only' };
  text('Showing: ' + names[filter], 258, drawHeight + 20);
}

// ---- interaction --------------------------------------------------------

function mouseMoved() {
  hoverPin = pinAt(mouseX, mouseY);
}

function mousePressed() {
  const n = pinAt(mouseX, mouseY);
  if (n > 0) {
    selectedPin = n;
    guided = false;
    guideButton.html('Wire the BME280');
  }
}

function pinAt(mx, my) {
  for (let i = 0; i < pinHits.length; i++) {
    const h = pinHits[i];
    if (dist(mx, my, h.x, h.y) <= h.r) return h.n;
  }
  return -1;
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
