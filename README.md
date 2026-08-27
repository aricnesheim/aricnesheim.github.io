# aricnesheim.com — class resources site

This folder IS the website. The main pages are:

- `index.html` — landing page (weekly notes + links to each class)
- `history.html`, `theology.html`, `literature.html`, `choir.html` — one page per class
- `year.html` — interactive four-course calendar for students and families
- `contact.html`, `contact.js` — the Contact page and its email composer
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

## Going live (one-time setup, not done yet)

The domain aricnesheim.com is registered at Squarespace. Plan: host these files
free on GitHub Pages and point the domain at it from Squarespace's DNS settings.
Claude walks Aric through this when ready. After that, "publishing" means
Claude pushes this folder to GitHub; changes appear on the site in about a
minute.
