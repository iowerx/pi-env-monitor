// Anatomy of a Good Data File MicroSim
// CANVAS_HEIGHT: 668
// Bloom Level: Evaluate (L5) - the learner critiques real data files against a
// usability standard, names the one omission that makes each unusable, and then
// repairs it.
// Students believe their own data is self-explanatory because they remember the
// context. The only way to break that belief is to hand them somebody else's
// file and ask a question they cannot answer. Each file here is broken in
// exactly one way, so the diagnosis is never ambiguous.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 168;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 760;
const MONO = 'monospace';

// The seven questions metadata has to answer. Six come from the chapter's list;
// the seventh, an unambiguous time base, is what file 3 exists to demonstrate.
const CHECKS = [
  { id: 'where',  q: 'Where was this measured?' },
  { id: 'height', q: 'How high is the station?' },
  { id: 'sensor', q: 'What sensor was it, and how accurate?' },
  { id: 'shield', q: 'Was it shielded and ventilated?' },
  { id: 'datum',  q: 'Station pressure or corrected to sea level?' },
  { id: 'cal',    q: 'Has it been calibrated, when, against what?' },
  { id: 'time',   q: 'What time base, unambiguously?' }
];

// ---- the six files -------------------------------------------------------

const FILES = [
  {
    name: 'readings-a.csv',
    lines: ['2026-08-25T14:30:00Z,21.4,1013.2,62.3',
            '2026-08-25T14:35:00Z,21.6,1013.1,61.8',
            '2026-08-25T14:40:00Z,21.9,1013.0,61.2',
            '2026-08-25T14:45:00Z,22.1,1012.9,60.9',
            '2026-08-25T14:50:00Z,22.4,1012.8,60.4',
            '2026-08-25T14:55:00Z,22.6,1012.8,60.0',
            '2026-08-25T15:00:00Z,22.8,1012.7,59.6'],
    meta: null,
    fault: 'No header row',
    question: 'What is the third column?',
    options: ['Pressure in hPa', 'Humidity as a percentage',
              'Cannot be determined from this file', 'Temperature in Fahrenheit'],
    correct: 2,
    diag: 'There is no header row, so the columns have no names. 1013.2 looks like ' +
          'pressure to you because you already know what a station measures. A reader ' +
          'who does not is guessing, and a program reading it is guessing too.',
    fix: 'Add a header row naming every column and its unit.',
    satisfies: []
  },
  {
    name: 'readings-b.csv',
    lines: ['time,temp,press,hum',
            '2026-08-25T14:30:00Z,21.4,995.0,62.3',
            '2026-08-25T14:35:00Z,21.6,994.6,61.8',
            '2026-08-25T14:40:00Z,21.9,994.1,61.2',
            '2026-08-25T14:45:00Z,22.1,993.7,60.9',
            '2026-08-25T14:50:00Z,22.4,993.2,60.4',
            '2026-08-25T14:55:00Z,22.6,992.8,60.0'],
    meta: null,
    fault: 'Header with no units',
    question: 'Is this station experiencing a storm?',
    options: ['Yes, 995 hPa is a deep low', 'No, this is normal',
              'Cannot be determined from this file', 'Yes, the pressure is falling fast'],
    correct: 2,
    diag: '995 could be a genuine storm at sea level, or a perfectly ordinary day at ' +
          '150 m elevation reported as station pressure. Chapter 7 showed those differ ' +
          'by tens of hectopascals. Without the unit and without the elevation and ' +
          'datum, the number cannot be interpreted at all.',
    fix: 'Name the unit in the header, and record elevation and pressure datum in metadata.',
    satisfies: []
  },
  {
    name: 'readings-c.csv',
    lines: ['timestamp,temperature_c,pressure_hpa,humidity_pct',
            '2026-11-01T01:15:00,13.9,1016.2,71.0',
            '2026-11-01T01:30:00,13.6,1016.3,71.4',
            '2026-11-01T01:45:00,13.4,1016.3,71.9',
            '2026-11-01T01:00:00,12.8,1016.5,73.1',
            '2026-11-01T01:15:00,12.6,1016.6,73.6',
            '2026-11-01T01:30:00,12.4,1016.7,74.0'],
    meta: { where: 1, height: 1, sensor: 1, shield: 1, datum: 1, cal: 1, time: 0 },
    fault: 'Local timestamps across a DST change',
    question: 'How much did the temperature change between the two rows stamped 01:30?',
    options: ['It fell 1.2 C in 15 minutes', 'It fell 1.2 C in one hour and 15 minutes',
              'Cannot be determined from this file', 'It rose 1.2 C'],
    correct: 2,
    diag: 'Two rows are stamped 01:30 and the timestamps go backwards in between. ' +
          'Daylight saving ended and the local clock repeated an hour. Nothing in the ' +
          'file says which 01:30 is which, so the interval between them is unknown. ' +
          'Chapter 5 made this point; here is the file it ruins.',
    fix: 'Record timestamps in UTC with an explicit Z, as ISO 8601.',
    satisfies: ['where', 'height', 'sensor', 'shield', 'datum', 'cal']
  },
  {
    name: 'readings-d.csv',
    lines: ['timestamp,temperature_c,pressure_hpa,humidity_pct',
            '2026-08-25T14:30:00Z,21.4,995.1,62.3',
            '2026-08-25T14:35:00Z,21.6,995.0,61.8',
            '2026-08-25T14:40:00Z,21.9,994.9,61.2',
            '2026-08-25T14:45:00Z,22.1,994.8,60.9',
            '2026-08-25T14:50:00Z,22.4,994.8,60.4',
            '2026-08-25T14:55:00Z,22.6,994.7,60.0'],
    meta: null,
    fault: 'No metadata file at all',
    question: 'Can this be compared with the station 5 km away, which reads 1013 hPa?',
    options: ['Yes, the difference is 18 hPa', 'No, one of them must be broken',
              'Cannot be determined from this file', 'Yes, if both use the same sensor'],
    correct: 2,
    diag: 'The header and the units are fine and the timestamps are proper UTC. But ' +
          'with no elevation you cannot tell whether an 18 hPa difference is weather ' +
          'or 150 m of hill. Two stations are only comparable once both report their ' +
          'elevation and whether the value is station or sea-level pressure.',
    fix: 'Write a metadata file: location, elevation, datum, sensor, exposure, calibration.',
    satisfies: ['time']
  },
  {
    name: 'readings-e.csv',
    lines: ['date,temperature_c,pressure_hpa,humidity_pct',
            '8/5/26,21.4,1013.2,62.3',
            '9/5/26,22.8,1012.4,59.1',
            '10/5/26,23.1,1011.8,57.4',
            '11/5/26,19.7,1014.9,68.2',
            '12/5/26,18.2,1016.1,72.5',
            '1/6/26,17.9,1016.8,74.1'],
    meta: { where: 1, height: 1, sensor: 1, shield: 1, datum: 1, cal: 1, time: 0 },
    fault: 'Ambiguous US-format dates',
    question: 'Sort these rows chronologically.',
    options: ['They are already in order', 'Reverse them',
              'Cannot be determined from this file', 'Sort them alphabetically'],
    correct: 2,
    diag: 'Is 8/5/26 the 8th of May or the 5th of August? Both readings are plausible ' +
          'for either. And sorted as text, 1/6/26 comes before 8/5/26, which is wrong ' +
          'under either reading. A date format whose order depends on the reader is not ' +
          'a date format.',
    fix: 'Use ISO 8601: 2026-05-08. It sorts correctly as plain text, which no other ' +
         'format does.',
    satisfies: ['where', 'height', 'sensor', 'shield', 'datum', 'cal']
  },
  {
    name: 'readings-f.csv',
    lines: ['timestamp_utc,temperature_c,pressure_hpa_station,humidity_pct',
            '2026-08-25T14:30:00Z,21.4,995.1,62.3',
            '2026-08-25T14:35:00Z,21.6,995.0,61.8',
            '2026-08-25T14:40:00Z,21.9,994.9,61.2',
            '2026-08-25T14:45:00Z,22.1,994.8,60.9',
            '2026-08-25T14:50:00Z,22.4,994.8,60.4',
            '2026-08-25T14:55:00Z,22.6,994.7,60.0'],
    meta: { where: 1, height: 1, sensor: 1, shield: 1, datum: 1, cal: 1, time: 1 },
    fault: 'Nothing. This one is correct.',
    question: 'Can this be compared with the station 5 km away, which reads 1013 hPa?',
    options: ['Yes: correct to sea level using the 152 m elevation, then compare',
              'No, one of them must be broken',
              'Cannot be determined from this file',
              'Yes, the difference is 18 hPa of weather'],
    correct: 0,
    diag: 'Every question is answerable. The header names each column and its unit, ' +
          'the pressure column says station rather than sea level, the timestamps are ' +
          'UTC, and the metadata gives elevation, sensor accuracy, exposure and ' +
          'calibration. This is the standard: a file a stranger can use.',
    fix: 'Nothing to fix. Compare this with file A and note every difference.',
    satisfies: ['where', 'height', 'sensor', 'shield', 'datum', 'cal', 'time']
  }
];

