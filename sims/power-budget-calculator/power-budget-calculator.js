// Power Budget Calculator MicroSim
// CANVAS_HEIGHT: 688
// Bloom Level: Evaluate (L5) - the learner judges whether a panel, battery and
// duty cycle will carry a station through its worst month, not its average one.
// The state of charge is simulated day by day for a whole year and carried
// forward, which is what distinguishes this from a spreadsheet: the battery
// draws down progressively across autumn instead of passing a monthly average.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 504;
let controlHeight = 184;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 760;
const MONO = 'monospace';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const ETA = 0.7;                 // the chapter's working figure for panel losses
const START_MONTH = 2;           // March: built and tested in spring
const VOLTS = 5;

// Monthly insolation in kWh/m2/day, and monthly mean temperature in C.
const SITES = {
  'Coastal mid-latitude': {
    ins: [1.2, 2.0, 3.2, 4.4, 5.4, 6.0, 6.2, 5.5, 4.2, 2.7, 1.6, 1.1],
    tmp: [4, 5, 8, 11, 15, 18, 20, 20, 17, 12, 7, 4] },
  'High latitude': {
    ins: [0.3, 0.9, 2.2, 3.7, 5.0, 5.6, 5.3, 4.0, 2.4, 1.1, 0.4, 0.2],
    tmp: [-8, -7, -2, 3, 9, 14, 16, 14, 9, 3, -3, -7] },
  'Desert': {
    ins: [3.2, 4.1, 5.4, 6.7, 7.5, 8.0, 7.6, 7.0, 6.0, 4.6, 3.4, 2.9],
    tmp: [11, 14, 18, 22, 27, 32, 35, 34, 30, 23, 15, 11] },
  'Persistently cloudy': {
    ins: [0.6, 1.2, 2.1, 3.2, 4.1, 4.3, 4.1, 3.5, 2.3, 1.2, 0.7, 0.5],
    tmp: [5, 5, 7, 10, 13, 16, 18, 18, 15, 11, 7, 5] }
};
const SITE_NAMES = Object.keys(SITES);

// ---- the load, itemised so it sums to the chapter's 3,600 mAh/day ----
const LOADS = [
  { id: 'pi',    name: 'Pi board, idle and logging', ma: 72, h: 24 },
  { id: 'wifi',  name: 'Wi-Fi associated', ma: 45, h: 24, radio: 'Wi-Fi' },
  { id: 'cell',  name: 'Cellular modem idle', ma: 18, h: 24, radio: 'Cellular' },
  { id: 'celltx',name: 'Cellular transmit bursts', ma: 250, h: 0.5, radio: 'Cellular' },
  { id: 'hdmi',  name: 'HDMI output', ma: 25, h: 24 },
  { id: 'leds',  name: 'Onboard LEDs', ma: 7, h: 24 },
  { id: 'sens',  name: 'BME280 and peripherals', ma: 1, h: 24 }
];

// Each duty-cycle measure, its saving, and what it costs you.
const DUTY = [
  { id: 'wifioff', name: 'Wi-Fi off except to transmit', cost: 'Data arrives in batches',
    save: () => radio === 'Wi-Fi' ? 45 * 23 : 0 },
  { id: 'batch', name: 'Batch transmissions hourly', cost: 'Up to an hour of delay',
    save: () => 180 },
  { id: 'hdmi', name: 'Disable HDMI output', cost: 'None; nothing is plugged in',
    save: () => 25 * 24 },
  { id: 'leds', name: 'Disable onboard LEDs', cost: 'Harder to tell it is alive',
    save: () => 7 * 24 },
  { id: 'modem', name: 'Sleep the modem between sends', cost: 'Reconnection time',
    save: () => radio === 'Cellular' ? 15 * 23 : 0 },
  { id: 'timer', name: 'External timer powers the Pi down', cost: 'Complexity, boot time',
    save: () => 72 * 24 * 0.6 }
];

