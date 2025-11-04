# ClipWrite (Google Chrome Extension)
## Simulates Writing from Clipboard

### Load Extension (Developer Mode)
Open Chrome → Go to:

```chrome://extensions/```

Enable Developer Mode (top-right toggle).

Click Load unpacked.

Select the extension folder (the folder containing manifest.json, background.js, and writer.js)

Now the extension will load immediately.

Note: This is temporary. Chrome might disable it on restart unless developer mode is enabled.


### How to Set Up the Non-UI Version
You will modify your local extension files before loading or reloading the extension in Chrome.

Open your extension folder: Go to the local folder on your computer where your ClipWrite files (manifest.json, background.js, etc.) are saved.

Delete the old file: Find the file named writer.js (this is the version with the UI) and delete it.

Rename the new file: Find the file named writer_without_user_interface.js (this is the version without the UI).

Rename this file to exactly writer.js.

Your folder should now have manifest.json, background.js, and the newly renamed writer.js (which contains the non-UI code).


### Use
Shortcut ```Ctrl + Shift + 5``` triggers a ClipWrite (```/```) action (or similar), (Press ``` ` ``` to pause/resume, ```Esc``` to cancel).
