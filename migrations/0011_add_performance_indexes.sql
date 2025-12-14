-- Índices para mejorar el rendimiento de las consultas

-- Índice para búsqueda de productos por categoría (muy usado)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Índice para búsqueda por nombre de producto (usado en búsquedas)
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Índice compuesto para búsqueda por categoría y nombre (optimiza búsquedas filtradas)
CREATE INDEX IF NOT EXISTS idx_products_category_name ON products(category_id, name);

-- Índice para productos destacados (usado en featured products)
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;

-- Índice para ordenar productos por fecha de creación
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Índice para categorías habilitadas (usado frecuentemente)
CREATE INDEX IF NOT EXISTS idx_categories_enabled ON categories(enabled) WHERE enabled = true;

-- Índice para order items por order_id (usado al cargar pedidos)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);



