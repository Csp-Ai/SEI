'use client';

import Link from 'next/link';
import { useNervousSystem } from '@/components/nervous/NervousSystemContext';

export default function LandingCtas() {
  const nervous = useNervousSystem();
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <Link href={nervous.toHref('/demo/demo')} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
        Open Tonight&apos;s Board
      </Link>
      <Link href={nervous.toHref('/demo2/playground2')} className="rounded-md border border-dark-600 px-4 py-2 text-sm">
        View Scout Cards
      </Link>
    </div>
  );
}
