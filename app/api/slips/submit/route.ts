import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { submitSlipRequestSchema } from '@/lib/core/slips';
import type { ApiEnvelope } from '@/lib/core/contracts';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = submitSlipRequestSchema.safeParse(json);
  const trace_id = parsed.success ? parsed.data.trace_id || randomUUID() : randomUUID();

  if (!parsed.success) {
    const envelope: ApiEnvelope<never> = {
      ok: false,
      error: { code: 'INVALID_REQUEST', message: 'Could not submit slip. Check payload fields.' },
      trace_id,
    };
    return NextResponse.json(envelope, { status: 400 });
  }

  const envelope: ApiEnvelope<{ slipId: string; accepted: number }> = {
    ok: true,
    data: {
      slipId: `slip_${trace_id.slice(0, 8)}`,
      accepted: parsed.data.picks.length,
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
