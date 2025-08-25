// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface ProductImage {
  url: string;
  public_id: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: ProductImage;
  stock: number;
  category: ProductCategory;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 
  | 'tables' 
  | 'wheels' 
  | 'trucks' 
  | 'bearings' 
  | 'grip-tape' 
  | 'hardware' 
  | 'tools' 
  | 'clothing' 
  | 'accessories';

// Cart types
export interface CartItem {
  productId: Product;
  quantity: number;
  price: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartStats {
  totalItems: number;
  totalAmount: number;
  uniqueProducts: number;
  averageItemPrice: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'client' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  details?: string | string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    itemsPerPage: number;
  };
}

// Filter types for products
export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  stock?: 'available' | 'outOfStock';
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc';
  page?: number;
  limit?: number;
}

// Add to cart input
export interface AddToCartInput {
  productId: string;
  quantity?: number;
}

export interface UpdateCartInput {
  productId: string;
  quantity: number;
}