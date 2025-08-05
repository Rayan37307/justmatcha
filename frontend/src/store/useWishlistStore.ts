import { create } from 'zustand';
import api from '../utils/axios';

export interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearError: () => void;
}

const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    console.log('Fetching wishlist...');
    set({ loading: true, error: null });
    try {
      const response = await api.get('/wishlist');
      console.log('Wishlist response:', response.data);
      // Update to handle the nested products array in the response
      const items = response.data.data?.products?.map((item: any) => ({
        _id: item._id,
        product: item.product,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })) || [];
      set({ items, loading: false });
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch wishlist',
        loading: false,
        items: []
      });
    }
  },

  addToWishlist: async (productId: string) => {
    console.log('Adding to wishlist:', productId);
    set({ loading: true, error: null });
    try {
      const response = await api.post('/wishlist', { productId });
      console.log('Add to wishlist response:', response.data);
      set((state) => {
        // Ensure state.items is an array before spreading
        const currentItems = Array.isArray(state.items) ? state.items : [];
        const newItems = [...currentItems, response.data.data];
        console.log('New wishlist items after add:', newItems);
        return {
          items: newItems,
          loading: false,
        };
      });
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to add to wishlist',
        loading: false 
      });
      throw error;
    }
  },

  removeFromWishlist: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/wishlist/${productId}`);
      set((state) => ({
        items: state.items.filter(item => item.product._id !== productId),
        loading: false,
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to remove from wishlist',
        loading: false 
      });
      throw error;
    }
  },

  isInWishlist: (productId: string) => {
    const { items } = get();
    // Ensure items is an array before calling .some()
    return Array.isArray(items) && items.some(item => item?.product?._id === productId);
  },

  clearError: () => set({ error: null }),
}));

export default useWishlistStore;
