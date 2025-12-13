import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertSponsorSchema } from '@shared/schema';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const includeDisabled = request.nextUrl.searchParams.get('includeDisabled') === 'true';
    const sponsors = await storage.getSponsors(includeDisabled);
    return NextResponse.json(sponsors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = insertSponsorSchema.parse(body);
    const sponsor = await storage.createSponsor(validatedData);
    return NextResponse.json(sponsor, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 });
  }
}

