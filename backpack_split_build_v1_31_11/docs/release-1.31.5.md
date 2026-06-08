# Backpack release 1.31.6

## Purpose

Header, theme, and hover cleanup after the v1.31.4 display-settings pass. This release keeps the default expected arrival at `07:30` and focuses on making the shell easier to extend visually.

## Changes

- Added **Grayscale** to the theme registry.
- Kept themes on `body[data-bp-theme="..."]` so future themes can be added mainly as CSS variable blocks.
- Wrapped full-state **Export** and **Import** into one promoted **Data** dropdown.
- Promoted **Theme** and **Display** into wider header buttons with text labels.
- Quieted hover/focus chrome, especially for Calendar day cells, so Lime Analog and Grayscale do not create oversized bright hover squares.
- Added active-state styling for the new Data dropdown.

## Validation checklist

- `node --check js/backpack.js` passes.
- CSS brace balance is clean.
- No runtime local-file request calls are present.
- Existing saved states migrate with `ui.dataMenuOpen = false`.
- Theme cycle order is Goldenrod → Lime Analog → Grayscale → Goldenrod.
- Data dropdown Export/Import works without duplicating header buttons.
