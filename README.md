# SplitMint - Expense Splitting Application

A modern expense splitting application built with Next.js, PostgreSQL, and Prisma.

## Features

- 🔐 Authentication (Email/Password with JWT)
- 👥 Group Management (max 4 members including creator)
- 💰 Expense Tracking with multiple split modes
- 📊 Balance Calculations with minimal settlement algorithm
- 📈 Visualizations and Dashboard
- 🔍 Search and Filter capabilities

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Hosting**: Vercel

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Vercel Postgres)
- Git

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd splitmint
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/splitmint"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: (default)

### 3. Set up Vercel Postgres

1. In your Vercel project, go to Storage tab
2. Create a new Postgres database
3. Copy the environment variables to your project settings

### 4. Add Environment Variables

In Vercel project settings, add:
- `DATABASE_URL` (from Vercel Postgres)
- `JWT_SECRET` (generate a secure random string)
- `NEXT_PUBLIC_API_URL` (your Vercel deployment URL)

### 5. Deploy

```bash
# Vercel will automatically deploy on push
# Or use Vercel CLI
npm i -g vercel
vercel --prod
```

## Database Schema

- **users**: User accounts with authentication
- **groups**: Expense groups (max 4 members)
- **group_members**: Participants in groups
- **expenses**: Expense records
- **expense_splits**: Individual split amounts per participant

## API Routes

- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/auth/forgot-password` - Password reset
- `/api/groups` - Group CRUD operations
- `/api/groups/[id]/members` - Member management
- `/api/expenses` - Expense CRUD operations
- `/api/balances/[groupId]` - Calculate balances and settlements

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (DB GUI)
npx prisma migrate   # Run database migrations
```

## Project Structure

```
splitmint/
├── app/
│   ├── api/              # API routes
│   ├── (auth)/           # Auth pages (login, register)
│   ├── dashboard/        # Dashboard pages
│   ├── groups/           # Group management pages
│   └── layout.tsx        # Root layout
├── components/           # React components
├── lib/                  # Utility functions
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## License

MIT
