/* literature-inferno-data.js
 *
 * Content for the Inferno map. Everything a student reads on that page lives
 * here, so the wording can be changed without touching the renderer.
 *
 * STANDARD FOR THIS FILE: text-anchored only. Each circle carries what the
 * poem itself supplies — the canto numbers, the guardian, the punishment as
 * Dante describes it, the souls he names — plus one open question. No
 * interpretation, no "what this means," no summary that could stand in for
 * the reading. Students do that work in class.
 *
 * Translation in use: Anthony Esolen, Modern Library.
 * Questions marked {own: true} are Mr. Nesheim's own from the lesson plans.
 */

window.INFERNO_DATA = (function () {
  'use strict';

  /* ---------------------------------------------------------------- circles
   * `span` is the vertical run of the band in the funnel drawing, `w` the
   * half-width at the top and bottom of that band. Circle 1 is widest; the
   * cone closes to a point at Cocytus.
   */
  var circles = [
    {
      id: 'wood',
      slot: 'above',
      roman: '',
      label: 'The dark wood',
      name: 'The Dark Wood',
      italian: 'La selva oscura',
      cantos: 'Canto I',
      cantoNums: [1],
      region: 'Before the gate',
      guardian: 'A leopard, a lion, a she-wolf',
      icon: 'wood',
      image: 'dark-wood',
      place:
        'Not part of Hell. Dante wakes here at the midpoint of his life, ' +
        'off the straight road, at the foot of a hill lit by the sun.',
      punishment: null,
      punishmentLabel: 'What happens here',
      punishmentText:
        'Three beasts turn him back from the hill: a leopard, a lion, and a ' +
        'she-wolf. The she-wolf drives him down toward the dark. Virgil ' +
        'appears and offers another road.',
      named: ['Virgil', 'Beatrice (spoken of, in Canto II)'],
      question: 'Why was Dante full of cowardice, and why should he not be?',
      questionOwn: true
    },

    {
      id: 'gate',
      slot: 'above',
      roman: '',
      label: 'The gate and the neutrals',
      name: 'The Gate of Hell',
      italian: 'La porta infernale',
      cantos: 'Canto III',
      cantoNums: [3],
      region: 'Ante-Hell',
      guardian: 'Charon, at the Acheron',
      icon: 'gate',
      image: 'gate-charon',
      place:
        'Inside the gate but before the first circle, between the door and ' +
        'the river Acheron.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'Those who lived without blame and without praise run forever after ' +
        'a banner that will not stand still, stung by wasps and hornets, ' +
        'their blood and tears feeding worms at their feet. Heaven will not ' +
        'have them and Hell will not take them in. Beyond them Charon ferries ' +
        'the damned across the Acheron.',
      named: [
        'The angels who took no side',
        'One "who made the great refusal" (Dante does not give the name)',
        'Charon'
      ],
      note:
        'The inscription over the gate ends "Abandon every hope, you who ' +
        'enter." Read the whole inscription before class.',
      question:
        'These souls are not in any circle and get no name. Why does Dante ' +
        'refuse them even a punishment of their own?'
    },

    {
      id: 'circle-1',
      slot: 1,
      roman: 'I',
      label: 'Limbo',
      name: 'Limbo',
      italian: 'Limbo',
      cantos: 'Canto IV',
      cantoNums: [4],
      region: 'The virtuous without baptism',
      guardian: 'None named',
      icon: 'castle',
      image: 'limbo',
      place: 'The first ring, just past the Acheron.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'No torment. The air trembles with sighs. They did not sin, but they ' +
        'lived before Christ or without baptism, and so they live in desire ' +
        'with no hope of seeing God. A noble castle stands inside seven ' +
        'walls, lit by a fire against the dark.',
      named: [
        'Homer, Horace, Ovid, Lucan',
        'Aristotle, "the master of those who know"',
        'Socrates, Plato, Seneca, Euclid, Ptolemy',
        'Avicenna, Averroes, Saladin',
        'Hector, Aeneas, Caesar, Camilla, Lucretia',
        'Virgil himself lives here'
      ],
      note:
        'Virgil says one came here in power and took Adam, Abel, Noah, Moses, ' +
        'Abraham, David, and others out. Watch how he tells it.',
      question:
        '"Pity" appears twice in Cantos IV and V. Is it the same emotion? Is ' +
        'either justified?',
      questionOwn: true
    },

    {
      id: 'circle-2',
      slot: 2,
      roman: 'II',
      label: 'Lust',
      name: 'Lust',
      italian: 'Lussuria',
      cantos: 'Canto V',
      cantoNums: [5],
      region: 'Incontinence',
      guardian: 'Minos',
      icon: 'whirlwind',
      image: 'lust',
      place:
        'The first circle of the punished. Minos stands at the entrance and ' +
        'wraps his tail around himself to say how far down a soul goes.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'A black wind that never rests sweeps the souls before it, whirling ' +
        'and striking them. They gave reason over to appetite, and now they ' +
        'are carried.',
      named: [
        'Semiramis',
        'Dido',
        'Cleopatra',
        'Helen',
        'Achilles',
        'Paris',
        'Tristan',
        'Francesca da Rimini and Paolo'
      ],
      note:
        'Francesca says a book brought them to it. Dante faints at the end ' +
        'of the canto.',
      question:
        'What do the bird images in Canto V indicate about the nature of sin?',
      questionOwn: true
    },

    {
      id: 'circle-3',
      slot: 3,
      roman: 'III',
      label: 'Gluttony',
      name: 'Gluttony',
      italian: 'Gola',
      cantos: 'Canto VI',
      cantoNums: [6],
      region: 'Incontinence',
      guardian: 'Cerberus',
      icon: 'rain',
      image: 'gluttony',
      place: 'The third circle, under a sky that never clears.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'Cold heavy rain, hail, and dirty snow fall without stopping. The ' +
        'ground turns to stinking mud and the souls lie flat in it. Cerberus, ' +
        'three-headed, barks over them and claws them.',
      named: ['Ciacco, the Florentine'],
      note:
        'Ciacco gives the first prophecy about Florence, and names five men ' +
        'Dante will meet lower down.',
      question:
        'Ciacco knows what is coming for Florence. Why does Dante give a ' +
        'prophecy to a glutton?'
    },

    {
      id: 'circle-4',
      slot: 4,
      roman: 'IV',
      label: 'Greed and waste',
      name: 'Avarice and Prodigality',
      italian: 'Avarizia e prodigalità',
      cantos: 'Canto VII',
      cantoNums: [7],
      region: 'Incontinence',
      guardian: 'Plutus',
      icon: 'weight',
      image: 'avarice',
      place: 'The fourth circle, a wide ring split into two moving crowds.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'Two crowds shove enormous weights around the ring with their chests. ' +
        'They meet, crash, turn, and roll back, shouting at each other: "Why ' +
        'do you hoard?" and "Why do you waste?" They will do it forever.',
      named: [
        'No individual is named',
        'Dante says many are clergy, popes, and cardinals'
      ],
      note:
        'Virgil answers here with his speech on Fortune. Mark it. It is not a ' +
        'digression.',
      question:
        'The hoarders and the wasters are punished together, in one circle, ' +
        'against each other. What do they share?'
    },

    {
      id: 'circle-5',
      slot: 5,
      roman: 'V',
      label: 'Wrath and sullenness',
      name: 'Wrath and the Sullen',
      italian: 'Ira e accidia',
      cantos: 'Cantos VII–VIII',
      cantoNums: [7, 8],
      region: 'Incontinence',
      guardian: 'Phlegyas',
      icon: 'marsh',
      image: 'wrath',
      place: 'The marsh of the Styx, at the foot of the cliff below Circle 4.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'The wrathful strike, tear, and bite each other on the surface of the ' +
        'mud. Beneath them the sullen lie buried in the slime, gurgling a hymn ' +
        'they cannot get out: they were sullen in the sweet air, and now the ' +
        'mud has them. Phlegyas ferries Dante and Virgil across.',
      named: ['Filippo Argenti'],
      note:
        'Virgil praises Dante for how he treats Argenti. Notice that, and ' +
        'notice that Dante watches him torn apart.',
      question: 'How does Virgil prove himself as a guide?',
      questionOwn: true
    },

    {
      id: 'circle-6',
      slot: 6,
      roman: 'VI',
      label: 'Heresy',
      name: 'Heresy',
      italian: 'Eresia',
      cantos: 'Cantos IX–XI',
      cantoNums: [9, 10, 11],
      region: 'Inside the walls of Dis',
      guardian: 'The Furies, and the fallen angels on the wall',
      icon: 'tomb',
      image: 'heresy',
      place:
        'Inside the iron walls of the city of Dis. The gate is shut against ' +
        'them until a messenger from heaven opens it with a touch.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'A plain of open tombs, each one glowing with fire, standing open ' +
        'until the Last Judgment, when they will be shut forever. The souls ' +
        'lie inside. They denied the soul lives on, and they are sealed in ' +
        'their graves.',
      named: [
        'Farinata degli Uberti',
        'Cavalcante de’ Cavalcanti',
        'The Emperor Frederick II',
        'Cardinal Ottaviano degli Ubaldini',
        'Pope Anastasius (his tomb, in Canto XI)'
      ],
      note:
        'Canto XI is where Virgil lays out the plan of the whole rest of ' +
        'Hell. Come to class with that structure in front of you.',
      question:
        'Farinata and Cavalcante share one tomb and never once hear each ' +
        'other speak. What is that?'
    },

    {
      id: 'circle-7',
      slot: 7,
      roman: 'VII',
      label: 'Violence',
      name: 'Violence',
      italian: 'Violenza',
      cantos: 'Cantos XII–XVII',
      cantoNums: [12, 13, 14, 15, 16, 17],
      region: 'Three rings',
      guardian: 'The Minotaur, and the centaurs',
      icon: 'centaur',
      image: 'violence-minotaur',
      place:
        'A broken cliff face guarded by the Minotaur, then three rings, one ' +
        'inside the next.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'Three rings, for three objects of violence: your neighbor, yourself, ' +
        'and God.',
      rings: [
        {
          n: 'Ring 1',
          title: 'Against your neighbor',
          cantos: 'Canto XII',
          text:
            'The Phlegethon, a river of boiling blood, sunk to the depth each ' +
            'soul deserves. Centaurs patrol the bank and shoot anyone who ' +
            'rises higher than his portion.',
          named: [
            'Alexander',
            'Dionysius',
            'Ezzelino',
            'Guy de Montfort',
            'Attila',
            'Chiron, Nessus, and Pholus, the centaurs'
          ],
          image: 'violence-minotaur',
          icon: 'centaur'
        },
        {
          n: 'Ring 2',
          title: 'Against yourself',
          cantos: 'Canto XIII',
          text:
            'A pathless wood of dark warped trees. The suicides are the ' +
            'trees. They can only speak where they are broken, and Harpies ' +
            'nest in them and feed on the leaves. The squanderers are hunted ' +
            'through the same wood by black hounds and torn to pieces.',
          named: [
            'Pier delle Vigne',
            'Lano da Siena',
            'Iacopo da Sant’Andrea',
            'An unnamed Florentine'
          ],
          image: 'violence-wood',
          icon: 'tree'
        },
        {
          n: 'Ring 3',
          title: 'Against God, nature, and art',
          cantos: 'Cantos XIV–XVII',
          text:
            'A plain of burning sand with flakes of fire falling slowly on ' +
            'it. The blasphemers lie flat on their backs. Those violent ' +
            'against nature run without stopping. The usurers sit, each with ' +
            'a purse at his neck bearing his family arms.',
          named: [
            'Capaneus',
            'Brunetto Latini',
            'Guido Guerra, Tegghiaio Aldobrandi, Iacopo Rusticucci',
            'Geryon, who carries them down'
          ],
          image: 'violence-fire',
          icon: 'flamerain'
        }
      ],
      named: [],
      note:
        'They leave Circle 7 on the back of Geryon, who has an honest face ' +
        'and the body of a serpent.',
      question: 'Should Dante take Brunetto’s advice?',
      questionOwn: true
    },

    {
      id: 'circle-8',
      slot: 8,
      roman: 'VIII',
      label: 'Fraud',
      name: 'Fraud',
      italian: 'Malebolge',
      cantos: 'Cantos XVIII–XXX',
      cantoNums: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      region: 'Ten ditches',
      guardian: 'Geryon brings them down; the Malebranche guard ditch 5',
      icon: 'ditches',
      image: 'fraud-demons',
      place:
        'A wide floor of grey stone, cut into ten concentric ditches with ' +
        'stone bridges running over them, sloping down toward the well at ' +
        'the center.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'Ten ditches, one kind of fraud in each. This is the longest stretch ' +
        'of the poem: thirteen cantos.',
      bolge: [
        { n: 1, title: 'Panderers and seducers', cantos: 'XVIII', text: 'Marched in two directions and whipped by horned demons.', named: 'Venedico Caccianemico, Jason' },
        { n: 2, title: 'Flatterers', cantos: 'XVIII', text: 'Sunk in human filth.', named: 'Alessio Interminei, Thaïs' },
        { n: 3, title: 'Simoniacs', cantos: 'XIX', text: 'Head down in stone holes, the soles of their feet on fire.', named: 'Pope Nicholas III; Boniface VIII and Clement V are foretold' },
        { n: 4, title: 'Diviners and sorcerers', cantos: 'XX', text: 'Heads twisted backward, walking and weeping down their own backs.', named: 'Tiresias, Manto, Michael Scot, Guido Bonatti' },
        { n: 5, title: 'Barrators', cantos: 'XXI–XXII', text: 'Held under boiling pitch, hooked by demons if they surface.', named: 'The Malebranche: Malacoda, Scarmiglione, and the rest' },
        { n: 6, title: 'Hypocrites', cantos: 'XXIII', text: 'Walking in cloaks gilded on the outside and lead all through.', named: 'Catalano and Loderingo; Caiaphas, staked to the ground' },
        { n: 7, title: 'Thieves', cantos: 'XXIV–XXV', text: 'Among serpents, bitten, burned to ash, re-formed, and traded shape with the snakes.', named: 'Vanni Fucci, Cianfa, Agnello, Buoso' },
        { n: 8, title: 'Counselors of fraud', cantos: 'XXVI–XXVII', text: 'Each soul walks inside a single flame that speaks with its tip.', named: 'Ulysses and Diomedes; Guido da Montefeltro' },
        { n: 9, title: 'Sowers of discord', cantos: 'XXVIII', text: 'Split open by a devil with a sword as they come around, healed as they walk, split again.', named: 'Mohammed and Ali; Curio; Mosca dei Lamberti; Bertran de Born, carrying his own head' },
        { n: 10, title: 'Falsifiers', cantos: 'XXIX–XXX', text: 'Disease: scab, madness, dropsy, fever, for falsifying metals, persons, coin, and words.', named: 'Griffolino, Capocchio, Gianni Schicchi, Myrrha, Master Adam, Sinon' }
      ],
      named: [],
      note:
        'At the bottom of Circle 8 the giants stand in the well: Nimrod, ' +
        'Ephialtes, Antaeus. Antaeus sets them down on the ice.',
      question: 'Why does Dante damn Ulysses? Does that seem just?',
      questionOwn: true
    },

    {
      id: 'circle-9',
      slot: 9,
      roman: 'IX',
      label: 'Treachery',
      name: 'Treachery',
      italian: 'Cocito',
      cantos: 'Cantos XXXI–XXXIV',
      cantoNums: [31, 32, 33, 34],
      region: 'Four rounds of ice',
      guardian: 'The giants stand around the rim',
      icon: 'ice',
      image: 'treachery-ugolino',
      place:
        'The bottom of the universe. A frozen lake, not a fire: Cocytus, held ' +
        'hard by the wind off Lucifer’s wings.',
      punishmentLabel: 'The punishment',
      punishmentText:
        'Souls are set in the ice, deeper by round. In the first they can ' +
        'still bend their necks. In the last they are covered entirely, fixed ' +
        'in whatever posture they fell.',
      rounds: [
        { n: 'Caina', title: 'Traitors to kin', named: 'Camicion de’ Pazzi; the brothers Napoleone and Alessandro degli Alberti' },
        { n: 'Antenora', title: 'Traitors to country', named: 'Bocca degli Abati; Count Ugolino and Archbishop Ruggieri; Ganelon' },
        { n: 'Ptolomea', title: 'Traitors to guests', named: 'Friar Alberigo; Branca d’Oria, whose body still walks the earth' },
        { n: 'Judecca', title: 'Traitors to lords and benefactors', named: 'Judas, Brutus, Cassius, in the three mouths of Lucifer' }
      ],
      named: [],
      note:
        'Lucifer has three faces, red, pale yellow, and black, and six wings ' +
        'that make the wind. Dante and Virgil climb down his flank, pass the ' +
        'center of the earth, and come out to see the stars.',
      question:
        'Does Dante’s ordering of the kinds of treachery seem just?',
      questionOwn: true
    },

    {
      id: 'exit',
      slot: 'below',
      roman: '',
      label: 'Out to the stars',
      name: 'The Way Out',
      italian: 'A riveder le stelle',
      cantos: 'Canto XXXIV',
      cantoNums: [34],
      region: 'The climb through the center',
      guardian: 'None',
      icon: 'stars',
      image: 'lucifer',
      place:
        'Down Lucifer’s side, through the point where all weight pulls, ' +
        'and up a hidden channel to the other side of the world.',
      punishmentLabel: 'What happens here',
      punishmentText:
        'Halfway down Lucifer, Virgil turns over, and what was down becomes ' +
        'up. They climb by a stream to an opening and come out on the shore ' +
        'of the mountain of Purgatory before dawn.',
      named: [],
      note: 'The last word of the Inferno is stars. Every canticle ends on it.',
      question:
        'What has Dante learned in Hell? What does he still need?',
      questionOwn: true
    }
  ];

  /* ---------------------------------------------------------- image credits
   * Filled from Wikimedia Commons file metadata at download time. All plates
   * are in the public domain. Doré's engravings are from the 1861 French
   * edition and its later printings.
   */
  var credits = {
    'dark-wood': { title: 'Dante lost in the dark wood', artist: 'Gustave Doré', date: '1861', file: 'File:Dante lost in the dark forest, illustration to Dante’s Inferno by Gustave Doré.jpg' },
    'gate-charon': { title: 'Charon, the ferryman of Hell', artist: 'Gustave Doré', date: '1861', file: 'File:Gustave Dore, The Divine comedy, Inferno, plate 9, Charon, The Ferryman of Hell.jpg' },
    'limbo': { title: 'Limbo: Dante among the poets', artist: 'Gustave Doré', date: '1861', file: 'File:Gustave Doré - Dante Alighieri - Inferno - Plate 12 (Canto IV - Limbo, Dante is accepted as an equal by the great Greek and Roman poets).jpg' },
    'lust': { title: 'Paolo and Francesca in the whirlwind', artist: 'Gustave Doré', date: '1861', file: 'File:Francesca da Rimini and Paolo among the lustful, carried by the infernal whirlwind, illustration to Dante’s Inferno by Gustave Doré.jpg' },
    'gluttony': { title: 'Cerberus', artist: 'Gustave Doré', date: '1861', file: 'File:Inferno Canto 6 - Cerberus (148618330).jpg' },
    'avarice': { title: 'Hoarders and wasters', artist: 'Gustave Doré', date: '1861', file: 'File:Gustave Doré - Dante Alighieri - Inferno - Plate 22 (Canto VII - Hoarders and Wasters).jpg' },
    'wrath': { title: 'Virgil shows the souls of the wrathful', artist: 'Gustave Doré', date: '1861', file: 'File:DVinfernoVirgilShowSoulsOfWrathful m.jpg' },
    'heresy': { title: 'Farinata degli Uberti addresses Dante', artist: 'Gustave Doré', date: '1861', file: 'File:DVinfernoUbertiAddressesDante m.jpg' },
    'violence-minotaur': { title: 'The Minotaur on the broken cliff', artist: 'Gustave Doré', date: '1861', file: 'File:DVinfernoMinotaurOnCliff m.jpg' },
    'violence-wood': { title: 'The wood of the suicides', artist: 'Gustave Doré', date: '1861', file: 'File:Gustave Doré - The Inferno, Canto 13.jpg' },
    'violence-fire': { title: 'The violent under the rain of fire', artist: 'Gustave Doré', date: '1861', file: 'File:DVinfernoViolentInRainOfFire m.jpg' },
    'geryon': { title: 'Into the abyss on Geryon’s back', artist: 'Gustave Doré', date: '1861', file: 'File:DVinfernoIntoAbyssOnGeryonsBack m.jpg' },
    'fraud-demons': { title: 'The demons threaten Virgil', artist: 'Gustave Doré', date: '1861', file: 'File:DVinfernoDemonsThreatenVirgil.jpg' },
    'fraud-ulysses': { title: 'The flaming spirits of the evil counsellors', artist: 'Gustave Doré', date: '1861', file: 'File:DVinfernoFlamingSpiritsOfEvilCounsellors m.jpg' },
    'treachery-ugolino': { title: 'Ugolino in the ice', artist: 'Gustave Doré', date: '1861', file: 'File:Inferno Canto 32 Doré.jpg' },
    'lucifer': { title: 'Lucifer, king of Hell', artist: 'Gustave Doré', date: '1861', file: 'File:Gustave Dore Inferno34.jpg' },
    'botticelli-chart': { title: 'La mappa dell’Inferno (the Chart of Hell)', artist: 'Sandro Botticelli', date: 'about 1485', file: 'File:Sandro Botticelli - La Carte de l’Enfer.jpg' },
    'caetani-cross': { title: 'Veduta interna dell’Inferno (cross section)', artist: 'Michelangelo Caetani, Duke of Sermoneta', date: '1855', file: 'File:Michelangelo Caetani Cross Section of Hell 1855 Cornell CUL PJM 1071 04.jpg' },
    'caetani-plan': { title: 'Map of Hell, seen from above', artist: 'Michelangelo Caetani, Duke of Sermoneta', date: '1855', file: 'File:Michelangelo Caetani, Map of Hell, 1855 Cornell CUL PJM 1071 03.jpg' }
  };

  /* ------------------------------------------------------------- the plates
   * The historical maps, shown at the bottom of the page for comparison.
   */
  var plates = [
    {
      image: 'botticelli-chart',
      blurb:
        'Botticelli drew the whole funnel on one sheet of parchment for ' +
        'Lorenzo di Pierfrancesco de’ Medici. It is the earliest famous ' +
        'picture of the shape of Hell.'
    },
    {
      image: 'caetani-cross',
      blurb:
        'The Duke of Sermoneta cut the earth in half to show Jerusalem on ' +
        'top and Lucifer at the center. The labels are in Italian and very ' +
        'small. This is the plate our own map is drawn from.'
    },
    {
      image: 'caetani-plan',
      blurb: 'The same Hell from above, with every ditch of Circle 8 numbered.'
    }
  ];

  /* ------------------------------------------------------------- the schedule
   * Which cantos are in hand by which class day, taken from the adopted
   * Rhythm B Scope and Sequence (reading days Tue/Thu, discussion Mon/Wed/Fri).
   * `through` is the highest canto the class has read by the end of that date.
   * Update this when the schedule re-flows. Re-laid Sep 4, 2026 after the
   * Sep 2 one-week shift (quiz on I–XIII moved to Mon Sep 14).
   */
  var schedule = [
    { date: '2026-08-26', through: 0 },
    { date: '2026-08-27', through: 1 },
    { date: '2026-08-31', through: 6 },
    { date: '2026-09-01', through: 6 },
    { date: '2026-09-02', through: 8 },
    { date: '2026-09-03', through: 9 },
    { date: '2026-09-04', through: 9 },
    { date: '2026-09-08', through: 11 },
    { date: '2026-09-09', through: 11 },
    { date: '2026-09-10', through: 13 },
    { date: '2026-09-11', through: 13 },
    { date: '2026-09-14', through: 13 },
    { date: '2026-09-15', through: 15 },
    { date: '2026-09-16', through: 15 },
    { date: '2026-09-17', through: 16 },
    { date: '2026-09-18', through: 17 },
    { date: '2026-09-21', through: 20 },
    { date: '2026-09-22', through: 21 },
    { date: '2026-09-23', through: 23 },
    { date: '2026-09-24', through: 24 },
    { date: '2026-09-25', through: 25 },
    { date: '2026-09-28', through: 29 },
    { date: '2026-09-29', through: 30 },
    { date: '2026-09-30', through: 33 },
    { date: '2026-10-01', through: 34 }
  ];

  return {
    circles: circles,
    credits: credits,
    plates: plates,
    schedule: schedule,
    imageDir: 'files/literature/inferno/'
  };
})();
