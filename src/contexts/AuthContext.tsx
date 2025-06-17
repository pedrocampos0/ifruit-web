import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserType = 'customer' | 'store' | 'delivery';

interface User {
  id: number;
  name: string;
  email: string;
  type: UserType;
  document: string;
}

interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  password: string;
  type: UserType;
  document: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  registerCustomer: (name: string, email: string, password: string, cpf: string) => boolean;
  registerStore: (name: string, email: string, password: string, cnpj: string) => boolean;
  registerDelivery: (name: string, email: string, password: string, cnh: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  // Verificar se há um usuário salvo no localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('freshmarket_user');
    const savedRegisteredUsers = localStorage.getItem('freshmarket_registered_users');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Disparar evento para criar perfil se necessário
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: parsedUser }));
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('freshmarket_user');
      }
    }

    if (savedRegisteredUsers) {
      try {
        const parsedUsers = JSON.parse(savedRegisteredUsers);
        setRegisteredUsers(parsedUsers);
      } catch (error) {
        console.error('Erro ao carregar usuários registrados:', error);
        localStorage.removeItem('freshmarket_registered_users');
      }
    }
  }, []);

  // Salvar usuários registrados no localStorage sempre que a lista mudar
  useEffect(() => {
    if (registeredUsers.length > 0) {
      localStorage.setItem('freshmarket_registered_users', JSON.stringify(registeredUsers));
    }
  }, [registeredUsers]);

  const login = (email: string, password: string): boolean => {
    // Verificar se o usuário existe nos usuários registrados
    const registeredUser = registeredUsers.find(
      u => u.email === email && u.password === password
    );

    if (registeredUser) {
      const loggedUser: User = {
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        type: registeredUser.type,
        document: registeredUser.document
      };
      
      setUser(loggedUser);
      
      // Salvar no localStorage
      localStorage.setItem('freshmarket_user', JSON.stringify(loggedUser));
      
      // Disparar evento customizado para criar perfil de usuário
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: loggedUser }));
      
      return true;
    }
    
    return false;
  };

  const registerCustomer = (name: string, email: string, password: string, cpf: string): boolean => {
    // Verificar se o email já está registrado
    if (registeredUsers.find(u => u.email === email)) {
      return false;
    }

    const newUser: RegisteredUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
      type: 'customer',
      document: cpf
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    return true;
  };

  const registerStore = (name: string, email: string, password: string, cnpj: string): boolean => {
    // Verificar se o email já está registrado
    if (registeredUsers.find(u => u.email === email)) {
      return false;
    }

    const newUser: RegisteredUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
      type: 'store',
      document: cnpj
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    return true;
  };

  const registerDelivery = (name: string, email: string, password: string, cnh: string): boolean => {
    // Verificar se o email já está registrado
    if (registeredUsers.find(u => u.email === email)) {
      return false;
    }

    const newUser: RegisteredUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
      type: 'delivery',
      document: cnh
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('freshmarket_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        registerCustomer,
        registerStore,
        registerDelivery,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
