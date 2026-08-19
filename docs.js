/* Inline PDF reader for document cards (e.g. the History primary source
   reader). Same behavior as the choir score viewer: read-in-place where the
   browser can render PDFs, open in a new tab everywhere else. */

(function () {
  document.querySelectorAll(".doc-read").forEach((link) => {
    const card = link.closest(".card");
    if (!card) return;
    const viewer = card.querySelector(".doc-viewer");
    const frame = card.querySelector(".score-frame");

    link.addEventListener("click", (e) => {
      const wide = window.matchMedia("(min-width: 720px)").matches;
      const canInline = navigator.pdfViewerEnabled !== false;
      if (!wide || !canInline || !viewer) return;
      e.preventDefault();
      if (!viewer.hidden) {
        viewer.hidden = true;
        frame.removeAttribute("src");
        return;
      }
      frame.src = link.getAttribute("href");
      viewer.hidden = false;
      viewer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const closeBtn = card.querySelector(".score-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        viewer.hidden = true;
        frame.removeAttribute("src");
      });
    }
  });
})();
