import React, { useState } from 'react';
import { Mail, Lock, User, EyeOff } from 'lucide-react';
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
  const [registrationStep, setRegistrationStep] = useState<'initial' | 'additionalInfo'>('initial');
  const [showPassword, setShowPassword] = useState(false);

  const [initialForm, setInitialForm] = useState({ email: '', username: '', password: '', confirmPassword: '', name: '' });

  const [customerForm, setCustomerForm] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    address: {
      address: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      zipCode: ''
    }
  });

  const [storeForm, setStoreForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cnpj: '' });
  const [deliveryForm, setDeliveryForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cnh: '' });

  const { initialRegister, completeCustomerRegistration, registerStore, registerDelivery } = useRegister();

  const handleInitialRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialForm.email || !initialForm.username || !initialForm.password || !initialForm.confirmPassword || !initialForm.name) {
      toast({ title: "Erro", description: "Por favor, preencha todos os campos.", variant: "destructive" });
      return;
    }
    if (initialForm.password !== initialForm.confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    const success = await initialRegister({
      nome: initialForm.name,
      nomeUsuario: initialForm.username,
      email: initialForm.email,
      senha: initialForm.password
    });
    if (success) {
      toast({ title: "Primeiro passo concluído!", description: "Agora, complete seu cadastro." });
      setRegistrationStep('additionalInfo');
    } else {
      toast({ title: "Erro no cadastro", description: "Usuário ou e-mail já existente.", variant: "destructive" });
    }
  };

  const handleCustomerCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    const endereco = Object.values(customerForm.address).filter(Boolean).join(', ');
    const success = await completeCustomerRegistration({
      cpf: customerForm.cpf.replace(/\D/g, ''),
      dataNascimento: customerForm.birthDate,
      celular: customerForm.phone.replace(/\D/g, ''),
      endereco
    });
    if (success) {
      toast({ title: "Cadastro de cliente concluído!", description: "Sua conta foi criada. Você já pode fazer login." });
      onClose();
    } else {
      toast({ title: "Erro", description: "Não foi possível completar seu cadastro.", variant: "destructive" });
    }
  };

  const handleStoreRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerStore({
      name: storeForm.name,
      email: storeForm.email,
      password: storeForm.password,
      cnpj: storeForm.cnpj
    });
    if (success) {
      toast({ title: "Cadastro de loja realizado!", description: "Sua conta foi criada com sucesso." });
      onClose();
    } else {
      toast({ title: "Erro no cadastro", description: "Dados inválidos ou e-mail já cadastrado.", variant: "destructive" });
    }
  };

  const handleDeliveryRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerDelivery({
      name: deliveryForm.name,
      email: deliveryForm.email,
      password: deliveryForm.password,
      cnh: deliveryForm.cnh
    });
    if (success) {
      toast({ title: "Cadastro de entregador realizado!", description: "Sua conta foi criada com sucesso." });
      onClose();
    } else {
      toast({ title: "Erro no cadastro", description: "Dados inválidos ou e-mail já cadastrado.", variant: "destructive" });
    }
  };

  const formatCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
  const formatPhone = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {registrationStep === 'initial' ? 'Crie sua conta no FreshMarket' : 'Complete seu Cadastro'}
            </CardTitle>
            <p className="text-gray-600">
              {registrationStep === 'initial' ? 'Rápido e fácil, vamos começar!' : 'Escolha seu tipo de perfil.'}
            </p>
          </CardHeader>
          <CardContent>
            {registrationStep === 'initial' ? (
                <form onSubmit={handleInitialRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input placeholder="Nome Completo" value={initialForm.name} onChange={(e) => setInitialForm({ ...initialForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome de Usuário</Label>
                    <Input placeholder="Nome de Usuário " value={initialForm.username} onChange={(e) => setInitialForm({ ...initialForm, username: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input placeholder="Email" type="email" value={initialForm.email} onChange={(e) => setInitialForm({ ...initialForm, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input placeholder="Senha" type={showPassword ? "text" : "password"} value={initialForm.password} onChange={(e) => setInitialForm({ ...initialForm, password: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmar Senha</Label>
                    <Input placeholder="Confirmar Senha" type={showPassword ? "text" : "password"} value={initialForm.confirmPassword} onChange={(e) => setInitialForm({ ...initialForm, confirmPassword: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">Criar Conta</Button>
                </form>
            ) : (
                <Tabs defaultValue="customer">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="customer">Cliente</TabsTrigger>
                    <TabsTrigger value="store">Loja</TabsTrigger>
                    <TabsTrigger value="delivery">Entregador</TabsTrigger>
                  </TabsList>
                  <TabsContent value="customer">
                    <form onSubmit={handleCustomerCompletion} className="space-y-3">
                      <Input placeholder="CPF" value={customerForm.cpf} onChange={e => setCustomerForm({ ...customerForm, cpf: formatCPF(e.target.value) })} />
                      <Input type="date" value={customerForm.birthDate} onChange={e => setCustomerForm({ ...customerForm, birthDate: e.target.value })} />
                      <Input placeholder="Celular" value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: formatPhone(e.target.value) })} />
                      <Input placeholder="Endereço" value={customerForm.address.address} onChange={e => setCustomerForm({ ...customerForm, address: { ...customerForm.address, address: e.target.value } })} />
                      <Input placeholder="Número" value={customerForm.address.number} onChange={e => setCustomerForm({ ...customerForm, address: { ...customerForm.address, number: e.target.value } })} />
                      <Input placeholder="Complemento" value={customerForm.address.complement} onChange={e => setCustomerForm({ ...customerForm, address: { ...customerForm.address, complement: e.target.value } })} />
                      <Input placeholder="Bairro" value={customerForm.address.neighborhood} onChange={e => setCustomerForm({ ...customerForm, address: { ...customerForm.address, neighborhood: e.target.value } })} />
                      <Input placeholder="Cidade" value={customerForm.address.city} onChange={e => setCustomerForm({ ...customerForm, address: { ...customerForm.address, city: e.target.value } })} />
                      <Input placeholder="CEP" value={customerForm.address.zipCode} onChange={e => setCustomerForm({ ...customerForm, address: { ...customerForm.address, zipCode: e.target.value } })} />
                      <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">Finalizar Cadastro</Button>
                    </form>
                  </TabsContent>
                </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default SignUp;
