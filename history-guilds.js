/* history-guilds.js — Guilds, History 11 Unit 1.
   No dependencies. Every widget degrades to readable text if this never runs. */

(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function open(el)  { if (el) el.classList.add("open"); }
  function shut(el)  { if (el) el.classList.remove("open"); }

  /* ---------------------------------------------------------- popovers
     Any button with data-def toggles a definition bubble beneath the block
     it sits in. Used by inline terms and by the monastic-industry chips. */

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

  /* ------------------------------------------------------ 1. blacksmith */

  (function () {
    var wrap = $("#gl-opts");
    if (!wrap) return;
    var opts = $$(".gl-opt", wrap);
    var verdict = $("#gl-verdict");
    var tried = 0;

    opts.forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.classList.contains("tried")) return;
        b.classList.add("tried");
        if (b.getAttribute("data-win") === "true") b.classList.add("win");
        tried++;
        if (b.getAttribute("data-win") === "true" || tried >= opts.length) {
          open(verdict);
        }
      });
    });
  })();

  /* -------------------------------------------------------- 3. ancestors */

  (function () {
    var wrap = $("#gl-anc");
    if (!wrap) return;
    $$(".gl-card-btn", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-anc");
        var body = $('[data-body="' + key + '"]', wrap);
        var wasOpen = btn.getAttribute("aria-expanded") === "true";

        $$(".gl-card-btn", wrap).forEach(function (o) { o.setAttribute("aria-expanded", "false"); });
        $$(".gl-anc-body", wrap).forEach(shut);

        if (!wasOpen) {
          btn.setAttribute("aria-expanded", "true");
          open(body);
        }
      });
    });
  })();

  /* ------------------------------------------------------ 4. four types */

  (function () {
    var wrap = $("#gl-four");
    if (!wrap) return;
    var btns = $$(".gl-type-btn", wrap);
    var all = $("#gl-toggle-all");

    function setOne(btn, want) {
      btn.setAttribute("aria-expanded", want ? "true" : "false");
      var body = btn.parentNode.querySelector(".gl-type-body");
      if (want) { open(body); } else { shut(body); }
      btn.querySelector(".gl-type-more").textContent = want ? "Close" : "What it was";
    }

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setOne(btn, btn.getAttribute("aria-expanded") !== "true");
        syncAll();
      });
    });

    function syncAll() {
      if (!all) return;
      var openCount = btns.filter(function (b) { return b.getAttribute("aria-expanded") === "true"; }).length;
      all.textContent = openCount === btns.length ? "Close all four" : "Open all four";
    }

    if (all) {
      all.addEventListener("click", function () {
        var want = all.textContent.indexOf("Open") === 0;
        btns.forEach(function (b) { setOne(b, want); });
        syncAll();
      });
    }
  })();

  /* ------------------------------------------------------------- quiz */

  var QUIZ = [
    { k: "frith", q: "Freemen in an English village swear that if one of them is robbed, the rest will hunt the thief and cover the loss.",
      why: "Frith guild. Mutual protection among neighbors where there is no police force. Part social club, part police force." },
    { k: "trade", q: "The wool merchants of a Flemish city agree on what a bale sells for and who is allowed to trade in the market.",
      why: "Trade guild. Merchants controlling price and access across a whole city. They move and sell goods rather than make them." },
    { k: "craft", q: "A boy of twelve is bound to a carpenter for seven years, living in his house and receiving no wages.",
      why: "Craft guild. The apprentice to journeyman to master ladder is the craft guilds' invention." },
    { k: "relig", q: "A brotherhood in Toulouse forms to carry Our Lady through the streets on her feast day and to bury members who die poor.",
      why: "Religious guild. Procession, devotion, and works of mercy. These are the ones that survive today as confraternities." },
    { k: "craft", q: "The bakers of a town fine one of their own for selling an underweight loaf.",
      why: "Craft guild. Artisans making a consumable good, inspecting and policing the quality of their own work." },
    { k: "relig", q: "A group forms in France in direct answer to a faction that had sworn itself to revenge, and devotes itself to almsgiving instead.",
      why: "Religious guild. Sworn brotherhoods aimed at charity rather than at revenge, persecution, or faction. That is exactly how they began." },
    { k: "trade", q: "The men who own the warehouses lend money to the king and refuse to trade with a city that cheated one of them.",
      why: "Trade guild. Commerce organized as a single body, with enough weight to bargain with kings and other cities." },
    { k: "craft", q: "Chandlers agree that no candle may be sold with a wick that gutters, and inspect one another's shops.",
      why: "Craft guild. A chandler makes candles. Artisans, consumable goods, shared quality control." },
    { k: "frith", q: "Neighbors swear an oath to come armed when any one of them raises the cry for help.",
      why: "Frith guild. Frith is Old English for peace and for the protection you are owed inside a group. Answering the call is the entire point." }
  ];

  (function () {
    var box = $("#gl-quiz");
    if (!box) return;

    var qEl = $("#gl-q"), whyEl = $("#gl-why"), scoreEl = $("#gl-score");
    var nextBtn = $("#gl-next"), restartBtn = $("#gl-restart");
    var ansBtns = $$(".gl-ans", box);

    var order = [], i = 0, score = 0, answered = false;

    function shuffle(a) {
      for (var j = a.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var t = a[j]; a[j] = a[k]; a[k] = t;
      }
      return a;
    }

    function start() {
      order = shuffle(QUIZ.map(function (_, n) { return n; }));
      i = 0; score = 0;
      render();
    }

    function render() {
      answered = false;
      shut(whyEl); shut(nextBtn);
      ansBtns.forEach(function (b) {
        b.disabled = false;
        b.classList.remove("right", "wrong");
      });
      scoreEl.textContent = score + " of " + i + " right";

      if (i >= order.length) {
        qEl.innerHTML = "<b>Done.</b> " + score + " out of " + order.length + ". " +
          (score === order.length ? "All four types, cold. Nice work!"
           : score >= order.length - 2 ? "Close. Reopen the card for the ones you missed."
           : "Open the four cards above and read them, then run this again.");
        ansBtns.forEach(function (b) { b.disabled = true; });
        return;
      }
      qEl.textContent = QUIZ[order[i]].q;
    }

    ansBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        if (answered || i >= order.length) return;
        answered = true;
        var item = QUIZ[order[i]];
        var right = b.getAttribute("data-k") === item.k;
        if (right) score++;
        b.classList.add(right ? "right" : "wrong");
        if (!right) {
          ansBtns.forEach(function (o) {
            if (o.getAttribute("data-k") === item.k) o.classList.add("right");
          });
        }
        ansBtns.forEach(function (o) { o.disabled = true; });
        whyEl.innerHTML = (right ? "<b>Right. </b>" : "<b>Not quite. </b>") + item.why;
        open(whyEl);
        open(nextBtn);
        i++;
        scoreEl.textContent = score + " of " + i + " right";
      });
    });

    nextBtn.addEventListener("click", render);
    restartBtn.addEventListener("click", start);
    start();
  })();

  /* -------------------------------------------------------- 5. the ladder */

  var RUNGS = [
    { t: "Apprentice",
      h: "Roughly age twelve. About seven years. No wages.",
      b: "<p>Your father signs you over to a master by a written contract called an <b>indenture</b>. The name is literal: the agreement was written out twice on one sheet, then cut apart along a jagged, toothed line, so the two halves could later be fitted back together to prove the contract was genuine. Latin <i>dens</i>, a tooth.</p>" +
         "<p>For the term of years, commonly seven, you live in the master's house. He feeds, clothes, and houses you, and he teaches you the craft. You are not paid. You may not marry, and you may not trade on your own account.</p>" +
         "<p>You start at the bottom of the work: keeping the fire, sweeping, fetching water, grinding, carrying. You learn by watching, then by being allowed to touch the easy parts, then the hard ones. Nobody explains the trade to you in a classroom. You absorb it standing next to someone doing it.</p>" +
         "<p><b>The risk:</b> a bad master. Guild records are full of complaints about masters who beat their apprentices, starved them, or used them as household servants and taught them nothing. Apprentices ran away. The guild court heard the cases, which is itself the point: there was somewhere to take the complaint.</p>" },
    { t: "Journeyman",
      h: "Trained. Paid by the day. Still cannot open a shop.",
      b: "<p>The word has nothing to do with journeys. It comes from the French <i>journ&eacute;e</i>, a day, because a journeyman was paid a day's wage for a day's work.</p>" +
         "<p>You are now genuinely skilled, and you are free in ways an apprentice was not. You may hire yourself out to any master who wants you, negotiate your pay, and leave town if the work is better elsewhere. You are earning money of your own for the first time in your life.</p>" +
         "<p>You still may not open your own shop, take apprentices, or sell under your own name in most crafts. You work in someone else's shop, on someone else's terms.</p>" +
         "<p><b>Worth knowing:</b> in parts of Germany, journeymen spent years traveling town to town to learn from different masters, a custom called the <i>Wanderjahre</i>, the wander years. A handful of German carpenters still do it today, in the traditional black hat and wide corduroy, and they are not doing it as a costume.</p>" +
         "<p>Some journeymen stayed journeymen for life. The next rung was not guaranteed.</p>" },
    { t: "Master",
      h: "Your own shop, your own apprentices, and a vote.",
      b: "<p>To become a master you submitted a <b>masterpiece</b>: a finished piece of work, made to your own hand, presented to the assembled masters to be judged. If they judged it worthy, you were one of them. That is where the word comes from, and it originally meant the qualifying exam rather than the greatest thing an artist ever made.</p>" +
         "<p>Most guilds also wanted a fee, evidence of good character, and often proof that the town could support another shop in your trade.</p>" +
         "<p>What you get: your own shop, the right to take apprentices and hire journeymen, a vote in guild business, the guild's <b>livery</b> (its distinctive dress) to wear, and a place in the procession on the feast day. You are now a person of standing in a town where standing is everything.</p>" +
         "<p><b>The turn to watch for.</b> By the later Middle Ages some guilds had made the last rung nearly impossible to reach. Fees climbed, required masterpieces grew absurdly elaborate and expensive to attempt, and the sons of masters were quietly given easier terms. A ladder built so that a poor boy could climb was being used to pull the ladder up. Hold onto that, because it is one of the arguments made against the guilds later.</p>" }
  ];

  (function () {
    var wrap = $("#gl-ladder");
    var body = $("#gl-rung-body");
    if (!wrap || !body) return;

    $$(".gl-rung", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var n = parseInt(btn.getAttribute("data-rung"), 10);
        var wasOpen = btn.getAttribute("aria-expanded") === "true";
        $$(".gl-rung", wrap).forEach(function (o) { o.setAttribute("aria-expanded", "false"); });
        if (wasOpen) { shut(body); return; }
        btn.setAttribute("aria-expanded", "true");
        body.innerHTML = "<h3 style=\"margin:0 0 0.15rem\">" + RUNGS[n].t + "</h3>" +
          "<p style=\"color:var(--muted);margin:0 0 0.7rem;font-size:0.93rem\">" + RUNGS[n].h + "</p>" +
          RUNGS[n].b;
        open(body);
      });
    });
  })();

  /* ------------------------------------------------- 6. protection / cost */

  var RULES = [
    { i: "🥖", t: "Who may bake and sell bread in this town.",
      p: "Nobody can set up next door and undercut you into ruin. The seven years you spent learning this are worth something, and stay worth something.",
      c: "A skilled baker who moves here from the next county cannot work at his own trade. Talent from outside is locked out by rule, not by merit." },
    { i: "⚖️", t: "What a loaf weighs and what it costs.",
      p: "You cannot be dragged into a price war you lose. A fair day of work reliably earns a living, in a good year and a bad one.",
      c: "You cannot charge more for a better loaf, and you cannot sell cheaper to win customers. Your best idea earns you nothing extra." },
    { i: "🔍", t: "The quality of your flour and the honesty of your scales.",
      p: "Customers trust bakers as a class, because a cheat is caught and punished by his own trade. That trust is an asset every member owns.",
      c: "Inspectors from your own guild may walk into your shop, weigh your bread, and fine you. Your competitors are your regulators." },
    { i: "🕓", t: "The hours you may work.",
      p: "No one can work through the night and out-produce the rest of you. Sundays and feast days stay free for everyone.",
      c: "You cannot outwork the competition even if you want to. Ambition is capped by rule." },
    { i: "👥", t: "How many apprentices you may take, and who.",
      p: "The craft does not get diluted by half-trained bakers, and apprentices do not become free labor for whoever wants to build an empire.",
      c: "The number of bakers in town is deliberately held down, so fewer people get into the trade at all. Someone's son does not get in." },
    { i: "⛪", t: "What happens when you are sick, and when you die.",
      p: "The common fund pays. In many towns your widow may keep the shop running. Your funeral is paid for and your brothers attend it.",
      c: "You pay in for forty years whether you ever draw on it or not, and the guild's claim on your loyalty is lifelong." }
  ];

  (function () {
    var wrap = $("#gl-rules");
    var pBtn = $("#gl-view-p"), cBtn = $("#gl-view-c");
    if (!wrap || !pBtn || !cBtn) return;
    var mode = "p";

    function draw() {
      wrap.innerHTML = RULES.map(function (r) {
        return '<div class="gl-rule"><span class="gl-rule-i">' + r.i + '</span><span>' +
               "<b>" + r.t + "</b>" +
               '<span class="gl-rule-x">' + (mode === "p" ? r.p : r.c) + "</span></span></div>";
      }).join("");
      pBtn.setAttribute("aria-pressed", mode === "p" ? "true" : "false");
      cBtn.setAttribute("aria-pressed", mode === "c" ? "true" : "false");
    }

    pBtn.addEventListener("click", function () { mode = "p"; draw(); });
    cBtn.addEventListener("click", function () { mode = "c"; draw(); });
    draw();
  })();

  /* ---------------------------------------------------- 7. universities
     The list is CSN's (Lecture Notes 3.0, "Medieval Universities"), in its
     order and with its dates. Naples and Cologne are not on that list; they
     are on the map because two of the scholar-saints were there. */

  var LATIN = "Latin, like every school on this map. A master licensed in Paris could teach in Oxford or Bologna without learning a word of the local speech.";

  var UNIS = [
    { id: "bologna", n: "Bologna", y: 1088, key: true, run: "scholars", field: "law",
      first: "First university in Western Europe",
      d: "<b>The first university in Western Europe</b>, and formed as a guild <b>of scholars</b>, meaning of students. The students were the corporation. They hired their professors, paid them directly out of their own pockets, and fined them for starting a lecture late, for finishing early, for skipping a difficult passage, or for failing to draw a crowd. Read that list again.",
      who: "A guild of students. The students formed two corporations by origin, the Cismontanes from this side of the Alps and the Ultramontanes from beyond them, and each elected its own rector. Emperor Frederick Barbarossa put travelling scholars under his protection in 1155, the first legal privilege ever granted to students as a class.",
      street: "Italian, in the speech of Bologna and the Romagna. Dante had not yet made Tuscan the standard.",
      lang: "Italian",
      known: "Law, above all. Roman civil law was revived here by Irnerius around 1100, and Gratian, a monk of Bologna, compiled the Church's canon law in his <i>Decretum</i> about 1140. Kings and popes both needed lawyers, and Bologna trained them.",
      names: "Copernicus studied canon law here, 1496 to 1500. Petrarch was sent here to study law and hated it." },
    { id: "paris", n: "Paris", y: 1150, key: true, run: "masters", field: "theo",
      first: "The theology school of Europe",
      d: "A guild <b>of masters</b>, not of students. Here the teachers organized, and the teachers ran it. Paris became the great center of theology in Europe, where Albertus Magnus taught and Aquinas studied.",
      who: "A guild of masters. The chancellor of Notre-Dame licensed teachers; the masters fought him for control and won, with the pope on their side (statutes of 1215, and the bull <i>Parens scientiarum</i> of 1231). The arts students were sorted into four nations, French, Norman, Picard, and English, and the four nations elected the rector.",
      street: "French, the langue d'o&iuml;l of the north. The students' quarter on the Left Bank is still called the Latin Quarter, because Latin was the language of its streets for six hundred years.",
      lang: "French",
      known: "Theology, and the arts course that led up to it. If you wanted to argue about God in the thirteenth century, you came here.",
      names: "Abelard drew the crowds in the 1110s and 1130s that made Paris a city of schools. Albertus Magnus taught here from 1245 to 1248 with Aquinas as his student. Aquinas and Bonaventure were made masters of theology on the same day in 1257. Roger Bacon, Duns Scotus, and Nicole Oresme all taught here." },
    { id: "oxford", n: "Oxford", y: 1167, key: true, run: "masters", field: "arts",
      first: "Oldest university in the English-speaking world",
      d: "A guild <b>of masters</b>, on the Paris model. It grew quickly after 1167, when English scholars left Paris and came home. Memorize this one alongside Bologna and Paris.",
      who: "A guild of masters on the Paris model, under a chancellor. When it fell out with the town in 1209 the masters simply left, and some of them founded Cambridge. A guild can walk.",
      street: "English, the Middle English of Chaucer's grandparents. French at court and in the law courts. Latin in the hall.",
      lang: "English",
      known: "Theology and the arts, and something new: natural philosophy. Grosseteste lectured on optics, astronomy, and geometry, and his student Roger Bacon argued for experiment. The Franciscan school at Oxford is where medieval science is most alive.",
      names: "Robert Grosseteste taught here and ran the school (about 1224 to 1235). Roger Bacon, Duns Scotus, and William of Ockham all studied and taught here." },
    { id: "modena", n: "Modena", y: 1175, run: "scholars", field: "law",
      d: "Northern Italy, following the Bologna model of law teaching.",
      who: "A law school on the Bologna model, opened when the jurist Pillio da Medicina was hired away from Bologna. Small, and in and out of existence for centuries.",
      street: "Italian, the same Emilian speech as Bologna, twenty-five miles up the road.",
      lang: "Italian",
      known: "Law.",
      names: "" },
    { id: "palencia", n: "Palencia", y: 1208, run: "charter", field: "arts",
      first: "First university in Spain",
      d: "The first university in Spain, founded by the king of Castile. It did not survive long, and Salamanca took its place.",
      who: "Founded by King Alfonso VIII of Castile, who brought in masters from France and Italy and paid them out of the royal purse. It faded within a generation.",
      street: "Castilian, the Spanish of Castile.",
      lang: "Castilian",
      known: "Arts and theology, grown out of the cathedral school.",
      names: "St Dominic studied at the cathedral school here in the 1180s and 1190s, before it was a university. During a famine he sold his books to feed the poor." },
    { id: "cambridge", n: "Cambridge", y: 1209, run: "masters", field: "arts",
      d: "Founded by masters who fled Oxford after a quarrel between the town and the scholars ended with students hanged. The English universities begin as a guild dispute that turned lethal.",
      who: "A guild of masters who walked out of Oxford in 1209 after the townsmen hanged two students. King Henry III took it under his protection in 1231 and the pope recognized it in 1233.",
      street: "English.",
      lang: "English",
      known: "Arts and theology, on the Oxford pattern.",
      names: "" },
    { id: "salamanca", n: "Salamanca", y: 1218, run: "charter", field: "law",
      first: "Spain's enduring university",
      d: "Spain's enduring university, and one of the oldest in continuous operation anywhere.",
      who: "Founded by King Alfonso IX of Le&oacute;n in 1218. Alfonso X the Wise gave it statutes in 1254 and Pope Alexander IV confirmed it the next year. A guild of masters and students inside a royal foundation.",
      street: "Castilian, the Spanish of Le&oacute;n and Castile.",
      lang: "Castilian",
      known: "Law, canon and civil, first; theology later. In the 1500s its theologians would argue over whether the peoples of the New World had rights, and answer yes.",
      names: "" },
    { id: "montpellier", n: "Montpellier", y: 1220, run: "masters", field: "med",
      d: "In southern France, and famous above all for medicine.",
      who: "A guild of masters. Doctors had taught here since the 1100s; in 1220 the pope's legate gave the medical masters their statutes. The medical faculty is the oldest still in operation anywhere.",
      street: "Occitan, the langue d'oc of the south, the language of the troubadours. Not French.",
      lang: "Occitan",
      known: "Medicine. Its doctors read Galen and the Arabic physicians, Avicenna above all, in Latin translations that came north out of Spain.",
      names: "" },
    { id: "padua", n: "Padua", y: 1222, run: "scholars", field: "law",
      d: "Founded by masters and students who walked out of Bologna over their liberties. Notice the pattern: a guild that does not like its terms leaves and founds another one.",
      who: "A guild of students, like Bologna, which it left. Masters and students walked out of Bologna in 1222 over their liberties and set up here.",
      street: "Italian, in the Venetian speech of the Veneto.",
      lang: "Italian",
      known: "Law first, then medicine and natural philosophy. Copernicus studied medicine here. Galileo taught here for eighteen years. William Harvey, who worked out the circulation of the blood, took his medical degree here in 1602.",
      names: "Albertus Magnus studied here, and joined the Dominicans here in 1223." },
    { id: "toulouse", n: "Toulouse", y: 1229, run: "charter", field: "theo",
      d: "Founded as part of the settlement that ended the Albigensian Crusade, with the explicit job of teaching orthodox theology in a region that had been full of heresy.",
      who: "Founded by treaty. The Treaty of Paris of 1229, which ended the Albigensian Crusade, obliged Count Raymond VII to pay the salaries of masters for a new university. Pope Gregory IX confirmed it in 1233.",
      street: "Occitan, like Montpellier. This was the heart of the Cathar country.",
      lang: "Occitan",
      known: "Theology, to preach orthodoxy in a region full of Cathar heresy. The Dominican order, founded in this city in 1215, filled its chairs.",
      names: "" },
    { id: "prague", n: "Prague", y: 1348, run: "charter", field: "arts",
      first: "First university in Central Europe",
      d: "The first university in Central Europe.",
      who: "Founded by Emperor Charles IV, who was also King of Bohemia, with a bull from Pope Clement VI. Four faculties from the start: arts, theology, law, medicine. Four nations too, Bohemian, Bavarian, Polish, and Saxon, and they fought over which should run the place.",
      street: "Czech and German, both. The town spoke both.",
      lang: "Czech, German",
      known: "All four faculties. It was built as a complete copy of Paris, by an emperor who had studied there.",
      names: "Jan Hus was its rector in 1409. His burning in 1415 set off the Hussite wars. Remember his name when we reach the Reformation." },
    { id: "krakow", n: "Jagiellonian", m: "Krak\u00f3w", y: 1364, run: "charter", field: "law",
      first: "First in Eastern Europe",
      d: "In Krak&oacute;w. We count it as the first university in Eastern Europe. Copernicus studied here.",
      who: "Founded by King Casimir III the Great in 1364 with chairs of law, medicine, and the arts, and no theology. Refounded in 1400 by King W&#322;adys&#322;aw Jagie&#322;&#322;o with the jewels Queen Jadwiga left it, which is why it carries the Jagiellonian name.",
      street: "Polish, with German in the merchant town.",
      lang: "Polish",
      known: "Law at the founding. By the 1400s, mathematics and astronomy. Copernicus studied here from 1491 to 1495.",
      names: "" },
    { id: "vienna", n: "Vienna", y: 1365, run: "charter", field: "arts",
      first: "Oldest university in the German-speaking world",
      d: "Founded a year after Krak&oacute;w, and still running.",
      who: "Founded by Duke Rudolf IV of Austria on the Paris model. The pope allowed it a theology faculty only in 1384; until then, arts, law, and medicine.",
      street: "German.",
      lang: "German",
      known: "Arts, then theology. In the 1400s its astronomers, Peuerbach and Regiomontanus, prepared the ground Copernicus would stand on.",
      names: "" },
    { id: "heidelberg", n: "Heidelberg", y: 1386, run: "charter", field: "arts",
      first: "First university in Germany",
      d: "The first university in Germany.",
      who: "Founded by Rupert I, Elector Palatine, with a bull from Pope Urban VI. The timing is the Great Schism: Paris obeyed the pope at Avignon, so the Empire's masters and students came home and built their own. The first rector came straight from Paris.",
      street: "German.",
      lang: "German",
      known: "Arts and theology, on the Paris pattern.",
      names: "Luther defended his theses here, in the Heidelberg Disputation of 1518." },
    { id: "standrews", n: "St Andrews", y: 1413, run: "charter", field: "arts",
      first: "First university in Scotland",
      d: "In Scotland, and the last stop on our list. Three hundred and twenty-five years after Bologna, the model has crossed the whole of Europe.",
      who: "Founded by Bishop Henry Wardlaw between 1411 and 1413, with bulls from Benedict XIII, the pope at Avignon whom Scotland still obeyed. Scots had been studying at Oxford and Paris; the wars with England had made Oxford impossible.",
      street: "Scots, the northern English of the Lowlands. Gaelic in the Highlands.",
      lang: "Scots",
      known: "Arts and theology.",
      names: "" },
    /* not on CSN's list */
    { id: "naples", n: "Naples", y: 1224, also: true, run: "charter", field: "law",
      d: "Not on our list, but on the map because Aquinas started here.",
      who: "Founded by Emperor Frederick II by decree, with no pope and no guild, to train officials for his kingdom. The first state university.",
      street: "Italian, in the Neapolitan speech of the south.",
      lang: "Italian",
      known: "Law, for the emperor's civil service.",
      names: "Thomas Aquinas was sent here at about fourteen, in 1239, and met the Dominicans here. His family locked him in a castle for a year to stop him joining them." },
    { id: "cologne", n: "Cologne", y: 1248, also: true, run: "charter", field: "theo",
      d: "Not a university until 1388, and not on our list. On the map because Albertus Magnus taught here with Aquinas beside him.",
      who: "From 1248 the Dominicans ran a <i>studium generale</i> here, a school of the order open to friars from everywhere. The city got a university of its own in 1388.",
      street: "German.",
      lang: "German",
      known: "Theology, in the Dominican school.",
      names: "Albertus Magnus taught here from 1248, and Aquinas followed him from Paris and stayed four years. Duns Scotus taught here and died here in 1308." }
  ];

  /* CSN's roster of the scholar-saints, with its dates and its tags.
     `at` is the road each one travelled, in order. */
  var SCHOLARS = [
    { id: "abelard", n: "Peter Abelard", dates: "1079&ndash;1142", tag: "French, secular",
      at: [ { p: "paris", w: "taught in the schools of Paris in the 1110s and 1130s, before there was a university" } ],
      line: "Theologian and logician. The crowds he drew are part of why Paris became a university at all. Known too for his affair with H&eacute;lo&iuml;se, which ended badly for everyone." },
    { id: "grosseteste", n: "Robert Grosseteste", dates: "1168&ndash;1253", tag: "English, diocesan clergy",
      at: [ { p: "oxford", w: "taught here, ran the school about 1224 to 1235, and was the first lecturer to the Oxford Franciscans" } ],
      line: "Founder of natural philosophy and early scientific inquiry. Wrote on optics, astronomy, physics, and geometry. Bishop of Lincoln from 1235." },
    { id: "albertus", n: "St Albertus Magnus", dates: "1193&ndash;1280", tag: "German, Dominican",
      at: [ { p: "padua", w: "studied here and joined the Dominicans here, 1223" },
            { p: "paris", w: "taught here 1245 to 1248, with Aquinas as his student" },
            { p: "cologne", w: "taught in the Dominican school from 1248; Aquinas followed him" } ],
      line: "Tutor to Aquinas. Brought Greek and Arabic philosophy, Aristotle above all, into the University of Paris. Doctor of the Church." },
    { id: "bacon", n: "Roger Bacon", dates: "1214&ndash;1294", tag: "English, Franciscan",
      at: [ { p: "oxford", w: "studied here under Grosseteste" },
            { p: "paris", w: "taught here in the 1240s" },
            { p: "oxford", w: "back here from about 1250; joined the Franciscans about 1257" } ],
      line: "Grosseteste's student. Called the father of the scientific method. Polymath; wrote down a formula for gunpowder about 1267, independently of the Chinese." },
    { id: "bonaventure", n: "St Bonaventure", dates: "1221&ndash;1274", tag: "Italian, Franciscan",
      at: [ { p: "paris", w: "studied and taught here; made master of theology in 1257, the same day as Aquinas" } ],
      line: "Theologian and philosopher. A mystical, Platonic account of God and the world, in contrast with the rationalism of his friend Aquinas. Head of the Franciscans from 1257. Doctor of the Church." },
    { id: "aquinas", n: "St Thomas Aquinas", dates: "c. 1225&ndash;1274", tag: "Italian, Dominican",
      at: [ { p: "naples", w: "a student here from about fourteen, 1239 to 1244; joined the Dominicans" },
            { p: "paris", w: "studied under Albertus Magnus, 1245 to 1248" },
            { p: "cologne", w: "followed Albertus here, 1248 to 1252" },
            { p: "paris", w: "taught here 1256 to 1259 and again 1268 to 1272" } ],
      line: "Son of Italian nobility and a distant relative of King St Louis IX. The greatest apologist and pure rational theologian of all time. Doctor of the Church. The prayer you were handed on Day 1 is his." },
    { id: "scotus", n: "Bl. John Duns Scotus", dates: "1266&ndash;1308", tag: "Scottish, Franciscan",
      at: [ { p: "oxford", w: "studied and lectured here" },
            { p: "paris", w: "taught here, 1302 to 1307" },
            { p: "cologne", w: "taught here, and died here in 1308" } ],
      line: "The Subtle Doctor. His realist views contrasted with both Bonaventure's and Aquinas's. Argued for the Immaculate Conception six centuries before it was defined." },
    { id: "ockham", n: "William of Ockham", dates: "1285&ndash;1350", tag: "English, Franciscan",
      at: [ { p: "oxford", w: "studied and lectured here in the 1310s and 1320s" } ],
      line: "Priest, philosopher, theologian. Ockham's Razor: given several valid explanations, choose the simplest. The first to argue for a complete separation of Church and State." },
    { id: "oresme", n: "Nicole Oresme", dates: "1323&ndash;1382", tag: "French, secular clergy",
      at: [ { p: "paris", w: "studied and taught here, at the College of Navarre" } ],
      line: "Physicist and mathematician of genius. Worked out an x-and-y coordinate system without naming it, argued that the earth might turn, and held that God is Time. Bishop of Lisieux." }
  ];

  var RUN = {
    scholars: { c: "#b45309", t: "Guild of scholars", x: "the students hired the masters" },
    masters:  { c: "#0f766e", t: "Guild of masters",  x: "the teachers ran it" },
    charter:  { c: "#475569", t: "Founded by charter", x: "a king, emperor, duke, or treaty set it up, with a guild of masters inside" }
  };
  var FIELD = {
    law:  { c: "#b45309", t: "Law" },
    theo: { c: "#7c3aed", t: "Theology" },
    med:  { c: "#0f766e", t: "Medicine" },
    arts: { c: "#475569", t: "Arts and theology" }
  };
  var LENS_NOTE = {
    run:   "First the idea grew on its own, as a guild. Then kings and emperors copied it by decree.",
    field: "What each school was famous for. Most taught everything; this is the thing people travelled for.",
    lang:  "In every hall: Latin. Under each name: what was spoken outside the door.",
    who:   "Pick a name. The map shows where he studied and taught, in order. Nearly all of them were friars."
  };

  (function () {
    var wrap = $("#gl-unis"), out = $("#gl-uni-out");
    if (!wrap || !out) return;

    var byId = {};
    UNIS.forEach(function (u) { byId[u.id] = u; });

    /* ---- the chip list (CSN's fifteen only) ---- */
    var listed = UNIS.filter(function (u) { return !u.also; });
    wrap.innerHTML = listed.map(function (u) {
      return '<button class="gl-uni" type="button" aria-pressed="false" data-u="' + u.id + '">' +
             u.n + '<span class="gl-uni-y">' + u.y + "</span></button>";
    }).join("");

    var selected = null;

    function facts(u) {
      var rows = [
        ["Who ran it", u.who],
        ["In the hall", LATIN],
        ["On the street", u.street],
        ["Known for", u.known],
        ["Names you know", u.names]
      ];
      return '<dl class="gl-uni-facts">' + rows.filter(function (r) { return r[1]; }).map(function (r) {
        return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>";
      }).join("") + "</dl>";
    }

    function select(id) {
      var u = byId[id];
      var was = selected === id;
      selected = was ? null : id;

      $$(".gl-uni", wrap).forEach(function (o) {
        o.setAttribute("aria-pressed", o.getAttribute("data-u") === selected ? "true" : "false");
      });
      if (map) map.select(selected);

      if (!selected) { shut(out); return; }
      out.innerHTML = "<b>" + u.n + ", " + u.y + ".</b>" +
        (u.first ? '<span class="gl-uni-tag">' + u.first + "</span>" : "") +
        "<p>" + u.d + "</p>" + facts(u);
      open(out);
    }

    $$(".gl-uni", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () { select(btn.getAttribute("data-u")); });
    });

    /* ---- the map ---- */
    var map = buildMap();

    function buildMap() {
      var GEO = window.GUILDS_GEO;
      var host = $("#gl-map");
      if (!GEO || !GEO.land || !host) return null;

      var SVGNS = "http://www.w3.org/2000/svg";
      function svgEl(tag, attrs) {
        var n = document.createElementNS(SVGNS, tag);
        for (var k in attrs) n.setAttribute(k, attrs[k]);
        return n;
      }

      var GW = Number(GEO.viewBox.split(" ")[2]), GH = Number(GEO.viewBox.split(" ")[3]);
      var FRAME = [135, 85, 855, 672];        // crop of the generated frame, in its units
      var FW = FRAME[2] - FRAME[0], FH = FRAME[3] - FRAME[1];

      // Label offsets are in display pixels from the dot. Hand-placed: Modena
      // sits eleven pixels from Bologna at this width.
      var OFF = {
        bologna: [12, 14], modena: [-11, -4], padua: [11, -8],
        paris: [12, -5], oxford: [-11, 5], cambridge: [11, -7],
        palencia: [10, -9], salamanca: [10, 15], montpellier: [11, 13], toulouse: [-11, 5],
        prague: [11, -7], krakow: [11, -7], vienna: [11, 7], heidelberg: [11, 7],
        standrews: [11, 5], naples: [11, 7], cologne: [-11, -5]
      };

      var svg = svgEl("svg", { class: "gl-map-svg", role: "img",
        "aria-label": "Map of Europe with the first universities marked and dated" });
      svg.setAttribute("viewBox", FRAME[0] + " " + FRAME[1] + " " + FW + " " + FH);
      svg.appendChild(svgEl("rect", { x: 0, y: 0, width: GW, height: GH, class: "gl-map-sea" }));
      var land = svgEl("path", { d: GEO.land, class: "gl-map-land" });
      svg.appendChild(land);

      var route = svgEl("path", { class: "gl-map-route", d: "", "vector-effect": "non-scaling-stroke" });
      svg.appendChild(route);

      var groups = {};
      // Draw the "also" markers first so the listed schools sit on top.
      UNIS.slice().sort(function (a, b) { return (a.also ? 0 : 1) - (b.also ? 0 : 1); }).forEach(function (u) {
        var p = GEO.pts[u.id];
        if (!p) return;
        var g = svgEl("g", { class: "gl-dot-g" + (u.key ? " is-key" : "") + (u.also ? " is-also" : ""),
                             "data-id": u.id, tabindex: "0", role: "button" });
        g.setAttribute("aria-label", u.n + ", " + u.y);
        var ring = svgEl("circle", { cx: p[0], cy: p[1], class: "gl-ring", "vector-effect": "non-scaling-stroke" });
        var dot = svgEl("circle", { cx: p[0], cy: p[1], class: "gl-dot", "vector-effect": "non-scaling-stroke" });
        var t = svgEl("text", { class: "gl-map-label", "paint-order": "stroke" });
        var main = svgEl("tspan"); main.textContent = u.m || u.n;
        var sub = svgEl("tspan", { class: "gl-map-sub" }); sub.textContent = String(u.y);
        t.appendChild(main); t.appendChild(sub);
        g.appendChild(ring); g.appendChild(dot); g.appendChild(t);
        svg.appendChild(g);
        groups[u.id] = { g: g, dot: dot, ring: ring, t: t, main: main, sub: sub, p: p, u: u };
        g.addEventListener("click", function () { select(u.id); });
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(u.id); }
        });
      });

      host.innerHTML = "";
      host.appendChild(svg);

      var lens = "run", scholar = null, year = 1420;

      /* Everything sized in pixels is set from the width the map actually got. */
      function tune() {
        var box = svg.getBoundingClientRect();
        if (!box.width) return;
        var u = FW / box.width;
        // On a phone the map is a third the width of a projector; shrink the
        // type with it, down to a floor, or the labels bury the coastline.
        var k = Math.max(0.7, Math.min(1, box.width / 720));
        land.setAttribute("stroke-width", (0.9 * u).toFixed(2));
        for (var id in groups) {
          var s = groups[id], off = OFF[id] || [10, 4];
          var fs = (s.u.key ? 15 : s.u.also ? 11.5 : 13) * u * k;
          var r = (s.u.key ? 7 : s.u.also ? 4 : 5.4) * u * k;
          s.dot.setAttribute("r", r.toFixed(2));
          s.ring.setAttribute("r", (r + 4 * u).toFixed(2));
          s.ring.setAttribute("stroke-width", (2 * u).toFixed(2));
          var anchor = off[0] > 3 ? "start" : off[0] < -3 ? "end" : "middle";
          var tx = s.p[0] + off[0] * u * k, ty = s.p[1] + off[1] * u * k;
          s.t.setAttribute("font-size", fs.toFixed(2));
          s.t.setAttribute("stroke-width", (3 * u).toFixed(2));
          s.t.setAttribute("text-anchor", anchor);
          s.t.setAttribute("x", tx.toFixed(1)); s.t.setAttribute("y", ty.toFixed(1));
          s.main.setAttribute("x", tx.toFixed(1));
          s.sub.setAttribute("x", tx.toFixed(1));
          s.sub.setAttribute("dy", (fs * 1.05).toFixed(2));
          s.sub.setAttribute("font-size", (fs * 0.86).toFixed(2));
        }
      }

      function colorOf(u) {
        if (lens === "run") return RUN[u.run].c;
        if (lens === "field") return FIELD[u.field].c;
        return "#b45309";
      }
      function subOf(u) {
        if (lens === "field") return FIELD[u.field].t;
        if (lens === "lang") return u.lang;
        return String(u.y);
      }

      function curve(pts) {
        if (pts.length < 2) return "";
        var d = "M" + pts[0][0] + " " + pts[0][1];
        if (pts.length === 2) return d + "L" + pts[1][0] + " " + pts[1][1];
        for (var i = 0; i < pts.length - 1; i++) {
          var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
          d += "C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + "," +
               (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + "," +
               p2[0] + " " + p2[1];
        }
        return d;
      }

      function paint() {
        var sch = null;
        if (lens === "who" && scholar) {
          sch = SCHOLARS.filter(function (s) { return s.id === scholar; })[0];
        }
        var at = {};
        if (sch) sch.at.forEach(function (a) { at[a.p] = true; });

        for (var id in groups) {
          var s = groups[id];
          s.dot.style.fill = colorOf(s.u);
          s.sub.textContent = subOf(s.u);
          s.g.classList.toggle("is-future", s.u.y > year);
          s.g.classList.toggle("is-dim", !!sch && !at[id]);
          s.g.classList.toggle("is-sel", selected === id);
        }
        if (sch && sch.at.length > 1) {
          var pts = sch.at.map(function (a) { return GEO.pts[a.p]; }).filter(Boolean);
          // A return to the same place is drawn as a small loop out over the sea of the page.
          route.setAttribute("d", curve(pts));
          route.style.display = "";
        } else {
          route.style.display = "none";
        }
      }

      tune(); paint();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(tune);
      if ("ResizeObserver" in window) { new ResizeObserver(tune).observe(svg); }
      else { window.addEventListener("resize", tune); }

      return {
        setLens: function (l) { lens = l; paint(); },
        setScholar: function (id) { scholar = id; paint(); },
        setYear: function (y) {
          var prev = year; year = y;
          paint();
          // Pop the ones that just appeared.
          for (var id in groups) {
            var s = groups[id];
            if (s.u.y > prev && s.u.y <= y) {
              s.g.classList.remove("pop"); void s.g.getBoundingClientRect(); s.g.classList.add("pop");
            }
          }
        },
        select: function () { paint(); }
      };
    }

    /* ---- legend ---- */
    var legend = $("#gl-maplegend");
    function drawLegend(lens) {
      if (!legend) return;
      var items = [];
      if (lens === "run") {
        for (var k in RUN) items.push('<span><i style="background:' + RUN[k].c + '"></i>' + RUN[k].t + ", " + RUN[k].x + "</span>");
      } else if (lens === "field") {
        for (var f in FIELD) items.push('<span><i style="background:' + FIELD[f].c + '"></i>' + FIELD[f].t + "</span>");
      } else if (lens === "lang") {
        items.push('<span><i></i>Latin in the lecture hall, everywhere</span>');
      } else {
        items.push('<span><i></i>Where he was</span>');
        items.push('<span><i style="opacity:0.28"></i>Everywhere else</span>');
      }
      items.push('<span><i class="also"></i>Not on our list</span>');
      items.push('<span class="gl-legend-note">' + LENS_NOTE[lens] + "</span>");
      legend.innerHTML = items.join("");
    }

    /* ---- lenses ---- */
    var lensWrap = $("#gl-lens"), schWrap = $("#gl-scholars"), schLine = $("#gl-scholar-line");
    var curLens = "run", curScholar = null;

    if (schWrap) {
      schWrap.innerHTML = SCHOLARS.map(function (s) {
        return '<button class="gl-scholar" type="button" aria-pressed="false" data-s="' + s.id + '">' +
               s.n + '<span class="gl-scholar-o">' + s.tag.split(",")[1].trim() + "</span></button>";
      }).join("");
      $$(".gl-scholar", schWrap).forEach(function (btn) {
        btn.addEventListener("click", function () { setScholar(btn.getAttribute("data-s")); });
      });
    }

    function setScholar(id) {
      curScholar = curScholar === id ? null : id;
      $$(".gl-scholar", schWrap).forEach(function (o) {
        o.setAttribute("aria-pressed", o.getAttribute("data-s") === curScholar ? "true" : "false");
      });
      if (map) map.setScholar(curScholar);
      var s = SCHOLARS.filter(function (x) { return x.id === curScholar; })[0];
      if (!s) { shut(schLine); return; }
      schLine.innerHTML = "<p><b>" + s.n + "</b>, " + s.dates + ". " + s.tag + ". " + s.line + "</p>" +
        '<p class="gl-route">' + s.at.map(function (a, i) {
          return (i ? " &rarr; " : "") + "<b>" + byId[a.p].n + "</b>, " + a.w;
        }).join("") + ".</p>";
      open(schLine);
    }

    function setLens(l) {
      curLens = l;
      $$(".gl-lens-btn", lensWrap).forEach(function (o) {
        o.setAttribute("aria-pressed", o.getAttribute("data-lens") === l ? "true" : "false");
      });
      if (l === "who") { open(schWrap); if (curScholar) open(schLine); }
      else { shut(schWrap); shut(schLine); }
      if (map) map.setLens(l);
      drawLegend(l);
    }

    if (lensWrap) {
      $$(".gl-lens-btn", lensWrap).forEach(function (btn) {
        btn.addEventListener("click", function () { setLens(btn.getAttribute("data-lens")); });
      });
    }
    setLens("run");

    /* ---- the wave ---- */
    var slider = $("#gl-wave"), yearOut = $("#gl-wave-year"), countOut = $("#gl-wave-count"), play = $("#gl-wave-play");
    var raf = null;

    function setYear(y) {
      y = Math.round(y);
      if (slider && Number(slider.value) !== y) slider.value = y;
      if (yearOut) yearOut.value = String(y);
      var n = listed.filter(function (u) { return u.y <= y; }).length;
      if (countOut) countOut.textContent = n === 0 ? "none yet" : n === 1 ? "1 school" : n + " schools";
      if (map) map.setYear(y);
    }

    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (play) play.textContent = "Play the wave";
    }

    if (slider) {
      slider.addEventListener("input", function () { stop(); setYear(Number(slider.value)); });
      setYear(Number(slider.value));
    }

    if (play) {
      play.addEventListener("click", function () {
        if (raf) { stop(); return; }
        var Y0 = 1080, Y1 = 1420, RATE = 32;         // years per second
        var t0 = null;
        play.textContent = "Stop";
        setYear(Y0);
        function step(ts) {
          if (t0 === null) t0 = ts;
          var y = Y0 + (ts - t0) / 1000 * RATE;
          if (y >= Y1) { setYear(Y1); stop(); return; }
          setYear(y);
          raf = requestAnimationFrame(step);
        }
        raf = requestAnimationFrame(step);
      });
    }
  })();

  /* ------------------------------------------------------ 8. comparison */

  var CMP = [
    { q: "Who decides whether you may do this work at all?",
      g: "The guild. No membership, no shop. It controls entry to the trade itself.",
      u: "Nobody. Anyone the employer hires can do the job. A union bargains over pay and conditions after you are already in.",
      b: "The board. No license, no practice. This is the same power the guild had." },
    { q: "Who trains you?",
      g: "The guild, through years of apprenticeship living in a master's house.",
      u: "Usually the employer or a trade school. Some unions do run apprenticeships, and those are direct descendants of the guild.",
      b: "An accredited school teaches you. The board decides which schools count and tests you at the end." },
    { q: "Who sets the price of what gets made?",
      g: "The guild, for the whole city. This is one of its central jobs.",
      u: "Nobody. A union bargains over your wage, not over what the product sells for.",
      b: "Nobody. The market sets it." },
    { q: "Who checks the quality of your work?",
      g: "The guild. Fellow members inspect your shop and fine you for bad work.",
      u: "Not its job. Discipline over poor work belongs to the employer, and the union often defends the member against it.",
      b: "The board. It investigates complaints and can suspend your license." },
    { q: "Who are the members?",
      g: "Masters, who own their own shops. Business owners, not employees.",
      u: "Employees, organized to bargain with the people who own the business.",
      b: "Everyone licensed in the field, employer and employee alike." },
    { q: "Does it pray together?",
      g: "Yes. A patron saint, an altar or chapel, a feast day, a procession, Masses for dead members. The religion is not decoration, it is part of the oath.",
      u: "No.",
      b: "No." },
    { q: "Does it bury you?",
      g: "Yes. Many kept a fund for members' funerals, and for widows and orphans.",
      u: "Some have hardship or benefit funds. It is not the point of the organization.",
      b: "No." }
  ];

  (function () {
    var qs = $("#gl-cmp-qs"), out = $("#gl-cmp-out");
    if (!qs || !out) return;

    qs.innerHTML = CMP.map(function (c, n) {
      return '<button class="gl-cmp-q" type="button" aria-pressed="false" data-c="' + n + '">' + c.q + "</button>";
    }).join("");

    function show(n) {
      var c = CMP[n];
      out.innerHTML =
        '<div class="gl-cmp-col is-guild"><span class="gl-cmp-h">Medieval guild</span><p>' + c.g + "</p></div>" +
        '<div class="gl-cmp-col"><span class="gl-cmp-h">Labor union today</span><p>' + c.u + "</p></div>" +
        '<div class="gl-cmp-col"><span class="gl-cmp-h">Licensing board today</span><p>' + c.b + "</p></div>" +
        (n === 4 ? '<div class="gl-cmp-col is-guild" style="grid-column:1/-1"><span class="gl-cmp-h">This row is the one that breaks the analogy</span>' +
          "<p>A craft guild was made of shop owners. A union is made of employees, organized against owners. So the guild sits on the opposite side of the table from the union, while doing several of the same jobs. Say that out loud and the comparison stops being a slogan.</p></div>" : "");
    }

    $$(".gl-cmp-q", qs).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".gl-cmp-q", qs).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        show(parseInt(btn.getAttribute("data-c"), 10));
      });
    });

    $(".gl-cmp-q", qs).setAttribute("aria-pressed", "true");
    show(0);
  })();

  /* ------------------------------------------------------ 9. discussion */

  var DQ = [
    { star: true,
      q: "What aspects of university life today trace their origins to the Middle Ages?",
      p: "Candidates: the degree itself, the word &ldquo;master's,&rdquo; the gown and hood, the ceremony, the titles dean and chancellor and rector, the lecture, the oral exam, the library, the residential college, the campus pub. Pick the three you are most confident about and say <i>why</i> you are confident. Then pick the one that surprised you most." },
    { star: true,
      q: "How do early monastic communities connect to modern universities? Be specific.",
      p: "&ldquo;Be specific&rdquo; means name a thing, not a mood. The library. The copied text. The timetable that divides the day by a bell. The community that lives where it studies. Teachers who are not raising families. The rule that you must read the argument you disagree with before answering it. Which of those did an abbey do first, and which is a later invention?" },
    { star: false,
      q: "A guild protected its members by keeping other people out. Was that just?",
      p: "Now change one thing. The person kept out is a refugee who bakes better bread than anyone in town, and whose children are hungry. Does your answer survive that? If it does, say what principle it rests on. If it does not, say what you actually believe." },
    { star: false,
      q: "Should the people already doing a job get to decide who else may do it?",
      p: "You probably said yes for surgeons. Barbers and hair braiders need a license in most states too. Where exactly is the line, and what makes it the line? Notice that you are now having a live argument about American law, using a thirteenth-century institution as the test case." },
    { star: false,
      q: "Our blacksmith could not get paid. Who protects a worker today when someone with more power refuses to pay them?",
      p: "Name the actual institution, not the idea. Then name what it costs to use it, how long it takes, and what you need in writing beforehand. Would a man with four children and an empty purse use it?" },
    { star: false,
      q: "The guild set the price of bread. Who sets it now, and is that better?",
      p: "Better for whom? Answer separately for the baker, for the ordinary customer, and for the person in town with the least money. If your answer changes depending on who you are, say so, because that is the honest answer." },
    { star: false,
      q: "Guilds began as a way for a poor boy with no land to climb. By the 1400s, some had made mastership almost hereditary. What happened?",
      p: "Now name a modern institution you think started as a ladder and turned into a gate. Defend the comparison, and let somebody argue with you about it." }
  ];

  (function () {
    var wrap = $("#gl-dq");
    if (!wrap) return;

    wrap.innerHTML = DQ.map(function (d, n) {
      return '<div class="gl-dq-card' + (d.star ? " starred" : "") + '">' +
             "<p>" + d.q + "</p>" +
             '<button class="gl-push" type="button" data-d="' + n + '">More</button>' +
             '<p class="gl-dq-more gl-panel" data-more="' + n + '">' + d.p + "</p></div>";
    }).join("");

    $$(".gl-push", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var more = wrap.querySelector('[data-more="' + btn.getAttribute("data-d") + '"]');
        var isOpen = more.classList.contains("open");
        if (isOpen) { shut(more); btn.innerHTML = "More"; }
        else { open(more); btn.innerHTML = "Less"; }
      });
    });
  })();

})();
