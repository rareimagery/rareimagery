import { useState, useCallback } from 'react';

interface AutoplayGateProps {
  onUnlock: () => void;
  trackTitle?: string | null;
  artistName?: string | null;
}

export function AutoplayGate({ onUnlock, trackTitle, artistName }: AutoplayGateProps) {
  const [visible, setVisible] = useState(true);

  const handleUnlock = useCallback(() => {
    setVisible(false);
    // Store in sessionStorage so we don't show again
    try {
      sessionStorage.setItem('rareimagery_autoplay_unlocked', '1');
    } catch {
      // sessionStorage may not be available
    }
    onUnlock();
  }, [onUnlock]);

  if (!visible) return null;

  return (
    <div className="autoplay-gate" onClick={handleUnlock} role="button" tabIndex={0}>
      <div className="autoplay-gate__inner">
        <span className="autoplay-gate__play-icon">▶</span>
        <p className="autoplay-gate__text">Click to enter</p>
        {(trackTitle || artistName) && (
          <p className="autoplay-gate__track">
            &#9835;{' '}
            {trackTitle}
            {artistName && ` — ${artistName}`}
          </p>
        )}
        <p className="autoplay-gate__hint">Music will play</p>
      </div>
    </div>
  );
}
