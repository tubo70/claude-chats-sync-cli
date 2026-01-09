#!/usr/bin/env node

/**
 * Claude Code Sync CLI
 *
 * 跨平台命令行工具，用于同步 Claude Code 聊天会话到项目目录
 * Cross-platform CLI tool to sync Claude Code chat sessions to project directory
 *
 * Usage:
 *   node claude-sync-cli.js init              # Initialize sync
 *   node claude-sync-cli.js status            # Check sync status
 *   node claude-sync-cli.js open              # Open history folder
 *   node claude-sync-cli.js clean             # Clean sensitive data from session files
 *   node claude-sync-cli.js setup-git-filter  # Setup Git filter for auto-cleaning
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// ANSI 颜色代码 / ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 工具函数 / Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ Error: ${message}`, 'red');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * 规范化项目路径为 Claude Code 格式
 * Normalize project path to Claude Code format
 *
 * Windows:   D:\Projects\MyProject -> d--Projects-MyProject
 * Linux/Mac: /home/user/projects/my-project -> -home-user-projects-my-project
 */
function normalizeProjectPath(projectPath) {
  if (process.platform === 'win32') {
    // Windows: Replace backslashes and colons with dashes, preserve case
    return projectPath
      .replace(/\\/g, '-')
      .replace(/:/g, '-');
  } else {
    // Linux/Mac: Replace forward slashes with dashes, preserve case
    // Note: Claude Code adds a leading dash for Unix paths
    return projectPath
      .replace(/^\//, '-')      // Replace leading slash with dash
      .replace(/\//g, '-');     // Replace remaining slashes with dashes
  }
}

/**
 * 获取 Claude Code 项目目录
 * Get Claude Code projects directory
 */
function getClaudeProjectsDir() {
  return path.join(os.homedir(), '.claude', 'projects');
}

/**
 * 获取项目中的历史文件夹路径
 * Get history folder path in the project
 */
function getHistoryFolderPath(projectPath, folderName = '.claudeCodeSessions') {
  return path.join(projectPath, folderName);
}

/**
 * 创建符号链接 (跨平台)
 * Create symbolic link (cross-platform)
 */
function createSymlink(target, linkPath) {
  if (process.platform === 'win32') {
    // Windows: 使用 junction (不需要管理员权限)
    // Windows: Use junction (no admin privileges required)
    fs.symlinkSync(target, linkPath, 'junction');
  } else {
    // Unix: 使用符号链接
    // Unix: Use symbolic link
    fs.symlinkSync(target, linkPath);
  }
}

/**
 * 检查是否为符号链接（并验证链接指向）
 * Check if path is a symbolic link (and verify link target)
 */
function isSymlink(symlinkPath, expectedTarget) {
  try {
    const stats = fs.lstatSync(symlinkPath);

    // Unix: 检查是否为符号链接
    if (process.platform !== 'win32') {
      return stats.isSymbolicLink();
    }

    // Windows: 需要区分 junction 和普通目录
    // 检查是否为符号链接或 junction
    if (stats.isSymbolicLink()) {
      return true;
    }

    // 对于 Windows，如果是目录，还需要检查是否为 junction
    // 并且验证其指向是否正确
    if (stats.isDirectory()) {
      try {
        // 读取链接目标
        const target = fs.readlinkSync(symlinkPath);
        // 如果能读取到链接目标，说明是 junction 或符号链接
        // 如果提供了期望目标，则验证是否匹配
        if (expectedTarget) {
          return path.resolve(target) === path.resolve(expectedTarget);
        }
        return true;
      } catch {
        // 如果读取链接失败，说明是普通目录，不是链接
        return false;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * 移动目录 (递归)
 * Move directory (recursive)
 */
function moveDirectory(src, dest) {
  // 创建目标目录
  fs.mkdirSync(dest, { recursive: true });

  // 递归复制所有文件和子目录
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      moveDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  // 删除源目录
  fs.rmSync(src, { recursive: true, force: true });
}

/**
 * 合并两个目录的文件
 * Merge files from two directories
 */
function mergeDirectories(src, dest) {
  // 确保目标目录存在
  fs.mkdirSync(dest, { recursive: true });

  // 读取源目录中的所有文件
  const entries = fs.readdirSync(src, { withFileTypes: true });

  let mergedCount = 0;

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 递归合并子目录
      mergeDirectories(srcPath, destPath);
    } else {
      // 如果目标文件不存在，则复制；如果存在，跳过（保留目标文件）
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        mergedCount++;
      }
    }
  }

  return mergedCount;
}

/**
 * 清理会话文件内容中的敏感信息
 * Clean sensitive information from session file content
 */
function cleanSensitiveData(content) {
  // Pattern for Anthropic API keys (normal format)
  const apiKeyPattern = /"primaryApiKey"\s*:\s*"sk-ant-[^"]*"/g;

  // Pattern for API keys within escaped JSON strings
  const apiKeyPatternEscaped = /\\"primaryApiKey\\":\s*\\"sk-ant-[^"]*\\"/g;

  // Pattern for ANTHROPIC_AUTH_TOKEN (escaped format)
  const authTokenPatternEscaped = /\\"ANTHROPIC_AUTH_TOKEN\\"\\s*:\\s*\\"[^"]*\\"/g;

  // Pattern for other API keys
  const genericApiKeyPattern = /"(apiKey|api_key|authorization|token|bearer)"\s*:\s*"[^"]*"/gi;

  // Clean API keys
  let cleaned = content.replace(apiKeyPattern, '"primaryApiKey": "[REDACTED]"');
  cleaned = cleaned.replace(apiKeyPatternEscaped, '\\"primaryApiKey\\": \\"[REDACTED]\\"');
  cleaned = cleaned.replace(authTokenPatternEscaped, '\\"ANTHROPIC_AUTH_TOKEN\\": \\"[REDACTED]\\"');
  cleaned = cleaned.replace(genericApiKeyPattern, '"$1": "[REDACTED]"');

  return cleaned;
}

