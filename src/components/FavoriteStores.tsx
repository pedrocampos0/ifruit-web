
import React from 'react';
import { Heart, Store, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const FavoriteStores = () => {
  const { user } = useAuth();
  const { userProfile, addFavoriteStore, removeFavoriteStore } = useUserProfile();

  // Get all registered stores from localStorage
  const getRegisteredStores = () => {
    try {
      const savedProfiles = localStorage.getItem('freshmarket_store_profiles');
      if (savedProfiles) {
        return JSON.parse(savedProfiles);
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar lojas registradas:', error);
      return [];
    }
  };

  const registeredStores = getRegisteredStores();

  const handleToggleFavorite = (storeId: number) => {
    if (!userProfile) return;

    const isFavorite = userProfile.favoriteStores.includes(storeId);
    
    if (isFavorite) {
      removeFavoriteStore(storeId);
      toast({
        title: "Removido dos favoritos",
        description: "A loja foi removida da sua lista de favoritos.",
      });
    } else {
      addFavoriteStore(storeId);
      toast({
        title: "Adicionado aos favoritos",
        description: "A loja foi adicionada à sua lista de favoritos.",
      });
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Faça login para ver suas lojas favoritas.</p>
      </div>
    );
  }

  const favoriteStores = registeredStores.filter(store => 
    userProfile?.favoriteStores.includes(store.id)
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Lojas Favoritas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {favoriteStores.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Você ainda não tem lojas favoritas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteStores.map((store) => (
                <Card key={store.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{store.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(store.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{store.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{store.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Todas as Lojas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {registeredStores.length === 0 ? (
            <div className="text-center py-8">
              <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma loja cadastrada ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registeredStores.map((store) => {
                const isFavorite = userProfile?.favoriteStores.includes(store.id);
                return (
                  <Card key={store.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{store.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFavorite(store.id)}
                          className={isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{store.description}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{store.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{store.phone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoriteStores;
