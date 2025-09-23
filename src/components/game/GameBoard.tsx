'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { useGameStats } from '@/hooks';
import MinesweeperCell from './MinesweeperCell';

interface GameBoardProps {
  cellSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function GameBoard({ cellSize = 'md', className = '' }: GameBoardProps) {
  const { state, revealCell, toggleFlag } = useGame();
  const { isFinished } = useGameStats();
  const { isBombPlacementMode } = state;

  if (!state.gameState?.board || !state.gameState?.difficulty) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { board, difficulty } = state.gameState;

  const handleCellClick = (x: number, y: number) => {
    if (!isFinished) {
      revealCell(x, y);
    }
  };

  const handleCellRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (!isFinished) {
      toggleFlag(x, y);
    }
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
              disabled={isFinished}
              size={cellSize}
              isBombPlacementMode={isBombPlacementMode}
            />
          ))
        )}
      </div>
    </div>
  );
}