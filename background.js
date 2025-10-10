// --- Context Menu and Command Listeners ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "writeClipboardText",
    title: "Simulate Typing from Clipboard",
    contexts: ["editable"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "writeClipboardText") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["writer.js"]
    });
  }
});

chrome.commands.onCommand.addListener((command, tab) => {
  // Original command to simulate typing
  if (command === "activate-writer") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["writer.js"]
    });
  }
});
