# Templates and Content Uploads — Backpack 1.31.10

Backpack supports reusable content tabs through uploaded Markdown files, trusted HTML uploads, placeholders, bundled demo content, and template layouts.

## Notes tab

The Notes tab is the main Markdown import display.

It does **not** check for nearby files. Upload a Markdown file through the Notes tab and Backpack caches it in app state.

Markdown is escaped and rendered by Backpack's basic Markdown parser.

## Template - Basic

Template - Basic is a simple custom page. In 1.31 it uses a Newton `F = ma` example to stay distinct from the Bees wiki template.

Upload slots:

```txt
basic_newton.md
basic_newton_quote.html
```

The tab also has a bundled demo loader, so the template can be viewed without preparing files.

Purpose:

- demonstrate a simple Markdown column;
- demonstrate a trusted authored HTML callout/quote;
- show how placeholders can appear in both Markdown and HTML.

## Template - Medium

Template - Medium is now a three-column wiki stress test. It is meant to answer: "Can Backpack maintain a richer page family without adding a new branch of UI code for every article?"

Layout:

- Column A: cascade navigation and compact authoring controls.
- Column B: selected wiki page title, description, and multiple subtitle sections. Each subtitle maps to one Markdown file.
- Column C: wiki-style image holder plus a smaller side-note Markdown file.

Bundled source examples live in:

```txt
content/wiki/
content/images/
```

The runtime does not fetch those files. They are included as authoring and upload-test material. Use **Upload MD bundle** to select several Markdown files at once. Backpack maps recognized filenames to their configured section or side-note slots. Unknown filenames are skipped instead of guessed.

Current navigation pages:

```txt
Wiki Index
Template Overview
--
About Bees
Bee: The word in other languages
Bees being Social
Bees relevance on people's food
Gallery of Interesting Bees
Links
```

Uploaded images are stored as data URLs in state. This makes the page portable, but large images can increase exported JSON size.

## CSS Museum

The CSS Museum is instructional. HTML comments inside museum examples are considered documentation and should be preserved.

Use the Museum to document:

- callout patterns;
- action buttons;
- Markdown section templates;
- custom wiki tab templates;
- formula/basic page templates;
- promoted widget/shelf patterns.

## Safety rule

Markdown files are escaped.

HTML template uploads are trusted authored content. Do not load untrusted HTML into those sections.

## Adding a future custom tab

Recommended process:

1. Create any Markdown/HTML/image source files externally.
2. Add a state bucket for the uploaded/cached content if the tab needs persistence.
3. Register content sources in `getContentSourceConfig()` if the tab uses Markdown uploads.
4. Add one tab registry entry with `{ id, label, icon, group, render, bind }`.
5. Use existing Markdown/window/copy/image patterns rather than building one-off UI.
6. Add a `promotedWidgets` entry only if a subcomponent should persist above the workspace while the user navigates elsewhere.

## Tab simplification target

The next simplification target is a declarative custom-tab schema so future tabs can be created from:

```txt
tab metadata
upload source list
optional code blocks
optional image slots
optional promoted widget slots
```

without writing a large custom render function each time.


## Template - Medium wiki model

Template - Medium now behaves as a small wiki instead of a two-file article demo. The model is intentionally registry-based:

- Column A: cascade navigation and compact authoring controls.
- Column B: selected page title, description, and subtitle sections. Each subtitle maps to a Markdown file.
- Column C: selected page image plus a smaller side-note Markdown file.

The MD bundle upload accepts multiple Markdown files at once and maps them by filename. The bundled source files live in `content/wiki/`, but the runtime does not fetch them automatically; they are there for editing and upload testing.

## Theme requirements for templates

Custom templates should use existing Backpack surfaces and shared variables. Avoid hard-coded browser blue links, fixed dark-blue code blocks, or image captions that only work on one theme. The current smoke test is to cycle Goldenrod, Lime Analog, and Grayscale while viewing Template - Medium, Code Blocks, and the promoted Event Gantt.


## v1.31.8 wiki reader contrast

Template - Medium article interiors now consume reader tokens (`--bp-reading-bg`, `--bp-reading-text`, `--bp-reading-muted`, `--bp-link`) for page headers, source strips, side notes, captions, and Markdown links. This prevents the Links page from becoming low contrast when App and Reader modes are opposed, such as App Light + Reader Dark or App Dark + Reader Light.



## v1.31.10 theme contract note

Template - Medium should use reader variables for article content and side notes: `--bp-reader-surface`, `--bp-reader-text`, `--bp-reader-muted`, and `--bp-link-text`. The app theme may change the surrounding chrome, but wiki content should stay readable through App/Reader mode combinations.
