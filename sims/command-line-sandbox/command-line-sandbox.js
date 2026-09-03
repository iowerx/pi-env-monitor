// Command Line Sandbox MicroSim
// CANVAS_HEIGHT: 654
// Bloom Level: Apply (L3) - the learner executes real shell commands against a
// simulated station file system and applies the permission model to work out why
// a script will not run.
// The terminal and the file tree are shown together on purpose: beginners lose
// track of where they are, and watching the tree highlight move with each cd is
// what builds the spatial model that pwd alone does not.
// Nothing here touches a real shell. The file system is a nested object and the
// parser is a tokeniser, so rm is safe to try - which is exactly the point.
// MicroSim template version 2026.03

// ---- responsive canvas globals ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 496;
let controlHeight = 158;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NARROW_BREAKPOINT = 720;
const MONO = 'monospace';

const PERM_MEANING = {
  0: { r: 'd - this is a directory', n: '- - this is a normal file' },
  own: 'owner', grp: 'group', oth: 'others'
};

// ---- the simulated file system -------------------------------------------

function freshFs() {
  const f = (name, perm, size, content) =>
    ({ name: name, type: 'f', perm: perm, owner: 'ubuntu', group: 'ubuntu',
       size: size, date: 'Aug 25 14:30', content: content });
  const d = (name, perm, owner, kids) =>
    ({ name: name, type: 'd', perm: perm || 'rwxr-xr-x', owner: owner || 'root',
       group: owner || 'root', size: 4096, date: 'Aug 25 14:30', kids: kids || [] });

  const readings = [];
  readings.push('timestamp,temperature_c,pressure_hpa,humidity_pct');
  const rows = [
    ['2026-08-25T14:20:00Z', '21.4', '1013.2', '54.1'],
    ['2026-08-25T14:25:00Z', '21.6', '1013.1', '53.8'],
    ['2026-08-25T14:30:00Z', '21.9', '1013.0', '53.2'],
    ['2026-08-25T14:35:00Z', '22.1', '1012.9', '52.9'],
    ['2026-08-25T14:40:00Z', '22.4', '1012.8', '52.4'],
    ['2026-08-25T14:45:00Z', '22.6', '1012.8', '52.0'],
    ['2026-08-25T14:50:00Z', '22.8', '1012.7', '51.6']
  ];
  for (const r of rows) readings.push(r.join(','));

  const logger = [
    '#!/usr/bin/env python3',
    '"""Read the BME280 and append one row to readings.csv."""',
    'import csv, time',
    'from datetime import datetime, timezone',
    '',
    'while True:',
    '    # sensor read goes here - Chapter 13',
    '    stamp = datetime.now(timezone.utc).isoformat()',
    '    print(stamp)',
    '    time.sleep(300)'
  ];

  const service = [
    '[Unit]',
    'Description=Environmental station logger',
    'After=network.target',
    '',
    '[Service]',
    'ExecStart=/usr/bin/python3 /home/ubuntu/station/logger.py',
    'Restart=always',
    'RestartSec=10',
    'User=ubuntu',
    '',
    '[Install]',
    'WantedBy=multi-user.target'
  ];

  const config = [
    '{',
    '  "station_id": "station01",',
    '  "interval_s": 300,',
    '  "i2c_address": "0x76",',
    '  "output": "/home/ubuntu/station/readings.csv"',
    '}'
  ];

  return d('/', 'rwxr-xr-x', 'root', [
    d('home', 'rwxr-xr-x', 'root', [
      d('ubuntu', 'rwxr-xr-x', 'ubuntu', [
        d('station', 'rwxr-xr-x', 'ubuntu', [
          f('logger.py', 'rw-r--r--', 412, logger),
          f('readings.csv', 'rw-r--r--', 2048, readings),
          f('config.json', 'rw-r--r--', 168, config)
        ])
      ])
    ]),
    d('etc', 'rwxr-xr-x', 'root', [
      d('systemd', 'rwxr-xr-x', 'root', [
        d('system', 'rwxr-xr-x', 'root', [
          Object.assign(f('station-logger.service', 'rw-r--r--', 246, service),
                        { owner: 'root', group: 'root' })
        ])
      ])
    ]),
    d('var', 'rwxr-xr-x', 'root', [ d('log', 'rwxr-xr-x', 'root', []) ]),
    d('dev', 'rwxr-xr-x', 'root', [
      Object.assign(f('i2c-1', 'rw-rw----', 0, ['(device file)']),
                    { owner: 'root', group: 'i2c' }),
      Object.assign(f('ttyS0', 'rw-rw----', 0, ['(device file)']),
                    { owner: 'root', group: 'dialout' })
    ]),
    d('usr', 'rwxr-xr-x', 'root', [ d('bin', 'rwxr-xr-x', 'root', []) ])
  ]);
}

