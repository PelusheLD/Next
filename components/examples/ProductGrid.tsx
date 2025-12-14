import ProductGrid from '../ProductGrid';
import type { Product } from '@shared/schema';

const mockProducts: Product[] = [
  { id: '1', name: 'Coca Cola 2L', price: '3.50', categoryId: '1', imageUrl: null, measurementType: 'unit', externalCode: null, stock: '10', featured: false, createdAt: new Date() },
  { id: '2', name: 'Pepsi 2L', price: '3.25', categoryId: '1', imageUrl: null, measurementType: 'unit', externalCode: null, stock: '10', featured: false, createdAt: new Date() },
  { id: '3', name: 'Agua Mineral 1.5L', price: '1.50', categoryId: '1', imageUrl: null, measurementType: 'unit', externalCode: null, stock: '10', featured: false, createdAt: new Date() },
  { id: '4', name: 'Jugo de Naranja 1L', price: '2.75', categoryId: '1', imageUrl: null, measurementType: 'unit', externalCode: null, stock: '10', featured: false, createdAt: new Date() },
];

export default function ProductGridExample() {
  return (
    <ProductGrid
      categoryName="Bebidas"
      categoryId="1"
      products={mockProducts}
      onBack={() => console.log('Back clicked')}
      onAddToCart={(product, quantity) => console.log('Added to cart:', product, quantity)}
    />
  );
}
