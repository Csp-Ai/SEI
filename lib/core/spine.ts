export type SpineState = {
  sport: string;
  tz: string;
  date: string;
  mode: 'live' | 'cache' | 'demo';
  trace_id?: string;
};

export function appendQuery(path: string, query: Record<string, string | undefined>) {
  const base = path.startsWith('http') ? new URL(path) : new URL(path, 'http://localhost');
  Object.entries(query).forEach(([key, value]) => {
    if (!value) return;
    base.searchParams.set(key, value);
  });
  return path.startsWith('http') ? base.toString() : `${base.pathname}${base.search}`;
}

export const nervous = {
  toHref(path: string, spine: SpineState) {
    return appendQuery(path, {
      sport: spine.sport,
      tz: spine.tz,
      date: spine.date,
      mode: spine.mode,
      trace_id: spine.trace_id,
    });
  },
};