const GOOD_META = {
  station_id: 'school-roof-01',
  station_name: 'Lincoln Middle School Rooftop',
  latitude: 37.0902, longitude: -122.0644,
  elevation_m: 152, datum: 'WGS 84',
  timezone_note: 'All timestamps are UTC (ISO 8601)',
  sensor: 'BME280, Bosch, I2C 0x76, +/- 1.0 C, +/- 1.0 hPa, +/- 3.0 %',
  pressure_reported: 'station pressure, not corrected to sea level',
  exposure: '1.5 m above grass, louvered naturally ventilated shield',
  calibration: '2026-08-01, against a Kestrel 5500 reference'
};

// ---- state ----
let fileIdx = 0;
let picked = null;
let revealed = false;
let mode = 'Critique';            // Critique | Repair | SixMonths
let repaired = {};                // check id -> true
let repairHeader = false;
let repairIso = false;
let chipHits = [], optHits = [];
let fileSelect;
let fileBox = { x: 0, y: 0, w: 10, h: 10 };
let metaBox = { x: 0, y: 0, w: 10, h: 10 };
let qBox = { x: 0, y: 0, w: 10, h: 10 };
let checkBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');
  fileSelect = createSelect();
  for (let i = 0; i < FILES.length; i++) {
    fileSelect.option(String.fromCharCode(65 + i) + ' - ' + FILES[i].fault, i);
  }
  fileSelect.elt.value = '0';
  fileSelect.changed(() => { fileIdx = parseInt(fileSelect.value(), 10); resetFile(); });
  fileSelect.parent(document.querySelector('main'));
  layoutControls();
  describe('A CSV file viewer beside a metadata panel, with an analysis question ' +
           'the file may or may not be able to answer, and a checklist of the seven ' +
           'questions metadata has to settle.');
}

