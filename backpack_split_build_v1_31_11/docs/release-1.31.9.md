# Backpack 1.31.9 Release Notes

CSS architecture cleanup pass.

## Changed

- Added a CSS architecture map at the top of `css/backpack.css`.
- Added a final component-contract layer for:
  - semantic brand/control tokens,
  - reader/wiki surfaces,
  - theme-aware links,
  - Calendar/Gantt surfaces and priority colours,
  - shared z-index/menu layers.
- Normalized active button/tab/wiki-nav styling through shared control variables.
- Kept legacy `--bp-gold*` names available as compatibility tokens while steering new component work toward semantic names.
- Reaffirmed that themes should mostly be variable blocks, not component rewrites.

## Fixed / hardened

- Header dropdowns and promoted shelf now use named z-index tokens instead of local numeric values.
- Reader/wiki/code/link rules now have a final override layer to reduce mixed App/Reader regressions.
- Calendar and Event Gantt priority strips now have a clearer token contract for future themes.

## Validation

- `node --check js/backpack.js` passes.
- CSS brace balance is clean.
- Runtime files still have zero `fetch()` calls.
