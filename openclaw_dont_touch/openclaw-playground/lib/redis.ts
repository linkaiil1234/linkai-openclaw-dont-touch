import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// Mock Redis implementation for development/fallback
class MockRedis {
  private store = new Map<string, string>();
  private listStore = new Map<string, string[]>();

  async set(key: string, value: string) {
    console.log(`[MockRedis] SET ${key}`);
    this.store.set(key, value);
    return 'OK';
  }

  async get(key: string) {
    console.log(`[MockRedis] GET ${key}`);
    return this.store.get(key) || null;
  }

  async lpush(key: string, ...values: string[]) {
    console.log(`[MockRedis] LPUSH ${key}`, values);
    if (!this.listStore.has(key)) this.listStore.set(key, []);
    this.listStore.get(key)?.unshift(...values);
    return this.listStore.get(key)?.length || 0;
  }

  async lrange(key: string, start: number, end: number) {
     const list = this.listStore.get(key) || [];
     return list.slice(start, end === -1 ? undefined : end + 1);
  }
}

// Export either real Redis or Mock
export const redis = (url && token) 
  ? new Redis({ url, token }) 
  : new MockRedis() as unknown as Redis;
