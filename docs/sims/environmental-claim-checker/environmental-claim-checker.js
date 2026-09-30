// Environmental Claim Checker MicroSim
// CANVAS_HEIGHT: 676
// Bloom Level: Evaluate (L5) - the learner critiques environmental claims by
// asking what was measured, how, where, over what period, and with what
// uncertainty, then judges whether the evidence supports the conclusion.
// This is the transferable outcome of the whole book. Most readers will not keep
// a weather station for life; all of them will meet environmental claims for the
// rest of it. One of the eight cases is sound, on purpose: a checker where
// everything is misleading teaches cynicism rather than judgement.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 492;
let controlHeight = 184;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 760;

// The six questions, straight out of the book.
const QS = [
  { id: 'what', q: 'What exactly was measured?', s: 'measured?' },
  { id: 'where', q: 'Where, and with what exposure?', s: 'exposure?' },
  { id: 'period', q: 'Over what period?', s: 'period?' },
  { id: 'units', q: 'What units, and is the scale honest?', s: 'units, scale?' },
  { id: 'unc', q: 'What is the uncertainty?', s: 'uncertainty?' },
  { id: 'cause', q: 'Correlation or causation?', s: 'cause?' }
];
// verdicts a learner can set on each question
const VERDICTS = ['answered', 'unanswered', 'misleading'];

const VERDICT_OPTS = ['Well supported', 'Overstated', 'Misleading',
                      'Cannot be evaluated from what is given'];

// ---- the eight cases -----------------------------------------------------
// truth: per-question ground truth. decisive: the question that settles it.

