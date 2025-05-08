#!/bin/bash

echo "Setting up the Personal Dashboard PWA..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm, which typically comes with Node.js."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create placeholder icons directory
mkdir -p public/icons

echo "Setup complete! You can now run the dashboard with:"
echo "  npm start"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "Remember to add your PWA icons to public/icons/ directory:"
echo "  - icon-192x192.png"
echo "  - icon-512x512.png"