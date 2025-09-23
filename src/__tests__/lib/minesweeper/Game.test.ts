import { Game } from '@/lib/minesweeper/Game';
import { GameStatus, DIFFICULTIES } from '@/lib/minesweeper/types';

// Mock Date.now() for consistent timing tests
const mockDateNow = jest.spyOn(Date, 'now');

describe('Game', () => {
  const testDifficulty = DIFFICULTIES.BEGINNER;
  const testSeed = 12345;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockDateNow.mockRestore();
  });

  describe('initialization', () => {
    test('should create a game with correct initial state', () => {
      const game = new Game(testDifficulty, testSeed);
      const state = game.getState();

      expect(state.status).toBe(GameStatus.NOT_STARTED);
      expect(state.difficulty).toEqual(testDifficulty);
      expect(state.startTime).toBeNull();
      expect(state.endTime).toBeNull();
      expect(state.firstMove).toBe(true);
      expect(state.flagsUsed).toBe(0);
    });

    test('should have correct dimensions', () => {
      const game = new Game(testDifficulty);
      const dimensions = game.getDimensions();

      expect(dimensions.width).toBe(testDifficulty.width);
      expect(dimensions.height).toBe(testDifficulty.height);
    });
  });

  describe('game timing', () => {
    test('should start timer on first move', () => {
      const startTime = 1000000;
      mockDateNow.mockReturnValue(startTime);

      const game = new Game(testDifficulty, testSeed);
      
      expect(game.getGameTime()).toBe(0);
      expect(game.isFirstMove()).toBe(true);

      // First reveal should start the timer
      game.reveal(0, 0);
      
      expect(game.isFirstMove()).toBe(false);
      expect(game.getState().startTime).toBe(startTime);
      expect(game.getStatus()).toBe(GameStatus.IN_PROGRESS);
    });

    test('should calculate game time correctly during gameplay', () => {
      const startTime = 1000000;
      const currentTime = startTime + 30000; // 30 seconds later

      mockDateNow
        .mockReturnValueOnce(startTime) // First move
        .mockReturnValue(currentTime);  // Current time check

      const game = new Game(testDifficulty, testSeed);
      game.reveal(0, 0); // Start the game

      const gameTime = game.getGameTime();
      expect(gameTime).toBe(30); // 30 seconds
    });

    test('should stop timer when game is won', () => {
      const startTime = 1000000;
      const endTime = startTime + 45000; // 45 seconds later

      mockDateNow
        .mockReturnValueOnce(startTime) // First move
        .mockReturnValueOnce(endTime);  // Game end

      const game = new Game(testDifficulty, testSeed);
      
      // Simulate winning the game
      const state = game.getState();
      const cells = state.board;
      
      // Reveal all non-mine cells to win
      for (let y = 0; y < testDifficulty.height; y++) {
        for (let x = 0; x < testDifficulty.width; x++) {
          if (!cells[y][x].isMine) {
            game.reveal(x, y);
          }
        }
      }

      expect(game.getStatus()).toBe(GameStatus.WON);
      expect(game.getState().endTime).toBe(endTime);
      expect(game.isFinished()).toBe(true);
    });

    test('should stop timer when game is lost', () => {
      const startTime = 1000000;
      const endTime = startTime + 15000; // 15 seconds later

      mockDateNow
        .mockReturnValueOnce(startTime) // First move
        .mockReturnValueOnce(endTime);  // Game end

      const game = new Game(testDifficulty, testSeed);
      const state = game.getState();
      const cells = state.board;
      
      // Find a mine and reveal it to lose
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

      if (minePosition) {
        game.reveal(minePosition.x, minePosition.y);
        
        expect(game.getStatus()).toBe(GameStatus.LOST);
        expect(game.getState().endTime).toBe(endTime);
        expect(game.isFinished()).toBe(true);
      }
    });

    test('should return final time after game ends', () => {
      const startTime = 1000000;
      const endTime = startTime + 60000; // 60 seconds
      const currentTime = endTime + 10000; // 10 seconds after game ended

      mockDateNow
        .mockReturnValueOnce(startTime) // First move
        .mockReturnValueOnce(endTime)   // Game end
        .mockReturnValue(currentTime);  // Time check after game ended

      const game = new Game(testDifficulty, testSeed);
      const state = game.getState();
      const cells = state.board;

      // Find a mine and reveal it
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

      if (minePosition) {
        game.reveal(minePosition.x, minePosition.y);
        
        // Game time should be frozen at end time, not continue counting
        expect(game.getGameTime()).toBe(60);
      }
    });
  });

  describe('game mechanics', () => {
    test('should handle cell revealing', () => {
      const game = new Game(testDifficulty, testSeed);
      
      const revealedPositions = game.reveal(0, 0);
      expect(revealedPositions.length).toBeGreaterThan(0);
    });

    test('should handle flagging', () => {
      const game = new Game(testDifficulty);
      
      expect(game.toggleFlag(0, 0)).toBe(true);
      expect(game.getState().flagsUsed).toBe(1);
      
      expect(game.toggleFlag(0, 0)).toBe(true); // Unflag
      expect(game.getState().flagsUsed).toBe(0);
    });

    test('should calculate remaining mines correctly', () => {
      const game = new Game(testDifficulty);
      
      expect(game.getRemainingMines()).toBe(testDifficulty.mines);
      
      game.toggleFlag(0, 0);
      expect(game.getRemainingMines()).toBe(testDifficulty.mines - 1);
    });

    test('should prevent actions after game ends', () => {
      const game = new Game(testDifficulty, testSeed);
      const state = game.getState();
      const cells = state.board;
      
      // Find a mine and reveal it to end the game
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

      if (minePosition) {
        game.reveal(minePosition.x, minePosition.y);
        
        // Should not allow further moves
        expect(game.reveal(0, 0)).toEqual([]);
        expect(game.toggleFlag(1, 1)).toBe(false);
      }
    });
  });

  describe('game reset', () => {
    test('should reset game state', () => {
      mockDateNow.mockReturnValue(1000000);
      
      const game = new Game(testDifficulty, testSeed);
      
      // Make a move
      game.reveal(0, 0);
      game.toggleFlag(1, 1);
      
      expect(game.isFirstMove()).toBe(false);
      expect(game.getStatus()).toBe(GameStatus.IN_PROGRESS);
      
      // Reset the game
      game.reset();
      
      const resetState = game.getState();
      expect(resetState.status).toBe(GameStatus.NOT_STARTED);
      expect(resetState.startTime).toBeNull();
      expect(resetState.endTime).toBeNull();
      expect(resetState.firstMove).toBe(true);
      expect(resetState.flagsUsed).toBe(0);
    });

    test('should reset with different difficulty', () => {
      const game = new Game(testDifficulty);
      const newDifficulty = DIFFICULTIES.INTERMEDIATE;
      
      game.reset(newDifficulty);
      
      expect(game.getDifficulty()).toEqual(newDifficulty);
      expect(game.getDimensions().width).toBe(newDifficulty.width);
      expect(game.getDimensions().height).toBe(newDifficulty.height);
    });
  });

  describe('serialization', () => {
    test('should serialize game state', () => {
      const game = new Game(testDifficulty, testSeed);
      const serialized = game.serialize();
      
      expect(typeof serialized).toBe('string');
      
      const parsed = JSON.parse(serialized);
      expect(parsed.difficulty).toEqual(testDifficulty);
      expect(parsed.status).toBe(GameStatus.NOT_STARTED);
    });

    test('should create game from state', () => {
      const originalGame = new Game(testDifficulty, testSeed);
      const state = originalGame.getState();
      
      const restoredGame = Game.fromState(state);
      
      expect(restoredGame.getDifficulty()).toEqual(testDifficulty);
      expect(restoredGame.getStatus()).toBe(GameStatus.NOT_STARTED);
    });
  });
});