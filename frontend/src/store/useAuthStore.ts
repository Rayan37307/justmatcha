import { create } from "zustand";
import api from "../utils/axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}

interface AuthDataResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  fetchUser: () => Promise<User>;
  initializeAuth: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<User>;
}

// Set the auth token for axios if it exists
const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// This will be initialized in the store creation

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  signIn: async (email: string, password: string) => {
    const res = await api.post<AuthDataResponse>("/auth/sign-in", { email, password });
    const { data } = res.data;
    if (data.token) {
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true,
        isAdmin: data.user.role === 'admin',
        loading: false 
      });
      return data.user;
    }
    throw new Error('No token received in sign-in response');
  },

  signUp: async (name: string, email: string, password: string) => {
    const res = await api.post<AuthDataResponse>("/auth/sign-up", { name, email, password });
    const { data } = res.data;
    if (data.token) {
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true,
        isAdmin: data.user.role === 'admin',
        loading: false 
      });
      return data.user;
    }
    throw new Error('No token received in sign-up response');
  },

  logout: () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      isAdmin: false,
      loading: false 
    });
  },

  fetchUser: async () => {
    try {
      const res = await api.get<AuthResponse>("/auth/me");
      const user = res.data.data;
      set({ 
        user, 
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        loading: false 
      });
      return user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }
    
    setAuthToken(token);
    try {
      const response = await api.get<{ data: User }>('/auth/me');
      
      if (response.data?.data) {
        set({ 
          user: response.data.data, 
          token, 
          isAuthenticated: true,
          isAdmin: response.data.data.role === 'admin',
          loading: false 
        });
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      // Only clear auth state if it's an actual auth error
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
          loading: false
        });
      } else {
        set({ loading: false });
      }
    }
  },

  updateProfile: async (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => {
    try {
      set({ loading: true });
      const response = await api.put<AuthResponse>('/auth/update-profile', data);
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        set({ 
          user: updatedUser,
          isAdmin: updatedUser.role === 'admin' 
        });
        return updatedUser;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      set(prev => ({ ...prev, loading: false }));
    }
  }
}));

export default useAuthStore;
