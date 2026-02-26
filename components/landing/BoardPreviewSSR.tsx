import ModeBadge from '@/components/status/ModeBadge';
import { getTodayBoard } from '@/lib/today-service';
import LandingCtas from './LandingCtas';
import TraceHydrator from '@/components/nervous/TraceHydrator';

export default async function BoardPreviewSSR() {
  const today = await getTodayBoard();
  const row = today.ok ? today.data.board[0] : null;
  const provenance = today.ok ? today.provenance : today.provenance;

  return (
    <section className="mt-8 rounded-xl border border-dark-700 bg-dark-800 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-dark-300">Tonight&apos;s Board</p>
          <h2 className="text-lg font-semibold">Scout Card Preview</h2>
        </div>
        <ModeBadge mode={provenance?.mode || 'demo'} reason={provenance?.reason} />
      </div>


      {provenance?.mode === 'demo' && (
        <p className="mt-3 text-xs text-dark-300" title="Live vendor feeds are currently disabled for this session.">
          Live feeds unavailable {'->'} showing demo slate.
        </p>
      )}

      {row ? (
        <div className="mt-4 rounded-lg border border-dark-700 bg-dark-900 p-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">{row.matchup}</p>
            <p className="text-xs text-dark-300">{row.tipoff}</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {row.props.map((prop) => (
              <li key={prop.market} className="flex items-center justify-between gap-2">
                <span>{prop.market}</span>
                <span className="text-dark-300">{prop.line} · {prop.edge}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 animate-pulse rounded-lg border border-dark-700 bg-dark-900 p-3">
          <div className="h-4 w-32 rounded bg-dark-700" />
          <div className="mt-3 h-3 w-full rounded bg-dark-700" />
          <div className="mt-2 h-3 w-11/12 rounded bg-dark-700" />
          <div className="mt-2 h-3 w-10/12 rounded bg-dark-700" />
        </div>
      )}

      <TraceHydrator traceId={today.trace_id} />
      <LandingCtas />
    </section>
  );
}
