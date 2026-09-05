/* literature-inferno-drill.js
 *
 * The Inferno Drill. It asks the questions the reading quizzes ask: for a
 * place in Hell, the sin, the contrapasso, the souls Dante names, the
 * guardian, and the cantos. Everything it asks comes from
 * literature-inferno-data.js, the same facts the Map of Hell shows, so the
 * drill never says more than the poem supplies.
 *
 * The drill is the Map Trainer's Leitner box: every item starts at 0, a
 * right answer moves it up one, a wrong answer sends it back to 0 and asks
 * it again a few items later. An item is learned after LEARNED_AT right
 * answers in a row. Progress is kept per scope in localStorage.
 */
(function () {
  'use strict';

  var DATA = window.INFERNO_DATA;
  if (!DATA) return;

  var LEARNED_AT = 2;
  var STORE = 'l11inferno:v1:';
  var CHOICES = 4;

  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX',
    'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV'];

  /* The reading quizzes, from the adopted Rhythm B Scope and Sequence
     (re-laid Sep 2, 2026). Update here when a quiz moves. */
  var QUIZZES = [
    { id: 'quiz1', title: 'Quiz 1', date: '2026-09-14', from: 1, through: 13, cantos: 'Cantos I–XIII' },
    { id: 'quiz2', title: 'Quiz 2', date: '2026-09-24', from: 14, through: 23, cantos: 'Cantos XIV–XXIII' },
    { id: 'quiz3', title: 'Quiz 3', date: '2026-10-01', from: 24, through: 33, cantos: 'Cantos XXIV–XXXIII' }
  ];

  var KINDS = [
    { id: 'mix', label: 'Mix' },
    { id: 'sin', label: 'The sin' },
    { id: 'contrapasso', label: 'The contrapasso' },
    { id: 'soul', label: 'The sinners' },
    { id: 'guardian', label: 'The guardians' },
    { id: 'where', label: 'Which circle' },
    { id: 'cantos', label: 'The cantos' }
  ];

  var $ = function (id) { return document.getElementById(id); };

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
  function uniq(list) {
    var seen = {}, out = [];
    list.forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  /* ---------------------------------------------------------------- dates */

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  function parseDate(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function prettyDate(s) { var d = parseDate(s); return MONTHS[d.getMonth()] + ' ' + d.getDate(); }
  function weekday(s) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseDate(s).getDay()];
  }
  function todayStamp() {
    var d = new Date();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function daysUntil(s) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((parseDate(s) - today) / 86400000);
  }
  function cantosRead() {
    var today = todayStamp(), through = null;
    (DATA.schedule || []).forEach(function (row) { if (row.date <= today) through = row.through; });
    return through;
  }
  var READ_THROUGH = cantosRead();

  /* ----------------------------------------------------- the places of Hell
   * One flat list built from the Map of Hell data: the neutrals at the gate,
   * Circles I to VI, Circle VII and its three rings, Circle VIII and its ten
   * ditches, Circle IX and its four rounds. Each place carries only what the
   * poem supplies.
   */

  function romanToInt(r) { return Math.max(0, ROMAN.indexOf(r)); }
  function numsFromCantos(str) {
    /* "Canto XII", "Cantos XIV–XVII", "XXI–XXII", "XVIII" */
    var m = String(str).replace(/Cantos?\s*/, '').split(/[–-]/).map(function (x) { return romanToInt(x.trim()); });
    if (!m.length || !m[0]) return [];
    var a = m[0], b = m.length > 1 && m[1] ? m[1] : a, out = [];
    for (var i = a; i <= b; i++) out.push(i);
    return out;
  }
  function cantosLabel(str) {
    var s = String(str);
    if (/^Canto/.test(s)) return s;
    return (/[–-]/.test(s) ? 'Cantos ' : 'Canto ') + s;
  }
  function firstSentence(text) {
    var s = String(text || '').trim();
    var m = s.match(/^(.+?[.!?])(\s|$)/);
    var out = m ? m[1] : s;
    if (out.length > 150) out = out.slice(0, 147).replace(/\s+\S*$/, '') + '…';
    return out;
  }
  var SKIP_SOUL = /^(No individual|Dante says|Virgil himself|The angels|One "|Charon$|Geryon,|Chiron|The Malebranche|An unnamed|Virgil$|Beatrice)/;
  function soulList(named) {
    var list = Array.isArray(named) ? named : String(named || '').split(';');
    return list.map(function (s) { return String(s).trim(); })
      .filter(function (s) { return s && !SKIP_SOUL.test(s) && !/foretold/.test(s); });
  }

  function buildPlaces() {
    var places = [];
    var byId = {};
    DATA.circles.forEach(function (c) { byId[c.id] = c; });

    var gate = byId.gate;
    if (gate) {
      places.push({
        id: 'gate', where: 'Ante-Hell, inside the gate', whereShort: 'Ante-Hell',
        sin: 'The neutrals, who took no side', cantos: gate.cantos, nums: gate.cantoNums.slice(),
        guardian: gate.guardian, punishment: gate.punishmentText, souls: soulList(gate.named)
      });
    }
    for (var n = 1; n <= 6; n++) {
      var c = byId['circle-' + n];
      if (!c) continue;
      places.push({
        id: c.id, where: 'Circle ' + c.roman, whereShort: 'Circle ' + c.roman,
        sin: c.label, cantos: c.cantos, nums: c.cantoNums.slice(),
        guardian: c.guardian, punishment: c.punishmentText, souls: soulList(c.named)
      });
    }
    var c7 = byId['circle-7'];
    if (c7) {
      places.push({
        id: 'circle-7', where: 'Circle VII', whereShort: 'Circle VII', sin: 'Violence',
        cantos: c7.cantos, nums: c7.cantoNums.slice(), guardian: c7.guardian,
        punishment: c7.punishmentText, souls: [], overview: true
      });
      (c7.rings || []).forEach(function (r, i) {
        places.push({
          id: 'circle-7-ring-' + (i + 1), where: 'Circle VII, ring ' + (i + 1), whereShort: 'Circle VII, ring ' + (i + 1),
          sin: 'Violence ' + r.title.charAt(0).toLowerCase() + r.title.slice(1), cantos: cantosLabel(r.cantos),
          nums: numsFromCantos(r.cantos), guardian: i === 0 ? c7.guardian : null,
          punishment: r.text, souls: soulList(r.named)
        });
      });
    }
    var c8 = byId['circle-8'];
    if (c8) {
      places.push({
        id: 'circle-8', where: 'Circle VIII', whereShort: 'Circle VIII', sin: 'Fraud',
        cantos: c8.cantos, nums: c8.cantoNums.slice(), guardian: 'Geryon brings them down',
        punishment: c8.punishmentText, souls: [], overview: true
      });
      (c8.bolge || []).forEach(function (b) {
        places.push({
          id: 'circle-8-ditch-' + b.n, where: 'Circle VIII, ditch ' + b.n, whereShort: 'Circle VIII, ditch ' + b.n,
          sin: b.title, cantos: cantosLabel(b.cantos), nums: numsFromCantos(b.cantos),
          guardian: b.n === 5 ? 'The Malebranche' : null, punishment: b.text, souls: soulList(b.named)
        });
      });
    }
    var c9 = byId['circle-9'];
    if (c9) {
      places.push({
        id: 'circle-9', where: 'Circle IX', whereShort: 'Circle IX', sin: 'Treachery',
        cantos: c9.cantos, nums: c9.cantoNums.slice(), guardian: c9.guardian,
        punishment: c9.punishmentText, souls: [], overview: true
      });
      var roundCantos = ['Canto XXXII', 'Cantos XXXII–XXXIII', 'Canto XXXIII', 'Canto XXXIV'];
      (c9.rounds || []).forEach(function (r, i) {
        places.push({
          id: 'circle-9-round-' + (i + 1), where: 'Circle IX, ' + r.n, whereShort: 'Circle IX, ' + r.n,
          sin: r.title, cantos: roundCantos[i], nums: numsFromCantos(roundCantos[i]),
          guardian: null, punishment: null, souls: soulList(r.named)
        });
      });
    }
    return places;
  }

  var PLACES = buildPlaces();

  /* ---------------------------------------------------------------- scopes */

  function scopeList() {
    var list = QUIZZES.map(function (q) {
      return { id: q.id, name: q.title + ' · ' + q.cantos, meta: weekday(q.date) + ', ' + prettyDate(q.date),
        from: q.from, through: q.through, quiz: q };
    });
    list.push({ id: 'sofar', name: 'Read so far',
      meta: READ_THROUGH ? 'through Canto ' + ROMAN[READ_THROUGH] : 'nothing yet',
      from: 1, through: READ_THROUGH || 0 });
    list.push({ id: 'all', name: 'All of Hell', meta: 'thirty-four cantos', from: 1, through: 34 });
    return list;
  }
  var SCOPES = scopeList();

  function inScope(place, scope) {
    if (!place.nums.length) return false;
    var lo = Math.min.apply(null, place.nums), hi = Math.max.apply(null, place.nums);
    return lo >= scope.from && hi <= scope.through;
  }
  function placesOf(scope) { return PLACES.filter(function (p) { return inScope(p, scope); }); }

  /* ----------------------------------------------------------------- items
   * An item is one question the drill can ask. Its key is stable, so the
   * Leitner box survives a reload.
   */

  function buildItems(scope) {
    var pool = placesOf(scope), items = [];
    pool.forEach(function (p) {
      if (!p.overview) {
        items.push({ key: 'sin:' + p.id, kind: 'sin', place: p });
        items.push({ key: 'where:' + p.id, kind: 'where', place: p });
      }
      if (p.punishment && !p.overview) items.push({ key: 'contrapasso:' + p.id, kind: 'contrapasso', place: p });
      if (p.guardian && !/^None/.test(p.guardian)) items.push({ key: 'guardian:' + p.id, kind: 'guardian', place: p });
      items.push({ key: 'cantos:' + p.id, kind: 'cantos', place: p });
      p.souls.forEach(function (s, i) {
        items.push({ key: 'soul:' + p.id + ':' + i, kind: 'soul', place: p, soul: s });
      });
    });
    return items;
  }

  function answerOf(item) {
    var p = item.place;
    switch (item.kind) {
      case 'sin': return p.sin;
      case 'where': return p.where;
      case 'contrapasso': return firstSentence(p.punishment);
      case 'guardian': return p.guardian;
      case 'cantos': return p.cantos;
      case 'soul': return p.where + ' · ' + p.sin;
    }
    return '';
  }

  function candidatesFor(kind, scope) {
    /* every possible answer of this kind, scope first, then the rest of Hell */
    var inS = placesOf(scope), all = PLACES;
    function pick(list) {
      return uniq(list.map(function (p) {
        switch (kind) {
          case 'sin': return p.overview ? null : p.sin;
          case 'where': return p.overview ? null : p.where;
          case 'contrapasso': return (p.punishment && !p.overview) ? firstSentence(p.punishment) : null;
          case 'guardian': return (p.guardian && !/^None/.test(p.guardian)) ? p.guardian : null;
          case 'cantos': return p.cantos;
          case 'soul': return p.overview ? null : p.where + ' · ' + p.sin;
        }
        return null;
      }));
    }
    return { near: pick(inS), far: pick(all) };
  }

  function choicesFor(item, scope) {
    var right = answerOf(item);
    var c = candidatesFor(item.kind, scope);
    var near = shuffle(c.near.filter(function (x) { return x !== right; }));
    var far = shuffle(c.far.filter(function (x) { return x !== right && near.indexOf(x) < 0; }));
    var wrong = near.slice(0, CHOICES - 1);
    while (wrong.length < CHOICES - 1 && far.length) wrong.push(far.shift());
    return shuffle(wrong.concat([right]));
  }

  function promptFor(item) {
    var p = item.place;
    switch (item.kind) {
      case 'sin': return { kicker: 'The sin', text: p.where, sub: 'What sin is punished here?' };
      case 'where': return { kicker: 'Which circle', text: p.sin, sub: 'Where in Hell is this punished?' };
      case 'contrapasso': return { kicker: 'The contrapasso', text: p.where + ' · ' + p.sin, sub: 'What is the punishment?' };
      case 'guardian': return { kicker: 'The guardian', text: p.where + ' · ' + p.sin, sub: 'Who is set over this place?' };
      case 'cantos': return { kicker: 'The cantos', text: p.where + ' · ' + p.sin, sub: 'Which canto or cantos?' };
      case 'soul': return { kicker: 'The sinners', text: item.soul, sub: 'Where does Dante find them?' };
    }
    return { kicker: '', text: '', sub: '' };
  }

  function rereadLine(item) {
    return 'Reread ' + item.place.cantos + '.';
  }

  /* --------------------------------------------------------------- storage */

  function loadBoxes(scopeId) {
    try { var raw = localStorage.getItem(STORE + scopeId); return raw ? JSON.parse(raw) : {}; }
    catch (e) { return {}; }
  }
  function saveBoxes(scopeId, boxes) {
    try { localStorage.setItem(STORE + scopeId, JSON.stringify(boxes)); } catch (e) { /* storage off: the drill still works */ }
  }

  /* ----------------------------------------------------------------- state */

  var scope = null;
  var kind = 'mix';
  var items = [];
  var boxes = {};
  var queue = [];
  var current = null;
  var answered = false;
  var choiceNodes = [];

  function pool() {
    return items.filter(function (it) { return kind === 'mix' || it.kind === kind; });
  }
  function learned(it) { return (boxes[it.key] || 0) >= LEARNED_AT; }

  function rebuildQueue() {
    queue = shuffle(pool().filter(function (it) { return !learned(it); }));
  }

  function progress() {
    var p = pool(), got = 0, max = p.length * LEARNED_AT, done = 0;
    p.forEach(function (it) {
      var b = Math.min(boxes[it.key] || 0, LEARNED_AT);
      got += b; if (b >= LEARNED_AT) done++;
    });
    return { items: p.length, done: done, pct: max ? Math.round(100 * got / max) : 0 };
  }

  /* --------------------------------------------------------------- render */

  function renderRail() {
    var rail = $('scope-rail');
    rail.innerHTML = '';
    SCOPES.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dr-tab';
      b.setAttribute('aria-current', scope && scope.id === s.id ? 'page' : 'false');
      var savedBoxes = loadBoxes(s.id);
      var its = buildItems(s), n = its.length, d = 0;
      its.forEach(function (it) { if ((savedBoxes[it.key] || 0) >= LEARNED_AT) d++; });
      var meta = s.meta;
      if (n && d === n) meta = 'learned';
      else if (d) meta = d + ' of ' + n + ' learned';
      b.innerHTML = '<span class="dr-tab-name">' + esc(s.name) + '</span>' +
        '<span class="dr-tab-meta' + (n && d === n ? ' dr-tab-done' : '') + '">' + esc(meta) + '</span>';
      b.addEventListener('click', function () { selectScope(s.id); });
      rail.appendChild(b);
    });
  }

  function renderKinds() {
    var wrap = $('kinds');
    wrap.innerHTML = '';
    KINDS.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dr-kind';
      b.textContent = k.label;
      b.setAttribute('aria-pressed', kind === k.id ? 'true' : 'false');
      b.addEventListener('click', function () { kind = k.id; renderKinds(); rebuildQueue(); next(); });
      wrap.appendChild(b);
    });
  }

  function renderStatus() {
    var node = $('dr-status');
    var q = scope && scope.quiz;
    if (q) {
      var d = daysUntil(q.date);
      var when = d > 1 ? d + ' days away' : d === 1 ? 'tomorrow' : d === 0 ? 'today' : 'past';
      node.innerHTML = '<strong>' + esc(q.title) + '</strong> is ' + esc(weekday(q.date)) + ', ' +
        esc(prettyDate(q.date)) + ' (' + esc(when) + '): ' + esc(q.cantos) + '.';
    } else if (scope && scope.id === 'sofar') {
      node.textContent = READ_THROUGH ? 'Everything the class has read, through Canto ' + ROMAN[READ_THROUGH] + '.'
        : 'The class has not started the Inferno yet.';
    } else {
      node.textContent = 'Nine circles, thirty-four cantos.';
    }
  }

  function renderProgress() {
    var p = progress();
    $('progress-count').textContent = p.done + ' of ' + p.items + ' learned';
    $('progress-fill').style.width = p.pct + '%';
    var note = $('progress-note');
    if (!p.items) note.textContent = 'Nothing in this set yet.';
    else if (p.done === p.items) note.textContent = 'Every item here has been right twice in a row. Try another set, or start this one over before the quiz.';
    else note.textContent = 'An item is learned after two right answers in a row. A wrong answer sends it back and asks it again soon.';
  }

  function renderAbout() {
    var n = placesOf(scope).length;
    $('about-unit').textContent = scope.name;
    var s = scope.quiz
      ? 'The quiz covers ' + scope.quiz.cantos + '. This set drills every place in those cantos: ' + n + ' place' + (n === 1 ? '' : 's') + ', ' + items.length + ' questions.'
      : n + ' place' + (n === 1 ? '' : 's') + ', ' + items.length + ' questions.';
    $('about-note').innerHTML = esc(s) + ' The facts are the ones on <a href="literature-inferno.html">the Map of Hell</a>: the sin, the punishment as Dante describes it, the souls he names, the guardian, the cantos. Nothing here replaces the reading.';
  }

  function renderTable() {
    var body = $('table-body');
    body.innerHTML = '';
    var list = placesOf(scope);
    list.forEach(function (p) {
      var tr = document.createElement('tr');
      var hi = Math.max.apply(null, p.nums);
      if (READ_THROUGH !== null && hi > READ_THROUGH) tr.className = 'is-ahead';
      tr.innerHTML =
        '<td class="dr-cell-where">' + esc(p.where) + '</td>' +
        '<td>' + esc(p.sin) + '</td>' +
        '<td class="dr-cell-cantos">' + esc(p.cantos) + '</td>' +
        '<td>' + esc(p.guardian && !/^None/.test(p.guardian) ? p.guardian : '') + '</td>' +
        '<td>' + esc(p.punishment ? firstSentence(p.punishment) : '') + '</td>' +
        '<td>' + esc(p.souls.join('; ')) + '</td>';
      body.appendChild(tr);
    });
    $('table-note').textContent = READ_THROUGH !== null && READ_THROUGH < 34
      ? 'Grey rows are places the class has not read yet.'
      : '';
  }

  function showPrompt(item) {
    var pr = promptFor(item);
    $('prompt-kicker').textContent = pr.kicker;
    $('prompt-text').textContent = pr.text;
    $('prompt-sub').textContent = pr.sub;
    var wrap = $('choices');
    wrap.innerHTML = '';
    choiceNodes = [];
    var right = answerOf(item);
    choicesFor(item, scope).forEach(function (text, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dr-choice';
      b.innerHTML = '<span class="dr-choice-n">' + (i + 1) + '</span><span>' + esc(text) + '</span>';
      b.addEventListener('click', function () { answer(text === right, b); });
      wrap.appendChild(b);
      choiceNodes.push({ node: b, text: text });
    });
    wrap.hidden = false;
    var fb = $('feedback');
    fb.textContent = '';
    fb.className = 'dr-feedback';
    $('next-btn').hidden = true;
    $('show-btn').hidden = false;
  }

  function markRight(item) {
    var right = answerOf(item);
    choiceNodes.forEach(function (c) {
      c.node.disabled = true;
      if (c.text === right) c.node.classList.add('is-right');
    });
  }

  function answer(isRight, node) {
    if (answered || !current) return;
    answered = true;
    var fb = $('feedback');
    if (isRight) {
      boxes[current.key] = (boxes[current.key] || 0) + 1;
      fb.textContent = learned(current) ? 'Right. Learned.' : 'Right.';
      fb.className = 'dr-feedback right';
    } else {
      boxes[current.key] = 0;
      if (node) node.classList.add('is-wrong');
      fb.innerHTML = 'No. ' + esc(answerOf(current)) + '.' +
        '<span class="dr-reread">' + esc(rereadLine(current)) + '</span>';
      fb.className = 'dr-feedback wrong';
      /* ask it again soon */
      queue.splice(Math.min(3, queue.length), 0, current);
    }
    markRight(current);
    saveBoxes(scope.id, boxes);
    renderProgress();
    $('show-btn').hidden = true;
    $('next-btn').hidden = false;
    $('next-btn').focus();
  }

  function showMe() {
    if (answered || !current) return;
    answer(false, null);
    $('feedback').innerHTML = esc(answerOf(current)) + '.' +
      '<span class="dr-reread">' + esc(rereadLine(current)) + '</span>';
    $('feedback').className = 'dr-feedback';
  }

  function next() {
    answered = false;
    if (!queue.length) rebuildQueue();
    if (!queue.length) {
      current = null;
      $('prompt-kicker').textContent = '';
      $('prompt-text').textContent = pool().length ? 'Done. Every item in this set is learned.' : 'Nothing to drill in this set yet.';
      $('prompt-sub').textContent = pool().length ? 'Choose another set above, or start this one over.' : 'Choose another set above.';
      $('choices').hidden = true;
      $('feedback').textContent = '';
      $('feedback').className = 'dr-feedback';
      $('next-btn').hidden = true;
      $('show-btn').hidden = true;
      return;
    }
    current = queue.shift();
    showPrompt(current);
  }

  function selectScope(id) {
    scope = SCOPES.filter(function (s) { return s.id === id; })[0] || SCOPES[0];
    items = buildItems(scope);
    boxes = loadBoxes(scope.id);
    try { localStorage.setItem(STORE + 'last', scope.id); } catch (e) { /* fine */ }
    renderRail();
    renderStatus();
    renderAbout();
    renderTable();
    rebuildQueue();
    renderProgress();
    next();
  }

  function reset() {
    boxes = {};
    saveBoxes(scope.id, boxes);
    renderRail();
    rebuildQueue();
    renderProgress();
    next();
  }

  /* -------------------------------------------------------------- controls */

  function wire() {
    $('next-btn').addEventListener('click', next);
    $('show-btn').addEventListener('click', showMe);
    $('reset-btn').addEventListener('click', reset);

    var page = document.body;
    var present = $('present-toggle');
    function setPresent(on) {
      page.classList.toggle('is-presenting', on);
      present.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    present.addEventListener('click', function () { setPresent(!page.classList.contains('is-presenting')); });
    $('present-exit').addEventListener('click', function () { setPresent(false); });

    var help = $('keyboard-help'), helpBtn = $('help-toggle');
    function setHelp(open) {
      help.hidden = !open;
      helpBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) $('help-close').focus(); else helpBtn.focus();
    }
    helpBtn.addEventListener('click', function () { setHelp(help.hidden); });
    $('help-close').addEventListener('click', function () { setHelp(false); });
    help.addEventListener('click', function (e) { if (e.target === help) setHelp(false); });

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') {
        if (!help.hidden) { setHelp(false); e.preventDefault(); return; }
        if (page.classList.contains('is-presenting')) { setPresent(false); e.preventDefault(); }
        return;
      }
      if (e.key === '?') { setHelp(help.hidden); e.preventDefault(); return; }
      if (!help.hidden) return;
      if (e.key === 'Enter') { if (answered) { next(); e.preventDefault(); } return; }
      if (e.key === 's' || e.key === 'S') { showMe(); e.preventDefault(); return; }
      if (e.key === 'p' || e.key === 'P') { setPresent(!page.classList.contains('is-presenting')); e.preventDefault(); return; }
      if (/^[1-4]$/.test(e.key) && !answered && current) {
        var c = choiceNodes[+e.key - 1];
        if (c) { c.node.click(); e.preventDefault(); }
      }
    });
  }

  /* ------------------------------------------------------------------ boot */

  function boot() {
    renderKinds();
    wire();
    var last = null;
    try { last = localStorage.getItem(STORE + 'last'); } catch (e) { /* fine */ }
    var first = SCOPES[0].id;
    /* default to the next quiz that has not happened yet */
    var today = todayStamp();
    for (var i = 0; i < QUIZZES.length; i++) {
      if (QUIZZES[i].date >= today) { first = QUIZZES[i].id; break; }
      first = 'sofar';
    }
    selectScope(last && SCOPES.some(function (s) { return s.id === last; }) ? last : first);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
