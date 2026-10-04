# ----------------------------------------------------
# Stage 1: Build the Vite production bundle
# ----------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Clean install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy full application source
COPY . .

# Optional build-time arguments (if baked at build time)
ARG VITE_GEMINI_API_KEY=""
ARG VITE_FIREBASE_API_KEY=""
ARG VITE_FIREBASE_AUTH_DOMAIN=""
ARG VITE_FIREBASE_PROJECT_ID=""
ARG VITE_FIREBASE_STORAGE_BUCKET=""
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=""
ARG VITE_FIREBASE_APP_ID=""
ARG VITE_FIREBASE_MEASUREMENT_ID=""

ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY \
    VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

# Build static bundle to /app/dist
RUN npm run build

# ----------------------------------------------------
# Stage 2: Production Nginx Server for Cloud Run
# ----------------------------------------------------
FROM nginx:1.27-alpine AS runner

# Install gettext for envsubst support
RUN apk add --no-cache gettext

# Copy compiled static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx template and container entrypoint
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

# Cloud Run dynamically assigns PORT (default 8080)
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