const CASES = [
  {
    medium: 'news', outlet: 'THE CITY HERALD',
    head: 'Hottest day ever recorded at this location: 47 °C',
    body: 'A rooftop sensor at the civic centre recorded 47 °C yesterday afternoon, ' +
          'beating the previous record of 41 °C. "It has never been this hot," said ' +
          'a spokesperson.',
    truth: { what: 'misleading', where: 'misleading', period: 'answered',
             units: 'answered', unc: 'unanswered', cause: 'answered' },
    overall: 'Misleading', decisive: 'where', ch: 6,
    why: 'An unshielded sensor on a dark rooftop measures its own temperature in the ' +
         'sun, not the temperature of the air. Chapter 6 showed the error can exceed ' +
         '10 degrees. The old record was almost certainly measured in a proper ' +
         'louvered screen over grass, so the two numbers are not comparable at all.',
    fix: 'Shielded, naturally ventilated sensor 1.5 m above short grass, and say so.'
  },
  {
    medium: 'social', outlet: '@CityWatchData',
    head: 'City temperatures are SOARING. Look at this chart.',
    body: 'Annual mean temperature, 2021 to 2025. The line climbs steeply from the ' +
          'bottom left to the top right of the chart. [y-axis: 14.20 to 14.60 °C]',
    truth: { what: 'answered', where: 'unanswered', period: 'answered',
             units: 'misleading', unc: 'unanswered', cause: 'answered' },
    overall: 'Overstated', decisive: 'units', ch: 15,
    why: 'The trend is real: about 0.3 degrees over five years. But an axis spanning ' +
         '0.4 degrees turns a small real change into a mountain range, and no ' +
         'uncertainty is given for an annual mean computed from a single station. ' +
         'Chapter 15: the axis is honest only when it is disclosed.',
    fix: 'State the axis range and the uncertainty, and give the trend as a number.'
  },
  {
    medium: 'news', outlet: 'NATIONAL WIRE',
    head: 'Earthquake measured 6.2 on the Richter scale',
    body: 'The quake struck at 04:12 local time at a depth of 12 km. Shaking was felt ' +
          'across three provinces.',
    truth: { what: 'misleading', where: 'answered', period: 'answered',
             units: 'misleading', unc: 'unanswered', cause: 'answered' },
    overall: 'Overstated', decisive: 'what', ch: 11,
    why: 'Seismologists have used moment magnitude for events of this size since 1979. ' +
         'The reported 6.2 is almost certainly a moment magnitude, not a Richter value. ' +
         'And magnitude describes the earthquake; what was "felt across three ' +
         'provinces" is intensity, which is a different scale with a different value ' +
         'in every town. Chapter 11.',
    fix: 'Report it as magnitude 6.2 (moment magnitude) and give intensities by place.'
  },
  {
    medium: 'agency', outlet: 'REGIONAL WEATHER SERVICE - BULLETIN',
    head: 'Barometric pressure 995 hPa. Storm warning issued.',
    body: 'The station at Highfield reports 995 hPa this morning. A storm warning is in ' +
          'effect for the district.',
    truth: { what: 'unanswered', where: 'misleading', period: 'unanswered',
             units: 'answered', unc: 'unanswered', cause: 'unanswered' },
    overall: 'Cannot be evaluated from what is given', decisive: 'where', ch: 7,
    why: 'Highfield sits at 400 m. Uncorrected station pressure there reads about 47 hPa ' +
         'below sea level pressure, so 995 hPa at the station is roughly 1042 hPa at sea ' +
         'level - not a storm, an unusually strong high. Nothing in the bulletin says ' +
         'which it is. And a storm warning comes from the tendency, not the value: ' +
         'Chapters 7 and 15.',
    fix: 'Say station or sea level, give the elevation, and quote the 3-hour tendency.'
  },
  {
    medium: 'social', outlet: '@WeatherChat',
    head: 'Only 50 percent humidity today, so it is half as humid as yesterday.',
    body: 'Yesterday the humidity was 100 percent. Today it is 50 percent. Half the ' +
          'water in the air.',
    truth: { what: 'misleading', where: 'unanswered', period: 'answered',
             units: 'misleading', unc: 'unanswered', cause: 'misleading' },
    overall: 'Misleading', decisive: 'what', ch: 8,
    why: 'Relative humidity is a ratio against a maximum that itself depends on ' +
         'temperature, so 50 per cent on a warm day can hold more water than 100 per ' +
         'cent on a cold one. The quantity that answers "how much water" is the dew ' +
         'point or the absolute humidity, neither of which is given. Chapter 8.',
    fix: 'Quote the dew point, which is what actually tells you how much water there is.'
  },
  {
    medium: 'advert', outlet: 'SUNGUARD - ADVERTISEMENT',
    head: 'Skip the sunscreen today. It is cool and overcast.',
    body: 'Our free app tells you when you need protection. Cloudy and under 20 °C? ' +
          'Put the bottle away and enjoy your day.',
    truth: { what: 'misleading', where: 'unanswered', period: 'unanswered',
             units: 'unanswered', unc: 'unanswered', cause: 'misleading' },
    overall: 'Misleading', decisive: 'what', ch: 9,
    why: 'Neither temperature nor brightness predicts ultraviolet. Light cloud cuts ' +
         'visible light far more than it cuts UV: Chapter 9 showed an overcast summer ' +
         'noon at UV index 3.7 while looking like a day you could not burn on. The ' +
         'quantity that decides this is the UV index, and the advert never mentions it.',
    fix: 'Use the UV index. It is the only quantity that answers the question asked.'
  },
  {
    medium: 'advert', outlet: 'BRIGHTROOF SOLAR - QUOTE',
    head: 'Your array will produce 400 kWh a year.',
    body: 'Based on measurements taken at your address in June, your roof receives ' +
          '6.2 kWh/m² per day. Over a year that is 400 kWh from the proposed array.',
    truth: { what: 'answered', where: 'answered', period: 'misleading',
             units: 'answered', unc: 'unanswered', cause: 'answered' },
    overall: 'Overstated', decisive: 'period', ch: 16,
    why: 'June is the best month of the year. Annualising the best month overstates the ' +
         'yield by roughly a factor of two at mid latitudes, where December delivers ' +
         'about a fifth of June. Chapter 16: size against the worst month, and quote ' +
         'the annual total from twelve monthly figures rather than one.',
    fix: 'Quote monthly insolation for all twelve months and sum the year properly.'
  },
  {
    medium: 'agency', outlet: 'NATIONAL METEOROLOGICAL SERVICE - CLIMATE STATEMENT',
    head: 'Mean annual temperature has risen 1.1 ± 0.2 °C since 1960',
    body: 'Computed from 84 stations with continuous records, all in naturally ' +
          'ventilated screens 1.5 m above short grass, homogenised for station moves. ' +
          'Period: 1960 to 2025, 65 years. Uncertainty is the 95 per cent confidence ' +
          'interval. The physical mechanism is the increase in atmospheric greenhouse ' +
          'gas concentrations, independently measured. Full method and data are ' +
          'published.',
    truth: { what: 'answered', where: 'answered', period: 'answered',
             units: 'answered', unc: 'answered', cause: 'answered' },
    overall: 'Well supported', decisive: null, ch: 17,
    why: 'Every one of the six questions is answered in the statement itself. What was ' +
         'measured, with what exposure, over what period, in what units, with what ' +
         'uncertainty, and by what mechanism. This is what a claim looks like when the ' +
         'evidence is actually there, and recognising it matters as much as spotting the ' +
         'others.',
    fix: 'Nothing to fix. Compare this with case 1 and list every difference.'
  }
];

