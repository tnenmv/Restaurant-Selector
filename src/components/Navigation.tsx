import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

const ITEMS = [
  { to: '/', key: 'home', icon: HomeIcon },
  { to: '/map', key: 'map', icon: MapIcon },
  { to: '/favorites', key: 'favorites', icon: HeartIcon },
  { to: '/history', key: 'history', icon: ClockIcon },
] as const;

export function TopBar() {
  const { t, lang, setLang, favorites } = useApp();
  return (
    <header className="sticky top-0 z-40 border-b border-sand-200/80 bg-sand-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <NavLink to="/" aria-label={t.home}>
          <Logo />
        </NavLink>
        <nav className="hidden items-center gap-1 md:flex" aria-label="main">
          {ITEMS.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-palm-50 text-palm-700' : 'text-ink-soft hover:bg-sand-200 hover:text-ink'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {t[key]}
              {key === 'favorites' && favorites.ids.length > 0 && <CountDot n={favorites.ids.length} />}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm font-semibold text-ink-soft transition hover:border-palm-300 hover:text-palm-700"
          aria-label="Switch language"
        >
          🌐 {t.language}
        </button>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { t, favorites } = useApp();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="main"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {ITEMS.map(({ to, key, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex h-16 flex-col items-center justify-center gap-1 text-[12px] font-semibold transition-colors ${
                  isActive ? 'text-palm-700' : 'text-ink-mute'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid h-8 w-12 place-items-center rounded-full transition-all ${isActive ? 'bg-palm-50 scale-105' : ''}`}>
                    <Icon className="h-[22px] w-[22px]" filled={isActive} />
                  </span>
                  {t[key]}
                  {key === 'favorites' && favorites.ids.length > 0 && (
                    <span className="absolute top-2 start-[calc(50%+6px)]">
                      <CountDot n={favorites.ids.length} />
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function CountDot({ n }: { n: number }) {
  return (
    <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-date-500 px-1 text-[10px] font-bold text-white">
      {n > 99 ? '99+' : n}
    </span>
  );
}

type IconProps = { className?: string; filled?: boolean };

function HomeIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" fillOpacity={filled ? 0.15 : 0} />
    </svg>
  );
}
function MapIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" fill={filled ? 'currentColor' : 'none'} fillOpacity=".15" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
export function HeartIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" fillOpacity={filled ? 0.15 : 0} />
    </svg>
  );
}
function ClockIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="8.5" fill={filled ? 'currentColor' : 'none'} fillOpacity=".15" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
