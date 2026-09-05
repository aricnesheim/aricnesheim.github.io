# aricnesheim.com — class resources site

This folder IS the website. The main pages are:

- `index.html` — landing page (weekly notes + links to each class)
- `history.html`, `theology.html`, `literature.html`, `choir.html` — one page per class
- `year.html` — interactive four-course calendar for students and families
- `contact.html`, `contact.js` — the Contact page and its email composer
- `404.html` — the branded not-found page
- History tools: `history-maps.html` (Map Trainer), `history-crusades.html`,
  `history-clari.html` (Clari & the 4th Crusade), `history-ab.html` (Before &
  After), `history-guilds.html` (Guilds); each is described below
- Literature tools: `literature-inferno.html` (the Map of Hell),
  `literature-inferno-drill.html` (the Inferno Drill),
  `literature-simile-essay.html` (the Super Simile Essay assignment page)
- Theology: `theology-reading-companion.html` (Source: Codex/GPT, see below)
- `style.css` — all the design (Fraunces + Inter, one accent color per class)
- `year.css`, `year.js` — layout and interaction for the year map
- `player.js` — the choir practice player and score viewer
- `audio/` — practice recordings
- `scores/` — score PDFs

## The Road Ahead cards

`data/upcoming.json` is exported from the four Scope & Sequence builds by
`Planning/_tools/website-upcoming-export.py` (outside this repo). Each class
page's "Road ahead" card renders the next stretch of meetings from it,
filtered by today's date in the browser, so it advances on its own. After any
schedule re-flow: re-run the exporter, commit, push (Schedule Change Protocol
step 6).

## The Map of Hell (Literature)

`literature-inferno.html` is the interactive map of Dante's *Inferno*, linked
from the Literature page. Four files:

- `literature-inferno.html` — the shell and the icon sprite (14 inline SVG
  icons, one visual language, no image files)
- `literature-inferno.css` — scoped styling, including the projector view
- `literature-inferno-data.js` — **all the content**; nothing a student reads
  lives in the renderer
- `literature-inferno.js` — draws the funnel from the geometry table and runs
  the page
- `files/literature/inferno/` — 19 public domain plates, resized to 1200px and
  compressed (4.5 MB total). `_credits.json` holds the Commons metadata they
  were downloaded with.

The funnel is generated SVG, not a scanned picture with hotspots. Every circle
is a real button, it scales to any screen, and it works with the wifi down.
Botticelli's *Chart of Hell* and Caetani's 1855 plates are shown at the bottom
of the page for comparison rather than used as the interface, because their
labels are tiny and in Italian.

**Content standard.** Each circle carries only what the poem supplies: canto
numbers, the guardian, the punishment as Dante describes it, the souls he
names, and one open question. No interpretation and no summary that could
stand in for the reading. Questions marked `questionOwn: true` are Mr.
Nesheim's own from the lesson plans. Keep it that way when editing.

**After a schedule re-flow.** The `schedule` array at the bottom of
`literature-inferno-data.js` maps class dates to the highest canto read by
that date, taken from the adopted Rhythm B Scope and Sequence. It drives the
"we are here" marker and the status line. Update it whenever the Literature
calendar moves (Schedule Change Protocol). Note that
`05 Sources & Handouts/Dante Reading Schedule (Semester 1).md` is Rhythm A and
superseded; do not take dates from it.

**Cache busting.** The `?v=` query on the CSS and JS tags must be bumped when
either file changes, or browsers will keep the old copy.

## The Inferno Drill (Literature)

`literature-inferno-drill.html` is the quiz-prep drill for the *Inferno*
reading quizzes, linked from the Literature page beside the Map of Hell.
Three files:

- `literature-inferno-drill.html` — the shell
- `literature-inferno-drill.css` — scoped `.dr-*` styling, including the
  presentation view
- `literature-inferno-drill.js` — builds the question pool and runs the drill

It has **no content file of its own**: every question is generated from
`literature-inferno-data.js`, the Map of Hell's data, so the two can never
disagree and the drill never says more than the poem supplies. The places are
the neutrals at the gate, Circles I to VI, Circle VII and its three rings,
Circle VIII and its ten ditches, Circle IX and its four rounds. Six kinds of
question: the sin, the contrapasso (first sentence of the punishment), the
sinners (each named soul), the guardian, which circle, and the cantos. A wrong
answer shows the right one and names the canto to reread; there is no
explanation.

