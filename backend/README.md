# 🚀 ShredAI Backend

A production-ready backend for the ShredAI fitness app, featuring AI-powered body composition analysis and personalized workout planning.

## ✨ Features

- **AI-Powered Body Analysis**: Google Vision API + OpenAI integration
- **Personalized Workout Plans**: GPT-4 generated fitness routines
- **User Management**: JWT authentication, user profiles, progress tracking
- **Image Processing**: Secure image upload and analysis
- **Rate Limiting**: API protection and abuse prevention
- **Security**: Helmet.js, CORS, input validation

## 🏗️ Architecture

```
backend/
├── functions/           # API route handlers
│   ├── bodyAnalysis.js  # Body composition analysis
│   ├── workoutPlans.js  # Workout generation
│   └── userManagement.js # User auth & profiles
├── config/              # Configuration files
├── utils/               # Utility functions
├── models/              # Data models
├── index.js             # Main server file
├── package.json         # Dependencies
└── vercel.json          # Deployment config
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the environment template and fill in your API keys:

```bash
cp env.example .env
```

Required environment variables:

```bash
# AI Services
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLOUD_VISION_API_KEY=path_to_google_credentials.json
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id

# AWS (Optional - for image storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=shredai-user-images

# Security
JWT_SECRET=your_jwt_secret_key

# Server
PORT=3000
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Test body analysis (requires image file)
curl -X POST http://localhost:3000/api/body-analysis/analyze \
  -F "image=@test-image.jpg" \
  -F "surveyData={\"sex\":\"male\",\"age\":25}"
```

## 🔧 API Endpoints

### Body Analysis
- `POST /api/body-analysis/analyze` - Analyze body composition from image

### Workout Plans
- `POST /api/workouts/generate` - Generate personalized workout plan
- `GET /api/workouts/:planId` - Get workout plan by ID
- `PUT /api/workouts/:planId/progress` - Update workout progress

### User Management
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/survey` - Update survey data
- `GET /api/users/progress` - Get user progress
- `PUT /api/users/progress` - Update user progress

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard

### Option 2: Traditional Hosting

1. Build the app:
```bash
npm run build
```

2. Deploy to your preferred hosting service (Heroku, DigitalOcean, AWS, etc.)

3. Set environment variables on your hosting platform

## 🔐 API Keys Setup

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing
3. Generate an API key
4. Add to your `.env` file

### Google Cloud Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Vision API
4. Create service account and download credentials JSON
5. Add path to your `.env` file

### AWS S3 (Optional)
1. Create AWS account
2. Create S3 bucket for image storage
3. Create IAM user with S3 access
4. Add credentials to your `.env` file

## 📊 Database Integration

Currently using in-memory storage. For production, integrate with:

- **PostgreSQL**: Full-featured relational database
- **MongoDB**: Document-based database
- **Supabase**: Open-source Firebase alternative
- **Firebase**: Google's backend-as-a-service

## 🔒 Security Features

- **JWT Authentication**: Secure user sessions
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Control cross-origin requests
- **Input Validation**: Sanitize user inputs
- **Helmet.js**: Security headers

## 📈 Monitoring & Logging

- **Error Handling**: Comprehensive error responses
- **Request Logging**: Track API usage
- **Health Checks**: Monitor service status
- **Performance Metrics**: Response times and throughput

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run linting
npm run lint

# Format code
npm run format
```

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Set strong JWT secret
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure database
- [ ] Set up image storage
- [ ] Test all API endpoints
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

## 🔮 Future Enhancements

- **Real-time Analytics**: Live workout tracking
- **Social Features**: Share progress with friends
- **Advanced AI**: More sophisticated body analysis
- **Integration**: Connect with fitness trackers
- **Mobile Push**: Workout reminders and notifications
