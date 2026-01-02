# Contributing to claude-chats-sync

Thank you for your interest in contributing to claude-chats-sync!

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Node.js version**: `node --version`
- **OS platform and version**
- **CLI version**: `claude-chats-sync --version` (if available)
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Error messages** or logs

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:

- Use a clear and descriptive title
- Provide a detailed explanation of the feature
- Explain why this feature would be useful
- Include examples if applicable

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-chats-sync.git
   cd claude-chats-sync
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Link the package locally for testing:
   ```bash
   npm link
   ```

5. Make your changes and test:
   ```bash
   claude-chats-sync --help
   ```

### Code Style

- Use 2 spaces for indentation
- Follow existing code style and conventions
- Add comments for complex logic
- Keep functions focused and concise
- Use meaningful variable and function names

### Testing

Before submitting a pull request:

1. Test on multiple platforms if possible (Windows, macOS, Linux)
2. Test with various project paths and edge cases
3. Verify that all commands work as expected
4. Check for proper error handling

### Submitting Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Commit your changes with a clear message:
   ```bash
   git commit -m "Add: your feature description"
   ```

   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Docs:` for documentation changes
   - `Refactor:` for code refactoring
   - `Test:` for adding tests
   - `Chore:` for maintenance tasks

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots if applicable

## Project Structure

```
claude-chats-sync/
├── bin/
│   ├── claude-chats-sync.js       # Main CLI script
│   ├── claude-chats-sync          # Bash wrapper
│   ├── claude-chats-sync.cmd      # Batch wrapper (Windows)
│   └── claude-chats-sync.ps1      # PowerShell wrapper (Windows)
├── .gitignore               # Git ignore rules
├── .npmignore              # npm package ignore rules
├── package.json            # npm package configuration
├── README.md               # English documentation
├── README.zh-CN.md         # Chinese documentation
├── LICENSE                 # MIT License
└── CHANGELOG.md           # Version history
```

## Core Concepts

- **Symlink creation**: Creates junctions (Windows) or symbolic links (Unix) to sync sessions
- **Path normalization**: Converts project paths to Claude Code format
- **Git filters**: Automatically cleans sensitive data on commit
- **Cross-platform compatibility**: Works on Windows, macOS, and Linux

## Getting Help

If you need help:

- Read the [documentation](README.md)
- Check [existing issues](https://github.com/tubo70/claude-chats-sync/issues)
- Start a [discussion](https://github.com/tubo70/claude-chats-sync/discussions)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Code of Conduct

Be respectful and constructive. We're all here to build something great together!
