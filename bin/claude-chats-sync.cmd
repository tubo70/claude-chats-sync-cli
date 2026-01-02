@echo off
REM Claude Code Sync CLI - Windows batch wrapper

set SCRIPT_DIR=%~dp0
node "%SCRIPT_DIR%claude-sync.js" %*
