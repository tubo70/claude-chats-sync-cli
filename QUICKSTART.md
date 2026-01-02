# Quick Start Guide

快速开始指南 - 5 分钟上手 / Get started in 5 minutes

## Installation / 安装

```bash
npm install -g claude-chats-sync
```

## First Use / 首次使用

### 1. Initialize / 初始化

```bash
cd /path/to/your/project
claude-chats-sync init
```

**Output / 输出:**
```
✅ Created folder: /path/to/project/.claudeCodeSessions
✅ Claude Code Chats Sync initialized!
ℹ️  History folder: /path/to/project/.claudeCodeSessions
ℹ️  Linked to: /home/user/.claude/projects/path-to-project
```

### 2. Check Status / 检查状态

```bash
claude-chats-sync status
```

**Output / 输出:**
```
📊 Claude Code Chats Sync Status

✅ History folder exists
   Path: /path/to/project/.claudeCodeSessions
   Sessions: 0
✅ Symlink created
   Path: /home/user/.claude/projects/path-to-project
```

### 3. Start Using Claude Code / 开始使用

现在你的 Claude Code 会话会自动保存到项目中的 `.claudeCodeSessions/` 文件夹！

Now your Claude Code sessions will be automatically saved to `.claudeCodeSessions/` in your project!

## Common Commands / 常用命令

```bash
# 查看状态 / Check status
claude-chats-sync status

# 打开会话文件夹 / Open sessions folder
claude-chats-sync open

# 清理敏感数据 / Clean sensitive data
claude-chats-sync clean

# 设置 Git 过滤器 / Setup Git filter
claude-chats-sync setup-git-filter

# 查看帮助 / Show help
claude-chats-sync help
```

## Configuration / 配置

### Environment Variables (Recommended / 推荐)

**Linux/macOS** - Add to `~/.bashrc` or `~/.zshrc`:
```bash
export ANTHROPIC_AUTH_TOKEN="sk-ant-..."
export ANTHROPIC_BASE_URL="https://api.example.com"  # Optional / 可选
```

**Windows PowerShell**:
```powershell
$env:ANTHROPIC_AUTH_TOKEN="sk-ant-..."
$env:ANTHROPIC_BASE_URL="https://api.example.com"
```

### Custom Folder Name / 自定义文件夹名称

```bash
claude-chats-sync init --folder-name .my-sessions
```

## Git Integration / Git 集成

### Option 1: Git Filter (Auto-clean / 自动清理)

```bash
# Setup Git filter
claude-chats-sync setup-git-filter

# Commit normally
git add .claudeCodeSessions/
git commit -m "Add Claude Code sessions"
# API keys are automatically cleaned / API keys 自动清理
```

### Option 2: Manual Clean / 手动清理

```bash
# Clean before committing
claude-chats-sync clean

# Then commit
git add .claudeCodeSessions/
git commit -m "Add Claude Code sessions"
```

### Option 3: Git Ignore (Safest / 最安全)

Edit `.gitignore` / 编辑 `.gitignore`:
```gitignore
# Uncomment to ignore sessions
.claudeCodeSessions/
```

## Project Structure / 项目结构

After initialization / 初始化后:

```
Your Project/
├── src/
├── .claudeCodeSessions/      # Chat sessions / 聊天会话
│   ├── session-abc123.jsonl
│   └── session-def456.jsonl
├── .gitignore               # Auto-updated / 自动更新
├── .gitattributes           # Git filter config / Git 过滤器配置
└── package.json
```

## Troubleshooting / 故障排除

### Permission Error (Mac/Linux / 权限错误)

```bash
chmod +x $(which claude-chats-sync)
```

### Node.js Not Found / 找不到 Node.js

Install Node.js: https://nodejs.org/

### Symlink Failed (Windows / 符号链接失败)

Try running as administrator / 尝试以管理员身份运行

## Next Steps / 下一步

- 📖 Read [full documentation](README.md) / 阅读完整文档
- 🔒 Learn about [security](README.md#security-version-control) / 了解安全配置
- 🚀 Check out [VSCode extension](https://marketplace.visualstudio.com/items?itemName=tubo.claude-code-chats-sync) / 查看 VSCode 扩展

## Support / 支持

- 📧 [Issues](https://github.com/tubo70/claude-chats-sync/issues)
- 📖 [Documentation](https://github.com/tubo70/claude-chats-sync/wiki)
- 💬 [Discussions](https://github.com/tubo70/claude-chats-sync/discussions)

---

Happy coding! / 祝你使用愉快! 🎉