// ---- state ----
let panelW = 10;
let battMah = 20000;
let chem = 'Lithium';
let controller = 'PWM';
let radio = 'Wi-Fi';
let site = 'Coastal mid-latitude';
let duty = {};
let coldDerate = true;
let badWeek = false;
let chipHits = [];
let panelSelect, battSelect, chemSelect, ctrlSelect, radioSelect, siteSelect;
let socBox = { x: 0, y: 0, w: 10, h: 10 };
let loadBox = { x: 0, y: 0, w: 10, h: 10 };
let tabBox = { x: 0, y: 0, w: 10, h: 10 };
let verBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');
  const mk = (opts, val, cb, w) => {
    const s = createSelect();
    for (const o of opts) s.option(o[0], o[1]);
    s.elt.value = String(val);
    s.changed(() => cb(s.value()));
    s.parent(document.querySelector('main'));
    s.style('width', w + 'px');
    return s;
  };
  panelSelect = mk([['5 W', 5], ['10 W', 10], ['20 W', 20], ['50 W', 50]], panelW,
                   v => panelW = parseFloat(v), 76);
  battSelect = mk([['5,000 mAh', 5000], ['10,000 mAh', 10000], ['20,000 mAh', 20000],
                   ['50,000 mAh', 50000]], battMah, v => battMah = parseFloat(v), 108);
  chemSelect = mk([['Lithium (80%)', 'Lithium'], ['Lead-acid (50%)', 'Lead-acid']], chem,
                  v => chem = v, 124);
  ctrlSelect = mk([['PWM', 'PWM'], ['MPPT', 'MPPT']], controller, v => controller = v, 76);
  radioSelect = mk([['Wi-Fi', 'Wi-Fi'], ['Cellular', 'Cellular']], radio, v => radio = v, 92);
  siteSelect = mk(SITE_NAMES.map(n => [n, n]), site, v => site = v, 172);
  layoutControls();
  describe('A year-long battery state-of-charge simulation for a solar powered ' +
           'station, with an itemised daily load, a monthly energy balance table, and ' +
           'a pass or fail verdict naming the month it fails.');
}

// ---- the model -----------------------------------------------------------

function activeLoads() {
  return LOADS.filter(l => !l.radio || l.radio === radio);
}
function grossDaily() {
  let t = 0;
  for (const l of activeLoads()) t += l.ma * l.h;
  return t;
}
function savings() {
  let t = 0;
  for (const d of DUTY) if (duty[d.id]) t += d.save();
  return t;
}
function dailyMah() { return Math.max(60, grossDaily() - savings()); }

function ctrlFactor() { return controller === 'MPPT' ? 1.15 : 1.0; }
function usableFrac() { return chem === 'Lithium' ? 0.80 : 0.50; }

// Battery capacity falls in the cold. 100% at 20 C, about 75% at 0 C.
function tempFactor(tC) {
  if (!coldDerate) return 1;
  return constrain(1 - (20 - tC) * 0.0125, 0.55, 1);
}

function collectedMah(monthIdx, cloudFactor) {
  const ins = SITES[site].ins[monthIdx] * (cloudFactor === undefined ? 1 : cloudFactor);
  const wh = panelW * ins * ETA * ctrlFactor();
  return wh * 1000 / VOLTS;
}

// Day-by-day simulation with the state of charge carried forward.
function simulate() {
  const s = SITES[site];
  const out = [];
  const monthly = [];
  let soc = battMah * usableFrac();      // built in spring, battery full
  let badMonth = worstMonth();
  let day = 0;
  let firstFail = null;
  for (let mi = 0; mi < 12; mi++) {
    const m = (START_MONTH + mi) % 12;
    const cap = battMah * usableFrac() * tempFactor(s.tmp[m]);
    let coll = 0, cons = 0;
    const socStart = soc;
    for (let d = 0; d < MDAYS[m]; d++) {
      let cf = 1;
      if (badWeek && m === badMonth && d >= 8 && d < 15) cf = 0.25;
      const c = collectedMah(m, cf);
      const u = dailyMah();
      coll += c; cons += u;
      soc = Math.min(cap, soc + c - u);
      if (soc <= 0) { soc = 0; if (firstFail === null) firstFail = { m: m, mi: mi, d: d }; }
      out.push({ day: day++, soc: soc, cap: cap, m: m, bad: cf < 1 });
    }
    monthly.push({ m: m, mi: mi, ins: s.ins[m], tmp: s.tmp[m], coll: coll / MDAYS[m],
                   cons: cons / MDAYS[m], net: (coll - cons) / MDAYS[m],
                   socStart: socStart, socEnd: soc, cap: cap });
  }
  return { days: out, monthly: monthly, fail: firstFail, badMonth: badMonth };
}

