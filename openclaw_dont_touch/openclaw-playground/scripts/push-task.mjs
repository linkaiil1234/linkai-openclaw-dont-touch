import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function run() {
    const task = {
      id: 'sync-fix-' + Date.now(),
      title: 'Fix: Connect Telegram Tasks to Dashboard',
      status: 'in-progress',
      tags: ['Urgent', 'System'],
      assignedTo: 'Link',
      value: 'High'
    };
    await redis.hset('openclaw:tasks', { [task.id]: JSON.stringify(task) });
    console.log('✅ Task Pushed');
}
run();