function f() { return FILES[fileIdx]; }

function currentSatisfied() {
  const base = {};
  for (const k of f().satisfies) base[k] = true;
  if (mode !== 'Critique') {
    for (const k of Object.keys(repaired)) if (repaired[k]) base[k] = true;
    if (repairIso) base.time = true;
  }
  return base;
}

function answerable() {
  const sat = currentSatisfied();
  const needHeader = fileIdx === 0 || fileIdx === 1;
  if (needHeader && !repairHeader && mode !== 'Critique') return false;
  if (fileIdx === 0) return repairHeader;
  if (fileIdx === 1) return repairHeader && !!sat.height && !!sat.datum;
  if (fileIdx === 2) return !!sat.time;
  if (fileIdx === 3) return !!sat.height && !!sat.datum;
  if (fileIdx === 4) return !!sat.time;
  return true;
}

function resetFile() {
  picked = null; revealed = false; mode = 'Critique';
  repaired = {}; repairHeader = false; repairIso = false;
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 28;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    fileBox = { x: margin, y: top, w: w, h: 124 };
    metaBox = { x: margin, y: top + 129, w: w, h: 96 };
    qBox = { x: margin, y: top + 230, w: w, h: 152 };
    checkBox = { x: margin, y: top + 387, w: w, h: drawHeight - (top + 387) - 6 };
  } else {
    const rw = 262;
    const lw = canvasWidth - rw - 3 * margin;
    fileBox = { x: margin, y: top, w: lw, h: 136 };
    metaBox = { x: margin, y: top + 141, w: lw, h: 96 };
    qBox = { x: margin, y: top + 242, w: lw, h: drawHeight - (top + 242) - 6 };
    checkBox = { x: canvasWidth - margin - rw, y: top, w: rw, h: drawHeight - top - 6 };
  }
}

