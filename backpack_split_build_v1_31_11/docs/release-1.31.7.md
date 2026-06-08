# Backpack 1.31.7 Release Notes

## Scope

Hotfix for two regressions noticed after the 1.31.6 theme pass.

## Fixed

- Restored **Reader: Light / Reader: Dark** switching across Goldenrod, Lime Analog, and Grayscale.
- Normalized saved/imported UI booleans so older or stringified state values do not lock toggles.
- Moved the **Data** dropdown above the tab grid by fixing header stacking and titlebar overflow.

## Validation

- `node --check js/backpack.js` passes.
- CSS brace balance check passes.
- Runtime files still contain no `fetch()` calls.
