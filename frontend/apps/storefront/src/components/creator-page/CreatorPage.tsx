import { useState, useCallback } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeInjector } from './ThemeInjector';
import { MusicPlayer } from './MusicPlayer';
import { AutoplayGate } from './AutoplayGate';
import { ProfileHeader } from './blocks/ProfileHeader';
import { AboutMe } from './blocks/AboutMe';
import { NowPlaying } from './blocks/NowPlaying';
import { TopProducts } from './blocks/TopProducts';
import { ProductGridBlock } from './blocks/ProductGridBlock';
import { SocialLinksBlock } from './blocks/SocialLinksBlock';
import type { LayoutBlock } from '@rareimagery/types';

const BLOCK_MAP: Record<string, React.ComponentType> = {
  'profile-header': ProfileHeader,
  'about-me': AboutMe,
  'now-playing': NowPlaying,
  'top-products': TopProducts,
  'product-grid': ProductGridBlock,
  'social-links': SocialLinksBlock,
};

const DEFAULT_BLOCKS: LayoutBlock[] = [
  { id: 'profile-header', enabled: true, order: 1 },
  { id: 'about-me', enabled: true, order: 2 },
  { id: 'now-playing', enabled: true, order: 3 },
  { id: 'top-products', enabled: true, order: 4 },
  { id: 'product-grid', enabled: true, order: 5 },
  { id: 'social-links', enabled: true, order: 6 },
];

export function CreatorPage() {
  const { store } = useStore();
  const { theme } = useTheme();
  const [audioUnlocked, setAudioUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('rareimagery_autoplay_unlocked') === '1';
    } catch {
      return false;
    }
  });

  const handleAudioUnlock = useCallback(() => {
    setAudioUnlocked(true);
  }, []);

  if (!store || !theme) return null;

  const blocks = theme.layoutBlocks.length > 0 ? theme.layoutBlocks : DEFAULT_BLOCKS;
  const enabledBlocks = blocks
    .filter((b) => b.enabled)
    .sort((a, b) => a.order - b.order);

  const showAutoplayGate =
    theme.musicUrl &&
    theme.musicAutoplay &&
    !audioUnlocked;

  return (
    <div className={`creator-page creator-page--${store.handle}`}>
      <ThemeInjector theme={theme} handle={store.handle} />

      {showAutoplayGate && (
        <AutoplayGate
          onUnlock={handleAudioUnlock}
          trackTitle={theme.musicTrackTitle}
          artistName={theme.musicArtist}
        />
      )}

      {theme.musicUrl && (audioUnlocked || !theme.musicAutoplay) && (
        <MusicPlayer theme={theme} />
      )}

      <main className="creator-page__content">
        {enabledBlocks.map((block) => {
          const Block = BLOCK_MAP[block.id];
          return Block ? <Block key={block.id} /> : null;
        })}
      </main>
    </div>
  );
}
