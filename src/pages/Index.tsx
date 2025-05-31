
import React, { useState } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Home from '@/components/Home';
import Cart from '@/components/Cart';
import Login from '@/components/Login';
import Checkout from '@/components/Checkout';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleCheckout = () => {
    setActiveTab('checkout');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            onCartClick={handleCartClick}
            onLoginClick={handleLoginClick}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          
          <main>
            {activeTab === 'home' && <Home />}
            {activeTab === 'checkout' && <Checkout />}
          </main>

          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
          />

          {isLoginOpen && (
            <Login onClose={() => setIsLoginOpen(false)} />
          )}

          <Toaster />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default Index;
