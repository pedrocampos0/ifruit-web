import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, User as AuthUser } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useApi } from "@/hooks/useApi.ts";

interface ProfileUser extends AuthUser {
  dataNascimento?: string;
}

const CustomerProfile = () => {
  const { user } = useAuth();
  const typedUser = user as ProfileUser;

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  const [formData, setFormData] = useState(() => {
    const addressParts = typedUser?.address?.split(',') || ['', '', '', ''];
    return {
      name: typedUser?.name || '',
      username: typedUser?.username || '',
      email: typedUser?.email || '',
      phone: typedUser?.phone || '',
      logradouro: addressParts[0]?.trim(),
      numero: addressParts[1]?.trim(),
      complemento: addressParts[2]?.trim() || '',
      bairro: addressParts[3]?.trim(),
      cidade: addressParts[4]?.trim(),
      cep: addressParts[5]?.trim(),
      cpf: typedUser?.document || '',
      dataNascimento: formatDateForInput(typedUser?.dataNascimento),
    };
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const fullAddress = [formData.logradouro, formData.numero, formData.bairro, formData.cidade]
        .map(part => part.trim())
        .join(', ');

    const updatedUser = {
      celular: Number(formData.phone),
      endereco: fullAddress,
      dataNascimento: formData.dataNascimento,
    };

    const api = useApi();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };

    try {
      await api.patch(`/cliente/${user.id}`, updatedUser, { headers });
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
        <div className="text-center py-8">
          <p className="text-gray-600">Faça login para ver seu perfil.</p>
        </div>
    );
  }

  return (
      <div className="max-w-2xl mx-auto p-6">
        <style>
          {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            display: none;
            -webkit-appearance: none;
          }
        `}
        </style>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Meu Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="name" type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="pl-10" required />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="username" type="text" value={formData.username} onChange={(e) => handleChange('username', e.target.value)} className="pl-10" required />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="pl-10" required />
                </div>
              </div>

              {/* Data Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => handleChange('dataNascimento', e.target.value)}
                      className="pl-10"
                  />
                </div>
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => handleChange('cpf', e.target.value)}
                      className="pl-10"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className="pl-10" placeholder="(00) 00000-0000" />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label>Endereço</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input
                        id="logradouro"
                        placeholder="Logradouro"
                        value={formData.logradouro}
                        onChange={(e) => handleChange('logradouro', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                        id="numero"
                        placeholder="Número"
                        value={formData.numero}
                        onChange={(e) => handleChange('numero', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                        id="complemento"
                        placeholder="Complemento"
                        value={formData.complemento}
                        onChange={(e) => handleChange('complemento', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                        id="bairro"
                        placeholder="Bairro"
                        value={formData.bairro}
                        onChange={(e) => handleChange('bairro', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                        id="cidade"
                        placeholder="Cidade"
                        value={formData.cidade}
                        onChange={(e) => handleChange('cidade', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                        id="cep"
                        placeholder="CEP"
                        value={formData.cep}
                        onChange={(e) => handleChange('cep', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
  );
};

export default CustomerProfile;
