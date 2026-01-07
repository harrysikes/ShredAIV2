#!/bin/bash

echo "🔍 Testing ShredAI Backend Health Endpoint..."
echo ""
echo "Testing: https://backend-q8gcefib5-harry-sikes-projects.vercel.app/health"
echo ""

# Try to get health endpoint
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" https://backend-q8gcefib5-harry-sikes-projects.vercel.app/health)

# Extract HTTP code
http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE:/d')

echo "HTTP Status: $http_code"
echo ""
echo "Response:"
echo "$body" | head -20

if [[ "$http_code" == "200" ]]; then
    echo ""
    echo "✅ SUCCESS! Backend is working!"
else
    echo ""
    echo "❌ Backend still protected or not responding"
    echo "Make sure you disabled 'Deployment Protection' in Vercel Settings → Security"
fi


