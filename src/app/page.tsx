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
