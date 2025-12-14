import CategoryGrid from '../CategoryGrid';
import type { Category } from '@shared/schema';

const mockCategories: Category[] = [
  { id: '1', name: 'Bebidas', imageUrl: null, enabled: true, leySeca: false, createdAt: new Date() },
  { id: '2', name: 'Snacks', imageUrl: null, enabled: true, leySeca: false, createdAt: new Date() },
  { id: '3', name: 'Lácteos', imageUrl: null, enabled: true, leySeca: false, createdAt: new Date() },
];

export default function CategoryGridExample() {
  return (
    <CategoryGrid 
      categories={mockCategories}
      onCategorySelect={(id, name) => console.log('Selected category:', id, name)}
    />
  );
}
