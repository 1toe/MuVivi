import { useState, useEffect, useRef, useCallback } from 'react';
import { useProject } from './useProject';

/**
 * Custom hook for video player functionality
 */
export function usePlayer() {
  const { state } = useProject();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const totalDuration = state.clips.reduce((acc, clip) => acc + (clip.duration || 0), 0);

  // Get current clip and relative time
  const getCurrentClipInfo = useCallback(() => {
    let accumulatedTime = 0;
    
    for (const clip of state.clips) {
      if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clip.duration) {
        return {
          clip,
          relativeTime: currentTime - accumulatedTime,
          clipStartTime: accumulatedTime,
        };
      }
      accumulatedTime += clip.duration;
    }
    
    return null;
  }, [currentTime, state.clips]);

  // Play
  const play = useCallback(() => {
    if (state.clips.length === 0) return;
    
    setIsPlaying(true);
    startTimeRef.current = performance.now() - currentTime * 1000;
  }, [currentTime, state.clips.length]);

  // Pause
  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Stop (pause and reset)
  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Seek to time
  const seek = useCallback(
    (time) => {
      const clampedTime = Math.max(0, Math.min(time, totalDuration));
      setCurrentTime(clampedTime);
      
      if (isPlaying) {
        startTimeRef.current = performance.now() - clampedTime * 1000;
      }
    },
    [totalDuration, isPlaying]
  );

  // Seek relative
  const seekRelative = useCallback(
    (delta) => {
      seek(currentTime + delta);
    },
    [currentTime, seek]
  );

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Set volume
  const changeVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (clampedVolume > 0) {
      setIsMuted(false);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const updateTime = () => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      
      if (elapsed >= totalDuration) {
        setIsPlaying(false);
        setCurrentTime(totalDuration);
        return;
      }
      
      setCurrentTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  // Format time
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    isPlaying,
    currentTime,
    totalDuration,
    volume: isMuted ? 0 : volume,
    isMuted,
    progress: totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0,
    
    // Actions
    play,
    pause,
    stop,
    seek,
    seekRelative,
    togglePlayPause,
    changeVolume,
    toggleMute,
    
    // Helpers
    getCurrentClipInfo,
    formatTime,
  };
}
