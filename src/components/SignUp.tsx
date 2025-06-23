import React, { useState } from 'react';
import { Mail, Lock, User, EyeOff, X } from 'lucide-react';
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

type UserRole = 'USER' | 'MANAGER' | 'DELIVERY';

const SignUp = ({ onClose }: SignUpProps) => {
  const [registrationStep, setRegistrationStep] = useState<'initial' | 'additionalInfo'>('initial');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('USER');
  const [generatedUserId, setGeneratedUserId] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [initialForm, setInitialForm] = useState({ email: '', username: '', password: '', confirmPassword: '', name: '' });
  const [customerForm, setCustomerForm] = useState({ cpf: '', birthDate: '', phone: '', address: '' });
  const [storeForm, setStoreForm] = useState({ name: '', cnpj: '', operatingHours: '', address: '' });
  const [deliveryForm, setDeliveryForm] = useState({ cnh: '' });

  const { initialRegister, completeCustomerRegistration, completeStoreRegistration, completeDeliveryRegistration } = useRegister();

  const handleInitialRegister = async (e: React.FormEvent, role: UserRole) => {
    e.preventDefault();
    if (!initialForm.email || !initialForm.username || !initialForm.password || !initialForm.confirmPassword || !initialForm.name) {
      toast({ title: "Erro", description: "Por favor, preencha todos os campos.", variant: "destructive" });
      return;
    }
    if (initialForm.password !== initialForm.confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    setSelectedRole(role);

    const response = await initialRegister({
      nome: initialForm.name,
      nomeUsuario: initialForm.username,
      email: initialForm.email,
      senha: initialForm.password,
      role: role
    });

    debugger
    if (response.success && response.userId && response.token) {
      setGeneratedUserId(response.userId);
      setGeneratedToken(response.token);
      toast({ title: "Primeiro passo concluído!", description: "Agora, complete seu cadastro." });
      setRegistrationStep('additionalInfo');
    } else {
      const errorMessage = response.message || "Usuário ou e-mail já existente.";
      toast({ title: "Erro no cadastro", description: errorMessage, variant: "destructive" });
    }
  };

  const handleCustomerCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await completeCustomerRegistration({
      cpf: customerForm.cpf.replace(/\D/g, ''),
      dataNascimento: customerForm.birthDate,
      celular: customerForm.phone.replace(/\D/g, ''),
      endereco: customerForm.address
    });
    if (success) {
      toast({ title: "Cadastro de cliente concluído!", description: "Sua conta foi criada. Você já pode fazer login." });
      onClose();
    } else {
      toast({ title: "Erro", description: "Não foi possível completar seu cadastro.", variant: "destructive" });
    }
  };

  const handleStoreCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedUserId) {
      toast({ title: "Erro Crítico", description: "ID do usuário não encontrado. Por favor, tente o cadastro novamente.", variant: "destructive" });
      return;
    }

    const success = await completeStoreRegistration({
      nome: storeForm.name,
      cnpj: storeForm.cnpj,
      horarioFuncionamento: storeForm.operatingHours,
      endereco: storeForm.address,
      userId: generatedUserId,
      token: generatedToken
    });

    if (success) {
      toast({ title: "Cadastro de loja realizado!", description: "Sua conta foi criada com sucesso." });
      onClose();
    } else {
      toast({ title: "Erro no cadastro", description: "Dados inválidos.", variant: "destructive" });
    }
  };

  const handleDeliveryCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedUserId) {
      toast({ title: "Erro Crítico", description: "ID do usuário não encontrado. Por favor, tente o cadastro novamente.", variant: "destructive" });
      return;
    }
    const success = await completeDeliveryRegistration({
      cnh: deliveryForm.cnh,
      userId: generatedUserId
    });
    if (success) {
      toast({ title: "Cadastro de entregador realizado!", description: "Sua conta foi criada com sucesso." });
      onClose();
    } else {
      toast({ title: "Erro no cadastro", description: "Dados inválidos.", variant: "destructive" });
    }
  };

  const formatCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
  const formatPhone = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
  const formatCNPJ = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').substring(0, 18);

  const renderInitialForm = (role: UserRole) => (
      <form onSubmit={(e) => handleInitialRegister(e, role)} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${role}`}>Nome Completo</Label>
          <Input id={`name-${role}`} placeholder="Seu nome completo" value={initialForm.name} onChange={(e) => setInitialForm({ ...initialForm, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`username-${role}`}>Nome de Usuário</Label>
          <Input id={`username-${role}`} placeholder="Um nome de usuário único" value={initialForm.username} onChange={(e) => setInitialForm({ ...initialForm, username: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`email-${role}`}>Email</Label>
          <Input id={`email-${role}`} placeholder="seu@email.com" type="email" value={initialForm.email} onChange={(e) => setInitialForm({ ...initialForm, email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`password-${role}`}>Senha</Label>
          <Input id={`password-${role}`} placeholder="Senha forte" type={showPassword ? "text" : "password"} value={initialForm.password} onChange={(e) => setInitialForm({ ...initialForm, password: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`confirmPassword-${role}`}>Confirmar Senha</Label>
          <Input id={`confirmPassword-${role}`} placeholder="Confirme sua senha" type={showPassword ? "text" : "password"} value={initialForm.confirmPassword} onChange={(e) => setInitialForm({ ...initialForm, confirmPassword: e.target.value })} />
        </div>
        <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">Criar Conta</Button>
      </form>
  );

  const renderAdditionalInfo = () => {
    switch (selectedRole) {
      case 'USER':
        return (
            <form onSubmit={handleCustomerCompletion} className="space-y-3 pt-4">
              <Input placeholder="CPF" value={customerForm.cpf} onChange={e => setCustomerForm({ ...customerForm, cpf: formatCPF(e.target.value) })} />
              <Input type="date" placeholder="Data de Nascimento" value={customerForm.birthDate} onChange={e => setCustomerForm({ ...customerForm, birthDate: e.target.value })} />
              <Input placeholder="Celular com DDD" value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: formatPhone(e.target.value) })} />
              <Input placeholder="Endereço Completo" value={customerForm.address} onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} />
              <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">Finalizar Cadastro de Cliente</Button>
            </form>
        );
      case 'MANAGER':
        return (
            <form onSubmit={handleStoreCompletion} className="space-y-3 pt-4">
              <Input
                  placeholder="Nome da Loja"
                  value={storeForm.name}
                  onChange={e => setStoreForm({ ...storeForm, name: e.target.value })}
              />
              <Input
                  placeholder="CNPJ"
                  value={storeForm.cnpj}
                  onChange={e => setStoreForm({ ...storeForm, cnpj: formatCNPJ(e.target.value) })}
              />
              <Input
                  placeholder="Horário de Funcionamento (ex: 08:00 - 18:00)"
                  value={storeForm.operatingHours}
                  onChange={e => setStoreForm({ ...storeForm, operatingHours: e.target.value })}
              />
              <Input
                  placeholder="Endereço da Loja"
                  value={storeForm.address}
                  onChange={e => setStoreForm({ ...storeForm, address: e.target.value })}
              />
              <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">Finalizar Cadastro de Lojista</Button>
            </form>
        );
      case 'DELIVERY':
        return (
            <form onSubmit={handleDeliveryCompletion} className="space-y-3 pt-4">
              <Input placeholder="Número da CNH" value={deliveryForm.cnh} onChange={e => setDeliveryForm({ ...deliveryForm, cnh: e.target.value })} />
              <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">Finalizar Cadastro de Entregador</Button>
            </form>
        );
      default:
        return null;
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md animate-scale-in relative">
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </Button>

          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {registrationStep === 'initial' ? 'Crie sua conta no FreshMarket' : 'Complete seu Cadastro'}
            </CardTitle>
            <p className="text-gray-600">
              {registrationStep === 'initial' ? 'Primeiro, escolha seu tipo de conta.' : 'Falta pouco para concluir!'}
            </p>
          </CardHeader>
          <CardContent>
            {registrationStep === 'initial' ? (
                <Tabs defaultValue="USER" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                        value="USER"
                        className="data-[state=active]:bg-green-400 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                    >
                      Sou Cliente
                    </TabsTrigger>
                    <TabsTrigger
                        value="MANAGER"
                        className="data-[state=active]:bg-orange-400 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                    >
                      Sou Lojista
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="USER">
                    {renderInitialForm('USER')}
                  </TabsContent>
                  <TabsContent value="MANAGER">
                    {renderInitialForm('MANAGER')}
                  </TabsContent>
                </Tabs>
            ) : (
                renderAdditionalInfo()
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default SignUp;