/**
 * Minesweeper MVP - React Game Context
 * 
 * Central state management using React Context and useReducer pattern.
 * Handles game state, persistence, and real-time timer updates.
 * 
 * @author Kyros Koh
 * @version 1.0.0
 * @created 2025-09-23
 */
'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { DIFFICULTIES, Difficulty, DifficultyKey } from '@/lib/minesweeper';
import { localStorageManager, STORAGE_KEYS } from '@/lib/storage/localStorage';
import { gameReducer, initialGameState } from './GameContext.reducer';
import { GameContextValue, GameProviderProps } from './GameContext.types';

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  children,
  initialDifficulty = 'BEGINNER',
  autoSave = true,
  storageKey = STORAGE_KEYS.CURRENT_GAME,
}: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game on mount
  useEffect(() => {
    const difficulty = DIFFICULTIES[initialDifficulty];
    
    if (autoSave) {
      // Try to load saved game
      const savedGameState = localStorageManager.loadGameState(storageKey);
      if (savedGameState) {
        dispatch({ type: 'LOAD_GAME', payload: { gameState: savedGameState } });
        return;
      }
    }

    // Initialize new game with preferred difficulty
    const savedDifficulty = localStorageManager.loadDifficulty(initialDifficulty);
    const finalDifficulty = DIFFICULTIES[savedDifficulty] || difficulty;
    
    dispatch({ type: 'INITIALIZE_GAME', payload: { difficulty: finalDifficulty } });
  }, [initialDifficulty, autoSave, storageKey]);

  // Auto-save game state
  useEffect(() => {
    if (autoSave && state.gameState) {
      localStorageManager.saveGameState(storageKey, state.gameState);
    }
  }, [state.gameState, autoSave, storageKey]);

  // Timer update effect
  useEffect(() => {
    if (state.game && state.game.isTimerRunning()) {
      timerRef.current = setInterval(() => {
        const currentTime = state.game!.getGameTime();
        dispatch({ type: 'UPDATE_TIME', payload: { time: currentTime } });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.game?.isTimerRunning(), state.gameState?.status]);

  // Actions
  const initializeGame = useCallback((difficulty: any, seed?: number) => {
    dispatch({ type: 'INITIALIZE_GAME', payload: { difficulty, seed } });
  }, []);

  const revealCell = useCallback((x: number, y: number) => {
    dispatch({ type: 'REVEAL_CELL', payload: { x, y } });
    return state.game?.reveal(x, y) || [];
  }, [state.game]);

  const toggleFlag = useCallback((x: number, y: number) => {
    dispatch({ type: 'TOGGLE_FLAG', payload: { x, y } });
    return state.game?.toggleFlag(x, y) || false;
  }, [state.game]);

  const resetGame = useCallback((difficulty?: Difficulty, seed?: number) => {
    if (difficulty) {
      localStorageManager.saveDifficulty(difficulty.name.toUpperCase() as DifficultyKey);
    }
    dispatch({ type: 'RESET_GAME', payload: { difficulty, seed } });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, []);

  const toggleBombPlacementMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_BOMB_PLACEMENT_MODE' });
  }, []);

  const changeDifficulty = useCallback((difficulty: Difficulty) => {
    localStorageManager.saveDifficulty(difficulty.name.toUpperCase() as DifficultyKey);
    resetGame(difficulty);
  }, [resetGame]);

  // Getters
  const getFormattedTime = useCallback(() => {
    return state.game?.getFormattedTime() || '00:00';
  }, [state.game]);

  const getRemainingMines = useCallback(() => {
    return state.game?.getRemainingMines() || 0;
  }, [state.game]);

  const isGameFinished = useCallback(() => {
    return state.game?.isFinished() || false;
  }, [state.game]);

  const isGameWon = useCallback(() => {
    return state.game?.getStatus() === 'won';
  }, [state.game]);

  const isGameLost = useCallback(() => {
    return state.game?.getStatus() === 'lost';
  }, [state.game]);

  const isFirstMove = useCallback(() => {
    return state.game?.isFirstMove() || false;
  }, [state.game]);

  const contextValue: GameContextValue = {
    state,
    initializeGame,
    revealCell,
    toggleFlag,
    resetGame,
    pauseGame,
    resumeGame,
    toggleBombPlacementMode,
    getFormattedTime,
    getRemainingMines,
    isGameFinished,
    isGameWon,
    isGameLost,
    isFirstMove,
    changeDifficulty,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}