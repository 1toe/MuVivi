/**
 * Text Renderer
 * Renders text overlays on canvas with animations
 */

export class TextRenderer {
  /**
   * Render all text overlays for current clip
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Array} texts - Array of text objects
   * @param {number} clipLocalTime - Current time relative to clip start (seconds)
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  static renderTexts(ctx, texts, clipLocalTime, width, height) {
    if (!texts || texts.length === 0) return;

    texts.forEach((text) => {
      // Check if text should be visible at current time
      if (
        clipLocalTime < text.startTime ||
        clipLocalTime > text.startTime + text.duration
      ) {
        return;
      }

      const timeInText = clipLocalTime - text.startTime;
      let opacity = 1;

      // Fade in
      if (timeInText < text.fadeIn) {
        opacity = timeInText / text.fadeIn;
      }

      // Fade out
      if (timeInText > text.duration - text.fadeOut) {
        opacity = (text.duration - timeInText) / text.fadeOut;
      }

      // Save context state
      ctx.save();

      // Set opacity
      ctx.globalAlpha = opacity;

      // Set font
      ctx.font = `${text.fontSize || 32}px ${text.fontFamily || 'Arial, sans-serif'}`;
      ctx.fillStyle = text.color || '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Add text shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Calculate position based on preset
      const { x, y } = this.calculatePosition(
        text.position,
        text.x || 0,
        text.y || 0,
        width,
        height
      );

      // Render text with outline for better visibility
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = 3;
      ctx.strokeText(text.content, x, y);
      ctx.fillText(text.content, x, y);

      // Restore context state
      ctx.restore();
    });
  }

  /**
   * Calculate text position based on preset and offsets
   * @param {string} position - Position preset (e.g., 'center', 'top', 'bottom')
   * @param {number} offsetX - X offset from preset position
   * @param {number} offsetY - Y offset from preset position
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @returns {Object} { x, y } coordinates
   */
  static calculatePosition(position, offsetX, offsetY, width, height) {
    let x = width / 2;
    let y = height / 2;

    switch (position) {
      case 'center':
        x = width / 2;
        y = height / 2;
        break;
      case 'top':
      case 'top-center':
        x = width / 2;
        y = height * 0.15;
        break;
      case 'bottom':
      case 'bottom-center':
        x = width / 2;
        y = height * 0.85;
        break;
      case 'top-left':
        x = width * 0.15;
        y = height * 0.15;
        break;
      case 'top-right':
        x = width * 0.85;
        y = height * 0.15;
        break;
      case 'bottom-left':
        x = width * 0.15;
        y = height * 0.85;
        break;
      case 'bottom-right':
        x = width * 0.85;
        y = height * 0.85;
        break;
      case 'left':
        x = width * 0.15;
        y = height / 2;
        break;
      case 'right':
        x = width * 0.85;
        y = height / 2;
        break;
      default:
        // Default to center
        x = width / 2;
        y = height / 2;
    }

    return {
      x: x + offsetX,
      y: y + offsetY,
    };
  }

  /**
   * Measure text dimensions
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text content
   * @param {string} font - Font specification
   * @returns {Object} { width, height }
   */
  static measureText(ctx, text, font) {
    ctx.save();
    ctx.font = font;
    const metrics = ctx.measureText(text);
    ctx.restore();

    return {
      width: metrics.width,
      height:
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    };
  }

  /**
   * Create text object with default values
   * @param {string} content - Text content
   * @param {Object} options - Text options
   * @returns {Object} Text object
   */
  static createTextObject(content, options = {}) {
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      content: content,
      fontSize: options.fontSize || 32,
      fontFamily: options.fontFamily || 'Arial, sans-serif',
      color: options.color || '#FFFFFF',
      position: options.position || 'center',
      x: options.x || 0,
      y: options.y || 0,
      startTime: options.startTime || 0,
      duration: options.duration || 5,
      fadeIn: options.fadeIn || 0.5,
      fadeOut: options.fadeOut || 0.5,
    };
  }

  /**
   * Get available text presets
   * @returns {Array} Array of text preset objects
   */
  static getTextPresets() {
    return [
      {
        id: 'title',
        name: 'Title',
        fontSize: 48,
        position: 'center',
        fadeIn: 0.5,
        fadeOut: 0.5,
      },
      {
        id: 'subtitle',
        name: 'Subtitle',
        fontSize: 32,
        position: 'center',
        fadeIn: 0.3,
        fadeOut: 0.3,
      },
      {
        id: 'caption',
        name: 'Caption',
        fontSize: 24,
        position: 'bottom-center',
        fadeIn: 0.2,
        fadeOut: 0.2,
      },
      {
        id: 'credit',
        name: 'Credit',
        fontSize: 18,
        position: 'bottom-right',
        fadeIn: 0.3,
        fadeOut: 0.3,
      },
      {
        id: 'lower-third',
        name: 'Lower Third',
        fontSize: 28,
        position: 'bottom-left',
        fadeIn: 0.4,
        fadeOut: 0.4,
      },
    ];
  }

  /**
   * Split text into multiple lines if too long
   * @param {string} text - Text content
   * @param {number} maxWidth - Maximum width per line
   * @returns {Array} Array of text lines
   */
  static splitTextIntoLines(text, maxWidth = 50) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Render multi-line text
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Array} lines - Array of text lines
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate (center of all lines)
   * @param {number} lineHeight - Line height multiplier
   */
  static renderMultiLineText(ctx, lines, x, y, lineHeight = 1.2) {
    const fontSize = parseInt(ctx.font);
    const totalHeight = lines.length * fontSize * lineHeight;
    let currentY = y - totalHeight / 2 + fontSize / 2;

    lines.forEach((line) => {
      ctx.strokeText(line, x, currentY);
      ctx.fillText(line, x, currentY);
      currentY += fontSize * lineHeight;
    });
  }
}