// ---- state ----
let caseIdx = 0;
let marks = {};            // question id -> verdict
let pickedOverall = null;
let submitted = null;
let rewriteMode = false;
let score = { cases: 0, overallRight: 0, qRight: 0, qTotal: 0, missed: {} };
let chipHits = [], qHits = [], ovHits = [];
let caseSelect;
let claimBox = { x: 0, y: 0, w: 10, h: 10 };
let listBox = { x: 0, y: 0, w: 10, h: 10 };
let fbBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');
  caseSelect = createSelect();
  for (let i = 0; i < CASES.length; i++) {
    let h = CASES[i].head;
    if (h.length > 44) h = h.slice(0, 42) + '\u2026';
    caseSelect.option((i + 1) + ' - ' + h, i);
  }
  caseSelect.elt.value = '0';
  caseSelect.changed(() => { caseIdx = parseInt(caseSelect.value(), 10); resetCase(); });
  caseSelect.parent(document.querySelector('main'));
  layoutControls();
  describe('An environmental claim presented in the style of its medium, with the six ' +
           'diagnostic questions from the book beside it, and feedback that scores both ' +
           'the overall judgment and the per-question verdicts.');
}

function cc() { return CASES[caseIdx]; }

function resetCase() {
  marks = {}; pickedOverall = null; submitted = null; rewriteMode = false;
}

function submit() {
  if (pickedOverall === null) return;
  const c = cc();
  const ovOk = VERDICT_OPTS[pickedOverall] === c.overall;
  let qOk = 0;
  const wrong = [];
  for (const q of QS) {
    if (marks[q.id] === c.truth[q.id]) qOk += 1;
    else wrong.push(q);
  }
  submitted = { ovOk: ovOk, qOk: qOk, wrong: wrong };
  score.cases += 1;
  if (ovOk) score.overallRight += 1;
  score.qRight += qOk;
  score.qTotal += QS.length;
  for (const q of wrong) score.missed[q.id] = (score.missed[q.id] || 0) + 1;
}

