import { useApp } from '../context/AppContext';

export function PrototypeNote() {
  const { t, source } = useApp();
  return (
    <p className="rounded-2xl border border-dashed border-date-300 bg-date-50/60 p-3 text-xs leading-relaxed text-date-800" data-testid="prototype-note">
      🧪 {t.sampleNote}
      {source !== 'mock' && <span className="block opacity-70">source: {source}</span>}
    </p>
  );
}