// ---- tasks ---------------------------------------------------------------

const TASKS = [
  { id: 'pwd', txt: 'Find out where you are' },
  { id: 'cd', txt: 'Navigate to the station directory' },
  { id: 'lsl', txt: 'List the files with their permissions' },
  { id: 'tail', txt: 'Show the last 5 lines of readings.csv' },
  { id: 'chmod', txt: 'Work out why logger.py will not run, and fix it' },
  { id: 'svc', txt: 'Find the systemd service file' },
  { id: 'df', txt: 'Check free disk space' }
];

// ---- state ----
let fs = freshFs();
let cwd = ['home', 'ubuntu'];
let out = [];                   // {text, col, perm:{...}}
let history = [], histIdx = -1;
let done = {};
let warnOverlay = false;
let scroll = 0;
let cmdInput;
let promptPx = 0;
let hoverPerm = null;
let chipHits = [], permHits = [];
let termBox = { x: 0, y: 0, w: 10, h: 10 };
let treeBox = { x: 0, y: 0, w: 10, h: 10 };
let taskBox = { x: 0, y: 0, w: 10, h: 10 };

function setup() {
  updateCanvasSize();
  const c = createCanvas(containerWidth, canvasHeight);
  c.parent(document.querySelector('main'));
  textFont('Arial');

  cmdInput = createInput('');
  cmdInput.parent(document.querySelector('main'));
  cmdInput.elt.setAttribute('aria-label', 'shell command');
  cmdInput.elt.setAttribute('spellcheck', 'false');
  cmdInput.elt.setAttribute('autocomplete', 'off');
  cmdInput.style('font-family', MONO);
  cmdInput.style('font-size', '12px');
  cmdInput.style('background', 'transparent');
  cmdInput.style('color', '#d7f9d7');
  cmdInput.style('border', 'none');
  cmdInput.style('outline', 'none');
  cmdInput.style('padding', '0');
  cmdInput.elt.addEventListener('keydown', onKey);

  banner();
  layoutControls();
  describe('A simulated Linux terminal with a station file system, shown beside a ' +
           'live file tree that highlights the current directory, plus a task list.');
}

function banner() {
  out = [];
  push2('Ubuntu 24.04 LTS  station01', '#7fb3d5');
  push2('Simulated shell. Nothing here touches a real machine.', '#7f8c8d');
  push2('Try: pwd, ls, ls -l, cd, cat, head, tail, chmod, df -h, man', '#7f8c8d');
  push2('', '#ffffff');
}

function push2(t, col, perm) { out.push({ t: t, col: col || '#d7f9d7', perm: perm }); }

// ---- path helpers --------------------------------------------------------

function nodeAt(parts) {
  let n = fs;
  for (const p of parts) {
    if (n.type !== 'd') return null;
    const k = n.kids.find(x => x.name === p);
    if (!k) return null;
    n = k;
  }
  return n;
}

function resolve(arg) {
  if (!arg) return cwd.slice();
  let parts;
  if (arg === '~' || arg.indexOf('~/') === 0) {
    parts = ['home', 'ubuntu'].concat(arg.slice(2).split('/').filter(Boolean));
  } else if (arg[0] === '/') {
    parts = arg.split('/').filter(Boolean);
  } else {
    parts = cwd.concat(arg.split('/').filter(Boolean));
  }
  const outp = [];
  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') { outp.pop(); continue; }
    outp.push(p);
  }
  return outp;
}

function pathStr(parts) {
  if (parts.length >= 2 && parts[0] === 'home' && parts[1] === 'ubuntu') {
    return '~' + (parts.length > 2 ? '/' + parts.slice(2).join('/') : '');
  }
  return '/' + parts.join('/');
}

