/* history-maps-data.js
 *
 * What each map quiz covers and when it falls. The geometry and the item names
 * live in history-maps-geo.js, which is generated; this file says which items
 * belong to which quiz, how they are grouped for study, and where the list
 * came from.
 *
 * Item lists follow CSN's own word banks in
 * "01 Curriculum (CSN)/Chesterton History Discipline Resource Folder (2024)/
 *  Maps and Word Banks/", so the drill tests what the quiz tests.
 *
 * Dates come from the History 11 Scope and Sequence. Update them here after a
 * schedule re-flow.
 */

window.HISTORY_MAPS = (function () {
  'use strict';

  var quizzes = [
    {
      id: 'europe',
      map: 'europe',
      title: 'Modern Europe',
      date: '2026-09-01',
      unit: 'Unit 1 · The High Middle Ages begins',
      source: 'CSN “Europe Word Bank”',
      note:
        'The one map with no history in it. Learn the shape of the continent ' +
        'first and every later map has something to hang on. The September 1 ' +
        'quiz asks for twenty countries plus four bonus, so drill Countries ' +
        'before Capitals if time is short.',
      groups: [
        { name: 'Countries', kinds: ['country', 'micro'] },
        { name: 'Capitals', kinds: ['city'] }
      ]
    },
    {
      id: 'spain',
      map: 'spain',
      title: 'Spain',
      date: '2026-09-21',
      unit: 'Unit 2 · Iberian kingdoms and early France',
      source: 'Built for this course. CSN supplies a blank Spain map but no word bank.',
      note:
        'The regions here are the present-day ones. The kingdoms we read about ' +
        'sit on top of them: León and Castile in the north and centre, Aragon ' +
        'and Catalonia in the east, Navarre in the Pyrenees, and al-Andalus in ' +
        'the south until the Reconquista closes on Granada.',
      groups: [
        { name: 'Regions', kinds: ['region'] },
        { name: 'Cities', kinds: ['city'] },
        { name: 'Seas and water', kinds: ['water'] }
      ]
    },
    {
      id: 'france',
      map: 'france',
      title: 'France',
      date: '2026-11-20',
      unit: 'Units 6 and 7 · The Black Death, the Hundred Years War',
      source: 'CSN “Word Bank - France”',
      note:
        'These are the old provinces, not the current administrative regions. ' +
        'That is deliberate: Normandy, Burgundy, Aquitaine, and Champagne are ' +
        'the names the Hundred Years War is fought over.',
      groups: [
        { name: 'Provinces', kinds: ['region'] },
        { name: 'Cities', kinds: ['city'] },
        { name: 'Seas and water', kinds: ['water'] }
      ]
    },
    {
      id: 'italy',
      map: 'italy',
      title: 'Italy',
      date: '2026-12-11',
      unit: 'Units 8 and 9 · The Ottomans, the Renaissance',
      source: 'CSN “Italy Map Wordbank”, modern half',
      note:
        'For the Renaissance states themselves, Milan, Venice, Florence, the ' +
        'Papal States, Naples, use the Europe in 1500 map.',
      groups: [
        { name: 'Regions', kinds: ['region'] },
        { name: 'Cities', kinds: ['city', 'micro'] },
        { name: 'Seas and water', kinds: ['water'] }
      ]
    },
    {
      id: 'europe1500',
      map: 'europe1500',
      title: 'Europe in 1500',
      date: '2027-04-26',
      unit: 'Units 13 to 15 · The Reformations',
      source: 'Composed borders, carried over from the Europa Atlas',
      note:
        'The only historical map in the set. Borders around 1500 to 1520, drawn ' +
        'as teaching approximations rather than survey lines.',
      groups: [
        { name: 'States and realms', kinds: ['region'] }
      ]
    }
  ];

  /* Quizzes on the calendar that this trainer does not cover yet. Listed so
     the page tells the truth about the year rather than implying five is all
     there are. */
  var pending = [
    {
      title: 'England',
      date: '2026-10-12',
      unit: 'Unit 3 · England and Germany',
      why:
        'CSN’s word bank for this one is the British Isles about 700: Wessex, ' +
        'Mercia, Northumbria, the Danelaw, Pictland, Strathclyde, and the Irish ' +
        'kingdoms. Those borders have to be composed by hand rather than taken ' +
        'from modern data.'
    },
    {
      title: 'Asia',
      date: '2026-10-30',
      unit: 'Unit 5 · The Mongol Empire',
      why:
        'CSN’s Asia bank is physical geography, not political: mountain ranges, ' +
        'plateaus, deserts, plains, and rivers. It needs a different data set, ' +
        'and about a third of the items are not in it at all.'
    },
    {
      title: 'Cumulative, then and now',
      date: '2027-05-24',
      unit: 'The year in maps',
      why:
        'This one falls out of the others once they all exist. It draws from ' +
        'every map in the set.'
    }
  ];

  /* How many times an item must be answered correctly before it counts as
     learned, and how many other items go by before a missed one comes back. */
  var LEARNED_AT = 2;
  var REQUEUE_GAP = 3;
  /* Roughly how many other items go by before a right-but-not-yet-learned
     item comes round again. Small enough to finish inside one sitting. */
  var SECOND_LOOK = 12;

  return {
    quizzes: quizzes,
    pending: pending,
    LEARNED_AT: LEARNED_AT,
    REQUEUE_GAP: REQUEUE_GAP,
    SECOND_LOOK: SECOND_LOOK,
    storageKey: 'h11maps:v1:'
  };
})();
