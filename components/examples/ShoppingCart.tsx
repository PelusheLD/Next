import { useState } from 'react';
import ShoppingCart from '../ShoppingCart';
import { Button } from '@/components/ui/button';
import type { Product } from '@shared/schema';

interface CartItem extends Product {
  quantity: number;
}

export default function ShoppingCartExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [items, setItems] = useState<CartItem[]>([
    { id: '1', name: 'Coca Cola 2L', price: '3.50', categoryId: '1', imageUrl: null, measurementType: 'unit', externalCode: null, stock: '10', featured: false, createdAt: new Date(), quantity: 2 },
    { id: '2', name: 'Pan Integral', price: '2.00', categoryId: '1', imageUrl: null, measurementType: 'unit', externalCode: null, stock: '10', featured: false, createdAt: new Date(), quantity: 1 },
  ]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setItems(items.filter((item: CartItem) => item.id !== id));
    } else {
      setItems(items.map((item: CartItem) => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item: CartItem) => item.id !== id));
  };

  return (
    <div className="relative h-screen">
      <Button onClick={() => setIsOpen(true)}>Abrir Carrito</Button>
      <ShoppingCart
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => console.log('Checkout')}
      />
    </div>
  );
}
