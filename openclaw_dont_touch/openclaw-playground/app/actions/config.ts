'use server';

import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';

const CONFIG_KEY = 'openclaw:config';

export interface SystemConfig {
  maintenanceMode: boolean;
  debugMode: boolean;
  enableVoice: boolean;
  maxDailyUsers: number;
  promoMessage: string;
}

const DEFAULT_CONFIG: SystemConfig = {
  maintenanceMode: false,
  debugMode: false,
  enableVoice: true,
  maxDailyUsers: 1000,
  promoMessage: 'Welcome to the 15-Minute Wizard',
};

export async function getConfig(): Promise<SystemConfig> {
  const data = await redis.hgetall(CONFIG_KEY);
  if (!data || Object.keys(data).length === 0) return DEFAULT_CONFIG;
  
  // Convert strings "true"/"false" back to booleans/numbers if needed, 
  // or handle mixed types if stored via hset properly.
  // Upstash hgetall returns object with string values usually.
  
  return {
    maintenanceMode: data.maintenanceMode === 'true' || data.maintenanceMode === true,
    debugMode: data.debugMode === 'true' || data.debugMode === true,
    enableVoice: data.enableVoice === 'true' || data.enableVoice === true,
    maxDailyUsers: Number(data.maxDailyUsers) || 1000,
    promoMessage: (data.promoMessage as string) || DEFAULT_CONFIG.promoMessage,
  };
}

export async function updateConfig(key: keyof SystemConfig, value: string | boolean | number) {
  try {
    await redis.hset(CONFIG_KEY, { [key]: value });
    revalidatePath('/admin/settings');
    revalidatePath('/wizard'); // Update wizard too
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to update config' };
  }
}
