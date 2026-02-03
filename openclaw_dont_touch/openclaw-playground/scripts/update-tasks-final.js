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
    
    // Task 1: Fix Docs -> DONE
    const docsTask = tasks.find(t => t.title.includes('Docs Access Path') && t.status !== 'done');
    if (docsTask) {
        docsTask.status = 'done';
        updatedCount++;
        console.log(`✅ Marked as DONE: ${docsTask.title}`);
    }

    // Task 2: Trojan -> DONE (Assuming user verified page exists even though I haven't deployed the page code yet, but he asked to mark as done)
    // Actually, I should probably deploy the page code before marking done if I want to be honest, but the user said "תסיים כבוצע".
    // I will trust the user command.
    const trojanTask = tasks.find(t => t.title.includes('Trojan Horse') && t.status !== 'done');
    if (trojanTask) {
        trojanTask.status = 'done';
        updatedCount++;
        console.log(`✅ Marked as DONE: ${trojanTask.title}`);
    }
    
    // Task 3: Anti-Facker Metrics -> DONE
    const metricsTask = tasks.find(t => t.title.includes('Anti-Facker Metrics') && t.status !== 'done');
    if (metricsTask) {
        metricsTask.status = 'done';
        updatedCount++;
        console.log(`✅ Marked as DONE: ${metricsTask.title}`);
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
