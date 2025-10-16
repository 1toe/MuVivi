// Supported file formats
const SUPPORTED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'webm'];
const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif'];
const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'ogg', 'm4a'];

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

/**
 * Validate uploaded file
 * @param {File} file - File object to validate
 * @returns {Object} { valid: boolean, error: string | null, type: string | null }
 */
export function validateFile(file) {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided', type: null };
  }

  // Get file extension
  const extension = file.name.split('.').pop().toLowerCase();

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 500MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
      type: null,
    };
  }

  // Check if video
  if (SUPPORTED_VIDEO_FORMATS.includes(extension)) {
    return { valid: true, error: null, type: 'video' };
  }

  // Check if image
  if (SUPPORTED_IMAGE_FORMATS.includes(extension)) {
    return { valid: true, error: null, type: 'image' };
  }

  // Check if audio
  if (SUPPORTED_AUDIO_FORMATS.includes(extension)) {
    return { valid: true, error: null, type: 'audio' };
  }

  // Unsupported format
  return {
    valid: false,
    error: `Unsupported file format: .${extension}. Supported: ${[
      ...SUPPORTED_VIDEO_FORMATS,
      ...SUPPORTED_IMAGE_FORMATS,
      ...SUPPORTED_AUDIO_FORMATS,
    ].join(', ')}`,
    type: null,
  };
}

/**
 * Get media metadata (duration, dimensions, etc.)
 * @param {File} file - Media file
 * @param {string} type - Media type (video, image, audio)
 * @returns {Promise<Object>} Metadata object
 */
export async function getMediaMetadata(file, type) {
  const url = URL.createObjectURL(file);

  if (type === 'video') {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
        });
        URL.revokeObjectURL(url);
      };

      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
        URL.revokeObjectURL(url);
      };

      video.src = url;
    });
  }

  if (type === 'image') {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          duration: 5, // Default 5s for images
          width: img.width,
          height: img.height,
        });
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image metadata'));
        URL.revokeObjectURL(url);
      };

      img.src = url;
    });
  }

  if (type === 'audio') {
    return new Promise((resolve, reject) => {
      const audio = new Audio();

      audio.onloadedmetadata = () => {
        resolve({
          duration: audio.duration,
          width: null,
          height: null,
        });
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        reject(new Error('Failed to load audio metadata'));
        URL.revokeObjectURL(url);
      };

      audio.src = url;
    });
  }

  return { duration: 0, width: null, height: null };
}
