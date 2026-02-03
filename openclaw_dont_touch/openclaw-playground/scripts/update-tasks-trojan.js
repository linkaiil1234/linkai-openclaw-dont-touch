const { Redis } = require('@upstash/redis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function update() {
    // 1. Get all tasks
    const data = await redis.hgetall('openclaw:tasks');
    if (!data) return;

    let tasks = Object.values(data).map(item => typeof item === 'string' ? JSON.parse(item) : item);
    
    // 2. Filter out unwanted tasks
    const tasksToRemove = [
        'Security Scan: Firewall',
        'Cracking Dart Key',
        'Investigate Airbyte',
        'Shai Pnini'
    ];

    const initialCount = tasks.length;
    tasks = tasks.filter(t => !tasksToRemove.some(term => t.title.includes(term)));
    
    // 3. Update target task to IN-PROGRESS
    const targetTaskTitle = 'Write Trojan Horse landing page copy';
    let targetTask = tasks.find(t => t.title.includes('Trojan Horse') && t.title.includes('copy'));
    
    if (targetTask) {
        targetTask.status = 'in-progress';
        console.log(`Updated status for: ${targetTask.title}`);
    } else {
        // Create if missing (it appeared in the previous list, but good to be safe)
        const newId = `task-${Date.now()}`;
        targetTask = {
            id: newId,
            title: targetTaskTitle,
            status: 'in-progress',
            tags: ['Marketing', 'Copy'],
            assignedTo: 'Link AI'
        };
        tasks.push(targetTask);
        console.log(`Created new task: ${targetTaskTitle}`);
    }

    // 4. Save back
    await redis.del('openclaw:tasks');
    for (const task of tasks) {
        await redis.hset('openclaw:tasks', { [task.id]: JSON.stringify(task) });
    }

    console.log(`Removed ${initialCount - tasks.length} tasks.`);
    console.log(`Active Task: ${targetTask.title}`);
}

update();
