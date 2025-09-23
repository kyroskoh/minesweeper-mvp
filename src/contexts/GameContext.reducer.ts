import { Game, DIFFICULTIES } from '@/lib/minesweeper';
import { GameContextState, GameAction } from './GameContext.types';

export const initialGameState: GameContextState = {
  game: null,
  gameState: null,
  currentTime: 0,
  isLoading: false,
  error: null,
  isBombPlacementMode: false,
};

export function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      try {
        const { difficulty, seed } = action.payload;
        const game = new Game(difficulty, seed);
        const gameState = game.getState();

        return {
          ...state,
          game,
          gameState,
          currentTime: 0,
          error: null,
          isLoading: false,
          // Preserve isBombPlacementMode during game initialization
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Failed to initialize game',
          isLoading: false,
        };
      }
    }

    case 'REVEAL_CELL': {
      if (!state.game) {
        return {
          ...state,
          error: 'Game not initialized',
        };
      }

      try {
        const { x, y } = action.payload;
        const revealedPositions = state.game.reveal(x, y);
        const gameState = state.game.getState();
        const currentTime = state.game.getGameTime();

        return {
          ...state,
          gameState,
          currentTime,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Failed to reveal cell',
        };
      }
    }

    case 'TOGGLE_FLAG': {
      if (!state.game) {
        return {
          ...state,
          error: 'Game not initialized',
        };
      }

      try {
        const { x, y } = action.payload;
        const flagged = state.game.toggleFlag(x, y);
        const gameState = state.game.getState();

        return {
          ...state,
          gameState,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Failed to toggle flag',
        };
      }
    }

    case 'RESET_GAME': {
      if (!state.game) {
        // If no game exists, initialize with default difficulty
        const difficulty = action.payload?.difficulty || DIFFICULTIES.BEGINNER;
        const seed = action.payload?.seed;
        const game = new Game(difficulty, seed);
        const gameState = game.getState();

        return {
          ...state,
          game,
          gameState,
          currentTime: 0,
          error: null,
          // Preserve isBombPlacementMode during game reset
        };
      }

      try {
        const difficulty = action.payload?.difficulty;
        const seed = action.payload?.seed;
        state.game.reset(difficulty, seed);
        const gameState = state.game.getState();

        return {
          ...state,
          gameState,
          currentTime: 0,
          error: null,
          // Preserve isBombPlacementMode during game reset
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Failed to reset game',
        };
      }
    }

    case 'UPDATE_TIME': {
      const { time } = action.payload;
      return {
        ...state,
        currentTime: time,
      };
    }

    case 'LOAD_GAME': {
      try {
        const { gameState } = action.payload;
        const game = Game.fromState(gameState);
        const currentTime = game.getGameTime();

        return {
          ...state,
          game,
          gameState,
          currentTime,
          error: null,
          isLoading: false,
          // Preserve isBombPlacementMode when loading saved game
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Failed to load game',
          isLoading: false,
        };
      }
    }

    case 'SAVE_GAME': {
      // This action is mainly for triggering side effects (localStorage save)
      // The state doesn't need to change
      return state;
    }

    case 'SET_LOADING': {
      const { loading } = action.payload;
      return {
        ...state,
        isLoading: loading,
      };
    }

    case 'SET_ERROR': {
      const { error } = action.payload;
      return {
        ...state,
        error,
      };
    }

    case 'PAUSE_GAME': {
      if (!state.game) {
        return state;
      }

      try {
        state.game.pauseTimer();
        const gameState = state.game.getState();

        return {
          ...state,
          gameState,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Failed to pause game',
        };
      }
    }

    case 'RESUME_GAME': {
      if (!state.game) {
        return state;
      }

      try {
        state.game.resumeTimer();
        const gameState = state.game.getState();

        return {
          ...state,
          gameState,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Failed to resume game',
        };
      }
    }

    case 'TOGGLE_BOMB_PLACEMENT_MODE': {
      return {
        ...state,
        isBombPlacementMode: !state.isBombPlacementMode,
      };
    }

    default:
      return state;
  }
}