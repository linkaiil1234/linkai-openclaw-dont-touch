'use server';

import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';

export interface Lead {
  id: string;
  company: string;
  contact: string;
  status: 'New' | 'In Progress' | 'Won' | 'Lost';
  value: string;
  assignedTo: string; // 'Ori', 'AI', 'Sales'
  notes?: string;
  lastAction: string;
}

const CRM_KEY = 'openclaw:crm';

export async function getLeads(): Promise<Lead[]> {
  try {
    const data = await redis.hgetall(CRM_KEY);
    if (!data) return [];
    return Object.values(data) as Lead[];
  } catch (error) {
    return [];
  }
}

export async function updateLeadStatus(id: string, status: Lead['status'], note?: string) {
  try {
    const data = await redis.hget(CRM_KEY, id);
    if (data) {
      const lead = typeof data === 'string' ? JSON.parse(data) : data;
      lead.status = status;
      if (note) lead.notes = note;
      lead.lastAction = new Date().toISOString();
      
      await redis.hset(CRM_KEY, { [id]: lead });
      revalidatePath('/admin/apps/crm');
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
}
