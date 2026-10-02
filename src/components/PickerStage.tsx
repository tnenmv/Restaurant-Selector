import type { ReactNode } from 'react';
import type { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import type { PickerPhase } from '../hooks/usePicker';
import { SlotReel } from './SlotReel';
import { ResultCard } from './ResultCard';
import { EmptyState } from './EmptyState';

/** Renders whatever the picker is doing: reel, reveal, empty or error state. */
export function PickerStage({
  phase,
  reel,
  tick,
  result,
  onPickAgain,
  onDislike,
  emptyActions,
  party,
  headline,
}: {
  phase: PickerPhase;
  reel: Restaurant | null;
  tick: number;
  result: Restaurant | null;
  onPickAgain: () => void;
  onDislike?: () => void;
  emptyActions?: ReactNode;
  party?: boolean;
  headline?: string;
}) {
  const { t } = useApp();
  if (phase === 'spinning') return <SlotReel reel={reel} tick={tick} party={party} />;
  if (phase === 'revealed' && result)
    return <ResultCard restaurant={result} onPickAgain={onPickAgain} onDislike={onDislike} headline={headline} />;
  if (phase === 'empty')
    return (
      <div data-testid="no-match">
        <EmptyState emoji="🤷‍♂️" title={t.noMatchTitle} description={t.noMatchDesc}>
          {emptyActions}
        </EmptyState>
      </div>
    );
  if (phase === 'error')
    return (
      <EmptyState emoji="📡" title={t.apiErrorTitle} description={t.apiErrorDesc}>
        <button type="button" className="btn-primary" onClick={onPickAgain}>
          {t.retry}
        </button>
      </EmptyState>
    );
  return null;
}
