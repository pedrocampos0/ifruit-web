import React, { createContext, useContext } from 'react';
import { useApi } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';

// Interfaces para os dados de registro
interface CustomerData {
  nomeUsuario: string;
  senha: string;
  email: string;
  cpf: string;
  nome: string;
}

interface StoreData {
  name: string;
  email: string;
  password: string;
  cnpj: string;
}

interface DeliveryData {
  name: string;
  email: string;
  password: string;
  cnh: string;
}

interface RegisterContextType {
  registerCustomer: (data: CustomerData) => Promise<boolean>;
  registerStore: (data: StoreData) => Promise<boolean>;
  registerDelivery: (data: DeliveryData) => Promise<boolean>;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export function useRegister() {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error('useRegister must be used within a RegisterProvider');
  }
  return context;
}

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const api = useApi();

  const registerCustomer = async (data: CustomerData): Promise<boolean> => {
    try {
      await api.post('/auth/register/', data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerStore = async (data: StoreData): Promise<boolean> => {
    try {
      await api.post('/auth/register/store', data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerDelivery = async (data: DeliveryData): Promise<boolean> => {
    try {
      await api.post('/auth/register/delivery', data);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <RegisterContext.Provider
      value={{
        registerCustomer,
        registerStore,
        registerDelivery,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
}
