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
