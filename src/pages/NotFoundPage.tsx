import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export function NotFoundPage() {
  const { t } = useApp();
  return (
    <div className="mx-auto max-w-xl px-4 pt-10">
      <EmptyState emoji="🧭" title="404">
        <Link to="/" className="btn-primary">
          {t.home}
        </Link>
      </EmptyState>
    </div>
  );
}
