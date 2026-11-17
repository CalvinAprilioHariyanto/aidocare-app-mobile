import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  clearSession,
  getProfileApi,
  getStoredToken,
  getStoredUser,
  loginApi,
  registerApi,
  saveSession,
} from '../services/authService';
import { LoginPayload, RegisterPayload, User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const storedToken = await getStoredToken();
        const storedUser = await getStoredUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          // Verify with server in background if possible
          getProfileApi(storedToken)
            .then((freshUser) => {
              setUser(freshUser);
              saveSession(storedToken, freshUser);
            })
            .catch(() => {
              // Keep using cached session offline
            });
        }
      } catch (error) {
        console.warn('Error hydrating auth state:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  async function login(email: string, password: string, rememberMe = true) {
    setIsLoading(true);
    try {
      const result = await loginApi({ email, password });
      setToken(result.token);
      setUser(result.user);

      if (rememberMe) {
        await saveSession(result.token, result.user);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }

  async function register(payload: RegisterPayload) {
    setIsLoading(true);
    try {
      const result = await registerApi(payload);
      return { success: true, message: result.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);
    try {
      await clearSession();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
