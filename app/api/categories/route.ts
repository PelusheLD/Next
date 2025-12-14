import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertCategorySchema } from '@shared/schema';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await storage.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = insertCategorySchema.parse(body);
    const category = await storage.createCategory(validatedData);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}




