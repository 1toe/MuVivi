/**
 * Effects Renderer
 * Applies visual effects to video/image frames on canvas
 */

export class EffectsRenderer {
  /**
   * Apply all effects to current frame
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Array} effects - Array of effect objects
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  static applyEffects(ctx, effects, width, height) {
    if (!effects || effects.length === 0) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (const effect of effects) {
      const intensity = effect.intensity ?? 0.5; // Default intensity 0.5

      switch (effect.type) {
        case 'brightness':
          this.applyBrightness(data, intensity);
          break;
        case 'contrast':
          this.applyContrast(data, intensity);
          break;
        case 'saturation':
          this.applySaturation(data, intensity);
          break;
        case 'blur':
          // Blur uses different approach
          this.applyBlur(ctx, width, height, intensity);
          return; // Exit early as blur modifies context directly
        case 'sepia':
          this.applySepia(data, intensity);
          break;
        case 'grayscale':
          this.applyGrayscale(data, intensity);
          break;
        case 'invert':
          this.applyInvert(data, intensity);
          break;
        case 'vignette':
          this.applyVignette(data, width, height, intensity);
          break;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Brightness effect
   * @param {Uint8ClampedArray} data - Image data
   * @param {number} intensity - 0 = dark, 0.5 = normal, 1 = bright
   */
  static applyBrightness(data, intensity) {
    const adjustment = (intensity - 0.5) * 255;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + adjustment)); // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjustment)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjustment)); // B
    }
  }

  /**
   * Contrast effect
   * @param {Uint8ClampedArray} data - Image data
   * @param {number} intensity - 0 = no contrast, 0.5 = normal, 1 = high contrast
   */
  static applyContrast(data, intensity) {
    const factor = (259 * (intensity * 255 + 255)) / (255 * (259 - intensity * 255));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128)); // R
      data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128)); // G
      data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128)); // B
    }
  }

  /**
   * Saturation effect
   * @param {Uint8ClampedArray} data - Image data
   * @param {number} intensity - 0 = grayscale, 0.5 = normal, 1 = super saturated
   */
  static applySaturation(data, intensity) {
    const saturation = intensity * 2; // 0-2 range

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate luminance (grayscale value)
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;

      // Interpolate between gray and color
      data[i] = Math.max(0, Math.min(255, gray + (r - gray) * saturation)); // R
      data[i + 1] = Math.max(0, Math.min(255, gray + (g - gray) * saturation)); // G
      data[i + 2] = Math.max(0, Math.min(255, gray + (b - gray) * saturation)); // B
    }
  }

  /**
   * Blur effect (simplified box blur)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {number} intensity - 0 = no blur, 1 = max blur
   */
  static applyBlur(ctx, width, height, intensity) {
    const blurAmount = Math.floor(intensity * 10) + 1;

    // Use CSS filter for performance (HTML5 canvas limitation workaround)
    ctx.filter = `blur(${blurAmount}px)`;
    const imageData = ctx.getImageData(0, 0, width, height);
    ctx.putImageData(imageData, 0, 0);
    ctx.filter = 'none';
  }

  /**
   * Sepia effect
   * @param {Uint8ClampedArray} data - Image data
   * @param {number} intensity - 0 = normal, 1 = full sepia
   */
  static applySepia(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;

      // Interpolate between original and sepia
      data[i] = Math.min(255, r + (tr - r) * intensity); // R
      data[i + 1] = Math.min(255, g + (tg - g) * intensity); // G
      data[i + 2] = Math.min(255, b + (tb - b) * intensity); // B
    }
  }

  /**
   * Grayscale effect
   * @param {Uint8ClampedArray} data - Image data
   * @param {number} intensity - 0 = color, 1 = full grayscale
   */
  static applyGrayscale(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate luminance
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;

      // Interpolate between color and gray
      data[i] = r + (gray - r) * intensity; // R
      data[i + 1] = g + (gray - g) * intensity; // G
      data[i + 2] = b + (gray - b) * intensity; // B
    }
  }

  /**
   * Invert colors effect
   * @param {Uint8ClampedArray} data - Image data
   * @param {number} intensity - 0 = normal, 1 = fully inverted
   */
  static applyInvert(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const ir = 255 - r;
      const ig = 255 - g;
      const ib = 255 - b;

      data[i] = r + (ir - r) * intensity; // R
      data[i + 1] = g + (ig - g) * intensity; // G
      data[i + 2] = b + (ib - b) * intensity; // B
    }
  }

  /**
   * Vignette effect (darkens edges)
   * @param {Uint8ClampedArray} data - Image data
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {number} intensity - 0 = no vignette, 1 = strong vignette
   */
  static applyVignette(data, width, height, intensity) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;

        // Calculate distance from center
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Calculate vignette factor (1 at center, 0 at edges)
        const vignetteFactor = 1 - Math.pow(dist / maxDist, 2) * intensity;

        // Apply vignette
        data[i] *= vignetteFactor; // R
        data[i + 1] *= vignetteFactor; // G
        data[i + 2] *= vignetteFactor; // B
      }
    }
  }

  /**
   * Get effect name from effect type
   * @param {string} effectType - Effect type ID
   * @returns {string} - Human-readable effect name
   */
  static getEffectName(effectType) {
    const names = {
      brightness: 'Brightness',
      contrast: 'Contrast',
      saturation: 'Saturation',
      blur: 'Blur',
      sepia: 'Sepia',
      grayscale: 'Grayscale',
      invert: 'Invert',
      vignette: 'Vignette',
    };
    return names[effectType] || effectType;
  }
}
