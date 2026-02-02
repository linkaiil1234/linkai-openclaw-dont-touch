import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CHAT_KEY = 'openclaw:chat_history';

async function seed() {
  await redis.del(CHAT_KEY);
  
  const messages = [
    {
      id: '1',
      role: 'user',
      content: 'Link, status report.',
      timestamp: Date.now() - 100000
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Systems nominal. Optimus Prime active. Telegram link secured via @Orikolink_bot.',
      timestamp: Date.now() - 50000
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Ready for neural input, Ori.',
      timestamp: Date.now()
    }
  ];

  for (const msg of messages.reverse()) {
    await redis.lpush(CHAT_KEY, msg);
  }
  
  console.log('✅ Chat seeded.');
}

seed();
