import ModeBadge from '@/components/status/ModeBadge';
import sample from '@/data/demoSamples.json';
import BeforeAfterPane from '@/components/BeforeAfterPane';
import FileDropZone from '@/components/FileDropZone';
import IncidentDrawer from '@/components/IncidentDrawer';

export default function DemoPage() {
  return (
    <section className="p-8 space-y-6">
      <div className="flex items-center gap-3"><h1 className="text-3xl font-bold">Tonight&apos;s Board</h1><ModeBadge mode="demo" reason="Demo mode (live feeds off)" /></div>
      <BeforeAfterPane sample={sample.sample} />
      <FileDropZone />
      <IncidentDrawer />
    </section>
  );
}
