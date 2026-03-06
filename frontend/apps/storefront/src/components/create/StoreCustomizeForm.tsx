'use client';

import { useState } from 'react';
import type { XProfilePreview, StoreCreateRequest } from '@rareimagery/types';

interface StoreCustomizeFormProps {
  preview: XProfilePreview;
  onSubmit: (data: StoreCreateRequest) => void;
  isSubmitting: boolean;
  error?: string | null;
}

export function StoreCustomizeForm({
  preview,
  onSubmit,
  isSubmitting,
  error,
}: StoreCustomizeFormProps) {
  const [bio, setBio] = useState(preview.bio);
  const [tagline, setTagline] = useState('');
  const [brandColor, setBrandColor] = useState('#000000');
  const [about, setAbout] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      handle: preview.handle,
      bio,
      tagline,
      brandColor,
      about,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          placeholder="Tell visitors about your store..."
        />
      </div>

      <div>
        <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
          Tagline
        </label>
        <input
          id="tagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          maxLength={255}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="A short tagline for your store"
        />
      </div>

      <div>
        <label htmlFor="brandColor" className="block text-sm font-medium text-gray-700 mb-1">
          Brand Color
        </label>
        <div className="flex items-center gap-3">
          <input
            id="brandColor"
            type="color"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer p-1"
          />
          <input
            type="text"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
            maxLength={7}
            className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
          About (optional)
        </label>
        <textarea
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          placeholder="More details about you and what you sell..."
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
              <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Creating your store...
          </span>
        ) : (
          'Create My Store'
        )}
      </button>
    </form>
  );
}
