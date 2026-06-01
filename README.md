# The Backpack 1.31.2 — Split Build

The Backpack is a direct-open HTML/CSS/JS workspace for daily tracking, reference notes, code snippets, quick post-it notes, and reusable content templates.

Version **1.31.2** updates the 1.30 baseline with a cleaner tab registry, a promoted-widget shelf, and an upload-first content workflow. Backpack is now expected to open from `index.html` without a local server.

## Run the split build

Open `index.html` directly in the browser.

```txt
/backpack/index.html
```

Promoted Event Gantt shelf controls were compacted and the duplicated inner Unpin control was removed. Content documents are loaded through upload controls inside the relevant tabs. The app no longer checks neighboring Markdown/HTML files with `fetch()`, so it does not need `python -m http.server` for normal use.

## Folder map

```txt
/backpack
├─ index.html
├─ css/
│  └─ backpack.css
├─ js/
│  └─ backpack.js
├─ content/                  Optional authoring/source examples
│  ├─ notes.md
│  ├─ basic_newton.md
│  ├─ basic_newton_quote.html
│  ├─ wiki/                    Template - Medium upload bundle examples
│  │  ├─ index__orientation.md
│  │  ├─ template_overview__registry_model.md
│  │  └─ ...
│  └─ images/
│     ├─ bee_worker.svg
│     ├─ bee_hive.svg
│     ├─ bee_flower.svg
│     ├─ bee_food.svg
│     └─ bee_gallery.svg
├─ docs/
│  ├─ calendar.md
│  ├─ quick-notes.md
│  ├─ templates.md
│  ├─ data-and-imports.md
│  ├─ regression-checklist.md
│  ├─ release-1.30.md
│  ├─ release-1.31.md
│  └─ release-1.31.2.md
└─ README.md
```

The `content/` folder remains useful as an authoring scaffold, but the live app reads user content from uploads and cached state.

## Current tab map

| Tab | Purpose | Data/storage notes |
|---|---|---|
| Calendar | Start Day arrival flow, month view, events, repeat-this-month copies, Event Gantt, calendar tools | Stored in `appState.calendar`; full export and calendar-only export both support this data. Event Gantt can be pinned to the promoted shelf. |
| Notes | Main Markdown import display | Upload Markdown; Markdown is escaped and cached in `appState.notes`. |
| Code Blocks | Copy-ready command/template snippets with placeholders | Static snippet definitions in JS; uses placeholder values from Settings. |
| Quick Notes | Fixed-grid post-it board | Stored in `appState.quickNotes`; supports board-only export/import. |
| CSS Museum | Instructional component/template examples | HTML comments in examples are documentation. |
| Template - Basic | Simple custom page template using Newton `F = ma` | Upload Markdown and trusted HTML, or load the bundled demo. |
| Template - Medium | Three-column wiki-style Bees page | Upload a multi-file Markdown bundle from `content/wiki/`, plus optional page images and side-note Markdown. Uploaded images are stored as data URLs in state. |
| Placeholders | Project paths, reusable values, header quote, path derivation | Stored in `appState.placeholders`; used by snippets, templates, Markdown, and Museum examples. |

## Global controls

Top-right controls are icon-only to preserve compact layout:

| Icon | Function |
|---|---|
| `⤴` | Export full Backpack state. |
| `⤵` | Import full Backpack state. |
| `◐ / ☼` | App chrome dark/light theme. |
| `◨ / ◩` | Reading-window theme, independent from app theme. |
| `▤ / ▥` | Compact/readable density. |
| `♿` | Accessible mode: stronger geometry and less motion. |

## Tab registry and promoted shelf

Tabs are now registered with one object each:

```js
{ id, label, icon, group, render, bind }
```

The binding function travels with the tab definition, so future tabs do not need a second `if` chain. This is the first step toward declarative template tabs.

Promotable widgets live in `promotedWidgets`. A promoted widget can stay visible above the workspace while the user moves through other tabs. In 1.31.2, **Event Gantt** is the first promoted widget and can be pinned/unpinned from the Calendar Gantt header.

## Theme and interaction state language

The UI should remain understandable without depending only on color.

Current visual rules:

