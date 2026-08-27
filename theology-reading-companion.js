/* Theology 10 Reading Companion — scene-by-scene commentary.
   Codex/GPT work product — Aug. 26, 2026. */

(function () {
  "use strict";

  const guide = window.THEOLOGY_READING_COMPANION || { scenes: [] };
  const scenes = guide.scenes;

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
  const connectionList = document.getElementById("connection-list");
  const previousScene = document.getElementById("previous-scene");
  const nextScene = document.getElementById("next-scene");
  const scenePosition = document.getElementById("scene-position");
  const live = document.getElementById("companion-live");
  const tabs = Array.from(document.querySelectorAll(".commentary-tab"));
  const panels = Array.from(document.querySelectorAll(".commentary-panel"));

  let sceneIndex = 0;
  let activePanel = "summary";
  let revealed = false;

  function announce(message) {
    live.textContent = "";
    window.setTimeout(function () { live.textContent = message; }, 10);
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
    connectionList.textContent = "";
    scene.connections.forEach(function (connection) {
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
      reference.textContent = connection.ref;
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
    sceneNumber.textContent = String(sceneIndex + 1);
    sceneReference.textContent = scene.reference;
    sceneTitle.textContent = scene.title;
    recallPrompt.textContent = scene.recall;
    summaryText.textContent = scene.summary;
    noticeText.textContent = scene.notice;
    pericopeText.textContent = scene.pericope;
    pericopeReference.textContent = scene.pericopeReference;
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

    if (window.location.hash !== "#" + scene.id) {
      window.history.replaceState(null, "", "#" + scene.id);
    }
    if (focusCard) sceneCard.focus();
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

  if (!scenes.length) {
    document.getElementById("recall-prompt").textContent = "The commentary could not be loaded.";
    openCommentary.disabled = true;
    previousScene.disabled = true;
    nextScene.disabled = true;
    return;
  }

  const hashIndex = scenes.findIndex(function (scene) {
    return window.location.hash === "#" + scene.id;
  });
  sceneIndex = hashIndex >= 0 ? hashIndex : 0;
  renderScene(false);
})();
