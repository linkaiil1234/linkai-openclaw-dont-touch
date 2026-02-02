'use server';

import { redis } from '@/lib/redis';

export interface Task {
  id: string;
  title: string;
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'done';
}

const TASKS_KEY = 'openclaw:tasks';

export async function getTasks(): Promise<Task[]> {
  try {
    const data = await redis.hgetall(TASKS_KEY);
    if (!data) return [];
    return Object.values(data) as Task[];
  } catch {
    return [];
  }
}
