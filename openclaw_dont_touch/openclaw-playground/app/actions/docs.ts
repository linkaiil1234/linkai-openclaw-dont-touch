'use server';

import fs from 'fs/promises';
import path from 'path';

const WORKSPACE = '/Users/linkai/.openclaw/workspace';

export async function getFileList() {
  try {
    const rootFiles = ['MEMORY.md', 'SOUL.md', 'STRATEGY.md']; // Essential root files
    
    // Check root files existence
    const availableRoot = [];
    for (const file of rootFiles) {
        try { await fs.access(path.join(WORKSPACE, file)); availableRoot.push(file); } catch {}
    }

    // Check knowledge folder
    const knowledgePath = path.join(WORKSPACE, 'knowledge');
    let knowledgeFiles = [];
    try {
        const files = await fs.readdir(knowledgePath);
        knowledgeFiles = files.filter(f => f.endsWith('.md')).map(f => `knowledge/${f}`);
    } catch {
        // knowledge dir might not exist yet
    }

    return [...availableRoot, ...knowledgeFiles];
  } catch (e) {
    console.error('Docs listing error', e);
    return [];
  }
}

export async function getFileContent(filename: string) {
  // Security: prevent traversal
  if (filename.includes('..')) return '# Access Denied';
  
  try {
    const content = await fs.readFile(path.join(WORKSPACE, filename), 'utf-8');
    return content;
  } catch (error) {
    return '# Error: Could not read file';
  }
}
