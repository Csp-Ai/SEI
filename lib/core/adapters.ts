import { z } from 'zod';
import { provenanceSchema, type ApiEnvelope } from './contracts';

const todayBoardSchema = z.object({
  board: z.array(
    z.object({
      matchup: z.string(),
      tipoff: z.string(),
      props: z.array(z.object({ market: z.string(), line: z.string(), edge: z.string() })),
    })
  ),
});

const todayEnvelopeSchema = z.object({
  ok: z.literal(true),
  data: todayBoardSchema,
  provenance: provenanceSchema,
  trace_id: z.string(),
});

export type TodayEnvelope = ApiEnvelope<z.infer<typeof todayBoardSchema>>;

export async function fetchTodayAdapter(input: RequestInfo | URL): Promise<TodayEnvelope> {
  const res = await fetch(input, { cache: 'no-store' });
  const json = await res.json();

  const parsed = todayEnvelopeSchema.safeParse(json);
  if (parsed.success) return parsed.data as TodayEnvelope;

  return {
    ok: false,
    error: { code: 'INVALID_ENVELOPE', message: 'Today endpoint returned an unexpected payload.' },
  };
}
