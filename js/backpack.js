/***************************************************************************
     * THE BACKPACK ALPHA CONFIG
     * Edit this area first when monthly arrival expectations or grid size change.
     ***************************************************************************/
    const BP_USER_CONFIG = {
      appVersion: "0.1.0-alpha",
      storageKey: "the-backpack-alpha-state-v1",
      notesFile: "notes.md",
      beesMarkdownFile: "content/basic_newton.md",
      beesQuoteFile: "content/basic_newton_quote.html",
      wikiBeeDescriptionFile: "content/Bee_Description.md",
      wikiBeeFamiliesFile: "content/Bee_Families.md",

      calendar: {
        dayStartHour: 7,
        weekStartsOn: 1, // 0 = Sunday, 1 = Monday.
        expectedArrivalByMonth: {
          default: "07:00"
          // Example monthly override:
          // "2026-06": "07:30"
        }
      },

      quickNotes: {
        cell: 40,
        columns: 24,
        rows: 14,
        defaultW: 4,
        defaultH: 3,
        minW: 3,
        minH: 2,
        maxOverlapCells: 1
      }
    };

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

    function pad2(value) {
      return String(value).padStart(2, "0");
    }

    function toDateKey(date) {
      return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
    }

    function fromDateKey(key) {
      const [y, m, d] = key.split("-").map(Number);
      return new Date(y, m - 1, d);
    }

    function monthKeyFromDate(date) {
      return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
    }

    function dateLabel(dateKey) {
      return fromDateKey(dateKey).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }

    function timeToMinutes(time) {
      const match = String(time || "").match(/^(\d{1,2}):(\d{2})$/);
      if (!match) return null;
      return Number(match[1]) * 60 + Number(match[2]);
    }

    function normalizeTimePrefix(title) {
      const match = String(title || "").trim().match(/^(\d{1,2}):(\d{2})(?:\s*-\s*|\s+)?(.+)?$/);
      if (!match) return null;
      const hour = Number(match[1]);
      const minute = Number(match[2]);
      if (hour > 23 || minute > 59) return null;
      return `${pad2(hour)}:${pad2(minute)}`;
    }

    function getBackpackTodayKey() {
      const now = new Date();
      if (now.getHours() < BP_USER_CONFIG.calendar.dayStartHour) {
        now.setDate(now.getDate() - 1);
      }
      return toDateKey(now);
    }

    function getExpectedArrival(dateKey) {
      const monthKey = dateKey.slice(0, 7);
      return BP_USER_CONFIG.calendar.expectedArrivalByMonth[monthKey]
        || BP_USER_CONFIG.calendar.expectedArrivalByMonth.default
        || "07:00";
    }

    function getArrivalStatus(dateKey) {
      const arrival = appState.calendar.arrivals[dateKey]?.arrivalTime;
      if (!arrival) return "none";
      const expected = getExpectedArrival(dateKey);
      const arrivalMinutes = timeToMinutes(arrival);
      const expectedMinutes = timeToMinutes(expected);
      if (arrivalMinutes == null || expectedMinutes == null) return "none";
      return arrivalMinutes > expectedMinutes ? "late" : "on-time";
    }

    function showToast(message) {
      const stack = $("#bpToasts");
      const toast = document.createElement("div");
      toast.className = "bp-toast";
      toast.textContent = message;
      stack.appendChild(toast);
      window.setTimeout(() => toast.remove(), 3200);
    }

    async function copyText(text, label = "Copied") {
      try {
        await navigator.clipboard.writeText(text);
        showToast(label);
      } catch (error) {
        showToast("Clipboard unavailable. Select and copy manually.");
      }
    }

    function deepMergeDefaults(defaults, input) {
      if (Array.isArray(defaults)) return Array.isArray(input) ? input : defaults;
      if (!defaults || typeof defaults !== "object") return input ?? defaults;
      const output = { ...defaults };
      if (!input || typeof input !== "object") return output;
      for (const [key, value] of Object.entries(input)) {
        output[key] = key in defaults ? deepMergeDefaults(defaults[key], value) : value;
      }
      return output;
    }

    /***************************************************************************
     * State
     ***************************************************************************/
    const defaultState = {
      version: BP_USER_CONFIG.appVersion,
      activeTab: "calendar",
      calendar: {
        currentMonth: monthKeyFromDate(fromDateKey(getBackpackTodayKey())),
        selectedDate: getBackpackTodayKey(),
        arrivals: {},
        events: {}
      },
      notes: {
        markdown: "",
        source: "pending"
      },
      bees: {
        markdown: "",
        quoteHtml: "",
        markdownSource: "pending",
        quoteSource: "pending"
      },
      wikiBees: {
        activeSection: "overview",
        activeImage: 0,
        description: {
          markdown: "",
          source: "pending"
        },
        families: {
          markdown: "",
          source: "pending"
        }
      },
      quickNotes: {
        notes: [],
        nextZ: 1
      },
      placeholders: {
        PROJECT_NAME: "The Backpack",
        PROJECT_PATH: "",
        CONTENT_PATH: "",
        HTML_ENTRY: "",
        CSS_PATH: "",
        JS_PATH: "",
        NOTES_FILE: "",
        BASIC_MD: "",
        BASIC_HTML: "",
        WIKI_BEE_DESCRIPTION: "",
        WIKI_BEE_FAMILIES: "",
        WIKI_BEE_IMAGES: "",
        WIKI_BEE_WORKER_IMAGE: "",
        WIKI_BEE_HIVE_IMAGE: "",
        EXPORT_PATH: "",
        SERVER_PORT: "8000",
        AUTHOR: "",
        CUSTOM_1: "",
        CUSTOM_2: "",
        HEADER_QUOTE: "An inspiring quote section goes here, holding space between title and customizer buttons"
      },
      ui: {
        editingEventId: null,
        darkMode: true,
        readingDark: false,
        density: "compact",
        codeCategory: "all",
        accessibleMode: false
      }
    };

    let appState = loadState();

    function loadState() {
      try {
        const raw = localStorage.getItem(BP_USER_CONFIG.storageKey);
        if (!raw) return structuredClone(defaultState);
        return deepMergeDefaults(defaultState, JSON.parse(raw));
      } catch (error) {
        console.warn("Backpack state failed to load:", error);
        return structuredClone(defaultState);
      }
    }

    function saveState() {
      appState.version = BP_USER_CONFIG.appVersion;
      localStorage.setItem(BP_USER_CONFIG.storageKey, JSON.stringify(appState));
    }

    function exportState() {
      const payload = {
        exportedAt: new Date().toISOString(),
        app: "The Backpack",
        state: appState
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backpack-state-${toDateKey(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Backpack state exported.");
    }

    async function importStateFile(file) {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const incoming = parsed.state || parsed;
        if (!incoming || typeof incoming !== "object") throw new Error("Invalid state file.");
        if (!confirm("Importing will replace the current Backpack state. Continue?")) return;
        appState = deepMergeDefaults(defaultState, incoming);
        saveState();
        renderApp();
        showToast("Backpack state imported.");
      } catch (error) {
        console.error(error);
        showToast("Could not import that state file.");
      }
    }

    /***************************************************************************
     * Placeholder parser
     ***************************************************************************/
    function getBuiltInPlaceholders() {
      const today = new Date();
      return {
        TODAY: toDateKey(today),
        CURRENT_DATE: today.toLocaleDateString(),
        CURRENT_MONTH: monthKeyFromDate(today),
        CURRENT_YEAR: String(today.getFullYear()),
        BACKPACK_DAY: getBackpackTodayKey()
      };
    }

    function getPlaceholderContext() {
      return {
        ...getBuiltInPlaceholders(),
        ...appState.placeholders
      };
    }

    function parsePlaceholders(text, context = getPlaceholderContext()) {
      return String(text ?? "").replace(/\{\{\s*([A-Z0-9_\-]+)\s*\}\}/g, (full, key) => {
        return Object.prototype.hasOwnProperty.call(context, key) && context[key] !== ""
          ? context[key]
          : full;
      });
    }

    /***************************************************************************
     * Markdown renderer: intentionally basic and safe. Raw HTML is escaped.
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
      const html = [];
      let inCode = false;
      let codeBuffer = [];
      let inUl = false;
      let inOl = false;
      const closeLists = () => {
        if (inUl) { html.push("</ul>"); inUl = false; }
        if (inOl) { html.push("</ol>"); inOl = false; }
      };

      for (const line of lines) {
        if (line.trim().startsWith("```")) {
          if (!inCode) {
            closeLists();
            inCode = true;
            codeBuffer = [];
          } else {
            html.push(`<pre><code>${escapeHTML(codeBuffer.join("\n"))}</code></pre>`);
            inCode = false;
          }
          continue;
        }
        if (inCode) {
          codeBuffer.push(line);
          continue;
        }
        if (!line.trim()) {
          closeLists();
          continue;
        }
        const heading = line.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
          closeLists();
          const level = heading[1].length;
          html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
          continue;
        }
        const quote = line.match(/^>\s+(.+)$/);
        if (quote) {
          closeLists();
          html.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
          continue;
        }
        const ul = line.match(/^[-*]\s+(.+)$/);
        if (ul) {
          if (inOl) { html.push("</ol>"); inOl = false; }
          if (!inUl) { html.push("<ul>"); inUl = true; }
          html.push(`<li>${inlineMarkdown(ul[1])}</li>`);
          continue;
        }
        const ol = line.match(/^\d+\.\s+(.+)$/);
        if (ol) {
          if (inUl) { html.push("</ul>"); inUl = false; }
          if (!inOl) { html.push("<ol>"); inOl = true; }
          html.push(`<li>${inlineMarkdown(ol[1])}</li>`);
          continue;
        }
        closeLists();
        html.push(`<p>${inlineMarkdown(line)}</p>`);
      }
      closeLists();
      if (inCode) html.push(`<pre><code>${escapeHTML(codeBuffer.join("\n"))}</code></pre>`);
      return html.join("\n");
    }

    /***************************************************************************
     * Tab registry
     ***************************************************************************/
    const tabs = [
      { id: "calendar", label: "Calendar", icon: "📅", render: renderCalendar },
      { id: "notes", label: "Notes", icon: "📓", render: renderNotes },
      { id: "code", label: "Code Blocks", icon: "⌘", render: renderCodeBlocks },
      { id: "quicknotes", label: "Quick Notes", icon: "🗒️", render: renderQuickNotes },
      { id: "museum", label: "CSS Museum", icon: "🏛️", render: renderMuseum },
      { id: "bees", label: "Template - Basic", icon: "🐝", render: renderBeesInfo },
      { id: "wikibees", label: "Template - Medium", icon: "📚", render: renderWikiBees },
      { id: "settings", label: "Placeholders", icon: "⚙️", render: renderSettings }
    ];

    function renderApp() {
      applyGlobalUIState();
      renderTabs();
      const tab = tabs.find(item => item.id === appState.activeTab) || tabs[0];
      $("#bpWorkspace").innerHTML = tab.render();
      bindCurrentTab(tab.id);
      saveState();
    }

    function renderTabs() {
      $("#bpTabs").innerHTML = tabs.map(tab => `
        <button class="bp-tab" type="button" data-tab="${tab.id}" aria-selected="${tab.id === appState.activeTab}">
          <span aria-hidden="true">${tab.icon}</span>
          <span>${tab.label}</span>
        </button>
      `).join("");
    }

    function bindCurrentTab(tabId) {
      if (tabId === "calendar") bindCalendar();
      if (tabId === "notes") bindNotes();
      if (tabId === "code") bindCodeBlocks();
      if (tabId === "quicknotes") bindQuickNotes();
      if (tabId === "museum") bindMuseum();
      if (tabId === "bees") bindBeesInfo();
      if (tabId === "wikibees") bindWikiBees();
      if (tabId === "settings") bindSettings();
    }

    /***************************************************************************
     * Calendar module
     ***************************************************************************/
    function getDaysForMonth(monthKey) {
      const [year, month] = monthKey.split("-").map(Number);
      const first = new Date(year, month - 1, 1);
      const last = new Date(year, month, 0);
      const weekStartsOn = BP_USER_CONFIG.calendar.weekStartsOn;
      const leading = (first.getDay() - weekStartsOn + 7) % 7;
      const cells = [];
      for (let i = 0; i < leading; i++) cells.push(null);
      for (let day = 1; day <= last.getDate(); day++) cells.push(new Date(year, month - 1, day));
      while (cells.length % 7 !== 0) cells.push(null);
      return cells;
    }

    function getHighestPriorityForDay(dateKey) {
      const priorities = (appState.calendar.events[dateKey] || []).map(event => event.priority);
      if (priorities.includes("highest")) return "highest";
      if (priorities.includes("high")) return "high";
      if (priorities.includes("normal")) return "normal";
      return null;
    }

    function sortedEvents(events) {
      return [...events].sort((a, b) => {
        const aTime = normalizeTimePrefix(a.title);
        const bTime = normalizeTimePrefix(b.title);
        if (aTime && bTime) return timeToMinutes(aTime) - timeToMinutes(bTime);
        if (aTime && !bTime) return -1;
        if (!aTime && bTime) return 1;
        return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
      });
    }

    function renderCalendar() {
      const monthDate = fromDateKey(`${appState.calendar.currentMonth}-01`);
      const monthTitle = monthDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
      const todayKey = getBackpackTodayKey();
      const weekdaysBase = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weekdays = [...weekdaysBase.slice(BP_USER_CONFIG.calendar.weekStartsOn), ...weekdaysBase.slice(0, BP_USER_CONFIG.calendar.weekStartsOn)];
      const cells = getDaysForMonth(appState.calendar.currentMonth);

      return `
        <section class="bp-panel">
          <div class="bp-calendar-layout">
            <div>
              <div class="bp-calendar-toolbar">
                <h2 style="margin:0;">Calendar</h2>
                <div class="bp-calendar-month-title">${monthTitle}</div>
                <div class="bp-calendar-nav">
                  <button data-calendar-action="prev">◀</button>
                  <button data-calendar-action="today">Today</button>
                  <button data-calendar-action="next">▶</button>
                </div>
              </div>
              <div class="bp-calendar-weekdays">
                ${weekdays.map(day => `<div class="bp-calendar-weekday">${day}</div>`).join("")}
              </div>
              <div class="bp-calendar-grid">
                ${cells.map(date => renderCalendarDay(date, todayKey)).join("")}
              </div>
            </div>
            ${renderSelectedDayPanel()}
          </div>
        </section>
      `;
    }

    function renderCalendarDay(date, todayKey) {
      if (!date) return `<div class="bp-day bp-day-empty" aria-hidden="true"></div>`;
      const dateKey = toDateKey(date);
      const arrivalStatus = getArrivalStatus(dateKey);
      const events = appState.calendar.events[dateKey] || [];
      const priority = getHighestPriorityForDay(dateKey);
      const classes = ["bp-day"];
      if (dateKey === todayKey) classes.push("bp-day-today");
      if (dateKey === appState.calendar.selectedDate) classes.push("bp-day-selected");
      if (arrivalStatus === "late") classes.push("bp-day-late");
      if (arrivalStatus === "on-time") classes.push("bp-day-on-time");
      if (priority) classes.push(`bp-day-priority-${priority}`);
      const arrivalPill = arrivalStatus === "late"
        ? `<span class="bp-pill bp-pill-late" title="Late arrival">⚠</span>`
        : arrivalStatus === "on-time"
          ? `<span class="bp-pill bp-pill-ok" title="On-time arrival">✓</span>`
          : "";
      const eventIcon = priority === "highest" ? "⛔" : priority === "high" ? "◆" : "▦";
      const eventPill = events.length
        ? `<span class="bp-pill ${priority === "highest" ? "bp-pill-highest" : priority === "high" ? "bp-pill-high" : ""}" title="${events.length} event${events.length === 1 ? "" : "s"}">${eventIcon}${events.length}</span>`
        : "";
      return `
        <button type="button" class="${classes.join(" ")}" data-date="${dateKey}" aria-label="Open ${dateLabel(dateKey)}">
          <div class="bp-day-number">${date.getDate()}</div>
          <div class="bp-muted"></div>
          <div class="bp-day-meta">${arrivalPill}${eventPill}</div>
        </button>
      `;
    }

    function renderSelectedDayPanel() {
      const dateKey = appState.calendar.selectedDate || getBackpackTodayKey();
      const arrival = appState.calendar.arrivals[dateKey]?.arrivalTime || "";
      const expected = getExpectedArrival(dateKey);
      const status = getArrivalStatus(dateKey);
      const events = sortedEvents(appState.calendar.events[dateKey] || []);
      const priorityColumns = [
        { id: "highest", label: "Highest", icon: "⛔" },
        { id: "high", label: "High", icon: "◆" },
        { id: "normal", label: "Normal", icon: "◇" }
      ].filter(column => events.length === 0 ? column.id === "normal" : events.some(event => event.priority === column.id));

      return `
        <aside class="bp-card">
          <h3>${dateLabel(dateKey)}</h3>
          <div class="bp-arrival-line">
            <label for="bpArrivalTime">Arrival <strong>${expected}</strong></label>
            <input id="bpArrivalTime" type="time" value="${escapeHTML(arrival)}" />
            ${status === "late" ? `<span class="bp-pill bp-pill-late" title="Late arrival">⚠ Late</span>` : ""}
            ${status === "on-time" ? `<span class="bp-pill bp-pill-ok" title="On-time arrival">✓ On time</span>` : ""}
            ${status === "none" ? `<span class="bp-pill">—</span>` : ""}
            ${arrival ? `<button type="button" data-calendar-action="clear-arrival" title="Clear arrival">×</button>` : ""}
          </div>

          <details class="bp-card" style="margin-bottom: .75rem;">
            <summary style="font-weight:900; cursor:pointer;">＋ New Event</summary>
            <div style="margin-top:.75rem;">
              <div class="bp-field">
                <label for="bpEventTitle">Title. Prefix with time to sort, for example: 07:30 - Appointment</label>
                <input id="bpEventTitle" placeholder="07:30 - Appointment with Dev" />
              </div>
              <div class="bp-row" style="align-items:end;">
                <div class="bp-field" style="min-width: 180px; margin-bottom:0;">
                  <label for="bpEventPriority">Priority</label>
                  <select id="bpEventPriority">
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="highest">Highest</option>
                  </select>
                </div>
                <button type="button" data-calendar-action="add-event">Add Event</button>
              </div>
              <details style="margin-top:.7rem;">
                <summary>Optional notes</summary>
                <div class="bp-field" style="margin-top:.6rem;">
                  <label for="bpEventNotes">Notes</label>
                  <textarea id="bpEventNotes" placeholder="Optional details"></textarea>
                </div>
              </details>
            </div>
          </details>

          <h4>${events.length >= 2 ? "Events as sorted stacked kanban blocks" : "Events"}</h4>
          <div class="bp-event-kanban">
            ${priorityColumns.map(column => `
              <div class="bp-event-column">
                <h4><span>${column.icon} ${column.label}</span><span>${events.filter(event => event.priority === column.id).length || ""}</span></h4>
                ${events.filter(event => event.priority === column.id).map(renderEventBlock).join("") || `<p class="bp-muted">No ${column.label.toLowerCase()} events.</p>`}
              </div>
            `).join("")}
          </div>
        </aside>
      `;
    }

    function renderEventBlock(event) {
      const editing = appState.ui.editingEventId === event.id;
      if (editing) {
        return `
          <div class="bp-event-block" data-priority="${event.priority}">
            <div class="bp-field"><label>Title</label><input data-edit-field="title" data-event-id="${event.id}" value="${escapeHTML(event.title)}"></div>
            <div class="bp-field"><label>Priority</label>
              <select data-edit-field="priority" data-event-id="${event.id}">
                ${["highest", "high", "normal"].map(priority => `<option value="${priority}" ${priority === event.priority ? "selected" : ""}>${priority}</option>`).join("")}
              </select>
            </div>
            <div class="bp-field"><label>Notes</label><textarea data-edit-field="notes" data-event-id="${event.id}">${escapeHTML(event.notes || "")}</textarea></div>
            <div class="bp-row">
              <button type="button" data-event-action="save" data-event-id="${event.id}">Save</button>
              <button type="button" data-event-action="cancel" data-event-id="${event.id}">Cancel</button>
            </div>
          </div>
        `;
      }
      const time = normalizeTimePrefix(event.title);
      return `
        <div class="bp-event-block" data-priority="${event.priority}">
          <div class="bp-event-title">${time ? `<span class="bp-pill">${time}</span> ` : ""}${escapeHTML(event.title)}</div>
          ${event.notes ? `<div class="bp-event-notes">${escapeHTML(event.notes)}</div>` : ""}
          <div class="bp-row" style="margin-top: .65rem;">
            <button type="button" data-event-action="edit" data-event-id="${event.id}">Edit</button>
            <button type="button" class="bp-danger" data-event-action="delete" data-event-id="${event.id}">Delete</button>
          </div>
        </div>
      `;
    }

    function bindCalendar() {
      $$('[data-date]').forEach(button => {
        button.addEventListener('click', () => {
          appState.calendar.selectedDate = button.dataset.date;
          appState.ui.editingEventId = null;
          renderApp();
        });
      });

      $$('[data-calendar-action]').forEach(button => {
        button.addEventListener('click', () => handleCalendarAction(button.dataset.calendarAction));
      });

      const arrival = $('#bpArrivalTime');
      if (arrival) {
        arrival.addEventListener('change', () => {
          const dateKey = appState.calendar.selectedDate;
          if (arrival.value) {
            appState.calendar.arrivals[dateKey] = {
              arrivalTime: arrival.value,
              updatedAt: new Date().toISOString()
            };
          } else {
            delete appState.calendar.arrivals[dateKey];
          }
          saveState();
          renderApp();
        });
      }

      $$('[data-event-action]').forEach(button => {
        button.addEventListener('click', () => handleEventAction(button.dataset.eventAction, button.dataset.eventId));
      });
    }

    function handleCalendarAction(action) {
      const [year, month] = appState.calendar.currentMonth.split('-').map(Number);
      if (action === 'prev' || action === 'next') {
        const offset = action === 'prev' ? -1 : 1;
        appState.calendar.currentMonth = monthKeyFromDate(new Date(year, month - 1 + offset, 1));
      }
      if (action === 'today') {
        const today = getBackpackTodayKey();
        appState.calendar.selectedDate = today;
        appState.calendar.currentMonth = today.slice(0, 7);
      }
      if (action === 'clear-arrival') {
        delete appState.calendar.arrivals[appState.calendar.selectedDate];
      }
      if (action === 'add-event') {
        const title = $('#bpEventTitle').value.trim();
        const priority = $('#bpEventPriority').value;
        const notes = $('#bpEventNotes').value.trim();
        if (!title) return showToast('Event title is required.');
        const dateKey = appState.calendar.selectedDate;
        appState.calendar.events[dateKey] ||= [];
        appState.calendar.events[dateKey].push({
          id: uid('evt'),
          title,
          priority,
          notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        showToast('Event added.');
      }
      appState.ui.editingEventId = null;
      saveState();
      renderApp();
    }

    function handleEventAction(action, eventId) {
      const dateKey = appState.calendar.selectedDate;
      const events = appState.calendar.events[dateKey] || [];
      const event = events.find(item => item.id === eventId);
      if (!event) return;
      if (action === 'edit') appState.ui.editingEventId = eventId;
      if (action === 'cancel') appState.ui.editingEventId = null;
      if (action === 'delete') {
        if (!confirm('Delete this event?')) return;
        appState.calendar.events[dateKey] = events.filter(item => item.id !== eventId);
        appState.ui.editingEventId = null;
      }
      if (action === 'save') {
        event.title = $(`[data-edit-field="title"][data-event-id="${eventId}"]`).value.trim() || event.title;
        event.priority = $(`[data-edit-field="priority"][data-event-id="${eventId}"]`).value;
        event.notes = $(`[data-edit-field="notes"][data-event-id="${eventId}"]`).value.trim();
        event.updatedAt = new Date().toISOString();
        appState.ui.editingEventId = null;
      }
      saveState();
      renderApp();
    }

    /***************************************************************************
     * Shared content source registry
     * A custom page should mostly register files here, then reuse fetch/upload/render helpers.
     ***************************************************************************/
    function getStatePath(path) {
      return path.reduce((cursor, key) => cursor?.[key], appState);
    }

    function setStatePath(path, value) {
      let cursor = appState;
      for (let i = 0; i < path.length - 1; i += 1) {
        cursor[path[i]] ||= {};
        cursor = cursor[path[i]];
      }
      cursor[path[path.length - 1]] = value;
    }

    function getContentSourceConfig(sourceId) {
      const sources = {
        notesMain: {
          label: 'notes.md',
          type: 'markdown',
          path: BP_USER_CONFIG.notesFile,
          statePath: ['notes', 'markdown'],
          sourcePath: ['notes', 'source'],
          fallback: ''
        },
        wikiBeeDescription: {
          label: 'Bee_Description.md',
          type: 'markdown',
          path: BP_USER_CONFIG.wikiBeeDescriptionFile,
          statePath: ['wikiBees', 'description', 'markdown'],
          sourcePath: ['wikiBees', 'description', 'source'],
          fallback: typeof wikiBeeDescriptionFallback !== 'undefined' ? wikiBeeDescriptionFallback : ''
        },
        wikiBeeFamilies: {
          label: 'Bee_Families.md',
          type: 'markdown',
          path: BP_USER_CONFIG.wikiBeeFamiliesFile,
          statePath: ['wikiBees', 'families', 'markdown'],
          sourcePath: ['wikiBees', 'families', 'source'],
          fallback: typeof wikiBeeFamiliesFallback !== 'undefined' ? wikiBeeFamiliesFallback : ''
        }
      };
      return sources[sourceId];
    }

    async function loadContentSource(sourceId, { rerenderTab = null } = {}) {
      const config = getContentSourceConfig(sourceId);
      if (!config) return;
      try {
        const response = await fetch(config.path, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setStatePath(config.statePath, await response.text());
        setStatePath(config.sourcePath, `Fetched ${config.label}`);
      } catch (error) {
        if (!getStatePath(config.statePath)) {
          setStatePath(config.statePath, config.fallback || '');
          setStatePath(config.sourcePath, config.fallback ? `Fallback ${config.label}; upload to replace` : 'Upload required');
        }
      }
      saveState();
      if (rerenderTab && appState.activeTab === rerenderTab) renderApp();
    }

    async function uploadContentSource(sourceId, file, { rerender = true } = {}) {
      const config = getContentSourceConfig(sourceId);
      if (!config || !file) return;
      setStatePath(config.statePath, await file.text());
      setStatePath(config.sourcePath, `Uploaded ${file.name}`);
      saveState();
      if (rerender) renderApp();
    }

    function clearContentSource(sourceId, { rerender = true } = {}) {
      const config = getContentSourceConfig(sourceId);
      if (!config) return;
      setStatePath(config.statePath, '');
      setStatePath(config.sourcePath, 'Upload required');
      saveState();
      if (rerender) renderApp();
    }

    function renderFileButton(inputId, label, accept) {
      return `<label class="bp-file-button">⬆ ${escapeHTML(label)}<input id="${inputId}" type="file" accept="${accept}" /></label>`;
    }

    /***************************************************************************
     * Notes module
     ***************************************************************************/
    async function loadExternalNotes() {
      await loadContentSource('notesMain', { rerenderTab: 'notes' });
    }

    function renderNotes() {
      const hasMarkdown = Boolean(appState.notes.markdown);
      return `
        <section class="bp-panel bp-notes-panel">
          <div class="bp-panel-header">
            <div>
              <h2>Notes</h2>
              <p>Backpack first tries to fetch <code>${BP_USER_CONFIG.notesFile}</code>. If that fails, upload a Markdown file. Raw HTML is escaped.</p>
            </div>
            <div class="bp-row">
              <span class="bp-pill">Source: ${escapeHTML(appState.notes.source)}</span>
              <button type="button" id="bpReloadNotes">Fetch notes.md</button>
            </div>
          </div>

          ${!hasMarkdown ? `
            <div class="bp-window bp-notes-window">
              <div class="bp-window-titlebar">
                <span class="bp-window-control" aria-hidden="true"></span>
                <div class="bp-window-lines">About Backpack Notes</div>
                <span class="bp-window-control" aria-hidden="true"></span>
              </div>
              <div class="bp-window-body bp-markdown">
                <h1>Upload notes.md</h1>
                <p>The browser could not fetch the notes file next to this HTML document. Upload the Markdown file manually to use it in this session and cache it locally.</p>
                <p>This window follows the Mac OS 8 reference: a readable document area should be the main space, not a tiny side panel.</p>
              </div>
              <div class="bp-window-footer">
                ${renderFileButton('bpNotesFile', 'Upload notes.md', '.md,.markdown,text/markdown,text/plain')}
              </div>
            </div>
          ` : `
            <div class="bp-row bp-note-tools" style="margin-bottom: .5rem;">
              ${renderFileButton('bpNotesFile', 'Replace notes.md', '.md,.markdown,text/markdown,text/plain')}
              <button type="button" id="bpClearNotes" title="Clear cached notes">× Clear Cached Notes</button>
            </div>
            <div class="bp-window bp-notes-window">
              <div class="bp-window-titlebar">
                <span class="bp-window-control" aria-hidden="true"></span>
                <div class="bp-window-lines">About Backpack Notes</div>
                <span class="bp-window-control" aria-hidden="true"></span>
              </div>
              <article class="bp-window-body bp-markdown">
                ${renderMarkdown(parsePlaceholders(appState.notes.markdown))}
              </article>
            </div>
          `}
        </section>
      `;
    }

    function bindNotes() {
      $('#bpReloadNotes')?.addEventListener('click', () => {
        appState.notes.source = 'Trying fetch...';
        saveState();
        renderApp();
        loadExternalNotes();
      });
      $('#bpNotesFile')?.addEventListener('change', async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        await uploadContentSource('notesMain', file);
        showToast('Notes file loaded and cached.');
      });
      $('#bpClearNotes')?.addEventListener('click', () => {
        if (!confirm('Clear cached notes?')) return;
        clearContentSource('notesMain');
      });
    }

    /***************************************************************************
     * Code Blocks module
     ***************************************************************************/
    const codeBlocks = [
      {
        title: 'Start Backpack server',
        category: 'Paths',
        description: 'Uses PROJECT_PATH and SERVER_PORT so the same command follows your workspace.',
        code: 'cd "{{PROJECT_PATH}}"\npython -m http.server {{SERVER_PORT}}'
      },
      {
        title: 'Open project root',
        category: 'Paths',
        description: 'Open the configured Backpack directory in VS Code.',
        code: 'code "{{PROJECT_PATH}}"'
      },
      {
        title: 'Open split source files',
        category: 'Paths',
        description: 'Quickly open the main HTML, CSS, and JS files after the split.',
        code: 'code "{{HTML_ENTRY}}" "{{CSS_PATH}}" "{{JS_PATH}}"'
      },
      {
        title: 'List Backpack content files',
        category: 'Content',
        description: 'Check the Markdown and HTML content files used by the Notes and Bees tabs.',
        code: 'cd "{{PROJECT_PATH}}"\nls -la "{{CONTENT_PATH}}"\nls -la "{{NOTES_FILE}}" "{{BASIC_MD}}" "{{BASIC_HTML}}"'
      },
      {
        title: 'Create content folder scaffold',
        category: 'Content',
        description: 'Create the expected content directory and starter files when setting up a new Backpack copy.',
        code: 'mkdir -p "{{CONTENT_PATH}}"\ntouch "{{NOTES_FILE}}" "{{BASIC_MD}}" "{{BASIC_HTML}}"'
      },

      {
        title: 'Open Wiki Bees files',
        category: 'Wiki Bees',
        description: 'Open the two Markdown files that drive the Wiki Bees middle content column.',
        code: 'code "{{WIKI_BEE_DESCRIPTION}}" "{{WIKI_BEE_FAMILIES}}"'
      },
      {
        title: 'Create Wiki Bees scaffold',
        category: 'Wiki Bees',
        description: 'Create local folders and placeholder files for the Wiki Bees tab, including image assets.',
        code: `mkdir -p "{{WIKI_BEE_IMAGES}}"
touch "{{WIKI_BEE_DESCRIPTION}}" "{{WIKI_BEE_FAMILIES}}"
# Add image files such as:
# {{WIKI_BEE_WORKER_IMAGE}}
# {{WIKI_BEE_HIVE_IMAGE}}`
      },
      {
        title: 'Create dated state backup path',
        category: 'Backup',
        description: 'Build a consistent exported-state destination from EXPORT_PATH and TODAY.',
        code: 'mkdir -p "{{EXPORT_PATH}}"\n# Save exported Backpack JSON as:\n{{EXPORT_PATH}}/backpack-state-{{TODAY}}.json'
      },
      {
        title: 'HTML module comment header',
        category: 'HTML',
        description: 'A consistent comment block for future split modules.',
        code: '<!--\n  {{PROJECT_NAME}} / {{CURRENT_MONTH}}\n  Root: {{PROJECT_PATH}}\n  Module: Calendar\n  Owner: {{AUTHOR}}\n-->'
      }
    ];

    function renderCodeBlocks() {
      const categories = ['all', ...new Set(codeBlocks.map(block => block.category))];
      const activeCategory = appState.ui.codeCategory || 'all';
      const visibleBlocks = activeCategory === 'all'
        ? codeBlocks
        : codeBlocks.filter(block => block.category === activeCategory);
      return `
        <section class="bp-panel">
          <div class="bp-panel-header">
            <div>
              <h2>Code Blocks</h2>
              <p>Compact copyable snippets. Placeholders are filled in the output; template source stays collapsed.</p>
            </div>
          </div>
          <div class="bp-filter-row" aria-label="Snippet categories">
            ${categories.map(category => `
              <button type="button" class="bp-filter-button" data-code-category="${escapeHTML(category)}" aria-pressed="${category === activeCategory}">
                ${category === 'all' ? 'All' : escapeHTML(category)}
              </button>
            `).join('')}
          </div>
          <div class="bp-snippet-grid">
            ${visibleBlocks.map((block) => {
              const index = codeBlocks.indexOf(block);
              const parsed = parsePlaceholders(block.code);
              return `
                <article class="bp-card bp-snippet-card">
                  <div class="bp-snippet-head">
                    <h3>${escapeHTML(block.title)}</h3>
                    <span class="bp-pill">${escapeHTML(block.category)}</span>
                  </div>
                  <p>${escapeHTML(block.description)}</p>
                  <pre class="bp-snippet-output"><code>${escapeHTML(parsed)}</code></pre>
                  <div class="bp-copy-line">
                    <button type="button" data-copy-code="${index}" data-copy-kind="resolved">⧉ Output</button>
                    <button type="button" data-copy-code="${index}" data-copy-kind="source">⧉ Template</button>
                  </div>
                  <details>
                    <summary>Template source</summary>
                    <pre><code>${escapeHTML(block.code)}</code></pre>
                  </details>
                </article>
              `;
            }).join('') || `<p class="bp-muted">No snippets in this category.</p>`}
          </div>
        </section>
      `;
    }

    function bindCodeBlocks() {
      $$('[data-code-category]').forEach(button => {
        button.addEventListener('click', () => {
          appState.ui.codeCategory = button.dataset.codeCategory || 'all';
          saveState();
          renderApp();
        });
      });
      $$('[data-copy-code]').forEach(button => {
        button.addEventListener('click', () => {
          const block = codeBlocks[Number(button.dataset.copyCode)];
          const text = button.dataset.copyKind === 'resolved' ? parsePlaceholders(block.code) : block.code;
          copyText(text, 'Code block copied.');
        });
      });
    }

    /***************************************************************************
     * Quick Notes module
     ***************************************************************************/
    const quickNoteColors = ['#ffd166', '#a7f3d0', '#bfdbfe', '#fecdd3', '#ddd6fe', '#fef3c7'];

    function noteRect(note) {
      return {
        left: note.col,
        top: note.row,
        right: note.col + note.w,
        bottom: note.row + note.h
      };
    }

    function exceedsOverlap(candidate, existing) {
      const a = noteRect(candidate);
      const b = noteRect(existing);
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX <= 0 || overlapY <= 0) return false;
      return overlapX > BP_USER_CONFIG.quickNotes.maxOverlapCells && overlapY > BP_USER_CONFIG.quickNotes.maxOverlapCells;
    }

    function canPlaceNote(candidate, ignoreId = null) {
      const cfg = BP_USER_CONFIG.quickNotes;
      if (candidate.col < 0 || candidate.row < 0 || candidate.col + candidate.w > cfg.columns || candidate.row + candidate.h > cfg.rows) return false;
      return !appState.quickNotes.notes.some(note => note.id !== ignoreId && exceedsOverlap(candidate, note));
    }

    function findFirstQuickNoteSpace() {
      const cfg = BP_USER_CONFIG.quickNotes;
      for (let row = 0; row <= cfg.rows - cfg.defaultH; row++) {
        for (let col = 0; col <= cfg.columns - cfg.defaultW; col++) {
          const candidate = { col, row, w: cfg.defaultW, h: cfg.defaultH };
          if (canPlaceNote(candidate)) return candidate;
        }
      }
      return null;
    }

    function addQuickNote() {
      const spot = findFirstQuickNoteSpace();
      if (!spot) return showToast('No available grid space for a new note.');
      appState.quickNotes.nextZ += 1;
      appState.quickNotes.notes.push({
        id: uid('qn'),
        ...spot,
        z: appState.quickNotes.nextZ,
        color: quickNoteColors[0],
        text: 'New note',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      saveState();
      renderApp();
    }

    function renderQuickNotes() {
      const cfg = BP_USER_CONFIG.quickNotes;
      return `
        <section class="bp-panel">
          <div class="bp-panel-header">
            <div>
              <h2>Quick Notes</h2>
            </div>
          </div>
          <div class="bp-qn-shell">
            <div id="bpQuickBoard" class="bp-qn-board" style="--bp-qn-cols:${cfg.columns};--bp-qn-rows:${cfg.rows};">
              ${appState.quickNotes.notes.map(renderQuickNote).join('')}
            </div>
            <button type="button" id="bpAddQuickNote" class="bp-qn-add" aria-label="Add quick note">+</button>
            <div class="bp-qn-help-footer">
              <span>${cfg.columns}×${cfg.rows} grid</span>
              <span>•</span>
              <span>${cfg.cell}px base</span>
              <span>•</span>
              <span>Move: header</span>
              <span>•</span>
              <span>Edit: body</span>
              <span>•</span>
              <span>Resize: ↘</span>
              <span>•</span>
              <span>Delete: ×</span>
              <span>•</span>
              <span>Overlap max ${cfg.maxOverlapCells} cell</span>
            </div>
          </div>
        </section>
      `;
    }

    function renderQuickNote(note) {
      const cfg = BP_USER_CONFIG.quickNotes;
      const left = (note.col / cfg.columns) * 100;
      const top = (note.row / cfg.rows) * 100;
      const width = (note.w / cfg.columns) * 100;
      const height = (note.h / cfg.rows) * 100;
      return `
        <article class="bp-qn-note" data-note-id="${note.id}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%;z-index:${note.z};background:${escapeHTML(note.color)};">
          <div class="bp-qn-note-header" data-qn-drag="${note.id}">
            <strong>Note</strong>
          </div>
          <div class="bp-qn-note-body" contenteditable="true" spellcheck="true" data-qn-body="${note.id}">${escapeHTML(note.text)}</div>
          <div class="bp-qn-note-footer">
            <input type="color" data-qn-color="${note.id}" value="${escapeHTML(note.color)}" aria-label="Note color" />
            <span></span>
            <span class="bp-qn-resize" data-qn-resize="${note.id}" aria-label="Resize note">↘</span>
            <button type="button" class="bp-qn-mini-button bp-qn-delete" data-qn-delete="${note.id}" title="Delete note" aria-label="Delete note">×</button>
          </div>
        </article>
      `;
    }

    function bindQuickNotes() {
      $('#bpAddQuickNote')?.addEventListener('click', addQuickNote);
      $$('[data-qn-delete]').forEach(button => {
        button.addEventListener('click', () => {
          if (!confirm('Delete this note?')) return;
          appState.quickNotes.notes = appState.quickNotes.notes.filter(note => note.id !== button.dataset.qnDelete);
          saveState();
          renderApp();
        });
      });
      $$('[data-qn-color]').forEach(input => {
        input.addEventListener('input', () => {
          const note = appState.quickNotes.notes.find(item => item.id === input.dataset.qnColor);
          if (!note) return;
          note.color = input.value;
          note.updatedAt = new Date().toISOString();
          saveState();
          renderQuickNotesSoft();
        });
      });
      $$('[data-qn-body]').forEach(body => {
        body.addEventListener('blur', () => {
          const note = appState.quickNotes.notes.find(item => item.id === body.dataset.qnBody);
          if (!note) return;
          note.text = body.innerText;
          note.updatedAt = new Date().toISOString();
          saveState();
        });
      });
      $$('[data-qn-drag]').forEach(handle => {
        handle.addEventListener('pointerdown', event => startQuickNotePointer(event, handle.dataset.qnDrag, 'move'));
      });
      $$('[data-qn-resize]').forEach(handle => {
        handle.addEventListener('pointerdown', event => startQuickNotePointer(event, handle.dataset.qnResize, 'resize'));
      });
    }

    function renderQuickNotesSoft() {
      // Color edits can be applied without interrupting the contenteditable cursor.
      appState.quickNotes.notes.forEach(note => {
        const el = $(`[data-note-id="${note.id}"]`);
        if (el) el.style.background = note.color;
      });
    }

    function startQuickNotePointer(event, noteId, mode) {
      event.preventDefault();
      const cfg = BP_USER_CONFIG.quickNotes;
      const note = appState.quickNotes.notes.find(item => item.id === noteId);
      if (!note) return;
      appState.quickNotes.nextZ += 1;
      note.z = appState.quickNotes.nextZ;
      const original = { ...note };
      const startX = event.clientX;
      const startY = event.clientY;
      const element = $(`[data-note-id="${noteId}"]`);
      element.setPointerCapture?.(event.pointerId);

      function onMove(moveEvent) {
        const board = $('#bpQuickBoard');
        const cellX = board.clientWidth / cfg.columns;
        const cellY = board.clientHeight / cfg.rows;
        const dc = Math.round((moveEvent.clientX - startX) / cellX);
        const dr = Math.round((moveEvent.clientY - startY) / cellY);
        const candidate = { ...note };
        if (mode === 'move') {
          candidate.col = original.col + dc;
          candidate.row = original.row + dr;
        } else {
          candidate.w = Math.max(cfg.minW, original.w + dc);
          candidate.h = Math.max(cfg.minH, original.h + dr);
        }
        if (canPlaceNote(candidate, note.id)) {
          Object.assign(note, candidate, { updatedAt: new Date().toISOString() });
          element.style.left = `${(note.col / cfg.columns) * 100}%`;
          element.style.top = `${(note.row / cfg.rows) * 100}%`;
          element.style.width = `${(note.w / cfg.columns) * 100}%`;
          element.style.height = `${(note.h / cfg.rows) * 100}%`;
          element.style.zIndex = note.z;
        }
      }

      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        saveState();
      }

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp, { once: true });
    }

    /***************************************************************************
     * Bees Information placeholder tab
     ***************************************************************************/
    const beesMarkdownFallback = `# Newton's Second Law: F = ma

This basic template now uses a physics example so it is visually distinct from the medium Wiki Bees template. It demonstrates a single Markdown source plus one optional HTML block.

## Formula

**F = m × a**

Where:

- **F** is force.
- **m** is mass.
- **a** is acceleration.

> A basic template is best for one focused article, a small lesson, or a single reference card.

## Placeholder test

Project: **{{PROJECT_NAME}}**

Author: **{{AUTHOR}}**

## Example

If a 4 kg object accelerates at 3 m/s², then:

~~~txt
F = m × a
F = 4 kg × 3 m/s²
F = 12 N
~~~
`;

    const beesQuoteFallback = `<!--
  BASIC TEMPLATE HTML BLOCK
  This optional HTML panel sits next to the Markdown source.
  Use it for quotes, small diagrams, or highlighted reference information.
-->
<blockquote class="bp-demo-callout">
  <h3>Newton Reference</h3>
  <p><strong>F = ma</strong> means force equals mass times acceleration.</p>
  <p>Template project: {{PROJECT_NAME}}</p>
</blockquote>`;

    const beeFormula = `// Newton's Second Law mini snippets
Formula: F = m * a

Given:
  m = 4 kg
  a = 3 m/s^2

Compute:
  F = 4 * 3
  F = 12 N

HTML:
<span class="bp-pill">F = ma</span>`;

    async function loadBeesFiles() {
      try {
        const response = await fetch(BP_USER_CONFIG.beesMarkdownFile, { cache: 'no-store' });
        if (!response.ok) throw new Error('Missing bees markdown');
        appState.bees.markdown = await response.text();
        appState.bees.markdownSource = `Fetched ${BP_USER_CONFIG.beesMarkdownFile}`;
      } catch (error) {
        if (!appState.bees.markdown) {
          appState.bees.markdown = beesMarkdownFallback;
          appState.bees.markdownSource = 'Fallback markdown; upload bees.md to replace';
        }
      }

      try {
        const response = await fetch(BP_USER_CONFIG.beesQuoteFile, { cache: 'no-store' });
        if (!response.ok) throw new Error('Missing bees quote html');
        appState.bees.quoteHtml = await response.text();
        appState.bees.quoteSource = `Fetched ${BP_USER_CONFIG.beesQuoteFile}`;
      } catch (error) {
        if (!appState.bees.quoteHtml) {
          appState.bees.quoteHtml = beesQuoteFallback;
          appState.bees.quoteSource = 'Fallback HTML; upload bees_quote.html to replace';
        }
      }
      saveState();
      if (appState.activeTab === 'bees') renderApp();
    }

    function renderBeesInfo() {
      const markdown = appState.bees.markdown || beesMarkdownFallback;
      const quoteHtml = appState.bees.quoteHtml || beesQuoteFallback;

      return `
        <section class="bp-panel">
          <div class="bp-panel-header">
            <div>
              <h2>Template - Basic</h2>
              <p>Basic custom page template: one Markdown source, one HTML section, placeholders, and one copyable formula block.</p>
            </div>
            <div class="bp-row">
              <span class="bp-pill">${escapeHTML(appState.bees.markdownSource)}</span>
              <span class="bp-pill">${escapeHTML(appState.bees.quoteSource)}</span>
            </div>
          </div>

          <div class="bp-window" style="margin-bottom: var(--bp-gap);">
            <div class="bp-window-titlebar">
              <span class="bp-window-control" aria-hidden="true"></span>
              <div class="bp-window-lines">Template - Basic / Newton Law</div>
              <span class="bp-window-control" aria-hidden="true"></span>
            </div>
            <div class="bp-window-body">
              <h1>Template - Basic</h1>
              <div class="bp-demo-callout"><h3>Basic content pattern</h3><p>Use one Markdown file plus one optional HTML block when a page only needs one focused explanation.</p></div>
              <p>Newton’s second law is a useful basic-template topic because it uses one readable article, one highlighted formula block, and one reusable copy example.</p>
              <p>Current project placeholder: <strong>${escapeHTML(parsePlaceholders('{{PROJECT_NAME}}'))}</strong>.</p>
            </div>
            <div class="bp-window-footer">
              <label>Upload basic_newton.md <input id="bpBeesMarkdownFile" type="file" accept=".md,.markdown,text/markdown,text/plain" /></label>
              <label>Upload basic_newton_quote.html <input id="bpBeesQuoteFile" type="file" accept=".html,text/html,text/plain" /></label>
              <button type="button" id="bpReloadBees" class="bp-demo-button">↻ Fetch Basic Files</button>
            </div>
          </div>

          <div class="bp-grid-2" style="margin-bottom: var(--bp-gap);">
            <div class="bp-window">
              <div class="bp-window-titlebar"><span class="bp-window-control"></span><div class="bp-window-lines">Column A: Markdown</div><span class="bp-window-control"></span></div>
              <article class="bp-window-body bp-markdown">
                ${renderMarkdown(parsePlaceholders(markdown))}
              </article>
            </div>
            <div class="bp-window">
              <div class="bp-window-titlebar"><span class="bp-window-control"></span><div class="bp-window-lines">Column B: HTML Quote</div><span class="bp-window-control"></span></div>
              <div class="bp-window-body">
                <div class="bp-preview-box">${parsePlaceholders(quoteHtml)}</div>
                <details>
                  <summary>HTML source</summary>
                  <pre><code>${escapeHTML(quoteHtml)}</code></pre>
                </details>
              </div>
            </div>
          </div>

          <article class="bp-card">
            <h3>Code block section: Newton formula copy example</h3>
            <pre><code>${escapeHTML(beeFormula)}</code></pre>
            <button type="button" data-bee-copy>Copy Newton Formula</button>
          </article>
        </section>
      `;
    }

    function bindBeesInfo() {
      $('[data-bee-copy]')?.addEventListener('click', () => copyText(beeFormula, 'Newton formula copied.'));
      $('#bpReloadBees')?.addEventListener('click', loadBeesFiles);
      $('#bpBeesMarkdownFile')?.addEventListener('change', async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        appState.bees.markdown = await file.text();
        appState.bees.markdownSource = `Uploaded ${file.name}`;
        saveState();
        renderApp();
      });
      $('#bpBeesQuoteFile')?.addEventListener('change', async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        appState.bees.quoteHtml = await file.text();
        appState.bees.quoteSource = `Uploaded ${file.name}`;
        saveState();
        renderApp();
      });
    }


    /***************************************************************************
     * Wiki Bees tab: three-column custom content test
     ***************************************************************************/
    const wikiBeeDescriptionFallback = `# Bee Description

Bees are winged insects known for pollination, hive behavior, and structured communication. This section demonstrates a long-form Markdown document imported into a medium Backpack template.

Use this file as **Bee_Description.md** inside the local content folder.

## Body plan

- Describe the bee as an animal.
- Describe the role of pollen and flowers.
- Explain how the page uses placeholders such as **{{PROJECT_NAME}}**.
- Keep images in the local \`content/images\` folder.

## Anatomy markers

A simple bee article can be split into readable chunks:

1. **Head** — antennae, compound eyes, and mouthparts.
2. **Thorax** — wings and legs attach here.
3. **Abdomen** — digestion, wax glands in some bees, and the stinger in many female bees.

## Museum pattern example

Use callouts for field notes, warnings, and quick definitions. In the live page, the overview also shows a real callout component from the CSS Museum.

> A useful wiki page keeps the main reading column calm, wide, and predictable while side columns carry navigation and references.
`;

    const wikiBeeFamiliesFallback = `# Bee Families

This section demonstrates a second Markdown source file. It is intended to be saved as **Bee_Families.md**.

## Example families and groups

- **Apidae** — includes honey bees, bumblebees, and carpenter bees.
- **Megachilidae** — includes leafcutter and mason bees.
- **Halictidae** — often called sweat bees.
- **Andrenidae** — mining bees that often nest in soil.
- **Colletidae** — sometimes called plasterer bees.

## Wiki-style notes

Each family entry can grow into its own Markdown file later. This template currently keeps two documents to prove the custom page pattern without overengineering the file loader.

### Maintenance rule

Keep long text in Markdown and keep figures in the local image folder. Avoid storing large images inside exported state unless the user explicitly needs portable embedded media.
`;

    const wikiBeeImages = [
      {
        title: 'Worker Bee Reference',
        src: 'content/images/bee_worker.svg',
        caption: 'Worker bee diagram stored as a local SVG file.',
        footnote: 'Local path: content/images/bee_worker.svg'
      },
      {
        title: 'Hive Reference',
        src: 'content/images/bee_hive.svg',
        caption: 'Hive diagram for the local wiki image viewer.',
        footnote: 'Local path: content/images/bee_hive.svg'
      }
    ];

    const wikiBeeCodeBlocks = [
      {
        title: 'ASCII Bee Art',
        code: `  \\     //
   \\.-.//
   (o o)
  <=={_}==>
     '-'
`
      },
      {
        title: 'Bee Callout HTML',
        code: `<div class="bp-demo-callout">
  <h3>Bee Field Note</h3>
  <p>Use callouts for emphasized wiki notes, warnings, or quick facts.</p>
</div>`
      },
      {
        title: 'Bee Markdown Figure',
        code: `## Bee Figure

![Worker bee]({{WIKI_BEE_WORKER_IMAGE}})

*Worker bee local image reference.*`
      },
      {
        title: 'Bee Image Viewer Figure HTML',
        code: `<figure class="bp-wiki-figure">
  <img src="{{WIKI_BEE_HIVE_IMAGE}}" alt="Hive reference" />
  <figcaption>Hive reference stored in the local image folder.</figcaption>
</figure>`
      },
      {
        title: 'Bee Section Starter',
        code: `# New Bee Section

## Summary

Write one calm introductory paragraph.

## Notes

- Add a short fact.
- Add an image reference.
- Add a source footnote.`
      }
    ];

    async function loadWikiBeeFiles() {
      await Promise.all([loadWikiBeeFile('description'), loadWikiBeeFile('families')]);
    }

    function renderWikiBees() {
      const section = appState.wikiBees.activeSection || 'overview';
      const image = wikiBeeImages[appState.wikiBees.activeImage] || wikiBeeImages[0];
      const mainContent = renderWikiBeeMain(section);
      return `
        <section class="bp-panel bp-wiki-panel">
          <div class="bp-panel-header">
            <div>
              <h2>Template - Medium</h2>
              <p>Medium custom page template: left controls, middle Markdown reader, right local image/code reference column.</p>
            </div>
          </div>
          <div class="bp-wiki-layout">
            <aside class="bp-card bp-wiki-controls">
              <h3>Wiki Index</h3>
              ${renderWikiBeeButton('overview', 'Overview')}
              ${renderWikiBeeButton('description', 'Bee Description')}
              ${renderWikiBeeButton('families', 'Bee Families')}
              ${renderWikiBeeButton('images', 'Images')}
              <hr>
              <button type="button" data-wiki-action="fetch">Fetch Wiki Files</button>
              <label class="bp-wiki-upload">Upload Description<input id="bpWikiDescriptionFile" type="file" accept=".md,.markdown,text/markdown,text/plain" /></label>
              <label class="bp-wiki-upload">Upload Families<input id="bpWikiFamiliesFile" type="file" accept=".md,.markdown,text/markdown,text/plain" /></label>
              <hr>
              <button type="button" data-wiki-copy="description">Copy Description MD</button>
              <button type="button" data-wiki-copy="families">Copy Families MD</button>
            </aside>

            <main class="bp-window bp-reading-window bp-wiki-main">
              <div class="bp-window-titlebar">
                <span class="bp-window-control" aria-hidden="true"></span>
                <div class="bp-window-lines">${escapeHTML(wikiBeeTitle(section))}</div>
                <span class="bp-window-control" aria-hidden="true"></span>
              </div>
              <article class="bp-window-body bp-markdown">
                ${mainContent}
              </article>
              <div class="bp-window-footer bp-wiki-status">
                <span>${escapeHTML(appState.wikiBees.description.source)}</span>
                <span>${escapeHTML(appState.wikiBees.families.source)}</span>
              </div>
            </main>

            <aside class="bp-wiki-right">
              <div class="bp-window bp-wiki-image-window">
                <div class="bp-window-titlebar">
                  <span class="bp-window-control" aria-hidden="true"></span>
                  <div class="bp-window-lines">${escapeHTML(image.title)}</div>
                  <span class="bp-window-control" aria-hidden="true"></span>
                </div>
                <div class="bp-window-body bp-wiki-image-body">
                  <img src="${escapeHTML(image.src)}" alt="${escapeHTML(image.title)}" />
                  <p><strong>${escapeHTML(image.caption)}</strong></p>
                  <p class="bp-wiki-footnote">${escapeHTML(image.footnote)}</p>
                </div>
                <div class="bp-window-footer bp-wiki-image-controls">
                  <button type="button" data-wiki-image="prev">◀</button>
                  <span>${appState.wikiBees.activeImage + 1}/${wikiBeeImages.length}</span>
                  <button type="button" data-wiki-image="next">▶</button>
                </div>
              </div>

              <div class="bp-card bp-wiki-code-card">
                <h3>Copy Examples</h3>
                ${wikiBeeCodeBlocks.map((block, index) => `
                  <details ${index === 0 ? 'open' : ''}>
                    <summary>${escapeHTML(block.title)}</summary>
                    <pre><code>${escapeHTML(parsePlaceholders(block.code))}</code></pre>
                    <button type="button" data-wiki-code="${index}">Copy</button>
                  </details>
                `).join('')}
              </div>
            </aside>
          </div>
        </section>
      `;
    }

    function renderWikiBeeButton(id, label) {
      const selected = appState.wikiBees.activeSection === id;
      return `<button type="button" class="bp-wiki-nav-button" data-wiki-section="${id}" aria-pressed="${selected}">${selected ? '▸' : ' '} ${escapeHTML(label)}</button>`;
    }

    function wikiBeeTitle(section) {
      const titles = {
        overview: 'Wiki Bees Overview',
        description: 'Bee Description',
        families: 'Bee Families',
        images: 'Image Notes'
      };
      return titles[section] || titles.overview;
    }

    function renderWikiBeeMain(section) {
      if (section === 'description') {
        return renderMarkdown(parsePlaceholders(appState.wikiBees.description.markdown || wikiBeeDescriptionFallback));
      }
      if (section === 'families') {
        return renderMarkdown(parsePlaceholders(appState.wikiBees.families.markdown || wikiBeeFamiliesFallback));
      }
      if (section === 'images') {
        return renderMarkdown(parsePlaceholders(`# Image Notes\n\nImages in this wiki are referenced from a local folder. This keeps exported Backpack state small and makes the page easier to maintain.\n\n- Worker image: \`{{WIKI_BEE_WORKER_IMAGE}}\`\n- Hive image: \`{{WIKI_BEE_HIVE_IMAGE}}\`\n\nUse the right column to inspect the themed image viewer and its footnotes.`));
      }
      return `
        <div class="bp-demo-callout">
          <h3>Medium template pattern</h3>
          <p>This template demonstrates wiki controls, Markdown sources, copyable examples, and a local image viewer.</p>
        </div>
        ${renderMarkdown(parsePlaceholders(`# Wiki Bees Overview

This tab is a custom-page test for **{{PROJECT_NAME}}**. It combines several reusable Backpack ideas:

- A left control/index column.
- A main Markdown reading column.
- A right reference column with copyable code and local images.
- CSS Museum examples such as callouts, themed buttons, and local figure blocks.

## What this proves

A future custom page should not need a large one-off implementation every time. Most custom pages can be described with a file list, a few sections, optional snippets, and optional local images.

## Local file workflow

Save long text as Markdown in the local content folder, then let the tab fetch it:

- \`{{WIKI_BEE_DESCRIPTION}}\`
- \`{{WIKI_BEE_FAMILIES}}\`

Images stay in a local image folder instead of being embedded in exported state.`))}
        <button type="button" class="bp-demo-button">Museum-style action button</button>
      `;
    }

    function bindWikiBees() {
      $$('[data-wiki-section]').forEach(button => {
        button.addEventListener('click', () => {
          appState.wikiBees.activeSection = button.dataset.wikiSection;
          saveState();
          renderApp();
        });
      });
      $('[data-wiki-action="fetch"]')?.addEventListener('click', loadWikiBeeFiles);
      $('#bpWikiDescriptionFile')?.addEventListener('change', async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        await uploadContentSource('wikiBeeDescription', file);
      });
      $('#bpWikiFamiliesFile')?.addEventListener('change', async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        await uploadContentSource('wikiBeeFamilies', file);
      });
      $$('[data-wiki-copy]').forEach(button => {
        button.addEventListener('click', () => {
          const kind = button.dataset.wikiCopy;
          const text = appState.wikiBees[kind]?.markdown || '';
          copyText(text, `${kind} Markdown copied.`);
        });
      });
      $$('[data-wiki-code]').forEach(button => {
        button.addEventListener('click', () => {
          const block = wikiBeeCodeBlocks[Number(button.dataset.wikiCode)];
          copyText(parsePlaceholders(block.code), 'Wiki Bees code copied.');
        });
      });
      $$('[data-wiki-image]').forEach(button => {
        button.addEventListener('click', () => {
          const delta = button.dataset.wikiImage === 'next' ? 1 : -1;
          const count = wikiBeeImages.length;
          appState.wikiBees.activeImage = (appState.wikiBees.activeImage + delta + count) % count;
          saveState();
          renderApp();
        });
      });
    }

    /***************************************************************************
     * Museum module
     * Comments in the source strings are intentionally displayed as documentation.
     ***************************************************************************/
    const museumItems = [
      {
        title: 'Instructional Callout',
        description: 'A compact themed block for notes, warnings, or reference text.',
        html: `<!--
  CALLOUT COMPONENT
  Use this when the user needs a visible reference block.
  Keep the border-left strong so the block is distinguishable without relying on color alone.
