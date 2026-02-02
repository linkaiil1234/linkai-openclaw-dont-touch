import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CONFIG_KEY = 'openclaw:config';

const INITIAL_CONFIG = {
  maintenanceMode: false,
  debugMode: false,
  enableVoice: true,
  maxDailyUsers: 1000,
  promoMessage: 'Welcome to the 15-Minute Wizard',
};

async function seed() {
  console.log('⚙️ Seeding System Config...');
  // Convert boolean/numbers to strings for hash storage safety (though JSON works too)
  // Let's store as a flat hash for individual field updates
  await redis.hset(CONFIG_KEY, INITIAL_CONFIG);
  console.log('✅ Config Updated');
}

seed();
