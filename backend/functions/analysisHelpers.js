/**
 * Enhanced Analysis Helper Functions
 * These functions provide sophisticated analysis capabilities for body composition assessment
 */

/**
 * Analyze enhanced image quality using multiple factors
 */
function analyzeEnhancedImageQuality(properties, faces, objects) {
  try {
    let quality = 0.5; // Base quality
    
    // Color analysis
    const colors = properties.dominantColors?.colors || [];
    const colorCount = colors.length;
    
    // More colors usually means better image quality
    if (colorCount > 0) {
      quality += Math.min(0.3, colorCount / 30);
    }
    
    // Face detection improves quality assessment
    if (faces.length > 0) {
      quality += 0.2;
      
      // Analyze face quality
      const faceQuality = analyzeFaceQuality(faces);
      quality += faceQuality * 0.1;
    }
    
    // Object detection quality
    if (objects.length > 0) {
      const objectQuality = analyzeObjectQuality(objects);
      quality += objectQuality * 0.1;
    }
    
    // Color distribution analysis
    const colorDistribution = analyzeColorDistribution(properties);
    quality += colorDistribution * 0.1;
    
    return Math.min(1.0, Math.max(0.1, quality));
    
  } catch (error) {
    console.error('Enhanced image quality analysis error:', error);
    return 0.6; // Fallback quality
  }
}

/**
 * Analyze face quality for better assessment
 */
