/* literature-inferno.js
 *
 * Draws the funnel and runs the page. All content comes from
 * literature-inferno-data.js; nothing a student reads is written here.
 *
 * The funnel is generated rather than hand-drawn so that the geometry, the
 * labels, the hit areas, and the reading-progress marker all come from one
 * set of numbers.
 */
(function () {
  'use strict';

  var DATA = window.INFERNO_DATA;
  if (!DATA) return;

  /* ------------------------------------------------------------- geometry */

  var VB_W = 920;
  var VB_H = 760;
  var CX = 460;

  /* top y, bottom y, half-width at top, half-width at bottom, fill */
  var BANDS = {
    'wood':      { y0: 74,  y1: 100, w0: 310, w1: 310, fill: '#2c4232' },
    'gate':      { y0: 100, y1: 140, w0: 310, w1: 300, fill: '#46403a' },
    'circle-1':  { y0: 140, y1: 186, w0: 300, w1: 280, fill: '#6f6656' },
    'circle-2':  { y0: 186, y1: 228, w0: 280, w1: 261, fill: '#8b7050' },
    'circle-3':  { y0: 228, y1: 268, w0: 261, w1: 243, fill: '#9a7048' },
    'circle-4':  { y0: 268, y1: 308, w0: 243, w1: 225, fill: '#a26840' },
    'circle-5':  { y0: 308, y1: 348, w0: 225, w1: 206, fill: '#a05237' },
    'circle-6':  { y0: 348, y1: 392, w0: 206, w1: 185, fill: '#ac4128' },
    'circle-7':  { y0: 392, y1: 466, w0: 185, w1: 152, fill: '#932f22' },
    'circle-8':  { y0: 466, y1: 580, w0: 152, w1: 86,  fill: '#5a3a44' },
    'circle-9':  { y0: 580, y1: 660, w0: 86,  w1: 30,  fill: '#86aec4' },
    'exit':      { y0: 660, y1: 712, w0: 30,  w1: 16,  fill: '#1f3b57' }
  };

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var XLINK = 'http://www.w3.org/1999/xlink';

  function el(name, attrs) {
    var n = document.createElementNS(SVG_NS, name);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    }
    return n;
  }

  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX',
    'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV'];

  /* --------------------------------------------------------- reading state
   * How far down the class has actually travelled, from the adopted Scope
   * and Sequence. Everything is compared on local calendar dates so the map
   * turns over at midnight in the room, not in UTC.
   */

  function todayStamp() {
    var d = new Date();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function cantosRead() {
    var today = todayStamp();
    var through = null;
    DATA.schedule.forEach(function (row) {
      if (row.date <= today) through = row.through;
    });
    return through; /* null = the unit has not started */
  }

  var READ_THROUGH = cantosRead();

  function stateOf(circle) {
    if (READ_THROUGH === null) return 'ahead';
    var nums = circle.cantoNums || [];
    if (!nums.length) return 'ahead';
    var lo = Math.min.apply(null, nums);
    var hi = Math.max.apply(null, nums);
    if (READ_THROUGH >= hi) return 'read';
    if (READ_THROUGH >= lo) return 'here';
    return 'ahead';
  }

  /* -------------------------------------------------------------- the map */

  var circles = DATA.circles;
  var byId = {};
  circles.forEach(function (c) { byId[c.id] = c; });

  function buildMap() {
    var svg = el('svg', {
      viewBox: '0 0 ' + VB_W + ' ' + VB_H,
      role: 'group',
      'aria-label': 'A cross section of Dante’s Hell. Each circle is a button.'
    });

    /* the dome of the earth, with Jerusalem on top */
    var jer = el('text', { x: CX, y: 34, 'text-anchor': 'middle', class: 'stage-label' });
    jer.textContent = 'Jerusalem';
    svg.appendChild(jer);

    var deepest = null;

    circles.forEach(function (circle, i) {
      var g = BANDS[circle.id];
      if (!g) return;

      var state = stateOf(circle);
      if (state !== 'ahead') deepest = circle.id;

      var band = el('g', {
        class: 'band is-' + state,
        'data-id': circle.id,
        tabindex: '0',
        role: 'button',
        'aria-label': circle.name + ', ' + circle.cantos
      });

      /* The top band carries the curve of the earth's surface. */
      var d;
      if (circle.id === 'wood') {
        d = 'M ' + (CX - g.w0) + ' ' + g.y1 +
            ' L ' + (CX - g.w0) + ' ' + g.y0 +
            ' Q ' + CX + ' ' + (g.y0 - 48) + ' ' + (CX + g.w0) + ' ' + g.y0 +
            ' L ' + (CX + g.w1) + ' ' + g.y1 + ' Z';
      } else {
        d = 'M ' + (CX - g.w0) + ' ' + g.y0 +
            ' L ' + (CX + g.w0) + ' ' + g.y0 +
            ' L ' + (CX + g.w1) + ' ' + g.y1 +
            ' L ' + (CX - g.w1) + ' ' + g.y1 + ' Z';
      }

      band.appendChild(el('path', { d: d, class: 'band-shape', fill: g.fill }));
      band.appendChild(el('path', { d: d, class: 'band-outline' }));

      /* Circle 7's three rings and Circle 8's ten ditches, drawn as the
         divisions they are rather than described in a caption. */
      if (circle.rings) addDividers(band, g, circle.rings.length);
      if (circle.bolge) addDividers(band, g, circle.bolge.length);

      var midY = (g.y0 + g.y1) / 2;
      var midW = (g.w0 + g.w1) / 2;
      var inside = midW * 2 >= 210;

      /* icon and roman numeral sit outside on the left, as on the old plates */
      var icon = el('use', { x: 0, y: 0, width: 26, height: 26, class: 'band-icon' });
      icon.setAttributeNS(XLINK, 'xlink:href', '#i-' + circle.icon);
      icon.setAttribute('href', '#i-' + circle.icon);
      icon.setAttribute('transform',
        'translate(' + (CX - midW - 78) + ',' + (midY - 13) + ')');
      band.appendChild(icon);

      if (circle.roman) {
        var rn = el('text', {
          x: CX - midW - 16, y: midY + 5,
          'text-anchor': 'end', class: 'band-roman'
        });
        rn.textContent = circle.roman;
        band.appendChild(rn);
      }

      if (inside) {
        var nm = el('text', {
          x: CX, y: midY + (g.y1 - g.y0 > 46 ? 0 : 4),
          'text-anchor': 'middle', class: 'band-name'
        });
        nm.textContent = circle.label;
        band.appendChild(nm);

        var ct = el('text', {
          x: CX + midW + 14, y: midY + 4,
          'text-anchor': 'start', class: 'band-cantos'
        });
        ct.textContent = circle.cantos;
        band.appendChild(ct);
      } else {
        /* too narrow to hold a label: set it beside the funnel with a leader */
        band.appendChild(el('line', {
          x1: CX + midW + 4, y1: midY, x2: CX + midW + 26, y2: midY,
          class: 'terrain'
        }));
        var nm2 = el('text', {
          x: CX + midW + 32, y: midY - 3,
          'text-anchor': 'start', class: 'band-name is-small'
        });
        nm2.textContent = circle.label;
        band.appendChild(nm2);
        var ct2 = el('text', {
          x: CX + midW + 32, y: midY + 12,
          'text-anchor': 'start', class: 'band-cantos'
        });
        ct2.textContent = circle.cantos;
        band.appendChild(ct2);
      }

      band.addEventListener('click', function () { select(circle.id, true); });
      band.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          select(circle.id, true);
        }
      });

      svg.appendChild(band);
    });

    /* how far down we have actually come */
    if (deepest && BANDS[deepest] && READ_THROUGH !== null && READ_THROUGH < 34) {
      var mg = BANDS[deepest];
      var marker = el('g', { class: 'here-marker' });
      marker.appendChild(el('line', {
        x1: CX - mg.w1 - 40, y1: mg.y1, x2: CX + mg.w1 + 40, y2: mg.y1,
        class: 'here-marker-line'
      }));
      var mt = el('text', {
        x: CX - mg.w1 - 40, y: mg.y1 - 7,
        'text-anchor': 'start', class: 'here-marker-text'
      });
      mt.textContent = 'we are here';
      marker.appendChild(mt);
      svg.appendChild(marker);
    }

    return svg;
  }

  function addDividers(band, g, count) {
    for (var i = 1; i < count; i++) {
      var t = i / count;
      var y = g.y0 + (g.y1 - g.y0) * t;
      var w = g.w0 + (g.w1 - g.w0) * t;
      band.appendChild(el('line', {
        x1: CX - w, y1: y, x2: CX + w, y2: y,
        stroke: 'rgba(0,0,0,0.28)', 'stroke-width': 1
      }));
    }
  }

  /* ------------------------------------------------------------ the panel */

  function commonsUrl(file) {
    return 'https://commons.wikimedia.org/wiki/' +
      encodeURIComponent(file.replace(/ /g, '_'));
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function block(node, heading, html) {
    if (!html) { node.innerHTML = ''; return; }
    node.innerHTML = (heading ? '<h3>' + esc(heading) + '</h3>' : '') + html;
  }

  var panel = {
    root: document.getElementById('circle-panel'),
    loc: document.getElementById('panel-loc'),
    icon: document.getElementById('panel-icon'),
    roman: document.getElementById('panel-roman'),
    name: document.getElementById('panel-name'),
    italian: document.getElementById('panel-italian'),
    cantos: document.getElementById('panel-cantos'),
    facts: document.getElementById('panel-facts'),
    place: document.getElementById('panel-place'),
    punish: document.getElementById('panel-punish'),
    sub: document.getElementById('panel-sub'),
    named: document.getElementById('panel-named'),
    note: document.getElementById('panel-note'),
    question: document.getElementById('panel-question'),
    figure: document.getElementById('panel-figure'),
    img: document.getElementById('panel-img'),
    credit: document.getElementById('panel-credit')
  };

  var current = null;

  function render(circle) {
    var state = stateOf(circle);

    panel.loc.textContent =
      (circle.slot === 'above' ? 'Before the descent'
        : circle.slot === 'below' ? 'After the descent'
        : 'Circle ' + circle.slot + ' of 9') +
      (state === 'ahead' ? ' · not read yet'
        : state === 'here' ? ' · we are here'
        : ' · read');

    panel.icon.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' +
      circle.icon + '" xlink:href="#i-' + circle.icon + '"></use></svg>';

    panel.roman.textContent = circle.roman
      ? 'Circle ' + circle.roman
      : (circle.slot === 'above' ? 'Before the circles' : 'The way out');
    panel.name.textContent = circle.name;
    panel.italian.textContent = circle.italian || '';
    panel.cantos.textContent = circle.cantos;

    var facts = '';
    if (circle.region) facts += '<dt>Kind</dt><dd>' + esc(circle.region) + '</dd>';
    if (circle.guardian) facts += '<dt>Guarded by</dt><dd>' + esc(circle.guardian) + '</dd>';
    panel.facts.innerHTML = facts;

    block(panel.place, 'Where it is', circle.place ? '<p>' + esc(circle.place) + '</p>' : '');
    block(panel.punish, circle.punishmentLabel || 'The punishment',
      circle.punishmentText ? '<p>' + esc(circle.punishmentText) + '</p>' : '');

    /* Circle 7's rings, Circle 8's ditches, Circle 9's rounds */
    var subHtml = '';
    var subHead = '';
    if (circle.rings) {
      subHead = 'The three rings';
      subHtml = '<ul class="inf-sub">' + circle.rings.map(function (r) {
        return '<li>' +
          '<p class="inf-sub-head"><span class="inf-sub-n">' + esc(r.n) + '</span>' +
          '<span class="inf-sub-title">' + esc(r.title) + '</span>' +
          '<span class="inf-sub-cantos">' + esc(r.cantos) + '</span></p>' +
          '<p>' + esc(r.text) + '</p>' +
          '<p class="inf-sub-named">Named: ' + esc(r.named.join(' · ')) + '</p>' +
          '</li>';
      }).join('') + '</ul>';
    } else if (circle.bolge) {
      subHead = 'The ten ditches';
      subHtml = '<ul class="inf-sub">' + circle.bolge.map(function (b) {
        return '<li>' +
          '<p class="inf-sub-head"><span class="inf-sub-n">Ditch ' + b.n + '</span>' +
          '<span class="inf-sub-title">' + esc(b.title) + '</span>' +
          '<span class="inf-sub-cantos">Canto ' + esc(b.cantos) + '</span></p>' +
          '<p>' + esc(b.text) + '</p>' +
          '<p class="inf-sub-named">Named: ' + esc(b.named) + '</p>' +
          '</li>';
      }).join('') + '</ul>';
    } else if (circle.rounds) {
      subHead = 'The four rounds of the ice';
      subHtml = '<ul class="inf-sub">' + circle.rounds.map(function (r) {
        return '<li>' +
          '<p class="inf-sub-head"><span class="inf-sub-n">' + esc(r.n) + '</span>' +
          '<span class="inf-sub-title">' + esc(r.title) + '</span></p>' +
          '<p class="inf-sub-named">Named: ' + esc(r.named) + '</p>' +
          '</li>';
      }).join('') + '</ul>';
    }
    block(panel.sub, subHead, subHtml);

    block(panel.named, 'Whom Dante names',
      (circle.named && circle.named.length)
        ? '<ul class="inf-named">' + circle.named.map(function (n) {
            return '<li>' + esc(n) + '</li>';
          }).join('') + '</ul>'
        : '');

    block(panel.note, 'Watch for', circle.note ? '<p>' + esc(circle.note) + '</p>' : '');

    block(panel.question, 'Question', circle.question
      ? '<p>' + esc(circle.question) +
        (circle.questionOwn
          ? '<span class="inf-q-source">From our own lesson plans.</span>'
          : '') + '</p>'
      : '');

    var cr = DATA.credits[circle.image];
    if (cr) {
      panel.figure.hidden = false;
      panel.img.src = DATA.imageDir + circle.image + '.jpg';
      panel.img.alt = cr.title + ', by ' + cr.artist;
      panel.credit.innerHTML =
        esc(cr.title) + '. ' + esc(cr.artist) + ', ' + esc(cr.date) +
        '. Public domain, via <a href="' + commonsUrl(cr.file) +
        '" target="_blank" rel="noopener">Wikimedia Commons</a>.';
    } else {
      panel.figure.hidden = true;
    }

    /* nav */
    var i = circles.indexOf(circle);
    document.getElementById('prev-circle').disabled = i <= 0;
    document.getElementById('next-circle').disabled = i >= circles.length - 1;
  }

  function select(id, focusPanel) {
    var circle = byId[id];
    if (!circle) return;
    current = id;

    Array.prototype.forEach.call(document.querySelectorAll('.band'), function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-id') === id);
    });

    render(circle);

    if (history.replaceState) history.replaceState(null, '', '#' + id);
    else location.hash = id;

    if (focusPanel) {
      panel.root.focus({ preventScroll: true });
      var top = panel.root.getBoundingClientRect().top + window.scrollY - 16;
      if (window.scrollY < top - 40 || window.scrollY > top + 400) {
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }
  }

  function step(delta) {
    var i = circles.indexOf(byId[current]);
    var next = circles[i + delta];
    if (next) select(next.id, true);
  }

  /* ------------------------------------------------------------ the plates */

  function buildPlates() {
    var grid = document.getElementById('plate-grid');
    grid.innerHTML = DATA.plates.map(function (p) {
      var cr = DATA.credits[p.image];
      var src = DATA.imageDir + p.image + '.jpg';
      return '<figure class="inf-plate">' +
        '<img src="' + src + '" alt="' + esc(cr.title + ', by ' + cr.artist) + '" loading="lazy">' +
        '<figcaption class="inf-plate-body">' +
        '<p class="inf-plate-title">' + esc(cr.title) + '</p>' +
        '<p class="inf-plate-by">' + esc(cr.artist) + ', ' + esc(cr.date) + '</p>' +
        '<p class="inf-plate-blurb">' + esc(p.blurb) + '</p>' +
        '<a class="inf-plate-open" href="' + src + '" target="_blank" rel="noopener">Open full size</a>' +
        '</figcaption></figure>';
    }).join('');
  }

  /* ------------------------------------------------------------- the shell */

  function statusLine() {
    var node = document.getElementById('inf-status');
    if (READ_THROUGH === null) {
      node.textContent = 'Nine circles, thirty-four cantos. We begin on August 26.';
    } else if (READ_THROUGH >= 34) {
      node.textContent = 'Nine circles, thirty-four cantos. We have been all the way down.';
    } else if (READ_THROUGH === 0) {
      node.textContent = 'Nine circles, thirty-four cantos. The descent starts this week.';
    } else {
      node.textContent = 'Nine circles, thirty-four cantos. We have read through Canto ' +
        ROMAN[READ_THROUGH] + '.';
    }
  }

  function wireControls() {
    var page = document.body;
    var stage = document.querySelector('.inf-stage');

    var progressBtn = document.getElementById('progress-toggle');
    function setProgress(on) {
      stage.classList.toggle('show-progress', on);
      progressBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      progressBtn.textContent = on ? 'Mark our progress' : 'Show the whole descent';
    }
    setProgress(READ_THROUGH !== null && READ_THROUGH < 34);
    progressBtn.addEventListener('click', function () {
      setProgress(progressBtn.getAttribute('aria-pressed') !== 'true');
    });

    var presentBtn = document.getElementById('present-toggle');
    function setPresent(on) {
      page.classList.toggle('is-presenting', on);
      presentBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    presentBtn.addEventListener('click', function () {
      setPresent(presentBtn.getAttribute('aria-pressed') !== 'true');
    });

    var help = document.getElementById('keyboard-help');
    var helpBtn = document.getElementById('help-toggle');
    function setHelp(on) {
      help.hidden = !on;
      helpBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) document.getElementById('help-close').focus();
      else helpBtn.focus();
    }
    helpBtn.addEventListener('click', function () { setHelp(help.hidden); });
    document.getElementById('help-close').addEventListener('click', function () { setHelp(false); });
    help.addEventListener('click', function (ev) { if (ev.target === help) setHelp(false); });

    document.getElementById('prev-circle').addEventListener('click', function () { step(-1); });
    document.getElementById('next-circle').addEventListener('click', function () { step(1); });

    document.addEventListener('keydown', function (ev) {
      var t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;

      if (ev.key === 'Escape') {
        if (!help.hidden) { setHelp(false); return; }
        if (page.classList.contains('is-presenting')) { setPresent(false); return; }
      }
      if (ev.key === '?') { ev.preventDefault(); setHelp(help.hidden); return; }
      if (ev.key === 'p' || ev.key === 'P') {
        ev.preventDefault();
        setPresent(!page.classList.contains('is-presenting'));
        return;
      }
      if (ev.key === 'ArrowDown' || ev.key === 'j') { ev.preventDefault(); step(1); return; }
      if (ev.key === 'ArrowUp' || ev.key === 'k') { ev.preventDefault(); step(-1); return; }
      if (/^[1-9]$/.test(ev.key)) {
        ev.preventDefault();
        select('circle-' + ev.key, true);
      }
    });
  }

  /* ---------------------------------------------------------------- start */

  document.getElementById('inf-svg-wrap').appendChild(buildMap());
  buildPlates();
  statusLine();
  wireControls();

  /* Open on the hash if there is one, otherwise on where the class is now. */
  var start = (location.hash || '').replace('#', '');
  if (!byId[start]) {
    start = 'wood';
    for (var i = circles.length - 1; i >= 0; i--) {
      if (stateOf(circles[i]) === 'here') { start = circles[i].id; break; }
      if (stateOf(circles[i]) === 'read') { start = circles[i].id; break; }
    }
  }
  select(start, false);

  window.addEventListener('hashchange', function () {
    var id = (location.hash || '').replace('#', '');
    if (byId[id] && id !== current) select(id, true);
  });
})();
