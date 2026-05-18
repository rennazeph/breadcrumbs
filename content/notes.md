# Backpack Notes Example

Welcome to **The Backpack** notes file.

This file is meant to sit next to `backpack.html` as:

```txt
/backpack
├─ backpack.html
└─ notes.md
```

When the browser can fetch it, the Notes tab will load it automatically. If the browser blocks local file fetching, upload this file manually from the Notes tab.

---

## Basic Markdown Supported

The alpha renderer supports:

- Headings
- Bullet lists
- Numbered lists
- **Bold text**
- *Italic text*
- `inline code`
- Fenced code blocks
- Links such as [MDN Web Docs](https://developer.mozilla.org/)

> Raw HTML is escaped in the Notes tab. Use the CSS Museum when you want HTML examples to be treated as source documentation.

---

## Placeholder Examples

These placeholders are parsed by the Backpack before rendering:

- Project name: **{{PROJECT_NAME}}**
- Project path: `{{PROJECT_PATH}}`
- Author: **{{AUTHOR}}**
- Current date: **{{CURRENT_DATE}}**
- Backpack day: **{{BACKPACK_DAY}}**

Unknown placeholders stay visible:

```txt
{{UNKNOWN_PLACEHOLDER}}
```

---

## Suggested Backpack Folder Workflow

1. Keep `backpack.html` and `notes.md` together.
2. Edit `notes.md` when you want to update reference notes.
3. Use **Export** to save the Backpack state.
4. Use **Import** to restore a previous exported state.
5. Use the CSS Museum for examples of new sections and components.

---

## Example Code Block

```html
<section class="bp-card bp-markdown">
  <!-- Rendered from notes.md -->
  {{MARKDOWN_SECTION_OUTPUT}}
</section>
```

---

## Example Section: Calendar Rules

- The Backpack day starts at **07:00**.
- Arrival at **07:00** is on time.
- Arrival at **07:01** is late.
- Expected arrival is configured monthly inside the HTML config area.

---

## Example Section: Quick Notes Rules

- The board uses a fixed logical grid.
- The current alpha uses a 40px base measurement.
- Notes can overlap by at most one grid cell in either direction.
- The latest moved note appears on top.
