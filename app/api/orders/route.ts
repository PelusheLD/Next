import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertOrderSchema, insertOrderItemSchema } from '@shared/schema';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const orders = await storage.getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { items, ...orderData } = await request.json();
    const validatedOrder = insertOrderSchema.parse(orderData);
    
    const order = await storage.createOrder(validatedOrder);
    
    if (items && Array.isArray(items)) {
      for (const item of items) {
        const validatedItem = insertOrderItemSchema.parse({
          ...item,
          orderId: order.id,
        });
        await storage.createOrderItem(validatedItem);
      }
    }
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