function worstMonth() {
  const s = SITES[site];
  let w = 0;
  for (let m = 1; m < 12; m++) if (s.ins[m] < s.ins[w]) w = m;
  return w;
}

function autonomyDays(monthIdx) {
  const s = SITES[site];
  const cap = battMah * usableFrac() * tempFactor(s.tmp[monthIdx]);
  return cap / dailyMah();
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 28;
  const w = canvasWidth - 2 * margin;
  if (isNarrow()) {
    socBox = { x: margin, y: top, w: w, h: 128 };
    const half = (w - 6) / 2;
    loadBox = { x: margin, y: top + 133, w: half, h: 176 };
    tabBox = { x: margin + half + 6, y: top + 133, w: half, h: 176 };
    verBox = { x: margin, y: top + 314, w: w, h: drawHeight - (top + 314) - 6 };
  } else {
    socBox = { x: margin, y: top, w: w, h: 164 };
    const lw = Math.round(w * 0.44);
    loadBox = { x: margin, y: top + 170, w: lw, h: 200 };
    tabBox = { x: margin + lw + 8, y: top + 170, w: w - lw - 8, h: 200 };
    verBox = { x: margin, y: top + 376, w: w, h: drawHeight - (top + 376) - 6 };
  }
}

function layoutControls() {
  layout();
  const y0 = drawHeight + 6;
  const narrow = isNarrow();
  panelSelect.position(margin + 40, y0);
  battSelect.position(margin + 176, y0);
  chemSelect.position(margin + 330, y0);
  if (narrow) {
    ctrlSelect.position(margin + 70, y0 + 26);
    radioSelect.position(margin + 200, y0 + 26);
    siteSelect.position(margin + 40, y0 + 52);
  } else {
    ctrlSelect.position(margin + 526, y0);
    radioSelect.position(margin + 650, y0);
    siteSelect.position(margin + 40, y0 + 28);
  }
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(21);
  text('Power Budget Calculator', canvasWidth / 2, 1);
  const sim = simulate();
  drawSoc(sim);
  drawLoad();
  drawTable(sim);
  drawVerdict(sim);
  drawControlRegion();
}

