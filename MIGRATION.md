# 项目迁移说明 / Project Migration Guide

这个目录已经准备好作为独立的 npm 包发布到新的仓库。
This directory is ready to be published as an independent npm package to a new repository.

## 📦 已完成的设置 / Completed Setup

### ✅ 核心文件 / Core Files
- `bin/claude-chats-sync.js` - 主 CLI 脚本 / Main CLI script
- `bin/claude-chats-sync` - Bash 包装器 / Bash wrapper
- `bin/claude-chats-sync.cmd` - Windows 批处理包装器 / Windows batch wrapper
- `bin/claude-chats-sync.ps1` - PowerShell 包装器 / PowerShell wrapper

### ✅ npm 配置 / npm Configuration
- `package.json` - npm 包配置 / npm package configuration
  - 包名: `claude-chats-sync`
  - 入口: `bin/claude-chats-sync.js`
  - 命令: `claude-chats-sync`
  - 脚本: init, status, open, clean, setup-git-filter

### ✅ 文档 / Documentation
- `README.md` - 英文文档 / English documentation
- `README.zh-CN.md` - 中文文档 / Chinese documentation
- `QUICKSTART.md` - 快速开始指南 / Quick start guide
- `CHANGELOG.md` - 版本历史 / Version history
- `CONTRIBUTING.md` - 贡献指南 / Contributing guide
- `PUBLISH_GUIDE.md` - 发布指南 / Publishing guide

### ✅ 其他文件 / Other Files
- `.gitignore` - Git 忽略规则 / Git ignore rules
- `.npmignore` - npm 包忽略规则 / npm package ignore rules
- `LICENSE` - MIT 许可证 / MIT license

## 🚀 迁移步骤 / Migration Steps

### 1. 移动到新位置 / Move to New Location

```bash
# 方式 1: 直接移动整个目录 / Method 1: Move the entire directory
mv claude-chats-sync /path/to/new/location/

# 方式 2: 复制到新位置 / Method 2: Copy to new location
cp -r claude-chats-sync /path/to/new/location/
```

### 2. 初始化 Git 仓库 / Initialize Git Repository

```bash
cd claude-chats-sync

# 初始化新的 Git 仓库 / Initialize new Git repo
git init

# 添加所有文件 / Add all files
git add .

# 初始提交 / Initial commit
git commit -m "Initial commit: claude-chats-sync v1.0.0"
```

### 3. 创建 GitHub 仓库 / Create GitHub Repository

1. 访问 https://github.com/new
2. 仓库名: `claude-chats-sync`
3. 描述: `Cross-platform CLI tool to sync Claude Code chat sessions to project directory`
4. 不要初始化 README、.gitignore 或 license（我们已经有了）
5. 点击 "Create repository"

### 4. 推送到 GitHub / Push to GitHub

```bash
# 添加远程仓库 / Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/claude-chats-sync.git

# 推送到 GitHub / Push to GitHub
git branch -M main
git push -u origin main
```

### 5. 更新仓库链接 / Update Repository Links

在以下文件中更新仓库 URL：

**package.json**:
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/claude-chats-sync.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/claude-chats-sync/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/claude-chats-sync#readme"
}
```

**README.md 和 README.zh-CN.md**:
- 更新所有 GitHub 链接为你的仓库 URL
- Update all GitHub links to your repository URL

### 6. 发布到 npm / Publish to npm

```bash
# 登录 npm（如果还没登录）
# Login to npm (if not logged in)
npm login

# 发布包 / Publish package
npm publish --access public
```

详细步骤请参考 [PUBLISH_GUIDE.md](PUBLISH_GUIDE.md)

## 📋 发布前检查清单 / Pre-publish Checklist

- [ ] 更新 package.json 中的仓库 URL / Update repository URLs in package.json
- [ ] 更新 README.md 中的所有链接 / Update all links in README.md
- [ ] 更新 README.zh-CN.md 中的所有链接 / Update all links in README.zh-CN.md
- [ ] 测试所有命令功能 / Test all command features
  - [ ] `claude-chats-sync init`
  - [ ] `claude-chats-sync status`
  - [ ] `claude-chats-sync open`
  - [ ] `claude-chats-sync clean`
  - [ ] `claude-chats-sync setup-git-filter`
- [ ] 跨平台测试 / Cross-platform test
  - [ ] Windows
  - [ ] macOS
  - [ ] Linux
- [ ] 检查文档完整性 / Check documentation completeness
- [ ] 创建 GitHub Release / Create GitHub Release
- [ ] 推送到 npm / Publish to npm

## 🎯 后续改进 / Future Improvements

可以考虑的改进方向 / Potential improvements:

1. **添加测试 / Add Tests**
   - 单元测试 / Unit tests
   - 集成测试 / Integration tests
   - 跨平台测试 / Cross-platform tests

2. **CI/CD**
   - GitHub Actions 工作流 / GitHub Actions workflows
   - 自动测试 / Automated testing
   - 自动发布 / Automated publishing

3. **增强功能 / Enhanced Features**
   - 交互式配置向导 / Interactive setup wizard
   - 配置文件支持 / Config file support
   - 更多清理选项 / More cleaning options
   - 会话管理功能 / Session management features

4. **文档改进 / Documentation**
   - API 文档 / API documentation
   - 更多示例 / More examples
   - 视频教程 / Video tutorials

5. **社区建设 / Community Building**
   - 贡献者指南 / Contributor guide
   - 行为准则 / Code of conduct
   - 讨论区 / Discussions section

## 🔗 相关链接 / Related Links

- **主仓库 / Main Repository**: https://github.com/tubo70/claude-code-sync-extension
- **VSCode 扩展 / VSCode Extension**: https://marketplace.visualstudio.com/items?itemName=tubo.claude-code-chats-sync
- **新 CLI 仓库 / New CLI Repository**: [待创建 / To be created]

## 📝 版本历史 / Version History

详见 / See: [CHANGELOG.md](CHANGELOG.md)

## 💡 提示 / Tips

1. **首次发布**：确保在 npm 上没有重名包
   ```bash
   npm view claude-chats-sync
   # 应该返回 404 / Should return 404
   ```

2. **测试安装**：发布后从新位置测试安装
   ```bash
   npm install -g claude-chats-sync
   claude-chats-sync --help
   ```

3. **版本管理**：使用语义化版本
   - `1.0.1` - Bug 修复 / Bug fixes
   - `1.1.0` - 新功能 / New features
   - `2.0.0` - 破坏性更改 / Breaking changes

4. **文档同步**：保持中英文文档同步更新
   / Keep both English and Chinese documentation in sync

---

准备就绪！可以开始迁移和发布了！
Ready to migrate and publish! 🚀
