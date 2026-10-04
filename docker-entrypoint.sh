#!/bin/sh
set -e

# Default PORT to 8080 if not passed by Cloud Run
export PORT="${PORT:-8080}"

# Substitute PORT in nginx template
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Generate dynamic config.js from container environment variables
cat <<EOF > /usr/share/nginx/html/config.js
window.__APP_ENV__ = {
  VITE_GEMINI_API_KEY: "${VITE_GEMINI_API_KEY:-}",
  VITE_FIREBASE_API_KEY: "${VITE_FIREBASE_API_KEY:-}",
  VITE_FIREBASE_AUTH_DOMAIN: "${VITE_FIREBASE_AUTH_DOMAIN:-}",
  VITE_FIREBASE_PROJECT_ID: "${VITE_FIREBASE_PROJECT_ID:-}",
  VITE_FIREBASE_STORAGE_BUCKET: "${VITE_FIREBASE_STORAGE_BUCKET:-}",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "${VITE_FIREBASE_MESSAGING_SENDER_ID:-}",
  VITE_FIREBASE_APP_ID: "${VITE_FIREBASE_APP_ID:-}",
  VITE_FIREBASE_MEASUREMENT_ID: "${VITE_FIREBASE_MEASUREMENT_ID:-}"
};
EOF

# Execute the container command (nginx)
exec "$@"
