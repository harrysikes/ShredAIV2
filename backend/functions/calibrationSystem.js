const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory storage for calibration data (replace with database in production)
const calibrationData = new Map();
const userFeedback = new Map();
const accuracyMetrics = new Map();

/**
 * Submit calibration data for accuracy improvement
 * POST /api/calibration/submit
 */
router.post('/submit', async (req, res) => {
  try {
    const { 
      userId, 
      analysisId, 
      estimatedBodyFat, 
      actualBodyFat, 
      measurementMethod, 
      confidence,
      imageQuality,
      surveyData 
    } = req.body;
    
    if (!userId || !analysisId || !estimatedBodyFat || !actualBodyFat) {
      return res.status(400).json({
        error: true,
        message: 'Missing required calibration data'
      });
    }
    
    // Store calibration data
    const calibrationId = uuidv4();
    const calibrationRecord = {
      id: calibrationId,
      userId,
      analysisId,
      estimatedBodyFat: parseFloat(estimatedBodyFat),
      actualBodyFat: parseFloat(actualBodyFat),
      measurementMethod,
      confidence: parseFloat(confidence) || 0.5,
      imageQuality: parseFloat(imageQuality) || 0.5,
      surveyData,
      timestamp: new Date().toISOString(),
      accuracy: calculateAccuracy(estimatedBodyFat, actualBodyFat),
      error: Math.abs(estimatedBodyFat - actualBodyFat)
    };
    
    calibrationData.set(calibrationId, calibrationRecord);
    
    // Update accuracy metrics
    updateAccuracyMetrics(calibrationRecord);
    
    res.json({
      success: true,
      data: {
        message: 'Calibration data submitted successfully',
        calibrationId,
        accuracy: calibrationRecord.accuracy,
        error: calibrationRecord.error
      }
    });
    
  } catch (error) {
    console.error('Calibration submission error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to submit calibration data',
      details: error.message
    });
  }
});

/**
 * Submit user feedback for analysis quality
 * POST /api/calibration/feedback
 */
router.post('/feedback', async (req, res) => {
  try {
    const { 
      userId, 
      analysisId, 
      feedbackType, 
      rating, 
      comments,
      category 
    } = req.body;
    
    if (!userId || !analysisId || !feedbackType || !rating) {
      return res.status(400).json({
        error: true,
        message: 'Missing required feedback data'
      });
    }
    
    // Store user feedback
    const feedbackId = uuidv4();
    const feedbackRecord = {
      id: feedbackId,
      userId,
      analysisId,
      feedbackType,
      rating: parseInt(rating),
      comments,
      category,
      timestamp: new Date().toISOString()
    };
    
    userFeedback.set(feedbackId, feedbackRecord);
    
    res.json({
      success: true,
      data: {
        message: 'Feedback submitted successfully',
        feedbackId
      }
    });
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to submit feedback',
      details: error.message
    });
  }
});

/**
 * Get calibration statistics and accuracy metrics
 * GET /api/calibration/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = calculateCalibrationStats();
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Stats retrieval error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to retrieve calibration stats',
      details: error.message
    });
  }
});

/**
 * Get personalized accuracy improvements
 * GET /api/calibration/improvements/:userId
 */
router.get('/improvements/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const improvements = generatePersonalizedImprovements(userId);
    
    res.json({
      success: true,
      data: improvements
    });
    
  } catch (error) {
    console.error('Improvements retrieval error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to retrieve improvements',
      details: error.message
    });
  }
});

/**
 * Calculate accuracy between estimated and actual values
 */
function calculateAccuracy(estimated, actual) {
  const error = Math.abs(estimated - actual);
  const maxError = 20; // Maximum expected error (20% body fat)
  
  // Accuracy is 100% if error is 0, decreases linearly to 0% at maxError
  const accuracy = Math.max(0, 100 - (error / maxError) * 100);
  
  return Math.round(accuracy * 100) / 100;
}

/**
 * Update accuracy metrics with new calibration data
 */
