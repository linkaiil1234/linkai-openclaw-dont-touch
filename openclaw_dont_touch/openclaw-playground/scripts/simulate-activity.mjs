import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const LOGS_KEY = 'openclaw:system-logs';

const ACTIONS = [
  'Optimizing Redis Query Performance',
  'Refactoring Admin UI Components',
  'Injecting Dark Mode CSS Variables',
  'Compiling Assets via Turbopack',
  'Verifying Vercel Deployment Health',
  'Synchronizing Agent Memory',
  'Running Automated Security Scan',
  'Updating Worker Status: Idle -> Busy',
  'Garbage Collection: Cleaning Old Logs',
  'Self-Correction: Fixing CSS Overflow'
];

async function simulate() {
  console.log('🔄 Simulating 1000 Loops Activity...');
  
  // We'll simulate 50 entries to fill the scroll
  for (let i = 0; i < 50; i++) {
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const status = Math.random() > 0.9 ? 'Pending' : 'Success';
    
    // Simulate slight time differences
    const timeOffset = (50 - i) * 1000 * 30; // 30 seconds apart
    
    const log = {
        id: crypto.randomUUID(),
        action: `${action} (Loop #${1000 - i})`,
        status,
        timestamp: Date.now() - timeOffset,
    };
    
    await redis.lpush(LOGS_KEY, log);
  }
  
  // Trim to Keep 100
  await redis.ltrim(LOGS_KEY, 0, 99);
  
  console.log('✅ Simulation Complete');
}

simulate();
