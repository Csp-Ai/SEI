'use client';

import { useEffect } from 'react';
import { useNervousSystem } from './NervousSystemContext';

export default function TraceHydrator({ traceId }: { traceId?: string }) {
  const { setTraceId } = useNervousSystem();

  useEffect(() => {
    if (traceId) setTraceId(traceId);
  }, [setTraceId, traceId]);

  return null;
}
