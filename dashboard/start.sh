#!/bin/bash

echo "Starting Personal Dashboard PWA server..."
echo "Once the server is running, open your browser and go to: http://localhost:8000"

# Check if Python is available
if command -v python3 &>/dev/null; then
    echo "Using Python 3 HTTP server"
    python3 -m http.server 8000
    exit 0
elif command -v python &>/dev/null; then
    # Check if it's Python 3
    PYTHON_VERSION=$(python --version 2>&1)
    if [[ $PYTHON_VERSION == *"Python 3"* ]]; then
        echo "Using Python 3 HTTP server"
        python -m http.server 8000
        exit 0
    else
        echo "Using Python 2 HTTP server"
        python -m SimpleHTTPServer 8000
        exit 0
    fi
fi

# Check if http-server is available
if command -v http-server &>/dev/null; then
    echo "Using Node.js http-server"
    http-server -p 8000
    exit 0
fi

# Check if PHP is available
if command -v php &>/dev/null; then
    echo "Using PHP server"
    php -S localhost:8000
    exit 0
fi

echo "Error: Could not find a suitable web server."
echo "Please install one of the following:"
echo "  - Python 3 (recommended)"
echo "  - Node.js with http-server (npm install -g http-server)"
echo "  - PHP"
echo ""
echo "Then run this script again."
exit 1