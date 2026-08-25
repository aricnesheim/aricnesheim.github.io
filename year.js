(() => {
  "use strict";

  const SCHOOL_START = "2026-08-24";
  const SCHOOL_END = "2027-06-04";

  const COURSES = {
    history: { title: "History 11", subtitle: "High Middle Ages to Lepanto" },
    theology: { title: "Theology 10", subtitle: "Gospels through Revelation" },
    literature: { title: "Literature 11", subtitle: "Dante through Aquinas" },
    choir: { title: "Choir", subtitle: "rehearsals and performances" }
  };

  const MONTHS = [
    ["2026-08-24", "2026-08-31", "Aug"],
    ["2026-09-01", "2026-09-30", "Sep"],
    ["2026-10-01", "2026-10-31", "Oct"],
    ["2026-11-01", "2026-11-30", "Nov"],
    ["2026-12-01", "2026-12-31", "Dec"],
    ["2027-01-01", "2027-01-31", "Jan"],
    ["2027-02-01", "2027-02-28", "Feb"],
    ["2027-03-01", "2027-03-31", "Mar"],
    ["2027-04-01", "2027-04-30", "Apr"],
    ["2027-05-01", "2027-05-31", "May"],
    ["2027-06-01", "2027-06-04", "Jun"]
  ];

  const SEGMENTS = {
    history: [
      ["2026-08-25", "2026-12-07", "High Middle Ages"],
      ["2026-12-08", "2027-01-22", "Renaissance"],
      ["2027-01-25", "2027-03-16", "Dynasties and empires"],
      ["2027-03-19", "2027-05-04", "Reformations"],
      ["2027-05-07", "2027-06-04", "Lepanto and review"]
    ],
    theology: [
      ["2026-08-25", "2026-09-23", "Matthew"],
      ["2026-09-25", "2026-10-21", "Orthodoxy and Mark"],
      ["2026-10-27", "2026-11-20", "Luke"],
      ["2026-11-24", "2027-01-06", "John"],
      ["2027-01-08", "2027-01-22", "Acts"],
      ["2027-01-26", "2027-05-11", "The letters"],
      ["2027-05-12", "2027-06-02", "Apocalypse and capstone"]
    ],
    literature: [
      ["2026-08-26", "2026-12-01", "Dante"],
      ["2026-12-02", "2026-12-18", "Much Ado"],
      ["2027-01-04", "2027-03-02", "Don Quixote"],
      ["2027-03-03", "2027-03-11", "Lepanto"],
      ["2027-03-12", "2027-04-08", "More"],
      ["2027-04-09", "2027-05-12", "Hamlet"],
      ["2027-05-13", "2027-06-04", "Aquinas"]
    ],
    choir: [
      ["2026-08-24", "2026-09-11", "Formation"],
      ["2026-09-14", "2026-11-07", "Vision Dinner"],
      ["2026-11-09", "2026-12-17", "Advent"],
      ["2027-01-04", "2027-01-15", "January review"],
      ["2027-01-19", "2027-04-29", "Spring Festival"],
      ["2027-05-03", "2027-06-02", "Graduation Mass"]
    ]
  };

  const ANCHOR_CONFIG = [
    {
      id: "hist-aquinas",
      course: "history",
      key: "aquinas",
      label: "Aquinas",
      moment: "Prayer Before Study",
      match: /Prayer Before Study/i,
      fallback: "2026-09-08"
    },
    {
      id: "hist-dante",
      course: "history",
      key: "dante",
      label: "Dante in History",
      moment: "Dante, Petrarch, Boccaccio",
      match: /Dante, Petrarch, Boccaccio/i,
      fallback: "2026-12-11",
      labelLow: true
    },
    {
      id: "hist-spain",
      course: "history",
      key: "spain",
      label: "Spain",
      moment: "Iberia and the Catholic Monarchs",
      match: /Iberia and the Catholic Monarchs/i,
      fallback: "2027-02-08"
    },
    {
      id: "hist-lepanto",
      course: "history",
      key: "lepanto",
      label: "Battle of Lepanto",
      moment: "Battle of Lepanto lesson",
      match: /The Battle of Lepanto/i,
      fallback: "2027-03-12",
      occurrence: 0,
      labelLow: true
    },
    {
      id: "hist-more",
      course: "history",
      key: "more",
      label: "Thomas More",
      moment: "Wolsey, More, Cromwell",
      match: /Wolsey, More, and Cromwell/i,
      fallback: "2027-04-13"
    },
    {
      id: "hist-fleet",
      course: "history",
      key: "lepanto",
      label: "Fleet game",
      moment: "Lepanto fleet game",
      match: /game day I/i,
      fallback: "2027-05-10",
      labelLow: true
    },
    {
      id: "hist-close",
      course: "history",
      key: "closing",
      label: "Course review",
      moment: "End-of-year review, 1100–1571",
      match: /whole story, 1100/i,
      fallback: "2027-05-25"
    },

    {
      id: "theo-advent",
      course: "theology",
      key: "advent",
      label: "John’s Prologue",
      moment: "John 1:1–18",
      match: /John 1:1–18/i,
      fallback: "2026-11-24"
    },
    {
      id: "theo-close",
      course: "theology",
      key: "closing",
      label: "New Jerusalem",
      moment: "Revelation 21–22",
      match: /new Jerusalem/i,
      fallback: "2027-05-25",
      labelLow: true
    },

    {
      id: "lit-dante",
      course: "literature",
      key: "dante",
      label: "Finish Dante",
      moment: "Finish Paradiso",
      match: /^DANTE, PARADISO$/i,
      field: "unit",
      occurrence: "last",
      fallback: "2026-12-01"
    },
    {
      id: "lit-spain",
      course: "literature",
      key: "spain",
      label: "Don Quixote",
      moment: "Don Quixote, Part II",
      match: /QUIZ — Part II so far/i,
      fallback: "2027-02-09",
      labelLow: true
    },
    {
      id: "lit-lepanto",
      course: "literature",
      key: "lepanto",
      label: "Lepanto poem",
      moment: "Finish Chesterton’s Lepanto",
      match: /QUIZ — Lepanto/i,
      fallback: "2027-03-11"
    },
    {
      id: "lit-more",
      course: "literature",
      key: "more",
      label: "More’s choice",
      moment: "Finish A Man for All Seasons",
      match: /QUOTE-ID QUIZ — A Man for All Seasons/i,
      fallback: "2027-04-08",
      labelLow: true
    },
    {
      id: "lit-aquinas",
      course: "literature",
      key: "aquinas",
      label: "Aquinas",
      moment: "Begin Chesterton’s St. Thomas Aquinas",
      match: /^CHESTERTON, ST\. THOMAS AQUINAS$/i,
      field: "unit",
      occurrence: 0,
      fallback: "2027-05-13"
    },
    {
      id: "lit-close",
      course: "literature",
      key: "closing",
      label: "Final review",
      moment: "Final course review",
      match: /Making Connections — the year in one hour/i,
      fallback: "2027-06-04",
      labelLow: true
    },

    {
      id: "choir-vision",
      course: "choir",
      key: "vision",
      label: "Vision Dinner",
      moment: "The first public performance",
      match: /PERFORMANCE: Vision Dinner/i,
      fallback: "2026-11-07",
      dateOverride: "2026-11-07"
    },
    {
      id: "choir-advent",
      course: "choir",
      key: "advent",
      label: "Advent concerts",
      moment: "Festival of Lessons and Carols",
      match: /PERFORMANCES Wed & Thu evenings, Dec 16–17/i,
      fallback: "2026-12-16",
      dateOverride: "2026-12-16",
      labelLow: true
    },
    {
      id: "choir-spring",
      course: "choir",
      key: "spring",
      label: "Spring Festival",
      moment: "Spring Festival of the Arts",
      match: /PERFORMANCES Wed & Thu evenings, Apr 28–29/i,
      fallback: "2027-04-28",
      dateOverride: "2027-04-28"
    },
    {
      id: "choir-close",
      course: "choir",
      key: "closing",
      label: "Graduation Mass",
      moment: "Graduation Mass",
      match: /PERFORMANCE: Graduation Mass/i,
      fallback: "2027-06-02",
      dateOverride: "2027-06-02",
      labelLow: true
    }
  ];

  const DETAILS = {
    aquinas: {
      type: "Same person",
      title: "Aquinas in September and May",
      summary: "History begins with Aquinas’s Prayer Before Study. Literature reads Chesterton’s St. Thomas Aquinas in May.",
      student: "What do the prayer and Chesterton’s book show you about Aquinas?",
      family: "What did you know about Aquinas before this year? What do you know now?",
      historical: true
    },
    dante: {
      type: "Course crossover",
      title: "Dante in Literature and History",
      summary: "Literature finishes Dante’s Comedy on December 1. History studies Dante, Petrarch, and Boccaccio on December 11 during the Renaissance unit.",
      student: "What does History help you understand about Dante’s Comedy?",
      family: "What did you learn about Dante from each class?",
      historical: true
    },
    advent: {
      type: "Same time of year",
      title: "John’s Prologue and the Advent concerts",
      summary: "Theology begins John with John 1:1–18 on November 24. Choir prepares the Festival of Lessons and Carols during the same weeks.",
      student: "Find one idea from John 1:1–18 that also appears in an Advent song.",
      family: "Did anything in the concert remind you of John’s Gospel?",
      historical: false
    },
    spain: {
      type: "History and literature",
      title: "Don Quixote and Spain",
      summary: "During the Don Quixote unit, History covers the Catholic Monarchs, Spanish unification, exploration, and the Habsburg–Ottoman rivalry.",
      student: "Which parts of Spain’s history help explain why Don Quixote feels out of place?",
      family: "What has changed in Spain between the old chivalric stories and Don Quixote’s world?",
      historical: true
    },
    lepanto: {
      type: "Course crossover",
      title: "Lepanto in Literature and History",
      summary: "Literature finishes Chesterton’s poem on March 11. History teaches the battle on March 12. Students return to it in May for the fleet game.",
      student: "After reading the poem and studying the battle, list one thing each source helps you understand.",
      family: "How was the poem different from the History lesson?",
      historical: true
    },
    more: {
      type: "Course crossover",
      title: "Thomas More in Literature and History",
      summary: "Literature finishes Robert Bolt’s play about Thomas More on April 8. History studies More, Cromwell, and the Act of Supremacy on April 13.",
      student: "Which parts of Bolt’s play are supported by History? Which parts are dramatic interpretation?",
      family: "Why does More refuse to take the oath?",
      historical: true
    },
    closing: {
      type: "End-of-year connection",
      title: "Reviewing the whole year",
      summary: "History reviews 1100–1571. Theology finishes Revelation and the capstone. Literature reviews the year after Aquinas. Choir sings at Graduation Mass.",
      student: "Choose one person, text, event, or piece of music that connects at least two classes.",
      family: "Which connection between classes was most useful this year?",
      historical: false
    },
    vision: {
      type: "Choir performance",
      title: "Vision Dinner",
      summary: "Vision Dinner is Choir’s first public performance. It follows several weeks of placement, section work, memorization, and rehearsal.",
      student: "What changed most between the first rehearsal and the performance?",
      family: "What part of the performance sounded strongest?",
      historical: false
    },
    spring: {
      type: "Choir performance",
      title: "Spring Festival",
      summary: "Choir performs at Spring Festival on April 28 and 29 after working on the repertoire throughout the spring.",
      student: "What does your section need to do for the whole choir to sound better?",
      family: "Which musical detail did you notice during the performance?",
      historical: false
    }
  };

  const axis = document.getElementById("year-axis");
  const lanes = document.getElementById("thread-lanes");
  const map = document.getElementById("thread-map");
  const links = document.getElementById("thread-links");
  const updated = document.getElementById("year-updated");
  const detail = {
    type: document.getElementById("detail-type"),
    title: document.getElementById("detail-title"),
    date: document.getElementById("detail-date"),
    summary: document.getElementById("detail-summary"),
    moments: document.getElementById("connected-moments"),
    student: document.getElementById("student-prompt"),
    family: document.getElementById("family-prompt"),
    link: document.getElementById("detail-link")
  };

  const startMs = parseDate(SCHOOL_START);
  const endMs = parseDate(SCHOOL_END);
  let anchors = [];
  let selectedId = "lit-dante";

  function parseDate(value) {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  }

  function pct(value) {
    const raw = ((parseDate(value) - startMs) / (endMs - startMs)) * 100;
    return Math.max(0, Math.min(100, raw));
  }

  function midpoint(start, end) {
    return new Date((parseDate(start) + parseDate(end)) / 2).toISOString().slice(0, 10);
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(parseDate(value)));
  }

  function formatGenerated(value) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(parseDate(value)));
  }

  function rowDate(row) {
    return row.date || row.start || null;
  }

  function rowText(row, field) {
    if (field) return String(row[field] || "");
    return [row.unit, row.inclass, row.due, row.focus, row.notes]
      .filter(Boolean)
      .join(" ");
  }

  function resolveAnchors(schedule) {
    return ANCHOR_CONFIG.map((config) => {
      const rows = schedule?.[config.course]?.rows || [];
      const matches = rows.filter((row) => config.match.test(rowText(row, config.field)));
      let row = null;
      if (matches.length) {
        row = config.occurrence === "last"
          ? matches[matches.length - 1]
          : matches[Number.isInteger(config.occurrence) ? config.occurrence : 0];
      }
      const date = config.dateOverride || rowDate(row || {}) || config.fallback;
      return { ...config, date };
    });
  }

  function renderAxis() {
    axis.textContent = "";
    MONTHS.forEach(([start, end, label]) => {
      const month = document.createElement("span");
      month.className = "axis-month";
      month.style.left = `${pct(midpoint(start, end))}%`;
      month.textContent = label;
      axis.appendChild(month);
    });
  }

  function renderLanes() {
    lanes.textContent = "";
    Object.entries(COURSES).forEach(([course, courseInfo]) => {
      const lane = document.createElement("section");
      lane.className = `thread-lane ${course}`;
      lane.setAttribute("aria-labelledby", `lane-${course}`);

      const label = document.createElement("div");
      label.className = "lane-label";
      const strong = document.createElement("strong");
      strong.id = `lane-${course}`;
      strong.textContent = courseInfo.title;
      const subtitle = document.createElement("span");
      subtitle.textContent = courseInfo.subtitle;
      label.append(strong, subtitle);

      const track = document.createElement("div");
      track.className = "lane-track";

      MONTHS.slice(1).forEach(([start]) => {
        const tick = document.createElement("span");
        tick.className = "month-tick";
        tick.style.left = `${pct(start)}%`;
        tick.setAttribute("aria-hidden", "true");
        track.appendChild(tick);
      });

      SEGMENTS[course].forEach(([start, end, name]) => {
        const segment = document.createElement("span");
        const left = pct(start);
        const width = Math.max(0.6, pct(end) - left);
        segment.className = "lane-segment";
        segment.style.left = `${left}%`;
        segment.style.width = `${width}%`;
        segment.title = `${name}: ${formatDate(start)}–${formatDate(end)}`;
        segment.setAttribute("aria-label", segment.title);
        if (width >= 5.8) segment.textContent = name;
        track.appendChild(segment);
      });

      anchors
        .filter((anchor) => anchor.course === course)
        .sort((a, b) => parseDate(a.date) - parseDate(b.date))
        .forEach((anchor) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = `thread-anchor is-knot${anchor.labelLow ? " label-low" : ""}`;
          button.id = `anchor-${anchor.id}`;
          button.dataset.anchorId = anchor.id;
          button.dataset.key = anchor.key;
          button.style.left = `${pct(anchor.date)}%`;
          button.setAttribute("aria-pressed", "false");
          button.setAttribute("aria-label", `${COURSES[course].title}: ${anchor.label}, ${formatDate(anchor.date)}`);

          const anchorLabel = document.createElement("span");
          anchorLabel.className = "anchor-label";
          anchorLabel.textContent = anchor.label;
          button.appendChild(anchorLabel);
          button.addEventListener("click", () => selectAnchor(anchor.id));
          track.appendChild(button);
        });

      lane.append(label, track);
      lanes.appendChild(lane);
    });
  }

  function renderMoments(related) {
    detail.moments.textContent = "";
    related
      .slice()
      .sort((a, b) => parseDate(a.date) - parseDate(b.date))
      .forEach((anchor) => {
        const item = document.createElement("div");
        item.className = `connected-moment ${anchor.course}`;

        const course = document.createElement("p");
        course.className = "moment-course";
        course.textContent = COURSES[anchor.course].title;

        const moment = document.createElement("p");
        moment.className = "moment-title";
        moment.append(document.createTextNode(`${anchor.moment} `));
        const date = document.createElement("span");
        date.className = "moment-date";
        date.textContent = `· ${formatDate(anchor.date)}`;
        moment.appendChild(date);

        item.append(course, moment);
        detail.moments.appendChild(item);
      });
  }

  function renderDetail(anchor, related) {
    const info = DETAILS[anchor.key];
    const dates = related.map((item) => item.date).sort();
    detail.type.textContent = info.type;
    detail.title.textContent = info.title;
    detail.date.textContent = dates.length === 1
      ? formatDate(dates[0])
      : `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`;
    detail.summary.textContent = info.summary;
    detail.student.textContent = info.student;
    detail.family.textContent = info.family;
    detail.link.hidden = !info.historical;
    renderMoments(related);
  }

  function selectAnchor(id) {
    const anchor = anchors.find((item) => item.id === id) || anchors[0];
    if (!anchor) return;
    selectedId = anchor.id;
    const related = anchors.filter((item) => item.key === anchor.key);

    document.querySelectorAll(".thread-anchor").forEach((button) => {
      const isSelected = button.dataset.anchorId === anchor.id;
      const isRelated = button.dataset.key === anchor.key;
      button.classList.toggle("is-selected", isSelected);
      button.classList.toggle("is-related", isRelated);
      button.classList.toggle("is-dimmed", !isRelated);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    renderDetail(anchor, related);
    requestAnimationFrame(drawConnections);
  }

  function drawConnections() {
    links.textContent = "";
    if (window.matchMedia("(max-width: 760px)").matches) return;

    const selected = anchors.find((item) => item.id === selectedId);
    if (!selected) return;
    const related = anchors.filter((item) => item.key === selected.key);
    if (related.length < 2) return;

    const mapRect = map.getBoundingClientRect();
    links.setAttribute("viewBox", `0 0 ${mapRect.width} ${mapRect.height}`);
    const source = document.getElementById(`anchor-${selected.id}`)?.getBoundingClientRect();
    if (!source) return;
    const sx = source.left + source.width / 2 - mapRect.left;
    const sy = source.top + source.height / 2 - mapRect.top;

    related.filter((item) => item.id !== selected.id).forEach((item) => {
      const target = document.getElementById(`anchor-${item.id}`)?.getBoundingClientRect();
      if (!target) return;
      const tx = target.left + target.width / 2 - mapRect.left;
      const ty = target.top + target.height / 2 - mapRect.top;
      const bend = Math.max(34, Math.abs(tx - sx) * 0.42);
      const direction = tx >= sx ? 1 : -1;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${sx} ${sy} C ${sx + bend * direction} ${sy}, ${tx - bend * direction} ${ty}, ${tx} ${ty}`);
      links.appendChild(path);
    });
  }

  async function loadSchedule() {
    try {
      const response = await fetch("data/upcoming.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Schedule unavailable");
      return await response.json();
    } catch (_error) {
      return null;
    }
  }

  async function init() {
    const schedule = await loadSchedule();
    if (schedule?.generated) {
      updated.textContent = `Schedule updated ${formatGenerated(schedule.generated)}`;
    } else {
      updated.textContent = "2026–27 course calendars";
    }

    anchors = resolveAnchors(schedule);
    renderAxis();
    renderLanes();

    const requestedKey = window.location.hash.slice(1);
    const requested = anchors.find((item) => item.key === requestedKey);
    selectAnchor(requested?.id || selectedId);

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => requestAnimationFrame(drawConnections)).observe(map);
    } else {
      window.addEventListener("resize", drawConnections, { passive: true });
    }
  }

  init();
})();
