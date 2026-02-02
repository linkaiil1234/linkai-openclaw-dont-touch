'use server';

import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';

export interface Worker {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'busy' | 'offline';
  currentTask?: string;
  capabilities: string[];
  templateId?: string; // Track origin
}

export interface WorkerTemplate {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  icon: string;
}

const WORKERS_KEY = 'openclaw:workers';

export const TEMPLATES: WorkerTemplate[] = [
  { id: 'tpl-researcher', name: 'Sherlock Clone', role: 'Deep Researcher', capabilities: ['search', 'scrape', 'summarize'], icon: 'Search' },
  { id: 'tpl-coder', name: 'Junior Dev', role: 'Frontend Engineer', capabilities: ['react', 'css', 'fix-bugs'], icon: 'Code' },
  { id: 'tpl-writer', name: 'Copywriter', role: 'Content Strategist', capabilities: ['blog', 'social', 'email'], icon: 'Pen' },
  { id: 'tpl-sales', name: 'Closer', role: 'Sales Rep', capabilities: ['outreach', 'crm', 'negotiate'], icon: 'DollarSign' },
];

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

  const newId = `w-${Date.now()}`; // Simple ID generation
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
