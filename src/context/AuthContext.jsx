import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ai-fashion-studio-auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.email && data?.name) setUser(data);
      }
    } catch (_) {}
    setReady(true);
  }, []);

  const login = useCallback((email, password) => {
    const raw = localStorage.getItem(STORAGE_KEY + '-users');
    const users = raw ? JSON.parse(raw) : {};
    const stored = users[email];
    if (!stored || stored.password !== password) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    const userData = { name: stored.name, email: stored.email };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return { ok: true };
  }, []);

  const register = useCallback((name, email, password) => {
    const raw = localStorage.getItem(STORAGE_KEY + '-users');
    const users = raw ? JSON.parse(raw) : {};
    if (users[email]) return { ok: false, error: 'An account with this email already exists.' };
    users[email] = { name, email, password };
    localStorage.setItem(STORAGE_KEY + '-users', JSON.stringify(users));
    const userData = { name, email };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = { user, ready, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
