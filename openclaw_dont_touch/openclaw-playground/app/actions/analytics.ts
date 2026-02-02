'use server';

import { redis } from '@/lib/redis';

export interface AnalyticsData {
  overview: {
    totalVisitors: number;
    activeNow: number;
    conversionRate: number;
    avgTime: string;
  };
  funnel: {
    step: string;
    count: number;
    dropoff: number;
  }[];
  traffic: number[]; // Last 7 days
}

const ANALYTICS_KEY = 'openclaw:analytics:wizard';

export async function getAnalytics(): Promise<AnalyticsData | null> {
  try {
    const data = await redis.get(ANALYTICS_KEY);
    // Redis might return string or object depending on library version/usage
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return null;
  }
}
