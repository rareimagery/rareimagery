import { Avatar, VerifiedBadge } from '@rareimagery/ui';
import { useStore } from '../contexts/StoreContext';

export function StoreHeader() {
  const { store } = useStore();

  if (!store) return null;

  return (
    <>
      <div className="xstore__banner">
        {store.bannerUrl ? (
          <img src={store.bannerUrl} alt="" className="xstore__banner-image" loading="eager" />
        ) : (
          <div
            className="xstore__banner-placeholder"
            style={{ backgroundColor: store.brandColor }}
          />
        )}
      </div>

      <div className="xstore__header">
        <div className="xstore__header-identity">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={`${store.handle} logo`} className="xstore__logo" />
          ) : (
            <Avatar src={store.avatarUrl} handle={store.handle} size={96} />
          )}
        </div>
        <div className="xstore__profile">
          <h1 className="xstore__name">
            @{store.handle}
            {store.verified && <VerifiedBadge />}
          </h1>
          {store.tagline && <p className="xstore__tagline">{store.tagline}</p>}
          {store.bio && <p className="xstore__bio">{store.bio}</p>}
          <div className="xstore__meta">
            <span className="xstore__followers">
              {store.followers.toLocaleString()} followers
            </span>
            <a
              href={`https://x.com/${store.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="xstore__x-link"
            >
              View on X
            </a>
          </div>
          {store.about && (
            <div className="xstore__about">
              <h2 className="xstore__about-title">About</h2>
              <p className="xstore__about-text">{store.about}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
