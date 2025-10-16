import { describe, it, expect } from 'vitest';
import { validateFile, getMediaMetadata } from '../fileValidation';

describe('fileValidation', () => {
  describe('validateFile', () => {
    it('validates supported video formats', () => {
      const mp4File = new File([''], 'video.mp4', { type: 'video/mp4' });
      const result = validateFile(mp4File);
      
      expect(result.valid).toBe(true);
      expect(result.type).toBe('video');
      expect(result.error).toBeNull();
    });

    it('validates supported image formats', () => {
      const jpgFile = new File([''], 'image.jpg', { type: 'image/jpeg' });
      const result = validateFile(jpgFile);
      
      expect(result.valid).toBe(true);
      expect(result.type).toBe('image');
      expect(result.error).toBeNull();
    });

    it('rejects unsupported formats', () => {
      const txtFile = new File([''], 'document.txt', { type: 'text/plain' });
      const result = validateFile(txtFile);
      
      expect(result.valid).toBe(false);
      expect(result.type).toBeNull();
      expect(result.error).toContain('Unsupported file format');
    });

    it('rejects files larger than 500MB', () => {
      const size = 600 * 1024 * 1024; // 600MB
      const largeFile = new File(['x'.repeat(size)], 'large.mp4', {
        type: 'video/mp4',
      });
      
      const result = validateFile(largeFile);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File size exceeds 500MB');
    });

    it('handles null file', () => {
      const result = validateFile(null);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('No file provided');
    });
  });
});
