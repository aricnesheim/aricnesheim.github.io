/* admin.js — the private admin page at aricnesheim.com/admin/.

   The site is static and its repo is public, so everything private lives in
   vault/ as AES-256-GCM ciphertext (see Planning/_tools/website-admin-build.py,
   outside this repo). This script derives the key from the passphrase with
   PBKDF2 (Web Crypto), decrypts the index, then decrypts each day's plans on
   demand. "Remember on this device" keeps the derived key (never the
   passphrase) in localStorage; Lock forgets it. Nothing is sent anywhere. */

(function () {
  "use strict";

  const $ = (sel, el) => (el || document).querySelector(sel);
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const KEY_PREFIX = "an-admin:key:";
  const VAULT = "vault/";
  const DOW = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const COURSE_NAMES = { history: "History 11", literature: "Literature 11", theology: "Theology 10",
    choir: "Choir", special: "Special schedule", all: "All four courses", notes: "Notes", school: "School" };

  let INDEX = null;
  let KEY = null;
  let UPCOMING = null;
  const CACHE = {};
  const state = { view: "today", todayDate: null, planDate: null, planMode: "day", planKey: null, openCourse: null };

  // ------------------------------------------------------------------ crypto
  const b64 = {
    from: (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)),
    to: (buf) => {
      const bytes = new Uint8Array(buf);
      let s = "";
      for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
      return btoa(s);
    },
  };

  async function fetchEnvelope(name) {
    const r = await fetch(VAULT + name, { cache: "no-cache" });
    if (!r.ok) throw new Error("missing " + name + " (" + r.status + ")");
    return r.json();
  }

  async function deriveKey(pass, saltB64, iter) {
    const enc = new TextEncoder();
    const base = await crypto.subtle.importKey("raw", enc.encode(pass.normalize("NFC")), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", hash: "SHA-256", salt: b64.from(saltB64), iterations: iter },
      base, { name: "AES-GCM", length: 256 }, true, ["decrypt"]);
  }

  async function decrypt(env, key) {
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64.from(env.iv) }, key, b64.from(env.ct));
    return JSON.parse(new TextDecoder().decode(pt));
  }

  async function loadDoc(name) {
    if (CACHE[name]) return CACHE[name];
    const env = await fetchEnvelope(name);
    const doc = await decrypt(env, KEY);
    CACHE[name] = doc;
    return doc;
  }

  // ------------------------------------------------------------------ dates
  const pad = (n) => String(n).padStart(2, "0");
  const isoOf = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const parseIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const todayIso = () => isoOf(new Date());
  const addDays = (iso, n) => { const d = parseIso(iso); d.setDate(d.getDate() + n); return isoOf(d); };
  const dowOf = (iso) => DOW[parseIso(iso).getDay()];
  const mondayOf = (iso) => { const d = parseIso(iso); const off = (d.getDay() + 6) % 7; d.setDate(d.getDate() - off); return isoOf(d); };
  const fmtLong = (iso) => parseIso(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const fmtShort = (iso) => parseIso(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const fmtMonth = (iso) => parseIso(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysBetween = (a, b) => Math.round((parseIso(b) - parseIso(a)) / 86400000);

  function isSchoolDay(iso) {
    const dow = dowOf(iso);
    if (dow === "sat" || dow === "sun") return false;
    return !INDEX.calendar.noSchool.includes(iso);
  }
  function schoolDaysBetween(a, b) {
    // school days in (a, b]
    if (b <= a) return 0;
    let n = 0;
    for (let d = addDays(a, 1); d <= b; d = addDays(d, 1)) if (isSchoolDay(d)) n++;
    return n;
  }
  function nextSchoolDay(iso, includeSelf) {
    let d = includeSelf ? iso : addDays(iso, 1);
    for (let i = 0; i < 40; i++, d = addDays(d, 1)) if (isSchoolDay(d)) return d;
    return null;
  }
  function prevSchoolDay(iso) {
    let d = addDays(iso, -1);
    for (let i = 0; i < 40; i++, d = addDays(d, -1)) if (isSchoolDay(d)) return d;
    return null;
  }

  // clock helpers: "7:20–8:00", "8:02–8:10, then 9:30–9:57", "2:45"
  function minutesOf(t) {
    const m = String(t).match(/(\d{1,2}):(\d\d)/);
    if (!m) return null;
    let h = +m[1];
    if (h < 7) h += 12;
    return h * 60 + +m[2];
  }
  function endMinutesOf(t) {
    const all = String(t).match(/\d{1,2}:\d\d/g);
    if (!all) return null;
    return all.length > 1 ? minutesOf(all[all.length - 1]) : minutesOf(all[0]) + 5;
  }
  const byStart = (a, b) => (minutesOf(a.t) || 0) - (minutesOf(b.t) || 0);

  // ------------------------------------------------------------------ day type
  function thursdayMode() {
    try { return localStorage.getItem("an-admin:thu") || INDEX.config.thursdayMode || "wed-bells"; } catch (e) { return "wed-bells"; }
  }

  function dayType(iso) {
    const cfg = INDEX.config, cal = INDEX.calendar;
    const dow = dowOf(iso);
    if (cfg.overrides && cfg.overrides[iso]) {
      const o = cfg.overrides[iso];
      return { kind: "override", label: o.label, blocks: o.blocks.slice().sort(byStart), source: o.source, badge: "Special schedule" };
    }
    if (dow === "sat" || dow === "sun") return { kind: "weekend", label: "Weekend", blocks: [], badge: "Weekend" };
    if (cal.noSchool.includes(iso)) return { kind: "noschool", label: "No school", blocks: [], badge: "No school" };
    if (cal.half.includes(iso)) return variant("half", dow);
    if (cal.late.includes(iso)) return variant("late", dow);
    const base = (dow === "thu" && thursdayMode() === "wed-bells") ? cfg.days.thuWedBells : cfg.days[dow];
    return { kind: "normal", label: base.label, blocks: base.blocks.slice().sort(byStart), badge: null };
  }

  function variant(v, dow) {
    const cfg = INDEX.config, spec = cfg.variants[v], base = cfg.days[dow];
    const kept = base.blocks.filter((b) => b.per && spec.runs.includes(b.per))
      .map((b) => Object.assign({}, b, { t: spec.periods[String(b.per)] || b.t }));
    const blocks = kept.concat(spec.fixed).sort(byStart);
    return { kind: v, label: spec.label + " · " + base.label.replace(/ \(.*$/, ""), note: spec.note, blocks, badge: spec.label };
  }

  // ------------------------------------------------------------------ rendering helpers
  const badge = (course, text) => '<span class="badge ' + esc(course) + '">' + esc(text || COURSE_NAMES[course] || course) + "</span>";
  const dayEntry = (iso) => INDEX.days.find((d) => d.date === iso) || null;
  const weekEntry = (monday) => INDEX.weeks.find((w) => w.monday === monday) || null;

  function setView(name) {
    state.view = name;
    document.querySelectorAll(".adm-tabs [role=tab]").forEach((b) => b.setAttribute("aria-selected", b.dataset.view === name ? "true" : "false"));
    document.querySelectorAll(".adm-view").forEach((v) => { v.hidden = v.id !== "v-" + name; });
  }

  // ------------------------------------------------------------------ TODAY
  function upcomingFor(course, iso) {
    if (!UPCOMING || !UPCOMING[course]) return null;
    const u = UPCOMING[course];
    if (u.type === "weeks") return u.rows.find((r) => r.start <= iso && iso <= r.end) || null;
    return u.rows.find((r) => r.date === iso) || null;
  }

  function renderToday(iso) {
    state.todayDate = iso;
    const t = dayType(iso);
    const entry = dayEntry(iso);
    const isToday = iso === todayIso();
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    const cfg = INDEX.config;
    let h = "";

    h += '<div class="plan-nav">';
    h += '<button class="btn small" data-go="today" data-date="' + esc(prevSchoolDay(iso) || addDays(iso, -1)) + '">‹ Prev</button>';
    h += '<h2>' + esc(fmtLong(iso)) + '</h2>';
    h += '<button class="btn small" data-go="today" data-date="' + esc(nextSchoolDay(iso) || addDays(iso, 1)) + '">Next ›</button>';
    if (!isToday) h += '<button class="btn small" data-go="today" data-date="' + esc(todayIso()) + '">Today</button>';
    h += '</div>';

    h += '<div class="day-head">' + (t.badge ? badge("special", t.badge) : "") + (entry && entry.half && !t.badge ? badge("special", "Half day") : "") + '</div>';
    if (t.note) h += '<p class="day-note">' + esc(t.note) + '</p>';
    if (t.source) h += '<p class="day-note">Source: ' + esc(t.source) + '</p>';

    if (INDEX.pinned) h += '<section class="card pinned"><h2>Pinned</h2><div class="doc">' + INDEX.pinned + '</div></section>';

    // bells
    h += '<section class="card"><h2>' + esc(t.label) + '</h2>';
    if (!t.blocks.length) {
      h += '<p class="plan-empty">' + (t.kind === "weekend" ? "No bells. Rest counts as duty." : "No classes today.") + '</p>';
    } else {
      h += '<ul class="bells">';
      t.blocks.forEach((b) => {
        const s = minutesOf(b.t), e = endMinutesOf(b.t);
        let cls = b.course ? "class" : (b.kind === "duty" ? "duty" : "school");
        if (isToday && s != null) {
          if (nowMin >= s && nowMin < e) cls += " now"; else if (nowMin >= e) cls += " past";
        }
        const has = entry && b.course && entry.courses.includes(b.course);
        h += '<li class="' + cls + '"><span class="t">' + esc(b.t) + '</span><p class="what">' + esc(b.what)
          + (b.room ? '<span class="room">' + esc(b.room) + '</span>' : "") + '</p>'
          + (has ? '<span class="open"><button class="btn small" data-go="plans" data-date="' + esc(iso) + '" data-course="' + esc(b.course) + '">Open plan</button></span>' : "<span></span>")
          + '</li>';
      });
      h += '</ul>';
    }
    if (dowOf(iso) === "thu" && t.kind === "normal") {
      const mode = thursdayMode();
      h += '<div class="btn-row" style="margin-top:0.8rem"><span class="rule">Thursday bells:</span>'
        + '<button class="btn small' + (mode === "wed-bells" ? " primary" : "") + '" data-thu="wed-bells">Wednesday’s bells (no campus Mass)</button>'
        + '<button class="btn small' + (mode === "printed" ? " primary" : "") + '" data-thu="printed">Printed chart (Mass 1:45)</button></div>';
    }
    h += '</section>';

    // in class today (public calendar data)
    const rows = ["history", "literature", "theology", "choir"].map((c) => [c, upcomingFor(c, iso)]).filter((x) => x[1]);
    if (rows.length) {
      h += '<section class="card"><h2>On the calendar</h2><ul class="inclass">';
      rows.forEach(([c, r]) => {
        h += '<li><span class="c ' + c + '">' + esc(COURSE_NAMES[c]) + (r.n ? " · week " + r.n : "") + '</span>';
        if (r.inclass) h += '<p>' + esc(r.inclass) + '</p>';
        if (r.focus) h += '<p>' + esc(r.focus) + '</p>';
        if (r.notes) h += '<p class="due-none">' + esc(r.notes) + '</p>';
        if (r.due) h += '<p class="due' + (/^nothing( is)? due/i.test(r.due) ? " due-none" : "") + '">' + (/^nothing/i.test(r.due) ? "" : "<strong>Due:</strong> ") + esc(r.due) + '</p>';
        h += '</li>';
      });
      h += '</ul><p class="rule">From the public Road Ahead data (data/upcoming.json). The plan of the day wins on collision.</p></section>';
    }

    // plans for the day
    h += '<section class="card"><h2>Plans for the day</h2>';
    if (entry) {
      h += '<ul class="archive-list inclass">';
      entry.titles.forEach((s) => {
        h += '<li>' + badge(s.course) + ' <strong>' + esc(s.title) + '</strong>' + (s.subtitle ? '<p>' + esc(s.subtitle) + '</p>' : "")
          + '<p><button class="btn small" data-go="plans" data-date="' + esc(iso) + '" data-course="' + esc(s.course) + '">Open</button></p></li>';
      });
      h += '</ul>';
    } else {
      h += '<p class="plan-empty">No plan filed for this day.</p>';
    }
    const wk = weekEntry(mondayOf(iso));
    if (wk) h += '<p class="btn-row" style="margin-top:0.8rem"><button class="btn small" data-go="week" data-date="' + esc(wk.monday) + '">Week sheet · ' + esc(fmtShort(wk.monday).replace(/^\w+, /, "")) + '</button></p>';
    h += '</section>';

    // next school day
    const nxt = nextSchoolDay(iso, false);
    if (nxt) {
      const ne = dayEntry(nxt);
      h += '<section class="card"><h2>Next school day</h2><p><strong>' + esc(fmtLong(nxt)) + '</strong>'
        + (dayType(nxt).badge ? " · " + esc(dayType(nxt).badge) : "") + '</p>';
      h += ne ? '<p>' + ne.courses.map((c) => badge(c)).join(" ") + '</p><p><button class="btn small" data-go="today" data-date="' + esc(nxt) + '">Look at it</button></p>'
              : '<p class="plan-empty">No plan filed yet.</p>';
      h += '</section>';
    }

    // duties
    if (cfg.duties && cfg.duties.length) {
      h += '<section class="card"><h2>Duties, standing</h2><ul>' + cfg.duties.map((d) => "<li>" + esc(d) + "</li>").join("") + '</ul></section>';
    }
    $("#v-today").innerHTML = h;
  }

  // ------------------------------------------------------------------ PLANS
  function nearestPlanDate() {
    const t = todayIso();
    if (dayEntry(t)) return t;
    const future = INDEX.days.filter((d) => d.date > t);
    if (future.length) return future[0].date;
    return INDEX.days.length ? INDEX.days[INDEX.days.length - 1].date : t;
  }

  function planNav(title, prevKey, nextKey, mode) {
    let h = '<div class="plan-nav">';
    h += '<button class="btn small" data-go="' + mode + '" data-date="' + esc(prevKey || "") + '"' + (prevKey ? "" : " disabled") + '>‹</button>';
    h += '<h2>' + esc(title) + '</h2>';
    h += '<button class="btn small" data-go="' + mode + '" data-date="' + esc(nextKey || "") + '"' + (nextKey ? "" : " disabled") + '>›</button>';
    h += '<input type="date" id="planDate" aria-label="Jump to a date">';
    h += '<button class="btn small" data-go="plans" data-date="' + esc(nearestPlanDate()) + '">Today</button>';
    h += '</div>';
    return h;
  }

  function sectionHtml(s, key, openIt, i) {
    return '<details class="plan" data-course="' + esc(s.course) + '"' + (openIt ? " open" : "") + '>'
      + '<summary>' + badge(s.course, s.courseName) + '<span class="ttl">' + esc(s.title) + '</span>'
      + (s.subtitle ? '<p class="sub">' + esc(s.subtitle) + '</p>' : "") + '</summary>'
      + '<div class="body"><div class="doc" data-key="' + esc(key) + ':' + esc(s.course) + ':' + i + '">' + s.html + '</div>'
      + '<p class="src">Source: ' + esc(s.source) + (s.modified ? " · file dated " + esc(s.modified) : "") + '</p></div></details>';
  }

  function wireChecklists(root) {
    root.querySelectorAll(".doc").forEach((doc) => {
      const key = doc.dataset.key;
      doc.querySelectorAll("ul.check input[type=checkbox]").forEach((box, i) => {
        const k = "an-admin:chk:" + key + ":" + i;
        try { box.checked = localStorage.getItem(k) === "1"; } catch (e) {}
        box.addEventListener("change", () => { try { box.checked ? localStorage.setItem(k, "1") : localStorage.removeItem(k); } catch (e) {} });
      });
    });
  }

  function archiveHtml() {
    let h = '<section class="card archive"><h2>Archive</h2><p class="rule">Every day with a filed plan, newest first. Weeks and references below.</p>';
    const byMonth = {};
    INDEX.days.slice().reverse().forEach((d) => { const m = d.date.slice(0, 7); (byMonth[m] = byMonth[m] || []).push(d); });
    const months = Object.keys(byMonth).sort().reverse();
    months.forEach((m, mi) => {
      h += '<details' + (mi === 0 ? " open" : "") + '><summary>' + esc(fmtMonth(m + "-01")) + ' · ' + byMonth[m].length + ' days</summary><ul>';
      byMonth[m].forEach((d) => {
        h += '<li><a href="#plans/' + d.date + '">' + esc(fmtShort(d.date)) + '</a>' + d.courses.map((c) => badge(c)).join(" ")
          + (d.half ? badge("special", "half day") : "") + (d.late ? badge("special", "late start") : "") + '</li>';
      });
      h += '</ul></details>';
    });
    if (INDEX.weeks.length) {
      h += '<details><summary>Weeks · ' + INDEX.weeks.length + '</summary><ul>';
      INDEX.weeks.slice().reverse().forEach((w) => {
        h += '<li><a href="#week/' + w.monday + '">Week of ' + esc(fmtShort(w.monday).replace(/^\w+, /, "")) + '</a>' + w.courses.map((c) => badge(c)).join(" ") + '</li>';
      });
      h += '</ul></details>';
    }
    if (INDEX.refs.length) {
      h += '<details><summary>References · ' + INDEX.refs.length + '</summary><ul>';
      INDEX.refs.forEach((r) => { h += '<li><a href="#ref/' + esc(r.slug) + '">' + esc(r.title) + '</a>' + badge(r.course) + '</li>'; });
      h += '</ul></details>';
    }
    h += '</section>';
    return h;
  }

  async function renderPlans(iso, openCourse) {
    state.planMode = "day"; state.planKey = iso; state.openCourse = openCourse || null;
    const view = $("#v-plans");
    const entry = dayEntry(iso);
    const i = INDEX.days.findIndex((d) => d.date === iso);
    const prev = i > 0 ? INDEX.days[i - 1].date : (i < 0 ? (INDEX.days.filter((d) => d.date < iso).pop() || {}).date : null);
    const next = i >= 0 && i < INDEX.days.length - 1 ? INDEX.days[i + 1].date : (i < 0 ? (INDEX.days.find((d) => d.date > iso) || {}).date : null);
    let h = planNav(fmtLong(iso), prev, next, "plans");
    const t = dayType(iso);
    if (t.badge) h += '<div class="day-head">' + badge("special", t.badge) + '</div>';
    const wk = weekEntry(mondayOf(iso));
    h += '<p class="btn-row"><button class="btn small" data-go="today" data-date="' + esc(iso) + '">Bells for this day</button>'
      + (wk ? '<button class="btn small" data-go="week" data-date="' + esc(wk.monday) + '">Week sheet</button>' : "")
      + '<button class="btn small" id="toggleAll">Collapse all</button><button class="btn small" onclick="window.print()">Print</button></p>';
    if (!entry) {
      h += '<p class="plan-empty">No plan filed for ' + esc(fmtShort(iso)) + '.</p>' + archiveHtml();
      view.innerHTML = h; afterPlansRender(view); return;
    }
    h += '<div id="planBody"><p class="plan-empty">Decrypting…</p></div>' + archiveHtml();
    view.innerHTML = h; afterPlansRender(view);
    try {
      const doc = await loadDoc(entry.file);
      const body = $("#planBody");
      body.innerHTML = doc.sections.map((s, k) => sectionHtml(s, iso, !openCourse || s.course === openCourse, k)).join("");
      wireChecklists(body);
      if (openCourse) { const d = body.querySelector('details[data-course="' + openCourse + '"]'); if (d) d.scrollIntoView({ block: "start" }); }
    } catch (e) {
      $("#planBody").innerHTML = '<p class="plan-empty">Could not open this day (' + esc(e.message) + ').</p>';
    }
  }

  async function renderWeek(monday) {
    state.planMode = "week"; state.planKey = monday;
    const view = $("#v-plans");
    const entry = weekEntry(monday);
    const i = INDEX.weeks.findIndex((w) => w.monday === monday);
    const prev = i > 0 ? INDEX.weeks[i - 1].monday : null;
    const next = i >= 0 && i < INDEX.weeks.length - 1 ? INDEX.weeks[i + 1].monday : null;
    let h = planNav("Week of " + fmtShort(monday).replace(/^\w+, /, ""), prev, next, "week");
    h += '<p class="btn-row"><button class="btn small" id="toggleAll">Collapse all</button><button class="btn small" onclick="window.print()">Print</button></p>';
    if (!entry) { view.innerHTML = h + '<p class="plan-empty">No week sheet for this week.</p>' + archiveHtml(); afterPlansRender(view); return; }
    h += '<div id="planBody"><p class="plan-empty">Decrypting…</p></div>' + archiveHtml();
    view.innerHTML = h; afterPlansRender(view);
    try {
      const doc = await loadDoc(entry.file);
      const body = $("#planBody");
      body.innerHTML = doc.sections.map((s, k) => sectionHtml(s, "w" + monday, true, k)).join("");
      wireChecklists(body);
    } catch (e) { $("#planBody").innerHTML = '<p class="plan-empty">Could not open this week (' + esc(e.message) + ').</p>'; }
  }

  async function renderRef(slug) {
    state.planMode = "ref"; state.planKey = slug;
    const view = $("#v-plans");
    const r = INDEX.refs.find((x) => x.slug === slug);
    let h = '<div class="plan-nav"><h2>' + esc(r ? r.title : "Reference") + '</h2><button class="btn small" data-go="plans" data-date="' + esc(nearestPlanDate()) + '">Back to plans</button></div>';
    if (!r) { view.innerHTML = h + '<p class="plan-empty">Unknown reference.</p>'; return; }
    h += '<div id="planBody"><p class="plan-empty">Decrypting…</p></div>' + archiveHtml();
    view.innerHTML = h; afterPlansRender(view);
    try {
      const doc = await loadDoc(r.file);
      $("#planBody").innerHTML = sectionHtml({ course: r.course, courseName: COURSE_NAMES[r.course] || r.course, title: doc.title, subtitle: doc.subtitle, html: doc.html, source: doc.source }, "r" + slug, true, 0);
    } catch (e) { $("#planBody").innerHTML = '<p class="plan-empty">Could not open this document (' + esc(e.message) + ').</p>'; }
  }

  function afterPlansRender(view) {
    const dateInput = $("#planDate", view);
    if (dateInput) {
      if (state.planMode === "day") dateInput.value = state.planKey;
      dateInput.addEventListener("change", () => { if (dateInput.value) location.hash = "#plans/" + dateInput.value; });
    }
    const tog = $("#toggleAll", view);
    if (tog) tog.addEventListener("click", () => {
      const all = view.querySelectorAll("details.plan");
      const anyOpen = Array.from(all).some((d) => d.open);
      all.forEach((d) => { d.open = !anyOpen; });
      tog.textContent = anyOpen ? "Expand all" : "Collapse all";
    });
  }

  // ------------------------------------------------------------------ STATS
  function renderStats() {
    const gc = INDEX.config.goatcounter || {};
    let h = "";
    let skip = false;
    try { skip = localStorage.getItem("skipgc") === "t"; } catch (e) {}
    if (gc.code) {
      const src = "https://" + encodeURIComponent(gc.code) + ".goatcounter.com/?hideui=1" + (gc.token ? "&access-token=" + encodeURIComponent(gc.token) : "");
      h += '<section class="card"><h2>Visitors</h2><p class="rule">GoatCounter, the private dashboard. No cookies, no personal data; counts pageviews and unique visits by day, page, and referrer.</p>'
        + '<iframe class="stats-frame" src="' + esc(src) + '" title="Visitor statistics" loading="lazy"></iframe>'
        + '<p class="btn-row" style="margin-top:0.7rem"><a class="btn small" target="_blank" rel="noopener" href="https://' + esc(gc.code) + '.goatcounter.com/' + (gc.token ? "?access-token=" + esc(gc.token) : "") + '">Open the full dashboard</a></p>';
      if (gc.counters) h += '<div id="counters" class="stat-tiles"></div>';
      h += '</section>';
    } else {
      h += '<section class="card"><h2>Visitors</h2><p>Not connected yet. The site is ready for GoatCounter, a free, privacy-respecting counter: no cookies, no personal data, no consent banner, and a dashboard only you can see. Five minutes to set up:</p>'
        + '<ol class="steps">'
        + '<li>Create the account at <a href="https://www.goatcounter.com/signup" target="_blank" rel="noopener">goatcounter.com/signup</a>. Pick a site code (for example <code>aricnesheim</code>); the dashboard will live at <em>code</em>.goatcounter.com.</li>'
        + '<li>In its Settings: set <strong>Dashboard viewable by</strong> to <em>logged in users or with secret token</em> and copy the token. Under <strong>Sites that can embed GoatCounter</strong>, add <code>aricnesheim.com</code>. Optionally tick <strong>Allow adding visitor counts on your website</strong> for the per-page tiles here.</li>'
        + '<li>Tell Claude the code and the token. Claude puts the code in <code>analytics.js</code> and both in the private admin config, rebuilds this vault, and pushes. Counting starts the minute the site updates.</li>'
        + '</ol></section>';
    }
    h += '<section class="card"><h2>Your own visits</h2><p>GoatCounter skips any browser that carries a small flag. Switch it on here on every device you use, so your own checking does not count.</p>'
      + '<label class="switch"><input type="checkbox" id="skipgc"' + (skip ? " checked" : "") + '> Do not count my visits from this browser</label></section>';
    $("#v-stats").innerHTML = h;
    const box = $("#skipgc");
    if (box) box.addEventListener("change", () => { try { box.checked ? localStorage.setItem("skipgc", "t") : localStorage.removeItem("skipgc"); } catch (e) {} });
    if (gc.code && gc.counters) loadCounters(gc.code);
  }

  async function loadCounters(code) {
    const pages = [["/", "Home"], ["/history.html", "History"], ["/theology.html", "Theology"], ["/literature.html", "Literature"],
      ["/choir.html", "Choir"], ["/year.html", "Calendar"], ["/history-maps.html", "Map Trainer"], ["/literature-inferno.html", "Map of Hell"]];
    const mount = $("#counters");
    if (!mount) return;
    const tiles = [];
    for (const [path, label] of pages) {
      try {
        const r = await fetch("https://" + code + ".goatcounter.com/counter/" + path + ".json");
        if (!r.ok) continue;
        const j = await r.json();
        tiles.push('<div class="tile"><div class="n">' + esc(j.count) + '</div><div class="l">' + esc(label) + ' · all time</div></div>');
      } catch (e) { /* counter not enabled, or blocked */ }
    }
    mount.innerHTML = tiles.join("") || '<p class="rule">Per-page counts are off (tick "Allow adding visitor counts" in GoatCounter to show them here).</p>';
  }

  // ------------------------------------------------------------------ TOOLS
  function renderTools() {
    const cfg = INDEX.config, fr = INDEX.freshness || {};
    const today = todayIso();
    let h = '<div class="tool-grid">';

    // late work
    h += '<section class="card"><h2>Late work</h2><p class="rule">' + esc(cfg.grading.lateRule.text) + '</p>'
      + '<div class="field-row"><div class="field"><label for="lwScore">Score earned</label><input id="lwScore" type="number" min="0" step="0.5" value="90"></div>'
      + '<div class="field"><label for="lwMax">Points possible</label><input id="lwMax" type="number" min="1" step="1" value="100"></div></div>'
      + '<div class="field-row"><div class="field"><label for="lwDue">Due</label><input id="lwDue" type="date" value="' + today + '"></div>'
      + '<div class="field"><label for="lwIn">Turned in</label><input id="lwIn" type="date" value="' + today + '"></div></div>'
      + '<div class="result" id="lwOut"></div>'
      + '<p class="rule">' + esc(cfg.grading.lateRule.note) + '</p></section>';

    // school days counter
    h += '<section class="card"><h2>School days between</h2>'
      + '<div class="field-row"><div class="field"><label for="sdA">From</label><input id="sdA" type="date" value="' + today + '"></div>'
      + '<div class="field"><label for="sdB">To</label><input id="sdB" type="date" value="' + esc(nextSchoolDay(today, false) || today) + '"></div></div>'
      + '<div class="result" id="sdOut"></div>'
      + '<p class="rule">Counts weekdays that are not on the no-school list (from the History generator, the school-wide calendar). Half days and late starts count as school days.</p></section>';

    // DQ rubric
    h += '<section class="card"><h2>DQ rubric</h2><div class="rubric">' + cfg.grading.dqRubric.scale.map((n) => "<span>" + n + "</span>").join("") + '</div><p class="rule">' + esc(cfg.grading.dqRubric.note) + '</p></section>';

    h += '</div>';

    // key dates
    const kd = (cfg.keyDates || []).slice().sort((a, b) => a.date.localeCompare(b.date));
    const upcoming = kd.filter((d) => d.date >= today), past = kd.filter((d) => d.date < today);
    h += '<section class="card"><h2>Key dates</h2><ul class="dates">';
    upcoming.forEach((d) => {
      const n = daysBetween(today, d.date), sd = schoolDaysBetween(today, d.date);
      const inText = n === 0 ? "today" : n === 1 ? "tomorrow" : "in " + n + " days · " + sd + " school";
      h += '<li class="' + (n <= 7 ? "soon" : "") + '"><span class="d">' + esc(fmtShort(d.date)) + '</span><span>' + badge(d.course) + ' ' + esc(d.label) + '</span><span class="in">' + esc(inText) + '</span></li>';
    });
    h += '</ul>';
    if (past.length) h += '<details style="margin-top:0.6rem"><summary class="rule">Past · ' + past.length + '</summary><ul class="dates">' + past.reverse().map((d) => '<li class="past"><span class="d">' + esc(fmtShort(d.date)) + '</span><span>' + badge(d.course) + ' ' + esc(d.label) + '</span><span></span></li>').join("") + '</ul></details>';
    h += '<p class="rule">Edit the list in Planning/_tools/admin-config.json (keyDates), rebuild, push.</p></section>';

    // Educate categories
    h += '<section class="card"><h2>Educate categories</h2><p class="rule">As typed in Educate, with weights. ★ marks the Assignment Default.</p>';
    Object.values(cfg.grading.categories).forEach((c) => {
      h += '<h3 style="font-size:1rem;margin:0.9rem 0 0.2rem">' + esc(c.name) + '</h3><table class="cat"><tr><th>Category</th><th>Weight</th><th>What lands there</th></tr>'
        + c.rows.map((r) => '<tr><td>' + esc(r[0]) + '</td><td class="w">' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>').join("") + '</table>';
    });
    h += '</section>';

    // links
    const groups = {};
    (cfg.links || []).forEach((l) => { (groups[l.group] = groups[l.group] || []).push(l); });
    h += '<section class="card"><h2>Quick links</h2>';
    Object.keys(groups).forEach((g) => {
      h += '<div class="links-group"><h3>' + esc(g) + '</h3><ul>' + groups[g].map((l) => '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>' + (l.note ? '<span class="note">' + esc(l.note) + '</span>' : "") + '</li>').join("") + '</ul></div>';
    });
    if (cfg.goatcounter && cfg.goatcounter.code) h += '<div class="links-group"><h3>Stats</h3><ul><li><a href="https://' + esc(cfg.goatcounter.code) + '.goatcounter.com/" target="_blank" rel="noopener">GoatCounter dashboard</a></li></ul></div>';
    h += '</section>';

    // site health
    const cov = fr.planCoverage || {};
    const lastPlan = Object.values(cov).sort()[0];
    h += '<section class="card"><h2>Site health</h2><dl class="kv">'
      + '<dt>Homework cards</dt><dd>updated ' + esc(fr.homeworkUpdated || "?") + '</dd>'
      + '<dt>Road Ahead data</dt><dd>exported ' + esc(fr.upcomingGenerated || "?") + '</dd>'
      + '<dt>Last commit</dt><dd>' + esc((fr.lastCommit || {}).subject || "?") + ' <span class="rule">(' + esc((fr.lastCommit || {}).hash || "") + ', ' + esc(((fr.lastCommit || {}).date || "").slice(0, 10)) + ')</span></dd>'
      + '<dt>This vault</dt><dd>built ' + esc(INDEX.built.replace("T", " ").slice(0, 16)) + ' · ' + INDEX.days.length + ' days · ' + INDEX.weeks.length + ' weeks · ' + INDEX.refs.length + ' references</dd>'
      + '<dt>Plans filed through</dt><dd>' + Object.keys(cov).sort().map((c) => badge(c) + " " + esc(fmtShort(cov[c]))).join("<br>") + '</dd>'
      + '</dl>';
    if (lastPlan) {
      const n = schoolDaysBetween(today, lastPlan);
      h += '<p class="rule" style="margin-top:0.6rem">' + (n <= 10 ? '<span class="badge warn">Plans run out soon</span> ' : "") + 'The earliest course runs out of filed plans on ' + esc(fmtShort(lastPlan)) + ' (' + n + ' school days away). Ask Claude for the next batch a week before.</p>';
    }
    if ((fr.untracked || []).length || (fr.modified || []).length) {
      h += '<p class="rule" style="margin-top:0.6rem">Uncommitted files in Website/ at build time (another session’s work in progress, or edits not yet pushed):</p><ul class="warnlist">'
        + (fr.modified || []).map((f) => "<li>modified: " + esc(f) + "</li>").join("") + (fr.untracked || []).map((f) => "<li>untracked: " + esc(f) + "</li>").join("") + '</ul>';
    }
    h += '</section>';

    // runbooks
    h += '<section class="card runbook"><h2>How things get updated</h2>'
      + '<h3 style="font-size:1rem;margin:0.6rem 0 0.2rem">Homework cards (weekly)</h3><ol><li>Tell Claude the week’s homework, or say the plans are made.</li><li>Claude edits <code>Website/data/homework.json</code> and runs <code>website-homework-build.py</code>.</li><li>Commit and push. Live in about a minute.</li></ol>'
      + '<h3 style="font-size:1rem;margin:0.6rem 0 0.2rem">This page (plans and notes)</h3><ol><li>Plans are picked up automatically from each course’s 03 Lesson Prep folder by the date in the file name. Your own notes go in <code>Planning/Admin Notes/YYYY-MM-DD.md</code> (or <code>pinned.md</code> for the sticky note above the bells).</li><li>Run <code>python3 "Planning/_tools/website-admin-build.py"</code>, or tell Claude to republish the admin page.</li><li>Commit <code>Website/admin/</code> and push. Only changed days are re-encrypted.</li></ol>'
      + '<h3 style="font-size:1rem;margin:0.6rem 0 0.2rem">A schedule change</h3><ol><li>Record it once in <code>Planning/_tools/schedule-changes.json</code>; see the Schedule Change Protocol under References.</li><li><code>rebuild.sh</code> for the course, then <code>website-upcoming-export.py</code>, then push.</li><li>Rebuild this page too, so re-dated plans move with the calendar.</li></ol>'
      + '<h3 style="font-size:1rem;margin:0.6rem 0 0.2rem">Change the passphrase</h3><ol><li><code>node "Planning/_tools/website-admin-crypt.js" set-passphrase</code> (type the new one, then Enter and Ctrl-D), or ask Claude.</li><li>Rebuild with <code>--rekey</code> and push. Every device asks for the new passphrase once.</li></ol>'
      + '<p class="rule">Never in the vault: gradebook data, rosters, behavior notes, the Daily Log. Encryption on a public repo keeps outsiders out; it is not a FERPA-grade system.</p></section>';

    $("#v-tools").innerHTML = h;
    wireTools();
  }

  function wireTools() {
    const cfg = INDEX.config.grading.lateRule;
    const lw = () => {
      const score = parseFloat($("#lwScore").value), max = parseFloat($("#lwMax").value) || 100;
      const due = $("#lwDue").value, turned = $("#lwIn").value;
      const out = $("#lwOut");
      if (isNaN(score) || !due || !turned) { out.innerHTML = '<p class="rule">Fill in the four boxes.</p>'; return; }
      const days = schoolDaysBetween(due, turned);
      const perDay = cfg.pointsPerDay / 100 * max;
      const floor = cfg.floorPercent / 100 * max;
      let adjusted = score - perDay * days;
      if (adjusted < floor) adjusted = Math.min(score, floor);
      const pct = Math.round(adjusted / max * 1000) / 10;
      out.innerHTML = '<div class="big">' + (Math.round(adjusted * 10) / 10) + ' / ' + max + ' <span class="rule">(' + pct + '%)</span></div>'
        + '<p>' + (days === 0 ? "Not late: no school days between the due date and the hand-in." : days + " school day" + (days === 1 ? "" : "s") + " late · minus " + (perDay * days) + " points"
        + (score - perDay * days < floor ? " · held at the " + cfg.floorPercent + "% floor (" + floor + ")" : "")) + '</p>';
    };
    ["lwScore", "lwMax", "lwDue", "lwIn"].forEach((id) => $("#" + id).addEventListener("input", lw));
    lw();
    const sd = () => {
      const a = $("#sdA").value, b = $("#sdB").value, out = $("#sdOut");
      if (!a || !b) { out.innerHTML = ""; return; }
      const lo = a <= b ? a : b, hi = a <= b ? b : a;
      const nsd = schoolDaysBetween(lo, hi);
      out.innerHTML = '<div class="big">' + nsd + ' school day' + (nsd === 1 ? '' : 's') + '</div><p>' + daysBetween(lo, hi) + ' calendar days, counting ' + esc(fmtShort(hi)) + (isSchoolDay(hi) ? "" : " (not a school day)") + '.</p>';
    };
    ["sdA", "sdB"].forEach((id) => $("#" + id).addEventListener("input", sd));
    sd();
  }

  // ------------------------------------------------------------------ routing
  function route() {
    if (!INDEX) return;
    const parts = (location.hash || "#today").slice(1).split("/");
    const name = parts[0] || "today";
    if (name === "plans") { setView("plans"); renderPlans(parts[1] || nearestPlanDate(), parts[2] || null); }
    else if (name === "week") { setView("plans"); renderWeek(parts[1] || mondayOf(todayIso())); }
    else if (name === "ref") { setView("plans"); renderRef(parts[1] || ""); }
    else if (name === "stats") { setView("stats"); renderStats(); }
    else if (name === "tools") { setView("tools"); renderTools(); }
    else { setView("today"); renderToday(parts[1] || todayIso()); }
    window.scrollTo({ top: 0 });
  }

  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) {
      const d = go.dataset.date;
      if (go.dataset.go === "today") location.hash = "#today/" + d;
      else if (go.dataset.go === "plans") location.hash = "#plans/" + d + (go.dataset.course ? "/" + go.dataset.course : "");
      else if (go.dataset.go === "week") location.hash = "#week/" + d;
      if (location.hash === "#today/" + d) route();
      return;
    }
    const thu = e.target.closest("[data-thu]");
    if (thu) { try { localStorage.setItem("an-admin:thu", thu.dataset.thu); } catch (x) {} route(); return; }
    const tab = e.target.closest(".adm-tabs [role=tab]");
    if (tab) { location.hash = "#" + tab.dataset.view; }
  });
  window.addEventListener("hashchange", route);

  // ------------------------------------------------------------------ lock / unlock
  function showApp() {
    $("#lock").hidden = true;
    $("#app").hidden = false;
    $("#builtLine").textContent = "Vault built " + INDEX.built.replace("T", " ").slice(0, 16) + " · " + INDEX.days.length + " days filed";
    fetch("../data/upcoming.json", { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).then((u) => { UPCOMING = u; if (state.view === "today") route(); }).catch(() => {});
    route();
  }

  function lock() {
    try { Object.keys(localStorage).filter((k) => k.startsWith(KEY_PREFIX)).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
    KEY = null; INDEX = null;
    Object.keys(CACHE).forEach((k) => delete CACHE[k]);
    $("#app").hidden = true;
    $("#lock").hidden = false;
    $("#pass").value = "";
    $("#lockMsg").textContent = "Locked. The key was forgotten on this device.";
    $("#lockMsg").className = "lock-msg";
  }

  async function unlock(pass, remember) {
    const msg = $("#lockMsg");
    const btn = $("#unlockBtn");
    msg.className = "lock-msg"; msg.textContent = "Deriving the key…";
    btn.disabled = true;
    try {
      const env = await fetchEnvelope("index.json");
      const key = await deriveKey(pass, env.salt, env.iter);
      const idx = await decrypt(env, key);
      KEY = key; INDEX = idx;
      if (remember) { try { localStorage.setItem(KEY_PREFIX + env.salt, b64.to(await crypto.subtle.exportKey("raw", key))); } catch (e) {} }
      showApp();
    } catch (e) {
      msg.className = "lock-msg error";
      msg.textContent = /missing/.test(e.message) ? "The vault could not be loaded (" + e.message + ")." : "That passphrase did not open the vault.";
    } finally { btn.disabled = false; }
  }

  async function tryRemembered() {
    let env;
    try { env = await fetchEnvelope("index.json"); } catch (e) { $("#lockMsg").textContent = "The vault could not be loaded (" + e.message + ")."; return; }
    let stored = null;
    try { stored = localStorage.getItem(KEY_PREFIX + env.salt); } catch (e) {}
    if (!stored) return;
    try {
      const key = await crypto.subtle.importKey("raw", b64.from(stored), "AES-GCM", true, ["decrypt"]);
      INDEX = await decrypt(env, key);
      KEY = key;
      showApp();
    } catch (e) {
      try { localStorage.removeItem(KEY_PREFIX + env.salt); } catch (x) {}
    }
  }

  if (!window.crypto || !crypto.subtle) {
    $("#lockMsg").className = "lock-msg error";
    $("#lockMsg").textContent = "This browser cannot decrypt here (no secure context). Use https://aricnesheim.com/admin/.";
    return;
  }
  $("#lockForm").addEventListener("submit", (e) => { e.preventDefault(); unlock($("#pass").value, $("#remember").checked); });
  $("#lockBtn").addEventListener("click", lock);
  tryRemembered();
})();
