#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Pattern for Anthropic API keys (normal format)
const apiKeyPattern = /"primaryApiKey"\\s*:\\s*"sk-ant-[^"]*"/g;

// Pattern for API keys within escaped JSON strings
const apiKeyPatternEscaped = /\\\\"primaryApiKey\\\\"\\s*:\\\\s*\\\"sk-ant-[^"]*\\\"/g;

// Pattern for ANTHROPIC_AUTH_TOKEN (escaped format)
const authTokenPatternEscaped = /\\"ANTHROPIC_AUTH_TOKEN\\"\\s*:\\\s*\\"[^"]*\\"/g;

// Pattern for other API keys
const genericApiKeyPattern = /"(apiKey|api_key|authorization|token|bearer)"\\s*:\\s*"[^"]*"/gi;

let data = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
    data += chunk;
});

process.stdin.on('end', () => {
    let cleaned = data.replace(apiKeyPattern, '"primaryApiKey": "[REDACTED]"');
    cleaned = cleaned.replace(apiKeyPatternEscaped, '\\\\"primaryApiKey\\\\": \\"[REDACTED]\\"');
    cleaned = cleaned.replace(authTokenPatternEscaped, '\\\\"ANTHROPIC_AUTH_TOKEN\\\\": \\"[REDACTED]\\"');
    cleaned = cleaned.replace(genericApiKeyPattern, '"$1": "[REDACTED]"');

    // Replace absolute path in cwd with project name only
    // Extract the last directory name from absolute paths
    cleaned = cleaned.replace(
        /"cwd"\s*:\s*"[^"]+?\\([^"\\]+)"/g,
        (match, projectName) => {
            return '"cwd": "' + projectName + '"';
        }
    );
    // Also handle Unix-style paths
    cleaned = cleaned.replace(
        /"cwd"\s*:\s*"\/[^/]+\/([^"]+)"/g,
        '"cwd": "$1"'
    );

    process.stdout.write(cleaned);
});
