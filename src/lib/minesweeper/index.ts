export { Board } from './Board';
export { Game } from './Game';
export { Timer } from './Timer';
export * from './types';

import { Game } from './Game';
import { Difficulty, DIFFICULTIES } from './types';

// Utility functions
export const createGame = (difficulty: Difficulty, seed?: number) => new Game(difficulty, seed);

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getDifficultyByName = (name: string): Difficulty | undefined => {
  return Object.values(DIFFICULTIES).find((diff) => diff.name.toLowerCase() === name.toLowerCase());
};
