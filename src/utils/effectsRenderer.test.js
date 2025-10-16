import { describe, it, expect } from 'vitest';
import { EffectsRenderer } from '../effectsRenderer';

describe('EffectsRenderer', () => {
  let canvas;
  let ctx;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    ctx = canvas.getContext('2d');
    
    // Fill with test pattern
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 100, 100);
  });

  describe('applyBrightness', () => {
    it('increases brightness when intensity > 0.5', () => {
      const imageData = ctx.getImageData(0, 0, 100, 100);
      const originalPixel = imageData.data[0];

      EffectsRenderer.applyBrightness(imageData.data, 0.8);

      expect(imageData.data[0]).toBeGreaterThan(originalPixel);
    });

    it('decreases brightness when intensity < 0.5', () => {
      const imageData = ctx.getImageData(0, 0, 100, 100);
      const originalPixel = imageData.data[0];

      EffectsRenderer.applyBrightness(imageData.data, 0.2);

      expect(imageData.data[0]).toBeLessThan(originalPixel);
    });

    it('clamps values to 0-255 range', () => {
      const imageData = ctx.getImageData(0, 0, 100, 100);

      EffectsRenderer.applyBrightness(imageData.data, 1.0);

      for (let i = 0; i < imageData.data.length; i += 4) {
        expect(imageData.data[i]).toBeLessThanOrEqual(255);
        expect(imageData.data[i]).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('applyGrayscale', () => {
    it('converts color to grayscale', () => {
      const imageData = ctx.getImageData(0, 0, 100, 100);

      EffectsRenderer.applyGrayscale(imageData.data, 1.0);

      // Check that R, G, B channels are equal (grayscale)
      expect(imageData.data[0]).toBe(imageData.data[1]);
      expect(imageData.data[1]).toBe(imageData.data[2]);
    });

    it('partial grayscale with intensity 0.5', () => {
      const imageData = ctx.getImageData(0, 0, 100, 100);
      const originalR = imageData.data[0];

      EffectsRenderer.applyGrayscale(imageData.data, 0.5);

      // Should be between original and full grayscale
      expect(imageData.data[0]).toBeLessThan(originalR);
      expect(imageData.data[0]).toBeGreaterThan(0);
    });
  });

  describe('getEffectName', () => {
    it('returns correct effect names', () => {
      expect(EffectsRenderer.getEffectName('brightness')).toBe('Brightness');
      expect(EffectsRenderer.getEffectName('contrast')).toBe('Contrast');
      expect(EffectsRenderer.getEffectName('blur')).toBe('Blur');
    });

    it('returns effect type if name not found', () => {
      expect(EffectsRenderer.getEffectName('unknown')).toBe('unknown');
    });
  });
});
