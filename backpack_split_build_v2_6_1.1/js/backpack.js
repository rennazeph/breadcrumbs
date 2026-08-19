(() => {
  "use strict";

  /***************************************************************************
   * Backpack 2.6 core configuration
   ***************************************************************************/
  const CONFIG = Object.freeze({
    appVersion: "2.6.1",
    workspaceSchema: 2,
    workspaceFormat: "the-backpack-workspace",
    boardFormat: "the-backpack-drawing-board",
    storageKey: "the-backpack-state-v2",
    legacyStorageKey: "the-backpack-alpha-state-v1",
    notesMaxDocuments: 9,
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
  const TRACKING_QUERY_KEYS = new Set(["fbclid", "gclid", "dclid", "msclkid", "mc_cid", "mc_eid", "igshid"]);

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
      typewriter: Object.freeze({
        speed: 42,
        rotationSpeed: 260,
        rotationHold: 1000
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
      notes: Object.freeze([]),
      nextZ: 1
    })
  });

  const runtime = {
    dataMenuOpen: false,
    displayMenuOpen: false,
    quoteEditorOpen: false,
    openLinksNoteId: "",
    notesTypewriterSettingsOpen: false,
    typewriterEngine: null,
    migratedStorageKey: ""
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

  function getTheme(themeId = appState?.preferences?.theme) {
    return THEMES.find(theme => theme.id === themeId) || THEMES[0];
  }

  function getNextThemeId(themeId = appState?.preferences?.theme) {
    const index = THEMES.findIndex(theme => theme.id === themeId);
    return THEMES[(index < 0 ? 0 : index + 1) % THEMES.length].id;
  }

  /***************************************************************************
   * Notes state, plain-text reader, and Markdown typewriter
   ***************************************************************************/
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
    return {
      speed: clamp(source.speed, 42, 8, 180),
      rotationSpeed: clamp(source.rotationSpeed, 260, 60, 900),
      rotationHold: clamp(source.rotationHold, 1000, 100, 3000)
    };
  }

  function createEmptyDocument(index = 1) {
    return {
      id: uid("note"),
      title: `Note ${index}`,
      markdown: "",
      source: "Upload required",
      fileName: "",
      fileType: "empty"
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
      return {
        id: String(document?.id || uid("note")),
        title: String(document?.title || titleFromFileName(fileName, index + 1)).slice(0, 48),
        markdown,
        source: String(document?.source || "Upload required"),
        fileName,
        fileType
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
    return `<label class="bp-file-button">⬆ ${escapeHTML(label)}<input id="${inputId}" type="file" accept=".md,.markdown,.txt,text/markdown,text/plain"${multiple ? " multiple" : ""} /></label>`;
  }

  function destroyTypewriter() {
    runtime.typewriterEngine?.destroy?.();
    runtime.typewriterEngine = null;
  }

  function startActiveTypewriter() {
    destroyTypewriter();
    const active = getActiveDocument();
    if (active.fileType !== "markdown" || !(active.fileName || active.markdown)) return;
    const output = $("#bpTypewriterOutput");
    if (!output || !window.BackpackTypewriter?.create) return;
    runtime.typewriterEngine = window.BackpackTypewriter.create(output, appState.notes.typewriter);
    runtime.typewriterEngine.start(active.markdown).catch(error => {
      console.error(error);
      showToast("Typewriter presentation stopped unexpectedly.");
    });
  }

  async function loadNotesDocuments(files) {
    const incoming = Array.from(files || []);
    if (!incoming.length) return;
    appState.notes = normalizeNotes(appState.notes);
    let firstLoadedId = "";
    let loaded = 0;
    let skippedFull = 0;
    let skippedType = 0;

    for (const file of incoming) {
      const fileType = noteFileTypeFromName(file.name);
      if (!fileType) {
        skippedType += 1;
        continue;
      }
      let target = appState.notes.documents.find(document => !document.fileName && !document.markdown);
      if (!target && appState.notes.documents.length < CONFIG.notesMaxDocuments) {
        target = createEmptyDocument(appState.notes.documents.length + 1);
        appState.notes.documents.push(target);
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

  async function replaceActiveDocument(file) {
    if (!file) return;
    const fileType = noteFileTypeFromName(file.name);
    if (!fileType) {
      showToast("Notes accepts .md, .markdown, and .txt files.");
      return;
    }
    const active = getActiveDocument();
    active.markdown = await file.text();
    active.fileName = file.name;
    active.fileType = fileType;
    active.title = titleFromFileName(file.name, appState.notes.documents.indexOf(active) + 1);
    active.source = `Uploaded ${file.name}`;
    saveState();
    renderApp();
    showToast(`Current note replaced as ${fileType === "markdown" ? "typewriter Markdown" : "plain text"}.`);
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

  function renderTypewriterSettings() {
    const settings = appState.notes.typewriter;
    return `
      <div class="bp-typewriter-settings" ${runtime.notesTypewriterSettingsOpen ? "" : "hidden"}>
        <label>Typing <input id="bpTypewriterSpeed" type="range" min="8" max="180" step="1" value="${settings.speed}"><output id="bpTypewriterSpeedValue">${settings.speed} ms</output></label>
        <label>Rotation <input id="bpTypewriterRotationSpeed" type="range" min="60" max="900" step="10" value="${settings.rotationSpeed}"><output id="bpTypewriterRotationSpeedValue">${settings.rotationSpeed} ms</output></label>
        <label>Hold <input id="bpTypewriterRotationHold" type="range" min="100" max="3000" step="50" value="${settings.rotationHold}"><output id="bpTypewriterRotationHoldValue">${settings.rotationHold} ms</output></label>
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
        <div class="bp-panel-header bp-notes-header">
          <div class="bp-section-title">
            <h2>Notes</h2>
            <span class="bp-section-kicker">Nine-document shelf · .md types · .txt stays static</span>
          </div>
          <span class="bp-pill">${appState.notes.documents.length}/${CONFIG.notesMaxDocuments}</span>
        </div>

        <div class="bp-notes-subtabs" role="tablist" aria-label="Loaded notes">
          ${appState.notes.documents.map((document, index) => `
            <button type="button" class="bp-notes-subtab" data-notes-tab="${escapeHTML(document.id)}" role="tab" aria-selected="${document.id === active.id}" title="${escapeHTML(document.fileName || document.title)}">
              <span>${escapeHTML(document.title || `Note ${index + 1}`)}</span>
              <small>${badge(document)}</small>
            </button>
          `).join("")}
          ${canAdd ? '<button type="button" id="bpAddNotesTab" class="bp-notes-add-tab" title="Add an empty Notes subtab" aria-label="Add Notes subtab">＋</button>' : ""}
        </div>

        <div class="bp-notes-toolbar">
          ${renderFileButton("bpNotesFiles", "Load .md / .txt", { multiple: true })}
          ${hasDocument ? renderFileButton("bpReplaceNotesFile", "Replace Current") : ""}
          <button type="button" id="bpCloseNote" title="Close the current document tab">× Close Current</button>
          ${isMarkdown ? `
            <span class="bp-pill bp-typewriter-mode">⌨ Typewriter</span>
            <button type="button" id="bpTypewriterPause" title="Pause or resume this typewriter">Pause</button>
            <button type="button" id="bpTypewriterRestart" title="Restart this typewriter from the beginning">↻ Restart</button>
            <button type="button" id="bpTypewriterSettingsToggle" aria-expanded="${runtime.notesTypewriterSettingsOpen}">Typewriter ${runtime.notesTypewriterSettingsOpen ? "▴" : "▾"}</button>
          ` : isText ? '<span class="bp-pill bp-text-mode">TXT · static</span>' : ""}
          <span class="bp-pill bp-notes-source">Source: ${escapeHTML(active.source)}</span>
        </div>
        ${isMarkdown ? renderTypewriterSettings() : ""}

        <div class="bp-window bp-notes-window">
          <div class="bp-window-titlebar">
            <span class="bp-window-control" aria-hidden="true"></span>
            <div class="bp-window-lines">Notes · ${escapeHTML(active.title)}${isMarkdown ? " · typewriter" : isText ? " · plain text" : ""}</div>
            <span class="bp-window-control" aria-hidden="true"></span>
          </div>
          ${isMarkdown ? `
            <article id="bpTypewriterOutput" class="bp-window-body bp-markdown bp-typewriter-output" role="tabpanel" aria-live="polite"></article>
          ` : isText ? `
            <article class="bp-window-body bp-plain-text" role="tabpanel"><pre>${escapeHTML(active.markdown)}</pre></article>
          ` : `
            <article class="bp-window-body bp-markdown" role="tabpanel">
              <h1>${escapeHTML(active.title)}</h1>
              <p>This document tab is empty. Load up to nine <code>.md</code>, <code>.markdown</code>, or <code>.txt</code> files at once.</p>
              <p>Markdown files run the Typewriter commands and animations. Text files display the same source literally and without animation.</p>
            </article>
          `}
        </div>
      </section>
    `;
  }

  function bindTypewriterSettings() {
    const definitions = [
      ["bpTypewriterSpeed", "bpTypewriterSpeedValue", "speed", " ms"],
      ["bpTypewriterRotationSpeed", "bpTypewriterRotationSpeedValue", "rotationSpeed", " ms"],
      ["bpTypewriterRotationHold", "bpTypewriterRotationHoldValue", "rotationHold", " ms"]
    ];
    for (const [inputId, outputId, key, suffix] of definitions) {
      const input = $(`#${inputId}`);
      if (!input) continue;
      input.addEventListener("input", () => {
        appState.notes.typewriter[key] = Number(input.value);
        const output = $(`#${outputId}`);
        if (output) output.value = `${input.value}${suffix}`;
        runtime.typewriterEngine?.updateSettings?.(appState.notes.typewriter);
        queueSaveState();
      });
    }
  }

  function bindNotes() {
    $$('[data-notes-tab]').forEach(button => {
      button.addEventListener("click", () => {
        if (!appState.notes.documents.some(document => document.id === button.dataset.notesTab)) return;
        appState.notes.activeId = button.dataset.notesTab;
        runtime.notesTypewriterSettingsOpen = false;
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
    $("#bpTypewriterPause")?.addEventListener("click", event => {
      const paused = runtime.typewriterEngine?.togglePause?.();
      event.currentTarget.textContent = paused ? "Resume" : "Pause";
    });
    $("#bpTypewriterRestart")?.addEventListener("click", () => {
      runtime.typewriterEngine?.restart?.();
      const pause = $("#bpTypewriterPause");
      if (pause) pause.textContent = "Pause";
    });
    $("#bpTypewriterSettingsToggle")?.addEventListener("click", event => {
      runtime.notesTypewriterSettingsOpen = !runtime.notesTypewriterSettingsOpen;
      const panel = $(".bp-typewriter-settings");
      if (panel) panel.hidden = !runtime.notesTypewriterSettingsOpen;
      event.currentTarget.textContent = `Typewriter ${runtime.notesTypewriterSettingsOpen ? "▴" : "▾"}`;
      event.currentTarget.setAttribute("aria-expanded", String(runtime.notesTypewriterSettingsOpen));
    });
    bindTypewriterSettings();
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

  function commitDrawingBoardBodies() {
    if (!appState?.drawingBoard?.notes) return;
    let changed = false;
    $$('[data-db-body]').forEach(element => {
      const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbBody);
      changed = persistBody(note, element) || changed;
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
        id: String(note?.id || uid("card")),
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
          ...linksFromRichHTML(html)
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
    commitDrawingBoardBodies();
    flushPendingSave();
    const cfg = CONFIG.drawingBoard;
    const spot = findBoardSpace(cfg.defaultW, cfg.defaultH) || findBoardSpace(cfg.minW, cfg.defaultH);
    if (!spot) {
      showToast("No available Drawing Board space for a new note.");
      return;
    }
    appState.drawingBoard.nextZ += 1;
    appState.drawingBoard.notes.push({
      id: uid("card"),
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
      <aside id="bpDbLinksInspector" class="bp-db-links-inspector" data-db-links-inspector="${escapeHTML(note.id)}" aria-label="Saved links inspector">
        <div class="bp-db-links-title">
          <div><strong>Saved links</strong><small>${escapeHTML(note.title || "Note")}</small></div>
          <div class="bp-db-links-title-actions">
            <span>${links.length}</span>
            <button type="button" class="bp-db-mini-button" data-db-links-close title="Close links inspector" aria-label="Close links inspector">×</button>
          </div>
        </div>
        <div class="bp-db-links-tools">
          <button type="button" data-db-reset-size="${escapeHTML(note.id)}" title="Restore this note to a recoverable size">Reset size</button>
        </div>
        ${links.length ? `
          <div class="bp-db-links-list">
            ${links.map(link => `
              <div class="bp-db-link-row">
                <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHTML(link.url)}">${escapeHTML(link.label || link.url)}</a>
                <button type="button" class="bp-db-mini-button" data-db-link-delete="${escapeHTML(note.id)}" data-db-link-id="${escapeHTML(link.id)}" title="Delete saved link" aria-label="Delete saved link">×</button>
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
    const links = normalizeLinks(note.links);
    const collapsed = Boolean(note.collapsed);
    const narrow = note.w <= cfg.minW;
    const selected = runtime.openLinksNoteId === note.id;

    return `
      <article class="bp-db-note${collapsed ? " bp-db-note-collapsed" : ""}${narrow ? " bp-db-note-narrow" : ""}${selected ? " bp-db-note-links-selected" : ""}"
        data-note-id="${escapeHTML(note.id)}"${collapsed ? ` data-db-collapsed-drag="${escapeHTML(note.id)}"` : ""}
        style="left:${left}%;top:${top}%;width:${width}%;height:${height}%;z-index:${note.z};--bp-db-note-bg:${escapeHTML(note.color)};--bp-db-note-text:${escapeHTML(note.textColor)};">
        <div class="bp-db-note-header">
          ${collapsed
            ? `<strong class="bp-db-collapsed-title">${escapeHTML(note.title || "Note")}</strong>`
            : `<input class="bp-db-title" data-db-title="${escapeHTML(note.id)}" value="${escapeHTML(note.title || "Note")}" aria-label="Drawing Board note title" title="Edit note title" />
               <button type="button" class="bp-db-mini-button bp-db-links" data-db-links-toggle="${escapeHTML(note.id)}" title="Saved links (${links.length})" aria-label="Saved links">🔗${links.length ? `<span>${links.length}</span>` : ""}</button>`}
          <button type="button" class="bp-db-collapse-toggle" data-db-collapse-toggle="${escapeHTML(note.id)}" title="${collapsed ? "Expand note" : "Collapse to title card"}" aria-label="${collapsed ? "Expand note" : "Collapse note"}" aria-expanded="${!collapsed}"></button>
        </div>
        ${collapsed ? "" : `
          <div class="bp-db-note-body" contenteditable="true" spellcheck="true" data-db-body="${escapeHTML(note.id)}">${sanitizeRichHTML(note.html || linkifyText(note.text))}</div>
          <div class="bp-db-note-footer">
            <label class="bp-db-color-field" title="Note background colour"><input type="color" data-db-color="${escapeHTML(note.id)}" value="${escapeHTML(note.color)}" aria-label="Note background colour" /></label>
            <label class="bp-db-color-field" title="Note text colour"><input type="color" data-db-text-color="${escapeHTML(note.id)}" value="${escapeHTML(note.textColor)}" aria-label="Note text colour" /></label>
            <span class="bp-db-drag-zone" data-db-drag="${escapeHTML(note.id)}" title="Drag note from bottom chrome" aria-label="Drag note"></span>
            <span class="bp-db-resize" data-db-resize="${escapeHTML(note.id)}" aria-label="Resize note" title="Resize note">↘</span>
            <button type="button" class="bp-db-mini-button bp-db-delete" data-db-delete="${escapeHTML(note.id)}" title="Delete note" aria-label="Delete note">×</button>
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
      <section class="bp-panel">
        <div class="bp-panel-header bp-db-header">
          <div class="bp-section-title">
            <h2>Drawing Board</h2>
            <span class="bp-section-kicker">Expand to edit · collapse to store</span>
          </div>
          <div class="bp-db-actions" aria-label="Drawing Board actions">
            <span class="bp-pill">${appState.drawingBoard.notes.length} notes · ${collapsedCount} cards</span>
            <button type="button" id="bpRepairBoard" title="Recover small or offscreen cards">Repair Layout</button>
            <button type="button" id="bpExportBoard" title="Export only the Drawing Board">Export Board</button>
            <button type="button" id="bpImportBoardBtn" title="Import a Drawing Board JSON file">Import Board</button>
            <input id="bpBoardImportFile" class="bp-hidden" type="file" accept="application/json,.json" />
          </div>
        </div>
        <div class="bp-db-shell">
          <div id="bpDrawingBoardGrid" class="bp-db-board" style="--bp-db-cols:${cfg.columns};--bp-db-rows:${cfg.rows};">
            ${appState.drawingBoard.notes.map(renderDrawingBoardNote).join("")}
          </div>
          ${renderSavedLinksInspector()}
          <button type="button" id="bpAddBoardNote" class="bp-db-add" aria-label="Add Drawing Board note">+</button>
        </div>
        <details class="bp-db-guide">
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
      element.style.setProperty("--bp-db-note-bg", note.color);
      element.style.setProperty("--bp-db-note-text", note.textColor);
    });
  }

  function startNotePointer(event, noteId, mode) {
    event.preventDefault();
    const board = $("#bpDrawingBoardGrid");
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
      element.classList.toggle("bp-db-note-narrow", note.w <= CONFIG.drawingBoard.minW);
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
    $("#bpAddBoardNote")?.addEventListener("click", addDrawingBoardNote);
    $("#bpRepairBoard")?.addEventListener("click", () => {
      commitDrawingBoardBodies();
      const changed = repairBoardLayout();
      saveState();
      renderApp();
      showToast(changed ? "Drawing Board layout repaired." : "Drawing Board layout already looked safe.");
    });
    $("#bpExportBoard")?.addEventListener("click", exportDrawingBoard);
    $("#bpImportBoardBtn")?.addEventListener("click", () => $("#bpBoardImportFile")?.click());
    $("#bpBoardImportFile")?.addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (file) importDrawingBoard(file);
      event.target.value = "";
    });

    $$('[data-db-collapse-toggle]').forEach(button => {
      button.addEventListener("pointerdown", event => event.stopPropagation());
      button.addEventListener("click", event => {
        event.stopPropagation();
        commitDrawingBoardBodies();
        const noteId = button.dataset.dbCollapseToggle;
        if (!toggleNoteCollapsed(noteId)) return;
        if (runtime.openLinksNoteId === noteId) runtime.openLinksNoteId = "";
        saveState();
        renderApp();
      });
    });

    $$('[data-db-collapsed-drag]').forEach(card => {
      card.addEventListener("pointerdown", event => {
        if (event.target.closest('[data-db-collapse-toggle]')) return;
        startNotePointer(event, card.dataset.dbCollapsedDrag, "move");
      });
    });

    $$('[data-db-title]').forEach(input => {
      input.addEventListener("pointerdown", event => event.stopPropagation());
      input.addEventListener("click", event => event.stopPropagation());
      const updateTitle = ({ finalize = false } = {}) => {
        const note = appState.drawingBoard.notes.find(item => item.id === input.dataset.dbTitle);
        if (!note) return;
        const nextTitle = finalize ? (input.value.trim() || "Note") : input.value;
        if (note.title === nextTitle) return;
        note.title = nextTitle;
        note.updatedAt = new Date().toISOString();
        if (finalize) saveState();
        else queueSaveState();
      };
      input.addEventListener("input", () => updateTitle());
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
        }
      });
      input.addEventListener("blur", () => {
        updateTitle({ finalize: true });
        input.value = input.value.trim() || "Note";
        flushPendingSave();
      });
    });

    $$('[data-db-delete]').forEach(button => {
      button.addEventListener("click", () => {
        if (!confirm("Delete this note?")) return;
        if (runtime.openLinksNoteId === button.dataset.dbDelete) runtime.openLinksNoteId = "";
        appState.drawingBoard.notes = appState.drawingBoard.notes.filter(note => note.id !== button.dataset.dbDelete);
        saveState();
        renderApp();
      });
    });

    $$('[data-db-links-toggle]').forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();
        commitDrawingBoardBodies();
        flushPendingSave();
        runtime.openLinksNoteId = runtime.openLinksNoteId === button.dataset.dbLinksToggle ? "" : button.dataset.dbLinksToggle;
        renderApp();
      });
    });
    $$('[data-db-links-close]').forEach(button => button.addEventListener("click", () => {
      commitDrawingBoardBodies();
      flushPendingSave();
      runtime.openLinksNoteId = "";
      renderApp();
    }));
    $$('[data-db-reset-size]').forEach(button => button.addEventListener("click", () => {
      if (!resetNoteSize(button.dataset.dbResetSize)) {
        showToast("No safe space was available to reset this note.");
        return;
      }
      saveState();
      renderApp();
      showToast("Note card size reset.");
    }));
    $$('[data-db-link-delete]').forEach(button => button.addEventListener("click", () => {
      const note = appState.drawingBoard.notes.find(item => item.id === button.dataset.dbLinkDelete);
      if (!note) return;
      note.links = normalizeLinks(note.links).filter(link => link.id !== button.dataset.dbLinkId);
      note.updatedAt = new Date().toISOString();
      saveState();
      renderApp();
    }));

    $$('[data-db-color]').forEach(input => {
      input.addEventListener("pointerdown", event => event.stopPropagation());
      input.addEventListener("input", () => {
        const note = appState.drawingBoard.notes.find(item => item.id === input.dataset.dbColor);
        if (!note) return;
        note.color = input.value;
        note.updatedAt = new Date().toISOString();
        queueSaveState();
        updateDrawingBoardColours();
      });
    });
    $$('[data-db-text-color]').forEach(input => {
      input.addEventListener("pointerdown", event => event.stopPropagation());
      input.addEventListener("input", () => {
        const note = appState.drawingBoard.notes.find(item => item.id === input.dataset.dbTextColor);
        if (!note) return;
        note.textColor = input.value;
        note.updatedAt = new Date().toISOString();
        queueSaveState();
        updateDrawingBoardColours();
      });
    });

    $$('[data-db-body]').forEach(element => {
      element.addEventListener("pointerdown", event => event.stopPropagation());
      element.addEventListener("click", event => event.stopPropagation());
      element.addEventListener("input", () => {
        const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbBody);
        if (persistBody(note, element)) queueSaveState();
      });
      element.addEventListener("paste", event => {
        const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbBody);
        if (!note) return;
        const html = event.clipboardData?.getData("text/html") || "";
        const text = event.clipboardData?.getData("text/plain") || "";
        const hasRichHTML = Boolean(html.trim());
        const inserted = hasRichHTML ? sanitizeRichHTML(html) : linkifyText(text);
        if (inserted) {
          event.preventDefault();
          insertHTMLAtCursor(inserted);
        }
        const richCandidates = hasRichHTML ? linksFromRichHTML(html) : [];
        const candidates = richCandidates.length ? richCandidates : linksFromText(text);
        const added = addLinks(note, candidates);
        persistBody(note, element);
        saveState();
        if (added) showToast(candidates.length > 1 ? "Links saved to note." : "Link saved to note.");
      });
      element.addEventListener("blur", () => {
        const note = appState.drawingBoard.notes.find(item => item.id === element.dataset.dbBody);
        const changed = persistBody(note, element, { sanitizeElement: true });
        if (changed || saveTimer) saveState();
      });
    });

    $$('[data-db-drag]').forEach(handle => handle.addEventListener("pointerdown", event => startNotePointer(event, handle.dataset.dbDrag, "move")));
    $$('[data-db-resize]').forEach(handle => handle.addEventListener("pointerdown", event => startNotePointer(event, handle.dataset.dbResize, "resize")));
  }

  /***************************************************************************
   * Versioned persistence and migration
   ***************************************************************************/
  function normalizePreferences(source = {}) {
    const input = source && typeof source === "object" ? source : {};
    return {
      theme: getTheme(input.theme).id,
      appMode: input.appMode === "light" ? "light" : "dark",
      readerMode: input.readerMode === "dark" ? "dark" : "light",
      density: input.density === "readable" ? "readable" : "compact"
    };
  }

  function normalizeActiveTab(value) {
    return value === "drawingBoard" ? "drawingBoard" : "notes";
  }

  // Legacy names are accepted only here. Current runtime/state never emits them.
  function migratePreferences(source = {}) {
    const input = source && typeof source === "object" ? source : {};
    return normalizePreferences({
      theme: input.theme,
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
    return ["drawingBoard", "drawing-board", "quicknotes", "quickNotes"].includes(value) ? "drawingBoard" : "notes";
  }

  function migrateWorkspace(input) {
    const source = input && typeof input === "object" ? input : {};
    const preferenceSource = source.preferences || source.ui || {};
    const boardSource = source.drawingBoard || source.quickNotes || source.board || {};
    const legacyQuote = source.placeholders && typeof source.placeholders === "object" ? source.placeholders.HEADER_QUOTE : "";
    return {
      schemaVersion: CONFIG.workspaceSchema,
      appVersion: CONFIG.appVersion,
      activeTab: migrateActiveTab(source.activeTab),
      headerQuote: String(source.headerQuote || legacyQuote || DEFAULT_STATE.headerQuote).slice(0, 240),
      preferences: migratePreferences(preferenceSource),
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
      runtime.quoteEditorOpen = false;
      saveState();
      renderApp();
      showToast("Backpack workspace imported and upgraded to v2.6.1.");
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
    destroyTypewriter();
    appState.activeTab = normalizeActiveTab(appState.activeTab);
    applyUI();
    renderTabs();
    const tab = activeTab();
    $("#bpWorkspace").innerHTML = tab.render();
    tab.bind();
  }

  function bindGlobalUI() {
    document.addEventListener("click", event => {
      const tab = event.target.closest("[data-tab]");
      if (tab) {
        commitDrawingBoardBodies();
        appState.activeTab = normalizeActiveTab(tab.dataset.tab);
        runtime.openLinksNoteId = "";
        runtime.notesTypewriterSettingsOpen = false;
        saveState();
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

    $("#bpHeaderQuoteBtn")?.addEventListener("click", event => {
      event.stopPropagation();
      runtime.quoteEditorOpen = !runtime.quoteEditorOpen;
      runtime.dataMenuOpen = false;
      runtime.displayMenuOpen = false;
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
      runtime.displayMenuOpen = false;
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

    $("#bpThemeBtn")?.addEventListener("click", () => {
      appState.preferences.theme = getNextThemeId();
      saveState();
      applyUI();
    });
    $("#bpDisplayBtn")?.addEventListener("click", event => {
      event.stopPropagation();
      runtime.displayMenuOpen = !runtime.displayMenuOpen;
      runtime.dataMenuOpen = false;
      runtime.quoteEditorOpen = false;
      applyUI();
    });
    $("#bpDarkBtn")?.addEventListener("click", () => {
      appState.preferences.appMode = appState.preferences.appMode === "dark" ? "light" : "dark";
      saveState();
      applyUI();
    });
    $("#bpReadBtn")?.addEventListener("click", () => {
      commitDrawingBoardBodies();
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
      if (runtime.quoteEditorOpen) {
        runtime.quoteEditorOpen = false;
        applyUI();
        $("#bpHeaderQuoteBtn")?.focus();
      } else if (runtime.openLinksNoteId) {
        commitDrawingBoardBodies();
        flushPendingSave();
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
    window.addEventListener("beforeunload", () => {
      commitDrawingBoardBodies();
      destroyTypewriter();
      flushPendingSave();
    });
    saveState();
    renderApp();
  }

  boot();
})();
