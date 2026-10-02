import { useState } from 'react';
import type { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { CoverArt } from './CoverArt';

/** Photo with graceful fallback to an illustrated cover. */
export function RestaurantImage({ restaurant, className = '' }: { restaurant: Restaurant; className?: string }) {
  const { name, t } = useApp();
  const [failed, setFailed] = useState(false);
  const label = name(restaurant);

  if (restaurant.image && !failed) {
    return (
      <img
        src={restaurant.image}
        alt={label}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`${/\babsolute\b/.test(className) ? '' : 'relative '}[container-type:inline-size] ${className}`}>
      <CoverArt cuisine={restaurant.cuisine} seed={restaurant.id} label={label} className="absolute inset-0" />
      {restaurant.image && failed && (
        <span className="absolute bottom-2 start-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-ink-soft">
          {t.imageUnavailable}
        </span>
      )}
    </div>
  );
}
