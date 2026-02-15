# 🚀 Complete Guide: From Code to Deployed App

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git installed (`git --version`)
- [ ] GitHub account created
- [ ] Vercel account created (free)
- [ ] Code editor (VS Code recommended)

---

## 🔧 Phase 1: Local Setup (10 minutes)

### Step 1: Navigate to Project
```bash
cd splitmint
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all required packages. Takes 2-3 minutes.

### Step 3: Configure Environment

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` file with these values:

```env
# For local development, use Neon (free cloud PostgreSQL)
# Sign up at neon.tech and get your connection string
DATABASE_URL="postgresql://user:password@host/database"

# Generate this with: openssl rand -base64 32
JWT_SECRET="your-generated-secret-here"

# For local development
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Generate JWT Secret:**
```bash
# Mac/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Step 4: Database Setup

**Recommended: Use Neon (Free Cloud PostgreSQL)**

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free, no credit card)
3. Create a new project
4. Copy the connection string
5. Paste in `.env` as `DATABASE_URL`

**Then run:**
```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate deploy
```

### Step 5: Test Locally

```bash
npm run dev
```

Open browser: http://localhost:3000

**Test these:**
- [ ] Register new account
- [ ] Login works
- [ ] Create a group
- [ ] Add members
- [ ] Add expense
- [ ] View balances

---

## 📦 Phase 2: Push to GitHub (5 minutes)

### Step 1: Initialize Git

```bash
# Initialize git repository
git init

# Check what files will be committed
git status
```

### Step 2: Create .gitignore (Already Included)

Verify `.gitignore` contains:
```
node_modules/
.env
.env.local
.next/
```

### Step 3: Make First Commit

```bash
# Add all files
git add .

# Commit with message
git commit -m "Initial commit: Complete SplitMint expense splitting app"
```

### Step 4: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"** (green button)
3. Name: `splitmint`
4. Description: "Expense splitting application with Next.js and PostgreSQL"
5. **Public** or **Private** (your choice)
6. **DO NOT** initialize with README (we already have one)
7. Click **"Create repository"**

### Step 5: Connect and Push

GitHub will show you these commands:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/splitmint.git

# Rename branch to main
git branch -M main

# Push code to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your GitHub username!

### Step 6: Verify Upload

Refresh your GitHub repository page. You should see all files uploaded.

---

## 🌐 Phase 3: Deploy to Vercel (10 minutes)

### Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Create New Project

1. Click **"Add New..."** → **"Project"**
2. Find your `splitmint` repository
3. Click **"Import"**

### Step 3: Configure Project

Leave these as default:
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: (empty/default)

### Step 4: Set Up Vercel Postgres

**Before deploying, set up the database:**

1. In your Vercel project, click **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Name: `splitmint-db`
5. Region: Choose closest to your users
6. Click **"Create"**

**Vercel automatically adds these variables:**
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### Step 5: Add Environment Variables

Go to **Settings** → **Environment Variables**

Add these **manually**:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | `$POSTGRES_PRISMA_URL` | Reference to Vercel Postgres |
| `JWT_SECRET` | (generate new secret) | Use: `openssl rand -base64 32` |
| `NEXT_PUBLIC_API_URL` | (leave empty for now) | Will add after first deploy |

**Important:** For `DATABASE_URL`, type exactly: `$POSTGRES_PRISMA_URL`
(This references the Vercel Postgres variable)

### Step 6: Deploy

1. Click **"Deploy"** button
2. Wait for build (2-3 minutes)
3. Vercel will:
   - Install dependencies
   - Generate Prisma Client
   - Build Next.js app
   - Deploy to CDN

### Step 7: Add API URL

After successful deployment:

1. Copy your deployment URL (e.g., `https://splitmint-xyz.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_API_URL`
4. Set value to your deployment URL
5. **Redeploy** (Settings → Deployments → click "..." → Redeploy)

### Step 8: Run Database Migrations

**Option A: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

**Option B: Manual in Vercel Dashboard**

1. Go to project Settings → Functions
2. Add build command: `npx prisma migrate deploy && npm run build`
3. Redeploy

---

## ✅ Phase 4: Test Production (5 minutes)

### Visit Your Live App

Open: `https://your-project.vercel.app`

### Test All Features

- [ ] **Register** → Create new account
- [ ] **Login** → Use credentials
- [ ] **Create Group** → Name it, add 1-3 members
- [ ] **Add Expense** → Try different split types
- [ ] **View Balances** → Check calculations
- [ ] **Settlements** → Verify suggestions
- [ ] **Delete Expense** → Confirm recalculation

---

## 🔄 Making Updates

### Local Changes

```bash
# Make changes to code
# Test locally: npm run dev

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push
```

**Vercel auto-deploys** when you push to main branch!

### Quick Deploy from Local

```bash
# Deploy current code to production
vercel --prod
```

---

## 📊 Monitoring & Management

### Vercel Dashboard

Access at: [vercel.com/dashboard](https://vercel.com/dashboard)

**Useful Sections:**
- **Deployments**: View all deployments, logs
- **Analytics**: Traffic, performance metrics
- **Logs**: Debug production errors
- **Storage**: Manage database

### Database Management

**View/Edit Data:**
```bash
# Install and run Prisma Studio
npm install -g prisma
prisma studio
```

Opens GUI at: http://localhost:5555

**Or use Vercel's built-in database viewer:**
1. Go to Storage tab
2. Click on your database
3. Click "Data" tab

---

## 🐛 Troubleshooting

### Build Fails

**Error: Prisma Client not found**
```bash
# Solution: Already fixed in package.json
# Verify "postinstall": "prisma generate" exists
```

**Error: Environment variables not set**
- Check all variables in Vercel Settings → Environment Variables
- Redeploy after adding variables

### Database Connection Fails

**Local:**
- Verify DATABASE_URL in .env
- Test connection: `npx prisma db pull`

**Production:**
- Check Vercel Postgres is created
- Verify DATABASE_URL = $POSTGRES_PRISMA_URL
- Run migrations: `npx prisma migrate deploy`

### App Crashes After Deploy

1. Check **Vercel Logs**:
   - Go to Deployments
   - Click on deployment
   - View "Function Logs"

2. Common issues:
   - Missing environment variables
   - Database migrations not run
   - API routes returning errors

---

## 🎯 Quick Command Reference

### Local Development
```bash
npm install              # Install dependencies
npm run dev              # Start dev server
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration
```

### Git & GitHub
```bash
git add .                        # Stage changes
git commit -m "message"          # Commit changes
git push                         # Push to GitHub
git status                       # Check status
```

### Vercel
```bash
vercel                   # Deploy preview
vercel --prod            # Deploy production
vercel logs              # View logs
vercel env pull          # Pull env variables
```

---

## 📞 Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Project README**: [README.md](./README.md)
- **All Commands**: [COMMANDS.md](./COMMANDS.md)

---

## 🎉 Success Checklist

After completing all phases:

- [ ] Code runs locally
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Database connected
- [ ] Migrations run
- [ ] All features work in production
- [ ] Environment variables set
- [ ] Custom domain (optional)

---

## 🚀 Next Steps

### Optional Enhancements

1. **Custom Domain**
   - Buy domain from Namecheap, GoDaddy, etc.
   - Add in Vercel: Settings → Domains

2. **Email Integration**
   - Sign up for SendGrid (free tier)
   - Add password reset feature

3. **Analytics**
   - Enable Vercel Analytics
   - Add Google Analytics

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Configure uptime monitoring

---

**Congratulations! Your app is now live! 🎊**

**Live URL**: `https://your-project.vercel.app`

Share it with friends and start splitting expenses!
