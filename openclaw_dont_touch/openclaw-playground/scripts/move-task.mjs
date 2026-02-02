import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const taskTitle = process.argv[2];
const status = process.argv[3];

async function run() {
    // Find task by title (inefficient but works for small lists)
    const tasks = await redis.hgetall('openclaw:tasks');
    let targetId = null;
    let targetTask = null;

    for (const [id, t] of Object.entries(tasks)) {
        const task = typeof t === 'string' ? JSON.parse(t) : t;
        if (task.title.includes(taskTitle)) {
            targetId = id;
            targetTask = task;
            break;
        }
    }

    if (!targetId) {
        console.log('❌ Task not found');
        return;
    }

    targetTask.status = status;
    await redis.hset('openclaw:tasks', { [targetId]: JSON.stringify(targetTask) });
    console.log(`✅ Moved "${targetTask.title}" to ${status}`);
}
run();