function prompt() { return 'ubuntu@station01:' + pathStr(cwd) + '$ '; }

// ---- ls -l rendering -----------------------------------------------------

function permBlock(n) { return (n.type === 'd' ? 'd' : '-') + n.perm; }

function longLine(n) {
  const links = n.type === 'd' ? '2' : '1';
  const size = String(n.size).padStart(5, ' ');
  return { block: permBlock(n),
           rest: ' ' + links + ' ' + n.owner.padEnd(6) + ' ' + n.group.padEnd(7) +
                 ' ' + size + ' ' + n.date + ' ' + n.name,
           exec: n.perm[2] === 'x', dir: n.type === 'd' };
}

// ---- the command set -----------------------------------------------------

const KNOWN = ['pwd', 'ls', 'cd', 'cat', 'head', 'tail', 'mkdir', 'cp', 'mv', 'rm',
               'chmod', 'df', 'man', 'clear', 'help'];

const MANPAGES = {
  pwd: 'pwd - print the name of the current working directory.',
  ls: 'ls - list directory contents.  -l gives the long form with permissions, ' +
      'owner, group, size and date.',
  cd: 'cd - change the working directory.  cd .. goes up one level, cd ~ goes home, ' +
      'cd with no argument also goes home.',
  cat: 'cat - print a whole file to the terminal.',
  head: 'head - print the first lines of a file.  -n 5 or -5 for five lines.',
  tail: 'tail - print the last lines of a file.  -n 5 for five.  On a real machine ' +
        '-f follows the file as it grows, which is what you will use while debugging.',
  mkdir: 'mkdir - create a directory.',
  cp: 'cp - copy a file.  cp source destination.',
  mv: 'mv - move or rename a file.  mv old new.',
  rm: 'rm - remove a file.  There is no undo and no recycle bin.  -r removes a ' +
      'directory and everything in it.',
  chmod: 'chmod - change file permissions.  chmod +x file adds execute permission ' +
         'for everyone.  chmod 644 file sets them numerically.',
  df: 'df - report file system disk space usage.  -h gives human-readable units.',
  man: 'man - show the manual page for a command.',
  clear: 'clear - clear the terminal.'
};

