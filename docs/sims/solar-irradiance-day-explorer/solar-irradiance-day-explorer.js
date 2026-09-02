// Solar Irradiance Through the Day - Chart.js
// CANVAS_HEIGHT: 606
// Bloom Level: Analyze (L4) - the learner compares irradiance curves across
// season, latitude and cloud, and explains why the temperature peak arrives
// hours after the irradiance peak.
// Irradiance and air temperature share one time axis so the thermal lag is a
// horizontal offset you can measure rather than a fact you are told. The
// irradiance axis is fixed at 0 to 1100 across every scenario, so a shorter
// curve is always genuinely less energy.

(function () {
  'use strict';

  var chart = null;
  var lat = 45, doy = 172, sky = 'Clear';
  var integrate = false;
  var pinned = null;
  var picked = null;

  var STEP = 10;                       // minutes
  var N = 24 * 60 / STEP + 1;

  var DATES = { 'March equinox': 79, 'June solstice': 172,
                'September equinox': 265, 'December solstice': 355 };
  var LATS = [0, 23.5, 45, 60, 66.5];

  function nf(v, l, r) {
    var neg = Number(v) < 0, a = Math.abs(Number(v));
    var s = (r === undefined) ? String(a) : a.toFixed(r);
    var p = s.split('.');
    while (p[0].length < (l || 1)) p[0] = '0' + p[0];
    return (neg ? '-' : '') + p.join('.');
  }
  function rad(d) { return d * Math.PI / 180; }
  function hourOf(i) { return i * STEP / 60; }
  function hhmm(h) {
    return nf(Math.floor(h), 2) + ':' + nf(Math.round((h % 1) * 60), 2);
  }

  function declination(d) {
    return 23.44 * Math.sin(rad(360 / 365 * (d - 81)));
  }

  function cosZ(latDeg, d, h) {
    var dec = rad(declination(d));
    var H = rad(15 * (h - 12));
    return Math.sin(rad(latDeg)) * Math.sin(dec) +
           Math.cos(rad(latDeg)) * Math.cos(dec) * Math.cos(H);
  }

  function airMass(cz) {
    if (cz <= 0) return 40;
    var zdeg = Math.acos(Math.min(1, cz)) * 180 / Math.PI;
    return 1 / (cz + 0.50572 * Math.pow(96.07995 - zdeg, -1.6364));
  }

  function clearSky(latDeg, d, h) {
    var cz = cosZ(latDeg, d, h);
    if (cz <= 0) return 0;
    return 1361 * cz * Math.exp(-0.30 * airMass(cz));
  }

  // A deterministic cumulus field: mostly a bit shaded, sometimes a lot, and
  // occasionally BRIGHTER than clear sky because a cloud edge reflects extra
  // light onto the sensor. Those over-readings are real.
  function cloudFactor(h) {
    if (sky === 'Clear') return 1;
    if (sky === 'Overcast') return 0.22;
    var s = Math.sin(h * 2.9) + Math.sin(h * 7.3 + 1.1) + Math.sin(h * 13.7 + 2.7);
    var f = 0.72 + 0.26 * s / 3;
    var edge = Math.sin(h * 19.1 + 0.4);
    if (edge > 0.965) f = 1.09;               // cloud-edge enhancement
    return Math.max(0.16, Math.min(1.12, f));
  }

  function build(latDeg, d, skyMode) {
    var save = sky; sky = skyMode;
    var clear = [], act = [], cz = [];
    for (var i = 0; i < N; i++) {
      var h = hourOf(i);
      var c = clearSky(latDeg, d, h);
      clear.push(c);
      act.push(c * cloudFactor(h));
      cz.push(cosZ(latDeg, d, h));
    }
    sky = save;

    // air temperature as a first-order response to the irradiance, which is
    // what actually produces the lag
    var base = 8 - 0.20 * latDeg + (latDeg / 66.5) * 12 * Math.cos(2 * Math.PI * (d - 172) / 365);
    var tau = 3 * 60 / STEP;
    var k = 1 - Math.exp(-1 / tau);
    var T = base;
    for (var pass = 0; pass < 2; pass++) {          // settle, then record
      var out = [];
      for (var j = 0; j < N; j++) {
        T += k * ((base + 0.020 * act[j]) - T);
        out.push(T);
      }
      if (pass === 1) return { clear: clear, act: act, cz: cz, temp: out };
    }
  }

  function totalKwh(act) {
    var s = 0;
    for (var i = 0; i < N; i++) s += act[i] * (STEP / 60);
    return s / 1000;
  }

  // ---- DOM ---------------------------------------------------------------

  function injectStyles() {
    var css = [
      '.si-wrap { font-family: Arial, Helvetica, sans-serif; padding: 6px 12px 4px 12px; }',
      '.si-title { margin: 2px 0; font-size: 20px; text-align: center; color: #212121; }',
      '.si-sub { margin: 0 0 6px 0; font-size: 12px; text-align: center; color: #546e7a; }',
      '.si-row { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;',
      '  align-items: center; margin-bottom: 5px; }',
      '.si-btn { font-family: inherit; font-size: 12px; padding: 5px 10px; cursor: pointer;',
      '  border: 1px solid #b0bec5; background: #fff; color: #37474f; border-radius: 4px; }',
      '.si-btn.active { background: #1565c0; border-color: #0d47a1; color: #fff; font-weight: bold; }',
      '.si-sel { font-family: inherit; font-size: 12px; padding: 4px; }',
      '.si-chart { position: relative; height: 252px; }',
      '.si-info { margin-top: 5px; min-height: 84px; font-size: 12.5px; color: #263238;',
      '  background: #eceff1; border-left: 4px solid #1565c0; padding: 7px 10px;',
      '  border-radius: 3px; line-height: 1.45; }',
      '.si-info b { color: #0d47a1; }',
      '@media (max-width: 520px) {',
      '  .si-chart { height: 214px; }',
      '  .si-info { font-size: 11px; min-height: 72px; }',
      '  .si-title { font-size: 17px; }',
      '  .si-btn, .si-sel { font-size: 11px; padding: 4px 6px; }',
      '}'
    ].join('\n');
    var el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
  }

  function buildUI() {
    var main = document.querySelector('main');
    main.innerHTML = [
      '<div class="si-wrap">',
      '  <h2 class="si-title">Solar Irradiance Through the Day</h2>',
      '  <p class="si-sub">Irradiance and air temperature on one time axis. The gap between their peaks is the whole point.</p>',
      '  <div class="si-row">',
      '    <select class="si-sel" id="si-lat">' +
         LATS.map(function (l) {
           return '<option value="' + l + '"' + (l === 45 ? ' selected' : '') + '>' +
                  l + ' deg' + (l === 66.5 ? ' (Arctic Circle)' : '') + '</option>';
         }).join('') + '</select>',
      '    <select class="si-sel" id="si-date">' +
         Object.keys(DATES).map(function (k) {
           return '<option value="' + DATES[k] + '"' + (DATES[k] === 172 ? ' selected' : '') +
                  '>' + k + '</option>';
         }).join('') + '</select>',
      '    <select class="si-sel" id="si-sky">' +
         ['Clear', 'Scattered cumulus', 'Overcast'].map(function (k) {
           return '<option value="' + k + '">' + k + '</option>';
         }).join('') + '</select>',
      '  </div>',
      '  <div class="si-row">',
      '    <button type="button" class="si-btn" id="si-pin">Add comparison</button>',
      '    <button type="button" class="si-btn" id="si-clear">Clear it</button>',
      '    <button type="button" class="si-btn" id="si-int">Integrate</button>',
      '  </div>',
      '  <div class="si-chart"><canvas id="si-canvas"></canvas></div>',
      '  <div class="si-info" id="si-info"></div>',
      '</div>'
    ].join('\n');

    document.getElementById('si-lat').addEventListener('change', function (e) {
      lat = parseFloat(e.target.value); picked = null; render();
    });
    document.getElementById('si-date').addEventListener('change', function (e) {
      doy = parseInt(e.target.value, 10); picked = null; render();
    });
    document.getElementById('si-sky').addEventListener('change', function (e) {
      sky = e.target.value; picked = null; render();
    });
    document.getElementById('si-pin').addEventListener('click', function () {
      pinned = { lat: lat, doy: doy, sky: sky,
                 name: lat + ' deg, ' + dateName() + ', ' + sky.toLowerCase() };
      render();
    });
    document.getElementById('si-clear').addEventListener('click', function () {
      pinned = null; render();
    });
    document.getElementById('si-int').addEventListener('click', function () {
      integrate = !integrate; render();
    });
  }

  function dateName() {
    for (var k in DATES) if (DATES[k] === doy) return k;
    return 'day ' + doy;
  }

  // ---- annotations -------------------------------------------------------

  var notes = {
    id: 'siNotes',
    afterDatasetsDraw: function (c) {
      var d = build(lat, doy, sky);
      var xa = c.scales.x, ya = c.scales.y, ctx = c.ctx;
      ctx.save();
      ctx.font = '10px Arial';

      var peakI = 0, peakT = 0;
      for (var i = 0; i < N; i++) {
        if (d.act[i] > d.act[peakI]) peakI = i;
        if (d.temp[i] > d.temp[peakT]) peakT = i;
      }

      var maxClear = Math.max.apply(null, d.clear);
      var up = 0;
      for (var k = 0; k < N; k++) if (d.cz[k] > 0) up++;
      var daylight = up * STEP / 60;

      if (maxClear < 5) {
        box(ctx, xa.left + 12, ya.top + 14,
            'The Sun does not rise. Polar night.', '#b71c1c');
      } else if (daylight >= 23) {
        box(ctx, xa.left + 12, ya.top + 14,
            'The Sun does not set, but it stays low, so peak irradiance is modest ' +
            '(' + nf(maxClear, 1, 0) + ' W/m2).', '#0d47a1');
      } else if (peakT > peakI + 3) {
        // the thermal lag, drawn as an arrow between the two peaks
        var x1 = xa.getPixelForValue(peakI), x2 = xa.getPixelForValue(peakT);
        var yy = ya.top + 22;
        ctx.strokeStyle = '#e65100';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, yy); ctx.lineTo(x2, yy);
        ctx.moveTo(x2, yy); ctx.lineTo(x2 - 6, yy - 4);
        ctx.moveTo(x2, yy); ctx.lineTo(x2 - 6, yy + 4);
        ctx.stroke();
        ctx.fillStyle = '#e65100';
        ctx.textAlign = 'center';
        ctx.fillText(nf((peakT - peakI) * STEP / 60, 1, 1) + ' h', (x1 + x2) / 2, yy - 5);
        ctx.textAlign = 'left';
        ctx.fillText('The ground must warm first, then warm the air.', x2 + 8, yy + 4);
      }

      if (sky === 'Scattered cumulus') {
        var over = false;
        for (var j = 0; j < N; j++) if (d.act[j] > d.clear[j] + 1) over = true;
        if (over) {
          box(ctx, xa.left + 12, ya.bottom - 26,
              'Cloud edges can reflect extra light onto the sensor. Brief over-readings ' +
              'are real, not sensor faults.', '#6a1b9a');
        }
      }
      ctx.restore();
    }
  };

  function box(ctx, x, y, txt, col) {
    ctx.font = '10px Arial';
    var w = ctx.measureText(txt).width + 10;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(x - 4, y - 10, w, 15);
    ctx.fillStyle = col;
    ctx.textAlign = 'left';
    ctx.fillText(txt, x + 1, y + 1);
  }

  // ---- chart -------------------------------------------------------------

  function config() {
    var d = build(lat, doy, sky);
    var labels = [];
    for (var i = 0; i < N; i++) labels.push(hhmm(hourOf(i)));

    var sets = [
      { label: 'Clear-sky maximum', data: d.clear, borderColor: 'rgba(255,143,0,0.85)',
        borderDash: [5, 4], pointRadius: 0, borderWidth: 1.5, tension: 0.3, yAxisID: 'y' },
      { label: 'Irradiance', data: d.act, borderColor: '#e65100',
        backgroundColor: 'rgba(255,183,77,0.35)', pointRadius: 0, borderWidth: 2,
        tension: 0.25, fill: integrate ? 'origin' : false, yAxisID: 'y' },
      { label: 'Air temperature', data: d.temp, borderColor: '#c62828',
        pointRadius: 0, borderWidth: 2, tension: 0.3, yAxisID: 'y1' }
    ];
    if (pinned) {
      var p = build(pinned.lat, pinned.doy, pinned.sky);
      sets.push({ label: 'Comparison: ' + pinned.name, data: p.act, borderColor: '#1565c0',
                  pointRadius: 0, borderWidth: 2, tension: 0.25, yAxisID: 'y' });
    }

    var tLo = Math.min.apply(null, d.temp), tHi = Math.max.apply(null, d.temp);
    if (pinned) {
      var pp = build(pinned.lat, pinned.doy, pinned.sky);
      tLo = Math.min(tLo, Math.min.apply(null, pp.temp));
      tHi = Math.max(tHi, Math.max.apply(null, pp.temp));
    }
    var mid = (tLo + tHi) / 2;
    var span = Math.max(tHi - tLo, 10) * 1.25;
    var tMin = Math.floor(mid - span / 2), tMax = Math.ceil(mid + span / 2);

    return {
      type: 'line',
      data: { labels: labels, datasets: sets },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 250 },
        interaction: { mode: 'index', intersect: false },
        onClick: function (e, els) {
          if (els && els.length) { picked = els[0].index; info(); }
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } },
          tooltip: {
            callbacks: {
              afterBody: function (items) {
                var i = items[0].dataIndex;
                var cz = d.cz[i];
                var z = cz > 0 ? Math.acos(Math.min(1, cz)) * 180 / Math.PI : 90;
                return ['solar zenith angle ' + nf(z, 1, 1) + ' deg'];
              }
            }
          }
        },
        scales: {
          x: { ticks: { maxTicksLimit: 9, font: { size: 9 } },
               title: { display: true, text: 'time of day', font: { size: 10 } } },
          y: { min: 0, max: 1100,
               title: { display: true, text: 'W/m2  (fixed scale)', font: { size: 10 } },
               grid: { color: 'rgba(0,0,0,0.06)' } },
          y1: { position: 'right', min: tMin, max: tMax,
                title: { display: true, text: 'deg C', font: { size: 10 } },
                ticks: { precision: 0 },
                grid: { drawOnChartArea: false } }
        }
      },
      plugins: [notes]
    };
  }

  function render() {
    if (chart) chart.destroy();
    var ctx = document.getElementById('si-canvas').getContext('2d');
    chart = new Chart(ctx, config());
    document.getElementById('si-int').classList.toggle('active', integrate);
    info();
  }

  function info() {
    var box2 = document.getElementById('si-info');
    var d = build(lat, doy, sky);
    var parts = [];

    if (picked !== null) {
      var cz = d.cz[picked];
      var z = cz > 0 ? Math.acos(Math.min(1, cz)) * 180 / Math.PI : 90;
      parts.push('<b>' + hhmm(hourOf(picked)) + '</b> - zenith angle ' + nf(z, 1, 1) +
        ' deg, so cos z = ' + nf(Math.max(0, cz), 1, 3) + '. Clear sky would give 1361 x ' +
        nf(Math.max(0, cz), 1, 3) + ' x atmospheric transmission = ' + nf(d.clear[picked], 1, 0) +
        ' W/m2. Measured here: ' + nf(d.act[picked], 1, 0) + ' W/m2, air ' +
        nf(d.temp[picked], 1, 1) + ' deg C.');
    } else if (integrate) {
      parts.push('<b>Daily total: ' + nf(totalKwh(d.act), 1, 2) + ' kWh per square metre.</b> ' +
        'That is the area under the orange curve - the insolation, which is what a solar ' +
        'panel and a growing plant both actually care about. Chapter 15 works with these.');
    } else {
      parts.push('Hover for the numbers at any moment, or click a point for the cosine ' +
        'calculation behind it. <b>Add comparison</b> pins the current curve so you can ' +
        'change latitude or date and see both at once.');
    }

    if (pinned) {
      var p = build(pinned.lat, pinned.doy, pinned.sky);
      parts.push('<b>Comparison.</b> Now: ' + nf(totalKwh(d.act), 1, 2) + ' kWh/m2 over the ' +
        'day. Pinned (' + pinned.name + '): ' + nf(totalKwh(p.act), 1, 2) + ' kWh/m2. ' +
        'A taller curve is not always the bigger total - a low Sun that never sets can ' +
        'beat a high one that does.');
    }
    box2.innerHTML = parts.slice(0, 2).join('<br><br>');
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    buildUI();
    render();
  });
})();
