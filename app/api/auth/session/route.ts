import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const dbUser = await storage.getAdminUserById(user.userId);
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { password, ...sanitizedUser } = dbUser;
    return NextResponse.json(sanitizedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
}




