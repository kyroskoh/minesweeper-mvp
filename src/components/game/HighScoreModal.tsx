'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { DifficultyKey, DIFFICULTIES } from '@/lib/minesweeper';
import { Timer } from '@/lib/minesweeper/Timer';

interface HighScoreModalProps {
  onClose: () => void;
}

export default function HighScoreModal({ onClose }: HighScoreModalProps) {
  const { state, getHighScores, saveHighScore, setPlayerName } = useGame();
  const [activeTab, setActiveTab] = useState<DifficultyKey>('BEGINNER');
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);

  const highScores = getHighScores(activeTab);
  const { isNewHighScore, playerName } = state;

  // Initialize player name from context
  useEffect(() => {
    setPlayerNameInput(playerName);
  }, [playerName]);

  // Automatically focus on name input when high score is achieved
  useEffect(() => {
    if (isNewHighScore && !scoreSaved) {
      // Focus the input after a short delay to ensure it's mounted
      const timer = setTimeout(() => {
        const nameInput = document.getElementById('player-name-input');
        if (nameInput) {
          nameInput.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isNewHighScore, scoreSaved]);

  const handleTabChange = (difficulty: DifficultyKey) => {
    setActiveTab(difficulty);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerNameInput(e.target.value);
  };

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    setPlayerName(playerNameInput);
    saveHighScore();
    setScoreSaved(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">High Scores</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex border-b mb-4">
          {Object.entries(DIFFICULTIES).map(([key, difficulty]) => (
            <button
              key={key}
              className={`py-2 px-4 font-medium ${
                activeTab === key
                  ? 'border-b-2 border-amber-500 text-amber-600 font-bold'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => handleTabChange(key as DifficultyKey)}
            >
              {difficulty.name}
            </button>
          ))}
        </div>

        {/* New High Score Form - Only shown when user achieves a new high score */}
        {isNewHighScore && !scoreSaved && (
          <div className="mb-6 p-4 bg-amber-100 border border-amber-400 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-amber-800">New High Score! 🏆</h3>
            <p className="mb-3 text-gray-800">
              Congratulations! You've achieved a high score of{' '}
              <span className="font-bold">{state.game?.getFormattedTime()}</span>
            </p>
            <form onSubmit={handleSubmitScore}>
              <label htmlFor="player-name-input" className="block text-gray-800 font-medium mb-1">
                Enter your name:
              </label>
              <div className="flex items-center">
                <input
                  id="player-name-input"
                  type="text"
                  value={playerNameInput}
                  onChange={handleNameChange}
                  placeholder="Your name"
                  className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  maxLength={15}
                  required
                />
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-4 py-2 rounded-r hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {/* High Scores Table */}
        <div className="overflow-y-auto max-h-80">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-gray-800">#</th>
                <th className="py-2 px-4 text-left text-gray-800">Name</th>
                <th className="py-2 px-4 text-left text-gray-800">Time</th>
                <th className="py-2 px-4 text-left text-gray-800">Date</th>
              </tr>
            </thead>
            <tbody>
              {highScores.length > 0 ? (
                highScores.map((score, index) => (
                  <tr key={score.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="py-2 px-4 text-gray-800">{index + 1}</td>
                    <td className="py-2 px-4 text-gray-800">{score.playerName}</td>
                    <td className="py-2 px-4 text-gray-800">{Timer.formatSeconds(score.time)}</td>
                    <td className="py-2 px-4 text-gray-800">{new Date(score.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-600 font-medium">
                    No high scores yet. Be the first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}