/**
 * 初始化同步
 * Initialize sync
 */
function init(projectPath, options = {}) {
  const { folderName = '.claudeCodeSessions', force = false } = options;

  const historyFolder = getHistoryFolderPath(projectPath, folderName);
  const claudeProjectsDir = getClaudeProjectsDir();
  const normalizedPath = normalizeProjectPath(projectPath);
  const symlinkPath = path.join(claudeProjectsDir, normalizedPath);

  try {
    // 检查符号链接是否已存在
    // Check if symlink already exists
    if (fs.existsSync(symlinkPath)) {
      if (isSymlink(symlinkPath, historyFolder)) {
        success('Claude Code Chats Sync already initialized');
        info(`History folder: ${historyFolder}`);
        info(`Linked to: ${symlinkPath}`);
        return;
      } else if (fs.lstatSync(symlinkPath).isDirectory()) {
        // 现有真实目录 - 用户之前使用过 Claude Code
        // Existing real directory - user has used Claude Code before
        const claudeStorageFiles = fs.readdirSync(symlinkPath);
        const claudeStorageSessions = claudeStorageFiles.filter(f => f.endsWith('.jsonl'));

        // 检查项目中是否已经有会话文件夹
        const projectHistoryExists = fs.existsSync(historyFolder);
        let projectSessions = [];
        if (projectHistoryExists) {
          projectSessions = fs.readdirSync(historyFolder).filter(f => f.endsWith('.jsonl'));
        }

        // 场景1: Claude存储和项目中都没有会话文件
        if (claudeStorageSessions.length === 0 && projectSessions.length === 0) {
          // 都是空目录，直接删除Claude存储的目录
          fs.rmSync(symlinkPath, { recursive: true, force: true });
        }
        // 场景2: 只有Claude存储中有会话文件
        else if (claudeStorageSessions.length > 0 && projectSessions.length === 0) {
          if (!force) {
            warn(`Found ${claudeStorageSessions.length} existing Claude Code session(s) in Claude's storage.`);
            info('Use --force to move them to your project folder');
            return;
          }
          // 移动Claude存储的目录到项目文件夹
          moveDirectory(symlinkPath, historyFolder);
          success(`Moved ${claudeStorageSessions.length} session(s) to project folder!`);
        }
        // 场景3: 只有项目中有会话文件
        else if (claudeStorageSessions.length === 0 && projectSessions.length > 0) {
          // 删除Claude存储中的空目录
          fs.rmSync(symlinkPath, { recursive: true, force: true });
          info(`Using existing ${projectSessions.length} session(s) from project folder`);
        }
        // 场景4: Claude存储和项目中都有会话文件 - 需要合并
        else if (claudeStorageSessions.length > 0 && projectSessions.length > 0) {
          if (!force) {
            warn(`Found sessions in both locations:`);
            info(`  - Claude's storage: ${claudeStorageSessions.length} session(s)`);
            info(`  - Project folder: ${projectSessions.length} session(s)`);
            info('Use --force to merge them into your project folder');
            return;
          }
          // 合并目录: 将Claude存储的会话合并到项目中
          const mergedCount = mergeDirectories(symlinkPath, historyFolder);
          fs.rmSync(symlinkPath, { recursive: true, force: true });
          success(`Merged ${mergedCount} session(s) from Claude's storage to project folder!`);
          info(`Total sessions in project: ${projectSessions.length + mergedCount}`);
        }
      } else {
        error(`A file exists at Claude Code location: ${symlinkPath}`);
        return;
      }
    }

    // 创建历史文件夹 (如果不存在)
    // Create history folder if it doesn't exist
    if (!fs.existsSync(historyFolder)) {
      fs.mkdirSync(historyFolder, { recursive: true });
      success(`Created folder: ${historyFolder}`);
    } else {
      // 显示项目中的会话数量
      const existingSessions = fs.readdirSync(historyFolder).filter(f => f.endsWith('.jsonl'));
      if (existingSessions.length > 0) {
        info(`Using existing ${existingSessions.length} session(s) from project folder`);
      }
    }

    // 确保 .claude/projects 目录存在
    // Ensure .claude/projects directory exists
    if (!fs.existsSync(claudeProjectsDir)) {
      fs.mkdirSync(claudeProjectsDir, { recursive: true });
    }

    // 创建符号链接
    // Create symbolic link
    createSymlink(historyFolder, symlinkPath);

    success('Claude Code Chats Sync initialized!');
    info(`History folder: ${historyFolder}`);
    info(`Linked to: ${symlinkPath}`);

    // 添加到 .gitignore
    // Add to .gitignore
    addToGitIgnore(projectPath, folderName);

    // 设置 Git 过滤器
    // Setup Git filter
    setupGitFilter(projectPath, folderName, false);

  } catch (err) {
    error(`Failed to initialize: ${err.message}`);
  }
}

