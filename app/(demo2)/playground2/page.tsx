import ModeBadge from '@/components/status/ModeBadge';
import samples from '@/data/demo2/samples.json';
import BeforeAfter2 from '@/components/demo2/BeforeAfter2';
import LocalDetectorsPane from '@/components/demo2/LocalDetectorsPane';
import '@/styles/demo2.css';

export default function Playground2Page() {
  return (
    <section className="p-8 space-y-6">
      <div className="flex items-center gap-3"><h1 className="text-3xl font-bold">Scout Cards</h1><ModeBadge mode="demo" reason="Demo mode (live feeds off)" /></div>
      <LocalDetectorsPane />
      <BeforeAfter2 samples={samples.samples} />
    </section>
  );
}
