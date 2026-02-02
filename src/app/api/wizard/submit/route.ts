import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  
  // This is where we would save to DB / Trigger n8n / Call Twilio
  console.log('📝 [Wizard API] Received Submission:', body);

  // Simulation of processing
  return NextResponse.json({ 
    success: true, 
    message: 'Wizard data received', 
    data: body 
  });
}
