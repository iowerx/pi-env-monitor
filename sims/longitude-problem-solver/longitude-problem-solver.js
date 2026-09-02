// The Longitude Problem Solver MicroSim
// CANVAS_HEIGHT: 600
// Bloom Level: Apply (L3) - the learner calculates longitude from a time
// difference and evaluates what a given clock error costs in kilometres.
// Parameter entry with an immediately visible worked result. Showing the true
// and calculated positions at the same time is what turns an arithmetic slip
// into a navigational consequence.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;
let sliderLeftMargin = 210;

const NARROW_BREAKPOINT = 660;
const KM_PER_DEG = 111.32;

// ---- controls ----
let errorSlider;
let h4Button, pendulumButton, scillyButton, zeroButton;

// ---- state ----
let shipLon = -50;            // degrees, negative west
let shipLat = 0;
let caption = '';
let dragging = false;
let mapRect = { x: 0, y: 0, w: 1, h: 1 };

// A deliberately coarse world outline, drawn from coordinates rather than an
// image file so the sim has no external assets.
const LAND = [
  [[-168,66],[-160,71],[-140,70],[-125,70],[-100,70],[-85,73],[-75,68],[-60,58],
   [-55,52],[-65,45],[-70,42],[-75,35],[-81,25],[-97,26],[-105,20],[-115,30],
   [-125,40],[-130,55],[-145,60],[-160,58]],
  [[-80,10],[-70,12],[-60,8],[-50,0],[-35,-5],[-38,-15],[-48,-25],[-58,-35],
   [-63,-45],[-70,-55],[-75,-45],[-72,-35],[-70,-20],[-75,-10],[-80,0]],
  [[-17,15],[-5,35],[10,37],[25,32],[35,30],[43,12],[52,12],[42,-5],[40,-20],
   [33,-28],[20,-35],[12,-18],[8,4],[-8,5]],
  [[-10,36],[0,50],[5,58],[15,68],[30,70],[60,70],[90,75],[130,72],[160,68],
   [170,60],[140,45],[122,40],[120,25],[105,10],[95,15],[80,8],[70,20],[60,25],
   [48,30],[35,35],[28,40],[15,42],[3,42]],
  [[-8,55],[-5,58],[-2,57],[0,53],[1,51],[-5,50],[-8,52]],
  [[113,-22],[122,-18],[130,-12],[142,-11],[145,-18],[153,-27],[150,-37],
   [141,-38],[130,-32],[115,-34]],
  [[-45,60],[-30,68],[-22,72],[-25,80],[-40,83],[-58,82],[-60,75],[-55,66]],
  [[-180,-70],[180,-70],[180,-90],[-180,-90]]
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  // seconds, not minutes: Harrison's H4 was out by five seconds and the slider
  // has to be able to express that
  errorSlider = createSlider(-600, 600, 0, 1);

  h4Button = createButton('H4, 1761');
  h4Button.mousePressed(function () {
    errorSlider.value(5);
    caption = "Harrison's H4 lost about five seconds over 81 days at sea. Look at the " +
              'zoomed inset - the error is there, it is just very small.';
  });

  pendulumButton = createButton('Pendulum');
  pendulumButton.mousePressed(function () {
    errorSlider.value(300);
    caption = 'A pendulum clock keeps beautiful time on land and useless time on a ' +
              'rolling deck. Five minutes out is an ordinary day at sea.';
  });

  scillyButton = createButton('Scilly, 1707');
  scillyButton.mousePressed(function () {
    shipLon = -6.3;
    shipLat = 49.9;
    errorSlider.value(336);
    caption = 'Isles of Scilly, October 1707. Four ships lost: Association, Eagle, ' +
              'Romney, Firebrand. Historians now blame dead reckoning and weather as ' +
              'much as longitude.';
  });

  zeroButton = createButton('Zero');
  zeroButton.mousePressed(function () { errorSlider.value(0); caption = ''; });

  layoutControls();

  describe('A simplified world map with a 15-degree meridian grid. Dragging the ship ' +
           'sets its true longitude and latitude; two clock faces show local noon and ' +
           'the chronometer, and the panel works the calculation through from the time ' +
           'difference to a longitude. A clock-error slider moves only the calculated ' +
           'position, and the distance between true and calculated is reported in ' +
           'kilometres, recomputed for the current latitude.', LABEL);
}

