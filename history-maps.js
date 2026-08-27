/* history-maps.js
 *
 * Draws each map from history-maps-geo.js and runs the drill.
 *
 * The drill is a small Leitner box. Every item starts at 0. A correct answer
 * moves it up one, a wrong answer sends it back to 0 and puts it a few places
 * further down the queue. An item counts as learned once it has been right
 * LEARNED_AT times in a row. Progress is kept per map in localStorage, so a
 * student can stop and come back.
 *
 * The map fills in as you answer, the way a paper quiz does.
 */
(function () {
  'use strict';

  var GEO = window.HISTORY_MAPS_GEO;
  var CFG = window.HISTORY_MAPS;
  if (!GEO || !CFG) return;

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var HIT_R = 15;      /* click radius for cities and seas, in viewBox units */
  var DOT_R = 4.5;

  function el(name, attrs) {
    var n = document.createElementNS(SVG_NS, name);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    }
    return n;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ------------------------------------------------------------- storage */

  function loadBoxes(quizId) {
    try {
      var raw = localStorage.getItem(CFG.storageKey + quizId);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveBoxes(quizId, boxes) {
    try { localStorage.setItem(CFG.storageKey + quizId, JSON.stringify(boxes)); }
    catch (e) { /* private browsing, or storage is off: drill still works */ }
  }

  /* ---------------------------------------------------------------- dates */

  var MONTHS = ['January','February','March','April','May','June','July',
                'August','September','October','November','December'];
  function parseDate(s) {
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function prettyDate(s) {
    var d = parseDate(s);
    return MONTHS[d.getMonth()] + ' ' + d.getDate();
  }
  function daysUntil(s) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((parseDate(s) - today) / 86400000);
  }

  /* ----------------------------------------------------------------- state */

  var quiz = null;      /* the selected quiz */
  var geo = null;       /* its geometry */
  var pool = [];        /* items in the selected group */
  var boxes = {};
  var queue = [];
  var current = null;
  var answered = false;
  var mode = 'find';    /* find | name | study */
  var groupIndex = 0;   /* 0 = everything */
  var nodes = {};       /* item id -> <g> */
  var labelLayer = null;

  var $ = function (id) { return document.getElementById(id); };

  /* ------------------------------------------------------------- drawing */

  function itemsOfGroup(q, idx) {
    var all = GEO[q.map].items;
    if (idx === 0) {
      var kinds = {};
      q.groups.forEach(function (g) { g.kinds.forEach(function (k) { kinds[k] = 1; }); });
      return all.filter(function (i) { return kinds[i.k]; });
    }
    var g = q.groups[idx - 1];
    return all.filter(function (i) { return g.kinds.indexOf(i.k) >= 0; });
  }

  function drawMap() {
    var wrap = $('mt-svg-wrap');
    wrap.innerHTML = '';
    nodes = {};

    var vb = geo.viewBox.split(/\s+/).map(Number);
    var svg = el('svg', {
      viewBox: geo.viewBox,
      role: 'group',
      'aria-label': quiz.title + '. Click a place to answer.'
    });

    svg.appendChild(el('rect', {
      x: vb[0], y: vb[1], width: vb[2], height: vb[3], class: 'mt-sea'
    }));
    if (geo.context) svg.appendChild(el('path', { d: geo.context, class: 'mt-context' }));

    /* every item on the map is drawn, but only the ones being drilled take
       clicks, so a city dot never swallows a click meant for a region */
    var inPool = {};
    pool.forEach(function (i) { inPool[i.id] = 1; });

    var shapes = el('g', {});
    var points = el('g', {});
    labelLayer = el('g', {});

    GEO[quiz.map].items.forEach(function (item) {
      var g = el('g', {
        'data-id': item.id,
        class: inPool[item.id] ? 'hit' : ''
      });
      if (!inPool[item.id]) g.setAttribute('pointer-events', 'none');

      if (item.d) {
        g.appendChild(el('path', { d: item.d, class: 'shape' }));
        shapes.appendChild(g);
      } else {
        g.appendChild(el('circle', {
          cx: item.p[0], cy: item.p[1], r: HIT_R, fill: 'transparent'
        }));
        g.appendChild(el('circle', {
          cx: item.p[0], cy: item.p[1], r: DOT_R,
          class: 'pt' + (item.k === 'water' ? ' pt-water' : '')
        }));
        points.appendChild(g);
      }
      nodes[item.id] = g;
    });

    svg.appendChild(shapes);
    svg.appendChild(points);
    svg.appendChild(labelLayer);

    svg.addEventListener('click', onMapClick);
    wrap.appendChild(svg);

    var counts = {};
    pool.forEach(function (i) { counts[i.k] = (counts[i.k] || 0) + 1; });
    var names = { country: 'countries', micro: 'small states', region: 'regions',
                  city: 'cities', water: 'seas and water' };
    $('mt-legend').textContent = Object.keys(counts).map(function (k) {
      return counts[k] + ' ' + names[k];
    }).join(' · ');
  }

  /* Spain has a region and a city both called Madrid, and another pair called
     Valencia. When both are in play, say which one is wanted. */
  var KIND_WORD = { region: 'region', country: 'country', city: 'city',
                    water: 'water', micro: 'state' };
  function askName(item) {
    var clash = pool.some(function (i) { return i.n === item.n && i.id !== item.id; });
    return clash ? item.n + ' (the ' + KIND_WORD[item.k] + ')' : item.n;
  }

  function labelFor(item) {
    var x, y, cls = 'lbl';
    if (item.d) { x = item.a[0]; y = item.a[1]; }
    else {
      x = item.p[0]; y = item.p[1] - 9;
      cls += item.k === 'water' ? ' lbl-water' : ' lbl-city';
    }
    var t = el('text', { x: x, y: y, 'text-anchor': 'middle', class: cls });
    t.textContent = item.n;
    return t;
  }

  function showLabel(item) {
    if (labelLayer.querySelector('[data-lbl="' + item.id + '"]')) return;
    var t = labelFor(item);
    t.setAttribute('data-lbl', item.id);
    labelLayer.appendChild(t);
  }

  function clearMarks() {
    Object.keys(nodes).forEach(function (id) {
      nodes[id].classList.remove('is-right', 'is-wrong', 'is-target');
    });
  }

  /* ---------------------------------------------------------------- drill */

  function learned(id) { return (boxes[id] || 0) >= CFG.LEARNED_AT; }

  function buildQueue() {
    var todo = pool.filter(function (i) { return !learned(i.id); });
    queue = shuffle(todo.slice());
  }

  function updateProgress() {
    var done = pool.filter(function (i) { return learned(i.id); }).length;
    /* The bar counts every right answer, not only finished items, so it moves
       on the first pass instead of sitting at zero for eighty questions. */
    var credit = 0;
    pool.forEach(function (i) { credit += Math.min(boxes[i.id] || 0, CFG.LEARNED_AT); });
    var pct = pool.length ? Math.round(credit / (pool.length * CFG.LEARNED_AT) * 100) : 0;
    $('progress-count').textContent = done + ' of ' + pool.length + ' learned';
    $('progress-fill').style.width = pct + '%';
    var note = $('progress-note');
    if (!pool.length) note.textContent = '';
    else if (done === pool.length) note.textContent = 'Every item on this list is learned. Well done.';
    else note.textContent = 'An item counts as learned after ' + CFG.LEARNED_AT +
      ' right answers in a row. Miss one and it comes back.';
    drawRail();
  }

  function nextItem() {
    answered = false;
    clearMarks();
    $('feedback').textContent = '';
    $('feedback').className = 'mt-feedback';
    $('next-btn').hidden = true;
    $('skip-btn').hidden = false;
    $('choices').hidden = true;
    $('choices').innerHTML = '';

    if (mode === 'study') {
      current = null;
      $('prompt-kicker').textContent = 'Study';
      $('prompt-text').textContent = 'Every name is on the map. Hover to pick one out.';
      $('skip-btn').hidden = true;
      pool.forEach(showLabel);
      return;
    }

    if (!queue.length) buildQueue();
    if (!queue.length) {
      current = null;
      $('prompt-kicker').textContent = 'Done';
      $('prompt-text').textContent = 'You know this map.';
      $('skip-btn').hidden = true;
      pool.forEach(showLabel);
      return;
    }

    current = queue.shift();

    /* If this one was answered right on an earlier pass its name is still on
       the map. Take it off, or the second ask gives itself away. */
    var stale = labelLayer.querySelector('[data-lbl="' + current.id + '"]');
    if (stale) stale.remove();

    if (mode === 'find') {
      $('prompt-kicker').textContent = 'Find it';
      $('prompt-text').textContent = askName(current);
    } else {
      $('prompt-kicker').textContent = 'Name it';
      $('prompt-text').textContent = 'What is highlighted?';
      nodes[current.id].classList.add('is-target');
      buildChoices();
    }
  }

  function buildChoices() {
    var others = shuffle(pool.filter(function (i) { return i.id !== current.id; })).slice(0, 3);
    var opts = shuffle(others.concat([current]));
    var box = $('choices');
    box.hidden = false;
    box.innerHTML = '';
    opts.forEach(function (o, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mt-choice';
      b.setAttribute('data-id', o.id);
      b.innerHTML = '<span class="mt-choice-n">' + (i + 1) + '</span><span>' +
                    esc(askName(o)) + '</span>';
      b.addEventListener('click', function () { answerChoice(o.id, b); });
      box.appendChild(b);
    });
  }

  function record(right) {
    if (right) boxes[current.id] = (boxes[current.id] || 0) + 1;
    else {
      boxes[current.id] = 0;
      queue.splice(Math.min(CFG.REQUEUE_GAP, queue.length), 0, current);
    }
    if (right && boxes[current.id] < CFG.LEARNED_AT) {
      var gap = CFG.SECOND_LOOK + Math.floor(Math.random() * 6);
      queue.splice(Math.min(gap, queue.length), 0, current);
    }
    saveBoxes(quiz.id, boxes);
    updateProgress();
  }

  function finish(right, message) {
    answered = true;
    showLabel(current);
    $('feedback').textContent = message;
    $('feedback').className = 'mt-feedback ' + (right ? 'right' : 'wrong');
    $('next-btn').hidden = false;
    $('skip-btn').hidden = true;
    $('next-btn').focus();
  }

  function onMapClick(ev) {
    if (mode !== 'find' || !current || answered) return;
    var g = ev.target.closest ? ev.target.closest('g[data-id]') : null;
    if (!g) return;
    var id = g.getAttribute('data-id');
    if (id === current.id) {
      g.classList.add('is-right');
      record(true);
      finish(true, 'Yes.');
    } else {
      g.classList.add('is-wrong');
      nodes[current.id].classList.add('is-target');
      record(false);
      var hit = pool.filter(function (i) { return i.id === id; })[0];
      finish(false, hit ? 'That is ' + hit.n + '. ' + askName(current) + ' is highlighted.'
                        : askName(current) + ' is highlighted.');
    }
  }

  function answerChoice(id, btn) {
    if (answered) return;
    if (id === current.id) {
      btn.classList.add('is-right');
      record(true);
      finish(true, 'Yes.');
    } else {
      btn.classList.add('is-wrong');
      var right = $('choices').querySelector('[data-id="' + current.id + '"]');
      if (right) right.classList.add('is-right');
      record(false);
      finish(false, 'It is ' + askName(current) + '.');
    }
  }

  function skip() {
    if (!current || answered) return;
    nodes[current.id].classList.add('is-target');
    if (mode === 'name') {
      var right = $('choices').querySelector('[data-id="' + current.id + '"]');
      if (right) right.classList.add('is-right');
    }
    record(false);
    finish(false, 'This is ' + askName(current) + '.');
  }

  /* ------------------------------------------------------------ selection */

  function drawRail() {
    var rail = $('map-rail');
    rail.innerHTML = '';
    CFG.quizzes.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mt-tab';
      if (quiz && q.id === quiz.id) b.setAttribute('aria-current', 'page');
      var bx = loadBoxes(q.id);
      var items = itemsOfGroup(q, 0);
      var done = items.filter(function (i) { return (bx[i.id] || 0) >= CFG.LEARNED_AT; }).length;
      var meta = done === items.length && items.length
        ? '<span class="mt-tab-done">all ' + items.length + ' learned</span>'
        : done + ' of ' + items.length;
      b.innerHTML = '<span class="mt-tab-name">' + esc(q.title) + '</span>' +
                    '<span class="mt-tab-meta">' + prettyDate(q.date) + ' · ' + meta + '</span>';
      b.addEventListener('click', function () { selectQuiz(q.id); });
      rail.appendChild(b);
    });
  }

  function drawGroups() {
    var sel = $('group-pick');
    sel.innerHTML = '';
    var all = document.createElement('option');
    all.value = '0';
    all.textContent = 'Everything (' + itemsOfGroup(quiz, 0).length + ')';
    sel.appendChild(all);
    quiz.groups.forEach(function (g, i) {
      var o = document.createElement('option');
      o.value = String(i + 1);
      o.textContent = g.name + ' (' + itemsOfGroup(quiz, i + 1).length + ')';
      sel.appendChild(o);
    });
    sel.value = String(groupIndex);
  }

  function selectQuiz(id, keepGroup) {
    quiz = CFG.quizzes.filter(function (q) { return q.id === id; })[0];
    geo = GEO[quiz.map];
    if (!keepGroup) groupIndex = 0;
    boxes = loadBoxes(quiz.id);

    $('about-unit').textContent = quiz.unit;
    $('about-note').textContent = quiz.note;
    $('about-source').textContent = 'Item list: ' + quiz.source + '.';

    drawGroups();
    refresh();
    if (history.replaceState) history.replaceState(null, '', '#' + quiz.id);
  }

  function refresh() {
    pool = itemsOfGroup(quiz, groupIndex);
    drawMap();
    buildQueue();
    updateProgress();
    nextItem();
  }

  /* ---------------------------------------------------------------- shell */

  function statusLine() {
    var upcoming = CFG.quizzes.concat(CFG.pending)
      .map(function (q) { return { t: q.title, d: q.date, n: daysUntil(q.date) }; })
      .filter(function (q) { return q.n >= 0; })
      .sort(function (a, b) { return a.n - b.n; });
    var node = $('mt-status');
    if (!upcoming.length) {
      node.textContent = 'Every map quiz for the year is behind us.';
      return;
    }
    var next = upcoming[0];
    var when = next.n === 0 ? 'today' : next.n === 1 ? 'tomorrow' : 'in ' + next.n + ' days';
    node.innerHTML = 'Next quiz: <strong>' + esc(next.t) + '</strong>, ' +
      esc(prettyDate(next.d)) + ', ' + when + '.';
  }

  function drawPending() {
    $('pending-list').innerHTML = CFG.pending.map(function (p) {
      return '<li><p class="mt-pending-title">' + esc(p.title) + '</p>' +
        '<p class="mt-pending-date">' + esc(prettyDate(p.date)) + ' · ' + esc(p.unit) + '</p>' +
        '<p class="mt-pending-why">' + esc(p.why) + '</p></li>';
    }).join('');
  }

  function setMode(m) {
    mode = m;
    ['find', 'name', 'study'].forEach(function (k) {
      $('mode-' + k).setAttribute('aria-pressed', k === m ? 'true' : 'false');
    });
    labelLayer.innerHTML = '';
    buildQueue();
    nextItem();
  }

  function wire() {
    $('mode-find').addEventListener('click', function () { setMode('find'); });
    $('mode-name').addEventListener('click', function () { setMode('name'); });
    $('mode-study').addEventListener('click', function () { setMode('study'); });

    $('group-pick').addEventListener('change', function (ev) {
      groupIndex = Number(ev.target.value);
      refresh();
    });

    $('next-btn').addEventListener('click', nextItem);
    $('skip-btn').addEventListener('click', skip);

    $('reset-btn').addEventListener('click', function () {
      boxes = {};
      saveBoxes(quiz.id, boxes);
      labelLayer.innerHTML = '';
      refresh();
    });

    var page = document.body;
    var presentBtn = $('present-toggle');
    function setPresent(on) {
      page.classList.toggle('is-presenting', on);
      presentBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    presentBtn.addEventListener('click', function () {
      setPresent(presentBtn.getAttribute('aria-pressed') !== 'true');
    });

    var help = $('keyboard-help');
    var helpBtn = $('help-toggle');
    function setHelp(on) {
      help.hidden = !on;
      helpBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) $('help-close').focus(); else helpBtn.focus();
    }
    helpBtn.addEventListener('click', function () { setHelp(help.hidden); });
    $('help-close').addEventListener('click', function () { setHelp(false); });
    help.addEventListener('click', function (ev) { if (ev.target === help) setHelp(false); });

    document.addEventListener('keydown', function (ev) {
      var t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' ||
                t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
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
      if (ev.key === 'Enter' && !$('next-btn').hidden) { ev.preventDefault(); nextItem(); return; }
      if ((ev.key === 's' || ev.key === 'S') && !answered) { ev.preventDefault(); skip(); return; }
      if (mode === 'name' && !answered && /^[1-4]$/.test(ev.key)) {
        var btn = $('choices').children[Number(ev.key) - 1];
        if (btn) { ev.preventDefault(); btn.click(); }
      }
    });

    window.addEventListener('hashchange', function () {
      var id = (location.hash || '').replace('#', '');
      if (id && quiz && id !== quiz.id &&
          CFG.quizzes.some(function (q) { return q.id === id; })) selectQuiz(id);
    });
  }

  /* ---------------------------------------------------------------- start */

  statusLine();
  drawPending();
  wire();

  var start = (location.hash || '').replace('#', '');
  if (!CFG.quizzes.some(function (q) { return q.id === start; })) {
    /* open on the next quiz that has not happened yet */
    var soon = CFG.quizzes.filter(function (q) { return daysUntil(q.date) >= 0; });
    start = (soon[0] || CFG.quizzes[0]).id;
  }
  selectQuiz(start);
})();
