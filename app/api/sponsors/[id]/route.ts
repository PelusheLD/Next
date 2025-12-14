import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertSponsorSchema } from '@shared/schema';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sponsor = await storage.getSponsorById(params.id);
    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }
    return NextResponse.json(sponsor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sponsor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = insertSponsorSchema.partial().parse(body);
    const sponsor = await storage.updateSponsor(params.id, validatedData);
    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }
    return NextResponse.json(sponsor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await storage.deleteSponsor(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 });
  }
}




