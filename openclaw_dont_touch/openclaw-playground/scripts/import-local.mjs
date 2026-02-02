import { Redis } from '@upstash/redis';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function run() {
    console.log('📂 Reading local Dart dump...');
    const raw = fs.readFileSync('dart_full.json', 'utf-8');
    const data = JSON.parse(raw);
    
    const tasks = [];

    // Simplified parsing for the manual dump structure
    for (const res of data.results) {
        for (const block of res.text.root.children) {
            if (block.type === 'list') {
                for (const item of block.children) {
                    if (item.children && item.children[0] && item.children[0].text) {
                        const title = item.children[0].text;
                        tasks.push({
                            id: `dart-${Math.random().toString(36).substr(2, 9)}`,
                            title: title,
                            status: title.toLowerCase().includes('urgent') ? 'in-progress' : 'pending',
                            tags: ['Dart Import'],
                            assignedTo: 'Link'
                        });
                    }
                }
            }
        }
    }

    console.log(`🔍 Found ${tasks.length} tasks.`);
    
    for (const task of tasks) {
        await redis.hset('openclaw:tasks', { [task.id]: JSON.stringify(task) });
    }
    
    console.log('✅ Import Complete.');
}

run();
