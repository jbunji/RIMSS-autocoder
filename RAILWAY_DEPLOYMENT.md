# RIMSS Railway Deployment Guide

Complete guide for deploying RIMSS (Remote Independent Maintenance Status System) to Railway.

**Table of Contents:**
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Service Setup](#backend-service-setup)
4. [Environment Variables](#environment-variables)
5. [Deployment](#deployment)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying to Railway, ensure you have:

- **Railway Account** - Sign up at https://railway.app/
- **GitHub Repository Access** - Ensure your repo is accessible: https://github.com/jbunji/RIMSS-autocoder.git
- **Railway CLI** (Optional, for advanced deployments): `npm install -g @railway/cli`
- **Git** - For pushing code changes

**Local Environment:**
- Node.js 20+
- pnpm 8.15.6+
- PostgreSQL 15+ (for local testing)

---

## Database Setup

### Step 1: Create PostgreSQL Database on Railway

1. Log in to Railway: https://railway.app/
2. Click **"New Project"** → **"Provision PostgreSQL"**
3. Railway will create a PostgreSQL database with connection details
4. Note the following from your database service:
   - **DATABASE_URL** (found in Variables tab)
   - Format: `postgresql://username:password@host:port/database`

### Step 2: Configure Database

1. In your PostgreSQL service on Railway:
   - Go to the **"Variables"** tab
   - Copy the `DATABASE_URL` value (you'll need this for the backend)

2. (Optional) Enable backups:
   - Go to **"Settings"** → **"Backups"**
   - Enable daily backups for production

---

## Backend Service Setup

### Step 1: Connect Your GitHub Repository

1. In Railway, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub account
4. Search for and select: **RIMSS-autocoder**
5. Click **"Deploy Now"**

### Step 2: Configure Build Settings

Railway should automatically detect your project structure. If not, create a `railway.toml` file in your project root:

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "deployment/Dockerfile"

[deploy]
startCommand = "node dist/index.js"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
```

**Note:** Your existing Dockerfile at `deployment/Dockerfile` should work with Railway. Railway will:
- Build the frontend (Vite)
- Build the backend (TypeScript)
- Serve the combined application

### Step 3: Configure Service Settings

In your Railway service:

1. **Root Directory**: Set to `./` (project root)
2. **Builder**: Select **Dockerfile**
3. **Dockerfile Path**: `deployment/Dockerfile`
4. **Port**: Railway will auto-detect from `EXPOSE 8080` in Dockerfile

---

## Environment Variables

### Backend Environment Variables

Navigate to your service → **Variables** tab and add:

#### Required Variables

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `DATABASE_URL` | `postgresql://postgres:password@host.railway.app:5432/railway` | From your PostgreSQL service |
| `JWT_SECRET` | `generate-a-secure-random-string-50-chars` | Use a cryptographically secure random string |
| `JWT_EXPIRES_IN` | `30m` | JWT token expiration (30 minutes) |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token expiration (7 days) |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `8080` | Port exposed in Dockerfile |
| `FRONTEND_URL` | `https://your-app.railway.app` | Your Railway app domain (auto-assigned) |

#### Generating a Secure JWT Secret

Generate a secure JWT secret using one of these methods:

**Option 1 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2 - OpenSSL:**
```bash
openssl rand -hex 32
```

**Option 3 - Online:**
Visit: https://generate-random.org/api-key-generator

### Step 2: Reference Database Service

If you created the database in the same Railway project:

1. Go to **Variables** tab
2. Add `DATABASE_URL` variable
3. Click the **{{database}}** reference dropdown
4. Select your PostgreSQL service
5. Railway will inject the correct connection string

This ensures the `DATABASE_URL` updates automatically if the database is recreated.

---

## Deployment

### Step 1: Initial Deployment

1. Push your code to GitHub (if not already):
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. In Railway:
   - Click **"Deploy"** on your service
   - Railway will build and deploy your Dockerfile
   - Monitor the build logs for any errors

3. Wait for deployment to complete (typically 5-10 minutes)
   - Watch the **"Logs"** tab for progress
   - Look for: "Server running on port 8080"

### Step 2: Verify Deployment

Once deployment completes:

1. Get your app's URL from Railway (top of service page)
2. Test the health endpoint:
   ```bash
   curl https://your-app-name.railway.app/api/health
   ```

3. Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-01-23T12:00:00.000Z"
   }
   ```

4. Visit your app in a browser:
   - Navigate to: `https://your-app-name.railway.app`
   - You should see the RIMSS login screen

---

## Post-Deployment

### Step 1: Run Database Migrations

Railway doesn't automatically run Prisma migrations. You have two options:

#### Option A: Run via Railway Console (Recommended)

1. Go to your service → **"Deployments"** tab
2. Click on the latest deployment
3. Click **"Console"** button (shell icon)
4. In the console:
   ```bash
   npx prisma migrate deploy
   ```
5. This applies all pending migrations to your database

#### Option B: Set Up Automatic Migrations

Add a migration script to your `backend/package.json`:

```json
{
  "scripts": {
    "migrate:deploy": "prisma migrate deploy"
  }
}
```

Then update your `deployment/Dockerfile` to run migrations on startup (before the CMD):

```dockerfile
# Run migrations before starting server
RUN npx prisma migrate deploy || echo "No migrations to run"
```

### Step 2: Seed Initial Data (Optional)

If you have a seed script (`backend/prisma/seed.ts`):

1. In Railway Console:
   ```bash
   npx prisma db seed
   ```

2. This creates:
   - Default admin user (if seed script includes it)
   - Initial code tables
   - Reference data

### Step 3: Create Admin User

If no seed script exists, create an admin user via Prisma Studio or direct SQL:

**Option 1 - Prisma Studio:**
1. In Railway Console:
   ```bash
   npx prisma studio
   ```
2. Railway will provide a temporary URL
3. Navigate to the Studio interface
4. Add a user to the `users` table with:
   - `role`: "ADMIN"
   - `active`: true
   - Generate password hash using bcrypt (or use a test password)

**Option 2 - Direct SQL (in Console):**
```sql
INSERT INTO users (username, password_hash, email, first_name, last_name, role, active)
VALUES (
  'admin',
  '$2a$10$abcdefghijklmnopqrstuvwxyz123456', -- Replace with actual hash
  'admin@rimss.local',
  'System',
  'Administrator',
  'ADMIN',
  true
);
```

### Step 4: Configure Custom Domain (Optional)

1. Go to your service → **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Enter your domain (e.g., `rimss.yourdomain.com`)
4. Update DNS records per Railway's instructions
5. Update `FRONTEND_URL` environment variable

### Step 5: Set Up Monitoring

1. **Enable Metrics:**
   - Go to **"Metrics"** tab
   - Monitor CPU, memory, and network usage

2. **Set Up Alerts:**
   - Go to **"Settings"** → **"Notifications"**
   - Configure email/Slack alerts for:
     - Deployment failures
     - High memory/CPU usage
     - Crash restarts

3. **View Logs:**
   - Go to **"Logs"** tab
   - Filter by timestamp or level
   - Set up log retention in settings

---

## Troubleshooting

### Issue 1: Build Failures

**Problem:** Docker build fails during deployment

**Solutions:**
1. Check build logs in Railway → **Deployments** → click deployment → **Logs**
2. Verify Dockerfile path is correct: `deployment/Dockerfile`
3. Ensure all dependencies are in `package.json`
4. Check for platform-specific dependencies (Railway uses Linux)

Common fixes:
- Add `--frozen-lockfile=false` to pnpm install if lock file issues
- Ensure Dockerfile uses `node:20-alpine` base image
- Check that `pnpm@8.15.6` is compatible

### Issue 2: Database Connection Errors

**Problem:** App can't connect to PostgreSQL

**Solutions:**
1. Verify `DATABASE_URL` is correct in Variables tab
2. Ensure database service is running (check PostgreSQL service logs)
3. Check for firewall rules (Railway services auto-connect)
4. Test connection in Console:
   ```bash
   psql $DATABASE_URL
   ```

### Issue 3: Migration Failures

**Problem:** Prisma migrations fail

**Solutions:**
1. Ensure `DATABASE_URL` is set
2. Run `npx prisma generate` first
3. Check migration files exist in `backend/prisma/migrations`
4. Run with verbose flag:
   ```bash
   npx prisma migrate deploy --verbose
   ```

### Issue 4: Port Not Accessible

**Problem:** Can't reach app on port 8080

**Solutions:**
1. Verify `PORT=8080` is set in environment variables
2. Check Dockerfile has `EXPOSE 8080`
3. Ensure healthcheck path is correct: `/api/health`
4. Check Railway service isn't sleeping (click to wake up)

### Issue 5: JWT Authentication Errors

**Problem:** Login fails or tokens rejected

**Solutions:**
1. Verify `JWT_SECRET` is set and long enough (32+ chars)
2. Check `JWT_EXPIRES_IN` format is valid (e.g., "30m", "7d")
3. Ensure `FRONTEND_URL` matches your Railway domain
4. Clear browser cookies/localStorage and retry

### Issue 6: File Upload Failures

**Problem:** Attachment uploads fail

**Solutions:**
1. Railway's filesystem is ephemeral - files are lost on redeployment
2. Consider using Railway Volume or S3 for persistent storage
3. Check upload directory exists: `mkdir -p uploads`
4. Verify `multer` middleware is configured correctly

### Issue 7: Memory/CPU Limits

**Problem:** App crashes or runs slowly

**Solutions:**
1. Check current plan limits in **Settings** → **Plan**
2. Upgrade plan if needed (Railway offers free tier with limits)
3. Optimize queries and add indexes to database
4. Enable caching (Redis addon available on Railway)

---

## Railway-Specific Considerations

### Ephemeral Filesystem

**Important:** Railway's filesystem is temporary. Files written to disk are lost when:
- Service restarts
- New deployment is pushed
- Service migrates to another host

**Solutions for File Storage:**

**Option 1: Railway Volumes (Persistent Storage)**
1. Add volume to service: **Settings** → **Volumes**
2. Mount path: `/app/uploads`
3. Files persist across deployments

**Option 2: Cloud Storage (Recommended for Production)**
- AWS S3
- Cloudflare R2
- Backblaze B2

Update file upload logic to store in cloud instead of local filesystem.

### Auto-Sleep on Free Tier

Railway's free tier puts services to sleep after inactivity:
- Service sleeps after 30 minutes of no requests
- Cold start takes 30-60 seconds on wake-up
- Paid plans keep services running 24/7

**Workaround:** Set up external monitoring (e.g., UptimeRobot) to ping your app every 5 minutes.

### Environment-Specific Variables

For development/staging/production:

1. Create multiple Railway projects
2. Use Railway's **environments** feature:
   - Development: Auto-deploy from `dev` branch
   - Staging: Auto-deploy from `staging` branch
   - Production: Auto-deploy from `main` branch

3. Configure different environment variables per environment

---

## Maintenance & Updates

### Updating the Application

1. Make code changes locally
2. Test changes:
   ```bash
   pnpm install
   pnpm build
   pnpm dev
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. Railway auto-deploys on push to main branch
5. Monitor deployment in Railway Dashboard

### Rolling Back

If a deployment causes issues:

1. Go to **Deployments** tab
2. Find the previous successful deployment
3. Click **"Rollback"**
4. Railway redeploys the previous commit

### Database Schema Changes

When modifying Prisma schema:

1. Make schema changes in `backend/prisma/schema.prisma`
2. Create migration:
   ```bash
   cd backend
   pnpm prisma migrate dev --name describe_change
   ```
3. Test migration locally
4. Commit migration files
5. Push to GitHub
6. Run migration in Railway Console:
   ```bash
   npx prisma migrate deploy
   ```

---

## Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a cryptographically secure random string
- [ ] Enable HTTPS (automatic on Railway)
- [ ] Set up database backups (Railway → PostgreSQL → Settings → Backups)
- [ ] Configure strong password policy for users
- [ ] Enable audit logging
- [ ] Set up rate limiting on API endpoints
- [ ] Configure CORS to allow only your domain
- [ ] Remove or disable test accounts
- [ ] Enable Railway's read-only mode for sensitive operations
- [ ] Set up monitoring and alerting
- [ ] Review and restrict Railway project access (Settings → Members)

---

## Cost Optimization

Railway Pricing (as of 2025):

**Free Tier:**
- $5 free credit/month
- Good for development/testing
- 512MB RAM, 0.5 vCPU
- Service sleeps after inactivity

**Paid Plans:**
- **Pay-as-you-go:** $0.000292/GB-hour
- **Starter:** $5/month (basic plan)
- **Production:** $20/month (recommended for production)

**Optimization Tips:**

1. Monitor usage in **Metrics** tab
2. Set budget alerts in **Settings** → **Billing**
3. Use environment-specific configurations
4. Implement database query optimization
5. Enable response caching where possible
6. Consider using Railway's Redis addon for caching

---

## Additional Resources

- **Railway Documentation:** https://docs.railway.app/
- **Railway Discord:** https://discord.gg/railway
- **Prisma on Railway:** https://docs.railway.app/guides/prisma
- **Docker on Railway:** https://docs.railway.app/guides/dockerfiles
- **PostgreSQL on Railway:** https://docs.railway.app/guides/postgresql

---

## Quick Reference Commands

### Local Testing Before Deploy

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:migrate

# Generate Prisma client
pnpm db:generate

# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

### Railway CLI Commands

```bash
# Login to Railway
railway login

# Initialize project
railway init

# Link to existing project
railway link

# View logs
railway logs

# Open console
railway open

# Set environment variable
railway variables set JWT_SECRET=your-secret

# List variables
railway variables

# Trigger deployment
railway up
```

---

## Support

If you encounter issues:

1. Check Railway logs first (most errors are logged)
2. Review this guide's Troubleshooting section
3. Search Railway Docs: https://docs.railway.app/
4. Ask in Railway Discord: https://discord.gg/railway
5. Check RIMSS project documentation

---

**Last Updated:** 2025-01-23
**RIMSS Version:** 0.1.0
**Railway Builder:** Dockerfile (deployment/Dockerfile)
