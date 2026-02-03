const { Redis } = require('@upstash/redis');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.error("Missing UPSTASH_REDIS_REST_URL");
    process.exit(1);
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TASKS = [
    {
        id: 'task_1',
        title: 'Launch 15-Minute Wizard',
        status: 'done',
        tags: ['Product', 'Critical'],
        assignedTo: 'Link AI'
    },
    {
        id: 'task_2',
        title: 'Connect Dashboard to Redis',
        status: 'done',
        tags: ['Dev', 'Infra'],
        assignedTo: 'Link AI'
    },
    {
        id: 'task_3',
        title: 'Fix GCloud Auth / Container',
        status: 'pending',
        tags: ['DevOps', 'Blocked'],
        assignedTo: 'Ori'
    }
];

async function seed() {
    console.log("Seeding tasks to Redis...");
    for (const task of TASKS) {
        await redis.hset('openclaw:tasks', { [task.id]: JSON.stringify(task) });
        console.log(`Saved: ${task.title}`);
    }
    console.log("Done!");
}

seed();
