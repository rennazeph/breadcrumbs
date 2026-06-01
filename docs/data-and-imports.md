# Data, Persistence, and Imports — Backpack 1.31

Backpack uses browser `localStorage` as the convenience autosave layer. Exported JSON is the primary portable save format.

## Storage areas

```txt
appState.calendar      Calendar arrivals/events/tools
appState.quickNotes    Quick Notes board
appState.notes         Main Markdown notes cache
appState.bees          Template - Basic Markdown/HTML cache
appState.wikiBees      Template - Medium Markdown/image cache and active section
appState.placeholders  User placeholder values and paths
appState.ui            Theme, density, selected UI state, promoted shelf state
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