function updateAccuracyMetrics(calibrationRecord) {
  const { accuracy, error, imageQuality, confidence, measurementMethod } = calibrationRecord;
  
  // Update overall accuracy metrics
  if (!accuracyMetrics.has('overall')) {
    accuracyMetrics.set('overall', {
      totalCalibrations: 0,
      averageAccuracy: 0,
      averageError: 0,
      accuracyHistory: [],
      errorHistory: []
    });
  }
  
  const overall = accuracyMetrics.get('overall');
  overall.totalCalibrations++;
  overall.accuracyHistory.push(accuracy);
  overall.errorHistory.push(error);
  
  // Calculate running averages
  overall.averageAccuracy = overall.accuracyHistory.reduce((sum, acc) => sum + acc, 0) / overall.accuracyHistory.length;
  overall.averageError = overall.errorHistory.reduce((sum, err) => sum + err, 0) / overall.errorHistory.length;
  
  // Update quality-based metrics
  const qualityKey = `quality_${Math.round(imageQuality * 10) / 10}`;
  if (!accuracyMetrics.has(qualityKey)) {
    accuracyMetrics.set(qualityKey, {
      totalCalibrations: 0,
      averageAccuracy: 0,
      averageError: 0
    });
  }
  
  const qualityMetrics = accuracyMetrics.get(qualityKey);
  qualityMetrics.totalCalibrations++;
  qualityMetrics.averageAccuracy = ((qualityMetrics.averageAccuracy * (qualityMetrics.totalCalibrations - 1)) + accuracy) / qualityMetrics.totalCalibrations;
  qualityMetrics.averageError = ((qualityMetrics.averageError * (qualityMetrics.totalCalibrations - 1)) + error) / qualityMetrics.totalCalibrations;
  
  // Update confidence-based metrics
  const confidenceKey = `confidence_${Math.round(confidence * 10) / 10}`;
  if (!accuracyMetrics.has(confidenceKey)) {
    accuracyMetrics.set(confidenceKey, {
      totalCalibrations: 0,
      averageAccuracy: 0,
      averageError: 0
    });
  }
  
  const confidenceMetrics = accuracyMetrics.get(confidenceKey);
  confidenceMetrics.totalCalibrations++;
  confidenceMetrics.averageAccuracy = ((confidenceMetrics.averageAccuracy * (confidenceMetrics.totalCalibrations - 1)) + accuracy) / confidenceMetrics.totalCalibrations;
  confidenceMetrics.averageError = ((confidenceMetrics.averageError * (confidenceMetrics.totalCalibrations - 1)) + error) / confidenceMetrics.totalCalibrations;
  
  // Update measurement method metrics
  if (measurementMethod) {
    const methodKey = `method_${measurementMethod}`;
    if (!accuracyMetrics.has(methodKey)) {
      accuracyMetrics.set(methodKey, {
        totalCalibrations: 0,
        averageAccuracy: 0,
        averageError: 0
      });
    }
    
    const methodMetrics = accuracyMetrics.get(methodKey);
    methodMetrics.totalCalibrations++;
    methodMetrics.averageAccuracy = ((methodMetrics.averageAccuracy * (methodMetrics.totalCalibrations - 1)) + accuracy) / methodMetrics.totalCalibrations;
    methodMetrics.averageError = ((methodMetrics.averageError * (methodMetrics.totalCalibrations - 1)) + error) / methodMetrics.totalCalibrations;
  }
}

/**
 * Calculate comprehensive calibration statistics
 */
function calculateCalibrationStats() {
  const overall = accuracyMetrics.get('overall') || {
    totalCalibrations: 0,
    averageAccuracy: 0,
    averageError: 0
  };
  
  // Calculate quality-based accuracy trends
  const qualityTrends = [];
  for (const [key, metrics] of accuracyMetrics.entries()) {
    if (key.startsWith('quality_') && metrics.totalCalibrations >= 5) {
      const quality = parseFloat(key.replace('quality_', ''));
      qualityTrends.push({
        quality: Math.round(quality * 100) / 100,
        accuracy: Math.round(metrics.averageAccuracy * 100) / 100,
        error: Math.round(metrics.averageError * 100) / 100,
        samples: metrics.totalCalibrations
      });
    }
  }
  
  // Calculate confidence-based accuracy trends
  const confidenceTrends = [];
  for (const [key, metrics] of accuracyMetrics.entries()) {
    if (key.startsWith('confidence_') && metrics.totalCalibrations >= 5) {
      const confidence = parseFloat(key.replace('confidence_', ''));
      confidenceTrends.push({
        confidence: Math.round(confidence * 100) / 100,
        accuracy: Math.round(metrics.averageAccuracy * 100) / 100,
        error: Math.round(metrics.averageError * 100) / 100,
        samples: metrics.totalCalibrations
      });
    }
  }
  
  // Calculate recent accuracy trends (last 10 calibrations)
  const recentAccuracy = overall.accuracyHistory.slice(-10);
  const recentError = overall.errorHistory.slice(-10);
  
  const recentTrend = {
    averageAccuracy: recentAccuracy.length > 0 ? Math.round(recentAccuracy.reduce((sum, acc) => sum + acc, 0) / recentAccuracy.length * 100) / 100 : 0,
    averageError: recentError.length > 0 ? Math.round(recentError.reduce((sum, err) => sum + err, 0) / recentError.length * 100) / 100 : 0,
    samples: recentAccuracy.length
  };
  
  return {
    overall: {
      totalCalibrations: overall.totalCalibrations,
      averageAccuracy: Math.round(overall.averageAccuracy * 100) / 100,
      averageError: Math.round(overall.averageError * 100) / 100
    },
    qualityTrends: qualityTrends.sort((a, b) => a.quality - b.quality),
    confidenceTrends: confidenceTrends.sort((a, b) => a.confidence - b.confidence),
    recentTrend,
    recommendations: generateAccuracyRecommendations(overall, qualityTrends, confidenceTrends)
  };
}

