import { Board } from '@/lib/minesweeper/Board';
import { CellState, DIFFICULTIES } from '@/lib/minesweeper/types';

describe('Board', () => {
  const testDifficulty = DIFFICULTIES.BEGINNER;
  const testSeed = 12345;

  describe('initialization', () => {
    test('should create a board with correct dimensions', () => {
      const board = new Board(testDifficulty);
      const dimensions = board.getDimensions();
      
      expect(dimensions.width).toBe(testDifficulty.width);
      expect(dimensions.height).toBe(testDifficulty.height);
    });

    test('should place correct number of mines', () => {
      const board = new Board(testDifficulty, testSeed);
      const cells = board.getCells();
      
      let mineCount = 0;
      for (let y = 0; y < testDifficulty.height; y++) {
        for (let x = 0; x < testDifficulty.width; x++) {
          if (cells[y][x].isMine) {
            mineCount++;
          }
        }
      }
      
      expect(mineCount).toBe(testDifficulty.mines);
      expect(board.getMineCount()).toBe(testDifficulty.mines);
    });

    test('should initialize all cells as hidden', () => {
      const board = new Board(testDifficulty);
      const cells = board.getCells();
      
      for (let y = 0; y < testDifficulty.height; y++) {
        for (let x = 0; x < testDifficulty.width; x++) {
          expect(cells[y][x].state).toBe(CellState.HIDDEN);
        }
      }
    });

    test('should calculate neighbor mines correctly', () => {
      const board = new Board(testDifficulty, testSeed);
      const cells = board.getCells();
      
      // Test a specific cell's neighbor count
      // This is deterministic due to the seed
      const testCell = cells[0][0];
      if (!testCell.isMine) {
        expect(typeof testCell.neighborMines).toBe('number');
        expect(testCell.neighborMines).toBeGreaterThanOrEqual(0);
        expect(testCell.neighborMines).toBeLessThanOrEqual(8);
      }
    });
  });

  describe('cell operations', () => {
    test('should reveal a cell', () => {
      const board = new Board(testDifficulty, testSeed);
      const revealedPositions = board.revealCell(0, 0);
      
      expect(revealedPositions.length).toBeGreaterThan(0);
      
      const cell = board.getCell(0, 0);
      expect(cell?.state).toBe(CellState.REVEALED);
    });

    test('should not reveal already revealed cell', () => {
      const board = new Board(testDifficulty, testSeed);
      
      // Reveal once
      const firstReveal = board.revealCell(0, 0);
      expect(firstReveal.length).toBeGreaterThan(0);
      
      // Try to reveal again
      const secondReveal = board.revealCell(0, 0);
      expect(secondReveal.length).toBe(0);
    });

    test('should toggle flag on hidden cell', () => {
      const board = new Board(testDifficulty);
      
      const flagged = board.toggleFlag(0, 0);
      expect(flagged).toBe(true);
      
      const cell = board.getCell(0, 0);
      expect(cell?.state).toBe(CellState.FLAGGED);
      
      // Toggle back
      const unflagged = board.toggleFlag(0, 0);
      expect(unflagged).toBe(true);
      
      const cellAfterToggle = board.getCell(0, 0);
      expect(cellAfterToggle?.state).toBe(CellState.HIDDEN);
    });

    test('should not flag revealed cell', () => {
      const board = new Board(testDifficulty, testSeed);
      
      board.revealCell(0, 0);
      const flagged = board.toggleFlag(0, 0);
      
      expect(flagged).toBe(false);
    });

    test('should handle invalid positions', () => {
      const board = new Board(testDifficulty);
      
      expect(board.getCell(-1, 0)).toBeNull();
      expect(board.getCell(0, -1)).toBeNull();
      expect(board.getCell(testDifficulty.width, 0)).toBeNull();
      expect(board.getCell(0, testDifficulty.height)).toBeNull();
      
      expect(board.revealCell(-1, 0)).toEqual([]);
      expect(board.toggleFlag(-1, 0)).toBe(false);
    });
  });

  describe('flood fill', () => {
    test('should reveal multiple cells when revealing empty cell', () => {
      // Use a specific seed that creates empty areas
      const board = new Board(testDifficulty, 999);
      
      // Find a cell with 0 neighboring mines
      const cells = board.getCells();
      let emptyCell: { x: number; y: number } | null = null;
      
      for (let y = 0; y < testDifficulty.height; y++) {
        for (let x = 0; x < testDifficulty.width; x++) {
          if (!cells[y][x].isMine && cells[y][x].neighborMines === 0) {
            emptyCell = { x, y };
            break;
          }
        }
        if (emptyCell) break;
      }
      
      if (emptyCell) {
        const revealedPositions = board.revealCell(emptyCell.x, emptyCell.y);
        expect(revealedPositions.length).toBeGreaterThan(1);
      }
    });
  });

  describe('game state checks', () => {
    test('should detect game loss when mine is revealed', () => {
      const board = new Board(testDifficulty, testSeed);
      
      // Find a mine and reveal it
      const cells = board.getCells();
      let minePosition: { x: number; y: number } | null = null;
      
      for (let y = 0; y < testDifficulty.height; y++) {
        for (let x = 0; x < testDifficulty.width; x++) {
          if (cells[y][x].isMine) {
            minePosition = { x, y };
            break;
          }
        }
        if (minePosition) break;
      }
      
      expect(minePosition).not.toBeNull();
      
      if (minePosition) {
        expect(board.isGameLost()).toBe(false);
        board.revealCell(minePosition.x, minePosition.y);
        expect(board.isGameLost()).toBe(true);
      }
    });

    test('should detect game win when all non-mines are revealed', () => {
      const board = new Board(testDifficulty, testSeed);
      const cells = board.getCells();
      
      // Reveal all non-mine cells
      for (let y = 0; y < testDifficulty.height; y++) {
        for (let x = 0; x < testDifficulty.width; x++) {
          if (!cells[y][x].isMine) {
            board.revealCell(x, y);
          }
        }
      }
      
      expect(board.isGameWon()).toBe(true);
    });

    test('should reveal all mines when game is lost', () => {
      const board = new Board(testDifficulty, testSeed);
      
      board.revealAllMines();
      
      const cells = board.getCells();
      for (let y = 0; y < testDifficulty.height; y++) {
        for (let x = 0; x < testDifficulty.width; x++) {
          if (cells[y][x].isMine) {
            expect(cells[y][x].state).toBe(CellState.REVEALED);
          }
        }
      }
    });
  });

  describe('flag count', () => {
    test('should track flag count correctly', () => {
      const board = new Board(testDifficulty);
      
      expect(board.getFlagCount()).toBe(0);
      
      board.toggleFlag(0, 0);
      expect(board.getFlagCount()).toBe(1);
      
      board.toggleFlag(0, 1);
      expect(board.getFlagCount()).toBe(2);
      
      board.toggleFlag(0, 0); // Remove first flag
      expect(board.getFlagCount()).toBe(1);
    });
  });
});