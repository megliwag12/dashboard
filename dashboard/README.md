# Personal Dashboard PWA

A modern, responsive personal dashboard Progressive Web App (PWA) that includes:
- Interactive To-Do List (React + TypeScript)
- Weather Widget (React + TypeScript)
- Rich Text Notes App (Vanilla JS)

## Features

- **Modern React + TypeScript Frontend**: Uses React and TypeScript for the to-do and weather modules
- **Offline Support**: Works even without an internet connection
- **Installable**: Can be installed on your device as a standalone app
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Your data is stored locally on your device

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite (for build tooling and dev server)
- Lucide React (for icons)
- PWA capabilities

## Setup Instructions

1. **Clone or download** this repository to your local machine.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run start
   ```

4. **Open in browser**: Navigate to `http://localhost:5173` in your web browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Preview production build**:
   ```bash
   npm run preview
   ```

## Module Details

### To-Do List
- Filter tasks by all, active, or completed
- Add, complete, and delete tasks
- Clear completed tasks

### Weather Widget
- Search for weather by city
- Toggle between Fahrenheit and Celsius
- Display temperature, feels-like, humidity, wind speed, and pressure
- (Note: This is a demo version that simulates weather data)

### Notes App
- Rich text editing with formatting options
- Create headings with double Enter
- Auto-save functionality
- Highlight text
- Persistent storage in browser localStorage

## PWA Installation

In Chrome, Edge, or other modern browsers:
1. Open the dashboard in your browser
2. Look for the install icon in the address bar or menu
3. Click to install as a standalone application on your device

## Creating PWA Icons

For full PWA functionality, you should replace the placeholder icons:

1. Create icons in sizes 192x192 and 512x512 pixels
2. Save them as PNG files in the `/public/icons` directory as:
   - `icon-192x192.png`
   - `icon-512x512.png`

## Development

- Use `npm run start` for development with hot-reloading
- The codebase is structured as follows:
  - `/src/components/`: React components for the dashboard modules
  - `/modules/`: Vanilla JS modules (like the notes app)
  - `/public/`: Static assets and PWA manifest

## License

This project is open source and available for personal use.