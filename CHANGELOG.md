# Changelog

All notable changes to the Minesweeper MVP project will be documented in this file.

## [1.1.8] - 2025-10-01

### Fixed
- **Long Press Proxy Fix**: Complete rewrite of long press detection for nginx reverse proxy compatibility
  - Implemented dual timing mechanism using both `setTimeout` and `requestAnimationFrame`
  - Added high-precision timing with `performance.now()` instead of `Date.now()`
  - Enhanced touch movement validation to prevent accidental flag toggles
  - Added passive event listeners for better proxy performance
  - Implemented touch action CSS optimizations for mobile devices
  - Added haptic feedback support for modern mobile browsers
  - Fixed event coordination issues that occurred behind reverse proxies
  - Added proper cleanup for animation frames and timers
- **Mobile Experience**: Enhanced mobile interaction with improved touch handling
  - Added haptic feedback support (vibration) when available
  - Enhanced visual feedback with orange ring indicator during long press
  - Improved touch movement validation to prevent accidental triggers
  - Added comprehensive CSS touch optimizations for all mobile browsers
- **Performance Improvements**: Optimized event handling for better proxy performance
  - Implemented passive event listeners to improve scroll performance
  - Added proper event cleanup to prevent memory leaks
  - Enhanced timing precision with dual mechanism fallback
- **Developer Experience**: Added comprehensive nginx configuration example
  - Created `nginx-example.conf` with optimized proxy settings
  - Added detailed deployment documentation for reverse proxy setups
  - Improved debugging with better event validation and error handling

## [1.1.7] - 2025-09-25

### Fixed
- **Right-Click Functionality**: Complete rewrite of right-click event handling system   
  - Fixed duplicate event handlers that caused double-flagging or race conditions
  - Removed conflicting contextmenu event listeners (inline + manual addEventListener)
  - Simplified event flow: single `onContextMenu` handler for right-click detection
  - Fixed Ctrl+Click support for Mac users (now properly maps to flag toggle)
  - Improved event suppression with `preventDefault()` and `stopPropagation()`
  - Eliminated race conditions between `onClick` and `onContextMenu` events
- **Event Handling**: Enhanced primary click handler to properly ignore non-left mouse buttons
- **Cross-Platform Compatibility**: Better support for different mouse button behaviors across browsers

## [1.1.6] - 2025-09-25

### Fixed
- **TypeScript Error**: Fixed TypeScript error related to cell position properties by correctly accessing `position.x` and `position.y`
- **Cell Component**: Updated MinesweeperCell component to properly reference cell position properties
- **Data Attributes**: Fixed data-cell-pos attribute to use the correct property path

## [1.1.5] - 2025-09-25

### Fixed
- **Nginx Compatibility**: Fixed issues with right-click and long press functionality when running behind Nginx reverse proxy
- **Event Handling**: Improved event propagation to ensure consistent behavior across different hosting configurations
- **Touch Events**: Enhanced touch event handling for better mobile experience through proxies

## [1.1.4] - 2025-09-25

### Fixed
- **Type Error**: Fixed TypeScript compilation error related to `isBombPlacementMode` property
- **Game Board Component**: Refactored GameBoard component to use local state for flag mode
- **Build Process**: Resolved build failure by removing references to non-existent properties

## [1.1.3] - 2025-09-25

### Changed
- **Simplified Flag Controls**
  - Removed the problematic "Place Flags" toggle button functionality
  - Streamlined controls to focus on right-click for desktop users
  - Enhanced long-press functionality for both mobile and desktop users
  - Updated instructions to clarify the flag placement methods
  - Simplified codebase by removing bomb placement mode state and related code

### Fixed
- **Mobile Controls**: Fixed inconsistent flag placement behavior by standardizing on long-press
- **User Interface**: Removed potentially confusing toggle button that wasn't working correctly
- **Game Logic**: Simplified interaction model for better user experience across all devices

## [1.1.2] - 2025-09-24

### Fixed
- **High Score Name Submission**
  - Fixed issue where player names weren't being properly saved when submitting high scores
  - Added validation to prevent empty name submissions
  - Improved the form submission process to properly handle the Enter key
  - Enhanced name input field with better validation and error messages
  - Fixed the fallback to "Anonymous" only when truly needed

## [1.1.1] - 2025-09-24

### Improved
- **High Score UI**
  - Improved color contrast for better readability in the high score modal
  - Enhanced name input form with clearer visual hierarchy and better accessibility
  - Added automatic focus on name input field when achieving a high score
  - Updated UI to follow color best practices with amber/gold theme for high scores
  - Fixed gray text on light background contrast issues in the high score table

## [1.1.0] - 2025-09-24

### Added
- **High Score System**
  - Added top 10 leaderboards for each difficulty level
  - Implemented player name input for high scores
  - Created tabbed interface for viewing scores by difficulty
  - Added persistent storage of high scores in localStorage
  - Added gold-colored High Score button with trophy icon

- **Long Press to Flag**
  - Implemented long press detection (500ms) to place flags
  - Added visual feedback during long press
  - Works on both mobile and desktop devices
  - Provides an alternative to right-clicking or switching to flag mode

- **Triggered Mine Highlight**
  - Added yellow background to highlight the specific mine that caused the game to end
  - Helps players learn from mistakes by clearly showing which mine they clicked

### Fixed
- **Timer Bug**: Fixed issue where timer wouldn't automatically resume when user interacts with a paused game
- **Mobile Flag Placement**: Fixed bug with the flag placement toggle mode not working correctly on mobile devices
- **Cell Interaction**: Improved cell click handling to better respect the current game mode

### Changed
- **High Score Button**: Changed from blue to gold/amber color scheme with trophy icon
- **README**: Updated documentation to include new features and mobile controls
- **Project Structure**: Added scores directory for high score management system

## [1.0.0] - 2025-09-23

### Initial Release
- Core Minesweeper game functionality
- Three difficulty levels (Beginner, Intermediate, Expert)
- Mobile-friendly controls with flag placement toggle
- Precision timer with pause/resume functionality
- Classic number color scheme
- Game state persistence
- Docker support for development and production
- Comprehensive test suite
