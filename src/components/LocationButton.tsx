import { useApp } from '../context/AppContext';

export function LocationButton({ compact }: { compact?: boolean }) {
  const { geo, t } = useApp();
  const { status } = geo;
  const label =
    status === 'locating' ? t.locating : status === 'granted' ? t.locationOn : t.useMyLocation;
  const failed = status === 'denied' || status === 'unavailable' || status === 'timeout' || status === 'unsupported';
  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => void geo.request()}
        disabled={status === 'locating'}
        className={`inline-flex min-h-[40px] items-center gap-2 self-start rounded-full border px-3.5 text-sm font-semibold transition ${
          status === 'granted'
            ? 'border-palm-200 bg-palm-50 text-palm-700'
            : 'border-sand-300 bg-white text-ink-soft hover:border-palm-300 hover:text-palm-700'
        }`}
      >
        <span className={status === 'locating' ? 'animate-spin' : ''} aria-hidden>
          {status === 'locating' ? '◌' : status === 'granted' ? '✅' : '📍'}
        </span>
        {label}
      </button>
      {failed && !compact && (
        <p className="text-xs text-date-700" role="status">
          ⚠️ {status === 'denied' ? t.locationDenied : t.locationUnavailable}
        </p>
      )}
    </div>
  );
}
