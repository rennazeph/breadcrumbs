# Markdown Typewriter v2.9 — Release 2.5 integration

Release 2.5 bundles **Markdown Typewriter 2.9.0-draft.18** in host mode. The canonical live specimen is `examples/typewriter-v2.9-api-showcase.md`.

## Engine-owned truth

Typewriter owns document playback rate/scope, single/multi renderer behavior, heading scheduling, progressive-flow state, inline commands, constructor source metadata/runtime overrides, Styled Link/Strikeout/Strong/Emphasis/List/Code Block constructors, recursive CODE/named LOOP ownership, runtime/effective configuration, events, and control inventory.

Primary machine-readable surfaces include `getApiSurface()`, `getState()`, `getRuntimeState()`, `getControlSchema()`, `getControlInventory()`, generic constructor APIs, and CODE/LOOP lookup APIs.

## Backpack-owned presentation

Backpack groups the Typewriter inventory into **Presentation, Pace, Toggles, Holds, Repetition, Objects, and Runtime** rather than mirroring engine classes.

Perceptual slider ladders, Standard/Slow/Fast labels, default markers, WPM approximations, explanatory tooltips, and slower/staggered miniature preview cadence are Backpack UI policy. Exact fields and the running document retain literal Typewriter values.

## Lifecycle boundary

Restart on return / Do not restart / Once per Load / Persist in background are host lifecycle policies around the Typewriter instance, not Markdown syntax or Typewriter runtime configuration. `Finish Now` delegates finite completion to Typewriter while persistent effect/CODE/Rotation loops retain their own clocks.

## Extension rule

New Typewriter behavior should enter the engine schema/inventory first so hosts can consume it generically. Pure host concerns—density, preview slowing, docking, tooltips, and workspace lifecycle—should remain outside engine runtime truth.
