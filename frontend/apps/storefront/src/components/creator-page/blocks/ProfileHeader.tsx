import { Avatar, VerifiedBadge } from '@rareimagery/ui';
import { useStore } from '../../../contexts/StoreContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { SocialLinks } from '../SocialLinks';

export function ProfileHeader() {
  const { store } = useStore();
  const { theme } = useTheme();

  if (!store) return null;

  return (
    <section className="creator-page__profile-header">
      <div className="creator-page__banner">
        {store.bannerUrl ? (
          <img src={store.bannerUrl} alt="" className="creator-page__banner-image" loading="eager" />
        ) : (
          <div
            className="creator-page__banner-placeholder"
            style={{ backgroundColor: theme?.colorAccent || store.brandColor }}
          />
        )}
      </div>

      <div className="creator-page__header">
        <div className="creator-page__header-identity">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={`${store.handle} logo`} className="creator-page__logo" />
          ) : (
            <Avatar src={store.avatarUrl} handle={store.handle} size={96} />
          )}
        </div>
        <div className="creator-page__profile">
          <h1 className="creator-page__name">
            @{store.handle}
            {store.verified && <VerifiedBadge />}
          </h1>
          {store.tagline && <p className="creator-page__tagline">{store.tagline}</p>}
          {store.bio && <p className="creator-page__bio">{store.bio}</p>}
          <div className="creator-page__meta">
            <span className="creator-page__followers">
              {store.followers.toLocaleString()} followers
            </span>
          </div>
          {theme && <SocialLinks theme={theme} handle={store.handle} />}
        </div>
      </div>
    </section>
  );
}
