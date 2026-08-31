/* Clari & the Fourth Crusade — step-through controller.
   Reads window.CLARI_STEPS (inlined in the page) and toggles the SVG layers.
   window.CLARI_GEO is loaded alongside for anything that wants the raw
   geometry later; the map itself is already inlined as SVG. */
(function () {
  "use strict";

  var steps = window.CLARI_STEPS || [];
  if (!steps.length) return;

  // A leg's city label lives in its own layer so it fades in with the leg.
  var RIDER = {
    "cl-leg-zara": "cl-leg-zara-l",
    "cl-leg-corfu": "cl-leg-corfu-l",
    "cl-leg-cp": "cl-leg-cp-l"
  };

  var layers = Array.prototype.slice.call(document.querySelectorAll(".cl-layer"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".cl-step"));
  var capN = document.getElementById("cl-cap-n");
  var capWhen = document.getElementById("cl-cap-when");
  var capT = document.getElementById("cl-cap-t");
  var prev = document.getElementById("cl-prev");
  var next = document.getElementById("cl-next");
  var rail = document.querySelector(".cl-rail");
  var i = 0;

  function render() {
    var s = steps[i];
    var want = {};
    s.on.forEach(function (key) {
      var dim = key.slice(-4) === "-dim";
      var id = "cl-" + (dim ? key.slice(0, -4) : key);
      want[id] = dim ? "dim" : "on";
      if (RIDER[id]) want[RIDER[id]] = dim ? "dim" : "on";
    });

    layers.forEach(function (el) {
      el.classList.remove("on", "dim");
      if (want[el.id]) el.classList.add(want[el.id]);
    });

    capN.textContent = s.n;
    capWhen.textContent = s.when;
    capT.innerHTML = s.t;

    chips.forEach(function (c, n) {
      c.setAttribute("aria-current", n === i ? "true" : "false");
    });
    prev.disabled = i === 0;
    next.disabled = i === steps.length - 1;

    var active = chips[i];
    if (active && rail && rail.scrollWidth > rail.clientWidth) {
      active.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  function go(n) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    render();
  }

  next.addEventListener("click", function (e) { e.stopPropagation(); go(i + 1); });
  prev.addEventListener("click", function (e) { e.stopPropagation(); go(i - 1); });
  document.querySelector(".cl-mapfig").addEventListener("click", function () { go(i + 1); });
  rail.addEventListener("click", function (e) {
    var c = e.target.closest(".cl-step");
    if (c) go(+c.dataset.i);
  });

  // ---------------------------------------------------------------- present
  var presentBtn = document.getElementById("cl-present");
  var exitBtn = document.getElementById("cl-present-exit");

  function present(on) {
    document.body.classList.toggle("cl-presenting", on);
    presentBtn.setAttribute("aria-pressed", on ? "true" : "false");
    if (on && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else if (!on && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
  }
  presentBtn.addEventListener("click", function () {
    present(!document.body.classList.contains("cl-presenting"));
  });
  exitBtn.addEventListener("click", function () { present(false); });
  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) {
      document.body.classList.remove("cl-presenting");
      presentBtn.setAttribute("aria-pressed", "false");
    }
  });

  // ---------------------------------------------------------------- keys
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault(); go(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault(); go(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault(); go(0);
    } else if (e.key === "End") {
      e.preventDefault(); go(steps.length - 1);
    } else if (/^[1-8]$/.test(e.key)) {
      go(+e.key - 1);
    } else if (e.key === "p" || e.key === "P") {
      present(!document.body.classList.contains("cl-presenting"));
    } else if (e.key === "Escape") {
      present(false);
    }
  });

  render();
})();
