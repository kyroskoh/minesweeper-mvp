import { Game, GameState, Difficulty, Position, DifficultyKey } from '@/lib/minesweeper';

export interface GameContextState {
  game: Game | null;
  gameState: GameState | null;
  currentTime: number;
  isLoading: boolean;
  error: string | null;
}

export type GameAction =
  | { type: 'INITIALIZE_GAME'; payload: { difficulty: Difficulty; seed?: number } }
  | { type: 'REVEAL_CELL'; payload: { x: number; y: number } }
  | { type: 'TOGGLE_FLAG'; payload: { x: number; y: number } }
  | { type: 'RESET_GAME'; payload?: { difficulty?: Difficulty; seed?: number } }
  | { type: 'UPDATE_TIME'; payload: { time: number } }
  | { type: 'LOAD_GAME'; payload: { gameState: GameState } }
  | { type: 'SAVE_GAME' }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' };

export interface GameContextValue {
  // State
  state: GameContextState;
  
  // Actions
  initializeGame: (difficulty: Difficulty, seed?: number) => void;
  revealCell: (x: number, y: number) => Position[];
  toggleFlag: (x: number, y: number) => boolean;
  resetGame: (difficulty?: Difficulty, seed?: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  
  // Getters
  getFormattedTime: () => string;
  getRemainingMines: () => number;
  isGameFinished: () => boolean;
  isGameWon: () => boolean;
  isGameLost: () => boolean;
  isFirstMove: () => boolean;
  
  // Settings
  changeDifficulty: (difficulty: Difficulty) => void;
}

export interface GameProviderProps {
  children: React.ReactNode;
  initialDifficulty?: DifficultyKey;
  autoSave?: boolean;
  storageKey?: string;
}