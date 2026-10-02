import { useApp } from '../context/AppContext';

export function Toasts() {
  const { toasts } = useApp();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-8"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div key={t.id} className="animate-pop-in rounded-full bg-ink/90 px-4 py-2.5 text-sm font-medium text-white shadow-lift backdrop-blur">
          {t.text}
        </div>
      ))}
    </div>
  );
}
