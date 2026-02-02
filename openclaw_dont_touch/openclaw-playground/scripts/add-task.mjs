import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const title = process.argv[2];
const status = process.argv[3] || 'pending';

async function run() {
    if (!title) {
        console.error('Usage: node add-task.mjs "Title" [status]');
        process.exit(1);
    }

    const id = 'task-' + Date.now();
    const task = {
      id,
      title,
      status,
      tags: ['From Telegram'],
      assignedTo: 'Link',
      value: 'Critical'
    };
    
    await redis.hset('openclaw:tasks', { [id]: JSON.stringify(task) });
    console.log(`✅ Task "${title}" added to Mission Control.`);
}
run();
