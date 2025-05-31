
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-fresh-100 text-fresh-700 text-xs px-2 py-1 rounded-full font-medium">
              {product.category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-fresh-600">
                R$ {product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
            </div>
            
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              className="bg-fresh-500 hover:bg-fresh-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
