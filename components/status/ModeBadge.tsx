import { Mode } from '@/lib/core/contracts';

const modeMap: Record<Mode, { label: string; className: string }> = {
  live: { label: 'LIVE', className: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' },
  cache: { label: 'CACHED', className: 'border-amber-500/50 bg-amber-500/10 text-amber-200' },
  demo: { label: 'DEMO', className: 'border-sky-500/50 bg-sky-500/10 text-sky-200' },
};

export default function ModeBadge({ mode, reason }: { mode: Mode; reason?: string }) {
  const meta = modeMap[mode];
  const tooltip = mode === 'demo' ? 'Demo mode (live feeds off)' : reason || `${meta.label} mode`;

  return (
    <span className={`rounded-full border px-2 py-1 text-xs ${meta.className}`} title={tooltip} aria-label={tooltip}>
      {meta.label}
    </span>
  );
}
