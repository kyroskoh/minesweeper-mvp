# 🎯 Minesweeper MVP

> **Created by [Kyros Koh](https://github.com/kyroskoh)**

A modern, fully-featured Minesweeper game built with Next.js 15, TypeScript, and Tailwind CSS. Features include match time tracking, persistent game states, high scores, and a classic color-coded number system.

## ✨ Features

### 🎮 Core Gameplay
- **Classic Minesweeper Mechanics**: Left-click to reveal, right-click to flag
- **Mobile-Friendly Controls**: Long press to flag on smartphones/tablets
- **Long Press to Flag**: Hold down on a cell to quickly place a flag (mobile & desktop)
- **Three Difficulty Levels**: Beginner (9×9, 10 mines), Intermediate (16×16, 40 mines), Expert (30×16, 99 mines)
- **Smart Mine Placement**: Uses seeded random generation for consistent testing
- **Flood Fill Algorithm**: Auto-reveals connected empty cells
- **Win/Loss Detection**: Automatic game state management
- **Highlighted Triggered Mine**: Yellow background shows which mine caused the game to end

### 🏆 High Score System
- **Top 10 Leaderboards**: Separate high score tables for each difficulty level
- **Persistent Scores**: High scores saved to localStorage
- **Player Names**: Enter your name when you achieve a high score with automatic input focus
- **Name Validation**: Prevents empty submissions and provides clear feedback
- **Keyboard Support**: Press Enter to submit your name for high scores
- **Sorted Rankings**: Automatically sorts by fastest completion time
- **Tabbed Interface**: Easy navigation between difficulty leaderboards
- **Accessible Design**: High-contrast UI with proper color schemes for readability

### ⏱️ Advanced Timing System
- **Precise Match Timing**: Millisecond-accurate timer with pause/resume functionality
- **Formatted Display**: Shows time in MM:SS format with detailed HH:MM:SS option
- **Persistent Timing**: Timer state survives page refreshes
- **Auto-Resume**: Timer automatically resumes when user interacts with paused game

### 🎨 Enhanced UI/UX
- **Classic Color Scheme**: Traditional Minesweeper number colors (1=Blue, 2=Green, 3=Red, etc.)
- **3D Cell Effects**: Realistic button appearance with inset shadows
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive Controls**: Right-click on desktop, long-press on mobile for flagging
- **Real-time Updates**: Live mine counter and timer display
- **Visual Feedback**: Hover effects, smooth transitions, and visual indicators during long press

### 💾 State Management
- **Auto-save**: Game automatically saves to localStorage
- **Resume Functionality**: Pick up exactly where you left off
- **Difficulty Persistence**: Remembers your preferred difficulty level
- **Context-based Architecture**: Clean separation of game logic and UI
- **Simplified State**: Streamlined state management for better performance

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

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3001](http://localhost:3001) to play the game.

### 🛠️ Build & Production

The project has been optimized for production deployment:

- ✅ **Production Build**: Fully tested and working
- ✅ **Static Generation**: All pages pre-rendered for optimal performance
- ✅ **Type Safety**: Strict TypeScript compilation passes
- ✅ **Bundle Optimization**: Minimal JavaScript payload (6.94 kB main route)
- ✅ **Dependencies**: All required packages including `critters` for CSS optimization

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
│       ├── HighScoreButton.tsx  # High score access button
│       └── HighScoreModal.tsx   # High score display modal
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
│   ├── scores/           # High score management
│   │   └── HighScoreManager.ts # High score tracking system
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

#### High Score System (`src/lib/scores/`)
- **HighScoreManager.ts**: Manages top 10 scores for each difficulty level
- **Score Interface**: Tracks player name, time, difficulty, and date

#### React Layer (`src/contexts/`, `src/hooks/`)
- **GameContext**: Central state management using useReducer pattern
- **Custom Hooks**: Specialized hooks for timer and game statistics
- **Persistence**: Automatic localStorage integration with error handling

#### UI Components (`src/components/`)
- **MinesweeperCell**: Enhanced cell component with classic styling and long-press support
- **GameBoard**: Responsive game board with proper event handling
- **HighScoreModal**: Tabbed interface for viewing high scores by difficulty with accessible design
- **HighScoreButton**: Button to access the high score leaderboard
- **Demo Components**: Full-featured game interface with responsive mobile controls

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

## 📱 Mobile Controls

### Touch-Friendly Interface
The game includes intuitive ways to interact on mobile devices with enhanced proxy compatibility:

- **Tap**: Simply tap cells to reveal them (normal gameplay)
- **Long Press**: Hold down on any cell for 500ms to place or remove a flag
- **Visual Indicators**: Cells show orange ring highlights during long press
- **Haptic Feedback**: Vibration feedback when flag is placed (if supported)
- **Movement Tolerance**: 10px movement threshold prevents accidental cancellation
- **Proxy Optimization**: Works reliably behind nginx reverse proxies
- **Responsive Design**: Button size and position optimized for different screen sizes

### Enhanced Mobile Experience
1. **Tap** cells to reveal them (normal gameplay)
2. **Long press** on any cell to place or remove a flag  
3. **Visual Feedback**: Orange highlight appears during long press with precise timing
4. **Haptic Feedback**: Feel vibration when flag is placed (modern browsers)
5. **Movement Detection**: Long press cancels if finger moves more than 10 pixels
6. **Proxy Resilient**: Dual timing mechanism ensures 500ms consistency
7. **Numbers** show how many mines are adjacent to that cell
8. **Flag all mines** without revealing them to win

## 🏆 High Score System

### Features
- **Separate Leaderboards**: Individual top 10 lists for Beginner, Intermediate, and Expert difficulties
- **Persistent Storage**: High scores saved to localStorage
- **Player Recognition**: Enter your name when achieving a high score with automatic input focus
- **Name Validation**: Prevents empty submissions and provides clear feedback
- **Keyboard Support**: Press Enter to submit your name for high scores
- **Time-based Ranking**: Sorted by fastest completion time
- **Date Tracking**: Records when each high score was achieved
- **Accessible Design**: High-contrast colors and clear visual hierarchy for better readability

### How It Works
1. Win a game to check if your time qualifies for the high score list
2. If you achieve a high score, the input field automatically focuses for you to enter your name
3. Type your name and press Enter or click Save to submit your score
4. View the high score lists anytime by clicking the "High Scores" button
5. Navigate between difficulty levels using the tabs in the high score modal

## 🎯 Game Rules

### How to Play
1. **Left-click** any cell to reveal it (or tap on mobile)
2. **Right-click** to flag/unflag suspected mines on desktop (Ctrl+Click on Mac)
3. **Long press** on any cell to flag/unflag (works on mobile and desktop)
4. **Enhanced Controls**: Improved event handling prevents accidental reveals
5. **Numbers** show how many mines are adjacent to that cell
6. **Objective**: Reveal all non-mine cells without clicking on any mines
7. **Timer** starts on your first move and automatically resumes if paused

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

## 🔒 Deployment & Proxy Configuration

### Nginx Configuration

When deploying behind an Nginx reverse proxy, use these optimized settings to ensure proper handling of touch events, long press detection, and right-clicks. **A complete example configuration is available in `nginx-example.conf`**.

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Application location
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Important headers for event handling
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Allow WebSocket connections (important for Next.js)
        proxy_set_header Connection "upgrade";
        
        # Critical settings for touch event timing (REQUIRED)
        proxy_buffering off;                    # Disable buffering for real-time events
        proxy_request_buffering off;            # Don't buffer incoming requests
        proxy_read_timeout 60s;                 # Allow time for long press detection
        proxy_send_timeout 60s;                 # Prevent timeout during interactions
        
        # Allow all HTTP methods including OPTIONS (for CORS)
        proxy_method "";
        
        # Optimize for low-latency interactive applications
        tcp_nodelay on;
        tcp_nopush off;
    }
    
    # Additional recommended settings
    client_max_body_size 10M;
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Apache Configuration

