(() => {
  "use strict";

  /***************************************************************************
   * Backpack 2.3 core configuration
   ***************************************************************************/
  const CONFIG = Object.freeze({
    appVersion: "2.3.0",
    workspaceSchema: 2,
    workspaceFormat: "the-backpack-workspace",
    boardFormat: "the-backpack-drawing-board",
    storageKey: "the-backpack-state-v2",
    legacyStorageKeys: ["the-backpack-alpha-state-v1"],
    notesMaxDocuments: 4,
    drawingBoard: Object.freeze({
      columns: 24,
      rows: 18,
      defaultW: 4,
      defaultH: 3,
      collapsedH: 1,
      minW: 2,
      minH: 3,
      maxOverlapCells: 1
    })
  });

  const THEMES = Object.freeze([
    { id: "goldenrod", name: "Goldenrod", icon: "◆", shortLabel: "Gold" },
    { id: "lime-analog", name: "Lime Analog", icon: "▰", shortLabel: "Lime" },
    { id: "grayscale", name: "Grayscale", icon: "◫", shortLabel: "Gray" },
    { id: "deep-red", name: "Deep Red", icon: "▣", shortLabel: "Red" }
  ]);

  const NOTE_COLORS = Object.freeze(["#ffd166", "#a7f3d0", "#bfdbfe", "#fecdd3", "#ddd6fe", "#fef3c7"]);
  const URL_PATTERN = /\b((?:https?:\/\/|www\.)[^\s<>"']+)/gi;
  const ALLOWED_RICH_TAGS = new Set(["A", "B", "STRONG", "I", "EM", "U", "S", "BR", "DIV", "P", "UL", "OL", "LI", "CODE", "PRE", "BLOCKQUOTE"]);

  const DEFAULT_STATE = Object.freeze({
    schemaVersion: CONFIG.workspaceSchema,
    appVersion: CONFIG.appVersion,
    activeTab: "notes",
    headerQuote: "Markdown notes and a visual card workspace",
    preferences: Object.freeze({
      theme: "goldenrod",
      appMode: "dark",
      readerMode: "light",
      density: "compact"
    }),
    notes: Object.freeze({
      activeId: "note_1",
      documents: Object.freeze([
        Object.freeze({
          id: "note_1",
          title: "Note 1",
          markdown: "",
          source: "Upload required",
          fileName: ""
        })
      ])
    }),
    drawingBoard: Object.freeze({
      notes: Object.freeze([]),
      nextZ: 1
    })
  });

  const runtime = {
    dataMenuOpen: false,
    displayMenuOpen: false,
    openLinksNoteId: ""
  };

  let appState = null;

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

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
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

  function getTheme(themeId = appState?.preferences?.theme) {
    return THEMES.find(theme => theme.id === themeId) || THEMES[0];
  }

  function getNextThemeId(themeId = appState?.preferences?.theme) {
    const index = THEMES.findIndex(theme => theme.id === themeId);
    return THEMES[(index < 0 ? 0 : index + 1) % THEMES.length].id;
  }

  /***************************************************************************
   * Markdown renderer
   * Deliberately small: raw HTML is escaped and links are limited to HTTP(S).
   ***************************************************************************/
  function inlineMarkdown(text) {
    let value = escapeHTML(text);
    value = value.replace(/`([^`]+)`/g, "<code>$1</code>");
    value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    value = value.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    value = value.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|#[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return value;
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
    const output = [];
    let code = null;
    let list = "";

    const closeList = () => {
      if (list) output.push(`</${list}>`);
      list = "";
    };

    for (const line of lines) {
      if (line.trim().startsWith("```") || line.trim().startsWith("~~~")) {
        if (code === null) {
          closeList();
          code = [];
        } else {
          output.push(`<pre><code>${escapeHTML(code.join("\n"))}</code></pre>`);
          code = null;
        }
        continue;
      }
      if (code !== null) {
        code.push(line);
        continue;
      }
      if (!line.trim()) {
        closeList();
        continue;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        closeList();
        const level = heading[1].length;
        output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
        continue;
      }

      const quote = line.match(/^>\s+(.+)$/);
      if (quote) {
        closeList();
        output.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
        continue;
      }

      const unordered = line.match(/^[-*]\s+(.+)$/);
      const ordered = line.match(/^\d+\.\s+(.+)$/);
      if (unordered || ordered) {
        const nextList = unordered ? "ul" : "ol";
        if (list && list !== nextList) closeList();
        if (!list) {
          output.push(`<${nextList}>`);
          list = nextList;
        }
        output.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
        continue;
      }

      closeList();
      output.push(`<p>${inlineMarkdown(line)}</p>`);
    }

    closeList();
    if (code !== null) output.push(`<pre><code>${escapeHTML(code.join("\n"))}</code></pre>`);
    return output.join("\n");
  }

  function placeholderContext() {
    const now = new Date();
    return {
      TODAY: dateKey(now),
      CURRENT_DATE: now.toLocaleDateString(),
      CURRENT_MONTH: `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`,
      CURRENT_YEAR: String(now.getFullYear()),
      HEADER_QUOTE: appState?.headerQuote || DEFAULT_STATE.headerQuote
    };
  }

  function parsePlaceholders(text) {
    const context = placeholderContext();
    return String(text ?? "").replace(/\{\{\s*([A-Z0-9_-]+)\s*\}\}/g, (full, key) => (
      Object.prototype.hasOwnProperty.call(context, key) ? context[key] : full
    ));
  }

  /***************************************************************************
   * Notes state and rendering
   ***************************************************************************/
  function titleFromFileName(fileName, fallbackIndex = 1) {
    const stem = String(fileName || "")
      .replace(/\.(?:md|markdown)$/i, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return (stem || `Note ${fallbackIndex}`).slice(0, 48);
  }

  function createEmptyDocument(index = 1) {
    return {
      id: uid("note"),
      title: `Note ${index}`,
      markdown: "",
      source: "Upload required",
      fileName: ""
    };
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
        fileName: /\.(?:md|markdown)$/i.test(possibleFile) ? possibleFile : ""
      }];
    }

    documents = documents.map((document, index) => ({
      id: String(document?.id || uid("note")),
      title: String(document?.title || titleFromFileName(document?.fileName, index + 1)).slice(0, 48),
      markdown: String(document?.markdown || ""),
      source: String(document?.source || "Upload required"),
      fileName: String(document?.fileName || "")
    }));

    if (!documents.length) documents.push(createEmptyDocument(1));
    const activeId = documents.some(document => document.id === source.activeId)
      ? source.activeId
      : documents[0].id;
    return { activeId, documents };
  }

  function getActiveDocument() {
    appState.notes = normalizeNotes(appState.notes);
    return appState.notes.documents.find(document => document.id === appState.notes.activeId)
      || appState.notes.documents[0];
  }

  function renderFileButton(inputId, label, { multiple = false } = {}) {
    return `<label class="bp-file-button">⬆ ${escapeHTML(label)}<input id="${inputId}" type="file" accept=".md,.markdown,text/markdown,text/plain"${multiple ? " multiple" : ""} /></label>`;
  }

  async function loadNotesDocuments(files) {
    const incoming = Array.from(files || []);
    if (!incoming.length) return;
    appState.notes = normalizeNotes(appState.notes);
    let firstLoadedId = "";
    let loaded = 0;
    let skipped = 0;

    for (const file of incoming) {
      let target = appState.notes.documents.find(document => !document.markdown && !document.fileName);
      if (!target && appState.notes.documents.length < CONFIG.notesMaxDocuments) {
        target = createEmptyDocument(appState.notes.documents.length + 1);
        appState.notes.documents.push(target);
      }
      if (!target) {
        skipped += 1;
        continue;
      }
      target.markdown = await file.text();
      target.fileName = file.name;
      target.title = titleFromFileName(file.name, appState.notes.documents.indexOf(target) + 1);
      target.source = `Uploaded ${file.name}`;
      firstLoadedId ||= target.id;
      loaded += 1;
    }

    if (firstLoadedId) appState.notes.activeId = firstLoadedId;
    saveState();
    renderApp();
    const skippedText = skipped ? ` ${skipped} file${skipped === 1 ? "" : "s"} skipped because all four tabs are occupied.` : "";
    showToast(`${loaded} Markdown note${loaded === 1 ? "" : "s"} loaded.${skippedText}`);
  }

  async function replaceActiveDocument(file) {
    if (!file) return;
    const active = getActiveDocument();
    active.markdown = await file.text();
    active.fileName = file.name;
    active.title = titleFromFileName(file.name, appState.notes.documents.indexOf(active) + 1);
    active.source = `Uploaded ${file.name}`;
    saveState();
    renderApp();
    showToast("Current Markdown note replaced.");
  }

  function addEmptyDocument() {
    appState.notes = normalizeNotes(appState.notes);
    if (appState.notes.documents.length >= CONFIG.notesMaxDocuments) {
      showToast("Notes already has four document tabs.");
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
    if (active.markdown && !confirm(`Close “${active.title}” and remove its cached Markdown?`)) return;
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

  function renderNotes() {
    appState.notes = normalizeNotes(appState.notes);
    const active = getActiveDocument();
    const hasMarkdown = Boolean(active.markdown);
    const canAdd = appState.notes.documents.length < CONFIG.notesMaxDocuments;
    return `
      <section class="bp-panel bp-notes-panel">
        <div class="bp-panel-header bp-notes-header">
          <div class="bp-section-title">
            <h2>Notes</h2>
            <span class="bp-section-kicker">Four-document Markdown shelf</span>
          </div>
          <span class="bp-pill">${appState.notes.documents.length}/${CONFIG.notesMaxDocuments}</span>
        </div>

        <div class="bp-notes-subtabs" role="tablist" aria-label="Loaded Markdown notes">
          ${appState.notes.documents.map((document, index) => `
            <button type="button" class="bp-notes-subtab" data-notes-tab="${escapeHTML(document.id)}" role="tab" aria-selected="${document.id === active.id}" title="${escapeHTML(document.fileName || document.title)}">
              <span>${escapeHTML(document.title || `Note ${index + 1}`)}</span>
              ${document.markdown ? "<small>MD</small>" : "<small>empty</small>"}
            </button>
          `).join("")}
          ${canAdd ? '<button type="button" id="bpAddNotesTab" class="bp-notes-add-tab" title="Add an empty Markdown subtab" aria-label="Add Notes subtab">＋</button>' : ""}
        </div>

        <div class="bp-notes-toolbar">
          ${renderFileButton("bpNotesFiles", "Load Markdown", { multiple: true })}
          ${hasMarkdown ? renderFileButton("bpReplaceNotesFile", "Replace Current") : ""}
          <button type="button" id="bpCloseNote" title="Close the current document tab">× Close Current</button>
          <span class="bp-pill bp-notes-source">Source: ${escapeHTML(active.source)}</span>
        </div>

        <div class="bp-window bp-notes-window">
          <div class="bp-window-titlebar">
            <span class="bp-window-control" aria-hidden="true"></span>
            <div class="bp-window-lines">Notes · ${escapeHTML(active.title)}</div>
            <span class="bp-window-control" aria-hidden="true"></span>
          </div>
          <article class="bp-window-body bp-markdown" role="tabpanel">
            ${hasMarkdown ? renderMarkdown(parsePlaceholders(active.markdown)) : `
              <h1>${escapeHTML(active.title)}</h1>
              <p>This document tab is empty. Load a Markdown file into it, or select several files at once to fill available tabs.</p>
              <p>Markdown is cached locally in Backpack state. No local server or neighbouring-file check is used.</p>
            `}
          </article>
        </div>
      </section>
    `;
  }

  function bindNotes() {
    $$('[data-notes-tab]').forEach(button => {
      button.addEventListener("click", () => {
        if (!appState.notes.documents.some(document => document.id === button.dataset.notesTab)) return;
        appState.notes.activeId = button.dataset.notesTab;
        saveState();
        renderApp();
      });
    });
    $("#bpAddNotesTab")?.addEventListener("click", addEmptyDocument);
    $("#bpNotesFiles")?.addEventListener("change", event => {
      if (event.target.files?.length) loadNotesDocuments(event.target.files);
      event.target.value = "";
    });
    $("#bpReplaceNotesFile")?.addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (file) replaceActiveDocument(file);
      event.target.value = "";
    });
    $("#bpCloseNote")?.addEventListener("click", closeActiveDocument);
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

    function cleanNode(node, insideLink = false) {
      if (node.nodeType === Node.TEXT_NODE) return insideLink ? escapeHTML(node.textContent || "") : linkifyText(node.textContent || "");
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      const tag = node.tagName.toUpperCase();
      if (["SCRIPT", "STYLE", "IFRAME", "OBJECT"].includes(tag)) return "";
      const children = Array.from(node.childNodes).map(child => cleanNode(child, insideLink || tag === "A")).join("");
      if (!ALLOWED_RICH_TAGS.has(tag)) return children;
      if (tag === "BR") return "<br>";
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

  function linksFromHTML(html) {
    const documentFragment = new DOMParser().parseFromString(String(html || ""), "text/html");
    const links = [];
    documentFragment.querySelectorAll("a[href]").forEach(anchor => {
      const url = normalizeURL(anchor.getAttribute("href") || "");
      if (url) links.push({ url, label: (anchor.textContent || url).trim() });
    });
    links.push(...linksFromText(documentFragment.body?.textContent || ""));
    return links;
  }

  function linksFromElement(element) {
    if (!element) return [];
    const links = [];
    element.querySelectorAll("a[href]").forEach(anchor => {
      const url = normalizeURL(anchor.getAttribute("href") || "");
      if (url) links.push({ url, label: (anchor.textContent || url).trim() });
    });
    links.push(...linksFromText(element.innerText || element.textContent || ""));
    return links;
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
      const key = normalized.url.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      output.push(normalized);
    }
    return output;
  }

  function addLinks(note, candidates) {
    note.links = normalizeLinks(note.links);
    let changed = false;
    for (const candidate of candidates || []) {
      const normalized = normalizeLink(candidate);
      if (!normalized) continue;
      const existing = note.links.find(link => link.url.toLowerCase() === normalized.url.toLowerCase());
      if (existing) {
        existing.lastSeenAt = new Date().toISOString();
        if ((!existing.label || existing.label === existing.url) && normalized.label) existing.label = normalized.label;
      } else {
        note.links.push(normalized);
        changed = true;
      }
    }
    return changed;
  }

  function persistBody(note, element, { captureLinks = false, sanitizeElement = false } = {}) {
    if (!note || !element) return false;
    let changed = captureLinks ? addLinks(note, linksFromElement(element)) : false;
    const html = sanitizeRichHTML(element.innerHTML);
    const text = element.innerText || element.textContent || "";
    if (note.html !== html) {
      note.html = html;
      changed = true;
    }
    if (note.text !== text) {
      note.text = text;
      changed = true;
    }
    if (sanitizeElement && element.innerHTML !== html) element.innerHTML = html;
    if (changed) note.updatedAt = new Date().toISOString();
    return changed;
  }

  function commitDrawingBoardBodies({ captureLinks = false } = {}) {
    if (!appState?.drawingBoard?.notes) return;
    let changed = false;
    $$('[data-qn-body]').forEach(element => {
      const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.qnBody);
      changed = persistBody(note, element, { captureLinks }) || changed;
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

  function notesOverlap(candidate, existing) {
    const a = noteRectangle(candidate);
    const b = noteRectangle(existing);
    const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (overlapX <= 0 || overlapY <= 0) return false;
    if (candidate.collapsed || existing.collapsed || candidate.h <= 1 || existing.h <= 1) return true;
    return overlapX > CONFIG.drawingBoard.maxOverlapCells && overlapY > CONFIG.drawingBoard.maxOverlapCells;
  }

  function canPlaceNote(candidate, ignoreId = "", notes = appState.drawingBoard.notes) {
    const cfg = CONFIG.drawingBoard;
    if (candidate.col < 0 || candidate.row < 0 || candidate.col + candidate.w > cfg.columns || candidate.row + candidate.h > cfg.rows) return false;
    return !notes.some(note => note.id !== ignoreId && notesOverlap(candidate, note));
  }

  function clampNoteGeometry(note) {
    const cfg = CONFIG.drawingBoard;
    note.collapsed = asBoolean(note.collapsed);
    note.w = Math.max(cfg.minW, Math.min(cfg.columns, Math.round(Number(note.w) || cfg.defaultW)));
    note.expandedH = Math.max(cfg.minH, Math.min(cfg.rows, Math.round(Number(note.expandedH) || Number(note.h) || cfg.defaultH)));
    note.h = note.collapsed
      ? cfg.collapsedH
      : Math.max(cfg.minH, Math.min(cfg.rows, Math.round(Number(note.h) || note.expandedH || cfg.defaultH)));
    if (!note.collapsed) note.expandedH = note.h;
    note.col = Math.max(0, Math.min(cfg.columns - note.w, Math.round(Number(note.col) || 0)));
    note.row = Math.max(0, Math.min(cfg.rows - note.h, Math.round(Number(note.row) || 0)));
    return note;
  }

  function findBoardSpace(w, h, ignoreId = "", notes = appState.drawingBoard.notes) {
    const cfg = CONFIG.drawingBoard;
    const width = Math.max(cfg.minW, Math.min(cfg.columns, Math.round(Number(w) || cfg.defaultW)));
    const height = Math.max(cfg.collapsedH, Math.min(cfg.rows, Math.round(Number(h) || cfg.defaultH)));
    for (let row = 0; row <= cfg.rows - height; row += 1) {
      for (let col = 0; col <= cfg.columns - width; col += 1) {
        const candidate = { col, row, w: width, h: height, collapsed: height === cfg.collapsedH };
        if (canPlaceNote(candidate, ignoreId, notes)) return candidate;
      }
    }
    return null;
  }

  function normalizeDrawingBoard(input) {
    const source = input && typeof input === "object" ? input : {};
    const notes = (Array.isArray(source.notes) ? source.notes : []).map((note, index) => {
      const html = sanitizeRichHTML(note?.html || linkifyText(note?.text || ""));
      const normalized = {
        id: String(note?.id || uid("qn")),
        col: Number(note?.col) || 0,
        row: Number.isFinite(Number(note?.row)) ? Number(note.row) : index,
        w: Number(note?.w) || CONFIG.drawingBoard.defaultW,
        h: Number(note?.h) || CONFIG.drawingBoard.defaultH,
        z: Number(note?.z) || index + 1,
        color: String(note?.color || NOTE_COLORS[index % NOTE_COLORS.length]),
        textColor: String(note?.textColor || "#151515"),
        title: String(note?.title || "Note").slice(0, 160),
        collapsed: asBoolean(note?.collapsed),
        expandedH: Number(note?.expandedH) || Math.max(CONFIG.drawingBoard.minH, Number(note?.h) || CONFIG.drawingBoard.defaultH),
        text: String(note?.text || textFromHTML(html)),
        html,
        links: normalizeLinks([
          ...(Array.isArray(note?.links) ? note.links : []),
          ...linksFromHTML(html),
          ...linksFromText(note?.text || "")
        ]),
        createdAt: note?.createdAt || new Date().toISOString(),
        updatedAt: note?.updatedAt || new Date().toISOString()
      };
      return clampNoteGeometry(normalized);
    });

    return {
      notes,
      nextZ: Math.max(Number(source.nextZ) || 1, 1, ...notes.map(note => note.z))
    };
  }

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
      clampNoteGeometry(note);
      if (!canPlaceNote(note, note.id, placed)) {
        const spot = findBoardSpace(note.w, note.h, note.id, placed)
          || findBoardSpace(cfg.defaultW, note.collapsed ? cfg.collapsedH : cfg.defaultH, note.id, placed)
          || findBoardSpace(cfg.minW, note.collapsed ? cfg.collapsedH : cfg.defaultH, note.id, placed);
        if (spot) Object.assign(note, spot, { collapsed: note.collapsed });
      }
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
    const candidate = clampNoteGeometry({ ...note, collapsed: false, w: cfg.defaultW, h: cfg.defaultH, expandedH: cfg.defaultH });
    if (canPlaceNote(candidate, note.id)) {
      Object.assign(note, candidate, { updatedAt: new Date().toISOString() });
      return true;
    }
    const spot = findBoardSpace(cfg.defaultW, cfg.defaultH, note.id) || findBoardSpace(cfg.minW, cfg.defaultH, note.id);
    if (!spot) return false;
    Object.assign(note, spot, { collapsed: false, expandedH: cfg.defaultH, updatedAt: new Date().toISOString() });
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
      clampNoteGeometry(note);
      note.updatedAt = new Date().toISOString();
      return true;
    }

    const desiredH = Math.max(cfg.minH, Math.min(cfg.rows, Number(note.expandedH) || cfg.defaultH));
    const candidate = clampNoteGeometry({ ...note, collapsed: false, h: desiredH, expandedH: desiredH });
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

  function addDrawingBoardNote() {
    const cfg = CONFIG.drawingBoard;
    const spot = findBoardSpace(cfg.defaultW, cfg.defaultH) || findBoardSpace(cfg.minW, cfg.defaultH);
    if (!spot) {
      showToast("No available Drawing Board space for a new note.");
      return;
    }
    appState.drawingBoard.nextZ += 1;
    appState.drawingBoard.notes.push({
      id: uid("qn"),
      ...spot,
      z: appState.drawingBoard.nextZ,
      color: NOTE_COLORS[0],
      textColor: "#151515",
      title: "Note",
      collapsed: false,
      expandedH: cfg.defaultH,
      text: "New note",
      html: linkifyText("New note"),
      links: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    saveState();
    renderApp();
  }

  /***************************************************************************
   * Drawing Board rendering and interaction
   ***************************************************************************/
  function renderSavedLinksInspector() {
    const note = appState.drawingBoard.notes.find(item => item.id === runtime.openLinksNoteId);
    if (!note) return "";
    const links = normalizeLinks(note.links);
    return `
      <aside id="bpQnLinksInspector" class="bp-qn-links-inspector" data-qn-links-inspector="${escapeHTML(note.id)}" aria-label="Saved links inspector">
        <div class="bp-qn-links-title">
          <div><strong>Saved links</strong><small>${escapeHTML(note.title || "Note")}</small></div>
          <div class="bp-qn-links-title-actions">
            <span>${links.length}</span>
            <button type="button" class="bp-qn-mini-button" data-qn-links-close title="Close links inspector" aria-label="Close links inspector">×</button>
          </div>
        </div>
        <div class="bp-qn-links-tools">
          <button type="button" data-qn-reset-size="${escapeHTML(note.id)}" title="Restore this note to a recoverable size">Reset size</button>
        </div>
        ${links.length ? `
          <div class="bp-qn-links-list">
            ${links.map(link => `
              <div class="bp-qn-link-row">
                <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHTML(link.url)}">${escapeHTML(link.label || link.url)}</a>
                <button type="button" class="bp-qn-mini-button" data-qn-link-delete="${escapeHTML(note.id)}" data-qn-link-id="${escapeHTML(link.id)}" title="Delete saved link" aria-label="Delete saved link">×</button>
              </div>
            `).join("")}
          </div>
        ` : "<p>No links saved yet. Paste a link in this note to capture it permanently.</p>"}
      </aside>
    `;
  }

  function renderDrawingBoardNote(note) {
    const cfg = CONFIG.drawingBoard;
    const left = (note.col / cfg.columns) * 100;
    const top = (note.row / cfg.rows) * 100;
    const width = (note.w / cfg.columns) * 100;
    const height = (note.h / cfg.rows) * 100;
    const titleIndent = `calc((100% / ${Math.max(1, Number(note.w || cfg.defaultW))}) * ${cfg.maxOverlapCells})`;
    const links = normalizeLinks(note.links);
    const collapsed = Boolean(note.collapsed);
    const narrow = note.w <= cfg.minW;
    const selected = runtime.openLinksNoteId === note.id;

    return `
      <article class="bp-qn-note${collapsed ? " bp-qn-note-collapsed" : ""}${narrow ? " bp-qn-note-narrow" : ""}${selected ? " bp-qn-note-links-selected" : ""}"
        data-note-id="${escapeHTML(note.id)}"${collapsed ? ` data-qn-collapsed-drag="${escapeHTML(note.id)}"` : ""}
        style="left:${left}%;top:${top}%;width:${width}%;height:${height}%;z-index:${note.z};--bp-qn-note-bg:${escapeHTML(note.color)};--bp-qn-note-text:${escapeHTML(note.textColor)};--bp-qn-title-indent:${titleIndent};">
        <div class="bp-qn-note-header">
          ${collapsed
            ? `<strong class="bp-qn-collapsed-title">${escapeHTML(note.title || "Note")}</strong>`
            : `<input class="bp-qn-title" data-qn-title="${escapeHTML(note.id)}" value="${escapeHTML(note.title || "Note")}" aria-label="Drawing Board note title" title="Edit note title" />
               <button type="button" class="bp-qn-mini-button bp-qn-links" data-qn-links-toggle="${escapeHTML(note.id)}" title="Saved links (${links.length})" aria-label="Saved links">🔗${links.length ? `<span>${links.length}</span>` : ""}</button>`}
          <button type="button" class="bp-qn-collapse-toggle" data-qn-collapse-toggle="${escapeHTML(note.id)}" title="${collapsed ? "Expand note" : "Collapse to title card"}" aria-label="${collapsed ? "Expand note" : "Collapse note"}" aria-expanded="${!collapsed}"></button>
        </div>
        ${collapsed ? "" : `
          <div class="bp-qn-note-body" contenteditable="true" spellcheck="true" data-qn-body="${escapeHTML(note.id)}">${sanitizeRichHTML(note.html || linkifyText(note.text))}</div>
          <div class="bp-qn-note-footer">
            <label class="bp-qn-color-field" title="Note background colour"><input type="color" data-qn-color="${escapeHTML(note.id)}" value="${escapeHTML(note.color)}" aria-label="Note background colour" /></label>
            <label class="bp-qn-color-field" title="Note text colour"><input type="color" data-qn-text-color="${escapeHTML(note.id)}" value="${escapeHTML(note.textColor)}" aria-label="Note text colour" /></label>
            <span class="bp-qn-drag-zone" data-qn-drag="${escapeHTML(note.id)}" title="Drag note from bottom chrome" aria-label="Drag note"></span>
            <span class="bp-qn-resize" data-qn-resize="${escapeHTML(note.id)}" aria-label="Resize note" title="Resize note">↘</span>
            <button type="button" class="bp-qn-mini-button bp-qn-delete" data-qn-delete="${escapeHTML(note.id)}" title="Delete note" aria-label="Delete note">×</button>
          </div>
        `}
      </article>
    `;
  }

  function renderDrawingBoard() {
    repairBoardLayout();
    const cfg = CONFIG.drawingBoard;
    const collapsedCount = appState.drawingBoard.notes.filter(note => note.collapsed).length;
    return `
      <section class="bp-panel bp-qn-panel">
        <div class="bp-panel-header bp-qn-header">
          <div class="bp-section-title">
            <h2>Drawing Board</h2>
            <span class="bp-section-kicker">Expand to edit · collapse to store</span>
          </div>
          <div class="bp-qn-actions" aria-label="Drawing Board actions">
            <span class="bp-pill">${appState.drawingBoard.notes.length} notes · ${collapsedCount} cards</span>
            <button type="button" id="bpRepairQuickNotes" title="Recover small or offscreen cards">Repair Layout</button>
            <button type="button" id="bpExportQuickNotes" title="Export only the Drawing Board">Export Board</button>
            <button type="button" id="bpImportQuickNotesBtn" title="Import a Drawing Board JSON file">Import Board</button>
            <input id="bpQuickNotesImportFile" class="bp-hidden" type="file" accept="application/json,.json" />
          </div>
        </div>
        <div class="bp-qn-shell">
          <div id="bpQuickBoard" class="bp-qn-board" style="--bp-qn-cols:${cfg.columns};--bp-qn-rows:${cfg.rows};">
            ${appState.drawingBoard.notes.map(renderDrawingBoardNote).join("")}
          </div>
          ${renderSavedLinksInspector()}
          <button type="button" id="bpAddQuickNote" class="bp-qn-add" aria-label="Add Drawing Board note">+</button>
        </div>
        <details class="bp-qn-guide">
          <summary>Board controls</summary>
          <span>Expanded notes move from the bottom chrome and resize with ↘.</span>
          <span>Collapsed cards move from anywhere except the subtle + button.</span>
          <span>🔗 opens permanent saved links outside the card.</span>
          <span>Grid: ${cfg.columns}×${cfg.rows}; expanded notes permit at most ${cfg.maxOverlapCells} cell of overlap.</span>
        </details>
      </section>
    `;
  }

  function updateDrawingBoardColours() {
    appState.drawingBoard.notes.forEach(note => {
      const element = $(`[data-note-id="${selectorEscape(note.id)}"]`);
      if (!element) return;
      element.style.setProperty("--bp-qn-note-bg", note.color);
      element.style.setProperty("--bp-qn-note-text", note.textColor);
    });
  }

  function startNotePointer(event, noteId, mode) {
    event.preventDefault();
    const board = $("#bpQuickBoard");
    const note = appState.drawingBoard.notes.find(item => item.id === noteId);
    if (!board || !note || !board.clientWidth || !board.clientHeight) return;

    appState.drawingBoard.nextZ += 1;
    note.z = appState.drawingBoard.nextZ;
    const original = { ...note };
    const startX = event.clientX;
    const startY = event.clientY;
    const element = $(`[data-note-id="${selectorEscape(noteId)}"]`);
    element?.classList.add("is-dragging");
    element?.setPointerCapture?.(event.pointerId);

    const onMove = moveEvent => {
      const deltaColumns = Math.round((moveEvent.clientX - startX) / (board.clientWidth / CONFIG.drawingBoard.columns));
      const deltaRows = Math.round((moveEvent.clientY - startY) / (board.clientHeight / CONFIG.drawingBoard.rows));
      const candidate = { ...note };
      if (mode === "move") {
        candidate.col = original.col + deltaColumns;
        candidate.row = original.row + deltaRows;
      } else {
        candidate.collapsed = false;
        candidate.w = Math.max(CONFIG.drawingBoard.minW, original.w + deltaColumns);
        candidate.h = Math.max(CONFIG.drawingBoard.minH, original.h + deltaRows);
        candidate.expandedH = candidate.h;
      }
      if (!canPlaceNote(candidate, note.id)) return;
      Object.assign(note, candidate, { updatedAt: new Date().toISOString() });
      element.style.left = `${(note.col / CONFIG.drawingBoard.columns) * 100}%`;
      element.style.top = `${(note.row / CONFIG.drawingBoard.rows) * 100}%`;
      element.style.width = `${(note.w / CONFIG.drawingBoard.columns) * 100}%`;
      element.style.height = `${(note.h / CONFIG.drawingBoard.rows) * 100}%`;
      element.style.zIndex = String(note.z);
      element.classList.toggle("bp-qn-note-narrow", note.w <= CONFIG.drawingBoard.minW);
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      element?.classList.remove("is-dragging");
      saveState();
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
    document.addEventListener("pointercancel", onUp, { once: true });
  }

  function bindDrawingBoard() {
    $("#bpAddQuickNote")?.addEventListener("click", addDrawingBoardNote);
    $("#bpRepairQuickNotes")?.addEventListener("click", () => {
      commitDrawingBoardBodies({ captureLinks: true });
      const changed = repairBoardLayout();
      saveState();
      renderApp();
      showToast(changed ? "Drawing Board layout repaired." : "Drawing Board layout already looked safe.");
    });
    $("#bpExportQuickNotes")?.addEventListener("click", exportDrawingBoard);
    $("#bpImportQuickNotesBtn")?.addEventListener("click", () => $("#bpQuickNotesImportFile")?.click());
    $("#bpQuickNotesImportFile")?.addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (file) importDrawingBoard(file);
      event.target.value = "";
    });

    $$('[data-qn-collapse-toggle]').forEach(button => {
      button.addEventListener("pointerdown", event => event.stopPropagation());
      button.addEventListener("click", event => {
        event.stopPropagation();
        commitDrawingBoardBodies({ captureLinks: true });
        const noteId = button.dataset.qnCollapseToggle;
        if (!toggleNoteCollapsed(noteId)) return;
        if (runtime.openLinksNoteId === noteId) runtime.openLinksNoteId = "";
        saveState();
        renderApp();
      });
    });

    $$('[data-qn-collapsed-drag]').forEach(card => {
      card.addEventListener("pointerdown", event => {
        if (event.target.closest('[data-qn-collapse-toggle]')) return;
        startNotePointer(event, card.dataset.qnCollapsedDrag, "move");
      });
    });

    $$('[data-qn-title]').forEach(input => {
      input.addEventListener("pointerdown", event => event.stopPropagation());
      input.addEventListener("click", event => event.stopPropagation());
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
        }
      });
      input.addEventListener("blur", () => {
        const note = appState.drawingBoard.notes.find(item => item.id === input.dataset.qnTitle);
        if (!note) return;
        note.title = input.value.trim() || "Note";
        note.updatedAt = new Date().toISOString();
        saveState();
      });
    });

    $$('[data-qn-delete]').forEach(button => {
      button.addEventListener("click", () => {
        if (!confirm("Delete this note?")) return;
        if (runtime.openLinksNoteId === button.dataset.qnDelete) runtime.openLinksNoteId = "";
        appState.drawingBoard.notes = appState.drawingBoard.notes.filter(note => note.id !== button.dataset.qnDelete);
        saveState();
        renderApp();
      });
    });

    $$('[data-qn-links-toggle]').forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();
        commitDrawingBoardBodies({ captureLinks: true });
        runtime.openLinksNoteId = runtime.openLinksNoteId === button.dataset.qnLinksToggle ? "" : button.dataset.qnLinksToggle;
        renderApp();
      });
    });
    $$('[data-qn-links-close]').forEach(button => button.addEventListener("click", () => {
      runtime.openLinksNoteId = "";
      renderApp();
    }));
    $$('[data-qn-reset-size]').forEach(button => button.addEventListener("click", () => {
      if (!resetNoteSize(button.dataset.qnResetSize)) {
        showToast("No safe space was available to reset this note.");
        return;
      }
      saveState();
      renderApp();
      showToast("Note card size reset.");
    }));
    $$('[data-qn-link-delete]').forEach(button => button.addEventListener("click", () => {
      const note = appState.drawingBoard.notes.find(item => item.id === button.dataset.qnLinkDelete);
      if (!note) return;
      note.links = normalizeLinks(note.links).filter(link => link.id !== button.dataset.qnLinkId);
      note.updatedAt = new Date().toISOString();
      saveState();
      renderApp();
    }));

    $$('[data-qn-color]').forEach(input => {
      input.addEventListener("pointerdown", event => event.stopPropagation());
      input.addEventListener("input", () => {
        const note = appState.drawingBoard.notes.find(item => item.id === input.dataset.qnColor);
        if (!note) return;
        note.color = input.value;
        note.updatedAt = new Date().toISOString();
        saveState();
        updateDrawingBoardColours();
      });
    });
    $$('[data-qn-text-color]').forEach(input => {
      input.addEventListener("pointerdown", event => event.stopPropagation());
      input.addEventListener("input", () => {
        const note = appState.drawingBoard.notes.find(item => item.id === input.dataset.qnTextColor);
        if (!note) return;
        note.textColor = input.value;
        note.updatedAt = new Date().toISOString();
        saveState();
        updateDrawingBoardColours();
      });
    });

    $$('[data-qn-body]').forEach(element => {
      element.addEventListener("pointerdown", event => event.stopPropagation());
      element.addEventListener("click", event => event.stopPropagation());
      element.addEventListener("input", () => {
        const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.qnBody);
        if (persistBody(note, element, { captureLinks: true })) saveState();
      });
      element.addEventListener("paste", event => {
        const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.qnBody);
        if (!note) return;
        const html = event.clipboardData?.getData("text/html") || "";
        const text = event.clipboardData?.getData("text/plain") || "";
        const inserted = html ? sanitizeRichHTML(html) : linkifyText(text);
        if (inserted) {
          event.preventDefault();
          insertHTMLAtCursor(inserted);
        }
        const added = addLinks(note, [...linksFromHTML(html), ...linksFromText(text)]);
        persistBody(note, element, { captureLinks: true });
        saveState();
        if (added) showToast("Link saved to note.");
      });
      element.addEventListener("blur", () => {
        const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.qnBody);
        if (persistBody(note, element, { captureLinks: true, sanitizeElement: true })) saveState();
      });
    });

    $$('[data-qn-drag]').forEach(handle => handle.addEventListener("pointerdown", event => startNotePointer(event, handle.dataset.qnDrag, "move")));
    $$('[data-qn-resize]').forEach(handle => handle.addEventListener("pointerdown", event => startNotePointer(event, handle.dataset.qnResize, "resize")));
  }

  /***************************************************************************
   * Versioned persistence and migration
   ***************************************************************************/
  function normalizePreferences(source = {}) {
    const input = source && typeof source === "object" ? source : {};
    const appMode = input.appMode === "light" || input.appMode === "dark"
      ? input.appMode
      : (input.darkMode === undefined ? DEFAULT_STATE.preferences.appMode : (asBoolean(input.darkMode) ? "dark" : "light"));
    const readerMode = input.readerMode === "light" || input.readerMode === "dark"
      ? input.readerMode
      : (input.readingDark === undefined ? DEFAULT_STATE.preferences.readerMode : (asBoolean(input.readingDark) ? "dark" : "light"));
    return {
      theme: getTheme(input.theme).id,
      appMode,
      readerMode,
      density: input.density === "readable" ? "readable" : "compact"
    };
  }

  function normalizeActiveTab(value) {
    return ["drawingBoard", "drawing-board", "quicknotes", "quickNotes"].includes(value) ? "drawingBoard" : "notes";
  }

  function migrateWorkspace(input) {
    const source = input && typeof input === "object" ? input : {};
    const legacyUI = source.preferences || source.ui || {};
    const boardSource = source.drawingBoard || source.quickNotes || source.board || {};
    return {
      schemaVersion: CONFIG.workspaceSchema,
      appVersion: CONFIG.appVersion,
      activeTab: normalizeActiveTab(source.activeTab),
      headerQuote: String(source.headerQuote || source.placeholders?.HEADER_QUOTE || DEFAULT_STATE.headerQuote).slice(0, 240),
      preferences: normalizePreferences(legacyUI),
      notes: normalizeNotes(source.notes),
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
    return {
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
    const keys = [CONFIG.storageKey, ...CONFIG.legacyStorageKeys];
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        return migrateWorkspace(JSON.parse(raw));
      } catch (error) {
        console.warn(`Backpack could not read state from ${key}:`, error);
      }
    }
    return migrateWorkspace(clone(DEFAULT_STATE));
  }

  function saveState() {
    if (!appState) return;
    appState = serializeWorkspace();
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(appState));
    } catch (error) {
      console.warn("Backpack state could not be saved:", error);
    }
  }

  function exportWorkspace() {
    commitDrawingBoardBodies({ captureLinks: true });
    const payload = {
      format: CONFIG.workspaceFormat,
      schemaVersion: CONFIG.workspaceSchema,
      appVersion: CONFIG.appVersion,
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
      runtime.displayMenuOpen = false;
      saveState();
      renderApp();
      showToast("Backpack workspace imported and upgraded to v2.3.");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Could not import that workspace file.");
    }
  }

  function exportDrawingBoard() {
    commitDrawingBoardBodies({ captureLinks: true });
    const payload = {
      format: CONFIG.boardFormat,
      schemaVersion: CONFIG.workspaceSchema,
      appVersion: CONFIG.appVersion,
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
   * Application shell
   ***************************************************************************/
  const TABS = Object.freeze([
    { id: "notes", label: "Notes", icon: "📓", render: renderNotes, bind: bindNotes },
    { id: "drawingBoard", label: "Drawing Board", icon: "🗂️", render: renderDrawingBoard, bind: bindDrawingBoard }
  ]);

  function activeTab() {
    return TABS.find(tab => tab.id === appState.activeTab) || TABS[0];
  }

  function renderTabs() {
    $("#bpTabs").innerHTML = TABS.map(tab => `
      <button class="bp-tab" type="button" data-tab="${tab.id}" aria-selected="${tab.id === appState.activeTab}">
        <span aria-hidden="true">${tab.icon}</span><span>${tab.label}</span>
      </button>
    `).join("");
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
    const theme = getTheme(preference.theme);
    document.body.dataset.bpTheme = theme.id;
    document.body.classList.toggle("bp-light", preference.appMode === "light");
    document.body.classList.toggle("bp-reading-dark", preference.readerMode === "dark");
    document.body.classList.toggle("bp-density-readable", preference.density === "readable");

    const quote = $("#bpHeaderQuote");
    if (quote) {
      quote.textContent = `"${appState.headerQuote}"`;
      quote.title = appState.headerQuote;
    }

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
      text: `${theme.icon} ${theme.shortLabel}`,
      title: `Theme: ${theme.name}. Click to cycle theme.`,
      pressed: theme.id !== "goldenrod",
      active: theme.id !== "goldenrod"
    });

    setButtonState($("#bpDisplayBtn"), {
      text: runtime.displayMenuOpen ? "Display ▴" : "Display ▾",
      title: runtime.displayMenuOpen ? "Hide display settings" : "Show display settings",
      pressed: runtime.displayMenuOpen,
      active: runtime.displayMenuOpen || preference.density === "readable",
      expanded: runtime.displayMenuOpen
    });
    const displayMenu = $("#bpDisplayMenu");
    if (displayMenu) displayMenu.hidden = !runtime.displayMenuOpen;

    setButtonState($("#bpDarkBtn"), {
      text: `App: ${preference.appMode === "dark" ? "Dark" : "Light"}`,
      title: "Toggle app light or dark mode",
      pressed: preference.appMode === "dark",
      active: preference.appMode === "dark"
    });
    setButtonState($("#bpReadBtn"), {
      text: `Reader: ${preference.readerMode === "dark" ? "Dark" : "Light"}`,
      title: "Toggle reader light or dark mode",
      pressed: preference.readerMode === "dark",
      active: preference.readerMode === "dark"
    });
    setButtonState($("#bpDensityBtn"), {
      text: `Density: ${preference.density === "readable" ? "Readable" : "Compact"}`,
      title: "Toggle compact or readable density",
      pressed: preference.density === "readable",
      active: preference.density === "readable"
    });
  }

  function renderApp() {
    commitDrawingBoardBodies({ captureLinks: true });
    appState.activeTab = normalizeActiveTab(appState.activeTab);
    applyUI();
    renderTabs();
    const tab = activeTab();
    $("#bpWorkspace").innerHTML = tab.render();
    tab.bind();
    saveState();
  }

  function bindGlobalUI() {
    document.addEventListener("click", event => {
      const tab = event.target.closest("[data-tab]");
      if (tab) {
        appState.activeTab = normalizeActiveTab(tab.dataset.tab);
        runtime.openLinksNoteId = "";
        renderApp();
        return;
      }

      if (runtime.dataMenuOpen && !event.target.closest(".bp-action-dropdown")) {
        runtime.dataMenuOpen = false;
        applyUI();
      }
      if (runtime.displayMenuOpen && !event.target.closest("#bpDisplayBtn, #bpDisplayMenu")) {
        runtime.displayMenuOpen = false;
        applyUI();
      }
    });

    $("#bpDataBtn")?.addEventListener("click", event => {
      event.stopPropagation();
      runtime.dataMenuOpen = !runtime.dataMenuOpen;
      runtime.displayMenuOpen = false;
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

    $("#bpThemeBtn")?.addEventListener("click", () => {
      appState.preferences.theme = getNextThemeId();
      saveState();
      applyUI();
    });
    $("#bpDisplayBtn")?.addEventListener("click", event => {
      event.stopPropagation();
      runtime.displayMenuOpen = !runtime.displayMenuOpen;
      runtime.dataMenuOpen = false;
      applyUI();
    });
    $("#bpDarkBtn")?.addEventListener("click", () => {
      appState.preferences.appMode = appState.preferences.appMode === "dark" ? "light" : "dark";
      saveState();
      applyUI();
    });
    $("#bpReadBtn")?.addEventListener("click", () => {
      commitDrawingBoardBodies({ captureLinks: true });
      appState.preferences.readerMode = appState.preferences.readerMode === "dark" ? "light" : "dark";
      saveState();
      applyUI();
    });
    $("#bpDensityBtn")?.addEventListener("click", () => {
      appState.preferences.density = appState.preferences.density === "readable" ? "compact" : "readable";
      saveState();
      applyUI();
    });

    window.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if (runtime.openLinksNoteId) {
        runtime.openLinksNoteId = "";
        if (appState.activeTab === "drawingBoard") renderApp();
      } else if (runtime.dataMenuOpen || runtime.displayMenuOpen) {
        runtime.dataMenuOpen = false;
        runtime.displayMenuOpen = false;
        applyUI();
      }
    });
  }

  function boot() {
    appState = loadState();
    bindGlobalUI();
    renderApp();
  }

  boot();
})();