function layoutControls() {
  const r1 = drawHeight + 8;
  const r2 = drawHeight + 46;
  errorSlider.position(sliderLeftMargin, r1 + 4);
  errorSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  h4Button.position(10, r2);
  pendulumButton.position(90, r2);
  scillyButton.position(174, r2);
  zeroButton.position(268, r2);
}

// ---- the arithmetic -----------------------------------------------------

function errSeconds() { return errorSlider.value(); }

// At local noon the chronometer should read 12:00 minus the longitude in hours.
function greenwichAtLocalNoon() {
  return 12 - shipLon / 15;          // hours, may run outside 0..24
}

function calcLon() {
  // the navigator subtracts what the chronometer says, and the chronometer is wrong
  return shipLon - (errSeconds() / 3600) * 15;
}

function kmPerDegLon() {
  return KM_PER_DEG * cos(radians(shipLat));
}

function positionErrorKm() {
  return abs(calcLon() - shipLon) * kmPerDegLon();
}

function hmsOf(hoursFloat) {
  let h = ((hoursFloat % 24) + 24) % 24;
  const total = Math.round(h * 3600);
  const hh = floor(total / 3600) % 24;
  const mm = floor((total % 3600) / 60);
  const ss = total % 60;
  return nf(hh, 2) + ':' + nf(mm, 2) + ':' + nf(ss, 2);
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
  textSize(narrow ? 18 : 24);
  text('The Longitude Problem', canvasWidth / 2, narrow ? 8 : 6);

  const top = narrow ? 32 : 38;
  const mapW = min(canvasWidth - 2 * margin, 2 * (drawHeight - top - 210));
  const mapH = mapW / 2;
  mapRect = { x: (canvasWidth - mapW) / 2, y: top, w: mapW, h: mapH };
  drawMap(mapRect);

  const belowY = top + mapH + 8;
  const belowH = drawHeight - belowY - 8;
  if (narrow) {
    drawClocks({ x: margin, y: belowY, w: canvasWidth - 2 * margin, h: 88 }, true);
    drawCalc({ x: margin, y: belowY + 92, w: canvasWidth - 2 * margin, h: belowH - 92 }, true);
  } else {
    const cw = min(300, (canvasWidth - 2 * margin) * 0.42);
    drawClocks({ x: margin, y: belowY, w: cw, h: belowH }, false);
    drawCalc({ x: margin + cw + 10, y: belowY,
               w: canvasWidth - margin - (margin + cw + 10), h: belowH }, false);
  }
  drawControlLabels();
}

function lonToX(box, lon) { return map(lon, -180, 180, box.x, box.x + box.w); }
function latToY(box, lat) { return map(lat, 90, -90, box.y, box.y + box.h); }

