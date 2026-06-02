# Backpack release 1.31.4

## Purpose

Display cleanup and theme maintainability pass. This release keeps the 1.31 tab/wiki/Quick Notes behavior and focuses on making visual settings easier to expand.

## Changes

- Added a small JavaScript theme registry: `goldenrod` and `lime-analog`.
- Added `body[data-bp-theme="..."]` theme application so future themes can be mostly variable-only CSS blocks.
- Added the **Lime Analog** high-contrast green theme.
- Moved app light/dark, reading light/dark, density, and accessibility into a compact display drawer.
- Kept export/import and theme cycling as direct header actions.
- Changed expected arrival default from `07:00` to `07:30`; `07:31` is late by default.
- Added active-state styling shared by display controls and the theme button.

## Validation checklist

- `node --check js/backpack.js` passes.
- Existing saved states migrate by receiving `ui.theme = "goldenrod"` and `ui.displayMenuOpen = false` through default merging.
- Theme cycle should preserve existing tabs, promoted shelf state, Quick Notes, and Calendar data.
- Display drawer should not occupy vertical space when closed.
