import React, { createContext, useContext, useState } from 'react';
import { useApi } from '@/hooks/useApi';

interface InitialAuthData {
  nome: string;
  nomeUsuario: string;
  senha: string;
  email: string;
}

interface CustomerData {
  cpf: string;
  dataNascimento: string;
  celular: string;
  endereco: string;
}

interface RegisteredCustomerData {
  id: number;
  userId: number;
  nome: string;
  email: string;
  nomeUsuario: string;
  cpf: string;
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

interface StagedUser {
  userId: number;
  email: string;
  nomeUsuario: string;
  token: string;
}

interface RegisterContextType {
  stagedUser: StagedUser | null;
  initialRegister: (data: InitialAuthData) => Promise<boolean>;
  completeCustomerRegistration: (data: CustomerData) => Promise<RegisteredCustomerData | null>;
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
  const [stagedUser, setStagedUser] = useState<StagedUser | null>(null);

  const initialRegister = async (data: InitialAuthData): Promise<boolean> => {
    try {
      const responseAuthReg = await api.post('/auth/register/', {
        nome: data.nome,
        nomeUsuario: data.nomeUsuario,
        senha: data.senha,
        email: data.email
      });

      const tokenResponse = await api.post('/auth/login', {
        nomeUsuario: data.nomeUsuario,
        senha: data.senha
      });

      const token = tokenResponse.data.access_token;
      const userId = responseAuthReg.data.id;

      setStagedUser({ token, userId, email: data.email, nomeUsuario: data.nomeUsuario });

      return true;
    } catch (error) {
      console.error("Erro no registro inicial:", error);
      return false;
    }
  };

  const completeCustomerRegistration = async (data: CustomerData): Promise<RegisteredCustomerData | null> => {
    if (!stagedUser) {
      console.error("Nenhum usuário em processo de registro.");
      return null;
    }
    try {
      const headers = {
        'Authorization': `Bearer ${stagedUser.token}`,
        'Content-Type': 'application/json'
      };
      const customerPayload = {
        celular: Number(data.celular),
        cpf: Number(data.cpf),
        dataNascimento: data.dataNascimento,
        userId: stagedUser.userId,
        endereco: data.endereco
      };

      const responseCustomerReg = await api.post('/cliente', customerPayload, { headers });
      return { ...responseCustomerReg.data };

    } catch (error) {
      console.error("Erro ao completar o cadastro do cliente:", error);
      return null;
    }
  };

  const registerStore = async (data: StoreData): Promise<boolean> => {
    try {
      await api.post('/auth/register/store', data);
      return true;
    } catch (error) {
      console.error("Erro no registro da loja:", error);
      return false;
    }
  };

  const registerDelivery = async (data: DeliveryData): Promise<boolean> => {
    try {
      await api.post('/auth/register/delivery', data);
      return true;
    } catch (error) {
      console.error("Erro no registro do entregador:", error);
      return false;
    }
  };

  return (
      <RegisterContext.Provider
          value={{
            stagedUser,
            initialRegister,
            completeCustomerRegistration,
            registerStore,
            registerDelivery,
          }}
      >
        {children}
      </RegisterContext.Provider>
  );
}