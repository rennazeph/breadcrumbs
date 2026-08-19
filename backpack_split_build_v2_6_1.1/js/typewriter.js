(() => {
  "use strict";

  const DEFAULTS = Object.freeze({
    speed: 42,
    rotationSpeed: 260,
    rotationHold: 1000
  });

  const segmenter = "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;
  const graphemes = value => segmenter
    ? [...segmenter.segment(String(value ?? ""))].map(item => item.segment)
    : Array.from(String(value ?? ""));

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
  const escapeAttr = escapeHTML;

  function clampNumber(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(min, Math.min(max, number));
  }

  function normalizeSettings(input = {}) {
    return {
      speed: clampNumber(input.speed, DEFAULTS.speed, 8, 180),
      rotationSpeed: clampNumber(input.rotationSpeed, DEFAULTS.rotationSpeed, 60, 900),
      rotationHold: clampNumber(input.rotationHold, DEFAULTS.rotationHold, 100, 3000)
    };
  }

  function create(root, initialSettings = {}) {
    if (!(root instanceof Element)) throw new Error("Typewriter requires a rendered output element.");

    const state = {
      source: "",
      runId: 0,
      paused: false,
      tempo: 1,
      colourStack: [null],
      bgStack: [null],
      mainCaret: null,
      loops: new Set(),
      settings: normalizeSettings(initialSettings),
      destroyed: false
    };

    function directiveHTML(kind, value = "") {
      return `<span class="mtw-directive" data-kind="${escapeAttr(kind)}" data-value="${escapeAttr(value)}"></span>`;
    }

    function parseDirective(raw) {
      const text = raw.replace(/^\\?<!--\s*/i, "").replace(/\s*(?:--)?\s*>$/, "");
      const index = text.indexOf(":");
      const name = (index < 0 ? text : text.slice(0, index)).trim();
      const value = index < 0 ? "" : text.slice(index + 1).trim();
      const lower = name.toLowerCase();
      if (["tempo", "textcolour", "textcolor", "textbg", "slotrotation", "deleterotation", "strikerotation", "slot", "delete", "strike"].includes(lower)) {
        return { kind: lower === "textcolor" ? "textcolour" : lower, value };
      }
      if (lower === "typo") return { kind: "typo", value };
      return null;
    }

    function protectInlineCodeAndDirectives(text) {
      const protectedParts = [];
      const token = html => {
        const index = protectedParts.push(html) - 1;
        return `\u0000P${index}\u0000`;
      };

      text = text.replace(/(`+)([\s\S]*?)\1/g, (_, ticks, body) => token(`<code>${escapeHTML(body)}</code>`));
      text = text.replace(/\\<([^<>]*)><([^<>]*)>/g, (_, wrong, right) => token(directiveHTML("typo", `${wrong}|${right}`)));
      text = text.replace(/\\?<!--\s*(?:tempo|typo|slotrotation|deleterotation|strikerotation|slot|delete|strike)\s*(?::[\s\S]*?)?--\s*>/gi, raw => {
        const directive = parseDirective(raw);
        return directive ? token(directiveHTML(directive.kind, directive.value)) : raw;
      });
      text = text.replace(/\\?<!--\s*(?:textcolou?r|textbg)\s*(?::[\s\S]*?)?\s*(?:--)?\s*>/gi, raw => {
        const directive = parseDirective(raw);
        return directive ? token(directiveHTML(directive.kind, directive.value)) : raw;
      });

      text = escapeHTML(text);
      text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (whole, alt, src, title) => {
        if (!/^(https?:|data:image\/|\.\/|\.\.\/|\/)/i.test(src)) return escapeHTML(whole);
        return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${title ? ` title="${escapeAttr(title)}"` : ""}>`;
      });
      text = text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, label, href, title) => {
        if (!/^(https?:|mailto:|#|\.\/|\.\.\/|\/)/i.test(href)) return label;
        const external = /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${escapeAttr(href)}"${title ? ` title="${escapeAttr(title)}"` : ""}${external}>${label}</a>`;
      });
      text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
      text = text.replace(/~~([^~]+)~~/g, "<del>$1</del>");
      text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
      text = text.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
      text = text.replace(/  \n/g, "<br>");
      return text.replace(/\u0000P(\d+)\u0000/g, (_, index) => protectedParts[Number(index)]);
    }

    function isBlockStart(lines, index) {
      const line = lines[index] || "";
      if (!line.trim()) return true;
      return /^\s*```/.test(line)
        || /^\s{0,3}#{1,6}\s+/.test(line)
        || /^\s{0,3}>\s?/.test(line)
        || /^\s{0,3}([-*+]\s+|\d+[.)]\s+)/.test(line)
        || /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line);
    }

    function parseMarkdown(markdown) {
      const lines = String(markdown ?? "").replace(/\r\n?/g, "\n").split("\n");
      let html = "";
      for (let index = 0; index < lines.length;) {
        const line = lines[index];
        if (!line.trim()) { index += 1; continue; }

        const fence = line.match(/^\s*```\s*([^\s`]*)\s*$/);
        if (fence) {
          const language = fence[1];
          let body = "";
          index += 1;
          while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
            body += (body ? "\n" : "") + lines[index++];
          }
          if (index < lines.length) index += 1;
          html += `<pre><code${language ? ` class="language-${escapeAttr(language)}"` : ""}>${escapeHTML(body)}</code></pre>`;
          continue;
        }

        const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
        if (heading) {
          const level = heading[1].length;
          html += `<h${level}>${protectInlineCodeAndDirectives(heading[2])}</h${level}>`;
          index += 1;
          continue;
        }

        if (/^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
          html += "<hr>";
          index += 1;
          continue;
        }

        if (/^\s{0,3}>\s?/.test(line)) {
          const bits = [];
          while (index < lines.length && /^\s{0,3}>\s?/.test(lines[index])) bits.push(lines[index++].replace(/^\s{0,3}>\s?/, ""));
          html += `<blockquote><p>${protectInlineCodeAndDirectives(bits.join("\n"))}</p></blockquote>`;
          continue;
        }

        const unordered = line.match(/^\s{0,3}([-*+])\s+(.+)$/);
        const ordered = line.match(/^\s{0,3}(\d+)[.)]\s+(.+)$/);
        if (unordered || ordered) {
          const isOrdered = Boolean(ordered);
          html += isOrdered ? "<ol>" : "<ul>";
          while (index < lines.length) {
            const match = isOrdered
              ? lines[index].match(/^\s{0,3}\d+[.)]\s+(.+)$/)
              : lines[index].match(/^\s{0,3}[-*+]\s+(.+)$/);
            if (!match) break;
            html += `<li>${protectInlineCodeAndDirectives(match[1])}</li>`;
            index += 1;
          }
          html += isOrdered ? "</ol>" : "</ul>";
          continue;
        }

        if (index + 1 < lines.length && line.includes("|") && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])) {
          const split = value => value.trim().replace(/^\||\|$/g, "").split("|").map(part => part.trim());
          const headers = split(line);
          index += 2;
          const rows = [];
          while (index < lines.length && lines[index].includes("|") && lines[index].trim()) rows.push(split(lines[index++]));
          html += "<table><thead><tr>" + headers.map(value => `<th>${protectInlineCodeAndDirectives(value)}</th>`).join("") + "</tr></thead><tbody>";
          for (const row of rows) html += "<tr>" + row.map(value => `<td>${protectInlineCodeAndDirectives(value)}</td>`).join("") + "</tr>";
          html += "</tbody></table>";
          continue;
        }

        const paragraph = [line];
        index += 1;
        while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) paragraph.push(lines[index++]);
        html += `<p>${protectInlineCodeAndDirectives(paragraph.join("\n"))}</p>`;
      }
      return html;
    }

    function normalizeColour(raw) {
      let value = String(raw || "").trim();
      if (!value) return null;
      value = value.replace(/^\*\*(.*?)\*\*$/, "$1").trim();
      if (/^\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(value)) value = `rgb${value}`;
      if (/^\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}$/.test(value)) value = `rgb(${value})`;
      if (window.CSS?.supports("color", value)) return value;
      console.warn("Ignored invalid typewriter colour:", raw);
      return null;
    }

    const splitWords = value => String(value || "").split("|").map(word => word.trim()).filter(Boolean);
    const activeStyle = () => ({ color: state.colourStack.at(-1), backgroundColor: state.bgStack.at(-1) });
    function applyActiveStyle(element, style = activeStyle()) {
      if (style.color) element.style.color = style.color;
      if (style.backgroundColor) element.style.backgroundColor = style.backgroundColor;
    }

    async function wait(milliseconds, runId) {
      let left = milliseconds;
      while (left > 0 && runId === state.runId && !state.destroyed) {
        while (state.paused && runId === state.runId && !state.destroyed) await new Promise(resolve => setTimeout(resolve, 40));
        const slice = Math.min(35, left);
        await new Promise(resolve => setTimeout(resolve, slice));
        left -= slice;
      }
      return runId === state.runId && !state.destroyed;
    }

    function charDelay(text, index) {
      const base = state.settings.speed;
      if (state.tempo === 1) return base;
      let start = index;
      let end = index;
      while (start > 0 && /[\p{L}\p{N}'-]/u.test(text[start - 1])) start -= 1;
      while (end < text.length && /[\p{L}\p{N}'-]/u.test(text[end])) end += 1;
      const length = Math.max(1, graphemes(text.slice(start, end)).length);
      if (state.tempo > 1) {
        const shortness = Math.max(0, Math.min(1, (8 - length) / 7));
        return base * Math.max(.42, 1 - (state.tempo - 1) * .38 * shortness);
      }
      const longness = Math.max(0, Math.min(1, (length - 4) / 9));
      return base * (1 + (1 / state.tempo - 1) * .34 * longness);
    }

    function moveMainCaret(afterNode) {
      if (!state.mainCaret || !afterNode?.parentNode) return;
      afterNode.parentNode.insertBefore(state.mainCaret, afterNode.nextSibling);
    }

    async function typeTextNode(node, runId) {
      const text = node._mtwText ?? node.nodeValue;
      if (!text) return;
      delete node._mtwText;
      const span = document.createElement("span");
      span.className = "typed-segment";
      applyActiveStyle(span);
      node.replaceWith(span);
      moveMainCaret(span);
      const segments = graphemes(text);
      let codeUnits = 0;
      for (let index = 0; index < segments.length && runId === state.runId; index += 1) {
        span.textContent += segments[index];
        codeUnits += segments[index].length;
        moveMainCaret(span);
        let delay = charDelay(text, Math.max(0, codeUnits - 1));
        if (/[.!?]/.test(segments[index])) delay *= 2.8;
        else if (/[,;:]/.test(segments[index])) delay *= 1.7;
        else if (/\s/.test(segments[index])) delay *= .55;
        if (state.tempo !== 1) delay *= .90 + Math.random() * .20;
        await wait(delay, runId);
      }
    }

    async function typeInto(element, word, runId, speedFactor = 1) {
      element.textContent = "";
      for (const character of graphemes(word)) {
        if (runId !== state.runId || state.destroyed) return false;
        element.textContent += character;
        await wait(Math.max(12, state.settings.speed * speedFactor), runId);
      }
      return true;
    }

    async function deleteFrom(element, runId) {
      const segments = graphemes(element.textContent);
      while (segments.length && runId === state.runId && !state.destroyed) {
        segments.pop();
        element.textContent = segments.join("");
        await wait(Math.max(18, state.settings.rotationSpeed * .18), runId);
      }
    }

    function measureSlot(slot, words) {
      if (!slot?.isConnected) return;
      const parent = slot.parentNode || root;
      const probe = document.createElement("span");
      probe.style.cssText = "position:fixed;left:-10000px;top:0;visibility:hidden;white-space:pre;pointer-events:none";
      parent.appendChild(probe);
      let width = 0;
      for (const word of words) {
        probe.textContent = word;
        width = Math.max(width, probe.getBoundingClientRect().width);
      }
      probe.remove();
      slot.style.width = `${Math.ceil(width) + 1}px`;
    }

    function measureRotationSlots() {
      root.querySelectorAll(".rotation-slot[data-words]").forEach(slot => {
        try { measureSlot(slot, JSON.parse(slot.dataset.words)); } catch (_) {}
      });
    }

    async function cubeSwap(slot, nextWord, runId) {
      if (runId !== state.runId || !slot.isConnected) return;
      const current = slot.querySelector(".rotation-face.current");
      const inner = slot.querySelector(".rotation-slot-inner");
      if (!current || !inner) return;
      const incoming = document.createElement("span");
      incoming.className = "rotation-face incoming";
      incoming.textContent = nextWord;
      applyActiveStyle(incoming, slot._capturedStyle || {});
      inner.appendChild(incoming);
      slot.style.setProperty("--rot-ms", `${state.settings.rotationSpeed}ms`);
      void slot.offsetWidth;
      slot.classList.add("cube-turn");
      await wait(state.settings.rotationSpeed, runId);
      if (runId !== state.runId || !slot.isConnected) return;
      current.remove();
      incoming.classList.remove("incoming");
      incoming.classList.add("current");
      slot.classList.remove("cube-turn");
    }

    function createSlot(words, style) {
      const slot = document.createElement("span");
      slot.className = "rotation-slot";
      slot.dataset.words = JSON.stringify(words);
      slot._capturedStyle = style;
      const sizer = document.createElement("span");
      sizer.className = "rotation-slot-sizer";
      sizer.setAttribute("aria-hidden", "true");
      sizer.textContent = words[0] || "M";
      const inner = document.createElement("span");
      inner.className = "rotation-slot-inner";
      const face = document.createElement("span");
      face.className = "rotation-face current";
      applyActiveStyle(face, style);
      inner.appendChild(face);
      slot.append(sizer, inner);
      return { slot, face };
    }

    async function runSlot(words, looping, directive, runId) {
      const style = activeStyle();
      const { slot, face } = createSlot(words, style);
      directive.replaceWith(slot);
      measureSlot(slot, words);
      moveMainCaret(slot);
      await typeInto(face, words[0], runId, 1);
      if (runId !== state.runId) return;
      if (looping) {
        attachRotationCaret(slot, style);
        const job = (async () => {
          let index = 0;
          while (runId === state.runId && !state.destroyed) {
            await wait(state.settings.rotationHold, runId);
            index = (index + 1) % words.length;
            await cubeSwap(slot, words[index], runId);
          }
        })();
        state.loops.add(job);
        job.finally(() => state.loops.delete(job));
        return;
      }
      for (let index = 1; index < words.length && runId === state.runId; index += 1) {
        await wait(state.settings.rotationHold, runId);
        await cubeSwap(slot, words[index], runId);
      }
    }

    function attachRotationCaret(target, style) {
      const caret = document.createElement("span");
      caret.className = "rotation-caret";
      caret.setAttribute("aria-hidden", "true");
      if (style.color) caret.style.color = style.color;
      target.parentNode.insertBefore(caret, target.nextSibling);
      return caret;
    }

    function createLinearRotation(className, words, style, directive) {
      const wrap = document.createElement("span");
      wrap.className = className;
      wrap.dataset.words = JSON.stringify(words);
      applyActiveStyle(wrap, style);
      directive.replaceWith(wrap);
      return wrap;
    }

    async function runDelete(words, looping, directive, runId) {
      const style = activeStyle();
      const wrap = createLinearRotation("rotation-delete-text", words, style, directive);
      moveMainCaret(wrap);
      await typeInto(wrap, words[0], runId, 1);
      if (runId !== state.runId) return;
      const cycle = async endless => {
        let index = 0;
        do {
          await wait(state.settings.rotationHold, runId);
          await deleteFrom(wrap, runId);
          if (runId !== state.runId) return;
          await wait(state.settings.rotationHold, runId);
          index = (index + 1) % words.length;
          await typeInto(wrap, words[index], runId, .8);
        } while (endless ? runId === state.runId : index < words.length - 1);
      };
      if (looping) {
        attachRotationCaret(wrap, style);
        const job = cycle(true);
        state.loops.add(job);
        job.finally(() => state.loops.delete(job));
      } else await cycle(false);
    }

    async function strikeOnce(wrap, runId, leave = false) {
      wrap.style.setProperty("--rot-ms", `${state.settings.rotationSpeed}ms`);
      wrap.classList.add("striking");
      await wait(state.settings.rotationSpeed, runId);
      wrap.classList.remove("striking");
      wrap.classList.add("struck");
      if (!leave) await wait(Math.max(120, state.settings.rotationHold * .45), runId);
    }

    async function runStrike(words, looping, directive, runId) {
      const style = activeStyle();
      const wrap = createLinearRotation("rotation-strike-text", words, style, directive);
      moveMainCaret(wrap);
      await typeInto(wrap, words[0], runId, 1);
      if (runId !== state.runId) return;
      const cycle = async endless => {
        let index = 0;
        while (runId === state.runId && !state.destroyed) {
          await wait(state.settings.rotationHold, runId);
          const final = !endless && index === words.length - 1;
          await strikeOnce(wrap, runId, final);
          if (final) return;
          await deleteFrom(wrap, runId);
          wrap.classList.remove("struck");
          index = (index + 1) % words.length;
          await typeInto(wrap, words[index], runId, .8);
          if (!endless && index === words.length - 1) {
            await wait(state.settings.rotationHold, runId);
            await strikeOnce(wrap, runId, true);
            return;
          }
        }
      };
      if (looping) {
        attachRotationCaret(wrap, style);
        const job = cycle(true);
        state.loops.add(job);
        job.finally(() => state.loops.delete(job));
      } else await cycle(false);
    }

    async function runTypo(value, directive, runId) {
      const [wrong = "", right = ""] = value.split("|");
      const span = document.createElement("span");
      span.className = "typed-segment";
      applyActiveStyle(span);
      directive.replaceWith(span);
      moveMainCaret(span);
      await typeInto(span, wrong, runId, 1);
      await wait(state.settings.speed * 3, runId);
      await deleteFrom(span, runId);
      await typeInto(span, right, runId, 1);
    }

    async function processDirective(element, runId) {
      const kind = element.dataset.kind;
      const value = element.dataset.value || "";
      if (kind === "tempo") {
        const parts = value.split("/").map(Number);
        const tempo = parts.length === 2 ? parts[0] / parts[1] : Number(value);
        if (Number.isFinite(tempo) && tempo > 0) state.tempo = Math.max(.25, Math.min(4, tempo));
        element.remove();
        return;
      }
      if (kind === "textcolour") {
        if (value) {
          const colour = normalizeColour(value);
          state.colourStack.push(colour || state.colourStack.at(-1));
        } else if (state.colourStack.length > 1) state.colourStack.pop();
        element.remove();
        return;
      }
      if (kind === "textbg") {
        if (value) {
          const colour = normalizeColour(value);
          state.bgStack.push(colour || state.bgStack.at(-1));
        } else if (state.bgStack.length > 1) state.bgStack.pop();
        element.remove();
        return;
      }
      if (kind === "typo") return runTypo(value, element, runId);
      const words = splitWords(value);
      if (!words.length) { element.remove(); return; }
      if (kind === "slotrotation") return runSlot(words, true, element, runId);
      if (kind === "deleterotation") return runDelete(words, true, element, runId);
      if (kind === "strikerotation") return runStrike(words, true, element, runId);
      if (kind === "slot") return runSlot(words, false, element, runId);
      if (kind === "delete") return runDelete(words, false, element, runId);
      if (kind === "strike") return runStrike(words, false, element, runId);
    }

    async function walk(node, runId) {
      if (runId !== state.runId || state.destroyed) return;
      if (node.nodeType === Node.TEXT_NODE) return typeTextNode(node, runId);
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.classList.contains("mtw-directive")) return processDirective(node, runId);
      if (["IMG", "HR", "BR"].includes(node.tagName)) { moveMainCaret(node); return; }
      for (const child of [...node.childNodes]) await walk(child, runId);
    }

    function primeTypingTree(container) {
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      for (const node of textNodes) {
        node._mtwText = node.nodeValue;
        node.nodeValue = "";
      }
    }

    async function start(source = state.source) {
      state.source = String(source ?? "");
      state.runId += 1;
      const runId = state.runId;
      state.paused = false;
      state.tempo = 1;
      state.colourStack = [null];
      state.bgStack = [null];
      state.loops.clear();

      // Parse into a detached staging tree. Text is primed while detached, and
      // top-level Markdown blocks are moved into the live reader only when the
      // typewriter reaches them. This prevents empty heading rules, <hr>, code
      // boxes, tables, and images from appearing before their turn.
      const staging = document.createElement("div");
      staging.innerHTML = parseMarkdown(state.source);
      primeTypingTree(staging);

      const caret = document.createElement("span");
      caret.className = "main-caret";
      caret.setAttribute("aria-hidden", "true");
      state.mainCaret = caret;
      root.replaceChildren(caret);

      const blocks = [...staging.childNodes];
      for (const block of blocks) {
        if (runId !== state.runId || state.destroyed) break;

        // The caret may currently live inside the previous block. Move it back
        // to the reader edge, insert the next block immediately before it, then
        // let walk() reveal/type that block.
        root.appendChild(caret);
        root.insertBefore(block, caret);
        await walk(block, runId);
        if (runId === state.runId && !state.destroyed) root.appendChild(caret);
      }
      return runId === state.runId;
    }

    function setPaused(paused) {
      state.paused = Boolean(paused);
      return state.paused;
    }

    function togglePause() {
      return setPaused(!state.paused);
    }

    function updateSettings(nextSettings = {}) {
      state.settings = normalizeSettings({ ...state.settings, ...nextSettings });
      measureRotationSlots();
      return { ...state.settings };
    }

    function destroy() {
      state.destroyed = true;
      state.paused = false;
      state.runId += 1;
      state.loops.clear();
      state.mainCaret = null;
    }

    const resizeHandler = () => measureRotationSlots();
    window.addEventListener("resize", resizeHandler);
    const originalDestroy = destroy;
    function destroyWithResizeCleanup() {
      window.removeEventListener("resize", resizeHandler);
      originalDestroy();
    }

    return Object.freeze({
      start,
      restart: () => start(state.source),
      setPaused,
      togglePause,
      updateSettings,
      getSettings: () => ({ ...state.settings }),
      isPaused: () => state.paused,
      destroy: destroyWithResizeCleanup
    });
  }

  window.BackpackTypewriter = Object.freeze({
    create,
    defaults: DEFAULTS
  });
})();
