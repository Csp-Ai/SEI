import { z } from 'zod';

export const modeSchema = z.enum(['live', 'cache', 'demo']);

export const provenanceSchema = z.object({
  mode: modeSchema,
  reason: z.string().optional(),
  generatedAt: z.string(),
});

export type Mode = z.infer<typeof modeSchema>;
export type Provenance = z.infer<typeof provenanceSchema>;

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  provenance: Provenance;
  trace_id: string;
};

export type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
  provenance?: Provenance;
  trace_id?: string;
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiError;
