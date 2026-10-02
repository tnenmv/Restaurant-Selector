import { useApp } from '../context/AppContext';

export function PrototypeNote() {
  const { t, restaurants, status } = useApp();
  if (status !== 'ready') return null;
  const sample = restaurants.some((r) => r.isSample);
  return (
    <p className="rounded-2xl border border-dashed border-date-300 bg-date-50/60 p-3 text-xs leading-relaxed text-date-800" data-testid="prototype-note">
      {sample ? `🧪 ${t.sampleNote}` : `🗺️ ${t.realDataNote(restaurants.length)}`}
    </p>
  );
}
