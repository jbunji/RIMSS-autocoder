# RIMSS Deployment Guide - Google Cloud Run

This guide walks you through deploying RIMSS to Google Cloud Run with a custom domain.

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed: https://cloud.google.com/sdk/docs/install
3. **Docker** installed: https://docs.docker.com/get-docker/
4. **Domain name** (e.g., justinbundrick.io) - you can set this up later

## Quick Start (Automated)

```bash
# 1. Set your project ID
export GCP_PROJECT_ID="your-project-id"

# 2. Run the deployment script
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

The script will:
- Enable required APIs
- Create Artifact Registry repository
- Create Cloud SQL PostgreSQL instance
- Create secrets in Secret Manager
- Build and push Docker image
- Deploy to Cloud Run

---

## Manual Deployment (Step-by-Step)

### Step 1: Initial Setup

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create rimss-prod --name="RIMSS Production"

# Set as active project
gcloud config set project rimss-prod

# Enable billing (required - do this in Cloud Console)
# https://console.cloud.google.com/billing

# Enable required APIs
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com
```

### Step 2: Create Cloud SQL Database

```bash
# Create PostgreSQL instance (~$10-25/month for db-f1-micro)
gcloud sql instances create rimss-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password="$(openssl rand -base64 32)"

# Create database
gcloud sql databases create rimss_prod --instance=rimss-db

# Create user (save this password!)
gcloud sql users create rimss \
    --instance=rimss-db \
    --password="YOUR_SECURE_PASSWORD_HERE"
```

### Step 3: Create Secrets

```bash
# Create JWT secret
openssl rand -base64 64 | tr -d '\n' | \
    gcloud secrets create rimss-jwt-secret --data-file=-

# Create database URL secret
# Format: postgresql://USER:PASSWORD@/DATABASE?host=/cloudsql/PROJECT:REGION:INSTANCE
echo -n "postgresql://rimss:YOUR_PASSWORD@/rimss_prod?host=/cloudsql/rimss-prod:us-central1:rimss-db" | \
    gcloud secrets create rimss-database-url --data-file=-
```

### Step 4: Create Artifact Registry

```bash
# Create Docker repository
gcloud artifacts repositories create rimss-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="RIMSS Docker repository"

# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### Step 5: Build and Push Docker Image

```bash
# Navigate to project root (where frontend/ and backend/ directories are)
cd /path/to/RIMSS-autocoder

# Build the image
docker build -t us-central1-docker.pkg.dev/rimss-prod/rimss-repo/rimss:latest \
    -f deployment/Dockerfile .

# Push to Artifact Registry
docker push us-central1-docker.pkg.dev/rimss-prod/rimss-repo/rimss:latest
```

### Step 6: Deploy to Cloud Run

```bash
gcloud run deploy rimss \
    --image=us-central1-docker.pkg.dev/rimss-prod/rimss-repo/rimss:latest \
    --platform=managed \
    --region=us-central1 \
    --allow-unauthenticated \
    --port=8080 \
    --memory=1Gi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --set-env-vars="NODE_ENV=production" \
    --set-secrets="DATABASE_URL=rimss-database-url:latest,JWT_SECRET=rimss-jwt-secret:latest" \
    --add-cloudsql-instances="rimss-prod:us-central1:rimss-db"
```

### Step 7: Run Database Migrations

After deployment, you need to run Prisma migrations:

```bash
# Option A: Using Cloud Run Jobs (recommended)
gcloud run jobs create rimss-migrate \
    --image=us-central1-docker.pkg.dev/rimss-prod/rimss-repo/rimss:latest \
    --region=us-central1 \
    --set-secrets="DATABASE_URL=rimss-database-url:latest" \
    --add-cloudsql-instances="rimss-prod:us-central1:rimss-db" \
    --command="npx" \
    --args="prisma,migrate,deploy"

gcloud run jobs execute rimss-migrate --region=us-central1

# Option B: Connect directly and run manually
gcloud sql connect rimss-db --user=rimss --database=rimss_prod
# Then run the SQL from your migration files
```

---

## Custom Domain Setup

### Option A: Direct Domain Mapping (Simplest)

```bash
# 1. Verify domain ownership
gcloud domains verify justinbundrick.io

# 2. Map domain to Cloud Run service
gcloud run domain-mappings create \
    --service=rimss \
    --domain=justinbundrick.io \
    --region=us-central1

# 3. Get DNS records to configure
gcloud run domain-mappings describe \
    --domain=justinbundrick.io \
    --region=us-central1
