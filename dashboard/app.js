import TodoModule from './modules/todo.js';
import WeatherModule from './modules/weather.js';
import NotesModule from './modules/notes.js';

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Todo Module
  const todoModule = new TodoModule('todo-container');
  
  // Initialize Weather Module
  const weatherModule = new WeatherModule('weather-container');
  
  // Initialize Notes Module
  const notesModule = new NotesModule('notes-container');
  
  // Add some placeholder icons for the PWA
  createPlaceholderIcons();
});

// Create placeholder icons for PWA until real ones are provided
function createPlaceholderIcons() {
  const iconsDir = '/images';
  const canvas = document.createElement('canvas');
  const sizes = [192, 512];
  
  sizes.forEach(size => {
    try {
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Draw background
      ctx.fillStyle = '#4285f4';
      ctx.fillRect(0, 0, size, size);
      
      // Draw text
      ctx.fillStyle = 'white';
      ctx.font = `bold ${size / 4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DASH', size / 2, size / 2);
      
      // Convert to blob and create object URL
      canvas.toBlob(blob => {
        const iconUrl = URL.createObjectURL(blob);
        
        // Create fake link to download
        console.log(`Generated placeholder icon for size ${size}x${size}.`);
        console.log(`Download icon from console and save it to: ${iconsDir}/icon-${size}x${size}.png`);
        console.log(`URL (right-click to save): ${iconUrl}`);
      });
    } catch (err) {
      console.error(`Error creating placeholder icon: ${err.message}`);
    }
  });
}