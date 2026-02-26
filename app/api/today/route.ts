import { NextResponse } from 'next/server';
import { getTodayBoard } from '@/lib/today-service';

export async function GET() {
  const envelope = await getTodayBoard();
  return NextResponse.json(envelope, { status: envelope.ok ? 200 : 503 });
}
