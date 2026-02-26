import HeroEffects from '@/components/landing/HeroEffects';
import BoardPreviewSSR from '@/components/landing/BoardPreviewSSR';

export default function HomePage() {
  return (
    <section className="relative p-8">
      <HeroEffects />
      <div className="relative z-10 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-300">ResearchBets</p>
        <h1 className="mt-2 text-4xl font-bold">Betting-first AI research that shows proof in seconds.</h1>
        <p className="mt-4 max-w-2xl text-dark-200">
          Start with tonight&apos;s board, inspect scout cards, and trace every recommendation from source to slip.
        </p>
      </div>
      <BoardPreviewSSR />
    </section>
  );
}
