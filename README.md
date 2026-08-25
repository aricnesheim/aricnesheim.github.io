# aricnesheim.com — class resources site

This folder IS the website. Five pages, one stylesheet, one script:

- `index.html` — landing page (weekly notes + links to each class)
- `history.html`, `theology.html`, `literature.html`, `choir.html` — one page per class
- `style.css` — all the design (Fraunces + Inter, one accent color per class)
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

## How updates work

Aric tells Claude the week's homework, notes, or new links in chat; Claude edits
these files and publishes. Nothing here needs to be edited by hand.

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
