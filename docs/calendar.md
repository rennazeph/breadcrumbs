# Calendar — Backpack 1.31

The Calendar combines three workflows:

1. Month navigation and day selection.
2. Daily arrival tracking.
3. Event scheduling with a selected-day Gantt view.

## Backpack day and expected arrival

The Backpack day starts at `07:00`. Expected arrival also defaults to `07:00`.

Rules:

- `07:00` is on time.
- `07:01` is late.
- Expected arrival can be changed by month in `BP_USER_CONFIG.calendar.expectedArrivalByMonth`.

Example config:

```js
expectedArrivalByMonth: {
  default: "07:00",
  "2026-06": "07:30"
}
```

## Start Day flow

Arrival has two states.

### Arrival pending

Shown when the selected Backpack-today has no recorded arrival.

- Large `> Start Day` button.
- The Gantt is dimmed/standby.
- Events remain faintly visible so the day feels dormant, not empty.
- The time text field may be used before pressing Start Day.

`> Start Day` saves the typed time if valid; otherwise it saves the current local time.

### Arrival logged

Shown when the selected day has a recorded arrival.

- Compact audit strip.
- Displays arrival time and status.
- Edit controls are hidden behind **Edit**.
- Monthly stats appear as quiet audit data.

## Arrival time input

Arrival uses a plain text field, not the browser-native time picker.

Accepted examples:

```txt
7       -> 07:00
700     -> 07:00
730     -> 07:30
7:30    -> 07:30
7.30    -> 07:30
```

Mouse-only correction is supported with:

```txt
−5  −1  +1  +5
```

Pending state adjusts the draft time. Logged edit mode updates the saved arrival after Save.

## Monthly arrival stats

Stats are based on the visible calendar month.

Current stats:

- average arrival time;
- recorded days;
- late days;
- days since last late.

Only valid recorded arrivals count toward averages.

## Event data model

Events are stored with structured fields.

```js
{
  id: "evt_...",
  title: "Review",
  startTime: "09:00",
  endTime: "10:30",
  durationMode: "range",
  priority: "normal",
  notes: "",
  repeatId: null
}
```

The event input can still parse shortcuts:

```txt
09:00 - 10:30 Review
09:00 Review
Review
```

Parsing happens when creating/editing. The visible title is no longer the long-term source of truth for Gantt positioning.

## Priorities

Priority symbols use ASCII-friendly markers:

```txt
◆ Highest
◇ High
· Normal
```

These symbols support grayscale/low-color displays and should remain consistent across day cells, event blocks, dropdowns, and Gantt bars.

## Repeat this month

Repeats are intentionally month-copy behavior.

When the user selects repeat days, Backpack creates repeated copies from the selected date through the visible/current month. This is not true recurrence across future months.

Repeated copies carry metadata:

```js
repeatId
repeatDays
repeatSourceDate
repeatGenerated
```

The UI supports deleting a single repeated event or deleting the repeated group.

## Gantt model

The selected-day Gantt shows timed events only.

- Untimed events render separately as compact day items.
- Gantt scale anchors to recorded arrival time, or expected arrival if not recorded.
- Events outside the initial workday window expand the visible window.
- The `now` marker and event bars use JavaScript-calculated pixel positions, not CSS percentage multiplication.
- The marker recalculates on render, every 30 seconds, and on window resize.

## Calendar tools

Calendar release tools are collapsed by default and include:

- Export Calendar;
- Import Calendar;
- Repair;
- Clean empty days;
- Clear selected day;
- diagnostics;
- repeat-group summary.

Calendar-only import is replace-only. It does not merge into the current calendar.

## Visual state language

Calendar states use structural lanes:

- Today: small structural marker.
- Selected: internal frame.
- Hover: temporary chrome state.
- Arrival: side bar / status pill.
- Events: segmented priority band and compact chips.

Avoid external dotted outlines; they were removed because they were noisy and caused stacking bugs.
