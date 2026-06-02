# Backpack 1.31.8 Release Notes

## Scope

Theme/readability cleanup for Template - Medium after testing mixed App/Reader modes.

## Changed

- Added the **Deep Red** theme to the theme registry.
- Repaired Template - Medium wiki readability by binding page headers, source strips, side notes, captions, and Markdown links to reader-surface tokens instead of app-surface tokens.
- Strengthened hyperlink styling so wiki/Markdown links remain visible across Goldenrod, Lime Analog, Grayscale, and Deep Red.

## Validation

- `node --check js/backpack.js` passes.
- CSS brace balance check passes.
- Runtime files still contain no `fetch()` calls.
