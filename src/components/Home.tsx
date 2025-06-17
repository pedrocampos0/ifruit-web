import React, {useCallback, useEffect, useState} from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { useCart, Product } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';
import { Skeleton } from '@mui/material';
import ProductCardSkeleton from "@/components/ProductCartSkeleton.tsx";


const images: { [key: string]: string } = {
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
  'alface': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300&h=300&fit=crop',
  'tomate_cereja': 'https://images.unsplash.com/photo-1570543375343-63fe3d67761b?w=300&h=300&fit=crop',
  'maca_fuji': 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&h=300&fit=crop',
  'cenoura': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop',
  'espinafre_organico': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop',
  'laranja lima': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop',
  'brocolis': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&h=300&fit=crop',
};
const defaultImage = 'https://images.unsplash.com/photo-1576186737222-ac14d4dec559?w=300&h=300&fit=crop';

const Home = () => {
  const api = useApi();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categorias');
      let aux = ['Todos'];
      for (const category of response.data) {
        aux.push(category.nome);
      }
      setCategories(aux);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as categorias.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleFetchProducts = async (category: string) => {
    try {
      setLoading(true);
      const response = await api.get(`produtos?categoria=${category}`,);
      const productsWithImages = response.data.map((product: any) => ({
        id: product.id,
        name: product.nome,
        price: product.preco,
        category: product.categoria.nome,
        unit: 'kg',
        description: product.nome+' frescas e de alta qualidade.',
        image: images[product?.nome?.toLowerCase()] || defaultImage,
      }));
      setProducts(productsWithImages);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> {
    handleFetchCategories();
  }, [])

  useEffect(()=> {
    for (const c of categories) {
      if (c !== 'Todos'){
        handleFetchProducts(c);
      }
    }
  }, [categories])

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const filteredProducts = products?.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-fresh-500 to-orange-500 rounded-2xl p-8 mb-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            Produtos Frescos
            <br />
            <span className="text-fresh-100">Direto do Campo</span>
          </h1>
          <p className="text-xl text-fresh-100">
            Descubra os melhores produtos orgânicos e frescos, entregues na sua porta com qualidade garantida.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-fresh-500 hover:bg-fresh-600"
                    : "hover:bg-fresh-50 border-fresh-200"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
            Array.from(new Array(3)).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))
        ) : (
            filteredProducts.map((product, index) => (
                <div
                    key={product.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                  />
                </div>
            ))
        )}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar os filtros ou buscar por outros termos.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
