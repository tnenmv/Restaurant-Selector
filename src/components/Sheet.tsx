import { useEffect, type ReactNode } from 'react';

/** Bottom sheet on mobile, centered dialog on larger screens. */
export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={label}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade-up" onClick={onClose} />
      <div className="relative max-h-[92dvh] w-full max-w-lg animate-slide-up overflow-y-auto rounded-t-[2rem] bg-sand-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lift sm:animate-pop-in sm:rounded-[2rem]">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-sand-300 sm:hidden" aria-hidden />
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute end-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-ink-soft shadow-soft"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
