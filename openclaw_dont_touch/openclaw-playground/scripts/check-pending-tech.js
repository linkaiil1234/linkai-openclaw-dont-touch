const { Redis } = require('@upstash/redis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function checkPending() {
    const data = await redis.hgetall('openclaw:tasks');
    if (!data) return;

    const tasks = Object.values(data).map(item => typeof item === 'string' ? JSON.parse(item) : item);
    const pending = tasks.filter(t => t.status === 'pending');
    
    // Filter for tech/vercel tasks
    const techKeywords = ['page', 'ui', 'design', 'frontend', 'vercel', 'react', 'dashboard', 'mobile', 'ux'];
    const techTasks = pending.filter(t => techKeywords.some(k => t.title.toLowerCase().includes(k)));

    console.log("--- PENDING TECH TASKS (Vercel Candidates) ---");
    techTasks.forEach(t => console.log(`[${t.id}] ${t.title}`));
}

checkPending();
