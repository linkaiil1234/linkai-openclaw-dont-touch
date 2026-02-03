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

    // 2. Update statuses
    let updatedCount = 0;
    
    // Task 1: Real-time FinOps -> DONE
    const finopsTask = tasks.find(t => t.title.includes('FinOps') && t.status !== 'done');
    if (finopsTask) {
        finopsTask.status = 'done';
        updatedCount++;
        console.log(`✅ Marked as DONE: ${finopsTask.title}`);
    }

    // Task 2: Recruit FE Developer -> DONE
    const feTask = tasks.find(t => t.title.includes('Recruit') && t.title.includes('Frontend') && t.status !== 'done');
    if (feTask) {
        feTask.status = 'done';
        updatedCount++;
        console.log(`✅ Marked as DONE: ${feTask.title}`);
    }

    // 3. Save
    if (updatedCount > 0) {
        await redis.del('openclaw:tasks');
        for (const task of tasks) {
            await redis.hset('openclaw:tasks', { [task.id]: JSON.stringify(task) });
        }
        console.log("Database updated.");
    } else {
        console.log("No tasks needed updating.");
    }
}

update();