```

Then add these DNS records at your domain registrar:
- **A record**: `@` → (IP from above command)
- **AAAA record**: `@` → (IPv6 from above command)

SSL certificate is automatically provisioned (takes 15 min to 24 hours).

### Option B: Cloud Load Balancer (Production)

For more control, use a load balancer:

```bash
# 1. Reserve static IP
gcloud compute addresses create rimss-ip --global

# 2. Create serverless NEG
gcloud compute network-endpoint-groups create rimss-neg \
    --region=us-central1 \
    --network-endpoint-type=serverless \
    --cloud-run-service=rimss

# 3. Create backend service
gcloud compute backend-services create rimss-backend \
    --global \
    --load-balancing-scheme=EXTERNAL_MANAGED

gcloud compute backend-services add-backend rimss-backend \
    --global \
    --network-endpoint-group=rimss-neg \
    --network-endpoint-group-region=us-central1

# 4. Create URL map
gcloud compute url-maps create rimss-urlmap \
    --default-service=rimss-backend

# 5. Create SSL certificate
gcloud compute ssl-certificates create rimss-cert \
    --domains=justinbundrick.io,www.justinbundrick.io \
    --global

# 6. Create HTTPS proxy
gcloud compute target-https-proxies create rimss-https-proxy \
    --ssl-certificates=rimss-cert \
    --url-map=rimss-urlmap

# 7. Create forwarding rule
gcloud compute forwarding-rules create rimss-https-rule \
    --global \
    --target-https-proxy=rimss-https-proxy \
    --ports=443 \
    --address=rimss-ip

# 8. Get IP for DNS
gcloud compute addresses describe rimss-ip --global --format='value(address)'
```

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing (64+ chars) | Yes |
| `NODE_ENV` | Set to `production` | Yes |
| `PORT` | Server port (Cloud Run sets to 8080) | Auto |
| `FRONTEND_URL` | Your domain URL (for CORS) | Optional |

---

## Useful Commands

```bash
# View logs
gcloud run services logs read rimss --region=us-central1

# View service details
gcloud run services describe rimss --region=us-central1

# Update environment variable
gcloud run services update rimss \
    --region=us-central1 \
    --set-env-vars="NEW_VAR=value"

# Scale to always-on (prevents cold starts, costs more)
gcloud run services update rimss \
    --region=us-central1 \
    --min-instances=1

# Delete service (careful!)
gcloud run services delete rimss --region=us-central1
```

---

## Estimated Monthly Costs

| Service | Tier | Cost |
|---------|------|------|
| Cloud Run | 1 vCPU, 1GB RAM, ~100k requests | ~$5-20 |
| Cloud SQL | db-f1-micro (shared) | ~$10-15 |
| Artifact Registry | Storage | ~$1-2 |
| Cloud Load Balancer | (if used) | ~$18 |
| **Total** | | **~$15-55/month** |

*Costs vary based on usage. Cloud Run charges only when handling requests (unless min-instances > 0).*

---

## Troubleshooting

### Container fails to start

```bash
# Check logs
gcloud run services logs read rimss --region=us-central1 --limit=50

# Common issues:
# - DATABASE_URL not set correctly
# - Prisma client not generated
# - Port mismatch (must use PORT env var)
```

### Database connection errors

```bash
# Verify Cloud SQL connection
gcloud sql instances describe rimss-db

# Check if Cloud Run can reach Cloud SQL
# Make sure --add-cloudsql-instances is set correctly
```

### SSL certificate pending

SSL provisioning can take up to 24 hours. Check status:

```bash
gcloud run domain-mappings describe \
    --domain=justinbundrick.io \
    --region=us-central1
```

### Cold starts are slow

```bash
# Set minimum instances (costs more)
gcloud run services update rimss \
    --region=us-central1 \
    --min-instances=1
```

---

## Security Checklist

- [ ] JWT_SECRET is at least 64 characters
- [ ] Database password is strong and unique
- [ ] Secrets stored in Secret Manager (not env vars)
- [ ] HTTPS enforced (automatic with Cloud Run)
- [ ] `--allow-unauthenticated` removed if using IAP
- [ ] Cloud SQL has SSL enabled
- [ ] Minimal Cloud Run permissions (principle of least privilege)

---

## Next Steps After Deployment

1. **Run migrations** to set up database schema
2. **Create admin user** via seed script or direct SQL
3. **Configure custom domain** DNS records
4. **Set up monitoring** in Cloud Console
5. **Configure alerts** for errors and latency
6. **Set up CI/CD** with Cloud Build triggers (optional)
