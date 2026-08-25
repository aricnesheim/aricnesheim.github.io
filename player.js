/* Practice player + score viewer for the Choir page.
   One shared Audio element; each Listen button carries its file in data-src.
   Score buttons are real links (new tab) that upgrade to an inline viewer
   on screens wide enough to read a score. */

(function () {
  const audio = new Audio();
  audio.preload = "auto";
  if ("preservesPitch" in audio) audio.preservesPitch = true;
  else if ("webkitPreservesPitch" in audio) audio.webkitPreservesPitch = true;

  const RATES = [1, 0.8, 0.6];
  let rateIndex = 0;

  let currentBtn = null;
  let currentPiece = null;
  let seeking = false;

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = String(Math.floor(s % 60)).padStart(2, "0");
    return m + ":" + sec;
  };

  const els = (piece) => ({
    bar: piece.querySelector(".player-bar"),
    scrub: piece.querySelector(".scrub"),
    time: piece.querySelector(".time"),
    msg: piece.querySelector(".player-msg"),
    nowPlaying: piece.querySelector(".now-playing"),
    viewer: piece.querySelector(".score-viewer"),
    frame: piece.querySelector(".score-frame"),
    scoreTitle: piece.querySelector(".score-title"),
  });

  const partName = (el) => {
    const row = el.closest(".part-row");
    const name = row && row.querySelector(".part-name");
    return name ? name.textContent.trim() : "";
  };

  function setState(btn, state) {
    btn.classList.toggle("playing", state === "playing");
    btn.classList.toggle("paused", state === "paused");
    btn.setAttribute("aria-pressed", state === "playing" ? "true" : "false");
  }

  function updateTime() {
    if (!currentPiece) return;
    const { scrub, time } = els(currentPiece);
    if (!seeking && audio.duration) {
      scrub.value = Math.round((audio.currentTime / audio.duration) * 1000);
    }
    time.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
  }

  function closeViewer(piece) {
    const { viewer, frame } = els(piece);
    if (!viewer) return;
    viewer.hidden = true;
    frame.removeAttribute("src");
    delete frame.dataset.current;
  }

  document.querySelectorAll(".piece").forEach((piece) => {
    const { scrub, viewer, frame, scoreTitle } = els(piece);

    /* ----- audio ----- */

    piece.querySelectorAll(".part").forEach((btn) => {
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", () => {
        if (currentBtn === btn) {
          if (audio.paused) audio.play().catch(() => {});
          else audio.pause();
          return;
        }

        if (currentBtn) setState(currentBtn, "");
        document.querySelectorAll(".player-bar.active")
          .forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".player-msg")
          .forEach((m) => { m.hidden = true; });

        currentBtn = btn;
        currentPiece = piece;
        const { bar, nowPlaying } = els(piece);
        bar.classList.add("active");
        if (nowPlaying) nowPlaying.textContent = partName(btn);
        audio.src = btn.dataset.src;
        audio.playbackRate = RATES[rateIndex];
        audio.play().catch(() => {});
      });
    });

    if (scrub) {
      scrub.addEventListener("input", () => {
        if (currentPiece !== piece || !audio.duration) return;
        seeking = true;
        audio.currentTime = (scrub.value / 1000) * audio.duration;
      });
      scrub.addEventListener("change", () => { seeking = false; });
    }

    /* ----- scores ----- */

    piece.querySelectorAll(".score-btn").forEach((link) => {
      link.addEventListener("click", (e) => {
        const wide = window.matchMedia("(min-width: 720px)").matches;
        /* Inline viewer only where the browser can render PDFs in-page
           (phones and iPads cannot); everyone else gets a new tab. */
        const canInline = navigator.pdfViewerEnabled !== false;
        if (!wide || !canInline || !viewer) return;
        e.preventDefault();
        const href = link.getAttribute("href");
        if (!viewer.hidden && frame.dataset.current === href) {
          closeViewer(piece);
          return;
        }
        frame.src = href;
        frame.dataset.current = href;
        scoreTitle.textContent =
          (partName(link) || "Score") + " · " +
          piece.querySelector("h3").textContent.trim();
        viewer.hidden = false;
        viewer.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });

    const closeBtn = piece.querySelector(".score-close");
    if (closeBtn) closeBtn.addEventListener("click", () => closeViewer(piece));
  });

  /* ----- playback speed (shared across pieces) ----- */

  function applyRate() {
    const rate = RATES[rateIndex];
    audio.playbackRate = rate;
    audio.defaultPlaybackRate = rate;
    document.querySelectorAll(".speed").forEach((b) => {
      b.textContent = rate + "×";
      b.classList.toggle("slowed", rate !== 1);
    });
  }

  document.querySelectorAll(".speed").forEach((btn) => {
    btn.addEventListener("click", () => {
      rateIndex = (rateIndex + 1) % RATES.length;
      applyRate();
    });
  });

  /* ----- shared audio events ----- */

  audio.addEventListener("play", () => {
    if (currentBtn) setState(currentBtn, "playing");
  });

  /* playback actually started, so the file exists: clear any stale
     "not posted yet" state from an earlier failed attempt */
  audio.addEventListener("playing", () => {
    if (currentBtn) currentBtn.classList.remove("unavailable");
  });

  audio.addEventListener("pause", () => {
    if (currentBtn) setState(currentBtn, "paused");
  });

  audio.addEventListener("ended", () => {
    if (currentBtn) setState(currentBtn, "paused");
  });

  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("loadedmetadata", updateTime);

  audio.addEventListener("error", () => {
    if (!currentBtn || !currentPiece) return;
    currentBtn.classList.add("unavailable");
    setState(currentBtn, "");
    const { bar, msg } = els(currentPiece);
    bar.classList.remove("active");
    if (msg) {
      msg.textContent = "That recording is not posted yet.";
      msg.hidden = false;
    }
    currentBtn = null;
    currentPiece = null;
  });
})();
