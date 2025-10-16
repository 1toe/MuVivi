import { useEffect, useRef } from 'react';
import { useProject } from './useProject';

const STORAGE_KEY = 'movie-maker-2025-project';

/**
 * Custom hook for auto-saving project to localStorage
 * @param {number} interval - Auto-save interval in milliseconds (default 30s)
 */
export function useAutoSave(interval = 30000) {
  const { state } = useProject();
  const lastSaveRef = useRef(null);

  useEffect(() => {
    // Don't save if project is empty
    if (state.clips.length === 0 && !state.backgroundMusic) {
      return;
    }

    const saveTimer = setInterval(() => {
      try {
        const projectData = {
          projectName: state.projectName,
          clips: state.clips,
          backgroundMusic: state.backgroundMusic,
          savedAt: new Date().toISOString(),
          version: '1.0',
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(projectData));
        lastSaveRef.current = new Date();
        
        console.log('✅ Project auto-saved:', lastSaveRef.current);
      } catch (error) {
        console.error('❌ Failed to auto-save project:', error);
      }
    }, interval);

    return () => clearInterval(saveTimer);
  }, [state, interval]);

  return {
    lastSave: lastSaveRef.current,
  };
}

/**
 * Load project from localStorage
 */
export function loadProjectFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const projectData = JSON.parse(saved);
    console.log('📂 Project loaded from storage:', projectData.savedAt);
    
    return projectData;
  } catch (error) {
    console.error('❌ Failed to load project from storage:', error);
    return null;
  }
}

/**
 * Clear saved project from localStorage
 */
export function clearProjectStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Project storage cleared');
  } catch (error) {
    console.error('❌ Failed to clear project storage:', error);
  }
}
