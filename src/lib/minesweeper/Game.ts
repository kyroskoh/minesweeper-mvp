import { Board } from './Board';
import { Timer } from './Timer';
import { GameState, GameStatus, Difficulty, Position } from './types';

export class Game {
  private board: Board;
  private status: GameStatus;
  private difficulty: Difficulty;
  private timer: Timer;
  private firstMove: boolean;

  constructor(difficulty: Difficulty, seed?: number) {
    this.difficulty = difficulty;
    this.board = new Board(difficulty, seed);
    this.status = GameStatus.NOT_STARTED;
    this.timer = new Timer();
    this.firstMove = true;
  }

  public reveal(x: number, y: number): Position[] {
    if (this.status === GameStatus.WON || this.status === GameStatus.LOST) {
      return [];
    }

    // Start the game on first move
    if (this.firstMove) {
      this.status = GameStatus.IN_PROGRESS;
      this.timer.start();
      this.firstMove = false;
    }

    const revealedCells = this.board.revealCell(x, y);

    // Check win/lose conditions after revealing
    this.updateGameStatus();

    return revealedCells;
  }

  public toggleFlag(x: number, y: number): boolean {
    if (this.status === GameStatus.WON || this.status === GameStatus.LOST) {
      return false;
    }

    return this.board.toggleFlag(x, y);
  }

  public reset(difficulty?: Difficulty, seed?: number): void {
    this.difficulty = difficulty || this.difficulty;
    this.board = new Board(this.difficulty, seed);
    this.status = GameStatus.NOT_STARTED;
    this.timer.reset();
    this.firstMove = true;
  }

  private updateGameStatus(): void {
    if (this.board.isGameLost()) {
      this.status = GameStatus.LOST;
      this.timer.stop();
      this.board.revealAllMines();
    } else if (this.board.isGameWon()) {
      this.status = GameStatus.WON;
      this.timer.stop();
    }
  }

  public getState(): GameState {
    return {
      board: this.board.getCells(),
      status: this.status,
      difficulty: this.difficulty,
      startTime: this.timer.getState().startTime,
      endTime: this.timer.getState().endTime,
      flagsUsed: this.board.getFlagCount(),
      firstMove: this.firstMove,
    };
  }

  public getGameTime(): number {
    return this.timer.getElapsedSeconds();
  }

  public getGameTimeMs(): number {
    return this.timer.getElapsedMs();
  }

  public getFormattedTime(): string {
    return this.timer.getFormattedTime();
  }

  public getDetailedFormattedTime(): string {
    return this.timer.getDetailedFormattedTime();
  }

  public pauseTimer(): void {
    this.timer.pause();
  }

  public resumeTimer(): void {
    this.timer.resume();
  }

  public isTimerRunning(): boolean {
    return this.timer.isRunning();
  }

  public getRemainingMines(): number {
    return this.board.getMineCount() - this.board.getFlagCount();
  }

  public getStatus(): GameStatus {
    return this.status;
  }

  public getDifficulty(): Difficulty {
    return this.difficulty;
  }

  public getDimensions(): { width: number; height: number } {
    return this.board.getDimensions();
  }

  public isFirstMove(): boolean {
    return this.firstMove;
  }

  // Method to restore game state (useful for loading from localStorage)
  public static fromState(state: GameState, seed?: number): Game {
    const game = new Game(state.difficulty, seed);
    
    // Restore basic properties
    game.status = state.status;
    game.timer = Timer.fromState({
      startTime: state.startTime,
      endTime: state.endTime ?? null,
    });
    game.firstMove = state.firstMove;

    // Note: We cannot easily restore the exact board state without implementing
    // a more complex serialization system. For now, we'll create a new board.
    // In a real application, you might want to serialize the entire board state.
    
    return game;
  }

  // Serialize game state for persistence
  public serialize(): string {
    return JSON.stringify(this.getState());
  }

  // Check if the game is in progress
  public isInProgress(): boolean {
    return this.status === GameStatus.IN_PROGRESS;
  }

  // Check if the game is finished (won or lost)
  public isFinished(): boolean {
    return this.status === GameStatus.WON || this.status === GameStatus.LOST;
  }
}