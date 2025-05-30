#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const rules = require('./rules/dark-patterns');

const SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css'];

function scanFile(filePath) {
  const results = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    rules.forEach(rule => {
      if (rule.regex.test(line)) {
        results.push({
          file: filePath,
          line: idx + 1,
          pattern: rule.name,
          description: rule.description,
          match: line.trim()
        });
      }
    });
  });
  return results;
}

function scanDirectory(dirPath) {
  let results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDirectory(fullPath));
    } else if (SUPPORTED_EXTENSIONS.includes(path.extname(entry.name))) {
      results = results.concat(scanFile(fullPath));
    }
  });
  return results;
}

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

function getAuthenticatedRepoUrl(repoUrl, token) {
  // Only modify if using HTTPS and token is set
  if (!token) return repoUrl;
  if (!repoUrl.startsWith('https://')) return repoUrl;
  // Insert token after https://
  return repoUrl.replace('https://', `https://${token}@`);
}

function main() {
  const args = process.argv.slice(2);
  let target = args[0];
  let isGithub = false;
  let tempDir = null;

  if (args[0] === '--github' && args[1]) {
    isGithub = true;
    let repoUrl = args[1];
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      repoUrl = getAuthenticatedRepoUrl(repoUrl, token);
      console.log('Using GITHUB_TOKEN for authentication.');
    }
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'humane-linter-'));
    console.log(`Cloning ${args[1]} to ${tempDir}...`);
    try {
      execSync(`git clone --depth 1 ${repoUrl} ${tempDir}`, { stdio: 'inherit' });
    } catch (err) {
      console.error('Failed to clone repository:', err.message);
      process.exit(1);
    }
    target = tempDir;
  }

  if (!target) {
    console.error('Usage: node index.js <path-to-scan> OR node index.js --github <repo-url>');
    process.exit(1);
  }
  const absPath = path.resolve(target);
  if (!fs.existsSync(absPath)) {
    console.error('Path does not exist:', absPath);
    process.exit(1);
  }

  let results = [];
  if (fs.lstatSync(absPath).isDirectory()) {
    results = scanDirectory(absPath);
  } else {
    results = scanFile(absPath);
  }

  // Console output
  if (results.length === 0) {
    console.log('✅ No dark patterns detected!');
  } else {
    console.log(`\nFound ${results.length} potential dark pattern(s):\n`);
    results.forEach(r => {
      console.log(`- [${r.pattern}] ${r.description}\n  File: ${r.file}\n  Line: ${r.line}\n  Match: ${r.match}\n`);
    });
  }

  // Write JSON report
  const reportPath = path.join(process.cwd(), 'humane-linter-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nReport written to ${reportPath}`);

  // Clean up temp dir if used
  if (isGithub && tempDir) {
    console.log(`Cleaning up temporary directory: ${tempDir}`);
    deleteFolderRecursive(tempDir);
  }
}

main();