/**
 * 检查同步状态
 * Check sync status
 */
function status(projectPath, options = {}) {
  const { folderName = '.claudeCodeSessions' } = options;

  const historyFolder = getHistoryFolderPath(projectPath, folderName);
  const claudeProjectsDir = getClaudeProjectsDir();
  const normalizedPath = normalizeProjectPath(projectPath);
  const symlinkPath = path.join(claudeProjectsDir, normalizedPath);

  log('\n📊 Claude Code Chats Sync Status\n', 'blue');

  // 检查历史文件夹
  // Check history folder
  if (fs.existsSync(historyFolder)) {
    const files = fs.readdirSync(historyFolder).filter(f => f.endsWith('.jsonl'));
    success('History folder exists');
    info(`   Path: ${historyFolder}`);
    info(`   Sessions: ${files.length}`);
  } else {
    error('History folder not found');
  }

  // 检查符号链接
  // Check symlink
  if (fs.existsSync(symlinkPath)) {
    success('Symlink created');
    info(`   Path: ${symlinkPath}`);
  } else {
    error('Symlink not created');
  }

  console.log('');
}

/**
 * 添加到 .gitignore
 * Add to .gitignore
 */
function addToGitIgnore(projectPath, folderName = '.claudeCodeSessions') {
  const gitignorePath = path.join(projectPath, '.gitignore');

  try {
    let content = '';
    if (fs.existsSync(gitignorePath)) {
      content = fs.readFileSync(gitignorePath, 'utf-8');
    }

    const ignoreEntry = `# Claude Code conversation history
# Uncomment the line below to ignore session files, OR configure Git filter for safe sharing
# ${folderName}/`;

    // 仅在不存在时添加
    // Only add if not already present
    if (!content.includes(`# ${folderName}/`) && !content.includes(`${folderName}/`)) {
      if (content && !content.endsWith('\n')) {
        content += '\n';
      }
      content += `\n${ignoreEntry}\n`;
      fs.writeFileSync(gitignorePath, content, 'utf-8');
      success('Added .gitignore entry (commented by default)');
    }
  } catch (err) {
    warn('Could not update .gitignore (not a Git repository?)');
  }
}

