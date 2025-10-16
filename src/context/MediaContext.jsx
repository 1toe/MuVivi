import { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial State
const initialState = {
  media: [], // Array of { id, type, name, url, thumbnail, duration, width, height, size }
  selectedMediaId: null,
};

// Action Types
export const MediaActionTypes = {
  ADD_MEDIA: 'ADD_MEDIA',
  DELETE_MEDIA: 'DELETE_MEDIA',
  SET_SELECTED_MEDIA: 'SET_SELECTED_MEDIA',
  UPDATE_MEDIA: 'UPDATE_MEDIA',
  CLEAR_ALL_MEDIA: 'CLEAR_ALL_MEDIA',
};

// Reducer
function mediaReducer(state, action) {
  switch (action.type) {
    case MediaActionTypes.ADD_MEDIA:
      const newMediaItem = {
        id: uuidv4(),
        ...action.payload,
      };
      return {
        ...state,
        media: [...state.media, newMediaItem],
      };

    case MediaActionTypes.DELETE_MEDIA:
      return {
        ...state,
        media: state.media.filter((item) => item.id !== action.payload),
        selectedMediaId: state.selectedMediaId === action.payload ? null : state.selectedMediaId,
      };

    case MediaActionTypes.SET_SELECTED_MEDIA:
      return {
        ...state,
        selectedMediaId: action.payload,
      };

    case MediaActionTypes.UPDATE_MEDIA:
      return {
        ...state,
        media: state.media.map((item) =>
          item.id === action.payload.mediaId ? { ...item, ...action.payload.updates } : item
        ),
      };

    case MediaActionTypes.CLEAR_ALL_MEDIA:
      return initialState;

    default:
      return state;
  }
}

// Context
const MediaContext = createContext(null);

// Provider
export function MediaProvider({ children }) {
  const [state, dispatch] = useReducer(mediaReducer, initialState);

  return <MediaContext.Provider value={{ state, dispatch }}>{children}</MediaContext.Provider>;
}

// Custom Hook
export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within MediaProvider');
  }
  return context;
}
