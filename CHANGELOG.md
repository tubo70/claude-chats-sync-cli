# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.9] - 2025-01-09

### Added
- `update` command to upgrade Git filter configuration for existing projects
- Automatic detection and upgrade of outdated filter configurations

### Changed
- Improved `init` command to inform users about `update` command for existing projects

## [0.0.8] - 2025-01-09

### Added
- Git smudge filter to restore absolute paths on checkout
- Automatic path normalization for cross-platform compatibility

### Changed
- Enhanced clean filter to remove absolute paths from `cwd` field in session files
- Updated `.gitattributes` pattern to match all `.jsonl` files in subdirectories (`**/*.jsonl`)
- Absolute paths in `cwd` field are now replaced with project directory name only on commit
- When checking out files, project names are automatically restored to absolute paths based on current system

### Fixed
- Git filter now correctly processes session files in nested subdirectories
- Path cleaning now works for both Windows (`d:\Projects\...`) and Unix (`/home/user/...`) absolute paths

## [0.0.7] - 2025-01-06

### Fixed
- Fixed `isSymlink` function on Windows to correctly distinguish between physical directories and junctions/symlinks
- Previously, all directories were incorrectly detected as symlinks on Windows
- Now properly uses `fs.readlinkSync()` to detect if a directory is actually a junction or symlink
- Fixes scenario where physical directories in Claude storage were incorrectly treated as already initialized

## [0.0.6] - 2025-01-06

### Fixed
- Fixed `init` command to properly handle projects with existing `.claudeCodeSessions` folder
- Now correctly creates symlink to project's existing session folder when shared from other sources
- Added intelligent merge functionality when both Claude storage and project folder contain sessions
- Improved handling of multiple scenarios: empty folders, existing sessions, and session merging

## [0.0.5] - 2025-01-02

### Fixed
- Fixed Linux/Mac path normalization to match Claude Code behavior
- Unix paths now correctly include leading dash (e.g., `/home/user/projects` → `-home-user-projects`)

## [0.0.1] - 2025-01-02

### Added
- Initial release
- Cross-platform CLI tool for syncing Claude Code chat sessions
- `init` command to initialize sync with symlink creation
- `status` command to check sync status and session count
- `open` command to open history folder in file manager
- `clean` command to manually clean sensitive data from session files
- `setup-git-filter` command to configure Git automatic cleaning
- Git filter for automatic API key cleaning on commit
- Support for custom folder names via `--folder-name` option
- Force migration option via `--force` flag
- Project path option via `--project-path`
- Cross-platform support (Windows, macOS, Linux)
- Colored terminal output for better readability
- Bilingual error messages (English/Chinese)

### Security
- Automatic API key cleaning from session files
- Git filter configuration for safe version control
- Environment variable support for secure API key storage

[Unreleased]: https://github.com/tubo70/claude-chats-sync-cli/compare/v0.0.5...HEAD
[0.0.5]: https://github.com/tubo70/claude-chats-sync-cli/compare/v0.0.1...v0.0.5
[0.0.1]: https://github.com/tubo70/claude-chats-sync-cli/releases/tag/v0.0.1
