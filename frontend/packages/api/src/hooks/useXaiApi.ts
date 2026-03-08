import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE = typeof window !== 'undefined' ? '' : '';

interface XProfile {
  handle: string;
  displayName: string;
  bio: string;
  followers: number;
  following: number;
  verified: boolean;
  joinedDate: string;
  location: string | null;
  website: string | null;
  avatarDescription: string | null;
  bannerDescription: string | null;
  error?: string;
}

interface XPost {
  text: string;
  date: string;
  likes: number;
  retweets: number;
  replies: number;
  isRetweet: boolean;
}

interface GeneratedStoreContent {
  tagline: string;
  bio: string;
  productSuggestions: string[];
  brandKeywords: string[];
  audienceDescription: string;
}

/**
 * Fetch live X profile data via Grok.
 */
export function useXProfile(handle: string | undefined) {
  return useQuery<XProfile>({
    queryKey: ['x-profile', handle],
    queryFn: async () => {
      const res = await fetch(`/api/x/profile/${handle}`);
      if (!res.ok) throw new Error('Failed to fetch X profile');
      return res.json();
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch recent X posts from a creator via Grok.
 */
export function useXPosts(handle: string | undefined, count = 10) {
  return useQuery<XPost[]>({
    queryKey: ['x-posts', handle, count],
    queryFn: async () => {
      const res = await fetch(`/api/x/posts/${handle}?count=${count}`);
      if (!res.ok) throw new Error('Failed to fetch X posts');
      const data = await res.json();
      return data.posts;
    },
    enabled: !!handle,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Generate AI store content (tagline, bio, product ideas) from X persona.
 */
export function useGenerateStoreContent(handle: string | undefined) {
  return useQuery<GeneratedStoreContent>({
    queryKey: ['x-generate-store', handle],
    queryFn: async () => {
      const res = await fetch(`/api/x/generate/store-content/${handle}`);
      if (!res.ok) throw new Error('Failed to generate store content');
      return res.json();
    },
    enabled: false, // Only fetch on demand
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Generate AI product description from creator persona.
 */
export function useGenerateProductDescription() {
  return useMutation<string, Error, { handle: string; productTitle: string; productType: string }>({
    mutationFn: async ({ handle, productTitle, productType }) => {
      const res = await fetch('/api/x/generate/product-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, productTitle, productType }),
      });
      if (!res.ok) throw new Error('Failed to generate description');
      const data = await res.json();
      return data.description;
    },
  });
}
