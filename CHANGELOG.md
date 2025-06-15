# Changelog

All notable changes to the Onyx extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-15

### Fixed
- **Form clearing after prompt submission**: Fixed issue where the prompt title input field was not clearing after adding a new prompt. Both title and content fields now clear completely after successful prompt submission, providing a clean slate for the next prompt entry.

### Technical Details
- Enhanced `clearForm()` method with more specific DOM selectors to target form inputs correctly
- Added immediate DOM manipulation alongside state clearing to ensure reliable visual feedback
- Applied fix to both popup interface and options page for consistent behavior

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