function run(line) {
  const raw = line.trim();
  push2(prompt() + raw, '#ffffff');
  if (!raw) return;
  history.push(raw); histIdx = history.length;

  if (raw.replace(/\s+/g, ' ') === 'rm -rf /' ||
      raw.replace(/\s+/g, ' ') === 'sudo rm -rf /') {
    warnOverlay = true;
    return;
  }

  const tok = raw.split(/\s+/);
  const cmd = tok[0];
  const args = tok.slice(1);
  const flags = [], rest = [];
  let optCount = null;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-n' && args[i + 1] !== undefined) {
      optCount = parseInt(args[i + 1], 10);
      flags.push('-n'); i += 1;                 // the count is not a filename
    } else if (a[0] === '-' && a.length > 1) {
      flags.push(a);
      const m = a.match(/^-n?(\d+)$/);
      if (m) optCount = parseInt(m[1], 10);
    } else rest.push(a);
  }
  const hasFlag = (ch) => flags.some(f => f.indexOf(ch) > 0);

  if (cmd.indexOf('./') === 0 || cmd.indexOf('/') === 0) {
    const n = nodeAt(resolve(cmd));
    if (!n || n.type !== 'f') {
      push2('bash: ' + cmd + ': No such file or directory', '#ff8a80');
      return;
    }
    if (n.perm[2] !== 'x') {
      push2('bash: ' + cmd + ': Permission denied', '#ff8a80');
      push2('The file is there and it is readable. Run ls -l and look at the ' +
            'permission block: there is no x in it.', '#7f8c8d');
      done.tried = true;
      return;
    }
    if (n.name === 'logger.py') {
      push2('2026-08-25T14:55:00Z');
      push2('^C  (stopped)', '#7f8c8d');
    } else {
      push2('(ran ' + n.name + ')', '#7f8c8d');
    }
    return;
  }

  if (KNOWN.indexOf(cmd) < 0) {
    push2(cmd + ': command not found in this sandbox.', '#ff8a80');
    push2('Supported here: ' + KNOWN.join(', ') + '.', '#7f8c8d');
    return;
  }

  switch (cmd) {
    case 'help':
      push2('Supported: ' + KNOWN.join(', ') + '. Try "man ls".', '#7f8c8d');
      return;
    case 'clear':
      out = []; return;
    case 'pwd':
      push2('/' + cwd.join('/'));
      done.pwd = true;
      return;
    case 'man': {
      const t = rest[0];
      if (!t) { push2('What manual page do you want?', '#ff8a80'); return; }
      push2(MANPAGES[t] || ('No manual entry for ' + t), MANPAGES[t] ? '#d7f9d7' : '#ff8a80');
      return;
    }
    case 'df': {
      push2('Filesystem      Size  Used Avail Use% Mounted on');
      push2('/dev/mmcblk0p2   29G  4.1G   24G  15% /');
      push2('/dev/mmcblk0p1  253M   61M  192M  25% /boot/firmware');
      push2('tmpfs           1.9G     0  1.9G   0% /dev/shm');
      if (!hasFlag('h')) {
        push2('(this sandbox always prints the -h form)', '#7f8c8d');
      }
      done.df = true;
      return;
    }
    case 'cd': {
      const p = resolve(rest[0] || '~');
      const n = nodeAt(p);
      if (!n) { push2('cd: ' + (rest[0] || '~') + ': No such file or directory', '#ff8a80'); return; }
      if (n.type !== 'd') { push2('cd: ' + rest[0] + ': Not a directory', '#ff8a80'); return; }
      cwd = p;
      if (pathStr(cwd) === '~/station') done.cd = true;
      return;
    }
    case 'ls': {
      const p = resolve(rest[0]);
      const n = nodeAt(p);
      if (!n) { push2('ls: cannot access \'' + rest[0] + '\': No such file or directory', '#ff8a80'); return; }
      const kids = n.type === 'd' ? n.kids : [n];
      if (hasFlag('l')) {
        push2('total ' + (kids.length * 4));
        for (const k of kids) {
          const L = longLine(k);
          push2(L.block + L.rest, L.dir ? '#82b1ff' : (L.exec ? '#b9f6ca' : '#d7f9d7'),
                { block: L.block, name: k.name });
        }
        if (pathStr(p) === '~/station') done.lsl = true;
        if (p.join('/') === 'etc/systemd/system') done.svc = true;
      } else {
        push2(kids.map(k => k.name + (k.type === 'd' ? '/' : '')).join('   '));
        if (p.join('/') === 'etc/systemd/system') done.svc = true;
      }
      return;
    }
    case 'cat': case 'head': case 'tail': {
      const target = rest[0];
      if (!target) { push2(cmd + ': missing file operand', '#ff8a80'); return; }
      const n = nodeAt(resolve(target));
      if (!n) { push2(cmd + ': ' + target + ': No such file or directory', '#ff8a80'); return; }
      if (n.type === 'd') { push2(cmd + ': ' + target + ': Is a directory', '#ff8a80'); return; }
      let lines = n.content.slice();
      const cnt = (optCount && optCount > 0) ? optCount : 10;
      if (cmd === 'head') lines = lines.slice(0, cnt);
      if (cmd === 'tail') lines = lines.slice(-cnt);
      for (const l of lines) push2(l);
      if (cmd === 'tail' && n.name === 'readings.csv' && cnt === 5) done.tail = true;
      if (n.name === 'station-logger.service') done.svc = true;
      return;
    }
    case 'mkdir': {
      const p = resolve(rest[0]);
      if (!rest[0]) { push2('mkdir: missing operand', '#ff8a80'); return; }
      const parent = nodeAt(p.slice(0, -1));
      if (!parent || parent.type !== 'd') { push2('mkdir: cannot create directory', '#ff8a80'); return; }
      if (parent.kids.find(k => k.name === p[p.length - 1])) {
        push2('mkdir: cannot create directory \'' + rest[0] + '\': File exists', '#ff8a80');
        return;
      }
      parent.kids.push({ name: p[p.length - 1], type: 'd', perm: 'rwxr-xr-x',
                         owner: 'ubuntu', group: 'ubuntu', size: 4096,
                         date: 'Aug 25 14:30', kids: [] });
      return;
    }
    case 'cp': case 'mv': {
      if (rest.length < 2) { push2(cmd + ': missing destination file operand', '#ff8a80'); return; }
      const sp = resolve(rest[0]);
      const src = nodeAt(sp);
      if (!src) { push2(cmd + ': cannot stat \'' + rest[0] + '\': No such file or directory', '#ff8a80'); return; }
      let dp = resolve(rest[1]);
      let dn = nodeAt(dp);
      let name = dp[dp.length - 1];
      let parent;
      if (dn && dn.type === 'd') { parent = dn; name = src.name; }
      else { parent = nodeAt(dp.slice(0, -1)); }
      if (!parent || parent.type !== 'd') { push2(cmd + ': target directory does not exist', '#ff8a80'); return; }
      const copy = Object.assign({}, src, { name: name });
      if (src.content) copy.content = src.content.slice();
      const existing = parent.kids.findIndex(k => k.name === name);
      if (existing >= 0) parent.kids[existing] = copy; else parent.kids.push(copy);
      if (cmd === 'mv') {
        const sparent = nodeAt(sp.slice(0, -1));
        sparent.kids = sparent.kids.filter(k => k !== src);
      }
      return;
    }
    case 'rm': {
      if (!rest[0]) { push2('rm: missing operand', '#ff8a80'); return; }
      const p = resolve(rest[0]);
      const n = nodeAt(p);
      if (!n) { push2('rm: cannot remove \'' + rest[0] + '\': No such file or directory', '#ff8a80'); return; }
      if (n.type === 'd' && !hasFlag('r')) {
        push2('rm: cannot remove \'' + rest[0] + '\': Is a directory', '#ff8a80');
        push2('Use rm -r to remove a directory and everything inside it.', '#7f8c8d');
        return;
      }
      const parent = nodeAt(p.slice(0, -1));
      parent.kids = parent.kids.filter(k => k !== n);
      if (cwd.join('/').indexOf(p.join('/')) === 0) cwd = ['home', 'ubuntu'];
      push2('Deleted. There is no recycle bin at the command line.', '#ff5252');
      push2('In the sandbox you can press Reset. On a real station, that data is gone.',
            '#ff5252');
      return;
    }
    case 'chmod': {
      if (rest.length < 2) { push2('chmod: missing operand', '#ff8a80'); return; }
      const mode = rest[0];
      const n = nodeAt(resolve(rest[1]));
      if (!n) { push2('chmod: cannot access \'' + rest[1] + '\': No such file or directory', '#ff8a80'); return; }
      let per = n.perm.split('');
      if (mode === '+x' || mode === 'a+x' || mode === 'u+x') {
        const idx = mode === 'u+x' ? [2] : [2, 5, 8];
        for (const i of idx) per[i] = 'x';
      } else if (mode === '-x') {
        for (const i of [2, 5, 8]) per[i] = '-';
      } else if (/^[0-7]{3}$/.test(mode)) {
        const bits = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
        per = (bits[+mode[0]] + bits[+mode[1]] + bits[+mode[2]]).split('');
      } else {
        push2('chmod: invalid mode: \'' + mode + '\'', '#ff8a80');
        push2('Try chmod +x logger.py, or a numeric mode like chmod 644 file.', '#7f8c8d');
        return;
      }
      n.perm = per.join('');
      if (n.name === 'logger.py' && n.perm[2] === 'x') {
        done.chmod = true;
        push2('logger.py is now executable. ./logger.py would run.', '#b9f6ca');
      }
      return;
    }
  }
}

