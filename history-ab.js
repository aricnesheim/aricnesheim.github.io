/* history-ab.js — Before & After: Christendom 1200 / 1600.
 *
 * Two editions. The class renders share one projection and one frame, so a wipe
 * between them is honest. The Shepherd plates are two different printed maps at
 * different scales, so a wipe would line up coastlines that do not correspond —
 * for that edition the wipe is disabled and the page says why.
 */
(function () {
  "use strict";

  var EDITIONS = [
    {
      id: "atlas",
      name: "Class renders",
      meta: "Wipe · flip · pair",
      wipe: true,
      before: {
        src: "files/history/maps/ab/atlas-1200.jpg",
        year: "1200",
        label: "Latin Christendom, c. 1200",
        alt: "Europe about 1200. Nearly the whole continent west of Rus is shaded as Latin Christendom, with the Papal States picked out in gold, the Byzantine Empire in purple around the Aegean, Almohad al-Andalus and Seljuk Rum in green, and a pagan frontier along Prussia and Lithuania."
      },
      after: {
        src: "files/history/maps/ab/atlas-1600.jpg",
        year: "1600",
        label: "Churches and states, c. 1600",
        alt: "Europe about 1600. The single Catholic block has broken up: Scandinavia and much of the Baltic are Lutheran blue, England is Anglican purple, Scotland Reformed teal, the Holy Roman Empire and Hungary are striped to show they are confessionally divided, Muscovy is Orthodox purple, and the Ottoman Empire in green now holds the Balkans and Anatolia."
      },
      provenance: "Rendered for this course from the Europa Atlas geometry, built on Natural Earth base data (public domain). The internal borders are teaching approximations, and each map says so in its own footer. Every claim painted on the pair was checked against published references before the maps were used in class: 23 claims, 18 confirmed outright, 5 confirmed with nuance, none wrong."
    },
    {
      id: "shepherd",
      name: "Published plates",
      meta: "Flip · pair only",
      wipe: false,
      wipeNote: "These two are separate printed plates at different scales and projections, so a wipe would line up coastlines that do not actually correspond. Use Flip or Side by side.",
      before: {
        src: "files/history/maps/ab/shepherd-1190.jpg",
        year: "1190",
        label: "Europe and the Mediterranean lands about 1190",
        alt: "Shepherd's Historical Atlas plate: Europe and the Mediterranean lands about 1190, in the dense colour scheme of a printed historical atlas."
      },
      after: {
        src: "files/history/maps/ab/shepherd-1560.jpg",
        year: "1560",
        label: "The religious situation in Europe about 1560",
        alt: "Shepherd's Historical Atlas plate: the religious situation in Europe about 1560, shading Lutheran, Calvinist, Anglican, Catholic and Orthodox regions."
      },
      provenance: "Scans of William R. Shepherd's Historical Atlas (1911 and 1923–26), in the public domain. The 1190 plate is the same map as page 139 of the class source binder. Sourced via emersonkent.com."
    }
  ];

  var $ = function (id) { return document.getElementById(id); };

  var frame = $("frame");
  var rail = $("ab-rail");
  var range = $("wipe-range");
  var handle = $("handle");
  var warn = $("ab-warn");
  var yearGroup = $("year-group");

  var state = { edition: EDITIONS[0], mode: "wipe", year: "before", wipe: 50 };

  /* ------------------------------------------------------------ rendering */

  function setWipe(pct) {
    state.wipe = Math.max(0, Math.min(100, pct));
    frame.style.setProperty("--wipe", state.wipe + "%");
    if (range.value !== String(Math.round(state.wipe))) {
      range.value = String(Math.round(state.wipe));
    }
  }

  function applyEdition() {
    var e = state.edition;

    $("img-sizer").src = e.before.src;
    $("img-before").src = e.before.src;
    $("img-before").alt = e.before.alt;
    $("img-after").src = e.after.src;
    $("img-after").alt = e.after.alt;

    $("pair-before").src = e.before.src;
    $("pair-before").alt = e.before.alt;
    $("pair-after").src = e.after.src;
    $("pair-after").alt = e.after.alt;

    $("cap-before").textContent = e.before.year + " · " + e.before.label;
    $("cap-after").textContent = e.after.year + " · " + e.after.label;

    $("stamp-after").textContent = e.after.year;

    $("year-before").textContent = e.before.year;
    $("year-after").textContent = e.after.year;

    $("wipe-label-before").textContent = e.before.year;
    $("wipe-label-after").textContent = e.after.year;

    $("ab-provenance").textContent = e.provenance;

    $("mode-wipe").disabled = !e.wipe;
    if (!e.wipe) {
      warn.textContent = e.wipeNote;
      warn.hidden = false;
      if (state.mode === "wipe") setMode("flip");
    } else {
      warn.hidden = true;
    }

    Array.prototype.forEach.call(rail.children, function (btn) {
      var on = btn.dataset.edition === e.id;
      if (on) { btn.setAttribute("aria-current", "page"); }
      else { btn.removeAttribute("aria-current"); }
    });

    updateStatus();
  }

  function setMode(mode) {
    if (mode === "wipe" && !state.edition.wipe) return;
    state.mode = mode;
    frame.dataset.mode = mode;
    ["wipe", "flip", "pair"].forEach(function (m) {
      $("mode-" + m).setAttribute("aria-pressed", String(m === mode));
    });
    yearGroup.hidden = mode !== "flip";
    updateStatus();
  }

  function setYear(which) {
    state.year = which;
    frame.dataset.year = which;
    $("year-before").setAttribute("aria-pressed", String(which === "before"));
    $("year-after").setAttribute("aria-pressed", String(which === "after"));
    updateStatus();
  }

  function updateStatus() {
    var e = state.edition;
    var text;
    if (state.mode === "flip") {
      var side = state.year === "before" ? e.before : e.after;
      text = "<strong>" + side.year + "</strong> · " + side.label;
    } else if (state.mode === "pair") {
      text = e.before.year + " and " + e.after.year + ", side by side";
    } else {
      text = "<strong>" + e.before.year + "</strong> on the left, <strong>" +
             e.after.year + "</strong> on the right. Drag the handle.";
    }
    $("ab-status").innerHTML = text;
  }

  /* -------------------------------------------------------------- edition rail */

  EDITIONS.forEach(function (e) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ab-tab";
    btn.dataset.edition = e.id;
    btn.innerHTML =
      '<span class="ab-tab-name">' + e.name + "</span>" +
      '<span class="ab-tab-meta">' + e.before.year + " → " + e.after.year + "</span>";
    btn.addEventListener("click", function () {
      state.edition = e;
      applyEdition();
    });
    rail.appendChild(btn);
  });

  /* ------------------------------------------------------------------ pointer */

  var dragging = false;

  function pointToPct(clientX) {
    var r = frame.getBoundingClientRect();
    if (!r.width) return state.wipe;
    return ((clientX - r.left) / r.width) * 100;
  }

  frame.addEventListener("pointerdown", function (ev) {
    if (state.mode !== "wipe") return;
    dragging = true;
    frame.setPointerCapture(ev.pointerId);
    setWipe(pointToPct(ev.clientX));
    ev.preventDefault();
  });

  frame.addEventListener("pointermove", function (ev) {
    if (!dragging || state.mode !== "wipe") return;
    setWipe(pointToPct(ev.clientX));
  });

  function endDrag(ev) {
    if (!dragging) return;
    dragging = false;
    try { frame.releasePointerCapture(ev.pointerId); } catch (err) { /* already released */ }
  }
  frame.addEventListener("pointerup", endDrag);
  frame.addEventListener("pointercancel", endDrag);

  handle.addEventListener("dragstart", function (ev) { ev.preventDefault(); });

  /* -------------------------------------------------------------------- input */

  range.addEventListener("input", function () { setWipe(Number(range.value)); });

  $("mode-wipe").addEventListener("click", function () { setMode("wipe"); });
  $("mode-flip").addEventListener("click", function () { setMode("flip"); });
  $("mode-pair").addEventListener("click", function () { setMode("pair"); });

  $("year-before").addEventListener("click", function () { setYear("before"); });
  $("year-after").addEventListener("click", function () { setYear("after"); });

  frame.addEventListener("click", function () {
    if (state.mode === "flip") setYear(state.year === "before" ? "after" : "before");
  });

  /* ----------------------------------------------------------------- present */

  function setPresent(on) {
    document.body.classList.toggle("present", on);
    $("present-toggle").setAttribute("aria-pressed", String(on));
    if (on && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(function () { /* user gesture rules */ });
    } else if (!on && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function () { /* already out */ });
    }
  }
  $("present-toggle").addEventListener("click", function () {
    setPresent(!document.body.classList.contains("present"));
  });
  $("present-exit").addEventListener("click", function () { setPresent(false); });
  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) document.body.classList.remove("present");
    $("present-toggle").setAttribute("aria-pressed", String(document.body.classList.contains("present")));
  });

  /* ---------------------------------------------------------------- keyboard */

  document.addEventListener("keydown", function (ev) {
    var t = ev.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA")) return;

    var step = ev.shiftKey ? 10 : 2;
    var key = ev.code === "Space" ? " " : ev.key;

    switch (key) {
      case "ArrowLeft":
        if (state.mode === "wipe") { setWipe(state.wipe - step); ev.preventDefault(); }
        else if (state.mode === "flip") { setYear("before"); ev.preventDefault(); }
        break;
      case "ArrowRight":
        if (state.mode === "wipe") { setWipe(state.wipe + step); ev.preventDefault(); }
        else if (state.mode === "flip") { setYear("after"); ev.preventDefault(); }
        break;
      case " ":
      case "Spacebar":
        if (state.mode !== "flip") setMode("flip");
        else setYear(state.year === "before" ? "after" : "before");
        ev.preventDefault();
        break;
      case "1":
        if (state.mode === "wipe") setWipe(100); else { setMode("flip"); setYear("before"); }
        break;
      case "2":
        if (state.mode === "wipe") setWipe(0); else { setMode("flip"); setYear("after"); }
        break;
      case "p":
      case "P":
        setPresent(!document.body.classList.contains("present"));
        break;
      case "Escape":
        if (document.body.classList.contains("present")) setPresent(false);
        break;
      default:
        break;
    }
  });

  /* -------------------------------------------------------------------- init */

  applyEdition();
  setMode("wipe");
  setWipe(50);
})();
