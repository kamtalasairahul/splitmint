# 🎯 START HERE - SplitMint Complete Package

Welcome! You have everything you need to build, run, and deploy a complete expense-splitting application.

## 📦 What's Included

This is a **production-ready** full-stack application with:

- ✅ Complete backend API with authentication
- ✅ React/Next.js frontend with responsive design  
- ✅ PostgreSQL database with Prisma ORM
- ✅ Smart balance calculation engine
- ✅ User authentication with JWT
- ✅ Group management (max 4 members)
- ✅ Multiple expense split types
- ✅ Minimal settlement algorithm
- ✅ Ready for Vercel deployment

## 🚀 Choose Your Path

### Path A: Just Want to Run It? (10 minutes)
→ **Read: [QUICKSTART.md](./QUICKSTART.md)**

Quick steps:
1. `npm install`
2. Setup `.env` file
3. `npx prisma migrate dev`
4. `npm run dev`

### Path B: Want All Commands? (Reference)
→ **Read: [COMMANDS.md](./COMMANDS.md)**

Every command from setup to deployment, organized by category.

### Path C: Deploy to Production? (20 minutes)
→ **Read: [GITHUB_HOSTING_GUIDE.md](./GITHUB_HOSTING_GUIDE.md)**

Step-by-step from local code to live website:
1. Push to GitHub
2. Deploy to Vercel
3. Setup database
4. Go live!

### Path D: Deep Dive? (Full details)
→ **Read: [DEPLOYMENT.md](./DEPLOYMENT.md)**

Comprehensive deployment guide with troubleshooting.

---

## 📂 Project Structure

```
splitmint/
├── 📄 START_HERE.md              ← You are here
├── 📄 QUICKSTART.md              ← Fast setup (10 min)
├── 📄 COMMANDS.md                ← All commands reference
├── 📄 GITHUB_HOSTING_GUIDE.md    ← GitHub + Vercel guide
├── 📄 DEPLOYMENT.md              ← Detailed deployment
├── 📄 README.md                  ← Project overview
│
├── 📁 app/                       ← Next.js application
│   ├── api/                      ← Backend API routes
│   │   ├── auth/                 ← Login, register
│   │   ├── groups/               ← Group management
│   │   ├── expenses/             ← Expense CRUD
│   │   └── balances/             ← Balance calculations
│   ├── dashboard/                ← Dashboard pages
│   ├── login/                    ← Login page
│   └── register/                 ← Registration page
│
├── 📁 components/                ← React components
│   └── AuthProvider.tsx          ← Authentication context
│
├── 📁 lib/                       ← Utility functions
│   ├── auth.ts                   ← JWT & password hashing
│   ├── balance.ts                ← Balance algorithm
│   └── prisma.ts                 ← Database client
│
├── 📁 prisma/                    ← Database
│   └── schema.prisma             ← Database schema
│
├── 📄 package.json               ← Dependencies
├── 📄 tsconfig.json              ← TypeScript config
├── 📄 tailwind.config.js         ← Styling config
└── 📄 .env.example               ← Environment template
```

---

## ⚡ Quick Start (Copy-Paste)

### Prerequisites
```bash
# Check you have Node.js 18+
node --version

# Check you have npm
npm --version
```

If not installed, get Node.js from: https://nodejs.org

### Setup (5 commands)
```bash
# 1. Navigate to project
cd splitmint

# 2. Install dependencies (2-3 minutes)
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database URL and JWT secret

# 4. Setup database
npx prisma generate
npx prisma migrate dev --name init

# 5. Run the app
npm run dev
```

**Open:** http://localhost:3000

---

## 🗄️ Database Options

