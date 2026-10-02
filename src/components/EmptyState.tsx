import type { ReactNode } from 'react';

export function EmptyState({
  emoji,
  title,
  description,
  children,
  compact,
}: {
  emoji: string;
  title: string;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`card flex flex-col items-center text-center animate-fade-up ${compact ? 'p-6' : 'px-6 py-10'}`}>
      <div className="mb-3 grid h-20 w-20 place-items-center rounded-full bg-palm-50 text-4xl animate-float" aria-hidden>
        {emoji}
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-ink-soft">{description}</p>}
      {children && <div className="mt-5 flex w-full max-w-xs flex-col gap-2 sm:max-w-sm sm:flex-row sm:justify-center">{children}</div>}
    </div>
  );
}
