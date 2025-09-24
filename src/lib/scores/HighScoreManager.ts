/**
 * Minesweeper MVP - High Score Management System
 * 
 * Manages the top 10 scores for each difficulty level with
 * persistence through localStorage.
 * 
 * @author Kyros Koh
 * @version 1.0.0
 * @created 2025-09-24
 */
import { v4 as uuidv4 } from 'uuid';
import { Score, DifficultyKey } from '@/lib/minesweeper/types';
import { localStorageManager, STORAGE_KEYS } from '@/lib/storage/localStorage';

// Maximum number of high scores to keep per difficulty
const MAX_HIGH_SCORES = 10;

export class HighScoreManager {
  private static instance: HighScoreManager;
  
  private constructor() {}
  
  public static getInstance(): HighScoreManager {
    if (!HighScoreManager.instance) {
      HighScoreManager.instance = new HighScoreManager();
    }
    return HighScoreManager.instance;
  }

  /**
   * Add a new score and return true if it's a high score
   */
  public addScore(playerName: string, time: number, difficulty: DifficultyKey): boolean {
    const scores = this.getScores(difficulty);
    const newScore: Score = {
      id: uuidv4(),
      playerName,
      time,
      difficulty,
      date: new Date().toISOString()
    };

    // Check if this is a high score
    const isHighScore = this.isHighScore(time, difficulty);

    if (isHighScore) {
      // Add the new score
      scores.push(newScore);
      
      // Sort by time (ascending - faster times are better)
      scores.sort((a, b) => a.time - b.time);
      
      // Keep only the top MAX_HIGH_SCORES
      const topScores = scores.slice(0, MAX_HIGH_SCORES);
      
      // Save back to storage
      this.saveScores(difficulty, topScores);
    }

    return isHighScore;
  }

  /**
   * Check if a time qualifies as a high score
   */
  public isHighScore(time: number, difficulty: DifficultyKey): boolean {
    const scores = this.getScores(difficulty);
    
    // If we have fewer than MAX_HIGH_SCORES, it's automatically a high score
    if (scores.length < MAX_HIGH_SCORES) {
      return true;
    }
    
    // Otherwise, check if it's better than the worst high score
    const worstHighScore = scores[scores.length - 1];
    return time < worstHighScore.time;
  }

  /**
   * Get all high scores for a difficulty level
   */
  public getScores(difficulty: DifficultyKey): Score[] {
    const storageKey = `${STORAGE_KEYS.HIGH_SCORES}_${difficulty}`;
    return localStorageManager.loadPreference<Score[]>(storageKey, []);
  }

  /**
   * Get the best score for a difficulty level
   */
  public getBestScore(difficulty: DifficultyKey): Score | null {
    const scores = this.getScores(difficulty);
    return scores.length > 0 ? scores[0] : null;
  }

  /**
   * Save scores to storage
   */
  private saveScores(difficulty: DifficultyKey, scores: Score[]): void {
    const storageKey = `${STORAGE_KEYS.HIGH_SCORES}_${difficulty}`;
    localStorageManager.savePreference(storageKey, scores);
  }

  /**
   * Clear all high scores for a difficulty level
   */
  public clearScores(difficulty: DifficultyKey): void {
    const storageKey = `${STORAGE_KEYS.HIGH_SCORES}_${difficulty}`;
    localStorageManager.savePreference(storageKey, []);
  }

  /**
   * Clear all high scores
   */
  public clearAllScores(): void {
    this.clearScores('BEGINNER');
    this.clearScores('INTERMEDIATE');
    this.clearScores('EXPERT');
  }
}

// Export singleton instance for easy usage
export const highScoreManager = HighScoreManager.getInstance();