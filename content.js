let clipboardTrigger = "+7";
let customShortcuts = {};
let cachedSortedTriggers = [];

function updateTriggerCache() {
  cachedSortedTriggers = Object.keys(customShortcuts);
  if (clipboardTrigger) {
    cachedSortedTriggers.push(clipboardTrigger);
  }
  cachedSortedTriggers.sort((a, b) => b.length - a.length);
}

chrome.storage.sync.get(['clipboardTrigger', 'customShortcuts'], (result) => {
  if (result.clipboardTrigger) clipboardTrigger = result.clipboardTrigger;
  if (result.customShortcuts) customShortcuts = result.customShortcuts;
  updateTriggerCache();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.clipboardTrigger) clipboardTrigger = changes.clipboardTrigger.newValue;
  if (changes.customShortcuts) customShortcuts = changes.customShortcuts.newValue;
  updateTriggerCache();
});

document.addEventListener('input', async (e) => {
  const el = e.target;
  if (!el || !(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;

  let textBeforeCursor = "";
  if (el.isContentEditable) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const clonedRange = range.cloneRange();
      clonedRange.selectNodeContents(el);
      clonedRange.setEnd(range.endContainer, range.endOffset);
      textBeforeCursor = clonedRange.toString();
    }
  } else {
    textBeforeCursor = el.value.substring(0, el.selectionStart);
  }

  for (const alias of cachedSortedTriggers) {
    if (textBeforeCursor.endsWith(alias)) {
      let textToInsert = "";
      
      if (alias === clipboardTrigger) {
        try {
          textToInsert = await navigator.clipboard.readText();
        } catch (error) {
          return;
        }
      } else {
        textToInsert = customShortcuts[alias];
      }
      
      replaceText(el, alias.length, textToInsert);
      break; 
    }
  }
});

function replaceText(el, aliasLength, newText) {
  if (el.isContentEditable) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    for (let i = 0; i < aliasLength; i++) {
      document.execCommand('delete', false, null);
    }
    document.execCommand('insertText', false, newText);
  } else {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    
    const textBefore = el.value.substring(0, start - aliasLength);
    const textAfter = el.value.substring(end);
    
    el.value = textBefore + newText + textAfter;
    
    const newCursorPos = start - aliasLength + newText.length;
    el.selectionStart = el.selectionEnd = newCursorPos;
    
    el.dispatchEvent(new InputEvent('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
}