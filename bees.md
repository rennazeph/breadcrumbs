# Column A: Markdown — Bees

Bees are small pollinating insects with an outsized role in many ecosystems. When they visit flowers, pollen can move from one plant to another, helping fruits, seeds, and new plants develop.

This Markdown section is intended to be written directly by the user in a separate file. The Backpack can fetch it as `bees.md`, or the user can upload it manually when the browser blocks local file loading.

## Why this section exists

The Bees tab demonstrates how a user can create a new readable tab without writing a large amount of JavaScript. The long paragraph content lives in a Markdown file, while the Backpack provides the layout, window styling, scrolling, and placeholder parsing.

## Placeholder examples

- Project name: **{{PROJECT_NAME}}**
- Author: **{{AUTHOR}}**
- Current Backpack day: **{{BACKPACK_DAY}}**

Unknown placeholders remain visible, which helps catch unfinished templates:

```txt
{{BEEKEEPER_NAME}}
```

## Notes about bees

- Honey bees live in colonies with specialized roles.
- Many wild bees are solitary and do not live in large hives.
- Bees use scent, movement, and environmental cues to locate food.
- Beeswax creates a strong, modular structure for storing honey and raising young.

> A good information tab should make long reading comfortable first, and editing/importing second.

## Example Markdown block

```md
## Section title

Write a paragraph here.

- Add bullets
- Add examples
- Use placeholders like {{PROJECT_NAME}}
```
