import { create } from 'zustand';
import api from '../utils/axios';

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CartResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    user: string;
    products: Array<{
      product: any; // This will be populated by the API
      quantity: number;
    }>;
  };
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<{
    _id: string;
    user: string;
    products: Array<{
      product: any;
      quantity: number;
    }>;
  }>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

const useCartStore = create<CartState>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<CartResponse>('/cart');
      // If cart exists and has products
      if (response.data.data?.products) {
        const cartItems = response.data.data.products.map(item => ({
          product: {
            _id: item.product?._id,
            name: item.product?.name || 'Unknown Product',
            price: item.product?.price || 0,
            image: item.product?.image || '/placeholder-product.jpg',
          },
          quantity: item.quantity || 0,
        }));
        set({ items: cartItems, loading: false });
      } else {
        // If cart is empty
        set({ items: [], loading: false });
      }
    } catch (error: any) {
      // If cart doesn't exist, set empty cart instead of showing error
      if (error.response?.status === 404) {
        set({ items: [], loading: false, error: null });
      } else {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch cart',
          loading: false,
        });
      }
      console.error('Error fetching cart:', error);
    }
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    set(state => ({ ...state, loading: true, error: null }));
    try {
      const response = await api.post<CartResponse>('/cart', { 
        productId,
        quantity 
      });
      
      const cartItems = response.data.data.products.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
        },
        quantity: item.quantity,
      }));
      
      set({ 
        items: cartItems, 
        loading: false,
        error: null 
      });
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      set({ 
        error: message, 
        loading: false 
      });
      throw error; // Re-throw to handle in the component
    }
  },

  updateCartItem: async (productId: string, quantity: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<CartResponse>('/cart', { productId, quantity });
      
      // Always update cart items from the response to ensure we have the latest data
      if (response.data?.data?.products) {
        const cartItems = response.data.data.products.map(item => {
          // Make sure we have the full product object
          const product = item.product && typeof item.product === 'object' 
            ? item.product 
            : { _id: productId, name: 'Unknown Product', price: 0, image: '/placeholder-product.jpg' };
            
          return {
            product: {
              _id: product._id,
              name: product.name || 'Unknown Product',
              price: product.price || 0,
              image: product.image || '/placeholder-product.jpg',
            },
            quantity: item.quantity || 0,
          };
        });
        
        set({ items: cartItems, loading: false });
      } else {
        // Fallback to optimistic update if response format is unexpected
        set(state => ({
          items: state.items.map(item => 
            item.product._id === productId 
              ? { ...item, quantity } 
              : item
          ).filter(item => item.quantity > 0),
          loading: false
        }));
      }
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update cart';
      set({ 
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  removeFromCart: async (productId: string) => {
    set({ loading: true, error: null });
    
    // Optimistically update the UI first
    set(state => ({
      items: state.items.filter(item => item.product._id !== productId)
    }));

    try {
      await api.delete('/cart/remove', { 
        data: { productId } 
      });
      
      set({ loading: false });
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove from cart';
      
      // If the error is because the cart doesn't exist, just clear the local cart
      if (error.response?.status === 404) {
        set({ items: [], loading: false, error: null });
      } else {
        // Revert the optimistic update on error
        set(state => ({
          ...state,
          error: errorMessage,
          loading: false
        }));
      }
      throw new Error(errorMessage);
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete<CartResponse>('/cart');
      set({ items: [], loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to clear cart',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCartStore;
