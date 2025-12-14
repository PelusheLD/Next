import { 
  type Category, 
  type InsertCategory,
  type Product,
  type InsertProduct,
  type AdminUser,
  type InsertAdminUser,
  type SiteSettings,
  type InsertSiteSettings,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Sponsor,
  type InsertSponsor,
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  // Featured products
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getProductsByCategoryPaginated(categoryId: string, page: number, limit: number): Promise<{ products: Product[]; total: number; hasMore: boolean }>;
  searchProductsByCategory(categoryId: string, searchTerm: string, page: number, limit: number): Promise<{ products: Product[]; total: number; hasMore: boolean }>;
  getProductCountsByCategory(): Promise<Record<string, number>>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;

  // Excel Import
  importProductsFromExcel(filePath: string, sessionId?: string): Promise<{ imported: number; errors: string[] }>;

  // Admin Users
  getAdminUsers(): Promise<AdminUser[]>;
  getAdminUserById(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;
  deleteAdminUser(id: string): Promise<void>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrderPaymentStatus(id: string, paymentStatus: string): Promise<Order | undefined>;
  
  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Sponsors
  getSponsors(includeDisabled?: boolean): Promise<Sponsor[]>;
  getSponsorById(id: string): Promise<Sponsor | undefined>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
  updateSponsor(id: string, sponsor: Partial<InsertSponsor>): Promise<Sponsor | undefined>;
  deleteSponsor(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private adminUsers: Map<string, AdminUser> = new Map();
  private siteSettings: SiteSettings | undefined;
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults() {
    const defaultAdminId = crypto.randomUUID();
    this.adminUsers.set(defaultAdminId, {
      id: defaultAdminId,
      username: 'admin',
      email: 'admin@fvbodegones.com',
      password: 'admin123',
      role: 'superadmin',
      createdAt: new Date(),
    });

    this.siteSettings = {
      id: crypto.randomUUID(),
      siteName: 'FV BODEGONES',
      siteDescription: 'Tu bodega de confianza para productos de consumo diario',
      heroTitle: null,
      contactPhone: '+1 (555) 123-4567',
      contactEmail: 'contacto@fvbodegones.com',
      contactAddress: 'Calle Principal #123, Ciudad',
      whatsappNumber: null,
      facebookUrl: null,
      instagramUrl: null,
      instagramAccessToken: null,
      twitterUrl: null,
      taxPercentage: '16.00',
      enableCarousel1: true,
      enableCarousel2: true,
      enableCarousel3: true,
      carouselTitle1: null,
      carouselSubtitle1: null,
      carouselDescription1: null,
      carouselImage1: null,
      carouselBackground1: null,
      carouselButton1: null,
      carouselUrl1: null,
      carouselTitle2: null,
      carouselSubtitle2: null,
      carouselDescription2: null,
      carouselImage2: null,
      carouselBackground2: null,
      carouselButton2: null,
      carouselUrl2: null,
      carouselTitle3: null,
      carouselSubtitle3: null,
      carouselDescription3: null,
      carouselImage3: null,
      carouselBackground3: null,
      carouselButton3: null,
      carouselUrl3: null,
      latitude: '9.552533674221890',
      longitude: '-69.205197603437410',
      paymentBank: null,
      paymentCI: null,
      paymentPhone: null,
      paymentInstructions: null,
      updatedAt: new Date(),
    };
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: category.name,
      imageUrl: category.imageUrl ?? null,
      enabled: category.enabled ?? true,
      leySeca: category.leySeca ?? false,
      createdAt: new Date(),
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories.delete(id);
    Array.from(this.products.values())
      .filter(p => p.categoryId === id)
      .forEach(p => this.products.delete(p.id));
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId);
  }

  async getProductsByCategoryPaginated(categoryId: string, page: number, limit: number): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    const allProducts = Array.from(this.products.values()).filter(p => p.categoryId === categoryId);
    const total = allProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = allProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < total;
    
    return { products, total, hasMore };
  }

  async searchProductsByCategory(categoryId: string, searchTerm: string, page: number, limit: number): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    const allProducts = Array.from(this.products.values()).filter(p => p.categoryId === categoryId);
    
    // Dividir el término de búsqueda en palabras individuales
    const searchWords = searchTerm.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (searchWords.length === 0) {
      // Si no hay palabras de búsqueda, devolver productos paginados normales
      return this.getProductsByCategoryPaginated(categoryId, page, limit);
    }
    
    // Filtrar productos que contengan TODAS las palabras (sin importar el orden)
    const searchWordsLower = searchWords.map(word => word.toLowerCase());
    const filteredProducts = allProducts.filter(p => {
      const productNameLower = p.name.toLowerCase();
      // Todas las palabras deben estar presentes en el nombre del producto
      return searchWordsLower.every(word => productNameLower.includes(word));
    });
    
    // Ordenar alfabéticamente
    filteredProducts.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    
    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = filteredProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < total;
    
    return { products, total, hasMore };
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId,
      imageUrl: product.imageUrl ?? null,
      measurementType: product.measurementType,
      externalCode: product.externalCode ?? null,
      stock: product.stock ? product.stock.toString() : null,
      featured: product.featured ?? false,
      createdAt: new Date(),
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated: Product = { 
      ...existing, 
      ...(product.name !== undefined && { name: product.name }),
      ...(product.price !== undefined && { price: product.price.toString() }),
      ...(product.categoryId !== undefined && { categoryId: product.categoryId }),
      ...(product.imageUrl !== undefined && { imageUrl: product.imageUrl ?? null }),
      ...(product.measurementType !== undefined && { measurementType: product.measurementType }),
      ...(product.externalCode !== undefined && { externalCode: product.externalCode ?? null }),
      ...(product.stock !== undefined && { stock: product.stock ? product.stock.toString() : null }),
      ...(product.featured !== undefined && { featured: product.featured }),
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id);
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return Array.from(this.adminUsers.values());
  }

  async getAdminUserById(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(u => u.username === username);
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const newUser: AdminUser = {
      id: crypto.randomUUID(),
      ...user,
      createdAt: new Date(),
    };
    this.adminUsers.set(newUser.id, newUser);
    return newUser;
  }

  async updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const existing = this.adminUsers.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...user };
    this.adminUsers.set(id, updated);
    return updated;
  }

  async deleteAdminUser(id: string): Promise<void> {
    this.adminUsers.delete(id);
  }

  async getSiteSettings(): Promise<SiteSettings | undefined> {
    return this.siteSettings;
  }

  async updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    const existing = this.siteSettings;
    const updated: SiteSettings = {
      id: existing?.id || crypto.randomUUID(),
      siteName: settings.siteName ?? existing?.siteName ?? 'FV BODEGONES',
      siteDescription: settings.siteDescription ?? existing?.siteDescription ?? '',
      heroTitle: settings.heroTitle ?? existing?.heroTitle ?? null,
      contactPhone: settings.contactPhone ?? existing?.contactPhone ?? '',
      contactEmail: settings.contactEmail ?? existing?.contactEmail ?? '',
      contactAddress: settings.contactAddress ?? existing?.contactAddress ?? '',
      whatsappNumber: settings.whatsappNumber ?? existing?.whatsappNumber ?? null,
      facebookUrl: settings.facebookUrl ?? existing?.facebookUrl ?? null,
      instagramUrl: settings.instagramUrl ?? existing?.instagramUrl ?? null,
      instagramAccessToken: settings.instagramAccessToken ?? existing?.instagramAccessToken ?? null,
      twitterUrl: settings.twitterUrl ?? existing?.twitterUrl ?? null,
      taxPercentage: settings.taxPercentage ?? existing?.taxPercentage ?? '16.00',
      enableCarousel1: settings.enableCarousel1 ?? existing?.enableCarousel1 ?? true,
      enableCarousel2: settings.enableCarousel2 ?? existing?.enableCarousel2 ?? true,
      enableCarousel3: settings.enableCarousel3 ?? existing?.enableCarousel3 ?? true,
      carouselTitle1: settings.carouselTitle1 ?? existing?.carouselTitle1 ?? null,
      carouselSubtitle1: settings.carouselSubtitle1 ?? existing?.carouselSubtitle1 ?? null,
      carouselDescription1: settings.carouselDescription1 ?? existing?.carouselDescription1 ?? null,
      carouselImage1: settings.carouselImage1 ?? existing?.carouselImage1 ?? null,
      carouselBackground1: settings.carouselBackground1 ?? existing?.carouselBackground1 ?? null,
      carouselButton1: settings.carouselButton1 ?? existing?.carouselButton1 ?? null,
      carouselUrl1: settings.carouselUrl1 ?? existing?.carouselUrl1 ?? null,
      carouselTitle2: settings.carouselTitle2 ?? existing?.carouselTitle2 ?? null,
      carouselSubtitle2: settings.carouselSubtitle2 ?? existing?.carouselSubtitle2 ?? null,
      carouselDescription2: settings.carouselDescription2 ?? existing?.carouselDescription2 ?? null,
      carouselImage2: settings.carouselImage2 ?? existing?.carouselImage2 ?? null,
      carouselBackground2: settings.carouselBackground2 ?? existing?.carouselBackground2 ?? null,
      carouselButton2: settings.carouselButton2 ?? existing?.carouselButton2 ?? null,
      carouselUrl2: settings.carouselUrl2 ?? existing?.carouselUrl2 ?? null,
      carouselTitle3: settings.carouselTitle3 ?? existing?.carouselTitle3 ?? null,
      carouselSubtitle3: settings.carouselSubtitle3 ?? existing?.carouselSubtitle3 ?? null,
      carouselDescription3: settings.carouselDescription3 ?? existing?.carouselDescription3 ?? null,
      carouselImage3: settings.carouselImage3 ?? existing?.carouselImage3 ?? null,
      carouselBackground3: settings.carouselBackground3 ?? existing?.carouselBackground3 ?? null,
      carouselButton3: settings.carouselButton3 ?? existing?.carouselButton3 ?? null,
      carouselUrl3: settings.carouselUrl3 ?? existing?.carouselUrl3 ?? null,
      latitude: settings.latitude ?? existing?.latitude ?? '9.552533674221890',
      longitude: settings.longitude ?? existing?.longitude ?? '-69.205197603437410',
      paymentBank: settings.paymentBank ?? existing?.paymentBank ?? null,
      paymentCI: settings.paymentCI ?? existing?.paymentCI ?? null,
      paymentPhone: settings.paymentPhone ?? existing?.paymentPhone ?? null,
      paymentInstructions: settings.paymentInstructions ?? existing?.paymentInstructions ?? null,
      updatedAt: new Date(),
    };
    this.siteSettings = updated;
    return updated;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      ...order,
      customerEmail: order.customerEmail ?? null,
      customerAddress: order.customerAddress ?? null,
      notes: order.notes ?? null,
      total: order.total.toString(),
      totalInBolivares: order.totalInBolivares ? order.totalInBolivares.toString() : null,
      paymentBank: order.paymentBank ?? null,
      paymentCI: order.paymentCI ?? null,
      paymentPhone: order.paymentPhone ?? null,
      paymentStatus: order.paymentStatus ?? 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const existing = this.orders.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      status,
      updatedAt: new Date(),
    };
    this.orders.set(id, updated);
    return updated;
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: string): Promise<Order | undefined> {
    const existing = this.orders.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      paymentStatus,
      updatedAt: new Date(),
    };
    this.orders.set(id, updated);
    return updated;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const newItem: OrderItem = {
      id: crypto.randomUUID(),
      ...item,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      subtotal: item.subtotal.toString(),
    };
    this.orderItems.set(newItem.id, newItem);
    return newItem;
  }

  async importProductsFromExcel(filePath: string, sessionId?: string): Promise<{ imported: number; errors: string[] }> {
    // Implementación básica para desarrollo sin DB
    return { imported: 0, errors: ['Excel import not available in memory storage'] };
  }

  // Featured products
  async getFeaturedProducts(limit: number = 12): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => p.featured)
      .slice(0, limit);
  }

  async getProductCountsByCategory(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    Array.from(this.products.values()).forEach(product => {
      counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
    });
    return counts;
  }

  // Sponsors
  private sponsors: Map<string, Sponsor> = new Map();

  async getSponsors(includeDisabled: boolean = false): Promise<Sponsor[]> {
    const allSponsors = Array.from(this.sponsors.values());
    const filtered = includeDisabled 
      ? allSponsors 
      : allSponsors.filter(s => s.enabled);
    return filtered.sort((a, b) => a.order - b.order);
  }

  async getSponsorById(id: string): Promise<Sponsor | undefined> {
    return this.sponsors.get(id);
  }

  async createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    const newSponsor: Sponsor = {
      id: crypto.randomUUID(),
      ...sponsor,
      logoUrl: sponsor.logoUrl ?? null,
      websiteUrl: sponsor.websiteUrl ?? null,
      enabled: sponsor.enabled ?? true,
      order: sponsor.order ?? 0,
      createdAt: new Date(),
    };
    this.sponsors.set(newSponsor.id, newSponsor);
    return newSponsor;
  }

  async updateSponsor(id: string, sponsor: Partial<InsertSponsor>): Promise<Sponsor | undefined> {
    const existing = this.sponsors.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...sponsor };
    this.sponsors.set(id, updated);
    return updated;
  }

  async deleteSponsor(id: string): Promise<void> {
    this.sponsors.delete(id);
  }
}

// Singleton para PostgresStorage para evitar crear múltiples instancias
let postgresStorageInstance: any = null;

// Conditionally initialize storage without importing Postgres code
// unless DATABASE_URL is present. This allows dev mode without a DB.
export const storage: IStorage = (() => {
  if (process.env.DATABASE_URL) {
    // Dynamic import at runtime to avoid evaluating db.ts when not needed
    const modPromise = import('@/lib/storage-pg');
    // Create a lightweight proxy that delays actual instantiation
    // until a method is called (so top-level stays synchronous).
    const handler: ProxyHandler<any> = {
      get: (_target, prop) => {
        return async (...args: any[]) => {
          // Crear instancia singleton solo una vez
          if (!postgresStorageInstance) {
            const mod = await modPromise;
            postgresStorageInstance = new mod.PostgresStorage();
          }
          return (postgresStorageInstance as any)[prop](...args);
        };
      },
    };
    // The proxy type matches IStorage's async methods usage in routes
    // (all methods are awaited).
    return new Proxy({}, handler) as IStorage;
  }
  return new MemStorage();
})();
