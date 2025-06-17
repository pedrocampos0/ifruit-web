
import React, { useState } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Home from '@/components/Home';
import Cart from '@/components/Cart';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import Checkout from '@/components/Checkout';
import CustomerProfile from '@/components/CustomerProfile';
import OrderTracking from '@/components/OrderTracking';
import FavoriteStores from '@/components/FavoriteStores';
import StoreProfile from '@/components/StoreProfile';
import SalesTracking from '@/components/SalesTracking';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleSignUpClick = () => {
    setIsSignUpOpen(true);
  };

  const handleCheckout = () => {
    setActiveTab('checkout');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'checkout':
        return <Checkout />;
      case 'profile':
        return <CustomerProfile />;
      case 'orders':
        return <OrderTracking />;
      case 'favorites':
        return <FavoriteStores />;
      case 'store-profile':
        return <StoreProfile />;
      case 'sales':
        return <SalesTracking />;
      default:
        return <Home />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            onCartClick={handleCartClick}
            onLoginClick={handleLoginClick}
            onSignUpClick={handleSignUpClick}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <main>
            {renderContent()}
          </main>

          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
          />

          {isLoginOpen && (
            <Login onClose={() => setIsLoginOpen(false)} />
          )}

          {isSignUpOpen && (
            <SignUp onClose={() => setIsSignUpOpen(false)} />
          )}

          <Toaster />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default Index;
