import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CHAT_KEY = 'openclaw:chat_history';

async function loop() {
    console.log('🔌 Chat Bridge Active...');
    let lastProcessedId = null;

    setInterval(async () => {
        try {
            // Get latest message
            const msgs = await redis.lrange(CHAT_KEY, 0, 0);
            if (msgs.length === 0) return;

            const latest = typeof msgs[0] === 'string' ? JSON.parse(msgs[0]) : msgs[0];

            // If user message and we haven't replied (naive check: just see if top is user)
            // Better: store processed ID
            if (latest.role === 'user' && latest.id !== lastProcessedId) {
                console.log(`📩 Received: ${latest.content}`);
                lastProcessedId = latest.id;

                // Simulate processing delay
                setTimeout(async () => {
                    const reply = {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `[Auto-Ack] קיבלתי: "${latest.content}". מעביר ל-Link הראשי לטיפול.`,
                        timestamp: Date.now()
                    };
                    await redis.lpush(CHAT_KEY, reply);
                    console.log('📤 Sent Ack');
                }, 1000);
            }
        } catch (e) {
            console.error('Bridge error:', e);
        }
    }, 2000);
}

loop();
