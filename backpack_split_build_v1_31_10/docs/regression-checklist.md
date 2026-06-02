# Regression Checklist — Backpack 1.31.10

Use this checklist before labeling a new baseline.

## Global shell

- Header quote is controlled by `{{HEADER_QUOTE}}`.
- Theme cycle works and applies Goldenrod/Lime Analog/Grayscale/Deep Red through `body[data-bp-theme]`. Goldenrod uses the Tuscan Sun / Burnt Peach / Taupe / Deep Mocha / Blush Rose palette.
- Data dropdown opens/closes and Export/Import still operate on full Backpack state.
- Display drawer opens and closes without changing workspace layout when hidden.
- App light/dark toggle works inside the display drawer.
- Reading theme toggle works independently inside the display drawer.
- Density toggle works inside the display drawer.
- Accessible mode strengthens geometry and reduces reliance on animation/color inside the display drawer, without reintroducing hard-coded blue event strips.
- Tabs remain compact at half-screen widths.
- Tab registry entries include their own `bind` function; no second tab-binding `if` chain is required.
- Promoted shelf stays hidden when no widget is pinned.
- Promoted shelf appears above the workspace when Event Gantt is pinned.
- Promoted shelf unpin and open-source-tab controls work.

## Calendar

- Today marker is structural, not an external outline.
- Selected day uses internal frame.
- Hover does not fight selection and no longer paints a large bright square over the selected/hovered day.
- Arrival pending shows `> Start Day`.
- Arrival logged hides edit controls until **Edit** is clicked.
- Expected arrival defaults to `07:30`; `07:31` is late unless the month override changes it.
- Arrival text input accepts `7`, `700`, `730`, `7:30`, `7.30`.
- `−5`, `−1`, `+1`, `+5` work in pending draft and logged edit flows.
- Gantt `now` marker follows real current time.
- Gantt bars remain aligned after resize.
- Untimed items do not appear in Gantt.
- Event Gantt can be pinned and remains visible when switching tabs.
- Pinned Event Gantt follows the selected Calendar day.
- Repeat this month preview count appears when repeat days are toggled.
- Delete repeated group works only after confirmation.
- Calendar export/import works and does not affect Quick Notes.
- Calendar repair and clean empty days do not remove valid data.

## Quick Notes

- Add note goes to first available grid space.
- Title is editable.
- Body is editable.
- Dragging works from empty bottom chrome.
- Resize works.
- Background color and text color work.
- Delete button is circular and matches add-button language.
- Overlap tolerance behaves as configured.
- Board export/import preserves title, colors, text, position, size, and z-index.

## Notes and templates

- Notes uses upload-only Markdown loading.
- Notes clear cached content works.
- Markdown escapes raw HTML.
- Template - Basic can load its bundled demo.
- Template - Basic can upload Markdown and trusted HTML.
- Template - Medium can load bundled demo Markdown.
- Template - Medium can upload a multi-file wiki Markdown bundle.
- Template - Medium can upload the selected page image.
- Template - Medium image captions and side-note text remain readable across Goldenrod, Lime Analog, Grayscale, and Deep Red.
- CSS Museum examples do not overflow their cards.
- HTML template files are treated as trusted authored content.

## Code Blocks and placeholders

- Code category filters work.
- Code block backgrounds follow the active theme instead of old fixed dark-blue values.
- Markdown hyperlinks use theme-aware link colors instead of browser-default blue/purple.
- Copy Output and Copy Template work.
- `PROJECT_PATH` can derive related paths.
- Derived placeholders no longer include `SERVER_PORT`.
- Unknown placeholders remain visible.
- Header quote updates from Placeholder Settings.

## Responsive checks

Test at:

```txt
full width
Windows half-screen
narrow split-screen
short viewport height
browser zoom 90%
browser zoom 125%
```

Focus on Calendar, promoted Event Gantt, Quick Notes, Settings, and Template - Medium.


## Quick Notes rich text and links

- Paste a plain URL into a Quick Note. Confirm it appears as a clickable link in the note body.
- Click `🔗`. Confirm the pasted URL appears in the saved links drawer.
- Remove the URL text from the note body. Confirm the saved link remains in the drawer.
- Delete the link from the drawer. Confirm it is removed from saved state.
- Toggle compact/readable density and reading light/dark while editing a note. Confirm rich body links are not flattened to plain text.
- Export and re-import a Quick Notes board. Confirm `html`, `text`, and `links` survive normalization.


## v1.31.8 wiki/theme checks

- Cycle themes through Goldenrod, Lime Analog, Grayscale, and Deep Red.
- In Template - Medium, open Links and verify the page header, source links, side note, and image caption remain readable in App Dark + Reader Light.
- Repeat the Links check in App Light + Reader Dark.
- Confirm Markdown links do not fall back to browser blue/purple in any registered theme.



## v1.31.10 CSS contract checks

- Cycle Goldenrod, Lime Analog, Grayscale, and Deep Red. Confirm tab selection, hover, links, code blocks, Calendar, Gantt, and Template - Medium remain readable.
- Toggle App Light/Dark and Reader Light/Dark in each theme. Confirm wiki page headers, side notes, image captions, and Markdown links do not disappear.
- Open the Data dropdown and Display drawer. Confirm both appear above the tab grid and promoted Event Gantt shelf.
- Pin Event Gantt, switch tabs, and confirm the shelf uses the current theme without stale blue/gold accents.
- Add a Calendar event with Normal, High, and Highest priority. Confirm bars/strips use theme priority tokens, not hard-coded colours.
