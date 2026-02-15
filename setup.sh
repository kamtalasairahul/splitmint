#!/bin/bash

echo "🚀 Setting up SplitMint..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm is installed: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your database credentials."
    echo ""
    echo "📝 Required environment variables:"
    echo "   - DATABASE_URL: Your PostgreSQL connection string"
    echo "   - JWT_SECRET: A secure random string (generate with: openssl rand -base64 32)"
    echo "   - NEXT_PUBLIC_API_URL: http://localhost:3000 (for development)"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

# Ask if user wants to run migrations
echo "🗄️  Database setup"
read -p "Do you want to run database migrations now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    npx prisma migrate dev --name init
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to run migrations"
        echo "Please check your DATABASE_URL in .env file"
        exit 1
    fi
    
    echo "✅ Database migrations completed"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "📚 For deployment instructions, see DEPLOYMENT.md"
