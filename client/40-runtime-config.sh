#!/bin/sh
echo "window.__API_URL__ = \"${VITE_API_URL:-}\";" > /usr/share/nginx/html/config.js
