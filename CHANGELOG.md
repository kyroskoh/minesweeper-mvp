# Changelog

All notable changes to the Minesweeper MVP project will be documented in this file.

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