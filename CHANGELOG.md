# Changelog

All notable changes to the Onyx extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-06-18

### Added
- **Complete theme system**: Implemented centralized theme management with light/dark mode toggle for consistent user experience across all extension components
- **Apple-style theme toggle**: Added minimalistic theme toggle button in popup header with "THEME" label for intuitive theme switching
- **Universal magic animation**: Extended red border trace animation to all prompt selection methods (Enter, Tab, Shift+Tab, and mouse click) for consistent visual feedback
- **Dynamic theme-aware content script**: Content script now dynamically adapts styles based on selected theme with real-time theme change listening

### Improved
- **Enhanced dark mode**: Refined dark mode colors to match original design with better contrast and readability
- **Smoother theme transitions**: Added smooth 0.3s transitions for all theme changes throughout the interface
- **Consistent visual feedback**: All prompt selection methods now provide the same satisfying red magic animation experience
- **Better color contrast**: Improved text visibility in dark mode with optimized gray tones

### Technical Details
- Created centralized theme management system in `src/utils/theme.ts` with comprehensive CSS variable definitions
- Implemented theme state management with Chrome storage sync for persistence across sessions
- Added theme change listeners for real-time updates across all extension components
- Enhanced content script with dynamic theme application and storage change detection
- Updated all prompt selection handlers to consistently trigger border trace animation
- Optimized theme variable application with proper CSS custom property management
- Added smooth CSS transitions for all theme-aware elements while preserving interactive element responsiveness

---

## [1.1.0] - 2025-06-15

### Added
- **Massive storage capacity increase**: Completely redesigned storage architecture using individual item storage, increasing capacity from ~8KB to ~4MB (50x improvement)
- **Enhanced storage management**: Added comprehensive storage information display in options page with usage tracking and visual progress indicators
- **Magical auto-completion**: Exact-match auto-completion that triggers when typing the final character of any prompt title after "x/" with instant content injection and visual feedback
- **Smart prompt title validation**: Added real-time validation preventing spaces in prompt titles with conditional warning messages that only appear when needed

### Fixed
- **Critical prompt selector bug**: Fixed "x/" trigger functionality that was broken due to storage architecture changes - prompt selector now works correctly with the new storage system
- **Form clearing after prompt submission**: Fixed issue where the prompt title input field was not clearing after adding a new prompt. Both title and content fields now clear completely after successful prompt submission

### Improved
- **Streamlined popup interface**: Removed character limit display and storage tracker from popup for cleaner, more focused user experience
- **Compact popup design**: Reduced popup window height from 600px to 450px (25% smaller) for better screen real estate usage
- **Enhanced branding**: Updated Onyx logo color to signature red (#FF0000) for improved brand recognition
- **Elegant success messaging**: Redesigned success notifications with glass morphism effects, smooth animations, and minimalist "Prompt saved" text
- **Better storage organization**: Moved storage tracking and management to options page where it belongs
- **Cleaner edit mode**: Removed unnecessary "Editing snippet" indicator since button text and cancel button already clearly indicate editing state
- **Instant magical injection**: Replaced slow character-by-character typing animation with instant content injection plus subtle glow pulse effect for maximum productivity
- **Subtle trigger hints**: Moved "x/" trigger information to more discrete tagline location for cleaner interface

### Technical Details
- Implemented individual item storage model (`snippet-{id}` keys) replacing single array storage
- Enhanced storage validation with per-item and total item count limits
- Updated content script to use new storage architecture for prompt injection
- Enhanced `clearForm()` method with more specific DOM selectors and automatic scroll-to-top functionality
- Redesigned success message component with CSS animations (slide-in and shimmer effects)
- Optimized popup dimensions and spacing for improved visual hierarchy
- Added backdrop-filter and glass morphism effects for modern UI aesthetics
- Improved error handling and user feedback throughout the application
- Added automatic storage info updates across all CRUD operations
- Implemented exact match detection algorithm for magical auto-completion
- Created instant content injection system replacing character-by-character typing
- Added CSS keyframe animations for glow pulse effect with red theme integration
- Enhanced escape key handling for cancelling magical injection effects
- Improved input field targeting for both standard inputs and contenteditable elements
- Added conditional space validation with real-time warning system

---

## [1.0.0] - 2025-06-14

### Added
- Initial release of Onyx browser extension
- Prompt snippet management with create, read, update, delete functionality
- Browser extension popup interface for quick prompt access
- Options page for extended prompt management
- In-page prompt injection using "x/" trigger pattern
- Chrome storage sync for cross-device prompt synchronization
- Search and filter functionality for saved prompts
- Dark theme UI with responsive design