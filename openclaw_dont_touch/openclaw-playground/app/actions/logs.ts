'use server';

import { redis } from '@/lib/redis';

export interface SystemLog {
  id: string;
  action: string;
  status: 'Success' | 'Error' | 'Pending';
  timestamp: number;
}

const LOGS_KEY = 'openclaw:system-logs';

export async function getLogs(limit: number = 10): Promise<SystemLog[]> {
  try {
    const logs = await redis.lrange(LOGS_KEY, 0, limit - 1);
    // Redis returns strings if stored as JSON strings, need to parse
    // But upstash-redis might auto-parse if object was stored directly. 
    // Let's assume we store objects directly for now, upstash handles json.
    return logs as unknown as SystemLog[];
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return [];
  }
}

export async function addLog(action: string, status: SystemLog['status'] = 'Success') {
  const log: SystemLog = {
    id: crypto.randomUUID(),
    action,
    status,
    timestamp: Date.now(),
  };

  try {
    // LPUSH adds to the head of the list (newest first)
    await redis.lpush(LOGS_KEY, log);
    // Trim to keep only last 100 logs
    await redis.ltrim(LOGS_KEY, 0, 99);
    return log;
  } catch (error) {
    console.error('Failed to add log:', error);
    throw error;
  }
}
