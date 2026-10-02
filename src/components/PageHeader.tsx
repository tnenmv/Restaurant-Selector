import type { ReactNode } from 'react';

export function PageHeader({ title, count, children }: { title: string; count?: number; children?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="font-display text-2xl font-bold">
        {title}
        {count !== undefined && count > 0 && <span className="ms-2 align-middle text-base font-semibold text-ink-mute">({count})</span>}
      </h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </header>
  );
}
