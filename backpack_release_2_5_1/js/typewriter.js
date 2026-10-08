(() => {
  'use strict';

  const HOST_MODE = window.MARKDOWN_TYPEWRITER_HOST_MODE === true;

  /* ========================================================================
   *  Markdown Typewriter v2
   *
   *  EDITABLE CONFIGURATION
   *  ----------------------------------------------------------------------
   *  Backpack/API integrations should generally override these parameters
   *  through MarkdownTypewriter.configure() or loadNote({ parameters }).
   *  The renderer itself should not contain magic timing numbers.
   * ====================================================================== */

  const APP_VERSION = '2.9.0-draft.18';

  const HEADING_VELOCITY_PRESETS = {
    equality: {
      label: 'Equality',
      description: 'Start every heading section as soon as possible.',
      startPolicy: 'immediate',
      depthRate: [1, 1, 1, 1, 1, 1],
    },

    indentation: {
      label: 'Indentation',
      description: 'Establish main headings first, then release nested headings through their hierarchy while deeper levels accelerate.',
      startPolicy: 'hierarchical',
      depthRate: [1, 1.35, 1.7, 2.05, 2.4, 2.75],
    },

    completePreviousHeader: {
      label: 'Complete previous header',
      description: 'Start each section when the previous section heading has finished, without waiting for its body.',
      startPolicy: 'previous-heading',
      depthRate: [1, 1, 1, 1, 1, 1],
    },
  };

  const CONSTRUCTOR_DEFINITIONS = {
    codeblock: {
      name: 'codeblock',
      label: 'Code block',
      type: 'block',
      selector: 'pre > code',
      velocity: 'indentation',
      mutableItems: true,
      description: 'Recursive self-contained Typewriter viewports with local schedulers, child CODE scopes, named loop timers, copy controls, and per-block API overrides.',
      sourceSyntax: [
        '<!--CODE--> ... <!--/CODE-->',
        '<!--CODE:VERSE--> ... <!--/CODE-->',
        '<!--CODE:PY--> ... <!--/CODE--> (nested child viewport)',
        '<CODEBLOCK>id=child,Hold:5s,render:indentation',
        '<!--LOOP:LoopA Hold=5s--> ... <!--/LOOP:LoopA-->',
      ],
      fenceMetadata: [
        'id', 'copy-id', 'title', 'copy-label', 'copy-enabled', 'copy-mode',
        'preset', 'font', 'tab-size', 'indent-unit', 'hold', 'render', 'css-*', 'header-css-*',
        'code-css-*', 'copy-css-*',
      ],
      events: ['codeblock-constructed', 'codeblock-cycle', 'codeblock-loop-cycle', 'codeblock-copy'],
    },

    styledlinks: {
      name: 'styledlinks',
      label: 'Styled links',
      type: 'inline',
      selector: 'a[href]',
      description: 'Markdown links with source-level metadata overrides, named presets, API-controlled CSS, reveal animation, hover behavior, and navigation behavior.',
      markdownMetadata: {
        syntax: '[label](url){#id .class preset=name key=value}',
        keys: ['preset', 'open', 'rel', 'pointer-while-typing', 'css-*', 'hover-*', 'hover-css-*', 'reveal-*', 'reveal-beats', 'reveal-loop', 'reveal-loop-hold', 'glow-*'],
      },
      events: ['styledlink-constructed', 'styledlink-reveal', 'styledlink-activate'],
    },

    strikeout: {
      name: 'strikeout',
      label: 'Strikeout',
      type: 'inline',
      selector: 'del',
      description: 'GFM strikeout rendered as a constructor: type the source normally, then draw the strike using the selected playback/heading velocity unless a fixed velocity is requested.',
      markdownMetadata: {
        syntax: '~~text~~{#id .class preset=name velocity=inherit}',
        keys: ['preset', 'velocity', 'velocity-multiplier', 'duration', 'duration-beats', 'max-duration', 'hold', 'easing', 'animation-loop', 'animation-loop-hold', 'css-*', 'line-color', 'line-thickness', 'line-position'],
      },
      velocityModes: ['inherit', 'playback', 'fixed'],
      events: ['strikeout-constructed', 'strikeout-draw'],
    },

    strong: {
      name: 'strong',
      label: 'Bold / strong',
      type: 'inline',
      selector: 'strong',
      description: 'Bold Markdown with configurable completion pulses, presets, CSS, and renderer-aware animation velocity.',
      markdownMetadata: {
        syntax: '**text**{#id .class preset=name pulse=true}',
        keys: ['preset', 'pulse', 'pulse-scale', 'pulse-duration', 'pulse-beats', 'pulse-min-duration', 'pulse-max-duration', 'pulse-count', 'pulse-easing', 'pulse-velocity', 'pulse-velocity-multiplier', 'pulse-loop', 'pulse-loop-hold', 'css-*'],
      },
      velocityModes: ['inherit', 'playback', 'fixed'],
      events: ['strong-constructed', 'strong-pulse'],
    },

    emphasis: {
      name: 'emphasis',
      label: 'Italic / emphasis',
      type: 'inline',
      selector: 'em',
      description: 'Italic Markdown with configurable typing behavior. The cursive mode accelerates connected letters and adds a natural word-boundary beat.',
      markdownMetadata: {
        syntax: '*text*{#id .class preset=cursive typing=cursive}',
        keys: ['preset', 'typing', 'typing-rate', 'cursive-letter-rate', 'cursive-word-pause', 'css-*'],
      },
      typingModes: ['inherit', 'cursive', 'steady'],
      events: ['emphasis-constructed'],
    },

    lists: {
      name: 'lists',
      label: 'Lists / vignettes',
      type: 'structural',
      selector: 'ul, ol, li',
      description: 'List items with real vignette elements that can pulse, rotate, or combine both while preserving native nesting and ordered numbering.',
      markdownMetadata: {
        syntax: '- item{#id .class preset=pulse vignette=pulse}',
        keys: ['preset', 'vignette', 'vignette-trigger', 'vignette-duration', 'vignette-beats', 'vignette-min-duration', 'vignette-max-duration', 'vignette-count', 'vignette-scale', 'vignette-rotate', 'vignette-velocity', 'vignette-velocity-multiplier', 'vignette-text', 'vignette-loop', 'vignette-loop-hold', 'css-*', 'vignette-css-*'],
      },
      velocityModes: ['inherit', 'playback', 'fixed'],
      vignetteModes: ['none', 'pulse', 'rotate', 'pulse-rotate'],
      events: ['listitem-constructed', 'listitem-vignette'],
    },
  };


  const CONTROL_SEMANTICS = Object.freeze({
    families: Object.freeze({
      pace: Object.freeze({
        label: 'Pace',
        symbol: '⌁',
        description: 'Typing rates and cadence-relative motion. Beat values follow the cadence of the text that owns the effect.',
      }),
      hold: Object.freeze({
        label: 'Holds',
        symbol: '⏱',
        description: 'Literal visible or wait time. Holds do not become faster merely because page typing accelerates.',
      }),
      repeat: Object.freeze({
        label: 'Repetition',
        symbol: '↻',
        description: 'Runtime loops and replay policy for CODE and transient constructor effects.',
      }),
      toggle: Object.freeze({
        label: 'Toggles',
        symbol: '◉',
        description: 'Availability switches for constructors and progressive-flow behavior.',
      }),
      presentation: Object.freeze({
        label: 'Presentation',
        symbol: '▦',
        description: 'Scheduler and layout policy. These controls change how work is presented, not the authored content.',
      }),
    }),
    timingSources: Object.freeze({
      'owner-cadence': Object.freeze({
        label: 'Owner cadence',
        description: 'Resolved from the exact page player that revealed the object. Concurrent budget changes later do not retime an already-owned effect loop.',
      }),
      playback: Object.freeze({
        label: 'Playback',
        description: 'Uses the global playback multiplier without heading-depth or shared-budget weighting.',
      }),
      literal: Object.freeze({
        label: 'Literal time',
        description: 'Wall-clock visible/wait duration. Playback speed does not scale this value.',
      }),
      local: Object.freeze({
        label: 'Local multiplier',
        description: 'A local CODE/constructor multiplier layered on top of its owning runtime.',
      }),
    }),
    visibility: Object.freeze({
      primary: Object.freeze({
        label: 'Authored / active',
        description: 'Controls that were explicitly authored, selected by a meaningful preset, or currently own an active runtime behavior.',
      }),
      advanced: Object.freeze({
        label: 'Inherited defaults',
        description: 'Controls inherited from constructor defaults. They remain addressable but are hidden from the compact control view unless requested.',
      }),
    }),
    targetGrouping: Object.freeze({
      label: 'Target grouping',
      description: 'Controls that affect the same visible typed object or runtime are assigned the same targetGroup so hosts can keep them together or filter by target.',
    }),
  });

  const API_EVENTS = Object.freeze([
    'markdown-typewriter:ready',
    'markdown-typewriter:note-loaded',
    'markdown-typewriter:paused',
    'markdown-typewriter:resumed',
    'markdown-typewriter:section-start',
    'markdown-typewriter:section-heading-complete',
    'markdown-typewriter:section-complete',
    'markdown-typewriter:constructor-constructed',
    'markdown-typewriter:constructor-state',
    'markdown-typewriter:constructor-effect-cycle',
    'markdown-typewriter:typo-phase',
    'markdown-typewriter:rotation-cycle',
    'markdown-typewriter:codeblock-constructed',
    'markdown-typewriter:codeblock-cycle',
    'markdown-typewriter:codeblock-loop-cycle',
    'markdown-typewriter:codeblock-copy',
    'markdown-typewriter:styledlink-constructed',
    'markdown-typewriter:styledlink-reveal',
    'markdown-typewriter:styledlink-activate',
    'markdown-typewriter:strikeout-constructed',
    'markdown-typewriter:strikeout-draw',
    'markdown-typewriter:strong-constructed',
    'markdown-typewriter:strong-pulse',
    'markdown-typewriter:emphasis-constructed',
    'markdown-typewriter:listitem-constructed',
    'markdown-typewriter:listitem-vignette',
    'markdown-typewriter:note-complete',
  ]);

  const DEFAULT_PARAMETERS = {
    playback: {
      rate: 1,
      // document = one shared page-renderer pace budget distributed across
      // concurrently active heading sections. section = legacy behavior where
      // every active heading section receives the full global rate.
      rateScope: 'document',
      minRate: 0.25,
      maxRate: 64,
      baseCharacterMs: 50,
      burstThresholdMs: 12,
      frameBudgetMs: 8,
      maxBurstCharacters: 240,
    },

    runtime: {
      // 0 means unlimited. This is a resource budget only: runtimes still
      // decide for themselves when they are eligible to render or replay.
      maxConcurrentTypers: 0,
    },

    typing: {
      punctuationPauseMs: 180,
      typoHoldMs: 180,
      backspaceMultiplier: 0.7,
      nonNeutralTempoJitter: 0.08,
    },

    rotation: {
      // Legacy/global values remain as compatibility defaults. The authored
      // control surface now exposes effect-specific values so Slot/Delete/Strike
      // can be tuned without silently retiming the other rotation families.
      speedMs: 500,
      holdMs: 1000,
      blankHoldMs: 250,
      strikeHoldRatio: 0.4,
      effects: {
        // null means inherit the legacy/global default. Hosts may set any field
        // explicitly without severing compatibility for the remaining effects.
        slot: { speedMs: null, holdMs: null },
        delete: { holdMs: null, blankHoldMs: null },
        strike: { speedMs: null, holdMs: null, strikeHoldMs: null },
      },
    },

    renderer: {
      mode: 'single',

      // Progressive flow keeps parsed document structure separate from earned
      // layout geometry. Pending sections/blocks can collapse until the
      // scheduler or player reaches them, which prevents long blank islands in
      // serialized and partially-concurrent rendering.
      flow: {
        progressiveLayout: true,
        pendingSections: 'collapse',
        pendingBlocks: 'collapse',
        bridge: true,
        preserveScrollAnchor: true,
      },

      multi: {
        headingLevels: [1, 2, 3],
        headingVelocity: 'indentation',
        maxConcurrent: 0,
        staggerMs: 0,
        velocityPresets: HEADING_VELOCITY_PRESETS,
      },

      constructors: {
        codeblock: {
          enabled: true,
          defaultPreset: 'default',
          presets: {
            default: {},
            terminal: {
              codeCss: { fontFamily: 'var(--code-font)' },
            },
            compact: {
              css: { marginBlock: '0.55em' },
              headerCss: { minHeight: '2em' },
            },
          },

          // Code blocks intentionally use indentation velocity. Per-block
          // Markdown/API overrides can change the depth table without inheriting
          // heading depth, which keeps them independent from the outer renderer.
          velocity: 'indentation',
          tabSize: 4,
          indentUnit: 'auto',
          depthRate: [1, 1.2, 1.45, 1.7, 1.95, 2.2, 2.45, 2.7],

          // Block replay and named-loop replay are intentionally separate.
          // A zero block hold means the viewport renders once. Loop defaults
          // never inherit the block hold; every loop resolves its own config.
          holdMs: 0,
          render: 'sequence',
          loopDefaults: {
            enabled: true,
            holdMs: 1000,
            rate: 1,
          },
          loops: {},

          css: {},
          headerCss: {},
          codeCss: {
            fontFamily: 'var(--code-font)',
          },

          copyButton: {
            enabled: true,
            idPrefix: 'tw-copy',
            label: 'Copy',
            copiedLabel: 'Copied',
            feedbackMs: 1200,
            mode: 'source',
            css: {},
          },
        },

        styledlinks: {
          enabled: true,
          idPrefix: 'tw-link',
          defaultPreset: 'default',

          // Presets are serializable and can be replaced/extended through the
          // API. Markdown selects one with {preset=button}; local metadata is
          // then layered above the preset, and runtime API overrides come last.
          presets: {
            default: {},
            subtle: {
              hover: { scale: 1.03, translateYEm: -0.015 },
              reveal: { durationMs: 180, durationBeats: 3, minDurationMs: 120, maxDurationMs: 850 },
            },
            button: {
              css: {
                textDecorationLine: 'none',
                border: '1px solid currentColor',
                borderRadius: '0.32em',
                padding: '0.06em 0.34em',
              },
              hover: { scale: 1.04, translateYEm: -0.025 },
            },
            navigation: {
              css: {
                textDecorationLine: 'none',
                fontWeight: '600',
              },
              hover: { scale: 1.035, translateYEm: -0.02 },
            },
          },

          // Arbitrary base CSS can be passed by Backpack/API callers. Use
          // camelCase (backgroundColor) or normal CSS names (background-color).
          css: {
            color: 'var(--link)',
            display: 'inline-block',
            verticalAlign: 'baseline',
            transformOrigin: 'center baseline',
            textDecorationLine: 'underline',
            textUnderlineOffset: '0.12em',
            textDecorationThickness: '0.06em',
            borderRadius: '0.14em',
          },

          reveal: {
            enabled: true,
            durationMs: 220,
            durationBeats: 0,
            minDurationMs: 100,
            maxDurationMs: 900,
            velocity: 'inherit',
            velocityMultiplier: 1,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            fromOpacity: 0,
            fromTransform: 'translateY(0.14em) scale(0.98)',
            loop: { enabled: false, holdMs: 1800 },
          },

          hover: {
            enabled: true,
            durationMs: 150,
            easing: 'ease-out',
            scale: 1.06,
            translateYEm: -0.03,
            css: {},
          },

          glow: {
            enabled: false,
            trigger: 'hover',
            color: 'currentColor',
            blurPx: 10,
            spreadPx: 0,
            opacity: 0.62,
            durationMs: 320,
            easing: 'ease-out',
          },

          behavior: {
            // default | same-tab | new-tab | emit-only
            open: 'default',
            rel: 'noopener noreferrer',
            pointerEnabledWhileTyping: true,
          },
        },

        strikeout: {
          enabled: true,
          idPrefix: 'tw-strike',
          defaultPreset: 'default',

          presets: {
            default: {},
            muted: {
              css: { opacity: '0.72' },
            },
            emphatic: {
              line: { thickness: '0.11em' },
              animation: { durationBeats: 1 },
            },
          },

          css: {
            position: 'relative',
          },

          line: {
            color: 'currentColor',
            thickness: '0.075em',
            position: '52%',
          },

          animation: {
            enabled: true,
            // durationBeats resolves against the same character cadence used by
            // the active page player. durationMs remains the compatibility fallback.
            durationBeats: 1,
            durationMs: 280,
            minDurationMs: 24,
            maxDurationMs: 1000,
            holdMs: 0,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',

            // inherit  = global playback × active heading velocity
            // playback = global playback only
            // fixed    = literal durationMs regardless of renderer velocity
            velocity: 'inherit',
            velocityMultiplier: 1,
            loop: { enabled: false, holdMs: 1800 },
          },
        },


        strong: {
          enabled: true,
          idPrefix: 'tw-strong',
          defaultPreset: 'default',
          presets: {
            default: {},
            soft: { pulse: { enabled: true, scale: 1.035, durationBeats: 2, minDurationMs: 160, maxDurationMs: 650 } },
            pulse: { pulse: { enabled: true, scale: 1.09, durationBeats: 2.5, minDurationMs: 180, maxDurationMs: 700 } },
            emphatic: { pulse: { enabled: true, scale: 1.14, durationBeats: 3, minDurationMs: 200, maxDurationMs: 780, count: 2 } },
          },
          css: {
            display: 'inline-block',
            transformOrigin: 'center baseline',
          },
          pulse: {
            enabled: false,
            scale: 1.08,
            durationMs: 240,
            durationBeats: 0,
            minDurationMs: 180,
            maxDurationMs: 700,
            count: 1,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            velocity: 'inherit',
            velocityMultiplier: 1,
            loop: { enabled: false, holdMs: 1800 },
          },
        },

        emphasis: {
          enabled: true,
          idPrefix: 'tw-emphasis',
          defaultPreset: 'default',
          presets: {
            default: {},
            cursive: {
              css: { fontFamily: 'cursive' },
              typing: { behavior: 'cursive', rateMultiplier: 1, cursiveLetterRate: 2.15, cursiveWordPauseMs: 72 },
            },
            steady: {
              typing: { behavior: 'steady', rateMultiplier: 1 },
            },
          },
          css: {},
          typing: {
            behavior: 'inherit',
            rateMultiplier: 1,
            cursiveLetterRate: 2.15,
            cursiveWordPauseMs: 72,
          },
        },

        lists: {
          enabled: true,
          idPrefix: 'tw-list-item',
          defaultPreset: 'default',
          presets: {
            default: {},
            pulse: { vignette: { animation: 'pulse', durationBeats: 2, minDurationMs: 140, maxDurationMs: 800 } },
            rotate: { vignette: { animation: 'rotate', durationBeats: 3, minDurationMs: 180, maxDurationMs: 1000 } },
            lively: { vignette: { animation: 'pulse-rotate', durationBeats: 3.5, minDurationMs: 200, maxDurationMs: 1100, scale: 1.22, rotateDeg: 360 } },
          },
          itemCss: {},
          vignette: {
            animation: 'none',
            trigger: 'start',
            durationMs: 420,
            durationBeats: 0,
            minDurationMs: 140,
            maxDurationMs: 1000,
            count: 1,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            scale: 1.18,
            rotateDeg: 360,
            velocity: 'inherit',
            velocityMultiplier: 1,
            unorderedText: '•',
            orderedSuffix: '.',
            css: {},
            loop: { enabled: false, holdMs: 1800 },
          },
        },
      },
    },


    presentation: {
      theme: 'paper',
      textSize: 22,
    },
  };

  /* ========================================================================
   *  Small utilities
   * ====================================================================== */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isPlainObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

  function deepMerge(base, patch) {
    const out = clone(base);

    function mergeInto(target, source) {
      if (!isPlainObject(source)) return target;
      for (const [key, value] of Object.entries(source)) {
        if (isPlainObject(value) && isPlainObject(target[key])) {
          mergeInto(target[key], value);
        } else {
          target[key] = clone(value);
        }
      }
      return target;
    }

    return mergeInto(out, patch || {});
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function hashString(input) {
    // FNV-1a 32-bit: intentionally fast and synchronous. This is used only for
    // state identity/invalidation, not for security.
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i += 1) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function formatRate(rate) {
    const rounded = rate >= 10 ? rate.toFixed(0) : rate.toFixed(rate < 1 ? 2 : 1);
    return `${rounded.replace(/\.0$/, '')}×`;
  }

  function sanitizeDomId(value, fallback = 'item') {
    const clean = String(value ?? '')
      .trim()
      .replace(/[^A-Za-z0-9_:.-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return clean || fallback;
  }

  function cssPropertyName(name) {
    const raw = String(name ?? '').trim();
    if (!raw) return '';
    if (raw.startsWith('--') || raw.includes('-')) return raw;
    return raw.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  }

  function normalizeCssMap(input) {
    if (!isPlainObject(input)) return {};
    const out = {};
    for (const [key, value] of Object.entries(input)) {
      const property = cssPropertyName(key);
      if (!property || value === null || value === undefined || value === false) continue;
      out[property] = String(value);
    }
    return out;
  }

  function applyCssMap(element, map, previousKeys = null) {
    const normalized = normalizeCssMap(map);
    if (previousKeys) {
      for (const property of previousKeys) {
        if (!(property in normalized)) element.style.removeProperty(property);
      }
    }
    for (const [property, value] of Object.entries(normalized)) {
      element.style.setProperty(property, value);
    }
    return new Set(Object.keys(normalized));
  }

  function parseFenceInfo(infoString) {
    const raw = String(infoString ?? '').trim();
    if (!raw) return { language: '', attributes: {} };

    const tokenRe = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g;
    const tokens = raw.match(tokenRe) || [];
    let language = '';
    let start = 0;

    if (tokens[0] && !tokens[0].includes('=')) {
      language = tokens[0].replace(/^["']|["']$/g, '');
      start = 1;
    }

    const attributes = {};
    for (const token of tokens.slice(start)) {
      const match = /^([A-Za-z][\w-]*)=(.*)$/.exec(token);
      if (!match) continue;
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      attributes[match[1].toLowerCase()] = value;
    }

    return { language, attributes };
  }


  function parseInlineMetadataPrefix(text) {
    const source = String(text ?? '');
    if (!source.startsWith('{')) return null;

    let quote = null;
    let escaped = false;
    let end = -1;
    for (let index = 1; index < source.length; index += 1) {
      const character = source[index];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === '\\') {
        escaped = true;
        continue;
      }
      if (quote) {
        if (character === quote) quote = null;
        continue;
      }
      if (character === '"' || character === "'") {
        quote = character;
        continue;
      }
      if (character === '}') {
        end = index;
        break;
      }
    }

    if (end < 0) return null;
    const body = source.slice(1, end).trim();
    if (!body) return null;

    const tokenRe = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g;
    const tokens = body.match(tokenRe) || [];
    const metadata = {
      raw: source.slice(0, end + 1),
      id: null,
      classes: [],
      attributes: {},
    };

    let recognized = false;
    for (const token of tokens) {
      if (token.startsWith('#') && token.length > 1) {
        metadata.id = token.slice(1);
        recognized = true;
        continue;
      }
      if (token.startsWith('.') && token.length > 1) {
        metadata.classes.push(token.slice(1));
        recognized = true;
        continue;
      }

      const match = /^([A-Za-z][\w:.-]*)(?:=(.*))?$/.exec(token);
      if (!match) continue;
      if (match[2] === undefined) {
        // Bare metadata tokens are convenient boolean flags: {pulse} is the
        // same as {pulse=true}. Constructors decide whether the flag is useful.
        metadata.attributes[match[1].toLowerCase()] = 'true';
        recognized = true;
        continue;
      }

      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      metadata.attributes[match[1].toLowerCase()] = value;
      recognized = true;
    }

    if (!metadata.id && metadata.attributes.id) {
      metadata.id = metadata.attributes.id;
      delete metadata.attributes.id;
    }
    if (metadata.attributes.class) {
      metadata.classes.push(...String(metadata.attributes.class).split(/\s+/).filter(Boolean));
      delete metadata.attributes.class;
    }

    if (!recognized) return null;
    return { metadata, length: end + 1 };
  }

  function metadataBoolean(value, fallback = true) {
    if (value === undefined || value === null || value === '') return fallback;
    const normalized = String(value).trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
    return fallback;
  }

  function metadataNumber(value, fallback = null) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  function parseDurationMs(value, fallback = 0) {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, value);
    const raw = String(value ?? '').trim().toLowerCase();
    const match = /^(\d+(?:\.\d+)?)(ms|s|m)?$/.exec(raw);
    if (!match) return fallback;
    const amount = Number(match[1]);
    const unit = match[2] || 'ms';
    const multiplier = unit === 'm' ? 60_000 : unit === 's' ? 1000 : 1;
    return Math.max(0, amount * multiplier);
  }

  function metadataEffectLoop(attributes, keyPrefix, fallbackHoldMs = 1800) {
    const loop = {};
    const enabledKey = `${keyPrefix}-loop`;
    const holdKey = `${keyPrefix}-loop-hold`;
    if (enabledKey in attributes) {
      const value = attributes[enabledKey];
      const normalized = String(value).trim().toLowerCase();
      if (['true', 'false', '1', '0', 'yes', 'no', 'on', 'off'].includes(normalized)) {
        loop.enabled = metadataBoolean(value);
      } else {
        loop.enabled = true;
        loop.holdMs = parseDurationMs(value, fallbackHoldMs);
      }
    }
    if (holdKey in attributes) {
      loop.enabled = loop.enabled !== false;
      loop.holdMs = parseDurationMs(attributes[holdKey], fallbackHoldMs);
    }
    return loop;
  }

  function parseParameterList(source) {
    const parameters = {};
    String(source ?? '')
      .split(',')
      .map(token => token.trim())
      .filter(Boolean)
      .forEach(token => {
        const match = /^([A-Za-z][\w-]*)\s*[:=]\s*(.+)$/.exec(token);
        if (!match) return;
        parameters[match[1].toLowerCase()] = match[2].trim();
      });
    return parameters;
  }

  function codeRuntimeConfigFromParameters(parameters = {}) {
    const override = {};
    if ('hold' in parameters) override.holdMs = parseDurationMs(parameters.hold, 0);
    if ('render' in parameters) {
      const render = String(parameters.render).trim().toLowerCase();
      override.render = render === 'indentation' ? 'indentation' : 'sequence';
    }
    return override;
  }

  function loopRuntimeConfigFromParameters(parameters = {}) {
    const override = {};
    if ('hold' in parameters) override.holdMs = parseDurationMs(parameters.hold, 1000);
    if ('rate' in parameters) override.rate = Math.max(0.01, Number(parameters.rate) || 1);
    if ('enabled' in parameters) override.enabled = metadataBoolean(parameters.enabled, true);
    return override;
  }

  function preprocessCodeViewportSyntax(markdown) {
    const lines = String(markdown ?? '').split('\n');
    const output = [];
    let markdownFence = null;

    const fenceMatch = line => /^ {0,3}(`{3,}|~{3,})/.exec(line);
    const codeOpen = line => /^\s*<!--\s*CODE(?:\s*:\s*([A-Za-z0-9+#._-]+))?\s*-->\s*$/i.exec(line);
    const explicitCodeClose = line => /^\s*<!--\s*\/\s*CODE\s*-->\s*$/i.test(line);
    const legacyBareCode = line => /^\s*<!--\s*CODE\s*-->\s*$/i.test(line);

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const fence = fenceMatch(line);
      if (fence) {
        const marker = fence[1][0];
        const length = fence[1].length;
        if (!markdownFence) markdownFence = { marker, length };
        else if (markdownFence.marker === marker && length >= markdownFence.length) markdownFence = null;
        output.push(line);
        continue;
      }

      const opening = !markdownFence ? codeOpen(line) : null;
      if (!opening) {
        output.push(line);
        continue;
      }

      const language = opening[1] || '';
      const body = [];
      let closeIndex = -1;
      let depth = 1;

      for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
        const candidate = lines[cursor];
        const nestedOpen = codeOpen(candidate);

        // Explicit closers make recursive CODE unambiguous. A typed CODE opener
        // always creates a child scope. Bare CODE remains the legacy top-level
        // closer, so canonical nested untyped blocks should use CODE:TEXT/PLAIN.
        if (explicitCodeClose(candidate)) {
          depth -= 1;
          if (depth === 0) {
            closeIndex = cursor;
            break;
          }
          body.push(candidate);
          continue;
        }

        if (nestedOpen?.[1]) {
          depth += 1;
          body.push(candidate);
          continue;
        }

        if (legacyBareCode(candidate) && depth === 1) {
          closeIndex = cursor;
          break;
        }

        body.push(candidate);
      }

      // An unmatched opener is left untouched so source mistakes remain visible
      // instead of swallowing the remainder of the document.
      if (closeIndex < 0) {
        output.push(line);
        continue;
      }

      const longestTildeRun = body.reduce((max, row) => {
        const matches = row.match(/~+/g) || [];
        return Math.max(max, ...matches.map(run => run.length), 0);
      }, 0);
      const fenceLength = Math.max(3, longestTildeRun + 1);
      const generatedFence = '~'.repeat(fenceLength);
      const info = `${language ? `${language} ` : ''}tw-code=true tw-code-source=comment`;
      output.push(`${generatedFence}${info}`);
      output.push(...body);
      output.push(generatedFence);
      index = closeIndex;
    }

    return output.join('\n');
  }

  function metadataCssMap(attributes, prefix) {
    const out = {};
    const normalizedPrefix = `${prefix.toLowerCase()}-`;
    for (const [key, value] of Object.entries(attributes || {})) {
      if (!key.startsWith(normalizedPrefix)) continue;
      const property = key.slice(normalizedPrefix.length);
      if (property) out[property] = value;
    }
    return normalizeCssMap(out);
  }

  function applyInlineMetadataToElement(element, metadata) {
    if (!element || !metadata) return;
    inlineConstructorMetadata.set(element, metadata);
    metadata.classes.forEach(className => {
      const clean = String(className || '').trim();
      if (clean) element.classList.add(clean);
    });
  }

  function parseInlineMetadataSuffix(text) {
    const source = String(text ?? '');
    const trimmedEnd = source.replace(/\s+$/, '');
    const start = trimmedEnd.lastIndexOf('{');
    if (start < 0) return null;
    const parsed = parseInlineMetadataPrefix(trimmedEnd.slice(start));
    if (!parsed || parsed.length !== trimmedEnd.length - start) return null;
    return {
      metadata: parsed.metadata,
      start,
      end: source.length,
      leading: source.slice(0, start),
      trailingWhitespace: source.slice(trimmedEnd.length),
    };
  }

  function listItemOwnTextNodes(item) {
    const nodes = [];
    const walk = node => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.ELEMENT_NODE && /^(UL|OL)$/.test(child.tagName)) continue;
        if (child.nodeType === Node.TEXT_NODE) nodes.push(child);
        else if (child.nodeType === Node.ELEMENT_NODE && !child.matches('pre, code')) walk(child);
      }
    };
    walk(item);
    return nodes;
  }

  function extractInlineConstructorMetadata(root) {
    // Inline Markdown constructors use a Pandoc-like attribute block immediately
    // after the rendered element: **bold**{...}, *italic*{...}, [link](...){...}.
    const supported = [...root.querySelectorAll('a[href], del, strong, em')];
    supported.forEach(element => {
      const sibling = element.nextSibling;
      if (!sibling || sibling.nodeType !== Node.TEXT_NODE) return;
      const parsed = parseInlineMetadataPrefix(sibling.data);
      if (!parsed) return;

      applyInlineMetadataToElement(element, parsed.metadata);
      sibling.data = sibling.data.slice(parsed.length);
      if (!sibling.data) sibling.remove();
    });

    // List item metadata lives at the end of the item's own text because Markdown
    // does not naturally emit it as a sibling of <li>. Nested lists are excluded.
    [...root.querySelectorAll('li')].forEach(item => {
      const textNodes = listItemOwnTextNodes(item);
      const tail = [...textNodes].reverse().find(node => node.data.trim().length);
      if (!tail) return;
      const parsed = parseInlineMetadataSuffix(tail.data);
      if (!parsed) return;

      applyInlineMetadataToElement(item, parsed.metadata);
      tail.data = `${parsed.leading}${parsed.trailingWhitespace}`;
      if (!tail.data) tail.remove();
    });
  }

  function parseCodeBlockProgram(renderSource) {
    const rawLines = String(renderSource ?? '').replace(/\n$/, '').split('\n');
    const displayLines = [];
    const diagnostics = [];
    const blockParameters = {};
    let configConsumed = false;
    let codeSequence = 0;

    // Each Code Block owns one local program tree. Nested CODE nodes hold a
    // separate child program rather than leaking child loops into the parent.
    const root = {
      type: 'root',
      name: 'root',
      path: '',
      depth: -1,
      startLine: 0,
      endLine: -1,
      children: [],
    };
    const stack = [root];
    const codeBlocks = [];

    const canonicalOpenLoopRe = /^\s*<!--\s*LOOP\s*:\s*([A-Za-z0-9_.-]+)(?:\s+|\s*,\s*)?(.*?)\s*-->\s*$/i;
    const legacyOpenLoopRe = /^\s*<!--\s*(Loop[A-Za-z0-9_.-]*)(?:\s*:\s*(.*?))?\s*-->\s*$/i;
    const canonicalCloseLoopRe = /^\s*<!--\s*\/\s*LOOP(?:\s*:\s*([A-Za-z0-9_.-]+))?\s*-->\s*$/i;
    const legacyCloseLoopRe = /^\s*<!--\s*\/\s*(Loop[A-Za-z0-9_.-]*)\s*-->\s*$/i;
    const legacyMalformedCloseLoopRe = /^\s*<!\/--\s*(Loop[A-Za-z0-9_.-]*)\s*-->\s*$/i;
    const nestedCodeOpenRe = /^\s*<!--\s*CODE\s*:\s*([A-Za-z0-9+#._-]+)\s*-->\s*$/i;
    const explicitCodeCloseRe = /^\s*<!--\s*\/\s*CODE\s*-->\s*$/i;

    const closeLoop = (requestedName, rawIndex) => {
      const open = stack[stack.length - 1];
      if (!open || open.type !== 'loop') {
        diagnostics.push({
          type: 'orphan-loop-close',
          name: requestedName || null,
          rawIndex,
          message: `Loop close ${requestedName || '(unnamed)'} has no matching open loop.`,
        });
        return;
      }
      if (requestedName && open.name.toLowerCase() !== requestedName.toLowerCase()) {
        diagnostics.push({
          type: 'crossed-loop-close',
          name: requestedName,
          expected: open.name,
          rawIndex,
          message: `Loop ${requestedName} cannot close while ${open.name} is the active scope.`,
        });
        return;
      }
      stack.pop();
      open.endLine = displayLines.length - 1;
      open.rawEndIndex = rawIndex;
    };

    const findNestedCodeClose = startIndex => {
      let depth = 1;
      for (let cursor = startIndex + 1; cursor < rawLines.length; cursor += 1) {
        if (nestedCodeOpenRe.test(rawLines[cursor])) {
          depth += 1;
          continue;
        }
        if (explicitCodeCloseRe.test(rawLines[cursor])) {
          depth -= 1;
          if (depth === 0) return cursor;
        }
      }
      return -1;
    };

    let rawIndex = 0;
    while (rawIndex < rawLines.length) {
      const line = rawLines[rawIndex];

      if (!configConsumed) {
        const configMatch = /^\s*<CODEBLOCK>\s*(.*?)\s*$/i.exec(line);
        if (configMatch) {
          Object.assign(blockParameters, parseParameterList(configMatch[1]));
          configConsumed = true;
          rawIndex += 1;
          continue;
        }
        if (line.trim()) configConsumed = true;
      }

      const canonicalClose = canonicalCloseLoopRe.exec(line);
      const legacyClose = legacyCloseLoopRe.exec(line) || legacyMalformedCloseLoopRe.exec(line);
      if (canonicalClose || legacyClose) {
        closeLoop((canonicalClose || legacyClose)[1] || null, rawIndex);
        rawIndex += 1;
        continue;
      }

      const canonicalOpen = canonicalOpenLoopRe.exec(line);
      const legacyOpen = !canonicalOpen ? legacyOpenLoopRe.exec(line) : null;
      if (canonicalOpen || legacyOpen) {
        const match = canonicalOpen || legacyOpen;
        const name = match[1];
        const parameters = parseParameterList(match[2] || '');
        const parent = stack[stack.length - 1];
        const path = parent.type === 'loop' ? `${parent.path}/${name}` : name;
        const node = {
          type: 'loop',
          name,
          path,
          parentPath: parent.type === 'loop' ? parent.path : null,
          depth: stack.length - 1,
          parameters,
          markdownOverride: loopRuntimeConfigFromParameters(parameters),
          startLine: displayLines.length,
          endLine: displayLines.length - 1,
          rawStartIndex: rawIndex,
          rawEndIndex: null,
          children: [],
        };
        parent.children.push(node);
        stack.push(node);
        rawIndex += 1;
        continue;
      }

      const nestedCodeOpen = nestedCodeOpenRe.exec(line);
      if (nestedCodeOpen) {
        const closeIndex = findNestedCodeClose(rawIndex);
        if (closeIndex < 0) {
          diagnostics.push({
            type: 'unclosed-code',
            language: nestedCodeOpen[1],
            rawIndex,
            message: `Nested CODE:${nestedCodeOpen[1]} is not explicitly closed with <!--/CODE-->.`,
          });
          // Keep malformed control text visible rather than swallowing the rest.
          const lineIndex = displayLines.length;
          displayLines.push(line);
          stack[stack.length - 1].children.push({ type: 'line', lineIndex, rawIndex, source: line });
          rawIndex += 1;
          continue;
        }

        const childRawLines = rawLines.slice(rawIndex + 1, closeIndex);
        const childProgram = parseCodeBlockProgram(childRawLines.join('\n'));
        const parent = stack[stack.length - 1];
        const slotLineIndex = displayLines.length;
        displayLines.push('');
        codeSequence += 1;
        const declaredName = String(childProgram.blockParameters.id || nestedCodeOpen[1] || `code-${codeSequence}`);
        const safeName = declaredName.replace(/[^A-Za-z0-9_.-]+/g, '-') || `code-${codeSequence}`;
        const parentPath = parent.type === 'loop' ? parent.path : '';
        const path = parentPath ? `${parentPath}/@${safeName}-${codeSequence}` : `@${safeName}-${codeSequence}`;
        const node = {
          type: 'code',
          name: declaredName,
          path,
          parentPath: parentPath || null,
          depth: stack.length - 1,
          language: nestedCodeOpen[1],
          slotLineIndex,
          startLine: slotLineIndex,
          endLine: slotLineIndex,
          rawStartIndex: rawIndex,
          rawEndIndex: closeIndex,
          rawSource: childRawLines.join('\n'),
          program: childProgram,
          descriptor: null,
          children: [],
        };
        parent.children.push(node);
        codeBlocks.push(node);
        rawIndex = closeIndex + 1;
        continue;
      }

      if (explicitCodeCloseRe.test(line)) {
        diagnostics.push({
          type: 'orphan-code-close',
          rawIndex,
          message: 'CODE close has no matching nested CODE opener in this viewport.',
        });
        rawIndex += 1;
        continue;
      }

      const lineIndex = displayLines.length;
      displayLines.push(line);
      stack[stack.length - 1].children.push({
        type: 'line',
        lineIndex,
        rawIndex,
        source: line,
      });
      rawIndex += 1;
    }

    while (stack.length > 1) {
      const open = stack.pop();
      open.endLine = displayLines.length - 1;
      open.rawEndIndex = rawLines.length - 1;
      open.unclosed = true;
      diagnostics.push({
        type: 'unclosed-loop',
        name: open.name,
        path: open.path,
        rawIndex: open.rawStartIndex,
        message: `Loop ${open.path} is not explicitly closed.`,
      });
    }
    root.endLine = displayLines.length - 1;

    const loops = [];
    const visitLocal = node => {
      if (node.type === 'loop') loops.push(node);
      if (node.type === 'code') return;
      (node.children || []).forEach(visitLocal);
    };
    root.children.forEach(visitLocal);

    // Names only need to be unique among siblings inside this viewport. Nested
    // CODE children own their own loop namespaces and are checked recursively by
    // their own parser invocation.
    const checkSiblingNames = node => {
      const seen = new Map();
      (node.children || []).filter(child => child.type === 'loop').forEach(child => {
        const key = child.name.toLowerCase();
        if (seen.has(key)) {
          const first = seen.get(key);
          first.duplicateSiblingName = true;
          child.duplicateSiblingName = true;
          diagnostics.push({
            type: 'duplicate-loop-name',
            name: child.name,
            path: child.path,
            message: `Loop name ${child.name} is duplicated in scope ${node.path || 'root'}.`,
          });
        } else {
          seen.set(key, child);
        }
      });
      (node.children || []).filter(child => child.type === 'loop').forEach(checkSiblingNames);
    };
    checkSiblingNames(root);

    const sections = [];
    let current = null;
    displayLines.forEach((line, lineIndex) => {
      const heading = /^\s*(#{1,6})(?:\s+|$)/.exec(line);
      if (heading) {
        current = { depth: heading[1].length, startLine: lineIndex, endLine: lineIndex };
        sections.push(current);
      } else if (!current) {
        current = { depth: 1, startLine: lineIndex, endLine: lineIndex, implicit: true };
        sections.push(current);
      } else {
        current.endLine = lineIndex;
      }
    });

    const visibleLinesForNode = node => {
      if (node.type === 'line') return [node.source];
      if (node.type === 'code') return node.program?.visibleLines?.slice() || [];
      return (node.children || []).flatMap(visibleLinesForNode);
    };
    const visibleLines = root.children.flatMap(visibleLinesForNode);
    const source = visibleLines.join('\n');

    return {
      source,
      visibleLines,
      displayLines,
      sections,
      tree: root,
      loops,
      codeBlocks,
      diagnostics,
      blockParameters,
      blockOverride: codeRuntimeConfigFromParameters(blockParameters),
    };
  }

  function serializeCodeProgramNode(node) {
    if (!node) return null;
    if (node.type === 'line') {
      return { type: 'line', lineIndex: node.lineIndex, source: node.source };
    }
    if (node.type === 'code') {
      return {
        type: 'code',
        name: node.name,
        path: node.path || '',
        parentPath: node.parentPath || null,
        depth: node.depth,
        language: node.language || '',
        slotLineIndex: node.slotLineIndex,
        descriptorId: node.descriptor?.id || null,
        diagnostics: clone(node.program?.diagnostics || []),
        children: (node.program?.tree?.children || []).map(serializeCodeProgramNode),
      };
    }
    return {
      type: node.type,
      name: node.name,
      path: node.path || '',
      parentPath: node.parentPath || null,
      depth: node.depth,
      startLine: node.startLine,
      endLine: node.endLine,
      parameters: node.type === 'loop' ? clone(node.parameters || {}) : undefined,
      children: (node.children || []).map(serializeCodeProgramNode),
    };
  }

  function effectiveCodeBlockLoopConfig(app, descriptor, loop) {
    const blockConfig = effectiveCodeBlockConfig(app, descriptor);
    const defaults = isPlainObject(blockConfig.loopDefaults) ? blockConfig.loopDefaults : {};
    const byName = isPlainObject(blockConfig.loops?.[loop.name]) ? blockConfig.loops[loop.name] : {};
    const byPath = isPlainObject(blockConfig.loops?.[loop.path]) ? blockConfig.loops[loop.path] : {};
    const named = deepMerge(byName, byPath);
    return deepMerge(
      deepMerge(defaults, named),
      deepMerge(loop.markdownOverride || {}, loop.override || {}),
    );
  }

  function codeBlockMarkdownConfig(attributes = {}, program = null) {
    const override = {};

    const css = metadataCssMap(attributes, 'css');
    if (Object.keys(css).length) override.css = css;

    const headerCss = metadataCssMap(attributes, 'header-css');
    if (Object.keys(headerCss).length) override.headerCss = headerCss;

    const codeCss = metadataCssMap(attributes, 'code-css');
    if ('font' in attributes) codeCss.fontFamily = attributes.font;
    if (Object.keys(codeCss).length) override.codeCss = codeCss;

    if ('tab-size' in attributes) override.tabSize = metadataNumber(attributes['tab-size'], 4);
    if ('indent-unit' in attributes) {
      const value = String(attributes['indent-unit']).trim().toLowerCase();
      override.indentUnit = value === 'auto' ? 'auto' : metadataNumber(value, 4);
    }

    const copyButton = {};
    if ('copy-label' in attributes) copyButton.label = attributes['copy-label'];
    if ('copy-enabled' in attributes) copyButton.enabled = metadataBoolean(attributes['copy-enabled']);
    if ('copy-mode' in attributes) copyButton.mode = attributes['copy-mode'];
    const copyCss = metadataCssMap(attributes, 'copy-css');
    if (Object.keys(copyCss).length) copyButton.css = copyCss;
    if (Object.keys(copyButton).length) override.copyButton = copyButton;

    if ('hold' in attributes) override.holdMs = parseDurationMs(attributes.hold, 0);
    if ('render' in attributes) {
      const render = String(attributes.render).trim().toLowerCase();
      override.render = render === 'indentation' ? 'indentation' : 'sequence';
    }

    return {
      preset: attributes.preset || null,
      override: deepMerge(override, program?.blockOverride || {}),
    };
  }

  function styledLinkMarkdownConfig(metadata) {
    const attributes = metadata?.attributes || {};
    const override = {};

    const css = metadataCssMap(attributes, 'css');
    if (Object.keys(css).length) override.css = css;

    const hoverCss = metadataCssMap(attributes, 'hover-css');
    const hover = {};
    if (Object.keys(hoverCss).length) hover.css = hoverCss;
    if ('hover-enabled' in attributes) hover.enabled = metadataBoolean(attributes['hover-enabled']);
    if ('hover-scale' in attributes) hover.scale = metadataNumber(attributes['hover-scale'], 1);
    if ('hover-translate-y' in attributes) hover.translateYEm = metadataNumber(attributes['hover-translate-y'], 0);
    if ('hover-duration' in attributes) hover.durationMs = metadataNumber(attributes['hover-duration'], 150);
    if ('hover-easing' in attributes) hover.easing = attributes['hover-easing'];
    if (Object.keys(hover).length) override.hover = hover;

    const reveal = {};
    if ('reveal-enabled' in attributes) reveal.enabled = metadataBoolean(attributes['reveal-enabled']);
    if ('reveal-duration' in attributes) reveal.durationMs = metadataNumber(attributes['reveal-duration'], 220);
    if ('reveal-beats' in attributes) reveal.durationBeats = metadataNumber(attributes['reveal-beats'], 0);
    if ('reveal-min-duration' in attributes) reveal.minDurationMs = metadataNumber(attributes['reveal-min-duration'], 100);
    if ('reveal-max-duration' in attributes) reveal.maxDurationMs = metadataNumber(attributes['reveal-max-duration'], 900);
    if ('reveal-velocity' in attributes) reveal.velocity = attributes['reveal-velocity'];
    if ('reveal-velocity-multiplier' in attributes) reveal.velocityMultiplier = metadataNumber(attributes['reveal-velocity-multiplier'], 1);
    if ('reveal-easing' in attributes) reveal.easing = attributes['reveal-easing'];
    if ('reveal-from-opacity' in attributes) reveal.fromOpacity = metadataNumber(attributes['reveal-from-opacity'], 0);
    if ('reveal-from-transform' in attributes) reveal.fromTransform = attributes['reveal-from-transform'];
    const revealLoop = metadataEffectLoop(attributes, 'reveal');
    if (Object.keys(revealLoop).length) reveal.loop = revealLoop;
    if (Object.keys(reveal).length) override.reveal = reveal;

    const glow = {};
    if ('glow-enabled' in attributes) glow.enabled = metadataBoolean(attributes['glow-enabled']);
    if ('glow-trigger' in attributes) glow.trigger = attributes['glow-trigger'];
    if ('glow-color' in attributes) glow.color = attributes['glow-color'];
    if ('glow-blur' in attributes) glow.blurPx = metadataNumber(attributes['glow-blur'], 10);
    if ('glow-spread' in attributes) glow.spreadPx = metadataNumber(attributes['glow-spread'], 0);
    if ('glow-opacity' in attributes) glow.opacity = metadataNumber(attributes['glow-opacity'], 0.62);
    if ('glow-duration' in attributes) glow.durationMs = metadataNumber(attributes['glow-duration'], 320);
    if ('glow-easing' in attributes) glow.easing = attributes['glow-easing'];
    if (Object.keys(glow).length) override.glow = glow;

    const behavior = {};
    if ('open' in attributes) behavior.open = attributes.open;
    if ('rel' in attributes) behavior.rel = attributes.rel;
    if ('pointer-while-typing' in attributes) {
      behavior.pointerEnabledWhileTyping = metadataBoolean(attributes['pointer-while-typing']);
    }
    if (Object.keys(behavior).length) override.behavior = behavior;

    return {
      preset: attributes.preset || null,
      override,
    };
  }

  function strikeoutMarkdownConfig(metadata) {
    const attributes = metadata?.attributes || {};
    const override = {};

    const css = metadataCssMap(attributes, 'css');
    if (Object.keys(css).length) override.css = css;

    const line = {};
    if ('line-color' in attributes) line.color = attributes['line-color'];
    if ('line-thickness' in attributes) line.thickness = attributes['line-thickness'];
    if ('line-position' in attributes) line.position = attributes['line-position'];
    if (Object.keys(line).length) override.line = line;

    const animation = {};
    if ('animation-enabled' in attributes) animation.enabled = metadataBoolean(attributes['animation-enabled']);
    if ('duration' in attributes) animation.durationMs = metadataNumber(attributes.duration, 280);
    if ('duration-beats' in attributes) animation.durationBeats = metadataNumber(attributes['duration-beats'], 1);
    if ('max-duration' in attributes) animation.maxDurationMs = metadataNumber(attributes['max-duration'], 0);
    if ('hold' in attributes) animation.holdMs = metadataNumber(attributes.hold, 0);
    if ('easing' in attributes) animation.easing = attributes.easing;
    if ('velocity' in attributes) animation.velocity = attributes.velocity;
    if ('velocity-multiplier' in attributes) {
      animation.velocityMultiplier = metadataNumber(attributes['velocity-multiplier'], 1);
    }
    if ('min-duration' in attributes) animation.minDurationMs = metadataNumber(attributes['min-duration'], 36);
    const animationLoop = metadataEffectLoop(attributes, 'animation');
    if (Object.keys(animationLoop).length) animation.loop = animationLoop;
    if (Object.keys(animation).length) override.animation = animation;

    return {
      preset: attributes.preset || null,
      override,
    };
  }

  function strongMarkdownConfig(metadata) {
    const attributes = metadata?.attributes || {};
    const override = {};
    const css = metadataCssMap(attributes, 'css');
    if (Object.keys(css).length) override.css = css;

    const pulse = {};
    if ('pulse' in attributes) pulse.enabled = metadataBoolean(attributes.pulse);
    if ('pulse-scale' in attributes) pulse.scale = metadataNumber(attributes['pulse-scale'], 1.08);
    if ('pulse-duration' in attributes) pulse.durationMs = metadataNumber(attributes['pulse-duration'], 240);
    if ('pulse-beats' in attributes) pulse.durationBeats = metadataNumber(attributes['pulse-beats'], 0);
    if ('pulse-min-duration' in attributes) pulse.minDurationMs = metadataNumber(attributes['pulse-min-duration'], 0);
    if ('pulse-max-duration' in attributes) pulse.maxDurationMs = metadataNumber(attributes['pulse-max-duration'], 0);
    if ('pulse-count' in attributes) pulse.count = metadataNumber(attributes['pulse-count'], 1);
    if ('pulse-easing' in attributes) pulse.easing = attributes['pulse-easing'];
    if ('pulse-velocity' in attributes) pulse.velocity = attributes['pulse-velocity'];
    if ('pulse-velocity-multiplier' in attributes) pulse.velocityMultiplier = metadataNumber(attributes['pulse-velocity-multiplier'], 1);
    const pulseLoop = metadataEffectLoop(attributes, 'pulse');
    if (Object.keys(pulseLoop).length) pulse.loop = pulseLoop;
    if (Object.keys(pulse).length) override.pulse = pulse;

    return { preset: attributes.preset || null, override };
  }

  function emphasisMarkdownConfig(metadata) {
    const attributes = metadata?.attributes || {};
    const override = {};
    const css = metadataCssMap(attributes, 'css');
    if (Object.keys(css).length) override.css = css;

    const typing = {};
    if ('typing' in attributes) typing.behavior = attributes.typing;
    if ('typing-rate' in attributes) typing.rateMultiplier = metadataNumber(attributes['typing-rate'], 1);
    if ('cursive-letter-rate' in attributes) typing.cursiveLetterRate = metadataNumber(attributes['cursive-letter-rate'], 2.15);
    if ('cursive-word-pause' in attributes) typing.cursiveWordPauseMs = metadataNumber(attributes['cursive-word-pause'], 72);
    if (Object.keys(typing).length) override.typing = typing;

    return { preset: attributes.preset || null, override };
  }

  function listMarkdownConfig(metadata) {
    const attributes = metadata?.attributes || {};
    const override = {};
    const itemCss = metadataCssMap(attributes, 'css');
    if (Object.keys(itemCss).length) override.itemCss = itemCss;

    const vignetteCss = metadataCssMap(attributes, 'vignette-css');
    const vignette = {};
    if (Object.keys(vignetteCss).length) vignette.css = vignetteCss;
    if ('vignette' in attributes) vignette.animation = attributes.vignette;
    if ('vignette-trigger' in attributes) vignette.trigger = attributes['vignette-trigger'];
    if ('vignette-duration' in attributes) vignette.durationMs = metadataNumber(attributes['vignette-duration'], 420);
    if ('vignette-beats' in attributes) vignette.durationBeats = metadataNumber(attributes['vignette-beats'], 0);
    if ('vignette-min-duration' in attributes) vignette.minDurationMs = metadataNumber(attributes['vignette-min-duration'], 0);
    if ('vignette-max-duration' in attributes) vignette.maxDurationMs = metadataNumber(attributes['vignette-max-duration'], 0);
    if ('vignette-count' in attributes) vignette.count = metadataNumber(attributes['vignette-count'], 1);
    if ('vignette-scale' in attributes) vignette.scale = metadataNumber(attributes['vignette-scale'], 1.18);
    if ('vignette-rotate' in attributes) vignette.rotateDeg = metadataNumber(attributes['vignette-rotate'], 360);
    if ('vignette-velocity' in attributes) vignette.velocity = attributes['vignette-velocity'];
    if ('vignette-velocity-multiplier' in attributes) vignette.velocityMultiplier = metadataNumber(attributes['vignette-velocity-multiplier'], 1);
    if ('vignette-text' in attributes) vignette.text = attributes['vignette-text'];
    const vignetteLoop = metadataEffectLoop(attributes, 'vignette');
    if (Object.keys(vignetteLoop).length) vignette.loop = vignetteLoop;
    if (Object.keys(vignette).length) override.vignette = vignette;

    return { preset: attributes.preset || null, override };
  }

  function effectiveConstructorConfig(base, presetName, markdownOverride, runtimeOverride) {
    const preset = base?.presets?.[presetName] || {};
    return deepMerge(deepMerge(deepMerge(base || {}, preset), markdownOverride || {}), runtimeOverride || {});
  }

  function captureTimingContext(app, player, operation) {
    const playbackRate = Math.max(0.01, Number(app.parameters.playback.rate) || 1);
    const inheritedRate = Math.max(0.01, Number(
      player?.timingContext?.effectiveRate
      ?? player?.effectivePlaybackRate?.(operation)
      ?? playbackRate,
    ) || playbackRate);
    const schedulerState = app.scheduler?.getState?.() || null;
    const baseCharacterMs = Math.max(0, Number(
      player?.timingContext?.baseCharacterMs
      ?? app.parameters.playback.baseCharacterMs,
    ) || 0);
    return {
      playbackRate,
      paceScope: player?.timingContext?.paceScope
        || schedulerState?.rateScope
        || (app.parameters.playback?.rateScope === 'section' ? 'section' : 'document'),
      activePageTypers: Number(player?.timingContext?.activePageTypers ?? schedulerState?.activeSections) || 0,
      sectionWeight: Math.max(0.01, Number(player?.timingContext?.sectionWeight ?? player?.sectionRateMultiplier?.()) || 1),
      effectiveRate: inheritedRate,
      baseCharacterMs,
      characterBeatMs: baseCharacterMs / inheritedRate,
    };
  }

  function timingPlayerFromContext(context, signal) {
    if (!context) return null;
    return {
      signal,
      timingContext: context,
      effectivePlaybackRate: () => Math.max(0.01, Number(context.effectiveRate) || 1),
    };
  }

  function constructorVelocityRate(animation, app, player, operation) {
    const mode = ['inherit', 'playback', 'fixed'].includes(animation?.velocity)
      ? animation.velocity
      : 'inherit';
    const timingContext = captureTimingContext(app, player, operation);
    let rate = 1;
    if (mode === 'inherit') {
      rate = timingContext.effectiveRate;
    } else if (mode === 'playback') {
      rate = timingContext.playbackRate;
    }
    rate *= Math.max(0.01, Number(animation?.velocityMultiplier) || 1);
    return { mode, rate: Math.max(0.01, rate), timingContext };
  }

  function constructorTiming(animation, app, player, operation) {
    const velocity = constructorVelocityRate(animation, app, player, operation);
    const ownerContext = velocity.timingContext || captureTimingContext(app, player, operation);
    const baseCharacterMs = ownerContext.baseCharacterMs;
    const characterBeatMs = baseCharacterMs / velocity.rate;
    const configuredDurationMs = Math.max(0, Number(animation?.durationMs) || 0);
    const configuredDurationBeats = Math.max(0, Number(animation?.durationBeats) || 0);
    const minDurationMs = Math.max(0, Number(animation?.minDurationMs) || 0);
    const maxDurationMs = Math.max(minDurationMs, Number(animation?.maxDurationMs) || Number.POSITIVE_INFINITY);
    const rawDurationMs = configuredDurationBeats > 0
      ? configuredDurationBeats * characterBeatMs
      : configuredDurationMs / velocity.rate;
    const flooredDurationMs = Math.max(minDurationMs, rawDurationMs);
    return {
      velocity,
      timingSource: velocity.mode === 'fixed' ? 'literal' : velocity.mode === 'playback' ? 'playback' : 'owner-cadence',
      ownerContext,
      playbackRate: ownerContext.playbackRate,
      paceScope: ownerContext.paceScope,
      activePageTypers: ownerContext.activePageTypers,
      sectionWeight: ownerContext.sectionWeight,
      effectiveRate: velocity.rate,
      baseCharacterMs,
      characterBeatMs,
      configuredDurationMs,
      configuredDurationBeats,
      minDurationMs,
      maxDurationMs: Number.isFinite(maxDurationMs) ? maxDurationMs : null,
      resolvedDurationMs: Math.min(maxDurationMs, flooredDurationMs),
    };
  }



  function styledLinkRevealKeyframes(reveal, toOpacity = 1, toTransform = 'none') {
    return [
      { opacity: clamp(Number(reveal?.fromOpacity ?? 0), 0, 1), transform: String(reveal?.fromTransform || 'translateY(0.14em) scale(0.98)') },
      { opacity: Number(toOpacity) || 1, transform: String(toTransform || 'none') },
    ];
  }

  function strikeoutDrawKeyframes() {
    return [
      { transform: 'translateY(-50%) scaleX(0)' },
      { transform: 'translateY(-50%) scaleX(1)' },
    ];
  }

  function strongPulseKeyframes(scale = 1.08) {
    const safeScale = Math.max(0.01, Number(scale) || 1.08);
    return [
      { transform: 'scale(1)' },
      { transform: `scale(${safeScale})`, offset: 0.5 },
      { transform: 'scale(1)' },
    ];
  }

  function listVignetteKeyframes(mode = 'none', scale = 1.18, rotateDeg = 360) {
    const safeScale = Math.max(0.01, Number(scale) || 1.18);
    const safeRotate = Number(rotateDeg) || 360;
    if (mode === 'pulse') {
      return [{ transform: 'scale(1)' }, { transform: `scale(${safeScale})`, offset: 0.5 }, { transform: 'scale(1)' }];
    }
    if (mode === 'rotate') {
      return [{ transform: 'rotate(0deg)' }, { transform: `rotate(${safeRotate}deg)` }];
    }
    if (mode === 'pulse-rotate') {
      return [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: `scale(${safeScale}) rotate(${safeRotate / 2}deg)`, offset: 0.5 },
        { transform: `scale(1) rotate(${safeRotate}deg)` },
      ];
    }
    return [];
  }

  function constructorControlPreviewSpec(name, descriptor, effect, config, timing) {
    if (!descriptor || !config) return null;
    const runtime = resolveConstructorEffectRuntime(descriptor, effect);
    const runtimeState = runtime?.getState?.() || null;
    const duration = Math.max(0, Number(timing?.resolvedDurationMs) || 0);
    const common = {
      constructor: name,
      id: descriptor.id,
      effect,
      durationMs: duration,
      easing: String(config.easing || 'ease-out'),
      count: clamp(Math.round(Number(config.count) || 1), 1, 20),
      running: runtimeState?.running === true,
      reached: runtimeState?.reached === true,
      cycle: Number(runtimeState?.cycle) || 0,
      holdMs: Number(runtimeState?.holdMs) || 0,
    };
    if (name === 'styledlinks' && effect === 'reveal') {
      return {
        ...common,
        kind: 'link-reveal',
        text: '↗',
        keyframes: styledLinkRevealKeyframes(config, 1, 'none'),
      };
    }
    if (name === 'strikeout' && effect === 'animation') {
      return {
        ...common,
        kind: 'strikeout',
        text: 'ab',
        keyframes: strikeoutDrawKeyframes(),
      };
    }
    if (name === 'strong' && effect === 'pulse') {
      return {
        ...common,
        kind: 'strong-pulse',
        text: 'A',
        keyframes: strongPulseKeyframes(config.scale),
      };
    }
    if (name === 'lists' && effect === 'vignette') {
      const mode = ['none', 'pulse', 'rotate', 'pulse-rotate'].includes(config.animation) ? config.animation : 'none';
      const explicitText = config.text;
      return {
        ...common,
        kind: 'list-vignette',
        mode,
        text: explicitText !== undefined && explicitText !== null ? String(explicitText) : String(descriptor.defaultVignetteText || '•'),
        keyframes: listVignetteKeyframes(mode, config.scale, config.rotateDeg),
      };
    }
    return null;
  }

  function normalizeHeadingLevels(levels) {
    const clean = [...new Set((levels || [])
      .map(Number)
      .filter(level => Number.isInteger(level) && level >= 1 && level <= 6))]
      .sort((a, b) => a - b);
    return clean.length ? clean : [1];
  }

  function parseRatio(value, fallback = 1) {
    const raw = String(value ?? '').trim();
    if (!raw) return fallback;

    if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)\s*\/\s*[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw)) {
      const [a, b] = raw.split('/').map(Number);
      if (Number.isFinite(a) && Number.isFinite(b) && b !== 0) {
        return clamp(a / b, 0.25, 4);
      }
    }

    const numeric = Number(raw);
    return Number.isFinite(numeric) ? clamp(numeric, 0.25, 4) : fallback;
  }

  function normalizeColor(value) {
    let raw = String(value ?? '').trim();
    if (!raw) return null;

    // Convenient shorthand requested by the project: (0, 0, 255) or
    // 0, 0, 255 are normalized to rgb(...).
    const tuple = raw.match(/^\(?\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)?$/);
    if (tuple) {
      const [, r, g, b, a] = tuple;
      raw = a === undefined
        ? `rgb(${r}, ${g}, ${b})`
        : `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    return typeof CSS !== 'undefined' && CSS.supports('color', raw) ? raw : null;
  }

  function dispatch(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(`markdown-typewriter:${name}`, { detail }));
  }

  function isAbortError(error) {
    return error && (error.name === 'AbortError' || /aborted/i.test(error.message || ''));
  }

  function abortError() {
    try {
      return new DOMException('Aborted', 'AbortError');
    } catch (_) {
      const error = new Error('Aborted');
      error.name = 'AbortError';
      return error;
    }
  }

  /* ========================================================================
   *  Marked extensions for Typewriter commands
   * ====================================================================== */

  const COMMAND_NAMES = [
    'SlotRotation',
    'DeleteRotation',
    'StrikeRotation',
    'Slot',
    'Delete',
    'Strike',
    'textcolour',
    'textbg',
    'tempo',
    'typo',
    'HeadingLine',
  ];

  const COMMAND_NAME_PATTERN = COMMAND_NAMES.join('|');
  const COMMAND_CANONICAL_RE = new RegExp(
    `^(?:\\\\)?<!--\\s*(${COMMAND_NAME_PATTERN})(?::([\\s\\S]*?))?\\s*-->`,
    'i',
  );
  const COMMAND_TOLERANT_RE = new RegExp(
    `^\\\\<!--\\s*(${COMMAND_NAME_PATTERN})(?::([^>]*?))?\\s*>`,
    'i',
  );
  const COMMAND_START_RE = new RegExp(`\\\\?<!--\\s*(?:${COMMAND_NAME_PATTERN})`, 'i');
  const TYPO_SHORT_RE = /^\\<([^>\n]*)><([^>\n]*)>/;

  function installMarkdownExtensions() {
    if (!window.marked || typeof window.marked.use !== 'function') {
      throw new Error('Bundled Markdown parser did not load.');
    }

    const commandExtension = {
      name: 'twCommand',
      level: 'inline',
      start(src) {
        const index = src.search(COMMAND_START_RE);
        return index >= 0 ? index : undefined;
      },
      tokenizer(src) {
        const match = COMMAND_CANONICAL_RE.exec(src) || COMMAND_TOLERANT_RE.exec(src);
        if (!match) return undefined;

        return {
          type: 'twCommand',
          raw: match[0],
          command: match[1],
          arg: match[2] ?? '',
        };
      },
      renderer(token) {
        return `<span class="tw-command" data-command="${escapeAttr(token.command)}" data-arg="${escapeAttr(token.arg)}"></span>`;
      },
    };

    const commandBlockExtension = {
      name: 'twCommandBlock',
      level: 'block',
      tokenizer(src) {
        const match = COMMAND_CANONICAL_RE.exec(src) || COMMAND_TOLERANT_RE.exec(src);
        if (!match) return undefined;

        return {
          type: 'twCommandBlock',
          raw: match[0],
          command: match[1],
          arg: match[2] ?? '',
        };
      },
      renderer(token) {
        return `<span class="tw-command" data-command="${escapeAttr(token.command)}" data-arg="${escapeAttr(token.arg)}"></span>`;
      },
    };

    const typoShortExtension = {
      name: 'twTypoShort',
      level: 'inline',
      start(src) {
        const index = src.indexOf('\\<');
        return index >= 0 ? index : undefined;
      },
      tokenizer(src) {
        const match = TYPO_SHORT_RE.exec(src);
        if (!match) return undefined;
        return {
          type: 'twTypoShort',
          raw: match[0],
          wrong: match[1],
          right: match[2],
        };
      },
      renderer(token) {
        return `<span class="tw-command" data-command="typo" data-arg="${escapeAttr(`${token.wrong}|${token.right}`)}"></span>`;
      },
    };

    const renderer = new window.marked.Renderer();

    // Preserve the complete fence info string so constructors can consume
    // serializable metadata such as: ```js id=example copy-id=copy-example
    renderer.code = (code, infostring = '', escaped = false) => {
      const parsed = parseFenceInfo(infostring);
      const language = parsed.language;
      const normalizedCode = String(code).replace(/\n$/, '') + '\n';
      const body = escaped ? normalizedCode : escapeHtml(normalizedCode);
      const className = language ? ` class="language-${escapeAttr(language)}"` : '';
      const fenceInfo = infostring ? ` data-tw-fence-info="${escapeAttr(infostring)}"` : '';
      return `<pre${fenceInfo}><code${className}>${body}</code></pre>\n`;
    };

    // Loaded Markdown is treated as content, not executable HTML.
    renderer.html = html => escapeHtml(html);

    window.marked.use({
      extensions: [commandBlockExtension, commandExtension, typoShortExtension],
      renderer,
      gfm: true,
      breaks: false,
      headerIds: false,
      mangle: false,
    });
  }

  installMarkdownExtensions();

  /* ========================================================================
   *  Parsed DOM metadata
   * ====================================================================== */

  const textMetadata = new WeakMap();
  const dynamicMetadata = new WeakMap();
  const codeBlockMetadata = new WeakMap();
  const styledLinkMetadata = new WeakMap();
  const strikeoutMetadata = new WeakMap();
  const strongMetadata = new WeakMap();
  const emphasisMetadata = new WeakMap();
  const listItemMetadata = new WeakMap();
  const inlineConstructorMetadata = new WeakMap();

  function isInsideCode(node) {
    const parent = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return !!parent?.closest('pre, code');
  }

  function applyStyleToTextNode(textNode, style) {
    if (!style.color && !style.background) return textNode;

    const wrapper = document.createElement('span');
    wrapper.className = 'tw-color-run';
    if (style.color) wrapper.style.color = style.color;
    if (style.background) wrapper.style.backgroundColor = style.background;
    textNode.parentNode.insertBefore(wrapper, textNode);
    wrapper.appendChild(textNode);
    return textNode;
  }

  function splitWords(arg) {
    return String(arg ?? '')
      .split('|')
      .map(word => word.trim())
      .filter((word, index, all) => word.length > 0 || (all.length === 1 && index === 0));
  }

  function parseDynamicCommand(command, arg) {
    const normalized = command.toLowerCase();

    if (normalized === 'headingline') {
      return { kind: 'heading-line' };
    }

    if (normalized === 'typo') {
      const separator = String(arg).indexOf('|');
      const wrong = separator >= 0 ? String(arg).slice(0, separator) : String(arg);
      const right = separator >= 0 ? String(arg).slice(separator + 1) : '';
      return { kind: 'typo', wrong, right };
    }

    const rotationMap = {
      slotrotation: { kind: 'rotation', effect: 'slot', repeat: true },
      deleterotation: { kind: 'rotation', effect: 'delete', repeat: true },
      strikerotation: { kind: 'rotation', effect: 'strike', repeat: true },
      slot: { kind: 'rotation', effect: 'slot', repeat: false },
      delete: { kind: 'rotation', effect: 'delete', repeat: false },
      strike: { kind: 'rotation', effect: 'strike', repeat: false },
    };

    const rotation = rotationMap[normalized];
    if (!rotation) return null;
    return { ...rotation, words: splitWords(arg) };
  }

  function preprocessCommands(root) {
    const state = {
      tempo: 1,
      colorStack: [null],
      backgroundStack: [null],
    };

    function currentStyle() {
      return {
        color: state.colorStack[state.colorStack.length - 1] || null,
        background: state.backgroundStack[state.backgroundStack.length - 1] || null,
      };
    }

    function handleCommand(node) {
      const command = (node.dataset.command || '').trim();
      const normalized = command.toLowerCase();
      const arg = node.dataset.arg ?? '';

      if (normalized === 'tempo') {
        state.tempo = parseRatio(arg, 1);
        node.remove();
        return;
      }

      if (normalized === 'textcolour') {
        if (String(arg).trim()) {
          const color = normalizeColor(arg);
          if (color) state.colorStack.push(color);
        } else if (state.colorStack.length > 1) {
          state.colorStack.pop();
        }
        node.remove();
        return;
      }

      if (normalized === 'textbg') {
        if (String(arg).trim()) {
          const background = normalizeColor(arg);
          if (background) state.backgroundStack.push(background);
        } else if (state.backgroundStack.length > 1) {
          state.backgroundStack.pop();
        }
        node.remove();
        return;
      }

      const dynamic = parseDynamicCommand(command, arg);
      if (dynamic) {
        node.className = 'tw-dynamic';
        node.removeAttribute('data-command');
        node.removeAttribute('data-arg');
        dynamicMetadata.set(node, {
          ...dynamic,
          tempo: state.tempo,
          style: currentStyle(),
          isCode: false,
        });
        return;
      }

      node.remove();
    }

    function walk(node) {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('tw-command')) {
          handleCommand(child);
          continue;
        }

        if (child.nodeType === Node.TEXT_NODE) {
          const style = currentStyle();
          applyStyleToTextNode(child, style);
          textMetadata.set(child, {
            tempo: state.tempo,
            style,
            isCode: isInsideCode(child),
          });
          continue;
        }

        if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      }
    }

    walk(root);

    // A line containing only a persistent command becomes an empty paragraph
    // after preprocessing. Remove those layout artifacts while retaining real
    // empty structural elements such as cells/list items.
    $$('p', root).forEach(paragraph => {
      if (!paragraph.textContent.trim() && !paragraph.querySelector('img, br, .tw-dynamic')) {
        paragraph.remove();
      }
    });
  }

  function sanitizeRenderedDom(root) {
    $$('a[href]', root).forEach(link => {
      const raw = link.getAttribute('href') || '';
      const trimmed = raw.trim().toLowerCase();
      if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
        link.removeAttribute('href');
      }
      if (link.hasAttribute('href')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    $$('img[src]', root).forEach(image => {
      const raw = image.getAttribute('src') || '';
      const trimmed = raw.trim().toLowerCase();
      if (trimmed.startsWith('javascript:') || (trimmed.startsWith('data:') && !trimmed.startsWith('data:image/'))) {
        image.removeAttribute('src');
      }
    });
  }

  /* ========================================================================
   *  Constructors
   * ====================================================================== */

  function visualIndentColumns(line, tabSize) {
    let columns = 0;
    for (const character of String(line ?? '')) {
      if (character === ' ') {
        columns += 1;
      } else if (character === '\t') {
        const remainder = columns % tabSize;
        columns += remainder === 0 ? tabSize : tabSize - remainder;
      } else {
        break;
      }
    }
    return columns;
  }

  function greatestCommonDivisor(a, b) {
    let x = Math.abs(Math.round(a));
    let y = Math.abs(Math.round(b));
    while (y) [x, y] = [y, x % y];
    return x || 1;
  }

  function detectIndentUnit(lines, tabSize, configuredUnit) {
    if (configuredUnit !== 'auto') {
      const numeric = Number(configuredUnit);
      return Number.isFinite(numeric) && numeric > 0 ? numeric : tabSize;
    }

    const positive = lines
      .filter(line => line.trim().length > 0)
      .map(line => visualIndentColumns(line, tabSize))
      .filter(value => value > 0);

    if (!positive.length) return tabSize;
    return positive.reduce((unit, value) => greatestCommonDivisor(unit, value));
  }

  function uniqueDomId(base, usedIds) {
    const root = sanitizeDomId(base);
    let candidate = root;
    let suffix = 2;
    while (usedIds.has(candidate) || document.getElementById(candidate)) {
      candidate = `${root}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(candidate);
    return candidate;
  }

  function effectiveCodeBlockConfig(app, descriptor) {
    const base = app.parameters.renderer.constructors.codeblock;
    const presetName = descriptor?.preset || base.defaultPreset || 'default';
    return effectiveConstructorConfig(
      base,
      presetName,
      descriptor?.markdownOverride || {},
      descriptor?.override || {},
    );
  }


  const CODE_SYNTAX_KEYWORDS = Object.freeze({
    python: new Set('and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield'.split(' ')),
    javascript: new Set('async await break case catch class const continue debugger default delete do else export extends finally for from function get if import in instanceof let new of return set static super switch this throw try typeof var void while with yield'.split(' ')),
    cpp: new Set('alignas alignof and and_eq asm atomic_cancel atomic_commit atomic_noexcept auto bitand bitor bool break case catch char char8_t char16_t char32_t class compl concept const consteval constexpr constinit const_cast continue co_await co_return co_yield decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept not not_eq nullptr operator or or_eq private protected public reflexpr register reinterpret_cast requires return short signed sizeof static static_assert static_cast struct switch synchronized template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while xor xor_eq'.split(' ')),
    verse: new Set('CODE LOOP Outer Inner Sibling Pulse Root'.split(' ')),
  });

  function canonicalCodeLanguage(language) {
    const value = String(language || '').trim().toLowerCase().replace(/[^a-z0-9+#-]/g, '');
    if (['py', 'python', 'python3'].includes(value)) return 'python';
    if (['js', 'javascript', 'jsx', 'mjs', 'cjs', 'ts', 'typescript', 'tsx'].includes(value)) return 'javascript';
    if (['c++', 'cpp', 'cxx', 'cc', 'hpp', 'h++', 'c'].includes(value)) return 'cpp';
    if (['verse', 'poem', 'prose'].includes(value)) return 'verse';
    return '';
  }

  function codeSyntaxRules(language) {
    const canonical = canonicalCodeLanguage(language);
    if (!canonical) return [];
    const rules = [];
    if (canonical === 'python' || canonical === 'verse') {
      rules.push(['comment', /#.*/g]);
    } else {
      rules.push(['comment', /\/\/.*/g]);
      if (canonical === 'cpp') rules.push(['preprocessor', /^\s*#\s*[A-Za-z_]\w*/g]);
    }
    rules.push(['string', /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g]);
    rules.push(['number', /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g]);
    const keywordSet = CODE_SYNTAX_KEYWORDS[canonical];
    if (keywordSet?.size) {
      const source = `\\b(?:${[...keywordSet].map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`;
      rules.push(['keyword', new RegExp(source, 'g')]);
    }
    rules.push(['function', /\b[A-Za-z_$][\w$]*(?=\s*\()/g]);
    rules.push(['operator', /(?:===|!==|==|!=|=>|<=|>=|<<|>>|\+\+|--|&&|\|\||::|->|[+\-*\/%=<>!&|^~?:])/g]);
    return rules;
  }

  function codeSyntaxTokens(line, language) {
    const text = String(line ?? '');
    const rules = codeSyntaxRules(language);
    if (!rules.length || !text) return [{ text, kind: '' }];
    const tokens = [];
    let cursor = 0;
    while (cursor < text.length) {
      let best = null;
      for (const [kind, regex] of rules) {
        regex.lastIndex = cursor;
        const match = regex.exec(text);
        if (!match) continue;
        if (!best || match.index < best.index || (match.index === best.index && match[0].length > best.text.length)) {
          best = { kind, index: match.index, text: match[0] };
        }
      }
      if (!best) {
        tokens.push({ text: text.slice(cursor), kind: '' });
        break;
      }
      if (best.index > cursor) tokens.push({ text: text.slice(cursor, best.index), kind: '' });
      tokens.push({ text: best.text, kind: best.kind });
      cursor = best.index + Math.max(1, best.text.length);
      if (best.kind === 'comment') {
        if (cursor < text.length) tokens.push({ text: text.slice(cursor), kind: 'comment' });
        break;
      }
    }
    return tokens;
  }

  function restoreCodeLineTextNode(descriptor, lineIndex, { clear = false } = {}) {
    const node = descriptor?.lineNodes?.[lineIndex];
    const lineElement = descriptor?.lineElements?.[lineIndex];
    if (!node || !lineElement) return node || null;
    if (node.parentNode !== lineElement) lineElement.replaceChildren(node);
    if (clear) node.data = '';
    lineElement.classList.remove('is-syntax-highlighted');
    return node;
  }

  function applyCodeSyntaxHighlight(descriptor, lineIndex) {
    const lineElement = descriptor?.lineElements?.[lineIndex];
    const node = descriptor?.lineNodes?.[lineIndex];
    if (!lineElement || !node || lineElement.classList.contains('tw-codeblock-line-host')) return;
    const language = canonicalCodeLanguage(descriptor.language);
    if (!language || !node.data) return;
    const tokens = codeSyntaxTokens(node.data, language);
    if (!tokens.some(token => token.kind)) return;
    const fragment = document.createDocumentFragment();
    tokens.forEach(token => {
      if (!token.kind) {
        fragment.appendChild(document.createTextNode(token.text));
        return;
      }
      const span = document.createElement('span');
      span.className = `tw-syntax-${token.kind}`;
      span.textContent = token.text;
      fragment.appendChild(span);
    });
    lineElement.replaceChildren(fragment);
    lineElement.classList.add('is-syntax-highlighted');
  }

  function applyCodeBlockBase(descriptor, app) {
    const config = effectiveCodeBlockConfig(app, descriptor);
    descriptor.appliedBaseKeys = applyCssMap(descriptor.element, config.css, descriptor.appliedBaseKeys);
    descriptor.appliedHeaderKeys = applyCssMap(descriptor.headerElement, config.headerCss, descriptor.appliedHeaderKeys);
    descriptor.appliedCodeKeys = applyCssMap(descriptor.codeElement, config.codeCss, descriptor.appliedCodeKeys);

    // Recompute indentation metadata from immutable source lines so tabSize,
    // indentUnit, and depthRate can all be changed live through the item API.
    if (descriptor.lineSources?.length && descriptor.lineNodes?.length) {
      const tabSize = clamp(Number(config.tabSize) || 4, 1, 16);
      const indentUnit = detectIndentUnit(descriptor.lineSources, tabSize, config.indentUnit);
      let maxDepth = 0;
      descriptor.lineNodes.forEach((textNode, index) => {
        const sourceLine = descriptor.lineSources[index] || '';
        const columns = visualIndentColumns(sourceLine, tabSize);
        const depth = indentUnit > 0 ? Math.floor(columns / indentUnit) : 0;
        maxDepth = Math.max(maxDepth, depth);
        const meta = textMetadata.get(textNode) || {};
        textMetadata.set(textNode, {
          ...meta,
          isCode: true,
          constructor: 'codeblock',
          codeBlockId: descriptor.id,
          codeIndentColumns: columns,
          codeIndentDepth: depth,
        });
      });
      descriptor.tabSize = tabSize;
      descriptor.indentUnit = indentUnit;
      descriptor.maxDepth = maxDepth;
    }

    const copy = config.copyButton || {};
    if (descriptor.copyButton) {
      descriptor.copyButton.hidden = copy.enabled === false;
      descriptor.copyButton.disabled = copy.enabled === false;
      descriptor.copyButton.textContent = String(copy.label || 'Copy');
      descriptor.copyButton.dataset.normalLabel = String(copy.label || 'Copy');
      descriptor.appliedCopyKeys = applyCssMap(descriptor.copyButton, copy.css, descriptor.appliedCopyKeys);
    }

    const previousConfig = descriptor.currentConfig;
    descriptor.currentConfig = config;

    // Live API changes do not rebuild the viewport. Structural block timing or
    // scheduling changes restart the block runtime; named-loop defaults/maps
    // restart only those local loop clocks.
    if (descriptor.runtime?.generation > 0 && previousConfig) {
      const blockTimingChanged = Number(previousConfig.holdMs || 0) !== Number(config.holdMs || 0)
        || previousConfig.render !== config.render;
      if (blockTimingChanged) {
        descriptor.runtime.start();
      } else if (JSON.stringify(previousConfig.loopDefaults || {}) !== JSON.stringify(config.loopDefaults || {})
        || JSON.stringify(previousConfig.loops || {}) !== JSON.stringify(config.loops || {})) {
        descriptor.loops.forEach(loop => loop.runtime?.onConfigChanged());
      }
    }
    return config;
  }

  function constructCodeBlocks(root, noteId, app, usedIds = new Set()) {
    const baseConfig = app.parameters.renderer.constructors.codeblock;
    if (!baseConfig.enabled) return [];

    const descriptors = [];
    const noteToken = hashString(noteId).slice(0, 8);

    const buildDescriptor = ({
      program,
      rawRenderSource,
      language = '',
      attributes = {},
      fenceInfo = '',
      existingPre = null,
      existingCodeElement = null,
      parentBlock = null,
      hostLineIndex = null,
      sourceNode = null,
      hostElement = null,
    }) => {
      const index = descriptors.length;
      const sourceParameters = program?.blockParameters || {};
      const effectiveAttributes = {
        ...sourceParameters,
        ...attributes,
      };
      const markdown = codeBlockMarkdownConfig(effectiveAttributes, program);
      const preset = effectiveAttributes.preset || markdown.preset || baseConfig.defaultPreset || 'default';
      const config = effectiveConstructorConfig(baseConfig, preset, markdown.override, {});
      const source = program.source;
      const lines = program.displayLines.length ? program.displayLines : [''];
      const tabSize = clamp(Number(config.tabSize) || 4, 1, 16);
      const indentUnit = detectIndentUnit(lines, tabSize, config.indentUnit);

      const fallbackId = parentBlock
        ? `${parentBlock.id}-code-${parentBlock.childCodeBlocks.length + 1}`
        : `tw-code-${noteToken}-${index + 1}`;
      const requestedId = effectiveAttributes.id || fallbackId;
      const id = uniqueDomId(requestedId, usedIds);
      const copyPrefix = sanitizeDomId(config.copyButton?.idPrefix || 'tw-copy');
      const requestedCopyId = effectiveAttributes['copy-id'] || `${copyPrefix}-${id}`;
      const copyButtonId = uniqueDomId(requestedCopyId, usedIds);
      const title = effectiveAttributes.title || language || 'Code';

      const wrapper = document.createElement('section');
      wrapper.className = `tw-codeblock${parentBlock ? ' tw-codeblock-nested' : ''}`;
      wrapper.id = id;
      wrapper.dataset.constructor = 'codeblock';
      wrapper.dataset.codeblockId = id;
      if (parentBlock) {
        wrapper.dataset.parentCodeblockId = parentBlock.id;
        wrapper.hidden = true;
      }

      const header = document.createElement('div');
      header.className = 'tw-codeblock-header';
      header.dataset.twStatic = 'true';
      header.setAttribute('aria-label', `${title} code block`);

      const label = document.createElement('span');
      label.className = 'tw-codeblock-label';
      label.textContent = title;
      header.appendChild(label);

      const treeDepth = parentBlock ? (Number(parentBlock.treeDepth) || 0) + 1 : 0;
      wrapper.dataset.codeLanguage = canonicalCodeLanguage(language) || 'text';
      wrapper.dataset.codeDepth = String(treeDepth);
      if (treeDepth > 0) {
        const depthBadge = document.createElement('span');
        depthBadge.className = 'tw-codeblock-depth';
        depthBadge.textContent = `↳ d${treeDepth}`;
        depthBadge.title = `Nested CODE depth ${treeDepth}`;
        header.appendChild(depthBadge);
      }

      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'tw-codeblock-copy';
      copyButton.id = copyButtonId;
      copyButton.dataset.copyCodeblock = id;
      copyButton.setAttribute('aria-label', `Copy ${title}`);
      header.appendChild(copyButton);

      let pre = existingPre;
      let codeElement = existingCodeElement;
      if (pre && codeElement) {
        pre.removeAttribute('data-tw-fence-info');
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
      } else {
        pre = document.createElement('pre');
        codeElement = document.createElement('code');
        if (language) codeElement.className = `language-${sanitizeDomId(language, 'text')}`;
        pre.appendChild(codeElement);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
        hostElement?.appendChild(wrapper);
      }

      codeElement.replaceChildren();
      const lineNodes = [];
      const lineElements = [];
      let maxDepth = 0;
      lines.forEach((line, lineIndex) => {
        const columns = visualIndentColumns(line, tabSize);
        const depth = indentUnit > 0 ? Math.floor(columns / indentUnit) : 0;
        maxDepth = Math.max(maxDepth, depth);
        const lineElement = document.createElement('span');
        lineElement.className = 'tw-codeblock-line';
        lineElement.dataset.line = String(lineIndex);
        const textNode = document.createTextNode('');
        lineNodes.push(textNode);
        lineElements.push(lineElement);
        lineElement.appendChild(textNode);
        codeElement.appendChild(lineElement);
        if (lineIndex < lines.length - 1) codeElement.appendChild(document.createTextNode('\n'));
        textMetadata.set(textNode, {
          tempo: 1,
          style: { color: null, background: null },
          isCode: true,
          constructor: 'codeblock',
          codeBlockId: id,
          codeIndentColumns: columns,
          codeIndentDepth: depth,
        });
      });

      const descriptor = {
        id,
        index,
        constructor: 'codeblock',
        language,
        title,
        copyButtonId,
        source,
        rawSource: String(rawRenderSource ?? '').replace(/\n$/, ''),
        lineSources: lines.slice(),
        lineNodes,
        lineElements,
        program,
        loops: [],
        rootLoops: [],
        childCodeBlocks: [],
        parentBlock,
        parentBlockId: parentBlock?.id || null,
        hostLineIndex: Number.isInteger(hostLineIndex) ? hostLineIndex : null,
        codePath: sourceNode?.path || null,
        sourceNode,
        runtime: null,
        runtimeMode: 'independent-tree',
        treeDepth,
        indentUnit,
        tabSize,
        maxDepth,
        element: wrapper,
        headerElement: header,
        labelElement: label,
        codeElement,
        copyButton,
        preset,
        markdownMetadata: {
          raw: fenceInfo,
          id: effectiveAttributes.id || null,
          classes: [],
          attributes: clone(effectiveAttributes),
        },
        markdownOverride: markdown.override,
        override: {},
        appliedBaseKeys: null,
        appliedHeaderKeys: null,
        appliedCodeKeys: null,
        appliedCopyKeys: null,
        currentConfig: null,
      };

      // Register the parent before descendants so constructor order is a stable
      // preorder traversal of the runtime tree.
      descriptors.push(descriptor);

      descriptor.loops = program.loops.map((loop, loopIndex) => ({
        ...loop,
        id: `${id}:${sanitizeDomId(loop.path || loop.name, `loop-${loopIndex + 1}`)}-${loopIndex + 1}`,
        index: loopIndex,
        constructor: 'codeblock-loop',
        override: {},
        runtime: null,
        parentLoop: null,
        childLoops: [],
      }));
      const loopsByPath = new Map(descriptor.loops.map(loop => [loop.path, loop]));
      descriptor.loops.forEach(loop => {
        if (!loop.parentPath) return;
        loop.parentLoop = loopsByPath.get(loop.parentPath) || null;
        loop.parentLoop?.childLoops.push(loop);
      });
      descriptor.rootLoops = descriptor.loops.filter(loop => !loop.parentLoop);
      descriptor.runtime = new CodeBlockRuntime(app, descriptor);
      descriptor.loops
        .slice()
        .sort((left, right) => left.depth - right.depth || left.index - right.index)
        .forEach(loop => {
          loop.runtime = new CodeBlockLoopRuntime(
            app,
            descriptor.runtime,
            loop,
            loop.parentLoop?.runtime || null,
          );
        });

      // Nested CODE nodes get a structural host line in the parent viewport.
      // Their own loops/configuration/runtime are entirely local to the child.
      (program.codeBlocks || []).forEach(codeNode => {
        const host = lineElements[codeNode.slotLineIndex];
        if (!host) return;
        host.classList.add('tw-codeblock-line-host');
        const child = buildDescriptor({
          program: codeNode.program,
          rawRenderSource: codeNode.rawSource,
          language: codeNode.language || '',
          attributes: {},
          fenceInfo: '',
          parentBlock: descriptor,
          hostLineIndex: codeNode.slotLineIndex,
          sourceNode: codeNode,
          hostElement: host,
        });
        codeNode.descriptor = child;
        descriptor.childCodeBlocks.push(child);
      });

      codeBlockMetadata.set(wrapper, descriptor);
      applyCodeBlockBase(descriptor, app);
      dispatch('codeblock-constructed', {
        noteId,
        id,
        index,
        language,
        copyButtonId: descriptor.copyButtonId,
        indentUnit,
        maxDepth,
        preset: descriptor.preset,
        render: config.render,
        holdMs: config.holdMs,
        parentCodeBlockId: descriptor.parentBlockId,
        codePath: descriptor.codePath,
        childCodeBlockIds: descriptor.childCodeBlocks.map(child => child.id),
        loops: descriptor.loops.map(loop => loop.path),
        markdownMetadata: descriptor.markdownMetadata,
      });
      dispatch('constructor-constructed', {
        noteId,
        constructor: 'codeblock',
        id,
        index,
        parentCodeBlockId: descriptor.parentBlockId,
      });
      return descriptor;
    };

    [...root.querySelectorAll('pre > code')].forEach(codeElement => {
      const pre = codeElement.parentElement;
      if (!pre || pre.closest('.tw-codeblock')) return;

      const fenceInfo = pre.dataset.twFenceInfo || '';
      const parsed = parseFenceInfo(fenceInfo);
      const rawRenderSource = codeElement.textContent;
      const program = parseCodeBlockProgram(rawRenderSource);
      buildDescriptor({
        program,
        rawRenderSource,
        language: parsed.language || '',
        attributes: parsed.attributes,
        fenceInfo,
        existingPre: pre,
        existingCodeElement: codeElement,
      });
    });

    return descriptors;
  }

  function visibleCodeBlockText(descriptor) {
    if (!descriptor) return '';
    const childByLine = new Map(
      (descriptor.childCodeBlocks || []).map(child => [child.hostLineIndex, child]),
    );
    return descriptor.lineNodes.map((node, lineIndex) => {
      const child = childByLine.get(lineIndex);
      if (child) {
        return child.runtime?.scopeActive ? visibleCodeBlockText(child) : '';
      }
      return node?.data || '';
    }).join('\n');
  }

  function normalizeConstructorEffectLoop(loop, fallbackHoldMs = 1800) {
    const source = isPlainObject(loop) ? loop : {};
    return {
      enabled: source.enabled === true,
      holdMs: clamp(Number(source.holdMs) || fallbackHoldMs, 0, 86_400_000),
    };
  }

  function defaultConstructorEffectChannel(name) {
    if (name === 'styledlinks') return 'reveal';
    if (name === 'strikeout') return 'animation';
    if (name === 'strong') return 'pulse';
    if (name === 'lists') return 'vignette';
    return 'primary';
  }

  function constructorEffectConfig(app, name, descriptor, effect = defaultConstructorEffectChannel(name)) {
    if (name === 'styledlinks' && effect === 'reveal') return effectiveStyledLinkConfig(app, descriptor).reveal;
    if (name === 'styledlinks' && effect === 'glow') return effectiveStyledLinkConfig(app, descriptor).glow;
    if (name === 'strikeout' && effect === 'animation') return effectiveStrikeoutConfig(app, descriptor).animation;
    if (name === 'strong' && effect === 'pulse') return effectiveStrongConfig(app, descriptor).pulse;
    if (name === 'lists' && effect === 'vignette') return effectiveListItemConfig(app, descriptor).vignette;
    return null;
  }

  function constructorEffectLoopConfig(app, name, descriptor, effect) {
    const config = constructorEffectConfig(app, name, descriptor, effect);
    return normalizeConstructorEffectLoop(config?.loop, 1800);
  }

  class ConstructorEffectRuntime {
    constructor(app, name, descriptor, effect = defaultConstructorEffectChannel(name)) {
      this.app = app;
      this.name = name;
      this.effect = effect;
      this.descriptor = descriptor;
      this.reached = false;
      this.active = true;
      this.running = false;
      this.cycle = 0;
      this.generation = 0;
      this.loopController = null;
      this.loopPromise = null;
      this.lastContext = null;
      this.manualLoop = null;
      this.parentSignal = app.abortController.signal;
      this.parentSignal.addEventListener('abort', () => this.dispose(), { once: true });
    }

    getLoopConfig() {
      const configured = constructorEffectLoopConfig(this.app, this.name, this.descriptor, this.effect);
      if (!this.manualLoop) return configured;
      return {
        enabled: this.manualLoop.enabled !== undefined ? this.manualLoop.enabled : configured.enabled,
        holdMs: this.manualLoop.holdMs !== undefined ? this.manualLoop.holdMs : configured.holdMs,
      };
    }

    getState() {
      const loop = this.getLoopConfig();
      return {
        constructor: this.name,
        effect: this.effect,
        id: this.descriptor.id,
        reached: this.reached,
        active: this.active,
        running: this.running,
        cycle: this.cycle,
        generation: this.generation,
        loopEnabled: loop.enabled,
        holdMs: loop.holdMs,
        timingContext: this.lastContext?.timingContext ? clone(this.lastContext.timingContext) : null,
      };
    }

    markReached(context = {}) {
      if (!this.active) return;
      this.reached = true;
      const timingContext = captureTimingContext(this.app, context.player || null, context.operation || null);
      this.lastContext = {
        operation: context.operation || null,
        phase: context.phase || null,
        timingContext,
      };
      this.syncLoopFromConfig();
    }

    syncLoopFromConfig() {
      if (!this.active || !this.reached) return;
      const loop = this.getLoopConfig();
      if (loop.enabled) this.ensureLoop();
      else this.stopLoop({ preserveManual: true });
    }

    replay(options = {}) {
      if (!this.active || this.parentSignal.aborted) return Promise.resolve(false);
      const player = timingPlayerFromContext(this.lastContext?.timingContext, this.parentSignal)
        || (this.descriptor.lastEffectiveRate
          ? { effectivePlaybackRate: () => this.descriptor.lastEffectiveRate, signal: this.parentSignal }
          : null);
      const operation = this.lastContext?.operation || null;
      const phase = this.lastContext?.phase || null;
      return runConstructorTransientEffect(
        this.name,
        this.descriptor,
        this.app,
        player,
        operation,
        phase,
        { animate: options.animate !== false, runtimeManaged: true, effect: this.effect },
      );
    }

    startLoop(options = {}) {
      const holdMs = options.holdMs === undefined ? undefined : clamp(Number(options.holdMs) || 0, 0, 86_400_000);
      this.manualLoop = {
        enabled: true,
        ...(holdMs === undefined ? {} : { holdMs }),
      };
      this.ensureLoop();
      return this.getState();
    }

    stopLoop(options = {}) {
      if (options.preserveManual !== true) this.manualLoop = { enabled: false };
      if (this.loopController) this.loopController.abort();
      this.loopController = null;
      this.loopPromise = null;
      this.running = false;
      return this.getState();
    }

    restartLoop(options = {}) {
      this.stopLoop({ preserveManual: true });
      if (options.holdMs !== undefined) {
        this.manualLoop = { enabled: true, holdMs: clamp(Number(options.holdMs) || 0, 0, 86_400_000) };
      } else if (this.manualLoop?.enabled === false) {
        this.manualLoop = { enabled: true };
      }
      this.ensureLoop();
      return this.getState();
    }

    ensureLoop() {
      if (!this.active || !this.reached || this.parentSignal.aborted || this.running) return;
      const loop = this.getLoopConfig();
      if (!loop.enabled) return;

      const controller = new AbortController();
      const parentSignal = this.parentSignal;
      const onParentAbort = () => controller.abort();
      parentSignal.addEventListener('abort', onParentAbort, { once: true });
      this.loopController = controller;
      this.running = true;
      this.generation += 1;
      const generation = this.generation;

      this.loopPromise = (async () => {
        try {
          while (this.active && !controller.signal.aborted && generation === this.generation) {
            const liveLoop = this.getLoopConfig();
            if (!liveLoop.enabled) break;
            await this.app.waitLoop(liveLoop.holdMs, controller.signal);
            if (controller.signal.aborted || !this.active || generation !== this.generation) break;
            this.cycle += 1;
            dispatch('constructor-effect-cycle', {
              noteId: this.app.currentNote?.id,
              constructor: this.name,
              effect: this.effect,
              id: this.descriptor.id,
              cycle: this.cycle,
              generation,
              holdMs: liveLoop.holdMs,
              phase: 'start',
              replayed: null,
            });
            const replayed = await this.replay({ animate: true });
            dispatch('constructor-effect-cycle', {
              noteId: this.app.currentNote?.id,
              constructor: this.name,
              effect: this.effect,
              id: this.descriptor.id,
              cycle: this.cycle,
              generation,
              holdMs: liveLoop.holdMs,
              phase: 'complete',
              replayed: replayed !== false,
            });
          }
        } catch (error) {
          if (!isAbortError(error)) throw error;
        } finally {
          parentSignal.removeEventListener('abort', onParentAbort);
          if (this.loopController === controller) this.loopController = null;
          if (generation === this.generation) this.running = false;
        }
      })();
    }

    dispose() {
      if (!this.active) return;
      this.active = false;
      if (this.loopController) this.loopController.abort();
      this.loopController = null;
      this.loopPromise = null;
      this.running = false;
    }
  }

  function attachConstructorEffectRuntime(app, name, descriptor, effect = defaultConstructorEffectChannel(name)) {
    if (!descriptor) return null;
    if (!descriptor.effectRuntimes) descriptor.effectRuntimes = Object.create(null);
    const runtime = new ConstructorEffectRuntime(app, name, descriptor, effect);
    descriptor.effectRuntimes[effect] = runtime;
    if (!descriptor.effectRuntime || effect === defaultConstructorEffectChannel(name)) {
      descriptor.effectRuntime = runtime; // compatibility alias for the primary effect channel
    }
    return runtime;
  }

  function resolveConstructorEffectRuntime(descriptor, effect = null) {
    if (!descriptor) return null;
    if (!effect) return descriptor.effectRuntime || null;
    return descriptor.effectRuntimes?.[effect] || null;
  }

  function syncConstructorEffectRuntimes(descriptor) {
    Object.values(descriptor?.effectRuntimes || {}).forEach(runtime => runtime?.syncLoopFromConfig?.());
  }

  function constructorEffectRuntimeStates(descriptor) {
    return Object.fromEntries(
      Object.entries(descriptor?.effectRuntimes || {}).map(([effect, runtime]) => [effect, clone(runtime?.getState?.() || null)]),
    );
  }

  function effectiveStyledLinkConfig(app, descriptor) {
    const base = app.parameters.renderer.constructors.styledlinks;
    const presetName = descriptor?.preset || base.defaultPreset || 'default';
    return effectiveConstructorConfig(
      base,
      presetName,
      descriptor?.markdownOverride || {},
      descriptor?.override || {},
    );
  }

  function applyStyledLinkBehavior(descriptor, config) {
    const link = descriptor.element;
    const behavior = config.behavior || {};
    const open = ['default', 'same-tab', 'new-tab', 'emit-only'].includes(behavior.open)
      ? behavior.open
      : 'default';

    if (open === 'new-tab') link.setAttribute('target', '_blank');
    else if (open === 'same-tab') link.setAttribute('target', '_self');
    else if (open === 'emit-only') link.removeAttribute('target');
    else if (descriptor.originalTarget) link.setAttribute('target', descriptor.originalTarget);
    else link.removeAttribute('target');

    const rel = String(behavior.rel ?? descriptor.originalRel ?? '').trim();
    if (rel) link.setAttribute('rel', rel);
    else link.removeAttribute('rel');
  }

  function styledLinkGlowCss(glow = {}) {
    const blur = clamp(Number(glow.blurPx) || 0, 0, 128);
    const spread = clamp(Number(glow.spreadPx) || 0, -32, 64);
    const opacity = clamp(Number(glow.opacity ?? 0.62), 0, 1);
    const color = String(glow.color || 'currentColor');
    const mixedColor = `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`;
    const css = {
      textShadow: `0 0 ${blur}px ${mixedColor}`,
    };
    if (spread !== 0) css.boxShadow = `0 0 ${blur}px ${spread}px ${mixedColor}`;
    return css;
  }

  function applyStyledLinkBase(descriptor, app) {
    const link = descriptor.element;
    const config = effectiveStyledLinkConfig(app, descriptor);

    if (descriptor.appliedHoverKeys) {
      for (const property of descriptor.appliedHoverKeys) link.style.removeProperty(property);
      descriptor.appliedHoverKeys = null;
    }

    descriptor.appliedBaseKeys = applyCssMap(link, config.css, descriptor.appliedBaseKeys);

    const glow = config.glow || {};
    const baseGlowCss = glow.enabled === true && glow.trigger === 'always'
      ? styledLinkGlowCss(glow)
      : {};
    descriptor.appliedGlowKeys = applyCssMap(link, baseGlowCss, descriptor.appliedGlowKeys);

    const hover = config.hover || {};
    if (hover.enabled !== false) {
      link.style.setProperty('transition-property', 'transform, text-shadow, box-shadow, filter, color, background-color');
      link.style.setProperty('transition-duration', `${clamp(Number(hover.durationMs) || 150, 0, 5000)}ms`);
      link.style.setProperty('transition-timing-function', String(hover.easing || 'ease-out'));
    } else {
      link.style.removeProperty('transition-property');
      link.style.removeProperty('transition-duration');
      link.style.removeProperty('transition-timing-function');
    }

    applyStyledLinkBehavior(descriptor, config);
    descriptor.currentConfig = config;
    return config;
  }

  function setStyledLinkHover(descriptor, app, active) {
    const link = descriptor.element;
    const config = effectiveStyledLinkConfig(app, descriptor);
    const hover = config.hover || {};

    if (!active || hover.enabled === false) {
      applyStyledLinkBase(descriptor, app);
      return;
    }

    applyStyledLinkBase(descriptor, app);
    const hoverCss = normalizeCssMap(hover.css);
    if (!Object.prototype.hasOwnProperty.call(hoverCss, 'transform')) {
      const scale = Math.max(0.01, Number(hover.scale) || 1);
      const translateYEm = Number(hover.translateYEm) || 0;
      hoverCss.transform = `translateY(${translateYEm}em) scale(${scale})`;
    }

    const glow = config.glow || {};
    if (glow.enabled === true && glow.trigger === 'hover') {
      Object.assign(hoverCss, normalizeCssMap(styledLinkGlowCss(glow)));
    }

    descriptor.appliedHoverKeys = applyCssMap(link, hoverCss);
  }

  async function revealStyledLink(descriptor, app, options = {}) {
    if (!descriptor || descriptor.revealed) return false;
    descriptor.revealed = true;
    descriptor.element.classList.add('tw-styled-link-revealed');

    const config = effectiveStyledLinkConfig(app, descriptor);
    const reveal = config.reveal || {};
    const animate = options.animate !== false && reveal.enabled !== false;
    const animations = [];

    const revealTiming = constructorTiming(reveal, app, options.player || null, options.operation || null);
    descriptor.lastEffectiveRate = revealTiming.effectiveRate;

    if (animate && typeof descriptor.element.animate === 'function') {
      const revealElement = descriptor.revealElement || descriptor.element;
      const computed = getComputedStyle(revealElement);
      const fromOpacity = clamp(Number(reveal.fromOpacity ?? 0), 0, 1);
      const fromTransform = String(reveal.fromTransform || 'translateY(0.14em) scale(0.98)');
      const toTransform = computed.transform === 'none' ? 'none' : computed.transform;
      animations.push(revealElement.animate(styledLinkRevealKeyframes(reveal, Number(computed.opacity) || 1, toTransform), {
        duration: revealTiming.resolvedDurationMs,
        easing: String(reveal.easing || 'ease-out'),
        fill: 'none',
      }));
    }

    const glow = config.glow || {};
    if (
      animate
      && glow.enabled === true
      && glow.trigger === 'reveal'
      && typeof descriptor.element.animate === 'function'
    ) {
      const glowCss = styledLinkGlowCss(glow);
      const peakShadow = glowCss.textShadow || 'none';
      animations.push(descriptor.element.animate([
        { textShadow: '0 0 0 transparent' },
        { textShadow: peakShadow, offset: 0.5 },
        { textShadow: '0 0 0 transparent' },
      ], {
        duration: clamp(Number(glow.durationMs) || 320, 0, 5000),
        easing: String(glow.easing || 'ease-out'),
      }));
    }

    if (animations.length && (options.runtimeManaged === true || options.awaitCompletion === true)) {
      await app.waitForAnimations(animations, options.player?.signal || app.abortController.signal);
    }

    dispatch('styledlink-reveal', {
      noteId: app.currentNote?.id,
      id: descriptor.id,
      href: descriptor.href,
      index: descriptor.index,
      animated: animate,
      timing: {
        timingSource: revealTiming.timingSource,
        effectiveRate: revealTiming.effectiveRate,
        characterBeatMs: revealTiming.characterBeatMs,
        configuredDurationMs: revealTiming.configuredDurationMs,
        configuredDurationBeats: revealTiming.configuredDurationBeats,
        resolvedDurationMs: revealTiming.resolvedDurationMs,
      },
    });
    dispatch('constructor-state', {
      constructor: 'styledlinks',
      id: descriptor.id,
      state: 'revealed',
    });
    if (options.runtimeManaged !== true) {
      descriptor.effectRuntime?.markReached({ player: options.player || null, operation: options.operation || null, phase: 'reveal' });
    }
    return true;
  }

  function constructStyledLinks(root, noteId, app, usedIds = new Set()) {
    const config = app.parameters.renderer.constructors.styledlinks;
    if (!config.enabled) return [];

    const descriptors = [];
    const duplicateCounts = new Map();
    const noteToken = hashString(noteId).slice(0, 8);
    const idPrefix = sanitizeDomId(config.idPrefix || 'tw-link');

    [...root.querySelectorAll('a[href]')].forEach((link, index) => {
      if (link.closest('.tw-codeblock')) return;

      const href = link.getAttribute('href') || '';
      const sourceText = link.textContent || '';
      const fingerprint = hashString(`${href}\u0000${sourceText}`).slice(0, 8);
      const duplicateKey = `${href}\u0000${sourceText}`;
      const occurrence = (duplicateCounts.get(duplicateKey) || 0) + 1;
      duplicateCounts.set(duplicateKey, occurrence);

      const metadata = inlineConstructorMetadata.get(link) || null;
      const markdown = styledLinkMarkdownConfig(metadata);
      const requestedId = metadata?.id || link.id || `${idPrefix}-${noteToken}-${fingerprint}-${occurrence}`;
      const id = uniqueDomId(requestedId, usedIds);
      const originalTarget = link.getAttribute('target');
      const originalRel = link.getAttribute('rel');

      let external = false;
      try {
        const resolved = new URL(href, window.location.href);
        external = /^https?:$/.test(resolved.protocol) && resolved.origin !== window.location.origin;
      } catch (_) {}

      link.id = id;
      link.classList.add('tw-styled-link');
      link.dataset.constructor = 'styledlinks';
      link.dataset.styledLinkId = id;

      // Hover/glow presentation belongs to the anchor while reveal motion owns
      // a child layer. This prevents CSS hover transforms from competing with
      // WAAPI reveal transforms on the same element.
      const revealElement = document.createElement('span');
      revealElement.className = 'tw-styled-link-reveal-layer';
      while (link.firstChild) revealElement.appendChild(link.firstChild);
      link.appendChild(revealElement);

      const descriptor = {
        id,
        index,
        constructor: 'styledlinks',
        href,
        title: link.getAttribute('title') || '',
        sourceText,
        external,
        originalTarget,
        originalRel,
        element: link,
        revealElement,
        revealed: false,
        preset: markdown.preset || config.defaultPreset || 'default',
        markdownMetadata: metadata ? clone(metadata) : null,
        markdownOverride: markdown.override,
        override: {},
        appliedBaseKeys: null,
        appliedHoverKeys: null,
        appliedGlowKeys: null,
        currentConfig: null,
      };

      styledLinkMetadata.set(link, descriptor);
      applyStyledLinkBase(descriptor, app);
      attachConstructorEffectRuntime(app, 'styledlinks', descriptor);

      link.addEventListener('pointerenter', () => setStyledLinkHover(descriptor, app, true));
      link.addEventListener('pointerleave', () => setStyledLinkHover(descriptor, app, false));
      link.addEventListener('focus', () => setStyledLinkHover(descriptor, app, true));
      link.addEventListener('blur', () => setStyledLinkHover(descriptor, app, false));
      link.addEventListener('click', event => {
        const liveConfig = effectiveStyledLinkConfig(app, descriptor);
        const complete = link.textContent === descriptor.sourceText;
        if (liveConfig.behavior?.pointerEnabledWhileTyping === false && !complete) {
          event.preventDefault();
        }
        if (liveConfig.behavior?.open === 'emit-only') {
          event.preventDefault();
        }
        dispatch('styledlink-activate', {
          noteId: app.currentNote?.id,
          id: descriptor.id,
          href: descriptor.href,
          index: descriptor.index,
          complete,
          prevented: event.defaultPrevented,
        });
      });

      descriptors.push(descriptor);
      dispatch('styledlink-constructed', {
        noteId,
        id,
        index,
        href,
        external,
        preset: descriptor.preset,
        markdownMetadata: descriptor.markdownMetadata,
      });
      dispatch('constructor-constructed', {
        noteId,
        constructor: 'styledlinks',
        id,
        index,
      });
    });

    return descriptors;
  }


  function effectiveStrikeoutConfig(app, descriptor) {
    const base = app.parameters.renderer.constructors.strikeout;
    const presetName = descriptor?.preset || base.defaultPreset || 'default';
    return effectiveConstructorConfig(
      base,
      presetName,
      descriptor?.markdownOverride || {},
      descriptor?.override || {},
    );
  }

  function applyStrikeoutBase(descriptor, app) {
    const element = descriptor.element;
    const config = effectiveStrikeoutConfig(app, descriptor);
    descriptor.appliedBaseKeys = applyCssMap(element, config.css, descriptor.appliedBaseKeys);

    const line = config.line || {};
    element.style.setProperty('--tw-strike-color', String(line.color || 'currentColor'));
    element.style.setProperty('--tw-strike-thickness', String(line.thickness || '0.075em'));
    element.style.setProperty('--tw-strike-position', String(line.position || '52%'));

    descriptor.currentConfig = config;
    return config;
  }

  function setStrikeoutDrawn(descriptor, app, drawn) {
    if (!descriptor) return;
    applyStrikeoutBase(descriptor, app);
    descriptor.struck = !!drawn;
    descriptor.element.classList.toggle('is-struck', !!drawn);
    if (descriptor.line) {
      descriptor.line.style.transform = drawn ? 'translateY(-50%) scaleX(1)' : 'translateY(-50%) scaleX(0)';
      descriptor.line.style.opacity = drawn ? '0' : '1';
    }
  }

  function strikeoutVelocityRate(config, app, player, operation) {
    return constructorVelocityRate(config.animation || {}, app, player, operation);
  }

  async function animateStrikeout(descriptor, app, player, operation, options = {}) {
    if (!descriptor) return false;
    const config = applyStrikeoutBase(descriptor, app);
    const animation = config.animation || {};
    const animate = options.animate !== false && animation.enabled !== false;
    const timing = constructorTiming(animation, app, player, operation);
    const velocity = timing.velocity;
    const duration = animate ? timing.resolvedDurationMs : 0;
    const hold = Math.max(0, Number(animation.holdMs) || 0) / velocity.rate;
    descriptor.lastEffectiveRate = velocity.rate;

    descriptor.element.classList.remove('is-struck');
    descriptor.struck = false;
    if (descriptor.line) {
      descriptor.line.style.opacity = '1';
      descriptor.line.style.transform = 'translateY(-50%) scaleX(0)';
    }

    if (animate && duration > 0 && descriptor.line?.animate) {
      const draw = descriptor.line.animate(strikeoutDrawKeyframes(), {
        duration,
        easing: String(animation.easing || 'ease-out'),
        fill: 'forwards',
      });
      await app.waitForAnimations([draw], player?.signal || app.abortController.signal);
    } else if (descriptor.line) {
      descriptor.line.style.transform = 'translateY(-50%) scaleX(1)';
    }

    descriptor.struck = true;
    descriptor.element.classList.add('is-struck');
    if (descriptor.line) descriptor.line.style.opacity = '0';

    if (hold > 0 && player) {
      await app.wait(hold, player.signal);
    }

    dispatch('strikeout-draw', {
      noteId: app.currentNote?.id,
      id: descriptor.id,
      index: descriptor.index,
      preset: descriptor.preset,
      velocity: velocity.mode,
      effectiveRate: velocity.rate,
      durationMs: duration,
      timing: {
        playbackRate: timing.playbackRate,
        effectiveRate: timing.effectiveRate,
        baseCharacterMs: timing.baseCharacterMs,
        characterBeatMs: timing.characterBeatMs,
        configuredDurationMs: timing.configuredDurationMs,
        configuredDurationBeats: timing.configuredDurationBeats,
        minDurationMs: timing.minDurationMs,
        maxDurationMs: timing.maxDurationMs,
        timingSource: timing.timingSource,
        paceScope: timing.paceScope,
        activePageTypers: timing.activePageTypers,
        resolvedDurationMs: timing.resolvedDurationMs,
      },
      animated: animate,
    });
    dispatch('constructor-state', {
      constructor: 'strikeout',
      id: descriptor.id,
      state: 'struck',
    });
    if (options.runtimeManaged !== true) {
      descriptor.effectRuntime?.markReached({ player, operation, phase: 'draw' });
    }
    return true;
  }

  function constructStrikeouts(root, noteId, app, usedIds = new Set()) {
    const config = app.parameters.renderer.constructors.strikeout;
    if (!config.enabled) return [];

    const descriptors = [];
    const noteToken = hashString(noteId).slice(0, 8);
    const idPrefix = sanitizeDomId(config.idPrefix || 'tw-strike');

    [...root.querySelectorAll('del')].forEach((element, index) => {
      if (element.closest('pre, code, .tw-codeblock')) return;

      const metadata = inlineConstructorMetadata.get(element) || null;
      const markdown = strikeoutMarkdownConfig(metadata);
      const sourceText = element.textContent || '';
      const fingerprint = hashString(sourceText).slice(0, 8);
      const requestedId = metadata?.id || element.id || `${idPrefix}-${noteToken}-${fingerprint}-${index + 1}`;
      const id = uniqueDomId(requestedId, usedIds);

      element.id = id;
      element.classList.add('tw-strikeout');
      element.dataset.constructor = 'strikeout';
      element.dataset.strikeoutId = id;

      const line = document.createElement('span');
      line.className = 'tw-strikeout-line';
      line.dataset.twStatic = 'true';
      line.setAttribute('aria-hidden', 'true');
      element.appendChild(line);

      const descriptor = {
        id,
        index,
        constructor: 'strikeout',
        sourceText,
        element,
        line,
        preset: markdown.preset || config.defaultPreset || 'default',
        markdownMetadata: metadata ? clone(metadata) : null,
        markdownOverride: markdown.override,
        override: {},
        appliedBaseKeys: null,
        currentConfig: null,
        struck: false,
      };

      strikeoutMetadata.set(element, descriptor);
      applyStrikeoutBase(descriptor, app);
      attachConstructorEffectRuntime(app, 'strikeout', descriptor);
      setStrikeoutDrawn(descriptor, app, false);
      descriptors.push(descriptor);

      dispatch('strikeout-constructed', {
        noteId,
        id,
        index,
        preset: descriptor.preset,
        markdownMetadata: descriptor.markdownMetadata,
      });
      dispatch('constructor-constructed', {
        noteId,
        constructor: 'strikeout',
        id,
        index,
      });
    });

    return descriptors;
  }

  function effectiveStrongConfig(app, descriptor) {
    const base = app.parameters.renderer.constructors.strong;
    const presetName = descriptor?.preset || base.defaultPreset || 'default';
    return effectiveConstructorConfig(base, presetName, descriptor?.markdownOverride || {}, descriptor?.override || {});
  }

  function applyStrongBase(descriptor, app) {
    const config = effectiveStrongConfig(app, descriptor);
    descriptor.appliedBaseKeys = applyCssMap(descriptor.element, config.css, descriptor.appliedBaseKeys);
    descriptor.currentConfig = config;
    return config;
  }

  async function animateStrongPulse(descriptor, app, player, operation, options = {}) {
    if (!descriptor) return false;
    const config = applyStrongBase(descriptor, app);
    const pulse = config.pulse || {};
    if (pulse.enabled === false || options.animate === false) {
      descriptor.pulsed = true;
      return false;
    }

    const timing = constructorTiming(pulse, app, player, operation);
    const velocity = timing.velocity;
    const duration = timing.resolvedDurationMs;
    descriptor.lastEffectiveRate = velocity.rate;
    const count = clamp(Math.round(Number(pulse.count) || 1), 1, 20);
    const scale = Math.max(0.01, Number(pulse.scale) || 1.08);
    const animate = duration > 0 && typeof descriptor.element.animate === 'function';

    if (animate) {
      const animation = descriptor.element.animate(strongPulseKeyframes(scale), {
        duration,
        iterations: count,
        easing: String(pulse.easing || 'ease-out'),
      });
      if (pulse.blocking === true || options.runtimeManaged === true || options.awaitCompletion === true) {
        await app.waitForAnimations([animation], player?.signal || app.abortController.signal);
      }
    }

    descriptor.pulsed = true;
    dispatch('strong-pulse', {
      noteId: app.currentNote?.id,
      id: descriptor.id,
      index: descriptor.index,
      preset: descriptor.preset,
      velocity: velocity.mode,
      effectiveRate: velocity.rate,
      durationMs: duration,
      timing: {
        playbackRate: timing.playbackRate,
        effectiveRate: timing.effectiveRate,
        baseCharacterMs: timing.baseCharacterMs,
        characterBeatMs: timing.characterBeatMs,
        configuredDurationMs: timing.configuredDurationMs,
        configuredDurationBeats: timing.configuredDurationBeats,
        minDurationMs: timing.minDurationMs,
        maxDurationMs: timing.maxDurationMs,
        timingSource: timing.timingSource,
        paceScope: timing.paceScope,
        activePageTypers: timing.activePageTypers,
        resolvedDurationMs: timing.resolvedDurationMs,
      },
      count,
      animated: animate,
    });
    dispatch('constructor-state', { constructor: 'strong', id: descriptor.id, state: 'pulsed' });
    if (options.runtimeManaged !== true) {
      descriptor.effectRuntime?.markReached({ player, operation, phase: 'pulse' });
    }
    return true;
  }

  function constructStrong(root, noteId, app, usedIds = new Set()) {
    const config = app.parameters.renderer.constructors.strong;
    if (!config.enabled) return [];
    const descriptors = [];
    const noteToken = hashString(noteId).slice(0, 8);
    const idPrefix = sanitizeDomId(config.idPrefix || 'tw-strong');

    [...root.querySelectorAll('strong')].forEach((element, index) => {
      if (element.closest('pre, code, .tw-codeblock')) return;
      const metadata = inlineConstructorMetadata.get(element) || null;
      const markdown = strongMarkdownConfig(metadata);
      const sourceText = element.textContent || '';
      const requestedId = metadata?.id || element.id || `${idPrefix}-${noteToken}-${hashString(sourceText).slice(0, 8)}-${index + 1}`;
      const id = uniqueDomId(requestedId, usedIds);
      element.id = id;
      element.classList.add('tw-strong');
      element.dataset.constructor = 'strong';
      element.dataset.strongId = id;

      const descriptor = {
        id, index, constructor: 'strong', sourceText, element,
        preset: markdown.preset || config.defaultPreset || 'default',
        markdownMetadata: metadata ? clone(metadata) : null,
        markdownOverride: markdown.override,
        override: {}, appliedBaseKeys: null, currentConfig: null, pulsed: false,
      };
      strongMetadata.set(element, descriptor);
      applyStrongBase(descriptor, app);
      attachConstructorEffectRuntime(app, 'strong', descriptor);
      descriptors.push(descriptor);
      dispatch('strong-constructed', { noteId, id, index, preset: descriptor.preset, markdownMetadata: descriptor.markdownMetadata });
      dispatch('constructor-constructed', { noteId, constructor: 'strong', id, index });
    });
    return descriptors;
  }

  function effectiveEmphasisConfig(app, descriptor) {
    const base = app.parameters.renderer.constructors.emphasis;
    const presetName = descriptor?.preset || base.defaultPreset || 'default';
    return effectiveConstructorConfig(base, presetName, descriptor?.markdownOverride || {}, descriptor?.override || {});
  }

  function applyEmphasisBase(descriptor, app) {
    const config = effectiveEmphasisConfig(app, descriptor);
    descriptor.appliedBaseKeys = applyCssMap(descriptor.element, config.css, descriptor.appliedBaseKeys);
    descriptor.currentConfig = config;
    return config;
  }

  function constructEmphasis(root, noteId, app, usedIds = new Set()) {
    const config = app.parameters.renderer.constructors.emphasis;
    if (!config.enabled) return [];
    const descriptors = [];
    const noteToken = hashString(noteId).slice(0, 8);
    const idPrefix = sanitizeDomId(config.idPrefix || 'tw-emphasis');

    [...root.querySelectorAll('em')].forEach((element, index) => {
      if (element.closest('pre, code, .tw-codeblock')) return;
      const metadata = inlineConstructorMetadata.get(element) || null;
      const markdown = emphasisMarkdownConfig(metadata);
      const sourceText = element.textContent || '';
      const requestedId = metadata?.id || element.id || `${idPrefix}-${noteToken}-${hashString(sourceText).slice(0, 8)}-${index + 1}`;
      const id = uniqueDomId(requestedId, usedIds);
      element.id = id;
      element.classList.add('tw-emphasis');
      element.dataset.constructor = 'emphasis';
      element.dataset.emphasisId = id;

      const descriptor = {
        id, index, constructor: 'emphasis', sourceText, element,
        preset: markdown.preset || config.defaultPreset || 'default',
        markdownMetadata: metadata ? clone(metadata) : null,
        markdownOverride: markdown.override,
        override: {}, appliedBaseKeys: null, currentConfig: null,
      };
      emphasisMetadata.set(element, descriptor);
      applyEmphasisBase(descriptor, app);
      descriptors.push(descriptor);
      dispatch('emphasis-constructed', { noteId, id, index, preset: descriptor.preset, markdownMetadata: descriptor.markdownMetadata });
      dispatch('constructor-constructed', { noteId, constructor: 'emphasis', id, index });
    });
    return descriptors;
  }

  function effectiveListItemConfig(app, descriptor) {
    const base = app.parameters.renderer.constructors.lists;
    const presetName = descriptor?.preset || base.defaultPreset || 'default';
    return effectiveConstructorConfig(base, presetName, descriptor?.markdownOverride || {}, descriptor?.override || {});
  }

  function applyListItemBase(descriptor, app) {
    const config = effectiveListItemConfig(app, descriptor);
    descriptor.appliedItemKeys = applyCssMap(descriptor.element, config.itemCss, descriptor.appliedItemKeys);
    descriptor.appliedVignetteKeys = applyCssMap(descriptor.vignetteElement, config.vignette?.css, descriptor.appliedVignetteKeys);
    const explicitText = config.vignette?.text;
    descriptor.vignetteElement.textContent = explicitText !== undefined && explicitText !== null
      ? String(explicitText)
      : descriptor.defaultVignetteText;
    descriptor.currentConfig = config;
    return config;
  }

  async function animateListVignette(descriptor, app, player, operation, phase, options = {}) {
    if (!descriptor) return false;
    const config = applyListItemBase(descriptor, app);
    const vignette = config.vignette || {};
    const trigger = ['start', 'complete'].includes(vignette.trigger) ? vignette.trigger : 'start';
    if (phase !== trigger) return false;

    descriptor[phase === 'start' ? 'started' : 'complete'] = true;
    const mode = ['none', 'pulse', 'rotate', 'pulse-rotate'].includes(vignette.animation)
      ? vignette.animation
      : 'none';
    if (mode === 'none' || options.animate === false) return false;

    const timing = constructorTiming(vignette, app, player, operation);
    const velocity = timing.velocity;
    const duration = timing.resolvedDurationMs;
    descriptor.lastEffectiveRate = velocity.rate;
    const count = clamp(Math.round(Number(vignette.count) || 1), 1, 20);
    const scale = Math.max(0.01, Number(vignette.scale) || 1.18);
    const rotateDeg = Number(vignette.rotateDeg) || 360;
    const marker = descriptor.vignetteElement;
    const keyframes = listVignetteKeyframes(mode, scale, rotateDeg);

    const animate = duration > 0 && typeof marker.animate === 'function';
    if (animate) {
      const animation = marker.animate(keyframes, {
        duration,
        iterations: count,
        easing: String(vignette.easing || 'ease-out'),
      });
      if (vignette.blocking === true || options.runtimeManaged === true || options.awaitCompletion === true) {
        await app.waitForAnimations([animation], player?.signal || app.abortController.signal);
      }
    }

    dispatch('listitem-vignette', {
      noteId: app.currentNote?.id,
      id: descriptor.id,
      index: descriptor.index,
      phase,
      mode,
      velocity: velocity.mode,
      effectiveRate: velocity.rate,
      durationMs: duration,
      timing: {
        playbackRate: timing.playbackRate,
        effectiveRate: timing.effectiveRate,
        baseCharacterMs: timing.baseCharacterMs,
        characterBeatMs: timing.characterBeatMs,
        configuredDurationMs: timing.configuredDurationMs,
        configuredDurationBeats: timing.configuredDurationBeats,
        minDurationMs: timing.minDurationMs,
        maxDurationMs: timing.maxDurationMs,
        timingSource: timing.timingSource,
        paceScope: timing.paceScope,
        activePageTypers: timing.activePageTypers,
        resolvedDurationMs: timing.resolvedDurationMs,
      },
      count,
      animated: animate,
    });
    dispatch('constructor-state', { constructor: 'lists', id: descriptor.id, state: `vignette-${phase}` });
    if (options.runtimeManaged !== true) {
      descriptor.effectRuntime?.markReached({ player, operation, phase });
    }
    return true;
  }

  function constructLists(root, noteId, app, usedIds = new Set()) {
    const config = app.parameters.renderer.constructors.lists;
    if (!config.enabled) return [];
    const descriptors = [];
    const noteToken = hashString(noteId).slice(0, 8);
    const idPrefix = sanitizeDomId(config.idPrefix || 'tw-list-item');
    let globalIndex = 0;

    [...root.querySelectorAll('ul, ol')].forEach(list => {
      const ordered = list.tagName === 'OL';
      const directItems = [...list.children].filter(child => child.tagName === 'LI');
      let counter = ordered ? Number(list.getAttribute('start') || 1) : 0;
      const reversed = ordered && list.hasAttribute('reversed');
      if (reversed && !list.hasAttribute('start')) counter = directItems.length;

      directItems.forEach(item => {
        globalIndex += 1;
        if (ordered && item.hasAttribute('value')) counter = Number(item.getAttribute('value')) || counter;
        const metadata = inlineConstructorMetadata.get(item) || null;
        const markdown = listMarkdownConfig(metadata);
        const sourceText = listItemOwnTextNodes(item).map(node => node.data).join('').trim();
        const requestedId = metadata?.id || item.id || `${idPrefix}-${noteToken}-${hashString(`${sourceText}\u0000${globalIndex}`).slice(0, 8)}-${globalIndex}`;
        const id = uniqueDomId(requestedId, usedIds);
        const task = !![...item.children].find(child => child.matches?.('input[type="checkbox"]'));
        const defaultVignetteText = task
          ? ''
          : (ordered
              ? `${counter}${config.vignette?.orderedSuffix ?? '.'}`
              : String(config.vignette?.unorderedText ?? '•'));

        item.id = id;
        item.classList.add('tw-list-item');
        item.dataset.constructor = 'lists';
        item.dataset.listItemId = id;

        const marker = document.createElement('span');
        marker.className = 'tw-list-vignette';
        marker.dataset.twStatic = 'true';
        marker.setAttribute('aria-hidden', 'true');
        marker.textContent = defaultVignetteText;
        item.insertBefore(marker, item.firstChild);

        const descriptor = {
          id, index: globalIndex - 1, constructor: 'lists', sourceText,
          ordered, number: ordered ? counter : null, task, element: item, vignetteElement: marker,
          defaultVignetteText,
          preset: markdown.preset || config.defaultPreset || 'default',
          markdownMetadata: metadata ? clone(metadata) : null,
          markdownOverride: markdown.override,
          override: {}, appliedItemKeys: null, appliedVignetteKeys: null,
          currentConfig: null, started: false, complete: false,
        };
        listItemMetadata.set(item, descriptor);
        applyListItemBase(descriptor, app);
        attachConstructorEffectRuntime(app, 'lists', descriptor);
        descriptors.push(descriptor);
        dispatch('listitem-constructed', { noteId, id, index: descriptor.index, ordered, number: descriptor.number, preset: descriptor.preset, markdownMetadata: descriptor.markdownMetadata });
        dispatch('constructor-constructed', { noteId, constructor: 'lists', id, index: descriptor.index });

        if (ordered) counter += reversed ? -1 : 1;
      });
    });
    return descriptors;
  }

  const CONSTRUCTOR_ADAPTERS = Object.freeze({
    codeblock: {
      collection: 'currentCodeBlocks',
      listMethod: 'getCodeBlocks',
      construct: constructCodeBlocks,
      apply: applyCodeBlockBase,
    },
    styledlinks: {
      collection: 'currentStyledLinks',
      listMethod: 'getStyledLinks',
      construct: constructStyledLinks,
      apply: applyStyledLinkBase,
      resolve(items, id) {
        return items.find(item => item.id === id || item.href === id) || null;
      },
    },
    strikeout: {
      collection: 'currentStrikeouts',
      listMethod: 'getStrikeouts',
      construct: constructStrikeouts,
      apply: applyStrikeoutBase,
    },
    strong: {
      collection: 'currentStrong',
      listMethod: 'getStrongRuns',
      construct: constructStrong,
      apply: applyStrongBase,
    },
    emphasis: {
      collection: 'currentEmphasis',
      listMethod: 'getEmphasisRuns',
      construct: constructEmphasis,
      apply: applyEmphasisBase,
    },
    lists: {
      collection: 'currentListItems',
      listMethod: 'getListItems',
      construct: constructLists,
      apply: applyListItemBase,
    },
  });

  function constructorAdapter(name) {
    const adapter = CONSTRUCTOR_ADAPTERS[name];
    if (!adapter || !CONSTRUCTOR_DEFINITIONS[name]) {
      throw new Error(`Unknown constructor: ${name}`);
    }
    return adapter;
  }

  /* ========================================================================
   *  Render plan and heading sections
   * ====================================================================== */

  function headingLevel(node) {
    if (node?.nodeType !== Node.ELEMENT_NODE) return null;
    const match = /^H([1-6])$/.exec(node.tagName);
    return match ? Number(match[1]) : null;
  }

  function buildSections(root, parameters) {
    if (parameters.renderer.mode !== 'multi') {
      return [{
        id: 'section-0',
        index: 0,
        level: 0,
        depth: 0,
        heading: null,
        nodes: [...root.childNodes],
        parentId: null,
        previousId: null,
        previousSiblingId: null,
        headingComplete: true,
        complete: false,
      }];
    }

    const allowed = new Set(normalizeHeadingLevels(parameters.renderer.multi.headingLevels));
    const sections = [];
    const stack = [];
    let current = null;

    function createSection(level, heading) {
      while (stack.length && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const parent = stack[stack.length - 1] || null;
      const previous = sections[sections.length - 1] || null;
      const previousSibling = [...sections]
        .reverse()
        .find(section => section.parentId === (parent?.id || null) && section.level === level) || null;

      const section = {
        id: `section-${sections.length}`,
        index: sections.length,
        level,
        depth: parent ? parent.depth + 1 : 0,
        heading,
        nodes: [heading],
        parentId: parent?.id || null,
        previousId: previous?.id || null,
        previousSiblingId: previousSibling?.id || null,
        headingComplete: false,
        complete: false,
      };

      sections.push(section);
      stack.push(section);
      return section;
    }

    for (const node of [...root.childNodes]) {
      const level = headingLevel(node);
      if (level && allowed.has(level)) {
        current = createSection(level, node);
        continue;
      }

      if (!current) {
        current = {
          id: `section-${sections.length}`,
          index: sections.length,
          level: 0,
          depth: 0,
          heading: null,
          nodes: [],
          parentId: null,
          previousId: sections[sections.length - 1]?.id || null,
          previousSiblingId: null,
          headingComplete: true,
          complete: false,
        };
        sections.push(current);
      }

      current.nodes.push(node);
    }

    return sections.length ? sections : [{
      id: 'section-0',
      index: 0,
      level: 0,
      depth: 0,
      heading: null,
      nodes: [],
      parentId: null,
      previousId: null,
      previousSiblingId: null,
      headingComplete: true,
      complete: true,
    }];
  }

  function collectOperations(section) {
    const operations = [];

    function visit(node, inHeading = false) {
      const headingContext = inHeading || node === section.heading;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.data;
        const baseMeta = textMetadata.get(node) || {
          tempo: 1,
          style: { color: null, background: null },
          isCode: isInsideCode(node),
          constructor: null,
          codeIndentDepth: 0,
        };
        const meta = { ...baseMeta };
        const emphasisElement = node.parentElement?.closest?.('.tw-emphasis');
        if (emphasisElement) meta.emphasisDescriptor = emphasisMetadata.get(emphasisElement) || null;
        node.data = '';
        operations.push({
          type: 'text',
          node,
          text,
          meta,
          isHeading: headingContext,
        });
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;

      // Code Blocks are self-contained Typewriter viewports. Their text remains
      // runtime-owned, but the outer document now owns *when the host is
      // introduced*. This keeps parsed descriptors alive without reserving a
      // large visible island before the surrounding page reaches the block.
      if (node.classList.contains('tw-codeblock')) {
        const descriptor = codeBlockMetadata.get(node);
        if (descriptor?.runtimeMode?.startsWith('independent')) {
          operations.push({
            type: 'codeblock-host',
            node,
            meta: { constructor: 'codeblock', descriptor, tempo: 1, isCode: false },
            isHeading: headingContext,
          });
          return;
        }
      }

      // Constructor chrome (labels, copy controls, etc.) is presentation, not
      // source content, and should appear immediately rather than be typed.
      if (node.dataset.twStatic === 'true') return;

      if (node.classList.contains('tw-dynamic')) {
        const meta = dynamicMetadata.get(node);
        if (meta) {
          node.textContent = '';
          operations.push({
            type: meta.kind,
            node,
            meta,
            isHeading: headingContext,
          });
        }
        return;
      }

      const strikeDescriptor = node.classList.contains('tw-strikeout')
        ? strikeoutMetadata.get(node)
        : null;
      const strongDescriptor = node.classList.contains('tw-strong')
        ? strongMetadata.get(node)
        : null;
      const listDescriptor = node.classList.contains('tw-list-item')
        ? listItemMetadata.get(node)
        : null;

      if (listDescriptor) {
        operations.push({
          type: 'listitem-start',
          node,
          meta: { constructor: 'lists', descriptor: listDescriptor, tempo: 1, isCode: false },
          isHeading: headingContext,
        });
      }

      for (const child of [...node.childNodes]) {
        visit(child, headingContext);
      }

      if (strongDescriptor) {
        operations.push({
          type: 'strong-pulse',
          node,
          meta: { constructor: 'strong', descriptor: strongDescriptor, tempo: 1, isCode: false },
          isHeading: headingContext,
        });
      }

      if (strikeDescriptor) {
        operations.push({
          type: 'strikeout',
          node,
          meta: {
            constructor: 'strikeout',
            descriptor: strikeDescriptor,
            tempo: 1,
            isCode: false,
          },
          isHeading: headingContext,
        });
      }

      if (listDescriptor) {
        operations.push({
          type: 'listitem-complete',
          node,
          meta: { constructor: 'lists', descriptor: listDescriptor, tempo: 1, isCode: false },
          isHeading: headingContext,
        });
      }
    }

    for (const node of section.nodes) {
      visit(node, false);
    }

    let headingLastIndex = -1;
    operations.forEach((operation, index) => {
      if (operation.isHeading) headingLastIndex = index;
    });

    return { operations, headingLastIndex };
  }

  /* ========================================================================
   *  Shared playback core + render capacity
   * ====================================================================== */

  class RenderCoordinator {
    constructor(app) {
      this.app = app;
      this.active = 0;
      this.queue = [];
      this.activeByKind = new Map();
    }

    limit() {
      return Math.max(0, Math.round(Number(this.app.parameters.runtime?.maxConcurrentTypers) || 0));
    }

    canGrant() {
      const limit = this.limit();
      return limit === 0 || this.active < limit;
    }

    markActive(kind, delta) {
      const key = String(kind || 'text');
      const next = Math.max(0, (this.activeByKind.get(key) || 0) + delta);
      if (next) this.activeByKind.set(key, next);
      else this.activeByKind.delete(key);
    }

    grant(entry) {
      if (entry.signal?.aborted) {
        entry.reject(abortError());
        return false;
      }
      this.active += 1;
      this.markActive(entry.kind, 1);
      entry.cleanup?.();
      let released = false;
      entry.resolve(() => {
        if (released) return;
        released = true;
        this.active = Math.max(0, this.active - 1);
        this.markActive(entry.kind, -1);
        this.pump();
      });
      return true;
    }

    pump() {
      while (this.queue.length && this.canGrant()) {
        const entry = this.queue.shift();
        if (!entry || entry.signal?.aborted) {
          entry?.cleanup?.();
          entry?.reject?.(abortError());
          continue;
        }
        this.grant(entry);
      }
    }

    acquire(kind = 'text', signal) {
      if (signal?.aborted) return Promise.reject(abortError());
      return new Promise((resolve, reject) => {
        const entry = { kind, signal, resolve, reject, cleanup: null };
        const onAbort = () => {
          const index = this.queue.indexOf(entry);
          if (index >= 0) this.queue.splice(index, 1);
          entry.cleanup?.();
          reject(abortError());
        };
        if (signal) {
          signal.addEventListener('abort', onAbort, { once: true });
          entry.cleanup = () => signal.removeEventListener('abort', onAbort);
        }
        if (this.canGrant()) this.grant(entry);
        else this.queue.push(entry);
      });
    }

    async run(kind, signal, task) {
      const release = await this.acquire(kind, signal);
      try {
        return await task();
      } finally {
        release();
      }
    }

    notifyConfigChanged() {
      this.pump();
    }

    getState() {
      return {
        maxConcurrentTypers: this.limit(),
        activeTypers: this.active,
        queuedTypers: this.queue.length,
        activeByKind: Object.fromEntries(this.activeByKind),
      };
    }
  }

  class PlaybackEngine {
    constructor(app) {
      this.app = app;
    }

    async typeText(options = {}) {
      const {
        node,
        text = '',
        signal,
        kind = 'text',
        startOffset = 0,
        delayAt = () => this.app.parameters.playback.baseCharacterMs,
        isValid = () => true,
        adjustBurstEnd = null,
        onWrite = null,
        onProgress = null,
        extraDelayAfter = null,
      } = options;
      if (!node) return startOffset;

      return this.app.renderCoordinator.run(kind, signal, async () => {
        let index = clamp(Number(startOffset) || 0, 0, text.length);
        if (this.app.fastForward) {
          if (signal?.aborted) throw abortError();
          if (!isValid()) return index;
          node.data += text.slice(index);
          index = text.length;
          onWrite?.(index, true);
          onProgress?.(index);
          return index;
        }
        while (index < text.length) {
          if (signal?.aborted) throw abortError();
          if (!isValid()) return index;
          await this.app.waitIfPaused(signal);
          if (signal?.aborted) throw abortError();
          if (!isValid()) return index;

          const delay = Math.max(0, Number(delayAt(index)) || 0);
          const burst = delay < this.app.parameters.playback.burstThresholdMs;
          if (burst) {
            const count = clamp(
              Math.max(1, Math.floor(16.67 / Math.max(delay, 0.05))),
              1,
              this.app.parameters.playback.maxBurstCharacters,
            );
            let end = Math.min(text.length, index + count);
            if (typeof adjustBurstEnd === 'function') {
              end = clamp(Number(adjustBurstEnd(index, end)) || end, index + 1, text.length);
            }
            node.data += text.slice(index, end);
            index = end;
            onWrite?.(index, true);
            onProgress?.(index);
            const extra = Math.max(0, Number(extraDelayAfter?.(index, true)) || 0);
            if (extra > 0) await this.app.wait(extra, signal);
            else await this.app.nextFrame(signal);
            continue;
          }

          node.data += text[index];
          index += 1;
          onWrite?.(index, false);
          onProgress?.(index);
          const extra = Math.max(0, Number(extraDelayAfter?.(index, false)) || 0);
          await this.app.wait(delay + extra, signal);
        }
        return index;
      });
    }

    async backspace(options = {}) {
      const {
        node,
        signal,
        kind = 'backspace',
        delayAt = () => this.app.parameters.playback.baseCharacterMs,
        isValid = () => true,
        onProgress = null,
      } = options;
      if (!node) return 0;
      return this.app.renderCoordinator.run(kind, signal, async () => {
        if (this.app.fastForward) {
          if (signal?.aborted) throw abortError();
          if (!isValid()) return node.data.length;
          node.data = '';
          onProgress?.(0);
          return 0;
        }
        while (node.data.length) {
          if (signal?.aborted) throw abortError();
          if (!isValid()) return node.data.length;
          await this.app.waitIfPaused(signal);
          if (!isValid()) return node.data.length;
          node.data = node.data.slice(0, -1);
          onProgress?.(node.data.length);
          const delay = Math.max(0, Number(delayAt(node.data.length)) || 0);
          if (delay < this.app.parameters.playback.burstThresholdMs) {
            await this.app.nextFrame(signal);
          } else {
            await this.app.wait(delay, signal);
          }
        }
        return 0;
      });
    }
  }

  /* ========================================================================
   *  Independent code-block runtime
   * ====================================================================== */

  class CodeBlockLoopRuntime {
    constructor(app, blockRuntime, descriptor, parentRuntime = null) {
      this.app = app;
      this.blockRuntime = blockRuntime;
      this.descriptor = descriptor;
      this.parentRuntime = parentRuntime;
      this.children = [];
      this.parentRuntime?.children.push(this);

      this.token = 0;
      this.blockGeneration = 0;
      this.parentScopeGeneration = 0;
      this.scopeGeneration = 0;
      this.scopeAlive = false;
      this.armed = false;
      this.running = false;
      this.cycle = Number(descriptor.cycle) || 0;
      this.completedLines = new Set();
      this.runController = null;
      this.detachParentAbort = null;
    }

    get signal() {
      return this.blockRuntime.signal;
    }

    config() {
      return effectiveCodeBlockLoopConfig(this.app, this.blockRuntime.descriptor, this.descriptor);
    }

    parentScopeValid() {
      if (!this.parentRuntime) return true;
      return this.parentRuntime.scopeAlive
        && this.parentRuntime.scopeGeneration === this.parentScopeGeneration;
    }

    valid(token = this.token, runSignal = this.runController?.signal) {
      return this.scopeAlive
        && this.armed
        && !this.signal.aborted
        && !runSignal?.aborted
        && this.blockGeneration === this.blockRuntime.generation
        && this.blockRuntime.valid(this.blockGeneration)
        && this.parentScopeValid()
        && token === this.token;
    }

    cancelRun() {
      this.detachParentAbort?.();
      this.detachParentAbort = null;
      if (this.runController && !this.runController.signal.aborted) this.runController.abort();
      this.runController = null;
    }

    createRunSignal() {
      this.cancelRun();
      const controller = new AbortController();
      const parentSignal = this.signal;
      if (parentSignal.aborted) {
        controller.abort();
      } else {
        const onAbort = () => controller.abort();
        parentSignal.addEventListener('abort', onAbort, { once: true });
        this.detachParentAbort = () => parentSignal.removeEventListener('abort', onAbort);
      }
      this.runController = controller;
      return controller.signal;
    }

    prepareScope(blockGeneration = this.blockRuntime.generation, parentScopeGeneration = 0) {
      // Structural parents create/destroy scope generations. A child owns its
      // own timers only after the enclosing scope exists.
      this.disarm(true);
      this.blockGeneration = blockGeneration;
      this.parentScopeGeneration = parentScopeGeneration;
      this.scopeGeneration += 1;
      this.scopeAlive = true;
      this.completedLines.clear();
      this.children.forEach(child => child.prepareScope(blockGeneration, this.scopeGeneration));
      if (this.regionComplete()) this.arm();
      return this.getState();
    }

    lineBelongs(lineIndex) {
      return lineIndex >= this.descriptor.startLine && lineIndex <= this.descriptor.endLine;
    }

    observeLineComplete(lineIndex) {
      if (!this.scopeAlive || !this.parentScopeValid()) return;
      if (this.lineBelongs(lineIndex)) this.completedLines.add(lineIndex);
      this.children.forEach(child => child.observeLineComplete(lineIndex));
      if (!this.armed && this.regionComplete()) this.arm();
    }

    regionComplete() {
      if (this.descriptor.endLine < this.descriptor.startLine) return true;
      for (let index = this.descriptor.startLine; index <= this.descriptor.endLine; index += 1) {
        if (!this.completedLines.has(index)) return false;
      }
      return true;
    }

    arm() {
      if (this.descriptor.duplicateSiblingName) return this.getState();
      if (!this.scopeAlive || !this.blockRuntime.valid(this.blockGeneration) || !this.parentScopeValid()) {
        return this.getState();
      }
      this.armed = true;
      return this.start();
    }

    disarm(recursive = true) {
      this.armed = false;
      this.scopeAlive = false;
      this.token += 1;
      this.cancelRun();
      this.running = false;
      this.completedLines.clear();
      if (recursive) this.children.forEach(child => child.disarm(true));
      return this.getState();
    }

    stop() {
      // Stop is local policy. Descendant scopes remain alive because stopping a
      // loop clock does not mutate or destroy the subtree it contains.
      this.token += 1;
      this.cancelRun();
      this.running = false;
      return this.getState();
    }

    beginSubtreeMutation() {
      // Rewriting this loop invalidates only descendants. That includes both
      // nested loop clocks and nested CODE viewports hosted inside this range.
      // Siblings and ancestors keep their independent clocks/lifetimes.
      this.scopeGeneration += 1;
      this.children.forEach(child => child.prepareScope(this.blockGeneration, this.scopeGeneration));
      this.blockRuntime.invalidateChildBlocksInRange(
        this.descriptor.startLine,
        this.descriptor.endLine,
      );
    }

    start() {
      if (this.descriptor.duplicateSiblingName) return this.getState();
      if (!this.scopeAlive || !this.armed || !this.blockRuntime.valid(this.blockGeneration) || !this.parentScopeValid()) {
        return this.getState();
      }
      if (this.running) return this.getState();

      const token = ++this.token;
      const runSignal = this.createRunSignal();
      this.running = true;

      const run = async () => {
        try {
          while (this.valid(token, runSignal)) {
            const config = this.config();
            if (config.enabled === false) return;

            const holdMs = Math.max(0, Number(config.holdMs) || 0);
            if (holdMs > 0) await this.app.waitLoop(holdMs, runSignal);
            if (!this.valid(token, runSignal)) return;

            this.beginSubtreeMutation();
            this.blockRuntime.clearRange(this.descriptor.startLine, this.descriptor.endLine);
            await this.blockRuntime.renderRange(
              this.descriptor.startLine,
              this.descriptor.endLine,
              this.blockGeneration,
              {
                initial: false,
                rate: Math.max(0.01, Number(config.rate) || 1),
                signal: runSignal,
                isValid: () => this.valid(token, runSignal),
                onLineComplete: lineIndex => {
                  this.children.forEach(child => child.observeLineComplete(lineIndex));
                },
              },
            );
            await this.blockRuntime.awaitChildBlocksReadyInRange(
              this.descriptor.startLine,
              this.descriptor.endLine,
              this.blockGeneration,
            );
            if (!this.valid(token, runSignal)) return;

            this.cycle += 1;
            this.descriptor.cycle = this.cycle;
            dispatch('codeblock-loop-cycle', {
              noteId: this.app.currentNote?.id,
              codeBlockId: this.blockRuntime.descriptor.id,
              id: this.descriptor.id,
              name: this.descriptor.name,
              path: this.descriptor.path,
              cycle: this.cycle,
              holdMs,
            });

            if (holdMs === 0) await this.app.nextLoopFrame(runSignal);
          }
        } catch (error) {
          if (!isAbortError(error)) console.error(error);
        } finally {
          if (token === this.token) {
            this.running = false;
            this.cancelRun();
          }
        }
      };

      run();
      return this.getState();
    }

    restart() {
      this.stop();
      return this.start();
    }

    onConfigChanged() {
      const config = this.config();
      if (config.enabled === false) return this.stop();
      if (this.armed) return this.restart();
      return this.getState();
    }

    getState() {
      const config = this.config();
      return {
        id: this.descriptor.id,
        name: this.descriptor.name,
        path: this.descriptor.path,
        parentPath: this.descriptor.parentPath || null,
        depth: this.descriptor.depth,
        armed: this.armed,
        running: this.running,
        scopeAlive: this.scopeAlive,
        cycle: this.cycle,
        blockGeneration: this.blockGeneration,
        scopeGeneration: this.scopeGeneration,
        parentScopeGeneration: this.parentScopeGeneration,
        enabled: config.enabled !== false,
        holdMs: Math.max(0, Number(config.holdMs) || 0),
        rate: Math.max(0.01, Number(config.rate) || 1),
        duplicateSiblingName: !!this.descriptor.duplicateSiblingName,
        childCount: this.children.length,
      };
    }
  }

  class CodeBlockRuntime {
    constructor(app, descriptor) {
      this.app = app;
      this.descriptor = descriptor;
      this.signal = app.abortController.signal;
      this.parentRuntime = descriptor.parentBlock?.runtime || null;
      this.parentGeneration = 0;
      this.scopeActive = !this.parentRuntime;
      this.generation = 0;
      this.initialLinesComplete = new Set();
      this.initialComplete = false;
      this.hasCompletedInitial = false;
      this.cycle = 0;
      this.running = false;
      this.readyPromise = Promise.resolve();
      this.resolveReady = null;
      this.scopeReadyResolved = false;
      this.resetReadyPromise(false);
    }

    resetReadyPromise(resolvePrevious = true) {
      if (resolvePrevious) this.resolveReady?.({ cancelled: true });
      this.scopeReadyResolved = false;
      this.readyPromise = new Promise(resolve => { this.resolveReady = resolve; });
    }

    parentValid() {
      if (!this.parentRuntime) return true;
      return this.scopeActive
        && this.parentRuntime.valid(this.parentGeneration);
    }

    valid(generation) {
      return !this.signal.aborted
        && generation === this.generation
        && this.parentValid();
    }

    config() {
      return effectiveCodeBlockConfig(this.app, this.descriptor);
    }

    childBlocksInRange(startLine, endLine) {
      const index = this.descriptor.runtimeIndex?.childBlocksByHostLine;
      if (!index) {
        return (this.descriptor.childCodeBlocks || []).filter(child => (
          child.hostLineIndex >= startLine && child.hostLineIndex <= endLine
        ));
      }
      const found = [];
      for (const [lineIndex, children] of index.entries()) {
        if (lineIndex >= startLine && lineIndex <= endLine) found.push(...children);
      }
      return found;
    }

    invalidateChildBlocksInRange(startLine, endLine) {
      this.childBlocksInRange(startLine, endLine).forEach(child => {
        child.runtime?.deactivate({ clear: true });
      });
    }

    deactivateChildBlocks() {
      (this.descriptor.childCodeBlocks || []).forEach(child => {
        child.runtime?.deactivate({ clear: true });
      });
    }

    activateChildBlocksAtLine(lineIndex, generation) {
      if (!this.valid(generation)) return [];
      return this.childBlocksInRange(lineIndex, lineIndex).map(child => {
        child.runtime?.activate(generation);
        return child.runtime?.whenReady?.() || Promise.resolve();
      });
    }

    async awaitChildBlocksReadyInRange(startLine, endLine, generation) {
      if (!this.valid(generation)) return;
      const active = this.childBlocksInRange(startLine, endLine)
        .filter(child => child.runtime?.scopeActive);
      await Promise.all(active.map(child => child.runtime?.whenReady?.() || Promise.resolve()));
    }

    clearRange(startLine, endLine) {
      const maxIndex = this.descriptor.lineNodes.length - 1;
      if (maxIndex < 0) return;
      const start = clamp(Number(startLine) || 0, 0, maxIndex);
      const end = clamp(Number(endLine) || 0, start, maxIndex);
      for (let index = start; index <= end; index += 1) {
        restoreCodeLineTextNode(this.descriptor, index, { clear: true });
      }
    }

    clearAll() {
      this.descriptor.lineNodes.forEach((node, index) => {
        restoreCodeLineTextNode(this.descriptor, index, { clear: true });
      });
    }

    lineRate(lineIndex, localRate = 1) {
      const config = this.config();
      const node = this.descriptor.lineNodes[lineIndex];
      const meta = textMetadata.get(node) || {};
      const rates = Array.isArray(config.depthRate) && config.depthRate.length ? config.depthRate : [1];
      const depth = clamp(Number(meta.codeIndentDepth) || 0, 0, rates.length - 1);
      const indentationRate = Math.max(0.01, Number(rates[depth]) || 1);
      return Math.max(0.01, Number(this.app.parameters.playback.rate) || 1)
        * indentationRate
        * Math.max(0.01, Number(localRate) || 1);
    }

    async typeLine(lineIndex, generation, options = {}) {
      const signal = options.signal || this.signal;
      const locallyValid = () => this.valid(generation)
        && !signal?.aborted
        && (typeof options.isValid !== 'function' || options.isValid());
      if (!locallyValid()) return false;
      const node = restoreCodeLineTextNode(this.descriptor, lineIndex, { clear: true });
      const source = this.descriptor.lineSources[lineIndex] || '';
      if (!node) return false;

      const caret = document.createElement('span');
      caret.className = 'tw-caret tw-codeblock-caret';
      caret.setAttribute('aria-hidden', 'true');
      node.parentNode?.appendChild(caret);

      try {
        await this.app.playbackEngine.typeText({
          node,
          text: source,
          signal,
          kind: 'codeblock',
          delayAt: () => Math.max(
            0,
            this.app.parameters.playback.baseCharacterMs / this.lineRate(lineIndex, options.rate),
          ),
          isValid: locallyValid,
        });
      } finally {
        caret.remove();
      }

      if (!locallyValid()) return false;
      applyCodeSyntaxHighlight(this.descriptor, lineIndex);

      // A CODE slot is structurally complete only after its child viewport has
      // completed the first render for this parent generation. We start it now,
      // but do not serialize the parent's following lines behind that child.
      const childReady = this.activateChildBlocksAtLine(lineIndex, generation);
      const notifyComplete = () => {
        if (!locallyValid()) return;
        if (options.initial) this.markInitialLineComplete(lineIndex, generation);
        if (typeof options.onLineComplete === 'function') options.onLineComplete(lineIndex);
      };
      if (childReady.length) {
        Promise.all(childReady)
          .then(notifyComplete)
          .catch(error => { if (!isAbortError(error)) console.error(error); });
      } else {
        notifyComplete();
      }
      return locallyValid();
    }

    async typeRange(startLine, endLine, generation, options = {}) {
      const maxIndex = this.descriptor.lineNodes.length - 1;
      if (maxIndex < 0) return;
      const start = clamp(Number(startLine) || 0, 0, maxIndex);
      const end = clamp(Number(endLine) || 0, start, maxIndex);
      for (let index = start; index <= end; index += 1) {
        if (!this.valid(generation)
          || options.signal?.aborted
          || (typeof options.isValid === 'function' && !options.isValid())) return;
        await this.typeLine(index, generation, options);
      }
    }

    sectionsForRange(startLine, endLine) {
      const sections = [];
      let current = null;
      for (let index = startLine; index <= endLine; index += 1) {
        const line = this.descriptor.lineSources[index] || '';
        const heading = /^\s*(#{1,6})(?:\s+|$)/.exec(line);
        if (heading) {
          current = { depth: heading[1].length, startLine: index, endLine: index };
          sections.push(current);
        } else if (!current) {
          current = { depth: 1, startLine: index, endLine: index, implicit: true };
          sections.push(current);
        } else {
          current.endLine = index;
        }
      }
      return sections;
    }

    async renderRange(startLine, endLine, generation, options = {}) {
      const maxIndex = this.descriptor.lineNodes.length - 1;
      if (maxIndex < 0) return;
      const start = clamp(Number(startLine) || 0, 0, maxIndex);
      const end = clamp(Number(endLine) || 0, start, maxIndex);
      const config = this.config();
      if (config.render === 'indentation') {
        const sections = this.sectionsForRange(start, end);
        const depths = [...new Set(sections.map(section => section.depth))].sort((a, b) => a - b);
        for (const depth of depths) {
          if (!this.valid(generation)) return;
          const tier = sections.filter(section => section.depth === depth);
          await Promise.all(tier.map(section => this.typeRange(
            section.startLine,
            section.endLine,
            generation,
            options,
          )));
        }
        return;
      }
      await this.typeRange(start, end, generation, options);
    }

    prepareLoopTree(generation) {
      (this.descriptor.rootLoops || []).forEach(loop => {
        loop.runtime?.prepareScope(generation, 0);
      });
    }

    markInitialLineComplete(lineIndex, generation) {
      if (!this.valid(generation)) return;
      this.initialLinesComplete.add(lineIndex);
      (this.descriptor.rootLoops || []).forEach(loop => loop.runtime?.observeLineComplete(lineIndex));
    }

    disarmLoops() {
      (this.descriptor.rootLoops || []).forEach(loop => loop.runtime?.disarm(true));
    }

    async renderInitial(generation) {
      const lastLine = this.descriptor.lineNodes.length - 1;
      await this.renderRange(0, lastLine, generation, {
        initial: true,
        rate: 1,
      });
      await this.awaitChildBlocksReadyInRange(0, lastLine, generation);
    }

    activate(parentGeneration) {
      if (!this.parentRuntime) return this.start();
      const creatingScope = !this.scopeActive || this.parentGeneration !== parentGeneration;
      this.parentGeneration = parentGeneration;
      this.scopeActive = true;
      this.descriptor.element.hidden = false;
      if (creatingScope) this.resetReadyPromise(false);
      this.start();
      return this.getState();
    }

    deactivate(options = {}) {
      const clear = options.clear !== false;
      this.disarmLoops();
      this.deactivateChildBlocks();
      this.generation += 1;
      this.running = false;
      this.initialComplete = false;
      if (this.parentRuntime) {
        this.scopeActive = false;
        this.descriptor.element.hidden = true;
      }
      this.resolveReady?.({ cancelled: true });
      this.resolveReady = null;
      this.scopeReadyResolved = false;
      if (clear) this.clearAll();
      return this.getState();
    }

    start() {
      // Root CODE blocks are started by the document. Nested blocks only run
      // while their structural host scope is active in the parent viewport.
      if (this.parentRuntime && !this.scopeActive) return this.getState();
      if (this.parentRuntime && !this.parentRuntime.valid(this.parentGeneration)) {
        this.scopeActive = false;
        return this.getState();
      }

      this.disarmLoops();
      this.deactivateChildBlocks();
      const generation = ++this.generation;
      this.initialLinesComplete.clear();
      this.initialComplete = false;
      this.running = true;
      this.clearAll();
      this.prepareLoopTree(generation);

      const run = async () => {
        try {
          await this.renderInitial(generation);
          if (!this.valid(generation)) return;

          this.initialComplete = true;
          this.hasCompletedInitial = true;
          if (!this.scopeReadyResolved) {
            this.scopeReadyResolved = true;
            this.resolveReady?.({ cancelled: false });
            this.resolveReady = null;
          }
          this.cycle += 1;
          dispatch('codeblock-cycle', {
            noteId: this.app.currentNote?.id,
            id: this.descriptor.id,
            parentCodeBlockId: this.descriptor.parentBlockId,
            codePath: this.descriptor.codePath,
            cycle: this.cycle,
            phase: 'complete',
          });

          const config = this.config();
          const holdMs = Math.max(0, Number(config.holdMs) || 0);
          if (holdMs > 0) {
            await this.app.waitLoop(holdMs, this.signal);
            if (this.valid(generation)) this.start();
          }
        } catch (error) {
          if (!isAbortError(error)) console.error(error);
        } finally {
          if (this.valid(generation) && Math.max(0, Number(this.config().holdMs) || 0) === 0) {
            this.running = false;
          }
        }
      };

      run();
      return this.getState();
    }

    restart() {
      return this.start();
    }

    whenReady() {
      return this.readyPromise;
    }

    getState() {
      return {
        running: this.running,
        scopeActive: this.scopeActive,
        initialComplete: this.initialComplete,
        hasCompletedInitial: this.hasCompletedInitial,
        scopeReadyResolved: this.scopeReadyResolved,
        cycle: this.cycle,
        generation: this.generation,
        parentCodeBlockId: this.descriptor.parentBlockId,
        parentGeneration: this.parentGeneration,
        childCodeBlockCount: this.descriptor.childCodeBlocks?.length || 0,
        activeChildCodeBlocks: (this.descriptor.childCodeBlocks || [])
          .filter(child => child.runtime?.scopeActive).length,
        activeLoops: this.descriptor.loops.filter(loop => loop.runtime?.running).length,
        armedLoops: this.descriptor.loops.filter(loop => loop.runtime?.armed).length,
        treeDepth: this.descriptor.loops.reduce((max, loop) => Math.max(max, loop.depth + 1), 0),
      };
    }
  }

  /* ========================================================================
   *  Typewriter player
   * ====================================================================== */

  class TypewriterPlayer {
    constructor(app, section, operations, headingLastIndex) {
      this.app = app;
      this.section = section;
      this.operations = operations;
      this.headingLastIndex = headingLastIndex;
      this.progress = {
        opIndex: 0,
        charOffset: 0,
        complete: false,
      };
      this.started = false;
      this.caret = document.createElement('span');
      this.caret.className = 'tw-caret';
      this.caret.setAttribute('aria-hidden', 'true');
      this.syncHeadingState();
    }

    get signal() {
      return this.app.abortController.signal;
    }

    getProgress() {
      return {
        opIndex: this.progress.opIndex,
        charOffset: this.progress.charOffset,
        complete: this.progress.complete,
      };
    }

    getVelocityPreset() {
      const multi = this.app.parameters.renderer.multi;
      return multi.velocityPresets?.[multi.headingVelocity]
        || HEADING_VELOCITY_PRESETS[multi.headingVelocity]
        || HEADING_VELOCITY_PRESETS.equality;
    }

    sectionRateMultiplier() {
      if (this.app.parameters.renderer.mode !== 'multi') return 1;
      const preset = this.getVelocityPreset();
      const rates = preset.depthRate || [1];
      const index = clamp(this.section.depth, 0, rates.length - 1);
      const value = Number(rates[index]);
      return Number.isFinite(value) && value > 0 ? value : 1;
    }

    effectivePlaybackRate() {
      // Page playback is resolved by the section scheduler. In document scope,
      // heading-depth rates are relative weights inside one shared page pace
      // budget, so adding concurrent sections does not multiply total throughput.
      // Independent Code Block viewports retain their own local runtime rates.
      const playbackRate = Math.max(0.01, Number(this.app.parameters.playback.rate) || 1);
      const scheduler = this.app.scheduler;
      if (scheduler?.pageRateShare) {
        return Math.max(0.01, playbackRate * scheduler.pageRateShare(this));
      }
      return Math.max(0.01, playbackRate * this.sectionRateMultiplier());
    }

    syncHeadingState() {
      const wasComplete = this.section.headingComplete;
      const nowComplete = this.headingLastIndex < 0 || this.progress.opIndex > this.headingLastIndex || this.progress.complete;
      this.section.headingComplete = nowComplete;
      if (!wasComplete && nowComplete) {
        dispatch('section-heading-complete', {
          noteId: this.app.currentNote?.id,
          sectionId: this.section.id,
          level: this.section.level,
        });
        this.app.scheduler?.notifyStateChange();
      }
    }

    async run() {
      if (this.progress.complete) {
        this.section.complete = true;
        this.removeCaret();
        return;
      }

      this.started = true;
      this.app.activateSectionFlow?.(this.section);
      dispatch('section-start', {
        noteId: this.app.currentNote?.id,
        sectionId: this.section.id,
        level: this.section.level,
        depth: this.section.depth,
      });

      try {
        while (this.progress.opIndex < this.operations.length) {
          this.throwIfAborted();
          await this.app.waitIfPaused(this.signal);

          const operation = this.operations[this.progress.opIndex];
          await this.runOperation(operation);

          this.progress.opIndex += 1;
          this.progress.charOffset = 0;
          this.syncHeadingState();
        }

        this.progress.complete = true;
        this.section.complete = true;
        this.syncHeadingState();
        this.removeCaret();
        this.app.completeSectionFlow?.(this.section);

        dispatch('section-complete', {
          noteId: this.app.currentNote?.id,
          sectionId: this.section.id,
          level: this.section.level,
        });
      } catch (error) {
        if (!isAbortError(error)) throw error;
      }
    }

    async runOperation(operation) {
      this.app.activateProgressiveNode?.(operation.node, this.section);

      if (operation.type === 'codeblock-host') {
        this.removeCaret();
        const descriptor = operation.meta?.descriptor;
        if (descriptor?.element) descriptor.element.hidden = false;
        descriptor?.runtime?.start?.();
        return;
      }

      if (operation.type === 'text') {
        await this.typeTextOperation(operation);
        return;
      }

      if (operation.type === 'typo') {
        await this.runTypo(operation);
        return;
      }

      if (operation.type === 'rotation') {
        this.removeCaret();
        await this.app.rotationController.runOperation(this, operation);
        return;
      }

      if (operation.type === 'heading-line') {
        this.removeCaret();
        const node = operation.node;
        node.className = 'tw-heading-line tw-heading-line-visible';
        node.setAttribute('aria-hidden', 'true');
        return;
      }

      if (operation.type === 'strikeout') {
        this.removeCaret();
        await animateStrikeout(operation.meta?.descriptor, this.app, this, operation);
        return;
      }

      if (operation.type === 'strong-pulse') {
        this.removeCaret();
        await animateStrongPulse(operation.meta?.descriptor, this.app, this, operation);
        return;
      }

      if (operation.type === 'listitem-start') {
        this.removeCaret();
        await animateListVignette(operation.meta?.descriptor, this.app, this, operation, 'start');
        return;
      }

      if (operation.type === 'listitem-complete') {
        this.removeCaret();
        const descriptor = operation.meta?.descriptor;
        if (descriptor) descriptor.complete = true;
        await animateListVignette(descriptor, this.app, this, operation, 'complete');
      }
    }

    prepareDynamicInline(node, style) {
      node.className = 'tw-dynamic-inline';
      if (style?.color) node.style.color = style.color;
      if (style?.background) node.style.backgroundColor = style.background;
    }

    throwIfAborted() {
      if (this.signal.aborted) throw abortError();
    }

    placeCaretAfter(node) {
      if (!node?.parentNode) return;
      node.parentNode.insertBefore(this.caret, node.nextSibling);
    }

    placeCaretInside(container, afterNode = null) {
      if (!container) return;
      if (afterNode?.parentNode === container) {
        container.insertBefore(this.caret, afterNode.nextSibling);
      } else {
        container.appendChild(this.caret);
      }
    }

    removeCaret() {
      this.caret.remove();
    }

    wordLengthAt(text, index) {
      if (!text || index < 0 || index >= text.length || /\s/.test(text[index])) return 0;
      let left = index;
      let right = index;
      while (left > 0 && !/\s/.test(text[left - 1])) left -= 1;
      while (right + 1 < text.length && !/\s/.test(text[right + 1])) right += 1;
      return right - left + 1;
    }

    tempoFactor(tempo, wordLength, isCode) {
      if (isCode || Math.abs(tempo - 1) < 0.0001) return 1;

      if (tempo > 1) {
        const shortWeight = clamp((9 - wordLength) / 8, 0, 1);
        return 1 / (1 + (tempo - 1) * shortWeight);
      }

      const longWeight = clamp((wordLength - 3) / 10, 0, 1);
      return 1 + ((1 / tempo) - 1) * longWeight;
    }

    emphasisTyping(operation) {
      const descriptor = operation?.meta?.emphasisDescriptor;
      if (!descriptor) return null;
      const config = effectiveEmphasisConfig(this.app, descriptor);
      descriptor.currentConfig = config;
      return config.typing || null;
    }

    characterDelay(operation, index) {
      const p = this.app.parameters;
      const rate = this.effectivePlaybackRate(operation);
      const typing = this.emphasisTyping(operation);
      const behavior = ['inherit', 'cursive', 'steady'].includes(typing?.behavior) ? typing.behavior : 'inherit';
      const wordLength = this.wordLengthAt(operation.text, index);
      const factor = behavior === 'steady'
        ? 1
        : this.tempoFactor(operation.meta.tempo || 1, wordLength, operation.meta.isCode);
      const typingRate = Math.max(0.01, Number(typing?.rateMultiplier) || 1);
      let delay = (p.playback.baseCharacterMs * factor) / (rate * typingRate);

      if (behavior === 'cursive' && index > 0) {
        const current = operation.text[index];
        const previous = operation.text[index - 1];
        if (current && previous && !/\s/.test(current) && !/\s/.test(previous)) {
          delay /= Math.max(1, Number(typing?.cursiveLetterRate) || 2.15);
        }
      }

      if (behavior !== 'steady' && !operation.meta.isCode && Math.abs((operation.meta.tempo || 1) - 1) > 0.0001 && delay >= p.playback.burstThresholdMs) {
        const jitter = p.typing.nonNeutralTempoJitter;
        delay *= 1 + ((Math.random() * 2 - 1) * jitter);
      }

      return Math.max(0, delay);
    }

    emphasisBoundaryPause(operation, completedIndex) {
      const typing = this.emphasisTyping(operation);
      if (typing?.behavior !== 'cursive') return 0;
      const text = operation.text || '';
      if (completedIndex <= 0 || completedIndex > text.length) return 0;
      const previous = text[completedIndex - 1];
      const next = text[completedIndex];
      if (!previous || /\s/.test(previous)) return 0;
      if (next !== undefined && !/\s/.test(next)) return 0;
      const rate = this.effectivePlaybackRate(operation) * Math.max(0.01, Number(typing.rateMultiplier) || 1);
      return Math.max(0, Number(typing.cursiveWordPauseMs) || 0) / rate;
    }

    punctuationPause(character, operation = null) {
      if (operation?.meta?.isCode) return 0;
      if (!/[.!?,;:]/.test(character)) return 0;
      return this.app.parameters.typing.punctuationPauseMs / this.effectivePlaybackRate(operation);
    }

    async typeTextOperation(operation) {
      const text = operation.text;
      const startOffset = clamp(this.progress.charOffset, 0, text.length);
      this.placeCaretAfter(operation.node);

      await this.app.playbackEngine.typeText({
        node: operation.node,
        text,
        signal: this.signal,
        kind: 'page',
        startOffset,
        delayAt: index => this.characterDelay(operation, index),
        adjustBurstEnd: (index, proposedEnd) => {
          let end = proposedEnd;
          const typing = this.emphasisTyping(operation);
          if (typing?.behavior === 'cursive' && !/\s/.test(text[index] || '')) {
            for (let probe = index + 1; probe < end; probe += 1) {
              if (/\s/.test(text[probe])) {
                end = probe;
                break;
              }
            }
          }
          for (let probe = index; probe < end; probe += 1) {
            if (/[.!?,;:]/.test(text[probe])) {
              end = probe + 1;
              break;
            }
          }
          return end <= index ? Math.min(text.length, index + 1) : end;
        },
        onWrite: () => {
          this.app.revealStyledLinkForNode(operation.node, { animate: true, player: this, operation });
        },
        onProgress: index => {
          this.progress.charOffset = index;
          this.placeCaretAfter(operation.node);
        },
        extraDelayAfter: index => {
          const last = text[index - 1];
          return this.punctuationPause(last, operation) + this.emphasisBoundaryPause(operation, index);
        },
      });
    }

    async typeIntoNode(textNode, text, meta, startOffset = 0) {
      const synthetic = { text, node: textNode, meta };
      await this.app.playbackEngine.typeText({
        node: textNode,
        text,
        signal: this.signal,
        kind: 'page',
        startOffset,
        delayAt: index => this.characterDelay(synthetic, index),
        // Dynamic inline operations (TYPO and Rotation) do not have the
        // outer text operation that typeTextOperation() owns. Passing the
        // synthetic operation keeps constructor timing context available
        // without referencing an out-of-scope `operation` variable.
        onWrite: () => this.app.revealStyledLinkForNode(textNode, { animate: true, player: this, operation: synthetic }),
      });
    }

    async backspaceTextNode(textNode, meta) {
      await this.app.playbackEngine.backspace({
        node: textNode,
        signal: this.signal,
        kind: 'page',
        delayAt: () => {
          const base = this.app.parameters.playback.baseCharacterMs
            * this.app.parameters.typing.backspaceMultiplier;
          return base / this.effectivePlaybackRate();
        },
      });
    }

    async runTypo(operation) {
      const { node, meta } = operation;
      this.prepareDynamicInline(node, meta.style);
      node.textContent = '';
      const textNode = document.createTextNode('');
      node.appendChild(textNode);
      this.placeCaretInside(node, textNode);

      const typingMeta = {
        tempo: meta.tempo || 1,
        isCode: false,
        style: meta.style,
      };

      const effectiveRate = this.effectivePlaybackRate(operation);
      dispatch('typo-phase', { noteId: this.app.currentNote?.id, sectionId: this.section.id, phase: 'start', wrong: meta.wrong, right: meta.right, effectiveRate });
      await this.typeIntoNode(textNode, meta.wrong, typingMeta);
      dispatch('typo-phase', { noteId: this.app.currentNote?.id, sectionId: this.section.id, phase: 'wrong-complete', wrong: meta.wrong, right: meta.right, effectiveRate });
      await this.app.wait(this.app.parameters.typing.typoHoldMs / effectiveRate, this.signal);
      dispatch('typo-phase', { noteId: this.app.currentNote?.id, sectionId: this.section.id, phase: 'correction-start', wrong: meta.wrong, right: meta.right, effectiveRate });
      await this.backspaceTextNode(textNode, typingMeta);
      await this.typeIntoNode(textNode, meta.right, typingMeta);
      dispatch('typo-phase', { noteId: this.app.currentNote?.id, sectionId: this.section.id, phase: 'complete', wrong: meta.wrong, right: meta.right, effectiveRate });
    }
  }

  /* ========================================================================
   *  Rotative text controller
   * ====================================================================== */

  class RotationController {
    constructor(app) {
      this.app = app;
      this.loopPromises = new Set();
      this.stateByEffect = new Map();
    }

    effectConfig(effect = 'slot') {
      const rotation = this.app.parameters.rotation || {};
      const effects = rotation.effects || {};
      if (effect === 'delete') {
        return {
          speedMs: rotation.speedMs,
          holdMs: effects.delete?.holdMs ?? rotation.holdMs,
          blankHoldMs: effects.delete?.blankHoldMs ?? rotation.blankHoldMs,
          strikeHoldMs: 0,
        };
      }
      if (effect === 'strike') {
        return {
          speedMs: effects.strike?.speedMs ?? rotation.speedMs,
          holdMs: effects.strike?.holdMs ?? rotation.holdMs,
          blankHoldMs: rotation.blankHoldMs,
          strikeHoldMs: effects.strike?.strikeHoldMs ?? ((effects.strike?.holdMs ?? rotation.holdMs) * (rotation.strikeHoldRatio || 0.4)),
        };
      }
      return {
        speedMs: effects.slot?.speedMs ?? rotation.speedMs,
        holdMs: effects.slot?.holdMs ?? rotation.holdMs,
        blankHoldMs: rotation.blankHoldMs,
        strikeHoldMs: 0,
      };
    }

    timing(player, operation = null) {
      const effect = operation?.meta?.effect || operation?.effect || 'slot';
      const config = this.effectConfig(effect);
      const playbackRate = Math.max(0.01, Number(this.app.parameters.playback.rate) || 1);
      const effectiveRate = Math.max(0.01, Number(player?.effectivePlaybackRate?.(operation)) || playbackRate);
      const baseCharacterMs = Math.max(0, Number(this.app.parameters.playback.baseCharacterMs) || 0);
      return {
        effect,
        playbackRate,
        effectiveRate,
        baseCharacterMs,
        characterBeatMs: baseCharacterMs / effectiveRate,
        configuredTransitionMs: Math.max(0, Number(config.speedMs) || 0),
        transitionMs: Math.max(20, (Number(config.speedMs) || 500) / effectiveRate),
        // Holds remain literal visible time while motion follows the owner cadence.
        holdMs: Math.max(0, Number(config.holdMs) || 0),
        blankHoldMs: Math.max(0, Number(config.blankHoldMs) || 0),
        strikeHoldMs: Math.max(0, Number(config.strikeHoldMs) || 0),
      };
    }

    getState() {
      return Object.fromEntries([...this.stateByEffect.entries()].map(([effect, state]) => [effect, { ...state, timing: state.timing ? { ...state.timing } : null }]));
    }

    emitCycle(operation, meta, word, cycle, timing, phase = 'complete') {
      this.stateByEffect.set(meta.effect, {
        effect: meta.effect,
        repeat: meta.repeat === true,
        word,
        cycle,
        phase,
        active: true,
        timing: { ...timing },
      });
      dispatch('rotation-cycle', {
        noteId: this.app.currentNote?.id,
        effect: meta.effect,
        repeat: meta.repeat === true,
        word,
        cycle,
        phase,
        timing: { ...timing },
      });
    }

    ensureSlot(marker, words, style = {}) {
      if (marker.classList.contains('rotation-slot')) return marker;

      marker.className = 'rotation-slot';
      marker.textContent = '';
      marker.setAttribute('aria-live', 'off');
      if (style?.color) marker.style.color = style.color;

      const sizer = document.createElement('span');
      sizer.className = 'rotation-slot-sizer';
      sizer.setAttribute('aria-hidden', 'true');
      for (const word of words.length ? words : ['']) {
        const item = document.createElement('span');
        item.textContent = word || '\u00a0';
        sizer.appendChild(item);
      }

      const inner = document.createElement('span');
      inner.className = 'rotation-slot-inner';

      marker.append(sizer, inner);
      marker._twInner = inner;
      marker._twStyle = style || {};
      marker._twWords = words;
      return marker;
    }

    createFace(slot, word, incoming = false, withCaret = false) {
      const face = document.createElement('span');
      face.className = `rotation-face ${incoming ? 'rotation-face-incoming' : 'rotation-face-current'}`;
      if (slot._twStyle?.background) {
        face.style.backgroundColor = slot._twStyle.background;
      }

      const text = document.createTextNode(word);
      face.appendChild(text);
      if (withCaret) {
        const caret = document.createElement('span');
        caret.className = 'tw-rotation-caret';
        caret.setAttribute('aria-hidden', 'true');
        face.appendChild(caret);
      }
      return face;
    }

    currentFace(slot) {
      return slot._twInner?.querySelector('.rotation-face-current') || null;
    }

    setWord(slot, word, withCaret = false) {
      const inner = slot._twInner;
      if (!inner) return;
      inner.textContent = '';
      inner.appendChild(this.createFace(slot, word, false, withCaret));
      slot.dataset.currentWord = word;
      slot.setAttribute('aria-label', word);
    }

    setStrike(slot, enabled) {
      const face = this.currentFace(slot);
      if (!face) return;
      let strike = face.querySelector('.rotation-strike');
      if (enabled && !strike) {
        strike = document.createElement('span');
        strike.className = 'rotation-strike is-drawn';
        face.appendChild(strike);
      } else if (!enabled && strike) {
        strike.remove();
      }
    }

    async typeWord(player, slot, word, meta) {
      const inner = slot._twInner;
      inner.textContent = '';
      const face = this.createFace(slot, '', false, true);
      inner.appendChild(face);
      const textNode = face.firstChild;
      const typingMeta = {
        tempo: meta.tempo || 1,
        isCode: false,
        style: meta.style,
      };
      await player.typeIntoNode(textNode, word, typingMeta);
      face.querySelector('.tw-rotation-caret')?.remove();
      slot.dataset.currentWord = word;
      slot.setAttribute('aria-label', word);
    }

    async deleteWord(player, slot, meta) {
      const face = this.currentFace(slot);
      if (!face) return;
      const textNode = face.firstChild;
      const caret = document.createElement('span');
      caret.className = 'tw-rotation-caret';
      caret.setAttribute('aria-hidden', 'true');
      face.appendChild(caret);
      const typingMeta = {
        tempo: meta.tempo || 1,
        isCode: false,
        style: meta.style,
      };
      await player.backspaceTextNode(textNode, typingMeta);
      caret.remove();
      slot.dataset.currentWord = '';
      slot.setAttribute('aria-label', '');
    }

    async cubeTo(slot, nextWord, signal, timing = null) {
      const inner = slot._twInner;
      let outgoing = this.currentFace(slot);
      if (!outgoing) {
        this.setWord(slot, nextWord, false);
        return;
      }

      const oldCaret = outgoing.querySelector('.tw-rotation-caret');
      if (oldCaret) oldCaret.remove();

      const incoming = this.createFace(slot, nextWord, true, false);
      inner.appendChild(incoming);

      const duration = timing?.transitionMs ?? this.timing(null).transitionMs;
      const easing = 'cubic-bezier(.42, 0, .18, 1)';

      const outAnimation = outgoing.animate([
        { transform: 'translateY(0) rotateX(0deg)' },
        { transform: 'translateY(70%) rotateX(90deg)' },
      ], { duration, easing, fill: 'forwards' });

      const inAnimation = incoming.animate([
        { transform: 'translateY(-70%) rotateX(-90deg)' },
        { transform: 'translateY(0) rotateX(0deg)' },
      ], { duration, easing, fill: 'forwards' });

      await this.app.waitForAnimations([outAnimation, inAnimation], signal);
      outgoing.remove();
      incoming.classList.remove('rotation-face-incoming');
      incoming.classList.add('rotation-face-current');
      incoming.style.transform = 'translateY(0) rotateX(0deg)';
      slot.dataset.currentWord = nextWord;
      slot.setAttribute('aria-label', nextWord);
    }

    async animateStrike(slot, signal, timing = null) {
      const face = this.currentFace(slot);
      if (!face) return;
      let strike = face.querySelector('.rotation-strike');
      if (!strike) {
        strike = document.createElement('span');
        strike.className = 'rotation-strike';
        face.appendChild(strike);
      }

      const transitionMs = timing?.transitionMs ?? this.timing(null).transitionMs;
      const duration = Math.max(36, Math.round(transitionMs * 0.72));
      const animation = strike.animate([
        { transform: 'scaleX(0)' },
        { transform: 'scaleX(1)' },
      ], { duration, easing: 'ease-out', fill: 'forwards' });
      await this.app.waitForAnimations([animation], signal);
      strike.classList.add('is-drawn');
      strike.style.transform = 'scaleX(1)';
    }

    clearStrike(slot) {
      this.currentFace(slot)?.querySelector('.rotation-strike')?.remove();
    }

    runDetached(task) {
      const promise = task().catch(error => {
        if (!isAbortError(error)) console.error(error);
      }).finally(() => this.loopPromises.delete(promise));
      this.loopPromises.add(promise);
    }

    startLoop(slot, meta, startIndex = 1, player = null, operation = null) {
      const words = meta.words || [];
      if (words.length < 2) return;

      const loopPlayer = player || this.app.createUtilityPlayer();
      this.runDetached(async () => {
        let index = startIndex % words.length;
        let cycle = 0;
        while (!this.app.abortController.signal.aborted) {
          const timing = this.timing(loopPlayer, operation);
          await this.app.waitLoop(timing.holdMs, this.app.abortController.signal);
          await this.app.waitIfPaused(this.app.abortController.signal);

          const next = words[index];
          if (meta.effect === 'slot') {
            await this.cubeTo(slot, next, this.app.abortController.signal, timing);
          } else if (meta.effect === 'delete') {
            await this.deleteWord(loopPlayer, slot, meta);
            await this.app.waitLoop(timing.blankHoldMs, this.app.abortController.signal);
            await this.typeWord(loopPlayer, slot, next, meta);
          } else if (meta.effect === 'strike') {
            await this.animateStrike(slot, this.app.abortController.signal, timing);
            await this.app.waitLoop(timing.strikeHoldMs, this.app.abortController.signal);
            await this.deleteWord(loopPlayer, slot, meta);
            this.clearStrike(slot);
            await this.typeWord(loopPlayer, slot, next, meta);
          }

          cycle += 1;
          this.emitCycle(operation, meta, next, cycle, timing);
          index = (index + 1) % words.length;
        }
      });
    }

    async runOperation(player, operation) {
      const meta = operation.meta;
      const words = meta.words || [];
      if (!words.length) return;

      const slot = this.ensureSlot(operation.node, words, meta.style);
      await this.typeWord(player, slot, words[0], meta);

      if (meta.repeat) {
        this.startLoop(slot, meta, 1, player, operation);
        return;
      }

      for (let index = 1; index < words.length; index += 1) {
        const timing = this.timing(player, operation);
        await this.app.wait(timing.holdMs, player.signal);
        const next = words[index];

        if (meta.effect === 'slot') {
          await this.cubeTo(slot, next, player.signal, timing);
        } else if (meta.effect === 'delete') {
          await this.deleteWord(player, slot, meta);
          await this.app.wait(timing.blankHoldMs, player.signal);
          await this.typeWord(player, slot, next, meta);
        } else if (meta.effect === 'strike') {
          await this.animateStrike(slot, player.signal, timing);
          await this.app.wait(timing.strikeHoldMs, player.signal);
          await this.deleteWord(player, slot, meta);
          this.clearStrike(slot);
          await this.typeWord(player, slot, next, meta);
        }
        this.emitCycle(operation, meta, next, index, timing);
      }

      if (meta.effect === 'strike') {
        const timing = this.timing(player, operation);
        await this.app.wait(timing.holdMs, player.signal);
        await this.animateStrike(slot, player.signal, timing);
        this.emitCycle(operation, meta, words.at(-1), words.length, timing, 'final-strike');
      }
    }
  }

  /* ========================================================================
   *  Heading-aware scheduler
   * ====================================================================== */

  class SectionScheduler {
    constructor(app, sections) {
      this.app = app;
      this.sections = sections;
      this.signal = app.abortController.signal;
      this.cancelled = this.signal.aborted;
      this.pending = new Set(sections.filter(section => !section.player.progress.complete));
      this.active = new Set();
      this.donePromise = null;
      this.resolveDone = null;
      this.startTimer = null;
      this.signal.addEventListener?.('abort', () => {
        this.cancelled = true;
        this.pending.clear();
        this.resolveDone?.({ cancelled: true });
        this.resolveDone = null;
      }, { once: true });
    }

    get preset() {
      const multi = this.app.parameters.renderer.multi;
      return multi.velocityPresets?.[multi.headingVelocity]
        || HEADING_VELOCITY_PRESETS[multi.headingVelocity]
        || HEADING_VELOCITY_PRESETS.equality;
    }

    sectionById(id) {
      return this.sections.find(section => section.id === id) || null;
    }

    activePagePlayers() {
      return [...this.active]
        .map(section => section?.player)
        .filter(Boolean);
    }

    pageRateShare(player) {
      const ownWeight = Math.max(0.01, Number(player?.sectionRateMultiplier?.()) || 1);
      const scope = this.app.parameters.playback?.rateScope === 'section' ? 'section' : 'document';
      if (scope === 'section' || this.app.parameters.renderer.mode !== 'multi') return ownWeight;

      const players = this.activePagePlayers();
      if (!players.length) return 1;
      const totalWeight = players.reduce((sum, activePlayer) => (
        sum + Math.max(0.01, Number(activePlayer.sectionRateMultiplier?.()) || 1)
      ), 0);
      return ownWeight / Math.max(ownWeight, totalWeight);
    }

    getState() {
      const players = this.activePagePlayers();
      const totalWeight = players.reduce((sum, player) => (
        sum + Math.max(0.01, Number(player.sectionRateMultiplier?.()) || 1)
      ), 0);
      return {
        mode: this.app.parameters.renderer.mode,
        rateScope: this.app.parameters.playback?.rateScope === 'section' ? 'section' : 'document',
        activeSections: this.active.size,
        pendingSections: this.pending.size,
        activeWeight: totalWeight,
      };
    }

    canStart(section) {
      if (this.app.parameters.renderer.mode !== 'multi') return true;

      const policy = this.preset.startPolicy;
      if (policy === 'immediate') return true;

      if (policy === 'previous-heading') {
        if (!section.previousId) return true;
        const previous = this.sectionById(section.previousId);
        return !previous || previous.headingComplete;
      }

      if (policy === 'hierarchical') {
        // Main/root headings establish themselves immediately. Nested headings
        // wait for their parent heading and the preceding sibling heading.
        if (!section.parentId) return true;
        const parent = this.sectionById(section.parentId);
        if (parent && !parent.headingComplete) return false;

        if (section.previousSiblingId) {
          const sibling = this.sectionById(section.previousSiblingId);
          if (sibling && !sibling.headingComplete) return false;
        }
        return true;
      }

      return true;
    }

    concurrencyAvailable() {
      const limit = Number(this.app.parameters.renderer.multi.maxConcurrent) || 0;
      return limit <= 0 || this.active.size < limit;
    }

    async run() {
      if (!this.donePromise) {
        this.donePromise = new Promise(resolve => {
          this.resolveDone = resolve;
        });
      }

      if (this.cancelled) {
        this.pending.clear();
        this.resolveDone?.({ cancelled: true });
        this.resolveDone = null;
        return this.donePromise;
      }
      this.notifyStateChange();
      this.checkDone();
      return this.donePromise;
    }

    notifyStateChange() {
      if (this.signal.aborted || this.cancelled) return;
      queueMicrotask(() => this.tryStart());
    }

    tryStart() {
      if (this.signal.aborted || this.cancelled) return;

      let startedAny = false;
      for (const section of [...this.pending]) {
        if (!this.concurrencyAvailable()) break;
        if (!this.canStart(section)) continue;

        this.pending.delete(section);
        this.active.add(section);
        this.app.activateSectionFlow?.(section);
        startedAny = true;

        const stagger = Math.max(0, Number(this.app.parameters.renderer.multi.staggerMs) || 0);
        const start = async () => {
          if (stagger > 0) {
            await this.app.wait(stagger * section.index, this.signal);
          }
          await section.player.run();
        };

        start().catch(error => {
          if (!isAbortError(error)) console.error(error);
        }).finally(() => {
          this.active.delete(section);
          this.notifyStateChange();
          this.checkDone();
        });
      }

      if (!startedAny) this.checkDone();
    }

    checkDone() {
      if (this.pending.size === 0 && this.active.size === 0) {
        this.resolveDone?.();
        this.resolveDone = null;
      }
    }
  }

  /* ========================================================================
   *  Main application
   * ====================================================================== */

  function runConstructorTransientEffect(name, descriptor, app, player, operation, phase = null, options = {}) {
    if (!descriptor) return Promise.resolve(false);
    const effect = options.effect || defaultConstructorEffectChannel(name);
    if (name === 'styledlinks' && effect === 'reveal') {
      descriptor.revealed = false;
      descriptor.element.classList.remove('tw-styled-link-revealed');
      return revealStyledLink(descriptor, app, { ...options, player, operation });
    }
    if (name === 'strikeout' && effect === 'animation') return animateStrikeout(descriptor, app, player, operation, options);
    if (name === 'strong' && effect === 'pulse') {
      descriptor.pulsed = false;
      return animateStrongPulse(descriptor, app, player, operation, options);
    }
    if (name === 'lists' && effect === 'vignette') {
      const trigger = phase || (effectiveListItemConfig(app, descriptor).vignette?.trigger === 'complete' ? 'complete' : 'start');
      return animateListVignette(descriptor, app, player, operation, trigger, options);
    }
    throw new Error(`Constructor ${name} effect ${effect} has no replayable transient animation.`);
  }

  class MarkdownTypewriterApp {
    constructor() {
      this.output = HOST_MODE ? null : $('#output');
      this.boundOutputs = new WeakSet();
      this.parameters = this.loadInitialParameters();
      this.abortController = new AbortController();
      this.renderCoordinator = new RenderCoordinator(this);
      this.playbackEngine = new PlaybackEngine(this);
      this.rotationController = new RotationController(this);
      this.codeBlocksById = new Map();
      this.codeBlocksByCopyId = new Map();
      this.constructorIndexes = new Map();
      this.paused = false;
      this.pauseWaiters = [];
      this.currentNote = null;
      this.runTiming = null;
      this.pauseStartedAtMs = null;
      this.accumulatedPausedMs = 0;
      this.fastForward = false;
      this.sections = [];
      this.scheduler = null;
      this.rendererDirty = false;
      this.noteSpecificParameters = {};
      Object.values(CONSTRUCTOR_ADAPTERS).forEach(adapter => {
        this[adapter.collection] = [];
      });

      if (!HOST_MODE) {
        this.bindUi();
        this.bindConstructorUi();
        this.applyPresentation();
        this.installDropZone();
      }
    }

    mount(output) {
      if (!(output instanceof Element)) throw new TypeError('mount() requires an output element.');
      this.output = output;
      this.output.classList.add('markdown-output');
      this.bindConstructorUi();
      return output;
    }

    unmount() {
      this.stopCurrentRun();
      this.output?.classList.remove('is-paused');
      this.output = null;
    }

    loadInitialParameters() {
      // Runtime configuration is intentionally ephemeral. Host applications may
      // call configure() or loadNote({ parameters }) after boot, but this engine
      // does not restore configuration or render state from browser storage.
      return this.validateParameters(clone(DEFAULT_PARAMETERS));
    }

    validateParameters(input) {
      const parameters = deepMerge(DEFAULT_PARAMETERS, input || {});
      parameters.playback.rate = clamp(
        Number(parameters.playback.rate) || 1,
        parameters.playback.minRate,
        parameters.playback.maxRate,
      );
      parameters.playback.rateScope = parameters.playback.rateScope === 'section' ? 'section' : 'document';
      parameters.runtime = isPlainObject(parameters.runtime) ? parameters.runtime : {};
      parameters.runtime.maxConcurrentTypers = clamp(
        Math.round(Number(parameters.runtime.maxConcurrentTypers) || 0),
        0,
        256,
      );
      parameters.presentation.textSize = clamp(Number(parameters.presentation.textSize) || 22, 10, 96);
      parameters.rotation.speedMs = clamp(Number(parameters.rotation.speedMs) || 500, 20, 5000);
      parameters.rotation.holdMs = clamp(Number(parameters.rotation.holdMs) || 1000, 0, 20_000);
      parameters.rotation.blankHoldMs = clamp(Number(parameters.rotation.blankHoldMs) || 250, 0, 20_000);
      parameters.rotation.strikeHoldRatio = clamp(Number(parameters.rotation.strikeHoldRatio) || 0.4, 0, 4);
      parameters.rotation.effects = isPlainObject(parameters.rotation.effects) ? parameters.rotation.effects : {};
      const rotationEffects = parameters.rotation.effects;
      rotationEffects.slot = isPlainObject(rotationEffects.slot) ? rotationEffects.slot : {};
      rotationEffects.delete = isPlainObject(rotationEffects.delete) ? rotationEffects.delete : {};
      rotationEffects.strike = isPlainObject(rotationEffects.strike) ? rotationEffects.strike : {};
      const optionalRotationNumber = (value, min, max) => {
        if (value === null || value === undefined || value === '') return null;
        const numeric = Number(value);
        return Number.isFinite(numeric) ? clamp(numeric, min, max) : null;
      };
      rotationEffects.slot.speedMs = optionalRotationNumber(rotationEffects.slot.speedMs, 20, 5000);
      rotationEffects.slot.holdMs = optionalRotationNumber(rotationEffects.slot.holdMs, 0, 20_000);
      rotationEffects.delete.holdMs = optionalRotationNumber(rotationEffects.delete.holdMs, 0, 20_000);
      rotationEffects.delete.blankHoldMs = optionalRotationNumber(rotationEffects.delete.blankHoldMs, 0, 20_000);
      rotationEffects.strike.speedMs = optionalRotationNumber(rotationEffects.strike.speedMs, 20, 5000);
      rotationEffects.strike.holdMs = optionalRotationNumber(rotationEffects.strike.holdMs, 0, 20_000);
      rotationEffects.strike.strikeHoldMs = optionalRotationNumber(rotationEffects.strike.strikeHoldMs, 0, 20_000);
      parameters.renderer.mode = parameters.renderer.mode === 'multi' ? 'multi' : 'single';
      parameters.renderer.flow = isPlainObject(parameters.renderer.flow) ? parameters.renderer.flow : {};
      parameters.renderer.flow.progressiveLayout = parameters.renderer.flow.progressiveLayout !== false;
      parameters.renderer.flow.pendingSections = parameters.renderer.flow.pendingSections === 'reserve' ? 'reserve' : 'collapse';
      parameters.renderer.flow.pendingBlocks = parameters.renderer.flow.pendingBlocks === 'reserve' ? 'reserve' : 'collapse';
      parameters.renderer.flow.bridge = parameters.renderer.flow.bridge !== false;
      parameters.renderer.flow.preserveScrollAnchor = parameters.renderer.flow.preserveScrollAnchor !== false;
      parameters.renderer.multi.headingLevels = normalizeHeadingLevels(parameters.renderer.multi.headingLevels);
      if (!parameters.renderer.multi.velocityPresets?.[parameters.renderer.multi.headingVelocity]) {
        parameters.renderer.multi.headingVelocity = 'equality';
      }

      const normalizeCodeBlockShape = (config, partial = false) => {
        if (!isPlainObject(config)) return {};
        if (!partial || 'velocity' in config) config.velocity = 'indentation';

        if (!partial || 'tabSize' in config) {
          config.tabSize = clamp(Number(config.tabSize) || 4, 1, 16);
        }
        if (!partial || 'indentUnit' in config) {
          const fallbackTabSize = Number(config.tabSize) || 4;
          if (config.indentUnit !== 'auto') {
            config.indentUnit = clamp(Number(config.indentUnit) || fallbackTabSize, 1, 16);
          }
        }
        if (!partial || 'depthRate' in config) {
          config.depthRate = (Array.isArray(config.depthRate) ? config.depthRate : [1])
            .map(value => Math.max(0.01, Number(value) || 1));
          if (!config.depthRate.length) config.depthRate = [1];
        }
        if (!partial || 'holdMs' in config) {
          config.holdMs = clamp(Number(config.holdMs) || 0, 0, 86_400_000);
        }
        if (!partial || 'render' in config) {
          config.render = config.render === 'indentation' ? 'indentation' : 'sequence';
        }
        if (!partial || 'loopDefaults' in config) {
          config.loopDefaults = isPlainObject(config.loopDefaults) ? config.loopDefaults : {};
          config.loopDefaults.enabled = config.loopDefaults.enabled !== false;
          config.loopDefaults.holdMs = clamp(Number(config.loopDefaults.holdMs) || 1000, 0, 86_400_000);
          config.loopDefaults.rate = Math.max(0.01, Number(config.loopDefaults.rate) || 1);
        }
        if ('loops' in config) {
          config.loops = isPlainObject(config.loops) ? config.loops : {};
          Object.values(config.loops).forEach(loop => {
            if (!isPlainObject(loop)) return;
            if ('enabled' in loop) loop.enabled = loop.enabled !== false;
            if ('holdMs' in loop) loop.holdMs = clamp(Number(loop.holdMs) || 0, 0, 86_400_000);
            if ('rate' in loop) loop.rate = Math.max(0.01, Number(loop.rate) || 1);
          });
        }

        if ('css' in config) config.css = normalizeCssMap(config.css);
        if ('headerCss' in config) config.headerCss = normalizeCssMap(config.headerCss);
        if ('codeCss' in config) config.codeCss = normalizeCssMap(config.codeCss);

        if (config.copyButton) {
          const copy = config.copyButton;
          if (!partial || 'enabled' in copy) copy.enabled = copy.enabled !== false;
          if (!partial || 'feedbackMs' in copy) {
            copy.feedbackMs = clamp(Number(copy.feedbackMs) || 1200, 0, 10_000);
          }
          if (!partial || 'mode' in copy) copy.mode = copy.mode === 'visible' ? 'visible' : 'source';
          if (!partial || 'label' in copy) copy.label = String(copy.label || 'Copy');
          if (!partial || 'copiedLabel' in copy) copy.copiedLabel = String(copy.copiedLabel || 'Copied');
          if ('css' in copy) copy.css = normalizeCssMap(copy.css);
        }
        return config;
      };
      const codeblock = parameters.renderer.constructors.codeblock;
      codeblock.enabled = codeblock.enabled !== false;
      codeblock.defaultPreset = String(codeblock.defaultPreset || 'default');
      codeblock.presets = isPlainObject(codeblock.presets) ? codeblock.presets : { default: {} };
      Object.values(codeblock.presets).forEach(preset => normalizeCodeBlockShape(preset, true));
      normalizeCodeBlockShape(codeblock, false);
      if (!codeblock.presets[codeblock.defaultPreset]) codeblock.defaultPreset = 'default';

      const normalizeStyledLinkShape = config => {
        if (!isPlainObject(config)) return {};
        if ('css' in config) config.css = normalizeCssMap(config.css);
        if (config.reveal) {
          config.reveal.enabled = config.reveal.enabled !== false;
          config.reveal.durationMs = clamp(Number(config.reveal.durationMs) || 220, 0, 5000);
          config.reveal.durationBeats = clamp(Number(config.reveal.durationBeats) || 0, 0, 64);
          config.reveal.minDurationMs = clamp(Number(config.reveal.minDurationMs) || 100, 0, 2000);
          config.reveal.maxDurationMs = clamp(Number(config.reveal.maxDurationMs) || 900, config.reveal.minDurationMs, 60_000);
          config.reveal.velocity = ['inherit', 'playback', 'fixed'].includes(config.reveal.velocity) ? config.reveal.velocity : 'inherit';
          config.reveal.velocityMultiplier = Math.max(0.01, Number(config.reveal.velocityMultiplier) || 1);
          config.reveal.fromOpacity = clamp(Number(config.reveal.fromOpacity ?? 0), 0, 1);
          config.reveal.fromTransform = String(config.reveal.fromTransform || 'translateY(0.14em) scale(0.98)');
          config.reveal.easing = String(config.reveal.easing || 'ease-out');
          config.reveal.loop = normalizeConstructorEffectLoop(config.reveal.loop, 1800);
        }
        if (config.hover) {
          config.hover.enabled = config.hover.enabled !== false;
          config.hover.durationMs = clamp(Number(config.hover.durationMs) || 150, 0, 5000);
          config.hover.scale = Math.max(0.01, Number(config.hover.scale) || 1);
          config.hover.translateYEm = Number(config.hover.translateYEm) || 0;
          config.hover.easing = String(config.hover.easing || 'ease-out');
          config.hover.css = normalizeCssMap(config.hover.css);
        }
        if (config.glow) {
          config.glow.enabled = config.glow.enabled === true;
          config.glow.trigger = ['hover', 'reveal', 'always'].includes(config.glow.trigger)
            ? config.glow.trigger
            : 'hover';
          config.glow.color = String(config.glow.color || 'currentColor');
          config.glow.blurPx = clamp(Number(config.glow.blurPx) || 10, 0, 128);
          config.glow.spreadPx = clamp(Number(config.glow.spreadPx) || 0, -32, 64);
          config.glow.opacity = clamp(Number(config.glow.opacity ?? 0.62), 0, 1);
          config.glow.durationMs = clamp(Number(config.glow.durationMs) || 320, 0, 5000);
          config.glow.easing = String(config.glow.easing || 'ease-out');
        }
        if (config.behavior) {
          config.behavior.open = ['default', 'same-tab', 'new-tab', 'emit-only'].includes(config.behavior.open)
            ? config.behavior.open
            : 'default';
          config.behavior.rel = String(config.behavior.rel ?? 'noopener noreferrer');
          config.behavior.pointerEnabledWhileTyping = config.behavior.pointerEnabledWhileTyping !== false;
        }
        return config;
      };

      const styledlinks = parameters.renderer.constructors.styledlinks;
      styledlinks.enabled = styledlinks.enabled !== false;
      if (styledlinks.reveal) {
        styledlinks.reveal.durationMs = clamp(Number(styledlinks.reveal.durationMs) || 220, 0, 10_000);
        styledlinks.reveal.durationBeats = clamp(Number(styledlinks.reveal.durationBeats) || 0, 0, 64);
        styledlinks.reveal.minDurationMs = clamp(Number(styledlinks.reveal.minDurationMs) || 100, 0, 2000);
        styledlinks.reveal.maxDurationMs = clamp(Number(styledlinks.reveal.maxDurationMs) || 900, styledlinks.reveal.minDurationMs, 60_000);
        styledlinks.reveal.velocity = ['inherit', 'playback', 'fixed'].includes(styledlinks.reveal.velocity) ? styledlinks.reveal.velocity : 'inherit';
        styledlinks.reveal.velocityMultiplier = Math.max(0.01, Number(styledlinks.reveal.velocityMultiplier) || 1);
      }
      styledlinks.idPrefix = sanitizeDomId(styledlinks.idPrefix || 'tw-link');
      styledlinks.defaultPreset = String(styledlinks.defaultPreset || 'default');
      styledlinks.presets = isPlainObject(styledlinks.presets) ? styledlinks.presets : { default: {} };
      Object.values(styledlinks.presets).forEach(normalizeStyledLinkShape);
      normalizeStyledLinkShape(styledlinks);
      if (!styledlinks.presets[styledlinks.defaultPreset]) styledlinks.defaultPreset = 'default';

      const normalizeStrikeoutShape = config => {
        if (!isPlainObject(config)) return {};
        if ('css' in config) config.css = normalizeCssMap(config.css);
        if (config.line) {
          config.line.color = String(config.line.color || 'currentColor');
          config.line.thickness = String(config.line.thickness || '0.075em');
          config.line.position = String(config.line.position || '52%');
        }
        if (config.animation) {
          config.animation.enabled = config.animation.enabled !== false;
          config.animation.durationMs = clamp(Number(config.animation.durationMs) || 280, 0, 10_000);
          config.animation.durationBeats = clamp(Number(config.animation.durationBeats) || 0, 0, 64);
          config.animation.minDurationMs = clamp(Number(config.animation.minDurationMs) || 24, 0, 2000);
          config.animation.maxDurationMs = clamp(Number(config.animation.maxDurationMs) || 1000, config.animation.minDurationMs, 60_000);
          config.animation.holdMs = clamp(Number(config.animation.holdMs) || 0, 0, 20_000);
          config.animation.easing = String(config.animation.easing || 'ease-out');
          config.animation.velocity = ['inherit', 'playback', 'fixed'].includes(config.animation.velocity)
            ? config.animation.velocity
            : 'inherit';
          config.animation.velocityMultiplier = Math.max(0.01, Number(config.animation.velocityMultiplier) || 1);
          config.animation.loop = normalizeConstructorEffectLoop(config.animation.loop, 1800);
        }
        return config;
      };

      const strikeout = parameters.renderer.constructors.strikeout;
      strikeout.enabled = strikeout.enabled !== false;
      strikeout.idPrefix = sanitizeDomId(strikeout.idPrefix || 'tw-strike');
      strikeout.defaultPreset = String(strikeout.defaultPreset || 'default');
      strikeout.presets = isPlainObject(strikeout.presets) ? strikeout.presets : { default: {} };
      Object.values(strikeout.presets).forEach(normalizeStrikeoutShape);
      normalizeStrikeoutShape(strikeout);
      if (!strikeout.presets[strikeout.defaultPreset]) strikeout.defaultPreset = 'default';

      const normalizeStrongShape = config => {
        if (!isPlainObject(config)) return {};
        if ('css' in config) config.css = normalizeCssMap(config.css);
        if (config.pulse) {
          config.pulse.enabled = config.pulse.enabled !== false;
          config.pulse.scale = Math.max(0.01, Number(config.pulse.scale) || 1.08);
          config.pulse.durationMs = clamp(Number(config.pulse.durationMs) || 240, 0, 10_000);
          config.pulse.durationBeats = clamp(Number(config.pulse.durationBeats) || 0, 0, 64);
          config.pulse.minDurationMs = clamp(Number(config.pulse.minDurationMs) || 180, 0, 2000);
          config.pulse.maxDurationMs = clamp(Number(config.pulse.maxDurationMs) || 700, config.pulse.minDurationMs, 60_000);
          config.pulse.count = clamp(Math.round(Number(config.pulse.count) || 1), 1, 20);
          config.pulse.easing = String(config.pulse.easing || 'ease-out');
          config.pulse.velocity = ['inherit', 'playback', 'fixed'].includes(config.pulse.velocity) ? config.pulse.velocity : 'inherit';
          config.pulse.velocityMultiplier = Math.max(0.01, Number(config.pulse.velocityMultiplier) || 1);
          config.pulse.blocking = config.pulse.blocking === true;
          config.pulse.loop = normalizeConstructorEffectLoop(config.pulse.loop, 1800);
        }
        return config;
      };
      const strong = parameters.renderer.constructors.strong;
      strong.enabled = strong.enabled !== false;
      strong.idPrefix = sanitizeDomId(strong.idPrefix || 'tw-strong');
      strong.defaultPreset = String(strong.defaultPreset || 'default');
      strong.presets = isPlainObject(strong.presets) ? strong.presets : { default: {} };
      Object.values(strong.presets).forEach(normalizeStrongShape);
      normalizeStrongShape(strong);
      if (!strong.presets[strong.defaultPreset]) strong.defaultPreset = 'default';

      const normalizeEmphasisShape = config => {
        if (!isPlainObject(config)) return {};
        if ('css' in config) config.css = normalizeCssMap(config.css);
        if (config.typing) {
          config.typing.behavior = ['inherit', 'cursive', 'steady'].includes(config.typing.behavior) ? config.typing.behavior : 'inherit';
          config.typing.rateMultiplier = Math.max(0.01, Number(config.typing.rateMultiplier) || 1);
          config.typing.cursiveLetterRate = Math.max(1, Number(config.typing.cursiveLetterRate) || 2.15);
          config.typing.cursiveWordPauseMs = clamp(Number(config.typing.cursiveWordPauseMs) || 0, 0, 5000);
        }
        return config;
      };
      const emphasis = parameters.renderer.constructors.emphasis;
      emphasis.enabled = emphasis.enabled !== false;
      emphasis.idPrefix = sanitizeDomId(emphasis.idPrefix || 'tw-emphasis');
      emphasis.defaultPreset = String(emphasis.defaultPreset || 'default');
      emphasis.presets = isPlainObject(emphasis.presets) ? emphasis.presets : { default: {} };
      Object.values(emphasis.presets).forEach(normalizeEmphasisShape);
      normalizeEmphasisShape(emphasis);
      if (!emphasis.presets[emphasis.defaultPreset]) emphasis.defaultPreset = 'default';

      const normalizeListShape = config => {
        if (!isPlainObject(config)) return {};
        if ('itemCss' in config) config.itemCss = normalizeCssMap(config.itemCss);
        if (config.vignette) {
          config.vignette.animation = ['none', 'pulse', 'rotate', 'pulse-rotate'].includes(config.vignette.animation) ? config.vignette.animation : 'none';
          config.vignette.trigger = ['start', 'complete'].includes(config.vignette.trigger) ? config.vignette.trigger : 'start';
          config.vignette.durationMs = clamp(Number(config.vignette.durationMs) || 420, 0, 10_000);
          config.vignette.durationBeats = clamp(Number(config.vignette.durationBeats) || 0, 0, 64);
          config.vignette.minDurationMs = clamp(Number(config.vignette.minDurationMs) || 140, 0, 2000);
          config.vignette.maxDurationMs = clamp(Number(config.vignette.maxDurationMs) || 1000, config.vignette.minDurationMs, 60_000);
          config.vignette.count = clamp(Math.round(Number(config.vignette.count) || 1), 1, 20);
          config.vignette.scale = Math.max(0.01, Number(config.vignette.scale) || 1.18);
          config.vignette.rotateDeg = Number(config.vignette.rotateDeg) || 360;
          config.vignette.easing = String(config.vignette.easing || 'ease-out');
          config.vignette.velocity = ['inherit', 'playback', 'fixed'].includes(config.vignette.velocity) ? config.vignette.velocity : 'inherit';
          config.vignette.velocityMultiplier = Math.max(0.01, Number(config.vignette.velocityMultiplier) || 1);
          config.vignette.blocking = config.vignette.blocking === true;
          config.vignette.loop = normalizeConstructorEffectLoop(config.vignette.loop, 1800);
          config.vignette.css = normalizeCssMap(config.vignette.css);
        }
        return config;
      };
      const lists = parameters.renderer.constructors.lists;
      lists.enabled = lists.enabled !== false;
      lists.idPrefix = sanitizeDomId(lists.idPrefix || 'tw-list-item');
      lists.defaultPreset = String(lists.defaultPreset || 'default');
      lists.presets = isPlainObject(lists.presets) ? lists.presets : { default: {} };
      Object.values(lists.presets).forEach(normalizeListShape);
      normalizeListShape(lists);
      if (!lists.presets[lists.defaultPreset]) lists.defaultPreset = 'default';

      return parameters;
    }

    configure(patch = {}, options = {}) {
      this.parameters = this.validateParameters(deepMerge(this.parameters, patch));
      this.renderCoordinator?.notifyConfigChanged();
      this.applyPresentation();
      Object.keys(CONSTRUCTOR_ADAPTERS).forEach(name => this.refreshConstructor(name));
      this.syncUiFromParameters();
      if (options.restart && this.currentNote) {
        return this.restart();
      }
      return clone(this.parameters);
    }

    getParameters() {
      return clone(this.parameters);
    }

    getState() {
      return {
        version: APP_VERSION,
        note: this.currentNote ? {
          id: this.currentNote.id,
          sourceHash: this.currentNote.sourceHash,
          complete: this.sections.length > 0
            && this.sections.every(section => section.player?.progress.complete)
            && this.currentCodeBlocks
              .filter(block => !block.parentBlockId)
              .every(block => block.runtime?.hasCompletedInitial !== false),
          timing: clone(this.getRuntimeState().timing),
        } : null,
        paused: this.paused,
        rendererDirty: this.rendererDirty,
        parameters: this.getParameters(),
        runtime: this.getRuntimeState(),
        constructors: Object.fromEntries(
          Object.keys(CONSTRUCTOR_ADAPTERS).map(name => [name, this.getConstructorItems(name)]),
        ),
        sections: this.sections.map(section => ({
          id: section.id,
          level: section.level,
          depth: section.depth,
          parentId: section.parentId,
          previousId: section.previousId,
          previousSiblingId: section.previousSiblingId,
          headingComplete: section.headingComplete,
          complete: section.player?.progress.complete || false,
          flowPhase: section.flowPhase || null,
          pendingBlocks: [...(section.flowBlocks || [])].filter(block => block.classList?.contains('tw-block-pending')).length,
          progress: section.player?.getProgress() || null,
        })),
      };
    }

    getConstructors() {
      return Object.fromEntries(
        Object.entries(CONSTRUCTOR_DEFINITIONS).map(([name, definition]) => [name, {
          ...clone(definition),
          parameters: clone(this.parameters.renderer.constructors[name] || {}),
        }]),
      );
    }

    getControlSchema() {
      return clone(CONTROL_SEMANTICS);
    }

    getControlInventory() {
      const controls = [];
      const formatObject = descriptor => String(
        descriptor?.sourceText || descriptor?.text || descriptor?.title || descriptor?.href || descriptor?.id || 'item',
      ).replace(/\s+/g, ' ').trim().slice(0, 72);
      const add = control => {
        const targetGroup = String(control.targetGroup || `${control.objectType || 'object'}:${control.objectId || control.id}`);
        const targetLabel = String(control.targetLabel || control.objectLabel || control.objectId || control.label || targetGroup);
        controls.push({
          mutable: true,
          visibility: 'primary',
          targetGroup,
          targetLabel,
          ...control,
          targetGroup,
          targetLabel,
        });
      };
      const effectTiming = (name, descriptor, effect, config) => {
        const runtime = resolveConstructorEffectRuntime(descriptor, effect);
        const player = timingPlayerFromContext(runtime?.lastContext?.timingContext, this.abortController.signal)
          || (descriptor.lastEffectiveRate ? { effectivePlaybackRate: () => descriptor.lastEffectiveRate } : null);
        return constructorTiming(config || {}, this, player, runtime?.lastContext?.operation || null);
      };
      const objectEffectVisibility = (name, descriptor, effect, config) => {
        const base = this.parameters.renderer.constructors[name] || {};
        const presetName = descriptor?.preset || base.defaultPreset || 'default';
        const presetPatch = base.presets?.[presetName]?.[effect];
        const authoredPatch = descriptor?.markdownOverride?.[effect];
        const runtimePatch = descriptor?.override?.[effect];
        const hasShape = value => isPlainObject(value) && Object.keys(value).length > 0;
        if (config?.loop?.enabled === true) return 'primary';
        if (hasShape(authoredPatch) || hasShape(runtimePatch) || hasShape(presetPatch)) return 'primary';
        // Strikeout is itself a visual effect; its draw control remains primary
        // even when the animation shape is inherited from the constructor base.
        if (name === 'strikeout') return 'primary';
        return 'advanced';
      };
      const sourceExampleForEffect = (name, descriptor) => {
        const raw = String(descriptor?.markdownMetadata?.raw || '').trim();
        const text = String(descriptor?.text || descriptor?.sourceText || descriptor?.visibleText || descriptor?.title || descriptor?.id || 'item')
          .replace(/\s+/g, ' ').trim().slice(0, 96);
        if (name === 'styledlinks') return `[${text}](${descriptor?.href || 'url'})${raw}`;
        if (name === 'strikeout') return `~~${text}~~${raw}`;
        if (name === 'strong') return `**${text}**${raw}`;
        if (name === 'emphasis') return `*${text}*${raw}`;
        if (name === 'lists') {
          const marker = descriptor?.ordered ? `${Number(descriptor?.number) || 1}.` : '-';
          return `${marker} ${text}${raw}`;
        }
        return raw || text;
      };
      const effectTarget = (name, descriptor, effect, effectLabel, preview = null) => ({
        targetGroup: `${name}:${descriptor.id}:${effect}`,
        targetLabel: formatObject(descriptor) || descriptor.id,
        targetKind: 'typed-effect',
        effectLabel,
        sourceExample: sourceExampleForEffect(name, descriptor),
        renderSummary: `${effectLabel} on “${formatObject(descriptor) || descriptor.id}”`,
        preview: preview ? clone(preview) : null,
      });

      add({
        id: 'global:playback.rate', family: 'pace', scope: 'global', objectType: 'document', objectId: 'document',
        label: 'Typing rate', kind: 'rate', value: Number(this.parameters.playback.rate) || 1, unit: '×',
        perceptualScale: 'typing-rate', defaultValue: 1,
        description: 'Shared document typing pace. 1.0× is the standard human-reading presentation rate; lower is slower and higher is faster.',
        timingSource: this.parameters.playback.rateScope === 'document' ? 'owner-cadence' : 'playback',
        targetGroup: 'document:typing', targetLabel: 'Document typing', targetKind: 'document',
        target: { scope: 'global', path: 'playback.rate' },
      });
      add({
        id: 'global:typing.backspaceMultiplier', family: 'pace', scope: 'global', objectType: 'typing', objectId: 'backspace',
        label: 'Backspace rate', kind: 'rate', value: Number(this.parameters.typing.backspaceMultiplier) || 0.7, unit: '× typing',
        timingSource: 'owner-cadence', targetGroup: 'typing:backspace', targetLabel: 'Backspace / correction', targetKind: 'shared-policy',
        affects: ['typo', 'rotation.delete', 'rotation.strike'],
        target: { scope: 'global', path: 'typing.backspaceMultiplier' }, min: 0.1, max: 4, step: 0.05,
      });

      const rotationState = this.rotationController?.getState?.() || {};
      const rotationEffectTarget = (effect, label, glyph) => {
        const config = this.rotationController?.effectConfig?.(effect) || {};
        const live = rotationState[effect] || {};
        const playbackRate = Math.max(0.01, Number(this.parameters.playback.rate) || 1);
        const resolvedTransition = Math.max(20, (Number(config.speedMs) || 500) / Math.max(0.01, Number(live?.timing?.effectiveRate) || playbackRate));
        return {
          targetGroup: `rotation:${effect}`, targetLabel: label, targetKind: 'inline-command', effectLabel: `${label} command`,
          affects: effect === 'slot' ? ['SlotRotation', 'Slot'] : effect === 'delete' ? ['DeleteRotation', 'Delete'] : ['StrikeRotation', 'Strike'],
          preview: {
            kind: 'rotation', effect, text: live.word || glyph, cycle: Number(live.cycle) || 0, phase: live.phase || 'ready',
            durationMs: Number(live?.timing?.transitionMs) || resolvedTransition, holdMs: Number(config.holdMs) || 0,
          },
        };
      };
      const slotRotationTarget = rotationEffectTarget('slot', 'Slot rotation', '↕');
      const deleteRotationTarget = rotationEffectTarget('delete', 'Delete rotation', '⌫');
      const strikeRotationTarget = rotationEffectTarget('strike', 'Strike rotation', 'S');
      add({
        id: 'global:rotation.effects.slot.speedMs', family: 'pace', scope: 'global', objectType: 'rotation', objectId: 'slot',
        label: 'Transition pace', kind: 'range', value: Number(this.rotationController?.effectConfig?.('slot')?.speedMs) || 500, unit: 'ms base',
        editorValue: Number((500 / Math.max(20, Number(this.rotationController?.effectConfig?.('slot')?.speedMs) || 500)).toFixed(2)), editorUnit: '× pace',
        editorMin: 0.05, editorMax: 25, editorStep: 0.01, valueTransform: 'inverse-duration-rate', valueReference: 500,
        perceptualScale: 'motion-rate', defaultValue: 500, defaultEditorValue: 1,
        description: 'How quickly the slot transition itself moves. Standard is intentionally slow enough to make the API action readable.',
        timingSource: 'owner-cadence', resolved: { value: slotRotationTarget.preview.durationMs, unit: 'ms' },
        target: { scope: 'global', path: 'rotation.effects.slot.speedMs' }, min: 20, max: 5000, step: 10, sliderLowerLabel: 'Slower', sliderUpperLabel: 'Faster', ...slotRotationTarget,
      });
      add({
        id: 'global:rotation.effects.slot.holdMs', family: 'hold', scope: 'global', objectType: 'rotation', objectId: 'slot',
        label: 'Visible hold', kind: 'range', value: Number(this.rotationController?.effectConfig?.('slot')?.holdMs) || 0, unit: 'ms',
        perceptualScale: 'hold-ms', defaultValue: 1000, description: 'How long the revealed slot value remains fully visible before the next transition.',
        timingSource: 'literal', target: { scope: 'global', path: 'rotation.effects.slot.holdMs' }, min: 0, max: 20000, step: 50, sliderLowerLabel: 'Shorter', sliderUpperLabel: 'Longer', ...slotRotationTarget,
      });
      add({
        id: 'global:rotation.effects.delete.holdMs', family: 'hold', scope: 'global', objectType: 'rotation', objectId: 'delete',
        label: 'Visible hold', kind: 'range', value: Number(this.rotationController?.effectConfig?.('delete')?.holdMs) || 0, unit: 'ms',
        perceptualScale: 'hold-ms', defaultValue: 1000, description: 'How long the visible DeleteRotation value rests before deletion begins.',
        timingSource: 'literal', target: { scope: 'global', path: 'rotation.effects.delete.holdMs' }, min: 0, max: 20000, step: 50, sliderLowerLabel: 'Shorter', sliderUpperLabel: 'Longer', ...deleteRotationTarget,
      });
      add({
        id: 'global:rotation.effects.delete.blankHoldMs', family: 'hold', scope: 'global', objectType: 'rotation', objectId: 'delete',
        label: 'Blank hold', kind: 'range', value: Number(this.rotationController?.effectConfig?.('delete')?.blankHoldMs) || 0, unit: 'ms',
        perceptualScale: 'hold-ms', defaultValue: 250, description: 'How long DeleteRotation leaves the slot blank between the erased value and the next reveal.',
        timingSource: 'literal', target: { scope: 'global', path: 'rotation.effects.delete.blankHoldMs' }, min: 0, max: 20000, step: 50, sliderLowerLabel: 'Shorter', sliderUpperLabel: 'Longer', ...deleteRotationTarget,
      });
      add({
        id: 'global:rotation.effects.strike.speedMs', family: 'pace', scope: 'global', objectType: 'rotation', objectId: 'strike',
        label: 'Strike draw pace', kind: 'range', value: Number(this.rotationController?.effectConfig?.('strike')?.speedMs) || 500, unit: 'ms base',
        editorValue: Number((500 / Math.max(20, Number(this.rotationController?.effectConfig?.('strike')?.speedMs) || 500)).toFixed(2)), editorUnit: '× pace',
        editorMin: 0.05, editorMax: 25, editorStep: 0.01, valueTransform: 'inverse-duration-rate', valueReference: 500,
        perceptualScale: 'motion-rate', defaultValue: 500, defaultEditorValue: 1,
        description: 'How quickly the strike line is drawn. Standard favors legibility so the effect remains distinguishable in the API showcase.',
        timingSource: 'owner-cadence', resolved: { value: strikeRotationTarget.preview.durationMs, unit: 'ms' },
        target: { scope: 'global', path: 'rotation.effects.strike.speedMs' }, min: 20, max: 5000, step: 10, sliderLowerLabel: 'Slower', sliderUpperLabel: 'Faster', ...strikeRotationTarget,
      });
      add({
        id: 'global:rotation.effects.strike.holdMs', family: 'hold', scope: 'global', objectType: 'rotation', objectId: 'strike',
        label: 'Word hold', kind: 'range', value: Number(this.rotationController?.effectConfig?.('strike')?.holdMs) || 0, unit: 'ms',
        perceptualScale: 'hold-ms', defaultValue: 1000, description: 'How long the current word remains readable before the strike phase begins.',
        timingSource: 'literal', target: { scope: 'global', path: 'rotation.effects.strike.holdMs' }, min: 0, max: 20000, step: 50, sliderLowerLabel: 'Shorter', sliderUpperLabel: 'Longer', ...strikeRotationTarget,
      });
      add({
        id: 'global:rotation.effects.strike.strikeHoldMs', family: 'hold', scope: 'global', objectType: 'rotation', objectId: 'strike',
        label: 'Struck hold', kind: 'range', value: Number(this.rotationController?.effectConfig?.('strike')?.strikeHoldMs) || 0, unit: 'ms',
        perceptualScale: 'hold-ms', defaultValue: 400, description: 'How long the struck word remains on screen before replacement or cleanup.',
        timingSource: 'literal', target: { scope: 'global', path: 'rotation.effects.strike.strikeHoldMs' }, min: 0, max: 20000, step: 50, sliderLowerLabel: 'Shorter', sliderUpperLabel: 'Longer', ...strikeRotationTarget,
      });

      for (const [name, definition] of Object.entries(CONSTRUCTOR_DEFINITIONS)) {
        const base = this.parameters.renderer.constructors[name] || {};
        add({
          id: `constructor:${name}:enabled`, family: 'toggle', scope: 'constructor', objectType: name, objectId: name,
          label: 'Available', kind: 'boolean', value: base.enabled !== false, behavior: 'live',
          description: `${definition.label || name} constructor availability. Toggling this changes whether new matching source is constructed; the update is live.`,
          targetGroup: `constructor:${name}`, targetLabel: definition.label || name, targetKind: 'constructor-family',
          target: { scope: 'constructor', constructor: name, path: 'enabled' },
        });
      }
      [
        ['renderer.flow.progressiveLayout', 'Progressive geometry', 'restart'],
        ['renderer.flow.bridge', 'Continuation bridge', 'restart'],
        ['renderer.flow.preserveScrollAnchor', 'Protect scroll anchor', 'immediate'],
      ].forEach(([path, label, behavior]) => {
        const key = path.split('.').at(-1);
        add({
          id: `global:${path}`, family: 'toggle', scope: 'global', objectType: 'flow', objectId: 'flow',
          label, kind: 'boolean', value: this.parameters.renderer.flow?.[key] !== false, behavior,
          targetGroup: 'presentation:flow', targetLabel: 'Progressive flow', targetKind: 'presentation',
          target: { scope: 'global', path },
        });
      });

      const addEffectControls = (name, descriptor, effect, config, effectLabel) => {
        if (!config || config.enabled === false) return;
        const timing = effectTiming(name, descriptor, effect, config);
        const usesBeats = Number(config.durationBeats) > 0;
        const preview = constructorControlPreviewSpec(name, descriptor, effect, config, timing);
        const targetMeta = effectTarget(name, descriptor, effect, effectLabel, preview);
        const visibility = objectEffectVisibility(name, descriptor, effect, config);
        add({
          id: `item:${name}:${descriptor.id}:${effect}:duration`, family: 'pace', scope: 'constructor-item',
          objectType: name, objectId: descriptor.id, label: 'Duration', objectLabel: formatObject(descriptor), kind: 'number',
          value: usesBeats ? Number(config.durationBeats) : Number(config.durationMs) || 0,
          unit: usesBeats ? 'beats' : 'ms base', timingSource: timing.timingSource,
          resolved: { value: timing.resolvedDurationMs, unit: 'ms', effectiveRate: timing.effectiveRate, characterBeatMs: timing.characterBeatMs },
          target: { scope: 'constructor-item', constructor: name, id: descriptor.id, path: usesBeats ? `${effect}.durationBeats` : `${effect}.durationMs` },
          min: 0, max: usesBeats ? 64 : 10000, step: usesBeats ? 0.25 : 10,
          visibility,
          ...targetMeta,
        });
        const runtime = resolveConstructorEffectRuntime(descriptor, effect);
        const loop = runtime?.getState?.() || null;
        if (loop) {
          add({
            id: `item:${name}:${descriptor.id}:${effect}:hold`, family: 'hold', scope: 'constructor-item',
            objectType: name, objectId: descriptor.id, label: 'Repeat hold', objectLabel: formatObject(descriptor),
            kind: 'duration', value: Number(loop.holdMs) || 0, unit: 'ms', timingSource: 'literal',
            target: { scope: 'constructor-item', constructor: name, id: descriptor.id, path: `${effect}.loop.holdMs` },
            min: 0, max: 86400000, step: 100,
            visibility: loop.loopEnabled || loop.running ? 'primary' : visibility,
            ...targetMeta,
          });
          add({
            id: `item:${name}:${descriptor.id}:${effect}:repeat`, family: 'repeat', scope: 'constructor-effect',
            objectType: name, objectId: descriptor.id, label: 'Repeat', objectLabel: formatObject(descriptor), kind: 'runtime-toggle',
            value: loop.running === true, configured: loop.loopEnabled === true, lifecycle: !loop.reached ? 'pending' : loop.running ? 'active' : 'settled',
            cycle: Number(loop.cycle) || 0,
            target: { scope: 'constructor-effect', constructor: name, id: descriptor.id, effect },
            visibility: loop.loopEnabled || loop.running ? 'primary' : visibility,
            ...targetMeta,
          });
        }
      };

      for (const descriptor of this.currentStyledLinks || []) {
        const config = effectiveStyledLinkConfig(this, descriptor);
        addEffectControls('styledlinks', descriptor, 'reveal', config.reveal, 'Link reveal');
      }
      for (const descriptor of this.currentStrikeouts || []) {
        const config = effectiveStrikeoutConfig(this, descriptor);
        addEffectControls('strikeout', descriptor, 'animation', config.animation, 'Strike draw');
      }
      for (const descriptor of this.currentStrong || []) {
        const config = effectiveStrongConfig(this, descriptor);
        if (config.pulse?.enabled !== false) addEffectControls('strong', descriptor, 'pulse', config.pulse, 'Strong pulse');
      }
      for (const descriptor of this.currentListItems || []) {
        const config = effectiveListItemConfig(this, descriptor);
        if (config.vignette?.animation && config.vignette.animation !== 'none') {
          addEffectControls('lists', descriptor, 'vignette', config.vignette, `List ${config.vignette.animation}`);
        }
      }
      for (const descriptor of this.currentEmphasis || []) {
        const config = effectiveEmphasisConfig(this, descriptor).typing || {};
        const targetMeta = {
          targetGroup: `emphasis:${descriptor.id}:typing`,
          targetLabel: formatObject(descriptor) || descriptor.id,
          targetKind: 'typed-effect',
          effectLabel: config.behavior === 'cursive' ? 'Cursive typing' : 'Emphasis typing',
          preview: {
            kind: 'emphasis',
            constructor: 'emphasis',
            id: descriptor.id,
            effect: 'typing',
            text: 'Aa',
            behavior: config.behavior || 'inherit',
            rateMultiplier: Number(config.rateMultiplier) || 1,
          },
        };
        add({
          id: `item:emphasis:${descriptor.id}:typing-rate`, family: 'pace', scope: 'constructor-item',
          objectType: 'emphasis', objectId: descriptor.id, label: 'Typing rate', objectLabel: formatObject(descriptor),
          kind: 'rate', value: Number(config.rateMultiplier) || 1, unit: '× local', timingSource: 'local',
          target: { scope: 'constructor-item', constructor: 'emphasis', id: descriptor.id, path: 'typing.rateMultiplier' },
          min: 0.1, max: 16, step: 0.1, visibility: 'primary', ...targetMeta,
        });
        if (config.behavior === 'cursive') {
          add({
            id: `item:emphasis:${descriptor.id}:word-pause`, family: 'hold', scope: 'constructor-item',
            objectType: 'emphasis', objectId: descriptor.id, label: 'Word pause', objectLabel: formatObject(descriptor),
            kind: 'duration', value: Number(config.cursiveWordPauseMs) || 0, unit: 'ms base', timingSource: 'owner-cadence',
            target: { scope: 'constructor-item', constructor: 'emphasis', id: descriptor.id, path: 'typing.cursiveWordPauseMs' },
            min: 0, max: 5000, step: 10, visibility: 'primary', ...targetMeta,
          });
        }
      }

      for (const block of this.currentCodeBlocks || []) {
        for (const loop of block.loops || []) {
          const effective = effectiveCodeBlockLoopConfig(this, block, loop);
          const runtime = loop.runtime?.getState?.() || {};
          const targetMeta = {
            targetGroup: `code-loop:${block.id}:${loop.id}`,
            targetLabel: `${block.id} · ${loop.name || loop.id}`,
            targetKind: 'code-loop',
            effectLabel: 'CODE loop',
            sourceExample: `<!--LOOP:${loop.name || loop.id} Hold=${Math.max(0, Number(effective.holdMs) || 0)}ms,rate=${Number(effective.rate) || 1}-->`,
            renderSummary: `Loop “${loop.name || loop.id}” inside @${block.id}${loop.path ? `/${loop.path}` : ''}`,
            preview: {
              kind: 'code-loop',
              constructor: 'codeblock',
              id: loop.id,
              effect: 'loop',
              text: '↻',
              running: runtime.running === true || runtime.armed === true,
              cycle: Number(runtime.cycle) || 0,
              holdMs: Number(effective.holdMs) || 0,
            },
          };
          add({
            id: `code-loop:${block.id}:${loop.id}:rate`, family: 'pace', scope: 'code-loop', objectType: 'code-loop',
            objectId: loop.id, parentId: block.id, label: 'Rate', objectLabel: block.id,
            kind: 'rate', value: Number(effective.rate) || 1, unit: '× local', timingSource: 'local',
            target: { scope: 'code-loop', blockId: block.id, loopId: loop.id, path: 'rate' }, min: 0.1, max: 16, step: 0.05,
            ...targetMeta,
          });
          add({
            id: `code-loop:${block.id}:${loop.id}:hold`, family: 'hold', scope: 'code-loop', objectType: 'code-loop',
            objectId: loop.id, parentId: block.id, label: 'Hold', objectLabel: block.id,
            kind: 'duration', value: Number(effective.holdMs) || 0, unit: 'ms', timingSource: 'literal',
            target: { scope: 'code-loop', blockId: block.id, loopId: loop.id, path: 'holdMs' }, min: 0, max: 86400000, step: 100,
            ...targetMeta,
          });
          add({
            id: `code-loop:${block.id}:${loop.id}:repeat`, family: 'repeat', scope: 'code-loop', objectType: 'code-loop',
            objectId: loop.id, parentId: block.id, label: 'Loop', objectLabel: block.id,
            kind: 'runtime-toggle', value: runtime.running === true || runtime.armed === true,
            configured: effective.enabled !== false, lifecycle: runtime.running ? 'active' : runtime.armed ? 'pending' : 'settled',
            cycle: Number(runtime.cycle) || 0,
            target: { scope: 'code-loop', blockId: block.id, loopId: loop.id },
            ...targetMeta,
          });
        }
      }

      add({
        id: 'global:playback.rateScope', family: 'presentation', scope: 'global', objectType: 'document', objectId: 'document',
        label: 'Pace scope', kind: 'select', value: this.parameters.playback.rateScope, options: ['document', 'section'],
        targetGroup: 'document:typing', targetLabel: 'Document typing', targetKind: 'document',
        target: { scope: 'global', path: 'playback.rateScope' },
      });
      add({
        id: 'global:renderer.mode', family: 'presentation', scope: 'global', objectType: 'renderer', objectId: 'renderer',
        label: 'Renderer mode', kind: 'select', value: this.parameters.renderer.mode, options: ['single', 'multi'],
        targetGroup: 'presentation:renderer', targetLabel: 'Section renderer', targetKind: 'presentation',
        target: { scope: 'global', path: 'renderer.mode' },
      });
      add({
        id: 'global:renderer.multi.headingVelocity', family: 'presentation', scope: 'global', objectType: 'renderer', objectId: 'renderer',
        label: 'Heading scheduling', kind: 'select', value: this.parameters.renderer.multi.headingVelocity,
        options: Object.keys(this.parameters.renderer.multi.velocityPresets || HEADING_VELOCITY_PRESETS),
        targetGroup: 'presentation:renderer', targetLabel: 'Section renderer', targetKind: 'presentation',
        target: { scope: 'global', path: 'renderer.multi.headingVelocity' },
      });

      const targetMap = new Map();
      controls.forEach(control => {
        if (!targetMap.has(control.targetGroup)) {
          targetMap.set(control.targetGroup, {
            id: control.targetGroup,
            label: control.targetLabel,
            kind: control.targetKind || control.objectType || 'object',
            effectLabel: control.effectLabel || '',
            objectType: control.objectType || '',
            objectId: control.objectId || '',
            parentId: control.parentId || null,
            highlightId: control.scope === 'global' || control.scope === 'constructor' ? null : (control.parentId || control.objectId || null),
            preview: control.preview ? clone(control.preview) : null,
            sourceExample: control.sourceExample || '',
            renderSummary: control.renderSummary || '',
            affects: Array.isArray(control.affects) ? [...control.affects] : [],
            families: [],
            controls: 0,
            primaryControls: 0,
          });
        }
        const target = targetMap.get(control.targetGroup);
        if (!target.families.includes(control.family)) target.families.push(control.family);
        target.controls += 1;
        if (control.visibility !== 'advanced') target.primaryControls += 1;
        if (!target.effectLabel && control.effectLabel) target.effectLabel = control.effectLabel;
        if (!target.preview && control.preview) target.preview = clone(control.preview);
        if (!target.sourceExample && control.sourceExample) target.sourceExample = control.sourceExample;
        if (!target.renderSummary && control.renderSummary) target.renderSummary = control.renderSummary;
        if (Array.isArray(control.affects)) control.affects.forEach(item => { if (!target.affects.includes(item)) target.affects.push(item); });
      });

      return {
        version: APP_VERSION,
        semantics: this.getControlSchema(),
        controls,
        targets: [...targetMap.values()],
        counts: Object.fromEntries(Object.keys(CONTROL_SEMANTICS.families).map(family => [family, controls.filter(control => control.family === family).length])),
        primaryCounts: Object.fromEntries(Object.keys(CONTROL_SEMANTICS.families).map(family => [family, controls.filter(control => control.family === family && control.visibility !== 'advanced').length])),
      };
    }

    getCodeBlocks() {
      return this.currentCodeBlocks.map(block => {
        const visible = block.codeElement.textContent.replace(/\n$/, '');
        const config = effectiveCodeBlockConfig(this, block);
        return {
          id: block.id,
          index: block.index,
          constructor: block.constructor,
          language: block.language,
          title: block.title,
          copyButtonId: block.copyButtonId,
          parentCodeBlockId: block.parentBlockId,
          codePath: block.codePath,
          hostLineIndex: block.hostLineIndex,
          childCodeBlockIds: (block.childCodeBlocks || []).map(child => child.id),
          indentUnit: block.indentUnit,
          tabSize: block.tabSize,
          maxDepth: block.maxDepth,
          sourceLength: block.source.length,
          visibleLength: visible.length,
          complete: visible === block.source,
          preset: block.preset,
          markdownMetadata: clone(block.markdownMetadata),
          markdownOverride: clone(block.markdownOverride || {}),
          override: clone(block.override || {}),
          runtime: block.runtime?.getState?.() || null,
          diagnostics: clone(block.program?.diagnostics || []),
          programTree: serializeCodeProgramNode(block.program?.tree),
          loops: block.loops.map(loop => ({
            id: loop.id,
            name: loop.name,
            path: loop.path,
            parentPath: loop.parentPath || null,
            depth: loop.depth,
            index: loop.index,
            startLine: loop.startLine,
            endLine: loop.endLine,
            cycle: loop.runtime?.cycle ?? loop.cycle ?? 0,
            parameters: clone(loop.parameters || {}),
            markdownOverride: clone(loop.markdownOverride || {}),
            override: clone(loop.override || {}),
            effective: clone(effectiveCodeBlockLoopConfig(this, block, loop)),
            runtime: clone(loop.runtime?.getState?.() || null),
          })),
          effective: {
            tabSize: config.tabSize,
            indentUnit: config.indentUnit,
            depthRate: clone(config.depthRate || []),
            holdMs: config.holdMs,
            render: config.render,
            loopDefaults: clone(config.loopDefaults || {}),
            loops: clone(config.loops || {}),
            css: clone(config.css || {}),
            headerCss: clone(config.headerCss || {}),
            codeCss: clone(config.codeCss || {}),
            copyButton: clone(config.copyButton || {}),
          },
        };
      });
    }

    getStyledLinks() {
      return this.currentStyledLinks.map(link => ({
        id: link.id,
        index: link.index,
        constructor: link.constructor,
        href: link.href,
        title: link.title,
        text: link.sourceText,
        visibleText: link.element.textContent,
        external: link.external,
        target: link.element.getAttribute('target'),
        rel: link.element.getAttribute('rel'),
        revealed: link.revealed,
        complete: link.element.textContent === link.sourceText,
        preset: link.preset,
        markdownMetadata: clone(link.markdownMetadata),
        markdownOverride: clone(link.markdownOverride || {}),
        override: clone(link.override || {}),
        runtime: clone(link.effectRuntime?.getState?.() || null),
        effects: constructorEffectRuntimeStates(link),
      }));
    }

    getStyledLink(id) {
      const descriptor = this.currentStyledLinks.find(link => link.id === id || link.href === id);
      if (!descriptor) return null;
      return this.getStyledLinks().find(link => link.id === descriptor.id) || null;
    }

    setStyledLink(id, patch = {}) {
      return this.setConstructorItem('styledlinks', id, patch);
    }

    resetStyledLink(id) {
      return this.resetConstructorItem('styledlinks', id);
    }

    refreshStyledLinks() {
      return this.refreshConstructor('styledlinks');
    }

    revealStyledLinkForNode(node, options = {}) {
      const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
      const link = element?.closest?.('.tw-styled-link');
      if (!link) return false;
      const descriptor = styledLinkMetadata.get(link)
        || this.currentStyledLinks.find(item => item.element === link);
      return revealStyledLink(descriptor, this, options);
    }

    getConstructorSchema(name) {
      const definition = CONSTRUCTOR_DEFINITIONS[name];
      if (!definition) throw new Error(`Unknown constructor: ${name}`);
      return {
        ...clone(definition),
        parameters: clone(this.parameters.renderer.constructors[name] || {}),
      };
    }

    getConstructorPresets(name) {
      if (!CONSTRUCTOR_DEFINITIONS[name]) throw new Error(`Unknown constructor: ${name}`);
      return clone(this.parameters.renderer.constructors[name]?.presets || {});
    }

    configureConstructorPreset(name, preset, patch = {}, options = {}) {
      if (!CONSTRUCTOR_DEFINITIONS[name]) throw new Error(`Unknown constructor: ${name}`);
      const presetName = String(preset || '').trim();
      if (!presetName) throw new Error('Preset name is required.');
      const current = this.parameters.renderer.constructors[name]?.presets?.[presetName] || {};
      return this.configure({
        renderer: {
          constructors: {
            [name]: {
              presets: {
                [presetName]: deepMerge(current, patch || {}),
              },
            },
          },
        },
      }, options);
    }

    getStrikeouts() {
      return this.currentStrikeouts.map(item => ({
        id: item.id,
        index: item.index,
        constructor: item.constructor,
        text: item.sourceText,
        visibleText: item.element.textContent,
        preset: item.preset,
        struck: item.struck,
        markdownMetadata: clone(item.markdownMetadata),
        markdownOverride: clone(item.markdownOverride || {}),
        override: clone(item.override || {}),
        velocity: effectiveStrikeoutConfig(this, item).animation?.velocity || 'inherit',
        runtime: clone(item.effectRuntime?.getState?.() || null),
        effects: constructorEffectRuntimeStates(item),
      }));
    }

    getStrikeout(id) {
      const descriptor = this.currentStrikeouts.find(item => item.id === id);
      if (!descriptor) return null;
      return this.getStrikeouts().find(item => item.id === descriptor.id) || null;
    }

    setStrikeout(id, patch = {}) {
      return this.setConstructorItem('strikeout', id, patch);
    }

    resetStrikeout(id) {
      return this.resetConstructorItem('strikeout', id);
    }

    refreshStrikeouts() {
      return this.refreshConstructor('strikeout');
    }

    getStrongRuns() {
      return this.currentStrong.map(item => ({
        id: item.id,
        index: item.index,
        constructor: item.constructor,
        text: item.sourceText,
        visibleText: item.element.textContent,
        preset: item.preset,
        pulsed: item.pulsed,
        markdownMetadata: clone(item.markdownMetadata),
        markdownOverride: clone(item.markdownOverride || {}),
        override: clone(item.override || {}),
        pulse: clone(effectiveStrongConfig(this, item).pulse || {}),
        runtime: clone(item.effectRuntime?.getState?.() || null),
        effects: constructorEffectRuntimeStates(item),
      }));
    }

    getEmphasisRuns() {
      return this.currentEmphasis.map(item => ({
        id: item.id,
        index: item.index,
        constructor: item.constructor,
        text: item.sourceText,
        visibleText: item.element.textContent,
        preset: item.preset,
        markdownMetadata: clone(item.markdownMetadata),
        markdownOverride: clone(item.markdownOverride || {}),
        override: clone(item.override || {}),
        typing: clone(effectiveEmphasisConfig(this, item).typing || {}),
      }));
    }

    getListItems() {
      return this.currentListItems.map(item => ({
        id: item.id,
        index: item.index,
        constructor: item.constructor,
        text: item.sourceText,
        ordered: item.ordered,
        number: item.number,
        task: item.task,
        vignetteText: item.vignetteElement.textContent,
        preset: item.preset,
        started: item.started,
        complete: item.complete,
        markdownMetadata: clone(item.markdownMetadata),
        markdownOverride: clone(item.markdownOverride || {}),
        override: clone(item.override || {}),
        vignette: clone(effectiveListItemConfig(this, item).vignette || {}),
        runtime: clone(item.effectRuntime?.getState?.() || null),
        effects: constructorEffectRuntimeStates(item),
      }));
    }

    refreshStrong() {
      return this.refreshConstructor('strong');
    }

    refreshEmphasis() {
      return this.refreshConstructor('emphasis');
    }

    refreshListItems() {
      return this.refreshConstructor('lists');
    }

    constructorCollection(name) {
      const adapter = constructorAdapter(name);
      return this[adapter.collection] || [];
    }

    resolveConstructorDescriptor(name, id) {
      constructorAdapter(name);
      const key = String(id ?? '');
      const index = this.constructorIndexes.get(name);
      if (index) return index.byId.get(key) || index.aliases.get(key) || null;
      const items = this.constructorCollection(name);
      const adapter = CONSTRUCTOR_ADAPTERS[name];
      if (typeof adapter.resolve === 'function') return adapter.resolve(items, id);
      return items.find(item => item.id === id) || null;
    }

    getConstructorItem(name, id) {
      const descriptor = this.resolveConstructorDescriptor(name, id);
      if (!descriptor) return null;
      return this.getConstructorItems(name).find(item => item.id === descriptor.id) || null;
    }

    getConstructorEffectiveConfig(name, id) {
      const descriptor = this.resolveConstructorDescriptor(name, id);
      if (!descriptor) return null;
      const base = this.parameters.renderer.constructors[name] || {};
      const preset = descriptor.preset || base.defaultPreset || 'default';
      return effectiveConstructorConfig(
        base,
        preset,
        descriptor.markdownOverride || {},
        descriptor.override || {},
      );
    }

    setConstructorItem(name, id, patch = {}) {
      const adapter = constructorAdapter(name);
      const descriptor = this.resolveConstructorDescriptor(name, id);
      if (!descriptor) throw new Error(`Unknown ${name} item: ${id}`);

      const nextPatch = clone(patch || {});
      if (Object.prototype.hasOwnProperty.call(nextPatch, 'preset')) {
        descriptor.preset = String(
          nextPatch.preset
          || this.parameters.renderer.constructors[name]?.defaultPreset
          || 'default',
        );
        delete nextPatch.preset;
      }

      descriptor.override = deepMerge(descriptor.override || {}, nextPatch);
      adapter.apply?.(descriptor, this);
      syncConstructorEffectRuntimes(descriptor);
      dispatch('constructor-state', {
        constructor: name,
        id: descriptor.id,
        state: 'configured',
      });
      return this.getConstructorItem(name, descriptor.id);
    }

    resetConstructorItem(name, id) {
      const adapter = constructorAdapter(name);
      const descriptor = this.resolveConstructorDescriptor(name, id);
      if (!descriptor) throw new Error(`Unknown ${name} item: ${id}`);

      descriptor.preset = descriptor.markdownMetadata?.attributes?.preset
        || this.parameters.renderer.constructors[name]?.defaultPreset
        || 'default';
      descriptor.override = {};
      adapter.apply?.(descriptor, this);
      syncConstructorEffectRuntimes(descriptor);
      dispatch('constructor-state', {
        constructor: name,
        id: descriptor.id,
        state: 'reset',
      });
      return this.getConstructorItem(name, descriptor.id);
    }

    refreshConstructor(name) {
      const adapter = constructorAdapter(name);
      const collection = this.constructorCollection(name);
      collection.forEach(descriptor => {
        adapter.apply?.(descriptor, this);
        syncConstructorEffectRuntimes(descriptor);
      });
      return this.getConstructorItems(name);
    }

    async replayConstructorItem(name, id, options = {}) {
      const descriptor = this.resolveConstructorDescriptor(name, id);
      if (!descriptor) throw new Error(`Unknown ${name} item: ${id}`);
      const runtime = resolveConstructorEffectRuntime(descriptor, options.effect || null);
      if (!runtime) throw new Error(`Constructor ${name} has no replayable effect runtime${options.effect ? ` for ${options.effect}` : ''}.`);
      return runtime.replay({ animate: true });
    }

    getConstructorRuntime(name, id, effect = null) {
      const descriptor = this.resolveConstructorDescriptor(name, id);
      if (!descriptor) throw new Error(`Unknown ${name} item: ${id}`);
      return clone(resolveConstructorEffectRuntime(descriptor, effect)?.getState?.() || null);
    }

    startConstructorLoop(name, id, options = {}) {
      const descriptor = this.resolveConstructorDescriptor(name, id);
      const runtime = resolveConstructorEffectRuntime(descriptor, options.effect || null);
      if (!runtime) throw new Error(`Constructor ${name} has no transient runtime: ${id}`);
      const { effect: _effect, ...loopOptions } = options || {};
      return clone(runtime.startLoop(loopOptions));
    }

    stopConstructorLoop(name, id, options = {}) {
      const descriptor = this.resolveConstructorDescriptor(name, id);
      const runtime = resolveConstructorEffectRuntime(descriptor, options.effect || null);
      if (!runtime) throw new Error(`Constructor ${name} has no transient runtime: ${id}`);
      return clone(runtime.stopLoop());
    }

    restartConstructorLoop(name, id, options = {}) {
      const descriptor = this.resolveConstructorDescriptor(name, id);
      const runtime = resolveConstructorEffectRuntime(descriptor, options.effect || null);
      if (!runtime) throw new Error(`Constructor ${name} has no transient runtime: ${id}`);
      const { effect: _effect, ...loopOptions } = options || {};
      return clone(runtime.restartLoop(loopOptions));
    }

    configureConstructor(name, patch = {}, options = {}) {
      constructorAdapter(name);
      return this.configure({ renderer: { constructors: { [name]: patch } } }, options);
    }

    getConstructorItems(name) {
      const adapter = constructorAdapter(name);
      const list = this[adapter.listMethod];
      return typeof list === 'function' ? list.call(this) : [];
    }

    getCodeBlockTree(blockId) {
      const block = this.resolveCodeBlockDescriptor(blockId);
      if (!block) return null;
      const byPath = new Map(block.loops.map(loop => [loop.path, loop]));
      const visit = node => {
        if (node.type === 'line') {
          return { type: 'line', lineIndex: node.lineIndex, source: node.source };
        }
        if (node.type === 'code') {
          const child = node.descriptor || null;
          return {
            type: 'code',
            name: node.name,
            path: node.path || '',
            parentPath: node.parentPath || null,
            depth: node.depth,
            language: node.language || '',
            slotLineIndex: node.slotLineIndex,
            id: child?.id || null,
            parentCodeBlockId: child?.parentBlockId || block.id,
            effective: child ? clone(effectiveCodeBlockConfig(this, child)) : null,
            runtime: child ? clone(child.runtime?.getState?.() || null) : null,
            diagnostics: clone(node.program?.diagnostics || []),
            children: (node.program?.tree?.children || []).map(childNode => {
              if (child && childNode.type === 'loop') {
                const localLoop = child.loops.find(loop => loop.path === childNode.path);
                if (localLoop) {
                  const serialized = visitNestedCodeNode(child, childNode, localLoop);
                  return serialized;
                }
              }
              return visitNestedCodeNode(child, childNode, null);
            }),
          };
        }
        const descriptor = node.type === 'loop' ? byPath.get(node.path) : null;
        return {
          type: node.type,
          name: node.name,
          path: node.path || '',
          parentPath: node.parentPath || null,
          depth: node.depth,
          startLine: node.startLine,
          endLine: node.endLine,
          id: descriptor?.id || null,
          effective: descriptor ? clone(effectiveCodeBlockLoopConfig(this, block, descriptor)) : null,
          runtime: descriptor ? clone(descriptor.runtime?.getState?.() || null) : clone(block.runtime?.getState?.() || null),
          children: (node.children || []).map(visit),
        };
      };

      const visitNestedCodeNode = (ownerBlock, node, loopDescriptor = null) => {
        if (!node) return null;
        if (node.type === 'line') {
          return { type: 'line', lineIndex: node.lineIndex, source: node.source };
        }
        if (node.type === 'code') {
          const nested = node.descriptor || null;
          return {
            type: 'code',
            name: node.name,
            path: node.path || '',
            parentPath: node.parentPath || null,
            depth: node.depth,
            language: node.language || '',
            slotLineIndex: node.slotLineIndex,
            id: nested?.id || null,
            parentCodeBlockId: nested?.parentBlockId || ownerBlock?.id || null,
            effective: nested ? clone(effectiveCodeBlockConfig(this, nested)) : null,
            runtime: nested ? clone(nested.runtime?.getState?.() || null) : null,
            diagnostics: clone(node.program?.diagnostics || []),
            children: (node.program?.tree?.children || []).map(childNode => {
              const localLoop = nested?.loops.find(loop => loop.path === childNode.path) || null;
              return visitNestedCodeNode(nested, childNode, localLoop);
            }),
          };
        }
        const descriptor = loopDescriptor
          || ownerBlock?.loops.find(loop => loop.path === node.path)
          || null;
        return {
          type: node.type,
          name: node.name,
          path: node.path || '',
          parentPath: node.parentPath || null,
          depth: node.depth,
          startLine: node.startLine,
          endLine: node.endLine,
          id: descriptor?.id || null,
          effective: descriptor && ownerBlock
            ? clone(effectiveCodeBlockLoopConfig(this, ownerBlock, descriptor))
            : null,
          runtime: descriptor ? clone(descriptor.runtime?.getState?.() || null) : null,
          children: (node.children || []).map(childNode => {
            const localLoop = ownerBlock?.loops.find(loop => loop.path === childNode.path) || null;
            return visitNestedCodeNode(ownerBlock, childNode, localLoop);
          }),
        };
      };

      return visit(block.program.tree);
    }

    getCodeBlockText(id, options = {}) {
      const block = this.resolveCodeBlockDescriptor(id);
      if (!block) return null;
      if (options.visible) return visibleCodeBlockText(block);
      if (options.raw) return block.rawSource;
      return block.source;
    }

    getCodeBlockLoops(blockId) {
      const block = this.resolveCodeBlockDescriptor(blockId);
      if (!block) return [];
      return block.loops.map(loop => ({
        id: loop.id,
        name: loop.name,
        path: loop.path,
        parentPath: loop.parentPath || null,
        depth: loop.depth,
        childPaths: loop.childLoops.map(child => child.path),
        index: loop.index,
        startLine: loop.startLine,
        endLine: loop.endLine,
        cycle: loop.runtime?.cycle ?? loop.cycle ?? 0,
        parameters: clone(loop.parameters || {}),
        markdownOverride: clone(loop.markdownOverride || {}),
        override: clone(loop.override || {}),
        effective: clone(effectiveCodeBlockLoopConfig(this, block, loop)),
        runtime: clone(loop.runtime?.getState?.() || null),
      }));
    }

    resolveCodeBlockLoopDescriptor(block, loopId) {
      const key = String(loopId ?? '');
      const runtimeIndex = block.runtimeIndex;
      if (!runtimeIndex) return null;
      const byId = runtimeIndex.loopsById.get(key);
      if (byId) return byId;
      const byPath = runtimeIndex.loopsByPath.get(key) || [];
      if (byPath.length > 1) {
        throw new Error(`Ambiguous codeblock loop path: ${key}. Fix duplicate sibling loop names or use a runtime id.`);
      }
      if (byPath.length === 1) return byPath[0];
      const byName = runtimeIndex.loopsByName.get(key) || [];
      if (byName.length > 1) {
        throw new Error(`Ambiguous codeblock loop name: ${key}. Use a loop path or id.`);
      }
      return byName[0] || null;
    }

    getCodeBlockLoop(blockId, loopId) {
      const block = this.resolveCodeBlockDescriptor(blockId);
      if (!block) return null;
      const descriptor = this.resolveCodeBlockLoopDescriptor(block, loopId);
      if (!descriptor) return null;
      return this.getCodeBlockLoops(block.id).find(loop => loop.id === descriptor.id) || null;
    }

    setCodeBlockLoop(blockId, loopId, patch = {}) {
      const block = this.resolveCodeBlockDescriptor(blockId);
      if (!block) throw new Error(`Unknown codeblock item: ${blockId}`);
      const loop = this.resolveCodeBlockLoopDescriptor(block, loopId);
      if (!loop) throw new Error(`Unknown codeblock loop: ${loopId}`);
      loop.override = deepMerge(loop.override || {}, clone(patch || {}));
      loop.runtime?.onConfigChanged();
      dispatch('constructor-state', {
        constructor: 'codeblock-loop',
        id: loop.id,
        parentId: block.id,
        state: 'configured',
      });
      return this.getCodeBlockLoop(block.id, loop.id);
    }

    resetCodeBlockLoop(blockId, loopId) {
      const block = this.resolveCodeBlockDescriptor(blockId);
      if (!block) throw new Error(`Unknown codeblock item: ${blockId}`);
      const loop = this.resolveCodeBlockLoopDescriptor(block, loopId);
      if (!loop) throw new Error(`Unknown codeblock loop: ${loopId}`);
      loop.override = {};
      loop.runtime?.onConfigChanged();
      dispatch('constructor-state', {
        constructor: 'codeblock-loop',
        id: loop.id,
        parentId: block.id,
        state: 'reset',
      });
      return this.getCodeBlockLoop(block.id, loop.id);
    }

    startCodeBlockLoop(blockId, loopId) {
      const block = this.resolveCodeBlockDescriptor(blockId);
      if (!block) throw new Error(`Unknown codeblock item: ${blockId}`);
      const loop = this.resolveCodeBlockLoopDescriptor(block, loopId);
      if (!loop) throw new Error(`Unknown codeblock loop: ${loopId}`);
      loop.runtime?.start();
      return this.getCodeBlockLoop(block.id, loop.id);
    }

    stopCodeBlockLoop(blockId, loopId) {
      const block = this.resolveCodeBlockDescriptor(blockId);
      if (!block) throw new Error(`Unknown codeblock item: ${blockId}`);
      const loop = this.resolveCodeBlockLoopDescriptor(block, loopId);
      if (!loop) throw new Error(`Unknown codeblock loop: ${loopId}`);
      loop.runtime?.stop();
      return this.getCodeBlockLoop(block.id, loop.id);
    }

    restartCodeBlockLoop(blockId, loopId) {
      const block = this.resolveCodeBlockDescriptor(blockId);
      if (!block) throw new Error(`Unknown codeblock item: ${blockId}`);
      const loop = this.resolveCodeBlockLoopDescriptor(block, loopId);
      if (!loop) throw new Error(`Unknown codeblock loop: ${loopId}`);
      loop.runtime?.restart();
      return this.getCodeBlockLoop(block.id, loop.id);
    }

    restartCodeBlock(id) {
      const block = this.resolveCodeBlockDescriptor(id);
      if (!block) throw new Error(`Unknown codeblock item: ${id}`);
      block.runtime?.restart();
      return this.getConstructorItem('codeblock', block.id);
    }

    async copyCodeBlock(id) {
      const block = this.resolveCodeBlockDescriptor(id);
      if (!block) throw new Error(`Unknown code block: ${id}`);
      const config = effectiveCodeBlockConfig(this, block);
      const mode = config.copyButton?.mode === 'visible' ? 'visible' : 'source';
      const text = mode === 'visible' ? visibleCodeBlockText(block) : block.source;
      await this.copyText(text);
      return { id: block.id, copyButtonId: block.copyButtonId, text };
    }

    async copyText(text) {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          return;
        } catch (_) {}
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand?.('copy');
      textarea.remove();
      if (!copied) throw new Error('Clipboard copy was not available.');
    }

    bindConstructorUi() {
      if (!this.output || this.boundOutputs.has(this.output)) return;
      const boundOutput = this.output;
      this.boundOutputs.add(boundOutput);
      boundOutput.addEventListener('click', async event => {
        const button = event.target.closest?.('.tw-codeblock-copy');
        if (!button || !boundOutput.contains(button)) return;

        const blockId = button.dataset.copyCodeblock;
        const block = this.resolveCodeBlockDescriptor(blockId);
        if (!block) return;

        const blockConfig = effectiveCodeBlockConfig(this, block);
        const config = blockConfig.copyButton || {};
        const normalLabel = block.copyButton?.dataset.normalLabel || button.textContent || config.label || 'Copy';
        block.copyButton.dataset.normalLabel = normalLabel;

        try {
          await this.copyCodeBlock(block.id);
          button.textContent = config.copiedLabel || 'Copied';
          dispatch('codeblock-copy', {
            noteId: this.currentNote?.id,
            id: block.id,
            copyButtonId: block.copyButtonId,
            language: block.language,
          });
          window.setTimeout(() => {
            if (button.isConnected) button.textContent = normalLabel;
          }, config.feedbackMs);
        } catch (error) {
          this.setStatus(error.message || 'Could not copy code block.');
        }
      });
    }

    applyPresentation() {
      if (HOST_MODE) return;
      document.documentElement.dataset.theme = this.parameters.presentation.theme;
      document.documentElement.style.setProperty('--user-text-size', `${this.parameters.presentation.textSize}px`);
    }

    bindUi() {
      const panel = $('#settingsPanel');
      const toggle = $('#settingsToggle');
      const close = $('#settingsClose');

      const setPanel = open => {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
      };

      toggle.addEventListener('click', () => setPanel(panel.hidden));
      close.addEventListener('click', () => setPanel(false));
      document.addEventListener('keydown', event => {
        if (event.key.toLowerCase() === 's' && !event.metaKey && !event.ctrlKey && !event.altKey && !/input|select|textarea/i.test(event.target?.tagName || '')) {
          setPanel(panel.hidden);
        }
      });

      const playback = $('#playbackRate');
      const playbackScope = $('#playbackScope');
      const textSize = $('#textSize');
      const theme = $('#themeSelect');
      const rotationSpeed = $('#rotationSpeed');
      const rotationHold = $('#rotationHold');
      const rendererMode = $('#rendererMode');
      const headingVelocity = $('#headingVelocity');
      const headingLevels = $('#headingLevels');

      playback.addEventListener('input', () => {
        const rate = 2 ** Number(playback.value);
        this.configure({ playback: { rate } });
      });

      playbackScope?.addEventListener('change', () => {
        this.configure({ playback: { rateScope: playbackScope.value === 'section' ? 'section' : 'document' } });
      });

      textSize.addEventListener('input', () => {
        this.parameters.presentation.textSize = Number(textSize.value);
        $('#textSizeValue').textContent = `${textSize.value} px`;
        this.applyPresentation();
      });

      theme.addEventListener('change', () => {
        this.parameters.presentation.theme = theme.value;
        this.applyPresentation();
      });

      rotationSpeed.addEventListener('input', () => {
        this.configure({ rotation: { speedMs: Number(rotationSpeed.value) } });
        $('#rotationSpeedValue').textContent = `${rotationSpeed.value} ms`;
      });

      rotationHold.addEventListener('input', () => {
        this.configure({ rotation: { holdMs: Number(rotationHold.value), blankHoldMs: Number(rotationHold.value) } });
        $('#rotationHoldValue').textContent = `${rotationHold.value} ms`;
      });

      const markRendererDirty = () => {
        this.parameters.renderer.mode = rendererMode.value;
        this.parameters.renderer.multi.headingVelocity = headingVelocity.value;
        this.parameters.renderer.multi.headingLevels = normalizeHeadingLevels(
          $$('input[type="checkbox"]', headingLevels)
            .filter(input => input.checked)
            .map(input => Number(input.value)),
        );
        this.rendererDirty = true;
        this.setStatus('Renderer settings changed; restart animations to apply them to the current note.');
      };

      rendererMode.addEventListener('change', markRendererDirty);
      headingVelocity.addEventListener('change', markRendererDirty);
      headingLevels.addEventListener('change', markRendererDirty);

      $('#pauseButton').addEventListener('click', () => this.togglePause());
      $('#finishButton')?.addEventListener('click', () => this.finishNow());
      $('#restartButton').addEventListener('click', () => this.restart());
      $('#openButton').addEventListener('click', () => $('#fileInput').click());
      $('#fileInput').addEventListener('change', async event => {
        const file = event.target.files?.[0];
        if (file) await this.loadFile(file);
        event.target.value = '';
      });

      this.syncUiFromParameters();
    }

    syncUiFromParameters() {
      if (HOST_MODE) return;
      const p = this.parameters;
      const exponent = Math.log2(p.playback.rate);
      $('#playbackRate').value = String(clamp(exponent, -2, 6));
      $('#playbackRateValue').textContent = formatRate(p.playback.rate);
      if ($('#playbackScope')) $('#playbackScope').value = p.playback.rateScope === 'section' ? 'section' : 'document';

      $('#textSize').value = String(p.presentation.textSize);
      $('#textSizeValue').textContent = `${p.presentation.textSize} px`;
      $('#themeSelect').value = p.presentation.theme;

      $('#rotationSpeed').value = String(p.rotation.speedMs);
      $('#rotationSpeedValue').textContent = `${p.rotation.speedMs} ms`;
      $('#rotationHold').value = String(p.rotation.holdMs);
      $('#rotationHoldValue').textContent = `${p.rotation.holdMs} ms`;

      $('#rendererMode').value = p.renderer.mode;
      $('#headingVelocity').value = p.renderer.multi.headingVelocity;
      const levels = new Set(normalizeHeadingLevels(p.renderer.multi.headingLevels));
      $$('#headingLevels input[type="checkbox"]').forEach(input => {
        input.checked = levels.has(Number(input.value));
      });
    }

    setStatus(message) {
      if (HOST_MODE) return;
      const status = $('#settingsStatus');
      if (status) status.textContent = message || '';
    }

    togglePause(force) {
      const next = typeof force === 'boolean' ? force : !this.paused;
      if (next !== this.paused) {
        const now = performance.now();
        if (next) {
          this.pauseStartedAtMs = now;
        } else if (this.pauseStartedAtMs !== null) {
          this.accumulatedPausedMs += Math.max(0, now - this.pauseStartedAtMs);
          this.pauseStartedAtMs = null;
        }
      }
      this.paused = next;
      if (HOST_MODE) {
        this.output?.classList.toggle('is-paused', next);
      } else {
        document.body.classList.toggle('is-paused', next);
        const pauseButton = $('#pauseButton');
        if (pauseButton) pauseButton.textContent = next ? 'Resume' : 'Pause';
      }

      // Constructor and rotation effects use the Web Animations API. Pause any
      // animation owned by the rendered Markdown so new constructors inherit
      // pause/resume behavior without needing special-case selectors.
      document.getAnimations().forEach(animation => {
        const target = animation.effect?.target;
        if (!this.output || !target || !(target === this.output || this.output.contains(target))) return;
        try {
          if (next) animation.pause();
          else animation.play();
        } catch (_) {}
      });

      if (!next) {
        this.pauseWaiters.splice(0).forEach(resolve => resolve());
      }
      dispatch(next ? 'paused' : 'resumed', { noteId: this.currentNote?.id });
      return this.paused;
    }

    waitIfPaused(signal) {
      if (signal?.aborted) return Promise.reject(abortError());
      if (!this.paused) return Promise.resolve();

      return new Promise((resolve, reject) => {
        const done = () => {
          signal?.removeEventListener('abort', onAbort);
          resolve();
        };
        const onAbort = () => {
          const index = this.pauseWaiters.indexOf(done);
          if (index >= 0) this.pauseWaiters.splice(index, 1);
          reject(abortError());
        };
        signal?.addEventListener('abort', onAbort, { once: true });
        this.pauseWaiters.push(done);
      });
    }

    async waitInternal(ms, signal) {
      if (signal?.aborted) throw abortError();
      let remaining = Math.max(0, Number(ms) || 0);

      // Count only active time. A long pause must not silently consume a hold,
      // punctuation delay, or rotation delay while the renderer is suspended.
      while (remaining > 0) {
        await this.waitIfPaused(signal);
        if (signal?.aborted) throw abortError();

        const slice = Math.min(24, remaining);
        const started = performance.now();
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            signal?.removeEventListener('abort', onAbort);
            resolve();
          }, slice);
          const onAbort = () => {
            clearTimeout(timer);
            reject(abortError());
          };
          signal?.addEventListener('abort', onAbort, { once: true });
        });
        remaining -= Math.max(0, performance.now() - started);
      }
    }

    async wait(ms, signal) {
      if (this.fastForward) {
        if (signal?.aborted) throw abortError();
        return;
      }
      return this.waitInternal(ms, signal);
    }

    // Persistent loops keep their clocks even while Finish Now is fast-forwarding
    // the finite writeable surface. This prevents a zero-delay runaway loop.
    async waitLoop(ms, signal) {
      return this.waitInternal(ms, signal);
    }

    async nextFrame(signal) {
      if (signal?.aborted) throw abortError();
      if (this.fastForward) return;
      return this.nextLoopFrame(signal);
    }

    async nextLoopFrame(signal) {
      if (signal?.aborted) throw abortError();
      await this.waitIfPaused(signal);
      await new Promise((resolve, reject) => {
        const onAbort = () => reject(abortError());
        signal?.addEventListener('abort', onAbort, { once: true });
        requestAnimationFrame(() => {
          signal?.removeEventListener('abort', onAbort);
          if (signal?.aborted) reject(abortError());
          else resolve();
        });
      });
    }

    async waitForAnimations(animations, signal) {
      if (signal?.aborted) throw abortError();
      if (this.fastForward) {
        animations.forEach(animation => {
          try { animation.finish(); } catch (_) { try { animation.cancel(); } catch (_) {} }
        });
        return;
      }
      const onAbort = () => animations.forEach(animation => animation.cancel());
      signal?.addEventListener('abort', onAbort, { once: true });
      try {
        await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
        if (signal?.aborted) throw abortError();
      } finally {
        signal?.removeEventListener('abort', onAbort);
      }
    }

    createUtilityPlayer() {
      // Repeating rotations need the same tempo/backspace helpers as normal
      // sections, but they do not own render progress.
      const fakeSection = {
        id: 'rotation-loop',
        depth: 0,
        headingComplete: true,
        complete: false,
      };
      const player = new TypewriterPlayer(this, fakeSection, [], -1, null);
      player.effectivePlaybackRate = () => Math.max(0.01, this.parameters.playback.rate);
      return player;
    }

    rebuildRuntimeIndexes() {
      this.codeBlocksById.clear();
      this.codeBlocksByCopyId.clear();
      this.constructorIndexes.clear();

      for (const [name, adapter] of Object.entries(CONSTRUCTOR_ADAPTERS)) {
        const byId = new Map();
        const aliases = new Map();
        for (const item of this[adapter.collection] || []) {
          byId.set(item.id, item);
          if (name === 'styledlinks' && item.href) aliases.set(String(item.href), item);
          if (name === 'codeblock' && item.copyButtonId) aliases.set(String(item.copyButtonId), item);
        }
        this.constructorIndexes.set(name, { byId, aliases });
      }

      for (const block of this.currentCodeBlocks || []) {
        this.codeBlocksById.set(block.id, block);
        if (block.copyButtonId) this.codeBlocksByCopyId.set(block.copyButtonId, block);

        const loopsById = new Map();
        const loopsByPath = new Map();
        const loopsByName = new Map();
        for (const loop of block.loops || []) {
          loopsById.set(loop.id, loop);
          if (!loopsByPath.has(loop.path)) loopsByPath.set(loop.path, []);
          loopsByPath.get(loop.path).push(loop);
          if (!loopsByName.has(loop.name)) loopsByName.set(loop.name, []);
          loopsByName.get(loop.name).push(loop);
        }

        const childBlocksByHostLine = new Map();
        for (const child of block.childCodeBlocks || []) {
          const line = Number(child.hostLineIndex);
          if (!childBlocksByHostLine.has(line)) childBlocksByHostLine.set(line, []);
          childBlocksByHostLine.get(line).push(child);
        }

        block.runtimeIndex = {
          loopsById,
          loopsByPath,
          loopsByName,
          childBlocksByHostLine,
        };
      }
    }

    resolveCodeBlockDescriptor(id) {
      const key = String(id ?? '');
      return this.codeBlocksById.get(key) || this.codeBlocksByCopyId.get(key) || null;
    }

    getRuntimeState() {
      const now = performance.now();
      const timing = this.runTiming ? {
        startedAt: this.runTiming.startedAt,
        completedAt: this.runTiming.completedAt || null,
        elapsedMs: this.runTiming.completedAtMs !== null
          ? this.runTiming.elapsedMs
          : Math.max(0, now - this.runTiming.startedAtMs),
        pausedMs: this.runTiming.completedAtMs !== null
          ? this.runTiming.pausedMs
          : this.accumulatedPausedMs + (this.pauseStartedAtMs !== null ? Math.max(0, now - this.pauseStartedAtMs) : 0),
        activeElapsedMs: this.runTiming.completedAtMs !== null
          ? this.runTiming.activeElapsedMs
          : Math.max(0, now - this.runTiming.startedAtMs - this.accumulatedPausedMs - (this.pauseStartedAtMs !== null ? Math.max(0, now - this.pauseStartedAtMs) : 0)),
        complete: this.runTiming.completedAtMs !== null,
      } : null;
      return {
        timing,
        fastForward: this.fastForward === true,
        coordinator: this.renderCoordinator.getState(),
        scheduler: this.scheduler?.getState?.() || null,
        flow: this.getProgressiveFlowState(),
        rotation: this.rotationController?.getState?.() || {},
        indexes: {
          codeBlocks: this.codeBlocksById.size,
          copyIds: this.codeBlocksByCopyId.size,
          loopIds: [...this.codeBlocksById.values()]
            .reduce((count, block) => count + (block.runtimeIndex?.loopsById.size || 0), 0),
          constructorItems: [...this.constructorIndexes.values()]
            .reduce((count, index) => count + index.byId.size, 0),
          constructorEffectLoops: Object.values(CONSTRUCTOR_ADAPTERS)
            .flatMap(adapter => this[adapter.collection] || [])
            .reduce((count, item) => count + Object.values(item.effectRuntimes || {}).filter(runtime => runtime?.getState?.().running).length, 0),
        },
      };
    }

    flowConfig() {
      const flow = this.parameters?.renderer?.flow || {};
      return {
        progressiveLayout: flow.progressiveLayout !== false,
        pendingSections: flow.pendingSections === 'reserve' ? 'reserve' : 'collapse',
        pendingBlocks: flow.pendingBlocks === 'reserve' ? 'reserve' : 'collapse',
        bridge: flow.bridge !== false,
        preserveScrollAnchor: flow.preserveScrollAnchor !== false,
      };
    }

    isProgressiveBlockElement(element) {
      if (!(element instanceof Element)) return false;
      const selector = 'h1,h2,h3,h4,h5,h6,p,ul,ol,li,blockquote,pre,table,hr,figure,.tw-codeblock';
      if (!element.matches(selector)) return false;
      const codeBlock = element.closest('.tw-codeblock');
      return !codeBlock || codeBlock === element;
    }

    progressiveBlocksForNode(node) {
      if (!node || !this.output) return [];
      let element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
      const blocks = [];
      while (element && element !== this.output) {
        if (this.isProgressiveBlockElement(element)) blocks.push(element);
        element = element.parentElement;
      }
      return blocks;
    }

    findFlowScrollContainer() {
      if (!this.output) return null;
      let element = this.output.parentElement;
      while (element && element !== document.body && element !== document.documentElement) {
        const style = getComputedStyle(element);
        if (/(auto|scroll)/.test(style.overflowY || '') && element.scrollHeight > element.clientHeight + 1) {
          return element;
        }
        element = element.parentElement;
      }
      return document.scrollingElement || document.documentElement;
    }

    captureFlowAnchor() {
      const config = this.flowConfig();
      if (!config.progressiveLayout || !config.preserveScrollAnchor || !this.output) return null;
      const scroller = this.findFlowScrollContainer();
      if (!scroller) return null;
      const documentScroller = scroller === document.scrollingElement || scroller === document.documentElement || scroller === document.body;
      const viewport = documentScroller
        ? { top: 0, bottom: window.innerHeight }
        : scroller.getBoundingClientRect();
      const candidates = [...this.output.querySelectorAll('[data-tw-render-phase="active"], [data-tw-render-phase="complete"]')];
      const anchor = candidates.find(element => {
        if (element.classList.contains('tw-block-pending') || element.classList.contains('tw-section-pending')) return false;
        const rect = element.getBoundingClientRect();
        return rect.height > 0 && rect.bottom > viewport.top + 1 && rect.top < viewport.bottom - 1;
      });
      if (!anchor) return null;
      return {
        scroller,
        documentScroller,
        anchor,
        top: anchor.getBoundingClientRect().top,
      };
    }

    restoreFlowAnchor(snapshot) {
      if (!snapshot?.anchor?.isConnected) return;
      const nextTop = snapshot.anchor.getBoundingClientRect().top;
      const delta = nextTop - snapshot.top;
      if (!Number.isFinite(delta) || Math.abs(delta) < 0.5) return;
      if (snapshot.documentScroller) window.scrollBy(0, delta);
      else snapshot.scroller.scrollTop += delta;
    }

    prepareProgressiveLayout(sections = this.sections) {
      const config = this.flowConfig();
      for (const section of sections || []) {
        section.flowPhase = 'pending';
        section.flowBridge = null;
        section.flowBlocks = new Set();
        section.flowRootElements = (section.nodes || []).filter(node => node?.nodeType === Node.ELEMENT_NODE);

        section.flowRootElements.forEach(element => {
          element.dataset.twSectionId = section.id;
          element.dataset.twSectionPhase = 'pending';
          if (config.progressiveLayout && config.pendingSections === 'collapse') {
            element.classList.add('tw-section-pending');
          }
        });

        for (const operation of section.operations || []) {
          for (const block of this.progressiveBlocksForNode(operation.node)) {
            section.flowBlocks.add(block);
          }
        }

        section.flowBlocks.forEach(block => {
          block.dataset.twRenderPhase = 'pending';
          if (config.progressiveLayout && config.pendingBlocks === 'collapse') {
            block.classList.add('tw-block-pending');
          }
        });
      }
    }

    activateSectionFlow(section) {
      const config = this.flowConfig();
      if (!section || !config.progressiveLayout || section.flowPhase === 'complete') return;
      const roots = section.flowRootElements || [];
      const changed = roots.some(element => element.classList.contains('tw-section-pending'));
      const anchor = changed ? this.captureFlowAnchor() : null;
      section.flowPhase = 'active';
      roots.forEach(element => {
        element.classList.remove('tw-section-pending');
        element.dataset.twSectionPhase = 'active';
      });
      this.updateSectionFlowBridge(section);
      if (anchor) this.restoreFlowAnchor(anchor);
    }

    activateProgressiveNode(node, section = null) {
      const config = this.flowConfig();
      if (!config.progressiveLayout || !node) return;
      if (section) this.activateSectionFlow(section);
      const blocks = this.progressiveBlocksForNode(node);
      const changed = blocks.some(block => block.classList.contains('tw-block-pending'));
      const anchor = changed ? this.captureFlowAnchor() : null;
      blocks.forEach(block => {
        block.classList.remove('tw-block-pending');
        block.dataset.twRenderPhase = 'active';
      });
      if (section) this.updateSectionFlowBridge(section);
      if (anchor) this.restoreFlowAnchor(anchor);
    }

    updateSectionFlowBridge(section) {
      const config = this.flowConfig();
      if (!section || !config.progressiveLayout || !config.bridge || section.flowPhase === 'complete' || !this.output) {
        section?.flowBridge?.remove?.();
        if (section) section.flowBridge = null;
        return;
      }

      const pending = [...(section.flowBlocks || [])].some(block => block.classList.contains('tw-block-pending'));
      if (!pending) {
        section.flowBridge?.remove?.();
        section.flowBridge = null;
        return;
      }

      const roots = section.flowRootElements || [];
      const activeRoots = roots.filter(root => {
        if (root.classList.contains('tw-section-pending')) return false;
        if (root.dataset.twRenderPhase === 'active' || root.dataset.twRenderPhase === 'complete') return true;
        return !!root.querySelector?.('[data-tw-render-phase="active"], [data-tw-render-phase="complete"]');
      });
      const lastActive = activeRoots[activeRoots.length - 1];
      if (!lastActive?.isConnected || lastActive.parentNode !== this.output) {
        section.flowBridge?.remove?.();
        section.flowBridge = null;
        return;
      }

      if (!section.flowBridge) {
        const bridge = document.createElement('div');
        bridge.className = 'tw-gap-bridge';
        bridge.setAttribute('aria-hidden', 'true');
        bridge.dataset.twSectionId = section.id;
        section.flowBridge = bridge;
      }
      lastActive.after(section.flowBridge);
    }

    completeSectionFlow(section) {
      if (!section) return;
      section.flowPhase = 'complete';
      (section.flowRootElements || []).forEach(element => {
        element.classList.remove('tw-section-pending');
        element.dataset.twSectionPhase = 'complete';
      });
      (section.flowBlocks || new Set()).forEach(block => {
        if (!block.classList.contains('tw-block-pending')) block.dataset.twRenderPhase = 'complete';
      });
      section.flowBridge?.remove?.();
      section.flowBridge = null;
    }

    finalizeProgressiveLayout() {
      if (!this.output) return;
      this.output.querySelectorAll('.tw-section-pending').forEach(element => element.classList.remove('tw-section-pending'));
      this.output.querySelectorAll('.tw-block-pending').forEach(element => element.classList.remove('tw-block-pending'));
      this.output.querySelectorAll('[data-tw-section-phase]').forEach(element => { element.dataset.twSectionPhase = 'complete'; });
      this.output.querySelectorAll('[data-tw-render-phase]').forEach(element => { element.dataset.twRenderPhase = 'complete'; });
      this.output.querySelectorAll('.tw-gap-bridge').forEach(element => element.remove());
      for (const section of this.sections || []) {
        section.flowPhase = 'complete';
        section.flowBridge = null;
      }
    }

    getProgressiveFlowState() {
      const config = this.flowConfig();
      if (!this.output) {
        return {
          enabled: config.progressiveLayout,
          pendingSections: 0,
          pendingBlocks: 0,
          activeBlocks: 0,
          bridges: 0,
        };
      }
      return {
        enabled: config.progressiveLayout,
        pendingSectionPolicy: config.pendingSections,
        pendingBlockPolicy: config.pendingBlocks,
        bridge: config.bridge,
        preserveScrollAnchor: config.preserveScrollAnchor,
        pendingSections: this.output.querySelectorAll('.tw-section-pending').length,
        pendingBlocks: this.output.querySelectorAll('.tw-block-pending').length,
        activeBlocks: this.output.querySelectorAll('[data-tw-render-phase="active"]').length,
        bridges: this.output.querySelectorAll('.tw-gap-bridge').length,
      };
    }

    compileMarkdown(markdown, noteId) {
      const preparedMarkdown = preprocessCodeViewportSyntax(markdown);
      const html = window.marked.parse(preparedMarkdown, { gfm: true });
      const template = document.createElement('template');
      template.innerHTML = html;
      sanitizeRenderedDom(template.content);

      // Attribute blocks are parsed before text priming so the metadata itself
      // never becomes a typewriter operation. Constructors consume the stored
      // metadata later and can layer it above presets without touching Markdown.
      extractInlineConstructorMetadata(template.content);
      preprocessCommands(template.content);

      // One shared ID registry prevents explicit Markdown IDs from colliding
      // across different constructors inside the same note.
      const usedConstructorIds = new Set();
      Object.entries(CONSTRUCTOR_ADAPTERS).forEach(([name, adapter]) => {
        this[adapter.collection] = adapter.construct
          ? adapter.construct(template.content, noteId, this, usedConstructorIds)
          : [];
      });
      this.rebuildRuntimeIndexes();
      return template.content;
    }

    stopCurrentRun() {
      this.fastForward = false;
      this.abortController.abort();
      this.pauseWaiters.splice(0).forEach(resolve => resolve());
      this.abortController = new AbortController();
      this.scheduler = null;
      this.rotationController = new RotationController(this);
      this.paused = false;
      if (HOST_MODE) {
        this.output?.classList.remove('is-paused');
      } else {
        document.body.classList.remove('is-paused');
        const pauseButton = $('#pauseButton');
        if (pauseButton) pauseButton.textContent = 'Pause';
      }
    }

    async loadNote(input, options = {}) {
      if (!input || typeof input.markdown !== 'string') {
        throw new TypeError('loadNote() requires { markdown: string }.');
      }
      if (options.output) this.mount(options.output);
      if (!this.output) throw new Error('Markdown Typewriter has no mounted output element.');

      // Reloading a note and restarting its animation are different operations.
      // A fresh load resolves defaults + note parameters. A runtime restart must
      // preserve the live in-memory configuration (including renderer controls)
      // and rebuild only the animation/runtime state.
      const preserveRuntimeParameters = options.preserveRuntimeParameters === true;
      const liveParameters = preserveRuntimeParameters ? clone(this.parameters) : null;

      this.stopCurrentRun();
      const finishNow = options.finishNow === true;
      this.fastForward = finishNow;
      this.output.classList.add('preparing');
      this.output.replaceChildren();

      this.noteSpecificParameters = clone(input.parameters || {});
      if (preserveRuntimeParameters) {
        this.parameters = this.validateParameters(liveParameters);
      } else {
        const baseUi = this.loadInitialParameters();
        this.parameters = this.validateParameters(deepMerge(baseUi, this.noteSpecificParameters));
      }
      this.applyPresentation();
      this.syncUiFromParameters();
      this.rendererDirty = false;

      const noteId = String(input.id || `note-${hashString(input.markdown)}`);
      const sourceHash = hashString(input.markdown);
      const note = {
        id: noteId,
        markdown: input.markdown,
        sourceHash,
        origin: input.origin || 'api',
        parameters: this.noteSpecificParameters,
      };
      this.currentNote = note;
      this.accumulatedPausedMs = 0;
      this.pauseStartedAtMs = null;
      this.runTiming = {
        startedAt: new Date().toISOString(),
        startedAtMs: performance.now(),
        completedAt: null,
        completedAtMs: null,
        elapsedMs: 0,
        pausedMs: 0,
        activeElapsedMs: 0,
      };

      const fragment = this.compileMarkdown(input.markdown, noteId);
      this.output.appendChild(fragment);

      const sections = buildSections(this.output, this.parameters);
      sections.forEach(section => {
        const plan = collectOperations(section);
        section.operations = plan.operations;
        section.headingLastIndex = plan.headingLastIndex;
      });

      this.sections = sections;
      this.sections.forEach(section => {
        section.player = new TypewriterPlayer(
          this,
          section,
          section.operations,
          section.headingLastIndex,
        );
      });
      this.prepareProgressiveLayout(this.sections);

      // Everything above happens while hidden so every run starts from a clean,
      // deterministic in-memory state.
      this.output.classList.remove('preparing');
      const rootCodeBlocks = this.currentCodeBlocks.filter(block => !block.parentBlockId);

      this.scheduler = new SectionScheduler(this, this.sections);
      this.setStatus(`Rendering ${this.sections.length} section${this.sections.length === 1 ? '' : 's'}.`);

      dispatch('note-loaded', {
        id: noteId,
        sourceHash,
        sectionCount: this.sections.length,
        rendererMode: this.parameters.renderer.mode,
        headingVelocity: this.parameters.renderer.multi.headingVelocity,
        codeBlockCount: this.currentCodeBlocks.length,
        rootCodeBlockCount: rootCodeBlocks.length,
        nestedCodeBlockCount: this.currentCodeBlocks.length - rootCodeBlocks.length,
        styledLinkCount: this.currentStyledLinks.length,
        strikeoutCount: this.currentStrikeouts.length,
        strongCount: this.currentStrong.length,
        emphasisCount: this.currentEmphasis.length,
        listItemCount: this.currentListItems.length,
        constructorCounts: Object.fromEntries(
          Object.entries(CONSTRUCTOR_ADAPTERS)
            .map(([name, adapter]) => [name, (this[adapter.collection] || []).length]),
        ),
      });

      await Promise.all([
        this.scheduler.run(),
        ...rootCodeBlocks.map(block => block.runtime?.whenReady?.() || Promise.resolve()),
      ]);
      this.finalizeProgressiveLayout();
      const completedAtMs = performance.now();
      if (this.pauseStartedAtMs !== null) {
        this.accumulatedPausedMs += Math.max(0, completedAtMs - this.pauseStartedAtMs);
        this.pauseStartedAtMs = completedAtMs;
      }
      if (this.runTiming) {
        const elapsedMs = Math.max(0, completedAtMs - this.runTiming.startedAtMs);
        this.runTiming.completedAt = new Date().toISOString();
        this.runTiming.completedAtMs = completedAtMs;
        this.runTiming.elapsedMs = elapsedMs;
        this.runTiming.pausedMs = this.accumulatedPausedMs;
        this.runTiming.activeElapsedMs = Math.max(0, elapsedMs - this.accumulatedPausedMs);
      }
      this.fastForward = false;
      this.setStatus(finishNow ? 'Note finished.' : 'Note complete.');
      dispatch('note-complete', {
        id: noteId,
        sourceHash,
        elapsedMs: this.runTiming?.elapsedMs || 0,
        activeElapsedMs: this.runTiming?.activeElapsedMs || 0,
        pausedMs: this.runTiming?.pausedMs || 0,
        finishedNow: finishNow,
      });
      return this.getState();
    }

    async finishNow() {
      if (!this.currentNote) return null;
      const note = clone(this.currentNote);
      return this.loadNote({
        id: note.id,
        markdown: note.markdown,
        origin: note.origin,
        parameters: this.noteSpecificParameters,
      }, {
        preserveRuntimeParameters: true,
        finishNow: true,
      });
    }

    async restart() {
      if (!this.currentNote) return null;
      const note = clone(this.currentNote);
      return this.loadNote({
        id: note.id,
        markdown: note.markdown,
        origin: note.origin,
        parameters: this.noteSpecificParameters,
      }, {
        preserveRuntimeParameters: true,
      });
    }

    async restartAll() {
      return this.currentNote ? this.restart() : null;
    }

    async loadFile(file) {
      const markdown = await file.text();
      return this.loadNote({
        id: `file:${file.name}:${file.size}:${file.lastModified}`,
        markdown,
        origin: 'file',
      });
    }

    async loadUrl(url) {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Could not load ${url}: ${response.status}`);
      const markdown = await response.text();
      return this.loadNote({ id: `url:${url}`, markdown, origin: 'url' });
    }

    installDropZone() {
      let dragDepth = 0;
      window.addEventListener('dragenter', event => {
        if (![...event.dataTransfer?.types || []].includes('Files')) return;
        dragDepth += 1;
        document.body.classList.add('drop-active');
      });
      window.addEventListener('dragleave', () => {
        dragDepth = Math.max(0, dragDepth - 1);
        if (!dragDepth) document.body.classList.remove('drop-active');
      });
      window.addEventListener('dragover', event => event.preventDefault());
      window.addEventListener('drop', async event => {
        event.preventDefault();
        dragDepth = 0;
        document.body.classList.remove('drop-active');
        const file = event.dataTransfer?.files?.[0];
        if (file) await this.loadFile(file);
      });
    }

    async bootstrap() {
      const params = new URLSearchParams(location.search);
      const src = params.get('src');

      try {
        if (src) {
          await this.loadUrl(src);
          return;
        }

        await this.loadUrl('content.md');
      } catch (error) {
        console.warn(error);
        const fallback = $('#fallbackContent')?.textContent || '# Markdown Typewriter\n\nOpen a Markdown file to begin.';
        await this.loadNote({ id: 'fallback', markdown: fallback, origin: 'fallback' });
      }
    }
  }

  const app = new MarkdownTypewriterApp();

  const publicApi = {
    version: APP_VERSION,

    getApiSurface() {
      return {
        version: APP_VERSION,
        methods: Object.keys(publicApi).filter(key => typeof publicApi[key] === 'function'),
        events: [...API_EVENTS],
        constructors: Object.keys(CONSTRUCTOR_DEFINITIONS),
        runtime: {
          statelessAcrossReloads: true,
          recursiveCodeBlocks: true,
          recursiveLoops: true,
          indexedLookup: true,
          coordinatedPlayback: true,
        },
      };
    },

    configure(patch, options) {
      return app.configure(patch, options);
    },

    loadNote(note, options) {
      return app.loadNote(note, options);
    },

    getParameters() {
      return app.getParameters();
    },

    getState() {
      return app.getState();
    },

    getRuntimeState() {
      return app.getRuntimeState();
    },

    getHeadingVelocityPresets() {
      return clone(app.parameters.renderer.multi.velocityPresets || HEADING_VELOCITY_PRESETS);
    },

    getControlSchema() {
      return app.getControlSchema();
    },

    getControlInventory() {
      return app.getControlInventory();
    },

    getConstructors() {
      return app.getConstructors();
    },

    configureConstructor(name, patch, options) {
      return app.configureConstructor(name, patch, options);
    },

    getConstructorSchema(name) {
      return app.getConstructorSchema(name);
    },

    getConstructorPresets(name) {
      return app.getConstructorPresets(name);
    },

    configureConstructorPreset(name, preset, patch, options) {
      return app.configureConstructorPreset(name, preset, patch, options);
    },

    getConstructorItems(name) {
      return app.getConstructorItems(name);
    },

    getConstructorItem(name, id) {
      return app.getConstructorItem(name, id);
    },

    getConstructorEffectiveConfig(name, id) {
      return app.getConstructorEffectiveConfig(name, id);
    },

    setConstructorItem(name, id, patch) {
      return app.setConstructorItem(name, id, patch);
    },

    resetConstructorItem(name, id) {
      return app.resetConstructorItem(name, id);
    },

    refreshConstructor(name) {
      return app.refreshConstructor(name);
    },

    replayConstructorItem(name, id, options) {
      return app.replayConstructorItem(name, id, options);
    },

    getConstructorRuntime(name, id, effect) {
      return app.getConstructorRuntime(name, id, effect);
    },

    startConstructorLoop(name, id, options) {
      return app.startConstructorLoop(name, id, options);
    },

    stopConstructorLoop(name, id, options) {
      return app.stopConstructorLoop(name, id, options);
    },

    restartConstructorLoop(name, id, options) {
      return app.restartConstructorLoop(name, id, options);
    },

    getStrongRuns() {
      return app.getStrongRuns();
    },

    getEmphasisRuns() {
      return app.getEmphasisRuns();
    },

    getListItems() {
      return app.getListItems();
    },

    getStyledLinks() {
      return app.getStyledLinks();
    },

    getStyledLink(id) {
      return app.getStyledLink(id);
    },

    setStyledLink(id, patch) {
      return app.setStyledLink(id, patch);
    },

    resetStyledLink(id) {
      return app.resetStyledLink(id);
    },

    getStrikeouts() {
      return app.getStrikeouts();
    },

    getStrikeout(id) {
      return app.getStrikeout(id);
    },

    setStrikeout(id, patch) {
      return app.setStrikeout(id, patch);
    },

    resetStrikeout(id) {
      return app.resetStrikeout(id);
    },

    getCodeBlocks() {
      return app.getCodeBlocks();
    },

    getCodeBlockTree(id) {
      return app.getCodeBlockTree(id);
    },

    getCodeBlockText(id, options) {
      return app.getCodeBlockText(id, options);
    },

    getCodeBlockLoops(blockId) {
      return app.getCodeBlockLoops(blockId);
    },

    getCodeBlockLoop(blockId, loopId) {
      return app.getCodeBlockLoop(blockId, loopId);
    },

    setCodeBlockLoop(blockId, loopId, patch) {
      return app.setCodeBlockLoop(blockId, loopId, patch);
    },

    resetCodeBlockLoop(blockId, loopId) {
      return app.resetCodeBlockLoop(blockId, loopId);
    },

    startCodeBlockLoop(blockId, loopId) {
      return app.startCodeBlockLoop(blockId, loopId);
    },

    stopCodeBlockLoop(blockId, loopId) {
      return app.stopCodeBlockLoop(blockId, loopId);
    },

    restartCodeBlockLoop(blockId, loopId) {
      return app.restartCodeBlockLoop(blockId, loopId);
    },

    restartCodeBlock(id) {
      return app.restartCodeBlock(id);
    },

    copyCodeBlock(id) {
      return app.copyCodeBlock(id);
    },

    setPlaybackRate(rate) {
      return app.configure({ playback: { rate } });
    },

    pause() {
      return app.togglePause(true);
    },

    resume() {
      return app.togglePause(false);
    },

    finishNow() {
      return app.finishNow();
    },

    restart() {
      return app.restart();
    },

    restartAll() {
      return app.restartAll();
    },

  };

  // Host compatibility methods are intentionally non-enumerable so the public
  // v2.9 API inventory remains stable while Backpack retains its embedding
  // lifecycle and generic resize helper.
  Object.defineProperties(publicApi, {
    createInstance: {
      value: () => {
        const instance = new MarkdownTypewriterApp();
        const isolated = {
          version: APP_VERSION,
          getApiSurface: () => publicApi.getApiSurface(),
          configure: (patch, options) => instance.configure(patch, options),
          loadNote: (note, options) => instance.loadNote(note, options),
          getParameters: () => instance.getParameters(),
          getState: () => instance.getState(),
          getRuntimeState: () => instance.getRuntimeState(),
          getControlSchema: () => instance.getControlSchema(),
          getControlInventory: () => instance.getControlInventory(),
          getConstructors: () => instance.getConstructors(),
          setPlaybackRate: rate => instance.configure({ playback: { rate } }),
          pause: () => instance.togglePause(true),
          resume: () => instance.togglePause(false),
          finishNow: () => instance.finishNow(),
          restart: () => instance.restart(),
          restartAll: () => instance.restartAll(),
        };
        Object.defineProperties(isolated, {
          mount: { value: output => instance.mount(output) },
          unmount: { value: () => instance.unmount() },
          togglePause: { value: () => instance.togglePause() },
          observeElementSize: { value: publicApi.observeElementSize },
        });
        return isolated;
      },
    },
    mount: { value: output => app.mount(output) },
    unmount: { value: () => app.unmount() },
    togglePause: { value: () => app.togglePause() },
    observeElementSize: {
      value: (element, callback, options = {}) => {
        if (!(element instanceof Element) || typeof callback !== 'function') return () => {};
        const immediate = options.immediate !== false;
        const emit = () => {
          const rect = element.getBoundingClientRect();
          callback({ width: rect.width, height: rect.height, rect });
        };
        let observer = null;
        if ('ResizeObserver' in window) {
          observer = new ResizeObserver(emit);
          observer.observe(element);
        } else {
          window.addEventListener('resize', emit);
        }
        if (immediate) requestAnimationFrame(emit);
        return () => {
          observer?.disconnect();
          if (!observer) window.removeEventListener('resize', emit);
        };
      },
    },
  });

  window.MarkdownTypewriter = publicApi;
  dispatch('ready', { version: APP_VERSION, api: publicApi });

  // A host such as Backpack can set window.MARKDOWN_TYPEWRITER_AUTOSTART = false
  // before app.js loads and call MarkdownTypewriter.loadNote(...) itself.
  if (window.MARKDOWN_TYPEWRITER_AUTOSTART !== false) {
    app.bootstrap();
  }
})();
