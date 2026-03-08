import { xai } from '@ai-sdk/xai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { drupalUrl, siteName, primaryColor, productsEndpoint } = await req.json();

  const { textStream } = await streamText({
    model: xai('grok-4-1-fast-reasoning'),
    prompt: `You are RareImagery's elite Next.js architect.
Create a COMPLETE production-ready Next.js 15 App Router storefront for a Drupal Commerce backend.

Drupal base: ${drupalUrl}
Site name: ${siteName}
Brand colors: ${primaryColor || '#000000'}
JSON:API products endpoint: ${productsEndpoint || '/jsonapi/commerce_product/product'}

Requirements:
- App Router + Server Components + Server Actions
- Tailwind + shadcn/ui style (clean, premium streetwear vibe)
- Product grid (ISR revalidate 60s)
- Dynamic PDP with variants, add-to-cart
- Cart drawer + checkout flow (Drupal Commerce cart API)
- Responsive, mobile-first, dark mode
- SEO meta, OpenGraph, structured data
- Full TypeScript
- Folder structure ready to copy-paste into a new Vercel project

Output ONLY the complete code files in markdown with clear filenames (app/page.tsx, app/products/[slug]/page.tsx, lib/drupal.ts, etc.).
Make it look and feel like rareimagery.net but branded for ${siteName}.`,
    temperature: 0.7,
  });

  // Stream the generated code back (or save to GitHub via Vercel + GitHub API in prod)
  return new Response(textStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
