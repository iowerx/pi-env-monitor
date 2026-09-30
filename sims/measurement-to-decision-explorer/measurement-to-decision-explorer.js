// Measurement to Decision Explorer - vis-network
// CANVAS_HEIGHT: 652
// Bloom Level: Analyze (L4) - the learner organises seven measurements, the
// quantities derived from them, and the real decisions they drive, then traces
// any decision back to what it requires.
// A graph is the correct representation because the relationships are genuinely
// many-to-many: no table can show that wind feeds eleven different decisions
// while also showing that wildfire risk needs four separate inputs. The
// sensor-failure mode is the sharpest statement of why each sensor is there.

(function () {
  'use strict';

  var network = null, nodesDS = null, edgesDS = null;
  var mode = 'Explore';            // Explore | Failure
  var selected = null;
  var chapterFilter = 'All';
  var disabled = {};

  // ---- the graph -----------------------------------------------------------

  var MEAS = [
    { id: 'temp', label: 'Temperature', ch: 6, unit: '°C' },
    { id: 'pres', label: 'Barometric\nPressure', ch: 7, unit: 'hPa' },
    { id: 'hum', label: 'Humidity', ch: 8, unit: '% RH' },
    { id: 'sol', label: 'Solar\nRadiation', ch: 9, unit: 'W/m²' },
    { id: 'wind', label: 'Wind Speed', ch: 10, unit: 'm/s' },
    { id: 'seis', label: 'Ground\nMotion', ch: 11, unit: 'mm/s²' },
    { id: 'loc', label: 'Location\nand Time', ch: 5, unit: 'deg, UTC' }
  ];

  var DERIV = [
    { id: 'dew', label: 'Dew Point', ch: 8 },
    { id: 'hidx', label: 'Heat Index', ch: 10 },
    { id: 'chill', label: 'Wind Chill', ch: 10 },
    { id: 'tend', label: 'Pressure\nTendency', ch: 15 },
    { id: 'insol', label: 'Insolation', ch: 15 },
    { id: 'et', label: 'Evapo-\ntranspiration', ch: 17 },
    { id: 'gdd', label: 'Growing\nDegree Days', ch: 17 },
    { id: 'fire', label: 'Fire Danger\nIndex', ch: 17 },
    { id: 'sust', label: 'Sustained\nWind', ch: 15 },
    { id: 'slp', label: 'Sea Level\nPressure', ch: 7 }
  ];

  var DEC = [
    { id: 'fcst', label: 'Weather\nForecasting',
      who: 'A forecaster, twice a day, for everyone downstream of them.' },
    { id: 'severe', label: 'Severe Weather\nWarning',
      who: 'A national met service deciding whether to interrupt television.' },
    { id: 'agri', label: 'Agricultural\nPlanning',
      who: 'A farmer choosing a planting date, months in advance.' },
    { id: 'irrig', label: 'Irrigation\nScheduling',
      who: 'A grower deciding how much water to apply this week.' },
    { id: 'energy', label: 'Energy Demand\nForecast',
      who: 'A grid operator deciding which power stations run tomorrow.' },
    { id: 'pv', label: 'Solar Energy\nGeneration',
      who: 'An engineer sizing an array, and a trader bidding its output.' },
    { id: 'avia', label: 'Aviation\nSafety',
      who: 'A pilot and a controller deciding whether to land.' },
    { id: 'wdes', label: 'Building Code\nWind Design',
      who: 'A code committee setting the load every new roof must survive.' },
    { id: 'sdes', label: 'Building Code\nSeismic Design',
      who: 'A code committee deciding what a building must not fall down in.' },
    { id: 'uhi', label: 'Urban Heat Island\nMitigation',
      who: 'A city planner choosing where to plant trees and what to pave with.' },
    { id: 'air', label: 'Air Quality\nAdvisory',
      who: 'A health agency telling people with asthma to stay indoors.' },
    { id: 'wild', label: 'Wildfire Risk and\nPower Shutoff',
      who: 'A utility deciding whether to cut power to a hundred thousand homes.' },
    { id: 'flood', label: 'Flood\nWarning',
      who: 'An emergency service deciding whether to evacuate a valley.' },
    { id: 'tsu', label: 'Tsunami\nWarning',
      who: 'A warning centre with minutes to decide, using Chapter 11 physics.' },
    { id: 'clim', label: 'Climate\nRecord',
      who: 'Everyone, eventually. The record only exists if somebody kept it.' }
  ];

  // [from, to, required?]  required = solid "required by", else dashed "improves"
  var LINKS = [
    ['temp', 'dew', 1], ['hum', 'dew', 1],
    ['temp', 'hidx', 1], ['hum', 'hidx', 1],
    ['temp', 'chill', 1], ['wind', 'chill', 1],
    ['pres', 'tend', 1], ['loc', 'tend', 1],
    ['sol', 'insol', 1], ['loc', 'insol', 1],
    ['temp', 'et', 1], ['hum', 'et', 1], ['wind', 'et', 1], ['sol', 'et', 1],
    ['temp', 'gdd', 1], ['loc', 'gdd', 1],
    ['temp', 'fire', 1], ['hum', 'fire', 1], ['wind', 'fire', 1],
    ['wind', 'sust', 1], ['loc', 'sust', 1],
    ['pres', 'slp', 1], ['loc', 'slp', 1], ['temp', 'slp', 0],

    ['tend', 'fcst', 1], ['dew', 'fcst', 1], ['sust', 'fcst', 1], ['temp', 'fcst', 1],
    ['tend', 'severe', 1], ['sust', 'severe', 1], ['temp', 'severe', 1], ['hum', 'severe', 0],
    ['gdd', 'agri', 1], ['et', 'agri', 1], ['dew', 'agri', 0],
    ['et', 'irrig', 1], ['hum', 'irrig', 1], ['sol', 'irrig', 0],
    ['hidx', 'energy', 1], ['chill', 'energy', 1], ['temp', 'energy', 1],
    ['insol', 'pv', 1], ['loc', 'pv', 1], ['temp', 'pv', 0],
    ['sust', 'avia', 1], ['dew', 'avia', 1], ['slp', 'avia', 1], ['temp', 'avia', 1],
    ['sust', 'wdes', 1], ['loc', 'wdes', 1],
    ['seis', 'sdes', 1], ['loc', 'sdes', 1],
    ['temp', 'uhi', 1], ['sol', 'uhi', 1], ['loc', 'uhi', 1], ['wind', 'uhi', 0],
    ['wind', 'air', 1], ['temp', 'air', 1], ['sol', 'air', 0], ['hum', 'air', 0],
    ['fire', 'wild', 1], ['sust', 'wild', 1], ['hum', 'wild', 1], ['temp', 'wild', 1],
    ['loc', 'flood', 1], ['tend', 'flood', 0], ['hum', 'flood', 0],
    ['seis', 'tsu', 1], ['loc', 'tsu', 1],
    ['temp', 'clim', 1], ['hum', 'clim', 1], ['pres', 'clim', 1], ['sol', 'clim', 1],
    ['wind', 'clim', 1], ['loc', 'clim', 1]
  ];

  var GAPS = {
    flood: 'Flood warning also needs precipitation history, which this station does ' +
           'not measure. Knowing what you cannot measure is part of measuring.',
    wild: 'Wildfire risk also uses fuel moisture and precipitation history. No single ' +
          'measurement is sufficient for any of this.',
    air: 'Air quality advisories also need the pollutant concentrations themselves. ' +
         'Your station supplies the meteorology that decides where they go.'
  };

  var COL = {
    meas: { bg: '#bbdefb', bd: '#1565c0', fg: '#0d2b45' },
    deriv: { bg: '#eceff1', bd: '#78909c', fg: '#37474f' },
    dec: { bg: '#ffe0b2', bd: '#ef6c00', fg: '#4e342e' },
    off: { bg: '#f5f5f5', bd: '#bdbdbd', fg: '#9e9e9e' }
  };

  function allNodes() {
    return MEAS.map(m => Object.assign({ kind: 'meas', level: 0 }, m))
      .concat(DERIV.map(d => Object.assign({ kind: 'deriv', level: 1 }, d)))
      .concat(DEC.map(d => Object.assign({ kind: 'dec', level: 2, ch: 17 }, d)));
  }
  var NODES = allNodes();
  function nodeById(id) { return NODES.find(n => n.id === id); }
  function parentsOf(id) { return LINKS.filter(l => l[1] === id); }
  function childrenOf(id) { return LINKS.filter(l => l[0] === id); }

  // How many of the fifteen decisions does this measurement eventually reach?
  function downstreamDecisions(id) {
    var seen = {}, out = {};
    (function walk(n) {
      if (seen[n]) return;
      seen[n] = 1;
      for (var l of childrenOf(n)) {
        if (nodeById(l[1]).kind === 'dec') out[l[1]] = 1;
        walk(l[1]);
      }
    })(id);
    return Object.keys(out);
  }
  function upstreamMeasurements(id) {
    var seen = {}, out = {};
    (function walk(n) {
      if (seen[n]) return;
      seen[n] = 1;
      for (var l of parentsOf(n)) {
        if (nodeById(l[0]).kind === 'meas') out[l[0]] = 1;
        walk(l[0]);
      }
    })(id);
    return Object.keys(out);
  }
  function edgeWidthFor(id) {
    // a measurement reaching more decisions gets thicker edges
    if (nodeById(id).kind !== 'meas') return 1.4;
    var n = downstreamDecisions(id).length;
    return 1 + n / 5;
  }

  // ---- availability, for the sensor-failure mode ---------------------------

  function available(id) {
    var n = nodeById(id);
    if (n.kind === 'meas') return !disabled[id];
    return parentsOf(id).filter(l => l[2]).every(l => available(l[0]));
  }
  function decStatus(id) {
    var req = parentsOf(id).filter(l => l[2]);
    if (req.some(l => !available(l[0]))) return 'impossible';
    var imp = parentsOf(id).filter(l => !l[2]);
    if (imp.some(l => !available(l[0]))) return 'degraded';
    return 'ok';
  }

  // ---- UI ------------------------------------------------------------------

  function injectStyles() {
    var css = [
      '.md-wrap { font-family: Arial, Helvetica, sans-serif; padding: 4px 10px; }',
      '.md-title { margin: 2px 0; font-size: 20px; text-align: center; color: #212121; }',
      '.md-frame { background: #0d2b45; color: #fff; font-size: 11.5px; padding: 6px 10px;',
      '  border-radius: 4px; margin-bottom: 5px; text-align: center; }',
      '.md-row { display: flex; gap: 5px; flex-wrap: wrap; align-items: center;',
      '  margin-bottom: 5px; }',
      '.md-btn { font-family: inherit; font-size: 11px; padding: 4px 9px; cursor: pointer;',
      '  border: 1px solid #b0bec5; background: #fff; color: #37474f; border-radius: 4px; }',
      '.md-btn.on { background: #1565c0; border-color: #0d47a1; color: #fff; font-weight: bold; }',
      '.md-sel { font-family: inherit; font-size: 11px; padding: 3px; }',
      '.md-lab { font-size: 11px; color: #546e7a; }',
      '.md-flex { display: flex; gap: 6px; align-items: stretch; }',
      '.md-net { flex: 1 1 auto; height: 384px; border: 1px solid #c3d0dc;',
      '  border-radius: 4px; background: #fbfdff; min-width: 0; }',
      '.md-side { width: 246px; flex: 0 0 246px; border: 1px solid #c3d0dc;',
      '  border-radius: 4px; padding: 7px 9px; font-size: 11px; color: #263238;',
      '  overflow: hidden; }',
      '.md-side h4 { margin: 0 0 4px 0; font-size: 12.5px; color: #0d2b45; }',
      '.md-side b { color: #0d47a1; }',
      '.md-side .warn { color: #b71c1c; }',
      '.md-side ul { margin: 3px 0 5px 16px; padding: 0; }',
      '.md-legend { display: flex; gap: 10px; flex-wrap: wrap; font-size: 10px;',
      '  color: #546e7a; margin-top: 5px; align-items: center; }',
      '.md-sw { display: inline-block; width: 12px; height: 10px; border: 1px solid #888;',
      '  vertical-align: middle; margin-right: 3px; }',
      '@media (max-width: 720px) {',
      '  .md-flex { flex-direction: column; }',
      '  .md-net { height: 300px; }',
'  .md-side { height: 152px; overflow-y: auto; }',
      '  .md-side { width: auto; flex: 1 1 auto; font-size: 10.5px; }',
      '  .md-title { font-size: 17px; }',
      '  .md-frame { font-size: 10.5px; }',
      '  .md-btn, .md-sel, .md-lab { font-size: 10px; padding: 3px 6px; }',
      '}'
    ].join('\n');
    var el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
  }

  function buildUI() {
    var main = document.querySelector('main');
    var w = document.createElement('div');
    w.className = 'md-wrap';
    var chapters = [5, 6, 7, 8, 9, 10, 11, 15, 17];
    w.innerHTML =
      '<h3 class="md-title">Measurement to Decision Explorer</h3>' +
      '<div class="md-frame">Every arrow is a real dependency. Somewhere, someone ' +
      'makes this decision using this measurement.</div>' +
      '<div class="md-row">' +
        '<button class="md-btn on" id="md-explore">Explore</button>' +
        '<button class="md-btn" id="md-fail">Sensor failure</button>' +
        '<span class="md-lab">Chapter</span>' +
        '<select class="md-sel" id="md-chap"><option>All</option>' +
        chapters.map(c => '<option>' + c + '</option>').join('') + '</select>' +
        '<button class="md-btn" id="md-reset">Reset</button>' +
        '<button class="md-btn" id="md-fit">Fit</button></div>' +
      '<div class="md-flex"><div class="md-net" id="md-net"></div>' +
      '<div class="md-side" id="md-side"></div></div>' +
      '<div class="md-legend">' +
        '<span><span class="md-sw" style="background:#bbdefb;border-color:#1565c0"></span>' +
        'measurement</span>' +
        '<span><span class="md-sw" style="background:#eceff1;border-color:#78909c"></span>' +
        'derived quantity</span>' +
        '<span><span class="md-sw" style="background:#ffe0b2;border-color:#ef6c00"></span>' +
        'decision</span>' +
        '<span>solid arrow = required by</span>' +
        '<span>dashed arrow = improves</span>' +
        '<span>thicker arrow = feeds more decisions</span>' +
        '<span>drag the background to pan, wheel to zoom</span></div>';
    main.appendChild(w);

    document.getElementById('md-explore').addEventListener('click', function () {
      mode = 'Explore'; disabled = {}; refresh();
    });
    document.getElementById('md-fail').addEventListener('click', function () {
      mode = 'Failure'; selected = null; refresh();
    });
    document.getElementById('md-chap').addEventListener('change', function (e) {
      chapterFilter = e.target.value; rebuild();
    });
    document.getElementById('md-reset').addEventListener('click', function () {
      mode = 'Explore'; disabled = {}; selected = null; chapterFilter = 'All';
      document.getElementById('md-chap').value = 'All';
      rebuild();
    });
    document.getElementById('md-fit').addEventListener('click', function () {
      if (network) fitWithFloor();
    });
  }

  function visibleIds() {
    if (chapterFilter === 'All') return NODES.map(n => n.id);
    var ch = parseInt(chapterFilter, 10);
    var keep = {};
    for (var m of MEAS) if (m.ch === ch) keep[m.id] = 1;
    for (var d of DERIV) if (d.ch === ch) keep[d.id] = 1;
    // pull in everything those nodes touch, so a subgraph is still readable
    var seeds = Object.keys(keep);
    for (var s of seeds) {
      for (var id of downstreamDecisions(s)) keep[id] = 1;
      for (var l of childrenOf(s)) keep[l[1]] = 1;
      for (var l2 of parentsOf(s)) keep[l2[0]] = 1;
    }
    if (ch === 17) for (var dd of DEC) keep[dd.id] = 1;
    return Object.keys(keep);
  }

  function rebuild() {
    var vis_ids = visibleIds();
    var nd = [], ed = [];
    for (var n of NODES) {
      if (vis_ids.indexOf(n.id) < 0) continue;
      nd.push({ id: n.id, label: n.label, level: n.level });
    }
    for (var i = 0; i < LINKS.length; i++) {
      var l = LINKS[i];
      if (vis_ids.indexOf(l[0]) < 0 || vis_ids.indexOf(l[1]) < 0) continue;
      ed.push({ id: 'e' + i, from: l[0], to: l[1], req: l[2] });
    }
    nodesDS = new vis.DataSet(nd);
    edgesDS = new vis.DataSet(ed);
    var container = document.getElementById('md-net');
    if (network) network.destroy();
    network = new vis.Network(container, { nodes: nodesDS, edges: edgesDS }, {
      layout: { hierarchical: { enabled: true, direction: 'LR', sortMethod: 'directed',
                                levelSeparation: 172, nodeSpacing: 30, treeSpacing: 34 } },
      physics: false,
      interaction: { hover: true, dragNodes: true, dragView: true, zoomView: true,
                     tooltipDelay: 120 },
      nodes: { shape: 'box', margin: 4, widthConstraint: { maximum: 106 },
               font: { size: 10, multi: false }, borderWidth: 1.4 },
      edges: { arrows: { to: { enabled: true, scaleFactor: 0.5 } },
               smooth: { type: 'cubicBezier', forceDirection: 'horizontal', roundness: 0.5 } }
    });
    network.on('click', function (p) {
      if (p.nodes.length) onNode(p.nodes[0]);
      else { selected = null; refresh(); }
    });
    refresh();
    fitWithFloor();
  }

  function fitWithFloor() {
    if (!network) return;
    network.fit({ animation: false });
    var sc = network.getScale();
    if (sc < 0.66) {
      var p = network.getViewPosition();
      network.moveTo({ scale: 0.66, position: { x: p.x - 40, y: p.y }, animation: false });
    }
  }

  function onNode(id) {
    var n = nodeById(id);
    if (mode === 'Failure') {
      if (n.kind === 'meas') disabled[id] = !disabled[id];
      selected = id;
    } else {
      selected = (selected === id) ? null : id;
    }
    refresh();
  }

  // ---- rendering -----------------------------------------------------------

  function refresh() {
    document.getElementById('md-explore').className =
      'md-btn' + (mode === 'Explore' ? ' on' : '');
    document.getElementById('md-fail').className =
      'md-btn' + (mode === 'Failure' ? ' on' : '');
    if (!nodesDS) return;

    var lit = {};
    if (selected && mode === 'Explore') {
      var n = nodeById(selected);
      lit[selected] = 1;
      if (n.kind === 'dec') {
        for (var m of upstreamMeasurements(selected)) lit[m] = 1;
        (function up(x) {
          for (var l of parentsOf(x)) { if (!lit[l[0]]) { lit[l[0]] = 1; up(l[0]); } }
        })(selected);
      } else {
        (function down(x) {
          for (var l of childrenOf(x)) { if (!lit[l[1]]) { lit[l[1]] = 1; down(l[1]); } }
        })(selected);
      }
    }
    var anyLit = Object.keys(lit).length > 0;

    nodesDS.update(nodesDS.getIds().map(function (id) {
      var n = nodeById(id);
      var c = COL[n.kind];
      var off = mode === 'Failure' && n.kind === 'meas' && disabled[id];
      var status = (mode === 'Failure' && n.kind === 'dec') ? decStatus(id) : 'ok';
      if (off) c = COL.off;
      var bg = c.bg, bd = c.bd, fg = c.fg, bw = 1.4;
      if (status === 'impossible') { bg = '#ffcdd2'; bd = '#b71c1c'; fg = '#7f0000'; bw = 2; }
      else if (status === 'degraded') { bg = '#fff3c4'; bd = '#e65100'; fg = '#6d3b00'; bw = 2; }
      if (anyLit && !lit[id]) {
        bg = '#f7f9fb'; bd = '#dfe6ec'; fg = '#b0bec5';
      }
      if (id === selected) bw = 3;
      return { id: id, color: { background: bg, border: bd,
                                highlight: { background: bg, border: bd } },
               font: { color: fg, size: 11 }, borderWidth: bw,
               shapeProperties: { borderDashes: off ? [4, 3] : false },
               title: tooltipFor(n) };
    }));

    edgesDS.update(edgesDS.getIds().map(function (eid) {
      var e = edgesDS.get(eid);
      var dim = anyLit && !(lit[e.from] && lit[e.to]);
      var broken = mode === 'Failure' && !available(e.from);
      var w = edgeWidthFor(e.from);
      return { id: eid,
               dashes: e.req ? false : [5, 4],
               width: dim ? 0.6 : w,
               color: { color: broken ? '#ef9a9a' : (dim ? '#e6ecf1' : '#90a4ae'),
                        opacity: dim ? 0.5 : 1 },
               title: e.req ? 'required by' : 'improves' };
    }));

    sidePanel();
  }

  function tooltipFor(n) {
    if (n.kind === 'meas') return n.label.replace('\n', ' ') + ' - ' + n.unit +
      ', Chapter ' + n.ch;
    if (n.kind === 'deriv') return n.label.replace('\n', ' ') +
      ' - derived, Chapter ' + n.ch;
    return n.label.replace('\n', ' ') + ' - ' + n.who;
  }

  function sidePanel() {
    var el = document.getElementById('md-side');
    var html = '';
    if (mode === 'Failure') {
      var offs = MEAS.filter(m => disabled[m.id]);
      html += '<h4>What if this sensor failed?</h4>';
      if (!offs.length) {
        html += '<p>Click any measurement node to switch that sensor off. Every ' +
                'decision that depended on it is marked.</p>' +
                '<p>This is the most direct statement of why each sensor is on the ' +
                'station: whatever goes dark when you remove it is what it was for.</p>';
      } else {
        var imp = DEC.filter(d => decStatus(d.id) === 'impossible');
        var deg = DEC.filter(d => decStatus(d.id) === 'degraded');
        html += '<p>Offline: <b>' +
                offs.map(o => o.label.replace('\n', ' ')).join(', ') + '</b></p>';
        html += '<p class="warn"><b>' + imp.length + ' of ' + DEC.length +
                '</b> decisions are now impossible.</p>';
        if (imp.length) {
          html += '<ul>' + imp.slice(0, 7).map(d =>
            '<li>' + d.label.replace('\n', ' ') + '</li>').join('') +
            (imp.length > 7 ? '<li>and ' + (imp.length - 7) + ' more</li>' : '') + '</ul>';
        }
        html += '<p>' + deg.length + ' more are degraded but still possible.</p>';
        var deadD = DERIV.filter(d => !available(d.id));
        if (deadD.length) {
          html += '<p>Derived quantities that can no longer be computed: <b>' +
                  deadD.map(d => d.label.replace('\n', ' ')).join(', ') + '</b>.</p>';
        }
      }
      el.innerHTML = html;
      return;
    }

    if (!selected) {
      var counts = MEAS.map(m => ({ m: m, n: downstreamDecisions(m.id).length }))
                       .sort((a, b) => b.n - a.n);
      html += '<h4>Seventeen chapters, one structure</h4>' +
        '<p>Seven measurements, ten quantities derived from them, fifteen decisions ' +
        'that people really make. Click any node.</p>' +
        '<p>Decisions reached by each measurement:</p><ul>' +
        counts.map(c => '<li><b>' + c.m.label.replace('\n', ' ') + '</b> feeds ' +
          c.n + ' of ' + DEC.length + '</li>').join('') + '</ul>';
      el.innerHTML = html;
      return;
    }

    var n = nodeById(selected);
    if (n.kind === 'dec') {
      var ms = upstreamMeasurements(selected).map(id => nodeById(id).label.replace('\n', ' '));
      var req = parentsOf(selected).filter(l => l[2]).map(l => nodeById(l[0]).label.replace('\n', ' '));
      var impv = parentsOf(selected).filter(l => !l[2]).map(l => nodeById(l[0]).label.replace('\n', ' '));
      html += '<h4>' + n.label.replace('\n', ' ') + '</h4>' +
        '<p>' + n.who + '</p>' +
        '<p>Requires <b>' + ms.length + '</b> of the seven measurements: <b>' +
        ms.join(', ') + '</b>.' +
        (ms.length > 1 ? ' No single measurement is sufficient.' : '') + '</p>' +
        '<p>Direct inputs: ' + req.join(', ') + '.' +
        (impv.length ? ' Improved by: ' + impv.join(', ') + '.' : '') + '</p>' +
        (GAPS[selected] ? '<p class="warn">' + GAPS[selected] + '</p>' : '');
    } else {
      var ds = downstreamDecisions(selected);
      html += '<h4>' + n.label.replace('\n', ' ') + '</h4>' +
        (n.kind === 'meas'
          ? '<p>Measured in ' + n.unit + '. Chapter ' + n.ch + '.</p>'
          : '<p>A derived quantity, introduced in Chapter ' + n.ch + '. It cannot be ' +
            'read off an instrument; it has to be computed from a series.</p>') +
        '<p><b>' + n.label.replace('\n', ' ') + '</b> feeds <b>' + ds.length + ' of ' +
        DEC.length + '</b> decisions in this diagram.</p><ul>' +
        ds.slice(0, 8).map(id => '<li>' + nodeById(id).label.replace('\n', ' ') +
          '</li>').join('') +
        (ds.length > 8 ? '<li>and ' + (ds.length - 8) + ' more</li>' : '') + '</ul>';
    }
    el.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    buildUI();
    rebuild();
    // A small read-only hook so the graph can be inspected from outside the
    // closure. Nothing in the sim depends on it.
    window.mdeGraph = {
      MEAS: MEAS, DERIV: DERIV, DEC: DEC, LINKS: LINKS,
      nodeById: nodeById, downstreamDecisions: downstreamDecisions,
      upstreamMeasurements: upstreamMeasurements, decStatus: decStatus,
      available: available,
      counts: function () { return [nodesDS.length, edgesDS.length]; },
      scale: function () { return network.getScale(); },
      click: function (id) { onNode(id); },
      setMode: function (m) { mode = m; selected = null; disabled = {}; refresh(); },
      setFilter: function (f) { chapterFilter = f; rebuild(); },
      clearOff: function () { disabled = {}; refresh(); }
    };
  });
})();
