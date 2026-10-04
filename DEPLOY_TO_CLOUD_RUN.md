# Deploying "The Blind Spot" to Google Cloud Run (Public Access)

This guide walks you through deploying **The Blind Spot** to **Google Cloud Run** so that anyone in the world can access it via a public HTTPS URL.

---

## 🚀 Quick Start: Choose Your Deployment Method

| Method | Best For | Prerequisites | Estimated Time |
| :--- | :--- | :--- | :--- |
| **[Method 1: Cloud Shell (Recommended)](#method-1-google-cloud-shell-fastest--no-install)** | **Fastest, easiest, 100% in browser** | Any web browser + Google Account | **2 minutes** |
| **[Method 2: Google Cloud Console (UI)](#method-2-google-cloud-console-web-ui)** | **Visual click-through without commands** | Google Cloud Console access | **3 minutes** |
| **[Method 3: Local Windows CLI](#method-3-local-cli-on-windows)** | **Local development terminal** | PowerShell + `gcloud` CLI | **5 minutes** |
| **[Method 4: Automated GitHub Actions](#method-4-continuous-deployment-with-github-actions)** | **Automated deploy on git push** | GitHub Repository | **Setup once** |

---

## Method 1: Google Cloud Shell (Fastest & No Install)

Google Cloud Shell is a free, pre-configured terminal that runs directly in your browser with `gcloud`, `docker`, and `git` already installed and authenticated.

### Step 1: Open Cloud Shell
1. Go to **[https://shell.cloud.google.com](https://shell.cloud.google.com)**.
2. Select your Google Cloud project (or create a new one).

### Step 2: Clone & Deploy
In the Cloud Shell terminal, run:

```bash
# 1. Clone your repository
git clone https://github.com/priyanshi-30/Priyanshi_Promptwars.git
cd Priyanshi_Promptwars

# 2. Run the deployment script (or deploy directly)
chmod +x deploy-cloudrun.sh
./deploy-cloudrun.sh
```

*Or run the single command directly:*
```bash
gcloud run deploy promptwars-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

When prompted:
- **Source code location:** Press Enter (defaults to current directory `.`).
- **Allow unauthenticated invocations:** Type `y` (Press Enter).

### Step 3: Access Your Live Application!
Cloud Run will build the container image and display your live URL:
```
Service [promptwars-app] revision [promptwars-app-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://promptwars-app-xxxx-uc.a.run.app
```
Share this URL with anyone—it is live on the internet with automatic SSL/HTTPS!

---

## Method 2: Google Cloud Console (Web UI)

If you prefer using the Google Cloud web interface:

1. Open the **[Google Cloud Run Console](https://console.cloud.google.com/run)**.
2. Click **Create Service**.
3. Select **Continuously deploy from a repository** (or **Deploy one revision from an existing container image / source code**).
4. Connect to your GitHub repository: `priyanshi-30/Priyanshi_Promptwars`.
5. Configuration:
   - **Service name:** `promptwars-app`
   - **Region:** `us-central1` (or your preferred region)
   - **Authentication:** Select **"Allow unauthenticated invocations"** *(Essential so everyone can access)*
   - **Ingress control:** Select **"All"** (Allow traffic directly from the internet)
6. Expand **Container, Volumes, Networking, Security** -> **Variables & Secrets**:
   - Add environment variable (optional):
     - `VITE_GEMINI_API_KEY`: `your_gemini_api_key_here`
7. Click **Create**.
8. Within 1–2 minutes, your service will be ready and display the public HTTPS link at the top.

---

## Method 3: Local CLI on Windows

If you want to deploy directly from your local Windows terminal:

### Step 1: Install Google Cloud SDK
Open PowerShell as Administrator and run:
```powershell
winget install Google.CloudSDK
```
*Restart PowerShell after installation completes.*

### Step 2: Authenticate and Set Project
```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 3: Run Deployment Script
From this project folder:
```powershell
.\deploy-cloudrun.ps1
```

---

## Method 4: Continuous Deployment with GitHub Actions

A GitHub Actions workflow is included at [`.github/workflows/deploy-cloudrun.yml`](file:///.github/workflows/deploy-cloudrun.yml).

To activate automatic deployments on every `git push`:
1. In your GitHub repository, go to **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following repository secrets:
   - `GCP_PROJECT_ID`: Your Google Cloud project ID.
   - `GCP_SA_KEY`: The JSON key of a Service Account with roles:
     - `Cloud Run Admin`
     - `Artifact Registry Administrator`
     - `Storage Admin`
     - `Service Account User`
3. Every push to the `main` branch will build and deploy automatically to Cloud Run.

---

## 🔑 Environment Variables & Secrets (Gemini API & Firebase)

The application includes a runtime environment injector ([`docker-entrypoint.sh`](file:///docker-entrypoint.sh) & [`public/config.js`](file:///public/config.js)), allowing you to update API keys directly in Cloud Run **without rebuilding the Docker image**.

### Setting Environment Variables in Cloud Run:

Using `gcloud`:
```bash
gcloud run services update promptwars-app \
  --region us-central1 \
  --set-env-vars VITE_GEMINI_API_KEY="your-gemini-api-key"
```

Or in Google Cloud Console:
1. Go to **Cloud Run** -> Click **promptwars-app**.
2. Click **Edit & Deploy New Revision**.
3. Go to the **Variables & Secrets** tab.
4. Add the variables:
   - `VITE_GEMINI_API_KEY`: *(Your Google AI Studio Gemini API key)*
   - `VITE_FIREBASE_API_KEY`: *(Optional Firebase API key)*
   - `VITE_FIREBASE_PROJECT_ID`: *(Optional Firebase project)*
5. Click **Deploy**.

> **Note:** If no Gemini API key is configured, the application automatically runs in **Resilient Local Socratic Engine Mode** using internal reasoning frameworks!

---

## 🌐 Ensuring 100% Public Access ("allUsers")

To guarantee anyone in the world can access the application without a Google Cloud login, Cloud Run requires the `roles/run.invoker` role assigned to `allUsers`.

If you receive a `403 Forbidden` error when visiting the URL, run:
```bash
gcloud run services add-iam-policy-binding promptwars-app \
  --region us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

### If your Organization blocks public access:
If you are using a corporate or school Google Cloud organization that enforces the `iam.allowedPolicyMemberDomains` constraint:
1. Go to **IAM & Admin** -> **Organization Policies**.
2. Search for **"Domain restricted sharing"** (`constraints/iam.allowedPolicyMemberDomains`).
3. Click **Edit Policy** -> Select **Override parent's policy** -> **Allow all**.
4. Re-run the `add-iam-policy-binding` command above.

---

## 🛠️ Architecture & Production Enhancements

- **Multi-stage Dockerfile**: Clean separation of Node.js 20 build stage and Nginx Alpine runtime stage for a minimal image footprint (<30MB).
- **Dynamic Port Binding**: Conforms to Cloud Run's `$PORT` specification using Nginx template substitution.
- **SPA Routing**: Single Page Application routing handled gracefully via Nginx `try_files $uri $uri/ /index.html;`.
- **Performance Optimization**: Automatic Gzip compression and 1-year immutable caching for static JS/CSS bundles.
- **Built-in Health Checks**: Dedicated `/healthz` endpoint returning HTTP 200 for zero-downtime health checking.
