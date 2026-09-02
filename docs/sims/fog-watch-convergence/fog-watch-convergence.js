// Fog Watch - Temperature and Dew Point Convergence - Chart.js
// CANVAS_HEIGHT: 590
// Bloom Level: Evaluate (L5) - the learner predicts dew, frost or fog from the
// closing gap between air temperature and dew point, and is held to the call.
// Both lines share one fixed y-axis. That shared axis is the entire point: the
// gap between them is a number of degrees of cooling, and you can read it off.
// Relative humidity is drawn faintly on a second axis so the learner can test
// whether they could have made the call from RH alone. In one scenario they
// cannot, and the feedback says so.

(function () {
  'use strict';

  var chart = null;
  var key = 'Radiation fog';
  var cursor = 16;              // 22:00, where the prediction is due
  var revealed = false;
  var showRh = true;
  var predicted = null;
  var score = 0, attempts = 0;

  var N = 57;                   // 18:00 to 08:00 at 15 minutes
  var PREDICT_AT = 16;          // 22:00
  var Y_LO = -8, Y_HI = 20;     // fixed across every scenario, on purpose

  // p5's nf() is not available in a Chart.js sim, so here is the same thing
  function nf(v, l, r) {
    var neg = Number(v) < 0;
    var a = Math.abs(Number(v));
    var s = (r === undefined) ? String(a) : a.toFixed(r);
    var parts = s.split('.');
    while (parts[0].length < (l || 1)) parts[0] = '0' + parts[0];
    return (neg ? '-' : '') + parts.join('.');
  }

  function hourOf(i) { return (18 + i * 0.25) % 24; }
  function label(i) {
    var h = hourOf(i);
    return nf(Math.floor(h), 2) + ':' + nf(Math.round((h % 1) * 60), 2);
  }
  function esat(t) { return 6.112 * Math.exp(17.62 * t / (243.12 + t)); }

  // f is a fraction of the night elapsed, 0 at 18:00 and 1 at 08:00
  var SCEN = {
    'Radiation fog': {
      wind: 2, cloud: 0,
      air: function (f) { return 14 - 8.6 * Math.min(f / 0.79, 1) - 0.8 * Math.max(0, f - 0.79); },
      dew: function (f) { return 6 - 0.4 * f; },
      answer: 'Fog',
      outcome: 'Dense radiation fog by 05:00, and heavy dew on everything.',
      why: 'Clear sky, almost no wind, so the ground radiated heat away all night with ' +
           'nothing to stop it and the spread closed to zero by 05:00. Saturated still air ' +
           'has nowhere to put the water but into droplets.'
    },
    'Dew only': {
      wind: 3, cloud: 0,
      air: function (f) { return 12 - 4.9 * Math.min(f / 0.82, 1); },
      dew: function (f) { return 6.6 - 0.1 * f; },
      answer: 'Dew',
      outcome: 'Dew on the grass by dawn. No fog.',
      why: 'The spread came down to about half a degree and stopped. Grass radiates ' +
           'faster than air and gets colder than it, so the surface saturated while the ' +
           'air at thermometer height did not. Dew needs a cold surface; fog needs the air.'
    },
    'Frost': {
      wind: 3, cloud: 0,
      air: function (f) { return 6 - 9.2 * Math.min(f / 0.82, 1); },
      dew: function (f) { return -3 - 0.1 * f; },
      answer: 'Frost',
      outcome: 'Hard frost on the grass and the car windscreen.',
      why: 'The same convergence as the dew case, with one difference that changes ' +
           'everything: the dew point is below freezing. Vapour deposits directly as ice ' +
           'without passing through liquid.'
    },
    'Windy night': {
      wind: 18, cloud: 10,
      air: function (f) { return 12 - 3.2 * Math.min(f / 0.5, 1) - 0.3 * Math.max(0, f - 0.5); },
      dew: function (f) { return 7 + 0.2 * f; },
      answer: 'Nothing',
      outcome: 'Nothing formed. A dry morning.',
      why: 'The spread narrowed and then stopped. Wind keeps mixing warmer air down, so ' +
           'the surface never gets to finish cooling. Convergence alone is not enough.'
    },
    'Cloudy night': {
      wind: 6, cloud: 95,
      air: function (f) { return 13 - 2.1 * f; },
      dew: function (f) { return 6 + 0.1 * f; },
      answer: 'Nothing',
      outcome: 'Nothing formed. Mild and grey by morning.',
      why: 'Cloud radiates heat back down, so the cooling stalled almost at once and the ' +
           'spread never got below 5 degrees. A clear sky is a requirement, not a detail.'
    },
    'High humidity, no fog': {
      wind: 5, cloud: 30,
      air: function (f) { return 2 - 3.1 * f; },
      dew: function (f) { return -0.3 - 3.1 * f; },
      answer: 'Nothing',
      outcome: 'Nothing formed, despite 85 per cent humidity all night.',
      why: 'Humidity sat at 85 per cent all night, which looks alarming and means ' +
           'nothing. Air and dew point fell together, so the spread never dropped below ' +
           'two degrees.',
      rhTrap: true
    }
  };

  function series() {
    var s = SCEN[key];
    var air = [], dew = [], rh = [];
    for (var i = 0; i < N; i++) {
      var f = i / (N - 1);
      var a = s.air(f);
      var d = Math.min(s.dew(f), a);      // the dew point can never exceed the air temp
      air.push(a); dew.push(d);
      rh.push(100 * esat(d) / esat(a));
    }
    return { air: air, dew: dew, rh: rh };
  }

  function spreadAt(i) { var d = series(); return d.air[i] - d.dew[i]; }

  // ---- DOM ---------------------------------------------------------------

  function injectStyles() {
    var css = [
      '.fw-wrap { font-family: Arial, Helvetica, sans-serif; padding: 6px 12px 4px 12px; }',
      '.fw-title { margin: 2px 0; font-size: 20px; text-align: center; color: #212121; }',
      '.fw-sub { margin: 0 0 6px 0; font-size: 12px; text-align: center; color: #546e7a; }',
      '.fw-row { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;',
      '  align-items: center; margin-bottom: 5px; }',
      '.fw-btn { font-family: inherit; font-size: 12px; padding: 5px 10px; cursor: pointer;',
      '  border: 1px solid #b0bec5; background: #fff; color: #37474f; border-radius: 4px; }',
      '.fw-btn.active { background: #1565c0; border-color: #0d47a1; color: #fff; font-weight: bold; }',
      '.fw-btn:disabled { color: #b0bec5; cursor: default; }',
      '.fw-sel { font-family: inherit; font-size: 12px; padding: 4px; }',
      '.fw-chart { position: relative; height: 232px; }',
      '.fw-info { margin-top: 5px; min-height: 92px; font-size: 12.5px; color: #263238;',
      '  background: #eceff1; border-left: 4px solid #1565c0; padding: 7px 10px;',
      '  border-radius: 3px; line-height: 1.45; }',
      '.fw-info b { color: #0d47a1; }',
      '.fw-info .good { color: #1b5e20; } .fw-info .bad { color: #b71c1c; }',
      '@media (max-width: 520px) {',
      '  .fw-chart { height: 200px; }',
      '  .fw-info { font-size: 11px; min-height: 78px; }',
      '  .fw-title { font-size: 17px; }',
      '  .fw-btn, .fw-sel { font-size: 11px; padding: 4px 7px; }',
      '}'
    ].join('\n');
    var el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
  }

  function buildUI() {
    var main = document.querySelector('main');
    var opts = Object.keys(SCEN).map(function (k) {
      return '<option value="' + k + '">' + k + '</option>';
    }).join('');
    main.innerHTML = [
      '<div class="fw-wrap">',
      '  <h2 class="fw-title">Fog Watch</h2>',
      '  <p class="fw-sub">Spread is how many degrees of cooling remain before condensation.</p>',
      '  <div class="fw-row">',
      '    <select class="fw-sel" id="fw-scen">' + opts + '</select>',
      '    <input type="range" id="fw-time" min="0" max="' + PREDICT_AT + '" value="' + PREDICT_AT + '">',
      '    <label style="font-size:12px;color:#546e7a"><input type="checkbox" id="fw-rh" checked> humidity line</label>',
      '  </div>',
      '  <div class="fw-row" id="fw-preds">',
      ['Dew', 'Frost', 'Fog', 'Nothing'].map(function (c) {
        return '<button type="button" class="fw-btn" data-pred="' + c + '">' + c + '</button>';
      }).join(''),
      '  </div>',
      '  <div class="fw-chart"><canvas id="fw-canvas"></canvas></div>',
      '  <div class="fw-info" id="fw-info"></div>',
      '</div>'
    ].join('\n');

    document.getElementById('fw-scen').addEventListener('change', function (e) {
      key = e.target.value;
      cursor = PREDICT_AT;
      revealed = false;
      predicted = null;
      document.getElementById('fw-time').value = PREDICT_AT;
      render();
    });
    document.getElementById('fw-time').addEventListener('input', function (e) {
      cursor = parseInt(e.target.value, 10);
      render();
    });
    document.getElementById('fw-rh').addEventListener('change', function (e) {
      showRh = e.target.checked;
      render();
    });
    main.querySelectorAll('[data-pred]').forEach(function (b) {
      b.addEventListener('click', function () { submit(b.getAttribute('data-pred')); });
    });
  }

  function submit(choice) {
    if (revealed) return;
    predicted = choice;
    revealed = true;
    attempts++;
    if (choice === SCEN[key].answer) score++;
    render();
  }

  // ---- chart -------------------------------------------------------------

  function upto() { return revealed ? N - 1 : cursor; }

  function cut(arr) {
    var out = [], lim = upto();
    for (var i = 0; i < N; i++) out.push(i <= lim ? arr[i] : null);
    return out;
  }

  function config() {
    var d = series();
    var sets = [
      { label: 'Air temperature', data: cut(d.air), borderColor: '#c62828',
        backgroundColor: 'rgba(255,193,7,0.20)', pointRadius: 0, borderWidth: 2,
        fill: '+1', tension: 0.25, yAxisID: 'y' },
      { label: 'Dew point', data: cut(d.dew), borderColor: '#1565c0',
        pointRadius: 0, borderWidth: 2, tension: 0.25, yAxisID: 'y' }
    ];
    if (showRh) {
      sets.push({ label: 'Relative humidity', data: cut(d.rh), borderColor: 'rgba(120,144,156,0.75)',
                  borderDash: [4, 3], pointRadius: 0, borderWidth: 1.5, tension: 0.25,
                  yAxisID: 'y1' });
    }
    return {
      type: 'line',
      data: { labels: Array.from({ length: N }, function (_, i) { return label(i); }),
              datasets: sets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } },
          tooltip: {
            callbacks: {
              afterBody: function (items) {
                var i = items[0].dataIndex;
                var s = SCEN[key];
                return ['spread ' + nf(d.air[i] - d.dew[i], 1, 1) + ' deg C',
                        'wind ' + s.wind + ' km/h,  cloud ' + s.cloud + ' %'];
              }
            }
          }
        },
        scales: {
          x: { ticks: { maxTicksLimit: 8, font: { size: 9 } },
               title: { display: true, text: 'time of night', font: { size: 10 } } },
          y: { min: Y_LO, max: Y_HI,
               title: { display: true, text: 'deg C  (fixed scale)', font: { size: 10 } },
               grid: { color: 'rgba(0,0,0,0.06)' } },
          y1: { display: showRh, position: 'right', min: 0, max: 100,
                title: { display: true, text: '% RH', font: { size: 10 } },
                grid: { drawOnChartArea: false } }
        }
      },
      plugins: [nowLine]
    };
  }

  var nowLine = {
    id: 'fwNow',
    afterDatasetsDraw: function (c) {
      var xa = c.scales.x, ya = c.scales.y, ctx = c.ctx;
      var px = xa.getPixelForValue(revealed ? PREDICT_AT : cursor);
      ctx.save();
      ctx.strokeStyle = revealed ? '#b0bec5' : '#e65100';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, ya.top);
      ctx.lineTo(px, ya.bottom);
      ctx.stroke();
      ctx.fillStyle = revealed ? '#90a4ae' : '#e65100';
      ctx.font = '9px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(revealed ? 'you predicted here' : label(cursor), px, ya.top - 2);
      ctx.restore();
    }
  };

  function render() {
    if (chart) chart.destroy();
    var ctx = document.getElementById('fw-canvas').getContext('2d');
    chart = new Chart(ctx, config());
    document.getElementById('fw-time').disabled = revealed;
    document.querySelectorAll('[data-pred]').forEach(function (b) {
      b.disabled = revealed;
      b.classList.toggle('active', predicted === b.getAttribute('data-pred'));
    });
    info();
  }

  function info() {
    var box = document.getElementById('fw-info');
    var s = SCEN[key];
    var d = series();
    var i = revealed ? PREDICT_AT : cursor;
    var sp = d.air[i] - d.dew[i];

    if (!revealed) {
      box.innerHTML = '<b>' + label(i) + '</b> - air ' + nf(d.air[i], 1, 1) +
        ' deg C, dew point ' + nf(d.dew[i], 1, 1) + ' deg C, <b>spread ' + nf(sp, 1, 1) +
        ' deg C</b>, humidity ' + nf(d.rh[i], 1, 0) + ' %. Wind ' + s.wind +
        ' km/h, cloud ' + s.cloud + ' %.<br><br>Scrub back to watch how fast the gap is ' +
        'closing, then commit. The rest of the night stays hidden until you do.';
      return;
    }

    var right = predicted === s.answer;
    var head = right ? '<span class="good">Right call.</span>'
                     : '<span class="bad">Wrong. The answer was "' + s.answer + '".</span>';
    var extra = '';
    if (s.rhTrap && !right) {
      extra = '<br><br><b>The humidity line was the trap.</b> Turn it off and look at ' +
              'the two temperature lines. They never converge.';
    }
    box.innerHTML = '<b>' + head + '</b>  What happened: ' + s.outcome + '<br><br>' + s.why +
                    extra + '<br><br><i>Score ' + score + ' of ' + attempts + '.</i>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    buildUI();
    render();
  });
})();
