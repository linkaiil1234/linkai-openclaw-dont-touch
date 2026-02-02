import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const cost = parseFloat(process.argv[2]); // The cost of the specific turn
const inputTokens = int(process.argv[3] || 0);
const outputTokens = int(process.argv[4] || 0);

function int(val) { return parseInt(val) || 0; }

async function update() {
    // Get current stats
    let current = await redis.get('openclaw:finops');
    if (!current || typeof current !== 'object') {
        current = { total: 0.0, input: 0, output: 0, history: [] };
    }

    // Update
    current.total += cost;
    current.input += inputTokens;
    current.output += outputTokens;
    
    // Add to daily history (simple mock for now, can be expanded)
    const today = new Date().toISOString().split('T')[0];
    // logic to aggregate per day would go here

    await redis.set('openclaw:finops', JSON.stringify(current));
    console.log(`💰 FinOps Updated: +$${cost} (Total: $${current.total.toFixed(4)})`);
}

update();
