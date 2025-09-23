export interface Position {
  x: number;
  y: number;
}

export enum CellState {
  HIDDEN = 'hidden',
  REVEALED = 'revealed',
  FLAGGED = 'flagged',
}

export enum GameStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  WON = 'won',
  LOST = 'lost',
}

export interface Cell {
  position: Position;
  isMine: boolean;
  state: CellState;
  neighborMines: number;
}

export interface Difficulty {
  name: string;
  width: number;
  height: number;
  mines: number;
}

export interface GameState {
  board: Cell[][];
  status: GameStatus;
  difficulty: Difficulty;
  startTime: number | null;
  endTime: number | null;
  flagsUsed: number;
  firstMove: boolean;
}

export interface GameAction {
  type: 'REVEAL' | 'TOGGLE_FLAG' | 'RESET' | 'START_TIMER' | 'END_GAME';
  payload?: any;
}

export interface Score {
  id: string;
  playerName: string;
  time: number;
  difficulty: string;
  date: string;
}

export const DIFFICULTIES: Record<string, Difficulty> = {
  BEGINNER: {
    name: 'Beginner',
    width: 9,
    height: 9,
    mines: 10,
  },
  INTERMEDIATE: {
    name: 'Intermediate',
    width: 16,
    height: 16,
    mines: 40,
  },
  EXPERT: {
    name: 'Expert',
    width: 30,
    height: 16,
    mines: 99,
  },
} as const;

export type DifficultyKey = keyof typeof DIFFICULTIES;