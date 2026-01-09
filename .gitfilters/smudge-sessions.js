#!/usr/bin/env node
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
    // Replaces with "cwd":"d:\Projects\tubo\project-name" or "cwd":"/home/user/projects/project-name"
    const smudged = data.replace(
        /"cwd"\s*:\s*"([^"\/]+)"/g,
        (match, projectNameInFile) => {
            // Only replace if it looks like a project name (no path separators)
            if (!projectNameInFile.includes('\\') && !projectNameInFile.includes('/')) {
                // Convert to proper absolute path format for the current OS
                const absolutePath = path.resolve(currentPath);
                // Escape backslashes for JSON
                const escapedPath = absolutePath.replace(/\\/g, '\\\\');
                return '"cwd": "' + escapedPath + '"';
            }
            return match;
        }
    );

    process.stdout.write(smudged);
});
