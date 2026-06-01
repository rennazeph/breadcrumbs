# Backpack 1.30 Notes

Welcome to **The Backpack 1.30**.

This Markdown file is the default content for the Notes tab. It is intentionally simple: the Notes tab is a main Markdown reader, while the `docs/` folder contains fuller section documentation.

## What this workspace does

- Tracks a daily Calendar with Start Day arrival logging.
- Stores all-day and timed events with a selected-day Gantt schedule.
- Provides Quick Notes as a fixed-grid post-it board.
- Provides Code Blocks for copy-ready commands and templates.
- Provides Placeholder Settings for reusable paths and text values.
- Provides Template - Basic and Template - Medium as examples for custom content pages.
- Provides CSS Museum examples for reusable UI components.

## Important files

```txt
README.md                    Current release overview
docs/calendar.md             Calendar behavior and data model
docs/quick-notes.md          Quick Notes storage and interaction model
docs/templates.md            Notes, templates, and CSS Museum guidance
docs/data-and-imports.md     Export/import and local file behavior
docs/regression-checklist.md Manual test checklist
```

## Calendar quick reference

- Backpack day starts at **07:00**.
- Arrival at **07:00** is on time.
- Arrival at **07:01** is late.
- Arrival uses a large **> Start Day** button when pending.
- Logged arrival becomes a quiet audit strip.
- Calendar events now store structured time fields.
- Repeating events are **Repeat this month** copies, not infinite recurrence.
- Calendar has its own export/import and repair tools.

## Quick Notes quick reference

- Notes live on a fixed grid.
- Titles are editable in the header.
- Bodies are editable in the main note area.
- Drag from the empty bottom chrome.
- Use footer controls for background color, text color, resize, and delete.
- Board-only export/import is available.

## Placeholder examples

These placeholders are parsed before rendering:

- Project name: **{{PROJECT_NAME}}**
- Project path: `{{PROJECT_PATH}}`
- Header quote: **{{HEADER_QUOTE}}**
- Current date: **{{CURRENT_DATE}}**
- Backpack day: **{{BACKPACK_DAY}}**

Unknown placeholders stay visible:

```txt
{{UNKNOWN_PLACEHOLDER}}
```

## Markdown safety

Markdown files are escaped before rendering. Raw HTML in Markdown is not executed.

Trusted local HTML template files, such as quote sections used by templates, are rendered as authored. Only use local files you trust.
