export { Board } from './Board';
export { Game } from './Game';
export { Timer } from './Timer';
export * from './types';

// Utility functions
export const createGame = (difficulty: any, seed?: number) => new Game(difficulty, seed);

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getDifficultyByName = (name: string) => {
  const { DIFFICULTIES } = require('./types');
  return Object.values(DIFFICULTIES).find((diff: any) => diff.name.toLowerCase() === name.toLowerCase());
};