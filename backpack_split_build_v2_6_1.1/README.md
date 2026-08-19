# The Backpack 2.6.1 — Notes + Drawing Board

Backpack 2.6.1 is a focused, server-free workspace containing two tools:

- **Notes** — up to nine `.md`, `.markdown`, or `.txt` documents. Markdown files run the integrated Typewriter presentation; TXT files display their source statically.
- **Drawing Board** — draggable note cards with one-row title-card storage, permanent saved links, board import/export, and layout repair.

Open `index.html` directly in a browser. The build does not fetch neighbouring files or require a local server.

## 2.6 Notes + Typewriter

The Notes shelf now supports nine documents. The uploaded Markdown Typewriter engine has been adapted into `js/typewriter.js` and is started only for Markdown documents. Tempo, text/background colour scopes, typo correction, Slot/Delete/Strike commands, and their looping rotation forms are supported.

The same authored source can be saved as `.txt` to bypass Markdown parsing and animation. Backpack themes and Reader mode still own presentation colours; the Typewriter module owns timing and inline commands only.

Typewriter timing preferences are persisted with Notes and included in full workspace exports.

## Link capture cleanup

Permanent Drawing Board links still use one authoritative discovery pass per paste and canonical identities that ignore common tracking parameters without collapsing meaningful fragments or application-specific parameters.

## Versioned data

Workspace and Drawing Board exports remain schema version `2`; the application version is now `2.6.1`. Notes documents add `fileType`, and Notes state adds Typewriter timing settings. Older v1.31.x/v2.x exports remain importable through the migration boundary.

## Structure

```text
index.html
css/backpack.css
js/backpack.js
js/typewriter.js
examples/typewriter-demo.md
examples/typewriter-demo.txt
```

## Version

**2.6.1**


## 2.6.1 Typewriter reveal hotfix

Markdown is now parsed into a detached staging tree. Top-level blocks are inserted into the live reader only when typing reaches them, so empty heading rules, horizontal dividers, code-block shells, tables, and images no longer pre-render on load.