-->
<div class="bp-demo-callout">
  <h3>{{PROJECT_NAME}} Callout</h3>
  <p>This is a reusable instructional block for {{AUTHOR}}.</p>
</div>`
      },
      {
        title: 'Accessible Action Button',
        description: 'A large pill-style button example that uses border, weight, and spacing.',
        html: `<!--
  ACTION BUTTON
  Use for primary user-triggered actions.
  Do not communicate importance through color alone; use size, border, and label clarity.
-->
<button class="bp-demo-button" type="button">
  Copy {{PROJECT_NAME}} Example
</button>`
      },
      {
        title: 'Basic Formula Page Template',
        description: 'A small one-file page pattern for focused reference material such as F = ma.',
        html: `<!--
  BASIC FORMULA PAGE
  Use this for one Markdown source plus a single highlighted HTML formula block.
-->
<section class="bp-window">
  <div class="bp-window-titlebar"><span></span><div class="bp-window-lines">Newton Law</div><span></span></div>
  <article class="bp-window-body bp-markdown">
    <h1>F = ma</h1>
    <div class="bp-demo-callout"><strong>Force = mass × acceleration</strong></div>
  </article>
</section>`
      },
      {
        title: 'Custom Wiki Tab Template',
        description: 'A medium custom page pattern with controls, Markdown sources, snippets, and local images.',
        html: `<!--
  CUSTOM WIKI TAB TEMPLATE
  1. Add Markdown files to /content.
  2. Register them in getContentSourceConfig().
  3. Add a tab registry entry with a render function or config.
  4. Use the shared content helpers for fetch/upload/cache.
  5. Keep images as local files in /content/images.
