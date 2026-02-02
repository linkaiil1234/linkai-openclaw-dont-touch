import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error('❌ Missing Upstash credentials');
  process.exit(1);
}

const redis = new Redis({ url, token });
const LOGS_KEY = 'openclaw:system-logs';
const STATUS_KEY = 'openclaw:system-status';

const command = process.argv[2]; // 'log' or 'status'

async function run() {
  try {
    if (command === 'log') {
      const action = process.argv[3];
      const status = process.argv[4] || 'Success'; // Success, Error, Pending
      
      const log = {
        id: crypto.randomUUID(),
        action,
        status,
        timestamp: Date.now(),
      };
      
      await redis.lpush(LOGS_KEY, log);
      await redis.ltrim(LOGS_KEY, 0, 99);
      console.log(`✅ Logged: "${action}" [${status}]`);

    } else if (command === 'status') {
      // Expects JSON string as argument 3, or key=value pairs
      // Simpler: hardcode arguments for now based on what I need
      
      const agentStatus = process.argv[3] || 'Active';
      const agentDetail = process.argv[4] || 'Monitoring...';
      const healthStatus = process.argv[5] || '100%';
      const healthDetail = process.argv[6] || 'All systems operational';
      
      const statusPayload = {
        agentStatus,
        agentDetail,
        buildStatus: 'Stable', // Keep build stable unless I deploy
        buildVersion: 'v1.1.0',
        healthStatus,
        healthDetail
      };
      
      // Use hset to update specific fields or replace all
      // Let's use hset to be safe
      await redis.hset(STATUS_KEY, statusPayload);
      console.log('✅ Status updated:', statusPayload);

    } else {
      console.log('Usage: node agent-reporter.mjs log "Action Name" [Status]');
      console.log('       node agent-reporter.mjs status "AgentStatus" "AgentDetail" "HealthStatus" "HealthDetail"');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

run();