function drawMap(box) {
  noStroke();
  fill('#cfe3f5');
  rect(box.x, box.y, box.w, box.h, 3);

  // land
  fill('#c8dcae');
  stroke('#8ba86a');
  strokeWeight(0.8);
  for (let i = 0; i < LAND.length; i++) {
    beginShape();
    for (let k = 0; k < LAND[i].length; k++) {
      vertex(lonToX(box, LAND[i][k][0]), latToY(box, LAND[i][k][1]));
    }
    endShape(CLOSE);
  }

  // meridians every 15 degrees, with the prime meridian picked out
  for (let lon = -180; lon <= 180; lon += 15) {
    stroke(lon === 0 ? '#c62828' : 'rgba(70,90,110,0.28)');
    strokeWeight(lon === 0 ? 1.6 : 0.7);
    line(lonToX(box, lon), box.y, lonToX(box, lon), box.y + box.h);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    stroke(lat === 0 ? 'rgba(70,90,110,0.55)' : 'rgba(70,90,110,0.28)');
    strokeWeight(lat === 0 ? 1.2 : 0.7);
    line(box.x, latToY(box, lat), box.x + box.w, latToY(box, lat));
  }
  noStroke();
  fill('rgba(255,255,255,0.8)');
  rect(lonToX(box, 0) - 27, box.y + 2, 54, 12, 2);
  fill('#c62828');
  textAlign(CENTER, TOP);
  textSize(9);
  text('Greenwich', lonToX(box, 0), box.y + 4);

  // calculated position first, so the true position sits on top of it
  const cx = lonToX(box, constrain(calcLon(), -180, 180));
  const cy = latToY(box, shipLat);
  const tx = lonToX(box, shipLon);
  const ty = latToY(box, shipLat);

  if (abs(cx - tx) > 0.5) {
    stroke('#e65100');
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 3]);
    line(tx, ty, cx, cy);
    drawingContext.setLineDash([]);
  }

  noStroke();
  fill('#e65100');
  circle(cx, cy, 11);
  fill('#0d47a1');
  circle(tx, ty, 11);
  fill('white');
  circle(tx, ty, 4);

  // legend
  noStroke();
  fill('rgba(255,255,255,0.85)');
  rect(box.x + 3, box.y + box.h - 30, 150, 27, 3);
  fill('#0d47a1');
  circle(box.x + 12, box.y + box.h - 22, 8);
  fill('#e65100');
  circle(box.x + 12, box.y + box.h - 11, 8);
  fill('#263238');
  textAlign(LEFT, CENTER);
  textSize(9);
  text('where the ship really is', box.x + 20, box.y + box.h - 22);
  text('where it thinks it is', box.x + 20, box.y + box.h - 11);

  noStroke();
  fill('rgba(255,255,255,0.85)');
  rect(box.x + box.w - 168, box.y + box.h - 16, 165, 14, 2);
  fill('#455a64');
  textAlign(RIGHT, TOP);
  textSize(9);
  text('drag the blue marker to move the ship', box.x + box.w - 6, box.y + box.h - 14);

  drawZoomInset(box);

  stroke('#90a4ae');
  strokeWeight(1);
  noFill();
  rect(box.x, box.y, box.w, box.h, 3);
  noStroke();
}

// A magnified view of the two markers. At world scale a hundred kilometres is
// roughly one pixel, so without this the error is invisible exactly when it
// matters most.
function drawZoomInset(box) {
  const side = min(126, box.w * 0.3, box.h * 0.56);
  const ix = box.x + box.w - side - 6;
  const iy = box.y + 6;
  const dKm = positionErrorKm();
  const spanKm = max(dKm * 3.2, 20);          // never divide by zero
  const kmToPx = (side - 26) / spanKm;

  noStroke();
  fill('rgba(255,255,255,0.94)');
  rect(ix, iy, side, side, 4);
  stroke('#78909c');
  strokeWeight(1);
  noFill();
  rect(ix, iy, side, side, 4);

  const cx = ix + side / 2;
  const cy = iy + side * 0.5;
  const dx = (calcLon() - shipLon) * kmPerDegLon() * kmToPx;

  noStroke();
  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(9);
  text('zoomed in', ix + 5, iy + 3);

  if (abs(dx) > 1) {
    stroke('#e65100');
    strokeWeight(1.5);
    drawingContext.setLineDash([3, 3]);
    line(cx, cy, cx + dx, cy);
    drawingContext.setLineDash([]);
  }
  noStroke();
  fill('#e65100');
  circle(cx + dx, cy, 9);
  fill('#0d47a1');
  circle(cx, cy, 9);
  fill('white');
  circle(cx, cy, 3);

  // scale bar
  const barKm = niceScale(spanKm / 3);
  const barPx = barKm * kmToPx;
  stroke('#455a64');
  strokeWeight(1.5);
  line(ix + 8, iy + side - 14, ix + 8 + barPx, iy + side - 14);
  line(ix + 8, iy + side - 17, ix + 8, iy + side - 11);
  line(ix + 8 + barPx, iy + side - 17, ix + 8 + barPx, iy + side - 11);
  noStroke();
  fill('#455a64');
  textAlign(LEFT, TOP);
  textSize(9);
  text(barKm + ' km', ix + 8, iy + side - 11);
}

