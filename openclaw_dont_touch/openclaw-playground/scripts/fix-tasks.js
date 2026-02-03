const { Redis } = require('@upstash/redis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function fix() {
    // 1. Get all tasks
    const data = await redis.hgetall('openclaw:tasks');
    if (!data) return;

    let tasks = Object.values(data).map(item => typeof item === 'string' ? JSON.parse(item) : item);
    
    // 2. Remove "GCloud Auth" or "Fix GCloud"
    const initialCount = tasks.length;
    tasks = tasks.filter(t => !t.title.toLowerCase().includes('gcloud'));

    // 3. Save back (clean slate approach to ensure sync)
    // We need to delete the hash key first to remove the deleted items effectively
    await redis.del('openclaw:tasks');
    
    for (const task of tasks) {
        await redis.hset('openclaw:tasks', { [task.id]: JSON.stringify(task) });
    }

    console.log(`Removed ${initialCount - tasks.length} tasks (GCloud). Remaining: ${tasks.length}`);
    console.log("--- ALL TASKS IN REDIS ---");
    tasks.forEach(t => console.log(`[${t.status.toUpperCase()}] ${t.title}`));
}

fix();