The sets are the three reading quizzes (dates in the `QUIZZES` table at the top
of the JS: update them when a quiz moves), "Read so far" (from the Map of
Hell's `schedule` array), and all of Hell. The drill is the Map Trainer's
Leitner box; progress is per set in `localStorage` under `l11inferno:v1:`.

**Cache busting.** Bump the `?v=` query on the CSS, JS, and data tags when
any of them changes.

## The Map Trainer (History)

`history-maps.html` drills the History 11 map quizzes, linked from the History
page. Five files:

- `history-maps.html` — the shell
- `history-maps.css` — scoped styling, including the projector view
- `history-maps-data.js` — which items belong to which quiz, the quiz dates,
  and the three quizzes the trainer does not cover yet
- `history-maps.js` — draws each map and runs the drill
- `history-maps-geo.js` — **generated**, do not hand-edit

Five maps: modern Europe, Spain, France, Italy, and Europe in 1500. Three modes:
Find it (a name is given, the student clicks the place), Name it (a place is
highlighted, the student picks the name), and Study (every label shown). The map
fills in as answers come in, the way a paper quiz does.

**The drill** is a small Leitner box. An item is learned after `LEARNED_AT`
right answers; a wrong answer resets it and re-asks it a few items later. The
progress bar counts every right answer, not only finished items, so it moves on
the first pass. Progress is per map in `localStorage` under `h11maps:v1:`.

**Item lists** follow CSN's own word banks in `01 Curriculum (CSN)/Chesterton
History Discipline Resource Folder (2024)/Maps and Word Banks/`, so the drill
tests what the quiz tests. Spain is the exception: CSN supplies a blank Spain
map with no word bank, so that list was built from the course itself and is the
one list worth Aric's review.

**Regenerating the geometry.** The builder and its source data live outside this
repo, in `2026-27/History 11/05 Sources & Handouts/Map Trainer/_build/`. See the
README there. Geometry comes from Natural Earth (public domain); the Europe in
1500 layer is carried over from the Europa Atlas build.

**Item ids are prefixed by kind** (`rg-`, `co-`, `ct-`, `wa-`, `mi-`) because
Spain has both a region and a city called Madrid, and another pair called
Valencia. Without the prefix they collide and the drill double-counts.

**After a schedule re-flow.** Quiz dates live in `history-maps-data.js`. Update
them there.

**Cache busting.** Bump the `?v=` query on the CSS and JS tags when either
changes.

## The Crusades reference (History)

`history-crusades.html` is a student-facing reference for the Crusades, linked
from the History page. Four files:

- `history-crusades.html` — the shell and all of the prose
- `history-crusades.css` — scoped `.cr-*` styling for the entries, the timeline
  and the maps
- `history-crusades.js` — builds the timeline and draws the route maps
- `history-crusades-geo.js` — **generated**, do not hand-edit

**The timeline** runs 1060 to 1300 and is drawn to scale, so the forty-eight
quiet years between the First and Second Crusades take up forty-eight years of
width. Each bar links to its own section, and the two shaded bands underneath
are the only stretches when the holy places were in Christian hands: 1099 to
1187, and 1229 to 1244. Editing the dates means editing `CRUSADES`, `HELD` and
`EVENTS` at the top of `history-crusades.js`, and keeping them agreeing with
the prose and the "Dates to know" table.

**The maps** all share one Lambert azimuthal frame over the Mediterranean, and
each one crops that frame to whatever its own expedition touched, so two
crusades can be compared by eye. Routes are lists of place ids in the `MAPS`
table; `land`, `sea` and `weak` (remnants, or a march that never arrived) are
the three line styles. Place labels are hand-placed per map, because the Levant
packs six places into a thumb's width and no automatic solver reads better than
a choice; an `off: [x, y]` label is positioned in display pixels and gets a
leader line back to its dot.

Sizes are set from JS rather than CSS. Because every map crops the same frame
differently, a stroke or a type size in user units would be a hairline on the
wide maps and a slab on the tight ones, so `tune()` recomputes them from the
width each map actually got, and re-solves the frame against it.

**Regenerating the geometry.** Same builder directory as the Map Trainer,
`2026-27/History 11/05 Sources & Handouts/Map Trainer/_build/`, script
`build_crusades_map.py`. Coastlines are Natural Earth (public domain). The
generated frame carries a wide margin of land past every route on purpose: a
place label sitting outside the coastline data would be cropped with it.

**Cache busting.** Bump the `?v=` query on the CSS and JS tags when any of them
changes.

**Content standard.** It carries dates, geography, and names only. It states on
the page that it is not a substitute for the binder sources, and it ends on the
questions rather than on answers, matching the "No Neutral View" handouts.

It follows the CSN *Course Overview and Note to the Teacher 3.0* directly:
"confront the difficult things ... wicked crusaders," and the High Middle Ages
are "not a golden age of the Church." So the massacre at Jerusalem in 1099,
Richard's execution of the prisoners at Acre, the sack of Zara, the sack of
Constantinople, and the Albigensian Crusade all stay on the page, alongside the
eighty-eight years of protected pilgrimage and the Lisbon campaign of 1147.
The closing questions are CSN's own discussion prompts from the Week 1 lesson
plans, put into student-facing wording. Keep both halves when editing: cutting
the hard facts breaks the curriculum guideline, and so does cutting the gains.

## The Guilds page (History)

`history-guilds.html` is the Unit 1 click-through on the guilds, linked from
the History page. Four files:

- `history-guilds.html` — the shell and all of the prose
- `history-guilds.css` — scoped `.gl-*` styling
- `history-guilds.js` — the widgets (blacksmith scene, four-types quiz, the
  ladder, the rules toggle, the universities map, the union comparison, the
  discussion cards). All the content those widgets show lives at the top of
  the section that draws it.
- `history-guilds-geo.js` — **generated**, do not hand-edit

**The universities map** (section 7) puts CSN's proliferation list on one
Lambert frame of Latin Christendom: the fifteen schools from Bologna 1088 to
St Andrews 1413, in CSN's order and with CSN's dates (Lecture Notes 3.0,
"Medieval Universities"). Naples and Cologne are drawn hollow and labelled
"not on our list"; they are there because Aquinas started at Naples and
Albertus Magnus taught at Cologne. The `UNIS` table carries, per school, who
ran it (a guild of scholars, a guild of masters, or a chartered foundation),
the street language beside the Latin of the hall, what it was known for, and
which of the scholar-saints were there. The `SCHOLARS` table is CSN's roster
of nine, with CSN's dates and tags, and each one's road in order. Four
lenses recolor the same dots; the year slider hides every school founded
after the year shown, so the wave can be drawn by hand on a projector.

**Regenerating the geometry.** Same builder directory as the Map Trainer,
`2026-27/History 11/05 Sources & Handouts/Map Trainer/_build/`, script
`build_universities_map.py`. Coastlines are Natural Earth (public domain).

**Cache busting.** Bump the `?v=` query on the CSS, JS, and geo tags when any
of them changes.

**Content standard.** The seven liberal arts are named with CSN's own
one-line framing for each half, and the music question is asked, not
answered. The page carries dates, places, and names; the argument is for the
room.

## Provenance note

`files/history/shared-era-timeline.html` is Codex/GPT work product (from
Aric's `output/html/` folder), hosted here unmodified at Aric's request.
Source: Codex/GPT. Do not fold it into Claude-authored material.

`year.html`, `year.css`, and `year.js`, plus the homepage calendar feature,
are Codex/GPT work product created August 25, 2026. The page reads the shared
`data/upcoming.json` schedule when available and retains audited fallback dates.
Do not represent this feature as Claude-authored material.

`theology-reading-companion.html`, its scoped stylesheet, renderer, source-link
catalog, and content data are Codex/GPT work product created August 26, 2026
and expanded August 27.
The selectable guides cover Matthew 2:1–4:25 and Matthew 5:13–7:29, the portions
of the Sept. 1 and Sept. 2 readings outside their annotated pericopes. Keep
summaries paraphrased, verse references exact, and explicit textual links
distinct from patristic interpretation, Thomistic commentary, and Church
teaching. Attribute material in the Catena Aurea to the Father Aquinas quotes
unless the comment is Aquinas's own.
Keep every displayed source reference represented in
`theology-reading-companion-sources.js`; the source audit should fail when a
reading, scene, pericope, or commentary citation has no direct link.

Calendar copy should sound like Mr. Nesheim speaking in class: state the
classes, dates, and connection directly. Avoid slogans, marketing language,
grand claims, and decorative metaphors. Student and family questions should be
short, specific, and answerable from the courses.

## How updates work

Aric tells Claude the week's homework, notes, or new links in chat; Claude edits
these files and publishes. Nothing here needs to be edited by hand.

Homework specifically is single-sourced: edit `data/homework.json`, run
`Planning/_tools/website-homework-build.py` (outside this repo), and it renders
the same data into every class page's Homework card and the home page's
"Homework at a glance" card (between the `hw:` marker comments), then stamps
the footer dates. Never edit between the markers by hand.

## The Contact page

`contact.html` sends nothing itself. The boxes are assembled by `contact.js`
into a `mailto:` link, so the visitor's own email app opens with the message
written and they send it from their own address to Aric's work address. That
means no third-party form service, no account, no vendor holding student
messages, and no new channel outside the school's own mail.

A form that POSTs to `mailto:` is unreliable in modern browsers, which is why
this is done in script. Where a device has no email app registered the button
does nothing, so the address is also printed on the page with a copy button.
Messages long enough to risk truncation in a `mailto:` URL are refused with a
note pointing at that address instead.

The address lives in one place: the `#address` span in `contact.html`.
`contact.js` reads it from there, so changing it in the markup is enough.

## Adding a choir piece

Every piece gets ONE slug: the title in lowercase with hyphens
(example: "Sicut Cervus" → `sicut-cervus`). Two folders use that slug:

**1. Audio** → `audio/<slug>/`, one file per part, exported from Logic as MP3:

- `soprano.mp3`, `alto.mp3`, `tenor.mp3`, `bass.mp3`
- `full-choir.mp3` (everyone together)
- `accompaniment.mp3` (instrumental only, for singing along unaided)
- any extra part works too (`descant.mp3`, `organ.mp3`, ...) — just name it
  after the part and tell Claude

**2. Scores** → `scores/<slug>/`, PDFs:

- `full-score.pdf`
- per-part PDFs if desired: `soprano.pdf`, `alto.pdf`, `tenor.pdf`, `bass.pdf`

Then tell Claude the piece title and composer. Claude adds the card to
`choir.html` with a Listen button and a Score button for whatever files exist.
Missing parts are fine: a Listen button with no file shows "not posted yet,"
and Claude simply leaves out Score buttons for PDFs that don't exist. Parts can
be added over time.

Format notes: MP3 is best for the web (in Logic: File → Bounce, or
Share → Export Song to Disk, choose MP3). iPhone voice memos (.m4a) also work.
Avoid WAV for real pieces; the files are about ten times larger.

`audio/demo/` and `scores/demo/` are placeholders for testing the player.
Delete the demo card from `choir.html` once real pieces exist.

## How publishing works

The site has been live at https://aricnesheim.com since August 18, 2026:
GitHub Pages serves this repo (`aricnesheim/aricnesheim.github.io`, branch
`main`), `CNAME` holds the domain, and the Squarespace DNS points at GitHub
(four A records plus the `www` CNAME; HTTPS enforced). "Publishing" means
committing in this folder and pushing; the site updates in about a minute.

Stage files by name, never `git add -A`: the working tree also holds
Codex/GPT work in progress that is not meant to be published yet (see the
provenance note above).

## The Admin page (private)

`admin/` is Aric's own corner: the daily play-by-play lesson plans with an
archive of every day that has one, the week sheets and choir bundles, his
notes, the bells and duties for the day, visitor stats, and a few teacher
tools (late-work calculator, school-day counter, key dates, Educate
categories, quick links, site health). Footer link on every page, or
aricnesheim.com/admin/ directly. `robots.txt` and a `noindex` meta keep it out
of search engines.

**How it is private on a public, static site.** There is no server to check a
password, so everything private is encrypted before it is committed.
`admin/vault/` holds only ciphertext: `index.json` (config, the list of days,
calendar facts) plus one file per day, week, and reference document. Each file
is AES-256-GCM with a key derived from the passphrase by PBKDF2-SHA256
(600,000 iterations). `admin.js` derives the key in the browser (Web Crypto)
and decrypts on demand. "Remember on this device" keeps the derived key, never
the passphrase, in localStorage; Lock forgets it. Nothing is sent anywhere.

**Sources and the build live outside this repo**, in
`Planning/_tools/website-admin-build.py` (finds every dated plan under each
course's `03 Lesson Prep`, the week sheets, the archived closed weeks, and
`Planning/Admin Notes/*.md`; converts docx and Markdown to HTML) and
`website-admin-crypt.js` (the encryption; passphrase in the macOS Keychain,
service `aricnesheim-admin`). The private config, `admin-config.json`, carries
the links, bells, duties, key dates, grading rules, and the GoatCounter code
and token. Only changed days are re-encrypted on each build, so commits stay
small. Never copy any of those files into this repo.

**Publishing:** build, then stage `admin/` by name, commit, push. The vault
files are opaque, so diffs are meaningless; the commit message says what
changed.

**Visitor stats** use GoatCounter (`analytics.js` on every page; a no-op until
the site code is filled in). No cookies, no personal data, no consent banner.
The dashboard is embedded on the Admin page with a secret token, and the
Stats tab has a switch that stops Aric's own visits from counting.

**Never in the vault:** gradebook data, rosters, behavior notes, the Daily Log.
Encryption keeps outsiders out of a public repo; it is not a FERPA-grade
system, so student records stay off the site entirely. The build prints a
warning when a plan mentions a student by name.
