import Link from 'next/link';
import { VerifiedBadge } from '@rareimagery/ui';
import type { StoreProfileResponse } from '@rareimagery/api';

interface StoreHeaderProps {
  profile: StoreProfileResponse;
}

export function StoreHeader({ profile }: StoreHeaderProps) {
  return (
    <div style={{ '--brand-color': profile.brandColor || '#1DA1F2' } as React.CSSProperties}>
      {/* Banner */}
      <div className="w-full h-44 md:h-56 overflow-hidden relative bg-gray-100">
        {profile.bannerUrl ? (
          <img
            src={profile.bannerUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: profile.brandColor || '#1a1a2e' }}
          />
        )}
      </div>

      {/* Profile header */}
      <div className="px-4 md:px-6 border-b border-gray-100 bg-white">
        <div className="max-w-site mx-auto flex gap-4 items-start pt-3 pb-5 relative">
          {/* Avatar — overlaps banner */}
          <div className="-mt-14 flex-shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={`@${profile.handle}`}
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-3xl font-bold text-white shadow-sm"
                style={{ backgroundColor: profile.brandColor || '#1DA1F2' }}
              >
                {profile.handle.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-1.5 flex-wrap">
              @{profile.handle}
              {profile.verified && <VerifiedBadge size={20} />}
            </h1>

            {profile.tagline && (
              <p
                className="text-sm font-semibold mt-0.5"
                style={{ color: profile.brandColor || '#1DA1F2' }}
              >
                {profile.tagline}
              </p>
            )}

            {profile.bio && (
              <p className="text-sm text-gray-700 mt-1.5 leading-relaxed max-w-xl">
                {profile.bio}
              </p>
            )}

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
              {profile.followers > 0 && (
                <span>
                  <strong className="text-gray-900 font-semibold">
                    {profile.followers.toLocaleString()}
                  </strong>{' '}
                  followers
                </span>
              )}
              <Link
                href={`https://x.com/${profile.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1DA1F2] hover:underline font-medium"
              >
                View on X ↗
              </Link>
            </div>
          </div>

          {/* Cart button */}
          <Link
            href={`/${profile.handle}/cart`}
            className="mt-3 flex-shrink-0 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
