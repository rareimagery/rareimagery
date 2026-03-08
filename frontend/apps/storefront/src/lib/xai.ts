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

/** Live X profile data from Grok */
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

/** A tweet/post from X */
export interface XPost {
  text: string;
  date: string;
  likes: number;
  retweets: number;
  replies: number;
  isRetweet: boolean;
}

/** AI-generated store content */
export interface GeneratedStoreContent {
  tagline: string;
  bio: string;
  productSuggestions: string[];
  brandKeywords: string[];
  audienceDescription: string;
}

/**
 * Fetch live X profile data via Grok's real-time X access.
 */
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

/**
 * Fetch recent posts/tweets from a creator via Grok.
 */
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

/**
 * Generate store content (tagline, bio, product suggestions) based on X persona.
 */
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

/**
 * Generate a product description based on creator brand + product type.
 */
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
