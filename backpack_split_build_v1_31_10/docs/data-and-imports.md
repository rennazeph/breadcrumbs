# Data, Persistence, and Imports — Backpack 1.31.10

Backpack uses browser `localStorage` as the convenience autosave layer. Exported JSON is the primary portable save format.

## Storage areas

```txt
appState.calendar      Calendar arrivals/events/tools
appState.quickNotes    Quick Notes board
appState.notes         Main Markdown notes cache
appState.bees          Template - Basic Markdown/HTML cache
appState.wikiBees      Template - Medium Markdown/image cache and active section
appState.placeholders  User placeholder values and paths
appState.ui            UI settings: theme, display drawer, light/dark, reading, density, accessibility, promoted shelf state
```

## Export/import layers

### Full Backpack export/import

Exports or replaces the entire app state.

Use for full backups.

### Calendar-only export/import

Exports or replaces only `appState.calendar`.

Import is replace-only to avoid duplicate IDs, arrival conflicts, and repeat-group ambiguity.

### Quick Notes board export/import

Exports or replaces only `appState.quickNotes`.

Board import accepts either a board-only file or a full Backpack state file and extracts the board.

### Content uploads

Markdown and HTML content files are not automatically written back to disk by the browser.

They are uploaded manually through the relevant tab and cached in app state:

- Notes Markdown;
- Template - Basic Markdown;
- Template - Basic trusted HTML;
- Template - Medium Markdown sections.

### Image uploads

Template - Medium image uploads are read as data URLs and stored in app state.

This keeps the page usable without a local server or neighboring files. The tradeoff is larger exported JSON files if large images are uploaded.

## Import validation

Current normalization covers:

- missing/invalid calendar event IDs;
- old title-parsed event shapes;
- invalid priorities;
- duplicate IDs;
- empty calendar day arrays;
- repeat metadata cleanup;
- Quick Notes missing titles/colors/text colors;
- Quick Notes positions outside the board.

## Upload precedence

Uploaded content is source-of-truth once present in state. Bundled demo content is only used when the user explicitly loads a demo or when a template has no cached content yet.

## Recommended backup habit

- Export full Backpack state at the end of significant changes.
- Export Calendar separately before large calendar edits/imports.
- Export Quick Notes board separately before experimenting with layout or board imports.
- Keep exported state smaller by resizing images before upload when portability matters.


## Template - Medium wiki imports

Template - Medium supports three upload paths:

1. **MD bundle** in Column A: select many files from `content/wiki/`; recognized filenames replace their matching wiki section or side-note slot.
2. **Page image** in Column C: replaces the current page image and stores it as a data URL in app state.
3. **Side note** in Column C: replaces the current page side-note Markdown.

Unknown Markdown filenames are skipped rather than guessed, because accidental slot replacement would make the wiki harder to maintain.


## Quick Notes link capture

Quick Notes now stores two body representations: sanitized rich `html` for display and plain `text` as a fallback. Pasted URLs and formatted hyperlinks are copied into each note's `links` array immediately. These saved links remain even when the matching text is later removed from the note body. The `🔗` drawer next to the resize control is the only place where stored links are deliberately deleted.


## v1.31.7 header data menu

Full Backpack export/import now lives in the compact **Data** dropdown. Calendar-only and Quick Notes board import/export remain inside their source tabs.

## Theme-safe rendering notes

As of 1.31.7, theme data is treated as shared UI infrastructure instead of page-specific decoration. Markdown links, code blocks, Calendar strips, Gantt bars, and wiki image captions should consume `--bp-*` variables rather than hard-coded browser defaults.


## v1.31.8 themes

The theme registry now contains Goldenrod, Lime Analog, Grayscale, and Deep Red. New themes should define app chrome variables and explicit reader variables. Wiki and Markdown reading surfaces should not use app-surface variables for article text containers, because App mode and Reader mode are intentionally independent.



## v1.31.10 CSS/theme contract

The CSS now has a final component-contract layer. New themes should primarily set tokens, while components should consume semantic variables for controls, links, reader surfaces, Calendar/Gantt colours, and z-index layers. This is intended to prevent App/Reader mode combinations from drifting out of sync and to keep dropdowns/promoted elements above the tab grid.
