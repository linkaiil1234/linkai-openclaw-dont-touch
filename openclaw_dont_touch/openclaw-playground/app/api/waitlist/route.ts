import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    // 1. Save to Set (unique emails only)
    await redis.sadd('openclaw:waitlist', email);
    
    // 2. Log timestamp for ordering (optional, using sorted set)
    await redis.zadd('openclaw:waitlist:timestamp', { score: Date.now(), member: email });

    console.log(`[Waitlist] New signup: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: 'You are on the list!' 
    });
  } catch (error) {
    console.error('[Waitlist API] Error:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
