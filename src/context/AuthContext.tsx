import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      fullName,
      avatarUrl: undefined,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
