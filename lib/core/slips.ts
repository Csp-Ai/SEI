import { z } from 'zod';

export const slipLegSchema = z.object({
  market: z.string(),
  line: z.string(),
  confidence: z.number().min(0).max(1),
});

export const submitSlipRequestSchema = z.object({
  sport: z.string(),
  date: z.string(),
  picks: z.array(slipLegSchema).min(1),
  stake: z.number().positive().optional(),
  trace_id: z.string().optional(),
});

export const extractSlipRequestSchema = z.object({
  text: z.string().min(3),
  trace_id: z.string().optional(),
});

export type SlipLeg = z.infer<typeof slipLegSchema>;
export type SubmitSlipRequest = z.infer<typeof submitSlipRequestSchema>;
export type ExtractSlipRequest = z.infer<typeof extractSlipRequestSchema>;
