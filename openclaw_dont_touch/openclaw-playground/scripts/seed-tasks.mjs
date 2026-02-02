import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TASKS_KEY = 'openclaw:tasks';

const TASKS = [
  { 
    id: 'proc-redis-mon', 
    title: 'Redis Health Monitor', 
    assignedTo: 'w-qa', 
    status: 'in-progress' 
  },
  { 
    id: 'proc-auto-heal', 
    title: 'Self-Correction Service', 
    status: 'pending' 
  },
  { 
    id: 'proc-cron', 
    title: 'QStash Scheduler', 
    assignedTo: 'system', 
    status: 'in-progress' 
  },
  { 
    id: 'proc-backup', 
    title: 'Daily Memory Backup', 
    status: 'pending' 
  },
  {
    id: 'proc-wizard-metrics',
    title: 'Wizard Funnel Analytics',
    assignedTo: 'w-research',
    status: 'in-progress'
  }
];

async function seed() {
  console.log('🌱 Seeding Tasks...');
  await redis.del(TASKS_KEY);
  
  for (const task of TASKS) {
    await redis.hset(TASKS_KEY, { [task.id]: task });
  }
  
  console.log('✅ Tasks Updated');
}

seed();
