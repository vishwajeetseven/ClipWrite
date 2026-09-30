# ClipWrite

A Google Chrome extension that inserts clipboard text into the focused editable field. Choose between **human-like simulated typing** and **instant paste** depending on your workflow.

## Features

- Simulates typing from the clipboard one character at a time.
- Uses smart delays: letters and numbers are typed quickly, while punctuation and line breaks use safer delays.
- Supports `<input>`, `<textarea>`, and `contenteditable` elements.
- Pause or resume simulated typing with the backtick key (`).
- Cancel simulated typing with `Esc`.
- Automatically pauses after 107 lines so long text can be reviewed in sections.
- Shows an on-page status indicator while simulated typing is active.
- Instantly pastes the complete clipboard contents with a dedicated shortcut.
- Provides a context-menu action for simulated typing in editable fields.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + Shift + 5` | Start simulated typing from the clipboard |
| `Ctrl + Shift + 9` | Paste clipboard contents instantly |
| `Command + Shift + 9` | Paste clipboard contents instantly on macOS |
| `` ` `` | Pause or resume simulated typing |
| `Esc` | Cancel simulated typing |

> Chrome may reserve a shortcut or assign it to another extension. If a shortcut does not work, open `chrome://extensions/shortcuts` to review or change it.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to:

   ```text
   chrome://extensions/
   ```

3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked**.
5. Select the ClipWrite folder containing `manifest.json`.
6. If you update the extension files, return to `chrome://extensions/` and click **Reload** for ClipWrite.

## Usage

### Simulated typing

1. Copy text to your clipboard.
2. Focus an editable field on the current page.
3. Press `Ctrl + Shift + 5` (or use the editable-field context menu and choose **Simulate Typing from Clipboard**).
4. Press `` ` `` to pause or resume, or press `Esc` to cancel.

ClipWrite will display a status indicator while it is typing. If no editable field is focused, the extension will ask you to focus one first.

### Instant paste

1. Copy text to your clipboard.
2. Focus an editable field.
3. Press `Ctrl + Shift + 9` on Windows/Linux or `Command + Shift + 9` on macOS.

Instant paste inserts the entire clipboard contents at the current cursor position and dispatches input/change events for compatibility with web applications.

## Optional: Non-UI Version

The repository also includes `writer_without_user_interface.js`, which performs simulated typing without displaying the on-page status indicator.

To use it:

1. Make a backup of the current `writer.js`.
2. Replace `writer.js` with the contents of `writer_without_user_interface.js`, or rename the file to `writer.js`.
3. Reload ClipWrite from `chrome://extensions/`.

The non-UI version keeps the same simulated-typing controls: `` ` `` to pause/resume and `Esc` to cancel.

## Project Files

- `manifest.json` — Chrome extension configuration, permissions, icons, and keyboard shortcuts.
- `background.js` — Registers the context-menu item and executes the typing or instant-paste script.
- `writer.js` — Simulated typing implementation with status feedback.
- `paste.js` — Instant clipboard insertion implementation.
- `writer_without_user_interface.js` — Optional simulated-typing implementation without status feedback.

## Permissions

ClipWrite requests the following Chrome permissions:

- `activeTab` — Run the selected action on the active tab.
- `scripting` — Inject the typing and paste scripts into the active page.
- `clipboardRead` — Read the current clipboard contents.
- `contextMenus` — Add the simulated-typing action to editable-field context menus.

## Notes

- Always focus the destination field before starting an action.
- The extension only operates on editable fields in the active tab.
- ClipWrite is loaded as an unpacked extension, so Developer mode must remain enabled.
