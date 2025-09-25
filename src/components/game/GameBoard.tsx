'use client';

import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useGameStats } from '@/hooks';
import MinesweeperCell from './MinesweeperCell';
import { Position } from '@/lib/minesweeper';

interface GameBoardProps {
  cellSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function GameBoard({ cellSize = 'md', className = '' }: GameBoardProps) {
  const { state, revealCell, toggleFlag, resumeGame } = useGame();
  const { isFinished, isLost } = useGameStats();
  const [isFlagMode, setIsFlagMode] = useState(false);
  const [triggeredMine, setTriggeredMine] = useState<Position | null>(null);

  if (!state.gameState?.board || !state.gameState?.difficulty) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { board, difficulty } = state.gameState;

  // Handle cell click based on current mode
  const handleCellClick = (x: number, y: number) => {
    if (isFinished) return;
    
    // Resume the game if it's paused
    if (state.game && !state.game.isTimerRunning() && !state.game.isFinished()) {
      resumeGame();
    }
    
    // Check if we're in flag placement mode
    if (isFlagMode) {
      // In flag mode, clicking should toggle flags
      toggleFlag(x, y);
      return;
    }
    
    // In normal mode, clicking reveals cells
    const cell = board[y][x];
    if (cell.isMine && cell.state !== 'revealed') {
      // If it's a mine, store its position as the triggered mine
      setTriggeredMine({ x, y });
    }
    
    revealCell(x, y);
  };

  const handleCellRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (isFinished) return;
    
    // Resume the game if it's paused
    if (state.game && !state.game.isTimerRunning() && !state.game.isFinished()) {
      resumeGame();
    }
    
    // Right click always toggles flags, regardless of mode
    toggleFlag(x, y);
  };

  const handleFlagToggle = (x: number, y: number) => {
    if (isFinished) return;
    
    // Resume the game if it's paused
    if (state.game && !state.game.isTimerRunning() && !state.game.isFinished()) {
      resumeGame();
    }
    
    // This is called from long press or explicit flag toggle
    toggleFlag(x, y);
  };

  return (
    <div className={`inline-block ${className}`}>
      <div 
        className="bg-gray-100 border-4 border-gray-600 p-2 inline-block"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${difficulty.width}, 1fr)`,
          gap: '1px',
          // Add classic minesweeper sunken border effect
          borderStyle: 'solid',
          borderTopColor: '#808080',
          borderLeftColor: '#808080', 
          borderRightColor: '#C0C0C0',
          borderBottomColor: '#C0C0C0',
          backgroundColor: '#C0C0C0',
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <MinesweeperCell
              key={`${x}-${y}`}
              cell={cell}
              onClick={() => handleCellClick(x, y)}
              onRightClick={(e) => handleCellRightClick(e, x, y)}
              onFlagToggle={() => handleFlagToggle(x, y)}
              disabled={isFinished}
              size={cellSize}
              isTriggeredMine={
                isLost && 
                triggeredMine !== null && 
                triggeredMine.x === x && 
                triggeredMine.y === y
              }
            />
          ))
        )}
      </div>
    </div>
  );
}