// ---- layout --------------------------------------------------------------

function isNarrow() { return canvasWidth < NARROW_BREAKPOINT; }

function layout() {
  const top = 30;
  if (isNarrow()) {
    const w = canvasWidth - 2 * margin;
    termBox = { x: margin, y: top, w: w, h: 224 };
    treeBox = { x: margin, y: top + 228, w: w * 0.52 - 3, h: drawHeight - (top + 228) - 6 };
    taskBox = { x: margin + w * 0.52 + 3, y: top + 228, w: w * 0.48 - 3,
                h: drawHeight - (top + 228) - 6 };
  } else {
    const rw = 250;
    termBox = { x: margin, y: top, w: canvasWidth - rw - 3 * margin,
                h: drawHeight - top - 6 };
    const th = Math.round((drawHeight - top - 12) * 0.56);
    treeBox = { x: canvasWidth - margin - rw, y: top, w: rw, h: th };
    taskBox = { x: canvasWidth - margin - rw, y: top + th + 6, w: rw,
                h: drawHeight - (top + th + 6) - 6 };
  }
}

function layoutControls() {
  layout();
  positionInput(true);
}

function positionInput(force) {
  textFont(MONO); textSize(12);
  const p = Math.ceil(textWidth(prompt()));
  textFont('Arial');
  if (force || p !== promptPx) {
    promptPx = p;
    cmdInput.position(termBox.x + 8 + p, termBox.y + termBox.h - 20);
    cmdInput.style('width', Math.max(60, termBox.w - p - 18) + 'px');
  }
}

