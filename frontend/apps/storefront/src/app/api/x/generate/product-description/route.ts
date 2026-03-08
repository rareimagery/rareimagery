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
