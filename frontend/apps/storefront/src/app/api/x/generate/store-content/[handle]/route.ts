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
