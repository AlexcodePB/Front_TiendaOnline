'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartStats, AddToCartInput, UpdateCartInput } from '@/types';
import { cartApi } from '@/services/api';
import { useAuth } from './AuthContext';

// Cart state type
interface CartState {
  cart: Cart | null;
  stats: CartStats | null;
  isLoading: boolean;
  error: string | null;
}

// Cart actions
type CartAction = 
  | { type: 'CART_LOADING' }
  | { type: 'CART_SUCCESS'; payload: { cart: Cart; stats: CartStats } }
  | { type: 'CART_ERROR'; payload: string }
  | { type: 'CART_CLEAR' }
  | { type: 'CLEAR_ERROR' };

// Cart context type
interface CartContextType extends CartState {
  fetchCart: () => Promise<void>;
  addToCart: (item: AddToCartInput) => Promise<void>;
  updateCartItem: (item: UpdateCartInput) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkAvailability: () => Promise<{ available: boolean; unavailableItems: any[] }>;
  clearError: () => void;
}

// Initial state
const initialState: CartState = {
  cart: null,
  stats: null,
  isLoading: false,
  error: null,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'CART_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'CART_SUCCESS':
      return {
        ...state,
        cart: action.payload.cart,
        stats: action.payload.stats,
        isLoading: false,
        error: null,
      };
    case 'CART_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CART_CLEAR':
      return {
        ...initialState,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider props
interface CartProviderProps {
  children: ReactNode;
}

// Cart provider component
export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      dispatch({ type: 'CART_CLEAR' });
    }
  }, [isAuthenticated, user]);

  // Fetch cart function
  const fetchCart = async (): Promise<void> => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartApi.get();
      dispatch({ 
        type: 'CART_SUCCESS', 
        payload: { cart: response.cart, stats: response.stats } 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al cargar el carrito';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
    }
  };

  // Add to cart function
  const addToCart = async (item: AddToCartInput): Promise<void> => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartApi.add(item);
      // Primer éxito con la respuesta del endpoint
      dispatch({ 
        type: 'CART_SUCCESS', 
        payload: { cart: response.cart, stats: response.stats } 
      });
      // Refresco para asegurar consistencia con servidor
      const fresh = await cartApi.get();
      dispatch({ type: 'CART_SUCCESS', payload: { cart: fresh.cart, stats: fresh.stats } });
      
      // Show success message (you can implement toast notifications here)
      console.log(response.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al agregar al carrito';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Update cart item function
  const updateCartItem = async (item: UpdateCartInput): Promise<void> => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartApi.update(item);
      dispatch({ 
        type: 'CART_SUCCESS', 
        payload: { cart: response.cart, stats: response.stats } 
      });
      // Refresco tras actualización (cubre casos de eliminación por qty 0)
      const fresh = await cartApi.get();
      dispatch({ type: 'CART_SUCCESS', payload: { cart: fresh.cart, stats: fresh.stats } });
      
      console.log(response.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar el carrito';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Remove from cart function
  const removeFromCart = async (productId: string): Promise<void> => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartApi.remove(productId);
      dispatch({ 
        type: 'CART_SUCCESS', 
        payload: { cart: response.cart, stats: response.stats } 
      });
      const fresh = await cartApi.get();
      dispatch({ type: 'CART_SUCCESS', payload: { cart: fresh.cart, stats: fresh.stats } });
      
      console.log(response.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al eliminar del carrito';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Clear cart function
  const clearCart = async (): Promise<void> => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartApi.clear();
      dispatch({ 
        type: 'CART_SUCCESS', 
        payload: { cart: response.cart, stats: response.stats } 
      });
      const fresh = await cartApi.get();
      dispatch({ type: 'CART_SUCCESS', payload: { cart: fresh.cart, stats: fresh.stats } });
      
      console.log(response.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al vaciar el carrito';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Check availability function
  const checkAvailability = async (): Promise<{ available: boolean; unavailableItems: any[] }> => {
    try {
      const response = await cartApi.checkAvailability();
      return {
        available: response.available,
        unavailableItems: response.unavailableItems
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al verificar disponibilidad';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: CartContextType = {
    ...state,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkAvailability,
    clearError,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}
