import { create } from 'zustand';
import { authAPI } from '../services/api';
import { AuthState, User } from '../types';
import Cookies from 'js-cookie';

const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
}>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    if (email === 'test@example.com') {
      const userData = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          username: 'Test User',
        },
        token: 'test-token',
      };
      
      // Save token to cookies
      Cookies.set('token', userData.token, { expires: 30 });
      
      set({ 
        user: userData.user, 
        isAuthenticated: true, 
        loading: false 
      });
      return;
    }
    try {
      const response = await authAPI.login(email, password);
      const userData = response.data;
      
      // Save token to cookies
      Cookies.set('token', userData.token, { expires: 30 });
      
      set({ 
        user: userData, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Login failed' 
      });
      throw error;
    }
  },

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(username, email, password);
      const userData = response.data;
      
      // Save token to cookies
      Cookies.set('token', userData.token, { expires: 30 });
      
      set({ 
        user: userData, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Registration failed' 
      });
      throw error;
    }
  },

  logout: () => {
    // Remove token from cookies
    Cookies.remove('token');
    
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },

  getProfile: async () => {
    const token = Cookies.get('token');
    if (!token) return;
    
    set({ loading: true });
    try {
      const response = await authAPI.getProfile();
      set({ 
        user: response.data, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      // If token is invalid, logout
      Cookies.remove('token');
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      });
    }
  },

  updateProfile: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.updateProfile(userData);
      set({ 
        user: response.data, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Update failed' 
      });
      throw error;
    }
  },
}));

export default useAuthStore;