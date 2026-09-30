// paste.js
(async () => {
  try {
    const textToInsert = await navigator.clipboard.readText();
    const activeEl = document.activeElement;

    if (!activeEl || !(activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
      alert('Please focus on an editable text field first.');
      return;
    }

    activeEl.focus();

    if (activeEl.isContentEditable) {
      document.execCommand('insertText', false, textToInsert);
    } else {
      const start = activeEl.selectionStart;
      const end = activeEl.selectionEnd;
      activeEl.value = activeEl.value.substring(0, start) + textToInsert + activeEl.value.substring(end);
      activeEl.selectionStart = activeEl.selectionEnd = start + textToInsert.length;
    }

    activeEl.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertFromPaste',
      data: textToInsert
    }));
    
    activeEl.dispatchEvent(new Event('change', { bubbles: true }));

  } catch (error) {
    console.error('Instant paste error:', error);
  }
})();