-->
<section class="bp-wiki-layout">
  <aside class="bp-card">Wiki controls</aside>
  <main class="bp-window bp-reading-window">Markdown reader</main>
  <aside class="bp-card">Code and image references</aside>
</section>`
      },
      {
        title: 'Markdown Section Tab Template',
        description: 'How to add a simple content tab powered by Markdown and placeholders.',
        html: `<!--
  MARKDOWN SECTION TAB
  1. Save a Markdown file next to the HTML, for example: bees.md
  2. Add a tab registry entry: { id: "bees", label: "Bees", render: renderBees }
  3. Fetch the Markdown file, parse placeholders, then render it through renderMarkdown().
  4. Keep raw HTML escaped unless the section is intentionally an HTML museum/source example.
-->
<section class="bp-card bp-markdown">
  <!-- Rendered from bees.md -->
  {{MARKDOWN_SECTION_OUTPUT}}
</section>`
      }
    ];

    function renderMuseum() {
      return `
        <section class="bp-panel">
          <div class="bp-panel-header">
            <div>
              <h2>CSS Museum</h2>
              <p>Instructional examples. HTML comments are treated as primary documentation and are shown with each template.</p>
            </div>
          </div>
          <div class="bp-museum-grid">
            ${museumItems.map((item, index) => {
              const resolved = parsePlaceholders(item.html);
              return `
                <article class="bp-card bp-museum-item">
                  <div>
                    <h3>${escapeHTML(item.title)}</h3>
                    <p>${escapeHTML(item.description)}</p>
                  </div>
                  <div class="bp-preview-box">${resolved}</div>
                  <h4>HTML source with documentation comments</h4>
                  <pre><code>${escapeHTML(item.html)}</code></pre>
                  <div class="bp-copy-line">
                    <button type="button" data-museum-copy="${index}" data-museum-kind="resolved">Copy Final HTML</button>
                    <button type="button" data-museum-copy="${index}" data-museum-kind="source">Copy Template HTML</button>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </section>
      `;
    }

    function bindMuseum() {
      $$('[data-museum-copy]').forEach(button => {
        button.addEventListener('click', () => {
          const item = museumItems[Number(button.dataset.museumCopy)];
          const text = button.dataset.museumKind === 'resolved' ? parsePlaceholders(item.html) : item.html;
          copyText(text, 'Museum HTML copied.');
        });
      });
    }

    /***************************************************************************
     * Placeholder settings helpers
     ***************************************************************************/
    const pathPlaceholderKeys = [
      "PROJECT_PATH",
      "CONTENT_PATH",
      "HTML_ENTRY",
      "CSS_PATH",
      "JS_PATH",
      "NOTES_FILE",
      "BASIC_MD",
      "BASIC_HTML",
      "WIKI_BEE_DESCRIPTION",
      "WIKI_BEE_FAMILIES",
      "WIKI_BEE_IMAGES",
      "WIKI_BEE_WORKER_IMAGE",
      "WIKI_BEE_HIVE_IMAGE",
      "EXPORT_PATH",
      "SERVER_PORT"
    ];

    function cleanPath(value) {
      return String(value || "").trim().replaceAll("\\", "/").replace(/\/+$/g, "");
    }

    function joinPath(base, child) {
      const root = cleanPath(base);
      const suffix = String(child || "").replace(/^\/+/, "");
      return root ? `${root}/${suffix}` : suffix;
    }

    function derivePathPlaceholdersFromProject() {
      const projectPath = cleanPath(appState.placeholders.PROJECT_PATH);
      if (!projectPath) {
        showToast('Set PROJECT_PATH first.');
        return;
      }
      appState.placeholders.PROJECT_PATH = projectPath;
      appState.placeholders.CONTENT_PATH = joinPath(projectPath, 'content');
      appState.placeholders.HTML_ENTRY = joinPath(projectPath, 'index.html');
      appState.placeholders.CSS_PATH = joinPath(projectPath, 'css/backpack.css');
      appState.placeholders.JS_PATH = joinPath(projectPath, 'js/backpack.js');
      appState.placeholders.NOTES_FILE = joinPath(projectPath, 'content/notes.md');
      appState.placeholders.BASIC_MD = joinPath(projectPath, 'content/basic_newton.md');
      appState.placeholders.BASIC_HTML = joinPath(projectPath, 'content/basic_newton_quote.html');
      appState.placeholders.WIKI_BEE_DESCRIPTION = joinPath(projectPath, 'content/Bee_Description.md');
      appState.placeholders.WIKI_BEE_FAMILIES = joinPath(projectPath, 'content/Bee_Families.md');
      appState.placeholders.WIKI_BEE_IMAGES = joinPath(projectPath, 'content/images');
      appState.placeholders.WIKI_BEE_WORKER_IMAGE = joinPath(projectPath, 'content/images/bee_worker.svg');
      appState.placeholders.WIKI_BEE_HIVE_IMAGE = joinPath(projectPath, 'content/images/bee_hive.svg');
      appState.placeholders.EXPORT_PATH = joinPath(projectPath, 'exports');
      appState.placeholders.SERVER_PORT ||= '8000';
      saveState();
      renderApp();
      showToast('Path placeholders derived from PROJECT_PATH.');
    }

    /***************************************************************************
     * Settings / placeholders
     ***************************************************************************/
    function renderSettings() {
      const entries = Object.entries(appState.placeholders);
      const builtIns = Object.entries(getBuiltInPlaceholders());
      const pathEntries = pathPlaceholderKeys.map(key => [key, appState.placeholders[key] || '']);
      const customEntries = entries.filter(([key]) => !pathPlaceholderKeys.includes(key));
      return `
        <section class="bp-panel">
          <div class="bp-panel-header">
            <div>
              <h2>Placeholder Settings</h2>
              <p>Set your directory paths once, then reuse them across Code Blocks, Museum examples, and Markdown templates.</p>
            </div>
          </div>

          <div class="bp-settings-layout">
            <div class="bp-card bp-path-panel">
              <h3>Directory path shortcuts</h3>
              <p>Use <code>PROJECT_PATH</code> as the root. The derive button fills related paths for the split build.</p>
              <div class="bp-placeholder-table bp-path-table">
                ${pathEntries.map(([key, value]) => `
                  <div class="bp-placeholder-row bp-path-row" data-placeholder-row="${escapeHTML(key)}">
                    <label for="bp-path-${escapeHTML(key)}">{{${escapeHTML(key)}}}</label>
                    <input id="bp-path-${escapeHTML(key)}" data-placeholder-key="${escapeHTML(key)}" value="${escapeHTML(value)}" placeholder="${escapeHTML(pathPlaceholderHint(key))}" />
                    <button type="button" data-copy-placeholder="${escapeHTML(key)}" title="Copy placeholder token">⧉</button>
                  </div>
                `).join('')}
              </div>
              <div class="bp-row" style="margin-top: .75rem;">
                <button type="button" id="bpDerivePaths">Derive split paths from PROJECT_PATH</button>
                <button type="button" id="bpSavePlaceholders">Save Placeholder Changes</button>
              </div>
            </div>

            <div class="bp-card">
              <h3>Custom placeholders</h3>
              <div class="bp-placeholder-table">
                ${customEntries.map(([key, value]) => `
                  <div class="bp-placeholder-row" data-placeholder-row="${escapeHTML(key)}">
                    <input data-placeholder-key="${escapeHTML(key)}" value="${escapeHTML(key)}" />
                    <input data-placeholder-value="${escapeHTML(key)}" value="${escapeHTML(value)}" placeholder="Value" />
                    <button type="button" class="bp-danger" data-placeholder-delete="${escapeHTML(key)}" title="Delete placeholder" aria-label="Delete placeholder">×</button>
                  </div>
                `).join('')}
              </div>
              <hr style="border-color: var(--bp-border); margin: 1rem 0;">
              <div class="bp-placeholder-row">
                <input id="bpNewPlaceholderKey" placeholder="NEW_KEY" />
                <input id="bpNewPlaceholderValue" placeholder="Value" />
                <button type="button" id="bpAddPlaceholder" title="Add placeholder" aria-label="Add placeholder">+</button>
              </div>

              <h3 style="margin-top: 1rem;">Built-in placeholders</h3>
              <p>Generated automatically at render time.</p>
              <pre><code>${escapeHTML(builtIns.map(([key, value]) => `{{${key}}} = ${value}`).join('\n'))}</code></pre>
            </div>
          </div>
        </section>
      `;
    }

    function pathPlaceholderHint(key) {
      const hints = {
        PROJECT_PATH: '/path/to/backpack',
        CONTENT_PATH: '/path/to/backpack/content',
        HTML_ENTRY: '/path/to/backpack/index.html',
        CSS_PATH: '/path/to/backpack/css/backpack.css',
        JS_PATH: '/path/to/backpack/js/backpack.js',
        NOTES_FILE: '/path/to/backpack/content/notes.md',
        BASIC_MD: '/path/to/backpack/content/basic_newton.md',
        BASIC_HTML: '/path/to/backpack/content/basic_newton_quote.html',
        WIKI_BEE_DESCRIPTION: '/path/to/backpack/content/Bee_Description.md',
        WIKI_BEE_FAMILIES: '/path/to/backpack/content/Bee_Families.md',
        WIKI_BEE_IMAGES: '/path/to/backpack/content/images',
        WIKI_BEE_WORKER_IMAGE: '/path/to/backpack/content/images/bee_worker.svg',
        WIKI_BEE_HIVE_IMAGE: '/path/to/backpack/content/images/bee_hive.svg',
        EXPORT_PATH: '/path/to/backpack/exports',
        SERVER_PORT: '8000'
      };
      return hints[key] || 'Value';
    }

    function bindSettings() {
      $('#bpAddPlaceholder')?.addEventListener('click', () => {
        const key = $('#bpNewPlaceholderKey').value.trim().toUpperCase().replace(/[^A-Z0-9_\-]/g, '_');
        const value = $('#bpNewPlaceholderValue').value;
        if (!key) return showToast('Placeholder key is required.');
        appState.placeholders[key] = value;
        saveState();
        renderApp();
      });
      $('#bpDerivePaths')?.addEventListener('click', () => {
        savePlaceholderInputs();
        derivePathPlaceholdersFromProject();
      });
      $('#bpSavePlaceholders')?.addEventListener('click', () => {
        savePlaceholderInputs();
        saveState();
        renderApp();
        showToast('Placeholders saved.');
      });
      $$('[data-copy-placeholder]').forEach(button => {
        button.addEventListener('click', () => {
          copyText(`{{${button.dataset.copyPlaceholder}}}`, 'Placeholder token copied.');
        });
      });
      $$('[data-placeholder-delete]').forEach(button => {
        button.addEventListener('click', () => {
          delete appState.placeholders[button.dataset.placeholderDelete];
          saveState();
          renderApp();
        });
      });
    }

    function savePlaceholderInputs() {
      const next = { ...appState.placeholders };
      $$('[data-placeholder-key]').forEach(keyInput => {
        const oldKey = keyInput.dataset.placeholderKey;
        const key = keyInput.value.trim().toUpperCase().replace(/[^A-Z0-9_\-]/g, '_');
        if (!key) return;
        const pairedValue = $(`[data-placeholder-value="${oldKey}"]`);
        if (pairedValue) {
          if (key !== oldKey) delete next[oldKey];
          next[key] = pairedValue.value;
        } else {
          next[oldKey] = keyInput.value;
        }
      });
      appState.placeholders = next;
    }

    /***************************************************************************
     * Global bindings and boot
     ***************************************************************************/
    document.addEventListener('click', event => {
      const tabButton = event.target.closest('[data-tab]');
      if (!tabButton) return;
      appState.activeTab = tabButton.dataset.tab;
      appState.ui.editingEventId = null;
      renderApp();
    });

    function applyGlobalUIState() {
      document.body.classList.toggle('bp-light', !appState.ui.darkMode);
      document.body.classList.toggle('bp-reading-dark', Boolean(appState.ui.readingDark));
      document.body.classList.toggle('bp-density-readable', appState.ui.density === 'readable');
      document.body.classList.toggle('bp-accessible', Boolean(appState.ui.accessibleMode));
      const darkBtn = $('#bpDarkBtn');
      const readBtn = $('#bpReadBtn');
      const densityBtn = $('#bpDensityBtn');
      const accessBtn = $('#bpAccessibleBtn');
      const quoteEl = $('#bpHeaderQuote');
      if (quoteEl) {
        quoteEl.textContent = `"${parsePlaceholders('{{HEADER_QUOTE}}')}"`;
        quoteEl.title = parsePlaceholders('{{HEADER_QUOTE}}');
      }
      if (darkBtn) {
        darkBtn.textContent = appState.ui.darkMode ? '◐' : '☼';
        darkBtn.title = appState.ui.darkMode ? 'App dark theme active' : 'App light theme active';
        darkBtn.setAttribute('aria-pressed', String(appState.ui.darkMode));
      }
      if (readBtn) {
        readBtn.textContent = appState.ui.readingDark ? '◩' : '◨';
        readBtn.title = appState.ui.readingDark ? 'Reading dark mode active' : 'Reading light mode active';
        readBtn.setAttribute('aria-pressed', String(appState.ui.readingDark));
        readBtn.classList.toggle('bp-reading-toggle-active', Boolean(appState.ui.readingDark));
      }
      if (densityBtn) {
        densityBtn.textContent = appState.ui.density === 'readable' ? '▥' : '▤';
        densityBtn.title = appState.ui.density === 'readable' ? 'Readable density active' : 'Compact density active';
        densityBtn.setAttribute('aria-pressed', String(appState.ui.density === 'readable'));
        densityBtn.classList.toggle('bp-density-toggle-active', appState.ui.density === 'readable');
      }
      if (accessBtn) {
        accessBtn.textContent = appState.ui.accessibleMode ? '♿✓' : '♿';
        accessBtn.title = appState.ui.accessibleMode ? 'Accessible mode active' : 'Accessible mode inactive';
        accessBtn.setAttribute('aria-pressed', String(appState.ui.accessibleMode));
      }
    }

    $('#bpExportBtn').addEventListener('click', exportState);
    $('#bpImportBtn').addEventListener('click', () => $('#bpImportFile').click());
    $('#bpDensityBtn').addEventListener('click', () => {
      appState.ui.density = appState.ui.density === 'readable' ? 'compact' : 'readable';
      saveState();
      renderApp();
    });
    $('#bpDarkBtn').addEventListener('click', () => {
      appState.ui.darkMode = !appState.ui.darkMode;
      saveState();
      renderApp();
    });
    $('#bpReadBtn').addEventListener('click', () => {
      appState.ui.readingDark = !appState.ui.readingDark;
      saveState();
      renderApp();
    });
    $('#bpAccessibleBtn').addEventListener('click', () => {
      appState.ui.accessibleMode = !appState.ui.accessibleMode;
      saveState();
      renderApp();
    });
    $('#bpImportFile').addEventListener('change', event => {
      const file = event.target.files?.[0];
      if (file) importStateFile(file);
      event.target.value = '';
    });

    renderApp();
    loadExternalNotes();
    loadBeesFiles();
    loadWikiBeeFiles();