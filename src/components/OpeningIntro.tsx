'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Loader from '@/components/Loader';

/** Site-specific visit eligibility; Loader itself can be mounted anywhere. */
export default function OpeningIntro() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [replay, setReplay] = useState(0);
  const finish = useCallback(() => {
    document.documentElement.removeAttribute('data-opening');
    setActive(false);
  }, []);

  useLayoutEffect(() => {
    if (document.documentElement.dataset.opening === 'pending') {
      document.documentElement.dataset.opening = 'running';
      setActive(true);
    }
    const start = () => {
      if (location.pathname !== '/' || location.hash || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      document.documentElement.dataset.opening = 'running';
      setReplay((value) => value + 1);
      setActive(true);
    };
    window.addEventListener('pagehide', finish);
    window.addEventListener('popstate', finish);
    window.addEventListener('hashchange', finish);
    if (process.env.NODE_ENV === 'development') window.addEventListener('opening:replay', start);
    return () => {
      window.removeEventListener('pagehide', finish);
      window.removeEventListener('popstate', finish);
      window.removeEventListener('hashchange', finish);
      window.removeEventListener('opening:replay', start);
      document.documentElement.removeAttribute('data-opening');
    };
  }, [finish]);

  useLayoutEffect(() => { if (pathname !== '/') finish(); }, [pathname, finish]);

  return (
    <>
      {active && pathname === '/' && (
        <Loader key={replay} onComplete={() => {
          finish();
          document.querySelector<HTMLElement>('[data-intro-heading]')?.focus({ preventScroll: true });
        }} />
      )}
      {process.env.NODE_ENV === 'development' && pathname === '/' && !active && (
        <button
          className="fixed bottom-6 right-6 z-40 min-h-11 bg-paper px-2 font-mono text-xs text-ink-blue"
          onClick={() => window.dispatchEvent(new Event('opening:replay'))}
        >Replay intro</button>
      )}
    </>
  );
}
