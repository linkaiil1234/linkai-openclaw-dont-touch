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
const WORKERS_KEY = 'openclaw:workers';

export async function getWorkers() {
    try {
        const data = await redis.hgetall(WORKERS_KEY);
        if (!data) return [];
        return Object.values(data).map(w => {
            try { return typeof w === 'string' ? JSON.parse(w) : w; } catch { return null; }
        }).filter(Boolean);
    } catch {
        return [];
    }
}

export async function getTasks(): Promise<Task[]> {
  try {
    const data = await redis.hgetall(TASKS_KEY);
    if (!data) return [];
    
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
