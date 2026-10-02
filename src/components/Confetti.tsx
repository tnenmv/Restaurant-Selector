import { useMemo, type CSSProperties } from 'react';

const COLORS = ['#18794e', '#4bb37f', '#c27d36', '#e2a032', '#f4e8d3', '#e88aa8'];

/** Lightweight CSS confetti burst. Re-mount (change `key`) to replay. */
export function Confetti({ count = 34 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const dist = 110 + Math.random() * 140;
        return {
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist + 120}px`,
          rot: `${Math.random() * 720 - 360}deg`,
          dur: `${900 + Math.random() * 700}ms`,
          delay: `${Math.random() * 120}ms`,
          color: COLORS[i % COLORS.length],
          round: i % 3 === 0,
        };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              background: p.color,
              borderRadius: p.round ? '50%' : undefined,
              '--dx': p.dx,
              '--dy': p.dy,
              '--rot': p.rot,
              '--dur': p.dur,
              '--delay': p.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
