// Temperature Sensor Comparison - Chart.js
// CANVAS_HEIGHT: 604
// Bloom Level: Evaluate (L5) - the learner recommends a sensor for a stated job
// by weighing range, sensitivity, linearity and cost against what the job needs.
// The range view uses a deliberately broken temperature axis so that the -50 to
// 150 band, where almost every reading in this book lives, stays readable next
// to a thermocouple that goes to 1350. The break is labelled on the axis.

(function () {
  'use strict';

  var chart = null;
  var view = 'range';          // 'range' | 'curves'
  var scenario = 'none';
  var selected = null;

  // Standard catalogue figures for each family.
  var SENSORS = [
    { key: 'tc', name: 'Thermocouple (type K)', lo: -200, hi: 1350,
      sens: 'low, about 41 microvolts per deg C',
      lin: 'fair - needs a lookup table', cost: 'low',
      color: '#e53935',
      how: 'Two metals joined at a point produce a voltage that depends on the ' +
           'temperature of the join. No power supply needed, and the junction can be tiny.' },
    { key: 'rtd', name: 'Resistance thermometer (Pt100)', lo: -200, hi: 850,
      sens: 'moderate, 0.385 ohms per deg C',
      lin: 'excellent', cost: 'high',
      color: '#1e88e5',
      how: 'Platinum resistance rises with temperature and stays stable for decades. This ' +
           'is what national laboratories use to realise the temperature scale itself.' },
    { key: 'therm', name: 'Thermistor (NTC 10k)', lo: -55, hi: 150,
      sens: 'very high near room temperature',
      lin: 'poor - strongly exponential', cost: 'very low',
      color: '#fb8c00',
      how: 'A metal-oxide bead whose resistance falls steeply as it warms. Huge sensitivity ' +
           'over a narrow band for pennies. The price is a curve you must correct for.' },
    { key: 'diode', name: 'Silicon diode (BME280)', lo: -40, hi: 85,
      sens: 'moderate, about 2 millivolts per deg C',
      lin: 'good - linearised on the chip', cost: 'low, and it brings pressure and humidity',
      color: '#43a047',
      how: 'A diode forward voltage falls about 2 mV per degree. The BME280 measures it, ' +
           'corrects it against factory calibration, and hands your Pi a number over I2C.' }
  ];

  var MARKS = [
    { t: -89.2, label: 'coldest on Earth' },
    { t: -40,   label: 'BME280 lower limit' },
    { t: 0,     label: 'water freezes' },
    { t: 56.7,  label: 'hottest on Earth' },
    { t: 85,    label: 'BME280 upper limit' },
    { t: 1085,  label: 'copper melts' }
  ];

  var SCENARIOS = {
    minnesota: {
      label: 'Minnesota station',
      full: 'An outdoor weather station in Minnesota',
      need: [-40, 40],
      pick: 'diode',
      verdict: 'All four cover it. Take the silicon diode: cheap, speaks I2C, and it ' +
               'brings pressure and humidity too. But its floor is minus 40, and ' +
               'Minnesota\'s record low is minus 51 (Tower, 1996). On that night it would ' +
               'not read badly - it would stop reading.'
    },
    kiln: {
      label: 'Kiln to 1200 C',
      full: 'A kiln monitor running to 1200 deg C',
      need: [0, 1200],
      pick: 'tc',
      verdict: 'Only the thermocouple survives. The others are not merely inaccurate at ' +
               '1200 deg C - they are destroyed. Range rules a sensor out before any other ' +
               'specification gets a vote.'
    },
    lab: {
      label: 'Lab reference',
      full: 'A laboratory calibration reference',
      need: [-50, 250],
      pick: 'rtd',
      verdict: 'The platinum resistance thermometer, and it is not close. Excellent ' +
               'linearity and decades of stability are what a reference needs, and this is ' +
               'the one place where most expensive is an acceptable answer.'
    },
    battery: {
      label: 'Battery cutoff',
      full: 'A battery pack over-temperature cutoff',
      need: [0, 80],
      pick: 'therm',
      verdict: 'The thermistor. Narrow band, small rises worth catching, one fitted to ' +
               'every pack you build. High sensitivity and very low cost win, and poor ' +
               'linearity does not matter when all you need is a threshold.'
    }
  };

  // ---- the broken axis ---------------------------------------------------
  // Below 200 deg C, 450 degrees get 70 per cent of the width. Above it, 1600
  // degrees share the remaining 30. Labelled on the chart so nobody is misled.
  var BREAK_T = 200, T_MIN = -250, T_MAX = 1800, SPLIT = 70;

  function u(t) {
    if (t <= BREAK_T) return (t - T_MIN) / (BREAK_T - T_MIN) * SPLIT;
    return SPLIT + (t - BREAK_T) / (T_MAX - BREAK_T) * (100 - SPLIT);
  }

  var TICK_T = [-250, -200, -100, 0, 100, 200, 500, 1000, 1500, 1800];

  function usable(s, need) {
    return s.lo <= need[0] && s.hi >= need[1];
  }

  function dimmed(s) {
    if (scenario === 'none') return false;
    return !usable(s, SCENARIOS[scenario].need);
  }

  function fade(hex, on) {
    if (on) return hex;
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',0.18)';
  }

  // ---- DOM ---------------------------------------------------------------

  function injectStyles() {
    var css = [
      '.tsc-wrap { font-family: Arial, Helvetica, sans-serif; padding: 6px 12px 4px 12px; }',
      '.tsc-title { margin: 2px 0; font-size: 20px; text-align: center; color: #212121; }',
      '.tsc-sub { margin: 0 0 6px 0; font-size: 12px; text-align: center; color: #546e7a; }',
      '.tsc-row { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;',
      '  margin-bottom: 5px; }',
      '.tsc-btn { font-family: inherit; font-size: 12px; padding: 5px 10px; cursor: pointer;',
      '  border: 1px solid #b0bec5; background: #fff; color: #37474f; border-radius: 4px; }',
      '.tsc-btn.active { background: #1565c0; border-color: #0d47a1; color: #fff; font-weight: bold; }',
      '.tsc-chart { position: relative; height: 250px; }',
      '.tsc-info { margin-top: 5px; min-height: 96px; font-size: 12.5px; color: #263238;',
      '  background: #eceff1; border-left: 4px solid #1565c0; padding: 7px 10px;',
      '  border-radius: 3px; line-height: 1.45; }',
      '.tsc-info b { color: #0d47a1; }',
      '.tsc-info .bad { color: #b71c1c; }',
      '@media (max-width: 520px) {',
      '  .tsc-chart { height: 214px; }',
      '  .tsc-info { font-size: 11px; min-height: 80px; line-height: 1.4; }',
      '  .tsc-title { font-size: 17px; }',
      '  .tsc-btn { font-size: 11px; padding: 4px 7px; }',
      '}'
    ].join('\n');
    var el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
  }

  function buildUI() {
    var main = document.querySelector('main');
    var scen = Object.keys(SCENARIOS).map(function (k) {
      return '<button type="button" class="tsc-btn" data-scen="' + k + '">' +
             SCENARIOS[k].label + '</button>';
    }).join('');
    main.innerHTML = [
      '<div class="tsc-wrap">',
      '  <h2 class="tsc-title">Which Temperature Sensor?</h2>',
      '  <p class="tsc-sub">Range rules sensors out. Sensitivity, linearity and cost decide between the survivors.</p>',
      '  <div class="tsc-row">',
      '    <button type="button" class="tsc-btn active" data-view="range">Measurement range</button>',
      '    <button type="button" class="tsc-btn" data-view="curves">Response curves</button>',
      '  </div>',
      '  <div class="tsc-row">' + scen +
      '    <button type="button" class="tsc-btn active" data-scen="none">None</button>',
      '  </div>',
      '  <div class="tsc-chart"><canvas id="tsc-canvas"></canvas></div>',
      '  <div class="tsc-info" id="tsc-info"></div>',
      '</div>'
    ].join('\n');

    main.querySelectorAll('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () { setView(b.getAttribute('data-view')); });
    });
    main.querySelectorAll('[data-scen]').forEach(function (b) {
      b.addEventListener('click', function () { setScenario(b.getAttribute('data-scen')); });
    });
  }

  // ---- reference-line plugin --------------------------------------------

  var marksPlugin = {
    id: 'tscMarks',
    afterDatasetsDraw: function (c) {
      if (view !== 'range') return;
      var ctx = c.ctx, xa = c.scales.x, ya = c.scales.y;
      ctx.save();
      ctx.lineWidth = 1;
      for (var i = 0; i < MARKS.length; i++) {
        var px = xa.getPixelForValue(u(MARKS[i].t));
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = 'rgba(69,90,100,0.55)';
        ctx.beginPath();
        ctx.moveTo(px, ya.top);
        ctx.lineTo(px, ya.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        // a translucent backing so the label stays legible where it crosses a bar
        ctx.save();
        ctx.translate(px, ya.top + 4);
        ctx.rotate(-Math.PI / 2);
        ctx.font = '9px Arial';
        var w = ctx.measureText(MARKS[i].label).width;
        ctx.fillStyle = 'rgba(255,255,255,0.82)';
        ctx.fillRect(-w - 5, -4, w + 7, 11);
        ctx.fillStyle = '#455a64';
        ctx.textAlign = 'right';
        ctx.fillText(MARKS[i].label, -3, 4);
        ctx.restore();
      }
      // the axis break itself, as a break glyph rather than a caption that
      // collided with the tick labels
      var bx = xa.getPixelForValue(SPLIT);
      var by = ya.bottom;
      ctx.setLineDash([]);
      ctx.strokeStyle = '#b71c1c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx - 5, by + 6); ctx.lineTo(bx + 1, by - 4);
      ctx.moveTo(bx - 1, by + 6); ctx.lineTo(bx + 5, by - 4);
      ctx.stroke();
      ctx.restore();
    }
  };

  // ---- charts ------------------------------------------------------------

  function rangeConfig() {
    return {
      type: 'bar',
      data: {
        labels: SENSORS.map(function (s) { return s.name; }),
        datasets: [{
          data: SENSORS.map(function (s) { return [u(s.lo), u(s.hi)]; }),
          backgroundColor: SENSORS.map(function (s) { return fade(s.color, !dimmed(s)); }),
          borderColor: SENSORS.map(function (s) {
            return selected === s.key ? '#0d47a1' : fade(s.color, !dimmed(s));
          }),
          borderWidth: SENSORS.map(function (s) { return selected === s.key ? 3 : 1; }),
          borderSkipped: false,
          barPercentage: 0.6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 4, bottom: 20 } },
        onClick: function (e, els) {
          if (els && els.length) { selected = SENSORS[els[0].index].key; render(); }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: function (it) { return SENSORS[it[0].dataIndex].name; },
              label: function (it) {
                var s = SENSORS[it.dataIndex];
                return ['range: ' + s.lo + ' to ' + s.hi + ' deg C',
                        'sensitivity: ' + s.sens,
                        'linearity: ' + s.lin,
                        'cost: ' + s.cost];
              }
            }
          }
        },
        scales: {
          x: {
            min: 0, max: 100,
            title: { display: true, text: 'Temperature (deg C) - note the change of scale at 200' },
            afterBuildTicks: function (axis) {
              axis.ticks = TICK_T.map(function (t) { return { value: u(t) }; });
            },
            ticks: {
              autoSkip: false,
              callback: function (v) {
                for (var i = 0; i < TICK_T.length; i++) {
                  if (Math.abs(u(TICK_T[i]) - v) < 1e-6) return TICK_T[i];
                }
                return '';
              }
            },
            grid: { color: 'rgba(0,0,0,0.06)' }
          },
          y: { ticks: { font: { size: 11 } }, grid: { display: false } }
        }
      },
      plugins: [marksPlugin]
    };
  }

  function curveData() {
    var xs = [];
    for (var t = -50; t <= 150; t += 5) xs.push(t);
    function norm(f) {
      var v = xs.map(f);
      var lo = Math.min.apply(null, v), hi = Math.max.apply(null, v);
      return v.map(function (q) { return (q - lo) / (hi - lo); });
    }
    return {
      labels: xs,
      sets: [
        { key: 'tc',    v: norm(function (t) { return 0.0405 * t + 2e-5 * t * t; }) },
        { key: 'rtd',   v: norm(function (t) { return 100 * (1 + 0.00385 * t); }) },
        { key: 'therm', v: norm(function (t) {
            return 10000 * Math.exp(3950 * (1 / (t + 273.15) - 1 / 298.15)); }) },
        { key: 'diode', v: norm(function (t) { return 0.6 - 0.002 * t; }) }
      ]
    };
  }

  function curvesConfig() {
    var d = curveData();
    return {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: d.sets.map(function (st) {
          var s = SENSORS.filter(function (q) { return q.key === st.key; })[0];
          return { label: s.name, data: st.v, borderColor: fade(s.color, !dimmed(s)),
                   backgroundColor: fade(s.color, !dimmed(s)),
                   pointRadius: 0, borderWidth: 2, tension: 0.1 };
        })
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { title: { display: true, text: 'Temperature (deg C)' },
               ticks: { maxTicksLimit: 9 } },
          y: { title: { display: true, text: 'Normalised output' }, min: 0, max: 1 }
        }
      }
    };
  }

  function render() {
    if (chart) chart.destroy();
    var ctx = document.getElementById('tsc-canvas').getContext('2d');
    chart = new Chart(ctx, view === 'range' ? rangeConfig() : curvesConfig());
    info();
  }

  function setView(v) {
    view = v;
    document.querySelectorAll('[data-view]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-view') === v);
    });
    render();
  }

  function setScenario(k) {
    scenario = k;
    selected = null;
    document.querySelectorAll('[data-scen]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-scen') === k);
    });
    render();
  }

  function info() {
    var box = document.getElementById('tsc-info');
    // At most two blocks. A third stacks the box tall enough to change the
    // iframe height, and a fixed iframe cannot grow with it.
    var parts = [];

    if (selected) {
      var s = SENSORS.filter(function (q) { return q.key === selected; })[0];
      parts.push('<b>' + s.name + '.</b> ' + s.how + ' Range ' + s.lo + ' to ' + s.hi +
                 ' deg C, sensitivity ' + s.sens + ', linearity ' + s.lin +
                 ', cost ' + s.cost + '.');
    } else if (view === 'curves') {
      parts.push('<b>High sensitivity and good linearity pull in opposite directions.</b> ' +
                 'Platinum is almost perfectly straight. The thermistor curves hard, ' +
                 'which is the same thing as saying it is far more sensitive - wonderful ' +
                 'near room temperature, useless as a straight line.');
    }

    if (scenario !== 'none') {
      var sc = SCENARIOS[scenario];
      var out = SENSORS.filter(function (q) { return !usable(q, sc.need); });
      var t = '<b>' + sc.full + '</b> needs ' + sc.need[0] + ' to ' + sc.need[1] +
              ' deg C. ' + sc.verdict;
      if (out.length) {
        t += ' <span class="bad">Ruled out on range: ' +
             out.map(function (q) { return q.name; }).join(', ') + '.</span>';
      }
      parts.push(t);
    }

    if (!parts.length) {
      parts.push('Hover a bar for its numbers, click one for how it works, or pick a ' +
                 'scenario and see what gets ruled out.');
    }
    box.innerHTML = parts.slice(0, 2).join('<br><br>');
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    buildUI();
    render();
  });
})();
