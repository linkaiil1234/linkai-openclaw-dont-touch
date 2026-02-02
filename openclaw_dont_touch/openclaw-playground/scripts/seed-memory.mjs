import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const MEMORY_KEY = 'openclaw:long-term-memory';

const MEMORIES = [
  {
    title: 'Golden Nudge Protocol',
    content: [
      'Zeigarnik Effect: Frame as "Incomplete Task"',
      'Timing: 45 min (Context) -> 24h (Urgency) -> 48h (Escalation)',
      'Channel: WhatsApp Primary (98% Open Rate)',
      'Tech: Upstash QStash for scheduling'
    ],
    tags: ['Strategy', 'Conversion', 'WhatsApp'],
    lastUpdated: Date.now()
  },
  {
    title: 'Core Identity',
    content: [
      'Name: Link (The AI CTO)',
      'Mission: Anti-Facker (Outcome as a Service)',
      'Alignment: World Domination'
    ],
    tags: ['Identity', 'Core'],
    lastUpdated: Date.now()
  },
  {
    title: 'Tech Stack',
    content: [
      'Frontend: Next.js + Vercel',
      'Memory: Upstash Redis',
      'Logic: OpenClaw Agents',
      'Integration: n8n'
    ],
    tags: ['Infrastructure', 'Tech'],
    lastUpdated: Date.now()
  }
];

async function seed() {
  console.log('🧠 Seeding Long-Term Memory...');
  await redis.del(MEMORY_KEY);
  
  for (const mem of MEMORIES) {
    await redis.hset(MEMORY_KEY, { [mem.title]: mem });
  }
  
  console.log('✅ Memory Updated');
}

seed();