function niceScale(v) {
  const pow10 = Math.pow(10, floor(Math.log10(max(v, 0.001))));
  const n = v / pow10;
  const step = n < 1.5 ? 1 : (n < 3.5 ? 2 : (n < 7.5 ? 5 : 10));
  return step * pow10;
}

function drawClocks(box, stacked) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const gw = greenwichAtLocalNoon() + errSeconds() / 3600;
  const r = stacked ? 22 : min(46, (box.h - 46) / 2);
  const cy = stacked ? box.y + 42 : box.y + 30 + r;
  const c1x = box.x + box.w * 0.27;
  const c2x = box.x + box.w * 0.73;

  fill('#546e7a');
  textAlign(CENTER, TOP);
  textSize(10);
  text('Local noon, from the Sun', c1x, box.y + 6);
  text('Your chronometer', c2x, box.y + 6);

  clockFace(c1x, cy, r, 12);
  clockFace(c2x, cy, r, gw);

  fill('#212121');
  textAlign(CENTER, TOP);
  textSize(13);
  text('12:00:00', c1x, cy + r + 6);
  fill(errSeconds() === 0 ? '#212121' : '#e65100');
  text(hmsOf(gw), c2x, cy + r + 6);

  if (!stacked) {
    fill('#546e7a');
    textAlign(CENTER, TOP);
    textSize(10);
    const foot = 'The Sun tells you it is noon here. The chronometer tells you what time ' +
                 'it is in Greenwich. The gap is your longitude.';
    text(wrapText(foot, box.w - 20, 10), box.x + box.w / 2, cy + r + 26);
  }
}

function clockFace(cx, cy, r, hoursFloat) {
  stroke('#455a64');
  strokeWeight(1.5);
  fill('#fafafa');
  circle(cx, cy, r * 2);
  noStroke();
  fill('#90a4ae');
  for (let i = 0; i < 12; i++) {
    const a = -HALF_PI + i * TWO_PI / 12;
    circle(cx + cos(a) * r * 0.84, cy + sin(a) * r * 0.84, 2);
  }
  const h = ((hoursFloat % 12) + 12) % 12;
  const m = (((hoursFloat * 60) % 60) + 60) % 60;
  const s = (((hoursFloat * 3600) % 60) + 60) % 60;
  stroke('#263238');
  strokeWeight(3);
  let a = -HALF_PI + (h + m / 60) * TWO_PI / 12;
  line(cx, cy, cx + cos(a) * r * 0.48, cy + sin(a) * r * 0.48);
  strokeWeight(2);
  a = -HALF_PI + m * TWO_PI / 60;
  line(cx, cy, cx + cos(a) * r * 0.72, cy + sin(a) * r * 0.72);
  stroke('#c62828');
  strokeWeight(1);
  a = -HALF_PI + s * TWO_PI / 60;
  line(cx, cy, cx + cos(a) * r * 0.78, cy + sin(a) * r * 0.78);
  noStroke();
  fill('#263238');
  circle(cx, cy, 4);
}

