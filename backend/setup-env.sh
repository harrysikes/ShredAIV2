#!/bin/bash

# 🔧 ShredAI Backend Environment Setup Script
# This script helps you set up all required environment variables

echo "🔧 Setting up ShredAI Backend Environment Variables..."
echo ""

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local var_description=$2
    local var_example=$3
    
    echo "📝 Setting up: $var_description"
    echo "   Example: $var_example"
    echo -n "   Enter value: "
    read -r value
    
    if [ -n "$value" ]; then
        vercel env add "$var_name" <<< "$value"
        echo "   ✅ $var_name set successfully"
    else
        echo "   ⚠️  Skipped $var_name"
    fi
    echo ""
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

# Check if we're logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

echo "🚀 Starting environment setup..."
echo ""

# API Keys
add_env_var "OPENAI_API_KEY" "OpenAI API Key" "sk-your-openai-key-here"

# AWS Configuration
add_env_var "AWS_ACCESS_KEY_ID" "AWS Access Key ID" "your-aws-access-key"
add_env_var "AWS_SECRET_ACCESS_KEY" "AWS Secret Access Key" "your-aws-secret-key"
add_env_var "AWS_REGION" "AWS Region" "us-east-1"
add_env_var "AWS_S3_BUCKET" "AWS S3 Bucket Name" "shredai-user-images"

# Security
add_env_var "JWT_SECRET" "JWT Secret Key" "your-super-secret-jwt-key-here"

# Rate Limiting
add_env_var "RATE_LIMIT_WINDOW_MS" "Rate Limit Window (ms)" "900000"
add_env_var "RATE_LIMIT_MAX_REQUESTS" "Max Requests per Window" "100"

# CORS
add_env_var "ALLOWED_ORIGINS" "Allowed CORS Origins" "https://your-app-domain.com"

# Image Processing
add_env_var "MAX_IMAGE_SIZE_MB" "Max Image Size (MB)" "10"
add_env_var "SUPPORTED_IMAGE_FORMATS" "Supported Image Formats" "jpg,jpeg,png,webp"

echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy your backend: vercel --prod"
echo "2. Test your endpoints"
echo "3. Update your frontend API config"
echo ""
echo "📖 For detailed instructions, see:"
echo "   backend/PRODUCTION_SETUP.md"
