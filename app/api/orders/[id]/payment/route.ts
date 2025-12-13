import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { paymentStatus } = await request.json();
    if (!paymentStatus || !['pending', 'approved', 'rejected'].includes(paymentStatus)) {
      return NextResponse.json({ error: "paymentStatus must be 'pending', 'approved', or 'rejected'" }, { status: 400 });
    }
    
    const order = await storage.updateOrderPaymentStatus(params.id, paymentStatus);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
  }
}

