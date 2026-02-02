import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CRM_KEY = 'openclaw:crm';

const REAL_TASKS = [
  { 
    id: 'lead-1', 
    company: 'Cursor Competitor Analysis', 
    contact: 'research-bot@linkai.il', 
    status: 'New', 
    value: '-', 
    assignedTo: 'AI', 
    lastAction: 'Pending execution' 
  },
  { 
    id: 'lead-2', 
    company: 'Enterprise Deal (TechCorp)', 
    contact: 'cto@techcorp.com', 
    status: 'In Progress', 
    value: '$25,000', 
    assignedTo: 'Ori', 
    lastAction: 'Meeting scheduled' 
  },
  { 
    id: 'lead-3', 
    company: 'Vercel Pro Plan', 
    contact: 'billing@vercel.com', 
    status: 'New', 
    value: '$20/mo', 
    assignedTo: 'Ori', 
    lastAction: 'Card update needed' 
  }
];

async function seed() {
  console.log('💼 Seeding CRM with Real Tasks...');
  await redis.del(CRM_KEY);
  
  for (const task of REAL_TASKS) {
    await redis.hset(CRM_KEY, { [task.id]: task });
  }
  
  console.log('✅ CRM Updated');
}

seed();