function drawCalc(box, narrow) {
  stroke('#cfd8dc');
  strokeWeight(1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 6);
  noStroke();

  const gwTrue = greenwichAtLocalNoon();
  const gwRead = gwTrue + errSeconds() / 3600;
  const diff = 12 - gwRead;                   // hours, positive means east
  const lonCalc = diff * 15;
  const totalSec = Math.round(abs(diff) * 3600);
  const dh = floor(totalSec / 3600);
  const dm = floor((totalSec % 3600) / 60);
  const ds = totalSec % 60;
  const dirWord = lonCalc < 0 ? 'West' : 'East';
  const z = narrow ? 11 : 12;
  let y = box.y + 8;

  fill('#546e7a');
  textAlign(LEFT, TOP);
  textSize(z);
  text('The calculation', box.x + 10, y);
  y += z + 6;

  fill('#212121');
  textSize(narrow ? 12 : 13);
  text('12:00:00  -  ' + hmsOf(gwRead) + '  =  ' + dh + ' h ' + nf(dm, 2) + ' m ' +
       nf(ds, 2) + ' s', box.x + 10, y);
  y += 18;
  text('= ' + nf(abs(diff), 1, 4) + ' h  x  15 deg/h  =  ' + nf(abs(lonCalc), 1, 2) +
       ' deg ' + dirWord, box.x + 10, y);
  y += 22;

  fill('#546e7a');
  textSize(z);
  text('True position', box.x + 10, y);
  fill('#0d47a1');
  textAlign(RIGHT, TOP);
  text(nf(abs(shipLon), 1, 2) + ' deg ' + (shipLon < 0 ? 'W' : 'E') + ',  ' +
       nf(abs(shipLat), 1, 1) + ' deg ' + (shipLat < 0 ? 'S' : 'N'), box.x + box.w - 10, y);
  y += 16;
  textAlign(LEFT, TOP);
  fill('#546e7a');
  text('Calculated position', box.x + 10, y);
  fill('#e65100');
  textAlign(RIGHT, TOP);
  text(nf(abs(lonCalc), 1, 2) + ' deg ' + dirWord, box.x + box.w - 10, y);
  y += 20;

  textAlign(LEFT, TOP);
  const errKm = positionErrorKm();
  fill(errKm > 20 ? '#b71c1c' : '#1b5e20');
  textSize(narrow ? 14 : 16);
  text('You are out by ' + (errKm < 10 ? nf(errKm, 1, 1) : nf(errKm, 1, 0)) + ' km',
       box.x + 10, y);
  y += 22;

  // the error budget line, recomputed for the current latitude
  fill('#455a64');
  textSize(z);
  const budget = '1 minute of clock error = 0.25 deg of longitude = ' +
                 nf(0.25 * kmPerDegLon(), 1, 1) + ' km at ' + nf(abs(shipLat), 1, 0) +
                 ' deg ' + (shipLat < 0 ? 'S' : 'N') +
                 '. The kilometre cost shrinks with the cosine of latitude.';
  const bl = wrapText(budget, box.w - 20, z);
  text(bl, box.x + 10, y);
  y += bl.split('\n').length * (z + 3) + 4;

  if (caption !== '') {
    fill('#00695c');
    textSize(z - 1);
    text(wrapText(caption, box.w - 20, z - 1), box.x + 10, y);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  const e = errSeconds();
  const sign = e > 0 ? '+' : (e < 0 ? '-' : '');
  const a = abs(e);
  const disp = a >= 60 ? (floor(a / 60) + ' m ' + nf(a % 60, 2) + ' s') : (a + ' s');
  text('Clock error: ' + sign + disp, 10, drawHeight + 22);

}

// ---- interaction --------------------------------------------------------

function mousePressed() {
  if (mouseX > mapRect.x && mouseX < mapRect.x + mapRect.w &&
      mouseY > mapRect.y && mouseY < mapRect.y + mapRect.h) {
    dragging = true;
    setShipFromMouse();
  }
}
function mouseDragged() { if (dragging) setShipFromMouse(); }
function mouseReleased() { dragging = false; }

function setShipFromMouse() {
  shipLon = constrain(map(mouseX, mapRect.x, mapRect.x + mapRect.w, -180, 180), -180, 180);
  shipLat = constrain(map(mouseY, mapRect.y, mapRect.y + mapRect.h, 90, -90), -85, 85);
  caption = '';
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
