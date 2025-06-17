import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useApi } from "@/hooks/useApi.ts";
import { jwtDecode, JwtPayload } from "jwt-decode";
import SignUp from "@/components/SignUp.tsx";

export type UserType = 'customer' | 'store' | 'delivery';

interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string;
  status: string;
  items: Item[];
  total: number;
}

interface Sale {
  id: number;
  storeId: number;
  total: number;
  date: string;
  orderId: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  items: Item[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  type: UserType;
  document: string;
  address: string;
  phone: string;
  token: string;
  favoriteStores: number[];
  orders?: Order[];
  dataNascimento?: string;
}

export interface Store extends Omit<User, 'document'> {
  type: 'store';
  cnpj: string;
  sales?: Sale[];
  description: string;
}

interface AuthContextType {
  user: User | Store | null;
  login: (username: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  addFavoriteStore: (storeId: number) => Promise<void>;
  removeFavoriteStore: (storeId: number) => Promise<void>;
}

interface CustomJwtPayload extends JwtPayload {
  nomeUsuario: string;
  role: "USER" | "STORE" | "DELIVERY";
  sub: string;
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
  const [user, setUser] = useState<User | Store | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { nomeUsuario: username, senha: password });
      const token = response.data.access_token;
      if (!token) return false;

      const decoded = jwtDecode<CustomJwtPayload>(token);
      const userId = parseInt(decoded.sub, 10);
      const userType = role;

      let loggedUser: User | Store | null = null;

      switch(userType) {
        case 'customer': {
          const resClients = await api.get('/cliente');
          for (const client of resClients.data) {
            if (client.userId === userId) {
              loggedUser = {
                id: client.id,
                username: decoded.nomeUsuario,
                name: client.user.nome,
                email: client.user.email,
                type: 'customer',
                document: client.cpf.toString(),
                address: client.endereco,
                phone: client.celular.toString(),
                token: token,
                favoriteStores: client.favoritos || [],
                dataNascimento: client.dataNascimento,
              };
              break;
            }
          }
          break;
        }

        case 'store': {
          const resStores = await api.get('/cliente');
          for (const storeInfo of resStores.data) {
            if (storeInfo.userId === userId) {
              loggedUser = {
                id: storeInfo.id,
                username: decoded.nomeUsuario,
                name: storeInfo.user.nome,
                email: storeInfo.user.email,
                type: 'store',
                cnpj: storeInfo.cnpj.toString(),
                address: storeInfo.endereco,
                phone: storeInfo.telefone.toString(),
                description: storeInfo.descricao || '',
                token: token,
                favoriteStores: [],
              };
              break;
            }
          }
          break;
        }
        default:
          return false;
      }

      if (loggedUser) {
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        return true;
      } else {
        // return para index.tsx com signup open pra completar o cadastro
      }

      return false;

    } catch (error) {
      console.error("Falha no login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.reload();
  };

  const updateFavoriteStores = async (storeId: number, action: 'add' | 'remove') => {
    if (!user || user.type !== 'customer') return;

    const currentFavorites = user.favoriteStores || [];
    const newFavorites = action === 'add'
        ? [...currentFavorites, storeId]
        : currentFavorites.filter(id => id !== storeId);

    const originalUser = user;

    try {
      const updatedUser = { ...user, favoriteStores: newFavorites } as User;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      await api.patch(`/cliente/${user.id}`, { favoritos: newFavorites }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
    } catch (error) {
      console.error(`Falha ao ${action === 'add' ? 'adicionar' : 'remover'} favorito:`, error);
      setUser(originalUser);
      localStorage.setItem('user', JSON.stringify(originalUser));
    }
  };

  const addFavoriteStore = async (storeId: number) => {
    await updateFavoriteStores(storeId, 'add');
  };

  const removeFavoriteStore = async (storeId: number) => {
    await updateFavoriteStores(storeId, 'remove');
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