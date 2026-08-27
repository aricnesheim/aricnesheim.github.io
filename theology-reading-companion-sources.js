(function () {
  "use strict";

  const registry = window.THEOLOGY_READING_COMPANION_REGISTRY || { guides: [] };
  const references = {};

  function source(label, url) {
    return { label: label, url: url };
  }

  function catechismPage(page) {
    return "https://www.usccb.org/sites/default/files/flipbooks/catechism/" + page + "/";
  }

  const urls = {
    catechismSpiritFullness: "https://www.vatican.va/content/catechism/en/part_one/section_two/chapter_three/article_8/iv_the_spirit_of_christ_in_the_fullness_of_time.html",
    catechismBaptism: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_1/ii_baptism_in_the_economy_of_salvation.html",
    catechismConversion: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_two/article_4/iii_the_conversion_of_the_baptized.html",
    catechismPenance: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_two/article_4/v_the_many_forms_of_penance_in_christian_life.html",
    catechismHealing: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_two/article_5/i_its_foundations_in_the_economy_of_salvation.html",
    catechismConscience: "https://www.vatican.va/content/catechism/en/part_three/section_one/chapter_one/article_6/iii_to_choose_in_accord_with_conscience.html",
    catechismVirtues: "https://www.vatican.va/content/catechism/en/part_three/section_one/chapter_one/article_7/ii_the_theological_virtues.html",
    catechismNewLaw: "https://www.vatican.va/content/catechism/en/part_three/section_one/chapter_three/article_1/iii_the_new_law_or_the_law_of_the_gospel.html",
    catechismWitness: "https://www.vatican.va/content/catechism/en/part_three/section_one/chapter_three/article_3/iii_moral_life_and_missionary_witness.html",
    catechismIdolatry: "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_one/article_1/iii_you_shall_have_no_other_gods_before_me.html",
    catechismPeace: "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_two/article_5/iii_safeguarding_peace.html",
    catechismMarriage: "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_two/article_6/iv_offenses_against_the_dignity_of_marriage.html",
    catechismPoor: "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_two/article_7/vi_love_for_the_poor.html",
    catechismTruthWitness: "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_two/article_8/ii_to_bear_witness_to_the_truth.html",
    catechismTruthOffenses: "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_two/article_8/iii_offenses_against_truth.html",
    catechismPurity: "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_two/article_9/i_purification_of_the_heart.html",
    catechismPoverty: "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_two/article_10/iii_poverty_of_heart.html",
    catechismOurFather: "https://www.vatican.va/content/catechism/en/part_four/section_two/article_1.html",
    catechismPetitions: "https://www.vatican.va/content/catechism/en/part_four/section_two/article_3.html",
    holyInnocents: "https://www.usccb.org/prayer-and-worship/liturgical-year/christmas/christmas-december-28",
    augustineBook1: "https://www.newadvent.org/fathers/16011.htm",
    augustineBook2: "https://www.newadvent.org/fathers/16012.htm",
    chrysostom8: "https://www.newadvent.org/fathers/200108.htm",
    chrysostom11: "https://www.newadvent.org/fathers/200111.htm",
    chrysostom14: "https://www.newadvent.org/fathers/200114.htm",
    cyprianPrayer: "https://www.newadvent.org/fathers/050704.htm",
    summaIII39: "https://www.newadvent.org/summa/4039.htm#article1",
    summaIII41: "https://www.newadvent.org/summa/4041.htm#article4",
    summaIii106: "https://www.newadvent.org/summa/2106.htm#article1",
    summaIii107: "https://www.newadvent.org/summa/2107.htm#article2",
    summaIii108: "https://www.newadvent.org/summa/2108.htm#article3",
    catenaMatthew2: "https://www.ecatholic2000.com/catena/untitled-09.shtml",
    catenaMatthew4: "https://www.ecatholic2000.com/catena/untitled-11.shtml",
    catenaMatthew5: "https://www.ecatholic2000.com/catena/untitled-12.shtml",
    catenaMatthew6: "https://www.ecatholic2000.com/catena/untitled-13.shtml",
    catenaMatthew7: "https://www.ecatholic2000.com/catena/untitled-14.shtml",
    gregoryHomily10: "https://thedivinelamp.wordpress.com/2012/01/03/pope-st-gregory-the-greats-homily-on-matt-21-12-for-the-epiphany-of-the-lord/"
  };

  const exactSources = {
    "Catechism of the Catholic Church 528": [
      source("Catechism of the Catholic Church 528", catechismPage(135))
    ],
    "Catechism of the Catholic Church 530": [
      source("Catechism of the Catholic Church 530", catechismPage(136))
    ],
    "Catechism of the Catholic Church 530 · Feast of the Holy Innocents, December 28": [
      source("Catechism of the Catholic Church 530", catechismPage(136)),
      source("Feast of the Holy Innocents, December 28", urls.holyInnocents)
    ],
    "Catechism of the Catholic Church 531–533": [
      source("Catechism of the Catholic Church 531–532", catechismPage(136)),
      source("Catechism of the Catholic Church 533", catechismPage(137))
    ],
    "Catechism of the Catholic Church 523, 717–720": [
      source("Catechism of the Catholic Church 523", catechismPage(134)),
      source("Catechism of the Catholic Church 717–720", urls.catechismSpiritFullness)
    ],
    "Catechism of the Catholic Church 535–537, 1224–1225": [
      source("Catechism of the Catholic Church 535–537", catechismPage(138)),
      source("Catechism of the Catholic Church 1224–1225", urls.catechismBaptism)
    ],
    "Catechism of the Catholic Church 538–540": [
      source("Catechism of the Catholic Church 538–539", catechismPage(139)),
      source("Catechism of the Catholic Church 540", catechismPage(140))
    ],
    "Catechism of the Catholic Church 541–544, 1427": [
      source("Catechism of the Catholic Church 541–542", catechismPage(140)),
      source("Catechism of the Catholic Church 543–544", catechismPage(141)),
      source("Catechism of the Catholic Church 1427", urls.catechismConversion)
    ],
    "Catechism of the Catholic Church 551–553": [
      source("Catechism of the Catholic Church 551–552", catechismPage(143)),
      source("Catechism of the Catholic Church 553", catechismPage(144))
    ],
    "Catechism of the Catholic Church 547–550": [
      source("Catechism of the Catholic Church 547–549", catechismPage(142)),
      source("Catechism of the Catholic Church 550", catechismPage(143))
    ],
    "Catechism of the Catholic Church 1503–1505": [
      source("Catechism of the Catholic Church 1503–1505", urls.catechismHealing)
    ],
    "Catechism of the Catholic Church 2044–2046, 2472": [
      source("Catechism of the Catholic Church 2044–2046", urls.catechismWitness),
      source("Catechism of the Catholic Church 2472", urls.catechismTruthWitness)
    ],
    "Catechism of the Catholic Church 1965–1968": [
      source("Catechism of the Catholic Church 1965–1968", urls.catechismNewLaw)
    ],
    "Catechism of the Catholic Church 2302–2303": [
      source("Catechism of the Catholic Church 2302–2303", urls.catechismPeace)
    ],
    "Catechism of the Catholic Church 2517–2520": [
      source("Catechism of the Catholic Church 2517–2520", urls.catechismPurity)
    ],
    "Catechism of the Catholic Church 2380–2386": [
      source("Catechism of the Catholic Church 2380–2386", urls.catechismMarriage)
    ],
    "Catechism of the Catholic Church 2303, 2843–2845": [
      source("Catechism of the Catholic Church 2303", urls.catechismPeace),
      source("Catechism of the Catholic Church 2843–2845", catechismPage(685))
    ],
    "Catechism of the Catholic Church 1434, 2447": [
      source("Catechism of the Catholic Church 1434", urls.catechismPenance),
      source("Catechism of the Catholic Church 2447", urls.catechismPoor)
    ],
    "Catechism of the Catholic Church 2759–2761, 2803–2806": [
      source("Catechism of the Catholic Church 2759–2760", "https://www.vatican.va/content/catechism/en/part_four/section_two.html"),
      source("Catechism of the Catholic Church 2761", urls.catechismOurFather),
      source("Catechism of the Catholic Church 2803–2806", urls.catechismPetitions)
    ],
    "Catechism of the Catholic Church 1434, 1438": [
      source("Catechism of the Catholic Church 1434, 1438", urls.catechismPenance)
    ],
    "Catechism of the Catholic Church 2113, 2544–2547": [
      source("Catechism of the Catholic Church 2113", urls.catechismIdolatry),
      source("Catechism of the Catholic Church 2544–2547", urls.catechismPoverty)
    ],
    "Catechism of the Catholic Church 2828–2831, especially 2830": [
      source("Catechism of the Catholic Church 2828–2831, especially 2830", catechismPage(681))
    ],
    "Catechism of the Catholic Church 2477–2478": [
      source("Catechism of the Catholic Church 2477–2478", urls.catechismTruthOffenses)
    ],
    "Catechism of the Catholic Church 1970": [
      source("Catechism of the Catholic Church 1970", urls.catechismNewLaw)
    ],
    "Catechism of the Catholic Church 1815, 1966, 1972": [
      source("Catechism of the Catholic Church 1815", urls.catechismVirtues),
      source("Catechism of the Catholic Church 1966, 1972", urls.catechismNewLaw)
    ],
    "Matthew 7:12 · Catechism of the Catholic Church 1789, 1970": [
      source("Matthew 7:12", "https://bible.usccb.org/bible/matthew/7"),
      source("Catechism of the Catholic Church 1789", urls.catechismConscience),
      source("Catechism of the Catholic Church 1970", urls.catechismNewLaw)
    ],
    "Gregory the Great, Forty Gospel Homilies 10.6 · Catena Aurea on Matthew 2:11": [
      source("Gregory the Great, Forty Gospel Homilies 10 (see §6)", urls.gregoryHomily10),
      source("Catena Aurea on Matthew 2:11", urls.catenaMatthew2)
    ],
    "John Chrysostom, Homily 8 on Matthew, 4": [
      source("John Chrysostom, Homily 8 on Matthew, §4", urls.chrysostom8)
    ],
    "John Chrysostom, Homily 11 on Matthew, 3": [
      source("John Chrysostom, Homily 11 on Matthew, §3", urls.chrysostom11)
    ],
    "John Chrysostom, Homily 14 on Matthew, 1–2": [
      source("John Chrysostom, Homily 14 on Matthew, §§1–2", urls.chrysostom14)
    ],
    "Thomas Aquinas, Summa Theologiae III, q.39, a.1": [
      source("Thomas Aquinas, Summa Theologiae III, q.39, a.1", urls.summaIII39)
    ],
    "Thomas Aquinas, Summa Theologiae III, q.41, a.4": [
      source("Thomas Aquinas, Summa Theologiae III, q.41, a.4", urls.summaIII41)
    ],
    "Gregory the Great, Homilies on the Gospels 5.1 · Catena Aurea on Matthew 4:20": [
      source("Gregory the Great, Homily 5.1 (quoted in the Catena Aurea)", urls.catenaMatthew4),
      source("Catena Aurea on Matthew 4:20", urls.catenaMatthew4)
    ],
    "Thomas Aquinas, Catena Aurea on Matthew 5:13–16": [
      source("Thomas Aquinas, Catena Aurea on Matthew 5:13–16", urls.catenaMatthew5)
    ],
    "Thomas Aquinas, Summa Theologiae I–II, q.106, a.1 · q.107, a.2": [
      source("Thomas Aquinas, Summa Theologiae I–II, q.106, a.1", urls.summaIii106),
      source("Thomas Aquinas, Summa Theologiae I–II, q.107, a.2", urls.summaIii107)
    ],
    "Catena Aurea on Matthew 5:23–24": [
      source("Catena Aurea on Matthew 5:23–24", urls.catenaMatthew5)
    ],
    "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 4": [
      source("Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 4", urls.summaIii108)
    ],
    "Cyprian, On the Lord's Prayer · Catena Aurea on Matthew 6:9": [
      source("Cyprian, On the Lord's Prayer", urls.cyprianPrayer),
      source("Catena Aurea on Matthew 6:9", urls.catenaMatthew6)
    ],
    "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3": [
      source("Thomas Aquinas, Summa Theologiae I–II, q.108, a.3", urls.summaIii108)
    ],
    "Jerome in the Catena Aurea on Matthew 6:24": [
      source("Jerome in the Catena Aurea on Matthew 6:24", urls.catenaMatthew6)
    ],
    "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 5": [
      source("Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 5", urls.summaIii108)
    ],
    "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 6": [
      source("Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 6", urls.summaIii108)
    ],
    "Gregory the Great, Moralia on Job XX.7 · Catena Aurea on Matthew 7:21–23": [
      source("Gregory the Great, Moralia on Job XX.7", "https://www.lectionarycentral.com/GregoryMoralia/Book20.html"),
      source("Catena Aurea on Matthew 7:21–23", urls.catenaMatthew7)
    ]
  };

  const scriptureBooks = [
    { name: "Deuteronomy", slug: "deuteronomy" },
    { name: "Jeremiah", slug: "jeremiah" },
    { name: "Matthew", slug: "matthew" },
    { name: "Numbers", slug: "numbers" },
    { name: "2 Kings", slug: "2kings" },
    { name: "Exodus", slug: "exodus" },
    { name: "Isaiah", slug: "isaiah" },
    { name: "Romans", slug: "romans" },
    { name: "Hosea", slug: "hosea" },
    { name: "Micah", slug: "micah" },
    { name: "Psalm", slug: "psalms" }
  ];

  function scriptureSources(reference) {
    let currentBook = null;
    const resolved = [];
    const parts = reference.split(" · ");

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index].trim();
      const matchedBook = scriptureBooks.find(function (book) {
        return part.indexOf(book.name + " ") === 0;
      });
      let citation = part;

      if (matchedBook) {
        currentBook = matchedBook;
        citation = part.slice(matchedBook.name.length + 1);
      } else if (!currentBook) {
        return [];
      }

      const chapterMatch = citation.match(/^(\d+)/);
      if (!chapterMatch) {
        return [];
      }

      resolved.push(source(
        currentBook.name + " " + citation,
        "https://bible.usccb.org/bible/" + currentBook.slug + "/" + chapterMatch[1]
      ));
    }

    return resolved;
  }

  function augustineSources(reference) {
    const prefix = "Augustine, On the Sermon on the Mount ";
    if (reference.indexOf(prefix) !== 0) return [];

    return reference.slice(prefix.length).split(" · ").map(function (section) {
      const trimmed = section.trim();
      const bookUrl = trimmed.indexOf("II.") === 0 ? urls.augustineBook2 : urls.augustineBook1;
      return source(prefix + trimmed, bookUrl);
    });
  }

  function resolveReference(reference) {
    if (exactSources[reference]) return exactSources[reference];

    const augustine = augustineSources(reference);
    if (augustine.length) return augustine;

    return scriptureSources(reference);
  }

  function addReference(reference) {
    if (!reference || references[reference]) return;
    references[reference] = resolveReference(reference);
  }

  (Array.isArray(registry.guides) ? registry.guides : []).forEach(function (guide) {
    addReference(guide.fullReading);
    addReference(guide.annotatedFocus);

    (guide.scenes || []).forEach(function (scene) {
      addReference(scene.reference);
      addReference((scene.pericopeReference || "").replace(/^Look back: /, ""));
      (scene.connections || []).forEach(function (connection) {
        addReference(connection.ref);
      });
    });
  });

  window.THEOLOGY_READING_COMPANION_SOURCES = { references: references };
})();
