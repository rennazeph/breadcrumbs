# The Backpack Alpha — Split Build v3

Open `index.html` through a local static server whenever possible:

```bash
cd /path/to/backpack
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Main folders

```txt
/backpack
├─ index.html
├─ css/backpack.css
├─ js/backpack.js
└─ content
   ├─ notes.md
   ├─ bees.md
   ├─ bees_quote.html
   ├─ Bee_Description.md
   ├─ Bee_Families.md
   └─ images
      ├─ bee_worker.svg
      └─ bee_hive.svg
```

## Theme controls

The app has two theme controls:

- App theme: changes the Backpack chrome and workspace colors.
- Reading theme: changes imported Markdown/reading windows independently.

This allows the app to stay dark while loaded notes remain light, or the reverse.

## Placeholder path workflow

Open **Placeholders** and set `PROJECT_PATH` once. Then press **Derive split paths from PROJECT_PATH**.

This fills reusable path placeholders such as:

- `{{CONTENT_PATH}}`
- `{{HTML_ENTRY}}`
- `{{CSS_PATH}}`
- `{{JS_PATH}}`
- `{{NOTES_FILE}}`
- `{{BEES_MD}}`
- `{{BEES_QUOTE}}`
- `{{WIKI_BEE_DESCRIPTION}}`
- `{{WIKI_BEE_FAMILIES}}`
- `{{WIKI_BEE_IMAGES}}`
- `{{WIKI_BEE_WORKER_IMAGE}}`
- `{{WIKI_BEE_HIVE_IMAGE}}`
- `{{EXPORT_PATH}}`

These can be reused in Code Blocks, Museum examples, Markdown documents, and future custom tabs.

## Wiki Bees tab

The **Wiki Bees** tab is the first serious custom-page test.

It demonstrates:

- A left control/index column.
- A middle Markdown reading column.
- A right reference column with copyable code and a local image viewer.
- Fetch-first Markdown loading with upload fallback.
- Local images referenced from `content/images` instead of embedded into exported state.

The images are intentionally stored as local files to keep state exports small.


## Visual pass notes: Goldenrod + code snippets

This build uses goldenrod as the main accent motive across light and dark themes. The app keeps dark navy/gray surfaces for contrast and uses goldenrod for active tabs, focus outlines, snippet borders, and important accents rather than long body text.

Code Blocks are intentionally denser around headings/descriptions, while the copy-ready output area gets more visual space and a smaller monospace stack:

```css
--bp-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", monospace;
```

This should make code easier to scan without making every snippet card too tall.


## v5 custom-page/content system notes

- Long Markdown content should live in `/content` and be registered through the shared content source helpers.
- `Template - Basic` demonstrates a simple page with Markdown + one HTML section.
- `Template - Medium` demonstrates a wiki-style page with left controls, a central Markdown reader, right-side snippets, and local images.
- The reading theme button changes document windows independently from the app theme.
- The density button switches between compact and readable spacing.
- Keep images as local files in `/content/images`; do not embed them into exported state unless a future option explicitly enables that.


## v6 patch notes

- The whole project now uses the configured monospace stack for a more consistent technical/workspace look.
- The header quote is controlled by the `{{HEADER_QUOTE}}` placeholder in Placeholder Settings.
- Reading window controls were restyled so the classic close/control boxes remain visible across reading themes.
- Template callouts now use the reading theme colors, so they remain readable in dark and light reading modes.
- Light app theme keeps code blocks dark to make snippets easier to identify.

## v7 notes

- Template - Basic now uses a Newton F = ma example so it is distinct from Template - Medium.
- Template - Medium / Wiki Bees now has richer bee description, family notes, callout usage, and more copy examples.
- CSS Museum has been stabilized with overflow-safe cards and an added Basic Formula Page Template.
- Basic template content lives in `content/basic_newton.md` and `content/basic_newton_quote.html`.
