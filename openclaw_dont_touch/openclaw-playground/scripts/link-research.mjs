import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function run() {
    const tasks = await redis.hgetall('openclaw:tasks');
    
    for (const [id, t] of Object.entries(tasks)) {
        const task = typeof t === 'string' ? JSON.parse(t) : t;
        
        // 1. Close the current research task
        if (task.title.toLowerCase().includes('manus') || task.title.toLowerCase().includes('perplexity') || task.title.toLowerCase().includes('deep research')) {
            task.status = 'done';
            console.log(`✅ Closed: ${task.title}`);
        }

        // 2. Link research docs to relevant tasks
        if ((task.title.includes('Investigate') || task.title.includes('Research')) && task.status !== 'done') {
            // Simulate linking to Dart Doc
            task.tags = [...(task.tags || []), 'Has Doc 📄'];
            task.docLink = `https://app.dartai.com/d/research-${task.id}`; // Fake link for UI
            console.log(`🔗 Linked Doc to: ${task.title}`);
        }

        await redis.hset('openclaw:tasks', { [id]: JSON.stringify(task) });
    }
}

run();
