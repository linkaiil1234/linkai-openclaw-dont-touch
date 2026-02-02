import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const WORKERS_KEY = 'openclaw:workers';
const LOGS_KEY = 'openclaw:system-logs';

const action = process.argv[2]; // 'assign' or 'release'
const workerId = process.argv[3];
const task = process.argv[4];

async function updateWorker() {
  const data = await redis.hget(WORKERS_KEY, workerId);
  if (!data) {
    console.error('Worker not found');
    return;
  }

  // Handle both object and string cases (Upstash sometimes parses automatically)
  let worker = typeof data === 'string' ? JSON.parse(data) : data;

  if (action === 'assign') {
    worker.status = 'busy';
    worker.currentTask = task;
    console.log(`👷 Assigned ${worker.name}: ${task}`);
  } else if (action === 'release') {
    worker.status = 'idle';
    worker.currentTask = ''; // Clear task
    console.log(`✅ Released ${worker.name}`);
  }

  await redis.hset(WORKERS_KEY, { [workerId]: worker });
  
  // Log event
  if (action === 'release' && task) {
     const log = {
        id: crypto.randomUUID(),
        action: `${worker.name} finished: ${task}`,
        status: 'Success',
        timestamp: Date.now(),
      };
      await redis.lpush(LOGS_KEY, log);
      await redis.ltrim(LOGS_KEY, 0, 99);
  }
}

updateWorker();
