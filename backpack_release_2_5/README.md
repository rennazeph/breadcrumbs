# The Backpack — Release 2.5

Release 2.5 is the shipping build promoted from the current presentation LKG. It combines the Notes reader, Drawing Board, Theme Generator, and bundled Markdown Typewriter into one server-free local workspace.

Open `index.html` directly in a modern browser. No local server or account connection is required.

## What ships

- **Notes** — up to nine `.md`, `.markdown`, or `.txt` documents. Markdown can use the bundled Markdown Typewriter runtime; TXT remains static.
- **Drawing Board** — an elastic logical workspace with rich, Markdown, code, A/B, and Typewriter cards; marbles; persistent holders; area groups; creation tools; and Navigate / Repair administration.
- **Themes** — portable BPTH4 themes with colour recipes, font/presentation profiles, App/Reader light-dark modes, and Compact/Readable density.
- **Markdown Typewriter 2.9** — bundled in host mode with semantic control inventory, recursive CODE/LOOP ownership, inline rotation/effect commands, runtime inspection, and perceptual Backpack controls.
- **Data** — local persistence plus explicit workspace and Drawing Board JSON import/export.

## Release identity

The user-facing release is **Release 2.5**. Workspace exports retain the monotonic internal `appVersion` used for compatibility and migration, and additionally include `releaseVersion: "2.5"` in exported package metadata.

## Privacy / distribution cleanup

This package contains no saved user workspace, account credentials, personal contact information, local machine paths, private project data, or development-only smoke/test artifacts. Bundled example links use reserved `example.com` / `example.net` / `example.org` domains.

See `PATCH_NOTES.md` for changes since the previous shipping baseline, and `docs/` for the current feature contracts.
