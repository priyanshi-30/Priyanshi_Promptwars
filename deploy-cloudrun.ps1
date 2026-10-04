<#
.SYNOPSIS
Deploy The Blind Spot (PromptWars) to Google Cloud Run with Public Access

.DESCRIPTION
This script checks the Google Cloud CLI, sets the project, enables necessary APIs,
and builds & deploys to Cloud Run with public access (--allow-unauthenticated).
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = "",

    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",

    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "promptwars-app"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Deploying 'The Blind Spot' to Google Cloud Run" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verify gcloud CLI is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "[!] 'gcloud' CLI is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Quick Solutions:" -ForegroundColor Yellow
    Write-Host "  Option 1 (Zero Install - Fastest): Use Google Cloud Shell:" -ForegroundColor White
    Write-Host "    https://shell.cloud.google.com" -ForegroundColor Cyan
    Write-Host "  Option 2: Install Google Cloud SDK on this machine:" -ForegroundColor White
    Write-Host "    winget install Google.CloudSDK" -ForegroundColor Cyan
    exit 1
}

# 2. Get or prompt for Project ID
if ([string]::IsNullOrWhiteSpace($ProjectId)) {
    $ProjectId = gcloud config get-value project 2>$null
    if ([string]::IsNullOrWhiteSpace($ProjectId) -or $ProjectId -eq "(unset)") {
        $ProjectId = Read-Host "Enter your Google Cloud Project ID"
    }
}

if ([string]::IsNullOrWhiteSpace($ProjectId)) {
    Write-Host "[ERROR] Project ID is required." -ForegroundColor Red
    exit 1
}

Write-Host "`nTarget Project: $ProjectId" -ForegroundColor Green
Write-Host "Target Region:  $Region" -ForegroundColor Green
Write-Host "Service Name:   $ServiceName`n" -ForegroundColor Green

# 3. Set default project
gcloud config set project $ProjectId

# 4. Enable required APIs
Write-Host "[1/3] Enabling required Google Cloud APIs (Cloud Run, Cloud Build, Artifact Registry)..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# 5. Build and deploy container directly to Cloud Run
Write-Host "`n[2/3] Building container with Cloud Build & deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --source . `
    --region $Region `
    --project $ProjectId `
    --allow-unauthenticated `
    --platform managed

# 6. Ensure public access permissions (roles/run.invoker to allUsers)
Write-Host "`n[3/3] Ensuring public unauthenticated access (allUsers)..." -ForegroundColor Yellow
gcloud run services add-iam-policy-binding $ServiceName `
    --region $Region `
    --project $ProjectId `
    --member="allUsers" `
    --role="roles/run.invoker"

# 7. Get and print Service URL
$ServiceUrl = gcloud run services describe $ServiceName --region $Region --project $ProjectId --format="value(status.url)"

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Application is LIVE and PUBLICLY ACCESSIBLE!" -ForegroundColor Green
Write-Host "  Live URL: $ServiceUrl" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
