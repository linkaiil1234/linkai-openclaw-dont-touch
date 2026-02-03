const { Redis } = require('@upstash/redis');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function check() {
    const data = await redis.hgetall('openclaw:tasks');
    if (!data) {
        console.log("No tasks found.");
        return;
    }

    const tasks = Object.values(data).map(item => typeof item === 'string' ? JSON.parse(item) : item);
    const working = tasks.filter(t => t.status === 'in-progress');
    
    console.log("--- WORKING TASKS (Backend Data) ---");
    if (working.length === 0) {
        console.log("(None)");
    } else {
        working.forEach(t => console.log(`[${t.id}] ${t.title} (Assigned: ${t.assignedTo})`));
    }
}

check();
