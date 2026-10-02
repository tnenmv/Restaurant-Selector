import { useApp } from '../context/AppContext';
import type { usePicker } from '../hooks/usePicker';
import { PickerStage } from './PickerStage';
import { Sheet } from './Sheet';

/** Shows a picker's reel/result in a sheet (used by favourites & history). */
export function PickerOverlay({ picker, onPickAgain, title }: { picker: ReturnType<typeof usePicker>; onPickAgain: () => void; title: string }) {
  const { t } = useApp();
  const open = picker.phase !== 'idle';
  return (
    <Sheet open={open} onClose={picker.reset} label={title}>
      <h2 className="mb-3 pe-12 pt-1 font-display text-lg font-bold">{title}</h2>
      <PickerStage
        phase={picker.phase}
        reel={picker.reel}
        tick={picker.tick}
        result={picker.result}
        onPickAgain={onPickAgain}
        emptyActions={
          <button type="button" className="btn-ghost" onClick={picker.reset}>
            {t.back}
          </button>
        }
      />
    </Sheet>
  );
}
