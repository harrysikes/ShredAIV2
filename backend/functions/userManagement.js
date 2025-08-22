const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// In-memory storage (replace with database in production)
const users = new Map();
const sessions = new Map();

/**
 * User registration
 * POST /api/users/register
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, surveyData } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        error: true,
        message: 'Email, password, and name are required'
      });
    }
    
    // Check if user already exists
    if (users.has(email)) {
      return res.status(409).json({
        error: true,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      email,
      name,
      password: hashedPassword,
      surveyData: surveyData || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      subscription: {
        tier: 'free',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }
    };
    
    users.set(email, user);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          subscription: user.subscription
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to register user',
      details: error.message
    });
  }
});

/**
 * User login
 * POST /api/users/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        error: true,
        message: 'Account is deactivated'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Update last login
    user.lastLoginAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          subscription: user.subscription
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to login',
      details: error.message
    });
  }
});

/**
 * Get user profile
 * GET /api/users/profile
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          surveyData: user.surveyData,
          subscription: user.subscription,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to get user profile',
      details: error.message
    });
  }
});

/**
 * Update user profile
 * PUT /api/users/profile
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, surveyData } = req.body;
    const user = users.get(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Update fields
    if (name) user.name = name;
    if (surveyData) user.surveyData = { ...user.surveyData, ...surveyData };
    user.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          surveyData: user.surveyData,
          subscription: user.subscription,
          updatedAt: user.updatedAt
        }
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to update profile',
      details: error.message
    });
  }
});

/**
 * Update survey data
 * PUT /api/users/survey
 */
router.put('/survey', authenticateToken, async (req, res) => {
  try {
    const { surveyData } = req.body;
    const user = users.get(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Update survey data
    user.surveyData = { ...user.surveyData, ...surveyData };
    user.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: {
        message: 'Survey data updated successfully',
        surveyData: user.surveyData
      }
    });
    
  } catch (error) {
    console.error('Update survey error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to update survey data',
      details: error.message
    });
  }
});

/**
 * Get user progress
 * GET /api/users/progress
 */
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // In a real app, you'd fetch progress from a database
    const progress = {
      userId: user.id,
      totalWorkouts: 0,
      streakDays: 0,
      bodyFatHistory: [],
      weightHistory: [],
      measurements: {},
      achievements: [],
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: progress
    });
    
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to get user progress',
      details: error.message
    });
  }
});

/**
 * Update user progress
 * PUT /api/users/progress
 */
router.put('/progress', authenticateToken, async (req, res) => {
  try {
    const { bodyFatPercentage, weight, measurements, workoutCompleted } = req.body;
    const user = users.get(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // In a real app, you'd store this in a database
    const progress = {
      userId: user.id,
      timestamp: new Date().toISOString(),
      bodyFatPercentage,
      weight,
      measurements,
      workoutCompleted
    };
    
    res.json({
      success: true,
      data: {
        message: 'Progress updated successfully',
        progress
      }
    });
    
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to update progress',
      details: error.message
    });
  }
});

/**
 * Change password
 * PUT /api/users/password
 */
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = users.get(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: true,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    user.password = hashedNewPassword;
    user.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: {
        message: 'Password updated successfully'
      }
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to change password',
      details: error.message
    });
  }
});

/**
 * Delete user account
 * DELETE /api/users/account
 */
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const user = users.get(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: true,
        message: 'Password is incorrect'
      });
    }
    
    // Delete user (in production, you'd soft delete)
    users.delete(req.user.email);
    
    res.json({
      success: true,
      data: {
        message: 'Account deleted successfully'
      }
    });
    
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to delete account',
      details: error.message
    });
  }
});

/**
 * JWT Authentication Middleware
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      error: true,
      message: 'Access token required'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        error: true,
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
}

module.exports = router;
