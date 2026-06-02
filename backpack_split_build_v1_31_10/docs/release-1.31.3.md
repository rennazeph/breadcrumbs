# Backpack release 1.31.3

Focus: Quick Notes rich-text/link persistence.

## Changes

- Quick Note bodies now preserve sanitized rich HTML instead of flattening every edit to `innerText`.
- Pasted plain URLs and formatted hyperlinks are captured immediately into a persistent per-note `links` array.
- Added a compact `🔗` footer button next to resize. It opens a saved-links drawer for that note.
- Links remain stored even if their matching text is later removed from the note body.
- Saved links can be deliberately deleted from the drawer.
- Quick Notes import normalization migrates older text-only notes into sanitized `html` and deduplicates saved links.
- Global density and reading-theme toggles now commit active Quick Note bodies before re-rendering, preventing link loss during mode switches.

## Validation

- `node --check js/backpack.js` passes.
- Static inspection confirmed the new Quick Notes state fields: `html`, `links`, and `openLinksNoteId`.

## Known note

The body is not a full Markdown editor. It preserves a safe subset of pasted rich text: links, emphasis, basic lists, code/pre, blockquote, paragraphs, divs, and line breaks.