/**
 * Generate accuracy improvement recommendations
 */
function generateAccuracyRecommendations(overall, qualityTrends, confidenceTrends) {
  const recommendations = [];
  
  // Overall accuracy recommendations
  if (overall.averageAccuracy < 80) {
    recommendations.push({
      type: 'overall',
      priority: 'high',
      message: 'Overall accuracy is below target. Consider improving image quality and lighting.',
      action: 'Focus on better photo setup and consistent measurement conditions.'
    });
  }
  
  // Quality-based recommendations
  if (qualityTrends.length > 0) {
    const lowQualityAccuracy = qualityTrends.find(t => t.quality < 0.6);
    if (lowQualityAccuracy && lowQualityAccuracy.accuracy < 70) {
      recommendations.push({
        type: 'quality',
        priority: 'high',
        message: 'Low image quality significantly reduces accuracy.',
        action: 'Improve lighting, reduce camera shake, and ensure proper focus.'
      });
    }
    
    const highQualityAccuracy = qualityTrends.find(t => t.quality > 0.8);
    if (highQualityAccuracy && highQualityAccuracy.accuracy > 85) {
      recommendations.push({
        type: 'quality',
        priority: 'medium',
        message: 'High image quality provides excellent accuracy.',
        action: 'Maintain current photo standards for best results.'
      });
    }
  }
  
  // Confidence-based recommendations
  if (confidenceTrends.length > 0) {
    const lowConfidenceAccuracy = confidenceTrends.find(t => t.confidence < 0.5);
    if (lowConfidenceAccuracy && lowConfidenceAccuracy.accuracy < 75) {
      recommendations.push({
        type: 'confidence',
        priority: 'high',
        message: 'Low confidence analyses are less accurate.',
        action: 'Retake photos with better pose and lighting when confidence is low.'
      });
    }
  }
  
  // Recent trend recommendations
  if (overall.accuracyHistory.length >= 10) {
    const recentAccuracy = overall.accuracyHistory.slice(-10);
    const olderAccuracy = overall.accuracyHistory.slice(-20, -10);
    
    if (recentAccuracy.length >= 5 && olderAccuracy.length >= 5) {
      const recentAvg = recentAccuracy.reduce((sum, acc) => sum + acc, 0) / recentAccuracy.length;
      const olderAvg = olderAccuracy.reduce((sum, acc) => sum + acc, 0) / olderAccuracy.length;
      
      if (recentAvg < olderAvg - 5) {
        recommendations.push({
          type: 'trend',
          priority: 'medium',
          message: 'Recent accuracy has declined compared to previous measurements.',
          action: 'Review recent photo setup and consider recalibrating measurement conditions.'
        });
      } else if (recentAvg > olderAvg + 5) {
        recommendations.push({
          type: 'trend',
          priority: 'low',
          message: 'Recent accuracy has improved significantly.',
          action: 'Continue current practices as they are working well.'
        });
      }
    }
  }
  
  return recommendations;
}

/**
 * Generate personalized accuracy improvements for a user
 */
