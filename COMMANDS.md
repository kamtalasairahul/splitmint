# SplitMint - Command Reference

Complete list of commands from setup to deployment.

## 📋 Prerequisites Installation

### Install Node.js (if not installed)

**macOS (using Homebrew):**
```bash
brew install node
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/)

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation:**
```bash
node --version
npm --version
```

---

## 🚀 Project Setup

### 1. Clone/Download Project

**If from GitHub:**
```bash
git clone https://github.com/yourusername/splitmint.git
cd splitmint
```

**If downloaded as ZIP:**
```bash
unzip splitmint.zip
cd splitmint
```

### 2. Install Dependencies

```bash
npm install
```

**What this does:**
- Installs all packages from package.json
- Downloads Next.js, React, Prisma, and other dependencies
- Takes 1-3 minutes depending on internet speed

### 3. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your editor
nano .env
# or
code .env
# or
vi .env
```

**Required values in .env:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/splitmint"
JWT_SECRET="your-super-secret-jwt-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Generate JWT Secret:**
```bash
# Mac/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Node.js (any platform)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🗄️ Database Setup

### Option A: Local PostgreSQL

**Install PostgreSQL:**

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)

**Create Database:**
```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE splitmint;
CREATE USER splitmintuser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE splitmint TO splitmintuser;
\q
```

**Update DATABASE_URL in .env:**
```env
DATABASE_URL="postgresql://splitmintuser:yourpassword@localhost:5432/splitmint"
```

### Option B: Use Free Cloud Database

**Neon (Recommended):**
1. Go to [neon.tech](https://neon.tech)
2. Sign up (free)
3. Create a project
4. Copy connection string
5. Paste in .env as DATABASE_URL

**Supabase:**
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Get connection string from Settings → Database
4. Use in .env

**Railway:**
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string
4. Use in .env

### Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables (run migrations)
npx prisma migrate dev --name init

# Optional: Open database GUI
npx prisma studio
```

**What `prisma migrate dev` does:**
- Creates all tables (users, groups, expenses, etc.)
- Sets up relationships
- Creates indexes
- Applies constraints

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

**Opens at:** http://localhost:3000

**Features in dev mode:**
- Hot reload (auto-refresh on code changes)
- Detailed error messages
- Fast refresh

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🔧 Database Commands

### View Database

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio
```

Opens at: http://localhost:5555

### Create Migration

```bash
# After editing schema.prisma
npx prisma migrate dev --name migration_name
```

### Deploy Migrations (Production)

```bash
npx prisma migrate deploy
```

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma migrate reset
```

### Seed Database

```bash
npx prisma db seed
```

### Check Migration Status

```bash
npx prisma migrate status
```

---

## 📦 Deployment Commands

### Deploy to Vercel (Recommended)

**Method 1: GitHub Integration (Easiest)**

```bash
# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Create GitHub repo, then:
git remote add origin https://github.com/yourusername/splitmint.git
git branch -M main
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. Import repository
3. Add environment variables
4. Deploy

**Method 2: Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Other Platforms

**Netlify:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

**Railway:**
```bash
npm install -g @railway/cli
railway login
railway up
```

---

## 🧹 Maintenance Commands

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update package-name

# Update to latest (including major versions)
npm install package-name@latest
```

### Lint Code

```bash
npm run lint
```

### Format Code (if prettier is installed)

```bash
npx prettier --write .
```

### Clear Cache

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Prisma generated files
rm -rf node_modules/.prisma
npx prisma generate
```

---

## 🐛 Troubleshooting Commands

### Fix Module Not Found Errors

```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Fix Prisma Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset and re-migrate
npx prisma migrate reset
```

### Fix Port Already in Use

```bash
# Find and kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Check Environment Variables

```bash
# Print environment variables
node -e "console.log(process.env)"
```

---

## 📊 Useful Development Commands

### Check Database Connection

```bash
# Test connection
npx prisma db pull
```

### Generate Types from Database

```bash
npx prisma db pull
npx prisma generate
```

### Introspect Database

```bash
npx prisma db pull
```

### Format Prisma Schema

```bash
npx prisma format
```

---

## 🔐 Security Commands

### Generate Secure Secrets

```bash
# Generate random string for JWT_SECRET
openssl rand -base64 32

# Generate UUID
uuidgen

# Generate random hex
openssl rand -hex 32
```

---

## 📱 Testing Commands

### Run in Different Environments

```bash
# Development
npm run dev

# Production (local)
npm run build && npm start

# With different port
PORT=3001 npm run dev
```

---

## 🌐 Network Commands

### Access from Other Devices

```bash
# Find your local IP
# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig

# Then run with host binding
npm run dev -- --host 0.0.0.0
```

Access at: `http://YOUR_IP:3000`

---

## 📚 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npx prisma studio` | Open database GUI |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Create and apply migration |
| `npx prisma migrate deploy` | Deploy migrations |
| `vercel --prod` | Deploy to Vercel |

---

## 🎯 Complete Setup Flow

**From zero to running app:**

```bash
# 1. Get the code
git clone https://github.com/yourusername/splitmint.git
cd splitmint

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your values

# 4. Generate JWT secret
openssl rand -base64 32
# Add to .env as JWT_SECRET

# 5. Setup database
npx prisma generate
npx prisma migrate dev --name init

# 6. Run the app
npm run dev

# 7. Open browser
# http://localhost:3000
```

**Total time:** 5-10 minutes

---

For more detailed instructions, see:
- [README.md](./README.md) - Project overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
