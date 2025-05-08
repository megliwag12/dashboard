export class NotesModule {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    // Create notes app HTML structure based on notes-app.html
    this.container.innerHTML = `
      <div class="toolbar">
        <button id="boldBtn" title="Bold">Bold</button>
        <button id="highlightBtn" title="Highlight">Highlight</button>
        <button id="clearBtn" title="Clear Formatting">Clear Format</button>
        <button id="saveBtn" title="Save Notes">Save</button>
        <button id="loadBtn" title="Load Notes">Load</button>
      </div>
      
      <div id="editor" class="editor" contenteditable="true"></div>
    `;

    // Add styling for notes app
    this.addStyles();

    // Load saved notes if exist
    this.loadSavedNotes();
  }

  addStyles() {
    // Check if styles are already added
    if (!document.getElementById('notes-app-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'notes-app-styles';
      styleElement.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
        
        #notes-container .toolbar {
          margin-bottom: 10px;
          padding: 10px;
          background-color: #f8f8f8;
          border-radius: 5px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        #notes-container .toolbar button {
          background-color: #4285f4;
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        #notes-container .toolbar button:hover {
          background-color: #3b78e7;
        }
        
        #notes-container .toolbar button.active {
          background-color: #2a56c6;
        }
        
        #notes-container .editor {
          min-height: 300px;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 10px;
          line-height: 1.5;
          overflow-y: auto;
          background-color: white;
        }
        
        #notes-container .editor:focus {
          outline: none;
          border-color: #4285f4;
          box-shadow: 0 0 5px rgba(66, 133, 244, 0.5);
        }
        
        #notes-container .heading {
          font-weight: bold;
          font-size: 1.2em;
          color: #4285f4;
          border-bottom: 2px solid #4285f4;
          padding-bottom: 5px;
          margin-top: 15px;
          display: block;
        }
        
        #notes-container .highlight {
          background-color: #ffff9e;
          padding: 0 2px;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }

  setupEventListeners() {
    const editor = document.getElementById('editor');
    const boldBtn = document.getElementById('boldBtn');
    const highlightBtn = document.getElementById('highlightBtn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    
    // Disable spell checking and autocorrect
    editor.setAttribute('spellcheck', 'false');
    editor.setAttribute('autocorrect', 'off');
    editor.setAttribute('autocapitalize', 'off');
    
    // Bold button
    boldBtn.addEventListener('click', () => {
      document.execCommand('bold', false, null);
      editor.focus();
    });
    
    // Highlight button
    highlightBtn.addEventListener('click', () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'highlight';
        range.surroundContents(span);
        editor.focus();
      }
    });
    
    // Clear formatting button
    clearBtn.addEventListener('click', () => {
      document.execCommand('removeFormat', false, null);
      editor.focus();
    });
    
    // Save notes
    saveBtn.addEventListener('click', () => {
      this.saveNotes();
    });
    
    // Load notes
    loadBtn.addEventListener('click', () => {
      this.loadNotes();
    });
    
    // Handle double Enter for headings
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        
        // Check if node content ends with a newline
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const cursorPosition = range.startOffset;
          
          if (cursorPosition > 0 && text.charAt(cursorPosition - 1) === '\n') {
            // Double Enter detected - create heading
            e.preventDefault();
            
            // Split the text at cursor position
            const beforeText = text.substring(0, cursorPosition);
            const afterText = text.substring(cursorPosition);
            
            // Replace current text with text before cursor
            node.textContent = beforeText;
            
            // Create heading element
            const headingElement = document.createElement('div');
            headingElement.className = 'heading';
            headingElement.contentEditable = true;
            headingElement.textContent = '';
            
            // Create element for text after cursor
            const afterElement = document.createTextNode(afterText);
            
            // Insert elements
            const parentNode = node.parentNode;
            if (afterText) {
              parentNode.insertBefore(afterElement, node.nextSibling);
            }
            parentNode.insertBefore(headingElement, afterText ? afterElement : node.nextSibling);
            
            // Set cursor to heading
            const newRange = document.createRange();
            newRange.setStart(headingElement, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      }
    });

    // Setup auto-save
    let timeout;
    editor.addEventListener('input', () => {
      clearTimeout(timeout);
      
      // Add "saving..." indicator
      const saveIndicator = document.createElement('span');
      saveIndicator.textContent = 'Saving...';
      saveIndicator.id = 'save-indicator';
      saveIndicator.style.fontSize = '0.8rem';
      saveIndicator.style.color = '#999';
      saveIndicator.style.marginLeft = '10px';
      
      const toolbar = document.querySelector('.toolbar');
      // Remove any existing indicator
      const existingIndicator = document.querySelector('#save-indicator');
      if (existingIndicator) {
        toolbar.removeChild(existingIndicator);
      }
      
      toolbar.appendChild(saveIndicator);
      
      // Save after 1 second of inactivity
      timeout = setTimeout(() => {
        this.saveNotes(false); // Silent save (no alert)
        // Update indicator
        saveIndicator.textContent = 'Saved';
        // Remove indicator after 2 seconds
        setTimeout(() => {
          if (saveIndicator.parentNode) {
            toolbar.removeChild(saveIndicator);
          }
        }, 2000);
      }, 1000);
    });
  }

  saveNotes(showAlert = true) {
    const editor = document.getElementById('editor');
    const notesContent = editor.innerHTML;
    
    localStorage.setItem('dashboard_notes', notesContent);
    
    if (showAlert) {
      alert('Notes saved successfully!');
    }
  }

  loadNotes() {
    this.loadSavedNotes(true);
  }

  loadSavedNotes(showAlert = false) {
    const editor = document.getElementById('editor');
    const savedNotes = localStorage.getItem('dashboard_notes');
    
    if (savedNotes) {
      editor.innerHTML = savedNotes;
      if (showAlert) {
        alert('Notes loaded successfully!');
      }
    } else {
      // Display welcome message if no saved notes
      editor.innerHTML = `Welcome to your notes app!<br><br>`;
      // Add a first heading example
      const headingElement = document.createElement('div');
      headingElement.className = 'heading';
      headingElement.textContent = 'My First Note';
      editor.appendChild(headingElement);
      editor.innerHTML += '<br>Start typing here...<br><br>';
    }
  }
}

export default NotesModule;