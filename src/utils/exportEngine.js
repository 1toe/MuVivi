/**
 * Export Engine
 * Handles video export using MediaRecorder API or canvas-based rendering
 */

import { EffectsRenderer } from './effectsRenderer';
import { TextRenderer } from './textRenderer';

/**
 * Export project to WebM video file
 * @param {Object} options - Export options
 * @param {Array} options.clips - Array of clips to export
 * @param {Object} options.backgroundMusic - Background music object
 * @param {string} options.resolution - Resolution (e.g., '1280x720')
 * @param {string} options.quality - Quality preset ('high', 'medium', 'low')
 * @param {Function} options.onProgress - Progress callback (0-100)
 */
export async function exportProject({ clips, backgroundMusic, resolution, quality, onProgress }) {
  if (!clips || clips.length === 0) {
    throw new Error('No clips to export');
  }

  const [width, height] = resolution.split('x').map(Number);
  const fps = 30;
  const bitrate = getQualityBitrate(quality);

  // Create canvas for rendering
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Calculate total duration
  const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);

  try {
    // Create MediaStream from canvas
    const stream = canvas.captureStream(fps);

    // Add audio if available
    if (backgroundMusic && backgroundMusic.url) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioElement = new Audio(backgroundMusic.url);
      const source = audioContext.createMediaElementSource(audioElement);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      source.connect(audioContext.destination);

      // Add audio track to stream
      destination.stream.getAudioTracks().forEach((track) => {
        stream.addTrack(track);
      });

      audioElement.play();
    }

    // Setup MediaRecorder
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: bitrate,
    });

    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    // Start recording
    mediaRecorder.start(100); // Collect data every 100ms

    // Render frames
    await renderFrames(ctx, clips, totalDuration, width, height, fps, onProgress);

    // Stop recording
    mediaRecorder.stop();

    // Wait for final data
    await new Promise((resolve) => {
      mediaRecorder.onstop = resolve;
    });

    // Create blob and download
    const blob = new Blob(chunks, { type: 'video/webm' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `movie-maker-${timestamp}.webm`;
    
    downloadBlob(blob, filename);

    onProgress(100);
  } catch (error) {
    console.error('Export error:', error);
    throw new Error(`Export failed: ${error.message}`);
  }
}

/**
 * Render all frames to canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} clips - Clips to render
 * @param {number} totalDuration - Total duration in seconds
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} fps - Frames per second
 * @param {Function} onProgress - Progress callback
 */
async function renderFrames(ctx, clips, totalDuration, width, height, fps, onProgress) {
  const frameCount = Math.ceil(totalDuration * fps);
  const frameDuration = 1 / fps;

  let currentTime = 0;
  let currentClipIndex = 0;
  let clipStartTime = 0;

  for (let frame = 0; frame < frameCount; frame++) {
    // Find current clip
    while (
      currentClipIndex < clips.length &&
      currentTime >= clipStartTime + clips[currentClipIndex].duration
    ) {
      clipStartTime += clips[currentClipIndex].duration;
      currentClipIndex++;
    }

    if (currentClipIndex >= clips.length) break;

    const clip = clips[currentClipIndex];
    const clipLocalTime = currentTime - clipStartTime;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Render clip frame
    await renderClipFrame(ctx, clip, clipLocalTime, width, height);

    // Update progress
    const progress = ((frame + 1) / frameCount) * 100;
    onProgress(progress);

    // Next frame
    currentTime += frameDuration;

    // Small delay to allow browser to process
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}

/**
 * Render single clip frame
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} clip - Clip object
 * @param {number} time - Time within clip (seconds)
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
async function renderClipFrame(ctx, clip, time, width, height) {
  return new Promise((resolve) => {
    if (clip.type === 'video') {
      const video = document.createElement('video');
      video.src = clip.url;
      video.currentTime = time;

      video.onseeked = () => {
        // Draw video frame
        ctx.drawImage(video, 0, 0, width, height);

        // Apply effects
        if (clip.effects && clip.effects.length > 0) {
          EffectsRenderer.applyEffects(ctx, clip.effects, width, height);
        }

        // Render texts
        if (clip.texts && clip.texts.length > 0) {
          TextRenderer.renderTexts(ctx, clip.texts, time, width, height);
        }

        video.remove();
        resolve();
      };

      video.onerror = () => {
        console.error('Error loading video frame');
        video.remove();
        resolve();
      };
    } else if (clip.type === 'image') {
      const img = new Image();
      img.src = clip.url;

      img.onload = () => {
        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Apply effects
        if (clip.effects && clip.effects.length > 0) {
          EffectsRenderer.applyEffects(ctx, clip.effects, width, height);
        }

        // Render texts
        if (clip.texts && clip.texts.length > 0) {
          TextRenderer.renderTexts(ctx, clip.texts, time, width, height);
        }

        resolve();
      };

      img.onerror = () => {
        console.error('Error loading image');
        resolve();
      };
    } else {
      resolve();
    }
  });
}

/**
 * Get bitrate for quality preset
 * @param {string} quality - Quality preset
 * @returns {number} Bitrate in bits per second
 */
function getQualityBitrate(quality) {
  const bitrates = {
    high: 5000000, // 5 Mbps
    medium: 2500000, // 2.5 Mbps
    low: 1000000, // 1 Mbps
  };
  return bitrates[quality] || bitrates.medium;
}

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
