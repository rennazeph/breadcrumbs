# The Backpack 2.4 — Notes + Drawing Board

Backpack 2.4 is a focused, server-free workspace containing two tools:

- **Notes** — up to four uploaded Markdown documents in compact subtabs.
- **Drawing Board** — draggable note cards with one-row title-card storage, permanent saved links, board import/export, and layout repair.

Open `index.html` directly in a browser. The build does not fetch neighbouring files or require a local server.

## 2.4 editability and save-state cleanup

The header quote is now a visible control rather than data that can only be reached through the removed Placeholder tab. Click the quote to open a compact editor with **Save**, **Cancel**, and **Reset** actions.

Backpack now shows a subtle local save status in the header. Drawing Board title, body, and colour changes use a short autosave delay and no longer depend on an invisible Enter-or-blur rule. Enter still confirms a title or quote for keyboard users, while Escape cancels the quote editor.

Rendering no longer saves state as a hidden side effect. State-changing actions save explicitly before rebuilding the interface, and pending Drawing Board edits are flushed before tab changes, exports, or page exit.

## Focused JavaScript core

The runtime contains only Notes, Drawing Board, themes, reader/app modes, density, local persistence, and import/export. Calendar, templates, wiki, CSS Museum, code blocks, promoted widgets, placeholders administration, and their old event handlers are not part of the shipped runtime.

Internal state uses the explicit `drawingBoard` name rather than the legacy `quickNotes` name. Legacy names remain accepted only at import and migration boundaries.

## Versioned data

Workspace exports use:

- format: `the-backpack-workspace`
- schema version: `2`
- app version: `2.4.0`
- root data key: `workspace`

Drawing Board exports use `the-backpack-drawing-board` with the same schema version.

Backpack 2.4 imports:

- current 2.4 workspace and Drawing Board files;
- v2.0–v2.3 full exports using `workspace`, `state`, `ui`, or `quickNotes`;
- older 1.31.x core state where Notes and Quick Notes are still present;
- legacy board-only files containing `drawingBoard` or `quickNotes`.

Removed tabs, promoted widgets, Access state, Calendar data, template data, and open-menu state are ignored rather than copied into the current workspace.

## Local persistence

Saves use `the-backpack-state-v2`. On first load, Backpack also checks the older `the-backpack-alpha-state-v1` key, migrates Notes and Drawing Board content, and writes the compact v2 state automatically.

The full-workspace export includes the current header quote. Open menus, quote-editor drafts, save indicators, and other runtime-only UI state are not exported.

## Structure

```text
index.html
css/backpack.css
js/backpack.js
docs/notes.md
docs/drawing-board.md
docs/data-and-imports.md
docs/regression-checklist.md
docs/release-2.0.md
docs/release-2.1.md
docs/release-2.2.md
docs/release-2.3.md
docs/release-2.4.md
```

## Version

**2.4.0**
