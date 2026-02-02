import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Load env vars manually if not running via Next.js
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error('❌ Missing Upstash credentials in environment');
  process.exit(1);
}

const redis = new Redis({ url, token });

async function testConnection() {
  const testKey = 'openclaw:test-connection';
  const testValue = `ok-${Date.now()}`;

  console.log('🔄 Testing Redis Connection...');

  try {
    // 1. Write
    await redis.set(testKey, testValue);
    console.log('✅ Write success');

    // 2. Read
    const result = await redis.get(testKey);
    if (result !== testValue) {
      throw new Error(`Value mismatch: expected ${testValue}, got ${result}`);
    }
    console.log('✅ Read success');

    // 3. Delete
    await redis.del(testKey);
    console.log('✅ Clean up success');

    console.log('🚀 E2E DB Test Passed!');
  } catch (error) {
    console.error('❌ DB Test Failed:', error);
    process.exit(1);
  }
}

testConnection();