function drawSoc(sim) {
  const b = socBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('battery state of charge from ' + MONTHS[START_MONTH] +
       ', one year, carried forward day by day', b.x + 8, b.y + 4);
  const capMax = battMah * usableFrac();
  textAlign(RIGHT, TOP);
  text('0 to ' + Math.round(capMax).toLocaleString('en-US') + ' mAh usable',
       b.x + b.w - 8, b.y + 4);

  const L = b.x + 30, R = b.x + b.w - 8, T = b.y + 18, B = b.y + b.h - 16;
  const px = d => L + d / 364 * (R - L);
  const py = v => B - constrain(v / Math.max(1, capMax), 0, 1) * (B - T);

  // the danger band: anything at or near empty
  noStroke(); fill(198, 40, 40, 30);
  rect(L, py(capMax * 0.15), R - L, B - py(capMax * 0.15));
  fill('#b71c1c'); textSize(8); textAlign(LEFT, BOTTOM);
  text('below 15% reserve', L + 3, B - 1);

  // month gridlines
  let acc = 0;
  stroke('#eef2f6'); strokeWeight(1);
  for (let mi = 0; mi < 12; mi++) {
    acc += MDAYS[(START_MONTH + mi) % 12];
    line(px(acc), T, px(acc), B);
  }
  noStroke(); fill('#90a4ae'); textSize(8); textAlign(CENTER, TOP);
  acc = 0;
  for (let mi = 0; mi < 12; mi++) {
    const m = (START_MONTH + mi) % 12;
    text(MONTHS[m][0], px(acc + MDAYS[m] / 2), B + 2);
    acc += MDAYS[m];
  }
  textAlign(RIGHT, CENTER);
  text('full', L - 3, T);
  text('empty', L - 3, B);

  // the bad week, if inserted
  if (badWeek) {
    const bd = sim.days.filter(d => d.bad);
    if (bd.length) {
      noStroke(); fill(106, 27, 154, 46);
      rect(px(bd[0].day), T, Math.max(2, px(bd[bd.length - 1].day) - px(bd[0].day)), B - T);
      fill('#6a1b9a'); textSize(8); textAlign(CENTER, TOP);
      text('bad week', px((bd[0].day + bd[bd.length - 1].day) / 2), T + 1);
    }
  }

  // the usable-capacity ceiling, which itself moves with temperature
  stroke('#b0bec5'); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  noFill(); beginShape();
  for (const d of sim.days) vertex(px(d.day), py(d.cap));
  endShape();
  drawingContext.setLineDash([]);

  stroke('#1565c0'); strokeWeight(2); noFill();
  beginShape();
  for (const d of sim.days) vertex(px(d.day), py(d.soc));
  endShape();

  if (sim.fail) {
    let fd = 0;
    for (let k = 0; k < sim.fail.mi; k++) fd += MDAYS[(START_MONTH + k) % 12];
    fd += sim.fail.d;
    stroke('#b71c1c'); strokeWeight(1.6);
    line(px(fd), T, px(fd), B);
    noStroke(); fill('#b71c1c'); textSize(9); textAlign(CENTER, BOTTOM);
    const lab = 'dead ' + MONTHS[sim.fail.m] + ' ' + (sim.fail.d + 1);
    text(lab, constrain(px(fd), L + 26, R - 26), T + 12);
  }
}

function drawLoad() {
  const b = loadBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('daily consumption, itemised', b.x + 8, b.y + 4);
  const L = b.x + 8, W = b.w - 16;
  let y = b.y + 18;
  textFont(MONO); textSize(8.6);
  for (const l of activeLoads()) {
    if (y + 11 > b.y + b.h - 44) break;
    fill('#546e7a'); textAlign(LEFT, TOP);
    let nm = l.name;
    while (textWidth(nm) > W - 96 && nm.length > 6) nm = nm.slice(0, -2) + '…';
    text(nm, L, y);
    fill('#78909c'); textAlign(RIGHT, TOP);
    text(l.ma + ' mA x ' + l.h + ' h', L + W - 54, y);
    fill('#0d2b45');
    text(Math.round(l.ma * l.h).toLocaleString('en-US'), L + W, y);
    y += 11;
  }
  y += 2;
  stroke('#dfe6ec'); strokeWeight(1); line(L, y, L + W, y); noStroke();
  y += 3;
  fill('#37474f'); textAlign(LEFT, TOP);
  text('gross', L, y);
  textAlign(RIGHT, TOP); fill('#0d2b45');
  text(Math.round(grossDaily()).toLocaleString('en-US') + ' mAh', L + W, y);
  y += 11;
  const sv = savings();
  fill(sv ? '#1b5e20' : '#8a97a4'); textAlign(LEFT, TOP);
  text('duty cycling saves', L, y);
  textAlign(RIGHT, TOP);
  text('-' + Math.round(sv).toLocaleString('en-US') + ' mAh', L + W, y);
  y += 12;
  textFont('Arial'); textSize(12); textStyle(BOLD);
  fill('#0d2b45'); textAlign(LEFT, TOP);
  text('net ' + Math.round(dailyMah()).toLocaleString('en-US') + ' mAh/day', L, y);
  textStyle(NORMAL);
  y += 16;
  textSize(9); fill('#78909c'); textAlign(LEFT, TOP);
  const wm = worstMonth();
  para(L, y, W, 'Autonomy with no sun at all: ' + autonomyDays(wm).toFixed(1) +
       ' days in ' + MONTHS[wm] + (coldDerate ? ', after cold derating' : '') +
       '. Aim for three, five if your winters are overcast.', 10.5, 9);
}

