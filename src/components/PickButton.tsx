import { useState } from 'react';

export function PickButton({
  onClick,
  loading,
  label,
  loadingLabel,
  variant = 'green',
  icon = '🎲',
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
  loadingLabel: string;
  variant?: 'green' | 'gold' | 'party';
  icon?: string;
}) {
  const [wobble, setWobble] = useState(0);
  const bg = {
    green: 'from-palm-500 via-palm-600 to-palm-700 shadow-glow',
    gold: 'from-date-400 via-date-500 to-date-600 shadow-[0_10px_30px_-6px_rgba(194,125,54,.6)]',
    party: 'from-fuchsia-500 via-date-500 to-palm-500 shadow-[0_10px_30px_-6px_rgba(192,38,211,.45)]',
  }[variant];
  return (
    <button
      type="button"
      data-testid="pick-button"
      onClick={() => {
        setWobble((n) => n + 1);
        onClick();
      }}
      disabled={loading}
      aria-busy={loading}
      className={`group relative w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${bg} px-6 py-5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[.98] disabled:cursor-wait ${
        loading ? 'scale-[.98] brightness-95' : variant === 'green' ? 'pulse-ring' : 'pulse-ring-gold'
      }`}
    >
      {/* sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -start-1/2 w-1/2 -skew-x-12 bg-white/20 blur-md transition-all duration-700 group-hover:start-[120%]"
      />
      <span className="relative flex items-center justify-center gap-3">
        <span
          key={wobble}
          aria-hidden
          className={`inline-block text-3xl sm:text-4xl ${loading ? 'animate-spin-dice' : 'animate-wobble group-hover:animate-wobble'}`}
        >
          {icon}
        </span>
        <span className="font-display text-xl font-bold sm:text-2xl">{loading ? loadingLabel : label}</span>
      </span>
      {loading && (
        <span className="absolute inset-x-8 bottom-2 h-1 overflow-hidden rounded-full bg-white/25" aria-hidden>
          <span className="block h-full w-1/3 rounded-full bg-white/80" style={{ animation: 'loadbar 1s linear infinite' }} />
        </span>
      )}
    </button>
  );
}
