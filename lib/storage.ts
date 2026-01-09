import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

/**
 * Upload user photo to Supabase Storage
 * @param userId - User ID
 * @param imageBase64 - Base64 encoded image
 * @param angle - Camera angle (front, side, back)
 * @returns Storage file path or null if failed
 */
export async function uploadUserPhoto(
  userId: string,
  imageBase64: string,
  angle: 'front' | 'side' | 'back'
): Promise<string | null> {
  try {
    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}_${angle}.jpg`;
    const filePath = `${userId}/${filename}`;

    // Convert base64 to file URI for React Native
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Verify file was created
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      console.error('Failed to create file');
      return null;
    }

    // Create file object for Supabase upload
    // React Native requires a specific format
    const file = {
      uri: fileUri,
      type: 'image/jpeg',
      name: filename,
    };

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('user-photos')
      .upload(filePath, file as any, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    // Clean up temp file
    try {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError);
    }

    if (error) {
      console.error('Error uploading photo:', error);
      return null;
    }

    // Return the file path (we'll generate signed URLs when needed)
    return filePath;
  } catch (error) {
    console.error('Error in uploadUserPhoto:', error);
    return null;
  }
}

/**
 * Get signed URL for private photo
 * @param filePath - Path to file in storage
 * @param expiresIn - Expiration time in seconds (default 3600 = 1 hour)
 * @returns Signed URL or null
 */
export async function getSignedPhotoUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('user-photos')
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedPhotoUrl:', error);
    return null;
  }
}

/**
 * Delete user photo from storage
 * @param filePath - Path to file in storage
 * @returns Success boolean
 */
export async function deleteUserPhoto(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('user-photos')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting photo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUserPhoto:', error);
    return false;
  }
}
