
import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onCartClick: () => void;
  onLoginClick: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ onCartClick, onLoginClick, activeTab, onTabChange }: HeaderProps) => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-fresh-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🥬</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Fresh<span className="text-fresh-600">Market</span>
            </h1>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onTabChange('home')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'bg-fresh-100 text-fresh-700 font-medium'
                  : 'text-gray-600 hover:text-fresh-600'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => onTabChange('checkout')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'checkout'
                  ? 'bg-fresh-100 text-fresh-700 font-medium'
                  : 'text-gray-600 hover:text-fresh-600'
              }`}
            >
              Checkout
            </button>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onCartClick}
              className="relative hover:bg-fresh-50 border-fresh-200"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:block text-sm text-gray-600">Olá, {user.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="hover:bg-red-50 border-red-200 text-red-600"
                >
                  Sair
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onLoginClick}
                className="hover:bg-fresh-50 border-fresh-200"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:block">Entrar</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onTabChange('home');
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'home'
                    ? 'bg-fresh-100 text-fresh-700 font-medium'
                    : 'text-gray-600 hover:text-fresh-600'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => {
                  onTabChange('checkout');
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'checkout'
                    ? 'bg-fresh-100 text-fresh-700 font-medium'
                    : 'text-gray-600 hover:text-fresh-600'
                }`}
              >
                Checkout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
