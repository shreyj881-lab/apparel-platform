'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import { getProfile, getStoredUser, logout as doLogout, login as doLogin, register as doRegister } from '@/lib/auth';
import { LoginPayload, RegisterPayload } from '@/types';

interface AuthContext {
  user: User | null;
  loading: boolean;
  login: (p: LoginPayload) => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const Ctx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      getProfile()
        .then((u) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); })
        .catch(() => { doLogout(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (p: LoginPayload) => {
    const { user: u } = await doLogin(p);
    setUser(u);
  }, []);

  const register = useCallback(async (p: RegisterPayload) => {
    const { user: u } = await doRegister(p);
    setUser(u);
  }, []);

  const logout = useCallback(() => { setUser(null); doLogout(); }, []);

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
