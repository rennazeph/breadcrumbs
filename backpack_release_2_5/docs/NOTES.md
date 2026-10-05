# Notes workspace — Release 2.5

Notes supports up to nine uploaded `.md`, `.markdown`, or `.txt` documents. **Load File** replaces the active empty document first; additional files can occupy the remaining document tabs.

Markdown documents use the bundled **Markdown Typewriter 2.9.0-draft.18** host runtime. TXT documents remain literal/static.

## Layout

Notes measures its own container. When the reader minimum and both Typewriter rails fit, Controls and Runtime dock around the document; otherwise they become responsive drawers without changing runtime semantics.

The reader is one coherent document column. Theme profiles may tune UI size, control height, rail width, reader measure, border weight, and gaps, but they do not redefine responsive topology.

## Typewriter controls

Backpack consumes Typewriter's `getControlSchema()` and `getControlInventory()` surfaces and presents them as **Presentation, Pace, Toggles, Holds, Repetition, Objects, and Runtime**.

Presentation sits directly beneath transport because renderer mode, pace scope, heading scheduling, and layout/theme choices are high-frequency controls. Perceptual sliders are a host editing aid; exact numeric fields preserve literal Typewriter values.

Miniature API previews are host presentation only. They may be slowed or staggered for legibility without changing document timing or exported Typewriter configuration.

## View lifecycle

Each loaded Markdown document tracks a finite-render lifetime independently from the Typewriter engine:

- **Restart on return** — remounting begins a fresh finite render.
- **Do not restart** — an interrupted render may replay, but a completed document returns completed.
- **Once per Load** — after one finite start, remounts return completed until the source is loaded again.
- **Persist in background** — the live Notes DOM/runtime is parked off-screen while another workspace is active, preserving progress, scroll, loops, and counters.

**Finish Now** completes finite typing/backspacing/animations immediately while persistent constructor/CODE/Rotation loops retain their own clocks.
