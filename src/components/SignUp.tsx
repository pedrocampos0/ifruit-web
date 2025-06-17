import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Building, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRegister } from '@/contexts/RegisterContext';
import { toast } from '@/hooks/use-toast';

interface SignUpProps {
  onClose: () => void;
}

const SignUp = ({ onClose }: SignUpProps) => {
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [showStorePassword, setShowStorePassword] = useState(false);
  const [showDeliveryPassword, setShowDeliveryPassword] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cpf: '' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cnpj: '' });
  const [deliveryForm, setDeliveryForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cnh: '' });
  const [registerType, setRegisterType] = useState<'customer' | 'store' | 'delivery'>('customer');
  const { registerCustomer, registerStore, registerDelivery } = useRegister();

  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substring(0, 14);
  };

  const handleCustomerCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerForm({ ...customerForm, cpf: formatCPF(e.target.value) });
  };


  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerForm.name || !customerForm.email || !customerForm.password || !customerForm.confirmPassword || !customerForm.cpf) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (customerForm.password !== customerForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    const success = await registerCustomer({
      nomeUsuario: customerForm.name,
      nome: customerForm.name,
      email: customerForm.email,
      senha: customerForm.password,
      cpf: customerForm.cpf.replace(/\D/g, '')
    });

    if (success) {
      toast({
        title: "Cadastro realizado!",
        description: "Conta de cliente criada com sucesso! Agora você pode fazer login.",
      });
      setCustomerForm({ name: '', email: '', password: '', confirmPassword: '', cpf: '' });
      onClose();
    } else {
      toast({
        title: "Erro no cadastro",
        description: "Email já cadastrado ou dados inválidos.",
        variant: "destructive",
      });
    }
  };

  const handleStoreRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeForm.name || !storeForm.email || !storeForm.password || !storeForm.confirmPassword || !storeForm.cnpj) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (storeForm.password !== storeForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    const success = await registerStore({
      name: storeForm.name,
      email: storeForm.email,
      password: storeForm.password,
      cnpj: storeForm.cnpj
    });

    if (success) {
      toast({
        title: "Cadastro realizado!",
        description: "Conta de loja criada com sucesso! Agora você pode fazer login.",
      });
      setStoreForm({ name: '', email: '', password: '', confirmPassword: '', cnpj: '' });
      onClose();
    } else {
      toast({
        title: "Erro no cadastro",
        description: "Email já cadastrado ou dados inválidos.",
        variant: "destructive",
      });
    }
  };

  const handleDeliveryRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryForm.name || !deliveryForm.email || !deliveryForm.password || !deliveryForm.confirmPassword || !deliveryForm.cnh) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (deliveryForm.password !== deliveryForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    const success = await registerDelivery({
      name: deliveryForm.name,
      email: deliveryForm.email,
      password: deliveryForm.password,
      cnh: deliveryForm.cnh
    });

    if (success) {
      toast({
        title: "Cadastro realizado!",
        description: "Conta de entregador criada com sucesso! Agora você pode fazer login.",
      });
      setDeliveryForm({ name: '', email: '', password: '', confirmPassword: '', cnh: '' });
      onClose();
    } else {
      toast({
        title: "Erro no cadastro",
        description: "Email já cadastrado ou dados inválidos.",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Crie sua conta no FreshMarket
            </CardTitle>
            <p className="text-gray-600">Escolha o tipo de conta para começar</p>
          </CardHeader>

          <CardContent>
            <Tabs value={registerType} onValueChange={(value) => setRegisterType(value as 'customer' | 'store' | 'delivery')} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customer">Cliente</TabsTrigger>
                <TabsTrigger value="store">Loja</TabsTrigger>
                <TabsTrigger value="delivery">Entregador</TabsTrigger>
              </TabsList>
              <TabsContent value="customer" className="mt-4">
                <form onSubmit={handleCustomerRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="customer-name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={customerForm.name}
                          onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                          className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="customer-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={customerForm.email}
                          onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                          className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="customer-password"
                          type={showCustomerPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          value={customerForm.password}
                          onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                          className="pl-10 pr-10"
                      />
                      <button
                          type="button"
                          onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="customer-confirm-password"
                          type={showCustomerPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          value={customerForm.confirmPassword}
                          onChange={(e) => setCustomerForm({ ...customerForm, confirmPassword: e.target.value })}
                          className="pl-10 pr-10"
                      />
                      <button
                          type="button"
                          onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-cpf">CPF</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="customer-cpf"
                          type="text"
                          placeholder="000.000.000-00"
                          value={customerForm.cpf}
                          onChange={handleCustomerCPFChange}
                          className="pl-10"
                          maxLength={14}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">
                    Cadastrar Cliente
                  </Button>
                </form>
              </TabsContent>
              {/* O restante do seu componente permanece o mesmo */}
              <TabsContent value="store" className="mt-4">
                <form onSubmit={handleStoreRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Nome da Loja</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="store-name"
                          type="text"
                          placeholder="Nome da sua loja"
                          value={storeForm.name}
                          onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                          className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="store-email"
                          type="email"
                          placeholder="email@sua-loja.com"
                          value={storeForm.email}
                          onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                          className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="store-password"
                          type={showStorePassword ? "text" : "password"}
                          placeholder="Senha da loja"
                          value={storeForm.password}
                          onChange={(e) => setStoreForm({ ...storeForm, password: e.target.value })}
                          className="pl-10 pr-10"
                      />
                      <button
                          type="button"
                          onClick={() => setShowStorePassword(!showStorePassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showStorePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="store-confirm-password"
                          type={showStorePassword ? "text" : "password"}
                          placeholder="Confirme a senha da loja"
                          value={storeForm.confirmPassword}
                          onChange={(e) => setStoreForm({ ...storeForm, confirmPassword: e.target.value })}
                          className="pl-10 pr-10"
                      />
                      <button
                          type="button"
                          onClick={() => setShowStorePassword(!showStorePassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showStorePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-cnpj">CNPJ</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="store-cnpj"
                          type="text"
                          placeholder="00.000.000/0000-00"
                          value={storeForm.cnpj}
                          onChange={(e) => setStoreForm({ ...storeForm, cnpj: e.target.value })}
                          className="pl-10"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">
                    Cadastrar Loja
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="delivery" className="mt-4">
                <form onSubmit={handleDeliveryRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="delivery-name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={deliveryForm.name}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, name: e.target.value })}
                          className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="delivery-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={deliveryForm.email}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, email: e.target.value })}
                          className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="delivery-password"
                          type={showDeliveryPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          value={deliveryForm.password}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, password: e.target.value })}
                          className="pl-10 pr-10"
                      />
                      <button
                          type="button"
                          onClick={() => setShowDeliveryPassword(!showDeliveryPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showDeliveryPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="delivery-confirm-password"
                          type={showDeliveryPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          value={deliveryForm.confirmPassword}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, confirmPassword: e.target.value })}
                          className="pl-10 pr-10"
                      />
                      <button
                          type="button"
                          onClick={() => setShowDeliveryPassword(!showDeliveryPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showDeliveryPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-cnh">CNH</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                          id="delivery-cnh"
                          type="text"
                          placeholder="00000000000"
                          value={deliveryForm.cnh}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, cnh: e.target.value })}
                          className="pl-10"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">
                    Cadastrar Entregador
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
              >
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default SignUp;