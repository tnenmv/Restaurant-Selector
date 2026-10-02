import { useCallback, useEffect, useRef, useState } from 'react';
import type { PickMode, Restaurant } from '../types';
import { pickAvoidingRecent, pickOne, recentWindow } from '../utils/random';

export type PickerPhase = 'idle' | 'spinning' | 'revealed' | 'empty' | 'error';

interface Options {
  /** Names shown while the real pool is still loading. */
  visualPool: Restaurant[];
  /** Newest-first ids to avoid repeating. */
  recentIds: string[];
  onPicked?: (r: Restaurant, mode: PickMode) => void;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Drives the slot-machine pick:
 *   fast cycling (while the pool loads) → decelerating ticks → reveal.
 * The winner is chosen up-front with crypto randomness; the reel is cosmetic.
 */
export function usePicker({ visualPool, recentIds, onPicked }: Options) {
  const [phase, setPhase] = useState<PickerPhase>('idle');
  const [reel, setReel] = useState<Restaurant | null>(null);
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Restaurant | null>(null);
  const [mode, setMode] = useState<PickMode>('random');

  const token = useRef(0);
  const timers = useRef<number[]>([]);
  const latest = useRef({ visualPool, recentIds, onPicked });
  latest.current = { visualPool, recentIds, onPicked };

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const show = (r: Restaurant | undefined) => {
    if (!r) return;
    setReel(r);
    setTick((n) => n + 1);
  };

  const spin = useCallback(async (getPool: () => Promise<Restaurant[]> | Restaurant[], pickMode: PickMode) => {
    const my = ++token.current;
    clearTimers();
    setMode(pickMode);
    setResult(null);
    setPhase('spinning');
    if ('vibrate' in navigator) navigator.vibrate?.(15);

    const reduced = prefersReducedMotion();
    const started = performance.now();

    // Phase 1: fast cycling until the pool is known.
    const fast = window.setInterval(() => show(pickOne(latest.current.visualPool)), 65);
    timers.current.push(fast);
    show(pickOne(latest.current.visualPool));

    let pool: Restaurant[];
    try {
      pool = await getPool();
    } catch {
      window.clearInterval(fast);
      if (my === token.current) setPhase('error');
      return;
    }
    const minFast = reduced ? 0 : 350;
    const elapsed = performance.now() - started;
    if (elapsed < minFast) await new Promise((r) => setTimeout(r, minFast - elapsed));
    window.clearInterval(fast);
    if (my !== token.current) return;

    if (pool.length === 0) {
      setReel(null);
      setPhase('empty');
      return;
    }

    const recent = latest.current.recentIds.slice(0, recentWindow(pool.length));
    const winner = pickAvoidingRecent(pool, recent)!;

    // Phase 2: decelerate through the real pool, landing on the winner.
    const steps = reduced ? 2 : 14;
    const reelPool = pool.length > 1 ? pool : latest.current.visualPool;
    let t = 0;
    let prev = reel?.id;
    for (let i = 0; i < steps; i++) {
      const p = i / steps;
      t += reduced ? 120 : 60 + Math.pow(p, 2.4) * 320;
      const id = window.setTimeout(() => {
        // avoid showing the same name twice in a row
        let r = pickOne(reelPool);
        for (let k = 0; k < 4 && r && (r.id === prev || r.id === winner.id); k++) r = pickOne(reelPool);
        prev = r?.id;
        show(r);
      }, t);
      timers.current.push(id);
    }
    t += reduced ? 120 : 420;
    timers.current.push(
      window.setTimeout(() => {
        if (my !== token.current) return;
        show(winner);
        setResult(winner);
        setPhase('revealed');
        if ('vibrate' in navigator) navigator.vibrate?.([20, 40, 30]);
        latest.current.onPicked?.(winner, pickMode);
      }, t),
    );
  }, []);

  const reset = useCallback(() => {
    token.current++;
    clearTimers();
    setPhase('idle');
    setResult(null);
    setReel(null);
  }, []);

  return { phase, reel, tick, result, mode, spin, reset };
}