function weakest() {
  let best = null, n = 0;
  for (const q of QS) {
    const m = score.missed[q.id] || 0;
    if (m > n) { n = m; best = q; }
  }
  return best ? { q: best, n: n } : null;
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 28;
  const w = canvasWidth - 2 * margin;
  if (isNarrow()) {
    claimBox = { x: margin, y: top, w: w, h: 152 };
    listBox = { x: margin, y: top + 157, w: w, h: 158 };
    fbBox = { x: margin, y: top + 320, w: w, h: drawHeight - (top + 320) - 6 };
  } else {
    const lw = 290;
    claimBox = { x: margin, y: top, w: w - lw - 8, h: 210 };
    listBox = { x: margin + w - lw, y: top, w: lw, h: 210 };
    fbBox = { x: margin, y: top + 216, w: w, h: drawHeight - (top + 216) - 6 };
  }
}
function layoutControls() {
  layout();
  caseSelect.position(margin + 42, drawHeight + 7);
  caseSelect.style('width', Math.min(316, canvasWidth - margin - 150) + 'px');
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(21);
  text('Environmental Claim Checker', canvasWidth / 2, 1);
  drawClaim();
  drawList();
  drawFeedback();
  drawControlRegion();
}

const MEDIA = {
  news: { bg: '#fffef7', bd: '#8d6e63', tag: '#5d4037', font: 'serif' },
  social: { bg: '#f2f7fd', bd: '#1da1f2', tag: '#0d47a1', font: 'Arial' },
  advert: { bg: '#fff4e6', bd: '#ef6c00', tag: '#bf360c', font: 'Arial' },
  agency: { bg: '#f4f6f8', bd: '#37474f', tag: '#263238', font: 'Arial' }
};

function drawClaim() {
  const b = claimBox, c = cc();
  const m = MEDIA[c.medium];
  noStroke(); fill(m.bg); stroke(m.bd); strokeWeight(1.6);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 12, W = b.w - 24;
  let y = b.y + 8;
  fill(m.tag); textAlign(LEFT, TOP); textSize(9.5);
  text(c.outlet, L, y);
  textAlign(RIGHT, TOP); fill('#90a4ae');
  text(c.medium === 'social' ? 'social media post'
       : (c.medium === 'advert' ? 'advertisement'
       : (c.medium === 'agency' ? 'official statement' : 'news article')),
       b.x + b.w - 12, y);
  y += 16;
  textFont(m.font === 'serif' ? 'Georgia' : 'Arial');
  fill('#1b1b1b'); textAlign(LEFT, TOP);
  textSize(rewriteMode ? 13 : 15); textStyle(BOLD);
  y = para(L, y, W, rewriteMode ? c.fix : c.head, rewriteMode ? 15 : 17,
           rewriteMode ? 13 : 15) + 5;
  textStyle(NORMAL);
  fill('#37474f'); textSize(11);
  y = para(L, y, W, rewriteMode
    ? 'This is the smallest change that makes the original claim defensible. Every ' +
      'question the checker asks is now answerable from the claim itself.'
    : c.body, 13, 11);
  textFont('Arial');

  if (rewriteMode) {
    y += 6;
    fill('#1b5e20'); textSize(10.5);
    para(L, y, W, 'Rewritten: all six questions answered. Compare it with what was ' +
         'published.', 12, 10.5);
  }
}

