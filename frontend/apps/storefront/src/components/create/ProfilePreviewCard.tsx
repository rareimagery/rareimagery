'use client';

import { Avatar, VerifiedBadge } from '@rareimagery/ui';

interface ProfilePreviewCardProps {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  followers: number;
  verified: boolean;
  brandColor?: string;
}

export function ProfilePreviewCard({
  handle,
  displayName,
  bio,
  avatarUrl,
  bannerUrl,
  followers,
  verified,
  brandColor = '#1a1a2e',
}: ProfilePreviewCardProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white">
      {/* Banner */}
      <div
        className="h-[120px] bg-cover bg-center"
        style={{
          backgroundColor: brandColor,
          backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
        }}
      />

      {/* Profile info */}
      <div className="px-5 pb-5">
        <div className="-mt-10 mb-3">
          <Avatar src={avatarUrl} handle={handle} size={80} />
        </div>

        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1">
          {displayName || `@${handle}`}
          {verified && <VerifiedBadge size={18} />}
        </h3>

        <p className="text-sm text-gray-500">@{handle}</p>

        {bio && (
          <p className="text-sm text-gray-700 mt-2 line-clamp-3">{bio}</p>
        )}

        {followers > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {followers.toLocaleString()} followers
          </p>
        )}
      </div>
    </div>
  );
}