function layoutControls() {
  layout();
  fileSelect.position(margin + 32, drawHeight + 7);
  fileSelect.style('width', Math.min(300, canvasWidth - margin - 44) + 'px');
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(21);
  text('Anatomy of a Good Data File', canvasWidth / 2, 1);
  drawFile();
  drawMeta();
  drawQuestion();
  drawChecklist();
  drawControlRegion();
}

function drawFile() {
  const b = fileBox;
  const fl = f();
  noStroke(); fill('#12181d'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  textFont(MONO); textSize(9.5); textAlign(LEFT, TOP);
  fill('#7f8c8d');
  text(fl.name, b.x + 8, b.y + 5);
  textAlign(RIGHT, TOP);
  fill(fileIdx === 5 ? '#9ccc65' : '#ff8a80');
  text(mode === 'Critique' ? fl.fault : (answerable() ? 'repaired' : 'still broken'),
       b.x + b.w - 8, b.y + 5);

  let lines = fl.lines.slice();
  if (mode !== 'Critique') {
    if (repairHeader && fileIdx === 0) {
      lines = ['timestamp_utc,temperature_c,pressure_hpa_station,humidity_pct'].concat(lines);
    } else if (repairHeader && fileIdx === 1) {
      lines[0] = 'timestamp_utc,temperature_c,pressure_hpa_station,humidity_pct';
    }
    if (repairIso && fileIdx === 2) {
      lines = [lines[0],
               '2026-11-01T05:15:00Z,13.9,1016.2,71.0',
               '2026-11-01T05:30:00Z,13.6,1016.3,71.4',
               '2026-11-01T05:45:00Z,13.4,1016.3,71.9',
               '2026-11-01T06:00:00Z,12.8,1016.5,73.1',
               '2026-11-01T06:15:00Z,12.6,1016.6,73.6',
               '2026-11-01T06:30:00Z,12.4,1016.7,74.0'];
      lines[0] = 'timestamp_utc,temperature_c,pressure_hpa,humidity_pct';
    }
    if (repairIso && fileIdx === 4) {
      lines = ['date_iso,temperature_c,pressure_hpa,humidity_pct',
               '2026-05-08,21.4,1013.2,62.3', '2026-05-09,22.8,1012.4,59.1',
               '2026-05-10,23.1,1011.8,57.4', '2026-05-11,19.7,1014.9,68.2',
               '2026-05-12,18.2,1016.1,72.5', '2026-06-01,17.9,1016.8,74.1'];
    }
  }
  const lh = 12;
  const rows = Math.floor((b.h - 20) / lh);
  textAlign(LEFT, TOP);          // the fault label above left this as RIGHT
  for (let i = 0; i < Math.min(lines.length, rows); i++) {
    let t = lines[i];
    const isHdr = i === 0 && /[a-z]/.test(t.split(',')[0]);
    fill(isHdr ? '#82b1ff' : '#d7f9d7');
    // highlight the two colliding timestamps in the DST file
    if (fileIdx === 2 && mode === 'Critique' && t.indexOf('01:30:00') >= 0) fill('#ffab40');
    while (textWidth(t) > b.w - 16 && t.length > 4) t = t.slice(0, -2) + '…';
    text(t, b.x + 8, b.y + 18 + i * lh);
  }
  textFont('Arial');
}

function drawMeta() {
  const b = metaBox;
  const sat = currentSatisfied();
  const any = Object.keys(sat).length > 0;
  noStroke(); fill(any ? '#ffffff' : '#fdeeee');
  stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('station.json', b.x + 8, b.y + 4);
  if (!any) {
    fill('#b71c1c'); textSize(11); textAlign(LEFT, TOP);
    text('no metadata file', b.x + 8, b.y + 22);
    fill('#8a97a4'); textSize(9.5);
    para(b.x + 8, b.y + 38, b.w - 16,
         'Everything about where, how high, which sensor and how it was exposed is ' +
         'missing. The numbers are all you have.', 11, 9.5);
    return;
  }
  textFont(MONO); textSize(9); textAlign(LEFT, TOP);
  const shown = [];
  if (sat.where) shown.push('"station_name": "' + GOOD_META.station_name + '"');
  if (sat.where) shown.push('"latitude": ' + GOOD_META.latitude + ', "longitude": ' + GOOD_META.longitude);
  if (sat.height) shown.push('"elevation_m": ' + GOOD_META.elevation_m + ', "datum": "' + GOOD_META.datum + '"');
  if (sat.time) shown.push('"timezone_note": "' + GOOD_META.timezone_note + '"');
  if (sat.sensor) shown.push('"sensor": "' + GOOD_META.sensor + '"');
  if (sat.datum) shown.push('"pressure_reported": "' + GOOD_META.pressure_reported + '"');
  if (sat.shield) shown.push('"exposure": "' + GOOD_META.exposure + '"');
  if (sat.cal) shown.push('"calibration": "' + GOOD_META.calibration + '"');
  const lh = 11;
  const rows = Math.floor((b.h - 18) / lh);
  for (let i = 0; i < Math.min(shown.length, rows); i++) {
    let t = shown[i];
    fill('#37474f');
    while (textWidth(t) > b.w - 16 && t.length > 4) t = t.slice(0, -2) + '…';
    text(t, b.x + 8, b.y + 16 + i * lh);
  }
  textFont('Arial');
  if (shown.length > rows) {
    fill('#8a97a4'); textAlign(RIGHT, TOP); textSize(9);
    text('+' + (shown.length - rows) + ' more fields', b.x + b.w - 8, b.y + 4);
  }
}

function drawQuestion() {
  const b = qBox;
  const fl = f();
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 10, W = b.w - 20;
  let y = b.y + 7;
  optHits = [];

  if (mode === 'SixMonths') {
    fill('#6a1b9a'); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
    text('Six months later', L, y); textStyle(NORMAL);
    y += 17;
    fill('#33475b'); textSize(10.5);
    y = para(L, y, W, 'It is next spring. You are opening this file with no memory of ' +
        'the installation, no notes, and nobody to ask. Everything you remember has ' +
        'been taken away - which is the only state in which self-documentation can ' +
        'honestly be judged.', 12.5, 10.5) + 8;
    const ok = answerable();
    fill(ok ? '#1b5e20' : '#b71c1c'); textSize(12); textStyle(BOLD);
    text(ok ? 'Your file survives.' : 'Your file does not survive.', L, y);
    textStyle(NORMAL); y += 17;
    fill('#33475b'); textSize(10.5);
    const missing = CHECKS.filter(c => !currentSatisfied()[c.id]);
    para(L, y, W, ok
      ? 'Everything the question needs is in the file or the metadata beside it. A ' +
        'stranger could use this, which means so can you.'
      : 'Still unanswerable. ' + (missing.length ? 'Nobody can tell: ' +
        missing.map(c => c.q.toLowerCase().replace('?', '')).join('; ') + '.' : ''),
      12.5, 10.5);
    return;
  }

  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text(mode === 'Repair' ? 'the same question, against your repaired file'
                         : 'the analysis task', L, y);
  y += 14;
  fill('#0d2b45'); textSize(12); textStyle(BOLD);
  y = para(L, y, W, fl.question, 14, 12) + 6;
  textStyle(NORMAL);

  if (mode === 'Repair') {
    const ok = answerable();
    noStroke(); fill(ok ? '#e8f5e9' : '#fdeeee');
    rect(L, y, W, 30, 3);
    fill(ok ? '#1b5e20' : '#b71c1c'); textSize(11.5); textStyle(BOLD);
    text(ok ? 'Now answerable' : 'Still not answerable', L + 7, y + 3);
    textStyle(NORMAL); textSize(9.5);
    text(ok ? 'the file and its metadata contain everything the question needs'
            : 'something the question needs is still missing', L + 7, y + 17);
    y += 38;
    fill('#33475b'); textSize(10.5);
    para(L, y, W, fl.fix, 12, 10.5);
    return;
  }

  for (let i = 0; i < fl.options.length; i++) {
    const h = 24;
    if (y + h > b.y + b.h - 4) break;
    const sel = picked === i;
    const isRight = i === fl.correct;
    let bg = '#f4f7fa', bd = '#c3ced8', fg = '#33475b';
    if (revealed && isRight) { bg = '#e8f5e9'; bd = '#66bb6a'; fg = '#1b5e20'; }
    else if (revealed && sel) { bg = '#fdeeee'; bd = '#ef9a9a'; fg = '#b71c1c'; }
    else if (sel) { bg = '#e3f2fd'; bd = '#1565c0'; fg = '#0d47a1'; }
    noStroke(); fill(bg); stroke(bd); strokeWeight(sel || (revealed && isRight) ? 1.8 : 1);
    rect(L, y, W, h - 3, 3);
    noStroke(); fill(fg); textAlign(LEFT, CENTER); textSize(10.5);
    let t = fl.options[i];
    while (textWidth(t) > W - 16 && t.length > 6) t = t.slice(0, -2) + '…';
    text(t, L + 8, y + (h - 3) / 2);
    optHits.push({ x: L, y: y, w: W, h: h - 3, i: i });
    y += h;
  }
  if (revealed) {
    y += 3;
    fill(picked === fl.correct ? '#1b5e20' : '#b71c1c');
    textAlign(LEFT, TOP); textSize(10.5); textStyle(BOLD);
    text(picked === fl.correct ? 'Correct' : 'Not quite', L, y);
    textStyle(NORMAL); y += 14;
    fill('#33475b'); textSize(10);
    para(L, y, W, fl.diag, 11.5, 10);
  }
}

function drawChecklist() {
  const b = checkBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const sat = currentSatisfied();
  const n = CHECKS.filter(c => sat[c.id]).length;
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('can a stranger answer these?', b.x + 9, b.y + 5);
  textAlign(RIGHT, TOP);
  fill(n === CHECKS.length ? '#1b5e20' : '#b71c1c');
  text(n + ' of ' + CHECKS.length, b.x + b.w - 9, b.y + 5);
  let y = b.y + 20;
  const L = b.x + 9, W = b.w - 18;
  for (const c of CHECKS) {
    const ok = !!sat[c.id];
    const clickable = mode === 'Repair' && !ok;
    noStroke(); fill(ok ? '#2e7d32' : (clickable ? '#fff8e1' : '#ffffff'));
    stroke(ok ? '#1b5e20' : '#b0bec5'); strokeWeight(1);
    rect(L, y + 1, 10, 10, 2);
    noStroke();
    if (ok) {
      stroke('#ffffff'); strokeWeight(1.7);
      line(L + 2.2, y + 6, L + 4.4, y + 8.6);
      line(L + 4.4, y + 8.6, L + 8, y + 3.4);
      noStroke();
    }
    fill(ok ? '#1b5e20' : (clickable ? '#e65100' : '#8a97a4'));
    textAlign(LEFT, TOP); textSize(9.8);
    const lines = wrapLines(c.q + (clickable ? '  [add]' : ''), W - 18, 9.8);
    for (let i = 0; i < lines.length; i++) text(lines[i], L + 16, y + i * 11);
    if (clickable) optHits.push({ x: L, y: y, w: W, h: lines.length * 11, check: c.id });
    y += lines.length * 11 + 4;
  }
  y += 4;
  if (mode === 'Repair') {
    fill('#5a6a78'); textSize(9.5); textAlign(LEFT, TOP);
    para(L, y, W, 'Click an unticked question to add that metadata. Use the buttons ' +
         'below for the header row and the time format.', 11, 9.5);
  } else if (b.y + b.h - y > 40) {
    fill('#78909c'); textSize(9.5); textAlign(LEFT, TOP);
    para(L, y, W, 'Six of these come from the chapter. The seventh, an unambiguous ' +
         'time base, is what file C exists to prove you need.', 11, 9.5);
  }
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 8;
  chipHits = [];
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(10);
  text('File', margin, y0 + 10);

  let y2 = y0 + 30;
  x = margin;
  if (mode === 'Critique') {
    x = chip(x, y2, revealed ? 'Hide the diagnosis' : 'Check my answer', revealed) + 6;
    if (revealed) x = chip(x, y2, 'Repair this file', false) + 6;
  } else {
    x = chip(x, y2, 'Back to the question', false) + 6;
    x = chip(x, y2, repairHeader ? 'Header row added' : 'Add a header row with units',
             repairHeader) + 6;
    x = chip(x, y2, repairIso ? 'Timestamps are ISO 8601 UTC' : 'Use ISO 8601 UTC',
             repairIso) + 6;
  }
  y2 += 28;
  x = margin;
  x = chip(x, y2, mode === 'SixMonths' ? 'Back' : 'Six months later',
           mode === 'SixMonths') + 6;
  x = chip(x, y2, 'Fix everything', false) + 6;
  chip(x, y2, 'Reset this file', false);

  fill('#8a97a4'); textAlign(LEFT, TOP); textSize(9.5);
  para(margin, y2 + 28, canvasWidth - 2 * margin,
       'Each file is broken in exactly one way. File F is correct - leave it until ' +
       'last, so the contrast lands.', 11, 9.5);
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
  for (const o of optHits) {
    if (mouseX >= o.x && mouseX <= o.x + o.w && mouseY >= o.y && mouseY <= o.y + o.h) {
      if (o.check) repaired[o.check] = true;
      else if (!revealed) picked = o.i;
      return false;
    }
  }
  return true;
}

function onChip(label) {
  if (label === 'Check my answer') { if (picked !== null) revealed = true; }
  else if (label === 'Hide the diagnosis') revealed = false;
  else if (label === 'Repair this file') mode = 'Repair';
  else if (label === 'Back to the question') { mode = 'Critique'; }
  else if (label === 'Add a header row with units' || label === 'Header row added') {
    repairHeader = !repairHeader;
  } else if (label === 'Use ISO 8601 UTC' || label === 'Timestamps are ISO 8601 UTC') {
    repairIso = !repairIso;
  } else if (label === 'Six months later') { mode = 'SixMonths'; }
  else if (label === 'Back') { mode = 'Repair'; }
  else if (label === 'Fix everything') {
    mode = 'Repair'; repairHeader = true; repairIso = true;
    for (const c of CHECKS) repaired[c.id] = true;
  } else if (label === 'Reset this file') resetFile();
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
