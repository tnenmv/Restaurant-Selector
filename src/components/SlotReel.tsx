import type { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { RestaurantImage } from './RestaurantImage';
import { useLabels } from './Badges';

/** The slot-machine card shown while picking. */
export function SlotReel({ reel, tick, party }: { reel: Restaurant | null; tick: number; party?: boolean }) {
  const { name } = useApp();
  const L = useLabels();
  return (
    <div className={`card relative overflow-hidden ${party ? 'ring-4 ring-fuchsia-200' : 'ring-4 ring-palm-100'}`} aria-live="off" data-testid="slot-reel">
      <div className="relative h-44 sm:h-56">
        {reel && <RestaurantImage key={`img-${tick}`} restaurant={reel} className="absolute inset-0 h-full w-full animate-reel-tick" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {/* slot window lines */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white/70 to-transparent" />
      </div>
      <div className="relative h-[84px] overflow-hidden px-5 py-4">
        {reel && (
          <div key={tick} className="animate-reel-tick">
            <div className="truncate font-display text-xl font-bold">{name(reel)}</div>
            <div className="mt-0.5 text-sm text-ink-mute">
              {L.cuisineIcon(reel)} {L.cuisine(reel)} · {L.area(reel)}
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
}
