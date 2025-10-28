#!/bin/bash

cd "/Users/sikesfamily/Desktop/ShredAI V2/backend"

echo "Adding remaining environment variables to Vercel..."
echo ""

# JWT Secret
echo "OM7T73VW3jfGBKZjCJSURzXzIDUwUza7XA96ZnZjCh8=" | vercel env add JWT_SECRET production

# Rate Limiting
echo "900000" | vercel env add RATE_LIMIT_WINDOW_MS production
echo "100" | vercel env add RATE_LIMIT_MAX_REQUESTS production

# CORS (using * for development)
echo "*" | vercel env add ALLOWED_ORIGINS production

# Image Processing
echo "10" | vercel env add MAX_IMAGE_SIZE_MB production
echo "jpg,jpeg,png,webp" | vercel env add SUPPORTED_IMAGE_FORMATS production

# Google Cloud (optional - use dummy values for now)
echo "your-google-cloud-vision-api-key" | vercel env add GOOGLE_CLOUD_VISION_API_KEY production
echo "your-google-cloud-project-id" | vercel env add GOOGLE_CLOUD_PROJECT_ID production

echo ""
echo "✅ Done! Now add your OpenAI API key manually."
echo "Run: vercel env add OPENAI_API_KEY production"

