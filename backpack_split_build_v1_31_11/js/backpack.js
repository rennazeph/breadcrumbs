/***************************************************************************
     * THE BACKPACK ALPHA CONFIG
     * Edit this area first when monthly arrival expectations or grid size change.
     ***************************************************************************/
    const BP_USER_CONFIG = {
      appVersion: "1.31.11",
      storageKey: "the-backpack-alpha-state-v1",
      contentLabels: {
        notes: "notes.md",
        basicMarkdown: "basic_newton.md",
        basicHtml: "basic_newton_quote.html",
        wikiBundle: "content/wiki/*.md",
        wikiSidebar: "selected page side-note .md",
        wikiImage: "selected page image",
        wikiWorkerImage: "bee_worker.svg",
        wikiHiveImage: "bee_hive.svg"
      },

      calendar: {
        dayStartHour: 7,
        weekStartsOn: 1, // 0 = Sunday, 1 = Monday.
        expectedArrivalByMonth: {
          default: "07:30"
          // Example monthly override:
          // "2026-06": "08:00"
        }
      },

      quickNotes: {
        cell: 40,
        columns: 24,
        rows: 14,
        defaultW: 4,
        defaultH: 3,
        minW: 4,
        minH: 3,
        maxOverlapCells: 1
      }
    };

    const BP_THEME_REGISTRY = [
      { id: "goldenrod", name: "Goldenrod", icon: "◆", shortLabel: "Gold", description: "Warm Tuscan Sun / Deep Mocha palette." },
      { id: "lime-analog", name: "Lime Analog", icon: "▰", shortLabel: "Lime", description: "High-contrast green phosphor workspace accent." },
      { id: "grayscale", name: "Grayscale", icon: "◫", shortLabel: "Gray", description: "Monochrome high-contrast theme for shape-first testing." },
      { id: "deep-red", name: "Deep Red", icon: "▣", shortLabel: "Red", description: "Very dark crimson reader and analog workspace theme." }
    ];

    function getThemeConfig(themeId = appState?.ui?.theme) {
      return BP_THEME_REGISTRY.find(theme => theme.id === themeId) || BP_THEME_REGISTRY[0];
    }

    function getNextThemeId(themeId = appState?.ui?.theme) {
      const currentIndex = BP_THEME_REGISTRY.findIndex(theme => theme.id === themeId);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % BP_THEME_REGISTRY.length;
      return BP_THEME_REGISTRY[nextIndex].id;
    }

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

    function validClockParts(hour, minute) {
      return Number.isInteger(hour) && Number.isInteger(minute) && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
    }

    function clockPartsToTime(hour, minute) {
      return `${pad2(hour)}:${pad2(minute)}`;
    }

    function parseEventSchedule(title) {
      const raw = String(title || "").trim();
      const range = raw.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})(?:\s*-\s*|\s+)?(.*)$/);
      if (range) {
        const sh = Number(range[1]);
        const sm = Number(range[2]);
        const eh = Number(range[3]);
        const em = Number(range[4]);
        if (!validClockParts(sh, sm) || !validClockParts(eh, em)) return null;
        const start = sh * 60 + sm;
        let end = eh * 60 + em;
        if (end <= start) end = Math.min(1440, start + 60);
        return {
          start,
          end,
          startTime: clockPartsToTime(sh, sm),
          endTime: clockPartsToTime(Math.floor(end / 60), end % 60),
          duration: end - start,
          hasRange: true,
          title: (range[5] || "").trim() || raw
        };
      }

      const startOnly = raw.match(/^(\d{1,2}):(\d{2})(?:\s*-\s*|\s+)?(.*)$/);
      if (!startOnly) return null;
      const hour = Number(startOnly[1]);
      const minute = Number(startOnly[2]);
      if (!validClockParts(hour, minute)) return null;
      const start = hour * 60 + minute;
      const end = Math.min(1440, start + 60);
      return {
        start,
        end,
        startTime: clockPartsToTime(hour, minute),
        endTime: clockPartsToTime(Math.floor(end / 60), end % 60),
        duration: end - start,
        hasRange: false,
        title: (startOnly[3] || "").trim() || raw
      };
    }

    function normalizeTimePrefix(title) {
      return parseEventSchedule(title)?.startTime || null;
    }

    function validTimeString(value) {
      return timeToMinutes(value) != null;
    }

    function parseLooseTimeInput(value) {
      const raw = String(value || "").trim();
      if (!raw) return "";
      const separated = raw.match(/^(\d{1,2})\s*[:.hH ]\s*(\d{1,2})$/);
      if (separated) {
        const hour = Number(separated[1]);
        const minute = Number(separated[2]);
        return validClockParts(hour, minute) ? clockPartsToTime(hour, minute) : "";
      }
      const digits = raw.replace(/\D/g, "");
      if (!digits) return "";
      let hour = null;
      let minute = 0;
      if (digits.length <= 2) {
        hour = Number(digits);
      } else if (digits.length === 3) {
        hour = Number(digits.slice(0, 1));
        minute = Number(digits.slice(1));
      } else if (digits.length === 4) {
        hour = Number(digits.slice(0, 2));
        minute = Number(digits.slice(2));
      } else {
        return "";
      }
      return validClockParts(hour, minute) ? clockPartsToTime(hour, minute) : "";
    }

    function offsetTimeString(time, deltaMinutes) {
      const base = timeToMinutes(parseLooseTimeInput(time) || time);
      if (base == null) return "";
      return minutesToTime(Math.max(0, Math.min(1439, base + Number(deltaMinutes || 0))));
    }

    function minutesToTime(minutes) {
      const clamped = Math.max(0, Math.min(1439, Number(minutes) || 0));
      return `${pad2(Math.floor(clamped / 60))}:${pad2(clamped % 60)}`;
    }

    function normalizeRepeatDays(days) {
      return Array.isArray(days)
        ? [...new Set(days.map(Number).filter(day => Number.isInteger(day) && day >= 0 && day <= 6))].sort((a, b) => a - b)
        : [];
    }

    function eventDraftFromInput(input) {
      const raw = String(input || "").trim();
      const parsed = parseEventSchedule(raw);
      if (!parsed) {
        return {
          title: raw,
          startTime: "",
          endTime: "",
          durationMode: "untimed"
        };
      }
      return {
        title: parsed.title,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        durationMode: parsed.hasRange ? "range" : "default"
      };
    }

    function eventInputValue(event) {
      const normalized = normalizeEvent(event);
      if (!normalized.startTime) return normalized.title;
      const timePart = normalized.durationMode === "range" && normalized.endTime
        ? `${normalized.startTime} - ${normalized.endTime}`
        : normalized.startTime;
      return `${timePart} ${normalized.title}`.trim();
    }

    function createCalendarEvent({ titleInput, priority = "normal", notes = "", repeatId = null, repeatDays = [], repeatSourceDate = null, repeatGenerated = false }) {
      const draft = eventDraftFromInput(titleInput);
      return normalizeEvent({
        id: uid("evt"),
        title: draft.title,
        startTime: draft.startTime,
        endTime: draft.endTime,
        durationMode: draft.durationMode,
        priority,
        notes,
        repeatId,
        repeatDays,
        repeatSourceDate,
        repeatGenerated,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    function normalizeEvent(input = {}) {
      const fallbackTitle = String(input.title || input.name || "Untitled event").trim() || "Untitled event";
      let parsedFromLegacyTitle = null;
      let title = fallbackTitle;
      let startTime = validTimeString(input.startTime) ? input.startTime : "";
      let endTime = validTimeString(input.endTime) ? input.endTime : "";
      let durationMode = ["range", "default", "untimed"].includes(input.durationMode) ? input.durationMode : "";

      if (!startTime) {
        parsedFromLegacyTitle = parseEventSchedule(fallbackTitle);
        if (parsedFromLegacyTitle) {
          title = parsedFromLegacyTitle.title;
          startTime = parsedFromLegacyTitle.startTime;
          endTime = parsedFromLegacyTitle.endTime;
          durationMode = parsedFromLegacyTitle.hasRange ? "range" : "default";
        }
      }

      if (startTime && !durationMode) durationMode = endTime ? "range" : "default";
      if (!startTime) durationMode = "untimed";

      if (startTime) {
        const start = timeToMinutes(startTime);
        let end = validTimeString(endTime) ? timeToMinutes(endTime) : null;
        if (durationMode !== "range" || end == null || end <= start) {
          end = Math.min(1439, start + 60);
          endTime = minutesToTime(end);
          durationMode = "default";
        }
      } else {
        endTime = "";
      }

      const priority = ["normal", "high", "highest"].includes(input.priority) ? input.priority : "normal";
      const repeatDays = normalizeRepeatDays(input.repeatDays);
      const repeatId = input.repeatId && repeatDays.length ? String(input.repeatId) : null;
      const repeatSourceDate = /^\d{4}-\d{2}-\d{2}$/.test(String(input.repeatSourceDate || "")) ? input.repeatSourceDate : null;
      const repeatGenerated = Boolean(repeatId && (input.repeatGenerated || repeatSourceDate || repeatDays.length));

      return {
        ...input,
        id: input.id || uid("evt"),
        title,
        startTime,
        endTime,
        durationMode,
        priority,
        notes: String(input.notes || ""),
        repeatId,
        repeatDays,
        repeatSourceDate,
        repeatGenerated,
        createdAt: input.createdAt || new Date().toISOString(),
        updatedAt: input.updatedAt || new Date().toISOString()
      };
    }

    function getEventSchedule(event) {
      const normalized = normalizeEvent(event);
      if (!normalized.startTime) return null;
      const start = timeToMinutes(normalized.startTime);
      const end = timeToMinutes(normalized.endTime);
      if (start == null || end == null) return null;
      return {
        start,
        end: Math.max(start + 1, end),
        startTime: normalized.startTime,
        endTime: normalized.endTime,
        duration: Math.max(1, end - start),
        hasRange: normalized.durationMode === "range",
        title: normalized.title
      };
    }

    function normalizeCalendarState(calendar = {}) {
      const normalized = deepMergeDefaults(defaultState.calendar, calendar);
      normalized.arrivals ||= {};
      normalized.events ||= {};
      for (const [dateKey, arrival] of Object.entries(normalized.arrivals)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !arrival || !validTimeString(arrival.arrivalTime)) {
          delete normalized.arrivals[dateKey];
        }
      }
      for (const [dateKey, dayEvents] of Object.entries(normalized.events)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !Array.isArray(dayEvents)) {
          delete normalized.events[dateKey];
          continue;
        }
        const seen = new Set();
        normalized.events[dateKey] = dayEvents.map(event => {
          const normalizedEvent = normalizeEvent(event);
          if (seen.has(normalizedEvent.id)) normalizedEvent.id = uid("evt");
          seen.add(normalizedEvent.id);
          return normalizedEvent;
        });
      }
      return normalized;
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
        || "07:30";
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
        source: "Upload required"
      },
      bees: {
        markdown: "",
        quoteHtml: "",
        markdownSource: "Bundled demo",
        quoteSource: "Bundled demo"
      },
      wikiBees: {
        activePage: "index",
        files: {},
        images: {},
        demoLoaded: true
      },
      quickNotes: {
        notes: [],
        nextZ: 1,
        openLinksNoteId: ""
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
        WIKI_BEE_MD_BUNDLE: "",
        WIKI_BEE_SIDEBAR_SAMPLE: "",
        WIKI_BEE_IMAGES: "",
        WIKI_BEE_WORKER_IMAGE: "",
        WIKI_BEE_HIVE_IMAGE: "",
        EXPORT_PATH: "",
        AUTHOR: "",
        CUSTOM_1: "",
        CUSTOM_2: "",
        HEADER_QUOTE: "Portable workspace: calendar, notes, snippets, templates, and state export"
      },
      ui: {
        editingEventId: null,
        darkMode: true,
        readingDark: false,
        density: "compact",
        theme: "goldenrod",
        displayMenuOpen: false,
        dataMenuOpen: false,
        codeCategory: "all",
        calendarNewEventOpen: false,
        calendarToolsOpen: false,
        calendarDraftEvent: {
          titleInput: "",
          priority: "normal",
          notes: "",
          repeatDays: []
        },
        calendarDraftArrivalTime: "",
        calendarArrivalEditing: false,
        promotedWidget: "",
        accessibleMode: false
      }
    };

    function asBoolean(value) {
      return value === true || value === "true" || value === 1 || value === "1";
    }

    function normalizeUIState(state) {
      const ui = state.ui || {};
      ui.darkMode = asBoolean(ui.darkMode);
      ui.readingDark = asBoolean(ui.readingDark);
      ui.displayMenuOpen = asBoolean(ui.displayMenuOpen);
      ui.dataMenuOpen = asBoolean(ui.dataMenuOpen);
      ui.calendarNewEventOpen = asBoolean(ui.calendarNewEventOpen);
      ui.calendarToolsOpen = asBoolean(ui.calendarToolsOpen);
      ui.calendarArrivalEditing = asBoolean(ui.calendarArrivalEditing);
      ui.accessibleMode = asBoolean(ui.accessibleMode);
      ui.density = ui.density === "readable" ? "readable" : "compact";
      if (!BP_THEME_REGISTRY.some(theme => theme.id === ui.theme)) ui.theme = "goldenrod";
      state.ui = ui;
      return state;
    }

    let appState = loadState();

    function loadState() {
      try {
        const raw = localStorage.getItem(BP_USER_CONFIG.storageKey);
        if (!raw) return normalizeUIState(structuredClone(defaultState));
        const loaded = deepMergeDefaults(defaultState, JSON.parse(raw));
        loaded.calendar = normalizeCalendarState(loaded.calendar);
        return normalizeUIState(loaded);
      } catch (error) {
        console.warn("Backpack state failed to load:", error);
        return normalizeUIState(structuredClone(defaultState));
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
        appState.calendar = normalizeCalendarState(appState.calendar);
        appState.quickNotes = normalizeQuickNotesBoard(appState.quickNotes);
        appState = normalizeUIState(appState);
        saveState();
        renderApp();
        showToast("Backpack state imported.");
      } catch (error) {
        console.error(error);
        showToast("Could not import that state file.");
      }
    }


    /***************************************************************************
     * Calendar release maintenance helpers
     ***************************************************************************/
    function exportCalendarState() {
      const payload = {
        type: "backpack-calendar",
        version: BP_USER_CONFIG.appVersion,
        exportedAt: new Date().toISOString(),
        calendar: normalizeCalendarState(appState.calendar)
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backpack-calendar-${toDateKey(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Calendar exported.");
    }

    async function importCalendarStateFile(file) {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const incoming = parsed.calendar || parsed.state?.calendar || parsed;
        if (!incoming || typeof incoming !== "object") throw new Error("Invalid calendar file.");
        if (!confirm("Importing this file will replace only the current Calendar data. Continue?")) return;
        appState.calendar = normalizeCalendarState(incoming);
        appState.activeTab = "calendar";
        saveState();
        renderApp();
        showToast("Calendar imported.");
      } catch (error) {
        console.error(error);
        showToast("Could not import that calendar file.");
      }
    }

    function getCalendarDiagnostics(calendar = appState.calendar) {
      const diagnostics = {
        issues: [],
        stats: {
          arrivals: 0,
          eventDays: 0,
          events: 0,
          timedEvents: 0,
          untimedEvents: 0,
          repeatedEvents: 0,
          repeatGroups: 0,
          emptyEventDays: 0
        }
      };
      const repeatIds = new Set();
      const seenEventIds = new Set();

      for (const [dateKey, arrival] of Object.entries(calendar.arrivals || {})) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
          diagnostics.issues.push({ level: "repair", message: `Invalid arrival date key: ${dateKey}` });
          continue;
        }
        if (!arrival || !validTimeString(arrival.arrivalTime)) {
          diagnostics.issues.push({ level: "repair", message: `Invalid arrival time on ${dateKey}` });
          continue;
        }
        diagnostics.stats.arrivals += 1;
      }

      for (const [dateKey, dayEvents] of Object.entries(calendar.events || {})) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
          diagnostics.issues.push({ level: "repair", message: `Invalid event date key: ${dateKey}` });
          continue;
        }
        if (!Array.isArray(dayEvents)) {
          diagnostics.issues.push({ level: "repair", message: `Events for ${dateKey} are not an array` });
          continue;
        }
        if (!dayEvents.length) {
          diagnostics.stats.emptyEventDays += 1;
          diagnostics.issues.push({ level: "clean", message: `Empty event list on ${dateKey}` });
          continue;
        }
        diagnostics.stats.eventDays += 1;
        for (const event of dayEvents) {
          diagnostics.stats.events += 1;
          if (!event || typeof event !== "object") {
            diagnostics.issues.push({ level: "repair", message: `Invalid event object on ${dateKey}` });
            continue;
          }
          if (!event.id) diagnostics.issues.push({ level: "repair", message: `Missing event id on ${dateKey}` });
          if (event.id && seenEventIds.has(event.id)) diagnostics.issues.push({ level: "repair", message: `Duplicate event id ${event.id}` });
          if (event.id) seenEventIds.add(event.id);
          if (!String(event.title || "").trim()) diagnostics.issues.push({ level: "repair", message: `Missing title on ${dateKey}` });
          if (!["normal", "high", "highest"].includes(event.priority)) diagnostics.issues.push({ level: "repair", message: `Invalid priority on ${dateKey}` });
          const schedule = getEventSchedule(event);
          if (schedule) {
            diagnostics.stats.timedEvents += 1;
            if (schedule.end <= schedule.start) diagnostics.issues.push({ level: "repair", message: `Invalid time range on ${dateKey}` });
          } else {
            diagnostics.stats.untimedEvents += 1;
          }
          if (event.repeatId) {
            diagnostics.stats.repeatedEvents += 1;
            repeatIds.add(event.repeatId);
            if (!Array.isArray(event.repeatDays) || !event.repeatDays.length) diagnostics.issues.push({ level: "repair", message: `Repeat event missing repeat days on ${dateKey}` });
          }
        }
      }
      diagnostics.stats.repeatGroups = repeatIds.size;
      return diagnostics;
    }

    function cleanEmptyCalendarDays(calendar = appState.calendar) {
      let removed = 0;
      for (const [dateKey, events] of Object.entries(calendar.events || {})) {
        if (!Array.isArray(events) || events.length === 0) {
          delete calendar.events[dateKey];
          removed += 1;
        }
      }
      return removed;
    }

    function repairCalendarState() {
      const before = getCalendarDiagnostics(appState.calendar);
      appState.calendar = normalizeCalendarState(appState.calendar);
      const removed = cleanEmptyCalendarDays(appState.calendar);
      const after = getCalendarDiagnostics(appState.calendar);
      saveState();
      renderApp();
      showToast(`Calendar repaired. ${before.issues.length} issue${before.issues.length === 1 ? "" : "s"} checked, ${removed} empty day${removed === 1 ? "" : "s"} cleaned, ${after.issues.length} remaining.`);
    }

    function clearSelectedCalendarDay() {
      const dateKey = appState.calendar.selectedDate;
      if (!dateKey) return;
      const eventCount = (appState.calendar.events[dateKey] || []).length;
      const hasArrival = Boolean(appState.calendar.arrivals[dateKey]);
      if (!eventCount && !hasArrival) {
        showToast("Selected day is already empty.");
        return;
      }
      const parts = [];
      if (eventCount) parts.push(`${eventCount} event${eventCount === 1 ? "" : "s"}`);
      if (hasArrival) parts.push("arrival time");
      if (!confirm(`Clear ${parts.join(" and ")} from ${dateKey}?`)) return;
      delete appState.calendar.events[dateKey];
      delete appState.calendar.arrivals[dateKey];
      saveState();
      renderApp();
      showToast("Selected calendar day cleared.");
    }

    function getRepeatGroupSummaries(monthKey = appState.calendar.currentMonth) {
      const groups = new Map();
      for (const [dateKey, events] of Object.entries(appState.calendar.events || {})) {
        if (!dateKey.startsWith(monthKey) || !Array.isArray(events)) continue;
        for (const event of events) {
          if (!event.repeatId) continue;
          const group = groups.get(event.repeatId) || {
            repeatId: event.repeatId,
            title: eventDisplayTitle(event),
            time: eventTimeLabel(getEventSchedule(event)),
            priority: normalizePriority(event.priority),
            count: 0
          };
          group.count += 1;
          groups.set(event.repeatId, group);
        }
      }
      return [...groups.values()].sort((a, b) => `${a.time} ${a.title}`.localeCompare(`${b.time} ${b.title}`));
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
     * Tab registry + promoted shelf
     * Add future tabs by registering one object here. Binding now travels with the
     * tab definition instead of living in a second switch/if chain.
     ***************************************************************************/
    const tabs = [];

    function registerTab(tab) {
      tabs.push({
        icon: "□",
        render: () => "",
        bind: () => {},
        ...tab
      });
      return tab;
    }

    [
      { id: "calendar", label: "Calendar", icon: "📅", group: "workflow", render: renderCalendar, bind: bindCalendar },
      { id: "notes", label: "Notes", icon: "📓", group: "content", render: renderNotes, bind: bindNotes },
      { id: "code", label: "Code Blocks", icon: "⌘", group: "tools", render: renderCodeBlocks, bind: bindCodeBlocks },
      { id: "quicknotes", label: "Quick Notes", icon: "🗒️", group: "workflow", render: renderQuickNotes, bind: bindQuickNotes },
      { id: "museum", label: "CSS Museum", icon: "🏛️", group: "reference", render: renderMuseum, bind: bindMuseum },
      { id: "bees", label: "Template - Basic", icon: "🐝", group: "templates", render: renderBeesInfo, bind: bindBeesInfo },
      { id: "wikibees", label: "Template - Medium", icon: "📚", group: "templates", render: renderWikiBees, bind: bindWikiBees },
      { id: "settings", label: "Placeholders", icon: "⚙️", group: "settings", render: renderSettings, bind: bindSettings }
    ].forEach(registerTab);

    const promotedWidgets = {
      calendarGantt: {
        id: "calendarGantt",
        label: "Event Gantt",
        icon: "▦",
        homeTab: "calendar",
        render: renderPromotedCalendarGantt
      }
    };

    function getActiveTabConfig() {
      return tabs.find(item => item.id === appState.activeTab) || tabs[0];
    }

    function renderApp() {
      commitQuickNoteBodies({ extractLinks: true });
      applyGlobalUIState();
      renderTabs();
      renderPromotedShelf();
      const tab = getActiveTabConfig();
      $("#bpWorkspace").innerHTML = tab.render();
      bindCurrentTab(tab.id);
      updateCalendarTimeRail();
      saveState();
    }

    function renderTabs() {
      $("#bpTabs").innerHTML = tabs.map(tab => `
        <button class="bp-tab" type="button" data-tab="${tab.id}" data-tab-group="${tab.group || 'general'}" aria-selected="${tab.id === appState.activeTab}">
          <span aria-hidden="true">${tab.icon}</span>
          <span>${tab.label}</span>
        </button>
      `).join("");
    }

    function bindCurrentTab(tabId) {
      const tab = tabs.find(item => item.id === tabId) || tabs[0];
      tab.bind?.();
    }

    function isWidgetPromoted(widgetId) {
      return appState.ui.promotedWidget === widgetId;
    }

    function setPromotedWidget(widgetId) {
      appState.ui.promotedWidget = widgetId && promotedWidgets[widgetId] ? widgetId : "";
      saveState();
      renderApp();
    }

    function renderPromotedShelf() {
      const shelf = $("#bpPromotedShelf");
      if (!shelf) return;
      const widget = promotedWidgets[appState.ui.promotedWidget];
      shelf.hidden = !widget;
      shelf.innerHTML = widget ? widget.render() : "";
    }

    function renderPromotedInlineNotice(widgetId) {
      const widget = promotedWidgets[widgetId];
      if (!widget) return "";
      return `
        <section class="bp-promoted-inline-note" aria-label="${escapeHTML(widget.label)} is pinned">
          <strong>${escapeHTML(widget.icon)} ${escapeHTML(widget.label)} is pinned to the shelf.</strong>
          <span>It stays visible while you move through other tabs.</span>
          <button type="button" data-promote-widget="${escapeHTML(widgetId)}" data-promote-action="open-home">Open source tab</button>
          <button type="button" data-promote-widget="${escapeHTML(widgetId)}" data-promote-action="clear">Unpin</button>
        </section>
      `;
    }

    function renderPromotedCalendarGantt() {
      const dateKey = appState.calendar.selectedDate || getBackpackTodayKey();
      const events = sortedEvents(appState.calendar.events[dateKey] || []);
      return `
        <div class="bp-promoted-widget" data-promoted-widget="calendarGantt">
          <div class="bp-promoted-head">
            <strong>▦ Event Gantt</strong>
            <span>${escapeHTML(dateLabel(dateKey))}</span>
            <button type="button" class="bp-promoted-mini" data-promote-widget="calendarGantt" data-promote-action="open-home" title="Open Calendar" aria-label="Open Calendar">Calendar</button>
            <button type="button" class="bp-promoted-mini" data-promote-widget="calendarGantt" data-promote-action="clear" title="Unpin Event Gantt" aria-label="Unpin Event Gantt">×</button>
          </div>
          ${renderEventTimeRail(dateKey, events, { promoted: true })}
        </div>
      `;
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

    const PRIORITY_META = {
      highest: { id: "highest", label: "Highest", symbol: "◆" },
      high: { id: "high", label: "High", symbol: "◇" },
      normal: { id: "normal", label: "Normal", symbol: "·" }
    };

    const PRIORITY_ORDER = ["highest", "high", "normal"];

    function normalizePriority(priority) {
      return PRIORITY_META[priority] ? priority : "normal";
    }

    function getPriorityCounts(events = []) {
      return events.reduce((counts, event) => {
        counts[normalizePriority(event.priority)] += 1;
        return counts;
      }, { normal: 0, high: 0, highest: 0 });
    }

    function prioritySymbol(priority) {
      return PRIORITY_META[normalizePriority(priority)].symbol;
    }

    function priorityLabel(priority) {
      return PRIORITY_META[normalizePriority(priority)].label;
    }

    function priorityOptionLabel(priority) {
      const meta = PRIORITY_META[normalizePriority(priority)];
      return `${meta.symbol} ${meta.label}`;
    }

    function renderPriorityOptions(selected = "normal") {
      const selectedPriority = normalizePriority(selected);
      return ["normal", "high", "highest"].map(priority =>
        `<option value="${priority}" ${priority === selectedPriority ? "selected" : ""}>${priorityOptionLabel(priority)}</option>`
      ).join("");
    }

    function getRepeatGroupEvents(repeatId) {
      if (!repeatId) return [];
      const matches = [];
      for (const [dateKey, events] of Object.entries(appState.calendar.events || {})) {
        for (const event of events || []) {
          if (event.repeatId === repeatId) matches.push({ dateKey, event });
        }
      }
      return matches;
    }

    function repeatGroupCount(repeatId) {
      return getRepeatGroupEvents(repeatId).length;
    }

    function repeatSummary(event) {
      if (!event?.repeatId) return "";
      const count = repeatGroupCount(event.repeatId);
      return `↻ Repeated${count ? ` · ${count} this month` : ""}`;
    }

    function renderDayEventBand(events = []) {
      if (!events.length) return `<div class="bp-day-band bp-day-band-empty" aria-hidden="true"></div>`;
      const sorted = sortedEvents(events);
      const visible = sorted.slice(0, 7);
      const more = sorted.length - visible.length;
      const labels = getPriorityCounts(events);
      const aria = `${events.length} event${events.length === 1 ? "" : "s"}: ${labels.highest} highest, ${labels.high} high, ${labels.normal} normal`;
      return `
        <div class="bp-day-band" aria-label="${escapeHTML(aria)}" title="${escapeHTML(aria)}">
          ${visible.map(event => `<span class="bp-day-band-segment bp-day-band-${normalizePriority(event.priority)}"></span>`).join("")}
          ${more > 0 ? `<span class="bp-day-band-more">+${more}</span>` : ""}
        </div>
      `;
    }

    function sortedEvents(events) {
      return [...events].sort((a, b) => {
        const aSchedule = getEventSchedule(a);
        const bSchedule = getEventSchedule(b);
        if (aSchedule && bSchedule) return aSchedule.start - bSchedule.start;
        if (aSchedule && !bSchedule) return -1;
        if (!aSchedule && bSchedule) return 1;
        return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
      });
    }

    function eventDisplayTitle(event) {
      return String((typeof event === "object" ? event.title : event) || "Untitled event").trim() || "Untitled event";
    }

    function eventTimeLabel(schedule) {
      if (!schedule) return "";
      return schedule.hasRange ? `${schedule.startTime}-${schedule.endTime}` : schedule.startTime;
    }

    function eventDurationTitle(schedule) {
      if (!schedule) return "";
      return schedule.hasRange ? `${schedule.startTime} to ${schedule.endTime}` : schedule.startTime;
    }

    function getCalendarDraftEvent() {
      const fallback = defaultState.ui.calendarDraftEvent;
      const current = appState.ui.calendarDraftEvent || {};
      return {
        titleInput: String(current.titleInput || fallback.titleInput || ""),
        priority: normalizePriority(current.priority || fallback.priority || "normal"),
        notes: String(current.notes || fallback.notes || ""),
        repeatDays: normalizeRepeatDays(current.repeatDays || fallback.repeatDays || [])
      };
    }

    function setCalendarDraftEvent(patch = {}) {
      appState.ui.calendarDraftEvent = {
        ...getCalendarDraftEvent(),
        ...patch
      };
    }

    function resetCalendarDraftEvent() {
      appState.ui.calendarDraftEvent = structuredClone(defaultState.ui.calendarDraftEvent);
    }

    function renderUntimedEventsCompact(events = []) {
      const untimed = sortedEvents(events).filter(event => !getEventSchedule(event));
      if (!untimed.length) return "";
      return `
        <section class="bp-untimed-events" aria-label="Untimed day items">
          <h4>Untimed day items</h4>
          <div class="bp-untimed-list">
            ${untimed.map(event => `
              <span class="bp-pill bp-untimed-pill bp-untimed-${normalizePriority(event.priority)}" title="${escapeHTML(eventDisplayTitle(event))}">
                ${prioritySymbol(event.priority)} ${escapeHTML(eventDisplayTitle(event))}
              </span>
            `).join("")}
          </div>
        </section>
      `;
    }

    function getCalendarMonthStats(monthKey) {
      let arrivals = 0;
      let late = 0;
      let onTime = 0;
      let events = 0;
      for (const dateKey of Object.keys(appState.calendar.arrivals || {})) {
        if (!dateKey.startsWith(monthKey)) continue;
        arrivals += 1;
        const status = getArrivalStatus(dateKey);
        if (status === "late") late += 1;
        if (status === "on-time") onTime += 1;
      }
      for (const [dateKey, dayEvents] of Object.entries(appState.calendar.events || {})) {
        if (!dateKey.startsWith(monthKey)) continue;
        events += (dayEvents || []).length;
      }
      return { arrivals, late, onTime, events };
    }

    function formatMinutesAsTime(minutes) {
      if (!Number.isFinite(minutes)) return "—";
      const clamped = Math.max(0, Math.min(1439, Math.round(minutes)));
      return `${pad2(Math.floor(clamped / 60))}:${pad2(clamped % 60)}`;
    }

    function floorToStep(minutes, step = 30) {
      return Math.max(0, Math.floor((Number(minutes) || 0) / step) * step);
    }

    function ceilToStep(minutes, step = 30) {
      return Math.min(1440, Math.ceil((Number(minutes) || 0) / step) * step);
    }

    function getArrivalRecord(dateKey) {
      const record = appState.calendar.arrivals?.[dateKey];
      return record && validTimeString(record.arrivalTime) ? record : null;
    }

    function hasArrival(dateKey) {
      return Boolean(getArrivalRecord(dateKey));
    }

    function getMonthArrivalStatsDetailed(monthKey, selectedDateKey) {
      const records = Object.entries(appState.calendar.arrivals || {})
        .filter(([dateKey, record]) => dateKey.startsWith(monthKey) && validTimeString(record?.arrivalTime))
        .sort(([a], [b]) => a.localeCompare(b));
      const minutes = records.map(([, record]) => timeToMinutes(record.arrivalTime)).filter(value => value != null);
      const avgMinutes = minutes.length ? minutes.reduce((sum, value) => sum + value, 0) / minutes.length : null;
      const lateDates = records
        .filter(([dateKey, record]) => timeToMinutes(record.arrivalTime) > timeToMinutes(getExpectedArrival(dateKey)))
        .map(([dateKey]) => dateKey);
      let sinceLastLate = null;
      const selected = selectedDateKey || `${monthKey}-01`;
      const lastLate = lateDates.filter(dateKey => dateKey <= selected).at(-1);
      if (lastLate) {
        const dayMs = 24 * 60 * 60 * 1000;
        sinceLastLate = Math.max(0, Math.round((fromDateKey(selected) - fromDateKey(lastLate)) / dayMs));
      }
      return {
        recorded: records.length,
        late: lateDates.length,
        avgLabel: avgMinutes == null ? "—" : formatMinutesAsTime(avgMinutes),
        sinceLastLateLabel: lateDates.length ? (sinceLastLate == null ? "—" : `${sinceLastLate}d`) : "No late"
      };
    }

    function getCalendarDraftArrivalTime() {
      return String(appState.ui.calendarDraftArrivalTime || "");
    }

    function setCalendarDraftArrivalTime(value) {
      appState.ui.calendarDraftArrivalTime = String(value || "");
    }

    function commitArrivalInput(dateKey, rawValue, { render = true, allowClear = false } = {}) {
      const normalized = parseLooseTimeInput(rawValue);
      if (!normalized) {
        if (allowClear && !String(rawValue || "").trim()) {
          delete appState.calendar.arrivals[dateKey];
          setCalendarDraftArrivalTime("");
          saveState();
          if (render) renderApp();
          return true;
        }
        showToast("Use a time like 07:00, 700, or 730.");
        return false;
      }
      appState.calendar.arrivals[dateKey] = {
        arrivalTime: normalized,
        updatedAt: new Date().toISOString()
      };
      setCalendarDraftArrivalTime("");
      saveState();
      if (render) renderApp();
      return true;
    }

    function renderArrivalStats(monthStats) {
      return `
        <div class="bp-arrival-stats" aria-label="Monthly arrival stats">
          <span>Avg ${monthStats.avgLabel}</span>
          <span>Recorded ${monthStats.recorded}</span>
          <span>Late ${monthStats.late}</span>
          <span>Since late ${monthStats.sinceLastLateLabel}</span>
        </div>
      `;
    }

    function renderArrivalStepButtons() {
      return `
        <div class="bp-time-stepper bp-time-stepper-compact" aria-label="Adjust arrival time">
          <button type="button" data-arrival-step="-5" title="Minus 5 minutes">−5</button>
          <button type="button" data-arrival-step="-1" title="Minus 1 minute">−1</button>
          <button type="button" data-arrival-step="1" title="Plus 1 minute">+1</button>
          <button type="button" data-arrival-step="5" title="Plus 5 minutes">+5</button>
        </div>
      `;
    }

    function renderArrivalControl(dateKey, arrival, expected, status, statusBadge) {
      const isLogged = Boolean(arrival);
      const monthStats = getMonthArrivalStatsDetailed(dateKey.slice(0, 7), dateKey);
      const draftArrival = getCalendarDraftArrivalTime();
      const editing = Boolean(appState.ui.calendarArrivalEditing);
      if (!isLogged) {
        return `
          <section class="bp-arrival-card bp-arrival-pending">
            <div class="bp-arrival-card-title">Arrival pending</div>
            <div class="bp-arrival-pending-grid">
              <label for="bpArrivalTime">Expected ${expected}</label>
              <input id="bpArrivalTime" class="bp-time-text-input" type="text" inputmode="numeric" autocomplete="off" placeholder="${expected}" value="${escapeHTML(draftArrival)}" aria-label="Arrival time" data-arrival-mode="pending" />
              <button type="button" data-calendar-action="draft-arrival-expected" title="Fill expected arrival">${expected}</button>
              <div class="bp-time-stepper" aria-label="Adjust arrival time">
                <button type="button" data-arrival-step="-5" title="Minus 5 minutes">−5</button>
                <button type="button" data-arrival-step="-1" title="Minus 1 minute">−1</button>
                <button type="button" data-arrival-step="1" title="Plus 1 minute">+1</button>
                <button type="button" data-arrival-step="5" title="Plus 5 minutes">+5</button>
              </div>
              <button type="button" class="bp-start-day-button" data-calendar-action="set-arrival-now" title="Start day with typed time or current time">&gt; Start Day</button>
            </div>
          </section>
        `;
      }
      if (editing) {
        const editValue = draftArrival || arrival;
        return `
          <section class="bp-arrival-card bp-arrival-logged bp-arrival-editing">
            <div class="bp-arrival-state-row">
              <div>
                <span class="bp-arrival-kicker">Edit arrival</span>
                <strong>${escapeHTML(arrival)}</strong>
              </div>
              ${statusBadge}
            </div>
            <div class="bp-arrival-edit-row">
              <input id="bpArrivalTime" class="bp-time-text-input" type="text" inputmode="numeric" autocomplete="off" value="${escapeHTML(editValue)}" aria-label="Arrival time" data-arrival-mode="editing" />
              ${renderArrivalStepButtons()}
              <button type="button" data-calendar-action="set-arrival-expected" title="Use expected arrival">${expected}</button>
              <button type="button" data-calendar-action="save-arrival-edit" title="Save arrival edit">Save</button>
              <button type="button" data-calendar-action="cancel-arrival-edit" title="Discard arrival edit">Discard</button>
            </div>
            ${renderArrivalStats(monthStats)}
          </section>
        `;
      }
      return `
        <section class="bp-arrival-card bp-arrival-logged">
          <div class="bp-arrival-state-row">
            <div>
              <span class="bp-arrival-kicker">Arrival logged</span>
              <strong>${escapeHTML(arrival)}</strong>
            </div>
            ${statusBadge}
            <button type="button" data-calendar-action="edit-arrival" title="Edit arrival">Edit</button>
            <button type="button" data-calendar-action="clear-arrival" title="Clear arrival">×</button>
          </div>
          ${renderArrivalStats(monthStats)}
        </section>
      `;
    }

    function renderDayEventPreview(events) {
      return sortedEvents(events).slice(0, 2).map(event => {
        const schedule = getEventSchedule(event);
        const priorityIcon = prioritySymbol(event.priority);
        const timeLabel = schedule ? (schedule.hasRange ? `${schedule.startTime}-${schedule.endTime}` : schedule.startTime) : "";
        const label = `${timeLabel ? timeLabel + " " : ""}${eventDisplayTitle(event)}`.trim();
        return `<span class="bp-day-event-chip bp-day-event-${normalizePriority(event.priority)}" title="${escapeHTML(label)}">${priorityIcon} ${escapeHTML(label)}</span>`;
      }).join("");
    }

    function nowMinutesOfDay() {
      const now = new Date();
      return now.getHours() * 60 + now.getMinutes();
    }

    function realTodayKey() {
      return toDateKey(new Date());
    }

    function dayTimelinePosition(dateKey) {
      // The Gantt "now" marker follows the real local clock day.
      // Backpack day boundaries are still used for arrival/current-day logic,
      // but a visual clock rail should not jump to 00:00 before 07:00.
      const selected = fromDateKey(dateKey);
      const today = fromDateKey(realTodayKey());
      const selectedMid = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate()).getTime();
      const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      if (selectedMid < todayMid) return 100;
      if (selectedMid > todayMid) return 0;
      return Math.max(0, Math.min(100, (nowMinutesOfDay() / 1440) * 100));
    }

    function eventGanttRow(event, dateKey, rowIndex) {
      const schedule = getEventSchedule(event);
      if (!schedule) return "";
      const isToday = dateKey === realTodayKey();
      const now = nowMinutesOfDay();
      const status = isToday && schedule.end < now ? "past" : isToday && schedule.start <= now && schedule.end >= now ? "active" : isToday ? "future" : "day";
      const priority = normalizePriority(event.priority);
      const timeLabel = eventTimeLabel(schedule);
      const title = eventDisplayTitle(event);
      const label = `${eventTimeLabel(schedule)} ${title}`.trim();
      const durationClass = schedule.hasRange ? "" : " bp-gantt-default-duration";
      return `
        <div class="bp-gantt-row bp-gantt-${priority} bp-gantt-${status}" style="--row:${rowIndex};" data-start="${schedule.start}" data-end="${schedule.end}" title="${escapeHTML(label)}">
          <span class="bp-gantt-row-label"><b>${escapeHTML(timeLabel || schedule.startTime)}</b><span>${escapeHTML(title)}</span></span>
          <span class="bp-gantt-bar${durationClass}" style="--event-left:0px;--event-width:50px;" title="${escapeHTML(label)}">
            <i>${escapeHTML(timeLabel)}</i>
          </span>
        </div>
      `;
    }

    function getGanttWindow(dateKey, timedEvents = []) {
      const schedules = timedEvents.map(getEventSchedule).filter(Boolean);
      const arrivalMinutes = timeToMinutes(getArrivalRecord(dateKey)?.arrivalTime);
      const expectedMinutes = timeToMinutes(getExpectedArrival(dateKey));
      const anchor = arrivalMinutes ?? expectedMinutes ?? (BP_USER_CONFIG.calendar.dayStartHour * 60);
      const eventStarts = schedules.map(schedule => schedule.start);
      const eventEnds = schedules.map(schedule => schedule.end);
      const earliest = eventStarts.length ? Math.min(anchor, ...eventStarts) : anchor;
      const latest = eventEnds.length ? Math.max(anchor + 480, ...eventEnds) : anchor + 480;
      const windowStart = floorToStep(earliest, 30);
      const minimumEnd = windowStart + 480;
      const desiredEnd = Math.max(latest, minimumEnd);
      const windowEnd = Math.max(windowStart + 60, ceilToStep(desiredEnd, 30));
      return {
        start: Math.max(0, Math.min(1439, windowStart)),
        end: Math.max(Math.min(1440, windowEnd), Math.max(0, Math.min(1439, windowStart)) + 60),
        anchor,
        startLabel: formatMinutesAsTime(windowStart),
        endLabel: formatMinutesAsTime(Math.min(1439, windowEnd))
      };
    }

    function renderGanttHourMarks(window) {
      const marks = [];
      const first = Math.ceil(window.start / 60) * 60;
      for (let minute = first; minute <= window.end; minute += 60) {
        marks.push(`<span class="bp-gantt-hour-mark" data-minute="${minute}">${formatMinutesAsTime(minute)}</span>`);
      }
      if (!marks.length) marks.push(`<span class="bp-gantt-hour-mark" data-minute="${window.start}">${window.startLabel}</span>`);
      return marks.join("");
    }

    function renderEventTimeRail(dateKey, events = [], options = {}) {
      const timedEvents = sortedEvents(events).filter(event => getEventSchedule(event));
      const promoted = Boolean(options.promoted);
      const pinned = isWidgetPromoted('calendarGantt');
      const promoteLabel = pinned ? 'Unpin' : 'Pin to shelf';
      const promoteAction = pinned ? 'clear' : 'toggle';
      const promoteButton = promoted ? '' : `<button type="button" class="bp-gantt-promote" data-promote-widget="calendarGantt" data-promote-action="${promoteAction}">${promoteLabel}</button>`;
      const selectedIsToday = dateKey === realTodayKey();
      const standby = dateKey === getBackpackTodayKey() && !hasArrival(dateKey);
      const window = getGanttWindow(dateKey, timedEvents);
      const rows = timedEvents.map((event, index) => eventGanttRow(event, dateKey, index)).join("");
      return `
        <section class="bp-time-rail-card bp-gantt-card ${standby ? "bp-gantt-standby" : "bp-gantt-active"} ${promoted ? "bp-gantt-card-promoted" : ""}" aria-label="Event Gantt timeline">
          <div class="bp-time-rail-head">
            <strong>Event Gantt</strong>
            <span>${timedEvents.length ? `${timedEvents.length} timed · ${window.startLabel}–${window.endLabel}` : "No timed events"}</span>
            ${promoteButton}
          </div>
          <div class="bp-time-rail bp-gantt" style="--bp-now-left:0px;--bp-gantt-label-width:0px;--bp-gantt-rows:${Math.max(1, timedEvents.length)};" data-date="${dateKey}" data-today="${selectedIsToday ? "true" : "false"}" data-standby="${standby ? "true" : "false"}" data-window-start="${window.start}" data-window-end="${window.end}">
            <div class="bp-time-rail-hours" aria-hidden="true">${renderGanttHourMarks(window)}</div>
            <div class="bp-gantt-track">
              <span class="bp-time-now" title="Current time"></span>
              ${rows || `<div class="bp-gantt-empty">${standby ? "Day not started" : "Timed items appear here. Untimed items stay in the day list."}</div>`}
              ${standby ? `<div class="bp-gantt-standby-overlay" aria-hidden="true">Day not started</div>` : ""}
            </div>
          </div>
        </section>
      `;
    }

    function getGanttGeometry(rail) {
      const track = rail?.querySelector?.('.bp-gantt-track');
      if (!track) return null;
      const trackWidth = track.clientWidth;
      if (!trackWidth) return null;
      const firstLabel = track.querySelector('.bp-gantt-row-label');
      let labelWidth = 0;
      if (firstLabel) {
        const trackRect = track.getBoundingClientRect();
        const labelRect = firstLabel.getBoundingClientRect();
        labelWidth = Math.max(0, labelRect.right - trackRect.left + 6);
      } else {
        labelWidth = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
      }
      labelWidth = Math.max(0, Math.min(trackWidth * 0.65, labelWidth));
      const gutterRight = 4;
      const trackLeft = labelWidth;
      const trackRight = Math.max(trackLeft, trackWidth - gutterRight);
      const usableWidth = Math.max(0, trackRight - trackLeft);
      return { track, trackWidth, labelWidth, trackLeft, trackRight, usableWidth };
    }

    function minutesToGanttX(minutes, geometry, windowStart = 0, windowEnd = 1440) {
      const span = Math.max(1, windowEnd - windowStart);
      const clamped = Math.max(windowStart, Math.min(windowEnd, Number(minutes) || windowStart));
      return geometry.trackLeft + (((clamped - windowStart) / span) * geometry.usableWidth);
    }

    function updateSingleGanttRail(rail) {
      const dateKey = rail.dataset.date;
      if (!dateKey) return;

      const geometry = getGanttGeometry(rail);
      if (!geometry) return;
      rail.style.setProperty('--bp-gantt-label-width', `${geometry.labelWidth.toFixed(1)}px`);

      const windowStart = Number(rail.dataset.windowStart) || 0;
      const windowEnd = Number(rail.dataset.windowEnd) || 1440;
      const selectedIsToday = rail.dataset.today === 'true';
      const nowMinute = nowMinutesOfDay();
      const nowLeft = minutesToGanttX(nowMinute, geometry, windowStart, windowEnd);
      rail.style.setProperty('--bp-now-left', `${nowLeft.toFixed(1)}px`);
      rail.dataset.nowVisible = selectedIsToday && nowMinute >= windowStart && nowMinute <= windowEnd ? 'true' : 'false';

      rail.querySelectorAll('.bp-gantt-hour-mark').forEach(mark => {
        const minute = Number(mark.dataset.minute);
        if (!Number.isFinite(minute)) return;
        mark.style.left = `${minutesToGanttX(minute, geometry, windowStart, windowEnd).toFixed(1)}px`;
      });

      geometry.track.querySelectorAll('.bp-gantt-row').forEach(row => {
        const start = Number(row.dataset.start);
        const end = Number(row.dataset.end);
        const bar = row.querySelector('.bp-gantt-bar');
        if (!bar || !Number.isFinite(start) || !Number.isFinite(end)) return;
        const startX = minutesToGanttX(start, geometry, windowStart, windowEnd);
        const endX = minutesToGanttX(end, geometry, windowStart, windowEnd);
        const left = Math.max(geometry.trackLeft, Math.min(geometry.trackRight, startX));
        const rawWidth = Math.max(0, Math.min(geometry.trackRight, endX) - left);
        const width = Math.max(42, rawWidth);
        bar.style.setProperty('--event-left', `${left.toFixed(1)}px`);
        bar.style.setProperty('--event-width', `${Math.min(width, Math.max(42, geometry.trackRight - left)).toFixed(1)}px`);
      });
    }

    function updateCalendarTimeRail() {
      const rails = document.querySelectorAll('.bp-time-rail.bp-gantt');
      if (!rails.length) return;
      requestAnimationFrame(() => {
        rails.forEach(updateSingleGanttRail);
      });
    }

    function renderCalendar() {
      const monthDate = fromDateKey(`${appState.calendar.currentMonth}-01`);
      const monthTitle = monthDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
      const todayKey = getBackpackTodayKey();
      const weekdaysBase = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weekdays = [...weekdaysBase.slice(BP_USER_CONFIG.calendar.weekStartsOn), ...weekdaysBase.slice(0, BP_USER_CONFIG.calendar.weekStartsOn)];
      const cells = getDaysForMonth(appState.calendar.currentMonth);
      const monthStats = getCalendarMonthStats(appState.calendar.currentMonth);

      return `
        <section class="bp-panel">
          <div class="bp-calendar-layout">
            <div>
              <div class="bp-calendar-toolbar">
                <h2 style="margin:0;">Calendar</h2>
                <div class="bp-calendar-month-title">${monthTitle}</div>
                <div class="bp-calendar-stats" aria-label="Month summary">
                  <span title="Recorded arrivals">✓ ${monthStats.onTime}</span>
                  <span title="Late arrivals">⚠ ${monthStats.late}</span>
                  <span title="Events this month">▦ ${monthStats.events}</span>
                </div>
                <div class="bp-calendar-nav">
                  <button data-calendar-action="prev" title="Previous month">◀</button>
                  <button data-calendar-action="today">Today</button>
                  <button data-calendar-action="next" title="Next month">▶</button>
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
      const counts = getPriorityCounts(events);
      const countTitle = events.length
        ? `${events.length} event${events.length === 1 ? "" : "s"}: ${counts.highest} highest, ${counts.high} high, ${counts.normal} normal`
        : "No events";
      const eventPill = events.length
        ? `<span class="bp-day-count" title="${escapeHTML(countTitle)}" aria-label="${escapeHTML(countTitle)}">▦ ${events.length}</span>`
        : "";
      const priorityMix = events.length
        ? `<span class="bp-day-priority-mix" aria-hidden="true">${counts.highest ? `<i class="bp-mix-highest"></i>` : ""}${counts.high ? `<i class="bp-mix-high"></i>` : ""}${counts.normal ? `<i class="bp-mix-normal"></i>` : ""}</span>`
        : "";
      return `
        <button type="button" class="${classes.join(" ")}" data-date="${dateKey}" aria-label="Open ${dateLabel(dateKey)}">
          ${renderDayEventBand(events)}
          <div class="bp-day-topline">
            <span class="bp-day-number">${date.getDate()}</span>
            <span class="bp-day-meta">${arrivalPill}${eventPill}${priorityMix}</span>
          </div>
          <div class="bp-day-events">${renderDayEventPreview(events)}</div>
        </button>
      `;
    }


    function renderCalendarTools(dateKey) {
      const diagnostics = getCalendarDiagnostics(appState.calendar);
      const stats = diagnostics.stats;
      const issueCount = diagnostics.issues.length;
      const repeatGroups = getRepeatGroupSummaries(appState.calendar.currentMonth);
      const sampleIssues = diagnostics.issues.slice(0, 5);
      return `
        <details class="bp-calendar-tools" ${appState.ui.calendarToolsOpen ? "open" : ""}>
          <summary>Calendar release tools <span class="bp-pill">${issueCount ? `${issueCount} issue${issueCount === 1 ? "" : "s"}` : "Ready"}</span></summary>
          <div class="bp-calendar-tools-grid">
            <section class="bp-calendar-tool-card">
              <h4>Backup</h4>
              <div class="bp-calendar-tool-actions">
                <button type="button" data-calendar-tool-action="export-calendar">⤴ Calendar</button>
                <button type="button" data-calendar-tool-action="import-calendar">⤵ Calendar</button>
                <input id="bpCalendarImportFile" class="bp-hidden" type="file" accept="application/json,.json" />
              </div>
              <p>Calendar-only import replaces Calendar data and leaves other Backpack tabs untouched.</p>
            </section>
            <section class="bp-calendar-tool-card">
              <h4>Maintenance</h4>
              <div class="bp-calendar-tool-actions">
                <button type="button" data-calendar-tool-action="repair-calendar">Repair</button>
                <button type="button" data-calendar-tool-action="clean-empty-days">Clean empty days</button>
                <button type="button" class="bp-danger" data-calendar-tool-action="clear-selected-day">Clear selected day</button>
              </div>
              <p>${stats.events} events · ${stats.timedEvents} timed · ${stats.untimedEvents} untimed · ${stats.arrivals} arrivals</p>
            </section>
            <section class="bp-calendar-tool-card">
              <h4>Diagnostics</h4>
              ${sampleIssues.length ? `
                <ul class="bp-calendar-issue-list">
                  ${sampleIssues.map(issue => `<li><strong>${escapeHTML(issue.level)}</strong> · ${escapeHTML(issue.message)}</li>`).join("")}
                </ul>
                ${issueCount > sampleIssues.length ? `<p>${issueCount - sampleIssues.length} more issue${issueCount - sampleIssues.length === 1 ? "" : "s"} hidden.</p>` : ""}
              ` : `<p>No calendar maintenance issues detected.</p>`}
            </section>
            <section class="bp-calendar-tool-card">
              <h4>Repeat groups this month</h4>
              ${repeatGroups.length ? `
                <div class="bp-repeat-group-list">
                  ${repeatGroups.map(group => `<div><span class="bp-pill">↻ ${group.count}</span> ${escapeHTML(group.time ? `${group.time} · ` : "")}${escapeHTML(group.title)}</div>`).join("")}
                </div>
              ` : `<p>No repeated groups in this month.</p>`}
            </section>
          </div>
        </details>
      `;
    }

    function renderSelectedDayPanel() {
      const dateKey = appState.calendar.selectedDate || getBackpackTodayKey();
      const arrival = appState.calendar.arrivals[dateKey]?.arrivalTime || "";
      const expected = getExpectedArrival(dateKey);
      const status = getArrivalStatus(dateKey);
      const events = sortedEvents(appState.calendar.events[dateKey] || []);
      const draft = getCalendarDraftEvent();
      const repeatPreviewCount = draft.repeatDays.length ? datesForRepeatInCurrentMonth(dateKey, draft.repeatDays).length : 1;
      const priorityColumns = PRIORITY_ORDER.map(id => ({ id, label: priorityLabel(id), icon: prioritySymbol(id) }))
        .filter(column => events.length === 0 ? column.id === "normal" : events.some(event => normalizePriority(event.priority) === column.id));
      const statusBadge = status === "late"
        ? `<span class="bp-pill bp-pill-late" title="Late arrival">⚠ Late</span>`
        : status === "on-time"
          ? `<span class="bp-pill bp-pill-ok" title="On-time arrival">✓ On time</span>`
          : `<span class="bp-pill">No arrival</span>`;

      return `
        <aside class="bp-card bp-day-detail ${!arrival && dateKey === getBackpackTodayKey() ? "bp-day-detail-standby" : "bp-day-detail-active"}">
          <div class="bp-day-detail-head">
            <h3>${dateLabel(dateKey)}</h3>
            <div class="bp-day-detail-summary">
              <span class="bp-pill">Expected ${expected}</span>
              ${statusBadge}
              <span class="bp-pill">▦ ${events.length}</span>
            </div>
          </div>

          <div class="bp-day-flow">
            ${renderArrivalControl(dateKey, arrival, expected, status, statusBadge)}

            <details class="bp-card bp-new-event-card" ${appState.ui.calendarNewEventOpen ? "open" : ""}>
              <summary>＋ New Event</summary>
              <div class="bp-new-event-grid">
                <div class="bp-field bp-event-title-field">
                  <label for="bpEventTitle">Title. Optional time at start: HH:MM - HH:MM, or HH:MM.</label>
                  <input id="bpEventTitle" value="${escapeHTML(draft.titleInput)}" placeholder="09:00 - 10:30 Review, or 09:00 Review" />
                </div>
                <div class="bp-field">
                  <label for="bpEventPriority">Priority</label>
                  <select id="bpEventPriority">
                    ${renderPriorityOptions(draft.priority)}
                  </select>
                </div>
                <button type="button" data-calendar-action="add-event">Add</button>
                <details class="bp-event-notes-details">
                  <summary>Notes</summary>
                  <textarea id="bpEventNotes" placeholder="Optional details">${escapeHTML(draft.notes)}</textarea>
                </details>
                <details class="bp-event-repeat-details">
                  <summary>Repeat this month</summary>
                  <div class="bp-repeat-tools">
                    <button type="button" data-repeat-preset="weekdays">Weekdays</button>
                    <button type="button" data-repeat-preset="everyday">Every day</button>
                    <button type="button" data-repeat-preset="clear">Clear</button>
                  </div>
                  <div class="bp-repeat-days" aria-label="Repeat on days">
                    ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, index) => `
                      <label><input type="checkbox" value="${(index + 1) % 7}" data-repeat-day ${draft.repeatDays.includes((index + 1) % 7) ? "checked" : ""} /> ${label}</label>
                    `).join("")}
                  </div>
                  <div class="bp-repeat-preview" data-repeat-preview>${draft.repeatDays.length ? `Creates ${repeatPreviewCount} event${repeatPreviewCount === 1 ? "" : "s"} this month` : "No repeat selected"}</div>
                </details>
              </div>
            </details>
          </div>

          ${isWidgetPromoted('calendarGantt') ? renderPromotedInlineNotice('calendarGantt') : renderEventTimeRail(dateKey, events)}
          ${renderUntimedEventsCompact(events)}

          <div class="bp-events-head">
            <h4>${events.length >= 2 ? "Schedule" : "Events"}</h4>
            <span class="bp-pill">${events.length} total</span>
          </div>
          <div class="bp-event-kanban">
            ${priorityColumns.map(column => `
              <div class="bp-event-column">
                <h4><span>${column.icon} ${column.label}</span><span>${events.filter(event => normalizePriority(event.priority) === column.id).length || ""}</span></h4>
                ${events.filter(event => normalizePriority(event.priority) === column.id).map(renderEventBlock).join("") || `<p class="bp-muted">No ${column.label.toLowerCase()} events.</p>`}
              </div>
            `).join("")}
          </div>

          ${renderCalendarTools(dateKey)}
        </aside>
      `;
    }

    function renderEventBlock(event) {
      const editing = appState.ui.editingEventId === event.id;
      if (editing) {
        return `
          <div class="bp-event-block bp-event-editing" data-priority="${normalizePriority(event.priority)}">
            <div class="bp-new-event-grid">
              <div class="bp-field bp-event-title-field"><label>Title</label><input data-edit-field="title" data-event-id="${event.id}" value="${escapeHTML(eventInputValue(event))}"></div>
              <div class="bp-field"><label>Priority</label>
                <select data-edit-field="priority" data-event-id="${event.id}">
                  ${renderPriorityOptions(event.priority)}
                </select>
              </div>
              <div class="bp-field bp-event-notes-edit"><label>Notes</label><textarea data-edit-field="notes" data-event-id="${event.id}">${escapeHTML(event.notes || "")}</textarea></div>
              <div class="bp-event-actions">
                <button type="button" data-event-action="save" data-event-id="${event.id}">Save</button>
                <button type="button" data-event-action="cancel" data-event-id="${event.id}">Cancel</button>
              </div>
            </div>
          </div>
        `;
      }
      const schedule = getEventSchedule(event);
      const timeLabel = eventTimeLabel(schedule);
      const timeClass = schedule && !schedule.hasRange ? " bp-time-default" : "";
      const timeTitle = schedule ? eventDurationTitle(schedule) : "";
      const repeatMeta = event.repeatId ? `<div class="bp-event-meta"><span class="bp-pill bp-repeat-pill" title="Repeated event group">${escapeHTML(repeatSummary(event))}</span></div>` : "";
      return `
        <div class="bp-event-block" data-priority="${normalizePriority(event.priority)}">
          <div class="bp-event-row">
            <div class="bp-event-title">${timeLabel ? `<span class="bp-pill${timeClass}" title="${escapeHTML(timeTitle)}">${escapeHTML(timeLabel)}</span> ` : ""}<span>${escapeHTML(eventDisplayTitle(event))}</span></div>
            <div class="bp-event-actions">
              <button type="button" data-event-action="edit" data-event-id="${event.id}" title="Edit event">✎</button>
              <button type="button" class="bp-danger" data-event-action="delete" data-event-id="${event.id}" title="Delete this event">×</button>
              ${event.repeatId ? `<button type="button" class="bp-danger" data-event-action="delete-group" data-event-id="${event.id}" title="Delete repeated group">↻×</button>` : ""}
            </div>
          </div>
          ${repeatMeta}
          ${event.notes ? `<div class="bp-event-notes">${escapeHTML(event.notes)}</div>` : ""}
        </div>
      `;
    }

    function bindCalendar() {
      updateCalendarTimeRail();
      $$('[data-date]').forEach(button => {
        button.addEventListener('click', () => {
          appState.calendar.selectedDate = button.dataset.date;
          appState.ui.editingEventId = null;
          appState.ui.calendarArrivalEditing = false;
          setCalendarDraftArrivalTime('');
          renderApp();
        });
      });

      $$('[data-calendar-action]').forEach(button => {
        button.addEventListener('click', () => handleCalendarAction(button.dataset.calendarAction));
      });

      const newEventDetails = $('.bp-new-event-card');
      newEventDetails?.addEventListener('toggle', () => {
        appState.ui.calendarNewEventOpen = newEventDetails.open;
        saveState();
      });

      const calendarTools = $('.bp-calendar-tools');
      calendarTools?.addEventListener('toggle', () => {
        appState.ui.calendarToolsOpen = calendarTools.open;
        saveState();
      });

      $$('[data-calendar-tool-action]').forEach(button => {
        button.addEventListener('click', () => handleCalendarToolAction(button.dataset.calendarToolAction));
      });

      $('#bpCalendarImportFile')?.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (file) importCalendarStateFile(file);
        event.target.value = '';
      });

      $('#bpEventTitle')?.addEventListener('input', event => {
        setCalendarDraftEvent({ titleInput: event.target.value });
        saveState();
      });
      $('#bpEventPriority')?.addEventListener('change', event => {
        setCalendarDraftEvent({ priority: event.target.value });
        saveState();
      });
      $('#bpEventNotes')?.addEventListener('input', event => {
        setCalendarDraftEvent({ notes: event.target.value });
        saveState();
      });
      $$('[data-repeat-day]').forEach(input => {
        input.addEventListener('change', () => {
          setCalendarDraftEvent({ repeatDays: getSelectedRepeatDays() });
          updateRepeatPreview();
          saveState();
        });
      });

      const arrival = $('#bpArrivalTime');
      if (arrival) {
        arrival.addEventListener('input', () => {
          setCalendarDraftArrivalTime(arrival.value);
          arrival.classList.remove('bp-time-invalid');
          saveState();
        });
        arrival.addEventListener('change', () => {
          const normalized = parseLooseTimeInput(arrival.value);
          arrival.classList.toggle('bp-time-invalid', Boolean(arrival.value.trim()) && !normalized);
          setCalendarDraftArrivalTime(arrival.value);
          saveState();
        });
        arrival.addEventListener('keydown', event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            const mode = arrival.dataset.arrivalMode;
            if (mode === 'editing') handleCalendarAction('save-arrival-edit');
            else handleCalendarAction('set-arrival-now');
          }
        });
      }

      $$('[data-arrival-step]').forEach(button => {
        button.addEventListener('click', () => {
          const dateKey = appState.calendar.selectedDate;
          const input = $('#bpArrivalTime');
          const current = parseLooseTimeInput(input?.value) || getArrivalRecord(dateKey)?.arrivalTime || parseLooseTimeInput(getCalendarDraftArrivalTime()) || getExpectedArrival(dateKey);
          const next = offsetTimeString(current, Number(button.dataset.arrivalStep));
          if (!next || !input) return;
          input.value = next;
          setCalendarDraftArrivalTime(next);
          input.classList.remove('bp-time-invalid');
          if (hasArrival(dateKey) && !appState.ui.calendarArrivalEditing) {
            appState.calendar.arrivals[dateKey] = { arrivalTime: next, updatedAt: new Date().toISOString() };
            setCalendarDraftArrivalTime('');
            saveState();
            renderApp();
          } else {
            saveState();
          }
        });
      });

      $$('[data-event-action]').forEach(button => {
        button.addEventListener('click', () => handleEventAction(button.dataset.eventAction, button.dataset.eventId));
      });

      $$('[data-repeat-preset]').forEach(button => {
        button.addEventListener('click', () => {
          const mode = button.dataset.repeatPreset;
          const checks = $$('[data-repeat-day]');
          checks.forEach(input => {
            const day = Number(input.value);
            input.checked = mode === 'everyday' || (mode === 'weekdays' && day >= 1 && day <= 5);
            if (mode === 'clear') input.checked = false;
          });
          setCalendarDraftEvent({ repeatDays: getSelectedRepeatDays() });
          updateRepeatPreview();
          saveState();
        });
      });
    }

    function getSelectedRepeatDays() {
      return $$('[data-repeat-day]:checked').map(input => Number(input.value));
    }

    function updateRepeatPreview() {
      const target = $('[data-repeat-preview]');
      if (!target) return;
      const days = getSelectedRepeatDays();
      if (!days.length) {
        target.textContent = 'No repeat selected';
        return;
      }
      const count = datesForRepeatInCurrentMonth(appState.calendar.selectedDate, days).length;
      target.textContent = `Creates ${count} event${count === 1 ? '' : 's'} this month`;
    }

    function datesForRepeatInCurrentMonth(seedDateKey, repeatDays) {
      const days = new Set(repeatDays);
      if (!days.size) return [seedDateKey];
      const monthKey = appState.calendar.currentMonth;
      const [year, month] = monthKey.split('-').map(Number);
      const last = new Date(year, month, 0).getDate();
      const seedTime = fromDateKey(seedDateKey).getTime();
      const keys = [];
      for (let day = 1; day <= last; day += 1) {
        const date = new Date(year, month - 1, day);
        if (date.getTime() < seedTime) continue;
        if (days.has(date.getDay())) keys.push(toDateKey(date));
      }
      return keys.length ? keys : [seedDateKey];
    }


    function handleCalendarToolAction(action) {
      if (action === 'export-calendar') exportCalendarState();
      if (action === 'import-calendar') $('#bpCalendarImportFile')?.click();
      if (action === 'repair-calendar') repairCalendarState();
      if (action === 'clean-empty-days') {
        const removed = cleanEmptyCalendarDays(appState.calendar);
        saveState();
        renderApp();
        showToast(`Cleaned ${removed} empty calendar day${removed === 1 ? '' : 's'}.`);
      }
      if (action === 'clear-selected-day') clearSelectedCalendarDay();
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
        setCalendarDraftArrivalTime('');
        appState.ui.calendarArrivalEditing = false;
      }
      if (action === 'edit-arrival') {
        const dateKey = appState.calendar.selectedDate;
        setCalendarDraftArrivalTime(appState.calendar.arrivals[dateKey]?.arrivalTime || getExpectedArrival(dateKey));
        appState.ui.calendarArrivalEditing = true;
      }
      if (action === 'cancel-arrival-edit') {
        setCalendarDraftArrivalTime('');
        appState.ui.calendarArrivalEditing = false;
      }
      if (action === 'save-arrival-edit') {
        const input = $('#bpArrivalTime');
        const ok = commitArrivalInput(appState.calendar.selectedDate, input?.value || getCalendarDraftArrivalTime(), { render: false, allowClear: false });
        if (!ok) {
          input?.classList.add('bp-time-invalid');
          return;
        }
        appState.ui.calendarArrivalEditing = false;
      }
      if (action === 'draft-arrival-expected') {
        const expected = getExpectedArrival(appState.calendar.selectedDate);
        setCalendarDraftArrivalTime(expected);
        const input = $('#bpArrivalTime');
        if (input) {
          input.value = expected;
          input.classList.remove('bp-time-invalid');
          input.focus();
        }
        saveState();
        return;
      }
      if (action === 'set-arrival-expected') {
        const dateKey = appState.calendar.selectedDate;
        const expectedValue = getExpectedArrival(dateKey);
        if (appState.ui.calendarArrivalEditing) {
          setCalendarDraftArrivalTime(expectedValue);
          const input = $('#bpArrivalTime');
          if (input) {
            input.value = expectedValue;
            input.classList.remove('bp-time-invalid');
            input.focus();
          }
          saveState();
          return;
        }
        appState.calendar.arrivals[dateKey] = {
          arrivalTime: expectedValue,
          updatedAt: new Date().toISOString()
        };
        setCalendarDraftArrivalTime('');
      }
      if (action === 'set-arrival-now') {
        const now = new Date();
        const typed = parseLooseTimeInput($('#bpArrivalTime')?.value);
        appState.calendar.arrivals[appState.calendar.selectedDate] = {
          arrivalTime: typed || `${pad2(now.getHours())}:${pad2(now.getMinutes())}`,
          updatedAt: new Date().toISOString()
        };
        setCalendarDraftArrivalTime('');
        appState.ui.calendarArrivalEditing = false;
      }
      if (action === 'add-event') {
        const draft = getCalendarDraftEvent();
        const title = ($('#bpEventTitle')?.value ?? draft.titleInput).trim();
        const priority = $('#bpEventPriority')?.value ?? draft.priority;
        const notes = ($('#bpEventNotes')?.value ?? draft.notes).trim();
        if (!title) return showToast('Event title is required.');
        const dateKey = appState.calendar.selectedDate;
        const repeatDays = getSelectedRepeatDays();
        const targetDates = datesForRepeatInCurrentMonth(dateKey, repeatDays);
        const repeatId = repeatDays.length ? uid('rep') : null;
        for (const targetDate of targetDates) {
          appState.calendar.events[targetDate] ||= [];
          appState.calendar.events[targetDate].push(createCalendarEvent({
            titleInput: title,
            priority,
            notes,
            repeatId,
            repeatDays,
            repeatSourceDate: repeatId ? dateKey : null,
            repeatGenerated: Boolean(repeatId)
          }));
        }
        showToast(repeatDays.length ? `Repeat this month: ${targetDates.length} event${targetDates.length === 1 ? '' : 's'} added.` : 'Event added.');
        resetCalendarDraftEvent();
        appState.ui.calendarNewEventOpen = false;
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
        if (!confirm(event.repeatId ? 'Delete only this repeated event?' : 'Delete this event?')) return;
        appState.calendar.events[dateKey] = events.filter(item => item.id !== eventId);
        appState.ui.editingEventId = null;
      }
      if (action === 'delete-group') {
        if (!event.repeatId) return;
        const group = getRepeatGroupEvents(event.repeatId);
        if (!group.length) return;
        if (!confirm(`Delete all ${group.length} events in this repeated group?`)) return;
        for (const { dateKey: groupDateKey } of group) {
          appState.calendar.events[groupDateKey] = (appState.calendar.events[groupDateKey] || []).filter(item => item.repeatId !== event.repeatId);
          if (!appState.calendar.events[groupDateKey].length) delete appState.calendar.events[groupDateKey];
        }
        appState.ui.editingEventId = null;
        showToast(`Deleted ${group.length} repeated events.`);
      }
      if (action === 'save') {
        const titleInput = $(`[data-edit-field="title"][data-event-id="${eventId}"]`).value.trim() || eventInputValue(event);
        const draft = eventDraftFromInput(titleInput);
        Object.assign(event, normalizeEvent({
          ...event,
          title: draft.title,
          startTime: draft.startTime,
          endTime: draft.endTime,
          durationMode: draft.durationMode,
          priority: $(`[data-edit-field="priority"][data-event-id="${eventId}"]`).value,
          notes: $(`[data-edit-field="notes"][data-event-id="${eventId}"]`).value.trim(),
          updatedAt: new Date().toISOString()
        }));
        appState.ui.editingEventId = null;
      }
      saveState();
      renderApp();
    }

    /***************************************************************************
     * Shared content source registry
     * A custom page should mostly register files here, then reuse upload/demo/render helpers.
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
          label: BP_USER_CONFIG.contentLabels.notes,
          type: 'markdown',
          statePath: ['notes', 'markdown'],
          sourcePath: ['notes', 'source'],
          fallback: ''
        }
      };
      return sources[sourceId];
    }

    function useContentSourceFallback(sourceId, { rerenderTab = null, force = false } = {}) {
      const config = getContentSourceConfig(sourceId);
      if (!config) return;
      if (!config.fallback) {
        setStatePath(config.sourcePath, 'Upload required');
        showToast(`${config.label} must be uploaded.`);
      } else if (force || !getStatePath(config.statePath)) {
        setStatePath(config.statePath, config.fallback);
        setStatePath(config.sourcePath, `Bundled demo ${config.label}; upload to replace`);
      }
      saveState();
      if (rerenderTab && appState.activeTab === rerenderTab) renderApp();
    }

    async function loadContentSource(sourceId, options = {}) {
      useContentSourceFallback(sourceId, options);
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
      appState.notes.source ||= 'Upload required';
      saveState();
    }

    function renderNotes() {
      const hasMarkdown = Boolean(appState.notes.markdown);
      return `
        <section class="bp-panel bp-notes-panel">
          <div class="bp-panel-header">
            <div>
              <h2>Notes</h2>
              <p>Upload a Markdown file to use as the main Notes document. Raw HTML is escaped; no server or file-check step is required.</p>
            </div>
            <div class="bp-row">
              <span class="bp-pill">Source: ${escapeHTML(appState.notes.source)}</span>
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
                <p>Upload a Markdown file manually to use it in this session and cache it locally. This build intentionally does not check neighboring files.</p>
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
        title: 'Open Backpack entry file',
        category: 'Paths',
        description: 'Open the split build directly. Content documents are loaded with upload controls instead of a local server.',
        code: 'start "" "{{HTML_ENTRY}}"'
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
        title: 'Prepare upload content files',
        category: 'Content',
        description: 'Optional helper for authoring Markdown/HTML files before uploading them into Backpack.',
        code: 'mkdir -p "{{CONTENT_PATH}}"\n# Author files here, then upload them through the relevant tab:\n# {{NOTES_FILE}}\n# {{BASIC_MD}}\n# {{BASIC_HTML}}'
      },

      {
        title: 'Open Template - Medium wiki sources',
        category: 'Template - Medium',
        description: 'Open the wiki Markdown bundle folder and a side-note sample for the three-column wiki template.',
        code: 'code "{{WIKI_BEE_MD_BUNDLE}}" "{{WIKI_BEE_SIDEBAR_SAMPLE}}"'
      },
      {
        title: 'Create Template - Medium wiki scaffold',
        category: 'Template - Medium',
        description: 'Create optional wiki source folders before uploading a Markdown bundle through Template - Medium.',
        code: `mkdir -p "{{WIKI_BEE_MD_BUNDLE}}" "{{WIKI_BEE_IMAGES}}"
	touch "{{WIKI_BEE_MD_BUNDLE}}/index__orientation.md" "{{WIKI_BEE_MD_BUNDLE}}/index__side_note.md"
	# Prepare page image files, then upload them in Template - Medium:
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
    const quickNoteUrlPattern = /\b((?:https?:\/\/|www\.)[^\s<>"']+)/gi;
    const quickNoteAllowedTags = new Set(['A', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'BR', 'DIV', 'P', 'UL', 'OL', 'LI', 'CODE', 'PRE', 'BLOCKQUOTE']);

    function trimQuickNoteUrlToken(value) {
      let token = String(value || '').trim();
      let suffix = '';
      while (/[.,;:!?\)\]\}]+$/.test(token)) {
        const char = token.slice(-1);
        if ((char === ')' && token.includes('(')) || (char === ']' && token.includes('[')) || (char === '}' && token.includes('{'))) break;
        suffix = char + suffix;
        token = token.slice(0, -1);
      }
      return { token, suffix };
    }

    function normalizeQuickNoteUrl(value) {
      const trimmed = trimQuickNoteUrlToken(value).token;
      if (!trimmed) return '';
      const withProtocol = /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed;
      if (!/^https?:\/\//i.test(withProtocol)) return '';
      try {
        const url = new URL(withProtocol);
        if (!['http:', 'https:'].includes(url.protocol)) return '';
        return url.href;
      } catch (error) {
        return '';
      }
    }

    function linkifyQuickNoteText(text) {
      const raw = String(text || '');
      let html = '';
      let lastIndex = 0;
      for (const match of raw.matchAll(quickNoteUrlPattern)) {
        const start = match.index ?? 0;
        const original = match[0];
        const { token, suffix } = trimQuickNoteUrlToken(original);
        const href = normalizeQuickNoteUrl(token);
        html += escapeHTML(raw.slice(lastIndex, start));
        if (href) {
          html += `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(token)}</a>${escapeHTML(suffix)}`;
        } else {
          html += escapeHTML(original);
        }
        lastIndex = start + original.length;
      }
      html += escapeHTML(raw.slice(lastIndex));
      return html.replace(/\n/g, '<br>');
    }

    function quickNoteTextToHtml(text) {
      return linkifyQuickNoteText(text || '');
    }

    function sanitizeQuickNoteHTML(input) {
      const raw = String(input || '');
      if (!raw) return '';
      if (typeof document === 'undefined') return quickNoteTextToHtml(raw.replace(/<[^>]+>/g, ''));
      const template = document.createElement('template');
      template.innerHTML = raw;

      const textNodeType = typeof Node !== 'undefined' ? Node.TEXT_NODE : 3;
      const elementNodeType = typeof Node !== 'undefined' ? Node.ELEMENT_NODE : 1;
      function cleanNode(node, inAnchor = false) {
        if (node.nodeType === textNodeType) return inAnchor ? escapeHTML(node.textContent || '') : linkifyQuickNoteText(node.textContent || '');
        if (node.nodeType !== elementNodeType) return '';
        const tag = node.tagName.toUpperCase();
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'IFRAME' || tag === 'OBJECT') return '';
        const children = Array.from(node.childNodes).map(child => cleanNode(child, inAnchor || tag === 'A')).join('');
        if (!quickNoteAllowedTags.has(tag)) return children;
        if (tag === 'BR') return '<br>';
        if (tag === 'A') {
          const href = normalizeQuickNoteUrl(node.getAttribute('href') || node.textContent || '');
          if (!href) return children || escapeHTML(node.textContent || '');
          const label = children || escapeHTML(node.textContent || href);
          return `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        }
        const safeTag = tag.toLowerCase();
        return `<${safeTag}>${children}</${safeTag}>`;
      }

      return Array.from(template.content.childNodes).map(node => cleanNode(node)).join('');
    }

    function quickNoteTextFromHtml(html) {
      const raw = String(html || '');
      if (!raw) return '';
      if (typeof document === 'undefined') return raw.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
      const temp = document.createElement('div');
      temp.innerHTML = sanitizeQuickNoteHTML(raw);
      return temp.innerText || temp.textContent || '';
    }

    function extractQuickNoteLinksFromText(text) {
      const links = [];
      for (const match of String(text || '').matchAll(quickNoteUrlPattern)) {
        const { token } = trimQuickNoteUrlToken(match[0]);
        const url = normalizeQuickNoteUrl(token);
        if (url) links.push({ url, label: token });
      }
      return links;
    }

    function extractQuickNoteLinksFromHTML(html) {
      const links = [];
      const raw = String(html || '');
      if (!raw) return links;
      if (typeof DOMParser === 'undefined') return extractQuickNoteLinksFromText(raw);
      const doc = new DOMParser().parseFromString(raw, 'text/html');
      doc.querySelectorAll('a[href]').forEach(anchor => {
        const url = normalizeQuickNoteUrl(anchor.getAttribute('href') || '');
        if (url) links.push({ url, label: (anchor.textContent || url).trim() });
      });
      links.push(...extractQuickNoteLinksFromText(doc.body?.textContent || ''));
      return links;
    }

    function extractQuickNoteLinksFromElement(element) {
      if (!element) return [];
      const links = [];
      element.querySelectorAll?.('a[href]')?.forEach(anchor => {
        const url = normalizeQuickNoteUrl(anchor.getAttribute('href') || '');
        if (url) links.push({ url, label: (anchor.textContent || url).trim() });
      });
      links.push(...extractQuickNoteLinksFromText(element.innerText || element.textContent || ''));
      return links;
    }

    function normalizeQuickNoteLink(input = {}) {
      const url = normalizeQuickNoteUrl(input.url || input.href || input);
      if (!url) return null;
      const now = new Date().toISOString();
      return {
        id: input.id || uid('lnk'),
        url,
        label: String(input.label || input.title || input.text || url).trim().slice(0, 160),
        createdAt: input.createdAt || now,
        lastSeenAt: input.lastSeenAt || input.createdAt || now
      };
    }

    function normalizeQuickNoteLinks(links = []) {
      const output = [];
      const seen = new Set();
      (Array.isArray(links) ? links : []).forEach(link => {
        const normalized = normalizeQuickNoteLink(link);
        if (!normalized) return;
        const key = normalized.url.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        output.push(normalized);
      });
      return output;
    }

    function addQuickNoteLinks(note, candidates = []) {
      if (!note) return false;
      note.links = normalizeQuickNoteLinks(note.links || []);
      let changed = false;
      candidates.forEach(candidate => {
        const normalized = normalizeQuickNoteLink(candidate);
        if (!normalized) return;
        const existing = note.links.find(link => link.url.toLowerCase() === normalized.url.toLowerCase());
        if (existing) {
          existing.lastSeenAt = new Date().toISOString();
          if ((!existing.label || existing.label === existing.url) && normalized.label) existing.label = normalized.label;
        } else {
          note.links.push(normalized);
          changed = true;
        }
      });
      return changed;
    }

    function renderQuickNoteBody(note) {
      if (note.html) return sanitizeQuickNoteHTML(note.html);
      return quickNoteTextToHtml(note.text || '');
    }

    function getOpenQuickNoteLinksNote() {
      return appState.quickNotes.notes.find(note => note.id === appState.quickNotes.openLinksNoteId) || null;
    }

    function renderQuickNoteLinksInspector() {
      const note = getOpenQuickNoteLinksNote();
      if (!note) return '';
      const links = normalizeQuickNoteLinks(note.links || []);
      return `
        <aside id="bpQnLinksInspector" class="bp-qn-links-inspector" data-qn-links-inspector="${note.id}" aria-label="Saved links inspector">
          <div class="bp-qn-links-title">
            <div>
              <strong>Saved links</strong>
              <small>${escapeHTML(note.title || 'Note')}</small>
            </div>
            <div class="bp-qn-links-title-actions">
              <span>${links.length}</span>
              <button type="button" class="bp-qn-mini-button" data-qn-links-close title="Close links inspector" aria-label="Close links inspector">×</button>
            </div>
          </div>
          <div class="bp-qn-links-tools">
            <button type="button" data-qn-reset-size="${note.id}" title="Restore this note to the default recoverable size">Reset size</button>
          </div>
          ${links.length ? `
            <div class="bp-qn-links-list">
              ${links.map(link => `
                <div class="bp-qn-link-row" data-qn-link-row="${escapeHTML(link.id)}">
                  <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHTML(link.url)}">${escapeHTML(link.label || link.url)}</a>
                  <button type="button" class="bp-qn-mini-button" data-qn-link-delete="${note.id}" data-qn-link-id="${escapeHTML(link.id)}" title="Delete saved link" aria-label="Delete saved link">×</button>
                </div>
              `).join('')}
            </div>
          ` : `<p>No links saved yet. Paste a link in this note to capture it here. The link list is kept outside the card so it remains recoverable even when notes are small.</p>`}
        </aside>
      `;
    }

    function persistQuickNoteBodyFromElement(note, body, { extractLinks = false, writeBack = false } = {}) {
      if (!note || !body) return false;
      const sanitized = sanitizeQuickNoteHTML(body.innerHTML);
      let changed = false;
      if (extractLinks) changed = addQuickNoteLinks(note, extractQuickNoteLinksFromElement(body)) || changed;
      if (note.html !== sanitized) {
        note.html = sanitized;
        changed = true;
      }
      const text = body.innerText || body.textContent || '';
      if (note.text !== text) {
        note.text = text;
        changed = true;
      }
      if (writeBack && body.innerHTML !== sanitized) body.innerHTML = sanitized;
      if (changed) note.updatedAt = new Date().toISOString();
      return changed;
    }

    function commitQuickNoteBodies({ extractLinks = false } = {}) {
      let changed = false;
      $$('[data-qn-body]').forEach(body => {
        const note = appState.quickNotes.notes.find(item => item.id === body.dataset.qnBody);
        changed = persistQuickNoteBodyFromElement(note, body, { extractLinks }) || changed;
      });
      if (changed) saveState();
    }

    function insertQuickNoteHtmlAtCursor(html) {
      if (typeof document === 'undefined') return;
      if (document.queryCommandSupported?.('insertHTML')) {
        document.execCommand('insertHTML', false, html);
        return;
      }
      const selection = window.getSelection?.();
      if (!selection || !selection.rangeCount) return;
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

    function clampQuickNoteGeometry(note) {
      const cfg = BP_USER_CONFIG.quickNotes;
      const before = `${note.col},${note.row},${note.w},${note.h}`;
      note.w = Math.max(cfg.minW, Math.min(cfg.columns, Math.round(Number(note.w) || cfg.defaultW)));
      note.h = Math.max(cfg.minH, Math.min(cfg.rows, Math.round(Number(note.h) || cfg.defaultH)));
      note.col = Math.max(0, Math.min(cfg.columns - note.w, Math.round(Number(note.col) || 0)));
      note.row = Math.max(0, Math.min(cfg.rows - note.h, Math.round(Number(note.row) || 0)));
      return before !== `${note.col},${note.row},${note.w},${note.h}`;
    }

    function findQuickNoteSpaceForSize(w, h, ignoreId = null) {
      const cfg = BP_USER_CONFIG.quickNotes;
      const safeW = Math.max(cfg.minW, Math.min(cfg.columns, Math.round(Number(w) || cfg.defaultW)));
      const safeH = Math.max(cfg.minH, Math.min(cfg.rows, Math.round(Number(h) || cfg.defaultH)));
      for (let row = 0; row <= cfg.rows - safeH; row++) {
        for (let col = 0; col <= cfg.columns - safeW; col++) {
          const candidate = { col, row, w: safeW, h: safeH };
          if (canPlaceNote(candidate, ignoreId)) return candidate;
        }
      }
      return null;
    }

    function repairQuickNotesLayout({ resetSizes = false } = {}) {
      const cfg = BP_USER_CONFIG.quickNotes;
      let changed = false;
      appState.quickNotes.notes.forEach((note, index) => {
        const before = `${note.col},${note.row},${note.w},${note.h}`;
        if (resetSizes) {
          note.w = cfg.defaultW;
          note.h = cfg.defaultH;
        }
        clampQuickNoteGeometry(note);
        if (!canPlaceNote(note, note.id)) {
          const safeSpot = findQuickNoteSpaceForSize(note.w, note.h, note.id) || findQuickNoteSpaceForSize(cfg.defaultW, cfg.defaultH, note.id);
          if (safeSpot) Object.assign(note, safeSpot);
        }
        if (`${note.col},${note.row},${note.w},${note.h}` !== before) {
          note.updatedAt = new Date().toISOString();
          changed = true;
        }
      });
      if (!appState.quickNotes.notes.some(note => note.id === appState.quickNotes.openLinksNoteId)) {
        appState.quickNotes.openLinksNoteId = '';
        changed = true;
      }
      return changed;
    }

    function resetQuickNoteSize(noteId) {
      const cfg = BP_USER_CONFIG.quickNotes;
      const note = appState.quickNotes.notes.find(item => item.id === noteId);
      if (!note) return false;
      const candidate = { ...note, w: cfg.defaultW, h: cfg.defaultH };
      clampQuickNoteGeometry(candidate);
      if (canPlaceNote(candidate, note.id)) {
        Object.assign(note, candidate, { updatedAt: new Date().toISOString() });
        return true;
      }
      const safeSpot = findQuickNoteSpaceForSize(cfg.defaultW, cfg.defaultH, note.id);
      if (safeSpot) {
        Object.assign(note, safeSpot, { updatedAt: new Date().toISOString() });
        return true;
      }
      note.w = cfg.defaultW;
      note.h = cfg.defaultH;
      clampQuickNoteGeometry(note);
      note.updatedAt = new Date().toISOString();
      return true;
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
        textColor: '#151515',
        title: 'Note',
        text: 'New note',
        html: quickNoteTextToHtml('New note'),
        links: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      saveState();
      renderApp();
    }

    function renderQuickNotes() {
      const cfg = BP_USER_CONFIG.quickNotes;
      repairQuickNotesLayout();
      return `
        <section class="bp-panel">
          <div class="bp-panel-header bp-qn-header">
            <div>
              <h2>Quick Notes</h2>
            </div>
            <div class="bp-qn-actions" aria-label="Quick Notes board actions">
              <button type="button" id="bpRepairQuickNotes" title="Recover small/offscreen notes without deleting content">Repair Layout</button>
              <button type="button" id="bpExportQuickNotes" title="Export only the Quick Notes board">Export Board</button>
              <button type="button" id="bpImportQuickNotesBtn" title="Import a Quick Notes board JSON file">Import Board</button>
              <input id="bpQuickNotesImportFile" class="bp-hidden" type="file" accept="application/json,.json" />
            </div>
          </div>
          <div class="bp-qn-shell">
            <div id="bpQuickBoard" class="bp-qn-board" style="--bp-qn-cols:${cfg.columns};--bp-qn-rows:${cfg.rows};">
              ${appState.quickNotes.notes.map(renderQuickNote).join('')}
            </div>
            ${renderQuickNoteLinksInspector()}
            <button type="button" id="bpAddQuickNote" class="bp-qn-add" aria-label="Add quick note">+</button>
            <div class="bp-qn-help-footer">
              <span>${cfg.columns}×${cfg.rows} grid</span>
              <span>•</span>
              <span>${cfg.cell}px base</span>
              <span>•</span>
              <span>Move: bottom chrome</span>
              <span>•</span>
              <span>Title: header text</span>
              <span>•</span>
              <span>Text color: T</span>
              <span>•</span>
              <span>Edit: body</span>
              <span>•</span>
              <span>Resize: ↘</span>
              <span>•</span>
              <span>Links: 🔗 opens board inspector</span>
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
      const titleIndentCells = Math.max(0, Number(BP_USER_CONFIG.quickNotes.maxOverlapCells || 0));
      const titleIndent = titleIndentCells ? `calc((100% / ${Math.max(1, Number(note.w || cfg.defaultW))}) * ${titleIndentCells})` : '0px';
      const links = normalizeQuickNoteLinks(note.links || []);
      const linksOpen = appState.quickNotes.openLinksNoteId === note.id;
      return `
        <article class="bp-qn-note${linksOpen ? ' bp-qn-note-links-selected' : ''}" data-note-id="${note.id}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%;z-index:${note.z};background:${escapeHTML(note.color)};color:${escapeHTML(note.textColor || '#151515')};--bp-qn-title-indent:${titleIndent};">
          <div class="bp-qn-note-header">
            <input class="bp-qn-title" data-qn-title="${note.id}" value="${escapeHTML(note.title || 'Note')}" aria-label="Quick note title" title="Edit note title" />
            <button type="button" class="bp-qn-mini-button bp-qn-links" data-qn-links-toggle="${note.id}" title="Saved links (${links.length})" aria-label="Saved links">🔗${links.length ? `<span>${links.length}</span>` : ''}</button>
          </div>
          <div class="bp-qn-note-body" contenteditable="true" spellcheck="true" data-qn-body="${note.id}">${renderQuickNoteBody(note)}</div>
          <div class="bp-qn-note-footer">
            <label class="bp-qn-color-field" title="Note background color">
              <input type="color" data-qn-color="${note.id}" value="${escapeHTML(note.color)}" aria-label="Note background color" />
            </label>
            <label class="bp-qn-color-field" title="Note text color">
              <input type="color" data-qn-text-color="${note.id}" value="${escapeHTML(note.textColor || '#151515')}" aria-label="Note text color" />
            </label>
            <span class="bp-qn-drag-zone" data-qn-drag="${note.id}" title="Drag note from empty bottom chrome" aria-label="Drag note from empty bottom chrome"></span>
            <span class="bp-qn-resize" data-qn-resize="${note.id}" aria-label="Resize note" title="Resize note">↘</span>
            <button type="button" class="bp-qn-mini-button bp-qn-delete" data-qn-delete="${note.id}" title="Delete note" aria-label="Delete note">×</button>
          </div>
        </article>
      `;
    }

    function exportQuickNotes() {
      const payload = {
        exportedAt: new Date().toISOString(),
        app: "The Backpack",
        type: "quickNotes",
        version: BP_USER_CONFIG.appVersion,
        quickNotes: appState.quickNotes
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backpack-quick-notes-${toDateKey(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Quick Notes board exported.");
    }

    function normalizeQuickNotesBoard(board) {
      const safeBoard = deepMergeDefaults(defaultState.quickNotes, board || {});
      safeBoard.notes = Array.isArray(safeBoard.notes) ? safeBoard.notes.map((note, index) => {
        const rawHtml = note.html ? sanitizeQuickNoteHTML(note.html) : quickNoteTextToHtml(note.text || '');
        const extractedLinks = [
          ...(Array.isArray(note.links) ? note.links : []),
          ...extractQuickNoteLinksFromHTML(rawHtml),
          ...extractQuickNoteLinksFromText(note.text || '')
        ];
        const normalized = {
          id: note.id || uid('qn'),
          col: Number.isFinite(Number(note.col)) ? Number(note.col) : 0,
          row: Number.isFinite(Number(note.row)) ? Number(note.row) : index,
          w: Number.isFinite(Number(note.w)) ? Number(note.w) : BP_USER_CONFIG.quickNotes.defaultW,
          h: Number.isFinite(Number(note.h)) ? Number(note.h) : BP_USER_CONFIG.quickNotes.defaultH,
          z: Number.isFinite(Number(note.z)) ? Number(note.z) : index + 1,
          color: note.color || quickNoteColors[index % quickNoteColors.length],
          textColor: note.textColor || '#151515',
          title: String(note.title || 'Note'),
          text: String(note.text || quickNoteTextFromHtml(rawHtml) || ''),
          html: rawHtml,
          links: normalizeQuickNoteLinks(extractedLinks),
          createdAt: note.createdAt || new Date().toISOString(),
          updatedAt: note.updatedAt || new Date().toISOString()
        };
        clampQuickNoteGeometry(normalized);
        return normalized;
      }) : [];
      safeBoard.nextZ = Math.max(
        Number(safeBoard.nextZ || 1),
        1,
        ...safeBoard.notes.map(note => Number(note.z || 1))
      );
      if (!safeBoard.notes.some(note => note.id === safeBoard.openLinksNoteId)) safeBoard.openLinksNoteId = '';
      return safeBoard;
    }

    async function importQuickNotesFile(file) {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const incoming = parsed.quickNotes || parsed.state?.quickNotes || parsed;
        if (!incoming || !Array.isArray(incoming.notes)) throw new Error("Invalid Quick Notes board.");
        if (!confirm("Import this Quick Notes board and replace the current board?")) return;
        appState.quickNotes = normalizeQuickNotesBoard(incoming);
        saveState();
        renderApp();
        showToast("Quick Notes board imported.");
      } catch (error) {
        console.error(error);
        showToast("Could not import that Quick Notes file.");
      }
    }

    function bindQuickNotes() {
      $('#bpAddQuickNote')?.addEventListener('click', addQuickNote);
      $('#bpRepairQuickNotes')?.addEventListener('click', () => {
        commitQuickNoteBodies({ extractLinks: true });
        const changed = repairQuickNotesLayout();
        saveState();
        renderApp();
        showToast(changed ? 'Quick Notes layout repaired.' : 'Quick Notes layout already looked safe.');
      });
      $('#bpExportQuickNotes')?.addEventListener('click', exportQuickNotes);
      $('#bpImportQuickNotesBtn')?.addEventListener('click', () => $('#bpQuickNotesImportFile')?.click());
      $('#bpQuickNotesImportFile')?.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (file) importQuickNotesFile(file);
        event.target.value = '';
      });
      $$('[data-qn-title]').forEach(input => {
        input.addEventListener('pointerdown', event => event.stopPropagation());
        input.addEventListener('click', event => event.stopPropagation());
        input.addEventListener('keydown', event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            input.blur();
          }
        });
        input.addEventListener('blur', () => {
          const note = appState.quickNotes.notes.find(item => item.id === input.dataset.qnTitle);
          if (!note) return;
          note.title = input.value.trim() || 'Note';
          note.updatedAt = new Date().toISOString();
          saveState();
        });
      });
      $$('[data-qn-delete]').forEach(button => {
        button.addEventListener('click', () => {
          if (!confirm('Delete this note?')) return;
          if (appState.quickNotes.openLinksNoteId === button.dataset.qnDelete) appState.quickNotes.openLinksNoteId = '';
          appState.quickNotes.notes = appState.quickNotes.notes.filter(note => note.id !== button.dataset.qnDelete);
          saveState();
          renderApp();
        });
      });
      $$('[data-qn-links-toggle]').forEach(button => {
        button.addEventListener('click', event => {
          event.stopPropagation();
          commitQuickNoteBodies({ extractLinks: true });
          const noteId = button.dataset.qnLinksToggle;
          appState.quickNotes.openLinksNoteId = appState.quickNotes.openLinksNoteId === noteId ? '' : noteId;
          saveState();
          renderApp();
        });
      });
      $$('[data-qn-links-close]').forEach(button => {
        button.addEventListener('click', event => {
          event.stopPropagation();
          appState.quickNotes.openLinksNoteId = '';
          saveState();
          renderApp();
        });
      });
      $$('[data-qn-reset-size]').forEach(button => {
        button.addEventListener('click', event => {
          event.stopPropagation();
          if (resetQuickNoteSize(button.dataset.qnResetSize)) {
            saveState();
            renderApp();
            showToast('Quick Note size reset.');
          }
        });
      });
      $$('[data-qn-link-delete]').forEach(button => {
        button.addEventListener('click', event => {
          event.stopPropagation();
          const note = appState.quickNotes.notes.find(item => item.id === button.dataset.qnLinkDelete);
          if (!note) return;
          note.links = normalizeQuickNoteLinks(note.links || []).filter(link => link.id !== button.dataset.qnLinkId);
          note.updatedAt = new Date().toISOString();
          saveState();
          renderApp();
        });
      });
      $$('[data-qn-color]').forEach(input => {
        input.addEventListener('pointerdown', event => event.stopPropagation());
        input.addEventListener('input', () => {
          const note = appState.quickNotes.notes.find(item => item.id === input.dataset.qnColor);
          if (!note) return;
          note.color = input.value;
          note.updatedAt = new Date().toISOString();
          saveState();
          renderQuickNotesSoft();
        });
      });
      $$('[data-qn-text-color]').forEach(input => {
        input.addEventListener('pointerdown', event => event.stopPropagation());
        input.addEventListener('input', () => {
          const note = appState.quickNotes.notes.find(item => item.id === input.dataset.qnTextColor);
          if (!note) return;
          note.textColor = input.value;
          note.updatedAt = new Date().toISOString();
          saveState();
          renderQuickNotesSoft();
        });
      });
      $$('[data-qn-body]').forEach(body => {
        body.addEventListener('pointerdown', event => event.stopPropagation());
        body.addEventListener('click', event => event.stopPropagation());
        body.addEventListener('input', () => {
          const note = appState.quickNotes.notes.find(item => item.id === body.dataset.qnBody);
          if (!note) return;
          const changed = persistQuickNoteBodyFromElement(note, body, { extractLinks: true, writeBack: false });
          if (changed) saveState();
        });
        body.addEventListener('paste', event => {
          const note = appState.quickNotes.notes.find(item => item.id === body.dataset.qnBody);
          if (!note) return;
          const clipboard = event.clipboardData;
          const html = clipboard?.getData('text/html') || '';
          const text = clipboard?.getData('text/plain') || '';
          const links = [
            ...extractQuickNoteLinksFromHTML(html),
            ...extractQuickNoteLinksFromText(text)
          ];
          const insertHtml = html ? sanitizeQuickNoteHTML(html) : quickNoteTextToHtml(text);
          if (insertHtml) {
            event.preventDefault();
            insertQuickNoteHtmlAtCursor(insertHtml);
          }
          const hadNewLinks = addQuickNoteLinks(note, links);
          persistQuickNoteBodyFromElement(note, body, { extractLinks: true, writeBack: false });
          saveState();
          if (hadNewLinks) showToast('Link saved to note.');
        });
        body.addEventListener('blur', () => {
          const note = appState.quickNotes.notes.find(item => item.id === body.dataset.qnBody);
          if (!note) return;
          const changed = persistQuickNoteBodyFromElement(note, body, { extractLinks: true, writeBack: true });
          if (changed) saveState();
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
        if (el) {
          el.style.background = note.color;
          el.style.color = note.textColor || '#151515';
        }
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
      appState.bees.markdown = beesMarkdownFallback;
      appState.bees.quoteHtml = beesQuoteFallback;
      appState.bees.markdownSource = `Bundled demo ${BP_USER_CONFIG.contentLabels.basicMarkdown}; upload to replace`;
      appState.bees.quoteSource = `Bundled demo ${BP_USER_CONFIG.contentLabels.basicHtml}; upload to replace`;
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
              <p>Newton’s second law is a useful basic-template topic because it uses one readable article, one highlighted formula block, and one reusable copy example. Source files are uploaded, not checked from nearby folders.</p>
              <p>Current project placeholder: <strong>${escapeHTML(parsePlaceholders('{{PROJECT_NAME}}'))}</strong>.</p>
            </div>
            <div class="bp-window-footer">
              <label>Upload ${BP_USER_CONFIG.contentLabels.basicMarkdown} <input id="bpBeesMarkdownFile" type="file" accept=".md,.markdown,text/markdown,text/plain" /></label>
              <label>Upload ${BP_USER_CONFIG.contentLabels.basicHtml} <input id="bpBeesQuoteFile" type="file" accept=".html,text/html,text/plain" /></label>
              <button type="button" id="bpReloadBees" class="bp-demo-button">↻ Load bundled demo</button>
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
     * Wiki Bees tab: three-column, upload-first wiki stress test
     ***************************************************************************/
    const wikiBeePages = [
      {
            "id": "index",
            "nav": "Wiki Index",
            "group": "meta",
            "title": "Wiki Index",
            "description": "A compact entry page for the medium template. It tests long-form navigation, multiple Markdown fragments, a right-side infobox, and upload-first wiki authoring without a local server.",
            "image": {
                  "key": "hive",
                  "src": "content/images/bee_hive.svg",
                  "alt": "Stylized hive reference",
                  "caption": "The wiki index uses the hive image as a map symbol: many small files, one organized structure."
            },
            "sidecar": {
                  "sourceId": "side_index",
                  "fileName": "index__side_note.md",
                  "title": "Index side note",
                  "fallback": "**Status:** bundled demo content.\n\nThis right column is intentionally shorter than the article column. It behaves like a wiki infobox: one image, a short context note, and a source line. Upload a replacement side-note Markdown file for the selected page to test how the component handles custom metadata."
            },
            "sections": [
                  {
                        "sourceId": "index_orientation",
                        "fileName": "index__orientation.md",
                        "title": "How to read this wiki",
                        "fallback": "This page is a stress test for Template - Medium. The left column behaves as a cascade index; the center column renders the selected page as a title, description, and a sequence of Markdown fragments; the right column keeps a stable visual reference and a short secondary note. That structure is closer to a small wiki than a single article because each subtitle can be maintained as its own file.\n\nThe current build does not try to fetch neighboring files. Instead, it ships with bundled demo text and lets the user upload Markdown files into the running page. That means the same HTML can be opened directly from disk, backed up as state, and moved without assuming a server. The tradeoff is that a large wiki needs a clear naming convention so uploaded files can be mapped to their intended slots.\n\nThe file names shown in the source strips are intentionally verbose. They make testing easier: a writer can export or edit the fragments separately, then select several files at once using the bundle upload control."
                  },
                  {
                        "sourceId": "index_structure",
                        "fileName": "index__structure.md",
                        "title": "Page structure under stress",
                        "fallback": "A medium template becomes maintainable when the data model does most of the work. Instead of writing a new renderer for every article, each page record declares a navigation label, a title, a description, a list of section files, one side-note file, and one image slot. The renderer then loops through those records.\n\nThis makes the wiki expandable in a controlled way. Adding a page should mean adding one configuration object and several Markdown files, not opening the tab binder, adding new switch cases, and copying markup by hand. It also makes future promotion possible: a wiki section, image card, or source panel could be promoted to a persistent shelf just like the Event Gantt.\n\nFor readability, the main text column should remain calm. It should not be filled with authoring controls. Controls belong in Column A and Column C, while Column B is treated as the reading surface."
                  }
            ]
      },
      {
            "id": "overview",
            "nav": "Template Overview",
            "group": "meta",
            "title": "Template Overview",
            "description": "A maintenance-focused explanation of how Template - Medium should behave as it moves from a demo page toward a reusable wiki pattern.",
            "image": {
                  "key": "worker",
                  "src": "content/images/bee_worker.svg",
                  "alt": "Worker bee reference",
                  "caption": "The worker bee image represents a reusable unit: one small component doing a clear job inside a larger system."
            },
            "sidecar": {
                  "sourceId": "side_overview",
                  "fileName": "template_overview__side_note.md",
                  "title": "Template note",
                  "fallback": "**Pattern:** page registry + Markdown bundle + infobox.\n\nA healthy medium template should be boring to extend. New content should mostly be data; visual behavior should stay centralized."
            },
            "sections": [
                  {
                        "sourceId": "overview_registry",
                        "fileName": "template_overview__registry_model.md",
                        "title": "The registry model",
                        "fallback": "The wiki is now best understood as a registry-driven page family. A registry entry tells Backpack what to show in each column: the navigation label, the page header, the Markdown fragments, the infobox image, and the side Markdown file. The tab does not need to know whether it is showing food, language notes, or gallery entries; it only needs to render the active page record.\n\nThis is similar to the tab cleanup already done in Backpack. Tabs became easier to expand when rendering and binding were attached to one registry object. The same idea works inside a template: each wiki page should register its content, not demand new branches in the renderer.\n\nThe page registry also gives us a place to define upload conventions. A writer can upload a group of files, and Backpack can map each file to a section by filename instead of making the user select every slot manually."
                  },
                  {
                        "sourceId": "overview_columns",
                        "fileName": "template_overview__three_columns.md",
                        "title": "Why three columns help",
                        "fallback": "Column A is navigation and authoring control. It should remain compact, predictable, and tolerant of growth. Cascade navigation works here because it provides structure without depending on color alone: the separator and selected marker still communicate state in monochrome displays.\n\nColumn B is the primary reading surface. It carries the title, page description, and subtitle-based Markdown fragments. This prevents a long page from becoming one unbroken document, while still letting the reader scroll naturally through the selected subject.\n\nColumn C is an infobox. It contains a top image and a smaller Markdown note. That makes it useful for definitions, source notes, warnings, or small metadata without interrupting the main article."
                  },
                  {
                        "sourceId": "overview_uploads",
                        "fileName": "template_overview__upload_workflow.md",
                        "title": "Upload-first workflow",
                        "fallback": "Because Backpack is designed to run without a local server, the wiki cannot rely on automatic local file checks. The safe path is to keep bundled demo content in the app, then let users upload Markdown and images when they want to replace it. Uploaded content can be saved in Backpack state and exported as JSON.\n\nFor a small wiki, manual upload buttons are enough. For a larger wiki, a bundle upload is more practical. The bundle control reads multiple Markdown files, matches known filenames, and updates only the recognized slots. Unknown files are ignored instead of guessing, because accidental overwrites are worse than a skipped import.\n\nThis gives us a realistic authoring loop: write Markdown files outside the app, open the HTML directly, upload the bundle, inspect the rendered result, export state if the page should travel as a portable snapshot."
                  }
            ]
      },
      {
            "id": "about",
            "nav": "About Bees",
            "group": "article",
            "title": "About Bees",
            "description": "A grounded introduction to bees as insects: diverse pollinators, not just honey makers, with many body forms and life histories.",
            "image": {
                  "key": "flower",
                  "src": "content/images/bee_flower.svg",
                  "alt": "Bee visiting a flower",
                  "caption": "Bees and flowering plants are linked through repeated visits: nectar and pollen for the bee, pollen transfer for the plant."
            },
            "sidecar": {
                  "sourceId": "side_about",
                  "fileName": "about_bees__side_note.md",
                  "title": "About side note",
                  "fallback": "**Quick distinction:** honey bees are only one kind of bee.\n\nMany bees are solitary, many do not make honey, and many are easy to overlook because they are tiny, dark, or active only during particular seasons."
            },
            "sections": [
                  {
                        "sourceId": "about_animal",
                        "fileName": "about_bees__what_a_bee_is.md",
                        "title": "What a bee is",
                        "fallback": "Bees are insects in the order Hymenoptera, the broader group that also includes ants and wasps. They have three main body regions: head, thorax, and abdomen. Their antennae help them sense chemicals, air movement, and touch; their compound eyes help them navigate flowers and light; their legs often carry specialized hairs or structures that move pollen.\n\nA common mistake is to define bees by honey. Honey bees do produce honey, but most bee species do not live in large managed hives and do not make harvestable honey stores. The more useful definition is ecological: bees are flower-visiting insects whose life cycles are closely tied to pollen and nectar.\n\nThat link to flowers explains why bees matter far beyond the hive. A bee is not only an animal; it is also a small moving bridge between plants, landscapes, farms, gardens, and food systems."
                  },
                  {
                        "sourceId": "about_diversity",
                        "fileName": "about_bees__diversity.md",
                        "title": "Diversity beyond the honey bee",
                        "fallback": "There are more than twenty thousand known bee species in the world. They range from very small solitary bees that can be mistaken for flies to large carpenter bees and fuzzy bumble bees. Their colors are not limited to yellow and black: some are metallic green or blue, some are coppery, and many are plain brown or black.\n\nDiversity also appears in nesting behavior. Some bees nest in soil, others use hollow stems, old beetle tunnels, wood, or cavities. Some are generalists that visit many kinds of flowers, while others are specialists that gather pollen from a narrower range of plants.\n\nThat variety matters for a wiki. A bee page that only shows honey bees can accidentally teach the wrong mental model. A better article introduces honey bees as important, then immediately opens the door to solitary bees, bumble bees, mason bees, leafcutter bees, sweat bees, carpenter bees, and many others."
                  },
                  {
                        "sourceId": "about_pollination",
                        "fileName": "about_bees__pollination_basics.md",
                        "title": "Pollination basics",
                        "fallback": "Pollination is the movement of pollen from the male parts of a flower to the female parts of a flower. Some plants use wind, water, or self-pollination, but many flowering plants benefit from animal visitors. Bees are especially effective because pollen is not an accident in their lives; they actively gather it as food for their young.\n\nWhen a bee visits a flower, grains of pollen can stick to the hairs on its body. As the bee moves to another flower, some of that pollen may rub off in the right place. The plant may then form fruit or seed, while the bee receives nectar, pollen, or both.\n\nThe relationship is not always simple or equal. Different plants need different visitors, and not every bee is effective on every flower. That complexity is why a healthy landscape usually needs many pollinator species, not just one managed species doing all the work."
                  }
            ]
      },
      {
            "id": "languages",
            "nav": "Bee: The word in other languages",
            "group": "article",
            "title": "Bee: The word in other languages",
            "description": "A language page for testing tables, pronunciation notes, and short comparative paragraphs inside the Markdown renderer.",
            "image": {
                  "key": "worker",
                  "src": "content/images/bee_worker.svg",
                  "alt": "Worker bee language reference",
                  "caption": "The word changes across languages, but the small familiar insect remains easy to recognize."
            },
            "sidecar": {
                  "sourceId": "side_languages",
                  "fileName": "bee_languages__side_note.md",
                  "title": "Language side note",
                  "fallback": "**Translation note:** animal names often carry folk memory.\n\nSome languages distinguish honey bees, wild bees, wasps, or stinging insects more sharply than casual English does."
            },
            "sections": [
                  {
                        "sourceId": "languages_romance",
                        "fileName": "bee_languages__romance_and_germanic.md",
                        "title": "Romance and Germanic roots",
                        "fallback": "Across several Romance languages, the word for bee is close but not identical: Spanish uses **abeja**, French uses **abeille**, Italian uses **ape**, and Portuguese uses **abelha**. The changes are a good reminder that recognizable word families still branch into local sound patterns.\n\nGermanic languages offer another cluster: German **Biene**, Dutch **bij**, Swedish **bi**, and Danish **bi**. English **bee** sits comfortably in that group. These short words are useful in a compact wiki because they create a clear table-like rhythm even with a simple Markdown renderer.\n\nA future richer Markdown layer could render this as a true table. For now, short bold terms and bullet lists provide enough structure to test reading density without adding a new parser dependency."
                  },
                  {
                        "sourceId": "languages_world",
                        "fileName": "bee_languages__world_examples.md",
                        "title": "Examples from other language families",
                        "fallback": "Outside Europe, the words vary more sharply. Arabic commonly uses **نحلة** (*naḥla*) for bee. Hebrew uses **דבורה** (*devorah*). Japanese uses **蜂** (*hachi*), while Chinese often uses **蜜蜂** (*mìfēng*) for honey bee. Swahili uses **nyuki**.\n\nThese examples should be treated as entry points rather than a complete linguistic survey. Some words refer broadly to bees, while others are more specifically tied to honey bees or stinging insects depending on context. A careful wiki would eventually separate everyday vocabulary from scientific names and local ecological terms.\n\nThe page is still useful as a UI test. It stresses bold text, italics, non-Latin scripts, parenthetical pronunciation notes, and short paragraphs that can become visually noisy if the column is too narrow."
                  },
                  {
                        "sourceId": "languages_science",
                        "fileName": "bee_languages__scientific_names.md",
                        "title": "Scientific naming as a second language",
                        "fallback": "Scientific names give the wiki a different kind of language. The western honey bee is **Apis mellifera**. Bumble bees belong to the genus **Bombus**. Leafcutter and mason bees are often discussed within **Megachilidae**, while many sweat bees belong to **Halictidae**.\n\nThese names are not decorative. They help avoid confusion when common names shift across regions. A common name can describe behavior, appearance, habitat, or a local tradition; a scientific name points to a taxonomic relationship.\n\nFor Backpack, scientific names are also a good formatting test. The renderer needs to support italics and inline code-like terms cleanly because wiki pages often mix natural language, labels, lists, and short technical references."
                  }
            ]
      },
      {
            "id": "social",
            "nav": "Bees being Social",
            "group": "article",
            "title": "Bees being Social",
            "description": "A page about cooperation, caste systems, communication, and the important limit: most bees are not honey-bee-style hive insects.",
            "image": {
                  "key": "hive",
                  "src": "content/images/bee_hive.svg",
                  "alt": "Hive social structure",
                  "caption": "The hive image fits social bees, but the article keeps reminding readers that many bees live differently."
            },
            "sidecar": {
                  "sourceId": "side_social",
                  "fileName": "bees_social__side_note.md",
                  "title": "Social side note",
                  "fallback": "**Important limit:** social bees are memorable, but solitary bees are common.\n\nThe wiki should not let the honey bee become the template for all bees."
            },
            "sections": [
                  {
                        "sourceId": "social_colony",
                        "fileName": "bees_social__colony_roles.md",
                        "title": "Colony roles",
                        "fallback": "In honey bee colonies, social life is organized around a queen, workers, and drones. The queen lays eggs, workers perform many colony tasks, and drones are male bees involved in reproduction. Workers may clean cells, feed larvae, build comb, process nectar, guard the entrance, or forage depending on age and colony need.\n\nThis division of labor is one reason honey bees are so fascinating to humans. A hive looks like a single organism made of many bodies: food collection, temperature regulation, brood care, defense, and communication all happen through coordinated behavior.\n\nBut the same fascination can distort the larger story. Honey bees are social specialists, not the default form of bee life. A good wiki page should use them to explain social complexity while still leaving room for bumble bees, communal nesters, and solitary species."
                  },
                  {
                        "sourceId": "social_communication",
                        "fileName": "bees_social__communication.md",
                        "title": "Communication and the waggle dance",
                        "fallback": "Honey bees are famous for the waggle dance, a behavior used by returning foragers to communicate information about valuable resources. The dance is not a cute extra; it is part of how a colony can direct attention toward flowers, water, or nesting information.\n\nThe dance also shows why social behavior is more than crowding many insects together. A colony needs information flow. Foragers must share resource cues, receivers must interpret them, and the colony must adjust as flowers open, weather changes, or competition appears.\n\nFor a wiki stress test, this topic is useful because it contains several layers: behavior, communication, learning, and ecology. The page needs enough room for explanation without becoming a dense block of undifferentiated text."
                  },
                  {
                        "sourceId": "social_solitary",
                        "fileName": "bees_social__solitary_counterpoint.md",
                        "title": "The solitary counterpoint",
                        "fallback": "Most bee species are solitary or do not live in honey-bee-style colonies. In many solitary species, each female builds or finds a nest, provisions it with pollen and nectar, lays eggs, and leaves the next generation to develop. There is no queen-worker division in the familiar hive sense.\n\nSolitary does not mean simple or unimportant. Some solitary bees are excellent pollinators, and many have close relationships with particular habitats or plant groups. Their lives are often less visible because they do not gather in large, conspicuous colonies.\n\nThe social page therefore needs a counterpoint section. It should teach that sociality is a spectrum, not a binary, and that human attention often follows the biggest, loudest, or most economically managed species."
                  }
            ]
      },
      {
            "id": "food",
            "nav": "Bees relevance on people's food",
            "group": "article",
            "title": "Bees relevance on people's food",
            "description": "A longer test page about foods and products linked to bee pollination, built from three separate Markdown fragments as requested.",
            "image": {
                  "key": "food",
                  "src": "content/images/bee_food.svg",
                  "alt": "Bee pollination and food basket",
                  "caption": "Bees are easiest to notice at flowers, but the result often appears later as fruits, seeds, nuts, oils, and animal feed."
            },
            "sidecar": {
                  "sourceId": "side_food",
                  "fileName": "bees_food__side_note.md",
                  "title": "Food side note",
                  "fallback": "**Useful framing:** bees do not create every food.\n\nGrains such as wheat, rice, and corn are mostly wind-pollinated. The bee connection is strongest in many fruits, nuts, vegetables, oilseeds, spices, and forage crops."
            },
            "sections": [
                  {
                        "sourceId": "food_direct",
                        "fileName": "bees_food__foods_directly_impacted.md",
                        "title": "Foods directly impacted from bees",
                        "fallback": "Many familiar foods become easier to understand when seen through pollination. Apples, cherries, blueberries, melons, cucumbers, squash, pumpkins, almonds, and many seed crops depend on or benefit from animal pollinators. Bees are often central because they repeatedly visit flowers while collecting pollen and nectar.\n\nThe word **depend** needs care. Some crops require insect pollination to set a good crop; others can produce without bees but may produce larger, more uniform, or more numerous fruits when pollination improves. That makes bee relevance a gradient rather than an on-off switch.\n\nIn practical food systems, managed honey bees are moved to many crops, while wild bees and other pollinators also contribute. A wiki should show both sides: the agricultural logistics of managed colonies and the ecological value of diverse local pollinator communities."
                  },
                  {
                        "sourceId": "food_hidden",
                        "fileName": "bees_food__foods_you_didnt_know.md",
                        "title": "Foods you didn't know exist thanks to bees' work",
                        "fallback": "Some bee-linked foods are obvious because they are fruits or nuts. Others are less visible. Oilseed crops, seed production for vegetables, spices, and forage plants can all be connected to pollination. Alfalfa, for example, is a forage crop used to feed livestock; pollination affects seed production, which indirectly supports dairy and meat systems.\n\nThere are also foods where the bee connection appears at the ingredient level. A dessert may contain almonds, berries, pumpkin, or a spice whose production benefited from pollinators. A salad may include cucumbers, squash, or seed-grown vegetables. The bee is not in the recipe, but the flower visit happened earlier in the chain.\n\nThis is why simplified claims such as one exact fraction of all food can be misleading if used without context. The stronger lesson is that pollinators support a large share of crop diversity, especially the colorful, nutritious, high-value foods people associate with varied diets."
                  },
                  {
                        "sourceId": "food_products",
                        "fileName": "bees_food__other_foods_and_products.md",
                        "title": "Other foods and products we thank bees for",
                        "fallback": "Bees are also linked to products that are not simply fresh fruit on a plate. Honey is the obvious example, but beeswax appears in candles, cosmetics, polishes, art materials, and traditional preparations. Propolis and royal jelly are marketed in some contexts, though a careful wiki should distinguish cultural use from medical claims.\n\nPollination also supports seed production, breeding, and farm resilience. If growers want seed for the next crop, pollination can matter even when the edible part is not the fruit. This is especially relevant for gardeners and small farms that save seed or depend on local plant reproduction.\n\nThe point is not to romanticize bees as magical food makers. It is to show that their work is distributed across systems. A bee visit may become a fruit, a seed packet, a forage crop, a jar of honey, a block of wax, or simply a healthier patch of flowering habitat."
                  }
            ]
      },
      {
            "id": "gallery",
            "nav": "Gallery of Interesting Bees",
            "group": "article",
            "title": "Gallery of Interesting Bees",
            "description": "A gallery-style article for testing repeated cards, short species notes, and image-heavy sidebar behavior without requiring a full image gallery component yet.",
            "image": {
                  "key": "gallery",
                  "src": "content/images/bee_gallery.svg",
                  "alt": "Gallery of stylized bees",
                  "caption": "A single image holder can preview the visual language before a real gallery component exists."
            },
            "sidecar": {
                  "sourceId": "side_gallery",
                  "fileName": "interesting_bees__side_note.md",
                  "title": "Gallery side note",
                  "fallback": "**Future upgrade:** this page is a candidate for promotion.\n\nA gallery strip could eventually be pinned above the tab workspace, letting the reader switch articles while keeping bee cards visible."
            },
            "sections": [
                  {
                        "sourceId": "gallery_honey_bumble",
                        "fileName": "interesting_bees__honey_and_bumble.md",
                        "title": "Honey bees and bumble bees",
                        "fallback": "Honey bees are the best-known managed bees. They live in large perennial colonies, store honey, build wax comb, and are transported for pollination in many agricultural systems. Their familiarity makes them useful for teaching, but it also means they can overshadow other bees.\n\nBumble bees are also social, but their colonies are usually smaller and seasonal. They are fuzzy, strong fliers, and effective at visiting some flowers that benefit from vibration or buzz pollination. Their body shape and behavior make them easy to distinguish from the leaner image many people associate with honey bees.\n\nPutting honey bees and bumble bees together in the gallery helps readers see social diversity. Both can live cooperatively, but they do not organize their colonies in exactly the same way."
                  },
                  {
                        "sourceId": "gallery_mason_leafcutter",
                        "fileName": "interesting_bees__mason_and_leafcutter.md",
                        "title": "Mason bees and leafcutter bees",
                        "fallback": "Mason bees are solitary bees often associated with nesting in cavities. They use mud or similar materials to partition nest cells. Gardeners sometimes notice them because they will use suitable holes or nesting blocks when habitat is available.\n\nLeafcutter bees are also solitary and are known for cutting neat pieces from leaves to line their nests. The leaf circles can look like damage, but they are often a sign of nesting activity rather than a serious plant problem.\n\nThese bees are valuable gallery subjects because their behaviors are visual. A wiki can eventually pair short text with nest diagrams, leaf-cut patterns, and cavity cross-sections."
                  },
                  {
                        "sourceId": "gallery_orchid_sweat",
                        "fileName": "interesting_bees__orchid_and_sweat.md",
                        "title": "Orchid bees, sweat bees, and cuckoo bees",
                        "fallback": "Orchid bees are famous for vivid metallic colors and specialized fragrance-gathering behavior in some groups. They make an excellent reminder that bees can be visually surprising, not just striped yellow insects.\n\nSweat bees are a diverse group that may be small, metallic, or easily overlooked. Some are attracted to perspiration, which gives the group its common name. Their variety makes them useful for explaining why common names are rough handles, not complete biological descriptions.\n\nCuckoo bees add a stranger story. Some lay eggs in the nests of other bees instead of provisioning their own nest cells. Including them prevents the gallery from becoming only a list of charming pollinators; bee life also includes competition, parasitism, and ecological complexity."
                  }
            ]
      },
      {
            "id": "links",
            "nav": "Links",
            "group": "article",
            "title": "Links",
            "description": "A compact source and reading list page. It tests external Markdown links and gives the bee demo a factual spine.",
            "image": {
                  "key": "flower",
                  "src": "content/images/bee_flower.svg",
                  "alt": "Bee source links",
                  "caption": "Links are the wiki's pollen trail: they connect a readable page back to stronger references."
            },
            "sidecar": {
                  "sourceId": "side_links",
                  "fileName": "links__side_note.md",
                  "title": "Links side note",
                  "fallback": "**Editorial rule:** source pages should be boring and useful.\n\nPrefer institutional, educational, or primary research links before general trivia pages."
            },
            "sections": [
                  {
                        "sourceId": "links_core",
                        "fileName": "links__core_sources.md",
                        "title": "Core sources used for the demo",
                        "fallback": "- [FAO Global Action on Pollination Services](https://www.fao.org/pollination/en) — good high-level figures on pollinators, crop plants, and crop production volume.\n- [USGS: How many species of native bees are in the United States?](https://www.usgs.gov/faqs/how-many-species-native-bees-are-united-states) — useful for species diversity context.\n- [USDA: Honey Bees](https://www.usda.gov/about-usda/general-information/initiatives-and-highlighted-programs/peoples-garden/importance-pollinators/honey-bees) — concise agricultural framing for honey bee pollination value in the United States.\n\nThese links are included because the demo text makes claims about bee diversity and pollination. The wiki itself should not pretend to be a primary source. It should make the reading path visible."
                  },
                  {
                        "sourceId": "links_further",
                        "fileName": "links__further_reading.md",
                        "title": "Further reading",
                        "fallback": "- [Xerces Society: Wild Bee Conservation](https://www.xerces.org/endangered-species/wild-bees) — accessible conservation framing, especially for wild and native bees.\n- [Britannica: Bee](https://www.britannica.com/animal/bee) — broad reference article with useful distinctions between solitary and social bees.\n- [UC San Diego Today: bee waggle dance learning](https://today.ucsd.edu/story/complex-learned-social-behavior-discovered-in-bees-waggle-dance) — readable article on social learning and the waggle dance.\n\nA future Backpack wiki might support citations as first-class metadata. For now, a dedicated links page keeps the reading column clean while still making references discoverable."
                  }
            ]
      }
];

    const wikiBeeFileIndex = new Map();
    wikiBeePages.forEach(page => {
      page.sections.forEach(section => {
        wikiBeeFileIndex.set(normalizeWikiFileName(section.fileName), {
          sourceId: section.sourceId,
          label: `${page.title} / ${section.title}`,
          type: 'section'
        });
      });
      wikiBeeFileIndex.set(normalizeWikiFileName(page.sidecar.fileName), {
        sourceId: page.sidecar.sourceId,
        label: `${page.title} / ${page.sidecar.title}`,
        type: 'sidecar'
      });
    });

    function normalizeWikiFileName(fileName) {
      return String(fileName || '').trim().toLowerCase();
    }

    function getWikiBeePage(pageId = '') {
      const requested = pageId || appState.wikiBees.activePage || appState.wikiBees.activeSection || 'index';
      return wikiBeePages.find(page => page.id === requested) || wikiBeePages[0];
    }

    function getWikiBeeOverride(sourceId) {
      return appState.wikiBees.files?.[sourceId] || null;
    }

    function getWikiBeeMarkdown(sourceId, fallback) {
      return getWikiBeeOverride(sourceId)?.markdown || fallback || '';
    }

    function getWikiBeeSource(sourceId) {
      return getWikiBeeOverride(sourceId)?.source || 'Bundled demo';
    }

    function countWikiBeeUploadedFiles(page) {
      return page.sections.concat([page.sidecar]).filter(item => Boolean(getWikiBeeOverride(item.sourceId))).length;
    }

    async function loadWikiBeeDemo() {
      appState.wikiBees.files = {};
      appState.wikiBees.images = {};
      appState.wikiBees.demoLoaded = true;
      saveState();
      renderApp();
      showToast('Template - Medium reset to bundled wiki demo.');
    }

    function getWikiBeeImageSource(page) {
      return appState.wikiBees.images?.[page.image.key]?.src || page.image.src;
    }

    function getWikiBeeImageStatus(page) {
      return appState.wikiBees.images?.[page.image.key]?.source || 'Bundled image path';
    }

    function readFileAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(String(reader.result || '')));
        reader.addEventListener('error', () => reject(reader.error || new Error('Could not read file.')));
        reader.readAsDataURL(file);
      });
    }

    async function uploadWikiBeeImageForPage(page, file) {
      if (!file) return;
      appState.wikiBees.images ||= {};
      appState.wikiBees.images[page.image.key] = {
        src: await readFileAsDataURL(file),
        source: `Uploaded ${file.name}`
      };
      saveState();
      renderApp();
      showToast(`${page.title} image uploaded.`);
    }

    async function uploadWikiBeeMarkdownToSource(sourceId, file) {
      if (!file || !sourceId) return false;
      appState.wikiBees.files ||= {};
      appState.wikiBees.files[sourceId] = {
        markdown: await file.text(),
        source: `Uploaded ${file.name}`
      };
      return true;
    }

    async function uploadWikiBeeMarkdownBundle(fileList) {
      const files = Array.from(fileList || []);
      let matched = 0;
      const skipped = [];
      for (const file of files) {
        const entry = wikiBeeFileIndex.get(normalizeWikiFileName(file.name));
        if (!entry) {
          skipped.push(file.name);
          continue;
        }
        if (await uploadWikiBeeMarkdownToSource(entry.sourceId, file)) matched += 1;
      }
      saveState();
      renderApp();
      if (matched) {
        showToast(`Imported ${matched} wiki Markdown file${matched === 1 ? '' : 's'}.${skipped.length ? ` Skipped ${skipped.length}.` : ''}`);
      } else {
        showToast('No wiki filenames matched the bundle map.');
      }
    }

    function renderWikiBees() {
      const page = getWikiBeePage();
      const uploadedCount = countWikiBeeUploadedFiles(page);
      const totalFiles = page.sections.length + 1;
      return `
        <section class="bp-panel bp-wiki-panel">
          <div class="bp-panel-header">
            <div>
              <h2>Template - Medium</h2>
              <p>Three-column wiki template: cascade index, Markdown page fragments, and a compact infobox. Uploads replace bundled demo files without requiring a local server.</p>
            </div>
            <div class="bp-row bp-wiki-panel-actions">
              <span class="bp-pill">${uploadedCount}/${totalFiles} page files uploaded</span>
            </div>
          </div>
          <div class="bp-wiki-layout">
            <aside class="bp-card bp-wiki-controls" aria-label="Wiki navigation">
              <div class="bp-wiki-nav-heading">Wiki Index</div>
              <nav class="bp-wiki-nav-list">
                ${wikiBeePages.map((item, index) => `${index === 2 ? '<div class="bp-wiki-nav-divider" aria-hidden="true"></div>' : ''}${renderWikiBeeButton(item)}`).join('')}
              </nav>
              <div class="bp-wiki-authoring">
                <label class="bp-wiki-upload">Upload MD bundle<input id="bpWikiBundleFiles" type="file" multiple accept=".md,.markdown,text/markdown,text/plain" /></label>
                <button type="button" data-wiki-action="demo">Reset demo</button>
                <p class="bp-wiki-help">Bundle upload matches known filenames such as <code>${escapeHTML(page.sections[0]?.fileName || '')}</code>.</p>
              </div>
            </aside>

            <main class="bp-window bp-reading-window bp-wiki-main">
              <div class="bp-window-titlebar">
                <span class="bp-window-control" aria-hidden="true"></span>
                <div class="bp-window-lines">${escapeHTML(page.title)}</div>
                <span class="bp-window-control" aria-hidden="true"></span>
              </div>
              <article class="bp-window-body bp-markdown bp-wiki-article">
                ${renderWikiBeePage(page)}
              </article>
              <div class="bp-window-footer bp-wiki-status">
                <span>${escapeHTML(page.sections.length)} section files</span>
                <span>${escapeHTML(page.sidecar.fileName)}</span>
              </div>
            </main>

            <aside class="bp-wiki-right">
              ${renderWikiBeeAside(page)}
            </aside>
          </div>
        </section>
      `;
    }

    function renderWikiBeeButton(page) {
      const selected = getWikiBeePage().id === page.id;
      const groupClass = page.group === 'meta' ? 'bp-wiki-nav-meta' : 'bp-wiki-nav-article';
      return `<button type="button" class="bp-wiki-nav-button ${groupClass}" data-wiki-page="${escapeHTML(page.id)}" aria-pressed="${selected}"><span class="bp-wiki-nav-marker" aria-hidden="true">${selected ? '▸' : '•'}</span><span>${escapeHTML(page.nav)}</span></button>`;
    }

    function renderWikiBeePage(page) {
      return `
        <header class="bp-wiki-page-header">
          <p class="bp-wiki-eyebrow">Bee Wiki · ${escapeHTML(page.nav)}</p>
          <h1>${escapeHTML(page.title)}</h1>
          <p>${escapeHTML(page.description)}</p>
        </header>
        ${page.sections.map(section => `
          <section class="bp-wiki-md-section">
            <div class="bp-wiki-section-heading">
              <h2>${escapeHTML(section.title)}</h2>
              <span>${escapeHTML(section.fileName)}</span>
            </div>
            ${renderMarkdown(parsePlaceholders(getWikiBeeMarkdown(section.sourceId, section.fallback)))}
            <p class="bp-wiki-source-strip">Source: ${escapeHTML(getWikiBeeSource(section.sourceId))}</p>
          </section>
        `).join('')}
      `;
    }

    function renderWikiBeeAside(page) {
      const sideMarkdown = getWikiBeeMarkdown(page.sidecar.sourceId, page.sidecar.fallback);
      return `
        <div class="bp-window bp-wiki-infobox">
          <div class="bp-window-titlebar">
            <span class="bp-window-control" aria-hidden="true"></span>
            <div class="bp-window-lines">Wiki image</div>
            <span class="bp-window-control" aria-hidden="true"></span>
          </div>
          <div class="bp-window-body bp-wiki-image-body">
            <figure class="bp-wiki-image-figure">
              <img src="${escapeHTML(getWikiBeeImageSource(page))}" alt="${escapeHTML(page.image.alt)}" />
              <figcaption>${escapeHTML(page.image.caption)}</figcaption>
            </figure>
            <p class="bp-wiki-footnote">${escapeHTML(getWikiBeeImageStatus(page))}</p>
            <label class="bp-wiki-upload bp-wiki-upload-small">Upload page image<input id="bpWikiCurrentImageFile" type="file" accept="image/*,.svg" /></label>
          </div>
        </div>

        <div class="bp-card bp-wiki-side-card">
          <h3>${escapeHTML(page.sidecar.title)}</h3>
          <div class="bp-markdown bp-wiki-side-markdown">
            ${renderMarkdown(parsePlaceholders(sideMarkdown))}
          </div>
          <p class="bp-wiki-source-strip">${escapeHTML(page.sidecar.fileName)} · ${escapeHTML(getWikiBeeSource(page.sidecar.sourceId))}</p>
          <label class="bp-wiki-upload bp-wiki-upload-small">Upload side note<input id="bpWikiCurrentSidebarFile" type="file" accept=".md,.markdown,text/markdown,text/plain" /></label>
        </div>
      `;
    }

    function bindWikiBees() {
      $$('[data-wiki-page]').forEach(button => {
        button.addEventListener('click', () => {
          appState.wikiBees.activePage = button.dataset.wikiPage;
          appState.wikiBees.activeSection = button.dataset.wikiPage; // Legacy export compatibility.
          saveState();
          renderApp();
        });
      });
      $('[data-wiki-action="demo"]')?.addEventListener('click', loadWikiBeeDemo);
      $('#bpWikiBundleFiles')?.addEventListener('change', async event => {
        await uploadWikiBeeMarkdownBundle(event.target.files);
        event.target.value = '';
      });
      $('#bpWikiCurrentImageFile')?.addEventListener('change', async event => {
        await uploadWikiBeeImageForPage(getWikiBeePage(), event.target.files?.[0]);
        event.target.value = '';
      });
      $('#bpWikiCurrentSidebarFile')?.addEventListener('change', async event => {
        const page = getWikiBeePage();
        const file = event.target.files?.[0];
        if (await uploadWikiBeeMarkdownToSource(page.sidecar.sourceId, file)) {
          saveState();
          renderApp();
          showToast(`${page.title} side note uploaded.`);
        }
        event.target.value = '';
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
        title: 'Custom Medium Tab Template',
        description: 'A medium custom page pattern with cascade navigation, Markdown fragments, and a wiki infobox.',
        html: `<!--
  CUSTOM WIKI TAB TEMPLATE
  1. Add page records to the wiki registry.
  2. Put long text in separate Markdown fragments.
  3. Map uploads by known filenames instead of local network file checks.
  4. Keep article controls outside the reading column.
  5. Use an infobox for page images and side-note Markdown.
-->
<section class="bp-wiki-layout">
  <aside class="bp-card">Cascade wiki navigation</aside>
  <main class="bp-window bp-reading-window">Title + Markdown fragments</main>
  <aside class="bp-card">Image + side-note Markdown</aside>
</section>`
      },
      {
        title: 'Markdown Section Tab Template',
        description: 'How to add a simple content tab powered by Markdown and placeholders.',
        html: `<!--
  MARKDOWN SECTION TAB
  1. Author a Markdown file, for example: notes.md.
  2. Add a tab registry entry with render and bind functions.
  3. Upload the Markdown file, parse placeholders, then render it through renderMarkdown().
  4. Keep raw HTML escaped unless the section is intentionally an HTML museum/source example.
-->
<section class="bp-card bp-markdown">
  <!-- Rendered from uploaded Markdown -->
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
      "WIKI_BEE_MD_BUNDLE",
      "WIKI_BEE_SIDEBAR_SAMPLE",
      "WIKI_BEE_IMAGES",
      "WIKI_BEE_WORKER_IMAGE",
      "WIKI_BEE_HIVE_IMAGE",
      "EXPORT_PATH"
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
      appState.placeholders.WIKI_BEE_MD_BUNDLE = joinPath(projectPath, 'content/wiki');
      appState.placeholders.WIKI_BEE_SIDEBAR_SAMPLE = joinPath(projectPath, 'content/wiki/index__side_note.md');
      appState.placeholders.WIKI_BEE_IMAGES = joinPath(projectPath, 'content/images');
      appState.placeholders.WIKI_BEE_WORKER_IMAGE = joinPath(projectPath, 'content/images/bee_worker.svg');
      appState.placeholders.WIKI_BEE_HIVE_IMAGE = joinPath(projectPath, 'content/images/bee_hive.svg');
      appState.placeholders.EXPORT_PATH = joinPath(projectPath, 'exports');
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
        WIKI_BEE_MD_BUNDLE: '/path/to/backpack/content/wiki',
        WIKI_BEE_SIDEBAR_SAMPLE: '/path/to/backpack/content/wiki/index__side_note.md',
        WIKI_BEE_IMAGES: '/path/to/backpack/content/images',
        WIKI_BEE_WORKER_IMAGE: '/path/to/backpack/content/images/bee_worker.svg',
        WIKI_BEE_HIVE_IMAGE: '/path/to/backpack/content/images/bee_hive.svg',
        EXPORT_PATH: '/path/to/backpack/exports'
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
      const promoteButton = event.target.closest('[data-promote-widget]');
      if (promoteButton) {
        const widgetId = promoteButton.dataset.promoteWidget;
        const action = promoteButton.dataset.promoteAction || 'toggle';
        const widget = promotedWidgets[widgetId];
        if (!widget) return;
        if (action === 'open-home') {
          appState.activeTab = widget.homeTab;
        } else if (action === 'clear') {
          appState.ui.promotedWidget = '';
        } else {
          appState.ui.promotedWidget = isWidgetPromoted(widgetId) ? '' : widgetId;
        }
        saveState();
        renderApp();
        return;
      }

      const tabButton = event.target.closest('[data-tab]');
      if (!tabButton) return;
      appState.activeTab = tabButton.dataset.tab;
      appState.ui.editingEventId = null;
      renderApp();
    });

    function setToolbarButtonState(button, { text, title, pressed = false, active = false, label = title } = {}) {
      if (!button) return;
      if (text != null) button.textContent = text;
      if (title) button.title = title;
      if (label) button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', String(Boolean(pressed)));
      button.classList.toggle('bp-action-active', Boolean(active));
    }

    function applyGlobalUIState() {
      const theme = getThemeConfig(appState.ui.theme);
      appState.ui.theme = theme.id;
      document.body.dataset.bpTheme = theme.id;
      document.body.classList.toggle('bp-light', !appState.ui.darkMode);
      document.body.classList.toggle('bp-reading-dark', Boolean(appState.ui.readingDark));
      document.body.classList.toggle('bp-density-readable', appState.ui.density === 'readable');
      document.body.classList.toggle('bp-accessible', Boolean(appState.ui.accessibleMode));
      const dataBtn = $('#bpDataBtn');
      const dataMenu = $('#bpDataMenu');
      const themeBtn = $('#bpThemeBtn');
      const displayBtn = $('#bpDisplayBtn');
      const displayMenu = $('#bpDisplayMenu');
      const darkBtn = $('#bpDarkBtn');
      const readBtn = $('#bpReadBtn');
      const densityBtn = $('#bpDensityBtn');
      const accessBtn = $('#bpAccessibleBtn');
      const quoteEl = $('#bpHeaderQuote');
      if (quoteEl) {
        quoteEl.textContent = `"${parsePlaceholders('{{HEADER_QUOTE}}')}"`;
        quoteEl.title = parsePlaceholders('{{HEADER_QUOTE}}');
      }
      if (dataBtn) {
        const isDataOpen = Boolean(appState.ui.dataMenuOpen);
        setToolbarButtonState(dataBtn, {
          text: isDataOpen ? 'Data ▴' : 'Data ▾',
          title: isDataOpen ? 'Hide import/export menu' : 'Show import/export menu',
          label: 'Import and export menu',
          pressed: isDataOpen,
          active: isDataOpen
        });
        dataBtn.setAttribute('aria-expanded', String(isDataOpen));
      }
      if (dataMenu) dataMenu.hidden = !appState.ui.dataMenuOpen;
      setToolbarButtonState(themeBtn, {
        text: `${theme.icon} ${theme.shortLabel || theme.name}`,
        title: `Theme: ${theme.name}. Click to cycle theme.`,
        label: `Theme: ${theme.name}`,
        pressed: theme.id !== 'goldenrod',
        active: theme.id !== 'goldenrod'
      });
      if (displayBtn) {
        const isOpen = Boolean(appState.ui.displayMenuOpen);
        setToolbarButtonState(displayBtn, {
          text: isOpen ? 'Display ▴' : 'Display ▾',
          title: isOpen ? 'Hide display settings' : 'Show display settings',
          label: 'Display settings',
          pressed: isOpen,
          active: isOpen || appState.ui.density === 'readable' || appState.ui.accessibleMode
        });
      }
      if (displayMenu) displayMenu.hidden = !appState.ui.displayMenuOpen;
      setToolbarButtonState(darkBtn, {
        text: appState.ui.darkMode ? 'App: Dark' : 'App: Light',
        title: appState.ui.darkMode ? 'App dark theme active' : 'App light theme active',
        label: 'Toggle app light or dark mode',
        pressed: appState.ui.darkMode,
        active: appState.ui.darkMode
      });
      setToolbarButtonState(readBtn, {
        text: appState.ui.readingDark ? 'Reader: Dark' : 'Reader: Light',
        title: appState.ui.readingDark ? 'Reading dark mode active' : 'Reading light mode active',
        label: 'Toggle reading light or dark mode',
        pressed: appState.ui.readingDark,
        active: appState.ui.readingDark
      });
      setToolbarButtonState(densityBtn, {
        text: appState.ui.density === 'readable' ? 'Density: Readable' : 'Density: Compact',
        title: appState.ui.density === 'readable' ? 'Readable density active' : 'Compact density active',
        label: 'Toggle compact or readable density',
        pressed: appState.ui.density === 'readable',
        active: appState.ui.density === 'readable'
      });
      setToolbarButtonState(accessBtn, {
        text: appState.ui.accessibleMode ? 'Access: Enhanced' : 'Access: Standard',
        title: appState.ui.accessibleMode ? 'Accessible geometry active' : 'Standard interaction geometry active',
        label: 'Toggle accessibility geometry mode',
        pressed: appState.ui.accessibleMode,
        active: appState.ui.accessibleMode
      });
    }
    $('#bpDataBtn')?.addEventListener('click', () => {
      appState.ui.dataMenuOpen = !appState.ui.dataMenuOpen;
      saveState();
      renderApp();
    });
    $('#bpExportBtn').addEventListener('click', () => {
      appState.ui.dataMenuOpen = false;
      saveState();
      exportState();
      applyGlobalUIState();
    });
    $('#bpImportBtn').addEventListener('click', () => $('#bpImportFile').click());
    $('#bpThemeBtn')?.addEventListener('click', () => {
      appState.ui.theme = getNextThemeId(appState.ui.theme);
      saveState();
      renderApp();
    });
    $('#bpDisplayBtn')?.addEventListener('click', () => {
      appState.ui.displayMenuOpen = !appState.ui.displayMenuOpen;
      saveState();
      renderApp();
    });
    $('#bpDensityBtn')?.addEventListener('click', () => {
      appState.ui.density = appState.ui.density === 'readable' ? 'compact' : 'readable';
      saveState();
      renderApp();
    });
    $('#bpDarkBtn')?.addEventListener('click', () => {
      appState.ui.darkMode = !appState.ui.darkMode;
      saveState();
      renderApp();
    });
    $('#bpReadBtn')?.addEventListener('click', () => {
      commitQuickNoteBodies({ extractLinks: true });
      appState.ui.readingDark = !asBoolean(appState.ui.readingDark);
      saveState();
      applyGlobalUIState();
    });
    $('#bpAccessibleBtn')?.addEventListener('click', () => {
      appState.ui.accessibleMode = !appState.ui.accessibleMode;
      saveState();
      renderApp();
    });
    $('#bpImportFile').addEventListener('change', event => {
      const file = event.target.files?.[0];
      appState.ui.dataMenuOpen = false;
      if (file) importStateFile(file);
      event.target.value = '';
      saveState();
      applyGlobalUIState();
    });

    setInterval(updateCalendarTimeRail, 30000);
    window.addEventListener('resize', updateCalendarTimeRail);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && appState?.quickNotes?.openLinksNoteId) {
        appState.quickNotes.openLinksNoteId = '';
        saveState();
        if (appState.activeTab === 'quicknotes') renderApp();
      }
    });
    if (!appState.bees.markdown && !appState.bees.quoteHtml) loadBeesFiles();
    if (!appState.wikiBees.activePage) appState.wikiBees.activePage = appState.wikiBees.activeSection || 'index';
    appState.quickNotes = normalizeQuickNotesBoard(appState.quickNotes);
    saveState();
    renderApp();
    loadExternalNotes();