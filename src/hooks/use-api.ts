import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  findData: (url: string, options?: RequestInit) => Promise<void>;
  postData: <D>(url: string, body: D) => Promise<T>;
  putData: <D>(url: string, body: D) => Promise<T>;
  deleteData: (url: string) => Promise<void>;
}

export function useApi<T>(): UseApiReturn<T> {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/auth/register';

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const findData = useCallback(async (url: string, options?: RequestInit) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      const data = await handleResponse(response);
      setState({ data, error: null, loading: false });
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        loading: false,
      });
      throw error;
    }
  }, []);

  const postData = useCallback(async <D>(url: string, body: D): Promise<T> => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await handleResponse(response);
      setState({ data, error: null, loading: false });
      return data;
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        loading: false,
      });
      throw error;
    }
  }, []);

  const putData = useCallback(async <D>(url: string, body: D): Promise<T> => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await handleResponse(response);
      setState({ data, error: null, loading: false });
      return data;
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        loading: false,
      });
      throw error;
    }
  }, []);

  const deleteData = useCallback(async (url: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await handleResponse(response);
      setState({ data: null, error: null, loading: false });
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        loading: false,
      });
      throw error;
    }
  }, []);

  return {
    ...state,
    findData,
    postData,
    putData,
    deleteData,
  };
}
