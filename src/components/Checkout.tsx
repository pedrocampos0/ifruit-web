
import React, { useState } from 'react';
import { MapPin, CreditCard, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    zipCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = 5.99;
  const totalWithDelivery = getTotalPrice() + deliveryFee;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryInfo.address || !deliveryInfo.number || !deliveryInfo.neighborhood || !deliveryInfo.city || !deliveryInfo.zipCode) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simula processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Pedido confirmado!",
      description: "Seu pedido foi realizado com sucesso. Tempo estimado: 30-45 minutos.",
    });
    
    clearCart();
    setStep(3);
    setIsProcessing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Login necessário
            </h3>
            <p className="text-gray-500">
              Faça login para finalizar seu pedido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Carrinho vazio
            </h3>
            <p className="text-gray-500">
              Adicione alguns produtos antes de finalizar o pedido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-fresh-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Pedido confirmado!
            </h3>
            <p className="text-gray-500 mb-4">
              Seu pedido #12345 foi realizado com sucesso.
            </p>
            <div className="bg-fresh-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-fresh-700">
                <Clock className="w-4 h-4 inline mr-1" />
                Tempo estimado: 30-45 minutos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Pedido</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between mb-8">
              <div className={`flex items-center ${step >= 1 ? 'text-fresh-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-fresh-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Endereço</span>
              </div>
              
              <div className={`w-12 h-px ${step >= 2 ? 'bg-fresh-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${step >= 2 ? 'text-fresh-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-fresh-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Pagamento</span>
              </div>
            </div>

            {/* Step 1: Address */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Endereço *</Label>
                        <Input
                          id="address"
                          value={deliveryInfo.address}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                          placeholder="Rua, Avenida..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="number">Número *</Label>
                        <Input
                          id="number"
                          value={deliveryInfo.number}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, number: e.target.value })}
                          placeholder="123"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          value={deliveryInfo.complement}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, complement: e.target.value })}
                          placeholder="Apto, Bloco..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="neighborhood">Bairro *</Label>
                        <Input
                          id="neighborhood"
                          value={deliveryInfo.neighborhood}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, neighborhood: e.target.value })}
                          placeholder="Centro"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          value={deliveryInfo.city}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                          placeholder="São Paulo"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="zipCode">CEP *</Label>
                        <Input
                          id="zipCode"
                          value={deliveryInfo.zipCode}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, zipCode: e.target.value })}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">
                      Continuar para Pagamento
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex-1 cursor-pointer">
                          Cartão de Crédito
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="debit" id="debit" />
                        <Label htmlFor="debit" className="flex-1 cursor-pointer">
                          Cartão de Débito
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex-1 cursor-pointer">
                          PIX
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          Dinheiro na Entrega
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Voltar
                      </Button>
                      
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                      >
                        {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity}x R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-fresh-600">R$ {totalWithDelivery.toFixed(2)}</span>
                </div>
                
                <div className="bg-fresh-50 p-3 rounded-lg">
                  <p className="text-sm text-fresh-700">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Tempo estimado: 30-45 minutos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
