'use server';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CHAT_KEY = 'openclaw:chat_history';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export async function getMessages(): Promise<ChatMessage[]> {
  // Fetch last 50 messages
  const raw = await redis.lrange(CHAT_KEY, 0, 49);
  return raw.map(s => typeof s === 'string' ? JSON.parse(s) : s).reverse();
}

export async function sendMessage(content: string) {
  const msg: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content,
    timestamp: Date.now()
  };
  
  // Push to history
  await redis.lpush(CHAT_KEY, msg);
  
  // Also push to an inbox queue for the agent to read if needed (optional)
  // await redis.lpush('openclaw:inbox', msg);
  
  return { success: true };
}

export async function sendAgentReply(content: string) {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    await redis.lpush(CHAT_KEY, msg);
    return { success: true };
}
