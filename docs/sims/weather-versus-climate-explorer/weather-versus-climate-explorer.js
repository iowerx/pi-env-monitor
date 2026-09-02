// Weather Versus Climate Explorer - Chart.js
// CANVAS_HEIGHT: 580
// Bloom Level: Analyze (L4) - the learner distinguishes short-term variation
// from long-term trend in the SAME dataset. The trend overlay is deliberately
// disabled in the short windows: you cannot fit a climate trend to a week.
// The y-axis range is fixed across all three windows so the same vertical
// distance always means the same number of degrees.

(function () {
  'use strict';

  var DATA = null;
  var chart = null;
  var windowKey = 'week';       // 'week' | 'year' | 'thirty'
  var showOverlay = false;

  var COLORS = {
    daily: '#8fa9bf',           // light gray-blue: reads as noise
    dailyPoint: '#7995ac',
    normal: '#263238',          // solid dark line
    trend: '#e65100',           // contrasting warm colour
    extreme: '#c62828'
  };

  var WINDOWS = {
    week: {
      label: 'One week',
      trendEnabled: false,
      note: 'Seven days is not enough to see a trend. This is weather.',
      caption: 'WEATHER',
      series: 'week'
    },
    year: {
      label: 'One year',
      trendEnabled: false,
      note: 'One year shows the seasons, not the climate. Come back with thirty.',
      caption: '',
      series: 'year'
    },
    thirty: {
      label: 'Thirty years',
      trendEnabled: true,
      note: 'Thirty years of monthly means. Now a trend can be fitted — and the ' +
            'same day-to-day noise you saw before has averaged away.',
      caption: 'CLIMATE',
      series: 'monthly'
    }
  };

  // ---- DOM construction -------------------------------------------------

  function buildUI() {
    var main = document.querySelector('main');

    main.innerHTML = [
      '<div class="wc-wrap">',
      '  <h2 class="wc-title">Weather Versus Climate</h2>',
      '  <p class="wc-sub">The same station, the same data. Only the length of the window changes.</p>',
      '  <div class="wc-controls">',
      '    <div class="wc-btns" role="group" aria-label="Time window"></div>',
      '    <label class="wc-toggle"><input type="checkbox" id="wc-overlay"> Show 30-year average line</label>',
      '  </div>',
      '  <div class="wc-note" id="wc-note"></div>',
      '  <div class="wc-chart"><canvas id="wc-canvas"></canvas>',
      '    <div class="wc-caption" id="wc-caption"></div>',
      '  </div>',
      '  <div class="wc-info" id="wc-info">Hover any point to compare it with the 30-year average. ' +
      '  Red points are record days — click one.</div>',
      '</div>'
    ].join('\n');

    var btnBox = main.querySelector('.wc-btns');
    Object.keys(WINDOWS).forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wc-btn' + (k === windowKey ? ' active' : '');
      b.textContent = WINDOWS[k].label;
      b.setAttribute('data-key', k);
      b.addEventListener('click', function () { setWindow(k); });
      btnBox.appendChild(b);
    });

    main.querySelector('#wc-overlay').addEventListener('change', function (e) {
      showOverlay = e.target.checked;
      render();
    });
  }

  function injectStyles() {
    var css = [
      '.wc-wrap{font-family:Arial,Helvetica,sans-serif;padding:8px 12px 4px;box-sizing:border-box;}',
      '.wc-title{margin:2px 0 2px;font-size:22px;text-align:center;color:#111;}',
      '.wc-sub{margin:0 0 8px;font-size:13px;text-align:center;color:#555;}',
      '.wc-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;margin-bottom:6px;}',
      '.wc-btns{display:flex;gap:6px;flex-wrap:wrap;}',
      '.wc-btn{font-size:14px;padding:6px 12px;border:1px solid #90a4ae;background:#fff;',
      '  border-radius:5px;cursor:pointer;color:#263238;}',
      '.wc-btn:hover{background:#eceff1;}',
      '.wc-btn.active{background:#263238;color:#fff;border-color:#263238;}',
      '.wc-toggle{font-size:14px;color:#263238;cursor:pointer;user-select:none;}',
      '.wc-toggle input{vertical-align:middle;margin-right:4px;}',
      '.wc-toggle.disabled{opacity:.45;cursor:not-allowed;}',
      '.wc-note{font-size:13px;color:#5d4037;background:#fff8e1;border:1px solid #ffe082;',
      '  border-radius:5px;padding:6px 10px;margin:0 0 8px;text-align:center;min-height:18px;}',
      '.wc-chart{position:relative;height:330px;}',
      '.wc-caption{position:absolute;top:8px;right:14px;font-size:26px;font-weight:bold;',
      '  letter-spacing:3px;color:rgba(38,50,56,.16);pointer-events:none;}',
      '.wc-info{font-size:13px;color:#333;background:#f5f7f9;border:1px solid #dfe4e8;',
      '  border-radius:5px;padding:7px 10px;margin-top:8px;min-height:34px;}',
      '.wc-info.record{background:#ffebee;border-color:#ffcdd2;color:#8e1c1c;}'
    ].join('');
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  // ---- helpers ----------------------------------------------------------

  function fmtDate(iso, forMonthly) {
    var p = iso.split('-');
    var months = ['January','February','March','April','May','June','July',
                  'August','September','October','November','December'];
    var m = months[parseInt(p[1], 10) - 1];
    if (forMonthly) return m + ' ' + p[0];
    return parseInt(p[2], 10) + ' ' + m + ' ' + p[0];
  }

  function departure(v) {
    var d = v - DATA.normal;
    var mag = Math.abs(d).toFixed(1);
    if (Math.abs(d) < 0.05) return 'exactly the 30-year average';
    return mag + ' °C ' + (d > 0 ? 'above' : 'below') + ' normal';
  }

  function currentRows() {
    return DATA[WINDOWS[windowKey].series];
  }

  function setWindow(k) {
    windowKey = k;
    var btns = document.querySelectorAll('.wc-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-key') === k);
    }
    setInfo('Hover any point to compare it with the 30-year average.' +
            (WINDOWS[k].series === 'monthly'
              ? ' Each point is one month averaged from about 30 daily readings.'
              : ' Red points are record days — click one.'), false);
    render();
  }

  function setInfo(html, isRecord) {
    var el = document.getElementById('wc-info');
    el.innerHTML = html;
    el.classList.toggle('record', !!isRecord);
  }

  // ---- rendering --------------------------------------------------------

  function render() {
    var cfgWin = WINDOWS[windowKey];
    var rows = currentRows();
    var monthly = cfgWin.series === 'monthly';

    document.getElementById('wc-note').textContent = cfgWin.note;
    document.getElementById('wc-caption').textContent = cfgWin.caption;

    var labels = rows.map(function (r) { return r.d; });
    var values = rows.map(function (r) { return r.v; });

    var datasets = [{
      label: monthly ? 'Monthly mean temperature' : 'Daily mean temperature',
      data: values,
      borderColor: COLORS.daily,
      backgroundColor: 'rgba(143,169,191,.18)',
      borderWidth: monthly ? 1 : 1.6,
      tension: 0.15,
      fill: cfgWin.series === 'week',
      pointRadius: rows.map(function (r) {
        if (r.x) return 5;
        return cfgWin.series === 'week' ? 5 : (cfgWin.series === 'year' ? 0 : 0);
      }),
      pointHoverRadius: 6,
      pointBackgroundColor: rows.map(function (r) {
        return r.x ? COLORS.extreme : COLORS.dailyPoint;
      }),
      pointBorderColor: rows.map(function (r) {
        return r.x ? COLORS.extreme : COLORS.dailyPoint;
      }),
      order: 3
    }];

    // 30-year average line (available in every window)
    if (showOverlay) {
      datasets.push({
        label: '30-year average (' + DATA.normal.toFixed(1) + ' °C)',
        data: values.map(function () { return DATA.normal; }),
        borderColor: COLORS.normal,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0,
        order: 2
      });
    }

    // Fitted trend line: only in the thirty-year window.
    if (showOverlay && cfgWin.trendEnabled) {
      var t = DATA.trend;
      datasets.push({
        label: 'Fitted trend (+' + t.perDecade.toFixed(2) + ' °C per decade)',
        data: values.map(function (_, i) { return t.intercept + t.slopePerMonth * i; }),
        borderColor: COLORS.trend,
        borderWidth: 3,
        borderDash: [7, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0,
        order: 1
      });
    }

    // The overlay checkbox stays usable everywhere, but we explain in the note
    // why no trend line appears in the short windows.
    var tog = document.querySelector('.wc-toggle');
    tog.classList.toggle('disabled', false);

    var cfg = {
      type: 'line',
      data: { labels: labels, datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        onClick: function (evt, els) {
          if (!els.length) return;
          var idx = els[0].index;
          var r = currentRows()[idx];
          if (r && r.x) {
            setInfo('<strong>' + fmtDate(r.d, false) + ': ' + r.v.toFixed(1) + ' °C</strong><br>' +
                    'This was an unusual day. Notice that it does not move the 30-year ' +
                    'average line at all.', true);
          } else if (r) {
            setInfo(fmtDate(r.d, monthly) + ': ' + r.v.toFixed(1) + ' °C, which is ' +
                    departure(r.v) + '.', false);
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: cfgWin.series === 'week' ? 7 : (cfgWin.series === 'year' ? 12 : 10),
              font: { size: 11 },
              callback: function (val, i) {
                var iso = this.getLabelForValue(val);
                var p = iso.split('-');
                if (cfgWin.series === 'week') return parseInt(p[2], 10) + ' Jan';
                if (cfgWin.series === 'year') {
                  var mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  return mn[parseInt(p[1], 10) - 1];
                }
                return p[0];
              }
            },
            title: {
              display: true,
              text: cfgWin.series === 'week' ? 'Date (January 2024)'
                   : cfgWin.series === 'year' ? 'Month of 2024'
                   : 'Year',
              font: { size: 13 }
            },
            grid: { color: 'rgba(0,0,0,.05)' }
          },
          y: {
            // FIXED across all three windows - this is the whole point.
            min: DATA.yAxis.min,
            max: DATA.yAxis.max,
            ticks: { stepSize: 10, font: { size: 12 } },
            title: { display: true, text: 'Mean temperature (°C)', font: { size: 13 } },
            grid: { color: 'rgba(0,0,0,.07)' }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { boxWidth: 26, font: { size: 12 }, usePointStyle: false }
          },
          tooltip: {
            callbacks: {
              title: function (items) {
                return fmtDate(items[0].label, monthly);
              },
              label: function (ctx) {
                if (ctx.datasetIndex !== 0) {
                  return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(2) + ' °C';
                }
                var r = currentRows()[ctx.dataIndex];
                var lines = [ctx.parsed.y.toFixed(1) + ' °C, which is ' + departure(ctx.parsed.y)];
                if (r && r.x) lines.push('Record day');
                return lines;
              }
            }
          }
        }
      }
    };

    if (chart) chart.destroy();
    chart = new Chart(document.getElementById('wc-canvas').getContext('2d'), cfg);
  }

  // ---- boot -------------------------------------------------------------

  function boot() {
    injectStyles();
    buildUI();
    fetch('climate-data.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (json) {
        DATA = json;
        setWindow('week');
      })
      .catch(function (err) {
        setInfo('Could not load climate-data.json (' + err.message +
                '). This page must be served over http, not opened directly from disk.', true);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
