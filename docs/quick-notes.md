# Quick Notes — Backpack 1.31

Quick Notes is a fixed-grid post-it board for small, movable notes.

It is intentionally not an infinite canvas and does not support zoom.

## Storage

Quick Notes are stored in:

```js
appState.quickNotes
```

They are also autosaved to browser `localStorage` with the rest of Backpack.

Full Backpack export includes Quick Notes automatically. The Quick Notes tab also supports board-only export/import.

## Note shape

A note stores:

```js
{
  id: "qn_...",
  title: "Note title",
  text: "Body text",
  col: 0,
  row: 0,
  w: 4,
  h: 3,
  z: 1,
  color: "#ffd166",
  textColor: "#111111"
}
```

Positions and sizes are stored in grid units, not raw pixels.

## Interaction rules

- Title is editable in the header.
- Body is editable in the main note area.
- Dragging happens from the empty bottom chrome.
- Resize happens from the footer resize control.
- Delete is a circular goldenrod `×` button matching the add button language.
- Background color and text color are both editable.

## Overlap rule

Notes may overlap by at most the configured overlap tolerance.

Current intended behavior:

- `maxOverlapCells: 1` permits a one-cell overlap.
- The latest moved note rises to the top.
- Titles are indented by the overlap tolerance so a brief title can remain readable under small overlaps.
- If overlap tolerance is set to `0`, the title indent collapses.

## Import/export

Board-only export creates a Quick Notes JSON file. Board-only import replaces the current board after confirmation.

Import normalization handles older or malformed notes:

- missing title becomes `Note`;
- missing text color becomes dark text;
- missing IDs are regenerated;
- positions are clamped into the board;
- `nextZ` is recalculated.

## Known limits

- No zoom.
- No infinite canvas.
- No Markdown rendering inside post-it bodies yet.
- Native color picker controls are still used.
