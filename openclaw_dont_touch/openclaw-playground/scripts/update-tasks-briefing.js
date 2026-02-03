const { Redis } = require('@upstash/redis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function update() {
    // 1. Get tasks
    const data = await redis.hgetall('openclaw:tasks');
    if (!data) return;

    let tasks = Object.values(data).map(item => typeof item === 'string' ? JSON.parse(item) : item);

    // 2. Mark "Write Morning Briefing script" as DONE
    const task = tasks.find(t => t.title.includes('Morning Briefing') && t.status !== 'done');
    
    if (task) {
        task.status = 'done';
        // Save back
        await redis.del('openclaw:tasks');
        for (const t of tasks) {
            await redis.hset('openclaw:tasks', { [t.id]: JSON.stringify(t) });
        }
        console.log(`✅ Marked as DONE: ${task.title}`);
    } else {
        console.log("Task already done or not found.");
    }
}

update();
