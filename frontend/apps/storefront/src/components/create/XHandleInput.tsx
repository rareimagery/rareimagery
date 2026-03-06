'use client';

import { useState, useCallback } from 'react';

interface XHandleInputProps {
  onSubmit: (handle: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function XHandleInput({ onSubmit, isLoading, error }: XHandleInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const handle = value.trim().replace(/^@/, '');
      if (handle && /^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
        onSubmit(handle);
      }
    },
    [value, onSubmit],
  );

  const isValid = /^@?[a-zA-Z0-9_]{1,15}$/.test(value.trim());

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="x-handle" className="block text-sm font-medium text-gray-700 mb-1">
          X (Twitter) Handle
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-lg">
            @
          </span>
          <input
            id="x-handle"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="username"
            maxLength={15}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            autoComplete="off"
            autoFocus
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Letters, numbers, and underscores only. Max 15 characters.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!value.trim() || !isValid || isLoading}
        className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
              <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Looking up profile...
          </span>
        ) : (
          'Look up profile'
        )}
      </button>
    </form>
  );
}
