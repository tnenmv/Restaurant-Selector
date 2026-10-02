import { describe, expect, it } from 'vitest';
import { SAMPLE_RESTAURANTS } from '../data/restaurants';
import { AREAS, CUISINES } from '../data/options';
import { brandKey, pickAvoidingRecent, pickBrandAvoidingRecent, randomInt, recentWindow } from '../utils/random';
import { applyQuery, EMPTY_FILTERS, preferenceSupported } from '../utils/filters';
import { loadMadinahPlaces } from '../data/madinahPlaces';
import { CATEGORIES } from '../data/options';
import { distanceKm } from '../utils/geo';
import { createMockRestaurantService } from '../services/mockRestaurantService';

describe('sample dataset', () => {
  it('has 30+ restaurants with unique ids, all flagged as sample data', () => {
    expect(SAMPLE_RESTAURANTS.length).toBeGreaterThanOrEqual(30);
    expect(new Set(SAMPLE_RESTAURANTS.map((r) => r.id)).size).toBe(SAMPLE_RESTAURANTS.length);
    expect(SAMPLE_RESTAURANTS.every((r) => r.isSample)).toBe(true);
  });
  it('covers every area and almost every cuisine, inside Madinah', () => {
    const areas = new Set(SAMPLE_RESTAURANTS.map((r) => r.area));
    expect(AREAS.filter((a) => a.value !== 'other').every((a) => areas.has(a.value))).toBe(true);
    const cuisines = new Set(SAMPLE_RESTAURANTS.map((r) => r.cuisine));
    expect(CUISINES.every((c) => cuisines.has(c.value))).toBe(true);
    for (const r of SAMPLE_RESTAURANTS) {
      expect(distanceKm({ latitude: 24.4672, longitude: 39.6111 }, r)).toBeLessThan(15);
    }
  });
});

describe('random', () => {
  it('randomInt stays in range and hits every value', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      const v = randomInt(7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
      seen.add(v);
    }
    expect(seen.size).toBe(7);
  });

  it('never repeats a recently picked restaurant when alternatives exist', () => {
    const pool = SAMPLE_RESTAURANTS.slice(0, 10);
    const recent: string[] = [];
    for (let i = 0; i < 200; i++) {
      const window = recent.slice(0, recentWindow(pool.length));
      const r = pickAvoidingRecent(pool, window)!;
      expect(window).not.toContain(r.id);
      recent.unshift(r.id);
    }
  });

  it('relaxes exclusion for tiny pools but never repeats the last pick', () => {
    const pool = SAMPLE_RESTAURANTS.slice(0, 2);
    let last = pickAvoidingRecent(pool, [])!.id;
    for (let i = 0; i < 50; i++) {
      const r = pickAvoidingRecent(pool, [last, 'x', 'y'])!;
      expect(r.id).not.toBe(last);
      last = r.id;
    }
    expect(pickAvoidingRecent([pool[0]], [pool[0].id])!.id).toBe(pool[0].id);
    expect(pickAvoidingRecent([], [])).toBeUndefined();
  });

  it('is roughly uniform', () => {
    const pool = SAMPLE_RESTAURANTS.slice(0, 5);
    const counts = new Map<string, number>();
    for (let i = 0; i < 5000; i++) {
      const r = pickAvoidingRecent(pool, [])!;
      counts.set(r.id, (counts.get(r.id) ?? 0) + 1);
    }
    for (const c of counts.values()) expect(c).toBeGreaterThan(800);
  });
});

describe('filters', () => {
  it('respects every filter dimension', () => {
    const out = applyQuery(SAMPLE_RESTAURANTS, {
      filters: { ...EMPTY_FILTERS, cuisines: ['saudi', 'burger'], prices: [1], minRating: 4 },
    });
    expect(out.length).toBeGreaterThan(0);
    for (const r of out) {
      expect(['saudi', 'burger']).toContain(r.cuisine);
      expect(r.priceLevel).toBe(1);
      expect(r.rating).toBeGreaterThanOrEqual(4);
    }
  });

  it('applies smart preferences', () => {
    const out = applyQuery(SAMPLE_RESTAURANTS, { preferences: ['family', 'outdoor', 'openNow'] });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((r) => r.familyFriendly && r.outdoorSeating && r.openNow)).toBe(true);
  });

  it('returns nothing for impossible combinations', () => {
    expect(applyQuery(SAMPLE_RESTAURANTS, { filters: { ...EMPTY_FILTERS, cuisines: ['japanese'], prices: [1] } })).toEqual([]);
  });

  it('nearMe uses radius when location known and is ignored otherwise', () => {
    const quba = { latitude: 24.4395, longitude: 39.6175 };
    const near = applyQuery(SAMPLE_RESTAURANTS, { preferences: ['nearMe'], origin: quba, nearRadiusKm: 2 });
    expect(near.length).toBeGreaterThan(0);
    expect(near.every((r) => distanceKm(quba, r) <= 2)).toBe(true);
    expect(applyQuery(SAMPLE_RESTAURANTS, { preferences: ['nearMe'] }).length).toBe(SAMPLE_RESTAURANTS.length);
  });
});

