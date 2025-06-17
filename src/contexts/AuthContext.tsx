import React, { createContext, useContext, useState, ReactNode } from 'react';
import {useApi} from "@/hooks/useApi.ts";
import { jwtDecode, JwtPayload } from "jwt-decode";

export type UserType = 'customer' | 'store' | 'delivery';

interface items {
  id: number;
  name: string;
  quantity: number;
  price: number;
} // ToDo: Ger items

interface orders {
  id: number;
  date: string;
  status: string;
  items: items[];
  total: number;
} // ToDo: Ger orders

interface User {
  id: number;
  name: string;
  username: string;
  type: UserType;
  document: string;
  token: string;
  email: string;
  favoriteStores: number[]; // ToDo: Definir favoriteStores
  orders?: orders[]; // ToDo: Definir orders
}

interface sales {
    id: number;
    storeId: number;
    total: number;
    date: string;
    orderId: number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    items: items[];
}

interface Store extends User {
  sales: sales[];
  description: string;
  address: string;
  phone: string;
  name: string;
} // ToDo: Definir Store

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  addFavoriteStore: (storeId: number) => void;
  removeFavoriteStore: (storeId: number) => void;
  store?: Store;
}

interface CustomJwtPayload extends JwtPayload {
  nomeUsuario: string;
  role: "USER" | "STORE" | "DELIVERY";
  sub: string;
}

const userMap: Record<CustomJwtPayload['role'], UserType> = {
  "USER": "customer",
  "STORE": "store",
  "DELIVERY": "delivery"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const api = useApi();
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login/', {"nomeUsuario": username, "senha": password});
      const token = response.data.access_token;
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const loggedUser: User = {
        id: parseInt(decoded.sub, 10),
        name: decoded.nomeUsuario,
        username: decoded.nomeUsuario,
        type: userMap[decoded.role],
        document: '',
        email: '',
        token: token,
        favoriteStores: [],
        orders: [],
      };
      setUser(loggedUser);
      return true;
    } catch (error) {
      return false;
    }
  };


  const logout = () => {
    setUser(null);
    window.location.reload();
  };

  const [favoriteStores, setFavoriteStores] = useState<number[]>([]);
  const addFavoriteStore = () => {
    setFavoriteStores([]);
  };
  const removeFavoriteStore = () => {
    setFavoriteStores([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        addFavoriteStore,
        removeFavoriteStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
