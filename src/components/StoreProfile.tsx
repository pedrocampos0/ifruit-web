
import React, { useState, useEffect } from 'react';
import { Store, Mail, Phone, MapPin, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {useApi} from "@/hooks/useApi.ts";

const StoreProfile = () => {
  const { user } = useAuth();

  const formatCnpj = (cnpj: number | string): string => {
    const cnpjString = String(cnpj).padStart(14, '0');
    return cnpjString.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
    );
  };

  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: user?.address || '',
    phone: user?.phone || '',
    email: user?.email || user?.email || '',
    cnpj: user?.cnpj ? formatCnpj(user?.cnpj) : '',
    horarioFuncionamento: user?.horarioFuncionamento || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updatedStore = {
      nome: formData.name,
      horarioFuncionamento: formData.horarioFuncionamento,
      endereco: formData.address,
    }
    const api = useApi();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
    try {
      const res = await api.patch(`/loja/${user.id}`, updatedStore, { headers });
      const updateResStore = res.data;
      let localUser = JSON.parse(localStorage.getItem('user'));
      localUser.name = updateResStore.nome;
      localStorage.setItem('user', JSON.stringify(localUser));
      setFormData({
        name: updateResStore.nome,
        address: updateResStore.endereco,
        phone: updateResStore.phone || '',
        email: updateResStore.email || '',
        cnpj: updateResStore.cnpj,
        horarioFuncionamento: updateResStore.horarioFuncionamento,
      });
      toast({
        title: "Perfil da loja atualizado!",
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
        <p className="text-gray-600">Faça login para gerenciar sua loja.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            {user ? 'Perfil da Loja' : 'Criar Loja'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Nome da loja</Label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="store-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="pl-10"
                  placeholder="Nome da sua loja"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-cnpj">CNPJ</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="store-cnpj"
                  type="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  className="pl-10"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-horarioFuncionamento">Horário de funcionamento</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="store-horarioFuncionamento"
                  type="tel"
                  value={formData.horarioFuncionamento}
                  onChange={(e) => handleChange('horarioFuncionamento', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-address">Endereço</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="store-address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="pl-10"
                  placeholder="Endereço completo da loja"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-fresh-500 hover:bg-fresh-600">
              {user ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Loja
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreProfile;
