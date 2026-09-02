// Timestamp Trouble Simulator MicroSim
// CANVAS_HEIGHT: 550
// Bloom Level: Evaluate (L5) - the learner critiques four timestamp formats
// against identical data and judges which failures can be repaired.
// Every reading is stored internally as a true UTC instant and rendered through
// a format function, so the underlying data is provably the same in all four
// views. That is what makes the format the only possible cause of any failure.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 700;

// ---- controls ----
let formatSelect, scenarioSelect;
let logButton, logAllButton, sortButton, resetButton;

// ---- state ----
let shown = 0;            // how many readings have been logged
let sorted = false;

// ---- civil time, computed here rather than trusting the host time zone -----

function daysFromCivil(y, m, d) {
  y -= m <= 2 ? 1 : 0;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

function civilFromDays(z) {
  z += 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) -
                          Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp + (mp < 10 ? 3 : -9);
  return { y: y + (m <= 2 ? 1 : 0), m: m, d: d };
}

function utcOf(y, mo, d, h, mi) {
  return daysFromCivil(y, mo, d) * 86400 + h * 3600 + mi * 60;
}

function breakDown(sec) {
  const days = Math.floor(sec / 86400);
  const rem = sec - days * 86400;
  const c = civilFromDays(days);
  return { y: c.y, mo: c.m, d: c.d,
           h: Math.floor(rem / 3600), mi: Math.floor((rem % 3600) / 60), s: rem % 60 };
}

// 2026 transitions, from the standard rules
const PAC_DST_START = utcOf(2026, 3, 8, 10, 0);    // 02:00 PST -> 03:00 PDT
const PAC_DST_END   = utcOf(2026, 11, 1, 9, 0);    // 02:00 PDT -> 01:00 PST
const BER_DST_START = utcOf(2026, 3, 29, 1, 0);
const BER_DST_END   = utcOf(2026, 10, 25, 1, 0);

const ZONES = {
  pacific: function (utc) {
    const dst = utc >= PAC_DST_START && utc < PAC_DST_END;
    return { off: dst ? -7 * 3600 : -8 * 3600, abbr: dst ? 'PDT' : 'PST', name: 'Los Angeles' };
  },
  berlin: function (utc) {
    const dst = utc >= BER_DST_START && utc < BER_DST_END;
    return { off: dst ? 2 * 3600 : 1 * 3600, abbr: dst ? 'CEST' : 'CET', name: 'Berlin' };
  }
};

// ---- formats ------------------------------------------------------------

const FORMATS = ['US style', 'European style', 'Local time with zone', 'ISO 8601 UTC'];

function render(r, fmt) {
  const z = ZONES[r.zone](r.utc);
  const L = breakDown(r.utc + z.off);
  const U = breakDown(r.utc);
  const yy = nf(L.y % 100, 2);
  if (fmt === 'US style') {
    const ampm = L.h < 12 ? 'AM' : 'PM';
    let h12 = L.h % 12; if (h12 === 0) h12 = 12;
    return L.mo + '/' + L.d + '/' + yy + ' ' + h12 + ':' + nf(L.mi, 2) + ' ' + ampm;
  }
  if (fmt === 'European style') {
    return L.d + '/' + L.mo + '/' + yy + ' ' + nf(L.h, 2) + ':' + nf(L.mi, 2);
  }
  if (fmt === 'Local time with zone') {
    return L.y + '-' + nf(L.mo, 2) + '-' + nf(L.d, 2) + ' ' + nf(L.h, 2) + ':' +
           nf(L.mi, 2) + ' ' + z.abbr;
  }
  return U.y + '-' + nf(U.mo, 2) + '-' + nf(U.d, 2) + 'T' + nf(U.h, 2) + ':' +
         nf(U.mi, 2) + ':' + nf(U.s, 2) + 'Z';
}

// ---- scenarios ----------------------------------------------------------
// Readings are UTC instants. Nothing below ever stores a local time.

function series(y, mo, d, startH, startMi, count, stepMin, zone, vals) {
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({ utc: utcOf(y, mo, d, startH, startMi) + i * stepMin * 60,
               zone: zone, val: vals[i % vals.length] });
  }
  return out;
}

