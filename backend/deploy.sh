#!/bin/bash

# 🚀 ShredAI Backend Deployment Script
# This script automates the deployment process to Vercel

echo "🚀 Starting ShredAI Backend Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Get the deployment URL
DEPLOYMENT_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
echo "✅ Deployment successful!"
echo "🌐 Your backend is available at: $DEPLOYMENT_URL"

# Test the health endpoint
echo "🧪 Testing health endpoint..."
curl -s "$DEPLOYMENT_URL/api/health" | jq '.' || echo "⚠️  Health check failed - check your deployment"

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables:"
echo "   vercel env add OPENAI_API_KEY"
echo "   vercel env add GOOGLE_CLOUD_VISION_API_KEY"
echo "   vercel env add AWS_ACCESS_KEY_ID"
echo "   vercel env add AWS_SECRET_ACCESS_KEY"
echo "   vercel env add JWT_SECRET"
echo ""
echo "2. Update your frontend API config with:"
echo "   $DEPLOYMENT_URL"
echo ""
echo "3. Test your endpoints:"
echo "   curl $DEPLOYMENT_URL/api/health"
echo ""
echo "📖 For detailed setup instructions, see:"
echo "   backend/PRODUCTION_SETUP.md"
