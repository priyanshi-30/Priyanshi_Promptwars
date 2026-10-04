#!/usr/bin/env bash
set -e

SERVICE_NAME="${1:-promptwars-app}"
REGION="${2:-us-central1}"
PROJECT_ID="${3:-$(gcloud config get-value project 2>/dev/null || true)}"

echo "=========================================================="
echo "  Deploying 'The Blind Spot' to Google Cloud Run"
echo "=========================================================="

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
  read -rp "Enter your Google Cloud Project ID: " PROJECT_ID
fi

if [ -z "$PROJECT_ID" ]; then
  echo "Error: Project ID is required."
  exit 1
fi

echo "Project ID:   $PROJECT_ID"
echo "Region:       $REGION"
echo "Service Name: $SERVICE_NAME"
echo ""

gcloud config set project "$PROJECT_ID"

echo "[1/3] Enabling Google Cloud APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

echo "[2/3] Building container and deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --allow-unauthenticated \
  --platform managed

echo "[3/3] Setting public unauthenticated access policy (allUsers)..."
gcloud run services add-iam-policy-binding "$SERVICE_NAME" \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --member="allUsers" \
  --role="roles/run.invoker"

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --project "$PROJECT_ID" --format="value(status.url)")

echo ""
echo "=========================================================="
echo "  SUCCESS! Application is LIVE and PUBLICLY ACCESSIBLE!"
echo "  Live URL: $SERVICE_URL"
echo "=========================================================="
