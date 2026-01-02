# Claude Code Sync CLI - PowerShell wrapper

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$CliScript = Join-Path $ScriptDir "claude-sync.js"

# Check if Node.js is installed
try {
    $null = & node --version 2>&1
} catch {
    Write-Host "❌ Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Run the CLI script
& node $CliScript $args
exit $LASTEXITCODE
