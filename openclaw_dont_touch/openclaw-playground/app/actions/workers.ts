'use server';

import { redis } from '@/lib/redis';

export interface Worker {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'busy' | 'offline';
  currentTask?: string;
  capabilities: string[];
}

const WORKERS_KEY = 'openclaw:workers';

export async function getWorkers(): Promise<Worker[]> {
  try {
    const data = await redis.hgetall(WORKERS_KEY);
    if (!data) return [];
    
    // Redis returns object { id: jsonString, id2: jsonString } if using hset properly
    // Or if passing object directly to hset, it returns object { field: value }.
    // Let's assume we store JSON strings as values for flexibility.
    
    // Actually, upstash-redis auto-deserializes JSON if stored as object.
    // Let's iterate values.
    return Object.values(data) as Worker[];
  } catch (error) {
    console.error('Failed to fetch workers:', error);
    return [];
  }
}

export async function addWorker(worker: Worker) {
  try {
    await redis.hset(WORKERS_KEY, { [worker.id]: worker });
    return worker;
  } catch (error) {
    console.error('Failed to add worker:', error);
    throw error;
  }
}
