# Markdown Typewriter v2.9 — Runtime/API Showcase <!--HeadingLine-->

This document exercises the bundled **Markdown Typewriter 2.9.0-draft.18** renderer, constructors, runtime tree, animation channels, and API-addressable controls. Use Backpack's **Controls** rail to change behavior and the **Runtime** rail to inspect the live document while it types.

Backpack deliberately separates the engine's literal values from its teaching UI: perceptual sliders and slowed miniature previews make controls easier to read, while exact numeric fields and the running document continue to use the real Typewriter API values.

Normal typing can shift <!--tempo:3/2-->into a quicker tempo<!--tempo:1--> and return to baseline without changing runtime ownership.

A deliberate typ<!--typo:w|e-->able correction exercises shared playback/backspace behavior.

## Control surface contract

`getControlSchema()` defines the semantic families used by the host: **Pace**, **Holds**, **Repetition**, **Toggles**, and **Presentation**. `getControlInventory()` supplies the current document targets, values, timing sources, preview metadata, and primary/inherited visibility. Backpack groups those controls without hard-coding constructor-specific panels.

Presentation is intentionally separate from authored content: pace scope, renderer mode, and heading scheduling can be changed from the top of the Controls rail, while progressive-flow behavior and constructor availability remain runtime-addressable toggles.

## Colour and scope commands

This is <!--textcolour:#ff5f56-->red<!--textcolour-->, this is <!--textcolour:#2fbf71-->green<!--textcolour-->, and nested scopes restore correctly: <!--textcolour:#ff5f56-->outer red, <!--textcolour:#56a8ff-->inner blue<!--textcolour-->, red again<!--textcolour-->.

<!--textbg:#111111--><!--textcolour:#f5f5f5-->Foreground and background commands can be combined without changing constructor ownership.<!--textcolour--><!--textbg-->

## Rotation family <!--HeadingLine-->

A status slot can rotate independently: <!--SlotRotation:queued|typing|reviewing|complete--> while this sentence keeps rendering.

Deletion rotation: <!--DeleteRotation:draft|reviewed|approved-->.

Strike rotation: <!--StrikeRotation:wrong|checking|ready-->.

The non-repeating forms use the same effect families once and then release the document: slot <!--Slot:queued|complete-->, delete <!--Delete:draft|approved-->, and strike <!--Strike:wrong|ready-->.

# Concurrent renderer branch A

With the Multi renderer active, top-level and selected nested headings can have independent section players while all character emission still passes through the shared playback engine.

## Branch A.1

This nested section is useful for switching **Renderer mode** between `single` and `multi`, changing **Heading scheduling**, and then using `restart()` to verify that the live presentation selection is preserved.

### Branch A.1.a

The indentation heading preset gives deeper sections their own velocity multiplier without granting them ownership over Code Block or Loop policy.

# Concurrent renderer branch B <!--HeadingLine-->

This sibling branch exists to make section concurrency visible when `renderer.mode = "multi"`.

## Styled Link constructor

