'use server';

import { Redis } from '@upstash/redis';
import { unstable_noStore as noStore } from 'next/cache';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCosts() {
  noStore(); // Disable caching
  const data = await redis.get('openclaw:finops');
  const stats = (data && typeof data === 'object') ? data as { total: number; input: number; output: number } : { total: 0, input: 0, output: 0 };

  return {
    monthlyTotal: stats.total || 0,
    dailyTotal: (stats.total || 0) * 0.3, // Mock daily breakdown for now
    projected: (stats.total || 0) * 1.5,
    tokens: {
      input: stats.input || 0,
      output: stats.output || 0
    },
    history: []
  };
}
