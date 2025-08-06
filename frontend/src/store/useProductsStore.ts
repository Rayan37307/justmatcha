import { create } from 'zustand';
import api from '../utils/axios';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product>;
  createProduct: (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt' | '__v'>>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product>;
  clearError: () => void;
}

const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<ProductsResponse>('/products');
      set({ products: response.data.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch products',
        loading: false 
      });
      throw error;
    }
  },

  getProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<ProductResponse>(`/products/${id}`);
      set({ loading: false });
      return response.data.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch product',
        loading: false 
      });
      throw error;
    }
  },

  createProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<ProductResponse>('/products', product);
      set((state) => ({
        products: [...state.products, response.data.data],
        loading: false
      }));
      return response.data.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create product',
        loading: false 
      });
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<ProductResponse>(`/products/${id}`, updates);
      set((state) => ({
        products: state.products.map((p) => 
          p._id === id ? { ...p, ...response.data.data } : p
        ),
        loading: false
      }));
      return response.data.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update product',
        loading: false 
      });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete product',
        loading: false 
      });
      throw error;
    }
  },

  fetchProductById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<ProductResponse>(`/products/${id}`);
      set({ loading: false });
      return response.data.data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch product',
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useProductsStore;
