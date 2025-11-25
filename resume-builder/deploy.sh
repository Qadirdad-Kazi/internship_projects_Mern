#!/bin/bash

# Resume Builder Deployment Script

echo "🚀 Resume Builder Deployment Script"
echo "=====================================\n"

# Check if we're in the right directory
if [ ! -f "DEPLOYMENT.md" ]; then
  echo "❌ Please run this script from the project root directory"
  exit 1
fi

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command_exists "git"; then
  echo "❌ Git is required but not installed"
  exit 1
fi

if ! command_exists "node"; then
  echo "❌ Node.js is required but not installed"
  exit 1
fi

if ! command_exists "npm"; then
  echo "❌ npm is required but not installed"
  exit 1
fi

echo "✅ Prerequisites check passed\n"

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
  echo "❌ Backend dependency installation failed"
  exit 1
fi
cd ..

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
  echo "❌ Frontend dependency installation failed"
  exit 1
fi

# Build frontend
echo "🏗️  Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Frontend build failed"
  exit 1
fi
cd ..

echo "✅ Build completed successfully\n"

# Git operations
echo "📝 Preparing for deployment..."
echo "Current git status:"
git status --porcelain

echo "\n🔍 Please ensure you have:"
echo "   1. Updated environment variables in Vercel and Netlify"
echo "   2. Configured MongoDB Atlas connection string"
echo "   3. Set up CORS origins correctly"
echo "   4. Reviewed the DEPLOYMENT.md file"

echo "\n🎯 Next steps:"
echo "   1. Commit and push your changes to GitHub"
echo "   2. Deploy backend to Vercel from GitHub"
echo "   3. Deploy frontend to Netlify from GitHub"
echo "   4. Update environment variables on both platforms"
echo "   5. Test the deployed application"

echo "\n🚀 Ready for deployment!"