The wiki is now best understood as a registry-driven page family. A registry entry tells Backpack what to show in each column: the navigation label, the page header, the Markdown fragments, the infobox image, and the side Markdown file. The tab does not need to know whether it is showing food, language notes, or gallery entries; it only needs to render the active page record.

This is similar to the tab cleanup already done in Backpack. Tabs became easier to expand when rendering and binding were attached to one registry object. The same idea works inside a template: each wiki page should register its content, not demand new branches in the renderer.

The page registry also gives us a place to define upload conventions. A writer can upload a group of files, and Backpack can map each file to a section by filename instead of making the user select every slot manually.
