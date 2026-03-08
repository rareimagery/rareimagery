/**
 * xAI (Grok) API client — UPDATED 2026 for real-time X data
 * Uses /v1/responses + built-in x_search tool (no hallucinations)
 * Server-side only — XAI_API_KEY stays safe on Vercel.
 */

const XAI_BASE_URL = 'https://api.x.ai/v1';

interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ResponsesOutputText {
  type: 'output_text';
  text: string;
}

interface ResponsesOutput {
  role: string;
  content: ResponsesOutputText[];
}

interface GrokResponse {
  id: string;
  object: 'response';
  model: string;
  output: ResponsesOutput[];
}

async function grokChat(messages: GrokMessage[], useXSearch = false): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('XAI_API_KEY not configured');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: Record<string, any> = {
    model: 'grok-4-1-fast-reasoning', // supports x_search tool + fastest reasoning
    input: messages,
    temperature: 0.3,
  };

  if (useXSearch) {
    body.tools = [{ type: 'x_search' }];
    body.tool_choice = 'auto';
  }

  const res = await fetch(`${XAI_BASE_URL}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`xAI API error (${res.status}): ${err}`);
  }

  const data: GrokResponse = await res.json();
  // Extract the final text output (xAI handles tool calls internally)
  return data.output[0]?.content[0]?.text ?? '';
}

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
  error?: string;
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

export async function fetchXProfile(handle: string): Promise<XProfile> {
  const raw = await grokChat([
    {
      role: 'system',
      content: `You have real-time access to X via the x_search tool. Return ONLY valid JSON with current profile data. If not found, return {"error": "not_found"}.`,
    },
    {
      role: 'user',
      content: `Get the current X profile for @${handle}. Return JSON with these exact fields:
{
  "handle": "${handle}",
  "displayName": "...",
  "bio": "...",
  "followers": 12345,
  "following": 678,
  "verified": true/false,
  "joinedDate": "Month Year",
  "location": "City, State" or null,
  "website": "https://..." or null,
  "avatarDescription": "brief description of profile picture",
  "bannerDescription": "brief description of banner"
}`,
    },
  ], true); // ← enable x_search tool

  return JSON.parse(raw);
}

export async function fetchXPosts(handle: string, count = 10): Promise<XPost[]> {
  const raw = await grokChat([
    {
      role: 'system',
      content: `You have real-time X access. Return ONLY a JSON object with "posts" array. Skip plain retweets unless notable.`,
    },
    {
      role: 'user',
      content: `Get the ${count} most recent original posts from @${handle}. Return JSON: {"posts": [array of posts with text, date, likes, retweets, replies, isRetweet]}`,
    },
  ], true);

  const parsed = JSON.parse(raw);
  return parsed.posts ?? [];
}

export async function generateStoreContent(handle: string): Promise<GeneratedStoreContent> {
  const raw = await grokChat([
    {
      role: 'system',
      content: `You are a merchandise branding expert. Analyze the X profile and recent posts of the given user to generate store content for their creator merch store. Be creative but authentic to their brand voice. Return ONLY valid JSON.`,
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
  ], true);

  return JSON.parse(raw);
}

export async function generateProductDescription(
  handle: string,
  productTitle: string,
  productType: string
): Promise<string> {
  const raw = await grokChat([
    {
      role: 'system',
      content: `You write compelling product descriptions for creator merchandise. Match the creator's voice and brand from their X presence. Keep descriptions concise (2-3 sentences). Return ONLY valid JSON.`,
    },
    {
      role: 'user',
      content: `Write a product description for @${handle}'s store.
Product: "${productTitle}"
Type: ${productType}
Return JSON: { "description": "the description text" }`,
    },
  ], true);

  const parsed = JSON.parse(raw);
  return parsed.description;
}
