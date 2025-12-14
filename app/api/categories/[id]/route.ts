import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertCategorySchema } from '@shared/schema';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await storage.getCategoryById(params.id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
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
    const validatedData = insertCategorySchema.partial().parse(body);
    const category = await storage.updateCategory(params.id, validatedData);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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

    const { id } = params;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid category ID format' }, { status: 400 });
    }

    await storage.deleteCategory(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    
    // Handle specific database constraint errors
    if (error.code === '23503') {
      return NextResponse.json({ 
        error: 'No se puede eliminar la categoría porque tiene productos asociados con pedidos existentes',
        details: 'Esta categoría contiene productos que han sido incluidos en pedidos anteriores. Para eliminar la categoría, primero debe eliminar todos los pedidos relacionados.'
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: 'Error al eliminar la categoría', 
      details: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}




