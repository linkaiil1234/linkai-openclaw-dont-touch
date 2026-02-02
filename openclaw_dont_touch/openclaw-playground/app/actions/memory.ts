'use server';

import { redis } from '@/lib/redis';

export interface MemoryBlock {
  title: string;
  content: string[]; // List of bullet points
  tags: string[];
  lastUpdated: number;
}

const MEMORY_KEY = 'openclaw:long-term-memory';

export async function getMemory(): Promise<MemoryBlock[]> {
  try {
    // We'll store memory as a list of JSON strings for now, or just a known structure
    // Let's use a simple list of keys or a single big JSON object.
    // Simpler: A Hash where field is Title.
    const data = await redis.hgetall(MEMORY_KEY);
    if (!data) return [];
    
    return Object.values(data) as MemoryBlock[];
  } catch {
    return [];
  }
}
