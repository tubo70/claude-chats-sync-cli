# claude-chats-sync

[![npm version](https://badge.fury.io/js/claude-chats-sync.svg)](https://www.npmjs.com/package/claude-chats-sync)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/node/v/claude-chats-sync.svg)](https://nodejs.org)

> 跨平台命令行工具，将 Claude Code 聊天会话同步到项目目录

中文文档 | [English](README.md)

## ⚠️ 安全警告 - 使用前必读

> **重要提示**: 除非绝对必要，否则请勿将 `.claudeCodeSessions/` 提交到仓库！

### 有哪些风险？

会话文件可能包含敏感信息:
- **API keys 和认证令牌** - 可被用于访问你的账户
- **专有代码和业务逻辑** - 你的机密代码和算法
- **私人对话** - 内部讨论和敏感话题
- **系统路径和环境详情** - 关于你的基础设施的信息

### 推荐方案

**将 `.claudeCodeSessions/` 保留在 `.gitignore` 中**

这是最安全的选项。运行 `claude-chats-sync init` 后,工具会自动在 `.gitignore` 中添加以下条目：

```gitignore
# Claude Code 对话历史
.claudeCodeSessions/
.claudeCodeSessions/**/sessions-index.json
tmpclaude*
```

这些条目默认是激活的（未被注释），以确保会话文件和临时文件被 Git 忽略。

### 如果必须提交会话文件

1. **使用环境变量配置 API keys** - 防止它们出现在会话文件中
2. **使用 Git 过滤器** - 在提交时自动清理 API keys(但不是 100% 可靠)
3. **提交前审查文件** - 手动检查是否有任何敏感数据
4. **了解风险** - 没有任何自动清理是 100% 完整的

**你需要负责确保没有敏感数据被提交。**

---

## ✨ 功能特性

- 🔄 **自动同步** - 创建符号链接将 Claude Code 会话同步到项目文件夹
- 📁 **项目本地历史** - 聊天会话存储在项目中，而不是用户主目录
- 🔒 **敏感数据保护** - 清理会话文件中的 API keys
- 🎯 **简单易用** - 单个命令即可初始化同步
- 📊 **状态跟踪** - 检查同步状态和会话数量
- 🌳 **Git 友好** - 配置 Git 过滤器以安全地进行版本控制
- 🔧 **跨平台** - 支持 Windows、macOS 和 Linux

## 📦 安装

### 全局安装（推荐）

```bash
npm install -g claude-chats-sync
```

安装后可以在任何地方使用 `claude-chats-sync` 命令。

### 本地安装

```bash
npm install -D claude-chats-sync
```

然后通过 `npx` 使用：
```bash
npx claude-chats-sync init
```

## 🚀 快速开始

### 初始化同步

```bash
# 在项目目录中
claude-chats-sync init
```

这将：
- 在项目中创建 `.claudeCodeSessions/` 文件夹
- 在 `~/.claude/projects/` 中创建符号链接
- 配置 Git 过滤器以自动清理敏感数据
- 将 `.claudeCodeSessions/` 和相关模式添加到 `.gitignore`
- 显示安全警告和最佳实践

### 查看状态

```bash
claude-chats-sync status
```

### 打开历史文件夹

```bash
claude-chats-sync open
```

## 📖 命令

| 命令 | 说明 |
|------|------|
| `init` | 初始化当前项目的同步 |
| `status` | 检查同步状态和会话数量 |
| `open` | 在文件管理器中打开历史文件夹 |
| `clean` | 清理会话文件中的敏感数据 |
| `setup-git-filter` | 设置 Git 自动清理过滤器 |
| `update` | 更新 Git 过滤器到最新版本（用于现有项目） |
| `help` | 显示帮助信息 |

## 🔧 使用示例

### 基本用法

```bash
# 初始化同步
claude-chats-sync init

# 查看状态
claude-chats-sync status

# 打开会话文件夹
claude-chats-sync open
```

### 高级选项

```bash
# 自定义文件夹名称
claude-chats-sync init --folder-name .sessions

# 强制迁移现有会话
claude-chats-sync init --force

# 指定项目路径
claude-chats-sync init --project-path /path/to/project
```

### 清理敏感数据

```bash
# 手动清理
claude-chats-sync clean

# 设置 Git 自动过滤器
claude-chats-sync setup-git-filter

# 更新 Git 过滤器（用于现有项目）
claude-chats-sync update
```

> **注意**：如果你使用旧版本（v0.0.8 之前）初始化项目，请运行 `claude-chats-sync update` 以获取最新的 Git 过滤器功能，包括路径清理和 smudge 过滤器。

## ⚙️ 环境变量配置（推荐）

通过环境变量配置 API keys，防止它们出现在会话文件中：

**Linux/macOS** - 添加到 `~/.bashrc` 或 `~/.zshrc`：
```bash
export ANTHROPIC_AUTH_TOKEN="sk-ant-..."
export ANTHROPIC_BASE_URL="https://api.example.com"  # 可选：第三方 API
```

**Windows PowerShell**：
```powershell
$env:ANTHROPIC_AUTH_TOKEN="sk-ant-..."
$env:ANTHROPIC_BASE_URL="https://api.example.com"
```

**Windows CMD（永久设置）**：
```cmd
setx ANTHROPIC_AUTH_TOKEN "sk-ant-..."
setx ANTHROPIC_BASE_URL="https://api.example.com"
```

## 🔒 安全与版本控制

### API Key 配置选项

**选项 1：使用环境变量（推荐）**

配置 Claude Code 从环境变量使用 API keys，防止它们出现在会话文件中。这是最安全的方法。

**选项 2：使用 Git 过滤器**

如果你在配置文件中存储 API keys，Git 过滤器会在提交时自动清理它们。

### Git 过滤器使用

初始化后，正常提交即可：

```bash
git add .claudeCodeSessions/
git commit -m "添加对话历史"

# API keys 自动替换为 [REDACTED]
# 你的本地文件保持不变
```

### 完全 Git 忽略（最安全）

**推荐**：完全忽略会话文件。运行 `claude-chats-sync init` 后，`.gitignore` 已自动配置为忽略会话文件：

```gitignore
# Claude Code 对话历史
.claudeCodeSessions/
.claudeCodeSessions/**/sessions-index.json
tmpclaude*
```

这可以防止意外将敏感数据提交到仓库。

## 🌐 工作原理

Claude Code 将聊天会话存储在 `~/.claude/projects/{normalized-project-path}/` 中。

本 CLI 创建一个指向项目文件夹的符号链接（默认：`.claudeCodeSessions/`），使聊天历史成为项目的一部分。

### 示例结构

```
Your Project/
├── src/
├── .claudeCodeSessions/      # 聊天会话（与 ~/.claude 同步）
│   ├── session-abc123.jsonl
│   └── session-def456.jsonl
├── .gitignore               # 自动更新
├── .gitattributes           # Git 过滤器配置
└── package.json
```

## 🔄 跨机器同步

如果你选择同步会话文件：

1. 提交 `.claudeCodeSessions/` 文件夹
2. 推送到 GitHub
3. 在另一台机器上拉取
4. 运行 `claude-chats-sync init` 创建符号链接

## 🔧 平台特定说明

### Windows
- 使用 junction 点（不需要管理员权限）
- 支持 PowerShell 和 CMD
- 运行 PowerShell 脚本可能需要：`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### macOS
- 需要执行权限：`chmod +x $(which claude-chats-sync)`
- 使用标准符号链接

### Linux
- 需要执行权限：`chmod +x $(which claude-chats-sync)`
- 使用标准符号链接

## 🐛 故障排除

### 符号链接创建失败（Windows）

本工具使用 junction 点，无需管理员权限。如果仍有问题：
- 确保 Node.js 在 PATH 中
- 尝试以管理员身份运行
- 检查项目路径不包含特殊字符

### 历史记录未同步

1. 检查符号链接是否存在：
   - Windows: `dir %USERPROFILE%\.claude\projects`
   - macOS/Linux: `ls -la ~/.claude/projects`

2. 验证符号链接是否指向项目的 `.claudeCodeSessions/` 文件夹

### 重新初始化

删除现有符号链接：

```bash
# Windows
rmdir "%USERPROFILE%\.claude\projects\{project-name}"

# macOS/Linux
rm ~/.claude/projects/{project-name}
```

然后再次运行 `claude-chats-sync init`。

## 📚 相关项目

- [VSCode 扩展](https://marketplace.visualstudio.com/items?itemName=tubo.claude-code-chats-sync) - 功能完整的 VSCode 扩展

## 💰 Token 使用与成本考虑

> ⚠️ **重要提示**：在团队成员间共享会话文件时，每个成员使用自己的 API key 并承担自己的 API 成本。

### 关键要点

1. **每个成员支付自己的使用费用**
   - 每个团队成员必须配置自己的 API key
   - 当你继续共享的对话时，**你需要为所有新生成的 tokens 付费**
   - 原始创建者的 API key **不会被使用**

2. **上下文窗口考虑**
   - 较长的共享对话会消耗更多 tokens 作为上下文
   - 一个包含 50,000 tokens 的共享对话，每次新成员继续时都会消耗约 50,000 个输入 tokens

3. **节省成本的最佳实践**
   - 共享前生成对话摘要
   - 尽可能开始新对话
   - 归档旧会话
   - 监控 API 使用情况

## 📝 许可证

MIT - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎贡献！请提交 issue 或拉取请求。

## 📞 支持

- 📧 [问题反馈](https://github.com/tubo70/claude-chats-sync-cli/issues)
- 📖 [文档](https://github.com/tubo70/claude-chats-sync-cli/wiki)
- 💬 [讨论](https://github.com/tubo70/claude-chats-sync-cli/discussions)

## 🔗 链接

- [npm](https://www.npmjs.com/package/claude-chats-sync)
- [GitHub](https://github.com/tubo70/claude-chats-sync-cli)
- [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=tubo.claude-code-chats-sync)

---

由 [tubo70](https://github.com/tubo70) 用 ❤️ 制作
