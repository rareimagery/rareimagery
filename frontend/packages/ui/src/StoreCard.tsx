import { Avatar } from './Avatar';
import { VerifiedBadge } from './VerifiedBadge';

interface StoreSummary {
  handle: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  logoUrl: string;
  followers: number;
  verified: boolean;
  brandColor: string;
  tagline: string;
}

interface StoreCardProps {
  store: StoreSummary;
  onClick?: () => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  return (
    <div className="xstore__store-card" onClick={onClick} role="button" tabIndex={0}>
      <div
        className="xstore__store-card-banner"
        style={{
          backgroundColor: store.brandColor || '#1a1a2e',
          backgroundImage: store.bannerUrl ? `url(${store.bannerUrl})` : undefined,
        }}
      />

      <div className="xstore__store-card-body">
        <div className="xstore__store-card-avatar">
          <Avatar src={store.avatarUrl || store.logoUrl} handle={store.handle} size={64} />
        </div>

        <div className="xstore__store-card-info">
          <h3 className="xstore__store-card-handle">
            @{store.handle}
            {store.verified && <VerifiedBadge size={16} />}
          </h3>

          {store.tagline && (
            <p className="xstore__store-card-tagline">{store.tagline}</p>
          )}

          {store.followers > 0 && (
            <span className="xstore__store-card-followers">
              {store.followers.toLocaleString()} followers
            </span>
          )}
        </div>
      </div>

      <div
        className="xstore__store-card-accent"
        style={{ backgroundColor: store.brandColor || '#666' }}
      />
    </div>
  );
}
