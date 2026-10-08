# Markdown Typewriter v2.9 — Release 2.5.1 integration

Release 2.5.1 bundles **Markdown Typewriter 2.9.0-draft.18** in host mode. The canonical live specimen is `examples/typewriter-v2.9-api-showcase.md`.

## Engine-owned truth

Typewriter owns document playback rate/scope, renderer behavior, heading scheduling, progressive flow, inline commands, constructor metadata/runtime overrides, CODE/LOOP identity, runtime/effective configuration, events, and the machine-readable control inventory.

Primary programmatic surfaces include `getApiSurface()`, `getState()`, `getRuntimeState()`, `getControlSchema()`, `getControlInventory()`, generic constructor APIs, and CODE/LOOP lookup APIs.

## Backpack-owned presentation

Backpack consumes the inventory semantically and organizes controls around Presentation, Pace, Toggles, Holds, Repetition, Objects, and Runtime.

Perceptual slider ladders, Standard/Slow/Fast labels, WPM approximations, default markers, explanatory tooltips, docking/drawers, and deliberately slower miniature API specimens are Backpack UI policy. The running document continues to use literal Typewriter values.

## Lifecycle boundary

Restart on return / Do not restart / Once per Load / Persist in background are Backpack host lifecycle policies, not Markdown syntax. `Finish Now` delegates to the Typewriter runtime for finite work while persistent effect/CODE/Rotation loops retain their own clocks.

## Compatibility rule

New Typewriter capabilities should enter through the engine schema/inventory whenever possible. Host-only concerns such as control density, miniature preview cadence, theme integration, workspace docking, and lifecycle should remain outside Typewriter runtime truth.
