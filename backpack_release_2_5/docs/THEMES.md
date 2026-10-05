# Themes — Release 2.5

## Portable format

`BPTH4|FOUNDATION|SURFACE|ACCENT|FONT|PRESENTATION|RECIPE`

Fonts: `ui`, `mono`, `book`, `humanist`.  
Presentation profiles: `balanced`, `minimal`, `tactile`, `hard`, `cubist`.  
Recipes: `balanced`, `contrast`, `duo`, `triad`, `s-curve`.

BPTH1/BPTH2/BPTH3 strings remain accepted at the import boundary and normalize to BPTH4.

## Built-ins

- **Goldenrod / Tactile** — warm layered controls and raised card presentation.
- **Lime / Minimal** — code-oriented, compact, nearly frameless presentation.
- **Grayscale / Cubist** — geometric planes, offset shadows, and angular accents.
- **Deep Red / Hard Button** — heavier command controls and explicit press travel.
- **98 Terminal / Minimal** — dark terminal surfaces, blue interaction highlights, mono typography, and reduced padding.
- **Balanced** — neutral profile used when a custom theme does not request a stronger personality.

## Ownership boundary

A theme owns colour derivation, typography, and bounded presentation preferences such as control height, border weight, panel gaps, preferred Typewriter rail width, reader measure, and card/chrome personality.

A theme does **not** own responsive topology, Drawing Board camera scale, or Notes column structure. App Light/Dark, Reader Light/Dark, and Compact/Readable density remain separate display settings.

## Draft workflow

Theme authoring uses three states:

- **Preset** — a starting point only.
- **Draft** — temporary colours/font/profile/recipe shown in the live specimen.
- **Applied** — the active theme stored in workspace preferences.

Selecting a preset does not change the workspace until **Apply Theme** is used. **Revert draft** returns the generator to the applied theme. Portable codes load into the draft first.

## Calculation recipes

`balanced` uses the three sources directly; `contrast` strengthens small-text/border separation; `duo` treats Foundation + Accent as authoritative and calculates Surface; `triad` keeps all three sources visibly distinct; `s-curve` applies smoothstep weighting to deep/soft variants.
