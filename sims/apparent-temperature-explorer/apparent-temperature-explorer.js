// Apparent Temperature Explorer - Chart.js
// CANVAS_HEIGHT: 530
// Bloom Level: Apply (L3) - the learner calculates apparent temperature from
// air temperature, wind and humidity, and explains why wind dominates in the
// cold and humidity dominates in the heat.
// Wind chill and heat index are drawn as two regimes of one surface rather than
// as two unrelated tables. Sources: the 2001 NWS / Environment Canada wind
// chill index, and the Rothfusz heat index regression with the NWS low and high
// humidity adjustments. Wet bulb temperature is Stull (2011).

(function () {
  'use strict';

  var chart = null;
  var view = 'Heatmap';
  var regime = 'cold';          // 'cold' or 'hot'
  var target = 'Person';
  var windUnit = 'm/s';
  var airT = -20;               // degrees C
  var windMs = 8;               // metres per second
  var rh = 70;                  // per cent
  var pinned = null;
  var notice = '';

  var T_MIN = -40, T_MAX = 50;
  var BAND_LO = 10, BAND_HI = 27;
  var W_MAX_MS = 30;

  var UNITS = { 'm/s': 1, 'km/h': 3.6, 'mph': 2.237, 'knots': 1.944 };

  var PRESETS = {
    'Minnesota January': { t: -20, w: 8, r: 70, reg: 'cold' },
    'Gulf Coast August': { t: 33, w: 2, r: 80, reg: 'hot' },
    'Sahara noon': { t: 45, w: 4, r: 10, reg: 'hot' },
    'British autumn': { t: 11, w: 6, r: 85, reg: 'cold' }
  };

  // ---- formatting (no p5 here, so nf must be local) ----
  function nf(v, l, r) {
    var neg = Number(v) < 0, a = Math.abs(Number(v));
    var s = (r === undefined) ? String(a) : a.toFixed(r);
    var p = s.split('.');
    while (p[0].length < (l || 1)) p[0] = '0' + p[0];
    return (neg ? '-' : '') + p.join('.');
  }
  function d1(v) { return (v >= 0 ? '' : '-') + Math.abs(v).toFixed(1); }

  // ---- physics -----------------------------------------------------------

  // 2001 NWS / Environment Canada wind chill. Defined for T <= 10 C and
  // wind above 4.8 km/h; below that the still-air value is the air temperature.
  function windChill(tC, vMs) {
    var vKmh = vMs * 3.6;
    if (vKmh < 4.8) return tC;
    var p = Math.pow(vKmh, 0.16);
    var wc = 13.12 + 0.6215 * tC - 11.37 * p + 0.3965 * tC * p;
    return Math.min(wc, tC);
  }

  // Rothfusz regression, in Fahrenheit internally, with the NWS adjustments.
  function heatIndex(tC, r) {
    var T = tC * 9 / 5 + 32;
    var simple = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + r * 0.094);
    if ((simple + T) / 2 < 80) return ((simple + T) / 2 - 32) * 5 / 9;
    var hi = -42.379 + 2.04901523 * T + 10.14333127 * r - 0.22475541 * T * r -
             6.83783e-3 * T * T - 5.481717e-2 * r * r + 1.22874e-3 * T * T * r +
             8.5282e-4 * T * r * r - 1.99e-6 * T * T * r * r;
    if (r < 13 && T >= 80 && T <= 112) {
      hi -= ((13 - r) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
    } else if (r > 85 && T >= 80 && T <= 87) {
      hi += ((r - 85) / 10) * ((87 - T) / 5);
    }
    return (hi - 32) * 5 / 9;
  }

  // Stull (2011) explicit wet bulb approximation, as used in Chapter 08.
  function wetBulb(tC, r) {
    return tC * Math.atan(0.151977 * Math.sqrt(r + 8.313659)) +
           Math.atan(tC + r) - Math.atan(r - 1.676331) +
           0.00391838 * Math.pow(r, 1.5) * Math.atan(0.023101 * r) - 4.686035;
  }

  function apparent(tC, vMs, r, reg) {
    if (tC > BAND_LO && tC < BAND_HI) return tC;
    if (reg === 'cold') return tC <= BAND_LO ? windChill(tC, vMs) : tC;
    return tC >= BAND_HI ? heatIndex(tC, r) : tC;
  }

  function coldRisk(wc) {
    if (wc >= -9) return ['Low risk', 'Frostbite is unlikely for most people.'];
    if (wc >= -27) return ['Low risk, uncomfortable',
                           'Exposed skin can freeze after long exposure.'];
    if (wc >= -39) return ['Increasing risk',
                           'Exposed skin can freeze in 10 to 30 minutes.'];
    if (wc >= -47) return ['High risk', 'Exposed skin can freeze in 5 to 10 minutes.'];
    if (wc >= -54) return ['Very high risk', 'Exposed skin can freeze in 2 to 5 minutes.'];
    return ['Extreme risk', 'Exposed skin can freeze in under 2 minutes.'];
  }

  function hotRisk(hi) {
    if (hi < 27) return ['No heat stress', 'Comfortable for most activity.'];
    if (hi < 32) return ['Caution', 'Fatigue possible with prolonged exertion.'];
    if (hi < 39) return ['Extreme caution', 'Heat cramps and heat exhaustion possible.'];
    if (hi < 52) return ['Danger', 'Heat exhaustion likely; heat stroke possible.'];
    return ['Extreme danger', 'Heat stroke is imminent.'];
  }

  // ---- colour ------------------------------------------------------------

  function divColour(d) {
    var t = Math.max(-1, Math.min(1, d / 25));
    var g = Math.sqrt(Math.abs(t));
    var a = [250, 250, 252];
    var b = t < 0 ? [13, 71, 161] : [183, 28, 28];
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * g) + ',' +
                    Math.round(a[1] + (b[1] - a[1]) * g) + ',' +
                    Math.round(a[2] + (b[2] - a[2]) * g) + ')';
  }

  // ---- UI ----------------------------------------------------------------

  function injectStyles() {
    var css = [
      '.at-wrap { font-family: Arial, Helvetica, sans-serif; padding: 6px 12px 4px 12px; }',
      '.at-title { margin: 2px 0; font-size: 20px; text-align: center; color: #212121; }',
      '.at-sub { margin: 0 0 5px 0; font-size: 11.5px; text-align: center; color: #546e7a;',
      '  min-height: 15px; }',
      '.at-sub.flag { color: #b8860b; font-weight: bold; }',
      '.at-row { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center;',
      '  align-items: center; margin-bottom: 4px; }',
      '.at-btn { font-family: inherit; font-size: 11.5px; padding: 4px 9px; cursor: pointer;',
      '  border: 1px solid #b0bec5; background: #fff; color: #37474f; border-radius: 4px; }',
      '.at-btn.active { background: #1565c0; border-color: #0d47a1; color: #fff; font-weight: bold; }',
      '.at-lab { font-size: 11.5px; color: #546e7a; }',
      '.at-sel { font-family: inherit; font-size: 11.5px; padding: 3px; }',
      '.at-chart { position: relative; height: 268px; cursor: crosshair; }',
      '.at-info { margin-top: 5px; height: 104px; overflow: hidden; font-size: 12.5px;',
      '  color: #263238; background: #eceff1; border-left: 4px solid #1565c0;',
      '  padding: 6px 10px; border-radius: 3px; line-height: 1.4; }',
      '.at-info b { color: #0d47a1; }',
      '.at-info .warn { color: #b71c1c; font-weight: bold; }',
      '.at-src { font-size: 10px; color: #78909c; text-align: center; margin-top: 3px; }',
      '@media (max-width: 560px) {',
      '  .at-chart { height: 224px; }',
      '  .at-info { font-size: 11px; height: 112px; }',
      '  .at-title { font-size: 16px; }',
      '  .at-btn, .at-sel, .at-lab { font-size: 10.5px; padding: 3px 6px; }',
      '  .at-src { font-size: 9px; }',
      '}'
    ].join('\n');
    var el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
  }

  function buildUI() {
    var main = document.querySelector('main');
    var w = document.createElement('div');
    w.className = 'at-wrap';
    var pres = Object.keys(PRESETS).map(function (k) {
      return '<button class="at-btn" data-preset="' + k + '">' + k + '</button>';
    }).join('');
    w.innerHTML =
      '<h3 class="at-title">Apparent Temperature Explorer</h3>' +
      '<div class="at-sub" id="at-notice"></div>' +
      '<div class="at-row">' + pres +
        '<button class="at-btn" id="at-pin">Pin this point</button>' +
        '<button class="at-btn" id="at-unpin">Clear pin</button></div>' +
      '<div class="at-row">' +
        '<button class="at-btn active" id="at-heat">Heatmap</button>' +
        '<button class="at-btn" id="at-cross">Cross-section</button>' +
        '<span class="at-lab">What is being cooled?</span>' +
        '<select class="at-sel" id="at-target">' +
          '<option>Person</option><option>Car</option><option>Water pipe</option></select>' +
        '<span class="at-lab">Wind unit</span>' +
        '<select class="at-sel" id="at-unit">' +
          '<option>m/s</option><option>km/h</option><option>mph</option>' +
          '<option>knots</option></select></div>' +
      '<div class="at-chart"><canvas id="at-canvas"></canvas></div>' +
      '<div class="at-info" id="at-info"></div>' +
      '<div class="at-src">Wind chill: 2001 NWS / Environment Canada index. ' +
      'Heat index: Rothfusz regression. Wet bulb: Stull (2011).</div>';
    main.appendChild(w);

    Array.prototype.forEach.call(w.querySelectorAll('[data-preset]'), function (b) {
      b.addEventListener('click', function () {
        var p = PRESETS[b.getAttribute('data-preset')];
        airT = p.t; windMs = p.w; rh = p.r;
        regime = p.reg; notice = '';
        render();
      });
    });
    document.getElementById('at-heat').addEventListener('click', function () {
      view = 'Heatmap'; render();
    });
    document.getElementById('at-cross').addEventListener('click', function () {
      view = 'Cross'; render();
    });
    document.getElementById('at-target').addEventListener('change', function (e) {
      target = e.target.value; render();
    });
    document.getElementById('at-unit').addEventListener('change', function (e) {
      windUnit = e.target.value; render();
    });
    document.getElementById('at-pin').addEventListener('click', function () {
      pinned = { t: airT, w: windMs, r: rh, reg: regime }; render();
    });
    document.getElementById('at-unpin').addEventListener('click', function () {
      pinned = null; render();
    });
  }

  function setRegimeFor(t, quiet) {
    var want = t >= BAND_HI ? 'hot' : (t <= BAND_LO ? 'cold' : regime);
    if (want !== regime) {
      regime = want;
      notice = quiet ? '' :
        'Regime switched to ' + (regime === 'hot' ? 'heat index' : 'wind chill') +
        '. The vertical axis is now ' +
        (regime === 'hot' ? 'relative humidity' : 'wind speed') + '.';
    } else if (!quiet) {
      notice = '';
    }
  }

  // ---- heatmap plugin ----------------------------------------------------

  var heatPlugin = {
    id: 'atheat',
    beforeDatasetsDraw: function (c) {
      if (view !== 'Heatmap') return;
      var ctx = c.ctx, a = c.chartArea, xs = c.scales.x, ys = c.scales.y;
      var NX = 84, NY = 34;
      var yLo = ys.min, yHi = ys.max;
      ctx.save();
      ctx.beginPath(); ctx.rect(a.left, a.top, a.right - a.left, a.bottom - a.top);
      ctx.clip();

      var isObject = target !== 'Person';
      for (var i = 0; i < NX; i++) {
        var t0 = T_MIN + (T_MAX - T_MIN) * i / NX;
        var t1 = T_MIN + (T_MAX - T_MIN) * (i + 1) / NX;
        var tm = (t0 + t1) / 2;
        var px0 = xs.getPixelForValue(t0), px1 = xs.getPixelForValue(t1);
        if (tm > BAND_LO && tm < BAND_HI) {
          ctx.fillStyle = '#d7dde2';
          ctx.fillRect(px0, a.top, px1 - px0 + 1, a.bottom - a.top);
          continue;
        }
        var applies = regime === 'cold' ? tm <= BAND_LO : tm >= BAND_HI;
        if (!applies) {
          ctx.fillStyle = '#eef1f3';
          ctx.fillRect(px0, a.top, px1 - px0 + 1, a.bottom - a.top);
          continue;
        }
        for (var j = 0; j < NY; j++) {
          var v0 = yLo + (yHi - yLo) * j / NY;
          var v1 = yLo + (yHi - yLo) * (j + 1) / NY;
          var vm = (v0 + v1) / 2;
          var py0 = ys.getPixelForValue(v1), py1 = ys.getPixelForValue(v0);
          var at;
          if (isObject) at = tm;
          else if (regime === 'cold') at = windChill(tm, vm / UNITS[windUnit]);
          else at = heatIndex(tm, vm);
          ctx.fillStyle = divColour(at - tm);
          ctx.fillRect(px0, py0, px1 - px0 + 1, py1 - py0 + 1);
        }
      }

      if (regime === 'hot' && !isObject) drawWetBulbZone(c);
      drawBandLabel(c);
      drawOtherRegimeLabel(c);
      if (isObject) drawObjectLabel(c);
      else drawColourBar(c);
      ctx.restore();
    },
    afterDatasetsDraw: function (c) {
      if (view !== 'Heatmap') return;
      var ctx = c.ctx, xs = c.scales.x, ys = c.scales.y;
      if (pinned && pinned.reg === regime) {
        markPoint(ctx, xs.getPixelForValue(pinned.t),
                  ys.getPixelForValue(secondaryOf(pinned)), '#6a1b9a', 'pin');
      }
      markPoint(ctx, xs.getPixelForValue(airT),
                ys.getPixelForValue(secondaryOf(null)), '#000000', 'probe');
    }
  };

  function secondaryOf(p) {
    var src = p || { w: windMs, r: rh };
    return regime === 'cold' ? src.w * UNITS[windUnit] : src.r;
  }

  function markPoint(ctx, px, py, col, kind) {
    ctx.save();
    ctx.lineWidth = 2; ctx.strokeStyle = col;
    ctx.beginPath(); ctx.arc(px, py, kind === 'pin' ? 6 : 8, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(px, py, kind === 'pin' ? 8 : 10.5, 0, Math.PI * 2); ctx.stroke();
    if (kind === 'pin') {
      ctx.fillStyle = col; ctx.font = 'bold 9px Arial'; ctx.textAlign = 'center';
      ctx.fillText('PIN', px, py - 11);
    }
    ctx.restore();
  }

  function drawWetBulbZone(c) {
    var ctx = c.ctx, a = c.chartArea, xs = c.scales.x, ys = c.scales.y;
    ctx.save();
    ctx.beginPath();
    var started = false;
    for (var t = BAND_HI; t <= T_MAX; t += 0.5) {
      var lo = null;
      for (var r = 0; r <= 100; r += 1) {
        if (wetBulb(t, r) >= 35) { lo = r; break; }
      }
      if (lo === null) continue;
      var px = xs.getPixelForValue(t), py = ys.getPixelForValue(lo);
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    if (!started) { ctx.restore(); return; }
    ctx.lineTo(xs.getPixelForValue(T_MAX), a.top);
    ctx.lineTo(xs.getPixelForValue(BAND_HI), a.top);
    ctx.closePath();
    ctx.fillStyle = 'rgba(38,0,0,0.55)';
    ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
    // The caption is drawn outside the zone's clip so it cannot be cut in half
    // when the zone is narrow.
    ctx.save();
    var lines = ['Wet bulb above 35 C', 'Evaporative cooling fails.',
                 'Survivable for only a few hours, even at rest.'];
    ctx.font = '9px Arial';
    var wMax = 0;
    for (var k = 0; k < lines.length; k++) wMax = Math.max(wMax, ctx.measureText(lines[k]).width);
    var rx = a.right - 6 - wMax - 6, ry = a.top + 4;
    ctx.fillStyle = 'rgba(20,0,0,0.78)';
    ctx.fillRect(rx, ry, wMax + 12, 12 * lines.length + 8);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'right';
    ctx.font = 'bold 9px Arial';
    ctx.fillText(lines[0], a.right - 12, ry + 13);
    ctx.font = '9px Arial';
    ctx.fillText(lines[1], a.right - 12, ry + 25);
    ctx.fillText(lines[2], a.right - 12, ry + 37);
    ctx.restore();
  }

  function drawBandLabel(c) {
    var ctx = c.ctx, a = c.chartArea, xs = c.scales.x;
    var x0 = xs.getPixelForValue(BAND_LO), x1 = xs.getPixelForValue(BAND_HI);
    var cx = (x0 + x1) / 2;
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, a.top, x1 - x0, a.bottom - a.top); ctx.clip();
    ctx.fillStyle = '#455a64'; ctx.textAlign = 'center';
    if (x1 - x0 < 100) {
      // Rotated, so the constraint is the plot height, not the band width.
      ctx.translate(cx, (a.top + a.bottom) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.font = 'bold 10px Arial';
      var avail = a.bottom - a.top - 10;
      var lab = 'Neither correction applies';
      if (ctx.measureText(lab).width > avail) lab = 'No correction here';
      if (ctx.measureText(lab).width > avail) lab = 'Neutral';
      ctx.fillText(lab, 0, 4);
    } else {
      ctx.font = 'bold 9.5px Arial';
      var lines = ['Neither correction', 'applies here.', 'Wind is pleasant,',
                   'humidity is tolerable.'];
      var y = (a.top + a.bottom) / 2 - 22;
      for (var i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], cx, y + i * 12);
        ctx.font = '9.5px Arial';
      }
    }
    ctx.restore();
  }

  function drawOtherRegimeLabel(c) {
    var ctx = c.ctx, a = c.chartArea, xs = c.scales.x;
    var cold = regime === 'cold';
    var x0 = xs.getPixelForValue(cold ? BAND_HI : T_MIN);
    var x1 = xs.getPixelForValue(cold ? T_MAX : BAND_LO);
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, a.top, x1 - x0, a.bottom - a.top); ctx.clip();
    ctx.fillStyle = '#90a4ae'; ctx.textAlign = 'center'; ctx.font = 'bold 10px Arial';
    var cx = (x0 + x1) / 2, cy = (a.top + a.bottom) / 2;
    ctx.fillText(cold ? 'Heat index regime' : 'Wind chill regime', cx, cy - 7);
    ctx.font = '9.5px Arial';
    ctx.fillText('Click here to switch', cx, cy + 7);
    ctx.restore();
  }

  function drawObjectLabel(c) {
    var ctx = c.ctx, a = c.chartArea;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.86)';
    var w = Math.min(340, a.right - a.left - 20);
    var cx = (a.left + a.right) / 2, cy = (a.top + a.bottom) / 2;
    ctx.fillRect(cx - w / 2, cy - 26, w, 52);
    ctx.strokeStyle = '#b71c1c'; ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - w / 2, cy - 26, w, 52);
    ctx.fillStyle = '#b71c1c'; ctx.textAlign = 'center'; ctx.font = 'bold 11px Arial';
    ctx.fillText('Every column is flat.', cx, cy - 8);
    ctx.font = '10.5px Arial'; ctx.fillStyle = '#37474f';
    ctx.fillText('A ' + target.toLowerCase() + ' has no dependence on ' +
                 (regime === 'cold' ? 'wind speed' : 'humidity') + '.', cx, cy + 8);
    ctx.fillText('It reaches the air temperature and stops.', cx, cy + 21);
    ctx.restore();
  }

  function drawColourBar(c) {
    var ctx = c.ctx, a = c.chartArea;
    var bw = Math.min(120, (a.right - a.left) * 0.34), bh = 9;
    var x = regime === 'cold' ? a.left + 8 : a.right - bw - 8;
    var y = a.bottom - bh - 18;
    ctx.save();
    // The key sits on top of the map, so it needs its own backing to stay legible.
    ctx.fillStyle = 'rgba(255,255,255,0.86)';
    ctx.fillRect(x - 5, y - 13, bw + 10, bh + 18);
    for (var i = 0; i < bw; i++) {
      ctx.fillStyle = divColour(-25 + 50 * i / bw);
      ctx.fillRect(x + i, y, 1.4, bh);
    }
    ctx.strokeStyle = '#546e7a'; ctx.lineWidth = 1; ctx.strokeRect(x, y, bw, bh);
    ctx.fillStyle = '#37474f'; ctx.font = '8.5px Arial';
    ctx.textAlign = 'left'; ctx.fillText('25 colder', x, y - 2);
    ctx.textAlign = 'right'; ctx.fillText('25 warmer', x + bw, y - 2);
    ctx.restore();
  }

  // ---- chart -------------------------------------------------------------

  function heatConfig() {
    var yTitle = regime === 'cold' ? 'Wind speed (' + windUnit + ')'
                                   : 'Relative humidity (per cent)';
    var yMax = regime === 'cold' ? W_MAX_MS * UNITS[windUnit] : 100;
    return {
      type: 'scatter',
      data: { datasets: [{ data: [], showLine: false, pointRadius: 0 }] },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        events: [], plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { type: 'linear', min: T_MIN, max: T_MAX,
               title: { display: true, text: 'Air temperature (C)', font: { size: 11 } },
               ticks: { font: { size: 10 } }, grid: { display: false } },
          y: { type: 'linear', min: 0, max: yMax,
               title: { display: true, text: yTitle, font: { size: 11 } },
               ticks: { font: { size: 10 } }, grid: { display: false } }
        }
      },
      plugins: [heatPlugin]
    };
  }

  function crossConfig() {
    var cold = regime === 'cold';
    var xs = [], at = [], air = [];
    var n = 60;
    for (var i = 0; i <= n; i++) {
      var v = cold ? (W_MAX_MS * UNITS[windUnit]) * i / n : 100 * i / n;
      xs.push(v);
      at.push(cold ? windChill(airT, v / UNITS[windUnit]) : heatIndex(airT, v));
      air.push(airT);
    }
    if (target !== 'Person') at = air.slice();
    var lo = Math.min.apply(null, at.concat(air)) - 3;
    var hi = Math.max.apply(null, at.concat(air)) + 3;
    if (hi - lo < 10) { var m = (hi + lo) / 2; lo = m - 5; hi = m + 5; }
    lo = Math.floor(lo / 5) * 5; hi = Math.ceil(hi / 5) * 5;
    return {
      type: 'line',
      data: {
        labels: xs,
        datasets: [
          { label: 'Feels like', data: at, borderColor: '#c62828', borderWidth: 2.5,
            pointRadius: 0, tension: 0.2 },
          { label: 'Air temperature', data: air, borderColor: '#546e7a',
            borderWidth: 1.6, borderDash: [6, 4], pointRadius: 0 },
          { label: 'This point', data: xs.map(function (v) {
              return Math.abs(v - secondaryOf(null)) < (cold ? 0.4 : 1.2) ?
                     apparent(airT, windMs, rh, regime) : null;
            }), borderColor: '#000', backgroundColor: '#000',
            pointRadius: 4, showLine: false }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: true, labels: { boxWidth: 18, font: { size: 10.5 } } },
          title: { display: true, font: { size: 11.5 },
                   text: 'Cross-section at ' + d1(airT) + ' C air temperature' }
        },
        scales: {
          x: { type: 'linear', min: 0,
               max: cold ? W_MAX_MS * UNITS[windUnit] : 100,
               title: { display: true, font: { size: 11 },
                        text: cold ? 'Wind speed (' + windUnit + ')'
                                   : 'Relative humidity (per cent)' },
               ticks: { font: { size: 10 } } },
          y: { min: lo, max: hi,
               title: { display: true, text: 'Apparent temperature (C)',
                        font: { size: 11 } },
               ticks: { font: { size: 10 }, precision: 0 } }
        }
      }
    };
  }

  // ---- readout -----------------------------------------------------------

  function describeState() {
    var cold = regime === 'cold';
    var inBand = airT > BAND_LO && airT < BAND_HI;
    var at = apparent(airT, windMs, rh, regime);
    var wDisp = d1(windMs * UNITS[windUnit]) + ' ' + windUnit;
    var head = '<b>' + d1(airT) + ' C air</b>, ' +
               (cold ? 'wind ' + wDisp : 'humidity ' + Math.round(rh) + ' per cent');
    var out = [];

    if (target !== 'Person') {
      out.push(head + ' &mdash; cooling a ' + target.toLowerCase());
      out.push('<b>It reaches ' + d1(airT) + ' C</b>, the air temperature.');
      out.push('<span class="warn">Objects cool to the air temperature, not to the ' +
               'wind chill.</span> Wind chill is a rate of heat loss from a warm ' +
               'body, not a temperature the air reaches.');
      if (target === 'Water pipe') {
        out.push('A pipe freezes when the air reaches 0 C. Wind only changes how ' +
                 'quickly it gets there.');
      }
      return out.join('<br>');
    }

    out.push(head);
    if (inBand) {
      out.push('<b>Feels like ' + d1(airT) + ' C</b> &mdash; no correction applies.');
      out.push('Between ' + BAND_LO + ' and ' + BAND_HI + ' C, wind is pleasant ' +
               'rather than dangerous and sweat evaporates freely. Neither ' +
               'formula is defined here.');
      return out.join('<br>');
    }

    var diff = at - airT;
    var word = diff < -0.05 ? 'colder' : (diff > 0.05 ? 'warmer' : 'the same');
    out.push('<b>Feels like ' + d1(at) + ' C</b> &mdash; ' +
             (word === 'the same' ? 'the same as the thermometer'
              : d1(Math.abs(diff)) + ' degrees ' + word + ' than the thermometer'));

    var risk = cold ? coldRisk(at) : hotRisk(at);
    out.push('<b>' + risk[0] + '.</b> ' + risk[1]);

    if (cold) {
      if (windMs * 3.6 < 4.8) {
        out.push('Below 4.8 km/h the wind chill index is not defined, so the ' +
                 'reading is simply the air temperature.');
      } else {
        out.push('Wind is stripping away the warm air film against your skin ' +
                 'faster than your body can rebuild it.');
      }
    } else {
      var tw = wetBulb(airT, rh);
      if (tw >= 35) {
        out.push('<span class="warn">Wet bulb ' + d1(tw) + ' C.</span> Sweat cannot ' +
                 'evaporate fast enough to shed metabolic heat at any exertion level.');
      } else {
        out.push('Humidity is slowing the evaporation of sweat, which is how you ' +
                 'shed heat. Wet bulb ' + d1(tw) + ' C.');
      }
    }

    if (pinned) {
      var pat = apparent(pinned.t, pinned.w, pinned.r, pinned.reg);
      var pd = at - pat;
      out.push('<b>Pin:</b> ' + d1(pinned.t) + ' C, ' +
               (pinned.reg === 'cold' ? d1(pinned.w * UNITS[windUnit]) + ' ' + windUnit
                                      : Math.round(pinned.r) + ' per cent') +
               ' feels ' + d1(pat) + ' C. This point is ' + d1(Math.abs(pd)) +
               ' degrees ' + (pd < 0 ? 'harsher' : 'milder') + '.');
    }
    return out.join('<br>');
  }

  // ---- render ------------------------------------------------------------

  function render() {
    document.getElementById('at-heat').classList.toggle('active', view === 'Heatmap');
    document.getElementById('at-cross').classList.toggle('active', view !== 'Heatmap');
    var nt = document.getElementById('at-notice');
    nt.textContent = notice || (regime === 'cold'
      ? 'Wind chill regime: the vertical axis is wind speed.'
      : 'Heat index regime: the vertical axis is relative humidity.');
    nt.className = 'at-sub' + (notice ? ' flag' : '');

    if (chart) { chart.destroy(); chart = null; }
    var ctx = document.getElementById('at-canvas').getContext('2d');
    chart = new Chart(ctx, view === 'Heatmap' ? heatConfig() : crossConfig());
    document.getElementById('at-info').innerHTML = describeState();
  }

  function attachProbe() {
    var cv = document.getElementById('at-canvas');
    var down = false;
    function pick(ev) {
      if (!chart || view !== 'Heatmap') return;
      var r = cv.getBoundingClientRect();
      var px = ev.clientX - r.left, py = ev.clientY - r.top;
      var a = chart.chartArea;
      if (px < a.left || px > a.right || py < a.top || py > a.bottom) return;
      var t = chart.scales.x.getValueForPixel(px);
      var v = chart.scales.y.getValueForPixel(py);
      airT = Math.max(T_MIN, Math.min(T_MAX, t));
      if (regime === 'cold') windMs = Math.max(0, Math.min(W_MAX_MS, v / UNITS[windUnit]));
      else rh = Math.max(0, Math.min(100, v));
      setRegimeFor(airT, false);
      render();
    }
    cv.addEventListener('mousedown', function (e) { down = true; pick(e); });
    cv.addEventListener('mousemove', function (e) { if (down) pick(e); });
    window.addEventListener('mouseup', function () { down = false; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    buildUI();
    render();
    attachProbe();
  });
})();
