# Regression Checklist — Backpack 1.31

Use this checklist before labeling a new baseline.

## Global shell

- Header quote is controlled by `{{HEADER_QUOTE}}`.
- App theme toggle works.
- Reading theme toggle works independently.
- Density toggle works.
- Accessible mode strengthens geometry and reduces reliance on animation/color.
- Tabs remain compact at half-screen widths.
- Tab registry entries include their own `bind` function; no second tab-binding `if` chain is required.
- Promoted shelf stays hidden when no widget is pinned.
- Promoted shelf appears above the workspace when Event Gantt is pinned.
- Promoted shelf unpin and open-source-tab controls work.

## Calendar

- Today marker is structural, not an external outline.
- Selected day uses internal frame.
- Hover does not fight selection.
- Arrival pending shows `> Start Day`.
- Arrival logged hides edit controls until **Edit** is clicked.
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
- Template - Medium can upload Description and Families Markdown.
- Template - Medium can upload Worker and Hive images.
- Template - Medium image viewer cycles images correctly after uploads.
- CSS Museum examples do not overflow their cards.
- HTML template files are treated as trusted authored content.

## Code Blocks and placeholders

- Code category filters work.
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
