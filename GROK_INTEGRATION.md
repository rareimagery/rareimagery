# Grok/xAI Integration for RareImagery.net

## Architecture Decision

RareImagery.net uses a dual-AI architecture:
- **Grok (xAI)** controls the frontend via Vercel — leveraging its native X/Twitter data access
- **Claude** controls the backend (Drupal 11, Commerce, Stripe, Printful) on the VPS

### Why Grok for Frontend?
Grok has real-time access to X/Twitter data — profiles, posts, engagement metrics, trends. Since RareImagery is a platform where X creators launch merch stores, Grok can:
1. Pull live creator profile data (bio, followers, verified status)
2. Surface recent posts/tweets on storefront pages
3. Generate brand-aligned store content (taglines, bios, product ideas)
4. Write product descriptions that match the creator's voice
5. Analyze audience engagement to suggest trending products

### Why Claude for Backend?
Claude handles the complex commerce logic, Drupal module development, API design, payment flows (Stripe Connect), and server infrastructure. These don't need X data access.

---

## Stack

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS (deployed to Vercel)
- **Backend**: Drupal 11 + Commerce 3.3.3 + PostgreSQL 16 (deployed to VPS)
- **xAI API**: Grok-3 model via `https://api.x.ai/v1/chat/completions`
- **Monorepo**: pnpm workspaces at `frontend/`

---

## Integration Flow

```
[Browser] → [Next.js API Routes on Vercel] → [xAI/Grok API] → [Live X Data]
                                            → [Drupal API on VPS] → [Commerce Data]
```

The xAI API key stays server-side in Next.js API routes — never exposed to the browser.

---

## Files Created

### 1. Core xAI Client — `frontend/apps/storefront/src/lib/xai.ts`

Server-side only module that communicates with the xAI API.

```typescript
/**
 * xAI (Grok) API client for X/Twitter data enrichment.
 * Server-side only — keeps API key secure.
 */

const XAI_BASE_URL = 'https://api.x.ai/v1';

interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GrokResponse {
  choices: { message: { content: string } }[];
}

async function grokChat(messages: GrokMessage[], jsonMode = true): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('XAI_API_KEY not configured');

  const res = await fetch(`${XAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages,
      ...(jsonMode && { response_format: { type: 'json_object' } }),
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`xAI API error (${res.status}): ${err}`);
  }

  const data: GrokResponse = await res.json();
  return data.choices[0].message.content;
}
```

#### Exported Functions

**`fetchXProfile(handle: string): Promise<XProfile>`**
Fetches live X profile data — display name, bio, followers, verified status, location, website.

```typescript
export async function fetchXProfile(handle: string): Promise<XProfile> {
  const raw = await grokChat([
    {
      role: 'system',
      content: `You have access to real-time X (Twitter) data. Return accurate, current profile information as JSON. If you cannot find the profile, return {"error": "not_found"}.`,
    },
    {
      role: 'user',
      content: `Get the current X profile for @${handle}. Return JSON with these exact fields:
{
  "handle": "their_handle",
  "displayName": "Their Display Name",
  "bio": "their bio text",
  "followers": 12345,
  "following": 678,
  "verified": true/false,
  "joinedDate": "Month Year",
  "location": "City, State" or null,
  "website": "https://..." or null,
  "avatarDescription": "brief description of their profile picture" or null,
  "bannerDescription": "brief description of their banner image" or null
}`,
    },
  ]);

  return JSON.parse(raw);
}
```

**`fetchXPosts(handle: string, count?: number): Promise<XPost[]>`**
Fetches recent posts/tweets from a creator.

```typescript
export async function fetchXPosts(handle: string, count = 10): Promise<XPost[]> {
  const raw = await grokChat([
    {
      role: 'system',
      content: `You have access to real-time X (Twitter) data. Return recent posts as a JSON array. Only include original posts and quote tweets, skip plain retweets unless notable.`,
    },
    {
      role: 'user',
      content: `Get the ${count} most recent posts from @${handle} on X. Return a JSON object with a "posts" array, each with:
{
  "posts": [
    {
      "text": "post content",
      "date": "YYYY-MM-DD",
      "likes": 123,
      "retweets": 45,
      "replies": 12,
      "isRetweet": false
    }
  ]
}`,
    },
  ]);

  const parsed = JSON.parse(raw);
  return parsed.posts ?? [];
}
```

**`generateStoreContent(handle: string): Promise<GeneratedStoreContent>`**
Analyzes a creator's X presence and generates merch store content.

```typescript
export async function generateStoreContent(handle: string): Promise<GeneratedStoreContent> {
  const raw = await grokChat([
    {
      role: 'system',
      content: `You are a merchandise branding expert. Analyze the X profile and recent posts of the given user to generate store content for their creator merch store. Be creative but authentic to their brand voice.`,
    },
    {
      role: 'user',
      content: `Analyze @${handle}'s X profile, posts, and audience. Generate merch store content as JSON:
{
  "tagline": "A catchy store tagline (max 60 chars)",
  "bio": "A compelling store bio (2-3 sentences) that captures their brand",
  "productSuggestions": ["5 specific product ideas tailored to their audience"],
  "brandKeywords": ["5-8 keywords that define their brand"],
  "audienceDescription": "One sentence describing their target audience"
}`,
    },
  ]);

  return JSON.parse(raw);
}
```

**`generateProductDescription(handle, productTitle, productType): Promise<string>`**
Generates a product description that matches the creator's voice.

```typescript
export async function generateProductDescription(
  handle: string,
  productTitle: string,
  productType: string
): Promise<string> {
  const raw = await grokChat(
    [
      {
        role: 'system',
        content: `You write compelling product descriptions for creator merchandise. Match the creator's voice and brand from their X presence. Keep descriptions concise (2-3 sentences).`,
      },
      {
        role: 'user',
        content: `Write a product description for @${handle}'s store.
Product: "${productTitle}"
Type: ${productType}
Return JSON: { "description": "the description text" }`,
      },
    ],
  );

  const parsed = JSON.parse(raw);
  return parsed.description;
}
```

#### TypeScript Interfaces

```typescript
export interface XProfile {
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
}