/**
 * 设置 Git 过滤器
 * Setup Git filter
 */
function setupGitFilter(projectPath, folderName = '.claudeCodeSessions', showMessage = true) {
  try {
    // 检查是否为 Git 仓库
    // Check if we're in a Git repository
    const gitDir = path.join(projectPath, '.git');
    if (!fs.existsSync(gitDir)) {
      warn('Not a Git repository. Git filter will not be configured.');
      return;
    }

    // 创建清理过滤器脚本
    // Create clean filter script
    const filterScriptPath = path.join(projectPath, '.gitfilters', 'clean-sessions.js');
    const filterDir = path.dirname(filterScriptPath);

    if (!fs.existsSync(filterDir)) {
      fs.mkdirSync(filterDir, { recursive: true });
    }

    const filterScript = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Pattern for Anthropic API keys (normal format)
const apiKeyPattern = /"primaryApiKey"\\\\s*:\\\\s*"sk-ant-[^"]*"/g;

// Pattern for API keys within escaped JSON strings
const apiKeyPatternEscaped = /\\\\\\\\"primaryApiKey\\\\\\\\"\\\\s*:\\\\\\\\s*\\\\\\"sk-ant-[^"]*\\\\\\"/g;

// Pattern for ANTHROPIC_AUTH_TOKEN (escaped format)
const authTokenPatternEscaped = /\\\\"ANTHROPIC_AUTH_TOKEN\\\\"\\\\s*:\\\\\\s*\\\\"[^"]*\\\\"/g;

// Pattern for other API keys
const genericApiKeyPattern = /"(apiKey|api_key|authorization|token|bearer)"\\\\s*:\\\\s*"[^"]*"/gi;

let data = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
    data += chunk;
});

process.stdin.on('end', () => {
    let cleaned = data.replace(apiKeyPattern, '"primaryApiKey": "[REDACTED]"');
    cleaned = cleaned.replace(apiKeyPatternEscaped, '\\\\\\\\"primaryApiKey\\\\\\\\": \\\\"[REDACTED]\\\\"');
    cleaned = cleaned.replace(authTokenPatternEscaped, '\\\\\\\\"ANTHROPIC_AUTH_TOKEN\\\\\\\\": \\\\"[REDACTED]\\\\"');
    cleaned = cleaned.replace(genericApiKeyPattern, '"$1": "[REDACTED]"');

    // Replace absolute path in cwd with project name only
    // Extract the last directory name from absolute paths
    cleaned = cleaned.replace(
        /"cwd"\\s*:\\s*"[^"]+?\\\\([^"\\\\]+)"/g,
        (match, projectName) => {
            return '"cwd": "' + projectName + '"';
        }
    );
    // Also handle Unix-style paths
    cleaned = cleaned.replace(
        /"cwd"\\s*:\\s*"\\/[^/]+\\/([^"]+)"/g,
        '"cwd": "$1"'
    );

    process.stdout.write(cleaned);
});
`;

    fs.writeFileSync(filterScriptPath, filterScript, 'utf-8');

    // 在 Unix-like 系统上设置为可执行
    // Make it executable on Unix-like systems
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(filterScriptPath, 0o755);
      } catch (e) {
        // Ignore permission errors
      }
    }

    // 创建 smudge 过滤器脚本
    // Create smudge filter script
    const smudgeScriptPath = path.join(projectPath, '.gitfilters', 'smudge-sessions.js');

    const smudgeScript = `#!/usr/bin/env node
const path = require('path');

let data = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
    data += chunk;
});

