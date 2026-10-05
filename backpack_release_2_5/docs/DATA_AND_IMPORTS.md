# Data and imports — Release 2.5

## Workspace exports

Full workspace exports use `the-backpack-workspace`, schema version `2`. The monotonic internal `appVersion` remains in the payload for migration compatibility; shipping exports also include `releaseVersion: "2.5"` at the package metadata level.

Persistent data includes Notes documents, loaded-document Typewriter lifetimes, Typewriter authoring settings/global overrides, Drawing Board data, active tab, header quote, theme/display preferences, and creation/holder/group state.

Runtime-only data is excluded: responsive measurements, open utility groups, Drawing Board camera/zoom measurements, live animation position, runtime counters, preview animation state, and transient menus/inspectors.

## Theme migration

Current portable themes use:

`BPTH4|FOUNDATION|SURFACE|ACCENT|FONT|PRESENTATION|RECIPE`

BPTH3/BPTH2/BPTH1 remain accepted at the migration boundary and normalize to BPTH4.

## Typewriter migration

Older Notes state stored typing speed as milliseconds per character. Current state stores a playback rate relative to the 50 ms/character Standard baseline. Missing renderer/constructor settings receive current defaults.

An untouched legacy `rotationSpeed: 260` value migrates to the current 500 ms standard. Explicit effect/global overrides are preserved.

Loaded-document lifetime metadata is stored with each Notes document so remounting can honor Restart/Do-not-restart/Once-per-Load behavior. Persist-in-background is a live host mode and does not serialize an active DOM/runtime checkpoint.

## Drawing Board compatibility

Current Drawing Board data uses `geometryVersion: 3` and `styleVersion: 11` with a 120×90 minimum extent. Cards, groups, creation-palette state, holder ownership/docking, marble presentation, and style fields are preserved. Compatible older workspace/board formats normalize at the import boundary.
