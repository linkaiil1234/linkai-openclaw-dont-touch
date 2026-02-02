'use server';

import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';

const TASKS_KEY = 'openclaw:tasks';
const WORKERS_KEY = 'openclaw:workers';
const LOGS_KEY = 'openclaw:system-logs';

export async function terminateTask(taskId: string) {
  try {
    // 1. Delete from Tasks
    await redis.hdel(TASKS_KEY, taskId);

    // 2. Log it
    const log = {
      id: crypto.randomUUID(),
      action: `Terminated Task: ${taskId}`,
      status: 'Success',
      timestamp: Date.now(),
    };
    await redis.lpush(LOGS_KEY, log);
    await redis.ltrim(LOGS_KEY, 0, 99);

    revalidatePath('/admin/tasks');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to terminate' };
  }
}

export async function assignTask(taskId: string, workerId: string, taskTitle: string) {
  try {
    // 1. Update Task
    const taskData = await redis.hget(TASKS_KEY, taskId);
    if (taskData) {
      const task = typeof taskData === 'string' ? JSON.parse(taskData) : taskData;
      task.assignedTo = workerId;
      task.status = 'in-progress';
      await redis.hset(TASKS_KEY, { [taskId]: task });
    }

    // 2. Update Worker
    const workerData = await redis.hget(WORKERS_KEY, workerId);
    if (workerData) {
      const worker = typeof workerData === 'string' ? JSON.parse(workerData) : workerData;
      worker.status = 'busy';
      worker.currentTask = taskTitle;
      await redis.hset(WORKERS_KEY, { [workerId]: worker });
    }

    // 3. Log
    const log = {
      id: crypto.randomUUID(),
      action: `Assigned ${workerId} to ${taskTitle}`,
      status: 'Success',
      timestamp: Date.now(),
    };
    await redis.lpush(LOGS_KEY, log);
    await redis.ltrim(LOGS_KEY, 0, 99);

    revalidatePath('/admin/workers');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to assign' };
  }
}
