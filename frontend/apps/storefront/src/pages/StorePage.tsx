import { useParams } from 'react-router-dom';
import { useStoreProfile } from '@rareimagery/api';
import { LoadingSpinner } from '@rareimagery/ui';
import type { CreatorTheme, CreatorStore } from '@rareimagery/types';
import { StoreHeader } from '../components/StoreHeader';
import { ProductGrid } from '../components/ProductGrid';
import { ProductFilters } from '../components/ProductFilters';
import { StoreProvider } from '../contexts/StoreContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CreatorPage } from '../components/creator-page/CreatorPage';

// Dev-only mock data — only used when Drupal backend is unavailable.
const DEV_MOCK_STORE: CreatorStore | null = import.meta.env.DEV
  ? {
      nodeId: 1,
      uuid: 'dev-mock-uuid',
      handle: 'rare',
      bio: 'Premium creator merch for those who stand out.',
      avatarUrl: '',
      bannerUrl: '',
      logoUrl: '',
      about: '',
      followers: 12400,
      verified: true,
      brandColor: '#FF6B00',
      tagline: 'Rare finds. Real culture.',
      commerceStoreId: 1,
      commerceStoreUuid: 'dev-mock-store-uuid',
    }
  : null;

const DEV_MOCK_THEME: CreatorTheme | null = import.meta.env.DEV
  ? {
      uuid: 'dev-theme-uuid',
      bgColor: '#0a0a0a',
      bgImageUrl: null,
      bgRepeat: 'cover',
      bgOverlayColor: '#000000',
      bgOverlayOpacity: 0.4,
      bgAnimation: 'none',
      musicUrl: null,
      musicAutoplay: false,
      musicLoop: true,
      musicVolume: 50,
      musicTrackTitle: 'Chill Vibes',
      musicArtist: 'RareImagery',
      musicPlayerPosition: 'floating',
      fontHeading: 'Bebas Neue',
      fontBody: 'Space Mono',
      fontAccent: 'Permanent Marker',
      fontSizeScale: 1,
      colorPrimary: '#0a0a0a',
      colorSecondary: '#1a1a1a',
      colorText: '#f0f0f0',
      colorLink: '#FF6B00',
      colorLinkHover: '#FF8C33',
      colorAccent: '#FF6B00',
      colorScrollbarThumb: '#FF6B00',
      colorScrollbarTrack: '#1a1a1a',
      layoutBlocks: [
        { id: 'profile-header', enabled: true, order: 0 },
        { id: 'about-me', enabled: true, order: 1 },
        { id: 'top-products', enabled: true, order: 2 },
        { id: 'social-links', enabled: true, order: 3 },
        { id: 'product-grid', enabled: true, order: 4 },
      ],
      aboutMeHtml:
        '<h2>Welcome to the Rare Shop</h2><p>Premium creator merch designed for those who stand out. Custom apparel, accessories, and digital goods crafted with care.</p><p><strong>Every purchase supports independent creators.</strong></p>',
      socialInstagram: 'https://instagram.com/rareimagery',
      socialYoutube: 'https://youtube.com/@rareimagery',
      socialTiktok: null,
      socialFacebook: null,
      socialDiscord: null,
      socialWebsite: 'https://rareimagery.net',
      socialLinks: [],
      themeName: 'Bud Hound Dark',
      themePublished: true,
    }
  : null;

function LegacyStorePage() {
  return (
    <div className="xstore">
      <StoreHeader />
      <div className="xstore__content">
        <aside className="xstore__sidebar">
          <ProductFilters />
        </aside>
        <main className="xstore__products">
          <ProductGrid />
        </main>
      </div>
    </div>
  );
}

export function StorePage() {
  const { handle = '' } = useParams<{ handle: string }>();
  const { data: profileData, isLoading, error } = useStoreProfile(handle);

  // In dev mode, fall back to mock data if the API is unavailable.
  const store = profileData ?? (import.meta.env.DEV && error ? DEV_MOCK_STORE : null);

  if (isLoading) {
    return <LoadingSpinner message="Loading store..." />;
  }

  if (!store) {
    return (
      <div className="xstore">
        <h1>Store not found</h1>
        <p>The store @{handle} does not exist.</p>
      </div>
    );
  }

  // Theme comes from the API response (included in StoreProfileResponse).
  // In dev mode without backend, fall back to mock theme.
  const theme = profileData?.theme ?? (import.meta.env.DEV ? DEV_MOCK_THEME : null);

  return (
    <StoreProvider store={store} handle={handle} isLoading={false}>
      <ThemeProvider initialTheme={theme}>
        {theme ? <CreatorPage /> : <LegacyStorePage />}
      </ThemeProvider>
    </StoreProvider>
  );
}
