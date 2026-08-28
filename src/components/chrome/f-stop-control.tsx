'use client';

import { useRouteTransition } from '@/components/runtime/route-transition-provider';
import { useTheme } from '@/components/runtime/theme-provider';

export function FStopControl() {
  const { theme, toggleTheme } = useTheme();
  const { phase } = useRouteTransition();
  const disabled = phase !== 'idle';

  return (
    <button
      type="button"
      className="outline-pill f-stop-control"
      aria-label={`Switch to ${theme === 'dark' ? 'light F/1.4' : 'dark F-stop'} theme`}
      aria-pressed={theme === 'light'}
      disabled={disabled}
      onClick={toggleTheme}
    >
      <span className="f-stop-label-window" aria-hidden="true">
        <span className="f-stop-label-track">
          <span className="f-stop-dark-label">
            <span className="f-stop-desktop-label">F/24</span>
            <span className="f-stop-mobile-label">F/23</span>
          </span>
          <span>F/1.4</span>
        </span>
      </span>
      <span className="aperture-mark" aria-hidden="true">
        <span />
      </span>
    </button>
  );
}
