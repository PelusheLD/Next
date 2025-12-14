import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const counts = await storage.getProductCountsByCategory();
    return NextResponse.json(counts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product counts' }, { status: 500 });
  }
}




