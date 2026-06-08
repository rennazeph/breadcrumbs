# Backpack v1.31.1 quick patch

## Purpose

This quick patch tightens the first promoted-widget pass after v1.31.

## Changes

- Compact promoted Event Gantt shelf controls.
- Remove the duplicate inner **Unpin** button while Event Gantt is promoted.
- Rename the old Template - Medium demo loader from `loadWikiBeeFiles` to `loadWikiBeeDemo` so the source no longer implies a fetch/local-file workflow.
- Clean remaining visible demo wording that described fetching neighboring files.

## Validation

- `node --check js/backpack.js`
- Headless Chromium visual smoke pass against `index.html` using `file://` loading.
