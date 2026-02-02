import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function run() {
    console.log('🎩 The Sorting Hat is running...');
    const tasks = await redis.hgetall('openclaw:tasks');
    
    let oriCount = 0;
    let linkCount = 0;

    for (const [id, t] of Object.entries(tasks)) {
        const task = typeof t === 'string' ? JSON.parse(t) : t;
        const title = task.title.toLowerCase();
        
        let newAssignee = 'Unassigned';

        // 👑 Logic for Ori (CEO)
        if (
            title.includes('recruit') || 
            title.includes('hiring') || 
            title.includes('meeting') || 
            title.includes('vision') || 
            title.includes('billing') || 
            title.includes('legal') ||
            title.includes('lawyer') ||
            title.includes('accountant') ||
            title.includes('shai') ||
            title.includes('adi') ||
            title.includes('or ') || // space to avoid wORd
            title.includes('michael') ||
            title.includes('branding') ||
            title.includes('strategy')
        ) {
            newAssignee = 'Ori';
            oriCount++;
        }
        // 🤖 Logic for Link (AI/CTO)
        else if (
            title.includes('implement') || 
            title.includes('integrate') || 
            title.includes('optimize') || 
            title.includes('api') || 
            title.includes('bot') || 
            title.includes('agent') || 
            title.includes('prompt') || 
            title.includes('code') || 
            title.includes('dev') || 
            title.includes('analytics') || 
            title.includes('data') || 
            title.includes('server') ||
            title.includes('v1') || 
            title.includes('v2') || 
            title.includes('v3') || 
            title.includes('v4') ||
            title.includes('v5')
        ) {
            newAssignee = 'Link';
            linkCount++;
        }

        if (newAssignee !== 'Unassigned') {
            task.assignedTo = newAssignee;
            // Also sanitize status if needed
            await redis.hset('openclaw:tasks', { [id]: JSON.stringify(task) });
        }
    }
    
    console.log(`✅ Assignment Complete.`);
    console.log(`👑 Ori Tasks: ${oriCount}`);
    console.log(`🤖 Link Tasks: ${linkCount}`);
}

run();
