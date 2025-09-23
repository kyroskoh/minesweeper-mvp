import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';

export interface UseTimerReturn {
  time: number;
  formattedTime: string;
  isRunning: boolean;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
}

export function useTimer(): UseTimerReturn {
  const { state, pauseGame, resumeGame, getFormattedTime } = useGame();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Update local state based on game state
  useEffect(() => {
    if (state.game) {
      setTime(state.currentTime);
      setIsRunning(state.game.isTimerRunning());
      setIsPaused(state.game.isTimerRunning() === false && state.currentTime > 0 && !state.game.isFinished());
    }
  }, [state.game, state.currentTime, state.gameState?.status]);

  const pause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  const resume = useCallback(() => {
    resumeGame();
  }, [resumeGame]);

  return {
    time,
    formattedTime: getFormattedTime(),
    isRunning,
    isPaused,
    pause,
    resume,
  };
}

export function useGameStats() {
  const { state, getRemainingMines, isGameFinished, isGameWon, isGameLost, isFirstMove } = useGame();

  return {
    remainingMines: getRemainingMines(),
    flagsUsed: state.gameState?.flagsUsed || 0,
    isFinished: isGameFinished(),
    isWon: isGameWon(),
    isLost: isGameLost(),
    isFirstMove: isFirstMove(),
    difficulty: state.gameState?.difficulty,
    status: state.gameState?.status,
  };
}