function analyzeFaceQuality(faces) {
  try {
    if (faces.length === 0) return 0;
    
    let totalQuality = 0;
    
    for (const face of faces) {
      let faceQuality = 0.5;
      
      // Face detection confidence
      if (face.detectionConfidence) {
        faceQuality += face.detectionConfidence * 0.3;
      }
      
      // Joy likelihood (indicates good lighting)
      if (face.joyLikelihood === 'VERY_LIKELY' || face.joyLikelihood === 'LIKELY') {
        faceQuality += 0.1;
      }
      
      // Sorrow likelihood (indicates poor lighting)
      if (face.sorrowLikelihood === 'VERY_LIKELY' || face.sorrowLikelihood === 'LIKELY') {
        faceQuality -= 0.1;
      }
      
      // Anger likelihood (indicates poor image quality)
      if (face.angerLikelihood === 'VERY_LIKELY' || face.angerLikelihood === 'LIKELY') {
        faceQuality -= 0.1;
      }
      
      // Surprise likelihood (indicates good image quality)
      if (face.surpriseLikelihood === 'VERY_LIKELY' || face.surpriseLikelihood === 'LIKELY') {
        faceQuality += 0.1;
      }
      
      totalQuality += Math.max(0, Math.min(1, faceQuality));
    }
    
    return totalQuality / faces.length;
    
  } catch (error) {
    console.error('Face quality analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze object detection quality
 */
function analyzeObjectQuality(objects) {
  try {
    if (objects.length === 0) return 0;
    
    let totalQuality = 0;
    
    for (const obj of objects) {
      let objectQuality = 0.5;
      
      // Object detection confidence
      if (obj.score) {
        objectQuality += obj.score * 0.4;
      }
      
      // Bounding box quality
      if (obj.boundingPoly && obj.boundingPoly.vertices) {
        const vertices = obj.boundingPoly.vertices;
        if (vertices.length === 4) {
          // Check if bounding box is reasonable size
          const width = Math.abs(vertices[1].x - vertices[0].x);
          const height = Math.abs(vertices[2].y - vertices[1].y);
          
          if (width > 50 && height > 50) {
            objectQuality += 0.1;
          }
        }
      }
      
      totalQuality += Math.max(0, Math.min(1, objectQuality));
    }
    
    return totalQuality / objects.length;
    
  } catch (error) {
    console.error('Object quality analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze color distribution for image quality
 */
function analyzeColorDistribution(properties) {
  try {
    const colors = properties.dominantColors?.colors || [];
    if (colors.length === 0) return 0.5;
    
    let distributionScore = 0.5;
    
    // Check for color variety
    if (colors.length >= 5) {
      distributionScore += 0.2;
    } else if (colors.length >= 3) {
      distributionScore += 0.1;
    }
    
    // Check for color balance
    const totalScore = colors.reduce((sum, color) => sum + (color.score || 0), 0);
    if (totalScore > 0) {
      const normalizedScores = colors.map(color => (color.score || 0) / totalScore);
      const variance = calculateVariance(normalizedScores);
      
      // Lower variance means more balanced colors
      if (variance < 0.1) {
        distributionScore += 0.2;
      } else if (variance < 0.2) {
        distributionScore += 0.1;
      }
    }
    
    return Math.max(0, Math.min(1, distributionScore));
    
  } catch (error) {
    console.error('Color distribution analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze enhanced lighting conditions
 */
function analyzeEnhancedLighting(properties, faces) {
  try {
    let lightingScore = 0.5;
    
    // Analyze dominant colors for brightness
    const colors = properties.dominantColors?.colors || [];
    if (colors.length > 0) {
      const brightness = analyzeBrightness(colors);
      lightingScore = calculateLightingScore(brightness);
    }
    
    // Face-based lighting analysis
    if (faces.length > 0) {
      const faceLighting = analyzeFaceLighting(faces);
      lightingScore = (lightingScore * 0.7) + (faceLighting * 0.3);
    }
    
    // Check for over/under exposure
    const exposure = analyzeExposure(properties);
    lightingScore = adjustForExposure(lightingScore, exposure);
    
    return Math.max(0.1, Math.min(1.0, lightingScore));
    
  } catch (error) {
    console.error('Enhanced lighting analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze brightness from dominant colors
 */
function analyzeBrightness(colors) {
  try {
    if (colors.length === 0) return 0.5;
    
    let totalBrightness = 0;
    let totalWeight = 0;
    
    for (const color of colors) {
      const weight = color.score || 0;
      const brightness = (color.color.red + color.color.green + color.color.blue) / 3;
      
      totalBrightness += brightness * weight;
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? totalBrightness / totalWeight : 0.5;
    
  } catch (error) {
    console.error('Brightness analysis error:', error);
    return 0.5;
  }
}

/**
 * Calculate lighting score from brightness
 */
function calculateLightingScore(brightness) {
  // Normalize brightness to 0-1 range
  const normalizedBrightness = brightness / 255;
  
  // Optimal lighting is around 0.4-0.7 brightness
  // Too dark (< 0.3) or too bright (> 0.8) reduces quality
  let lightingScore = 1.0;
  
  if (normalizedBrightness < 0.3) {
    lightingScore = 1.0 - Math.pow((0.3 - normalizedBrightness) / 0.3, 2);
  } else if (normalizedBrightness > 0.8) {
    lightingScore = 1.0 - Math.pow((normalizedBrightness - 0.8) / 0.2, 2);
  }
  
  return Math.max(0.1, lightingScore);
}

/**
 * Analyze face-based lighting
 */
function analyzeFaceLighting(faces) {
  try {
    if (faces.length === 0) return 0.5;
    
    let totalLighting = 0;
    
    for (const face of faces) {
      let faceLighting = 0.5;
      
      // Face detection confidence indicates good lighting
      if (face.detectionConfidence) {
        faceLighting += face.detectionConfidence * 0.3;
      }
      
      // Joy likelihood often indicates good lighting
      if (face.joyLikelihood === 'VERY_LIKELY') {
        faceLighting += 0.2;
      } else if (face.joyLikelihood === 'LIKELY') {
        faceLighting += 0.1;
      }
      
      // Sorrow/anger likelihood often indicates poor lighting
      if (face.sorrowLikelihood === 'VERY_LIKELY' || face.angerLikelihood === 'VERY_LIKELY') {
        faceLighting -= 0.1;
      }
      
      totalLighting += Math.max(0, Math.min(1, faceLighting));
    }
    
    return totalLighting / faces.length;
    
  } catch (error) {
    console.error('Face lighting analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze exposure levels
 */
function analyzeExposure(properties) {
  try {
    const colors = properties.dominantColors?.colors || [];
    if (colors.length === 0) return 'normal';
    
    let darkPixels = 0;
    let brightPixels = 0;
    let totalPixels = 0;
    
    for (const color of colors) {
      const weight = color.score || 0;
      const brightness = (color.color.red + color.color.green + color.color.blue) / 3;
      
      if (brightness < 85) darkPixels += weight;
      if (brightness > 170) brightPixels += weight;
      totalPixels += weight;
    }
    
    if (totalPixels > 0) {
      const darkRatio = darkPixels / totalPixels;
      const brightRatio = brightPixels / totalPixels;
      
      if (darkRatio > 0.6) return 'underexposed';
      if (brightRatio > 0.6) return 'overexposed';
    }
    
    return 'normal';
    
  } catch (error) {
    console.error('Exposure analysis error:', error);
    return 'normal';
  }
}

/**
 * Adjust lighting score for exposure
 */
function adjustForExposure(lightingScore, exposure) {
  switch (exposure) {
    case 'underexposed':
      return lightingScore * 0.7;
    case 'overexposed':
      return lightingScore * 0.8;
    default:
      return lightingScore;
  }
}

/**
 * Analyze enhanced pose quality
 */
function analyzeEnhancedPose(faces, objects, landmarks) {
  try {
    let poseScore = 0.5;
    
    // Face detection suggests good pose
    if (faces.length > 0) {
      poseScore += 0.3;
      
      // Analyze face pose quality
      const facePoseQuality = analyzeFacePoseQuality(faces);
      poseScore += facePoseQuality * 0.2;
    }
    
    // Object detection for pose analysis
    const poseObjects = objects.filter(obj => 
      ['person', 'human', 'body', 'torso', 'head'].includes(obj.name.toLowerCase())
    );
    
    if (poseObjects.length > 0) {
      poseScore += 0.2;
      
      // Analyze object pose quality
      const objectPoseQuality = analyzeObjectPoseQuality(poseObjects);
      poseScore += objectPoseQuality * 0.1;
    }
    
    // Landmark detection for pose analysis
    if (landmarks.length > 0) {
      const landmarkPoseQuality = analyzeLandmarkPoseQuality(landmarks);
      poseScore += landmarkPoseQuality * 0.1;
    }
    
    return Math.min(1.0, Math.max(0.1, poseScore));
    
  } catch (error) {
    console.error('Enhanced pose analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze face pose quality
 */
function analyzeFacePoseQuality(faces) {
  try {
    if (faces.length === 0) return 0.5;
    
    let totalQuality = 0;
    
    for (const face of faces) {
      let facePoseQuality = 0.5;
      
      // Face detection confidence
      if (face.detectionConfidence) {
        facePoseQuality += face.detectionConfidence * 0.3;
      }
      
      // Roll angle (head tilt)
      if (face.rollAngle !== undefined) {
        const rollAngle = Math.abs(face.rollAngle);
        if (rollAngle < 15) {
          facePoseQuality += 0.2; // Good pose
        } else if (rollAngle < 30) {
          facePoseQuality += 0.1; // Acceptable pose
        } else {
          facePoseQuality -= 0.1; // Poor pose
        }
      }
      
      // Pan angle (head turn)
      if (face.panAngle !== undefined) {
        const panAngle = Math.abs(face.panAngle);
        if (panAngle < 20) {
          facePoseQuality += 0.2; // Good pose
        } else if (panAngle < 45) {
          facePoseQuality += 0.1; // Acceptable pose
        } else {
          facePoseQuality -= 0.1; // Poor pose
        }
      }
      
      // Tilt angle (head up/down)
      if (face.tiltAngle !== undefined) {
        const tiltAngle = Math.abs(face.tiltAngle);
        if (tiltAngle < 15) {
          facePoseQuality += 0.2; // Good pose
        } else if (tiltAngle < 30) {
          facePoseQuality += 0.1; // Acceptable pose
        } else {
          facePoseQuality -= 0.1; // Poor pose
        }
      }
      
      totalQuality += Math.max(0, Math.min(1, facePoseQuality));
    }
    
    return totalQuality / faces.length;
    
  } catch (error) {
    console.error('Face pose quality analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze object pose quality
 */
function analyzeObjectPoseQuality(poseObjects) {
  try {
    if (poseObjects.length === 0) return 0.5;
    
    let totalQuality = 0;
    
    for (const obj of poseObjects) {
      let objectPoseQuality = 0.5;
      
      // Object detection confidence
      if (obj.score) {
        objectPoseQuality += obj.score * 0.3;
      }
      
      // Bounding box analysis
      if (obj.boundingPoly && obj.boundingPoly.vertices) {
        const vertices = obj.boundingPoly.vertices;
        if (vertices.length === 4) {
          // Check aspect ratio for pose quality
          const width = Math.abs(vertices[1].x - vertices[0].x);
          const height = Math.abs(vertices[2].y - vertices[1].y);
          
          if (width > 0 && height > 0) {
            const aspectRatio = width / height;
            
            // Human body typically has aspect ratio around 0.4-0.6
            if (aspectRatio >= 0.3 && aspectRatio <= 0.7) {
              objectPoseQuality += 0.2;
            } else if (aspectRatio >= 0.2 && aspectRatio <= 0.8) {
              objectPoseQuality += 0.1;
            }
          }
        }
      }
      
      totalQuality += Math.max(0, Math.min(1, objectPoseQuality));
    }
    
    return totalQuality / poseObjects.length;
    
  } catch (error) {
    console.error('Object pose quality analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze landmark pose quality
 */
function analyzeLandmarkPoseQuality(landmarks) {
  try {
    if (landmarks.length === 0) return 0.5;
    
    let totalQuality = 0;
    
    for (const landmark of landmarks) {
      let landmarkPoseQuality = 0.5;
      
      // Landmark detection confidence
      if (landmark.score) {
        landmarkPoseQuality += landmark.score * 0.4;
      }
      
      // Specific landmark types that indicate good pose
      const goodPoseLandmarks = ['face', 'head', 'eye', 'nose', 'mouth', 'ear'];
      if (goodPoseLandmarks.some(type => landmark.description.toLowerCase().includes(type))) {
        landmarkPoseQuality += 0.1;
      }
      
      totalQuality += Math.max(0, Math.min(1, landmarkPoseQuality));
    }
    
    return totalQuality / landmarks.length;
    
  } catch (error) {
    console.error('Landmark pose quality analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze image composition
 */
function analyzeImageComposition(properties, objects) {
  try {
    let compositionScore = 0.5;
    
    // Color composition
    const colors = properties.dominantColors?.colors || [];
    if (colors.length >= 3) {
      compositionScore += 0.2;
    } else if (colors.length >= 2) {
      compositionScore += 0.1;
    }
    
    // Object composition
    if (objects.length > 0) {
      const personObjects = objects.filter(obj => 
        ['person', 'human', 'body'].includes(obj.name.toLowerCase())
      );
      
      if (personObjects.length > 0) {
        compositionScore += 0.2;
        
        // Check object positioning
        const positioningQuality = analyzeObjectPositioning(personObjects);
        compositionScore += positioningQuality * 0.1;
      }
    }
    
    return Math.max(0.1, Math.min(1.0, compositionScore));
    
  } catch (error) {
    console.error('Image composition analysis error:', error);
    return 0.5;
  }
}

/**
 * Analyze object positioning for composition
 */
function analyzeObjectPositioning(personObjects) {
  try {
    if (personObjects.length === 0) return 0.5;
    
    let totalPositioning = 0;
    
    for (const obj of personObjects) {
      let positioningQuality = 0.5;
      
      // Check if object is centered (roughly)
      if (obj.boundingPoly && obj.boundingPoly.vertices) {
        const vertices = obj.boundingPoly.vertices;
        if (vertices.length === 4) {
          // Calculate center of bounding box
          const centerX = (vertices[0].x + vertices[1].x + vertices[2].x + vertices[3].x) / 4;
          const centerY = (vertices[0].y + vertices[1].y + vertices[2].y + vertices[3].y) / 4;
          
          // Assume image dimensions (could be enhanced with actual image dimensions)
          const imageWidth = 800;
          const imageHeight = 1200;
          
          // Check if object is roughly centered
          const xDeviation = Math.abs(centerX - imageWidth / 2) / imageWidth;
          const yDeviation = Math.abs(centerY - imageHeight / 2) / imageHeight;
          
          if (xDeviation < 0.2 && yDeviation < 0.2) {
            positioningQuality += 0.3; // Well centered
          } else if (xDeviation < 0.4 && yDeviation < 0.4) {
            positioningQuality += 0.1; // Acceptably positioned
          }
        }
      }
      
      totalPositioning += Math.max(0, Math.min(1, positioningQuality));
    }
    
    return totalPositioning / personObjects.length;
    
  } catch (error) {
    console.error('Object positioning analysis error:', error);
    return 0.5;
  }
}

/**
 * Calculate variance for statistical analysis
 */
function calculateVariance(values) {
  try {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
    
  } catch (error) {
    console.error('Variance calculation error:', error);
    return 0;
  }
}

module.exports = {
  analyzeEnhancedImageQuality,
  analyzeEnhancedLighting,
  analyzeEnhancedPose,
  analyzeImageComposition,
  calculateVariance
};
