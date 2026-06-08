# Quick Notes — Backpack 1.31.11

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
  text: "Plain text fallback",
  html: "Rich body HTML, sanitized",
  links: [
    { id: "lnk_...", url: "https://example.com/", label: "Example", createdAt: "...", lastSeenAt: "..." }
  ],
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
- The `🔗` header button opens the board-level Links Inspector for that note.
- Delete is a circular goldenrod `×` button matching the add button language.
- Background color and text color are both editable.

## Overlap rule

Notes may overlap by at most the configured overlap tolerance.

Current intended behavior:

- `maxOverlapCells: 1` permits a one-cell overlap.
- The latest moved note rises to the top.
- Titles are indented by the overlap tolerance so a brief title can remain readable under small overlaps.
- If overlap tolerance is set to `0`, the title indent collapses.

## Saved links

When the user pastes a URL or formatted hyperlink into a Quick Note, Backpack stores that URL in `note.links` immediately. The body can later be edited, simplified, or cleared without deleting the captured link.

The `🔗` button no longer expands a drawer inside the card. It opens a board-level Links Inspector, which is outside the resizable note geometry. This keeps link administration reachable even when a note is small, overlapped, or recently recovered.

The Links Inspector can:

- show all permanent links saved for the selected note;
- delete individual saved links deliberately;
- reset the selected note to the default safe size;
- close independently from the note card.

The note body stores sanitized rich HTML in `html` and keeps `text` as a plain-text fallback for older exports and search/debugging.


## Recovery controls

Quick Notes has two recovery paths:

- `Repair Layout` in the board header clamps all notes back into visible grid bounds without deleting content.
- `Reset size` in the Links Inspector restores the selected note to the default 4×3 card size and moves it to a valid space when needed.

These controls exist because note chrome can be affected by density, accessibility, overlap, and manual resizing. Administration surfaces should not depend on a note being large enough to display every control.

## Import/export

Board-only export creates a Quick Notes JSON file. Board-only import replaces the current board after confirmation.

Import normalization handles older or malformed notes:

- missing title becomes `Note`;
- missing text color becomes dark text;
- old text-only notes are migrated into sanitized `html`;
- links are deduplicated and normalized to `http`/`https` URLs;
- missing IDs are regenerated;
- positions are clamped into the board;
- sizes are clamped to the safe minimum of 4×3 cells;
- `nextZ` is recalculated.

## Known limits

- No zoom.
- No infinite canvas.
- No full Markdown rendering inside post-it bodies yet; pasted rich text is sanitized and basic links/emphasis are preserved.
- Native color picker controls are still used.
