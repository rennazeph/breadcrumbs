Because Backpack is designed to run without a local server, the wiki cannot rely on automatic local file checks. The safe path is to keep bundled demo content in the app, then let users upload Markdown and images when they want to replace it. Uploaded content can be saved in Backpack state and exported as JSON.

For a small wiki, manual upload buttons are enough. For a larger wiki, a bundle upload is more practical. The bundle control reads multiple Markdown files, matches known filenames, and updates only the recognized slots. Unknown files are ignored instead of guessing, because accidental overwrites are worse than a skipped import.

This gives us a realistic authoring loop: write Markdown files outside the app, open the HTML directly, upload the bundle, inspect the rendered result, export state if the page should travel as a portable snapshot.
