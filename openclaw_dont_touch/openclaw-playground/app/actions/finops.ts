'use server';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCosts() {
  // In the future, this will aggregate real usage logs.
  // For now, we simulate the "CEO View".
  
  return {
    monthlyTotal: 4.20,
    dailyTotal: 0.15,
    projected: 12.50,
    tokens: {
      input: 65400,
      output: 4200
    },
    history: [
      { day: 'Today', cost: 0.15 },
      { day: 'Yesterday', cost: 0.45 },
      { day: 'Sun', cost: 0.10 },
    ]
  };
}