process.stdin.on('end', () => {
    // Get current working directory (absolute path)
    const currentPath = process.cwd();
    const projectName = path.basename(currentPath);

    // Replace project name in cwd with full absolute path
    // Pattern matches "cwd":"project-name"
    // Replaces with "cwd":"d:\\Projects\\tubo\\project-name" or "cwd":"/home/user/projects/project-name"
    const smudged = data.replace(
        /"cwd"\\s*:\\s*"([^"\\\/]+)"/g,
        (match, projectNameInFile) => {
            // Only replace if it looks like a project name (no path separators)
            if (!projectNameInFile.includes('\\\\') && !projectNameInFile.includes('/')) {
                // Convert to proper absolute path format for the current OS
                const absolutePath = path.resolve(currentPath);
                // Escape backslashes for JSON
                const escapedPath = absolutePath.replace(/\\\\/g, '\\\\\\\\');
                return '"cwd": "' + escapedPath + '"';
            }
            return match;
        }
    );

    process.stdout.write(smudged);
});
`;

    fs.writeFileSync(smudgeScriptPath, smudgeScript, 'utf-8');

    // 在 Unix-like 系统上设置为可执行
    // Make it executable on Unix-like systems
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(smudgeScriptPath, 0o755);
      } catch (e) {
        // Ignore permission errors
      }
    }

    // 在 .gitconfig 中配置 Git 过滤器
    // Configure Git filter in .gitconfig
    const gitConfigPath = path.join(projectPath, '.gitconfig');

    let gitConfig = '';
    if (fs.existsSync(gitConfigPath)) {
      gitConfig = fs.readFileSync(gitConfigPath, 'utf-8');
    }

    if (!gitConfig.includes('[filter "claude-clean"]')) {
      if (gitConfig && !gitConfig.endsWith('\n')) {
        gitConfig += '\n';
      }
      gitConfig += `[filter "claude-clean"]
	clean = node .gitfilters/clean-sessions.js
	smudge = node .gitfilters/smudge-sessions.js
`;
      fs.writeFileSync(gitConfigPath, gitConfig, 'utf-8');
    }

    // 在本地 Git 配置中配置过滤器
    // Configure the filter in local Git config
    try {
      execSync(
        `git config filter.claude-clean.clean "node .gitfilters/clean-sessions.js"`,
        { cwd: projectPath, stdio: 'pipe' }
      );
      execSync(
        `git config filter.claude-clean.smudge "node .gitfilters/smudge-sessions.js"`,
        { cwd: projectPath, stdio: 'pipe' }
      );
    } catch (err) {
      warn(`Failed to configure local Git filter: ${err.message}`);
    }

    // 在 .gitattributes 中配置过滤器
    // Configure the filter in .gitattributes
    const gitAttributesPath = path.join(projectPath, '.gitattributes');

    let gitAttributes = '';
    if (fs.existsSync(gitAttributesPath)) {
      gitAttributes = fs.readFileSync(gitAttributesPath, 'utf-8');
    }

    const filterLine = `${folderName}/*.jsonl filter=claude-clean`;

    if (!gitAttributes.includes(filterLine)) {
      if (gitAttributes && !gitAttributes.endsWith('\n')) {
        gitAttributes += '\n';
      }
      gitAttributes += `\n# Claude Code sessions - clean sensitive data on commit\n${filterLine}\n`;
      fs.writeFileSync(gitAttributesPath, gitAttributes, 'utf-8');
    }

    if (showMessage) {
      success('Git filter configured');
      info('Session files will be automatically cleaned on commit');
      info('Original files remain unchanged. Only committed versions are cleaned.');
    }

  } catch (err) {
    error(`Failed to setup Git filter: ${err.message}`);
  }
}

/**
 * 清理会话文件中的敏感数据
 * Clean sensitive data from session files
 */
