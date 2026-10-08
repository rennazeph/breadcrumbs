# Drawing Board — Release 2.5.1

Drawing Board is an elastic logical workspace with a 120×90 minimum extent. Card coordinates are stored in logical units; camera/viewport changes never rescale saved geometry.

## Card types

Current first-class card content modes are:

- **Rich** — editable rich/plain content.
- **Markdown** — canonical Markdown source with static or Typewriter presentation.
- **Code** — terminal-style code viewport with persisted source/language and copy action.
- **A/B** — two independently editable regions with independently editable section labels.
- **To Do** — persistent checklist rows with add/edit/check/delete controls.
- **Table** — persisted rectangular cell matrix with edge add/remove row/column controls and Wrap / No wrap presentation.

Cards share one chrome contract: header/title utilities, body, footer commands, and corner marble/resize affordance.

## Table notes

New Table cards begin at 2×2 and use a compact 18×15 starting card footprint. The sheet hugs populated cell content rather than filling the whole body. Wrapped cells may grow vertically; No wrap preserves literal lines and allows horizontal scrolling.

Hover the right edge to add/remove the rightmost column and the bottom edge to add/remove the bottom row. Removing a populated edge asks for confirmation. A table always keeps at least one row and one column.

## Open, Collapsed, and Marble

Marble is the minimum presentation level alongside Open and Collapsed. Entering Marble preserves full card geometry and pre-marble presentation. Restoring a marble uses saved board geometry/anchors, not pointer position.

Marble appearance supports Auto/Glyph/Pattern/Gradient card styling. Theme marble geometry is independent from the note face itself, so custom Pattern/Gradient paint can coexist with Orb, Flat, Round, Square, or 98 Token theme geometry.

## Holders

Holders organize marbles using stable persisted ids. The **Holders** manager can create, rename, recolour, re-icon, and delete holders.

- **Important** and **Delete** are protected anchors and cannot be removed.
- All other built-in and user-created holders may be deleted.
- Deleting a holder migrates owned and temporary references to Important before removal.
- Names, colours, and icons are presentation metadata only; they never define ownership.

**Sort Orphans** routes already-marbled notes with no holder ownership to Unsorted when available, otherwise Important. Open/Collapsed notes are never swept by this command.

## Movement transaction

Dragging a card is transactional:

1. the card is lifted above the board;
2. movement may cross occupied cards;
3. a landing ghost shows `PLACE`, `BLOCKED`, or `OUTSIDE BOARD`;
4. valid release commits the new coordinates;
5. invalid release reverts to the original coordinates.

Collision is therefore a drop-time rule rather than a wall during pointer movement.

## Creation palette and groups

The creation rail owns note generators, theme-linked colours, and saved templates. Compact and Readable density use explicit containment dimensions so presentation themes cannot enlarge small swatches or spatial controls beyond their slots.

Area Groups remain independent tinted regions beneath cards and can be named, moved, resized, reordered, and administered through Navigate / Repair.

## Navigate / Repair

Navigate / Repair exposes explicit geometry administration without silently rewriting notes: center view, move to origin, safe resize, duplicate, z-order, rename, diagnostics, routing, and permanent deletion.