export interface XPost {
  text: string;
  date: string;
  likes: number;
  retweets: number;
  replies: number;
  isRetweet: boolean;
}

export interface GeneratedStoreContent {
  tagline: string;
  bio: string;
  productSuggestions: string[];
  brandKeywords: string[];
  audienceDescription: string;
}
```

---

### 2. Next.js API Routes

All routes are server-side only — the `XAI_API_KEY` never reaches the browser.

#### `GET /api/x/profile/[handle]` — Live X Profile

File: `frontend/apps/storefront/src/app/api/x/profile/[handle]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchXProfile } from '@/lib/xai';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  if (!/^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: 'Invalid handle' }, { status: 400 });
  }

  try {
    const profile = await fetchXProfile(handle);
    return NextResponse.json(profile, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('xAI profile fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 502 });
  }
}
```

#### `GET /api/x/posts/[handle]` — Recent Posts

File: `frontend/apps/storefront/src/app/api/x/posts/[handle]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchXPosts } from '@/lib/xai';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const count = Number(req.nextUrl.searchParams.get('count') ?? '10');

  if (!/^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: 'Invalid handle' }, { status: 400 });
  }

  try {
    const posts = await fetchXPosts(handle, Math.min(count, 25));
    return NextResponse.json({ posts }, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('xAI posts fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 502 });
  }
}
```

#### `GET /api/x/generate/store-content/[handle]` — AI Store Content

File: `frontend/apps/storefront/src/app/api/x/generate/store-content/[handle]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateStoreContent } from '@/lib/xai';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  if (!/^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: 'Invalid handle' }, { status: 400 });
  }

  try {
    const content = await generateStoreContent(handle);
    return NextResponse.json(content);
  } catch (err) {
    console.error('xAI generate error:', err);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 502 });
  }
}
```

#### `POST /api/x/generate/product-description` — AI Product Description

File: `frontend/apps/storefront/src/app/api/x/generate/product-description/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateProductDescription } from '@/lib/xai';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { handle, productTitle, productType } = body;

  if (!handle || !productTitle || !productType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const description = await generateProductDescription(handle, productTitle, productType);
    return NextResponse.json({ description });
  } catch (err) {
    console.error('xAI product description error:', err);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 502 });
  }
}
```

---

### 3. React Query Hooks — `frontend/packages/api/src/hooks/useXaiApi.ts`

Client-side hooks that call the API routes. Used by React components.

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

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
    enabled: false, // Only fetch on demand via refetch()
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
```

### 4. Export from API Package — `frontend/packages/api/src/index.ts`

Added this line to make hooks available throughout the monorepo:

```typescript
export { useXProfile, useXPosts, useGenerateStoreContent, useGenerateProductDescription } from './hooks/useXaiApi';
```

---

## Usage Examples

### In a Store Page Component

```tsx
import { useXProfile, useXPosts } from '@rareimagery/api';

function CreatorFeed({ handle }: { handle: string }) {
  const { data: profile } = useXProfile(handle);
  const { data: posts } = useXPosts(handle, 5);

  return (
    <div>
      <h2>{profile?.displayName} — @{profile?.handle}</h2>
      <p>{profile?.bio}</p>
      <p>{profile?.followers.toLocaleString()} followers</p>

      <h3>Recent Posts</h3>
      {posts?.map((post, i) => (
        <div key={i}>
          <p>{post.text}</p>
          <span>{post.likes} likes · {post.retweets} reposts</span>
        </div>
      ))}
    </div>
  );
}
```

### In the Store Creation Wizard

```tsx
import { useGenerateStoreContent } from '@rareimagery/api';

function StoreSetup({ handle }: { handle: string }) {
  const { data: generated, refetch } = useGenerateStoreContent(handle);

  return (
    <div>
      <button onClick={() => refetch()}>Generate Store Content with AI</button>
      {generated && (
        <>
          <p>Tagline: {generated.tagline}</p>
          <p>Bio: {generated.bio}</p>
          <p>Product Ideas: {generated.productSuggestions.join(', ')}</p>
        </>
      )}
    </div>
  );
}
```

### For Product Descriptions

```tsx
import { useGenerateProductDescription } from '@rareimagery/api';

function ProductForm({ handle }: { handle: string }) {
  const { mutate: generate, data: description } = useGenerateProductDescription();

  return (
    <button onClick={() => generate({
      handle,
      productTitle: 'Classic Logo Tee',
      productType: 'physical_pod'
    })}>
      AI Generate Description
    </button>
  );
}
```

---

## Environment Variables Required

| Variable | Where | Value |
|----------|-------|-------|
| `XAI_API_KEY` | `.env` + Vercel | Your xAI API key from console.x.ai |
| `DRUPAL_BASE_URL` | `.env` + Vercel | `http://srv1450030.hstgr.cloud` |
| `NEXT_PUBLIC_DRUPAL_BASE_URL` | `.env` + Vercel | `https://api.rareimagery.net` |

---

## Vercel Deployment Setup

1. **Root Directory**: Set to `frontend/apps/storefront` in Vercel dashboard
2. **Framework Preset**: `Next.js` (auto-detected)
3. **Install Command**: `cd ../.. && npx -y pnpm@9 install --frozen-lockfile` (from `vercel.json`)
4. **Build Command**: Default `next build`
5. **Node Version**: 22.x

### `frontend/apps/storefront/vercel.json`

```json
{
  "installCommand": "cd ../.. && npx -y pnpm@9 install --frozen-lockfile",
  "framework": "nextjs",
  "nodeVersion": "22.x"
}
```

---

## API Endpoints Summary

| Method | Endpoint | Purpose | Cache |
|--------|----------|---------|-------|
| GET | `/api/x/profile/{handle}` | Live X profile data | 5 min |
| GET | `/api/x/posts/{handle}?count=N` | Recent posts (max 25) | 2 min |
| GET | `/api/x/generate/store-content/{handle}` | AI tagline, bio, product ideas | None |
| POST | `/api/x/generate/product-description` | AI product description | None |

---

## File Tree

```
frontend/
├── apps/storefront/src/
│   ├── lib/
│   │   ├── drupal.ts          (Drupal server client — Claude/backend)
│   │   └── xai.ts             (xAI/Grok client — X data/frontend)
│   └── app/api/x/
│       ├── profile/[handle]/route.ts
│       ├── posts/[handle]/route.ts
│       └── generate/
│           ├── store-content/[handle]/route.ts
│           └── product-description/route.ts
└── packages/api/src/
    ├── hooks/useXaiApi.ts     (React Query hooks for xAI endpoints)
    └── index.ts               (exports all hooks)
```

---

## Future Enhancements

- **Trending topics**: Use Grok to identify trending topics in a creator's niche for product timing
- **Audience analytics**: Analyze follower demographics and engagement patterns
- **Auto-pricing**: Suggest product prices based on creator's audience size and engagement
- **Content calendar**: Generate merch drop schedules aligned with creator's posting patterns
- **X post embeds**: Embed actual tweets on store pages using X embed API alongside Grok data
