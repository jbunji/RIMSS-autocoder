#!/bin/bash
# =============================================================================
# RIMSS Deployment Script for Google Cloud Run
# Usage: ./deploy.sh
# =============================================================================

set -e  # Exit on error

# =============================================================================
# CONFIGURATION - Edit these values
# =============================================================================
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="rimss"
REPO_NAME="rimss-repo"
DB_INSTANCE="rimss-db"
DB_NAME="rimss_prod"
DB_USER="rimss"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_step() {
    echo -e "\n${GREEN}==>${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}Warning:${NC} $1"
}

echo_error() {
    echo -e "${RED}Error:${NC} $1"
}

# =============================================================================
# PRE-FLIGHT CHECKS
# =============================================================================
echo_step "Running pre-flight checks..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo_error "gcloud CLI is not installed. Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo_error "Docker is not installed. Install from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if logged in
if ! gcloud auth print-identity-token &> /dev/null; then
    echo_warn "Not logged into gcloud. Running 'gcloud auth login'..."
    gcloud auth login
fi

# Set project
echo_step "Setting project to: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

# =============================================================================
# ENABLE APIs
# =============================================================================
echo_step "Enabling required Google Cloud APIs..."
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    --quiet

# =============================================================================
# CREATE ARTIFACT REGISTRY (if not exists)
# =============================================================================
echo_step "Creating Artifact Registry repository..."
gcloud artifacts repositories create "$REPO_NAME" \
    --repository-format=docker \
    --location="$REGION" \
    --description="RIMSS Docker repository" \
    --quiet 2>/dev/null || echo "Repository already exists"

# Configure Docker auth
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet

# =============================================================================
# CREATE CLOUD SQL INSTANCE (if not exists)
# =============================================================================
echo_step "Checking Cloud SQL instance..."
if ! gcloud sql instances describe "$DB_INSTANCE" --quiet 2>/dev/null; then
    echo_step "Creating Cloud SQL PostgreSQL instance (this may take a few minutes)..."
    gcloud sql instances create "$DB_INSTANCE" \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region="$REGION" \
        --root-password="$(openssl rand -base64 32)" \
        --quiet

    echo_step "Creating database..."
    gcloud sql databases create "$DB_NAME" --instance="$DB_INSTANCE" --quiet

    echo_step "Creating database user..."
    DB_PASSWORD=$(openssl rand -base64 24)
    gcloud sql users create "$DB_USER" \
        --instance="$DB_INSTANCE" \
        --password="$DB_PASSWORD" \
        --quiet

    echo -e "${YELLOW}IMPORTANT: Save this database password: $DB_PASSWORD${NC}"
else
    echo "Cloud SQL instance already exists"
fi

# =============================================================================
# CREATE SECRETS (if not exists)
# =============================================================================
echo_step "Setting up secrets..."

# JWT Secret
if ! gcloud secrets describe rimss-jwt-secret --quiet 2>/dev/null; then
    echo "Creating JWT secret..."
    JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    echo -n "$JWT_SECRET" | gcloud secrets create rimss-jwt-secret --data-file=- --quiet
    echo -e "${YELLOW}JWT Secret created and stored${NC}"
fi

# Database URL - you'll need to set this manually after getting the password
if ! gcloud secrets describe rimss-database-url --quiet 2>/dev/null; then
    echo_warn "You need to create the database URL secret manually:"
    echo "  gcloud secrets create rimss-database-url --data-file=-"
    echo "  Then enter: postgresql://$DB_USER:PASSWORD@/$DB_NAME?host=/cloudsql/$PROJECT_ID:$REGION:$DB_INSTANCE"
fi

# =============================================================================
# BUILD AND PUSH DOCKER IMAGE
# =============================================================================
echo_step "Building Docker image..."
cd "$(dirname "$0")/.."  # Go to project root

IMAGE_TAG="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME:latest"

docker build -t "$IMAGE_TAG" -f deployment/Dockerfile .

echo_step "Pushing image to Artifact Registry..."
docker push "$IMAGE_TAG"

# =============================================================================
# DEPLOY TO CLOUD RUN
# =============================================================================
echo_step "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image="$IMAGE_TAG" \
    --platform=managed \
    --region="$REGION" \
    --allow-unauthenticated \
    --port=8080 \
    --memory=1Gi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --set-env-vars="NODE_ENV=production" \
    --set-secrets="DATABASE_URL=rimss-database-url:latest,JWT_SECRET=rimss-jwt-secret:latest" \
    --add-cloudsql-instances="$PROJECT_ID:$REGION:$DB_INSTANCE" \
    --quiet

# =============================================================================
# GET SERVICE URL
# =============================================================================
echo_step "Deployment complete!"
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(status.url)')
echo -e "${GREEN}Your application is running at: $SERVICE_URL${NC}"

echo ""
echo "Next steps:"
echo "  1. Set up your custom domain (see README.md)"
echo "  2. Run database migrations"
echo "  3. Create initial admin user"
echo ""
echo "To view logs:"
echo "  gcloud run services logs read $SERVICE_NAME --region=$REGION"
