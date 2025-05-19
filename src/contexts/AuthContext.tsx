import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, we'll simulate a login
    // In a real app, you would call an API
    try {
      // Mock validation - in real app, this would be server-side
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Mock registration - in a real app, this would call an API
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        return false;
      }
      
      const newUser = { 
        id: `user-${Date.now()}`, 
        name, 
        email, 
        password,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in users array as well
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return { ...u, ...userData };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};