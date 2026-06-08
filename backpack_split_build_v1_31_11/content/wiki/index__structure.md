A medium template becomes maintainable when the data model does most of the work. Instead of writing a new renderer for every article, each page record declares a navigation label, a title, a description, a list of section files, one side-note file, and one image slot. The renderer then loops through those records.

This makes the wiki expandable in a controlled way. Adding a page should mean adding one configuration object and several Markdown files, not opening the tab binder, adding new switch cases, and copying markup by hand. It also makes future promotion possible: a wiki section, image card, or source panel could be promoted to a persistent shelf just like the Event Gantt.

For readability, the main text column should remain calm. It should not be filled with authoring controls. Controls belong in Column A and Column C, while Column B is treated as the reading surface.