If using Apache as a reverse proxy, add these settings to your virtual host:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    # Important for event handling
    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-Port "80"
    
    # Increase timeout for long-press detection
    ProxyTimeout 60
    
    # Security headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
```

### Docker with Traefik

If using Traefik with Docker, add these labels to your service:

```yaml
services:
  minesweeper:
    # ... other configuration
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.minesweeper.rule=Host(`your-domain.com`)"
      - "traefik.http.services.minesweeper.loadbalancer.server.port=3001"
      - "traefik.http.middlewares.minesweeper-headers.headers.customResponseHeaders.X-Content-Type-Options=nosniff"
      - "traefik.http.middlewares.minesweeper-headers.headers.customResponseHeaders.X-Frame-Options=SAMEORIGIN"
      - "traefik.http.middlewares.minesweeper-headers.headers.customResponseHeaders.X-XSS-Protection=1; mode=block"
      - "traefik.http.routers.minesweeper.middlewares=minesweeper-headers"
```

## 🚧 Upcoming Features

### High Priority
- [x] **Mobile Controls**: Long press to flag on mobile (COMPLETED v1.1.0)
- [x] **High Score System**: Top 10 high scores for each difficulty level (COMPLETED v1.1.0)
- [x] **Long Press to Flag**: Hold down on cells to quickly place flags (COMPLETED v1.1.0)
- [x] **Triggered Mine Highlight**: Show which mine caused the game to end (COMPLETED v1.1.0)
- [x] **Right-Click Enhancement**: Fixed event handling and proxy compatibility (COMPLETED v1.1.8)
- [x] **Proxy Compatibility**: Enhanced nginx reverse proxy support (COMPLETED v1.1.8)
- [x] **Mobile Experience**: Haptic feedback and improved touch handling (COMPLETED v1.1.8)
- [ ] **API Routes**: RESTful endpoints for score management
- [ ] **Database Migration**: Scripts for localStorage → SQLite → SQL/NoSQL

### Medium Priority
- [ ] **Animations**: D3.js cell reveal effects, Three.js win celebrations
- [ ] **Enhanced Mobile Features**: Gesture recognition
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

## 🐭 Troubleshooting

### Proxy Environment Issues

**Long press not working behind reverse proxy?**

1. **Check nginx configuration**: Ensure `proxy_buffering off` and `proxy_request_buffering off` are set
2. **Verify timeout settings**: Use `proxy_read_timeout 60s` to allow for long press detection
3. **Use the provided config**: Copy settings from `nginx-example.conf`
4. **Test locally first**: Confirm functionality works on `localhost:3001` before deploying

**Right-click not working properly?**

1. **Browser compatibility**: Some browsers may require Ctrl+Click instead of right-click
2. **Event interference**: Check for browser extensions that might block context menus
3. **Mobile devices**: Use long press instead of attempting right-click

### Build Issues

If you encounter build errors, try the following:

```bash
# Clear Next.js cache and node_modules
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Common Issues:**
- **"Cannot find module 'critters'"**: Fixed by installing the `critters` dependency
- **Experimental features causing build failures**: The `optimizeCss` experimental feature has been disabled for stability
- **TypeScript compilation errors**: Ensure all imports are correctly typed and files exist
- **Touch events not working**: Verify modern browser support for touch APIs
- **Docker build fails with "Cannot find module '@/...'"**: The `.dockerignore` file was excluding `tsconfig.json`, preventing TypeScript path mapping resolution in Docker builds. Fixed by allowing `tsconfig.json` in Docker context.

### Proxy Issues

If you're experiencing issues with right-click or long press functionality behind a reverse proxy:

1. **Check Nginx/Apache Configuration**: Ensure your proxy configuration includes the headers mentioned in the Deployment section
2. **Browser Console Errors**: Look for any JavaScript errors in your browser's developer console
3. **Touch Events**: Some proxies might strip or modify certain headers needed for proper touch event handling
4. **WebSocket Connection**: Ensure WebSocket connections are properly forwarded if using Next.js development server

### Docker Issues

If Docker builds fail with module resolution errors:

```bash
# Ensure these files are NOT excluded in .dockerignore:
# tsconfig.json       # Required for TypeScript path mapping
# next.config.ts      # Required for Next.js configuration
# src/                # Required for source code

# Rebuild without cache if needed
docker build --no-cache -t minesweeper-mvp .

# Check if container runs properly
docker run -p 3001:3001 minesweeper-mvp
```

**Path Mapping Requirements:**
- `tsconfig.json` must include `"@/*": ["./src/*"]` in paths
- `next.config.ts` must include webpack alias configuration
- Both files must be available in the Docker build context

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