- Hover is temporary chrome: inset shift, rail, or inner frame.
- Focus is stronger than hover and should support keyboard navigation.
- Selected calendar days use an internal frame, not an external dotted outline.
- Today uses a small structural marker.
- Destructive actions are quiet until hover/focus or confirmation context.
- Accessible mode strengthens shape, borders, and patterns rather than relying on animation or color alone.

Goldenrod is the main signal color. It should be used for accents, active controls, rails, and focus treatments, not for large body text.

## Calendar summary

The Calendar is now the main daily workflow surface.

Important behavior:

- Backpack day starts at `07:00`.
- Expected arrival defaults to `07:00`; arrival at `07:01` is late.
- Expected arrival can be overridden by month in `BP_USER_CONFIG.calendar.expectedArrivalByMonth`.
- Arrival uses a **Start Day** flow:
  - pending arrival shows a large `> Start Day` action;
  - logged arrival becomes a quiet audit strip with stats.
- Arrival input is plain text, not native `input[type=time]`.
- Accepted quick formats include `7`, `700`, `730`, `7:30`, and `7.30`.
- Mouse-friendly minute controls support `−5`, `−1`, `+1`, and `+5`.
- Timed events use structured event fields, not title parsing as permanent state.
- The event input still accepts convenient text like `09:00 - 10:30 Review` and parses it once when creating/editing.
- Repeating events are **Repeat this month** copies, not true infinite recurrence.
- Event Gantt can be promoted to the persistent shelf above the workspace.
- Calendar tools support calendar-only export/import, repair, cleanup, diagnostics, and selected-day clearing.

See `docs/calendar.md` for the detailed event and arrival model.

## Quick Notes summary

Quick Notes are a fixed-grid board, not an infinite whiteboard.

Important behavior:

- Notes snap to a logical grid.
- Notes may overlap by at most the configured overlap tolerance.
- The newest moved note rises to the top.
- Titles are editable in the note header.
- Movement happens from the empty bottom chrome.
- Footer controls include note background color, text color, resize, and delete.
- Quick Notes support board-only export/import and are also included in full Backpack export.

See `docs/quick-notes.md` for the detailed storage and interaction model.

## Notes and templates

Markdown files are safe/escaped and are the preferred format for long prose.

HTML template uploads are treated as trusted authored content and rendered as authored. Do not load untrusted HTML files into template sections.

The current template examples are:

- **Template - Basic**: Newton `F = ma`, simple Markdown plus HTML quote/callout.
- **Template - Medium**: Wiki Bees, a three-column wiki pattern with left controls, central Markdown, image uploads, and right-side code references.

See `docs/templates.md` for how to add future custom pages.

## Placeholder path workflow

Open **Placeholders**, set `PROJECT_PATH`, then press **Derive split paths from PROJECT_PATH**.

Useful placeholders include:

```txt
{{PROJECT_PATH}}
{{CONTENT_PATH}}
{{HTML_ENTRY}}
{{CSS_PATH}}
{{JS_PATH}}
{{NOTES_FILE}}
{{BASIC_MD}}
{{BASIC_HTML}}
{{WIKI_BEE_DESCRIPTION}}
{{WIKI_BEE_FAMILIES}}
{{WIKI_BEE_IMAGES}}
{{WIKI_BEE_WORKER_IMAGE}}
{{WIKI_BEE_HIVE_IMAGE}}
{{EXPORT_PATH}}
{{HEADER_QUOTE}}
```

Unknown placeholders stay visible so unfinished templates are easy to diagnose.

## Data and import/export

Backpack uses browser `localStorage` for convenience autosave, but JSON export is the primary save/backup mechanism.

Export layers:

- Full Backpack export/import: whole app state.
- Calendar-only export/import: replaces only Calendar state.
- Quick Notes board export/import: replaces only Quick Notes board state.
- Markdown/HTML content uploads: cached in app state.
- Template image uploads: stored as data URLs in app state.

See `docs/data-and-imports.md` for detailed rules.

## Intentional limits in 1.31.2

- No app-level search; use browser Ctrl+F.
- Repeat behavior is month-copy based, not true recurrence.
- Gantt events are visualized but not drag-resizable yet.
- Uploaded image data URLs can increase exported JSON size.
- HTML template files are trusted authored content.
- Native color pickers are still used for Quick Notes.

## Release checklist

See `docs/regression-checklist.md` before labeling a future baseline.
