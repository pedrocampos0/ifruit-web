
import React, { useState, useEffect } from 'react';
import { Store, Mail, Phone, MapPin, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { toast } from '@/hooks/use-toast';

const StoreProfile = () => {
  const { user } = useAuth();
  const { storeProfile, createStoreProfile, updateStoreProfile } = useUserProfile();
  
  const [formData, setFormData] = useState({
    name: storeProfile?.name || '',
    description: storeProfile?.description || '',
    address: storeProfile?.address || '',
    phone: storeProfile?.phone || '',
    email: storeProfile?.email || user?.email || '',
  });

  // Save store profiles to localStorage
  const saveStoreToLocalStorage = (store: any) => {
    try {
      const existingStores = JSON.parse(localStorage.getItem('freshmarket_store_profiles') || '[]');
      const storeIndex = existingStores.findIndex((s: any) => s.id === store.id);
      
      if (storeIndex >= 0) {
        existingStores[storeIndex] = store;
      } else {
        existingStores.push(store);
      }
      
      localStorage.setItem('freshmarket_store_profiles', JSON.stringify(existingStores));
    } catch (error) {
      console.error('Erro ao salvar loja no localStorage:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (storeProfile) {
      const updatedStore = { ...storeProfile, ...formData };
      updateStoreProfile(formData);
      saveStoreToLocalStorage(updatedStore);
      toast({
        title: "Perfil da loja atualizado!",
        description: "As informações da sua loja foram salvas com sucesso.",
      });
    } else {
      const newStore = {
        ...formData,
        id: Date.now(),
        ownerId: user.id,
      };
      createStoreProfile(formData);
      saveStoreToLocalStorage(newStore);
      toast({
        title: "Loja criada!",
        description: "Sua loja foi criada com sucesso.",
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
            {storeProfile ? 'Perfil da Loja' : 'Criar Loja'}
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
              <Label htmlFor="store-description">Descrição</Label>
              <Input
                id="store-description"
                type="text"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descreva sua loja"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="store-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="store-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="pl-10"
                  placeholder="(00) 00000-0000"
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
              {storeProfile ? (
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
