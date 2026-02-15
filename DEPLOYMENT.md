# SplitMint - Complete Setup & Deployment Guide

## 🚀 Quick Start (Local Development)

### Step 1: Clone and Install

```bash
# Clone the repository (after pushing to GitHub)
git clone <your-repo-url>
cd splitmint

# Install dependencies
npm install
```

### Step 2: Database Setup

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL on your machine
# Create a database
createdb splitmint

# Update .env file
cp .env.example .env
# Edit .env and update DATABASE_URL with your PostgreSQL credentials
```

**Option B: Use Free PostgreSQL (Neon, Supabase, Railway)**
- Sign up for free tier at neon.tech, supabase.com, or railway.app
- Get your connection string
- Add to .env file

### Step 3: Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment to Vercel

### Method 1: Deploy via GitHub (Recommended)

#### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SplitMint app"

# Create a repository on GitHub, then:
git remote add origin https://github.com/yourusername/splitmint.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: (leave default)

#### Step 3: Set Up Vercel Postgres

1. In your Vercel project, go to **Storage** tab
2. Click "Create Database"
3. Select **Postgres**
4. Name it (e.g., "splitmint-db")
5. Select a region close to your users
6. Click "Create"

Vercel will automatically add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_PRISMA_URL`

#### Step 4: Add Additional Environment Variables

In Vercel project settings → Environment Variables:

```bash
# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-random-string-here

# API URL (your Vercel deployment URL)
NEXT_PUBLIC_API_URL=https://your-project.vercel.app

# Database URL (already set by Vercel Postgres)
DATABASE_URL=$POSTGRES_PRISMA_URL
```

**Generate a secure JWT_SECRET:**
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use this Node.js one-liner
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Vercel will automatically:
   - Install dependencies
   - Run `prisma generate`
   - Build the app
   - Deploy to production

#### Step 6: Run Database Migrations

After first deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
```

Or use Vercel's deployment hooks to run migrations automatically.

---

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

Follow the prompts to:
1. Set up the project
2. Configure environment variables
3. Deploy

---

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-random-secret-key` |
| `NEXT_PUBLIC_API_URL` | Public API URL | `http://localhost:3000` or `https://yourapp.vercel.app` |

### For Vercel Postgres

If using Vercel Postgres, these are auto-populated:
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_PRISMA_URL`

Use `POSTGRES_PRISMA_URL` for `DATABASE_URL`.

---

## 🗄️ Database Management

### View Database

```bash
# Open Prisma Studio (database GUI)
npx prisma studio
```

### Reset Database

```bash
# ⚠️ Warning: This deletes all data
npx prisma migrate reset
```

### Create New Migration

```bash
# After changing schema.prisma
npx prisma migrate dev --name your_migration_name
```

### Deploy Migrations (Production)

```bash
npx prisma migrate deploy
```

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Never commit `.env` file to Git
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production (Vercel handles this)
- [ ] Regularly update dependencies (`npm update`)

---

## 📊 Testing the Application

### 1. Register a New User
- Go to `/register`
- Create an account
- Should redirect to dashboard

### 2. Create a Group
- Click "New Group"
- Add group name and members (max 3 additional)
- Should see group in dashboard

### 3. Add Expenses
- Open a group
- Click "Add Expense"
- Test different split types:
  - Equal split
  - Custom amounts
  - Percentage split

### 4. View Balances
- Check balance calculations
- Verify settlement suggestions
- Confirm minimal transactions

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error: Prisma Client not generated**
```bash
# Solution: Add postinstall script to package.json
"postinstall": "prisma generate"
```

**Error: Database connection failed**
- Verify `DATABASE_URL` is set correctly
- Check database is running
- Ensure database accepts connections from Vercel IPs

### Local Development Issues

**Error: Cannot find module '@prisma/client'**
```bash
npx prisma generate
```

**Error: Migration failed**
```bash
# Reset and re-migrate
npx prisma migrate reset
npx prisma migrate dev
```

**Port 3000 already in use**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

## 📱 Features Checklist

- [x] User Authentication (Register/Login)
- [x] JWT Session Management
- [x] Group Creation (max 4 members)
- [x] Add/Edit/Remove Members
- [x] Add/Edit/Delete Expenses
- [x] Multiple Split Types (Equal/Custom/Percentage)
- [x] Balance Calculation Engine
- [x] Minimal Settlement Algorithm
- [x] Search & Filter Expenses
- [x] Responsive Design

---

## 🎯 Next Steps / Enhancements

1. **Email Integration**
   - Password reset functionality
   - Email notifications

2. **Advanced Features**
   - Expense categories
   - Recurring expenses
   - Export to PDF/CSV
   - Multi-currency support

3. **UI/UX Improvements**
   - Dark mode
   - Charts and graphs
   - Mobile app (React Native)

4. **Social Features**
   - Invite members via email
   - Share group links
   - Activity feed

---

## 📞 Support

For issues and questions:
- Check the [GitHub Issues](https://github.com/yourusername/splitmint/issues)
- Review the [Troubleshooting](#-troubleshooting) section
- Read [Vercel Documentation](https://vercel.com/docs)
- Review [Prisma Documentation](https://www.prisma.io/docs)

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Made with ❤️ using Next.js, PostgreSQL, and Prisma**
