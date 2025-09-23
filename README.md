# 🎯 Minesweeper MVP

> **Created by [Kyros Koh](https://github.com/kyroskoh)**

A modern, fully-featured Minesweeper game built with Next.js 15, TypeScript, and Tailwind CSS. Features include match time tracking, persistent game states, and a classic color-coded number system.

## ✨ Features

### 🎮 Core Gameplay
- **Classic Minesweeper Mechanics**: Left-click to reveal, right-click to flag
- **Three Difficulty Levels**: Beginner (9×9, 10 mines), Intermediate (16×16, 40 mines), Expert (30×16, 99 mines)
- **Smart Mine Placement**: Uses seeded random generation for consistent testing
- **Flood Fill Algorithm**: Auto-reveals connected empty cells
- **Win/Loss Detection**: Automatic game state management

### ⏱️ Advanced Timing System
- **Precise Match Timing**: Millisecond-accurate timer with pause/resume functionality
- **Formatted Display**: Shows time in MM:SS format with detailed HH:MM:SS option
- **Persistent Timing**: Timer state survives page refreshes
- **Performance Tracking**: Ready for leaderboard integration

### 🎨 Enhanced UI/UX
- **Classic Color Scheme**: Traditional Minesweeper number colors (1=Blue, 2=Green, 3=Red, etc.)
- **3D Cell Effects**: Realistic button appearance with inset shadows
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live mine counter and timer display
- **Visual Feedback**: Hover effects and smooth transitions

### 💾 State Management
- **Auto-save**: Game automatically saves to localStorage
- **Resume Functionality**: Pick up exactly where you left off
- **Difficulty Persistence**: Remembers your preferred difficulty level
- **Context-based Architecture**: Clean separation of game logic and UI

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested with v24.8.0)
- npm 8+ (tested with v11.6.0)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd minesweeper-mvp

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to play the game.

### 🐳 Docker Setup

The application includes comprehensive Docker support for both development and production environments.

#### Quick Start with Docker

```bash
# Production environment
npm run docker:prod

# Development environment with hot reload
npm run docker:dev

# Stop containers
npm run docker:stop
```

#### Manual Docker Commands

```bash
# Build production image
docker build -t minesweeper-mvp .

# Run production container
docker run -p 3001:3001 minesweeper-mvp

# Using Docker Compose for production
docker-compose up --build -d

# Using Docker Compose for development
docker-compose -f docker-compose.dev.yml up --build
```

#### Docker Features
- **Multi-stage builds** for optimized production images
- **Health checks** for container monitoring
- **Non-root user** for security
- **Volume mounts** for persistent data
- **Development mode** with hot reload
- **Optimized caching** for faster builds

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start           # Start production server

# Testing
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint        # Run ESLint

# Docker
npm run docker:build # Build production Docker image
npm run docker:run   # Run production container
npm run docker:dev   # Start development environment
npm run docker:prod  # Start production environment
npm run docker:stop  # Stop all containers
npm run docker:clean # Clean up Docker resources
```

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   └── page.tsx           # Main game page
├── components/            # React components
│   ├── demo/             # Demo components
│   └── game/             # Core game UI components
├── contexts/             # React Context providers
│   ├── GameContext.tsx   # Main game state management
│   ├── GameContext.types.ts
│   └── GameContext.reducer.ts
├── hooks/                # Custom React hooks
│   └── useTimer.ts       # Timer-specific hooks
├── lib/                  # Core game logic
│   ├── minesweeper/      # Game engine
│   │   ├── Board.ts      # Board logic and mine placement
│   │   ├── Game.ts       # Game state management
│   │   ├── Timer.ts      # Precision timing system
│   │   └── types.ts      # TypeScript definitions
│   └── storage/          # Persistence layer
│       └── localStorage.ts
└── __tests__/            # Test suites
    ├── contexts/         # Context tests
    └── lib/minesweeper/  # Engine tests
```

### Core Components

#### Game Engine (`src/lib/minesweeper/`)
- **Board.ts**: Pure logic for mine placement, flood fill, and win detection
- **Game.ts**: High-level game state management and timer integration
- **Timer.ts**: Precision timing with pause/resume and formatting utilities
- **types.ts**: Comprehensive TypeScript definitions

