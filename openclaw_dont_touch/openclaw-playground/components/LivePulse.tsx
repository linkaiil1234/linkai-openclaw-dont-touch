'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function LivePulse() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 4000); // Pulse every 4 seconds

    return () => clearInterval(interval);
  }, [router]);

  return null; // Invisible component
}
