/**
 * Minesweeper MVP - Client-Only Place Flag Button Wrapper
 * 
 * Ensures the PlaceFlagButton only renders on the client side to avoid
 * hydration mismatches in production builds.
 * 
 * @author Kyros Koh
 * @version 1.0.0
 * @created 2025-09-23
 */
'use client';

import React, { useState, useEffect } from 'react';
import PlaceFlagButton from './PlaceFlagButton';

interface ClientOnlyPlaceFlagButtonProps {
  isBombPlacementMode: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ClientOnlyPlaceFlagButton(props: ClientOnlyPlaceFlagButtonProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="px-4 py-3 text-base min-h-[48px] font-semibold rounded-lg border-2 bg-gray-200 border-gray-400 text-gray-700 flex items-center justify-center gap-2 select-none">
          <span className="text-xl">🔍</span>
          <span className="font-bold">Reveal Cells</span>
        </div>
        <p className="text-xs text-gray-500 text-center max-w-[200px] leading-tight">
          Tap cells to reveal them
        </p>
      </div>
    );
  }

  return <PlaceFlagButton {...props} />;
}