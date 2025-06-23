import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useApi } from "@/hooks/useApi.ts";
import { jwtDecode, JwtPayload } from "jwt-decode";
import SignUp from "@/components/SignUp.tsx";

export type UserType = 'USER' | 'MANAGER' | 'delivery';

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
  type: 'MANAGER';
  cnpj: string;
  sales?: Sale[];
  horarioFuncionamento: string;
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
  role: "USER" | "MANAGER" | "DELIVERY";
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
        case 'USER': {
          const resClients = await api.get('/cliente');
          for (const client of resClients.data) {
            if (client.userId === userId) {
              loggedUser = {
                id: client.id,
                username: decoded.nomeUsuario,
                name: client.user.nome,
                email: client.user.email,
                type: 'USER',
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

        case 'MANAGER': {
          const resStores = await api.get('/loja');
          for (const storeInfo of resStores.data) {
            if (storeInfo.userId === userId) {
              loggedUser = {
                id: storeInfo.id,
                username: decoded.nomeUsuario,
                name: storeInfo.nome,
                email: storeInfo.email || '',
                type: 'MANAGER',
                cnpj: storeInfo.cnpj,
                address: storeInfo.endereco,
                phone: storeInfo.telefone || '',
                horarioFuncionamento: storeInfo.horarioFuncionamento || '',
                token: token,
                favoriteStores: [],
                sales: storeInfo.vendas || [],
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
    if (!user || user.type !== 'USER') return;

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