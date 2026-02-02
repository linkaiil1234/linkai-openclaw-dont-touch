import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TASKS_KEY = 'openclaw:tasks';
const WORKERS_KEY = 'openclaw:workers';
const LOGS_KEY = 'openclaw:system-logs';

async function log(action, status = 'Success') {
  console.log(`[Optimus] ${action}`);
  await redis.lpush(LOGS_KEY, {
    id: crypto.randomUUID(),
    action: `[Optimus] ${action}`,
    status,
    timestamp: Date.now(),
  });
  await redis.ltrim(LOGS_KEY, 0, 99);
}

async function optimus() {
  console.log('🤖 Optimus Prime: Initiating Self-Improvement Cycle...');
  
  // 1. Fetch Data
  const tasks = await redis.hgetall(TASKS_KEY);
  const workers = await redis.hgetall(WORKERS_KEY);
  
  if (!tasks) return;

  for (const [id, taskData] of Object.entries(tasks)) {
    let task = typeof taskData === 'string' ? JSON.parse(taskData) : taskData;
    let modified = false;

    // RULE 1: Auto-Tagging & Enrichment
    if (!task.tags || task.tags.length === 0) {
      task.tags = [];
      if (task.title.toLowerCase().includes('bug') || task.title.toLowerCase().includes('fix')) {
        task.tags.push('Bug', 'High Priority');
        if (!task.title.includes('Investigate')) task.title = `🕵️ Investigate & Fix: ${task.title}`;
        modified = true;
      }
      if (task.title.toLowerCase().includes('analysis') || task.title.toLowerCase().includes('research')) {
        task.tags.push('Research', 'Strategy');
        if (!task.title.includes('Deep Dive')) task.title = `🧠 Deep Dive: ${task.title}`;
        modified = true;
      }
      if (task.title.toLowerCase().includes('deal') || task.title.toLowerCase().includes('sell')) {
        task.tags.push('Sales', 'Revenue');
        modified = true;
      }
    }

    // RULE 2: Smart Assignment (The Matchmaker)
    if (!task.assignedTo || task.assignedTo === 'Unassigned') {
      let bestWorkerId = null;
      
      // Find worker based on tags/role
      Object.values(workers).forEach(w => {
        const worker = typeof w === 'string' ? JSON.parse(w) : w;
        if (task.tags.includes('Bug') && worker.role.includes('Engineer')) bestWorkerId = worker.id;
        if (task.tags.includes('Research') && worker.role.includes('Researcher')) bestWorkerId = worker.id;
        if (task.tags.includes('Sales') && worker.role.includes('Sales')) bestWorkerId = worker.id;
      });

      if (bestWorkerId) {
        task.assignedTo = bestWorkerId; // Assign ID
        task.status = 'In Progress'; // Auto-start
        modified = true;
        await log(`Auto-assigned "${task.title}" to ${bestWorkerId}`);
        
        // Update Worker status too
        const workerData = workers[bestWorkerId];
        const worker = typeof workerData === 'string' ? JSON.parse(workerData) : workerData;
        worker.status = 'busy';
        worker.currentTask = task.title;
        await redis.hset(WORKERS_KEY, { [bestWorkerId]: worker });
      }
    }

    // RULE 3: Value Estimation (Revenue Intelligence)
    if ((!task.value || task.value === '-') && task.tags.includes('Sales')) {
       task.value = 'Est. $5k-10k'; // AI Estimation simulation
       modified = true;
       await log(`Estimated value for "${task.title}"`);
    }

    // Save if improved
    if (modified) {
      await redis.hset(TASKS_KEY, { [id]: task });
      await log(`Enhanced Task: ${task.title}`);
    }
  }
  
  console.log('✅ Cycle Complete.');
}

optimus();
