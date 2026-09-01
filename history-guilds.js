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

  /* ---------------------------------------------------- 7. universities */

  var UNIS = [
    { n: "Bologna", y: 1088, d: "<b>The first university in Western Europe</b>, and formed as a guild <b>of scholars</b>, meaning of students. The students were the corporation. They hired their professors, paid them directly out of their own pockets, and fined them for starting a lecture late, for finishing early, for skipping a difficult passage, or for failing to draw a crowd. Read that list again." },
    { n: "Paris", y: 1150, d: "A guild <b>of masters</b>, not of students. Here the teachers organized, and the teachers ran it. Paris became the great center of theology in Europe, where Albertus Magnus taught and Aquinas studied." },
    { n: "Oxford", y: 1167, d: "A guild <b>of masters</b>, on the Paris model. It grew quickly after 1167, when English scholars left Paris and came home. Memorize this one alongside Bologna and Paris." },
    { n: "Modena", y: 1175, d: "Northern Italy, following the Bologna model of law teaching." },
    { n: "Palencia", y: 1208, d: "The first university in Spain, founded by the king of Castile. It did not survive long, and Salamanca took its place." },
    { n: "Cambridge", y: 1209, d: "Founded by masters who fled Oxford after a quarrel between the town and the scholars ended with students hanged. The English universities begin as a guild dispute that turned lethal." },
    { n: "Salamanca", y: 1218, d: "Spain's enduring university, and one of the oldest in continuous operation anywhere." },
    { n: "Montpellier", y: 1220, d: "In southern France, and famous above all for medicine." },
    { n: "Padua", y: 1222, d: "Founded by masters and students who walked out of Bologna over their liberties. Notice the pattern: a guild that does not like its terms leaves and founds another one." },
    { n: "Toulouse", y: 1229, d: "Founded as part of the settlement that ended the Albigensian Crusade, with the explicit job of teaching orthodox theology in a region that had been full of heresy." },
    { n: "Prague", y: 1348, d: "The first university in Central Europe." },
    { n: "Jagiellonian", y: 1364, d: "In Krak&oacute;w. We count it as the first university in Eastern Europe. Copernicus studied here." },
    { n: "Vienna", y: 1365, d: "Founded a year after Krak&oacute;w, and still running." },
    { n: "Heidelberg", y: 1386, d: "The first university in Germany." },
    { n: "St Andrews", y: 1413, d: "In Scotland, and the last stop on our list. Three hundred and twenty-five years after Bologna, the model has crossed the whole of Europe." }
  ];

  (function () {
    var wrap = $("#gl-unis"), out = $("#gl-uni-out");
    if (!wrap || !out) return;

    wrap.innerHTML = UNIS.map(function (u, n) {
      return '<button class="gl-uni" type="button" aria-pressed="false" data-u="' + n + '">' +
             u.n + '<span class="gl-uni-y">' + u.y + "</span></button>";
    }).join("");

    $$(".gl-uni", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var u = UNIS[parseInt(btn.getAttribute("data-u"), 10)];
        var was = btn.getAttribute("aria-pressed") === "true";
        $$(".gl-uni", wrap).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        if (was) { shut(out); return; }
        btn.setAttribute("aria-pressed", "true");
        out.innerHTML = "<b>" + u.n + ", " + u.y + ".</b> " + u.d;
        open(out);
      });
    });
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
