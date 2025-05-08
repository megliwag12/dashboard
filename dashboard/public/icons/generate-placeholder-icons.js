// This script is used as a reference for creating placeholder icons
// You'd typically run this in a browser or Node.js environment

function createPlaceholderIcon(size) {
  const canvas = document.createElement('canvas');
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
  
  // In a real script, you'd save this to a file
  // For demonstration, return as data URL
  return canvas.toDataURL('image/png');
}

// Usage:
// createPlaceholderIcon(192); // For 192x192 icon
// createPlaceholderIcon(512); // For 512x512 icon