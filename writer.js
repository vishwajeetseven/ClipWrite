// writer.js

(async () => {
  try {
    const textToInsert = await navigator.clipboard.readText();
    const activeEl = document.activeElement;

    if (!activeEl || !(activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
      alert('Please focus on an editable text field first.');
      return;
    }
    
    activeEl.focus();

    for (const char of textToInsert) {
      // For contentEditable elements (like code editors)
      if (activeEl.isContentEditable) {
        document.execCommand('insertText', false, char);
      } else {
        // For standard <input> and <textarea> elements
        // This correctly inserts text at the current cursor position
        const start = activeEl.selectionStart;
        const end = activeEl.selectionEnd;
        
        activeEl.value = activeEl.value.substring(0, start) + char + activeEl.value.substring(end);
        
        // Move the cursor to after the inserted character
        activeEl.selectionStart = activeEl.selectionEnd = start + 1;
      }
      
      // Dispatch a generic 'input' event after each character.
      // This is crucial for notifying complex editors and frameworks that a change was made,
      // preventing the vertical typing bug.
      activeEl.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: char
      }));

      // Add a small delay to simulate human typing
      await new Promise(resolve => setTimeout(resolve, 0));
    }

  } catch (error) {
    console.error('ClipWrite error:', error);
  }

})();
