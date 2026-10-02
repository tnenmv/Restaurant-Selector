import type { ReactNode } from 'react';

export function Chip({
  active,
  onClick,
  children,
  icon,
  tone = 'green',
  size = 'md',
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  tone?: 'green' | 'gold';
  size?: 'md' | 'lg';
}) {
  const on =
    tone === 'gold'
      ? 'bg-date-500 text-white border-date-500 shadow-[0_6px_16px_-6px_rgba(194,125,54,.7)]'
      : 'bg-palm-600 text-white border-palm-600 shadow-[0_6px_16px_-6px_rgba(24,121,78,.7)]';
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium transition-all duration-150 active:scale-95 ${
        size === 'lg' ? 'min-h-[46px] px-4 text-[15px]' : 'min-h-[40px] px-3.5 text-sm'
      } ${active ? on : 'bg-white text-ink-soft border-sand-300 hover:border-palm-300 hover:text-palm-800'}`}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {children}
    </button>
  );
}
