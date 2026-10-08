# Themes — Release 2.5.1

## Portable format

Current portable themes use:

`BPTH5|FOUNDATION|SURFACE|ACCENT|FONT|PRESENTATION|RECIPE|MARBLES`

BPTH1–BPTH4 remain importable and normalize forward.

## Theme Creator

Theme Creator presents the actual derivation pipeline as:

**Seeds → Inference → Roles → Preview**

Three authored source colours enter at the top. Derived variants feed semantic App, Controls, Text, Reader, Code, and Board roles. Hover traces a role back to its source; the explicit Flow demonstration highlights the route sequentially instead of lighting the full graph at once.

Accent source modes are distinct:

- **Fixed** — use the authored Accent literally.
- **Harmonize** — choose from a small constrained harmony set.
- **Explore** — generate a seeded family of candidates; selecting a candidate applies it immediately and **New seed** rerolls the candidate family.

The Preview is content-driven and keeps Backpack, Typewriter, and Components specimens close to their controls rather than centering them through unused height.

## Presentation profiles

Presentation is structural, not merely colour/font substitution:

- **Balanced** — neutral compatibility grammar.
- **Minimal / Code** — flat, concise controls and reduced chrome.
- **Tactile / Desk** — raised actions, inset fields, physical tabs, grouped surfaces.
- **Instrument** — rail-marked command surfaces and explicit state marks.
- **Ledger / Index** — ruled planes, index tabs, asymmetric section framing.
- **98 Terminal** — single-pixel windows, transparent commands, underline states, terminal geometry.

Supported typeface families include UI Sans, Classic UI, Humanist, Narrow UI, Book Serif, Mono, and Terminal.

## Marble styles

Marble geometry is independent from Presentation. Available styles are:

- **Polished Orb** (`orb`)
- **Flat Signal** (`flat`)
- **Instrument Round** (`round`)
- **Ledger Square** (`square`)
- **98 Token** (`terminal`)

Changing Presentation alone no longer changes marble geometry. Selecting a built-in preset sets both values explicitly; custom themes may combine any compatible Presentation and Marble style.

## Semantic contrast

Themes derive contrast-checked foreground/background pairs for normal controls, hover controls, active controls, inputs, Notes code roles, reader roles, and Drawing Board card roles. Presentation may alter shape, border, bevel, shadow, or travel, but it should not split a semantic foreground/background pair.

## Built-in personalities

- **Goldenrod** — Tactile / Desk + Humanist + Polished Orb.
- **Lime** — Minimal / Code + Mono + Flat Signal.
- **Grayscale** — Ledger / Index + Book Serif + Ledger Square.
- **Deep Red** — Instrument + Narrow UI + Instrument Round.
- **98 Terminal** — 98 Terminal + Terminal type + 98 Token.

App Light/Dark, Reader Light/Dark, and Compact/Readable density remain separate display settings and do not rewrite the BPTH5 string.