#### React Layer (`src/contexts/`, `src/hooks/`)
- **GameContext**: Central state management using useReducer pattern
- **Custom Hooks**: Specialized hooks for timer and game statistics
- **Persistence**: Automatic localStorage integration with error handling

#### UI Components (`src/components/`)
- **MinesweeperCell**: Enhanced cell component with classic styling
- **GameBoard**: Responsive game board with proper event handling
- **Demo Components**: Full-featured game interface

## 🧪 Testing

Comprehensive test suite with 60+ tests covering:

- **Unit Tests**: Game engine logic (Board, Game, Timer)
- **Integration Tests**: React context and state management
- **Coverage**: >95% code coverage on core game logic
- **Mocking**: Date.now() mocking for consistent timer tests

```bash
# Run specific test suites
npm test Board.test.ts      # Board logic tests
npm test Game.test.ts       # Game management tests
npm test Timer.test.ts      # Timing system tests
npm test GameContext        # React context tests
```

## 🎯 Game Rules

### How to Play
1. **Left-click** any cell to reveal it
2. **Right-click** to flag/unflag suspected mines
3. **Numbers** show how many mines are adjacent to that cell
4. **Objective**: Reveal all non-mine cells without clicking on any mines
5. **Timer** starts on your first move

### Number Color System
- **1**: Blue - Easiest to spot, usually safe areas
- **2**: Green - Common in mid-game areas
- **3**: Red - Moderate complexity
- **4**: Purple - Higher complexity areas
- **5**: Brown - Dense mine areas
- **6**: Pink - Very dense areas (rare)
- **7**: Black - Extremely dense (very rare)
- **8**: Gray - Maximum density (extremely rare)

## 🔧 Technical Details

### Technology Stack
- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript 5.x with strict mode
- **Styling**: Tailwind CSS 4.x with custom components
- **State Management**: React Context + useReducer pattern
- **Testing**: Jest 30.x + React Testing Library
- **Build Tool**: Turbopack for fast development

### Performance Optimizations
- **Memoization**: useCallback and React.memo where appropriate
- **Efficient Rendering**: Minimal re-renders through careful state design
- **Lazy Loading**: Components loaded only when needed
- **Local Storage**: Efficient serialization and error handling

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari 14+, Chrome Mobile 90+
- **Features Used**: ES2017+, CSS Grid, localStorage, Context API

## 🚧 Upcoming Features

### High Priority
- [ ] **Leaderboard System**: Top 10 high scores with SQLite backend
- [ ] **API Routes**: RESTful endpoints for score management
- [ ] **Database Migration**: Scripts for localStorage → SQLite → SQL/NoSQL

### Medium Priority
- [ ] **Animations**: D3.js cell reveal effects, Three.js win celebrations
- [ ] **Mobile Enhancements**: Touch controls, long-press flagging
- [ ] **PWA Features**: Offline play, install prompts
- [ ] **Dark Mode**: Theme switching with Tailwind

### Future Enhancements
- [ ] **Custom Difficulties**: User-defined board sizes and mine counts
- [ ] **Statistics**: Win rate, average times, streak tracking
- [ ] **Sound Effects**: Optional audio feedback
- [ ] **Multiplayer**: Real-time competitive modes

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push and create a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled, no `any` types
- **Testing**: All new features require tests
- **ESLint**: Follow the existing configuration
- **Commits**: Use conventional commit messages

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

**Kyros Koh**
- GitHub: [@kyroskoh](https://github.com/kyroskoh)
- Email: me@kyroskoh.com
- Portfolio: [kyroskoh.com](https://kyroskoh.com)

## 🙏 Acknowledgments

- Inspired by the classic Windows Minesweeper
- Built with modern web technologies while preserving the classic gameplay
- Special thanks to the Next.js and React communities
- Created with passion for clean code and classic gaming experiences

---

**Enjoy playing Minesweeper! 🎮💣**

*Built with ❤️ by Kyros Koh*
