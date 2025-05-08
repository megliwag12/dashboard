import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class NotesModule {
  constructor(containerId: string) {
    this.init(containerId);
  }

  async init(containerId: string) {
    // Fetch the notes-app.html content
    const response = await fetch('/notes-app.html');
    const html = await response.text();
    
    // Get just the body content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const container = document.getElementById(containerId);
    
    if (container) {
      // Extract and insert the content
      const appContent = doc.querySelector('.container');
      if (appContent) {
        container.innerHTML = '';
        container.appendChild(appContent);
      }
      
      // Inject the scripts
      const scripts = doc.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.textContent) {
          newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
      });
    }
  }
}

// First, render the React app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Then initialize the vanilla JS notes module after React has rendered
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const notesContainer = document.getElementById('notes-container');
    if (notesContainer) {
      new NotesModule('notes-container');
    }
  }, 500); // Small delay to ensure React has fully rendered
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service worker registered:', reg))
      .catch(err => console.log('Service worker registration failed:', err));
  });
}