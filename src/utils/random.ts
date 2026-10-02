/**
 * Randomisation helpers. Uses crypto.getRandomValues when available so picks
 * are genuinely unpredictable (and unbiased via rejection sampling).
 */
export function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) throw new Error('randomInt: max must be > 0');
  const c = globalThis.crypto;
  if (c?.getRandomValues) {
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
    const buf = new Uint32Array(1);
    do c.getRandomValues(buf);
    while (buf[0] >= limit);
    return buf[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

export function pickOne<T>(items: readonly T[]): T | undefined {
  return items.length ? items[randomInt(items.length)] : undefined;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick a random item while avoiding recently picked ids.
 * - Never returns the most recent pick if any alternative exists.
 * - Excludes up to `recentIds.length` recent picks, relaxing the exclusion
 *   (oldest first) when the pool is too small.
 */
export function pickAvoidingRecent<T extends { id: string }>(
  pool: readonly T[],
  recentIds: readonly string[],
): T | undefined {
  if (pool.length === 0) return undefined;
  if (pool.length === 1) return pool[0];
  // recentIds is newest-first. Try excluding all, then progressively fewer.
  for (let keep = recentIds.length; keep >= 1; keep--) {
    const excluded = new Set(recentIds.slice(0, keep));
    const candidates = pool.filter((r) => !excluded.has(r.id));
    if (candidates.length > 0) return pickOne(candidates);
  }
  return pickOne(pool);
}

/** Size of the "recently picked" exclusion window for a pool. */
export function recentWindow(poolSize: number): number {
  return Math.max(0, Math.min(6, Math.floor(poolSize / 2)));
}
