import React, {useEffect, useState} from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { useCart, Product } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';

const products: Product[] = [
  {
    id: 1,
    name: 'Banana Prata',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
    category: 'Frutas',
    unit: 'kg',
    description: 'Bananas frescas e doces, perfeitas para vitaminas e lanches.'
  },
  {
    id: 2,
    name: 'Alface Americana',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300&h=300&fit=crop',
    category: 'Verduras',
    unit: 'unidade',
    description: 'Alface crocante e fresca, ideal para saladas nutritivas.'
  },
  {
    id: 3,
    name: 'Tomate Cereja',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1570543375343-63fe3d67761b?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Legumes',
    unit: 'bandeja',
    description: 'Tomates cereja doces e suculentos, perfeitos para saladas.'
  },
  {
    id: 4,
    name: 'Maçã Fuji',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&h=300&fit=crop',
    category: 'Frutas',
    unit: 'kg',
    description: 'Maçãs crocantes e saborosas, ricas em vitaminas.'
  },
  {
    id: 5,
    name: 'Cenoura',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop',
    category: 'Legumes',
    unit: 'kg',
    description: 'Cenouras frescas e crocantes, fonte de vitamina A.'
  },
  {
    id: 6,
    name: 'Espinafre Orgânico',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop',
    category: 'Orgânicos',
    unit: 'maço',
    description: 'Espinafre orgânico fresco, rico em ferro e vitaminas.'
  },
  {
    id: 7,
    name: 'Laranja Lima',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop',
    category: 'Frutas',
    unit: 'kg',
    description: 'Laranjas doces e suculentas, perfeitas para sucos.'
  },
  {
    id: 8,
    name: 'Brócolis',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&h=300&fit=crop',
    category: 'Verduras',
    unit: 'kg',
    description: 'Brócolis fresco e nutritivo, rico em vitaminas e minerais.'
  }
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);

  const handleFetchCategories = async () => {
    try {
      const api = useApi();
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
    }
  }

  useEffect(()=> {
    handleFetchCategories();
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
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
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
            />
          </div>
        ))}
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
