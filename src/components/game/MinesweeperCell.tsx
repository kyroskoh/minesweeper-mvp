/**
 * Minesweeper MVP - Enhanced Cell Component
 * 
 * Individual cell component with classic Minesweeper styling,
 * color-coded numbers, and 3D visual effects.
 * 
 * @author Kyros Koh
 * @version 1.1.5
 * @created 2025-09-23
 * @updated 2025-09-25
 */
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Cell, CellState } from '@/lib/minesweeper';

interface MinesweeperCellProps {
  cell: Cell;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  onFlagToggle?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isTriggeredMine?: boolean;
}

// Long press duration in milliseconds
const LONG_PRESS_DURATION = 500;

export default function MinesweeperCell({
  cell,
  onClick,
  onRightClick,
  onFlagToggle,
  disabled = false,
  size = 'md',
  isTriggeredMine = false,
}: MinesweeperCellProps) {
  // State for long press
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const touchStartTime = useRef<number>(0);
  const touchStartPos = useRef<{ x: number, y: number } | null>(null);
  
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

  // Enhanced touch start handler
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || cell.state === CellState.REVEALED) return;
    
    // Record start time and position for better detection
    touchStartTime.current = Date.now();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    } else {
      touchStartPos.current = { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
    }
    
    setIsLongPressing(true);
    
    // Clear any existing timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    longPressTimer.current = setTimeout(() => {
      // Execute flag toggle on long press
      if (onFlagToggle) {
        onFlagToggle();
      }
      setIsLongPressing(false);
    }, LONG_PRESS_DURATION);
  }, [disabled, cell.state, onFlagToggle]);

  // Enhanced touch end handler
  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    touchStartPos.current = null;
    setIsLongPressing(false);
  }, []);

  // Handle cell click with improved logic
  const handleClick = (e: React.MouseEvent) => {
    // Don't process click if we're in the middle of a long press
    if (isLongPressing) return;
    
    // Detect right click more reliably
    if (e.button === 2 || e.ctrlKey) {
      e.preventDefault();
      onRightClick(e);
      return;
    }
    
    // Normal click always reveals
    onClick();
  };

  // Add global event listeners for more reliable right-click detection
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Custom right-click handler for better proxy compatibility
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      if (!disabled && button.contains(e.target as Node)) {
        onRightClick(e as unknown as React.MouseEvent);
      }
    };

    // Add the event listener to the button
    button.addEventListener('contextmenu', handleContextMenu);

    return () => {
      // Clean up
      button.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [disabled, onRightClick]);

  // Get cell styling classes
  const getCellClasses = (): string => {
    const sizeClasses = {
      sm: 'w-6 h-6 text-xs',
      md: 'w-8 h-8 text-sm',
      lg: 'w-10 h-10 text-base',
    };

    let classes = `${sizeClasses[size]} border border-gray-400 flex items-center justify-center font-bold cursor-pointer select-none transition-all duration-150 `;
    
    // Add visual indicator for long press
    if (isLongPressing && cell.state === CellState.HIDDEN && !disabled) {
      classes += 'ring-2 ring-orange-300 ring-opacity-50 ';
    }
    
    if (disabled) {
      classes += 'cursor-not-allowed ';
    }

    if (cell.state === CellState.REVEALED) {
      if (cell.isMine) {
        // Special highlighting for the mine that was clicked
        if (isTriggeredMine) {
          // Yellow background for the triggered mine
          classes += 'bg-yellow-500 text-black border-yellow-600 ';
        } else {
          // Regular red background for other mines
          classes += 'bg-red-500 text-white border-red-600 ';
        }
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
      ref={buttonRef}
      className={getCellClasses()}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(e);
      }}
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchEnd={(e) => handleTouchEnd(e)}
      onTouchCancel={(e) => handleTouchEnd(e)}
      onMouseDown={(e) => handleTouchStart(e)}
      onMouseUp={(e) => handleTouchEnd(e)}
      onMouseLeave={(e) => handleTouchEnd(e)}
      disabled={disabled}
      title={cell.state !== CellState.REVEALED ? 'Right-click or long press to flag' : ''}
      style={{
        // Add subtle 3D effect for unrevealed cells
        boxShadow: cell.state === CellState.HIDDEN && !disabled
          ? 'inset 2px 2px 0px rgba(255,255,255,0.8), inset -2px -2px 0px rgba(0,0,0,0.3)'
          : undefined,
        // Prevent text selection which can interfere with interactions
        WebkitUserSelect: 'none',
        userSelect: 'none',
        // Prevent default touch behaviors like scrolling
        touchAction: 'manipulation'
      }}
      data-cell-pos={`${cell.position.x},${cell.position.y}`}
    >
      {getCellContent()}
    </button>
  );
}