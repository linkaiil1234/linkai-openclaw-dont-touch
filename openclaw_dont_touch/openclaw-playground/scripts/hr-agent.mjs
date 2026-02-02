import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const SKILLS_DIR = '/Users/linkai/.nvm/versions/node/v24.13.0/lib/node_modules/openclaw/skills';
const WORKERS_KEY = 'openclaw:workers';

// Mapping skills to personas
const PERSONAS = {
  'github': { role: 'Lead Engineer', avatar: '👨‍💻', color: 'blue' },
  'google-calendar': { role: 'Executive Assistant', avatar: '📅', color: 'orange' },
  'web-search': { role: 'Researcher', avatar: '🕵️', color: 'purple' },
  'linear': { role: 'Product Manager', avatar: '📐', color: 'indigo' },
  'slack': { role: 'Comms Officer', avatar: '💬', color: 'pink' },
  'default': { role: 'Specialist', avatar: '🤖', color: 'gray' }
};

async function recruit() {
  console.log('👔 HR Agent: Scouting for talent...');
  
  if (!fs.existsSync(SKILLS_DIR)) {
    console.log('❌ Skills directory not found.');
    return;
  }

  const skills = fs.readdirSync(SKILLS_DIR);
  const workers = {};

  for (const skill of skills) {
    const skillPath = path.join(SKILLS_DIR, skill, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;

    // Determine persona
    let persona = PERSONAS[skill] || PERSONAS['default'];
    // Simple heuristic matching if not explicit
    if (skill.includes('write') || skill.includes('blog')) persona = { role: 'Content Strategist', avatar: '✍️', color: 'yellow' };
    if (skill.includes('code') || skill.includes('git')) persona = PERSONAS['github'];

    const workerId = `worker-${skill}`;
    
    workers[workerId] = {
      id: workerId,
      name: skill.charAt(0).toUpperCase() + skill.slice(1).replace(/-/g, ' '),
      role: persona.role,
      avatar: persona.avatar,
      status: 'idle', // default
      capabilities: [skill],
      color: persona.color
    };
    
    console.log(`✅ Hired: ${workers[workerId].name} as ${persona.role}`);
  }

  // Save to Redis (overwrite current roster to keep it synced with reality)
  // We use a transaction or just set individual fields. For simplicity, we replace.
  for (const [id, data] of Object.entries(workers)) {
      await redis.hset(WORKERS_KEY, { [id]: JSON.stringify(data) });
  }

  console.log(`🎉 Team updated. Total staff: ${Object.keys(workers).length}`);
}

recruit();
