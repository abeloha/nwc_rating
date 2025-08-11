import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin } from '@/types';
import { authLogin, deleteAdmin, getAdmin, saveAdmin } from '@/utils/storage-helpers';

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
    const adminData = getAdmin();
    console.log("Admin data:", adminData);
    if (adminData) {
      setAdmin(adminData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const adminData = await authLogin(email, password);
    if (adminData) {
      saveAdmin(adminData);
      setAdmin(adminData);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    deleteAdmin();
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