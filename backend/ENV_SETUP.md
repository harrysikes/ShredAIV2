# Environment Variables Setup

## ✅ Already Set
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- AWS_S3_BUCKET

## 🔑 API Keys You Need to Get

### 1. OpenAI API Key
**How to get:**
1. Go to https://platform.openai.com/
2. Sign in to your account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

**Cost:** ~$0.006-0.01 per analysis

### 2. Google Cloud Vision API Key
**How to get:**
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable the Vision API
4. Go to "APIs & Services" → "Credentials"
5. Create credentials → "API Key"
6. Copy the API key
7. Also note your Project ID

**Cost:** First 1,000 requests/month free, then ~$0.0015 per request

### 3. Generate JWT Secret
Run this command to generate a secure JWT secret:
```bash
openssl rand -base64 32
```

## 📝 Values for Other Variables

### Rate Limiting (add these)
- `RATE_LIMIT_WINDOW_MS`: `900000` (15 minutes in milliseconds)
- `RATE_LIMIT_MAX_REQUESTS`: `100` (max requests per window)

### CORS (update with your app domain)
- `ALLOWED_ORIGINS`: `https://your-app-domain.com` or `*` for development

### Image Processing
- `MAX_IMAGE_SIZE_MB`: `10`
- `SUPPORTED_IMAGE_FORMATS`: `jpg,jpeg,png,webp`

## 🚀 Commands to Add Variables

After getting your keys, run these commands:

```bash
cd "/Users/sikesfamily/Desktop/ShredAI V2/backend"

# Add OpenAI key (paste your key when prompted)
vercel env add OPENAI_API_KEY production

# Add Google Cloud keys (paste when prompted)
vercel env add GOOGLE_CLOUD_VISION_API_KEY production
vercel env add GOOGLE_CLOUD_PROJECT_ID production

# Generate and add JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo "$JWT_SECRET" | vercel env add JWT_SECRET production

# Add rate limiting
vercel env add RATE_LIMIT_WINDOW_MS production
# Enter: 900000

vercel env add RATE_LIMIT_MAX_REQUESTS production
# Enter: 100

# Add CORS (use * for development)
vercel env add ALLOWED_ORIGINS production
# Enter: *

# Add image processing
vercel env add MAX_IMAGE_SIZE_MB production
# Enter: 10

vercel env add SUPPORTED_IMAGE_FORMATS production
# Enter: jpg,jpeg,png,webp
```

## ⚡ Quick Start Option

If you want to test deployment first without all keys, you can:
1. Skip Google Cloud for now (just use OpenAI)
2. Add minimal variables
3. Deploy and test
4. Add Google Cloud later if needed