function drawList() {
  const b = listBox, c = cc();
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 8, W = b.w - 16;
  let y = b.y + 5;
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(9.5);
  text('for each question, set a verdict', L, y);
  y += 13;
  qHits = [];
  const rowH = (b.h - 20) / QS.length;
  // A 23 px row cannot stack a question above three buttons, so when the rows
  // are short the short label and the buttons go side by side instead.
  const oneLine = rowH < 30;
  for (const q of QS) {
    const mk = marks[q.id];
    const truth = c.truth[q.id];
    const shown = submitted ? truth : mk;
    const wrong = submitted && mk !== truth;
    noStroke();
    fill(submitted ? (wrong ? '#fdeeee' : '#f1f8f2') : '#f7f9fb');
    rect(L, y, W, rowH - 3, 3);
    textSize(8.6);
    const btnW = VERDICTS.reduce((a, v) => a + textWidth(v) + 14, 0);
    const labW = oneLine ? Math.max(58, W - btnW - 14) : W - 12;
    fill('#37474f'); textAlign(LEFT, oneLine ? CENTER : TOP); textSize(9.4);
    let qt = oneLine ? q.s : q.q;
    while (textWidth(qt) > labW && qt.length > 6) qt = qt.slice(0, -2) + '…';
    text(qt, L + 5, oneLine ? y + (rowH - 3) / 2 : y + 3);
    // three little buttons
    let bx = oneLine ? L + 9 + labW : L + 5;
    const by = oneLine ? y + (rowH - 3) / 2 - 7 : y + rowH - 19;
    for (const v of VERDICTS) {
      textSize(8.6);
      const bw = textWidth(v) + 10;
      const on = shown === v;
      const isTruth = submitted && truth === v;
      noStroke();
      fill(on ? (submitted ? (wrong ? '#c62828' : '#2e7d32') : '#1565c0')
              : (isTruth ? '#c8e6c9' : '#eef2f6'));
      stroke(on ? '#0d47a1' : '#c3ced8'); strokeWeight(on ? 1.4 : 1);
      rect(bx, by, bw, 15, 3);
      noStroke(); fill(on ? '#ffffff' : '#546e7a');
      textAlign(CENTER, CENTER);
      text(v, bx + bw / 2, by + 8);
      if (!submitted) qHits.push({ x: bx, y: by, w: bw, h: 15, q: q.id, v: v });
      bx += bw + 4;
    }
    if (submitted && wrong && !oneLine) {
      fill('#b71c1c'); textAlign(RIGHT, TOP); textSize(8.4);
      text('you said ' + (mk || 'nothing'), L + W - 4, y + 4);
    }
    y += rowH;
  }
}

