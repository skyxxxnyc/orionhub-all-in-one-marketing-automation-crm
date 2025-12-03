import { create } from 'zustand';
import { User } from '@shared/types';
const MOCK_USER_KEY = 'orionhub_mock_user';
const MOCK_TOKEN_KEY = 'orionhub_mock_token';
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<User>;
  register: (name: string, email: string) => Promise<User>;
  logout: () => void;
  checkAuth: () => void;
}
const getInitialState = () => {
  try {
    const token = localStorage.getItem(MOCK_TOKEN_KEY);
    const userJson = localStorage.getItem(MOCK_USER_KEY);
    const user = userJson ? JSON.parse(userJson) : null;
    return { token, user, isAuthenticated: !!token && !!user };
  } catch (error) {
    return { token: null, user: null, isAuthenticated: false };
  }
};
export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  isLoading: true,
  login: async (email: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = { id: 'user-1', name: 'Demo User', email };
        const token = `mock-token-${Date.now()}`;
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
        localStorage.setItem(MOCK_TOKEN_KEY, token);
        set({ user, token, isAuthenticated: true });
        resolve(user);
      }, 500);
    });
  },
  register: async (name: string, email: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = { id: crypto.randomUUID(), name, email };
        const token = `mock-token-${Date.now()}`;
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
        localStorage.setItem(MOCK_TOKEN_KEY, token);
        set({ user, token, isAuthenticated: true });
        resolve(user);
      }, 500);
    });
  },
  logout: () => {
    localStorage.removeItem(MOCK_USER_KEY);
    localStorage.removeItem(MOCK_TOKEN_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },
  checkAuth: () => {
    const { token, user } = getInitialState();
    set({ token, user, isAuthenticated: !!token && !!user, isLoading: false });
  },
}));
// Call checkAuth on initial load
useAuthStore.getState().checkAuth();