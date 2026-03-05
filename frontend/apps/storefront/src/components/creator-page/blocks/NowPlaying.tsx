import { useTheme } from '../../../contexts/ThemeContext';

export function NowPlaying() {
  const { theme } = useTheme();

  if (!theme?.musicUrl) return null;

  return (
    <section className="creator-page__now-playing-block">
      <h2 className="creator-page__section-title">Now Playing</h2>
      <div className="creator-page__now-playing-info">
        <span className="creator-page__now-playing-icon">&#9835;</span>
        <div>
          {theme.musicTrackTitle && (
            <span className="creator-page__track-title">{theme.musicTrackTitle}</span>
          )}
          {theme.musicArtist && (
            <span className="creator-page__track-artist">{theme.musicArtist}</span>
          )}
        </div>
      </div>
    </section>
  );
}