function drawFeedback() {
  const b = fbBox, c = cc();
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const L = b.x + 10, W = b.w - 20;
  let y = b.y + 6;
  ovHits = [];

  if (!submitted) {
    fill('#0d2b45'); textAlign(LEFT, TOP); textSize(10.5);
    text('Your overall judgment', L, y);
    y += 15;
    const two = W > 430;
    const cw = two ? W / 2 - 4 : W;
    for (let i = 0; i < VERDICT_OPTS.length; i++) {
      const bx = L + (two ? (i % 2) * (cw + 8) : 0);
      const by = y + (two ? Math.floor(i / 2) : i) * 22;
      if (by + 20 > b.y + b.h - 4) break;
      const on = pickedOverall === i;
      noStroke(); fill(on ? '#e3f2fd' : '#f7f9fb');
      stroke(on ? '#1565c0' : '#c3ced8'); strokeWeight(on ? 1.6 : 1);
      rect(bx, by, cw, 19, 3);
      noStroke(); fill(on ? '#0d47a1' : '#37474f'); textAlign(LEFT, CENTER); textSize(9.8);
      text(VERDICT_OPTS[i], bx + 7, by + 10);
      ovHits.push({ x: bx, y: by, w: cw, h: 19, i: i });
    }
    y += (two ? 2 : 4) * 22 + 4;
    if (y + 20 < b.y + b.h) {
      fill('#8a97a4'); textSize(9.4); textAlign(LEFT, TOP);
      para(L, y, W, 'Both halves are scored. Getting the conclusion right by guessing ' +
           'does not help you with the next claim; knowing which question failed does.',
           10.8, 9.4);
    }
    return;
  }

  const s = submitted;
  const col = s.ovOk ? (s.qOk === QS.length ? '#1b5e20' : '#e65100') : '#b71c1c';
  fill(col); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
  text((s.ovOk ? 'Correct: ' : 'Not this one. It is ') + c.overall +
       '   (' + s.qOk + ' of ' + QS.length + ' questions right)', L, y);
  textStyle(NORMAL);
  y += 17;
  if (!s.ovOk) {
    fill('#b71c1c'); textSize(10);
    y = para(L, y, W, 'You said ' + VERDICT_OPTS[pickedOverall] + '.', 11.5, 10) + 2;
  }
  if (c.decisive) {
    const dq = QS.find(q => q.id === c.decisive);
    fill('#0d47a1'); textSize(10.5);
    y = para(L, y, W, 'The decisive question was: ' + dq.q + '  (Chapter ' + c.ch + ')',
             12, 10.5) + 3;
  } else {
    fill('#1b5e20'); textSize(10.5);
    y = para(L, y, W, 'No question fails here. This claim is sound. (Chapter ' +
             c.ch + ')', 12, 10.5) + 3;
  }
  fill('#33475b'); textSize(10);
  y = para(L, y, W, c.why, 11.5, 10) + 4;
  const wk = weakest();
  if (wk && b.y + b.h - y > 24) {
    fill('#78909c'); textSize(9.4);
    para(L, y, W, 'Across ' + score.cases + ' case' + (score.cases === 1 ? '' : 's') +
         ' you have most often missed: ' + wk.q.q + ' (' + wk.n + ' time' +
         (wk.n === 1 ? '' : 's') + ').', 10.8, 9.4);
  }
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 6;
  chipHits = [];
  fill('#0d2b45'); textAlign(LEFT, CENTER); textSize(10);
  text('Claim', margin, y0 + 10);
  const narrow = isNarrow();
  let y2 = y0 + 28;
  // on a narrow canvas the long form collides with the action buttons
  textAlign(RIGHT, CENTER); fill('#0d2b45'); textSize(10);
  text(narrow
    ? score.overallRight + '/' + score.cases + '  \u00b7  ' +
      score.qRight + '/' + score.qTotal
    : 'score  ' + score.overallRight + '/' + score.cases + ' verdicts, ' +
      score.qRight + '/' + score.qTotal + ' questions',
    canvasWidth - margin, y0 + 10);

  let x = margin;
  x = chip(x, y2, submitted ? 'Try this one again' : 'Submit my judgment', false) + 6;
  if (submitted) {
    x = chip(x, y2, rewriteMode ? 'Show what was published' : 'Rewrite it',
             rewriteMode) + 6;
  }
  x = chip(x, y2, 'Next claim', false) + 6;
  chip(x, y2, 'Reset the score', false);

  fill('#8a97a4'); textAlign(LEFT, TOP); textSize(9.4);
  para(margin, y2 + 30, canvasWidth - 2 * margin,
       'Case 8 is a sound claim. It is there on purpose: a checker where every case is ' +
       'misleading teaches cynicism, and recognising good evidence is half the skill.',
       10.8, 9.4);
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
  for (const q of qHits) {
    if (mouseX >= q.x && mouseX <= q.x + q.w && mouseY >= q.y && mouseY <= q.y + q.h) {
      marks[q.q] = marks[q.q] === q.v ? undefined : q.v;
      return false;
    }
  }
  for (const o of ovHits) {
    if (mouseX >= o.x && mouseX <= o.x + o.w && mouseY >= o.y && mouseY <= o.y + o.h) {
      pickedOverall = o.i;
      return false;
    }
  }
  return true;
}

function onChip(label) {
  if (label === 'Submit my judgment') submit();
  else if (label === 'Try this one again') { submitted = null; rewriteMode = false; }
  else if (label === 'Rewrite it') rewriteMode = true;
  else if (label === 'Show what was published') rewriteMode = false;
  else if (label === 'Next claim') {
    caseIdx = (caseIdx + 1) % CASES.length;
    caseSelect.elt.value = String(caseIdx);
    resetCase();
  }
  else if (label === 'Reset the score') {
    score = { cases: 0, overallRight: 0, qRight: 0, qTotal: 0, missed: {} };
    resetCase();
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
