# Drawing Board — Release 2.5

Drawing Board stores positions and sizes in logical cells. `geometryVersion: 3` uses a **120×90 minimum extent** that can expand to fit the viewport or new content without rescaling existing cards.

## Card presentations

Cards can be **Open**, **Collapsed**, or **Marble**. The bottom-right marble is the presentation/manipulation anchor: click toggles Open/Collapsed, drag resizes an open card, and double-click enters/exits Marble. Free marbles can be moved independently while the card's open geometry remains available for restoration.

Content modes are `rich`, `markdown`, `code`, and `ab`; presentation is `static` or `typewriter`. Markdown keeps one canonical source and can switch between Edit/Preview. Code stores source/language and renders a terminal-style viewport with clipboard copy. A/B keeps two independently editable columns beneath the title.

## Creation palette

The permanent left rail contains theme-linked swatches, icon-only generators, saved templates, and a larger labelled drawer. Colour and generator selection are independent. Dragging a colour uses the selected generator/template; dragging a generator/template uses the selected colour. Drops map directly to logical board coordinates and search nearby for safe placement.

Built-in generators include Text, Markdown, Code, Typewriter, A/B, and Area Group. Saved Typewriter templates include API Documentation and Quote Loop.

## Marbles and holders

Marble visuals derive from content/presentation identity and can also use saved Icon, Emoji, Pattern, or Gradient styles.

Persistent holders include Important, Delete, Code, Search, Mail, Notes, Music, Links, and Unsorted. A holder owns marbles independently from whether one of its notes is temporarily opened on the board. Non-destructive holders can recall temporary members; Delete requires explicit recovery before a marble can be opened.

Holders can move, collapse/expand, accept dropped marbles, and dock into the creation rail. Dock state/order and marble ownership persist.

## Area Groups

Area Groups render below cards as persistent tinted regions. They can be moved, resized, renamed, and deleted from the administrative controls without changing the geometry of cards placed inside them.

## Camera and repair

- **100%** is canonical 8 px per logical unit.
- **□ Board** shows the full current extent.
- **↔ Width** and **↕ Height** fit the elastic extent.
- **− / +** zoom without rewriting saved geometry.

Navigate / Repair is non-destructive until an explicit action is chosen. It can rename notes/groups, centre a target, move a note to 0,0, safe-resize it, duplicate it at 0,0, bring it forward, route an orphan to Unsorted, or permanently delete it. Invalid imported geometry remains diagnosable while rendering uses a safe reachable copy.
