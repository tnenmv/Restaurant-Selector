import { useApp, type HomeMode } from '../context/AppContext';

export function ModeToggle() {
  const { t, homeMode, setHomeMode } = useApp();
  const items: { v: HomeMode; label: string; icon: string }[] = [
    { v: 'random', label: t.modeRandom, icon: '🎲' },
    { v: 'smart', label: t.modeSmart, icon: '✨' },
  ];
  return (
    <div role="tablist" aria-label="mode" className="relative grid grid-cols-2 rounded-2xl bg-sand-200/80 p-1">
      <span
        aria-hidden
        className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-soft transition-all duration-300 ${
          homeMode === 'random' ? 'start-1' : 'start-[calc(50%+3px)]'
        }`}
      />
      {items.map((it) => (
        <button
          key={it.v}
          type="button"
          role="tab"
          aria-selected={homeMode === it.v}
          onClick={() => setHomeMode(it.v)}
          className={`relative z-10 flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-1.5 text-[12.5px] font-semibold transition-colors sm:text-sm ${
            homeMode === it.v ? (it.v === 'smart' ? 'text-date-700' : 'text-palm-700') : 'text-ink-mute'
          }`}
        >
          <span aria-hidden>{it.icon}</span>
          {it.label}
        </button>
      ))}
    </div>
  );
}
