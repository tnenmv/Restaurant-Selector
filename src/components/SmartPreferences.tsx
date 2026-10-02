import { useApp } from '../context/AppContext';
import { SMART_PREFERENCES } from '../data/options';
import type { SmartPreference } from '../types';
import { Chip } from './Chip';
import { preferenceSupported } from '../utils/filters';
import { LocationButton } from './LocationButton';

export function SmartPreferences() {
  const { t, lang, preferences, setPreferences, geo, restaurants } = useApp();
  const supported = (p: SmartPreference) => preferenceSupported(restaurants, p);
  const unsupported = SMART_PREFERENCES.filter((o) => !supported(o.value));

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
          <Chip key={o.value} tone="gold" icon={o.icon} disabled={!supported(o.value) && !preferences.includes(o.value)} active={preferences.includes(o.value)} onClick={() => toggle(o.value)}>
            {lang === 'ar' ? o.ar : o.en}
          </Chip>
        ))}
      </div>
      {unsupported.length > 0 && (
        <p className="text-xs text-ink-mute">
          {unsupported.map((o) => (lang === 'ar' ? o.ar : o.en)).join('، ')}: {t.notInData}
        </p>
      )}
      {preferences.includes('nearMe') && geo.status !== 'granted' && (
        <div className="space-y-2">
          <p className="text-xs text-ink-mute">{t.nearMeNeedsLocation}</p>
          <LocationButton />
        </div>
      )}
    </div>
  );
}
