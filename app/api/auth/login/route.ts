import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const user = await storage.getAdminUserByUsername(username);
    
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    const { password: _, ...sanitizedUser } = user;
    return NextResponse.json({ ...sanitizedUser, token });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

