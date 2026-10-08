# The Backpack — Release 2.5.1

Release 2.5.1 is the first maintenance release on the Release 2.5 shipping line. It promotes the current v2.45 development lineage into a cleaned server-free package, with the major work since 2.5 centered on note authoring, Drawing Board holders/marbles, the Theme Creator, presentation contracts, and layout reliability.

Open `index.html` directly in a modern browser. No local server or account connection is required.

## What ships

- **Notes** — up to nine `.md`, `.markdown`, or `.txt` documents with static Markdown or bundled Markdown Typewriter playback. Notes fenced code supports explicitly declared `verse`, `js`, and `python` highlighting.
- **Drawing Board** — an elastic visual workspace with Rich, Markdown, Code, A/B, To Do, Table, and Typewriter cards; Open/Collapsed/Marble presentation; customizable holders; area groups; procedural marble styling; and Navigate / Repair administration.
- **Themes** — the pachinko-style Theme Creator, independent presentation and marble-style selection, five built-in personalities, deterministic Accent exploration, semantic contrast guards, and portable BPTH5 themes.
- **Markdown Typewriter 2.9** — bundled `2.9.0-draft.18` engine with the current semantic control inventory and Backpack lifecycle/presentation integration.
- **Data** — local browser persistence plus explicit workspace and Drawing Board JSON import/export. Export metadata identifies both Release 2.5.1 and compatibility app version 2.45.0.

## Release identity

The user-facing shipping version is **Release 2.5.1**. Compatibility and migration continue to use monotonic internal `appVersion: "2.45.0"`; existing v2 workspace storage is intentionally reused rather than forked.

Current persistent contracts:

- workspace schema: `2`
- Drawing Board geometry: `3`
- Drawing Board style: `13`
- theme format: `BPTH5`
- Typewriter engine: `2.9.0-draft.18`

## Distribution cleanup

The shipping archive excludes development tests, smoke harnesses, historical development release notes, screenshots, exported user boards, and internal work files. It contains no saved workspace, credentials, personal contact information, or absolute local-machine paths.

See `PATCH_NOTES.md` for changes since Release 2.5 and `docs/` for the current shipping contracts.
