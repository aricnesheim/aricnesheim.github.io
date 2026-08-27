/* Theology 10 Reading Companion — scene-by-scene Catholic commentary.
   Codex/GPT work product — Aug. 27, 2026. */

(function () {
  "use strict";

  const registry = window.THEOLOGY_READING_COMPANION_REGISTRY || {};
  const sourceCatalog = window.THEOLOGY_READING_COMPANION_SOURCES || { references: {} };
  const guides = Array.isArray(registry.guides)
    ? registry.guides
    : (window.THEOLOGY_READING_COMPANION ? [window.THEOLOGY_READING_COMPANION] : []);

  const guideSelect = document.getElementById("guide-select");
  const eyebrow = document.getElementById("companion-eyebrow");
  const assignmentRead = document.getElementById("assignment-read");
  const assignmentAnnotate = document.getElementById("assignment-annotate");
  const assignmentNote = document.getElementById("assignment-note");
  const sceneNav = document.getElementById("scene-nav");
  const mapCount = document.getElementById("scene-map-count");
  const sceneCard = document.getElementById("scene-card");
  const progressFill = document.getElementById("scene-progress-fill");
  const sceneNumber = document.getElementById("scene-number");
  const sceneReference = document.getElementById("scene-reference");
  const sceneTitle = document.getElementById("scene-title");
  const recallPrompt = document.getElementById("recall-prompt");
  const readFirst = document.getElementById("read-first");
  const openCommentary = document.getElementById("open-commentary");
  const commentary = document.getElementById("commentary");
  const summaryText = document.getElementById("summary-text");
  const noticeText = document.getElementById("notice-text");
  const pericopeText = document.getElementById("pericope-text");
  const pericopeReference = document.getElementById("pericope-reference");
  const pericopeTab = document.getElementById("tab-pericope");
  const connectionList = document.getElementById("connection-list");
  const previousScene = document.getElementById("previous-scene");
  const nextScene = document.getElementById("next-scene");
  const scenePosition = document.getElementById("scene-position");
  const live = document.getElementById("companion-live");
  const tabs = Array.from(document.querySelectorAll(".commentary-tab"));
  const panels = Array.from(document.querySelectorAll(".commentary-panel"));

  let guideIndex = 0;
  let guide = guides[0] || {};
  let scenes = Array.isArray(guide.scenes) ? guide.scenes : [];
  let sceneIndex = 0;
  let activePanel = "summary";
  let revealed = false;

  function announce(message) {
    live.textContent = "";
    window.setTimeout(function () { live.textContent = message; }, 10);
  }

  function sourceLinksFor(reference) {
    const references = sourceCatalog.references || {};
    return Array.isArray(references[reference]) ? references[reference] : [];
  }

  function createSourceLink(source) {
    const link = document.createElement("a");
    link.className = "source-link";
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = source.label;
    link.setAttribute("aria-label", source.label + " (opens in a new tab)");
    return link;
  }

  function renderLinkedReference(container, reference) {
    const lookBackPrefix = "Look back: ";
    const hasLookBackPrefix = reference.indexOf(lookBackPrefix) === 0;
    const catalogKey = hasLookBackPrefix ? reference.slice(lookBackPrefix.length) : reference;
    const sources = sourceLinksFor(catalogKey);
    container.textContent = "";

    if (!sources.length) {
      container.textContent = reference;
      return;
    }

    if (hasLookBackPrefix) {
      const prefix = document.createElement("span");
      prefix.textContent = lookBackPrefix;
      container.appendChild(prefix);
    }

    sources.forEach(function (source, index) {
      if (index > 0) {
        const separator = document.createElement("span");
        separator.className = "source-separator";
        separator.setAttribute("aria-hidden", "true");
        separator.textContent = " · ";
        container.appendChild(separator);
      }
      container.appendChild(createSourceLink(source));
    });
  }

  function renderGuideOptions() {
    guideSelect.textContent = "";
    guides.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.choiceLabel || item.companionReading || item.fullReading;
      guideSelect.appendChild(option);
    });
  }

  function updateGuideCopy() {
    guideSelect.value = guide.id;
    eyebrow.textContent = guide.companionReading + " · due " + (guide.dueLabel || guide.dueDate || "see assignment");
    renderLinkedReference(assignmentRead, guide.fullReading);
    renderLinkedReference(assignmentAnnotate, guide.annotatedFocus);
    assignmentNote.textContent = guide.companionNote
      || ("This companion covers " + guide.companionReading + " and does not redo the annotated pericope.");
    pericopeTab.textContent = "Back to " + guide.annotatedFocus.replace(/^Matthew\s+/, "");
    document.title = guide.companionReading + " · Catholic Reading Companion · Theology 10";
  }

  function updateLocation() {
    const scene = scenes[sceneIndex];
    if (!guide.id || !scene) return;
    const url = new URL(window.location.href);
    url.searchParams.set("guide", guide.id);
    url.hash = scene.id;
    window.history.replaceState(null, "", url.href);
  }

  function renderNavigation() {
    sceneNav.textContent = "";
    scenes.forEach(function (scene, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "scene-nav-button";
      button.setAttribute("aria-current", index === sceneIndex ? "step" : "false");

      const number = document.createElement("span");
      number.className = "scene-nav-number";
      number.textContent = String(index + 1);
      const title = document.createElement("span");
      title.className = "scene-nav-title";
      title.textContent = scene.shortTitle;
      const reference = document.createElement("span");
      reference.className = "scene-nav-reference";
      reference.textContent = scene.reference.replace("Matthew ", "");
      button.append(number, title, reference);

      button.addEventListener("click", function () {
        selectScene(index, true);
      });
      sceneNav.appendChild(button);
    });
  }

  function renderConnections(scene) {
    const connections = Array.isArray(scene.connections) ? scene.connections : [];
    connectionList.textContent = "";
    connections.forEach(function (connection) {
      const item = document.createElement("article");
      item.className = "connection-item";
      const badge = document.createElement("span");
      badge.className = "connection-badge";
      badge.textContent = connection.kind;
      const copy = document.createElement("div");
      copy.className = "connection-copy";
      const text = document.createElement("p");
      text.textContent = connection.text;
      const reference = document.createElement("p");
      reference.className = "connection-ref";
      renderLinkedReference(reference, connection.ref);
      copy.append(text, reference);
      item.append(badge, copy);
      connectionList.appendChild(item);
    });
  }

  function selectPanel(panelName, focusTab) {
    activePanel = panelName;
    tabs.forEach(function (tab) {
      const selected = tab.dataset.panel === panelName;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.id !== "panel-" + panelName;
    });
  }

  function renderScene(focusCard) {
    const scene = scenes[sceneIndex];
    if (!scene) return;

    sceneNumber.textContent = String(sceneIndex + 1);
    renderLinkedReference(sceneReference, scene.reference);
    sceneTitle.textContent = scene.title;
    recallPrompt.textContent = scene.recall;
    summaryText.textContent = scene.summary;
    noticeText.textContent = scene.notice;
    pericopeText.textContent = scene.pericope;
    renderLinkedReference(pericopeReference, scene.pericopeReference);
    renderConnections(scene);

    revealed = false;
    readFirst.hidden = false;
    commentary.hidden = true;
    openCommentary.setAttribute("aria-expanded", "false");
    selectPanel("summary", false);

    progressFill.style.width = (((sceneIndex + 1) / scenes.length) * 100) + "%";
    mapCount.textContent = (sceneIndex + 1) + " of " + scenes.length;
    scenePosition.textContent = "Scene " + (sceneIndex + 1) + " of " + scenes.length;
    previousScene.disabled = sceneIndex === 0;
    nextScene.disabled = sceneIndex === scenes.length - 1;
    nextScene.textContent = sceneIndex === scenes.length - 1 ? "End of reading" : "Next scene →";
    renderNavigation();
    updateLocation();
    if (focusCard) sceneCard.focus();
  }

  function loadGuide(index, initialSceneIndex, focusCard, announceChange) {
    if (index < 0 || index >= guides.length) return;
    guideIndex = index;
    guide = guides[guideIndex];
    scenes = Array.isArray(guide.scenes) ? guide.scenes : [];
    sceneIndex = initialSceneIndex >= 0 && initialSceneIndex < scenes.length ? initialSceneIndex : 0;
    updateGuideCopy();

    if (!scenes.length) {
      recallPrompt.textContent = "This reading guide could not be loaded.";
      openCommentary.disabled = true;
      previousScene.disabled = true;
      nextScene.disabled = true;
      return;
    }

    openCommentary.disabled = false;
    renderScene(focusCard);
    if (announceChange) {
      announce("Loaded " + guide.fullReading + ". Scene 1: " + scenes[0].title + ".");
    }
  }

  function selectScene(index, focusCard) {
    if (index < 0 || index >= scenes.length) return;
    sceneIndex = index;
    renderScene(focusCard);
    announce("Scene " + (sceneIndex + 1) + ": " + scenes[sceneIndex].title + ". Read before opening the commentary.");
  }

  function revealCommentary() {
    revealed = true;
    readFirst.hidden = true;
    commentary.hidden = false;
    openCommentary.setAttribute("aria-expanded", "true");
    selectPanel("summary", false);
    document.getElementById("tab-summary").focus();
    announce("Commentary opened. Summary selected.");
  }

  openCommentary.addEventListener("click", revealCommentary);
  previousScene.addEventListener("click", function () { selectScene(sceneIndex - 1, true); });
  nextScene.addEventListener("click", function () { selectScene(sceneIndex + 1, true); });
  guideSelect.addEventListener("change", function () {
    const nextGuideIndex = guides.findIndex(function (item) { return item.id === guideSelect.value; });
    loadGuide(nextGuideIndex, 0, false, true);
  });

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { selectPanel(tab.dataset.panel, false); });
    tab.addEventListener("keydown", function (event) {
      const current = tabs.indexOf(tab);
      let next = current;
      if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectPanel(tabs[next].dataset.panel, true);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const interactiveTarget = event.target instanceof Element
      ? event.target.closest("a, button, input, textarea, select, [contenteditable='true']")
      : null;
    if (interactiveTarget) return;
    if (!revealed && (event.key === "Enter" || event.key === " ")) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectScene(sceneIndex + 1, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectScene(sceneIndex - 1, true);
    } else if (revealed && /^[1-3]$/.test(event.key)) {
      event.preventDefault();
      selectPanel(tabs[Number(event.key) - 1].dataset.panel, true);
    }
  });

  if (!guides.length) {
    recallPrompt.textContent = "The commentary could not be loaded.";
    guideSelect.disabled = true;
    openCommentary.disabled = true;
    previousScene.disabled = true;
    nextScene.disabled = true;
    return;
  }

  renderGuideOptions();

  const requestedGuideId = new URLSearchParams(window.location.search).get("guide");
  const requestedSceneId = window.location.hash.replace(/^#/, "");
  let initialGuideIndex = guides.findIndex(function (item) { return item.id === requestedGuideId; });

  if (initialGuideIndex < 0 && requestedSceneId) {
    initialGuideIndex = guides.findIndex(function (item) {
      const itemScenes = Array.isArray(item.scenes) ? item.scenes : [];
      return itemScenes.some(function (scene) { return scene.id === requestedSceneId; });
    });
  }
  if (initialGuideIndex < 0) {
    initialGuideIndex = guides.findIndex(function (item) { return item.id === registry.defaultId; });
  }
  if (initialGuideIndex < 0) initialGuideIndex = 0;

  const initialScenes = Array.isArray(guides[initialGuideIndex].scenes)
    ? guides[initialGuideIndex].scenes
    : [];
  const initialSceneIndex = initialScenes.findIndex(function (scene) { return scene.id === requestedSceneId; });
  loadGuide(initialGuideIndex, initialSceneIndex, false, false);
})();
