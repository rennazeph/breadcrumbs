# The Backpack — Release 2.5.1 Patch Notes

**Previous shipping release:** Release 2.5  
**Shipping release:** Release 2.5.1  
**Compatibility app version:** 2.45.0

Release 2.5.1 consolidates the v2.41–v2.45 development line into the first maintenance release for Release 2.5. The focus is more capable note authoring, safer spatial behavior, customizable holder organization, and a substantially stronger theme/presentation system.

## Notes and authoring

- Rich and static Markdown notes use a denser card-scale document rhythm. Serializer whitespace no longer creates phantom blank rows between headings and following content.
- Notes fenced code now uses explicit language declarations. The shipping whitelist is `verse`, `js`, and `python`; unsupported labels fall back to plain code rather than being inferred.
- Code surfaces receive a restrained semantic palette instead of inheriting potentially aggressive Accent colours.
- **A/B** notes now have independently editable section content and independently editable persisted section labels.
- Added first-class **To Do** cards with persistent item text/completion state and direct add/check/edit/delete controls.
- Added first-class **Table** cards. New tables begin at 2×2, hug populated content, can add/remove rows and columns from edge controls, preserve at least one row/column, confirm destructive populated-edge removal, and provide **Wrap / No wrap** presentation without forcing the whole card to become extremely wide.

## Drawing Board interaction

- Card dragging is transactional: cards may pass through occupied space while lifted, a landing ghost communicates `PLACE`, `BLOCKED`, or `OUTSIDE BOARD`, and collision is enforced only on release. Invalid drops revert to the original position.
- Open and Collapsed cards share the same move transaction instead of separate collision behavior.
- Marble restoration remembers the pre-marble presentation and restores from saved board geometry rather than placing the card under the pointer.
- Card chrome was normalized so header utilities, footer actions, and corner marbles share consistent geometry across note types and density modes.
- Added **Sort Orphans** for marbled notes with no holder ownership.
- Marble face styling consolidates character/symbol behavior under **Glyph**, expands procedural Pattern/Gradient controls, and persists deterministic seed/angle/scale/density/colour inputs.

## Holders

- Holder identity is now based on stable ids rather than editable names or icons.
- Added the **Holders** manager for creating, renaming, recolouring, re-iconing, and deleting holders.
- **Important** and **Delete** remain protected anchors. All other built-in and user-created holders may be deleted.
- Deleting a holder migrates owned and temporary note references to Important before the holder disappears, preventing note loss.
- Board export/import now round-trips the exact holder catalog. Malformed imported ownership references recover to a neutral holder instead of silently orphaning notes.

## Theme Creator and presentation

- Theme Creator was rebuilt around the visible **Seeds → Inference → Roles → Preview** pipeline with reusable line/junction geometry and sequential flow highlighting.
- Accent sources now have distinct **Fixed**, **Harmonize**, and **Explore** behavior. Explore uses deterministic seeded candidate generation; selecting a candidate applies it immediately while **New seed** rerolls candidates.
- The Preview layout is compact and content-driven rather than vertically centering specimens in unused space.
- Presentation profiles were differentiated structurally rather than by colour/font alone: Balanced, Minimal / Code, Tactile / Desk, Instrument, Ledger / Index, and 98 Terminal.
- Expanded typeface choices include UI Sans, Classic UI, Humanist, Narrow UI, Book Serif, Mono, and Terminal.
- Control foregrounds are derived independently for idle, hover, active, and input surfaces. Presentation rules may alter geometry/bevel/shadow but cannot split a contrast-checked foreground/background pair.
- Marble geometry is now an independent theme property. Theme Generator and Theme Creator expose **Polished Orb, Flat Signal, Instrument Round, Ledger Square, and 98 Token** independently from Presentation.
- Portable theme format advances to **BPTH5**: `BPTH5|FOUNDATION|SURFACE|ACCENT|FONT|PRESENTATION|RECIPE|MARBLES`. BPTH1–BPTH4 remain importable.

## Structural hardening

- Presentation, density, utility controls, and spatial controls now have clearer ownership boundaries so presentation CSS cannot casually resize swatches, delete buttons, holder controls, or marbles.
- Drawing Board note identity/render/conversion behavior is centralized through the current note-type registry.
- Theme consumers share one derived theme runtime instead of reconstructing note/card colours through parallel paths.
- Compact and Readable layout containment was tightened, especially for Goldenrod/Tactile controls, the creation rail, holder chrome, Theme Creator inference geometry, and table controls.

## Compatibility

- Workspace schema remains **2**.
- Drawing Board remains `geometryVersion: 3` and `styleVersion: 13`.
- Compatibility app version is **2.45.0**.
- Markdown Typewriter remains **2.9.0-draft.18**.
- Existing v2 browser storage is reused; Release 2.5.1 does not create a parallel storage key.
- Workspace and Drawing Board exports now include `releaseVersion: "2.5.1"` at the package metadata boundary while retaining `appVersion: "2.45.0"` for compatibility/migration.
- BPTH1/BPTH2/BPTH3/BPTH4 themes continue to normalize forward to BPTH5.

## Distribution cleanup

The shipping archive contains runtime files, current documentation, and public examples only. Development tests/smoke pages, historical development notes, screenshots, saved boards, and internal project artifacts are excluded.
