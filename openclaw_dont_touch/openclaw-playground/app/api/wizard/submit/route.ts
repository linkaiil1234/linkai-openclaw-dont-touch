import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[Wizard API] Received Submission:', JSON.stringify(body, null, 2));

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ 
      success: true, 
      message: 'Wizard data received',
      data: body 
    });
  } catch (error) {
    console.error('[Wizard API] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
