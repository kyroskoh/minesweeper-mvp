import { gameReducer, initialGameState } from '@/contexts/GameContext.reducer';
import { DIFFICULTIES } from '@/lib/minesweeper';

describe('gameReducer', () => {
  describe('INITIALIZE_GAME', () => {
    test('should initialize game with correct state', () => {
      const action = {
        type: 'INITIALIZE_GAME' as const,
        payload: { difficulty: DIFFICULTIES.BEGINNER },
      };

      const newState = gameReducer(initialGameState, action);

      expect(newState.game).toBeDefined();
      expect(newState.gameState).toBeDefined();
      expect(newState.currentTime).toBe(0);
      expect(newState.error).toBeNull();
      expect(newState.isLoading).toBe(false);
    });

    test('should handle initialization error', () => {
      const action = {
        type: 'INITIALIZE_GAME' as const,
        payload: { difficulty: null as any },
      };

      const newState = gameReducer(initialGameState, action);

      expect(newState.game).toBeNull();
      expect(newState.error).toBeDefined();
    });
  });

  describe('REVEAL_CELL', () => {
    test('should reveal cell and update game state', () => {
      // First initialize game
      const initAction = {
        type: 'INITIALIZE_GAME' as const,
        payload: { difficulty: DIFFICULTIES.BEGINNER, seed: 12345 },
      };
      const initializedState = gameReducer(initialGameState, initAction);

      // Then reveal a cell
      const revealAction = {
        type: 'REVEAL_CELL' as const,
        payload: { x: 0, y: 0 },
      };
      const newState = gameReducer(initializedState, revealAction);

      expect(newState.gameState).toBeDefined();
      expect(newState.error).toBeNull();
    });

    test('should handle reveal error when game not initialized', () => {
      const action = {
        type: 'REVEAL_CELL' as const,
        payload: { x: 0, y: 0 },
      };

      const newState = gameReducer(initialGameState, action);

      expect(newState.error).toBe('Game not initialized');
    });
  });

  describe('TOGGLE_FLAG', () => {
    test('should toggle flag and update game state', () => {
      // First initialize game
      const initAction = {
        type: 'INITIALIZE_GAME' as const,
        payload: { difficulty: DIFFICULTIES.BEGINNER },
      };
      const initializedState = gameReducer(initialGameState, initAction);

      // Then toggle flag
      const flagAction = {
        type: 'TOGGLE_FLAG' as const,
        payload: { x: 0, y: 0 },
      };
      const newState = gameReducer(initializedState, flagAction);

      expect(newState.gameState).toBeDefined();
      expect(newState.error).toBeNull();
    });

    test('should handle flag error when game not initialized', () => {
      const action = {
        type: 'TOGGLE_FLAG' as const,
        payload: { x: 0, y: 0 },
      };

      const newState = gameReducer(initialGameState, action);

      expect(newState.error).toBe('Game not initialized');
    });
  });

  describe('RESET_GAME', () => {
    test('should reset existing game', () => {
      // First initialize game
      const initAction = {
        type: 'INITIALIZE_GAME' as const,
        payload: { difficulty: DIFFICULTIES.BEGINNER },
      };
      const initializedState = gameReducer(initialGameState, initAction);

      // Make some moves
      const revealAction = {
        type: 'REVEAL_CELL' as const,
        payload: { x: 0, y: 0 },
      };
      const stateWithMoves = gameReducer(initializedState, revealAction);

      // Reset game
      const resetAction = {
        type: 'RESET_GAME' as const,
      };
      const resetState = gameReducer(stateWithMoves, resetAction);

      expect(resetState.gameState).toBeDefined();
      expect(resetState.currentTime).toBe(0);
      expect(resetState.error).toBeNull();
    });

    test('should initialize new game when no game exists', () => {
      const action = {
        type: 'RESET_GAME' as const,
        payload: { difficulty: DIFFICULTIES.INTERMEDIATE },
      };

      const newState = gameReducer(initialGameState, action);

      expect(newState.game).toBeDefined();
      expect(newState.gameState).toBeDefined();
      expect(newState.currentTime).toBe(0);
    });
  });

  describe('UPDATE_TIME', () => {
    test('should update current time', () => {
      const action = {
        type: 'UPDATE_TIME' as const,
        payload: { time: 42 },
      };

      const newState = gameReducer(initialGameState, action);

      expect(newState.currentTime).toBe(42);
    });
  });

  describe('SET_LOADING', () => {
    test('should update loading state', () => {
      const action = {
        type: 'SET_LOADING' as const,
        payload: { loading: true },
      };

      const newState = gameReducer(initialGameState, action);

      expect(newState.isLoading).toBe(true);
    });
  });

  describe('SET_ERROR', () => {
    test('should update error state', () => {
      const errorMessage = 'Test error';
      const action = {
        type: 'SET_ERROR' as const,
        payload: { error: errorMessage },
      };

      const newState = gameReducer(initialGameState, action);

      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('PAUSE_GAME and RESUME_GAME', () => {
    test('should handle pause and resume', () => {
      // First initialize game
      const initAction = {
        type: 'INITIALIZE_GAME' as const,
        payload: { difficulty: DIFFICULTIES.BEGINNER },
      };
      const initializedState = gameReducer(initialGameState, initAction);

      // Pause game
      const pauseAction = { type: 'PAUSE_GAME' as const };
      const pausedState = gameReducer(initializedState, pauseAction);

      expect(pausedState.error).toBeNull();

      // Resume game
      const resumeAction = { type: 'RESUME_GAME' as const };
      const resumedState = gameReducer(pausedState, resumeAction);

      expect(resumedState.error).toBeNull();
    });
  });

  describe('unknown action', () => {
    test('should return current state for unknown action', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' as any };
      const newState = gameReducer(initialGameState, unknownAction);

      expect(newState).toBe(initialGameState);
    });
  });
});