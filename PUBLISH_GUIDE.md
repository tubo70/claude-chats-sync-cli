# Publishing Guide

准备发布到 npm 的步骤 / Steps to publish to npm

## 准备工作 / Prerequisites

1. **npm 账号 / npm account**
   ```bash
   # 如果还没有账号，先注册
   # Register at https://www.npmjs.com/signup

   # 登录
   npm login
   ```

2. **检查包名是否可用 / Check if package name is available**
   ```bash
   npm view claude-chats-sync
   # 如果返回 404，说明包名可用
   # If returns 404, the package name is available
   ```

## 发布步骤 / Publishing Steps

### 1. 更新版本号 / Update version number

```bash
# 手动编辑 package.json 中的 version 字段
# Or use npm version command:

npm version patch  # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor  # 1.0.0 -> 1.1.0 (new features)
npm version major  # 1.0.0 -> 2.0.0 (breaking changes)
```

### 2. 测试包 / Test the package

```bash
# 本地测试 / Test locally
npm pack

# 这会创建一个 .tgz 文件
# This creates a .tgz file

# 在另一个目录测试安装 / Test install in another directory
cd /tmp
npm install ../claude-chats-sync-1.0.0.tgz
claude-chats-sync --help
```

### 3. 检查将要发布的文件 / Check files to be published

```bash
# 查看将要包含在包中的文件
# See files that will be included in the package
npm pack --dry-run
```

### 4. 发布到 npm / Publish to npm

```bash
# 发布公共包 / Publish as public package
npm publish --access public

# 如果是 scoped package (@username/package)，使用：
# For scoped packages, use:
# npm publish --access public
```

### 5. 验证发布 / Verify publication

```bash
# 访问 npm 页面确认 / Visit npm page to confirm
# https://www.npmjs.com/package/claude-chats-sync

# 或使用命令查看 / Or check with command
npm view claude-chats-sync
```

### 6. 测试安装 / Test installation

```bash
# 全局安装测试 / Test global install
npm install -g claude-chats-sync
claude-chats-sync --help
claude-chats-sync status
```

## 发布后任务 / Post-publishing Tasks

### 1. 创建 Git tag / Create Git tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. 创建 GitHub Release / Create GitHub Release

1. 访问 GitHub 仓库 / Visit GitHub repository
2. 点击 "Releases" / Click "Releases"
3. 点击 "Draft a new release" / Click "Draft a new release"
4. 选择 tag / Select tag
5. 填写 release notes / Fill in release notes
6. 发布 / Publish

### 3. 更新文档 / Update documentation

- [ ] README.md 版本徽章 / Version badge in README.md
- [ ] CHANGELOG.md 更新 / Update CHANGELOG.md
- [ ] 其他相关文档 / Other relevant documentation

## 更新版本 / Updating Versions

### 开发流程 / Development workflow

```bash
# 1. 创建新分支 / Create new branch
git checkout -b feature/new-feature

# 2. 进行更改并提交 / Make changes and commit
git add .
git commit -m "Add: new feature"

# 3. 更新版本号 / Update version
npm version minor  # 或 major/patch

# 4. 推送到 GitHub / Push to GitHub
git push origin feature/new-feature
git push origin --tags

# 5. 创建 Pull Request / Create Pull Request

# 6. 合并后发布 / After merge, publish
git checkout main
git pull
npm publish --access public
```

## 回滚发布 / Rollback Release

如果发现问题需要回滚 / If issues found and need to rollback:

```bash
# 1. 取消发布 / Deprecate the version
npm deprecate claude-chats-sync@1.0.0 "Critical bug, please upgrade to 1.0.1"

# 2. 发布修复版本 / Publish fix version
npm version patch
npm publish --access public
```

## 常见问题 / Common Issues

### E403 Forbidden / Forbidden error

```bash
# 检查是否登录 / Check if logged in
npm whoami

# 重新登录 / Re-login
npm login
```

### 包名已存在 / Package name exists

```bash
# 在 package.json 中更改 name 字段
# Change 'name' field in package.json
# 例如 / e.g., "claude-chats-sync2"
```

### 需要双重验证 / 2FA required

如果启用了双重验证，需要输入 OTP / If 2FA enabled, enter OTP:
```bash
npm publish --access public
# 会提示输入 OTP / Will prompt for OTP
```

## CI/CD 自动发布 / CI/CD Auto-publishing

考虑使用 GitHub Actions 自动发布 / Consider using GitHub Actions for auto-publishing:

创建 `.github/workflows/publish.yml` / Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

在 GitHub 仓库设置中添加 `NPM_TOKEN` secret / Add `NPM_TOKEN` secret in GitHub repo settings.

## 有用的 npm 命令 / Useful npm commands

```bash
# 查看包信息 / View package info
npm view claude-chats-sync

# 查看包的所有版本 / View all versions
npm view claude-chats-sync versions

# 查看包的文件 / View package files
npm view claude-chats-sync@1.0.0

# 搜索包 / Search package
npm search claude-code-chats-sync

# 取消发布版本（危险！）/ Unpublish version (dangerous!)
# npm unpublish claude-chats-sync@1.0.0
# 注意：只能在发布后 72 小时内取消 / Note: Only within 72 hours
```

## 安全提示 / Security Tips

1. **不要在代码中暴露敏感信息** / Don't expose sensitive info in code
   - API keys
   - Passwords
   - Tokens

2. **使用 `.npmignore`** / Use `.npmignore`
   - 排除测试文件 / Exclude test files
   - 排除开发配置 / Exclude dev configs
   - 排除敏感文件 / Exclude sensitive files

3. **定期更新依赖** / Update dependencies regularly
   ```bash
   npm audit
   npm audit fix
   ```

4. **启用 2FA** / Enable 2FA on npm account

## 推广 / Promotion

发布后别忘了推广 / After publishing, don't forget to promote:

- [ ] 更新 VSCode 扩展文档 / Update VSCode extension docs
- [ ] 在社交媒体分享 / Share on social media
- [ ] 提交到相关目录 / Submit to directories
- [ ] 写博客文章 / Write blog post

---

祝你发布顺利！/ Good luck with your publishing! 🚀
