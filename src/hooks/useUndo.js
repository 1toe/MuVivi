import { useReducer, useCallback } from 'react';

/**
 * useUndo - Custom hook for undo/redo functionality
 * @param {*} initialState - Initial state
 * @param {Function} reducer - Reducer function
 * @returns {Object} { state, dispatch, undo, redo, canUndo, canRedo }
 */
export function useUndo(initialState, reducer) {
  const [undoState, dispatchUndo] = useReducer(undoReducer, {
    past: [],
    present: initialState,
    future: [],
  });

  const { past, present, future } = undoState;

  // Reducer wrapper for undo functionality
  function undoReducer(state, action) {
    const { past, present, future } = state;

    switch (action.type) {
      case 'UNDO':
        if (past.length === 0) return state;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };

      case 'REDO':
        if (future.length === 0) return state;
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };

      case 'SET':
        if (action.payload === present) return state;
        return {
          past: [...past, present],
          present: action.payload,
          future: [],
        };

      case 'RESET':
        return {
          past: [],
          present: action.payload || initialState,
          future: [],
        };

      default:
        // Apply the actual reducer to the present state
        const newPresent = reducer(present, action);
        if (newPresent === present) return state;
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
    }
  }

  const undo = useCallback(() => {
    dispatchUndo({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatchUndo({ type: 'REDO' });
  }, []);

  const reset = useCallback(
    (newState) => {
      dispatchUndo({ type: 'RESET', payload: newState });
    },
    []
  );

  return {
    state: present,
    dispatch: dispatchUndo,
    undo,
    redo,
    reset,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
