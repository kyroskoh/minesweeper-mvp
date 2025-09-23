/**
 * Minesweeper MVP - Precision Timer System
 * 
 * Advanced timing functionality with millisecond accuracy,
 * pause/resume capabilities, and multiple formatting options.
 * 
 * @author Kyros Koh
 * @version 1.0.0
 * @created 2025-09-23
 */
export class Timer {
  private startTime: number | null = null;
  private endTime: number | null = null;
  private pausedTime: number = 0;
  private isPaused: boolean = false;

  constructor() {
    // Initialize state without calling reset to avoid Date.now() calls
    this.startTime = null;
    this.endTime = null;
    this.pausedTime = 0;
    this.isPaused = false;
  }

  /**
   * Start the timer
   */
  public start(): void {
    if (this.startTime === null) {
      this.startTime = Date.now();
    } else if (this.isPaused) {
      // Resume from pause
      this.pausedTime += Date.now() - (this.endTime || 0);
      this.isPaused = false;
      this.endTime = null;
    }
  }

  /**
   * Stop the timer permanently
   */
  public stop(): void {
    if (this.startTime && !this.endTime) {
      this.endTime = Date.now();
      this.isPaused = false;
    }
  }

  /**
   * Pause the timer (can be resumed)
   */
  public pause(): void {
    if (this.startTime && !this.isPaused && !this.endTime) {
      this.endTime = Date.now();
      this.isPaused = true;
    }
  }

  /**
   * Resume the timer from pause
   */
  public resume(): void {
    if (this.isPaused) {
      this.start();
    }
  }

  /**
   * Reset the timer to initial state
   */
  public reset(): void {
    this.startTime = null;
    this.endTime = null;
    this.pausedTime = 0;
    this.isPaused = false;
  }

  /**
   * Get elapsed time in milliseconds
   */
  public getElapsedMs(): number {
    if (!this.startTime) return 0;
    
    const endTime = this.endTime || Date.now();
    return Math.max(0, endTime - this.startTime - this.pausedTime);
  }

  /**
   * Get elapsed time in seconds
   */
  public getElapsedSeconds(): number {
    return Math.floor(this.getElapsedMs() / 1000);
  }

  /**
   * Get formatted time string (MM:SS)
   */
  public getFormattedTime(): string {
    const totalSeconds = this.getElapsedSeconds();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get detailed formatted time string (HH:MM:SS)
   */
  public getDetailedFormattedTime(): string {
    const totalSeconds = this.getElapsedSeconds();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Check if timer is running
   */
  public isRunning(): boolean {
    return this.startTime !== null && !this.isPaused && this.endTime === null;
  }

  /**
   * Check if timer is paused
   */
  public isPausedState(): boolean {
    return this.isPaused;
  }

  /**
   * Check if timer is stopped
   */
  public isStopped(): boolean {
    return this.endTime !== null && !this.isPaused;
  }

  /**
   * Get timer state
   */
  public getState(): {
    startTime: number | null;
    endTime: number | null;
    pausedTime: number;
    isPaused: boolean;
    isRunning: boolean;
    elapsedMs: number;
    elapsedSeconds: number;
  } {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      pausedTime: this.pausedTime,
      isPaused: this.isPaused,
      isRunning: this.isRunning(),
      elapsedMs: this.getElapsedMs(),
      elapsedSeconds: this.getElapsedSeconds(),
    };
  }

  /**
   * Create timer from existing state (for persistence)
   */
  public static fromState(state: {
    startTime: number | null;
    endTime: number | null;
    pausedTime?: number;
    isPaused?: boolean;
  }): Timer {
    const timer = new Timer();
    timer.startTime = state.startTime;
    timer.endTime = state.endTime;
    timer.pausedTime = state.pausedTime || 0;
    timer.isPaused = state.isPaused || false;
    return timer;
  }

  /**
   * Get best time comparison
   */
  public static compareTimes(time1: number, time2: number): number {
    // Returns negative if time1 is better (faster)
    // Returns positive if time2 is better (faster)
    // Returns 0 if equal
    return time1 - time2;
  }

  /**
   * Format time from seconds to MM:SS string
   */
  public static formatSeconds(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Format time from milliseconds to MM:SS string
   */
  public static formatMs(milliseconds: number): string {
    return Timer.formatSeconds(Math.floor(milliseconds / 1000));
  }
}