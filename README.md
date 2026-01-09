# claude-chats-sync

[![npm version](https://badge.fury.io/js/claude-chats-sync.svg)](https://www.npmjs.com/package/claude-chats-sync)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/node/v/claude-chats-sync.svg)](https://nodejs.org)

> Cross-platform CLI tool to sync Claude Code chat sessions to your project directory

[中文文档](README.zh-CN.md) | English

## ✨ Features

- 🔄 **Auto-sync** - Creates symlinks from Claude Code local storage to your project folder
- 📁 **Project-local history** - Chat sessions stored in your project, not user home directory
- 🔒 **Sensitive data protection** - Cleans API keys from session files
- 🎯 **Simple to use** - Initialize sync with a single command
- 📊 **Status tracking** - Check sync status and session count
- 🌳 **Git-friendly** - Configure Git filters for safe version control
- 🔧 **Cross-platform** - Works on Windows, macOS, and Linux

## 📦 Installation

### Install globally (recommended)

```bash
npm install -g claude-chats-sync
```

This allows you to use `claude-chats-sync` command from anywhere.

### Install locally

```bash
npm install -D claude-chats-sync
```

Then use it via `npx`:
```bash
npx claude-chats-sync init
```

## 🚀 Quick Start

### Initialize sync

```bash
# In your project directory
claude-chats-sync init
```

This will:
- Create a `.claudeCodeSessions/` folder in your project
- Create a symlink in `~/.claude/projects/`
- Configure Git filter for automatic sensitive data cleaning
- Add `.claudeCodeSessions/` to `.gitignore` (commented by default)

### Check status

```bash
claude-chats-sync status
```

### Open history folder

```bash
claude-chats-sync open
```

## 📖 Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize sync for current project |
| `status` | Check sync status and session count |
| `open` | Open history folder in file manager |
| `clean` | Clean sensitive data from session files |
| `setup-git-filter` | Setup Git filter for automatic cleaning |
| `update` | Update Git filter to latest version (for existing projects) |
| `help` | Show help message |

## 🔧 Usage Examples

### Basic usage

```bash
# Initialize sync
claude-chats-sync init

# Check status
claude-chats-sync status

# Open sessions folder
claude-chats-sync open
```

### Advanced options

```bash
# Custom folder name
claude-chats-sync init --folder-name .sessions

# Force migrate existing sessions
claude-chats-sync init --force

# Specify project path
claude-chats-sync init --project-path /path/to/project
```

### Cleaning sensitive data

```bash
# Manual cleanup
claude-chats-sync clean

# Setup Git auto-filter
claude-chats-sync setup-git-filter

# Update Git filter (for existing projects)
claude-chats-sync update
```

> **Note**: If you initialized your project with an older version (before v0.0.8), run `claude-chats-sync update` to get the latest Git filter features including path cleaning and smudge filter.

## ⚙️ Environment Variables (Recommended)

Configure API keys via environment variables to prevent them from appearing in session files:

**Linux/macOS** - Add to `~/.bashrc` or `~/.zshrc`:
```bash
export ANTHROPIC_AUTH_TOKEN="sk-ant-..."
export ANTHROPIC_BASE_URL="https://api.example.com"  # Optional: for third-party API
```

**Windows PowerShell**:
```powershell
$env:ANTHROPIC_AUTH_TOKEN="sk-ant-..."
$env:ANTHROPIC_BASE_URL="https://api.example.com"
```

**Windows CMD (permanent)**:
```cmd
setx ANTHROPIC_AUTH_TOKEN "sk-ant-..."
setx ANTHROPIC_BASE_URL "https://api.example.com"
```

## 🔒 Security & Version Control

### ⚠️ Security Warning

Session files may contain sensitive information:
- API keys and authentication tokens
- Proprietary code and business logic
- Private conversations and internal discussions
- System paths and environment details

While this tool provides API key cleaning, **no automated cleaning is 100% complete**. Only commit these files if you fully understand and accept the security risks.

### Options for securing API keys

**Option 1: Use environment variables (Recommended)**

Configure Claude Code to use API keys from environment variables. This prevents them from appearing in session files entirely.

**Option 2: Use Git filter**

If you store API keys in config files, the Git filter automatically cleans them on commit.

### Git filter usage

After initialization, commit normally:

```bash
git add .claudeCodeSessions/
git commit -m "Add conversation history"

# API keys are automatically replaced with [REDACTED]
# Your local files remain unchanged
```

### Complete Git ignore (safest)

**RECOMMENDED**: Ignore session files entirely. Uncomment in `.gitignore`:

```gitignore
.claudeCodeSessions/
```

This prevents accidentally committing sensitive data to your repository.

## 🌐 How It Works

Claude Code stores chat sessions in `~/.claude/projects/{normalized-project-path}/`.

This CLI creates a symbolic link to a folder in your project (default: `.claudeCodeSessions/`), making the chat history part of your project.

### Example structure

```
Your Project/
├── src/
├── .claudeCodeSessions/      # Chat sessions (synced with ~/.claude)
│   ├── session-abc123.jsonl
│   └── session-def456.jsonl
├── .gitignore               # Auto-updated
├── .gitattributes           # Git filter configuration
└── package.json
```

## 🔄 Syncing Across Machines

If you choose to sync session files:

1. Commit the `.claudeCodeSessions/` folder
2. Push to GitHub
3. Pull on another machine
4. Run `claude-chats-sync init` to create the symlink

## 🔧 Platform-specific Notes

### Windows
- Uses junction points (no admin privileges required)
- Supports PowerShell and CMD
- Run PowerShell scripts may require: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### macOS
- Requires execute permissions: `chmod +x $(which claude-chats-sync)`
- Uses standard symbolic links

### Linux
- Requires execute permissions: `chmod +x $(which claude-chats-sync)`
- Uses standard symbolic links

## 🐛 Troubleshooting

### Symlink creation fails (Windows)

The tool uses junction points which work without admin privileges. If issues persist:
- Ensure Node.js is in your PATH
- Try running as administrator
- Check that your project path doesn't contain special characters

### History not syncing

1. Check if symlink exists:
   - Windows: `dir %USERPROFILE%\.claude\projects`
   - macOS/Linux: `ls -la ~/.claude/projects`

2. Verify symlink points to your project's `.claudeCodeSessions/` folder

### Reinitialize

Delete existing symlink:

```bash
# Windows
rmdir "%USERPROFILE%\.claude\projects\{project-name}"

# macOS/Linux
rm ~/.claude/projects/{project-name}
```

Then run `claude-chats-sync init` again.

## 📚 Related Projects

- [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=tubo.claude-code-chats-sync) - Full-featured VSCode extension with the same functionality

## 💰 Token Usage & Cost Considerations

> ⚠️ **IMPORTANT**: When sharing session files, each team member uses their own API key and incurs their own API costs.

### Key points

1. **Each member pays for their own usage**
   - Every team member must configure their own API key
   - When you continue a shared conversation, **you pay for all new tokens** generated
   - The original creator's API key is **never** used

2. **Context window considerations**
   - Long shared conversations consume more tokens as context
   - A shared conversation with 50,000 tokens will consume ~50,000 input tokens each time a new member continues it

3. **Cost-saving best practices**
   - Generate conversation summaries before sharing
   - Start new conversations when possible
   - Archive old sessions
   - Monitor your API usage

For detailed cost considerations, see [Token Usage Guide](TOKEN_USAGE.md).

## 📝 License

MIT - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📞 Support

- 📧 [Issues](https://github.com/tubo70/claude-chats-sync-cli/issues)
- 📖 [Documentation](https://github.com/tubo70/claude-chats-sync-cli/wiki)
- 💬 [Discussions](https://github.com/tubo70/claude-chats-sync-cli/discussions)

## 🔗 Links

- [npm](https://www.npmjs.com/package/claude-chats-sync)
- [GitHub](https://github.com/tubo70/claude-chats-sync-cli)
- [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=tubo.claude-code-chats-sync)

---

Made with ❤️ by [tubo70](https://github.com/tubo70)
