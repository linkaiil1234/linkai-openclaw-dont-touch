'use server';

import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';

export interface Task {
  id: string;
  title: string;
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'done';
  tags?: string[];
  value?: string;
}

const TASKS_KEY = 'openclaw:tasks';

export async function getTasks(): Promise<Task[]> {
  try {
    const data = await redis.hgetall(TASKS_KEY);
    if (!data) return [];
    
    // Parse JSON strings if necessary (Redis hgetall returns object with string values if stored as strings)
    // But based on previous seed, we might be storing objects directly if using @upstash/redis REST properly?
    // Actually, @upstash/redis hgetall returns an object where values are what you stored.
    // The previous code cast it: Object.values(data).
    // Let's ensure robust parsing.
    return Object.values(data).map(item => 
      typeof item === 'string' ? JSON.parse(item) : item
    ) as Task[];
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return [];
  }
}

export async function updateTaskStatus(id: string, status: Task['status']) {
  try {
    // We need to get the task first to preserve other fields
    const rawTask = await redis.hget(TASKS_KEY, id);
    if (!rawTask) return { success: false };
    
    const task = typeof rawTask === 'string' ? JSON.parse(rawTask) : rawTask;
    task.status = status;
    
    await redis.hset(TASKS_KEY, { [id]: JSON.stringify(task) });
    revalidatePath('/admin/tasks');
    return { success: true };
  } catch (error) {
    console.error('Failed to update task:', error);
    return { success: false };
  }
}

export async function createTask(title: string) {
    const id = crypto.randomUUID();
    const task: Task = {
        id,
        title,
        status: 'pending',
        tags: ['New'],
        assignedTo: 'AI'
    };
    await redis.hset(TASKS_KEY, { [id]: JSON.stringify(task) });
    revalidatePath('/admin/tasks');
    return { success: true };
}
