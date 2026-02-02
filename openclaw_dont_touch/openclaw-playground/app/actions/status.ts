'use server';

import { redis } from '@/lib/redis';

export interface SystemStatus {
  agentStatus: string;    // e.g. "Active", "Idle", "Offline"
  agentDetail: string;    // e.g. "Processing task #123"
  buildStatus: string;    // e.g. "Stable", "Building", "Failed"
  buildVersion: string;   // e.g. "v1.2.0"
  healthStatus: string;   // e.g. "100%", "Degraded"
  healthDetail: string;   // e.g. "All systems operational"
}

const STATUS_KEY = 'openclaw:system-status';

export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    const data = await redis.hgetall(STATUS_KEY);
    
    // Default fallback if empty
    if (!data) {
      return {
        agentStatus: 'Waiting...',
        agentDetail: 'No signal yet',
        buildStatus: 'Unknown',
        buildVersion: '-',
        healthStatus: 'Checking...',
        healthDetail: 'Connecting to Link OS...',
      };
    }

    return data as unknown as SystemStatus;
  } catch (error) {
    console.error('Failed to fetch status:', error);
    return {
      agentStatus: 'Error',
      agentDetail: 'Redis Connection Failed',
      buildStatus: 'Error',
      buildVersion: '-',
      healthStatus: '0%',
      healthDetail: 'System Critical',
    };
  }
}
