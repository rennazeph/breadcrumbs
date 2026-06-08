# Release 1.31.11 — Quick Notes Links Inspector hotfix

This release fixes the small-card saved-link bug in Quick Notes.

## Changed

- Moved saved-link administration out of the resizable note card and into a board-level Links Inspector.
- Moved the `🔗` button to the note header and made it select/open the inspector instead of expanding an internal drawer.
- Added `Repair Layout` to the Quick Notes header.
- Added `Reset size` for the selected note inside the Links Inspector.
- Increased the safe minimum note size to 4×3 grid cells.
- Added Escape-to-close behavior for the Links Inspector.

## Why

The previous internal link drawer could make a small note unrecoverable because the control that opened or closed the drawer lived inside the same resizable card geometry. The new inspector is board-level, so link management remains visible even when the card is compact, overlapped, or repaired.

## Validation targets

- `node --check js/backpack.js`
- CSS brace balance
- Quick Notes import normalization with very small/offscreen notes
- Saved links survive reset, repair, export, and import
