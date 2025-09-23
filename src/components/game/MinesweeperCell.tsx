/**
 * Minesweeper MVP - Enhanced Cell Component
 * 
 * Individual cell component with classic Minesweeper styling,
 * color-coded numbers, and 3D visual effects.
 * 
 * @author Kyros Koh
 * @version 1.0.0
 * @created 2025-09-23
 */
'use client';

import React from 'react';
import { Cell, CellState } from '@/lib/minesweeper';

interface MinesweeperCellProps {
  cell: Cell;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function MinesweeperCell({
  cell,
  onClick,
  onRightClick,
  disabled = false,
  size = 'md',
}: MinesweeperCellProps) {
  
  // Classic Minesweeper number colors
  const getNumberColor = (neighborMines: number): string => {
    const colorMap: Record<number, string> = {
      1: 'text-blue-600',      // Blue
      2: 'text-green-600',     // Green  
      3: 'text-red-600',       // Red
      4: 'text-purple-700',    // Purple/Navy
      5: 'text-yellow-700',    // Brown/Maroon
      6: 'text-pink-600',      // Pink/Teal
      7: 'text-black',         // Black
      8: 'text-gray-600',      // Gray
    };
    return colorMap[neighborMines] || 'text-gray-800';
  };

  // Get cell display content
  const getCellContent = (): string => {
    if (cell.state === CellState.REVEALED) {
      if (cell.isMine) {
        return '💣';
      } else if (cell.neighborMines > 0) {
        return cell.neighborMines.toString();
      }
      return '';
    } else if (cell.state === CellState.FLAGGED) {
      return '🚩';
    }
    return '';
  };

  // Get cell styling classes
  const getCellClasses = (): string => {
    const sizeClasses = {
      sm: 'w-6 h-6 text-xs',
      md: 'w-8 h-8 text-sm',
      lg: 'w-10 h-10 text-base',
    };

    let classes = `${sizeClasses[size]} border border-gray-400 flex items-center justify-center font-bold cursor-pointer select-none transition-all duration-150 `;
    
    if (disabled) {
      classes += 'cursor-not-allowed ';
    }

    if (cell.state === CellState.REVEALED) {
      if (cell.isMine) {
        // Mine cell - red background
        classes += 'bg-red-500 text-white border-red-600 ';
      } else {
        // Revealed safe cell - light gray with number color
        const numberColor = cell.neighborMines > 0 ? getNumberColor(cell.neighborMines) : 'text-gray-600';
        classes += `bg-gray-200 border-gray-300 ${numberColor} `;
      }
    } else {
      // Hidden/flagged cell - raised button appearance
      if (cell.state === CellState.FLAGGED) {
        classes += 'bg-yellow-100 border-yellow-300 hover:bg-yellow-150 ';
      } else {
        classes += 'bg-gray-300 border-gray-500 hover:bg-gray-250 ';
      }
      
      // 3D button effect for unrevealed cells
      if (!disabled) {
        classes += 'shadow-sm hover:shadow-md active:shadow-inner ';
        classes += 'border-t-gray-100 border-l-gray-100 border-r-gray-600 border-b-gray-600 ';
      }
    }

    return classes;
  };

  return (
    <button
      className={getCellClasses()}
      onClick={onClick}
      onContextMenu={onRightClick}
      disabled={disabled}
      style={{
        // Add subtle 3D effect for unrevealed cells
        boxShadow: cell.state === CellState.HIDDEN && !disabled
          ? 'inset 2px 2px 0px rgba(255,255,255,0.8), inset -2px -2px 0px rgba(0,0,0,0.3)'
          : undefined
      }}
    >
      {getCellContent()}
    </button>
  );
}