describe('mock restaurant service', () => {
  it('implements the service contract', async () => {
    const svc = createMockRestaurantService(0);
    expect((await svc.getRestaurants()).length).toBe(SAMPLE_RESTAURANTS.length);
    expect((await svc.getRestaurantById('r01'))?.id).toBe('r01');
    expect(await svc.getRestaurantById('nope')).toBeUndefined();
    const cafes = await svc.searchRestaurants({ filters: { ...EMPTY_FILTERS, categories: ['cafe'] } });
    expect(cafes.every((r) => r.category === 'cafe')).toBe(true);
  });
});

describe('real Madinah dataset (Overture Maps)', async () => {
  const { meta, restaurants } = await loadMadinahPlaces();

  it('has 1000+ unique real places inside Madinah, none flagged as sample', () => {
    expect(meta.count).toBe(restaurants.length);
    expect(restaurants.length).toBeGreaterThan(1000);
    expect(new Set(restaurants.map((r) => r.id)).size).toBe(restaurants.length);
    for (const r of restaurants) {
      expect(r.isSample).toBe(false);
      expect(r.name.trim()).not.toBe('');
      expect(distanceKm({ latitude: 24.4672, longitude: 39.6111 }, r)).toBeLessThan(25);
    }
  });

  it('uses only known categories, cuisines and areas', () => {
    const cuisines = new Set(CUISINES.map((c) => c.value));
    const cats = new Set(CATEGORIES.map((c) => c.value));
    const areas = new Set(AREAS.map((a) => a.value));
    for (const r of restaurants) {
      expect(cuisines.has(r.cuisine)).toBe(true);
      expect(cats.has(r.category)).toBe(true);
      expect(areas.has(r.area)).toBe(true);
    }
  });

  it('treats missing ratings/prices/amenities as unknown, not as matches', () => {
    expect(applyQuery(restaurants, { filters: { ...EMPTY_FILTERS, minRating: 4 } })).toEqual([]);
    expect(applyQuery(restaurants, { filters: { ...EMPTY_FILTERS, prices: [1] } })).toEqual([]);
    expect(preferenceSupported(restaurants, 'family')).toBe(false);
    expect(preferenceSupported(restaurants, 'nearMe')).toBe(true);
    const burgers = applyQuery(restaurants, { filters: { ...EMPTY_FILTERS, cuisines: ['burger'] } });
    expect(burgers.length).toBeGreaterThan(20);
  });
});

describe('brand-aware picking', () => {
  it('normalises branch names to one brand', () => {
    expect(brandKey('Kudu - Bir Uthman')).toBe(brandKey('Kudu'));
    expect(brandKey('Shawarmer | شاورمر')).toBe('shawarmer');
    expect(brandKey("McDonald's")).toBe(brandKey('McDonalds'));
  });

  it('gives each brand an equal chance and never repeats a recent brand', () => {
    const pool = [
      ...Array.from({ length: 20 }, (_, i) => ({ id: `d${i}`, name: 'Dunkin' })),
      { id: 'a', name: 'Alpha' },
      { id: 'b', name: 'Beta' },
      { id: 'c', name: 'Gamma' },
    ];
    const names = new Map(pool.map((r) => [r.id, r.name]));
    let dunkin = 0;
    for (let i = 0; i < 4000; i++) if (pickBrandAvoidingRecent(pool, [], (id) => names.get(id))!.name === 'Dunkin') dunkin++;
    expect(dunkin).toBeGreaterThan(800);
    expect(dunkin).toBeLessThan(1200);
    const recent: string[] = [];
    for (let i = 0; i < 100; i++) {
      const r = pickBrandAvoidingRecent(pool, recent, (id) => names.get(id))!;
      if (recent.length) expect(names.get(recent[0])).not.toBe(r.name);
      recent.unshift(r.id);
    }
  });
});
