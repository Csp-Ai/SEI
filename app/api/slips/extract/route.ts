import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { extractSlipRequestSchema } from '@/lib/core/slips';
import type { ApiEnvelope } from '@/lib/core/contracts';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = extractSlipRequestSchema.safeParse(json);
  const trace_id = parsed.success ? parsed.data.trace_id || randomUUID() : randomUUID();

  if (!parsed.success) {
    const envelope: ApiEnvelope<never> = {
      ok: false,
      error: { code: 'INVALID_REQUEST', message: 'Could not extract slip details from input.' },
      trace_id,
    };
    return NextResponse.json(envelope, { status: 400 });
  }

  const envelope: ApiEnvelope<{ picks: Array<{ market: string; line: string; confidence: number }> }> = {
    ok: true,
    data: {
      picks: [
        { market: 'J. Brunson O27.5 PTS', line: '-108', confidence: 0.64 },
        { market: 'J. Tatum O8.5 REB', line: '-102', confidence: 0.58 },
      ],
    },
    provenance: {
      mode: 'demo',
      reason: 'Demo mode (live feeds off)',
      generatedAt: new Date().toISOString(),
    },
    trace_id,
  };

  return NextResponse.json(envelope, { status: 200 });
}
