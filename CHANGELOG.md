# Changelog

All notable changes to the Onyx extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-15

### Added
- **Massive storage capacity increase**: Completely redesigned storage architecture using individual item storage, increasing capacity from ~8KB to ~4MB (50x improvement)
- **Enhanced storage management**: Added comprehensive storage information display in options page with usage tracking and visual progress indicators
- **Automatic data migration**: Seamless migration from legacy storage format to new individual item architecture

### Fixed
- **Critical prompt selector bug**: Fixed "x/" trigger functionality that was broken due to storage architecture changes - prompt selector now works correctly with the new storage system
- **Form clearing after prompt submission**: Fixed issue where the prompt title input field was not clearing after adding a new prompt. Both title and content fields now clear completely after successful prompt submission

### Improved
- **Streamlined popup interface**: Removed character limit display and storage tracker from popup for cleaner, more focused user experience
- **Better storage organization**: Moved storage tracking and management to options page where it belongs
- **Cleaner edit mode**: Removed unnecessary "Editing snippet" indicator since button text and cancel button already clearly indicate editing state

### Technical Details
- Implemented individual item storage model (`snippet-{id}` keys) replacing single array storage
- Enhanced storage validation with per-item and total item count limits
- Updated content script to use new storage architecture for prompt injection
- Enhanced `clearForm()` method with more specific DOM selectors
- Improved error handling and user feedback throughout the application
- Added automatic storage info updates across all CRUD operations

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