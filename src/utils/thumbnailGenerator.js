/**
 * Generate thumbnail for video or image
 * @param {File} file - Media file
 * @param {string} type - Media type (video or image)
 * @param {number} time - Time in seconds for video thumbnail (default 1s)
 * @returns {Promise<string>} Data URL of thumbnail
 */
export async function generateThumbnail(file, type, time = 1) {
  const url = URL.createObjectURL(file);

  if (type === 'video') {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.preload = 'metadata';
      video.currentTime = time;

      video.onseeked = () => {
        // Set canvas size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to data URL
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnail);

        // Cleanup
        URL.revokeObjectURL(url);
      };

      video.onerror = () => {
        reject(new Error('Failed to generate video thumbnail'));
        URL.revokeObjectURL(url);
      };

      video.src = url;
    });
  }

  if (type === 'image') {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // Calculate thumbnail size (max 200x200)
        const maxSize = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw scaled image
        ctx.drawImage(img, 0, 0, width, height);

        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnail);

        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        reject(new Error('Failed to generate image thumbnail'));
        URL.revokeObjectURL(url);
      };

      img.src = url;
    });
  }

  if (type === 'audio') {
    // Return default audio icon as data URL
    return Promise.resolve(createAudioThumbnail());
  }

  return Promise.reject(new Error('Unsupported media type'));
}

/**
 * Create a simple audio icon thumbnail
 * @returns {string} Data URL of audio icon
 */
function createAudioThumbnail() {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1E72BD';
  ctx.fillRect(0, 0, 200, 200);

  // Music note icon (simplified)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('♫', 100, 100);

  return canvas.toDataURL('image/png');
}
