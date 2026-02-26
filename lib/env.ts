import { z } from 'zod';

const schema = z
  .object({
    PUBLIC_SITE_URL: z.string().url().default('https://example.com'),
    VITE_SUPABASE_URL: z.string().url().default('https://example.com'),
    VITE_SUPABASE_ANON_KEY: z.string().min(1).default('anon-key'),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default('service-role-key'),
    VITE_SCRAPER_API_BASE_URL: z.string().url().default('https://example.com'),
    OPENAI_API_KEY: z.string().min(1).default('openai-key'),
    LEAD_WEBHOOK_URL: z.string().url().optional(),
    MAX_DEPTH: z.coerce.number().int().min(0).default(2),
    DB_DRIVER: z.enum(['sqlite', 'memory']).default('memory'),
    DATABASE_URL: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.DB_DRIVER === 'sqlite' && !data.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DATABASE_URL is required when DB_DRIVER=sqlite',
        path: ['DATABASE_URL'],
      });
    }
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Missing required environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

const fullEnv = parsed.data;

export const appEnv = {
  ...fullEnv,
};

export const env = {
  PUBLIC_SITE_URL: fullEnv.PUBLIC_SITE_URL,
  VITE_SUPABASE_URL: fullEnv.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: fullEnv.VITE_SUPABASE_ANON_KEY,
  VITE_SCRAPER_API_BASE_URL: fullEnv.VITE_SCRAPER_API_BASE_URL,
  OPENAI_API_KEY: fullEnv.OPENAI_API_KEY,
  LEAD_WEBHOOK_URL: fullEnv.LEAD_WEBHOOK_URL,
  MAX_DEPTH: fullEnv.MAX_DEPTH,
  DB_DRIVER: fullEnv.DB_DRIVER,
  DATABASE_URL: fullEnv.DATABASE_URL,
};
