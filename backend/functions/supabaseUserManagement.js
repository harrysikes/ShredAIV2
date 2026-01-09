const express = require('express');
const { supabaseAdmin } = require('../lib/supabaseService');

const router = express.Router();

/**
 * Get user profile
 * GET /api/users/profile
 * Uses Supabase service role to bypass RLS if needed
 */
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({
        error: true,
        message: 'User ID required'
      });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: profile
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
 * Update user subscription
 * PUT /api/users/subscription
 */
router.put('/subscription', async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];
    const { subscription_tier, subscription_expires_at } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        error: true,
        message: 'User ID required'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: subscription_tier || 'free',
        subscription_expires_at: subscription_expires_at || null,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: {
        message: 'Subscription updated successfully',
        profile: data
      }
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to update subscription',
      details: error.message
    });
  }
});

/**
 * Get user progress summary
 * GET /api/users/progress
 */
router.get('/progress', async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({
        error: true,
        message: 'User ID required'
      });
    }

    // Get body fat history count
    const { count: historyCount } = await supabaseAdmin
      .from('body_fat_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get workout completions count
    const { count: workoutCount } = await supabaseAdmin
      .from('workout_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get workout tracking
    const { data: tracking } = await supabaseAdmin
      .from('workout_tracking')
      .select('day_one')
      .eq('user_id', userId)
      .single();

    res.json({
      success: true,
      data: {
        userId,
        totalBodyFatEntries: historyCount || 0,
        totalWorkoutsCompleted: workoutCount || 0,
        dayOne: tracking?.day_one || null,
        lastUpdated: new Date().toISOString()
      }
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

module.exports = router;
