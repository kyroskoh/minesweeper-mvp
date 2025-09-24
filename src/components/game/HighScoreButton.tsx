'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';

interface HighScoreButtonProps {
  className?: string;
}

export default function HighScoreButton({ className = '' }: HighScoreButtonProps) {
  const { toggleHighScores } = useGame();

  return (
    <button
      onClick={toggleHighScores}
      className={`bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded ${className}`}
    >
      🏆 High Scores
    </button>
  );
}