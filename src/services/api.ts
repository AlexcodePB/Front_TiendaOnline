import axios, { AxiosResponse } from 'axios';
import {
  User,
  Product,
  Cart,
  CartStats,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ProductFilters,
  AddToCartInput,
  UpdateCartInput,
  PaginatedResponse,
  ApiResponse
} from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<{ message: string; user: User }>('/auth/profile');
    return data.user;
  },

  updateProfile: async (userData: Partial<User>): Promise<{ message: string; user: User }> => {
    const { data } = await api.put<{ message: string; user: User }>('/auth/profile', userData);
    return data;
  },
};

// Products API
export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const { data } = await api.get<{ products: Product[]; pagination: any }>(`/products?${params}`);
    return {
      data: data.products,
      pagination: data.pagination
    };
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  getCategories: async (): Promise<{ categories: string[]; total: number }> => {
    const { data } = await api.get<{ categories: string[]; total: number }>('/products/categories');
    return data;
  },

  getByCategory: async (category: string, filters?: Omit<ProductFilters, 'category'>): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const { data } = await api.get<{ category: string; products: Product[]; pagination: any }>(`/products/category/${category}?${params}`);
    return {
      data: data.products,
      pagination: data.pagination
    };
  },

  create: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; product: Product }> => {
    const { data } = await api.post<{ message: string; product: Product }>('/products', productData);
    return data;
  },

  update: async (id: string, productData: Partial<Product>): Promise<{ message: string; product: Product }> => {
    const { data } = await api.put<{ message: string; product: Product }>(`/products/${id}`, productData);
    return data;
  },

  delete: async (id: string): Promise<{ message: string; product: Product }> => {
    const { data } = await api.delete<{ message: string; product: Product }>(`/products/${id}`);
    return data;
  },
};

// Cart API
export const cartApi = {
  get: async (): Promise<{ cart: Cart; stats: CartStats }> => {
    const { data } = await api.get<{ cart: Cart; stats: CartStats }>('/cart');
    return data;
  },

  add: async (item: AddToCartInput): Promise<{ message: string; cart: Cart; stats: CartStats }> => {
    const { data } = await api.post<{ message: string; cart: Cart; stats: CartStats }>('/cart/add', item);
    return data;
  },

  update: async (item: UpdateCartInput): Promise<{ message: string; cart: Cart; stats: CartStats }> => {
    const { data } = await api.put<{ message: string; cart: Cart; stats: CartStats }>('/cart/update', item);
    return data;
  },

  remove: async (productId: string): Promise<{ message: string; cart: Cart; stats: CartStats }> => {
    const { data } = await api.delete<{ message: string; cart: Cart; stats: CartStats }>(`/cart/remove/${productId}`);
    return data;
  },

  clear: async (): Promise<{ message: string; cart: Cart; stats: CartStats }> => {
    const { data } = await api.delete<{ message: string; cart: Cart; stats: CartStats }>('/cart/clear');
    return data;
  },

  checkAvailability: async (): Promise<{
    available: boolean;
    unavailableItems: any[];
    totalItems: number;
  }> => {
    const { data } = await api.get('/cart/check-availability');
    return data;
  },
};

// Users API (for admin)
export const usersApi = {
  getAll: async (filters?: any): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const { data } = await api.get<{ users: User[]; pagination: any }>(`/users?${params}`);
    return {
      data: data.users,
      pagination: data.pagination
    };
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  create: async (userData: RegisterData): Promise<User> => {
    const { data } = await api.post<User>('/users', userData);
    return data;
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, userData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default api;
