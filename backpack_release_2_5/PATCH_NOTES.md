# The Backpack — Release 2.5 Patch Notes

**Previous shipping baseline:** Backpack 2.27  
**Shipping release:** Release 2.5

Release 2.5 rolls the post-2.27 development line into a cleaned shipping package. The largest changes are the mature Drawing Board marble/holder model, the presentation and theme system, and the current Markdown Typewriter control/runtime integration.

## Drawing Board

- The board is now **elastic**: 120×90 remains the minimum logical extent, while the workspace can grow to fit larger displays and additional content without rescaling existing card coordinates.
- Added the permanent **creation palette** with theme-linked colours, Text/Markdown/Code/Typewriter/A-B generators, reusable Typewriter templates, and drag-to-create placement.
- Added **Code** as a first-class card mode with a terminal-style viewport and copy action.
- Added **Marble** as the minimum card presentation, alongside Open and Collapsed. Marble identity follows card/content type and preserves card geometry for restoration.
- Marble movement, release coordinates, edge auto-scroll, restore anchors, and double-click/resize gestures received several stability passes so the rendered sphere and persisted position share one coordinate truth.
- Added persistent **holders** for Important, Delete, Code, Search, Mail, Notes, Music, Links, and Unsorted. Holders can own marbles, collapse/expand, move, dock into the creation rail, recall temporary marbles, and preserve order/ownership.
- Added **Area Groups** for tinting, moving, resizing, naming, and administrating regions beneath cards.
- **Navigate / Repair** now handles rename, geometry diagnostics, centering, origin movement, safe resize, duplication, z-order, Sorting Bucket routing, and permanent deletion without silently rewriting stored geometry.
- Readable density enlarges the creation palette and holder controls while Compact keeps the small Paint-like footprint.

## Notes + Markdown Typewriter

- Bundled **Markdown Typewriter 2.9.0-draft.18** now drives Markdown playback through a machine-readable control schema/inventory rather than Backpack-specific one-off controls.
- The control surface is organized around **Presentation, Pace, Toggles, Holds, Repetition, Objects, and Runtime**.
- Presentation is promoted directly beneath transport controls so renderer mode, pace scope, heading scheduling, and theme/layout choices stay immediately accessible.
- Added explicit document lifecycle modes: **Restart on return, Do not restart, Once per Load, and Persist in background**, plus **Finish Now** for finite work.
- Recursive **CODE / named LOOP** ownership, constructor runtime inspection, events, effective configuration, and API-addressable objects are represented in the Runtime/API showcase.
- Added progressive document flow, pending-geometry handling, continuation bridges, scroll-anchor protection, constructor enable controls, syntax highlighting for supported code families, and stable target previews.

## Timing and API presentation

- **1.0× Standard** is now a human-readable baseline: 50 ms/character (roughly 200 WPM equivalent before authored holds).
- Typing and motion controls use **perceptual ladders** concentrated around useful human values while exact numeric entry remains available.
- Rotation/transition defaults were slowed to keep API behavior visually distinguishable; literal holds use clearer human labels and default markers.
- Tooltips now explain what a control does, whether it is literal or cadence-scaled, its current/default/range values, and whether a change is Live, Immediate, or requires Restart.
- Miniature API specimens use a **separate, slower presentation cadence** so the preview teaches the effect without retiming the actual document.
- Preview animation is staggered/capped, does not restart on ordinary telemetry refresh, and keeps centered self-owned transform origins.
- Slot rotation is demonstrated horizontally; Hold/rotation specimens use stable compact glyphs instead of overflowing text.

## Presentation and themes

- Compact and Readable density now share one presentation-token system for panel spacing, hit targets, reader measure, control sizing, floating chrome, and Typewriter rail widths.
- Added the **98 Terminal** built-in theme alongside Goldenrod, Lime, Grayscale, and Deep Red.
- Theme authoring now separates **Preset → Draft → Applied** so choosing a preset does not accidentally overwrite the active theme.
- The Theme Generator has a live component specimen, portable **BPTH4** codes, calculation recipes (`balanced`, `contrast`, `duo`, `triad`, `s-curve`), and calculated/effective role inspection.
- Theme personalities control bounded visual presentation but no longer redefine workspace topology or camera behavior.

## Data, compatibility, and cleanup

- Workspace schema remains **2**. Drawing Board uses `geometryVersion: 3` and `styleVersion: 11`.
- Older BPTH1/BPTH2/BPTH3 themes remain accepted at the migration boundary and normalize to BPTH4.
- Older Notes timing stored as milliseconds/character migrates to the current relative playback-rate model.
- The untouched pre-standard 260 ms rotation default migrates to the current 500 ms standard; explicit authored overrides are preserved.
- Full workspace and Drawing Board exports continue to preserve user content while excluding runtime-only UI/animation state.
- The shipping archive removes development tests, smoke harnesses, historical draft/release notes, screenshots, exported personal boards, and internal project references.
- No credentials, API keys, email addresses, user names, absolute local paths, or private workspace content are included in the release archive.
