/* "The road ahead" — loose calendar from the year plan.
   Reads data/upcoming.json (exported from the Scope & Sequence builds by
   Planning/_tools/website-upcoming-export.py) and renders the next stretch
   of meetings from today forward, in the student's browser. */

(function () {
  const key = document.body.dataset.page;
  const card = document.getElementById("upcoming-card");
  const mount = document.getElementById("upcoming");
  if (!key || !card || !mount) return;

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const fmtDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric",
    });
  };

  const pad = (n) => String(n).padStart(2, "0");
  const now = new Date();
  const today =
    now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

  function dayRows(rows) {
    let unit = "";
    return rows.map((r) => {
      let s = "";
      if (r.unit && r.unit !== unit) {
        unit = r.unit;
        s += '<p class="part-group-label">' + esc(unit) + "</p>";
      }
      s += '<div class="up-row"><p class="up-date">' + fmtDate(r.date) +
           (r.half ? " · half day" : "") + "</p>";
      if (r.inclass) s += '<p class="up-what">' + esc(r.inclass) + "</p>";
      if (r.due) {
        /* red DUE: label, except on "nothing due" days */
        s += /^nothing( is)? due/i.test(r.due)
          ? '<p class="up-due up-due-none">' + esc(r.due) + "</p>"
          : '<p class="up-due"><span class="due-label">DUE:</span> ' + esc(r.due) + "</p>";
      }
      return s + "</div>";
    }).join("");
  }

  function weekRows(rows) {
    return rows.map((r) => {
      let s = '<div class="up-row"><p class="up-date">Week ' + r.n + " · " +
              esc(r.dates) + "</p>";
      if (r.focus) s += '<p class="up-what">' + esc(r.focus) + "</p>";
      if (r.notes) s += '<p class="up-notes">' + esc(r.notes) + "</p>";
      return s + "</div>";
    }).join("");
  }

  fetch("data/upcoming.json")
    .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then((data) => {
      const cls = data[key];
      if (!cls || !cls.rows || !cls.rows.length) return;

      let ahead, first, rest, render;
      if (cls.type === "weeks") {
        ahead = cls.rows.filter((r) => r.end >= today);
        first = ahead.slice(0, 4);
        rest = ahead.slice(4, 12);
        render = weekRows;
      } else {
        ahead = cls.rows.filter((r) => r.date >= today);
        first = ahead.slice(0, 8);
        rest = ahead.slice(8, 26);
        render = dayRows;
      }
      if (!first.length) return;

      /* render first + rest together so unit headers stay correct, then
         hide the tail behind a Show more / Show less toggle */
      mount.innerHTML = render(first.concat(rest));
      const allRows = mount.querySelectorAll(".up-row, .part-group-label");
      const tailEls = [];
      let seen = 0;
      allRows.forEach((el) => {
        if (el.classList.contains("up-row")) {
          seen += 1;
          if (seen > first.length) {
            el.hidden = true;
            tailEls.push(el);
          }
        } else if (seen >= first.length) {
          /* a unit header whose rows all sit in the hidden tail */
          el.hidden = true;
          tailEls.push(el);
        }
      });

      if (rest.length) {
        const btn = document.createElement("button");
        btn.className = "score-btn up-more";
        btn.textContent = "Show more";
        btn.addEventListener("click", () => {
          const collapsing = btn.textContent === "Show less";
          tailEls.forEach((el) => { el.hidden = collapsing; });
          btn.textContent = collapsing ? "Show more" : "Show less";
          if (collapsing) {
            card.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
        mount.appendChild(btn);
      }
      card.hidden = false;
    })
    .catch(() => { /* no data, card stays hidden */ });
})();
