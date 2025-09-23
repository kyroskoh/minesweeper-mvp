import { Cell, CellState, Difficulty, Position } from './types';

export class Board {
  private cells: Cell[][];
  private width: number;
  private height: number;
  private mineCount: number;

  constructor(difficulty: Difficulty, seed?: number) {
    this.width = difficulty.width;
    this.height = difficulty.height;
    this.mineCount = difficulty.mines;
    this.cells = this.initializeBoard();
    this.placeMines(seed);
    this.calculateNeighborMines();
  }

  private initializeBoard(): Cell[][] {
    const board: Cell[][] = [];
    for (let y = 0; y < this.height; y++) {
      board[y] = [];
      for (let x = 0; x < this.width; x++) {
        board[y][x] = {
          position: { x, y },
          isMine: false,
          state: CellState.HIDDEN,
          neighborMines: 0,
        };
      }
    }
    return board;
  }

  private placeMines(seed?: number): void {
    // Use seed for deterministic testing
    const random = seed ? this.seededRandom(seed) : Math.random;
    
    let minesPlaced = 0;
    const positions: Position[] = [];
    
    // Generate all possible positions
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        positions.push({ x, y });
      }
    }
    
    // Shuffle positions using Fisher-Yates algorithm
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Place mines
    for (let i = 0; i < this.mineCount && i < positions.length; i++) {
      const { x, y } = positions[i];
      this.cells[y][x].isMine = true;
      minesPlaced++;
    }
  }

  private seededRandom(seed: number): () => number {
    let state = seed;
    return function() {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  }

  private calculateNeighborMines(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.cells[y][x].isMine) {
          this.cells[y][x].neighborMines = this.getNeighborMineCount(x, y);
        }
      }
    }
  }

  private getNeighborMineCount(x: number, y: number): number {
    let count = 0;
    const neighbors = this.getNeighbors(x, y);
    
    for (const neighbor of neighbors) {
      if (this.cells[neighbor.y][neighbor.x].isMine) {
        count++;
      }
    }
    
    return count;
  }

  private getNeighbors(x: number, y: number): Position[] {
    const neighbors: Position[] = [];
    
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue; // Skip the cell itself
        
        const nx = x + dx;
        const ny = y + dy;
        
        if (this.isValidPosition(nx, ny)) {
          neighbors.push({ x: nx, y: ny });
        }
      }
    }
    
    return neighbors;
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  public getCells(): Cell[][] {
    return this.cells.map(row => row.map(cell => ({ ...cell })));
  }

  public getCell(x: number, y: number): Cell | null {
    if (!this.isValidPosition(x, y)) {
      return null;
    }
    return { ...this.cells[y][x] };
  }

  public revealCell(x: number, y: number): Position[] {
    if (!this.isValidPosition(x, y)) {
      return [];
    }

    const cell = this.cells[y][x];
    
    if (cell.state !== CellState.HIDDEN) {
      return [];
    }

    cell.state = CellState.REVEALED;
    const revealedCells: Position[] = [{ x, y }];

    // If the cell has no neighboring mines, reveal all neighbors (flood fill)
    if (!cell.isMine && cell.neighborMines === 0) {
      const neighbors = this.getNeighbors(x, y);
      
      for (const neighbor of neighbors) {
        const neighborRevealed = this.revealCell(neighbor.x, neighbor.y);
        revealedCells.push(...neighborRevealed);
      }
    }

    return revealedCells;
  }

  public toggleFlag(x: number, y: number): boolean {
    if (!this.isValidPosition(x, y)) {
      return false;
    }

    const cell = this.cells[y][x];
    
    if (cell.state === CellState.REVEALED) {
      return false;
    }

    cell.state = cell.state === CellState.FLAGGED ? CellState.HIDDEN : CellState.FLAGGED;
    return true;
  }

  public isGameWon(): boolean {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        
        // All non-mine cells must be revealed
        if (!cell.isMine && cell.state !== CellState.REVEALED) {
          return false;
        }
      }
    }
    return true;
  }

  public isGameLost(): boolean {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        
        // If any mine is revealed, game is lost
        if (cell.isMine && cell.state === CellState.REVEALED) {
          return true;
        }
      }
    }
    return false;
  }

  public revealAllMines(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.cells[y][x].isMine) {
          this.cells[y][x].state = CellState.REVEALED;
        }
      }
    }
  }

  public getFlagCount(): number {
    let count = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.cells[y][x].state === CellState.FLAGGED) {
          count++;
        }
      }
    }
    return count;
  }

  public getMineCount(): number {
    return this.mineCount;
  }

  public getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}