// ---- draw ----------------------------------------------------------------

function draw() {
  layout();
  positionInput(false);
  background('aliceblue');
  noStroke(); fill('#0d2b45'); textAlign(CENTER, TOP); textSize(22);
  text('Command Line Sandbox', canvasWidth / 2, 2);

  drawTerminal();
  drawTree();
  drawTasks();
  drawControlRegion();
  if (warnOverlay) drawWarning();
  drawTooltip();
}

function drawTerminal() {
  const b = termBox;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y, b.w, b.h);
  drawingContext.clip();
  noStroke(); fill('#12181d');
  rect(b.x, b.y, b.w, b.h, 4);

  textFont(MONO); textSize(12); textAlign(LEFT, TOP);
  const lh = 14;
  const promptY = b.y + b.h - 22;
  const rows = Math.floor((promptY - b.y - 8) / lh);
  const cwid = textWidth('m');
  const maxChars = Math.max(20, Math.floor((b.w - 18) / cwid));
  // wrap rather than clip, so a hint is never cut off mid-sentence
  const flat = [];
  for (const o of out) {
    if (o.t.length <= maxChars) { flat.push(o); continue; }
    let rem = o.t, first = true;
    while (rem.length) {
      let cut = rem.length > maxChars ? rem.lastIndexOf(' ', maxChars) : rem.length;
      if (cut <= 0) cut = Math.min(maxChars, rem.length);
      flat.push({ t: (first ? '' : '  ') + rem.slice(0, cut),
                  col: o.col, perm: first ? o.perm : null });
      rem = rem.slice(cut).replace(/^ /, '');
      first = false;
    }
  }
  const start = Math.max(0, flat.length - rows - scroll);
  const shown = flat.slice(start, start + rows);

  permHits = [];
  for (let i = 0; i < shown.length; i++) {
    const o = shown[i];
    const yy = b.y + 6 + i * lh;
    fill(o.col);
    text(o.t, b.x + 8, yy);
    if (o.perm) {
      // hit boxes over the ten permission characters, for the tooltip
      for (let k = 0; k < 10; k++) {
        permHits.push({ x: b.x + 8 + k * cwid, y: yy, w: cwid, h: lh,
                        k: k, ch: o.perm.block[k], name: o.perm.name });
      }
    }
  }
  fill('#9be29b');
  text(prompt(), b.x + 8, promptY);
  if (scroll > 0) {
    fill('#ffab40'); textAlign(RIGHT, TOP);
    text('scrolled up ' + scroll + ' lines', b.x + b.w - 8, b.y + 6);
  }
  textFont('Arial');
  drawingContext.restore();
  pop();
  noFill(); stroke('#4a6076'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
}

function drawTree() {
  const b = treeBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
  text('file tree - you are here', b.x + 8, b.y + 5);
  const lines = [];
  walk(fs, [], 0, lines);
  const lh = Math.max(10, Math.min(13, (b.h - 24) / lines.length));
  const maxRows = Math.floor((b.h - 22) / lh);
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(b.x, b.y + 18, b.w, b.h - 20);
  drawingContext.clip();
  textFont(MONO); textSize(Math.min(10.5, lh * 0.82));
  for (let i = 0; i < Math.min(lines.length, maxRows); i++) {
    const L = lines[i];
    const yy = b.y + 20 + i * lh;
    if (L.here) {
      noStroke(); fill('#1565c0');
      rect(b.x + 3, yy - 1, b.w - 6, lh, 2);
    }
    noStroke();
    fill(L.here ? '#ffffff' : (L.dir ? '#1565c0' : (L.exec ? '#1b5e20' : '#37474f')));
    textAlign(LEFT, TOP);
    const nm = L.depth === 0 ? '/' : (L.dir ? L.name + '/' : L.name);
    text('  '.repeat(L.depth) + nm + (L.exec ? '*' : ''), b.x + 8, yy);
  }
  textFont('Arial');
  drawingContext.restore();
  pop();
}

