// Observation or Measurement Sorter MicroSim
// CANVAS_HEIGHT: 480
// Bloom Level: Evaluate (L5) - the learner judges whether a statement is a
// qualitative observation or quantitative data, using the rule
// "quantitative data needs both a number AND a unit".
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- controls ----
let nextButton;
let resetButton;

// ---- layout breakpoint ----
// Below this canvas width the two bins stack vertically instead of sitting
// side by side.
const STACK_BREAKPOINT = 500;

// ---- statement bank ----
// answer: 'qualitative' or 'quantitative'
// feedback is shown after the learner commits to a bin.
const STATEMENTS = [
  {
    text: 'The sky is overcast.',
    answer: 'qualitative',
    feedback: 'Correct. This describes a condition in words. There is no number and no unit, so it cannot be graphed or compared numerically.'
  },
  {
    text: 'Barometric pressure is 1013 hPa.',
    answer: 'quantitative',
    feedback: 'Correct. There is a number (1013) AND a unit (hPa, hectopascals). That is what makes it data.'
  },
  {
    text: 'It feels muggy.',
    answer: 'qualitative',
    feedback: 'Correct. "Muggy" is a human impression. Two people might disagree, and neither could prove the other wrong.'
  },
  {
    text: 'Relative humidity is 88 percent.',
    answer: 'quantitative',
    feedback: 'Correct. Number (88) plus unit (percent). Percent is a real unit here because it means "out of the maximum the air could hold".'
  },
  {
    text: 'The wind is strong enough to bend the small trees.',
    answer: 'qualitative',
    feedback: 'Correct. This is a real, useful observation, and it is roughly Beaufort force 6. But as written it has no number, so it cannot be graphed.'
  },
  {
    text: 'Wind speed is 24 kilometers per hour.',
    answer: 'quantitative',
    feedback: 'Correct. Number (24) plus unit (kilometers per hour).'
  },
  {
    text: 'The temperature is 25.',
    answer: 'qualitative',
    feedback: 'Careful. There is a number here, but 25 what? Celsius? Fahrenheit? Without a unit this cannot be compared to anything.'
  },
  {
    text: 'The air temperature is 25 degrees Celsius.',
    answer: 'quantitative',
    feedback: 'Correct. Same number as the previous card, but now it carries a unit, so it is data.'
  },
  {
    text: 'It is colder than yesterday.',
    answer: 'qualitative',
    feedback: 'Correct. This is a comparison in words. It tells you a direction but not an amount.'
  },
  {
    text: 'Today is 3.2 degrees Celsius colder than yesterday.',
    answer: 'quantitative',
    feedback: 'Correct. The same comparison, but now with a number (3.2) and a unit (degrees Celsius).'
  },
  {
    text: 'The ground shook hard enough to rattle the windows.',
    answer: 'qualitative',
    feedback: 'Correct. A vivid description, but there is no measured value in it.'
  },
  {
    text: 'The earthquake measured 4.1 on the moment magnitude scale.',
    answer: 'quantitative',
    feedback: 'Correct. Number (4.1) plus a named scale that defines what the number means.'
  }
];

// ---- quiz state ----
let deck = [];        // shuffled copy of STATEMENTS
let cardIndex = 0;    // which card is showing
let answered = false; // has the current card been judged
let lastCorrect = false;
let feedbackText = '';
let correctCount = 0;
let attemptedCount = 0;

// ---- drag state ----
let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let cardPos = null;   // {x, y} top-left while dragging, null = use home position

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textSize(defaultTextSize);

  nextButton = createButton('Next');
  nextButton.position(10, drawHeight + 10);
  nextButton.mousePressed(nextCard);

  resetButton = createButton('Reset');
  resetButton.position(70, drawHeight + 10);
  resetButton.mousePressed(resetQuiz);

  resetQuiz();

  describe('An interactive sorter. A statement about the environment appears on a card. ' +
           'The learner drags the card into one of two bins, qualitative observation or ' +
           'quantitative data, and receives feedback naming the rule that decides it.', LABEL);
}

// Fisher-Yates shuffle into a fresh deck
function resetQuiz() {
  deck = STATEMENTS.slice();
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
  cardIndex = 0;
  answered = false;
  feedbackText = '';
  correctCount = 0;
  attemptedCount = 0;
  cardPos = null;
  dragging = false;
}

function nextCard() {
  if (cardIndex < deck.length - 1) {
    cardIndex++;
    answered = false;
    feedbackText = '';
    cardPos = null;
    dragging = false;
  } else {
    // past the last card - show the summary line
    answered = true;
    feedbackText = 'Deck complete. You scored ' + correctCount + ' out of ' +
                   attemptedCount + '. Press Reset to shuffle and try again.';
  }
}

// ---- geometry helpers (all computed from canvas size so resize works) ----

function cardHome() {
  const w = canvasWidth - 2 * margin;
  return { x: margin, y: 85, w: w, h: 78 };
}

function binRects() {
  const stacked = canvasWidth < STACK_BREAKPOINT;
  const top = 185;
  const totalW = canvasWidth - 2 * margin;
  if (stacked) {
    const h = 55;
    return [
      { x: margin, y: top,          w: totalW, h: h, key: 'qualitative',  label: 'Qualitative Observation' },
      { x: margin, y: top + h + 10, w: totalW, h: h, key: 'quantitative', label: 'Quantitative Data' }
    ];
  }
  const gap = 20;
  const w = (totalW - gap) / 2;
  const h = 120;
  return [
    { x: margin,           y: top, w: w, h: h, key: 'qualitative',  label: 'Qualitative Observation' },
    { x: margin + w + gap, y: top, w: w, h: h, key: 'quantitative', label: 'Quantitative Data' }
  ];
}

function pointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function draw() {
  updateCanvasSize();

  // background regions
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  drawTitle();
  drawBins();
  drawCard();
  drawFeedback();
  drawControlLabels();
}

function drawTitle() {
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Observation or Measurement?', canvasWidth / 2, margin - 10);

  textSize(defaultTextSize);
  fill('#444');
  const prompt = answered
    ? 'Read the feedback, then press Next.'
    : 'Drag the card into a bin, or tap a bin to choose it.';
  text(prompt, canvasWidth / 2, margin + 22);
}

function drawBins() {
  const bins = binRects();
  const home = cardHome();
  // While dragging, highlight the bin under the pointer.
  for (const b of bins) {
    const hot = dragging && pointInRect(mouseX, mouseY, b);
    stroke(hot ? '#1565c0' : '#9e9e9e');
    strokeWeight(hot ? 3 : 2);
    fill(hot ? '#e3f2fd' : '#fafafa');
    rect(b.x, b.y, b.w, b.h, 10);

    noStroke();
    fill('#1a1a1a');
    textAlign(CENTER, CENTER);
    textSize(defaultTextSize);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2 - 10);

    fill('#666');
    textSize(13);
    const hint = b.key === 'qualitative' ? 'described in words' : 'has a number AND a unit';
    text(hint, b.x + b.w / 2, b.y + b.h / 2 + 12);
  }
  // keep home unused-var warnings away in strict readers
  return home;
}

function drawCard() {
  const home = cardHome();
  const x = cardPos ? cardPos.x : home.x;
  const y = cardPos ? cardPos.y : home.y;

  // card shadow / body
  stroke(answered ? (lastCorrect ? '#2e7d32' : '#c62828') : '#607d8b');
  strokeWeight(2);
  fill(answered ? (lastCorrect ? '#e8f5e9' : '#ffebee') : '#ffffff');
  rect(x, y, home.w, home.h, 8);

  noStroke();
  fill('#111');
  textAlign(CENTER, CENTER);
  textSize(20);
  text('"' + deck[cardIndex].text + '"', x + 10, y, home.w - 20, home.h);
}

function drawFeedback() {
  const top = 320;
  const h = drawHeight - top - 10;
  noStroke();
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(margin, top, canvasWidth - 2 * margin, h, 10);
  noStroke();

  textAlign(LEFT, TOP);
  textSize(defaultTextSize);
  if (feedbackText === '') {
    fill('#777');
    text('Feedback appears here after you sort the card.', margin + 12, top + 12,
         canvasWidth - 2 * margin - 24, h - 20);
  } else {
    // verdict line
    if (attemptedCount > 0 && cardIndex < deck.length) {
      fill(lastCorrect ? '#2e7d32' : '#c62828');
      textStyle(BOLD);
      text(lastCorrect ? 'Correct' : 'Not quite', margin + 12, top + 10);
      textStyle(NORMAL);
    }
    fill('#222');
    text(feedbackText, margin + 12, top + 32,
         canvasWidth - 2 * margin - 24, h - 40);
  }
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Score: ' + correctCount + ' of ' + attemptedCount +
       '   |   Card ' + (cardIndex + 1) + ' of ' + deck.length,
       140, drawHeight + 25);
}

// ---- judging ----

function judge(binKey) {
  if (answered) return;
  const card = deck[cardIndex];
  lastCorrect = (binKey === card.answer);
  attemptedCount++;
  if (lastCorrect) correctCount++;
  // The card's own feedback names the rule; prefix a correction when the
  // learner chose the wrong bin so the rule still lands.
  if (lastCorrect) {
    feedbackText = card.feedback;
  } else {
    const should = card.answer === 'qualitative'
      ? 'This belongs in Qualitative Observation. '
      : 'This belongs in Quantitative Data. ';
    feedbackText = should + card.feedback +
      '  Remember: quantitative data needs both a number AND a unit.';
  }
  answered = true;
  cardPos = null;
}

// ---- pointer handling (mouse and touch) ----

function mousePressed() {
  if (answered) return;
  const home = cardHome();
  const cx = cardPos ? cardPos.x : home.x;
  const cy = cardPos ? cardPos.y : home.y;
  if (mouseX >= cx && mouseX <= cx + home.w && mouseY >= cy && mouseY <= cy + home.h) {
    dragging = true;
    dragOffsetX = mouseX - cx;
    dragOffsetY = mouseY - cy;
  }
}

function mouseDragged() {
  if (dragging) {
    cardPos = { x: mouseX - dragOffsetX, y: mouseY - dragOffsetY };
  }
}

function mouseReleased() {
  if (dragging) {
    dragging = false;
    const bins = binRects();
    for (const b of bins) {
      if (pointInRect(mouseX, mouseY, b)) {
        judge(b.key);
        return;
      }
    }
    // dropped outside a bin - snap home
    cardPos = null;
    return;
  }
  // Not a drag: treat a tap on a bin as the choice (touch-friendly path)
  if (!answered) {
    const bins = binRects();
    for (const b of bins) {
      if (pointInRect(mouseX, mouseY, b)) {
        judge(b.key);
        return;
      }
    }
  }
}

// Route touch events through the mouse handlers and stop the page from
// scrolling while the learner drags the card.
function touchStarted() {
  mousePressed();
  return false;
}
function touchMoved() {
  mouseDragged();
  return false;
}
function touchEnded() {
  mouseReleased();
  return false;
}

// ---- responsive plumbing (must stay at the end) ----

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
