import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params;
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '100', 10);
    const search = request.nextUrl.searchParams.get('search');
    
    // Si hay búsqueda, usar el endpoint de búsqueda
    if (search && search.trim()) {
      const result = await storage.searchProductsByCategory(categoryId, search.trim(), page, limit);
      return NextResponse.json(result);
    }
    // Si no hay parámetros de paginación, devolver todos los productos (compatibilidad)
    else if (!request.nextUrl.searchParams.get('page') && !request.nextUrl.searchParams.get('limit')) {
      const products = await storage.getProductsByCategory(categoryId);
      return NextResponse.json(products);
    } else {
      const result = await storage.getProductsByCategoryPaginated(categoryId, page, limit);
      return NextResponse.json(result);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

