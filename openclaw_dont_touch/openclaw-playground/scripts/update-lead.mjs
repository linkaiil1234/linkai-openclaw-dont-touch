import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CRM_KEY = 'openclaw:crm';

async function update() {
  // Update the AI Research Task to DONE with findings
  const lead1 = await redis.hget(CRM_KEY, 'lead-1');
  if (lead1) {
    // Upstash might return object directly depending on client version, let's handle both
    const task = typeof lead1 === 'string' ? JSON.parse(lead1) : lead1;
    
    task.status = 'Won';
    task.lastAction = 'Completed: Windsurf is cheaper ($15 vs $20) & more autonomous.';
    
    await redis.hset(CRM_KEY, { ['lead-1']: task });
    console.log('✅ AI Task Updated: Research Complete');
  }
}

update();
