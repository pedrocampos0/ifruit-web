
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserType } from './AuthContext';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  type: UserType;
  document: string;
  phone?: string;
  address?: string;
  favoriteStores: number[];
}

export interface StoreProfile {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  ownerId: number;
}

export interface Order {
  id: number;
  userId: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  date: string;
}

export interface Sale {
  id: number;
  storeId: number;
  orderId: number;
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  storeProfile: StoreProfile | null;
  orders: Order[];
  sales: Sale[];
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  createStoreProfile: (store: Omit<StoreProfile, 'id' | 'ownerId'>) => void;
  updateStoreProfile: (profile: Partial<StoreProfile>) => void;
  addFavoriteStore: (storeId: number) => void;
  removeFavoriteStore: (storeId: number) => void;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Ouvir evento de login para criar perfil automaticamente
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      const user = event.detail;
      if (user && !userProfile) {
        const newProfile: UserProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
          document: user.document,
          favoriteStores: [],
        };
        setUserProfile(newProfile);
      }
    };

    window.addEventListener('userLoggedIn', handleUserLogin as EventListener);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin as EventListener);
    };
  }, [userProfile]);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...profile } : null);
  };

  const createStoreProfile = (store: Omit<StoreProfile, 'id' | 'ownerId'>) => {
    const newStore: StoreProfile = {
      ...store,
      id: Date.now(),
      ownerId: userProfile?.id || 1,
    };
    setStoreProfile(newStore);
  };

  const updateStoreProfile = (profile: Partial<StoreProfile>) => {
    setStoreProfile(prev => prev ? { ...prev, ...profile } : null);
  };

  const addFavoriteStore = (storeId: number) => {
    setUserProfile(prev => 
      prev ? {
        ...prev,
        favoriteStores: [...prev.favoriteStores, storeId]
      } : null
    );
  };

  const removeFavoriteStore = (storeId: number) => {
    setUserProfile(prev => 
      prev ? {
        ...prev,
        favoriteStores: prev.favoriteStores.filter(id => id !== storeId)
      } : null
    );
  };

  const addOrder = (order: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setSales(prev => [...prev, newSale]);
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        storeProfile,
        orders,
        sales,
        updateUserProfile,
        createStoreProfile,
        updateStoreProfile,
        addFavoriteStore,
        removeFavoriteStore,
        addOrder,
        addSale,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileProvider;
