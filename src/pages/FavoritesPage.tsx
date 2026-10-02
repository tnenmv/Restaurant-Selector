import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { usePicker } from '../hooks/usePicker';
import { EmptyState } from '../components/EmptyState';
import { FavoriteToggle, RestaurantRow, SkeletonRows } from '../components/RestaurantCards';
import { PickerOverlay } from '../components/PickerOverlay';
import { PageHeader } from '../components/PageHeader';

export function FavoritesPage() {
  const { t, favorites, getById, history, status } = useApp();
  const list = favorites.ids.map(getById).filter((r) => r !== undefined);
  const picker = usePicker({
    visualPool: list,
    recentIds: history.entries.map((e) => e.restaurantId),
    onPicked: (r) => history.add(r.id, 'favorites'),
  });
  const pick = () => void picker.spin(() => list, 'favorites');

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6">
      <PageHeader title={`❤️ ${t.favoritesTitle}`} count={list.length}>
        {list.length > 0 && (
          <button type="button" className="btn-primary" onClick={pick} data-testid="pick-favorites">
            🎲 {t.pickFromFavorites}
          </button>
        )}
      </PageHeader>
      {status === 'loading' ? (
        <SkeletonRows />
      ) : list.length === 0 ? (
        <EmptyState emoji="💚" title={t.noFavoritesTitle} description={t.noFavoritesDesc}>
          <Link to="/" className="btn-primary">
            🎲 {t.startPicking}
          </Link>
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {list.map((r) => (
            <li key={r.id} className="min-w-0 animate-fade-up">
              <RestaurantRow restaurant={r} actions={<FavoriteToggle restaurant={r} />} />
            </li>
          ))}
        </ul>
      )}
      <PickerOverlay picker={picker} onPickAgain={pick} title={`🎲 ${t.pickFromFavorites}`} />
    </div>
  );
}
