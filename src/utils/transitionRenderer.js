/**
 * Transition Renderer
 * Handles rendering of transitions between clips on canvas
 */

export class TransitionRenderer {
  /**
   * Apply transition effect between two frames
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {HTMLImageElement | HTMLVideoElement} prevFrame - Previous clip frame
   * @param {HTMLImageElement | HTMLVideoElement} nextFrame - Next clip frame
   * @param {Object} transition - Transition configuration
   * @param {number} progress - Transition progress (0-1)
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  static applyTransition(ctx, prevFrame, nextFrame, transition, progress, width, height) {
    if (!transition || progress <= 0 || progress >= 1) {
      return;
    }

    ctx.clearRect(0, 0, width, height);

    switch (transition.id) {
      case 'fade':
        this.fade(ctx, prevFrame, nextFrame, progress, width, height);
        break;
      case 'dissolve':
        this.dissolve(ctx, prevFrame, nextFrame, progress, width, height);
        break;
      case 'wipe-left':
        this.wipe(ctx, prevFrame, nextFrame, progress, width, height, 'left');
        break;
      case 'wipe-right':
        this.wipe(ctx, prevFrame, nextFrame, progress, width, height, 'right');
        break;
      case 'wipe-up':
        this.wipe(ctx, prevFrame, nextFrame, progress, width, height, 'up');
        break;
      case 'wipe-down':
        this.wipe(ctx, prevFrame, nextFrame, progress, width, height, 'down');
        break;
      case 'slide-left':
        this.slide(ctx, prevFrame, nextFrame, progress, width, height, 'left');
        break;
      case 'slide-right':
        this.slide(ctx, prevFrame, nextFrame, progress, width, height, 'right');
        break;
      default:
        // Default to fade
        this.fade(ctx, prevFrame, nextFrame, progress, width, height);
    }
  }

  /**
   * Fade transition
   */
  static fade(ctx, prevFrame, nextFrame, progress, width, height) {
    // Draw previous frame with decreasing opacity
    ctx.globalAlpha = 1 - progress;
    ctx.drawImage(prevFrame, 0, 0, width, height);

    // Draw next frame with increasing opacity
    ctx.globalAlpha = progress;
    ctx.drawImage(nextFrame, 0, 0, width, height);

    // Reset alpha
    ctx.globalAlpha = 1;
  }

  /**
   * Dissolve transition (similar to fade but with slight variations)
   */
  static dissolve(ctx, prevFrame, nextFrame, progress, width, height) {
    // Dissolve is similar to fade
    this.fade(ctx, prevFrame, nextFrame, progress, width, height);
  }

  /**
   * Wipe transition
   */
  static wipe(ctx, prevFrame, nextFrame, progress, width, height, direction) {
    ctx.save();

    // Draw previous frame
    ctx.drawImage(prevFrame, 0, 0, width, height);

    // Create clipping path for next frame
    ctx.beginPath();

    switch (direction) {
      case 'left':
        // Wipe from right to left
        ctx.rect(width * (1 - progress), 0, width * progress, height);
        break;
      case 'right':
        // Wipe from left to right
        ctx.rect(0, 0, width * progress, height);
        break;
      case 'up':
        // Wipe from bottom to top
        ctx.rect(0, height * (1 - progress), width, height * progress);
        break;
      case 'down':
        // Wipe from top to bottom
        ctx.rect(0, 0, width, height * progress);
        break;
    }

    ctx.clip();
    ctx.drawImage(nextFrame, 0, 0, width, height);

    ctx.restore();
  }

  /**
   * Slide transition
   */
  static slide(ctx, prevFrame, nextFrame, progress, width, height, direction) {
    ctx.save();

    switch (direction) {
      case 'left':
        // Next frame slides in from right
        ctx.drawImage(prevFrame, -width * progress, 0, width, height);
        ctx.drawImage(nextFrame, width * (1 - progress), 0, width, height);
        break;
      case 'right':
        // Next frame slides in from left
        ctx.drawImage(prevFrame, width * progress, 0, width, height);
        ctx.drawImage(nextFrame, -width * (1 - progress), 0, width, height);
        break;
    }

    ctx.restore();
  }

  /**
   * Calculate transition progress at given time
   * @param {number} currentTime - Current playback time (seconds)
   * @param {number} transitionStart - Transition start time (seconds)
   * @param {number} transitionDuration - Transition duration (seconds)
   * @returns {number} Progress (0-1)
   */
  static calculateProgress(currentTime, transitionStart, transitionDuration) {
    if (currentTime < transitionStart) {
      return 0;
    }
    if (currentTime >= transitionStart + transitionDuration) {
      return 1;
    }
    return (currentTime - transitionStart) / transitionDuration;
  }

  /**
   * Check if we're currently in a transition
   * @param {number} currentTime - Current playback time
   * @param {number} transitionStart - Transition start time
   * @param {number} transitionDuration - Transition duration
   * @returns {boolean}
   */
  static isInTransition(currentTime, transitionStart, transitionDuration) {
    return currentTime >= transitionStart && currentTime < transitionStart + transitionDuration;
  }
}
