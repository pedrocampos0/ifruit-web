import React, { createContext, useContext, useState } from 'react';
import { useApi } from '@/hooks/useApi';

type UserRole = 'USER' | 'MANAGER' | 'DELIVERY';

interface InitialAuthData {
  nome: string;
  nomeUsuario: string;
  senha:string;
  email: string;
  role: UserRole;
}

interface InitialRegisterResponse {
  success: boolean;
  userId?: string;
  message?: string;
  token?: string;
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

interface StoreCompletionData {
  nome: string;
  cnpj: string;
  horarioFuncionamento: string;
  endereco: string;
  userId: string | number;
  token: string;
}

interface DeliveryCompletionData {
  cnh: string;
  userId: string;
}

interface StagedUser {
  userId: string;
  email: string;
  nomeUsuario: string;
  token: string;
}

interface RegisterContextType {
  stagedUser: StagedUser | null;
  initialRegister: (data: InitialAuthData) => Promise<InitialRegisterResponse>;
  completeCustomerRegistration: (data: CustomerData) => Promise<RegisteredCustomerData | null>;
  completeStoreRegistration: (data: StoreCompletionData) => Promise<boolean>;
  completeDeliveryRegistration: (data: DeliveryCompletionData) => Promise<boolean>;
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

  const initialRegister = async (data: InitialAuthData): Promise<InitialRegisterResponse> => {
    try {
      const responseAuthReg = await api.post('/auth/register/', {
        nome: data.nome,
        nomeUsuario: data.nomeUsuario,
        senha: data.senha,
        email: data.email,
        role: data.role
      });

      const tokenResponse = await api.post('/auth/login', {
        nomeUsuario: data.nomeUsuario,
        senha: data.senha
      });

      const token = tokenResponse.data.access_token;
      const userId = responseAuthReg.data.id;

      setStagedUser({ token, userId, email: data.email, nomeUsuario: data.nomeUsuario });

      return { success: true, userId: userId, token: token };

    } catch (error: any) {
      console.error("Erro no registro inicial:", error);
      const message = error.response?.data?.message || "Ocorreu um erro desconhecido.";
      return { success: false, message: message };
    }
  };

  const completeCustomerRegistration = async (data: CustomerData): Promise<RegisteredCustomerData | null> => {
    if (!stagedUser) {
      console.error("Nenhum usuário em processo de registro.");
      return null;
    }
    try {
      const headers = { 'Authorization': `Bearer ${stagedUser.token}` };
      const customerPayload = {
        celular: data.celular,
        cpf: data.cpf,
        dataNascimento: data.dataNascimento,
        userId: stagedUser.userId,
        endereco: data.endereco
      };
      const responseCustomerReg = await api.post('/cliente', customerPayload, { headers });
      return responseCustomerReg.data;
    } catch (error) {
      console.error("Erro ao completar o cadastro do cliente:", error);
      return null;
    }
  };

  const completeStoreRegistration = async (data: StoreCompletionData): Promise<boolean> => {
    try {
      const headers = {
        'content-type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      };

      delete data.token;
      const cnpjTratado = Number(data.cnpj.replace(/\D/g, ''));
      data.userId = Number(data.userId);
      await api.post('/loja', {...data, cnpj: cnpjTratado}, { headers });
      return true;
    } catch (error) {
      console.error("Erro ao completar o registro da loja:", error);
      return false;
    }
  };

  const completeDeliveryRegistration = async (data: DeliveryCompletionData): Promise<boolean> => {
    try {
      await api.post('/entregador', data);
      return true;
    } catch (error) {
      console.error("Erro ao completar o registro do entregador:", error);
      return false;
    }
  };

  return (
      <RegisterContext.Provider
          value={{
            stagedUser,
            initialRegister,
            completeCustomerRegistration,
            completeStoreRegistration,
            completeDeliveryRegistration,
          }}
      >
        {children}
      </RegisterContext.Provider>
  );
}