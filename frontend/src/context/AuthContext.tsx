'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, UserRole } from '@/types';
import { authService } from '@/services/api.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Redirect away from auth pages if already logged in
          if (pathname === '/login' || pathname === '/register') {
            if (parsedUser.role === UserRole.BORROWER) {
              router.replace('/borrower');
            } else if (parsedUser.role === UserRole.SANCTION) {
              router.replace('/dashboard/sanction');
            } else if (parsedUser.role === UserRole.DISBURSEMENT) {
              router.replace('/dashboard/disbursement');
            } else if (parsedUser.role === UserRole.COLLECTION) {
              router.replace('/dashboard/collection');
            } else {
              router.replace('/dashboard');
            }
          }
        } catch (error) {
          console.error('Auth initialization failed', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [pathname, router]);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    // Role-based redirection
    if (user.role === UserRole.BORROWER) {
      router.push('/borrower');
    } else if (user.role === UserRole.SANCTION) {
      router.push('/dashboard/sanction');
    } else if (user.role === UserRole.DISBURSEMENT) {
      router.push('/dashboard/disbursement');
    } else if (user.role === UserRole.COLLECTION) {
      router.push('/dashboard/collection');
    } else {
      // ADMIN or SALES
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