function walk(n, path, depth, lines) {
  const here = path.join('/') === cwd.join('/') && n.type === 'd';
  lines.push({ name: depth === 0 ? '/' : n.name, depth: depth, dir: n.type === 'd',
               exec: n.type === 'f' && n.perm[2] === 'x', here: here });
  if (n.type === 'd') {
    for (const k of n.kids) walk(k, path.concat([k.name]), depth + 1, lines);
  }
}

function drawTasks() {
  const b = taskBox;
  noStroke(); fill('#ffffff'); stroke('#c3d0dc'); strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 4);
  noStroke();
  const n = TASKS.filter(t => done[t.id]).length;
  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10);
  text('tasks  ' + n + ' of ' + TASKS.length, b.x + 8, b.y + 5);
  let y = b.y + 19;
  const lh = Math.min(15, (b.h - 24) / TASKS.length);
  for (const t of TASKS) {
    const ok = !!done[t.id];
    noStroke(); fill(ok ? '#2e7d32' : '#ffffff');
    stroke(ok ? '#1b5e20' : '#b0bec5'); strokeWeight(1);
    rect(b.x + 8, y + 1, 9, 9, 2);
    noStroke();
    if (ok) {
      stroke('#ffffff'); strokeWeight(1.6);
      line(b.x + 10, y + 5.6, b.x + 12, y + 8);
      line(b.x + 12, y + 8, b.x + 15.4, y + 3);
      noStroke();
    }
    fill(ok ? '#1b5e20' : '#37474f'); textAlign(LEFT, TOP); textSize(9.6);
    const w = b.w - 32;
    const lines = wrapLines(t.txt, w, 9.6);
    for (let i = 0; i < lines.length && i < 2; i++) text(lines[i], b.x + 22, y + i * 11);
    y += Math.max(lh, Math.min(2, lines.length) * 11 + 2);
  }
}

function drawTooltip() {
  if (!hoverPerm) return;
  const h = hoverPerm;
  let msg;
  if (h.k === 0) {
    msg = h.ch === 'd' ? 'd - this is a directory' : '- - this is a normal file';
  } else {
    const who = h.k <= 3 ? 'the owner' : (h.k <= 6 ? 'the group' : 'everyone else');
    const what = { r: 'read', w: 'write to', x: 'execute' }[h.ch];
    msg = h.ch === '-'
      ? 'no permission here for ' + who
      : h.ch + ' - ' + who + ' may ' + what + ' this file';
  }
  textSize(10.5);
  const w = textWidth(msg) + 14;
  const x = Math.min(mouseX + 10, canvasWidth - w - 6);
  const y = Math.max(4, mouseY - 26);
  noStroke(); fill('#263238');
  rect(x, y, w, 20, 3);
  fill('#ffffff'); textAlign(LEFT, CENTER); textSize(10.5);
  text(msg, x + 7, y + 10);
}

function drawWarning() {
  noStroke(); fill('#7f1414');
  rect(0, 0, canvasWidth, drawHeight);
  fill('#ffffff'); textAlign(CENTER, TOP); textSize(20);
  text('rm -rf /', canvasWidth / 2, 40);
  textSize(12.5);
  const w = Math.min(520, canvasWidth - 60);
  const L = (canvasWidth - w) / 2;
  let y = 76;
  textAlign(LEFT, TOP);
  y = para(L, y, w, 'That command asks the system to delete every file on the machine, ' +
      'recursively, without asking. On a real station it would take the operating ' +
      'system, your logger, your configuration and every reading you have ever ' +
      'collected, and there is no undo.', 17, 12.5) + 12;
  y = para(L, y, w, 'It is not being simulated here, because watching it happen ' +
      'teaches nothing that reading this does not.', 17, 12.5) + 12;
  y = para(L, y, w, 'The real lesson is smaller and more useful: at the command line ' +
      'there is no confirmation and no recycle bin. Read the whole line before you ' +
      'press Enter, especially when it contains rm, and especially when it starts ' +
      'with sudo.', 17, 12.5);
  textAlign(CENTER, TOP); textSize(12);
  text('Click anywhere to go back.', canvasWidth / 2, drawHeight - 34);
}

