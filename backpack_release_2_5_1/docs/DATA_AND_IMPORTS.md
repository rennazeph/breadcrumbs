# Data and imports — Release 2.5.1

## Workspace exports

Full workspace exports use `format: "the-backpack-workspace"`, schema version `2`, compatibility `appVersion: "2.45.0"`, and shipping `releaseVersion: "2.5.1"`.

Persistent data includes Notes documents, loaded-document Typewriter lifetime metadata, Typewriter authoring settings/global control overrides, Drawing Board state, holder catalog/state, groups, card content/styles, active workspace tab, header quote, theme/display preferences, and creation-palette state.

Runtime-only data is excluded, including responsive drawer measurements, Drawing Board camera/zoom state, transient menus, placement ghosts, live animation position, preview animation state, and temporary inspectors.

## Drawing Board exports

Board exports use `format: "the-backpack-drawing-board"`, workspace schema `2`, `geometryVersion: 3`, and `styleVersion: 13`.

Holder ownership uses stable ids. `holderCatalog`, holder state, `marbleHome`, and `marbleRail` travel together so holder renames/icon/colour changes do not rewrite note ownership. If an imported file still references a missing holder id, Backpack recreates a neutral recovery holder rather than dropping those references.

## Theme migration

Current portable themes use:

`BPTH5|FOUNDATION|SURFACE|ACCENT|FONT|PRESENTATION|RECIPE|MARBLES`

BPTH4, BPTH3, BPTH2, and BPTH1 remain accepted and normalize to BPTH5. The recipe records how authored source colours are interpreted; the final MARBLES field stores marble geometry independently from Presentation.

## Typewriter migration

Current Notes playback rate is relative to a 50 ms/character Standard baseline. Older millisecond-per-character state continues to normalize at load.

For pre-v2.40 workspaces, only the untouched legacy `rotationSpeed: 260` implementation default migrates to the 500 ms Standard. Explicit authored/global effect overrides are preserved.

## Storage

Release 2.5.1 continues to use the existing v2 browser storage key. The release does not create a parallel workspace or duplicate user data merely because the user-facing release number changed.