const PRESSURES = [1013.2, 1013.0, 1012.7, 1012.5, 1012.6, 1012.9, 1013.1, 1013.4];

const SCENARIOS = {
  'Ordinary day': {
    readings: series(2026, 8, 25, 20, 0, 6, 30, 'pacific', PRESSURES),
    twoStation: false
  },
  'Clocks go back': {
    readings: series(2026, 11, 1, 7, 30, 6, 30, 'pacific', PRESSURES),
    twoStation: false
  },
  'Clocks go forward': {
    readings: series(2026, 3, 8, 9, 0, 5, 30, 'pacific', PRESSURES),
    twoStation: false
  },
  'Two stations': {
    readings: (function () {
      const out = [];
      for (let i = 0; i < 6; i++) {
        out.push({ utc: utcOf(2026, 8, 25, 20, 0) + i * 15 * 60,
                   zone: i % 2 === 0 ? 'pacific' : 'berlin',
                   val: PRESSURES[i] });
      }
      return out;
    })(),
    twoStation: true
  },
  'Ambiguous date': {
    readings: [
      { utc: utcOf(2026, 8, 5, 14, 0), zone: 'pacific', val: 1013.2 },
      { utc: utcOf(2026, 5, 8, 14, 0), zone: 'pacific', val: 1009.6 }
    ],
    twoStation: false
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  formatSelect = createSelect();
  FORMATS.forEach(function (f) { formatSelect.option(f); });
  formatSelect.selected('US style');
  formatSelect.changed(function () { sorted = false; });

  scenarioSelect = createSelect();
  Object.keys(SCENARIOS).forEach(function (k) { scenarioSelect.option(k); });
  scenarioSelect.selected('Ordinary day');
  scenarioSelect.changed(function () { shown = 0; sorted = false; });

  logButton = createButton('Log a reading');
  logButton.mousePressed(function () {
    shown = min(shown + 1, currentReadings().length);
    sorted = false;
  });
  logAllButton = createButton('Log all');
  logAllButton.mousePressed(function () { shown = currentReadings().length; sorted = false; });
  sortButton = createButton('Sort the log');
  sortButton.mousePressed(function () { sorted = true; });
  resetButton = createButton('Reset');
  resetButton.mousePressed(function () { shown = 0; sorted = false; });

  layoutControls();

  describe('The same logged readings rendered in four timestamp formats. Choosing a ' +
           'scenario runs those readings through a daylight saving transition, across ' +
           'two countries, or onto an ambiguous date, and a verdict panel says what has ' +
           'gone wrong and whether the information can be recovered. A sort button ' +
           'orders the log by plain text comparison, which only ISO 8601 survives.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 44;
  const r3 = drawHeight + 80;
  formatSelect.position(72, r1);
  formatSelect.size(160);
  scenarioSelect.position(84, r2);
  scenarioSelect.size(160);
  logButton.position(10, r3);
  logAllButton.position(115, r3);
  sortButton.position(185, r3);
  resetButton.position(280, r3);
}

function currentReadings() { return SCENARIOS[scenarioSelect.value()].readings; }

// The rows as the learner sees them, in the order the learner sees them.
function rows() {
  const fmt = formatSelect.value();
  const rs = currentReadings().slice(0, shown);
  const out = rs.map(function (r, i) {
    return { n: i + 1, text: render(r, fmt), val: r.val,
             zone: ZONES[r.zone](r.utc).name, utc: r.utc };
  });
  // sorting is a literal string comparison, exactly as a naive script would do
  if (sorted) out.sort(function (a, b) { return a.text < b.text ? -1 : (a.text > b.text ? 1 : 0); });
  return out;
}

function duplicateTexts(rs) {
  const seen = {};
  const dup = {};
  for (let i = 0; i < rs.length; i++) {
    if (seen[rs[i].text]) dup[rs[i].text] = true;
    seen[rs[i].text] = true;
  }
  return dup;
}

function outOfOrder(rs) {
  for (let i = 1; i < rs.length; i++) if (rs[i].utc < rs[i - 1].utc) return true;
  return false;
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
  textSize(narrow ? 17 : 23);
  text('Timestamp Trouble', canvasWidth / 2, narrow ? 8 : 6);

  let tableB, verdictB;
  if (narrow) {
    tableB = { x: margin, y: 34, w: canvasWidth - 2 * margin, h: 196 };
    verdictB = { x: margin, y: 238, w: canvasWidth - 2 * margin, h: drawHeight - 250 };
  } else {
    const tw = floor(canvasWidth * 0.52);
    tableB = { x: margin, y: 40, w: tw - margin, h: drawHeight - 54 };
    verdictB = { x: tw + 8, y: 40, w: canvasWidth - margin - tw - 8, h: drawHeight - 54 };
  }

  const rs = rows();
  drawTable(tableB, rs, narrow);
  drawVerdict(verdictB, rs, narrow);
  drawControlLabels();
}

function drawTable(box, rs, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const twoStation = SCENARIOS[scenarioSelect.value()].twoStation;
  const dup = duplicateTexts(rs);
  const z = narrow ? 10 : 11;
  let y = box.y + 8;

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('The log' + (sorted ? '  (sorted as plain text)' : ''), box.x + 10, y);
  y += 17;

  fill('#90a4ae');
  textSize(z - 1);
  text('#', box.x + 10, y);
  text('timestamp', box.x + 28, y);
  textAlign(RIGHT, TOP);
  text('hPa', box.x + box.w - 10, y);
  y += z + 3;
  stroke('#eceff1');
  line(box.x + 8, y - 2, box.x + box.w - 8, y - 2);
  noStroke();

  if (rs.length === 0) {
    fill('#90a4ae');
    textAlign(LEFT, TOP);
    textSize(z);
    text('Nothing logged yet. Press Log a reading.', box.x + 10, y + 4);
    return;
  }

  for (let i = 0; i < rs.length; i++) {
    const r = rs[i];
    const bad = !!dup[r.text];
    if (bad) {
      fill('#ffebee');
      rect(box.x + 6, y - 2, box.w - 12, z + 6, 2);
    }
    fill(bad ? '#b71c1c' : '#90a4ae');
    textAlign(LEFT, TOP);
    textSize(z - 1);
    text(r.n, box.x + 10, y);
    fill(bad ? '#b71c1c' : '#212121');
    textSize(z);
    text(r.text, box.x + 28, y);
    fill('#546e7a');
    textAlign(RIGHT, TOP);
    textSize(z - 1);
    text(nf(r.val, 1, 1), box.x + box.w - 10, y);
    if (twoStation) {
      textAlign(LEFT, TOP);
      fill('#7b1fa2');
      textSize(z - 2);
      text(r.zone, box.x + box.w - 108, y + 1);
    }
    y += z + 6;
  }

  if (sorted) {
    const scrambled = outOfOrder(rs);
    fill(scrambled ? '#b71c1c' : '#1b5e20');
    textAlign(LEFT, TOP);
    textSize(z);
    text(scrambled ? 'Sorted alphabetically, and now out of chronological order.'
                   : 'Sorted alphabetically, and still in chronological order.',
         box.x + 10, y + 4);
  }
}

// ---- the verdict --------------------------------------------------------

function verdictFor(scenario, fmt, rs) {
  const iso = fmt === 'ISO 8601 UTC';
  const localish = fmt === 'US style' || fmt === 'European style';

  if (scenario === 'Ordinary day') {
    return { head: 'Nothing is wrong yet.',
             body: 'Every format reads fine on an ordinary day. This is exactly why the ' +
                   'problem goes unnoticed until the day it does not.',
             sev: 'ok' };
  }

  if (scenario === 'Clocks go back') {
    if (iso) {
      return { head: 'No problem here.',
               body: 'UTC does not go backwards. The two readings an hour apart in local ' +
                     'time are an hour apart here too, and every timestamp is distinct.',
               sev: 'ok' };
    }
    return { head: 'Information destroyed.',
             body: 'Two readings share a timestamp. They cannot be sorted, and the interval ' +
                   'between them cannot be computed. Nothing in the file records which one ' +
                   'came first, so this is not a bug you can fix later - the information was ' +
                   'never written down.' +
                   (fmt === 'Local time with zone'
                     ? ' The zone abbreviation looks like it should save you, and on this ' +
                       'transition it happens to differ. Many loggers write the same ' +
                       'abbreviation for both hours, and then it does not.'
                     : ''),
             sev: 'bad' };
  }

  if (scenario === 'Clocks go forward') {
    if (iso) {
      return { head: 'No gap.',
               body: 'The readings are evenly spaced in UTC because they were evenly spaced ' +
                     'in reality. An hour of local time went missing; no data did.',
               sev: 'ok' };
    }
    return { head: 'A gap that is not a fault.',
             body: 'An hour of local time never happened, so the log shows a one-hour hole. ' +
                   'This looks exactly like a hardware failure. A student debugging it will ' +
                   'search for a fault that does not exist. Recoverable, once you know - but ' +
                   'you have to know.',
             sev: 'warn' };
  }

  if (scenario === 'Two stations') {
    if (iso) {
      return { head: 'Merges by simple sort.',
               body: 'Both stations wrote UTC, so the two series interleave correctly with ' +
                     'no conversion at all. Sort and you are done.',
               sev: 'ok' };
    }
    return { head: 'Cannot be merged as written.',
             body: 'Los Angeles and Berlin are nine hours apart today and eight hours apart ' +
                   'in a fortnight. Merging these into one ordered series needs a per-reading ' +
                   'conversion that depends on the date. Recoverable, but only if you know ' +
                   'which station each row came from and which rules applied that day.',
             sev: 'warn' };
  }

  // Ambiguous date
  if (iso) {
    return { head: 'Unambiguous.',
             body: 'Year, then month, then day, in fixed-width fields. 2026-08-05 and ' +
                   '2026-05-08 can never be confused for one another.',
             sev: 'ok' };
  }
  if (localish) {
    return { head: 'Which date is this?',
             body: 'These two readings are four months apart. In this format they render as ' +
                   '8/5/26 and 5/8/26 - the same two strings a reader of the other convention ' +
                   'would produce for the opposite dates. Nothing in the file says which ' +
                   'convention was used. Unrecoverable without outside knowledge.',
             sev: 'bad' };
  }
  return { head: 'Unambiguous, but still local.',
           body: 'Year-month-day removes the date ambiguity. The time is still local, so the ' +
                 'other three problems remain.',
           sev: 'warn' };
}

function drawVerdict(box, rs, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const scenario = scenarioSelect.value();
  const fmt = formatSelect.value();
  const v = verdictFor(scenario, fmt, rs);
  const col = v.sev === 'ok' ? '#1b5e20' : (v.sev === 'warn' ? '#e65100' : '#b71c1c');
  const inner = box.w - 20;
  const z = narrow ? 11 : 12;
  let y = box.y + 8;

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Verdict', box.x + 10, y);
  y += 17;

  fill(col);
  textSize(narrow ? 14 : 16);
  const hl = wrapText(v.head, inner, narrow ? 14 : 16);
  text(hl, box.x + 10, y);
  y += hl.split('\n').length * ((narrow ? 14 : 16) + 4) + 4;

  fill('#37474f');
  textSize(z);
  const bl = wrapText(v.body, inner, z);
  text(bl, box.x + 10, y);
  y += bl.split('\n').length * (z + 3) + 8;

  if (sorted) {
    fill('#0d47a1');
    textSize(z);
    const sl = wrapText('ISO 8601 sorts correctly as plain text because its fields run ' +
                        'largest to smallest with fixed widths. That is a design feature, ' +
                        'not luck.', inner, z);
    text(sl, box.x + 10, y);
    y += sl.split('\n').length * (z + 3) + 6;
  }

  if (box.y + box.h - y > 30) {
    fill('#78909c');
    textSize(10);
    text(wrapText('Every scenario logs the same instants. Only the way they are written ' +
                  'down changes.', inner, 10), box.x + 10, box.y + box.h - 30);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Format:', 10, drawHeight + 22);
  text('Scenario:', 10, drawHeight + 58);
  fill('#546e7a');
  textSize(11);
  const total = currentReadings().length;
  text(shown + ' of ' + total + ' logged', 340, drawHeight + 94);
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
