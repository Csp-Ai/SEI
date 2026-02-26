import { randomUUID } from 'crypto';
import { z } from 'zod';
import { modeSchema, type ApiEnvelope, type Provenance } from './core/contracts';

const boardRowSchema = z.object({
  matchup: z.string(),
  tipoff: z.string(),
  props: z.array(z.object({ market: z.string(), line: z.string(), edge: z.string() })),
});

export type BoardRow = z.infer<typeof boardRowSchema>;

const demoBoard: BoardRow = {
  matchup: 'NYK @ BOS',
  tipoff: '7:30 PM ET',
  props: [
    { market: 'J. Brunson O27.5 PTS', line: '-108', edge: '+4.2%' },
    { market: 'J. Tatum O8.5 REB', line: '-102', edge: '+3.1%' },
    { market: 'D. White O2.5 3PM', line: '+110', edge: '+2.6%' },
  ],
};

export type TodayBoardData = {
  board: BoardRow[];
};

function provenance(mode: z.infer<typeof modeSchema>, reason?: string): Provenance {
  return {
    mode,
    reason,
    generatedAt: new Date().toISOString(),
  };
}

export async function getTodayBoard(): Promise<ApiEnvelope<TodayBoardData>> {
  const trace_id = randomUUID();
  // Placeholder for live/cache providers. Defaulting to demo keeps UX truthful.
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[today-service] Live feeds unavailable -> serving demo slate.');
  }
  const response: ApiEnvelope<TodayBoardData> = {
    ok: true,
    data: { board: [demoBoard] },
    provenance: provenance('demo', 'Demo mode (live feeds off)'),
    trace_id,
  };

  const parsedMode = modeSchema.safeParse(response.provenance.mode);
  const parsedBoard = boardRowSchema.array().safeParse(response.data.board);

  if (!parsedMode.success || !parsedBoard.success) {
    return {
      ok: false,
      error: { code: 'INVALID_TODAY_PAYLOAD', message: 'Unable to build today board payload.' },
      provenance: provenance('demo', 'Demo mode (live feeds off)'),
      trace_id,
    };
  }

  return response;
}
