# The Backpack 1.31.10 — Split Build

The Backpack is a direct-open HTML/CSS/JS workspace for daily tracking, reference notes, code snippets, quick post-it notes, and reusable content templates.

Version **1.31.10** is a CSS contract hotfix on top of the v1.31.9 cleanup. It keeps the visual result close to v1.31.8/v1.31.9 while restoring reader-dark mode, themed calendar days, and themed tab buttons.

## Run the split build

Open `index.html` directly in the browser.

```txt
/backpack/index.html
```

Promoted Event Gantt shelf controls were compacted and the duplicated inner Unpin control was removed. Content documents are loaded through upload controls inside the relevant tabs. The app no longer checks neighboring Markdown/HTML files through runtime local-file requests, so it does not need `python -m http.server` for normal use.

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
│  ├─ release-1.31.1.md
│  ├─ release-1.31.2.md
│  ├─ release-1.31.3.md
│  ├─ release-1.31.4.md
│  ├─ release-1.31.5.md
│  ├─ release-1.31.6.md
│  ├─ release-1.31.7.md
│  ├─ release-1.31.8.md
│  ├─ release-1.31.9.md
│  └─ release-1.31.10.md
└─ README.md
```

The `content/` folder remains useful as an authoring scaffold, but the live app reads user content from uploads and cached state.

## Current tab map

| Tab | Purpose | Data/storage notes |
|---|---|---|
| Calendar | Start Day arrival flow, month view, events, repeat-this-month copies, Event Gantt, calendar tools | Stored in `appState.calendar`; full export and calendar-only export both support this data. Event Gantt can be pinned to the promoted shelf. |
| Notes | Main Markdown import display | Upload Markdown; Markdown is escaped and cached in `appState.notes`. |
| Code Blocks | Copy-ready command/template snippets with placeholders | Static snippet definitions in JS; uses placeholder values from Settings. |
| Quick Notes | Fixed-grid post-it board | Stored in `appState.quickNotes`; supports board-only export/import. Pasted links are captured into each note's saved `links` drawer. |
| CSS Museum | Instructional component/template examples | HTML comments in examples are documentation. |
| Template - Basic | Simple custom page template using Newton `F = ma` | Upload Markdown and trusted HTML, or load the bundled demo. |
| Template - Medium | Three-column wiki-style Bees page | Upload a multi-file Markdown bundle from `content/wiki/`, plus optional page images and side-note Markdown. Uploaded images are stored as data URLs in state. |
| Placeholders | Project paths, reusable values, header quote, path derivation | Stored in `appState.placeholders`; used by snippets, templates, Markdown, and Museum examples. |

## CSS/theme maintenance contract

The v1.31.10 CSS pass keeps old visual rules in place for safety, but adds a canonical final contract layer at the bottom of `css/backpack.css`. New work should prefer semantic variables such as `--bp-brand-primary`, `--bp-control-active-bg`, `--bp-reader-surface`, `--bp-link-text`, `--bp-calendar-day-bg`, and `--bp-z-menu` instead of hard-coded colours or legacy names like `--bp-gold`.

Theme blocks should mostly define variables. Component selectors should only be added when the component needs real layout or state structure.

## Global controls

The top-right header now separates data actions from display actions. Full-state import/export live behind the **Data** dropdown, while Theme and Display stay promoted as wider buttons.

| Control | Function |
|---|---|
| `Data ▾` | Opens full-state export/import. |
| `◆ Gold / ▰ Lime / ◫ Gray / ▣ Red` | Cycle workspace theme: **Goldenrod**, **Lime Analog**, **Grayscale**, and **Deep Red**. |
| `Display ▾` | Open or close the compact display drawer. |
| Display drawer | App light/dark, reading light/dark, compact/readable density, and accessibility geometry. |

## Tab registry and promoted shelf

Tabs are now registered with one object each:

```js
{ id, label, icon, group, render, bind }
```

The binding function travels with the tab definition, so future tabs do not need a second `if` chain. This is the first step toward declarative template tabs.

Promotable widgets live in `promotedWidgets`. A promoted widget can stay visible above the workspace while the user moves through other tabs. In 1.31.x, **Event Gantt** is the first promoted widget and can be pinned/unpinned from the Calendar Gantt header.

## Theme and interaction state language

The UI should remain understandable without depending only on color.

Current visual rules:

- Hover is temporary chrome: inset shift, rail, or inner frame.
- Focus is stronger than hover and should support keyboard navigation.
- Selected calendar days use an internal frame, not an external dotted outline.
- Today uses a small structural marker.
- Destructive actions are quiet until hover/focus or confirmation context.
- Accessible mode strengthens shape, borders, and patterns rather than relying on animation or color alone.

Goldenrod remains the default signal color. New themes are now easier to add because the app applies `body[data-bp-theme="..."]` and components consume shared `--bp-*` tokens. The Lime Analog theme is a high-contrast green phosphor/analog style. The Grayscale theme is a monochrome stress test for shape-first interaction states. The Deep Red theme provides a very dark crimson reader/workspace stress case. All registered themes use the same structure rather than separate component skins.

## Calendar summary

The Calendar is now the main daily workflow surface.

Important behavior:

- Backpack day starts at `07:00`.
- Expected arrival defaults to `07:30`; arrival at `07:31` is late.
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
- **Template - Medium**: Wiki Bees, a three-column wiki pattern with cascade navigation, central Markdown sections, page image uploads, and side-note Markdown.

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
{{WIKI_BEE_MD_BUNDLE}}
{{WIKI_BEE_SIDEBAR_SAMPLE}}
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

## Intentional limits in 1.31.10

- No app-level search; use browser Ctrl+F.
- Repeat behavior is month-copy based, not true recurrence.
- Gantt events are visualized but not drag-resizable yet.
- Uploaded image data URLs can increase exported JSON size.
- HTML template files are trusted authored content.
- Native color pickers are still used for Quick Notes.

## Release checklist

See `docs/regression-checklist.md` before labeling a future baseline.
