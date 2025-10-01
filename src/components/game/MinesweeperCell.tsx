/**
 * Minesweeper MVP - Enhanced Cell Component
 * 
 * Individual cell component with classic Minesweeper styling,
 * color-coded numbers, and 3D visual effects.
 * 
 * @author Kyros Koh
 * @version 1.1.8
 * @created 2025-09-23
 * @updated 2025-10-01
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
  // State for long press - proxy-resilient implementation
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const animationFrame = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const touchStartTime = useRef<number>(0);
  const touchStartPos = useRef<{ x: number, y: number } | null>(null);
  const longPressTriggered = useRef<boolean>(false);
  const isActiveTouch = useRef<boolean>(false);
  
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

  /**
   * Proxy-resilient long press detection using multiple timing mechanisms
   */
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || cell.state === CellState.REVEALED) return;
    
    // Prevent default to avoid interference
    if ('touches' in e) {
      e.preventDefault();
    }
    
    // Record start time with high precision
    touchStartTime.current = performance.now();
    longPressTriggered.current = false;
    isActiveTouch.current = true;
    
    // Record initial position for movement detection
    if ('touches' in e) {
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    } else {
      touchStartPos.current = { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
    }
    
    setIsLongPressing(true);
    
    // Clear any existing timers/frames
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    
    // Use dual timing mechanism for better proxy compatibility
    // 1. Traditional setTimeout as primary
    longPressTimer.current = setTimeout(() => {
      if (isActiveTouch.current && !longPressTriggered.current) {
        triggerLongPress();
      }
    }, LONG_PRESS_DURATION);
    
    // 2. requestAnimationFrame as backup for timing precision
    const checkLongPress = () => {
      if (!isActiveTouch.current || longPressTriggered.current) return;
      
      const elapsed = performance.now() - touchStartTime.current;
      if (elapsed >= LONG_PRESS_DURATION) {
        triggerLongPress();
      } else {
        animationFrame.current = requestAnimationFrame(checkLongPress);
      }
    };
    
    animationFrame.current = requestAnimationFrame(checkLongPress);
  }, [disabled, cell.state, onFlagToggle]);
  
  /**
   * Trigger long press action with deduplication
   */
  const triggerLongPress = useCallback(() => {
    if (longPressTriggered.current || !isActiveTouch.current) return;
    
    longPressTriggered.current = true;
    setIsLongPressing(false);
    
    // Execute flag toggle
    if (onFlagToggle) {
      onFlagToggle();
    }
    
    // Provide haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [onFlagToggle]);
  
  // Add passive event listeners for better proxy performance
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    
    // Passive touchstart for better scroll performance
    const passiveTouchStart = (e: TouchEvent) => {
      // This runs alongside the React event but doesn't preventDefault
      // Helps with proxy timing issues
    };
    
    // Add passive listeners
    button.addEventListener('touchstart', passiveTouchStart, { passive: true });
    
    return () => {
      button.removeEventListener('touchstart', passiveTouchStart);
    };
  }, []);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  /**
   * Enhanced touch end handler with movement and timing validation
   */
  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // Clean up all timers and state
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    
    // Check if this was a valid touch end (not cancelled by movement)
    let wasValidTouch = isActiveTouch.current;
    
    if (wasValidTouch && touchStartPos.current && !longPressTriggered.current) {
      // Validate touch didn't move too much (for touch devices)
      if ('touches' in e || 'changedTouches' in e) {
        const touchEvent = e as React.TouchEvent;
        const touch = touchEvent.changedTouches ? touchEvent.changedTouches[0] : 
                     touchEvent.touches ? touchEvent.touches[0] : null;
        if (touch) {
          const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
          const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
          const maxMovement = 10; // pixels
          
          if (deltaX > maxMovement || deltaY > maxMovement) {
            wasValidTouch = false;
          }
        }
      }
    }
    
    // Reset all state
    isActiveTouch.current = false;
    touchStartPos.current = null;
    setIsLongPressing(false);
    
    // Small delay to ensure long press doesn't interfere with click
    if (longPressTriggered.current) {
      setTimeout(() => {
        longPressTriggered.current = false;
      }, 100);
    }
  }, []);

  /**
   * Handle primary (left) click - reveals cells
   * Early returns for right-button, long-press, or Ctrl+click
   */
  const handlePrimaryClick = (e: React.MouseEvent) => {
    // Don't process click if we're in the middle of a long press or it was just triggered
    if (isLongPressing || longPressTriggered.current) return;
    
    // Ignore right mouse button - let contextmenu handle it
    if (e.button !== 0) return;
    
    // Handle Ctrl+Click as right-click on Mac
    if (e.ctrlKey && e.button === 0) {
      e.preventDefault();
      onRightClick(e);
      return;
    }
    
    // Normal left click reveals cell
    onClick();
  };

  /**
   * Handle right-click (context menu) - toggles flags
   * Works for both desktop right-click and Ctrl+click on Mac
   */
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't process if disabled or already revealed
    if (disabled || cell.state === CellState.REVEALED) return;
    
    // Call the right-click handler
    onRightClick(e);
  };

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
      onClick={handlePrimaryClick}
      onContextMenu={handleContextMenu}
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchEnd={(e) => handleTouchEnd(e)}
      onTouchCancel={(e) => handleTouchEnd(e)}
      onTouchMove={(e) => {
        // Cancel long press if finger moves too much
        if (touchStartPos.current && isActiveTouch.current) {
          const touch = e.touches[0];
          if (touch) {
            const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
            const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
            if (deltaX > 10 || deltaY > 10) {
              handleTouchEnd(e);
            }
          }
        }
      }}
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
        // Enhanced touch action for proxy compatibility
        touchAction: 'manipulation',
        // Prevent iOS Safari touch callouts
        WebkitTouchCallout: 'none',
        // Prevent Android Chrome highlight
        WebkitTapHighlightColor: 'transparent',
        // Improve touch responsiveness
        msContentZooming: 'none',
        msTouchAction: 'manipulation'
      }}
      data-cell-pos={`${cell.position.x},${cell.position.y}`}
    >
      {getCellContent()}
    </button>
  );
}