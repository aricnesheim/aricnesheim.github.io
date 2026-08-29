/* "Month by month" — a grid calendar view of data/upcoming.json for the
   four courses. Renders into #month-cal (see year.html). Self-contained;
   no libraries, no build step. Never throws past this IIFE: any failure
   (missing markup, bad fetch, bad JSON, a runtime bug in rendering) falls
   back to a single muted line in the grid area. */

(function () {
  "use strict";

  var root = document.getElementById("month-cal");
  if (!root) return;

  var gridEl = document.getElementById("mcal-grid");
  var weekdaysEl = root.querySelector(".mcal-weekdays");
  var monthLabelEl = document.getElementById("mcal-month-label");
  var prevBtn = document.getElementById("mcal-prev");
  var nextBtn = document.getElementById("mcal-next");
  var todayBtn = document.getElementById("mcal-today");
  var detailEl = document.getElementById("mcal-detail");

  function fail() {
    var msg = "The month calendar couldn't load. The thread map above still works.";
    if (gridEl) {
      gridEl.innerHTML = "";
      var p = document.createElement("p");
      p.className = "mcal-load-error";
      p.textContent = msg;
      gridEl.appendChild(p);
    } else {
      root.innerHTML = '<p class="mcal-load-error">' + msg + "</p>";
    }
  }

  // Can't render into a grid area that doesn't exist, or without the nav
  // pieces the interaction model depends on -- bail the same way a bad
  // fetch would.
  if (!gridEl || !weekdaysEl || !monthLabelEl || !prevBtn || !nextBtn || !detailEl) {
    fail();
    return;
  }

  function safe(fn) {
    return function () {
      try {
        return fn.apply(this, arguments);
      } catch (err) {
        fail();
      }
    };
  }

  var esc = function (s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  /* ---------- date helpers (manual, not locale-dependent) ---------- */

  var WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var WEEKDAYS_MIN = ["S", "M", "T", "W", "T", "F", "S"];
  var MONTHS_LONG = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var MIN_YM = "2026-08";
  var MAX_YM = "2027-06";

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function isoOf(y, m, d) {
    return y + "-" + pad2(m) + "-" + pad2(d);
  }

  function parseISO(iso) {
    var parts = iso.split("-");
    var y = Number(parts[0]), m = Number(parts[1]), d = Number(parts[2]);
    return { y: y, m: m, d: d, dow: new Date(y, m - 1, d).getDay() };
  }

  function ymOf(iso) {
    return iso.slice(0, 7);
  }

  function daysInMonth(y, m) {
    return new Date(y, m, 0).getDate();
  }

  function longDateLabel(iso) {
    var p = parseISO(iso);
    return WEEKDAYS_LONG[p.dow] + ", " + MONTHS_LONG[p.m - 1] + " " + p.d;
  }

  function shortDateLabel(iso) {
    var p = parseISO(iso);
    return WEEKDAYS_SHORT[p.dow] + " " + MONTHS_SHORT[p.m - 1] + " " + p.d;
  }

  function monthLabelText(ym) {
    var parts = ym.split("-");
    return MONTHS_LONG[Number(parts[1]) - 1] + " " + parts[0];
  }

  function todayISO() {
    var now = new Date();
    return isoOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  function isWeekday(iso) {
    var dow = parseISO(iso).dow;
    return dow >= 1 && dow <= 5;
  }

  function clampYM(ym) {
    if (ym < MIN_YM) return MIN_YM;
    if (ym > MAX_YM) return MAX_YM;
    return ym;
  }

  function addMonths(ym, delta) {
    var parts = ym.split("-");
    var y = Number(parts[0]), m = Number(parts[1]);
    var total = y * 12 + (m - 1) + delta;
    var ny = Math.floor(total / 12);
    var nm = (total % 12) + 1;
    return ny + "-" + pad2(nm);
  }

  /* ---------- 5 & 5b. derivation: data/upcoming.json -> Map<date, Item[]> ----------
     Item = { course, kind: 'due'|'given'|'quiz'|'event', text, pairDate? }

     NOTE on ordering: a literal top-to-bottom read of the spec ("1. skip
     regexes -> no item from due. 2. quiz check. 3. else real assignment")
     would make the quiz check unreachable whenever `due` itself also
     matches a skip regex. But 2026-10-13 literature has
     due = "Nothing due (reading day). Look back over I-XVI for the quiz."
     which matches BOTH the "^nothing due" skip regex AND \bquiz\b, and the
     spec's own fixture requires a quiz item to come out of that row. So the
     quiz-in-`due` check is evaluated first/unconditionally; the skip
     regexes only gate whether `due` also produces a real due/given pair.
     Verified against the fixture in scratchpad/verify-derivation.js. */

  var SKIP_RES = [/^nothing( is)? due/i, /^study your notes/i, /^keep at/i];
  var QUIZ_RE = /\b(quiz|test|exam)\b/i;
  var COURSES = ["history", "theology", "literature"];

  var CHOIR_MONTH_YEAR = {
    Jan: 2027, Feb: 2027, Mar: 2027, Apr: 2027, May: 2027, Jun: 2027, Jul: 2027,
    Aug: 2026, Sep: 2026, Oct: 2026, Nov: 2026, Dec: 2026,
  };
  var CHOIR_MONTH_NUM = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7,
    Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };
  var CHOIR_KEYWORD_RE = /(PERFORMANCE|DRESS REHEARSAL|FESTIVAL|GRADUATION MASS)/i;
  // Free text; formats include "Fri Sep 25", "Wed & Thu evenings, Dec 16-17",
  // "Apr 28-29"; en-dash vs hyphen (normalized before this runs). A keyword
  // match with no parseable date degrades to a week-band flag, never a
  // wrong date -- see buildItemMap()'s fallback branch below.
  var CHOIR_DATE_RE = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})(?:\s*-\s*(\d{1,2}))?/g;

  function buildItemMap(data) {
    var map = new Map();
    var choirFlags = []; // [{ start, end, segments: [text,...] }]

    function addItem(date, item) {
      if (!map.has(date)) map.set(date, []);
      map.get(date).push(item);
    }

    COURSES.forEach(function (course) {
      var cls = data[course];
      if (!cls || !Array.isArray(cls.rows)) return;
      var rows = cls.rows.slice().sort(function (a, b) {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      });

      rows.forEach(function (row, i) {
        var due = (row.due || "").trim();
        var inclass = row.inclass || "";

        if (QUIZ_RE.test(due)) {
          addItem(row.date, { course: course, kind: "quiz", text: due });
          return; // due produces nothing else
        }

        if (QUIZ_RE.test(inclass)) {
          addItem(row.date, { course: course, kind: "quiz", text: inclass });
          // fall through -- still evaluate `due` as a possible real assignment
        }

        var isSkip = !due || SKIP_RES.some(function (re) { return re.test(due); });
        if (isSkip) return; // no item from `due`

        var priorDate = i > 0 ? rows[i - 1].date : undefined;
        addItem(row.date, { course: course, kind: "due", text: due, pairDate: priorDate });
        if (i > 0) {
          addItem(rows[i - 1].date, { course: course, kind: "given", text: due, pairDate: row.date });
        }
      });
    });

    var choirWeeksList = (data.choir && Array.isArray(data.choir.rows)) ? data.choir.rows : [];

    choirWeeksList.forEach(function (week) {
      var blob = (week.focus || "") + " · " + (week.notes || "");
      var segments = blob.split("·");
      var failedSegments = [];

      segments.forEach(function (rawSeg) {
        var seg = rawSeg.trim();
        if (!seg || !CHOIR_KEYWORD_RE.test(seg)) return;

        var normalized = seg.replace(/[–—]/g, "-"); // en/em dash -> hyphen
        CHOIR_DATE_RE.lastIndex = 0;
        var m;
        var found = false;
        while ((m = CHOIR_DATE_RE.exec(normalized))) {
          found = true;
          var mon = m[1];
          var d1 = parseInt(m[2], 10);
          var d2 = m[3] ? parseInt(m[3], 10) : d1;
          var year = CHOIR_MONTH_YEAR[mon];
          var monthNum = CHOIR_MONTH_NUM[mon];
          for (var d = d1; d <= d2; d++) {
            addItem(isoOf(year, monthNum, d), { course: "choir", kind: "event", text: seg });
          }
        }
        if (!found) failedSegments.push(seg);
      });

      if (failedSegments.length) {
        choirFlags.push({ start: week.start, end: week.end, segments: failedSegments });
      }
    });

    return { map: map, choirWeeksList: choirWeeksList, choirFlags: choirFlags };
  }

  function buildFlaggedWeekdaySet(choirFlags) {
    var set = new Set();
    choirFlags.forEach(function (f) {
      var s = parseISO(f.start), e = parseISO(f.end);
      var cur = new Date(s.y, s.m - 1, s.d);
      var end = new Date(e.y, e.m - 1, e.d);
      while (cur <= end) {
        var dow = cur.getDay();
        if (dow >= 1 && dow <= 5) {
          set.add(isoOf(cur.getFullYear(), cur.getMonth() + 1, cur.getDate()));
        }
        cur.setDate(cur.getDate() + 1);
      }
    });
    return set;
  }

  /* ---------- rendering ---------- */

  var COURSE_LETTER = { history: "H", theology: "T", literature: "L" };
  var COURSE_ORDER = { history: 0, theology: 1, literature: 2, choir: 3 };
  var KIND_ORDER = { quiz: 0, due: 1, given: 2, event: 3 };

  function sortItems(items) {
    return items.slice().sort(function (a, b) {
      var c = COURSE_ORDER[a.course] - COURSE_ORDER[b.course];
      if (c !== 0) return c;
      return KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
    });
  }

  function chipText(item) {
    if (item.kind === "event") return "♪ Choir"; // ♪ Choir
    var letter = COURSE_LETTER[item.course] || "?";
    if (item.kind === "quiz") return letter + " · ★ Quiz"; // H · ★ Quiz
    if (item.kind === "given") return letter + " · Assigned";
    return letter + " · Due";
  }

  function cellAriaLabel(iso, items) {
    var counts = { due: 0, given: 0, quiz: 0, event: 0 };
    items.forEach(function (it) { counts[it.kind] = (counts[it.kind] || 0) + 1; });
    var parts = [];
    if (counts.due) parts.push(counts.due + " due");
    if (counts.given) parts.push(counts.given + " assigned");
    if (counts.quiz) parts.push(counts.quiz + " quiz");
    if (counts.event) parts.push("choir event");
    var summary = parts.length ? parts.join(", ") : "no assignments";
    return longDateLabel(iso) + ": " + summary;
  }

  // module state, set in start()
  var itemMap = new Map();
  var choirWeeksList = [];
  var choirFlags = [];
  var flaggedWeekdaySet = new Set();
  var currentYM = MIN_YM;
  var selectedDate = null;

  function findChoirWeek(iso) {
    for (var i = 0; i < choirWeeksList.length; i++) {
      var w = choirWeeksList[i];
      if (w.start <= iso && iso <= w.end) return w;
    }
    return null;
  }

  function findChoirFlag(week) {
    for (var i = 0; i < choirFlags.length; i++) {
      if (choirFlags[i].start === week.start && choirFlags[i].end === week.end) return choirFlags[i];
    }
    return null;
  }

  function renderWeekdayHeader() {
    weekdaysEl.innerHTML = "";
    for (var i = 0; i < 7; i++) {
      var wrap = document.createElement("span");
      var full = document.createElement("span");
      full.className = "mcal-weekday-full";
      full.textContent = WEEKDAYS_SHORT[i];
      var min = document.createElement("span");
      min.className = "mcal-weekday-min";
      min.textContent = WEEKDAYS_MIN[i];
      wrap.appendChild(full);
      wrap.appendChild(min);
      weekdaysEl.appendChild(wrap);
    }
  }

  function buildPadCell() {
    var pad = document.createElement("div");
    pad.className = "mcal-cell mcal-cell--pad";
    pad.setAttribute("role", "gridcell");
    pad.setAttribute("aria-hidden", "true");
    return pad;
  }

  function buildDayCell(iso) {
    var p = parseISO(iso);
    var items = sortItems(itemMap.get(iso) || []);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mcal-cell";
    btn.setAttribute("role", "gridcell");
    btn.dataset.date = iso;

    if (p.dow === 0 || p.dow === 6) btn.classList.add("mcal-cell--weekend");
    if (iso === todayISO()) {
      btn.classList.add("mcal-cell--today");
      btn.setAttribute("aria-current", "date");
    }
    if (flaggedWeekdaySet.has(iso)) btn.classList.add("mcal-cell--choirweek-flag");
    if (iso === selectedDate) btn.classList.add("mcal-cell--selected");
    btn.setAttribute("aria-selected", iso === selectedDate ? "true" : "false");

    var dateSpan = document.createElement("span");
    dateSpan.className = "mcal-date";
    dateSpan.textContent = String(p.d);
    btn.appendChild(dateSpan);

    var marks = document.createElement("div");
    marks.className = "mcal-marks";
    var shown = items.slice(0, 6);
    shown.forEach(function (it) {
      var chip = document.createElement("span");
      chip.className = "mcal-chip mcal-chip--" + it.kind + " " + it.course;
      chip.setAttribute("aria-hidden", "true");
      chip.textContent = chipText(it);
      marks.appendChild(chip);
    });
    if (items.length > 4) {
      marks.classList.add("mcal-marks--overflow");
      var more = document.createElement("span");
      more.className = "mcal-more";
      more.setAttribute("aria-hidden", "true");
      more.textContent = "+" + (items.length - 3) + " more";
      marks.appendChild(more);
    }
    btn.appendChild(marks);

    btn.setAttribute("aria-label", cellAriaLabel(iso, items));
    btn.tabIndex = -1; // roving tabindex assigned after the full month renders

    return btn;
  }

  function renderMonth(ym) {
    currentYM = ym;
    monthLabelEl.textContent = monthLabelText(ym);
    prevBtn.disabled = ym === MIN_YM;
    nextBtn.disabled = ym === MAX_YM;

    var parts = ym.split("-");
    var y = Number(parts[0]), m = Number(parts[1]);
    var firstDow = new Date(y, m - 1, 1).getDay();
    var total = daysInMonth(y, m);

    var cells = [];
    for (var i = 0; i < firstDow; i++) cells.push(null);
    for (var d = 1; d <= total; d++) cells.push(isoOf(y, m, d));
    while (cells.length % 7 !== 0) cells.push(null);

    gridEl.innerHTML = "";
    var weekRow = null;
    cells.forEach(function (iso, idx) {
      if (idx % 7 === 0) {
        weekRow = document.createElement("div");
        weekRow.className = "mcal-week";
        weekRow.setAttribute("role", "row");
        gridEl.appendChild(weekRow);
      }
      weekRow.appendChild(iso ? buildDayCell(iso) : buildPadCell());
    });

    assignRovingTabindex();
  }

  function realCells() {
    return Array.prototype.slice.call(gridEl.querySelectorAll(".mcal-cell:not(.mcal-cell--pad)"));
  }

  function assignRovingTabindex() {
    var cells = realCells();
    cells.forEach(function (el) { el.tabIndex = -1; });
    var target =
      cells.filter(function (el) { return el.dataset.date === selectedDate; })[0] ||
      cells.filter(function (el) { return el.dataset.date === todayISO(); })[0] ||
      cells[0];
    if (target) target.tabIndex = 0;
    return target;
  }

  function focusCell(iso) {
    var cells = realCells();
    cells.forEach(function (el) { el.tabIndex = -1; });
    var target = cells.filter(function (el) { return el.dataset.date === iso; })[0];
    if (!target) return;
    target.tabIndex = 0;
    target.focus();
  }

  function renderDetailItem(it) {
    var courseLabel = it.course.toUpperCase();
    var tagText, phraseText;

    if (it.kind === "due") {
      tagText = "DUE";
      phraseText = it.pairDate ? "today · assigned " + shortDateLabel(it.pairDate) : "today";
    } else if (it.kind === "given") {
      tagText = "ASSIGNED";
      phraseText = "today · due " + shortDateLabel(it.pairDate);
    } else if (it.kind === "quiz") {
      tagText = "★ QUIZ";
      phraseText = "today";
    } else {
      tagText = "♪ PERFORMANCE";
      phraseText = "";
    }

    var html = '<div class="mcal-detail-item ' + it.course + '">';
    html += '<p class="mcal-detail-line1">';
    html += '<span class="mcal-detail-course">' + esc(courseLabel) + "</span>";
    html += ' <span class="mcal-chip mcal-chip--' + it.kind + " " + it.course + '">' + esc(tagText) + "</span>";
    if (phraseText) {
      html += ' <span class="mcal-detail-phrase">' + esc(phraseText) + "</span>";
    }
    html += "</p>";
    html += '<p class="mcal-detail-text">' + esc(it.text) + "</p>";
    html += "</div>";
    return html;
  }

  function renderDetail(iso) {
    var items = sortItems(itemMap.get(iso) || []);
    var html = '<p class="mcal-detail-date">' + esc(longDateLabel(iso)) + "</p>";

    if (items.length) {
      var courseSet = {};
      items.forEach(function (it) { courseSet[it.course] = true; });
      var courseCount = Object.keys(courseSet).length;
      html += '<p class="mcal-detail-count">' + items.length + " item" + (items.length === 1 ? "" : "s") +
        " · " + courseCount + " course" + (courseCount === 1 ? "" : "s") + "</p>";
      items.forEach(function (it) { html += renderDetailItem(it); });
    } else {
      html += '<p class="mcal-detail-count">No assignments recorded for this day.</p>';
    }

    if (isWeekday(iso)) {
      var week = findChoirWeek(iso);
      if (week) {
        html += '<p class="mcal-detail-choirweek">♪ Choir this week: ' + esc(week.focus || "") + "</p>";
        var flag = findChoirFlag(week);
        if (flag) {
          flag.segments.forEach(function (seg) {
            html += '<p class="mcal-detail-choirflag">' + esc(seg) + "</p>";
          });
        }
      }
    }

    detailEl.innerHTML = html;
  }

  function selectDate(iso) {
    selectedDate = iso;
    realCells().forEach(function (el) {
      var isSel = el.dataset.date === iso;
      el.classList.toggle("mcal-cell--selected", isSel);
      el.setAttribute("aria-selected", isSel ? "true" : "false");
    });
    assignRovingTabindex();
    renderDetail(iso);
  }

  function goToMonth(ym) {
    ym = clampYM(ym);
    if (ym === currentYM) return;
    renderMonth(ym);
  }

  /* ---------- interaction (delegated: grid is rebuilt on every month change) ---------- */

  function wireEvents() {
    prevBtn.addEventListener("click", safe(function () {
      goToMonth(addMonths(currentYM, -1));
    }));
    nextBtn.addEventListener("click", safe(function () {
      goToMonth(addMonths(currentYM, 1));
    }));
    if (todayBtn) {
      todayBtn.addEventListener("click", safe(function () {
        var t = todayISO();
        var ym = clampYM(ymOf(t));
        renderMonth(ym);
        if (ym === ymOf(t)) {
          selectDate(t);
          focusCell(t);
        }
      }));
    }

    gridEl.addEventListener("click", safe(function (e) {
      var cell = e.target.closest ? e.target.closest(".mcal-cell:not(.mcal-cell--pad)") : null;
      if (!cell || !gridEl.contains(cell)) return;
      var iso = cell.dataset.date;
      if (iso) selectDate(iso);
    }));

    gridEl.addEventListener("keydown", safe(function (e) {
      var t = e.target;
      if (!t || !t.classList || !t.classList.contains("mcal-cell") || t.classList.contains("mcal-cell--pad")) return;
      var iso = t.dataset.date;
      if (!iso) return;

      var key = e.key;

      if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
        e.preventDefault();
        var delta = key === "ArrowLeft" ? -1 : key === "ArrowRight" ? 1 : key === "ArrowUp" ? -7 : 7;
        moveFocus(iso, delta);
        return;
      }

      if (key === "Home" || key === "End") {
        e.preventDefault();
        var p = parseISO(iso);
        moveFocus(iso, key === "Home" ? -p.dow : 6 - p.dow);
        return;
      }

      if (key === "PageUp" || key === "PageDown") {
        e.preventDefault();
        var newYM = clampYM(addMonths(currentYM, key === "PageUp" ? -1 : 1));
        if (newYM === currentYM) return; // no-op at clamps, keep focus
        var day = parseISO(iso).d;
        var ymParts = newYM.split("-");
        var maxDay = daysInMonth(Number(ymParts[0]), Number(ymParts[1]));
        var newISO = newYM + "-" + pad2(Math.min(day, maxDay));
        renderMonth(newYM);
        focusCell(newISO);
        return;
      }

      if (key === " " || key === "Spacebar") {
        e.preventDefault(); // avoid page scroll; native button click still fires
      }
      // Enter/Space activate the focused <button> natively, which fires the
      // delegated click handler above -- no extra handling needed.
    }));
  }

  function moveFocus(fromISO, deltaDays) {
    var p = parseISO(fromISO);
    var base = new Date(p.y, p.m - 1, p.d);
    base.setDate(base.getDate() + deltaDays);
    var newISO = isoOf(base.getFullYear(), base.getMonth() + 1, base.getDate());
    var newYM = ymOf(newISO);
    if (clampYM(newYM) !== newYM) return; // would leave the valid range; no-op, keep focus

    if (newYM !== currentYM) renderMonth(newYM);
    focusCell(newISO);
  }

  /* ---------- init ---------- */

  function start(data) {
    var built = buildItemMap(data);
    itemMap = built.map;
    choirWeeksList = built.choirWeeksList;
    choirFlags = built.choirFlags;
    flaggedWeekdaySet = buildFlaggedWeekdaySet(choirFlags);

    renderWeekdayHeader();
    wireEvents();

    var todayYM = ymOf(todayISO());
    var initialYM = clampYM(todayYM);
    renderMonth(initialYM);

    // On load: if the displayed month contains today and today has items,
    // auto-select today; else leave the page's static placeholder in place.
    if (initialYM === todayYM && (itemMap.get(todayISO()) || []).length) {
      selectDate(todayISO());
    }
  }

  fetch("data/upcoming.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .then(function (data) {
      start(data);
    })
    .catch(function () {
      fail();
    });
})();
