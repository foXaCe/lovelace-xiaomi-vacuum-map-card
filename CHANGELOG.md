# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.1.3] - 2026-02-03

### Fixed
- CI and release workflows updated for fixed output filename

## [5.1.2] - 2026-02-03

### Changed
- Use fixed output filename instead of content hash for simpler updates

## [5.1.1] - 2026-02-03

### Fixed
- Card not filling allocated space in HA sections layout (grid_rows was too small)

## [5.1.0] - 2026-02-03

### Added
- Responsive design with CSS container queries (<350px compact, >500px spacious)
- `getLayoutOptions()` for HA sections layout support (2024.3+)
- Enhanced visual editor with map lock, two-finger pan, clear selection on start and language override options
- Editor sections organized in collapsible `ha-expansion-panel` panels
- Editor translation keys for English and French

## [5.0.0] - 2026-02-03

### Added
- Cache-busting with content hash in filename for Android app compatibility

### Changed

**BREAKING CHANGE**: The output filename pattern has changed from `dreame-vacuum-card.js` to `dreame-vacuum-card-[hash].js` (e.g., `dreame-vacuum-card-a1b2c3d.js`).

This change is necessary for proper cache-busting in the Home Assistant Android app. If you reference the card file directly by its old name, you will need to update your configuration to use the new filename pattern or let HACS handle the automatic updates.

## [4.2.0] - 2026-02-03

### Added
- Automatic cache-busting with content hash in filename for Android app compatibility

## [4.1.0] - 2026-02-03

### Added
- Lottie robot animation component with state sensor support

### Changed
- Prettier formatting in robot-animation and Lottie assets

## [4.0.0] - 2026-02-02

### Added
- Room mode with Dreame-style overlay and smoothed canvas

### Changed
- Renamed project to dreame-vacuum-card
- Code review fixes and UI component cleanup
- Updated integration requirement to foXaCe/dreame-vacuum fork
- Rewritten README for Dreame-style card overhaul
- CI/CD setup with prettier formatting and hacs/action update
- Added pre-commit configuration
- Bumped dependencies (home-assistant-js-websocket, babel, eslint, rollup, GitHub Actions)

### Fixed
- Trailing whitespace and end-of-file issues
