import { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial State
const initialState = {
  projectName: 'Untitled Project',
  clips: [],
  selectedClipId: null,
  backgroundMusic: null,
  duration: 0,
  currentTime: 0,
};

// Action Types
export const ActionTypes = {
  SET_PROJECT_NAME: 'SET_PROJECT_NAME',
  ADD_CLIP: 'ADD_CLIP',
  DELETE_CLIP: 'DELETE_CLIP',
  REORDER_CLIPS: 'REORDER_CLIPS',
  SET_SELECTED_CLIP: 'SET_SELECTED_CLIP',
  UPDATE_CLIP: 'UPDATE_CLIP',
  ADD_TRANSITION_TO_CLIP: 'ADD_TRANSITION_TO_CLIP',
  UPDATE_TRANSITION_DURATION: 'UPDATE_TRANSITION_DURATION',
  REMOVE_TRANSITION: 'REMOVE_TRANSITION',
  ADD_EFFECT_TO_CLIP: 'ADD_EFFECT_TO_CLIP',
  UPDATE_EFFECT: 'UPDATE_EFFECT',
  REMOVE_EFFECT: 'REMOVE_EFFECT',
  ADD_TEXT_TO_CLIP: 'ADD_TEXT_TO_CLIP',
  UPDATE_TEXT: 'UPDATE_TEXT',
  REMOVE_TEXT: 'REMOVE_TEXT',
  SET_BACKGROUND_MUSIC: 'SET_BACKGROUND_MUSIC',
  UPDATE_BACKGROUND_MUSIC_VOLUME: 'UPDATE_BACKGROUND_MUSIC_VOLUME',
  LOAD_PROJECT: 'LOAD_PROJECT',
  RESET_PROJECT: 'RESET_PROJECT',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
};

// Reducer
function projectReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_PROJECT_NAME:
      return {
        ...state,
        projectName: action.payload,
      };

    case ActionTypes.ADD_CLIP:
      const newClip = {
        id: uuidv4(),
        ...action.payload,
        effects: [],
        texts: [],
        transition: null,
      };
      return {
        ...state,
        clips: [...state.clips, newClip],
        duration: state.clips.reduce((acc, clip) => acc + clip.duration, newClip.duration),
      };

    case ActionTypes.DELETE_CLIP:
      return {
        ...state,
        clips: state.clips.filter((clip) => clip.id !== action.payload),
        selectedClipId: state.selectedClipId === action.payload ? null : state.selectedClipId,
        duration: state.clips
          .filter((clip) => clip.id !== action.payload)
          .reduce((acc, clip) => acc + clip.duration, 0),
      };

    case ActionTypes.REORDER_CLIPS:
      return {
        ...state,
        clips: action.payload,
      };

    case ActionTypes.SET_SELECTED_CLIP:
      return {
        ...state,
        selectedClipId: action.payload,
      };

    case ActionTypes.UPDATE_CLIP:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload.clipId ? { ...clip, ...action.payload.updates } : clip
        ),
      };

    case ActionTypes.ADD_TRANSITION_TO_CLIP:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload.clipId
            ? {
                ...clip,
                transition: {
                  id: action.payload.transitionId,
                  duration: action.payload.duration,
                },
              }
            : clip
        ),
      };

    case ActionTypes.UPDATE_TRANSITION_DURATION:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload.clipId && clip.transition
            ? {
                ...clip,
                transition: {
                  ...clip.transition,
                  duration: action.payload.duration,
                },
              }
            : clip
        ),
      };

    case ActionTypes.REMOVE_TRANSITION:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload ? { ...clip, transition: null } : clip
        ),
      };

    case ActionTypes.ADD_EFFECT_TO_CLIP:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload.clipId
            ? {
                ...clip,
                effects: [
                  ...clip.effects,
                  {
                    id: uuidv4(),
                    type: action.payload.effectId,
                    intensity: 0.5,
                  },
                ],
              }
            : clip
        ),
      };

    case ActionTypes.UPDATE_EFFECT:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload.clipId
            ? {
                ...clip,
                effects: clip.effects.map((eff) =>
                  eff.id === action.payload.effectId
                    ? { ...eff, intensity: action.payload.intensity }
                    : eff
                ),
              }
            : clip
        ),
      };

    case ActionTypes.REMOVE_EFFECT:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload.clipId
            ? {
                ...clip,
                effects: clip.effects.filter((eff) => eff.id !== action.payload.effectId),
              }
            : clip
        ),
      };

    case ActionTypes.ADD_TEXT_TO_CLIP:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload.clipId
            ? {
                ...clip,
                texts: [
                  ...(clip.texts || []),
                  {
                    id: uuidv4(),
                    content: action.payload.text,
                    fontSize: action.payload.template.fontSize,
                    fontFamily: 'Segoe UI, Arial, sans-serif',
                    color: '#FFFFFF',
                    position: action.payload.template.position,
                    x: 0,
                    y: 0,
                    startTime: 0,
                    duration: clip.duration,
                    fadeIn: 0.5,
                    fadeOut: 0.5,
                  },
                ],
              }
            : clip
        ),
      };

    case ActionTypes.UPDATE_TEXT:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload.clipId
            ? {
                ...clip,
                texts: clip.texts.map((text) =>
                  text.id === action.payload.textId ? { ...text, ...action.payload.updates } : text
                ),
              }
            : clip
        ),
      };

    case ActionTypes.REMOVE_TEXT:
      return {
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === action.payload.clipId
            ? {
                ...clip,
                texts: clip.texts.filter((text) => text.id !== action.payload.textId),
              }
            : clip
        ),
      };

    case ActionTypes.SET_BACKGROUND_MUSIC:
      return {
        ...state,
        backgroundMusic: action.payload
          ? {
              id: action.payload.id,
              name: action.payload.name,
              url: action.payload.url,
              volume: 0.5,
              fadeIn: 2,
              fadeOut: 2,
            }
          : null,
      };

    case ActionTypes.UPDATE_BACKGROUND_MUSIC_VOLUME:
      return {
        ...state,
        backgroundMusic: state.backgroundMusic
          ? {
              ...state.backgroundMusic,
              volume: action.payload,
            }
          : null,
      };

    case ActionTypes.LOAD_PROJECT:
      return {
        ...initialState,
        ...action.payload,
      };

    case ActionTypes.RESET_PROJECT:
      return initialState;

    case ActionTypes.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload,
      };

    default:
      return state;
  }
}

// Context
const ProjectContext = createContext(null);

// Provider
export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return <ProjectContext.Provider value={{ state, dispatch }}>{children}</ProjectContext.Provider>;
}

// Custom Hook
export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}
