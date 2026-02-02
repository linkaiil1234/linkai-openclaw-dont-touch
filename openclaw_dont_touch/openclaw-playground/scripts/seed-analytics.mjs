import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ANALYTICS_KEY = 'openclaw:analytics:wizard';

const DATA = {
  overview: {
    totalVisitors: 1240,
    activeNow: 12,
    conversionRate: 18.5,
    avgTime: '4m 12s',
  },
  funnel: [
    { step: 'Landing Page', count: 1240, dropoff: 0 },
    { step: 'Identity Setup', count: 890, dropoff: 28 },
    { step: 'Voice Selection', count: 650, dropoff: 27 },
    { step: 'Connections', count: 420, dropoff: 35 },
    { step: 'Deployed', count: 230, dropoff: 45 },
  ],
  traffic: [120, 145, 132, 180, 210, 250, 310] // Rising trend
};

async function seed() {
  console.log('📊 Seeding Analytics Data...');
  // Store as simple JSON string or object
  await redis.set(ANALYTICS_KEY, JSON.stringify(DATA));
  console.log('✅ Analytics Updated');
}

seed();
