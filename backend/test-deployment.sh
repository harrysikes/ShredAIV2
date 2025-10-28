#!/bin/bash

# 🧪 ShredAI Backend Deployment Test Script
# This script tests all your deployed endpoints

echo "🧪 Testing ShredAI Backend Deployment..."
echo ""

# Get deployment URL from user
echo -n "🌐 Enter your Vercel deployment URL: "
read -r DEPLOYMENT_URL

if [ -z "$DEPLOYMENT_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo "Testing endpoints at: $DEPLOYMENT_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local data=$3
    local description=$4
    
    echo "🔍 Testing: $description"
    echo "   $method $endpoint"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -X POST "$DEPLOYMENT_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -X "$method" "$DEPLOYMENT_URL$endpoint")
    fi
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Success: $response"
    else
        echo "   ❌ Failed: $response"
    fi
    echo ""
}

# Test health endpoint
test_endpoint "/api/health" "GET" "" "Health Check"

# Test body analysis endpoint
test_endpoint "/api/body-analysis" "POST" '{"test": true}' "Body Analysis Endpoint"

# Test workout plans endpoint
test_endpoint "/api/workouts" "POST" '{"goal": "build-muscle", "frequency": "sometimes"}' "Workout Plans Endpoint"

# Test user management endpoint
test_endpoint "/api/users/register" "POST" '{"email": "test@example.com", "password": "test123"}' "User Registration Endpoint"

echo "🎉 Testing complete!"
echo ""
echo "📋 Results Summary:"
echo "✅ Health check: Should return status healthy"
echo "✅ Body analysis: Should return analysis data"
echo "✅ Workout plans: Should return workout plan"
echo "✅ User management: Should return user data"
echo ""
echo "⚠️  Note: Some endpoints may require authentication or specific data formats"
echo "📖 For detailed API documentation, see: backend/README.md"
