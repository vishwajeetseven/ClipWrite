const clipboardInput = document.getElementById('clipboardTrigger');
const saveClipboardBtn = document.getElementById('saveClipboardBtn');

const shortcutList = document.getElementById('shortcutList');
const showAddFormBtn = document.getElementById('showAddFormBtn');
const addForm = document.getElementById('addForm');
const newTriggerInput = document.getElementById('newTrigger');
const newContentInput = document.getElementById('newContent');
const saveCustomBtn = document.getElementById('saveCustomBtn');
const cancelBtn = document.getElementById('cancelBtn');

const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');

let editingKey = null;

function loadSettings() {
  chrome.storage.sync.get(['clipboardTrigger', 'customShortcuts'], (result) => {
    clipboardInput.value = result.clipboardTrigger || "+7";
    
    const shortcuts = result.customShortcuts || {};
    shortcutList.innerHTML = '';
    
    for (const [key, val] of Object.entries(shortcuts)) {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'item-content';
      const displayVal = val.length > 50 ? val.substring(0, 50) + '...' : val;
      contentDiv.innerHTML = `<strong>${key}</strong> ➔ <span>${displayVal}</span>`;
      
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'item-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-edit';
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => {
        editingKey = key;
        newTriggerInput.value = key;
        newContentInput.value = val;
        addForm.style.display = 'block';
        showAddFormBtn.style.display = 'none';
        saveCustomBtn.textContent = 'Update';
      };
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.textContent = 'Remove';
      deleteBtn.onclick = () => {
        delete shortcuts[key];
        chrome.storage.sync.set({ customShortcuts: shortcuts }, loadSettings);
      };
      
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      itemDiv.appendChild(contentDiv);
      itemDiv.appendChild(actionsDiv);
      shortcutList.appendChild(itemDiv);
    }
  });
}

saveClipboardBtn.onclick = () => {
  const val = clipboardInput.value.trim();
  if (val) {
    chrome.storage.sync.set({ clipboardTrigger: val }, () => {
      saveClipboardBtn.textContent = 'Saved!';
      setTimeout(() => saveClipboardBtn.textContent = 'Update', 1500);
    });
  }
};

showAddFormBtn.onclick = () => {
  editingKey = null;
  saveCustomBtn.textContent = 'Save';
  newTriggerInput.value = '';
  newContentInput.value = '';
  addForm.style.display = 'block';
  showAddFormBtn.style.display = 'none';
};

cancelBtn.onclick = () => {
  editingKey = null;
  saveCustomBtn.textContent = 'Save';
  addForm.style.display = 'none';
  showAddFormBtn.style.display = 'flex';
  newTriggerInput.value = '';
  newContentInput.value = '';
};

saveCustomBtn.onclick = () => {
  const key = newTriggerInput.value.trim();
  const val = newContentInput.value.trim();
  
  if (!key || !val) return;

  chrome.storage.sync.get(['customShortcuts'], (result) => {
    let shortcuts = result.customShortcuts || {};
    
    if (editingKey && editingKey !== key) {
      delete shortcuts[editingKey];
    }
    
    shortcuts[key] = val;
    chrome.storage.sync.set({ customShortcuts: shortcuts }, () => {
      editingKey = null;
      saveCustomBtn.textContent = 'Save';
      newTriggerInput.value = '';
      newContentInput.value = '';
      addForm.style.display = 'none';
      showAddFormBtn.style.display = 'flex';
      loadSettings();
    });
  });
};

exportBtn.onclick = () => {
  chrome.storage.sync.get(['clipboardTrigger', 'customShortcuts'], (result) => {
    const backupData = {
      clipboardTrigger: result.clipboardTrigger || "+7",
      customShortcuts: result.customShortcuts || {}
    };
    
    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataString);
    downloadAnchor.setAttribute("download", "clipwrite_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });
};

importBtn.onclick = () => fileInput.click();

fileInput.onchange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      if (importedData.customShortcuts) {
        chrome.storage.sync.set({
          clipboardTrigger: importedData.clipboardTrigger || "+7",
          customShortcuts: importedData.customShortcuts
        }, () => {
          loadSettings();
        });
      }
    } catch (err) {
      // Failed to parse
    }
  };
  reader.readAsText(file);
};

loadSettings();