/* history-spain.js — The Reconquista, History 11 Unit 2.
   No dependencies. Every widget degrades to readable text if this never runs.
   Content spine: CSN Lecture Notes 3.0 §Iberian Kingdoms and Units & Lesson
   Plans 3.0, Days 7–12; the source is binder pp. 19–24. Map eras are teaching
   approximations drawn on modern provinces, and say so on the page. */

(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function open(el)  { if (el) el.classList.add("open"); }
  function shut(el)  { if (el) el.classList.remove("open"); }

  /* ---------------------------------------------------------- popovers */

  function anchorFor(btn) {
    var n = btn.parentNode;
    while (n && n !== document.body) {
      if (/^(P|DD|LI|DIV)$/.test(n.nodeName) && !n.classList.contains("gl-pop")) return n;
      n = n.parentNode;
    }
    return btn;
  }

  function bindDefs(root) {
    $$("[data-def]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        var existing = btn._pop;
        if (isOpen) {
          if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
          btn._pop = null;
          btn.setAttribute("aria-expanded", "false");
          return;
        }
        var pop = document.createElement("span");
        pop.className = "gl-pop";
        pop.innerHTML = "<b>" + btn.textContent.trim() + ".</b> " + btn.getAttribute("data-def");
        var host = anchorFor(btn);
        host.parentNode.insertBefore(pop, host.nextSibling);
        btn._pop = pop;
        btn.setAttribute("aria-expanded", "true");
      });
    });
  }
  bindDefs(document);

  /* ------------------------------------------------------ 1. the scrap */

  (function () {
    var wrap = $("#sp-opts"), verdict = $("#sp-verdict");
    if (!wrap) return;
    $$(".gl-opt", wrap).forEach(function (b) {
      b.addEventListener("click", function () {
        var w = b.getAttribute("data-win");
        b.classList.add("tried");
        if (w === "true") { b.classList.add("win"); open(verdict); }
        else if (w === "ask") { b.classList.add("ask"); }
      });
    });
  })();

  /* ----------------------------------------------- 2. layers (accordion) */

  function accordion(rootSel, btnSel, bodyAttr) {
    var root = $(rootSel);
    if (!root) return;
    $$(btnSel, root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-k");
        var body = root.querySelector("[" + bodyAttr + '="' + key + '"]');
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        $$(btnSel, root).forEach(function (o) { o.setAttribute("aria-expanded", "false"); });
        $$("[" + bodyAttr + "]", root).forEach(shut);
        if (!isOpen) { btn.setAttribute("aria-expanded", "true"); open(body); }
      });
    });
  }
  accordion("#sp-layers", ".sp-step", "data-body");
  accordion("#sp-kings", ".gl-type-btn", "data-body");
  accordion("#sp-dates", ".sp-date", "data-body");

  /* --------------------------------------------------------- 3. the map */

  var OWN = {
    hold: { n: "Christian holdouts in the mountains", c: "#d97706" },
    ast:  { n: "Asturias", c: "#d97706" },
    leon: { n: "León", c: "#b45309" },
    cas:  { n: "Castile", c: "#b91c1c" },
    lc:   { n: "León and Castile, one crown", c: "#b91c1c" },
    esp:  { n: "Spain: Castile and Aragon under Ferdinand and Isabella", c: "#991b1b" },
    nav:  { n: "Navarre", c: "#7c3aed" },
    bas:  { n: "Basques, never governed", c: "#64748b" },
    ara:  { n: "Aragon", c: "#eab308" },
    cat:  { n: "Spanish March: Frankish counties, Barcelona", c: "#0f766e" },
    por:  { n: "Portugal", c: "#1d4ed8" },
    and:  { n: "al-Andalus", c: "#15803d" },
    tai:  { n: "Taifa kingdoms", c: "#65a30d" },
    alm:  { n: "Almoravids, then Almohads", c: "#065f46" },
    gra:  { n: "Emirate of Granada", c: "#16a34a" },
    cid:  { n: "El Cid's Valencia", c: "#db2777" }
  };

  var G = {
    galicia: ["es-la-coruna", "es-lugo", "es-orense", "es-pontevedra"],
    astcan:  ["es-asturias", "es-cantabria"],
    basq:    ["es-bizkaia", "es-gipuzkoa"],
    ptN:     ["pt-viana-do-castelo", "pt-braga", "pt-porto", "pt-vila-real", "pt-braganca"],
    ptC:     ["pt-aveiro", "pt-viseu", "pt-guarda", "pt-coimbra"],
    ptL:     ["pt-leiria", "pt-santarem", "pt-lisboa"],
    ptS:     ["pt-setubal", "pt-evora", "pt-beja", "pt-faro", "pt-portalegre", "pt-castelo-branco"],
    cat:     ["es-gerona", "es-barcelona"],
    catS:    ["es-lerida", "es-tarragona"],
    val:     ["es-valencia", "es-castellon"],
    gran:    ["es-granada", "es-malaga", "es-almeria"],
    meseta:  ["es-segovia", "es-avila", "es-salamanca", "es-madrid", "es-toledo", "es-guadalajara"],
    duero:   ["es-zamora", "es-palencia", "es-valladolid", "es-burgos", "es-soria"],
    aragon:  ["es-huesca", "es-zaragoza", "es-teruel"]
  };
  function u() { var out = []; for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; out = out.concat(Array.isArray(a) ? a : G[a] || [a]); } return out; }

  /* Each stage: year shown, title, default owner, then owner assignments in
     order (later ones win), a label override per owner where the name changed,
     the note read aloud, and the sites starred that year. */
  var STAGES = [
    { y: 711, t: "Guadalete, and the conquest", base: "and",
      set: [["hold", u("astcan")], ["bas", u("basq")]],
      lab: { and: "al-Andalus: the Umayyad conquest, 711–718" },
      sites: [["guadalete", "Guadalete, 711"]],
      note: "Tariq ibn Ziyad crosses from Africa in 711 and defeats King Roderic, the last Visigothic king, at the Guadalete. Within seven years al-Andalus reaches the Pyrenees. A few hundred square miles of mountain in Asturias do not submit, and the Basques, whom nobody had ever governed, do not either." },
    { y: 722, t: "Covadonga", base: "and",
      set: [["ast", u("astcan")], ["bas", u("basq")]],
      lab: { and: "al-Andalus: the Umayyad conquest", ast: "Asturias under Pelayo" },
      sites: [["covadonga", "Covadonga, c. 722", 46]],
      note: "Pelayo, captured once and escaped, is elected war chief by the men who fled into the mountains. About 722 he beats a punitive column at Covadonga. The traditional first day of the Reconquista." },
    { y: 750, t: "Alfonso I, and the empty frontier", base: "and",
      set: [["ast", u("astcan", "galicia", "es-leon")], ["bas", u("basq")]],
      lab: { and: "al-Andalus, torn by Berber revolt (740s)" },
      sites: [["cordoba", "Emirate of Córdoba, 756"]],
      note: "Alfonso I (739–757), Pelayo's son-in-law, takes Galicia and raids the Duero valley until it is empty: a wide no-man's-land between the two worlds. In 750 the Umayyads lose Damascus; one fugitive prince, Abd al-Rahman, reaches Iberia and makes Córdoba the seat of his own emirate (756)." },
    { y: 830, t: "Pamplona, Aragon, the Frankish March", base: "and",
      set: [["ast", u("astcan", "galicia", "es-leon", "es-alava")], ["bas", u("basq")], ["nav", ["es-navarra"]], ["ara", ["es-huesca"]], ["cat", u("cat")]],
      lab: { and: "Emirate of Córdoba", nav: "Kingdom of Pamplona (Navarre), 824", ara: "County of Aragon" },
      sites: [["roncevaux", "Roncevaux, 824"]],
      note: "The edges fill in. Charlemagne's Franks take Girona (785) and Barcelona (801) and hold the Pyrenean counties: the Spanish March. The Basque chieftain Íñigo Arista beats a Frankish army at Roncevaux (824) and founds the kingdom of Pamplona, which becomes Navarre. Aragon begins as a county in the high valleys." },
    { y: 900, t: "The push to the Duero", base: "and",
      set: [["ast", u("astcan", "galicia", "es-leon", "es-zamora", "es-palencia", "es-burgos", "es-alava", "ptN")], ["bas", u("basq")], ["nav", ["es-navarra"]], ["ara", ["es-huesca"]], ["cat", u("cat")]],
      lab: { and: "Emirate of Córdoba (a caliphate from 929)", ast: "Asturias, soon León; Castile is its frontier county" },
      sites: [["porto", "Porto, 868"]],
      note: "Alfonso III the Great (866–910) pushes the frontier to the Duero: Porto (868), Burgos (884), Zamora (893). Castile begins as the county of castles on the eastern frontier; Portugal as the county of Portucale in the west (founded by Vímara Peres in the 860s). After Alfonso's death the kingdom is re-centred on the city of León (924)." },
    { y: 1000, t: "The Caliphate at its height", base: "and",
      set: [["leon", u("astcan", "galicia", "es-leon", "es-zamora", "es-palencia", "es-valladolid", "ptN")], ["cas", ["es-burgos"]], ["nav", u("es-navarra", "es-la-rioja", "basq", "es-alava")], ["ara", ["es-huesca"]], ["cat", u("cat")]],
      lab: { and: "Caliphate of Córdoba (929–1031)", cas: "County of Castile", ara: "County of Aragon", nav: "Navarre under Sancho III the Great" },
      sites: [["santiago", "Santiago sacked, 997"]],
      note: "Córdoba is the richest city in Europe and its ruler calls himself caliph. Almanzor (al-Mansur) raids the Christian north every summer and in 997 sacks Santiago de Compostela, sparing the Apostle's tomb. In the north Sancho III the Great of Navarre (1004–1035) comes to dominate León and Castile too." },
    { y: 1035, t: "The caliphate shatters: the taifas", base: "tai",
      set: [["leon", u("astcan", "galicia", "es-leon", "es-zamora", "ptN")], ["cas", u("es-burgos", "es-palencia", "es-valladolid", "es-soria")], ["nav", u("es-navarra", "es-la-rioja", "basq", "es-alava")], ["ara", ["es-huesca"]], ["cat", u("cat")]],
      lab: { tai: "Taifa kingdoms: Zaragoza, Toledo, Badajoz, Valencia, Denia, Murcia, Almería, Granada, Córdoba, Sevilla", cas: "Castile, a kingdom from 1035", ara: "Aragon, a kingdom from 1035" },
      sites: [["cordoba", "Caliphate collapses, 1031"]],
      note: "In 1031 the Caliphate collapses into taifas, small rival emirates that hire Christian swords and pay Christian kings for protection. Sancho the Great's sons make Castile (Ferdinand I) and Aragon (Ramiro I) kingdoms in 1035. This is the Iberia of the two lists, and the one El Cid is born into, about 1043." },
    { y: 1090, t: "El Cid's world: Toledo falls, the Almoravids land", base: "alm",
      set: [["lc", u("astcan", "galicia", "es-leon", "duero", "meseta", "es-la-rioja", "es-alava", "ptN", "ptC")], ["nav", u("es-navarra", "basq")], ["ara", ["es-huesca"]], ["cat", u("cat")], ["tai", u("es-zaragoza", "es-teruel", "catS", "es-baleares")], ["cid", u("val")]],
      lab: { lc: "León and Castile under Alfonso VI", alm: "Almoravid al-Andalus (from 1086)", tai: "Taifa of Zaragoza, still independent; Dénia-Mallorca" },
      sites: [["toledo", "Toledo, 1085"], ["sagrajas", "Sagrajas, 1086"], ["valencia", "El Cid's Valencia, 1094–1099"]],
      note: "Alfonso VI takes Toledo, the old Visigothic capital, in 1085, and the balance tips. The taifa kings call in the Almoravids, Berber puritans from Morocco, who crush Alfonso at Sagrajas (1086) and then swallow the taifas themselves, all but Zaragoza. El Cid, twice exiled, serves Zaragoza, then takes Valencia for himself (1094) and holds it until his death (1099)." },
    { y: 1150, t: "Portugal breaks away; Aragon joins Catalonia", base: "alm",
      set: [["lc", u("astcan", "galicia", "es-leon", "duero", "meseta", "es-la-rioja", "es-alava", "es-ciudad-real")], ["por", u("ptN", "ptC", "ptL")], ["nav", u("es-navarra", "basq")], ["ara", u("es-huesca", "es-zaragoza", "catS", "cat")]],
      lab: { lc: "León and Castile under Alfonso VII, 'Emperor of all Spain'", alm: "Almoravid al-Andalus, falling to the Almohads (1147)", ara: "Crown of Aragon: Aragon and Catalonia, joined 1137" },
      sites: [["lisbon", "Lisbon, 1147"], ["zaragoza", "Zaragoza, 1118"], ["calatrava", "Calatrava, 1147"]],
      note: "Afonso Henriques defeats his own mother at São Mamede (1128), wins at Ourique (1139), and takes Lisbon (1147) with crusaders bound for the Holy Land: Portugal. Aragon takes Zaragoza (1118) and joins with Catalonia (1137). Across the strait the Almohads overthrow the Almoravids and cross to Iberia (1147), stricter than the men they replaced." },
    { y: 1212, t: "Las Navas de Tolosa", base: "alm",
      set: [["cas", u("es-cantabria", "basq", "es-alava", "es-la-rioja", "duero", "meseta", "es-cuenca")], ["leon", u("es-asturias", "galicia", "es-leon", "es-zamora", "es-salamanca")], ["por", u("ptN", "ptC", "ptL", "pt-evora", "pt-castelo-branco")], ["nav", ["es-navarra"]], ["ara", u("aragon", "catS", "cat")]],
      lab: { alm: "Almohad al-Andalus", cas: "Castile under Alfonso VIII", leon: "León under Alfonso IX, who stayed home", ara: "Crown of Aragon under Peter II" },
      sites: [["navas", "Las Navas de Tolosa, 16 July 1212"]],
      note: "After the disaster at Alarcos (1195) the Christian kings even ally with Muslims against each other (1207). Then the knights of Calatrava die at Salvatierra (1209), Innocent III preaches crusade, and on 16 July 1212 Alfonso VIII of Castile, with Aragon, Navarre, and Portugal, breaks the Almohad army at Las Navas de Tolosa. León stayed home. The door to the south is open." },
    { y: 1300, t: "After the great advance", base: "cas",
      set: [["ara", u("aragon", "catS", "cat", "val", "es-alicante", "es-baleares")], ["por", u("ptN", "ptC", "ptL", "ptS")], ["nav", ["es-navarra"]], ["gra", u("gran")]],
      lab: { cas: "Castile and León, united for good (1230)", ara: "Crown of Aragon, with Valencia (1238) and Mallorca (1229)", por: "Portugal, complete to the Algarve (1249)", gra: "Emirate of Granada (Nasrid), 1238–1492" },
      sites: [["cordoba", "Córdoba, 1236"], ["valencia", "Valencia, 1238"], ["sevilla", "Seville, 1248"]],
      note: "Ferdinand III of Castile (a saint) takes Córdoba (1236), Jaén (1246), and Seville (1248); James I of Aragon, the Conqueror, takes Mallorca (1229) and Valencia (1238); Portugal reaches the Algarve (1249). Only Granada remains, paying tribute, for two hundred and fifty years. The Christian kingdoms spend most of those years fighting each other." },
    { y: 1492, t: "Granada", base: "esp",
      set: [["por", u("ptN", "ptC", "ptL", "ptS")], ["nav", ["es-navarra"]]],
      lab: { nav: "Navarre, annexed by Castile in 1512" },
      sites: [["granada", "Granada surrenders, 2 January 1492"]],
      note: "Granada surrenders on 2 January 1492. Isabella of Castile and Ferdinand of Aragon, married in 1469 and both crowned by 1479, are the Catholic Monarchs; the same year Columbus sails and the Jews are expelled. Navarre follows in 1512. Now, and only now, is there a Spain." }
  ];

  var CITIES = [
    ["oviedo", "Oviedo"], ["leon", "León"], ["burgos", "Burgos"], ["santiago", "Santiago"],
    ["pamplona", "Pamplona"], ["zaragoza", "Zaragoza"], ["barcelona", "Barcelona"], ["toledo", "Toledo"],
    ["valencia", "Valencia"], ["denia", "Dénia"], ["murcia", "Murcia"], ["almeria", "Almería"],
    ["granada", "Granada"], ["cordoba", "Córdoba"], ["sevilla", "Sevilla"], ["badajoz", "Badajoz"],
    ["lisbon", "Lisbon"], ["porto", "Porto"], ["coimbra", "Coimbra"]
  ];
  var OFF = {
    oviedo: [9, -4], leon: [9, 4], burgos: [9, 4], santiago: [0, 15], pamplona: [9, -3],
    zaragoza: [9, 4], barcelona: [9, 4], toledo: [9, 4], valencia: [9, 4], denia: [9, 4],
    murcia: [9, 4], almeria: [9, 9], granada: [9, 4], cordoba: [9, 4], sevilla: [-9, 4],
    badajoz: [-9, -6], lisbon: [-9, 4], porto: [-9, 4], coimbra: [9, 4]
  };
  var ISLAMIC_TEN = ["zaragoza", "valencia", "toledo", "badajoz", "denia", "murcia", "almeria", "granada", "cordoba", "sevilla"];
  var CHRISTIAN_SIX = { Galicia: u("galicia"), Portugal: u("ptN"), "León": u("astcan", "es-leon", "es-zamora"), Castile: u("es-burgos", "es-palencia", "es-valladolid", "es-soria"), Navarre: u("es-navarra", "es-la-rioja", "basq", "es-alava"), Aragon: ["es-huesca"] };

  (function () {
    var GEO = window.SPAIN_GEO, host = $("#sp-map");
    if (!GEO || !GEO.land || !host) return;

    var SVGNS = "http://www.w3.org/2000/svg";
    function el(tag, attrs) { var n = document.createElementNS(SVGNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

    var GW = Number(GEO.viewBox.split(" ")[2]), GH = Number(GEO.viewBox.split(" ")[3]);
    var FRAME = [30, 40, 975, 735];
    var FW = FRAME[2] - FRAME[0], FH = FRAME[3] - FRAME[1];

    var svg = el("svg", { class: "gl-map-svg", role: "img", "aria-label": "Map of the Iberian peninsula coloured by who held each region, by year" });
    svg.setAttribute("viewBox", FRAME[0] + " " + FRAME[1] + " " + FW + " " + FH);
    svg.appendChild(el("rect", { x: 0, y: 0, width: GW, height: GH, class: "gl-map-sea" }));
    var land = el("path", { d: GEO.land, class: "gl-map-land" });
    svg.appendChild(land);

    var units = {};
    var gUnits = el("g", { class: "sp-units" });
    Object.keys(GEO.units).forEach(function (id) {
      var p = el("path", { d: GEO.units[id], class: "sp-unit", "data-id": id, tabindex: "0", role: "button", "vector-effect": "non-scaling-stroke" });
      p.setAttribute("aria-label", GEO.meta[id].n);
      gUnits.appendChild(p);
      units[id] = p;
      p.addEventListener("click", function () { tell(id); });
      p.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tell(id); } });
    });
    svg.appendChild(gUnits);


    /* ---- mountain ranges: a soft band plus a chain of peaks ---- */
    var gRanges = el("g", { class: "sp-ranges" });
    svg.appendChild(gRanges);
    var rangeEls = [];
    function curveThrough(pts) {
      if (pts.length < 2) return "";
      var d = "M" + pts[0][0] + " " + pts[0][1];
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
        d += "C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + "," +
             (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + "," + p2[0] + " " + p2[1];
      }
      return d;
    }
    Object.keys(GEO.ranges || {}).forEach(function (k) {
      var pts = GEO.ranges[k];
      var band = el("path", { d: curveThrough(pts), class: "sp-range-band", "vector-effect": "non-scaling-stroke" });
      gRanges.appendChild(band);
      // peaks: one at each vertex and each midpoint
      var peaks = [];
      for (var i = 0; i < pts.length; i++) {
        peaks.push(pts[i]);
        if (i < pts.length - 1) peaks.push([(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]);
      }
      var pk = el("path", { class: "sp-range-peaks", "vector-effect": "non-scaling-stroke" });
      pk._peaks = peaks;
      gRanges.appendChild(pk);
      rangeEls.push(pk);
    });
    function peakPath(peaks, s) {
      return peaks.map(function (p) {
        return "M" + (p[0] - s).toFixed(1) + " " + (p[1] + s * 0.7).toFixed(1) + "L" + p[0].toFixed(1) + " " + (p[1] - s).toFixed(1) + "L" + (p[0] + s).toFixed(1) + " " + (p[1] + s * 0.7).toFixed(1);
      }).join("");
    }

    var gSites = el("g", { class: "sp-sites" });
    svg.appendChild(gSites);

    var dots = {};
    var gCities = el("g", { class: "sp-cities" });
    CITIES.forEach(function (c) {
      var p = GEO.pts[c[0]]; if (!p) return;
      var g = el("g", { class: "sp-city", "data-id": c[0] });
      var dot = el("circle", { cx: p[0], cy: p[1], class: "sp-dot", "vector-effect": "non-scaling-stroke" });
      var ring = el("circle", { cx: p[0], cy: p[1], class: "sp-ring", "vector-effect": "non-scaling-stroke" });
      var t = el("text", { class: "gl-map-label", "paint-order": "stroke" });
      t.textContent = c[1];
      g.appendChild(ring); g.appendChild(dot); g.appendChild(t);
      gCities.appendChild(g);
      dots[c[0]] = { g: g, dot: dot, ring: ring, t: t, p: p };
    });
    svg.appendChild(gCities);

    host.innerHTML = "";
    host.appendChild(svg);


    /* ---- names on the map: kingdom labels per era, fixed geography always ---- */
    var KLAB = [
      [["Asturias", "es-asturias", 0, 17], ["al-Andalus", "es-ciudad-real", 0, 0, "big"], ["Basques", "es-bizkaia", 0, -14]],
      [["Asturias", "es-asturias", 0, 17], ["al-Andalus", "es-ciudad-real", 0, 0, "big"], ["Basques", "es-bizkaia", 0, -14]],
      [["Asturias", "es-asturias", 0, 17], ["al-Andalus", "es-ciudad-real", 0, 0, "big"], ["Basques", "es-bizkaia", 0, -14]],
      [["Asturias", "es-asturias", 0, 17], ["Pamplona", "es-navarra", 0, 18], ["Aragon", "es-huesca", 0, -12], ["Spanish March", "es-barcelona", 0, -14], ["Emirate of Córdoba", "es-ciudad-real", 0, 0, "big"], ["Basques", "es-bizkaia", 0, -14]],
      [["Asturias-León", "es-zamora", 0, 0], ["Castile", "es-burgos", 0, -16], ["Navarre", "es-navarra", 0, 18], ["Aragon", "es-huesca", 0, -12], ["Barcelona", "es-barcelona", 0, -14], ["Emirate of Córdoba", "es-ciudad-real", 0, 0, "big"], ["Basques", "es-bizkaia", 0, -14]],
      [["León", "es-leon", 0, 10], ["Castile", "es-burgos", 0, -16], ["Navarre", "es-navarra", 0, 18], ["Aragon", "es-huesca", 0, -12], ["Barcelona", "es-barcelona", 0, -14], ["Caliphate of Córdoba", "es-ciudad-real", 0, 0, "big"]],
      [["León", "es-leon", 0, 10], ["Castile", "es-burgos", 0, -16], ["Navarre", "es-navarra", 0, 18], ["Aragon", "es-huesca", 0, -12], ["Barcelona", "es-barcelona", 0, -14], ["Taifa kingdoms", "es-ciudad-real", 0, 0, "big"]],
      [["León-Castile", "es-valladolid"], ["Navarre", "es-navarra", 0, 18], ["Aragon", "es-huesca", 0, -12], ["Barcelona", "es-barcelona", 0, -14], ["Zaragoza (taifa)", "es-zaragoza", 0, -14], ["Almoravids", "es-albacete", 0, 0, "big"]],
      [["León-Castile", "es-valladolid"], ["Portugal", "pt-viseu"], ["Navarre", "es-navarra", 0, 18], ["Aragon", "es-zaragoza", 0, -14], ["Almohads", "es-albacete", 0, 0, "big"]],
      [["León", "es-leon", 0, 10], ["Castile", "es-valladolid", 0, 20], ["Portugal", "pt-viseu"], ["Navarre", "es-navarra", 0, 18], ["Aragon", "es-zaragoza", 0, -14], ["Almohads", "es-albacete", 0, 0, "big"]],
      [["Castile-León", "es-toledo", 0, -20], ["Portugal", "pt-viseu"], ["Navarre", "es-navarra", 0, 18], ["Aragon", "es-zaragoza", 0, -14], ["Granada", "es-granada", 0, 14]],
      [["Spain", "es-toledo", 0, -20, "big"], ["Portugal", "pt-viseu"], ["Navarre", "es-navarra", 0, 18]]
    ];
    var GLAB = [
      ["Asturias", "es-asturias", "reg", 0, -14], ["Galicia", "es-lugo", "reg", 0, 14], ["Pyrenees", "lbl-pyrenees", "reg", 0, -9], ["Cantabrian Mountains", "lbl-cantabrian", "reg", 0, 0],
      ["Bay of Biscay", "lbl-biscay", "sea", 0, 0], ["Atlantic Ocean", "lbl-atlantic", "sea", 0, 0], ["Mediterranean Sea", "lbl-med", "sea", 0, 0],
      ["Strait of Gibraltar", "lbl-strait", "sea", 0, 0], ["France", "lbl-france", "land", 0, 0], ["Africa", "lbl-africa", "land", 0, 0]
    ];
    var gLabels = el("g", { class: "sp-labels" });
    svg.insertBefore(gLabels, gSites);
    var labelEls = [];
    function anchorXY(id) { if (GEO.pts[id]) return GEO.pts[id]; if (GEO.meta[id]) return GEO.meta[id].c; return null; }
    function makeLabel(text, id, dx, dy, cls) {
      var p = anchorXY(id); if (!p) return;
      var t = el("text", { class: "gl-map-label " + cls, "paint-order": "stroke", "text-anchor": "middle" });
      t.textContent = text; t._p = p; t._dx = dx || 0; t._dy = dy || 0; t._big = /big/.test(cls); t._k = /sp-klab/.test(cls);
      gLabels.appendChild(t); labelEls.push(t);
    }
    function drawLabels() {
      labelEls.forEach(function (t) { if (t.parentNode) t.parentNode.removeChild(t); }); labelEls = [];
      var used = {};
      (KLAB[cur] || []).forEach(function (l) { used[l[1]] = true; makeLabel(l[0], l[1], l[2], l[3], "sp-klab" + (l[4] === "big" ? " big" : "")); });
      GLAB.forEach(function (l) { if (used[l[1]]) return; makeLabel(l[0], l[1], l[3], l[4], "sp-glab " + l[2]); });
    }

    var cur = 0, ownerOf = {};
    var yearOut = $("#sp-year"), titleOut = $("#sp-stage-title"), noteOut = $("#sp-stage-note"),
        legend = $("#sp-legend"), slider = $("#sp-slider"), play = $("#sp-play"), tellOut = $("#sp-tell"),
        prev = $("#sp-prev"), next = $("#sp-next");

    function compute(st) {
      var o = {};
      Object.keys(GEO.units).forEach(function (id) { o[id] = st.base; });
      st.set.forEach(function (pair) { pair[1].forEach(function (id) { if (o.hasOwnProperty(id)) o[id] = pair[0]; }); });
      return o;
    }

    var siteEls = [];
    function paint() {
      var st = STAGES[cur];
      ownerOf = compute(st);
      for (var id in units) { units[id].style.fill = OWN[ownerOf[id]].c; }
      if (yearOut) yearOut.textContent = String(st.y);
      if (titleOut) titleOut.textContent = st.t;
      if (noteOut) noteOut.textContent = st.note;
      if (slider && Number(slider.value) !== cur) slider.value = String(cur);
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === STAGES.length - 1;

      // legend: owners present at this stage, in a fixed order
      var present = {};
      for (var k in ownerOf) present[ownerOf[k]] = true;
      var order = ["hold", "ast", "leon", "cas", "lc", "esp", "por", "nav", "ara", "cat", "bas", "cid", "and", "tai", "alm", "gra"];
      if (legend) legend.innerHTML = order.filter(function (k) { return present[k]; }).map(function (k) {
        var name = (st.lab && st.lab[k]) || OWN[k].n;
        return '<span><i style="background:' + OWN[k].c + '"></i>' + name + "</span>";
      }).join("") + '<span><i class="sp-legend-mtn"></i>Mountains: the Pyrenees, and the Cantabrian range above Covadonga</span><span class="gl-legend-note">Colours are a teaching approximation, drawn on today’s provinces. Frontiers were wide empty zones, not lines.</span>';

      // sites
      siteEls.forEach(function (s) { if (s.parentNode) s.parentNode.removeChild(s); });
      siteEls = [];
      (st.sites || []).forEach(function (s) {
        var p = GEO.pts[s[0]]; if (!p) return;
        var g = el("g", { class: "sp-site" });
        var star = el("path", { class: "sp-star", d: starPath(p[0], p[1], 1), "vector-effect": "non-scaling-stroke" });
        var t = el("text", { class: "gl-map-label sp-site-label", "paint-order": "stroke" });
        t.textContent = s[1];
        g.appendChild(star); g.appendChild(t);
        gSites.appendChild(g);
        siteEls.push(g);
        g._p = p; g._t = t; g._star = star; g._dx = s[2] || 0;
      });
      drawLabels();
      tune();
      if (tellOut && tellOut._id) tell(tellOut._id, true);
    }

    function starPath(cx, cy, r) {
      var d = "";
      for (var i = 0; i < 10; i++) {
        var rr = i % 2 ? r * 0.45 : r, a = -Math.PI / 2 + i * Math.PI / 5;
        d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(2) + " " + (cy + rr * Math.sin(a)).toFixed(2);
      }
      return d + "Z";
    }

    function tune() {
      var box = svg.getBoundingClientRect();
      if (!box.width) return;
      var uu = FW / box.width;
      var k = Math.max(0.72, Math.min(1, box.width / 720));
      land.setAttribute("stroke-width", (0.8 * uu).toFixed(2));
      for (var id in dots) {
        var s = dots[id], off = OFF[id] || [9, 4];
        var fs = 12.5 * uu * k, r = 4.2 * uu * k;
        s.dot.setAttribute("r", r.toFixed(2));
        s.ring.setAttribute("r", (r + 5 * uu).toFixed(2));
        s.ring.setAttribute("stroke-width", (2 * uu).toFixed(2));
        var anchor = off[0] > 3 ? "start" : off[0] < -3 ? "end" : "middle";
        s.t.setAttribute("font-size", fs.toFixed(2));
        s.t.setAttribute("stroke-width", (3 * uu).toFixed(2));
        s.t.setAttribute("text-anchor", anchor);
        s.t.setAttribute("x", (s.p[0] + off[0] * uu * k).toFixed(1));
        s.t.setAttribute("y", (s.p[1] + off[1] * uu * k).toFixed(1));
      }
      rangeEls.forEach(function (pk) { pk.setAttribute("d", peakPath(pk._peaks, 5.5 * uu * k)); });
      labelEls.forEach(function (t) {
        var fs = (t._big ? 17 : t._k ? 13 : 11.5) * uu * k;
        t.setAttribute("font-size", fs.toFixed(2));
        t.setAttribute("stroke-width", (3 * uu).toFixed(2));
        t.setAttribute("x", (t._p[0] + t._dx * uu * k).toFixed(1));
        t.setAttribute("y", (t._p[1] + t._dy * uu * k).toFixed(1));
      });
      siteEls.forEach(function (g) {
        var fs = 13.5 * uu * k, r = 9 * uu * k;
        g._star.setAttribute("d", starPath(g._p[0], g._p[1], r));
        g._star.setAttribute("stroke-width", (1.5 * uu).toFixed(2));
        g._t.setAttribute("font-size", fs.toFixed(2));
        g._t.setAttribute("stroke-width", (3.2 * uu).toFixed(2));
        g._t.setAttribute("text-anchor", "middle");
        g._t.setAttribute("x", (g._p[0] + g._dx * uu * k).toFixed(1));
        g._t.setAttribute("y", (g._p[1] - r - 4 * uu * k).toFixed(1));
      });
    }

    function tell(id, quiet) {
      if (!tellOut) return;
      var st = STAGES[cur], own = ownerOf[id];
      var name = (st.lab && st.lab[own]) || OWN[own].n;
      tellOut._id = id;
      tellOut.innerHTML = "<b>" + GEO.meta[id].n + "</b>, as it is called today. In " + st.y + ": <b>" + name + "</b>.";
      for (var k in units) units[k].classList.toggle("is-sel", k === id);
      if (!quiet) open(tellOut);
    }

    function go(n) { cur = Math.max(0, Math.min(STAGES.length - 1, n)); paint(); }

    if (slider) {
      slider.min = "0"; slider.max = String(STAGES.length - 1); slider.step = "1"; slider.value = "0";
      slider.addEventListener("input", function () { stop(); go(Number(slider.value)); });
    }
    if (prev) prev.addEventListener("click", function () { stop(); go(cur - 1); });
    if (next) next.addEventListener("click", function () { stop(); go(cur + 1); });

    var timer = null;
    function stop() { if (timer) { clearInterval(timer); timer = null; } if (play) play.textContent = "Play the whole war"; }
    if (play) play.addEventListener("click", function () {
      if (timer) { stop(); return; }
      if (cur >= STAGES.length - 1) go(0);
      play.textContent = "Pause";
      timer = setInterval(function () { if (cur >= STAGES.length - 1) { stop(); return; } go(cur + 1); }, 2600);
    });

    // the year chips under the map
    var chips = $("#sp-stagechips");
    if (chips) {
      chips.innerHTML = STAGES.map(function (s, n) {
        return '<button type="button" class="sp-ychip" data-n="' + n + '">' + s.y + "</button>";
      }).join("");
      $$(".sp-ychip", chips).forEach(function (b) {
        b.addEventListener("click", function () { stop(); go(Number(b.getAttribute("data-n"))); });
      });
      var _paint = paint;
      paint = function () { _paint(); $$(".sp-ychip", chips).forEach(function (b) { b.setAttribute("aria-pressed", Number(b.getAttribute("data-n")) === cur ? "true" : "false"); }); };
    }

    // the two lists
    var cBtn = $("#sp-list-c"), iBtn = $("#sp-list-i"), listOut = $("#sp-list-out");
    function clearPulse() {
      for (var k in units) units[k].classList.remove("pulse");
      for (var d in dots) dots[d].g.classList.remove("pulse");
    }
    if (cBtn) cBtn.addEventListener("click", function () {
      stop(); go(6); clearPulse();
      Object.keys(CHRISTIAN_SIX).forEach(function (n) { CHRISTIAN_SIX[n].forEach(function (id) { if (units[id]) units[id].classList.add("pulse"); }); });
      if (listOut) { listOut.innerHTML = "<b>Christian states, c. 1030s:</b> Galicia, Portugal, León, Castile, Navarre, Aragon. Regions, not cities: find each one on a blank map."; open(listOut); }
    });
    if (iBtn) iBtn.addEventListener("click", function () {
      stop(); go(6); clearPulse();
      ISLAMIC_TEN.forEach(function (id) { if (dots[id]) dots[id].g.classList.add("pulse"); });
      if (listOut) { listOut.innerHTML = "<b>Islamic states, c. 1030s:</b> Zaragoza, Valencia, Toledo, Badajoz, Dénia, Murcia, Almería, Granada, Córdoba, Sevilla. Each taifa took the name of its city, so this list is also a list of cities to find."; open(listOut); }
    });

    paint();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(tune);
    if ("ResizeObserver" in window) { new ResizeObserver(tune).observe(svg); } else { window.addEventListener("resize", tune); }
  })();

  /* ------------------------------------------------- 4. fact or legend */

  var SORT = [
    { s: "Asturias was overrun by the invaders in 714.", v: "fact", w: "The earliest accounts agree. The mountains were taken; the people who would not submit went higher." },
    { s: "Pelayo had been captured by the Muslims, and escaped.", v: "fact", w: "This is how every account tells it. Notice that it is also exactly how a legend would begin. Both things can be true." },
    { s: "The men in the mountains elected Pelayo their war chief.", v: "fact", w: "He was elected war chief of Asturias. That is the sober version." },
    { s: "Pelayo was a king.", v: "legend", w: "Later sources call him king, and his descendants were kings, so the title travelled backwards onto him. In 722 he was a war chief by election. This is the seam where the telling starts to dress the man." },
    { s: "At Covadonga the arrows shot at the cave turned back in the air and struck the men who had shot them.", v: "legend", w: "From the Chronicle of Alfonso III, written about 150 years after the battle at the court of Pelayo's descendants. It tells you what those kings needed the story to mean." },
    { s: "A mountainside collapsed on the retreating army and buried it.", v: "legend", w: "Same chronicle, same century-and-a-half gap. Geology does not confirm it. The story does not need it to." },
    { s: "Covadonga was fought in 722.", v: "unsure", w: "The sources give 718 and 722 and a few years between. The date is traditional, not certain. Hold it as 'about 722' and say so when you write it." },
    { s: "Every later Iberian royal dynasty descends from Pelayo.", v: "fact", w: "His daughter Ermesinda married Alfonso I; the kings of Asturias, then León, then Castile trace to that line, and the other kingdoms married into it. It is also the kind of fact a dynasty is careful to keep true." }
  ];
  (function () {
    var wrap = $("#sp-sort"); if (!wrap) return;
    var i = 0, right = 0;
    var sEl = $("#sp-sort-s"), whyEl = $("#sp-sort-why"), scoreEl = $("#sp-sort-score"), nextBtn = $("#sp-sort-next"), restart = $("#sp-sort-restart");
    var btns = $$(".sp-sort-btn", wrap);
    var names = { fact: "Fact, as far as the record goes", legend: "Legend", unsure: "Nobody can be sure" };
    function render() {
      shut(whyEl); shut(nextBtn);
      btns.forEach(function (b) { b.disabled = false; b.classList.remove("right", "wrong"); });
      if (scoreEl) scoreEl.textContent = right + " of " + i + " sorted right";
      if (i >= SORT.length) {
        sEl.innerHTML = "<b>Done.</b> " + right + " of " + SORT.length + ". The lesson is not the score. It is that the true parts and the told parts sit in the same sentence, and you have to pull them apart yourself. The source in section 6 will do this to you for five pages.";
        btns.forEach(function (b) { b.disabled = true; });
        return;
      }
      sEl.textContent = SORT[i].s;
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        if (i >= SORT.length) return;
        var item = SORT[i], ok = b.getAttribute("data-v") === item.v;
        if (ok) right++;
        b.classList.add(ok ? "right" : "wrong");
        btns.forEach(function (o) { if (o.getAttribute("data-v") === item.v) o.classList.add("right"); o.disabled = true; });
        whyEl.innerHTML = "<b>" + names[item.v] + ". </b>" + item.w;
        open(whyEl); open(nextBtn);
        i++;
        if (scoreEl) scoreEl.textContent = right + " of " + i + " sorted right";
      });
    });
    if (nextBtn) nextBtn.addEventListener("click", render);
    if (restart) restart.addEventListener("click", function () { i = 0; right = 0; render(); });
    render();
  })();

  /* -------------------------------------------------- 6. whose side? */

  var CID = [
    { y: "c. 1043", side: "C", h: "Born at Vivar, near Burgos", t: "Rodrigo Díaz, a minor noble's son in the kingdom of León and Castile. Raised in the household of King Ferdinand the Great. His nickname comes later: <i>as-Sayyid</i>, Arabic for lord, said by the men he led and the men he fought." },
    { y: "before 1066", side: "C", h: "Banner-bearer for Sancho II of Castile", t: "Champion of the king: he carries the standard and fights the single combats. In 1067 he leads the army that defeats the emir of Zaragoza and makes him a vassal of León. He will never lose a battle in his life." },
    { y: "1072", side: "C", h: "The wrong brother wins", t: "He fights Sancho's war against the king's brother Alfonso of León, and wins. Then Sancho is assassinated and Alfonso becomes king of both León and Castile. The Cid keeps a command but is demoted; García Ordóñez replaces him at the king's side. He marries Jimena, a nobleman's daughter." },
    { y: "1070s", side: "I", h: "Commander for the Islamic king of Sevilla", t: "Blocked at court, he takes service with Sevilla, which is at war with Islamic Granada. Alfonso, his own king, sends Ordóñez to help Granada. The Cid beats Granada, captures Ordóñez, and ransoms him back. This mercenary service was normal in Reconquista Iberia." },
    { y: "1081", side: "I", h: "Exiled; commander for Zaragoza", t: "An unauthorized raid on Toledo gets him exiled. He takes his sword to the Islamic ruler of Zaragoza, breaks Zaragoza away from Castile's grip, and beats every neighbour who comes at it, Muslim or Christian, Barcelona and Aragon included." },
    { y: "1086", side: "C", h: "Recalled against the Almoravids", t: "The Almoravids land from Morocco and crush Alfonso at Sagrajas. Alfonso begs the Cid to come back. He does, and beats the army nobody else could beat." },
    { y: "1090–1094", side: "S", h: "Prince of Valencia", t: "He captures the Count of Barcelona, then carves out Valencia, the richest territory in Iberia, for himself. Three wars to hold it. In 1094 he is Prince of Valencia and answers to no king." },
    { y: "1094–1097", side: "S", h: "Holding it", t: "Two Islamic invasions defeated. His son dies in battle in 1097. His daughters marry into royal houses; the present monarchs of Spain and England descend from them." },
    { y: "1099", side: "S", h: "The siege, and the ride", t: "The Almoravids besiege Valencia. The Cid dies (of dysentery, in the histories; the Chronicle tells it as a holy death with the sacraments). Jimena has his body armed and set on Babieca to lead the last charge out of the city. Valencia is lost in 1102 and stays Moorish for 170 years, until James of Aragon." }
  ];
  (function () {
    var wrap = $("#sp-cid"); if (!wrap) return;
    var n = 0;
    var yEl = $("#sp-cid-y"), hEl = $("#sp-cid-h"), tEl = $("#sp-cid-t"), sideEl = $("#sp-cid-side"), tally = $("#sp-cid-tally"), track = $("#sp-cid-track");
    var back = $("#sp-cid-back"), fwd = $("#sp-cid-next");
    var sides = { C: ["Christian king", "c"], I: ["Islamic ruler", "i"], S: ["Himself", "s"] };
    if (track) track.innerHTML = CID.map(function (c, i) { return '<span class="sp-track-dot side-' + sides[c.side][1] + '" data-i="' + i + '" title="' + c.y + '"></span>'; }).join("");
    function render() {
      var c = CID[n];
      yEl.textContent = c.y; hEl.textContent = c.h; tEl.innerHTML = c.t;
      sideEl.textContent = "Serving: " + sides[c.side][0];
      sideEl.className = "sp-cid-side side-" + sides[c.side][1];
      var count = { C: 0, I: 0, S: 0 };
      for (var i = 0; i <= n; i++) count[CID[i].side]++;
      tally.innerHTML = "So far: <b>" + count.C + "</b> Christian king" + (count.C === 1 ? "" : "s") + " · <b>" + count.I + "</b> Islamic ruler" + (count.I === 1 ? "" : "s") + " · <b>" + count.S + "</b> himself" +
        (n === CID.length - 1 ? " <span class=\"sp-cid-ask\">Whose side was he on?</span>" : "");
      $$(".sp-track-dot", track).forEach(function (d, i) { d.classList.toggle("done", i <= n); d.classList.toggle("now", i === n); });
      back.disabled = n === 0; fwd.disabled = n === CID.length - 1;
    }
    back.addEventListener("click", function () { n = Math.max(0, n - 1); render(); });
    fwd.addEventListener("click", function () { n = Math.min(CID.length - 1, n + 1); render(); });
    $$(".sp-track-dot", track).forEach(function (d) { d.addEventListener("click", function () { n = Number(d.getAttribute("data-i")); render(); }); });
    render();
  })();

  /* -------------------------------------------------- 9. discussion */

  var DQ = [
    { star: true,
      q: "What is Divine Providence doing in a story like this, and what is man doing?",
      p: "Pick one moment: Covadonga, Toledo in 1085, Las Navas in 1212, Granada in 1492. Say what a believer sees in it and what a skeptic sees in it. Then say which reading you find more honest, and why." },
    { star: true,
      q: "Where does fact end and legend begin in the Pelayo story, and why does the telling want it that way?",
      p: "Who wrote the legend down, when, and what did they need it to do? A story told a hundred and fifty years later at the court of the hero's descendants is evidence of something. Of what? Carry this question into section 6, where a man wins a battle after he is dead." },
    { star: false,
      q: "How do you think religious houses, convents, and monasteries fared during the Reconquista?",
      p: "Be specific about the frontier. A monastery on the Duero in 900 sits in a no-man's-land raided every summer. One in Galicia in 997 gets Almanzor at the door. One in Toledo after 1085 has Muslim and Jewish neighbours and a new Christian king. Which of those would you enter, and what would you expect your life to be?" },
    { star: false,
      q: "What would it be like to come of age in a world that had been at war for centuries and would be at war for centuries after your death?",
      p: "Now compare. Has anyone in this room lived a year in which the country was at war nowhere? How is that the same, and how is it different? El Cid's answer to the question was to make the war work for him. Was that wrong?" },
    { star: false,
      q: "Was the Reconquista one war, 722 to 1492?",
      p: "Argue both sides. Seven hundred and seventy years, hundreds of truces, Christian kings at war with each other more often than with Granada, a Christian hero commanding for Zaragoza, Muslim soldiers in Christian pay. What makes a war one war? Who benefits from calling it one, in 1492 and today?" },
    { star: false,
      q: "El Cid served Christian kings, Islamic rulers, and finally himself. Why do the Christian sources love him anyway?",
      p: "In Reconquista Iberia, morality was often discarded for ambition, on both sides. So is the Cid admired despite that, or because the sources share the ambition? Read the death scene on p. 20 again: he receives the Body of Christ, prays, and dies 'pure and without spot.' Who needed him to die like that?" },
    { star: false,
      q: "God 'draws straight with crooked lines,' the old saying goes. Where, in this story?",
      p: "Aristotle reaching Aquinas by way of Córdoba and Toledo. The Alhambra built by the last Islamic state in Iberia. Name the crooked line and the straight line in each case. Then find one crooked line in this story that you do not think drew anything straight, and say why." }
  ];
  (function () {
    var wrap = $("#sp-dq"); if (!wrap) return;
    wrap.innerHTML = DQ.map(function (d, n) {
      return '<div class="gl-dq-card' + (d.star ? " starred" : "") + '"><p>' + d.q + "</p>" +
             '<button class="gl-push" type="button" data-d="' + n + '">More</button>' +
             '<p class="gl-dq-more gl-panel" data-more="' + n + '">' + d.p + "</p></div>";
    }).join("");
    $$(".gl-push", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var more = wrap.querySelector('[data-more="' + btn.getAttribute("data-d") + '"]');
        if (more.classList.contains("open")) { shut(more); btn.textContent = "More"; } else { open(more); btn.textContent = "Less"; }
      });
    });
  })();

  /* ------------------------------------------------------ 10. quiz */

  var QUIZ = [
    { q: "What did the Romans call the peninsula?", a: ["Hispania", "Iberia", "al-Andalus", "Lusitania"], k: 0, w: "Hispania. Iberia is the Greek name we use for the land itself; al-Andalus is the Arabic name for the Islamic part; Lusitania was one Roman province inside it." },
    { q: "Who defeated King Roderic at the Guadalete in 711?", a: ["Abd al-Rahman", "Tariq ibn Ziyad", "Almanzor", "Charles Martel"], k: 1, w: "Tariq ibn Ziyad. Gibraltar is Jabal Tariq, Tariq's mountain, where he landed." },
    { q: "By 718, what part of Iberia was still unconquered?", a: ["Catalonia", "Portugal", "A few hundred square miles of mountain in Asturias", "The kingdom of León"], k: 2, w: "A couple hundred square miles in the mountains of Asturias. León does not exist yet; Catalonia is taken by the Franks decades later." },
    { q: "According to the earliest account, the men in the mountains made Pelayo their what?", a: ["King", "Bishop", "Elected war chief", "Emir"], k: 2, w: "Elected war chief. Later sources call him king; that is the legend layer starting." },
    { q: "The first victory of the Reconquista, about 722:", a: ["Covadonga", "Tours", "Las Navas de Tolosa", "Roncevaux"], k: 0, w: "Covadonga, in the Asturian mountains. Tours (732) is Charles Martel in France; Las Navas is 1212; Roncevaux is the Basques against the Franks." },
    { q: "Which kingdom grew directly out of Asturias and took its name in 924?", a: ["Navarre", "León", "Portugal", "Aragon"], k: 1, w: "León. Castile begins as León's frontier county and becomes a kingdom in 1035." },
    { q: "Who stopped the Islamic advance at Tours in 732?", a: ["Charlemagne", "Pelayo", "Charles Martel", "Roderic"], k: 2, w: "Charles Martel, the Frankish leader and Charlemagne's grandfather." },
    { q: "Two kingdoms date their royal status to 1035. Which two?", a: ["León and Portugal", "Castile and Aragon", "Navarre and Galicia", "Valencia and Murcia"], k: 1, w: "Castile (Ferdinand I) and Aragon (Ramiro I), both sons of Sancho the Great of Navarre." },
    { q: "“El Cid” comes from the Arabic as-Sayyid, meaning:", a: ["The champion", "The exile", "The lord", "The horseman"], k: 2, w: "The lord, or the leader. Campeador, his other title, is the battlefield word: master of the field." },
    { q: "In 1085 Alfonso VI took which city, the old Visigothic capital?", a: ["Córdoba", "Zaragoza", "Sevilla", "Toledo"], k: 3, w: "Toledo. The taifa kings then called in the Almoravids, who landed in 1086." },
    { q: "Who landed from Morocco in 1086 and stopped the Christian advance cold?", a: ["The Almohads", "The Almoravids", "The Nasrids", "The Umayyads"], k: 1, w: "The Almoravids. The Almohads replace them in 1147; the Nasrids are the rulers of Granada from 1238." },
    { q: "Las Navas de Tolosa, 16 July 1212: who anchored the Christian alliance?", a: ["Alfonso VIII of Castile", "James I of Aragon", "Afonso Henriques of Portugal", "El Cid"], k: 0, w: "Alfonso VIII of Castile, with Aragon, Navarre, and Portugal. León stayed home. James I is a boy of four that year; El Cid has been dead a century." },
    { q: "The last Islamic state in Iberia, surrendered in 1492:", a: ["Córdoba", "Valencia", "Granada", "Sevilla"], k: 2, w: "Granada. Córdoba fell in 1236, Valencia in 1238, Sevilla in 1248." },
    { q: "Which of these was a Christian state about 1030?", a: ["Badajoz", "Dénia", "Navarre", "Murcia"], k: 2, w: "Navarre. The other three are taifas on the Islamic list." },
    { q: "Which of these was an Islamic state about 1030?", a: ["Galicia", "Zaragoza", "León", "Aragon"], k: 1, w: "Zaragoza, the taifa El Cid later served. The other three are on the Christian list." }
  ];
  (function () {
    var box = $("#sp-quiz"); if (!box) return;
    var qEl = $("#sp-q"), whyEl = $("#sp-why"), scoreEl = $("#sp-score"), ans = $("#sp-answers"), nextBtn = $("#sp-next-q"), restart = $("#sp-restart");
    var order = [], i = 0, score = 0, answered = false;
    function shuffle(a) { for (var j = a.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[k]; a[k] = t; } return a; }
    function start() { order = shuffle(QUIZ.map(function (_, n) { return n; })); i = 0; score = 0; render(); }
    function render() {
      answered = false; shut(whyEl); shut(nextBtn);
      scoreEl.textContent = score + " of " + i + " right";
      if (i >= order.length) {
        qEl.innerHTML = "<b>Done.</b> " + score + " out of " + order.length + ". " + (score === order.length ? "Cold. Now do the map." : score >= order.length - 3 ? "Close. Scroll up for the ones you missed and run it again tomorrow." : "Run the map slider once more with the notes open, then try again.");
        ans.innerHTML = ""; return;
      }
      var item = QUIZ[order[i]];
      qEl.textContent = item.q;
      ans.innerHTML = item.a.map(function (t, n) { return '<button class="gl-ans" type="button" data-n="' + n + '">' + t + "</button>"; }).join("");
      $$(".gl-ans", ans).forEach(function (b) {
        b.addEventListener("click", function () {
          if (answered) return; answered = true;
          var n = Number(b.getAttribute("data-n")), ok = n === item.k;
          if (ok) score++;
          b.classList.add(ok ? "right" : "wrong");
          $$(".gl-ans", ans).forEach(function (o) { if (Number(o.getAttribute("data-n")) === item.k) o.classList.add("right"); o.disabled = true; });
          whyEl.innerHTML = (ok ? "<b>Right. </b>" : "<b>Not quite. </b>") + item.w;
          open(whyEl); open(nextBtn); i++;
          scoreEl.textContent = score + " of " + i + " right";
        });
      });
    }
    nextBtn.addEventListener("click", render);
    restart.addEventListener("click", start);
    start();
  })();

})();
