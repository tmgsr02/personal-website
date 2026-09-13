import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openingIntroBootstrap, lockIntroScroll, INTRO_SESSION_KEY } from './opening-intro';

function style(value = '', priority = '') {
  return {
    getPropertyValue: () => value,
    getPropertyPriority: () => priority,
    setProperty: (_key: string, next: string, nextPriority = '') => { value = next; priority = nextPriority; },
    removeProperty: () => { value = ''; priority = ''; },
  };
}

function environment(options: { seen?: boolean; reduced?: boolean; hash?: string; history?: boolean; storageDenied?: boolean; search?: string; path?: string } = {}) {
  const data: Record<string, string> = {};
  const root = {
    dataset: data,
    removeAttribute: (name: string) => { if (name === 'data-opening') delete data.opening; },
    style: style('scroll', 'important'),
  };
  const body = { style: style() };
  const windowMock = Object.assign(new EventTarget(), { setTimeout });
  let seen = options.seen ? '1' : null;
  vi.stubGlobal('window', windowMock);
  vi.stubGlobal('document', { documentElement: root, body });
  vi.stubGlobal('location', { pathname: options.path ?? '/', hash: options.hash ?? '', search: options.search ?? '' });
  vi.stubGlobal('performance', { getEntriesByType: () => [{ type: options.history ? 'back_forward' : 'navigate' }] });
  vi.stubGlobal('matchMedia', () => ({ matches: !!options.reduced }));
  vi.stubGlobal('sessionStorage', {
    getItem: () => { if (options.storageDenied) throw new Error('denied'); return seen; },
    setItem: (_key: string, value: string) => { seen = value; },
  });
  return { root, body, windowMock };
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('opening intro eligibility and recovery', () => {
  it('covers the first visit and records the session so later visits bypass', () => {
    const { root } = environment();
    openingIntroBootstrap(INTRO_SESSION_KEY, false);
    expect(root.dataset.opening).toBe('pending');
    root.removeAttribute('data-opening');
    openingIntroBootstrap(INTRO_SESSION_KEY, false);
    expect(root.dataset.opening).toBeUndefined();
  });

  it.each([
    { seen: true }, { reduced: true }, { hash: '#work' }, { history: true },
    { storageDenied: true }, { path: '/about' },
  ])('bypasses without covering content: %j', (options) => {
    const { root } = environment(options);
    openingIntroBootstrap(INTRO_SESSION_KEY, false);
    expect(root.dataset.opening).toBeUndefined();
  });

  it('uncovers the server-rendered page when React never mounts', () => {
    const { root } = environment();
    openingIntroBootstrap(INTRO_SESSION_KEY, false);
    vi.advanceTimersByTime(3000);
    expect(root.dataset.opening).toBeUndefined();
  });

  it('does not interrupt an active sequence after React takes over', () => {
    const { root } = environment();
    openingIntroBootstrap(INTRO_SESSION_KEY, false);
    root.dataset.opening = 'running';
    vi.advanceTimersByTime(6000);
    expect(root.dataset.opening).toBe('running');
  });

  it('clears the cover on pagehide', () => {
    const { root, windowMock } = environment();
    openingIntroBootstrap(INTRO_SESSION_KEY, false);
    windowMock.dispatchEvent(new Event('pagehide'));
    expect(root.dataset.opening).toBeUndefined();
  });

  it('allows the replay query only in development', () => {
    const { root } = environment({ seen: true, search: '?intro=replay' });
    openingIntroBootstrap(INTRO_SESSION_KEY, false);
    expect(root.dataset.opening).toBeUndefined();
    openingIntroBootstrap(INTRO_SESSION_KEY, true);
    expect(root.dataset.opening).toBe('pending');
  });
});

describe('loader scroll lock', () => {
  it('restores prior overflow values and priorities, removing new inline declarations', () => {
    const { root, body } = environment();
    const unlock = lockIntroScroll();
    expect(root.style.getPropertyValue()).toBe('hidden');
    expect(body.style.getPropertyValue()).toBe('hidden');
    unlock();
    expect(root.style.getPropertyValue()).toBe('scroll');
    expect(root.style.getPropertyPriority()).toBe('important');
    expect(body.style.getPropertyValue()).toBe('');
    unlock();
    expect(root.style.getPropertyValue()).toBe('scroll');
  });
});
