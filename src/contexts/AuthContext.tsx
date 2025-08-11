import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin } from '@/types';
import { getAdmin } from '@/utils/storage-helpers';

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth_session');
    if (savedAuth) {
      const adminData = getAdmin();
      if (adminData) {
        setAdmin(adminData);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const adminData = getAdmin();
    if (adminData && adminData.email === email && adminData.password === password) {
      setAdmin(adminData);
      setIsAuthenticated(true);
      localStorage.setItem('auth_session', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_session');
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};