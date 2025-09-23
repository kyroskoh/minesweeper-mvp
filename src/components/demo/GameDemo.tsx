/**
 * Minesweeper MVP - Game Demo Component
 * 
 * A comprehensive demo showcasing the complete Minesweeper game
 * with enhanced UI, timing system, and classic number colors.
 * 
 * @author Kyros Koh
 * @version 1.0.0
 * @created 2025-09-23
 */
'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { useTimer, useGameStats } from '@/hooks';
import { DIFFICULTIES } from '@/lib/minesweeper';
import GameBoard from '../game/GameBoard';
import PlaceBombButton from '../game/PlaceBombButton';
import ColorReference from './ColorReference';

export default function GameDemo() {
  const {
    state,
    resetGame,
    changeDifficulty,
    toggleBombPlacementMode,
  } = useGame();

  const { formattedTime, isRunning, isPaused, pause, resume } = useTimer();
  const { remainingMines, flagsUsed, isFinished, isWon, isLost, difficulty } = useGameStats();

  if (!state.gameState || !state.gameState.board) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎯 Minesweeper MVP
        </h1>
        <p className="text-gray-600 mb-1">Minesweeper Game Engine</p>
        <p className="text-sm text-gray-500">
          by <span className="font-medium text-gray-700">Kyros Koh</span>
        </p>
      </div>

      {/* Game Stats Header */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex space-x-6">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-blue-600">{formattedTime}</div>
            <div className="text-xs text-gray-500">Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-red-600">{remainingMines}</div>
            <div className="text-xs text-gray-500">Mines Left</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-yellow-600">{flagsUsed}</div>
            <div className="text-xs text-gray-500">Flags Used</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded text-sm font-medium ${
            isWon ? 'bg-green-100 text-green-800' :
            isLost ? 'bg-red-100 text-red-800' :
            isRunning ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {isWon ? '😄 Won!' : 
             isLost ? '😵 Lost!' : 
             isRunning ? '⏱️ Running' : 
             '⏸️ Ready'}
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => resetGame()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            New Game
          </button>
          
          {isPaused && (
            <button
              onClick={resume}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Resume
            </button>
          )}
          
          {isRunning && (
            <button
              onClick={pause}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Pause
            </button>
          )}
        </div>
        
        <div className="flex space-x-2">
          {Object.entries(DIFFICULTIES).map(([key, diff]) => (
            <button
              key={key}
              onClick={() => changeDifficulty(diff)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                difficulty?.name === diff.name
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {diff.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile-Friendly Bomb Placement Button */}
      <div className="flex justify-center mb-4 md:hidden">
        <PlaceBombButton 
          isBombPlacementMode={state.isBombPlacementMode}
          onToggle={toggleBombPlacementMode}
          disabled={isFinished}
          size="md"
        />
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center gap-4">
          <GameBoard cellSize="md" />
          
          {/* Desktop Bomb Placement Button - shown below board */}
          <div className="hidden md:block">
            <PlaceBombButton 
              isBombPlacementMode={state.isBombPlacementMode}
              onToggle={toggleBombPlacementMode}
              disabled={isFinished}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Game Status Messages */}
      {isFinished && (
        <div className="text-center mb-4">
          <div className={`inline-block px-6 py-3 rounded-lg text-lg font-semibold ${
            isWon ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isWon ? 
              `🎉 Congratulations! You won in ${formattedTime}!` : 
              '💥 Game Over! Better luck next time!'
            }
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How to Play:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Left click</strong> to reveal a cell</li>
          <li>• <strong>Right click</strong> to flag/unflag a cell</li>
          <li>• On mobile: Use the <strong>"Place Bombs"</strong> button to switch modes</li>
          <li>• Numbers show how many mines are adjacent to that cell</li>
          <li>• Flag all mines without revealing them to win!</li>
          <li>• Timer starts on your first move</li>
        </ul>
      </div>

      {/* Color Reference */}
      <ColorReference />

      {/* Debug Info */}
      {state.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            <strong>Error:</strong> {state.error}
          </p>
        </div>
      )}

      {/* Author Credit */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          Created with ❤️ by{' '}
          <a 
            href="https://github.com/kyros-koh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Kyros Koh
          </a>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Minesweeper MVP v1.0.0 • Built with Next.js, TypeScript & Tailwind CSS
        </p>
      </div>
    </div>
  );
}