function generatePersonalizedImprovements(userId) {
  const userCalibrations = Array.from(calibrationData.values())
    .filter(cal => cal.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  if (userCalibrations.length === 0) {
    return {
      message: 'No calibration data available yet. Submit your first calibration to get personalized recommendations.',
      recommendations: [
        'Take photos with consistent lighting and pose',
        'Use the same measurement method for calibration',
        'Submit feedback after each analysis'
      ]
    };
  }
  
  const recentCalibrations = userCalibrations.slice(0, 5);
  const averageAccuracy = recentCalibrations.reduce((sum, cal) => sum + cal.accuracy, 0) / recentCalibrations.length;
  const averageError = recentCalibrations.reduce((sum, cal) => sum + cal.error, 0) / recentCalibrations.length;
  
  const improvements = {
    currentPerformance: {
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      averageError: Math.round(averageError * 100) / 100,
      totalCalibrations: userCalibrations.length
    },
    recommendations: []
  };
  
  // Generate personalized recommendations based on user's data
  if (averageAccuracy < 80) {
    improvements.recommendations.push({
      type: 'accuracy',
      priority: 'high',
      message: 'Your analysis accuracy is below optimal levels.',
      action: 'Focus on improving photo quality and consistency.',
      specificTips: [
        'Ensure consistent lighting conditions',
        'Use the same camera angle and distance',
        'Wear similar clothing for consistency',
        'Take photos at the same time of day'
      ]
    });
  }
  
  // Analyze image quality trends
  const qualityGroups = groupByQuality(recentCalibrations);
  if (qualityGroups.low && qualityGroups.low.length > 0) {
    const lowQualityAccuracy = qualityGroups.low.reduce((sum, cal) => sum + cal.accuracy, 0) / qualityGroups.low.length;
    if (lowQualityAccuracy < 70) {
      improvements.recommendations.push({
        type: 'quality',
        priority: 'high',
        message: 'Low image quality is significantly reducing your accuracy.',
        action: 'Improve your photo setup immediately.',
        specificTips: [
          'Use better lighting (natural light or bright indoor lighting)',
          'Ensure camera is stable (use tripod or steady surface)',
          'Clean camera lens before taking photos',
          'Avoid shadows and harsh lighting'
        ]
      });
    }
  }
  
  // Analyze confidence trends
  const confidenceGroups = groupByConfidence(recentCalibrations);
  if (confidenceGroups.low && confidenceGroups.low.length > 0) {
    const lowConfidenceAccuracy = confidenceGroups.low.reduce((sum, cal) => sum + cal.accuracy, 0) / confidenceGroups.low.length;
    if (lowConfidenceAccuracy < 75) {
      improvements.recommendations.push({
        type: 'confidence',
        priority: 'medium',
        message: 'Low confidence analyses are less accurate for you.',
        action: 'Retake photos when confidence is low.',
        specificTips: [
          'Check the confidence score before submitting',
          'Retake photos if confidence is below 70%',
          'Improve pose and lighting for better confidence',
          'Use the setup guide for optimal conditions'
        ]
      });
    }
  }
  
  // Progress tracking
  if (userCalibrations.length >= 3) {
    const progress = analyzeProgress(userCalibrations);
    if (progress.trend === 'improving') {
      improvements.recommendations.push({
        type: 'progress',
        priority: 'low',
        message: 'Great job! Your accuracy is improving.',
        action: 'Continue your current practices.',
        specificTips: [
          'Keep using the same photo setup',
          'Maintain consistent measurement conditions',
          'Your technique is working well'
        ]
      });
    } else if (progress.trend === 'declining') {
      improvements.recommendations.push({
        type: 'progress',
        priority: 'medium',
        message: 'Your accuracy has declined recently.',
        action: 'Review and adjust your photo setup.',
        specificTips: [
          'Compare recent photos to your best ones',
          'Check for changes in lighting or setup',
          'Consider recalibrating your measurement conditions'
        ]
      });
    }
  }
  
  return improvements;
}

/**
 * Group calibrations by quality level
 */
function groupByQuality(calibrations) {
  return calibrations.reduce((groups, cal) => {
    if (cal.imageQuality < 0.6) {
      if (!groups.low) groups.low = [];
      groups.low.push(cal);
    } else if (cal.imageQuality < 0.8) {
      if (!groups.medium) groups.medium = [];
      groups.medium.push(cal);
    } else {
      if (!groups.high) groups.high = [];
      groups.high.push(cal);
    }
    return groups;
  }, {});
}

/**
 * Group calibrations by confidence level
 */
function groupByConfidence(calibrations) {
  return calibrations.reduce((groups, cal) => {
    if (cal.confidence < 0.6) {
      if (!groups.low) groups.low = [];
      groups.low.push(cal);
    } else if (cal.confidence < 0.8) {
      if (!groups.medium) groups.medium = [];
      groups.medium.push(cal);
    } else {
      if (!groups.high) groups.high = [];
      groups.high.push(cal);
    }
    return groups;
  }, {});
}

/**
 * Analyze progress trends
 */
function analyzeProgress(calibrations) {
  if (calibrations.length < 3) {
    return { trend: 'insufficient_data' };
  }
  
  const recent = calibrations.slice(0, 3);
  const older = calibrations.slice(3, 6);
  
  if (older.length < 3) {
    return { trend: 'insufficient_data' };
  }
  
  const recentAvg = recent.reduce((sum, cal) => sum + cal.accuracy, 0) / recent.length;
  const olderAvg = older.reduce((sum, cal) => sum + cal.accuracy, 0) / older.length;
  
  if (recentAvg > olderAvg + 2) {
    return { trend: 'improving', change: Math.round((recentAvg - olderAvg) * 100) / 100 };
  } else if (recentAvg < olderAvg - 2) {
    return { trend: 'declining', change: Math.round((olderAvg - recentAvg) * 100) / 100 };
  } else {
    return { trend: 'stable', change: Math.round(Math.abs(recentAvg - olderAvg) * 100) / 100 };
  }
}

module.exports = router;
