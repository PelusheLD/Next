import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertAdminUserSchema } from '@shared/schema';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const users = await storage.getAdminUsers();
    const sanitizedUsers = users.map(({ password, ...user }) => user);
    return NextResponse.json(sanitizedUsers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = insertAdminUserSchema.parse(body);
    const newUser = await storage.createAdminUser(validatedData);
    const { password, ...sanitizedUser } = newUser;
    return NextResponse.json(sanitizedUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}




