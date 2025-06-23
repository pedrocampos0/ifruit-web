import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
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

type Role = 'USER' | 'MANAGER';

const Login = ({ onClose }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [role, setRole] = useState<Role>('USER');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.username || !loginForm.password) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const success = await login(loginForm.username, loginForm.password, role);

    if (success) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${role === 'USER' ? 'cliente' : 'lojista'}!`,
      });
      onClose();
    } else {
      toast({
        title: "Erro no Login",
        description: "Email ou senha incorretos, ou usuário não encontrado.",
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
            <p className="text-gray-600">Acesse sua conta como cliente ou loja</p>
          </CardHeader>

          <CardContent>
            <Tabs
                value={role}
                onValueChange={(value) => setRole(value as Role)}
                className="w-full mb-4"
            >
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
            </Tabs>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">
                  {'Nome de Usuário'}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                      id="login-username"
                      type="text"
                      placeholder={'Digite seu nome de usuário'}
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
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
                      placeholder="Sua senha de acesso"
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

              <Button type="submit" className={role === 'USER' ? 'bg-fresh-500 hover:bg-fresh-600 w-full' : 'bg-orange-500 hover:bg-orange-600 w-full'}>
                Entrar como {role === 'USER' ? 'Cliente' : 'Loja'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 w-full"
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