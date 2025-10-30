#!/bin/bash

# ARAS AI Deployment Script
# Automates the build and deployment process

echo "🚀 ARAS AI - Production Deployment"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
if npm ci --silent; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the application
echo "🔨 Building application..."
if npm run build --silent; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

# Check if dist folder was created
if [ ! -d "dist" ]; then
    echo "❌ Build output not found. Something went wrong."
    exit 1
fi

echo "📊 Build Statistics:"
echo "   - Dist folder size: $(du -sh dist | cut -f1)"
echo "   - Files created: $(find dist -type f | wc -l) files"

# Create deployment package
echo "📦 Creating deployment package..."
mkdir -p deployment-package
cp -r dist deployment-package/
cp -r server deployment-package/
cp -r shared deployment-package/
cp package.json deployment-package/
cp Dockerfile deployment-package/
cp DEPLOYMENT_GUIDE.md deployment-package/

# Create production package.json (only production dependencies)
cd deployment-package
npm ci --only=production --silent
cd ..

echo "✅ Deployment package created in 'deployment-package/' folder"

# Provide deployment options
echo ""
echo "🎉 Deployment Ready!"
echo "==================="
echo ""
echo "Choose your deployment option:"
echo ""
echo "1. 🌐 Quick Deploy (Vercel/Netlify):"
echo "   - Upload the 'deployment-package/' folder"
echo "   - Or connect your Git repository"
echo ""
echo "2. 🐳 Docker Deploy:"
echo "   cd deployment-package"
echo "   docker build -t aras-ai ."
echo "   docker run -p 5000:5000 aras-ai"
echo ""
echo "3. 📁 Static Host Deploy:"
echo "   - Upload contents of 'deployment-package/dist/' to your web server"
echo "   - Configure server for SPA routing (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "4. ☁️ Full-Stack Deploy:"
echo "   - Set up PostgreSQL database"
echo "   - Configure environment variables"
echo "   - Deploy 'deployment-package/' to your cloud provider"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🔗 Your app will be live and ready for client presentations!"