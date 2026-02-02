'use server';

import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { TEMPLATES } from '@/lib/templates';

// Re-export types if needed, but better to import from lib
export type { WorkerTemplate } from '@/lib/templates';

export interface Worker {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'busy' | 'offline';
  currentTask?: string;
  capabilities: string[];
  templateId?: string;
}

const WORKERS_KEY = 'openclaw:workers';

export async function getWorkers(): Promise<Worker[]> {
  try {
    const data = await redis.hgetall(WORKERS_KEY);
    if (!data) return [];
    return Object.values(data) as Worker[];
  } catch (error) {
    return [];
  }
}

export async function spawnWorker(templateId: string) {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');

  const newId = `w-${Date.now()}`;
  const newWorker: Worker = {
    id: newId,
    name: `${template.name} #${newId.slice(-4)}`,
    role: template.role,
    status: 'idle',
    capabilities: template.capabilities,
    templateId: template.id
  };

  try {
    await redis.hset(WORKERS_KEY, { [newId]: newWorker });
    revalidatePath('/admin/workers');
    return { success: true, worker: newWorker };
  } catch (error) {
    console.error('Failed to spawn worker:', error);
    return { success: false, error: 'Failed to spawn' };
  }
}

export async function getTemplates() {
  return TEMPLATES;
}
