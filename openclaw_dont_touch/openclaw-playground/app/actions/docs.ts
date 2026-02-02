'use server';

import fs from 'fs/promises';
import path from 'path';

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/linkai/.openclaw/workspace';

// Whitelist of files allowed to be viewed
const ALLOWED_FILES = [
  'MEMORY.md',
  'SOUL.md',
  'USER.md',
  'HEARTBEAT.md',
  'AGENTS.md',
  'TOOLS.md',
  'THE_GRAND_GAP_ANALYSIS.md'
];

export async function getFileList() {
  // Return list of existing files from the allowlist
  const files = [];
  for (const file of ALLOWED_FILES) {
    try {
      await fs.access(path.join(WORKSPACE, file));
      files.push(file);
    } catch {
      // File doesn't exist, skip
    }
  }
  return files;
}

export async function getFileContent(filename: string) {
  if (!ALLOWED_FILES.includes(filename)) {
    return '# Error: Access Denied';
  }
  try {
    const content = await fs.readFile(path.join(WORKSPACE, filename), 'utf-8');
    return content;
  } catch (error) {
    return '# Error: Could not read file';
  }
}
