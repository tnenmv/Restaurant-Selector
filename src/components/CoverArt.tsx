import type { Cuisine } from '../types';
import { CUISINES } from '../data/options';

const PALETTES: Record<Cuisine, [string, string, string]> = {
  saudi: ['#f4e8d3', '#dab070', '#8c4a27'],
  arabic: ['#fbe9d0', '#e7a35c', '#9a4d1f'],
  gulf: ['#f6e3c8', '#d29a52', '#6d3d1c'],
  egyptian: ['#f8ecd2', '#d9a441', '#7a5214'],
  levantine: ['#e6f2dc', '#8fbf6a', '#3d6b25'],
  turkish: ['#fde4dc', '#e2725b', '#8f2f1d'],
  italian: ['#fde7e1', '#e0584a', '#2f7a3d'],
  asian: ['#fde6e3', '#e4574e', '#2b2b2b'],
  japanese: ['#fdeef0', '#e8798a', '#3a3a52'],
  indian: ['#fff0d6', '#f0a02c', '#a1381b'],
  burger: ['#fff1d9', '#f2a541', '#7c3a12'],
  pizza: ['#fff0dc', '#e9663f', '#3f7a2c'],
  seafood: ['#dff1f5', '#4aa6c4', '#14506a'],
  cafe: ['#efe6dc', '#a77b55', '#4a2f1c'],
  desserts: ['#fde8ef', '#e88aa8', '#7a3450'],
  other: ['#e3f1ea', '#4bb37f', '#134d37'],
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Illustrated cover used when a restaurant has no photo (all prototype data)
 * or when its photo fails to load. Deterministic per restaurant id.
 */
export function CoverArt({ cuisine, seed, label, className = '' }: { cuisine: Cuisine; seed: string; label?: string; className?: string }) {
  const [bg, mid, deep] = PALETTES[cuisine];
  const icon = CUISINES.find((c) => c.value === cuisine)?.icon ?? '🍽️';
  const h = hash(seed);
  const angle = 120 + (h % 90);
  const cx = 20 + (h % 60);
  const rot = (h % 30) - 15;
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ background: `linear-gradient(${angle}deg, ${bg} 0%, ${mid}55 70%, ${mid}99 100%)` }}
      role="img"
      aria-label={label}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <circle cx={`${cx}%`} cy="110%" r="160" fill={mid} opacity=".28" />
        <circle cx={`${100 - cx}%`} cy="-20%" r="110" fill={deep} opacity=".08" />
        <g stroke={deep} strokeOpacity=".12" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M40 240 C42 200 46 170 54 140" />
          <path d="M54 140 C40 132 26 134 16 146 M54 140 C44 124 30 118 18 120 M54 140 C62 124 76 118 88 120 M54 140 C68 132 82 134 92 146" />
          <path d="M360 240 C358 205 352 180 344 156" />
          <path d="M344 156 C356 148 370 150 380 160 M344 156 C352 142 366 136 378 138 M344 156 C336 142 322 136 310 138" />
        </g>
        <g fill={deep} opacity=".08">
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={(i * 53 + (h % 40)) % 400} cy={(i * 37 + (h % 25)) % 240} r={i % 3 === 0 ? 3 : 2} />
          ))}
        </g>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span
          className="drop-shadow-[0_10px_18px_rgba(0,0,0,.18)] select-none"
          style={{ fontSize: 'min(34cqw, 5.5rem)', transform: `rotate(${rot}deg)` }}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
