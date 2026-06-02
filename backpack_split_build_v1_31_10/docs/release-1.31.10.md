# Backpack 1.31.10 Release Notes

## Purpose

v1.31.10 is a regression hotfix for the v1.31.9 CSS contract cleanup. It keeps the visual direction of v1.31.8/v1.31.9, but moves the final semantic contracts to body scope so active theme classes are always respected.

## Fixed

- Reader dark mode now resolves reader surfaces from the active `bp-reading-dark` state.
- Template - Medium wiki page headers, side cards, image captions, source strips, and Markdown text use reader tokens instead of app chrome tokens.
- Calendar day cells now consume the Calendar/Gantt contract tokens instead of older general surface/goldenrod variables.
- Tab buttons now consume the shared control contract for default, hover/focus, and selected states.

## Validation checklist

- Cycle all themes and verify tab buttons follow the active theme.
- Toggle App Light/Dark and Reader Light/Dark independently.
- Confirm Template - Medium Links remains readable in App Light + Reader Dark and App Dark + Reader Light.
- Confirm Calendar day cells and Gantt standby rail change with Gold, Lime, Gray, and Red themes.
