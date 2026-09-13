export const INTRO_SESSION_KEY = 'miguel:opening-seen';

/** Pre-paint eligibility check; a failed hydration must never hide the page. */
export function openingIntroBootstrap(sessionKey: string, development: boolean) {
  const root = document.documentElement;
  const dismiss = () => root.removeAttribute('data-opening');
  try {
    const replay = development && new URLSearchParams(location.search).get('intro') === 'replay';
    const historyVisit = performance.getEntriesByType('navigation').some(
      (entry) => (entry as PerformanceNavigationTiming).type === 'back_forward',
    );
    const seen = sessionStorage.getItem(sessionKey);
    sessionStorage.setItem(sessionKey, '1');
    if (location.pathname !== '/' || location.hash || historyVisit ||
        matchMedia('(prefers-reduced-motion: reduce)').matches || (seen && !replay)) return;
    root.dataset.opening = 'pending';
    // React owns the measured animation after mounting. This watchdog
    // only uncovers the pre-hydration cover if the component never mounts.
    window.setTimeout(() => {
      if (root.dataset.opening === 'pending') dismiss();
    }, 3000);
    window.addEventListener('pagehide', dismiss, { once: true });
  } catch { dismiss(); }
}

/** Restore exactly the inline values that were present before the loader. */
export function lockIntroScroll() {
  const elements = [document.documentElement, document.body];
  const previous = elements.map(({ style }) => ({
    value: style.getPropertyValue('overflow'),
    priority: style.getPropertyPriority('overflow'),
  }));
  elements.forEach(({ style }) => style.setProperty('overflow', 'hidden'));
  return () => elements.forEach(({ style }, index) => {
    const { value, priority } = previous[index];
    if (value) style.setProperty('overflow', value, priority);
    else style.removeProperty('overflow');
  });
}

export const openingIntroScript = `(${openingIntroBootstrap.toString()})(${JSON.stringify(INTRO_SESSION_KEY)},${process.env.NODE_ENV === 'development'})`;
