import { useApp } from '../context/AppContext';
import { SMART_PREFERENCES } from '../data/options';
import type { SmartPreference } from '../types';
import { Chip } from './Chip';
import { LocationButton } from './LocationButton';

export function SmartPreferences() {
  const { t, lang, preferences, setPreferences, geo } = useApp();

  const toggle = (p: SmartPreference) => {
    const on = !preferences.includes(p);
    setPreferences(on ? [...preferences, p] : preferences.filter((x) => x !== p));
    if (on && p === 'nearMe' && geo.status !== 'granted') void geo.request();
  };

  return (
    <div className="animate-fade-up space-y-3 rounded-3xl border border-date-200 bg-gradient-to-br from-date-50 to-white p-4">
      <p className="text-sm text-ink-soft">✨ {t.smartHint}</p>
      <div className="flex flex-wrap gap-2">
        {SMART_PREFERENCES.map((o) => (
          <Chip key={o.value} tone="gold" icon={o.icon} active={preferences.includes(o.value)} onClick={() => toggle(o.value)}>
            {lang === 'ar' ? o.ar : o.en}
          </Chip>
        ))}
      </div>
      {preferences.includes('nearMe') && geo.status !== 'granted' && (
        <div className="space-y-2">
          <p className="text-xs text-ink-mute">{t.nearMeNeedsLocation}</p>
          <LocationButton />
        </div>
      )}
    </div>
  );
}