function drawTable(sim) {
  const b = tabBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('monthly balance, mAh per day', b.x + 8, b.y + 4);
  textAlign(RIGHT, TOP); fill('#78909c');
  text(panelW + ' W x insolation x ' + ETA +
       (controller === 'MPPT' ? ' x 1.15 MPPT' : ''), b.x + b.w - 8, b.y + 4);
  const L = b.x + 8, W = b.w - 16;
  const cols = [0, 0.30, 0.48, 0.66, 0.84];
  const hdr = ['', 'kWh/m2', 'in', 'out', 'net'];
  let y = b.y + 17;
  textFont(MONO); textSize(8.4);
  fill('#8a97a4');
  for (let i = 0; i < hdr.length; i++) {
    textAlign(i === 0 ? LEFT : RIGHT, TOP);
    text(hdr[i], L + cols[i] * W + (i === 0 ? 0 : W * 0.16), y);
  }
  y += 10;
  const rowH = Math.min(12, (b.y + b.h - y - 6) / 12);
  for (const r of sim.monthly) {
    const dead = r.socEnd <= 0;
    noStroke(); fill(dead ? '#fdeeee' : (r.net < 0 ? '#fff8e1' : '#ffffff'));
    rect(L, y - 1, W, rowH);
    fill(r.m === sim.badMonth ? '#0d47a1' : '#37474f'); textAlign(LEFT, TOP);
    text(MONTHS[r.m], L, y);
    fill('#78909c'); textAlign(RIGHT, TOP);
    text(r.ins.toFixed(1), L + cols[1] * W + W * 0.16, y);
    fill('#1b5e20');
    text(Math.round(r.coll).toLocaleString('en-US'), L + cols[2] * W + W * 0.16, y);
    fill('#b71c1c');
    text(Math.round(r.cons).toLocaleString('en-US'), L + cols[3] * W + W * 0.16, y);
    fill(r.net >= 0 ? '#1b5e20' : '#b71c1c');
    text((r.net >= 0 ? '+' : '') + Math.round(r.net).toLocaleString('en-US'),
         L + cols[4] * W + W * 0.16, y);
    y += rowH;
  }
  textFont('Arial');
}