### Option 1: Neon (Recommended - Free & Easy)
1. Go to [neon.tech](https://neon.tech)
2. Sign up (free, no credit card)
3. Create project → Copy connection string
4. Add to `.env` as `DATABASE_URL`

### Option 2: Local PostgreSQL
```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql

# Create database
createdb splitmint

# Add to .env:
# DATABASE_URL="postgresql://user:password@localhost:5432/splitmint"
```

### Option 3: Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Settings → Database → Connection String
4. Add to `.env`

---

## 🎯 Feature Checklist

Test these features after setup:

### Authentication
- [ ] Register new account
- [ ] Login with credentials
- [ ] Logout
- [ ] Protected routes work

### Groups
- [ ] Create new group
- [ ] Add members (max 3 additional)
- [ ] View group details
- [ ] Delete group

### Expenses
- [ ] Add expense with equal split
- [ ] Add expense with custom amounts
- [ ] Add expense with percentages
- [ ] Edit expense
- [ ] Delete expense

### Balances
- [ ] View net balances
- [ ] See settlement suggestions
- [ ] Verify minimal transactions
- [ ] Check total group spent

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React, TypeScript, TailwindCSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Auth** | JWT, bcrypt |
| **Hosting** | Vercel (Frontend + API) |
| **Database Host** | Neon / Vercel Postgres |

---

## 🔑 Environment Variables

Required in `.env` file:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT secret for authentication (generate with: openssl rand -base64 32)
JWT_SECRET="your-random-secret-here"

# API URL (http://localhost:3000 for local)
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

---

## 🚀 Deployment

### GitHub → Vercel (Easiest)

**5 Steps to Live App:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/splitmint.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo

3. **Add Vercel Postgres**
   - Storage tab → Create Database → Postgres

4. **Set Environment Variables**
   - `JWT_SECRET` (generate new)
   - `DATABASE_URL=$POSTGRES_PRISMA_URL`
   - `NEXT_PUBLIC_API_URL` (your Vercel URL)

5. **Deploy!**
   - Click Deploy
   - Wait 2-3 minutes
   - App is live!

**Full guide:** [GITHUB_HOSTING_GUIDE.md](./GITHUB_HOSTING_GUIDE.md)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Prisma Client Not Found
```bash
npx prisma generate
```

### Database Connection Failed
```bash
# Test connection
npx prisma db pull

# Check .env has correct DATABASE_URL
```

### Build Fails
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

---

## 📚 Documentation Index

| Document | Purpose | Time |
|----------|---------|------|
| **START_HERE.md** | Overview & navigation | 5 min |
| **QUICKSTART.md** | Fastest setup path | 10 min |
| **COMMANDS.md** | All commands reference | Reference |
| **GITHUB_HOSTING_GUIDE.md** | GitHub + Vercel deployment | 20 min |
| **DEPLOYMENT.md** | Detailed deployment guide | 30 min |
| **README.md** | Project overview | 5 min |

---

## 💡 Pro Tips

1. **Use Neon for database** - Free, no credit card, automatic backups
2. **Deploy to Vercel** - Free hosting, automatic HTTPS, global CDN
3. **Test locally first** - Make sure everything works before deploying
4. **Check Vercel logs** - If deployment fails, check function logs
5. **Keep .env secret** - Never commit to Git (already in .gitignore)

---

## 🎓 Learning Resources

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma**: [prisma.io/docs](https://prisma.io/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **TailwindCSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 🎉 Ready to Start?

**Recommended flow:**

1. Read this file (you're here! ✅)
2. Follow **QUICKSTART.md** for local setup
3. Test all features locally
4. Follow **GITHUB_HOSTING_GUIDE.md** for deployment
5. Share your live app!

---

## 📞 Need Help?

1. Check the documentation (linked above)
2. Review troubleshooting sections
3. Google the specific error message
4. Check Vercel deployment logs

---

## ✨ What You Can Build

This codebase gives you a foundation to build:

- Expense splitting apps
- Budget trackers
- Bill management systems
- Trip expense trackers
- Roommate expense apps
- Group payment systems

**The core logic is there - customize it for your needs!**

---

**🚀 You have everything you need. Let's build something awesome!**

**Next step:** Open [QUICKSTART.md](./QUICKSTART.md) and start building!