A [glow target](https://example.com){#api-glow-link glow-enabled glow-trigger=hover glow-color="#7ab7ff" glow-blur=14 glow-opacity=0.75} is API-addressable and can be switched between hover glow, always-on glow, and disabled glow.

Repeat policy is authored in source and echoed by the Repetition inspector; for this link the declaration uses `reveal-loop`.

A [repeating reveal target](https://example.net){#api-reveal-link preset=subtle open=emit-only reveal-beats=3 reveal-min-duration=280 reveal-max-duration=900 reveal-from-opacity=0.12 reveal-from-transform="translateY(0.20em) scale(0.96)" reveal-loop=2200ms} owns a separate reveal effect channel so its motion can repeat without competing with hover glow.

A [button-style target](https://example.org){#api-button-link preset=button open=emit-only hover-scale=1.10} demonstrates source metadata plus live runtime override precedence.

## Strikeout, Strong, and Emphasis constructors

This ~~retired behavior~~{#api-strike preset=emphatic velocity=inherit duration-beats=1 animation-loop=2400ms} exposes the strikeout item API and draws its line on the same character beat as the surrounding typing cadence.

This **API-controlled strong run**{#api-strong preset=pulse pulse-velocity=inherit pulse-beats=2.5 pulse-min-duration=180 pulse-max-duration=700 pulse-scale=1.22 pulse-count=2 pulse-loop=2800ms} can be restyled through the generic constructor item API.

This *API-controlled cursive run*{#api-emphasis preset=cursive cursive-letter-rate=2.2 cursive-word-pause=75} demonstrates constructor-owned typing policy layered above shared character emission.

## List constructor tree

- Stable vignette{#api-list-stable vignette-text="•"}
- Pulsing vignette{#api-list-pulse preset=pulse vignette-text="◆" vignette-scale=1.55 vignette-count=2 vignette-loop=1800ms}
- Rotating vignette{#api-list-rotate preset=rotate vignette-text="▸" vignette-beats=3 vignette-loop=2200ms}
- Live API target{#api-list-live preset=lively vignette-text="✦" vignette-trigger=complete vignette-scale=1.45 vignette-loop=2600ms}
  - Nested constructor item{#api-list-child vignette=pulse vignette-text="›" vignette-scale=1.5}

1. Ordered numbering is retained{#api-ordered-one vignette=rotate}
2. Ordered vignettes remain independently configurable{#api-ordered-two vignette=pulse vignette-scale=1.45}

## Recursive CODE / LOOP ownership tree

CODE repetition is explicit: each `<!--LOOP:Name ...-->` declaration becomes a named runtime whose source declaration, effective values, and visible owner can be inspected separately.

The next viewport is intentionally dense. `showcase-root` owns an `Outer` loop. That loop contains `showcase-worker`, which owns its own `Pulse` loop and `showcase-grandchild`. The child runtimes are addressable from the API but do not start globally; their parent host slots expose them.

<!--CODE:VERSE-->
<CODEBLOCK>id=showcase-root,Hold:10s,render:indentation
# Root tier A
The root viewport owns this line.

<!--LOOP:Outer Hold=4s,rate=1.15-->
Outer loop begins.

<!--CODE:PY-->
<CODEBLOCK>id=showcase-worker,Hold=0ms,render:sequence
print("worker activated by parent host")

<!--LOOP:Pulse Hold=2s,rate=1.35-->
print("worker-local Pulse cycle")
<!--/LOOP:Pulse-->

<!--CODE:C++-->
<CODEBLOCK>id=showcase-grandchild,Hold=0ms,render:sequence
std::cout << "grandchild owns its own viewport";
<!--/CODE-->

print("worker continues independently")
<!--/CODE-->

Outer loop continues after exposing the child host.
<!--/LOOP:Outer-->

# Root tier B
This starts with the other depth-one section under indentation scheduling.

<!--LOOP:Sibling Hold=5s,rate=0.95-->
Sibling loop owns a separate timer and does not share `Outer` replay policy.
<!--/LOOP:Sibling-->

## Root tier depth two
This tier waits for depth one according to the block's own renderer policy.
<!--/CODE-->

## Independent sibling root viewport

This second root Code Block runs independently from `showcase-root`. Use the concurrency controls to cap simultaneous character emitters without changing either block's replay decisions.

<!--CODE:TEXT-->
<CODEBLOCK>id=showcase-sibling,Hold=12s,render:sequence
Sibling root starts.
<!--LOOP:Heartbeat Hold=3s,rate=1.0-->
heartbeat: tick
<!--/LOOP:Heartbeat-->
Sibling root ends.
<!--/CODE-->

## Ordinary fenced Code Block constructor

```js id=showcase-fence copy-id=copy-showcase-fence title="Normal fenced constructor"
async function inspectFramework() {
  const api = MarkdownTypewriter.getApiSurface();
  const runtime = MarkdownTypewriter.getRuntimeState();
  const controls = MarkdownTypewriter.getControlInventory();
  const schema = MarkdownTypewriter.getControlSchema();
  const tree = MarkdownTypewriter.getCodeBlockTree('showcase-root');
  const strong = MarkdownTypewriter.getConstructorEffectiveConfig('strong', 'api-strong');
  const loops = MarkdownTypewriter.getCodeBlockLoops('showcase-root');
  return { api, runtime, controls, schema, tree, strong, loops };
}
```

## Runtime introspection

The Runtime rail can inspect `getState()`, `getRuntimeState()`, the recursive CODE tree, effective constructor configuration, control inventory, and the machine-readable API surface while the note is still animating.

The architectural distinction is visible in those snapshots: the recursive tree describes **ownership**, runtime maps provide **identity lookup**, the coordinator reports **capacity**, individual runtimes retain **behavioral policy**, and the control inventory describes how those behaviors can be manipulated without replacing source Markdown.

## Backpack host lifecycle boundary <!--HeadingLine-->

`Restart on return`, `Do not restart`, `Once per Load`, and `Persist in background` are Backpack host policies around the Typewriter instance rather than Markdown commands. `Finish Now` delegates to `finishNow()` for finite work while persistent loops keep their own clocks. This separation is intentional: Typewriter owns rendering/runtime truth; Backpack owns workspace lifecycle and presentation.
