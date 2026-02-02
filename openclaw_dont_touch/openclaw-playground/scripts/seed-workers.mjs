import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error('❌ Missing Upstash credentials');
  process.exit(1);
}

const redis = new Redis({ url, token });
const WORKERS_KEY = 'openclaw:workers';

const INITIAL_WORKERS = [
  { 
    id: 'link-main', 
    name: 'Link (Primary)', 
    role: 'CTO / Orchestrator', 
    status: 'active', // Link is special
    currentTask: 'Managing System Expansion',
    capabilities: ['orchestration', 'coding', 'strategy', 'deployment'] 
  },
  { 
    id: 'w-research', 
    name: 'Sherlock', 
    role: 'Researcher', 
    status: 'idle', 
    capabilities: ['web-search', 'deep-dive', 'fact-checking', 'summarization'] 
  },
  { 
    id: 'w-code', 
    name: 'Ada', 
    role: 'Senior Engineer', 
    status: 'busy', 
    currentTask: 'Optimizing Redis Queries',
    capabilities: ['typescript', 'rust', 'debugging', 'architecture'] 
  },
  { 
    id: 'w-qa', 
    name: 'Bugsy', 
    role: 'QA Automation', 
    status: 'idle', 
    capabilities: ['playwright', 'e2e-testing', 'load-testing'] 
  },
  { 
    id: 'w-content', 
    name: 'Hemingway', 
    role: 'Content Strategist', 
    status: 'offline', 
    capabilities: ['copywriting', 'seo', 'social-media'] 
  }
];

async function seed() {
  console.log('🌱 Seeding Workers...');
  
  // Clear existing to avoid stale data
  await redis.del(WORKERS_KEY);
  
  for (const worker of INITIAL_WORKERS) {
    await redis.hset(WORKERS_KEY, { [worker.id]: worker });
    console.log(`✅ Added ${worker.name}`);
  }
  
  console.log('🚀 Seeding Complete!');
}

seed();
