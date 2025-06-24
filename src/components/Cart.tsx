import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart = ({ isOpen, onClose, onCheckout }: CartProps) => {
  const api = useApi(); 
  const { items, updateQuantity, removeFromCart, getTotalPrice, cartId } = useCart();
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho Vazio",
        description: "Adicione itens ao carrinho antes de finalizar o pedido.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (cartId) {
        toast({
          title: "Pedido Finalizado!",
          description: `Seu pedido com o Carrinho ID ${cartId} foi finalizado com sucesso!`,
          variant: "default",
        });
        onCheckout();
        onClose();
      } else {
        toast({
          title: "Erro no Carrinho",
          description: "Nenhum carrinho ativo encontrado para finalizar.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao finalizar o pedido:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível finalizar o pedido. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Seu Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-300 text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Seu carrinho está vazio
                </h3>
                <p className="text-gray-500 mb-4">
                  Adicione alguns produtos frescos para começar!
                </p>
                <Button onClick={onClose} className="bg-fresh-500 hover:bg-fresh-600">
                  Continuar Comprando
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-fresh-600 font-semibold">
                          R$ {item.price.toFixed(2)}/{item.unit}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="font-semibold text-gray-800">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-fresh-600">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
                    disabled={items.length === 0}
                  >
                    Finalizar Pedido
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
