'use server';

import fs from 'fs/promises';
import path from 'path';

// Fix: Use process.cwd() for Vercel environment
const PROJECT_ROOT = process.cwd();

export async function getFileList() {
  try {
    // We moved everything to 'knowledge' inside the project for Vercel deployment
    const knowledgePath = path.join(PROJECT_ROOT, 'knowledge');
    let knowledgeFiles: string[] = [];
    
    try {
        const files = await fs.readdir(knowledgePath);
        knowledgeFiles = files.filter(f => f.endsWith('.md'));
    } catch (e) {
        console.error('Failed to read knowledge dir:', e);
        return [];
    }

    return knowledgeFiles;
  } catch (e) {
    console.error('Docs listing error', e);
    return [];
  }
}

export async function getFileContent(filename: string) {
  if (filename.includes('..')) return '# Access Denied';
  
  try {
    // Read directly from the knowledge folder inside the project
    const filePath = path.join(PROJECT_ROOT, 'knowledge', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Read error:', error);
    return '# Error: Could not read file. ' + error;
  }
}
