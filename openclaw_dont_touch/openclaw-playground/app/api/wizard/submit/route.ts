import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[Wizard API] Received Submission:', JSON.stringify(body, null, 2));

    // Generate a simple ID based on timestamp + random
    const submissionId = Date.now().toString();
    const key = `wizard:submission:${submissionId}`;

    // Add timestamp
    const data = {
      id: submissionId,
      timestamp: new Date().toISOString(),
      ...body
    };

    // Save to Redis
    // 1. Store the individual record
    await redis.set(key, JSON.stringify(data));
    
    // 2. Add to a list of recent submissions for the dashboard
    await redis.lpush('wizard:recent_submissions', key);

    return NextResponse.json({ 
      success: true, 
      message: 'Wizard data saved to Redis',
      data: data 
    });
  } catch (error) {
    console.error('[Wizard API] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
