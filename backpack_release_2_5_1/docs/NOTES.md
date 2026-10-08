# Notes workspace — Release 2.5.1

Notes supports up to nine uploaded `.md`, `.markdown`, or `.txt` documents. The first file chosen by **Load File** fills/replaces the active tab; later files fill free tabs.

Markdown uses bundled **Markdown Typewriter 2.9.0-draft.18** when Typewriter presentation is enabled. TXT remains literal/static.

## Markdown rhythm

Static Markdown uses one coherent document flow. Serializer whitespace between block elements is structural and is discarded instead of becoming visible `<br>` rows. Headings, paragraphs, lists, blockquotes, and code blocks therefore use the reader/card spacing contract rather than browser-default book spacing.

## Fenced code languages

Notes code fences may declare one of the first shipping language set:

````markdown
```verse
...
```
````

````markdown
```js
...
```
````

````markdown
```python
...
```
````

Unknown labels render as plain code. Backpack does not infer a language from code content. This whitelist applies to Notes fenced Markdown only; Drawing Board Code cards keep their separate language field.

Code roles use a restrained semantic theme palette so highly saturated Accent colours do not automatically become code background/text combinations.

## Layout and Typewriter rails

Notes measures its own live container. When the active theme's reader minimum plus Typewriter rail requirements fit, Controls/Runtime may dock beside the reader. Otherwise they become drawers without changing document semantics.

Compact and Readable density alter footprint; Presentation controls the visual grammar. These responsibilities are separate so tactile themes cannot force small utility controls beyond their available width.

## Document lifecycle

Each loaded Markdown document supports:

- **Restart on return**
- **Do not restart**
- **Once per Load**
- **Persist in background**

**Finish Now** completes finite work immediately while persistent constructor/CODE/Rotation loops retain their intended runtime clocks.
