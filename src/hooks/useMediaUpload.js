import { useState } from 'react';
import { useMedia } from '../context/MediaContext';
import { MediaActionTypes } from '../context/MediaContext';
import { validateFile, getMediaMetadata } from '../utils/fileValidation';
import { generateThumbnail } from '../utils/thumbnailGenerator';

/**
 * Custom hook for media upload functionality
 */
export function useMediaUpload() {
  const { dispatch } = useMedia();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload single file
   * @param {File} file - File to upload
   */
  const uploadFile = async (file) => {
    setError(null);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return { success: false, error: validation.error };
    }

    try {
      setIsUploading(true);
      setUploadProgress(20);

      // Get metadata
      const metadata = await getMediaMetadata(file, validation.type);
      setUploadProgress(50);

      // Generate thumbnail
      const thumbnail = await generateThumbnail(file, validation.type);
      setUploadProgress(80);

      // Create object URL for the file
      const url = URL.createObjectURL(file);

      // Add to media context
      dispatch({
        type: MediaActionTypes.ADD_MEDIA,
        payload: {
          type: validation.type,
          name: file.name,
          url: url,
          thumbnail: thumbnail,
          duration: metadata.duration,
          width: metadata.width,
          height: metadata.height,
          size: file.size,
          file: file, // Keep reference to original file
        },
      });

      setUploadProgress(100);
      setIsUploading(false);

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload file';
      setError(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Upload multiple files
   * @param {FileList} files - Files to upload
   */
  const uploadFiles = async (files) => {
    const results = [];

    for (const file of files) {
      const result = await uploadFile(file);
      results.push({ file: file.name, ...result });
    }

    return results;
  };

  /**
   * Handle drag & drop files
   * @param {DragEvent} event - Drop event
   */
  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    return await uploadFiles(files);
  };

  /**
   * Handle file input change
   * @param {Event} event - Input change event
   */
  const handleFileInput = async (event) => {
    const files = Array.from(event.target.files);
    return await uploadFiles(files);
  };

  return {
    uploadFile,
    uploadFiles,
    handleDrop,
    handleFileInput,
    isUploading,
    uploadProgress,
    error,
  };
}
