import { Timer } from '@/lib/minesweeper/Timer';

// Mock Date.now() for consistent timing tests
const mockDateNow = jest.spyOn(Date, 'now');

describe('Timer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockDateNow.mockRestore();
  });

  describe('initialization', () => {
    test('should create a timer with initial state', () => {
      const timer = new Timer();
      const state = timer.getState();

      expect(state.startTime).toBeNull();
      expect(state.endTime).toBeNull();
      expect(state.pausedTime).toBe(0);
      expect(state.isPaused).toBe(false);
      expect(state.isRunning).toBe(false);
      expect(state.elapsedMs).toBe(0);
      expect(state.elapsedSeconds).toBe(0);
    });
  });

  describe('basic operations', () => {
    test('should start timer', () => {
      const startTime = 1000000;
      mockDateNow.mockReturnValue(startTime);

      const timer = new Timer();
      timer.start();

      expect(timer.isRunning()).toBe(true);
      expect(timer.getState().startTime).toBe(startTime);
    });

    test('should stop timer', () => {
      const startTime = 1000000;
      const stopTime = startTime + 5000;

      mockDateNow
        .mockReturnValueOnce(startTime)
        .mockReturnValueOnce(stopTime);

      const timer = new Timer();
      timer.start();
      timer.stop();

      expect(timer.isStopped()).toBe(true);
      expect(timer.isRunning()).toBe(false);
      expect(timer.getElapsedSeconds()).toBe(5);
    });

    test('should reset timer', () => {
      const startTime = 1000000;
      mockDateNow.mockReturnValue(startTime);

      const timer = new Timer();
      timer.start();
      timer.reset();

      const state = timer.getState();
      expect(state.startTime).toBeNull();
      expect(state.endTime).toBeNull();
      expect(state.isRunning).toBe(false);
      expect(state.elapsedSeconds).toBe(0);
    });
  });

  describe('pause and resume', () => {
    test('should pause timer', () => {
      const startTime = 1000000;
      const pauseTime = startTime + 3000;

      mockDateNow
        .mockReturnValueOnce(startTime)
        .mockReturnValueOnce(pauseTime);

      const timer = new Timer();
      timer.start();
      timer.pause();

      expect(timer.isPausedState()).toBe(true);
      expect(timer.isRunning()).toBe(false);
      expect(timer.getElapsedSeconds()).toBe(3);
    });

    test('should resume timer after pause', () => {
      const startTime = 1000000;
      const pauseTime = startTime + 2000;
      const resumeTime = pauseTime + 5000; // 5 seconds paused
      const checkTime = resumeTime + 3000; // 3 seconds after resume

      mockDateNow
        .mockReturnValueOnce(startTime)  // Start
        .mockReturnValueOnce(pauseTime)  // Pause
        .mockReturnValueOnce(resumeTime) // Resume
        .mockReturnValue(checkTime);     // Check elapsed time

      const timer = new Timer();
      timer.start();
      timer.pause();
      timer.resume();

      expect(timer.isRunning()).toBe(true);
      expect(timer.isPausedState()).toBe(false);
      // Should be 2 seconds (before pause) + 3 seconds (after resume) = 5 seconds
      expect(timer.getElapsedSeconds()).toBe(5);
    });

    test('should handle multiple pause/resume cycles', () => {
      const startTime = 1000000;
      
      mockDateNow
        .mockReturnValueOnce(startTime)        // Start
        .mockReturnValueOnce(startTime + 1000) // First pause (1s)
        .mockReturnValueOnce(startTime + 3000) // First resume (2s paused)
        .mockReturnValueOnce(startTime + 5000) // Second pause (2s more running)
        .mockReturnValueOnce(startTime + 8000) // Second resume (3s paused)
        .mockReturnValue(startTime + 10000);   // Final check (2s more running)

      const timer = new Timer();
      timer.start();           // t=0
      timer.pause();          // t=1, elapsed=1
      timer.resume();         // t=3, paused for 2s
      timer.pause();          // t=5, elapsed=1+2=3
      timer.resume();         // t=8, paused for 3s more
      // At t=10, elapsed should be 1+2+2=5 seconds

      expect(timer.getElapsedSeconds()).toBe(5);
    });
  });

  describe('time calculations', () => {
    test('should calculate elapsed time in milliseconds', () => {
      const startTime = 1000000;
      const currentTime = startTime + 2500; // 2.5 seconds

      mockDateNow
        .mockReturnValueOnce(startTime)
        .mockReturnValue(currentTime);

      const timer = new Timer();
      timer.start();

      expect(timer.getElapsedMs()).toBe(2500);
    });

    test('should calculate elapsed time in seconds', () => {
      const startTime = 1000000;
      const currentTime = startTime + 7500; // 7.5 seconds

      mockDateNow
        .mockReturnValueOnce(startTime)
        .mockReturnValue(currentTime);

      const timer = new Timer();
      timer.start();

      expect(timer.getElapsedSeconds()).toBe(7);
    });

    test('should return 0 elapsed time when not started', () => {
      const timer = new Timer();

      expect(timer.getElapsedMs()).toBe(0);
      expect(timer.getElapsedSeconds()).toBe(0);
    });
  });

  describe('time formatting', () => {
    test('should format time as MM:SS', () => {
      const startTime = 1000000;
      const currentTime = startTime + 125000; // 125 seconds (2:05)

      mockDateNow
        .mockReturnValueOnce(startTime)
        .mockReturnValue(currentTime);

      const timer = new Timer();
      timer.start();

      expect(timer.getFormattedTime()).toBe('02:05');
    });

    test('should format time with hours as HH:MM:SS', () => {
      const startTime = 1000000;
      const currentTime = startTime + 3665000; // 3665 seconds (1:01:05)

      mockDateNow
        .mockReturnValueOnce(startTime)
        .mockReturnValue(currentTime);

      const timer = new Timer();
      timer.start();

      expect(timer.getDetailedFormattedTime()).toBe('01:01:05');
    });

    test('should format time without hours when under 1 hour', () => {
      const startTime = 1000000;
      const currentTime = startTime + 1865000; // 1865 seconds (31:05)

      mockDateNow
        .mockReturnValueOnce(startTime)
        .mockReturnValue(currentTime);

      const timer = new Timer();
      timer.start();

      expect(timer.getDetailedFormattedTime()).toBe('31:05');
    });

    test('should format static seconds correctly', () => {
      expect(Timer.formatSeconds(65)).toBe('01:05');
      expect(Timer.formatSeconds(3661)).toBe('61:01');
      expect(Timer.formatSeconds(0)).toBe('00:00');
    });

    test('should format static milliseconds correctly', () => {
      expect(Timer.formatMs(65000)).toBe('01:05');
      expect(Timer.formatMs(3661500)).toBe('61:01'); // Rounded down
    });
  });

  describe('state management', () => {
    test('should create timer from state', () => {
      const state = {
        startTime: 1000000,
        endTime: 1005000,
        pausedTime: 1000,
        isPaused: false,
      };

      const timer = Timer.fromState(state);
      const timerState = timer.getState();

      expect(timerState.startTime).toBe(1000000);
      expect(timerState.endTime).toBe(1005000);
      expect(timerState.pausedTime).toBe(1000);
      expect(timerState.isPaused).toBe(false);
    });

    test('should handle partial state restoration', () => {
      const state = {
        startTime: 1000000,
        endTime: null,
      };

      const timer = Timer.fromState(state);
      const timerState = timer.getState();

      expect(timerState.startTime).toBe(1000000);
      expect(timerState.endTime).toBeNull();
      expect(timerState.pausedTime).toBe(0);
      expect(timerState.isPaused).toBe(false);
    });
  });

  describe('time comparison', () => {
    test('should compare times correctly', () => {
      expect(Timer.compareTimes(100, 200)).toBeLessThan(0); // 100 is better (faster)
      expect(Timer.compareTimes(200, 100)).toBeGreaterThan(0); // 200 is worse (slower)
      expect(Timer.compareTimes(100, 100)).toBe(0); // Equal
    });
  });
});