function cleanSessions(projectPath, options = {}) {
  const { folderName = '.claudeCodeSessions' } = options;

  const historyFolder = getHistoryFolderPath(projectPath, folderName);

  if (!fs.existsSync(historyFolder)) {
    error('History folder does not exist');
    return;
  }

  const files = fs.readdirSync(historyFolder).filter(f => f.endsWith('.jsonl'));

  if (files.length === 0) {
    warn('No session files to clean');
    return;
  }

  info(`Cleaning ${files.length} session file(s)...`);

  let cleanedCount = 0;
  for (const file of files) {
    const filePath = path.join(historyFolder, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const cleaned = cleanSensitiveData(content);

    // 将清理后的内容写回文件
    // Write cleaned content back to file
    fs.writeFileSync(filePath, cleaned, 'utf-8');
    cleanedCount++;
  }

  success(`Cleaned ${cleanedCount} session file(s)`);
  info('Sensitive data has been redacted');
}

/**
 * 打开历史文件夹
 * Open history folder
 */
function openFolder(projectPath, options = {}) {
  const { folderName = '.claudeCodeSessions' } = options;

  const historyFolder = getHistoryFolderPath(projectPath, folderName);

  if (!fs.existsSync(historyFolder)) {
    error('History folder does not exist. Please initialize first.');
    return;
  }

  try {
    const { exec } = require('child_process');

    let command;
    switch (process.platform) {
      case 'darwin':
        command = 'open';
        break;
      case 'win32':
        command = 'explorer';
        break;
      default:
        command = 'xdg-open';
    }

    exec(`${command} "${historyFolder}"`);
    success(`Opened history folder: ${historyFolder}`);
  } catch (err) {
    error(`Failed to open folder: ${err.message}`);
  }
}

/**
 * 更新 Git 过滤器配置
 * Update Git filter configuration
 */
function updateGitFilter(projectPath, options = {}) {
  const { folderName = '.claudeCodeSessions' } = options;

  try {
    // 检查是否为 Git 仓库
    // Check if we're in a Git repository
    const gitDir = path.join(projectPath, '.git');
    if (!fs.existsSync(gitDir)) {
      error('Not a Git repository');
      return false;
    }

    // 检查是否已经初始化
    // Check if already initialized
    const historyFolder = getHistoryFolderPath(projectPath, folderName);
    if (!fs.existsSync(historyFolder)) {
      error('Project not initialized. Please run "init" first.');
      return false;
    }

    info('Updating Git filter configuration...');

    // 重新设置 Git 过滤器
    // Re-setup Git filter
    setupGitFilter(projectPath, folderName, true);

    success('Git filter updated successfully!');
    info('New features:');
    info('  - Smudge filter: Restores absolute paths on checkout');
    info('  - Enhanced clean filter: Removes absolute paths from cwd field');
    info('  - Updated pattern: Matches all .jsonl files in subdirectories');

    return true;
  } catch (err) {
    error(`Failed to update: ${err.message}`);
    return false;
  }
}

/**
 * 显示帮助信息
 * Show help message
 */
function showHelp() {
  const help = `
Claude Code Sync CLI - 跨平台 Claude Code 会话同步工具
Claude Code Sync CLI - Cross-platform Claude Code session sync tool

Usage:  node claude-sync-cli.js <command> [options]

Commands:
  init                  Initialize sync for current project
  status                Check sync status and session count
  open                  Open history folder in file manager
  clean                 Clean sensitive data from session files
  setup-git-filter      Setup Git filter for automatic cleaning
  update                Update Git filter to latest version
  help                  Show this help message

Options:
  --folder-name <name>  History folder name (default: .claudeCodeSessions)
  --force               Force migration of existing sessions
  --project-path <path> Project path (default: current directory)

Examples:
  node claude-chats-sync.js init
  node claude-chats-sync.js init --folder-name .sessions
  node claude-chats-sync.js init --force
  node claude-chats-sync.js status
  node claude-chats-sync.js clean
  node claude-chats-sync.js setup-git-filter
  node claude-chats-sync.js update

For more information, visit: https://github.com/tubo70/claude-chats-sync-cli

Environment Variables:
  ANTHROPIC_AUTH_TOKEN  Recommended: Configure API key via env var
  ANTHROPIC_BASE_URL    Optional: Third-party API endpoint

For more information, visit: https://github.com/tubo70/claude-chats-sync-cli
`;

  console.log(help);
}

/**
 * 主函数
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // 解析选项
  // Parse options
  const options = {};
  let projectPath = process.cwd();

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--folder-name' && args[i + 1]) {
      options.folderName = args[++i];
    } else if (arg === '--project-path' && args[i + 1]) {
      projectPath = args[++i];
    } else if (arg === '--force') {
      options.force = true;
    }
  }

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  switch (command) {
    case 'init':
      init(projectPath, options);
      break;
    case 'status':
      status(projectPath, options);
      break;
    case 'open':
      openFolder(projectPath, options);
      break;
    case 'clean':
      cleanSessions(projectPath, options);
      break;
    case 'setup-git-filter':
      setupGitFilter(projectPath, options.folderName, true);
      break;
    case 'update':
      updateGitFilter(projectPath, options);
      break;
    default:
      error(`Unknown command: ${command}`);
      info('Run "node claude-sync-cli.js help" for usage information');
      process.exit(1);
  }
}

// 运行主函数
// Run main function
main();