// ---- controls ------------------------------------------------------------

function drawControlRegion() {
  noStroke(); fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#c3d0dc'); line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  const y0 = drawHeight + 8;
  chipHits = [];
  let x = margin;
  x = chip(x, y0, 'Reset the sandbox', false) + 6;
  x = chip(x, y0, 'Clear the screen', false) + 6;
  chip(x, y0, 'Show the task list', false);

  fill('#5a6a78'); textAlign(LEFT, TOP); textSize(10.5);
  para(margin, y0 + 32, canvasWidth - 2 * margin,
       'Type a command and press Enter. Up and Down recall earlier commands. ' +
       'Hover any character of a permission block in ls -l output to find out what ' +
       'it means. Everything here is simulated, so rm is safe to try.', 12.5, 10.5);
  fill('#8a97a4'); textSize(10);
  text('Hint for task 5: try running it with ./logger.py and read what bash says.',
       margin, y0 + 88);
}

function chip(x, y, label, on) {
  textSize(11); textAlign(CENTER, CENTER);
  const w = textWidth(label) + 18;
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

function onKey(e) {
  if (e.key === 'Enter') {
    const v = cmdInput.value();
    cmdInput.value('');
    scroll = 0;
    run(v);
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    if (history.length) {
      histIdx = Math.max(0, histIdx - 1);
      cmdInput.value(history[histIdx]);
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    histIdx = Math.min(history.length, histIdx + 1);
    cmdInput.value(histIdx >= history.length ? '' : history[histIdx]);
    e.preventDefault();
  }
}

function mouseMoved() {
  hoverPerm = null;
  for (const h of permHits) {
    if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) {
      hoverPerm = h;
    }
  }
  return true;
}

function mouseWheel(e) {
  if (mouseX >= termBox.x && mouseX <= termBox.x + termBox.w &&
      mouseY >= termBox.y && mouseY <= termBox.y + termBox.h) {
    scroll = constrain(scroll + (e.delta > 0 ? -2 : 2), 0, Math.max(0, out.length - 4));
    return false;
  }
  return true;
}

function mousePressed() {
  if (warnOverlay) { warnOverlay = false; return false; }
  for (const c of chipHits) {
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      if (c.label === 'Reset the sandbox') {
        fs = freshFs(); cwd = ['home', 'ubuntu']; done = {}; scroll = 0; banner();
      } else if (c.label === 'Clear the screen') {
        out = []; scroll = 0;
      } else {
        push2(prompt(), '#ffffff');
        push2('Tasks:', '#7fb3d5');
        for (let i = 0; i < TASKS.length; i++) {
          push2('  [' + (done[TASKS[i].id] ? 'x' : ' ') + '] ' + (i + 1) + '. ' +
                TASKS[i].txt, done[TASKS[i].id] ? '#b9f6ca' : '#d7f9d7');
        }
      }
      cmdInput.elt.focus();
      return false;
    }
  }
  if (mouseX >= termBox.x && mouseX <= termBox.x + termBox.w &&
      mouseY >= termBox.y && mouseY <= termBox.y + termBox.h) {
    cmdInput.elt.focus();
    return false;
  }
  return true;
}

function para(L, y, W, s, lh, size) {
  const lines = wrapLines(s, W, size);
  for (let i = 0; i < lines.length; i++) text(lines[i], L, y + i * lh);
  return y + lines.length * lh;
}

function wrapLines(s, maxW, size) {
  textSize(size);
  const words = String(s).split(' ');
  const outl = [];
  let line = '';
  for (const w of words) {
    const trial = line.length ? line + ' ' + w : w;
    if (textWidth(trial) > maxW && line.length) { outl.push(line); line = w; }
    else line = trial;
  }
  outl.push(line);
  return outl;
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
