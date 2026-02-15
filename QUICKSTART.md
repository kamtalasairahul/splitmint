# 🚀 SplitMint - Quick Start Guide

## What You Have

A complete full-stack expense splitting application with:
- ✅ User authentication (register/login)
- ✅ Group management (max 4 members)
- ✅ Expense tracking with multiple split modes
- ✅ Smart balance calculation
- ✅ Minimal settlement algorithm
- ✅ PostgreSQL database with Prisma ORM
- ✅ Next.js 14 with TypeScript
- ✅ Ready for Vercel deployment

## 📁 Project Structure

```
splitmint/
├── app/                       # Next.js pages and API routes
│   ├── api/                   # Backend API
│   │   ├── auth/             # Authentication endpoints
│   │   ├── groups/           # Group management
│   │   ├── expenses/         # Expense CRUD
│   │   └── balances/         # Balance calculations
│   ├── dashboard/            # Dashboard pages
│   ├── login/                # Login page
│   └── register/             # Register page
├── components/               # React components
│   └── AuthProvider.tsx      # Auth context
├── lib/                      # Utility functions
│   ├── auth.ts              # JWT & password hashing
│   ├── balance.ts           # Balance calculation engine
│   └── prisma.ts            # Database client
├── prisma/                   # Database schema
│   └── schema.prisma        # Database models
├── COMMANDS.md              # All commands reference
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # Overview

```

## ⚡ Quick Start (5 minutes)

### 1. Extract and Navigate
```bash
cd splitmint
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
# Copy environment template
cp .env.example .env

# Generate JWT secret
openssl rand -base64 32

# Edit .env and add:
# - DATABASE_URL (your PostgreSQL connection)
# - JWT_SECRET (generated above)
# - NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Set Up Database

**Using Local PostgreSQL:**
```bash
# Create database
createdb splitmint

# Update .env with:
DATABASE_URL="postgresql://user:password@localhost:5432/splitmint"

# Run migrations
npx prisma generate
npx prisma migrate dev --name init
```

**Using Cloud Database (Recommended):**
1. Sign up at [neon.tech](https://neon.tech) (free)
2. Create a project
3. Copy connection string
4. Add to .env as DATABASE_URL
5. Run: `npx prisma generate && npx prisma migrate deploy`

### 5. Start the App
```bash
npm run dev
```

Open: http://localhost:3000

## 🌐 Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/splitmint.git
git push -u origin main
```

### Step 2: Deploy
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo
4. Add environment variables:
   - `JWT_SECRET` (generate with: `openssl rand -base64 32`)
   - `NEXT_PUBLIC_API_URL` (your Vercel URL)
5. Create Vercel Postgres database in Storage tab
6. Deploy!

## 📚 Documentation

- **[COMMANDS.md](./COMMANDS.md)** - Complete command reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide
- **[README.md](./README.md)** - Project overview

## 🎯 Test the App

1. **Register** → Create account at `/register`
2. **Create Group** → Add members (max 4 total)
3. **Add Expense** → Try different split types
4. **View Balances** → See settlement suggestions

## 🔧 Key Features

### Split Types
- **Equal**: Splits evenly with proper rounding
- **Custom**: Enter exact amounts per person
- **Percentage**: Split by percentage (must total 100%)

### Balance Algorithm
- Calculates net balance for each member
- Minimizes number of transactions
- Smart settlement suggestions

### Security
- Password hashing with bcrypt
- JWT authentication
- Protected API routes

## 📞 Need Help?

1. Check [COMMANDS.md](./COMMANDS.md) for all commands
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
3. Common issues:
   - **Build fails**: Run `npx prisma generate`
   - **Database error**: Check DATABASE_URL in .env
   - **Port in use**: Use `npm run dev -- -p 3001`

## 🎉 You're Ready!

Everything is set up and ready to use. Follow the Quick Start above to get running in minutes!

**Happy expense splitting! 💸**
