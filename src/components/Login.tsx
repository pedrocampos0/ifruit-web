
import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Building, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface LoginProps {
  onClose: () => void;
}

const Login = ({ onClose }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cpf: '' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', password: '', confirmPassword: '', cnpj: '' });
  const [registerType, setRegisterType] = useState<'customer' | 'store'>('customer');
  const { login, registerCustomer, registerStore } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const success = login(loginForm.email, loginForm.password);
    
    if (success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!",
      });
      onClose();
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos, ou usuário não cadastrado.",
        variant: "destructive",
      });
    }
  };

  const handleCustomerRegister = (e: React.FormEvent) => {
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

    const success = registerCustomer(customerForm.name, customerForm.email, customerForm.password, customerForm.cpf);
    
    if (success) {
      toast({
        title: "Cadastro realizado!",
        description: "Conta de cliente criada com sucesso! Agora você pode fazer login.",
      });
      setCustomerForm({ name: '', email: '', password: '', confirmPassword: '', cpf: '' });
    } else {
      toast({
        title: "Erro no cadastro",
        description: "Email já cadastrado ou dados inválidos.",
        variant: "destructive",
      });
    }
  };

  const handleStoreRegister = (e: React.FormEvent) => {
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

    const success = registerStore(storeForm.name, storeForm.email, storeForm.password, storeForm.cnpj);
    
    if (success) {
      toast({
        title: "Cadastro realizado!",
        description: "Conta de loja criada com sucesso! Agora você pode fazer login.",
      });
      setStoreForm({ name: '', email: '', password: '', confirmPassword: '', cnpj: '' });
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
            Bem-vindo ao FreshMarket
          </CardTitle>
          <p className="text-gray-600">Faça login ou crie sua conta</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">
              Entrar
            </Button>
          </form>
          
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

export default Login;
