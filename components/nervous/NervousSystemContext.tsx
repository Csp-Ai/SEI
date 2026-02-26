'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { nervous, type SpineState } from '@/lib/core/spine';

type NervousContextShape = {
  spine: SpineState;
  setTraceId: (traceId?: string) => void;
  toHref: (path: string) => string;
};

const NervousSystemContext = createContext<NervousContextShape | null>(null);

function initialSpine(): SpineState {
  return {
    sport: 'nba',
    tz: 'America/New_York',
    date: new Date().toISOString().slice(0, 10),
    mode: 'demo',
  };
}

export function NervousSystemProvider({ children }: { children: React.ReactNode }) {
  const [spine, setSpine] = useState<SpineState>(initialSpine);

  const value = useMemo(
    () => ({
      spine,
      setTraceId: (traceId?: string) => setSpine((prev) => ({ ...prev, trace_id: traceId })),
      toHref: (path: string) => nervous.toHref(path, spine),
    }),
    [spine]
  );

  return <NervousSystemContext.Provider value={value}>{children}</NervousSystemContext.Provider>;
}

export function useNervousSystem() {
  const value = useContext(NervousSystemContext);
  if (!value) throw new Error('useNervousSystem must be used within NervousSystemProvider');
  return value;
}
