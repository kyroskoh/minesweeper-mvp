/**
 * Minesweeper MVP - Main Application Page
 * 
 * Entry point for the Minesweeper game application.
 * Wraps the game demo with the GameProvider context.
 * 
 * @author Kyros Koh
 * @version 1.0.0
 * @created 2025-09-23
 */
import { GameProvider } from '@/contexts/GameContext';
import GameDemo from '@/components/demo/GameDemo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <GameProvider initialDifficulty="BEGINNER" autoSave={true}>
        <GameDemo />
      </GameProvider>
    </div>
  );
}
