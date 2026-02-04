import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[Wizard API] Received Submission:', JSON.stringify(body, null, 2));

    const submissionId = Date.now().toString();
    const key = `wizard:submission:${submissionId}`;

    const data = {
      id: submissionId,
      timestamp: new Date().toISOString(),
      ...body
    };

    // Try to save to Redis (Real or Mock)
    try {
        await redis.set(key, JSON.stringify(data));
        await redis.lpush('wizard:recent_submissions', key);
        console.log('[Wizard API] Saved to storage:', key);
    } catch (dbError) {
        console.error('[Wizard API] Database Error (Non-fatal):', dbError);
        // Continue even if DB fails, to not block the UI
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Wizard data processed',
      data: data 
    });
  } catch (error) {
    console.error('[Wizard API] Critical Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
