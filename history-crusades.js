/* history-crusades.js — the two visuals on the Crusades reference page.
 *
 *   1. A timeline band, 1070 to 1295, that doubles as navigation. Every
 *      expedition is drawn to scale, so the long quiet stretches between them
 *      are as visible as the campaigns.
 *   2. A route map per expedition, all drawn on the one Mediterranean frame in
 *      history-crusades-geo.js, so two crusades can be compared by eye.
 *
 * Both degrade to nothing if the geometry fails to load; the page's text
 * stands on its own.
 */
(function () {
  'use strict';

  /* ================================================================ timeline */

  // The axis runs wider than the events so the first and last flags have room
  // to sit under their marks instead of hanging off the ends.
  var T0 = 1060, T1 = 1300;

  // Bars, drawn to scale. `id` matches the section it scrolls to.
  var CRUSADES = [
    { id: 'c1', num: 'I',    from: 1096, to: 1099, name: 'First'  },
    { id: 'c2', num: 'II',   from: 1147, to: 1149, name: 'Second' },
    { id: 'c3', num: 'III',  from: 1189, to: 1192, name: 'Third'  },
    { id: 'c4', num: 'IV',   from: 1202, to: 1204, name: 'Fourth' },
    { id: 'c5', num: 'V',    from: 1217, to: 1221, name: 'Fifth'  },
    { id: 'c6', num: 'VI',   from: 1228, to: 1229, name: 'Sixth'  },
    { id: 'c7', num: 'VII',  from: 1248, to: 1254, name: 'Seventh'},
    { id: 'c8', num: 'VIII', from: 1270, to: 1270, name: 'Eighth' }
  ];

  // The two stretches when the holy places were in Christian hands. Fractional
  // years because the months matter: July 1099 to October 1187 is the eighty-
  // eight years the page talks about.
  var HELD = [
    { from: 1099.5, to: 1187.8, t: '88 years' },
    { from: 1229.2, to: 1244.7, t: '15 years' }
  ];

  // `row` keeps neighbouring flags from colliding; it is layout, not meaning.
  var EVENTS = [
    { y: 1071, t: 'Manzikert',        row: 0 },
    { y: 1095, t: 'Clermont',         row: 1, id: 'setup' },
    { y: 1144, t: 'Edessa falls',     row: 0 },
    { y: 1187, t: 'Hattin',           row: 1 },
    { y: 1204, t: 'Constantinople',   row: 0, id: 'c4' },
    { y: 1244, t: 'Jerusalem lost',   row: 1 },
    { y: 1291, t: 'Acre falls',       row: 0, id: 'end' }
  ];

  function pct(year) { return ((year - T0) / (T1 - T0)) * 100; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function buildTimeline(host) {
    var inner = el('div', 'cr-tl-inner');

    /* --- the crusade bars ------------------------------------------------ */
    var bars = el('div', 'cr-tl-bars');
    CRUSADES.forEach(function (c) {
      // A real link, not a button: it works before this script runs, it can be
      // copied and shared, and the browser handles the scrolling.
      var b = el('a', 'cr-tl-bar');
      b.href = '#' + c.id;
      b.style.left = pct(c.from) + '%';
      b.style.width = Math.max(pct(c.to + 0.9) - pct(c.from), 0.72) + '%';
      b.title = 'The ' + c.name + ' Crusade, ' + c.from + '\u2013' + c.to;
      b.setAttribute('aria-label',
        'The ' + c.name + ' Crusade, ' + c.from + ' to ' + c.to);
      b.appendChild(el('span', 'cr-tl-bar-num', c.num));
      bars.appendChild(b);
    });
    inner.appendChild(bars);

    /* --- the axis -------------------------------------------------------- */
    var axis = el('div', 'cr-tl-axis');
    for (var y = 1075; y <= T1; y += 5) {
      var tick = el('i', 'cr-tl-tick' + (y % 50 === 0 ? ' is-major' : ''));
      tick.style.left = pct(y) + '%';
      axis.appendChild(tick);
    }
    [1100, 1150, 1200, 1250].forEach(function (y) {
      var lab = el('span', 'cr-tl-year', y);
      lab.style.left = pct(y) + '%';
      axis.appendChild(lab);
    });
    inner.appendChild(axis);

    /* --- Jerusalem in Christian hands ------------------------------------ */
    var held = el('div', 'cr-tl-held');
    held.appendChild(el('span', 'cr-tl-held-key', 'Jerusalem in Christian hands'));
    HELD.forEach(function (h) {
      var band = el('span', 'cr-tl-held-band', h.t);
      band.style.left = pct(h.from) + '%';
      band.style.width = (pct(h.to) - pct(h.from)) + '%';
      held.appendChild(band);
    });
    /* --- key events ------------------------------------------------------ */
    var events = el('div', 'cr-tl-events');
    EVENTS.forEach(function (e) {
      var flag = el(e.id ? 'a' : 'span', 'cr-tl-flag is-row' + e.row);
      if (e.id) flag.href = '#' + e.id;
      flag.style.left = pct(e.y) + '%';
      flag.appendChild(el('i', 'cr-tl-flag-stem'));
      flag.appendChild(el('b', 'cr-tl-flag-year', e.y));
      flag.appendChild(el('span', 'cr-tl-flag-text', e.t));
      events.appendChild(flag);
    });
    inner.appendChild(events);
    inner.appendChild(held);

    var scroller = el('div', 'cr-tl-scroll');
    scroller.appendChild(inner);
    host.appendChild(scroller);

    // Light the bar for whichever expedition is on screen.
    if ('IntersectionObserver' in window) {
      var seen = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting; });
        var active = CRUSADES.filter(function (c) { return seen[c.id]; })[0];
        bars.querySelectorAll('.cr-tl-bar').forEach(function (b, i) {
          b.classList.toggle('is-here', !!active && CRUSADES[i].id === active.id);
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      CRUSADES.forEach(function (c) {
        var s = document.getElementById(c.id);
        if (s) io.observe(s);
      });
    }
  }

  /* ==================================================================== maps */

  var GEO = window.CRUSADES_GEO;

  // Route legs: `m` is how they travelled, `p` the waypoints. Waypoints named
  // sea-* are open water, present only so a voyage curves over the sea instead
  // of cutting across Anatolia.
  //   land — the main march      sea — under sail
  //   weak — remnants, or a march that never arrived
  var MAPS = {
    overview: {
      legs: [
        { m: 'weak', p: ['cologne', 'regensburg', 'belgrade', 'sofia', 'constantinople',
                         'nicaea', 'dorylaeum', 'akshehir', 'iconium', 'tarsus',
                         'antioch', 'tripoli', 'jerusalem'] },
        { m: 'weak', p: ['venice', 'sea-adriatic', 'sea-ionian', 'sea-crete',
                         'sea-levant', 'acre'] }
      ],
      marks: [
        { p: 'constantinople', k: 'stop' }, { p: 'edessa', k: 'state' },
        { p: 'antioch', k: 'state' }, { p: 'tripoli', k: 'state' },
        { p: 'jerusalem', k: 'state' }, { p: 'acre', k: 'stop' },
        { p: 'damascus', k: 'stop' }, { p: 'damietta', k: 'stop' },
        { p: 'cairo', k: 'stop' }, { p: 'venice', k: 'stop' },
        { p: 'cologne', k: 'stop' }
      ],
      labels: [
        { p: 'lbl-europe', t: 'EUROPE', d: 'c', cls: 'region' },
        { p: 'lbl-anatolia', t: 'ANATOLIA', d: 'c', cls: 'region' },
        { p: 'lbl-egypt', t: 'EGYPT', d: 'c', cls: 'region' },
        { p: 'cologne', t: 'the West', d: 'nw' },
        { p: 'venice', t: 'Venice', d: 'w' },
        { p: 'constantinople', t: 'Constantinople', d: 'nw' },
        { p: 'edessa', t: 'Edessa', off: [46, -14] },
        { p: 'antioch', t: 'Antioch', off: [50, 2] },
        { p: 'tripoli', t: 'Tripoli', off: [50, 8] },
        { p: 'damascus', t: 'Damascus', off: [54, 24] },
        { p: 'acre', t: 'Acre', off: [-46, -8] },
        { p: 'jerusalem', t: 'Jerusalem', off: [46, 34] },
        { p: 'damietta', t: 'Damietta', off: [-20, 16] },
        { p: 'cairo', t: 'Cairo', off: [18, 16] }
      ]
    },

    c1: {
      legs: [
        { m: 'land', p: ['cologne', 'regensburg', 'belgrade', 'sofia', 'constantinople'] },
        { m: 'land', p: ['constantinople', 'nicaea', 'dorylaeum', 'akshehir',
                         'iconium', 'tarsus', 'antioch', 'tripoli', 'jerusalem'] }
      ],
      marks: [
        { p: 'cologne', k: 'start' }, { p: 'constantinople', k: 'stop' },
        { p: 'nicaea', k: 'win' }, { p: 'dorylaeum', k: 'win' },
        { p: 'antioch', k: 'win' }, { p: 'jerusalem', k: 'end' }
      ],
      labels: [
        { p: 'cologne', t: 'the West', d: 'nw' },
        { p: 'constantinople', t: 'Constantinople', d: 'nw' },
        { p: 'nicaea', t: 'Nicaea', sub: 'taken 1097', off: [-16, 30] },
        { p: 'dorylaeum', t: 'Dorylaeum', sub: '1097', off: [30, -12] },
        { p: 'antioch', t: 'Antioch', sub: 'besieged 8 months', off: [42, -6] },
        { p: 'jerusalem', t: 'Jerusalem', sub: 'taken July 1099', off: [40, 20] }
      ]
    },

    c2: {
      legs: [
        { m: 'sea',  p: ['london', 'sea-channel', 'sea-biscay', 'sea-atlantic', 'lisbon'] },
        { m: 'land', p: ['regensburg', 'belgrade', 'sofia', 'constantinople',
                         'nicaea', 'dorylaeum'] },
        { m: 'weak', p: ['dorylaeum', 'akshehir', 'iconium', 'tarsus', 'antioch',
                         'tripoli', 'acre'] },
        { m: 'land', p: ['acre', 'jerusalem', 'damascus'] }
      ],
      marks: [
        { p: 'london', k: 'start' }, { p: 'lisbon', k: 'end' },
        { p: 'regensburg', k: 'start' }, { p: 'constantinople', k: 'stop' },
        { p: 'dorylaeum', k: 'lost' }, { p: 'jerusalem', k: 'stop' },
        { p: 'damascus', k: 'lost' }
      ],
      labels: [
        { p: 'lisbon', t: 'Lisbon', sub: 'taken 1147', off: [-14, 30] },
        { p: 'regensburg', t: 'the West', d: 'nw' },
        { p: 'constantinople', t: 'Constantinople', off: [-16, -16] },
        { p: 'dorylaeum', t: 'Anatolia', sub: 'the armies cut to pieces', off: [26, -14] },
        { p: 'jerusalem', t: 'Jerusalem', off: [-34, 26] },
        { p: 'damascus', t: 'Damascus', sub: 'four days, 1148', off: [34, 6] }
      ]
    },

    c3: {
      legs: [
        { m: 'land', p: ['regensburg', 'belgrade', 'sofia', 'constantinople',
                         'nicaea', 'dorylaeum', 'akshehir', 'iconium', 'silifke'] },
        { m: 'sea',  p: ['marseille', 'sea-tyrrhenian', 'messina', 'sea-ionian',
                         'sea-crete', 'cyprus', 'acre'] },
        { m: 'land', p: ['acre', 'arsuf', 'jaffa'] },
        { m: 'weak', p: ['jaffa', 'jerusalem'] }
      ],
      marks: [
        { p: 'regensburg', k: 'start' }, { p: 'silifke', k: 'lost' },
        { p: 'marseille', k: 'start' }, { p: 'messina', k: 'stop' },
        { p: 'cyprus', k: 'win' }, { p: 'acre', k: 'win' },
        { p: 'arsuf', k: 'win' }, { p: 'jaffa', k: 'end' },
        { p: 'jerusalem', k: 'goal' }
      ],
      labels: [
        { p: 'regensburg', t: 'Barbarossa', d: 'nw' },
        { p: 'marseille', t: 'Richard & Philip', d: 'nw' },
        { p: 'constantinople', t: 'Constantinople', off: [-14, -16] },
        { p: 'silifke', t: 'Barbarossa drowns', sub: '1190', off: [-30, -22] },
        { p: 'messina', t: 'Messina', d: 'sw' },
        { p: 'cyprus', t: 'Cyprus', sub: 'seized 1191', off: [-18, 34] },
        { p: 'acre', t: 'Acre', sub: 'taken 1191', off: [52, -26] },
        { p: 'arsuf', t: 'Arsuf', sub: '1191', off: [56, 4] },
        { p: 'jaffa', t: 'Jaffa', sub: 'treaty, 1192', off: [56, 30] },
        { p: 'jerusalem', t: 'Jerusalem', sub: 'turned back twice', off: [30, 52] }
      ],
      frame: ['damascus']
    },

    c4: {
      legs: [
        { m: 'sea',  p: ['venice', 'zara', 'sea-adriatic', 'sea-ionian',
                         'sea-aegean', 'sea-marmara', 'constantinople'] },
        { m: 'weak', p: ['constantinople', 'sea-aegean', 'sea-crete',
                         'sea-levant', 'jerusalem'] }
      ],
      marks: [
        { p: 'venice', k: 'start' }, { p: 'zara', k: 'lost' },
        { p: 'constantinople', k: 'end' }, { p: 'jerusalem', k: 'goal' }
      ],
      labels: [
        { p: 'venice', t: 'Venice', sub: 'the fleet contracted, 1201', d: 'nw' },
        { p: 'zara', t: 'Zara', sub: 'a Catholic city, 1202', off: [-16, -14] },
        { p: 'constantinople', t: 'Constantinople', sub: 'sacked April 1204', off: [12, -16] },
        { p: 'jerusalem', t: 'Jerusalem', sub: 'never reached', off: [-16, 32] }
      ]
    },

    c5: {
      legs: [
        { m: 'sea',  p: ['acre', 'sea-levant', 'sea-egypt', 'damietta'] },
        { m: 'weak', p: ['damietta', 'mansurah', 'cairo'] }
      ],
      marks: [
        { p: 'acre', k: 'start' }, { p: 'damietta', k: 'lost' },
        { p: 'cairo', k: 'goal' }, { p: 'jerusalem', k: 'goal' }
      ],
      labels: [
        { p: 'acre', t: 'Acre', d: 'ne' },
        { p: 'damietta', t: 'Damietta', sub: 'taken 1219, given up 1221', off: [22, -16] },
        { p: 'cairo', t: 'Cairo', sub: 'the Nile flood stopped them', off: [-16, 26] },
        { p: 'jerusalem', t: 'Jerusalem', sub: 'offered, and refused', off: [20, 24] }
      ]
    },

    c6: {
      legs: [
        { m: 'sea',  p: ['brindisi', 'sea-ionian', 'sea-crete', 'sea-levant', 'acre'] },
        { m: 'land', p: ['acre', 'nazareth', 'jerusalem', 'bethlehem'] }
      ],
      marks: [
        { p: 'brindisi', k: 'start' }, { p: 'acre', k: 'stop' },
        { p: 'nazareth', k: 'win' }, { p: 'bethlehem', k: 'win' },
        { p: 'jerusalem', k: 'end' }
      ],
      labels: [
        { p: 'brindisi', t: 'Brindisi', sub: 'sailed excommunicated', d: 'nw' },
        { p: 'acre', t: 'Acre', off: [-40, -6] },
        { p: 'nazareth', t: 'Nazareth', off: [40, -16] },
        { p: 'jerusalem', t: 'Jerusalem', sub: 'by treaty, 1229', off: [44, 8] },
        { p: 'bethlehem', t: 'Bethlehem', off: [-42, 22] }
      ]
    },

    c7: {
      legs: [
        { m: 'sea',  p: ['aiguesmortes', 'sea-balearic', 'sea-tyrrhenian',
                         'sea-ionian', 'sea-crete', 'cyprus', 'sea-levant',
                         'sea-egypt', 'damietta'] },
        { m: 'land', p: ['damietta', 'mansurah'] }
      ],
      marks: [
        { p: 'aiguesmortes', k: 'start' }, { p: 'cyprus', k: 'stop' },
        { p: 'damietta', k: 'win' }, { p: 'mansurah', k: 'lost' }
      ],
      labels: [
        { p: 'aiguesmortes', t: 'Aigues-Mortes', sub: 'Louis IX sails, 1248', d: 'nw' },
        { p: 'cyprus', t: 'Cyprus', d: 'ne' },
        { p: 'damietta', t: 'Damietta', sub: 'taken 1249', off: [26, -14] },
        { p: 'mansurah', t: 'Mansurah', sub: 'the king captured, 1250', off: [-18, 28] }
      ]
    },

    c8: {
      legs: [
        { m: 'sea', p: ['aiguesmortes', 'sea-balearic', 'sea-africa', 'tunis'] }
      ],
      marks: [
        { p: 'aiguesmortes', k: 'start' }, { p: 'tunis', k: 'lost' },
        { p: 'jerusalem', k: 'goal' }
      ],
      labels: [
        { p: 'aiguesmortes', t: 'Aigues-Mortes', off: [14, -12] },
        { p: 'tunis', t: 'Tunis', sub: 'Louis IX dies, August 1270', d: 's' },
        { p: 'jerusalem', t: 'Jerusalem', sub: 'the vow was about this', off: [-12, 24] }
      ]
    },

    end: {
      marks: [
        { p: 'edessa', k: 'lost' }, { p: 'antioch', k: 'lost' },
        { p: 'tripoli', k: 'lost' }, { p: 'jerusalem', k: 'lost' },
        { p: 'acre', k: 'fell' }
      ],
      labels: [
        { p: 'edessa', t: 'Edessa', sub: 'lost 1144', d: 'ne' },
        { p: 'antioch', t: 'Antioch', sub: 'lost 1268', d: 'ne' },
        { p: 'tripoli', t: 'Tripoli', sub: 'lost 1289', d: 'e' },
        { p: 'jerusalem', t: 'Jerusalem', sub: 'lost 1244', d: 'se' },
        { p: 'acre', t: 'Acre', sub: 'fell May 1291', d: 'w' }
      ],
      frame: ['cyprus', 'damascus', 'silifke']
    }
  };

  var GEO_W = GEO ? Number(GEO.viewBox.split(' ')[2]) : 0;
  var GEO_H = GEO ? Number(GEO.viewBox.split(' ')[3]) : 0;

  var SVGNS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* A Catmull-Rom spline written out as cubic beziers, so a voyage reads as a
     course steered rather than a set of ruled lines. */
  function curve(pts) {
    if (pts.length < 2) return '';
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    if (pts.length === 2) return d + 'L' + pts[1][0] + ' ' + pts[1][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i],
          p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' '
               + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ','
               + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' '
               + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ','
               + p2[0] + ' ' + p2[1];
    }
    return d;
  }

  // Label placement is by hand, per map, because the Levant packs six places
  // into a thumb's width and no automatic solver reads better than a choice.
  var DIRS = {
    c:  [ 0,  0, 'middle'], n:  [ 0, -1, 'middle'], s:  [ 0,  1, 'middle'],
    e:  [ 1,  0, 'start' ], w:  [-1,  0, 'end'   ],
    ne: [ 0.72, -0.72, 'start'], nw: [-0.72, -0.72, 'end'],
    se: [ 0.72,  0.72, 'start'], sw: [-0.72,  0.72, 'end']
  };

  /* Where the frame sits, given how many user units one display pixel is worth.
     Label sizes and offsets are fixed in display pixels, so the frame and the
     scale define each other; tune() settles that by iterating. */
  function frameFor(spec, pts, base, u) {
    var x0 = base[0], y0 = base[1], x1 = base[2], y1 = base[3];

    (spec.labels || []).forEach(function (l) {
      var p = pts[l.p];
      if (!p) return;
      var dir = DIRS[l.d] || DIRS.e;
      var fs = (l.cls === 'region' ? 10 : 11) * u;
      var dx = l.off ? l.off[0] * u : dir[0] * 6.5 * u;
      var dy = l.off ? l.off[1] * u : dir[1] * 6.5 * u;
      var anchor = l.off ? (l.off[0] > 3 ? 'start' : l.off[0] < -3 ? 'end' : 'middle')
                         : dir[2];
      var chars = Math.max(l.t.length, (l.sub || '').length);
      var tw = chars * fs * 0.56;
      var lx = p[0] + dx, rx = lx;
      if (anchor === 'start') rx = lx + tw;
      else if (anchor === 'end') lx = rx - tw;
      else { lx -= tw / 2; rx += tw / 2; }
      x0 = Math.min(x0, lx - 5 * u); x1 = Math.max(x1, rx + 5 * u);
      y0 = Math.min(y0, p[1] + dy - fs * 1.15);
      y1 = Math.max(y1, p[1] + dy + fs * ((l.sub ? 1.05 : 0) + 0.55));
    });

    // Keep the aspect in a band that reads on a page and on a projector: not
    // so tall it crowds the text, not so wide the labels pile up.
    var w = x1 - x0, h = y1 - y0, LO = 1.7, HI = 2.7;
    if (w / h < LO) { var gx = (h * LO - w) / 2; x0 -= gx; x1 += gx; }
    else if (w / h > HI) { var gy = (w / HI - h) / 2; y0 -= gy; y1 += gy; }

    // Slide, rather than crop, anything that ran off the generated frame.
    var GW = GEO_W, GH = GEO_H;
    w = x1 - x0; h = y1 - y0;
    if (w > GW) { x0 = 0; x1 = GW; } else if (x0 < 0) { x1 -= x0; x0 = 0; }
    else if (x1 > GW) { x0 -= x1 - GW; x1 = GW; }
    if (h > GH) { y0 = 0; y1 = GH; } else if (y0 < 0) { y1 -= y0; y0 = 0; }
    else if (y1 > GH) { y0 -= y1 - GH; y1 = GH; }

    return [x0, y0, x1, y1];
  }

  function drawMap(spec) {
    var pts = GEO.pts;

    // Frame on everything this map draws, then pad.
    var used = [];
    (spec.legs || []).forEach(function (leg) {
      leg.p.forEach(function (id) { if (pts[id]) used.push(pts[id]); });
    });
    (spec.marks || []).forEach(function (m) { if (pts[m.p]) used.push(pts[m.p]); });
    (spec.labels || []).forEach(function (l) { if (pts[l.p]) used.push(pts[l.p]); });
    (spec.frame || []).forEach(function (id) { if (pts[id]) used.push(pts[id]); });

    var xs = used.map(function (p) { return p[0]; }),
        ys = used.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs),
        y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);

    // A very tight cluster still needs a floor on the frame, or the coastline
    // behind it turns to abstraction.
    var padX = Math.max((x1 - x0) * 0.10, 30), padY = Math.max((y1 - y0) * 0.12, 24);
    var base = [x0 - padX, y0 - padY, x1 + padX, y1 + padY];

    var svg = svgEl('svg', { class: 'cr-map-svg', role: 'img' });
    // The sea covers the whole generated frame, so the backdrop stays right
    // whatever crop tune() settles on.
    svg.appendChild(svgEl('rect', {
      x: 0, y: 0, width: GEO_W, height: GEO_H, class: 'cr-map-sea'
    }));
    var landPath = svgEl('path', { d: GEO.land, class: 'cr-map-land' });
    svg.appendChild(landPath);

    (spec.legs || []).forEach(function (leg) {
      var line = leg.p.map(function (id) { return pts[id]; }).filter(Boolean);
      if (line.length < 2) return;
      svg.appendChild(svgEl('path', {
        d: curve(line), class: 'cr-map-leg is-' + leg.m,
        'vector-effect': 'non-scaling-stroke'
      }));
    });

    // Everything sized in display pixels gets retuned on resize; `base` is the
    // size we want on screen, whatever the frame ended up being.
    var scaled = [{ el: landPath, attr: 'stroke-width', base: 0.9 }];

    (spec.marks || []).forEach(function (m) {
      var p = pts[m.p];
      if (!p) return;
      var big = (m.k === 'end' || m.k === 'lost' || m.k === 'state' || m.k === 'fell');
      var dot = svgEl('circle', {
        cx: p[0], cy: p[1], class: 'cr-map-dot is-' + m.k,
        'vector-effect': 'non-scaling-stroke'
      });
      svg.appendChild(dot);
      scaled.push({ el: dot, attr: 'r', base: m.k === 'fell' ? 6.5 : big ? 5 : 3.6 });
    });

    (spec.labels || []).forEach(function (l) {
      var p = pts[l.p];
      if (!p) return;
      // A label pushed clear of a crowded coast gets a hairline back to its dot.
      var lead = null;
      if (l.off) {
        lead = svgEl('line', { class: 'cr-map-lead',
                               'vector-effect': 'non-scaling-stroke' });
        svg.appendChild(lead);
      }
      var t = svgEl('text', {
        class: 'cr-map-label' + (l.cls ? ' is-' + l.cls : ''),
        'paint-order': 'stroke'
      });
      var main = svgEl('tspan');
      main.textContent = l.t;
      t.appendChild(main);
      var sub = null;
      if (l.sub) {
        sub = svgEl('tspan', { class: 'cr-map-sub' });
        sub.textContent = l.sub;
        t.appendChild(sub);
      }
      svg.appendChild(t);
      scaled.push({ el: t, kind: 'label', p: p, dir: DIRS[l.d] || DIRS.e,
                    off: l.off, lead: lead, sub: sub, main: main,
                    base: l.cls === 'region' ? 10 : 11 });
    });

    svg._crSpec = spec;
    svg._crBase = base;
    svg._crScaled = scaled;
    // A provisional frame, so the box has a height before it is measured.
    var f = frameFor(spec, pts, base, (base[2] - base[0]) / 640);
    svg.setAttribute('viewBox', f[0].toFixed(1) + ' ' + f[1].toFixed(1) + ' ' +
                                (f[2] - f[0]).toFixed(1) + ' ' + (f[3] - f[1]).toFixed(1));
    return svg;
  }

  /* Settle the frame against the width the map actually got, then set every
     pixel-sized thing from it. */
  function tune(svg) {
    var box = svg.getBoundingClientRect();
    if (!box.width || !svg._crScaled) return;

    var f = [svg._crBase[0], svg._crBase[1], svg._crBase[2], svg._crBase[3]];
    for (var i = 0; i < 4; i++) {
      f = frameFor(svg._crSpec, GEO.pts, svg._crBase, (f[2] - f[0]) / box.width);
    }
    var fw = f[2] - f[0];
    svg.setAttribute('viewBox', f[0].toFixed(1) + ' ' + f[1].toFixed(1) + ' ' +
                                fw.toFixed(1) + ' ' + (f[3] - f[1]).toFixed(1));

    var u = fw / box.width;                      // user units per display pixel
    svg._crScaled.forEach(function (s) {
      if (s.kind !== 'label') { s.el.setAttribute(s.attr, (s.base * u).toFixed(1)); return; }
      var fs = s.base * u, lines = s.sub ? 2 : 1, dx, dy, anchor;

      if (s.off) {
        // Hand-placed, in display pixels from the dot, to the first baseline.
        dx = s.off[0] * u; dy = s.off[1] * u;
        anchor = s.off[0] > 3 ? 'start' : (s.off[0] < -3 ? 'end' : 'middle');
      } else {
        var gap = 6.5 * u;
        dx = s.dir[0] * gap;
        anchor = s.dir[2];
        // Lift a north-facing label by its own height so it clears the dot.
        dy = s.dir[1] * gap
           + (s.dir[1] < 0 ? -(lines - 1) * fs * 1.05 : 0)
           + (s.dir[1] > 0 ? fs * 0.85 : 0)
           + (s.dir[1] === 0 ? fs * 0.34 : 0);
      }

      var tx = s.p[0] + dx, ty = s.p[1] + dy;
      s.el.setAttribute('font-size', fs.toFixed(1));
      s.el.setAttribute('stroke-width', (3 * u).toFixed(2));
      s.el.setAttribute('text-anchor', anchor);
      s.el.setAttribute('x', tx.toFixed(1));
      s.el.setAttribute('y', ty.toFixed(1));
      s.main.setAttribute('x', tx.toFixed(1));
      if (s.sub) {
        s.sub.setAttribute('x', tx.toFixed(1));
        s.sub.setAttribute('dy', (fs * 1.05).toFixed(1));
      }
      if (s.lead) {
        var back = anchor === 'start' ? -3.5 * u : anchor === 'end' ? 3.5 * u : 0;
        s.lead.setAttribute('x1', s.p[0]);
        s.lead.setAttribute('y1', s.p[1]);
        s.lead.setAttribute('x2', (tx + back).toFixed(1));
        s.lead.setAttribute('y2', (ty - fs * 0.3).toFixed(1));
      }
    });
  }

  /* ==================================================================== boot */

  function ready() {
    var tlHost = document.getElementById('cr-timeline');
    if (tlHost) buildTimeline(tlHost);

    if (!GEO || !GEO.land) return;

    var maps = [];
    document.querySelectorAll('[data-crusade-map]').forEach(function (host) {
      var spec = MAPS[host.dataset.crusadeMap];
      if (!spec) return;
      var svg = drawMap(spec);
      svg.setAttribute('aria-label', host.dataset.mapAlt || 'Route map');
      host.appendChild(svg);
      maps.push(svg);
    });

    // Someone arriving on history-crusades.html#c4 has already been scrolled
    // there by the browser, using a page height that had no maps in it yet.
    // Put them back on the target once the maps have taken their space.
    function settleHash() {
      if (!location.hash) return;
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    function tuneAll() { maps.forEach(tune); settleHash(); }
    tuneAll();
    // Web fonts land after first paint and change the box; retune when they do.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(tuneAll);
    function retune() { maps.forEach(tune); }
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(retune);
      maps.forEach(function (m) { ro.observe(m); });
    } else {
      window.addEventListener('resize', retune);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
