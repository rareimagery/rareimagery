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
