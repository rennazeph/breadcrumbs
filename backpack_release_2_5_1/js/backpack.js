(() => {
  "use strict";

  /***************************************************************************
   * Backpack Release 2.5.1 core configuration
   ***************************************************************************/
  const CONFIG = Object.freeze({
    appVersion: "2.45.0", // compatibility/build lineage; do not regress this value
    releaseVersion: "2.5.1",
    workspaceSchema: 2,
    workspaceFormat: "the-backpack-workspace",
    boardFormat: "the-backpack-drawing-board",
    storageKey: "the-backpack-state-v2",
    legacyStorageKey: "the-backpack-alpha-state-v1",
    notesMaxDocuments: 9,
    drawingBoard: Object.freeze({
      geometryVersion: 3,
      styleVersion: 13,
      columns: 120,
      rows: 90,
      maxColumns: 1000,
      maxRows: 1000,
      extentMarginCells: 4,
      legacyColumns: 24,
      legacyRows: 18,
      defaultW: 20,
      defaultH: 15,
      collapsedH: 5,
      minW: 10,
      minH: 15,
      maxOverlapCells: 5,
      baseRenderedCellPx: 8,
      minRenderedCellPx: 4,
      maxRenderedCellPx: 20,
      fitPaddingPx: 12,
      marbleDiameterPx: 30,
      marbleAnchorInsetPx: 3,
      marbleRailDiameterPx: 26,
      marbleRailMinDiameterPx: 18,
      marbleRailMaxVisibleWidthPx: 360,
      minViewScale: 0.55,
      maxViewScale: 2.4,
      creation: Object.freeze({
        textW: 20, textH: 15,
        markdownW: 24, markdownH: 16,
        codeW: 28, codeH: 18,
        typewriterW: 28, typewriterH: 18,
        abW: 32, abH: 18,
        todoW: 26, todoH: 18,
        tableW: 18, tableH: 15,
        apiW: 36, apiH: 24,
        quoteW: 28, quoteH: 16,
        groupW: 42, groupH: 28
      })
    })
  });

  const THEME_FORMAT = "BPTH5";
  const LEGACY_THEME_FORMAT_V4 = "BPTH4";
  const LEGACY_THEME_FORMAT_V3 = "BPTH3";
  const LEGACY_THEME_FORMAT_V2 = "BPTH2";
  const LEGACY_THEME_FORMAT = "BPTH1";
  const FONT_PRESETS = Object.freeze([
    Object.freeze({ id: "ui", name: "UI Sans", stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }),
    Object.freeze({ id: "classic", name: "Classic UI", stack: 'Tahoma, Verdana, "Segoe UI", sans-serif' }),
    Object.freeze({ id: "humanist", name: "Humanist", stack: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif' }),
    Object.freeze({ id: "narrow", name: "Narrow UI", stack: 'Bahnschrift, "Arial Narrow", "Aptos Narrow", "Segoe UI", sans-serif' }),
    Object.freeze({ id: "book", name: "Book Serif", stack: 'Georgia, Cambria, "Times New Roman", serif' }),
    Object.freeze({ id: "mono", name: "Mono", stack: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace' }),
    Object.freeze({ id: "terminal", name: "Terminal", stack: '"Lucida Console", Consolas, Monaco, "Courier New", monospace' })
  ]);
  const DEFAULT_FONT_ID = "ui";
  const PRESENTATION_PROFILES = Object.freeze([
    Object.freeze({ id: "balanced", name: "Balanced", railWidth: 316, toolControlMax: 286, actionMax: 128, readerMin: 600, gap: 5, controlH: 23, border: 1, panelGap: 5, readerMeasure: 86, uiXs: 10.5, uiSm: 11.5, uiMd: 12.5, readerSize: 16, minDockHeight: 520, rotationHeight: 96, openGroups: Object.freeze(["renderer", "rotation"]) }),
    Object.freeze({ id: "minimal", name: "Minimal / Code", railWidth: 268, toolControlMax: 244, actionMax: 112, readerMin: 540, gap: 3, controlH: 19, border: 1, panelGap: 3, readerMeasure: 88, uiXs: 10, uiSm: 11, uiMd: 12, readerSize: 15, minDockHeight: 480, rotationHeight: 72, openGroups: Object.freeze(["renderer"]) }),
    Object.freeze({ id: "tactile", name: "Tactile / Desk", railWidth: 336, toolControlMax: 304, actionMax: 136, readerMin: 624, gap: 8, controlH: 25, border: 2, panelGap: 7, readerMeasure: 82, uiXs: 11, uiSm: 12, uiMd: 13, readerSize: 16, minDockHeight: 550, rotationHeight: 96, openGroups: Object.freeze(["renderer", "rotation"]) }),
    Object.freeze({ id: "hard", name: "Instrument", railWidth: 326, toolControlMax: 292, actionMax: 130, readerMin: 600, gap: 5, controlH: 25, border: 1, panelGap: 5, readerMeasure: 84, uiXs: 10.5, uiSm: 11.5, uiMd: 12.5, readerSize: 16, minDockHeight: 530, rotationHeight: 88, openGroups: Object.freeze(["renderer", "rotation", "constructors"]) }),
    Object.freeze({ id: "cubist", name: "Ledger / Index", railWidth: 348, toolControlMax: 314, actionMax: 136, readerMin: 590, gap: 7, controlH: 22, border: 1, panelGap: 8, readerMeasure: 78, uiXs: 10.5, uiSm: 11.5, uiMd: 12.5, readerSize: 16, minDockHeight: 530, rotationHeight: 86, openGroups: Object.freeze(["renderer", "constructors"]) }),
    Object.freeze({ id: "terminal98", name: "98 Terminal", railWidth: 278, toolControlMax: 252, actionMax: 116, readerMin: 560, gap: 3, controlH: 20, border: 1, panelGap: 3, readerMeasure: 92, uiXs: 10, uiSm: 11, uiMd: 12, readerSize: 15, minDockHeight: 490, rotationHeight: 74, openGroups: Object.freeze(["renderer"]) })
  ]);
  const DEFAULT_PRESENTATION_ID = "balanced";
  const MARBLE_STYLES = Object.freeze([
    Object.freeze({ id: "orb", name: "Polished Orb", short: "Orb" }),
    Object.freeze({ id: "flat", name: "Flat Signal", short: "Flat" }),
    Object.freeze({ id: "round", name: "Instrument Round", short: "Round" }),
    Object.freeze({ id: "square", name: "Ledger Square", short: "Square" }),
    Object.freeze({ id: "terminal", name: "98 Token", short: "98 Token" })
  ]);
  const DEFAULT_MARBLE_STYLE_ID = "orb";
  const DEFAULT_THEME_RECIPE_ID = "balanced";
  const THEME_RECIPES = Object.freeze([
    Object.freeze({ id: "balanced", name: "Balanced", short: "Direct", description: "Use Foundation, Surface, and Accent directly, then resolve semantic roles with moderate contrast guards." }),
    Object.freeze({ id: "contrast", name: "High contrast", short: "Contrast", description: "Preserve the selected colours while forcing stronger text, muted-text, border, and reader separation." }),
    Object.freeze({ id: "duo", name: "Two-colour accent", short: "2-colour", description: "Treat Foundation and Accent as the authoritative pair; Surface becomes a calculated bridge between them." }),
    Object.freeze({ id: "triad", name: "Three-colour accent", short: "3-colour", description: "Keep all three source colours visibly distinct across foundation, surfaces, controls, and accents." }),
    Object.freeze({ id: "s-curve", name: "S-curve variation", short: "S-curve", description: "Use smoothstep mix weights so deep and soft variants separate more clearly while mid-tones stay controlled." })
  ]);
  const THEME_PRESETS = Object.freeze([
    Object.freeze({ id: "goldenrod", name: "Goldenrod", icon: "◆", shortLabel: "Gold", code: "BPTH5|3F292B|DB7F67|F0C45A|humanist|tactile|contrast|orb" }),
    Object.freeze({ id: "lime-analog", name: "Lime Analog", icon: "▰", shortLabel: "Lime", code: "BPTH5|020602|0B210A|B8FF35|mono|minimal|balanced|flat" }),
    Object.freeze({ id: "grayscale", name: "Grayscale", icon: "◫", shortLabel: "Gray", code: "BPTH5|090909|242424|F1F1F1|book|cubist|balanced|square" }),
    Object.freeze({ id: "deep-red", name: "Deep Red", icon: "▣", shortLabel: "Red", code: "BPTH5|160307|741725|FF6F86|narrow|hard|contrast|round" }),
    Object.freeze({ id: "terminal98", name: "98 Terminal", icon: "⌘", shortLabel: "98", code: "BPTH5|12070A|07111D|2F81F7|terminal|terminal98|triad|terminal" })
  ]);
  const DEFAULT_THEME_CODE = THEME_PRESETS[0].code;
  // Preserve built-in identity for themes saved before the v2.42 presentation
  // grammar pass.  Their authored BPTH4 values stay valid; choosing the preset
  // again upgrades only the font/presentation fields.
  const LEGACY_THEME_PRESET_CODES = Object.freeze(new Map([
    ["BPTH4|3F292B|DB7F67|F0C45A|humanist|tactile|contrast", "goldenrod"],
    ["BPTH4|020602|0B210A|B8FF35|mono|minimal|balanced", "lime-analog"],
    ["BPTH4|090909|242424|F1F1F1|book|cubist|balanced", "grayscale"],
    ["BPTH4|160307|741725|FF6F86|narrow|hard|contrast", "deep-red"],
    ["BPTH4|12070A|07111D|2F81F7|terminal|terminal98|triad", "terminal98"],
    ["BPTH4|3F292B|DB7F67|F0C45A|ui|tactile|contrast", "goldenrod"],
    ["BPTH4|020602|0B210A|B8FF35|mono|minimal|balanced", "lime-analog"],
    ["BPTH4|090909|242424|F1F1F1|ui|cubist|balanced", "grayscale"],
    ["BPTH4|160307|741725|FF6F86|book|hard|contrast", "deep-red"],
    ["BPTH4|12070A|07111D|2F81F7|mono|minimal|triad", "terminal98"]
  ]));

  // Human-facing timing grammar. Sliders use perceptual stops concentrated
  // around the useful centre while exact number fields keep the full API range.
  const TYPEWRITER_STANDARD_TIMING = Object.freeze({
    baseCharacterMs: 50,
    playbackRate: 1,
    rotationSpeedMs: 500,
    visibleHoldMs: 1000,
    blankHoldMs: 250,
    struckHoldMs: 400,
  });
  const TYPEWRITER_PERCEPTUAL_SCALES = Object.freeze({
    "typing-rate": Object.freeze([0.25, 0.35, 0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 2, 3, 4, 8, 16, 32, 64]),
    "motion-rate": Object.freeze([0.25, 0.35, 0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 2, 3, 4]),
    "hold-ms": Object.freeze([0, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 650, 800, 1000, 1250, 1500, 2000, 3000, 5000, 10000, 20000]),
  });

  // Preview timing is a Backpack presentation policy, deliberately separate
  // from Typewriter runtime timing. Tiny specimens should teach an effect, not
  // reproduce sub-second production cadence that is difficult to inspect.
  const TYPEWRITER_PREVIEW_POLICY = Object.freeze({
    maxConcurrent: 4,
    staggerMs: 160,
    releasePaddingMs: 140,
    floorMs: Object.freeze({
      "strong-pulse": 1600,
      "link-reveal": 2000,
      "list-vignette": 1800,
      strikeout: 1800,
      rotation: 2800,
      "code-loop": 2200,
      default: 1800,
    }),
  });

  const NOTE_COLORS = Object.freeze(["#ffd166", "#a7f3d0", "#bfdbfe", "#fecdd3", "#ddd6fe", "#fef3c7"]);
  const DRAWING_BOARD_PALETTE_SIZE = 12;
  const BOARD_CREATION_COLOR_NAMES = Object.freeze([
    "Accent / surface", "Surface / accent", "Accent / foundation", "Surface deep",
    "Foundation / accent", "Accent deep", "Foundation", "Surface", "Accent",
    "Foundation soft", "Surface soft", "Accent soft"
  ]);
  // v2.43 note-type registry. Content identity belongs here; renderers and
  // conversion surfaces consume this metadata instead of re-declaring type
  // labels, glyphs, presentation capability, and creation ids independently.
  const BOARD_NOTE_TYPES = Object.freeze([
    Object.freeze({ id: "rich", creationId: "text", icon: "T", creationLabel: "Text note", label: "Rich text", shortLabel: "Rich", marbleKind: "rich", marbleGlyph: "", supportsTypewriter: false }),
    Object.freeze({ id: "markdown", creationId: "markdown", icon: "M", creationLabel: "Markdown note", label: "Markdown", shortLabel: "MD", marbleKind: "markdown", marbleGlyph: "", supportsTypewriter: true }),
    Object.freeze({ id: "code", creationId: "code", icon: "</>", creationLabel: "Code note", label: "Code / Terminal", shortLabel: "Code", marbleKind: "code", marbleGlyph: ">_", supportsTypewriter: false }),
    Object.freeze({ id: "ab", creationId: "ab", icon: "⊤", creationLabel: "A/B note", label: "A/B note", shortLabel: "A/B", marbleKind: "ab", marbleGlyph: "A/B", supportsTypewriter: false }),
    Object.freeze({ id: "todo", creationId: "todo", icon: "☑", creationLabel: "To Do note", label: "To Do list", shortLabel: "To Do", marbleKind: "todo", marbleGlyph: "☑", supportsTypewriter: false }),
    Object.freeze({ id: "table", creationId: "table", icon: "▦", creationLabel: "Table note", label: "Table", shortLabel: "Table", marbleKind: "table", marbleGlyph: "▦", supportsTypewriter: false })
  ]);
  const BOARD_NOTE_TYPE_MAP = new Map(BOARD_NOTE_TYPES.map(definition => [definition.id, definition]));
  function boardNoteTypeDefinition(mode) {
    return BOARD_NOTE_TYPE_MAP.get(String(mode || "").toLowerCase()) || BOARD_NOTE_TYPE_MAP.get("rich");
  }
  function normalizeBoardContentMode(mode) {
    return boardNoteTypeDefinition(mode).id;
  }
  const BOARD_CREATION_STYLES = Object.freeze([
    ...BOARD_NOTE_TYPES.map(definition => Object.freeze({ id: definition.creationId, icon: definition.icon, label: definition.creationLabel })),
    Object.freeze({ id: "typewriter", icon: "▮", label: "Typewriter note" }),
    Object.freeze({ id: "group", icon: "▧", label: "Area group" })
  ]);
  const BOARD_CREATION_TEMPLATES = Object.freeze([
    Object.freeze({ id: "api-doc", icon: "⌘", label: "API Documentation", category: "Typewriter effects" }),
    Object.freeze({ id: "quote-loop", icon: "❝", label: "Quote Loop", category: "Typewriter effects" })
  ]);
  // Holder ids are persistence identities. Labels, icons, colours, and ordering
  // may change without rewriting note ownership. `park` and `delete` are the two
  // protected ids; every other built-in is merely an initial catalog entry.
  const BOARD_HOLDERS = Object.freeze([
    Object.freeze({ id: "park", label: "Important", icon: "📌", defaultX: 0.50, defaultY: 0.045, collapsed: false, protected: true, builtin: true }),
    Object.freeze({ id: "delete", label: "Delete", icon: "🗑", defaultX: 0.965, defaultY: 0.945, collapsed: true, destructive: true, protected: true, builtin: true }),
    Object.freeze({ id: "code", label: "Code", icon: "</>", defaultX: 0.18, defaultY: 0.12, collapsed: true, builtin: true }),
    Object.freeze({ id: "search", label: "Search", icon: "🔎", defaultX: 0.30, defaultY: 0.12, collapsed: true, builtin: true }),
    Object.freeze({ id: "mail", label: "Mail", icon: "📧", defaultX: 0.42, defaultY: 0.12, collapsed: true, builtin: true }),
    Object.freeze({ id: "note", label: "Notes", icon: "📝", defaultX: 0.54, defaultY: 0.12, collapsed: true, builtin: true }),
    Object.freeze({ id: "music", label: "Music", icon: "🎵", defaultX: 0.66, defaultY: 0.12, collapsed: true, builtin: true }),
    Object.freeze({ id: "link", label: "Links", icon: "🔗", defaultX: 0.78, defaultY: 0.12, collapsed: true, builtin: true }),
    Object.freeze({ id: "unsorted", label: "Unsorted", icon: "🧺", defaultX: 0.10, defaultY: 0.20, collapsed: true, builtin: true })
  ]);
  const BOARD_PROTECTED_HOLDER_IDS = new Set(["park", "delete"]);
  const MARBLE_MODES = Object.freeze(["auto", "glyph", "pattern", "gradient"]);
  const MARBLE_GLYPH_PRESETS = Object.freeze(["★", "◆", "✦", "⚑", "⌘", "●", "📌", "💡", "🧪", "🧭", "✅", "⚙️"]);
  const MARBLE_PATTERN_PRESETS = Object.freeze([
    Object.freeze({ id: "stripes", label: "Stripes", fill: "repeating-linear-gradient(135deg, rgba(255,255,255,.86) 0 3px, rgba(255,255,255,.12) 3px 7px, rgba(0,0,0,.28) 7px 10px)" }),
    Object.freeze({ id: "grid", label: "Grid", fill: "linear-gradient(rgba(255,255,255,.52) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.52) 1px, transparent 1px), linear-gradient(135deg, var(--bp-db-note-bg), color-mix(in srgb, var(--bp-db-note-bg), #000 34%))" }),
    Object.freeze({ id: "rings", label: "Rings", fill: "repeating-radial-gradient(circle at 42% 38%, rgba(255,255,255,.72) 0 2px, transparent 2px 5px, rgba(0,0,0,.22) 5px 7px)" }),
    Object.freeze({ id: "checker", label: "Checker", fill: "conic-gradient(from 45deg, rgba(255,255,255,.68) 0 25%, rgba(0,0,0,.26) 0 50%, rgba(255,255,255,.68) 0 75%, rgba(0,0,0,.26) 0)" }),
    Object.freeze({ id: "scan", label: "Scan", fill: "repeating-linear-gradient(0deg, rgba(255,255,255,.70) 0 1px, transparent 1px 4px), linear-gradient(135deg, var(--bp-db-note-bg), color-mix(in srgb, var(--bp-db-note-bg), #000 38%))" }),
    Object.freeze({ id: "dots", label: "Dots", fill: "radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.5px)" }),
    Object.freeze({ id: "cross", label: "Cross", fill: "linear-gradient(45deg, transparent 42%, rgba(255,255,255,.72) 42% 58%, transparent 58%), linear-gradient(-45deg, transparent 42%, rgba(255,255,255,.72) 42% 58%, transparent 58%)" }),
    Object.freeze({ id: "wave", label: "Wave", fill: "radial-gradient(ellipse at 50% 100%, transparent 52%, rgba(255,255,255,.62) 54% 60%, transparent 62%)" })
  ]);
  const MARBLE_GRADIENT_PRESETS = Object.freeze([
    Object.freeze({ id: "sunset", label: "Sunset", fill: "linear-gradient(180deg, #ffb36b 0 46%, #7b4ecb 48% 100%)" }),
    Object.freeze({ id: "ocean", label: "Ocean", fill: "linear-gradient(135deg, #eef8ff 0 38%, #1f8ed6 40% 66%, #0a284f 68% 100%)" }),
    Object.freeze({ id: "aurora", label: "Aurora", fill: "linear-gradient(145deg, #1a2c54, #65f0c2 48%, #eef06a 72%, #5640a7)" }),
    Object.freeze({ id: "violet", label: "Violet", fill: "linear-gradient(145deg, #d8cbff, #6c55d9 52%, #19142f)" }),
    Object.freeze({ id: "prism", label: "Prism", fill: "conic-gradient(from 45deg, #ffdf61, #f45fa5, #9b6cff, #55d6ff, #57e392, #ffdf61)" }),
    Object.freeze({ id: "linear", label: "Linear", fill: "linear-gradient(135deg, var(--bp-db-note-bg), var(--bp-db-note-text))" }),
    Object.freeze({ id: "radial", label: "Radial", fill: "radial-gradient(circle at 35% 30%, var(--bp-db-note-text), var(--bp-db-note-bg) 68%)" }),
    Object.freeze({ id: "conic", label: "Conic", fill: "conic-gradient(from 135deg, var(--bp-db-note-bg), var(--bp-db-note-text), var(--bp-db-note-bg))" }),
    Object.freeze({ id: "split", label: "Split", fill: "linear-gradient(135deg, var(--bp-db-note-bg) 0 48%, var(--bp-db-note-text) 52% 100%)" }),
    Object.freeze({ id: "band", label: "Band", fill: "linear-gradient(135deg, var(--bp-db-note-bg) 0 28%, var(--bp-db-note-text) 34% 58%, var(--bp-db-note-bg) 66% 100%)" })
  ]);
  const URL_PATTERN = /\b((?:https?:\/\/|www\.)[^\s<>"']+)/gi;
  const ALLOWED_RICH_TAGS = new Set([
    "A", "B", "STRONG", "I", "EM", "U", "S", "BR", "DIV", "P", "UL", "OL", "LI",
    "CODE", "PRE", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6", "HR",
    "TABLE", "THEAD", "TBODY", "TR", "TH", "TD", "KBD"
  ]);
  // Whitespace emitted by Markdown serializers between block elements is
  // structural, not visible content. Keep inline spacing, but never turn the
  // serializer's `</h1>\n<p>` separator into a real <br> inside a card.
  const RICH_BLOCK_TAGS = new Set([
    "DIV", "P", "UL", "OL", "LI", "PRE", "BLOCKQUOTE", "H1", "H2", "H3",
    "H4", "H5", "H6", "HR", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD"
  ]);
  const TRACKING_QUERY_KEYS = new Set(["fbclid", "gclid", "dclid", "msclkid", "mc_cid", "mc_eid", "igshid"]);

  const DEFAULT_STATE = Object.freeze({
    schemaVersion: CONFIG.workspaceSchema,
    appVersion: CONFIG.appVersion,
    activeTab: "notes",
    headerQuote: "Markdown notes and a visual card workspace",
    preferences: Object.freeze({
      themeCode: DEFAULT_THEME_CODE,
      appMode: "dark",
      readerMode: "light",
      density: "compact"
    }),
    notes: Object.freeze({
      activeId: "note_1",
      typewriter: Object.freeze({
        playbackRate: 1,
        playbackScope: "document",
        progressiveLayout: true,
        pendingFlow: "collapse",
        flowBridge: true,
        preserveScrollAnchor: true,
        restartPolicy: "restart",
        rotationSpeed: TYPEWRITER_STANDARD_TIMING.rotationSpeedMs,
        rotationHold: TYPEWRITER_STANDARD_TIMING.visibleHoldMs,
        rendererMode: "single",
        headingVelocity: "indentation",
        headingLevels: Object.freeze([1, 2, 3]),
        constructorEnabled: Object.freeze({ codeblock: true, styledlinks: true }),
        globalControlOverrides: Object.freeze({})
      }),
      documents: Object.freeze([
        Object.freeze({
          id: "note_1",
          title: "Note 1",
          markdown: "",
          source: "Upload required",
          fileName: "",
          fileType: "empty"
        })
      ])
    }),
    drawingBoard: Object.freeze({
      geometryVersion: 3,
      styleVersion: 13,
      columns: 120,
      rows: 90,
      creation: Object.freeze({ tone: null, style: "", template: "" }),
      holderCatalog: Object.freeze(BOARD_HOLDERS.map(holder => Object.freeze({
        id: holder.id, label: holder.label, icon: holder.icon, color: "",
        protected: Boolean(holder.protected), builtin: Boolean(holder.builtin)
      }))),
      holders: Object.freeze({
        important: Object.freeze({ x: 0.50, y: 0.045, collapsed: false, docked: false, dockOrder: 1 }),
        delete: Object.freeze({ x: 0.965, y: 0.945, collapsed: true, docked: false, dockOrder: 2 }),
        code: Object.freeze({ x: 0.18, y: 0.12, collapsed: true, docked: false, dockOrder: 3 }),
        search: Object.freeze({ x: 0.30, y: 0.12, collapsed: true, docked: false, dockOrder: 4 }),
        mail: Object.freeze({ x: 0.42, y: 0.12, collapsed: true, docked: false, dockOrder: 5 }),
        note: Object.freeze({ x: 0.54, y: 0.12, collapsed: true, docked: false, dockOrder: 6 }),
        music: Object.freeze({ x: 0.66, y: 0.12, collapsed: true, docked: false, dockOrder: 7 }),
        link: Object.freeze({ x: 0.78, y: 0.12, collapsed: true, docked: false, dockOrder: 8 }),
        unsorted: Object.freeze({ x: 0.10, y: 0.20, collapsed: true, docked: false, dockOrder: 9 })
      }),
      notes: Object.freeze([]),
      groups: Object.freeze([]),
      nextZ: 1
    })
  });

  const runtime = {
    dataMenuOpen: false,
    themeMenuOpen: false,
    themeDraftCode: "",
    themeDraftOriginPresetId: "",
    themeToolView: "create",
    themePreviewTab: "backpack",
    themeAccentMode: "fixed",
    themeHarmonySeed: 417,
    themeRuntimeCache: new Map(),
    quoteEditorOpen: false,
    openLinksNoteId: "",
    notesTypewriterSettingsOpen: false,
    notesTypewriterSettingsTouched: false,
    notesWorkbenchActive: false,
    notesWorkbenchCleanup: null,
    notesWorkbenchMeasure: null,
    typewriterEngine: null,
    typewriterApiCleanup: null,
    typewriterApiRefreshFrame: 0,
    typewriterLastEvent: null,
    typewriterShowInheritedControls: false,
    typewriterTargetGroupOpen: Object.create(null),
    typewriterPreviewReplayTarget: "",
    typewriterPendingPreviewEvents: [],
    typewriterPreviewPresentationState: Object.create(null),
    typewriterPreviewActive: new Map(),
    persistedNotesView: null,
    migratedStorageKey: "",
    boardView: {
      mode: "actual",
      scale: 1,
      cellPx: CONFIG.drawingBoard.baseRenderedCellPx
    },
    boardViewCleanup: null,
    boardRepairOpen: false,
    boardRepairTargetId: "",
    boardRepairFilter: "",
    boardSelectedNoteId: "",
    boardMarkdownEditingIds: new Set(),
    boardTypewriterEngine: null,
    boardTypewriterNoteId: "",
    boardTypewriterLoadToken: 0,
    boardCardSettingsNoteId: "",
    boardCreationPaletteExpanded: false,
    boardCreationDrag: null,
    boardMarbleClickTimer: 0,
    boardMarbleAnchorTap: null,
    boardHolderTap: null,
    boardHolderTapClearTimer: 0,
    boardHolderManagerOpen: false,
    boardHolderManagerFocusId: "",
    boardStyleNoteId: "",
    boardStyleWindow: { x: 0.64, y: 0.18 },
    boardStyleColourSettleUntil: 0,
    boardMarbleAnimationTimer: 0,
    boardMarbleAnimationStep: 0
  };

  let appState = null;
  let saveTimer = 0;

  /***************************************************************************
   * Shared utilities
   ***************************************************************************/
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));


  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function uid(prefix = "id") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function asBoolean(value) {
    return value === true || value === "true" || value === 1 || value === "1";
  }

  function dateKey(date = new Date()) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function selectorEscape(value) {
    if (window.CSS?.escape) return window.CSS.escape(String(value));
    return String(value).replace(/[^a-zA-Z0-9_-]/g, character => `\\${character}`);
  }

  function showToast(message) {
    const stack = $("#bpToasts");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = "bp-toast";
    toast.textContent = message;
    stack.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  function setSaveStatus(text, state = "saved") {
    const status = $("#bpSaveStatus");
    if (!status) return;
    status.textContent = text;
    status.dataset.state = state;
  }

  function queueSaveState(delay = 220) {
    if (!appState) return;
    window.clearTimeout(saveTimer);
    setSaveStatus("Saving…", "saving");
    saveTimer = window.setTimeout(() => saveState(), delay);
  }

  function flushPendingSave() {
    if (!saveTimer) return;
    saveState();
  }

  function downloadJSON(payload, fileName) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function readJSONFile(file) {
    if (!file) throw new Error("No file selected.");
    return JSON.parse(await file.text());
  }

  function normalizeHexColor(value) {
    const match = String(value || "").trim().match(/^#?([0-9a-f]{6})$/i);
    return match ? `#${match[1].toUpperCase()}` : "";
  }

  function fontPresetById(value) {
    return FONT_PRESETS.find(item => item.id === String(value || "").trim().toLowerCase()) || FONT_PRESETS.find(item => item.id === DEFAULT_FONT_ID);
  }

  function presentationProfileById(value) {
    const id = String(value || "").trim().toLowerCase();
    return PRESENTATION_PROFILES.find(item => item.id === id) || PRESENTATION_PROFILES.find(item => item.id === DEFAULT_PRESENTATION_ID);
  }

  function marbleStyleById(value) {
    const id = String(value || "").trim().toLowerCase();
    return MARBLE_STYLES.find(item => item.id === id) || MARBLE_STYLES.find(item => item.id === DEFAULT_MARBLE_STYLE_ID);
  }

  function themeRecipeById(value) {
    const id = String(value || "").trim().toLowerCase();
    return THEME_RECIPES.find(item => item.id === id) || THEME_RECIPES.find(item => item.id === DEFAULT_THEME_RECIPE_ID);
  }

  function builtInPresentationForPalette(base, surface, accent) {
    const signature = [base, surface, accent].map(normalizeHexColor).join("|");
    const profiles = new Map([
      ["#3F292B|#DB7F67|#F0C45A", "tactile"],
      ["#020602|#0B210A|#B8FF35", "minimal"],
      ["#090909|#242424|#F1F1F1", "cubist"],
      ["#160307|#741725|#FF6F86", "hard"],
      ["#12070A|#07111D|#2F81F7", "terminal98"]
    ]);
    return profiles.get(signature) || DEFAULT_PRESENTATION_ID;
  }

  function builtInRecipeForPalette(base, surface, accent) {
    const signature = [base, surface, accent].map(normalizeHexColor).join("|");
    return new Map([
      ["#3F292B|#DB7F67|#F0C45A", "contrast"],
      ["#160307|#741725|#FF6F86", "contrast"]
    ]).get(signature) || DEFAULT_THEME_RECIPE_ID;
  }

  function builtInMarbleStyleForPalette(base, surface, accent) {
    const signature = [base, surface, accent].map(normalizeHexColor).join("|");
    return new Map([
      ["#3F292B|#DB7F67|#F0C45A", "orb"],
      ["#020602|#0B210A|#B8FF35", "flat"],
      ["#090909|#242424|#F1F1F1", "square"],
      ["#160307|#741725|#FF6F86", "round"],
      ["#12070A|#07111D|#2F81F7", "terminal"]
    ]).get(signature) || DEFAULT_MARBLE_STYLE_ID;
  }

  function parseThemeString(value) {
    const source = String(value || "").trim();
    const colors = source.match(/#?[0-9a-f]{6}/gi) || [];
    if (colors.length !== 3) return null;
    const [base, surface, accent] = colors.map(normalizeHexColor);
    if (!base || !surface || !accent) return null;

    const parts = source.split("|").map(part => part.trim());
    const format = String(parts[0] || "").toUpperCase();
    let fontId = DEFAULT_FONT_ID;
    let profileId = DEFAULT_PRESENTATION_ID;
    let recipeId = DEFAULT_THEME_RECIPE_ID;
    let marbleStyleId = builtInMarbleStyleForPalette(base, surface, accent);
    if (format === THEME_FORMAT) {
      fontId = fontPresetById(parts[4]).id;
      profileId = presentationProfileById(parts[5]).id;
      recipeId = themeRecipeById(parts[6]).id;
      marbleStyleId = marbleStyleById(parts[7]).id;
    } else if (format === LEGACY_THEME_FORMAT_V4) {
      fontId = fontPresetById(parts[4]).id;
      profileId = presentationProfileById(parts[5]).id;
      recipeId = themeRecipeById(parts[6]).id;
    } else if (format === LEGACY_THEME_FORMAT_V3) {
      fontId = fontPresetById(parts[4]).id;
      profileId = presentationProfileById(parts[5]).id;
      recipeId = builtInRecipeForPalette(base, surface, accent);
    } else if (format === LEGACY_THEME_FORMAT_V2) {
      fontId = fontPresetById(parts[4]).id;
      profileId = builtInPresentationForPalette(base, surface, accent);
      recipeId = builtInRecipeForPalette(base, surface, accent);
    } else if (format === LEGACY_THEME_FORMAT) {
      fontId = "mono";
      profileId = builtInPresentationForPalette(base, surface, accent);
      recipeId = builtInRecipeForPalette(base, surface, accent);
    } else {
      const knownFont = parts.find(part => FONT_PRESETS.some(item => item.id === part));
      const knownProfile = parts.find(part => PRESENTATION_PROFILES.some(item => item.id === part));
      const knownRecipe = parts.find(part => THEME_RECIPES.some(item => item.id === part));
      const knownMarbleStyle = parts.find(part => MARBLE_STYLES.some(item => item.id === part));
      fontId = fontPresetById(knownFont || DEFAULT_FONT_ID).id;
      profileId = presentationProfileById(knownProfile || builtInPresentationForPalette(base, surface, accent)).id;
      recipeId = themeRecipeById(knownRecipe || DEFAULT_THEME_RECIPE_ID).id;
      marbleStyleId = marbleStyleById(knownMarbleStyle || marbleStyleId).id;
    }

    return {
      base,
      surface,
      accent,
      fontId,
      profileId,
      recipeId,
      marbleStyleId,
      code: `${THEME_FORMAT}|${base.slice(1)}|${surface.slice(1)}|${accent.slice(1)}|${fontId}|${profileId}|${recipeId}|${marbleStyleId}`
    };
  }

  function themeCodeFromLegacy(value) {
    const parsed = parseThemeString(value);
    if (parsed) return parsed.code;
    const preset = THEME_PRESETS.find(item => item.id === String(value || ""));
    return preset?.code || DEFAULT_THEME_CODE;
  }

  function themePresetForCode(value) {
    const parsed = parseThemeString(value);
    if (!parsed) return null;
    const exact = THEME_PRESETS.find(item => item.code === parsed.code);
    if (exact) return exact;
    const legacyId = LEGACY_THEME_PRESET_CODES.get(parsed.code);
    return legacyId ? THEME_PRESETS.find(item => item.id === legacyId) || null : null;
  }

  function appliedTheme() {
    return parseThemeString(appState?.preferences?.themeCode) || parseThemeString(DEFAULT_THEME_CODE);
  }

  function clearThemeDraft() {
    runtime.themeDraftCode = "";
    runtime.themeDraftOriginPresetId = "";
  }

  function syncThemeGeneratorControls(theme) {
    if (!theme) return;
    const controlSets = [
      { base: "#bpThemeBase", surface: "#bpThemeSurface", accent: "#bpThemeAccent", font: "#bpThemeFont", profile: "#bpThemeProfile", marble: "#bpThemeMarbleStyle", recipe: null, code: "#bpThemeStringInput" },
      { base: "#bpToolThemeBase", surface: "#bpToolThemeSurface", accent: "#bpToolThemeAccent", font: "#bpToolThemeFont", profile: "#bpToolThemeProfile", marble: "#bpToolThemeMarbleStyle", recipe: "#bpToolThemeRecipe", code: "#bpToolThemeStringInput" },
    ];
    controlSets.forEach(set => {
      const base = $(set.base);
      const surface = $(set.surface);
      const accent = $(set.accent);
      const font = $(set.font);
      const profile = $(set.profile);
      const marble = $(set.marble);
      const recipe = set.recipe ? $(set.recipe) : null;
      const stringInput = $(set.code);
      if (base) base.value = theme.base;
      if (surface) surface.value = theme.surface;
      if (accent) accent.value = theme.accent;
      if (font) font.value = theme.fontId;
      if (profile) profile.value = theme.profileId;
      if (marble) marble.value = theme.marbleStyleId || DEFAULT_MARBLE_STYLE_ID;
      if (recipe) recipe.value = theme.recipeId || DEFAULT_THEME_RECIPE_ID;
      if (stringInput && document.activeElement !== stringInput) stringInput.value = theme.code;
    });
  }

  function ensureThemeDraft() {
    let draft = parseThemeString(runtime.themeDraftCode);
    if (draft) return draft;
    draft = appliedTheme();
    runtime.themeDraftCode = draft.code;
    runtime.themeDraftOriginPresetId = themePresetForCode(draft.code)?.id || "";
    syncThemeGeneratorControls(draft);
    return draft;
  }

  function setThemeDraft(code, { originPresetId = null, syncControls = true } = {}) {
    const draft = parseThemeString(code);
    if (!draft) return null;
    runtime.themeDraftCode = draft.code;
    const exactPreset = themePresetForCode(draft.code);
    if (originPresetId !== null) runtime.themeDraftOriginPresetId = originPresetId;
    else if (exactPreset) runtime.themeDraftOriginPresetId = exactPreset.id;
    if (syncControls) syncThemeGeneratorControls(draft);
    updateThemeGeneratorPreview(draft);
    updateThemeDraftUI(draft);
    return draft;
  }

  function updateThemeDraftUI(draft = ensureThemeDraft()) {
    if (!draft) return;
    const applied = appliedTheme();
    const appliedPreset = themePresetForCode(applied.code);
    const draftPreset = themePresetForCode(draft.code);
    const originPreset = THEME_PRESETS.find(item => item.id === runtime.themeDraftOriginPresetId) || null;
    const dirty = draft.code !== applied.code;

    const appliedName = $("#bpThemeCurrentName");
    if (appliedName) appliedName.textContent = `Applied · ${appliedPreset?.shortLabel || "Custom"}`;
    const profileBadge = $("#bpThemeProfileBadge");
    if (profileBadge) profileBadge.textContent = presentationProfileById(applied.profileId).name;

    const presetSelect = $("#bpThemePresetSelect");
    if (presetSelect) presetSelect.value = draftPreset?.id || originPreset?.id || "custom";

    const status = $("#bpThemeDraftStatus");
    if (status) {
      if (!dirty) status.textContent = "Applied";
      else if (draftPreset) status.textContent = `Draft · ${draftPreset.name}`;
      else if (originPreset) status.textContent = `Custom from ${originPreset.shortLabel}`;
      else status.textContent = "Custom draft";
      status.classList.toggle("is-dirty", dirty);
    }

    const applyButton = $("#bpThemeApplyBtn");
    if (applyButton) {
      applyButton.disabled = !dirty;
      applyButton.textContent = dirty ? "Apply Theme" : "Applied ✓";
    }
    const revertButton = $("#bpThemeRevertBtn");
    if (revertButton) revertButton.disabled = !dirty;
  }

  function rgbFromHex(value) {
    const hex = normalizeHexColor(value) || "#000000";
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16)
    };
  }

  function hexFromRgb({ r, g, b }) {
    const byte = value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
    return `#${byte(r)}${byte(g)}${byte(b)}`.toUpperCase();
  }

  function mixHex(first, second, amount = 0.5) {
    const a = rgbFromHex(first);
    const b = rgbFromHex(second);
    const t = Math.max(0, Math.min(1, Number(amount) || 0));
    return hexFromRgb({
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t
    });
  }

  function rgbaHex(value, alpha) {
    const rgb = rgbFromHex(value);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, Math.min(1, Number(alpha) || 0))})`;
  }

  function relativeLuminance(value) {
    const { r, g, b } = rgbFromHex(value);
    const channel = input => {
      const c = input / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return (0.2126 * channel(r)) + (0.7152 * channel(g)) + (0.0722 * channel(b));
  }

  function contrastRatio(first, second) {
    const a = relativeLuminance(first);
    const b = relativeLuminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }

  function contrastText(background) {
    const light = "#FFF7E8";
    const dark = "#151012";
    return contrastRatio(light, background) >= contrastRatio(dark, background) ? light : dark;
  }

  function ensureContrast(foreground, background, minimum = 4.5) {
    let candidate = normalizeHexColor(foreground) || "#FFFFFF";
    if (contrastRatio(candidate, background) >= minimum) return candidate;
    const toward = relativeLuminance(background) > 0.42 ? "#080808" : "#FFFFFF";
    for (let step = 1; step <= 12; step += 1) {
      candidate = mixHex(foreground, toward, step / 12);
      if (contrastRatio(candidate, background) >= minimum) return candidate;
    }
    return toward;
  }

  function themeRecipeWeight(theme, value) {
    const t = Math.max(0, Math.min(1, Number(value) || 0));
    return themeRecipeById(theme?.recipeId).id === "s-curve" ? (t * t * (3 - (2 * t))) : t;
  }

  function resolveThemeSources(theme) {
    const parsed = parseThemeString(theme?.code || theme) || parseThemeString(DEFAULT_THEME_CODE);
    const recipe = themeRecipeById(parsed.recipeId);
    const surface = recipe.id === "duo" ? mixHex(parsed.base, parsed.accent, 0.32) : parsed.surface;
    return { ...parsed, recipe, authoredSurface: parsed.surface, surface };
  }

  function themeMix(theme, first, second, amount) {
    return mixHex(first, second, themeRecipeWeight(theme, amount));
  }

  function themeContrastMinimum(theme, role = "text") {
    const recipe = themeRecipeById(theme?.recipeId);
    if (recipe.id === "contrast") {
      if (role === "muted") return 4.5;
      if (role === "border") return 3.2;
      if (role === "focus") return 4.5;
      return 4.5;
    }
    if (role === "muted") return 3.4;
    if (role === "border") return 2.35;
    if (role === "focus") return 3.0;
    return 4.5;
  }

  function deriveDrawingBoardPalette(theme, appMode = "dark") {
    const light = appMode === "light";
    const paper = "#FFF8EC";
    const black = "#080708";
    const resolvedTheme = resolveThemeSources(theme);
    const { base, surface, accent } = resolvedTheme;

    /*
     * Keep the first half recognisably tied to the active theme, then use six
     * chromatic families as true paint colours.  Earlier palettes were built
     * almost entirely by interpolating the same three theme sources; on warm
     * themes this made distinct notes collapse into nearly identical browns.
     * The paint half is still tempered with the theme surface so it belongs to
     * the current UI, but hue identity is deliberately preserved.
     */
    const themeSet = light
      ? [
          accent,
          surface,
          base,
          themeMix(resolvedTheme, accent, paper, 0.34),
          themeMix(resolvedTheme, surface, accent, 0.32),
          themeMix(resolvedTheme, base, accent, 0.34)
        ]
      : [
          accent,
          surface,
          base,
          themeMix(resolvedTheme, accent, black, 0.20),
          themeMix(resolvedTheme, surface, accent, 0.34),
          themeMix(resolvedTheme, base, accent, 0.38)
        ];

    const paintSeeds = [
      "#2563EB", /* cobalt */
      "#0891B2", /* cyan */
      "#16A34A", /* green */
      "#EAB308", /* yellow */
      "#EA580C", /* orange */
      "#C026D3"  /* magenta */
    ];
    const paintSurfaceWeight = light ? 0.18 : 0.14;
    const paintSet = paintSeeds.map(seed => mixHex(seed, surface, paintSurfaceWeight));
    const candidates = [...themeSet, ...paintSet];

    return candidates.slice(0, DRAWING_BOARD_PALETTE_SIZE).map(background => ({
      background,
      text: contrastText(background)
    }));
  }

  function resolvedDrawingBoardNoteStyle(note, themeCode = appState?.preferences?.themeCode, appMode = appState?.preferences?.appMode) {
    const runtimeTheme = themeRuntimeFor(
      themeCode || DEFAULT_THEME_CODE,
      appMode === "light" ? "light" : "dark",
      appState?.preferences?.readerMode || "light"
    );
    const palette = runtimeTheme.boardPalette;
    const tone = Math.max(0, Math.min(palette.length - 1, Math.round(Number(note?.themeTone) || 0)));
    const linked = note?.colorMode === "theme";
    const background = linked ? palette[tone].background : (normalizeHexColor(note?.color) || palette[tone].background);
    const text = note?.textColorMode === "custom"
      ? (normalizeHexColor(note?.textColor) || contrastText(background))
      : ensureContrast(contrastText(background), background, 4.5);
    // Note-local actions can be structurally styled by a Presentation, but their
    // foreground must be resolved against the control surface they actually use.
    // This prevents tactile/dark button treatments from pairing with a dark note
    // foreground merely because the card itself was bright.
    const runtimeVars = runtimeTheme.variables;
    const accent = normalizeHexColor(runtimeVars["--bp-accent"]) || text;
    const controlBackground = mixHex(background, text, 0.18);
    const controlText = ensureContrast(contrastText(controlBackground), controlBackground, 4.5);
    const controlHoverBackground = mixHex(controlBackground, accent, 0.22);
    const controlHoverText = ensureContrast(contrastText(controlHoverBackground), controlHoverBackground, 4.5);
    const codeBackground = mixHex(background, normalizeHexColor(runtimeVars["--bp-panel-deep"]) || background, 0.28);
    const codeText = ensureContrast(contrastText(codeBackground), codeBackground, 4.5);
    return { background, text, tone, linked, controlBackground, controlText, controlHoverBackground, controlHoverText, codeBackground, codeText };
  }

  function normalizeMarbleAppearance(mode, value) {
    // v2.41 unifies the old Symbol/Icon and Character/Emoji branches into one
    // literal Glyph contract. Old saves remain loadable and migrate in place.
    const legacyGlyph = mode === "icon" || mode === "emoji";
    const resolvedMode = legacyGlyph ? "glyph" : (MARBLE_MODES.includes(mode) ? mode : "auto");
    const raw = String(value || "").trim();
    if (resolvedMode === "glyph") {
      const custom = Array.from(raw).slice(0, 8).join("");
      return { mode: resolvedMode, value: custom || MARBLE_GLYPH_PRESETS[0] };
    }
    if (resolvedMode === "pattern") return { mode: resolvedMode, value: MARBLE_PATTERN_PRESETS.some(item => item.id === raw) ? raw : MARBLE_PATTERN_PRESETS[0].id };
    if (resolvedMode === "gradient") return { mode: resolvedMode, value: MARBLE_GRADIENT_PRESETS.some(item => item.id === raw) ? raw : MARBLE_GRADIENT_PRESETS[0].id };
    return { mode: "auto", value: "" };
  }

  function marbleCustomColours(note) {
    return {
      a: normalizeHexColor(note?.marbleColorA) || "",
      b: normalizeHexColor(note?.marbleColorB) || "",
      angle: Math.max(0, Math.min(360, Math.round(Number(note?.marbleAngle) || 135))),
      seed: Math.max(0, Math.min(9999, Math.round(Number(note?.marbleSeed) || 417))),
      scale: Math.max(3, Math.min(64, Math.round(Number(note?.marbleScale) || 8))),
      density: Math.max(1, Math.min(10, Math.round(Number(note?.marbleDensity) || 4)))
    };
  }

  function patternFill(kind, a, b, angle = 135, { seed = 417, scale = 8, density = 4 } = {}) {
    const first = a || "#f5f5f5";
    const second = b || "#20242b";
    const normalized = ((Number(angle) || 0) + (Number(seed) % 17) - 8 + 360) % 360;
    const cross = (normalized + 90) % 360;
    const unit = Math.max(3, Number(scale) || 8);
    const stroke = Math.max(1, Math.min(unit / 2, (Number(density) || 4) * .45));
    const gap = Math.max(stroke + 1, unit - Math.min(unit - 1, Number(density) || 4) * .35);
    const offset = (Number(seed) || 0) % Math.max(2, Math.round(unit));
    if (kind === "grid") return `linear-gradient(${normalized}deg, ${first} 0 ${stroke}px, transparent ${stroke}px ${unit}px), linear-gradient(${cross}deg, ${first} 0 ${stroke}px, transparent ${stroke}px ${unit}px), ${second}`;
    if (kind === "rings") {
      const radians = normalized * Math.PI / 180;
      const cx = Math.round(50 + Math.cos(radians) * (8 + (seed % 9)));
      const cy = Math.round(50 + Math.sin(radians) * (8 + (seed % 7)));
      return `repeating-radial-gradient(circle at ${cx}% ${cy}%, ${first} 0 ${stroke}px, transparent ${stroke}px ${gap}px, ${second} ${gap}px ${unit}px)`;
    }
    if (kind === "checker") return `conic-gradient(from ${normalized}deg at ${50 + (seed % 9) - 4}% ${50 + (seed % 7) - 3}%, ${first} 0 25%, ${second} 0 50%, ${first} 0 75%, ${second} 0) 0 0/${unit}px ${unit}px`;
    if (kind === "scan") return `repeating-linear-gradient(${normalized}deg, ${first} 0 ${stroke}px, transparent ${stroke}px ${unit}px), ${second}`;
    if (kind === "dots") return `radial-gradient(circle at ${offset}px ${offset}px, ${first} 0 ${stroke}px, transparent ${stroke + .8}px) 0 0/${unit}px ${unit}px, ${second}`;
    if (kind === "cross") return `linear-gradient(${normalized}deg, transparent 42%, ${first} 42% 58%, transparent 58%) 0 0/${unit}px ${unit}px, linear-gradient(${cross}deg, transparent 42%, ${first} 42% 58%, transparent 58%) 0 0/${unit}px ${unit}px, ${second}`;
    if (kind === "wave") return `radial-gradient(ellipse at 50% 100%, transparent 48%, ${first} 50% 58%, transparent 60%) 0 ${offset}px/${unit * 1.4}px ${unit}px, ${second}`;
    return `repeating-linear-gradient(${normalized}deg, ${first} 0 ${stroke}px, ${second} ${stroke}px ${gap}px, ${first} ${gap}px ${unit}px)`;
  }

  function gradientPresetFill(kind, angle = 135, a = "", b = "", { seed = 417, scale = 8, density = 4 } = {}) {
    const normalized = ((Number(angle) || 0) + (Number(seed) % 13) - 6 + 360) % 360;
    const unit = Math.max(3, Math.min(64, Number(scale) || 8));
    const weight = Math.max(1, Math.min(10, Number(density) || 4));
    const drift = ((Number(seed) || 0) % 19) - 9;
    if (a || b || ["linear", "radial", "conic", "split", "band"].includes(kind)) {
      const first = a || "#f5f5f5";
      const second = b || "#20242b";
      const pivot = Math.max(24, Math.min(76, 42 + ((Number(seed) || 0) % 17) + Math.round((unit - 8) * .45)));
      const feather = Math.max(1, Math.min(12, Math.round(unit / 4)));
      if (kind === "radial") {
        const radius = Math.max(34, Math.min(96, 48 + unit * 1.7 + weight));
        return `radial-gradient(circle ${radius}% at ${28 + (seed % 31)}% ${24 + (seed % 29)}%, ${first} 0 ${Math.max(4, weight * 2)}%, ${second} ${Math.min(94, 52 + weight * 3 + unit)}%)`;
      }
      if (kind === "conic") {
        const wedge = Math.max(8, Math.min(42, unit + weight * 2));
        return `conic-gradient(from ${normalized}deg, ${first} 0 ${wedge}%, ${second} ${Math.min(88, wedge + 18 + weight)}%, ${first} 100%)`;
      }
      if (kind === "split") return `linear-gradient(${normalized}deg, ${first} 0 ${Math.max(5, pivot - feather)}%, ${second} ${Math.min(95, pivot + feather)}% 100%)`;
      if (kind === "band") {
        const halfBand = Math.max(6, Math.min(30, Math.round(unit * .8 + weight)));
        return `linear-gradient(${normalized}deg, ${first} 0 ${Math.max(4, pivot - halfBand - feather)}%, ${second} ${Math.max(8, pivot - halfBand)}% ${Math.min(92, pivot + halfBand)}%, ${first} ${Math.min(96, pivot + halfBand + feather)}% 100%)`;
      }
      const middle = Math.max(18, Math.min(82, 50 + drift + Math.round((weight - 4) * 1.5)));
      return `linear-gradient(${normalized}deg, ${first} 0%, ${first} ${Math.max(0, middle - unit)}%, ${second} ${Math.min(100, middle + unit)}%, ${second} 100%)`;
    }
    const spread = Math.max(4, Math.min(22, Math.round(unit * .75 + weight)));
    if (kind === "sunset") return `linear-gradient(${normalized}deg, #ffb36b 0 ${Math.max(24, 50 - spread)}%, #7b4ecb ${Math.min(72, 50 + Math.round(spread * .35))}% 100%)`;
    if (kind === "ocean") return `linear-gradient(${normalized}deg, #eef8ff 0 ${Math.max(22, 42 - spread)}%, #1f8ed6 ${Math.max(28, 44 - Math.round(spread * .3))}% ${Math.min(78, 58 + spread)}%, #0a284f ${Math.min(90, 62 + spread)}% 100%)`;
    if (kind === "aurora") return `linear-gradient(${normalized}deg, #1a2c54 0%, #65f0c2 ${Math.max(24, 48 - spread)}%, #eef06a ${Math.min(82, 60 + spread)}%, #5640a7 100%)`;
    if (kind === "violet") return `linear-gradient(${normalized}deg, #d8cbff 0%, #6c55d9 ${Math.max(30, Math.min(70, 52 + drift))}%, #19142f 100%)`;
    if (kind === "prism") {
      const phase = Math.max(4, Math.min(14, Math.round(unit / 2)));
      return `conic-gradient(from ${normalized}deg, #ffdf61 0 ${phase}%, #f45fa5 ${phase + 8}%, #9b6cff ${phase + 23}%, #55d6ff ${phase + 40}%, #57e392 ${phase + 58}%, #ffdf61 100%)`;
    }
    return `linear-gradient(${normalized}deg, #f5f5f5, #20242b)`;
  }

  function resolvedMarbleAppearance(note) {
    const appearance = normalizeMarbleAppearance(note?.marbleMode, note?.marbleValue);
    const custom = marbleCustomColours(note);
    let glyph = boardMarbleGlyph(note);
    let fill = "";
    if (appearance.mode === "glyph") glyph = appearance.value;
    if (appearance.mode === "pattern" || appearance.mode === "gradient") {
      // Procedural faces inherit a safe palette from the active theme unless the
      // author explicitly overrides A/B. Geometry (seed/scale/density/angle) is
      // independent from colour, so rerolling never breaks theme consistency.
      const fallback = resolvedDrawingBoardNoteStyle(note);
      const themeVars = currentThemeRuntime().variables;
      const first = custom.a || themeVars["--bp-accent-soft"] || mixHex(fallback.background, fallback.text, .28);
      const second = custom.b || fallback.background;
      if (appearance.mode === "pattern") {
        fill = patternFill(appearance.value, first, second, custom.angle, custom);
      } else {
        const literalLegacy = ["sunset", "ocean", "aurora", "violet", "prism"].includes(appearance.value) && !custom.a && !custom.b;
        fill = literalLegacy
          ? gradientPresetFill(appearance.value, custom.angle, "", "", custom)
          : gradientPresetFill(appearance.value, custom.angle, first, second, custom);
      }
    }
    return { ...appearance, glyph, fill };
  }

  function marbleAppearanceAttrs(note) {
    const appearance = resolvedMarbleAppearance(note);
    const style = appearance.fill ? `--bp-db-marble-face:${appearance.fill};` : "";
    return { appearance, style };
  }

  function deriveThemeVariables(themeCode, appMode = "dark", readerMode = "light") {
    const theme = parseThemeString(themeCode) || parseThemeString(DEFAULT_THEME_CODE);
    const resolvedTheme = resolveThemeSources(theme);
    const { base, surface, accent, recipe } = resolvedTheme;
    const font = fontPresetById(theme.fontId);
    const profile = presentationProfileById(theme.profileId);
    const codeFont = fontPresetById("mono");
    const light = appMode === "light";
    const paper = "#FFF8EC";
    const black = "#080708";
    const mix = (first, second, amount) => themeMix(resolvedTheme, first, second, amount);
    const isContrast = recipe.id === "contrast";
    const isTriad = recipe.id === "triad";

    let background;
    let panel;
    let panelSoft;
    let panelDeep;
    let control;
    let controlHover;
    if (isContrast) {
      background = light ? mix(base, paper, 0.82) : mix(base, black, 0.22);
      panel = light ? mix(surface, paper, 0.88) : mix(surface, base, 0.42);
      panelSoft = light ? mix(surface, paper, 0.94) : mix(surface, base, 0.30);
      panelDeep = light ? mix(surface, base, 0.18) : mix(surface, black, 0.58);
      control = light ? mix(base, paper, 0.88) : mix(base, surface, 0.38);
      controlHover = light ? mix(accent, paper, 0.62) : mix(accent, surface, 0.34);
    } else if (isTriad) {
      background = light ? mix(base, paper, 0.68) : mix(base, black, 0.12);
      panel = light ? mix(surface, paper, 0.72) : mix(surface, base, 0.04);
      panelSoft = light ? mix(accent, paper, 0.82) : mix(surface, accent, 0.18);
      panelDeep = light ? mix(base, surface, 0.48) : mix(surface, black, 0.48);
      control = light ? mix(base, paper, 0.82) : mix(base, surface, 0.42);
      controlHover = light ? mix(accent, paper, 0.58) : mix(accent, surface, 0.24);
    } else {
      background = light ? mix(base, paper, 0.76) : mix(base, black, 0.16);
      panel = light ? mix(surface, paper, 0.84) : mix(surface, base, 0.10);
      panelSoft = light ? mix(surface, paper, 0.92) : mix(surface, accent, 0.10);
      panelDeep = light ? mix(surface, accent, 0.26) : mix(surface, black, 0.40);
      control = light ? mix(surface, paper, 0.94) : mix(base, surface, 0.56);
      controlHover = light ? mix(accent, paper, 0.70) : mix(surface, accent, 0.24);
    }

    const text = contrastText(panel);
    const controlText = contrastText(control);
    const controlHoverText = contrastText(controlHover);
    const activeText = contrastText(accent);
    const inputBackground = light ? mix(panelDeep, paper, 0.10) : mix(panelDeep, paper, 0.04);
    const inputText = contrastText(inputBackground);
    const muted = ensureContrast(mix(text, panel, isContrast ? 0.20 : 0.34), panel, themeContrastMinimum(theme, "muted"));
    const border = ensureContrast(accent, panel, themeContrastMinimum(theme, "border"));
    const focus = ensureContrast(mix(accent, text, 0.18), panel, themeContrastMinimum(theme, "focus"));
    const board = light ? mix(surface, paper, isContrast ? 0.80 : 0.72) : mix(surface, base, isContrast ? 0.46 : 0.30);
    const sourceVariants = {
      foundationDeep: mix(base, black, isContrast ? 0.46 : 0.34),
      foundation: base,
      foundationSoft: mix(base, paper, isContrast ? 0.42 : 0.34),
      surfaceDeep: mix(surface, base, isContrast ? 0.48 : 0.34),
      surface: surface,
      surfaceSoft: mix(surface, paper, isContrast ? 0.50 : 0.42),
      accentDeep: mix(accent, base, isContrast ? 0.46 : 0.34),
      accent: accent,
      accentSoft: mix(accent, paper, isContrast ? 0.46 : 0.38),
    };

    const readerDark = readerMode === "dark";
    const readerBackground = readerDark
      ? mix(base, black, isContrast ? 0.64 : 0.52)
      : mix(surface, paper, isContrast ? 0.97 : 0.94);
    const readerText = contrastText(readerBackground);
    const readerMuted = ensureContrast(mix(readerText, readerBackground, isContrast ? 0.18 : 0.32), readerBackground, themeContrastMinimum(theme, "muted"));
    const readerBorder = ensureContrast(mix(accent, readerBackground, 0.18), readerBackground, isContrast ? 3.0 : 2.1);
    const readerCodeBackground = readerDark ? mix(readerBackground, black, 0.52) : mix(base, black, isContrast ? 0.24 : 0.18);
    const readerCodeText = contrastText(readerCodeBackground);
    // Code is a reading surface, not an accent showcase. Pull authored accent
    // toward the code foreground before the contrast guard so highly saturated
    // themes remain identifiable without producing neon syntax on dark blocks.
    const codeAccentSafe = ensureContrast(mix(accent, readerCodeText, readerDark ? 0.58 : 0.64), readerCodeBackground, 4.5);
    const readerCodeKeyword = codeAccentSafe;
    const readerCodeString = ensureContrast(mix(sourceVariants.accentSoft, readerCodeText, 0.46), readerCodeBackground, 4.5);
    const readerCodeNumber = ensureContrast(mix(focus, readerCodeText, 0.58), readerCodeBackground, 4.5);
    const readerCodeFunction = ensureContrast(mix(accent, readerCodeText, 0.70), readerCodeBackground, 4.5);
    const readerCodeOperator = ensureContrast(mix(readerCodeText, readerCodeBackground, 0.22), readerCodeBackground, 4.5);
    const readerCodeMuted = ensureContrast(mix(readerCodeText, readerCodeBackground, 0.38), readerCodeBackground, 3.8);
    const readerCodeSelection = mix(codeAccentSafe, readerCodeBackground, readerDark ? 0.58 : 0.70);
    const link = ensureContrast(accent, readerBackground, isContrast ? 5.0 : 4.5);
    const linkVisited = ensureContrast(mix(link, readerText, 0.36), readerBackground, isContrast ? 5.0 : 4.5);
    const boardPalette = deriveDrawingBoardPalette(theme, appMode);
    const boardPaletteVariables = {};
    boardPalette.forEach((tone, index) => {
      boardPaletteVariables[`--bp-note-tone-${index + 1}`] = tone.background;
      boardPaletteVariables[`--bp-note-tone-${index + 1}-text`] = tone.text;
    });

    return {
      theme,
      resolvedTheme,
      boardPalette,
      variables: {
        ...boardPaletteVariables,
        "--bp-font": font.stack,
        "--bp-reader-font": font.stack,
        "--bp-code-font": codeFont.stack,
        "--bp-theme-control-h": `${profile.controlH}px`,
        "--bp-theme-border-w": `${profile.border}px`,
        "--bp-theme-panel-gap": `${profile.panelGap}px`,
        "--bp-tool-rail-w": `${profile.railWidth}px`,
        "--bp-tool-control-max": `${profile.toolControlMax}px`,
        "--bp-tool-action-max": `${profile.actionMax}px`,
        "--bp-reader-min": `${profile.readerMin}px`,
        "--bp-reader-measure": `${profile.readerMeasure}ch`,
        "--bp-ui-xs": `${profile.uiXs}px`,
        "--bp-ui-sm": `${profile.uiSm}px`,
        "--bp-ui-md": `${profile.uiMd}px`,
        "--bp-reader-base-size": `${profile.readerSize}px`,
        "--bp-rotation-slider-h": `${profile.rotationHeight}px`,
        "--bp-foundation-deep": sourceVariants.foundationDeep,
        "--bp-foundation": sourceVariants.foundation,
        "--bp-foundation-soft": sourceVariants.foundationSoft,
        "--bp-surface-deep": sourceVariants.surfaceDeep,
        "--bp-surface-source": sourceVariants.surface,
        "--bp-surface-soft-source": sourceVariants.surfaceSoft,
        "--bp-accent-deep": sourceVariants.accentDeep,
        "--bp-accent-source": sourceVariants.accent,
        "--bp-accent-soft": sourceVariants.accentSoft,
        "--bp-bg": background,
        "--bp-bg-lines": rgbaHex(accent, light ? 0.035 : 0.03),
        "--bp-panel": panel,
        "--bp-panel-soft": panelSoft,
        "--bp-panel-deep": panelDeep,
        "--bp-control": control,
        "--bp-control-text": controlText,
        "--bp-control-hover": controlHover,
        "--bp-control-hover-text": controlHoverText,
        "--bp-control-active": accent,
        "--bp-control-active-text": activeText,
        "--bp-input-bg": inputBackground,
        "--bp-input-text": inputText,
        "--bp-text": text,
        "--bp-muted": muted,
        "--bp-border": border,
        "--bp-border-soft": rgbaHex(border, 0.32),
        "--bp-accent": accent,
        "--bp-focus": focus,
        "--bp-shadow": light ? "3px 3px 0 rgba(0,0,0,.24)" : "3px 3px 0 rgba(0,0,0,.52)",
        "--bp-grid-line": rgbaHex(accent, light ? 0.075 : 0.10),
        "--bp-board-bg": board,
        "--bp-board-glow": rgbaHex(accent, light ? 0.045 : 0.075),
        "--bp-reader-bg": readerBackground,
        "--bp-reader-text": readerText,
        "--bp-reader-muted": readerMuted,
        "--bp-reader-border": readerBorder,
        "--bp-reader-code-bg": readerCodeBackground,
        "--bp-reader-code-text": readerCodeText,
        "--bp-reader-code-keyword": readerCodeKeyword,
        "--bp-reader-code-string": readerCodeString,
        "--bp-reader-code-number": readerCodeNumber,
        "--bp-reader-code-function": readerCodeFunction,
        "--bp-reader-code-operator": readerCodeOperator,
        "--bp-reader-code-muted": readerCodeMuted,
        "--bp-reader-code-selection": readerCodeSelection,
        "--bp-link": link,
        "--bp-link-visited": linkVisited
      }
    };
  }

  function themeRuntimeFor(themeCode, appMode = "dark", readerMode = "light") {
    const parsed = parseThemeString(themeCode) || parseThemeString(DEFAULT_THEME_CODE);
    const key = `${parsed.code}|${appMode === "light" ? "light" : "dark"}|${readerMode === "dark" ? "dark" : "light"}`;
    const cached = runtime.themeRuntimeCache.get(key);
    if (cached) return cached;
    const derived = deriveThemeVariables(parsed.code, appMode, readerMode);
    const snapshot = Object.freeze({
      key,
      theme: derived.theme,
      resolvedTheme: derived.resolvedTheme,
      boardPalette: Object.freeze(derived.boardPalette.map(tone => Object.freeze({ ...tone }))),
      variables: Object.freeze({ ...derived.variables })
    });
    runtime.themeRuntimeCache.set(key, snapshot);
    // Theme Creator can explore many drafts. Keep a small deterministic cache
    // rather than letting exploratory palettes accumulate for the whole session.
    if (runtime.themeRuntimeCache.size > 24) {
      const oldest = runtime.themeRuntimeCache.keys().next().value;
      runtime.themeRuntimeCache.delete(oldest);
    }
    return snapshot;
  }

  function currentThemeRuntime() {
    return themeRuntimeFor(
      appState?.preferences?.themeCode || DEFAULT_THEME_CODE,
      appState?.preferences?.appMode || "dark",
      appState?.preferences?.readerMode || "light"
    );
  }

  function applyDerivedTheme(themeCode, appMode, readerMode) {
    const derived = themeRuntimeFor(themeCode, appMode, readerMode);
    for (const [key, value] of Object.entries(derived.variables)) document.body.style.setProperty(key, value);
    document.body.style.colorScheme = appMode === "light" ? "light" : "dark";
    document.body.dataset.bpTheme = themePresetForCode(derived.theme.code)?.id || "custom";
    document.body.dataset.bpPresentation = derived.theme.profileId || DEFAULT_PRESENTATION_ID;
    document.body.dataset.bpMarbleStyle = derived.theme.marbleStyleId || DEFAULT_MARBLE_STYLE_ID;
    window.requestAnimationFrame(() => {
      runtime.notesWorkbenchMeasure?.();
      updateDrawingBoardColours();
    });
    return derived.theme;
  }

  /***************************************************************************
   * Notes state, plain-text reader, and Markdown typewriter
   ***************************************************************************/
  const NOTES_CODE_LANGUAGES = Object.freeze(new Set(["verse", "js", "python"]));

  function prepareNotesMarkdownSource(markdown) {
    // Notes intentionally supports an explicit, tiny syntax surface. Language
    // comes only from the fenced info string (```verse / ```js / ```python).
    // Unknown declarations remain valid code but are normalized to plain text.
    const lines = String(markdown || "").split("\n");
    let fence = null;
    return lines.map(line => {
      if (!fence) {
        const match = /^( {0,3})(`{3,}|~{3,})([^\n]*)$/.exec(line);
        if (!match) return line;
        fence = { marker: match[2][0], length: match[2].length };
        const info = String(match[3] || "").trim();
        if (!info) return line;
        const parts = info.split(/\s+/);
        const declared = String(parts[0] || "").toLowerCase();
        if (!NOTES_CODE_LANGUAGES.has(declared)) parts[0] = "text";
        return `${match[1]}${match[2]}${parts.length ? parts.join(" ") : ""}`;
      }
      const close = new RegExp(`^ {0,3}${fence.marker === "`" ? "`" : "~"}{${fence.length},}\\s*$`).test(line);
      if (close) fence = null;
      return line;
    }).join("\n");
  }

  function titleFromFileName(fileName, fallbackIndex = 1) {
    const stem = String(fileName || "")
      .replace(/\.(?:md|markdown|txt)$/i, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return (stem || `Note ${fallbackIndex}`).slice(0, 48);
  }

  function noteFileTypeFromName(fileName) {
    if (/\.(?:md|markdown)$/i.test(String(fileName || ""))) return "markdown";
    if (/\.txt$/i.test(String(fileName || ""))) return "text";
    return "";
  }

  function normalizeTypewriterSettings(input) {
    const source = input && typeof input === "object" ? input : {};
    const clamp = (value, fallback, min, max) => {
      const number = Number(value);
      return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
    };
    const oldSpeed = Number(source.speed);
    const migratedRate = Number.isFinite(oldSpeed) && oldSpeed > 0 ? TYPEWRITER_STANDARD_TIMING.baseCharacterMs / oldSpeed : TYPEWRITER_STANDARD_TIMING.playbackRate;
    const headingLevels = Array.isArray(source.headingLevels)
      ? [...new Set(source.headingLevels.map(Number).filter(level => level >= 1 && level <= 6))].sort((a, b) => a - b)
      : [1, 2, 3];
    const constructorEnabled = source.constructorEnabled && typeof source.constructorEnabled === "object"
      ? Object.fromEntries(Object.entries(source.constructorEnabled).map(([name, enabled]) => [String(name), enabled !== false]))
      : {};
    // Migrate the two constructor toggles Backpack exposed before the API-driven
    // inspector. Unknown/new constructor names are preserved generically.
    if (!("codeblock" in constructorEnabled)) constructorEnabled.codeblock = source.codeBlocks !== false;
    if (!("styledlinks" in constructorEnabled)) constructorEnabled.styledlinks = source.styledLinks !== false;
    return {
      playbackRate: clamp(source.playbackRate, migratedRate, 0.25, 64),
      playbackScope: source.playbackScope === "section" ? "section" : "document",
      progressiveLayout: source.progressiveLayout !== false,
      pendingFlow: source.pendingFlow === "reserve" ? "reserve" : "collapse",
      flowBridge: source.flowBridge !== false,
      preserveScrollAnchor: source.preserveScrollAnchor !== false,
      restartPolicy: ["restart", "completed", "once", "persist"].includes(source.restartPolicy) ? source.restartPolicy : "restart",
      rotationSpeed: clamp(source.rotationSpeed, TYPEWRITER_STANDARD_TIMING.rotationSpeedMs, 20, 5000),
      rotationHold: clamp(source.rotationHold, TYPEWRITER_STANDARD_TIMING.visibleHoldMs, 0, 20000),
      rendererMode: source.rendererMode === "multi" ? "multi" : "single",
      headingVelocity: ["equality", "indentation", "completePreviousHeader"].includes(source.headingVelocity)
        ? source.headingVelocity
        : "indentation",
      headingLevels: headingLevels.length ? headingLevels : [1, 2, 3],
      constructorEnabled,
      globalControlOverrides: source.globalControlOverrides && typeof source.globalControlOverrides === "object"
        ? Object.fromEntries(Object.entries(source.globalControlOverrides).filter(([path, value]) => String(path).includes(".") && (typeof value === "number" || typeof value === "boolean" || typeof value === "string")))
        : {}
    };
  }

  function typewriterParameters(settings = appState?.notes?.typewriter) {
    const value = normalizeTypewriterSettings(settings);
    const parameters = {
      playback: { rate: value.playbackRate, rateScope: value.playbackScope },
      rotation: {
        speedMs: value.rotationSpeed,
        holdMs: value.rotationHold,
        blankHoldMs: TYPEWRITER_STANDARD_TIMING.blankHoldMs,
        effects: {
          slot: { speedMs: value.rotationSpeed, holdMs: value.rotationHold },
          delete: { holdMs: value.rotationHold, blankHoldMs: TYPEWRITER_STANDARD_TIMING.blankHoldMs },
          strike: { speedMs: value.rotationSpeed, holdMs: value.rotationHold, strikeHoldMs: TYPEWRITER_STANDARD_TIMING.struckHoldMs }
        }
      },
      renderer: {
        mode: value.rendererMode,
        flow: {
          progressiveLayout: value.progressiveLayout,
          pendingSections: value.pendingFlow,
          pendingBlocks: value.pendingFlow,
          bridge: value.flowBridge,
          preserveScrollAnchor: value.preserveScrollAnchor
        },
        multi: {
          headingLevels: value.headingLevels,
          headingVelocity: value.headingVelocity
        },
        constructors: Object.fromEntries(
          Object.entries(value.constructorEnabled || {}).map(([name, enabled]) => [name, { enabled: enabled !== false }])
        )
      }
    };
    const setPath = (root, path, override) => {
      const keys = String(path || "").split(".").filter(Boolean);
      if (!keys.length) return;
      let cursor = root;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) cursor[key] = override;
        else cursor = cursor[key] && typeof cursor[key] === "object" ? cursor[key] : (cursor[key] = {});
      });
    };
    Object.entries(value.globalControlOverrides || {}).forEach(([path, override]) => setPath(parameters, path, override));
    return parameters;
  }

  function createEmptyDocument(index = 1) {
    return {
      id: uid("note"),
      title: `Note ${index}`,
      markdown: "",
      source: "Upload required",
      fileName: "",
      fileType: "empty",
      typewriterLifetime: { loadToken: "", started: false, completed: false, startedAt: "", completedAt: "" }
    };
  }

  function normalizeTypewriterLifetime(input, fallbackToken = "") {
    const source = input && typeof input === "object" ? input : {};
    return {
      loadToken: String(source.loadToken || fallbackToken || ""),
      started: source.started === true,
      completed: source.completed === true,
      startedAt: String(source.startedAt || ""),
      completedAt: String(source.completedAt || "")
    };
  }

  function resetDocumentTypewriterLifetime(document) {
    if (!document) return null;
    document.typewriterLifetime = {
      loadToken: uid("load"),
      started: false,
      completed: false,
      startedAt: "",
      completedAt: ""
    };
    return document.typewriterLifetime;
  }

  function documentTypewriterLifetime(document) {
    if (!document) return normalizeTypewriterLifetime(null);
    const fallback = document.fileName || document.markdown ? `legacy:${document.id}` : "";
    document.typewriterLifetime = normalizeTypewriterLifetime(document.typewriterLifetime, fallback);
    return document.typewriterLifetime;
  }

  function typewriterRestartSuppressed(document = getActiveDocument(), settings = appState?.notes?.typewriter) {
    const policy = normalizeTypewriterSettings(settings).restartPolicy;
    const lifetime = documentTypewriterLifetime(document);
    if (policy === "once") return lifetime.started;
    if (policy === "completed") return lifetime.completed;
    return false;
  }

  function normalizeNotes(input) {
    const source = input && typeof input === "object" ? input : {};
    let documents = Array.isArray(source.documents)
      ? source.documents.slice(0, CONFIG.notesMaxDocuments)
      : [];

    // Pre-2.0 Notes used a single markdown/source pair.
    const legacyMarkdown = String(source.markdown || "");
    if (legacyMarkdown && (!documents.length || (documents.length === 1 && !documents[0]?.markdown && !documents[0]?.fileName))) {
      const legacySource = String(source.source || "Upload required");
      const possibleFile = legacySource.replace(/^Uploaded\s+/i, "").trim();
      documents = [{
        id: documents[0]?.id || uid("note"),
        title: titleFromFileName(possibleFile, 1),
        markdown: legacyMarkdown,
        source: legacySource,
        fileName: /\.(?:md|markdown|txt)$/i.test(possibleFile) ? possibleFile : "",
        fileType: noteFileTypeFromName(possibleFile) || "markdown"
      }];
    }

    documents = documents.map((document, index) => {
      const markdown = String(document?.markdown ?? document?.content ?? "");
      const fileName = String(document?.fileName || "");
      const inferredType = noteFileTypeFromName(fileName);
      const requestedType = String(document?.fileType || document?.type || "").toLowerCase();
      const fileType = requestedType === "text" || requestedType === "txt"
        ? "text"
        : requestedType === "markdown" || requestedType === "md"
          ? "markdown"
          : inferredType || (markdown ? "markdown" : "empty");
      const id = String(document?.id || uid("note"));
      return {
        id,
        title: String(document?.title || titleFromFileName(fileName, index + 1)).slice(0, 48),
        markdown,
        source: String(document?.source || "Upload required"),
        fileName,
        fileType,
        typewriterLifetime: normalizeTypewriterLifetime(document?.typewriterLifetime, fileName || markdown ? `legacy:${id}` : "")
      };
    });

    if (!documents.length) documents.push(createEmptyDocument(1));
    const activeId = documents.some(document => document.id === source.activeId)
      ? source.activeId
      : documents[0].id;
    return {
      activeId,
      typewriter: normalizeTypewriterSettings(source.typewriter),
      documents
    };
  }

  function getActiveDocument() {
    appState.notes = normalizeNotes(appState.notes);
    return appState.notes.documents.find(document => document.id === appState.notes.activeId)
      || appState.notes.documents[0];
  }

  function renderFileButton(inputId, label, { multiple = false } = {}) {
    return `<label class="bp-file-button" title="${escapeHTML(label)}"><span class="bp-button-icon" aria-hidden="true">⬆</span><span class="bp-button-label">${escapeHTML(label)}</span><input id="${inputId}" type="file" accept=".md,.markdown,.txt,text/markdown,text/plain"${multiple ? " multiple" : ""} /></label>`;
  }

  function destroyNotesWorkbench() {
    runtime.notesWorkbenchCleanup?.();
    runtime.notesWorkbenchCleanup = null;
    runtime.notesWorkbenchMeasure = null;
    runtime.notesWorkbenchActive = false;
  }

  function clearPersistedNotesView() {
    const cache = $("#bpPersistentViewCache");
    if (cache) cache.replaceChildren();
    runtime.persistedNotesView = null;
  }

  function typewriterBackgroundPersistEnabled() {
    return normalizeTypewriterSettings(appState?.notes?.typewriter).restartPolicy === "persist";
  }

  function parkActiveNotesView() {
    if (!typewriterBackgroundPersistEnabled() || !runtime.typewriterEngine) return false;
    const workspace = $("#bpWorkspace");
    const cache = $("#bpPersistentViewCache");
    const panel = workspace?.querySelector?.(".bp-notes-panel");
    const active = getActiveDocument();
    if (!workspace || !cache || !panel || !active) return false;
    const rect = workspace.getBoundingClientRect();
    cache.style.setProperty("--bp-persist-width", `${Math.max(1, Math.round(rect.width))}px`);
    cache.style.setProperty("--bp-persist-height", `${Math.max(1, Math.round(rect.height))}px`);
    panel.classList.add("is-background-persisted");
    panel.setAttribute("inert", "");
    cache.replaceChildren(panel);
    const lifetime = documentTypewriterLifetime(active);
    runtime.persistedNotesView = {
      documentId: active.id,
      loadToken: lifetime.loadToken,
      parkedAt: Date.now()
    };
    return true;
  }

  function canRestorePersistedNotesView() {
    const record = runtime.persistedNotesView;
    const panel = $("#bpPersistentViewCache .bp-notes-panel");
    if (!record || !panel || !typewriterBackgroundPersistEnabled()) return false;
    const active = getActiveDocument();
    const lifetime = documentTypewriterLifetime(active);
    return record.documentId === active.id && record.loadToken === lifetime.loadToken;
  }

  function restorePersistedNotesView() {
    if (!canRestorePersistedNotesView()) return false;
    const workspace = $("#bpWorkspace");
    const cache = $("#bpPersistentViewCache");
    const panel = cache?.querySelector?.(".bp-notes-panel");
    if (!workspace || !panel) return false;
    workspace.replaceChildren(panel);
    panel.classList.remove("is-background-persisted");
    panel.removeAttribute("inert");
    runtime.persistedNotesView = null;
    scheduleTypewriterApiRefresh();
    return true;
  }

  function destroyTypewriter() {
    clearPersistedNotesView();
    runtime.typewriterApiCleanup?.();
    runtime.typewriterApiCleanup = null;
    if (runtime.typewriterApiRefreshFrame) cancelAnimationFrame(runtime.typewriterApiRefreshFrame);
    runtime.typewriterApiRefreshFrame = 0;
    runtime.typewriterLastEvent = null;
    resetTypewriterPreviewPresentation();
    try { runtime.typewriterEngine?.unmount?.(); } catch (error) { console.warn(error); }
    runtime.typewriterEngine = null;
  }

  function startActiveTypewriter() {
    destroyTypewriter();
    const active = getActiveDocument();
    if (active.fileType !== "markdown" || !(active.fileName || active.markdown)) return;
    const output = $("#bpTypewriterOutput");
    const engine = window.MarkdownTypewriter;
    if (!output || !engine?.loadNote || !engine?.mount) return;
    runtime.typewriterEngine = engine;
    engine.mount(output);

    // The control rail is now an API consumer rather than a second renderer
    // configuration implementation. Subscribe to the engine's advertised
    // event surface and refresh the small runtime snapshots on meaningful
    // lifecycle changes.
    try {
      const eventNames = engine.getApiSurface?.().events || [];
      const activeId = active.id;
      const onTypewriterEvent = event => {
        if (event.type === "markdown-typewriter:note-complete" && event.detail?.id === `backpack:${activeId}`) {
          const document = appState.notes.documents.find(item => item.id === activeId);
          if (document) {
            const lifetime = documentTypewriterLifetime(document);
            lifetime.started = true;
            lifetime.startedAt ||= new Date().toISOString();
            lifetime.completed = true;
            lifetime.completedAt ||= new Date().toISOString();
            queueSaveState();
          }
        }
        scheduleTypewriterApiRefresh(event);
      };
      eventNames.forEach(name => window.addEventListener(name, onTypewriterEvent));
      runtime.typewriterApiCleanup = () => eventNames.forEach(name => window.removeEventListener(name, onTypewriterEvent));
    } catch (error) {
      console.warn(error);
    }

    const lifetime = documentTypewriterLifetime(active);
    const skipFiniteAnimation = typewriterRestartSuppressed(active, appState.notes.typewriter);
    if (!lifetime.started) {
      lifetime.started = true;
      lifetime.startedAt = new Date().toISOString();
      queueSaveState();
    }

    engine.loadNote({
      id: `backpack:${active.id}`,
      markdown: prepareNotesMarkdownSource(active.markdown),
      origin: "api",
      parameters: typewriterParameters(appState.notes.typewriter)
    }, { output, resume: true, finishNow: skipFiniteAnimation }).then(() => {
      const pause = $("#bpTypewriterSettingsPause");
      if (pause) pause.textContent = "Pause";
      scheduleTypewriterApiRefresh();
    }).catch(error => {
      console.error(error);
      showToast("Typewriter presentation stopped unexpectedly.");
      scheduleTypewriterApiRefresh();
    });
  }

  async function loadNotesDocuments(files) {
    const incoming = Array.from(files || []);
    if (!incoming.length) return;
    appState.notes = normalizeNotes(appState.notes);
    const active = getActiveDocument();
    let firstLoadedId = "";
    let loaded = 0;
    let skippedFull = 0;
    let skippedType = 0;
    let usedActive = false;

    for (const file of incoming) {
      const fileType = noteFileTypeFromName(file.name);
      if (!fileType) {
        skippedType += 1;
        continue;
      }

      let target = null;
      if (!usedActive) {
        target = active;
        usedActive = true;
      } else {
        target = appState.notes.documents.find(document => document.id !== active.id && !document.fileName && !document.markdown);
        if (!target && appState.notes.documents.length < CONFIG.notesMaxDocuments) {
          target = createEmptyDocument(appState.notes.documents.length + 1);
          appState.notes.documents.push(target);
        }
      }

      if (!target) {
        skippedFull += 1;
        continue;
      }

      target.markdown = await file.text();
      target.fileName = file.name;
      target.fileType = fileType;
      target.title = titleFromFileName(file.name, appState.notes.documents.indexOf(target) + 1);
      target.source = `Uploaded ${file.name}`;
      resetDocumentTypewriterLifetime(target);
      firstLoadedId ||= target.id;
      loaded += 1;
    }

    if (firstLoadedId) appState.notes.activeId = firstLoadedId;
    saveState();
    renderApp();
    const messages = [];
    if (skippedFull) messages.push(`${skippedFull} skipped because all nine tabs are occupied`);
    if (skippedType) messages.push(`${skippedType} unsupported file${skippedType === 1 ? "" : "s"}`);
    showToast(`${loaded} note${loaded === 1 ? "" : "s"} loaded${messages.length ? `. ${messages.join("; ")}.` : "."}`);
  }

  function addEmptyDocument() {
    appState.notes = normalizeNotes(appState.notes);
    if (appState.notes.documents.length >= CONFIG.notesMaxDocuments) {
      showToast("Notes already has nine document tabs.");
      return;
    }
    const document = createEmptyDocument(appState.notes.documents.length + 1);
    appState.notes.documents.push(document);
    appState.notes.activeId = document.id;
    saveState();
    renderApp();
  }

  function closeActiveDocument() {
    appState.notes = normalizeNotes(appState.notes);
    const active = getActiveDocument();
    if ((active.markdown || active.fileName) && !confirm(`Close “${active.title}” and remove its cached document?`)) return;
    const index = appState.notes.documents.findIndex(document => document.id === active.id);
    if (appState.notes.documents.length === 1) {
      appState.notes.documents = [createEmptyDocument(1)];
      appState.notes.activeId = appState.notes.documents[0].id;
    } else {
      appState.notes.documents.splice(index, 1);
      appState.notes.activeId = appState.notes.documents[Math.min(index, appState.notes.documents.length - 1)].id;
    }
    saveState();
    renderApp();
  }

  function typewriterSettingsViewContext() {
    const settings = normalizeTypewriterSettings(appState.notes.typewriter);
    const presentation = presentationProfileById(parseThemeString(appState.preferences.themeCode)?.profileId);
    const groupOpen = id => presentation.openGroups.includes(id) ? " open" : "";
    const seconds = value => `${(Number(value) / 1000).toFixed(Number(value) % 1000 ? 1 : 0)} s`;
    const headingChecks = [1, 2, 3, 4, 5, 6]
      .map(level => `<label class="bp-typewriter-level"><input type="checkbox" data-tw-heading-level="${level}" ${settings.headingLevels.includes(level) ? "checked" : ""}><span>H${level}</span></label>`)
      .join("");
    const activeDocument = getActiveDocument();
    const lifetime = documentTypewriterLifetime(activeDocument);
    const currentTheme = appliedTheme();
    const currentPreset = themePresetForCode(currentTheme.code);
    const themeOptions = `${currentPreset ? "" : `<option value="custom" selected>Custom · ${escapeHTML(presentation.name)}</option>`}${THEME_PRESETS.map(preset => `<option value="${escapeHTML(preset.id)}" ${currentPreset?.id === preset.id ? "selected" : ""}>${escapeHTML(preset.icon)} ${escapeHTML(preset.name)}</option>`).join("")}`;
    return { settings, presentation, groupOpen, seconds, headingChecks, themeOptions, activeDocument, lifetime };
  }

  function typewriterPerceptualStops(scaleId) {
    return TYPEWRITER_PERCEPTUAL_SCALES[String(scaleId || "")] || null;
  }

  function nearestTypewriterPerceptualIndex(scaleId, value) {
    const stops = typewriterPerceptualStops(scaleId);
    if (!stops?.length) return 0;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    let best = 0;
    let distance = Infinity;
    stops.forEach((stop, index) => {
      const delta = Math.abs(Number(stop) - numeric);
      if (delta < distance) { distance = delta; best = index; }
    });
    return best;
  }

  function typewriterPerceptualLabel(scaleId, value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return "Custom";
    if (scaleId === "hold-ms") {
      if (numeric <= 0) return "None";
      if (numeric <= 75) return "Flick";
      if (numeric <= 150) return "Brief";
      if (numeric <= 300) return "Beat";
      if (numeric <= 650) return "Pause";
      if (numeric <= 1100) return "Long";
      if (numeric <= 2200) return "Deliberate";
      return "Extended";
    }
    if (numeric <= 0.35) return "Very slow";
    if (numeric <= 0.67) return "Slow";
    if (numeric < 0.9) return "Relaxed";
    if (numeric <= 1.1) return "Standard";
    if (numeric <= 1.5) return "Brisk";
    if (numeric <= 2) return "Fast";
    return "Very fast";
  }

  function typewriterRateWpm(rate) {
    // A guide, not a reading-comprehension claim: ~6 characters per word.
    return Math.round((60_000 / (TYPEWRITER_STANDARD_TIMING.baseCharacterMs * 6)) * Math.max(0, Number(rate) || 0));
  }

  function formatTypewriterControlValue(scaleId, value, unit = "") {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return "—";
    const label = typewriterPerceptualLabel(scaleId, numeric);
    if (scaleId === "typing-rate") return `${label} · ${numeric.toFixed(numeric < 1 ? 2 : numeric % 1 ? 2 : 1)}× · ≈${typewriterRateWpm(numeric)} WPM`;
    if (scaleId === "motion-rate") return `${label} · ${numeric.toFixed(numeric < 1 ? 2 : numeric % 1 ? 2 : 1)}× pace`;
    if (scaleId === "hold-ms") return `${label} · ${Math.round(numeric)} ms`;
    return `${numeric}${unit ? ` ${unit}` : ""}`;
  }

  function typewriterPlaybackRateControl(settings) {
    const value = Number(settings.playbackRate) || TYPEWRITER_STANDARD_TIMING.playbackRate;
    const stops = TYPEWRITER_PERCEPTUAL_SCALES["typing-rate"];
    const index = nearestTypewriterPerceptualIndex("typing-rate", value);
    const modified = Math.abs(value - TYPEWRITER_STANDARD_TIMING.playbackRate) > 0.0001;
    const tooltip = `Document typing rate. 1.0× is the Backpack standard: ${TYPEWRITER_STANDARD_TIMING.baseCharacterMs} ms/character, about ${typewriterRateWpm(1)} WPM equivalent before punctuation holds. Slider: perceptual steps from 0.25× to 64× with extra resolution around 1×. Exact values can be typed. Current: ${value}× (≈${typewriterRateWpm(value)} WPM).`;
    return `<div class="bp-tw-field bp-tw-timing-field bp-tw-semantic-global${modified ? " is-modified" : ""}" data-tw-control-target-group="document:typing" title="${escapeHTML(tooltip)}">
      <span class="bp-tw-field-copy"><strong>Document typing</strong><small>Human-readable pace; exact API rate remains editable.</small></span>
      <span class="bp-tw-timing-editor">
        <span class="bp-tw-range-track is-perceptual">
          <span class="bp-tw-range-input-shell" style="--tw-default-pos:${(nearestTypewriterPerceptualIndex("typing-rate", 1) / (stops.length - 1)) * 100}%">
            <input id="bpTypewriterPlaybackRateSlider" type="range" min="0" max="${stops.length - 1}" step="1" value="${index}" aria-label="Document typing perceptual speed" title="Drag through perceptual speed steps. Left is slower; right is faster.">
            <i class="bp-tw-range-default-marker" aria-hidden="true"></i>
          </span>
          <small class="bp-tw-range-scale"><span>Slower</span><span>1× standard</span><span>Faster</span></small>
        </span>
        <span class="bp-tw-exact-editor"><input id="bpTypewriterPlaybackRate" type="number" min="0.25" max="64" step="any" value="${escapeHTML(value)}" inputmode="decimal" aria-label="Document typing exact rate" title="Exact playback rate. 1.0× = standard reading pace."><b>×</b></span>
        <span class="bp-tw-control-caption"><em id="bpTypewriterPlaybackRateCaption">${escapeHTML(formatTypewriterControlValue("typing-rate", value, "×"))}</em><button id="bpTypewriterPlaybackRateReset" class="bp-tw-reset-control" type="button" title="Reset to Standard · 1.0×" ${modified ? "" : "hidden"}>↺</button></span>
      </span>
    </div>`;
  }

  function renderTypewriterControlSettings() {
    const { settings, groupOpen, headingChecks, themeOptions, lifetime } = typewriterSettingsViewContext();
    return `
      <div class="bp-typewriter-settings bp-typewriter-control-settings" ${runtime.notesTypewriterSettingsOpen ? "" : "hidden"}>
        <section class="bp-setting-group bp-tw-group-transport">
          <header><strong>Typewriter</strong><small>document transport</small></header>
          <div class="bp-setting-actions">
            <button type="button" id="bpTypewriterSettingsPause">Pause</button>
            <button type="button" id="bpTypewriterSettingsFinish">Finish Now</button>
            <button type="button" id="bpTypewriterSettingsRestart">Restart note</button>
          </div>
        </section>

        <details class="bp-setting-group bp-tw-collapsible bp-tw-group-presentation"${groupOpen("renderer")}>
          <summary><strong>▦ Presentation</strong><small>scheduler + layout</small></summary>
          <div class="bp-setting-group-body">
            <label class="bp-tw-field">
              <span class="bp-tw-field-copy"><strong>Theme</strong><small>Reader presentation follows the same Backpack theme used by the workspace.</small></span>
              <select id="bpTypewriterThemePreset">${themeOptions}</select>
            </label>
            <label class="bp-tw-field" data-tw-control-target-group="presentation:renderer">
              <span class="bp-tw-field-copy"><strong>Mode</strong><small>Single stream or concurrent heading sections.</small></span>
              <select id="bpTypewriterRendererMode"><option value="single" ${settings.rendererMode === "single" ? "selected" : ""}>Single</option><option value="multi" ${settings.rendererMode === "multi" ? "selected" : ""}>Multi heading</option></select>
            </label>
            <label class="bp-tw-field" data-tw-control-target-group="presentation:renderer">
              <span class="bp-tw-field-copy"><strong>Scheduling</strong><small>How eligible heading sections enter the shared page budget.</small></span>
              <select id="bpTypewriterHeadingVelocity"><option value="equality" ${settings.headingVelocity === "equality" ? "selected" : ""}>Equality</option><option value="indentation" ${settings.headingVelocity === "indentation" ? "selected" : ""}>Indentation</option><option value="completePreviousHeader" ${settings.headingVelocity === "completePreviousHeader" ? "selected" : ""}>Previous header</option></select>
            </label>
            <label class="bp-tw-field" data-tw-control-target-group="presentation:flow">
              <span class="bp-tw-field-copy"><strong>Pending geometry</strong><small>Collapse is compact runtime flow. Reserve displays parsed structure before it is reached.</small></span>
              <select id="bpTypewriterPendingFlow"><option value="collapse" ${settings.pendingFlow === "collapse" ? "selected" : ""}>Collapse pending</option><option value="reserve" ${settings.pendingFlow === "reserve" ? "selected" : ""}>Reserve structure</option></select>
            </label>
            <div class="bp-tw-level-field" data-tw-control-target-group="presentation:renderer">
              <div class="bp-tw-field-copy"><strong>Parallel headings</strong><small>Heading levels allowed to spawn concurrent sections.</small></div>
              <div class="bp-typewriter-levels" aria-label="Multi-render heading levels">${headingChecks}</div>
            </div>
            <div class="bp-tw-inline-status" id="bpTypewriterInlineStatus">TYPO and Rotation phases will appear here while the document runs.</div>
          </div>
        </details>

        <details class="bp-setting-group bp-tw-collapsible bp-tw-group-persistence" open>
          <summary><strong>Persistence</strong><small>view lifecycle</small></summary>
          <div class="bp-setting-group-body">
            <label class="bp-tw-field">
              <span class="bp-tw-field-copy"><strong>View lifecycle</strong><small>Controls what switching away from Notes means for this loaded document. Persist keeps the live runtime mounted; the other modes remount according to their replay policy.</small></span>
              <select id="bpTypewriterRestartPolicy">
                <option value="restart" ${settings.restartPolicy === "restart" ? "selected" : ""}>Restart on return</option>
                <option value="persist" ${settings.restartPolicy === "persist" ? "selected" : ""}>Persist in background</option>
                <option value="completed" ${settings.restartPolicy === "completed" ? "selected" : ""}>Do not restart</option>
                <option value="once" ${settings.restartPolicy === "once" ? "selected" : ""}>Once per Load</option>
              </select>
            </label>
            <div class="bp-tw-persistence-status">
              <strong>This load</strong>
              <span>${lifetime.completed ? "Complete" : lifetime.started ? "Started" : "Not started"}</span>
              <small>${settings.restartPolicy === "persist" ? "Drawing Board parks this live Notes view off-screen. Finite writing and loops keep running; returning restores the same runtime." : settings.restartPolicy === "once" ? "Reloading the source file is the only way to replay finite writing/animation." : settings.restartPolicy === "completed" ? "A completed note reopens fully rendered; an interrupted run may start again." : "Returning to Notes starts a fresh finite render."}</small>
            </div>
          </div>
        </details>

        <details class="bp-setting-group bp-tw-collapsible bp-tw-semantic-group bp-tw-group-pace" open>
          <summary><strong>⌁ Pace</strong><small id="bpTypewriterPaceBadge">cadence + rates</small></summary>
          <div class="bp-setting-group-body">
            ${typewriterPlaybackRateControl(settings)}
            <label class="bp-tw-field bp-tw-semantic-global" data-tw-control-target-group="document:typing">
              <span class="bp-tw-field-copy"><strong>Pace scope</strong><small>Document shares one budget; Each section gives every concurrent section the full selected rate.</small></span>
              <select id="bpTypewriterPlaybackScope"><option value="document" ${settings.playbackScope === "document" ? "selected" : ""}>Document budget</option><option value="section" ${settings.playbackScope === "section" ? "selected" : ""}>Each section</option></select>
            </label>
            <div id="bpTypewriterPaceInspector" class="bp-tw-semantic-list bp-tw-api-inspector">
              <span class="bp-tw-api-empty">Typed-object pace controls appear after compilation.</span>
            </div>
          </div>
        </details>

        <details class="bp-setting-group bp-tw-collapsible bp-tw-semantic-group bp-tw-group-toggles">
          <summary><strong>◉ Toggles</strong><small id="bpTypewriterToggleBadge">availability</small></summary>
          <div class="bp-setting-group-body bp-tw-toggle-sections">
            <section class="bp-tw-toggle-section">
              <header><strong>Flow</strong><small>layout behavior</small></header>
              <div class="bp-tw-toggle-grid bp-tw-toggle-grid-flow">
                <label class="bp-tw-toggle-card bp-tw-semantic-global" data-tw-control-target-group="presentation:flow" title="Collapse unreached sections and block containers until the scheduler reaches them. Reduces blank space while typing. Default: On. Changing this restarts the note.">
                  <input id="bpTypewriterProgressiveLayout" type="checkbox" ${settings.progressiveLayout ? "checked" : ""}>
                  <span><strong>Progressive geometry</strong><small class="bp-tw-toggle-behavior is-restart">Restart</small></span>
                </label>
                <label class="bp-tw-toggle-card bp-tw-semantic-global" data-tw-control-target-group="presentation:flow" title="Shows a continuation bridge where an active section still owns hidden future blocks. Default: On. Changing this restarts the note.">
                  <input id="bpTypewriterFlowBridge" type="checkbox" ${settings.flowBridge ? "checked" : ""}>
                  <span><strong>Continuation bridge</strong><small class="bp-tw-toggle-behavior is-restart">Restart</small></span>
                </label>
                <label class="bp-tw-toggle-card bp-tw-semantic-global" data-tw-control-target-group="presentation:flow" title="Stabilizes the reader position while progressive geometry expands or collapses. Default: On. This change applies immediately.">
                  <input id="bpTypewriterPreserveScrollAnchor" type="checkbox" ${settings.preserveScrollAnchor ? "checked" : ""}>
                  <span><strong>Protect scroll anchor</strong><small class="bp-tw-toggle-behavior is-immediate">Immediate</small></span>
                </label>
              </div>
            </section>
            <section class="bp-tw-toggle-section">
              <header><strong>Constructors</strong><small>live availability</small></header>
              <div id="bpTypewriterToggleInspector" class="bp-tw-toggle-grid bp-tw-toggle-grid-api">
                <span class="bp-tw-api-empty">Constructor toggles appear after the API inventory is ready.</span>
              </div>
            </section>
          </div>
        </details>

        <details class="bp-setting-group bp-tw-collapsible bp-tw-group-syntax">
          <summary><strong>Authoring</strong><small>source syntax</small></summary>
          <div class="bp-setting-group-body">
            <label class="bp-tw-toggle bp-tw-authoring-toggle">
              <input id="bpTypewriterShowInherited" type="checkbox" ${runtime.typewriterShowInheritedControls ? "checked" : ""}>
              <span><strong>Inherited defaults</strong><small>Show low-salience constructor defaults in semantic control lists.</small></span>
            </label>
            <details class="bp-typewriter-command-help">
              <summary>Inline commands</summary>
              <div>
                <code>&lt;!--tempo:3/2--&gt;</code>
                <code>&lt;!--HeadingLine--&gt;</code>
                <code>&lt;!--typo:w|e--&gt;</code>
                <code>&lt;!--Slot:one|two|three--&gt;</code>
                <code>&lt;!--SlotRotation:one|two|three--&gt;</code>
                <code>&lt;!--DeleteRotation:draft|reviewed--&gt;</code>
                <code>&lt;!--StrikeRotation:draft|approved--&gt;</code>
                <code>&#96;&#96;&#96;verse</code>
                <code>&#96;&#96;&#96;js</code>
                <code>&#96;&#96;&#96;python</code>
              </div>
            </details>
          </div>
        </details>
      </div>
    `;
  }

  function renderTypewriterDataSettings() {
    const { groupOpen, seconds, settings } = typewriterSettingsViewContext();
    return `
      <div class="bp-typewriter-settings bp-typewriter-data-settings" ${runtime.notesTypewriterSettingsOpen ? "" : "hidden"}>
        <details class="bp-setting-group bp-tw-collapsible bp-tw-group-runtime">
          <summary><strong>Live runtime</strong><small id="bpTypewriterApiSurfaceBadge">API connecting…</small></summary>
          <div class="bp-setting-group-body">
            <div id="bpTypewriterRuntimeInspector" class="bp-tw-api-inspector" aria-live="polite">
              <span class="bp-tw-api-empty">Waiting for the Typewriter runtime.</span>
            </div>
          </div>
        </details>

        <details class="bp-setting-group bp-tw-collapsible bp-tw-semantic-group bp-tw-group-holds">
          <summary><strong>⏱ Holds</strong><small id="bpTypewriterHoldBadge">literal time</small></summary>
          <div class="bp-setting-group-body">
            <div id="bpTypewriterHoldInspector" class="bp-tw-semantic-list bp-tw-api-inspector">
              <span class="bp-tw-api-empty">Loop and constructor holds appear after compilation.</span>
            </div>
          </div>
        </details>

        <details class="bp-setting-group bp-tw-collapsible bp-tw-semantic-group bp-tw-group-repeat">
          <summary><strong>↻ Repetition</strong><small id="bpTypewriterRepeatBadge">runtime loops</small></summary>
          <div id="bpTypewriterRepeatInspector" class="bp-setting-group-body bp-tw-semantic-list bp-tw-api-inspector">
            <span class="bp-tw-api-empty">Repeatable typed objects appear after compilation.</span>
          </div>
        </details>

        <details class="bp-setting-group bp-tw-collapsible bp-tw-group-objects"${groupOpen("constructors")}>
          <summary><strong>Objects</strong><small>runtime data</small></summary>
          <div class="bp-setting-group-body">
            <details class="bp-tw-object-family">
              <summary><strong>Document constructors</strong><small id="bpTypewriterConstructorBadge">API inventory</small></summary>
              <div id="bpTypewriterConstructorInspector" class="bp-tw-api-inspector">
                <span class="bp-tw-api-empty">Constructor inventory appears after the note is compiled.</span>
              </div>
            </details>
            <details class="bp-tw-object-family">
              <summary><strong>Code & loops</strong><small id="bpTypewriterCodeBadge">runtime tree</small></summary>
              <div id="bpTypewriterCodeInspector" class="bp-tw-api-inspector">
                <span class="bp-tw-api-empty">No code runtime snapshot yet.</span>
              </div>
            </details>
          </div>
        </details>
      </div>
    `;
  }

  function renderNotes() {
    appState.notes = normalizeNotes(appState.notes);
    const active = getActiveDocument();
    const hasDocument = Boolean(active.fileName || active.markdown);
    const isMarkdown = active.fileType === "markdown" && hasDocument;
    const isText = active.fileType === "text" && hasDocument;
    const canAdd = appState.notes.documents.length < CONFIG.notesMaxDocuments;
    const badge = document => document.fileType === "markdown" && (document.fileName || document.markdown)
      ? "MD"
      : document.fileType === "text" && (document.fileName || document.markdown)
        ? "TXT"
        : "empty";
    return `
      <section class="bp-panel bp-notes-panel">
        <div class="bp-notes-tabbar">
          <div class="bp-notes-subtabs" role="tablist" aria-label="Loaded notes">
            ${appState.notes.documents.map((document, index) => `
              <button type="button" class="bp-notes-subtab" data-notes-tab="${escapeHTML(document.id)}" role="tab" aria-selected="${document.id === active.id}" title="${escapeHTML([document.fileName || document.title, document.source].filter(Boolean).join(" · "))}" aria-label="${escapeHTML([document.title || `Note ${index + 1}`, badge(document), document.source].filter(Boolean).join(" · "))}">
                <span>${escapeHTML(document.title || `Note ${index + 1}`)}</span>
                <small>${badge(document)}</small>
              </button>
            `).join("")}
          </div>
          <div class="bp-notes-tab-actions" aria-label="Notes tab actions">
            <span class="bp-notes-count-strip" title="${appState.notes.documents.length} of ${CONFIG.notesMaxDocuments} note tabs">${appState.notes.documents.length}/${CONFIG.notesMaxDocuments}</span>
            <button type="button" id="bpAddNotesTab" class="bp-notes-add-tab" title="${canAdd ? "Add an empty Notes subtab" : "Nine-note limit reached"}" aria-label="${canAdd ? "Add Notes subtab" : "Nine-note limit reached"}" ${canAdd ? "" : "disabled"}>＋</button>
          </div>
        </div>

        <div class="bp-notes-toolbar">
          <div class="bp-notes-toolbar-cluster bp-notes-file-actions">
            ${renderFileButton("bpNotesFiles", "Load File", { multiple: true })}
            <button type="button" id="bpCloseNote" title="Close the current document tab" aria-label="Close the current document tab"><span class="bp-button-icon" aria-hidden="true">×</span><span class="bp-button-label">Close</span></button>
          </div>
          ${isMarkdown ? `
            <div class="bp-notes-toolbar-cluster bp-notes-typewriter-actions">
              <span class="bp-pill bp-typewriter-mode"><span class="bp-mode-label-long">MD · typewriter</span><span class="bp-mode-label-short">MD · TW</span></span>
              <button type="button" id="bpTypewriterSettingsToggle" aria-expanded="${runtime.notesTypewriterSettingsOpen}" title="Open Typewriter controls"><span class="bp-button-icon" aria-hidden="true">☷</span><span class="bp-button-label">Controls</span><span class="bp-button-cue" aria-hidden="true">${runtime.notesTypewriterSettingsOpen ? "▴" : "▾"}</span></button>
            </div>
          ` : isText ? '<div class="bp-notes-toolbar-cluster bp-notes-typewriter-actions"><span class="bp-pill bp-text-mode"><span class="bp-mode-label-long">TXT · static</span><span class="bp-mode-label-short">TXT</span></span></div>' : ""}
        </div>
        <div class="bp-notes-document-layout ${isMarkdown ? "is-typewriter" : "is-static"} ${isMarkdown && runtime.notesTypewriterSettingsOpen ? "has-utility" : ""}">
          ${isMarkdown ? `<aside class="bp-notes-utility-rail bp-notes-control-rail" aria-label="Typewriter control settings" ${runtime.notesTypewriterSettingsOpen ? "" : "hidden"}>
            <div class="bp-notes-utility-heading">
              <div><strong>Controls</strong><span id="bpTypewriterControlScopeLabel">Pace · toggles · presentation</span></div>
              <button type="button" id="bpTypewriterControlRailClose" title="Close Typewriter controls" aria-label="Close Typewriter controls">×</button>
            </div>
            ${renderTypewriterControlSettings()}
          </aside>` : ""}
          <div class="bp-notes-reader-pane">
            <div class="bp-window bp-notes-window">
              ${isMarkdown ? `
                <article id="bpTypewriterOutput" class="bp-window-body bp-markdown bp-typewriter-output markdown-output" role="tabpanel" aria-live="polite"></article>
              ` : isText ? `
                <article class="bp-window-body bp-plain-text" role="tabpanel"><pre>${escapeHTML(active.markdown)}</pre></article>
              ` : `
                <article class="bp-window-body bp-markdown" role="tabpanel">
                  <h1>${escapeHTML(active.title)}</h1>
                  <p>This document tab is empty. Load up to nine <code>.md</code>, <code>.markdown</code>, or <code>.txt</code> files at once.</p>
                  <p>Markdown files run Typewriter commands and animations. Text files display the same source literally.</p>
                </article>
              `}
            </div>
          </div>
          ${isMarkdown ? `<aside class="bp-notes-utility-rail bp-notes-data-rail" aria-label="Typewriter runtime data" ${runtime.notesTypewriterSettingsOpen ? "" : "hidden"}>
            <div class="bp-notes-utility-heading">
              <div><strong>Runtime</strong><span id="bpTypewriterDataScopeLabel">Runtime · holds · repetition · objects</span></div>
              <button type="button" id="bpTypewriterDataRailClose" title="Close Typewriter controls" aria-label="Close Typewriter controls">×</button>
            </div>
            ${renderTypewriterDataSettings()}
          </aside>` : ""}
        </div>
      </section>
    `;
  }

  function configureActiveTypewriter({ restart = false } = {}) {
    const engine = runtime.typewriterEngine;
    if (!engine?.configure) return;
    try {
      const active = getActiveDocument();
      const suppressRestart = restart && typewriterRestartSuppressed(active, appState.notes.typewriter);
      const result = engine.configure(typewriterParameters(appState.notes.typewriter), { restart: restart && !suppressRestart });
      if (result?.catch) result.catch(error => console.warn(error));
      if (suppressRestart) {
        const finished = engine.finishNow?.();
        if (finished?.catch) finished.catch(error => console.warn(error));
      }
    } catch (error) {
      console.warn(error);
    }
  }

  function compactTypewriterText(value, max = 46) {
    const text = String(value ?? "").replace(/\s+/g, " ").trim();
    if (text.length <= max) return text;
    return `${text.slice(0, Math.max(1, max - 1)).trimEnd()}…`;
  }

  function formatTypewriterDuration(ms, { precise = false } = {}) {
    const value = Math.max(0, Number(ms) || 0);
    if (value < 1000) return `${Math.round(value)} ms`;
    if (value < 60_000) {
      const digits = precise || value < 10_000 ? 1 : 0;
      return `${(value / 1000).toFixed(digits)} s`;
    }
    const minutes = Math.floor(value / 60_000);
    const seconds = Math.round((value % 60_000) / 1000);
    return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  }

  function describeTypewriterEvent(entry) {
    if (!entry) return "No runtime event yet.";
    const name = String(entry.name || "").replace(/^markdown-typewriter:/, "");
    const detail = entry.detail || {};
    if (name === "typo-phase") return `TYPO · ${detail.phase || "phase"} · ${detail.wrong || ""}→${detail.right || ""}`;
    if (name === "rotation-cycle") return `Rotation · ${detail.effect || "slot"} · ${detail.word || ""} · cycle ${detail.cycle ?? 0}`;
    if (name === "constructor-effect-cycle") return `${detail.constructor || "constructor"}.${detail.effect || "effect"} · ${detail.id || "item"} · cycle ${detail.cycle ?? 0}`;
    if (name === "codeblock-loop-cycle") return `CODE ${detail.name || detail.id || "loop"} · cycle ${detail.cycle ?? 0}`;
    if (name === "codeblock-cycle") return `CODE ${detail.id || "block"} · ${detail.phase || "cycle"} ${detail.cycle ?? 0}`;
    return name || "runtime event";
  }

  function scheduleTypewriterApiRefresh(event = null) {
    if (event) {
      const snapshot = { type: event.type, detail: event.detail || {} };
      runtime.typewriterLastEvent = { name: snapshot.type, detail: snapshot.detail };
      runtime.typewriterPendingPreviewEvents.push(snapshot);
      if (runtime.typewriterPendingPreviewEvents.length > 24) runtime.typewriterPendingPreviewEvents.shift();
    }
    if (runtime.typewriterApiRefreshFrame) return;
    runtime.typewriterApiRefreshFrame = requestAnimationFrame(() => {
      runtime.typewriterApiRefreshFrame = 0;
      refreshTypewriterApiControls();
    });
  }

  function typewriterControlTargetAttributes(control) {
    const target = control?.target || {};
    const attrs = {
      "data-tw-control-scope": target.scope || control.scope || "",
      "data-tw-control-path": target.path || "",
      "data-constructor": target.constructor || "",
      "data-item-id": target.id || "",
      "data-block-id": target.blockId || "",
      "data-loop-id": target.loopId || "",
      "data-effect": target.effect || "",
      "data-tw-value-transform": control?.valueTransform || "",
      "data-tw-value-reference": Number.isFinite(Number(control?.valueReference)) ? Number(control.valueReference) : "",
    };
    return Object.entries(attrs)
      .filter(([, value]) => value !== "")
      .map(([key, value]) => `${key}="${escapeHTML(value)}"`)
      .join(" ");
  }

  function typewriterControlTimingLabel(control, semantics) {
    const source = semantics?.timingSources?.[control?.timingSource];
    const base = source?.label || (control?.timingSource ? String(control.timingSource).replace(/-/g, " ") : "");
    const resolved = control?.resolved && Number.isFinite(Number(control.resolved.value))
      ? ` · ≈ ${Math.round(Number(control.resolved.value))} ${control.resolved.unit || ""}`
      : "";
    return `${base}${resolved}`.trim();
  }

  function typewriterTargetOpenKey(family, targetGroup) {
    return `${String(family || "control")}:${String(targetGroup || "target")}`;
  }

  function typewriterPreviewPresentation(preview, targetGroup = "") {
    const kind = String(preview?.kind || "generic");
    const floor = Number(TYPEWRITER_PREVIEW_POLICY.floorMs[kind] || TYPEWRITER_PREVIEW_POLICY.floorMs.default);
    const authoredDuration = Math.max(0, Number(preview?.durationMs) || 0);
    const previewDuration = Math.max(floor, authoredDuration || floor);
    const groups = Object.keys(runtime.typewriterPreviewSpecs || {});
    const index = Math.max(0, groups.indexOf(String(targetGroup || "")));
    return {
      kind,
      durationMs: previewDuration,
      runtimeDurationMs: authoredDuration,
      slowed: authoredDuration > 0 && previewDuration > authoredDuration + 0.5,
      orientation: String(preview?.previewOrientation || preview?.orientation || (kind === "rotation" ? "horizontal" : "static")),
      staggerMs: (index % TYPEWRITER_PREVIEW_POLICY.maxConcurrent) * TYPEWRITER_PREVIEW_POLICY.staggerMs,
    };
  }

  function typewriterPreviewGlyph(preview) {
    const kind = String(preview?.kind || "generic");
    if (kind === "rotation") {
      if (preview?.effect === "delete") return "⌫";
      if (preview?.effect === "strike") return "S";
      return "↔";
    }
    if (kind === "link-reveal") return "↗";
    if (kind === "strikeout") return "ab";
    if (kind === "strong-pulse") return "A";
    if (kind === "code-loop") return "↻";
    if (kind === "emphasis") return "Aa";
    const text = String(preview?.text || "•").trim();
    return Array.from(text).slice(0, 2).join("") || "•";
  }

  function typewriterPreviewTooltip(preview, presentation) {
    if (!presentation?.slowed) return "";
    return `Preview slowed for legibility · ${formatTypewriterDuration(presentation.durationMs)} preview · Runtime remains ${formatTypewriterDuration(presentation.runtimeDurationMs)}`;
  }

  function typewriterTargetPreviewMarkup(preview, targetGroup) {
    if (!preview) return `<span class="bp-tw-target-preview is-empty" aria-hidden="true"><span class="bp-tw-target-preview-glyph">·</span></span>`;
    const kind = String(preview.kind || "generic");
    const presentation = typewriterPreviewPresentation(preview, targetGroup);
    const text = typewriterPreviewGlyph(preview);
    const tooltip = typewriterPreviewTooltip(preview, presentation);
    return `<span class="bp-tw-target-preview is-${escapeHTML(kind)}" data-tw-preview-group="${escapeHTML(targetGroup)}" data-tw-preview-kind="${escapeHTML(kind)}" data-tw-preview-effect="${escapeHTML(preview.effect || "")}" data-tw-preview-orientation="${escapeHTML(presentation.orientation)}"${tooltip ? ` title="${escapeHTML(tooltip)}"` : ""} aria-hidden="true">
      <span class="bp-tw-target-preview-glyph">${escapeHTML(text)}</span>
      <span class="bp-tw-target-preview-line"></span>
    </span>`;
  }

  function animateTypewriterPreviewElement(node, preview, presentation = typewriterPreviewPresentation(preview, node?.dataset?.twPreviewGroup || "")) {
    if (!node || !preview) return;
    const glyph = $(".bp-tw-target-preview-glyph", node) || node;
    const line = $(".bp-tw-target-preview-line", node);
    const kind = String(preview.kind || "");
    const duration = Math.max(1, Number(presentation?.durationMs) || TYPEWRITER_PREVIEW_POLICY.floorMs.default);
    node.classList.toggle("is-running", preview.running === true);
    node.dataset.previewCycle = String(Number(preview.cycle) || 0);
    node.dataset.twPreviewOrientation = presentation?.orientation || "static";
    if (kind === "emphasis") {
      glyph.style.fontStyle = "italic";
      if (preview.behavior === "cursive") glyph.style.fontFamily = "cursive";
      return;
    }
    glyph.getAnimations?.().forEach(animation => animation.cancel());
    line?.getAnimations?.().forEach(animation => animation.cancel());
    if (kind === "code-loop") {
      glyph.animate?.([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], {
        duration,
        easing: "linear",
        iterations: 1,
      });
      return;
    }
    if (kind === "rotation") {
      if (preview.effect === "delete") {
        glyph.animate?.([
          { opacity: 1, transform: "translateX(0) scaleX(1)" },
          { opacity: 0.16, transform: "translateX(-4px) scaleX(0.28)", offset: 0.48 },
          { opacity: 0, transform: "translateX(-7px) scaleX(0.12)", offset: 0.54 },
          { opacity: 1, transform: "translateX(0) scaleX(1)" },
        ], { duration, easing: "cubic-bezier(.42,0,.18,1)" });
      } else if (preview.effect === "strike") {
        if (line) {
          line.style.opacity = ".62";
          line.animate?.([
            { transform: "translateY(-50%) scaleX(.35)", opacity: .45 },
            { transform: "translateY(-50%) scaleX(1)", opacity: 1, offset: .72 },
            { transform: "translateY(-50%) scaleX(.62)", opacity: .62 },
          ], { duration, easing: "ease-in-out", fill: "forwards" });
        }
      } else {
        // Slot rotation is presented as a restrained horizontal replacement.
        // The runtime still owns the actual word and transition timing.
        glyph.animate?.([
          { opacity: 1, transform: "translateX(0)" },
          { opacity: .18, transform: "translateX(-7px)", offset: .44 },
          { opacity: 0, transform: "translateX(-9px)", offset: .49 },
          { opacity: 0, transform: "translateX(9px)", offset: .51 },
          { opacity: .18, transform: "translateX(7px)", offset: .56 },
          { opacity: 1, transform: "translateX(0)" },
        ], { duration, easing: "cubic-bezier(.42,0,.18,1)" });
      }
      return;
    }
    const frames = Array.isArray(preview.keyframes) ? preview.keyframes : [];
    if (!frames.length) return;
    const target = kind === "strikeout" && line ? line : glyph;
    if (typeof target.animate !== "function") return;
    if (kind === "strikeout" && line) {
      line.style.opacity = ".62";
      line.style.transform = "translateY(-50%) scaleX(.62)";
    }
    const animation = target.animate(frames, {
      duration,
      iterations: 1,
      easing: String(preview.easing || "ease-out"),
      fill: kind === "strikeout" ? "forwards" : "none",
    });
    if (kind === "strikeout" && line) {
      animation.finished?.then(() => {
        if (!line.isConnected) return;
        line.style.opacity = ".62";
        line.style.transform = "translateY(-50%) scaleX(.62)";
      }).catch(() => {});
    }
  }

  function stopTypewriterTargetPreview(targetGroup) {
    if (!targetGroup) return;
    const selector = `[data-tw-preview-group="${CSS.escape(String(targetGroup))}"]`;
    $$(selector).forEach(node => {
      node.querySelectorAll("*").forEach(child => child.getAnimations?.().forEach(animation => animation.cancel()));
      node.getAnimations?.().forEach(animation => animation.cancel());
    });
    const state = runtime.typewriterPreviewPresentationState[targetGroup];
    if (state?.pendingTimer) window.clearTimeout(state.pendingTimer);
    if (state?.releaseTimer) window.clearTimeout(state.releaseTimer);
    if (state) {
      state.pendingTimer = 0;
      state.releaseTimer = 0;
      state.active = false;
    }
    runtime.typewriterPreviewActive.delete(targetGroup);
  }

  function resetTypewriterPreviewPresentation() {
    Object.keys(runtime.typewriterPreviewPresentationState || {}).forEach(stopTypewriterTargetPreview);
    runtime.typewriterPreviewPresentationState = Object.create(null);
    runtime.typewriterPreviewActive = new Map();
    runtime.typewriterPendingPreviewEvents = [];
  }

  function animateTypewriterTargetPreview(targetGroup, preview = null, { force = false } = {}) {
    if (!targetGroup) return;
    const group = String(targetGroup);
    const livePreview = preview || runtime.typewriterPreviewSpecs?.[group] || null;
    if (!livePreview) return;
    const presentation = typewriterPreviewPresentation(livePreview, group);
    const state = runtime.typewriterPreviewPresentationState[group] ||= {
      pendingTimer: 0,
      releaseTimer: 0,
      nextAllowedAt: 0,
      active: false,
    };
    const now = Date.now();
    if (!force && (state.pendingTimer || state.active || now < state.nextAllowedAt)) return;
    if (force) stopTypewriterTargetPreview(group);

    const start = () => {
      state.pendingTimer = 0;
      const startNow = Date.now();
      if (!force && startNow < state.nextAllowedAt) return;
      if (runtime.typewriterPreviewActive.size >= TYPEWRITER_PREVIEW_POLICY.maxConcurrent) {
        if (force) {
          const oldest = runtime.typewriterPreviewActive.keys().next().value;
          if (oldest) stopTypewriterTargetPreview(oldest);
        } else {
          state.pendingTimer = window.setTimeout(start, TYPEWRITER_PREVIEW_POLICY.staggerMs);
          return;
        }
      }
      const selector = `[data-tw-preview-group="${CSS.escape(group)}"]`;
      const nodes = $$(selector);
      if (!nodes.length) return;
      // One moving specimen per semantic target is enough to demonstrate the
      // behavior. Duplicate Pace/Hold/Repeat projections remain informative
      // at rest, and natural cycles rotate which copy gets the live motion.
      const specimenIndex = Math.abs(Number(livePreview.cycle) || 0) % nodes.length;
      const animatedNode = nodes[specimenIndex];
      state.active = true;
      state.nextAllowedAt = startNow + presentation.durationMs + Math.max(240, presentation.staggerMs);
      runtime.typewriterPreviewActive.set(group, startNow);
      animateTypewriterPreviewElement(animatedNode, livePreview, presentation);
      state.releaseTimer = window.setTimeout(() => {
        state.releaseTimer = 0;
        state.active = false;
        runtime.typewriterPreviewActive.delete(group);
      }, presentation.durationMs + TYPEWRITER_PREVIEW_POLICY.releasePaddingMs);
    };

    const delay = force ? 0 : presentation.staggerMs;
    if (delay) state.pendingTimer = window.setTimeout(start, delay);
    else start();
  }

  function animateTypewriterTargetPreviewFromEvent(event) {
    const name = String(event?.type || "").replace(/^markdown-typewriter:/, "");
    const detail = event?.detail || {};
    if (name === "constructor-effect-cycle" && detail.phase !== "complete") {
      animateTypewriterTargetPreview(`${detail.constructor}:${detail.id}:${detail.effect}`);
    } else if (name === "codeblock-loop-cycle") {
      animateTypewriterTargetPreview(`code-loop:${detail.codeBlockId}:${detail.id}`);
    } else if (name === "rotation-cycle") {
      const group = `rotation:${detail.effect || "slot"}`;
      animateTypewriterTargetPreview(group, {
        ...(runtime.typewriterPreviewSpecs?.[group] || {}),
        cycle: Number(detail.cycle) || 0,
        durationMs: Number(detail.timing?.transitionMs) || runtime.typewriterPreviewSpecs?.[group]?.durationMs || TYPEWRITER_STANDARD_TIMING.rotationSpeedMs,
        previewOrientation: "horizontal",
      });
    }
  }

  function typewriterSliderSpec(control) {
    const apiMin = Number.isFinite(Number(control?.editorMin)) ? Number(control.editorMin) : Number.isFinite(Number(control?.min)) ? Number(control.min) : 0;
    const apiMax = Number.isFinite(Number(control?.editorMax)) ? Number(control.editorMax) : Number.isFinite(Number(control?.max)) ? Number(control.max) : 100;
    const scaleId = String(control?.perceptualScale || "");
    const stops = typewriterPerceptualStops(scaleId);
    if (stops?.length) {
      return {
        apiMin, apiMax, scaleId, stops,
        sliderMin: 0, sliderMax: stops.length - 1, sliderStep: 1,
        invert: false,
        lowerLabel: String(control?.sliderLowerLabel || (scaleId === "hold-ms" ? "Shorter" : "Slower")),
        upperLabel: String(control?.sliderUpperLabel || (scaleId === "hold-ms" ? "Longer" : "Faster")),
      };
    }
    const sliderMin = Number.isFinite(Number(control?.sliderMin)) ? Number(control.sliderMin) : apiMin;
    const sliderMax = Number.isFinite(Number(control?.sliderMax)) ? Number(control.sliderMax) : apiMax;
    const sliderStep = Number.isFinite(Number(control?.sliderStep)) && Number(control.sliderStep) > 0
      ? Number(control.sliderStep)
      : Number.isFinite(Number(control?.step)) && Number(control.step) > 0 ? Number(control.step) : 1;
    return {
      apiMin, apiMax, scaleId: "", stops: null,
      sliderMin: Math.min(sliderMin, sliderMax),
      sliderMax: Math.max(sliderMin, sliderMax),
      sliderStep,
      invert: control?.sliderInvert === true,
      lowerLabel: String(control?.sliderLowerLabel || ''),
      upperLabel: String(control?.sliderUpperLabel || ''),
    };
  }

  function typewriterSliderPosition(control, actualValue) {
    const spec = typewriterSliderSpec(control);
    if (spec.stops?.length) return nearestTypewriterPerceptualIndex(spec.scaleId, actualValue);
    const actual = Math.max(spec.sliderMin, Math.min(spec.sliderMax, Number(actualValue) || 0));
    return spec.invert ? (spec.sliderMin + spec.sliderMax - actual) : actual;
  }

  function semanticInputActualValue(input) {
    const raw = Number(input?.value);
    if (!Number.isFinite(raw)) return NaN;
    if (input?.dataset?.twControlEditor !== 'range') return raw;
    const scaleId = String(input.dataset.twSliderScale || "");
    const stops = typewriterPerceptualStops(scaleId);
    if (stops?.length) return Number(stops[Math.max(0, Math.min(stops.length - 1, Math.round(raw)))]);
    const sliderMin = Number(input.dataset.twSliderMin);
    const sliderMax = Number(input.dataset.twSliderMax);
    if (input.dataset.twSliderInvert === 'true' && Number.isFinite(sliderMin) && Number.isFinite(sliderMax)) {
      return sliderMin + sliderMax - raw;
    }
    return raw;
  }

  function semanticDisplayToApiValue(input, displayValue) {
    const value = Number(displayValue);
    if (!Number.isFinite(value)) return NaN;
    const transform = input?.dataset?.twValueTransform || "";
    const reference = Number(input?.dataset?.twValueReference);
    if (transform === "inverse-duration-rate" && Number.isFinite(reference) && reference > 0) {
      return reference / Math.max(0.0001, value);
    }
    return value;
  }

  function setSemanticInputFromActual(input, actualValue) {
    if (!input) return;
    const actual = Number(actualValue);
    if (!Number.isFinite(actual)) return;
    if (input.dataset.twControlEditor === 'range') {
      const scaleId = String(input.dataset.twSliderScale || "");
      const stops = typewriterPerceptualStops(scaleId);
      if (stops?.length) {
        input.value = String(nearestTypewriterPerceptualIndex(scaleId, actual));
        return;
      }
      const sliderMin = Number(input.dataset.twSliderMin);
      const sliderMax = Number(input.dataset.twSliderMax);
      const clamped = Number.isFinite(sliderMin) && Number.isFinite(sliderMax)
        ? Math.max(sliderMin, Math.min(sliderMax, actual))
        : actual;
      input.value = String(input.dataset.twSliderInvert === 'true' && Number.isFinite(sliderMin) && Number.isFinite(sliderMax)
        ? sliderMin + sliderMax - clamped
        : clamped);
    } else {
      input.value = String(actual);
    }
  }

  function typewriterControlTooltip(control, displayValue) {
    const scaleId = String(control?.perceptualScale || "");
    const unit = String(control?.editorUnit || control?.unit || "");
    const current = formatTypewriterControlValue(scaleId, displayValue, unit);
    const defaultApi = Number(control?.defaultValue);
    const defaultDisplay = Number.isFinite(Number(control?.defaultEditorValue)) ? Number(control.defaultEditorValue) : defaultApi;
    const defaultText = Number.isFinite(defaultDisplay) ? formatTypewriterControlValue(scaleId, defaultDisplay, unit) : "inherited";
    const range = Number.isFinite(Number(control?.editorMin)) && Number.isFinite(Number(control?.editorMax))
      ? `${control.editorMin}–${control.editorMax} ${unit}`
      : Number.isFinite(Number(control?.min)) && Number.isFinite(Number(control?.max)) ? `${control.min}–${control.max} ${unit}` : "API-defined";
    const behavior = control?.timingSource === "literal" ? "Literal time; playback rate does not scale this hold." : control?.timingSource === "owner-cadence" ? "Uses the owning text cadence, so the resolved motion can change with playback pace." : "Uses the runtime timing policy.";
    const path = String(control?.target?.path || "");
    const rawUnit = String(control?.unit || "");
    const rawValue = Number(control?.value);
    const apiDetail = path ? `API: ${path}${Number.isFinite(rawValue) ? ` = ${rawValue}${rawUnit ? ` ${rawUnit}` : ""}` : ""}.` : "";
    return [String(control?.description || `${control?.label || "Control"}.`), behavior, apiDetail, `Current: ${current}. Default: ${defaultText}. Exact range: ${range}. The slider uses perceptual steps; type a number for an exact custom value.`].filter(Boolean).join(" ");
  }

  function typewriterControlDisplayCaption(control, displayValue) {
    const scaleId = String(control?.perceptualScale || "");
    return formatTypewriterControlValue(scaleId, displayValue, String(control?.editorUnit || control?.unit || ""));
  }

  function renderTypewriterSemanticControl(control, semantics, { grouped = false } = {}) {
    const family = control?.family || "";
    const targetAttrs = typewriterControlTargetAttributes(control);
    const highlightId = control?.scope === "global" || control?.scope === "constructor" ? "" : (control?.parentId || control?.objectId || "");
    const highlightAttr = highlightId ? ` data-tw-highlight-id="${escapeHTML(highlightId)}"` : "";
    const object = compactTypewriterText(control?.objectLabel || control?.objectId || control?.objectType || "", 34);
    const context = !grouped && object && object !== control.label ? `<small class="bp-tw-semantic-object">${escapeHTML(object)}</small>` : "";
    const timing = typewriterControlTimingLabel(control, semantics);
    const timingLine = timing ? `<small class="bp-tw-semantic-timing">${escapeHTML(timing)}</small>` : "";

    if (family === "toggle" && control?.target?.scope === "constructor") {
      const behavior = String(control.behavior || "live");
      return `<label class="bp-tw-toggle-card bp-tw-semantic-toggle"${highlightAttr} title="${escapeHTML(control.description || `${control.targetLabel || control.label} availability. Current: ${control.value ? "On" : "Off"}. This change applies live without restarting the document.`)}">
        <input type="checkbox" data-tw-constructor-enabled="${escapeHTML(control.target.constructor)}" ${control.value ? "checked" : ""}>
        <span><strong>${escapeHTML(control.targetLabel || control.label)}</strong><small class="bp-tw-toggle-behavior is-${escapeHTML(behavior)}">${escapeHTML(behavior)}</small></span>
      </label>`;
    }

    if (family === "repeat") {
      const active = control.value === true;
      const state = control.lifecycle || (active ? "active" : "settled");
      let actions = "";
      if (control.target?.scope === "constructor-effect") {
        actions = `<button type="button" data-tw-api-action="replay-effect" data-constructor="${escapeHTML(control.target.constructor)}" data-item-id="${escapeHTML(control.target.id)}" data-effect="${escapeHTML(control.target.effect || "")}">Replay</button>
          <button type="button" data-tw-api-action="${active ? "stop-effect-loop" : "start-effect-loop"}" data-constructor="${escapeHTML(control.target.constructor)}" data-item-id="${escapeHTML(control.target.id)}" data-effect="${escapeHTML(control.target.effect || "")}">${active ? "Stop" : "Start"}</button>`;
      } else if (control.target?.scope === "code-loop") {
        actions = `<button type="button" data-tw-api-action="${active ? "stop-code-loop" : "start-code-loop"}" data-block-id="${escapeHTML(control.target.blockId)}" data-loop-id="${escapeHTML(control.target.loopId)}">${active ? "Stop" : "Start"}</button>
          <button type="button" data-tw-api-action="restart-code-loop" data-block-id="${escapeHTML(control.target.blockId)}" data-loop-id="${escapeHTML(control.target.loopId)}">Restart</button>`;
      }
      const renderSummary = String(control.renderSummary || control.effectLabel || control.targetLabel || "").trim();
      const sourceExample = String(control.sourceExample || "").trim();
      return `<div class="bp-tw-semantic-row bp-tw-semantic-repeat"${highlightAttr}>
        <span class="bp-tw-semantic-copy"><strong>${escapeHTML(control.label)}</strong>${context}<small>${escapeHTML(state)} · cycle ${Number(control.cycle) || 0}</small>${renderSummary ? `<small class="bp-tw-repeat-render"><b>Renders</b> ${escapeHTML(renderSummary)}</small>` : ""}${sourceExample ? `<code class="bp-tw-repeat-source" title="${escapeHTML(sourceExample)}">${escapeHTML(sourceExample)}</code>` : ""}</span>
        <span class="bp-tw-semantic-state ${active ? "is-live" : ""}">${active ? "↻ running" : control.configured ? "ready" : "stopped"}</span>
        <span class="bp-tw-mini-actions">${actions}</span>
      </div>`;
    }

    const editorMinValue = Number.isFinite(Number(control.editorMin)) ? Number(control.editorMin) : Number(control.min);
    const editorMaxValue = Number.isFinite(Number(control.editorMax)) ? Number(control.editorMax) : Number(control.max);
    const editorStepValue = Number.isFinite(Number(control.editorStep)) ? Number(control.editorStep) : Number(control.step);
    const min = Number.isFinite(editorMinValue) ? ` min="${editorMinValue}"` : "";
    const max = Number.isFinite(editorMaxValue) ? ` max="${editorMaxValue}"` : "";
    const step = Number.isFinite(editorStepValue) ? ` step="${editorStepValue}"` : ` step="any"`;
    const value = Number.isFinite(Number(control.editorValue)) ? Number(control.editorValue) : Number.isFinite(Number(control.value)) ? Number(control.value) : 0;
    const displayUnit = String(control.editorUnit || control.unit || "");
    const useRange = control.kind === "range";
    const controlKey = escapeHTML(control.id || `${control.targetGroup}:${control.label}`);
    const slider = typewriterSliderSpec(control);
    const sliderValue = typewriterSliderPosition(control, value);
    const defaultApi = Number(control.defaultValue);
    const defaultDisplay = Number.isFinite(Number(control.defaultEditorValue)) ? Number(control.defaultEditorValue) : defaultApi;
    const modified = Number.isFinite(defaultApi) && Math.abs((Number(control.value) || 0) - defaultApi) > 0.0001;
    const tooltip = typewriterControlTooltip(control, value);
    const defaultPosition = Number.isFinite(defaultDisplay) && slider.stops?.length
      ? (nearestTypewriterPerceptualIndex(slider.scaleId, defaultDisplay) / Math.max(1, slider.stops.length - 1)) * 100
      : Number.isFinite(defaultDisplay) && slider.sliderMax > slider.sliderMin
        ? ((typewriterSliderPosition(control, defaultDisplay) - slider.sliderMin) / (slider.sliderMax - slider.sliderMin)) * 100
        : 50;
    const sliderLabels = slider.lowerLabel || slider.upperLabel
      ? `<small class="bp-tw-range-scale"><span>${escapeHTML(slider.lowerLabel)}</span>${slider.scaleId === "motion-rate" ? `<span>1× standard</span>` : slider.scaleId === "hold-ms" ? `<span>useful centre</span>` : ""}<span>${escapeHTML(slider.upperLabel)}</span></small>`
      : "";
    const editor = useRange
      ? `<span class="bp-tw-range-pair">
          <span class="bp-tw-range-track${slider.scaleId ? " is-perceptual" : ""}">
            <span class="bp-tw-range-input-shell" style="--tw-default-pos:${defaultPosition}%">
              <input type="range" data-tw-semantic-input data-tw-control-key="${controlKey}" data-tw-control-editor="range" data-tw-slider-scale="${escapeHTML(slider.scaleId)}" data-tw-slider-invert="${slider.invert}" data-tw-slider-min="${slider.sliderMin}" data-tw-slider-max="${slider.sliderMax}" ${targetAttrs} min="${slider.sliderMin}" max="${slider.sliderMax}" step="${slider.sliderStep}" value="${sliderValue}" aria-label="${escapeHTML(control.label)} slider" title="${escapeHTML(tooltip)}">
              ${Number.isFinite(defaultDisplay) ? `<i class="bp-tw-range-default-marker" aria-hidden="true"></i>` : ""}
            </span>
            ${sliderLabels}
          </span>
          <span class="bp-tw-exact-editor"><input type="number" data-tw-semantic-input data-tw-control-key="${controlKey}" data-tw-control-editor="number" ${targetAttrs}${min}${max} step="any" value="${value}" inputmode="decimal" aria-label="${escapeHTML(control.label)} exact value" title="${escapeHTML(tooltip)}"><b>${escapeHTML(displayUnit)}</b></span>
        </span>`
      : `<input type="number" data-tw-semantic-input data-tw-control-key="${controlKey}" ${targetAttrs}${min}${max}${step} value="${value}" inputmode="decimal" title="${escapeHTML(tooltip)}">`;
    const reset = modified && control.scope === "global" && Number.isFinite(defaultApi)
      ? `<button type="button" class="bp-tw-reset-control" data-tw-reset-control data-tw-control-path="${escapeHTML(control.target?.path || "")}" data-tw-default-api="${defaultApi}" title="Reset ${escapeHTML(control.label)} to its standard default">↺</button>`
      : "";
    return `<label class="bp-tw-semantic-row${useRange ? " is-range" : ""}${modified ? " is-modified" : ""}"${highlightAttr} title="${escapeHTML(tooltip)}">
      <span class="bp-tw-semantic-copy"><strong>${escapeHTML(control.label)}</strong>${context}${timingLine}</span>
      <span class="bp-tw-semantic-control">
        ${editor}
        <span class="bp-tw-control-caption"><em data-tw-unit="${escapeHTML(displayUnit)}" data-tw-scale="${escapeHTML(slider.scaleId)}">${escapeHTML(typewriterControlDisplayCaption(control, value))}</em>${reset}</span>
      </span>
    </label>`;
  }

  function renderTypewriterSemanticGroups(controls, semantics, { family = "control" } = {}) {
    if (!controls.length) return "";
    const groups = new Map();
    for (const control of controls) {
      const key = control.targetGroup || `${control.objectType || "object"}:${control.objectId || control.id}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(control);
    }
    return [...groups.entries()].map(([targetGroup, items]) => {
      const first = items[0] || {};
      const highlightId = first.scope === "global" || first.scope === "constructor" ? "" : (first.parentId || first.objectId || "");
      const highlightAttr = highlightId ? ` data-tw-highlight-id="${escapeHTML(highlightId)}"` : "";
      const effect = first.effectLabel ? `<small>${escapeHTML(first.effectLabel)}</small>` : `<small>${escapeHTML(semantics?.families?.[first.family]?.label || first.family || "control")}</small>`;
      const activeRepeat = items.some(control => control.family === "repeat" && control.value === true);
      const stateKey = typewriterTargetOpenKey(family, targetGroup);
      const explicitOpen = runtime.typewriterTargetGroupOpen?.[stateKey];
      const open = typeof explicitOpen === "boolean" ? explicitOpen : activeRepeat;
      const preview = items.find(control => control.preview)?.preview || null;
      return `<details class="bp-tw-target-group" data-tw-target-group="${escapeHTML(targetGroup)}" data-tw-target-family="${escapeHTML(family)}"${highlightAttr}${open ? " open" : ""}>
        <summary>${typewriterTargetPreviewMarkup(preview, targetGroup)}<strong>${escapeHTML(first.targetLabel || first.objectLabel || first.objectId || "Target")}</strong>${effect}<em>${items.length}</em></summary>
        <div class="bp-tw-target-controls">${items.map(control => renderTypewriterSemanticControl(control, semantics, { grouped: true })).join("")}</div>
      </details>`;
    }).join("");
  }

  function refreshTypewriterApiControls() {
    const engine = runtime.typewriterEngine;
    const runtimeNode = $("#bpTypewriterRuntimeInspector");
    const constructorNode = $("#bpTypewriterConstructorInspector");
    const codeNode = $("#bpTypewriterCodeInspector");
    if (!engine || !runtimeNode || !constructorNode || !codeNode) return;

    let surface = null;
    let runtimeState = null;
    let state = null;
    let constructors = {};
    let codeBlocks = [];
    let controlInventory = null;
    try { surface = engine.getApiSurface?.() || null; } catch (error) { console.warn(error); }
    try { runtimeState = engine.getRuntimeState?.() || null; } catch (error) { console.warn(error); }
    try { state = engine.getState?.() || null; } catch (error) { console.warn(error); }
    try { constructors = engine.getConstructors?.() || {}; } catch (error) { console.warn(error); }
    try { codeBlocks = engine.getCodeBlocks?.() || []; } catch (error) { console.warn(error); }
    try { controlInventory = engine.getControlInventory?.() || null; } catch (error) { console.warn(error); }

    const inventoryControls = controlInventory?.controls || [];
    const semantics = controlInventory?.semantics || {};
    const inventoryTargets = controlInventory?.targets || [];
    runtime.typewriterPreviewSpecs = Object.fromEntries(inventoryTargets.filter(target => target.preview).map(target => [target.id, target.preview]));
    const showInherited = runtime.typewriterShowInheritedControls === true;
    const targetFilter = "all";

    const coordinator = runtimeState?.coordinator || {};
    const scheduler = runtimeState?.scheduler || {};
    const indexes = runtimeState?.indexes || {};
    const flow = runtimeState?.flow || {};
    const timing = runtimeState?.timing || state?.note?.timing || null;
    const documentStatus = state?.paused ? "paused" : state?.note?.complete ? "complete" : "typing";
    const completionTime = timing && state?.note?.complete
      ? formatTypewriterDuration(timing.activeElapsedMs ?? timing.elapsedMs, { precise: true })
      : "";
    const elapsedTime = timing
      ? formatTypewriterDuration(timing.activeElapsedMs ?? timing.elapsedMs, { precise: true })
      : "—";
    const wallTime = timing ? formatTypewriterDuration(timing.elapsedMs, { precise: true }) : "—";
    const pausedTime = timing && Number(timing.pausedMs) > 0 ? formatTypewriterDuration(timing.pausedMs, { precise: true }) : "0 s";
    const surfaceBadge = $("#bpTypewriterApiSurfaceBadge");
    if (surfaceBadge && surface) surfaceBadge.textContent = `${surface.methods?.length || 0} methods · ${surface.events?.length || 0} events`;
    const activeRepeats = inventoryControls.filter(control => control.family === "repeat" && control.value === true).length;
    const rotationStates = runtimeState?.rotation || {};
    const rotationSummary = Object.values(rotationStates).filter(Boolean).map(item => `${item.effect || "slot"} ${item.word || item.phase || "ready"} · c${Number(item.cycle) || 0}`).join(" · ") || "idle";
    runtimeNode.innerHTML = `
      <div class="bp-tw-runtime-grid">
        <span><b>Document</b><em data-state="${escapeHTML(documentStatus)}">${escapeHTML(documentStatus)}${completionTime ? ` · ${escapeHTML(completionTime)}` : ""}</em></span>
        <span><b>Render time</b><em>${state?.note?.complete ? `${escapeHTML(elapsedTime)} active · ${escapeHTML(wallTime)} wall` : `${escapeHTML(elapsedTime)} elapsed`}</em></span>
        <span><b>Pace</b><em>${Number(state?.parameters?.playback?.rate) || 1}× · ${escapeHTML(scheduler.rateScope || "document")} · ${Number(scheduler.activeSections) || 0} sections</em></span>
        <span><b>Active</b><em>${Number(coordinator.activeTypers) || 0} typers · ${Number(indexes.codeBlocks) || 0} CODE</em></span>
        <span><b>Repeating</b><em>${activeRepeats} live · ${Number(indexes.constructorEffectLoops) || 0} effects · ${Number(indexes.loopIds) || 0} CODE loops</em></span>
        <span><b>Pending</b><em>${flow.enabled === false ? "natural flow" : `${Number(flow.pendingBlocks) || 0} blocks · ${Number(flow.bridges) || 0} bridges`}</em></span>
        <span><b>Objects</b><em>${Number(indexes.constructorItems) || 0} constructor items</em></span>
        <span><b>Paused</b><em>${escapeHTML(pausedTime)}</em></span>
        <span><b>Rotation</b><em>${escapeHTML(rotationSummary)}</em></span>
        <span class="bp-tw-runtime-latest"><b>Latest</b><em>${escapeHTML(describeTypewriterEvent(runtime.typewriterLastEvent))}</em></span>
      </div>
    `;

    const inlineStatus = $("#bpTypewriterInlineStatus");
    if (inlineStatus && /(?:typo-phase|rotation-cycle)$/.test(runtime.typewriterLastEvent?.name || "")) {
      inlineStatus.textContent = describeTypewriterEvent(runtime.typewriterLastEvent);
    }

    const inheritedToggle = $("#bpTypewriterShowInherited");
    if (inheritedToggle && document.activeElement !== inheritedToggle) inheritedToggle.checked = showInherited;
    const controlScopeLabel = $("#bpTypewriterControlScopeLabel");
    const dataScopeLabel = $("#bpTypewriterDataScopeLabel");
    if (controlScopeLabel) controlScopeLabel.textContent = "Pace · toggles · presentation";
    if (dataScopeLabel) dataScopeLabel.textContent = "Runtime · holds · repetition · objects";

    const filterControl = control => showInherited || control.visibility !== "advanced";
    $$('[data-tw-control-target-group]').forEach(node => { node.hidden = false; });

    const semanticTargets = {
      pace: $("#bpTypewriterPaceInspector"),
      hold: $("#bpTypewriterHoldInspector"),
      repeat: $("#bpTypewriterRepeatInspector"),
      toggle: $("#bpTypewriterToggleInspector"),
    };
    const duplicateGlobals = new Set([
      "global:playback.rate",
      "global:renderer.flow.progressiveLayout",
      "global:renderer.flow.bridge",
      "global:renderer.flow.preserveScrollAnchor",
    ]);
    const activeSemanticInput = document.activeElement?.closest?.("[data-tw-semantic-input]") || null;
    for (const [family, node] of Object.entries(semanticTargets)) {
      if (!node) continue;
      const allFamilyControls = inventoryControls.filter(control => control.family === family && !duplicateGlobals.has(control.id));
      const controls = allFamilyControls.filter(filterControl);
      // Runtime telemetry can arrive several times per second. Preserve the
      // semantic subtree when its actual control state is unchanged so local
      // specimen animations are not destroyed/restarted by polling.
      const semanticSignature = JSON.stringify(controls.map(control => [
        control.id, control.value, control.visibility, control.targetGroup, control.label, control.unit,
        control.defaultValue, control.editorValue, control.resolved?.value, control.lifecycle,
        control.configured, control.behavior, control.perceptualScale,
      ]));
      const canReplace = !activeSemanticInput || !node.contains(activeSemanticInput);
      if (canReplace && node.__bpTwSemanticSignature !== semanticSignature) {
        node.innerHTML = family === "toggle"
          ? (controls.map(control => renderTypewriterSemanticControl(control, semantics)).join("") || `<span class="bp-tw-api-empty">No toggles are available.</span>`)
          : (renderTypewriterSemanticGroups(controls, semantics, { family })
            || `<span class="bp-tw-api-empty">No ${escapeHTML(semantics?.families?.[family]?.label?.toLowerCase() || family)} controls are available.</span>`);
        node.__bpTwSemanticSignature = semanticSignature;
      }
      const badge = family === "pace" ? $("#bpTypewriterPaceBadge")
        : family === "hold" ? $("#bpTypewriterHoldBadge")
          : family === "repeat" ? $("#bpTypewriterRepeatBadge")
            : $("#bpTypewriterToggleBadge");
      if (badge) {
        const builtIns = family === "pace" ? 2 : family === "toggle" ? 3 : 0;
        const builtInGroups = family === "pace" ? ["document:typing"]
          : family === "toggle" ? ["presentation:flow"] : [];
        const total = allFamilyControls.length + builtIns;
        const visible = controls.length + builtIns;
        const visibleGroupIds = new Set(controls.map(control => control.targetGroup));
        builtInGroups.forEach(group => visibleGroupIds.add(group));
        badge.textContent = showInherited || visible === total
          ? `${visible} controls · ${visibleGroupIds.size} targets`
          : `${visible} primary · ${total} with inherited`;
      }
    }

    // Preview timing is host presentation policy. Runtime telemetry updates
    // state badges without restarting motion; queued effect events are replayed
    // only after the stable semantic DOM has been refreshed.
    $$('[data-tw-preview-group]').forEach(node => {
      const group = node.dataset.twPreviewGroup || "";
      const preview = runtime.typewriterPreviewSpecs?.[group];
      node.classList.toggle("is-running", preview?.running === true);
    });
    const pendingPreviewEvents = runtime.typewriterPendingPreviewEvents.splice(0);
    pendingPreviewEvents.forEach(animateTypewriterTargetPreviewFromEvent);
    if (runtime.typewriterPreviewReplayTarget) {
      const target = runtime.typewriterPreviewReplayTarget;
      runtime.typewriterPreviewReplayTarget = "";
      requestAnimationFrame(() => animateTypewriterTargetPreview(target, null, { force: true }));
    }

    const constructorCards = [];
    let constructorItemCount = 0;
    let constructorTypeCount = 0;
    const scopeConstructorItems = (name, items) => {
      if (!selectedTarget) return items;
      if (selectedTarget.kind === "constructor-family") return selectedTarget.objectType === name ? items : [];
      if (selectedTarget.objectType === name && selectedTarget.objectId) {
        return items.filter(item => item.id === selectedTarget.objectId);
      }
      return [];
    };

    for (const [name, definition] of Object.entries(constructors)) {
      let allItems = [];
      try { allItems = engine.getConstructorItems?.(name) || []; } catch (error) { console.warn(error); }
      const items = scopeConstructorItems(name, allItems);
      const matchingFamily = selectedTarget?.kind === "constructor-family" && selectedTarget.objectType === name;
      if (selectedTarget && !matchingFamily && items.length === 0) continue;
      constructorTypeCount += 1;
      constructorItemCount += items.length;
      const label = definition?.label || name;
      const itemRows = name === "codeblock" ? "" : items.map(item => {
        const preview = compactTypewriterText(item.text || item.title || item.href || item.language || item.id);
        const preset = item.preset ? `<span class="bp-tw-api-chip">${escapeHTML(item.preset)}</span>` : "";
        const effects = Object.entries(item.effects || {});
        const effectRows = effects.map(([effect, effectState]) => {
          const reached = effectState?.reached === true;
          const running = effectState?.running === true;
          const cycle = Number(effectState?.cycle) || 0;
          return `
            <div class="bp-tw-effect-row">
              <span class="bp-tw-api-chip ${running ? "is-live" : ""}">${escapeHTML(effect)} · ${running ? `loop ${cycle}` : reached ? "ready" : "pending"}</span>
              <div class="bp-tw-mini-actions">
                <button type="button" data-tw-api-action="replay-effect" data-constructor="${escapeHTML(name)}" data-item-id="${escapeHTML(item.id)}" data-effect="${escapeHTML(effect)}" ${reached ? "" : "disabled"}>Replay</button>
                <button type="button" data-tw-api-action="${running ? "stop-effect-loop" : "start-effect-loop"}" data-constructor="${escapeHTML(name)}" data-item-id="${escapeHTML(item.id)}" data-effect="${escapeHTML(effect)}">${running ? "Stop loop" : "Start loop"}</button>
              </div>
            </div>`;
        }).join("");
        return `
          <div class="bp-tw-api-item" data-tw-highlight-id="${escapeHTML(item.id)}">
            <div class="bp-tw-api-item-head"><code>${escapeHTML(item.id)}</code>${preset}</div>
            <small>${escapeHTML(preview || "Unnamed item")}</small>
            ${effectRows || `<span class="bp-tw-api-chip is-muted">${escapeHTML(item.typing?.behavior || "no transient effect")}</span>`}
          </div>`;
      }).join("");
      constructorCards.push(`
        <details class="bp-tw-api-card"${selectedTarget ? " open" : ""}>
          <summary>
            <span><strong>${escapeHTML(label)}</strong><small>${items.length} item${items.length === 1 ? "" : "s"}${selectedTarget ? " · scoped" : ""}</small></span>
            <span class="bp-tw-api-chip is-muted">${items.length}</span>
          </summary>
          <p>${escapeHTML(compactTypewriterText(definition?.description || "", 110))}</p>
          ${name === "codeblock" ? `<small class="bp-tw-api-note">Code block instances and local loops are controlled in the Code & loops section.</small>` : itemRows || `<small class="bp-tw-api-note">No instances match the selected target.</small>`}
        </details>`);
    }
    constructorNode.innerHTML = constructorCards.join("") || `<span class="bp-tw-api-empty">No constructor objects match ${escapeHTML(selectedTargetLabel)}.</span>`;
    const constructorBadge = $("#bpTypewriterConstructorBadge");
    if (constructorBadge) constructorBadge.textContent = `${constructorTypeCount} type${constructorTypeCount === 1 ? "" : "s"} · ${constructorItemCount} item${constructorItemCount === 1 ? "" : "s"}${selectedTarget ? " · scoped" : ""}`;

    const codeTargetVisible = !selectedTarget
      || (selectedTarget.kind === "constructor-family" && selectedTarget.objectType === "codeblock")
      || selectedTarget.kind === "code-loop";
    const scopedCodeBlocks = !codeTargetVisible ? [] : selectedTarget?.kind === "code-loop"
      ? codeBlocks.filter(block => block.id === selectedTarget.parentId)
      : codeBlocks;
    let scopedLoopCount = 0;
    const codeCards = scopedCodeBlocks.map(block => {
      const runtimeInfo = block.runtime || {};
      const blockLoops = selectedTarget?.kind === "code-loop"
        ? (block.loops || []).filter(loop => loop.id === selectedTarget.objectId)
        : (block.loops || []);
      scopedLoopCount += blockLoops.length;
      const loops = blockLoops.map(loop => {
        const loopRuntime = loop.runtime || {};
        const running = loopRuntime.running === true;
        const armed = loopRuntime.armed === true;
        return `
          <div class="bp-tw-code-loop">
            <div><strong>${escapeHTML(loop.name || loop.id)}</strong><small>${Number(loop.effective?.holdMs ?? loopRuntime.holdMs) || 0} ms · ${Number(loop.effective?.rate ?? loopRuntime.rate) || 1}× · cycle ${Number(loopRuntime.cycle ?? loop.cycle) || 0}</small></div>
            <span class="bp-tw-api-chip ${running ? "is-live" : armed ? "is-armed" : ""}">${running ? "running" : armed ? "armed" : "idle"}</span>
            <div class="bp-tw-mini-actions">
              <button type="button" data-tw-api-action="${running || armed ? "stop-code-loop" : "start-code-loop"}" data-block-id="${escapeHTML(block.id)}" data-loop-id="${escapeHTML(loop.id)}">${running || armed ? "Stop" : "Start"}</button>
              <button type="button" data-tw-api-action="restart-code-loop" data-block-id="${escapeHTML(block.id)}" data-loop-id="${escapeHTML(loop.id)}">Restart</button>
            </div>
          </div>`;
      }).join("");
      return `
        <details class="bp-tw-api-card bp-tw-code-card" data-tw-highlight-id="${escapeHTML(block.id)}"${selectedTarget ? " open" : ""}>
          <summary><span><strong>${escapeHTML(block.id)}</strong><small>${escapeHTML(block.language || "TEXT")} · ${block.parentCodeBlockId ? "nested" : "root"}</small></span><span class="bp-tw-api-chip ${runtimeInfo.running ? "is-live" : ""}">${runtimeInfo.running ? "typing" : block.complete ? "complete" : "idle"}</span></summary>
          <div class="bp-tw-code-meta"><span>cycle ${Number(runtimeInfo.cycle) || 0}</span><span>${block.childCodeBlockIds?.length || 0} children</span><span>${blockLoops.length} loops shown</span></div>
          <div class="bp-tw-mini-actions"><button type="button" data-tw-api-action="restart-code-block" data-block-id="${escapeHTML(block.id)}">Restart block</button></div>
          ${loops || `<small class="bp-tw-api-note">No named loops match the selected target.</small>`}
        </details>`;
    }).join("");
    codeNode.innerHTML = codeCards || `<span class="bp-tw-api-empty">No CODE runtime data matches ${escapeHTML(selectedTargetLabel)}.</span>`;
    const codeBadge = $("#bpTypewriterCodeBadge");
    if (codeBadge) codeBadge.textContent = `${scopedCodeBlocks.length} block${scopedCodeBlocks.length === 1 ? "" : "s"} · ${scopedLoopCount} loop${scopedLoopCount === 1 ? "" : "s"}${selectedTarget ? " · scoped" : ""}`;
  }

  function nestedTypewriterPatch(path, value) {
    const keys = String(path || "").split(".").filter(Boolean);
    if (!keys.length) return {};
    const root = {};
    let cursor = root;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) cursor[key] = value;
      else cursor = cursor[key] = {};
    });
    return root;
  }

  function bindTypewriterSettings() {
    const saveAndConfigure = ({ restart = false } = {}) => {
      appState.notes.typewriter = normalizeTypewriterSettings(appState.notes.typewriter);
      queueSaveState();
      configureActiveTypewriter({ restart });
      scheduleTypewriterApiRefresh();
    };

    const syncPlaybackRateUi = value => {
      const numeric = Math.max(0.25, Math.min(64, Number(value) || TYPEWRITER_STANDARD_TIMING.playbackRate));
      const input = $("#bpTypewriterPlaybackRate");
      const slider = $("#bpTypewriterPlaybackRateSlider");
      const caption = $("#bpTypewriterPlaybackRateCaption");
      const reset = $("#bpTypewriterPlaybackRateReset");
      if (input && document.activeElement !== input) input.value = String(numeric);
      if (slider) slider.value = String(nearestTypewriterPerceptualIndex("typing-rate", numeric));
      if (caption) caption.textContent = formatTypewriterControlValue("typing-rate", numeric, "×");
      const modified = Math.abs(numeric - TYPEWRITER_STANDARD_TIMING.playbackRate) > 0.0001;
      if (reset) reset.hidden = !modified;
      const field = input?.closest?.(".bp-tw-timing-field") || slider?.closest?.(".bp-tw-timing-field");
      field?.classList.toggle("is-modified", modified);
      return numeric;
    };
    $("#bpTypewriterPlaybackRateSlider")?.addEventListener("input", event => {
      const stops = TYPEWRITER_PERCEPTUAL_SCALES["typing-rate"];
      const value = Number(stops[Math.max(0, Math.min(stops.length - 1, Math.round(Number(event.currentTarget.value) || 0)))]);
      appState.notes.typewriter.playbackRate = value;
      const input = $("#bpTypewriterPlaybackRate");
      if (input) input.value = String(value);
      syncPlaybackRateUi(value);
      saveAndConfigure();
    });
    $("#bpTypewriterPlaybackRate")?.addEventListener("input", event => syncPlaybackRateUi(event.currentTarget.value));
    $("#bpTypewriterPlaybackRate")?.addEventListener("change", event => {
      const value = syncPlaybackRateUi(event.currentTarget.value);
      appState.notes.typewriter.playbackRate = value;
      event.currentTarget.value = String(value);
      saveAndConfigure();
    });
    $("#bpTypewriterPlaybackRateReset")?.addEventListener("click", () => {
      appState.notes.typewriter.playbackRate = TYPEWRITER_STANDARD_TIMING.playbackRate;
      syncPlaybackRateUi(TYPEWRITER_STANDARD_TIMING.playbackRate);
      saveAndConfigure();
    });
    $("#bpTypewriterPlaybackScope")?.addEventListener("change", event => {
      appState.notes.typewriter.playbackScope = event.currentTarget.value === "section" ? "section" : "document";
      saveAndConfigure();
    });
    $("#bpTypewriterRestartPolicy")?.addEventListener("change", event => {
      const value = event.currentTarget.value;
      appState.notes.typewriter.restartPolicy = ["completed", "once", "persist"].includes(value) ? value : "restart";
      const active = getActiveDocument();
      const lifetime = documentTypewriterLifetime(active);
      const state = runtime.typewriterEngine?.getState?.();
      if (state?.note) {
        lifetime.started = true;
        lifetime.startedAt ||= new Date().toISOString();
        if (state.note.complete) {
          lifetime.completed = true;
          lifetime.completedAt ||= new Date().toISOString();
        }
      }
      queueSaveState();
      scheduleTypewriterApiRefresh();
    });
    $("#bpTypewriterShowInherited")?.addEventListener("change", event => {
      runtime.typewriterShowInheritedControls = event.currentTarget.checked;
      scheduleTypewriterApiRefresh();
    });
    $("#bpTypewriterThemePreset")?.addEventListener("change", event => {
      const preset = THEME_PRESETS.find(item => item.id === event.currentTarget.value);
      if (preset) applyThemeCode(preset.code, { toast: false });
    });
    $("#bpTypewriterProgressiveLayout")?.addEventListener("change", event => {
      appState.notes.typewriter.progressiveLayout = event.currentTarget.checked;
      saveAndConfigure({ restart: true });
    });
    $("#bpTypewriterPendingFlow")?.addEventListener("change", event => {
      appState.notes.typewriter.pendingFlow = event.currentTarget.value === "reserve" ? "reserve" : "collapse";
      saveAndConfigure({ restart: true });
    });
    $("#bpTypewriterFlowBridge")?.addEventListener("change", event => {
      appState.notes.typewriter.flowBridge = event.currentTarget.checked;
      saveAndConfigure({ restart: true });
    });
    $("#bpTypewriterPreserveScrollAnchor")?.addEventListener("change", event => {
      appState.notes.typewriter.preserveScrollAnchor = event.currentTarget.checked;
      saveAndConfigure();
    });

    const bindRange = (inputId, outputId, key, format) => {
      const input = $(`#${inputId}`);
      if (!input) return;
      input.addEventListener("input", () => {
        appState.notes.typewriter[key] = Number(input.value);
        const output = $(`#${outputId}`);
        if (output) output.value = format(input.value);
        saveAndConfigure();
      });
    };

    $("#bpTypewriterRendererMode")?.addEventListener("change", event => {
      appState.notes.typewriter.rendererMode = event.currentTarget.value === "multi" ? "multi" : "single";
      saveAndConfigure({ restart: true });
    });
    $("#bpTypewriterHeadingVelocity")?.addEventListener("change", event => {
      appState.notes.typewriter.headingVelocity = event.currentTarget.value;
      saveAndConfigure({ restart: true });
    });
    $$('[data-tw-heading-level]').forEach(input => input.addEventListener("change", () => {
      const levels = $$('[data-tw-heading-level]:checked').map(item => Number(item.dataset.twHeadingLevel));
      appState.notes.typewriter.headingLevels = levels.length ? levels : [1];
      saveAndConfigure({ restart: true });
    }));

    const panel = $(".bp-notes-document-layout");
    panel?.addEventListener("change", event => {
      const toggle = event.target.closest?.("[data-tw-constructor-enabled]");
      if (!toggle) return;
      const name = String(toggle.dataset.twConstructorEnabled || "");
      if (!name) return;
      appState.notes.typewriter = normalizeTypewriterSettings(appState.notes.typewriter);
      appState.notes.typewriter.constructorEnabled[name] = toggle.checked;
      queueSaveState();
      try {
        runtime.typewriterEngine?.configureConstructor?.(name, { enabled: toggle.checked });
        scheduleTypewriterApiRefresh();
      } catch (error) {
        console.warn(error);
        showToast(`Could not update ${name}.`);
      }
    });

    panel?.addEventListener("input", event => {
      const input = event.target.closest?.('[data-tw-semantic-input]');
      if (!input) return;
      const row = input.closest(".bp-tw-semantic-row");
      const key = input.dataset.twControlKey || "";
      const actualValue = semanticInputActualValue(input);
      if (Number.isFinite(actualValue) && key && row) {
        row.querySelectorAll(`[data-tw-semantic-input][data-tw-control-key="${CSS.escape(key)}"]`).forEach(peer => {
          if (peer !== input) setSemanticInputFromActual(peer, actualValue);
        });
      }
      const readout = row?.querySelector?.(".bp-tw-control-caption > em");
      if (readout && Number.isFinite(actualValue)) {
        const unit = readout.dataset.twUnit || "";
        readout.textContent = formatTypewriterControlValue(readout.dataset.twScale || "", actualValue, unit);
      }
    });

    panel?.addEventListener("change", event => {
      const input = event.target.closest?.("[data-tw-semantic-input]");
      if (!input) return;
      const engine = runtime.typewriterEngine;
      if (!engine) return;
      let value = semanticInputActualValue(input);
      if (!Number.isFinite(value)) return;
      const minValue = Number(input.min);
      const maxValue = Number(input.max);
      if (input.dataset.twControlEditor !== "range") {
        if (Number.isFinite(minValue)) value = Math.max(minValue, value);
        if (Number.isFinite(maxValue)) value = Math.min(maxValue, value);
      }
      const row = input.closest(".bp-tw-semantic-row");
      const key = input.dataset.twControlKey || "";
      if (row && key) row.querySelectorAll(`[data-tw-semantic-input][data-tw-control-key="${CSS.escape(key)}"]`).forEach(peer => setSemanticInputFromActual(peer, value));
      const apiValue = semanticDisplayToApiValue(input, value);
      if (!Number.isFinite(apiValue)) return;
      const scope = input.dataset.twControlScope;
      const path = input.dataset.twControlPath;
      try {
        if (scope === "global") {
          appState.notes.typewriter = normalizeTypewriterSettings(appState.notes.typewriter);
          appState.notes.typewriter.globalControlOverrides[path] = apiValue;
          queueSaveState();
          engine.configure?.(nestedTypewriterPatch(path, apiValue));
        } else if (scope === "constructor-item") {
          engine.setConstructorItem?.(input.dataset.constructor, input.dataset.itemId, nestedTypewriterPatch(path, apiValue));
        } else if (scope === "code-loop") {
          engine.setCodeBlockLoop?.(input.dataset.blockId, input.dataset.loopId, nestedTypewriterPatch(path, apiValue));
        }
        runtime.typewriterPreviewReplayTarget = input.closest(".bp-tw-target-group")?.dataset.twTargetGroup || "";
        scheduleTypewriterApiRefresh();
      } catch (error) {
        console.warn(error);
        showToast(`Could not update ${compactTypewriterText(path || scope, 64)}.`);
      }
    });

    panel?.addEventListener("click", event => {
      const reset = event.target.closest?.("[data-tw-reset-control]");
      if (!reset) return;
      event.preventDefault();
      const path = String(reset.dataset.twControlPath || "");
      const apiValue = Number(reset.dataset.twDefaultApi);
      const engine = runtime.typewriterEngine;
      if (!path || !Number.isFinite(apiValue) || !engine) return;
      try {
        appState.notes.typewriter = normalizeTypewriterSettings(appState.notes.typewriter);
        appState.notes.typewriter.globalControlOverrides[path] = apiValue;
        queueSaveState();
        engine.configure?.(nestedTypewriterPatch(path, apiValue));
        runtime.typewriterPreviewReplayTarget = reset.closest(".bp-tw-target-group")?.dataset.twTargetGroup || "";
        scheduleTypewriterApiRefresh();
      } catch (error) {
        console.warn(error);
        showToast(`Could not reset ${compactTypewriterText(path, 64)}.`);
      }
    });

    panel?.addEventListener("toggle", event => {
      const group = event.target.closest?.(".bp-tw-target-group");
      if (!group || event.target !== group) return;
      const family = group.dataset.twTargetFamily || "control";
      const targetGroup = group.dataset.twTargetGroup || "";
      if (!targetGroup) return;
      runtime.typewriterTargetGroupOpen[typewriterTargetOpenKey(family, targetGroup)] = group.open;
      if (group.open) requestAnimationFrame(() => animateTypewriterTargetPreview(targetGroup, null, { force: true }));
    }, true);

    panel?.addEventListener("focusin", event => {
      const input = event.target.closest?.("[data-tw-semantic-input]");
      if (!input) return;
      input.dataset.twEditOriginal = input.value;
      input.closest(".bp-tw-target-group")?.classList.add("is-editing");
    });
    panel?.addEventListener("focusout", event => {
      const input = event.target.closest?.("[data-tw-semantic-input]");
      if (!input) return;
      input.closest(".bp-tw-target-group")?.classList.remove("is-editing");
      delete input.dataset.twEditOriginal;
      requestAnimationFrame(() => scheduleTypewriterApiRefresh());
    });
    panel?.addEventListener("keydown", event => {
      const input = event.target.closest?.("[data-tw-semantic-input]");
      if (!input) return;
      if (event.key === "Enter") {
        event.preventDefault();
        input.blur();
      } else if (event.key === "Escape") {
        event.preventDefault();
        if (input.dataset.twEditOriginal !== undefined) input.value = input.dataset.twEditOriginal;
        input.blur();
      }
    });

    let inspectedElement = null;
    const clearInspection = () => {
      inspectedElement?.classList?.remove("tw-inspected-object");
      inspectedElement = null;
    };
    panel?.addEventListener("pointerover", event => {
      const row = event.target.closest?.("[data-tw-highlight-id]");
      if (!row) return;
      clearInspection();
      const id = row.dataset.twHighlightId;
      const output = $("#bpTypewriterOutput");
      if (!id || !output) return;
      inspectedElement = [...output.querySelectorAll("[id]")].find(element => element.id === id) || null;
      inspectedElement?.classList?.add("tw-inspected-object");
    });
    panel?.addEventListener("pointerout", event => {
      if (event.relatedTarget && panel.contains(event.relatedTarget) && event.relatedTarget.closest?.("[data-tw-highlight-id]") === event.target.closest?.("[data-tw-highlight-id]")) return;
      clearInspection();
    });

    panel?.addEventListener("click", async event => {
      const button = event.target.closest?.("[data-tw-api-action]");
      if (!button || button.disabled) return;
      const engine = runtime.typewriterEngine;
      if (!engine) return;
      const action = button.dataset.twApiAction;
      const constructor = button.dataset.constructor;
      const itemId = button.dataset.itemId;
      const effect = button.dataset.effect || undefined;
      const blockId = button.dataset.blockId;
      const loopId = button.dataset.loopId;
      const restartPolicy = normalizeTypewriterSettings(appState.notes.typewriter).restartPolicy;
      if (restartPolicy === "once" && (action === "replay-effect" || action === "restart-code-block")) {
        showToast("Once per Load is active. Reload the source file to replay finite Typewriter content.");
        return;
      }
      try {
        if (action === "replay-effect") await engine.replayConstructorItem?.(constructor, itemId, { effect });
        else if (action === "start-effect-loop") engine.startConstructorLoop?.(constructor, itemId, { effect });
        else if (action === "stop-effect-loop") engine.stopConstructorLoop?.(constructor, itemId, { effect });
        else if (action === "restart-code-block") engine.restartCodeBlock?.(blockId);
        else if (action === "start-code-loop") engine.startCodeBlockLoop?.(blockId, loopId);
        else if (action === "stop-code-loop") engine.stopCodeBlockLoop?.(blockId, loopId);
        else if (action === "restart-code-loop") engine.restartCodeBlockLoop?.(blockId, loopId);
        runtime.typewriterPreviewReplayTarget = button.closest(".bp-tw-target-group")?.dataset.twTargetGroup || "";
        scheduleTypewriterApiRefresh();
      } catch (error) {
        console.warn(error);
        showToast(`Typewriter action failed: ${compactTypewriterText(error?.message || action, 72)}`);
      }
    });

    const bindPause = button => button?.addEventListener("click", event => {
      const paused = runtime.typewriterEngine?.togglePause?.();
      const label = paused ? "Resume" : "Pause";
      event.currentTarget.textContent = label;
      const settings = $("#bpTypewriterSettingsPause");
      if (settings) settings.textContent = label;
      scheduleTypewriterApiRefresh();
    });
    bindPause($("#bpTypewriterSettingsPause"));
    $("#bpTypewriterSettingsFinish")?.addEventListener("click", async () => {
      const engine = runtime.typewriterEngine;
      if (!engine?.finishNow) return;
      const active = getActiveDocument();
      const lifetime = documentTypewriterLifetime(active);
      lifetime.started = true;
      lifetime.startedAt ||= new Date().toISOString();
      queueSaveState();
      try {
        await engine.finishNow();
        scheduleTypewriterApiRefresh();
        showToast("Finite Typewriter content finished. Loops remain active.");
      } catch (error) {
        console.warn(error);
        showToast("Could not finish the Typewriter document.");
      }
    });
    $("#bpTypewriterSettingsRestart")?.addEventListener("click", () => {
      const settings = normalizeTypewriterSettings(appState.notes.typewriter);
      if (settings.restartPolicy === "once") {
        showToast("Once per Load is active. Reload the source file to replay this document.");
        return;
      }
      const active = getActiveDocument();
      const lifetime = documentTypewriterLifetime(active);
      lifetime.started = true;
      lifetime.startedAt = new Date().toISOString();
      lifetime.completed = false;
      lifetime.completedAt = "";
      queueSaveState();
      runtime.typewriterEngine?.restart?.();
      scheduleTypewriterApiRefresh();
    });
  }

  function setTypewriterSettingsOpen(open) {
    runtime.notesTypewriterSettingsOpen = Boolean(open);
    const panels = $$(".bp-typewriter-settings");
    const rails = $$(".bp-notes-utility-rail");
    const layout = $(".bp-notes-document-layout");
    const toggle = $("#bpTypewriterSettingsToggle");
    panels.forEach(panel => { panel.hidden = !runtime.notesTypewriterSettingsOpen; });
    rails.forEach(rail => { rail.hidden = !runtime.notesTypewriterSettingsOpen; });
    layout?.classList.toggle("has-utility", runtime.notesTypewriterSettingsOpen);
    if (toggle) {
      const label = toggle.querySelector(".bp-button-label");
      const cue = toggle.querySelector(".bp-button-cue");
      if (label) label.textContent = "Controls";
      if (cue) cue.textContent = runtime.notesTypewriterSettingsOpen ? "▴" : "▾";
      if (!label && !cue) toggle.textContent = `Controls ${runtime.notesTypewriterSettingsOpen ? "▴" : "▾"}`;
      toggle.setAttribute("aria-expanded", String(runtime.notesTypewriterSettingsOpen));
    }
  }

  function bindNotesWorkbench() {
    runtime.notesWorkbenchCleanup?.();
    runtime.notesWorkbenchCleanup = null;
    runtime.notesWorkbenchMeasure = null;
    const panel = $(".bp-notes-panel");
    const layout = $(".bp-notes-document-layout", panel);
    const rails = $$(".bp-notes-utility-rail", panel);
    const reader = $(".bp-notes-window .bp-window-body", panel);
    if (!panel || !layout || !rails.length) return;

    // Both semantic side rails are independent scrollports. When a wheel reaches
    // either rail boundary, hand the remaining motion back to the document.
    const railWheelHandlers = rails.map(rail => {
      const handler = event => {
        if (!reader || !event.deltaY) return;
        const canScrollRail = rail.scrollHeight > rail.clientHeight + 1;
        const atTop = rail.scrollTop <= 0;
        const atBottom = rail.scrollTop + rail.clientHeight >= rail.scrollHeight - 1;
        if (!canScrollRail || (event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
          reader.scrollTop += event.deltaY;
          event.preventDefault();
        }
      };
      rail.addEventListener("wheel", handler, { passive: false });
      return [rail, handler];
    });

    // Draft.11 docks only when both semantic rails plus the requested reader
    // floor fit. Otherwise they become opposing drawers instead of squeezing the
    // document into an unreadable center strip.
    const applySize = ({ width, height }) => {
      const w = Number(width);
      const h = Number(height);
      const theme = parseThemeString(appState.preferences.themeCode) || parseThemeString(DEFAULT_THEME_CODE);
      const profile = presentationProfileById(theme.profileId);
      const requiredWidth = profile.readerMin + (profile.railWidth * 2) + (profile.gap * 2);
      const wasRail = panel.dataset.notesControlMode === "rail";
      const widthReady = wasRail ? w >= requiredWidth - 30 : w >= requiredWidth + 50;
      const heightReady = wasRail ? h >= profile.minDockHeight - 20 : h >= profile.minDockHeight + 20;
      const mode = widthReady && heightReady ? "rail" : "drawer";
      const previous = panel.dataset.notesControlMode || "";
      panel.dataset.notesControlMode = mode;
      panel.dataset.presentationProfile = profile.id;
      runtime.notesWorkbenchActive = mode === "rail";
      panel.classList.toggle("is-workbench", mode === "rail");
      if (mode !== previous && !runtime.notesTypewriterSettingsTouched) {
        setTypewriterSettingsOpen(mode === "rail");
      }
    };

    const measure = () => {
      const rect = layout.getBoundingClientRect();
      applySize({ width: rect.width, height: rect.height });
    };
    runtime.notesWorkbenchMeasure = measure;
    measure();

    const cleanupRails = () => railWheelHandlers.forEach(([rail, handler]) => rail.removeEventListener("wheel", handler));
    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(entries => {
        const rect = entries[0]?.contentRect;
        if (rect) applySize({ width: rect.width, height: rect.height });
      });
      observer.observe(layout);
      runtime.notesWorkbenchCleanup = () => {
        observer.disconnect();
        cleanupRails();
        if (runtime.notesWorkbenchMeasure === measure) runtime.notesWorkbenchMeasure = null;
      };
    } else {
      window.addEventListener("resize", measure);
      runtime.notesWorkbenchCleanup = () => {
        window.removeEventListener("resize", measure);
        cleanupRails();
        if (runtime.notesWorkbenchMeasure === measure) runtime.notesWorkbenchMeasure = null;
      };
    }
  }

  function bindNotes() {
    $$('[data-notes-tab]').forEach(button => {
      button.addEventListener("click", () => {
        if (!appState.notes.documents.some(document => document.id === button.dataset.notesTab)) return;
        appState.notes.activeId = button.dataset.notesTab;
        runtime.notesTypewriterSettingsOpen = false;
        runtime.notesTypewriterSettingsTouched = false;
        saveState();
        renderApp();
      });
    });
    $("#bpAddNotesTab")?.addEventListener("click", addEmptyDocument);
    $("#bpNotesFiles")?.addEventListener("change", event => {
      if (event.target.files?.length) loadNotesDocuments(event.target.files);
      event.target.value = "";
    });
    $("#bpCloseNote")?.addEventListener("click", closeActiveDocument);
    $("#bpTypewriterSettingsToggle")?.addEventListener("click", event => {
      runtime.notesTypewriterSettingsTouched = true;
      setTypewriterSettingsOpen(!runtime.notesTypewriterSettingsOpen);
    });
    [$("#bpTypewriterControlRailClose"), $("#bpTypewriterDataRailClose")].forEach(button => button?.addEventListener("click", () => {
      runtime.notesTypewriterSettingsTouched = true;
      setTypewriterSettingsOpen(false);
    }));
    bindTypewriterSettings();
    bindNotesWorkbench();
    startActiveTypewriter();
  }

  /***************************************************************************
   * Drawing Board rich text and permanent links
   ***************************************************************************/
  function trimURLToken(value) {
    let token = String(value || "").trim();
    let suffix = "";
    while (/[.,;:!?\)\]\}]+$/.test(token)) {
      const char = token.slice(-1);
      if ((char === ")" && token.includes("(")) || (char === "]" && token.includes("[")) || (char === "}" && token.includes("{"))) break;
      suffix = char + suffix;
      token = token.slice(0, -1);
    }
    return { token, suffix };
  }

  function normalizeURL(value) {
    const trimmed = trimURLToken(value).token;
    if (!trimmed) return "";
    const withProtocol = /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed;
    if (!/^https?:\/\//i.test(withProtocol)) return "";
    try {
      const url = new URL(withProtocol);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function linkifyText(text) {
    const raw = String(text || "");
    let html = "";
    let lastIndex = 0;
    for (const match of raw.matchAll(URL_PATTERN)) {
      const start = match.index ?? 0;
      const original = match[0];
      const { token, suffix } = trimURLToken(original);
      const href = normalizeURL(token);
      html += escapeHTML(raw.slice(lastIndex, start));
      html += href
        ? `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(token)}</a>${escapeHTML(suffix)}`
        : escapeHTML(original);
      lastIndex = start + original.length;
    }
    return `${html}${escapeHTML(raw.slice(lastIndex))}`.replace(/\n/g, "<br>");
  }

  function sanitizeRichHTML(input) {
    const raw = String(input || "");
    if (!raw) return "";
    const template = document.createElement("template");
    template.innerHTML = raw;

    function cleanNode(node, insideLink = false, verbatim = false) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (insideLink || verbatim) return escapeHTML(text);
        if (/^\s+$/.test(text)) {
          const isBlockSibling = sibling => sibling?.nodeType === Node.ELEMENT_NODE
            && RICH_BLOCK_TAGS.has(String(sibling.tagName || "").toUpperCase());
          if (isBlockSibling(node.previousSibling) || isBlockSibling(node.nextSibling)) return "";
          // Whitespace between inline runs is meaningful, but a source newline
          // should normalize to one word separator instead of an authored break.
          return escapeHTML(text.includes("\n") ? " " : text);
        }
        return linkifyText(text);
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      const tag = node.tagName.toUpperCase();
      if (["SCRIPT", "STYLE", "IFRAME", "OBJECT"].includes(tag)) return "";
      const nextVerbatim = verbatim || tag === "CODE" || tag === "PRE" || tag === "KBD";
      const children = Array.from(node.childNodes).map(child => cleanNode(child, insideLink || tag === "A", nextVerbatim)).join("");
      if (!ALLOWED_RICH_TAGS.has(tag)) return children;
      if (["BR", "HR"].includes(tag)) return `<${tag.toLowerCase()}>`;
      if (tag === "A") {
        const href = normalizeURL(node.getAttribute("href") || node.textContent || "");
        if (!href) return children || escapeHTML(node.textContent || "");
        return `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${children || escapeHTML(node.textContent || href)}</a>`;
      }
      return `<${tag.toLowerCase()}>${children}</${tag.toLowerCase()}>`;
    }

    return Array.from(template.content.childNodes).map(node => cleanNode(node)).join("");
  }

  function textFromHTML(html) {
    const container = document.createElement("div");
    container.innerHTML = sanitizeRichHTML(html);
    return container.innerText || container.textContent || "";
  }

  function linksFromText(text) {
    const links = [];
    for (const match of String(text || "").matchAll(URL_PATTERN)) {
      const { token } = trimURLToken(match[0]);
      const url = normalizeURL(token);
      if (url) links.push({ url, label: token });
    }
    return links;
  }

  // Rich clipboard HTML is authoritative. Anchor href values are collected once,
  // then anchor text is removed before scanning for naked URLs elsewhere.
  function linksFromRichHTML(html) {
    const documentFragment = new DOMParser().parseFromString(String(html || ""), "text/html");
    const links = [];
    const anchors = Array.from(documentFragment.querySelectorAll("a[href]"));
    anchors.forEach(anchor => {
      const url = normalizeURL(anchor.getAttribute("href") || "");
      if (url) links.push({ url, label: (anchor.textContent || url).trim() });
      anchor.replaceWith(documentFragment.createTextNode(" "));
    });
    links.push(...linksFromText(documentFragment.body?.textContent || ""));
    return links;
  }

  function canonicalLinkKey(value) {
    const normalized = normalizeURL(value);
    if (!normalized) return "";
    try {
      const url = new URL(normalized);
      for (const key of Array.from(url.searchParams.keys())) {
        const lower = key.toLowerCase();
        if (lower.startsWith("utm_") || TRACKING_QUERY_KEYS.has(lower)) url.searchParams.delete(key);
      }
      if ((url.protocol === "http:" && url.port === "80") || (url.protocol === "https:" && url.port === "443")) url.port = "";
      const host = url.hostname.toLowerCase();
      const port = url.port ? `:${url.port}` : "";
      return `${url.protocol.toLowerCase()}//${host}${port}${url.pathname}${url.search}${url.hash}`;
    } catch {
      return normalized;
    }
  }

  function normalizeLink(input) {
    const url = normalizeURL(input?.url || input?.href || input);
    if (!url) return null;
    const now = new Date().toISOString();
    return {
      id: String(input?.id || uid("lnk")),
      url,
      label: String(input?.label || input?.title || input?.text || url).trim().slice(0, 160),
      createdAt: input?.createdAt || now,
      lastSeenAt: input?.lastSeenAt || input?.createdAt || now
    };
  }

  function normalizeLinks(links) {
    const output = [];
    const seen = new Set();
    for (const link of Array.isArray(links) ? links : []) {
      const normalized = normalizeLink(link);
      if (!normalized) continue;
      const key = canonicalLinkKey(normalized.url);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      output.push(normalized);
    }
    return output;
  }

  function addLinks(note, candidates) {
    note.links = normalizeLinks(note.links);
    const existingByKey = new Map(note.links.map(link => [canonicalLinkKey(link.url), link]));
    let changed = false;
    for (const candidate of candidates || []) {
      const normalized = normalizeLink(candidate);
      if (!normalized) continue;
      const key = canonicalLinkKey(normalized.url);
      if (!key) continue;
      const existing = existingByKey.get(key);
      if (existing) {
        existing.lastSeenAt = new Date().toISOString();
        if ((!existing.label || existing.label === existing.url) && normalized.label) existing.label = normalized.label;
      } else {
        note.links.push(normalized);
        existingByKey.set(key, normalized);
        changed = true;
      }
    }
    return changed;
  }

  function persistBody(note, element, { sanitizeElement = false } = {}) {
    if (!note || !element) return false;
    let changed = false;
    const html = sanitizeRichHTML(element.innerHTML);
    const text = element.innerText || element.textContent || "";
    if (note.html !== html) { note.html = html; changed = true; }
    if (note.text !== text) { note.text = text; changed = true; }
    if (sanitizeElement && element.innerHTML !== html) element.innerHTML = html;
    if (changed) note.updatedAt = new Date().toISOString();
    return changed;
  }

  function persistMarkdownSource(note, element) {
    if (!note || !element) return false;
    const source = String(element.value ?? element.textContent ?? "");
    if (note.markdownSource === source && note.text === source) return false;
    note.markdownSource = source;
    note.text = source;
    note.updatedAt = new Date().toISOString();
    return true;
  }

  function persistCodeSource(note, element) {
    if (!note || !element) return false;
    const source = String(element.value ?? element.textContent ?? "");
    if (note.codeSource === source && note.text === source) return false;
    note.codeSource = source;
    note.text = source;
    note.updatedAt = new Date().toISOString();
    return true;
  }

  function normalizeAbLabel(value, fallback) {
    const cleaned = String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 32);
    return cleaned || fallback;
  }

  function abNoteText(note) {
    const aLabel = normalizeAbLabel(note?.abALabel, "A");
    const bLabel = normalizeAbLabel(note?.abBLabel, "B");
    return `${aLabel}\n${textFromHTML(note?.abAHtml || "")}\n\n${bLabel}\n${textFromHTML(note?.abBHtml || "")}`.trim();
  }

  function persistAbColumn(note, element, side, { sanitizeElement = false } = {}) {
    if (!note || !element || !["a", "b"].includes(side)) return false;
    const key = side === "a" ? "abAHtml" : "abBHtml";
    const html = sanitizeRichHTML(element.innerHTML);
    if (sanitizeElement && element.innerHTML !== html) element.innerHTML = html;
    if (note[key] === html) return false;
    note[key] = html;
    note.text = abNoteText(note);
    note.updatedAt = new Date().toISOString();
    return true;
  }

  function persistAbLabel(note, element, side, { finalize = true } = {}) {
    if (!note || !element || !["a", "b"].includes(side)) return false;
    const key = side === "a" ? "abALabel" : "abBLabel";
    const fallback = side === "a" ? "A" : "B";
    // Do not normalize on every input event. Trimming the live value made a
    // newly typed space disappear immediately, so authors could never enter
    // multi-word A/B headings. Keep the literal field value while editing and
    // normalize only when the field is committed on blur.
    const raw = String(element.value ?? element.textContent ?? "").replace(/[\r\n]+/g, " ").slice(0, 32);
    const value = finalize ? normalizeAbLabel(raw, fallback) : raw;
    if (finalize && element.value !== undefined) element.value = value;
    const previewLabel = normalizeAbLabel(value, fallback);
    const column = element.closest?.(".bp-db-ab-column-wrap")?.querySelector?.("[data-db-ab-column]");
    if (column) column.dataset.placeholder = `${previewLabel}…`;
    if (note[key] === value) return false;
    note[key] = value;
    note.text = abNoteText(note);
    note.updatedAt = new Date().toISOString();
    return true;
  }

  function normalizeTableCells(input, fallbackText = "") {
    const maxRows = 100;
    const maxCols = 24;
    let rows = Array.isArray(input) ? input : [];
    rows = rows.slice(0, maxRows).map(row => (Array.isArray(row) ? row : [row]).slice(0, maxCols).map(cell => String(cell ?? "").slice(0, 2000)));
    if (!rows.length && String(fallbackText || "").trim()) {
      rows = String(fallbackText).split(/\r?\n/).slice(0, maxRows).map(line => line.split("\t").slice(0, maxCols).map(cell => cell.slice(0, 2000)));
    }
    const cols = Math.max(2, Math.min(maxCols, Math.max(0, ...rows.map(row => row.length))));
    while (rows.length < 2) rows.push([]);
    return rows.map(row => Array.from({ length: cols }, (_, index) => String(row[index] ?? "").slice(0, 2000)));
  }

  function tableCellsText(input) {
    return normalizeTableCells(input).map(row => row.join("\t")).join("\n");
  }

  function tableCellAt(note, rowIndex, colIndex) {
    const rows = normalizeTableCells(note?.tableCells);
    return rows[rowIndex]?.[colIndex] ?? "";
  }

  function persistTableCell(note, element, rowIndex, colIndex) {
    if (!note || !element || note.contentMode !== "table") return false;
    const rows = normalizeTableCells(note.tableCells);
    if (!rows[rowIndex] || colIndex < 0 || colIndex >= rows[rowIndex].length) return false;
    const value = String(element.value ?? element.textContent ?? "").slice(0, 2000);
    if (rows[rowIndex][colIndex] === value) return false;
    rows[rowIndex][colIndex] = value;
    note.tableCells = rows;
    note.text = tableCellsText(rows);
    note.updatedAt = new Date().toISOString();
    return true;
  }

  function normalizeTodoItems(items, fallbackText = "") {
    const incoming = Array.isArray(items) ? items : [];
    const normalized = incoming.map((item, index) => ({
      id: String(item?.id || `todo-${index + 1}`),
      text: String(item?.text ?? item?.label ?? "").slice(0, 500),
      done: asBoolean(item?.done ?? item?.checked)
    }));
    if (!normalized.length && String(fallbackText || "").trim()) {
      String(fallbackText).split(/\r?\n/).map(line => line.trim()).filter(Boolean).slice(0, 40).forEach((line, index) => {
        const match = /^[-*]?\s*\[([ xX])\]\s*(.*)$/.exec(line);
        normalized.push({ id: `todo-${index + 1}`, text: (match ? match[2] : line).slice(0, 500), done: Boolean(match && match[1].toLowerCase() === "x") });
      });
    }
    return normalized.slice(0, 200);
  }

  function todoItemsText(items) {
    return normalizeTodoItems(items).map(item => `- [${item.done ? "x" : " "}] ${item.text}`).join("\n");
  }

  function todoItemById(note, itemId) {
    return Array.isArray(note?.todoItems) ? note.todoItems.find(item => item.id === itemId) || null : null;
  }

  function commitDrawingBoardBodies() {
    if (!appState?.drawingBoard?.notes) return;
    let changed = false;
    $$('[data-db-body]').forEach(element => {
      const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbBody);
      changed = persistBody(note, element) || changed;
    });
    $$('[data-db-markdown-source]').forEach(element => {
      const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbMarkdownSource);
      changed = persistMarkdownSource(note, element) || changed;
    });
    $$('[data-db-code-source]').forEach(element => {
      const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbCodeSource);
      changed = persistCodeSource(note, element) || changed;
    });
    $$('[data-db-ab-column]').forEach(element => {
      const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbAbColumn);
      changed = persistAbColumn(note, element, element.dataset.dbAbSide) || changed;
    });
    $$('[data-db-ab-label]').forEach(element => {
      const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbAbLabel);
      changed = persistAbLabel(note, element, element.dataset.dbAbSide) || changed;
    });
    $$('[data-db-table-cell]').forEach(element => {
      const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbTableCell);
      changed = persistTableCell(note, element, Number(element.dataset.dbTableRow), Number(element.dataset.dbTableCol)) || changed;
    });
    if (changed) saveState();
  }

  function insertHTMLAtCursor(html) {
    if (document.queryCommandSupported?.("insertHTML")) {
      document.execCommand("insertHTML", false, html);
      return;
    }
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const fragment = range.createContextualFragment(html);
    const lastChild = fragment.lastChild;
    range.insertNode(fragment);
    if (lastChild) {
      range.setStartAfter(lastChild);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  /***************************************************************************
   * Drawing Board geometry and state
   ***************************************************************************/
  function noteRectangle(note) {
    return { left: note.col, top: note.row, right: note.col + note.w, bottom: note.row + note.h };
  }

  function boardDimensions(board = appState?.drawingBoard, { includeNotes = true } = {}) {
    const cfg = CONFIG.drawingBoard;
    let columns = Math.max(cfg.columns, Math.round(Number(board?.columns) || cfg.columns));
    let rows = Math.max(cfg.rows, Math.round(Number(board?.rows) || cfg.rows));
    if (includeNotes && Array.isArray(board?.notes)) {
      for (const note of board.notes) {
        const col = Number(note?.col);
        const row = Number(note?.row);
        const w = Number(note?.w);
        const h = Number(note?.h);
        if ([col, row, w, h].every(Number.isFinite) && col >= 0 && row >= 0 && w > 0 && h > 0) {
          columns = Math.max(columns, Math.ceil(col + w));
          rows = Math.max(rows, Math.ceil(row + h));
        }
        if (note?.marbled && !note?.marbleRail) {
          const marbleCol = Number(note?.marbleCol);
          const marbleRow = Number(note?.marbleRow);
          if (Number.isFinite(marbleCol) && marbleCol >= 0) columns = Math.max(columns, Math.ceil(marbleCol + cfg.extentMarginCells));
          if (Number.isFinite(marbleRow) && marbleRow >= 0) rows = Math.max(rows, Math.ceil(marbleRow + cfg.extentMarginCells));
        }
      }
    }
    return {
      columns: Math.max(cfg.columns, Math.min(cfg.maxColumns, columns)),
      rows: Math.max(cfg.rows, Math.min(cfg.maxRows, rows))
    };
  }

  function ensureBoardExtentForViewport(shell, { persist = true } = {}) {
    const cfg = CONFIG.drawingBoard;
    if (!appState?.drawingBoard) return { ...boardDimensions(null), changed: false };
    const current = boardDimensions(appState.drawingBoard);
    const viewportColumns = shell ? Math.ceil(shell.clientWidth / cfg.baseRenderedCellPx) + cfg.extentMarginCells : cfg.columns;
    const viewportRows = shell ? Math.ceil(shell.clientHeight / cfg.baseRenderedCellPx) + cfg.extentMarginCells : cfg.rows;
    const columns = Math.max(current.columns, Math.min(cfg.maxColumns, viewportColumns));
    const rows = Math.max(current.rows, Math.min(cfg.maxRows, viewportRows));
    const changed = columns !== Number(appState.drawingBoard.columns) || rows !== Number(appState.drawingBoard.rows);
    if (changed) {
      appState.drawingBoard.columns = columns;
      appState.drawingBoard.rows = rows;
      if (persist) queueSaveState();
    }
    return { columns, rows, changed };
  }

  function notesOverlap(candidate, existing) {
    if (candidate?.marbled || existing?.marbled) return false;
    const cfg = CONFIG.drawingBoard;
    const a = noteRectangle(candidate);
    const b = noteRectangle(existing);
    const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (overlapX <= 0 || overlapY <= 0) return false;
    if (candidate.collapsed || existing.collapsed || candidate.h <= cfg.collapsedH || existing.h <= cfg.collapsedH) return true;
    return overlapX > cfg.maxOverlapCells && overlapY > cfg.maxOverlapCells;
  }

  function canPlaceNote(candidate, ignoreId = "", notes = appState?.drawingBoard?.notes || [], dimensions = boardDimensions()) {
    const extent = dimensions || boardDimensions();
    if (candidate.col < 0 || candidate.row < 0 || candidate.col + candidate.w > extent.columns || candidate.row + candidate.h > extent.rows) return false;
    return !notes.some(note => note.id !== ignoreId && notesOverlap(candidate, note));
  }

  // Canonical card geometry stays in logical cells. The workspace extent may
  // grow, but changing the viewport never rescales saved card coordinates.
  function normalizeNoteGeometry(note, { repair = true, dimensions = null } = {}) {
    const cfg = CONFIG.drawingBoard;
    const extent = dimensions || boardDimensions();
    const numberOr = (value, fallback) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
    note.collapsed = asBoolean(note.collapsed);
    note.w = numberOr(note.w, cfg.defaultW);
    note.expandedH = numberOr(note.expandedH, numberOr(note.h, cfg.defaultH));
    note.h = note.collapsed ? cfg.collapsedH : numberOr(note.h, note.expandedH || cfg.defaultH);
    note.col = numberOr(note.col, 0);
    note.row = numberOr(note.row, 0);

    if (repair) {
      note.w = Math.max(cfg.minW, Math.min(extent.columns, note.w || cfg.defaultW));
      note.expandedH = Math.max(cfg.minH, Math.min(extent.rows, note.expandedH || cfg.defaultH));
      note.h = note.collapsed
        ? cfg.collapsedH
        : Math.max(cfg.minH, Math.min(extent.rows, note.h || note.expandedH || cfg.defaultH));
      if (!note.collapsed) note.expandedH = note.h;
      note.col = Math.max(0, Math.min(extent.columns - note.w, note.col));
      note.row = Math.max(0, Math.min(extent.rows - note.h, note.row));
    }
    return note;
  }

  function safeNoteGeometry(note) {
    return normalizeNoteGeometry({ ...note }, { repair: true, dimensions: boardDimensions() });
  }

  function geometrySourceWarnings(note = {}) {
    const warnings = [];
    for (const key of ["col", "row", "w", "h"]) {
      if (note[key] !== undefined && !Number.isFinite(Number(note[key]))) warnings.push(`${key} was not numeric`);
    }
    return warnings;
  }

  function boardGeometryIssues(note, notes = appState?.drawingBoard?.notes || []) {
    const cfg = CONFIG.drawingBoard;
    const extent = boardDimensions();
    const issues = Array.isArray(note?.geometryWarnings) ? [...note.geometryWarnings] : [];
    const w = Number(note?.w);
    const h = Number(note?.h);
    const col = Number(note?.col);
    const row = Number(note?.row);
    if (!Number.isFinite(w) || w < cfg.minW || w > extent.columns) issues.push("invalid width");
    if (!Number.isFinite(h) || (!note?.collapsed && h < cfg.minH) || h > extent.rows) issues.push("invalid height");
    if (!Number.isFinite(col) || !Number.isFinite(row) || col < 0 || row < 0 || col + w > extent.columns || row + h > extent.rows) issues.push("outside workspace extent");
    if (Number.isFinite(col) && Number.isFinite(row) && Number.isFinite(w) && Number.isFinite(h)) {
      if (notes.some(other => other.id !== note.id && notesOverlap(note, other))) issues.push("overlap");
    }
    return [...new Set(issues)];
  }

  function boardRepairState(note) {
    const issues = boardGeometryIssues(note);
    if (note?.marbleRail === "delete") return { kind: "warn", label: "Marked", issues: [...issues, "in deletion holder"] };
    if (note?.marbleRail && isBoardHolderId(note.marbleRail)) {
      const label = holderDefinition(note.marbleRail).label;
      return { kind: issues.length ? "warn" : "ok", label, issues };
    }
    if (note?.marbleHome && note?.marbleTemporal) {
      const label = holderDefinition(note.marbleHome).label;
      return { kind: issues.length ? "warn" : "ok", label: `Temp · ${label}`, issues };
    }
    if (!issues.length) return { kind: "ok", label: note?.marbled ? "Marble" : "OK", issues };
    const blocked = issues.includes("no safe placement");
    return { kind: blocked ? "blocked" : "warn", label: blocked ? "Blocked" : "Needs attention", issues };
  }

  function sourceBoardDimensions(source = {}) {
    const cfg = CONFIG.drawingBoard;
    const version = Math.max(0, Math.round(Number(source.geometryVersion) || 0));
    const explicitColumns = Math.round(Number(source.columns) || 0);
    const explicitRows = Math.round(Number(source.rows) || 0);
    if (explicitColumns > 0 && explicitRows > 0) {
      return {
        version,
        columns: Math.max(1, Math.min(cfg.maxColumns, explicitColumns)),
        rows: Math.max(1, Math.min(cfg.maxRows, explicitRows))
      };
    }
    if (version >= 2) return { version, columns: cfg.columns, rows: cfg.rows };
    return { version, columns: cfg.legacyColumns, rows: cfg.legacyRows };
  }

  function scaleBoardValue(value, scale, fallback) {
    const numeric = Number(value);
    return Math.round((Number.isFinite(numeric) ? numeric : fallback) * scale);
  }

  function migrateNoteGeometry(note, sourceDimensions, index) {
    const cfg = CONFIG.drawingBoard;
    // v2+ already stores logical-cell coordinates. Elastic extents must not
    // rescale those cards when a wider viewport grows the workspace.
    if (sourceDimensions.version >= 2) {
      const rowFallback = index * cfg.defaultH;
      const sourceH = Number(note?.h);
      return {
        col: Number.isFinite(Number(note?.col)) ? Math.round(Number(note.col)) : 0,
        row: Number.isFinite(Number(note?.row)) ? Math.round(Number(note.row)) : rowFallback,
        w: Number.isFinite(Number(note?.w)) ? Math.round(Number(note.w)) : cfg.defaultW,
        h: Number.isFinite(sourceH) ? Math.round(sourceH) : cfg.defaultH,
        expandedH: Number.isFinite(Number(note?.expandedH)) ? Math.round(Number(note.expandedH)) : (Number.isFinite(sourceH) ? Math.round(sourceH) : cfg.defaultH)
      };
    }
    const scaleX = cfg.columns / sourceDimensions.columns;
    const scaleY = cfg.rows / sourceDimensions.rows;
    const sourceDefaultW = 4;
    const sourceDefaultH = 3;
    const sourceRow = Number.isFinite(Number(note?.row)) ? Number(note.row) : index * sourceDefaultH;
    const sourceH = Number(note?.h) || sourceDefaultH;
    const sourceExpandedH = Number(note?.expandedH) || Math.max(sourceDefaultH, sourceH);
    return {
      col: scaleBoardValue(note?.col, scaleX, 0),
      row: scaleBoardValue(sourceRow, scaleY, 0),
      w: scaleBoardValue(note?.w, scaleX, sourceDefaultW),
      h: scaleBoardValue(sourceH, scaleY, sourceDefaultH),
      expandedH: scaleBoardValue(sourceExpandedH, scaleY, sourceDefaultH)
    };
  }

  function findBoardSpace(w, h, ignoreId = "", notes = appState?.drawingBoard?.notes || [], dimensions = boardDimensions()) {
    const cfg = CONFIG.drawingBoard;
    const extent = dimensions || boardDimensions();
    const width = Math.max(cfg.minW, Math.min(extent.columns, Math.round(Number(w) || cfg.defaultW)));
    const height = Math.max(cfg.collapsedH, Math.min(extent.rows, Math.round(Number(h) || cfg.defaultH)));
    const search = step => {
      for (let row = 0; row <= extent.rows - height; row += step) {
        for (let col = 0; col <= extent.columns - width; col += step) {
          const candidate = { col, row, w: width, h: height, collapsed: height === cfg.collapsedH };
          if (canPlaceNote(candidate, ignoreId, notes, extent)) return candidate;
        }
      }
      return null;
    };
    return search(5) || search(1);
  }


  function normalizeDrawingBoardCreation(input = {}) {
    const source = input && typeof input === "object" ? input : {};
    const toneNumber = Number(source.tone);
    const tone = Number.isFinite(toneNumber) ? Math.max(0, Math.min(DRAWING_BOARD_PALETTE_SIZE - 1, Math.round(toneNumber))) : null;
    const styleIds = new Set(BOARD_CREATION_STYLES.map(item => item.id));
    const templateIds = new Set(BOARD_CREATION_TEMPLATES.map(item => item.id));
    const template = templateIds.has(source.template) ? source.template : "";
    const style = template ? "" : (styleIds.has(source.style) ? source.style : "");
    return { tone, style, template };
  }

  function normalizeHolderIdentity(id) {
    const normalized = String(id || "").trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
    // `important` is the legacy holder-state key for the permanent `park` id.
    // Treating it as an alias prevents imported/custom ids from colliding with
    // Important's persisted geometry slot.
    return normalized === "important" ? "park" : normalized;
  }

  function normalizeHolderLabel(label, fallback = "Holder") {
    return String(label || fallback).replace(/\s+/g, " ").trim().slice(0, 48) || fallback;
  }

  function normalizeHolderIcon(icon, fallback = "◆") {
    const value = Array.from(String(icon || fallback).trim()).slice(0, 6).join("");
    return value || fallback;
  }

  function normalizeDrawingBoardHolderCatalog(input = null) {
    const source = Array.isArray(input) ? input : null;
    const defaults = new Map(BOARD_HOLDERS.map(definition => [definition.id, definition]));
    const rows = source || BOARD_HOLDERS;
    const result = [];
    const seen = new Set();
    rows.forEach((item, index) => {
      const rawId = normalizeHolderIdentity(item?.id);
      if (!rawId || seen.has(rawId)) return;
      const fallback = defaults.get(rawId);
      result.push({
        id: rawId,
        label: normalizeHolderLabel(item?.label, fallback?.label || `Holder ${index + 1}`),
        icon: normalizeHolderIcon(item?.icon, fallback?.icon || "◆"),
        color: normalizeHexColor(item?.color) || "",
        protected: BOARD_PROTECTED_HOLDER_IDS.has(rawId),
        builtin: Boolean(fallback?.builtin || item?.builtin),
        destructive: rawId === "delete",
        defaultX: Number.isFinite(Number(fallback?.defaultX)) ? Number(fallback.defaultX) : Math.min(.88, .12 + ((index % 6) * .12)),
        defaultY: Number.isFinite(Number(fallback?.defaultY)) ? Number(fallback.defaultY) : Math.min(.90, .16 + (Math.floor(index / 6) * .10)),
        collapsed: item?.collapsed === undefined ? (fallback?.collapsed ?? true) : asBoolean(item.collapsed)
      });
      seen.add(rawId);
    });
    // Protected holders are persistence anchors. They are recreated if a damaged
    // import omits them, while all other deleted catalog entries stay deleted.
    ["park", "delete"].forEach(id => {
      if (seen.has(id)) return;
      const fallback = defaults.get(id);
      result.unshift({
        id,
        label: fallback.label,
        icon: fallback.icon,
        color: "",
        protected: true,
        builtin: true,
        destructive: id === "delete",
        defaultX: fallback.defaultX,
        defaultY: fallback.defaultY,
        collapsed: fallback.collapsed
      });
      seen.add(id);
    });
    return result;
  }

  function boardHolderDefinitions() {
    if (!appState?.drawingBoard) return normalizeDrawingBoardHolderCatalog();
    if (!Array.isArray(appState.drawingBoard.holderCatalog)) {
      appState.drawingBoard.holderCatalog = normalizeDrawingBoardHolderCatalog();
    } else {
      appState.drawingBoard.holderCatalog = normalizeDrawingBoardHolderCatalog(appState.drawingBoard.holderCatalog);
    }
    return appState.drawingBoard.holderCatalog;
  }

  function boardHolderIdSet(catalog = null) {
    return new Set((catalog || boardHolderDefinitions()).map(definition => definition.id));
  }

  function isBoardHolderId(holderId, catalog = null) {
    const id = normalizeHolderIdentity(holderId);
    return Boolean(id && boardHolderIdSet(catalog).has(id));
  }

  function holderDefinition(holderId, catalog = null) {
    const definitions = catalog || boardHolderDefinitions();
    return definitions.find(holder => holder.id === holderId)
      || definitions.find(holder => holder.id === "park")
      || normalizeDrawingBoardHolderCatalog()[0];
  }

  function holderStateKey(holderId) {
    return holderId === "park" ? "important" : holderId;
  }

  function holderIdFromStateKey(key) {
    return key === "important" ? "park" : key;
  }

  function normalizeDrawingBoardHolders(input = {}, catalog = null) {
    const source = input && typeof input === "object" ? input : {};
    const definitions = catalog || normalizeDrawingBoardHolderCatalog();
    const clamp01 = (value, fallback) => {
      const number = Number(value);
      return Math.max(0.02, Math.min(0.98, Number.isFinite(number) ? number : fallback));
    };
    const result = {};
    definitions.forEach((definition, index) => {
      const key = holderStateKey(definition.id);
      const raw = source[key] && typeof source[key] === "object" ? source[key] : {};
      result[key] = {
        x: clamp01(raw.x, Number(definition.defaultX) || Math.min(.88, .12 + ((index % 6) * .12))),
        y: clamp01(raw.y, Number(definition.defaultY) || Math.min(.90, .16 + (Math.floor(index / 6) * .10))),
        collapsed: raw.collapsed === undefined ? asBoolean(definition.collapsed) : asBoolean(raw.collapsed),
        docked: asBoolean(raw.docked),
        dockOrder: Math.max(1, Math.round(Number(raw.dockOrder) || (index + 1)))
      };
    });
    return result;
  }


  function createDrawingBoardHolder() {
    const catalog = boardHolderDefinitions();
    let id = uid("holder");
    const ids = new Set(catalog.map(item => item.id));
    while (ids.has(id)) id = uid("holder");
    const index = catalog.length;
    const palette = currentThemeRuntime().boardPalette || [];
    const color = palette.length ? palette[(index + 2) % palette.length].background : "#64748B";
    const definition = {
      id,
      label: `Holder ${index + 1}`,
      icon: "◆",
      color,
      protected: false,
      builtin: false,
      destructive: false,
      defaultX: Math.min(.88, .12 + ((index % 6) * .12)),
      defaultY: Math.min(.90, .16 + (Math.floor(index / 6) * .10)),
      collapsed: true
    };
    appState.drawingBoard.holderCatalog = normalizeDrawingBoardHolderCatalog([...catalog, definition]);
    appState.drawingBoard.holders = normalizeDrawingBoardHolders(appState.drawingBoard.holders, appState.drawingBoard.holderCatalog);
    runtime.boardHolderManagerFocusId = id;
    saveState();
    refreshMarbleDock();
    refreshBoardOverlayLayer();
    requestAnimationFrame(() => $(`[data-db-holder-name="${selectorEscape(id)}"]`)?.select?.());
    showToast(`${definition.label} created.`);
    return id;
  }

  function updateDrawingBoardHolder(holderId, patch = {}, { refresh = true } = {}) {
    const id = normalizeHolderIdentity(holderId);
    const catalog = boardHolderDefinitions();
    const definition = catalog.find(item => item.id === id);
    if (!definition) return false;
    if (Object.prototype.hasOwnProperty.call(patch, "label")) definition.label = normalizeHolderLabel(patch.label, definition.label);
    if (Object.prototype.hasOwnProperty.call(patch, "icon")) definition.icon = normalizeHolderIcon(patch.icon, definition.icon);
    if (Object.prototype.hasOwnProperty.call(patch, "color")) definition.color = normalizeHexColor(patch.color) || "";
    definition.protected = BOARD_PROTECTED_HOLDER_IDS.has(id);
    definition.destructive = id === "delete";
    appState.drawingBoard.holderCatalog = normalizeDrawingBoardHolderCatalog(catalog);
    saveState();
    if (refresh) {
      refreshMarbleDock();
      refreshBoardOverlayLayer();
    }
    return true;
  }

  function holderNoteReferenceCount(holderId) {
    return appState.drawingBoard.notes.filter(note => note.marbleRail === holderId || note.marbleHome === holderId).length;
  }

  function deleteDrawingBoardHolder(holderId) {
    const id = normalizeHolderIdentity(holderId);
    if (!id || BOARD_PROTECTED_HOLDER_IDS.has(id)) {
      showToast("Important and Delete are protected holders.");
      return false;
    }
    const catalog = boardHolderDefinitions();
    const definition = catalog.find(item => item.id === id);
    if (!definition) return false;
    const references = holderNoteReferenceCount(id);
    const message = references
      ? `Delete ${definition.label}? ${references} owned note${references === 1 ? "" : "s"} will be safely re-homed to Important.`
      : `Delete ${definition.label}?`;
    if (!confirm(message)) return false;

    // Ownership is id-based, never label-based. Deleting a holder performs an
    // explicit reference migration before the catalog/state entry disappears.
    // Notes therefore cannot become unreachable when a holder is renamed or
    // removed. Important is the permanent safe landing holder.
    appState.drawingBoard.notes.forEach(note => {
      if (note.marbleRail === id) {
        ensureNoteIsMarbled(note);
        note.marbleRail = "park";
        note.marbleHome = "park";
        note.marbleTemporal = false;
        note.marbleRailOrder = nextMarbleRailOrder();
        note.updatedAt = new Date().toISOString();
      } else if (note.marbleHome === id) {
        // A temporarily moved note can currently sit in another holder (even
        // Delete).  Its deleted home must still migrate to the permanent safe
        // anchor rather than adopting that temporary destination as ownership.
        note.marbleHome = "park";
        note.marbleTemporal = Boolean(note.marbleRail && note.marbleRail !== "park");
        note.updatedAt = new Date().toISOString();
      }
    });

    appState.drawingBoard.holderCatalog = normalizeDrawingBoardHolderCatalog(catalog.filter(item => item.id !== id));
    const oldKey = holderStateKey(id);
    if (appState.drawingBoard.holders && oldKey in appState.drawingBoard.holders) delete appState.drawingBoard.holders[oldKey];
    appState.drawingBoard.holders = normalizeDrawingBoardHolders(appState.drawingBoard.holders, appState.drawingBoard.holderCatalog);
    saveState();
    refreshMarbleDock();
    refreshBoardOverlayLayer();
    updateDrawingBoardCountPill();
    showToast(`${definition.label} deleted${references ? `; ${references} note${references === 1 ? "" : "s"} moved to Important` : ""}.`);
    return true;
  }

  function sortingHolderId() {
    return isBoardHolderId("unsorted") ? "unsorted" : "park";
  }


  function normalizeDrawingBoardGroups(input = [], dimensions = null) {
    const cfg = CONFIG.drawingBoard;
    const extent = dimensions || { columns: cfg.columns, rows: cfg.rows };
    const source = Array.isArray(input) ? input : [];
    return source.map((group, index) => {
      const numberOr = (value, fallback) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
      const w = Math.max(12, Math.min(cfg.maxColumns, numberOr(group?.w, cfg.creation.groupW)));
      const h = Math.max(8, Math.min(cfg.maxRows, numberOr(group?.h, cfg.creation.groupH)));
      const col = Math.max(0, numberOr(group?.col, 0));
      const row = Math.max(0, numberOr(group?.row, 0));
      const themeTone = Math.max(0, Math.min(DRAWING_BOARD_PALETTE_SIZE - 1, numberOr(group?.themeTone, index % DRAWING_BOARD_PALETTE_SIZE)));
      return {
        id: String(group?.id || uid("group")),
        title: String(group?.title || `Group ${index + 1}`).slice(0, 80),
        col,
        row,
        w,
        h,
        themeTone,
        createdAt: group?.createdAt || new Date().toISOString(),
        updatedAt: group?.updatedAt || new Date().toISOString()
      };
    });
  }

  function boardGroupById(groupId) {
    return (appState?.drawingBoard?.groups || []).find(group => group.id === groupId) || null;
  }

  function normalizeDrawingBoard(input) {
    const cfg = CONFIG.drawingBoard;
    const source = input && typeof input === "object" ? input : {};
    const sourceDimensions = sourceBoardDimensions(source);
    const initialExtent = sourceDimensions.version >= 2
      ? {
          columns: Math.max(cfg.columns, Math.min(cfg.maxColumns, sourceDimensions.columns)),
          rows: Math.max(cfg.rows, Math.min(cfg.maxRows, sourceDimensions.rows))
        }
      : { columns: cfg.columns, rows: cfg.rows };
    let holderCatalog = normalizeDrawingBoardHolderCatalog(source.holderCatalog);
    // Defensive import recovery: if a file contains an ownership id but its
    // catalog row is missing, recreate a neutral holder rather than silently
    // orphaning the note. Normal app deletion migrates references first, so a
    // recovered holder only represents inconsistent/external data.
    const referencedHolderIds = new Set();
    (Array.isArray(source.notes) ? source.notes : []).forEach(note => {
      [note?.marbleRail, note?.marbleHome].forEach(value => {
        const id = normalizeHolderIdentity(value);
        if (id) referencedHolderIds.add(id);
      });
    });
    const catalogIds = new Set(holderCatalog.map(item => item.id));
    referencedHolderIds.forEach(id => {
      if (catalogIds.has(id)) return;
      holderCatalog.push({ id, label: `Recovered ${id}`, icon: "◆", color: "", protected: BOARD_PROTECTED_HOLDER_IDS.has(id), builtin: false, destructive: id === "delete", collapsed: true });
      catalogIds.add(id);
    });
    holderCatalog = normalizeDrawingBoardHolderCatalog(holderCatalog);
    const holderIds = boardHolderIdSet(holderCatalog);
    const notes = (Array.isArray(source.notes) ? source.notes : []).map((note, index) => {
      const html = sanitizeRichHTML(note?.html || linkifyText(note?.text || ""));
      const geometry = migrateNoteGeometry(note, sourceDimensions, index);
      const sourceWarnings = geometrySourceWarnings(note);
      const legacyColor = normalizeHexColor(note?.color);
      const legacyTone = legacyColor ? NOTE_COLORS.findIndex(color => color.toUpperCase() === legacyColor.toUpperCase()) : -1;
      const requestedMode = note?.colorMode === "custom" || note?.colorMode === "theme" ? note.colorMode : "";
      const colorMode = requestedMode || (legacyTone >= 0 || !legacyColor ? "theme" : "custom");
      const incomingTone = Number(note?.themeTone);
      const fallbackTone = legacyTone >= 0 ? legacyTone : index % DRAWING_BOARD_PALETTE_SIZE;
      const themeTone = Math.max(0, Math.min(DRAWING_BOARD_PALETTE_SIZE - 1, Math.round(Number.isFinite(incomingTone) ? incomingTone : fallbackTone)));
      const requestedTextMode = note?.textColorMode === "custom" || note?.textColorMode === "auto" ? note.textColorMode : "";
      const legacyText = normalizeHexColor(note?.textColor);
      const textColorMode = requestedTextMode || (!legacyText || legacyText === "#151515" ? "auto" : "custom");
      const contentMode = normalizeBoardContentMode(note?.contentMode);
      const presentation = contentMode === "markdown" && note?.presentation === "typewriter" ? "typewriter" : "static";
      let markdownSource = String(note?.markdownSource ?? note?.markdown ?? (contentMode === "markdown" ? (note?.text || textFromHTML(html)) : ""));
      const codeSource = String(note?.codeSource ?? (contentMode === "code" ? (note?.text || "") : ""));
      const codeLanguage = String(note?.codeLanguage || "text").trim().slice(0, 32) || "text";
      const legacyTypewriterRate = Math.max(0.1, Math.min(4, Number(note?.typewriterRate) || 0.5));
      if (presentation === "typewriter") markdownSource = ensureBoardTypewriterTempoSource(markdownSource, legacyTypewriterRate);
      const typewriterRate = 1;
      const incomingMarbleRail = normalizeHolderIdentity(note?.marbleRail);
      const incomingMarbleHome = normalizeHolderIdentity(note?.marbleHome);
      const requestedMarbleRail = holderIds.has(incomingMarbleRail) ? incomingMarbleRail : "";
      const requestedMarbleHome = holderIds.has(incomingMarbleHome) ? incomingMarbleHome : "";
      const marbled = asBoolean(note?.marbled) || Boolean(requestedMarbleRail);
      const marbleCol = Number.isFinite(Number(note?.marbleCol)) ? Number(note.marbleCol) : (geometry.col + geometry.w);
      const marbleRow = Number.isFinite(Number(note?.marbleRow)) ? Number(note.marbleRow) : geometry.row;
      const marbleRail = marbled ? requestedMarbleRail : "";
      const marbleHome = marbleRail || requestedMarbleHome;
      const marbleTemporal = Boolean(marbleHome && (!marbled || marbleRail !== marbleHome));
      const marbleRailOrder = Math.max(0, Math.round(Number(note?.marbleRailOrder) || (index + 1)));
      const preMarbleCollapsed = asBoolean(note?.preMarbleCollapsed);
      const marbleAppearance = normalizeMarbleAppearance(note?.marbleMode, note?.marbleValue);
      const abAHtml = sanitizeRichHTML(note?.abAHtml || "");
      const abBHtml = sanitizeRichHTML(note?.abBHtml || "");
      const abALabel = normalizeAbLabel(note?.abALabel, "A");
      const abBLabel = normalizeAbLabel(note?.abBLabel, "B");
      const todoItems = normalizeTodoItems(note?.todoItems, contentMode === "todo" ? (note?.text || "") : "");
      const tableCells = contentMode === "table" || Array.isArray(note?.tableCells) ? normalizeTableCells(note?.tableCells, contentMode === "table" ? (note?.text || "") : "") : [];
      const tableWrap = note?.tableWrap !== false;
      const carriedWarnings = (Array.isArray(note?.geometryWarnings) ? note.geometryWarnings : []).filter(item => item !== "outside safe extent");
      const normalized = {
        id: String(note?.id || uid("card")),
        ...geometry,
        z: Number(note?.z) || index + 1,
        colorMode,
        themeTone,
        color: legacyColor || NOTE_COLORS[themeTone % NOTE_COLORS.length],
        textColorMode,
        textColor: legacyText || "#151515",
        title: String(note?.title || "Note").slice(0, 160),
        collapsed: asBoolean(note?.collapsed),
        marbled,
        marbleCol,
        marbleRow,
        marbleRail,
        marbleHome,
        marbleTemporal,
        marbleRailOrder,
        preMarbleCollapsed,
        marbleMode: marbleAppearance.mode,
        marbleValue: marbleAppearance.value,
        marbleColorA: normalizeHexColor(note?.marbleColorA) || "",
        marbleColorB: normalizeHexColor(note?.marbleColorB) || "",
        marbleAngle: Math.max(0, Math.min(360, Math.round(Number(note?.marbleAngle) || 135))),
        marbleSeed: Math.max(0, Math.min(9999, Math.round(Number(note?.marbleSeed) || 417))),
        marbleScale: Math.max(3, Math.min(64, Math.round(Number(note?.marbleScale) || 8))),
        marbleDensity: Math.max(1, Math.min(10, Math.round(Number(note?.marbleDensity) || 4))),
        contentMode,
        presentation,
        markdownSource,
        codeSource,
        codeLanguage,
        typewriterRate,
        abAHtml,
        abBHtml,
        abALabel,
        abBLabel,
        todoItems,
        tableCells,
        tableWrap,
        text: String(contentMode === "todo"
          ? todoItemsText(todoItems)
          : (contentMode === "table"
            ? tableCellsText(tableCells)
            : (note?.text || (contentMode === "markdown"
              ? markdownSource
              : (contentMode === "code"
                ? codeSource
                : (contentMode === "ab" ? `${abALabel}\n${textFromHTML(abAHtml)}\n\n${abBLabel}\n${textFromHTML(abBHtml)}`.trim() : textFromHTML(html))))))),
        html,
        links: normalizeLinks([
          ...(Array.isArray(note?.links) ? note.links : []),
          ...linksFromRichHTML(html),
          ...(contentMode === "markdown" ? linksFromText(markdownSource) : []),
          ...(contentMode === "code" ? linksFromText(codeSource) : []),
          ...(contentMode === "todo" ? linksFromText(todoItemsText(todoItems)) : []),
          ...(contentMode === "table" ? linksFromText(tableCellsText(tableCells)) : [])
        ]),
        geometryWarnings: [...new Set([...carriedWarnings, ...sourceWarnings])],
        createdAt: note?.createdAt || new Date().toISOString(),
        updatedAt: note?.updatedAt || new Date().toISOString()
      };
      return normalizeNoteGeometry(normalized, { repair: false, dimensions: initialExtent });
    });

    const groups = normalizeDrawingBoardGroups(source.groups, initialExtent);

    let columns = initialExtent.columns;
    let rows = initialExtent.rows;
    for (const note of notes) {
      const col = Number(note.col), row = Number(note.row), w = Number(note.w), h = Number(note.h);
      if ([col, row, w, h].every(Number.isFinite) && col >= 0 && row >= 0 && w > 0 && h > 0) {
        columns = Math.max(columns, Math.min(cfg.maxColumns, Math.ceil(col + w)));
        rows = Math.max(rows, Math.min(cfg.maxRows, Math.ceil(row + h)));
      }
    }

    for (const group of groups) {
      const col = Number(group.col), row = Number(group.row), w = Number(group.w), h = Number(group.h);
      if ([col, row, w, h].every(Number.isFinite) && col >= 0 && row >= 0 && w > 0 && h > 0) {
        columns = Math.max(columns, Math.min(cfg.maxColumns, Math.ceil(col + w)));
        rows = Math.max(rows, Math.min(cfg.maxRows, Math.ceil(row + h)));
      }
    }

    return {
      geometryVersion: cfg.geometryVersion,
      styleVersion: cfg.styleVersion,
      columns,
      rows,
      creation: normalizeDrawingBoardCreation(source.creation),
      holderCatalog,
      holders: normalizeDrawingBoardHolders(source.holders, holderCatalog),
      notes,
      groups,
      nextZ: Math.max(Number(source.nextZ) || 1, 1, ...notes.map(note => note.z))
    };
  }

  // Explicit recovery tool only. Rendering/responsive changes never call this.
  function repairBoardLayout({ resetSizes = false } = {}) {
    const cfg = CONFIG.drawingBoard;
    const placed = [];
    let changed = false;

    const ordered = [...appState.drawingBoard.notes].sort((a, b) => a.z - b.z);
    for (const note of ordered) {
      const before = JSON.stringify([note.col, note.row, note.w, note.h, note.collapsed, note.expandedH]);
      if (resetSizes) {
        note.w = cfg.defaultW;
        note.expandedH = cfg.defaultH;
        note.h = note.collapsed ? cfg.collapsedH : cfg.defaultH;
      }
      normalizeNoteGeometry(note);
      if (!canPlaceNote(note, note.id, placed)) {
        const spot = findBoardSpace(note.w, note.h, note.id, placed)
          || findBoardSpace(cfg.defaultW, note.collapsed ? cfg.collapsedH : cfg.defaultH, note.id, placed)
          || findBoardSpace(cfg.minW, note.collapsed ? cfg.collapsedH : cfg.defaultH, note.id, placed);
        if (spot) Object.assign(note, spot, { collapsed: note.collapsed });
      }
      note.geometryWarnings = [];
      if (before !== JSON.stringify([note.col, note.row, note.w, note.h, note.collapsed, note.expandedH])) {
        note.updatedAt = new Date().toISOString();
        changed = true;
      }
      placed.push(note);
    }

    if (!appState.drawingBoard.notes.some(note => note.id === runtime.openLinksNoteId)) runtime.openLinksNoteId = "";
    return changed;
  }

  function resetNoteSize(noteId) {
    const cfg = CONFIG.drawingBoard;
    const note = appState.drawingBoard.notes.find(item => item.id === noteId);
    if (!note) return false;
    const candidate = normalizeNoteGeometry({ ...note, collapsed: false, w: cfg.defaultW, h: cfg.defaultH, expandedH: cfg.defaultH });
    if (canPlaceNote(candidate, note.id)) {
      Object.assign(note, candidate, { geometryWarnings: [], updatedAt: new Date().toISOString() });
      return true;
    }
    const spot = findBoardSpace(cfg.defaultW, cfg.defaultH, note.id) || findBoardSpace(cfg.minW, cfg.defaultH, note.id);
    if (!spot) return false;
    Object.assign(note, spot, { collapsed: false, expandedH: cfg.defaultH, geometryWarnings: [], updatedAt: new Date().toISOString() });
    return true;
  }

  function toggleNoteCollapsed(noteId) {
    const cfg = CONFIG.drawingBoard;
    const note = appState.drawingBoard.notes.find(item => item.id === noteId);
    if (!note) return false;

    if (!note.collapsed) {
      note.expandedH = Math.max(cfg.minH, Number(note.h) || cfg.defaultH);
      note.collapsed = true;
      note.h = cfg.collapsedH;
      normalizeNoteGeometry(note);
      note.updatedAt = new Date().toISOString();
      return true;
    }

    const desiredH = Math.max(cfg.minH, Math.min(boardDimensions().rows, Number(note.expandedH) || cfg.defaultH));
    const candidate = normalizeNoteGeometry({ ...note, collapsed: false, h: desiredH, expandedH: desiredH });
    if (canPlaceNote(candidate, note.id)) {
      Object.assign(note, candidate, { updatedAt: new Date().toISOString() });
      return true;
    }
    const spot = findBoardSpace(note.w, desiredH, note.id) || findBoardSpace(cfg.minW, desiredH, note.id);
    if (spot) {
      Object.assign(note, spot, { collapsed: false, expandedH: desiredH, updatedAt: new Date().toISOString() });
      return true;
    }
    showToast("No open space to expand this card. Move it or use Repair Layout.");
    return false;
  }

  function toggleNoteMarbled(noteId, force = null) {
    const cfg = CONFIG.drawingBoard;
    const note = boardNoteById(noteId);
    if (!note) return false;
    const next = force === null ? !note.marbled : Boolean(force);
    if (next === Boolean(note.marbled)) return false;
    if (!next) {
      if (note.marbleRail) return false;
      return restoreMarbleNear(noteId, note.marbleCol, note.marbleRow);
    }

    const safe = safeNoteGeometry(note);
    note.preMarbleCollapsed = Boolean(note.collapsed);
    const anchorInsetCells = cfg.marbleAnchorInsetPx / Math.max(1, Number(runtime.boardView.cellPx) || cfg.baseRenderedCellPx);
    note.marbleCol = Math.max(0, safe.col + safe.w - anchorInsetCells);
    note.marbleRow = Math.max(0, safe.row + safe.h - anchorInsetCells);
    note.marbleRail = "";
    note.marbleRailOrder = 0;
    note.marbleTemporal = Boolean(note.marbleHome);
    note.marbled = true;
    if (runtime.boardTypewriterNoteId === note.id) destroyBoardTypewriter();
    runtime.boardMarkdownEditingIds.delete(note.id);
    if (runtime.boardCardSettingsNoteId === note.id) runtime.boardCardSettingsNoteId = "";
    if (runtime.openLinksNoteId === note.id) runtime.openLinksNoteId = "";
    note.updatedAt = new Date().toISOString();
    saveState();
    replaceDrawingBoardNoteElement(note.id);
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    return true;
  }

  function formatBoardTempo(value = 0.5) {
    const number = Math.max(0.1, Math.min(4, Number(value) || 0.5));
    return String(Math.round(number * 100) / 100);
  }

  function ensureBoardTypewriterTempoSource(source, fallbackRate = 0.5) {
    const markdown = String(source || "");
    if (/<!--\s*tempo\s*:/i.test(markdown)) return markdown;
    const command = `<!--tempo:${formatBoardTempo(fallbackRate)}-->`;
    return markdown ? `${command}\n${markdown}` : `${command}\n# Typewriter <!--HeadingLine-->\n\nStart writing…`;
  }

  function boardCreationState() {
    if (!appState.drawingBoard.creation) appState.drawingBoard.creation = normalizeDrawingBoardCreation();
    appState.drawingBoard.creation = normalizeDrawingBoardCreation(appState.drawingBoard.creation);
    return appState.drawingBoard.creation;
  }

  function boardCreationBlueprint(style = "", template = "") {
    const cfg = CONFIG.drawingBoard;
    const sizes = cfg.creation;
    if (template === "api-doc") {
      const source = `<!--tempo:0.5-->
# API Documentation <!--HeadingLine-->

Use this card as a living API note. Replace the placeholders while preserving the Typewriter commands you want to demonstrate.

## Endpoint <!--HeadingLine-->

\`GET /v1/resource\`

## Request <!--HeadingLine-->

\`\`\`json id=api-request title="Request"
{
  "parameter": "value"
}
\`\`\`

## Response <!--HeadingLine-->

\`\`\`json id=api-response title="Response"
{
  "ok": true,
  "data": {}
}
\`\`\`

Runtime: <!--SlotRotation:idle|requesting|resolved|reviewing-->`;
      return { title: "API Documentation", contentMode: "markdown", presentation: "typewriter", typewriterRate: 1, markdownSource: source, text: source, html: "", abAHtml: "", abBHtml: "", w: sizes.apiW, h: sizes.apiH };
    }
    if (template === "quote-loop") {
      const source = `<!--tempo:0.5-->
# Quote Loop <!--HeadingLine-->

> “<!--SlotRotation:Replace this with your first quote.|Add a second quote after the pipe.|Keep extending the rotation with more entries.-->”
>
> — Source

The heading line draws the holder first; SlotRotation keeps the quote text alive inside it.`;
      return { title: "Quote Loop", contentMode: "markdown", presentation: "typewriter", typewriterRate: 1, markdownSource: source, text: source, html: "", abAHtml: "", abBHtml: "", w: sizes.quoteW, h: sizes.quoteH };
    }

    if (style === "markdown") {
      const source = "# Note\n\nStart writing…";
      return { title: "Markdown", contentMode: "markdown", presentation: "static", markdownSource: source, text: source, html: "", abAHtml: "", abBHtml: "", w: sizes.markdownW, h: sizes.markdownH };
    }
    if (style === "code") {
      const source = "// code";
      return { title: "Terminal", contentMode: "code", presentation: "static", markdownSource: "", codeSource: source, codeLanguage: "text", text: source, html: "", abAHtml: "", abBHtml: "", w: sizes.codeW, h: sizes.codeH };
    }
    if (style === "typewriter") {
      const source = "<!--tempo:0.5-->\n# Typewriter <!--HeadingLine-->\n\nStart writing…";
      return { title: "Typewriter", contentMode: "markdown", presentation: "typewriter", typewriterRate: 1, markdownSource: source, text: source, html: "", abAHtml: "", abBHtml: "", w: sizes.typewriterW, h: sizes.typewriterH };
    }
    if (style === "ab") {
      return { title: "A / B", contentMode: "ab", presentation: "static", markdownSource: "", text: "A\n\nB", html: "", abAHtml: "", abBHtml: "", abALabel: "A", abBLabel: "B", w: sizes.abW, h: sizes.abH };
    }
    if (style === "todo") {
      const todoItems = [
        { id: "todo-1", text: "First task", done: false },
        { id: "todo-2", text: "Completed example", done: true }
      ];
      return { title: "To Do", contentMode: "todo", presentation: "static", markdownSource: "", text: todoItemsText(todoItems), html: "", abAHtml: "", abBHtml: "", todoItems, w: sizes.todoW, h: sizes.todoH };
    }
    if (style === "table") {
      const tableCells = [["", ""], ["", ""]];
      return { title: "Table", contentMode: "table", presentation: "static", markdownSource: "", text: tableCellsText(tableCells), html: "", abAHtml: "", abBHtml: "", tableCells, tableWrap: true, w: sizes.tableW, h: sizes.tableH };
    }
    const html = linkifyText("New note");
    return { title: "Note", contentMode: "rich", presentation: "static", markdownSource: "", text: "New note", html, abAHtml: "", abBHtml: "", w: sizes.textW, h: sizes.textH };
  }

  function growBoardForRectangle(col, row, w, h) {
    const cfg = CONFIG.drawingBoard;
    const extent = boardDimensions();
    const columns = Math.min(cfg.maxColumns, Math.max(extent.columns, Math.ceil(col + w + cfg.extentMarginCells)));
    const rows = Math.min(cfg.maxRows, Math.max(extent.rows, Math.ceil(row + h + cfg.extentMarginCells)));
    const changed = columns !== extent.columns || rows !== extent.rows;
    appState.drawingBoard.columns = columns;
    appState.drawingBoard.rows = rows;
    if (changed) {
      const board = $("#bpDrawingBoardGrid");
      if (board) {
        const cellPx = Math.max(1, Number(runtime.boardView.cellPx) || cfg.baseRenderedCellPx);
        board.style.setProperty("--bp-db-cols", String(columns));
        board.style.setProperty("--bp-db-rows", String(rows));
        board.style.setProperty("--bp-db-board-width", `${columns * cellPx}px`);
        board.style.setProperty("--bp-db-board-height", `${rows * cellPx}px`);
      }
    }
    return { columns, rows };
  }

  function canPlaceNoteWithGrowth(candidate, ignoreId = "") {
    if (candidate.col < 0 || candidate.row < 0) return false;
    const notes = appState?.drawingBoard?.notes || [];
    if (notes.some(note => note.id !== ignoreId && notesOverlap(candidate, note))) return false;
    const extent = growBoardForRectangle(candidate.col, candidate.row, candidate.w, candidate.h);
    return canPlaceNote(candidate, ignoreId, notes, extent);
  }

  function noteDropCandidateState(candidate, ignoreId = "") {
    const cfg = CONFIG.drawingBoard;
    const notes = appState?.drawingBoard?.notes || [];
    const outside = candidate.col < 0 || candidate.row < 0
      || candidate.col + candidate.w > cfg.maxColumns
      || candidate.row + candidate.h > cfg.maxRows;
    if (outside) return { valid: false, reason: "outside" };
    const blockedBy = notes.find(note => note.id !== ignoreId && notesOverlap(candidate, note));
    return blockedBy ? { valid: false, reason: "overlap", blockedBy: blockedBy.id } : { valid: true, reason: "clear" };
  }

  function createNoteDropShadow(board, note) {
    if (!board || !note) return null;
    const ghost = document.createElement("div");
    ghost.className = "bp-db-note-drop-shadow is-valid";
    ghost.setAttribute("aria-hidden", "true");
    ghost.dataset.dbDropShadowFor = note.id;
    board.appendChild(ghost);
    return ghost;
  }

  function syncNoteDropShadow(ghost, candidate, state) {
    if (!ghost || !candidate) return;
    const cellPx = Math.max(1, Number(runtime.boardView.cellPx) || CONFIG.drawingBoard.baseRenderedCellPx);
    const valid = Boolean(state?.valid);
    ghost.style.left = `${candidate.col * cellPx}px`;
    ghost.style.top = `${candidate.row * cellPx}px`;
    ghost.style.width = `${candidate.w * cellPx}px`;
    ghost.style.height = `${candidate.h * cellPx}px`;
    ghost.classList.toggle("is-valid", valid);
    ghost.classList.toggle("is-invalid", !valid);
    ghost.dataset.dbDropState = valid ? "valid" : "invalid";
    ghost.dataset.dbDropLabel = valid
      ? "✓ PLACE"
      : (state?.reason === "outside" ? "× OUTSIDE BOARD" : "× BLOCKED");
  }

  function findBoardSpaceNear(w, h, preferredCol, preferredRow) {
    const cfg = CONFIG.drawingBoard;
    const extent = boardDimensions();
    const width = Math.max(cfg.minW, Math.min(extent.columns, Math.round(Number(w) || cfg.defaultW)));
    const height = Math.max(cfg.minH, Math.min(extent.rows, Math.round(Number(h) || cfg.defaultH)));
    const maxCol = Math.max(0, extent.columns - width);
    const maxRow = Math.max(0, extent.rows - height);
    const baseCol = Math.max(0, Math.min(maxCol, Math.round(Number(preferredCol) || 0)));
    const baseRow = Math.max(0, Math.min(maxRow, Math.round(Number(preferredRow) || 0)));
    const direct = { col: baseCol, row: baseRow, w: width, h: height, collapsed: false };
    if (canPlaceNote(direct)) return direct;

    const searchRadius = Math.min(36, Math.max(extent.columns, extent.rows));
    for (let radius = 1; radius <= searchRadius; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
          const col = Math.max(0, Math.min(maxCol, baseCol + dx));
          const row = Math.max(0, Math.min(maxRow, baseRow + dy));
          const candidate = { col, row, w: width, h: height, collapsed: false };
          if (canPlaceNote(candidate)) return candidate;
        }
      }
    }
    return null;
  }

  function resolveBoardCreationRequest(payload = {}) {
    const selected = boardCreationState();
    const payloadTone = Number(payload.tone);
    const tone = Number.isFinite(payloadTone)
      ? Math.max(0, Math.min(DRAWING_BOARD_PALETTE_SIZE - 1, Math.round(payloadTone)))
      : (selected.tone === null ? 0 : selected.tone);
    const styleIds = new Set(BOARD_CREATION_STYLES.map(item => item.id));
    const templateIds = new Set(BOARD_CREATION_TEMPLATES.map(item => item.id));
    let style = styleIds.has(payload.style) ? payload.style : selected.style;
    let template = templateIds.has(payload.template) ? payload.template : selected.template;
    if (payload.kind === "style") template = "";
    if (payload.kind === "template") style = "";
    if (!style && !template) style = "text";
    return { tone, style, template };
  }

  function createDrawingBoardGroup({ request, boardPoint = null } = {}) {
    const cfg = CONFIG.drawingBoard;
    const tone = Math.max(0, Math.min(DRAWING_BOARD_PALETTE_SIZE - 1, Number(request?.tone) || 0));
    const w = cfg.creation.groupW;
    const h = cfg.creation.groupH;
    const point = boardPoint || { col: Math.round(boardDimensions().columns * 0.5), row: Math.round(boardDimensions().rows * 0.4) };
    const col = Math.max(0, Math.round(Number(point.col) - (w / 2)));
    const row = Math.max(0, Math.round(Number(point.row) - (h / 2)));
    growBoardForRectangle(col, row, w, h);
    if (!Array.isArray(appState.drawingBoard.groups)) appState.drawingBoard.groups = [];
    const now = new Date().toISOString();
    const group = {
      id: uid("group"),
      title: `Group ${appState.drawingBoard.groups.length + 1}`,
      col, row, w, h,
      themeTone: tone,
      createdAt: now,
      updatedAt: now
    };
    appState.drawingBoard.groups.push(group);
    saveState();
    applyBoardView({ preserveCenter: true });
    replaceDrawingBoardGroupElement(group.id);
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    showToast(`${group.title} created. Drag to move; resize from its bottom-right corner.`);
    return group;
  }

  function deleteDrawingBoardGroup(groupId) {
    const group = boardGroupById(groupId);
    if (!group) return false;
    appState.drawingBoard.groups = (appState.drawingBoard.groups || []).filter(item => item.id !== groupId);
    $(`[data-db-group-id="${selectorEscape(groupId)}"]`)?.remove();
    saveState();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    return true;
  }

  function startBoardGroupPointer(event, groupId, mode = "move") {
    const group = boardGroupById(groupId);
    const board = $("#bpDrawingBoardGrid");
    const element = $(`[data-db-group-id="${selectorEscape(groupId)}"]`, board);
    if (!group || !board || !element) return false;
    event.preventDefault();
    event.stopPropagation();
    const cellPx = Math.max(1, Number(runtime.boardView.cellPx) || CONFIG.drawingBoard.baseRenderedCellPx);
    const startX = event.clientX;
    const startY = event.clientY;
    const original = { col: group.col, row: group.row, w: group.w, h: group.h };
    let moved = false;
    element.classList.add("is-dragging");
    try { element.setPointerCapture?.(event.pointerId); } catch (_) {}

    const onMove = moveEvent => {
      const dx = Math.round((moveEvent.clientX - startX) / cellPx);
      const dy = Math.round((moveEvent.clientY - startY) / cellPx);
      if (!moved && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 2) return;
      moved = true;
      moveEvent.preventDefault();
      if (mode === "resize") {
        group.w = Math.max(12, Math.min(CONFIG.drawingBoard.maxColumns - group.col, original.w + dx));
        group.h = Math.max(8, Math.min(CONFIG.drawingBoard.maxRows - group.row, original.h + dy));
      } else {
        group.col = Math.max(0, Math.min(CONFIG.drawingBoard.maxColumns - group.w, original.col + dx));
        group.row = Math.max(0, Math.min(CONFIG.drawingBoard.maxRows - group.h, original.row + dy));
      }
      syncDrawingBoardGroupElement(group);
    };
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      element.classList.remove("is-dragging");
      if (!moved) return;
      growBoardForRectangle(group.col, group.row, group.w, group.h);
      group.updatedAt = new Date().toISOString();
      saveState();
      applyBoardView({ preserveCenter: true });
      refreshBoardOverlayLayer();
    };
    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointercancel", onUp, { once: true });
    return true;
  }

  function createDrawingBoardNote({ payload = {}, boardPoint = null } = {}) {
    commitDrawingBoardBodies();
    flushPendingSave();
    const cfg = CONFIG.drawingBoard;
    const request = resolveBoardCreationRequest(payload);
    if (request.style === "group") return createDrawingBoardGroup({ request, boardPoint });
    const blueprint = boardCreationBlueprint(request.style, request.template);
    let spot = null;

    if (boardPoint) {
      const preferredCol = Math.round(Number(boardPoint.col) - (blueprint.w / 2));
      const preferredRow = Math.round(Number(boardPoint.row) - (blueprint.h / 2));
      growBoardForRectangle(Math.max(0, preferredCol), Math.max(0, preferredRow), blueprint.w, blueprint.h);
      spot = findBoardSpaceNear(blueprint.w, blueprint.h, preferredCol, preferredRow);
    }

    if (!spot) spot = findBoardSpace(blueprint.w, blueprint.h) || findBoardSpace(Math.max(cfg.minW, blueprint.w), blueprint.h);
    if (!spot) {
      const extent = boardDimensions();
      if (extent.rows < cfg.maxRows) {
        appState.drawingBoard.rows = Math.min(cfg.maxRows, extent.rows + blueprint.h + cfg.extentMarginCells);
        spot = findBoardSpace(blueprint.w, blueprint.h) || findBoardSpace(cfg.minW, blueprint.h);
      }
      if (!spot && boardDimensions().columns < cfg.maxColumns) {
        appState.drawingBoard.columns = Math.min(cfg.maxColumns, boardDimensions().columns + blueprint.w + cfg.extentMarginCells);
        spot = findBoardSpace(blueprint.w, blueprint.h) || findBoardSpace(cfg.minW, blueprint.h);
      }
    }

    spot ||= { col: 0, row: 0, w: blueprint.w, h: blueprint.h, collapsed: false };
    const crowded = !canPlaceNote(spot);
    if (appState.drawingBoard.nextZ > 420) normalizeBoardZOrder();
    appState.drawingBoard.nextZ += 1;
    const now = new Date().toISOString();
    const note = {
      id: uid("card"),
      ...spot,
      z: appState.drawingBoard.nextZ,
      colorMode: "theme",
      themeTone: request.tone,
      color: NOTE_COLORS[request.tone % NOTE_COLORS.length],
      textColorMode: "auto",
      textColor: "#151515",
      title: blueprint.title,
      collapsed: false,
      expandedH: spot.h,
      contentMode: blueprint.contentMode,
      presentation: blueprint.presentation,
      markdownSource: blueprint.markdownSource || "",
      codeSource: blueprint.codeSource || "",
      codeLanguage: blueprint.codeLanguage || "text",
      typewriterRate: 1,
      marbled: false,
      marbleCol: spot.col + spot.w,
      marbleRow: spot.row,
      marbleRail: "",
      marbleHome: "",
      marbleTemporal: false,
      marbleRailOrder: 0,
      preMarbleCollapsed: false,
      marbleMode: "auto",
      marbleValue: "",
      marbleColorA: "",
      marbleColorB: "",
      marbleAngle: 135,
      marbleSeed: 417,
      marbleScale: 8,
      marbleDensity: 4,
      abAHtml: blueprint.abAHtml,
      abBHtml: blueprint.abBHtml,
      abALabel: normalizeAbLabel(blueprint.abALabel, "A"),
      abBLabel: normalizeAbLabel(blueprint.abBLabel, "B"),
      todoItems: normalizeTodoItems(blueprint.todoItems, blueprint.contentMode === "todo" ? blueprint.text : ""),
      tableCells: blueprint.contentMode === "table" ? normalizeTableCells(blueprint.tableCells, blueprint.text) : [],
      tableWrap: blueprint.tableWrap !== false,
      geometryWarnings: crowded ? ["overlap"] : [],
      text: blueprint.text,
      html: blueprint.html,
      links: [],
      createdAt: now,
      updatedAt: now
    };
    appState.drawingBoard.notes.push(note);
    saveState();
    applyBoardView({ preserveCenter: true });
    refreshDrawingBoardAfterMutation({ addedNoteId: note.id });
    setBoardSelection(note.id);
    if (note.presentation === "typewriter") {
      runtime.boardMarkdownEditingIds.delete(note.id);
      requestAnimationFrame(() => activateBoardTypewriter(note.id, { replay: true }));
    }
    if (crowded) {
      runtime.boardRepairOpen = true;
      runtime.boardRepairTargetId = note.id;
      refreshBoardOverlayLayer();
      showToast("The requested drop area was crowded; the note was created and flagged for repair.");
    }
    return note;
  }

  function addDrawingBoardNote() {
    return createDrawingBoardNote();
  }

  /***************************************************************************
   * Drawing Board rendering and interaction
   ***************************************************************************/
  function renderBoardMarkdown(source) {
    const markdown = String(source || "");
    try {
      const parsed = typeof window.marked?.parse === "function" ? window.marked.parse(markdown) : `<pre><code>${escapeHTML(markdown)}</code></pre>`;
      return sanitizeRichHTML(parsed);
    } catch (error) {
      console.warn(error);
      return `<pre><code>${escapeHTML(markdown)}</code></pre>`;
    }
  }

  function resolvedDrawingBoardGroupStyle(group) {
    const palette = currentThemeRuntime().boardPalette;
    const tone = Math.max(0, Math.min(palette.length - 1, Math.round(Number(group?.themeTone) || 0)));
    return palette[tone] || palette[0];
  }

  function renderDrawingBoardGroup(group) {
    const visual = resolvedDrawingBoardGroupStyle(group);
    return `<section class="bp-db-area-group" data-db-group-id="${escapeHTML(group.id)}" data-db-group-drag="${escapeHTML(group.id)}"
      style="left:${group.col * runtime.boardView.cellPx}px;top:${group.row * runtime.boardView.cellPx}px;width:${group.w * runtime.boardView.cellPx}px;height:${group.h * runtime.boardView.cellPx}px;--bp-db-group-color:${escapeHTML(visual.background)};--bp-db-group-text:${escapeHTML(visual.text)};"
      aria-label="${escapeHTML(group.title || "Group")} area group" title="Drag to move · resize from the bottom-right corner">
      <span class="bp-db-area-group-title">${escapeHTML(group.title || "Group")}</span>
      <span class="bp-db-area-group-resize" data-db-group-resize="${escapeHTML(group.id)}" aria-hidden="true"></span>
    </section>`;
  }

  function syncDrawingBoardGroupElement(group) {
    const element = $(`[data-db-group-id="${selectorEscape(group.id)}"]`);
    if (!element) return;
    const cellPx = Math.max(1, Number(runtime.boardView.cellPx) || CONFIG.drawingBoard.baseRenderedCellPx);
    element.style.left = `${group.col * cellPx}px`;
    element.style.top = `${group.row * cellPx}px`;
    element.style.width = `${group.w * cellPx}px`;
    element.style.height = `${group.h * cellPx}px`;
    const visual = resolvedDrawingBoardGroupStyle(group);
    element.style.setProperty("--bp-db-group-color", visual.background);
    element.style.setProperty("--bp-db-group-text", visual.text);
  }

  function replaceDrawingBoardGroupElement(groupId) {
    const group = boardGroupById(groupId);
    const board = $("#bpDrawingBoardGrid");
    if (!board || !group) return null;
    const current = $(`[data-db-group-id="${selectorEscape(groupId)}"]`, board);
    const template = document.createElement("template");
    template.innerHTML = renderDrawingBoardGroup(group).trim();
    const next = template.content.firstElementChild;
    if (!next) return null;
    if (current) current.replaceWith(next);
    else board.prepend(next);
    return next;
  }

  function renderDrawingBoardCreationPalette() {
    const creation = boardCreationState();
    const palette = currentThemeRuntime().boardPalette;
    const selectedStyle = creation.style || "";
    const selectedTemplate = creation.template || "";
    const selectedColourLabel = creation.tone === null ? "Theme default" : (BOARD_CREATION_COLOR_NAMES[creation.tone] || `Colour ${creation.tone + 1}`);
    const selectedStyleLabel = selectedTemplate
      ? BOARD_CREATION_TEMPLATES.find(item => item.id === selectedTemplate)?.label || "Template"
      : (BOARD_CREATION_STYLES.find(item => item.id === selectedStyle)?.label || "Text note (default)");
    const expanded = runtime.boardCreationPaletteExpanded;

    return `
      <aside id="bpDbCreationPalette" class="bp-db-creation-palette${expanded ? " is-expanded" : ""}" aria-label="Drawing Board creation palette">
        <div class="bp-db-palette-colours" role="group" aria-label="Note colours">
          ${palette.map((tone, index) => `
            <button type="button" draggable="true" class="bp-ui-spatial bp-db-palette-swatch${creation.tone === index ? " is-selected" : ""}" data-db-create-color="${index}" title="${escapeHTML(BOARD_CREATION_COLOR_NAMES[index] || `Colour ${index + 1}`)} · click to select, drag to create" aria-label="${escapeHTML(BOARD_CREATION_COLOR_NAMES[index] || `Colour ${index + 1}`)}" style="--bp-db-palette-swatch:${escapeHTML(tone.background)};--bp-db-palette-swatch-text:${escapeHTML(tone.text)}"><span aria-hidden="true"></span></button>
          `).join("")}
        </div>
        <div class="bp-db-palette-divider" aria-hidden="true"></div>
        <div class="bp-db-palette-options" role="group" aria-label="Note creation styles">
          ${BOARD_CREATION_STYLES.map(item => `
            <button type="button" draggable="true" class="bp-ui-spatial bp-db-palette-option${selectedStyle === item.id && !selectedTemplate ? " is-selected" : ""}" data-db-create-style="${escapeHTML(item.id)}" title="${escapeHTML(item.label)} · click to select, drag to create" aria-label="${escapeHTML(item.label)}"><span aria-hidden="true">${escapeHTML(item.icon)}</span></button>
          `).join("")}
        </div>
        <div class="bp-db-palette-divider" aria-hidden="true"></div>
        <div class="bp-db-palette-templates" role="group" aria-label="Saved note templates">
          ${BOARD_CREATION_TEMPLATES.map(item => `
            <button type="button" draggable="true" class="bp-ui-spatial bp-db-palette-option bp-db-palette-template${selectedTemplate === item.id ? " is-selected" : ""}" data-db-create-template="${escapeHTML(item.id)}" title="${escapeHTML(item.label)} · ${escapeHTML(item.category)} · click to select, drag to create" aria-label="${escapeHTML(item.label)}"><span aria-hidden="true">${escapeHTML(item.icon)}</span></button>
          `).join("")}
        </div>
        <div class="bp-db-palette-divider" aria-hidden="true"></div>
        <div class="bp-db-holder-dock-spacer" aria-hidden="true"></div>
        ${renderDockedHolderToolbar()}
        <button type="button" class="bp-ui-spatial bp-db-palette-caret" data-db-palette-expand title="${expanded ? "Collapse Drawing Board creation settings" : "Expand Drawing Board creation settings"}" aria-label="${expanded ? "Collapse Drawing Board creation settings" : "Expand Drawing Board creation settings"}" aria-expanded="${expanded}"><span aria-hidden="true">${expanded ? "◂" : "▸"}</span></button>
        ${expanded ? `
          <div class="bp-db-creation-drawer" aria-label="Drawing Board creation settings">
            <header><strong>Creation palette</strong><small>Drag paint, a style, or a saved template onto the canvas.</small></header>
            <div class="bp-db-creation-status"><span>Colour</span><b>${escapeHTML(selectedColourLabel)}</b><span>Generator</span><b>${escapeHTML(selectedStyleLabel)}</b></div>
            <section>
              <strong>Styles</strong>
              <div class="bp-db-creation-labelled-grid">
                ${BOARD_CREATION_STYLES.map(item => `<button type="button" class="${selectedStyle === item.id && !selectedTemplate ? "is-selected" : ""}" data-db-create-style="${escapeHTML(item.id)}"><span>${escapeHTML(item.icon)}</span><b>${escapeHTML(item.label)}</b></button>`).join("")}
              </div>
            </section>
            <section>
              <strong>Saved templates</strong>
              <small>Typewriter effects</small>
              <div class="bp-db-creation-labelled-grid">
                ${BOARD_CREATION_TEMPLATES.map(item => `<button type="button" class="${selectedTemplate === item.id ? "is-selected" : ""}" data-db-create-template="${escapeHTML(item.id)}"><span>${escapeHTML(item.icon)}</span><b>${escapeHTML(item.label)}</b></button>`).join("")}
              </div>
            </section>
            <button type="button" class="bp-db-creation-clear" data-db-create-clear>Clear generator selections</button>
            <p>Nothing selected = Theme colour + Text note. Dragging a colour uses the selected generator; dragging a style/template uses the selected colour.</p>
          </div>` : ""}
      </aside>`;
  }

  function refreshDrawingBoardCreationPalette() {
    const current = $("#bpDbCreationPalette");
    if (!current) return;
    const template = document.createElement("template");
    template.innerHTML = renderDrawingBoardCreationPalette().trim();
    const next = template.content.firstElementChild;
    if (next) current.replaceWith(next);
  }

  function renderSavedLinksInspector() {
    const note = appState.drawingBoard.notes.find(item => item.id === runtime.openLinksNoteId);
    if (!note) return "";
    const links = normalizeLinks(note.links);
    return `
      <aside id="bpDbLinksInspector" class="bp-db-links-inspector" data-db-links-inspector="${escapeHTML(note.id)}" aria-label="Saved links inspector">
        <div class="bp-db-links-title">
          <div><strong>Saved links</strong><small>${escapeHTML(note.title || "Note")}</small></div>
          <div class="bp-db-links-title-actions">
            <span>${links.length}</span>
            <button type="button" class="bp-ui-utility bp-db-mini-button" data-db-links-close title="Close links inspector" aria-label="Close links inspector">×</button>
          </div>
        </div>
        <div class="bp-db-links-tools">
          <button type="button" data-db-reset-size="${escapeHTML(note.id)}" title="Restore this note to the default safe size">Safe resize</button>
        </div>
        ${links.length ? `
          <div class="bp-db-links-list">
            ${links.map(link => `
              <div class="bp-db-link-row">
                <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHTML(link.url)}">${escapeHTML(link.label || link.url)}</a>
                <button type="button" class="bp-ui-utility bp-db-mini-button" data-db-link-delete="${escapeHTML(note.id)}" data-db-link-id="${escapeHTML(link.id)}" title="Delete saved link" aria-label="Delete saved link">×</button>
              </div>
            `).join("")}
          </div>
        ` : "<p>No links saved yet. Paste a link in this note to capture it permanently.</p>"}
      </aside>
    `;
  }

  function renderRepairNavigator() {
    if (!runtime.boardRepairOpen) return "";
    const filter = String(runtime.boardRepairFilter || "").trim().toLowerCase();
    const notes = [...appState.drawingBoard.notes].sort((a, b) => (a.title || "").localeCompare(b.title || "") || a.z - b.z);
    const groups = [...(appState.drawingBoard.groups || [])].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    const marked = notes.filter(note => note.marbleRail === "delete");
    const targetId = runtime.boardRepairTargetId;
    return `
      <aside id="bpDbRepairPanel" class="bp-db-repair-panel" aria-label="Drawing Board navigator and repair panel">
        <div class="bp-db-repair-heading">
          <div class="bp-db-repair-titleline">
            <strong>Navigate / Repair</strong>
            <small>${notes.length} notes${groups.length ? ` · ${groups.length} group${groups.length === 1 ? "" : "s"}` : ""}</small>
          </div>
          <button type="button" class="bp-ui-utility bp-db-mini-button" data-db-repair-close title="Close navigator" aria-label="Close navigator">×</button>
        </div>
        <input class="bp-db-repair-search" data-db-repair-search type="search" value="${escapeHTML(runtime.boardRepairFilter)}" placeholder="Filter notes…" aria-label="Filter Drawing Board notes" />
        <div class="bp-db-repair-list">
          ${marked.length ? `
            <div class="bp-db-repair-section-heading is-danger-section">
              <strong>Marked for deletion</strong><small>${marked.length}</small>
              <button type="button" class="is-danger" data-db-delete-all-marked>Delete all</button>
            </div>
            <div class="bp-db-repair-admin-list bp-db-marked-list" aria-label="Marked for deletion">
              ${marked.map(note => {
                const visual = resolvedDrawingBoardNoteStyle(note);
                return `<div class="bp-db-repair-admin-row bp-db-marked-row" data-note-id="${escapeHTML(note.id)}">
                  <span class="bp-db-marked-dot" style="--bp-db-note-bg:${escapeHTML(visual.background)};--bp-db-note-text:${escapeHTML(visual.text)}" aria-hidden="true"></span>
                  <span title="${escapeHTML(note.title || "Note")}">${escapeHTML(note.title || "Note")}</span>
                  <button type="button" data-db-marked-restore="${escapeHTML(note.id)}">Restore</button>
                  <button type="button" class="is-danger" data-db-marked-delete="${escapeHTML(note.id)}">Delete</button>
                </div>`;
              }).join("")}
            </div>` : ""}
          ${groups.length ? `
            <div class="bp-db-repair-section-heading">
              <strong>Groups</strong><small>${groups.length} · move / resize on canvas</small>
            </div>
            <div class="bp-db-repair-admin-list bp-db-group-admin-list" aria-label="Board groups">
              ${groups.map(group => {
                const visual = resolvedDrawingBoardGroupStyle(group);
                return `<div class="bp-db-repair-admin-row bp-db-group-admin-row">
                  <span class="bp-db-group-admin-dot" style="--bp-db-group-color:${escapeHTML(visual.background)}" aria-hidden="true"></span>
                  <span title="${escapeHTML(group.title || "Group")}">${escapeHTML(group.title || "Group")}</span>
                  <small>${group.w}×${group.h}</small>
                  <button type="button" data-db-group-rename="${escapeHTML(group.id)}">Rename</button>
                  <button type="button" class="is-danger" data-db-group-delete="${escapeHTML(group.id)}">Delete</button>
                </div>`;
              }).join("")}
            </div>` : ""}
          <div class="bp-db-repair-section-heading bp-db-repair-notes-heading">
            <strong>Notes</strong><small>${notes.length}</small>
          </div>
          ${notes.map(note => {
            const state = boardRepairState(note);
            const matches = !filter || String(note.title || "Note").toLowerCase().includes(filter);
            const open = targetId === note.id;
            const markedForDeletion = note.marbleRail === "delete";
            const orphan = note.marbled && !note.marbleHome && !note.marbleRail;
            const issueText = state.issues.length ? state.issues.join(" · ") : "safe";
            return `
              <details class="bp-db-repair-row" data-db-repair-row="${escapeHTML(note.id)}" data-db-repair-title="${escapeHTML(String(note.title || "Note").toLowerCase())}" data-db-repair-state="${state.kind}"${open ? " open" : ""}${matches ? "" : " hidden"}>
                <summary data-db-repair-select="${escapeHTML(note.id)}">
                  <span>${escapeHTML(note.title || "Note")}</span>
                  <small>${escapeHTML(state.label)}</small>
                </summary>
                <div class="bp-db-repair-meta">
                  <span>${note.col},${note.row}</span><span>${note.w}×${note.h}</span><span class="bp-db-repair-issues">${escapeHTML(issueText)}</span>
                </div>
                <div class="bp-db-repair-actions">
                  <button type="button" data-db-repair-action="rename" data-note-id="${escapeHTML(note.id)}" title="Rename note">Rename</button>
                  ${markedForDeletion
                    ? `<button type="button" data-db-repair-action="unmark" data-note-id="${escapeHTML(note.id)}">Restore</button>
                       <button type="button" class="is-danger" data-db-repair-action="delete-permanent" data-note-id="${escapeHTML(note.id)}">Delete permanently</button>`
                    : `<button type="button" data-db-repair-action="centre" data-note-id="${escapeHTML(note.id)}" title="Centre View">Centre</button>
                       <button type="button" data-db-repair-action="origin" data-note-id="${escapeHTML(note.id)}" title="Move to 0,0">0,0</button>
                       <button type="button" data-db-repair-action="resize" data-note-id="${escapeHTML(note.id)}" title="Safe resize to default">Resize</button>
                       <button type="button" data-db-repair-action="duplicate" data-note-id="${escapeHTML(note.id)}" title="Duplicate at 0,0">Duplicate</button>
                       <button type="button" data-db-repair-action="front" data-note-id="${escapeHTML(note.id)}" title="Bring to front">Front</button>
                       ${orphan ? `<button type="button" data-db-repair-action="sort-orphan" data-note-id="${escapeHTML(note.id)}" title="Add orphan to ${escapeHTML(holderDefinition(sortingHolderId()).label)}">Sort</button>` : ""}
                       <button type="button" class="is-danger" data-db-repair-action="mark-delete" data-note-id="${escapeHTML(note.id)}">Mark delete</button>`}
                </div>
              </details>`;
          }).join("") || "<p class=\"bp-db-repair-empty\">No notes on this board yet.</p>"}
        </div>
      </aside>`;
  }

  function renderHolderManager() {
    if (!runtime.boardHolderManagerOpen) return "";
    const definitions = boardHolderDefinitions();
    return `<aside id="bpDbHolderManager" class="bp-db-holder-manager" aria-label="Holder manager">
      <div class="bp-db-holder-manager-head">
        <div><strong>Holders</strong><small>Stable ids keep note ownership safe through rename, recolour, and icon changes.</small></div>
        <button type="button" class="bp-ui-utility bp-db-mini-button" data-db-holder-manager-close title="Close holder manager" aria-label="Close holder manager">×</button>
      </div>
      <div class="bp-db-holder-manager-list">
        ${definitions.map(definition => {
          const owned = holderNoteReferenceCount(definition.id);
          const protectedHolder = BOARD_PROTECTED_HOLDER_IDS.has(definition.id);
          const color = resolvedHolderColor(definition);
          return `<div class="bp-db-holder-manager-row${protectedHolder ? " is-protected" : ""}" data-db-holder-manager-row="${escapeHTML(definition.id)}" style="--bp-db-holder-color:${escapeHTML(color)};--bp-db-holder-text:${escapeHTML(contrastText(color))}">
            <input class="bp-ui-field bp-db-holder-manager-color" type="color" value="${escapeHTML(color)}" data-db-holder-color="${escapeHTML(definition.id)}" title="Holder colour" aria-label="${escapeHTML(definition.label)} holder colour">
            <input class="bp-ui-field bp-db-holder-manager-icon" type="text" maxlength="12" value="${escapeHTML(definition.icon)}" data-db-holder-icon="${escapeHTML(definition.id)}" title="Holder icon" aria-label="${escapeHTML(definition.label)} holder icon">
            <label class="bp-db-holder-manager-name"><span>Name</span><input class="bp-ui-field" type="text" maxlength="48" value="${escapeHTML(definition.label)}" data-db-holder-name="${escapeHTML(definition.id)}"></label>
            <small class="bp-db-holder-manager-count">${owned} note${owned === 1 ? "" : "s"}</small>
            ${protectedHolder
              ? `<span class="bp-db-holder-manager-lock" title="This holder is required and cannot be deleted">Protected</span>`
              : `<button type="button" class="bp-ui-utility bp-db-holder-manager-delete" data-db-holder-delete="${escapeHTML(definition.id)}" title="Delete holder; owned notes will move to Important" aria-label="Delete ${escapeHTML(definition.label)} holder">×</button>`}
            <code title="Persistent holder id">${escapeHTML(definition.id)}</code>
          </div>`;
        }).join("")}
      </div>
      <div class="bp-db-holder-manager-foot">
        <button type="button" class="bp-ui-action" data-db-holder-create>＋ New holder</button>
        <small>Renaming never changes ownership references. Deleting a non-protected holder migrates its notes to Important before removal.</small>
      </div>
    </aside>`;
  }

  function renderBoardOverlayLayer() {
    const repair = renderRepairNavigator();
    const links = renderSavedLinksInspector();
    const style = renderDrawingBoardStyleLab();
    const holders = renderHolderManager();
    return `<div id="bpDbOverlayLayer" class="bp-db-overlay-layer${repair ? " has-repair" : ""}${style ? " has-style-lab" : ""}${holders ? " has-holder-manager" : ""}">${repair}${links}${style}${holders}</div>`;
  }

  function renderBoardCodeNoteBody(note) {
    return `<div class="bp-db-note-body bp-db-code-terminal" aria-label="Terminal code note">
      <div class="bp-db-code-bar">
        <span><b>&gt;_</b><input type="text" maxlength="32" value="${escapeHTML(note.codeLanguage || "text")}" data-db-code-language="${escapeHTML(note.id)}" aria-label="Code language" spellcheck="false"></span>
        <button type="button" data-db-code-copy="${escapeHTML(note.id)}" title="Copy code to clipboard">Copy</button>
      </div>
      <textarea class="bp-db-code-editor" data-db-code-source="${escapeHTML(note.id)}" spellcheck="false" aria-label="Code source for ${escapeHTML(note.title || "Code")}">${escapeHTML(note.codeSource || "")}</textarea>
    </div>`;
  }

  function renderBoardAbNoteBody(note) {
    const aLabel = normalizeAbLabel(note?.abALabel, "A");
    const bLabel = normalizeAbLabel(note?.abBLabel, "B");
    return `<div class="bp-db-note-body bp-db-ab-body" aria-label="A/B comparison note">
      <section class="bp-db-ab-column-wrap" data-db-ab-role="a"><input class="bp-ui-field bp-db-ab-label" type="text" maxlength="32" value="${escapeHTML(aLabel)}" data-db-ab-label="${escapeHTML(note.id)}" data-db-ab-side="a" aria-label="Left A/B section title"><div class="bp-db-ab-column" contenteditable="true" spellcheck="true" data-db-ab-column="${escapeHTML(note.id)}" data-db-ab-side="a" data-placeholder="${escapeHTML(aLabel)}…">${sanitizeRichHTML(note.abAHtml || "")}</div></section>
      <section class="bp-db-ab-column-wrap" data-db-ab-role="b"><input class="bp-ui-field bp-db-ab-label" type="text" maxlength="32" value="${escapeHTML(bLabel)}" data-db-ab-label="${escapeHTML(note.id)}" data-db-ab-side="b" aria-label="Right A/B section title"><div class="bp-db-ab-column" contenteditable="true" spellcheck="true" data-db-ab-column="${escapeHTML(note.id)}" data-db-ab-side="b" data-placeholder="${escapeHTML(bLabel)}…">${sanitizeRichHTML(note.abBHtml || "")}</div></section>
    </div>`;
  }

  function renderBoardTableNoteBody(note) {
    const rows = normalizeTableCells(note?.tableCells);
    const cols = rows[0]?.length || 2;
    const wrap = note?.tableWrap !== false;
    return `<div class="bp-db-note-body bp-db-table-body${wrap ? " is-wrap" : " is-nowrap"}" aria-label="Table note">
      <div class="bp-db-table-sheet">
        <div class="bp-db-table-grid" style="--bp-db-table-cols:${cols}" role="grid" aria-rowcount="${rows.length}" aria-colcount="${cols}">${rows.map((row, rowIndex) => row.map((cell, colIndex) => `<textarea class="bp-ui-field bp-db-table-cell" data-db-table-cell="${escapeHTML(note.id)}" data-db-table-row="${rowIndex}" data-db-table-col="${colIndex}" ${wrap ? 'wrap="soft"' : 'wrap="off"'} aria-label="Table row ${rowIndex + 1}, column ${colIndex + 1}">${escapeHTML(cell)}</textarea>`).join("")).join("")}</div>
        ${cols > 1 ? `<button type="button" class="bp-ui-spatial bp-db-table-edge-add bp-db-table-remove-col" data-db-table-remove-col="${escapeHTML(note.id)}" title="Remove rightmost column" aria-label="Remove rightmost column">−</button>` : ""}
        <button type="button" class="bp-ui-spatial bp-db-table-edge-add bp-db-table-add-col" data-db-table-add-col="${escapeHTML(note.id)}" title="Add column to the right" aria-label="Add column to the right">＋</button>
        ${rows.length > 1 ? `<button type="button" class="bp-ui-spatial bp-db-table-edge-add bp-db-table-remove-row" data-db-table-remove-row="${escapeHTML(note.id)}" title="Remove bottom row" aria-label="Remove bottom row">−</button>` : ""}
        <button type="button" class="bp-ui-spatial bp-db-table-edge-add bp-db-table-add-row" data-db-table-add-row="${escapeHTML(note.id)}" title="Add row below" aria-label="Add row below">＋</button>
      </div>
    </div>`;
  }

  function renderBoardTodoNoteBody(note) {
    const items = normalizeTodoItems(note.todoItems);
    return `<div class="bp-db-note-body bp-db-todo-body" aria-label="To Do list note">
      <div class="bp-db-todo-list">${items.map(item => `<div class="bp-db-todo-row${item.done ? " is-done" : ""}" data-db-todo-row="${escapeHTML(item.id)}">
        <input type="checkbox" data-db-todo-check="${escapeHTML(note.id)}" data-db-todo-item="${escapeHTML(item.id)}" ${item.done ? "checked" : ""} aria-label="Mark task ${item.done ? "incomplete" : "complete"}">
        <input type="text" class="bp-ui-field bp-db-todo-text" data-db-todo-text="${escapeHTML(note.id)}" data-db-todo-item="${escapeHTML(item.id)}" value="${escapeHTML(item.text)}" placeholder="Task…" aria-label="Task text">
        <button type="button" class="bp-ui-utility bp-db-todo-delete" data-db-todo-delete="${escapeHTML(note.id)}" data-db-todo-item="${escapeHTML(item.id)}" title="Delete task" aria-label="Delete task">×</button>
      </div>`).join("")}</div>
      <button type="button" class="bp-ui-action bp-db-todo-add" data-db-todo-add="${escapeHTML(note.id)}">＋ Add task</button>
    </div>`;
  }

  function renderBoardRichNoteBody(note) {
    return `<div class="bp-db-note-body" contenteditable="true" spellcheck="true" data-db-body="${escapeHTML(note.id)}">${sanitizeRichHTML(note.html || linkifyText(note.text))}</div>`;
  }

  function renderBoardMarkdownNoteBody(note) {
    const editing = runtime.boardMarkdownEditingIds.has(note.id);
    if (editing) {
      return `<textarea class="bp-db-note-body bp-db-markdown-editor" data-db-markdown-source="${escapeHTML(note.id)}" spellcheck="false" aria-label="Markdown source for ${escapeHTML(note.title || "Note")}">${escapeHTML(note.markdownSource || "")}</textarea>`;
    }
    const isLive = note.presentation === "typewriter" && runtime.boardTypewriterNoteId === note.id;
    if (note.presentation === "typewriter") {
      const content = isLive
        ? `<div class="bp-db-note-body bp-db-markdown-preview bp-db-typewriter-output bp-typewriter-output markdown-output" data-db-typewriter-output="${escapeHTML(note.id)}" data-db-activate-typewriter="${escapeHTML(note.id)}" aria-live="polite"></div>`
        : `<div class="bp-db-note-body bp-db-markdown-preview is-typewriter-idle" data-db-activate-typewriter="${escapeHTML(note.id)}">${renderBoardMarkdown(note.markdownSource)}</div>`;
      return `<div class="bp-db-typewriter-frame">${content}</div>`;
    }
    return `<div class="bp-db-note-body bp-db-markdown-preview" data-db-activate-typewriter="${escapeHTML(note.id)}">${renderBoardMarkdown(note.markdownSource)}</div>`;
  }

  const BOARD_NOTE_BODY_RENDERERS = Object.freeze({
    rich: renderBoardRichNoteBody,
    markdown: renderBoardMarkdownNoteBody,
    code: renderBoardCodeNoteBody,
    ab: renderBoardAbNoteBody,
    todo: renderBoardTodoNoteBody,
    table: renderBoardTableNoteBody
  });

  function renderDrawingBoardBody(note) {
    const mode = normalizeBoardContentMode(note?.contentMode);
    return (BOARD_NOTE_BODY_RENDERERS[mode] || BOARD_NOTE_BODY_RENDERERS.rich)(note);
  }

  function boardContentModeLabel(mode) {
    return boardNoteTypeDefinition(mode).label;
  }

  function renderDrawingBoardCardSettings(note) {
    if (runtime.boardCardSettingsNoteId !== note.id) return "";
    const markdown = note.contentMode === "markdown";
    const typewriter = markdown && note.presentation === "typewriter";
    return `
      <aside class="bp-db-card-settings bp-db-card-settings-compact" data-db-settings-panel="${escapeHTML(note.id)}" aria-label="Card settings for ${escapeHTML(note.title || "Note")}">
        <div class="bp-db-card-settings-head">
          <strong>Card settings</strong>
          <button type="button" class="bp-ui-utility bp-db-mini-button" data-db-settings-close="${escapeHTML(note.id)}" title="Close card settings" aria-label="Close card settings">×</button>
        </div>
        <label class="bp-db-settings-convert">
          <span>Change Note into:</span>
          <select class="bp-ui-field" data-db-content-select="${escapeHTML(note.id)}" aria-label="Change note type">
            ${BOARD_NOTE_TYPES.map(definition => `<option value="${definition.id}"${note.contentMode === definition.id ? " selected" : ""}>${escapeHTML(definition.label)}</option>`).join("")}
          </select>
        </label>
        ${markdown ? `<label class="bp-db-settings-playback-toggle"><input type="checkbox" data-db-typewriter-toggle="${escapeHTML(note.id)}" ${typewriter ? "checked" : ""}><span>Typewriter playback</span></label>` : ""}
        <button type="button" class="bp-ui-action bp-db-open-style-lab" data-db-style-open="${escapeHTML(note.id)}"><span>◈</span><b>Style &amp; Marble…</b></button>
        <small class="bp-db-settings-risk">Changing note type rewrites its presentation/source. Styling does not.</small>
      </aside>`;
  }

  function boardMarbleKind(note) {
    const definition = boardNoteTypeDefinition(note?.contentMode);
    return definition.supportsTypewriter && note?.presentation === "typewriter" ? "typewriter" : definition.marbleKind;
  }

  function boardMarbleGlyph(note) {
    const definition = boardNoteTypeDefinition(note?.contentMode);
    return definition.supportsTypewriter && note?.presentation === "typewriter" ? "" : definition.marbleGlyph;
  }

  function renderMarbleCoreMarkup(note) {
    const appearance = resolvedMarbleAppearance(note);
    const kind = boardMarbleKind(note);
    if (appearance.mode === "glyph") {
      return `<span class="bp-db-marble-core" aria-hidden="true">${escapeHTML(appearance.glyph)}</span>`;
    }
    if (appearance.mode !== "auto") return `<span class="bp-db-marble-core" aria-hidden="true"></span>`;
    if (kind === "typewriter") {
      return `<span class="bp-db-marble-core bp-db-marble-typewriter-core" data-db-marble-title="${escapeHTML(note.title || "Typewriter")}" aria-hidden="true"></span>`;
    }
    if (kind === "code") {
      return `<span class="bp-db-marble-core bp-db-marble-code-core" aria-hidden="true"><b>&gt;</b><i>_</i></span>`;
    }
    if (kind === "ab") return `<span class="bp-db-marble-core" aria-hidden="true">A/B</span>`;
    if (kind === "todo") return `<span class="bp-db-marble-core" aria-hidden="true">☑</span>`;
    if (kind === "table") return `<span class="bp-db-marble-core" aria-hidden="true">▦</span>`;
    return `<span class="bp-db-marble-core" aria-hidden="true"></span>`;
  }

  function renderStyleMarblePresets(note, mode) {
    const appearance = normalizeMarbleAppearance(note?.marbleMode, note?.marbleValue);
    let items = [];
    if (mode === "glyph") items = MARBLE_GLYPH_PRESETS.map(value => ({ value, label: value, title: `Glyph ${value}` }));
    else if (mode === "pattern") items = MARBLE_PATTERN_PRESETS.map(item => ({ value: item.id, label: "", title: item.label, sample: item.fill }));
    else if (mode === "gradient") items = MARBLE_GRADIENT_PRESETS.map(item => ({ value: item.id, label: "", title: item.label, sample: item.fill }));
    if (!items.length) return "";
    return `<div class="bp-db-style-marble-presets" role="group" aria-label="${escapeHTML(mode)} presets">${items.map(item => {
      const sampleStyle = item.sample ? ` style="--bp-db-marble-face:${escapeHTML(item.sample)}"` : "";
      return `<button type="button" class="bp-ui-spatial bp-db-marble-preset${appearance.mode === mode && appearance.value === item.value ? " is-active" : ""}" data-db-style-marble-value="${escapeHTML(item.value)}" data-note-id="${escapeHTML(note.id)}" title="${escapeHTML(item.title)}" aria-label="${escapeHTML(item.title)}"${sampleStyle}><span>${escapeHTML(item.label)}</span></button>`;
    }).join("")}</div>`;
  }

  function renderDrawingBoardStyleLab() {
    const note = boardNoteById(runtime.boardStyleNoteId);
    if (!note) return "";
    const visual = resolvedDrawingBoardNoteStyle(note);
    const appearance = resolvedMarbleAppearance(note);
    const custom = marbleCustomColours(note);
    const palette = currentThemeRuntime().boardPalette;
    const mode = appearance.mode;
    const previewStyle = appearance.fill ? `--bp-db-marble-face:${appearance.fill};` : "";
    const kind = boardMarbleKind(note);
    const x = Math.max(0.08, Math.min(0.92, Number(runtime.boardStyleWindow?.x) || 0.64));
    const y = Math.max(0.08, Math.min(0.92, Number(runtime.boardStyleWindow?.y) || 0.18));
    return `<aside id="bpDbStyleLab" class="bp-db-style-lab" tabindex="-1" data-db-style-note="${escapeHTML(note.id)}" style="left:${(x * 100).toFixed(2)}%;top:${(y * 100).toFixed(2)}%;" aria-label="Style and marble editor for ${escapeHTML(note.title || "Note")}">
      <header class="bp-db-style-lab-head" data-db-style-drag>
        <span class="bp-db-style-grip" aria-hidden="true">⠿</span><div><strong>Style</strong><small>${escapeHTML(note.title || "Note")}</small></div>
        <button type="button" class="bp-ui-utility bp-db-mini-button" data-db-style-close title="Close style window" aria-label="Close style window">×</button>
      </header>
      <div class="bp-db-style-lab-body">
        <section class="bp-db-style-section">
          <div class="bp-db-style-section-title"><strong>Theme palette</strong><small>Same calculated tones as Theme Creator</small></div>
          <div class="bp-db-style-theme-swatches">${palette.map((tone, index) => `<button type="button" class="bp-ui-spatial${visual.linked && visual.tone === index ? " is-active" : ""}" data-db-style-tone="${index}" data-note-id="${escapeHTML(note.id)}" style="--swatch:${escapeHTML(tone.background)};--swatch-text:${escapeHTML(tone.text)}" title="Theme tone ${index + 1} · ${escapeHTML(tone.background)}" aria-label="Use theme tone ${index + 1}, ${escapeHTML(tone.background)}"><i aria-hidden="true" style="background:${escapeHTML(tone.background)}"></i></button>`).join("")}</div>
          <div class="bp-db-style-colour-row">
            <label><span>Background</span><input class="bp-ui-field" type="color" data-db-style-background="${escapeHTML(note.id)}" value="${escapeHTML(visual.background)}"></label>
            <button type="button" class="bp-ui-action bp-db-style-theme-reset${visual.linked ? " is-active" : ""}" data-db-style-theme-reset="${escapeHTML(note.id)}" aria-pressed="${visual.linked ? "true" : "false"}" title="${visual.linked ? `Theme-linked · tone ${visual.tone + 1}` : `Return background to Theme tone ${visual.tone + 1}`}">${visual.linked ? "Theme ✓" : "Theme ◆"}</button>
          </div>
          <label class="bp-db-style-readable"><input type="checkbox" data-db-style-readable="${escapeHTML(note.id)}" ${note.textColorMode !== "custom" ? "checked" : ""}><span>Always readable text</span></label>
          <label class="bp-db-style-text-picker${note.textColorMode !== "custom" ? " is-auto" : ""}"><span>Text</span><input class="bp-ui-field" type="color" data-db-style-text="${escapeHTML(note.id)}" value="${escapeHTML(visual.text)}" ${note.textColorMode !== "custom" ? "disabled" : ""}></label>
        </section>
        <section class="bp-db-style-section bp-db-style-marble-section">
          <div class="bp-db-style-section-title"><strong>Marble</strong><small>Auto animates by note kind; custom faces stay literal.</small></div>
          <div class="bp-db-style-marble-top">
            <div class="bp-db-style-marble-preview" data-db-marble-kind="${escapeHTML(kind)}" data-db-marble-mode="${escapeHTML(mode)}" style="--bp-db-note-bg:${escapeHTML(visual.background)};--bp-db-note-text:${escapeHTML(visual.text)};${escapeHTML(previewStyle)}">${renderMarbleCoreMarkup(note)}</div>
            <div class="bp-db-style-marble-modes" role="group" aria-label="Marble appearance mode">
              ${MARBLE_MODES.map(item => `<button type="button" class="bp-ui-action${mode === item ? " is-active" : ""}" data-db-style-marble-mode="${escapeHTML(item)}" data-note-id="${escapeHTML(note.id)}">${item === "auto" ? "Auto" : (item === "glyph" ? "Glyph" : (item === "gradient" ? "Gradient" : item[0].toUpperCase() + item.slice(1)))}</button>`).join("")}
            </div>
          </div>
          ${mode === "auto" ? `<p class="bp-db-style-help">Rich text = solid pool ball · Markdown = stripes · Typewriter = title typing · Code = terminal prompt.</p>` : ""}
          ${renderStyleMarblePresets(note, mode)}
          ${mode === "glyph" ? `<label class="bp-db-style-glyph-custom"><span>Glyph</span><input class="bp-ui-field" type="text" maxlength="16" data-db-style-glyph="${escapeHTML(note.id)}" value="${escapeHTML(appearance.value)}" placeholder="Letter, symbol or emoji"></label>` : ""}
          ${mode === "pattern" || mode === "gradient" ? `<div class="bp-db-style-marble-colours bp-db-style-procedural">
            <label><span>A</span><input class="bp-ui-field" type="color" data-db-style-marble-a="${escapeHTML(note.id)}" value="${escapeHTML(custom.a || visual.background)}"></label>
            <label><span>B</span><input class="bp-ui-field" type="color" data-db-style-marble-b="${escapeHTML(note.id)}" value="${escapeHTML(custom.b || visual.text)}"></label>
            <label class="bp-db-style-angle"><span>Angle <b data-db-style-angle-readout>${custom.angle}°</b></span><input class="bp-ui-field" type="range" min="0" max="360" step="5" value="${custom.angle}" data-db-style-marble-angle="${escapeHTML(note.id)}"></label>
            <label class="bp-db-style-angle"><span>Scale <b data-db-style-scale-readout>${custom.scale}</b></span><input class="bp-ui-field" type="range" min="3" max="64" step="1" value="${custom.scale}" data-db-style-marble-scale="${escapeHTML(note.id)}"></label>
            <label class="bp-db-style-angle"><span>Density <b data-db-style-density-readout>${custom.density}</b></span><input class="bp-ui-field" type="range" min="1" max="10" step="1" value="${custom.density}" data-db-style-marble-density="${escapeHTML(note.id)}"></label>
            <div class="bp-db-style-procedural-actions"><button type="button" class="bp-ui-action" data-db-style-marble-generate="${escapeHTML(note.id)}" title="Generate another geometry variant while keeping theme-safe colours">↻ Generate · ${String(custom.seed).padStart(4, "0")}</button><button type="button" class="bp-ui-action" data-db-style-marble-clear-colours="${escapeHTML(note.id)}" title="Return this face to theme-derived colours">Theme colours</button></div>
          </div>` : ""}
        </section>
      </div>
    </aside>`;
  }

  function holderIconMarkup(rail) {
    const definition = holderDefinition(rail);
    const legacy = BOARD_HOLDERS.find(item => item.id === rail);
    const usingDefaultIcon = Boolean(legacy && definition.icon === legacy.icon);
    if (rail === "delete" && usingDefaultIcon) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l-1 13H8L7 7Zm2-3h6l1 2H8l1-2Zm1 6v7m4-7v7"/></svg>`;
    if (rail === "park" && usingDefaultIcon) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8l-1 5 3 3v2h-5v6l-1 3-1-3v-6H6v-2l3-3-1-5Z"/></svg>`;
    return `<span class="bp-db-holder-glyph" aria-hidden="true">${escapeHTML(definition.icon)}</span>`;
  }

  function resolvedHolderColor(definition) {
    const literal = normalizeHexColor(definition?.color);
    if (literal) return literal;
    const theme = currentThemeRuntime();
    const vars = theme.variables;
    if (definition?.id === "park") return normalizeHexColor(vars["--bp-accent"]) || theme.boardPalette[0]?.background || "#F0C45A";
    if (definition?.id === "delete") return mixHex(normalizeHexColor(vars["--bp-accent"]) || "#D9485F", "#D9485F", .68);
    const definitions = boardHolderDefinitions();
    const index = Math.max(0, definitions.findIndex(item => item.id === definition?.id));
    const palette = theme.boardPalette || [];
    return palette.length ? palette[(index + 2) % palette.length].background : (normalizeHexColor(vars["--bp-surface-source"]) || "#64748B");
  }

  function holderStyleVariables(definition) {
    const color = resolvedHolderColor(definition);
    const theme = currentThemeRuntime();
    const panelDeep = normalizeHexColor(theme.variables?.["--bp-panel-deep"]) || "#111827";
    const toggleBackground = mixHex(color, panelDeep, definition?.id === "delete" ? .70 : .58);
    const drawerBackground = mixHex(color, panelDeep, definition?.id === "delete" ? .70 : .84);
    const text = ensureContrast(contrastText(toggleBackground), toggleBackground, 4.5);
    const drawerText = ensureContrast(contrastText(drawerBackground), drawerBackground, 4.5);
    return `--bp-db-holder-color:${color};--bp-db-holder-surface:${toggleBackground};--bp-db-holder-drawer-surface:${drawerBackground};--bp-db-holder-text:${text};--bp-db-holder-drawer-text:${drawerText};`;
  }

  function marbleRailNotes(rail) {
    return appState.drawingBoard.notes
      .filter(note => note.marbled && note.marbleRail === rail)
      .sort((a, b) => (Number(a.marbleRailOrder) || 0) - (Number(b.marbleRailOrder) || 0) || a.z - b.z);
  }

  function holderOwnedNotes(rail, { temporalOnly = false } = {}) {
    return appState.drawingBoard.notes.filter(note => {
      if (note.marbleHome !== rail) return false;
      return temporalOnly ? Boolean(note.marbleTemporal || note.marbleRail !== rail || !note.marbled) : true;
    });
  }

  function nextMarbleRailOrder() {
    return Math.max(0, ...appState.drawingBoard.notes.map(note => Number(note.marbleRailOrder) || 0)) + 1;
  }

  function nextHolderDockOrder() {
    const holders = normalizeDrawingBoardHolders(appState.drawingBoard.holders, boardHolderDefinitions());
    return Math.max(0, ...Object.values(holders).map(holder => Number(holder.dockOrder) || 0)) + 1;
  }

  function renderRailMarble(note, rail) {
    const visual = resolvedDrawingBoardNoteStyle(note);
    // Use the resolved palette values directly. Root --bp-note-tone-* tokens remain
    // available for other consumers, but cards/holder marbles should render the
    // same values shown in the Style palette even during theme/profile changes.
    const backgroundValue = visual.background;
    const textValue = visual.text;
    const marbleKind = boardMarbleKind(note);
    const selected = runtime.boardSelectedNoteId === note.id || runtime.boardRepairTargetId === note.id;
    const locked = rail === "delete";
    const marble = marbleAppearanceAttrs(note);
    const definition = holderDefinition(rail);
    return `<button type="button" class="bp-ui-spatial bp-db-rail-marble${selected ? " is-selected" : ""}${locked ? " is-delete-marked" : ""}${marble.appearance.mode !== "auto" ? " has-custom-marble" : ""}"
      data-note-id="${escapeHTML(note.id)}" data-db-rail-marble-drag="${escapeHTML(note.id)}" data-db-rail="${escapeHTML(rail)}" data-db-marble-kind="${escapeHTML(marbleKind)}" data-db-marble-mode="${escapeHTML(marble.appearance.mode)}" data-db-marble-value="${escapeHTML(marble.appearance.value)}"
      style="--bp-db-note-bg:${escapeHTML(backgroundValue)};--bp-db-note-text:${escapeHTML(textValue)};${escapeHTML(marble.style)}"
      title="${escapeHTML(note.title || "Note")} · ${locked ? "marked for deletion · drag out to recover" : `${definition.label} holder · drag out or double-click to open nearby`}"
      aria-label="${escapeHTML(note.title || "Note")} ${escapeHTML(definition.label)} marble">
      ${renderMarbleCoreMarkup(note)}
    </button>`;
  }

  function boardHolderState(rail) {
    const definitions = boardHolderDefinitions();
    if (!appState.drawingBoard.holders) appState.drawingBoard.holders = normalizeDrawingBoardHolders({}, definitions);
    appState.drawingBoard.holders = normalizeDrawingBoardHolders(appState.drawingBoard.holders, definitions);
    const key = holderStateKey(rail);
    return appState.drawingBoard.holders[key] || appState.drawingBoard.holders.important || Object.values(appState.drawingBoard.holders)[0];
  }

  function holderRecallButton(rail, compact = false) {
    const count = holderOwnedNotes(rail, { temporalOnly: true }).length;
    const definition = holderDefinition(rail);
    return `<button type="button" class="bp-ui-spatial bp-db-holder-recall${compact ? " is-compact" : ""}" data-db-holder-recall="${escapeHTML(rail)}"${count ? "" : " disabled"} title="Return ${count || "no"} temporary marble${count === 1 ? "" : "s"} to ${escapeHTML(definition.label)}" aria-label="Return temporary marbles to ${escapeHTML(definition.label)}">↩${compact ? "" : `<small>${count || ""}</small>`}</button>`;
  }

  function renderMarbleHolder(rail, notes) {
    const definition = holderDefinition(rail);
    const important = rail === "park";
    const destructive = rail === "delete";
    const state = boardHolderState(rail);
    const marbleSize = important ? 28 : (destructive ? 24 : 26);
    const gap = important ? 5 : 4;
    const itemsWidth = Math.max(0, notes.length * marbleSize + Math.max(0, notes.length - 1) * gap);
    const opensLeft = Number(state.x) > 0.72;
    const railClass = important ? "bp-db-marble-important-rail bp-db-marble-park-rail" : (destructive ? "bp-db-marble-delete-rail" : "bp-db-marble-category-rail");
    return `<section class="bp-db-marble-holder ${railClass}${notes.length ? " has-items" : ""}${state.collapsed ? " is-collapsed" : ""}${opensLeft ? " opens-left" : " opens-right"}" data-db-holder="${escapeHTML(rail)}" data-db-marble-drop="${escapeHTML(rail)}" data-db-holder-kind="${escapeHTML(rail)}" style="left:${(state.x * 100).toFixed(3)}%;top:${(state.y * 100).toFixed(3)}%;${escapeHTML(holderStyleVariables(definition))}" title="${escapeHTML(definition.label)} holder">
      <button type="button" class="bp-ui-spatial bp-db-holder-toggle" data-db-holder-toggle="${escapeHTML(rail)}" data-db-holder-drag="${escapeHTML(rail)}" aria-label="${state.collapsed ? `Expand ${definition.label} holder` : `Collapse ${definition.label} holder`}" title="Hold and drag to move · double-click to ${state.collapsed ? "expand" : "collapse"} ${escapeHTML(definition.label)}">
        <span class="bp-db-holder-icon ${important ? "is-important" : destructive ? "is-delete" : "is-category"}">${holderIconMarkup(rail)}</span>
      </button>
      ${state.collapsed ? "" : `<div class="bp-db-holder-drawer" aria-label="${escapeHTML(definition.label)} marble rail">
        ${!destructive ? holderRecallButton(rail) : ""}
        <div class="bp-db-marble-rail-items" style="--bp-db-rail-count:${Math.max(1, notes.length)};--bp-db-rail-marble-size:${marbleSize}px;--bp-db-rail-gap:${gap}px;--bp-db-rail-items-width:${itemsWidth}px">${notes.map(note => renderRailMarble(note, rail)).join("")}</div>
      </div>`}
    </section>`;
  }

  function renderDockedMarbleHolder(rail, notes) {
    const definition = holderDefinition(rail);
    const state = boardHolderState(rail);
    const destructive = rail === "delete";
    const marbleSize = destructive ? 22 : 24;
    const gap = 4;
    const itemsWidth = Math.max(0, notes.length * marbleSize + Math.max(0, notes.length - 1) * gap);
    return `<div class="bp-db-docked-holder${state.collapsed ? " is-collapsed" : ""}${destructive ? " is-delete" : ""}" data-db-holder="${escapeHTML(rail)}" data-db-marble-drop="${escapeHTML(rail)}" data-db-holder-kind="${escapeHTML(rail)}" style="${escapeHTML(holderStyleVariables(definition))}">
      ${holderRecallButton(rail, true)}
      <button type="button" class="bp-ui-spatial bp-db-docked-holder-toggle" data-db-holder-toggle="${escapeHTML(rail)}" data-db-holder-drag="${escapeHTML(rail)}" title="${escapeHTML(definition.label)} · hold and drag to undock · double-click to ${state.collapsed ? "expand" : "collapse"}" aria-label="${escapeHTML(definition.label)} holder">${holderIconMarkup(rail)}</button>
      ${state.collapsed ? "" : `<div class="bp-db-docked-holder-drawer" aria-label="${escapeHTML(definition.label)} marble rail"><div class="bp-db-marble-rail-items" style="--bp-db-rail-marble-size:${marbleSize}px;--bp-db-rail-gap:${gap}px;--bp-db-rail-items-width:${itemsWidth}px">${notes.map(note => renderRailMarble(note, rail)).join("")}</div></div>`}
    </div>`;
  }

  function renderDockedHolderToolbar() {
    const docked = boardHolderDefinitions()
      .filter(definition => boardHolderState(definition.id).docked)
      .sort((a, b) => boardHolderState(a.id).dockOrder - boardHolderState(b.id).dockOrder);
    return `<div class="bp-db-holder-dock-zone${docked.length ? " has-docked" : ""}" data-db-holder-dock-zone aria-label="Holder docking toolbar" title="Drag any holder onto the left creation rail to dock it">
      ${docked.map(definition => renderDockedMarbleHolder(definition.id, marbleRailNotes(definition.id))).join("")}
      ${docked.length ? "" : `<span class="bp-db-holder-dock-empty" aria-hidden="true"><b>⇥</b><i>dock</i></span>`}
    </div>`;
  }

  function renderMarbleDock() {
    return `<aside id="bpDbMarbleDock" class="bp-db-marble-dock" aria-label="Marble holder drawers">
      ${boardHolderDefinitions().filter(definition => !boardHolderState(definition.id).docked).map(definition => renderMarbleHolder(definition.id, marbleRailNotes(definition.id))).join("")}
    </aside>`;
  }

  function refreshMarbleDock() {
    const current = $("#bpDbMarbleDock");
    if (current) {
      const template = document.createElement("template");
      template.innerHTML = renderMarbleDock().trim();
      const next = template.content.firstElementChild;
      if (next) current.replaceWith(next);
    }
    refreshDrawingBoardCreationPalette();
    updateOrphanSortButton();
  }

  function syncBoardMarbleAnimationFrame() {
    const step = Math.max(0, Number(runtime.boardMarbleAnimationStep) || 0);
    $$('[data-db-marble-kind="typewriter"][data-db-marble-mode="auto"] .bp-db-marble-typewriter-core').forEach(core => {
      const chars = Array.from(core.dataset.dbMarbleTitle || "Typewriter");
      if (!chars.length) { core.textContent = "▌"; return; }
      const hold = 5;
      const phase = step % (chars.length + hold + 1);
      const count = phase > chars.length ? chars.length : phase;
      const typed = chars.slice(0, count);
      const tail = typed.slice(Math.max(0, typed.length - 2)).join("");
      const cursor = phase <= chars.length && step % 2 === 0 ? "▌" : "";
      core.textContent = `${tail}${cursor}` || "▌";
    });
  }

  function startBoardMarbleAnimations() {
    if (runtime.boardMarbleAnimationTimer) return;
    syncBoardMarbleAnimationFrame();
    runtime.boardMarbleAnimationTimer = window.setInterval(() => {
      runtime.boardMarbleAnimationStep = (runtime.boardMarbleAnimationStep + 1) % 100000;
      syncBoardMarbleAnimationFrame();
    }, 520);
  }

  function renderDrawingBoardNote(note) {
    const cfg = CONFIG.drawingBoard;
    const geometry = safeNoteGeometry(note);
    const links = normalizeLinks(note.links);
    const collapsed = Boolean(note.collapsed);
    const narrow = geometry.w <= cfg.minW;
    const selected = runtime.openLinksNoteId === note.id || runtime.boardSelectedNoteId === note.id || runtime.boardRepairTargetId === note.id;
    const invalid = boardGeometryIssues(note).length > 0;
    const visual = resolvedDrawingBoardNoteStyle(note);
    // Use the resolved palette values directly. Root --bp-note-tone-* tokens remain
    // available for other consumers, but cards/holder marbles should render the
    // same values shown in the Style palette even during theme/profile changes.
    const backgroundValue = visual.background;
    const textValue = visual.text;

    if (note.marbled && note.marbleRail) return "";

    if (note.marbled) {
      const diameter = cfg.marbleDiameterPx;
      const anchorInsetCells = cfg.marbleAnchorInsetPx / Math.max(1, Number(runtime.boardView.cellPx) || cfg.baseRenderedCellPx);
      const marbleCol = Number.isFinite(Number(note.marbleCol)) ? Number(note.marbleCol) : geometry.col + geometry.w - anchorInsetCells;
      const marbleRow = Number.isFinite(Number(note.marbleRow)) ? Number(note.marbleRow) : geometry.row + geometry.h - anchorInsetCells;
      const left = (marbleCol * runtime.boardView.cellPx) - (diameter / 2);
      const top = (marbleRow * runtime.boardView.cellPx) - (diameter / 2);
      const marbleKind = boardMarbleKind(note);
      const marble = marbleAppearanceAttrs(note);
      const temporal = Boolean(note.marbleHome && note.marbleTemporal);
      const temporalLabel = temporal ? ` · temporary from ${holderDefinition(note.marbleHome).label}` : "";
      return `<button type="button" class="bp-ui-spatial bp-db-marble${selected ? " is-selected" : ""}${invalid ? " is-invalid" : ""}${temporal ? " is-temporal" : ""}${marble.appearance.mode !== "auto" ? " has-custom-marble" : ""}"
        data-note-id="${escapeHTML(note.id)}" data-db-marble-toggle="${escapeHTML(note.id)}" data-db-marble-drag="${escapeHTML(note.id)}" data-db-marble-kind="${escapeHTML(marbleKind)}" data-db-marble-mode="${escapeHTML(marble.appearance.mode)}" data-db-marble-value="${escapeHTML(marble.appearance.value)}"${temporal ? ` data-db-marble-home="${escapeHTML(note.marbleHome)}"` : ""}
        style="left:${left}px;top:${top}px;width:${diameter}px;height:${diameter}px;z-index:${note.z};--bp-db-note-bg:${escapeHTML(backgroundValue)};--bp-db-note-text:${escapeHTML(textValue)};${escapeHTML(marble.style)}"
        title="${escapeHTML(note.title || "Note")} · drag to move · double-click to restore${escapeHTML(temporalLabel)}" aria-label="${escapeHTML(note.title || "Note")} marble${escapeHTML(temporalLabel)}">
        ${renderMarbleCoreMarkup(note)}
      </button>`;
    }

    const editing = runtime.boardMarkdownEditingIds.has(note.id);
    const settingsOpen = runtime.boardCardSettingsNoteId === note.id;
    const noteType = boardNoteTypeDefinition(note.contentMode);
    const settingsLabel = noteType.supportsTypewriter
      ? `${noteType.shortLabel} · ${note.presentation === "typewriter" ? "Type" : "Static"}`
      : noteType.shortLabel;
    const marble = marbleAppearanceAttrs(note);
    const contentTools = collapsed ? "" : `
      <div class="bp-db-content-tools" aria-label="Note content tools">
        ${note.contentMode === "markdown" ? `<button type="button" class="bp-ui-action bp-db-tool-action" data-db-markdown-view="${escapeHTML(note.id)}" title="${editing ? "Preview Markdown" : "Edit Markdown source"}"><span>${editing ? "◎" : "✎"}</span><b>${editing ? "Preview" : "Edit"}</b></button>` : ""}
        ${note.contentMode === "table" ? `<button type="button" class="bp-ui-action bp-db-tool-action bp-db-table-wrap-toggle${note.tableWrap !== false ? " is-active" : ""}" data-db-table-wrap="${escapeHTML(note.id)}" title="${note.tableWrap !== false ? "Disable text wrapping in table cells" : "Wrap text inside table cells"}" aria-pressed="${note.tableWrap !== false}"><span>${note.tableWrap !== false ? "↩" : "↔"}</span><b>${note.tableWrap !== false ? "Wrap" : "No wrap"}</b></button>` : ""}
        <button type="button" class="bp-ui-action bp-db-tool-action bp-db-settings-toggle${settingsOpen ? " is-active" : ""}" data-db-settings-toggle="${escapeHTML(note.id)}" title="Card content, presentation and colour settings" aria-expanded="${settingsOpen}"><span>⚙</span><b>${escapeHTML(settingsLabel)}</b></button>
      </div>`;

    return `
      <article class="bp-db-note${collapsed ? " bp-db-note-collapsed" : ""}${note.contentMode === "code" ? " bp-db-note-code" : ""}${note.presentation === "typewriter" ? " bp-db-note-typewriter" : ""}${narrow ? " bp-db-note-narrow" : ""}${selected ? " bp-db-note-links-selected" : ""}${invalid ? " bp-db-note-invalid" : ""}${settingsOpen ? " bp-db-settings-open" : ""}"
        data-note-id="${escapeHTML(note.id)}" data-db-note-type="${escapeHTML(noteType.id)}" data-db-color-mode="${escapeHTML(note.colorMode)}" data-db-tone="${visual.tone}"${collapsed ? ` data-db-collapsed-drag="${escapeHTML(note.id)}"` : ""}
        style="left:${geometry.col * runtime.boardView.cellPx}px;top:${geometry.row * runtime.boardView.cellPx}px;width:${geometry.w * runtime.boardView.cellPx}px;height:${geometry.h * runtime.boardView.cellPx}px;z-index:${note.z};--bp-db-note-bg:${escapeHTML(backgroundValue)};--bp-db-note-text:${escapeHTML(textValue)};--bp-db-note-control-bg:${escapeHTML(visual.controlBackground)};--bp-db-note-control-text:${escapeHTML(visual.controlText)};--bp-db-note-control-hover:${escapeHTML(visual.controlHoverBackground)};--bp-db-note-control-hover-text:${escapeHTML(visual.controlHoverText)};--bp-db-note-code-bg:${escapeHTML(visual.codeBackground)};--bp-db-note-code-text:${escapeHTML(visual.codeText)};">
        <div class="bp-db-note-header bp-db-card-chrome-header">
          ${collapsed
            ? `<strong class="bp-db-collapsed-title bp-db-card-title-slot">${escapeHTML(note.title || "Note")}</strong>`
            : `<input class="bp-db-title bp-db-card-title-slot" data-db-title="${escapeHTML(note.id)}" value="${escapeHTML(note.title || "Note")}" aria-label="Drawing Board note title" title="Edit note title" />
               <button type="button" class="bp-ui-utility bp-db-mini-button bp-db-links" data-db-links-toggle="${escapeHTML(note.id)}" title="Saved links (${links.length})" aria-label="Saved links">🔗${links.length ? `<span>${links.length}</span>` : ""}</button>`}
          <button type="button" class="bp-ui-spatial bp-db-card-chrome-marble bp-db-marble-anchor${marble.appearance.mode !== "auto" ? " has-custom-marble" : ""}" data-db-marble-toggle="${escapeHTML(note.id)}" data-db-marble-mode="${escapeHTML(marble.appearance.mode)}" data-db-marble-value="${escapeHTML(marble.appearance.value)}" style="${escapeHTML(marble.style)}" title="Click to collapse / expand · drag to resize · double-click to marble" aria-label="Presentation control for ${escapeHTML(note.title || "note")}"><span aria-hidden="true">${marble.appearance.mode === "glyph" ? escapeHTML(marble.appearance.glyph) : ""}</span></button>
        </div>
        ${collapsed ? "" : `
          ${renderDrawingBoardBody(note)}
          <div class="bp-db-note-footer bp-db-card-chrome-footer">
            ${contentTools}
            <span class="bp-ui-spatial bp-db-drag-zone" data-db-drag="${escapeHTML(note.id)}" title="Drag note from bottom chrome" aria-label="Drag note"></span>
          </div>
          ${renderDrawingBoardCardSettings(note, visual)}
        `}
      </article>`;
  }

  function renderDrawingBoard() {
    const cfg = CONFIG.drawingBoard;
    const extent = boardDimensions();
    const groupCount = (appState.drawingBoard.groups || []).length;
    const marbleCount = appState.drawingBoard.notes.filter(note => note.marbled).length;
    const collapsedCount = appState.drawingBoard.notes.filter(note => note.collapsed && !note.marbled).length;
    const parkedCount = appState.drawingBoard.notes.filter(note => note.marbleRail === "park").length;
    const markedCount = appState.drawingBoard.notes.filter(note => note.marbleRail === "delete").length;
    const temporaryCount = appState.drawingBoard.notes.filter(note => note.marbleHome && note.marbleTemporal).length;
    return `
      <section class="bp-panel bp-db-panel">
        <div class="bp-panel-header bp-db-header">
          <div class="bp-section-title">
            <h2>Drawing Board</h2>
            <span class="bp-section-kicker">Workspace camera · right-click to navigate / repair</span>
          </div>
          <div class="bp-db-actions" aria-label="Drawing Board actions">
            <span id="bpDbCountPill" class="bp-pill">${appState.drawingBoard.notes.length} notes${groupCount ? ` · ${groupCount} group${groupCount === 1 ? "" : "s"}` : ""} · ${collapsedCount} collapsed · ${marbleCount} marbles${temporaryCount ? ` · ${temporaryCount} temp` : ""}${parkedCount ? ` · ${parkedCount} important` : ""}${markedCount ? ` · ${markedCount} marked` : ""}</span>
            <div class="bp-db-view-controls" aria-label="Drawing Board view controls">
              <span class="bp-db-view-label" aria-hidden="true">View</span>
              <div class="bp-db-fit-group" role="group" aria-label="Fit board in viewport">
                <button type="button" id="bpDbViewFit" class="bp-db-fit-button" title="Overview: fit the complete logical board" aria-label="Fit complete board"><span aria-hidden="true">□</span><b>Board</b></button>
                <button type="button" id="bpDbViewWidth" class="bp-db-fit-button" title="Fit logical board width" aria-label="Fit board width"><span aria-hidden="true">↔</span><b>Width</b></button>
                <button type="button" id="bpDbViewHeight" class="bp-db-fit-button" title="Fit logical board height" aria-label="Fit board height"><span aria-hidden="true">↕</span><b>Height</b></button>
              </div>
              <div class="bp-db-zoom-group" role="group" aria-label="Board zoom">
                <button type="button" id="bpDbZoomOut" title="Zoom out from the current camera scale" aria-label="Zoom out">−</button>
                <button type="button" id="bpDbZoomReadout" title="Return to canonical 100% scale" aria-label="Return board to 100 percent">100%</button>
                <button type="button" id="bpDbZoomIn" title="Zoom in from the current camera scale" aria-label="Zoom in">+</button>
              </div>
            </div>
            <button type="button" id="bpReturnMarbles" class="bp-ui-action bp-db-secondary-action bp-db-return-marbles" title="Return every temporary holder-owned note to its drawer" aria-label="Return marbles to their holders"><span aria-hidden="true">↩</span><b>Return Marbles</b></button>
            <button type="button" id="bpSortOrphanMarbles" class="bp-ui-action bp-db-secondary-action" title="Sort orphan marbles into the sorting holder" aria-label="Sort orphan marbles"><span aria-hidden="true">⇲</span><b>Sort Orphans</b></button>
            <button type="button" id="bpManageHolders" class="bp-ui-action bp-db-secondary-action" title="Create, rename, recolour, re-icon, or remove holders" aria-label="Manage holders"><span aria-hidden="true">◉</span><b>Holders</b></button>
            <button type="button" id="bpRepairBoard" class="bp-ui-action bp-db-secondary-action" title="Open note navigator and explicit recovery actions" aria-label="Open Drawing Board navigator"><span aria-hidden="true">☷</span><b>Navigate / Repair</b></button>
            <button type="button" id="bpExportBoard" class="bp-ui-action bp-db-secondary-action" title="Export only the Drawing Board" aria-label="Export Drawing Board"><span aria-hidden="true">⇧</span><b>Export Board</b></button>
            <button type="button" id="bpImportBoardBtn" class="bp-ui-action bp-db-secondary-action" title="Import a Drawing Board JSON file" aria-label="Import Drawing Board"><span aria-hidden="true">⇩</span><b>Import Board</b></button>
            <input id="bpBoardImportFile" class="bp-hidden" type="file" accept="application/json,.json" />
          </div>
        </div>
        <div class="bp-db-stage">
          ${renderDrawingBoardCreationPalette()}
          <div class="bp-db-shell" aria-label="Drawing Board viewport">
            <div class="bp-db-world">
              <div id="bpDrawingBoardGrid" class="bp-db-board" style="--bp-db-cols:${extent.columns};--bp-db-rows:${extent.rows};--bp-db-cell-px:${runtime.boardView.cellPx}px;--bp-db-board-width:${extent.columns * runtime.boardView.cellPx}px;--bp-db-board-height:${extent.rows * runtime.boardView.cellPx}px;">
                ${(appState.drawingBoard.groups || []).map(renderDrawingBoardGroup).join("")}
                ${appState.drawingBoard.notes.map(renderDrawingBoardNote).join("")}
              </div>
            </div>
          </div>
          ${renderMarbleDock()}
          ${renderBoardOverlayLayer()}
        </div>
        <details class="bp-db-guide">
          <summary>Board controls</summary>
          <span>The left creation rail is a 2-column, 12-colour paint palette. Drag a colour, style, or template onto the canvas to create at that position; click colour/style cells to toggle generator defaults.</span>
          <span>Right-click a note or empty workspace to open Navigate / Repair. Recovery actions are explicit; opening the panel changes nothing.</span>
          <span>Rich and A/B cards edit directly; A/B section labels are editable too. To Do cards edit task rows in place. Table cards start 2×2, add rows/columns from edge + controls, and can toggle text wrapping from the footer. Code cards use their own terminal viewport with clipboard copy; Markdown cards can use Static or Typewriter presentation.</span>
          <span>Typewriter cards keep pace declarative in their Markdown source with a visible &lt;!--tempo:0.5--&gt; command while editing. Only the active board Typewriter owns a live renderer.</span>
          <span>The bottom-right marble owns note presentation: click it to switch Open ↔ Collapsed, double-click it to enter Marble, drag the free marble, and double-click the marble to unfold the note from that anchor. The old card position is no longer the restore authority.</span>
          <span>Expanded notes move from the bottom chrome and resize by dragging the bottom-right marble. Collapsed cards drag from the card; their marble is the explicit way back open. Destructive controls stay off the note itself.</span>
          <span>Holders own marbles independently from board position. Drag a holder onto the left creation palette to dock it beneath the creation tools; double-click still expands/collapses it. A holder-owned note opened or dragged onto the board uses temporary space until ↩ Return Marbles (global or per holder) recalls it.</span>
          <span>Holders use stable internal ids, so names/icons/colours can be edited without changing note ownership. Important and Delete are protected; every other holder can be removed, with owned notes migrated to Important first. Sort Orphans collects only free marbles with no holder ownership into Unsorted when it exists, otherwise Important.</span>
          <span>The ▧ Area Group creation tool paints a tinted board-floor section using the selected creation colour. Groups sit beneath notes, move by dragging the area, resize from the bottom-right corner, and can only be deleted from Navigate / Repair.</span>
          <span>Centre View uses a screen-space shrinking locator ring after the camera settles, so the target remains legible at every zoom.</span>
          <span>□ Board is an overview. 100% is the canonical ${cfg.baseRenderedCellPx} px/logical-unit camera; saved geometry stays in logical units.</span>
          <span id="bpDbExtentGuide">Workspace extent grows to the viewport and saved content: ${extent.columns}×${extent.rows} cells now (minimum ${cfg.columns}×${cfg.rows}). Invalid geometry is rendered safely and flagged until you choose a repair action.</span>
        </details>
      </section>`;
  }

  function clampViewNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function captureBoardViewportAnchor(shell, board) {
    if (!shell || !board || !board.clientWidth || !board.clientHeight) return null;
    const boardLeft = board.offsetLeft || 0;
    const boardTop = board.offsetTop || 0;
    return {
      x: (shell.scrollLeft + (shell.clientWidth / 2) - boardLeft) / board.clientWidth,
      y: (shell.scrollTop + (shell.clientHeight / 2) - boardTop) / board.clientHeight
    };
  }

  function restoreBoardViewportAnchor(shell, board, anchor) {
    if (!shell || !board || !anchor) return;
    const boardLeft = board.offsetLeft || 0;
    const boardTop = board.offsetTop || 0;
    const maxLeft = Math.max(0, shell.scrollWidth - shell.clientWidth);
    const maxTop = Math.max(0, shell.scrollHeight - shell.clientHeight);
    shell.scrollLeft = clampViewNumber(boardLeft + (anchor.x * board.clientWidth) - (shell.clientWidth / 2), 0, maxLeft);
    shell.scrollTop = clampViewNumber(boardTop + (anchor.y * board.clientHeight) - (shell.clientHeight / 2), 0, maxTop);
  }

  function cardPresentationForSize(width, height, collapsed = false) {
    if (collapsed) {
      if (width < 82) return "micro";
      if (width < 150) return "compact";
      return width >= 300 ? "large" : "standard";
    }
    if (width < 92 || height < 68) return "micro";
    if (width < 190 || height < 104) return "compact";
    if (width >= 420 && height >= 250) return "display";
    if (width >= 260 && height >= 170) return "large";
    return "standard";
  }

  function updateDrawingBoardNotePresentation(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const collapsed = element.classList.contains("bp-db-note-collapsed");
    const size = cardPresentationForSize(rect.width, rect.height, collapsed);
    const areaRoot = Math.sqrt(Math.max(1, rect.width * rect.height));
    const bodyFont = clampViewNumber(9.5 + (areaRoot / 52), 10, 18);
    const titleFont = clampViewNumber(bodyFont + 1.35, 11, 19);
    const collapsedFont = clampViewNumber(8.8 + (Math.sqrt(rect.width) / 2.9), 10.2, 16);
    const headerHeight = clampViewNumber(titleFont + 7, 18, 29);
    const footerHeight = clampViewNumber(titleFont + 14, 24, 34);

    element.dataset.dbSize = size;
    element.style.setProperty("--bp-db-body-font", `${bodyFont.toFixed(2)}px`);
    element.style.setProperty("--bp-db-title-font", `${titleFont.toFixed(2)}px`);
    element.style.setProperty("--bp-db-collapsed-font", `${collapsedFont.toFixed(2)}px`);
    element.style.setProperty("--bp-db-header-h", `${headerHeight.toFixed(1)}px`);
    element.style.setProperty("--bp-db-footer-h", `${footerHeight.toFixed(1)}px`);
  }

  function refreshDrawingBoardCardPresentation(root = document) {
    $$(".bp-db-note", root).forEach(updateDrawingBoardNotePresentation);
  }

  function currentBoardViewMode() {
    return ["fit", "width", "height", "actual", "custom"].includes(runtime.boardView.mode)
      ? runtime.boardView.mode
      : "actual";
  }

  function updateBoardViewControls() {
    const mode = currentBoardViewMode();
    const canonical = CONFIG.drawingBoard.baseRenderedCellPx;
    const percent = Math.round((runtime.boardView.cellPx / canonical) * 100);
    const controls = {
      fit: $("#bpDbViewFit"),
      width: $("#bpDbViewWidth"),
      height: $("#bpDbViewHeight")
    };
    for (const [key, button] of Object.entries(controls)) {
      if (!button) continue;
      const active = mode === key;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    }
    const readout = $("#bpDbZoomReadout");
    if (readout) {
      readout.textContent = `${percent}%`;
      readout.classList.toggle("is-active", mode === "actual" && percent === 100);
      const modeLabel = ({ fit: "Fit Board", width: "Fit Width", height: "Fit Height", actual: "Canonical", custom: "Custom" })[mode] || "View";
      readout.title = `${modeLabel} · ${percent}% of canonical board scale. Click for literal 100%.`;
    }
  }

  function boardCellSizeForMode(shell, mode = currentBoardViewMode()) {
    const cfg = CONFIG.drawingBoard;
    const extent = boardDimensions();
    if (!shell) return cfg.baseRenderedCellPx;
    const pad = cfg.fitPaddingPx || 0;
    const availableWidth = Math.max(1, shell.clientWidth - pad);
    const availableHeight = Math.max(1, shell.clientHeight - pad);
    const fitWidth = availableWidth / extent.columns;
    const fitHeight = availableHeight / extent.rows;
    let size = cfg.baseRenderedCellPx;
    if (mode === "fit") size = Math.min(fitWidth, fitHeight);
    else if (mode === "width") size = fitWidth;
    else if (mode === "height") size = fitHeight;
    else if (mode === "custom") size = cfg.baseRenderedCellPx * runtime.boardView.scale;
    return clampViewNumber(size, cfg.minRenderedCellPx, cfg.maxRenderedCellPx);
  }

  function applyBoardView({ preserveCenter = true } = {}) {
    const shell = $(".bp-db-shell");
    const board = $("#bpDrawingBoardGrid");
    if (!shell || !board) return;
    const cfg = CONFIG.drawingBoard;
    const mode = currentBoardViewMode();
    const anchor = preserveCenter ? captureBoardViewportAnchor(shell, board) : null;
    const extent = ensureBoardExtentForViewport(shell);
    const nextCellPx = boardCellSizeForMode(shell, mode);

    runtime.boardView.cellPx = nextCellPx;
    shell.dataset.viewMode = mode;
    board.style.setProperty("--bp-db-cols", String(extent.columns));
    board.style.setProperty("--bp-db-rows", String(extent.rows));
    board.style.setProperty("--bp-db-board-width", `${extent.columns * nextCellPx}px`);
    board.style.setProperty("--bp-db-board-height", `${extent.rows * nextCellPx}px`);
    board.style.setProperty("--bp-db-cell-px", `${nextCellPx}px`);
    shell.style.setProperty("--bp-db-cell-px", `${nextCellPx}px`);
    shell.closest(".bp-db-stage")?.style.setProperty("--bp-db-cell-px", `${nextCellPx}px`);
    board.dataset.renderedCellPx = nextCellPx.toFixed(2);
    const extentGuide = $("#bpDbExtentGuide");
    if (extentGuide) extentGuide.textContent = `Workspace extent grows to the viewport and saved content: ${extent.columns}×${extent.rows} cells now (minimum ${cfg.columns}×${cfg.rows}). Invalid geometry is rendered safely and flagged until you choose a repair action.`;
    updateBoardViewControls();
    (appState.drawingBoard.groups || []).forEach(group => syncDrawingBoardGroupElement(group));
    appState.drawingBoard.notes.forEach(note => syncDrawingBoardNoteElement(note));
    refreshDrawingBoardCardPresentation(board);

    if (anchor) requestAnimationFrame(() => restoreBoardViewportAnchor(shell, board, anchor));
  }

  function setBoardViewMode(mode) {
    if (!["fit", "width", "height", "actual"].includes(mode)) return;
    runtime.boardView.mode = mode;
    runtime.boardView.scale = 1;
    applyBoardView({ preserveCenter: false });
    const shell = $(".bp-db-shell");
    if (shell) {
      shell.scrollLeft = 0;
      shell.scrollTop = 0;
    }
  }

  function resetBoardZoom() {
    setBoardViewMode("actual");
  }

  function nudgeBoardZoom(direction) {
    const cfg = CONFIG.drawingBoard;
    const factor = direction > 0 ? 1.2 : (1 / 1.2);
    const currentScale = runtime.boardView.cellPx / cfg.baseRenderedCellPx;
    runtime.boardView.mode = "custom";
    runtime.boardView.scale = clampViewNumber(
      currentScale * factor,
      cfg.minViewScale,
      cfg.maxViewScale
    );
    applyBoardView();
  }

  function updateDrawingBoardColours() {
    (appState.drawingBoard.groups || []).forEach(group => syncDrawingBoardGroupElement(group));
    appState.drawingBoard.notes.forEach(note => {
      const element = $(`[data-note-id="${selectorEscape(note.id)}"]`);
      if (!element) return;
      const visual = resolvedDrawingBoardNoteStyle(note);
      element.dataset.dbColorMode = note.colorMode;
      element.dataset.dbTone = String(visual.tone);
      element.style.setProperty("--bp-db-note-bg", visual.background);
      element.style.setProperty("--bp-db-note-text", visual.text);
      element.style.setProperty("--bp-db-note-control-bg", visual.controlBackground);
      element.style.setProperty("--bp-db-note-control-text", visual.controlText);
      element.style.setProperty("--bp-db-note-control-hover", visual.controlHoverBackground);
      element.style.setProperty("--bp-db-note-control-hover-text", visual.controlHoverText);
      element.style.setProperty("--bp-db-note-code-bg", visual.codeBackground);
      element.style.setProperty("--bp-db-note-code-text", visual.codeText);
      const backgroundInput = element.querySelector(`[data-db-color="${selectorEscape(note.id)}"]`);
      const textInput = element.querySelector(`[data-db-text-color="${selectorEscape(note.id)}"]`);
      if (backgroundInput && document.activeElement !== backgroundInput) backgroundInput.value = visual.background;
      if (textInput && document.activeElement !== textInput) textInput.value = visual.text;
      element.querySelector('[data-db-theme-link]')?.classList.toggle('is-theme-linked', visual.linked && note.textColorMode !== 'custom');
    });
    refreshDrawingBoardCreationPalette();
  }

  function beginBoardNoteMoveTransaction(event, noteId, options = {}) {
    const {
      thresholdPx = 2,
      stopPropagation = false,
      preventStartDefault = true,
      requireCollapsed = false
    } = options;
    if (stopPropagation) event.stopPropagation();
    if (preventStartDefault) event.preventDefault();

    const board = $("#bpDrawingBoardGrid");
    const note = boardNoteById(noteId);
    if (!board || !note || !board.clientWidth || !board.clientHeight) return false;
    if (requireCollapsed && (note.marbled || !note.collapsed)) return false;

    bringNoteToFront(noteId, { persist: false, refresh: false });
    const safe = safeNoteGeometry(note);
    Object.assign(note, safe, { geometryWarnings: [] });
    const original = { ...note };
    const element = $(`[data-note-id="${selectorEscape(noteId)}"]`);
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;
    let dragCandidate = { ...original };
    let dragState = { valid: true, reason: "clear" };
    let ghost = null;
    element?.setPointerCapture?.(event.pointerId);

    const beginLift = () => {
      if (moved) return;
      moved = true;
      element?.classList.add("is-dragging");
      ghost = createNoteDropShadow(board, original);
      syncNoteDropShadow(ghost, dragCandidate, dragState);
    };

    const onMove = moveEvent => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < thresholdPx) return;
      beginLift();
      moveEvent.preventDefault();
      const cfg = CONFIG.drawingBoard;
      const cellPx = Math.max(1, runtime.boardView.cellPx || cfg.baseRenderedCellPx);
      dragCandidate = {
        ...original,
        col: Math.max(0, Math.min(cfg.maxColumns - original.w, original.col + Math.round(dx / cellPx))),
        row: Math.max(0, Math.min(cfg.maxRows - original.h, original.row + Math.round(dy / cellPx)))
      };
      dragState = noteDropCandidateState(dragCandidate, note.id);
      syncDrawingBoardNoteElement(dragCandidate, element);
      element?.classList.remove("bp-db-note-invalid");
      syncNoteDropShadow(ghost, dragCandidate, dragState);
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      ghost?.remove();
      element?.classList.remove("is-dragging");
      if (!moved) return;

      const committed = dragState.valid && canPlaceNoteWithGrowth(dragCandidate, note.id);
      if (committed) {
        Object.assign(note, dragCandidate, { geometryWarnings: [], updatedAt: new Date().toISOString() });
        syncDrawingBoardNoteElement(note, element);
      } else {
        Object.assign(note, original);
        syncDrawingBoardNoteElement(note, element);
        showToast("That landing overlaps another card. Returned to the original position.");
      }
      saveState();
      if (runtime.boardRepairOpen) refreshBoardOverlayLayer();
    };

    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointercancel", onUp, { once: true });
    return true;
  }

  function startNotePointer(event, noteId, mode) {
    if (mode === "move") {
      return beginBoardNoteMoveTransaction(event, noteId, { thresholdPx: 2, preventStartDefault: true });
    }

    // Resize remains immediate, but movement now shares one transaction path
    // for open and collapsed cards. This keeps collision/drop semantics from
    // diverging again as new note types or presentation states are added.
    event.preventDefault();
    const board = $("#bpDrawingBoardGrid");
    const note = boardNoteById(noteId);
    if (!board || !note || !board.clientWidth || !board.clientHeight) return;
    bringNoteToFront(noteId, { persist: false, refresh: false });
    const safe = safeNoteGeometry(note);
    Object.assign(note, safe, { geometryWarnings: [] });
    const original = { ...note };
    const startX = event.clientX;
    const startY = event.clientY;
    const element = $(`[data-note-id="${selectorEscape(noteId)}"]`);
    const body = element?.querySelector?.(`[data-db-body="${selectorEscape(noteId)}"]`) || element?.querySelector?.("[data-db-body]");
    const bodyScroll = body ? { top: body.scrollTop, left: body.scrollLeft } : null;
    element?.setPointerCapture?.(event.pointerId);

    const restoreBodyScroll = () => {
      if (!body || !bodyScroll) return;
      body.scrollTop = Math.min(bodyScroll.top, Math.max(0, body.scrollHeight - body.clientHeight));
      body.scrollLeft = Math.min(bodyScroll.left, Math.max(0, body.scrollWidth - body.clientWidth));
    };

    const onMove = moveEvent => {
      const cellPx = Math.max(1, runtime.boardView.cellPx || CONFIG.drawingBoard.baseRenderedCellPx);
      const deltaColumns = Math.round((moveEvent.clientX - startX) / cellPx);
      const deltaRows = Math.round((moveEvent.clientY - startY) / cellPx);
      const candidate = { ...note };
      candidate.collapsed = false;
      candidate.w = Math.max(CONFIG.drawingBoard.minW, original.w + deltaColumns);
      candidate.h = Math.max(CONFIG.drawingBoard.minH, original.h + deltaRows);
      candidate.expandedH = candidate.h;
      if (!canPlaceNoteWithGrowth(candidate, note.id)) return;
      Object.assign(note, candidate, { updatedAt: new Date().toISOString() });
      syncDrawingBoardNoteElement(note, element);
      element?.classList.toggle("bp-db-note-narrow", note.w <= CONFIG.drawingBoard.minW);
      updateDrawingBoardNotePresentation(element);
      restoreBodyScroll();
      requestAnimationFrame(restoreBodyScroll);
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      restoreBodyScroll();
      saveState();
      if (runtime.boardRepairOpen) refreshBoardOverlayLayer();
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointercancel", onUp, { once: true });
  }

  function startCollapsedNotePointer(event, noteId) {
    // Preserve click/double-click semantics until the pointer crosses the
    // movement threshold, then hand the card to the same move transaction used
    // by open cards.
    return beginBoardNoteMoveTransaction(event, noteId, {
      thresholdPx: 3,
      stopPropagation: true,
      preventStartDefault: false,
      requireCollapsed: true
    });
  }

  function clearBoardMarbleAnchorTap(noteId = "") {
    const pending = runtime.boardMarbleAnchorTap;
    if (!pending) return;
    if (noteId && pending.noteId !== noteId) return;
    runtime.boardMarbleAnchorTap = null;
    if (runtime.boardMarbleClickTimer) {
      clearTimeout(runtime.boardMarbleClickTimer);
      runtime.boardMarbleClickTimer = 0;
    }
  }

  function commitMarbleAnchorSingleTap(noteId) {
    const pending = runtime.boardMarbleAnchorTap;
    if (!pending || pending.noteId !== noteId) return false;
    runtime.boardMarbleAnchorTap = null;
    runtime.boardMarbleClickTimer = 0;
    const note = boardNoteById(noteId);
    if (!note || note.marbled) return false;
    commitDrawingBoardBodies();
    if (!toggleNoteCollapsed(noteId)) return false;
    runtime.boardMarkdownEditingIds.delete(noteId);
    if (runtime.boardCardSettingsNoteId === noteId) runtime.boardCardSettingsNoteId = "";
    if (runtime.boardTypewriterNoteId === noteId) destroyBoardTypewriter();
    saveState();
    replaceDrawingBoardNoteElement(noteId);
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    return true;
  }

  function handleMarbleAnchorTap(noteId) {
    const now = Date.now();
    const pending = runtime.boardMarbleAnchorTap;
    // Do not depend on the browser's native dblclick event. The anchor is a
    // geometry control, so its DOM position may change after a single-click
    // action. Keep the first tap pending; a second tap on the same physical
    // button cancels the single action and marbles the note instead.
    if (pending && pending.noteId === noteId && (now - pending.at) <= 380) {
      clearBoardMarbleAnchorTap(noteId);
      commitDrawingBoardBodies();
      toggleNoteMarbled(noteId);
      return "double";
    }
    clearBoardMarbleAnchorTap();
    runtime.boardMarbleAnchorTap = { noteId, at: now };
    runtime.boardMarbleClickTimer = window.setTimeout(() => commitMarbleAnchorSingleTap(noteId), 320);
    return "single-pending";
  }

  function startMarbleAnchorPointer(event, noteId) {
    const note = boardNoteById(noteId);
    const element = $(`[data-note-id="${selectorEscape(noteId)}"]`);
    const anchor = event.target.closest?.(".bp-db-marble-anchor[data-db-marble-toggle]");
    if (!note || !element || !anchor || note.marbled) return;
    event.preventDefault();
    event.stopPropagation();
    const original = safeNoteGeometry(note);
    const startX = event.clientX;
    const startY = event.clientY;
    const body = element.querySelector(".bp-db-note-body");
    const scrollTop = body?.scrollTop || 0;
    const scrollLeft = body?.scrollLeft || 0;
    const canResize = !note.collapsed;
    let moved = false;
    try { anchor.setPointerCapture?.(event.pointerId); } catch (_) {}

    const restoreBodyScroll = () => { if (body) { body.scrollTop = scrollTop; body.scrollLeft = scrollLeft; } };
    const onMove = moveEvent => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      if (!moved) {
        moved = true;
        clearBoardMarbleAnchorTap(noteId);
        if (canResize) {
          bringNoteToFront(noteId, { persist: false, refresh: false });
          element.classList.add("is-resizing-from-marble");
        }
      }
      moveEvent.preventDefault();
      if (!canResize) return;
      const cellPx = Math.max(1, runtime.boardView.cellPx || CONFIG.drawingBoard.baseRenderedCellPx);
      const candidate = {
        ...note,
        collapsed: false,
        w: Math.max(CONFIG.drawingBoard.minW, original.w + Math.round(dx / cellPx)),
        h: Math.max(CONFIG.drawingBoard.minH, original.h + Math.round(dy / cellPx))
      };
      candidate.expandedH = candidate.h;
      if (!canPlaceNote(candidate, note.id)) return;
      Object.assign(note, candidate, { updatedAt: new Date().toISOString() });
      syncDrawingBoardNoteElement(note, element);
      element.classList.toggle("bp-db-note-narrow", note.w <= CONFIG.drawingBoard.minW);
      updateDrawingBoardNotePresentation(element);
      restoreBodyScroll();
    };
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      element.classList.remove("is-resizing-from-marble");
      if (moved) {
        if (canResize) {
          saveState();
          restoreBodyScroll();
          if (runtime.boardRepairOpen) refreshBoardOverlayLayer();
        }
        return;
      }
      setBoardSelection(noteId);
      handleMarbleAnchorTap(noteId);
    };
    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointercancel", onUp, { once: true });
  }

  function clearMarbleHolderTap(rail = "") {
    const pending = runtime.boardHolderTap;
    if (pending && rail && pending.rail !== rail) return;
    runtime.boardHolderTap = null;
    if (runtime.boardHolderTapClearTimer) {
      clearTimeout(runtime.boardHolderTapClearTimer);
      runtime.boardHolderTapClearTimer = 0;
    }
  }

  function handleMarbleHolderTap(rail) {
    const now = Date.now();
    const pending = runtime.boardHolderTap;
    if (pending && pending.rail === rail && (now - pending.at) <= 420) {
      clearMarbleHolderTap(rail);
      toggleMarbleHolderCollapsed(rail);
      return "double";
    }
    clearMarbleHolderTap();
    runtime.boardHolderTap = { rail, at: now };
    runtime.boardHolderTapClearTimer = window.setTimeout(() => clearMarbleHolderTap(rail), 460);
    return "single";
  }

  function startBoardStyleLabPointer(event) {
    const panel = event.target.closest("#bpDbStyleLab");
    if (!panel || !event.target.closest("[data-db-style-drag]")) return;
    if (event.target.closest("button, input, select")) return;
    event.preventDefault();
    event.stopPropagation();
    const layer = $("#bpDbOverlayLayer");
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = panel.offsetLeft;
    const startTop = panel.offsetTop;
    let moved = false;
    try { panel.setPointerCapture?.(event.pointerId); } catch (_) {}
    const onMove = moveEvent => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 3) return;
      moved = true;
      moveEvent.preventDefault();
      const pad = 12;
      const maxLeft = Math.max(pad, rect.width - panel.offsetWidth - pad);
      const maxTop = Math.max(pad, rect.height - panel.offsetHeight - pad);
      const left = Math.max(pad, Math.min(maxLeft, startLeft + dx));
      const top = Math.max(pad, Math.min(maxTop, startTop + dy));
      runtime.boardStyleWindow.x = left / Math.max(1, rect.width);
      runtime.boardStyleWindow.y = top / Math.max(1, rect.height);
      panel.style.left = `${(runtime.boardStyleWindow.x * 100).toFixed(2)}%`;
      panel.style.top = `${(runtime.boardStyleWindow.y * 100).toFixed(2)}%`;
      panel.classList.add("is-dragging");
    };
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      panel.classList.remove("is-dragging");
    };
    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointercancel", onUp, { once: true });
  }

  function syncBoardStyleLabPreview(note) {
    const panel = $("#bpDbStyleLab");
    if (!note || !panel || panel.dataset.dbStyleNote !== note.id) return;
    const visual = resolvedDrawingBoardNoteStyle(note);
    const appearance = resolvedMarbleAppearance(note);
    const preview = panel.querySelector(".bp-db-style-marble-preview");
    if (preview) {
      preview.dataset.dbMarbleKind = boardMarbleKind(note);
      preview.dataset.dbMarbleMode = appearance.mode;
      preview.style.setProperty("--bp-db-note-bg", visual.background);
      preview.style.setProperty("--bp-db-note-text", visual.text);
      if (appearance.fill) preview.style.setProperty("--bp-db-marble-face", appearance.fill);
      else preview.style.removeProperty("--bp-db-marble-face");
      preview.innerHTML = renderMarbleCoreMarkup(note);
    }
    const bg = panel.querySelector(`[data-db-style-background="${selectorEscape(note.id)}"]`);
    if (bg && document.activeElement !== bg) bg.value = visual.background;
    const text = panel.querySelector(`[data-db-style-text="${selectorEscape(note.id)}"]`);
    if (text && document.activeElement !== text) text.value = visual.text;
    syncBoardMarbleAnimationFrame();
  }

  function refreshBoardNoteStyle(note, { refreshOverlay = false } = {}) {
    if (!note) return;
    note.updatedAt = new Date().toISOString();
    queueSaveState();
    replaceDrawingBoardNoteElement(note.id);
    refreshMarbleDock();
    updateDrawingBoardColours();
    if (refreshOverlay) refreshBoardOverlayLayer();
    else syncBoardStyleLabPreview(note);
  }

  function toggleMarbleHolderCollapsed(rail) {
    const state = boardHolderState(rail);
    state.collapsed = !state.collapsed;
    saveState();
    refreshMarbleDock();
    return true;
  }

  function startMarbleHolderPointer(event, rail) {
    const holder = event.target.closest(`[data-db-holder="${rail}"]`);
    const dockViewport = $("#bpDbMarbleDock");
    if (!holder || !dockViewport || !isBoardHolderId(rail)) return;
    event.preventDefault();
    event.stopPropagation();
    const state = boardHolderState(rail);
    const sourceDocked = Boolean(state.docked);
    const viewportRect = dockViewport.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startAnchorX = viewportRect.left + (state.x * viewportRect.width);
    const startAnchorY = viewportRect.top + (state.y * viewportRect.height);
    let moved = false;
    let ghost = null;
    try { holder.setPointerCapture?.(event.pointerId); } catch (_) {}

    const ensureGhost = () => {
      if (ghost) return;
      ghost = holder.cloneNode(true);
      ghost.classList.add("bp-db-holder-drag-ghost");
      ghost.style.position = "fixed";
      ghost.style.left = `${event.clientX - 17}px`;
      ghost.style.top = `${event.clientY - 17}px`;
      ghost.style.zIndex = "13000";
      ghost.style.pointerEvents = "none";
      document.body.append(ghost);
    };

    const updateFreePosition = (clientX, clientY) => {
      const pad = 14;
      const anchorX = Math.max(viewportRect.left + pad, Math.min(viewportRect.right - pad, clientX));
      const anchorY = Math.max(viewportRect.top + pad, Math.min(viewportRect.bottom - pad, clientY));
      state.x = Math.max(0.01, Math.min(0.99, (anchorX - viewportRect.left) / Math.max(1, viewportRect.width)));
      state.y = Math.max(0.01, Math.min(0.99, (anchorY - viewportRect.top) / Math.max(1, viewportRect.height)));
      if (!sourceDocked) {
        holder.style.left = `${(state.x * 100).toFixed(3)}%`;
        holder.style.top = `${(state.y * 100).toFixed(3)}%`;
        holder.classList.toggle("opens-left", state.x > 0.72);
        holder.classList.toggle("opens-right", state.x <= 0.72);
      }
    };

    const onMove = moveEvent => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 3) return;
      if (!moved) {
        moved = true;
        ensureGhost();
        holder.classList.add("is-dragging-holder");
      }
      moveEvent.preventDefault();
      if (ghost) {
        ghost.style.left = `${moveEvent.clientX - 17}px`;
        ghost.style.top = `${moveEvent.clientY - 17}px`;
      }
      const dockHot = holderDockZoneAt(moveEvent.clientX, moveEvent.clientY);
      setHolderDockHot(dockHot);
      if (!dockHot) updateFreePosition(sourceDocked ? moveEvent.clientX : startAnchorX + dx, sourceDocked ? moveEvent.clientY : startAnchorY + dy);
    };

    const onUp = upEvent => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      holder.classList.remove("is-dragging-holder");
      ghost?.remove();
      setHolderDockHot(false);
      if (!moved) {
        handleMarbleHolderTap(rail);
        return;
      }
      clearMarbleHolderTap();
      const docked = holderDockZoneAt(upEvent.clientX, upEvent.clientY);
      if (docked) {
        state.docked = true;
        if (!sourceDocked) state.dockOrder = nextHolderDockOrder();
      } else {
        state.docked = false;
        updateFreePosition(upEvent.clientX, upEvent.clientY);
      }
      saveState();
      refreshMarbleDock();
    };
    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointercancel", onUp, { once: true });
  }

  function autoScrollBoardForDragPointer(shell, clientX, clientY, deltaMs = 16.67) {
    if (!shell) return { x: 0, y: 0 };
    const rect = shell.getBoundingClientRect();
    const edge = Math.max(26, Math.min(56, Math.min(rect.width, rect.height) * 0.09));
    const maxSpeed = 520; // px / second at the outer edge
    const axisVelocity = (value, low, high) => {
      if (value < low + edge) return -maxSpeed * Math.min(1, (low + edge - value) / edge);
      if (value > high - edge) return maxSpeed * Math.min(1, (value - (high - edge)) / edge);
      return 0;
    };
    const seconds = Math.max(0.001, Math.min(0.04, Number(deltaMs) / 1000 || 0.01667));
    const beforeLeft = shell.scrollLeft;
    const beforeTop = shell.scrollTop;
    shell.scrollLeft = Math.max(0, beforeLeft + axisVelocity(clientX, rect.left, rect.right) * seconds);
    shell.scrollTop = Math.max(0, beforeTop + axisVelocity(clientY, rect.top, rect.bottom) * seconds);
    return { x: shell.scrollLeft - beforeLeft, y: shell.scrollTop - beforeTop };
  }

  function startMarblePointer(event, noteId) {
    event.stopPropagation();
    const board = $("#bpDrawingBoardGrid");
    const shell = $(".bp-db-shell");
    const note = appState.drawingBoard.notes.find(item => item.id === noteId);
    if (!board || !shell || !note || !note.marbled || note.marbleRail) return;
    bringNoteToFront(noteId, { persist: false, refresh: false });
    const element = $(`[data-note-id="${selectorEscape(noteId)}"]`, board);
    if (!element) return;

    const cfg = CONFIG.drawingBoard;
    const cellPx = Math.max(1, Number(runtime.boardView.cellPx) || cfg.baseRenderedCellPx);
    const diameter = cfg.marbleDiameterPx;
    const radius = diameter / 2;
    const startX = event.clientX;
    const startY = event.clientY;
    const startScrollLeft = shell.scrollLeft;
    const startScrollTop = shell.scrollTop;
    const startOffset = { left: Number(element.offsetLeft) || 0, top: Number(element.offsetTop) || 0 };
    const startLocalCenter = { x: startOffset.left + radius, y: startOffset.top + radius };
    let moved = false;
    let lastPointerX = startX;
    let lastPointerY = startY;
    let lastDx = 0;
    let lastDy = 0;
    let autoScrollFrame = 0;
    let lastAutoScrollTime = 0;
    try { element.setPointerCapture?.(event.pointerId); } catch (_) {}

    const displacement = () => ({
      x: (lastPointerX - startX) + (shell.scrollLeft - startScrollLeft),
      y: (lastPointerY - startY) + (shell.scrollTop - startScrollTop)
    });

    const applyVisualPosition = () => {
      const delta = displacement();
      lastDx = delta.x;
      lastDy = delta.y;
      element.style.translate = `${delta.x}px ${delta.y}px`;
    };

    const stopAutoScroll = () => {
      if (autoScrollFrame) cancelAnimationFrame(autoScrollFrame);
      autoScrollFrame = 0;
      lastAutoScrollTime = 0;
    };

    const autoScrollTick = now => {
      if (!moved || !element.isConnected) { stopAutoScroll(); return; }
      const deltaMs = lastAutoScrollTime ? now - lastAutoScrollTime : 16.67;
      lastAutoScrollTime = now;
      const overRail = marbleDropRailAt(lastPointerX, lastPointerY);
      if (!overRail) {
        const scrolled = autoScrollBoardForDragPointer(shell, lastPointerX, lastPointerY, deltaMs);
        if (scrolled.x || scrolled.y) applyVisualPosition();
      }
      autoScrollFrame = requestAnimationFrame(autoScrollTick);
    };

    const onMove = moveEvent => {
      lastPointerX = moveEvent.clientX;
      lastPointerY = moveEvent.clientY;
      const rawDx = lastPointerX - startX;
      const rawDy = lastPointerY - startY;
      if (!moved && Math.hypot(rawDx, rawDy) < 3) return;
      if (!moved) {
        moved = true;
        element.classList.add("is-dragging");
        document.body.classList.add("bp-db-marble-drag-active");
        autoScrollFrame = requestAnimationFrame(autoScrollTick);
      }
      moveEvent.preventDefault();
      const rail = marbleDropRailAt(lastPointerX, lastPointerY);
      setMarbleDropHighlight(rail);
      applyVisualPosition();
    };

    const onUp = upEvent => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      stopAutoScroll();
      if (Number.isFinite(upEvent.clientX)) lastPointerX = upEvent.clientX;
      if (Number.isFinite(upEvent.clientY)) lastPointerY = upEvent.clientY;
      const rail = moved ? marbleDropRailAt(lastPointerX, lastPointerY) : "";
      clearMarbleDropHighlight();
      if (!moved) {
        element.style.removeProperty("translate");
        element.classList.remove("is-dragging");
        document.body.classList.remove("bp-db-marble-drag-active");
        return;
      }
      if (rail) {
        element.style.removeProperty("translate");
        element.classList.remove("is-dragging");
        document.body.classList.remove("bp-db-marble-drag-active");
        setNoteMarbleRail(noteId, rail);
        return;
      }

      applyVisualPosition();
      const targetLocalCenter = {
        x: startLocalCenter.x + lastDx,
        y: startLocalCenter.y + lastDy
      };
      note.marbleCol = targetLocalCenter.x / cellPx;
      note.marbleRow = targetLocalCenter.y / cellPx;
      note.updatedAt = new Date().toISOString();

      growBoardForRectangle(
        Math.max(0, note.marbleCol),
        Math.max(0, note.marbleRow),
        cfg.extentMarginCells,
        cfg.extentMarginCells
      );

      element.style.removeProperty("translate");
      element.classList.remove("is-dragging");
      document.body.classList.remove("bp-db-marble-drag-active");
      replaceDrawingBoardNoteElement(noteId, { remountTypewriter: false });
      queueSaveState();
      if (runtime.boardRepairOpen) refreshBoardOverlayLayer();
    };

    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointercancel", onUp, { once: true });
  }

  function startRailMarblePointer(event, noteId) {
    event.stopPropagation();
    const note = boardNoteById(noteId);
    const source = event.target.closest("[data-db-rail-marble-drag]");
    if (!note || !source || !note.marbled || !note.marbleRail) return;
    const sourceRail = note.marbleRail;
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;
    let ghost = null;

    const makeGhost = () => {
      ghost = source.cloneNode(true);
      ghost.removeAttribute("data-db-rail-marble-drag");
      ghost.classList.add("bp-db-rail-marble-ghost");
      ghost.style.position = "fixed";
      ghost.style.left = `${startX - 14}px`;
      ghost.style.top = `${startY - 14}px`;
      ghost.style.width = "28px";
      ghost.style.height = "28px";
      ghost.style.zIndex = "12000";
      ghost.style.pointerEvents = "none";
      document.body.append(ghost);
      source.classList.add("is-dragging");
      document.body.classList.add("bp-db-marble-drag-active");
    };

    const onMove = moveEvent => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 3) return;
      if (!moved) { moved = true; makeGhost(); }
      moveEvent.preventDefault();
      if (ghost) {
        ghost.style.left = `${moveEvent.clientX - 14}px`;
        ghost.style.top = `${moveEvent.clientY - 14}px`;
      }
      setMarbleDropHighlight(marbleDropRailAt(moveEvent.clientX, moveEvent.clientY));
    };

    const onUp = upEvent => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      source.classList.remove("is-dragging");
      ghost?.remove();
      clearMarbleDropHighlight();
      if (!moved) {
        setBoardSelection(noteId);
        return;
      }
      const targetRail = marbleDropRailAt(upEvent.clientX, upEvent.clientY);
      if (targetRail) {
        setNoteMarbleRail(noteId, targetRail);
        return;
      }
      if (releaseRailMarbleToBoard(noteId, upEvent.clientX, upEvent.clientY)) return;
      if (note.marbleRail !== sourceRail) setNoteMarbleRail(noteId, sourceRail);
    };

    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointercancel", onUp, { once: true });
  }

  function boardNoteById(noteId) {
    return appState.drawingBoard.notes.find(item => item.id === noteId) || null;
  }

  function marbleDropRailAt(clientX, clientY) {
    const target = document.elementFromPoint(clientX, clientY)?.closest?.("[data-db-marble-drop]");
    const rail = target?.dataset?.dbMarbleDrop;
    return isBoardHolderId(rail) ? rail : "";
  }

  function holderDockZoneAt(clientX, clientY) {
    // Holder docking deliberately uses the whole creation rail as the drop runway.
    // The visible dock bay is small, but requiring the pointer to hit that exact
    // 12–30px slot made docking effectively impossible at compact densities and
    // while grabbing a holder away from its centre. A holder drag is unambiguous,
    // so any release over (or just beside) the creation palette means "dock".
    const directHit = document.elementFromPoint(clientX, clientY)?.closest?.("[data-db-holder-dock-zone], #bpDbCreationPalette");
    if (directHit) return true;

    const palette = $("#bpDbCreationPalette");
    const zone = $("[data-db-holder-dock-zone]");
    if (!palette && !zone) return false;
    const rect = (palette || zone).getBoundingClientRect();
    const padX = 18;
    const padY = 10;
    return clientX >= rect.left - padX && clientX <= rect.right + padX
      && clientY >= rect.top - padY && clientY <= rect.bottom + padY;
  }

  function setHolderDockHot(active) {
    const palette = $("#bpDbCreationPalette");
    const zone = $("[data-db-holder-dock-zone]");
    palette?.classList.toggle("is-holder-dock-hot", Boolean(active));
    zone?.classList.toggle("is-dock-hot", Boolean(active));
  }

  function setMarbleDropHighlight(rail = "") {
    $$('[data-db-marble-drop]').forEach(element => element.classList.toggle("is-drop-hot", element.dataset.dbMarbleDrop === rail));
    $(".bp-db-stage")?.classList.toggle("is-marble-dragging", Boolean(rail) || document.body.classList.contains("bp-db-marble-drag-active"));
  }

  function clearMarbleDropHighlight() {
    document.body.classList.remove("bp-db-marble-drag-active");
    $$('[data-db-marble-drop]').forEach(element => element.classList.remove("is-drop-hot"));
    $(".bp-db-stage")?.classList.remove("is-marble-dragging");
    setHolderDockHot(false);
  }

  function ensureNoteIsMarbled(note) {
    if (!note || note.marbled) return false;
    const cfg = CONFIG.drawingBoard;
    const safe = safeNoteGeometry(note);
    note.preMarbleCollapsed = Boolean(note.collapsed);
    const anchorInsetCells = cfg.marbleAnchorInsetPx / Math.max(1, Number(runtime.boardView.cellPx) || cfg.baseRenderedCellPx);
    note.marbleCol = Math.max(0, safe.col + safe.w - anchorInsetCells);
    note.marbleRow = Math.max(0, safe.row + safe.h - anchorInsetCells);
    note.marbled = true;
    note.marbleTemporal = Boolean(note.marbleHome);
    if (runtime.boardTypewriterNoteId === note.id) destroyBoardTypewriter();
    runtime.boardMarkdownEditingIds.delete(note.id);
    if (runtime.boardCardSettingsNoteId === note.id) runtime.boardCardSettingsNoteId = "";
    if (runtime.openLinksNoteId === note.id) runtime.openLinksNoteId = "";
    return true;
  }

  function setNoteMarbleRail(noteId, rail) {
    const note = boardNoteById(noteId);
    if (!note || !isBoardHolderId(rail)) return false;
    ensureNoteIsMarbled(note);
    note.marbleRail = rail;
    note.marbleHome = rail;
    note.marbleTemporal = false;
    note.marbleRailOrder = nextMarbleRailOrder();
    note.updatedAt = new Date().toISOString();
    saveState();
    replaceDrawingBoardNoteElement(note.id);
    refreshMarbleDock();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    setBoardSelection(note.id);
    return true;
  }

  function releaseRailMarbleToBoard(noteId, clientX, clientY) {
    const note = boardNoteById(noteId);
    const board = $("#bpDrawingBoardGrid");
    const shell = $(".bp-db-shell");
    if (!note || !board || !shell) return false;
    const shellRect = shell.getBoundingClientRect();
    if (clientX < shellRect.left || clientX > shellRect.right || clientY < shellRect.top || clientY > shellRect.bottom) return false;
    const point = boardPointFromClient(clientX, clientY);
    if (!point) return false;
    const sourceRail = note.marbleRail;
    note.marbled = true;
    note.marbleRail = "";
    note.marbleRailOrder = 0;
    // Leaving Delete is an explicit recovery action: do not leave a hidden
    // destructive ownership flag that a later global recall could reactivate.
    if (sourceRail === "delete") {
      note.marbleHome = "";
      note.marbleTemporal = false;
    } else {
      note.marbleHome = sourceRail || note.marbleHome || "";
      note.marbleTemporal = Boolean(note.marbleHome);
    }
    note.marbleCol = point.col;
    note.marbleRow = point.row;
    growBoardForRectangle(point.col, point.row, CONFIG.drawingBoard.extentMarginCells, CONFIG.drawingBoard.extentMarginCells);
    note.updatedAt = new Date().toISOString();
    saveState();
    replaceDrawingBoardNoteElement(note.id);
    refreshMarbleDock();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    setBoardSelection(note.id);
    return true;
  }

  function restorePlacementFromAnchor(note, anchorCol, anchorRow) {
    const cfg = CONFIG.drawingBoard;
    const safe = safeNoteGeometry(note);
    const collapsed = Boolean(note.preMarbleCollapsed);
    const w = Math.max(cfg.minW, Number(safe.w) || cfg.defaultW);
    const h = collapsed ? cfg.collapsedH : Math.max(cfg.minH, Number(note.expandedH) || Number(safe.h) || cfg.defaultH);
    const inset = cfg.marbleAnchorInsetPx / Math.max(1, Number(runtime.boardView.cellPx) || cfg.baseRenderedCellPx);
    const preferredAnchor = { col: Math.max(0, Number(anchorCol) || 0), row: Math.max(0, Number(anchorRow) || 0) };
    const candidateForAnchor = (aCol, aRow) => ({
      col: Math.round(aCol - w + inset),
      row: Math.round(aRow - h + inset),
      w, h,
      expandedH: collapsed ? Math.max(cfg.minH, Number(note.expandedH) || cfg.defaultH) : h,
      collapsed,
      marbled: false,
      anchorCol: aCol,
      anchorRow: aRow
    });
    const clear = candidate => {
      if (candidate.col < 0 || candidate.row < 0) return false;
      return !appState.drawingBoard.notes.some(other => other.id !== note.id && notesOverlap(candidate, other));
    };

    const direct = candidateForAnchor(preferredAnchor.col, preferredAnchor.row);
    if (clear(direct)) return direct;

    // The bottom-right marble remains the physical anchor. If that anchor is too
    // close to an edge or crowded, move the anchor itself only as far as needed
    // instead of teleporting the restored card to an unrelated board location.
    const minAnchorCol = Math.max(preferredAnchor.col, w - inset);
    const minAnchorRow = Math.max(preferredAnchor.row, h - inset);
    const edgeSafe = candidateForAnchor(minAnchorCol, minAnchorRow);
    if (clear(edgeSafe)) return edgeSafe;

    for (let radius = 2; radius <= 36; radius += 2) {
      const offsets = [
        [0, -radius], [radius, 0], [0, radius], [-radius, 0],
        [radius, -radius], [radius, radius], [-radius, radius], [-radius, -radius]
      ];
      for (const [dx, dy] of offsets) {
        const candidate = candidateForAnchor(Math.max(w - inset, minAnchorCol + dx), Math.max(h - inset, minAnchorRow + dy));
        if (clear(candidate)) return candidate;
      }
    }
    return edgeSafe;
  }

  function restoreMarbleNear(noteId, anchorCol, anchorRow, { fromHolder = false } = {}) {
    const note = boardNoteById(noteId);
    if (!note || !note.marbled || note.marbleRail === "delete") return false;
    const home = note.marbleRail || note.marbleHome || "";
    const placement = restorePlacementFromAnchor(note, anchorCol, anchorRow);
    const { anchorCol: resolvedAnchorCol, anchorRow: resolvedAnchorRow, ...geometry } = placement;
    growBoardForRectangle(geometry.col, geometry.row, geometry.w, geometry.h);
    Object.assign(note, geometry, {
      marbled: false,
      marbleRail: "",
      marbleHome: home,
      marbleTemporal: Boolean(home),
      marbleCol: Number(resolvedAnchorCol) || 0,
      marbleRow: Number(resolvedAnchorRow) || 0,
      marbleRailOrder: 0,
      updatedAt: new Date().toISOString()
    });
    bringNoteToFront(noteId, { persist: false, refresh: false });
    saveState();
    replaceDrawingBoardNoteElement(noteId);
    refreshMarbleDock();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    setBoardSelection(noteId);
    if (fromHolder) showToast(`${holderDefinition(home).label} note opened in temporary board space.`);
    return true;
  }

  function restoreHolderMarble(noteId) {
    const note = boardNoteById(noteId);
    if (!note || !note.marbled || !note.marbleRail) return false;
    if (note.marbleRail === "delete") {
      showToast("This note is marked for deletion. Drag it out of Delete before opening it.");
      return false;
    }
    // Holder location is UI chrome, not board geometry. Restoring at the pointer
    // made docked marbles reopen underneath the cursor and disconnected a card
    // from the place it came from. Keep the stored marble anchor as the spatial
    // truth; collision repair may move it only as far as necessary.
    return restoreMarbleNear(noteId, note.marbleCol, note.marbleRow, { fromHolder: true });
  }

  function restoreParkedMarble(noteId) {
    const note = boardNoteById(noteId);
    if (!note || !note.marbled || note.marbleRail !== "park") return false;
    const shell = $(".bp-db-shell");
    const rect = shell?.getBoundingClientRect();
    const point = rect ? boardPointFromClient(rect.left + rect.width * 0.5, rect.top + rect.height * 0.35) : { col: note.marbleCol, row: note.marbleRow };
    return restoreMarbleNear(noteId, point?.col ?? note.marbleCol, point?.row ?? note.marbleRow, { fromHolder: true });
  }

  function orphanMarbleNotes() {
    return appState.drawingBoard.notes.filter(note => note.marbled && !normalizeHolderIdentity(note.marbleHome) && !normalizeHolderIdentity(note.marbleRail));
  }

  function updateOrphanSortButton() {
    const button = $("#bpSortOrphanMarbles");
    if (!button) return;
    const count = orphanMarbleNotes().length;
    button.disabled = count === 0;
    button.setAttribute("aria-disabled", String(count === 0));
    button.title = count ? `Sort ${count} orphan marble${count === 1 ? "" : "s"} into ${holderDefinition(sortingHolderId()).label}` : "No orphan marbles to sort";
    const label = button.querySelector("b");
    if (label) label.textContent = count ? `Sort Orphans · ${count}` : "Sort Orphans";
  }

  function addOrphanToSortingBucket(noteId) {
    const note = boardNoteById(noteId);
    if (!note) return false;
    if (note.marbleHome || note.marbleRail) {
      showToast("That note already belongs to a holder.");
      return false;
    }
    ensureNoteIsMarbled(note);
    const destination = sortingHolderId();
    note.marbleRail = destination;
    note.marbleHome = destination;
    note.marbleTemporal = false;
    note.marbleRailOrder = nextMarbleRailOrder();
    note.updatedAt = new Date().toISOString();
    saveState();
    replaceDrawingBoardNoteElement(note.id, { remountTypewriter: false });
    refreshMarbleDock();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    updateOrphanSortButton();
    showToast(`${note.title || "Note"} added to ${holderDefinition(destination).label}.`);
    return true;
  }

  function sortAllOrphanMarbles() {
    const orphans = orphanMarbleNotes();
    if (!orphans.length) { showToast("No orphan marbles to sort."); updateOrphanSortButton(); return 0; }
    const destination = sortingHolderId();
    let order = nextMarbleRailOrder();
    const now = new Date().toISOString();
    orphans.forEach(note => {
      note.marbleRail = destination;
      note.marbleHome = destination;
      note.marbleTemporal = false;
      note.marbleRailOrder = order++;
      note.updatedAt = now;
    });
    saveState();
    orphans.forEach(note => replaceDrawingBoardNoteElement(note.id, { remountTypewriter: false }));
    refreshMarbleDock();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    updateOrphanSortButton();
    showToast(`${orphans.length} orphan marble${orphans.length === 1 ? "" : "s"} sorted into ${holderDefinition(destination).label}.`);
    return orphans.length;
  }

  function returnMarblesToHolder(rail) {
    if (!isBoardHolderId(rail)) return 0;
    const notes = holderOwnedNotes(rail, { temporalOnly: true });
    if (!notes.length) return 0;
    notes.forEach(note => {
      ensureNoteIsMarbled(note);
      note.marbleRail = rail;
      note.marbleHome = rail;
      note.marbleTemporal = false;
      note.marbleRailOrder = nextMarbleRailOrder();
      note.updatedAt = new Date().toISOString();
    });
    saveState();
    notes.forEach(note => replaceDrawingBoardNoteElement(note.id, { remountTypewriter: false }));
    refreshMarbleDock();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    showToast(`${notes.length} marble${notes.length === 1 ? "" : "s"} returned to ${holderDefinition(rail).label}.`);
    return notes.length;
  }

  function returnAllOwnedMarbles() {
    const changed = [];
    boardHolderDefinitions().forEach(definition => {
      if (definition.id === "delete") return;
      holderOwnedNotes(definition.id, { temporalOnly: true }).forEach(note => {
        ensureNoteIsMarbled(note);
        note.marbleRail = definition.id;
        note.marbleHome = definition.id;
        note.marbleTemporal = false;
        note.marbleRailOrder = nextMarbleRailOrder();
        note.updatedAt = new Date().toISOString();
        changed.push(note);
      });
    });
    if (!changed.length) { showToast("No temporary holder marbles to return."); return 0; }
    saveState();
    changed.forEach(note => replaceDrawingBoardNoteElement(note.id, { remountTypewriter: false }));
    refreshMarbleDock();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    showToast(`${changed.length} marble${changed.length === 1 ? "" : "s"} returned to their holders.`);
    return changed.length;
  }

  function unmarkDeletionToPark(noteId) {
    const note = boardNoteById(noteId);
    if (!note || note.marbleRail !== "delete") return false;
    note.marbleHome = "";
    note.marbleTemporal = false;
    return setNoteMarbleRail(noteId, "park");
  }

  function deleteAllMarkedNotes() {
    const marked = marbleRailNotes("delete");
    if (!marked.length) return false;
    if (!confirm(`Permanently delete ${marked.length} marked note${marked.length === 1 ? "" : "s"}?`)) return false;
    const ids = new Set(marked.map(note => note.id));
    if (runtime.boardTypewriterNoteId && ids.has(runtime.boardTypewriterNoteId)) destroyBoardTypewriter();
    ids.forEach(id => runtime.boardMarkdownEditingIds.delete(id));
    appState.drawingBoard.notes = appState.drawingBoard.notes.filter(note => !ids.has(note.id));
    if (ids.has(runtime.openLinksNoteId)) runtime.openLinksNoteId = "";
    if (ids.has(runtime.boardRepairTargetId)) runtime.boardRepairTargetId = "";
    if (ids.has(runtime.boardSelectedNoteId)) runtime.boardSelectedNoteId = "";
    if (ids.has(runtime.boardCardSettingsNoteId)) runtime.boardCardSettingsNoteId = "";
    if (ids.has(runtime.boardStyleNoteId)) runtime.boardStyleNoteId = "";
    saveState();
    refreshMarbleDock();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    showToast(`${marked.length} marked note${marked.length === 1 ? "" : "s"} deleted.`);
    return true;
  }

  function normalizeBoardZOrder() {
    const ordered = [...appState.drawingBoard.notes].sort((a, b) => a.z - b.z);
    ordered.forEach((note, index) => { note.z = index + 1; });
    appState.drawingBoard.nextZ = ordered.length + 1;
    ordered.forEach(note => {
      const element = $(`[data-note-id="${selectorEscape(note.id)}"]`);
      if (element) element.style.zIndex = String(note.z);
    });
  }

  function bringNoteToFront(noteId, { persist = true, refresh = true } = {}) {
    const note = boardNoteById(noteId);
    if (!note) return false;
    if (appState.drawingBoard.nextZ > 420) normalizeBoardZOrder();
    appState.drawingBoard.nextZ += 1;
    note.z = appState.drawingBoard.nextZ;
    note.updatedAt = new Date().toISOString();
    const element = $(`[data-note-id="${selectorEscape(note.id)}"]`);
    if (element) element.style.zIndex = String(note.z);
    if (persist) saveState();
    if (refresh) refreshBoardOverlayLayer();
    return true;
  }

  function syncDrawingBoardNoteElement(note, element = $(`[data-note-id="${selectorEscape(note?.id || "")}"]`, $("#bpDrawingBoardGrid") || document)) {
    if (!note || note.marbleRail || !element) return;
    const cfg = CONFIG.drawingBoard;
    const geometry = safeNoteGeometry(note);
    const cellPx = Math.max(1, runtime.boardView.cellPx || CONFIG.drawingBoard.baseRenderedCellPx);
    if (note.marbled || element.classList.contains("bp-db-marble")) {
      const diameter = CONFIG.drawingBoard.marbleDiameterPx;
      const anchorInsetCells = cfg.marbleAnchorInsetPx / Math.max(1, Number(runtime.boardView.cellPx) || cfg.baseRenderedCellPx);
      const marbleCol = Number.isFinite(Number(note.marbleCol)) ? Number(note.marbleCol) : geometry.col + geometry.w - anchorInsetCells;
      const marbleRow = Number.isFinite(Number(note.marbleRow)) ? Number(note.marbleRow) : geometry.row + geometry.h - anchorInsetCells;
      element.style.left = `${(marbleCol * cellPx) - (diameter / 2)}px`;
      element.style.top = `${(marbleRow * cellPx) - (diameter / 2)}px`;
      element.style.width = `${diameter}px`;
      element.style.height = `${diameter}px`;
      element.style.zIndex = String(note.z);
      element.classList.toggle("is-invalid", boardGeometryIssues(note).length > 0);
      return;
    }
    element.style.left = `${geometry.col * cellPx}px`;
    element.style.top = `${geometry.row * cellPx}px`;
    element.style.width = `${geometry.w * cellPx}px`;
    element.style.height = `${geometry.h * cellPx}px`;
    element.style.zIndex = String(note.z);
    element.classList.toggle("bp-db-note-narrow", geometry.w <= CONFIG.drawingBoard.minW);
    element.classList.toggle("bp-db-note-invalid", boardGeometryIssues(note).length > 0);
    updateDrawingBoardNotePresentation(element);
  }

  function replaceDrawingBoardNoteElement(noteId, { remountTypewriter = true } = {}) {
    const note = boardNoteById(noteId);
    const board = $("#bpDrawingBoardGrid");
    if (!note || !board) return null;
    const current = $(`[data-note-id="${selectorEscape(noteId)}"]`, board);
    const template = document.createElement("template");
    template.innerHTML = renderDrawingBoardNote(note).trim();
    const next = template.content.firstElementChild;
    if (!next) {
      current?.remove();
      return null;
    }
    if (current) current.replaceWith(next);
    else board.append(next);
    updateDrawingBoardNotePresentation(next);
    if (remountTypewriter && note.presentation === "typewriter" && runtime.boardTypewriterNoteId === note.id && !runtime.boardMarkdownEditingIds.has(note.id)) {
      requestAnimationFrame(() => startBoardTypewriter(note.id));
    }
    return next;
  }

  function updateDrawingBoardCountPill() {
    const pill = $("#bpDbCountPill");
    if (pill) {
      const groups = (appState.drawingBoard.groups || []).length;
      const marbles = appState.drawingBoard.notes.filter(note => note.marbled).length;
      const collapsed = appState.drawingBoard.notes.filter(note => note.collapsed && !note.marbled).length;
      const parked = appState.drawingBoard.notes.filter(note => note.marbled && note.marbleRail === "park").length;
      const marked = appState.drawingBoard.notes.filter(note => note.marbled && note.marbleRail === "delete").length;
      const temporary = appState.drawingBoard.notes.filter(note => note.marbleHome && note.marbleTemporal).length;
      pill.textContent = `${appState.drawingBoard.notes.length} notes${groups ? ` · ${groups} group${groups === 1 ? "" : "s"}` : ""} · ${collapsed} collapsed · ${marbles} marbles${temporary ? ` · ${temporary} temp` : ""}${parked ? ` · ${parked} important` : ""}${marked ? ` · ${marked} marked` : ""}`;
    }
    updateOrphanSortButton();
  }

  function refreshBoardOverlayLayer() {
    const layer = $("#bpDbOverlayLayer");
    if (!layer) return;
    const repair = renderRepairNavigator();
    const links = renderSavedLinksInspector();
    const style = renderDrawingBoardStyleLab();
    const holders = renderHolderManager();
    layer.classList.toggle("has-repair", Boolean(repair));
    layer.classList.toggle("has-style-lab", Boolean(style));
    layer.classList.toggle("has-holder-manager", Boolean(holders));
    layer.innerHTML = `${repair}${links}${style}${holders}`;
    syncBoardMarbleAnimationFrame();
    if (holders && runtime.boardHolderManagerFocusId) {
      requestAnimationFrame(() => $(`[data-db-holder-name="${selectorEscape(runtime.boardHolderManagerFocusId)}"]`)?.focus?.());
    }
  }

  function refreshDrawingBoardAfterMutation({ addedNoteId = "" } = {}) {
    if (appState.activeTab !== "drawingBoard") return;
    if (addedNoteId) replaceDrawingBoardNoteElement(addedNoteId);
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    refreshDrawingBoardCardPresentation($("#bpDrawingBoardGrid") || document);
  }

  function destroyBoardTypewriter({ keepActive = false } = {}) {
    runtime.boardTypewriterLoadToken += 1;
    try { runtime.boardTypewriterEngine?.unmount?.(); } catch (error) { console.warn(error); }
    runtime.boardTypewriterEngine = null;
    if (!keepActive) runtime.boardTypewriterNoteId = "";
  }

  function startBoardTypewriter(noteId, { restart = false } = {}) {
    const note = boardNoteById(noteId);
    if (!note || note.contentMode !== "markdown" || note.presentation !== "typewriter" || runtime.boardMarkdownEditingIds.has(noteId)) return;
    const output = $(`[data-db-typewriter-output="${selectorEscape(noteId)}"]`);
    if (!output) return;
    const factory = window.MarkdownTypewriter?.createInstance;
    if (typeof factory !== "function") {
      output.innerHTML = renderBoardMarkdown(note.markdownSource);
      output.dataset.typewriterFallback = "true";
      return;
    }
    if (runtime.boardTypewriterNoteId !== noteId || !runtime.boardTypewriterEngine || restart) {
      destroyBoardTypewriter({ keepActive: true });
      runtime.boardTypewriterNoteId = noteId;
      runtime.boardTypewriterEngine = factory();
    }
    const engine = runtime.boardTypewriterEngine;
    const token = ++runtime.boardTypewriterLoadToken;
    try {
      engine.mount(output);
      const parameters = typewriterParameters(appState.notes.typewriter);
      parameters.playback = parameters.playback || {};
      parameters.playback.rate = 1;
      engine.loadNote({
        id: `board:${note.id}`,
        markdown: note.markdownSource || "",
        origin: "drawing-board",
        parameters
      }, { output, resume: true, finishNow: false }).catch(error => {
        if (token !== runtime.boardTypewriterLoadToken) return;
        console.warn(error);
        output.innerHTML = renderBoardMarkdown(note.markdownSource);
      });
    } catch (error) {
      console.warn(error);
      output.innerHTML = renderBoardMarkdown(note.markdownSource);
    }
  }

  function activateBoardTypewriter(noteId, { replay = false } = {}) {
    const note = boardNoteById(noteId);
    if (!note || note.contentMode !== "markdown" || note.presentation !== "typewriter") return;
    const previous = runtime.boardTypewriterNoteId;
    runtime.boardTypewriterNoteId = noteId;
    if (previous && previous !== noteId) replaceDrawingBoardNoteElement(previous);
    replaceDrawingBoardNoteElement(noteId, { remountTypewriter: false });
    startBoardTypewriter(noteId, { restart: replay || previous !== noteId });
  }

  function setBoardSelection(noteId = "") {
    runtime.boardSelectedNoteId = noteId;
    $$(".bp-db-note").forEach(element => element.classList.toggle("bp-db-note-links-selected", element.dataset.noteId === noteId || element.dataset.noteId === runtime.openLinksNoteId || element.dataset.noteId === runtime.boardRepairTargetId));
    $$(".bp-db-marble, .bp-db-rail-marble").forEach(element => element.classList.toggle("is-selected", element.dataset.noteId === noteId || element.dataset.noteId === runtime.boardRepairTargetId));
  }

  function pulseBoardTarget(element) {
    const stage = $(".bp-db-stage");
    if (!stage || !element) return false;
    const rect = element.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    if (!rect.width && !rect.height) return false;
    const ping = document.createElement("span");
    ping.className = "bp-db-centre-ping";
    ping.style.left = `${rect.left - stageRect.left + (rect.width / 2)}px`;
    ping.style.top = `${rect.top - stageRect.top + (rect.height / 2)}px`;
    stage.append(ping);
    ping.addEventListener("animationend", () => ping.remove(), { once: true });
    window.setTimeout(() => ping.remove(), 1100);
    return true;
  }

  function pulseBoardNoteTarget(noteId) {
    const note = boardNoteById(noteId);
    if (!note) return false;
    const direct = $(`[data-note-id="${selectorEscape(noteId)}"]`);
    if (direct && direct.getClientRects().length) return pulseBoardTarget(direct);
    if (note.marbleRail) {
      const holder = $(`[data-db-holder="${selectorEscape(note.marbleRail)}"]`);
      const toggle = holder?.querySelector?.("[data-db-holder-toggle]");
      if (toggle) return pulseBoardTarget(toggle);
    }
    return false;
  }

  function centreBoardOnNote(noteId) {
    const note = boardNoteById(noteId);
    if (!note) return false;
    if (note.marbleRail) {
      setBoardSelection(noteId);
      const railMarble = $(`[data-db-rail-marble-drag="${selectorEscape(noteId)}"]`);
      railMarble?.focus?.();
      requestAnimationFrame(() => pulseBoardNoteTarget(noteId));
      showToast(note.marbleRail === "delete" ? "That note is in the deletion holder." : `That note is in the ${holderDefinition(note.marbleRail).label} holder.`);
      return true;
    }
    const shell = $(".bp-db-shell");
    const board = $("#bpDrawingBoardGrid");
    const element = board ? $(`[data-note-id="${selectorEscape(noteId)}"]`, board) : null;
    if (!shell || !element) return false;
    const left = element.offsetLeft + (element.offsetWidth / 2) - (shell.clientWidth / 2);
    const top = element.offsetTop + (element.offsetHeight / 2) - (shell.clientHeight / 2);
    shell.scrollTo({ left: Math.max(0, left), top: Math.max(0, top), behavior: "smooth" });
    setBoardSelection(noteId);
    let pinged = false;
    const ping = () => {
      if (pinged) return;
      pinged = pulseBoardNoteTarget(noteId);
    };
    if ("onscrollend" in shell) shell.addEventListener("scrollend", ping, { once: true });
    window.setTimeout(ping, 280);
    return true;
  }

  function moveNoteToOrigin(noteId) {
    const note = boardNoteById(noteId);
    if (!note) return false;
    const safe = safeNoteGeometry(note);
    Object.assign(note, safe, { col: 0, row: 0, geometryWarnings: [], updatedAt: new Date().toISOString() });
    if (note.marbled) { note.marbleCol = 0; note.marbleRow = 0; }
    saveState();
    syncDrawingBoardNoteElement(note);
    refreshBoardOverlayLayer();
    centreBoardOnNote(noteId);
    return true;
  }

  function duplicateNoteAtOrigin(noteId) {
    const note = boardNoteById(noteId);
    if (!note) return null;
    const now = new Date().toISOString();
    const safe = safeNoteGeometry(note);
    if (appState.drawingBoard.nextZ > 420) normalizeBoardZOrder();
    appState.drawingBoard.nextZ += 1;
    const copy = {
      ...clone(note),
      id: uid("card"),
      title: `${note.title || "Note"} copy`.slice(0, 160),
      col: 0,
      row: 0,
      w: safe.w,
      h: safe.h,
      expandedH: safe.expandedH,
      z: appState.drawingBoard.nextZ,
      marbled: false,
      marbleCol: safe.w,
      marbleRow: 0,
      marbleRail: "",
      marbleRailOrder: 0,
      preMarbleCollapsed: false,
      geometryWarnings: [],
      links: normalizeLinks(note.links),
      createdAt: now,
      updatedAt: now
    };
    appState.drawingBoard.notes.push(copy);
    saveState();
    replaceDrawingBoardNoteElement(copy.id);
    updateDrawingBoardCountPill();
    runtime.boardRepairTargetId = copy.id;
    refreshBoardOverlayLayer();
    centreBoardOnNote(copy.id);
    return copy;
  }

  function deleteDrawingBoardNote(noteId) {
    if (!boardNoteById(noteId)) return false;
    if (runtime.boardTypewriterNoteId === noteId) destroyBoardTypewriter();
    runtime.boardMarkdownEditingIds.delete(noteId);
    if (runtime.openLinksNoteId === noteId) runtime.openLinksNoteId = "";
    if (runtime.boardRepairTargetId === noteId) runtime.boardRepairTargetId = "";
    if (runtime.boardSelectedNoteId === noteId) runtime.boardSelectedNoteId = "";
    if (runtime.boardCardSettingsNoteId === noteId) runtime.boardCardSettingsNoteId = "";
    if (runtime.boardStyleNoteId === noteId) runtime.boardStyleNoteId = "";
    appState.drawingBoard.notes = appState.drawingBoard.notes.filter(note => note.id !== noteId);
    $$(`[data-note-id="${selectorEscape(noteId)}"]`).forEach(element => element.remove());
    saveState();
    refreshMarbleDock();
    updateDrawingBoardCountPill();
    refreshBoardOverlayLayer();
    return true;
  }

  function insertMarkdownCodeBlock(noteId, textarea = null) {
    const note = boardNoteById(noteId);
    if (!note) return;
    if (!runtime.boardMarkdownEditingIds.has(noteId)) {
      runtime.boardMarkdownEditingIds.add(noteId);
      replaceDrawingBoardNoteElement(noteId);
      textarea = $(`[data-db-markdown-source="${selectorEscape(noteId)}"]`);
    }
    if (!textarea) textarea = $(`[data-db-markdown-source="${selectorEscape(noteId)}"]`);
    if (!textarea) return;
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? start;
    const selected = textarea.value.slice(start, end);
    const block = `\n\`\`\`text\n${selected || "// code"}\n\`\`\`\n`;
    textarea.setRangeText(block, start, end, "end");
    persistMarkdownSource(note, textarea);
    queueSaveState();
    textarea.focus();
  }

  function boardNotePlainSource(note) {
    const mode = normalizeBoardContentMode(note?.contentMode);
    if (mode === "markdown") return note?.markdownSource || "";
    if (mode === "code") return note?.codeSource || "";
    if (mode === "ab") return abNoteText(note);
    if (mode === "todo") return todoItemsText(note?.todoItems);
    if (mode === "table") return tableCellsText(note?.tableCells);
    return note?.text || textFromHTML(note?.html || "");
  }

  function boardNoteAsRichHTML(note) {
    const mode = normalizeBoardContentMode(note?.contentMode);
    if (mode === "markdown") return renderBoardMarkdown(note?.markdownSource || "");
    if (mode === "code") return `<pre><code>${escapeHTML(note?.codeSource || "")}</code></pre>`;
    if (mode === "ab") {
      const a = sanitizeRichHTML(note?.abAHtml || "");
      const b = sanitizeRichHTML(note?.abBHtml || "");
      return `<h3>${escapeHTML(normalizeAbLabel(note?.abALabel, "A"))}</h3>${a}<h3>${escapeHTML(normalizeAbLabel(note?.abBLabel, "B"))}</h3>${b}`;
    }
    if (mode === "todo") return `<ul>${normalizeTodoItems(note?.todoItems).map(item => `<li>${item.done ? "☑" : "☐"} ${escapeHTML(item.text)}</li>`).join("")}</ul>`;
    if (mode === "table") {
      const rows = normalizeTableCells(note?.tableCells);
      return `<table><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHTML(cell).replace(/\n/g, "<br>")}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }
    return sanitizeRichHTML(note?.html || linkifyText(note?.text || ""));
  }

  function boardNoteAsMarkdown(note) {
    const mode = normalizeBoardContentMode(note?.contentMode);
    if (mode === "markdown") return note?.markdownSource || "";
    if (mode === "code") return `\`\`\`${note?.codeLanguage || "text"}
${note?.codeSource || ""}
\`\`\``;
    if (mode === "ab") return `## ${normalizeAbLabel(note?.abALabel, "A")}

${textFromHTML(note?.abAHtml || "")}

## ${normalizeAbLabel(note?.abBLabel, "B")}

${textFromHTML(note?.abBHtml || "")}`.trim();
    if (mode === "todo") return todoItemsText(note?.todoItems);
    if (mode === "table") {
      const rows = normalizeTableCells(note?.tableCells);
      const escapeCell = value => String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
      const head = rows[0] || ["", ""];
      const body = rows.slice(1);
      return [`| ${head.map(escapeCell).join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...body.map(row => `| ${row.map(escapeCell).join(" | ")} |`)].join("\n");
    }
    return boardNotePlainSource(note);
  }

  function setBoardContentMode(noteId, mode) {
    const note = boardNoteById(noteId);
    if (!note || !BOARD_NOTE_TYPE_MAP.has(mode) || note.contentMode === mode) return false;
    commitDrawingBoardBodies();
    const plainSource = boardNotePlainSource(note);
    const richSource = boardNoteAsRichHTML(note);
    const markdownSource = boardNoteAsMarkdown(note);

    if (mode === "rich") {
      note.contentMode = "rich";
      note.presentation = "static";
      note.html = richSource;
      note.text = plainSource;
      runtime.boardMarkdownEditingIds.delete(note.id);
      if (runtime.boardTypewriterNoteId === note.id) destroyBoardTypewriter();
    } else if (mode === "markdown") {
      note.contentMode = "markdown";
      note.presentation = "static";
      note.markdownSource = markdownSource;
      note.text = note.markdownSource;
      runtime.boardMarkdownEditingIds.add(note.id);
    } else if (mode === "code") {
      note.contentMode = "code";
      note.presentation = "static";
      note.codeSource = plainSource;
      note.codeLanguage = note.codeLanguage || "text";
      note.text = note.codeSource;
      runtime.boardMarkdownEditingIds.delete(note.id);
      if (runtime.boardTypewriterNoteId === note.id) destroyBoardTypewriter();
    } else if (mode === "ab") {
      note.contentMode = "ab";
      note.presentation = "static";
      const sourceText = plainSource;
      note.abALabel = normalizeAbLabel(note.abALabel, "A");
      note.abBLabel = normalizeAbLabel(note.abBLabel, "B");
      note.abAHtml = note.abAHtml || sanitizeRichHTML(linkifyText(sourceText || ""));
      note.abBHtml = note.abBHtml || "";
      note.text = abNoteText(note);
      runtime.boardMarkdownEditingIds.delete(note.id);
      if (runtime.boardTypewriterNoteId === note.id) destroyBoardTypewriter();
    } else if (mode === "todo") {
      note.contentMode = "todo";
      note.presentation = "static";
      note.todoItems = normalizeTodoItems(note.todoItems, plainSource);
      if (!note.todoItems.length) note.todoItems = [{ id: `todo-${Date.now().toString(36)}`, text: "New task", done: false }];
      note.text = todoItemsText(note.todoItems);
      runtime.boardMarkdownEditingIds.delete(note.id);
      if (runtime.boardTypewriterNoteId === note.id) destroyBoardTypewriter();
    } else if (mode === "table") {
      note.contentMode = "table";
      note.presentation = "static";
      note.tableCells = normalizeTableCells(note.tableCells, plainSource);
      note.tableWrap = note.tableWrap !== false;
      note.text = tableCellsText(note.tableCells);
      runtime.boardMarkdownEditingIds.delete(note.id);
      if (runtime.boardTypewriterNoteId === note.id) destroyBoardTypewriter();
    }
    note.updatedAt = new Date().toISOString();
    saveState();
    replaceDrawingBoardNoteElement(note.id);
    refreshBoardOverlayLayer();
    return true;
  }

  function setBoardPresentation(noteId, presentation) {
    const note = boardNoteById(noteId);
    if (!note || note.contentMode !== "markdown" || !["static", "typewriter"].includes(presentation) || note.presentation === presentation) return false;
    commitDrawingBoardBodies();
    note.presentation = presentation;
    if (presentation === "typewriter") {
      note.markdownSource = ensureBoardTypewriterTempoSource(note.markdownSource, Number(note.typewriterRate) || 0.5);
      note.text = note.markdownSource;
      note.typewriterRate = 1;
    }
    note.updatedAt = new Date().toISOString();
    runtime.boardMarkdownEditingIds.delete(note.id);
    if (presentation === "typewriter") runtime.boardTypewriterNoteId = note.id;
    else if (runtime.boardTypewriterNoteId === note.id) destroyBoardTypewriter();
    saveState();
    replaceDrawingBoardNoteElement(note.id);
    if (presentation === "typewriter") activateBoardTypewriter(note.id, { replay: true });
    return true;
  }

  function renameDrawingBoardNote(noteId) {
    const note = boardNoteById(noteId);
    if (!note) return false;
    commitDrawingBoardBodies();
    const current = String(note.title || "Note");
    const requested = window.prompt("Rename note", current);
    if (requested === null) return false;
    const next = requested.trim().slice(0, 160);
    if (!next || next === current) return false;
    note.title = next;
    note.updatedAt = new Date().toISOString();
    saveState();
    replaceDrawingBoardNoteElement(note.id);
    refreshBoardOverlayLayer();
    showToast(`Renamed note to ${next}.`);
    return true;
  }

  function renameDrawingBoardGroup(groupId) {
    const group = boardGroupById(groupId);
    if (!group) return false;
    const current = String(group.title || "Group");
    const requested = window.prompt("Rename group", current);
    if (requested === null) return false;
    const next = requested.trim().slice(0, 80);
    if (!next || next === current) return false;
    group.title = next;
    saveState();
    replaceDrawingBoardGroupElement(group.id);
    refreshBoardOverlayLayer();
    showToast(`Renamed group to ${next}.`);
    return true;
  }

  function handleBoardRepairAction(action, noteId) {
    if (!noteId) return;
    if (action === "rename") renameDrawingBoardNote(noteId);
    else if (action === "centre") centreBoardOnNote(noteId);
    else if (action === "origin") moveNoteToOrigin(noteId);
    else if (action === "resize") {
      if (!resetNoteSize(noteId)) {
        const note = boardNoteById(noteId);
        if (note) note.geometryWarnings = [...new Set([...(note.geometryWarnings || []), "no safe placement"])];
        refreshBoardOverlayLayer();
        showToast("No safe placement was available for the default size.");
      } else {
        const note = boardNoteById(noteId);
        if (note) note.geometryWarnings = [];
        saveState();
        replaceDrawingBoardNoteElement(noteId);
        refreshBoardOverlayLayer();
        centreBoardOnNote(noteId);
      }
    } else if (action === "duplicate") duplicateNoteAtOrigin(noteId);
    else if (action === "front") bringNoteToFront(noteId);
    else if (action === "sort-orphan") addOrphanToSortingBucket(noteId);
    else if (action === "mark-delete") setNoteMarbleRail(noteId, "delete");
    else if (action === "unmark") unmarkDeletionToPark(noteId);
    else if (action === "delete-permanent") {
      if (confirm("Permanently delete this marked note?")) deleteDrawingBoardNote(noteId);
    }
  }

  function boardCreationPayloadFromElement(element) {
    if (!element) return null;
    if (element.matches("[data-db-create-color]")) return { kind: "color", tone: Number(element.dataset.dbCreateColor) };
    if (element.matches("[data-db-create-style]")) return { kind: "style", style: element.dataset.dbCreateStyle };
    if (element.matches("[data-db-create-template]")) return { kind: "template", template: element.dataset.dbCreateTemplate };
    return null;
  }

  function boardPointFromClient(clientX, clientY) {
    const board = $("#bpDrawingBoardGrid");
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    const cellPx = Math.max(1, runtime.boardView.cellPx || CONFIG.drawingBoard.baseRenderedCellPx);
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    return { col: Math.round(x / cellPx), row: Math.round(y / cellPx) };
  }

  function updateBoardCreationSelection(kind, value) {
    const creation = boardCreationState();
    if (kind === "color") {
      const tone = Math.max(0, Math.min(DRAWING_BOARD_PALETTE_SIZE - 1, Math.round(Number(value) || 0)));
      creation.tone = creation.tone === tone ? null : tone;
    } else if (kind === "style") {
      const id = BOARD_CREATION_STYLES.some(item => item.id === value) ? value : "";
      creation.style = creation.style === id ? "" : id;
      if (creation.style) creation.template = "";
    } else if (kind === "template") {
      const id = BOARD_CREATION_TEMPLATES.some(item => item.id === value) ? value : "";
      creation.template = creation.template === id ? "" : id;
      if (creation.template) creation.style = "";
    } else if (kind === "clear") {
      creation.tone = null;
      creation.style = "";
      creation.template = "";
    }
    appState.drawingBoard.creation = normalizeDrawingBoardCreation(creation);
    saveState();
    refreshDrawingBoardCreationPalette();
  }

  function bindDrawingBoard() {
    runtime.boardViewCleanup?.();
    runtime.boardViewCleanup = null;
    const board = $("#bpDrawingBoardGrid");
    const shell = $(".bp-db-shell");
    const stage = $(".bp-db-stage");
    applyBoardView({ preserveCenter: false });
    const observeSize = window.MarkdownTypewriter?.observeElementSize;
    if (shell && typeof observeSize === "function") {
      runtime.boardViewCleanup = observeSize(shell, () => applyBoardView(), { immediate: false });
    }

    $("#bpDbViewFit")?.addEventListener("click", () => setBoardViewMode("fit"));
    $("#bpDbViewWidth")?.addEventListener("click", () => setBoardViewMode("width"));
    $("#bpDbViewHeight")?.addEventListener("click", () => setBoardViewMode("height"));
    $("#bpDbZoomOut")?.addEventListener("click", () => nudgeBoardZoom(-1));
    $("#bpDbZoomReadout")?.addEventListener("click", resetBoardZoom);
    $("#bpDbZoomIn")?.addEventListener("click", () => nudgeBoardZoom(1));
    $("#bpReturnMarbles")?.addEventListener("click", () => returnAllOwnedMarbles());
    $("#bpSortOrphanMarbles")?.addEventListener("click", () => sortAllOrphanMarbles());
    updateOrphanSortButton();
    $("#bpManageHolders")?.addEventListener("click", () => {
      commitDrawingBoardBodies();
      runtime.boardHolderManagerOpen = !runtime.boardHolderManagerOpen;
      if (runtime.boardHolderManagerOpen) {
        runtime.boardRepairOpen = false;
        runtime.boardRepairTargetId = "";
        runtime.boardStyleNoteId = "";
        runtime.openLinksNoteId = "";
      }
      refreshBoardOverlayLayer();
    });
    $("#bpRepairBoard")?.addEventListener("click", () => {
      commitDrawingBoardBodies();
      runtime.boardRepairOpen = !runtime.boardRepairOpen;
      if (runtime.boardRepairOpen) runtime.boardHolderManagerOpen = false;
      if (runtime.boardRepairOpen && runtime.boardSelectedNoteId) runtime.boardRepairTargetId = runtime.boardSelectedNoteId;
      refreshBoardOverlayLayer();
      if (runtime.boardRepairOpen) requestAnimationFrame(() => $("[data-db-repair-search]")?.focus());
    });
    $("#bpExportBoard")?.addEventListener("click", exportDrawingBoard);
    $("#bpImportBoardBtn")?.addEventListener("click", () => $("#bpBoardImportFile")?.click());
    $("#bpBoardImportFile")?.addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (file) importDrawingBoard(file);
      event.target.value = "";
    });

    if (!stage || !board) return;

    stage.addEventListener("contextmenu", event => {
      if (event.target.closest("#bpDbCreationPalette, input, textarea, [contenteditable=\"true\"], a")) return;
      event.preventDefault();
      const card = event.target.closest("[data-note-id]");
      runtime.boardRepairOpen = true;
      runtime.boardHolderManagerOpen = false;
      runtime.boardRepairTargetId = card?.dataset.noteId || "";
      if (card) setBoardSelection(card.dataset.noteId);
      refreshBoardOverlayLayer();
    });

    stage.addEventListener("dragstart", event => {
      const source = event.target.closest("[data-db-create-color], [data-db-create-style], [data-db-create-template]");
      if (!source) return;
      const payload = boardCreationPayloadFromElement(source);
      if (!payload) return;
      runtime.boardCreationDrag = payload;
      try {
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("application/x-backpack-board-create", JSON.stringify(payload));
        event.dataTransfer.setData("text/plain", `Backpack:${JSON.stringify(payload)}`);
      } catch (_) {}
      stage.classList.add("is-creating-note");
    });

    stage.addEventListener("dragend", () => {
      runtime.boardCreationDrag = null;
      stage.classList.remove("is-creating-note", "is-create-dragover");
    });

    shell?.addEventListener("dragover", event => {
      if (!runtime.boardCreationDrag && !Array.from(event.dataTransfer?.types || []).includes("application/x-backpack-board-create")) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      stage.classList.add("is-create-dragover");
    });

    shell?.addEventListener("dragleave", event => {
      if (event.relatedTarget && shell.contains(event.relatedTarget)) return;
      stage.classList.remove("is-create-dragover");
    });

    shell?.addEventListener("drop", event => {
      let payload = runtime.boardCreationDrag;
      try {
        const raw = event.dataTransfer?.getData("application/x-backpack-board-create");
        if (raw) payload = JSON.parse(raw);
      } catch (_) {}
      if (!payload) return;
      event.preventDefault();
      const point = boardPointFromClient(event.clientX, event.clientY);
      stage.classList.remove("is-creating-note", "is-create-dragover");
      runtime.boardCreationDrag = null;
      createDrawingBoardNote({ payload, boardPoint: point });
    });

    stage.addEventListener("pointerdown", event => {
      const activeStyleColour = document.activeElement?.matches?.("#bpDbStyleLab input[type=\"color\"]") ? document.activeElement : null;
      if (activeStyleColour && event.target !== activeStyleColour) {
        activeStyleColour.blur();
        runtime.boardStyleColourSettleUntil = performance.now() + 320;
        if (!event.target.closest("[data-db-style-close]")) {
          event.preventDefault();
          event.stopPropagation();
          requestAnimationFrame(() => $("#bpDbStyleLab")?.focus({ preventScroll: true }));
          return;
        }
      }
      if (performance.now() < runtime.boardStyleColourSettleUntil && event.target.closest("[data-db-style-readable]")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const groupResize = event.target.closest("[data-db-group-resize]");
      if (groupResize) return startBoardGroupPointer(event, groupResize.dataset.dbGroupResize, "resize");
      const groupDrag = event.target.closest("[data-db-group-drag]");
      if (groupDrag && !event.target.closest("[data-db-group-resize]")) return startBoardGroupPointer(event, groupDrag.dataset.dbGroupDrag, "move");
      const styleDrag = event.target.closest("[data-db-style-drag]");
      if (styleDrag) return startBoardStyleLabPointer(event);
      const holderGrip = event.target.closest("[data-db-holder-drag]");
      if (holderGrip) return startMarbleHolderPointer(event, holderGrip.dataset.dbHolderDrag);
      const railMarble = event.target.closest("[data-db-rail-marble-drag]");
      if (railMarble) return startRailMarblePointer(event, railMarble.dataset.dbRailMarbleDrag);
      const marble = event.target.closest("[data-db-marble-drag]");
      if (marble) return startMarblePointer(event, marble.dataset.dbMarbleDrag);
      const marbleAnchor = event.target.closest(".bp-db-marble-anchor[data-db-marble-toggle]");
      if (marbleAnchor) return startMarbleAnchorPointer(event, marbleAnchor.dataset.dbMarbleToggle);
      const drag = event.target.closest("[data-db-drag]");
      if (drag) return startNotePointer(event, drag.dataset.dbDrag, "move");
      const collapsed = event.target.closest("[data-db-collapsed-drag]");
      if (collapsed && !event.target.closest("[data-db-marble-toggle], button, input, textarea, a")) return startCollapsedNotePointer(event, collapsed.dataset.dbCollapsedDrag);
      const card = event.target.closest("[data-note-id]");
      if (card && !event.target.closest("button, input, textarea, a, [contenteditable=\"true\"]")) setBoardSelection(card.dataset.noteId);
    });

    stage.addEventListener("dblclick", event => {
      const holderToggle = event.target.closest("[data-db-holder-toggle]");
      if (holderToggle) { event.preventDefault(); event.stopPropagation(); return; }
      const railMarble = event.target.closest("[data-db-rail-marble-drag]");
      if (railMarble) {
        event.preventDefault();
        event.stopPropagation();
        const note = boardNoteById(railMarble.dataset.dbRailMarbleDrag);
        if (note?.marbleRail === "delete") showToast("This note is marked for deletion. Drag it out of Delete before opening it.");
        else if (note?.marbleRail) restoreHolderMarble(note.id);
        return;
      }
      const marbleToggle = event.target.closest(".bp-db-marble[data-db-marble-toggle]");
      if (marbleToggle) {
        event.preventDefault();
        event.stopPropagation();
        commitDrawingBoardBodies();
        toggleNoteMarbled(marbleToggle.dataset.dbMarbleToggle);
        return;
      }

      // Headers are now strictly identity/movement chrome. Presentation state
      // belongs to the bottom-right marble so editing, dragging, and minimizing
      // never compete for the same title gesture.
    });

    stage.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (button?.matches("[data-db-holder-manager-close]")) {
        runtime.boardHolderManagerOpen = false;
        runtime.boardHolderManagerFocusId = "";
        refreshBoardOverlayLayer();
        return;
      }
      if (button?.matches("[data-db-holder-create]")) { createDrawingBoardHolder(); return; }
      if (button?.matches("[data-db-holder-delete]")) { deleteDrawingBoardHolder(button.dataset.dbHolderDelete); return; }
      if (button?.matches("[data-db-palette-expand]")) {
        runtime.boardCreationPaletteExpanded = !runtime.boardCreationPaletteExpanded;
        refreshDrawingBoardCreationPalette();
        return;
      }
      if (button?.matches("[data-db-create-color]")) { updateBoardCreationSelection("color", button.dataset.dbCreateColor); return; }
      if (button?.matches("[data-db-create-style]")) { updateBoardCreationSelection("style", button.dataset.dbCreateStyle); return; }
      if (button?.matches("[data-db-create-template]")) { updateBoardCreationSelection("template", button.dataset.dbCreateTemplate); return; }
      if (button?.matches("[data-db-create-clear]")) { updateBoardCreationSelection("clear"); return; }
      if (button?.matches("[data-db-holder-recall]")) {
        event.preventDefault();
        event.stopPropagation();
        returnMarblesToHolder(button.dataset.dbHolderRecall);
        return;
      }
      if (button?.matches("[data-db-holder-toggle]")) {
        event.preventDefault();
        return;
      }
      if (button?.matches(".bp-db-marble-anchor[data-db-marble-toggle]")) {
        // Pointer gesture recognizer owns click / double-click / resize for the
        // card anchor. Suppress the synthetic click so it cannot execute a
        // second presentation action after pointerup.
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (button?.matches("[data-db-code-copy]")) {
        const note = boardNoteById(button.dataset.dbCodeCopy);
        if (!note) return;
        const source = String(note.codeSource || "");
        const fallback = () => {
          const editor = $(`[data-db-code-source="${selectorEscape(note.id)}"]`);
          editor?.focus(); editor?.select?.();
          showToast("Code selected. Copy it from the terminal.");
        };
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(source).then(() => showToast("Code copied to clipboard.")).catch(fallback);
        else fallback();
        return;
      }
      if (button?.matches("[data-db-links-toggle]")) {
        const id = button.dataset.dbLinksToggle;
        runtime.boardHolderManagerOpen = false;
        runtime.openLinksNoteId = runtime.openLinksNoteId === id ? "" : id;
        refreshBoardOverlayLayer();
        setBoardSelection(id);
        return;
      }
      if (button?.matches("[data-db-links-close]")) {
        runtime.openLinksNoteId = "";
        refreshBoardOverlayLayer();
        return;
      }
      if (button?.matches("[data-db-reset-size]")) {
        const id = button.dataset.dbResetSize;
        if (!resetNoteSize(id)) {
          const note = boardNoteById(id);
          if (note) note.geometryWarnings = [...new Set([...(note.geometryWarnings || []), "no safe placement"])];
          refreshBoardOverlayLayer();
          showToast("No safe space was available to reset this note.");
        } else {
          const note = boardNoteById(id); if (note) note.geometryWarnings = [];
          saveState(); replaceDrawingBoardNoteElement(id); refreshBoardOverlayLayer();
        }
        return;
      }
      if (button?.matches("[data-db-link-delete]")) {
        const note = boardNoteById(button.dataset.dbLinkDelete);
        if (!note) return;
        note.links = normalizeLinks(note.links).filter(link => link.id !== button.dataset.dbLinkId);
        note.updatedAt = new Date().toISOString();
        saveState(); replaceDrawingBoardNoteElement(note.id); refreshBoardOverlayLayer();
        return;
      }
      if (button?.matches("[data-db-settings-toggle]")) {
        const id = button.dataset.dbSettingsToggle;
        commitDrawingBoardBodies();
        const previous = runtime.boardCardSettingsNoteId;
        runtime.boardCardSettingsNoteId = previous === id ? "" : id;
        if (previous && previous !== id) replaceDrawingBoardNoteElement(previous);
        replaceDrawingBoardNoteElement(id);
        return;
      }
      if (button?.matches("[data-db-settings-close]")) {
        const id = button.dataset.dbSettingsClose;
        runtime.boardCardSettingsNoteId = "";
        replaceDrawingBoardNoteElement(id);
        return;
      }
      if (button?.matches("[data-db-style-open]")) {
        const id = button.dataset.dbStyleOpen;
        commitDrawingBoardBodies();
        runtime.boardHolderManagerOpen = false;
        runtime.boardStyleNoteId = id;
        runtime.boardCardSettingsNoteId = "";
        replaceDrawingBoardNoteElement(id);
        refreshBoardOverlayLayer();
        return;
      }
      if (button?.matches("[data-db-style-close]")) {
        runtime.boardStyleNoteId = "";
        refreshBoardOverlayLayer();
        return;
      }
      if (button?.matches("[data-db-style-tone]")) {
        const note = boardNoteById(button.dataset.noteId);
        if (!note) return;
        note.colorMode = "theme";
        note.themeTone = Math.max(0, Math.min(DRAWING_BOARD_PALETTE_SIZE - 1, Number(button.dataset.dbStyleTone) || 0));
        note.textColorMode = "auto";
        refreshBoardNoteStyle(note, { refreshOverlay: true });
        return;
      }
      if (button?.matches("[data-db-style-theme-reset]")) {
        const note = boardNoteById(button.dataset.dbStyleThemeReset);
        if (!note) return;
        note.colorMode = "theme";
        note.textColorMode = "auto";
        refreshBoardNoteStyle(note, { refreshOverlay: true });
        return;
      }
      if (button?.matches("[data-db-style-marble-mode]")) {
        const note = boardNoteById(button.dataset.noteId);
        if (!note) return;
        const next = normalizeMarbleAppearance(button.dataset.dbStyleMarbleMode, note.marbleValue);
        note.marbleMode = next.mode;
        note.marbleValue = next.value;
        refreshBoardNoteStyle(note, { refreshOverlay: true });
        return;
      }
      if (button?.matches("[data-db-style-marble-value]")) {
        const note = boardNoteById(button.dataset.noteId);
        if (!note) return;
        const next = normalizeMarbleAppearance(note.marbleMode, button.dataset.dbStyleMarbleValue);
        note.marbleMode = next.mode;
        note.marbleValue = next.value;
        // Family selection changes geometry only. Keep any authored A/B palette so
        // designers can compare procedural families without losing colour work.
        refreshBoardNoteStyle(note, { refreshOverlay: true });
        return;
      }
      if (button?.matches("[data-db-style-marble-clear-colours]")) {
        const note = boardNoteById(button.dataset.dbStyleMarbleClearColours);
        if (!note) return;
        note.marbleColorA = "";
        note.marbleColorB = "";
        refreshBoardNoteStyle(note, { refreshOverlay: true });
        return;
      }
      if (button?.matches("[data-db-style-marble-generate]")) {
        const note = boardNoteById(button.dataset.dbStyleMarbleGenerate);
        if (!note) return;
        const current = Math.max(0, Math.min(9999, Number(note.marbleSeed) || 417));
        note.marbleSeed = (current + 137) % 10000;
        // A small deterministic angle drift makes successive seeds visually
        // distinct without changing the author's selected family or colours.
        note.marbleAngle = (Math.round(Number(note.marbleAngle) || 135) + 23 + (note.marbleSeed % 17)) % 360;
        note.updatedAt = new Date().toISOString();
        refreshBoardNoteStyle(note, { refreshOverlay: true });
        return;
      }
      if (button?.matches("[data-db-todo-add]")) {
        const note = boardNoteById(button.dataset.dbTodoAdd);
        if (!note || note.contentMode !== "todo") return;
        note.todoItems = normalizeTodoItems(note.todoItems);
        const nextIndex = note.todoItems.length + 1;
        note.todoItems.push({ id: `todo-${Date.now().toString(36)}-${nextIndex}`, text: "", done: false });
        note.text = todoItemsText(note.todoItems);
        note.updatedAt = new Date().toISOString();
        saveState();
        replaceDrawingBoardNoteElement(note.id);
        requestAnimationFrame(() => {
          const inputs = $$(`[data-db-todo-text="${selectorEscape(note.id)}"]`);
          inputs[inputs.length - 1]?.focus();
        });
        return;
      }
      if (button?.matches("[data-db-todo-delete]")) {
        const note = boardNoteById(button.dataset.dbTodoDelete);
        if (!note || note.contentMode !== "todo") return;
        const itemId = button.dataset.dbTodoItem;
        note.todoItems = normalizeTodoItems(note.todoItems).filter(item => item.id !== itemId);
        note.text = todoItemsText(note.todoItems);
        note.updatedAt = new Date().toISOString();
        saveState();
        replaceDrawingBoardNoteElement(note.id);
        return;
      }
      if (button?.matches("[data-db-table-add-row]")) {
        const note = boardNoteById(button.dataset.dbTableAddRow);
        if (!note || note.contentMode !== "table") return;
        commitDrawingBoardBodies();
        const rows = normalizeTableCells(note.tableCells);
        const cols = rows[0]?.length || 2;
        if (rows.length >= 100) { showToast("Table row limit reached."); return; }
        rows.push(Array.from({ length: cols }, () => ""));
        note.tableCells = rows;
        note.text = tableCellsText(rows);
        note.updatedAt = new Date().toISOString();
        saveState();
        replaceDrawingBoardNoteElement(note.id);
        requestAnimationFrame(() => $(`[data-db-table-cell="${selectorEscape(note.id)}"][data-db-table-row="${rows.length - 1}"][data-db-table-col="0"]`)?.focus());
        return;
      }
      if (button?.matches("[data-db-table-remove-row]")) {
        const note = boardNoteById(button.dataset.dbTableRemoveRow);
        if (!note || note.contentMode !== "table") return;
        commitDrawingBoardBodies();
        const rows = normalizeTableCells(note.tableCells);
        if (rows.length <= 1) { showToast("A table needs at least one row."); return; }
        const lastRow = rows[rows.length - 1] || [];
        const hasContent = lastRow.some(cell => String(cell || "").trim());
        if (hasContent && !confirm("Remove the bottom row and its contents?")) return;
        rows.pop();
        note.tableCells = rows;
        note.text = tableCellsText(rows);
        note.updatedAt = new Date().toISOString();
        saveState();
        replaceDrawingBoardNoteElement(note.id);
        requestAnimationFrame(() => $(`[data-db-table-cell="${selectorEscape(note.id)}"][data-db-table-row="${rows.length - 1}"][data-db-table-col="0"]`)?.focus());
        return;
      }
      if (button?.matches("[data-db-table-add-col]")) {
        const note = boardNoteById(button.dataset.dbTableAddCol);
        if (!note || note.contentMode !== "table") return;
        commitDrawingBoardBodies();
        const rows = normalizeTableCells(note.tableCells);
        const cols = rows[0]?.length || 2;
        if (cols >= 24) { showToast("Table column limit reached."); return; }
        rows.forEach(row => row.push(""));
        note.tableCells = rows;
        note.text = tableCellsText(rows);
        note.updatedAt = new Date().toISOString();
        saveState();
        replaceDrawingBoardNoteElement(note.id);
        requestAnimationFrame(() => $(`[data-db-table-cell="${selectorEscape(note.id)}"][data-db-table-row="0"][data-db-table-col="${cols}"]`)?.focus());
        return;
      }
      if (button?.matches("[data-db-table-remove-col]")) {
        const note = boardNoteById(button.dataset.dbTableRemoveCol);
        if (!note || note.contentMode !== "table") return;
        commitDrawingBoardBodies();
        const rows = normalizeTableCells(note.tableCells);
        const cols = rows[0]?.length || 2;
        if (cols <= 1) { showToast("A table needs at least one column."); return; }
        const hasContent = rows.some(row => String(row[cols - 1] || "").trim());
        if (hasContent && !confirm("Remove the rightmost column and its contents?")) return;
        rows.forEach(row => row.pop());
        note.tableCells = rows;
        note.text = tableCellsText(rows);
        note.updatedAt = new Date().toISOString();
        saveState();
        replaceDrawingBoardNoteElement(note.id);
        requestAnimationFrame(() => $(`[data-db-table-cell="${selectorEscape(note.id)}"][data-db-table-row="0"][data-db-table-col="${cols - 2}"]`)?.focus());
        return;
      }
      if (button?.matches("[data-db-table-wrap]")) {
        const note = boardNoteById(button.dataset.dbTableWrap);
        if (!note || note.contentMode !== "table") return;
        commitDrawingBoardBodies();
        note.tableWrap = note.tableWrap === false;
        note.updatedAt = new Date().toISOString();
        saveState();
        replaceDrawingBoardNoteElement(note.id);
        return;
      }
      if (button?.matches("[data-db-set-content]")) {
        setBoardContentMode(button.dataset.noteId, button.dataset.dbSetContent);
        return;
      }
      if (button?.matches("[data-db-set-presentation]")) {
        setBoardPresentation(button.dataset.noteId, button.dataset.dbSetPresentation);
        return;
      }
      if (button?.matches("[data-db-set-marble-mode]")) {
        const note = boardNoteById(button.dataset.noteId);
        if (!note) return;
        const next = normalizeMarbleAppearance(button.dataset.dbSetMarbleMode, note.marbleValue);
        note.marbleMode = next.mode;
        note.marbleValue = next.value;
        note.updatedAt = new Date().toISOString();
        saveState();
        replaceDrawingBoardNoteElement(note.id);
        refreshMarbleDock();
        return;
      }
      if (button?.matches("[data-db-set-marble-value]")) {
        const note = boardNoteById(button.dataset.noteId);
        if (!note) return;
        const next = normalizeMarbleAppearance(note.marbleMode, button.dataset.dbSetMarbleValue);
        note.marbleMode = next.mode;
        note.marbleValue = next.value;
        note.updatedAt = new Date().toISOString();
        saveState();
        replaceDrawingBoardNoteElement(note.id);
        refreshMarbleDock();
        return;
      }
      if (button?.matches("[data-db-theme-link]")) {
        const note = boardNoteById(button.dataset.dbThemeLink);
        if (!note) return;
        if (note.colorMode === "theme" && note.textColorMode !== "custom") note.themeTone = (Math.max(0, Math.round(Number(note.themeTone) || 0)) + 1) % DRAWING_BOARD_PALETTE_SIZE;
        else { note.colorMode = "theme"; note.textColorMode = "auto"; }
        note.updatedAt = new Date().toISOString();
        saveState(); replaceDrawingBoardNoteElement(note.id);
        return;
      }
      if (button?.matches("[data-db-markdown-view]")) {
        const id = button.dataset.dbMarkdownView;
        const note = boardNoteById(id);
        if (!note) return;
        commitDrawingBoardBodies();
        if (runtime.boardMarkdownEditingIds.has(id)) runtime.boardMarkdownEditingIds.delete(id);
        else runtime.boardMarkdownEditingIds.add(id);
        if (runtime.boardMarkdownEditingIds.has(id) && runtime.boardTypewriterNoteId === id) destroyBoardTypewriter({ keepActive: true });
        replaceDrawingBoardNoteElement(id);
        if (!runtime.boardMarkdownEditingIds.has(id) && note.presentation === "typewriter") activateBoardTypewriter(id);
        return;
      }
      if (button?.matches("[data-db-typewriter-replay]")) {
        activateBoardTypewriter(button.dataset.dbTypewriterReplay, { replay: true });
        return;
      }
      if (button?.matches("[data-db-group-rename]")) {
        renameDrawingBoardGroup(button.dataset.dbGroupRename);
        return;
      }
      if (button?.matches("[data-db-group-delete]")) {
        const id = button.dataset.dbGroupDelete;
        if (confirm("Delete this board group? Notes inside the area are not deleted.")) deleteDrawingBoardGroup(id);
        return;
      }
      if (button?.matches("[data-db-delete-all-marked]")) { deleteAllMarkedNotes(); return; }
      if (button?.matches("[data-db-marked-restore]")) { unmarkDeletionToPark(button.dataset.dbMarkedRestore); return; }
      if (button?.matches("[data-db-marked-delete]")) {
        const id = button.dataset.dbMarkedDelete;
        if (confirm("Permanently delete this marked note?")) deleteDrawingBoardNote(id);
        return;
      }
      if (button?.matches("[data-db-repair-close]")) {
        runtime.boardRepairOpen = false;
        runtime.boardRepairTargetId = "";
        refreshBoardOverlayLayer();
        return;
      }
      if (button?.matches("[data-db-repair-action]")) {
        handleBoardRepairAction(button.dataset.dbRepairAction, button.dataset.noteId);
        return;
      }
      const summary = event.target.closest("[data-db-repair-select]");
      if (summary) {
        runtime.boardRepairTargetId = summary.dataset.dbRepairSelect;
        setBoardSelection(runtime.boardRepairTargetId);
        return;
      }
      const typewriterBody = event.target.closest("[data-db-activate-typewriter]");
      if (typewriterBody) {
        const note = boardNoteById(typewriterBody.dataset.dbActivateTypewriter);
        if (note?.presentation === "typewriter") activateBoardTypewriter(note.id);
      }
    });

    stage.addEventListener("input", event => {
      const title = event.target.closest("[data-db-title]");
      if (title) {
        const note = boardNoteById(title.dataset.dbTitle);
        if (note) { note.title = title.value; note.updatedAt = new Date().toISOString(); queueSaveState(); }
        return;
      }
      const abLabel = event.target.closest("[data-db-ab-label]");
      if (abLabel) {
        const note = boardNoteById(abLabel.dataset.dbAbLabel);
        if (persistAbLabel(note, abLabel, abLabel.dataset.dbAbSide, { finalize: false })) queueSaveState();
        return;
      }
      const tableCell = event.target.closest("[data-db-table-cell]");
      if (tableCell) {
        const note = boardNoteById(tableCell.dataset.dbTableCell);
        if (persistTableCell(note, tableCell, Number(tableCell.dataset.dbTableRow), Number(tableCell.dataset.dbTableCol))) queueSaveState();
        return;
      }
      const abColumn = event.target.closest("[data-db-ab-column]");
      if (abColumn) {
        const note = boardNoteById(abColumn.dataset.dbAbColumn);
        if (persistAbColumn(note, abColumn, abColumn.dataset.dbAbSide)) queueSaveState();
        return;
      }
      const body = event.target.closest("[data-db-body]");
      if (body) {
        const note = boardNoteById(body.dataset.dbBody);
        if (persistBody(note, body)) queueSaveState();
        return;
      }
      const markdown = event.target.closest("[data-db-markdown-source]");
      if (markdown) {
        const note = boardNoteById(markdown.dataset.dbMarkdownSource);
        if (persistMarkdownSource(note, markdown)) queueSaveState();
        return;
      }
      const codeSource = event.target.closest("[data-db-code-source]");
      if (codeSource) {
        const note = boardNoteById(codeSource.dataset.dbCodeSource);
        if (persistCodeSource(note, codeSource)) queueSaveState();
        return;
      }
      const codeLanguage = event.target.closest("[data-db-code-language]");
      if (codeLanguage) {
        const note = boardNoteById(codeLanguage.dataset.dbCodeLanguage);
        if (note) { note.codeLanguage = String(codeLanguage.value || "text").trim().slice(0, 32) || "text"; note.updatedAt = new Date().toISOString(); queueSaveState(); }
        return;
      }
      const background = event.target.closest("[data-db-color]");
      if (background) {
        const note = boardNoteById(background.dataset.dbColor);
        if (note) { note.colorMode = "custom"; note.color = background.value; note.updatedAt = new Date().toISOString(); queueSaveState(); updateDrawingBoardColours(); }
        return;
      }
      const textColor = event.target.closest("[data-db-text-color]");
      if (textColor) {
        const note = boardNoteById(textColor.dataset.dbTextColor);
        if (note) { note.textColorMode = "custom"; note.textColor = textColor.value; note.updatedAt = new Date().toISOString(); queueSaveState(); updateDrawingBoardColours(); }
        return;
      }
      const styleBackground = event.target.closest("[data-db-style-background]");
      if (styleBackground) {
        const note = boardNoteById(styleBackground.dataset.dbStyleBackground);
        if (note) {
          note.colorMode = "custom";
          note.color = styleBackground.value;
          note.updatedAt = new Date().toISOString();
          queueSaveState();
          updateDrawingBoardColours();
          refreshMarbleDock();
          syncBoardStyleLabPreview(note);
        }
        return;
      }
      const styleText = event.target.closest("[data-db-style-text]");
      if (styleText) {
        const note = boardNoteById(styleText.dataset.dbStyleText);
        if (note) {
          note.textColorMode = "custom";
          note.textColor = styleText.value;
          note.updatedAt = new Date().toISOString();
          queueSaveState();
          updateDrawingBoardColours();
          refreshMarbleDock();
          syncBoardStyleLabPreview(note);
        }
        return;
      }
      const styleGlyph = event.target.closest("[data-db-style-glyph]");
      if (styleGlyph) {
        const note = boardNoteById(styleGlyph.dataset.dbStyleGlyph);
        if (note) {
          const next = normalizeMarbleAppearance("glyph", styleGlyph.value);
          note.marbleMode = "glyph";
          note.marbleValue = next.value;
          note.updatedAt = new Date().toISOString();
          queueSaveState();
          replaceDrawingBoardNoteElement(note.id);
          refreshMarbleDock();
          syncBoardStyleLabPreview(note);
        }
        return;
      }
      const todoText = event.target.closest("[data-db-todo-text]");
      if (todoText) {
        const note = boardNoteById(todoText.dataset.dbTodoText);
        const item = todoItemById(note, todoText.dataset.dbTodoItem);
        if (note && item) {
          item.text = String(todoText.value || "").slice(0, 500);
          note.text = todoItemsText(note.todoItems);
          note.updatedAt = new Date().toISOString();
          queueSaveState();
        }
        return;
      }
      const marbleA = event.target.closest("[data-db-style-marble-a]");
      if (marbleA) {
        const note = boardNoteById(marbleA.dataset.dbStyleMarbleA);
        if (note) { note.marbleColorA = marbleA.value; note.updatedAt = new Date().toISOString(); queueSaveState(); replaceDrawingBoardNoteElement(note.id); refreshMarbleDock(); syncBoardStyleLabPreview(note); }
        return;
      }
      const marbleB = event.target.closest("[data-db-style-marble-b]");
      if (marbleB) {
        const note = boardNoteById(marbleB.dataset.dbStyleMarbleB);
        if (note) { note.marbleColorB = marbleB.value; note.updatedAt = new Date().toISOString(); queueSaveState(); replaceDrawingBoardNoteElement(note.id); refreshMarbleDock(); syncBoardStyleLabPreview(note); }
        return;
      }
      const marbleAngle = event.target.closest("[data-db-style-marble-angle]");
      if (marbleAngle) {
        const note = boardNoteById(marbleAngle.dataset.dbStyleMarbleAngle);
        if (note) {
          note.marbleAngle = Math.max(0, Math.min(360, Number(marbleAngle.value) || 0));
          const readout = $("[data-db-style-angle-readout]", $("#bpDbStyleLab") || document);
          if (readout) readout.textContent = `${note.marbleAngle}°`;
          note.updatedAt = new Date().toISOString();
          queueSaveState();
          replaceDrawingBoardNoteElement(note.id);
          refreshMarbleDock();
          syncBoardStyleLabPreview(note);
        }
        return;
      }
      const marbleScale = event.target.closest("[data-db-style-marble-scale]");
      if (marbleScale) {
        const note = boardNoteById(marbleScale.dataset.dbStyleMarbleScale);
        if (note) {
          note.marbleScale = Math.max(3, Math.min(64, Number(marbleScale.value) || 8));
          const readout = $("[data-db-style-scale-readout]", $("#bpDbStyleLab") || document);
          if (readout) readout.textContent = String(note.marbleScale);
          note.updatedAt = new Date().toISOString(); queueSaveState(); replaceDrawingBoardNoteElement(note.id); refreshMarbleDock(); syncBoardStyleLabPreview(note);
        }
        return;
      }
      const marbleDensity = event.target.closest("[data-db-style-marble-density]");
      if (marbleDensity) {
        const note = boardNoteById(marbleDensity.dataset.dbStyleMarbleDensity);
        if (note) {
          note.marbleDensity = Math.max(1, Math.min(10, Number(marbleDensity.value) || 4));
          const readout = $("[data-db-style-density-readout]", $("#bpDbStyleLab") || document);
          if (readout) readout.textContent = String(note.marbleDensity);
          note.updatedAt = new Date().toISOString(); queueSaveState(); replaceDrawingBoardNoteElement(note.id); refreshMarbleDock(); syncBoardStyleLabPreview(note);
        }
        return;
      }
      const search = event.target.closest("[data-db-repair-search]");
      if (search) {
        runtime.boardRepairFilter = search.value;
        const needle = search.value.trim().toLowerCase();
        $$("[data-db-repair-row]").forEach(row => { row.hidden = Boolean(needle && !String(row.dataset.dbRepairTitle || "").includes(needle)); });
      }
    });

    stage.addEventListener("change", event => {
      const holderColour = event.target.closest("[data-db-holder-color]");
      if (holderColour) {
        updateDrawingBoardHolder(holderColour.dataset.dbHolderColor, { color: holderColour.value }, { refresh: false });
        refreshMarbleDock();
        return;
      }
      const styleColour = event.target.closest("#bpDbStyleLab input[type=\"color\"]");
      if (styleColour) {
        // Native colour dialogs can return focus with the dismissal click still
        // aimed at the panel below. Move focus back to the Styler and briefly
        // guard destructive/toggle controls so closing the picker cannot flip
        // Always readable text or another setting by accident.
        styleColour.blur();
        runtime.boardStyleColourSettleUntil = performance.now() + 320;
        requestAnimationFrame(() => $("#bpDbStyleLab")?.focus({ preventScroll: true }));
        return;
      }
      const contentSelect = event.target.closest("[data-db-content-select]");
      if (contentSelect) {
        const id = contentSelect.dataset.dbContentSelect;
        const note = boardNoteById(id);
        if (!note) return;
        const next = contentSelect.value;
        if (next !== note.contentMode) setBoardContentMode(id, next);
        return;
      }
      const todoCheck = event.target.closest("[data-db-todo-check]");
      if (todoCheck) {
        const note = boardNoteById(todoCheck.dataset.dbTodoCheck);
        const item = todoItemById(note, todoCheck.dataset.dbTodoItem);
        if (note && item) {
          item.done = Boolean(todoCheck.checked);
          note.text = todoItemsText(note.todoItems);
          note.updatedAt = new Date().toISOString();
          saveState();
          todoCheck.closest(".bp-db-todo-row")?.classList.toggle("is-done", item.done);
        }
        return;
      }
      const typewriterToggle = event.target.closest("[data-db-typewriter-toggle]");
      if (typewriterToggle) {
        const id = typewriterToggle.dataset.dbTypewriterToggle;
        setBoardPresentation(id, typewriterToggle.checked ? "typewriter" : "static");
        return;
      }
      const readable = event.target.closest("[data-db-style-readable]");
      if (readable) {
        const note = boardNoteById(readable.dataset.dbStyleReadable);
        if (!note) return;
        note.textColorMode = readable.checked ? "auto" : "custom";
        if (!readable.checked) note.textColor = resolvedDrawingBoardNoteStyle({ ...note, textColorMode: "auto" }).text;
        refreshBoardNoteStyle(note, { refreshOverlay: true });
      }
    });

    stage.addEventListener("focusout", event => {
      const holderName = event.target.closest("[data-db-holder-name]");
      if (holderName) {
        updateDrawingBoardHolder(holderName.dataset.dbHolderName, { label: holderName.value });
        return;
      }
      const holderIcon = event.target.closest("[data-db-holder-icon]");
      if (holderIcon) {
        updateDrawingBoardHolder(holderIcon.dataset.dbHolderIcon, { icon: holderIcon.value });
        return;
      }
      const abLabel = event.target.closest("[data-db-ab-label]");
      if (abLabel) {
        const note = boardNoteById(abLabel.dataset.dbAbLabel);
        if (persistAbLabel(note, abLabel, abLabel.dataset.dbAbSide) || saveTimer) saveState();
        return;
      }
      const tableCell = event.target.closest("[data-db-table-cell]");
      if (tableCell) {
        const note = boardNoteById(tableCell.dataset.dbTableCell);
        if (persistTableCell(note, tableCell, Number(tableCell.dataset.dbTableRow), Number(tableCell.dataset.dbTableCol)) || saveTimer) saveState();
        return;
      }
      const title = event.target.closest("[data-db-title]");
      if (title) {
        const note = boardNoteById(title.dataset.dbTitle);
        if (note) {
          note.title = title.value.trim() || "Note";
          title.value = note.title;
          note.updatedAt = new Date().toISOString();
          saveState();
          if (runtime.boardRepairOpen) refreshBoardOverlayLayer();
        }
        return;
      }
      const abColumn = event.target.closest("[data-db-ab-column]");
      if (abColumn) {
        const note = boardNoteById(abColumn.dataset.dbAbColumn);
        if (persistAbColumn(note, abColumn, abColumn.dataset.dbAbSide, { sanitizeElement: true }) || saveTimer) saveState();
        return;
      }
      const body = event.target.closest("[data-db-body]");
      if (body) {
        const note = boardNoteById(body.dataset.dbBody);
        if (persistBody(note, body, { sanitizeElement: true }) || saveTimer) saveState();
        return;
      }
      const markdown = event.target.closest("[data-db-markdown-source]");
      if (markdown) {
        const note = boardNoteById(markdown.dataset.dbMarkdownSource);
        if (persistMarkdownSource(note, markdown) || saveTimer) saveState();
        return;
      }
      const codeSource = event.target.closest("[data-db-code-source]");
      if (codeSource) {
        const note = boardNoteById(codeSource.dataset.dbCodeSource);
        if (persistCodeSource(note, codeSource) || saveTimer) saveState();
        return;
      }
      const codeLanguage = event.target.closest("[data-db-code-language]");
      if (codeLanguage) {
        const note = boardNoteById(codeLanguage.dataset.dbCodeLanguage);
        if (note) { note.codeLanguage = String(codeLanguage.value || "text").trim().slice(0, 32) || "text"; codeLanguage.value = note.codeLanguage; note.updatedAt = new Date().toISOString(); saveState(); }
      }
    });

    stage.addEventListener("keydown", event => {
      const holderField = event.target.closest("[data-db-holder-name], [data-db-holder-icon]");
      if (holderField && event.key === "Enter") { event.preventDefault(); holderField.blur(); return; }
      const abLabel = event.target.closest("[data-db-ab-label]");
      if (abLabel && event.key === "Enter") { event.preventDefault(); abLabel.blur(); return; }
      const title = event.target.closest("[data-db-title]");
      if (title && event.key === "Enter") { event.preventDefault(); title.blur(); return; }
      if (event.key === "Escape" && runtime.boardHolderManagerOpen) {
        runtime.boardHolderManagerOpen = false;
        runtime.boardHolderManagerFocusId = "";
        refreshBoardOverlayLayer();
        return;
      }
      if (event.key === "Escape" && runtime.boardCardSettingsNoteId) {
        const id = runtime.boardCardSettingsNoteId;
        runtime.boardCardSettingsNoteId = "";
        replaceDrawingBoardNoteElement(id);
        return;
      }
      if (event.key === "Escape" && runtime.boardStyleNoteId) {
        runtime.boardStyleNoteId = "";
        refreshBoardOverlayLayer();
        return;
      }
      if (event.key === "Escape" && runtime.boardRepairOpen) {
        runtime.boardRepairOpen = false;
        runtime.boardRepairTargetId = "";
        refreshBoardOverlayLayer();
      }
    });

    stage.addEventListener("paste", event => {
      const editable = event.target.closest("[data-db-body], [data-db-ab-column]");
      if (!editable) return;
      const noteId = editable.dataset.dbBody || editable.dataset.dbAbColumn;
      const note = boardNoteById(noteId);
      if (!note) return;
      const html = event.clipboardData?.getData("text/html") || "";
      const text = event.clipboardData?.getData("text/plain") || "";
      const hasRichHTML = Boolean(html.trim());
      const inserted = hasRichHTML ? sanitizeRichHTML(html) : linkifyText(text);
      if (inserted) { event.preventDefault(); insertHTMLAtCursor(inserted); }
      const richCandidates = hasRichHTML ? linksFromRichHTML(html) : [];
      const candidates = richCandidates.length ? richCandidates : linksFromText(text);
      const added = addLinks(note, candidates);
      if (editable.matches("[data-db-ab-column]")) persistAbColumn(note, editable, editable.dataset.dbAbSide);
      else persistBody(note, editable);
      saveState();
      if (added) showToast(candidates.length > 1 ? "Links saved to note." : "Link saved to note.");
    });

    startBoardMarbleAnimations();
    syncBoardMarbleAnimationFrame();
    if (runtime.boardTypewriterNoteId) requestAnimationFrame(() => startBoardTypewriter(runtime.boardTypewriterNoteId));
  }


  /***************************************************************************
   * Versioned persistence and migration
   ***************************************************************************/
  function normalizePreferences(source = {}) {
    const input = source && typeof source === "object" ? source : {};
    const themeSource = input.themeCode || input.theme || DEFAULT_THEME_CODE;
    return {
      themeCode: themeCodeFromLegacy(themeSource),
      appMode: input.appMode === "light" ? "light" : "dark",
      readerMode: input.readerMode === "dark" ? "dark" : "light",
      density: input.density === "readable" ? "readable" : "compact"
    };
  }

  function normalizeActiveTab(value) {
    if (value === "drawingBoard") return "drawingBoard";
    if (value === "tools") return "tools";
    return "notes";
  }

  // Legacy names are accepted only here. Current runtime/state never emits them.
  function migratePreferences(source = {}) {
    const input = source && typeof source === "object" ? source : {};
    return normalizePreferences({
      themeCode: input.themeCode || input.theme,
      appMode: input.appMode === "light" || input.appMode === "dark"
        ? input.appMode
        : (input.darkMode === undefined ? DEFAULT_STATE.preferences.appMode : (asBoolean(input.darkMode) ? "dark" : "light")),
      readerMode: input.readerMode === "light" || input.readerMode === "dark"
        ? input.readerMode
        : (input.readingDark === undefined ? DEFAULT_STATE.preferences.readerMode : (asBoolean(input.readingDark) ? "dark" : "light")),
      density: input.density
    });
  }

  function migrateActiveTab(value) {
    if (["drawingBoard", "drawing-board", "quicknotes", "quickNotes"].includes(value)) return "drawingBoard";
    if (["tools", "toolbox", "utilities"].includes(value)) return "tools";
    return "notes";
  }

  function migrateWorkspace(input) {
    const source = input && typeof input === "object" ? input : {};
    const preferenceSource = source.preferences || source.ui || {};
    const boardSource = source.drawingBoard || source.quickNotes || source.board || {};
    const legacyQuote = source.placeholders && typeof source.placeholders === "object" ? source.placeholders.HEADER_QUOTE : "";
    const sourceVersion = Number.parseFloat(String(source.appVersion || "0")) || 0;
    const notesSource = source.notes && typeof source.notes === "object" ? { ...source.notes } : source.notes;
    if (notesSource?.typewriter && typeof notesSource.typewriter === "object") {
      notesSource.typewriter = { ...notesSource.typewriter };
      // v2.39's untouched 260 ms transition was an implementation default, not
      // an authored choice. Move only that exact legacy default to the slower
      // v2.40 standard; explicit effect overrides remain untouched.
      if (sourceVersion > 0 && sourceVersion < 2.40 && Number(notesSource.typewriter.rotationSpeed) === 260) {
        notesSource.typewriter.rotationSpeed = TYPEWRITER_STANDARD_TIMING.rotationSpeedMs;
      }
    }
    return {
      schemaVersion: CONFIG.workspaceSchema,
      appVersion: CONFIG.appVersion,
      activeTab: migrateActiveTab(source.activeTab),
      headerQuote: String(source.headerQuote || legacyQuote || DEFAULT_STATE.headerQuote).slice(0, 240),
      preferences: migratePreferences(preferenceSource),
      notes: normalizeNotes(notesSource),
      drawingBoard: normalizeDrawingBoard(boardSource)
    };
  }

  function extractWorkspacePayload(parsed) {
    if (!parsed || typeof parsed !== "object") throw new Error("Invalid workspace file.");
    if (parsed.format === CONFIG.boardFormat || parsed.type === "drawingBoard") {
      throw new Error("This is a Drawing Board file. Use Import Board from the Drawing Board tab.");
    }
    const source = parsed.workspace || parsed.state || parsed;
    const hasWorkspaceData = source.notes && typeof source.notes === "object" && !Array.isArray(source.notes);
    if (!hasWorkspaceData) throw new Error("No Notes workspace was found in this file.");
    return migrateWorkspace(source);
  }

  function serializeDrawingBoard(board = appState.drawingBoard) {
    const normalized = normalizeDrawingBoard(board);
    const holderCatalog = normalizeDrawingBoardHolderCatalog(normalized.holderCatalog);
    return {
      geometryVersion: normalized.geometryVersion,
      styleVersion: normalized.styleVersion || 1,
      columns: normalized.columns,
      rows: normalized.rows,
      creation: normalizeDrawingBoardCreation(normalized.creation),
      // Holder identity travels with Board exports.  Geometry/state is normalized
      // against that exact catalog so custom holders and their note ownership can
      // round-trip without falling back to the built-in catalog.
      holderCatalog,
      holders: normalizeDrawingBoardHolders(normalized.holders, holderCatalog),
      groups: normalizeDrawingBoardGroups(normalized.groups, { columns: normalized.columns, rows: normalized.rows }),
      notes: normalized.notes.map(note => ({ ...note, links: normalizeLinks(note.links) })),
      nextZ: normalized.nextZ
    };
  }

  function serializeWorkspace() {
    return {
      schemaVersion: CONFIG.workspaceSchema,
      appVersion: CONFIG.appVersion,
      activeTab: normalizeActiveTab(appState.activeTab),
      headerQuote: String(appState.headerQuote || DEFAULT_STATE.headerQuote),
      preferences: normalizePreferences(appState.preferences),
      notes: normalizeNotes(appState.notes),
      drawingBoard: serializeDrawingBoard(appState.drawingBoard)
    };
  }

  function loadState() {
    for (const key of [CONFIG.storageKey, CONFIG.legacyStorageKey]) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const state = migrateWorkspace(JSON.parse(raw));
        if (key === CONFIG.legacyStorageKey) runtime.migratedStorageKey = key;
        return state;
      } catch (error) {
        console.warn(`Backpack could not read state from ${key}:`, error);
      }
    }
    return migrateWorkspace(clone(DEFAULT_STATE));
  }

  function saveState() {
    if (!appState) return;
    window.clearTimeout(saveTimer);
    saveTimer = 0;
    appState = serializeWorkspace();
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(appState));
      if (runtime.migratedStorageKey) {
        localStorage.removeItem(runtime.migratedStorageKey);
        runtime.migratedStorageKey = "";
      }
      setSaveStatus("Saved", "saved");
    } catch (error) {
      console.warn("Backpack state could not be saved:", error);
      setSaveStatus("Save failed", "error");
    }
  }

  function exportWorkspace() {
    commitDrawingBoardBodies();
    saveState();
    const payload = {
      format: CONFIG.workspaceFormat,
      schemaVersion: CONFIG.workspaceSchema,
      appVersion: CONFIG.appVersion,
      releaseVersion: CONFIG.releaseVersion,
      exportedAt: new Date().toISOString(),
      workspace: serializeWorkspace()
    };
    downloadJSON(payload, `backpack-workspace-v2-${dateKey()}.json`);
    showToast("Backpack workspace exported.");
  }

  async function importWorkspace(file) {
    try {
      const incoming = extractWorkspacePayload(await readJSONFile(file));
      if (!confirm("Importing will replace the current Notes and Drawing Board workspace. Continue?")) return;
      appState = incoming;
      runtime.openLinksNoteId = "";
      runtime.dataMenuOpen = false;
      runtime.themeMenuOpen = false;
      runtime.quoteEditorOpen = false;
      saveState();
      renderApp();
      showToast(`Backpack workspace imported for Release ${CONFIG.releaseVersion}.`);
    } catch (error) {
      console.error(error);
      showToast(error.message || "Could not import that workspace file.");
    }
  }

  function exportDrawingBoard() {
    commitDrawingBoardBodies();
    saveState();
    const payload = {
      format: CONFIG.boardFormat,
      schemaVersion: CONFIG.workspaceSchema,
      appVersion: CONFIG.appVersion,
      releaseVersion: CONFIG.releaseVersion,
      exportedAt: new Date().toISOString(),
      drawingBoard: serializeDrawingBoard()
    };
    downloadJSON(payload, `backpack-drawing-board-v2-${dateKey()}.json`);
    showToast("Drawing Board exported.");
  }

  function extractDrawingBoardPayload(parsed) {
    if (!parsed || typeof parsed !== "object") throw new Error("Invalid Drawing Board file.");
    const source = parsed.drawingBoard
      || parsed.workspace?.drawingBoard
      || parsed.workspace?.quickNotes
      || parsed.state?.drawingBoard
      || parsed.state?.quickNotes
      || parsed.quickNotes
      || (Array.isArray(parsed.notes) ? parsed : null);
    if (!source || !Array.isArray(source.notes)) throw new Error("No Drawing Board was found in this file.");
    return normalizeDrawingBoard(source);
  }

  async function importDrawingBoard(file) {
    try {
      const incoming = extractDrawingBoardPayload(await readJSONFile(file));
      if (!confirm("Import this Drawing Board and replace the current board?")) return;
      appState.drawingBoard = incoming;
      runtime.openLinksNoteId = "";
      saveState();
      renderApp();
      showToast("Drawing Board imported.");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Could not import that Drawing Board file.");
    }
  }

  /***************************************************************************
   * Tools — reusable Backpack utilities
   ***************************************************************************/
  function renderThemeComponentMuseum() {
    return `
      <div class="bp-theme-museum" aria-label="Backpack component preview">
        <div class="bp-theme-museum-row is-board">
          <article class="bp-theme-museum-note"><header>Open note <i></i></header><p>Compact content lives first.</p><footer><span>Edit</span><span>MD</span></footer></article>
          <div class="bp-theme-museum-collapsed">Collapsed note <i></i></div>
          <div class="bp-theme-museum-marble" title="Marble preview"><b>&gt;</b><i>_</i></div>
          <div class="bp-theme-museum-holder"><button type="button" tabindex="-1">📌</button><span><i></i><i></i><i></i></span></div>
        </div>
        <div class="bp-theme-museum-row is-surfaces">
          <section class="bp-theme-museum-float"><header>Floating panel <button type="button" tabindex="-1">×</button></header><p>Quiet until active.</p></section>
          <section class="bp-theme-museum-group"><b>Group</b><span>area tint</span></section>
          <section class="bp-theme-museum-code"><header><b>&gt;_</b><span>Copy</span></header><code>const theme = roles;</code></section>
        </div>
        <div class="bp-theme-museum-row is-text">
          <article><h4>Markdown</h4><p>Reader text with <a href="#" tabindex="-1">links</a> and <code>code</code>.</p></article>
          <div class="bp-theme-museum-actions"><button type="button" tabindex="-1">Primary</button><button type="button" class="is-subtle" tabindex="-1">Inactive</button><button type="button" class="is-danger" tabindex="-1">Delete</button></div>
        </div>
      </div>`;
  }

  let themeFlowTimers = [];

  function themeHslFromHex(value) {
    const { r, g, b } = rgbFromHex(value);
    const R = r / 255, G = g / 255, B = b / 255;
    const max = Math.max(R, G, B), min = Math.min(R, G, B), delta = max - min;
    let hue = 0;
    const lightness = (max + min) / 2;
    let saturation = 0;
    if (delta) {
      saturation = delta / (1 - Math.abs((2 * lightness) - 1));
      if (max === R) hue = 60 * (((G - B) / delta) % 6);
      else if (max === G) hue = 60 * (((B - R) / delta) + 2);
      else hue = 60 * (((R - G) / delta) + 4);
    }
    if (hue < 0) hue += 360;
    return { h: hue, s: saturation * 100, l: lightness * 100 };
  }

  function themeHexFromHsl(hue, saturation, lightness) {
    const H = ((Number(hue) % 360) + 360) % 360;
    const S = Math.max(0, Math.min(100, Number(saturation))) / 100;
    const L = Math.max(0, Math.min(100, Number(lightness))) / 100;
    const chroma = (1 - Math.abs((2 * L) - 1)) * S;
    const x = chroma * (1 - Math.abs(((H / 60) % 2) - 1));
    const m = L - chroma / 2;
    let r = 0, g = 0, b = 0;
    if (H < 60) [r, g] = [chroma, x];
    else if (H < 120) [r, g] = [x, chroma];
    else if (H < 180) [g, b] = [chroma, x];
    else if (H < 240) [g, b] = [x, chroma];
    else if (H < 300) [r, b] = [x, chroma];
    else [r, b] = [chroma, x];
    return hexFromRgb({ r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 });
  }

  function themeSeedNoise(value) {
    const raw = Math.sin((Number(value) || 0) * 999.17) * 43758.5453;
    return raw - Math.floor(raw);
  }

  function themeHarmonyCandidates(theme, seed = runtime.themeHarmonySeed) {
    const source = parseThemeString(theme?.code || theme) || appliedTheme();
    const accent = themeHslFromHex(source.accent);
    const surfaceLum = relativeLuminance(source.surface);
    const offsets = [-26, -13, 0, 13, 26];
    return offsets.map((offset, index) => {
      const hueJitter = (themeSeedNoise(seed + index + 1) - .5) * 7;
      const satJitter = (themeSeedNoise(seed + index + 11) - .5) * 12;
      const lightJitter = (themeSeedNoise(seed + index + 23) - .5) * 10;
      let candidate = themeHexFromHsl(
        accent.h + offset + hueJitter,
        Math.max(40, Math.min(88, accent.s + satJitter)),
        Math.max(36, Math.min(72, accent.l + lightJitter))
      );
      if (contrastRatio(candidate, source.surface) < 1.65) {
        const adjusted = themeHslFromHex(candidate);
        candidate = themeHexFromHsl(adjusted.h, adjusted.s, surfaceLum > .34 ? Math.max(30, adjusted.l - 18) : Math.min(76, adjusted.l + 18));
      }
      return candidate;
    });
  }

  function themeHarmonyModeDescription(mode = runtime.themeAccentMode) {
    if (mode === "harmonize") return "3 constrained choices · uses the strongest compatible accent";
    if (mode === "explore") return "5 seeded variations · reroll to explore another family";
    return "Current accent is literal · no generated choice is applied";
  }

  function renderThemeHarmonyCandidates(theme) {
    const source = parseThemeString(theme?.code || theme) || appliedTheme();
    const candidates = themeHarmonyCandidates(source);
    const mode = runtime.themeAccentMode || "fixed";
    const values = mode === "fixed"
      ? [source.accent]
      : mode === "harmonize"
        ? candidates.slice(1, 4)
        : candidates;
    return values.map((value, index) => {
      const near = mode !== "fixed" && index === Math.floor(values.length / 2);
      const label = mode === "fixed" ? `Current ${value}` : `Use ${value}`;
      return `<button class="bp-theme-harmony-swatch${near ? " is-near" : ""}${mode === "fixed" ? " is-current" : ""}" type="button" data-theme-harmony-value="${escapeHTML(value)}" title="${escapeHTML(label)}" style="--swatch:${escapeHTML(value)}"><i aria-hidden="true"></i>${mode === "fixed" ? `<span>Current <code>${escapeHTML(value)}</code></span>` : `<span class="bp-sr-only">${escapeHTML(label)}</span>`}</button>`;
    }).join("");
  }

  function renderThemeFlowMachine(theme) {
    const audit = themeDerivationAudit(theme);
    const source = parseThemeString(theme?.code || theme) || appliedTheme();
    const families = ["Foundation", "Surface", "Accent"].map(family => ({ family, variants: audit.variants.filter(item => item.family === family) }));
    const groups = ["App", "Controls", "Text", "Reader", "Code", "Board"].map(group => ({ group, rows: audit.rows.filter(item => item.group === group) }));
    const sourceSurface = audit.effectiveSurface || source.surface;
    const familyClass = name => name.toLowerCase();
    const roleTrace = {
      App: "role-app role-bus variant-foundation variant-surface source-foundation source-surface engine",
      Controls: "role-controls role-bus variant-surface variant-accent source-surface source-accent engine",
      Text: "role-text role-bus variant-surface variant-accent source-surface source-accent engine",
      Reader: "role-reader role-bus variant-foundation variant-accent source-foundation source-accent engine",
      Code: "role-code role-bus variant-foundation variant-accent source-foundation source-accent engine",
      Board: "role-board role-bus variant-foundation variant-surface variant-accent source-foundation source-surface source-accent engine",
    };
    return `
      <div class="bp-theme-flow-board" aria-label="Theme inference flow">
        <svg class="bp-theme-flow-wires" viewBox="0 0 800 620" preserveAspectRatio="none" aria-hidden="true">
          <path data-flow-path="source-foundation" d="M125 92 C125 142 310 138 365 190" />
          <path data-flow-path="source-surface" d="M400 92 L400 190" />
          <path data-flow-path="source-accent" d="M675 92 C675 142 490 138 435 190" />
          <path data-flow-path="variant-foundation" d="M375 238 C330 270 185 270 145 315" />
          <path data-flow-path="variant-surface" d="M400 238 L400 315" />
          <path data-flow-path="variant-accent" d="M425 238 C470 270 615 270 655 315" />
          <path data-flow-path="role-bus" d="M145 405 C145 445 655 445 655 405 M145 445 L655 445" />
          <path data-flow-path="role-app" d="M68 445 L68 492" />
          <path data-flow-path="role-controls" d="M201 445 L201 492" />
          <path data-flow-path="role-text" d="M334 445 L334 492" />
          <path data-flow-path="role-reader" d="M467 445 L467 492" />
          <path data-flow-path="role-code" d="M600 445 L600 492" />
          <path data-flow-path="role-board" d="M733 445 L733 492" />
          <circle cx="125" cy="92" r="4"/><circle cx="400" cy="92" r="4"/><circle cx="675" cy="92" r="4"/>
          <circle cx="400" cy="238" r="4"/><circle cx="145" cy="405" r="4"/><circle cx="400" cy="405" r="4"/><circle cx="655" cy="405" r="4"/>
        </svg>
        <div class="bp-theme-flow-seed is-foundation" data-flow-trace="source-foundation engine variant-foundation role-bus"><i style="--swatch:${escapeHTML(source.base)}"></i><span><b>Foundation</b><code>${escapeHTML(source.base)}</code></span></div>
        <div class="bp-theme-flow-seed is-surface" data-flow-trace="source-surface engine variant-surface role-bus"><i style="--swatch:${escapeHTML(sourceSurface)}"></i><span><b>${audit.recipe.id === "duo" ? "Surface · calculated" : "Surface"}</b><code>${escapeHTML(sourceSurface)}</code></span></div>
        <div class="bp-theme-flow-seed is-accent" data-flow-trace="source-accent engine variant-accent role-bus"><i style="--swatch:${escapeHTML(source.accent)}"></i><span><b>Accent</b><code>${escapeHTML(source.accent)}</code></span></div>
        <div id="bpToolThemeEngine" class="bp-theme-flow-engine" data-flow-trace="source-foundation source-surface source-accent engine variant-foundation variant-surface variant-accent"><span>INFERENCE ENGINE</span><small>${escapeHTML(audit.recipe.short)}</small><button id="bpToolThemeReplayFlow" type="button" title="Replay colour flow">▶ Flow</button></div>
        ${families.map((item, index) => `<div class="bp-theme-flow-family is-${familyClass(item.family)}" data-flow-trace="variant-${familyClass(item.family)} role-bus source-${familyClass(item.family)} engine"><header>${escapeHTML(item.family)}</header><div>${item.variants.map(variant => `<span title="${escapeHTML(variant.label)} · ${escapeHTML(variant.source)}"><i style="--swatch:${escapeHTML(variant.value)}"></i><small>${escapeHTML(variant.label)}</small><code>${escapeHTML(variant.value)}</code></span>`).join("")}</div></div>`).join("")}
        <div class="bp-theme-role-trays">
          ${groups.map(item => `<section class="bp-theme-role-tray" data-flow-role="${escapeHTML(item.group.toLowerCase())}" data-flow-trace="${escapeHTML(roleTrace[item.group] || "role-bus")}"><header><b>${escapeHTML(item.group)}</b><small>${item.rows.length}</small></header>${item.rows.slice(0, 3).map(row => `<div class="bp-theme-role-line" title="${escapeHTML(row.token)} · ${escapeHTML(row.source)}"><i style="--swatch:${escapeHTML(row.value)}"></i><span>${escapeHTML(row.label)}</span></div>`).join("")}${item.rows.length > 3 ? `<button type="button" data-theme-inspect-group="${escapeHTML(item.group)}">+${item.rows.length - 3} roles</button>` : ""}</section>`).join("")}
        </div>
      </div>`;
  }

  function themeExportText(theme) {
    const audit = themeDerivationAudit(theme);
    const source = parseThemeString(theme?.code || theme) || appliedTheme();
    const lines = [
      `/* Backpack Theme Creator · Release ${CONFIG.releaseVersion} · app ${CONFIG.appVersion} */`,
      `/* ${source.code} */`,
      `:root {`,
      `  --bp-foundation: ${source.base};`,
      `  --bp-surface: ${audit.effectiveSurface};`,
      `  --bp-accent: ${source.accent};`,
      ``,
      ...audit.variants.map(item => `  ${item.token}: ${item.value};`),
      ``,
      ...audit.rows.map(item => `  ${item.token}: ${item.value};`),
      `}`,
    ];
    return lines.join("\n");
  }

  function renderThemePreviewTypewriter() {
    return `<div class="bp-theme-preview-typewriter"><h3># Theme Notes</h3><p>Three source colours become stable semantic roles.<i class="bp-theme-preview-caret"></i></p><blockquote>Typewriter output stays readable as the theme changes.</blockquote><pre class="bp-theme-preview-code"><code><b>const</b> palette = <i>derive</i>(<em>417</em>);
<span>// Notes: verse · js · python</span></code></pre><a href="#" tabindex="-1">Semantic link</a></div>`;
  }

  function renderThemePreviewComponents() {
    return `<div class="bp-theme-preview-components"><label>Input<input type="text" value="Theme value" tabindex="-1"></label><article><header>Panel specimen</header><p>Semantic panel, border and muted text.</p></article><div><span>Badge</span><code>--bp-accent</code></div></div>`;
  }

  function renderTools() {
    const theme = parseThemeString(runtime.themeDraftCode) || appliedTheme();
    const preset = themePresetForCode(theme.code);
    const presetOptions = [
      ...THEME_PRESETS.map(item => `<option value="${escapeHTML(item.id)}" ${item.id === preset?.id ? "selected" : ""}>${escapeHTML(item.icon)} ${escapeHTML(item.name)}</option>`),
      `<option value="custom" ${preset ? "" : "selected"} disabled>◈ Custom</option>`,
    ].join("");
    const fontOptions = FONT_PRESETS.map(item => `<option value="${escapeHTML(item.id)}" ${item.id === theme.fontId ? "selected" : ""}>${escapeHTML(item.name)}</option>`).join("");
    const profileOptions = PRESENTATION_PROFILES.map(item => `<option value="${escapeHTML(item.id)}" ${item.id === theme.profileId ? "selected" : ""}>${escapeHTML(item.name)}</option>`).join("");
    const marbleOptions = MARBLE_STYLES.map(item => `<option value="${escapeHTML(item.id)}" ${item.id === theme.marbleStyleId ? "selected" : ""}>${escapeHTML(item.name)}</option>`).join("");
    const recipeOptions = THEME_RECIPES.map(item => `<option value="${escapeHTML(item.id)}" ${item.id === theme.recipeId ? "selected" : ""}>${escapeHTML(item.name)}</option>`).join("");
    const recipe = themeRecipeById(theme.recipeId);
    return `
      <section class="bp-panel bp-tools-panel">
        <header class="bp-panel-header bp-tools-header">
          <div class="bp-section-title"><h2>Tools</h2><span class="bp-section-kicker">shared Backpack utilities</span></div>
          <span class="bp-pill">1 tool</span>
        </header>
        <div class="bp-tools-workspace">
          <article class="bp-tool-card bp-theme-creator-tool">
            <header class="bp-tool-card-head bp-theme-flow-head">
              <div><strong>Theme Creator</strong><small>Seeds → inference → semantic roles → real components</small></div>
              <nav class="bp-theme-tool-view-tabs" aria-label="Theme Creator view">
                <button type="button" data-theme-tool-view="create">Create</button><button type="button" data-theme-tool-view="inspect">Inspect</button><button type="button" data-theme-tool-view="export">Export</button>
              </nav>
              <b id="bpToolThemeDraftStatus" class="bp-theme-draft-status">Applied</b>
            </header>
            <div class="bp-theme-flow-layout">
              <section class="bp-theme-tool-controls bp-theme-flow-controls" aria-label="Theme Creator controls">
                <header class="bp-theme-flow-section-head"><b>1. SEEDS</b><small>Three authored colours enter the machine.</small></header>
                <label class="bp-tool-field"><span>Preset</span><select id="bpToolThemePresetSelect">${presetOptions}</select></label>
                <div class="bp-theme-flow-source-stack">
                  <label><span>Foundation</span><div><input id="bpToolThemeBase" type="color" value="${escapeHTML(theme.base)}"><input id="bpToolThemeBaseText" type="text" value="${escapeHTML(theme.base)}" spellcheck="false"></div></label>
                  <label><span>Surface</span><div><input id="bpToolThemeSurface" type="color" value="${escapeHTML(theme.surface)}"><input id="bpToolThemeSurfaceText" type="text" value="${escapeHTML(theme.surface)}" spellcheck="false"></div></label>
                  <label><span>Accent</span><div><input id="bpToolThemeAccent" type="color" value="${escapeHTML(theme.accent)}"><input id="bpToolThemeAccentText" type="text" value="${escapeHTML(theme.accent)}" spellcheck="false"></div></label>
                </div>
                <section class="bp-theme-harmony-box" aria-label="Accent seeding" data-accent-mode="${escapeHTML(runtime.themeAccentMode || "fixed")}">
                  <header><b>Accent source</b><small>Seed ${String(runtime.themeHarmonySeed).padStart(4,"0")}</small></header>
                  <div class="bp-theme-harmony-modes"><button type="button" data-theme-accent-mode="fixed"><span>●</span> Fixed</button><button type="button" data-theme-accent-mode="harmonize"><span>≈</span> Harmonize</button><button type="button" data-theme-accent-mode="explore"><span>✦</span> Explore</button></div>
                  <small id="bpToolThemeHarmonyHint" class="bp-theme-harmony-hint">${escapeHTML(themeHarmonyModeDescription())}</small>
                  <div id="bpToolThemeHarmonyCandidates" class="bp-theme-harmony-candidates">${renderThemeHarmonyCandidates(theme)}</div>
                  <button id="bpToolThemeHarmonyReroll" class="bp-theme-harmony-reroll" type="button">↻ New seed</button>
                </section>
                <section class="bp-theme-calc-controls" aria-label="Theme calculation recipe">
                  <header><strong>Recipe</strong><small>How source colours are interpreted</small></header>
                  <label class="bp-tool-field"><span>Method</span><select id="bpToolThemeRecipe">${recipeOptions}</select></label>
                  <div id="bpToolThemeRecipeGuide" class="bp-theme-recipe-guide"><b>${escapeHTML(recipe.name)}</b><span>${escapeHTML(recipe.description)}</span></div>
                  <div class="bp-theme-calc-actions"><button id="bpToolThemeRotateSources" type="button">Rotate sources</button><button id="bpToolThemeSwapAccent" type="button">Swap accent</button></div>
                </section>
                <details class="bp-theme-flow-output">
                  <summary>Output + presentation</summary>
                  <div class="bp-theme-tool-options">
                    <label class="bp-tool-field"><span>Typeface</span><select id="bpToolThemeFont">${fontOptions}</select></label>
                    <label class="bp-tool-field"><span>Presentation</span><select id="bpToolThemeProfile">${profileOptions}</select><b id="bpToolThemeProfileHint">${escapeHTML(presentationProfileById(theme.profileId).name)}</b></label>
                    <label class="bp-tool-field"><span>Marbles</span><select id="bpToolThemeMarbleStyle">${marbleOptions}</select><b id="bpToolThemeMarbleHint">${escapeHTML(marbleStyleById(theme.marbleStyleId).name)}</b></label>
                  </div>
                  <div class="bp-theme-tool-modes"><strong>Application</strong><button type="button" data-tool-theme-app-mode="dark">Dark</button><button type="button" data-tool-theme-app-mode="light">Light</button><strong>Reader</strong><button type="button" data-tool-theme-reader-mode="dark">Dark</button><button type="button" data-tool-theme-reader-mode="light">Light</button></div>
                  <details class="bp-theme-tool-portable"><summary>Portable code</summary><div><input id="bpToolThemeStringInput" value="${escapeHTML(theme.code)}" spellcheck="false"><button id="bpToolThemeLoad" type="button">Load</button><button id="bpToolThemeCopy" type="button">Copy</button></div></details>
                </details>
                <div class="bp-theme-tool-actions"><button id="bpToolThemeRevert" type="button">Use applied</button><button id="bpToolThemeApply" type="button">Apply theme</button></div>
              </section>

              <section class="bp-theme-flow-stage" aria-label="Theme inference">
                <header class="bp-theme-flow-section-head"><b>2. INFERENCE</b><small>Follow a colour from source to role. Hover any node to trace it.</small></header>
                <div id="bpToolThemeCreate" class="bp-theme-tool-view-panel">${renderThemeFlowMachine(theme)}</div>
                <div id="bpToolThemeInspect" class="bp-theme-tool-view-panel" hidden><div id="bpToolThemeCalculation" class="bp-theme-calculation">${renderThemeCalculation(theme)}</div><div id="bpToolThemeAudit" class="bp-theme-tool-audit">${renderThemeAudit(theme)}</div></div>
                <div id="bpToolThemeExport" class="bp-theme-tool-view-panel" hidden><div class="bp-theme-export-head"><b>Semantic CSS</b><span>Portable theme code is included at the top.</span></div><textarea id="bpToolThemeExportText" spellcheck="false">${escapeHTML(themeExportText(theme))}</textarea><div class="bp-theme-export-actions"><button id="bpToolThemeExportCopy" type="button">Copy CSS</button><button id="bpToolThemeExportThemeCopy" type="button">Copy BPTH5</button></div></div>
              </section>

              <section id="bpToolThemePreviewShell" class="bp-theme-flow-preview" data-marble-style="${escapeHTML(theme.marbleStyleId)}" aria-label="Theme preview">
                <header class="bp-theme-flow-section-head"><b>3. PREVIEW</b><small>Real Backpack and Typewriter vocabulary.</small></header>
                <div class="bp-theme-preview-tabs"><button type="button" data-theme-preview-tab="backpack">Backpack</button><button type="button" data-theme-preview-tab="typewriter">Typewriter</button><button type="button" data-theme-preview-tab="components">Components</button></div>
                <div class="bp-theme-preview-stack">
                  <div data-theme-preview-panel="backpack"><div id="bpToolThemeViewport" class="bp-theme-viewport bp-theme-tool-viewport" data-presentation="${escapeHTML(theme.profileId)}" data-marble-style="${escapeHTML(theme.marbleStyleId)}"><div class="bp-theme-demo-chrome"><strong>BACKPACK</strong><button type="button" tabindex="-1">Action</button></div><div class="bp-theme-demo-tabs"><b>Notes</b><span>Drawing Board</span><span>Tools</span></div><div class="bp-theme-demo-body bp-theme-demo-museum">${renderThemeComponentMuseum()}</div></div></div>
                  <div data-theme-preview-panel="typewriter" hidden>${renderThemePreviewTypewriter()}</div>
                  <div data-theme-preview-panel="components" hidden>${renderThemePreviewComponents()}</div>
                </div>
                <section id="bpToolThemeComponentDemo" class="bp-theme-component-demo"><header><b>Component demo</b><small>Explicit animation only</small></header><div><span><small>Idle</small><button type="button">Action</button></span><span><small>Hover</small><button type="button" class="is-hover">Action</button></span><span><small>Pressed</small><button type="button" class="is-pressed">Action</button></span><span><small>Disabled</small><button type="button" disabled>Action</button></span></div><button id="bpToolThemeComponentDemoRun" type="button">▶ Demo</button></section>
              </section>
            </div>
          </article>
        </div>
      </section>`;
  }

  function clearThemeFlowAnimation() {
    themeFlowTimers.forEach(timer => clearTimeout(timer));
    themeFlowTimers = [];
    $$("#bpToolThemeCreate .is-flow").forEach(node => node.classList.remove("is-flow"));
  }

  function themeFlowToggle(tokens, className, enabled) {
    String(tokens || "").split(/\s+/).filter(Boolean).forEach(token => {
      $$(`#bpToolThemeCreate [data-flow-path="${token}"]`).forEach(node => node.classList.toggle(className, enabled));
      $$(`#bpToolThemeCreate [data-flow-trace~="${token}"]`).forEach(node => node.classList.toggle(className, enabled));
    });
  }

  function themeFlowFlash(token, enabled) {
    const direct = {
      "source-foundation": ["[data-flow-path=\"source-foundation\"]", ".bp-theme-flow-seed.is-foundation"],
      "source-surface": ["[data-flow-path=\"source-surface\"]", ".bp-theme-flow-seed.is-surface"],
      "source-accent": ["[data-flow-path=\"source-accent\"]", ".bp-theme-flow-seed.is-accent"],
      engine: ["#bpToolThemeEngine"],
      "variant-foundation": ["[data-flow-path=\"variant-foundation\"]", ".bp-theme-flow-family.is-foundation"],
      "variant-surface": ["[data-flow-path=\"variant-surface\"]", ".bp-theme-flow-family.is-surface"],
      "variant-accent": ["[data-flow-path=\"variant-accent\"]", ".bp-theme-flow-family.is-accent"],
      "role-bus": ["[data-flow-path=\"role-bus\"]"],
      "role-app": ["[data-flow-path=\"role-app\"]", "[data-flow-role=\"app\"]"],
      "role-controls": ["[data-flow-path=\"role-controls\"]", "[data-flow-role=\"controls\"]"],
      "role-text": ["[data-flow-path=\"role-text\"]", "[data-flow-role=\"text\"]"],
      "role-reader": ["[data-flow-path=\"role-reader\"]", "[data-flow-role=\"reader\"]"],
      "role-code": ["[data-flow-path=\"role-code\"]", "[data-flow-role=\"code\"]"],
      "role-board": ["[data-flow-path=\"role-board\"]", "[data-flow-role=\"board\"]"],
    };
    (direct[token] || []).forEach(selector => $$("#bpToolThemeCreate " + selector).forEach(node => node.classList.toggle("is-flow", enabled)));
  }

  function animateThemeFlow() {
    if (!$("#bpToolThemeCreate") || $("#bpToolThemeCreate")?.hidden) return;
    clearThemeFlowAnimation();
    const steps = [
      "source-foundation", "source-surface", "source-accent", "engine",
      "variant-foundation", "variant-surface", "variant-accent", "role-bus",
      "role-app", "role-controls", "role-text", "role-reader", "role-code", "role-board"
    ];
    steps.forEach((token, index) => {
      themeFlowTimers.push(setTimeout(() => {
        themeFlowFlash(token, true);
        themeFlowTimers.push(setTimeout(() => themeFlowFlash(token, false), 330));
      }, index * 105));
    });
  }

  function bindThemeFlowInteractions() {
    $$("#bpToolThemeCreate [data-flow-trace]").forEach(node => {
      node.addEventListener("mouseenter", () => themeFlowToggle(node.dataset.flowTrace, "is-hot", true));
      node.addEventListener("mouseleave", () => themeFlowToggle(node.dataset.flowTrace, "is-hot", false));
    });
    $("#bpToolThemeReplayFlow")?.addEventListener("click", animateThemeFlow);
    $$('[data-theme-inspect-group]').forEach(button => button.addEventListener("click", () => setThemeToolView("inspect")));
  }

  function setThemeToolView(view) {
    const next = ["create", "inspect", "export"].includes(view) ? view : "create";
    runtime.themeToolView = next;
    $$('[data-theme-tool-view]').forEach(button => button.classList.toggle("is-active", button.dataset.themeToolView === next));
    const panels = { create: $("#bpToolThemeCreate"), inspect: $("#bpToolThemeInspect"), export: $("#bpToolThemeExport") };
    Object.entries(panels).forEach(([name, panel]) => { if (panel) panel.hidden = name !== next; });
    if (next === "create") animateThemeFlow(); else clearThemeFlowAnimation();
  }

  function setThemePreviewTab(tab) {
    const next = ["backpack", "typewriter", "components"].includes(tab) ? tab : "backpack";
    runtime.themePreviewTab = next;
    $$('[data-theme-preview-tab]').forEach(button => button.classList.toggle("is-active", button.dataset.themePreviewTab === next));
    $$('[data-theme-preview-panel]').forEach(panel => panel.hidden = panel.dataset.themePreviewPanel !== next);
  }

  function refreshThemeHarmonyCandidates(theme) {
    const host = $("#bpToolThemeHarmonyCandidates");
    if (!host) return;
    const box = host.closest(".bp-theme-harmony-box");
    if (box) box.dataset.accentMode = runtime.themeAccentMode || "fixed";
    const hint = $("#bpToolThemeHarmonyHint");
    if (hint) hint.textContent = themeHarmonyModeDescription();
    host.innerHTML = renderThemeHarmonyCandidates(theme);
    $$('[data-theme-harmony-value]').forEach(button => button.addEventListener("click", () => {
      const accent = normalizeHexColor(button.dataset.themeHarmonyValue);
      if (!accent) return;
      const input = $("#bpToolThemeAccent");
      const text = $("#bpToolThemeAccentText");
      if (input) input.value = accent;
      if (text) text.value = accent;
      captureThemeToolDraft();
    }));
  }

  let captureThemeToolDraft = () => {};

  function bindTools() {
    const draft = ensureThemeDraft();
    syncThemeGeneratorControls(draft);
    updateThemeGeneratorPreview(draft);

    captureThemeToolDraft = () => {
      const theme = themeFromToolControls();
      if (!theme) return;
      const exactPreset = themePresetForCode(theme.code);
      runtime.themeDraftOriginPresetId = exactPreset?.id || runtime.themeDraftOriginPresetId || "";
      runtime.themeDraftCode = theme.code;
      syncThemeGeneratorControls(theme);
      updateThemeGeneratorPreview(theme);
      updateThemeDraftUI(theme);
      refreshThemeHarmonyCandidates(theme);
    };

    for (const id of ["bpToolThemeBase", "bpToolThemeSurface", "bpToolThemeAccent", "bpToolThemeFont", "bpToolThemeProfile", "bpToolThemeMarbleStyle", "bpToolThemeRecipe"]) {
      $(`#${id}`)?.addEventListener("input", captureThemeToolDraft);
      $(`#${id}`)?.addEventListener("change", captureThemeToolDraft);
    }
    for (const [colorId, textId] of [["bpToolThemeBase", "bpToolThemeBaseText"], ["bpToolThemeSurface", "bpToolThemeSurfaceText"], ["bpToolThemeAccent", "bpToolThemeAccentText"]]) {
      const color = $(`#${colorId}`), textInput = $(`#${textId}`);
      color?.addEventListener("input", () => { if (textInput) textInput.value = color.value.toUpperCase(); });
      textInput?.addEventListener("change", () => {
        const value = normalizeHexColor(textInput.value);
        if (!value) { textInput.value = color?.value?.toUpperCase() || ""; return; }
        textInput.value = value;
        if (color) color.value = value;
        captureThemeToolDraft();
      });
      textInput?.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); textInput.blur(); } });
    }

    $("#bpToolThemeRotateSources")?.addEventListener("click", () => {
      const base = $("#bpToolThemeBase"), surface = $("#bpToolThemeSurface"), accent = $("#bpToolThemeAccent");
      if (!base || !surface || !accent) return;
      const first = base.value; base.value = surface.value; surface.value = accent.value; accent.value = first;
      captureThemeToolDraft();
    });
    $("#bpToolThemeSwapAccent")?.addEventListener("click", () => {
      const surface = $("#bpToolThemeSurface"), accent = $("#bpToolThemeAccent");
      if (!surface || !accent) return;
      const value = surface.value; surface.value = accent.value; accent.value = value;
      captureThemeToolDraft();
    });
    $("#bpToolThemePresetSelect")?.addEventListener("change", event => {
      const preset = THEME_PRESETS.find(item => item.id === event.currentTarget.value);
      if (!preset) return;
      setThemeDraft(preset.code, { originPresetId: preset.id });
      refreshThemeHarmonyCandidates(parseThemeString(preset.code));
    });
    $("#bpToolThemeRevert")?.addEventListener("click", () => {
      const theme = appliedTheme();
      setThemeDraft(theme.code, { originPresetId: themePresetForCode(theme.code)?.id || "" });
      refreshThemeHarmonyCandidates(theme);
    });
    $("#bpToolThemeApply")?.addEventListener("click", () => {
      const theme = parseThemeString(runtime.themeDraftCode) || themeFromToolControls();
      if (!theme) return;
      applyThemeCode(theme.code);
      syncThemeGeneratorControls(theme);
      updateThemeGeneratorPreview(theme);
    });
    $("#bpToolThemeLoad")?.addEventListener("click", () => {
      const input = $("#bpToolThemeStringInput");
      const theme = parseThemeString(input?.value);
      if (!theme) { showToast("Theme code needs three six-digit colours plus supported font/presentation/marble style."); input?.focus(); return; }
      setThemeDraft(theme.code, { originPresetId: themePresetForCode(theme.code)?.id || "" });
      refreshThemeHarmonyCandidates(theme);
    });
    $("#bpToolThemeCopy")?.addEventListener("click", async () => {
      const theme = parseThemeString(runtime.themeDraftCode) || themeFromToolControls() || appliedTheme();
      const input = $("#bpToolThemeStringInput");
      if (input) input.value = theme.code;
      try { await navigator.clipboard.writeText(theme.code); showToast("Theme code copied."); }
      catch { input?.focus(); input?.select(); showToast("Theme code selected."); }
    });
    $("#bpToolThemeStringInput")?.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); $("#bpToolThemeLoad")?.click(); } });

    $$('[data-tool-theme-app-mode]').forEach(button => button.addEventListener("click", () => {
      appState.preferences.appMode = button.dataset.toolThemeAppMode === "light" ? "light" : "dark";
      saveState(); applyUI(); updateThemeGeneratorPreview(parseThemeString(runtime.themeDraftCode) || appliedTheme());
    }));
    $$('[data-tool-theme-reader-mode]').forEach(button => button.addEventListener("click", () => {
      appState.preferences.readerMode = button.dataset.toolThemeReaderMode === "dark" ? "dark" : "light";
      saveState(); applyUI(); updateThemeGeneratorPreview(parseThemeString(runtime.themeDraftCode) || appliedTheme());
    }));

    $$('[data-theme-tool-view]').forEach(button => button.addEventListener("click", () => setThemeToolView(button.dataset.themeToolView)));
    $$('[data-theme-preview-tab]').forEach(button => button.addEventListener("click", () => setThemePreviewTab(button.dataset.themePreviewTab)));
    $$('[data-theme-accent-mode]').forEach(button => button.addEventListener("click", () => {
      runtime.themeAccentMode = button.dataset.themeAccentMode || "fixed";
      $$('[data-theme-accent-mode]').forEach(item => item.classList.toggle("is-active", item.dataset.themeAccentMode === runtime.themeAccentMode));
      const theme = parseThemeString(runtime.themeDraftCode) || appliedTheme();
      if (runtime.themeAccentMode === "explore") runtime.themeHarmonySeed = (runtime.themeHarmonySeed + 17) % 10000;
      if (runtime.themeAccentMode === "harmonize") {
        const candidates = themeHarmonyCandidates(theme).slice(1, 4);
        const best = candidates.slice().sort((a,b) => contrastRatio(b, theme.surface) - contrastRatio(a, theme.surface))[0];
        const accent = $("#bpToolThemeAccent"), textInput = $("#bpToolThemeAccentText");
        if (accent) accent.value = best;
        if (textInput) textInput.value = best;
        captureThemeToolDraft();
        return;
      }
      refreshThemeHarmonyCandidates(theme);
    }));
    $("#bpToolThemeHarmonyReroll")?.addEventListener("click", () => {
      runtime.themeHarmonySeed = (runtime.themeHarmonySeed + 1) % 10000;
      refreshThemeHarmonyCandidates(parseThemeString(runtime.themeDraftCode) || appliedTheme());
      const label = $(".bp-theme-harmony-box header small"); if (label) label.textContent = `Seed ${String(runtime.themeHarmonySeed).padStart(4,"0")}`;
    });
    $("#bpToolThemeExportCopy")?.addEventListener("click", async () => {
      const field = $("#bpToolThemeExportText");
      try { await navigator.clipboard.writeText(field?.value || ""); showToast("Theme CSS copied."); }
      catch { field?.focus(); field?.select(); showToast("Theme CSS selected."); }
    });
    $("#bpToolThemeExportThemeCopy")?.addEventListener("click", async () => {
      const theme = parseThemeString(runtime.themeDraftCode) || appliedTheme();
      try { await navigator.clipboard.writeText(theme.code); showToast("BPTH5 theme copied."); }
      catch { showToast(theme.code); }
    });
    $("#bpToolThemeComponentDemoRun")?.addEventListener("click", () => {
      const demo = $("#bpToolThemeComponentDemo"); if (!demo) return;
      demo.classList.remove("is-demoing"); void demo.offsetWidth; demo.classList.add("is-demoing");
      setTimeout(() => demo.classList.remove("is-demoing"), 2700);
    });

    refreshThemeHarmonyCandidates(draft);
    bindThemeFlowInteractions();
    setThemeToolView(runtime.themeToolView);
    setThemePreviewTab(runtime.themePreviewTab);
    $$('[data-theme-accent-mode]').forEach(item => item.classList.toggle("is-active", item.dataset.themeAccentMode === runtime.themeAccentMode));
  }

  /***************************************************************************
   * Application shell
   ***************************************************************************/
  const TABS = Object.freeze([
    { id: "notes", label: "Notes", icon: "📓", render: renderNotes, bind: bindNotes },
    { id: "drawingBoard", label: "Drawing Board", icon: "🗂️", render: renderDrawingBoard, bind: bindDrawingBoard },
    { id: "tools", label: "Tools", icon: "🧰", render: renderTools, bind: bindTools }
  ]);

  function activeTab() {
    return TABS.find(tab => tab.id === appState.activeTab) || TABS[0];
  }

  function renderTabs() {
    $("#bpTabs").innerHTML = TABS.map(tab => {
      const backgroundLive = tab.id === "notes" && Boolean(runtime.persistedNotesView);
      return `
      <button class="bp-tab" type="button" data-tab="${tab.id}" aria-selected="${tab.id === appState.activeTab}"${backgroundLive ? ' title="Typewriter continues in the background"' : ""}>
        <span aria-hidden="true">${tab.icon}</span><span>${tab.label}</span>${backgroundLive ? '<i class="bp-tab-live" aria-hidden="true">●</i><span class="bp-sr-only">Typewriter continues in the background</span>' : ""}
      </button>`;
    }).join("");
  }

  function setButtonState(button, { text, title, pressed = false, active = false, expanded } = {}) {
    if (!button) return;
    if (text !== undefined) button.textContent = text;
    if (title) {
      button.title = title;
      button.setAttribute("aria-label", title);
    }
    button.setAttribute("aria-pressed", String(Boolean(pressed)));
    if (expanded !== undefined) button.setAttribute("aria-expanded", String(Boolean(expanded)));
    button.classList.toggle("bp-action-active", Boolean(active));
  }

  function applyUI() {
    const preference = normalizePreferences(appState.preferences);
    appState.preferences = preference;
    const theme = applyDerivedTheme(preference.themeCode, preference.appMode, preference.readerMode);
    const preset = themePresetForCode(theme.code);
    document.body.classList.toggle("bp-light", preference.appMode === "light");
    document.body.classList.toggle("bp-reading-dark", preference.readerMode === "dark");
    document.body.classList.toggle("bp-density-readable", preference.density === "readable");

    const quoteText = String(appState.headerQuote || DEFAULT_STATE.headerQuote);
    const quote = $("#bpHeaderQuote");
    if (quote) quote.textContent = `"${quoteText}"`;
    const quoteButton = $("#bpHeaderQuoteBtn");
    if (quoteButton) {
      quoteButton.title = "Edit header quote";
      quoteButton.setAttribute("aria-expanded", String(runtime.quoteEditorOpen));
      quoteButton.classList.toggle("is-editing", runtime.quoteEditorOpen);
    }
    const quoteEditor = $("#bpQuoteEditor");
    if (quoteEditor) quoteEditor.hidden = !runtime.quoteEditorOpen;

    setButtonState($("#bpDataBtn"), {
      text: runtime.dataMenuOpen ? "Data ▴" : "Data ▾",
      title: runtime.dataMenuOpen ? "Hide import and export menu" : "Show import and export menu",
      pressed: runtime.dataMenuOpen,
      active: runtime.dataMenuOpen,
      expanded: runtime.dataMenuOpen
    });
    const dataMenu = $("#bpDataMenu");
    if (dataMenu) dataMenu.hidden = !runtime.dataMenuOpen;

    setButtonState($("#bpThemeBtn"), {
      text: `${preset?.icon || "◈"} ${preset?.shortLabel || "Custom"} ${runtime.themeMenuOpen ? "▴" : "▾"}`,
      title: runtime.themeMenuOpen ? "Hide theme generator" : "Open theme generator",
      pressed: runtime.themeMenuOpen,
      active: runtime.themeMenuOpen || !preset,
      expanded: runtime.themeMenuOpen
    });
    const themeMenu = $("#bpThemeMenu");
    if (themeMenu) themeMenu.hidden = !runtime.themeMenuOpen;
    if (!runtime.themeMenuOpen && appState.activeTab !== "tools") {
      clearThemeDraft();
    } else if (runtime.themeMenuOpen) {
      const draft = ensureThemeDraft();
      updateThemeGeneratorPreview(draft);
      updateThemeDraftUI(draft);
    }

    if (!runtime.themeMenuOpen) {
      const currentThemeName = $("#bpThemeCurrentName");
      if (currentThemeName) currentThemeName.textContent = `Applied · ${preset?.shortLabel || "Custom"}`;
      const profileBadge = $("#bpThemeProfileBadge");
      if (profileBadge) profileBadge.textContent = presentationProfileById(theme.profileId).name;
    }

    setButtonState($("#bpDisplayBtn"), {
      text: `Density · ${preference.density === "readable" ? "Readable" : "Compact"}`,
      title: "Toggle compact or readable workspace density",
      pressed: preference.density === "readable",
      active: preference.density === "readable"
    });
  }

  function themeFromGeneratorControls() {
    const base = normalizeHexColor($("#bpThemeBase")?.value);
    const surface = normalizeHexColor($("#bpThemeSurface")?.value);
    const accent = normalizeHexColor($("#bpThemeAccent")?.value);
    const fontId = fontPresetById($("#bpThemeFont")?.value).id;
    const profileId = presentationProfileById($("#bpThemeProfile")?.value).id;
    const marbleStyleId = marbleStyleById($("#bpThemeMarbleStyle")?.value).id;
    const recipeId = themeRecipeById(parseThemeString(runtime.themeDraftCode)?.recipeId || appliedTheme().recipeId).id;
    if (!base || !surface || !accent) return null;
    return parseThemeString(`${THEME_FORMAT}|${base}|${surface}|${accent}|${fontId}|${profileId}|${recipeId}|${marbleStyleId}`);
  }

  function themeFromToolControls() {
    const base = normalizeHexColor($("#bpToolThemeBase")?.value);
    const surface = normalizeHexColor($("#bpToolThemeSurface")?.value);
    const accent = normalizeHexColor($("#bpToolThemeAccent")?.value);
    const fontId = fontPresetById($("#bpToolThemeFont")?.value).id;
    const profileId = presentationProfileById($("#bpToolThemeProfile")?.value).id;
    const marbleStyleId = marbleStyleById($("#bpToolThemeMarbleStyle")?.value).id;
    const recipeId = themeRecipeById($("#bpToolThemeRecipe")?.value).id;
    if (!base || !surface || !accent) return null;
    return parseThemeString(`${THEME_FORMAT}|${base}|${surface}|${accent}|${fontId}|${profileId}|${recipeId}|${marbleStyleId}`);
  }

  function themeDerivationAudit(theme, appMode = appState?.preferences?.appMode, readerMode = appState?.preferences?.readerMode) {
    const resolved = themeRuntimeFor(theme?.code || theme, appMode, readerMode);
    const vars = resolved.variables;
    const source = resolved.resolvedTheme || resolveThemeSources(resolved.theme);
    const recipe = themeRecipeById(source.recipeId);
    const light = appMode === "light";
    const readerDark = readerMode === "dark";
    const recipePrefix = recipe.id === "balanced" ? "" : `${recipe.short} · `;
    const effectiveSurfaceLabel = recipe.id === "duo" ? "Foundation → Accent · 32% (calculated Surface)" : "Surface source";
    const rows = [
      ["App", "Background", "--bp-bg", vars["--bp-bg"], `${recipePrefix}Foundation → ${light ? "Paper" : "Black"}`, "mix"],
      ["App", "Panel", "--bp-panel", vars["--bp-panel"], `${recipePrefix}${recipe.id === "duo" ? "Calculated Surface" : "Surface"} → ${light ? "Paper" : "Foundation"}`, "mix"],
      ["App", "Soft panel", "--bp-panel-soft", vars["--bp-panel-soft"], `${recipePrefix}secondary surface treatment`, "mix"],
      ["App", "Deep panel", "--bp-panel-deep", vars["--bp-panel-deep"], `${recipePrefix}deep surface treatment`, "mix"],
      ["Controls", "Control", "--bp-control", vars["--bp-control"], `${recipePrefix}control surface`, "mix"],
      ["Controls", "Control text", "--bp-control-text", vars["--bp-control-text"], "Best contrast against Control", "contrast"],
      ["Controls", "Hover", "--bp-control-hover", vars["--bp-control-hover"], `${recipePrefix}accent hover surface`, "mix"],
      ["Controls", "Hover text", "--bp-control-hover-text", vars["--bp-control-hover-text"], "Best contrast against Hover", "contrast"],
      ["Controls", "Active", "--bp-control-active", vars["--bp-control-active"], "Accent source", "source"],
      ["Controls", "Active text", "--bp-control-active-text", vars["--bp-control-active-text"], "Best contrast against Active", "contrast"],
      ["Controls", "Focus", "--bp-focus", vars["--bp-focus"], `Contrast guard ≥ ${themeContrastMinimum(source, "focus").toFixed(1)}:1`, "contrast"],
      ["Text", "Text", "--bp-text", vars["--bp-text"], "Best contrast against Panel", "contrast"],
      ["Text", "Muted", "--bp-muted", vars["--bp-muted"], `Contrast guard ≥ ${themeContrastMinimum(source, "muted").toFixed(1)}:1`, "contrast"],
      ["Text", "Border", "--bp-border", vars["--bp-border"], `Accent corrected to ≥ ${themeContrastMinimum(source, "border").toFixed(2)}:1 on Panel`, "contrast"],
      ["Reader", "Background", "--bp-reader-bg", vars["--bp-reader-bg"], `${recipePrefix}${readerDark ? "Foundation → Black" : `${recipe.id === "duo" ? "Calculated Surface" : "Surface"} → Paper`}`, "mix"],
      ["Reader", "Text", "--bp-reader-text", vars["--bp-reader-text"], "Best contrast against Reader", "contrast"],
      ["Reader", "Link", "--bp-link", vars["--bp-link"], `Accent corrected to ≥ ${recipe.id === "contrast" ? "5.0" : "4.5"}:1 on Reader`, "contrast"],
      ["Reader", "Visited", "--bp-link-visited", vars["--bp-link-visited"], "Link → Reader text · contrast corrected", "contrast"],
      ["Code", "Background", "--bp-reader-code-bg", vars["--bp-reader-code-bg"], "Reader-safe code surface", "mix"],
      ["Code", "Text", "--bp-reader-code-text", vars["--bp-reader-code-text"], "Best contrast against code background", "contrast"],
      ["Code", "Keyword", "--bp-reader-code-keyword", vars["--bp-reader-code-keyword"], "Accent → Code text · saturation-capped", "contrast"],
      ["Code", "String", "--bp-reader-code-string", vars["--bp-reader-code-string"], "Accent Soft → Code text", "contrast"],
      ["Code", "Number", "--bp-reader-code-number", vars["--bp-reader-code-number"], "Focus → Code text", "contrast"],
      ["Code", "Comment", "--bp-reader-code-muted", vars["--bp-reader-code-muted"], "Code text → Code background", "contrast"],
      ["Board", "Board", "--bp-board-bg", vars["--bp-board-bg"], `${recipePrefix}surface / foundation blend`, "mix"],
      ...Array.from({ length: 6 }, (_, index) => ["Board", `Note ${index + 1}`, `--bp-note-tone-${index + 1}`, vars[`--bp-note-tone-${index + 1}`], `${recipe.short} palette variant`, "variant"]),
    ];
    const deepWeight = recipe.id === "contrast" ? 46 : 34;
    const surfaceDeepWeight = recipe.id === "contrast" ? 48 : 34;
    const softWeight = recipe.id === "contrast" ? 42 : 34;
    const surfaceSoftWeight = recipe.id === "contrast" ? 50 : 42;
    const accentSoftWeight = recipe.id === "contrast" ? 46 : 38;
    return {
      theme: resolved.theme,
      recipe,
      effectiveSurface: source.surface,
      variables: vars,
      anchors: [
        { label: "Foundation", value: resolved.theme.base, kind: "source" },
        { label: recipe.id === "duo" ? "Surface · authored" : "Surface", value: resolved.theme.surface, kind: recipe.id === "duo" ? "hint" : "source" },
        ...(recipe.id === "duo" ? [{ label: "Surface · calculated", value: source.surface, kind: "calculated" }] : []),
        { label: "Accent", value: resolved.theme.accent, kind: "source" },
        { label: "Paper", value: "#FFF8EC", kind: "anchor" },
        { label: "Black", value: "#080708", kind: "anchor" },
      ],
      variants: [
        { family: "Foundation", label: "Deep", token: "--bp-foundation-deep", value: vars["--bp-foundation-deep"], source: `Foundation → Black · ${deepWeight}%${recipe.id === "s-curve" ? " S" : ""}` },
        { family: "Foundation", label: "Source", token: "--bp-foundation", value: vars["--bp-foundation"], source: "Foundation source" },
        { family: "Foundation", label: "Soft", token: "--bp-foundation-soft", value: vars["--bp-foundation-soft"], source: `Foundation → Paper · ${softWeight}%${recipe.id === "s-curve" ? " S" : ""}` },
        { family: "Surface", label: "Deep", token: "--bp-surface-deep", value: vars["--bp-surface-deep"], source: `${recipe.id === "duo" ? "Calculated Surface" : "Surface"} → Foundation · ${surfaceDeepWeight}%${recipe.id === "s-curve" ? " S" : ""}` },
        { family: "Surface", label: "Source", token: "--bp-surface-source", value: vars["--bp-surface-source"], source: effectiveSurfaceLabel },
        { family: "Surface", label: "Soft", token: "--bp-surface-soft-source", value: vars["--bp-surface-soft-source"], source: `${recipe.id === "duo" ? "Calculated Surface" : "Surface"} → Paper · ${surfaceSoftWeight}%${recipe.id === "s-curve" ? " S" : ""}` },
        { family: "Accent", label: "Deep", token: "--bp-accent-deep", value: vars["--bp-accent-deep"], source: `Accent → Foundation · ${deepWeight}%${recipe.id === "s-curve" ? " S" : ""}` },
        { family: "Accent", label: "Source", token: "--bp-accent-source", value: vars["--bp-accent-source"], source: "Accent source" },
        { family: "Accent", label: "Soft", token: "--bp-accent-soft", value: vars["--bp-accent-soft"], source: `Accent → Paper · ${accentSoftWeight}%${recipe.id === "s-curve" ? " S" : ""}` },
      ],
      rows: rows.map(([group, label, token, value, sourceText, kind]) => ({ group, label, token, value, source: sourceText, kind })),
    };
  }

  function themeContrastGrade(ratio, large = false) {
    const value = Number(ratio) || 0;
    if (value >= 7) return { label: "AAA", level: "great" };
    if (value >= 4.5) return { label: "AA", level: "good" };
    if (large && value >= 3) return { label: "AA large", level: "warn" };
    if (value >= 3) return { label: "UI only", level: "warn" };
    return { label: "Low", level: "fail" };
  }

  function themeCalculationReport(theme) {
    const resolved = themeRuntimeFor(theme?.code || theme, appState.preferences.appMode, appState.preferences.readerMode);
    const source = resolved.resolvedTheme || resolveThemeSources(resolved.theme);
    const vars = resolved.variables;
    const pairs = [
      ["App text", vars["--bp-text"], vars["--bp-panel"]],
      ["Muted UI", vars["--bp-muted"], vars["--bp-panel"]],
      ["Control", vars["--bp-control-text"], vars["--bp-control"]],
      ["Hover control", vars["--bp-control-hover-text"], vars["--bp-control-hover"]],
      ["Active control", vars["--bp-control-active-text"], vars["--bp-control-active"]],
      ["Input", vars["--bp-input-text"], vars["--bp-input-bg"]],
      ["Reader text", vars["--bp-reader-text"], vars["--bp-reader-bg"]],
      ["Reader link", vars["--bp-link"], vars["--bp-reader-bg"]],
      ["Reader muted", vars["--bp-reader-muted"], vars["--bp-reader-bg"]],
      ["Code text", vars["--bp-reader-code-text"], vars["--bp-reader-code-bg"]],
      ["Code keyword", vars["--bp-reader-code-keyword"], vars["--bp-reader-code-bg"]],
      ["Code string", vars["--bp-reader-code-string"], vars["--bp-reader-code-bg"]],
      ["Border / panel", vars["--bp-border"], vars["--bp-panel"]],
    ].map(([label, foreground, background]) => {
      const ratio = contrastRatio(foreground, background);
      return { label, foreground, background, ratio, grade: themeContrastGrade(ratio) };
    });
    const sourcePairs = [
      ["Foundation ↔ Surface", resolved.theme.base, source.surface],
      ["Surface ↔ Accent", source.surface, resolved.theme.accent],
      ["Foundation ↔ Accent", resolved.theme.base, resolved.theme.accent],
    ].map(([label, first, second]) => ({ label, first, second, ratio: contrastRatio(first, second) }));
    const low = pairs.filter(item => item.grade.level === "fail").length;
    const warnings = [];
    if (low) warnings.push(`${low} visible role${low === 1 ? "" : "s"} below 3:1`);
    if (sourcePairs.every(item => item.ratio < 1.6)) warnings.push("Source colours are very close; variants may collapse visually.");
    if (source.recipe.id === "duo") warnings.push("Surface is calculated from Foundation + Accent; its authored swatch is retained only as a reversible hint.");
    if (!warnings.length) warnings.push("No critical contrast collapse detected in the current app/reader modes.");
    return { resolved, source, pairs, sourcePairs, warnings };
  }

  function themeLiteralColorAudit() {
    const anchors = new Set(["#fff8ec", "#080708", "#fff7e8", "#151012", "#ffffff", "#080808"]);
    const counts = new Map();
    const scanRule = rule => {
      const text = String(rule?.cssText || "");
      const matches = text.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi) || [];
      matches.forEach(raw => {
        const key = raw.toLowerCase();
        if (anchors.has(key)) return;
        counts.set(key, (counts.get(key) || 0) + 1);
      });
      if (rule?.cssRules) Array.from(rule.cssRules).forEach(scanRule);
    };
    for (const sheet of Array.from(document.styleSheets || [])) {
      try { Array.from(sheet.cssRules || []).forEach(scanRule); } catch { /* same-origin/file restrictions */ }
    }
    const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    return { references: entries.reduce((sum, item) => sum + item[1], 0), unique: entries.length, top: entries.slice(0, 6) };
  }

  function renderThemeCalculation(theme) {
    const report = themeCalculationReport(theme);
    const recipe = report.source.recipe;
    const literalAudit = themeLiteralColorAudit();
    return `
      <section class="bp-theme-calc-panel">
        <header><div><strong>${escapeHTML(recipe.name)}</strong><small>${escapeHTML(recipe.description)}</small></div><b>${report.pairs.filter(item => item.grade.level !== "fail").length}/${report.pairs.length} readable</b></header>
        <div class="bp-theme-calc-chain"><span>Sources</span><i>→</i><span>${escapeHTML(recipe.short)}</span><i>→</i><span>Variants</span><i>→</i><span>Contrast guard</span><i>→</i><span>Roles</span></div>
        <div class="bp-theme-contrast-grid">
          ${report.pairs.map(item => `<div class="bp-theme-contrast-row is-${item.grade.level}"><span>${escapeHTML(item.label)}</span><i style="--fg:${escapeHTML(item.foreground)};--bg:${escapeHTML(item.background)}"></i><b>${item.ratio.toFixed(2)}:1</b><em>${escapeHTML(item.grade.label)}</em></div>`).join("")}
        </div>
        <div class="bp-theme-source-separation">
          ${report.sourcePairs.map(item => `<span><b>${escapeHTML(item.label)}</b><small>${item.ratio.toFixed(2)}:1 source separation</small></span>`).join("")}
        </div>
        <p>${report.warnings.map(item => escapeHTML(item)).join(" · ")}</p>
        <details class="bp-theme-literal-audit"><summary>Literal CSS colour debt · ${literalAudit.unique} unique / ${literalAudit.references} refs</summary><div>${literalAudit.top.length ? literalAudit.top.map(([value, count]) => `<code>${escapeHTML(value)} ×${count}</code>`).join("") : "No non-anchor literal colours detected."}</div></details>
      </section>`;
  }

  function renderThemeAudit(theme) {
    const audit = themeDerivationAudit(theme);
    const sourceCount = audit.anchors.filter(item => item.kind === "source").length;
    const derivedCount = audit.rows.length;
    return `
      <div class="bp-theme-tool-summary"><strong>${sourceCount} source colours</strong><span>→</span><strong>${audit.variants.length} reusable variants</strong><span>→</span><strong>${derivedCount} visible roles</strong><small>Paper and Black remain neutral anchors. The named variants are stable semantic stepping stones intended to replace one-off literal colours before final roles are contrast-resolved.</small></div>
      <div class="bp-theme-source-flow" aria-label="Theme derivation sources">
        ${audit.anchors.map(item => `<div class="bp-theme-source-chip is-${escapeHTML(item.kind)}"><i style="--swatch:${escapeHTML(item.value)}"></i><span><strong>${escapeHTML(item.label)}</strong><small>${escapeHTML(item.value)}</small></span></div>`).join("")}
      </div>
      <div class="bp-theme-variant-grid" aria-label="Reusable theme variants">
        ${audit.variants.map(item => `<div class="bp-theme-variant-chip"><small>${escapeHTML(item.family)}</small><i style="--swatch:${escapeHTML(item.value)}"></i><strong>${escapeHTML(item.label)}</strong><code>${escapeHTML(item.token)}</code><span>${escapeHTML(item.source)}</span></div>`).join("")}
      </div>
      <div class="bp-theme-token-table">
        ${audit.rows.map(item => `<div class="bp-theme-token-row" data-kind="${escapeHTML(item.kind)}"><small>${escapeHTML(item.group)}</small><i style="--swatch:${escapeHTML(item.value)}"></i><strong>${escapeHTML(item.label)}</strong><code>${escapeHTML(item.token)}</code><span>${escapeHTML(item.source)}</span></div>`).join("")}
      </div>`;
  }

  function updateThemeGeneratorPreview(theme = themeFromGeneratorControls()) {
    if (!theme) return;
    const stringInput = $("#bpThemeStringInput");
    if (stringInput && document.activeElement !== stringInput) stringInput.value = theme.code;
    const font = fontPresetById(theme.fontId);
    const fontHint = $("#bpThemeFontHint");
    if (fontHint) { fontHint.textContent = "Aa"; fontHint.style.fontFamily = font.stack; }
    const profile = presentationProfileById(theme.profileId);
    const marbleStyle = marbleStyleById(theme.marbleStyleId);
    const profileHint = $("#bpThemeProfileHint");
    if (profileHint) profileHint.textContent = profile.name;
    const marbleHint = $("#bpThemeMarbleHint");
    if (marbleHint) marbleHint.textContent = marbleStyle.name;

    for (const key of ["base", "surface", "accent"]) {
      const swatch = $(`[data-theme-preview="${key}"]`);
      if (swatch) { swatch.style.background = theme[key]; swatch.textContent = theme[key]; swatch.style.color = contrastText(theme[key]); }
    }

    const live = themeRuntimeFor(theme.code, appState.preferences.appMode, appState.preferences.readerMode);
    const vars = live.variables;
    const applyPreview = viewport => {
      if (!viewport) return;
      viewport.style.fontFamily = font.stack;
      viewport.style.setProperty("--demo-bg", vars["--bp-bg"]);
      viewport.style.setProperty("--demo-panel", vars["--bp-panel"]);
      viewport.style.setProperty("--demo-deep", vars["--bp-panel-deep"]);
      viewport.style.setProperty("--demo-control", vars["--bp-control"]);
      viewport.style.setProperty("--demo-control-text", vars["--bp-control-text"] || vars["--bp-text"]);
      viewport.style.setProperty("--demo-text", vars["--bp-text"]);
      viewport.style.setProperty("--demo-muted", vars["--bp-muted"]);
      viewport.style.setProperty("--demo-accent", vars["--bp-accent"]);
      viewport.style.setProperty("--demo-focus", vars["--bp-focus"]);
      viewport.style.setProperty("--demo-reader", vars["--bp-reader-bg"]);
      viewport.style.setProperty("--demo-reader-text", vars["--bp-reader-text"]);
      viewport.style.setProperty("--demo-link", vars["--bp-link"]);
      viewport.style.setProperty("--demo-code", vars["--bp-reader-code-bg"]);
      viewport.style.setProperty("--demo-code-text", vars["--bp-reader-code-text"]);
      viewport.style.setProperty("--demo-code-keyword", vars["--bp-reader-code-keyword"]);
      viewport.dataset.presentation = profile.id;
      viewport.dataset.marbleStyle = marbleStyle.id;
    };
    applyPreview($("#bpThemeViewport"));
    applyPreview($("#bpToolThemeViewport"));
    applyPreview($("#bpToolThemePreviewShell"));

    const machine = $("#bpToolThemeCreate");
    if (machine) {
      machine.innerHTML = renderThemeFlowMachine(theme);
      bindThemeFlowInteractions();
      if (runtime.themeToolView === "create") animateThemeFlow();
    }
    const calculation = $("#bpToolThemeCalculation");
    if (calculation) calculation.innerHTML = renderThemeCalculation(theme);
    const audit = $("#bpToolThemeAudit");
    if (audit) audit.innerHTML = renderThemeAudit(theme);
    const exportText = $("#bpToolThemeExportText");
    if (exportText && document.activeElement !== exportText) exportText.value = themeExportText(theme);

    const recipeGuide = $("#bpToolThemeRecipeGuide");
    if (recipeGuide) {
      const recipe = themeRecipeById(theme.recipeId);
      recipeGuide.innerHTML = `<b>${escapeHTML(recipe.name)}</b><span>${escapeHTML(recipe.description)}</span>`;
    }
    const toolRecipe = $("#bpToolThemeRecipe");
    if (toolRecipe && document.activeElement !== toolRecipe) toolRecipe.value = theme.recipeId || DEFAULT_THEME_RECIPE_ID;
    const toolStatus = $("#bpToolThemeDraftStatus");
    if (toolStatus) {
      const applied = appliedTheme();
      toolStatus.textContent = theme.code === applied.code ? "Applied" : "Draft";
      toolStatus.classList.toggle("is-dirty", theme.code !== applied.code);
    }
    const toolProfile = $("#bpToolThemeProfileHint");
    if (toolProfile) toolProfile.textContent = profile.name;
    const toolMarble = $("#bpToolThemeMarbleHint");
    if (toolMarble) toolMarble.textContent = marbleStyle.name;
    const toolPreset = $("#bpToolThemePresetSelect");
    if (toolPreset) toolPreset.value = themePresetForCode(theme.code)?.id || "custom";
    for (const [key, selector, textSelector] of [["base", "#bpToolThemeBase", "#bpToolThemeBaseText"], ["surface", "#bpToolThemeSurface", "#bpToolThemeSurfaceText"], ["accent", "#bpToolThemeAccent", "#bpToolThemeAccentText"]]) {
      const input = $(selector), textInput = $(textSelector), value = theme[key];
      if (input && document.activeElement !== input) input.value = value;
      if (textInput && document.activeElement !== textInput) textInput.value = value;
    }

    $$('[data-theme-app-mode]').forEach(button => button.classList.toggle("is-active", button.dataset.themeAppMode === appState.preferences.appMode));
    $$('[data-theme-reader-mode]').forEach(button => button.classList.toggle("is-active", button.dataset.themeReaderMode === appState.preferences.readerMode));
    $$('[data-tool-theme-app-mode]').forEach(button => button.classList.toggle("is-active", button.dataset.toolThemeAppMode === appState.preferences.appMode));
    $$('[data-tool-theme-reader-mode]').forEach(button => button.classList.toggle("is-active", button.dataset.toolThemeReaderMode === appState.preferences.readerMode));
    $$('[data-theme-accent-mode]').forEach(button => button.classList.toggle("is-active", button.dataset.themeAccentMode === runtime.themeAccentMode));
    setThemePreviewTab(runtime.themePreviewTab);
  }

  function applyThemeCode(code, { toast = true } = {}) {
    const theme = parseThemeString(code);
    if (!theme) {
      showToast("Theme needs three six-digit colours plus supported font, presentation, recipe, and marble style.");
      return false;
    }
    appState.preferences.themeCode = theme.code;
    if (runtime.themeMenuOpen || appState.activeTab === "tools") {
      runtime.themeDraftCode = theme.code;
      const exactPreset = themePresetForCode(theme.code);
      if (exactPreset) runtime.themeDraftOriginPresetId = exactPreset.id;
    }
    saveState();
    applyUI();
    if (toast) showToast("Theme applied.");
    return true;
  }

  async function copyThemeString() {
    const theme = parseThemeString(runtime.themeDraftCode) || themeFromGeneratorControls() || appliedTheme();
    if (!theme) return;
    const input = $("#bpThemeStringInput");
    if (input) input.value = theme.code;
    try {
      await navigator.clipboard.writeText(theme.code);
      showToast("Theme string copied.");
    } catch {
      input?.focus();
      input?.select();
      showToast("Theme string selected. Copy it from the field.");
    }
  }

  function renderApp({ preserveTypewriterView = false } = {}) {
    runtime.boardViewCleanup?.();
    runtime.boardViewCleanup = null;
    appState.activeTab = normalizeActiveTab(appState.activeTab);
    applyUI();
    renderTabs();
    const tab = activeTab();
    const workspace = $("#bpWorkspace");
    if (tab.id !== "drawingBoard" && runtime.boardTypewriterEngine) destroyBoardTypewriter();

    if (preserveTypewriterView && tab.id !== "notes") {
      const parked = parkActiveNotesView();
      if (!parked) {
        destroyNotesWorkbench();
        destroyTypewriter();
      }
      workspace.innerHTML = tab.render();
      tab.bind();
      if (parked) renderTabs();
      return;
    }

    if (preserveTypewriterView && tab.id === "notes" && restorePersistedNotesView()) {
      renderTabs();
      return;
    }

    if (tab.id !== "notes" && runtime.persistedNotesView && typewriterBackgroundPersistEnabled()) {
      workspace.innerHTML = tab.render();
      tab.bind();
      return;
    }

    destroyNotesWorkbench();
    destroyTypewriter();
    workspace.innerHTML = tab.render();
    tab.bind();
  }

  function bindGlobalUI() {
    document.addEventListener("click", event => {
      const tab = event.target.closest("[data-tab]");
      if (tab) {
        commitDrawingBoardBodies();
        const previousTab = normalizeActiveTab(appState.activeTab);
        const nextTab = normalizeActiveTab(tab.dataset.tab);
        const persistAcrossViewSwitch = previousTab !== nextTab && (
          (previousTab === "notes" && nextTab !== "notes" && typewriterBackgroundPersistEnabled() && Boolean(runtime.typewriterEngine)) ||
          (previousTab !== "notes" && nextTab === "notes" && canRestorePersistedNotesView())
        );
        appState.activeTab = nextTab;
        runtime.openLinksNoteId = "";
        if (!persistAcrossViewSwitch) runtime.notesTypewriterSettingsOpen = false;
        saveState();
        renderApp({ preserveTypewriterView: persistAcrossViewSwitch });
        return;
      }

      if (runtime.dataMenuOpen && !event.target.closest(".bp-action-dropdown")) {
        runtime.dataMenuOpen = false;
        applyUI();
      }
      if (runtime.themeMenuOpen && !event.target.closest(".bp-theme-dropdown")) {
        runtime.themeMenuOpen = false;
        applyUI();
      }
    });

    $("#bpHeaderQuoteBtn")?.addEventListener("click", event => {
      event.stopPropagation();
      runtime.quoteEditorOpen = !runtime.quoteEditorOpen;
      runtime.dataMenuOpen = false;
      runtime.themeMenuOpen = false;
      if (runtime.quoteEditorOpen) {
        const input = $("#bpQuoteInput");
        if (input) input.value = String(appState.headerQuote || DEFAULT_STATE.headerQuote);
      }
      applyUI();
      if (runtime.quoteEditorOpen) window.requestAnimationFrame(() => $("#bpQuoteInput")?.focus());
    });
    $("#bpQuoteSaveBtn")?.addEventListener("click", () => {
      const input = $("#bpQuoteInput");
      const value = String(input?.value || "").trim();
      if (!value) {
        showToast("Enter a quote or use Reset.");
        input?.focus();
        return;
      }
      appState.headerQuote = value.slice(0, 180);
      runtime.quoteEditorOpen = false;
      saveState();
      applyUI();
      showToast("Header quote saved.");
    });
    $("#bpQuoteCancelBtn")?.addEventListener("click", () => {
      runtime.quoteEditorOpen = false;
      applyUI();
    });
    $("#bpQuoteResetBtn")?.addEventListener("click", () => {
      const input = $("#bpQuoteInput");
      if (input) {
        input.value = DEFAULT_STATE.headerQuote;
        input.focus();
        input.select();
      }
    });
    $("#bpQuoteInput")?.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        $("#bpQuoteSaveBtn")?.click();
      } else if (event.key === "Escape") {
        event.preventDefault();
        runtime.quoteEditorOpen = false;
        applyUI();
        $("#bpHeaderQuoteBtn")?.focus();
      }
    });

    $("#bpDataBtn")?.addEventListener("click", event => {
      event.stopPropagation();
      runtime.dataMenuOpen = !runtime.dataMenuOpen;
      runtime.themeMenuOpen = false;
      runtime.quoteEditorOpen = false;
      applyUI();
    });
    $("#bpExportBtn")?.addEventListener("click", () => {
      runtime.dataMenuOpen = false;
      exportWorkspace();
      applyUI();
    });
    $("#bpImportBtn")?.addEventListener("click", () => $("#bpImportFile")?.click());
    $("#bpImportFile")?.addEventListener("change", event => {
      const file = event.target.files?.[0];
      runtime.dataMenuOpen = false;
      if (file) importWorkspace(file);
      event.target.value = "";
      applyUI();
    });

    $("#bpThemeBtn")?.addEventListener("click", event => {
      event.stopPropagation();
      runtime.themeMenuOpen = !runtime.themeMenuOpen;
      runtime.dataMenuOpen = false;
      runtime.quoteEditorOpen = false;
      applyUI();
    });
    const captureThemeDraft = () => {
      const theme = themeFromGeneratorControls();
      if (!theme) return;
      const exactPreset = themePresetForCode(theme.code);
      if (exactPreset) runtime.themeDraftOriginPresetId = exactPreset.id;
      runtime.themeDraftCode = theme.code;
      updateThemeGeneratorPreview(theme);
      updateThemeDraftUI(theme);
    };
    for (const id of ["bpThemeBase", "bpThemeSurface", "bpThemeAccent", "bpThemeFont", "bpThemeProfile", "bpThemeMarbleStyle"]) {
      $(`#${id}`)?.addEventListener("input", captureThemeDraft);
      $(`#${id}`)?.addEventListener("change", captureThemeDraft);
    }
    $("#bpThemePresetSelect")?.addEventListener("change", event => {
      const preset = THEME_PRESETS.find(item => item.id === event.target.value);
      if (!preset) return;
      setThemeDraft(preset.code, { originPresetId: preset.id });
    });
    $("#bpThemeRevertBtn")?.addEventListener("click", () => {
      const theme = appliedTheme();
      const preset = themePresetForCode(theme.code);
      setThemeDraft(theme.code, { originPresetId: preset?.id || "" });
    });
    $("#bpThemeApplyBtn")?.addEventListener("click", () => {
      const theme = parseThemeString(runtime.themeDraftCode) || themeFromGeneratorControls();
      if (theme) applyThemeCode(theme.code);
    });
    $("#bpThemeCopyBtn")?.addEventListener("click", copyThemeString);
    $("#bpThemeLoadBtn")?.addEventListener("click", () => {
      const input = $("#bpThemeStringInput");
      const theme = parseThemeString(input?.value);
      if (!theme) {
        showToast("Theme string needs three six-digit colours; font/presentation/marble style may be supplied or migrated.");
        input?.focus();
        return;
      }
      const preset = themePresetForCode(theme.code);
      setThemeDraft(theme.code, { originPresetId: preset?.id || "" });
      showToast("Theme code loaded into draft.");
    });
    $("#bpThemeStringInput")?.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        $("#bpThemeLoadBtn")?.click();
      }
    });
    $$('[data-theme-app-mode]').forEach(button => button.addEventListener("click", () => {
      appState.preferences.appMode = button.dataset.themeAppMode === "light" ? "light" : "dark";
      saveState();
      applyUI();
      updateThemeGeneratorPreview();
    }));
    $$('[data-theme-reader-mode]').forEach(button => button.addEventListener("click", () => {
      commitDrawingBoardBodies();
      appState.preferences.readerMode = button.dataset.themeReaderMode === "dark" ? "dark" : "light";
      saveState();
      applyUI();
      updateThemeGeneratorPreview();
    }));
    $("#bpDisplayBtn")?.addEventListener("click", () => {
      appState.preferences.density = appState.preferences.density === "readable" ? "compact" : "readable";
      saveState();
      applyUI();
    });

    window.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if (runtime.quoteEditorOpen) {
        runtime.quoteEditorOpen = false;
        applyUI();
        $("#bpHeaderQuoteBtn")?.focus();
      } else if (runtime.themeMenuOpen) {
        runtime.themeMenuOpen = false;
        applyUI();
        $("#bpThemeBtn")?.focus();
      } else if (runtime.boardHolderManagerOpen && appState.activeTab === "drawingBoard") {
        runtime.boardHolderManagerOpen = false;
        runtime.boardHolderManagerFocusId = "";
        refreshBoardOverlayLayer();
      } else if (runtime.boardRepairOpen && appState.activeTab === "drawingBoard") {
        runtime.boardRepairOpen = false;
        runtime.boardRepairTargetId = "";
        refreshBoardOverlayLayer();
      } else if (runtime.openLinksNoteId) {
        commitDrawingBoardBodies();
        flushPendingSave();
        runtime.openLinksNoteId = "";
        if (appState.activeTab === "drawingBoard") renderApp();
      } else if (runtime.dataMenuOpen) {
        runtime.dataMenuOpen = false;
        applyUI();
      }
    });
  }

  function boot() {
    appState = loadState();
    bindGlobalUI();
    window.addEventListener("beforeunload", () => {
      commitDrawingBoardBodies();
      destroyNotesWorkbench();
      destroyTypewriter();
      destroyBoardTypewriter();
      runtime.boardViewCleanup?.();
      runtime.boardViewCleanup = null;
      flushPendingSave();
    });
    saveState();
    renderApp();
  }

  boot();
})();
