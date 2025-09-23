/**
 * Minesweeper MVP - Place Flag Button Component
 * 
 * Mobile-friendly toggle button that allows smartphone/tablet users
 * to switch between reveal mode and flag placement mode.
 * 
 * @author Kyros Koh
 * @version 1.0.0
 * @created 2025-09-23
 */
'use client';

import React from 'react';

interface PlaceFlagButtonProps {
  isBombPlacementMode: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function PlaceFlagButton({
  isBombPlacementMode,
  onToggle,
  disabled = false,
  size = 'md',
}: PlaceFlagButtonProps) {
  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'px-3 py-2 text-sm min-h-[40px]',
      md: 'px-4 py-3 text-base min-h-[48px]',
      lg: 'px-5 py-4 text-lg min-h-[56px]',
    };
    return sizeMap[size];
  };

  const getButtonClasses = () => {
    const baseClasses = 'font-semibold rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 select-none';
    const sizeClasses = getSizeClasses();
    
    let colorClasses = '';
    let statusClasses = '';

    if (disabled) {
      colorClasses = 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed';
    } else if (isBombPlacementMode) {
      // Active bomb placement mode - orange/red theme
      colorClasses = 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 border-orange-600 text-white shadow-lg';
      statusClasses = 'transform hover:scale-105 active:scale-95';
    } else {
      // Normal reveal mode - blue/gray theme  
      colorClasses = 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 border-gray-400 text-gray-700';
      statusClasses = 'hover:shadow-md active:shadow-sm';
    }

    return `${baseClasses} ${sizeClasses} ${colorClasses} ${statusClasses}`;
  };

  const getIcon = () => {
    return isBombPlacementMode ? '💣' : '🔍';
  };

  const getLabel = () => {
    return isBombPlacementMode ? 'Place Flags' : 'Reveal Cells';
  };

  const getHelpText = () => {
    return isBombPlacementMode 
      ? 'Tap cells to place/remove flags'
      : 'Tap cells to reveal them';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className={getButtonClasses()}
        onClick={onToggle}
        disabled={disabled}
        type="button"
      aria-label={`Switch to ${isBombPlacementMode ? 'reveal' : 'flag placement'} mode`}
        role="switch"
        aria-checked={isBombPlacementMode}
      >
        <span className="text-xl" role="img" aria-label={isBombPlacementMode ? 'bomb' : 'magnifying glass'}>
          {getIcon()}
        </span>
        <span className="font-bold">
          {getLabel()}
        </span>
      </button>
      
      {/* Help text for mobile users */}
      <p className="text-xs text-gray-500 text-center max-w-[200px] leading-tight">
        {getHelpText()}
      </p>
      
      {/* Mode indicator for accessibility */}
      <div className="sr-only" role="status" aria-live="polite">
        Current mode: {isBombPlacementMode ? 'Flag placement' : 'Cell reveal'}
      </div>
    </div>
  );
}