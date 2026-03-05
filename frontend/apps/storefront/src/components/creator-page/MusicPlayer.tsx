import type { CreatorTheme } from '@rareimagery/types';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

interface MusicPlayerProps {
  theme: CreatorTheme;
  onRequestPlay?: () => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MusicPlayer({ theme }: MusicPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoaded,
    toggle,
    seek,
    setVolume,
  } = useAudioPlayer(theme.musicUrl, {
    loop: theme.musicLoop,
    volume: theme.musicVolume,
  });

  if (!theme.musicUrl) return null;

  const position = theme.musicPlayerPosition;
  if (position === 'hidden') return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`music-player music-player--${position}`}>
      <button className="music-player__toggle" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '⏸' : '▶'}
      </button>

      <div className="music-player__info">
        {theme.musicTrackTitle && (
          <span className="music-player__title">{theme.musicTrackTitle}</span>
        )}
        {theme.musicArtist && (
          <span className="music-player__artist">{theme.musicArtist}</span>
        )}
      </div>

      {isLoaded && (
        <div className="music-player__progress-wrap">
          <input
            type="range"
            className="music-player__progress"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
          />
          <span className="music-player__time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      )}

      <div className="music-player__volume-wrap">
        <input
          type="range"
          className="music-player__volume"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}

