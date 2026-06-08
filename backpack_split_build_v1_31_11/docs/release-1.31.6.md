# Backpack 1.31.6 Release Notes

Theme-debt cleanup pass after the first Goldenrod/Lime/Grayscale theme cycle test.

## Changed

- Retuned **Goldenrod** to the requested palette:
  - `#F0C45A` Tuscan Sun
  - `#DB7F67` Burnt Peach
  - `#A37B73` Taupe
  - `#3F292B` Deep Mocha
  - `#D34F73` Blush Rose
- Removed remaining hard-coded blue normal-event accents from Calendar and Gantt accessibility states.
- Bound Code Blocks, wiki code cards, and museum code samples to shared code theme variables.
- Added theme-aware Markdown link colors to prevent default browser blue/purple from leaking into wiki pages.
- Improved Template - Medium wiki image/caption contrast across themes.
- Updated stale Template - Medium Code Blocks helpers from the old Description/Families model to the wiki bundle model.

## Validation

- `node --check js/backpack.js` passes.
- CSS brace balance is clean.
- Runtime files still have no `fetch()` calls.
- Grep check confirms the old hard-coded normal-event blue accent is gone from `css/backpack.css`.
