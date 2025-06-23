
import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onCartClick: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ onCartClick, onLoginClick, onSignUpClick, activeTab, onTabChange }: HeaderProps) => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  // Menu items baseados no tipo de usuário
  const getMenuItems = () => {
    if (!user) return [];
    
    if (user.type === 'USER') {
      return [
        { id: 'profile', label: 'Meu Perfil' },
        { id: 'orders', label: 'Meus Pedidos' },
        { id: 'favorites', label: 'Lojas Favoritas' },
      ];
    } else if (user.type === 'MANAGER') {
      return [
        { id: 'store-profile', label: 'Perfil da Loja' },
        { id: 'sales', label: 'Vendas' },
      ];
    }
    
    return [];
  };

  const userMenuItems = getMenuItems();

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
            {/* Só mostrar checkout para clientes */}
            {(!user || user.type === 'USER') && (
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
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart Button - só para clientes */}
            {(!user || user.type === 'USER') && (
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
            )}

            {/* User Button */}
            {user ? (
              <div className="relative">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="hover:bg-gray-50 border-gray-200 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">{user.name}</span>
                  <span
                      className={`text-xs font-medium px-2 py-1 rounded-md ${
                          user.type === 'USER'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                      }`}
                  >
                    {user.type === 'USER' ? 'Cliente' : 'Loja'}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {userMenuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onTabChange(item.id);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                            activeTab === item.id ? 'bg-fresh-50 text-fresh-700' : 'text-gray-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoginClick}
                  className="hover:bg-fresh-50 border-fresh-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:block">Entrar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSignUpClick}
                  className="hover:bg-fresh-50 border-fresh-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:block">Criar Conta</span>
                </Button>
              </div>
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
              {/* Só mostrar checkout para clientes */}
              {(!user || user.type === 'USER') && (
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
              )}
              
              {user && (
                <>
                  <hr className="my-2" />
                  {userMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-fresh-100 text-fresh-700 font-medium'
                          : 'text-gray-600 hover:text-fresh-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </nav>
        )}

        {/* Click outside to close user menu */}
        {isUserMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
