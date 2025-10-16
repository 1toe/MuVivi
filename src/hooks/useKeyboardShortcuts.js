import { useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { ActionTypes } from '../context/ProjectContext';
import { usePlayer } from './usePlayer';

/**
 * Custom hook for global keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const { state, dispatch } = useProject();
  const { isPlaying, togglePlayPause, seek, currentTime, toggleMute } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Space - Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      // Delete - Delete selected clip
      if (e.code === 'Delete' && state.selectedClipId) {
        e.preventDefault();
        dispatch({
          type: ActionTypes.DELETE_CLIP,
          payload: state.selectedClipId,
        });
        return;
      }

      // Ctrl+Z - Undo (placeholder - would need undo/redo implementation)
      if (e.ctrlKey && e.code === 'KeyZ' && !e.shiftKey) {
        e.preventDefault();
        console.log('⏪ Undo (not yet implemented)');
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z - Redo
      if ((e.ctrlKey && e.code === 'KeyY') || (e.ctrlKey && e.shiftKey && e.code === 'KeyZ')) {
        e.preventDefault();
        console.log('⏩ Redo (not yet implemented)');
        return;
      }

      // Ctrl+S - Save (already auto-saving, just show notification)
      if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault();
        console.log('💾 Project auto-saved');
        return;
      }

      // Ctrl+E - Export
      if (e.ctrlKey && e.code === 'KeyE') {
        e.preventDefault();
        console.log('🎬 Export (open export modal)');
        return;
      }

      // Arrow Left - Seek backward 1s
      if (e.code === 'ArrowLeft' && !e.ctrlKey) {
        e.preventDefault();
        seek(currentTime - 1);
        return;
      }

      // Arrow Right - Seek forward 1s
      if (e.code === 'ArrowRight' && !e.ctrlKey) {
        e.preventDefault();
        seek(currentTime + 1);
        return;
      }

      // Ctrl+Arrow Left - Previous clip
      if (e.ctrlKey && e.code === 'ArrowLeft') {
        e.preventDefault();
        const currentIndex = state.clips.findIndex(c => c.id === state.selectedClipId);
        if (currentIndex > 0) {
          dispatch({
            type: ActionTypes.SET_SELECTED_CLIP,
            payload: state.clips[currentIndex - 1].id,
          });
        }
        return;
      }

      // Ctrl+Arrow Right - Next clip
      if (e.ctrlKey && e.code === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = state.clips.findIndex(c => c.id === state.selectedClipId);
        if (currentIndex >= 0 && currentIndex < state.clips.length - 1) {
          dispatch({
            type: ActionTypes.SET_SELECTED_CLIP,
            payload: state.clips[currentIndex + 1].id,
          });
        }
        return;
      }

      // M - Toggle mute
      if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
        return;
      }

      // Ctrl+A - Select all clips (placeholder)
      if (e.ctrlKey && e.code === 'KeyA') {
        e.preventDefault();
        console.log('🎯 Select all clips (not yet implemented)');
        return;
      }

      // Home - Seek to start
      if (e.code === 'Home') {
        e.preventDefault();
        seek(0);
        return;
      }

      // End - Seek to end
      if (e.code === 'End') {
        e.preventDefault();
        const totalDuration = state.clips.reduce((acc, clip) => acc + clip.duration, 0);
        seek(totalDuration);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state, isPlaying, currentTime, dispatch, togglePlayPause, seek, toggleMute]);
}
