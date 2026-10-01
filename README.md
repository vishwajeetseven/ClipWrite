# ClipWrite

ClipWrite is a Google Chrome extension that makes it easier to enter clipboard content and reusable text snippets into web forms. It supports human-like simulated typing, instant paste, clipboard triggers, and customizable text shortcuts.

## Features

- **Human-like typing** — Inserts clipboard text one character at a time with smart delays.
- **Instant paste** — Inserts the complete clipboard contents at the cursor position.
- **Pause, resume, and cancel** — Control simulated typing with keyboard shortcuts.
- **Automatic line-based pausing** — Pauses after 107 lines so long content can be reviewed in sections.
- **Typing status indicator** — Displays the current typing state on the page.
- **Clipboard trigger** — Type a configurable trigger (the default is `+7`) to replace it with the current clipboard contents.
- **Custom text shortcuts** — Create reusable trigger-and-text pairs, such as `/email` or `/address`.
- **Context-menu support** — Start simulated typing from the context menu in an editable field.
- **Editable-field support** — Works with `<input>`, `<textarea>`, and `contenteditable` elements.
- **Shortcut backup and restore** — Export saved shortcuts to JSON and import them later.
- **Optional UI-free typing mode** — Use `writer_without_user_interface.js` when you do not want an on-page status indicator.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + Shift + 5` | Start simulated typing from the clipboard |
| `Ctrl + Shift + 9` | Paste clipboard contents instantly |
| `Command + Shift + 9` | Paste clipboard contents instantly on macOS |
| `` ` `` | Pause or resume simulated typing |
| `Esc` | Cancel simulated typing |

Chrome may reserve a shortcut or assign it to another extension. To review or change shortcuts, open `chrome://extensions/shortcuts`.

## Installation

1. Clone or download this repository.
2. Open Google Chrome and navigate to:

   ```text
   chrome://extensions/
   ```

3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the ClipWrite directory containing `manifest.json`.
6. After changing extension files, return to `chrome://extensions/` and click **Reload** for ClipWrite.

> ClipWrite is currently installed as an unpacked extension, so Developer mode must remain enabled.

## Usage

### Simulated typing from the clipboard

1. Copy text to your clipboard.
2. Focus an editable field on the current page.
3. Press `Ctrl + Shift + 5`, or right-click the field and select **Simulate Typing from Clipboard**.
4. Press `` ` `` to pause or resume, or press `Esc` to cancel.

ClipWrite shows a status indicator while it is typing. If no supported editable field is focused, ClipWrite asks you to focus one first.

### Instant paste

1. Copy text to your clipboard.
2. Focus an editable field.
3. Press `Ctrl + Shift + 9` on Windows/Linux, or `Command + Shift + 9` on macOS.

Instant paste inserts the clipboard contents at the current cursor position and dispatches input and change events for compatibility with web applications.

### Clipboard trigger

The content script can replace a typed trigger with your current clipboard contents.

1. Open the extension's **Shortcut Dashboard** from the Chrome extensions page.
2. Enter a trigger in **Clipboard Shortcut**. The default trigger is `+7`.
3. Click **Update**.
4. Type the trigger into an `<input>`, `<textarea>`, or `contenteditable` field.
5. ClipWrite replaces the trigger with the current clipboard contents.

### Custom text shortcuts

Use the **Custom Text Shortcuts** section in the Shortcut Dashboard to save reusable snippets.

1. Click the `+` button.
2. Enter a trigger, such as `/hello`.
3. Enter the text that should replace the trigger.
4. Click **Save**.

You can edit or remove saved shortcuts at any time. Longer triggers are checked before shorter triggers to help avoid ambiguous matches.

### Backup and restore

The **Backup and Restore** section lets you:

- Export the clipboard trigger and custom shortcuts to `clipwrite_backup.json`.
- Import a previously exported JSON backup.

### UI-free simulated typing

The repository includes `writer_without_user_interface.js`, which provides simulated typing without the on-page status indicator.

To use it:

1. Make a backup of `writer.js`.
2. Replace `writer.js` with the contents of `writer_without_user_interface.js`, or rename the alternative file to `writer.js`.
3. Reload ClipWrite from `chrome://extensions/`.

The UI-free version keeps the same `` ` `` pause/resume and `Esc` cancel controls. Automatic pausing after 107 lines remains enabled, but it does not display a status message.

## Project Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Chrome extension configuration, permissions, options page, content scripts, and keyboard shortcuts. |
| `background.js` | Registers the editable-field context-menu action and handles keyboard commands. |
| `content.js` | Detects clipboard and custom text triggers and replaces them with the configured text. |
| `writer.js` | Simulates clipboard typing and displays the on-page status indicator. |
| `paste.js` | Inserts clipboard contents instantly at the current cursor position. |
| `options.html` | Provides the Shortcut Dashboard interface. |
| `options.js` | Stores, edits, exports, and imports shortcut settings. |
| `writer_without_user_interface.js` | Alternative simulated-typing implementation without status feedback. |
| `Icon.png` | Extension icon asset. |

## Permissions and Access

ClipWrite uses the following Chrome permissions and access patterns:

- `activeTab` — Run actions on the active tab.
- `scripting` — Inject the typing and paste scripts into the active page.
- `clipboardRead` — Read the current clipboard contents.
- `contextMenus` — Add the simulated-typing action to editable-field context menus.
- `storage` — Save the clipboard trigger and custom text shortcuts with Chrome Sync storage.
- `<all_urls>` content script access — Detect configured triggers in supported editable fields on web pages.

## Notes and Limitations

- Focus the destination field before starting simulated typing or instant paste.
- ClipWrite operates on supported editable fields in the active page.
- Clipboard access can depend on Chrome's permission and page-security rules.
- Some websites use custom editors that may not fully support programmatic input events.
- Keyboard shortcuts can conflict with Chrome or other extensions and may need to be changed.

## License

No license file is currently included in this repository. Add a license before distributing ClipWrite if you want to define how others may use, modify, or redistribute it.
