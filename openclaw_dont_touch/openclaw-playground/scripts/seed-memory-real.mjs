import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const MEMORY_KEY = 'openclaw:long-term-memory';

const REAL_MEMORY = [
  {
    title: 'Agent Identity Protocol',
    content: [
      'Name: Link (The AI CTO).',
      'Role: Partner in Crime / Operating System for Business.',
      'Motto: "Anti-Facker" - Outcome as a Service.',
      'Goal: World Domination (Global SMB Market).'
    ],
    tags: ['Core', 'Identity'],
    lastUpdated: Date.now()
  },
  {
    title: 'Stability: Telegram Doctor',
    content: [
      'Problem: Frequent 500 errors from Telegram API.',
      'Protocol: Use exponential backoff (1s, 2s, 5s) on failure.',
      'Monitor: Doctor.sh runs locally to restart connection if dead.',
      'Status: Active monitoring via `scripts/telegram-doctor.js`.'
    ],
    tags: ['Stability', 'Telegram', 'Doctor'],
    lastUpdated: Date.now()
  },
  {
    title: 'Strategy: The Golden Nudge',
    content: [
      'Insight: Users drop off at step 2 of onboarding.',
      'Action: Send automated WhatsApp nudge after 45 minutes.',
      'Psychology: "Zeigarnik Effect" - incomplete tasks bug people.',
      'Tech: Powered by Upstash QStash.'
    ],
    tags: ['Strategy', 'Growth', 'WhatsApp'],
    lastUpdated: Date.now()
  },
  {
    title: 'Infrastructure Map',
    content: [
      'Frontend: Next.js 16 (App Router) on Vercel.',
      'Memory: Upstash Redis (Global).',
      'Orchestration: OpenClaw (Local Mac Mini).',
      'Control: Link OS Dashboard (Admin Interface).'
    ],
    tags: ['Tech', 'Infra'],
    lastUpdated: Date.now()
  }
];

async function seed() {
  console.log('🧠 Uploading Real Memory to Link OS...');
  await redis.del(MEMORY_KEY);
  
  for (const mem of REAL_MEMORY) {
    await redis.hset(MEMORY_KEY, { [mem.title]: mem });
  }
  
  console.log('✅ Memory Sync Complete');
}

seed();
