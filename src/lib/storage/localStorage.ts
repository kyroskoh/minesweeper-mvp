import { GameState, DifficultyKey } from '@/lib/minesweeper';

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  
  private constructor() {}
  
  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  private isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  public saveGameState(key: string, gameState: GameState): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const serializedState = JSON.stringify({
        ...gameState,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(key, serializedState);
      return true;
    } catch (error) {
      console.error('Failed to save game state to localStorage:', error);
      return false;
    }
  }

  public loadGameState(key: string): GameState | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const serializedState = localStorage.getItem(key);
      if (!serializedState) {
        return null;
      }

      const parsedState = JSON.parse(serializedState);
      
      // Remove timestamp before returning (it's not part of GameState)
      const { timestamp, ...gameState } = parsedState;
      
      return gameState as GameState;
    } catch (error) {
      console.error('Failed to load game state from localStorage:', error);
      return null;
    }
  }

  public clearGameState(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to clear game state from localStorage:', error);
      return false;
    }
  }

  public savePreference<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to save preference to localStorage:', error);
      return false;
    }
  }

  public loadPreference<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Failed to load preference from localStorage:', error);
      return defaultValue;
    }
  }

  public saveDifficulty(difficulty: DifficultyKey): boolean {
    return this.savePreference('minesweeper_difficulty', difficulty);
  }

  public loadDifficulty(defaultDifficulty: DifficultyKey = 'BEGINNER'): DifficultyKey {
    return this.loadPreference<DifficultyKey>('minesweeper_difficulty', defaultDifficulty);
  }

  public getAllSavedGames(): Array<{ key: string; timestamp: string }> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const savedGames: Array<{ key: string; timestamp: string }> = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('minesweeper_game_')) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const parsed = JSON.parse(item);
              if (parsed.timestamp) {
                savedGames.push({
                  key,
                  timestamp: parsed.timestamp,
                });
              }
            } catch {
              // Skip invalid items
            }
          }
        }
      }
      
      // Sort by timestamp (newest first)
      return savedGames.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to get saved games from localStorage:', error);
      return [];
    }
  }

  public getStorageInfo(): {
    isAvailable: boolean;
    usage?: number;
    quota?: number;
  } {
    const isAvailable = this.isAvailable();
    
    if (!isAvailable) {
      return { isAvailable: false };
    }

    try {
      // Estimate storage usage
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }

      return {
        isAvailable: true,
        usage: totalSize,
        // Most browsers have ~5-10MB quota for localStorage
        quota: 5 * 1024 * 1024, // 5MB estimate
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { isAvailable };
    }
  }
}

// Export singleton instance for easy usage
export const localStorageManager = LocalStorageManager.getInstance();

// Export storage keys constants
export const STORAGE_KEYS = {
  CURRENT_GAME: 'minesweeper_current_game',
  DIFFICULTY: 'minesweeper_difficulty',
  HIGH_SCORES: 'minesweeper_high_scores',
  SETTINGS: 'minesweeper_settings',
  AUTO_SAVE: 'minesweeper_auto_save',
} as const;