// Linear Versus Logarithmic Scale - Chart.js
// CANVAS_HEIGHT: 502
// Bloom Level: Analyze (L4) - the learner compares one unchanged dataset on two
// axis types and explains why a log scale is required when values span orders
// of magnitude.
// The dataset is byte-for-byte identical between the two views. Only the axis
// type changes, so the visual failure of the linear view cannot be blamed on
// anything else.

(function () {
  'use strict';

  var chart = null;
  var axisType = 'linear';        // 'linear' | 'logarithmic'
  var selectedIndex = -1;

  // Each whole magnitude step is a factor of ten in ground motion, so relative
  // amplitude is 10^(M - 2.0) with the magnitude 2.0 event as the baseline.
  // M9.1 therefore comes out at 10^7.1, about 12.6 million times M2.0.
  var EVENTS = [
    { m: 2.0, event: '',                      felt: 'A tremor most people never feel.' },
    { m: 3.0, event: '',                      felt: 'Felt indoors. No damage.' },
    { m: 4.1, event: '',                      felt: 'Rattles windows.' },
    { m: 5.0, event: '',                      felt: 'Furniture moves.' },
    { m: 6.0, event: '2014 South Napa, California', felt: 'Damage to poorly built structures.' },
    { m: 7.0, event: '2010 Haiti',            felt: 'Serious damage over a wide area.' },
    { m: 8.0, event: '2007 Pisco, Peru',      felt: 'A great earthquake.' },
    { m: 9.1, event: '2011 Tohoku, Japan',    felt: 'One of the largest ever recorded. Triggered the tsunami that flooded Fukushima.' }
  ];

  // A single sequential ramp, pale to dark, so severity is readable from colour
  // even in the linear view where seven of the eight bars flatten to nothing.
  var RAMP = ['#fff2e0', '#fee2c4', '#fdcf9e', '#fdb375', '#fb8f45',
              '#ef6c17', '#cf4c02', '#8c2d04'];

  var CAPTIONS = {
    linear: 'Seven of these eight earthquakes look identical here. They are not.',
    logarithmic: 'Each step up is ten times the ground motion.'
  };

  function amplitude(m) {
    return Math.pow(10, m - 2.0);
  }

  function labelFor(e) {
    return 'M' + e.m.toFixed(1);
  }

  function sci(v) {
    var exp = Math.floor(Math.log10(v));
    var man = v / Math.pow(10, exp);
    return man.toFixed(2) + ' x 10^' + exp;
  }

  function commas(v) {
    return Math.round(v).toLocaleString('en-US');
  }

  // ---- DOM ---------------------------------------------------------------

  function injectStyles() {
    var css = [
      '.lv-wrap { font-family: Arial, Helvetica, sans-serif; padding: 8px 12px 4px 12px; }',
      '.lv-title { margin: 2px 0 2px 0; font-size: 20px; text-align: center; color: #212121; }',
      '.lv-sub { margin: 0 0 8px 0; font-size: 13px; text-align: center; color: #546e7a; }',
      '.lv-controls { display: flex; gap: 8px; align-items: center; justify-content: center;',
      '  flex-wrap: wrap; margin-bottom: 6px; }',
      '.lv-btn { font-family: inherit; font-size: 14px; padding: 6px 14px; cursor: pointer;',
      '  border: 1px solid #b0bec5; background: #ffffff; color: #37474f; border-radius: 4px; }',
      '.lv-btn.active { background: #1565c0; border-color: #0d47a1; color: #ffffff; font-weight: bold; }',
      '.lv-chart { position: relative; height: 290px; }',
      '.lv-caption { position: absolute; left: 50%; transform: translateX(-50%); top: 8px;',
      '  background: rgba(255,255,255,0.92); border: 1px solid #cfd8dc; border-radius: 4px;',
      '  padding: 4px 10px; font-size: 13px; color: #b71c1c; pointer-events: none; max-width: 90%;',
      '  text-align: center; }',
      '.lv-info { margin-top: 6px; min-height: 42px; font-size: 14px; color: #263238;',
      '  background: #eceff1; border-left: 4px solid #1565c0; padding: 7px 10px; border-radius: 3px; }',
      '.lv-info b { color: #0d47a1; }'
    ].join('\n');
    var el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
  }

  function buildUI() {
    var main = document.querySelector('main');
    main.innerHTML = [
      '<div class="lv-wrap">',
      '  <h2 class="lv-title">Linear Versus Logarithmic Scale</h2>',
      '  <p class="lv-sub">The same eight earthquakes, the same numbers. Only the axis changes.</p>',
      '  <div class="lv-controls">',
      '    <button type="button" class="lv-btn active" data-axis="linear">Linear axis</button>',
      '    <button type="button" class="lv-btn" data-axis="logarithmic">Logarithmic axis</button>',
      '  </div>',
      '  <div class="lv-chart"><canvas id="lv-canvas"></canvas>',
      '    <div class="lv-caption" id="lv-caption"></div>',
      '  </div>',
      '  <div class="lv-info" id="lv-info">Hover a bar for the numbers. Click a bar to compare it with the magnitude 2.0 baseline.</div>',
      '</div>'
    ].join('\n');

    var btns = main.querySelectorAll('.lv-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (ev) {
        setAxis(ev.currentTarget.getAttribute('data-axis'));
      });
    }
  }

  // ---- chart -------------------------------------------------------------

  function yScale() {
    if (axisType === 'logarithmic') {
      return {
        type: 'logarithmic',
        min: 0.5,
        max: 50000000,
        title: { display: true, text: 'Relative ground motion (log scale)' },
        ticks: {
          callback: function (v) {
            var l = Math.log10(v);
            return Math.abs(l - Math.round(l)) < 1e-9 ? commas(v) : '';
          }
        }
      };
    }
    return {
      type: 'linear',
      beginAtZero: true,
      title: { display: true, text: 'Relative ground motion (linear scale)' },
      ticks: { callback: function (v) { return commas(v); } }
    };
  }

  function borderColors() {
    return EVENTS.map(function (e, i) {
      return i === selectedIndex ? '#0d47a1' : '#8d6e63';
    });
  }

  function borderWidths() {
    return EVENTS.map(function (e, i) {
      return i === selectedIndex ? 3 : 1;
    });
  }

  function build() {
    var ctx = document.getElementById('lv-canvas').getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: EVENTS.map(labelFor),
        datasets: [{
          label: 'Relative ground motion',
          data: EVENTS.map(function (e) { return amplitude(e.m); }),
          backgroundColor: RAMP,
          borderColor: borderColors(),
          borderWidth: borderWidths()
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 350 },
        onClick: function (evt, elements) {
          if (elements && elements.length) {
            selectedIndex = elements[0].index;
            showInfo();
            refreshBorders();
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: function (items) {
                var e = EVENTS[items[0].dataIndex];
                return 'Magnitude ' + e.m.toFixed(1) + (e.event ? '  -  ' + e.event : '');
              },
              label: function (item) {
                var e = EVENTS[item.dataIndex];
                var a = amplitude(e.m);
                return [
                  'Relative ground motion: ' + sci(a),
                  '(' + commas(a) + ' times the M2.0 baseline)',
                  e.felt
                ];
              }
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Earthquake, labelled by magnitude' } },
          y: yScale()
        }
      }
    });
  }

  function refreshBorders() {
    chart.data.datasets[0].borderColor = borderColors();
    chart.data.datasets[0].borderWidth = borderWidths();
    chart.update('none');
  }

  function setAxis(type) {
    if (type === axisType) return;
    axisType = type;
    var btns = document.querySelectorAll('.lv-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-axis') === type);
    }
    // Only the scale config is replaced. The dataset is untouched, which is the
    // entire argument the sim is making.
    chart.options.scales.y = yScale();
    chart.update();
    setCaption();
  }

  function setCaption() {
    document.getElementById('lv-caption').textContent = CAPTIONS[axisType];
  }

  function showInfo() {
    var box = document.getElementById('lv-info');
    if (selectedIndex < 0) return;
    var e = EVENTS[selectedIndex];
    var a = amplitude(e.m);
    if (selectedIndex === 0) {
      box.innerHTML = '<b>Magnitude ' + e.m.toFixed(1) + '</b> is the baseline every other bar ' +
                      'is measured against. Its relative ground motion is <b>1</b>, or 1 x 10<sup>0</sup>. ' +
                      e.felt;
      return;
    }
    box.innerHTML = '<b>Magnitude ' + e.m.toFixed(1) + '</b>' + (e.event ? ' (' + e.event + ')' : '') +
                    ' shakes the ground <b>' + commas(a) + ' times</b> as far as the magnitude 2.0 ' +
                    'event - that is <b>' + sci(a).replace(/\^(-?\d+)/, '<sup>$1</sup>') +
                    '</b> times. ' + e.felt;
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    buildUI();
    build();
    setCaption();
  });
})();