function drawVerdict(sim) {
  const b = verBox;
  const fail = sim.fail;
  noStroke(); fill(fail ? '#fdeeee' : '#e8f5e9');
  stroke(fail ? '#ef9a9a' : '#a5d6a7'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 10, W = b.w - 20;
  let y = b.y + 6;
  fill(fail ? '#b71c1c' : '#1b5e20'); textAlign(LEFT, TOP);
  textSize(13); textStyle(BOLD);
  text(fail ? 'FAILS in ' + MONTHS[fail.m] : 'Survives the whole year', L, y);
  textStyle(NORMAL);
  y += 18;
  textSize(10); fill('#33475b');

  const neg = sim.monthly.filter(m => m.net < 0).map(m => MONTHS[m.m]);
  const pos = sim.monthly.filter(m => m.net >= 0).map(m => MONTHS[m.m]);
  let msg;
  if (fail) {
    msg = 'The battery reaches empty on ' + MONTHS[fail.m] + ' ' + (fail.d + 1) +
          '. This design works in ' + (pos.length ? pos[0] + ' to ' + pos[pos.length - 1]
          : 'no month') + ' and fails in ' + MONTHS[fail.m] +
          '. A station built and tested in spring will die in autumn.';
  } else if (neg.length) {
    msg = 'Every month is survived, but ' + neg.length + ' month' +
          (neg.length === 1 ? '' : 's') + ' run at a deficit (' + neg.join(', ') +
          ') and are paid for out of the battery. The margin comes from the ' +
          'surplus banked earlier in the year.';
  } else {
    msg = 'Every month collects more than it consumes, so the battery never has to ' +
          'carry the station. This is a design with real margin in it.';
  }
  y = para(L, y, W, msg, 11.5, 10) + 4;

  const sv = savings();
  if (sv > 0) {
    fill('#1b5e20'); textSize(9.8);
    const frac = sv / grossDaily() * 100;
    para(L, y, W, 'Duty cycling is carrying ' + Math.round(frac) + ' per cent of this ' +
         'budget - ' + Math.round(sv).toLocaleString('en-US') + ' mAh a day that cost ' +
         'nothing in hardware.', 11, 9.8);
  } else {
    fill('#e65100'); textSize(9.8);
    para(L, y, W, 'No duty cycling enabled. Before buying a bigger panel, try the ' +
         'checkboxes below: the cheapest fix is almost always software.', 11, 9.8);
  }
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 6;
  const narrow = isNarrow();
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(10.5);
  text('Panel', margin, y0 + 11);
  text('Battery', margin + 124, y0 + 11);
  text('Cells', margin + 292, y0 + 11);
  text('Controller', narrow ? margin : margin + 462, (narrow ? y0 + 26 : y0) + 11);
  text('Radio', narrow ? margin + 156 : margin + 610, (narrow ? y0 + 26 : y0) + 11);
  text('Site', margin, (narrow ? y0 + 52 : y0 + 28) + 11);

  chipHits = [];
  let y2 = narrow ? y0 + 80 : y0 + 56;
  fill('#0d2b45'); textAlign(LEFT, TOP); textSize(10);
  text('Duty cycling', margin, y2);
  y2 += 13;
  let x = margin;
  for (const d of DUTY) {
    textSize(10);
    const w = textWidth(d.name) + 14;
    if (x + w > canvasWidth - margin) { x = margin; y2 += 23; }
    chipSm(x, y2, d.name, !!duty[d.id]);
    x += w + 4;
  }
  y2 += 27;
  x = margin;
  x = chip(x, y2, coldDerate ? 'Cold derating on' : 'Cold derating off', coldDerate) + 6;
  x = chip(x, y2, badWeek ? 'Bad week inserted' : 'Insert a bad week', badWeek) + 6;
  chip(x, y2, 'All duty cycling', false);

  if (coldDerate) {
    const wm = worstMonth();
    fill('#b71c1c'); textAlign(LEFT, TOP); textSize(9.3);
    text('Winter takes your solar input and your battery capacity at the same time: ' +
         Math.round(tempFactor(SITES[site].tmp[wm]) * 100) + ' per cent of rated ' +
         'capacity at ' + SITES[site].tmp[wm] + ' C.', margin, y2 + 27);
  }
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

function chipSm(x, y, label, on) {
  textSize(10); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 14;
  const h = 20;
  noStroke(); fill(on ? '#1565c0' : '#eef2f6');
  stroke(on ? '#0d47a1' : '#c3ced8'); strokeWeight(1);
  rect(x, y, w, h, 4);
  noStroke(); fill(on ? '#ffffff' : '#37474f');
  text(label, x + w / 2, y + h / 2 + 1);
  chipHits.push({ x: x, y: y, w: w, h: h, label: 'duty:' + label });
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
  return true;
}

function onChip(label) {
  if (label.indexOf('duty:') === 0) {
    const nm = label.slice(5);
    const d = DUTY.find(x => x.name === nm);
    if (d) duty[d.id] = !duty[d.id];
    return;
  }
  if (label === 'All duty cycling') {
    const all = DUTY.every(d => duty[d.id]);
    for (const d of DUTY) duty[d.id] = !all;
  } else if (label.indexOf('Cold derating') === 0) coldDerate = !coldDerate;
  else badWeek = !badWeek;
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
  let ln = '';
  for (const w of words) {
    const trial = ln.length ? ln + ' ' + w : w;
    if (textWidth(trial) > maxW && ln.length) { out.push(ln); ln = w; }
    else ln = trial;
  }
  out.push(ln);
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
