chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "writeClipboardText",
    title: "/",
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

chrome.commands.onCommand.addListener((command) => {
  if (command === "activate-writer") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["writer.js"]
      });
    });
  }
});
