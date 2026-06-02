# Backpack 1.31 Release Notes

This release updates the 1.30 baseline with shell-level architecture changes before deeper Template - Medium work.

## Major changes

- Added a one-object tab registry shape: `{ id, label, icon, group, render, bind }`.
- Removed the separate tab-binding `if` chain.
- Added a promoted-widget shelf above the workspace.
- Added Event Gantt as the first promotable widget.
- Converted Notes and template content to upload-first loading.
- Removed runtime checks for neighboring Markdown/HTML files.
- Fixed the Template - Medium demo loader path that referenced an undefined `loadWikiBeeFile` helper.
- Added Template - Medium image uploads through data URLs.
- Removed server-oriented Code Block snippets and the `SERVER_PORT` placeholder.

## Why this matters

Backpack is now clearer about its operating mode: open the page directly, upload content into tabs, export state for persistence. This keeps the app compatible with the no-local-server requirement and prepares templates for expansion without multiplying tab-specific wiring.

## Promotion model

Promoted widgets are registered in `promotedWidgets` and controlled through `appState.ui.promotedWidget`.

In 1.31:

- Calendar owns Event Gantt.
- Event Gantt can be pinned to the shelf.
- When pinned, Calendar shows a notice instead of duplicating the Gantt in the day panel.
- The shelf remains visible while navigating to other tabs.

## Template/content model

- Notes: upload Markdown only.
- Template - Basic: upload Markdown and trusted HTML, or load bundled demo content.
- Template - Medium: upload Markdown sections and images, or load bundled demo Markdown.
- Uploaded images are stored as data URLs, which improves portability but can increase export size.

## Follow-up candidates

- Convert Template - Medium to a declarative tab schema.
- Add a generic upload-source renderer so template tabs can declare upload slots rather than custom controls.
- Add optional promoted widgets for other tabs, such as Quick Notes scratch panel or Template reference snippets.
