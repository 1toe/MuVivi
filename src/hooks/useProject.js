import { useProject as useProjectContext } from '../context/ProjectContext';

/**
 * useProject - Enhanced wrapper for ProjectContext with helper functions
 */
export function useProject() {
  const { state, dispatch } = useProjectContext();

  // Helper: Get selected clip
  const getSelectedClip = () => {
    if (!state.selectedClipId) return null;
    return state.clips.find((clip) => clip.id === state.selectedClipId);
  };

  // Helper: Get clip by ID
  const getClipById = (clipId) => {
    return state.clips.find((clip) => clip.id === clipId);
  };

  // Helper: Get total duration
  const getTotalDuration = () => {
    return state.clips.reduce((acc, clip) => acc + (clip.duration || 0), 0);
  };

  // Helper: Get clip at time
  const getClipAtTime = (time) => {
    let currentTime = 0;
    for (const clip of state.clips) {
      if (time >= currentTime && time < currentTime + clip.duration) {
        return {
          clip,
          relativeTime: time - currentTime,
        };
      }
      currentTime += clip.duration;
    }
    return null;
  };

  // Helper: Export project to JSON
  const exportProject = () => {
    return JSON.stringify(
      {
        projectName: state.projectName,
        clips: state.clips,
        backgroundMusic: state.backgroundMusic,
        version: '1.0',
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  };

  // Helper: Get project metadata
  const getProjectMetadata = () => {
    return {
      name: state.projectName,
      duration: getTotalDuration(),
      clipCount: state.clips.length,
      hasBackgroundMusic: !!state.backgroundMusic,
    };
  };

  return {
    state,
    dispatch,
    // Helpers
    getSelectedClip,
    getClipById,
    getTotalDuration,
    getClipAtTime,
    exportProject,
    getProjectMetadata,
  };
}
