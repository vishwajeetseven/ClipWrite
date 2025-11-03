// writer.js (Final: Fast for alphanumeric, cautious for all other characters)

(async () => {
  // Use a global flag to prevent multiple instances from running simultaneously.
  if (window.clipWriteIsRunning) {
    return;
  }
  window.clipWriteIsRunning = true;


  // --- State Variables ---
  let textToInsert = '';
  let activeEl = null;
  let currentIndex = 0;
  let isPaused = false;
  let lineCountSinceResume = 0;
  // 'wasPausedManually' is no longer needed for the cancel logic
  
  // --- Main Execution Block ---
  try {
    textToInsert = await navigator.clipboard.readText();
    activeEl = document.activeElement;

    if (!activeEl || !(activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
      alert('Please focus on an editable text field first.');
      cleanup();
      return;
    }

    setup();
    typeNextCharacter();

  } catch (error) {
    console.error('ClipWrite error:', error);
    cleanup();
  }


  // --- Core Functions ---

  /**
   * Types the next character with a final, robust, multi-level smart delay.
   */
  async function typeNextCharacter() {
    if (isPaused || currentIndex >= textToInsert.length) {
      if (currentIndex >= textToInsert.length) {
        updateStatusIndicator('Done!');
        setTimeout(cleanup, 2000);
      }
      return;
    }

    const char = textToInsert[currentIndex];
    
    insertCharacter(char);
    
    // Logic for newline events
    if (char === '\n') {
      lineCountSinceResume++;
      
      // Check for auto-pause at 107 lines
      if (lineCountSinceResume >= 107) {
        isPaused = true;
        lineCountSinceResume = 0;
        // **MODIFIED: Updated status text**
        updateStatusIndicator('Paused (auto). Press ` to resume or Esc to cancel.');
        return;
      }
    }

    currentIndex++;
    
    // --- Alphanumeric-based Smart Delay ---
    const nextChar = (currentIndex < textToInsert.length) ? textToInsert[currentIndex] : null;
    const isAlphanumeric = /^[a-zA-Z0-9]$/;

    let delay = 10; // Default: Fastest speed for letters and numbers

    if (char === '\n') {
        delay = 270; // Safest delay for the newline character itself
    } else if (nextChar === '\n') {
        delay = 150; // Pre-slowdown when a newline is approaching
    } else if (!isAlphanumeric.test(char)) {
        // If the character is NOT a letter or number, use the cautious delay.
        delay = 100;
    }
    // --- END Alphanumeric Delay ---

    await new Promise(resolve => setTimeout(resolve, delay));
  
    requestAnimationFrame(typeNextCharacter);
  }

  /**
   * Inserts a single character into the active element.
   */
  function insertCharacter(char) {
    activeEl.focus();

    if (activeEl.isContentEditable) {
      document.execCommand('insertText', false, char);
    } else {
      const start = activeEl.selectionStart;
      const end = activeEl.selectionEnd;
      activeEl.value = activeEl.value.substring(0, start) + char + activeEl.value.substring(end);
      activeEl.selectionStart = activeEl.selectionEnd = start + 1;
    }

    activeEl.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: char
    }));
  }

  /**
   * **MODIFIED: Handles key presses for Pause, Resume, and Cancel.**
   */
  function handleKeyPress(e) {
    // --- Pause/Resume Toggle ---
    if (e.key === '`') {
      e.preventDefault();
      
      if (isPaused) {
        // --- RESUME ---
        isPaused = false;
        lineCountSinceResume = 0; // Reset auto-pause counter on resume
        updateStatusIndicator('Typing...');
        typeNextCharacter(); // Restart the typing loop
      } else {
        // --- PAUSE ---
        isPaused = true;
        updateStatusIndicator('Paused. Press ` to resume or Esc to cancel.');
      }
    }
    
    // --- Cancel Key ---
    if (e.key === 'Escape') {
        e.preventDefault();
        
        // Stop the typing loop
        currentIndex = textToInsert.length;
        isPaused = true; // Ensure no more characters are typed
        
        updateStatusIndicator('Cancelled.');
        setTimeout(cleanup, 1000);
    }
  }


  // --- UI and Setup/Cleanup ---

  function setup() {
    document.addEventListener('keydown', handleKeyPress);
    createStatusIndicator();
  }

  function cleanup() {
    document.removeEventListener('keydown', handleKeyPress);
    removeStatusIndicator();
    window.clipWriteIsRunning = false;
  }
  
  function createStatusIndicator() {
    if (document.getElementById('clipwrite-status-indicator')) return;
    const indicator = document.createElement('div');
    indicator.id = 'clipwrite-status-indicator';
    // **MODIFIED: Updated initial status text**
    indicator.textContent = 'Typing... Press ` to pause, Esc to cancel.';
    
    // Glass UI styles
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.left = '20px';
    indicator.style.padding = '10px 18px';
    indicator.style.borderRadius = '25px';
    indicator.style.fontSize = '14px';
    indicator.style.fontWeight = '500';
    indicator.style.fontFamily = `'SF Pro Text', 'Helvetica Neue', 'Arial', sans-serif`;
    indicator.style.color = 'rgba(0, 0, 0, 0.8)';
    indicator.style.zIndex = '2147483647';
    indicator.style.userSelect = 'none';
    indicator.style.transition = 'opacity 0.3s ease-in-out';
    indicator.style.background = 'rgba(255, 255, 255, 0.25)';
    indicator.style.backdropFilter = 'blur(12px)';
    indicator.style.webkitBackdropFilter = 'blur(12px)';
    indicator.style.border = '1px solid rgba(255, 255, 255, 0.18)';
    indicator.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    
    document.body.appendChild(indicator);
  }

  function updateStatusIndicator(text) {
    const indicator = document.getElementById('clipwrite-status-indicator');
    if (indicator) {
      indicator.textContent = text;
    }
  }

  function removeStatusIndicator() {
    const indicator = document.getElementById('clipwrite-status-indicator');
    if (indicator) {
      indicator.style.opacity = '0';
      setTimeout(() => indicator.remove(), 300);
    }
  }

})();
