import { useApp } from '../context/AppContext';

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="18" fill="#18794e" />
      <rect x="13" y="13" width="38" height="38" rx="10" fill="#fdfcf9" transform="rotate(-8 32 32)" />
      <g transform="rotate(-8 32 32)">
        <circle cx="23" cy="23" r="3.8" fill="#18794e" />
        <circle cx="41" cy="23" r="3.8" fill="#c27d36" />
        <circle cx="32" cy="32" r="3.8" fill="#18794e" />
        <circle cx="23" cy="41" r="3.8" fill="#c27d36" />
        <circle cx="41" cy="41" r="3.8" fill="#18794e" />
      </g>
    </svg>
  );
}

export function Logo() {
  const { t, lang } = useApp();
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold text-palm-800">{lang === 'ar' ? 'وش ناكل؟' : t.appName}</span>
        <span className="block text-[11px] font-medium tracking-wide text-ink-mute" dir="ltr">
          Madinah Random
        </span>
      </span>
    </span>
  );
}
