import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ 
  sessionId: z.string(), 
  reply: z.string(), 
  usage: z.any().optional(), 
  latency: z.number().optional() 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, reply } = schema.parse(body);
    
    // TODO: persist via internal API or direct DB if allowed
    // For now, we'll just return success
    // In a real implementation, you would:
    // 1. Save the AI response to the database
    // 2. Emit a WebSocket event to notify the client
    // 3. Update the chat session
    
    console.log('n8n callback received:', { sessionId, reply });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('n8n callback error:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
