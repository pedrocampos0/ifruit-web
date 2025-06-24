import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useApi } from '@/hooks/useApi'; 
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  cartId: number | null; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const api = useApi(); 
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);

  const { user } = useAuth();
  const clienteId = user?.type === 'customer' ? user.id : null;
  const lojaId = 2; 

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    const storedCartId = localStorage.getItem('cartId');
    if (storedCartItems) {
      try {
        setItems(JSON.parse(storedCartItems));
      } catch (e) {
        console.error("Falha ao parsear cartItems do localStorage", e);
        localStorage.removeItem('cartItems');
      }
    }
    if (storedCartId) {
      try {
        setCartId(JSON.parse(storedCartId));
      } catch (e) {
        console.error("Falha ao parsear cartId do localStorage", e);
        localStorage.removeItem('cartId');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('cartId', JSON.stringify(cartId));
  }, [cartId]);

  const addToCart = async (product: Product) => {
    try {
      if (items.length === 0 && cartId === null) {
        console.log('Criando novo carrinho com o primeiro item:', { clienteId, lojaId, produtoId: product.id });
        const createCartResponse = await api.post('/carts/newCart', {
          createCartDto: {
            clienteId: clienteId,
            lojaId: lojaId,
          },
          produtoId: product.id,
        });
        const newCartId = createCartResponse.data.id;
        setCartId(newCartId); 
        setItems([{ ...product, quantity: 1 }]); 
        toast({
          title: "Carrinho Criado!",
          description: `Seu carrinho foi criado com o produto ${product.name}.`,
        });
      } else {

        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;
          if (cartId === null) {
            toast({
              title: "Erro de Carrinho",
              description: "Não foi possível atualizar o item: ID do carrinho ausente.",
              variant: "destructive",
            });
            return;
          }
          console.log('Dados a serem enviados para /cart-items:', {
            quantity: newQuantity,
            produtoId: product.id, 
            cartId: cartId,
            typeOfQuantity: typeof newQuantity,
            typeOfProdutoId: typeof product.id,
            typeOfCartId: typeof cartId,
          });
          await api.post('/cart-items', {  
            quantity: newQuantity,
            produtoId: product.id,
            cartId: cartId, 
          });
          setItems(prevItems =>
            prevItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
          toast({
            title: "Item Atualizado!",
            description: `${product.name} atualizado no carrinho.`,
          });
        } else {
          if (cartId === null) {
            toast({
              title: "Erro de Carrinho",
              description: "Não foi possível adicionar o item: ID do carrinho ausente.",
              variant: "destructive",
            });
            return;
          }
          await api.post('/cart-items', { 
            quantity: 1,
            produtoId: product.id,
            cartId: cartId, 
          });
          setItems(prevItems => [...prevItems, { ...product, quantity: 1 }]);
          toast({
            title: "Item Adicionado!",
            description: `${product.name} adicionado ao carrinho.`,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho na API:', error);
      toast({
        title: 'Erro no Carrinho',
        description: 'Não foi possível adicionar o item ao carrinho. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      // if (cartId) {
      //   await api.delete(`/cart-items/${productId}?cartId=${cartId}`);
      const updatedItems = items.filter(item => item.id !== productId);
      setItems(updatedItems);
      if (updatedItems.length === 0 && cartId) {
          // await api.delete(`/carts/${cartId}`);
          setCartId(null);
          toast({
            title: "Carrinho Vazio",
            description: "Todos os itens foram removidos do carrinho.",
          });
      } else {
        toast({
          title: "Item Removido!",
          description: "O item foi removido do carrinho.",
        });
      }

    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o item do carrinho. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => { 
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      if (cartId === null) {
        toast({
          title: "Erro de Carrinho",
          description: "Não foi possível atualizar a quantidade: ID do carrinho ausente.",
          variant: "destructive",
        });
        return;
      }

      await api.post('/cart-items', { 
        quantity: quantity,
        produtoId: productId,
        cartId: cartId, 
      });

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
      toast({
        title: "Quantidade Atualizada!",
        description: `Quantidade do item atualizada.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar quantidade do item no carrinho:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a quantidade. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const clearCart = async () => { 
    try {
      if (cartId) {
        // await api.delete(`/carts/${cartId}/clear`); 
      }
      setItems([]);
      setCartId(null);
      toast({
        title: "Carrinho Limpo",
        description: "Seu carrinho foi esvaziado.",
      });
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível limpar o carrinho. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        cartId, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};